
import { ConversionResult } from "@/types/converter";
import { analyzeCode } from "./codeAnalyzer";
import { convertPackageJson } from "./packageJsonConverter";
import { convertComponent } from "./componentConverter";

export { analyzeCode } from "./codeAnalyzer";

export const convertCode = async (code: string, fileName: string): Promise<ConversionResult> => {
  // Simulate conversion delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (fileName === "package.json") {
    return convertPackageJson(code);
  }

  return convertComponent(code, fileName);
};
