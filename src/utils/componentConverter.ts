
import { ConversionResult } from "@/types/converter";
import { analyzeCode } from "./codeAnalyzer";

export const convertComponent = (code: string, fileName: string): ConversionResult => {
  const logs: string[] = [];
  let convertedCode = code;
  
  const analysis = analyzeCode(code, fileName);
  logs.push(`Analyzing ${fileName}...`);
  
  if (fileName.includes("_app.")) {
    logs.push("Converting Next.js _app file to Vite main entry...");
    
    convertedCode = convertedCode.replace("import '../styles/globals.css'", "import './index.css'");
    convertedCode = convertedCode.replace(/import\s+(?:type\s+)?{\s*AppProps\s*}\s+from\s+['"]next\/app['"]/g, "");
    
    convertedCode = convertedCode.replace(/function\s+MyApp\(\s*{\s*Component\s*,\s*pageProps\s*}\s*:?\s*AppProps\s*\)/g, 
      "function App()");
    convertedCode = convertedCode.replace(/const\s+MyApp\s*=\s*\(\s*{\s*Component\s*,\s*pageProps\s*}\s*:?\s*AppProps\s*\)\s*=>/g, 
      "const App = () =>");
    
    convertedCode = convertedCode.replace(/<Component\s+{...pageProps}\s*\/>/g, 
      "<Router><Routes><Route path=\"/\" element={<Home />} /></Routes></Router>");
    
    if (!convertedCode.includes("react-router-dom")) {
      convertedCode = `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\nimport Home from './pages/Home';\n${convertedCode}`;
    }
    
    convertedCode = convertedCode.replace(/export\s+default\s+MyApp/, "export default App");
    
    logs.push("✅ Converted _app file to Vite main component");
  } else if (fileName.includes("pages/") && !fileName.includes("_app") && !fileName.includes("api/")) {
    logs.push("Converting Next.js page component...");
    
    // Remove Next.js data fetching methods
    convertedCode = convertedCode.replace(/export\s+async\s+function\s+getStaticProps.*?return\s+{(.|\n)*?props\s*:\s*{(.|\n)*?}\s*(.|\n)*?}\s*}\s*/g, "");
    convertedCode = convertedCode.replace(/export\s+async\s+function\s+getServerSideProps.*?return\s+{(.|\n)*?props\s*:\s*{(.|\n)*?}\s*(.|\n)*?}\s*}\s*/g, "");
    
    // Add React hooks if needed
    if (analysis.features.hasGetStaticProps || analysis.features.hasGetServerSideProps) {
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
    }
    
    // Convert Next.js Image components
    convertedCode = convertedCode.replace(/import\s+Image\s+from\s+['"]next\/image['"]/g, "");
    convertedCode = convertedCode.replace(/<Image\s+src=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)(?:\s+[^>]*)?>/g, 
      "<img src=$1 $2 $3 $4 />");
    convertedCode = convertedCode.replace(/<Image\s+src=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)(?:\s+[^>]*)?>/g, 
      "<img src=$1 $2 $3 />");
    convertedCode = convertedCode.replace(/<Image\s+src=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)(?:\s+[^>]*)?>/g, 
      "<img src=$1 $2 />");
    
    // Convert Next.js Link components
    convertedCode = convertedCode.replace(/import\s+Link\s+from\s+['"]next\/link['"]/g, 
      "import { Link } from 'react-router-dom';");
    convertedCode = convertedCode.replace(/<Link\s+href=(['"])([^'"]*)\1(?:\s+[^>]*)?>((?:.|\n)*?)<\/Link>/g, 
      (_, quote, path, children) => {
        let routerPath = path;
        if (routerPath.startsWith("/")) {
          routerPath = routerPath.replace(/\/\[([^\]]+)\]/g, "/:$1");
        }
        return `<Link to=${quote}${routerPath}${quote}>${children}</Link>`;
      });
    
    logs.push("✅ Converted page component");
  }

  return {
    convertedCode,
    fileName,
    logs,
    complexityScore: analysis.complexityScore,
    compatibilityIssues: analysis.compatibilityIssues
  };
};
