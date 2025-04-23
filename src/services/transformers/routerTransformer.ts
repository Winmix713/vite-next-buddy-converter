
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { TransformResult } from '@/types/ast';
import { BabelTypeAdapter } from '@/services/ast/BabelTypeAdapter';

export function transformRouterUsage(path: NodePath<t.MemberExpression>, result: TransformResult) {
  if (t.isIdentifier(path.node.object) && path.node.object.name === 'router') {
    if (t.isIdentifier(path.node.property)) {
      switch (path.node.property.name) {
        case 'push':
          path.node.object = t.identifier('navigate');
          result.changes.push('router.push transformed to navigate');
          break;
        case 'query':
          path.node.object = t.identifier('params');
          result.changes.push('router.query transformed to params');
          break;
        case 'asPath':
        case 'pathname':
          const locationPathname = t.memberExpression(
            t.identifier('location'), 
            t.identifier('pathname')
          );
          
          // Use BabelTypeAdapter for safe node replacement
          if (BabelTypeAdapter.safeReplaceWith(path, locationPathname)) {
            result.changes.push('router path property transformed');
          } else {
            result.warnings.push('Failed to transform router path property: type incompatibility');
          }
          break;
      }
    }
  }
}
