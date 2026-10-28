"use strict";
const {chromium}=require("playwright"),{spawn}=require("node:child_process"),fs=require("node:fs");
fs.mkdirSync("screenshots",{recursive:true});
const server=spawn("python3",["-m","http.server","8755","--bind","127.0.0.1"],{stdio:"ignore"});
const sleep=n=>new Promise(resolve=>setTimeout(resolve,n));
(async()=>{
 await sleep(750);
 const browser=await chromium.launch(process.env.BROWSER_CHANNEL==="chrome"?{channel:"chrome",headless:true}:{headless:true});
 const results=[],viewports=[320,390,768,1366,1600];
 try{for(const width of viewports){
  const viewport={width,height:width<500?750:850};
  const ctx=await browser.newContext({viewport,reducedMotion:"reduce",acceptDownloads:true}),page=await ctx.newPage();
  const errors=[];page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error")errors.push(m.text())});
  page.on("response",r=>{if(r.status()>=400&&r.url().startsWith("http://127.0.0.1:8755"))errors.push(r.status()+" "+r.url())});
  try{
   const response=await page.goto("http://127.0.0.1:8755/",{waitUntil:"load"});if(response.status()!==200)errors.push("Home status "+response.status());
   await page.getByRole("heading",{level:1}).waitFor();
   if(await page.locator("#entries article").count()!==0)errors.push("First visit must be empty");
   await page.getByRole("button",{name:/Carregar exemplos/i}).click();
   const expected=Number(await page.locator("body").getAttribute("data-demo-count"));
   if(await page.locator("#entries article").count()!==expected)errors.push("Demo count");
   await page.reload();
   if(await page.locator("#entries article").count()!==expected)errors.push("LocalStorage did not persist");
   await page.locator("#entries article").first().getByRole("button",{name:"Editar"}).click();
   const input=page.locator("#field-"+await page.locator("body").getAttribute("data-primary-field"));
   const original=await input.inputValue();await input.fill(original+" teste");
   await page.getByRole("button",{name:"Atualizar anotação"}).click();
   if(!await page.locator("#entries").getByText(original+" teste",{exact:true}).count())errors.push("Edit did not update");
   const downloadPromise=page.waitForEvent("download");
   await page.getByRole("button",{name:"Exportar JSON"}).click();
   const download=await downloadPromise;if(!download.suggestedFilename().endsWith(".json"))errors.push("Export failed");
   page.once("dialog",dlg=>dlg.accept());
   await page.locator("#entries article").first().getByRole("button",{name:"Excluir"}).click();
   if(await page.locator("#entries article").count()!==expected-1)errors.push("Delete failed");
   const offenders=await page.evaluate(()=>[...document.querySelectorAll("body *")].filter(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.position!=="fixed"&&s.display!=="none"&&r.width>0&&r.right>innerWidth+2}).slice(0,6).map(el=>el.tagName+"."+(String(el.className||"").replaceAll(" ","."))));
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))errors.push("Horizontal overflow: "+offenders.join(", "));
   await page.screenshot({path:"screenshots/"+width+".png",fullPage:true,animations:"disabled"});
   results.push({width,passed:errors.length===0,errors});
  }catch(e){errors.push(String(e));results.push({width,passed:false,errors})}
  finally{await ctx.close()}
 }}
 finally{await browser.close();server.kill()}
 fs.writeFileSync("screenshots/report.json",JSON.stringify(results,null,2));
 results.forEach(r=>console.log(JSON.stringify(r)));
 if(results.length!==viewports.length||results.some(r=>!r.passed))process.exitCode=1;
})().catch(e=>{console.error(e);server.kill();process.exitCode=1});
