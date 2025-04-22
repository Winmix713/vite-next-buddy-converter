
import { useDropzone } from "react-dropzone";
import { Upload, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FileUploadSectionProps {
  onFilesReceived: (files: File[]) => void;
  isConverting: boolean;
}

const FileUploadSection = ({ onFilesReceived, isConverting }: FileUploadSectionProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesReceived,
    multiple: true,
    accept: {
      "text/javascript": [".js", ".jsx", ".ts", ".tsx"],
      "application/json": [".json"],
    },
  });

  return (
    <Card className="p-6">
      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-lg 
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'} 
          transition-colors duration-200
        `}
      >
        <input {...getInputProps()} />
        <div className="cursor-pointer text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive ? "Engedd el a fájlokat..." : "Húzd ide a Next.js fájljaidat"}
              </p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Támogatott fájltípusok: .js, .jsx, .ts, .tsx, .json
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                disabled={isConverting}
              >
                <File className="mr-2" />
                Fájlok kiválasztása
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FileUploadSection;
