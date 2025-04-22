
import { useState } from "react";
import { saveAs } from "file-saver";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploadSection from "./FileUploadSection";
import CodePasteSection from "./CodePasteSection";
import ConversionSteps from "./ConversionSteps";
import ConversionResults from "./ConversionResults";
import { convertCode } from "@/utils/codeConverter";
import type { ConversionResult } from "@/types/converter";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";

const Converter = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([]);
  const [isConverting, setIsConverting] = useState(false);

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

      {conversionResults.length > 0 ? (
        <ConversionResults 
          results={conversionResults}
          onDownloadAll={handleDownloadAll}
        />
      ) : !isConverting && (
        <ConversionSteps />
      )}
    </div>
  );
};

export default Converter;
