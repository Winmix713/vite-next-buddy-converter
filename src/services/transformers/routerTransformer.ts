
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { TransformResult } from '@/types/ast';

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
          
          // Replace the path node with locationPathname
          path.replaceWith(locationPathname);
          result.changes.push('router path property transformed');
          break;
      }
    }
  }
}
