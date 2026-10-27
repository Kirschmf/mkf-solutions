import {test,expect} from '@playwright/test';

const services=[
  {id:'sites',label:'Sites',intent:'Criar meu site',category:'Site ou landing page'},
  {id:'automations',label:'Automações',intent:'Automatizar uma rotina',category:'Automação empresarial'},
  {id:'apps',label:'Sistemas',intent:'Desenvolver um sistema',category:'Aplicativo ou sistema'},
  {id:'ecommerce',label:'E-commerce',intent:'Montar minha loja',category:'E-commerce'},
  {id:'operations',label:'Operação',intent:'Organizar minhas vendas',category:'Gestão de e-commerce e marketplaces'},
];

test('os cinco serviços mostram descrição e entregáveis juntos, sem selecionar uma aba',async({page})=>{
  await page.goto('/');
  const section=page.locator('#solucoes');
  await expect(section.locator('article[data-service-card]')).toHaveCount(5);
  for(const service of services){
    const card=section.locator(`article[data-service-card="${service.id}"]`);
    await expect(card.getByRole('heading',{name:service.label,exact:true,level:3})).toBeVisible();
    const description=card.locator('p').first();
    await expect(description).toBeVisible();
    expect((await description.innerText()).trim().length).toBeGreaterThan(35);
    await expect(card.getByRole('list')).toBeVisible();
    await expect(card.getByRole('listitem')).toHaveCount(3);
    await expect(card.getByRole('link',{name:`Conversar sobre ${service.label}`,exact:true})).toHaveAttribute('href','#contato');
  }
  await expect(section.getByRole('tablist')).toHaveCount(0);
  await expect(section.getByRole('group',{name:'Frentes de trabalho',exact:true})).toHaveCount(0);
});

test('cada card leva sua categoria ao briefing e à mensagem sem apagar o contexto preenchido',async({page})=>{
  await page.goto('/');
  const contact=page.locator('#contato');
  await contact.getByRole('button',{name:'Continuar',exact:true}).click();
  await contact.getByLabel('Seu nome ou empresa').fill('Loja Horizonte');
  await contact.getByLabel('O que você precisa resolver?').fill('Melhorar o atendimento e conectar nossos dados.');
  await contact.getByRole('button',{name:'Voltar',exact:true}).click();

  for(const service of services){
    const card=page.locator(`#solucoes article[data-service-card="${service.id}"]`);
    const action=card.getByRole('link',{name:`Conversar sobre ${service.label}`,exact:true});
    await action.click();
    await expect(page).toHaveURL(/#contato$/);
    await expect(card).toHaveAttribute('data-selected','true');
    await expect(page.locator('#solucoes article[data-selected="true"]')).toHaveCount(1);
    await expect(contact.getByRole('button',{name:service.intent,exact:true})).toHaveAttribute('aria-pressed','true');
    await contact.getByRole('button',{name:'Continuar',exact:true}).click();
    await expect(contact.getByLabel('Seu nome ou empresa')).toHaveValue('Loja Horizonte');
    await expect(contact.getByLabel('O que você precisa resolver?')).toHaveValue('Melhorar o atendimento e conectar nossos dados.');
    await contact.getByRole('button',{name:'Continuar',exact:true}).click();
    const href=await contact.getByRole('link',{name:'Abrir conversa no WhatsApp',exact:true}).getAttribute('href');
    const url=new URL(href!);
    expect(url.pathname).toBe('/5551991629355');
    const message=url.searchParams.get('text');
    expect(message).toContain(`Tenho interesse em: ${service.category}.`);
    expect(message).toContain('Loja Horizonte');
    expect(message).toContain('Melhorar o atendimento e conectar nossos dados.');
    await contact.getByRole('button',{name:'Voltar',exact:true}).click();
    await contact.getByRole('button',{name:'Voltar',exact:true}).click();
  }
});

test('os cards permitem escolher e continuar somente pelo teclado',async({page})=>{
  await page.goto('/');
  const action=page.locator('#solucoes').getByRole('link',{name:'Conversar sobre Sistemas',exact:true});
  await action.focus();
  await expect(action).toBeFocused();
  await action.press('Enter');
  await expect(page).toHaveURL(/#contato$/);
  const contact=page.locator('#contato');
  await expect(contact.getByRole('button',{name:'Desenvolver um sistema',exact:true})).toHaveAttribute('aria-pressed','true');
  const next=contact.getByRole('button',{name:'Continuar',exact:true});
  await next.focus();
  await next.press('Enter');
  await expect(contact.getByRole('heading',{name:'Qual é o seu contexto?',exact:true})).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(contact.getByLabel('Seu nome ou empresa')).toBeFocused();
});
