import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { TransformResult } from '@/types/ast';

/**
 * Transforms Next.js Image components to unpic-img Image components
 */
export class AstImageTransformer {
  /**
   * Transform Next.js Image imports to unpic-img imports
   */
  static transformImageImports(path: NodePath<t.ImportDeclaration>, result: TransformResult): void {
    const source = path.node.source.value;
    
    if (source === 'next/image') {
      // Replace with unpic-img
      path.node.source.value = '@unpic/react';
      
      // Track the change
      result.changes.push('Replaced next/image import with @unpic/react');
    }
  }
  
  /**
   * Transform Next.js Image components to unpic-img Image components
   */
  static transformImageComponents(path: NodePath<t.JSXElement>, result: TransformResult): void {
    const openingElement = path.node.openingElement;
    
    // Check if this is a Next.js Image component
    if (t.isJSXIdentifier(openingElement.name) && 
        (openingElement.name.name === 'Image' || openingElement.name.name === 'NextImage')) {
      
      // Transform the attributes
      this.transformImageAttributes(openingElement.attributes, result);
      
      // Track the change
      result.changes.push('Transformed Next.js Image component to unpic-img Image');
    }
  }
  
  /**
   * Transform Next.js Image attributes to unpic-img attributes
   */
  private static transformImageAttributes(
    attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>,
    result: TransformResult
  ): void {
    // Map of Next.js Image props to unpic-img props
    const propMapping: Record<string, string> = {
      'src': 'src',
      'alt': 'alt',
      'width': 'width',
      'height': 'height',
      'priority': 'priority',
      'quality': 'quality',
      'placeholder': 'placeholder',
      'blurDataURL': 'blurDataURL',
      'layout': 'layout',
      'objectFit': 'style', // Will need special handling
      'objectPosition': 'style', // Will need special handling
    };
    
    // Track which props we've seen
    const seenProps = new Set<string>();
    
    // Transform each attribute
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      
      if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
        const propName = attr.name.name as string;
        seenProps.add(propName);
        
        // Handle special cases
        if (propName === 'layout') {
          // Remove layout prop as unpic-img doesn't use it
          attributes.splice(i, 1);
          i--;
          
          // Add appropriate style based on layout value
          if (attr.value && t.isStringLiteral(attr.value) && attr.value.value === 'fill') {
            // Add style for fill layout
            const styleAttr = t.jsxAttribute(
              t.jsxIdentifier('style'),
              t.jsxExpressionContainer(
                t.objectExpression([
                  t.objectProperty(
                    t.identifier('width'),
                    t.stringLiteral('100%')
                  ),
                  t.objectProperty(
                    t.identifier('height'),
                    t.stringLiteral('100%')
                  ),
                  t.objectProperty(
                    t.identifier('objectFit'),
                    t.stringLiteral('cover')
                  )
                ])
              )
            );
            attributes.push(styleAttr);
          }
        } else if (propName === 'objectFit' || propName === 'objectPosition') {
          // Remove these props as they'll be handled via style
          attributes.splice(i, 1);
          i--;
          
          // Find or create style attribute
          let styleAttrIndex = attributes.findIndex(a => 
            t.isJSXAttribute(a) && 
            t.isJSXIdentifier(a.name) && 
            a.name.name === 'style'
          );
          
          if (styleAttrIndex === -1) {
            // Create new style attribute
            const styleAttr = t.jsxAttribute(
              t.jsxIdentifier('style'),
              t.jsxExpressionContainer(
                t.objectExpression([
                  t.objectProperty(
                    t.identifier(propName),
                    attr.value && t.isStringLiteral(attr.value) 
                      ? t.stringLiteral(attr.value.value)
                      : t.stringLiteral('cover') // Default value
                  )
                ])
              )
            );
            attributes.push(styleAttr);
          } else {
            // Add to existing style attribute
            const styleAttr = attributes[styleAttrIndex] as t.JSXAttribute;
            if (styleAttr.value && t.isJSXExpressionContainer(styleAttr.value) && 
                t.isObjectExpression(styleAttr.value.expression)) {
              styleAttr.value.expression.properties.push(
                t.objectProperty(
                  t.identifier(propName),
                  attr.value && t.isStringLiteral(attr.value) 
                    ? t.stringLiteral(attr.value.value)
                    : t.stringLiteral('cover') // Default value
                )
              );
            }
          }
        } else if (propName === 'loader' || propName === 'unoptimized') {
          // Remove these props as unpic-img handles optimization differently
          attributes.splice(i, 1);
          i--;
        } else if (propMapping[propName] && propMapping[propName] !== propName) {
          // Rename the prop according to the mapping
          attr.name = t.jsxIdentifier(propMapping[propName]);
        }
      }
    }
    
    // Add required props if missing
    if (!seenProps.has('layout') && !seenProps.has('fill')) {
      // Add layout="constrained" as default
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('layout'),
          t.stringLiteral('constrained')
        )
      );
    }
    
    // Add loading="lazy" if priority is not set
    if (!seenProps.has('priority') && !seenProps.has('loading')) {
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('loading'),
          t.stringLiteral('lazy')
        )
      );
    }
  }
  
  /**
   * Transform Next.js Image static methods
   */
  static transformImageStaticMethods(path: NodePath<t.MemberExpression>, result: TransformResult): void {
    if (t.isIdentifier(path.node.object) && 
        (path.node.object.name === 'Image' || path.node.object.name === 'NextImage') && 
        t.isIdentifier(path.node.property)) {
      
      // Handle static methods like Image.loader
      if (path.node.property.name === 'loader') {
        // Replace with appropriate unpic-img equivalent or custom implementation
        result.warnings.push('Image.loader is not directly supported in unpic-img. Consider using a custom loader function.');
      }
    }
  }
}

/**
 * Utility function to transform Next.js Image props to unpic-img props
 */
function transformNextImagePropsToUnpic(node: any) {
  if (!node || !node.attributes) return node;
  
  // Clone the node to avoid mutating the original
  const clonedNode = { ...node };
  
  // Transform attributes based on the mapping
  if (Array.isArray(clonedNode.attributes)) {
    const propMapping: Record<string, string> = {
      'src': 'src',
      'alt': 'alt',
      'width': 'width',
      'height': 'height',
      'priority': 'priority',
      'quality': 'quality',
      'placeholder': 'placeholder',
      'blurDataURL': 'blurDataURL',
      'layout': 'layout',
      'objectFit': 'style',
      'objectPosition': 'style',
    };
    
    // Process each attribute
    clonedNode.attributes = clonedNode.attributes.map((attr: any) => {
      if (attr.name && propMapping[attr.name.name]) {
        // Special handling for style-related props
        if (['objectFit', 'objectPosition'].includes(attr.name.name)) {
          // Convert to style prop
          return {
            ...attr,
            name: { ...attr.name, name: 'style' },
            value: {
              type: 'JSXExpressionContainer',
              expression: {
                type: 'ObjectExpression',
                properties: [{
                  type: 'ObjectProperty',
                  key: { type: 'Identifier', name: attr.name.name },
                  value: attr.value
                }]
              }
            }
          };
        }
        
        // Rename the prop according to the mapping
        return {
          ...attr,
          name: { ...attr.name, name: propMapping[attr.name.name] }
        };
      }
      return attr;
    });
  }
  
  return clonedNode;
}

export { transformNextImagePropsToUnpic };
