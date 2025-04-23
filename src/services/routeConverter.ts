
import { RouteObject } from "react-router-dom";
import { RouteConversionResult } from "@/types/conversion";
import { 
  NextJsRoute, 
  analyzeRoutes, 
  convertToReactRoutes 
} from "./conversion/route";

export { analyzeRoutes, convertToReactRoutes };
export type { NextJsRoute };

export function analyzeNextJsRoutes(files: string[]): NextJsRoute[] {
  const routes: NextJsRoute[] = [];
  
  files
    .filter(file => file.includes('/pages/') && 
      !file.includes('/_app.') && !file.includes('/_document.'))
    .forEach(file => {
      const route = createRouteFromFilePath(file);
      if (route) {
        routes.push(route);
      }
    });
  
  return routes;
}

export function convertNextJsRoutes(files: string[]): RouteConversionResult {
  const result: RouteConversionResult = {
    nextRoutes: [],
    reactRouterRoutes: [],
    warnings: [],
    originalPath: '/pages',
    code: ''
  };
  
  const nextRoutes = analyzeNextJsRoutes(files);
  result.nextRoutes = nextRoutes;
  
  const reactRouterRoutes = convertToReactRouterRoutes(nextRoutes);
  result.reactRouterRoutes = reactRouterRoutes;
  
  result.code = generateRouterCode(reactRouterRoutes);
  
  return result;
}

function createRouteFromFilePath(filePath: string): NextJsRoute | null {
  const pathMatch = filePath.match(/\/pages\/(.+?)\.(js|jsx|ts|tsx)$/);
  if (!pathMatch) return null;
  
  const pagePath = pathMatch[1];
  const isDynamic = pagePath.includes('[');
  const isIndex = pagePath.endsWith('/index') || pagePath === 'index';
  let path = `/${pagePath}`;
  
  if (isIndex) {
    path = path.replace(/\/index$/, '') || '/';
  }
  
  const params: string[] = [];
  if (isDynamic) {
    const matches = pagePath.match(/\[([^\]]+)\]/g) || [];
    matches.forEach(match => {
      const param = match.replace(/\[|\]/g, '');
      params.push(param);
    });
  }
  
  const isCatchAll = params.some(p => p.startsWith('...'));
  const isOptionalCatchAll = params.some(p => p.startsWith('[[...'));
  
  return {
    path,
    component: filePath,
    isDynamic,
    hasParams: params.length > 0,
    params,
    isIndex,
    isCatchAll,
    isOptionalCatchAll
  };
}

export function convertToReactRouterRoutes(nextRoutes: NextJsRoute[]): RouteObject[] {
  return nextRoutes.map(route => {
    let path = route.path;
    
    if (route.isDynamic) {
      if (route.isOptionalCatchAll) {
        path = path.replace(/\/\[\[\.\.\.([^\]]+)\]\]/g, '/*');
      } else if (route.isCatchAll) {
        path = path.replace(/\/\[\.\.\.([^\]]+)\]/g, '/*');
      } else {
        path = path.replace(/\/\[([^\]]+)\]/g, '/:$1');
      }
    }
    
    return {
      path,
      element: `<Component path="${route.component}" />`
    };
  });
}

function generateRouterCode(routes: RouteObject[]): string {
  const imports = `import { createBrowserRouter } from "react-router-dom";\n\n`;
  
  const routesArray = routes
    .map(route => `  { path: "${route.path}", element: ${route.element} }`)
    .join(',\n');
  
  const definition = `export const router = createBrowserRouter([\n${routesArray}\n]);\n`;
  
  return imports + definition;
}
