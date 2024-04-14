import { setNodeEnv } from "../common";
import { compilerSite } from "../compiler/compiler-site";

export async function dev() {
  setNodeEnv('development');
  await compilerSite();
}