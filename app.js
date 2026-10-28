"use strict";
(()=>{
const config=window.JOURNAL_CONFIG;
const KEY=config.id+"-v1",MAX=250,keys=config.fields.map(f=>f.key),$=s=>document.querySelector(s);
const elements={form:$("#entry-form"),entries:$("#entries"),empty:$("#empty"),filter:$("#group-filter"),search:$("#search"),status:$("#results-status"),notice:$("#notice"),insights:$("#insights")};
let records=[],editing=null;
const now=()=>new Date().toISOString();
const safeText=value=>String(value||"").trim();
const keyOf=item=>config.groupFields.map(k=>safeText(item[k])).join(" / ");
const id=()=>crypto.randomUUID();
function announce(message){elements.notice.textContent=message;elements.notice.hidden=false;}
function newNode(tag,className,text){const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=String(text);return n;}
function valid(record){
  if(!record||typeof record!=="object"||typeof record.id!=="string"||record.id.length>100||!record.id||!Number.isFinite(Date.parse(record.updatedAt)))return false;
  return config.fields.every(f=>{
    const v=record[f.key];
    if(f.type==="number")return Number.isInteger(v)&&v>=f.min&&v<=f.max;
    if(typeof v!=="string"||v.length>(f.maxLength||100))return false;
    if(f.required&&!v.trim())return false;
    if(f.type==="select"&&!f.options.includes(v))return false;
    if(f.type==="date"&&!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;
    return true;
  });
}
function load(){
  try{
    const text=localStorage.getItem(KEY);if(!text)return [];
    const parsed=JSON.parse(text);
    if(parsed.app!==config.id||parsed.version!==1||!Array.isArray(parsed.entries)||parsed.entries.length>MAX||!parsed.entries.every(valid)||new Set(parsed.entries.map(x=>x.id)).size!==parsed.entries.length)throw Error("invalid backup");
    return parsed.entries;
  }catch{announce("Dados locais inválidos. Você pode recuperar um backup JSON.");return [];}
}
function save(){
  try{localStorage.setItem(KEY,JSON.stringify({app:config.id,version:1,entries:records}));return true;}
  catch{announce("Armazenamento indisponível. Exporte os dados antes de fechar esta aba.");return false;}
}
function buildForm(){
  for(const field of config.fields){
    const group=newNode("div","field"),label=newNode("label","",field.label);
    label.htmlFor="field-"+field.key;group.append(label);
    let control;
    if(field.type==="textarea"){control=newNode("textarea");control.rows=3;control.maxLength=field.maxLength||500;}
    else if(field.type==="select"){control=newNode("select");for(const option of field.options){const o=newNode("option","",option);o.value=option;control.append(o);}}
    else{control=newNode("input");control.type=field.type;if(field.maxLength)control.maxLength=field.maxLength;if(field.type==="number"){control.min=field.min;control.max=field.max;control.step=1;control.value=String(field.min||0);}if(field.type==="date")control.value=new Date().toISOString().slice(0,10);}
    control.id=label.htmlFor;control.name=field.key;control.required=!!field.required;if(field.placeholder)control.placeholder=field.placeholder;
    group.append(control);elements.form.insertBefore(group,$("#form-buttons"));
  }
}
function formValues(){
  const value={id:editing||id(),updatedAt:now()};
  for(const field of config.fields){
    const control=$("#field-"+field.key),raw=control.value;
    value[field.key]=field.type==="number"?Number(raw):raw.trim();
  }
  return value;
}
function startNew(){editing=null;elements.form.reset();$("#submit").textContent="Salvar anotação";$("#cancel").hidden=true;for(const f of config.fields){if(f.type==="date")$("#field-"+f.key).value=new Date().toISOString().slice(0,10);}}
function renderGroups(){
  const selected=elements.filter.value,groups=[...new Set(records.map(keyOf))].sort((a,b)=>a.localeCompare(b,"pt-BR"));
  elements.filter.replaceChildren(newNode("option","","Todos os grupos"));elements.filter.firstElementChild.value="";
  for(const group of groups){const opt=newNode("option","",group);opt.value=group;elements.filter.append(opt);}
  elements.filter.value=groups.includes(selected)?selected:"";
  const container=elements.insights;container.replaceChildren();
  if(!groups.length){container.append(newNode("p","", "Sem comparações até registrar anotações."));return;}
  const data=groups.map(name=>{
    const items=records.filter(x=>keyOf(x)===name);
    let detail=items.length+" registro"+(items.length===1?"":"s");
    if(config.metric){const avg=items.reduce((sum,x)=>sum+x[config.metric],0)/items.length;detail+=" · média de colocação "+avg.toFixed(1).replace(".",",")+" (tabuleiro)";}
    else if(config.id==="tft-economy-review"){detail+=" · decisões manuais";}
    else detail+=" · notas de aprendizado";
    return {name,items,detail};
  });
  data.sort((a,b)=>b.items.length-a.items.length);
  for(const item of data.slice(0,12)){
    const card=newNode("article","insight");
    card.append(newNode("strong","",item.name),newNode("p","",item.detail));
    container.append(card);
  }
  if(config.metric)container.append(newNode("p","insights-warning","As médias vêm de anotações manuais e amostras pequenas. Compare apenas dentro do mesmo Set e patch; a colocação é do tabuleiro inteiro."));
}
function recordCard(r){
 const article=newNode("article","entry-card");
 const head=newNode("div","card-head"),title=newNode("h3","",r[config.titleField]);
 head.append(title,newNode("span","date-pill",r.date||"Sem data"));article.append(head);
 const meta=newNode("dl","meta");
 for(const f of config.fields){
  if(["date",config.titleField].includes(f.key)||f.type==="textarea")continue;
  const row=newNode("div","meta-row");row.append(newNode("dt","",f.label),newNode("dd","",r[f.key]===undefined?"":r[f.key]));meta.append(row);
 }article.append(meta);
 for(const f of config.fields.filter(x=>x.type==="textarea")){
   const body=newNode("div","note");body.append(newNode("strong","",f.label),newNode("p","",r[f.key]||"Sem observação"));article.append(body);
 }
 const actions=newNode("div","card-actions");
 for(const [action,label] of [["edit","Editar"],["delete","Excluir"]]){
   const b=newNode("button",action==="delete"?"danger":"",label);b.type="button";b.dataset.action=action;b.dataset.id=r.id;actions.append(b);
 }article.append(actions);return article;
}
function render(){
 renderGroups();const search=elements.search.value.trim().toLocaleLowerCase("pt-BR"),group=elements.filter.value;
 const found=[...records].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).filter(r=>(!group||keyOf(r)===group)&&(!search||keys.some(k=>String(r[k]).toLocaleLowerCase("pt-BR").includes(search))));
 elements.entries.replaceChildren(...found.map(recordCard));
 $("#total").textContent=records.length;
 $("#groups-total").textContent=new Set(records.map(keyOf).values()).size;
 $("#visible-total").textContent=found.length;
 elements.status.textContent=found.length+" anotaç"+(found.length===1?"ão exibida":"ões exibidas");
 elements.empty.hidden=records.length!==0;
 if(records.length>0&&!found.length)elements.entries.append(newNode("p","empty-search","Nenhum registro corresponde aos filtros."));
}
buildForm();records=load();startNew();render();
elements.form.addEventListener("submit",event=>{
 event.preventDefault();if(!elements.form.reportValidity())return;
 const record=formValues();if(!valid(record)){announce("Revise os campos antes de salvar.");return;}
 const index=records.findIndex(r=>r.id===editing);
 if(index>=0)records[index]=record;
 else{if(records.length>=MAX){announce("Limite de 250 registros atingido.");return;}records.push(record);}
 save();startNew();render();announce("Anotação salva neste navegador.");
 $("#registros").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
});
$("#cancel").addEventListener("click",()=>{startNew();announce("Edição cancelada.");});
elements.entries.addEventListener("click",event=>{
 const b=event.target.closest("button[data-action]");if(!b)return;
 const index=records.findIndex(r=>r.id===b.dataset.id);if(index<0)return;
 const record=records[index];
 if(b.dataset.action==="edit"){
  editing=record.id;
  for(const f of config.fields)$("#field-"+f.key).value=record[f.key];
  $("#submit").textContent="Atualizar anotação";$("#cancel").hidden=false;
  $("#novo").scrollIntoView({behavior:"instant"});$("#field-"+config.fields[0].key).focus({preventScroll:true});return;
 }
 if(b.dataset.action==="delete"&&confirm("Excluir este registro do navegador?")){
  records.splice(index,1);if(editing===record.id)startNew();save();render();announce("Registro excluído.");
 }
});
elements.filter.addEventListener("change",()=>{render();});
elements.search.addEventListener("input",()=>{render();});
$("#demo").addEventListener("click",()=>{
 if(records.length&&!confirm("Substituir registros por exemplos fictícios?"))return;
 records=config.demo.map((r,i)=>({...r,id:"demo-"+i+"-"+config.id,updatedAt:now()}));
 elements.search.value="";elements.filter.value="";save();render();announce("Exemplos fictícios carregados. Não são partidas reais.");
});
$("#export").addEventListener("click",()=>{
 const blob=new Blob([JSON.stringify({app:config.id,version:1,entries:records},null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=newNode("a");
 a.href=url;a.download=config.id+"-backup.json";document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);announce("Backup JSON preparado. Salve o arquivo com segurança.");
});
$("#import").addEventListener("click",()=>$("#file").click());
$("#file").addEventListener("change",async event=>{
 const file=event.target.files?.[0];event.target.value="";if(!file)return;
 if(file.size>1024*1024){announce("Backup acima de 1 MB, importação recusada.");return;}
 try{
  const obj=JSON.parse(await file.text());
  if(obj.app!==config.id||obj.version!==1||!Array.isArray(obj.entries)||obj.entries.length>MAX||!obj.entries.every(valid)||new Set(obj.entries.map(x=>x.id)).size!==obj.entries.length)throw Error("invalid");
  if(records.length&&!confirm("Substituir todos os registros atuais por este backup?"))return;
  records=obj.entries.map(r=>({...r}));elements.search.value="";elements.filter.value="";
  startNew();save();render();announce("Backup importado.");
 }catch{announce("Arquivo incompatível. Os registros anteriores foram preservados.");}
});
})();