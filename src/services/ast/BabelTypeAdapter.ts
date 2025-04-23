
import * as t from '@babel/types';
import { Node, NodePath } from '@babel/traverse';

// Define the BabelCompatNode interface
interface BabelCompatNode {
  type: string;
  // Add other Node properties
}

export class BabelTypeAdapter {
  static adaptNode(node: Node | null | undefined): BabelCompatNode | null {
    if (!node) return null;
    return {
      ...node,
      type: node.type || 'Unknown'
    };
  }

  static createIdentifier(name: string): t.Identifier {
    return t.identifier(name);
  }

  static createMemberExpression(object: string | t.Expression, property: string | t.Expression): t.MemberExpression {
    const objExpr = typeof object === 'string' ? t.identifier(object) : object;
    const propExpr = typeof property === 'string' ? t.identifier(property) : property;
    return t.memberExpression(objExpr, propExpr);
  }

  static isValidImportSpecifier(node: any): boolean {
    return node && 
           (node.type === 'ImportDefaultSpecifier' || 
            node.type === 'ImportSpecifier' ||
            node.type === 'ImportNamespaceSpecifier');
  }

  static isJSXIdentifier(node: any): node is t.JSXIdentifier {
    return node?.type === 'JSXIdentifier';
  }
  
  // Add a helper method for safe node replacement
  static safeReplaceWith(path: NodePath<any>, replacement: any): boolean {
    try {
      path.replaceWith(replacement);
      return true;
    } catch (error) {
      console.error('Error during node replacement:', error);
      return false;
    }
  }
}
