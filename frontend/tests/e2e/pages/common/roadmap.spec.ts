import { test } from '@playwright/test';
import { navigationData } from '../../../../assets/js/navigation';
import * as utils from '../utils';
const { BASE_IMAGE_PATH, createFileName } = utils;
let browserName: string;
let fileName: string;
test.describe('Roadmap', () => {
  test.beforeEach(async ({}, testInfo) => {
    browserName = testInfo.project.name;
    fileName = createFileName(testInfo);
    // await page.on('console', msg => {
    //   console.log(`Browser console: ${msg.text()}`);
    // });
  });
  for (const navigation of navigationData) {
    if (!navigation.to) return;
    test(`01_page_${navigation.id}`, async ({ page }) => {
      await page.goto(navigation.to);
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('.skeleton', { state: 'hidden' });
      await page.screenshot({
        path: `${BASE_IMAGE_PATH}/${browserName}/${fileName}`,
      });
    });
  }
});
