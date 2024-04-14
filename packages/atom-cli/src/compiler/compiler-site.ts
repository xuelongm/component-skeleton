import { build, createServer } from 'vite';
import {
  mergeCustomViteConfig,
  setBuildTarget
} from "../common";
import { getSiteConfigForSiteDev, getSiteConfigForSiteProd } from "../config/vite.site";



export async function compilerSite(production = false) {
  setBuildTarget('site');
  if (production) {
    const config = await mergeCustomViteConfig(
      getSiteConfigForSiteProd(),
      'production'
    );
    await build(config);
    return;
  }
  const config = await mergeCustomViteConfig(
    getSiteConfigForSiteDev(),
    'developer'
  );
  const serve = await createServer(config);
  await serve.listen(config.server?.port);
  serve.printUrls();
}