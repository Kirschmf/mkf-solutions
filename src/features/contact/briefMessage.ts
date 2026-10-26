import type {BriefDraft,NeedId} from '../../app/types';
const names:Record<NeedId,string>={sites:'Site ou landing page',automations:'Automação empresarial',apps:'Aplicativo ou sistema',ecommerce:'E-commerce',operations:'Gestão de e-commerce e marketplaces'};
export function validateBrief(draft:BriefDraft):{name?:string;objective?:string}{
 const errors:{name?:string;objective?:string}={};
 if(draft.name.length>120)errors.name='Use até 120 caracteres para o nome.';
 if(draft.objective.trim().length<3)errors.objective='Conte em uma frase o que você precisa resolver.';
 if(draft.objective.length>1500)errors.objective='Resuma seu objetivo em até 1.500 caracteres.';
 return errors;
}
export function buildBriefMessage(draft:BriefDraft):string{
 return ['Olá, MKF Solutions!',draft.name.trim()?`Sou ${draft.name.trim()}.`:null,`Tenho interesse em: ${names[draft.need]}.`,`Meu objetivo: ${draft.objective.trim()}`,'Podemos conversar sobre escopo e próximos passos?'].filter(Boolean).join('\n\n');
}
export function createWhatsappUrl(draft:BriefDraft):string{return `https://wa.me/5551991629355?text=${encodeURIComponent(buildBriefMessage(draft))}`;}
