import {test,expect} from '@playwright/test';
test('avançar e voltar mantém uma sequência de teclado útil no briefing',async({page})=>{
 await page.goto('/');const contact=page.locator('#contato');
 const next=contact.getByRole('button',{name:'Continuar',exact:true});
 await next.focus();await page.keyboard.press('Enter');
 await expect(contact.getByRole('heading',{name:'Qual é o seu contexto?'})).toBeFocused();
 await page.keyboard.press('Tab');await expect(contact.getByLabel('Seu nome ou empresa')).toBeFocused();
 await contact.getByLabel('O que você precisa resolver?').fill('Organizar os pedidos da loja.');
 await next.click();await expect(contact.getByRole('heading',{name:'Sua mensagem está pronta.'})).toBeFocused();
 await contact.getByRole('button',{name:'Voltar',exact:true}).click();
 await page.keyboard.press('Tab');await expect(contact.getByLabel('Seu nome ou empresa')).toBeFocused();
});
