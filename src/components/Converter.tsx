import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploadSection from "./FileUploadSection";
import CodePasteSection from "./CodePasteSection";
import ConversionSteps from "./ConversionSteps";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import Prism from "prismjs";

interface ConversionResult {
  convertedCode: string;
  fileName: string;
  logs: string[];
}

const Converter = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [conversionResults]);

  const convertCode = async (code: string, fileName: string): Promise<ConversionResult> => {
    // Simulate conversion delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const logs: string[] = [];
    let convertedCode = code;
    
    // Log conversion steps
    logs.push(`Analyzing ${fileName}...`);
    
    // Package.json conversion
    if (fileName === "package.json") {
      try {
        const packageJson = JSON.parse(code);
        logs.push("Converting package.json...");
        
        // Remove Next.js dependencies
        if (packageJson.dependencies?.next) {
          delete packageJson.dependencies.next;
          logs.push("✅ Removed Next.js dependency");
        }
        
        // Add Vite dependencies
        if (!packageJson.dependencies) packageJson.dependencies = {};
        if (!packageJson.devDependencies) packageJson.devDependencies = {};
        
        packageJson.devDependencies["vite"] = "^5.0.0";
        packageJson.devDependencies["@vitejs/plugin-react"] = "^4.2.0";
        logs.push("✅ Added Vite dependencies");
        
        // Update scripts
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
      
      // Replace Next.js imports
      convertedCode = convertedCode.replace("import '../styles/globals.css'", "import './index.css'");
      convertedCode = convertedCode.replace(/import\s+(?:type\s+)?{\s*AppProps\s*}\s+from\s+['"]next\/app['"]/g, "");
      
      // Replace function signature
      convertedCode = convertedCode.replace(/function\s+MyApp\(\s*{\s*Component\s*,\s*pageProps\s*}\s*:?\s*AppProps\s*\)/g, 
        "function App()");
      convertedCode = convertedCode.replace(/const\s+MyApp\s*=\s*\(\s*{\s*Component\s*,\s*pageProps\s*}\s*:?\s*AppProps\s*\)\s*=>/g, 
        "const App = () =>");
      
      // Replace return
      convertedCode = convertedCode.replace(/<Component\s+{...pageProps}\s*\/>/g, "<Router><Routes><Route path=\"/\" element={<Home />} /></Routes></Router>");
      
      // Add React imports
      if (!convertedCode.includes("react-router-dom")) {
        convertedCode = `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\nimport Home from './pages/Home';\n${convertedCode}`;
      }
      
      // Fix export name
      convertedCode = convertedCode.replace(/export\s+default\s+MyApp/, "export default App");
      
      logs.push("✅ Converted _app file to Vite main component");
    }
    
    // Page components
    if (fileName.includes("pages/") && !fileName.includes("_app") && !fileName.includes("api/")) {
      logs.push("Converting Next.js page component...");
      
      // Replace Next.js data fetching
      convertedCode = convertedCode.replace(/export\s+async\s+function\s+getStaticProps.*?return\s+{(.|\n)*?props\s*:\s*{(.|\n)*?}\s*(.|\n)*?}\s*}\s*/g, "");
      convertedCode = convertedCode.replace(/export\s+async\s+function\s+getServerSideProps.*?return\s+{(.|\n)*?props\s*:\s*{(.|\n)*?}\s*(.|\n)*?}\s*}\s*/g, "");
      
      // Add useState and useEffect for handling data fetching
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
        
        // Add data fetching logic
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
          
          // Find where to insert the data fetching code
          const functionBodyStart = convertedCode.indexOf("{", convertedCode.indexOf(componentName));
          if (functionBodyStart !== -1) {
            const insertPosition = convertedCode.indexOf("\n", functionBodyStart) + 1;
            convertedCode = convertedCode.slice(0, insertPosition) + dataFetchingCode + convertedCode.slice(insertPosition);
          }
        }
        
        logs.push("✅ Converted Next.js data fetching to React hooks");
      }
      
      // Replace Next.js Image component
      convertedCode = convertedCode.replace(/import\s+Image\s+from\s+['"]next\/image['"]/g, "");
      convertedCode = convertedCode.replace(/<Image\s+src=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)(?:\s+[^>]*)?>/g, 
        "<img src=$1 $2 $3 $4 />");
      convertedCode = convertedCode.replace(/<Image\s+src=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)(?:\s+[^>]*)?>/g, 
        "<img src=$1 $2 $3 />");
      convertedCode = convertedCode.replace(/<Image\s+src=([^\s>]+)\s+(?:alt|width|height)=([^\s>]+)(?:\s+[^>]*)?>/g, 
        "<img src=$1 $2 />");
      
      logs.push("✅ Converted Next.js Image components to standard img tags");
      
      // Replace Next.js Link component
      convertedCode = convertedCode.replace(/import\s+Link\s+from\s+['"]next\/link['"]/g, "import { Link } from 'react-router-dom';");
      convertedCode = convertedCode.replace(/<Link\s+href=(['"])([^'"]*)\1(?:\s+[^>]*)?>((?:.|\n)*?)<\/Link>/g, (_, quote, path, children) => {
        // Convert Next.js paths to react-router-dom paths
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

  const handleFileUpload = async (files: File[]) => {
    const filePromises = files.map((file) => {
      return new Promise<{ content: string; name: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            content: e.target?.result as string,
            name: file.name,
          });
        };
        reader.readAsText(file);
      });
    });

    const fileContents = await Promise.all(filePromises);
    setIsConverting(true);
    const results: ConversionResult[] = [];

    for (const { content, name } of fileContents) {
      const result = await convertCode(content, name);
      results.push(result);
    }

    setConversionResults(results);
    setIsConverting(false);
  };

  const handleCodePaste = async (code: string, fileName: string) => {
    setIsConverting(true);
    const result = await convertCode(code, fileName);
    setConversionResults([result]);
    setIsConverting(false);
  };

  const handleDownloadAll = () => {
    conversionResults.forEach((result) => {
      const blob = new Blob([result.convertedCode], { type: "text/plain;charset=utf-8" });
      saveAs(blob, result.fileName);
    });
  };

  const handleDownloadSingle = (code: string, fileName: string) => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    saveAs(blob, fileName);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Fájl feltöltés</TabsTrigger>
          <TabsTrigger value="paste">Kód beillesztés</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="pt-4">
          <FileUploadSection 
            onFilesReceived={handleFileUpload}
            isConverting={isConverting}
          />
        </TabsContent>

        <TabsContent value="paste" className="pt-4">
          <CodePasteSection 
            onCodeSubmit={handleCodePaste}
            isConverting={isConverting}
          />
        </TabsContent>
      </Tabs>

      {conversionResults.length > 0 && (
        <div className="space-y-6 mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Konvertálási eredmény</h2>
            <Button onClick={handleDownloadAll}>Összes letöltése</Button>
          </div>

          <div className="space-y-8">
            {conversionResults.map((result, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 flex items-center justify-between">
                  <h3 className="font-medium">{result.fileName}</h3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownloadSingle(result.convertedCode, result.fileName)}
                  >
                    Letöltés
                  </Button>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="bg-gray-50 p-4 rounded border">
                    <h4 className="font-medium mb-2">Konverziós lépések</h4>
                    <ul className="text-sm space-y-1">
                      {result.logs.map((log, logIndex) => (
                        <li key={logIndex} className={`
                          ${log.startsWith("✅") ? "text-green-600" : ""}
                          ${log.startsWith("❌") ? "text-red-600" : ""}
                          ${log.startsWith("⚠️") ? "text-amber-600" : ""}
                          ${log.startsWith("ℹ️") ? "text-blue-600" : ""}
                        `}>
                          {log}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-900 rounded overflow-hidden">
                    <pre className="p-4 overflow-x-auto text-sm">
                      <code className="language-typescript">{result.convertedCode}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!conversionResults.length && !isConverting && (
        <ConversionSteps />
      )}
    </div>
  );
};

export default Converter;
