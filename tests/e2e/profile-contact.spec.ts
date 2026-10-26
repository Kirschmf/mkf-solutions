import {test,expect} from '@playwright/test';
test('a escolha da abertura atravessa serviços e briefing até a mensagem correta',async({page})=>{
 await page.goto('/');
 await page.locator('#inicio').getByRole('button',{name:'Automatizar uma rotina'}).click();
 await expect(page.locator('#solucoes').getByRole('button',{name:'Automações',exact:true})).toHaveAttribute('aria-pressed','true');
 const contact=page.locator('#contato');
 await expect(contact.getByRole('button',{name:'Automatizar uma rotina'})).toHaveAttribute('aria-pressed','true');
 await contact.getByRole('button',{name:'Continuar',exact:true}).click();
 await contact.getByRole('button',{name:'Continuar',exact:true}).click();
 await expect(contact.getByRole('alert')).toContainText('uma frase');
 await contact.getByLabel('Seu nome ou empresa').fill('João & Cia?');
 await contact.getByLabel('O que você precisa resolver?').fill('Integrar catálogo & estoque?');
 await contact.getByRole('button',{name:'Continuar',exact:true}).click();
 const href=await contact.getByRole('link',{name:'Abrir conversa no WhatsApp'}).getAttribute('href');
 const url=new URL(href!);expect(url.pathname).toBe('/5551991629355');expect(url.searchParams.get('text')).toContain('João & Cia?');expect(url.searchParams.get('text')).toContain('Automação empresarial');
 await contact.getByRole('button',{name:'Voltar',exact:true}).click();
 await expect(contact.getByLabel('O que você precisa resolver?')).toHaveValue('Integrar catálogo & estoque?');
});
test('clipboard bloqueado oferece texto selecionável sem perder o briefing',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw new Error('blocked');}}});});
 await page.goto('/');const contact=page.locator('#contato');
 await contact.getByRole('button',{name:'Continuar',exact:true}).click();
 await contact.getByLabel('O que você precisa resolver?').fill('Criar um site institucional.');
 await contact.getByRole('button',{name:'Continuar',exact:true}).click();
 await contact.getByRole('button',{name:'Copiar mensagem',exact:true}).click();
 await expect(contact.locator('#brief-fallback')).toHaveValue(/Criar um site institucional/);
 await expect(contact.locator('#brief-fallback')).toBeFocused();
});
test('perfil revela evidências, trajetória e formação sem depender do cursor',async({page})=>{
 await page.goto('/');const profile=page.locator('#sobre');
 await profile.getByRole('tab',{name:'Conectar',exact:true}).click();
 await expect(profile.getByRole('tabpanel')).toContainText(/integra|catálogo|sistemas/i);
 await profile.getByRole('tab',{name:'Conectar',exact:true}).press('ArrowRight');
 await expect(profile.getByRole('tab',{name:'Operar',exact:true})).toHaveAttribute('aria-selected','true');
 await profile.getByRole('button',{name:/Object Edge/}).click();
 await expect(profile.locator('article').filter({hasText:'Specialized'}).first()).toBeVisible();
 await profile.getByText('Formação e certificações',{exact:true}).click();
 await expect(profile.locator('details')).toHaveAttribute('open','');
});
