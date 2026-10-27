import {test,expect} from '@playwright/test';
test('todas as seções permanecem dentro da tela em celular, tablet e desktop',async({page})=>{
 await page.goto('/');
 for(const width of [320,390,768,1440,1920]){
  await page.setViewportSize({width,height:1000});
  for(const id of ['inicio','solucoes','automacoes','sobre','processo','contato']){
   await page.locator(`#${id}`).scrollIntoViewIfNeeded();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow ${id} ${width}`).toBe(true);
  }
 }
});
test('menu mobile e movimento reduzido preservam a navegação',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 await page.getByRole('button',{name:'Abrir menu',exact:true}).click();
 await expect(page.getByRole('navigation')).toBeVisible();
 await page.getByRole('navigation').getByRole('link',{name:'Experimente',exact:true}).click();
 await expect(page.getByRole('button',{name:'Abrir menu',exact:true})).toHaveAttribute('aria-expanded','false');
 await page.getByRole('button',{name:'Reduzir animações',exact:true}).click();
 await expect(page.locator('html')).toHaveAttribute('data-reduced-motion','true');
});
