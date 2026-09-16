import dotenv from 'dotenv';
import { spawnSync } from 'node:child_process';

dotenv.config({ path: '../.env' });

const prismaCommand = process.platform === 'win32' ? 'prisma.cmd' : 'prisma';
const result = spawnSync(prismaCommand, process.argv.slice(2), {
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
