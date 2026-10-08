'use strict';
const STORAGE_KEY='ppct-offers-v1';
const keys=['hotel','propertyId','checkin','checkout','adults','children','rooms','room','bed','view','board','cancellation','deadline','payment','availability'];
const normalize=s=>String(s??'').trim().toLowerCase().replace(/\s+/g,' ');
const childAges=s=>String(s??'').split(',').map(x=>x.trim()).filter(Boolean).sort((a,b)=>Number(a)-Number(b)).join(',');
function total(o){return Number(o.subtotal)+Number(o.fees)+Number(o.propertyFees)}
function compare(base,other){
 if(!base)return {status:'No HB baseline',issues:['Add a Halalbooking offer']};
 const issues=[];
 for(const k of keys){if(k==='propertyId'&&(!base[k]||!other[k]))continue;
 if(k==='deadline'&&base.cancellation!=='Free cancellation'&&other.cancellation!=='Free cancellation')continue;
 const a=k==='children'?childAges(base[k]):normalize(base[k]);const b=k==='children'?childAges(other[k]):normalize(other[k]);
 if(a!==b)issues.push(k.replace(/([A-Z])/g,' $1')+' differs');}
 if(normalize(base.currency)!==normalize(other.currency))issues.push('Currency differs — FX required');
 if(base.availability!=='Available'||other.availability!=='Available')issues.push('Offer availability not confirmed');
 return {status:issues.length?'Not equivalent':'Comparable',issues,difference:issues.length?null:total(other)-total(base)};
}
let offers=[];try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');if(Array.isArray(saved))offers=saved}catch{}
const form=document.getElementById('offerForm'),tbody=document.getElementById('results');
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(offers));render()}
function money(v,c){try{return new Intl.NumberFormat('en-GB',{style:'currency',currency:c}).format(v)}catch{return `${v.toFixed(2)} ${c}`}}
function el(tag,text,cls){const node=document.createElement(tag);node.textContent=text??'';if(cls)node.className=cls;return node}
function render(){tbody.replaceChildren();const base=offers.find(x=>x.ota==='Halalbooking');document.getElementById('summary').textContent=`${offers.length} offers • ${base?'HB baseline loaded':'Add Halalbooking baseline'} • ${offers.filter(x=>x.ota!=='Halalbooking'&&compare(base,x).status==='Comparable').length} comparable competitor offers`;
 if(!offers.length){const r=el('tr');const c=el('td','Add a Halalbooking offer and competitor offers to begin.');c.colSpan=7;r.append(c);tbody.append(r);return}
 offers.forEach((o,i)=>{const r=el('tr'),c=compare(base,o);r.append(el('td',o.ota),el('td',money(total(o),o.currency)));
 const delta=o.ota==='Halalbooking'?'Baseline':c.difference===null?'—':`${c.difference>0?'+':''}${money(c.difference,o.currency)} (${total(base)?(c.difference/total(base)*100).toFixed(2):'n/a'}%)`;
 r.append(el('td',delta,c.difference===null?'muted':c.difference<0?'bad':'good'));
 const state=el('td');state.append(el('span',o.ota==='Halalbooking'?'Baseline':c.status,'pill'+(c.status==='Not equivalent'?' warn':c.status==='No HB baseline'?' fail':'')));r.append(state);
 r.append(el('td',o.ota==='Halalbooking'?`${o.board} • ${o.room} • ${o.cancellation}`:c.issues.length?c.issues.join('; '):'Key conditions match'));
 const link=el('td');if(o.url){const a=el('a','View offer');a.href=o.url;a.target='_blank';a.rel='noopener noreferrer';link.append(a)}else link.textContent='—';r.append(link);
 const action=el('td');const b=el('button','Remove','danger');b.type='button';b.addEventListener('click',()=>{offers.splice(i,1);save()});action.append(b);r.append(action);tbody.append(r)});
}
form.addEventListener('submit',e=>{e.preventDefault();const o=Object.fromEntries(new FormData(form).entries());o.currency=o.currency.toUpperCase().trim();if(!/^[A-Z]{3}$/.test(o.currency)){alert('Enter a three-letter ISO currency code');return}if(o.checkout<=o.checkin){alert('Check-out must be after check-in');return}if([o.subtotal,o.fees,o.propertyFees].some(x=>!Number.isFinite(Number(x))||Number(x)<0)){alert('Prices must be non-negative numbers');return}if(o.children&&childAges(o.children).split(',').some(x=>!/^\d+$/.test(x)||Number(x)>17)){alert('Children ages must be between 0 and 17');return}offers.push(o);save();form.reset();form.elements.currency.value='EUR'});
document.getElementById('clear').addEventListener('click',()=>{if(confirm('Remove all offers stored in this browser?')){offers=[];save()}});
function csvCell(v){return '"'+String(v??'').replace(/^[=+\-@\t\r]/,'\'$&').replace(/"/g,'""')+'"'}
document.getElementById('export').addEventListener('click',()=>{if(!offers.length)return;const cols=['ota',...keys,'currency','subtotal','fees','propertyFees','discount','benefits','url','notes'];const rows=[cols.join(','),...offers.map(o=>cols.map(k=>csvCell(o[k])).join(','))];const blob=new Blob(['\ufeff'+rows.join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='property-price-comparison.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
document.getElementById('sample').addEventListener('click',()=>{if(offers.length&&!confirm('Replace current offers with demonstration data?'))return;const common={hotel:'Example Resort',propertyId:'DEMO-001',checkin:'2027-05-12',checkout:'2027-05-17',adults:'2',children:'',rooms:'1',room:'Deluxe Sea View',bed:'King',view:'Sea',board:'BB',cancellation:'Free cancellation',deadline:'2027-05-08T18:00',payment:'Pay now',currency:'EUR',fees:'40',propertyFees:'0',discount:'',benefits:'',availability:'Available',url:'',notes:''};offers=[{...common,ota:'Halalbooking',subtotal:'860'},{...common,ota:'Booking.com',subtotal:'810'},{...common,ota:'Agoda',subtotal:'750',board:'RO'},{...common,ota:'Expedia',subtotal:'800',cancellation:'Non-refundable',deadline:''}];save()});render();
