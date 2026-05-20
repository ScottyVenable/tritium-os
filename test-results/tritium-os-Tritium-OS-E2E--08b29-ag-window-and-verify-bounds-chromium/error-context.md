# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tritium-os.spec.ts >> Tritium OS E2E Shell Verification Suite >> Launch floating application in Desktop Mode, drag window, and verify bounds
- Location: tests\tritium-os.spec.ts:43:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 100
Received:   100
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7] [cursor=pointer]:
        - img [ref=e9]
        - generic [ref=e11]: Terminal
      - generic [ref=e12] [cursor=pointer]:
        - img [ref=e14]
        - generic [ref=e17]: Browser
      - generic [ref=e18] [cursor=pointer]:
        - img [ref=e20]
        - generic [ref=e22]: Files Drive
      - generic [ref=e23] [cursor=pointer]:
        - img [ref=e25]
        - generic [ref=e28]: App Store
    - generic "Click to toggle 12h/24h format" [ref=e29] [cursor=pointer]:
      - generic [ref=e30]:
        - heading "04:59 PM" [level=1] [ref=e31]
        - text: MAY 20
      - generic [ref=e33]:
        - img [ref=e35]
        - generic [ref=e38]:
          - generic [ref=e39]: GOOGLE ENGINE
          - generic [ref=e40]: System AI coprocessor linking ok
    - generic [ref=e41]:
      - generic [ref=e42]:
        - generic [ref=e45]: TERMINAL - Core Client
        - generic [ref=e46]:
          - button [ref=e47] [cursor=pointer]:
            - img [ref=e48]
          - button [ref=e49] [cursor=pointer]:
            - img [ref=e50]
          - button "Close Window" [ref=e52] [cursor=pointer]:
            - img [ref=e53]
      - generic [ref=e57]:
        - generic [ref=e58]:
          - generic [ref=e59]: TRITIUM CORE SHELL v2.0 - INITIALIZED
          - generic [ref=e60]: Type "help" to list available commands. Type "neofetch" for system spec metrics.
        - generic [ref=e61]:
          - generic [ref=e62]: operator@tritium:/home/operator$
          - textbox "Enter command..." [active] [ref=e63]
          - img [ref=e64]
  - generic [ref=e74]:
    - button "Tritium Core Launcher (Tap 5 times to exit OS)" [ref=e75] [cursor=pointer]:
      - img [ref=e77]
    - button "Interactive Terminal" [ref=e84] [cursor=pointer]:
      - img [ref=e85]
    - button "Web Browser" [ref=e87] [cursor=pointer]:
      - img [ref=e88]
    - button "Notepad Writer" [ref=e91] [cursor=pointer]:
      - img [ref=e92]
    - button "Virtual File Drive" [ref=e95] [cursor=pointer]:
      - img [ref=e96]
    - button "System Settings" [ref=e98] [cursor=pointer]:
      - img [ref=e99]
    - button "Global AI Assistant" [ref=e103] [cursor=pointer]:
      - img [ref=e104]
    - button "TRACKPAD MODE" [ref=e107] [cursor=pointer]
    - button "PHONE MODE" [ref=e108] [cursor=pointer]
    - generic [ref=e110] [cursor=pointer]:
      - img [ref=e111]
      - img [ref=e115]
      - generic [ref=e117]: 04:59 PM
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Tritium OS E2E Shell Verification Suite', () => {
  4   |   
  5   |   test.beforeEach(async ({ page }) => {
  6   |     // Access local dev server
  7   |     await page.goto('/');
  8   |   });
  9   | 
  10  |   test('Unlock lockscreen, skip onboarding, verify Phone Mode, and switch layouts', async ({ page }) => {
  11  |     // 1. Verify LockScreen is active and displays correct clock components
  12  |     await expect(page.locator('h1')).toBeVisible(); // Lockscreen clock
  13  |     await expect(page.locator('text=SLIDE TO UNLOCK')).toBeVisible();
  14  |     
  15  |     // 2. Trigger Unlock by clicking the central pulsing logo (bypass method)
  16  |     const logoAsset = page.locator('img[alt="Tritium logo"]');
  17  |     await expect(logoAsset).toBeVisible();
  18  |     await logoAsset.click();
  19  |     
  20  |     // Wait for unlock transition (800ms in component)
  21  |     await page.waitForTimeout(1000);
  22  | 
  23  |     // 3. Complete/Skip Walkthrough Wizard
  24  |     const skipBtn = page.locator('button:has-text("Skip setup")');
  25  |     await expect(skipBtn).toBeVisible();
  26  |     await skipBtn.click();
  27  |     
  28  |     // 4. Verify Phone Mode is default and running
  29  |     await expect(page.locator('text=TRITIUM MOBILE SHELL')).toBeVisible();
  30  |     await expect(page.locator('text=operator@tritium')).toBeVisible(); // Terminal active in Phone Mode
  31  | 
  32  |     // 5. Test Switch to Desktop Mode layout
  33  |     const desktopBtn = page.locator('button:has-text("DESKTOP")');
  34  |     await expect(desktopBtn).toBeVisible();
  35  |     await desktopBtn.click();
  36  |     
  37  |     // 6. Verify Desktop Mode viewports are loaded
  38  |     await expect(page.locator('text=PHONE MODE')).toBeVisible(); // SWITCH back button in Dock
  39  |     await expect(page.locator('.desktop-clock-widget')).toBeVisible();
  40  |     await expect(page.locator('.desktop-grid-container')).toBeVisible();
  41  |   });
  42  | 
  43  |   test('Launch floating application in Desktop Mode, drag window, and verify bounds', async ({ page }) => {
  44  |     // Unlock and Skip Walkthrough
  45  |     await page.locator('img[alt="Tritium logo"]').click();
  46  |     await page.waitForTimeout(1000);
  47  |     await page.locator('button:has-text("Skip setup")').click();
  48  |     
  49  |     // Switch to Desktop Mode
  50  |     await page.locator('button:has-text("DESKTOP")').click();
  51  | 
  52  |     // Verify Terminal shortcut is visible and click it
  53  |     const terminalShortcut = page.locator('.desktop-shortcut:has-text("Terminal")');
  54  |     await expect(terminalShortcut).toBeVisible();
  55  |     await terminalShortcut.click();
  56  | 
  57  |     // Verify floating Window container is rendered
  58  |     const windowHeader = page.locator('.window-header');
  59  |     await expect(windowHeader).toBeVisible();
  60  |     await expect(page.locator('text=TERMINAL - Core Client')).toBeVisible();
  61  | 
  62  |     // Test dragging window container coordinates
  63  |     const initialBox = await page.locator('.window-container').boundingBox();
  64  |     expect(initialBox).not.toBeNull();
  65  |     
  66  |     if (initialBox) {
  67  |       const headerBox = await windowHeader.boundingBox();
  68  |       expect(headerBox).not.toBeNull();
  69  |       
  70  |       if (headerBox) {
  71  |         console.log('--- DEBUG DRAG ---');
  72  |         console.log('initialBox:', initialBox);
  73  |         console.log('headerBox:', headerBox);
  74  |         // Drag window by the header
  75  |         await page.mouse.move(headerBox.x + headerBox.width / 2, headerBox.y + headerBox.height / 2);
  76  |         await page.mouse.down();
  77  |         await page.mouse.move(headerBox.x + headerBox.width / 2 + 100, headerBox.y + headerBox.height / 2 + 50, { steps: 10 });
  78  |         await page.mouse.up();
  79  | 
  80  |         const newBox = await page.locator('.window-container').boundingBox();
  81  |         console.log('newBox:', newBox);
  82  |         console.log('------------------');
  83  |         expect(newBox).not.toBeNull();
  84  |         if (newBox) {
  85  |           // X and Y coordinates should have changed
> 86  |           expect(newBox.x).toBeGreaterThan(initialBox.x);
      |                            ^ Error: expect(received).toBeGreaterThan(expected)
  87  |           expect(newBox.y).toBeGreaterThan(initialBox.y);
  88  |         }
  89  |       }
  90  |     }
  91  | 
  92  |     // Close application
  93  |     const closeBtn = page.locator('.window-control-btn[title="Close Window"]');
  94  |     await expect(closeBtn).toBeVisible();
  95  |     await closeBtn.click();
  96  |     await expect(windowHeader).not.toBeVisible();
  97  |   });
  98  | 
  99  |   test('Switch Touch Input Modes and verify local storage sync', async ({ page }) => {
  100 |     // Unlock and Skip Walkthrough
  101 |     await page.locator('img[alt="Tritium logo"]').click();
  102 |     await page.waitForTimeout(1000);
  103 |     await page.locator('button:has-text("Skip setup")').click();
  104 |     
  105 |     // Switch to Desktop Mode
  106 |     await page.locator('button:has-text("DESKTOP")').click();
  107 | 
  108 |     // Locate Touch Input Mode button in the bottom dock
  109 |     const touchModeBtn = page.locator('button:has-text("TRACKPAD MODE")');
  110 |     await expect(touchModeBtn).toBeVisible();
  111 | 
  112 |     // Click it to switch to Direct Touch Mode
  113 |     await touchModeBtn.click();
  114 |     await expect(page.locator('button:has-text("TOUCH MODE")')).toBeVisible();
  115 | 
  116 |     // Verify settings check state in settings storage
  117 |     const storageState = await page.evaluate(() => localStorage.getItem('tritium_settings'));
  118 |     expect(storageState).toContain('"useVirtualCursor":false');
  119 | 
  120 |     // Click it back to Virtual Trackpad Mode
  121 |     await page.locator('button:has-text("TOUCH MODE")').click();
  122 |     await expect(page.locator('button:has-text("TRACKPAD MODE")')).toBeVisible();
  123 |     
  124 |     const updatedStorage = await page.evaluate(() => localStorage.getItem('tritium_settings'));
  125 |     expect(updatedStorage).toContain('"useVirtualCursor":true');
  126 |   });
  127 | 
  128 |   test('Responsive viewport stack under 820px', async ({ page }) => {
  129 |     // Unlock and Skip Walkthrough
  130 |     await page.locator('img[alt="Tritium logo"]').click();
  131 |     await page.waitForTimeout(1000);
  132 |     await page.locator('button:has-text("Skip setup")').click();
  133 |     
  134 |     // Switch to Desktop Mode
  135 |     await page.locator('button:has-text("DESKTOP")').click();
  136 | 
  137 |     // Set viewport width to 800px (below 820px cutoff)
  138 |     await page.setViewportSize({ width: 800, height: 600 });
  139 | 
  140 |     // Verify no overlaps or collisions using CSS bounds (widgets center stacked)
  141 |     const clockWidget = page.locator('.desktop-clock-widget');
  142 |     const clockBox = await clockWidget.boundingBox();
  143 |     expect(clockBox).not.toBeNull();
  144 |     
  145 |     if (clockBox) {
  146 |       // The widget should be centered in narrow layout
  147 |       const centerCoord = clockBox.x + clockBox.width / 2;
  148 |       expect(centerCoord).toBeCloseTo(400, 1); // 400 is the center of 800px viewport
  149 |     }
  150 |   });
  151 | 
  152 | });
  153 | 
```