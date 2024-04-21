import { InlineConfig, loadConfigFromFile, mergeConfig } from 'vite';
import { SRC_DIR, getAtomConfig } from './constant';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export type BuildTarge = 'site' | 'package';
export const ENTRY_EXTS = ['js', 'ts', 'tsx', 'jsx', 'vue'];

export * from './constant';

export async function mergeCustomViteConfig(
  config: InlineConfig,
  mode: 'production' | 'developer'
): Promise<InlineConfig> {
  // const atomConfig = getAtomConfig();

  const userConfig = loadConfigFromFile({
    mode,
    command: mode === 'developer' ? 'serve' : 'build'
  }, undefined, process.cwd());

  if (userConfig) {
    config = mergeConfig(config, userConfig);
  }
  return config;
}

// set build target
export function setBuildTarget(target: BuildTarge) {
  process.env.BUILD_TARGET = target;
}

export function setNodeEnv(env: string) {
  process.env.NODE_ENV = env;
}

export function hasDefaultExport(code: string) {
  return code.includes('export default') || code.includes('export { default }');
}

export function getComponents() {
  const dirs = readdirSync(SRC_DIR);
  return dirs.filter(dir => ENTRY_EXTS.some(ext => {
    const file = join(dir, `index.${ext}`);
    if (existsSync(file)) {
      return hasDefaultExport(readFileSync(file, 'utf-8'));
    }
    return false;
  }));
}