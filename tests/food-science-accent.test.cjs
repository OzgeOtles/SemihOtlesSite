const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
let top=1000, nextFrame=0, iconHeight=100;
const frames=[],events={};
const nodes={};
for(const name of ['olive','skin','cut','leaves','shadow','network']) {
  const attributes=new Map();
  nodes[`[data-food-${name}]`]={setAttribute:(k,v)=>attributes.set(k,v),getAttribute:k=>attributes.get(k)};
}
const root={dataset:{},querySelector:key=>nodes[key],getBoundingClientRect:()=>({top,height:iconHeight}),closest:()=>({})};
const motion={matches:false,addEventListener:(_event,callback)=>motion.changed=callback};
const context={
  document:{getElementById:()=>root,querySelector:()=>({getBoundingClientRect:()=>({bottom:65})})},
  window:{matchMedia:()=>motion,addEventListener:(event,callback)=>events[event]=callback},
  innerHeight:1000,requestAnimationFrame:callback=>{frames.push(callback);return ++nextFrame;},
  IntersectionObserver:class{observe(){}}
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../food-science-accent.js'),'utf8'),context);
const flush=()=>{while(frames.length)frames.shift()();};
flush();
assert.equal(root.dataset.phase,'food');
assert.equal(nodes['[data-food-skin]'].getAttribute('opacity'),'1');
top=400;events.scroll();flush();
assert.equal(root.dataset.phase,'structure');
assert(Number(nodes['[data-food-cut]'].getAttribute('opacity'))>.5);
top=200;events.scroll();flush();
assert.equal(root.dataset.phase,'research');
assert.equal(nodes['[data-food-olive]'].getAttribute('opacity'),'0');
assert(top>65,'The network must be complete while the whole illustration is below the header');
context.innerHeight=390;iconHeight=176;top=130;events.resize();flush();
assert.equal(nodes['[data-food-olive]'].getAttribute('opacity'),'0','Landscape must also complete before the header covers the illustration');
assert.equal(nodes['[data-food-network]'].getAttribute('opacity'),'0.8');
context.innerHeight=1000;iconHeight=100;

// Independently sample the full visible scroll range: all three illustrations
// must have equal uninterrupted, fully visible holds (not merely equal labels).
const holds=[0,0,0];
for(let sample=0;sample<=300;sample++) {
  const progress=sample/300;
  const start=65+(1000-65)*.9, end=65+iconHeight/2+16;
  top=start-(start-end)*progress-iconHeight/2;
  events.scroll();flush();
  const skin=Number(nodes['[data-food-skin]'].getAttribute('opacity'));
  const olive=Number(nodes['[data-food-olive]'].getAttribute('opacity'));
  const network=Number(nodes['[data-food-network]'].getAttribute('opacity'));
  if(skin>1-1e-9 && olive>1-1e-9)holds[0]++;
  if(skin<1e-9 && olive>1-1e-9)holds[1]++;
  if(network>.8-1e-9)holds[2]++;
}
assert(Math.min(...holds)>=75,'Each fully visible illustration must have a substantial hold');
assert(Math.max(...holds)-Math.min(...holds)<=1,`Unequal holds: ${holds.join(', ')}`);
top=1000;events.scroll();flush();
assert.equal(root.dataset.phase,'food');
motion.matches=true;motion.changed();flush();
top=-200;
const previous=nextFrame;events.scroll();flush();
assert.equal(root.dataset.phase,'food','Reduced motion must retain a static olive');
assert.equal(nextFrame,previous,'No animation frame should run for scrolling in reduced-motion mode');
console.log('Passed: equal visible holds, header-aware portrait/landscape progression, reverse scroll and reduced motion.');
