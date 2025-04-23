
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  isAnalyzing: boolean;
}

const FileUploader = ({ onFilesSelected, isAnalyzing }: FileUploaderProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      onFilesSelected(files);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      if (newFiles.length > 0) {
        onFilesSelected(newFiles);
        toast({
          title: "Files Selected",
          description: `${newFiles.length} files selected for analysis.`,
        });
      }
    }
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="h-10 w-10 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500 mb-4">
        Drag & drop your project files or click to browse
      </p>
      <input
        type="file"
        id="file-upload"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button 
          variant="outline" 
          size="sm" 
          className="cursor-pointer"
          disabled={isAnalyzing}
        >
          Select Files
        </Button>
      </label>
    </div>
  );
};

export default FileUploader;
