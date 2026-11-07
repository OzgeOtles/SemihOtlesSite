(() => {
  const root=document.getElementById('foodScienceAccent');
  if(!root)return;
  root.innerHTML=`
<svg class="food-accent__svg" viewBox="40 20 520 540" aria-hidden="true" focusable="false">
            <defs>
              <radialGradient id="fs-skin" cx="32%" cy="28%" r="78%"><stop stop-color="#d6d990"/><stop offset=".24" stop-color="#a5ad57"/><stop offset=".58" stop-color="#71803d"/><stop offset=".83" stop-color="#415633"/><stop offset="1" stop-color="#233e2b"/></radialGradient>
              <linearGradient id="fs-leaf" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#94a479"/><stop offset=".5" stop-color="#526d4d"/><stop offset="1" stop-color="#2b4a37"/></linearGradient>
              <linearGradient id="fs-leaf-back" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#738960"/><stop offset="1" stop-color="#c0c7a3"/></linearGradient>
              <radialGradient id="fs-flesh" cx="38%" cy="32%" r="80%"><stop stop-color="#f2ebbe"/><stop offset=".6" stop-color="#cdd08d"/><stop offset=".92" stop-color="#a6b066"/><stop offset="1" stop-color="#536e3c"/></radialGradient>
              <linearGradient id="fs-pit" x1="0" x2="1"><stop stop-color="#9c7950"/><stop offset=".4" stop-color="#c5a071"/><stop offset="1" stop-color="#705036"/></linearGradient>
              <radialGradient id="fs-node"><stop stop-color="#c8d7c2"/><stop offset=".4" stop-color="#7e9c7a"/><stop offset="1" stop-color="#3c6250"/></radialGradient>
              <radialGradient id="fs-copper-node"><stop stop-color="#f0d9ad"/><stop offset=".45" stop-color="#c3a16b"/><stop offset="1" stop-color="#956a3a"/></radialGradient>
              <filter id="fs-soft-shadow" x="-70%" y="-100%" width="240%" height="300%"><feGaussianBlur stdDeviation="12"/></filter>
            </defs>
            <g class="food-story__guides" fill="none" stroke="#71836b">
              <circle cx="300" cy="294" r="226" opacity=".12"/><circle cx="300" cy="294" r="186" opacity=".1" stroke-dasharray="2 9"/>
              <path d="M300 56v18M300 514v18M61 294h18M521 294h18" opacity=".38"/>
            </g>
            <ellipse data-food-shadow cx="305" cy="464" rx="104" ry="14" fill="#3c4c30" opacity=".17" filter="url(#fs-soft-shadow)"/>
            <g data-food-olive>
              <g data-food-cut opacity="0">
                <path d="M302 148C359 139 411 194 408 284C405 384 352 452 293 440C235 429 201 358 203 276C204 203 244 155 302 148Z" fill="url(#fs-flesh)" stroke="#5e763e" stroke-width="5"/>
                <path d="M303 164C350 159 392 208 392 283C389 365 346 428 295 424C247 420 218 350 220 279C221 216 252 171 303 164Z" fill="none" stroke="#e4e1a7" stroke-width="2"/>
                <ellipse cx="305" cy="295" rx="35" ry="81" fill="#7a633d" opacity=".14"/>
                <path d="M302 215C322 210 338 245 336 295C334 340 318 377 301 376C280 374 273 339 274 294C275 252 283 220 302 215Z" fill="url(#fs-pit)"/>
                <g stroke="#765334" stroke-width="1.5" fill="none" opacity=".4"><path d="M300 227C288 269 291 327 303 364"/><path d="M311 228C322 273 318 331 310 363"/><path d="M285 256l9 9M282 290l11 8M285 324l11 6M319 254l-7 10M322 288l-9 9M319 324l-9 7"/></g>
                <g stroke="#b4b775" fill="none" opacity=".4"><path d="M268 208l16 24M355 231l-25 19M364 285l-28 7M347 350l-24-11M261 369l26-22M238 298l36 2"/></g>
              </g>
              <g data-food-skin>
                <path d="M302 148C359 139 411 194 408 284C405 384 352 452 293 440C235 429 201 358 203 276C204 203 244 155 302 148Z" fill="url(#fs-skin)"/>
                <path d="M264 174C230 215 225 285 244 336" fill="none" stroke="#eef0c4" stroke-width="13" stroke-linecap="round" opacity=".15"/>
                <path d="M379 224C403 324 355 419 304 431" fill="none" stroke="#223c29" stroke-width="9" opacity=".12"/>
                <g fill="#e4e6ac" opacity=".25"><circle cx="291" cy="180" r="1.2"/><circle cx="258" cy="238" r="1.4"/><circle cx="287" cy="300" r="1.2"/><circle cx="324" cy="230" r="1"/><circle cx="361" cy="277" r="1.3"/><circle cx="312" cy="379" r="1.2"/><circle cx="263" cy="359" r="1.4"/><circle cx="352" cy="339" r="1"/></g>
              </g>
              <g data-food-leaves>
                <path d="M302 163C305 132 317 106 337 86" fill="none" stroke="#7a7550" stroke-width="6" stroke-linecap="round"/>
                <path d="M304 143C287 100 220 79 160 103C187 151 257 170 304 143Z" fill="url(#fs-leaf)"/>
                <path d="M304 143C265 130 216 111 173 105" fill="none" stroke="#bec9a2" stroke-width="1.5" opacity=".7"/>
                <path d="M206 94l11 24M236 99l13 30M269 111l8 27M215 141l16-18M252 152l12-17" fill="none" stroke="#b3c19a" stroke-width=".9" opacity=".4"/>
                <path d="M315 128C320 89 365 56 410 57C396 101 357 133 315 128Z" fill="url(#fs-leaf-back)"/>
                <path d="M318 126L401 64" fill="none" stroke="#e1e5ca" stroke-width="1.4" opacity=".6"/>
              </g>
            </g>
            <g data-food-network opacity="0">
              <g stroke="#637f69" stroke-width="2" fill="none" opacity=".65"><path d="M150 300L226 190L356 170L448 273L385 390L254 419L150 300M226 190L292 290L356 170M292 290L448 273M292 290L385 390M292 290L254 419M150 300L292 290M226 190L208 96M356 170L427 104M448 273L510 355M385 390L425 480M254 419L164 475M150 300L85 238"/></g>
              <g fill="url(#fs-node)"><circle cx="150" cy="300" r="20"/><circle cx="226" cy="190" r="28"/><circle cx="356" cy="170" r="18"/><circle cx="448" cy="273" r="25"/><circle cx="254" cy="419" r="22"/><circle cx="208" cy="96" r="9"/><circle cx="510" cy="355" r="12"/><circle cx="164" cy="475" r="10"/></g>
              <g fill="url(#fs-copper-node)"><circle cx="292" cy="290" r="34"/><circle cx="385" cy="390" r="27"/><circle cx="427" cy="104" r="12"/><circle cx="425" cy="480" r="10"/><circle cx="85" cy="238" r="10"/></g>
            </g>
          </svg>
`;
  const section=root.closest('section');
  const olive=root.querySelector('[data-food-olive]');
  const skin=root.querySelector('[data-food-skin]');
  const cut=root.querySelector('[data-food-cut]');
  const leaves=root.querySelector('[data-food-leaves]');
  const shadow=root.querySelector('[data-food-shadow]');
  const network=root.querySelector('[data-food-network]');
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=value=>Math.max(0,Math.min(1,value));
  const ease=(value,a,b)=>{const t=clamp((value-a)/(b-a));return t*t*(3-2*t);};
  // Three equally long still-image intervals, separated by two short equal fades.
  const fadeShare=.1;
  const holdShare=(1-2*fadeShare)/3;
  const openingStart=holdShare, openingEnd=openingStart+fadeShare;
  const researchStart=openingEnd+holdShare, researchEnd=researchStart+fadeShare;
  let frame=0, nearby=true;
  function paint(progress) {
    const opening=ease(progress,openingStart,openingEnd), research=ease(progress,researchStart,researchEnd);
    olive.setAttribute('transform',`rotate(${-8+opening*12} 300 300)`);
    olive.setAttribute('opacity',String(1-research));
    skin.setAttribute('transform',`translate(${opening*16} 0)`);
    skin.setAttribute('opacity',String(1-opening));
    cut.setAttribute('opacity',String(opening));
    leaves.setAttribute('transform',`translate(0 ${-opening*5})`);
    shadow.setAttribute('opacity',String(.12*(1-research)));
    network.setAttribute('opacity',String(research*.8));
    root.dataset.phase=progress<(openingStart+openingEnd)/2?'food':progress<(researchStart+researchEnd)/2?'structure':'research';
  }
  function update() {
    frame=0;
    if(motion.matches){paint(0);return;}
    const rect=root.getBoundingClientRect();
    const viewport=window.visualViewport;
    const viewportTop=viewport?.offsetTop ?? 0;
    const viewportBottom=viewportTop+(viewport?.height ?? innerHeight);
    const headerBottom=Math.max(viewportTop,document.querySelector('.topbar')?.getBoundingClientRect().bottom ?? 0);
    const available=Math.max(1,viewportBottom-headerBottom);
    // Finish while the entire illustration is still below the sticky header.
    // The final hold remains fully visible rather than finishing behind the bar.
    const start=headerBottom+available*.9;
    const end=headerBottom+rect.height/2+16;
    paint(clamp((start-(rect.top+rect.height/2))/Math.max(1,start-end)));
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update);}
  const observer=new IntersectionObserver(entries=>{nearby=entries[0].isIntersecting;if(nearby)schedule();},{rootMargin:'100px'});
  observer.observe(section);
  window.addEventListener('scroll',()=>{if(nearby&&!motion.matches)schedule();},{passive:true});
  window.addEventListener('resize',schedule);
  window.visualViewport?.addEventListener('resize',schedule);
  window.visualViewport?.addEventListener('scroll',()=>{if(nearby&&!motion.matches)schedule();});
  motion.addEventListener('change',schedule);
  schedule();
})();
