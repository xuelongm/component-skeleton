import { parse } from '@babel/parser';
import { walk } from 'estree-walker';
import { Node } from '@babel/types';
import { existsSync, readFileSync } from "fs";
import { SCRIPT_EXTS } from "../common";
import { join } from 'path';

let existsCache: Map<string, boolean> = new Map();

let depsMap: Record<string, string[]> = {};

// https://regexr.com/47jlq
const IMPORT_RE =
  /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from(\s+)?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g;

const IMPORT_NOF_RE = /import\s*\(\s*?['"].+?['"]\)/g;

const EXPORT_FROM_RE =
  /@?export\s+?(?:(?:(?:[\w*\s{},]*)\s+from(\s+)?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g;

export function matchImports(code: string): string[] {
  const imports = code.match(IMPORT_RE) || [];
  return imports.filter((line) => !line.includes('import type'));
}

export function matchImportsNof(code: string): string[] {
  const imports = code.match(IMPORT_NOF_RE) || [];
  return imports.filter((line) => !line.includes('import type'));
}

export function matchExportFroms(code: string): string[] {
  const exportFroms = code.match(EXPORT_FROM_RE) || [];
  return exportFroms.filter((line) => !line.includes('export type'));
}

export function exists(filePath: string) {
  if (!existsCache.has(filePath)) {
    existsCache.set(filePath, existsSync(filePath));
  }
  return !!existsCache.get(filePath);
}

export function fillExt(filePath: string) {
  for(const ext of SCRIPT_EXTS) {
    const componentFile = `${filePath}${ext}`;
    if (exists(componentFile)) {
      return {
        path: componentFile,
        isIndex: false
      }
    }
  }
  for(const ext of SCRIPT_EXTS) {
    const componentFile = `${filePath}/index${ext}`;
    if (exists(componentFile)) {
      return {
        path: componentFile,
        isIndex: true
      }
    }
  }
  return {
    path: '',
    isIndex: false
  }
}

export function getPathFromImport(code: string, filePath: string): string[] {
  const dependencies: string[] = [];
  const ast = parse(code, {
    plugins: ['jsx', 'typescript']
  }) as any;
  walk(ast, {
    enter(node) {
      if ((node.type === 'ImportDeclaration' || node.type === 'ExportNamedDeclaration') && node.source) {
        dependencies.push(node.source.value as string)
      }
    }
  });
  return dependencies.map(item => {
    if (item.startsWith('.')) {
      return fillExt(join(filePath, '..', item)).path;
    }
    return null;
  }).filter((item) => !!item) as string[];
}

export function getDeps(file: string) {
  const code = readFileSync(file, 'utf-8');
  const importFiles = getPathFromImport(code, file);
  depsMap[file] = importFiles;

  importFiles.forEach(getDeps);
  
  return importFiles;
}