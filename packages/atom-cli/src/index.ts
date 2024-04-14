import { logger } from 'rslog';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const { version: cliVersion } = require('../package.json');

export { cliVersion };

logger.greet(` CLI v${cliVersion}`);
