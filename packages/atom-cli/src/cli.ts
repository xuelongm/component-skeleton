import { Command } from 'commander';

import { cliVersion } from '.';

const program = new Command();

program.version(cliVersion);

program
  .command('dev')
  .description('Run dev serve')
  .action(async () => {
    // 引入dev
    const { dev } = await import('./commands/dev');
    // 启动
    await dev();
  });