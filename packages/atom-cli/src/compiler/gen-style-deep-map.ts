import { join, relative, sep } from "path";
import { SRC_DIR, getComponents } from "../common";
import { fillExt, getDeps, matchImports } from "./gen-dep";
import { existsSync } from "fs";

type DepsMap = Record<string, string[]>;

function getStylePath(component: string) {
  return join(SRC_DIR, `${component}/index.less}`);
}

export function checkStyleExists(component: string) {
  return existsSync(getStylePath(component));
}

export function matchPath(component: string, filePath: string) {
  const relativePath = relative(SRC_DIR, filePath);
  return relativePath.split(sep).includes(component);
}

export function analyzeComponentDeps(components: string[], component: string): string[] {
  const checkList: string[] = [];
  const componentEntry = fillExt(join(SRC_DIR, component, 'index')).path;
  const record = new Set();

  function search(filePath: string) {
    record.add(filePath);
    getDeps(filePath).forEach(file => {
      if (record.has(file)) {
        return;
      }
      // 递归搜索当前文档的依赖
      search(file);
      components.filter(item => matchPath(component, filePath))
        .forEach(item => {
          if (item !== component && !checkList.includes(item)) {
            checkList.push(item)
          }
        })
    })
  }
  search(componentEntry);
  return checkList;
}

export async function genStyleDepsMap() {
  const components = getComponents();
  const map = Object.create(null) as DepsMap;
  components.forEach(component => {
    map[component] = analyzeComponentDeps(components, component);
  });

}