import {test, expect, type Locator} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.emulateMedia({reducedMotion: 'no-preference'});
});

async function markerError(button: Locator, marker = 'data-tab-active', underline = false) {
  return button.evaluate((element, options) => {
    const indicator = element.parentElement?.querySelector<HTMLElement>(`:scope > [${options.marker}]`);
    if (!indicator) return Number.MAX_SAFE_INTEGER;
    const target = element.getBoundingClientRect();
    const actual = indicator.getBoundingClientRect();
    return Math.max(
      Math.abs(actual.left - target.left),
      Math.abs(actual.top - (options.underline ? target.bottom - 3 : target.top)),
      Math.abs(actual.width - target.width),
      Math.abs(actual.height - (options.underline ? 3 : target.height)),
    );
  }, {marker, underline});
}

async function expectMarker(button: Locator, marker = 'data-tab-active', underline = false) {
  await expect.poll(() => markerError(button, marker, underline), {intervals: [20, 50, 100]}).toBeLessThanOrEqual(2);
}

async function visualState(target: Locator) {
  return target.evaluate(element => {
    let opacity = 1;
    let displacement = 0;
    for (let node: Element | null = element; node && node.tagName !== 'SECTION'; node = node.parentElement) {
      const style = getComputedStyle(node);
      opacity *= Number(style.opacity);
      const matrix = new DOMMatrixReadOnly(style.transform);
      displacement += Math.abs(matrix.m41) + Math.abs(matrix.m42);
    }
    return {opacity, displacement};
  });
}

test('oito grupos recebem indicadores sem interceptar seus controles', async ({page}) => {
  await page.goto('/');
  const groups = page.locator('[data-interactive-tabs]');
  await expect(groups).toHaveCount(8);
  for (const label of [
    'Navegação principal',
    'O que você quer desenvolver?',
    'Frentes de trabalho',
    'Rotina para experimentar',
    'Perspectivas da experiência',
    'Momentos da trajetória',
    'Etapas do projeto',
    'Necessidade do projeto',
  ]) {
    const group = page.locator('[data-interactive-tabs]').and(page.getByLabel(label, {exact: true}));
    await expect(group).toHaveCount(1);
    for (const layer of ['data-tab-active', 'data-tab-hover', 'data-tab-ripple']) {
      const indicator = group.locator(`:scope > [${layer}]`);
      await expect(indicator).toHaveAttribute('aria-hidden', 'true');
      await expect(indicator).toHaveCSS('pointer-events', 'none');
    }
  }
});

test('o realce acompanha o cursor sem selecionar e desliza até a opção clicada', async ({page}) => {
  await page.goto('/');
  const services = page.locator('#solucoes');
  const group = services.getByRole('group', {name: 'Frentes de trabalho'});
  const initial = group.getByRole('button', {name: 'Sites', exact: true});
  const next = group.getByRole('button', {name: 'Automações', exact: true});
  await initial.focus();
  await expectMarker(initial);
  await next.hover();
  await expectMarker(next, 'data-tab-hover');
  await expect(initial).toHaveAttribute('aria-pressed', 'true');
  await expect(next).toHaveAttribute('aria-pressed', 'false');
  await expect(services.getByRole('heading', {level: 3})).toHaveText('Uma apresentação que representa seu negócio.');
  await expectMarker(initial);

  const earlyState = await next.evaluate(async element => {
    (element as HTMLButtonElement).click();
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const group = element.parentElement!;
    const target = element.getBoundingClientRect();
    const indicator = group.querySelector<HTMLElement>(':scope > [data-tab-active]')!;
    const actual = indicator.getBoundingClientRect();
    const ripple = group.querySelector<HTMLElement>(':scope > [data-tab-ripple] > *')!;
    return {
      remainingDistance: Math.hypot(actual.left - target.left, actual.top - target.top),
      rippleOpacity: Number(getComputedStyle(ripple).opacity),
    };
  });
  expect(earlyState.remainingDistance).toBeGreaterThan(2);
  expect(earlyState.rippleOpacity).toBeGreaterThan(0);
  await expect(next).toHaveAttribute('aria-pressed', 'true');
  await expect(services.getByRole('heading', {level: 3})).toHaveText('As ferramentas conversam. A equipe ganha tempo.');
  await expectMarker(next);
  await page.mouse.move(0, 0);
  await expect.poll(() => group.locator(':scope > [data-tab-hover]').evaluate(element => Number(getComputedStyle(element).opacity))).toBe(0);
});

test('teclado move o sublinhado e o foco nas perspectivas sem perder a última escolha', async ({page}) => {
  await page.goto('/');
  const profile = page.locator('#sobre');
  const group = profile.getByRole('tablist', {name: 'Perspectivas da experiência'});
  const build = group.getByRole('tab', {name: 'Construir', exact: true});
  const operate = group.getByRole('tab', {name: 'Operar', exact: true});
  const connect = group.getByRole('tab', {name: 'Conectar', exact: true});
  await build.focus();
  await expectMarker(build, 'data-tab-active', true);
  await build.press('End');
  await expect(operate).toBeFocused();
  await expect(operate).toHaveAttribute('aria-selected', 'true');
  await expectMarker(operate, 'data-tab-active', true);
  await operate.press('Home');
  await expect(build).toBeFocused();
  await build.press('ArrowLeft');
  await expect(operate).toBeFocused();
  await operate.press('ArrowLeft');
  await expect(connect).toBeFocused();
  await expect(connect).toHaveAttribute('aria-selected', 'true');
  await expectMarker(connect, 'data-tab-active', true);
  await expect(profile.getByRole('tabpanel')).toContainText(/integra|catálogo|sistemas/i);
  await expect.poll(() => visualState(profile.getByRole('tabpanel'))).toEqual({opacity: 1, displacement: 0});
});

test('o indicador acompanha a escolha quando os botões mudam de linha e tamanho', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/');
  const group = page.locator('#inicio').getByRole('group', {name: 'O que você quer desenvolver?'});
  const selected = group.getByRole('button', {name: 'Organizar minhas vendas', exact: true});
  await selected.click();
  await expectMarker(selected);
  for (const width of [768, 320, 1024, 390]) {
    await page.setViewportSize({width, height: 844});
    await selected.scrollIntoViewIfNeeded();
    await expect(selected).toHaveAttribute('aria-pressed', 'true');
    await expectMarker(selected);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow em ${width}px`).toBe(true);
  }
});

test('redimensionar durante o deslocamento do foco mantém o realce no novo layout', async ({page}) => {
  await page.goto('/');
  const group = page.locator('#solucoes').getByRole('group', {name: 'Frentes de trabalho'});
  const first = group.getByRole('button', {name: 'Sites', exact: true});
  const last = group.getByRole('button', {name: 'Operação', exact: true});
  const hover = group.locator(':scope > [data-tab-hover]');
  await first.focus();
  await expectMarker(first, 'data-tab-hover');
  await expect(hover).toHaveCSS('opacity', '1');
  await last.focus();
  await page.setViewportSize({width: 768, height: 1000});

  // A stale tween can overwrite the observer's correct position after an early assertion passes.
  await page.waitForTimeout(550);
  await expect(last).toBeFocused();
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await expectMarker(last, 'data-tab-hover');
  await expect(hover).toHaveCSS('opacity', '1');
});

for (const width of [390, 1440]) {
  test(`o atalho Matheus conclui a rolagem suave e marca o destino em ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 1000});
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    // Exercise a fresh anchor click after the hero starts; the profile image is still lazy-loaded.
    await page.waitForTimeout(1100);
    const navigation = page.getByRole('navigation', {name: 'Navegação principal'});
    const destination = navigation.getByRole('link', {name: 'Matheus', exact: true});
    if (width < 680) await page.getByRole('button', {name: 'Abrir menu', exact: true}).click();
    await destination.click();

    const profile = page.locator('#sobre');
    await expect.poll(() => profile.evaluate(element => element.getBoundingClientRect().top), {timeout: 6000}).toBeLessThanOrEqual(170);
    const headerBottom = await page.locator('header').evaluate(element => element.getBoundingClientRect().bottom);
    expect(await profile.evaluate(element => element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(headerBottom);
    if (width < 680) {
      await expect(page.getByRole('button', {name: 'Abrir menu', exact: true})).toHaveAttribute('aria-expanded', 'false');
      await page.getByRole('button', {name: 'Abrir menu', exact: true}).click();
    }
    await expect(destination).toHaveAttribute('aria-current', 'location');
    await expectMarker(destination, 'data-tab-active', true);
  });
}

test('reduzir movimento durante a troca posiciona o indicador e revela o conteúdo completo', async ({page}) => {
  await page.goto('/');
  const services = page.locator('#solucoes');
  const group = services.getByRole('group', {name: 'Frentes de trabalho'});
  const initial = group.getByRole('button', {name: 'Sites', exact: true});
  const selected = group.getByRole('button', {name: 'Operação', exact: true});
  const title = services.getByRole('heading', {level: 3});
  await initial.focus();
  await expectMarker(initial);
  await selected.click();
  await expect(selected).toHaveAttribute('aria-pressed', 'true');
  await page.emulateMedia({reducedMotion: 'reduce'});
  await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true');
  await expectMarker(selected);
  await expect(title).toHaveText('Da qualidade do cadastro ao acompanhamento das vendas.');
  await expect.poll(() => visualState(title)).toEqual({opacity: 1, displacement: 0});
  await group.getByRole('button', {name: 'Sistemas', exact: true}).click();
  await expectMarker(group.getByRole('button', {name: 'Sistemas', exact: true}));
  await expect(title).toHaveText('Uma ferramenta desenhada para o seu processo.');
  await expect.poll(() => visualState(title)).toEqual({opacity: 1, displacement: 0});
});
