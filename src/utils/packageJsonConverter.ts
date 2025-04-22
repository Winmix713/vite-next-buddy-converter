
import { ConversionResult } from "@/types/converter";

export const convertPackageJson = (code: string): ConversionResult => {
  const logs: string[] = [];
  let convertedCode = code;
  
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

  return {
    convertedCode,
    fileName: "package.json",
    logs
  };
};
