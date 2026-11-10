import { access, cp, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const adminBuild = join(repositoryRoot, 'admin', 'dist');
const outputDirectory = join(repositoryRoot, 'admin', 'vercel-output');

await access(join(repositoryRoot, 'index.html'));
await access(join(adminBuild, 'index.html'));

if (outputDirectory === repositoryRoot || !outputDirectory.startsWith(`${repositoryRoot}${sep}`)) {
  throw new Error('Refusing to write deployment output outside the admin build directory.');
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const excludedEntries = new Set(['.git', '.vercel', 'admin', 'node_modules', 'vercel.json']);
const rootEntries = await readdir(repositoryRoot, { withFileTypes: true });
for (const entry of rootEntries) {
  if (excludedEntries.has(entry.name) || entry.name.startsWith('.')) continue;
  await cp(join(repositoryRoot, entry.name), join(outputDirectory, entry.name), { recursive: true });
}

await cp(adminBuild, join(outputDirectory, 'admin'), { recursive: true });
console.log(`Prepared combined public and admin site in ${outputDirectory}`);
