// ============================================================
// economics toolkit — bundled module scripts
// Each module's code is isolated in its own IIFE with try/catch,
// so only the relevant module's code actually executes on each page.
// ============================================================

/* ============================================================
   Module: ad-as-growth
   ============================================================ */
(function(){
  try {
// ============================================================
// Aggregate Demand, Supply & Growth (Part 2) — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   01 — AD curve chart (static illustrative)
   ============================================================ */
(function(){
  const container = document.getElementById('adCurveChart');
  if (!container) return;
  const W=460, H=240, padL=44, padR=20, padT=20, padB=32;
  const xScale = y => padL + (y/100)*(W-padL-padR);
  const yScale = p => (H-padB) - (p/100)*(H-padT-padB);
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'econ-svg', style:'max-width:480px;'});
  svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));
  svg.appendChild(svgEl('line', {x1:padL, x2:padL, y1:padT, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));
  // downward curve from (10,90) to (90,10)
  svg.appendChild(svgEl('line', {x1:xScale(10), y1:yScale(90), x2:xScale(90), y2:yScale(10), stroke:'#2B2560', 'stroke-width':2.5}));
  // points A (lower price, higher Y) and B (higher price, lower Y)
  const A = {y:65, p:35}, B = {y:35, p:65};
  [[A,'A','#2F8F6B'],[B,'B','#D6573F']].forEach(([pt,label,color]) => {
    svg.appendChild(svgEl('circle', {cx:xScale(pt.y), cy:yScale(pt.p), r:5, fill:color, stroke:'#fff', 'stroke-width':1.5}));
    const t = svgEl('text', {x:xScale(pt.y)+8, y:yScale(pt.p)-6, 'font-family':'IBM Plex Mono', 'font-size':10, fill:color, 'font-weight':'700'});
    t.textContent = label;
    svg.appendChild(t);
  });
  svg.appendChild(svgEl('line', {x1:xScale(A.y), y1:yScale(A.p), x2:xScale(B.y), y2:yScale(B.p), stroke:'#C77F1E', 'stroke-width':1, 'stroke-dasharray':'3,2'}));
  const adLabel = svgEl('text', {x:xScale(85), y:yScale(15)-4, 'text-anchor':'end', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#2B2560', 'font-weight':'700'});
  adLabel.textContent = 'AD';
  svg.appendChild(adLabel);
  const ylabel = svgEl('text', {x:10, y:padT+6, 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
  ylabel.textContent = 'Price Level';
  svg.appendChild(ylabel);
  const xlabel = svgEl('text', {x:W/2, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
  xlabel.textContent = 'Real GDP (Income, Output)';
  svg.appendChild(xlabel);
  container.appendChild(svg);
})();

/* ============================================================
   02 — AS curve chart (VSRAS, SRAS, LRAS)
   ============================================================ */
(function(){
  const container = document.getElementById('asCurveChart');
  if (!container) return;
  const W=460, H=240, padL=44, padR=20, padT=20, padB=32;
  const xScale = y => padL + (y/100)*(W-padL-padR);
  const yScale = p => (H-padB) - (p/100)*(H-padT-padB);
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'econ-svg', style:'max-width:480px;'});
  svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));
  svg.appendChild(svgEl('line', {x1:padL, x2:padL, y1:padT, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));
  // LRAS - vertical at Y=55
  svg.appendChild(svgEl('line', {x1:xScale(55), y1:padT, x2:xScale(55), y2:H-padB, stroke:'#2B2560', 'stroke-width':2.5}));
  // SRAS - upward sloping through (30,20) to (75,85)
  svg.appendChild(svgEl('line', {x1:xScale(30), y1:yScale(20), x2:xScale(75), y2:yScale(85), stroke:'#C77F1E', 'stroke-width':2.5}));
  // VSRAS - flat at P=35
  svg.appendChild(svgEl('line', {x1:xScale(20), y1:yScale(35), x2:xScale(70), y2:yScale(35), stroke:'#2F8F6B', 'stroke-width':2.5}));
  const labels = [[55,88,'LRAS','#2B2560'],[76,83,'SRAS','#C77F1E'],[71,38,'VSRAS','#2F8F6B']];
  labels.forEach(([y,p,txt,color]) => {
    const t = svgEl('text', {x:xScale(y)+4, y:yScale(p), 'font-family':'IBM Plex Mono', 'font-size':9, fill:color, 'font-weight':'700'});
    t.textContent = txt;
    svg.appendChild(t);
  });
  const ylabel = svgEl('text', {x:10, y:padT+6, 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
  ylabel.textContent = 'Price Level';
  svg.appendChild(ylabel);
  const xlabel = svgEl('text', {x:W/2, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
  xlabel.textContent = 'Output, Y';
  svg.appendChild(xlabel);
  container.appendChild(svg);
})();

/* ============================================================
   05 — Growth accounting calculator
   ============================================================ */
(function(){
  const tfpI = document.getElementById('gaTFP'), lI = document.getElementById('gaL'),
        kI = document.getElementById('gaK'), wlI = document.getElementById('gaWL');
  const result = document.getElementById('gaResult'), steps = document.getElementById('gaSteps');
  if (!tfpI) return;
  function render(){
    const tfp = parseFloat(tfpI.value), l = parseFloat(lI.value), k = parseFloat(kI.value);
    const wl = parseFloat(wlI.value), wk = 1 - wl;
    const growth = tfp + wl*l + wk*k;
    result.textContent = `Potential GDP growth = ${fmt(growth,2)}%`;
    steps.textContent = `${tfp} + ${fmt(wl,2)}(${l}) + ${fmt(wk,2)}(${k}) = ${fmt(growth,2)}%`;
  }
  [tfpI,lI,kI,wlI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   06 — Labor productivity calculator
   ============================================================ */
(function(){
  const gdpI = document.getElementById('lpGDP'), hoursI = document.getElementById('lpHours');
  const result = document.getElementById('lpResult');
  if (!gdpI) return;
  function render(){
    const gdp = parseFloat(gdpI.value), hours = parseFloat(hoursI.value);
    const productivity = gdp / hours;
    result.textContent = `Labor productivity = $${fmt(productivity,2)} / hour`;
  }
  [gdpI,hoursI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   Check-in mini quizzes
   ============================================================ */
(function(){
  document.querySelectorAll('.checkin').forEach(box => {
    const btns = box.querySelectorAll('.opt-btn');
    const feedback = box.querySelector('.checkin-feedback');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btns.forEach(b => b.disabled = true);
        btns.forEach(b => { if (b.dataset.correct === 'true') b.classList.add('correct'); });
        if (btn.dataset.correct !== 'true') btn.classList.add('incorrect');
        feedback.classList.add('show');
        markSectionProgress(box.closest('section').id);
      });
    });
  });
})();

/* ============================================================
   Sidebar scroll-spy + progress + mobile toggle
   ============================================================ */
const sectionIds = ['sec-addemand','sec-assupply','sec-shifts','sec-equilibria','sec-production','sec-sustainable','sec-quiz'];
const visited = new Set();

function markSectionProgress(id){
  if (sectionIds.includes(id)){
    visited.add(id);
    updateProgress();
  }
}
function updateProgress(){
  const pct = Math.round((visited.size / sectionIds.length) * 100);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressPct');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
  sectionIds.forEach(id => {
    const link = document.querySelector(`.toc a[data-sec="${id}"]`);
    if (link && visited.has(id)) link.classList.add('done');
  });
  try { localStorage.setItem('cfa-progress-ad-as-growth', String(pct)); } catch(e) {}
}

(function(){
  const links = document.querySelectorAll('.toc a[data-sec]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.toc a[data-sec="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting){
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        markSectionProgress(id);
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle){
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.querySelectorAll('.toc a').forEach(a => a.addEventListener('click', () => sidebar.classList.remove('open')));
  }
})();

/* ============================================================
   QUIZ
   ============================================================ */
const QUIZ = [
  {
    concept: "The Aggregate Demand Curve",
    q: "The aggregate demand curve slopes downward primarily because of three effects. Which of these is NOT one of them?",
    opts: ["The wealth effect", "The interest rate effect", "The substitution-for-labor effect"],
    correct: 2,
    exp: "The three reasons AD slopes downward are the wealth effect, the interest rate effect, and the real exchange rate effect."
  },
  {
    concept: "The Aggregate Demand Curve",
    q: "According to the wealth effect, when the price level rises, real wealth:",
    opts: ["Rises, since nominal wealth is unchanged", "Falls, since the same nominal money buys fewer goods", "Is completely unaffected"],
    correct: 1,
    exp: "Nominal wealth (like £10 in your pocket) doesn't change with prices, but its real purchasing power falls as prices rise — you can afford fewer goods with the same money."
  },
  {
    concept: "The Aggregate Demand Curve",
    q: "A higher price level increases the demand for money, which raises interest rates and reduces investment spending. This describes:",
    opts: ["The wealth effect", "The interest rate effect", "The real exchange rate effect"],
    correct: 1,
    exp: "This chain — higher prices, more money demanded, higher interest rates, less investment — is the interest rate effect."
  },
  {
    concept: "The Aggregate Supply Curve",
    q: "In the very short run (VSRAS), the aggregate supply curve is:",
    opts: ["Vertical", "Upward sloping", "Horizontal (flat)"],
    correct: 2,
    exp: "Over a few months, firms adjust output without changing prices at all, producing a flat (horizontal) VSRAS curve."
  },
  {
    concept: "The Aggregate Supply Curve",
    q: "Why is the long-run aggregate supply (LRAS) curve vertical?",
    opts: ["Because wages and input costs fully adjust, leaving output determined only by capital, labor, and technology", "Because firms refuse to sell more output", "Because the price level cannot change in the long run"],
    correct: 0,
    exp: "Once wages and costs catch up fully with prices, changes in the price level no longer affect real output, which settles at potential GDP — hence a vertical LRAS."
  },
  {
    concept: "The Aggregate Supply Curve",
    q: "The economy's potential output is represented by the position of which curve?",
    opts: ["VSRAS", "SRAS", "LRAS"],
    correct: 2,
    exp: "The vertical LRAS curve's position marks the economy's potential (full-employment) level of real GDP."
  },
  {
    concept: "Shifts in AD & AS",
    q: "A stock market boom increases household wealth and consumer spending at every price level. This is best described as:",
    opts: ["A movement along the AD curve", "A rightward shift of the AD curve", "A shift of the LRAS curve"],
    correct: 1,
    exp: "A change in spending behavior at every price level (not caused by the price level itself) shifts the whole AD curve, here to the right."
  },
  {
    concept: "Shifts in AD & AS",
    q: "A sudden, sharp rise in global oil prices would most directly cause:",
    opts: ["A rightward shift in AD", "A leftward shift in AS", "A rightward shift in LRAS only"],
    correct: 1,
    exp: "Higher input costs (like oil) raise production costs at every price level, shifting the AS curve to the left."
  },
  {
    concept: "Four Macroeconomic Equilibria",
    q: "At long-run full employment equilibrium, real GDP is:",
    opts: ["Below potential GDP", "Above potential GDP", "Equal to potential GDP"],
    correct: 2,
    exp: "Full employment equilibrium occurs exactly where AD meets SRAS on the vertical LRAS line — real GDP equals potential GDP."
  },
  {
    concept: "Four Macroeconomic Equilibria",
    q: "A recessionary gap is characterized by:",
    opts: ["Equilibrium output above potential GDP", "Equilibrium output below potential GDP, with falling output and prices", "Rising output and rising prices simultaneously"],
    correct: 1,
    exp: "A recessionary gap occurs when AD falls, pushing equilibrium output below potential GDP, with both output and prices declining."
  },
  {
    concept: "Four Macroeconomic Equilibria",
    q: "An inflationary gap is caused by:",
    opts: ["AD shifting left", "AD shifting right, beyond what the economy can sustainably produce", "AS shifting left"],
    correct: 1,
    exp: "An inflationary gap occurs when AD rises enough to push equilibrium output above potential GDP, with both output and prices rising."
  },
  {
    concept: "Four Macroeconomic Equilibria",
    q: "Stagflation — simultaneous high unemployment and high inflation — is primarily driven by:",
    opts: ["A rightward shift in AD", "A leftward shift in AS", "A leftward shift in LRAS only, with AD unchanged"],
    correct: 1,
    exp: "Stagflation is the signature of an AS-driven shock: a leftward shift in aggregate supply simultaneously reduces output and raises prices."
  },
  {
    concept: "Four Macroeconomic Equilibria",
    q: "The 1973 and 1979-1980 oil price shocks are classic historical examples of:",
    opts: ["Demand-driven recessions", "Supply-driven stagflation", "Long-run full employment equilibrium"],
    correct: 1,
    exp: "Both oil shocks caused simultaneous output declines and rising prices — the defining pattern of stagflation, driven by leftward shifts in aggregate supply."
  },
  {
    concept: "The Production Function & Growth Accounting",
    q: "The production function Y = A × F(L, K) assumes constant returns to scale. This means:",
    opts: ["Doubling all inputs exactly doubles output", "Output never changes regardless of inputs", "Labor alone determines all output"],
    correct: 0,
    exp: "Constant returns to scale means proportionally increasing every input increases output by that same proportion."
  },
  {
    concept: "The Production Function & Growth Accounting",
    q: "Diminishing marginal productivity of capital implies that:",
    opts: ["Adding capital always increases output at a constant rate", "Each additional unit of capital, holding labor fixed, adds progressively less output", "Capital has no effect on output"],
    correct: 1,
    exp: "Diminishing marginal productivity means that as more capital is added to a fixed labor force, each additional unit contributes less and less to output."
  },
  {
    concept: "The Production Function & Growth Accounting",
    q: "According to the growth accounting equation, if TFP growth is 0%, labor grows 1%, capital grows 2%, with WL=0.7 and WK=0.3, what is potential GDP growth?",
    opts: ["1.3%", "3.0%", "0.5%"],
    correct: 0,
    exp: "Growth = 0 + 0.7(1%) + 0.3(2%) = 0.7% + 0.6% = 1.3%."
  },
  {
    concept: "The Production Function & Growth Accounting",
    q: "Why is genuine TFP growth the only way to sustain long-run per-capita GDP growth?",
    opts: ["Because labor and capital growth are illegal in the long run", "Because diminishing returns mean capital deepening alone eventually yields ever-smaller gains", "Because TFP is the only measurable input"],
    correct: 1,
    exp: "Diminishing marginal returns to capital mean that continuously adding capital relative to labor eventually produces smaller and smaller gains — only technological progress (TFP growth) can sustain growth indefinitely."
  },
  {
    concept: "Measures of Sustainable Growth",
    q: "Labor productivity is calculated as:",
    opts: ["Real GDP divided by aggregate hours worked", "Nominal GDP divided by the labor force", "Total factor productivity divided by capital"],
    correct: 0,
    exp: "Labor productivity = Real GDP / Aggregate hours worked — the amount of real output produced per hour of labor."
  },
  {
    concept: "Measures of Sustainable Growth",
    q: "Developed countries typically have a HIGHER level of labor productivity but a LOWER growth rate of labor productivity than developing countries. Why?",
    opts: ["Developed countries have less capital accumulated", "Developing countries start from a lower capital base, where diminishing returns haven't yet reduced the payoff from new capital", "This pattern never actually occurs"],
    correct: 1,
    exp: "This is the convergence pattern: developed economies have a high accumulated productivity level, while developing economies, starting with less capital per worker, often see faster productivity growth as they build up capital."
  },
  {
    concept: "Measures of Sustainable Growth",
    q: "Rising labor productivity allows companies to:",
    opts: ["Raise wages without necessarily squeezing profit margins", "Always reduce total output", "Eliminate the need for capital investment"],
    correct: 0,
    exp: "When workers produce more per hour, companies can afford higher wages while maintaining healthy profit margins — a combination generally favorable for both workers and equity markets."
  }
];

(function(){
  const shell = document.getElementById('quizShell');
  if (!shell) return;
  let current = 0;
  let score = 0;
  const answered = new Array(QUIZ.length).fill(null);

  function renderQuestion(){
    const item = QUIZ[current];
    let html = `<div class="quiz-progress">Question ${current+1} of ${QUIZ.length} &nbsp;·&nbsp; Score so far: ${score}</div>`;
    html += `<div class="quiz-q">${item.q}</div>`;
    html += `<div class="opt-list" id="quizOpts">`;
    item.opts.forEach((opt, i) => {
      html += `<button class="opt-btn" data-i="${i}">${opt}</button>`;
    });
    html += `</div>`;
    html += `<div class="quiz-explain" id="quizExplain">${item.exp}</div>`;
    html += `<div class="quiz-nav">
      <button class="btn ghost" id="quizPrev" ${current===0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn" id="quizNext" disabled>${current === QUIZ.length-1 ? 'See score' : 'Next →'}</button>
    </div>`;
    shell.innerHTML = html;

    const opts = shell.querySelectorAll('.opt-btn');
    const explain = document.getElementById('quizExplain');
    const nextBtn = document.getElementById('quizNext');
    const prevBtn = document.getElementById('quizPrev');

    if (answered[current] !== null){
      opts.forEach(btn => {
        btn.disabled = true;
        const i = +btn.dataset.i;
        if (i === item.correct) btn.classList.add('correct');
        else if (i === answered[current]) btn.classList.add('incorrect');
      });
      explain.classList.add('show');
      nextBtn.disabled = false;
    }

    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered[current] !== null) return;
        const i = +btn.dataset.i;
        answered[current] = i;
        if (i === item.correct) score++;
        if (typeof cfaRecordAnswer === "function" && item.concept){
          cfaRecordAnswer(item.concept, "AD, AS & Economic Growth", i === item.correct);
        }
        opts.forEach(b => {
          b.disabled = true;
          const bi = +b.dataset.i;
          if (bi === item.correct) b.classList.add('correct');
          else if (bi === i) b.classList.add('incorrect');
        });
        explain.classList.add('show');
        nextBtn.disabled = false;
        markSectionProgress('sec-quiz');
      });
    });

    nextBtn.addEventListener('click', () => {
      if (current < QUIZ.length - 1){ current++; renderQuestion(); }
      else { renderScore(); }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){ current--; renderQuestion(); }
    });
  }

  function renderScore(){
    const pct = Math.round((score / QUIZ.length) * 100);
    let msg = "Solid foundation — review the sections you missed and try again.";
    if (pct >= 90) msg = "Excellent — you've genuinely internalized this reading.";
    else if (pct >= 70) msg = "Good work — a couple of gaps worth revisiting.";
    shell.innerHTML = `
      <div class="quiz-score">
        <div style="font-family:var(--font-mono); font-size:.8rem; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.08em;">Final score</div>
        <div class="big">${score} / ${QUIZ.length}</div>
        <p style="max-width:46ch; margin:10px auto 22px; color:var(--ink-soft);">${msg}</p>
        <button class="btn" id="quizRestart">Retake the quiz</button>
      </div>`;
    document.getElementById('quizRestart').addEventListener('click', () => {
      current = 0; score = 0;
      answered.fill(null);
      renderQuestion();
    });
  }

  renderQuestion();
})();

  } catch(e) { console.warn('[ad-as-growth] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: business-cycles
   ============================================================ */
(function(){
  try {
// ============================================================
// Introduction to Business Cycles — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }

/* ============================================================
   01 — Business cycle phase tabs
   ============================================================ */
(function(){
  const tabs = document.getElementById('phaseTabs');
  const display = document.getElementById('phaseDisplay');
  if (!tabs) return;
  const data = {
    recovery: {
      title: "Recovery",
      incomes: "Unemployment remains above average; layoffs slow. Businesses rely on overtime before hiring resumes. Consumer confidence starts improving.",
      durables: "Spending limited — households postpone purchases.",
      nondurables: "Little change through the cycle.",
      services: "Below average."
    },
    expansion: {
      title: "Expansion",
      incomes: "Hiring restarts. Unemployment rate stabilizes and begins falling. Rising incomes, healthy employment prospects, greater confidence.",
      durables: "Spending increases.",
      nondurables: "Little change through the cycle.",
      services: "Spending increases."
    },
    slowdown: {
      title: "Slowdown",
      incomes: "Businesses continue hiring but at a slower pace. Unemployment rate continues to fall. Incomes still growing; consumers remain confident.",
      durables: "Spending above average.",
      nondurables: "Little change through the cycle.",
      services: "Spending above average."
    },
    contraction: {
      title: "Contraction",
      incomes: "Businesses first cut overtime hours, then freeze hiring and start layoffs. Employment levels decline; consumer confidence weakens.",
      durables: "Purchases postponed; spending decreasing.",
      nondurables: "Little change through the cycle.",
      services: "Spending declines."
    }
  };
  function render(phase){
    const d = data[phase];
    display.innerHTML = `
      <div style="background:var(--paper-dim); border-radius:10px; padding:16px 18px; margin-top:12px;">
        <div style="font-family:var(--font-mono); font-size:.72rem; text-transform:uppercase; letter-spacing:.05em; color:var(--indigo); font-weight:700; margin-bottom:10px;">${d.title}</div>
        <p style="margin:0 0 10px; font-size:.88rem;"><strong>Incomes, employment &amp; confidence:</strong> ${d.incomes}</p>
        <p style="margin:0 0 6px; font-size:.85rem;"><strong>Durables:</strong> ${d.durables}</p>
        <p style="margin:0 0 6px; font-size:.85rem;"><strong>Non-durables:</strong> ${d.nondurables}</p>
        <p style="margin:0; font-size:.85rem;"><strong>Services:</strong> ${d.services}</p>
      </div>
    `;
  }
  tabs.querySelectorAll('.test-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.test-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.phase);
    });
  });
  render('recovery');
})();

/* ============================================================
   04 — Unemployment & participation rate calculator
   ============================================================ */
(function(){
  const eI = document.getElementById('uEmployed'), uI = document.getElementById('uUnemployed'), wI = document.getElementById('uWorkingAge');
  const out = document.getElementById('uOut');
  if (!eI) return;
  function render(){
    const e = parseFloat(eI.value), u = parseFloat(uI.value), w = parseFloat(wI.value);
    const laborForce = e + u;
    const unempRate = (u/laborForce) * 100;
    const partRate = (laborForce/w) * 100;
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Labor force</div><div class="v">${laborForce.toLocaleString()}</div></div>
      <div class="stat-readout"><div class="k">Unemployment rate</div><div class="v">${fmt(unempRate,1)}%</div></div>
      <div class="stat-readout"><div class="k">Participation rate</div><div class="v">${fmt(partRate,1)}%</div></div>
    `;
  }
  [eI,uI,wI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   07 — Price index & inflation calculator
   ============================================================ */
(function(){
  const q1I = document.getElementById('piQ1'), p1BaseI = document.getElementById('piP1Base'), p1CurI = document.getElementById('piP1Cur');
  const q2I = document.getElementById('piQ2'), p2BaseI = document.getElementById('piP2Base'), p2CurI = document.getElementById('piP2Cur');
  const out = document.getElementById('piOut');
  if (!q1I) return;
  function render(){
    const q1 = parseFloat(q1I.value), p1b = parseFloat(p1BaseI.value), p1c = parseFloat(p1CurI.value);
    const q2 = parseFloat(q2I.value), p2b = parseFloat(p2BaseI.value), p2c = parseFloat(p2CurI.value);
    const baseValue = q1*p1b + q2*p2b;
    const currentValue = q1*p1c + q2*p2c;
    const index = (currentValue/baseValue) * 100;
    const inflation = (index/100 - 1) * 100;
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Base value</div><div class="v">${fmt(baseValue,1)}</div></div>
      <div class="stat-readout"><div class="k">Price index</div><div class="v">${fmt(index,2)}</div></div>
      <div class="stat-readout"><div class="k">Inflation rate</div><div class="v">${fmt(inflation,2)}%</div></div>
    `;
  }
  [q1I,p1BaseI,p1CurI,q2I,p2BaseI,p2CurI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   08 — Unit labor cost calculator
   ============================================================ */
(function(){
  const wI = document.getElementById('ulcW'), oI = document.getElementById('ulcO');
  const result = document.getElementById('ulcResult'), steps = document.getElementById('ulcSteps');
  if (!wI) return;
  function render(){
    const w = parseFloat(wI.value), o = parseFloat(oI.value);
    // ULC growth approx = wage growth - productivity growth
    const ulcGrowth = w - o;
    result.textContent = `ULC growth ≈ ${fmt(ulcGrowth,1)}%`;
    steps.textContent = `${w}% − ${o}% ≈ ${fmt(ulcGrowth,1)}% growth in unit labor costs`;
  }
  [wI,oI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   09 — Leading/Coincident/Lagging indicator tabs
   ============================================================ */
(function(){
  const tabs = document.getElementById('indicatorTabs');
  const display = document.getElementById('indicatorDisplay');
  if (!tabs) return;
  const data = {
    leading: {
      title: "Leading Indicators — turn before the economy does",
      items: ["Survey-based indicators (e.g., ISM)", "New orders for goods", "Average consumer expectations", "Average weekly hours worked", "Initial claims for unemployment insurance", "New building permits", "Stock market indexes", "Yield curve spread (long-term minus short-term rates)"]
    },
    coincident: {
      title: "Coincident Indicators — turn alongside the economy",
      items: ["Industrial production indexes", "Manufacturing and trade sales indexes", "Aggregate real personal income", "Non-agricultural employment"]
    },
    lagging: {
      title: "Lagging Indicators — turn after the economy already has",
      items: ["Average duration of unemployment", "Inventory–sales ratio", "Change in unit labor costs", "Average bank prime lending rate", "Commercial and industrial loans outstanding", "Ratio of consumer installment debt to income", "Change in CPI for services"]
    }
  };
  function render(cat){
    const d = data[cat];
    let html = `<div style="background:var(--paper-dim); border-radius:10px; padding:16px 18px; margin-top:12px;">
      <div style="font-family:var(--font-mono); font-size:.72rem; text-transform:uppercase; letter-spacing:.05em; color:var(--indigo); font-weight:700; margin-bottom:10px;">${d.title}</div>
      <ul style="margin:0; padding-left:20px; font-size:.85rem;">`;
    d.items.forEach(item => html += `<li style="margin-bottom:4px;">${item}</li>`);
    html += `</ul></div>`;
    display.innerHTML = html;
  }
  tabs.querySelectorAll('.test-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.test-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.cat);
    });
  });
  render('leading');
})();

/* ============================================================
   Check-in mini quizzes
   ============================================================ */
(function(){
  document.querySelectorAll('.checkin').forEach(box => {
    const btns = box.querySelectorAll('.opt-btn');
    const feedback = box.querySelector('.checkin-feedback');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btns.forEach(b => b.disabled = true);
        btns.forEach(b => { if (b.dataset.correct === 'true') b.classList.add('correct'); });
        if (btn.dataset.correct !== 'true') btn.classList.add('incorrect');
        feedback.classList.add('show');
        markSectionProgress(box.closest('section').id);
      });
    });
  });
})();

/* ============================================================
   Sidebar scroll-spy + progress + mobile toggle
   ============================================================ */
const sectionIds = ['sec-consumer','sec-housing','sec-trade','sec-unemploytypes','sec-unemploylag','sec-inflationtypes','sec-priceindex','sec-costdemand','sec-indicators','sec-theories','sec-quiz'];
const visited = new Set();

function markSectionProgress(id){
  if (sectionIds.includes(id)){
    visited.add(id);
    updateProgress();
  }
}
function updateProgress(){
  const pct = Math.round((visited.size / sectionIds.length) * 100);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressPct');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
  sectionIds.forEach(id => {
    const link = document.querySelector(`.toc a[data-sec="${id}"]`);
    if (link && visited.has(id)) link.classList.add('done');
  });
  try { localStorage.setItem('cfa-progress-business-cycles', String(pct)); } catch(e) {}
}

(function(){
  const links = document.querySelectorAll('.toc a[data-sec]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.toc a[data-sec="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting){
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        markSectionProgress(id);
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle){
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.querySelectorAll('.toc a').forEach(a => a.addEventListener('click', () => sidebar.classList.remove('open')));
  }
})();

/* ============================================================
   QUIZ
   ============================================================ */
const QUIZ = [
  {
    concept: "Leading, Coincident & Lagging Indicators",
    q: "The spread between long-term and short-term bond yields (the yield curve) is classified as which type of economic indicator?",
    opts: ["Leading", "Coincident", "Lagging"],
    correct: 0,
    exp: "The yield curve is a classic leading indicator — it reflects forward-looking market expectations and often signals a slowdown well before it appears in GDP or employment data."
  },
  {
    concept: "Leading, Coincident & Lagging Indicators",
    q: "Average duration of unemployment and the change in unit labor costs are examples of:",
    opts: ["Leading indicators", "Coincident indicators", "Lagging indicators"],
    correct: 2,
    exp: "Both turn only after a trend is already well established in the broader economy, making them lagging indicators."
  },
  {
    concept: "Theories of the Business Cycle",
    q: "Real Business Cycle (RBC) theory attributes economic fluctuations primarily to:",
    opts: ["Shifts in aggregate supply, such as input price or technology changes", "Shifts in aggregate demand driven by consumer confidence", "Changes in the unemployment rate alone"],
    correct: 0,
    exp: "RBC theory is a supply-side explanation — fluctuations come from AS shifts, and the economy is expected to converge to a new equilibrium largely on its own."
  },
  {
    concept: "Theories of the Business Cycle",
    q: "Which school of thought is most associated with using active fiscal and monetary stimulus to combat a demand-driven recession?",
    opts: ["Real Business Cycle theory", "Keynesian theory", "Monetarist theory"],
    correct: 1,
    exp: "Keynesian theory specifically advocates active government intervention to restore full employment and prevent a deflationary spiral during AD-driven downturns."
  },
  {
    concept: "Consumer Behavior",
    q: "Which category of consumer spending shows the most pronounced cyclical swings?",
    opts: ["Non-durable goods", "Durable goods", "Both equally"],
    correct: 1,
    exp: "Durable goods (autos, appliances, furniture) are big-ticket items that can be kept in service longer through repairs, making their replacement easy to postpone during uncertain times."
  },
  {
    concept: "Consumer Behavior",
    q: "Permanent income, as opposed to temporary income, most directly guides which type of spending?",
    opts: ["Durable goods spending", "Services spending", "Government spending"],
    correct: 1,
    exp: "Services spending tracks households' sense of durable, reliable income (permanent income) more than one-off windfalls."
  },
  {
    concept: "Housing & Business Investment",
    q: "Housing demand is unusually sensitive to which factor, more than most sectors?",
    opts: ["Interest rates", "Corporate tax rates", "Import tariffs"],
    correct: 0,
    exp: "Because most homes are purchased with mortgage financing, housing demand responds strongly and directly to changes in borrowing costs."
  },
  {
    concept: "Housing & Business Investment",
    q: "Among consumer goods companies, business equipment companies, and household products companies, which typically fluctuates MOST with the domestic business cycle?",
    opts: ["Consumer goods companies", "Business equipment (investment) companies", "Household products companies selling domestically and abroad"],
    correct: 1,
    exp: "Business investment is the most volatile component of GDP across the cycle — firms expand and cut capital spending more sharply than consumers adjust spending."
  },
  {
    concept: "External Trade",
    q: "A country's exports are most directly driven by:",
    opts: ["Domestic GDP growth", "Economic conditions in trading partner countries", "The domestic unemployment rate"],
    correct: 1,
    exp: "Exports reflect foreign demand for domestic output, so they respond to conditions in trading partner economies rather than domestic conditions."
  },
  {
    concept: "External Trade",
    q: "A country's currency appreciates significantly. All else equal, what is the likely effect on its trade balance?",
    opts: ["Exports rise and imports fall", "Imports rise and exports fall", "No effect on trade at all"],
    correct: 1,
    exp: "A stronger currency makes imports cheaper for domestic buyers and makes exports more expensive for foreign buyers, tending to raise imports and reduce exports."
  },
  {
    concept: "Types & Measures",
    q: "The labor force is best defined as:",
    opts: ["Everyone of working age", "Everyone who is employed or actively seeking employment", "Everyone who has a full-time job"],
    correct: 1,
    exp: "The labor force includes both the employed and the unemployed who are actively seeking work — it excludes retirees, students, and others not seeking employment."
  },
  {
    concept: "Types & Measures",
    q: "A country has a labor force of 180,000 and 9,000 unemployed. What is the unemployment rate?",
    opts: ["5.0%", "9.0%", "20.0%"],
    correct: 0,
    exp: "Unemployment rate = Unemployed / Labor force = 9,000 / 180,000 = 5.0%."
  },
  {
    concept: "Types & Measures",
    q: "A discouraged worker who has stopped looking for a job is:",
    opts: ["Counted as unemployed", "Counted as employed", "Excluded from the labor force entirely"],
    correct: 2,
    exp: "Discouraged workers are statistically outside the labor force, similar to retirees or students — they don't appear in the official unemployment rate at all."
  },
  {
    concept: "Why It Lags the Cycle",
    q: "During a prolonged recession, the unemployment rate can sometimes fall even without genuine improvement in the job market. Why?",
    opts: ["Because layoffs stop entirely during recessions", "Because discouraged workers exit the labor force and are no longer counted", "Because unemployment statistics are recalculated annually only"],
    correct: 1,
    exp: "As discouraged workers stop actively searching, they drop out of the labor force and are no longer counted as unemployed, which can artificially lower the measured rate."
  },
  {
    concept: "Why It Lags the Cycle",
    q: "Which of the following tends to be an earlier signal of labor market weakness than the unemployment rate itself?",
    opts: ["Overtime hours and temporary staffing levels", "The federal minimum wage", "Corporate dividend announcements"],
    correct: 0,
    exp: "Businesses typically cut overtime and temporary staff before touching full-time headcount, making these measures earlier warning signs than the unemployment rate."
  },
  {
    concept: "Inflation, Deflation & Hyperinflation",
    q: "Disinflation is best described as:",
    opts: ["A sustained decrease in the price level", "A slowdown in the rate of inflation, while prices are still rising", "An extremely rapid increase in prices"],
    correct: 1,
    exp: "Disinflation means the inflation rate is falling (e.g., from 20% to 6%), but it remains positive — prices are still rising, just more slowly. This is distinct from deflation."
  },
  {
    concept: "Inflation, Deflation & Hyperinflation",
    q: "Why is deflation considered particularly dangerous for an economy?",
    opts: ["It has no real economic effects", "It increases the real burden of fixed-nominal debt, prompting spending cuts that deepen the downturn", "It always leads directly to hyperinflation"],
    correct: 1,
    exp: "Since debt is fixed in nominal terms, falling prices increase its real burden, prompting over-indebted firms to cut spending and jobs sharply, worsening the contraction."
  },
  {
    concept: "Inflation, Deflation & Hyperinflation",
    q: "Hyperinflation is most commonly caused by:",
    opts: ["Excessive government spending financed by printing money", "Very low unemployment alone", "A strengthening currency"],
    correct: 0,
    exp: "Hyperinflation typically arises when government spending isn't backed by real tax revenue and is instead financed by rapidly expanding the money supply."
  },
  {
    concept: "Measuring Inflation",
    q: "A price index using a fixed basket of goods (a Laspeyres index) generally tends to:",
    opts: ["Understate true inflation", "Overstate true inflation, due to substitution, quality, and new product biases", "Have no systematic bias"],
    correct: 1,
    exp: "All three biases — substitution, quality, and new product bias — push in the same direction, causing a fixed-basket index to generally overstate the true rate of inflation."
  },
  {
    concept: "Measuring Inflation",
    q: "A basket contains 40 units of good A (price rises from $2.00 to $2.50) and 20 units of good B (price stays at $5). What is the price index (base=100)?",
    opts: ["111.1", "125.0", "108.3"],
    correct: 0,
    exp: "Base value = 40(2)+20(5) = 180. Current value = 40(2.50)+20(5) = 200. Index = (200/180) × 100 ≈ 111.1."
  },
  {
    concept: "Measuring Inflation",
    q: "Substitution bias in a price index arises because:",
    opts: ["A fixed basket doesn't capture consumers shifting toward cheaper alternatives as relative prices change", "Consumers never actually substitute between goods", "New products are added too quickly to the basket"],
    correct: 0,
    exp: "When a good's price rises, consumers often shift to cheaper substitutes, but a fixed basket keeps weighting the pricier good as before, overstating the true cost-of-living increase."
  },
  {
    concept: "Cost-Push vs. Demand-Pull",
    q: "Cost-push inflation is most directly linked to:",
    opts: ["Wages growing faster than productivity, raising unit labor costs", "Excess money chasing too few goods", "A strengthening domestic currency"],
    correct: 0,
    exp: "When compensation grows faster than productivity, unit labor costs (ULC = W/O) rise, squeezing margins and pushing firms to raise prices — the definition of cost-push inflation."
  },
  {
    concept: "Cost-Push vs. Demand-Pull",
    q: "Demand-pull inflation is most closely associated with:",
    opts: ["Actual GDP running close to or above potential GDP, creating capacity bottlenecks", "Falling wages across the economy", "A shrinking money supply"],
    correct: 0,
    exp: "As actual output approaches or exceeds potential GDP, capacity constraints and bottlenecks become more binding, creating demand-pull inflationary pressure."
  },
  {
    concept: "Cost-Push vs. Demand-Pull",
    q: "The Monetarist explanation of inflation is best summarized as:",
    opts: ["\"Inflation results when too much money chases too few goods\"", "Inflation is caused exclusively by government tax policy", "Inflation is unrelated to the money supply"],
    correct: 0,
    exp: "The Monetarist view holds that inflation is fundamentally a monetary phenomenon — an excess supply of money reduces money's value, which shows up as a general rise in prices."
  }
];

(function(){
  const shell = document.getElementById('quizShell');
  if (!shell) return;
  let current = 0;
  let score = 0;
  const answered = new Array(QUIZ.length).fill(null);

  function renderQuestion(){
    const item = QUIZ[current];
    let html = `<div class="quiz-progress">Question ${current+1} of ${QUIZ.length} &nbsp;·&nbsp; Score so far: ${score}</div>`;
    html += `<div class="quiz-q">${item.q}</div>`;
    html += `<div class="opt-list" id="quizOpts">`;
    item.opts.forEach((opt, i) => {
      html += `<button class="opt-btn" data-i="${i}">${opt}</button>`;
    });
    html += `</div>`;
    html += `<div class="quiz-explain" id="quizExplain">${item.exp}</div>`;
    html += `<div class="quiz-nav">
      <button class="btn ghost" id="quizPrev" ${current===0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn" id="quizNext" disabled>${current === QUIZ.length-1 ? 'See score' : 'Next →'}</button>
    </div>`;
    shell.innerHTML = html;

    const opts = shell.querySelectorAll('.opt-btn');
    const explain = document.getElementById('quizExplain');
    const nextBtn = document.getElementById('quizNext');
    const prevBtn = document.getElementById('quizPrev');

    if (answered[current] !== null){
      opts.forEach(btn => {
        btn.disabled = true;
        const i = +btn.dataset.i;
        if (i === item.correct) btn.classList.add('correct');
        else if (i === answered[current]) btn.classList.add('incorrect');
      });
      explain.classList.add('show');
      nextBtn.disabled = false;
    }

    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered[current] !== null) return;
        const i = +btn.dataset.i;
        answered[current] = i;
        if (i === item.correct) score++;
        if (typeof cfaRecordAnswer === "function" && item.concept){
          cfaRecordAnswer(item.concept, "Business Cycles", i === item.correct);
        }
        opts.forEach(b => {
          b.disabled = true;
          const bi = +b.dataset.i;
          if (bi === item.correct) b.classList.add('correct');
          else if (bi === i) b.classList.add('incorrect');
        });
        explain.classList.add('show');
        nextBtn.disabled = false;
        markSectionProgress('sec-quiz');
      });
    });

    nextBtn.addEventListener('click', () => {
      if (current < QUIZ.length - 1){ current++; renderQuestion(); }
      else { renderScore(); }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){ current--; renderQuestion(); }
    });
  }

  function renderScore(){
    const pct = Math.round((score / QUIZ.length) * 100);
    let msg = "Solid foundation — review the sections you missed and try again.";
    if (pct >= 90) msg = "Excellent — you've genuinely internalized this reading.";
    else if (pct >= 70) msg = "Good work — a couple of gaps worth revisiting.";
    shell.innerHTML = `
      <div class="quiz-score">
        <div style="font-family:var(--font-mono); font-size:.8rem; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.08em;">Final score</div>
        <div class="big">${score} / ${QUIZ.length}</div>
        <p style="max-width:46ch; margin:10px auto 22px; color:var(--ink-soft);">${msg}</p>
        <button class="btn" id="quizRestart">Retake the quiz</button>
      </div>`;
    document.getElementById('quizRestart').addEventListener('click', () => {
      current = 0; score = 0;
      answered.fill(null);
      renderQuestion();
    });
  }

  renderQuestion();
})();

  } catch(e) { console.warn('[business-cycles] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: concept-sheet
   ============================================================ */
(function(){
  try {
// ============================================================
// Economics Concept & Formula Sheet — data-driven, rendered with KaTeX
// ============================================================

const MODULES = [
  {
    num: "00",
    title: "Economics Foundations",
    formulas: [
      { name: "Opportunity cost", tex: ["\\text{Value of the best alternative given up}"] },
      { name: "The four factors of production", tex: ["\\text{Land, Labor, Capital, Entrepreneurship}"] },
      { name: "Positive vs. normative", tex: ["\\text{Positive: testable fact} \\quad \\text{Normative: value judgment}"] },
      { name: "Reading a graph", tex: ["\\text{On-axis variable} \\to \\text{movement along curve}", "\\text{Off-axis variable} \\to \\text{shift of curve}"] },
    ]
  },
  {
    num: "E1",
    title: "Demand and Supply Analysis",
    formulas: [
      { name: "Own-price elasticity of demand", tex: ["E_P = \\dfrac{\\%\\Delta Q_x}{\\%\\Delta P_x} = \\dfrac{\\Delta Q_x}{\\Delta P_x}\\cdot\\dfrac{P_x}{Q_x}"] },
      { name: "Income &amp; cross-price elasticity", tex: ["E_I = \\dfrac{\\Delta Q_x}{\\Delta I}\\cdot\\dfrac{I}{Q_x}, \\quad E_{P_y} = \\dfrac{\\Delta Q_x}{\\Delta P_y}\\cdot\\dfrac{P_y}{Q_x}"], note: "Income: + normal, − inferior. Cross-price: + substitutes, − complements" },
      { name: "Elasticity &amp; total revenue", tex: ["|E|>1 \\text{ elastic}, \\; |E|<1 \\text{ inelastic}, \\; |E|=1 \\text{ unit elastic}"] },
      { name: "Marginal &amp; average product", tex: ["MP = \\dfrac{\\Delta TP}{\\Delta L}, \\quad AP = \\dfrac{TP}{L}"] },
      { name: "Profit maximization", tex: ["\\text{Produce where } MR = MC \\text{ (MC not falling)}"] },
      { name: "Cost curves", tex: ["TC = TFC+TVC", "AFC=\\dfrac{TFC}{Q}, \\; AVC=\\dfrac{TVC}{Q}, \\; ATC=\\dfrac{TC}{Q}", "MC = \\dfrac{\\Delta TC}{\\Delta Q}"] },
      { name: "Breakeven &amp; shutdown", tex: ["\\text{Breakeven: } P=ATC \\quad \\text{Shutdown: } P=AVC"] },
    ]
  },
  {
    num: "E2",
    title: "The Firm and Market Organization",
    formulas: [
      { name: "MR from elasticity", tex: ["MR = P\\left[1-\\dfrac{1}{E}\\right]"] },
      { name: "Consumer surplus", tex: ["CS = \\tfrac{1}{2} \\times Q \\times (\\text{price intercept} - P)"] },
      { name: "Market equilibrium", tex: ["\\text{Demand} = \\text{Supply} \\Rightarrow \\text{solve for } P^*, Q^*"] },
      { name: "Perfect competition", tex: ["P = AR = MR"] },
      { name: "Long-run equilibrium (perfect comp.)", tex: ["P = MC = \\text{min } AC"] },
      { name: "Monopolist demand &amp; MR", tex: ["P = \\tfrac{a}{b}-\\tfrac{1}{b}Q, \\quad MR = \\tfrac{a}{b}-\\tfrac{2}{b}Q"], note: "MR falls twice as steeply as demand" },
      { name: "Two-part tariff (extract all CS)", tex: ["\\text{Fee} = CS \\text{ at } P=MC"] },
    ]
  },
  {
    num: "E3",
    title: "GDP, Income &amp; Expenditure",
    formulas: [
      { name: "Nominal &amp; real GDP", tex: ["\\text{Nominal GDP} = P_t \\times Q_t", "\\text{Real GDP} = P_{base} \\times Q_t"] },
      { name: "GDP deflator", tex: ["\\text{GDP deflator} = \\dfrac{\\text{Nominal GDP}}{\\text{Real GDP}} \\times 100"] },
      { name: "Expenditure approach", tex: ["GDP = C+I+G+(X-M)"] },
      { name: "MPC &amp; MPS", tex: ["MPC+MPS=1"] },
      { name: "The fundamental macro identity", tex: ["S = I+(G-T)+(X-M)"] },
    ]
  },
  {
    num: "E3",
    title: "AD, AS &amp; Economic Growth",
    formulas: [
      { name: "AD slopes down via", tex: ["\\text{Wealth, interest rate, real exchange rate effects}"] },
      { name: "AS curves by horizon", tex: ["VSRAS: \\text{flat} \\quad SRAS: \\text{upward} \\quad LRAS: \\text{vertical}"] },
      { name: "Production function", tex: ["Y = A \\times F(L,K)"] },
      { name: "Growth accounting", tex: ["\\Delta\\%Y_{potential} = \\Delta\\%TFP + W_L(\\Delta\\%L) + W_K(\\Delta\\%K)"] },
      { name: "Labor productivity", tex: ["\\text{Labor productivity} = \\dfrac{\\text{Real GDP}}{\\text{Aggregate hours}}"] },
    ]
  },
  {
    num: "E4",
    title: "Introduction to Business Cycles",
    formulas: [
      { name: "Unemployment &amp; participation rate", tex: ["\\text{Unemployment rate} = \\dfrac{\\text{Unemployed}}{\\text{Labor force}}", "\\text{Participation rate} = \\dfrac{\\text{Labor force}}{\\text{Working-age population}}"] },
      { name: "Price index &amp; inflation", tex: ["\\text{Index} = \\dfrac{\\text{Current basket value}}{\\text{Base basket value}}\\times 100"] },
      { name: "Unit labor cost", tex: ["ULC = \\dfrac{W}{O}"], note: "W = compensation, O = output per hour" },
      { name: "Indicator timing", tex: ["\\text{Leading} \\to \\text{Coincident} \\to \\text{Lagging}"] },
    ]
  },
  {
    num: "E5",
    title: "Monetary and Fiscal Policy",
    formulas: [
      { name: "Money multiplier", tex: ["\\text{Multiplier} = \\dfrac{1}{\\text{Reserve requirement}}"] },
      { name: "Total money created", tex: ["\\text{Total money} = \\dfrac{\\text{New deposit}}{\\text{Reserve requirement}}"] },
      { name: "Quantity equation of exchange", tex: ["M \\times V = P \\times Y"] },
      { name: "The Fisher effect", tex: ["R_{nom} = R_{real} + \\pi^e"] },
    ]
  },
  {
    num: "E6",
    title: "International Trade and Capital Flows",
    formulas: [
      { name: "Absolute advantage", tex: ["\\text{More output per worker, in absolute terms}"] },
      { name: "Comparative advantage", tex: ["\\text{Lower opportunity cost} = \\dfrac{\\text{Good given up}}{\\text{Good gained}}"] },
      { name: "Gains from trade range", tex: ["\\text{Autarkic price}_A < \\text{World price} < \\text{Autarkic price}_B"] },
      { name: "National income identity (open economy)", tex: ["Y = C+I+G+(X-M)"] },
      { name: "Current account", tex: ["CA = X-M = Y-(C+I+G)"] },
    ]
  },
  {
    num: "E7",
    title: "Currency Exchange Rates",
    formulas: [
      { name: "Real exchange rate", tex: ["R_{d/f} = \\text{Nominal rate} \\times \\text{Price level ratio}"] },
      { name: "Percentage change in a currency", tex: ["\\%\\Delta = \\dfrac{\\text{New rate}-\\text{Old rate}}{\\text{Old rate}}"] },
      { name: "Hedged return (spot + rate + forward)", tex: ["\\left(\\dfrac{1}{\\text{Spot}}\\right)(1+r_f)(\\text{Forward}) - 1"] },
      { name: "Marshall-Lerner condition", tex: ["\\omega_X \\varepsilon_X + \\omega_M(\\varepsilon_M-1) > 0"], note: "ω = trade shares, ε = demand elasticities" },
    ]
  },
];

/* ============================================================
   Render engine
   ============================================================ */
(function(){
  const sheet = document.getElementById('sheet');
  if (!sheet) return;
  MODULES.forEach(mod => {
    const block = document.createElement('div');
    block.className = 'module-block';

    const h2 = document.createElement('h2');
    h2.innerHTML = `<span class="module-num">${mod.num}</span>${mod.title}`;
    block.appendChild(h2);

    mod.formulas.forEach(f => {
      const item = document.createElement('div');
      item.className = 'formula-item';

      const name = document.createElement('div');
      name.className = 'formula-name';
      name.innerHTML = f.name;
      item.appendChild(name);

      const expr = document.createElement('div');
      expr.className = 'formula-expr';
      f.tex.forEach(line => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'katex-line';
        try {
          katex.render(line, lineDiv, { throwOnError: false, displayMode: false });
        } catch(e) {
          lineDiv.textContent = line;
        }
        expr.appendChild(lineDiv);
      });
      item.appendChild(expr);

      if (f.note){
        const note = document.createElement('div');
        note.className = 'formula-note';
        note.innerHTML = f.note;
        item.appendChild(note);
      }

      block.appendChild(item);
    });

    sheet.appendChild(block);
  });
})();

  } catch(e) { console.warn('[concept-sheet] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: currency-fx
   ============================================================ */
(function(){
  try {
// ============================================================
// Currency Exchange Rates — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }

/* ============================================================
   04 — Hedged return calculator (AUD/HKD carry trade example)
   ============================================================ */
(function(){
  const spotI = document.getElementById('hedgeSpot'), rateI = document.getElementById('hedgeRate'), forwardI = document.getElementById('hedgeForward');
  const result = document.getElementById('hedgeResult'), steps = document.getElementById('hedgeSteps');
  if (!spotI) return;
  function render(){
    const spot = parseFloat(spotI.value), rate = parseFloat(rateI.value)/100, forward = parseFloat(forwardI.value);
    const step1 = 1/spot;
    const step2 = step1 * (1+rate);
    const step3 = step2 * forward;
    const returnPct = (step3 - 1) * 100;
    result.textContent = `Domestic return ≈ ${fmt(returnPct,2)}%`;
    steps.textContent = `1/${spot}=${fmt(step1,2)} → ×${fmt(1+rate,3)}=${fmt(step2,2)} → ×${forward}=${fmt(step3,3)} → ${fmt(returnPct,2)}%`;
  }
  [spotI,rateI,forwardI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   05 — Percentage change calculator
   ============================================================ */
(function(){
  const oldI = document.getElementById('pcOld'), newI = document.getElementById('pcNew');
  const result = document.getElementById('pcResult');
  if (!oldI) return;
  function render(){
    const oldRate = parseFloat(oldI.value), newRate = parseFloat(newI.value);
    const pctChange = ((newRate - oldRate) / oldRate) * 100;
    result.textContent = `%Δ = ${pctChange>=0?'+':''}${fmt(pctChange,2)}%`;
  }
  [oldI,newI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   06 — Marshall-Lerner condition calculator
   ============================================================ */
(function(){
  const wxI = document.getElementById('mlWx'), exI = document.getElementById('mlEx'), emI = document.getElementById('mlEm');
  const result = document.getElementById('mlResult'), steps = document.getElementById('mlSteps');
  if (!wxI) return;
  function render(){
    const wx = parseFloat(wxI.value), ex = parseFloat(exI.value), em = parseFloat(emI.value);
    const wm = 1 - wx;
    const mlValue = wx*ex + wm*(em-1);
    const holds = mlValue > 0;
    result.innerHTML = `${fmt(mlValue,3)} ${holds ? '<span style="color:var(--green); font-weight:700;">&gt; 0 — condition holds</span>' : '<span style="color:var(--red); font-weight:700;">≤ 0 — condition fails</span>'}`;
    steps.textContent = `${fmt(wx,2)}(${ex}) + ${fmt(wm,2)}(${em}−1) = ${fmt(mlValue,3)}`;
  }
  [wxI,exI,emI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   Check-in mini quizzes
   ============================================================ */
(function(){
  document.querySelectorAll('.checkin').forEach(box => {
    const btns = box.querySelectorAll('.opt-btn');
    const feedback = box.querySelector('.checkin-feedback');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btns.forEach(b => b.disabled = true);
        btns.forEach(b => { if (b.dataset.correct === 'true') b.classList.add('correct'); });
        if (btn.dataset.correct !== 'true') btn.classList.add('incorrect');
        feedback.classList.add('show');
        markSectionProgress(box.closest('section').id);
      });
    });
  });
})();

/* ============================================================
   Sidebar scroll-spy + progress + mobile toggle
   ============================================================ */
const sectionIds = ['sec-fxmarket','sec-nominalreal','sec-spotforward','sec-hedging','sec-percentchange','sec-elasticities','sec-quiz'];
const visited = new Set();

function markSectionProgress(id){
  if (sectionIds.includes(id)){
    visited.add(id);
    updateProgress();
  }
}
function updateProgress(){
  const pct = Math.round((visited.size / sectionIds.length) * 100);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressPct');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
  sectionIds.forEach(id => {
    const link = document.querySelector(`.toc a[data-sec="${id}"]`);
    if (link && visited.has(id)) link.classList.add('done');
  });
  try { localStorage.setItem('cfa-progress-currency-fx', String(pct)); } catch(e) {}
}

(function(){
  const links = document.querySelectorAll('.toc a[data-sec]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.toc a[data-sec="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting){
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        markSectionProgress(id);
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle){
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.querySelectorAll('.toc a').forEach(a => a.addEventListener('click', () => sidebar.classList.remove('open')));
  }
})();

/* ============================================================
   QUIZ
   ============================================================ */
const QUIZ = [
  {
    concept: "Size & Importance",
    q: "By daily turnover, the foreign exchange market is:",
    opts: ["Smaller than global equity markets", "The largest financial market in the world", "About the same size as global bond markets"],
    correct: 1,
    exp: "At roughly $5.1 trillion in daily turnover, the FX market is by far the world's largest financial market — far larger than global bond or equity markets."
  },
  {
    concept: "Size & Importance",
    q: "An investor holds only domestic stocks and has never purchased a foreign security. Is this investor exposed to FX market movements?",
    opts: ["No, direct foreign holdings are required for any FX exposure", "Yes, indirectly, through the foreign revenue and competition faced by domestic companies", "Only if the investor also holds government bonds"],
    correct: 1,
    exp: "Large domestic companies often earn significant revenue abroad and compete internationally, so FX markets affect their earnings and valuations even without any direct foreign holdings."
  },
  {
    concept: "Nominal & Real Exchange Rates",
    q: "When a currency buys more of another currency than it did before, it has:",
    opts: ["Depreciated", "Appreciated", "Defaulted"],
    correct: 1,
    exp: "A currency that can purchase more of another currency than previously has appreciated in value."
  },
  {
    concept: "Nominal & Real Exchange Rates",
    q: "The real exchange rate differs from the nominal exchange rate because it:",
    opts: ["Ignores inflation entirely", "Adjusts for relative price levels between the two countries, capturing true purchasing power", "Is always identical to the nominal rate"],
    correct: 1,
    exp: "The real exchange rate multiplies the nominal rate by the ratio of price levels, capturing the currencies' true relative purchasing power rather than just their nominal price."
  },
  {
    concept: "Nominal & Real Exchange Rates",
    q: "Two countries' nominal exchange rate stays flat for years, but one experiences much higher inflation than the other. What happens to the real exchange rate?",
    opts: ["It stays exactly the same as the nominal rate", "It changes, reflecting the shift in relative purchasing power the flat nominal rate hides", "Real exchange rates cannot exist if nominal rates are flat"],
    correct: 1,
    exp: "The real exchange rate captures the inflation differential, so it can move meaningfully even while the nominal rate stays flat."
  },
  {
    concept: "Spot, Forward & FX Swaps",
    q: "A spot foreign exchange transaction typically settles:",
    opts: ["Immediately, with no delay", "About two business days after the trade (T+2)", "Exactly one year after the trade"],
    correct: 1,
    exp: "Spot transactions for most currencies settle on a T+2 basis — two business days after the trade is agreed."
  },
  {
    concept: "Spot, Forward & FX Swaps",
    q: "A forward contract differs from a spot transaction in that it:",
    opts: ["Always settles faster than T+2", "Locks in an exchange rate today for a transaction settling at a specified future date", "Cannot be used to hedge currency risk"],
    correct: 1,
    exp: "A forward contract fixes today the exchange rate for a future settlement date, which is exactly what makes it useful for hedging."
  },
  {
    concept: "Spot, Forward & FX Swaps",
    q: "An FX swap is best described as:",
    opts: ["A single spot transaction only", "A combination of a spot transaction and an offsetting forward transaction", "A type of currency option"],
    correct: 1,
    exp: "An FX swap combines a spot transaction with an offsetting forward transaction, often used to roll an existing forward position to a new date."
  },
  {
    concept: "Hedging a Foreign Investment",
    q: "In the AUD/HKD hedged investment example, what specifically eliminates the investor's currency risk?",
    opts: ["The fact that HKD interest rates are low", "Locking in the AUD/HKD conversion rate today via a forward contract, rather than relying on the future spot rate", "Choosing to invest for exactly one year"],
    correct: 1,
    exp: "The forward contract removes the uncertainty about the future spot rate, which is the actual source of currency risk in the strategy."
  },
  {
    concept: "Hedging a Foreign Investment",
    q: "In the AUD/HKD example (spot 0.1714, HKD rate 2.20%, forward 0.1724), what is the approximate AUD-denominated return?",
    opts: ["2.2%", "2.8%", "6.0%"],
    correct: 1,
    exp: "Converting spot, earning the HKD interest rate, then converting back at the forward rate produces an AUD return of approximately 2.8% — higher than the HKD rate alone, reflecting the forward premium on HKD."
  },
  {
    concept: "% Change in Currency Value",
    q: "The percentage change in an exchange rate is calculated as:",
    opts: ["(New rate − Old rate) / Old rate", "(Old rate − New rate) / New rate", "New rate × Old rate"],
    correct: 0,
    exp: "%Δ = (New rate − Old rate) / Old rate, the standard percentage change formula applied to the exchange rate."
  },
  {
    concept: "% Change in Currency Value",
    q: "The USD/EUR rate moves from 1.2000 to 1.1400. What is the approximate percentage change?",
    opts: ["-5.0%", "+5.0%", "-6.0%"],
    correct: 0,
    exp: "%Δ = (1.1400 − 1.2000)/1.2000 = −0.0600/1.2000 ≈ −5.0%."
  },
  {
    concept: "% Change in Currency Value",
    q: "If Currency A depreciates by 10% against Currency B, by what percentage must Currency B appreciate against Currency A to fully reverse the move?",
    opts: ["Exactly 10%", "Approximately 11.1%", "Exactly 20%"],
    correct: 1,
    exp: "Percentage changes are calculated relative to different starting bases, so reversing a 10% depreciation requires an appreciation of roughly 11.1%, not exactly 10%."
  },
  {
    concept: "The Elasticities Approach",
    q: "The Marshall-Lerner condition addresses:",
    opts: ["Whether a currency devaluation will actually improve a country's trade balance", "How central banks set interest rates", "How GDP is calculated"],
    correct: 0,
    exp: "The Marshall-Lerner condition specifies when a currency devaluation will move the trade balance toward surplus, based on export and import demand elasticities."
  },
  {
    concept: "The Elasticities Approach",
    q: "The generalized Marshall-Lerner condition is written as:",
    opts: ["ωXεX + ωM(εM − 1) > 0", "ωX + ωM = εX + εM", "εX × εM > 1"],
    correct: 0,
    exp: "The generalized Marshall-Lerner condition: ωXεX + ωM(εM−1) > 0, where ω terms are trade shares and ε terms are demand elasticities."
  },
  {
    concept: "The Elasticities Approach",
    q: "If a country's import demand elasticity (εM) is well below 1 (inelastic), what happens to import expenditure when the domestic currency depreciates?",
    opts: ["Import expenditure falls sharply", "Import expenditure can actually rise, since quantity barely falls despite the higher price", "Import expenditure is completely unaffected"],
    correct: 1,
    exp: "With inelastic import demand, quantity purchased falls only slightly even as import prices rise, meaning total import expenditure can actually increase rather than decrease."
  },
  {
    concept: "The Elasticities Approach",
    q: "For the Marshall-Lerner condition to hold and support a devaluation improving the trade balance, demand for exports and imports generally needs to be:",
    opts: ["Sufficiently price-elastic", "Perfectly price-inelastic", "Completely unrelated to price"],
    correct: 0,
    exp: "The condition requires demand to be sufficiently responsive (elastic) to price changes for a devaluation to meaningfully shift trade volumes and improve the balance."
  },
  {
    concept: "The Elasticities Approach",
    q: "A country initially runs a trade deficit. According to the Marshall-Lerner framework, this implies:",
    opts: ["ωM > ωX (imports' trade share exceeds exports')", "ωX > ωM (exports' trade share exceeds imports')", "ωX must equal ωM exactly"],
    correct: 0,
    exp: "An initial trade deficit means imports exceed exports in value, so imports' share of total trade (ωM) exceeds exports' share (ωX)."
  },
  {
    concept: "Nominal & Real Exchange Rates",
    q: "Given exchange rates for currency pairs A/B and A/C, what can be computed?",
    opts: ["The cross-rate B/C between the other two currencies", "The interest rate in country A", "The GDP of country B"],
    correct: 0,
    exp: "Sharing a common currency (A) between two known exchange rate pairs allows you to derive the implied cross-rate between the other two currencies, B and C."
  },
  {
    concept: "Spot, Forward & FX Swaps",
    q: "Why do forward contracts exist alongside spot transactions in the FX market?",
    opts: ["Forward contracts allow market participants to lock in exchange rates for future settlement dates, managing currency risk that spot transactions can't address", "Forward contracts are simply a slower version of spot transactions with no functional difference", "Spot transactions have been phased out entirely"],
    correct: 0,
    exp: "Forward contracts specifically address the currency risk of future cash flows by fixing an exchange rate today, a need spot transactions (settling almost immediately) cannot serve."
  }
];

(function(){
  const shell = document.getElementById('quizShell');
  if (!shell) return;
  let current = 0;
  let score = 0;
  const answered = new Array(QUIZ.length).fill(null);

  function renderQuestion(){
    const item = QUIZ[current];
    let html = `<div class="quiz-progress">Question ${current+1} of ${QUIZ.length} &nbsp;·&nbsp; Score so far: ${score}</div>`;
    html += `<div class="quiz-q">${item.q}</div>`;
    html += `<div class="opt-list" id="quizOpts">`;
    item.opts.forEach((opt, i) => {
      html += `<button class="opt-btn" data-i="${i}">${opt}</button>`;
    });
    html += `</div>`;
    html += `<div class="quiz-explain" id="quizExplain">${item.exp}</div>`;
    html += `<div class="quiz-nav">
      <button class="btn ghost" id="quizPrev" ${current===0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn" id="quizNext" disabled>${current === QUIZ.length-1 ? 'See score' : 'Next →'}</button>
    </div>`;
    shell.innerHTML = html;

    const opts = shell.querySelectorAll('.opt-btn');
    const explain = document.getElementById('quizExplain');
    const nextBtn = document.getElementById('quizNext');
    const prevBtn = document.getElementById('quizPrev');

    if (answered[current] !== null){
      opts.forEach(btn => {
        btn.disabled = true;
        const i = +btn.dataset.i;
        if (i === item.correct) btn.classList.add('correct');
        else if (i === answered[current]) btn.classList.add('incorrect');
      });
      explain.classList.add('show');
      nextBtn.disabled = false;
    }

    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered[current] !== null) return;
        const i = +btn.dataset.i;
        answered[current] = i;
        if (i === item.correct) score++;
        if (typeof cfaRecordAnswer === "function" && item.concept){
          cfaRecordAnswer(item.concept, "Currency Exchange Rates", i === item.correct);
        }
        opts.forEach(b => {
          b.disabled = true;
          const bi = +b.dataset.i;
          if (bi === item.correct) b.classList.add('correct');
          else if (bi === i) b.classList.add('incorrect');
        });
        explain.classList.add('show');
        nextBtn.disabled = false;
        markSectionProgress('sec-quiz');
      });
    });

    nextBtn.addEventListener('click', () => {
      if (current < QUIZ.length - 1){ current++; renderQuestion(); }
      else { renderScore(); }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){ current--; renderQuestion(); }
    });
  }

  function renderScore(){
    const pct = Math.round((score / QUIZ.length) * 100);
    let msg = "Solid foundation — review the sections you missed and try again.";
    if (pct >= 90) msg = "Excellent — you've genuinely internalized this reading.";
    else if (pct >= 70) msg = "Good work — a couple of gaps worth revisiting.";
    shell.innerHTML = `
      <div class="quiz-score">
        <div style="font-family:var(--font-mono); font-size:.8rem; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.08em;">Final score</div>
        <div class="big">${score} / ${QUIZ.length}</div>
        <p style="max-width:46ch; margin:10px auto 22px; color:var(--ink-soft);">${msg}</p>
        <button class="btn" id="quizRestart">Retake the quiz</button>
      </div>`;
    document.getElementById('quizRestart').addEventListener('click', () => {
      current = 0; score = 0;
      answered.fill(null);
      renderQuestion();
    });
  }

  renderQuestion();
})();

  } catch(e) { console.warn('[currency-fx] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: demand-supply
   ============================================================ */
(function(){
  try {
// ============================================================
// Topics in Demand and Supply Analysis — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }
function parseNums(str){
  return str.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
}
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   01 — Demand function calculator + demand curve chart
   ============================================================ */
(function(){
  const pxI = document.getElementById('dfPx'), iI = document.getElementById('dfI'), pyI = document.getElementById('dfPy');
  const result = document.getElementById('dfResult'), steps = document.getElementById('dfSteps');
  const chartContainer = document.getElementById('demandCurveChart');
  if (!pxI) return;

  function computeQ(px, income, py){
    return 84.5 - 6.39*px + 0.25*income - 2*py;
  }

  function renderChart(px, income, py){
    const W=520, H=280, padL=50, padR=20, padT=20, padB=40;
    // inverse demand: Px = a - b*Qx, holding income/py fixed
    const intercept = (84.5 + 0.25*income - 2*py) / 6.39; // Qx-intercept (Px=0)
    const bCoef = 1/6.39; // slope of inverse demand: dPx/dQx = -1/6.39... actually Px=(const - Qx)/6.39
    const maxQ = intercept;
    const maxP = intercept / 6.39 * 6.39; // just for scaling; compute directly:
    function priceAt(q){ return (84.5 + 0.25*income - 2*py - q) / 6.39; }
    const domainQMax = intercept * 1.05;
    const domainPMax = priceAt(0) * 1.1;
    const xScale = q => padL + (q/domainQMax)*(W-padL-padR);
    const yScale = p => (H-padB) - (p/domainPMax)*(H-padT-padB);

    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'econ-svg', style:'max-width:560px;'});
    // axes
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));
    svg.appendChild(svgEl('line', {x1:padL, x2:padL, y1:padT, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));
    const xlabel = svgEl('text', {x:W/2, y:H-6, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#4A4763'});
    xlabel.textContent = 'Qx (liters/month)';
    svg.appendChild(xlabel);
    const ylabel = svgEl('text', {x:14, y:padT+10, 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#4A4763'});
    ylabel.textContent = 'Px (€)';
    svg.appendChild(ylabel);
    // demand line
    const q0 = 0, q1 = Math.max(0, intercept);
    const p0 = priceAt(q0), p1 = priceAt(q1);
    svg.appendChild(svgEl('line', {x1:xScale(q0), y1:yScale(p0), x2:xScale(q1), y2:yScale(p1), stroke:'#2B2560', 'stroke-width':2.5}));
    // current point
    const currentQ = computeQ(px, income, py);
    if (currentQ >= 0 && currentQ <= domainQMax){
      const cx = xScale(currentQ), cy = yScale(px);
      svg.appendChild(svgEl('line', {x1:cx, x2:cx, y1:cy, y2:H-padB, stroke:'#E8A33D', 'stroke-width':1, 'stroke-dasharray':'3,2'}));
      svg.appendChild(svgEl('line', {x1:padL, x2:cx, y1:cy, y2:cy, stroke:'#E8A33D', 'stroke-width':1, 'stroke-dasharray':'3,2'}));
      svg.appendChild(svgEl('circle', {cx, cy, r:5, fill:'#C77F1E', stroke:'#fff', 'stroke-width':1.5}));
      const lbl = svgEl('text', {x:cx+8, y:cy-8, 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#C77F1E', 'font-weight':'700'});
      lbl.textContent = `(${fmt(currentQ,1)}, €${fmt(px,2)})`;
      svg.appendChild(lbl);
    }
    // axis ticks
    for (let i=0;i<=4;i++){
      const q = domainQMax*i/4;
      const t = svgEl('text', {x:xScale(q), y:H-padB+14, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':8, fill:'#4A4763'});
      t.textContent = Math.round(q);
      svg.appendChild(t);
      const p = domainPMax*i/4;
      const t2 = svgEl('text', {x:padL-6, y:yScale(p)+3, 'text-anchor':'end', 'font-family':'IBM Plex Mono', 'font-size':8, fill:'#4A4763'});
      t2.textContent = fmt(p,1);
      svg.appendChild(t2);
    }
    chartContainer.innerHTML = '';
    chartContainer.appendChild(svg);
  }

  function render(){
    const px = parseFloat(pxI.value), income = parseFloat(iI.value), py = parseFloat(pyI.value);
    const q = computeQ(px, income, py);
    result.textContent = `Qx = ${fmt(q,2)} liters/month`;
    steps.textContent = `84.5 − 6.39(${px}) + 0.25(${income}) − 2(${py}) = ${fmt(q,2)}`;
    renderChart(px, income, py);
  }
  [pxI,iI,pyI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   02 — Elasticity calculator + zone chart
   ============================================================ */
(function(){
  const slopeI = document.getElementById('elSlope'), pI = document.getElementById('elP'), qI = document.getElementById('elQ');
  const result = document.getElementById('elResult'), steps = document.getElementById('elSteps');
  if (!slopeI) return;
  function classify(e){
    const abs = Math.abs(e);
    if (abs > 1.02) return {label:'ELASTIC', cls:'elastic'};
    if (abs < 0.98) return {label:'INELASTIC', cls:'inelastic'};
    return {label:'UNIT ELASTIC', cls:'unit'};
  }
  function render(){
    const slope = parseFloat(slopeI.value), p = parseFloat(pI.value), q = parseFloat(qI.value);
    const e = slope * (p/q);
    const c = classify(e);
    result.innerHTML = `E = ${fmt(e,3)} <span class="elastic-zone-tag ${c.cls}">${c.label}</span>`;
    steps.textContent = `${slope} × (${p}/${q}) = ${fmt(e,3)}`;
  }
  [slopeI,pI,qI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   02b — Elasticity zone chart (static illustrative demand line)
   ============================================================ */
(function(){
  const container = document.getElementById('elasticityZoneChart');
  if (!container) return;
  const W=520, H=240, padL=40, padR=20, padT=20, padB=30;
  // simple line from (0, 10) to (100, 0)
  const xScale = q => padL + (q/100)*(W-padL-padR);
  const yScale = p => (H-padB) - (p/10)*(H-padT-padB);
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'econ-svg', style:'max-width:560px;'});
  svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));
  svg.appendChild(svgEl('line', {x1:padL, x2:padL, y1:padT, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));
  // full line
  svg.appendChild(svgEl('line', {x1:xScale(0), y1:yScale(10), x2:xScale(100), y2:yScale(0), stroke:'#2B2560', 'stroke-width':2.5}));
  // zone shading via colored segments (upper = elastic red-ish, mid = unit amber, lower = inelastic green)
  function seg(q1,q2,color){
    svg.appendChild(svgEl('line', {x1:xScale(q1), y1:yScale(10-q1*0.1), x2:xScale(q2), y2:yScale(10-q2*0.1), stroke:color, 'stroke-width':5, opacity:0.55}));
  }
  seg(0,40,'#D6573F');
  seg(40,60,'#E8A33D');
  seg(60,100,'#2F8F6B');
  const labels = [[20,'Elastic','#8a2f1c'],[50,'Unit Elastic','#C77F1E'],[80,'Inelastic','#1c5b41']];
  labels.forEach(([q,txt,color]) => {
    const t = svgEl('text', {x:xScale(q), y:yScale(10-q*0.1)-12, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:color, 'font-weight':'700'});
    t.textContent = txt;
    svg.appendChild(t);
  });
  const midMark = svgEl('circle', {cx:xScale(50), cy:yScale(5), r:4, fill:'#E8A33D', stroke:'#fff', 'stroke-width':1.5});
  svg.appendChild(midMark);
  const xl = svgEl('text', {x:W/2, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
  xl.textContent = 'Quantity →';
  svg.appendChild(xl);
  const yl = svgEl('text', {x:14, y:padT+10, 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
  yl.textContent = 'Price';
  svg.appendChild(yl);
  container.appendChild(svg);
})();

/* ============================================================
   04 — Income / cross-price elasticity calculator
   ============================================================ */
(function(){
  const slopeI = document.getElementById('icSlope'), varI = document.getElementById('icVar'), qI = document.getElementById('icQ');
  const result = document.getElementById('icResult'), steps = document.getElementById('icSteps');
  if (!slopeI) return;
  function render(){
    const slope = parseFloat(slopeI.value), v = parseFloat(varI.value), q = parseFloat(qI.value);
    const e = slope * (v/q);
    let label, cls;
    if (e > 0.02){ label='POSITIVE (Normal / Substitute)'; cls='inelastic'; }
    else if (e < -0.02){ label='NEGATIVE (Inferior / Complement)'; cls='elastic'; }
    else { label='ZERO'; cls='unit'; }
    result.innerHTML = `E = ${fmt(e,3)} <span class="elastic-zone-tag ${cls}">${label}</span>`;
    steps.textContent = `${slope} × (${v}/${q}) = ${fmt(e,3)}`;
  }
  [slopeI,varI,qI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   06 — Productivity table (TP/AP/MP) with chart
   ============================================================ */
(function(){
  const input = document.getElementById('prodInput');
  const tableContainer = document.getElementById('prodTable');
  const chartContainer = document.getElementById('productivityChart');
  if (!input) return;

  function render(){
    const tp = parseNums(input.value);
    const n = tp.length;
    const ap = tp.map((v,i) => i===0 ? null : v/i);
    const mp = tp.map((v,i) => i===0 ? null : v - tp[i-1]);

    // table
    let html = '<table class="exhibit" style="margin:0; min-width:420px;"><tr><th>L</th>';
    tp.forEach((_,i) => html += `<th>${i}</th>`);
    html += '</tr><tr><td>TP</td>';
    tp.forEach(v => html += `<td class="num">${v}</td>`);
    html += '</tr><tr><td>AP</td>';
    ap.forEach(v => html += `<td class="num">${v===null?'—':fmt(v,1)}</td>`);
    html += '</tr><tr><td>MP</td>';
    mp.forEach(v => html += `<td class="num" style="${v!==null && v<0 ? 'color:var(--red); font-weight:700;':''}">${v===null?'—':fmt(v,1)}</td>`);
    html += '</tr></table>';
    tableContainer.innerHTML = html;

    // chart: AP and MP lines
    if (!chartContainer) return;
    const W=480, H=220, padL=40, padR=20, padT=16, padB=30;
    const validAP = ap.filter(v=>v!==null), validMP = mp.filter(v=>v!==null);
    const allVals = validAP.concat(validMP);
    const minV = Math.min(0, ...allVals), maxV = Math.max(...allVals);
    const xScale = i => padL + (i/(n-1))*(W-padL-padR);
    const yScale = v => (H-padB) - ((v-minV)/(maxV-minV))*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'econ-svg', style:'max-width:520px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:yScale(0), y2:yScale(0), stroke:'#E3DCC9'}));
    svg.appendChild(svgEl('line', {x1:padL, x2:padL, y1:padT, y2:H-padB, stroke:'#4A4763', 'stroke-width':1}));
    function drawLine(arr, color){
      let d = '';
      arr.forEach((v,i) => {
        if (v === null) return;
        const x=xScale(i), y=yScale(v);
        d += (d===''?'M':'L')+x+','+y+' ';
      });
      svg.appendChild(svgEl('path', {d, fill:'none', stroke:color, 'stroke-width':2.2}));
      arr.forEach((v,i) => {
        if (v === null) return;
        svg.appendChild(svgEl('circle', {cx:xScale(i), cy:yScale(v), r:3, fill:color}));
      });
    }
    drawLine(ap, '#2B2560');
    drawLine(mp, '#C77F1E');
    for (let i=0;i<n;i++){
      const t = svgEl('text', {x:xScale(i), y:H-10, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':8, fill:'#4A4763'});
      t.textContent = i;
      svg.appendChild(t);
    }
    chartContainer.innerHTML = '';
    chartContainer.appendChild(svg);
    const legend = document.createElement('div');
    legend.style.display='flex'; legend.style.gap='16px'; legend.style.marginTop='6px'; legend.style.fontFamily='var(--font-mono)'; legend.style.fontSize='.72rem';
    legend.innerHTML = `<span><span style="display:inline-block;width:12px;height:2px;background:#2B2560;margin-right:5px;vertical-align:middle;"></span>Average Product</span><span><span style="display:inline-block;width:12px;height:2px;background:#C77F1E;margin-right:5px;vertical-align:middle;"></span>Marginal Product</span>`;
    chartContainer.appendChild(legend);
  }
  input.addEventListener('input', render);
  render();
})();

/* ============================================================
   08 — Cost curve builder
   ============================================================ */
(function(){
  const tfcI = document.getElementById('ccTFC'), tvcI = document.getElementById('ccTVC'), priceI = document.getElementById('ccPrice');
  const out = document.getElementById('ccOut');
  const chartContainer = document.getElementById('costCurveChart');
  if (!tfcI) return;

  function render(){
    const tfc = parseFloat(tfcI.value);
    const tvcArr = parseNums(tvcI.value);
    const price = parseFloat(priceI.value);
    const n = tvcArr.length;
    const rows = tvcArr.map((tvc,i) => {
      const q = i+1;
      const tc = tfc + tvc;
      const afc = tfc/q, avc = tvc/q, atc = tc/q;
      const prevTC = i===0 ? tfc : tfc + tvcArr[i-1];
      const mc = tc - prevTC;
      return {q, tfc, tvc, tc, afc, avc, atc, mc};
    });

    // find breakeven/shutdown zone relative to price
    let status = 'FAIL TO REJECT'; // placeholder, will overwrite below
    const minATC = Math.min(...rows.map(r=>r.atc));
    const minAVC = Math.min(...rows.map(r=>r.avc));
    let verdict, verdictClass;
    if (price >= minATC){ verdict = 'Price covers ATC — operating profitably (at best output level)'; verdictClass='inelastic'; }
    else if (price >= minAVC){ verdict = 'Price is between AVC and ATC — losing money, but rational to keep operating short-run'; verdictClass='unit'; }
    else { verdict = 'Price is below AVC — shutdown point breached, firm should stop producing'; verdictClass='elastic'; }

    let tableHtml = '<table class="exhibit" style="margin:0; min-width:560px; font-size:.82rem;"><tr><th>Q</th><th>TFC</th><th>TVC</th><th>TC</th><th>AFC</th><th>AVC</th><th>ATC</th><th>MC</th></tr>';
    rows.forEach(r => {
      tableHtml += `<tr><td>${r.q}</td><td class="num">${fmt(r.tfc,0)}</td><td class="num">${fmt(r.tvc,0)}</td><td class="num">${fmt(r.tc,0)}</td><td class="num">${fmt(r.afc,1)}</td><td class="num">${fmt(r.avc,1)}</td><td class="num">${fmt(r.atc,1)}</td><td class="num">${fmt(r.mc,1)}</td></tr>`;
    });
    tableHtml += '</table>';
    out.innerHTML = `
      <div class="elastic-zone-tag ${verdictClass}" style="display:block; margin-bottom:10px; padding:10px; text-align:center; font-size:.8rem;">${verdict}</div>
      <div style="overflow-x:auto;">${tableHtml}</div>
    `;

    // chart: AFC, AVC, ATC, MC
    if (!chartContainer) return;
    const W=480, H=240, padL=44, padR=16, padT=16, padB=30;
    const allVals = rows.flatMap(r => [r.afc, r.avc, r.atc, r.mc]);
    const maxV = Math.max(...allVals);
    const xScale = q => padL + ((q-1)/(n-1))*(W-padL-padR);
    const yScale = v => (H-padB) - (v/maxV)*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'econ-svg', style:'max-width:520px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#4A4763', 'stroke-width':1}));
    svg.appendChild(svgEl('line', {x1:padL, x2:padL, y1:padT, y2:H-padB, stroke:'#4A4763', 'stroke-width':1}));
    function drawLine(key, color){
      let d = '';
      rows.forEach((r,i) => {
        const x=xScale(r.q), y=yScale(r[key]);
        d += (i===0?'M':'L')+x+','+y+' ';
      });
      svg.appendChild(svgEl('path', {d, fill:'none', stroke:color, 'stroke-width':2}));
    }
    drawLine('afc', '#8B5CF6');
    drawLine('avc', '#2F8F6B');
    drawLine('atc', '#2B2560');
    drawLine('mc', '#C77F1E');
    rows.forEach(r => {
      const t = svgEl('text', {x:xScale(r.q), y:H-10, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':7, fill:'#4A4763'});
      t.textContent = r.q;
      svg.appendChild(t);
    });
    chartContainer.innerHTML = '';
    chartContainer.appendChild(svg);
    const legend = document.createElement('div');
    legend.style.display='flex'; legend.style.gap='12px'; legend.style.marginTop='6px'; legend.style.fontFamily='var(--font-mono)'; legend.style.fontSize='.68rem'; legend.style.flexWrap='wrap';
    legend.innerHTML = `
      <span><span style="display:inline-block;width:12px;height:2px;background:#8B5CF6;margin-right:4px;vertical-align:middle;"></span>AFC</span>
      <span><span style="display:inline-block;width:12px;height:2px;background:#2F8F6B;margin-right:4px;vertical-align:middle;"></span>AVC</span>
      <span><span style="display:inline-block;width:12px;height:2px;background:#2B2560;margin-right:4px;vertical-align:middle;"></span>ATC</span>
      <span><span style="display:inline-block;width:12px;height:2px;background:#C77F1E;margin-right:4px;vertical-align:middle;"></span>MC</span>
    `;
    chartContainer.appendChild(legend);
  }
  [tfcI,tvcI,priceI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   Check-in mini quizzes
   ============================================================ */
(function(){
  document.querySelectorAll('.checkin').forEach(box => {
    const btns = box.querySelectorAll('.opt-btn');
    const feedback = box.querySelector('.checkin-feedback');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btns.forEach(b => b.disabled = true);
        btns.forEach(b => { if (b.dataset.correct === 'true') b.classList.add('correct'); });
        if (btn.dataset.correct !== 'true') btn.classList.add('incorrect');
        feedback.classList.add('show');
        markSectionProgress(box.closest('section').id);
      });
    });
  });
})();

/* ============================================================
   Sidebar scroll-spy + progress + mobile toggle
   ============================================================ */
const sectionIds = ['sec-demandfunction','sec-elasticity','sec-determinants','sec-incomecross','sec-effects','sec-productivity','sec-marginalrevenue','sec-costcurves','sec-quiz'];
const visited = new Set();

function markSectionProgress(id){
  if (sectionIds.includes(id)){
    visited.add(id);
    updateProgress();
  }
}
function updateProgress(){
  const pct = Math.round((visited.size / sectionIds.length) * 100);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressPct');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
  sectionIds.forEach(id => {
    const link = document.querySelector(`.toc a[data-sec="${id}"]`);
    if (link && visited.has(id)) link.classList.add('done');
  });
  try { localStorage.setItem('cfa-progress-demand-supply', String(pct)); } catch(e) {}
}

(function(){
  const links = document.querySelectorAll('.toc a[data-sec]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.toc a[data-sec="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting){
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        markSectionProgress(id);
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle){
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.querySelectorAll('.toc a').forEach(a => a.addEventListener('click', () => sidebar.classList.remove('open')));
  }
})();

/* ============================================================
   QUIZ
   ============================================================ */
const QUIZ = [
  {
    concept: "The Demand Function & Curve",
    q: "In a demand function Qx = 100 − 4Px + 0.3I, what does the negative sign on Px reflect?",
    opts: ["Higher income reduces demand", "The law of demand — higher price lowers quantity demanded", "A pricing error in the model"],
    correct: 1,
    exp: "A negative coefficient on a good's own price is exactly the law of demand: as price rises, quantity demanded falls."
  },
  {
    concept: "The Demand Function & Curve",
    q: "The inverse demand function is best described as:",
    opts: ["Quantity written as a function of price", "Price written as a function of quantity", "Income written as a function of price"],
    correct: 1,
    exp: "The inverse demand function solves the demand equation for price in terms of quantity — it's what actually gets plotted as the demand curve, with price on the vertical axis."
  },
  {
    concept: "Price Elasticity of Demand",
    q: "A demand curve has quantity Q=40 at price P=2, with slope ΔQ/ΔP = −5. What is the price elasticity of demand at this point?",
    opts: ["−0.25", "−2.50", "−10.0"],
    correct: 0,
    exp: "E = slope × (P/Q) = −5 × (2/40) = −0.25."
  },
  {
    concept: "Price Elasticity of Demand",
    q: "If the own-price elasticity of demand for a good is −0.4, demand is:",
    opts: ["Elastic", "Inelastic", "Unit elastic"],
    correct: 1,
    exp: "|−0.4| < 1, so demand is inelastic — quantity is relatively insensitive to price."
  },
  {
    concept: "Price Elasticity of Demand",
    q: "If demand is elastic and price rises, what happens to total expenditure on the good?",
    opts: ["It rises", "It falls", "It stays exactly the same"],
    correct: 1,
    exp: "When demand is elastic, quantity falls proportionally more than price rises, so total expenditure (P×Q) falls."
  },
  {
    concept: "Price Elasticity of Demand",
    q: "A perfectly vertical demand curve is described as:",
    opts: ["Perfectly elastic", "Perfectly inelastic", "Unit elastic"],
    correct: 1,
    exp: "A vertical demand curve means quantity demanded never changes regardless of price — zero elasticity, or perfectly inelastic."
  },
  {
    concept: "What Drives Elasticity?",
    q: "Which characteristic tends to make a good's demand MORE elastic?",
    opts: ["Few or no close substitutes", "A small share of the household budget", "Many close substitutes available"],
    correct: 2,
    exp: "The more easily buyers can switch to a substitute, the more sensitive (elastic) their demand is to a price change."
  },
  {
    concept: "What Drives Elasticity?",
    q: "Long-run elasticity of demand is typically ______ short-run elasticity, for most non-durable goods.",
    opts: ["Greater than", "Less than", "Exactly equal to"],
    correct: 0,
    exp: "Given more time to adjust habits and substitute alternatives, demand for most goods becomes more elastic in the long run than the short run."
  },
  {
    concept: "Income & Cross-Price Elasticity",
    q: "A good has an income elasticity of demand equal to −0.3. This good is:",
    opts: ["A normal good", "An inferior good", "A perfect substitute"],
    correct: 1,
    exp: "Negative income elasticity means quantity demanded falls as income rises — the definition of an inferior good."
  },
  {
    concept: "Income & Cross-Price Elasticity",
    q: "The cross-price elasticity of demand between butter and margarine is calculated to be +0.7. This indicates the two goods are:",
    opts: ["Complements", "Substitutes", "Unrelated goods"],
    correct: 1,
    exp: "A positive cross-price elasticity means a price rise in one good increases demand for the other — the definition of substitutes."
  },
  {
    concept: "Substitution & Income Effects",
    q: "For a normal good, when its price falls, the substitution effect and income effect:",
    opts: ["Work in opposite directions, partially canceling out", "Both push toward buying more of the good", "Both push toward buying less of the good"],
    correct: 1,
    exp: "For a normal good, both effects reinforce each other — the good is relatively cheaper (substitution) and higher real income also raises demand for it (income effect)."
  },
  {
    concept: "Substitution & Income Effects",
    q: "\"Inferior good\" is a label that describes:",
    opts: ["A poor-quality or defective product", "A good people buy less of as their income rises", "A good with no substitutes"],
    correct: 1,
    exp: "Inferior is a technical economic term about the direction of income elasticity, not a statement about product quality."
  },
  {
    concept: "Marginal Returns & Productivity",
    q: "A firm's total product rises from 300 to 360 units when labor increases from 3 to 4 hours. What is the marginal product of the 4th labor hour?",
    opts: ["360 units", "60 units", "90 units"],
    correct: 1,
    exp: "MP = ΔTP/ΔL = (360−300)/(4−3) = 60 units."
  },
  {
    concept: "Marginal Returns & Productivity",
    q: "Once marginal product of labor turns negative, what does this indicate?",
    opts: ["The firm should hire more workers immediately", "Adding another worker actually reduces total output", "Average product must also be negative"],
    correct: 1,
    exp: "Negative marginal product means the additional worker is actively decreasing total production — a clear signal to stop adding labor."
  },
  {
    concept: "Marginal Revenue & Profit Max",
    q: "A firm in perfect competition sells at the market price of $12 per unit with no ability to influence that price. What is this firm's marginal revenue?",
    opts: ["Less than $12", "Exactly $12", "Greater than $12"],
    correct: 1,
    exp: "Under perfect competition, a price-taking firm's marginal revenue always equals the market price: MR = P."
  },
  {
    concept: "Marginal Revenue & Profit Max",
    q: "A firm operating under imperfect competition must lower its price on all units sold to sell one more unit. Its marginal revenue is:",
    opts: ["Equal to price", "Less than price", "Greater than price"],
    correct: 1,
    exp: "MR = P + Q(ΔP/ΔQ); since the demand curve is downward sloping, this makes MR strictly less than price."
  },
  {
    concept: "Marginal Revenue & Profit Max",
    q: "A firm should increase output whenever:",
    opts: ["MR is less than MC", "MR is greater than MC", "MR equals average total cost"],
    correct: 1,
    exp: "As long as marginal revenue exceeds marginal cost, producing one more unit adds more to revenue than to cost — increasing profit."
  },
  {
    concept: "Cost Curves & Breakeven",
    q: "At Q=6, TFC=100 and TVC=450. What is average total cost (ATC) at this output level?",
    opts: ["$91.7", "$75.0", "$16.7"],
    correct: 0,
    exp: "TC = 100+450 = 550. ATC = TC/Q = 550/6 ≈ $91.7."
  },
  {
    concept: "Cost Curves & Breakeven",
    q: "The breakeven point for a firm occurs where:",
    opts: ["Price equals average variable cost (AVC)", "Price equals average total cost (ATC)", "Marginal cost equals average fixed cost (AFC)"],
    correct: 1,
    exp: "Breakeven is where total revenue equals total cost — equivalently, where price equals average total cost."
  },
  {
    concept: "Cost Curves & Breakeven",
    q: "Market price has fallen below a firm's average variable cost. What is the economically rational response?",
    opts: ["Continue operating, since fixed costs must be paid regardless", "Shut down production, since losses are smaller than continuing to operate", "Raise the price to cover costs"],
    correct: 1,
    exp: "Below AVC, every additional unit produced adds to the loss even before considering fixed costs — shutting down limits the loss to fixed costs alone, which is smaller."
  }
];

(function(){
  const shell = document.getElementById('quizShell');
  if (!shell) return;
  let current = 0;
  let score = 0;
  const answered = new Array(QUIZ.length).fill(null);

  function renderQuestion(){
    const item = QUIZ[current];
    let html = `<div class="quiz-progress">Question ${current+1} of ${QUIZ.length} &nbsp;·&nbsp; Score so far: ${score}</div>`;
    html += `<div class="quiz-q">${item.q}</div>`;
    html += `<div class="opt-list" id="quizOpts">`;
    item.opts.forEach((opt, i) => {
      html += `<button class="opt-btn" data-i="${i}">${opt}</button>`;
    });
    html += `</div>`;
    html += `<div class="quiz-explain" id="quizExplain">${item.exp}</div>`;
    html += `<div class="quiz-nav">
      <button class="btn ghost" id="quizPrev" ${current===0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn" id="quizNext" disabled>${current === QUIZ.length-1 ? 'See score' : 'Next →'}</button>
    </div>`;
    shell.innerHTML = html;

    const opts = shell.querySelectorAll('.opt-btn');
    const explain = document.getElementById('quizExplain');
    const nextBtn = document.getElementById('quizNext');
    const prevBtn = document.getElementById('quizPrev');

    if (answered[current] !== null){
      opts.forEach(btn => {
        btn.disabled = true;
        const i = +btn.dataset.i;
        if (i === item.correct) btn.classList.add('correct');
        else if (i === answered[current]) btn.classList.add('incorrect');
      });
      explain.classList.add('show');
      nextBtn.disabled = false;
    }

    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered[current] !== null) return;
        const i = +btn.dataset.i;
        answered[current] = i;
        if (i === item.correct) score++;
        if (typeof cfaRecordAnswer === "function" && item.concept){
          cfaRecordAnswer(item.concept, "Demand & Supply Analysis", i === item.correct);
        }
        opts.forEach(b => {
          b.disabled = true;
          const bi = +b.dataset.i;
          if (bi === item.correct) b.classList.add('correct');
          else if (bi === i) b.classList.add('incorrect');
        });
        explain.classList.add('show');
        nextBtn.disabled = false;
        markSectionProgress('sec-quiz');
      });
    });

    nextBtn.addEventListener('click', () => {
      if (current < QUIZ.length - 1){ current++; renderQuestion(); }
      else { renderScore(); }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){ current--; renderQuestion(); }
    });
  }

  function renderScore(){
    const pct = Math.round((score / QUIZ.length) * 100);
    let msg = "Solid foundation — review the sections you missed and try again.";
    if (pct >= 90) msg = "Excellent — you've genuinely internalized this reading.";
    else if (pct >= 70) msg = "Good work — a couple of gaps worth revisiting.";
    shell.innerHTML = `
      <div class="quiz-score">
        <div style="font-family:var(--font-mono); font-size:.8rem; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.08em;">Final score</div>
        <div class="big">${score} / ${QUIZ.length}</div>
        <p style="max-width:46ch; margin:10px auto 22px; color:var(--ink-soft);">${msg}</p>
        <button class="btn" id="quizRestart">Retake the quiz</button>
      </div>`;
    document.getElementById('quizRestart').addEventListener('click', () => {
      current = 0; score = 0;
      answered.fill(null);
      renderQuestion();
    });
  }

  renderQuestion();
})();

  } catch(e) { console.warn('[demand-supply] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: econ-foundations
   ============================================================ */
(function(){
  try {
// ============================================================
// Economics Foundations — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   01 — Opportunity cost calculator
   ============================================================ */
(function(){
  const aI = document.getElementById('ocA'), bI = document.getElementById('ocB');
  const result = document.getElementById('ocResult');
  if (!aI) return;
  function render(){
    const a = parseFloat(aI.value), b = parseFloat(bI.value);
    result.textContent = `Opportunity cost of choosing A = ${fmt(b,2)}`;
  }
  [aI,bI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   03 — Production Possibilities Frontier (PPF) chart
   ============================================================ */
(function(){
  const container = document.getElementById('ppfChart');
  const tabs = document.getElementById('ppfTabs');
  const caption = document.getElementById('ppfCaption');
  if (!container) return;

  const W=460, H=280, padL=50, padR=20, padT=20, padB=40;
  const xScale = q => padL + (q/100)*(W-padL-padR);
  const yScale = q => (H-padB) - (q/100)*(H-padT-padB);

  // bowed-out PPF: using a quarter-ellipse-like curve from (0,90) to (90,0)
  function ppfY(x, maxX=90, maxY=90){
    // ellipse formula: (x/maxX)^2 + (y/maxY)^2 = 1
    const ratio = x/maxX;
    if (ratio > 1) return 0;
    return maxY * Math.sqrt(1 - ratio*ratio);
  }

  const captions = {
    onCurve: "This point sits exactly on the frontier — production is efficient. Every resource is fully and effectively employed; producing more of one good requires giving up some of the other.",
    inside: "This point sits inside the frontier — production is inefficient. Resources are unemployed or misallocated. More of both goods could be produced without shifting the curve at all.",
    outside: "This point sits outside the frontier — currently unattainable with existing resources and technology, no matter how efficiently they're used.",
    growth: "Economic growth — more resources or better technology — shifts the entire frontier outward. Points that were unattainable a moment ago are now reachable."
  };

  function render(mode){
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'econ-svg', style:'max-width:480px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));
    svg.appendChild(svgEl('line', {x1:padL, x2:padL, y1:padT, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));

    // growth mode: draw original + shifted curve
    if (mode === 'growth'){
      let d0 = '';
      for (let x=0; x<=90; x+=2){ const y = ppfY(x); d0 += (x===0?'M':'L')+xScale(x)+','+yScale(y)+' '; }
      svg.appendChild(svgEl('path', {d:d0, fill:'none', stroke:'#9c94c9', 'stroke-width':2, 'stroke-dasharray':'5,4'}));
      let d1 = '';
      for (let x=0; x<=115; x+=2){ const y = ppfY(x, 115, 115); d1 += (x===0?'M':'L')+xScale(x)+','+yScale(y)+' '; }
      svg.appendChild(svgEl('path', {d:d1, fill:'none', stroke:'#2F8F6B', 'stroke-width':2.5}));
      const lbl1 = svgEl('text', {x:xScale(20), y:yScale(ppfY(20))-8, 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#9c94c9', 'font-weight':'700'});
      lbl1.textContent = 'Before';
      svg.appendChild(lbl1);
      const lbl2 = svgEl('text', {x:xScale(50), y:yScale(ppfY(50,115,115))-8, 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#2F8F6B', 'font-weight':'700'});
      lbl2.textContent = 'After growth';
      svg.appendChild(lbl2);
    } else {
      let d = '';
      for (let x=0; x<=90; x+=2){ const y = ppfY(x); d += (x===0?'M':'L')+xScale(x)+','+yScale(y)+' '; }
      svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2B2560', 'stroke-width':2.5}));

      let px, py, color, label;
      if (mode === 'onCurve'){ px=45; py=ppfY(45); color='#2F8F6B'; label='Efficient'; }
      else if (mode === 'inside'){ px=35; py=35; color='#C77F1E'; label='Inefficient'; }
      else { px=75; py=55; color='#D6573F'; label='Unattainable'; }

      svg.appendChild(svgEl('circle', {cx:xScale(px), cy:yScale(py), r:6, fill:color, stroke:'#fff', 'stroke-width':1.5}));
      const lbl = svgEl('text', {x:xScale(px)+10, y:yScale(py)-8, 'font-family':'IBM Plex Mono', 'font-size':10, fill:color, 'font-weight':'700'});
      lbl.textContent = label;
      svg.appendChild(lbl);
    }

    const xlabel = svgEl('text', {x:W/2, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    xlabel.textContent = 'Tractors →';
    svg.appendChild(xlabel);
    const ylabel = svgEl('text', {x:14, y:padT+8, 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    ylabel.textContent = 'Wheat ↑';
    svg.appendChild(ylabel);

    container.innerHTML = '';
    container.appendChild(svg);
    caption.textContent = captions[mode];
  }

  tabs.querySelectorAll('.test-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.test-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.mode);
    });
  });
  render('onCurve');
})();

/* ============================================================
   06 — Movements vs shifts demand curve chart
   ============================================================ */
(function(){
  const container = document.getElementById('shiftChart');
  const tabs = document.getElementById('shiftTabs');
  const caption = document.getElementById('shiftCaption');
  if (!container) return;

  const W=460, H=260, padL=50, padR=20, padT=20, padB=36;
  const xScale = q => padL + (q/100)*(W-padL-padR);
  const yScale = p => (H-padB) - (p/100)*(H-padT-padB);

  const captions = {
    movement: "A change in PRICE — the variable on this curve's own vertical axis — causes a movement along the same, unchanged demand curve. Points A and B sit on the identical line.",
    shiftright: "A rise in INCOME isn't on either axis, so it shifts the entire curve to the right — at every price, buyers now demand more than before.",
    shiftleft: "Weaker consumer preferences for the good aren't on either axis either — they shift the entire curve to the left, reducing quantity demanded at every price."
  };

  function render(mode){
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'econ-svg', style:'max-width:480px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));
    svg.appendChild(svgEl('line', {x1:padL, x2:padL, y1:padT, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));

    function demandLine(offset){
      let d = '';
      const pts = [[10+offset,85],[90+offset,10]];
      d = `M${xScale(pts[0][0])},${yScale(pts[0][1])} L${xScale(pts[1][0])},${yScale(pts[1][1])}`;
      return d;
    }

    if (mode === 'movement'){
      svg.appendChild(svgEl('path', {d:demandLine(0), fill:'none', stroke:'#2B2560', 'stroke-width':2.5}));
      const A = {q:30, p:65}, B = {q:60, p:35};
      [[A,'A','#2F8F6B'],[B,'B','#D6573F']].forEach(([pt,label,color]) => {
        svg.appendChild(svgEl('circle', {cx:xScale(pt.q), cy:yScale(pt.p), r:5, fill:color, stroke:'#fff', 'stroke-width':1.5}));
        const t = svgEl('text', {x:xScale(pt.q)+8, y:yScale(pt.p)-6, 'font-family':'IBM Plex Mono', 'font-size':10, fill:color, 'font-weight':'700'});
        t.textContent = label;
        svg.appendChild(t);
      });
      svg.appendChild(svgEl('line', {x1:xScale(A.q), y1:yScale(A.p), x2:xScale(B.q), y2:yScale(B.p), stroke:'#C77F1E', 'stroke-width':1, 'stroke-dasharray':'3,2'}));
    } else {
      svg.appendChild(svgEl('path', {d:demandLine(0), fill:'none', stroke:'#9c94c9', 'stroke-width':2, 'stroke-dasharray':'5,4'}));
      const offset = mode === 'shiftright' ? 20 : -20;
      const color = mode === 'shiftright' ? '#2F8F6B' : '#D6573F';
      svg.appendChild(svgEl('path', {d:demandLine(offset), fill:'none', stroke:color, 'stroke-width':2.5}));
      const arrowY = 50;
      const arrowX1 = xScale(50), arrowX2 = xScale(50+offset*0.6);
      svg.appendChild(svgEl('line', {x1:arrowX1, y1:yScale(arrowY), x2:arrowX2, y2:yScale(arrowY), stroke:color, 'stroke-width':1.5}));
      const t = svgEl('text', {x:(arrowX1+arrowX2)/2, y:yScale(arrowY)-6, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:color, 'font-weight':'700'});
      t.textContent = mode === 'shiftright' ? 'Shift →' : '← Shift';
      svg.appendChild(t);
    }

    const xlabel = svgEl('text', {x:W/2, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    xlabel.textContent = 'Quantity →';
    svg.appendChild(xlabel);
    const ylabel = svgEl('text', {x:14, y:padT+8, 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    ylabel.textContent = 'Price ↑';
    svg.appendChild(ylabel);

    container.innerHTML = '';
    container.appendChild(svg);
    caption.textContent = captions[mode];
  }

  tabs.querySelectorAll('.test-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.test-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.mode);
    });
  });
  render('movement');
})();

/* ============================================================
   07 — Circular flow diagram (4-sector, static)
   ============================================================ */
(function(){
  const container = document.getElementById('circularFlowChart');
  if (!container) return;
  const W=520, H=320;
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:560px;'});

  function box(x,y,w,h,label,color){
    svg.appendChild(svgEl('rect', {x,y,width:w,height:h,rx:8,fill:color}));
    const t = svgEl('text', {x:x+w/2, y:y+h/2+4, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':11, fill:'#fff', 'font-weight':'700'});
    t.textContent = label;
    svg.appendChild(t);
  }
  box(30, 130, 110, 55, 'Households', '#2B2560');
  box(380, 130, 110, 55, 'Firms', '#C77F1E');
  box(190, 20, 130, 45, 'Government', '#2F8F6B');
  box(190, 255, 130, 45, 'Foreign Sector', '#8B5CF6');

  function arrow(x1,y1,x2,y2,color,label,labelX,labelY){
    svg.appendChild(svgEl('line', {x1,y1,x2,y2,stroke:color,'stroke-width':1.8,'marker-end':'url(#arrowhead)'}));
    if (label){
      const t = svgEl('text', {x:labelX, y:labelY, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':8, fill:color, 'font-weight':'600'});
      t.textContent = label;
      svg.appendChild(t);
    }
  }
  const defs = svgEl('defs', {});
  const marker = svgEl('marker', {id:'arrowhead', markerWidth:7, markerHeight:7, refX:5, refY:2.5, orient:'auto'});
  marker.appendChild(svgEl('path', {d:'M0,0 L5,2.5 L0,5 Z', fill:'#4A4763'}));
  defs.appendChild(marker);
  svg.insertBefore(defs, svg.firstChild);

  // households <-> firms (top: labor/capital to firms; bottom: goods to households)
  arrow(140, 145, 380, 145, '#4A4763', 'Labor & capital', 260, 138);
  arrow(380, 168, 140, 168, '#4A4763', 'Wages, profit', 260, 183);
  // households/firms <-> government (taxes up, spending down)
  arrow(95, 130, 220, 65, '#2F8F6B', 'Taxes', 140, 90);
  arrow(320, 65, 435, 130, '#2F8F6B', 'Spending', 400, 90);
  // firms <-> foreign sector (exports/imports)
  arrow(435, 185, 320, 255, '#8B5CF6', 'Exports', 400, 230);
  arrow(220, 255, 95, 185, '#8B5CF6', 'Imports', 140, 230);

  container.appendChild(svg);
})();

/* ============================================================
   Check-in mini quizzes
   ============================================================ */
(function(){
  document.querySelectorAll('.checkin').forEach(box => {
    const btns = box.querySelectorAll('.opt-btn');
    const feedback = box.querySelector('.checkin-feedback');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btns.forEach(b => b.disabled = true);
        btns.forEach(b => { if (b.dataset.correct === 'true') b.classList.add('correct'); });
        if (btn.dataset.correct !== 'true') btn.classList.add('incorrect');
        feedback.classList.add('show');
        markSectionProgress(box.closest('section').id);
      });
    });
  });
})();

/* ============================================================
   Sidebar scroll-spy + progress + mobile toggle
   ============================================================ */
const sectionIds = ['sec-scarcity','sec-factors','sec-ppf','sec-micromacro','sec-positivenormative','sec-graphs','sec-circularflow','sec-quiz'];
const visited = new Set();

function markSectionProgress(id){
  if (sectionIds.includes(id)){
    visited.add(id);
    updateProgress();
  }
}
function updateProgress(){
  const pct = Math.round((visited.size / sectionIds.length) * 100);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressPct');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
  sectionIds.forEach(id => {
    const link = document.querySelector(`.toc a[data-sec="${id}"]`);
    if (link && visited.has(id)) link.classList.add('done');
  });
  try { localStorage.setItem('cfa-progress-econ-foundations', String(pct)); } catch(e) {}
}

(function(){
  const links = document.querySelectorAll('.toc a[data-sec]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.toc a[data-sec="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting){
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        markSectionProgress(id);
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle){
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.querySelectorAll('.toc a').forEach(a => a.addEventListener('click', () => sidebar.classList.remove('open')));
  }
})();

/* ============================================================
   QUIZ
   ============================================================ */
const QUIZ = [
  {
    concept: "Scarcity & Opportunity Cost",
    q: "Economics is best defined as the study of:",
    opts: ["How to maximize government revenue", "How individuals, firms, and societies allocate scarce resources among competing wants", "How stock markets set prices"],
    correct: 1,
    exp: "The core definition of economics centers on the allocation of scarce resources among unlimited, competing wants."
  },
  {
    concept: "Scarcity & Opportunity Cost",
    q: "Scarcity means:",
    opts: ["A resource is rare in the everyday sense, like a precious gemstone", "Resources are limited relative to the unlimited uses people would like to put them to", "A good has no value at all"],
    correct: 1,
    exp: "Scarcity is a relative concept — resources being limited compared to the demands placed on them — not simply 'being rare.'"
  },
  {
    concept: "Scarcity & Opportunity Cost",
    q: "A student chooses to attend a 3-hour lecture instead of working a 3-hour paid shift at $20/hour. What is the opportunity cost of attending the lecture?",
    opts: ["$0, since no cash was spent", "$60, the forgone wages from the shift", "The cost of tuition"],
    correct: 1,
    exp: "Opportunity cost is the value of the next-best alternative given up — here, the $60 in wages the student could have earned instead."
  },
  {
    concept: "Factors of Production & Economic Systems",
    q: "Which of the following is an example of capital, in the economic sense?",
    opts: ["A $10,000 bank account", "A factory's manufacturing equipment", "A worker's salary"],
    correct: 1,
    exp: "Capital refers to tools, machinery, and equipment used to produce other goods — not money itself, which is just a claim used to acquire capital."
  },
  {
    concept: "Factors of Production & Economic Systems",
    q: "In a command economy, production and resource allocation decisions are primarily made by:",
    opts: ["Prices set by supply and demand", "A central planning authority", "Individual consumers acting independently"],
    correct: 1,
    exp: "A command economy relies on centralized planning and decree rather than market price signals to allocate resources."
  },
  {
    concept: "Factors of Production & Economic Systems",
    q: "Most real-world economies today are best described as:",
    opts: ["Pure market economies with zero government involvement", "Pure command economies with total central planning", "Mixed economies, blending market allocation with government intervention"],
    correct: 2,
    exp: "Nearly every real economy combines market-based allocation with some degree of government intervention — a mixed economy."
  },
  {
    concept: "The Production Possibilities Frontier",
    q: "A point that lies exactly on a production possibilities frontier (PPF) represents:",
    opts: ["Inefficient production, with unemployed resources", "Efficient production, with resources fully and effectively employed", "A point that is currently unattainable"],
    correct: 1,
    exp: "Points on the PPF itself represent efficient production — the maximum output achievable given current resources and technology."
  },
  {
    concept: "The Production Possibilities Frontier",
    q: "A point lying inside a country's PPF indicates that:",
    opts: ["More of both goods could be produced without any new resources, simply by using existing resources better", "The economy has achieved maximum efficiency", "The point is impossible under any circumstances"],
    correct: 0,
    exp: "A point inside the frontier means resources are unemployed or misallocated — more of both goods is achievable without any new resources at all."
  },
  {
    concept: "The Production Possibilities Frontier",
    q: "What causes a production possibilities frontier to shift outward over time?",
    opts: ["A decrease in consumer spending", "Economic growth — more resources or improved technology", "A rise in the price level"],
    correct: 1,
    exp: "Only genuine economic growth — more capital, more labor, or better technology — can shift the entire PPF outward, making previously unattainable points reachable."
  },
  {
    concept: "Microeconomics vs. Macroeconomics",
    q: "\"Why did the price of a specific company's stock rise 5% today?\" is best classified as a question of:",
    opts: ["Macroeconomics", "Microeconomics", "Neither branch of economics"],
    correct: 1,
    exp: "A question about an individual security or market is microeconomics — the study of individual decision-makers and specific markets."
  },
  {
    concept: "Microeconomics vs. Macroeconomics",
    q: "\"What determines a country's overall inflation rate?\" is best classified as a question of:",
    opts: ["Microeconomics", "Macroeconomics", "Neither branch of economics"],
    correct: 1,
    exp: "Inflation is an economy-wide, aggregate phenomenon, making this a macroeconomic question."
  },
  {
    concept: "Microeconomics vs. Macroeconomics",
    q: "Which CFA prerequisite Economics modules studied so far are examples of microeconomics?",
    opts: ["Modules E1 and E2 (demand/supply and firm/market structures)", "Modules E3 through E7 (GDP through currency)", "All seven modules equally"],
    correct: 0,
    exp: "E1 (demand and supply) and E2 (market structures) study individual markets and firms — microeconomics. E3 onward studies the whole economy — macroeconomics."
  },
  {
    concept: "Positive vs. Normative Economics",
    q: "\"Raising interest rates tends to reduce business investment spending\" is an example of:",
    opts: ["A normative statement", "A positive statement", "Neither positive nor normative"],
    correct: 1,
    exp: "This is a testable, factual claim about cause and effect — the definition of a positive economic statement."
  },
  {
    concept: "Positive vs. Normative Economics",
    q: "\"The central bank should prioritize full employment over low inflation\" is an example of:",
    opts: ["A positive statement", "A normative statement", "An accounting identity"],
    correct: 1,
    exp: "This expresses a value judgment about what policy ought to prioritize — a normative statement, not a testable fact."
  },
  {
    concept: "Positive vs. Normative Economics",
    q: "Which quick test helps distinguish a normative statement from a positive one?",
    opts: ["Positive statements always involve large numbers", "Normative statements typically contain or imply the word 'should'", "Positive statements are always about macroeconomics"],
    correct: 1,
    exp: "Statements containing or implying 'should' are almost always normative — expressing what ought to happen rather than a testable factual claim."
  },
  {
    concept: "Reading a Graph — Movements vs. Shifts",
    q: "On a standard price-quantity demand curve, a change in the good's own price causes:",
    opts: ["A shift of the entire curve", "A movement along the existing curve", "No change at all"],
    correct: 1,
    exp: "Since price is one of the two axes on a demand curve, a change in price causes movement along the curve, not a shift."
  },
  {
    concept: "Reading a Graph — Movements vs. Shifts",
    q: "On a standard price-quantity demand curve, a change in consumer income causes:",
    opts: ["A movement along the existing curve", "A shift of the entire curve", "The axes to be relabeled"],
    correct: 1,
    exp: "Income isn't one of the curve's own two axes, so a change in income shifts the entire demand curve rather than moving along it."
  },
  {
    concept: "The Circular Flow of Income",
    q: "In the circular flow model, which sector collects taxes and injects spending back into the economy?",
    opts: ["Households", "Firms", "The government"],
    correct: 2,
    exp: "The government sector collects taxes from households and firms and injects spending back into the economy."
  },
  {
    concept: "The Circular Flow of Income",
    q: "In the circular flow model, the foreign sector's role includes:",
    opts: ["Setting domestic interest rates", "Absorbing a country's exports and supplying its imports", "Collecting income taxes"],
    correct: 1,
    exp: "The foreign sector (rest of the world) buys a country's exports and sells it imports, completing the circular flow's international leg."
  },
  {
    concept: "The Circular Flow of Income",
    q: "The national income identity GDP = C + I + G + (X−M) relates to the circular flow model because:",
    opts: ["It has nothing to do with the circular flow", "Each term in the formula corresponds to one of the flows between sectors in the circular flow diagram", "It only applies to command economies"],
    correct: 1,
    exp: "GDP = C+I+G+(X−M) is essentially the circular flow model written as an equation — C is the household-to-firm consumption flow, G is government spending, and (X−M) is the net foreign-sector flow."
  }
];

(function(){
  const shell = document.getElementById('quizShell');
  if (!shell) return;
  let current = 0;
  let score = 0;
  const answered = new Array(QUIZ.length).fill(null);

  function renderQuestion(){
    const item = QUIZ[current];
    let html = `<div class="quiz-progress">Question ${current+1} of ${QUIZ.length} &nbsp;·&nbsp; Score so far: ${score}</div>`;
    html += `<div class="quiz-q">${item.q}</div>`;
    html += `<div class="opt-list" id="quizOpts">`;
    item.opts.forEach((opt, i) => {
      html += `<button class="opt-btn" data-i="${i}">${opt}</button>`;
    });
    html += `</div>`;
    html += `<div class="quiz-explain" id="quizExplain">${item.exp}</div>`;
    html += `<div class="quiz-nav">
      <button class="btn ghost" id="quizPrev" ${current===0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn" id="quizNext" disabled>${current === QUIZ.length-1 ? 'See score' : 'Next →'}</button>
    </div>`;
    shell.innerHTML = html;

    const opts = shell.querySelectorAll('.opt-btn');
    const explain = document.getElementById('quizExplain');
    const nextBtn = document.getElementById('quizNext');
    const prevBtn = document.getElementById('quizPrev');

    if (answered[current] !== null){
      opts.forEach(btn => {
        btn.disabled = true;
        const i = +btn.dataset.i;
        if (i === item.correct) btn.classList.add('correct');
        else if (i === answered[current]) btn.classList.add('incorrect');
      });
      explain.classList.add('show');
      nextBtn.disabled = false;
    }

    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered[current] !== null) return;
        const i = +btn.dataset.i;
        answered[current] = i;
        if (i === item.correct) score++;
        if (typeof cfaRecordAnswer === "function" && item.concept){
          cfaRecordAnswer(item.concept, "Economics Foundations", i === item.correct);
        }
        opts.forEach(b => {
          b.disabled = true;
          const bi = +b.dataset.i;
          if (bi === item.correct) b.classList.add('correct');
          else if (bi === i) b.classList.add('incorrect');
        });
        explain.classList.add('show');
        nextBtn.disabled = false;
        markSectionProgress('sec-quiz');
      });
    });

    nextBtn.addEventListener('click', () => {
      if (current < QUIZ.length - 1){ current++; renderQuestion(); }
      else { renderScore(); }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){ current--; renderQuestion(); }
    });
  }

  function renderScore(){
    const pct = Math.round((score / QUIZ.length) * 100);
    let msg = "Solid foundation — review the sections you missed and try again.";
    if (pct >= 90) msg = "Excellent — you've genuinely internalized this reading.";
    else if (pct >= 70) msg = "Good work — a couple of gaps worth revisiting.";
    shell.innerHTML = `
      <div class="quiz-score">
        <div style="font-family:var(--font-mono); font-size:.8rem; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.08em;">Final score</div>
        <div class="big">${score} / ${QUIZ.length}</div>
        <p style="max-width:46ch; margin:10px auto 22px; color:var(--ink-soft);">${msg}</p>
        <button class="btn" id="quizRestart">Retake the quiz</button>
      </div>`;
    document.getElementById('quizRestart').addEventListener('click', () => {
      current = 0; score = 0;
      answered.fill(null);
      renderQuestion();
    });
  }

  renderQuestion();
})();

  } catch(e) { console.warn('[econ-foundations] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: final-review
   ============================================================ */
(function(){
  try {
// ============================================================
// Final Review — 132 questions across all 9 Economics modules
// 2 questions per real concept/section, for reliable per-concept diagnosis
// ============================================================

const QUIZ = [
  // ========== MODULE 00: Economics Foundations (7 concepts x 2 = 14) ==========
  { cat:"Economics Foundations", concept:"Scarcity & Opportunity Cost",
    q:"A retiree spends a free afternoon gardening instead of taking a paid consulting call worth $150. What is the opportunity cost of gardening?",
    opts:["$0, since no cash was spent","$150, the forgone consulting fee","The cost of gardening tools"], correct:1,
    exp:"Opportunity cost is the value of the next-best alternative given up — here, the $150 consulting fee." },
  { cat:"Economics Foundations", concept:"Scarcity & Opportunity Cost",
    q:"Scarcity exists even for extremely wealthy individuals because:",
    opts:["They still have unlimited wants relative to limited time and resources","Wealthy people are exempt from economic constraints","Scarcity only applies to money, not time"], correct:0,
    exp:"Scarcity is about resources being limited relative to unlimited wants — money doesn't buy unlimited time or attention." },

  { cat:"Economics Foundations", concept:"Factors of Production & Economic Systems",
    q:"A commercial bakery's ovens and mixing equipment are examples of which factor of production?",
    opts:["Land","Capital","Entrepreneurship"], correct:1,
    exp:"Capital refers to tools and equipment used to produce other goods, distinct from money itself." },
  { cat:"Economics Foundations", concept:"Factors of Production & Economic Systems",
    q:"An economy where prices, set by supply and demand, drive most production decisions, with government playing a limited but real role, is best described as:",
    opts:["A pure command economy","A mixed economy","A pure market economy with zero intervention"], correct:1,
    exp:"Nearly every real economy blends market pricing with some government role — a mixed economy." },

  { cat:"Economics Foundations", concept:"The Production Possibilities Frontier",
    q:"An economy is producing at a point exactly on its PPF. To produce more of Good A, it must:",
    opts:["Give up some production of Good B", "Increase both goods simultaneously with no trade-off", "This is impossible on the frontier itself"], correct:0,
    exp:"On the frontier, resources are fully employed, so producing more of one good requires giving up some of the other." },
  { cat:"Economics Foundations", concept:"The Production Possibilities Frontier",
    q:"A country discovers a large new oil field and adopts more efficient extraction technology. What happens to its PPF?",
    opts:["It shifts inward","It shifts outward","It stays exactly the same"], correct:1,
    exp:"More resources and better technology constitute economic growth, which shifts the entire PPF outward." },

  { cat:"Economics Foundations", concept:"Microeconomics vs. Macroeconomics",
    q:"\"Why did a national unemployment rate fall to a five-year low?\" is a question of:",
    opts:["Microeconomics","Macroeconomics"], correct:1,
    exp:"A question about an economy-wide aggregate like the national unemployment rate is macroeconomics." },
  { cat:"Economics Foundations", concept:"Microeconomics vs. Macroeconomics",
    q:"\"Why did a single coffee shop raise its prices this month?\" is a question of:",
    opts:["Microeconomics","Macroeconomics"], correct:0,
    exp:"A question about one specific firm's pricing decision is microeconomics." },

  { cat:"Economics Foundations", concept:"Positive vs. Normative Economics",
    q:"\"A $1 increase in the minimum wage is correlated with a 2% decline in teen employment in this sector\" is:",
    opts:["A positive statement","A normative statement"], correct:0,
    exp:"This is a testable, factual claim about cause and effect — a positive statement." },
  { cat:"Economics Foundations", concept:"Positive vs. Normative Economics",
    q:"\"Income inequality is unfair and government should act to reduce it\" is:",
    opts:["A positive statement","A normative statement"], correct:1,
    exp:"This expresses a value judgment about fairness and what policy should do — a normative statement." },

  { cat:"Economics Foundations", concept:"Reading a Graph — Movements vs. Shifts",
    q:"On a standard supply curve (price vs. quantity supplied), a change in the good's own price causes:",
    opts:["A movement along the curve","A shift of the entire curve"], correct:0,
    exp:"Price is one of the supply curve's own two axes, so a price change causes movement along the existing curve." },
  { cat:"Economics Foundations", concept:"Reading a Graph — Movements vs. Shifts",
    q:"A new, cheaper production technology becomes available to all firms in an industry. This causes:",
    opts:["A movement along the existing supply curve","A rightward shift of the entire supply curve"], correct:1,
    exp:"Technology isn't on either axis of a supply curve, so it shifts the whole curve — here, rightward, since firms can now supply more at every price." },

  { cat:"Economics Foundations", concept:"The Circular Flow of Income",
    q:"In the circular flow model, which flow moves from firms to households?",
    opts:["Wages, rent, interest, and profit","Consumption spending","Tax payments"], correct:0,
    exp:"Firms pay households for the labor and capital households supply, in the form of wages, rent, interest, and profit." },
  { cat:"Economics Foundations", concept:"The Circular Flow of Income",
    q:"The national income identity GDP = C + I + G + (X−M) relates to the circular flow model because:",
    opts:["It's unrelated to the circular flow", "Each term corresponds to a flow between sectors in the diagram", "It only applies under a command economy"], correct:1,
    exp:"C is the household-to-firm flow, G is government's injection, and (X−M) is the net foreign-sector flow — the equation is the diagram, in algebra." },

  // ========== MODULE E1: Demand and Supply Analysis (8 concepts x 2 = 16) ==========
  { cat:"Demand & Supply Analysis", concept:"The Demand Function & Curve",
    q:"A demand function is Qx = 60 − 3Px + 0.4I. Holding income fixed, what does the coefficient on Px reflect?",
    opts:["The law of demand — quantity falls as price rises","Income elasticity","A pricing error"], correct:0,
    exp:"A negative coefficient on a good's own price is exactly the law of demand." },
  { cat:"Demand & Supply Analysis", concept:"The Demand Function & Curve",
    q:"The inverse demand function is best described as:",
    opts:["Quantity written as a function of price", "Price written as a function of quantity", "Income written as a function of price"], correct:1,
    exp:"The inverse demand function solves for price in terms of quantity — what's actually plotted as the demand curve." },

  { cat:"Demand & Supply Analysis", concept:"Price Elasticity of Demand",
    q:"A demand curve has slope ΔQ/ΔP = −5, with P=4 and Q=50 at the point of interest. What is the price elasticity?",
    opts:["−0.40", "−1.25", "−20.0"], correct:0,
    exp:"E = slope × (P/Q) = −5 × (4/50) = −0.40." },
  { cat:"Demand & Supply Analysis", concept:"Price Elasticity of Demand",
    q:"If demand is elastic and price rises, total expenditure will:",
    opts:["Rise","Fall","Stay exactly the same"], correct:1,
    exp:"With elastic demand, quantity falls proportionally more than price rises, so total expenditure falls." },

  { cat:"Demand & Supply Analysis", concept:"What Drives Elasticity?",
    q:"Which characteristic makes a good's demand MORE elastic?",
    opts:["Few or no close substitutes","Many close substitutes available","A very small share of the household budget"], correct:1,
    exp:"The more easily buyers can switch to a substitute, the more elastic their demand." },
  { cat:"Demand & Supply Analysis", concept:"What Drives Elasticity?",
    q:"Demand for a good tends to become MORE elastic:",
    opts:["The less time buyers have to adjust", "The more time buyers have to adjust", "Time has no effect on elasticity"], correct:1,
    exp:"Given more time to find substitutes and adjust habits, demand for most goods becomes more elastic in the long run." },

  { cat:"Demand & Supply Analysis", concept:"Income & Cross-Price Elasticity",
    q:"A good has an income elasticity of demand of −0.4. This good is:",
    opts:["A normal good","An inferior good","A luxury good"], correct:1,
    exp:"Negative income elasticity means quantity demanded falls as income rises — the definition of an inferior good." },
  { cat:"Demand & Supply Analysis", concept:"Income & Cross-Price Elasticity",
    q:"The cross-price elasticity between coffee and tea is calculated as +0.5. The two goods are:",
    opts:["Complements","Substitutes","Unrelated"], correct:1,
    exp:"A positive cross-price elasticity means a price rise in one increases demand for the other — substitutes." },

  { cat:"Demand & Supply Analysis", concept:"Substitution & Income Effects",
    q:"For a normal good, when its price falls, the substitution effect and income effect:",
    opts:["Both push toward buying more, reinforcing each other", "Push in opposite directions", "Both push toward buying less"], correct:0,
    exp:"For a normal good, both effects reinforce — cheaper relative price and higher real income both raise demand." },
  { cat:"Demand & Supply Analysis", concept:"Substitution & Income Effects",
    q:"\"Inferior good\" is a label describing:",
    opts:["A defective or low-quality product","A good people buy less of as income rises","A good with no substitutes"], correct:1,
    exp:"Inferior is a technical term about income elasticity direction, not a statement about product quality." },

  { cat:"Demand & Supply Analysis", concept:"Marginal Returns & Productivity",
    q:"A firm's total product rises from 180 to 230 units when labor increases from 4 to 5 hours. What is the marginal product of the 5th hour?",
    opts:["46 units","50 units","230 units"], correct:1,
    exp:"MP = ΔTP/ΔL = (230−180)/(5−4) = 50 units." },
  { cat:"Demand & Supply Analysis", concept:"Marginal Returns & Productivity",
    q:"Once marginal product of labor turns negative, this indicates:",
    opts:["The firm should hire more workers immediately", "Adding another worker actually reduces total output", "Average product must also be negative"], correct:1,
    exp:"Negative marginal product means the additional worker actively decreases total production." },

  { cat:"Demand & Supply Analysis", concept:"Marginal Revenue & Profit Max",
    q:"A firm in perfect competition sells at the market price with no ability to influence it. Its marginal revenue is:",
    opts:["Less than price","Equal to price","Greater than price"], correct:1,
    exp:"A price-taking firm's marginal revenue always equals the market price: MR = P." },
  { cat:"Demand & Supply Analysis", concept:"Marginal Revenue & Profit Max",
    q:"A firm should increase output whenever:",
    opts:["MR is less than MC","MR is greater than MC","MR equals average total cost"], correct:1,
    exp:"As long as MR exceeds MC, producing one more unit adds more to revenue than to cost." },

  { cat:"Demand & Supply Analysis", concept:"Cost Curves & Breakeven",
    q:"At Q=8, TFC=200 and TVC=640. What is average total cost (ATC)?",
    opts:["$80.0","$105.0","$30.0"], correct:1,
    exp:"TC=200+640=840. ATC=TC/Q=840/8=$105.0." },
  { cat:"Demand & Supply Analysis", concept:"Cost Curves & Breakeven",
    q:"Market price has fallen below a firm's average variable cost. The rational response is to:",
    opts:["Keep operating, since fixed costs are sunk anyway", "Shut down, since losses are smaller than continuing to operate", "Raise price to cover the gap"], correct:1,
    exp:"Below AVC, every unit produced loses money even before fixed costs — shutting down limits the loss to fixed costs alone." },

  // ========== MODULE E2: The Firm and Market Organization (8 concepts x 2 = 16) ==========
  { cat:"Firm & Market Organization", concept:"Four Market Structures",
    q:"A market with one seller, a unique product, and very high barriers to entry is:",
    opts:["Perfect competition","Monopolistic competition","Monopoly"], correct:2,
    exp:"One seller, a unique product, and high barriers to entry define monopoly." },
  { cat:"Firm & Market Organization", concept:"Four Market Structures",
    q:"Which market structure has the LOWEST barriers to entry?",
    opts:["Perfect competition","Oligopoly","Monopoly"], correct:0,
    exp:"Perfect competition is characterized by very low barriers to entry, allowing many firms to compete." },

  { cat:"Firm & Market Organization", concept:"Elasticity & Revenue",
    q:"A firm's price elasticity of demand is estimated at −0.5. If the firm raises its price, total revenue will:",
    opts:["Rise","Fall","Stay the same"], correct:0,
    exp:"|−0.5|<1, inelastic — raising price on an inelastic good increases total revenue." },
  { cat:"Firm & Market Organization", concept:"Elasticity & Revenue",
    q:"Total revenue is maximized at the output level where:",
    opts:["Marginal revenue equals zero","Marginal cost equals zero","Average revenue is at its minimum"], correct:0,
    exp:"TR keeps rising as long as MR is positive, and peaks exactly where MR crosses zero." },

  { cat:"Firm & Market Organization", concept:"Consumer Surplus",
    q:"A demand curve has a price-axis intercept of 60. At price 20, quantity demanded is 40. What is consumer surplus?",
    opts:["400","800","1,200"], correct:1,
    exp:"CS = ½ × base × height = ½ × 40 × (60−20) = ½ × 40 × 40 = 800." },
  { cat:"Firm & Market Organization", concept:"Consumer Surplus",
    q:"Consumer surplus is best described as:",
    opts:["The difference between total value to buyers and total amount actually paid", "The firm's total profit", "The government's tax revenue from a good"], correct:0,
    exp:"Consumer surplus is the gap between what buyers would have paid (value) and what they actually paid (expenditure)." },

  { cat:"Firm & Market Organization", concept:"Optimal Price & Output (Perfect Competition)",
    q:"Market demand is P=40−Q, market supply is P=4+Q. What is the equilibrium quantity?",
    opts:["18","22","36"], correct:0,
    exp:"40−Q=4+Q → 36=2Q → Q=18." },
  { cat:"Firm & Market Organization", concept:"Optimal Price & Output (Perfect Competition)",
    q:"Under perfect competition, an individual firm's demand curve is:",
    opts:["Downward sloping, matching market demand","Perfectly horizontal at the market price","Perfectly vertical"], correct:1,
    exp:"Even though market demand slopes down, each price-taking firm faces a flat demand curve at the market price." },

  { cat:"Firm & Market Organization", concept:"Cost Curves & Long-Run Equilibrium",
    q:"In long-run equilibrium under perfect competition, a firm's economic profit is:",
    opts:["Always strongly positive","Exactly zero","Always negative"], correct:1,
    exp:"Free entry drives price to minimum average cost, leaving economic profit at exactly zero." },
  { cat:"Firm & Market Organization", concept:"Cost Curves & Long-Run Equilibrium",
    q:"A perfectly competitive market is earning positive economic profit. Over the long run:",
    opts:["New entrants arrive, supply rises, price falls until profit reaches zero", "Existing firms raise prices to capture more profit", "Nothing changes"], correct:0,
    exp:"Positive economic profit attracts new entrants, driving supply up and price down until profit is competed away." },

  { cat:"Firm & Market Organization", concept:"Sources of Market Power",
    q:"A single water utility authorized because duplicating pipe infrastructure would be wasteful is an example of monopoly power from:",
    opts:["A patent","Economies of scale (natural monopoly)","Network effects"], correct:1,
    exp:"This is the classic natural monopoly case — large fixed infrastructure costs favor a single provider." },
  { cat:"Firm & Market Organization", concept:"Sources of Market Power",
    q:"A monopolist's demand curve is QD=500−5P. What is the price-axis intercept of its marginal revenue curve?",
    opts:["100","50","200"], correct:0,
    exp:"Demand rewritten: P=100−0.2QD. MR shares demand's price intercept (100); only the slope doubles." },

  { cat:"Firm & Market Organization", concept:"Optimal Price & Output (Monopoly)",
    q:"A monopolist faces demand P=600−3Q and TC=5,000+60Q+3Q². What is the profit-maximizing quantity?",
    opts:["45","60","90"], correct:0,
    exp:"MR=600−6Q, MC=60+6Q. Setting equal: 600−6Q=60+6Q → 540=12Q → Q=45." },
  { cat:"Firm & Market Organization", concept:"Optimal Price & Output (Monopoly)",
    q:"A profit-maximizing monopolist (MR=MC, MC>0) always operates where demand is:",
    opts:["Inelastic","Elastic","Unit elastic"], correct:1,
    exp:"MR is only positive in the elastic region of a linear demand curve, and since MC is positive at the optimum, MR=MC can only occur there." },

  { cat:"Firm & Market Organization", concept:"Price Discrimination",
    q:"An airline charges different prices for the same route based on how far in advance a ticket is booked, as a proxy for business vs. leisure travelers. This is:",
    opts:["First-degree price discrimination","Second-degree price discrimination","Third-degree price discrimination"], correct:2,
    exp:"Segmenting customers by an observable trait (booking timing, proxying traveler type) is third-degree price discrimination." },
  { cat:"Firm & Market Organization", concept:"Price Discrimination",
    q:"A gym charges a monthly membership fee plus a per-visit fee. This pricing structure is called a:",
    opts:["Two-part tariff","Volume discount","Price ceiling"], correct:0,
    exp:"A fixed fee plus a per-unit charge is the defining structure of a two-part tariff." },

  // ========== MODULE E3a: GDP, Income & Expenditure (5 concepts x 2 = 10) ==========
  { cat:"GDP, Income & Expenditure", concept:"What Is GDP?",
    q:"A government sends a $1,200 unemployment benefit check to a laid-off worker. Does this count in GDP?",
    opts:["Yes, it's government spending","No, it's a transfer payment with no new production","Only if the worker spends it immediately"], correct:1,
    exp:"Transfer payments move money without new production, so they're excluded from GDP entirely." },
  { cat:"GDP, Income & Expenditure", concept:"What Is GDP?",
    q:"GDP can be measured using which two approaches that yield the same result?",
    opts:["Income and expenditure","Profit and loss","Supply and demand"], correct:0,
    exp:"The income approach and expenditure approach must yield identical totals, since spending is someone else's income." },

  { cat:"GDP, Income & Expenditure", concept:"The Value-Added Method",
    q:"A lumber mill sells $150 of wood to a furniture maker, who sells a finished table to a retailer for $400, who sells it to a customer for $650. What is this table's contribution to GDP?",
    opts:["$1,200 (summing every sale)","$650 (the final sale price only)","$150 (just the raw materials)"], correct:1,
    exp:"Only the final sale to the end customer counts toward GDP — $650." },
  { cat:"GDP, Income & Expenditure", concept:"The Value-Added Method",
    q:"A steel producer sells $500 of steel to a car manufacturer, who builds a car sold for $18,000. What is the steel's direct contribution to GDP?",
    opts:["$500, counted separately","$0 directly — its value is embedded in the car's final price","$18,500"], correct:1,
    exp:"The steel is an intermediate good; only the car's final sale price counts toward GDP." },

  { cat:"GDP, Income & Expenditure", concept:"Nominal vs. Real GDP",
    q:"Nominal GDP grew 6% this year, while the GDP deflator rose from 100 to 102. Approximately what was real GDP growth?",
    opts:["8%","About 4%","6%"], correct:1,
    exp:"Real GDP growth ≈ nominal growth − inflation ≈ 6% − 2% = 4%." },
  { cat:"GDP, Income & Expenditure", concept:"Nominal vs. Real GDP",
    q:"The GDP deflator is calculated as:",
    opts:["(Real GDP / Nominal GDP) × 100","(Nominal GDP / Real GDP) × 100","Nominal GDP − Real GDP"], correct:1,
    exp:"GDP deflator = (Nominal GDP / Real GDP) × 100." },

  { cat:"GDP, Income & Expenditure", concept:"The Components of GDP",
    q:"A household's marginal propensity to consume (MPC) is 0.65. What is its marginal propensity to save (MPS)?",
    opts:["0.65","0.35","1.65"], correct:1,
    exp:"MPC + MPS = 1, so MPS = 1 − 0.65 = 0.35." },
  { cat:"GDP, Income & Expenditure", concept:"The Components of GDP",
    q:"In GDP = C+I+G+(X−M), which component represents business spending on capital goods and inventory changes?",
    opts:["C","I","G"], correct:1,
    exp:"I is gross private domestic investment — capital goods spending plus inventory changes." },

  { cat:"GDP, Income & Expenditure", concept:"Saving, Investment & the Trade Balance",
    q:"A country has private saving of 18% of GDP, investment of 21%, and a balanced government budget. What must its trade balance be?",
    opts:["A 3% trade surplus","A 3% trade deficit","Exactly balanced trade"], correct:1,
    exp:"S=I+(G−T)+(X−M) → 18=21+0+(X−M) → X−M=−3%, a trade deficit funding the investment shortfall." },
  { cat:"GDP, Income & Expenditure", concept:"Saving, Investment & the Trade Balance",
    q:"A government fiscal deficit [(G−T)>0] must be offset, according to the macro identity, by:",
    opts:["The private sector saving more than it invests, a trade deficit, or some mix of both", "Higher GDP growth alone", "A stronger currency"], correct:0,
    exp:"Rearranging the identity: G−T=(S−I)−(X−M). A fiscal deficit requires excess private saving, a trade deficit, or both." },

  // ========== MODULE E3b: AD, AS & Economic Growth (6 concepts x 2 = 12) ==========
  { cat:"AD, AS & Economic Growth", concept:"The Aggregate Demand Curve",
    q:"A rise in the price level reduces the real value of household savings, reducing spending. This is:",
    opts:["The wealth effect","The interest rate effect","The real exchange rate effect"], correct:0,
    exp:"A price rise eroding the real purchasing power of nominal wealth is the wealth effect." },
  { cat:"AD, AS & Economic Growth", concept:"The Aggregate Demand Curve",
    q:"A higher domestic price level makes imports relatively cheaper and exports relatively more expensive abroad, reducing net exports. This is:",
    opts:["The wealth effect","The interest rate effect","The real exchange rate effect"], correct:2,
    exp:"This is the real exchange rate effect — one of the three reasons AD slopes downward." },

  { cat:"AD, AS & Economic Growth", concept:"The Aggregate Supply Curve",
    q:"In the very short run (VSRAS), aggregate supply is:",
    opts:["Vertical","Upward sloping","Horizontal (flat)"], correct:2,
    exp:"Over a few months, firms adjust output without changing prices — a flat VSRAS curve." },
  { cat:"AD, AS & Economic Growth", concept:"The Aggregate Supply Curve",
    q:"The economy's potential output is represented by the position of which curve?",
    opts:["VSRAS","SRAS","LRAS"], correct:2,
    exp:"The vertical LRAS curve's position marks potential (full-employment) real GDP." },

  { cat:"AD, AS & Economic Growth", concept:"Shifts in AD & AS",
    q:"A central bank cuts interest rates, encouraging more investment spending at every price level. This is:",
    opts:["A movement along the AD curve","A rightward shift of the AD curve","A shift of the AS curve"], correct:1,
    exp:"Lower rates raise investment at every price level, shifting the whole AD curve right." },
  { cat:"AD, AS & Economic Growth", concept:"Shifts in AD & AS",
    q:"A sharp rise in global oil prices most directly causes:",
    opts:["A rightward shift in AD","A leftward shift in AS","A rightward shift in LRAS only"], correct:1,
    exp:"Higher input costs raise production costs at every price level, shifting AS left." },

  { cat:"AD, AS & Economic Growth", concept:"Four Macroeconomic Equilibria",
    q:"AD falls sharply due to weak consumer confidence, pushing output below potential GDP, with falling prices. This is:",
    opts:["An inflationary gap","A recessionary gap","Stagflation"], correct:1,
    exp:"AD falling below potential GDP, with falling output and prices, is a recessionary gap." },
  { cat:"AD, AS & Economic Growth", concept:"Four Macroeconomic Equilibria",
    q:"An economy experiences falling output and rising prices simultaneously, driven by an oil price shock. This is:",
    opts:["A recessionary gap","An inflationary gap","Stagflation, from a leftward AS shift"], correct:2,
    exp:"Falling output with rising prices together is the signature of an AS-driven shock — stagflation." },

  { cat:"AD, AS & Economic Growth", concept:"The Production Function & Growth Accounting",
    q:"According to growth accounting, TFP grows 1.2%, labor grows 2%, capital grows 3%, with WL=0.65, WK=0.35. What is potential GDP growth?",
    opts:["3.55%","6.2%","2.35%"], correct:0,
    exp:"Growth = 1.2 + 0.65(2) + 0.35(3) = 1.2+1.3+1.05 = 3.55%." },
  { cat:"AD, AS & Economic Growth", concept:"The Production Function & Growth Accounting",
    q:"Diminishing marginal productivity of capital implies that:",
    opts:["Each additional unit of capital, holding labor fixed, adds progressively less output", "Capital has no effect on output", "Output always grows proportionally with capital"], correct:0,
    exp:"Diminishing returns mean each added unit of capital, with labor fixed, contributes less than the previous unit." },

  { cat:"AD, AS & Economic Growth", concept:"Measures of Sustainable Growth",
    q:"Labor productivity is calculated as:",
    opts:["Real GDP divided by aggregate hours worked","Nominal GDP divided by the labor force","TFP divided by capital"], correct:0,
    exp:"Labor productivity = Real GDP / Aggregate hours worked." },
  { cat:"AD, AS & Economic Growth", concept:"Measures of Sustainable Growth",
    q:"Developed countries typically have a higher LEVEL of labor productivity but a lower GROWTH RATE than developing countries. Why?",
    opts:["Developing countries start from a lower capital base, where diminishing returns haven't yet reduced the payoff from new capital", "Developed countries have less capital accumulated", "This pattern never actually occurs"], correct:0,
    exp:"This is the convergence pattern — developing economies often see faster productivity growth as they build up capital from a lower base." },

  // ========== MODULE E4: Business Cycles (10 concepts x 2 = 20) ==========
  { cat:"Business Cycles", concept:"Consumer Behavior",
    q:"Which category of consumer spending shows the most pronounced cyclical swings?",
    opts:["Non-durable goods","Durable goods","Services"], correct:1,
    exp:"Durable goods are easy to postpone replacing, making them the most cyclically sensitive category." },
  { cat:"Business Cycles", concept:"Consumer Behavior",
    q:"Services spending tracks which measure of income most closely?",
    opts:["One-time windfall income","Permanent income","Government transfer payments only"], correct:1,
    exp:"Services spending tracks households' durable sense of financial security (permanent income), not one-off windfalls." },

  { cat:"Business Cycles", concept:"Housing & Business Investment",
    q:"Housing demand is unusually sensitive to which factor, more than most sectors?",
    opts:["Interest rates","Government spending levels","The unemployment rate alone"], correct:0,
    exp:"Since most homes are mortgage-financed, housing demand responds strongly to borrowing costs." },
  { cat:"Business Cycles", concept:"Housing & Business Investment",
    q:"Among all sectors of the economy, which typically fluctuates MOST with the business cycle?",
    opts:["Non-durable consumer goods","Business investment","Government spending"], correct:1,
    exp:"Business investment is the most volatile component of GDP across the cycle." },

  { cat:"Business Cycles", concept:"External Trade",
    q:"A country's exports are most directly driven by:",
    opts:["Domestic GDP growth","Economic conditions in trading partner countries","The domestic unemployment rate"], correct:1,
    exp:"Exports reflect foreign demand, so they respond to trading partners' conditions, not domestic conditions." },
  { cat:"Business Cycles", concept:"External Trade",
    q:"A country's currency appreciates significantly. All else equal, its trade balance is likely to:",
    opts:["Improve, as exports rise and imports fall", "Worsen, as imports become cheaper and exports pricier abroad", "Be completely unaffected"], correct:1,
    exp:"A stronger currency makes imports cheaper and exports pricier abroad, tending to worsen the trade balance." },

  { cat:"Business Cycles", concept:"Types & Measures",
    q:"A country has a labor force of 220,000 and 11,000 unemployed. What is the unemployment rate?",
    opts:["5.0%","11.0%","20.0%"], correct:0,
    exp:"Unemployment rate = Unemployed/Labor force = 11,000/220,000 = 5.0%." },
  { cat:"Business Cycles", concept:"Types & Measures",
    q:"A discouraged worker who has stopped looking for a job entirely is:",
    opts:["Counted as unemployed","Excluded from the labor force entirely","Counted as employed"], correct:1,
    exp:"Discouraged workers are statistically outside the labor force and don't count in the official unemployment rate." },

  { cat:"Business Cycles", concept:"Why It Lags the Cycle",
    q:"Why does the unemployment rate typically lag the business cycle?",
    opts:["Businesses are reluctant to change headcount quickly, and discouraged workers re-enter the labor force with a delay", "Unemployment is measured only once a decade", "Unemployment always moves before GDP does"], correct:0,
    exp:"Firms delay hiring/firing decisions, and the labor force itself expands and contracts with a lag, both making unemployment a lagging indicator." },
  { cat:"Business Cycles", concept:"Why It Lags the Cycle",
    q:"Which of these tends to be an EARLIER signal of labor market weakness than the unemployment rate?",
    opts:["Overtime hours and temporary staffing levels","The federal minimum wage","Corporate dividend announcements"], correct:0,
    exp:"Businesses cut overtime and temp staff before touching full-time headcount, making these earlier warning signs." },

  { cat:"Business Cycles", concept:"Inflation, Deflation & Hyperinflation",
    q:"A country's inflation rate falls from 20% to 8% over two years, with prices still rising. This is:",
    opts:["Deflation","Disinflation","Hyperinflation"], correct:1,
    exp:"Inflation remaining positive but slowing is disinflation, distinct from deflation." },
  { cat:"Business Cycles", concept:"Inflation, Deflation & Hyperinflation",
    q:"Why is deflation considered particularly dangerous for an economy?",
    opts:["It has no real economic effects", "It increases the real burden of fixed-nominal debt, prompting spending cuts that deepen the downturn", "It always leads directly to hyperinflation"], correct:1,
    exp:"Falling prices raise the real burden of existing debt, prompting cuts that can deepen a contraction." },

  { cat:"Business Cycles", concept:"Measuring Inflation",
    q:"A fixed-basket (Laspeyres) price index generally tends to:",
    opts:["Understate true inflation","Overstate true inflation, due to substitution, quality, and new product biases","Have no systematic bias"], correct:1,
    exp:"All three biases push the same direction — a fixed-basket index generally overstates true inflation." },
  { cat:"Business Cycles", concept:"Measuring Inflation",
    q:"A basket has 30 units of Good A (price rises from $4 to $5) and 20 units of Good B (price stays at $6). What is the price index (base=100)?",
    opts:["112.5","125.0","108.3"], correct:0,
    exp:"Base value = 30(4)+20(6) = 240. Current value = 30(5)+20(6) = 270. Index = (270/240)×100 = 112.5." },

  { cat:"Business Cycles", concept:"Cost-Push vs. Demand-Pull",
    q:"Wages grow 6% while productivity grows only 2%. This combination signals:",
    opts:["Rising unit labor costs, a cost-push inflation pressure", "Falling unit labor costs", "No effect on inflation"], correct:0,
    exp:"When compensation growth outpaces productivity growth, unit labor costs rise — a cost-push signal." },
  { cat:"Business Cycles", concept:"Cost-Push vs. Demand-Pull",
    q:"Demand-pull inflation is most closely associated with:",
    opts:["Actual GDP running close to or above potential GDP, creating bottlenecks", "Falling wages across the economy", "A shrinking money supply"], correct:0,
    exp:"As output approaches or exceeds potential GDP, capacity constraints create demand-pull pressure." },

  { cat:"Business Cycles", concept:"Leading, Coincident & Lagging Indicators",
    q:"The yield curve spread (long-term minus short-term rates) is classified as which type of indicator?",
    opts:["Leading","Coincident","Lagging"], correct:0,
    exp:"The yield curve reflects forward-looking expectations, making it a classic leading indicator." },
  { cat:"Business Cycles", concept:"Leading, Coincident & Lagging Indicators",
    q:"Industrial production and non-agricultural employment are examples of:",
    opts:["Leading indicators","Coincident indicators","Lagging indicators"], correct:1,
    exp:"These series move in step with the broader economy, making them coincident indicators." },

  { cat:"Business Cycles", concept:"Theories of the Business Cycle",
    q:"Real Business Cycle (RBC) theory attributes fluctuations primarily to:",
    opts:["Shifts in aggregate supply, like technology or input price changes", "Shifts in aggregate demand from consumer confidence", "Changes in the unemployment rate alone"], correct:0,
    exp:"RBC theory is a supply-side explanation — fluctuations stem from AS shifts, with minimal need for intervention." },
  { cat:"Business Cycles", concept:"Theories of the Business Cycle",
    q:"An economist argues a recession is best fixed with active fiscal stimulus to restore full employment. This aligns with:",
    opts:["Real Business Cycle theory","Keynesian theory","Monetarist theory"], correct:1,
    exp:"Advocating active intervention to restore full employment is the defining Keynesian position." },

  // ========== MODULE E5: Monetary and Fiscal Policy (8 concepts x 2 = 16) ==========
  { cat:"Monetary & Fiscal Policy", concept:"Monetary vs. Fiscal Policy",
    q:"A central bank raises its policy interest rate to cool an overheating economy. Is this monetary or fiscal policy?",
    opts:["Monetary policy","Fiscal policy"], correct:0,
    exp:"Actions by a central bank influencing money and credit conditions are monetary policy." },
  { cat:"Monetary & Fiscal Policy", concept:"Monetary vs. Fiscal Policy",
    q:"Which is a distinguishing feature of fiscal policy, not shared by monetary policy?",
    opts:["It can be used to redistribute income and wealth","It affects the overall economy","It is set by unelected officials only"], correct:0,
    exp:"Fiscal policy, through taxation and spending, can deliberately redistribute income and wealth." },

  { cat:"Monetary & Fiscal Policy", concept:"Functions & Definitions of Money",
    q:"Which of the following is NOT one of the three classic functions of money?",
    opts:["Medium of exchange","Unit of account","Guarantee of future economic growth"], correct:2,
    exp:"The three functions are medium of exchange, store of wealth, and unit of account." },
  { cat:"Monetary & Fiscal Policy", concept:"Functions & Definitions of Money",
    q:"Broad money, compared to narrow money, includes:",
    opts:["Only physical notes and coins","Narrow money plus a wider range of liquid assets usable for purchases","Only central bank reserves"], correct:1,
    exp:"Broad money encompasses narrow money plus a wider range of liquid assets like savings accounts." },

  { cat:"Monetary & Fiscal Policy", concept:"The Money Creation Process",
    q:"A bank receives a $250 deposit with a 20% reserve requirement. How much can it lend out?",
    opts:["$250","$200","$50"], correct:1,
    exp:"The bank keeps 20% ($50) as reserves and lends the remaining 80% ($200)." },
  { cat:"Monetary & Fiscal Policy", concept:"The Money Creation Process",
    q:"With a 25% reserve requirement, how much total money can be created from an initial $150 deposit?",
    opts:["$600","$450","$187.50"], correct:0,
    exp:"Total money = Deposit/Reserve requirement = $150/0.25 = $600." },

  { cat:"Monetary & Fiscal Policy", concept:"The Quantity Theory of Money",
    q:"The quantity equation of exchange is:",
    opts:["M × V = P × Y","M + V = P + Y","M / V = P / Y"], correct:0,
    exp:"M×V=P×Y: quantity of money times velocity equals price level times real output." },
  { cat:"Monetary & Fiscal Policy", concept:"The Quantity Theory of Money",
    q:"Economists who believe money supply growth directly drives inflation are called:",
    opts:["Keynesians","Monetarists","Behavioralists"], correct:1,
    exp:"Monetarists hold that a causal relationship runs from money supply growth to inflation." },

  { cat:"Monetary & Fiscal Policy", concept:"The Demand for Money",
    q:"Which motive for holding money is most sensitive to changes in interest rates?",
    opts:["Transactions-related demand","Precautionary demand","Speculative demand"], correct:2,
    exp:"Speculative demand reflects the opportunity cost of holding cash versus interest-bearing assets." },
  { cat:"Monetary & Fiscal Policy", concept:"The Demand for Money",
    q:"Interest rates on bonds rise sharply. What happens to the speculative demand for money?",
    opts:["It falls, since holding cash means giving up more return", "It rises, since bonds are now more attractive", "It is unaffected"], correct:0,
    exp:"As bond returns rise, the opportunity cost of holding cash rises too, reducing speculative money demand." },

  { cat:"Monetary & Fiscal Policy", concept:"Money Market Equilibrium",
    q:"In the money market, the money supply curve (MS) is typically drawn as:",
    opts:["Upward sloping","Vertical","Horizontal"], correct:1,
    exp:"MS is vertical because the nominal quantity of money at any moment is treated as fixed." },
  { cat:"Monetary & Fiscal Policy", concept:"Money Market Equilibrium",
    q:"The nominal interest rate sits below the money market's equilibrium rate. What is happening?",
    opts:["Excess demand for money, pushing rates up toward equilibrium", "Excess supply of money, pushing rates down further", "The market is already in equilibrium"], correct:0,
    exp:"Below equilibrium, money demand exceeds supply; people sell bonds to raise cash, pushing rates up." },

  { cat:"Monetary & Fiscal Policy", concept:"The Fisher Effect",
    q:"Investors require a 3.5% real return, with expected inflation of 2.8%. What nominal rate should they demand?",
    opts:["0.7%","6.3%","9.8%"], correct:1,
    exp:"Rnom = Rreal + πe = 3.5% + 2.8% = 6.3%." },
  { cat:"Monetary & Fiscal Policy", concept:"The Fisher Effect",
    q:"The Fisher effect relies on money neutrality, which holds that in the long run, money supply changes affect:",
    opts:["Only nominal variables, not real variables like the real interest rate", "Only real variables", "Neither real nor nominal variables"], correct:0,
    exp:"Money neutrality holds that money supply changes affect nominal prices but leave real variables unchanged long-run." },

  { cat:"Monetary & Fiscal Policy", concept:"The Costs of Inflation",
    q:"When actual inflation comes in unexpectedly HIGH, who benefits and who is hurt?",
    opts:["Borrowers benefit; lenders are hurt","Lenders benefit; borrowers are hurt","Neither party is affected"], correct:0,
    exp:"Higher-than-expected inflation erodes the real value of fixed nominal debt, benefiting the borrower." },
  { cat:"Monetary & Fiscal Policy", concept:"The Costs of Inflation",
    q:"Which type of inflation is generally considered most economically costly?",
    opts:["Expected inflation, since it's fully anticipated", "Unexpected inflation, since it redistributes wealth and distorts price signals", "Zero inflation"], correct:1,
    exp:"Unexpected inflation can't be planned for and redistributes real wealth unpredictably between borrowers and lenders." },

  // ========== MODULE E6: International Trade and Capital Flows (8 concepts x 2 = 16) ==========
  { cat:"International Trade & Capital Flows", concept:"GDP vs. GNP & Basic Terms",
    q:"A US-owned factory operates in Vietnam. This factory's output counts toward:",
    opts:["Vietnam's GDP and the US's GNP","The US's GDP and Vietnam's GNP","Neither country's GDP or GNP"], correct:0,
    exp:"GDP is location-based (Vietnam), while GNP is ownership-based (US)." },
  { cat:"International Trade & Capital Flows", concept:"GDP vs. GNP & Basic Terms",
    q:"If a country's exports exceed its imports, it has a:",
    opts:["Trade deficit","Trade surplus","Balanced trade position"], correct:1,
    exp:"Exports greater than imports is the definition of a trade surplus." },

  { cat:"International Trade & Capital Flows", concept:"Patterns & Trends in Trade",
    q:"A US pension fund buys shares of a French company on the French exchange, with no intention of controlling it. This is:",
    opts:["Foreign direct investment (FDI)","Foreign portfolio investment (FPI)","A current account transfer"], correct:1,
    exp:"A shorter-term investment in foreign financial instruments without operational control is FPI." },
  { cat:"International Trade & Capital Flows", concept:"Patterns & Trends in Trade",
    q:"A company building and operating its own factory in another country, with full operational control, is engaging in:",
    opts:["Foreign portfolio investment (FPI)","Foreign direct investment (FDI)","A unilateral transfer"], correct:1,
    exp:"Direct investment in productive assets with operational control is FDI, making the firm a multinational corporation." },

  { cat:"International Trade & Capital Flows", concept:"Absolute vs. Comparative Advantage",
    q:"Worker output: Country X makes 25 shirts or 5 hats per day; Country Y makes 15 shirts or 5 hats per day. Which country has the comparative advantage in hats?",
    opts:["Country X","Country Y","Neither, they are identical"], correct:1,
    exp:"X's opp. cost per hat = 25/5=5 shirts. Y's = 15/5=3 shirts. Y's lower cost gives it the comparative advantage in hats." },
  { cat:"International Trade & Capital Flows", concept:"Absolute vs. Comparative Advantage",
    q:"Even if one country has an absolute advantage in producing every good, can both countries still gain from trade?",
    opts:["No, only the more efficient country benefits", "Yes, as long as each country has a comparative advantage in something", "Only with identical technology"], correct:1,
    exp:"Comparative advantage guarantees mutual gains from trade even when one country is more efficient at everything, as long as opportunity costs differ." },

  { cat:"International Trade & Capital Flows", concept:"The Gains from Trade",
    q:"Two countries' autarkic prices for a good are 6 and 14. Which world price allows both to gain from trade?",
    opts:["5","10","15"], correct:1,
    exp:"Any world price strictly between the two autarkic prices (6 and 14) allows mutual gains; 10 falls within that range." },
  { cat:"International Trade & Capital Flows", concept:"The Gains from Trade",
    q:"The further a world price sits from a country's own autarkic price, the:",
    opts:["Less that country gains from trade","More that country gains from trade","Gains are unrelated to the world price"], correct:1,
    exp:"A world price further from a country's own autarkic price means a bigger gap between what it pays/receives and its own opportunity cost — a bigger gain." },

  { cat:"International Trade & Capital Flows", concept:"The Ricardian Model",
    q:"In the Ricardian model of trade, comparative advantage arises from differences in:",
    opts:["Relative capital and labor endowments","Labor productivity, reflecting differences in technology","Government trade policy alone"], correct:1,
    exp:"With labor as the only variable factor, technology-driven labor productivity differences are the sole source of comparative advantage." },
  { cat:"International Trade & Capital Flows", concept:"The Ricardian Model",
    q:"A country's comparative advantage in the Ricardian model is:",
    opts:["Permanent and unchangeable","Subject to change as technology gaps close or shift", "Determined only by natural resources"], correct:1,
    exp:"Comparative advantage in the Ricardian model can shift over time as relative technology changes." },

  { cat:"International Trade & Capital Flows", concept:"The Heckscher–Ohlin Model",
    q:"According to the Heckscher–Ohlin model, a labor-abundant country would be expected to:",
    opts:["Export labor-intensive goods and import capital-intensive goods", "Export capital-intensive goods and import labor-intensive goods", "Export and import identical baskets"], correct:0,
    exp:"A country specializes in and exports goods intensive in the factor it holds abundantly." },
  { cat:"International Trade & Capital Flows", concept:"The Heckscher–Ohlin Model",
    q:"Which model allows trade to redistribute income within a country, benefiting the abundant factor and hurting the scarce one?",
    opts:["The Ricardian model","The Heckscher–Ohlin model","Neither model"], correct:1,
    exp:"With two factors of production, Heckscher–Ohlin allows relative factor prices to shift with trade, creating winners and losers." },

  { cat:"International Trade & Capital Flows", concept:"BOP Components",
    q:"A worker sends money home to family abroad as a remittance. This is recorded in the BOP under:",
    opts:["Merchandise trade","Unilateral transfers","The financial account"], correct:1,
    exp:"A one-way transfer with nothing given in exchange belongs in unilateral transfers within the current account." },
  { cat:"International Trade & Capital Flows", concept:"BOP Components",
    q:"The financial account of the balance of payments records:",
    opts:["Physical goods bought and sold across borders", "A country's financial assets abroad and foreign-owned assets domestically", "Tourism and transportation services only"], correct:1,
    exp:"The financial account tracks investment flows — assets held abroad and domestic assets held by foreigners." },

  { cat:"International Trade & Capital Flows", concept:"The National Income Identity",
    q:"A country's GDP (Y) is $750B, with C+I+G totaling $725B. What is its current account balance?",
    opts:["A $25B surplus","A $25B deficit","Exactly balanced"], correct:0,
    exp:"CA = Y − (C+I+G) = 750 − 725 = $25B, a surplus." },
  { cat:"International Trade & Capital Flows", concept:"The National Income Identity",
    q:"A country running a persistent current account deficit is, in effect:",
    opts:["Lending its surplus savings abroad", "Importing present consumption, financed by borrowing from abroad", "Completely self-sufficient"], correct:1,
    exp:"A current account deficit means a country consumes more than it produces, financed by borrowing from abroad." },

  // ========== MODULE E7: Currency Exchange Rates (6 concepts x 2 = 12) ==========
  { cat:"Currency Exchange Rates", concept:"Size & Importance",
    q:"By daily turnover, the foreign exchange market is:",
    opts:["Smaller than global equity markets","The largest financial market in the world","About the same size as global bond markets"], correct:1,
    exp:"At roughly $5.1 trillion daily, FX is by far the world's largest financial market." },
  { cat:"Currency Exchange Rates", concept:"Size & Importance",
    q:"An investor holds only domestic stocks, never buying foreign securities. Is this investor exposed to FX movements?",
    opts:["No, direct foreign holdings are required for any exposure", "Yes, indirectly, through foreign revenue and competition faced by domestic companies", "Only if the investor also holds bonds"], correct:1,
    exp:"Domestic companies often earn significant foreign revenue and compete globally, creating indirect FX exposure." },

  { cat:"Currency Exchange Rates", concept:"Nominal & Real Exchange Rates",
    q:"The real exchange rate differs from the nominal rate because it:",
    opts:["Ignores inflation entirely", "Adjusts for relative price levels, capturing true purchasing power", "Is always identical to the nominal rate"], correct:1,
    exp:"The real exchange rate multiplies the nominal rate by the price level ratio, capturing true purchasing power." },
  { cat:"Currency Exchange Rates", concept:"Nominal & Real Exchange Rates",
    q:"When a currency buys MORE of another currency than before, it has:",
    opts:["Depreciated","Appreciated","Defaulted"], correct:1,
    exp:"A currency that can purchase more of another currency has appreciated." },

  { cat:"Currency Exchange Rates", concept:"Spot, Forward & FX Swaps",
    q:"A spot foreign exchange transaction typically settles:",
    opts:["Immediately, with no delay","About two business days after the trade (T+2)","Exactly one year after the trade"], correct:1,
    exp:"Spot transactions for most currencies settle on a T+2 basis." },
  { cat:"Currency Exchange Rates", concept:"Spot, Forward & FX Swaps",
    q:"An FX swap is best described as:",
    opts:["A single spot transaction only", "A spot transaction combined with an offsetting forward transaction", "A type of currency option"], correct:1,
    exp:"An FX swap combines a spot transaction with an offsetting forward, often used to roll a position to a new date." },

  { cat:"Currency Exchange Rates", concept:"Hedging a Foreign Investment",
    q:"In a hedged foreign bond strategy, what specifically eliminates the investor's currency risk?",
    opts:["The fact that the bond is risk-free", "Locking in the conversion rate today via a forward contract", "Choosing a one-year maturity"], correct:1,
    exp:"The forward contract removes uncertainty about the future spot rate, which is the actual source of currency risk." },
  { cat:"Currency Exchange Rates", concept:"Hedging a Foreign Investment",
    q:"Spot rate 0.20, foreign interest rate 3%, forward rate 0.205. Approximately what is the domestic-currency return?",
    opts:["About 3%","About 5.6%","About 10%"], correct:1,
    exp:"(1/0.20)×1.03×0.205 − 1 = 5×1.03×0.205−1 = 1.05575−1 ≈ 5.6%." },

  { cat:"Currency Exchange Rates", concept:"% Change in Currency Value",
    q:"The GBP/USD rate moves from 1.4000 to 1.3300. What is the approximate percentage change?",
    opts:["−5.0%","−7.0%","+5.0%"], correct:0,
    exp:"%Δ = (1.3300−1.4000)/1.4000 = −0.0700/1.4000 = −5.0%." },
  { cat:"Currency Exchange Rates", concept:"% Change in Currency Value",
    q:"If Currency A depreciates 10% against Currency B, what appreciation in B fully reverses the move?",
    opts:["Exactly 10%","Approximately 11.1%","Exactly 20%"], correct:1,
    exp:"Percentage changes use different bases, so reversing a 10% depreciation requires roughly 11.1% appreciation." },

  { cat:"Currency Exchange Rates", concept:"The Elasticities Approach",
    q:"The Marshall-Lerner condition addresses:",
    opts:["Whether a currency devaluation will improve a country's trade balance", "How central banks set interest rates", "How GDP is calculated"], correct:0,
    exp:"Marshall-Lerner specifies when a devaluation moves the trade balance toward surplus, based on demand elasticities." },
  { cat:"Currency Exchange Rates", concept:"The Elasticities Approach",
    q:"Export share ωX=0.4, export elasticity εX=1.3, import elasticity εM=0.7. Does the Marshall-Lerner condition hold?",
    opts:["Yes, 0.34 > 0","No, the value is negative","Cannot be determined"], correct:0,
    exp:"0.4(1.3) + 0.6(0.7−1) = 0.52 − 0.18 = 0.34 > 0 — the condition holds." },
];

/* ============================================================
   Quiz engine — shuffled order, category tags, breakdown by module
   ============================================================ */
(function(){
  const shell = document.getElementById('quizShell');
  if (!shell) return;

  function shuffle(arr){
    const a = [...arr];
    for (let i=a.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }

  let order = shuffle(QUIZ);
  let current = 0;
  let score = 0;
  let answered = new Array(order.length).fill(null);
  const categories = [...new Set(QUIZ.map(q=>q.cat))];
  const catScores = {};
  categories.forEach(c => catScores[c] = {correct:0, total:0});

  function renderIntro(){
    shell.innerHTML = `
      <div style="text-align:center; padding:20px 0;">
        <p style="color:var(--ink-soft); margin-bottom:20px;">${order.length} questions, shuffled — 2 per concept, across all 9 modules, for a genuinely reliable readiness read. One attempt per question, with an explanation after each.</p>
        <button class="start-btn" id="startBtn">Start the Final Review →</button>
      </div>`;
    document.getElementById('startBtn').addEventListener('click', () => { renderQuestion(); });
  }

  function renderQuestion(){
    const item = order[current];
    let html = `<div class="cat-tag">${item.cat} · ${item.concept}</div>`;
    html += `<div class="quiz-progress">Question ${current+1} of ${order.length} &nbsp;·&nbsp; Score so far: ${score}</div>`;
    html += `<div class="quiz-q">${item.q}</div>`;
    html += `<div class="opt-list" id="quizOpts">`;
    item.opts.forEach((opt, i) => {
      html += `<button class="opt-btn" data-i="${i}">${opt}</button>`;
    });
    html += `</div>`;
    html += `<div class="quiz-explain" id="quizExplain">${item.exp}</div>`;
    html += `<div class="quiz-nav">
      <button class="btn ghost" id="quizPrev" ${current===0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn" id="quizNext" disabled>${current === order.length-1 ? 'See final score' : 'Next →'}</button>
    </div>`;
    shell.innerHTML = html;

    const opts = shell.querySelectorAll('.opt-btn');
    const explain = document.getElementById('quizExplain');
    const nextBtn = document.getElementById('quizNext');
    const prevBtn = document.getElementById('quizPrev');

    if (answered[current] !== null){
      opts.forEach(btn => {
        btn.disabled = true;
        const i = +btn.dataset.i;
        if (i === item.correct) btn.classList.add('correct');
        else if (i === answered[current]) btn.classList.add('incorrect');
      });
      explain.classList.add('show');
      nextBtn.disabled = false;
    }

    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered[current] !== null) return;
        const i = +btn.dataset.i;
        answered[current] = i;
        const isCorrect = i === item.correct;
        if (isCorrect) score++;
        catScores[item.cat].total++;
        if (isCorrect) catScores[item.cat].correct++;
        if (typeof cfaRecordAnswer === 'function' && item.concept){
          cfaRecordAnswer(item.concept, item.cat, isCorrect);
        }
        opts.forEach(b => {
          b.disabled = true;
          const bi = +b.dataset.i;
          if (bi === item.correct) b.classList.add('correct');
          else if (bi === i) b.classList.add('incorrect');
        });
        explain.classList.add('show');
        nextBtn.disabled = false;
      });
    });

    nextBtn.addEventListener('click', () => {
      if (current < order.length - 1){ current++; renderQuestion(); }
      else { renderScore(); }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){ current--; renderQuestion(); }
    });
  }

  function renderScore(){
    const pct = Math.round((score / order.length) * 100);
    let msg = "Solid overall foundation — use the breakdown below to see exactly which modules to revisit.";
    if (pct >= 90) msg = "Excellent — you've genuinely internalized the full curriculum.";
    else if (pct >= 70) msg = "Good work — a few gaps worth revisiting, shown below.";

    let breakdownHTML = '<div class="cat-breakdown">';
    categories.forEach(cat => {
      const cs = catScores[cat];
      const catPct = cs.total > 0 ? Math.round((cs.correct/cs.total)*100) : 0;
      breakdownHTML += `
        <div class="cat-row">
          <div class="name">${cat}</div>
          <div class="track"><div class="fill" style="width:${catPct}%;"></div></div>
          <div class="score">${cs.correct}/${cs.total}</div>
        </div>`;
    });
    breakdownHTML += '</div>';

    shell.innerHTML = `
      <div class="quiz-score">
        <div style="font-family:var(--font-mono); font-size:.8rem; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.08em;">Final score</div>
        <div class="big">${score} / ${order.length}</div>
        <p style="max-width:52ch; margin:10px auto 6px; color:var(--ink-soft);">${msg}</p>
      </div>
      <h3 style="font-family:var(--font-mono); font-size:.8rem; text-transform:uppercase; letter-spacing:.05em; color:var(--indigo); margin:24px 0 4px;">Score by module</h3>
      ${breakdownHTML}
      <div style="text-align:center; margin-top:24px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
        <button class="btn" id="quizRestart">Retake (new shuffled order)</button>
        <a href="../readiness/index.html" class="btn ghost" style="text-decoration:none; display:inline-flex; align-items:center;">See full readiness dashboard →</a>
      </div>`;
    document.getElementById('quizRestart').addEventListener('click', () => {
      order = shuffle(QUIZ);
      current = 0; score = 0;
      answered = new Array(order.length).fill(null);
      categories.forEach(c => { catScores[c] = {correct:0, total:0}; });
      renderQuestion();
    });
  }

  renderIntro();
})();

  } catch(e) { console.warn('[final-review] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: firm-market
   ============================================================ */
(function(){
  try {
// ============================================================
// Introduction to the Firm and Market Organization — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   03 — Consumer surplus calculator + triangle chart
   ============================================================ */
(function(){
  const aI = document.getElementById('csA'), bI = document.getElementById('csB'), pI = document.getElementById('csP');
  const result = document.getElementById('csResult'), steps = document.getElementById('csSteps');
  const chartContainer = document.getElementById('csChart');
  if (!aI) return;

  function render(){
    const a = parseFloat(aI.value), b = parseFloat(bI.value), p = parseFloat(pI.value);
    const q = a - b*p;
    const priceIntercept = a/b;
    const cs = 0.5 * q * (priceIntercept - p);
    result.textContent = `Consumer surplus = ${fmt(cs,2)}`;
    steps.textContent = `Q=${fmt(q,2)}, price intercept=${fmt(priceIntercept,2)}, CS=½(${fmt(q,2)})(${fmt(priceIntercept-p,2)})=${fmt(cs,2)}`;

    // chart
    const W=440, H=260, padL=50, padR=20, padT=20, padB=36;
    const domainQMax = Math.max(a, q*1.2);
    const domainPMax = priceIntercept * 1.1;
    const xScale = qq => padL + (qq/domainQMax)*(W-padL-padR);
    const yScale = pp => (H-padB) - (pp/domainPMax)*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'econ-svg', style:'max-width:460px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));
    svg.appendChild(svgEl('line', {x1:padL, x2:padL, y1:padT, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));
    // demand line
    svg.appendChild(svgEl('line', {x1:xScale(0), y1:yScale(priceIntercept), x2:xScale(a), y2:yScale(0), stroke:'#2B2560', 'stroke-width':2.2}));
    // triangle (consumer surplus)
    if (q > 0 && q <= domainQMax){
      const trianglePts = `${xScale(0)},${yScale(priceIntercept)} ${xScale(0)},${yScale(p)} ${xScale(q)},${yScale(p)}`;
      svg.appendChild(svgEl('polygon', {points:trianglePts, fill:'#E8A33D', 'fill-opacity':0.4}));
      // price line + quantity line
      svg.appendChild(svgEl('line', {x1:padL, x2:xScale(q), y1:yScale(p), y2:yScale(p), stroke:'#C77F1E', 'stroke-width':1.5, 'stroke-dasharray':'3,2'}));
      svg.appendChild(svgEl('line', {x1:xScale(q), x2:xScale(q), y1:yScale(p), y2:H-padB, stroke:'#C77F1E', 'stroke-width':1.5, 'stroke-dasharray':'3,2'}));
    }
    const xlabel = svgEl('text', {x:W/2, y:H-6, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    xlabel.textContent = 'Quantity';
    svg.appendChild(xlabel);
    const ylabel = svgEl('text', {x:12, y:padT+8, 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    ylabel.textContent = 'Price';
    svg.appendChild(ylabel);
    chartContainer.innerHTML = '';
    chartContainer.appendChild(svg);
  }
  [aI,bI,pI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   04 — Market equilibrium solver
   ============================================================ */
(function(){
  const aI = document.getElementById('eqA'), bI = document.getElementById('eqB'),
        cI = document.getElementById('eqC'), dI = document.getElementById('eqD');
  const result = document.getElementById('eqResult'), steps = document.getElementById('eqSteps');
  if (!aI) return;
  function render(){
    const a = parseFloat(aI.value), b = parseFloat(bI.value), c = parseFloat(cI.value), d = parseFloat(dI.value);
    // a - bQ = c + dQ  ->  a-c = (b+d)Q
    const Q = (a-c)/(b+d);
    const P = a - b*Q;
    result.textContent = `Q* = ${fmt(Q,2)}, P* = ${fmt(P,2)}`;
    steps.textContent = `${a} − ${b}Q = ${c} + ${d}Q → Q* = ${fmt(Q,2)} → P* = ${fmt(P,2)}`;
  }
  [aI,bI,cI,dI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   07 — Monopoly optimizer
   ============================================================ */
(function(){
  const aI = document.getElementById('mpA'), bI = document.getElementById('mpB'),
        fI = document.getElementById('mpF'), cI = document.getElementById('mpC'), dI = document.getElementById('mpD');
  const out = document.getElementById('mpOut');
  if (!aI) return;
  function render(){
    const a = parseFloat(aI.value), b = parseFloat(bI.value);
    const F = parseFloat(fI.value), c = parseFloat(cI.value), d = parseFloat(dI.value);
    // Demand: P = a - bQ  -> TR = aQ - bQ^2 -> MR = a - 2bQ
    // TC = F + cQ + dQ^2 -> MC = c + 2dQ
    // MR = MC: a - 2bQ = c + 2dQ -> a-c = (2b+2d)Q
    const Q = (a-c) / (2*b + 2*d);
    const P = a - b*Q;
    const TR = P*Q;
    const TC = F + c*Q + d*Q*Q;
    const profit = TR - TC;
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Q*</div><div class="v">${fmt(Q,2)}</div></div>
      <div class="stat-readout"><div class="k">P*</div><div class="v">${fmt(P,2)}</div></div>
      <div class="stat-readout"><div class="k">Profit</div><div class="v">${fmt(profit,2)}</div></div>
    `;
  }
  [aI,bI,fI,cI,dI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   08 — Two-part tariff calculator
   ============================================================ */
(function(){
  const aI = document.getElementById('tpA'), bI = document.getElementById('tpB'), mcI = document.getElementById('tpMC');
  const out = document.getElementById('tpOut');
  if (!aI) return;
  function render(){
    const a = parseFloat(aI.value), b = parseFloat(bI.value), mc = parseFloat(mcI.value);
    const q = a - b*mc;
    const priceIntercept = a/b;
    const fee = 0.5 * q * (priceIntercept - mc);
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Quantity</div><div class="v">${fmt(q,2)}</div></div>
      <div class="stat-readout"><div class="k">Membership fee</div><div class="v">${fmt(fee,2)}</div></div>
    `;
  }
  [aI,bI,mcI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   Check-in mini quizzes
   ============================================================ */
(function(){
  document.querySelectorAll('.checkin').forEach(box => {
    const btns = box.querySelectorAll('.opt-btn');
    const feedback = box.querySelector('.checkin-feedback');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btns.forEach(b => b.disabled = true);
        btns.forEach(b => { if (b.dataset.correct === 'true') b.classList.add('correct'); });
        if (btn.dataset.correct !== 'true') btn.classList.add('incorrect');
        feedback.classList.add('show');
        markSectionProgress(box.closest('section').id);
      });
    });
  });
})();

/* ============================================================
   Sidebar scroll-spy + progress + mobile toggle
   ============================================================ */
const sectionIds = ['sec-structures','sec-elasticityrevenue','sec-surplus','sec-pcequilibrium','sec-pclongrun','sec-monopolypower','sec-monopolyoptimal','sec-pricediscrimination','sec-quiz'];
const visited = new Set();

function markSectionProgress(id){
  if (sectionIds.includes(id)){
    visited.add(id);
    updateProgress();
  }
}
function updateProgress(){
  const pct = Math.round((visited.size / sectionIds.length) * 100);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressPct');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
  sectionIds.forEach(id => {
    const link = document.querySelector(`.toc a[data-sec="${id}"]`);
    if (link && visited.has(id)) link.classList.add('done');
  });
  try { localStorage.setItem('cfa-progress-firm-market', String(pct)); } catch(e) {}
}

(function(){
  const links = document.querySelectorAll('.toc a[data-sec]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.toc a[data-sec="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting){
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        markSectionProgress(id);
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle){
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.querySelectorAll('.toc a').forEach(a => a.addEventListener('click', () => sidebar.classList.remove('open')));
  }
})();

/* ============================================================
   QUIZ
   ============================================================ */
const QUIZ = [
  {
    concept: "Four Market Structures",
    q: "A market with many sellers, differentiated products, and some pricing power for each seller is best described as:",
    opts: ["Perfect competition", "Monopolistic competition", "Monopoly"],
    correct: 1,
    exp: "Many sellers plus product differentiation plus some (but not total) pricing power is the definition of monopolistic competition."
  },
  {
    concept: "Four Market Structures",
    q: "Which market structure has the HIGHEST barriers to entry?",
    opts: ["Perfect competition", "Oligopoly", "Monopoly"],
    correct: 2,
    exp: "Monopoly markets have the highest barriers to entry — that's precisely what allows a single seller to dominate without competition."
  },
  {
    concept: "Elasticity & Revenue",
    q: "A firm's price elasticity of demand is estimated at −0.5. If the firm raises its price, total revenue will:",
    opts: ["Rise", "Fall", "Stay exactly the same"],
    correct: 0,
    exp: "|−0.5| < 1, inelastic demand. Raising price on an inelastic good increases total revenue, since quantity falls proportionally less than price rises."
  },
  {
    concept: "Elasticity & Revenue",
    q: "Total revenue is maximized at the output level where:",
    opts: ["Marginal revenue equals zero", "Marginal cost equals zero", "Average revenue is at its minimum"],
    correct: 0,
    exp: "As long as MR is positive, selling more still adds to TR; TR peaks exactly where MR crosses zero."
  },
  {
    concept: "Consumer Surplus",
    q: "A demand curve has a price-axis intercept of 60. At the current price of 40, quantity demanded is 20. What is consumer surplus?",
    opts: ["800", "200", "400"],
    correct: 1,
    exp: "CS = ½ × base × height = ½ × 20 × (60−40) = ½ × 20 × 20 = 200."
  },
  {
    concept: "Optimal Price & Output (Perfect Competition)",
    q: "Market demand is P = 50 − 2Q, market supply is P = 5 + 3Q. What is the equilibrium quantity?",
    opts: ["9", "15", "5"],
    correct: 0,
    exp: "50 − 2Q = 5 + 3Q → 45 = 5Q → Q = 9."
  },
  {
    concept: "Optimal Price & Output (Perfect Competition)",
    q: "Under perfect competition, an individual firm's demand curve is:",
    opts: ["Downward sloping, matching the market demand curve", "Perfectly horizontal at the market price", "Perfectly vertical"],
    correct: 1,
    exp: "Even though market demand slopes downward, each individual firm in perfect competition faces a flat (horizontal) demand curve at the going market price — it has no power to charge more."
  },
  {
    concept: "Optimal Price & Output (Perfect Competition)",
    q: "In perfect competition, which equality holds for an individual firm?",
    opts: ["Price = Average Revenue = Marginal Revenue", "Price = Marginal Cost only, never Marginal Revenue", "Marginal Revenue always exceeds Price"],
    correct: 0,
    exp: "Because a perfectly competitive firm is a price taker, price, average revenue, and marginal revenue are all identical."
  },
  {
    concept: "Cost Curves & Long-Run Equilibrium",
    q: "In long-run equilibrium under perfect competition, a firm's economic profit is:",
    opts: ["Always strongly positive", "Exactly zero", "Always negative"],
    correct: 1,
    exp: "Free entry drives price down to minimum average cost in the long run, leaving economic profit at exactly zero (though the firm still earns a normal accounting return)."
  },
  {
    concept: "Cost Curves & Long-Run Equilibrium",
    q: "The condition marking long-run equilibrium in perfect competition is:",
    opts: ["Price = Marginal Cost = Minimum Average Cost", "Price is always above Marginal Cost", "Marginal Cost is falling"],
    correct: 0,
    exp: "Long-run equilibrium requires price to equal both marginal cost and the minimum point of average cost — the point where entry is no longer attractive."
  },
  {
    concept: "Sources of Market Power",
    q: "A single electric utility serving a city, authorized because building competing power grids would be wastefully expensive, is an example of monopoly power arising from:",
    opts: ["A patent", "Economies of scale (a natural monopoly)", "Network effects"],
    correct: 1,
    exp: "This is the classic natural monopoly case — large fixed infrastructure costs make a single provider more efficient than multiple competing ones."
  },
  {
    concept: "Sources of Market Power",
    q: "A monopolist's demand curve is QD = 300 − 3P. What is the price-axis intercept of its marginal revenue curve?",
    opts: ["100", "50", "200"],
    correct: 0,
    exp: "Rewriting demand as P = 100 − (1/3)QD, the price intercept is 100. MR shares the same price intercept as demand; only the slope doubles."
  },
  {
    concept: "Optimal Price & Output (Monopoly)",
    q: "A monopolist faces demand P = 600 − 3Q and total cost TC = 10,000 + 60Q + 2Q². What is the profit-maximizing quantity?",
    opts: ["54", "45", "60"],
    correct: 0,
    exp: "MR = 600 − 6Q, MC = 60 + 4Q. Setting equal: 600−6Q=60+4Q → 540=10Q → Q=54."
  },
  {
    concept: "Optimal Price & Output (Monopoly)",
    q: "A profit-maximizing monopolist (MR=MC, with MC>0) will always operate where demand is:",
    opts: ["Inelastic", "Elastic", "Unit elastic"],
    correct: 1,
    exp: "MR is only positive in the elastic region of a linear demand curve; since MC is positive at the optimum, MR=MC can only occur where demand is elastic."
  },
  {
    concept: "Optimal Price & Output (Monopoly)",
    q: "A firm's marginal cost is constant at 40, and its estimated price elasticity of demand is 2.0. Using MR=MC, what is the profit-maximizing price?",
    opts: ["80", "60", "40"],
    correct: 1,
    exp: "P = MC/(1 − 1/E) = 40/(1 − 1/2) = 40/0.5 = 80."
  },
  {
    concept: "Price Discrimination",
    q: "Charging airline passengers different prices based on how far in advance they book, assuming this reflects a systematic difference between leisure and business travelers, is an example of:",
    opts: ["First-degree price discrimination", "Second-degree price discrimination", "Third-degree price discrimination"],
    correct: 2,
    exp: "Segmenting customers by an observable characteristic (booking timing, as a proxy for traveler type) into different price tiers is third-degree price discrimination."
  },
  {
    concept: "Price Discrimination",
    q: "A gym charges a monthly membership fee plus a per-visit fee. This pricing structure is called a:",
    opts: ["Two-part tariff", "Volume discount", "Price ceiling"],
    correct: 0,
    exp: "A fixed fee plus a per-unit charge is the defining structure of a two-part tariff, designed to extract consumer surplus."
  },
  {
    concept: "Price Discrimination",
    q: "A consumer's demand is QD = 30 − 5P, and marginal cost is constant at €1. If a seller uses a two-part tariff, charging price = MC, how many units will the consumer buy?",
    opts: ["25", "30", "5"],
    correct: 0,
    exp: "QD = 30 − 5(1) = 25 units at price = marginal cost."
  },
  {
    concept: "Price Discrimination",
    q: "A regulator sets a natural monopoly's price where price equals long-run average cost. Compared to the unregulated monopoly price, this regulated price is:",
    opts: ["Higher", "Lower", "Exactly the same"],
    correct: 1,
    exp: "Regulating at average cost (a 'fair return') produces a lower price and higher output than the unregulated monopolist would choose on its own."
  },
  {
    concept: "Price Discrimination",
    q: "Setting a natural monopoly's price equal to marginal cost (the theoretically efficient outcome) often creates which practical problem?",
    opts: ["The firm earns excessive profit", "The price falls below average cost, requiring a subsidy to keep the firm viable", "Quantity demanded falls to zero"],
    correct: 1,
    exp: "For a natural monopoly with high fixed costs, marginal-cost pricing frequently doesn't cover average cost, meaning the firm would need a government subsidy to remain financially viable."
  }
];

(function(){
  const shell = document.getElementById('quizShell');
  if (!shell) return;
  let current = 0;
  let score = 0;
  const answered = new Array(QUIZ.length).fill(null);

  function renderQuestion(){
    const item = QUIZ[current];
    let html = `<div class="quiz-progress">Question ${current+1} of ${QUIZ.length} &nbsp;·&nbsp; Score so far: ${score}</div>`;
    html += `<div class="quiz-q">${item.q}</div>`;
    html += `<div class="opt-list" id="quizOpts">`;
    item.opts.forEach((opt, i) => {
      html += `<button class="opt-btn" data-i="${i}">${opt}</button>`;
    });
    html += `</div>`;
    html += `<div class="quiz-explain" id="quizExplain">${item.exp}</div>`;
    html += `<div class="quiz-nav">
      <button class="btn ghost" id="quizPrev" ${current===0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn" id="quizNext" disabled>${current === QUIZ.length-1 ? 'See score' : 'Next →'}</button>
    </div>`;
    shell.innerHTML = html;

    const opts = shell.querySelectorAll('.opt-btn');
    const explain = document.getElementById('quizExplain');
    const nextBtn = document.getElementById('quizNext');
    const prevBtn = document.getElementById('quizPrev');

    if (answered[current] !== null){
      opts.forEach(btn => {
        btn.disabled = true;
        const i = +btn.dataset.i;
        if (i === item.correct) btn.classList.add('correct');
        else if (i === answered[current]) btn.classList.add('incorrect');
      });
      explain.classList.add('show');
      nextBtn.disabled = false;
    }

    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered[current] !== null) return;
        const i = +btn.dataset.i;
        answered[current] = i;
        if (i === item.correct) score++;
        if (typeof cfaRecordAnswer === "function" && item.concept){
          cfaRecordAnswer(item.concept, "Firm & Market Organization", i === item.correct);
        }
        opts.forEach(b => {
          b.disabled = true;
          const bi = +b.dataset.i;
          if (bi === item.correct) b.classList.add('correct');
          else if (bi === i) b.classList.add('incorrect');
        });
        explain.classList.add('show');
        nextBtn.disabled = false;
        markSectionProgress('sec-quiz');
      });
    });

    nextBtn.addEventListener('click', () => {
      if (current < QUIZ.length - 1){ current++; renderQuestion(); }
      else { renderScore(); }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){ current--; renderQuestion(); }
    });
  }

  function renderScore(){
    const pct = Math.round((score / QUIZ.length) * 100);
    let msg = "Solid foundation — review the sections you missed and try again.";
    if (pct >= 90) msg = "Excellent — you've genuinely internalized this reading.";
    else if (pct >= 70) msg = "Good work — a couple of gaps worth revisiting.";
    shell.innerHTML = `
      <div class="quiz-score">
        <div style="font-family:var(--font-mono); font-size:.8rem; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.08em;">Final score</div>
        <div class="big">${score} / ${QUIZ.length}</div>
        <p style="max-width:46ch; margin:10px auto 22px; color:var(--ink-soft);">${msg}</p>
        <button class="btn" id="quizRestart">Retake the quiz</button>
      </div>`;
    document.getElementById('quizRestart').addEventListener('click', () => {
      current = 0; score = 0;
      answered.fill(null);
      renderQuestion();
    });
  }

  renderQuestion();
})();

  } catch(e) { console.warn('[firm-market] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: flashcards
   ============================================================ */
(function(){
  try {
// ============================================================
// Flashcards — 132 cards, 2 per concept, across all 9 modules
// Self-assessment feeds the shared diagnostics system
// ============================================================

const FLASHCARDS = [
  // ===== Economics Foundations =====
  { cat:"Economics Foundations", concept:"Scarcity & Opportunity Cost",
    front:"What is opportunity cost?", back:"The value of the next-best alternative given up when you make a choice — not just cash spent, but everything forgone." },
  { cat:"Economics Foundations", concept:"Scarcity & Opportunity Cost",
    front:"Why does scarcity exist even for a billionaire?", back:"Scarcity is about resources being limited relative to unlimited wants — unlimited money still can't buy unlimited time or attention." },

  { cat:"Economics Foundations", concept:"Factors of Production & Economic Systems",
    front:"Name the four factors of production.", back:"Land, Labor, Capital, and Entrepreneurship." },
  { cat:"Economics Foundations", concept:"Factors of Production & Economic Systems",
    front:"What's the difference between a market economy and a command economy?", back:"A market economy lets prices (set by supply and demand) drive decisions with private ownership; a command economy has a central authority plan and direct production." },

  { cat:"Economics Foundations", concept:"The Production Possibilities Frontier",
    front:"What does a point INSIDE the PPF represent?", back:"Inefficiency — resources are unemployed or misallocated. More of both goods could be produced without any new resources." },
  { cat:"Economics Foundations", concept:"The Production Possibilities Frontier",
    front:"What causes the PPF to shift outward?", back:"Genuine economic growth — more resources (capital, labor) or better technology." },

  { cat:"Economics Foundations", concept:"Microeconomics vs. Macroeconomics",
    front:"Microeconomics vs. macroeconomics — what's the scale difference?", back:"Microeconomics studies individual decision-makers (a household, a firm, a market). Macroeconomics studies the whole economy (aggregate output, inflation, employment)." },
  { cat:"Economics Foundations", concept:"Microeconomics vs. Macroeconomics",
    front:"Which CFA prerequisite modules are microeconomics, and which are macroeconomics?", back:"E1 (Demand & Supply) and E2 (Firm & Market) are microeconomics. E3 through E7 (GDP through Currency) are macroeconomics." },

  { cat:"Economics Foundations", concept:"Positive vs. Normative Economics",
    front:"What's the difference between a positive and a normative economic statement?", back:"Positive: a testable, factual claim about cause and effect. Normative: a value judgment about what should happen." },
  { cat:"Economics Foundations", concept:"Positive vs. Normative Economics",
    front:"Quick test: how do you spot a normative statement?", back:"It usually contains or implies the word \"should.\"" },

  { cat:"Economics Foundations", concept:"Reading a Graph — Movements vs. Shifts",
    front:"What causes a MOVEMENT along a demand curve?", back:"A change in the variable that's actually on one of the curve's own axes — for demand, that's price." },
  { cat:"Economics Foundations", concept:"Reading a Graph — Movements vs. Shifts",
    front:"What causes a SHIFT of an entire demand curve?", back:"A change in anything NOT on either axis — income, tastes, related goods' prices, expectations." },

  { cat:"Economics Foundations", concept:"The Circular Flow of Income",
    front:"Name the four sectors in the full circular flow model.", back:"Households, Firms, Government, and the Foreign Sector." },
  { cat:"Economics Foundations", concept:"The Circular Flow of Income",
    front:"How does GDP = C+I+G+(X−M) relate to the circular flow diagram?", back:"Each term is one of the flows in the diagram — it's the same picture, written as an equation." },

  // ===== Demand & Supply Analysis =====
  { cat:"Demand & Supply Analysis", concept:"The Demand Function & Curve",
    front:"What is the inverse demand function?", back:"Price written as a function of quantity — it's what actually gets plotted as the demand curve, with price on the vertical axis." },
  { cat:"Demand & Supply Analysis", concept:"The Demand Function & Curve",
    front:"In a demand function, what does a negative coefficient on the good's own price reflect?", back:"The law of demand — as price rises, quantity demanded falls." },

  { cat:"Demand & Supply Analysis", concept:"Price Elasticity of Demand",
    front:"Give the formula for price elasticity of demand.", back:"E = (ΔQ/ΔP) × (P/Q) — the percentage change in quantity demanded divided by the percentage change in price." },
  { cat:"Demand & Supply Analysis", concept:"Price Elasticity of Demand",
    front:"If demand is elastic and price falls, what happens to total expenditure?", back:"It rises — quantity rises proportionally more than price falls." },

  { cat:"Demand & Supply Analysis", concept:"What Drives Elasticity?",
    front:"Name two factors that make demand MORE elastic.", back:"Many close substitutes, and more time for buyers to adjust (long run vs. short run)." },
  { cat:"Demand & Supply Analysis", concept:"What Drives Elasticity?",
    front:"Does demand tend to be more elastic in the short run or the long run?", back:"The long run — more time lets buyers find substitutes and adjust habits." },

  { cat:"Demand & Supply Analysis", concept:"Income & Cross-Price Elasticity",
    front:"A negative income elasticity means the good is what kind of good?", back:"An inferior good — quantity demanded falls as income rises." },
  { cat:"Demand & Supply Analysis", concept:"Income & Cross-Price Elasticity",
    front:"A positive cross-price elasticity means two goods are what?", back:"Substitutes — a price rise in one increases demand for the other." },

  { cat:"Demand & Supply Analysis", concept:"Substitution & Income Effects",
    front:"For a NORMAL good, do the substitution and income effects reinforce or fight each other when price falls?", back:"Reinforce — cheaper relative price and higher real income both raise demand." },
  { cat:"Demand & Supply Analysis", concept:"Substitution & Income Effects",
    front:"Does \"inferior good\" mean the product is low quality?", back:"No — it's a technical term about income elasticity direction, not product quality." },

  { cat:"Demand & Supply Analysis", concept:"Marginal Returns & Productivity",
    front:"How do you calculate marginal product?", back:"MP = ΔTP/ΔL — the change in total product divided by the change in labor." },
  { cat:"Demand & Supply Analysis", concept:"Marginal Returns & Productivity",
    front:"What does it mean when marginal product turns negative?", back:"Adding another worker actually reduces total output — a clear signal to stop hiring." },

  { cat:"Demand & Supply Analysis", concept:"Marginal Revenue & Profit Max",
    front:"Under perfect competition, what does MR equal?", back:"MR = Price. A price-taking firm can sell any quantity at the market price." },
  { cat:"Demand & Supply Analysis", concept:"Marginal Revenue & Profit Max",
    front:"What is the universal profit-maximization rule?", back:"Produce where MR = MC (and MC is not falling)." },

  { cat:"Demand & Supply Analysis", concept:"Cost Curves & Breakeven",
    front:"What's the breakeven condition for a firm?", back:"Price = ATC (average total cost) — equivalently, TR = TC." },
  { cat:"Demand & Supply Analysis", concept:"Cost Curves & Breakeven",
    front:"What's the shutdown condition for a firm?", back:"Price = AVC (average variable cost). Below this, the firm loses less by shutting down entirely." },

  // ===== Firm & Market Organization =====
  { cat:"Firm & Market Organization", concept:"Four Market Structures",
    front:"What distinguishes perfect competition from monopoly?", back:"Perfect competition: many sellers, identical products, no pricing power. Monopoly: one seller, unique product, considerable pricing power." },
  { cat:"Firm & Market Organization", concept:"Four Market Structures",
    front:"Which market structure has the lowest barriers to entry?", back:"Perfect competition." },

  { cat:"Firm & Market Organization", concept:"Elasticity & Revenue",
    front:"At what output level is total revenue maximized?", back:"Where marginal revenue (MR) equals zero." },
  { cat:"Firm & Market Organization", concept:"Elasticity & Revenue",
    front:"Give the formula linking marginal revenue to elasticity.", back:"MR = P × [1 − (1/E)]." },

  { cat:"Firm & Market Organization", concept:"Consumer Surplus",
    front:"How do you calculate consumer surplus?", back:"CS = ½ × Quantity × (price-axis intercept − Price) — the area of the triangle above price, below the demand curve." },
  { cat:"Firm & Market Organization", concept:"Consumer Surplus",
    front:"What is consumer surplus, in plain words?", back:"The gap between what buyers would have paid (value) and what they actually paid (expenditure)." },

  { cat:"Firm & Market Organization", concept:"Optimal Price & Output (Perfect Competition)",
    front:"What shape is an individual firm's demand curve under perfect competition?", back:"Perfectly horizontal (flat) at the market price — the firm is a price taker." },
  { cat:"Firm & Market Organization", concept:"Optimal Price & Output (Perfect Competition)",
    front:"Under perfect competition, what equality holds for a firm?", back:"P = AR = MR." },

  { cat:"Firm & Market Organization", concept:"Cost Curves & Long-Run Equilibrium",
    front:"What is a firm's economic profit in long-run perfect competition equilibrium?", back:"Exactly zero — free entry competes away any positive economic profit." },
  { cat:"Firm & Market Organization", concept:"Cost Curves & Long-Run Equilibrium",
    front:"What's the long-run equilibrium condition in perfect competition?", back:"P = MC = minimum ATC." },

  { cat:"Firm & Market Organization", concept:"Sources of Market Power",
    front:"Name four sources of monopoly power.", back:"Legal protection (patents), control of a critical resource, economies of scale (natural monopoly), and network effects." },
  { cat:"Firm & Market Organization", concept:"Sources of Market Power",
    front:"Why does a monopolist's MR curve fall twice as steeply as its demand curve?", back:"Selling one more unit forces the monopolist to lower price on every unit sold, not just the newest one." },

  { cat:"Firm & Market Organization", concept:"Optimal Price & Output (Monopoly)",
    front:"Why does a profit-maximizing monopolist always operate where demand is elastic?", back:"MR is only positive in the elastic region of a linear demand curve, and MC is positive at the optimum — so MR=MC can only happen there." },
  { cat:"Firm & Market Organization", concept:"Optimal Price & Output (Monopoly)",
    front:"How do you solve for a monopolist's optimal price directly from elasticity?", back:"P = MC / (1 − 1/E)." },

  { cat:"Firm & Market Organization", concept:"Price Discrimination",
    front:"What is a two-part tariff?", back:"A pricing structure with a fixed membership fee plus a per-unit charge, designed to extract consumer surplus." },
  { cat:"Firm & Market Organization", concept:"Price Discrimination",
    front:"Give an example of third-degree price discrimination.", back:"Charging different prices to different customer segments based on an observable trait — e.g., student vs. professional software pricing." },

  // ===== GDP, Income & Expenditure =====
  { cat:"GDP, Income & Expenditure", concept:"What Is GDP?",
    front:"What are the three equivalent ways to define GDP?", back:"Output, income, and expenditure — three names for the same number, since one person's spending is another's income." },
  { cat:"GDP, Income & Expenditure", concept:"What Is GDP?",
    front:"Why are transfer payments (like unemployment benefits) excluded from GDP?", back:"They move money without any corresponding new production." },

  { cat:"GDP, Income & Expenditure", concept:"The Value-Added Method",
    front:"How does the value-added method avoid double-counting?", back:"It sums only each stage's added value (selling price minus input cost), which equals the final good's price exactly once." },
  { cat:"GDP, Income & Expenditure", concept:"The Value-Added Method",
    front:"An intermediate good, like steel sold to a car maker, gets counted in GDP how?", back:"Not directly — its value is already embedded in the final product's (the car's) price." },

  { cat:"GDP, Income & Expenditure", concept:"Nominal vs. Real GDP",
    front:"What's the difference between nominal and real GDP?", back:"Nominal GDP uses current-year prices. Real GDP uses fixed base-year prices, so it only moves when actual output moves." },
  { cat:"GDP, Income & Expenditure", concept:"Nominal vs. Real GDP",
    front:"Give the formula for the GDP deflator.", back:"GDP deflator = (Nominal GDP / Real GDP) × 100." },

  { cat:"GDP, Income & Expenditure", concept:"The Components of GDP",
    front:"Give the expenditure approach formula for GDP.", back:"GDP = C + I + G + (X − M)." },
  { cat:"GDP, Income & Expenditure", concept:"The Components of GDP",
    front:"What's the relationship between MPC and MPS?", back:"MPC + MPS = 1 — every extra dollar of income is either consumed or saved." },

  { cat:"GDP, Income & Expenditure", concept:"Saving, Investment & the Trade Balance",
    front:"Give the fundamental macro identity linking saving, investment, government, and trade.", back:"S = I + (G−T) + (X−M)." },
  { cat:"GDP, Income & Expenditure", concept:"Saving, Investment & the Trade Balance",
    front:"If a country's investment exceeds its private saving (balanced budget), what must be true of its trade balance?", back:"It must be running a trade deficit — the investment shortfall gets funded by foreign capital." },

  // ===== AD, AS & Economic Growth =====
  { cat:"AD, AS & Economic Growth", concept:"The Aggregate Demand Curve",
    front:"Name the three reasons AD slopes downward.", back:"The wealth effect, the interest rate effect, and the real exchange rate effect." },
  { cat:"AD, AS & Economic Growth", concept:"The Aggregate Demand Curve",
    front:"Explain the wealth effect in one sentence.", back:"Higher prices erode the real purchasing power of fixed nominal wealth, so people spend less." },

  { cat:"AD, AS & Economic Growth", concept:"The Aggregate Supply Curve",
    front:"Why is the long-run aggregate supply (LRAS) curve vertical?", back:"Wages and costs fully adjust to prices in the long run, so real output settles at potential GDP regardless of the price level." },
  { cat:"AD, AS & Economic Growth", concept:"The Aggregate Supply Curve",
    front:"Name the three AS curves by time horizon and their shapes.", back:"VSRAS (flat), SRAS (upward sloping), LRAS (vertical)." },

  { cat:"AD, AS & Economic Growth", concept:"Shifts in AD & AS",
    front:"An oil price shock shifts which curve, and which direction?", back:"Aggregate supply (AS), to the left — higher input costs reduce supply at every price level." },
  { cat:"AD, AS & Economic Growth", concept:"Shifts in AD & AS",
    front:"A central bank rate cut shifts which curve, and which direction?", back:"Aggregate demand (AD), to the right — lower rates boost investment spending at every price level." },

  { cat:"AD, AS & Economic Growth", concept:"Four Macroeconomic Equilibria",
    front:"What defines stagflation, and what causes it?", back:"Falling output with rising prices simultaneously — caused by a leftward shift in aggregate supply, not demand." },
  { cat:"AD, AS & Economic Growth", concept:"Four Macroeconomic Equilibria",
    front:"What's the difference between a recessionary gap and an inflationary gap?", back:"Recessionary: AD falls, output below potential, prices fall. Inflationary: AD rises, output above potential, prices rise." },

  { cat:"AD, AS & Economic Growth", concept:"The Production Function & Growth Accounting",
    front:"Give the growth accounting equation.", back:"Growth in potential GDP = Growth in TFP + WL(Growth in labor) + WK(Growth in capital)." },
  { cat:"AD, AS & Economic Growth", concept:"The Production Function & Growth Accounting",
    front:"Why can't an economy sustain growth by adding capital alone?", back:"Diminishing marginal productivity — each added unit of capital, with labor fixed, contributes progressively less." },

  { cat:"AD, AS & Economic Growth", concept:"Measures of Sustainable Growth",
    front:"How is labor productivity calculated?", back:"Labor productivity = Real GDP / Aggregate hours worked." },
  { cat:"AD, AS & Economic Growth", concept:"Measures of Sustainable Growth",
    front:"Why do developing countries often have faster productivity GROWTH than developed ones, despite a lower LEVEL?", back:"They start from a lower capital base, where diminishing returns haven't yet reduced the payoff from new capital — the convergence pattern." },

  // ===== Business Cycles =====
  { cat:"Business Cycles", concept:"Consumer Behavior",
    front:"Which spending category is most cyclically sensitive, and why?", back:"Durable goods — they can be kept longer through repairs, so replacement is easy to postpone." },
  { cat:"Business Cycles", concept:"Consumer Behavior",
    front:"What does services spending track most closely?", back:"Permanent income — the household's durable sense of financial security, not one-off windfalls." },

  { cat:"Business Cycles", concept:"Housing & Business Investment",
    front:"Why is housing demand unusually sensitive to interest rates?", back:"Most home purchases are mortgage-financed, so borrowing costs directly affect affordability." },
  { cat:"Business Cycles", concept:"Housing & Business Investment",
    front:"What's the single most cyclically volatile GDP component?", back:"Business investment." },

  { cat:"Business Cycles", concept:"External Trade",
    front:"What drives a country's exports?", back:"Economic conditions in trading partner countries, not domestic conditions." },
  { cat:"Business Cycles", concept:"External Trade",
    front:"What happens to a country's trade balance when its currency appreciates?", back:"It tends to worsen — imports become cheaper, exports become more expensive abroad." },

  { cat:"Business Cycles", concept:"Types & Measures",
    front:"Give the unemployment rate formula.", back:"Unemployment rate = Unemployed / Labor force." },
  { cat:"Business Cycles", concept:"Types & Measures",
    front:"Is a discouraged worker counted as unemployed?", back:"No — they're excluded from the labor force entirely, and don't appear in the official unemployment rate." },

  { cat:"Business Cycles", concept:"Why It Lags the Cycle",
    front:"Why is the unemployment rate a lagging indicator?", back:"Firms are slow to change headcount, and discouraged workers re-enter the labor force with a delay during recoveries." },
  { cat:"Business Cycles", concept:"Why It Lags the Cycle",
    front:"Name an earlier signal of labor market weakness than the unemployment rate.", back:"Overtime hours and temporary staffing levels — cut before full-time headcount." },

  { cat:"Business Cycles", concept:"Inflation, Deflation & Hyperinflation",
    front:"What's the difference between disinflation and deflation?", back:"Disinflation: inflation is still positive, just slowing. Deflation: the price level is actually falling (negative inflation)." },
  { cat:"Business Cycles", concept:"Inflation, Deflation & Hyperinflation",
    front:"Why is deflation dangerous?", back:"It raises the real burden of fixed nominal debt, prompting spending cuts that deepen the downturn — a vicious spiral." },

  { cat:"Business Cycles", concept:"Measuring Inflation",
    front:"Does a fixed-basket (Laspeyres) price index overstate or understate true inflation?", back:"Overstate — due to substitution, quality, and new product biases, all pushing the same direction." },
  { cat:"Business Cycles", concept:"Measuring Inflation",
    front:"What is substitution bias?", back:"A fixed basket doesn't capture buyers shifting to cheaper substitutes when a good's price rises, overstating the true cost-of-living increase." },

  { cat:"Business Cycles", concept:"Cost-Push vs. Demand-Pull",
    front:"What signals cost-push inflation?", back:"Wages growing faster than productivity, raising unit labor costs (ULC = W/O) and squeezing margins." },
  { cat:"Business Cycles", concept:"Cost-Push vs. Demand-Pull",
    front:"What signals demand-pull inflation?", back:"Actual GDP running close to or above potential GDP, creating capacity bottlenecks." },

  { cat:"Business Cycles", concept:"Leading, Coincident & Lagging Indicators",
    front:"Give an example of a leading economic indicator.", back:"The yield curve spread (long-term minus short-term rates) — it reflects forward-looking market expectations." },
  { cat:"Business Cycles", concept:"Leading, Coincident & Lagging Indicators",
    front:"Give an example of a coincident economic indicator.", back:"Industrial production or non-agricultural employment — they move in step with the broader economy." },

  { cat:"Business Cycles", concept:"Theories of the Business Cycle",
    front:"What does Real Business Cycle (RBC) theory attribute fluctuations to?", back:"Shifts in aggregate supply (technology, input costs) — with minimal need for government intervention." },
  { cat:"Business Cycles", concept:"Theories of the Business Cycle",
    front:"What does Keynesian theory recommend for a demand-driven recession?", back:"Active fiscal or monetary stimulus to restore full employment and prevent a deflationary spiral." },

  // ===== Monetary & Fiscal Policy =====
  { cat:"Monetary & Fiscal Policy", concept:"Monetary vs. Fiscal Policy",
    front:"What's the key difference between monetary and fiscal policy?", back:"Monetary policy (central bank) manages money and credit. Fiscal policy (government) manages taxation and spending, and can redistribute income." },
  { cat:"Monetary & Fiscal Policy", concept:"Monetary vs. Fiscal Policy",
    front:"Why do government financing decisions move interest rates for everyone?", back:"Governments are typically the largest borrowers in world debt markets." },

  { cat:"Monetary & Fiscal Policy", concept:"Functions & Definitions of Money",
    front:"Name the three functions of money.", back:"Medium of exchange, store of wealth, and unit of account." },
  { cat:"Monetary & Fiscal Policy", concept:"Functions & Definitions of Money",
    front:"What's the difference between narrow money and broad money?", back:"Narrow money is cash and highly liquid deposits. Broad money adds a wider range of liquid assets, like savings accounts." },

  { cat:"Monetary & Fiscal Policy", concept:"The Money Creation Process",
    front:"Give the formula for the money multiplier.", back:"Money multiplier = 1 / Reserve requirement." },
  { cat:"Monetary & Fiscal Policy", concept:"The Money Creation Process",
    front:"Give the formula for total money created from a new deposit.", back:"Total money = New deposit / Reserve requirement." },

  { cat:"Monetary & Fiscal Policy", concept:"The Quantity Theory of Money",
    front:"Give the quantity equation of exchange.", back:"M × V = P × Y (money supply × velocity = price level × real output)." },
  { cat:"Monetary & Fiscal Policy", concept:"The Quantity Theory of Money",
    front:"What extra assumption turns the quantity equation into the quantity THEORY of money?", back:"That velocity (V) is roughly constant — meaning money growth translates almost directly into inflation." },

  { cat:"Monetary & Fiscal Policy", concept:"The Demand for Money",
    front:"Which of the three money-demand motives is most interest-rate sensitive?", back:"Speculative demand — it reflects the opportunity cost of holding cash versus interest-bearing assets." },
  { cat:"Monetary & Fiscal Policy", concept:"The Demand for Money",
    front:"Name the three motives for holding money.", back:"Transactions-related, precautionary, and speculative." },

  { cat:"Monetary & Fiscal Policy", concept:"Money Market Equilibrium",
    front:"Why is the money supply (MS) curve drawn as vertical?", back:"The nominal quantity of money at any given moment is treated as fixed, regardless of the interest rate." },
  { cat:"Monetary & Fiscal Policy", concept:"Money Market Equilibrium",
    front:"If the interest rate is above equilibrium, what happens in the money market?", back:"Excess supply of money — people buy bonds with the surplus, pushing bond prices up and rates back down." },

  { cat:"Monetary & Fiscal Policy", concept:"The Fisher Effect",
    front:"Give the Fisher effect formula.", back:"Rnominal = Rreal + expected inflation (πe)." },
  { cat:"Monetary & Fiscal Policy", concept:"The Fisher Effect",
    front:"What concept does the Fisher effect rely on?", back:"Money neutrality — in the long run, money supply changes affect nominal prices but not real variables." },

  { cat:"Monetary & Fiscal Policy", concept:"The Costs of Inflation",
    front:"Which is more costly: expected or unexpected inflation?", back:"Unexpected inflation — it can't be planned for and redistributes real wealth unpredictably between borrowers and lenders." },
  { cat:"Monetary & Fiscal Policy", concept:"The Costs of Inflation",
    front:"When inflation is unexpectedly HIGH, who benefits — borrowers or lenders?", back:"Borrowers — the real value of their fixed nominal debt shrinks." },

  // ===== International Trade & Capital Flows =====
  { cat:"International Trade & Capital Flows", concept:"GDP vs. GNP & Basic Terms",
    front:"What's the difference between GDP and GNP?", back:"GDP counts output by location (within a country's borders). GNP counts output by ownership (a country's own citizens/companies, wherever they operate)." },
  { cat:"International Trade & Capital Flows", concept:"GDP vs. GNP & Basic Terms",
    front:"What's the difference between a trade surplus and a trade deficit?", back:"Surplus: exports exceed imports (lending to foreigners). Deficit: imports exceed exports (borrowing from foreigners)." },

  { cat:"International Trade & Capital Flows", concept:"Patterns & Trends in Trade",
    front:"What's the difference between FDI and FPI?", back:"FDI: direct investment in productive assets with operational control. FPI: shorter-term investment in foreign financial instruments, without control." },
  { cat:"International Trade & Capital Flows", concept:"Patterns & Trends in Trade",
    front:"What makes a firm a \"multinational corporation\"?", back:"Engaging in foreign direct investment — building or acquiring productive assets abroad with operational control." },

  { cat:"International Trade & Capital Flows", concept:"Absolute vs. Comparative Advantage",
    front:"What's the difference between absolute and comparative advantage?", back:"Absolute: producing with fewer resources, in absolute terms. Comparative: a lower opportunity cost than your trading partner." },
  { cat:"International Trade & Capital Flows", concept:"Absolute vs. Comparative Advantage",
    front:"Can a country gain from trade even with no absolute advantage in anything?", back:"Yes — as long as it has a comparative advantage (a lower opportunity cost) in something." },

  { cat:"International Trade & Capital Flows", concept:"The Gains from Trade",
    front:"What range of world prices allows both trading countries to gain?", back:"Any price strictly between the two countries' own autarkic (no-trade) prices." },
  { cat:"International Trade & Capital Flows", concept:"The Gains from Trade",
    front:"Is comparative advantage permanent?", back:"No — it shifts with capital accumulation, new technology, and resource discoveries." },

  { cat:"International Trade & Capital Flows", concept:"The Ricardian Model",
    front:"In the Ricardian model, what's the sole source of comparative advantage?", back:"Labor productivity, driven by differences in technology — labor is the model's only variable factor." },
  { cat:"International Trade & Capital Flows", concept:"The Ricardian Model",
    front:"Can comparative advantage in the Ricardian model be lost?", back:"Yes — as technology gaps close or a trading partner overtakes the original leader." },

  { cat:"International Trade & Capital Flows", concept:"The Heckscher–Ohlin Model",
    front:"What does the Heckscher-Ohlin model add beyond the Ricardian model?", back:"A second factor of production, capital — making relative factor endowments, not just technology, the source of comparative advantage." },
  { cat:"International Trade & Capital Flows", concept:"The Heckscher–Ohlin Model",
    front:"Which trade model allows trade to redistribute income within a country?", back:"Heckscher-Ohlin — with two factors, trade can benefit the abundant factor and hurt the scarce one." },

  { cat:"International Trade & Capital Flows", concept:"BOP Components",
    front:"Name the three components of the balance of payments.", back:"The current account, the capital account, and the financial account." },
  { cat:"International Trade & Capital Flows", concept:"BOP Components",
    front:"Which BOP sub-account records a worker's remittance sent home?", back:"Unilateral transfers, within the current account." },

  { cat:"International Trade & Capital Flows", concept:"The National Income Identity",
    front:"Give the current account formula in terms of national income.", back:"CA = X − M = Y − (C+I+G)." },
  { cat:"International Trade & Capital Flows", concept:"The National Income Identity",
    front:"What does a persistent current account deficit mean for a country?", back:"It's consuming more than it produces, financed by borrowing from abroad." },

  // ===== Currency Exchange Rates =====
  { cat:"Currency Exchange Rates", concept:"Size & Importance",
    front:"How large is the daily foreign exchange market?", back:"Roughly $5.1 trillion — the largest financial market in the world, far bigger than global bond or equity markets." },
  { cat:"Currency Exchange Rates", concept:"Size & Importance",
    front:"Is a purely domestic-stock investor exposed to FX markets?", back:"Yes, indirectly — through the foreign revenue and competition faced by the domestic companies they hold." },

  { cat:"Currency Exchange Rates", concept:"Nominal & Real Exchange Rates",
    front:"What does the real exchange rate adjust for, that the nominal rate doesn't?", back:"Relative price levels (inflation) between the two countries — capturing true purchasing power." },
  { cat:"Currency Exchange Rates", concept:"Nominal & Real Exchange Rates",
    front:"When has a currency \"appreciated\"?", back:"When it buys more of another currency than it did before." },

  { cat:"Currency Exchange Rates", concept:"Spot, Forward & FX Swaps",
    front:"When does a spot FX transaction typically settle?", back:"About two business days after the trade (T+2)." },
  { cat:"Currency Exchange Rates", concept:"Spot, Forward & FX Swaps",
    front:"What is an FX swap?", back:"A spot transaction combined with an offsetting forward transaction — often used to roll a forward position to a new date." },

  { cat:"Currency Exchange Rates", concept:"Hedging a Foreign Investment",
    front:"In a hedged foreign bond strategy, what specifically eliminates currency risk?", back:"Locking in the exchange rate today via a forward contract, rather than relying on the future spot rate." },
  { cat:"Currency Exchange Rates", concept:"Hedging a Foreign Investment",
    front:"What are the three steps in a hedged carry-trade calculation?", back:"1) Convert at spot. 2) Earn the foreign interest rate. 3) Convert back at the locked-in forward rate." },

  { cat:"Currency Exchange Rates", concept:"% Change in Currency Value",
    front:"Give the formula for percentage change in an exchange rate.", back:"%Δ = (New rate − Old rate) / Old rate." },
  { cat:"Currency Exchange Rates", concept:"% Change in Currency Value",
    front:"If Currency A depreciates 10% against B, does B need to appreciate exactly 10% to reverse it?", back:"No — because the percentage bases differ, B needs to appreciate about 11.1% to fully reverse a 10% depreciation." },

  { cat:"Currency Exchange Rates", concept:"The Elasticities Approach",
    front:"What does the Marshall-Lerner condition tell you?", back:"Whether a currency devaluation will actually improve a country's trade balance, based on export and import demand elasticities." },
  { cat:"Currency Exchange Rates", concept:"The Elasticities Approach",
    front:"Give the generalized Marshall-Lerner condition.", back:"ωX·εX + ωM·(εM − 1) > 0." },
];

/* ============================================================
   Flashcard engine — flip, filter, shuffle, self-assessment
   ============================================================ */
(function(){
  const cardArea = document.getElementById('cardArea');
  const moduleSelect = document.getElementById('moduleSelect');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const deckProgress = document.getElementById('deckProgress');
  const deckFill = document.getElementById('deckFill');
  if (!cardArea || !moduleSelect) return;

  // Populate module filter options
  const categories = [...new Set(FLASHCARDS.map(c => c.cat))];
  categories.forEach(cat => {
    const count = FLASHCARDS.filter(c => c.cat === cat).length;
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = `${cat} (${count} cards)`;
    moduleSelect.appendChild(opt);
  });

  function shuffleArr(arr){
    const a = [...arr];
    for (let i=a.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }

  let deck = shuffleArr(FLASHCARDS);
  let index = 0;
  let flipped = false;
  let assessedThisCard = false;
  let reviewedCount = 0;
  const reviewedSet = new Set();

  function currentFilter(){ return moduleSelect.value; }

  function applyFilter(){
    const f = currentFilter();
    const source = f === 'all' ? FLASHCARDS : FLASHCARDS.filter(c => c.cat === f);
    deck = shuffleArr(source);
    index = 0;
    reviewedCount = 0;
    reviewedSet.clear();
    render();
  }

  function render(){
    if (deck.length === 0){
      cardArea.innerHTML = `<div class="empty-deck">No cards in this selection.</div>`;
      deckProgress.textContent = '';
      deckFill.style.width = '0%';
      return;
    }
    const card = deck[index];
    flipped = false;
    assessedThisCard = false;

    cardArea.innerHTML = `
      <div class="card-scene">
        <div class="flashcard" id="flashcardEl">
          <div class="card-face card-front">
            <div class="card-tag">${card.cat}</div>
            <div class="card-text">${card.front}</div>
            <div class="card-hint">Tap to flip</div>
          </div>
          <div class="card-face card-back">
            <div class="card-tag">${card.concept}</div>
            <div class="card-text">${card.back}</div>
            <div class="card-hint">Tap to flip back</div>
          </div>
        </div>
      </div>
      <div class="self-assess-row">
        <button class="assess-btn still-learning" id="stillLearningBtn">Still learning</button>
        <button class="assess-btn got-it" id="gotItBtn">Got it ✓</button>
      </div>
      <div class="nav-row">
        <button class="nav-btn" id="prevBtn" ${index===0 ? 'disabled' : ''}>← Previous</button>
        <span class="nav-counter">${index+1} / ${deck.length}</span>
        <button class="nav-btn" id="nextBtn" ${index===deck.length-1 ? 'disabled' : ''}>Next →</button>
      </div>
    `;

    const flashcardEl = document.getElementById('flashcardEl');
    flashcardEl.addEventListener('click', () => {
      flipped = !flipped;
      flashcardEl.classList.toggle('flipped', flipped);
      if (flipped){
        document.getElementById('stillLearningBtn').classList.add('show');
        document.getElementById('gotItBtn').classList.add('show');
      }
    });

    function assess(gotIt){
      if (assessedThisCard) return;
      assessedThisCard = true;
      if (typeof cfaRecordAnswer === 'function'){
        cfaRecordAnswer(card.concept, card.cat, gotIt);
      }
      if (!reviewedSet.has(index)){
        reviewedSet.add(index);
        reviewedCount++;
      }
      updateProgress();
      // auto-advance after a short pause
      setTimeout(() => {
        if (index < deck.length - 1){ index++; render(); }
      }, 350);
    }

    document.getElementById('stillLearningBtn').addEventListener('click', (e) => { e.stopPropagation(); assess(false); });
    document.getElementById('gotItBtn').addEventListener('click', (e) => { e.stopPropagation(); assess(true); });

    document.getElementById('prevBtn').addEventListener('click', () => {
      if (index > 0){ index--; render(); }
    });
    document.getElementById('nextBtn').addEventListener('click', () => {
      if (index < deck.length - 1){ index++; render(); }
    });

    updateProgress();
  }

  function updateProgress(){
    const pct = deck.length > 0 ? Math.round((reviewedCount/deck.length)*100) : 0;
    deckProgress.textContent = `${reviewedCount} of ${deck.length} cards reviewed this session`;
    deckFill.style.width = pct + '%';
  }

  moduleSelect.addEventListener('change', applyFilter);
  shuffleBtn.addEventListener('click', () => {
    deck = shuffleArr(deck);
    index = 0;
    render();
  });

  render();
})();

  } catch(e) { console.warn('[flashcards] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: gdp-income
   ============================================================ */
(function(){
  try {
// ============================================================
// GDP, Income & Expenditure (Part 1) — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }
function parseNums(str){
  return str.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
}
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}
function fmtBig(n){
  if (Math.abs(n) >= 1e9) return (n/1e9).toFixed(2)+'B';
  if (Math.abs(n) >= 1e6) return (n/1e6).toFixed(2)+'M';
  if (Math.abs(n) >= 1e3) return (n/1e3).toFixed(2)+'K';
  return fmt(n,2);
}

/* ============================================================
   01 — Circular flow diagram (static)
   ============================================================ */
(function(){
  const container = document.getElementById('circularFlowChart');
  if (!container) return;
  const W=480, H=220;
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'econ-svg', style:'max-width:520px;'});
  // households box
  svg.appendChild(svgEl('rect', {x:20, y:80, width:120, height:60, rx:8, fill:'#2B2560'}));
  const hLabel = svgEl('text', {x:80, y:114, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':11, fill:'#fff', 'font-weight':'700'});
  hLabel.textContent = 'Households';
  svg.appendChild(hLabel);
  // firms box
  svg.appendChild(svgEl('rect', {x:340, y:80, width:120, height:60, rx:8, fill:'#C77F1E'}));
  const fLabel = svgEl('text', {x:400, y:114, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':11, fill:'#fff', 'font-weight':'700'});
  fLabel.textContent = 'Firms';
  svg.appendChild(fLabel);
  // top arrow: labor/capital -> income £100
  svg.appendChild(svgEl('line', {x1:140, y1:90, x2:340, y2:90, stroke:'#2F8F6B', 'stroke-width':2, 'marker-end':'url(#arrow1)'}));
  const t1 = svgEl('text', {x:240, y:80, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#1c5b41'});
  t1.textContent = 'Income £100 ← Labor & Capital';
  svg.appendChild(t1);
  // bottom arrow: goods/services <- expenditure £100
  svg.appendChild(svgEl('line', {x1:340, y1:130, x2:140, y2:130, stroke:'#8B5CF6', 'stroke-width':2, 'marker-end':'url(#arrow2)'}));
  const t2 = svgEl('text', {x:240, y:150, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#5b3fa6'});
  t2.textContent = 'Goods & Services ← Expenditure £100';
  svg.appendChild(t2);
  // arrow markers
  const defs = svgEl('defs', {});
  const marker1 = svgEl('marker', {id:'arrow1', markerWidth:8, markerHeight:8, refX:6, refY:3, orient:'auto'});
  marker1.appendChild(svgEl('path', {d:'M0,0 L6,3 L0,6 Z', fill:'#2F8F6B'}));
  defs.appendChild(marker1);
  const marker2 = svgEl('marker', {id:'arrow2', markerWidth:8, markerHeight:8, refX:6, refY:3, orient:'auto'});
  marker2.appendChild(svgEl('path', {d:'M0,0 L6,3 L0,6 Z', fill:'#8B5CF6'}));
  defs.appendChild(marker2);
  svg.insertBefore(defs, svg.firstChild);
  container.appendChild(svg);
})();

/* ============================================================
   02 — Value-added calculator
   ============================================================ */
(function(){
  const input = document.getElementById('vaInput');
  const tableContainer = document.getElementById('vaTable');
  if (!input) return;
  function render(){
    const receipts = parseNums(input.value);
    let html = '<table class="exhibit" style="margin:0; min-width:320px;"><tr><th>Stage</th><th>Receipts</th><th>Value Added</th></tr>';
    let prev = 0, total = 0;
    receipts.forEach((r, i) => {
      const va = r - prev;
      total += va;
      html += `<tr><td>${i+1}</td><td class="num">${fmt(r,2)}</td><td class="num">${fmt(va,2)}</td></tr>`;
      prev = r;
    });
    html += `<tr><td><strong>Total</strong></td><td class="num">—</td><td class="num"><strong>${fmt(total,2)}</strong></td></tr>`;
    html += '</table>';
    tableContainer.innerHTML = html;
  }
  input.addEventListener('input', render);
  render();
})();

/* ============================================================
   03 — Nominal/Real GDP & deflator calculator
   ============================================================ */
(function(){
  const pBaseI = document.getElementById('gdpPBase'), pCurI = document.getElementById('gdpPCurrent');
  const qBaseI = document.getElementById('gdpQBase'), qCurI = document.getElementById('gdpQCurrent');
  const out = document.getElementById('gdpOut');
  if (!pBaseI) return;
  function render(){
    const pBase = parseFloat(pBaseI.value), pCur = parseFloat(pCurI.value);
    const qBase = parseFloat(qBaseI.value), qCur = parseFloat(qCurI.value);
    const nominal = pCur * qCur;
    const real = pBase * qCur;
    const deflator = (nominal/real) * 100;
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Nominal GDP</div><div class="v">${fmtBig(nominal)}</div></div>
      <div class="stat-readout"><div class="k">Real GDP</div><div class="v">${fmtBig(real)}</div></div>
      <div class="stat-readout"><div class="k">Deflator</div><div class="v">${fmt(deflator,1)}</div></div>
    `;
  }
  [pBaseI,pCurI,qBaseI,qCurI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   04 — GDP components calculator + bar chart
   ============================================================ */
(function(){
  const cI = document.getElementById('gcC'), iI = document.getElementById('gcI'),
        gI = document.getElementById('gcG'), nxI = document.getElementById('gcNX');
  const result = document.getElementById('gcResult');
  const chartContainer = document.getElementById('gcChart');
  if (!cI) return;
  function render(){
    const c = parseFloat(cI.value), i = parseFloat(iI.value), g = parseFloat(gI.value), nx = parseFloat(nxI.value);
    const gdp = c+i+g+nx;
    result.textContent = `GDP = ${fmtBig(gdp)}`;
    // stacked bar
    const parts = [
      {label:'C', val:c, color:'#2B2560'},
      {label:'I', val:i, color:'#2F8F6B'},
      {label:'G', val:g, color:'#C77F1E'},
      {label:'X−M', val:nx, color:'#8B5CF6'},
    ];
    const total = parts.reduce((a,p)=>a+Math.abs(p.val),0);
    const wrap = document.createElement('div');
    wrap.style.display='flex'; wrap.style.height='40px'; wrap.style.borderRadius='6px'; wrap.style.overflow='hidden';
    parts.forEach(p => {
      if (p.val === 0) return;
      const seg = document.createElement('div');
      seg.style.width = (Math.abs(p.val)/total*100)+'%';
      seg.style.background = p.color;
      seg.style.display='flex'; seg.style.alignItems='center'; seg.style.justifyContent='center';
      seg.style.color='#fff'; seg.style.fontFamily='var(--font-mono)'; seg.style.fontSize='.68rem'; seg.style.fontWeight='700';
      seg.title = `${p.label}: ${fmt(p.val,0)}`;
      seg.textContent = p.label;
      wrap.appendChild(seg);
    });
    chartContainer.innerHTML = '';
    chartContainer.appendChild(wrap);
  }
  [cI,iI,gI,nxI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   05 — Saving/Investment/Fiscal/Trade identity solver
   ============================================================ */
(function(){
  const sI = document.getElementById('idS'), iI = document.getElementById('idI'), gtI = document.getElementById('idGT');
  const result = document.getElementById('idResult'), steps = document.getElementById('idSteps');
  if (!sI) return;
  function render(){
    const s = parseFloat(sI.value), i = parseFloat(iI.value), gt = parseFloat(gtI.value);
    const xm = s - i - gt;
    result.textContent = `Trade balance (X−M) = ${fmt(xm,1)}%`;
    steps.textContent = `${s} = ${i} + ${gt} + (X−M) → X−M = ${fmt(xm,1)}%`;
  }
  [sI,iI,gtI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   Check-in mini quizzes
   ============================================================ */
(function(){
  document.querySelectorAll('.checkin').forEach(box => {
    const btns = box.querySelectorAll('.opt-btn');
    const feedback = box.querySelector('.checkin-feedback');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btns.forEach(b => b.disabled = true);
        btns.forEach(b => { if (b.dataset.correct === 'true') b.classList.add('correct'); });
        if (btn.dataset.correct !== 'true') btn.classList.add('incorrect');
        feedback.classList.add('show');
        markSectionProgress(box.closest('section').id);
      });
    });
  });
})();

/* ============================================================
   Sidebar scroll-spy + progress + mobile toggle
   ============================================================ */
const sectionIds = ['sec-gdpdefinition','sec-valueadded','sec-nominalreal','sec-components','sec-savingidentity','sec-quiz'];
const visited = new Set();

function markSectionProgress(id){
  if (sectionIds.includes(id)){
    visited.add(id);
    updateProgress();
  }
}
function updateProgress(){
  const pct = Math.round((visited.size / sectionIds.length) * 100);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressPct');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
  sectionIds.forEach(id => {
    const link = document.querySelector(`.toc a[data-sec="${id}"]`);
    if (link && visited.has(id)) link.classList.add('done');
  });
  try { localStorage.setItem('cfa-progress-gdp-income', String(pct)); } catch(e) {}
}

(function(){
  const links = document.querySelectorAll('.toc a[data-sec]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.toc a[data-sec="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting){
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        markSectionProgress(id);
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle){
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.querySelectorAll('.toc a').forEach(a => a.addEventListener('click', () => sidebar.classList.remove('open')));
  }
})();

/* ============================================================
   QUIZ
   ============================================================ */
const QUIZ = [
  {
    concept: "What Is GDP?",
    q: "GDP can be measured using which two approaches that yield the same result?",
    opts: ["Income and expenditure", "Profit and loss", "Supply and demand"],
    correct: 0,
    exp: "The income approach (summing all income earned) and the expenditure approach (summing all spending) must yield identical totals, since one person's spending is another's income."
  },
  {
    concept: "What Is GDP?",
    q: "A person spends 3 hours per week doing their own home repairs instead of hiring a contractor. How does this affect GDP?",
    opts: ["It increases GDP by the market value of the repairs", "It has no effect on GDP, since no market transaction occurred", "It decreases GDP"],
    correct: 1,
    exp: "GDP only counts market transactions with an observable price. Unpaid household labor, however valuable, is excluded."
  },
  {
    concept: "The Value-Added Method",
    q: "A steel producer sells $2,000 of steel to a car manufacturer, who uses it (plus other inputs) to build a car sold for $30,000. What is the steel's direct contribution to GDP?",
    opts: ["$2,000, counted separately", "$0 directly — its value is embedded in the car's final $30,000 price", "$32,000"],
    correct: 1,
    exp: "The steel is an intermediate good; only the final sale price of the car counts toward GDP, and the steel's value is already included within it."
  },
  {
    concept: "Nominal vs. Real GDP",
    q: "A country produced identical output in two consecutive years, but prices rose 5%. What happened to nominal GDP and real GDP respectively?",
    opts: ["Both rose 5%", "Nominal GDP rose 5%, real GDP was unchanged", "Nominal GDP was unchanged, real GDP fell 5%"],
    correct: 1,
    exp: "Nominal GDP reflects current prices, so it rises with inflation even with flat output. Real GDP, using fixed base-year prices, only moves when actual output moves — so it stays flat."
  },
  {
    concept: "Nominal vs. Real GDP",
    q: "The GDP deflator is calculated as:",
    opts: ["(Real GDP / Nominal GDP) × 100", "(Nominal GDP / Real GDP) × 100", "Nominal GDP − Real GDP"],
    correct: 1,
    exp: "GDP deflator = (Nominal GDP / Real GDP) × 100 — it measures how much of nominal GDP's change is due to price changes rather than real output changes."
  },
  {
    concept: "Nominal vs. Real GDP",
    q: "If nominal GDP grew 8% and the GDP deflator rose from 100 to 103, approximately what was real GDP growth?",
    opts: ["11%", "About 5%", "8%"],
    correct: 1,
    exp: "Real GDP growth ≈ nominal growth − inflation ≈ 8% − 3% = 5%."
  },
  {
    concept: "The Components of GDP",
    q: "In the expenditure approach, GDP = C + I + G + (X − M). What does the 'I' represent?",
    opts: ["Interest payments on government debt", "Business investment in capital goods plus inventory changes", "Individual income tax revenue"],
    correct: 1,
    exp: "I is gross private domestic investment — spending on capital goods (plant, equipment) plus the change in business inventories."
  },
  {
    concept: "The Components of GDP",
    q: "A household's marginal propensity to consume (MPC) is 0.6. What is its marginal propensity to save (MPS)?",
    opts: ["0.6", "0.4", "1.6"],
    correct: 1,
    exp: "MPC + MPS = 1, so MPS = 1 − 0.6 = 0.4."
  },
  {
    concept: "The Components of GDP",
    q: "Which factor is the primary driver of consumption spending, according to the standard consumption function C = C(Y−T)?",
    opts: ["The unemployment rate", "Disposable income", "The exchange rate"],
    correct: 1,
    exp: "The consumption function models spending as primarily determined by disposable income (GDP minus net taxes)."
  },
  {
    concept: "The Components of GDP",
    q: "Investment spending (I) is modeled as a function of which two factors?",
    opts: ["The real interest rate and aggregate output", "The unemployment rate and exports", "Consumer confidence and the GDP deflator alone"],
    correct: 0,
    exp: "I = I(r, Y): investment falls as the real interest rate rises (higher cost of financing) and rises with aggregate output (a proxy for expected profitability)."
  },
  {
    concept: "Saving, Investment & the Trade Balance",
    q: "The fundamental macroeconomic identity linking saving, investment, the fiscal balance, and the trade balance is:",
    opts: ["S = I + (G − T) + (X − M)", "S = I − (G − T) − (X − M)", "S = C + I + G"],
    correct: 0,
    exp: "This identity shows domestic private saving is absorbed by investment, government deficit financing, or net foreign lending (a trade surplus)."
  },
  {
    concept: "Saving, Investment & the Trade Balance",
    q: "A country has private saving of 20% of GDP, investment of 22% of GDP, and a balanced government budget. What must its trade balance be?",
    opts: ["A 2% of GDP trade surplus", "A 2% of GDP trade deficit", "Exactly balanced trade"],
    correct: 1,
    exp: "S = I + (G−T) + (X−M) → 20 = 22 + 0 + (X−M) → X−M = −2%, a trade deficit, since investment exceeds domestic saving and the gap must be funded by foreign capital."
  },
  {
    concept: "Saving, Investment & the Trade Balance",
    q: "A government fiscal deficit [(G−T)>0] must be offset by which combination, according to the macro identity?",
    opts: ["The private sector saving more than it invests, a trade deficit, or some mix of both", "Higher GDP growth alone", "A stronger currency"],
    correct: 0,
    exp: "Rearranging the identity: G−T = (S−I) − (X−M). A fiscal deficit requires either private saving to exceed investment, a trade deficit (foreign capital inflow), or both."
  },
  {
    concept: "What Is GDP?",
    q: "Which of these is EXCLUDED from GDP under the 'only current production' rule?",
    opts: ["A newly built house sold this year", "A used car resold this year", "A haircut purchased this year"],
    correct: 1,
    exp: "A used car was produced in a previous period; reselling it today doesn't represent new production, so it's excluded from this year's GDP."
  },
  {
    concept: "The Components of GDP",
    q: "Household consumption as a share of GDP tends to be higher in the United States (68%) than in Germany (52%). What does this suggest about US household spending behavior relative to Germany's?",
    opts: ["US households are less sensitive to changes in disposable income", "US households are more sensitive to changes in disposable income", "There is no meaningful difference"],
    correct: 1,
    exp: "A higher consumption share (approximating a higher average propensity to consume) suggests spending responds more strongly to changes in household income."
  },
  {
    concept: "What Is GDP?",
    q: "Why do national statistical agencies typically calculate GDP using both the income and expenditure approaches independently?",
    opts: ["It's legally required in all countries", "As a built-in consistency check, since both approaches must yield the same total", "Because the two approaches measure different things"],
    correct: 1,
    exp: "Since income and expenditure are two views of the same economic activity, computing both independently serves as a cross-check on data quality."
  },
  {
    concept: "The Value-Added Method",
    q: "A furniture maker buys $300 of wood and turns it into a table sold for $900. What is the value added at the furniture maker's stage?",
    opts: ["$900", "$600", "$300"],
    correct: 1,
    exp: "Value added = selling price − cost of inputs purchased = $900 − $300 = $600."
  },
  {
    concept: "What Is GDP?",
    q: "A capital gain from a stock price increase is:",
    opts: ["Included in GDP as investment income", "Excluded from GDP, since no new production occurred", "Included in GDP only if the stock is later sold"],
    correct: 1,
    exp: "Capital gains reflect asset revaluation, not newly produced goods or services, so they are excluded from GDP entirely."
  },
  {
    concept: "Nominal vs. Real GDP",
    q: "Real GDP per capita is often used as a proxy for:",
    opts: ["A country's population growth rate", "The average standard of living in a country", "The government's fiscal deficit"],
    correct: 1,
    exp: "Dividing real GDP by population adjusts for country size, making it a commonly used (if imperfect) measure of average material living standards."
  },
  {
    concept: "Saving, Investment & the Trade Balance",
    q: "If a country's investment (I) exceeds its private saving (S), with a balanced government budget, its trade balance must be:",
    opts: ["A trade surplus", "A trade deficit", "Impossible to have investment exceed saving"],
    correct: 1,
    exp: "Since S = I + (G−T) + (X−M), if I > S and (G−T)=0, then (X−M) must be negative — a trade deficit funding the investment shortfall via foreign capital."
  }
];

(function(){
  const shell = document.getElementById('quizShell');
  if (!shell) return;
  let current = 0;
  let score = 0;
  const answered = new Array(QUIZ.length).fill(null);

  function renderQuestion(){
    const item = QUIZ[current];
    let html = `<div class="quiz-progress">Question ${current+1} of ${QUIZ.length} &nbsp;·&nbsp; Score so far: ${score}</div>`;
    html += `<div class="quiz-q">${item.q}</div>`;
    html += `<div class="opt-list" id="quizOpts">`;
    item.opts.forEach((opt, i) => {
      html += `<button class="opt-btn" data-i="${i}">${opt}</button>`;
    });
    html += `</div>`;
    html += `<div class="quiz-explain" id="quizExplain">${item.exp}</div>`;
    html += `<div class="quiz-nav">
      <button class="btn ghost" id="quizPrev" ${current===0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn" id="quizNext" disabled>${current === QUIZ.length-1 ? 'See score' : 'Next →'}</button>
    </div>`;
    shell.innerHTML = html;

    const opts = shell.querySelectorAll('.opt-btn');
    const explain = document.getElementById('quizExplain');
    const nextBtn = document.getElementById('quizNext');
    const prevBtn = document.getElementById('quizPrev');

    if (answered[current] !== null){
      opts.forEach(btn => {
        btn.disabled = true;
        const i = +btn.dataset.i;
        if (i === item.correct) btn.classList.add('correct');
        else if (i === answered[current]) btn.classList.add('incorrect');
      });
      explain.classList.add('show');
      nextBtn.disabled = false;
    }

    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered[current] !== null) return;
        const i = +btn.dataset.i;
        answered[current] = i;
        if (i === item.correct) score++;
        if (typeof cfaRecordAnswer === "function" && item.concept){
          cfaRecordAnswer(item.concept, "GDP, Income & Expenditure", i === item.correct);
        }
        opts.forEach(b => {
          b.disabled = true;
          const bi = +b.dataset.i;
          if (bi === item.correct) b.classList.add('correct');
          else if (bi === i) b.classList.add('incorrect');
        });
        explain.classList.add('show');
        nextBtn.disabled = false;
        markSectionProgress('sec-quiz');
      });
    });

    nextBtn.addEventListener('click', () => {
      if (current < QUIZ.length - 1){ current++; renderQuestion(); }
      else { renderScore(); }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){ current--; renderQuestion(); }
    });
  }

  function renderScore(){
    const pct = Math.round((score / QUIZ.length) * 100);
    let msg = "Solid foundation — review the sections you missed and try again.";
    if (pct >= 90) msg = "Excellent — you've genuinely internalized this reading.";
    else if (pct >= 70) msg = "Good work — a couple of gaps worth revisiting.";
    shell.innerHTML = `
      <div class="quiz-score">
        <div style="font-family:var(--font-mono); font-size:.8rem; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.08em;">Final score</div>
        <div class="big">${score} / ${QUIZ.length}</div>
        <p style="max-width:46ch; margin:10px auto 22px; color:var(--ink-soft);">${msg}</p>
        <button class="btn" id="quizRestart">Retake the quiz</button>
      </div>`;
    document.getElementById('quizRestart').addEventListener('click', () => {
      current = 0; score = 0;
      answered.fill(null);
      renderQuestion();
    });
  }

  renderQuestion();
})();

  } catch(e) { console.warn('[gdp-income] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: monetary-fiscal
   ============================================================ */
(function(){
  try {
// ============================================================
// Monetary and Fiscal Policy — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   03 — Money multiplier / fractional reserve banking calculator
   ============================================================ */
(function(){
  const depositI = document.getElementById('mmDeposit'), reserveI = document.getElementById('mmReserve');
  const tableContainer = document.getElementById('mmTable'), result = document.getElementById('mmResult');
  if (!depositI) return;
  function render(){
    const deposit = parseFloat(depositI.value);
    const reservePct = parseFloat(reserveI.value) / 100;
    const multiplier = 1 / reservePct;
    const totalMoney = deposit / reservePct;

    let html = '<table class="exhibit" style="margin:0; min-width:340px;"><tr><th>Bank</th><th>Deposit</th><th>Reserves</th><th>Loan</th></tr>';
    let currentDeposit = deposit;
    const bankNames = ['First','Second','Third','Fourth','Fifth'];
    for (let i=0; i<5; i++){
      const reserves = currentDeposit * reservePct;
      const loan = currentDeposit - reserves;
      html += `<tr><td>${bankNames[i]}</td><td class="num">${fmt(currentDeposit,2)}</td><td class="num">${fmt(reserves,2)}</td><td class="num">${fmt(loan,2)}</td></tr>`;
      currentDeposit = loan;
    }
    html += `<tr><td colspan="4" style="text-align:center; color:var(--ink-soft); font-style:italic;">… continues until fully absorbed</td></tr>`;
    html += '</table>';
    tableContainer.innerHTML = html;
    result.textContent = `Money multiplier = ${fmt(multiplier,2)} · Total money created = ${fmt(totalMoney,2)}`;
  }
  [depositI,reserveI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   04 — Quantity equation solver (M*V = P*Y)
   ============================================================ */
(function(){
  const mI = document.getElementById('qeM'), vI = document.getElementById('qeV'), pI = document.getElementById('qeP');
  const result = document.getElementById('qeResult'), steps = document.getElementById('qeSteps');
  if (!mI) return;
  function render(){
    const m = parseFloat(mI.value), v = parseFloat(vI.value), p = parseFloat(pI.value);
    const y = (m*v)/p;
    result.textContent = `Y (real output) = ${fmt(y,2)}`;
    steps.textContent = `${m} × ${v} = ${p} × Y → Y = ${fmt(y,2)}`;
  }
  [mI,vI,pI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   06 — Money market equilibrium chart (static illustrative)
   ============================================================ */
(function(){
  const container = document.getElementById('moneyMarketChart');
  if (!container) return;
  const W=460, H=260, padL=44, padR=20, padT=20, padB=32;
  const xScale = q => padL + (q/100)*(W-padL-padR);
  const yScale = r => (H-padB) - (r/100)*(H-padT-padB);
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'econ-svg', style:'max-width:480px;'});
  svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));
  svg.appendChild(svgEl('line', {x1:padL, x2:padL, y1:padT, y2:H-padB, stroke:'#4A4763', 'stroke-width':1.5}));
  // MS - vertical at Q=50
  svg.appendChild(svgEl('line', {x1:xScale(50), y1:padT, x2:xScale(50), y2:H-padB, stroke:'#2B2560', 'stroke-width':2.5}));
  // MD - downward from (10,85) to (90,15)
  svg.appendChild(svgEl('line', {x1:xScale(10), y1:yScale(85), x2:xScale(90), y2:yScale(15), stroke:'#C77F1E', 'stroke-width':2.5}));
  // equilibrium point at Q=50
  const eqR = 85 - (50-10)*(85-15)/(90-10);
  svg.appendChild(svgEl('circle', {cx:xScale(50), cy:yScale(eqR), r:5, fill:'#2F8F6B', stroke:'#fff', 'stroke-width':1.5}));
  svg.appendChild(svgEl('line', {x1:padL, x2:xScale(50), y1:yScale(eqR), y2:yScale(eqR), stroke:'#2F8F6B', 'stroke-width':1, 'stroke-dasharray':'3,2'}));
  const i0Label = svgEl('text', {x:padL-6, y:yScale(eqR)+3, 'text-anchor':'end', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#2F8F6B', 'font-weight':'700'});
  i0Label.textContent = 'I₀';
  svg.appendChild(i0Label);
  const msLabel = svgEl('text', {x:xScale(50)+4, y:padT+10, 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#2B2560', 'font-weight':'700'});
  msLabel.textContent = 'MS';
  svg.appendChild(msLabel);
  const mdLabel = svgEl('text', {x:xScale(88), y:yScale(18)-4, 'text-anchor':'end', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#C77F1E', 'font-weight':'700'});
  mdLabel.textContent = 'MD';
  svg.appendChild(mdLabel);
  const ylabel = svgEl('text', {x:10, y:padT+6, 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
  ylabel.textContent = 'Nominal Interest Rate';
  svg.appendChild(ylabel);
  const xlabel = svgEl('text', {x:W/2, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
  xlabel.textContent = 'Quantity of Money';
  svg.appendChild(xlabel);
  container.appendChild(svg);
})();

/* ============================================================
   07 — Fisher effect calculator
   ============================================================ */
(function(){
  const realI = document.getElementById('feReal'), inflI = document.getElementById('feInfl');
  const result = document.getElementById('feResult'), steps = document.getElementById('feSteps');
  if (!realI) return;
  function render(){
    const real = parseFloat(realI.value), infl = parseFloat(inflI.value);
    const nominal = real + infl;
    result.textContent = `Nominal rate = ${fmt(nominal,2)}%`;
    steps.textContent = `${real}% + ${infl}% = ${fmt(nominal,2)}%`;
  }
  [realI,inflI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   Check-in mini quizzes
   ============================================================ */
(function(){
  document.querySelectorAll('.checkin').forEach(box => {
    const btns = box.querySelectorAll('.opt-btn');
    const feedback = box.querySelector('.checkin-feedback');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btns.forEach(b => b.disabled = true);
        btns.forEach(b => { if (b.dataset.correct === 'true') b.classList.add('correct'); });
        if (btn.dataset.correct !== 'true') btn.classList.add('incorrect');
        feedback.classList.add('show');
        markSectionProgress(box.closest('section').id);
      });
    });
  });
})();

/* ============================================================
   Sidebar scroll-spy + progress + mobile toggle
   ============================================================ */
const sectionIds = ['sec-policytypes','sec-moneyfunctions','sec-moneycreation','sec-quantitytheory','sec-moneydemand','sec-equilibrium','sec-fishereffect','sec-inflationcosts','sec-quiz'];
const visited = new Set();

function markSectionProgress(id){
  if (sectionIds.includes(id)){
    visited.add(id);
    updateProgress();
  }
}
function updateProgress(){
  const pct = Math.round((visited.size / sectionIds.length) * 100);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressPct');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
  sectionIds.forEach(id => {
    const link = document.querySelector(`.toc a[data-sec="${id}"]`);
    if (link && visited.has(id)) link.classList.add('done');
  });
  try { localStorage.setItem('cfa-progress-monetary-fiscal', String(pct)); } catch(e) {}
}

(function(){
  const links = document.querySelectorAll('.toc a[data-sec]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.toc a[data-sec="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting){
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        markSectionProgress(id);
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle){
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.querySelectorAll('.toc a').forEach(a => a.addEventListener('click', () => sidebar.classList.remove('open')));
  }
})();

/* ============================================================
   QUIZ
   ============================================================ */
const QUIZ = [
  {
    concept: "Monetary vs. Fiscal Policy",
    q: "Which best describes monetary policy?",
    opts: ["Government decisions about taxation and spending", "Central bank activities directed at influencing the quantity of money and credit", "A private company's decisions about dividend payments"],
    correct: 1,
    exp: "Monetary policy is specifically the domain of the central bank, focused on the quantity of money and credit in the economy."
  },
  {
    concept: "Monetary vs. Fiscal Policy",
    q: "Which is a distinguishing feature of fiscal policy, not shared by monetary policy?",
    opts: ["It can be used to redistribute income and wealth", "It affects the overall economy", "It is set by unelected officials only"],
    correct: 0,
    exp: "Fiscal policy, through taxation and spending choices, can deliberately redistribute income and wealth — a role monetary policy doesn't typically play."
  },
  {
    concept: "Functions & Definitions of Money",
    q: "In a barter economy, the core problem money solves is:",
    opts: ["The need for a 'double coincidence of wants' in every trade", "Excessive government regulation", "Too much liquidity in financial markets"],
    correct: 0,
    exp: "Barter requires finding someone who has what you want and wants what you have — money removes this restrictive requirement entirely."
  },
  {
    concept: "Functions & Definitions of Money",
    q: "Which of these is NOT one of the three classic functions of money?",
    opts: ["Medium of exchange", "Unit of account", "Guarantee of future economic growth"],
    correct: 2,
    exp: "The three functions are medium of exchange, store of wealth, and unit of account — money has no direct function guaranteeing economic growth."
  },
  {
    concept: "Functions & Definitions of Money",
    q: "Broad money, compared to narrow money, includes:",
    opts: ["Only physical notes and coins", "Narrow money plus the wider range of liquid assets usable for purchases", "Only central bank reserves"],
    correct: 1,
    exp: "Broad money encompasses narrow money (cash and highly liquid deposits) plus a wider range of liquid assets like savings accounts."
  },
  {
    concept: "The Money Creation Process",
    q: "A bank receives a $500 deposit with a 20% reserve requirement. How much can it lend out?",
    opts: ["$500", "$400", "$100"],
    correct: 1,
    exp: "The bank keeps 20% ($100) as reserves and lends the remaining 80% ($400)."
  },
  {
    concept: "The Money Creation Process",
    q: "The money multiplier is calculated as:",
    opts: ["Reserve requirement × Deposit", "1 / Reserve requirement (as a decimal)", "Deposit − Reserve requirement"],
    correct: 1,
    exp: "The money multiplier equals 1 divided by the reserve requirement expressed as a decimal — e.g., 1/0.10 = 10 for a 10% requirement."
  },
  {
    concept: "The Money Creation Process",
    q: "With a 5% reserve requirement, how much total money can ultimately be created from an initial $200 deposit?",
    opts: ["$1,000", "$4,000", "$10,000"],
    correct: 2,
    exp: "Total money = Deposit / Reserve requirement = $200 / 0.05 = $10,000."
  },
  {
    concept: "The Quantity Theory of Money",
    q: "The quantity equation of exchange is:",
    opts: ["M × V = P × Y", "M + V = P + Y", "M / V = P / Y"],
    correct: 0,
    exp: "M×V=P×Y: the quantity of money times its velocity equals the price level times real output."
  },
  {
    concept: "The Quantity Theory of Money",
    q: "The quantity theory of money adds which key assumption to the quantity equation identity?",
    opts: ["That real output is always zero", "That velocity of money is approximately constant", "That the money supply never changes"],
    correct: 1,
    exp: "Assuming velocity (V) is roughly constant is what turns the accounting identity into a testable theory linking money growth to inflation."
  },
  {
    concept: "The Quantity Theory of Money",
    q: "Economists who believe money supply growth directly drives inflation are called:",
    opts: ["Keynesians", "Monetarists", "Behavioralists"],
    correct: 1,
    exp: "Monetarists hold that there is a causal relationship running from money supply growth to inflation."
  },
  {
    concept: "The Demand for Money",
    q: "Which motive for holding money is most sensitive to changes in interest rates?",
    opts: ["Transactions-related demand", "Precautionary demand", "Speculative demand"],
    correct: 2,
    exp: "Speculative demand for money reflects the opportunity cost of holding cash versus interest-bearing assets, making it the most interest-rate sensitive of the three motives."
  },
  {
    concept: "Money Market Equilibrium",
    q: "In the money market, the money supply curve (MS) is typically drawn as:",
    opts: ["Upward sloping", "Vertical", "Horizontal"],
    correct: 1,
    exp: "MS is vertical because the nominal quantity of money in circulation at any moment is treated as fixed, regardless of the interest rate."
  },
  {
    concept: "Money Market Equilibrium",
    q: "If the nominal interest rate is below the money market's equilibrium rate, there is:",
    opts: ["Excess supply of money, which will push interest rates down", "Excess demand for money, which will push interest rates up toward equilibrium", "No effect on interest rates"],
    correct: 1,
    exp: "Below equilibrium, money demand exceeds supply; people sell bonds to raise cash, pushing bond prices down and interest rates up toward equilibrium."
  },
  {
    concept: "The Fisher Effect",
    q: "The Fisher effect states that:",
    opts: ["Rnom = Rreal + expected inflation", "Rreal = Rnom + expected inflation", "Rnom is always equal to expected inflation alone"],
    correct: 0,
    exp: "The Fisher effect: the nominal interest rate equals the real interest rate plus expected inflation."
  },
  {
    concept: "The Fisher Effect",
    q: "Investors require a 3% real return, and expected inflation is 5%. What nominal rate should they demand, according to the Fisher effect?",
    opts: ["2%", "8%", "15%"],
    correct: 1,
    exp: "Rnom = Rreal + πe = 3% + 5% = 8%."
  },
  {
    concept: "The Fisher Effect",
    q: "The Fisher effect relies on the concept of money neutrality, which holds that in the long run, changes in the money supply affect:",
    opts: ["Only nominal variables, not real variables like the real interest rate", "Only real variables, not nominal variables", "Neither real nor nominal variables"],
    correct: 0,
    exp: "Money neutrality holds that money supply changes affect nominal prices over the long run but leave real variables, like the real interest rate, unchanged."
  },
  {
    concept: "The Costs of Inflation",
    q: "Which type of inflation is generally considered most economically costly?",
    opts: ["Expected inflation, since it's fully anticipated", "Unexpected inflation, since it redistributes wealth and distorts price signals", "Zero inflation"],
    correct: 1,
    exp: "Unexpected inflation is the more costly type, since it can't be planned for in contracts and wage negotiations, and it redistributes real wealth between borrowers and lenders unpredictably."
  },
  {
    concept: "The Costs of Inflation",
    q: "When actual inflation comes in unexpectedly HIGH, who benefits and who is hurt?",
    opts: ["Borrowers benefit; lenders are hurt", "Lenders benefit; borrowers are hurt", "Neither party is affected"],
    correct: 0,
    exp: "Higher-than-expected inflation erodes the real value of a fixed nominal debt, benefiting the borrower at the lender's expense."
  },
  {
    concept: "The Costs of Inflation",
    q: "In the television manufacturer example, why did unexpected inflation lead to economic waste?",
    opts: ["The manufacturer correctly identified rising demand for TVs specifically", "The manufacturer mistook a generalized price increase for increased demand for its specific product, leading to overexpansion", "Television prices actually fell"],
    correct: 1,
    exp: "The manufacturer misread an economy-wide price increase as product-specific demand growth, leading to wasteful overexpansion that had to be reversed once the truth became clear."
  }
];

(function(){
  const shell = document.getElementById('quizShell');
  if (!shell) return;
  let current = 0;
  let score = 0;
  const answered = new Array(QUIZ.length).fill(null);

  function renderQuestion(){
    const item = QUIZ[current];
    let html = `<div class="quiz-progress">Question ${current+1} of ${QUIZ.length} &nbsp;·&nbsp; Score so far: ${score}</div>`;
    html += `<div class="quiz-q">${item.q}</div>`;
    html += `<div class="opt-list" id="quizOpts">`;
    item.opts.forEach((opt, i) => {
      html += `<button class="opt-btn" data-i="${i}">${opt}</button>`;
    });
    html += `</div>`;
    html += `<div class="quiz-explain" id="quizExplain">${item.exp}</div>`;
    html += `<div class="quiz-nav">
      <button class="btn ghost" id="quizPrev" ${current===0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn" id="quizNext" disabled>${current === QUIZ.length-1 ? 'See score' : 'Next →'}</button>
    </div>`;
    shell.innerHTML = html;

    const opts = shell.querySelectorAll('.opt-btn');
    const explain = document.getElementById('quizExplain');
    const nextBtn = document.getElementById('quizNext');
    const prevBtn = document.getElementById('quizPrev');

    if (answered[current] !== null){
      opts.forEach(btn => {
        btn.disabled = true;
        const i = +btn.dataset.i;
        if (i === item.correct) btn.classList.add('correct');
        else if (i === answered[current]) btn.classList.add('incorrect');
      });
      explain.classList.add('show');
      nextBtn.disabled = false;
    }

    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered[current] !== null) return;
        const i = +btn.dataset.i;
        answered[current] = i;
        if (i === item.correct) score++;
        if (typeof cfaRecordAnswer === "function" && item.concept){
          cfaRecordAnswer(item.concept, "Monetary & Fiscal Policy", i === item.correct);
        }
        opts.forEach(b => {
          b.disabled = true;
          const bi = +b.dataset.i;
          if (bi === item.correct) b.classList.add('correct');
          else if (bi === i) b.classList.add('incorrect');
        });
        explain.classList.add('show');
        nextBtn.disabled = false;
        markSectionProgress('sec-quiz');
      });
    });

    nextBtn.addEventListener('click', () => {
      if (current < QUIZ.length - 1){ current++; renderQuestion(); }
      else { renderScore(); }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){ current--; renderQuestion(); }
    });
  }

  function renderScore(){
    const pct = Math.round((score / QUIZ.length) * 100);
    let msg = "Solid foundation — review the sections you missed and try again.";
    if (pct >= 90) msg = "Excellent — you've genuinely internalized this reading.";
    else if (pct >= 70) msg = "Good work — a couple of gaps worth revisiting.";
    shell.innerHTML = `
      <div class="quiz-score">
        <div style="font-family:var(--font-mono); font-size:.8rem; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.08em;">Final score</div>
        <div class="big">${score} / ${QUIZ.length}</div>
        <p style="max-width:46ch; margin:10px auto 22px; color:var(--ink-soft);">${msg}</p>
        <button class="btn" id="quizRestart">Retake the quiz</button>
      </div>`;
    document.getElementById('quizRestart').addEventListener('click', () => {
      current = 0; score = 0;
      answered.fill(null);
      renderQuestion();
    });
  }

  renderQuestion();
})();

  } catch(e) { console.warn('[monetary-fiscal] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: readiness
   ============================================================ */
(function(){
  try {
// ============================================================
// Readiness Dashboard — reads persisted diagnostics and renders
// per-module readiness verdicts + weakest/strongest concept lists
// ============================================================

// The full universe of modules and concepts (mirrors the Final Review's question bank).
// Used to compute coverage — i.e., how many of a module's concepts have been tested at all.
const CFA_MODULE_CONCEPTS = {
  "Economics Foundations": ["Scarcity & Opportunity Cost","Factors of Production & Economic Systems","The Production Possibilities Frontier","Microeconomics vs. Macroeconomics","Positive vs. Normative Economics","Reading a Graph — Movements vs. Shifts","The Circular Flow of Income"],
  "Demand & Supply Analysis": ["The Demand Function & Curve","Price Elasticity of Demand","What Drives Elasticity?","Income & Cross-Price Elasticity","Substitution & Income Effects","Marginal Returns & Productivity","Marginal Revenue & Profit Max","Cost Curves & Breakeven"],
  "Firm & Market Organization": ["Four Market Structures","Elasticity & Revenue","Consumer Surplus","Optimal Price & Output (Perfect Competition)","Cost Curves & Long-Run Equilibrium","Sources of Market Power","Optimal Price & Output (Monopoly)","Price Discrimination"],
  "GDP, Income & Expenditure": ["What Is GDP?","The Value-Added Method","Nominal vs. Real GDP","The Components of GDP","Saving, Investment & the Trade Balance"],
  "AD, AS & Economic Growth": ["The Aggregate Demand Curve","The Aggregate Supply Curve","Shifts in AD & AS","Four Macroeconomic Equilibria","The Production Function & Growth Accounting","Measures of Sustainable Growth"],
  "Business Cycles": ["Consumer Behavior","Housing & Business Investment","External Trade","Types & Measures","Why It Lags the Cycle","Inflation, Deflation & Hyperinflation","Measuring Inflation","Cost-Push vs. Demand-Pull","Leading, Coincident & Lagging Indicators","Theories of the Business Cycle"],
  "Monetary & Fiscal Policy": ["Monetary vs. Fiscal Policy","Functions & Definitions of Money","The Money Creation Process","The Quantity Theory of Money","The Demand for Money","Money Market Equilibrium","The Fisher Effect","The Costs of Inflation"],
  "International Trade & Capital Flows": ["GDP vs. GNP & Basic Terms","Patterns & Trends in Trade","Absolute vs. Comparative Advantage","The Gains from Trade","The Ricardian Model","The Heckscher–Ohlin Model","BOP Components","The National Income Identity"],
  "Currency Exchange Rates": ["Size & Importance","Nominal & Real Exchange Rates","Spot, Forward & FX Swaps","Hedging a Foreign Investment","% Change in Currency Value","The Elasticities Approach"],
};

function pctColor(pct){
  if (pct >= 80) return '#2F8F6B';
  if (pct >= 50) return '#E8A33D';
  return '#D6573F';
}

function verdictFor(coverage, accuracy){
  if (coverage === 0) return {label:'Not Yet Assessed', cls:'unassessed'};
  if (coverage < 1) {
    // partially tested — base verdict on accuracy so far, but flag incompleteness in label
    if (accuracy >= 80) return {label:'Partially Assessed — Strong So Far', cls:'review'};
    if (accuracy >= 50) return {label:'Partially Assessed', cls:'review'};
    return {label:'Partially Assessed — Weak So Far', cls:'notready'};
  }
  if (accuracy >= 80) return {label:'Ready', cls:'ready'};
  if (accuracy >= 50) return {label:'Needs Review', cls:'review'};
  return {label:'Not Ready', cls:'notready'};
}

function render(){
  const diagnostics = cfaLoadDiagnostics();
  const container = document.getElementById('dashboardContent');
  const conceptNames = Object.keys(diagnostics);

  if (conceptNames.length === 0){
    container.innerHTML = `
      <div class="empty-state">
        <div style="font-size:2rem;">📊</div>
        <p><strong>No data yet.</strong> This dashboard builds itself from your answers anywhere in this toolkit — any module's quiz, the Final Review, or the flashcards. Try a few cards or questions anywhere (even partially) and your readiness breakdown will appear here, concept by concept.</p>
        <a href="../final-review/index.html" class="start-btn">Take the Final Review →</a>
      </div>`;
    return;
  }

  // Overall summary
  let totalAttempts = 0, totalCorrect = 0;
  conceptNames.forEach(c => { totalAttempts += diagnostics[c].attempts; totalCorrect += diagnostics[c].correct; });
  const overallPct = totalAttempts > 0 ? Math.round((totalCorrect/totalAttempts)*100) : 0;
  const totalConcepts = Object.values(CFA_MODULE_CONCEPTS).reduce((a,arr)=>a+arr.length,0);
  const testedConcepts = conceptNames.length;

  // Build per-concept accuracy list (only concepts with at least 1 attempt)
  const conceptStats = conceptNames.map(name => {
    const d = diagnostics[name];
    const pct = d.attempts > 0 ? Math.round((d.correct/d.attempts)*100) : 0;
    return { name, cat: d.cat, pct, attempts: d.attempts };
  });
  const weakest = [...conceptStats].sort((a,b) => a.pct - b.pct).slice(0, 6);
  const strongest = [...conceptStats].sort((a,b) => b.pct - a.pct).filter(c => c.pct >= 80).slice(0, 6);

  let html = '';

  // Summary row
  html += `<div class="summary-row">
    <div class="summary-card"><div class="k">Overall accuracy</div><div class="v">${overallPct}%</div></div>
    <div class="summary-card"><div class="k">Concepts tested</div><div class="v">${testedConcepts}/${totalConcepts}</div></div>
    <div class="summary-card"><div class="k">Total answers logged</div><div class="v">${totalAttempts}</div></div>
  </div>`;

  // Focus here (weakest)
  if (weakest.length > 0){
    html += `<div class="focus-section"><h2>Focus here — your weakest concepts</h2>`;
    weakest.forEach(c => {
      html += `<span class="concept-pill"><span class="dot" style="background:${pctColor(c.pct)};"></span>${c.name} <span class="pct">${c.pct}%</span></span>`;
    });
    html += `</div>`;
  }

  // Strongest
  if (strongest.length > 0){
    html += `<div class="focus-section"><h2>Confirmed strong</h2>`;
    strongest.forEach(c => {
      html += `<span class="concept-pill"><span class="dot" style="background:${pctColor(c.pct)};"></span>${c.name} <span class="pct">${c.pct}%</span></span>`;
    });
    html += `</div>`;
  }

  // Per-module breakdown
  html += `<div class="focus-section"><h2>Readiness by module</h2>`;
  Object.entries(CFA_MODULE_CONCEPTS).forEach(([cat, allConcepts]) => {
    const testedInCat = allConcepts.filter(c => diagnostics[c]);
    const coverage = testedInCat.length / allConcepts.length;
    let catCorrect = 0, catAttempts = 0;
    testedInCat.forEach(c => { catCorrect += diagnostics[c].correct; catAttempts += diagnostics[c].attempts; });
    const catPct = catAttempts > 0 ? Math.round((catCorrect/catAttempts)*100) : 0;
    const verdict = verdictFor(coverage, catPct);

    html += `<div class="module-card">
      <div class="module-card-head">
        <h3>${cat}</h3>
        <span class="verdict ${verdict.cls}">${verdict.label}</span>
      </div>`;

    allConcepts.forEach(concept => {
      const d = diagnostics[concept];
      if (d){
        const pct = d.attempts > 0 ? Math.round((d.correct/d.attempts)*100) : 0;
        html += `<div class="concept-row">
          <div class="name">${concept}</div>
          <div class="track"><div class="fill" style="width:${pct}%; background:${pctColor(pct)};"></div></div>
          <div class="stat">${d.correct}/${d.attempts} (${pct}%)</div>
        </div>`;
      } else {
        html += `<div class="concept-row">
          <div class="name" style="color:var(--ink-soft);">${concept}</div>
          <div class="track"><div class="fill" style="width:0%;"></div></div>
          <div class="stat" style="color:var(--ink-soft);">not tested</div>
        </div>`;
      }
    });
    html += `</div>`;
  });
  html += `</div>`;

  container.innerHTML = html;
}

const resetBtn = document.getElementById('resetBtn');
if (resetBtn){
  resetBtn.addEventListener('click', () => {
    if (confirm('This clears all recorded quiz performance data from this browser. Continue?')){
      cfaResetDiagnostics();
      render();
    }
  });
  render();
}

  } catch(e) { console.warn('[readiness] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: trade-capital
   ============================================================ */
(function(){
  try {
// ============================================================
// International Trade and Capital Flows — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }

/* ============================================================
   03 — Absolute & comparative advantage calculator
   ============================================================ */
(function(){
  const a1I = document.getElementById('advA1'), a2I = document.getElementById('advA2'),
        b1I = document.getElementById('advB1'), b2I = document.getElementById('advB2');
  const out = document.getElementById('advOut');
  if (!a1I) return;
  function render(){
    const a1 = parseFloat(a1I.value), a2 = parseFloat(a2I.value);
    const b1 = parseFloat(b1I.value), b2 = parseFloat(b2I.value);

    // absolute advantage: whoever produces more per worker
    const absGood1 = a1 > b1 ? 'Country A' : b1 > a1 ? 'Country B' : 'Tied';
    const absGood2 = a2 > b2 ? 'Country A' : b2 > a2 ? 'Country B' : 'Tied';

    // opportunity cost of good 1 in terms of good 2 = good2/good1
    const oppCostA_good1 = a2/a1; // units of good2 given up per unit of good1
    const oppCostB_good1 = b2/b1;
    const oppCostA_good2 = a1/a2;
    const oppCostB_good2 = b1/b2;

    const compGood1 = oppCostA_good1 < oppCostB_good1 ? 'Country A' : oppCostB_good1 < oppCostA_good1 ? 'Country B' : 'Tied';
    const compGood2 = oppCostA_good2 < oppCostB_good2 ? 'Country A' : oppCostB_good2 < oppCostA_good2 ? 'Country B' : 'Tied';

    out.innerHTML = `
      <table class="exhibit" style="margin:0 0 10px;">
        <tr><th></th><th>Good 1</th><th>Good 2</th></tr>
        <tr><td>Absolute advantage</td><td class="num">${absGood1}</td><td class="num">${absGood2}</td></tr>
        <tr><td>Opp. cost (A)</td><td class="num">${fmt(oppCostA_good1,3)} of Good 2</td><td class="num">${fmt(oppCostA_good2,3)} of Good 1</td></tr>
        <tr><td>Opp. cost (B)</td><td class="num">${fmt(oppCostB_good1,3)} of Good 2</td><td class="num">${fmt(oppCostB_good2,3)} of Good 1</td></tr>
        <tr><td><strong>Comparative advantage</strong></td><td class="num"><strong>${compGood1}</strong></td><td class="num"><strong>${compGood2}</strong></td></tr>
      </table>
      <p style="margin:0; font-size:.85rem; color:var(--ink-soft);">Country ${compGood1 === 'Country A' ? 'A' : 'B'} should specialize in and export Good 1; Country ${compGood2 === 'Country A' ? 'A' : 'B'} should specialize in and export Good 2.</p>
    `;
  }
  [a1I,a2I,b1I,b2I].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   04 — Gains from trade range checker
   ============================================================ */
(function(){
  const aI = document.getElementById('gtA'), bI = document.getElementById('gtB'), worldI = document.getElementById('gtWorld');
  const result = document.getElementById('gtResult');
  if (!aI) return;
  function render(){
    let a = parseFloat(aI.value), b = parseFloat(bI.value);
    const world = parseFloat(worldI.value);
    const lo = Math.min(a,b), hi = Math.max(a,b);
    const works = world > lo && world < hi;
    result.innerHTML = `Valid range: [${fmt(lo,1)}, ${fmt(hi,1)}] · World price ${fmt(world,1)} ${works ? '<span style="color:var(--green); font-weight:700;">works for both</span>' : '<span style="color:var(--red); font-weight:700;">does NOT allow mutual gains</span>'}`;
  }
  [aI,bI,worldI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   08 — Current account calculator
   ============================================================ */
(function(){
  const yI = document.getElementById('caY'), cI = document.getElementById('caC'),
        iI = document.getElementById('caI'), gI = document.getElementById('caG');
  const result = document.getElementById('caResult'), steps = document.getElementById('caSteps');
  if (!yI) return;
  function render(){
    const y = parseFloat(yI.value), c = parseFloat(cI.value), i = parseFloat(iI.value), g = parseFloat(gI.value);
    const ca = y - (c+i+g);
    const label = ca >= 0 ? 'surplus' : 'deficit';
    result.textContent = `Current account = ${ca>=0?'':'−'}$${fmt(Math.abs(ca),1)}B (${label})`;
    steps.textContent = `${y} − (${c}+${i}+${g}) = ${fmt(ca,1)}`;
  }
  [yI,cI,iI,gI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   Check-in mini quizzes
   ============================================================ */
(function(){
  document.querySelectorAll('.checkin').forEach(box => {
    const btns = box.querySelectorAll('.opt-btn');
    const feedback = box.querySelector('.checkin-feedback');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btns.forEach(b => b.disabled = true);
        btns.forEach(b => { if (b.dataset.correct === 'true') b.classList.add('correct'); });
        if (btn.dataset.correct !== 'true') btn.classList.add('incorrect');
        feedback.classList.add('show');
        markSectionProgress(box.closest('section').id);
      });
    });
  });
})();

/* ============================================================
   Sidebar scroll-spy + progress + mobile toggle
   ============================================================ */
const sectionIds = ['sec-terminology','sec-patterns','sec-advantage','sec-gains','sec-ricardian','sec-heckscher','sec-bopcomponents','sec-nationalincome','sec-quiz'];
const visited = new Set();

function markSectionProgress(id){
  if (sectionIds.includes(id)){
    visited.add(id);
    updateProgress();
  }
}
function updateProgress(){
  const pct = Math.round((visited.size / sectionIds.length) * 100);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressPct');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
  sectionIds.forEach(id => {
    const link = document.querySelector(`.toc a[data-sec="${id}"]`);
    if (link && visited.has(id)) link.classList.add('done');
  });
  try { localStorage.setItem('cfa-progress-trade-capital', String(pct)); } catch(e) {}
}

(function(){
  const links = document.querySelectorAll('.toc a[data-sec]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.toc a[data-sec="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting){
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        markSectionProgress(id);
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle){
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.querySelectorAll('.toc a').forEach(a => a.addEventListener('click', () => sidebar.classList.remove('open')));
  }
})();

/* ============================================================
   QUIZ
   ============================================================ */
const QUIZ = [
  {
    concept: "GDP vs. GNP & Basic Terms",
    q: "GDP measures output produced by factors of production:",
    opts: ["Owned by a country's citizens, regardless of location", "Located within a country, regardless of ownership", "Exported to foreign countries only"],
    correct: 1,
    exp: "GDP counts output from factors of production located within a country's borders, regardless of who owns those factors."
  },
  {
    concept: "GDP vs. GNP & Basic Terms",
    q: "A US-owned factory operates in Vietnam. This factory's output counts toward:",
    opts: ["Vietnam's GDP and the US's GNP", "The US's GDP and Vietnam's GNP", "Neither country's GDP or GNP"],
    correct: 0,
    exp: "GDP is based on location (Vietnam), while GNP is based on ownership (US citizens/companies)."
  },
  {
    concept: "GDP vs. GNP & Basic Terms",
    q: "If a country's exports exceed its imports, it has a:",
    opts: ["Trade deficit", "Trade surplus", "Balanced trade position"],
    correct: 1,
    exp: "Exports greater than imports is the definition of a trade surplus."
  },
  {
    concept: "Patterns & Trends in Trade",
    q: "Foreign direct investment (FDI) is best distinguished from foreign portfolio investment (FPI) by:",
    opts: ["FDI involves direct investment in productive assets with operational control; FPI is shorter-term financial investment without control", "FDI is always smaller in scale than FPI", "FDI only occurs between developed countries"],
    correct: 0,
    exp: "FDI involves a firm directly investing in and controlling productive foreign assets, while FPI is shorter-term investment in foreign financial instruments without operational control."
  },
  {
    concept: "Absolute vs. Comparative Advantage",
    q: "A country has an absolute advantage in producing a good when it:",
    opts: ["Has a lower opportunity cost of producing that good", "Can produce that good using fewer resources than its trading partner", "Exports more of that good than it imports"],
    correct: 1,
    exp: "Absolute advantage means being more efficient in production — using fewer resources or producing more output per worker — regardless of opportunity cost."
  },
  {
    concept: "Absolute vs. Comparative Advantage",
    q: "A country has a comparative advantage in producing a good when it:",
    opts: ["Produces more of that good in absolute terms", "Has a lower opportunity cost of producing that good than its trading partner", "Has never traded that good before"],
    correct: 1,
    exp: "Comparative advantage is specifically about opportunity cost — the good given up to produce one more unit of the good in question — not raw output levels."
  },
  {
    concept: "Absolute vs. Comparative Advantage",
    q: "Worker output: Country X makes 30 shirts or 10 hats per day; Country Y makes 20 shirts or 5 hats per day. What is Country X's opportunity cost of one hat?",
    opts: ["3 shirts", "4 shirts", "2 shirts"],
    correct: 0,
    exp: "Country X can make 30 shirts or 10 hats, so one hat costs 30/10 = 3 shirts forgone."
  },
  {
    concept: "Absolute vs. Comparative Advantage",
    q: "Even if one country has an absolute advantage in producing every good, can both countries still gain from trade?",
    opts: ["No, trade only benefits the country with the absolute advantage", "Yes, as long as each country still has a comparative advantage in something", "Only if both countries have identical technology"],
    correct: 1,
    exp: "Comparative advantage guarantees mutual gains from trade even when one country is absolutely more efficient at producing everything — as long as opportunity costs differ."
  },
  {
    concept: "The Gains from Trade",
    q: "Two countries' autarkic prices for a good (in terms of another good) are 4 and 10. Which world price allows both countries to gain from trade?",
    opts: ["3", "7", "11"],
    correct: 1,
    exp: "Any world price strictly between the two autarkic prices (4 and 10) allows mutual gains; 7 falls within that range."
  },
  {
    concept: "The Ricardian Model",
    q: "In the Ricardian model of trade, comparative advantage arises from differences in:",
    opts: ["Relative capital and labor endowments", "Labor productivity, reflecting differences in technology", "Government trade policy alone"],
    correct: 1,
    exp: "The Ricardian model has labor as the only variable factor of production, so differences in labor productivity (driven by technology) are the sole source of comparative advantage."
  },
  {
    concept: "The Heckscher–Ohlin Model",
    q: "The Heckscher–Ohlin model differs from the Ricardian model primarily by:",
    opts: ["Including capital as a second variable factor of production alongside labor", "Assuming no trade barriers exist anywhere", "Ignoring labor productivity entirely"],
    correct: 0,
    exp: "Heckscher–Ohlin adds capital as a second factor, making relative factor endowments (not just technology) the source of comparative advantage."
  },
  {
    concept: "The Heckscher–Ohlin Model",
    q: "According to the Heckscher–Ohlin model, a capital-abundant country would be expected to:",
    opts: ["Export labor-intensive goods and import capital-intensive goods", "Export capital-intensive goods and import labor-intensive goods", "Neither export nor import capital-intensive goods"],
    correct: 1,
    exp: "A country specializes in and exports goods intensive in the factor it holds abundantly — for a capital-abundant country, that's capital-intensive goods."
  },
  {
    concept: "The Heckscher–Ohlin Model",
    q: "Which trade model allows for the possibility that trade redistributes income within a country, benefiting the abundant factor and hurting the scarce factor?",
    opts: ["The Ricardian model", "The Heckscher–Ohlin model", "Neither model addresses income redistribution"],
    correct: 1,
    exp: "Because Heckscher–Ohlin has two factors of production, opening to trade changes relative factor prices, benefiting the abundant factor and hurting the scarce one — a dynamic the single-factor Ricardian model can't capture."
  },
  {
    concept: "BOP Components",
    q: "The balance of payments' current account includes which of the following sub-accounts?",
    opts: ["Merchandise trade, services, income receipts, and unilateral transfers", "Only merchandise trade", "Capital transfers and financial asset flows only"],
    correct: 0,
    exp: "The current account has four sub-accounts: merchandise trade, services, income receipts, and unilateral transfers."
  },
  {
    concept: "BOP Components",
    q: "A worker sends money home to family in another country as a remittance. This is recorded in the BOP under:",
    opts: ["Merchandise trade", "Unilateral transfers", "The financial account"],
    correct: 1,
    exp: "A one-way transfer of money with nothing given in exchange, like a remittance, belongs in unilateral transfers within the current account."
  },
  {
    concept: "BOP Components",
    q: "The financial account of the balance of payments records:",
    opts: ["Physical goods bought and sold across borders", "A country's financial assets abroad and foreign-owned financial assets domestically", "Tourism and transportation services only"],
    correct: 1,
    exp: "The financial account tracks investment flows — assets held abroad by domestic residents and domestic assets held by foreigners."
  },
  {
    concept: "The National Income Identity",
    q: "The open-economy national income identity is:",
    opts: ["Y = C + I + G", "Y = C + I + G + (X − M)", "Y = C − I − G"],
    correct: 1,
    exp: "Once trade is introduced, the identity expands to include net exports: Y = C + I + G + (X − M)."
  },
  {
    concept: "The National Income Identity",
    q: "A country's GDP (Y) is $800B, and C+I+G total $760B. What is its current account balance?",
    opts: ["A $40B surplus", "A $40B deficit", "Exactly balanced"],
    correct: 0,
    exp: "CA = Y − (C+I+G) = 800 − 760 = $40B, a surplus, since the country produces more than it spends domestically."
  },
  {
    concept: "The National Income Identity",
    q: "A country running a persistent current account deficit is, in effect:",
    opts: ["Lending its surplus savings to foreign countries", "Importing present consumption and exporting a claim on future consumption", "Completely self-sufficient with no foreign borrowing"],
    correct: 1,
    exp: "A current account deficit means a country consumes more than it produces, financed by borrowing from abroad — effectively trading future repayment obligations for present consumption."
  },
  {
    concept: "BOP Components",
    q: "Every individual transaction recorded in the balance of payments generates:",
    opts: ["Only a credit entry", "Only a debit entry", "One offsetting debit and one offsetting credit"],
    correct: 2,
    exp: "Double-entry bookkeeping underlies the BOP — every transaction generates matching debit and credit entries, which is exactly why the overall balance of payments always balances by construction."
  }
];

(function(){
  const shell = document.getElementById('quizShell');
  if (!shell) return;
  let current = 0;
  let score = 0;
  const answered = new Array(QUIZ.length).fill(null);

  function renderQuestion(){
    const item = QUIZ[current];
    let html = `<div class="quiz-progress">Question ${current+1} of ${QUIZ.length} &nbsp;·&nbsp; Score so far: ${score}</div>`;
    html += `<div class="quiz-q">${item.q}</div>`;
    html += `<div class="opt-list" id="quizOpts">`;
    item.opts.forEach((opt, i) => {
      html += `<button class="opt-btn" data-i="${i}">${opt}</button>`;
    });
    html += `</div>`;
    html += `<div class="quiz-explain" id="quizExplain">${item.exp}</div>`;
    html += `<div class="quiz-nav">
      <button class="btn ghost" id="quizPrev" ${current===0 ? 'disabled' : ''}>← Previous</button>
      <button class="btn" id="quizNext" disabled>${current === QUIZ.length-1 ? 'See score' : 'Next →'}</button>
    </div>`;
    shell.innerHTML = html;

    const opts = shell.querySelectorAll('.opt-btn');
    const explain = document.getElementById('quizExplain');
    const nextBtn = document.getElementById('quizNext');
    const prevBtn = document.getElementById('quizPrev');

    if (answered[current] !== null){
      opts.forEach(btn => {
        btn.disabled = true;
        const i = +btn.dataset.i;
        if (i === item.correct) btn.classList.add('correct');
        else if (i === answered[current]) btn.classList.add('incorrect');
      });
      explain.classList.add('show');
      nextBtn.disabled = false;
    }

    opts.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered[current] !== null) return;
        const i = +btn.dataset.i;
        answered[current] = i;
        if (i === item.correct) score++;
        if (typeof cfaRecordAnswer === "function" && item.concept){
          cfaRecordAnswer(item.concept, "International Trade & Capital Flows", i === item.correct);
        }
        opts.forEach(b => {
          b.disabled = true;
          const bi = +b.dataset.i;
          if (bi === item.correct) b.classList.add('correct');
          else if (bi === i) b.classList.add('incorrect');
        });
        explain.classList.add('show');
        nextBtn.disabled = false;
        markSectionProgress('sec-quiz');
      });
    });

    nextBtn.addEventListener('click', () => {
      if (current < QUIZ.length - 1){ current++; renderQuestion(); }
      else { renderScore(); }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){ current--; renderQuestion(); }
    });
  }

  function renderScore(){
    const pct = Math.round((score / QUIZ.length) * 100);
    let msg = "Solid foundation — review the sections you missed and try again.";
    if (pct >= 90) msg = "Excellent — you've genuinely internalized this reading.";
    else if (pct >= 70) msg = "Good work — a couple of gaps worth revisiting.";
    shell.innerHTML = `
      <div class="quiz-score">
        <div style="font-family:var(--font-mono); font-size:.8rem; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.08em;">Final score</div>
        <div class="big">${score} / ${QUIZ.length}</div>
        <p style="max-width:46ch; margin:10px auto 22px; color:var(--ink-soft);">${msg}</p>
        <button class="btn" id="quizRestart">Retake the quiz</button>
      </div>`;
    document.getElementById('quizRestart').addEventListener('click', () => {
      current = 0; score = 0;
      answered.fill(null);
      renderQuestion();
    });
  }

  renderQuestion();
})();

  } catch(e) { console.warn('[trade-capital] module script error (safely isolated):', e); }
})();
