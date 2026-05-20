import { test, expect } from '@playwright/test';

test.describe('Tritium OS E2E Shell Verification Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // Access local dev server
    await page.goto('/');

    // Disable smooth scrolling and CSS transitions/animations for E2E determinism
    await page.addStyleTag({
      content: `
        * {
          scroll-behavior: auto !important;
          transition: none !important;
          animation: none !important;
        }
      `
    });
  });

  test('Unlock lockscreen, skip onboarding, verify Phone Mode, and switch layouts', async ({ page }) => {
    // 1. Verify LockScreen is active and displays correct clock components
    await expect(page.locator('h1')).toBeVisible(); // Lockscreen clock
    await expect(page.locator('text=SLIDE TO UNLOCK')).toBeVisible();
    
    // 2. Trigger Unlock by clicking the central pulsing logo (bypass method)
    const logoAsset = page.locator('img[alt="Tritium logo"]');
    await expect(logoAsset).toBeVisible();
    await logoAsset.click();
    
    // Wait for unlock transition (800ms in component)
    await page.waitForTimeout(1000);

    // 3. Complete/Skip Walkthrough Wizard
    const skipBtn = page.locator('button:has-text("Skip setup")');
    await expect(skipBtn).toBeVisible();
    await skipBtn.click();
    
    // 4. Verify Phone Mode is default and running
    await expect(page.locator('text=TRITIUM MOBILE SHELL')).toBeVisible();
    await expect(page.locator('text=operator@tritium')).toBeVisible(); // Terminal active in Phone Mode

    // 5. Test Switch to Desktop Mode layout
    const desktopBtn = page.locator('button:has-text("DESKTOP")');
    await expect(desktopBtn).toBeVisible();
    await desktopBtn.click();
    
    // 6. Verify Desktop Mode viewports are loaded
    await expect(page.locator('text=PHONE MODE')).toBeVisible(); // SWITCH back button in Dock
    await expect(page.locator('.desktop-clock-widget')).toBeVisible();
    await expect(page.locator('.desktop-grid-container')).toBeVisible();
  });

  test('Launch floating application in Desktop Mode, drag window, and verify bounds', async ({ page }) => {
    // Unlock and Skip Walkthrough
    await page.locator('img[alt="Tritium logo"]').click();
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Skip setup")').click();
    
    // Switch to Desktop Mode
    await page.locator('button:has-text("DESKTOP")').click();

    // Verify Terminal shortcut is visible and click it
    const terminalShortcut = page.locator('.desktop-shortcut:has-text("Terminal")');
    await expect(terminalShortcut).toBeVisible();
    await terminalShortcut.click();

    // Verify floating Window container is rendered
    const windowHeader = page.locator('.window-header');
    await expect(windowHeader).toBeVisible();
    await expect(page.locator('text=TERMINAL - Core Client')).toBeVisible();

    // Blur active element and reset scroll on all DOM elements to guarantee coordinates stability
    await page.evaluate(() => {
      (document.activeElement as HTMLElement)?.blur();
      window.scrollTo(0, 0);
      document.querySelectorAll('*').forEach((el) => {
        el.scrollTop = 0;
        el.scrollLeft = 0;
      });
    });

    // Test dragging window container coordinates
    const initialBox = await page.locator('.window-container').boundingBox();
    expect(initialBox).not.toBeNull();
    
    if (initialBox) {
      const headerBox = await windowHeader.boundingBox();
      expect(headerBox).not.toBeNull();
      
      if (headerBox) {
        // Drag window by the header
        await page.mouse.move(headerBox.x + headerBox.width / 2, headerBox.y + headerBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(headerBox.x + headerBox.width / 2 + 100, headerBox.y + headerBox.height / 2 + 50, { steps: 10 });
        await page.mouse.up();

        const newBox = await page.locator('.window-container').boundingBox();
        expect(newBox).not.toBeNull();
        if (newBox) {
          // X and Y coordinates should have changed
          expect(newBox.x).toBeGreaterThan(initialBox.x);
          expect(newBox.y).toBeGreaterThan(initialBox.y);
        }
      }
    }

    // Close application
    const closeBtn = page.locator('.window-control-btn[title="Close Window"]');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(windowHeader).not.toBeVisible();
  });

  test('Switch Touch Input Modes and verify local storage sync', async ({ page }) => {
    // Unlock and Skip Walkthrough
    await page.locator('img[alt="Tritium logo"]').click();
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Skip setup")').click();
    
    // Switch to Desktop Mode
    await page.locator('button:has-text("DESKTOP")').click();

    // Locate Touch Input Mode button in the bottom dock
    const touchModeBtn = page.locator('button:has-text("TRACKPAD MODE")');
    await expect(touchModeBtn).toBeVisible();

    // Click it to switch to Direct Touch Mode
    await touchModeBtn.click();
    await expect(page.locator('button:has-text("TOUCH MODE")')).toBeVisible();

    // Verify settings check state in settings storage
    const storageState = await page.evaluate(() => localStorage.getItem('tritium_settings'));
    expect(storageState).toContain('"useVirtualCursor":false');

    // Click it back to Virtual Trackpad Mode
    await page.locator('button:has-text("TOUCH MODE")').click();
    await expect(page.locator('button:has-text("TRACKPAD MODE")')).toBeVisible();
    
    const updatedStorage = await page.evaluate(() => localStorage.getItem('tritium_settings'));
    expect(updatedStorage).toContain('"useVirtualCursor":true');
  });

  test('Responsive viewport stack under 820px', async ({ page }) => {
    // Unlock and Skip Walkthrough
    await page.locator('img[alt="Tritium logo"]').click();
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Skip setup")').click();
    
    // Switch to Desktop Mode
    await page.locator('button:has-text("DESKTOP")').click();

    // Set viewport width to 800px (below 820px cutoff)
    await page.setViewportSize({ width: 800, height: 600 });

    // Verify no overlaps or collisions using CSS bounds (widgets center stacked)
    const clockWidget = page.locator('.desktop-clock-widget');
    const clockBox = await clockWidget.boundingBox();
    expect(clockBox).not.toBeNull();
    
    if (clockBox) {
      // The widget should be centered in narrow layout
      const centerCoord = clockBox.x + clockBox.width / 2;
      expect(centerCoord).toBeCloseTo(400, 1); // 400 is the center of 800px viewport
    }
  });

});
