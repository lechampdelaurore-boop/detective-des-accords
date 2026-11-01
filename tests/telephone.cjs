// Vérifie sur le site EN LIGNE que l'écran d'enquête tient dans la hauteur de plusieurs
// téléphones (pas d'ascenseur, rien ne dépasse sur le côté), sans erreur dans la console,
// en jouant une séance entière (avec une erreur volontaire pour voir l'indice).
// Usage : node tests/telephone.cjs [url]   (captures dans captures/)
const { chromium } = require('playwright');
const fs = require('fs');

const URL = process.argv[2] || 'https://lechampdelaurore-boop.github.io/detective-des-accords/';
const SIZES = [[320, 568], [360, 640], [375, 667], [390, 664], [390, 844], [412, 780], [430, 932]];
const expectedCache = (fs.readFileSync('sw.js', 'utf8').match(/detective-des-accords-v\d+/) || [])[0];
const LIVE = URL.indexOf('github.io') >= 0;

(async () => {
  fs.mkdirSync('captures', { recursive: true });
  // Attendre que GitHub Pages serve bien la version du dépôt (même CACHE que sw.js).
  for (let i = 0; LIVE; i++) {
    const live = await fetch(URL + 'sw.js?nocache=' + Date.now()).then(r => r.text()).catch(() => '');
    if (live.includes(expectedCache)) { console.log('Version en ligne : ' + expectedCache); break; }
    if (i >= 18) { console.log('Version en ligne différente de ' + expectedCache + ' après 3 min'); process.exit(1); }
    await new Promise(r => setTimeout(r, 10000));
  }

  const browser = await chromium.launch();
  const lines = ['| Écran | Pire dépassement (haut) | Dépassement (côté) | Phrases jouées | Erreurs console |', '|---|---|---|---|---|'];
  let failed = false;
  for (const [w, h] of SIZES) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.addInitScript(() => localStorage.setItem('marc.accords.prefs', JSON.stringify({ kind: 'both', voice: false, sound: true, anim: true })));
    await page.goto(URL + '?nocache=' + Date.now());
    await page.click('#startBtn');
    await page.waitForTimeout(200);
    const over = () => page.evaluate(() => [document.documentElement.scrollHeight - window.innerHeight, document.documentElement.scrollWidth - window.innerWidth]);
    let worstV = 0, worstH = 0, played = 0, shot = 0, madeError = false;
    for (let guard = 0; guard < 80; guard++) {
      if (await page.isVisible('#done')) break;
      const st = await page.evaluate(() => window.detective.state());
      const [v, hz] = await over();
      worstV = Math.max(worstV, v); worstH = Math.max(worstH, hz);
      if (st.done) {
        if (shot < 1) { await page.screenshot({ path: `captures/${w}x${h}-resolue.png` }); shot++; }
        played++;
        await page.click('[data-c="next"]');
      } else if (!madeError && st.step === 'verb') {
        // Erreur volontaire : toucher un autre mot que le verbe.
        madeError = true;
        await page.click(`#words [data-i="${st.word === 0 ? 1 : 0}"]`);
        await page.waitForTimeout(600);
        const [v2, h2] = await over();
        worstV = Math.max(worstV, v2); worstH = Math.max(worstH, h2);
        await page.screenshot({ path: `captures/${w}x${h}-indice.png` });
      } else if (st.word !== undefined) {
        await page.click(`#words [data-i="${st.word}"]`);
      } else if (st.choice) {
        await page.click(`[data-c="${st.choice}"]`);
      } else if (st.slots) {
        for (let k = 0; k < st.slots.length; k++) if (st.slots[k]) await page.click(`[data-s="${k}"]`);
        await page.screenshot({ path: `captures/${w}x${h}-groupe.png` });
        await page.click('[data-c="check"]');
      }
      await page.waitForTimeout(120);
    }
    await page.screenshot({ path: `captures/${w}x${h}-bilan.png` });
    const ok = worstV <= 0 && worstH <= 0 && errors.length === 0 && played >= 5 && await page.isVisible('#done');
    if (!ok) failed = true;
    const cell = d => (d > 0 ? `❌ ${d} px` : '✅');
    lines.push(`| ${w}×${h} | ${cell(worstV)} | ${cell(worstH)} | ${played >= 5 ? '✅' : '❌'} ${played} | ${errors.length ? '❌ ' + errors.join(' / ') : '✅'} |`);
    await page.close();
  }
  await browser.close();
  const report = lines.join('\n');
  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '## Test téléphone (site en ligne)\n\n' + report + '\n');
  process.exit(failed ? 1 : 0);
})();
