import {describe,it,expect} from 'vitest';
import {buildBriefMessage,createWhatsappUrl,validateBrief} from './briefMessage';
const draft={need:'automations' as const,name:'João & Cia?',objective:'Integrar catálogo & estoque?'};
describe('briefing comercial',()=>{
 it('preserva acentos e símbolos na mensagem enviada ao número comercial',()=>{
   const url=new URL(createWhatsappUrl(draft));
   expect(url.hostname).toBe('wa.me');expect(url.pathname).toBe('/5551991629355');
   expect(url.searchParams.get('text')).toContain('João & Cia?');
   expect(url.searchParams.get('text')).toContain('Integrar catálogo & estoque?');
   expect(url.searchParams.get('text')).toContain('Automação empresarial');
 });
 it('permite nome opcional e exige objetivo útil',()=>{
   expect(validateBrief({...draft,name:''})).toEqual({});
   expect(validateBrief({...draft,objective:'  a  '})).toHaveProperty('objective');
   expect(buildBriefMessage({...draft,name:''})).not.toContain('Sou .');
 });
 it('bloqueia contexto e nome acima dos limites sem apagar dados',()=>{
   expect(validateBrief({...draft,objective:'x'.repeat(1501),name:'x'.repeat(121)})).toHaveProperty('objective');
   expect(validateBrief({...draft,objective:'x'.repeat(1501),name:'x'.repeat(121)})).toHaveProperty('name');
 });
});
