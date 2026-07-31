import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const distUrl = new URL('../dist/', import.meta.url);

async function readPage(path) {
  return readFile(new URL(path, distUrl), 'utf8');
}

test('home page ships an image-led hero without remote font dependencies', async () => {
  const html = await readPage('index.html');

  assert.match(html, /data-visual="hero"/);
  assert.match(html, /<img[^>]+alt="YiHarvest project interface collection"/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com/);
});

test('project listing gives every project a real visual asset', async () => {
  const html = await readPage('projects/index.html');
  const projectVisuals = html.match(/data-project-art/g) ?? [];

  assert.equal(projectVisuals.length, 3);
  assert.match(html, /\/images\/projects\/search-engine-tool-mcp\.webp/);
  assert.match(html, /\/images\/projects\/ppt-design\.webp/);
  assert.match(html, /\/images\/projects\/hemopain\.webp/);
});

test('about and notes pages use the supporting editorial texture', async () => {
  const [about, notes] = await Promise.all([
    readPage('about/index.html'),
    readPage('notes/index.html'),
  ]);

  assert.match(about, /data-page-art="about"/);
  assert.match(notes, /data-page-art="notes"/);
  await access(new URL('images/editorial-texture.webp', distUrl));
});

test('published pages contain no em dash design tells', async () => {
  const paths = [
    'index.html',
    'about/index.html',
    'projects/index.html',
    'notes/index.html',
  ];

  for (const path of paths) {
    const html = await readPage(path);
    assert.doesNotMatch(html, /[—–]/, `${path} contains a banned dash`);
  }
});
