
export interface ConversionResult {
  convertedCode: string;
  fileName: string;
  logs: string[];
  complexityScore?: number; // 1-10 scale of conversion difficulty
  compatibilityIssues?: string[]; // List of potential issues
}

export interface AnalysisResult {
  complexityScore: number;
  compatibilityIssues: string[];
  features: {
    hasRouting: boolean;
    hasApiRoutes: boolean;
    hasGetStaticProps: boolean;
    hasGetServerSideProps: boolean;
    hasNextImage: boolean;
    hasNextLink: boolean;
    hasMiddleware: boolean;
    hasI18n: boolean;
  };
}
