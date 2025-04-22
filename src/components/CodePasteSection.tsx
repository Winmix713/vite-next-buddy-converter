
import { useState } from "react";
import { Code, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface CodePasteSectionProps {
  onCodeSubmit: (code: string, fileName: string) => void;
  isConverting: boolean;
}

const CodePasteSection = ({ onCodeSubmit, isConverting }: CodePasteSectionProps) => {
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSubmit = () => {
    if (!code || !fileName) return;
    onCodeSubmit(code, fileName);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Code className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Kód beillesztése</h3>
            <p className="text-sm text-muted-foreground">
              Másold be a Next.js kódot és add meg a fájl nevét
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fileName">Fájlnév</Label>
            <div className="flex gap-2">
              <Input
                id="fileName"
                placeholder="my-component.tsx"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const extension = fileName.includes(".") ? "" : ".tsx";
                  setFileName(fileName + extension);
                }}
                disabled={!fileName || fileName.includes(".")}
              >
                .tsx
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Kód</Label>
            <Textarea
              id="code"
              placeholder="Illeszd be a Next.js kódot ide..."
              className="min-h-[300px] font-mono text-sm"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.readText().then(setCode)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Beillesztés vágólapról
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!code || !fileName || isConverting}
            >
              {isConverting ? "Konvertálás..." : "Konvertálás"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CodePasteSection;
