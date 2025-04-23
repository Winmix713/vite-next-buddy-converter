
import * as babelParser from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

export interface ComponentUsageStats {
  used: boolean;
  count: number;
}

/**
 * Egy fájl tartalmát elemzi, hogy meghatározza a Next.js komponensek használatát.
 *
 * @param content - A fájl tartalma, amit elemezni kell.
 * @param componentType - A keresett Next.js komponens típusa (pl.: "image", "link").
 * @returns ComponentUsageStats objektum, amely tartalmazza a használati állapotot és a számlálást.
 */
export function analyzeComponentUsage(content: string, componentType: string): ComponentUsageStats {
  // AST (Abstract Syntax Tree) generálása a fájl tartalmából
  const ast = babelParser.parse(content, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const imports: Set<string> = new Set();
  let count = 0;

  // A TypeScript error kezelése: a bábel típusok közötti kompatibilitási problémára
  // Safe traversal implementation
  const safeTraverse = (ast: any, visitor: any) => {
    try {
      traverse(ast, visitor);
    } catch (error) {
      console.warn("Traverse error:", error);
    }
  };

  safeTraverse(ast, {
    // Next.js komponensek importjának követése
    ImportDeclaration(path) {
      const source = path.node.source.value;
      if (source === `next/${componentType}`) {
        path.node.specifiers.forEach((specifier: any) => {
          if (specifier.type === "ImportSpecifier" || specifier.type === "ImportDefaultSpecifier") {
            imports.add(specifier.local.name);
          }
        });
      }
    },
    // JSX tag-ek használatának számlálása
    JSXIdentifier(path) {
      if (imports.has(path.node.name)) {
        count++;
      }
    },
    // Függvényhívások számlálása (pl.: dynamic())
    CallExpression(path) {
      if (
        componentType === "dynamic" && 
        path.node.callee && 
        path.node.callee.type === "Identifier" && 
        path.node.callee.name === "dynamic"
      ) {
        count++;
      }
    },
  });

  return {
    used: count > 0,
    count,
  };
}
