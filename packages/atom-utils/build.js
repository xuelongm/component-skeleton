const { build, context } = require('esbuild');

async function bundle(format) {
  const ext = format === 'esm' ? '.mjs' : '.js';
  const outfile = `dist/index.${format}${ext}`;
  const finish = () => console.log('build finish: ', outfile)
  const option = {
    format,
    bundle: true,
    target: ['chrome53'],
    outfile,
    charset: 'utf8',
    entryPoints: ['./src/index.ts']
  }
  

  if (process.argv.includes('-w')) {
    const loggerPlugin = {
      name: 'loggerPlugin',
      setup(build) {
        build.onEnd(finish)
      }
    };
    const ctx = await context({
      ...option,
      plugins: [loggerPlugin]
    });
    await ctx.watch();
  } else {
    build(option);
    finish();
  }
}

bundle('esm');
bundle('cjs')