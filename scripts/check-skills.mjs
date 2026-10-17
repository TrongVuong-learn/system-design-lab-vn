import { createHash } from 'node:crypto';
import { readFile, readdir, lstat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const lock = JSON.parse(await readFile(resolve(root, 'docs/engineering/skills-lock.json'), 'utf8'));
let checked = 0;
async function listFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${path}`);
    if (entry.isDirectory()) files.push(...(await listFiles(path)));
    else if (entry.isFile()) files.push(path);
    else throw new Error(`Unexpected file type: ${path}`);
  }
  return files;
}
for (const skill of lock.installed) {
  if (!/^[a-f0-9]{40}$/.test(skill.commit)) throw new Error(`Unpinned skill: ${skill.name}`);
  const base = resolve(root, skill.projectPath);
  const skillsRoot = resolve(root, '.agents/skills') + sep;
  if (!base.startsWith(skillsRoot) || (await lstat(base)).isSymbolicLink()) {
    throw new Error(`Invalid skill path: ${skill.projectPath}`);
  }
  const actual = (await listFiles(base)).map((path) => relative(base, path)).sort();
  const expected = Object.keys(skill.files).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`File inventory changed: ${skill.name}`);
  }
  for (const path of actual) {
    const bytes = await readFile(resolve(base, path));
    const hash = createHash('sha256').update(bytes).digest('hex');
    if (hash !== skill.files[path]) throw new Error(`Hash mismatch: ${skill.name}/${path}`);
    checked++;
  }
  const manifest = await readFile(resolve(base, 'SKILL.md'), 'utf8');
  if (
    !manifest.startsWith('---\n') ||
    !manifest.includes(`name: ${skill.name}\n`) ||
    !/^description:/m.test(manifest)
  ) {
    throw new Error(`Invalid skill manifest: ${skill.name}`);
  }
  // Check local Markdown links from the entry point; external URLs are not fetched.
  for (const match of manifest.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0];
    if (!target || /^[a-z]+:/i.test(target)) continue;
    const path = resolve(base, target);
    if (!path.startsWith(base + sep)) throw new Error(`Reference escapes skill: ${target}`);
    await readFile(path);
  }
  console.log(`OK ${skill.name} @ ${skill.commit.slice(0, 12)} (${actual.length} files)`);
}
console.log(
  `Verified ${lock.installed.length} installed skills, ${checked} files. Existing frontend-design uses ${lock.existingDesignLock}.`,
);
