import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.describe('local operational laboratory',()=>{
  test.beforeEach(async({page})=>{await page.goto('/');await page.locator('#automacoes').scrollIntoViewIfNeeded();});
  test('stops auto execution at payment and downloads the real completed order',async({page})=>{
    const lab=page.locator('#automacoes');
    await lab.getByRole('button',{name:'Executar automaticamente',exact:true}).click();
    await expect(lab.getByRole('button',{name:'Confirmar pagamento de teste',exact:true})).toBeVisible();
    await expect(lab.getByText('Registro concluído', {exact:true})).toHaveCount(0);
    await lab.getByRole('button',{name:'Confirmar pagamento de teste',exact:true}).click();
    await expect(lab.getByRole('button',{name:'Baixar pedido.json'})).toBeVisible();
    await expect(lab.getByTestId('stock-result')).toHaveText('5 → 3 unidades');
    const download=page.waitForEvent('download');
    await lab.getByRole('button',{name:'Baixar pedido.json'}).click();
    const file=await download;
    expect(file.suggestedFilename()).toBe('pedido.json');
    const snapshot=JSON.parse(await readFile((await file.path())!,'utf8'));
    expect(snapshot.order.totalCents).toBe(25800);
    expect(snapshot.stock).toEqual({before:5,after:3});
    expect(snapshot.environment).toBe('Demonstração local');
  });
  test('a changed quantity requires commercial approval and input edits require restarting',async({page})=>{
    const lab=page.locator('#automacoes');
    await lab.getByLabel('Quantidade',{exact:true}).fill('3');
    await expect(lab.getByTestId('order-total')).toHaveText(/378,00/);
    await lab.getByRole('button',{name:'Executar automaticamente',exact:true}).click();
    await expect(lab.getByRole('button',{name:'Aprovar pedido',exact:true})).toBeVisible();
    await lab.getByLabel('Quantidade',{exact:true}).fill('2');
    await expect(lab.getByRole('button',{name:'Reiniciar com estes dados',exact:true})).toBeVisible();
    await lab.getByRole('button',{name:'Reiniciar com estes dados',exact:true}).click();
    await expect(lab.getByTestId('workflow-status')).toHaveText('Pronto para começar');
  });
  test('recovers a simulated registration error with one stock debit',async({page})=>{
    const lab=page.locator('#automacoes');
    await lab.getByLabel('Cenário da demonstração').selectOption('failure');
    await lab.getByRole('button',{name:'Executar automaticamente',exact:true}).click();
    await lab.getByRole('button',{name:'Confirmar pagamento de teste',exact:true}).click();
    await expect(lab.getByRole('button',{name:'Corrigir falha e tentar novamente',exact:true})).toBeVisible();
    await lab.getByRole('button',{name:'Corrigir falha e tentar novamente',exact:true}).click();
    await expect(lab.getByTestId('stock-result')).toHaveText('5 → 3 unidades');
    await expect(lab.getByRole('button',{name:'Baixar itens.csv'})).toBeVisible();
  });
  test('pausing and restarting invalidate scheduled transitions',async({page})=>{
    const lab=page.locator('#automacoes');
    await lab.getByRole('button',{name:'Executar automaticamente',exact:true}).click();
    await lab.getByRole('button',{name:'Pausar',exact:true}).click();
    await expect(lab.getByTestId('workflow-status')).toHaveText('Execução pausada');
    await page.waitForTimeout(1000);
    await expect(lab.getByTestId('workflow-status')).toHaveText('Execução pausada');
    await lab.getByRole('button',{name:'Reiniciar demonstração',exact:true}).click();
    await page.waitForTimeout(1000);
    await expect(lab.getByTestId('workflow-status')).toHaveText('Pronto para começar');
  });
  test('insufficient stock can be replenished on a touch viewport',async({page})=>{
    await page.setViewportSize({width:390,height:844});
    const lab=page.locator('#automacoes');
    await lab.getByLabel('Cenário da demonstração').selectOption('stock');
    await lab.getByRole('button',{name:'Executar automaticamente',exact:true}).click();
    await expect(lab.getByRole('button',{name:'Simular reposição',exact:true})).toBeVisible();
    await lab.getByRole('button',{name:'Simular reposição',exact:true}).click();
    await expect(lab.getByRole('button',{name:'Confirmar pagamento de teste',exact:true})).toBeVisible();
    await lab.getByRole('button',{name:'Visão geral do mapa',exact:true}).click();
    await expect(page.getByRole('dialog',{name:'Mapa da demonstração'})).toBeVisible();
  });
  test('inspects nodes and transferred data with the keyboard',async({page})=>{
    const lab=page.locator('#automacoes');
    await lab.getByRole('button',{name:'Etapa 3: Conferir estoque',exact:true}).focus();
    await page.keyboard.press('Enter');
    await expect(lab.getByRole('complementary').getByRole('heading',{name:'Conferir estoque',exact:true})).toBeVisible();
    await lab.getByRole('button',{name:'Próximo passo',exact:true}).click();
    await lab.getByRole('button',{name:'Visão geral do mapa',exact:true}).click();
    const map=page.getByRole('dialog',{name:'Mapa da demonstração'});
    await expect(map).toBeVisible();
    await map.getByTestId('rf__edge-edit-validate').focus();
    await page.keyboard.press('Enter');
    await expect(map).toBeHidden();
    await expect(lab.getByRole('heading',{name:'Dados em trânsito',exact:true})).toBeVisible();
    await expect(lab.getByRole('complementary').getByText('Pedido recebido para validação.',{exact:true})).toBeVisible();
  });
  test('passes a locally routed contact into the guided briefing',async({page})=>{
    const lab=page.locator('#automacoes');
    await lab.getByRole('tab',{name:/Do contato ao briefing/}).click();
    await lab.getByLabel('O que você precisa?',{exact:true}).selectOption('automations');
    await lab.getByLabel('Contexto da rotina').fill('Conectar pedidos da loja ao estoque todos os dias.');
    await lab.getByRole('tab',{name:/Do pedido ao acompanhamento/}).click();
    await lab.getByRole('tab',{name:/Do contato ao briefing/}).click();
    await expect(lab.getByLabel('Contexto da rotina')).toHaveValue('Conectar pedidos da loja ao estoque todos os dias.');
    await expect(lab.getByLabel('O que você precisa?',{exact:true})).toHaveValue('automations');
    await lab.getByRole('button',{name:/Aplicar regra de encaminhamento/}).click();
    await expect(lab.getByRole('heading',{name:'Automação e integração',exact:true})).toBeVisible();
    await lab.getByRole('tab',{name:/Do pedido ao acompanhamento/}).click();
    await lab.getByRole('tab',{name:/Do contato ao briefing/}).click();
    await expect(lab.getByRole('heading',{name:'Automação e integração',exact:true})).toBeVisible();
    await lab.getByRole('button',{name:/Preparar briefing/}).click();
    await lab.getByRole('button',{name:/Levar contexto ao contato/}).click();
    await expect(page).toHaveURL(/#contato$/);
    await expect(page.locator('#contato').getByRole('button',{name:'Automatizar uma rotina',exact:true})).toHaveAttribute('aria-pressed','true');
  });
  test('a jornada anima somente a execução real e respeita a redução de movimento',async({page})=>{
    await page.emulateMedia({reducedMotion:'no-preference'});
    const lab=page.locator('#automacoes');
    const journey=lab.getByTestId('workflow-journey');
    const packet=journey.locator('[data-workflow-packet]');
    await expect(journey).toHaveAttribute('data-stage','edit');
    await expect(packet).toHaveCSS('opacity','0');

    // Inspecionar é uma leitura: não executa o pedido nem dispara o pacote.
    await journey.getByRole('button',{name:'Etapa 3: Conferir estoque',exact:true}).click();
    await expect(journey).toHaveAttribute('data-stage','edit');
    await expect(packet).toHaveCSS('opacity','0');
    await expect(lab.getByTestId('workflow-status')).toHaveText('Pronto para começar');

    await lab.getByRole('button',{name:'Próximo passo',exact:true}).click();
    await expect(journey).toHaveAttribute('data-stage','validate');
    await expect.poll(()=>packet.evaluate(element=>Number(getComputedStyle(element).opacity)),{intervals:[10,20]}).toBeGreaterThan(0);
    const start=await packet.boundingBox();
    await expect.poll(async()=>{
      const current=await packet.boundingBox();
      return current&&start?Math.hypot(current.x-start.x,current.y-start.y):0;
    },{intervals:[20]}).toBeGreaterThan(3);

    await page.emulateMedia({reducedMotion:'reduce'});
    await expect(page.locator('html')).toHaveAttribute('data-reduced-motion','true');
    await expect(packet).toHaveCSS('opacity','0');
    await lab.getByRole('button',{name:'Próximo passo',exact:true}).click();
    await expect(journey).toHaveAttribute('data-stage','stock');
    await expect(packet).toHaveCSS('opacity','0');
    await expect(lab.getByTestId('workflow-status')).toHaveText('Execução em andamento');
    await expect(journey.getByRole('button',{name:'Etapa 3: Conferir estoque',exact:true})).toHaveAttribute('aria-current','step');
  });
});

