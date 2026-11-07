const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = { window:{} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../academic-profile-data.js'),'utf8'), context);
const data = context.window.academicProfileData;
const sourceRefs = [...data.roles,...data.education].flatMap(r=>r.sources).filter(s=>/^Resume\.doc:W\d+$/.test(s));
// Every work-experience record is represented exactly once, including the
// postdoc shared with Education and the three merged duplicate appointments.
assert.equal(sourceRefs.length,136);
assert.equal(new Set(sourceRefs).size,136);
for(let i=1;i<=136;i++) assert(sourceRefs.includes(`Resume.doc:W${String(i).padStart(3,'0')}`),`Missing work record ${i}`);
assert.equal(data.roles.length,132);
assert.equal(new Set(data.roles.map(r=>`${r.organization}|${r.title}|${r.period}`)).size, data.roles.length);
for (const id of data.featuredRoleIds) assert.equal(data.roles.filter(r=>r.id===id).length,1);
assert.equal(data.memberships.length,15);
assert.equal(new Set(data.memberships.map(m=>m.name)).size,15);
assert.deepEqual(Array.from(data.awards.map(a=>a.year)),['2004','2006','2008','2018','2019','2025']);
assert.equal(new Set(data.awards.map(a=>a.id)).size,data.awards.length);
assert.equal(data.awards.filter(a=>a.image==='assets/photos/award-ceremony.jpg').length,1);
assert.equal(data.scholarships.travel.length,8);
assert.equal(data.scholarships.research.length,4);
assert.equal(data.projects.length,14);
assert.equal(new Set(data.projects.map(p=>p.id)).size,14);
assert.equal(data.projects.find(p=>p.id==='moniqa').period,null,'Conflicting MoniQA dates must not be guessed');
const asText = JSON.stringify(data);
for (const privateValue of ['17.09.1959','2323113024','Married','semih.otles@ege.edu.tr']) assert(!asText.includes(privateValue));
console.log('Passed: all 136 work records covered once; memberships, awards, scholarships, projects and data boundaries checked.');
