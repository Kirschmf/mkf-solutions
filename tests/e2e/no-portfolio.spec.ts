import {test,expect} from '@playwright/test';
test('o site apresenta serviços sem cases, catálogo ou imagens de projetos',async({page})=>{
 const projectRequests:string[]=[];
 page.on('request',request=>{if(request.url().includes('/assets/projects/'))projectRequests.push(request.url());});
 await page.goto('/?projeto=ferranti-oliveira#portfolio');
 await expect(page.locator('#portfolio')).toHaveCount(0);
 await expect(page.getByRole('link',{name:/Ver todos os projetos|Projetos|portfólio/i})).toHaveCount(0);
 for(const id of ['solucoes','sobre','contato'])await page.locator(`#${id}`).scrollIntoViewIfNeeded();
 await expect(page.locator('img[src*="/assets/projects/"]')).toHaveCount(0);
 await expect(page.locator('a[href*="projeto="]')).toHaveCount(0);
 expect(projectRequests).toEqual([]);
 expect(new URL(page.url()).searchParams.has('projeto')).toBe(false);
 await expect(page.locator('#sobre')).toBeVisible();
 await expect(page.locator('#contato')).toBeVisible();
});
