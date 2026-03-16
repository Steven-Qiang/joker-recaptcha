const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const payloadDir = path.join(__dirname, 'payload');
if (!fs.existsSync(payloadDir)) {
  fs.mkdirSync(payloadDir, { recursive: true });
  console.log('Created payload directory:', payloadDir);
} else {
  console.log('Payload directory already exists:', payloadDir);
}

async function crawlReCaptcha() {
  console.log('Starting reCAPTCHA crawler...');

  let browser;
  try {
    browser = await chromium.launch({
      headless: false,
      timeout: 60000,
    });

    const page = await browser.newPage();

    const imageUrls = new Set();

    page.on('response', async (response) => {
      const url = response.url();

      if (url.includes('recaptcha/api2/payload')) {
        imageUrls.add(url);

        try {
          const imageBuffer = await response.body();
          const filename = `payload_${Date.now()}_${Math.floor(Math.random() * 1000)}.png`;
          const savePath = path.join(payloadDir, filename);

          await fs.promises.writeFile(savePath, imageBuffer);
          console.log(`Saved image: ${filename}`);
        } catch (/** @type {any} */ error) {
          console.error('Error saving image:', error.message);
        }
      }
    });

    await page.goto('https://www.google.com/recaptcha/api2/demo', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await page.waitForSelector('iframe[title="reCAPTCHA"]', { timeout: 30000 });

    const frames = await page.frames();
    let frame = null;
    for (const f of frames) {
      const title = await f.title();
      if (title === 'reCAPTCHA') {
        frame = f;
        break;
      }
    }
    if (!frame) {
      console.error('Could not get reCAPTCHA iframe');
      return;
    }

    await frame.waitForSelector('#recaptcha-anchor', { timeout: 30000 });
    await frame.click('#recaptcha-anchor');

    await page.waitForTimeout(2000);

    const challengeFrames = await page.frames();
    let challengeFrame = null;

    for (const f of challengeFrames) {
      const url = f.url();
      if (url.includes('bframe')) {
        challengeFrame = f;
        break;
      }
    }

    if (challengeFrame) {
      try {
        await challengeFrame.waitForSelector('#recaptcha-reload-button', { timeout: 30000 });
        console.log('Starting infinite refresh loop...');
        let refreshCount = 0;
        while (true) {
          refreshCount++;
          if (refreshCount % 10 === 0) {
            console.log(`Refresh count: ${refreshCount}`);
          }

          await challengeFrame.click('#recaptcha-reload-button');
          await page.waitForTimeout(1500);
        }
      } catch (/** @type {any} */ error) {
        console.error('Error with refresh button:', error.message);
      }
    }
  } catch (/** @type {any} */ error) {
    console.error('Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

crawlReCaptcha();
