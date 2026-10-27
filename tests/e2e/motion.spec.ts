import {test, expect} from '@playwright/test';

test('reduzir movimento durante a inclinação restaura a prévia e interrompe o movimento', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await page.goto('/');
  const preview = page.locator('#inicio [data-service-summary]');
  await expect(preview).toBeVisible();
  const bounds = await preview.boundingBox();
  expect(bounds).not.toBeNull();
  await preview.dispatchEvent('mousemove', {
    clientX: bounds!.x + bounds!.width * .9,
    clientY: bounds!.y + bounds!.height * .1,
  });
  const tilt = () => preview.evaluate(element => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return Math.abs(matrix.m13) + Math.abs(matrix.m23);
  });
  await expect.poll(tilt).toBeGreaterThan(.01);
  await page.emulateMedia({reducedMotion: 'reduce'});
  await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true');
  await expect.poll(tilt).toBeLessThan(.0001);
  await expect(preview).toHaveCSS('opacity', '1');
  await preview.dispatchEvent('mousemove', {clientX: bounds!.x, clientY: bounds!.y});
  await expect.poll(tilt).toBeLessThan(.0001);
});
