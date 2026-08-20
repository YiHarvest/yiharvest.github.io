import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const distUrl = new URL('../dist/', import.meta.url);

async function readPage(path) {
  return readFile(new URL(path, distUrl), 'utf8');
}

test('home page ships the new image-led AI infrastructure hero', async () => {
  const html = await readPage('index.html');

  assert.match(html, /data-visual="hero"/);
  assert.match(html, /\/images\/ai-infrastructure-hero\.webp/);
  assert.match(html, /data-en="An AI system structure/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com/);
  await access(new URL('images/ai-infrastructure-hero.webp', distUrl));
});

test('project listing contains six projects with real visual assets', async () => {
  const html = await readPage('projects/index.html');
  const projectVisuals = html.match(/data-project-art/g) ?? [];

  assert.equal(projectVisuals.length, 6);
  for (const slug of [
    'assets-library',
    'dsh-failure-capsule',
    'song-agent-feishu',
    'search-engine-tool-mcp',
  ]) {
    assert.match(html, new RegExp(`/projects/${slug}`));
    await access(new URL(`images/projects/${slug}.webp`, distUrl));
  }
});

test('all primary pages ship the no-flash bilingual contract', async () => {
  const paths = [
    'index.html',
    'about/index.html',
    'projects/index.html',
    'notes/index.html',
  ];

  for (const path of paths) {
    const html = await readPage(path);
    const bodyIndex = html.indexOf('<body>');
    const preferenceIndex = html.indexOf("localStorage.getItem('yiharvest:language')");

    assert.match(html, /<html lang="zh-CN" data-language="zh">/);
    assert.ok(preferenceIndex > -1 && preferenceIndex < bodyIndex, `${path} initializes language before body`);
    assert.match(html, /data-copy-lang="zh"/);
    assert.match(html, /data-copy-lang="en"/);
    assert.match(html, /data-language-toggle/);
    assert.match(html, /data-meta-i18n/);
  }
});

test('featured project detail pages provide substantial Chinese and English content', async () => {
  for (const slug of [
    'assets-library',
    'dsh-failure-capsule',
    'song-agent-feishu',
    'search-engine-tool-mcp',
  ]) {
    const html = await readPage(`projects/${slug}/index.html`);
    assert.match(html, /data-copy-lang="zh" lang="zh-CN"/);
    assert.match(html, /data-copy-lang="en" lang="en"/);
    assert.match(html, />问题</);
    assert.match(html, />Problem</);
    assert.ok(html.length > 11000, `${slug} should contain a detailed bilingual project page`);
  }
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

test('navigation and preferences expose Apple-style accessibility hooks', async () => {
  const html = await readPage('projects/index.html');

  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /class="language-toggle"/);
  assert.match(html, /class="theme-toggle"/);
  assert.match(html, /prefers-reduced-motion/);
});

test('published pages contain no em dash design tells', async () => {
  const paths = [
    'index.html',
    'about/index.html',
    'projects/index.html',
    'notes/index.html',
    'notes/welcome/index.html',
    'projects/assets-library/index.html',
    'projects/dsh-failure-capsule/index.html',
    'projects/hemopain/index.html',
    'projects/ppt-design/index.html',
    'projects/search-engine-tool-mcp/index.html',
    'projects/song-agent-feishu/index.html',
  ];

  for (const path of paths) {
    const html = await readPage(path);
    assert.doesNotMatch(html, /[—–]/, `${path} contains a banned dash`);
  }
});
