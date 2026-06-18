import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('/tmp/puppeteer-install/node_modules/puppeteer/lib/puppeteer/puppeteer.js');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const screenshotDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

const existing = fs.readdirSync(screenshotDir).filter(f => f.endsWith('.png'));
const nums = existing.map(f => {
  const m = f.match(/^screenshot-(\d+)/);
  return m ? parseInt(m[1]) : 0;
});
const n = (nums.length ? Math.max(...nums) : 0) + 1;
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
const outPath = path.join(screenshotDir, filename);

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outPath}`);
