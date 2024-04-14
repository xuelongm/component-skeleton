import { InlineConfig, loadConfigFromFile, mergeConfig } from 'vite';
import { getAtomConfig } from './constant';

export type BuildTarge = 'site' | 'package';

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