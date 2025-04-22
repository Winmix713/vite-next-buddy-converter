
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import { type ConversionResult } from "@/types/converter";
import { useEffect } from "react";
import Prism from "prismjs";

interface ConversionResultsProps {
  results: ConversionResult[];
  onDownloadAll: () => void;
}

const ConversionResults = ({ results, onDownloadAll }: ConversionResultsProps) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [results]);

  const handleDownloadSingle = (code: string, fileName: string) => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    saveAs(blob, fileName);
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Konvertálási eredmény</h2>
        <Button onClick={onDownloadAll}>Összes letöltése</Button>
      </div>

      <div className="space-y-8">
        {results.map((result, index) => (
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
  );
};

export default ConversionResults;
