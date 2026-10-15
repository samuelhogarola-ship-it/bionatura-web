import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
const host = 'https://analytics.187.124.55.36.sslip.io';
const loader = 'public/umami-analytics.js';
async function run(config, fail = false) {
  assert.ok(existsSync(loader), 'public Umami loader exists');
  const appended = [];
  const window = {};
  const context = vm.createContext({ window, document: {
    querySelector: () => appended[0],
    createElement: () => ({ dataset: {} }),
    head: { appendChild: (el) => appended.push(el) },
  }, fetch: async (url, options) => {
    assert.equal(url, '/umami-config.json');
    assert.equal(options.credentials, 'same-origin');
    if (fail) throw new Error('offline');
    return { ok: true, json: async () => config };
  }});
  const source = readFileSync(loader, 'utf8');
  vm.runInContext(source, context);
  await window.BionaturaUmami.ready;
  await window.BionaturaUmami.init();
  vm.runInContext(source, context);
  await window.BionaturaUmami.ready;
  return appended;
}
test('loads the configured Bionatura tracker only once', async () => {
  const scripts = await run({ hostUrl: host, websiteId: '1acea45c-772e-4eaf-ac01-202e87b43da6' });
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, host + '/script.js');
  assert.equal(scripts[0].dataset.websiteId, '1acea45c-772e-4eaf-ac01-202e87b43da6');
  assert.equal(scripts[0].dataset.domains, 'bionatura.es,www.bionatura.es');
});
test('missing config, wrong host and network failures remain inert', async () => {
  for (const config of [null, {hostUrl:host,websiteId:''}, {hostUrl:'https://example.com',websiteId:'some-valid-id'}]) assert.deepEqual(await run(config), []);
  assert.deepEqual(await run(null,true), []);
});
test('all generated public pages inherit the shared analytics layout', () => {
  const layout = readFileSync('src/layouts/SiteLayout.astro', 'utf8');
  assert.match(layout, /<script is:inline defer src="\/umami-analytics.js"><\/script>/);
  const pages = readdirSync('src/pages', {recursive:true}).filter(p => p.endsWith('.astro'));
  assert.ok(pages.length > 0);
  for (const page of pages) assert.match(readFileSync('src/pages/'+page,'utf8'), /SiteLayout|<script is:inline defer src="\/umami-analytics.js"><\/script>/, page);
});
test('public configuration identifies Bionatura and public source has no GA', () => {
  assert.ok(existsSync('public/umami-config.json'));
  const config = JSON.parse(readFileSync('public/umami-config.json','utf8'));
  assert.equal(config.hostUrl, host);
  assert.equal(config.websiteId, '1acea45c-772e-4eaf-ac01-202e87b43da6');
  for (const root of ['src','public']) for (const p of readdirSync(root,{recursive:true}).filter(p => /\.(astro|js|ts|html)$/.test(p))) assert.doesNotMatch(readFileSync(root+'/'+p,'utf8'), /googletagmanager\.com|google-analytics\.com/);
});
