let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  const pw = await import("/tmp/pw/node_modules/playwright/index.js");
  chromium = (pw.chromium || pw.default.chromium);
}

const BASE = process.env.BASE || "http://127.0.0.1:8777/why-hexagons/";
const OUT = process.env.OUT || new URL(".", import.meta.url).pathname;
const shot = process.argv.includes("--shots");

const browser = await chromium.launch({ headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
page.on("console", m => { if (m.type() === "error") errors.push("[console] " + m.text()); });
page.on("pageerror", e => errors.push("[pageerror] " + e.message));

await page.goto(BASE + "?selftest=1", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForFunction(() => window.__SELFTEST__, null, { timeout: 180000 });
const st = await page.evaluate(() => window.__SELFTEST__);
console.log(`\nSELFTEST  ${st.pass}/${st.total}`);
for (const r of st.results) console.log(`  ${r.pass ? "PASS" : "FAIL"}  ${r.name}\n          ${r.detail}`);
if (st.pass !== st.total) errors.push(`selftest ${st.pass}/${st.total}`);

if (shot) {
  const fs = await import("node:fs");
  fs.mkdirSync(OUT, { recursive: true });

  for (const [w, h, tag] of [[390, 844, "phone"], [768, 1024, "tablet"], [1440, 950, "desktop"]]) {
    const p2 = await browser.newPage({ viewport: { width: w, height: h } });
    p2.on("console", m => { if (m.type() === "error") errors.push(`[${tag}] ` + m.text()); });
    p2.on("pageerror", e => errors.push(`[${tag}] ` + e.message));
    await p2.goto(BASE, { waitUntil: "domcontentloaded" });
    await p2.waitForFunction(() => window.__SIM__);

    await p2.evaluate(() => {
      const S = window.__SIM__;
      S.gamma = 0;
      S.voronoiFoam(S.NSITES, S.SEED0);
    });
    await p2.waitForTimeout(80);
    const overflow = await p2.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (overflow) errors.push(`[${tag}] horizontal overflow`);
    await p2.screenshot({ path: `${OUT}/${tag}-disordered.png` });

    const relaxedDev = await p2.evaluate(() => {
      const S = window.__SIM__;
      S.gamma = 1;
      S.settle(1, 1600);
      return S.tangentMax().m;
    });
    await p2.waitForFunction(() => /120/.test(document.getElementById("stateTag").textContent), null, { timeout: 5000 });
    if (relaxedDev > 1.05) errors.push(`[${tag}] relaxed max dev ${relaxedDev.toFixed(2)}°`);
    await p2.evaluate(() => window.scrollTo(0, 0));
    await p2.screenshot({ path: `${OUT}/${tag}-relaxed.png` });

    await p2.evaluate(() => {
      const S = window.__SIM__;
      S.gamma = 0;
      S.squareGrid();
    });
    await p2.waitForTimeout(40);
    await p2.screenshot({ path: `${OUT}/${tag}-squares.png` });

    const small = await p2.evaluate(() => {
      const bad = [];
      for (const el of document.querySelectorAll("button, input[type=range]")) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height < 24) bad.push(el.id || el.textContent.trim());
      }
      return bad;
    });
    if (small.length) errors.push(`[${tag}] small targets: ${small.join(", ")}`);
    await p2.close();
  }

  const p3 = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  p3.on("console", m => { if (m.type() === "error") errors.push("[controls] " + m.text()); });
  p3.on("pageerror", e => errors.push("[controls] " + e.message));
  await p3.goto(BASE, { waitUntil: "domcontentloaded" });
  await p3.waitForFunction(() => window.__SIM__);

  const controls = await p3.evaluate(() => {
    const S = window.__SIM__;
    const bad = [];
    const finite = () => {
      if (!S.cells.every(c => isFinite(c.P) && isFinite(c.Astar))) return false;
      return S.X.every(x => isFinite(x)) && S.Y.every(y => isFinite(y));
    };
    S.gamma = 0;
    S.voronoiFoam(S.NSITES, S.SEED0);
    if (!finite() || S.tangentMax().m < 20) bad.push("disordered start");
    S.gamma = 4;
    S.settle(5, 30);
    if (!finite()) bad.push("gamma 4");
    S.gamma = 0;
    S.settle(5, 3);
    if (!finite()) bad.push("gamma 0");
    S.gamma = 1;
    S.equalAreas = true;
    const areas = S.cells.filter(c => c.alive).map(c => c.Astar);
    if (Math.max(...areas) - Math.min(...areas) > 1e-9) bad.push("equal areas");
    S.equalAreas = false;
    S.settle(3, 80);
    const before = S.cells.map(c => ({ n: c.alive ? c.v.length : 0, a: c.Astar, alive: c.alive }));
    S.kappaRate = 0.04;
    for (let i = 0; i < 30; i++) S.coarsen(0.05);
    let grew = 0, shrank = 0;
    S.cells.forEach((c, i) => {
      if (!before[i].alive) return;
      if (before[i].n > 6 && c.Astar > before[i].a) grew++;
      if (before[i].n < 6 && c.Astar < before[i].a) shrank++;
    });
    if (!grew || !shrank) bad.push(`coarsen grew ${grew} shrank ${shrank}`);
    const seed = S.SEED0;
    S.voronoiFoam(S.NSITES, seed + 17);
    if (S.tangentMax().m < 20) bad.push("reshuffle still relaxed");
    return { bad, grew, shrank, dev: S.tangentMax().m };
  });
  if (controls.bad.length) errors.push("controls: " + controls.bad.join(", "));
  console.log(`\nCONTROLS  ${controls.bad.length ? controls.bad.join(", ") : "ok"} · coarsen +${controls.grew}/-${controls.shrank}`);

  const drag = await p3.evaluate(() => {
    const S = window.__SIM__;
    S.gamma = 1;
    S.voronoiFoam(S.NSITES, S.SEED0);
    S.settle(1, 400);
    const g = S.plotGeom();
    const v = S.X.findIndex((_, i) => true);
    const p = S.worldToScreen(S.X[0], S.Y[0], g);
    const canvas = document.getElementById("chart");
    const r = canvas.getBoundingClientRect();
    return {
      x: r.left + p.x * (r.width / canvas.width),
      y: r.top + p.y * (r.height / canvas.height),
      dev: S.tangentMax().m
    };
  });
  await p3.mouse.move(drag.x, drag.y);
  await p3.mouse.down();
  await p3.mouse.move(drag.x + 36, drag.y + 28);
  const heldTag = await p3.evaluate(() => document.getElementById("stateTag").textContent);
  await p3.mouse.up();
  await p3.waitForTimeout(200);
  if (!/Held/.test(heldTag)) errors.push("drag did not hold (" + heldTag + ")");
  console.log(`DRAG  start dev ${drag.dev.toFixed(2)}° · held tag "${heldTag}"`);
  await p3.close();
}

console.log("\nCONSOLE/ERRORS: " + (errors.length ? "\n  " + errors.join("\n  ") : "none"));
await browser.close();
process.exit(st.pass === st.total && errors.length === 0 ? 0 : 1);
