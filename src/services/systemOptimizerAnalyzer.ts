import { SystemAnalysisResult, analyzeSystem } from "./systemAnalyzer";
import { ComponentStatus } from "@/types/componentStatus";

interface CodeStructure {
  components: ComponentStatus[];
  dependencies: string[];
  routes: string[];
}

export class SystemOptimizerAnalyzer {
  private systemAnalysis: SystemAnalysisResult;

  constructor() {
    this.systemAnalysis = analyzeSystem();
  }

  analyzePerformance(): { score: number; recommendations: string[] } {
    const memoryUsage = this.systemAnalysis.memoryUsage;
    const memoryUtilization = memoryUsage.used / memoryUsage.total;
    
    const recommendations: string[] = [];
    let score = 100;
    
    if (memoryUtilization > 0.8) {
      score -= 20;
      recommendations.push("High memory usage detected. Consider optimizing memory-intensive operations.");
    }
    
    if (this.systemAnalysis.cpuInfo.cores < 4) {
      score -= 10;
      recommendations.push("Limited CPU cores available. Parallel processing might be slower.");
    }
    
    return {
      score,
      recommendations
    };
  }
  
  optimizeCodeStructure(structure: CodeStructure): { 
    optimizedComponents: ComponentStatus[];
    unusedDependencies: string[];
    recommendations: string[];
  } {
    const optimizedComponents = [...structure.components];
    const unusedDependencies: string[] = [];
    const recommendations: string[] = [];
    
    // Find unused components
    const unusedComponents = optimizedComponents.filter(comp => !comp.isUsed);
    if (unusedComponents.length > 0) {
      recommendations.push(`Found ${unusedComponents.length} unused components that can be removed.`);
    }
    
    // Check for duplicate routes
    const routePaths = structure.routes.map(route => route.split(' ')[0]);
    const duplicateRoutes = routePaths.filter((route, index) => routePaths.indexOf(route) !== index);
    if (duplicateRoutes.length > 0) {
      recommendations.push(`Found ${duplicateRoutes.length} duplicate routes that should be consolidated.`);
    }
    
    // Analyze dependencies
    structure.dependencies.forEach(dep => {
      if (!dep.includes('@') || dep.startsWith('dev-')) {
        unusedDependencies.push(dep);
      }
    });
    
    return {
      optimizedComponents,
      unusedDependencies,
      recommendations
    };
  }
  
  generateOptimizationReport(): string {
    const performance = this.analyzePerformance();
    
    return `
      # System Optimization Report
      
      ## Performance Analysis
      - Score: ${performance.score}/100
      - Node Version: ${this.systemAnalysis.nodeVersion}
      - OS: ${this.systemAnalysis.osType}
      - CPU: ${this.systemAnalysis.cpuInfo.model} (${this.systemAnalysis.cpuInfo.cores} cores)
      - Memory: ${this.systemAnalysis.memoryUsage.used}MB / ${this.systemAnalysis.memoryUsage.total}MB
      
      ## Recommendations
      ${performance.recommendations.map(rec => `- ${rec}`).join('\n')}
      
      ## Next Steps
      1. Review the recommendations above
      2. Implement memory optimizations if needed
      3. Consider upgrading hardware if performance is critical
    `;
  }
}
