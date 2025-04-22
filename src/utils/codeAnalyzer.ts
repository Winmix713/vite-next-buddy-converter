
import { AnalysisResult } from "@/types/converter";

export const analyzeCode = (code: string, fileName: string): AnalysisResult => {
  const issues: string[] = [];
  let complexityScore = 1;
  
  const features = {
    hasRouting: fileName.includes("pages/") || fileName.includes("app/"),
    hasApiRoutes: fileName.includes("api/"),
    hasGetStaticProps: code.includes("getStaticProps"),
    hasGetServerSideProps: code.includes("getServerSideProps"),
    hasNextImage: code.includes("next/image"),
    hasNextLink: code.includes("next/link"),
    hasMiddleware: code.includes("middleware") || fileName.includes("middleware"),
    hasI18n: code.includes("next-i18next") || code.includes("next/router") && code.includes("locale"),
  };
  
  if (features.hasApiRoutes) {
    complexityScore += 2;
    issues.push("API routes need to be reimplemented as a separate backend service");
  }
  
  if (features.hasGetStaticProps || features.hasGetServerSideProps) {
    complexityScore += 2;
    issues.push("Data fetching methods need to be converted to React hooks");
  }
  
  if (features.hasMiddleware) {
    complexityScore += 3;
    issues.push("Middleware functionality requires custom implementation in Vite");
  }
  
  if (features.hasI18n) {
    complexityScore += 2;
    issues.push("Internationalization needs to be reimplemented with i18next or similar");
  }
  
  if (code.includes("next/dynamic")) {
    complexityScore += 1;
    issues.push("Dynamic imports need to be converted to React.lazy");
  }
  
  if (code.includes("next/head")) {
    complexityScore += 1;
    issues.push("Head management needs to be replaced with React Helmet or similar");
  }
  
  if (code.includes("getInitialProps")) {
    complexityScore += 2;
    issues.push("Legacy getInitialProps needs to be converted to React hooks");
  }
  
  complexityScore = Math.min(complexityScore, 10);
  
  return {
    complexityScore,
    compatibilityIssues: issues,
    features,
  };
};
