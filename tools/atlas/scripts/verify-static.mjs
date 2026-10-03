import {readFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../../../',import.meta.url));
const html = await readFile(path.join(root,'atlas/index.html'),'utf8');
for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]+)"/g)) {
  await access(path.join(root,match[1]));
}
assert.match(html,/src="\/atlas\/assets\//);
assert.match(html,/canonical" href="https:\/\/sanifu.run\/atlas\/"/);
const snapshot = JSON.parse(await readFile(path.join(root,'atlas/atlas.json'),'utf8'));
assert.ok(snapshot.nodes.length > 0);
assert.equal(new Set(snapshot.nodes.map(node => node.id)).size,snapshot.nodes.length);
for (const repo of snapshot.nodes) {
  assert.equal(repo.type,'repository');
  assert.ok(Number.isInteger(repo.commit_count) && repo.commit_count >= 0);
  assert.ok(Number.isFinite(Date.parse(repo.created_at)));
  assert.match(repo.url,/^https:\/\/github.com\//);
}
const sources = JSON.parse(await readFile(path.join(root,'atlas/languages/sources.json'),'utf8'));
for (const {file} of Object.values(sources)) assert.match(await readFile(path.join(root,'atlas/languages',file),'utf8'),/<svg/);
assert.match(await readFile(path.join(root,'atlas/languages/credits.html'),'utf8'),/Renee French/);
assert.match(await readFile(path.join(root,'atlas/languages/DEVICON-LICENSE'),'utf8'),/MIT License/);
assert.match(await readFile(path.join(root,'index.html'),'utf8'),/href="atlas\/"/);
console.log(`Static integration verified: ${snapshot.nodes.length} public repositories, ${Object.keys(sources).length} language assets, /atlas/ bundle paths, credits, and homepage link.`);
