"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const HTML_PATH = path.join(ROOT, "assets", "ai-reading-companion.html");
const SKILL_PATH = path.join(ROOT, "SKILL.md");
const README_PATH = path.join(ROOT, "README.md");
const META_PATH = path.join(ROOT, "_meta.json");
const html = fs.readFileSync(HTML_PATH, "utf8");
const skill = fs.readFileSync(SKILL_PATH, "utf8");
const readme = fs.readFileSync(README_PATH, "utf8");
const meta = JSON.parse(fs.readFileSync(META_PATH, "utf8"));

test("release metadata and permission are 1.4.1 + Read only", () => {
  assert.match(skill, /^version: 1\.4\.1$/m);
  assert.match(skill, /^allowed-tools: Read$/m);
  assert.equal(meta.version, "1.4.1");
  assert.match(html, /weread-socrates v1\.4\.1/);
  assert.doesNotMatch(skill, /allowed-tools:.*(?:Bash|Write|Edit|WebFetch|WebSearch)/);
});

test("runtime is one self-contained file with strict offline CSP", () => {
  assert.equal(fs.readdirSync(path.join(ROOT, "assets")).sort().join(","), "ai-reading-companion.html");
  assert.match(html, /<style>[\s\S]*<\/style>/);
  assert.match(html, /<script>[\s\S]*<\/script>/);
  assert.match(html, /connect-src 'none'/);
  assert.doesNotMatch(html, /<(?:script|link|img|iframe|audio|video)\b[^>]+(?:src|href)=/i);
  assert.doesNotMatch(html, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\s*\(/);
  assert.doesNotMatch(html, /https?:\/\//i);
  assert.doesNotMatch(html, /\b(?:api[_-]?key|token|cookie|process\.env|localhost|server\.js)\b/i);
});

test("legacy privileged runtime files and directories are absent", () => {
  [
    "scripts",
    "references",
    "assets/server.js",
    "assets/app.js",
    "assets/app.css",
    "assets/mermaid.min.js",
  ].forEach((name) => assert.equal(fs.existsSync(path.join(ROOT, name)), false, `${name} must not exist`));
});

test("language is explicit zh/en and defaults to und", () => {
  assert.match(html, /<html lang="und">/);
  assert.match(html, /data-language="zh"/);
  assert.match(html, /data-language="en"/);
  assert.match(html, /document\.documentElement\.lang=language/);
  assert.match(html, /document\.documentElement\.lang="und"/);
  assert.doesNotMatch(html, /navigator\.(?:language|languages)/);
  assert.doesNotMatch(html, /localStorage\.(?:getItem|setItem)\([^)]*language/i);
});

test("Memory v2 migration preserves entries and adds relations", () => {
  assert.match(html, /weread-socrates\.reader-memory\.v2/);
  assert.match(html, /weread-socrates\.reader-memory\.v1/);
  assert.match(html, /version:2,entries,relations/);
  assert.match(html, /id:clean\(raw\.id,100\)\|\|uid\("entry"\)/);
  assert.match(html, /LEGACY_KEYS\.forEach\(key=>localStorage\.removeItem\(key\)\)/);
  assert.match(html, /state\.memory\.relations=state\.memory\.relations\.filter\(x=>x\.fromEntryId!==id&&x\.toEntryId!==id\)/);
});

test("relations are four typed, transient until double user confirmation", () => {
  for (const type of ["supports", "conflicts", "extends", "exemplifies"]) {
    assert.match(html, new RegExp(type));
  }
  const candidateFunction = html.match(/function candidates\(\)\{[\s\S]*?\n    \}/);
  assert(candidateFunction);
  assert.doesNotMatch(candidateFunction[0], /persist\(|localStorage/);
  assert.match(html, /if\(!checked\)\{alert\(t\("needConfirm"\)\);return;\}if\(!confirm\(t\("finalConfirm"\)\)\)return;/);
  assert.match(html, /confirmedByUser:true/);
});

test("two-book demo, continue thinking, Markdown and native Canvas PNG are present", () => {
  assert.match(html, /demo-apology/);
  assert.match(html, /demo-meditations/);
  assert.match(html, /id="continueList"/);
  assert.match(html, /function comparisonMarkdown\(\)/);
  assert.match(html, /new Blob\(\[md\],\{type:"text\/markdown;charset=utf-8"\}\)/);
  assert.match(html, /document\.createElement\("canvas"\)/);
  assert.match(html, /canvas\.toBlob/);
  assert.match(html, /downloadMarkdown"\)\.onclick=exportMarkdown/);
  assert.match(html, /downloadPng"\)\.onclick=exportPng/);
});

test("documentation describes the same offline contract", () => {
  for (const required of ["file://", "localStorage", "connect-src 'none'", "allowed-tools"]) {
    assert.ok(skill.includes(required), `SKILL missing ${required}`);
  }
  for (const required of ["双书 Demo", "四种关系", "Markdown", "Canvas PNG", "node --test test/static.test.js"]) {
    assert.ok(readme.includes(required), `README missing ${required}`);
  }
});
