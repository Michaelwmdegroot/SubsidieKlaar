'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const workflow=fs.readFileSync(path.join(__dirname,'../.github/workflows/seo-weekly.yml'),'utf8');
test('weekly SEO monitor is scheduled and manually runnable with read-only repository access',()=>{
 assert.match(workflow,/cron:\s*'17 6 \* \* 1'/);
 assert.match(workflow,/workflow_dispatch:/);
 assert.match(workflow,/permissions:\s*\n\s*contents: read/);
 assert.match(workflow,/persist-credentials: false/);
 assert.match(workflow,/node scripts\/audit-seo\.cjs --live/);
 assert.match(workflow,/actions\/upload-artifact@v4/);
 assert.match(workflow,/qa\/seo-live\.json/);
 assert.doesNotMatch(workflow,/\b(?:curl -X POST|git push|gh issue create|gh pr create|contents: write|pull-requests: write)\b/);
});
test('live SEO audit remains bounded GET-only, without customer or off-site collection',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../scripts/audit-seo.cjs'),'utf8');
 assert.match(source,/GET only; no cookies, forms or off-site crawl/);
 assert.match(source,/MAX_ROUTES = 60/);
 assert.match(source,/CONCURRENCY = 4/);
 assert.match(source,/mode:live \? 'live' : 'local'/);
 assert.doesNotMatch(source,/localStorage|sessionStorage/);
});
