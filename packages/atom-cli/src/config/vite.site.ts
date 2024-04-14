import { InlineConfig, PluginOption } from "vite";
import VitePluginVue from '@vitejs/plugin-vue';
import VitePluginVueJsx from '@vitejs/plugin-vue-jsx';

import { template } from 'lodash-es';

import {
  SITE_DIST_DIR,
  SITE_SRC_DIR,
  getAtomConfig,
  getSiteConfig,
  setBuildTarget
} from "../common";
import { join } from "path";


function VitePluginHTML(data: Record<string, any>): PluginOption {
  return {
    name: 'vite-plugin-html',
    transformIndexHtml: {
      enforce: 'pre',
      transform(html) {
        return template(html)(data);
      }
    }
  }
}

export function getSiteConfigForSiteDev():InlineConfig {
  setBuildTarget('site');

  const atomConfig = getAtomConfig();
  const siteConfig = getSiteConfig();

  const title = siteConfig.title || 'AtomUI';
  return {
    root: SITE_SRC_DIR,
    optimizeDeps: {
      exclude: ['vue', 'vue-router']
    },
    plugins: [
      VitePluginVue({
        include: [/\.vue$/, /\.md$/]
      }),
      VitePluginVueJsx(),
      VitePluginHTML({
        title
      })
    ],
    server: {
      host: '0.0.0.0'
    }
  }
}

export function getSiteConfigForSiteProd():InlineConfig {
  const atomConfig = getAtomConfig();
  const devConfig = getSiteConfigForSiteDev();
  const base = atomConfig.build?.site?.publicPath || '/';
  const outDir = atomConfig.build?.site?.outputDir || SITE_DIST_DIR;
  return {
    ...devConfig,
    base,
    build: {
      outDir,
      reportCompressedSize: false,
      emptyOutDir: true,
      cssTarget: ['chrome53'],
      rollupOptions: {
        input: {
          main: join(SITE_SRC_DIR, 'index.html'),
          mobile: join(SITE_SRC_DIR, 'mobile.html'),
        },
        output: {
          manualChunks: {
            'vue-libs': ['vue', 'vue-router']
          }
        }
      }
    }
  }
}