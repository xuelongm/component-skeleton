import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export interface SiteConfig {
  title?: string;
}

export interface BuildConfig {
  site?: {
    outputDir?: string;
    publicPath?: string;
  }
}

export interface AtomConfig {
  name?: string;
  build?: BuildConfig,
  site?: {
    defaultLang: 'zh-CN' | 'en-US';
    locales: {
      'zh-CN'?: SiteConfig;
      'en-US'?: SiteConfig;
    }
  }
}


const CWD = process.cwd();
const ROOT = CWD;

export const ATOM_CONFIG_FILE = join(ROOT, 'atom.config.mjs');
export const ATOM_PACKAGE_FILE = join(ROOT, 'package.json');
export const SITE_DIST_DIR = join(ROOT, 'site-dist');

const __dirname = dirname(fileURLToPath(import.meta.url));
export const SITE_SRC_DIR = join(__dirname, '../../site');

async function getAtomConfigAsync(): Promise<AtomConfig> {
  try {
    return (await import(pathToFileURL(ATOM_CONFIG_FILE).href)).default;
  } catch(e) {
    return {};
  }
}
const AtomConfig = await getAtomConfigAsync();

export function getAtomConfig() {
  return AtomConfig;
}

export function getSiteConfig(): SiteConfig {
  const site = AtomConfig.site;

  if (site?.locales) {
    return site.locales[site.defaultLang] || {};
  } 
  return site as unknown as SiteConfig;
}

export const SRC_DIR = join(ROOT, 'src');
export const STYLE_DIR = join(ROOT, 'style');


export const SCRIPT_EXTS = [
  '.js',
  '.jsx',
  '.vue',
  '.ts',
  '.tsx',
  '.mjs',
  '.cjs',
];