'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const workflow=fs.readFileSync(path.join(__dirname,'../.github/workflows/tbt-target-preflight.yml'),'utf8');
const probe=fs.readFileSync(path.join(__dirname,'../scripts/live/tbt-target-check.py'),'utf8');

test('TBT target is checked daily and still supports manual and release checks',()=>{
  assert.match(workflow,/cron:\s*'31 6 \* \* \*'/);
  assert.match(workflow,/workflow_dispatch:/);
  assert.match(workflow,/pull_request:/);
  assert.match(workflow,/push:\s*\n\s*branches: \[main\]/);
  assert.match(workflow,/permissions:\s*\n\s*contents: read/);
  assert.match(workflow,/persist-credentials: false/);
  assert.match(workflow,/python scripts\/live\/tbt-target-check\.py/);
  assert.match(workflow,/steps\.preflight\.outcome != 'success'/);
  assert.match(workflow,/actions\/upload-artifact@v4/);
  assert.doesNotMatch(workflow,/contents: write|pull-requests: write|gh issue create|gh pr create/);
});
test('TBT target monitor never submits a lead and excludes PII from JSON evidence',()=>{
  assert.match(probe,/reported?\["submittedLeadRequests"\]|report\["submittedLeadRequests"\]/);
  assert.match(probe,/report\["result"\]="pass" if all/);
  assert.match(probe,/submittedLeadRequests"\]==0/);
  assert.doesNotMatch(probe,/\.fill\(|\.press\("Enter"|\.click\(.*submit/i);
  assert.match(probe,/report\["consentDefaultDenied"\]/);
  assert.match(probe,/report\["externalMeasurementReview"\]/);
  assert.doesNotMatch(probe,/print\(.*request\.url|print\(.*cookie|JSON\.stringify\(.*(name|phone|email)/i);
});
