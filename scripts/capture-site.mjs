import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('qa',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5178',{waitUntil:'networkidle'});await page.waitForTimeout(1200);
await page.screenshot({path:'qa/v2-hero-desktop.png'});
for(const id of ['solucoes','automacoes','sobre','contato']){
 await page.evaluate(id=>window.scrollTo({top:document.getElementById(id).getBoundingClientRect().top+scrollY-85,behavior:'instant'}),id);await page.waitForTimeout(1000);
 await page.screenshot({path:`qa/v2-${id}-desktop.png`});
}
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(500);await page.screenshot({path:'qa/v2-hero-mobile.png'});
console.log(JSON.stringify({errors,mobileOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)}));
await browser.close();
