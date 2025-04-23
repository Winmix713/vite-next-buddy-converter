
export interface BabelCompatNode {
  type: string;
  start?: number;
  end?: number;
  loc?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export interface TransformResult {
  code: string;
  changes: string[];
  warnings: string[];
}

export interface AstTransformOptions {
  preserveComments?: boolean;
  targetSyntax?: 'typescript' | 'javascript';
}
