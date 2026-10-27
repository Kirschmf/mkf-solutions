import {useId} from 'react';
import type {NeedId} from '../../app/types';
import styles from './serviceArtwork.module.css';

function BrowserArtwork({id}:{id:string}){
 return <svg viewBox="0 0 520 220" fill="none" focusable="false">
  <defs><clipPath id={`${id}-image`}><rect x="302" y="83" width="99" height="94" rx="1"/></clipPath></defs>
  <path d="M30 194H491M30 22H491" stroke="#A0C5FF" strokeOpacity=".12"/>
  <g className={styles.draft}>
   <g transform="rotate(-8 140 127)">
    <rect x="43" y="59" width="198" height="137" rx="4" fill="#234882" stroke="#5F85BE"/>
    <path d="M43 79H241" stroke="#5F85BE"/>
    <circle cx="54" cy="69" r="2" fill="#A5C8FC"/><circle cx="62" cy="69" r="2" fill="#A5C8FC"/>
    <rect x="58" y="95" width="65" height="5" fill="#739BCE"/>
    <rect x="58" y="109" width="100" height="3" fill="#476CA0"/>
    <rect x="58" y="124" width="73" height="53" fill="#345E99"/>
    <rect x="140" y="124" width="82" height="53" fill="#173D78"/>
   </g>
  </g>
  <g className={styles.window}>
   <rect x="112" y="35" width="318" height="162" rx="4" fill="#EAF2FF" stroke="#9DC3FF"/>
   <path d="M112 60H430" stroke="#B7C9E3"/>
   <circle cx="124" cy="48" r="2.5" fill="#7396C8"/><circle cx="133" cy="48" r="2.5" fill="#A0B8D9"/><circle cx="142" cy="48" r="2.5" fill="#A0B8D9"/>
   <path d="M355 48H370M378 48H393M401 48H416" stroke="#7591BA" strokeWidth="2"/>
   <text x="136" y="102" fill="#152C51" fontFamily="Georgia, serif" fontSize="29">Sua</text>
   <text x="136" y="131" fill="#152C51" fontFamily="Georgia, serif" fontSize="29">marca.</text>
   <path d="M137 145H242M137 151H222" stroke="#99AFCC" strokeWidth="2"/>
   <rect x="136" y="166" width="60" height="12" rx="1" fill="#2548F4"/>
   <path d="M180 171H186M183 168L186 171L183 174" stroke="#EDF4FF" strokeWidth="1"/>
   <g clipPath={`url(#${id}-image)`}>
    <rect x="302" y="83" width="99" height="94" fill="#2548F4"/>
    <circle className={styles.orbit} cx="370" cy="124" r="35" fill="#94DCEB"/>
    <path d="M295 181V137C295 119 310 104 328 104C346 104 361 119 361 137V181" fill="#162D70"/>
    <path d="M349 184L402 116V184" fill="#A4BEFF"/>
   </g>
  </g>
  <g className={styles.cursor}>
   <path d="M411 164L414 188L420 181L428 187L431 183L423 177L431 173L411 164Z" fill="#80E4ED" stroke="#10284C" strokeWidth="2" strokeLinejoin="round"/>
   <rect x="432" y="187" width="38" height="18" rx="3" fill="#80E4ED"/>
   <text x="441" y="199" fill="#173253" fontSize="9" fontWeight="600">Você</text>
  </g>
 </svg>;
}

function AutomationArtwork(){
 return <svg viewBox="0 0 520 220" fill="none" focusable="false">
  <path d="M21 34H499M21 188H499" stroke="#80B5CB" strokeOpacity=".12"/>
  <path d="M151 113H196C208 113 211 84 227 84H293C309 84 312 113 328 113H360" stroke="#4C7DAD" strokeWidth="1.5"/>
  <path d="M151 113H196C208 113 211 84 227 84H293C309 84 312 113 328 113H360" className={styles.packet} stroke="#82E6EC" strokeWidth="3" strokeLinecap="round" pathLength="100" strokeDasharray="4 96"/>
  <path d="M260 124V155C260 171 276 178 300 178H341" stroke="#4C7DAD" strokeWidth="1.5" strokeDasharray="3 5"/>
  <g className={styles.source}>
   <rect x="25" y="71" width="128" height="90" rx="4" fill="#DDEBFF" stroke="#9ABCF0"/>
   <path d="M25 98H153" stroke="#ADC5E7"/>
   <circle cx="40" cy="85" r="3" fill="#2548F4"/>
   <text x="49" y="89" fill="#173253" fontSize="10" fontWeight="600">Novo pedido</text>
   <rect x="40" y="110" width="22" height="22" rx="2" fill="#A6C7F8"/>
   <path d="M73 115H136M73 124H116M40 145H91" stroke="#84A5CE" strokeWidth="3"/>
   <circle cx="132" cy="145" r="5" fill="#2548F4"/>
  </g>
  <g className={styles.router}>
   <circle cx="260" cy="94" r="39" fill="#2548F4" stroke="#7FA6FF"/>
   <circle cx="260" cy="94" r="30" stroke="#94B0FF" strokeOpacity=".4"/>
   <path d="M243 87H276M270 81L276 87L270 93M277 101H244M250 95L244 101L250 107" stroke="#E9F3FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <g className={styles.output}>
   <rect x="360" y="71" width="135" height="90" rx="4" fill="#173859" stroke="#5F95B3"/>
   <path d="M360 98H495" stroke="#416F91"/>
   <text x="375" y="89" fill="#C6E6F2" fontSize="10" fontWeight="600">Sincronizado</text>
   <path d="M374 115H441M374 125H427M374 141H421" stroke="#5A87A7" strokeWidth="3"/>
   <circle cx="472" cy="135" r="12" fill="#83E3E4"/>
   <path d="M466 135L470 139L478 131" stroke="#153B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <text x="220" y="199" fill="#84B4D0" fontSize="10" letterSpacing="1">ROTINA CONECTADA</text>
 </svg>;
}

function SystemArtwork(){
 return <svg viewBox="0 0 520 220" fill="none" focusable="false">
  <g className={styles.window}>
   <rect x="45" y="22" width="430" height="185" rx="5" fill="#10213E" stroke="#668BBE"/>
   <path d="M45 55H475M152 55V207" stroke="#345277"/>
   <path d="M61 38H66M61 42H71M61 34H71" stroke="#81A7EE" strokeWidth="2"/>
   <text x="81" y="42" fill="#DFEAFE" fontSize="12" fontWeight="500">Seu sistema</text>
   <circle cx="456" cy="39" r="6" fill="#83E3E4"/>
   <rect x="59" y="76" width="78" height="21" rx="2" fill="#284884"/>
   <path d="M69 86H126M69 112H120M69 138H113M69 164H121" stroke="#87A4C9" strokeWidth="3"/>
   <text x="171" y="78" fill="#B9CBE5" fontSize="9">Entrada</text>
   <text x="272" y="78" fill="#B9CBE5" fontSize="9">Em curso</text>
   <text x="373" y="78" fill="#B9CBE5" fontSize="9">Concluído</text>
   <path d="M171 86H252M272 86H353M373 86H454" stroke="#3B5880"/>
   <g className={styles.taskOne}>
    <rect x="170" y="98" width="82" height="44" rx="3" fill="#D6E6FF"/>
    <path d="M180 110H232M180 118H219" stroke="#7F9FCD" strokeWidth="2"/>
    <circle cx="182" cy="132" r="3" fill="#2548F4"/>
   </g>
   <g className={styles.taskTwo}>
    <rect x="272" y="98" width="82" height="64" rx="3" fill="#2548F4" stroke="#7093FF"/>
    <path d="M282 110H333M282 118H321" stroke="#BECFFF" strokeWidth="2"/>
    <path d="M282 137H342" stroke="#5E7FFA" strokeWidth="3"/>
    <path d="M282 137H322" stroke="#8DE5EE" strokeWidth="3"/>
    <circle cx="285" cy="151" r="3" fill="#C6DAFF"/><circle cx="293" cy="151" r="3" fill="#87B0F4"/>
   </g>
   <g className={styles.taskThree}>
    <rect x="373" y="98" width="81" height="44" rx="3" fill="#1B4858" stroke="#4B858F"/>
    <path d="M383 110H434M383 118H415" stroke="#79A8B6" strokeWidth="2"/>
    <path d="M383 130L386 133L391 128" stroke="#8DE5DE" strokeWidth="1.5" strokeLinecap="round"/>
   </g>
   <rect x="170" y="152" width="82" height="40" rx="3" stroke="#3C577B"/>
   <path d="M180 165H229M180 173H217" stroke="#405D84" strokeWidth="2"/>
  </g>
  <g className={styles.systemCursor}>
   <path d="M331 150L334 171L340 165L347 170L350 166L343 161L350 158L331 150Z" fill="#82E6EC" stroke="#12294D" strokeWidth="1.5" strokeLinejoin="round"/>
  </g>
 </svg>;
}

function StoreArtwork(){
 return <svg viewBox="0 0 520 220" fill="none" focusable="false">
  <path d="M29 190H490" stroke="#82A9EE" strokeOpacity=".25"/>
  <g className={styles.window}>
   <rect x="46" y="24" width="351" height="167" rx="4" fill="#E3EDFD" stroke="#88B0F5"/>
   <path d="M46 54H397" stroke="#B1C7E5"/>
   <text x="62" y="44" fill="#1B3565" fontSize="14" fontFamily="Georgia, serif">Sua loja</text>
   <path d="M310 40H328M337 40H355" stroke="#91ACD3" strokeWidth="2"/>
   <path d="M370 38H378L376 44H371L370 38ZM370 38L368 35H366" stroke="#426A9E" strokeWidth="1.2" strokeLinejoin="round"/>
   <rect x="63" y="69" width="136" height="105" fill="#A6C9F8"/>
   <circle cx="137" cy="117" r="42" fill="#C8E0FF"/>
   <g className={styles.product}>
    <rect x="117" y="91" width="36" height="65" rx="10" fill="#F4F4ED" stroke="#93B0D3"/>
    <rect x="125" y="82" width="20" height="13" rx="2" fill="#2548F4"/>
    <rect x="117" y="115" width="36" height="22" fill="#2548F4"/>
    <path d="M126 123H143M126 128H138" stroke="#ADC9FF" strokeWidth="2"/>
   </g>
   <text x="222" y="91" fill="#24436F" fontSize="10" letterSpacing="1">COLEÇÃO</text>
   <path d="M222 105H348M222 113H325" stroke="#708FB9" strokeWidth="3"/>
   <path d="M222 127H339M222 133H312" stroke="#AEC2DE" strokeWidth="2"/>
   <rect x="222" y="149" width="112" height="25" rx="2" fill="#2548F4"/>
   <text x="239" y="165" fill="#F5F8FF" fontSize="10" fontWeight="500">Adicionar</text>
   <path d="M316 158V165M312.5 161.5H319.5" stroke="#DDE8FF"/>
  </g>
  <g className={styles.bag}>
   <path d="M379 103H457L466 193H370L379 103Z" fill="#84E1E5" stroke="#A5EEF1"/>
   <path d="M400 117V93C400 70 437 70 437 93V117" stroke="#D2FAF6" strokeWidth="4" strokeLinecap="round"/>
   <path d="M381 180H455M389 180L385 119M449 180L452 119" stroke="#61BDC6"/>
   <path d="M409 147L416 154L430 140" stroke="#184E74" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
 </svg>;
}

function OperationsArtwork(){
 const bars=[0,5,9,15,18,24,31,36,39,45,51,55,61,68,72,78,83,88];
 return <svg viewBox="0 0 520 220" fill="none" focusable="false">
  <path d="M36 193H488" stroke="#6A9BBC" strokeOpacity=".25"/>
  <g className={styles.parcel}>
   <path d="M76 82L169 45L271 82L177 121L76 82Z" fill="#3B6BA4" stroke="#7FA8D7" strokeLinejoin="round"/>
   <path d="M76 82L177 121V196L76 154V82Z" fill="#254B7E" stroke="#7FA8D7" strokeLinejoin="round"/>
   <path d="M177 121L271 82V154L177 196V121Z" fill="#173E6D" stroke="#7FA8D7" strokeLinejoin="round"/>
   <path d="M116 66L217 105V133L231 127V99L131 60" fill="#91B3DF"/>
   <path d="M92 116L148 139V168L92 145V116Z" fill="#D7E8FC"/>
   <path d="M100 129L140 145M100 135L129 147" stroke="#5C81B1" strokeWidth="2"/>
  </g>
  <path d="M272 142H307C326 142 317 66 340 66H419" stroke="#5787AB" strokeWidth="1.5" strokeDasharray="4 5"/>
  <path d="M272 142H307C326 142 317 66 340 66H419" className={styles.packet} stroke="#8EE8E7" strokeWidth="3" strokeLinecap="round" pathLength="100" strokeDasharray="4 96"/>
  <circle cx="436" cy="66" r="16" fill="#83E3E4"/>
  <path d="M429 66L434 71L443 61" stroke="#164263" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <g className={styles.label}>
   <g transform="rotate(5 354 144)">
    <rect x="286" y="94" width="151" height="108" rx="3" fill="#E3EEFD" stroke="#9AB9DD"/>
    <text x="299" y="113" fill="#173C66" fontSize="12" fontWeight="600">Expedição</text>
    <path d="M299 122H423" stroke="#A6BFD9"/>
    <text x="299" y="137" fill="#456A93" fontSize="9">Pedido · Estoque · Envio</text>
    {bars.map((x,i)=><rect key={x} x={300+x} y="150" width={i%3===0?3:1.5} height="27" fill="#23446D"/>)}
    <path d="M300 188H358M380 188H422" stroke="#A6BFD9" strokeWidth="2"/>
   </g>
  </g>
 </svg>;
}

export default function ServiceArtwork({need}:{need:NeedId}){
 const id=useId().replace(/:/g,'');
 return <div className={`${styles.art} ${styles[need]}`} aria-hidden="true">
  {need==='sites'?<BrowserArtwork id={id}/>:need==='automations'?<AutomationArtwork/>:need==='apps'?<SystemArtwork/>:need==='ecommerce'?<StoreArtwork/>:<OperationsArtwork/>}
 </div>;
}
