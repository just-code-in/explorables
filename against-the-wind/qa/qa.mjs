import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:8777/against-the-wind/';
const OUT  = process.env.OUT  || '/private/tmp/claude-501/-Users-justinsimpson-Hermes/cefeefeb-8da1-4981-a273-0f977a9b291e/scratchpad/shots';
const shot = process.argv.includes('--shots');

const browser = await chromium.launch();
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
page.on('console', m => { if (m.type() === 'error') errors.push('[console] ' + m.text()); });
page.on('pageerror', e => errors.push('[pageerror] ' + e.message));

// ---- 1. selftest
await page.goto(BASE + '?selftest=1', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__SELFTEST__, null, { timeout: 60000 });
const st = await page.evaluate(() => window.__SELFTEST__);
console.log(`\nSELFTEST  ${st.pass}/${st.total}`);
for (const r of st.results) console.log(`  ${r.pass ? 'PASS' : 'FAIL'}  ${r.name}\n          ${r.detail}`);

// ---- 2. model probe (what the physics actually says)
const probe = await page.evaluate(() => {
  const { RIGS, computePolar, polarStats, steadyState, KT } = window.__SIM__;
  const out = {};
  for (const k of ['sloop', 'square']) {
    const rig = RIGS[k];
    const p = computePolar(10 * KT, rig, 1);
    const s = polarStats(p, rig);
    out[k] = {
      noGo: s.noGo,
      bestBeat: s.bestVmgTwa,
      bestVmgKt: +(s.bestVmg / KT).toFixed(2),
      maxKt: +(s.maxV / KT).toFixed(2),
      maxAt: s.maxVTwa,
      runKt: +(s.runV / KT).toFixed(2),
      hullKt: +(rig.hullSpeed / KT).toFixed(2),
      beatLeeway: +(steadyState(s.bestVmgTwa, 10 * KT, rig, {}).lambda).toFixed(1), madeGood: +(s.bestVmgMadeGood).toFixed(1), dead: s.dead,
      trimAtBeat: +(steadyState(s.bestVmgTwa, 10 * KT, rig, {}).delta).toFixed(0)
    };
  }
  return out;
});
console.log('\nMODEL @ 10 kt TWS');
console.table(probe);

// ---- 3. interaction + viewport QA
if (shot) {
  const fs = await import('node:fs');
  fs.mkdirSync(OUT, { recursive: true });
  for (const [w, h, tag] of [[390, 844, 'phone'], [768, 1024, 'tablet'], [1440, 950, 'desktop']]) {
    const p2 = await browser.newPage({ viewport: { width: w, height: h } });
    p2.on('console', m => { if (m.type() === 'error') errors.push(`[${tag}] ` + m.text()); });
    p2.on('pageerror', e => errors.push(`[${tag}] ` + e.message));
    await p2.goto(BASE, { waitUntil: 'networkidle' });
    await p2.waitForTimeout(1200);
    // no horizontal overflow
    const overflow = await p2.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (overflow) errors.push(`[${tag}] horizontal overflow`);
    await p2.screenshot({ path: `${OUT}/${tag}-sloop.png`, fullPage: false });
    // square rig + trace
    await p2.click('#rigSquare');
    await p2.click('#trace');
    await p2.waitForFunction(() => !document.getElementById('trace').disabled, null, { timeout: 30000 });
    await p2.waitForTimeout(600);
    await p2.evaluate(() => window.scrollTo(0, 0));
    await p2.waitForTimeout(200);
    await p2.screenshot({ path: `${OUT}/${tag}-square-traced.png`, fullPage: false });
    // drag targets >= 44px
    const small = await p2.evaluate(() => {
      const bad = [];
      for (const el of document.querySelectorAll('button, input[type=range], input[type=checkbox]')) {
        const r = el.getBoundingClientRect();
        if (r.height < 24 && el.type !== 'checkbox') bad.push(el.id || el.textContent.trim());
      }
      return bad;
    });
    if (small.length) errors.push(`[${tag}] small targets: ${small.join(', ')}`);
    await p2.close();
  }

  // ---- 4. degeneracies + control exercise on desktop
  const p3 = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  p3.on('console', m => { if (m.type() === 'error') errors.push('[degen] ' + m.text()); });
  p3.on('pageerror', e => errors.push('[degen] ' + e.message));
  await p3.goto(BASE, { waitUntil: 'networkidle' });
  await p3.waitForTimeout(500);

  const degen = await p3.evaluate(async () => {
    const S = window.__SIM__.S;
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const bad = [];
    const check = tag => {
      if (!isFinite(S.v) || !isFinite(S.lambda) || !isFinite(S.delta) ||
          !isFinite(S.pos.x) || !isFinite(S.pos.y) || S.v < 0) bad.push(tag);
    };
    // zero wind
    S.windKt = 0; await sleep(400); check('zero wind');
    // spin the heading hard
    S.windKt = 12;
    for (let i = 0; i < 240; i++) { S.heading = (S.heading + 17) % 360; await sleep(3); }
    check('heading spun');
    // slam wind speed around
    for (let i = 0; i < 60; i++) { S.windKt = (i % 2) ? 30 : 0.5; await sleep(8); }
    check('wind slammed');
    // sail dead into the wind. She does NOT stop dead — a boat carries her way and
    // takes a long time to lose it, which is exactly why irons is a hazard. Give
    // her the time she would really take, then require she has stopped.
    S.windKt = 10; S.windFrom = 0; S.heading = 0;
    await sleep(30000);
    const irons = S.v;
    const tag = document.getElementById('stateTag').textContent;
    check('in irons');
    return { bad, ironsKt: irons / window.__SIM__.KT, tag };
  });
  if (degen.bad.length) errors.push('degeneracy NaN: ' + degen.bad.join(', '));
  if (degen.ironsKt > 0.4) errors.push(`in-irons did not stop the boat: ${degen.ironsKt.toFixed(2)} kt`);
  if (!/irons/i.test(degen.tag)) errors.push(`in-irons state not reported (tag: "${degen.tag}")`);
  console.log(`\nDEGENERACY   NaN: ${degen.bad.length ? degen.bad.join(', ') : 'none'} · in-irons: ${degen.ironsKt.toFixed(3)} kt, state "${degen.tag}"`);

  // manual trim -> stall
  const stall = await p3.evaluate(async () => {
    const S = window.__SIM__.S;
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    S.windKt = 12; S.windFrom = 0; S.heading = 90; S.autoTrim = true;
    document.getElementById('autoTrim').checked = true;
    await sleep(4000);
    const good = S.v;
    S.autoTrim = false; S.delta = S.rig.deltaMin;
    await sleep(4000);
    return { goodKt: good / window.__SIM__.KT, stalledKt: S.v / window.__SIM__.KT,
             tag: document.getElementById('stateTag').textContent };
  });
  console.log(`STALL TEST   beam reach auto ${stall.goodKt.toFixed(2)} kt -> over-sheeted ${stall.stalledKt.toFixed(2)} kt  (state: "${stall.tag}")`);
  if (stall.stalledKt >= stall.goodKt) errors.push('over-sheeting did not slow the boat');
  await p3.close();
}

console.log('\nCONSOLE/ERRORS: ' + (errors.length ? '\n  ' + errors.join('\n  ') : 'none'));
await browser.close();
process.exit(st.pass === st.total && errors.length === 0 ? 0 : 1);
