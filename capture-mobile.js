import { chromium, devices } from 'playwright';

(async () => {
    // Desktop layout to see the sticky headers clearly
    const desktop = { viewport: { width: 1280, height: 720 } };
    const browser = await chromium.launch();
    const context = await browser.newContext(desktop);
    const page = await context.newPage();

    // Assuming local dev server is running on 5173 
    await page.goto('http://localhost:5173');

    // Wait for the main app container to load
    await page.waitForSelector('[class*="appContainer"]');

    // 1. Spells Sticky Header
    await page.click('button[aria-label="Spells"]');
    await page.waitForTimeout(500);

    // Screenshot original Spells header
    await page.screenshot({ path: 'spells-header-full.png' });

    // Scroll down the spell list
    await page.evaluate(() => {
        const scrollArea = document.querySelector('[class*="scrollArea"]');
        if (scrollArea) scrollArea.scrollBy(0, 500);
    });
    await page.waitForTimeout(500); // Wait for transition
    await page.screenshot({ path: 'spells-header-sticky.png' });

    // 2. Weapons Sticky Header
    await page.click('button[aria-label="Weapons"]');
    await page.waitForTimeout(500);

    // Screenshot original Weapons header
    await page.screenshot({ path: 'weapons-header-full.png' });

    // Scroll down the weapons list
    await page.evaluate(() => {
        const scrollArea = document.querySelector('[class*="scrollArea"]');
        if (scrollArea) scrollArea.scrollBy(0, 500);
    });
    await page.waitForTimeout(500); // Wait for transition
    await page.screenshot({ path: 'weapons-header-sticky.png' });

    await browser.close();
})();
