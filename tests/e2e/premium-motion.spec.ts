import {test, expect, type Locator} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.emulateMedia({reducedMotion: 'no-preference'});
});

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

test('reduzir movimento na entrada dos cards deixa todas as ações legíveis', async ({page}) => {
  await page.goto('/');
  const services = page.locator('#solucoes');
  const cards = services.locator('article[data-service-card]');
  await expect(cards).toHaveCount(5);
  await services.evaluate(element => element.scrollIntoView({block: 'start', behavior: 'instant'}));
  await expect.poll(async () => (await visualState(cards.first())).opacity, {intervals: [10]}).toBeLessThan(.98);
  await page.emulateMedia({reducedMotion: 'reduce'});
  await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true');
  for (const card of await cards.all()) {
    await expect.poll(() => visualState(card)).toEqual({opacity: 1, displacement: 0});
    await expect(card.getByRole('heading', {level: 3})).toBeVisible();
    await expect(card.getByRole('link', {name: /^Conversar sobre /})).toBeVisible();
  }
});

test('alternar as perguntas remove a resposta fechada da leitura acessível', async ({page}) => {
  await page.goto('/');
  const firstQuestion = page.getByRole('button', {name: 'Você atende empresas de outras cidades?', exact: true});
  const secondQuestion = page.getByRole('button', {name: 'Já tenho um site ou sistema. Você consegue trabalhar nele?', exact: true});
  const firstAnswer = page.locator('#faq-answer-0');
  const secondAnswer = page.locator('#faq-answer-1');
  await firstQuestion.click();
  await expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
  await expect(firstAnswer).toBeVisible();
  await secondQuestion.click();
  await expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');
  expect(await firstAnswer.ariaSnapshot()).toBe('');
  await expect(firstAnswer).toBeHidden();
  await expect(secondAnswer).toBeVisible();
  await secondQuestion.click();
  expect(await secondAnswer.ariaSnapshot()).toBe('');
  await expect(secondAnswer).toBeHidden();
  await firstQuestion.focus();
  await page.keyboard.press('Tab');
  await expect(secondQuestion).toBeFocused();
});

test('trocas rápidas de perspectiva e trajetória deixam a escolha final legível', async ({page}) => {
  await page.goto('/');
  const profile = page.locator('#sobre');
  for (const name of ['Conectar', 'Operar', 'Construir', 'Operar']) {
    await profile.getByRole('tab', {name, exact: true}).click();
  }
  await expect(profile.getByRole('tab', {name: 'Operar', exact: true})).toHaveAttribute('aria-selected', 'true');
  const perspective = profile.getByRole('tabpanel');
  await expect(perspective).toContainText('Conhecer o que acontece depois da entrega.');
  await perspective.scrollIntoViewIfNeeded();
  await expect.poll(() => visualState(perspective)).toEqual({opacity: 1, displacement: 0});
  const activity = profile.getByRole('heading', {name: 'Evolução de lojas', exact: true});
  await activity.evaluate(element => element.scrollIntoView({block: 'center', behavior: 'instant'}));
  await expect(activity).toBeVisible();
  await expect.poll(() => visualState(activity)).toEqual({opacity: 1, displacement: 0});
  for (const name of [/Exército Brasileiro/, /Object Edge/, /Truth Commerce \/ MKF/, /Object Edge/]) {
    await profile.getByRole('button', {name}).click();
  }
  const careerTitle = profile.getByRole('heading', {name: 'Full Stack Developer', exact: true});
  await careerTitle.scrollIntoViewIfNeeded();
  await expect(careerTitle).toBeVisible();
  await expect.poll(() => visualState(careerTitle)).toEqual({opacity: 1, displacement: 0});
});

test('trocas rápidas do processo mantêm os entregáveis da última etapa visíveis', async ({page}) => {
  await page.goto('/');
  const process = page.locator('#processo');
  for (const name of [/Entrega/, /Desenvolvimento/, /Escopo/, /Validação/, /Entrega/]) {
    await process.getByRole('button', {name}).click();
  }
  await expect(process.getByRole('button', {name: /Entrega/})).toHaveAttribute('aria-pressed', 'true');
  const title = process.getByRole('heading', {name: 'Colocar o trabalho em uso.', exact: true});
  const result = process.getByText('Projeto entregue e próximos passos claros.', {exact: true});
  await title.scrollIntoViewIfNeeded();
  await expect(title).toBeVisible();
  await expect(result).toBeVisible();
  await expect.poll(() => visualState(title)).toEqual({opacity: 1, displacement: 0});
  await expect.poll(() => visualState(result)).toEqual({opacity: 1, displacement: 0});
});

test('focar uma ação antes da entrada expõe o controle inteiro imediatamente', async ({page}) => {
  await page.goto('/');
  const action = page.locator('#solucoes').getByRole('link', {name: 'Conversar sobre Sites', exact: true});
  await action.focus();
  await expect(action).toBeFocused();
  const opacity = await action.evaluate(element => new Promise<number>(resolve => {
    requestAnimationFrame(() => {
      let opacity = 1;
      for (let node: Element | null = element; node && node.tagName !== 'SECTION'; node = node.parentElement) {
        opacity *= Number(getComputedStyle(node).opacity);
      }
      resolve(opacity);
    });
  }));
  expect(opacity).toBe(1);
  await expect.poll(() => action.evaluate(element => {
    const box = element.getBoundingClientRect();
    const points = [[box.left + 3, box.top + 3], [box.right - 3, box.top + 3], [box.left + 3, box.bottom - 3], [box.right - 3, box.bottom - 3]];
    return points.every(([x, y]) => element.contains(document.elementFromPoint(x, y)));
  })).toBe(true);
});

test('reativar as animações mantém o site inteiro disponível sem erros', async ({page}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', {name: 'Reduzir animações', exact: true}).click();
  await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true');
  await page.getByRole('button', {name: 'Ativar animações', exact: true}).click();
  await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'false');
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  expect(pageErrors).toEqual([]);
  const next = page.locator('#contato').getByRole('button', {name: 'Continuar', exact: true});
  await expect.poll(() => visualState(next)).toEqual({opacity: 1, displacement: 0});
  for (const id of ['inicio', 'solucoes', 'automacoes', 'sobre', 'processo', 'contato']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await expect(page.locator('#inicio').getByRole('heading', {level: 1})).toBeVisible();
  expect(pageErrors).toEqual([]);
});
