"use strict";
const {readFileSync,existsSync}=require("node:fs"),assert=require("node:assert/strict");
for(const p of ["index.html","styles.css","app.js","config.js","favicon.svg",".nojekyll","docs/DESIGN_SYSTEM.md"]){assert.ok(existsSync(p),"Missing "+p);}
const html=readFileSync("index.html","utf8"),css=readFileSync("styles.css","utf8"),js=readFileSync("app.js","utf8");
for(const id of ["entry-form","entries","group-filter","file","demo","export","import"]){assert.ok(html.includes('id="'+id+'"'),"Missing component: "+id);}
assert.ok(css.includes("prefers-reduced-motion"));assert.ok(js.includes("localStorage"));assert.ok(js.includes("textContent"));
console.log("PASS: static accessibility and local data structure.");
