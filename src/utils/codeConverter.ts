
export const convertCode = async (code: string, fileName: string) => {
  // Simulate conversion delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const logs: string[] = [];
  let convertedCode = code;
  
  logs.push(`Analyzing ${fileName}...`);
  
  // Package.json conversion
  if (fileName === "package.json") {
    try {
      const packageJson = JSON.parse(code);
      logs.push("Converting package.json...");
      
      if (packageJson.dependencies?.next) {
        delete packageJson.dependencies.next;
        logs.push("✅ Removed Next.js dependency");
      }
      
      if (!packageJson.dependencies) packageJson.dependencies = {};
      if (!packageJson.devDependencies) packageJson.devDependencies = {};
      
      packageJson.devDependencies["vite"] = "^5.0.0";
      packageJson.devDependencies["@vitejs/plugin-react"] = "^4.2.0";
      logs.push("✅ Added Vite dependencies");
      
      if (!packageJson.scripts) packageJson.scripts = {};
      const hasDevScript = !!packageJson.scripts.dev;
      const hasBuildScript = !!packageJson.scripts.build;
      
      packageJson.scripts.dev = "vite";
      packageJson.scripts.build = "vite build";
      packageJson.scripts.preview = "vite preview";
      
      logs.push(`${hasDevScript ? "✅ Updated" : "✅ Added"} dev script`);
      logs.push(`${hasBuildScript ? "✅ Updated" : "✅ Added"} build script`);
      logs.push("✅ Added preview script");
      
      convertedCode = JSON.stringify(packageJson, null, 2);
    } catch (error) {
      logs.push("❌ Error processing package.json");
      logs.push(String(error));
    }
  }
  
  // _app.js/.tsx conversion
  if (fileName.includes("_app.")) {
    logs.push("Converting Next.js _app file to Vite main entry...");
    
    convertedCode = convertedCode.replace("import '../styles/globals.css'", "import './index.css'");
    convertedCode = convertedCode.replace(/import\s+(?:type\s+)?{\s*AppProps\s*}\s+from\s+['"]next\/app['"]/g, "");
    
    convertedCode = convertedCode.replace(/function\s+MyApp\(\s*{\s*Component\s*,\s*pageProps\s*}\s*:?\s*AppProps\s*\)/g, 
      "function App()");
    convertedCode = convertedCode.replace(/const\s+MyApp\s*=\s*\(\s*{\s*Component\s*,\s*pageProps\s*}\s*:?\s*AppProps\s*\)\s*=>/g, 
      "const App = () =>");
    
    convertedCode = convertedCode.replace(/<Component\s+{...pageProps}\s*\/>/g, "<Router><Routes><Route path=\"/\" element={<Home />} /></Routes></Router>");
    
    if (!convertedCode.includes("react-router-dom")) {
      convertedCode = `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\nimport Home from './pages/Home';\n${convertedCode}`;
    }
    
    convertedCode = convertedCode.replace(/export\s+default\s+MyApp/, "export default App");
    
    logs.push("✅ Converted _app file to Vite main component");
  }
  
  // Page components
  if (fileName.includes("pages/") && !fileName.includes("_app") && !fileName.includes("api/")) {
    logs.push("Converting Next.js page component...");
    
    convertedCode = convertedCode.replace(/export\s+async\s+function\s+getStaticProps.*?return\s+{(.|\n)*?props\s*:\s*{(.|\n)*?}\s*(.|\n)*?}\s*}\s*/g, "");
    convertedCode = convertedCode.replace(/export\s+async\s+function\s+getServerSideProps.*?return\s+{(.|\n)*?props\s*:\s*{(.|\n)*?}\s*(.|\n)*?}\s*}\s*/g, "");
    
    if (convertedCode.includes("getStaticProps") || convertedCode.includes("getServerSideProps")) {
      if (!convertedCode.includes("useState")) {
        convertedCode = convertedCode.replace(/import\s+React(?:,\s*{\s*([^}]*)\s*})?\s+from\s+['"]react['"]/g, (match, imports) => {
          if (imports) {
            if (!imports.includes("useState") && !imports.includes("useEffect")) {
              return `import React, { ${imports}, useState, useEffect } from 'react'`;
            }
            return match;
          }
          return `import React, { useState, useEffect } from 'react'`;
        });
        
        if (!convertedCode.includes("import React")) {
          convertedCode = `import React, { useState, useEffect } from 'react';\n${convertedCode}`;
        }
      }
      
      const componentMatch = convertedCode.match(/(?:function|const)\s+(\w+)(?:\s*=\s*\()?/);
      if (componentMatch && componentMatch[1]) {
        const componentName = componentMatch[1];
        const dataFetchingCode = `
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace this with your actual data fetching logic
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
`;
        
        const functionBodyStart = convertedCode.indexOf("{", convertedCode.indexOf(componentName));
        if (functionBodyStart !== -1) {
          const insertPosition = convertedCode.indexOf("\n", functionBodyStart) + 1;
          convertedCode = convertedCode.slice(0, insertPosition) + dataFetchingCode + convertedCode.slice(insertPosition);
        }
      }
      
      logs.push("✅ Converted Next.js data fetching to React hooks");
    }
    
    convertedCode = convertedCode.replace(/import\s+Image\s+from\s+['"]next\/image['"]/g, "");
    convertedCode = convertedCode.replace(/<Image\s+src=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)(?:\s+[^>]*)?>/g, 
      "<img src=$1 $2 $3 $4 />");
    convertedCode = convertedCode.replace(/<Image\s+src=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)(?:\s+[^>]*)?>/g, 
      "<img src=$1 $2 $3 />");
    convertedCode = convertedCode.replace(/<Image\s+src=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)(?:\s+[^>]*)?>/g, 
      "<img src=$1 $2 />");
    
    logs.push("✅ Converted Next.js Image components to standard img tags");
    
    convertedCode = convertedCode.replace(/import\s+Link\s+from\s+['"]next\/link['"]/g, "import { Link } from 'react-router-dom';");
    convertedCode = convertedCode.replace(/<Link\s+href=(['"])([^'"]*)\1(?:\s+[^>]*)?>((?:.|\n)*?)<\/Link>/g, (_, quote, path, children) => {
      let routerPath = path;
      if (routerPath.startsWith("/")) {
        routerPath = routerPath.replace(/\/\[([^\]]+)\]/g, "/:$1");
      }
      return `<Link to=${quote}${routerPath}${quote}>${children}</Link>`;
    });
    
    logs.push("✅ Converted Next.js Link components to react-router-dom Links");
  }
  
  // API routes conversion
  if (fileName.includes("api/")) {
    logs.push("Converting Next.js API route...");
    logs.push("ℹ️ API routes need to be implemented separately in a backend service");
    
    const apiName = fileName.replace(/^.*api\//, "").replace(/\.\w+$/, "");
    
    convertedCode = `// This Next.js API route needs to be implemented as a separate backend endpoint
// Original file: ${fileName}

/*
 * For Vite projects, you'll need to set up a backend service.
 * Options include:
 * 1. Create an Express.js server
 * 2. Use Firebase/Supabase/similar services
 * 3. Deploy serverless functions (Vercel/Netlify/AWS Lambda)
 */

// Example implementation with Express:
/*
const express = require('express');
const router = express.Router();

router.get('/${apiName}', (req, res) => {
  // Your API logic here, converted from the Next.js handler
  res.json({ message: 'API response' });
});

module.exports = router;
*/
`;
    
    logs.push("⚠️ Created API route implementation guide");
  }
  
  return {
    convertedCode,
    fileName: fileName.replace(/^pages\//, "components/").replace(/_app\.tsx$/, "App.tsx"),
    logs,
  };
};
