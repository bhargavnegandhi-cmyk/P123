// ============================================================
// quant toolkit — bundled module scripts
// Each module's code is isolated in its own IIFE with try/catch,
// so only the relevant module's code actually executes on each page.
// ============================================================

/* ============================================================
   Module: arithmetic
   ============================================================ */
(function(){
  try {
// ============================================================
// Numbers & Arithmetic — interactivity
// ============================================================

function fmt(n, d=4){
  if (!isFinite(n)) return "—";
  // trim trailing zeros for cleaner display
  const s = n.toFixed(d);
  return s.replace(/\.?0+$/, '') || '0';
}
function gcd(a, b){ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b, a%b]; } return a || 1; }
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   01 — Multiplication as repeated addition
   ============================================================ */
(function(){
  const aI = document.getElementById('mulA'), bI = document.getElementById('mulB');
  const chart = document.getElementById('mulChart'), result = document.getElementById('mulResult');
  if (!aI) return;
  function render(){
    const a = Math.max(1, Math.min(12, parseInt(aI.value,10)||1));
    const b = Math.max(1, Math.min(12, parseInt(bI.value,10)||1));
    result.textContent = `${a} × ${b} = ${a*b}`;
    chart.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'flex'; wrap.style.flexDirection='column'; wrap.style.gap='4px';
    for (let g=0; g<a; g++){
      const row = document.createElement('div');
      row.style.display='flex'; row.style.gap='4px';
      for (let i=0; i<b; i++){
        const dot = document.createElement('div');
        dot.style.width='16px'; dot.style.height='16px'; dot.style.borderRadius='50%'; dot.style.background='var(--indigo)';
        row.appendChild(dot);
      }
      wrap.appendChild(row);
    }
    chart.appendChild(wrap);
  }
  [aI,bI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   02 — Number line
   ============================================================ */
(function(){
  const container = document.getElementById('numberLineChart');
  const startI = document.getElementById('nlStart'), addI = document.getElementById('nlAdd');
  const result = document.getElementById('nlResult');
  if (!container) return;
  function render(){
    const start = parseFloat(startI ? startI.value : -3) || 0;
    const add = parseFloat(addI ? addI.value : 7) || 0;
    const end = start + add;
    if (result) result.textContent = `${start} + (${add}) = ${end}`;

    const W=520, H=110, padL=30, padR=30;
    const domainMin = Math.min(-10, start-2, end-2), domainMax = Math.max(10, start+2, end+2);
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'number-line-svg', style:'max-width:560px;'});
    const y = 55;
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:y, y2:y, stroke:'#4A4763', 'stroke-width':1.5}));
    for (let v=Math.ceil(domainMin); v<=Math.floor(domainMax); v++){
      const x = xScale(v);
      svg.appendChild(svgEl('line', {x1:x, x2:x, y1:y-5, y2:y+5, stroke:'#E3DCC9', 'stroke-width':1}));
      if (v % 2 === 0){
        const t = svgEl('text', {x, y:y+20, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
        t.textContent = v;
        svg.appendChild(t);
      }
    }
    // arrow from start to end
    svg.appendChild(svgEl('line', {x1:xScale(start), x2:xScale(end), y1:y-20, y2:y-20, stroke:'#C77F1E', 'stroke-width':2}));
    svg.appendChild(svgEl('circle', {cx:xScale(start), cy:y, r:5, fill:'#2B2560', stroke:'#fff', 'stroke-width':1.5}));
    svg.appendChild(svgEl('circle', {cx:xScale(end), cy:y, r:5, fill:'#2F8F6B', stroke:'#fff', 'stroke-width':1.5}));
    const startLbl = svgEl('text', {x:xScale(start), y:y-26, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#2B2560', 'font-weight':'700'});
    startLbl.textContent = 'start: '+start;
    svg.appendChild(startLbl);
    const endLbl = svgEl('text', {x:xScale(end), y:y-26, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#2F8F6B', 'font-weight':'700'});
    endLbl.textContent = 'end: '+end;
    svg.appendChild(endLbl);
    container.innerHTML = '';
    container.appendChild(svg);
  }
  [startI, addI].forEach(el => el && el.addEventListener('input', render));
  render();
})();

/* ============================================================
   03 — Fraction / decimal / percentage converter + pie chart
   ============================================================ */
(function(){
  const numI = document.getElementById('fracNum'), denI = document.getElementById('fracDen');
  const out = document.getElementById('fracOut');
  const pieContainer = document.getElementById('pieChart');
  if (!numI) return;
  function render(){
    const num = parseFloat(numI.value), den = parseFloat(denI.value);
    if (isNaN(num) || isNaN(den) || den === 0){
      out.innerHTML = '<div class="stat-readout"><div class="k">—</div><div class="v">Check inputs</div></div>';
      return;
    }
    const decimal = num/den;
    const pct = decimal*100;
    const g = gcd(Math.round(num), Math.round(den));
    const simplified = (Number.isInteger(num) && Number.isInteger(den) && g>1) ? ` (${num/g}/${den/g})` : '';
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Fraction</div><div class="v">${num}/${den}${simplified}</div></div>
      <div class="stat-readout"><div class="k">Decimal</div><div class="v">${fmt(decimal,4)}</div></div>
      <div class="stat-readout"><div class="k">Percentage</div><div class="v">${fmt(pct,2)}%</div></div>
    `;
    if (pieContainer){
      const frac = Math.max(0, Math.min(1, decimal));
      const W=200, H=200, r=80, cx=100, cy=100;
      const angle = frac*2*Math.PI;
      const x1 = cx, y1 = cy-r;
      const x2 = cx + r*Math.sin(angle), y2 = cy - r*Math.cos(angle);
      const largeArc = angle > Math.PI ? 1 : 0;
      const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'160', height:'160', class:'pie-svg', style:'display:block; margin:0 auto;'});
      svg.appendChild(svgEl('circle', {cx, cy, r, fill:'#F3EEE3', stroke:'#E3DCC9', 'stroke-width':1.5}));
      if (frac > 0.001 && frac < 0.999){
        const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
        svg.appendChild(svgEl('path', {d:path, fill:'#2B2560'}));
      } else if (frac >= 0.999){
        svg.appendChild(svgEl('circle', {cx, cy, r, fill:'#2B2560'}));
      }
      const label = svgEl('text', {x:cx, y:cy+5, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':16, fill:'#1C1B29', 'font-weight':'700', style:'mix-blend-mode:difference; fill:#fff;'});
      pieContainer.innerHTML = '';
      pieContainer.appendChild(svg);
      const capt = document.createElement('p');
      capt.style.textAlign = 'center'; capt.style.fontFamily='var(--font-mono)'; capt.style.fontSize='.85rem'; capt.style.color='var(--ink-soft)'; capt.style.marginTop='8px';
      capt.textContent = `${num}/${den} = ${fmt(decimal,3)} = ${fmt(pct,1)}%`;
      pieContainer.appendChild(capt);
    }
  }
  [numI,denI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   04 — BODMAS expression evaluator (safe hand-written parser)
   ============================================================ */
(function(){
  const input = document.getElementById('bodmasInput');
  const result = document.getElementById('bodmasResult');
  if (!input) return;

  function tokenize(str){
    const tokens = [];
    let i = 0;
    while (i < str.length){
      const c = str[i];
      if (/\s/.test(c)){ i++; continue; }
      if (/[0-9.]/.test(c)){
        let num = '';
        while (i < str.length && /[0-9.]/.test(str[i])){ num += str[i]; i++; }
        tokens.push({type:'num', value: parseFloat(num)});
        continue;
      }
      if ('+-*/^()'.includes(c)){
        tokens.push({type:'op', value:c});
        i++;
        continue;
      }
      throw new Error('Unexpected character: ' + c);
    }
    return tokens;
  }

  // Recursive-descent parser respecting BODMAS: () then ^ then */ then +-
  function parse(tokens){
    let pos = 0;
    function peek(){ return tokens[pos]; }
    function consume(){ return tokens[pos++]; }

    function parseExpr(){ // + and -
      let left = parseTerm();
      while (peek() && peek().type==='op' && (peek().value==='+' || peek().value==='-')){
        const op = consume().value;
        const right = parseTerm();
        left = op === '+' ? left+right : left-right;
      }
      return left;
    }
    function parseTerm(){ // * and /
      let left = parsePower();
      while (peek() && peek().type==='op' && (peek().value==='*' || peek().value==='/')){
        const op = consume().value;
        const right = parsePower();
        left = op === '*' ? left*right : left/right;
      }
      return left;
    }
    function parsePower(){ // ^
      let left = parseUnary();
      if (peek() && peek().type==='op' && peek().value==='^'){
        consume();
        const right = parsePower(); // right-associative
        left = Math.pow(left, right);
      }
      return left;
    }
    function parseUnary(){
      if (peek() && peek().type==='op' && peek().value==='-'){
        consume();
        return -parseUnary();
      }
      return parseAtom();
    }
    function parseAtom(){
      const t = peek();
      if (t && t.type==='num'){ consume(); return t.value; }
      if (t && t.type==='op' && t.value==='('){
        consume();
        const v = parseExpr();
        if (peek() && peek().value===')') consume();
        return v;
      }
      throw new Error('Unexpected token');
    }
    const val = parseExpr();
    return val;
  }

  function render(){
    try {
      const tokens = tokenize(input.value);
      const val = parse(tokens);
      result.textContent = `= ${fmt(val,6)}`;
    } catch(e){
      result.textContent = 'Check the expression';
    }
  }
  input.addEventListener('input', render);
  render();
})();

/* ============================================================
   05 — Proportion solver
   ============================================================ */
(function(){
  const aI = document.getElementById('propA'), bI = document.getElementById('propB'), cI = document.getElementById('propC');
  const result = document.getElementById('propResult'), steps = document.getElementById('propSteps');
  if (!aI) return;
  function render(){
    const a = parseFloat(aI.value), b = parseFloat(bI.value), c = parseFloat(cI.value);
    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0){
      result.textContent = 'Check inputs'; steps.textContent=''; return;
    }
    const x = (b*c)/a;
    result.textContent = `x = ${fmt(x,4)}`;
    steps.textContent = `${a}/${b} = ${c}/x → ${a}x = ${b}×${c} → x = ${fmt(b*c,2)}/${a} = ${fmt(x,4)}`;
  }
  [aI,bI,cI].forEach(el => el.addEventListener('input', render));
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
const sectionIds = ['sec-operations','sec-negatives','sec-fractions','sec-bodmas','sec-ratios','sec-wordproblems','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-arithmetic', String(pct)); } catch(e) {}
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
    concept: "The Four Operations",
    q: "What does 5 × 6 actually represent?",
    opts: ["5 added to 6", "Five groups of six, added together", "6 taken away from 5, five times"],
    correct: 1,
    exp: "Multiplication is repeated addition: 5 × 6 = 6+6+6+6+6 = 30, five groups of six."
  },
  {
    concept: "The Four Operations",
    q: "A shopkeeper has ₹340 and spends ₹95. How much remains?",
    opts: ["₹235", "₹245", "₹435"],
    correct: 1,
    exp: "340 − 95 = 245."
  },
  {
    concept: "The Four Operations",
    q: "18 ÷ 3 asks which question?",
    opts: ["How many groups of 3 fit inside 18?", "How many times does 18 fit inside 3?", "What is 18 plus 3?"],
    correct: 0,
    exp: "Division asks how many equal groups fit — 18 ÷ 3 = 6, because six groups of 3 make 18."
  },
  {
    concept: "Negative Numbers",
    q: "What is 8 − (−5)?",
    opts: ["3", "13", "−13"],
    correct: 1,
    exp: "Subtracting a negative flips to addition: 8 − (−5) = 8 + 5 = 13."
  },
  {
    concept: "Negative Numbers",
    q: "What is (−6) × (−4)?",
    opts: ["−24", "24", "−10"],
    correct: 1,
    exp: "Multiplying two negatives gives a positive: (−6) × (−4) = 24."
  },
  {
    concept: "Negative Numbers",
    q: "A hiker starts at an elevation of −45 meters (below a reference point) and climbs 70 meters. What is the new elevation?",
    opts: ["25 meters", "−115 meters", "115 meters"],
    correct: 0,
    exp: "−45 + 70 = 25 meters, now above the reference point."
  },
  {
    concept: "Fractions, Decimals & Percentages",
    q: "What is 5/8 written as a decimal?",
    opts: ["0.58", "0.625", "1.6"],
    correct: 1,
    exp: "5 ÷ 8 = 0.625."
  },
  {
    concept: "Fractions, Decimals & Percentages",
    q: "What is 0.4 written as a percentage?",
    opts: ["4%", "0.4%", "40%"],
    correct: 2,
    exp: "Multiply the decimal by 100: 0.4 × 100 = 40%."
  },
  {
    concept: "Fractions, Decimals & Percentages",
    q: "Using the '10% then adjust' method, what is 15% of 380?",
    opts: ["38", "57", "76"],
    correct: 1,
    exp: "10% of 380 = 38. Half of that (5%) = 19. 15% = 38 + 19 = 57."
  },
  {
    concept: "Order of Operations (BODMAS)",
    q: "Evaluate: 3 + 4 × 2",
    opts: ["14", "11", "10"],
    correct: 1,
    exp: "Multiplication before addition (BODMAS): 4×2=8, then 3+8=11."
  },
  {
    concept: "Order of Operations (BODMAS)",
    q: "Evaluate: (6 + 2) × 3 − 4",
    opts: ["20", "18", "14"],
    correct: 0,
    exp: "Brackets first: 6+2=8. Then multiplication: 8×3=24. Then subtraction: 24−4=20."
  },
  {
    concept: "Order of Operations (BODMAS)",
    q: "Evaluate: 20 ÷ 4 × 2",
    opts: ["2.5", "10", "20"],
    correct: 1,
    exp: "Division and multiplication share equal priority and go left to right: 20÷4=5, then 5×2=10."
  },
  {
    concept: "Order of Operations (BODMAS)",
    q: "In BODMAS, which comes first: brackets, or orders (powers/roots)?",
    opts: ["Orders always come first", "Brackets always come first", "They're solved simultaneously"],
    correct: 1,
    exp: "Brackets are resolved first, before powers, roots, or any other operation."
  },
  {
    concept: "Ratios & Proportions",
    q: "If 4 workers can paint a fence in 10 days, roughly how many days would 8 workers (at the same rate) take?",
    opts: ["20 days", "5 days", "10 days"],
    correct: 1,
    exp: "Doubling the workers halves the time needed for the same total work: 5 days."
  },
  {
    concept: "Ratios & Proportions",
    q: "Solve the proportion: 3/9 = 5/x. What is x?",
    opts: ["15", "1.67", "45"],
    correct: 0,
    exp: "Cross-multiply: 3x = 9×5 = 45, so x = 45/3 = 15."
  },
  {
    concept: "Fractions, Decimals & Percentages",
    q: "A ₹1,200 item is marked down by 30%. What is the sale price?",
    opts: ["₹360", "₹840", "₹900"],
    correct: 1,
    exp: "30% of 1,200 = 360. Sale price = 1,200 − 360 = ₹840."
  },
  {
    concept: "Fractions, Decimals & Percentages",
    q: "A quantity rises from 400 to 500. What is the percentage increase?",
    opts: ["20%", "25%", "100%"],
    correct: 1,
    exp: "Percentage increase = (change)/(original) = (500−400)/400 = 100/400 = 25%."
  },
  {
    concept: "Ratios & Proportions",
    q: "\"A recipe uses 2 eggs for every 3 cups of flour.\" If you use 9 cups of flour, how many eggs (keeping the same ratio)?",
    opts: ["6 eggs", "4.5 eggs", "13.5 eggs"],
    correct: 0,
    exp: "The ratio 2:3 scaled up: 9 cups is 3 times 3 cups, so eggs also multiply by 3: 2×3 = 6 eggs."
  },
  {
    concept: "Turning Words Into Math",
    q: "\"Reduced to only 60% of its original price\" means the same thing as which single operation?",
    opts: ["A 60% discount", "A 40% discount", "A 60% increase"],
    correct: 1,
    exp: "If only 60% of the original price remains, then 40% has been removed — a 40% discount."
  },
  {
    concept: "Turning Words Into Math",
    q: "After solving a word problem about a discount, why is it useful to restate the answer as a full sentence and check if it's reasonable?",
    opts: ["It's required by convention", "It helps catch errors, like a sale price ending up higher than the original", "It has no real benefit"],
    correct: 1,
    exp: "Sanity-checking the final answer against common sense — a discounted price should never exceed the original — is a reliable way to catch a flipped or misapplied step."
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
          cfaRecordAnswer(item.concept, "Numbers & Arithmetic", i === item.correct);
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
    if (pct >= 90) msg = "Excellent — this is genuinely solid ground to build on.";
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

  } catch(e) { console.warn('[arithmetic] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: distributions
   ============================================================ */
(function(){
  try {
// ============================================================
// Common Probability Distributions — interactivity
// ============================================================

/* ---------- math helpers ---------- */
function factorial(n){
  n = Math.round(n);
  if (n < 0) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function combination(n, x){
  if (x < 0 || x > n) return 0;
  return factorial(n) / (factorial(n-x) * factorial(x));
}
function binomialPMF(n, p, x){
  return combination(n, x) * Math.pow(p, x) * Math.pow(1-p, n-x);
}
// Standard normal CDF via Abramowitz & Stegun 7.1.26 approximation (erf-based)
function erf(x){
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429, p=0.3275911;
  const t = 1/(1+p*x);
  const y = 1 - (((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
  return sign*y;
}
function normCDF(z){
  return 0.5 * (1 + erf(z/Math.sqrt(2)));
}
function normPDF(x, mu=0, sigma=1){
  return Math.exp(-0.5*Math.pow((x-mu)/sigma,2)) / (sigma*Math.sqrt(2*Math.PI));
}
// Lanczos approximation for the Gamma function
function gamma(z){
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5){
    return Math.PI / (Math.sin(Math.PI*z) * gamma(1-z));
  }
  z -= 1;
  let x = c[0];
  for (let i=1; i<g+2; i++) x += c[i]/(z+i);
  const t = z + g + 0.5;
  return Math.sqrt(2*Math.PI) * Math.pow(t, z+0.5) * Math.exp(-t) * x;
}
function tPDF(x, df){
  const num = gamma((df+1)/2);
  const den = Math.sqrt(df*Math.PI) * gamma(df/2);
  return (num/den) * Math.pow(1 + (x*x)/df, -(df+1)/2);
}
function chiSqPDF(x, k){
  if (x <= 0) return 0;
  const num = Math.pow(x, k/2 - 1) * Math.exp(-x/2);
  const den = Math.pow(2, k/2) * gamma(k/2);
  return num/den;
}
function fmtP(n, d=4){ return isFinite(n) ? n.toFixed(d) : "—"; }
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   02 — Discrete uniform explorer
   ============================================================ */
(function(){
  const nI = document.getElementById('duN'), x1I = document.getElementById('duX1'), x2I = document.getElementById('duX2');
  const chart = document.getElementById('duChart'), result = document.getElementById('duResult'), steps = document.getElementById('duSteps');
  if (!nI) return;
  function render(){
    const n = Math.max(2, parseInt(nI.value,10) || 2);
    let x1 = parseInt(x1I.value,10), x2 = parseInt(x2I.value,10);
    if (x1 > x2) [x1,x2] = [x2,x1];
    const p = 1/n;
    chart.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'flex'; wrap.style.gap = '3px'; wrap.style.alignItems = 'flex-end'; wrap.style.height = '90px';
    for (let x=1; x<=n; x++){
      const col = document.createElement('div');
      col.style.flex = '1'; col.style.display = 'flex'; col.style.flexDirection='column'; col.style.alignItems='center'; col.style.justifyContent='flex-end'; col.style.height='100%';
      const bar = document.createElement('div');
      bar.style.width = '100%'; bar.style.height = '70px';
      bar.style.background = (x>=x1 && x<=x2) ? 'var(--amber-deep)' : 'var(--indigo)';
      bar.style.borderRadius = '3px 3px 0 0';
      col.appendChild(bar);
      const lbl = document.createElement('div');
      lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.65rem'; lbl.style.marginTop='4px'; lbl.style.color='var(--ink-soft)';
      lbl.textContent = x;
      col.appendChild(lbl);
      wrap.appendChild(col);
    }
    chart.appendChild(wrap);
    const Fx2 = x2/n, Fx1minus1 = (x1-1)/n;
    const prob = Fx2 - Fx1minus1;
    result.textContent = `P(${x1} ≤ X ≤ ${x2}) = ${fmtP(prob,4)}`;
    steps.textContent = `F(${x2}) − F(${x1-1}) = ${fmtP(Fx2,3)} − ${fmtP(Fx1minus1,3)} = ${fmtP(prob,4)}`;
  }
  [nI,x1I,x2I].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   03 — Continuous uniform explorer
   ============================================================ */
(function(){
  const aI = document.getElementById('cuA'), bI = document.getElementById('cuB'), xI = document.getElementById('cuX');
  const chart = document.getElementById('cuChart'), result = document.getElementById('cuResult'), steps = document.getElementById('cuSteps');
  if (!aI) return;
  function render(){
    const a = parseFloat(aI.value), b = parseFloat(bI.value), x = parseFloat(xI.value);
    const W=460, H=130, padL=36, padB=24, padT=10, padR=16;
    const domainMin = a - (b-a)*0.15, domainMax = b + (b-a)*0.15;
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const height = H - padT - padB;
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:480px;'});
    // baseline
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#4A4763', 'stroke-width':1}));
    // shaded region a to x
    const clampedX = Math.max(a, Math.min(b, x));
    svg.appendChild(svgEl('rect', {x:xScale(a), y:padT, width:xScale(clampedX)-xScale(a), height:height, fill:'#E8A33D', 'fill-opacity':0.35}));
    // pdf rectangle outline
    svg.appendChild(svgEl('rect', {x:xScale(a), y:padT, width:xScale(b)-xScale(a), height:height, fill:'none', stroke:'#2B2560', 'stroke-width':2}));
    // labels
    [a,b].forEach(v => {
      const t = svgEl('text', {x:xScale(v), y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#1C1B29'});
      t.textContent = v;
      svg.appendChild(t);
    });
    if (x>=a && x<=b){
      svg.appendChild(svgEl('line', {x1:xScale(x), x2:xScale(x), y1:padT, y2:H-padB, stroke:'#C77F1E', 'stroke-width':2, 'stroke-dasharray':'3,2'}));
      const t = svgEl('text', {x:xScale(x), y:padT-2, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#C77F1E', 'font-weight':'600'});
      t.textContent = 'x='+x;
      svg.appendChild(t);
    }
    chart.innerHTML = '';
    chart.appendChild(svg);

    const mean = (a+b)/2, variance = Math.pow(b-a,2)/12;
    let Fx;
    if (x < a) Fx = 0; else if (x > b) Fx = 1; else Fx = (x-a)/(b-a);
    result.textContent = `F(${x}) = ${fmtP(Fx,3)}`;
    steps.textContent = `(${x}−${a})/(${b}−${a}) = ${fmtP(Fx,3)} · μ=${fmtP(mean,3)} · σ²=${fmtP(variance,4)}`;
  }
  [aI,bI,xI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   04 — Binomial tree visualization (n=4, static)
   ============================================================ */
(function(){
  const container = document.getElementById('binomialTreeChart');
  if (!container) return;
  const n = 4;
  const W = 560, H = 260, padL = 30, padR = 30;
  const xStep = (W - padL - padR) / n;
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:600px;'});
  // compute node positions: at period t, there are t+1 nodes, indexed by number of up-moves (0..t)
  function yForNode(t, ups){
    // center nodes vertically; more ups = higher (lower y)
    const spread = 200;
    const mid = H/2;
    if (t === 0) return mid;
    const step = spread / (2*n);
    return mid - (ups - t/2) * step * 2;
  }
  // draw edges
  for (let t=0; t<n; t++){
    for (let ups=0; ups<=t; ups++){
      const x1 = padL + t*xStep, y1 = yForNode(t, ups);
      // up edge
      const x2u = padL + (t+1)*xStep, y2u = yForNode(t+1, ups+1);
      svg.appendChild(svgEl('line', {x1, y1, x2:x2u, y2:y2u, stroke:'#2F8F6B', 'stroke-width':1.3, 'stroke-opacity':0.6}));
      // down edge
      const y2d = yForNode(t+1, ups);
      svg.appendChild(svgEl('line', {x1, y1, x2:x2u, y2:y2d, stroke:'#D6573F', 'stroke-width':1.3, 'stroke-opacity':0.6}));
    }
  }
  // draw nodes + labels at final period with path counts
  for (let t=0; t<=n; t++){
    for (let ups=0; ups<=t; ups++){
      const x = padL + t*xStep, y = yForNode(t, ups);
      svg.appendChild(svgEl('circle', {cx:x, cy:y, r: t===n ? 5 : 3, fill: t===n ? '#E8A33D' : '#2B2560', stroke:'#fff', 'stroke-width':1}));
      if (t === n){
        const paths = combination(n, ups);
        const txt = svgEl('text', {x:x+8, y:y+3, 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#1C1B29'});
        txt.textContent = `${ups} up: ${paths} path${paths===1?'':'s'}`;
        svg.appendChild(txt);
      }
    }
  }
  // period labels
  for (let t=0; t<=n; t++){
    const x = padL + t*xStep;
    const txt = svgEl('text', {x, y:H-6, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    txt.textContent = 't='+t;
    svg.appendChild(txt);
  }
  container.appendChild(svg);
})();

/* ============================================================
   04b — Binomial probability calculator + distribution chart
   ============================================================ */
(function(){
  const nI = document.getElementById('binN'), pI = document.getElementById('binP'), xI = document.getElementById('binX');
  const chart = document.getElementById('binChart'), result = document.getElementById('binResult'), steps = document.getElementById('binSteps');
  if (!nI) return;
  function render(){
    const n = Math.max(1, Math.min(30, parseInt(nI.value,10) || 1));
    const p = Math.max(0, Math.min(1, parseFloat(pI.value)));
    const x = Math.max(0, Math.min(n, parseInt(xI.value,10) || 0));
    const probs = [];
    for (let k=0; k<=n; k++) probs.push(binomialPMF(n,p,k));
    const max = Math.max(...probs);
    chart.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display='flex'; wrap.style.gap='2px'; wrap.style.alignItems='flex-end'; wrap.style.height='120px'; wrap.style.overflowX='auto';
    probs.forEach((pr, k) => {
      const col = document.createElement('div');
      col.style.flex='1 0 auto'; col.style.minWidth='16px'; col.style.display='flex'; col.style.flexDirection='column'; col.style.alignItems='center'; col.style.justifyContent='flex-end'; col.style.height='100%';
      const bar = document.createElement('div');
      bar.style.width='100%'; bar.style.height = Math.max(2,(pr/max*90))+'px';
      bar.style.background = k===x ? 'var(--amber-deep)' : 'var(--indigo)';
      bar.style.borderRadius='2px 2px 0 0';
      bar.title = `p(${k}) = ${pr.toFixed(4)}`;
      col.appendChild(bar);
      const lbl = document.createElement('div');
      lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.6rem'; lbl.style.marginTop='3px'; lbl.style.color='var(--ink-soft)';
      lbl.textContent = k;
      col.appendChild(lbl);
      wrap.appendChild(col);
    });
    chart.appendChild(wrap);
    const px = binomialPMF(n,p,x);
    result.textContent = `p(${x}) = ${fmtP(px,4)}`;
    steps.textContent = `${n}C${x} × ${fmtP(p,3)}^${x} × ${fmtP(1-p,3)}^${n-x} = ${fmtP(combination(n,x),0)} × ${fmtP(px/combination(n,x),6)} = ${fmtP(px,4)}`;
  }
  [nI,pI,xI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   05 — Binomial mean/variance calculator
   ============================================================ */
(function(){
  const nI = document.getElementById('bmN'), pI = document.getElementById('bmP');
  const out = document.getElementById('bmOut');
  if (!nI) return;
  function render(){
    const n = parseFloat(nI.value), p = parseFloat(pI.value);
    const mean = n*p, variance = n*p*(1-p), sd = Math.sqrt(variance);
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Mean</div><div class="v">${fmtP(mean,3)}</div></div>
      <div class="stat-readout"><div class="k">Variance</div><div class="v">${fmtP(variance,3)}</div></div>
      <div class="stat-readout"><div class="k">Std Dev</div><div class="v">${fmtP(sd,3)}</div></div>
    `;
  }
  [nI,pI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   06 — Two normals comparison (static chart)
   ============================================================ */
(function(){
  const container = document.getElementById('twoNormalsChart');
  if (!container) return;
  const W=460, H=200, padL=20, padR=20, padT=10, padB=24;
  const domainMin=-8, domainMax=8;
  const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
  const maxPdf = normPDF(0,0,1);
  const yScale = v => (H-padB) - (v/maxPdf)*(H-padT-padB);
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:480px;'});
  svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
  [[1,'#2B2560','σ=1'],[2,'#E8A33D','σ=2']].forEach(([sigma,color,label]) => {
    let d = '';
    for (let x=domainMin; x<=domainMax; x+=0.1){
      const px = xScale(x), py = yScale(normPDF(x,0,sigma));
      d += (x===domainMin ? 'M':'L') + px + ',' + py + ' ';
    }
    svg.appendChild(svgEl('path', {d, fill:'none', stroke:color, 'stroke-width':2.2}));
  });
  [-6,-4,-2,0,2,4,6].forEach(v => {
    const t = svgEl('text', {x:xScale(v), y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    t.textContent = v;
    svg.appendChild(t);
  });
  container.appendChild(svg);
  const legend = document.createElement('div');
  legend.style.display='flex'; legend.style.gap='16px'; legend.style.marginTop='8px'; legend.style.fontFamily='var(--font-mono)'; legend.style.fontSize='.75rem';
  legend.innerHTML = `<span><span style="display:inline-block;width:10px;height:10px;background:#2B2560;border-radius:2px;margin-right:5px;"></span>μ=0, σ=1</span><span><span style="display:inline-block;width:10px;height:10px;background:#E8A33D;border-radius:2px;margin-right:5px;"></span>μ=0, σ=2</span>`;
  container.appendChild(legend);
})();

/* ============================================================
   07 — Empirical rule chart with sigma buttons
   ============================================================ */
(function(){
  const container = document.getElementById('empiricalRuleChart');
  const btnRow = document.getElementById('sigmaBtnRow');
  if (!container) return;
  const pctMap = {1:68, 2:95, 3:99};
  function render(k){
    const W=520, H=220, padL=24, padR=24, padT=10, padB=24;
    const domainMin=-4, domainMax=4;
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const maxPdf = normPDF(0);
    const yScale = v => (H-padB) - (v/maxPdf)*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:560px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
    // shaded area path
    let areaD = `M${xScale(-k)},${H-padB} `;
    for (let x=-k; x<=k; x+=0.05){
      areaD += `L${xScale(x)},${yScale(normPDF(x))} `;
    }
    areaD += `L${xScale(k)},${H-padB} Z`;
    svg.appendChild(svgEl('path', {d:areaD, fill:'#E8A33D', 'fill-opacity':0.4}));
    // curve
    let d = '';
    for (let x=domainMin; x<=domainMax; x+=0.05){
      const px=xScale(x), py=yScale(normPDF(x));
      d += (x===domainMin?'M':'L')+px+','+py+' ';
    }
    svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2B2560', 'stroke-width':2}));
    // markers
    [-k,0,k].forEach(v => {
      svg.appendChild(svgEl('line', {x1:xScale(v), x2:xScale(v), y1:yScale(normPDF(v)), y2:H-padB, stroke:'#C77F1E', 'stroke-width':1, 'stroke-dasharray':'2,2'}));
    });
    [-3,-2,-1,0,1,2,3].forEach(v => {
      const t = svgEl('text', {x:xScale(v), y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
      t.textContent = (v>0?'+':'')+v+'σ';
      svg.appendChild(t);
    });
    const pctText = svgEl('text', {x:W/2, y:padT+14, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':13, fill:'#C77F1E', 'font-weight':'700'});
    pctText.textContent = `~${pctMap[k]}% of observations`;
    svg.appendChild(pctText);
    container.innerHTML = '';
    container.appendChild(svg);
  }
  btnRow.querySelectorAll('.sigma-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btnRow.querySelectorAll('.sigma-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      render(parseInt(btn.dataset.k,10));
    });
  });
  render(2);
})();

/* ============================================================
   08 — Z-score & normal probability calculator
   ============================================================ */
(function(){
  const xI = document.getElementById('zX'), muI = document.getElementById('zMu'), sigmaI = document.getElementById('zSigma');
  const out = document.getElementById('zOut');
  if (!xI) return;
  function render(){
    const X = parseFloat(xI.value), mu = parseFloat(muI.value), sigma = parseFloat(sigmaI.value);
    const z = (X-mu)/sigma;
    const pBelow = normCDF(z);
    const pAbove = 1 - pBelow;
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Z-score</div><div class="v">${fmtP(z,3)}</div></div>
      <div class="stat-readout"><div class="k">P(X≤x)</div><div class="v">${(pBelow*100).toFixed(2)}%</div></div>
      <div class="stat-readout"><div class="k">P(X&gt;x)</div><div class="v">${(pAbove*100).toFixed(2)}%</div></div>
    `;
  }
  [xI,muI,sigmaI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   09 — t-distribution vs normal chart (df slider)
   ============================================================ */
(function(){
  const container = document.getElementById('tDistChart');
  const dfI = document.getElementById('tDf');
  if (!container) return;
  function render(){
    const df = Math.max(1, Math.min(30, parseInt(dfI.value,10) || 4));
    const W=520, H=220, padL=24, padR=24, padT=10, padB=24;
    const domainMin=-5, domainMax=5;
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const maxPdf = Math.max(normPDF(0), tPDF(0,df));
    const yScale = v => (H-padB) - (v/maxPdf)*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:560px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
    // normal dashed
    let dN = '';
    for (let x=domainMin; x<=domainMax; x+=0.08){
      const px=xScale(x), py=yScale(normPDF(x));
      dN += (x===domainMin?'M':'L')+px+','+py+' ';
    }
    svg.appendChild(svgEl('path', {d:dN, fill:'none', stroke:'#9c94c9', 'stroke-width':1.8, 'stroke-dasharray':'5,4'}));
    // t curve
    let dT = '';
    for (let x=domainMin; x<=domainMax; x+=0.08){
      const px=xScale(x), py=yScale(tPDF(x,df));
      dT += (x===domainMin?'M':'L')+px+','+py+' ';
    }
    svg.appendChild(svgEl('path', {d:dT, fill:'none', stroke:'#C77F1E', 'stroke-width':2.4}));
    [-4,-2,0,2,4].forEach(v => {
      const t = svgEl('text', {x:xScale(v), y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
      t.textContent = v;
      svg.appendChild(t);
    });
    container.innerHTML = '';
    container.appendChild(svg);
    const legend = document.createElement('div');
    legend.style.display='flex'; legend.style.gap='16px'; legend.style.marginTop='8px'; legend.style.fontFamily='var(--font-mono)'; legend.style.fontSize='.75rem';
    legend.innerHTML = `<span><span style="display:inline-block;width:14px;height:2px;background:#C77F1E;margin-right:5px;vertical-align:middle;"></span>t-distribution (df=${df})</span><span><span style="display:inline-block;width:14px;height:2px;background:#9c94c9;margin-right:5px;vertical-align:middle; border-top:2px dashed #9c94c9;"></span>Standard normal</span>`;
    container.appendChild(legend);
  }
  dfI.addEventListener('input', render);
  render();
})();

/* ============================================================
   10 — Chi-square chart (df slider)
   ============================================================ */
(function(){
  const container = document.getElementById('chiSqChart');
  const dfI = document.getElementById('chiDf');
  if (!container) return;
  function render(){
    const k = Math.max(1, Math.min(15, parseInt(dfI.value,10) || 3));
    const W=520, H=200, padL=24, padR=24, padT=10, padB=24;
    const domainMax = Math.max(10, k*3);
    const xScale = v => padL + (v/domainMax)*(W-padL-padR);
    // find approx max pdf value by sampling
    let maxPdf = 0;
    for (let x=0.05; x<=domainMax; x+=0.05){ maxPdf = Math.max(maxPdf, chiSqPDF(x,k)); }
    const yScale = v => (H-padB) - (v/maxPdf)*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:560px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
    let d = '';
    for (let x=0.02; x<=domainMax; x+=0.05){
      const px=xScale(x), py=yScale(chiSqPDF(x,k));
      d += (x===0.02?'M':'L')+px+','+py+' ';
    }
    svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2F8F6B', 'stroke-width':2.4}));
    for (let v=0; v<=domainMax; v+=Math.ceil(domainMax/8)){
      const t = svgEl('text', {x:xScale(v), y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
      t.textContent = v;
      svg.appendChild(t);
    }
    container.innerHTML = '';
    container.appendChild(svg);
    const lbl = document.createElement('div');
    lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.75rem'; lbl.style.color='var(--ink-soft)'; lbl.style.marginTop='6px';
    lbl.textContent = `Chi-square distribution, df=${k} — note the long right tail and the boundary at zero.`;
    container.appendChild(lbl);
  }
  dfI.addEventListener('input', render);
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
const sectionIds = ['sec-basics','sec-discreteuniform','sec-continuousuniform','sec-binomial','sec-binomialapp','sec-normal','sec-normalprob','sec-standardize','sec-tdist','sec-chisq','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-distributions', String(pct)); } catch(e) {}
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
    concept: "Random Variables & Distributions",
    q: "The number of central bank board members voting for a rate hike is an example of a:",
    opts: ["Continuous random variable", "Discrete random variable", "Neither — it's not random"],
    correct: 1,
    exp: "It's a countable, finite quantity (0 up to the number of members) — the definition of a discrete random variable."
  },
  {
    concept: "Random Variables & Distributions",
    q: "For a continuous random variable, what is the probability that it takes on any single exact value?",
    opts: ["It equals the pdf value at that point", "It is always exactly 0", "It depends on the distribution's mean"],
    correct: 1,
    exp: "Continuous random variables have infinitely many possible values in any interval, so the probability of hitting any one exact value is always 0 — only ranges carry positive probability."
  },
  {
    concept: "Discrete Uniform",
    q: "A discrete uniform random variable has outcomes 1 through 12, equally likely. What is F(5)?",
    opts: ["1/12", "5/12", "7/12"],
    correct: 1,
    exp: "F(5) = P(X ≤ 5) = 5 × (1/12) = 5/12, since 5 of the 12 equally likely outcomes are at or below 5."
  },
  {
    concept: "Continuous Uniform",
    q: "X is continuous uniform between a=20 and b=50. What is the mean?",
    opts: ["30", "35", "50"],
    correct: 1,
    exp: "μ = (a+b)/2 = (20+50)/2 = 35."
  },
  {
    concept: "Continuous Uniform",
    q: "X is continuous uniform between 0 and 10. What is P(3 ≤ X ≤ 7)?",
    opts: ["0.30", "0.40", "0.70"],
    correct: 1,
    exp: "P(3≤X≤7) = (7−3)/(10−0) = 4/10 = 0.40 — the interval's share of the total width."
  },
  {
    concept: "The Binomial Distribution",
    q: "Which of these is NOT one of the two core assumptions behind the binomial distribution?",
    opts: ["The probability of success is constant across trials", "The trials are independent", "The number of trials must be at least 30"],
    correct: 2,
    exp: "The binomial model requires constant p and independent trials — there's no minimum sample size requirement."
  },
  {
    concept: "The Binomial Distribution",
    q: "In a binomial model with n=6, how many distinct sequences produce exactly 4 successes?",
    opts: ["24", "15", "6"],
    correct: 1,
    exp: "₆C₄ = 6!/(2!4!) = 15."
  },
  {
    concept: "Mean, Variance & Applications",
    q: "A binomial random variable has n=20 and p=0.4. What is its mean?",
    opts: ["8", "0.4", "20"],
    correct: 0,
    exp: "E(X) = np = 20 × 0.4 = 8."
  },
  {
    concept: "Mean, Variance & Applications",
    q: "A binomial random variable has n=16, p=0.25. What is its variance?",
    opts: ["4.0", "3.0", "12.0"],
    correct: 1,
    exp: "Var(X) = np(1−p) = 16 × 0.25 × 0.75 = 3.0."
  },
  {
    concept: "The Binomial Distribution",
    q: "A binomial distribution with p exactly equal to 0.50 is:",
    opts: ["Always skewed right", "Symmetric", "Always skewed left"],
    correct: 1,
    exp: "When p = 0.50, successes and failures are equally likely, making the distribution perfectly symmetric; any p ≠ 0.50 introduces skew."
  },
  {
    concept: "Properties of the Normal",
    q: "Which statement about the normal distribution is TRUE?",
    opts: ["It is completely described by its mean and variance", "Its skewness is always positive", "Its kurtosis is always 0"],
    correct: 0,
    exp: "A normal distribution is fully specified by exactly two parameters: mean (μ) and variance (σ²). Its skewness is 0 and its kurtosis is 3 (excess kurtosis 0)."
  },
  {
    concept: "Properties of the Normal",
    q: "A portfolio's return is a weighted average of returns on 15 jointly normal stocks. The portfolio's return distribution is:",
    opts: ["Normal", "Binomial", "Impossible to determine"],
    correct: 0,
    exp: "A linear combination of jointly normal random variables is itself normally distributed."
  },
  {
    concept: "Properties of the Normal",
    q: "For a multivariate normal distribution of 10 stocks, how many distinct pairwise correlations must be specified?",
    opts: ["10", "45", "100"],
    correct: 1,
    exp: "n(n−1)/2 = 10×9/2 = 45 distinct pairwise correlations."
  },
  {
    concept: "The Empirical Rule",
    q: "Approximately what percentage of a normal distribution's observations fall within ±2 standard deviations of the mean?",
    opts: ["68%", "95%", "99.7%"],
    correct: 1,
    exp: "The empirical rule: roughly 95% of observations fall within μ ± 2σ (more precisely, ±1.96σ)."
  },
  {
    concept: "Standardizing & Z-Scores",
    q: "X ~ N(40, 5²). What is the Z-score for X = 47.5?",
    opts: ["1.00", "1.50", "7.50"],
    correct: 1,
    exp: "Z = (47.5 − 40)/5 = 7.5/5 = 1.50."
  },
  {
    concept: "Standardizing & Z-Scores",
    q: "If P(Z ≤ 1.65) ≈ 0.95, what is P(Z > 1.65)?",
    opts: ["0.95", "0.05", "1.65"],
    correct: 1,
    exp: "P(Z > 1.65) = 1 − P(Z ≤ 1.65) = 1 − 0.95 = 0.05."
  },
  {
    concept: "Student's t-Distribution",
    q: "The ratio t = (X̄ − μ)/(s/√n), using the sample standard deviation s instead of the true σ, follows:",
    opts: ["The standard normal distribution", "The t-distribution with n−1 degrees of freedom", "The chi-square distribution"],
    correct: 1,
    exp: "Substituting the estimated s for the true σ introduces extra uncertainty, which is exactly what gives this ratio a t-distribution (fatter tails) rather than a standard normal one."
  },
  {
    concept: "Student's t-Distribution",
    q: "As the degrees of freedom of a t-distribution grow very large, its shape:",
    opts: ["Becomes more skewed", "Approaches the standard normal distribution", "Becomes bounded below by zero"],
    correct: 1,
    exp: "With more degrees of freedom, the t-distribution's tails thin out and it converges toward the standard normal shape."
  },
  {
    concept: "Chi-Square & F-Distributions",
    q: "Which distribution is built from the sum of squared independent standard normal random variables?",
    opts: ["Student's t-distribution", "The F-distribution", "The chi-square distribution"],
    correct: 2,
    exp: "The chi-square distribution with k degrees of freedom is exactly the distribution of a sum of k squared independent standard normal variables."
  },
  {
    concept: "Chi-Square & F-Distributions",
    q: "The F-distribution requires how many degrees-of-freedom parameters?",
    opts: ["One", "Two — numerator and denominator", "Three"],
    correct: 1,
    exp: "Since the F-distribution is the ratio of two chi-square variables (each with its own df), it needs both a numerator and a denominator degrees-of-freedom parameter."
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
          cfaRecordAnswer(item.concept, "Common Probability Distributions", i === item.correct);
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

  } catch(e) { console.warn('[distributions] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: final-review
   ============================================================ */
(function(){
  try {
// ============================================================
// Final Review — 162 questions across all 9 Quant modules
// 2 questions per real concept/section, for reliable per-concept diagnosis
// ============================================================

const QUIZ = [
  // ========== MODULE 00: Numbers & Arithmetic (6 concepts x 2 = 12) ==========
  { cat:"Numbers & Arithmetic", concept:"The Four Operations",
    q:"A vendor sells 7 items at ₹35 each. How much revenue in total?",
    opts:["₹245","₹42","₹280"], correct:0,
    exp:"7 × 35 = 245 — seven groups of thirty-five, added together." },
  { cat:"Numbers & Arithmetic", concept:"The Four Operations",
    q:"56 ÷ 8 asks which question?",
    opts:["How many groups of 8 fit inside 56?","How many groups of 56 fit inside 8?","What is 56 plus 8?"], correct:0,
    exp:"Division asks how many equal groups fit — 56÷8=7, since seven groups of 8 make 56." },

  { cat:"Numbers & Arithmetic", concept:"Negative Numbers",
    q:"What is 18 − (−25)?",
    opts:["−7","43","7"], correct:1,
    exp:"Subtracting a negative flips to addition: 18−(−25) = 18+25 = 43." },
  { cat:"Numbers & Arithmetic", concept:"Negative Numbers",
    q:"What is (−9) × (−7)?",
    opts:["−63","63","−16"], correct:1,
    exp:"Multiplying two negatives gives a positive: (−9)×(−7)=63." },

  { cat:"Numbers & Arithmetic", concept:"Fractions, Decimals & Percentages",
    q:"What is 7/16 written as a decimal?",
    opts:["0.4375","0.716","0.5625"], correct:0,
    exp:"7 ÷ 16 = 0.4375." },
  { cat:"Numbers & Arithmetic", concept:"Fractions, Decimals & Percentages",
    q:"Using the '10% then adjust' method, what is 15% of 460?",
    opts:["46","69","92"], correct:1,
    exp:"10% of 460=46. Half of that (5%)=23. 15%=46+23=69." },

  { cat:"Numbers & Arithmetic", concept:"Order of Operations (BODMAS)",
    q:"Evaluate: 8 + 3 × (9 − 5)",
    opts:["44","20","15"], correct:1,
    exp:"Brackets first: (9−5)=4. Then multiplication: 3×4=12. Then addition: 8+12=20." },
  { cat:"Numbers & Arithmetic", concept:"Order of Operations (BODMAS)",
    q:"In BODMAS, do Division and Multiplication have different priority levels?",
    opts:["No, they share equal priority and go left to right","Yes, Division always comes first","Yes, Multiplication always comes first"], correct:0,
    exp:"Division and Multiplication share equal priority, resolved strictly left to right, whichever appears first." },

  { cat:"Numbers & Arithmetic", concept:"Ratios & Proportions",
    q:"Solve the proportion: 4/16 = 7/x.",
    opts:["28","1.75","20"], correct:0,
    exp:"Cross-multiply: 4x=16×7=112, so x=112/4=28." },
  { cat:"Numbers & Arithmetic", concept:"Ratios & Proportions",
    q:"If 5 machines can complete a job in 12 hours, roughly how long would 10 machines take (equal rates)?",
    opts:["24 hours","6 hours","12 hours"], correct:1,
    exp:"Doubling the machines halves the time needed for the same total work: 6 hours." },

  { cat:"Numbers & Arithmetic", concept:"Turning Words Into Math",
    q:"\"Reduced to only 75% of its original price\" is equivalent to which single operation?",
    opts:["A 75% discount","A 25% discount","A 75% increase"], correct:1,
    exp:"If 75% of the original remains, 25% was removed — a 25% discount." },
  { cat:"Numbers & Arithmetic", concept:"Turning Words Into Math",
    q:"A quantity rises from 250 to 300. What is the percentage increase?",
    opts:["50%","20%","16.7%"], correct:1,
    exp:"%increase = (change)/(original) = (300−250)/250 = 50/250 = 20%." },

  // ========== MODULE 0A: Math Foundations (6 concepts x 2 = 12) ==========
  { cat:"Math Foundations", concept:"Exponents & Roots",
    q:"Simplify: x⁶ / x²",
    opts:["x³","x⁴","x⁸"], correct:1,
    exp:"Dividing same-base exponents subtracts them: x⁶/x²=x⁴." },
  { cat:"Math Foundations", concept:"Exponents & Roots",
    q:"What is x⁻² equal to?",
    opts:["−x²","1/x²","2/x"], correct:1,
    exp:"A negative exponent means reciprocal: x⁻²=1/x²." },

  { cat:"Math Foundations", concept:"Logarithms",
    q:"What is ln(e³)?",
    opts:["3","e³","1"], correct:0,
    exp:"ln and e are inverses: ln(e³)=3." },
  { cat:"Math Foundations", concept:"Logarithms",
    q:"Using log rules, ln(a×b) simplifies to:",
    opts:["ln(a)+ln(b)","ln(a)−ln(b)","ln(a)×ln(b)"], correct:0,
    exp:"Multiplying inside a log becomes addition outside: ln(ab)=ln(a)+ln(b)." },

  { cat:"Math Foundations", concept:"Summation Notation",
    q:"What does Σᵢ₌₁⁴ 2i expand to and equal?",
    opts:["2+4+6+8 = 20","2×4×6×8 = 384","2+4=6"], correct:0,
    exp:"Σ from i=1 to 4 of 2i = 2(1)+2(2)+2(3)+2(4) = 2+4+6+8 = 20." },
  { cat:"Math Foundations", concept:"Summation Notation",
    q:"Which property lets you split Σ(Xᵢ+Yᵢ)?",
    opts:["Σ(Xᵢ+Yᵢ) = ΣXᵢ + ΣYᵢ","Σ(Xᵢ+Yᵢ) = ΣXᵢ × ΣYᵢ","Sums cannot be split"], correct:0,
    exp:"A summation of a sum splits into the sum of two separate summations." },

  { cat:"Math Foundations", concept:"Rearranging Equations",
    q:"Solve for x: 7x + 9 = 44.",
    opts:["x=5","x=7.57","x=35"], correct:0,
    exp:"Subtract 9: 7x=35. Divide by 7: x=5." },
  { cat:"Math Foundations", concept:"Rearranging Equations",
    q:"Solve for r: FV = PV(1+r).",
    opts:["r = FV/PV","r = FV/PV − 1","r = FV − PV"], correct:1,
    exp:"Divide both sides by PV: FV/PV=1+r. Subtract 1: r=FV/PV−1." },

  { cat:"Math Foundations", concept:"Sets & Set Notation",
    q:"A={2,4,6,8} and B={4,8,10}. What is A∩B?",
    opts:["{4,8}","{2,4,6,8,10}","∅"], correct:0,
    exp:"The intersection is only elements in both sets: 4 and 8." },
  { cat:"Math Foundations", concept:"Sets & Set Notation",
    q:"If A∩B=∅, the two events are:",
    opts:["Independent","Mutually exclusive","Exhaustive"], correct:1,
    exp:"An empty intersection means no shared outcomes — mutually exclusive." },

  { cat:"Math Foundations", concept:"Functions & the Cartesian Plane",
    q:"In y=mx+b, what does m represent?",
    opts:["The y-intercept","The slope","The x-intercept"], correct:1,
    exp:"m is the slope — how much y changes per unit change in x." },
  { cat:"Math Foundations", concept:"Functions & the Cartesian Plane",
    q:"A line has equation y=−3x+7. As x increases by 1, y:",
    opts:["Increases by 3","Decreases by 3","Stays the same"], correct:1,
    exp:"The slope is −3, so y falls by 3 for every 1-unit increase in x." },

  // ========== MODULE 01: Interest Rates, PV & FV (10 concepts x 2 = 20) ==========
  { cat:"Interest Rates, PV & FV", concept:"Interest Rates",
    q:"An interest rate's compensation for expected inflation plus the real risk-free rate together define the:",
    opts:["Nominal risk-free rate","Liquidity premium","Default risk premium"], correct:0,
    exp:"The nominal risk-free rate = real risk-free rate + expected inflation premium." },
  { cat:"Interest Rates, PV & FV", concept:"Interest Rates",
    q:"A bond that's hard to sell quickly without a price concession carries an extra yield component called the:",
    opts:["Maturity premium","Liquidity premium","Default risk premium"], correct:1,
    exp:"Illiquidity is compensated via a liquidity premium." },

  { cat:"Interest Rates, PV & FV", concept:"Future Value of a Lump Sum",
    q:"$5,000 is invested for 6 years at 5% compounded annually. What is the future value (nearest dollar)?",
    opts:["$6,700","$6,500","$7,000"], correct:0,
    exp:"FV = 5000×(1.05)^6 ≈ $6,700." },
  { cat:"Interest Rates, PV & FV", concept:"Future Value of a Lump Sum",
    q:"Holding the rate fixed, how does FV change as N (number of periods) increases?",
    opts:["FV falls","FV rises","FV is unaffected"], correct:1,
    exp:"More compounding periods at a positive rate always increases future value." },

  { cat:"Interest Rates, PV & FV", concept:"Compounding Frequency & EAR",
    q:"An 8% stated annual rate is compounded quarterly. What is the effective annual rate (nearest 0.01%)?",
    opts:["8.00%","8.24%","8.30%"], correct:1,
    exp:"EAR = (1+0.08/4)^4 − 1 ≈ 8.24%." },
  { cat:"Interest Rates, PV & FV", concept:"Compounding Frequency & EAR",
    q:"Holding the stated annual rate fixed, more frequent compounding always:",
    opts:["Decreases the EAR","Increases (or leaves unchanged) the EAR","Has no predictable effect"], correct:1,
    exp:"More frequent compounding raises or leaves unchanged the effective annual rate, never decreases it." },

  { cat:"Interest Rates, PV & FV", concept:"Future Value of an Annuity",
    q:"An ordinary annuity pays $800 yearly for 10 years at 6%. What is the future value annuity factor (nearest 0.1)?",
    opts:["13.2","10.0","7.4"], correct:0,
    exp:"FV factor = [(1.06)^10 − 1]/0.06 ≈ 13.2." },
  { cat:"Interest Rates, PV & FV", concept:"Future Value of an Annuity",
    q:"An annuity DUE's future value, compared to an otherwise identical ordinary annuity, is:",
    opts:["Lower","Higher, by a factor of (1+r)","Identical"], correct:1,
    exp:"Annuity due payments occur one period earlier, so each compounds for one extra period: FV(due)=FV(ordinary)×(1+r)." },

  { cat:"Interest Rates, PV & FV", concept:"Present Value of a Lump Sum",
    q:"$30,000 is due in 5 years. At a 7% discount rate, what is its present value (nearest $100)?",
    opts:["$21,400","$25,000","$19,000"], correct:0,
    exp:"PV = 30,000/(1.07)^5 ≈ $21,390." },
  { cat:"Interest Rates, PV & FV", concept:"Present Value of a Lump Sum",
    q:"Holding the discount rate constant, as a payment is pushed further into the future, its present value:",
    opts:["Rises","Falls","Stays the same"], correct:1,
    exp:"A more distant payment gets discounted more heavily, so its PV falls." },

  { cat:"Interest Rates, PV & FV", concept:"Present Value of an Annuity",
    q:"An ordinary annuity of $1,000/year for 5 years is discounted at 8%. What is the PV annuity factor (nearest 0.01)?",
    opts:["3.99","4.50","5.87"], correct:0,
    exp:"PV factor = [1−(1.08)⁻⁵]/0.08 ≈ 3.99." },
  { cat:"Interest Rates, PV & FV", concept:"Present Value of an Annuity",
    q:"A deferred annuity's first payment occurs at t=8, not t=1. What is the correct first step to value it today?",
    opts:["Value it as an ordinary annuity as of t=7, then discount that value back to t=0", "Discount each payment individually using its own maturity, ignoring the annuity formula entirely", "Treat it exactly like an ordinary annuity starting at t=1"], correct:0,
    exp:"Value the annuity as of one period before its first payment (t=7), then discount that lump sum back to today." },

  { cat:"Interest Rates, PV & FV", concept:"Perpetuities",
    q:"A perpetuity pays $40 per year forever, starting one year from now, at a 5% discount rate. What is its present value?",
    opts:["$800","$200","$400"], correct:0,
    exp:"PV = 40/0.05 = $800." },
  { cat:"Interest Rates, PV & FV", concept:"Perpetuities",
    q:"A perpetuity's first payment occurs at t=4 instead of t=1. What must you do differently to value it?",
    opts:["Nothing — perpetuities cannot be deferred","Value it as a normal perpetuity as of t=3, then discount that value back to t=0", "Simply multiply the standard perpetuity formula by 4"], correct:1,
    exp:"A deferred perpetuity is valued at t=3 (one period before the first payment), then that value is discounted back to today." },

  { cat:"Interest Rates, PV & FV", concept:"Rates, Growth & Number of Periods",
    q:"A company's revenue grew from $180M to $310M over 6 years. What is the approximate compound annual growth rate?",
    opts:["9.5%","12%","18%"], correct:0,
    exp:"CAGR = (310/180)^(1/6) − 1 ≈ 9.5%." },
  { cat:"Interest Rates, PV & FV", concept:"Rates, Growth & Number of Periods",
    q:"Using the Rule of 72, approximately how many years to double an investment at 8% annual growth?",
    opts:["6 years","9 years","12 years"], correct:1,
    exp:"Rule of 72: 72/8 = 9 years." },

  { cat:"Interest Rates, PV & FV", concept:"Size of Annuity Payments",
    q:"A $15,000 loan is repaid with equal annual payments over 4 years at 6% (PV annuity factor ≈ 3.4651). What is the annual payment (nearest $10)?",
    opts:["$4,330","$3,750","$5,200"], correct:0,
    exp:"Payment = 15,000/3.4651 ≈ $4,330." },
  { cat:"Interest Rates, PV & FV", concept:"Size of Annuity Payments",
    q:"To solve for the periodic payment on a loan, which formula do you rearrange?",
    opts:["The future value of a lump sum formula", "The present value of an annuity formula, solving for the payment", "The perpetuity formula"], correct:1,
    exp:"Loan payments are solved by rearranging the present value of an annuity formula, since PV=loan amount is known and payment is unknown." },

  { cat:"Interest Rates, PV & FV", concept:"Equivalence & Additivity",
    q:"The cash flow additivity principle states cash flows can be combined directly only when they:",
    opts:["Are indexed to the same point in time","Come from the same company","Are both positive"], correct:0,
    exp:"Cash flows can only be added or subtracted directly once they're all valued at the same point in time." },
  { cat:"Interest Rates, PV & FV", concept:"Equivalence & Additivity",
    q:"Series A pays $100 at t=1 and t=2; Series B pays $200 at t=1 and t=2. At 5% interest, what is the future value of the combined series at t=2?",
    opts:["$615.00","$600.00","$630.75"], correct:0,
    exp:"Combined payment is $300 at each date. FV = 300×(1.05)¹ + 300×(1.05)⁰ = 315 + 300 = $615.00." },

  // ========== MODULE 02: Organizing & Visualizing Data (10 concepts x 2 = 20) ==========
  { cat:"Organizing & Visualizing Data", concept:"Data Types",
    q:"Credit ratings (AAA, AA, A, BBB, ...) are an example of which data type?",
    opts:["Nominal","Ordinal","Continuous"], correct:1,
    exp:"Credit ratings have a meaningful order but the gaps between categories aren't numerically equal — ordinal data." },
  { cat:"Organizing & Visualizing Data", concept:"Data Types",
    q:"A dataset tracking the same 50 companies' revenue every year for 10 years is:",
    opts:["Cross-sectional data","Panel data","Time-series data only, with no cross-sectional element"], correct:1,
    exp:"Data combining multiple entities observed over multiple time periods is panel data." },

  { cat:"Organizing & Visualizing Data", concept:"Organizing Data",
    q:"Raw, unprocessed data collected directly from its source, before any cleaning, is called:",
    opts:["A frequency distribution","Raw data","A contingency table"], correct:1,
    exp:"Raw data is the term for unprocessed data exactly as collected." },
  { cat:"Organizing & Visualizing Data", concept:"Organizing Data",
    q:"Arranging data into rows and columns, with each row an observation and each column a variable, produces:",
    opts:["A one-dimensional array only","A structured (tabular) dataset","An unstructured dataset"], correct:1,
    exp:"This row/column arrangement is the standard structured (tabular) data format." },

  { cat:"Organizing & Visualizing Data", concept:"Frequency Distributions",
    q:"A dataset has minimum −12 and maximum 36. Using 6 bins, what is the bin width?",
    opts:["8","6","48"], correct:0,
    exp:"Bin width = (max−min)/number of bins = (36−(−12))/6 = 48/6 = 8." },
  { cat:"Organizing & Visualizing Data", concept:"Frequency Distributions",
    q:"In a frequency distribution table, the cumulative relative frequency of the final bin must equal:",
    opts:["0","1 (100%)","The bin width"], correct:1,
    exp:"By the last bin, all observations are accounted for, so cumulative relative frequency reaches exactly 1." },

  { cat:"Organizing & Visualizing Data", concept:"Contingency Tables",
    q:"In a contingency table, the totals in the rightmost column and bottom row are called:",
    opts:["Marginal frequencies","Joint frequencies","Conditional frequencies"], correct:0,
    exp:"Row and column totals in a contingency table are marginal frequencies." },
  { cat:"Organizing & Visualizing Data", concept:"Contingency Tables",
    q:"Dividing each cell in a contingency table by its row's total answers which question?",
    opts:["What share of the grand total does this cell represent?", "Within this row, what proportion falls into each column category?", "What is the column's marginal frequency?"], correct:1,
    exp:"Row-percentage tables show, within each row, how observations split across the columns." },

  { cat:"Organizing & Visualizing Data", concept:"Histograms & Frequency Polygons",
    q:"On a histogram, the tallest bar represents:",
    opts:["The bin with the highest frequency","The bin with the widest range","The mean of the dataset"], correct:0,
    exp:"Bar height in a histogram directly represents frequency — the tallest bar is the most frequent bin." },
  { cat:"Organizing & Visualizing Data", concept:"Histograms & Frequency Polygons",
    q:"A frequency polygon is constructed by:",
    opts:["Connecting the midpoints of each histogram bar with straight lines", "Drawing a smooth curve through the raw data points", "Stacking bars on top of each other"], correct:0,
    exp:"A frequency polygon connects the midpoint of each bin's top with straight lines." },

  { cat:"Organizing & Visualizing Data", concept:"Line & Bubble Line Charts",
    q:"A chart plotting a company's quarterly revenue over time, with bubble size representing that quarter's profit margin, is a:",
    opts:["Bubble line chart","Scatter plot matrix","Heat map"], correct:0,
    exp:"A line chart with a third dimension shown via bubble size is a bubble line chart." },
  { cat:"Organizing & Visualizing Data", concept:"Line & Bubble Line Charts",
    q:"For comparing the trend of two products' sales over the same 12 months, the best chart type is a:",
    opts:["Line chart","Tree-map","Heat map"], correct:0,
    exp:"Line charts are ideal for showing trends over time, especially comparing multiple series." },

  { cat:"Organizing & Visualizing Data", concept:"Scatter Plots & Matrices",
    q:"A scatter plot shows points tightly clustered around an upward-sloping line. This suggests:",
    opts:["A strong positive relationship between the two variables", "No relationship at all", "A strong negative relationship"], correct:0,
    exp:"Points tightly following an upward line indicate a strong positive association." },
  { cat:"Organizing & Visualizing Data", concept:"Scatter Plots & Matrices",
    q:"To inspect pairwise relationships among five candidate variables at once, the most efficient chart is a:",
    opts:["Single scatter plot","Scatter plot matrix","Bar chart"], correct:1,
    exp:"A scatter plot matrix shows every pairwise combination of variables in a grid of small scatter plots." },

  { cat:"Organizing & Visualizing Data", concept:"Bar Charts",
    q:"A stacked bar chart, compared to a grouped (clustered) bar chart, makes it easier to see:",
    opts:["Each category's exact sub-component values", "Each bar's total (marginal) value, while still showing sub-components", "Nothing — they show identical information"], correct:1,
    exp:"Stacked bars show the total height at a glance while still breaking down each bar into sub-components." },
  { cat:"Organizing & Visualizing Data", concept:"Bar Charts",
    q:"A vertical bar chart's y-axis starts at 50 instead of 0, exaggerating visual differences. This is an example of:",
    opts:["A truncated (misleading) axis","A properly scaled chart","A logarithmic scale"], correct:0,
    exp:"Starting an axis above zero visually exaggerates differences — a common misleading chart technique." },

  { cat:"Organizing & Visualizing Data", concept:"Tree-Maps & Word Clouds",
    q:"Which visualization uses rectangle area, not height or length, to represent magnitude?",
    opts:["Tree-map","Line chart","Scatter plot"], correct:0,
    exp:"A tree-map represents magnitude through the area of nested rectangles." },
  { cat:"Organizing & Visualizing Data", concept:"Tree-Maps & Word Clouds",
    q:"A word cloud is best suited to visualizing:",
    opts:["Precise numerical time-series data","The relative frequency of terms in unstructured text","Exact regression coefficients"], correct:1,
    exp:"Word clouds size words by frequency, making them useful for exploring unstructured text like earnings call transcripts." },

  { cat:"Organizing & Visualizing Data", concept:"Heat Maps & Choosing Charts",
    q:"A heat map is commonly used to visualize:",
    opts:["A correlation matrix, with color intensity showing strength", "A single company's stock price over time", "A pie chart's proportions"], correct:0,
    exp:"Heat maps use color intensity to represent magnitude across a grid, often for correlation matrices." },
  { cat:"Organizing & Visualizing Data", concept:"Heat Maps & Choosing Charts",
    q:"When exploring whether two continuous numerical variables are related, the best chart choice is generally a:",
    opts:["Scatter plot","Bar chart","Tree-map"], correct:0,
    exp:"Scatter plots are purpose-built for examining the relationship between two numerical variables." },

  // ========== MODULE 03: Summarizing Data (6 concepts x 2 = 12) ==========
  { cat:"Summarizing Data", concept:"Mean, Median, Mode",
    q:"For the dataset 4, 8, 8, 11, 11, 11, 15, what is the mode?",
    opts:["8","11","9.71"], correct:1,
    exp:"11 appears three times, more than any other value — the mode is 11." },
  { cat:"Summarizing Data", concept:"Mean, Median, Mode",
    q:"For any dataset, the sum of deviations of each observation from the arithmetic mean equals:",
    opts:["The variance","Zero, always","The standard deviation"], correct:1,
    exp:"By the mean's defining property, deviations above and below it always sum to exactly zero." },

  { cat:"Summarizing Data", concept:"Outliers, Trimmed & Winsorized Means",
    q:"Given the dataset 2, 3, 4, 5, 6, 500, which measure of central tendency is LEAST affected by the outlier?",
    opts:["The arithmetic mean","The median","Both are equally affected"], correct:1,
    exp:"The median, based on position rather than magnitude, is far less sensitive to extreme outliers than the mean." },
  { cat:"Summarizing Data", concept:"Outliers, Trimmed & Winsorized Means",
    q:"A winsorized mean handles extreme values by:",
    opts:["Deleting them entirely from the dataset", "Replacing them with a specified percentile value, rather than removing them", "Doubling their weight in the calculation"], correct:1,
    exp:"Winsorizing replaces extreme values with a cutoff percentile value instead of discarding them." },

  { cat:"Summarizing Data", concept:"Weighted, Geometric & Harmonic Mean",
    q:"A portfolio is 30% stocks (return 8%), 50% bonds (return 12%), 20% cash (return 3%). What is the weighted mean return?",
    opts:["9.0%","7.7%","9.5%"], correct:0,
    exp:"Weighted mean = 0.3(8)+0.5(12)+0.2(3) = 2.4+6.0+0.6 = 9.0%." },
  { cat:"Summarizing Data", concept:"Weighted, Geometric & Harmonic Mean",
    q:"A stock returns 20% in Year 1 and −10% in Year 2. What is the geometric mean return (approximately)?",
    opts:["3.9%","5.0%","4.5%"], correct:0,
    exp:"Geometric mean = [(1.20)(0.90)]^0.5 − 1 ≈ 3.9%." },

  { cat:"Summarizing Data", concept:"Quantiles",
    q:"In a sorted sample of 39 observations, what is the position of the median (L50)?",
    opts:["Position 19.5","Position 20","Position 20.5"], correct:1,
    exp:"L50 = (n+1)×0.50 = 40×0.5 = position 20." },
  { cat:"Summarizing Data", concept:"Quantiles",
    q:"The interquartile range (IQR) is calculated as:",
    opts:["Q3 − Q1","Q3 + Q1","(Q3+Q1)/2"], correct:0,
    exp:"IQR = third quartile minus first quartile, capturing the middle 50% of the data's spread." },

  { cat:"Summarizing Data", concept:"Measures of Dispersion",
    q:"Why does the sample variance formula divide by (n−1) instead of n?",
    opts:["To correct for a downward bias when estimating population variance from a sample", "It's an arbitrary convention with no statistical reason", "To make the formula easier to compute by hand"], correct:0,
    exp:"Dividing by (n−1) corrects for the fact that using the sample mean (rather than the true population mean) understates variability, providing an unbiased estimator." },
  { cat:"Summarizing Data", concept:"Measures of Dispersion",
    q:"Which measure of dispersion uses absolute values of deviations, rather than squaring them?",
    opts:["Variance","Standard deviation","Mean absolute deviation (MAD)"], correct:2,
    exp:"MAD averages the absolute value of each deviation from the mean, without squaring." },

  { cat:"Summarizing Data", concept:"Downside Deviation & CV",
    q:"Fund A: mean return 5%, std dev 8%. Fund B: mean return 12%, std dev 15%. Which has a higher coefficient of variation (more risk per unit of return)?",
    opts:["Fund A (CV=1.6)","Fund B (CV=1.25)","Both are identical"], correct:0,
    exp:"CV = std dev/mean. Fund A: 8/5=1.6. Fund B: 15/12=1.25. Fund A has the higher CV." },
  { cat:"Summarizing Data", concept:"Downside Deviation & CV",
    q:"Raising the target return used in a downside (target) semideviation calculation, holding the data fixed, will typically:",
    opts:["Decrease the measured downside risk","Increase the measured downside risk, since more observations fall below the higher target","Have no effect at all"], correct:1,
    exp:"A higher target return means more observations fall short of it, generally increasing measured downside deviation." },

  // ========== MODULE 04: Probability Concepts (12 concepts x 2 = 24) ==========
  { cat:"Probability Concepts", concept:"Random Variables & Events",
    q:"Rolling a fair die and \"observing an even number\" is best described as:",
    opts:["A random variable","An event","A conditional probability"], correct:1,
    exp:"An event is a specified outcome or set of outcomes — here, rolling an even number." },
  { cat:"Probability Concepts", concept:"Random Variables & Events",
    q:"A random variable that can take on a countable set of distinct values (like the number of defaults in a bond portfolio) is:",
    opts:["Discrete","Continuous","Deterministic"], correct:0,
    exp:"A variable with countable, distinct possible values is a discrete random variable." },

  { cat:"Probability Concepts", concept:"Rules of Probability",
    q:"Which pair of conditions together define a valid probability?",
    opts:["0 ≤ P(E) ≤ 1, and probabilities of all possible outcomes sum to 1", "P(E) can be any real number", "P(E) must always equal 0.5"], correct:0,
    exp:"Valid probabilities are bounded between 0 and 1, and the full set of possible outcomes must sum to 1." },
  { cat:"Probability Concepts", concept:"Rules of Probability",
    q:"If events A and B are mutually exclusive, what must P(A and B) equal?",
    opts:["0","1","P(A) × P(B)"], correct:0,
    exp:"Mutually exclusive events can never occur together, so their joint probability is exactly 0." },

  { cat:"Probability Concepts", concept:"Three Ways to Estimate P",
    q:"Assigning P(heads)=0.5 for a coin based purely on logical symmetry, without any data, is an example of:",
    opts:["A priori probability","Empirical probability","Subjective probability"], correct:0,
    exp:"Reasoning from logical structure alone (not data or personal judgment) is a priori probability." },
  { cat:"Probability Concepts", concept:"Three Ways to Estimate P",
    q:"An analyst says \"I believe there's a 70% chance this merger closes,\" based on personal judgment rather than a formal model. This is:",
    opts:["A priori probability","Empirical probability","Subjective probability"], correct:2,
    exp:"A probability estimate based on personal judgment or experience, without formal data or symmetry, is subjective probability." },

  { cat:"Probability Concepts", concept:"Odds",
    q:"If P(E) = 0.30, what are the odds for E?",
    opts:["0.30 to 0.70","3 to 7 (0.30/0.70)","7 to 3"], correct:1,
    exp:"Odds for E = P(E)/[1−P(E)] = 0.30/0.70 = 3 to 7." },
  { cat:"Probability Concepts", concept:"Odds",
    q:"The odds against an event are quoted as \"5 to 2.\" What is the implied probability of the event occurring?",
    opts:["5/7","2/7","2/5"], correct:1,
    exp:"Odds against a:b implies P(event) = b/(a+b) = 2/(5+2) = 2/7." },

  { cat:"Probability Concepts", concept:"Conditional Probability",
    q:"If P(A) = 0.4 and P(A|B) = 0.4 as well, what does this indicate?",
    opts:["A and B are mutually exclusive","A and B are independent","A and B are identical events"], correct:1,
    exp:"When conditioning on B doesn't change A's probability, A and B are independent." },
  { cat:"Probability Concepts", concept:"Conditional Probability",
    q:"P(AB) = 0.12 and P(B) = 0.40. What is P(A|B)?",
    opts:["0.30","0.048","0.52"], correct:0,
    exp:"P(A|B) = P(AB)/P(B) = 0.12/0.40 = 0.30." },

  { cat:"Probability Concepts", concept:"Joint Probability",
    q:"P(A|B) = 0.25 and P(B) = 0.60. What is the joint probability P(AB)?",
    opts:["0.15","0.42","0.85"], correct:0,
    exp:"P(AB) = P(A|B) × P(B) = 0.25 × 0.60 = 0.15." },
  { cat:"Probability Concepts", concept:"Joint Probability",
    q:"The multiplication rule for joint probability, P(AB) = P(A|B)×P(B), reduces to P(AB)=P(A)×P(B) exactly when:",
    opts:["A and B are mutually exclusive","A and B are independent","P(A) equals P(B)"], correct:1,
    exp:"For independent events, P(A|B)=P(A), so the multiplication rule simplifies to the product of the unconditional probabilities." },

  { cat:"Probability Concepts", concept:"Addition Rule",
    q:"P(A)=0.5, P(B)=0.3, P(AB)=0.1. What is P(A or B)?",
    opts:["0.7","0.8","0.9"], correct:0,
    exp:"P(A or B) = P(A)+P(B)−P(AB) = 0.5+0.3−0.1 = 0.7." },
  { cat:"Probability Concepts", concept:"Addition Rule",
    q:"For two mutually exclusive events, the addition rule P(A or B) simplifies to:",
    opts:["P(A) + P(B)","P(A) × P(B)","P(A) − P(B)"], correct:0,
    exp:"Since P(AB)=0 for mutually exclusive events, the addition rule drops the subtraction term entirely." },

  { cat:"Probability Concepts", concept:"Independent vs Dependent",
    q:"P(A)=0.6, P(B)=0.5, and A and B are independent. What is P(A and B)?",
    opts:["0.30","1.10","0.10"], correct:0,
    exp:"For independent events, P(AB)=P(A)×P(B)=0.6×0.5=0.30." },
  { cat:"Probability Concepts", concept:"Independent vs Dependent",
    q:"Drawing two cards from a deck WITHOUT replacing the first — are the two draws independent?",
    opts:["Yes, always independent","No — the first draw changes the composition of the deck for the second","Only if both cards are the same suit"], correct:1,
    exp:"Without replacement, removing the first card changes the probabilities for the second draw — the draws are dependent." },

  { cat:"Probability Concepts", concept:"Total Probability Rule",
    q:"40% of loans are 'high risk' (default rate 12%) and 60% are 'low risk' (default rate 2%). Using the total probability rule, what's the overall default rate?",
    opts:["5.2%","7.0%","6.0%"], correct:0,
    exp:"Overall rate = 0.4(0.12) + 0.6(0.02) = 0.048+0.012 = 0.052 = 5.2%." },
  { cat:"Probability Concepts", concept:"Total Probability Rule",
    q:"The total probability rule requires the conditioning scenarios to be:",
    opts:["Mutually exclusive and exhaustive","Independent of each other","Equal in probability"], correct:0,
    exp:"The scenarios must be mutually exclusive and exhaustive, covering every possibility exactly once." },

  { cat:"Probability Concepts", concept:"Multiplication & Factorial",
    q:"A restaurant offers 4 appetizers, 6 mains, and 3 desserts. Using the multiplication rule, how many distinct 3-course meals are possible?",
    opts:["72","13","24"], correct:0,
    exp:"4 × 6 × 3 = 72 distinct combinations." },
  { cat:"Probability Concepts", concept:"Multiplication & Factorial",
    q:"You must assign 6 distinct tasks to 6 different people, one task each. In how many ways can this be done?",
    opts:["720","36","6"], correct:0,
    exp:"6! = 720 distinct assignments." },

  { cat:"Probability Concepts", concept:"Labeling & Combinations",
    q:"How many different 4-person subcommittees (no distinct roles) can be chosen from 9 board members?",
    opts:["126","3,024","36"], correct:0,
    exp:"C(9,4) = 9!/(4!×5!) = 126." },
  { cat:"Probability Concepts", concept:"Labeling & Combinations",
    q:"Combinations differ from permutations in that combinations:",
    opts:["Count arrangements where order matters", "Count selections where order does NOT matter", "Can never be calculated using factorials"], correct:1,
    exp:"Combinations count the number of ways to select items when the order of selection doesn't matter." },

  { cat:"Probability Concepts", concept:"Permutations",
    q:"7 runners compete for Gold, Silver, and Bronze (order matters). How many different podium results are possible?",
    opts:["210","35","343"], correct:0,
    exp:"P(7,3) = 7!/(7−3)! = 7×6×5 = 210." },
  { cat:"Probability Concepts", concept:"Permutations",
    q:"The formula for permutations of n items taken r at a time is:",
    opts:["n!/(n−r)!","n!/[r!(n−r)!]","n!/r!"], correct:0,
    exp:"nPr = n!/(n−r)! — the combinations formula additionally divides by r! since order doesn't matter there." },

  // ========== MODULE 05: Common Probability Distributions (10 concepts x 2 = 20) ==========
  { cat:"Common Probability Distributions", concept:"Random Variables & Distributions",
    q:"The number of trades executed by a desk in a day is an example of a:",
    opts:["Discrete random variable","Continuous random variable","Deterministic value"], correct:0,
    exp:"A countable value like the number of trades is a discrete random variable." },
  { cat:"Common Probability Distributions", concept:"Random Variables & Distributions",
    q:"For a continuous random variable, the probability it takes on any single exact value is:",
    opts:["Always 1","Always 0","Equal to its probability density at that point"], correct:1,
    exp:"For continuous distributions, probability is only meaningful over a range — the probability of any exact single point is 0." },

  { cat:"Common Probability Distributions", concept:"Discrete Uniform",
    q:"A discrete uniform random variable has outcomes 1 through 10, equally likely. What is F(6)?",
    opts:["0.6","0.1","1.0"], correct:0,
    exp:"F(6) = P(X≤6) = 6/10 = 0.6 for a discrete uniform distribution." },
  { cat:"Common Probability Distributions", concept:"Discrete Uniform",
    q:"For a discrete uniform distribution over n equally likely outcomes, each outcome has probability:",
    opts:["1/n","n","1/n²"], correct:0,
    exp:"Each of the n equally likely outcomes has probability 1/n." },

  { cat:"Common Probability Distributions", concept:"Continuous Uniform",
    q:"X is continuous uniform between a=15 and b=45. What is the mean?",
    opts:["30","22.5","15"], correct:0,
    exp:"Mean of continuous uniform = (a+b)/2 = (15+45)/2 = 30." },
  { cat:"Common Probability Distributions", concept:"Continuous Uniform",
    q:"X is continuous uniform between 0 and 20. What is P(5 ≤ X ≤ 12)?",
    opts:["0.35","0.60","0.12"], correct:0,
    exp:"P = (12−5)/(20−0) = 7/20 = 0.35." },

  { cat:"Common Probability Distributions", concept:"The Binomial Distribution",
    q:"Which of these is a core assumption behind the binomial distribution?",
    opts:["The probability of success changes with each trial", "Each trial is independent, with a constant probability of success", "Outcomes must be continuous"], correct:1,
    exp:"The binomial model requires independent trials, each with the same (constant) probability of success." },
  { cat:"Common Probability Distributions", concept:"The Binomial Distribution",
    q:"A binomial distribution with p exactly 0.5 is:",
    opts:["Symmetric","Always right-skewed","Always left-skewed"], correct:0,
    exp:"When p=0.5, the binomial distribution is perfectly symmetric." },

  { cat:"Common Probability Distributions", concept:"Mean, Variance & Applications",
    q:"A binomial random variable has n=30, p=0.25. What is its mean?",
    opts:["7.5","5.625","30"], correct:0,
    exp:"Binomial mean = n×p = 30×0.25 = 7.5." },
  { cat:"Common Probability Distributions", concept:"Mean, Variance & Applications",
    q:"A binomial random variable has n=30, p=0.25. What is its variance?",
    opts:["5.625","7.5","2.37"], correct:0,
    exp:"Binomial variance = n×p×(1−p) = 30×0.25×0.75 = 5.625." },

  { cat:"Common Probability Distributions", concept:"Properties of the Normal",
    q:"Which statement about the normal distribution is TRUE?",
    opts:["It is fully described by its mean and variance alone", "It is always positively skewed", "It has no defined mean"], correct:0,
    exp:"The normal distribution is completely characterized by just two parameters: its mean and variance." },
  { cat:"Common Probability Distributions", concept:"Properties of the Normal",
    q:"A portfolio return is a weighted average of returns on several jointly normally distributed assets. The portfolio return distribution is:",
    opts:["Also normal","Uniform","Undefined without more information"], correct:0,
    exp:"A linear combination of jointly normal random variables is itself normally distributed." },

  { cat:"Common Probability Distributions", concept:"The Empirical Rule",
    q:"Approximately what percentage of a normal distribution falls within ±1 standard deviation of the mean?",
    opts:["68%","95%","99.7%"], correct:0,
    exp:"The empirical rule: about 68% falls within ±1 SD, 95% within ±2 SD, 99.7% within ±3 SD." },
  { cat:"Common Probability Distributions", concept:"The Empirical Rule",
    q:"According to the empirical rule, approximately what percentage falls within ±3 standard deviations?",
    opts:["99.7%","95%","90%"], correct:0,
    exp:"Nearly the entire distribution (99.7%) falls within ±3 standard deviations for a normal distribution." },

  { cat:"Common Probability Distributions", concept:"Standardizing & Z-Scores",
    q:"X ~ N(100, 15²). What is the Z-score for X=88?",
    opts:["−0.80","0.80","−1.13"], correct:0,
    exp:"Z = (X−μ)/σ = (88−100)/15 = −0.80." },
  { cat:"Common Probability Distributions", concept:"Standardizing & Z-Scores",
    q:"If P(Z ≤ 1.28) ≈ 0.90, what is P(Z > 1.28)?",
    opts:["0.10","0.90","0.28"], correct:0,
    exp:"P(Z>1.28) = 1 − P(Z≤1.28) = 1 − 0.90 = 0.10." },

  { cat:"Common Probability Distributions", concept:"Student's t-Distribution",
    q:"Compared to the standard normal distribution, the t-distribution has:",
    opts:["Fatter tails, reflecting extra uncertainty from estimating σ", "Identical tails", "Thinner tails"], correct:0,
    exp:"The t-distribution has fatter tails than the normal, reflecting the added uncertainty of using the sample standard deviation." },
  { cat:"Common Probability Distributions", concept:"Student's t-Distribution",
    q:"As the degrees of freedom of a t-distribution grow very large, its shape:",
    opts:["Converges toward the standard normal distribution", "Becomes more skewed", "Becomes uniform"], correct:0,
    exp:"As df→∞, the t-distribution converges to the standard normal distribution." },

  { cat:"Common Probability Distributions", concept:"Chi-Square & F-Distributions",
    q:"The chi-square distribution is built from the sum of squared independent:",
    opts:["Standard normal random variables","Binomial random variables","Uniform random variables"], correct:0,
    exp:"A chi-square distributed variable is the sum of squares of independent standard normal variables." },
  { cat:"Common Probability Distributions", concept:"Chi-Square & F-Distributions",
    q:"The F-distribution requires how many degrees-of-freedom parameters?",
    opts:["Two — one for the numerator, one for the denominator", "One", "None — it's parameter-free"], correct:0,
    exp:"The F-distribution needs two df parameters, since it's the ratio of two chi-square distributed variables." },

  // ========== MODULE 06: Sampling & Estimation (9 concepts x 2 = 18) ==========
  { cat:"Sampling & Estimation", concept:"Point Estimates",
    q:"A single calculated value, like a sample mean, used as a best guess for an unknown population parameter, is called a:",
    opts:["Point estimate","Confidence interval","Hypothesis"], correct:0,
    exp:"A single-value estimate of a population parameter is a point estimate." },
  { cat:"Sampling & Estimation", concept:"Point Estimates",
    q:"The formula \"sum the observations and divide by the count\" is the point estimate formula for:",
    opts:["The sample mean","The sample variance","The sample median"], correct:0,
    exp:"This is the standard formula for the sample mean, a point estimator of the population mean." },

  { cat:"Sampling & Estimation", concept:"Properties of a Good Estimator",
    q:"An estimator whose expected value equals the population parameter at every sample size is called:",
    opts:["Unbiased","Efficient","Consistent"], correct:0,
    exp:"An unbiased estimator's sampling distribution is centered exactly on the true parameter." },
  { cat:"Sampling & Estimation", concept:"Properties of a Good Estimator",
    q:"As sample size grows toward infinity, a consistent estimator's sampling distribution:",
    opts:["Concentrates increasingly tightly around the true parameter", "Spreads out further", "Becomes biased"], correct:0,
    exp:"Consistency means the estimator converges toward the true parameter value as sample size grows." },

  { cat:"Sampling & Estimation", concept:"Structure & Interpretation",
    q:"The general structure of a confidence interval is:",
    opts:["Point estimate ± (reliability factor × standard error)", "Point estimate × confidence level", "Standard error ÷ sample size"], correct:0,
    exp:"Every confidence interval follows this structure: a point estimate, plus or minus a reliability factor times the standard error." },
  { cat:"Sampling & Estimation", concept:"Structure & Interpretation",
    q:"Holding sample size and standard deviation constant, raising the confidence level from 90% to 99% makes the confidence interval:",
    opts:["Wider","Narrower","Unchanged"], correct:0,
    exp:"A higher confidence level requires a larger reliability factor, widening the interval." },

  { cat:"Sampling & Estimation", concept:"Known Population Variance",
    q:"Sampling from a normal distribution with known σ=40, a sample of n=100 has X̄=250. What is the 95% confidence interval (nearest 0.1)?",
    opts:["[242.2, 257.8]","[246.1, 253.9]","[210.0, 290.0]"], correct:0,
    exp:"SE=40/√100=4. CI = 250 ± 1.96(4) = [242.16, 257.84]." },
  { cat:"Sampling & Estimation", concept:"Known Population Variance",
    q:"With known population variance, which distribution provides the reliability factor for the confidence interval?",
    opts:["The standard normal (z) distribution","The t-distribution","The chi-square distribution"], correct:0,
    exp:"Known population variance uses the z-distribution for the reliability factor." },

  { cat:"Sampling & Estimation", concept:"Unknown Population Variance",
    q:"With an unknown population variance and a small sample from a normal population, which distribution should be used?",
    opts:["The t-distribution, with n−1 degrees of freedom", "The standard normal distribution, always", "The binomial distribution"], correct:0,
    exp:"Unknown variance with a small sample calls for the t-distribution with n−1 degrees of freedom." },
  { cat:"Sampling & Estimation", concept:"Unknown Population Variance",
    q:"Why is it acceptable to use a z reliability factor with unknown population variance, as long as the sample is large?",
    opts:["The t-distribution converges to the normal distribution as sample size grows", "Large samples eliminate the need for any reliability factor", "Population variance becomes known automatically at large samples"], correct:0,
    exp:"As sample size (and degrees of freedom) grows large, the t-distribution converges to the standard normal, making z a reasonable approximation." },

  { cat:"Sampling & Estimation", concept:"Selecting Sample Size",
    q:"The standard error of the sample mean is given by:",
    opts:["σ/√n","σ×√n","σ/n"], correct:0,
    exp:"Standard error = population standard deviation divided by the square root of sample size." },
  { cat:"Sampling & Estimation", concept:"Selecting Sample Size",
    q:"If sample size increases from n to 4n, the standard error of the mean approximately:",
    opts:["Halves","Doubles","Stays the same"], correct:0,
    exp:"SE is proportional to 1/√n, so quadrupling n halves the standard error (√4=2, so SE divides by 2)." },

  { cat:"Sampling & Estimation", concept:"Data Snooping Bias",
    q:"Testing hundreds of variables on the same dataset and reporting only the significant few, without disclosing the rest, is:",
    opts:["Data snooping (data mining) bias","Survivorship bias","Look-ahead bias"], correct:0,
    exp:"Selectively reporting only significant results from repeated testing on the same data is data snooping bias." },
  { cat:"Sampling & Estimation", concept:"Data Snooping Bias",
    q:"A research paper describing a trading signal as discovered by \"searching many possible variables until one worked\" is a warning sign of:",
    opts:["Data mining / data snooping","Survivorship bias","Time-period bias"], correct:0,
    exp:"Searching many variables until finding one that 'works' is a classic data-mining red flag." },

  { cat:"Sampling & Estimation", concept:"Sample Selection & Survivorship",
    q:"A mutual fund database that only includes funds still operating today, excluding those that closed, is most likely to cause:",
    opts:["Survivorship bias","Look-ahead bias","Time-period bias"], correct:0,
    exp:"Excluding failed/closed funds from a dataset overstates historical performance — survivorship bias." },
  { cat:"Sampling & Estimation", concept:"Sample Selection & Survivorship",
    q:"Survivorship bias tends to make historical performance data look:",
    opts:["Better than it actually was","Worse than it actually was","Unaffected either way"], correct:0,
    exp:"Since only 'survivors' remain in the dataset, average historical performance is overstated." },

  { cat:"Sampling & Estimation", concept:"Look-Ahead & Time-Period Bias",
    q:"A backtest ranks stocks using Q4 book value as of December 31st, even though that figure wasn't publicly released until mid-February. This is:",
    opts:["Look-ahead bias","Survivorship bias","Data snooping"], correct:0,
    exp:"Using information before it was actually available to investors is look-ahead bias." },
  { cat:"Sampling & Estimation", concept:"Look-Ahead & Time-Period Bias",
    q:"A study spans a period covering both a low-volatility regime and a high-volatility regime, without adjusting for the shift. This risks:",
    opts:["Time-period bias","Look-ahead bias only","No bias at all"], correct:0,
    exp:"Results can be sensitive to the specific time period studied, especially when regimes shift within it — time-period bias." },

  // ========== MODULE 07: Hypothesis Testing (12 concepts x 2 = 24) ==========
  { cat:"Hypothesis Testing", concept:"Why Hypothesis Testing?",
    q:"Hypothesis testing is fundamentally a tool for:",
    opts:["Using sample data to assess a claim about a population parameter", "Calculating a population parameter exactly, with no uncertainty", "Replacing the need for any sample data at all"], correct:0,
    exp:"Hypothesis testing uses sample evidence to evaluate a specific claim about an unknown population parameter." },
  { cat:"Hypothesis Testing", concept:"Why Hypothesis Testing?",
    q:"Why can't hypothesis testing ever prove a null hypothesis is absolutely true?",
    opts:["Sample evidence can only support 'fail to reject' or 'reject', never absolute proof", "Hypothesis testing always proves hypotheses true or false with certainty", "It's a limitation only of small samples"], correct:0,
    exp:"Statistical tests work with sample evidence and probability, so they can never provide absolute proof — only support for rejecting or failing to reject." },

  { cat:"Hypothesis Testing", concept:"Stating the Hypotheses",
    q:"Which statement about the null and alternative hypotheses is correct?",
    opts:["The null hypothesis is the statement being directly tested, assumed true until evidence suggests otherwise", "The alternative hypothesis is always assumed true at the start", "Both hypotheses must include an equality"], correct:0,
    exp:"H₀ is the claim under direct test, presumed true unless the evidence strongly contradicts it." },
  { cat:"Hypothesis Testing", concept:"Stating the Hypotheses",
    q:"H₀: μ = 10 versus Hₐ: μ ≠ 10 is an example of a:",
    opts:["One-sided test","Two-sided test","Non-parametric test"], correct:1,
    exp:"A 'not equal to' alternative hypothesis defines a two-sided test." },

  { cat:"Hypothesis Testing", concept:"Test Statistics",
    q:"The test statistic for a single population mean with an unknown population variance and a small sample follows which distribution?",
    opts:["The t-distribution","The chi-square distribution","The F-distribution"], correct:0,
    exp:"Unknown variance, small sample from a normal population — the t-distribution." },
  { cat:"Hypothesis Testing", concept:"Test Statistics",
    q:"A test statistic is generally calculated as:",
    opts:["(Sample statistic − Hypothesized value) / Standard error", "Sample statistic × Standard error", "Hypothesized value / Sample size"], correct:0,
    exp:"The general test statistic formula: (sample statistic minus hypothesized parameter) divided by standard error." },

  { cat:"Hypothesis Testing", concept:"Significance, Type I/II Errors & Power",
    q:"A Type I error occurs when:",
    opts:["A true null hypothesis is incorrectly rejected", "A false null hypothesis is not rejected", "The sample size is too small"], correct:0,
    exp:"Type I error = rejecting a null hypothesis that's actually true (a false positive)." },
  { cat:"Hypothesis Testing", concept:"Significance, Type I/II Errors & Power",
    q:"The power of a test is defined as:",
    opts:["1 minus the probability of a Type II error", "The probability of a Type I error", "The significance level itself"], correct:0,
    exp:"Power = 1 − P(Type II error) — the probability of correctly rejecting a false null hypothesis." },

  { cat:"Hypothesis Testing", concept:"Decision Rules & Critical Values",
    q:"For a two-sided test at the 5% significance level using a z-distributed test statistic, the critical values are approximately:",
    opts:["±1.96","±1.65","±2.58"], correct:0,
    exp:"The two-sided 5% critical values for the standard normal distribution are ±1.96." },
  { cat:"Hypothesis Testing", concept:"Decision Rules & Critical Values",
    q:"Testing H₀: μ=25 at the 95% confidence level, the sample's 95% CI is [23.1, 24.8]. What is the decision?",
    opts:["Reject H₀, since 25 falls outside the confidence interval", "Fail to reject H₀", "The test is inconclusive"], correct:0,
    exp:"Since the hypothesized value 25 falls outside the 95% CI, H₀ is rejected at the corresponding significance level." },

  { cat:"Hypothesis Testing", concept:"Statistical vs. Economic Significance",
    q:"A trading strategy's mean return is statistically significantly different from zero, but the edge is smaller than transaction costs. This result is:",
    opts:["Statistically significant but not economically significant", "Both statistically and economically significant", "Neither statistically nor economically significant"], correct:0,
    exp:"A real but tiny effect can be statistically detectable while still being too small to matter once real-world costs are considered." },
  { cat:"Hypothesis Testing", concept:"Statistical vs. Economic Significance",
    q:"Why might a very large sample size produce statistically significant results with little practical relevance?",
    opts:["Large samples can detect even trivially small effects as 'significant'", "Large samples always inflate the true effect size", "Statistical significance requires small samples"], correct:0,
    exp:"With enough data, even a tiny, practically meaningless effect can become statistically detectable." },

  { cat:"Hypothesis Testing", concept:"The Role of p-Values",
    q:"The p-value of a hypothesis test is best described as:",
    opts:["The smallest significance level at which the null hypothesis can be rejected", "The probability the null hypothesis is true", "The probability of a Type II error"], correct:0,
    exp:"The p-value is the smallest significance level at which the observed result would lead to rejecting H₀." },
  { cat:"Hypothesis Testing", concept:"The Role of p-Values",
    q:"A two-sided test produces a calculated z-statistic of 1.75. Approximately what is the p-value?",
    opts:["0.08","0.04","0.20"], correct:0,
    exp:"For a two-sided test, p-value = 2×(1−Φ(1.75)) ≈ 0.08." },

  { cat:"Hypothesis Testing", concept:"Multiple Testing",
    q:"A researcher runs 200 independent hypothesis tests at a 5% significance level, and every null hypothesis is actually true. About how many statistically significant results should she expect purely by chance?",
    opts:["10","5","1"], correct:0,
    exp:"200 × 0.05 = 10 expected false positives purely by chance." },
  { cat:"Hypothesis Testing", concept:"Multiple Testing",
    q:"The Benjamini-Hochberg procedure is designed to address which specific problem?",
    opts:["Controlling the false discovery rate when running many simultaneous tests", "Increasing statistical power in a single test", "Eliminating the need for a null hypothesis"], correct:0,
    exp:"Benjamini-Hochberg controls the expected proportion of false positives among multiple simultaneous tests." },

  { cat:"Hypothesis Testing", concept:"A Single Mean",
    q:"Testing H₀: μ=6 vs. Hₐ: μ≠6 with n=33, X̄=5.299, s=1.4284, the calculated t-statistic is approximately:",
    opts:["−2.82","−0.70","−5.02"], correct:0,
    exp:"t = (X̄−μ)/(s/√n) = (5.299−6)/(1.4284/√33) ≈ −2.82." },
  { cat:"Hypothesis Testing", concept:"A Single Mean",
    q:"For a test of a single mean with unknown population variance, the degrees of freedom used is:",
    opts:["n − 1","n","n − 2"], correct:0,
    exp:"A single-mean t-test uses n−1 degrees of freedom." },

  { cat:"Hypothesis Testing", concept:"Difference in Means — Independent",
    q:"When testing the difference between two INDEPENDENT sample means (assuming equal variances), what degrees of freedom apply to the pooled t-test, with n₁=18 and n₂=22?",
    opts:["38","40","36"], correct:0,
    exp:"Pooled variance t-test degrees of freedom = n₁+n₂−2 = 18+22−2 = 38." },
  { cat:"Hypothesis Testing", concept:"Difference in Means — Independent",
    q:"The pooled variance approach for comparing two independent means assumes:",
    opts:["The two populations have equal variances", "The two populations have unequal variances", "Both samples have identical means"], correct:0,
    exp:"Pooling the variance estimate is only valid when the two populations are assumed to have equal variances." },

  { cat:"Hypothesis Testing", concept:"Difference in Means — Paired",
    q:"Two analysts' forecast errors are measured on the exact same 40 companies. The appropriate test for comparing their mean errors is a:",
    opts:["Paired comparisons t-test","Independent samples t-test","Chi-square test"], correct:0,
    exp:"When the same set of observations is measured twice (shared underlying units), a paired test is appropriate, not an independent-samples test." },
  { cat:"Hypothesis Testing", concept:"Difference in Means — Paired",
    q:"The paired comparisons test works by first calculating:",
    opts:["The difference between each paired observation, then testing whether the mean difference is zero", "The pooled variance of the two independent samples", "The correlation between the two groups"], correct:0,
    exp:"Paired testing reduces to a single-mean test on the per-pair differences, testing whether their mean is zero." },

  { cat:"Hypothesis Testing", concept:"Tests of Variance",
    q:"A test of a single population variance uses which test statistic and distribution?",
    opts:["A chi-square statistic, chi-square distribution", "A t-statistic, t-distribution", "An F-statistic, F-distribution"], correct:0,
    exp:"Single-variance tests use a chi-square test statistic and the chi-square distribution." },
  { cat:"Hypothesis Testing", concept:"Tests of Variance",
    q:"An F-test comparing the variances of two independent samples, with n₁=20 and n₂=15, has which degrees of freedom?",
    opts:["19 and 14","20 and 15","35"], correct:0,
    exp:"F-test degrees of freedom are (n₁−1, n₂−1) = (19, 14)." },
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
   Module: flashcards
   ============================================================ */
(function(){
  try {
// ============================================================
// Flashcards — 162 cards, 2 per concept, across all 9 Quant modules
// Self-assessment feeds the shared diagnostics system
// ============================================================

const FLASHCARDS = [
  // ===== Numbers & Arithmetic =====
  { cat:"Numbers & Arithmetic", concept:"The Four Operations",
    front:"What does 6 × 4 actually represent?", back:"Six groups of four, added together — repeated addition: 4+4+4+4+4+4 = 24." },
  { cat:"Numbers & Arithmetic", concept:"The Four Operations",
    front:"What question does 18 ÷ 3 actually ask?", back:"How many groups of 3 fit inside 18? (Answer: 6 groups.)" },

  { cat:"Numbers & Arithmetic", concept:"Negative Numbers",
    front:"How do you handle subtracting a negative number?", back:"Subtracting a negative flips to addition: a − (−b) = a + b." },
  { cat:"Numbers & Arithmetic", concept:"Negative Numbers",
    front:"What's the sign rule for multiplying two negative numbers?", back:"Multiplying two negatives gives a positive." },

  { cat:"Numbers & Arithmetic", concept:"Fractions, Decimals & Percentages",
    front:"How do you convert a fraction to a decimal?", back:"Divide the numerator by the denominator." },
  { cat:"Numbers & Arithmetic", concept:"Fractions, Decimals & Percentages",
    front:"What's the '10% then adjust' trick for finding 15% of a number?", back:"Find 10% (move the decimal one place left), then add half of that (5%) again." },

  { cat:"Numbers & Arithmetic", concept:"Order of Operations (BODMAS)",
    front:"What does BODMAS stand for?", back:"Brackets, Orders (powers/roots), Division & Multiplication (left to right), Addition & Subtraction (left to right)." },
  { cat:"Numbers & Arithmetic", concept:"Order of Operations (BODMAS)",
    front:"Do Division and Multiplication have different priority in BODMAS?", back:"No — they share equal priority and are resolved strictly left to right." },

  { cat:"Numbers & Arithmetic", concept:"Ratios & Proportions",
    front:"How do you solve a proportion like a/b = c/x?", back:"Cross-multiply: a×x = b×c, then solve for x." },
  { cat:"Numbers & Arithmetic", concept:"Ratios & Proportions",
    front:"What is the 'unitary method' for ratio problems?", back:"Find the value of one unit first, then scale up to however many units you need." },

  { cat:"Numbers & Arithmetic", concept:"Turning Words Into Math",
    front:"What does 'reduced to only 75% of its original price' mean as a single operation?", back:"A 25% discount — if 75% remains, 25% was removed." },
  { cat:"Numbers & Arithmetic", concept:"Turning Words Into Math",
    front:"What's the formula for percentage change?", back:"%Δ = (New value − Original value) / Original value." },

  // ===== Math Foundations =====
  { cat:"Math Foundations", concept:"Exponents & Roots",
    front:"What's the rule for dividing exponents with the same base?", back:"xᵃ / xᵇ = xᵃ⁻ᵇ — subtract the exponents." },
  { cat:"Math Foundations", concept:"Exponents & Roots",
    front:"What does a negative exponent mean?", back:"It means 'take the reciprocal': x⁻ᵃ = 1/xᵃ." },

  { cat:"Math Foundations", concept:"Logarithms",
    front:"What's the relationship between ln(x)=y and exponents?", back:"ln(x)=y means exactly the same thing as e^y = x — logs and exponents are inverses." },
  { cat:"Math Foundations", concept:"Logarithms",
    front:"What log rule lets you solve FV=PV(1+r)^N for N?", back:"ln(aᵇ) = b×ln(a) — taking ln of both sides brings N down out of the exponent." },

  { cat:"Math Foundations", concept:"Summation Notation",
    front:"What does Σᵢ₌₁ⁿ Xᵢ mean?", back:"Add up X₁ through Xₙ — it's shorthand for repeated addition." },
  { cat:"Math Foundations", concept:"Summation Notation",
    front:"Can you factor a constant out of a summation?", back:"Yes: Σ(c×Xᵢ) = c×ΣXᵢ." },

  { cat:"Math Foundations", concept:"Rearranging Equations",
    front:"What's the one rule behind rearranging any equation?", back:"Whatever you do to one side, you must do to the other — an equation is a balance scale." },
  { cat:"Math Foundations", concept:"Rearranging Equations",
    front:"When rearranging, what's the most common mistake to avoid?", back:"Applying an operation to only part of one side, instead of the entire side." },

  { cat:"Math Foundations", concept:"Sets & Set Notation",
    front:"What does A ∩ B mean?", back:"The intersection — elements found in both A and B." },
  { cat:"Math Foundations", concept:"Sets & Set Notation",
    front:"What does A ∩ B = ∅ tell you about two events?", back:"They're mutually exclusive — no shared outcomes." },

  { cat:"Math Foundations", concept:"Functions & the Cartesian Plane",
    front:"In y = mx + b, what do m and b represent?", back:"m is the slope (rise per unit run); b is the y-intercept (value of y when x=0)." },
  { cat:"Math Foundations", concept:"Functions & the Cartesian Plane",
    front:"What's the defining property of a function?", back:"Exactly one output for every input — never two different outputs for the same input." },

  // ===== Interest Rates, PV & FV =====
  { cat:"Interest Rates, PV & FV", concept:"Interest Rates",
    front:"What two components make up the nominal risk-free rate?", back:"The real risk-free rate plus the expected inflation premium." },
  { cat:"Interest Rates, PV & FV", concept:"Interest Rates",
    front:"What does the liquidity premium compensate for?", back:"The extra risk of holding an asset that's hard to sell quickly without a price concession." },

  { cat:"Interest Rates, PV & FV", concept:"Future Value of a Lump Sum",
    front:"Give the future value of a lump sum formula.", back:"FV = PV × (1+r)^N." },
  { cat:"Interest Rates, PV & FV", concept:"Future Value of a Lump Sum",
    front:"Holding the rate fixed, what happens to FV as N increases?", back:"FV rises — more compounding periods at a positive rate always increases future value." },

  { cat:"Interest Rates, PV & FV", concept:"Compounding Frequency & EAR",
    front:"How do you calculate the effective annual rate from a stated rate compounded m times a year?", back:"EAR = (1 + stated rate/m)^m − 1." },
  { cat:"Interest Rates, PV & FV", concept:"Compounding Frequency & EAR",
    front:"Does more frequent compounding ever decrease the EAR?", back:"No — holding the stated rate fixed, more frequent compounding always increases (or leaves unchanged) the EAR." },

  { cat:"Interest Rates, PV & FV", concept:"Future Value of an Annuity",
    front:"Give the future value annuity factor formula.", back:"FV factor = [(1+r)^N − 1] / r." },
  { cat:"Interest Rates, PV & FV", concept:"Future Value of an Annuity",
    front:"How does an annuity due's future value compare to an ordinary annuity's?", back:"FV(due) = FV(ordinary) × (1+r) — each payment compounds for one extra period." },

  { cat:"Interest Rates, PV & FV", concept:"Present Value of a Lump Sum",
    front:"Give the present value of a lump sum formula.", back:"PV = FV / (1+r)^N." },
  { cat:"Interest Rates, PV & FV", concept:"Present Value of a Lump Sum",
    front:"Holding the discount rate constant, what happens to PV as a payment moves further into the future?", back:"PV falls — more distant payments get discounted more heavily." },

  { cat:"Interest Rates, PV & FV", concept:"Present Value of an Annuity",
    front:"Give the present value annuity factor formula.", back:"PV factor = [1 − (1+r)⁻ᴺ] / r." },
  { cat:"Interest Rates, PV & FV", concept:"Present Value of an Annuity",
    front:"How do you value a deferred annuity whose first payment is at t=8?", back:"Value it as an ordinary annuity as of t=7 (one period before the first payment), then discount that value back to t=0." },

  { cat:"Interest Rates, PV & FV", concept:"Perpetuities",
    front:"Give the perpetuity present value formula.", back:"PV = Payment / r." },
  { cat:"Interest Rates, PV & FV", concept:"Perpetuities",
    front:"How do you value a deferred perpetuity whose first payment is at t=4?", back:"Value it as a normal perpetuity as of t=3, then discount that value back to today." },

  { cat:"Interest Rates, PV & FV", concept:"Rates, Growth & Number of Periods",
    front:"Give the compound annual growth rate (CAGR) formula.", back:"CAGR = (Ending value / Beginning value)^(1/N) − 1." },
  { cat:"Interest Rates, PV & FV", concept:"Rates, Growth & Number of Periods",
    front:"What is the Rule of 72 used for?", back:"Quickly estimating how many years it takes an investment to double: years ≈ 72/interest rate." },

  { cat:"Interest Rates, PV & FV", concept:"Size of Annuity Payments",
    front:"How do you solve for the payment on a loan?", back:"Rearrange the present value of an annuity formula, since the loan amount (PV) is known and the payment is the unknown." },
  { cat:"Interest Rates, PV & FV", concept:"Size of Annuity Payments",
    front:"What's the formula for the annuity payment given PV?", back:"Payment = PV / (PV annuity factor)." },

  { cat:"Interest Rates, PV & FV", concept:"Equivalence & Additivity",
    front:"What does the cash flow additivity principle require?", back:"Cash flows can only be added or subtracted directly once they're all valued at the same point in time." },
  { cat:"Interest Rates, PV & FV", concept:"Equivalence & Additivity",
    front:"Why can't you directly add a cash flow at t=1 to one at t=5?", back:"They're at different points in time — you must first move them to a common date (via FV or PV) before combining them." },

  // ===== Organizing & Visualizing Data =====
  { cat:"Organizing & Visualizing Data", concept:"Data Types",
    front:"What's the difference between nominal and ordinal data?", back:"Nominal: categories with no inherent order (e.g., sector codes). Ordinal: categories with a meaningful order but unequal gaps (e.g., credit ratings)." },
  { cat:"Organizing & Visualizing Data", concept:"Data Types",
    front:"What is panel data?", back:"Data that combines multiple entities observed over multiple time periods — a blend of cross-sectional and time-series data." },

  { cat:"Organizing & Visualizing Data", concept:"Organizing Data",
    front:"What is raw data?", back:"Unprocessed data collected directly from its source, before any cleaning or structuring." },
  { cat:"Organizing & Visualizing Data", concept:"Organizing Data",
    front:"What makes data 'structured'?", back:"It's arranged into rows (observations) and columns (variables) — the standard tabular format." },

  { cat:"Organizing & Visualizing Data", concept:"Frequency Distributions",
    front:"How do you calculate bin width for a frequency distribution?", back:"Bin width = (maximum value − minimum value) / number of bins." },
  { cat:"Organizing & Visualizing Data", concept:"Frequency Distributions",
    front:"What must the cumulative relative frequency of the last bin always equal?", back:"1 (100%) — every observation is accounted for by the final bin." },

  { cat:"Organizing & Visualizing Data", concept:"Contingency Tables",
    front:"What are the row and column totals in a contingency table called?", back:"Marginal frequencies." },
  { cat:"Organizing & Visualizing Data", concept:"Contingency Tables",
    front:"What does dividing each cell by its row total show you?", back:"Within each row, what proportion falls into each column category." },

  { cat:"Organizing & Visualizing Data", concept:"Histograms & Frequency Polygons",
    front:"What does the tallest bar on a histogram represent?", back:"The bin with the highest frequency." },
  { cat:"Organizing & Visualizing Data", concept:"Histograms & Frequency Polygons",
    front:"How is a frequency polygon constructed?", back:"By connecting the midpoint of each histogram bar's top with straight lines." },

  { cat:"Organizing & Visualizing Data", concept:"Line & Bubble Line Charts",
    front:"What does a bubble line chart add to a standard line chart?", back:"A third dimension of data, shown through the size of the bubble at each point." },
  { cat:"Organizing & Visualizing Data", concept:"Line & Bubble Line Charts",
    front:"What's the best chart type for comparing trends of multiple series over time?", back:"A line chart." },

  { cat:"Organizing & Visualizing Data", concept:"Scatter Plots & Matrices",
    front:"What does a scatter plot with points tightly hugging an upward line indicate?", back:"A strong positive relationship between the two variables." },
  { cat:"Organizing & Visualizing Data", concept:"Scatter Plots & Matrices",
    front:"What's the most efficient chart for inspecting pairwise relationships among many variables at once?", back:"A scatter plot matrix." },

  { cat:"Organizing & Visualizing Data", concept:"Bar Charts",
    front:"What advantage does a stacked bar chart have over a grouped bar chart?", back:"It shows each bar's total (marginal) value at a glance, while still breaking it into sub-components." },
  { cat:"Organizing & Visualizing Data", concept:"Bar Charts",
    front:"What's misleading about a bar chart whose y-axis doesn't start at zero?", back:"It visually exaggerates differences between bars that may not be as large as they appear." },

  { cat:"Organizing & Visualizing Data", concept:"Tree-Maps & Word Clouds",
    front:"What visual property does a tree-map use to represent magnitude?", back:"Rectangle area, not height or length." },
  { cat:"Organizing & Visualizing Data", concept:"Tree-Maps & Word Clouds",
    front:"What's a word cloud best suited for visualizing?", back:"The relative frequency of terms in unstructured text, like an earnings call transcript." },

  { cat:"Organizing & Visualizing Data", concept:"Heat Maps & Choosing Charts",
    front:"What is a heat map commonly used to visualize?", back:"A correlation matrix, using color intensity to represent the strength of relationships." },
  { cat:"Organizing & Visualizing Data", concept:"Heat Maps & Choosing Charts",
    front:"What's the best chart for exploring whether two continuous numerical variables are related?", back:"A scatter plot." },

  // ===== Summarizing Data =====
  { cat:"Summarizing Data", concept:"Mean, Median, Mode",
    front:"For any dataset, what does the sum of deviations from the mean always equal?", back:"Zero — deviations above and below the mean always cancel out exactly." },
  { cat:"Summarizing Data", concept:"Mean, Median, Mode",
    front:"For a positively (right) skewed distribution, what's the typical order of mean, median, mode?", back:"Mode < Median < Mean." },

  { cat:"Summarizing Data", concept:"Outliers, Trimmed & Winsorized Means",
    front:"Which measure of central tendency is least affected by an extreme outlier: mean or median?", back:"The median — it's based on position, not magnitude, so it barely moves when an outlier is added." },
  { cat:"Summarizing Data", concept:"Outliers, Trimmed & Winsorized Means",
    front:"How does a winsorized mean differ from a trimmed mean?", back:"A trimmed mean removes extreme values entirely; a winsorized mean replaces them with a specified percentile value instead of deleting them." },

  { cat:"Summarizing Data", concept:"Weighted, Geometric & Harmonic Mean",
    front:"How do you calculate a weighted mean?", back:"Multiply each value by its weight, then sum the results." },
  { cat:"Summarizing Data", concept:"Weighted, Geometric & Harmonic Mean",
    front:"Which mean is most appropriate for averaging investment returns over multiple periods?", back:"The geometric mean — it correctly captures compounding, unlike the arithmetic mean." },

  { cat:"Summarizing Data", concept:"Quantiles",
    front:"How do you find the position (L) of the median in a sorted sample of n observations?", back:"L50 = (n+1) × 0.50." },
  { cat:"Summarizing Data", concept:"Quantiles",
    front:"How is the interquartile range (IQR) calculated?", back:"IQR = Q3 − Q1." },

  { cat:"Summarizing Data", concept:"Measures of Dispersion",
    front:"Why does sample variance divide by (n−1) instead of n?", back:"To correct for a downward bias — using the sample mean instead of the true population mean understates variability, so (n−1) provides an unbiased estimator." },
  { cat:"Summarizing Data", concept:"Measures of Dispersion",
    front:"What does mean absolute deviation (MAD) use instead of squaring deviations?", back:"The absolute value of each deviation from the mean." },

  { cat:"Summarizing Data", concept:"Downside Deviation & CV",
    front:"How is the coefficient of variation (CV) calculated?", back:"CV = Standard deviation / Mean — risk per unit of return." },
  { cat:"Summarizing Data", concept:"Downside Deviation & CV",
    front:"How does raising the target return affect a target semideviation calculation?", back:"It typically increases measured downside risk, since more observations now fall below the higher target." },

  // ===== Probability Concepts =====
  { cat:"Probability Concepts", concept:"Random Variables & Events",
    front:"What's the difference between a random variable and an event?", back:"A random variable is a quantity whose value is uncertain; an event is a specified outcome or set of outcomes." },
  { cat:"Probability Concepts", concept:"Random Variables & Events",
    front:"What makes a random variable 'discrete'?", back:"It can take on a countable set of distinct values, like the number of defaults in a portfolio." },

  { cat:"Probability Concepts", concept:"Rules of Probability",
    front:"What two conditions define a valid probability?", back:"0 ≤ P(E) ≤ 1 for every event, and the probabilities of all possible outcomes must sum to 1." },
  { cat:"Probability Concepts", concept:"Rules of Probability",
    front:"If A and B are mutually exclusive, what is P(A and B)?", back:"0 — mutually exclusive events can never occur together." },

  { cat:"Probability Concepts", concept:"Three Ways to Estimate P",
    front:"Name the three ways to estimate a probability.", back:"A priori (logical reasoning), empirical (historical data), and subjective (personal judgment)." },
  { cat:"Probability Concepts", concept:"Three Ways to Estimate P",
    front:"What is a priori probability based on?", back:"Formal reasoning and logical structure, without relying on data or personal judgment." },

  { cat:"Probability Concepts", concept:"Odds",
    front:"How do you convert a probability P(E) into odds for E?", back:"Odds for E = P(E) / [1 − P(E)]." },
  { cat:"Probability Concepts", concept:"Odds",
    front:"If odds against an event are quoted as 'a to b', what's the implied probability?", back:"P(event) = b / (a+b)." },

  { cat:"Probability Concepts", concept:"Conditional Probability",
    front:"Give the formula for conditional probability P(A|B).", back:"P(A|B) = P(AB) / P(B)." },
  { cat:"Probability Concepts", concept:"Conditional Probability",
    front:"If P(A|B) = P(A), what does that tell you?", back:"A and B are independent — conditioning on B doesn't change A's probability." },

  { cat:"Probability Concepts", concept:"Joint Probability",
    front:"Give the multiplication rule for joint probability.", back:"P(AB) = P(A|B) × P(B)." },
  { cat:"Probability Concepts", concept:"Joint Probability",
    front:"When does the multiplication rule simplify to P(AB) = P(A) × P(B)?", back:"When A and B are independent." },

  { cat:"Probability Concepts", concept:"Addition Rule",
    front:"Give the addition rule for P(A or B).", back:"P(A or B) = P(A) + P(B) − P(AB)." },
  { cat:"Probability Concepts", concept:"Addition Rule",
    front:"How does the addition rule simplify for mutually exclusive events?", back:"P(A or B) = P(A) + P(B), since P(AB) = 0." },

  { cat:"Probability Concepts", concept:"Independent vs Dependent",
    front:"For independent events, how do you calculate P(A and B)?", back:"P(AB) = P(A) × P(B)." },
  { cat:"Probability Concepts", concept:"Independent vs Dependent",
    front:"Are two card draws without replacement independent?", back:"No — removing the first card changes the composition of the deck, making the draws dependent." },

  { cat:"Probability Concepts", concept:"Total Probability Rule",
    front:"What condition must the scenarios in the total probability rule satisfy?", back:"They must be mutually exclusive and exhaustive — covering every possibility exactly once." },
  { cat:"Probability Concepts", concept:"Total Probability Rule",
    front:"How do you compute an overall probability using the total probability rule?", back:"Sum each scenario's probability times its conditional probability of the event: P(E) = ΣP(Sᵢ)×P(E|Sᵢ)." },

  { cat:"Probability Concepts", concept:"Multiplication & Factorial",
    front:"How do you count total combinations across independent categories (e.g., appetizers × mains × desserts)?", back:"Multiply the number of choices in each category together — the multiplication rule for counting." },
  { cat:"Probability Concepts", concept:"Multiplication & Factorial",
    front:"How many ways can you arrange n distinct items in a sequence?", back:"n! (n factorial)." },

  { cat:"Probability Concepts", concept:"Labeling & Combinations",
    front:"Give the combinations formula for choosing r items from n (order doesn't matter).", back:"nCr = n! / [r!(n−r)!]." },
  { cat:"Probability Concepts", concept:"Labeling & Combinations",
    front:"When should you use combinations instead of permutations?", back:"When the order of selection doesn't matter — like choosing a committee with no distinct roles." },

  { cat:"Probability Concepts", concept:"Permutations",
    front:"Give the permutations formula for arranging r items from n (order matters).", back:"nPr = n! / (n−r)!." },
  { cat:"Probability Concepts", concept:"Permutations",
    front:"When should you use permutations instead of combinations?", back:"When order matters — like awarding distinct Gold/Silver/Bronze positions." },

  // ===== Common Probability Distributions =====
  { cat:"Common Probability Distributions", concept:"Random Variables & Distributions",
    front:"For a continuous random variable, what's the probability it takes on any single exact value?", back:"0 — probability is only meaningful over a range for continuous distributions." },
  { cat:"Common Probability Distributions", concept:"Random Variables & Distributions",
    front:"Give an example of a discrete random variable in finance.", back:"The number of trades executed in a day, or the number of defaults in a bond portfolio." },

  { cat:"Common Probability Distributions", concept:"Discrete Uniform",
    front:"In a discrete uniform distribution with n equally likely outcomes, what's the probability of each?", back:"1/n." },
  { cat:"Common Probability Distributions", concept:"Discrete Uniform",
    front:"For a discrete uniform variable over 1 to n, how do you find F(k) (the CDF)?", back:"F(k) = k/n — the count of outcomes at or below k, divided by the total count." },

  { cat:"Common Probability Distributions", concept:"Continuous Uniform",
    front:"Give the mean formula for a continuous uniform distribution over [a,b].", back:"Mean = (a+b)/2." },
  { cat:"Common Probability Distributions", concept:"Continuous Uniform",
    front:"How do you find P(x1 ≤ X ≤ x2) for a continuous uniform distribution over [a,b]?", back:"P = (x2−x1)/(b−a) — the proportion of the total range covered." },

  { cat:"Common Probability Distributions", concept:"The Binomial Distribution",
    front:"What two conditions must hold for a binomial distribution to apply?", back:"Each trial is independent, and each has the same (constant) probability of success." },
  { cat:"Common Probability Distributions", concept:"The Binomial Distribution",
    front:"When is a binomial distribution symmetric?", back:"When p (probability of success) exactly equals 0.5." },

  { cat:"Common Probability Distributions", concept:"Mean, Variance & Applications",
    front:"Give the mean formula for a binomial distribution.", back:"Mean = n × p." },
  { cat:"Common Probability Distributions", concept:"Mean, Variance & Applications",
    front:"Give the variance formula for a binomial distribution.", back:"Variance = n × p × (1−p)." },

  { cat:"Common Probability Distributions", concept:"Properties of the Normal",
    front:"What two parameters fully describe a normal distribution?", back:"Its mean and its variance." },
  { cat:"Common Probability Distributions", concept:"Properties of the Normal",
    front:"Is a linear combination of jointly normal random variables also normal?", back:"Yes — a portfolio return built from jointly normal asset returns is itself normally distributed." },

  { cat:"Common Probability Distributions", concept:"The Empirical Rule",
    front:"What percentage of a normal distribution falls within ±1 standard deviation?", back:"Approximately 68%." },
  { cat:"Common Probability Distributions", concept:"The Empirical Rule",
    front:"What percentage of a normal distribution falls within ±2 and ±3 standard deviations?", back:"About 95% within ±2 SD, and about 99.7% within ±3 SD." },

  { cat:"Common Probability Distributions", concept:"Standardizing & Z-Scores",
    front:"Give the Z-score formula.", back:"Z = (X − μ) / σ." },
  { cat:"Common Probability Distributions", concept:"Standardizing & Z-Scores",
    front:"If P(Z ≤ 1.28) ≈ 0.90, what is P(Z > 1.28)?", back:"0.10 — since total probability is 1, P(Z>1.28) = 1 − P(Z≤1.28)." },

  { cat:"Common Probability Distributions", concept:"Student's t-Distribution",
    front:"Why does the t-distribution have fatter tails than the normal distribution?", back:"It reflects the extra uncertainty from estimating the population standard deviation using the sample standard deviation." },
  { cat:"Common Probability Distributions", concept:"Student's t-Distribution",
    front:"What happens to the t-distribution as degrees of freedom grow very large?", back:"It converges toward the standard normal distribution." },

  { cat:"Common Probability Distributions", concept:"Chi-Square & F-Distributions",
    front:"What is the chi-square distribution built from?", back:"The sum of squared independent standard normal random variables." },
  { cat:"Common Probability Distributions", concept:"Chi-Square & F-Distributions",
    front:"How many degrees-of-freedom parameters does the F-distribution require?", back:"Two — one for the numerator, one for the denominator, since it's the ratio of two chi-square variables." },

  // ===== Sampling & Estimation =====
  { cat:"Sampling & Estimation", concept:"Point Estimates",
    front:"What is a point estimate?", back:"A single calculated value, like a sample mean, used as a best guess for an unknown population parameter." },
  { cat:"Sampling & Estimation", concept:"Point Estimates",
    front:"What's the point estimate formula for the sample mean?", back:"Sum all observations, then divide by the count." },

  { cat:"Sampling & Estimation", concept:"Properties of a Good Estimator",
    front:"What makes an estimator 'unbiased'?", back:"Its expected value equals the true population parameter, at every sample size." },
  { cat:"Sampling & Estimation", concept:"Properties of a Good Estimator",
    front:"What makes an estimator 'consistent'?", back:"Its sampling distribution concentrates increasingly tightly around the true parameter as sample size grows." },

  { cat:"Sampling & Estimation", concept:"Structure & Interpretation",
    front:"What's the general structure of every confidence interval?", back:"Point estimate ± (reliability factor × standard error)." },
  { cat:"Sampling & Estimation", concept:"Structure & Interpretation",
    front:"How does raising the confidence level from 90% to 99% affect the interval's width?", back:"It widens the interval — a higher confidence level requires a larger reliability factor." },

  { cat:"Sampling & Estimation", concept:"Known Population Variance",
    front:"With known population variance, which distribution provides the reliability factor?", back:"The standard normal (z) distribution." },
  { cat:"Sampling & Estimation", concept:"Known Population Variance",
    front:"What's the z reliability factor for a 95% confidence interval?", back:"±1.96." },

  { cat:"Sampling & Estimation", concept:"Unknown Population Variance",
    front:"With unknown population variance and a small sample, which distribution should you use?", back:"The t-distribution, with n−1 degrees of freedom." },
  { cat:"Sampling & Estimation", concept:"Unknown Population Variance",
    front:"Why is it acceptable to use a z reliability factor with unknown variance, if the sample is large?", back:"The t-distribution converges to the normal distribution as sample size (and degrees of freedom) grows large." },

  { cat:"Sampling & Estimation", concept:"Selecting Sample Size",
    front:"Give the standard error of the sample mean formula.", back:"SE = σ / √n." },
  { cat:"Sampling & Estimation", concept:"Selecting Sample Size",
    front:"If sample size quadruples (n → 4n), what happens to the standard error?", back:"It halves — SE is proportional to 1/√n, and √4=2." },

  { cat:"Sampling & Estimation", concept:"Data Snooping Bias",
    front:"What is data snooping (data mining) bias?", back:"Testing many variables on the same dataset and reporting only the significant few, without disclosing the rest." },
  { cat:"Sampling & Estimation", concept:"Data Snooping Bias",
    front:"What's a warning sign of data mining in a research paper?", back:"Describing a signal as found by 'searching many possible variables until one worked.'" },

  { cat:"Sampling & Estimation", concept:"Sample Selection & Survivorship",
    front:"What is survivorship bias?", back:"When a dataset only includes entities that 'survived' (like still-operating funds), excluding those that failed or closed, overstating historical performance." },
  { cat:"Sampling & Estimation", concept:"Sample Selection & Survivorship",
    front:"Does survivorship bias make historical data look better or worse than reality?", back:"Better — failures are excluded, inflating average performance." },

  { cat:"Sampling & Estimation", concept:"Look-Ahead & Time-Period Bias",
    front:"What is look-ahead bias?", back:"Using information in a backtest before it was actually publicly available to investors at that time." },
  { cat:"Sampling & Estimation", concept:"Look-Ahead & Time-Period Bias",
    front:"What is time-period bias?", back:"Results being sensitive to the specific time period studied, especially when market regimes shift within that period." },

  // ===== Hypothesis Testing =====
  { cat:"Hypothesis Testing", concept:"Why Hypothesis Testing?",
    front:"What is hypothesis testing fundamentally used for?", back:"Using sample data to assess a specific claim about an unknown population parameter." },
  { cat:"Hypothesis Testing", concept:"Why Hypothesis Testing?",
    front:"Can hypothesis testing ever absolutely prove a null hypothesis true?", back:"No — it only ever supports 'reject' or 'fail to reject,' based on probability, never absolute proof." },

  { cat:"Hypothesis Testing", concept:"Stating the Hypotheses",
    front:"What is the null hypothesis (H₀)?", back:"The specific claim being directly tested, assumed true until evidence suggests otherwise." },
  { cat:"Hypothesis Testing", concept:"Stating the Hypotheses",
    front:"What makes a hypothesis test 'two-sided'?", back:"The alternative hypothesis uses 'not equal to' (≠) rather than a directional inequality." },

  { cat:"Hypothesis Testing", concept:"Test Statistics",
    front:"Give the general formula for a test statistic.", back:"(Sample statistic − Hypothesized value) / Standard error." },
  { cat:"Hypothesis Testing", concept:"Test Statistics",
    front:"Which distribution does a single-mean test statistic follow with unknown variance and a small sample?", back:"The t-distribution, with n−1 degrees of freedom." },

  { cat:"Hypothesis Testing", concept:"Significance, Type I/II Errors & Power",
    front:"What is a Type I error?", back:"Incorrectly rejecting a null hypothesis that's actually true (a false positive)." },
  { cat:"Hypothesis Testing", concept:"Significance, Type I/II Errors & Power",
    front:"How is the power of a test defined?", back:"1 minus the probability of a Type II error — the probability of correctly rejecting a false null hypothesis." },

  { cat:"Hypothesis Testing", concept:"Decision Rules & Critical Values",
    front:"What are the two-sided 5% critical values for a z-distributed test statistic?", back:"±1.96." },
  { cat:"Hypothesis Testing", concept:"Decision Rules & Critical Values",
    front:"If a hypothesized value falls outside the corresponding confidence interval, what's the decision?", back:"Reject the null hypothesis." },

  { cat:"Hypothesis Testing", concept:"Statistical vs. Economic Significance",
    front:"Can a result be statistically significant but not economically significant?", back:"Yes — a real, detectable effect can still be too small to matter once real-world costs (like transaction costs) are considered." },
  { cat:"Hypothesis Testing", concept:"Statistical vs. Economic Significance",
    front:"Why can very large samples produce statistically significant but practically meaningless results?", back:"With enough data, even a tiny, trivial effect can become statistically detectable." },

  { cat:"Hypothesis Testing", concept:"The Role of p-Values",
    front:"What is the p-value of a hypothesis test?", back:"The smallest significance level at which the null hypothesis could be rejected, given the observed data." },
  { cat:"Hypothesis Testing", concept:"The Role of p-Values",
    front:"If the p-value is less than the significance level, what's the decision?", back:"Reject the null hypothesis." },

  { cat:"Hypothesis Testing", concept:"Multiple Testing",
    front:"Running 100 independent tests at 5% significance, with every null true, how many false positives are expected by chance?", back:"About 5 (100 × 0.05)." },
  { cat:"Hypothesis Testing", concept:"Multiple Testing",
    front:"What does the Benjamini-Hochberg procedure control for?", back:"The false discovery rate when running many simultaneous hypothesis tests." },

  { cat:"Hypothesis Testing", concept:"A Single Mean",
    front:"Give the t-statistic formula for testing a single mean.", back:"t = (X̄ − μ₀) / (s/√n)." },
  { cat:"Hypothesis Testing", concept:"A Single Mean",
    front:"What degrees of freedom apply to a single-mean t-test?", back:"n − 1." },

  { cat:"Hypothesis Testing", concept:"Difference in Means — Independent",
    front:"What degrees of freedom apply to a pooled-variance two-sample t-test?", back:"n₁ + n₂ − 2." },
  { cat:"Hypothesis Testing", concept:"Difference in Means — Independent",
    front:"What assumption does the pooled variance approach require?", back:"The two populations being compared have equal variances." },

  { cat:"Hypothesis Testing", concept:"Difference in Means — Paired",
    front:"When should you use a paired comparisons test instead of an independent samples test?", back:"When the same set of observations is measured twice (e.g., the same companies, or the same time periods) — shared underlying units." },
  { cat:"Hypothesis Testing", concept:"Difference in Means — Paired",
    front:"How does a paired test actually work?", back:"It calculates the difference for each pair, then runs a single-mean test on whether that mean difference is zero." },

  { cat:"Hypothesis Testing", concept:"Tests of Variance",
    front:"What test statistic and distribution are used to test a single population variance?", back:"A chi-square test statistic, using the chi-square distribution." },
  { cat:"Hypothesis Testing", concept:"Tests of Variance",
    front:"What degrees of freedom apply to an F-test comparing two variances, with samples of size n₁ and n₂?", back:"(n₁−1, n₂−1) — one for the numerator, one for the denominator." },
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
   Module: formula-sheet
   ============================================================ */
(function(){
  try {
// ============================================================
// Formula Cheat Sheet — data-driven, rendered with KaTeX
// ============================================================

const MODULES = [
  {
    num: "00",
    title: "Numbers &amp; Arithmetic",
    formulas: [
      { name: "The four operations", tex: ["a+b,\\;\\; a-b,\\;\\; a\\times b,\\;\\; a\\div b"] },
      { name: "Negative number rules", tex: ["a-(-b) = a+b", "(-a)\\times(-b) = ab"] },
      { name: "Fraction ↔ decimal ↔ %", tex: ["\\dfrac{a}{b} \\;(\\div) \\to \\text{decimal} \\;(\\times 100) \\to \\%"] },
      { name: "BODMAS order", tex: ["\\text{Brackets} \\to \\text{Orders} \\to \\dfrac{\\times}{\\div} \\to \\dfrac{+}{-}"], note: "Divide/Multiply and Add/Subtract: left to right within each pair" },
      { name: "Proportion (cross-multiply)", tex: ["\\dfrac{a}{b} = \\dfrac{c}{d} \\;\\Rightarrow\\; ad = bc"] },
      { name: "Percentage change", tex: ["\\%\\Delta = \\dfrac{\\text{new} - \\text{original}}{\\text{original}} \\times 100"] },
    ]
  },
  {
    num: "0A",
    title: "Math Foundations",
    formulas: [
      { name: "Exponent rules", tex: ["x^a \\times x^b = x^{a+b}", "x^a / x^b = x^{a-b}", "(x^a)^b = x^{ab}", "x^{-a} = \\dfrac{1}{x^a}, \\quad x^{1/n} = \\sqrt[n]{x}"] },
      { name: "Logarithm rules", tex: ["\\ln(x)=y \\iff e^y = x", "\\ln(ab) = \\ln a + \\ln b", "\\ln(a/b) = \\ln a - \\ln b", "\\ln(a^b) = b \\ln a"] },
      { name: "Summation notation", tex: ["\\sum_{i=1}^n X_i = X_1+X_2+\\cdots+X_n", "\\sum(X_i+Y_i) = \\sum X_i + \\sum Y_i", "\\sum(cX_i) = c\\sum X_i"] },
      { name: "Linear function", tex: ["y = mx+b"], note: "m = slope, b = y-intercept" },
      { name: "Set operations", tex: ["A \\cup B \\text{ (union): in A or B or both}", "A \\cap B \\text{ (intersection): in both}", "A \\cap B = \\emptyset \\text{ : disjoint / mutually exclusive}"] },
    ]
  },
];

MODULES.push(
  {
    num: "01",
    title: "Interest Rates, PV &amp; FV",
    formulas: [
      { name: "Future value of a lump sum", tex: ["FV = PV(1+r)^N"] },
      { name: "Non-annual compounding", tex: ["FV = PV\\left(1+\\dfrac{r_s}{m}\\right)^{mN}"] },
      { name: "Continuous compounding", tex: ["FV = PV \\cdot e^{r_s N}"] },
      { name: "Effective annual rate (EAR)", tex: ["EAR = \\left(1+\\dfrac{r_s}{m}\\right)^{m} - 1", "EAR = e^{r_s} - 1 \\quad \\text{(continuous)}"] },
      { name: "Present value of a lump sum", tex: ["PV = FV_N(1+r)^{-N}"] },
      { name: "FV of an ordinary annuity", tex: ["FV_N = A \\cdot \\dfrac{(1+r)^N - 1}{r}"] },
      { name: "PV of an ordinary annuity", tex: ["PV = A \\cdot \\dfrac{1-(1+r)^{-N}}{r}"] },
      { name: "PV of an annuity due", tex: ["PV_{due} = PV_{ordinary} \\times (1+r)"] },
      { name: "PV of a perpetuity", tex: ["PV = \\dfrac{A}{r}"], note: "Deferred: value at t−1 before first payment, then discount back to t=0" },
      { name: "Growth rate", tex: ["g = \\left(\\dfrac{FV_N}{PV}\\right)^{1/N} - 1"] },
      { name: "Solving for N", tex: ["N = \\dfrac{\\ln(FV/PV)}{\\ln(1+r)}"], note: "Rule of 72: N ≈ 72 / r(%)" },
      { name: "Annuity payment", tex: ["A = \\dfrac{PV}{\\left[\\dfrac{1-(1+r)^{-N}}{r}\\right]}"] },
    ]
  },
  {
    num: "02",
    title: "Organizing &amp; Visualizing Data",
    formulas: [
      { name: "Bin width (frequency distributions)", tex: ["\\text{Bin width} = \\dfrac{\\text{Range}}{k}"], note: "Range = Max − Min; round bin width up" },
      { name: "Relative frequency", tex: ["\\text{Relative freq} = \\dfrac{\\text{bin count}}{n}"] },
      { name: "Cumulative relative frequency", tex: ["\\text{Running sum of relative frequencies}"], note: "Reaches 100% at the last bin" },
      { name: "Contingency table %", tex: ["\\%\\text{ overall} = \\dfrac{\\text{cell}}{\\text{grand total}}", "\\%\\text{ row} = \\dfrac{\\text{cell}}{\\text{row total}}", "\\%\\text{ column} = \\dfrac{\\text{cell}}{\\text{column total}}"] },
    ]
  },
  {
    num: "03",
    title: "Summarizing Data",
    formulas: [
      { name: "Arithmetic mean", tex: ["\\bar{X} = \\dfrac{\\sum X_i}{n}"] },
      { name: "Weighted mean", tex: ["\\bar{X}_w = \\sum(w_i \\times X_i), \\quad \\sum w_i = 1"] },
      { name: "Geometric mean", tex: ["G = (X_1 \\times X_2 \\times \\cdots \\times X_n)^{1/n}"], note: "For returns: [(1+R₁)(1+R₂)…(1+Rₙ)]^(1/n) − 1" },
      { name: "Harmonic mean", tex: ["H = \\dfrac{n}{\\sum(1/X_i)}"], note: "H ≤ G ≤ X̄ always (equal only if all Xᵢ identical)" },
      { name: "Percentile location", tex: ["L_y = (n+1) \\times \\dfrac{y}{100}"], note: "Interpolate if Ly isn't a whole number" },
      { name: "Range &amp; MAD", tex: ["\\text{Range} = Max - Min", "MAD = \\dfrac{\\sum|X_i - \\bar{X}|}{n}"] },
      { name: "Sample variance &amp; std. dev.", tex: ["s^2 = \\dfrac{\\sum(X_i-\\bar{X})^2}{n-1}", "s = \\sqrt{s^2}"] },
      { name: "Target (semi)deviation", tex: ["s_{target} = \\sqrt{\\dfrac{\\sum(X_i-B)^2}{n-1}}"], note: "Sum only over Xᵢ ≤ target B" },
      { name: "Coefficient of variation", tex: ["CV = \\dfrac{s}{\\bar{X}}"] },
    ]
  },
  {
    num: "04",
    title: "Probability Concepts",
    formulas: [
      { name: "Properties of probability", tex: ["0 \\le P(E) \\le 1", "\\sum P(E_i) = 1"], note: "second line: mutually exclusive &amp; exhaustive" },
      { name: "Odds", tex: ["\\text{Odds for } E = \\dfrac{P(E)}{1-P(E)}", "\\text{Odds against } E = \\dfrac{1-P(E)}{P(E)}"] },
      { name: "Conditional probability", tex: ["P(A|B) = \\dfrac{P(AB)}{P(B)}"] },
      { name: "Multiplication rule", tex: ["P(AB) = P(A|B) \\times P(B)"], note: "If independent: P(AB) = P(A) × P(B)" },
      { name: "Addition rule", tex: ["P(A \\text{ or } B) = P(A)+P(B)-P(AB)"] },
      { name: "Total probability rule", tex: ["P(A) = \\sum P(A|S_i)P(S_i)"], note: "Sᵢ mutually exclusive &amp; exhaustive" },
      { name: "Counting", tex: ["n! = n\\times(n-1)\\times\\cdots\\times 1", "{}_nC_r = \\dfrac{n!}{(n-r)!\\,r!} \\;\\text{(order doesn't matter)}", "{}_nP_r = \\dfrac{n!}{(n-r)!} \\;\\text{(order matters)}", "\\text{Multinomial: } \\dfrac{n!}{n_1!n_2!\\cdots n_k!}"] },
    ]
  },
);

MODULES.push(
  {
    num: "05",
    title: "Common Probability Distributions",
    formulas: [
      { name: "Discrete uniform", tex: ["p(x) = \\dfrac{1}{n}"] },
      { name: "Continuous uniform", tex: ["f(x) = \\dfrac{1}{b-a}", "F(x) = \\dfrac{x-a}{b-a}", "\\mu = \\dfrac{a+b}{2}, \\quad \\sigma^2 = \\dfrac{(b-a)^2}{12}"] },
      { name: "Binomial distribution", tex: ["p(x) = {}_nC_x \\cdot p^x(1-p)^{n-x}", "E(X) = np, \\quad Var(X) = np(1-p)"] },
      { name: "Standardization (Z-score)", tex: ["Z = \\dfrac{X-\\mu}{\\sigma}"] },
      { name: "Empirical rule (normal dist.)", tex: ["\\approx 50\\% \\text{ within } \\mu \\pm \\tfrac{2}{3}\\sigma", "\\approx 68\\% \\text{ within } \\mu \\pm 1\\sigma", "\\approx 95\\% \\text{ within } \\mu \\pm 2\\sigma \\;(\\pm 1.96\\sigma)", "\\approx 99\\% \\text{ within } \\mu \\pm 3\\sigma \\;(\\pm 2.58\\sigma)"] },
      { name: "t / chi-square / F distributions", tex: ["t: \\text{ symmetric, } df=n-1\\text{, fatter tails than normal}", "\\chi^2: \\text{ asymmetric, } \\ge 0 \\text{, } df=k", "F: \\text{ asymmetric, } \\ge 0 \\text{, } df=(m,n)"] },
    ]
  },
  {
    num: "06",
    title: "Sampling &amp; Estimation",
    formulas: [
      { name: "Standard error of the mean", tex: ["SE = \\dfrac{s}{\\sqrt{n}} \\quad (\\text{or } \\sigma/\\sqrt{n} \\text{ if known})"] },
      { name: "Confidence interval — general form", tex: ["\\text{Point estimate} \\pm \\text{Reliability factor} \\times SE"] },
      { name: "CI — known population variance", tex: ["\\bar{X} \\pm z_{\\alpha/2} \\cdot \\dfrac{\\sigma}{\\sqrt{n}}"] },
      { name: "CI — unknown variance", tex: ["\\bar{X} \\pm t_{\\alpha/2} \\cdot \\dfrac{s}{\\sqrt{n}} \\quad df=n-1", "\\text{z-alt (large n): } \\bar{X} \\pm z_{\\alpha/2}\\cdot\\dfrac{s}{\\sqrt{n}}"] },
      { name: "Required sample size", tex: ["n = \\left(\\dfrac{\\text{reliability factor} \\times s}{E}\\right)^2"] },
      { name: "Common z reliability factors", tex: ["90\\% \\to 1.65 \\quad 95\\% \\to 1.96 \\quad 99\\% \\to 2.58"] },
    ]
  },
  {
    num: "07",
    title: "Basics of Hypothesis Testing",
    formulas: [
      { name: "Test of a single mean", tex: ["t = \\dfrac{\\bar{X}-\\mu_0}{s/\\sqrt{n}} \\quad df=n-1"] },
      { name: "Difference in means (independent)", tex: ["s_p^2 = \\dfrac{(n_1-1)s_1^2+(n_2-1)s_2^2}{n_1+n_2-2}", "t = \\dfrac{(\\bar{X}_1-\\bar{X}_2)-(\\mu_1-\\mu_2)}{\\sqrt{s_p^2/n_1+s_p^2/n_2}}", "df = n_1+n_2-2"] },
      { name: "Difference in means (paired)", tex: ["t = \\dfrac{\\bar{d}-\\mu_{d0}}{s_{\\bar{d}}} \\quad s_{\\bar{d}}=\\dfrac{s_d}{\\sqrt{n}} \\quad df=n-1"] },
      { name: "Test of a single variance", tex: ["\\chi^2 = \\dfrac{(n-1)s^2}{\\sigma_0^2} \\quad df=n-1"] },
      { name: "Test of equality of two variances", tex: ["F = \\dfrac{s_1^2}{s_2^2} \\quad df=(n_1-1,\\, n_2-1)"], note: "Convention: larger variance in numerator" },
      { name: "Key vocabulary", tex: ["\\alpha = P(\\text{Type I error}), \\quad \\beta = P(\\text{Type II error})", "\\text{Power} = 1-\\beta"], note: "p-value: smallest α at which H₀ is still rejected" },
    ]
  }
);

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

  } catch(e) { console.warn('[formula-sheet] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: foundations
   ============================================================ */
(function(){
  try {
// ============================================================
// Math Foundations for CFA Quant — interactivity
// ============================================================

function parseNums(str){
  return str.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
}
function mean(arr){ return arr.reduce((a,b)=>a+b,0) / arr.length; }
function fmt(n, d=4){ return isFinite(n) ? n.toFixed(d) : "—"; }
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   01 — Exponent explorer
   ============================================================ */
(function(){
  const xI = document.getElementById('expX'), nI = document.getElementById('expN');
  const chart = document.getElementById('expChart'), result = document.getElementById('expResult'), steps = document.getElementById('expSteps');
  if (!xI) return;
  function render(){
    const x = parseFloat(xI.value), n = parseInt(nI.value,10);
    const val = Math.pow(x, n);
    result.textContent = `${x}${superscript(n)} = ${fmt(val,4)}`;
    if (n >= 0 && Number.isInteger(n) && n <= 12){
      const chain = new Array(Math.max(n,1)).fill(x).join(' × ');
      steps.textContent = n === 0 ? `${x}⁰ = 1 (by definition)` : `${chain} = ${fmt(val,4)}`;
    } else if (n < 0) {
      steps.textContent = `1 / (${x}${superscript(-n)}) = 1 / ${fmt(Math.pow(x,-n),4)} = ${fmt(val,4)}`;
    } else {
      steps.textContent = `${x}^${n} = ${fmt(val,4)}`;
    }
    // mini bar chart showing growth across n=0..n
    chart.innerHTML = '';
    const maxN = Math.max(1, Math.min(10, Math.round(Math.abs(n))));
    const wrap = document.createElement('div');
    wrap.style.display='flex'; wrap.style.gap='3px'; wrap.style.alignItems='flex-end'; wrap.style.height='90px';
    const values = [];
    for (let i=0; i<=maxN; i++) values.push(Math.pow(x, n>=0 ? i : -i));
    const maxVal = Math.max(...values.map(v=>Math.abs(v)), 1);
    values.forEach((v,i) => {
      const col = document.createElement('div');
      col.style.flex='1'; col.style.display='flex'; col.style.flexDirection='column'; col.style.alignItems='center'; col.style.justifyContent='flex-end'; col.style.height='100%';
      const bar = document.createElement('div');
      bar.style.width='100%'; bar.style.height=Math.max(2,Math.min(70,(Math.abs(v)/maxVal*70)))+'px'; bar.style.background='var(--indigo)'; bar.style.borderRadius='2px 2px 0 0';
      col.appendChild(bar);
      const lbl = document.createElement('div');
      lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.6rem'; lbl.style.marginTop='3px'; lbl.style.color='var(--ink-soft)';
      lbl.textContent = n>=0 ? i : -i;
      col.appendChild(lbl);
      wrap.appendChild(col);
    });
    chart.appendChild(wrap);
  }
  function superscript(n){
    const map = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'};
    return String(n).split('').map(c => map[c] || c).join('');
  }
  [xI,nI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   02 — Natural log calculator
   ============================================================ */
(function(){
  const xI = document.getElementById('lnX');
  const result = document.getElementById('lnResult'), steps = document.getElementById('lnSteps');
  if (!xI) return;
  function render(){
    const x = parseFloat(xI.value);
    if (isNaN(x) || x <= 0){ result.textContent = 'x must be positive'; steps.textContent=''; return; }
    const val = Math.log(x);
    result.textContent = `ln(${x}) = ${fmt(val,4)}`;
    steps.textContent = `e^${fmt(val,4)} ≈ ${x} — that's the defining relationship`;
  }
  xI.addEventListener('input', render);
  render();
})();

/* ============================================================
   03 — Summation calculator
   ============================================================ */
(function(){
  const input = document.getElementById('sumInput');
  const result = document.getElementById('sumResult'), steps = document.getElementById('sumSteps');
  if (!input) return;
  function mode(){ return document.querySelector('input[name="sumMode"]:checked').value; }
  function render(){
    const arr = parseNums(input.value);
    if (arr.length === 0){ result.textContent = 'Enter numbers'; steps.textContent=''; return; }
    const m = mode();
    if (m === 'plain'){
      const sum = arr.reduce((a,b)=>a+b,0);
      result.textContent = `Σ = ${fmt(sum,2)}`;
      steps.textContent = arr.join(' + ') + ` = ${fmt(sum,2)}`;
    } else if (m === 'squared'){
      const squares = arr.map(v=>v*v);
      const sum = squares.reduce((a,b)=>a+b,0);
      result.textContent = `Σ = ${fmt(sum,2)}`;
      steps.textContent = squares.map((v,i)=>`${arr[i]}²`).join(' + ') + ` = ` + squares.map(v=>fmt(v,1)).join(' + ') + ` = ${fmt(sum,2)}`;
    } else {
      const xbar = mean(arr);
      const devs = arr.map(v=>Math.pow(v-xbar,2));
      const sum = devs.reduce((a,b)=>a+b,0);
      result.textContent = `Σ = ${fmt(sum,2)}`;
      steps.textContent = `X̄=${fmt(xbar,2)} · ` + arr.map(v=>`(${v}−${fmt(xbar,2)})²`).join(' + ') + ` = ${fmt(sum,2)}`;
    }
  }
  input.addEventListener('input', render);
  document.querySelectorAll('input[name="sumMode"]').forEach(el => el.addEventListener('change', render));
  render();
})();

/* ============================================================
   05 — Venn diagram (clickable regions)
   ============================================================ */
(function(){
  const container = document.getElementById('vennChart');
  const explain = document.getElementById('vennExplain');
  if (!container) return;
  const info = {
    aonly: {title:"A only (A − B)", text:"Elements in A but not in B. In probability terms, this is the part of event A that doesn't overlap with B."},
    bonly: {title:"B only (B − A)", text:"Elements in B but not in A — the mirror image of A only."},
    intersection: {title:"A ∩ B — the intersection", text:"Elements in both A and B at once. This is exactly the joint probability P(AB) from the multiplication rule."},
    union: {title:"A ∪ B — the union (whole shaded area)", text:"Everything in A, or B, or both — every element that belongs to at least one of the two sets. This is exactly what the addition rule P(A or B) computes."}
  };
  const W=360, H=220;
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'venn-svg', style:'max-width:400px; display:block; margin:0 auto;'});
  const circleA = svgEl('circle', {cx:140, cy:110, r:75, fill:'#2B2560', 'fill-opacity':'0.35', class:'venn-region', 'data-region':'aonly'});
  const circleB = svgEl('circle', {cx:220, cy:110, r:75, fill:'#E8A33D', 'fill-opacity':'0.35', class:'venn-region', 'data-region':'bonly'});
  svg.appendChild(circleA);
  svg.appendChild(circleB);
  // intersection overlay (approximate lens via clip - simple approach: a smaller circle-ish path using two arcs)
  const lensPath = svgEl('path', {
    d: "M 180 47 A 75 75 0 0 1 180 173 A 75 75 0 0 1 180 47 Z",
    fill: '#2F8F6B', 'fill-opacity':'0.55', class:'venn-region', 'data-region':'intersection'
  });
  svg.appendChild(lensPath);
  const labelA = svgEl('text', {x:100, y:60, 'font-family':'IBM Plex Mono', 'font-size':13, fill:'#1C1B29', 'font-weight':'700'});
  labelA.textContent = 'A';
  svg.appendChild(labelA);
  const labelB = svgEl('text', {x:250, y:60, 'font-family':'IBM Plex Mono', 'font-size':13, fill:'#1C1B29', 'font-weight':'700'});
  labelB.textContent = 'B';
  svg.appendChild(labelB);
  container.innerHTML = '';
  container.appendChild(svg);

  const hint = document.createElement('p');
  hint.style.fontSize = '.8rem'; hint.style.color = 'var(--ink-soft)'; hint.style.textAlign='center'; hint.style.marginTop='8px';
  hint.textContent = 'Click a region — or the button below for the full union.';
  container.appendChild(hint);

  const unionBtn = document.createElement('button');
  unionBtn.className = 'test-tab';
  unionBtn.style.display = 'block';
  unionBtn.style.margin = '10px auto 0';
  unionBtn.textContent = 'Show A ∪ B (union)';
  unionBtn.addEventListener('click', () => showInfo('union'));
  container.appendChild(unionBtn);

  function showInfo(key){
    const i = info[key];
    explain.innerHTML = `<strong>${i.title}:</strong> ${i.text}`;
    explain.style.display = 'block';
  }
  svg.querySelectorAll('.venn-region').forEach(region => {
    region.addEventListener('click', () => showInfo(region.dataset.region));
  });
})();

/* ============================================================
   06 — Linear function grapher
   ============================================================ */
(function(){
  const container = document.getElementById('lineGraphChart');
  const mI = document.getElementById('graphM'), bI = document.getElementById('graphB');
  if (!container) return;
  function render(){
    const m = parseFloat(mI.value), b = parseFloat(bI.value);
    const W=480, H=280, pad=36;
    const domainMin=-6, domainMax=6;
    const xScale = v => pad + (v-domainMin)/(domainMax-domainMin)*(W-2*pad);
    const yScale = v => H-pad - (v-domainMin)/(domainMax-domainMin)*(H-2*pad);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'graph-svg', style:'max-width:500px;'});
    // grid
    for (let v=domainMin; v<=domainMax; v++){
      svg.appendChild(svgEl('line', {x1:xScale(v), x2:xScale(v), y1:pad, y2:H-pad, stroke:'#E3DCC9', 'stroke-width':0.5}));
      svg.appendChild(svgEl('line', {x1:pad, x2:W-pad, y1:yScale(v), y2:yScale(v), stroke:'#E3DCC9', 'stroke-width':0.5}));
    }
    // axes
    svg.appendChild(svgEl('line', {x1:pad, x2:W-pad, y1:yScale(0), y2:yScale(0), stroke:'#4A4763', 'stroke-width':1.5}));
    svg.appendChild(svgEl('line', {x1:xScale(0), x2:xScale(0), y1:pad, y2:H-pad, stroke:'#4A4763', 'stroke-width':1.5}));
    // axis labels
    [-6,-4,-2,2,4,6].forEach(v => {
      const t = svgEl('text', {x:xScale(v), y:yScale(0)+14, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':8, fill:'#4A4763'});
      t.textContent = v;
      svg.appendChild(t);
    });
    // line y = mx+b, clipped to domain
    const y1 = m*domainMin+b, y2 = m*domainMax+b;
    svg.appendChild(svgEl('line', {x1:xScale(domainMin), y1:yScale(Math.max(domainMin,Math.min(domainMax,y1))), x2:xScale(domainMax), y2:yScale(Math.max(domainMin,Math.min(domainMax,y2))), stroke:'#C77F1E', 'stroke-width':2.5}));
    // intercept marker
    if (b>=domainMin && b<=domainMax){
      svg.appendChild(svgEl('circle', {cx:xScale(0), cy:yScale(b), r:5, fill:'#2F8F6B', stroke:'#fff', 'stroke-width':1.5}));
      const t = svgEl('text', {x:xScale(0)+8, y:yScale(b)-8, 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#2F8F6B', 'font-weight':'700'});
      t.textContent = `b=${b}`;
      svg.appendChild(t);
    }
    const eqLabel = svgEl('text', {x:W-pad, y:pad-8, 'text-anchor':'end', 'font-family':'IBM Plex Mono', 'font-size':11, fill:'#C77F1E', 'font-weight':'700'});
    eqLabel.textContent = `y = ${m}x ${b>=0?'+':'−'} ${Math.abs(b)}`;
    svg.appendChild(eqLabel);
    container.innerHTML = '';
    container.appendChild(svg);
  }
  [mI,bI].forEach(el => el.addEventListener('input', render));
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
const sectionIds = ['sec-exponents','sec-logs','sec-summation','sec-algebra','sec-sets','sec-functions','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-foundations', String(pct)); } catch(e) {}
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
    concept: "Exponents & Roots",
    q: "What does x⁴ mean?",
    opts: ["x × 4", "x × x × x × x", "4 × x × x"],
    correct: 1,
    exp: "An exponent counts how many copies of x are multiplied together: x⁴ = x × x × x × x."
  },
  {
    concept: "Exponents & Roots",
    q: "Simplify: x⁵ / x²",
    opts: ["x³", "x⁷", "x^2.5"],
    correct: 0,
    exp: "Dividing same-base exponents subtracts them: x⁵/x² = x⁵⁻² = x³."
  },
  {
    concept: "Exponents & Roots",
    q: "What is x⁰ equal to, for any nonzero x?",
    opts: ["0", "1", "x"],
    correct: 1,
    exp: "By definition, any nonzero number raised to the power 0 equals 1."
  },
  {
    concept: "Exponents & Roots",
    q: "Rewrite x⁻³ using a positive exponent.",
    opts: ["−x³", "1/x³", "3/x"],
    correct: 1,
    exp: "A negative exponent means 'take the reciprocal': x⁻³ = 1/x³."
  },
  {
    concept: "Exponents & Roots",
    q: "The square root of x can be written as which exponent?",
    opts: ["x²", "x^(1/2)", "x^(-2)"],
    correct: 1,
    exp: "Roots are fractional exponents: the square root of x is x^(1/2)."
  },
  {
    concept: "Logarithms",
    q: "ln(x) = y means exactly the same thing as:",
    opts: ["x = y²", "e^y = x", "x × y = 1"],
    correct: 1,
    exp: "A logarithm and an exponent are inverse operations: ln(x) = y is the same statement as e^y = x."
  },
  {
    concept: "Logarithms",
    q: "Using log rules, ln(a/b) simplifies to:",
    opts: ["ln(a) − ln(b)", "ln(a) + ln(b)", "ln(a) × ln(b)"],
    correct: 0,
    exp: "Dividing inside a log becomes subtraction outside: ln(a/b) = ln(a) − ln(b)."
  },
  {
    concept: "Logarithms",
    q: "Solving FV = PV(1+r)^N for N requires which key algebra move?",
    opts: ["Squaring both sides", "Taking the natural log of both sides", "Multiplying both sides by N"],
    correct: 1,
    exp: "Taking ln of both sides lets you use ln(a^b) = b·ln(a) to bring the exponent N down where it can be isolated."
  },
  {
    concept: "Summation Notation",
    q: "What does Σᵢ₌₁³ Xᵢ expand to?",
    opts: ["X₁ + X₂ + X₃", "X₁ × X₂ × X₃", "X₃ − X₁"],
    correct: 0,
    exp: "Σ with i running from 1 to 3 means add up X₁, X₂, and X₃."
  },
  {
    concept: "Summation Notation",
    q: "For the data 2, 5, 3, what does (ΣXᵢ)² equal — squaring the total, not each term?",
    opts: ["38", "100", "10"],
    correct: 1,
    exp: "This notation squares the total: (2+5+3)² = 10² = 100. (Careful — this is different from ΣXᵢ², which would square each term first and then add: 4+25+9=38.)"
  },
  {
    concept: "Summation Notation",
    q: "Which property lets you factor a constant outside a summation?",
    opts: ["Σ(c × Xᵢ) = c × ΣXᵢ", "Σ(Xᵢ + c) = ΣXᵢ", "Σc = c"],
    correct: 0,
    exp: "A constant multiplier can always be pulled outside the summation: Σ(c × Xᵢ) = c × ΣXᵢ."
  },
  {
    concept: "Rearranging Equations",
    q: "Solve for x: 5x − 4 = 26.",
    opts: ["x = 4.4", "x = 6", "x = 30"],
    correct: 1,
    exp: "Add 4 to both sides: 5x = 30. Divide both sides by 5: x = 6."
  },
  {
    concept: "Rearranging Equations",
    q: "When rearranging PV = A × [1−(1+r)⁻ᴺ]/r to solve for A, what must you divide by?",
    opts: ["Just r", "The entire bracketed expression [1−(1+r)⁻ᴺ]/r", "Just (1+r)⁻ᴺ"],
    correct: 1,
    exp: "You must divide both sides by the entire multiplier attached to A — the whole bracketed term — not just a piece of it."
  },
  {
    concept: "Sets & Set Notation",
    q: "A = {1, 3, 5, 7} and B = {3, 5, 9}. What is A ∪ B?",
    opts: ["{3, 5}", "{1, 3, 5, 7, 9}", "{1, 7, 9}"],
    correct: 1,
    exp: "The union combines every element from both sets, without duplicating the shared ones: {1, 3, 5, 7, 9}."
  },
  {
    concept: "Sets & Set Notation",
    q: "A = {1, 3, 5, 7} and B = {3, 5, 9}. What is A ∩ B?",
    opts: ["{3, 5}", "{1, 7, 9}", "∅"],
    correct: 0,
    exp: "The intersection is only the elements found in both sets: 3 and 5 appear in both A and B."
  },
  {
    concept: "Sets & Set Notation",
    q: "In probability language, A ∩ B = ∅ describes two events that are:",
    opts: ["Independent", "Mutually exclusive", "Exhaustive"],
    correct: 1,
    exp: "An empty intersection means the two sets (events) share no outcomes at all — the set-theory definition of mutually exclusive."
  },
  {
    concept: "Functions & the Cartesian Plane",
    q: "A function f(x) is best defined as a rule that:",
    opts: ["Produces a random output for each input", "Produces exactly one output for each input", "Only accepts positive inputs"],
    correct: 1,
    exp: "The defining feature of a function is reliability: one specific output for every input, never two different outputs for the same input."
  },
  {
    concept: "Functions & the Cartesian Plane",
    q: "In the linear equation y = mx + b, what does b represent?",
    opts: ["The slope", "The y-intercept (value of y when x=0)", "The x-intercept"],
    correct: 1,
    exp: "b is the y-intercept — where the line crosses the y-axis, which happens exactly when x = 0."
  },
  {
    concept: "Functions & the Cartesian Plane",
    q: "A line has equation y = −2x + 5. As x increases by 1, what happens to y?",
    opts: ["y increases by 2", "y decreases by 2", "y stays the same"],
    correct: 1,
    exp: "The slope is −2, meaning y falls by 2 units for every 1-unit increase in x."
  },
  {
    concept: "Functions & the Cartesian Plane",
    q: "A probability density function f(x), plotted as a bell curve, is an example of:",
    opts: ["A set", "A function graphed on the Cartesian plane", "A summation"],
    correct: 1,
    exp: "f(x) assigns exactly one height (probability density) to each possible value x — precisely the definition of a function, visualized on the x-y plane."
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
          cfaRecordAnswer(item.concept, "Math Foundations", i === item.correct);
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
    if (pct >= 90) msg = "Excellent — you've genuinely internalized the toolkit.";
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

  } catch(e) { console.warn('[foundations] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: hypothesis-testing
   ============================================================ */
(function(){
  try {
// ============================================================
// Basics of Hypothesis Testing — interactivity
// ============================================================

/* ---------- math helpers ---------- */
function erf(x){
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429, p=0.3275911;
  const t = 1/(1+p*x);
  const y = 1 - (((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
  return sign*y;
}
function normCDF(z){ return 0.5 * (1 + erf(z/Math.sqrt(2))); }
function normPDF(x, mu=0, sigma=1){ return Math.exp(-0.5*Math.pow((x-mu)/sigma,2)) / (sigma*Math.sqrt(2*Math.PI)); }
function normInv(p){
  let lo=-8, hi=8;
  for (let i=0;i<80;i++){ const mid=(lo+hi)/2; if (normCDF(mid)<p) lo=mid; else hi=mid; }
  return (lo+hi)/2;
}
function gamma(z){
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI*z) * gamma(1-z));
  z -= 1;
  let x = c[0];
  for (let i=1; i<g+2; i++) x += c[i]/(z+i);
  const t = z + g + 0.5;
  return Math.sqrt(2*Math.PI) * Math.pow(t, z+0.5) * Math.exp(-t) * x;
}
// Numerically stable log(Gamma(z)) — avoids overflow for large z (e.g. large degrees of freedom)
function lnGamma(z){
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI*z)) - lnGamma(1-z);
  z -= 1;
  let x = c[0];
  for (let i=1; i<g+2; i++) x += c[i]/(z+i);
  const t = z + g + 0.5;
  return 0.5*Math.log(2*Math.PI) + (z+0.5)*Math.log(t) - t + Math.log(x);
}
function tPDF(x, df){
  const lnCoef = lnGamma((df+1)/2) - lnGamma(df/2) - 0.5*Math.log(df*Math.PI);
  const lnShape = -(df+1)/2 * Math.log(1 + (x*x)/df);
  return Math.exp(lnCoef + lnShape);
}
function simpsonIntegrate(f, a, b, n){
  if (n % 2 === 1) n++;
  const h = (b-a)/n;
  let sum = f(a) + f(b);
  for (let i=1; i<n; i++){
    sum += f(a+i*h) * (i%2===0 ? 2 : 4);
  }
  return (h/3)*sum;
}
function tRightTail(x, df){
  return simpsonIntegrate(t => tPDF(t, df), x, x+60, 2000);
}
function tInv(alpha, df){
  let lo=0, hi=60;
  for (let i=0;i<60;i++){ const mid=(lo+hi)/2; if (tRightTail(mid,df) > alpha) lo=mid; else hi=mid; }
  return (lo+hi)/2;
}
function chiSqPDF(x, k){
  if (x <= 0) return 0;
  const lnCoef = (k/2 - 1)*Math.log(x) - x/2 - (k/2)*Math.log(2) - lnGamma(k/2);
  return Math.exp(lnCoef);
}
function chiSqRightTail(x, k){
  const upper = Math.max(x + 10*Math.sqrt(2*k) + 50, x+100);
  return simpsonIntegrate(t => chiSqPDF(t, k), x, upper, 3000);
}
// Inverse chi-square: find x such that right-tail area = p (i.e., x is the (1-p) quantile)
function chiSqInv(p, k){
  let lo = 1e-6, hi = k*20 + 200;
  for (let i=0;i<80;i++){
    const mid=(lo+hi)/2;
    if (chiSqRightTail(mid,k) > p) lo=mid; else hi=mid;
  }
  return (lo+hi)/2;
}
// F-distribution pdf via Beta function (Beta(a,b) = gamma(a)gamma(b)/gamma(a+b))
function fPDF(x, d1, d2){
  if (x <= 0) return 0;
  const lnBeta = lnGamma(d1/2) + lnGamma(d2/2) - lnGamma((d1+d2)/2);
  const lnNum = 0.5*(d1*Math.log(d1*x) + d2*Math.log(d2) - (d1+d2)*Math.log(d1*x+d2));
  return Math.exp(lnNum - Math.log(x) - lnBeta);
}
function fRightTail(x, d1, d2){
  const upper = Math.max(x*8 + 50, 200);
  return simpsonIntegrate(t => fPDF(t, d1, d2), x, upper, 3000);
}
function fInv(p, d1, d2){
  let lo = 1e-6, hi = 80;
  for (let i=0;i<80;i++){
    const mid=(lo+hi)/2;
    if (fRightTail(mid,d1,d2) > p) lo=mid; else hi=mid;
  }
  return (lo+hi)/2;
}
function fmtP(n, d=4){ return isFinite(n) ? n.toFixed(d) : "—"; }
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   01 — Sampling distribution histogram (illustrative, seeded)
   ============================================================ */
(function(){
  const container = document.getElementById('samplingDistChart');
  if (!container) return;
  function mulberry32(a){
    return function(){
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(123);
  // simulate 100 sample means of n=30 draws from N(6,2^2)
  function randNorm(){
    const u1 = rnd(), u2 = rnd();
    return Math.sqrt(-2*Math.log(u1)) * Math.cos(2*Math.PI*u2);
  }
  const means = [];
  for (let s=0; s<100; s++){
    let sum=0;
    for (let i=0;i<30;i++) sum += 6 + 2*randNorm();
    means.push(sum/30);
  }
  const min = Math.min(...means), max = Math.max(...means);
  const binCount = 11;
  const width = (max-min)/binCount;
  const bins = new Array(binCount).fill(0);
  means.forEach(m => {
    let idx = Math.floor((m-min)/width);
    if (idx >= binCount) idx = binCount-1;
    bins[idx]++;
  });
  const maxBin = Math.max(...bins);
  const wrap = document.createElement('div');
  wrap.style.display='flex'; wrap.style.gap='3px'; wrap.style.alignItems='flex-end'; wrap.style.height='110px';
  bins.forEach((count,i) => {
    const col = document.createElement('div');
    col.style.flex='1'; col.style.display='flex'; col.style.flexDirection='column'; col.style.alignItems='center'; col.style.justifyContent='flex-end'; col.style.height='100%';
    const bar = document.createElement('div');
    bar.style.width='100%'; bar.style.height=Math.max(2,(count/maxBin*85))+'px'; bar.style.background='var(--indigo)'; bar.style.borderRadius='2px 2px 0 0';
    col.appendChild(bar);
    const lbl = document.createElement('div');
    lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.58rem'; lbl.style.marginTop='4px'; lbl.style.color='var(--ink-soft)'; lbl.style.transform='rotate(-45deg)'; lbl.style.whiteSpace='nowrap';
    lbl.textContent = (min+i*width).toFixed(2);
    col.appendChild(lbl);
    wrap.appendChild(col);
  });
  container.appendChild(wrap);
})();

/* ============================================================
   04 — Error matrix interactive
   ============================================================ */
(function(){
  const matrix = document.getElementById('errMatrix');
  const explain = document.getElementById('errExplain');
  if (!matrix) return;
  const info = {
    correct1: {title:"Correct decision", text:"You failed to reject a true null hypothesis — the right call. This happens with probability 1−α, the confidence level."},
    type2: {title:"Type II error (β)", text:"You failed to reject a false null hypothesis — a missed detection, a false negative. Its probability is denoted β."},
    type1: {title:"Type I error (α)", text:"You rejected a true null hypothesis — a false alarm, a false positive. Its probability is exactly the significance level, α."},
    correct2: {title:"Correct decision (power)", text:"You correctly rejected a false null hypothesis. This probability, 1−β, is called the power of the test."}
  };
  matrix.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => {
      matrix.querySelectorAll('.cell').forEach(c => c.classList.remove('correct','error'));
      const key = cell.dataset.outcome;
      if (key === 'correct1' || key === 'correct2') cell.classList.add('correct');
      else cell.classList.add('error');
      const info_ = info[key];
      explain.innerHTML = `<strong>${info_.title}:</strong> ${info_.text}`;
      explain.style.display = 'block';
    });
  });
})();

/* ============================================================
   05 — Rejection region chart (two/right/left tabs)
   ============================================================ */
(function(){
  const container = document.getElementById('rejectionRegionChart');
  const tabs = document.getElementById('rejectionTabs');
  if (!container) return;
  function render(side){
    const W=520, H=210, padL=24, padR=24, padT=14, padB=24;
    const domainMin=-4, domainMax=4;
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const maxPdf = normPDF(0);
    const yScale = v => (H-padB) - (v/maxPdf)*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:560px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
    let z1, z2;
    if (side === 'two'){ z1=-1.96; z2=1.96; }
    else if (side === 'right'){ z1=null; z2=1.645; }
    else { z1=-1.645; z2=null; }
    // shaded rejection regions
    function shadeRegion(from, to){
      let d = `M${xScale(from)},${H-padB} `;
      for (let x=from; x<=to; x+=0.05) d += `L${xScale(x)},${yScale(normPDF(x))} `;
      d += `L${xScale(to)},${H-padB} Z`;
      svg.appendChild(svgEl('path', {d, fill:'#D6573F', 'fill-opacity':0.4}));
    }
    if (z1 !== null) shadeRegion(domainMin, z1);
    if (z2 !== null) shadeRegion(z2, domainMax);
    let d = '';
    for (let x=domainMin; x<=domainMax; x+=0.05){
      const px=xScale(x), py=yScale(normPDF(x));
      d += (x===domainMin?'M':'L')+px+','+py+' ';
    }
    svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2B2560', 'stroke-width':2}));
    [z1,z2].forEach(z => {
      if (z===null) return;
      svg.appendChild(svgEl('line', {x1:xScale(z), x2:xScale(z), y1:padT, y2:H-padB, stroke:'#C77F1E', 'stroke-width':1.5, 'stroke-dasharray':'3,2'}));
      const t = svgEl('text', {x:xScale(z), y:padT-2, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#C77F1E', 'font-weight':'700'});
      t.textContent = z.toFixed(3);
      svg.appendChild(t);
    });
    const label = svgEl('text', {x:W/2, y:H-6, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#4A4763'});
    label.textContent = side==='two' ? 'Reject in both tails (2.5% each)' : side==='right' ? 'Reject in right tail only (5%)' : 'Reject in left tail only (5%)';
    svg.appendChild(label);
    container.innerHTML = '';
    container.appendChild(svg);
  }
  tabs.querySelectorAll('.test-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.test-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.side);
    });
  });
  render('two');
})();

/* ============================================================
   07 — p-value chart & calculator
   ============================================================ */
(function(){
  const container = document.getElementById('pvalueChart');
  const zI = document.getElementById('pvZ');
  const result = document.getElementById('pvResult');
  if (!container) return;
  function render(){
    const z = parseFloat(zI.value);
    const absZ = Math.abs(z);
    const p = 2*(1-normCDF(absZ));
    result.textContent = `p-value = ${(p*100).toFixed(2)}%`;

    const W=520, H=200, padL=24, padR=24, padT=14, padB=24;
    const domainMin=-4, domainMax=4;
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const maxPdf = normPDF(0);
    const yScale = v => (H-padB) - (v/maxPdf)*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:560px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
    function shadeRegion(from, to, color, opacity){
      let d = `M${xScale(from)},${H-padB} `;
      for (let x=from; x<=to; x+=0.05) d += `L${xScale(x)},${yScale(normPDF(x))} `;
      d += `L${xScale(to)},${H-padB} Z`;
      svg.appendChild(svgEl('path', {d, fill:color, 'fill-opacity':opacity}));
    }
    // alpha=5% region (fixed reference, light)
    shadeRegion(domainMin, -1.96, '#2B2560', 0.18);
    shadeRegion(1.96, domainMax, '#2B2560', 0.18);
    // p-value region (calculated z, darker overlay)
    shadeRegion(domainMin, -absZ, '#D6573F', 0.5);
    shadeRegion(absZ, domainMax, '#D6573F', 0.5);
    let d = '';
    for (let x=domainMin; x<=domainMax; x+=0.05){
      const px=xScale(x), py=yScale(normPDF(x));
      d += (x===domainMin?'M':'L')+px+','+py+' ';
    }
    svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2B2560', 'stroke-width':2}));
    [-absZ, absZ].forEach(v => {
      svg.appendChild(svgEl('line', {x1:xScale(v), x2:xScale(v), y1:padT, y2:H-padB, stroke:'#8a2f1c', 'stroke-width':1.5}));
    });
    container.innerHTML = '';
    container.appendChild(svg);
    const legend = document.createElement('div');
    legend.style.display='flex'; legend.style.gap='14px'; legend.style.marginTop='6px'; legend.style.fontFamily='var(--font-mono)'; legend.style.fontSize='.7rem'; legend.style.flexWrap='wrap';
    legend.innerHTML = `<span><span style="display:inline-block;width:10px;height:10px;background:#2B2560;opacity:.4;border-radius:2px;margin-right:5px;"></span>α=5% region (±1.96)</span><span><span style="display:inline-block;width:10px;height:10px;background:#D6573F;opacity:.6;border-radius:2px;margin-right:5px;"></span>p-value region (±${absZ.toFixed(2)})</span>`;
    container.appendChild(legend);
  }
  zI.addEventListener('input', render);
  render();
})();

/* ============================================================
   09 — Single mean test calculator
   ============================================================ */
(function(){
  const meanI=document.getElementById('smMean'), mu0I=document.getElementById('smMu0'),
        sI=document.getElementById('smS'), nI=document.getElementById('smN'), alphaI=document.getElementById('smAlpha');
  const steps=document.getElementById('smSteps'), decision=document.getElementById('smDecision');
  if (!meanI) return;
  function side(){ return document.querySelector('input[name="smSide"]:checked').value; }
  function render(){
    const mean=parseFloat(meanI.value), mu0=parseFloat(mu0I.value), s=parseFloat(sI.value), n=parseInt(nI.value,10);
    const alpha=parseFloat(alphaI.value)/100;
    const df = n-1;
    const se = s/Math.sqrt(n);
    const t = (mean-mu0)/se;
    const sd = side();
    let reject, critText;
    if (sd === 'two'){
      const crit = tInv(alpha/2, df);
      reject = Math.abs(t) > crit;
      critText = `±${crit.toFixed(3)}`;
    } else if (sd === 'right'){
      const crit = tInv(alpha, df);
      reject = t > crit;
      critText = `${crit.toFixed(3)} (right)`;
    } else {
      const crit = tInv(alpha, df);
      reject = t < -crit;
      critText = `−${crit.toFixed(3)} (left)`;
    }
    steps.textContent = `t = (${mean}−${mu0})/(${s}/√${n}) = ${fmtP(t,3)} · df=${df} · critical ${critText}`;
    decision.textContent = reject ? 'REJECT the null' : 'FAIL TO REJECT the null';
    decision.className = 'decision-banner ' + (reject ? 'reject' : 'fail');
  }
  [meanI,mu0I,sI,nI,alphaI].forEach(el => el.addEventListener('input', render));
  document.querySelectorAll('input[name="smSide"]').forEach(el => el.addEventListener('change', render));
  render();
})();

/* ============================================================
   10 — Independent samples t-test calculator
   ============================================================ */
(function(){
  const m1I=document.getElementById('imMean1'), s1I=document.getElementById('imS1'), n1I=document.getElementById('imN1'),
        m2I=document.getElementById('imMean2'), s2I=document.getElementById('imS2'), n2I=document.getElementById('imN2'),
        alphaI=document.getElementById('imAlpha');
  const steps=document.getElementById('imSteps'), decision=document.getElementById('imDecision');
  if (!m1I) return;
  function render(){
    const m1=parseFloat(m1I.value), s1=parseFloat(s1I.value), n1=parseInt(n1I.value,10);
    const m2=parseFloat(m2I.value), s2=parseFloat(s2I.value), n2=parseInt(n2I.value,10);
    const alpha=parseFloat(alphaI.value)/100;
    const df = n1+n2-2;
    const sp2 = ((n1-1)*s1*s1 + (n2-1)*s2*s2) / df;
    const se = Math.sqrt(sp2/n1 + sp2/n2);
    const t = (m1-m2)/se;
    const crit = tInv(alpha/2, df);
    const reject = Math.abs(t) > crit;
    steps.textContent = `s²ₚ=${fmtP(sp2,4)} · t=${fmtP(t,3)} · df=${df} · critical ±${crit.toFixed(3)}`;
    decision.textContent = reject ? 'REJECT the null' : 'FAIL TO REJECT the null';
    decision.className = 'decision-banner ' + (reject ? 'reject' : 'fail');
  }
  [m1I,s1I,n1I,m2I,s2I,n2I,alphaI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   11 — Paired samples t-test calculator
   ============================================================ */
(function(){
  const dbarI=document.getElementById('pmDbar'), sdI=document.getElementById('pmSd'),
        nI=document.getElementById('pmN'), mu0I=document.getElementById('pmMu0'), alphaI=document.getElementById('pmAlpha');
  const steps=document.getElementById('pmSteps'), decision=document.getElementById('pmDecision');
  if (!dbarI) return;
  function render(){
    const dbar=parseFloat(dbarI.value), sd=parseFloat(sdI.value), n=parseInt(nI.value,10);
    const mu0=parseFloat(mu0I.value), alpha=parseFloat(alphaI.value)/100;
    const df = n-1;
    const sdbar = sd/Math.sqrt(n);
    const t = (dbar-mu0)/sdbar;
    const crit = tInv(alpha/2, df);
    const reject = Math.abs(t) > crit;
    steps.textContent = `s_d̄=${fmtP(sdbar,3)} · t=${fmtP(t,3)} · df=${df} · critical ±${crit.toFixed(3)}`;
    decision.textContent = reject ? 'REJECT the null' : 'FAIL TO REJECT the null';
    decision.className = 'decision-banner ' + (reject ? 'reject' : 'fail');
  }
  [dbarI,sdI,nI,mu0I,alphaI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   12 — Variance tests: chi-square & F, with tab toggle
   ============================================================ */
(function(){
  const varTabs = document.getElementById('varTabs');
  const chisqPanel = document.getElementById('chisqPanel'), fPanel = document.getElementById('fPanel');
  if (!varTabs) return;

  // chi-square
  const csS=document.getElementById('csS'), csSigma0=document.getElementById('csSigma0'),
        csN=document.getElementById('csN'), csAlpha=document.getElementById('csAlpha');
  const csSteps=document.getElementById('csSteps'), csDecision=document.getElementById('csDecision');
  function renderChiSq(){
    const s=parseFloat(csS.value), sigma0=parseFloat(csSigma0.value), n=parseInt(csN.value,10);
    const alpha=parseFloat(csAlpha.value)/100;
    const df = n-1;
    const chi2 = df*(s*s)/(sigma0*sigma0);
    const lower = chiSqInv(1-alpha/2, df);
    const upper = chiSqInv(alpha/2, df);
    const reject = chi2 < lower || chi2 > upper;
    csSteps.textContent = `χ² = ${df}(${s}²)/${sigma0}² = ${fmtP(chi2,3)} · df=${df} · critical [${lower.toFixed(3)}, ${upper.toFixed(3)}]`;
    csDecision.textContent = reject ? 'REJECT the null' : 'FAIL TO REJECT the null';
    csDecision.className = 'decision-banner ' + (reject ? 'reject' : 'fail');
  }
  [csS,csSigma0,csN,csAlpha].forEach(el => el.addEventListener('input', renderChiSq));
  renderChiSq();

  // F-test
  const fS1=document.getElementById('fS1'), fN1=document.getElementById('fN1'),
        fS2=document.getElementById('fS2'), fN2=document.getElementById('fN2'), fAlpha=document.getElementById('fAlpha');
  const fSteps=document.getElementById('fSteps'), fDecision=document.getElementById('fDecision');
  function renderF(){
    const s1=parseFloat(fS1.value), n1=parseInt(fN1.value,10);
    const s2=parseFloat(fS2.value), n2=parseInt(fN2.value,10);
    const alpha=parseFloat(fAlpha.value)/100;
    const df1=n1-1, df2=n2-1;
    const F = (s1*s1)/(s2*s2);
    const upper = fInv(alpha/2, df1, df2);
    const lower = fInv(1-alpha/2, df1, df2);
    const reject = F < lower || F > upper;
    fSteps.textContent = `F = ${s1}²/${s2}² = ${fmtP(F,3)} · df=(${df1},${df2}) · critical [${lower.toFixed(3)}, ${upper.toFixed(3)}]`;
    fDecision.textContent = reject ? 'REJECT the null' : 'FAIL TO REJECT the null';
    fDecision.className = 'decision-banner ' + (reject ? 'reject' : 'fail');
  }
  [fS1,fN1,fS2,fN2,fAlpha].forEach(el => el.addEventListener('input', renderF));
  renderF();

  varTabs.querySelectorAll('.test-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      varTabs.querySelectorAll('.test-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      if (tab.dataset.vartest === 'chisq'){ chisqPanel.style.display=''; fPanel.style.display='none'; }
      else { chisqPanel.style.display='none'; fPanel.style.display=''; }
    });
  });
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
const sectionIds = ['sec-intro','sec-process','sec-teststat','sec-significance','sec-decisionrule','sec-economic','sec-pvalue','sec-multiple','sec-singlemean','sec-indepmeans','sec-pairedmeans','sec-variance','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-hypothesis-testing', String(pct)); } catch(e) {}
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
    concept: "Stating the Hypotheses",
    q: "Which statement about the null and alternative hypotheses is correct?",
    opts: ["The null hypothesis is what the researcher hopes to find evidence for", "The null hypothesis is what the researcher is trying to reject", "The alternative hypothesis always contains the equality sign"],
    correct: 1,
    exp: "The null hypothesis is the default claim, assumed true unless the sample provides strong evidence against it — it's what a researcher is typically hoping to reject in favor of the alternative."
  },
  {
    concept: "Stating the Hypotheses",
    q: "H₀: μ ≤ 4 versus Hₐ: μ > 4 is an example of a:",
    opts: ["Two-sided test", "One-sided (right) test", "One-sided (left) test"],
    correct: 1,
    exp: "The alternative hypothesis specifies \"greater than,\" with rejection occurring in the right tail — a one-sided (right) test."
  },
  {
    concept: "Test Statistics",
    q: "Which distribution does the test statistic for a single population mean (unknown variance) follow?",
    opts: ["Standard normal", "t-distribution with n−1 degrees of freedom", "Chi-square distribution"],
    correct: 1,
    exp: "With unknown population variance, the theoretically correct test statistic for a single mean is t-distributed with n−1 degrees of freedom."
  },
  {
    concept: "Significance, Type I/II Errors & Power",
    q: "A Type I error occurs when:",
    opts: ["A true null hypothesis is rejected", "A false null hypothesis is not rejected", "A true null hypothesis is not rejected"],
    correct: 0,
    exp: "A Type I error is a false positive — incorrectly rejecting a null hypothesis that is actually true."
  },
  {
    concept: "Significance, Type I/II Errors & Power",
    q: "The power of a test is defined as:",
    opts: ["The probability of a Type I error", "The probability of correctly rejecting a false null hypothesis", "The probability of failing to reject a true null hypothesis"],
    correct: 1,
    exp: "Power = 1 − β, the probability of correctly rejecting a false null hypothesis — catching a real effect when it exists."
  },
  {
    concept: "Significance, Type I/II Errors & Power",
    q: "All else equal, decreasing the significance level (α) from 5% to 1%:",
    opts: ["Decreases the probability of a Type II error", "Increases the probability of a Type II error", "Has no effect on Type II error probability"],
    correct: 1,
    exp: "A stricter α makes Type I errors rarer but mechanically raises the probability of a Type II error, since the null is rejected less often overall."
  },
  {
    concept: "Decision Rules & Critical Values",
    q: "For a two-sided test at the 5% significance level using a z-distributed test statistic, the critical values are approximately:",
    opts: ["±1.645", "±1.960", "±2.576"],
    correct: 1,
    exp: "A 5% two-sided test splits α equally between both tails (2.5% each), giving critical values of ±1.960."
  },
  {
    concept: "Decision Rules & Critical Values",
    q: "Testing H₀: μ = 50 at the 95% confidence level, the sample's 95% confidence interval is [48.2, 49.9]. What is the decision?",
    opts: ["Reject the null", "Fail to reject the null", "Cannot be determined"],
    correct: 0,
    exp: "The hypothesized value 50 falls outside the confidence interval [48.2, 49.9], so the null is rejected — the two approaches always agree."
  },
  {
    concept: "Statistical vs. Economic Significance",
    q: "A trading strategy's mean return is statistically significantly different from zero, but the estimated edge is smaller than the strategy's transaction costs. This result is:",
    opts: ["Statistically significant and economically significant", "Statistically significant but not economically significant", "Neither statistically nor economically significant"],
    correct: 1,
    exp: "Clearing the statistical bar doesn't guarantee economic value — if the edge doesn't cover real-world costs like transaction costs, it isn't economically significant."
  },
  {
    concept: "The Role of p-Values",
    q: "The p-value of a hypothesis test is best described as:",
    opts: ["The probability the null hypothesis is true", "The smallest level of significance at which the null hypothesis can be rejected", "The confidence level of the test"],
    correct: 1,
    exp: "The p-value is the area beyond the calculated test statistic — equivalently, the smallest α at which you'd still reject the null."
  },
  {
    concept: "The Role of p-Values",
    q: "A two-sided test produces a calculated z-statistic of 2.05. Approximately what is the p-value?",
    opts: ["About 2%", "About 4%", "About 10%"],
    correct: 1,
    exp: "P(Z > 2.05) ≈ 2.0%, doubled for a two-sided test gives a p-value of roughly 4%."
  },
  {
    concept: "Multiple Testing",
    q: "A researcher runs 200 independent hypothesis tests at a 5% significance level, and every null hypothesis happens to be true. About how many statistically significant results should she expect purely by chance?",
    opts: ["0", "10", "50"],
    correct: 1,
    exp: "200 × 0.05 = 10 expected false positives purely from the multiple testing problem, even with every null hypothesis true."
  },
  {
    concept: "Multiple Testing",
    q: "The Benjamini-Hochberg procedure addresses which specific problem?",
    opts: ["Non-normal data in small samples", "Inflated false-positive rates from running many hypothesis tests", "Unequal variances between two samples"],
    correct: 1,
    exp: "The BH correction adjusts the significance threshold applied to each test in a batch, controlling the false discovery rate that arises from running many tests."
  },
  {
    concept: "A Single Mean",
    q: "Testing H₀: μ = 6 vs. Hₐ: μ ≠ 6 with n=33, X̄=5.299%, s=1.4284%, the calculated t-statistic is approximately:",
    opts: ["−2.819", "−0.701", "5.299"],
    correct: 0,
    exp: "t = (5.299−6)/(1.4284/√33) = −0.701/0.2487 ≈ −2.819."
  },
  {
    concept: "Difference in Means — Independent",
    q: "When testing the difference between two independent sample means (assuming equal variances), the pooled variance is:",
    opts: ["A simple average of the two sample variances", "A weighted average of the two sample variances, weighted by each sample's degrees of freedom", "The larger of the two sample variances"],
    correct: 1,
    exp: "The pooled variance formula weights each sample's variance by (nᵢ−1), its degrees of freedom, before combining them."
  },
  {
    concept: "Difference in Means — Paired",
    q: "Two portfolio managers' monthly returns are measured over the exact same 36 months and share the same underlying market risk factors. The appropriate test for comparing their means is:",
    opts: ["The independent-samples t-test", "The paired (dependent-samples) t-test", "The chi-square test"],
    correct: 1,
    exp: "Because both return series share the same time periods and risk exposures, they are dependent — the paired t-test correctly accounts for that shared variation and is more powerful as a result."
  },
  {
    concept: "Tests of Variance",
    q: "A test of a single population variance uses which test statistic and distribution?",
    opts: ["(n−1)s²/σ₀², chi-square distributed", "s₁²/s₂², F-distributed", "(X̄−μ₀)/(s/√n), t-distributed"],
    correct: 0,
    exp: "A test concerning a single variance uses χ² = (n−1)s²/σ₀², which follows a chi-square distribution with n−1 degrees of freedom."
  },
  {
    concept: "Tests of Variance",
    q: "Why can't the two-sided critical values for a chi-square test simply be written as ± some number?",
    opts: ["Because chi-square tests are always one-sided", "Because the chi-square distribution is asymmetric and bounded below by zero", "Because degrees of freedom must be equal on both sides"],
    correct: 1,
    exp: "The chi-square distribution's asymmetry and lower bound of zero mean the two tails require two distinct, differently-valued critical values rather than a mirrored ± pair."
  },
  {
    concept: "Tests of Variance",
    q: "An F-test comparing the variances of two independent samples, with n₁=25 and n₂=40, has how many degrees of freedom?",
    opts: ["24 and 39", "25 and 40", "63"],
    correct: 0,
    exp: "The F-distribution's degrees of freedom are (n₁−1) and (n₂−1) — the divisors used to compute each sample's variance — giving 24 and 39 here."
  },
  {
    concept: "Tests of Variance",
    q: "Comparing Investment One (s=1.4284%) and Investment Two (s=2.5914%), each with n=33, the calculated F-statistic (larger variance in the numerator) is approximately:",
    opts: ["1.81", "3.29", "0.30"],
    correct: 1,
    exp: "F = (2.5914)²/(1.4284)² = 6.7153/2.0403 ≈ 3.29, indicating a meaningfully larger variance for Investment Two."
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
          cfaRecordAnswer(item.concept, "Hypothesis Testing", i === item.correct);
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

  } catch(e) { console.warn('[hypothesis-testing] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: interest-rates
   ============================================================ */
(function(){
  try {
// ============================================================
// Interest Rates, Present Value & Future Value — interactivity
// ============================================================

function fmtMoney(n){
  if (!isFinite(n)) return "—";
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(n).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
}
function fmtNum(n, d=4){
  if (!isFinite(n)) return "—";
  return n.toFixed(d);
}
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   Reusable timeline diagram builder
   ============================================================ */
function drawTimeline(container, {periods, marks, title}){
  container.innerHTML = '';
  if (title){
    const h = document.createElement('div');
    h.style.fontFamily = 'var(--font-mono)'; h.style.fontSize = '.72rem'; h.style.color = 'var(--ink-soft)';
    h.style.marginBottom = '10px'; h.style.textTransform = 'uppercase'; h.style.letterSpacing = '.05em';
    h.textContent = title;
    container.appendChild(h);
  }
  const W = 560, H = 110, padL = 40, padR = 40;
  const step = (W - padL - padR) / periods;
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'timeline-svg', style:'max-width:600px;'});
  const y = 40;
  svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:y, y2:y, stroke:'#4A4763', 'stroke-width':1.5}));
  for (let t=0; t<=periods; t++){
    const x = padL + t*step;
    svg.appendChild(svgEl('line', {x1:x, x2:x, y1:y-6, y2:y+6, stroke:'#4A4763', 'stroke-width':1.5}));
    const lbl = svgEl('text', {x:x, y:y+22, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#1C1B29'});
    lbl.textContent = t;
    svg.appendChild(lbl);
  }
  (marks||[]).forEach(m => {
    const x = padL + m.t*step;
    const ty = m.above ? y-16 : y+40;
    const txt = svgEl('text', {x:x, y:ty, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill: m.color||'#2B2560', 'font-weight':'600'});
    txt.textContent = m.label;
    svg.appendChild(txt);
    svg.appendChild(svgEl('circle', {cx:x, cy:y, r:4, fill: m.color||'#E8A33D', stroke:'#2B2560', 'stroke-width':1}));
  });
  container.appendChild(svg);
}

/* Timeline 1 — PV growing to FV */
(function(){
  const el = document.getElementById('timeline1');
  if (!el) return;
  drawTimeline(el, {
    periods: 5,
    title: 'PV at t=0 grows to FV at t=N',
    marks: [
      {t:0, label:'PV', above:true, color:'#2F8F6B'},
      {t:5, label:'FV₅ = PV(1+r)⁵', above:false, color:'#C77F1E'}
    ]
  });
})();

/* Timeline — ordinary annuity */
(function(){
  const el = document.getElementById('timeline-annuity');
  if (!el) return;
  drawTimeline(el, {
    periods: 5,
    title: 'Ordinary annuity — 5 payments, first at t=1',
    marks: [1,2,3,4,5].map(t => ({t, label:'A', above:false, color:'#2B2560'}))
  });
})();

/* Timeline — additivity */
(function(){
  const el = document.getElementById('timeline-additivity');
  if (!el) return;
  drawTimeline(el, {
    periods: 2,
    title: 'Series A + Series B = combined series',
    marks: [
      {t:1, label:'$300', above:false, color:'#2B2560'},
      {t:2, label:'$300', above:false, color:'#2B2560'},
    ]
  });
})();

/* ============================================================
   02 — Lump sum FV/PV/r/N solver
   ============================================================ */
(function(){
  const pvI = document.getElementById('lumpPV'), rI = document.getElementById('lumpR'),
        nI = document.getElementById('lumpN'), fvI = document.getElementById('lumpFV');
  const result = document.getElementById('lumpResult'), steps = document.getElementById('lumpSteps');
  const solveRow = document.getElementById('lumpSolveRow');
  if (!pvI) return;
  let solving = 'FV';

  function setSolving(mode){
    solving = mode;
    const idMap = {PV:'lumpPV', r:'lumpR', N:'lumpN', FV:'lumpFV'};
    const fieldMap = {PV:'lumpField-PV', r:'lumpField-r', N:'lumpField-N', FV:'lumpField-FV'};
    ['PV','r','N','FV'].forEach(k => {
      const field = document.getElementById(fieldMap[k]);
      const input = document.getElementById(idMap[k]);
      if (k === solving){
        field.classList.add('solving');
        input.readOnly = true;
      } else {
        field.classList.remove('solving');
        input.readOnly = false;
      }
    });
    solveRow.querySelectorAll('.tvm-solve-btn').forEach(b => b.classList.toggle('active', b.dataset.solve === mode));
    update();
  }

  function update(){
    const PV = parseFloat(pvI.value), rPct = parseFloat(rI.value), N = parseFloat(nI.value), FV = parseFloat(fvI.value);
    const r = rPct/100;
    try {
      if (solving === 'FV'){
        const fv = PV * Math.pow(1+r, N);
        fvI.value = fv.toFixed(2);
        result.textContent = `FV = ${fmtMoney(fv)}`;
        steps.textContent = `${PV} × (1+${fmtNum(r,4)})^${N} = ${fmtMoney(fv)}`;
      } else if (solving === 'PV'){
        const pv = FV / Math.pow(1+r, N);
        pvI.value = pv.toFixed(2);
        result.textContent = `PV = ${fmtMoney(pv)}`;
        steps.textContent = `${FV} / (1+${fmtNum(r,4)})^${N} = ${fmtMoney(pv)}`;
      } else if (solving === 'r'){
        const rate = Math.pow(FV/PV, 1/N) - 1;
        rI.value = (rate*100).toFixed(3);
        result.textContent = `r = ${(rate*100).toFixed(3)}%`;
        steps.textContent = `(${FV}/${PV})^(1/${N}) − 1 = ${(rate*100).toFixed(3)}%`;
      } else if (solving === 'N'){
        const n = Math.log(FV/PV) / Math.log(1+r);
        nI.value = n.toFixed(3);
        result.textContent = `N = ${n.toFixed(3)}`;
        steps.textContent = `ln(${FV}/${PV}) / ln(1+${fmtNum(r,4)}) = ${n.toFixed(3)}`;
      }
    } catch(e){ result.textContent = 'Check inputs'; steps.textContent=''; }
  }

  solveRow.querySelectorAll('.tvm-solve-btn').forEach(btn => {
    btn.addEventListener('click', () => setSolving(btn.dataset.solve));
  });
  [pvI,rI,nI,fvI].forEach(el => el.addEventListener('input', update));
  setSolving('FV');
})();

/* ============================================================
   03 — Compounding frequency chart
   ============================================================ */
(function(){
  const container = document.getElementById('compoundingChart');
  if (!container) return;
  const rs = 0.08;
  const freqs = [
    {label:'Annual', m:1},
    {label:'Semiannual', m:2},
    {label:'Quarterly', m:4},
    {label:'Monthly', m:12},
    {label:'Daily', m:365},
  ];
  const values = freqs.map(f => ({label:f.label, val: Math.pow(1+rs/f.m, f.m)}));
  values.push({label:'Continuous', val: Math.exp(rs)});
  const min = Math.min(...values.map(v=>v.val));
  const max = Math.max(...values.map(v=>v.val));
  const rows = document.createElement('div');
  values.forEach(v => {
    const row = document.createElement('div');
    row.style.display='flex'; row.style.alignItems='center'; row.style.gap='10px'; row.style.margin='6px 0';
    const lbl = document.createElement('div');
    lbl.style.width='110px'; lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.75rem'; lbl.style.color='var(--ink-soft)';
    lbl.textContent = v.label;
    const track = document.createElement('div');
    track.style.flex='1'; track.style.background='var(--paper-dim)'; track.style.borderRadius='4px'; track.style.height='20px'; track.style.position='relative';
    const bar = document.createElement('div');
    const pct = (v.val - min*0.999) / (max - min*0.999) * 100;
    bar.style.height='100%'; bar.style.width = Math.max(4,pct)+'%'; bar.style.background='var(--indigo)'; bar.style.borderRadius='4px';
    track.appendChild(bar);
    const valLbl = document.createElement('div');
    valLbl.style.width='90px'; valLbl.style.fontFamily='var(--font-mono)'; valLbl.style.fontSize='.75rem';
    valLbl.textContent = '$' + v.val.toFixed(6);
    row.appendChild(lbl); row.appendChild(track); row.appendChild(valLbl);
    rows.appendChild(row);
  });
  container.appendChild(rows);
})();

/* ============================================================
   03b — EAR calculator
   ============================================================ */
(function(){
  const rsI = document.getElementById('earRs'), mI = document.getElementById('earM'), contC = document.getElementById('earContinuous');
  const result = document.getElementById('earResult'), steps = document.getElementById('earSteps');
  if (!rsI) return;
  function update(){
    const rs = parseFloat(rsI.value)/100;
    const m = parseInt(mI.value,10);
    if (contC.checked){
      const ear = Math.exp(rs) - 1;
      result.textContent = `EAR = ${(ear*100).toFixed(2)}%`;
      steps.textContent = `e^${fmtNum(rs,4)} − 1 = ${(ear*100).toFixed(2)}%`;
      mI.disabled = true;
    } else {
      mI.disabled = false;
      const ear = Math.pow(1 + rs/m, m) - 1;
      result.textContent = `EAR = ${(ear*100).toFixed(2)}%`;
      steps.textContent = `(1 + ${fmtNum(rs,4)}/${m})^${m} − 1 = ${(ear*100).toFixed(2)}%`;
    }
  }
  [rsI,mI,contC].forEach(el => el.addEventListener('input', update));
  update();
})();

/* ============================================================
   06 — Annuity PV/FV/A/N solver (ordinary or due)
   ============================================================ */
(function(){
  const aI = document.getElementById('annA'), rI = document.getElementById('annR'), nI = document.getElementById('annN'),
        pvI = document.getElementById('annPV'), fvI = document.getElementById('annFV');
  const result = document.getElementById('annResult'), steps = document.getElementById('annSteps');
  const solveRow = document.getElementById('annSolveRow');
  if (!aI) return;
  let solving = 'PV';

  function isDue(){
    return document.querySelector('input[name="annType"]:checked').value === 'due';
  }

  function setSolving(mode){
    solving = mode;
    const idMap = {A:'annA', r:'annR', N:'annN', PV:'annPV', FV:'annFV'};
    const fieldMap = {A:'annField-A', r:'annField-r', N:'annField-N', PV:'annField-PV', FV:'annField-FV'};
    ['A','r','N','PV','FV'].forEach(k => {
      const field = document.getElementById(fieldMap[k]);
      const input = document.getElementById(idMap[k]);
      if (!field) return;
      if (k === solving){ field.classList.add('solving'); input.readOnly = true; }
      else { field.classList.remove('solving'); if (k !== 'r') input.readOnly = false; }
    });
    solveRow.querySelectorAll('.tvm-solve-btn').forEach(b => b.classList.toggle('active', b.dataset.solve === mode));
    update();
  }

  function update(){
    const A = parseFloat(aI.value), rPct = parseFloat(rI.value), N = parseFloat(nI.value);
    const r = rPct/100;
    const due = isDue();
    const dueMult = due ? (1+r) : 1;
    try {
      if (solving === 'PV'){
        const factor = (1 - Math.pow(1+r, -N)) / r;
        const pv = A * factor * dueMult;
        pvI.value = pv.toFixed(2);
        const fv = pv * Math.pow(1+r, N);
        fvI.value = fv.toFixed(2);
        result.textContent = `PV = ${fmtMoney(pv)}`;
        steps.textContent = `${A} × [1 − (1+${fmtNum(r,4)})^−${N}]/${fmtNum(r,4)}${due ? ' × (1+r)':''} = ${fmtMoney(pv)}`;
      } else if (solving === 'FV'){
        const factor = (Math.pow(1+r, N) - 1) / r;
        const fv = A * factor * dueMult;
        fvI.value = fv.toFixed(2);
        const pv = fv / Math.pow(1+r, N);
        pvI.value = pv.toFixed(2);
        result.textContent = `FV = ${fmtMoney(fv)}`;
        steps.textContent = `${A} × [(1+${fmtNum(r,4)})^${N} − 1]/${fmtNum(r,4)}${due ? ' × (1+r)':''} = ${fmtMoney(fv)}`;
      } else if (solving === 'A'){
        const PV = parseFloat(pvI.value) || 0;
        const factor = (1 - Math.pow(1+r, -N)) / r * dueMult;
        const a = PV / factor;
        aI.value = a.toFixed(2);
        result.textContent = `A = ${fmtMoney(a)}`;
        steps.textContent = `${PV} / {[1 − (1+${fmtNum(r,4)})^−${N}]/${fmtNum(r,4)}${due?' × (1+r)':''}} = ${fmtMoney(a)}`;
      } else if (solving === 'N'){
        const PV = parseFloat(pvI.value) || 0;
        // N = -ln(1 - PV*r/(A*dueMult)) / ln(1+r)
        const denom = A * dueMult;
        const inner = 1 - (PV * r) / denom;
        const n = -Math.log(inner) / Math.log(1+r);
        nI.value = n.toFixed(3);
        result.textContent = `N = ${n.toFixed(3)}`;
        steps.textContent = `−ln(1 − PV×r/A${due?'×(1+r)':''}) / ln(1+r) = ${n.toFixed(3)}`;
      }
    } catch(e){ result.textContent = 'Check inputs'; steps.textContent=''; }
  }

  solveRow.querySelectorAll('.tvm-solve-btn').forEach(btn => {
    btn.addEventListener('click', () => setSolving(btn.dataset.solve));
  });
  [aI,rI,nI,pvI,fvI].forEach(el => el.addEventListener('input', update));
  document.querySelectorAll('input[name="annType"]').forEach(el => el.addEventListener('change', update));
  setSolving('PV');
})();

/* ============================================================
   07 — Perpetuity calculator (with deferred start)
   ============================================================ */
(function(){
  const aI = document.getElementById('perpA'), rI = document.getElementById('perpR'), tI = document.getElementById('perpT');
  const result = document.getElementById('perpResult'), steps = document.getElementById('perpSteps');
  if (!aI) return;
  function update(){
    const A = parseFloat(aI.value), r = parseFloat(rI.value)/100, t = parseInt(tI.value,10);
    const pvAtDeferPoint = A / r; // value one period before first payment
    const deferPeriods = t - 1; // periods to discount back from (t-1) to 0
    const pv0 = pvAtDeferPoint / Math.pow(1+r, deferPeriods);
    result.textContent = `PV₀ = ${fmtMoney(pv0)}`;
    if (deferPeriods === 0){
      steps.textContent = `PV: A/r = ${A}/${fmtNum(r,4)} = ${fmtMoney(pvAtDeferPoint)} (first payment at t=1, so this is already PV₀)`;
    } else {
      steps.textContent = `PV at t=${t-1}: A/r = ${fmtMoney(pvAtDeferPoint)}; discount back ${deferPeriods} periods: ${fmtMoney(pvAtDeferPoint)}/(1+${fmtNum(r,4)})^${deferPeriods} = ${fmtMoney(pv0)}`;
    }
  }
  [aI,rI,tI].forEach(el => el.addEventListener('input', update));
  update();
})();

/* ============================================================
   08 — Rule of 72 vs exact
   ============================================================ */
(function(){
  const rI = document.getElementById('ruleR');
  const out = document.getElementById('ruleOut');
  if (!rI) return;
  function update(){
    const rPct = parseFloat(rI.value);
    const r = rPct/100;
    const rule72 = 72 / rPct;
    const exact = Math.log(2) / Math.log(1+r);
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Rule of 72</div><div class="v">${fmtNum(rule72,2)} yrs</div></div>
      <div class="stat-readout"><div class="k">Exact (ln)</div><div class="v">${fmtNum(exact,2)} yrs</div></div>
    `;
  }
  rI.addEventListener('input', update);
  update();
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
const sectionIds = ['sec-rates','sec-fvlump','sec-compounding','sec-fvannuity','sec-pvlump','sec-pvannuity','sec-perpetuity','sec-solving','sec-payment','sec-additivity','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-interest-rates', String(pct)); } catch(e) {}
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
    concept: "Interest Rates",
    q: "A bond's interest rate is described as compensating investors for expected inflation and the real time preference for consumption. Together, these two components make up the:",
    opts: ["Default risk premium", "Nominal risk-free rate", "Maturity premium"],
    correct: 1,
    exp: "The real risk-free rate plus the inflation premium together form the nominal risk-free rate — approximated by short-term government bills."
  },
  {
    concept: "Interest Rates",
    q: "Two otherwise-identical bonds differ only in that one trades infrequently in a thin market. The thinly-traded bond's higher yield primarily compensates for:",
    opts: ["Default risk", "Liquidity risk", "Maturity risk"],
    correct: 1,
    exp: "Difficulty selling an investment quickly without moving its price is precisely what the liquidity premium compensates for."
  },
  {
    concept: "Future Value of a Lump Sum",
    q: "$8,000 is invested for 4 years at 6% compounded annually. What is the future value?",
    opts: ["$9,920.00", "$10,099.13", "$8,480.00"],
    correct: 1,
    exp: "FV = $8,000 × (1.06)⁴ = $8,000 × 1.262477 = $10,099.13."
  },
  {
    concept: "Compounding Frequency & EAR",
    q: "Which is true about compounding, holding the stated annual rate fixed?",
    opts: ["More frequent compounding always produces a smaller ending amount", "More frequent compounding always produces a larger ending amount", "Compounding frequency never affects the ending amount"],
    correct: 1,
    exp: "More frequent compounding means interest starts earning its own interest sooner, so the ending amount rises with compounding frequency, up to the continuous-compounding limit."
  },
  {
    concept: "Compounding Frequency & EAR",
    q: "A rate of 10% is compounded semiannually. What is the effective annual rate?",
    opts: ["10.00%", "10.25%", "10.50%"],
    correct: 1,
    exp: "EAR = (1 + 0.10/2)² − 1 = (1.05)² − 1 = 1.1025 − 1 = 10.25%."
  },
  {
    concept: "Compounding Frequency & EAR",
    q: "A rate of 9% is compounded continuously. What is the effective annual rate (to two decimals)?",
    opts: ["9.00%", "9.42%", "9.81%"],
    correct: 1,
    exp: "EAR = e^0.09 − 1 = 1.094174 − 1 = 9.42%."
  },
  {
    concept: "Future Value of an Annuity",
    q: "An ordinary annuity pays $500 at the end of each year for 8 years, earning 7% annually. What is the future value annuity factor?",
    opts: ["8.000", "10.260", "1.718"],
    correct: 1,
    exp: "[(1.07)⁸ − 1] / 0.07 = [1.718186 − 1] / 0.07 ≈ 10.260."
  },
  {
    concept: "Future Value of an Annuity",
    q: "You must compute the future value of a stream of cash flows that are all different amounts. What's the correct approach?",
    opts: ["Use the ordinary annuity FV formula with the average cash flow", "Compound each individual cash flow forward to the same date and sum them", "Use the perpetuity formula"],
    correct: 1,
    exp: "Unequal cash flow streams have no shortcut formula — each cash flow must be compounded (or discounted) individually to a common date, then summed."
  },
  {
    concept: "Present Value of a Lump Sum",
    q: "A payment of $50,000 is due in 8 years. At a 6% discount rate, what is its present value?",
    opts: ["$29,000.00", "$31,370.62", "$50,000.00"],
    correct: 1,
    exp: "PV = $50,000 × (1.06)⁻⁸ = $50,000 × 0.627412 = $31,370.62."
  },
  {
    concept: "Present Value of a Lump Sum",
    q: "Holding the discount rate constant, how does present value change as a payment is pushed further into the future?",
    opts: ["It increases", "It decreases", "It stays the same"],
    correct: 1,
    exp: "The present value factor (1+r)⁻ᴺ shrinks as N grows, so a more distant payment is always worth less today, all else equal."
  },
  {
    concept: "Present Value of an Annuity",
    q: "An ordinary annuity of $2,000 per year for 6 years is discounted at 9%. What is the present value annuity factor?",
    opts: ["4.486", "6.000", "1.677"],
    correct: 0,
    exp: "[1 − (1.09)⁻⁶] / 0.09 = [1 − 0.596267]/0.09 ≈ 4.486."
  },
  {
    concept: "Present Value of an Annuity",
    q: "An annuity due and an ordinary annuity have identical payment amounts, rates, and number of periods. How do their present values compare?",
    opts: ["The annuity due's PV equals the ordinary annuity's PV", "The annuity due's PV is (1+r) times larger", "The ordinary annuity's PV is larger"],
    correct: 1,
    exp: "Every payment in an annuity due is discounted one less period than the corresponding ordinary annuity payment, so PV(due) = PV(ordinary) × (1+r)."
  },
  {
    concept: "Perpetuities",
    q: "A perpetuity pays $75 per year forever, starting one year from now, at a 6% discount rate. What is its present value?",
    opts: ["$450", "$1,250", "$12.50"],
    correct: 1,
    exp: "PV = A/r = $75/0.06 = $1,250."
  },
  {
    concept: "Perpetuities",
    q: "A perpetuity of $60 per year has its first payment at t = 6. At a 5% discount rate, what is the correct first step to value it today?",
    opts: ["Divide $60 by 0.05 directly to get today's PV", "Value it as an ordinary perpetuity as of t = 5, then discount that value back 5 periods", "Value it as an ordinary perpetuity as of t = 6"],
    correct: 1,
    exp: "A deferred perpetuity is first valued one period before its first payment (here, t = 5, since payments start at t = 6), then that lump sum is discounted back to today."
  },
  {
    concept: "Rates, Growth & Number of Periods",
    q: "A company's revenue grew from $200M to $350M over 7 years. What is the compound annual growth rate?",
    opts: ["10.71%", "8.30%", "75.00%"],
    correct: 1,
    exp: "g = (350/200)^(1/7) − 1 = (1.75)^0.1429 − 1 ≈ 8.30%. The 75% figure is total growth over the period, not annualized."
  },
  {
    concept: "Rates, Growth & Number of Periods",
    q: "Using the Rule of 72, approximately how many years does it take an investment to double at a 9% annual rate?",
    opts: ["6 years", "8 years", "9 years"],
    correct: 1,
    exp: "72 / 9 = 8 years, a close approximation to the exact figure of ln(2)/ln(1.09) ≈ 8.04 years."
  },
  {
    concept: "Size of Annuity Payments",
    q: "A loan of $20,000 is to be repaid with equal annual payments over 5 years at 7% interest. Using a present value annuity factor of 4.100197, what is the annual payment?",
    opts: ["$4,000.00", "$4,878.30", "$2,857.14"],
    correct: 1,
    exp: "A = PV / annuity factor = $20,000 / 4.100197 ≈ $4,878.30."
  },
  {
    concept: "Equivalence & Additivity",
    q: "The cash flow additivity principle states that cash flows can be added or subtracted directly only when they are:",
    opts: ["Denominated in the same currency", "Indexed at the same point in time", "Both annuities"],
    correct: 1,
    exp: "Money can only be combined arithmetically once every amount is expressed as of the same date — that's the additivity principle."
  },
  {
    concept: "Equivalence & Additivity",
    q: "Series A pays $50 at t=1 and t=2; Series B pays $150 at t=1 and t=2. At 4% interest, what is the future value of the combined series (A+B) at t=2?",
    opts: ["$200.00", "$208.00", "$408.00"],
    correct: 1,
    exp: "Combined payment each period is $200. FV = $200(1.04) + $200 = $208 + $200 = $408. (Check: $208 alone is just the first payment compounded one period — the full FV of the combined series is $408.)"
  },
  {
    concept: "Present Value of an Annuity",
    q: "A pension fund manager needs the present value of an annuity whose first payment occurs at t = 11, not t = 1. What is the appropriate first step?",
    opts: ["Apply the ordinary annuity formula directly with N equal to the number of payments, treating the answer as PV at t = 0", "Compute the annuity's value as of t = 10 (one period before the first payment), then discount that value back to t = 0", "Compute the annuity's value as of t = 11"],
    correct: 1,
    exp: "Just like a deferred perpetuity, a deferred annuity is first valued one period before its first payment (t = 10 here), then that value is discounted back to today."
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
          cfaRecordAnswer(item.concept, "Interest Rates, PV & FV", i === item.correct);
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

  } catch(e) { console.warn('[interest-rates] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: organizing-viz
   ============================================================ */
(function(){
  try {
// ============================================================
// Organizing, Visualizing & Describing Data — interactivity
// ============================================================

/* ---------- stat helpers ---------- */
function parseNums(str){
  return str.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
}
function mean(arr){ return arr.reduce((a,b)=>a+b,0) / arr.length; }
function median(arr){
  const s = [...arr].sort((a,b)=>a-b);
  const n = s.length;
  if (n % 2 === 1) return s[(n-1)/2];
  return (s[n/2 - 1] + s[n/2]) / 2;
}
function modeOf(arr){
  const counts = {};
  arr.forEach(x => counts[x] = (counts[x]||0)+1);
  let max = 0;
  Object.values(counts).forEach(c => { if (c > max) max = c; });
  if (max <= 1) return null;
  return Object.keys(counts).filter(k => counts[k] === max).map(Number);
}
function geoMean(arr){
  if (arr.some(x => x < 0)) return NaN;
  const logSum = arr.reduce((a,b) => a + Math.log(b), 0);
  return Math.exp(logSum / arr.length);
}
function harmMean(arr){
  if (arr.some(x => x <= 0)) return NaN;
  const sumRecip = arr.reduce((a,b) => a + 1/b, 0);
  return arr.length / sumRecip;
}
function sampleVariance(arr){
  const m = mean(arr);
  const sumSq = arr.reduce((a,b) => a + (b-m)*(b-m), 0);
  return sumSq / (arr.length - 1);
}
function fmt(n, d=2){
  if (!isFinite(n)) return "—";
  return n.toFixed(d);
}

/* ---------- SVG helpers ---------- */
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   05 — HISTOGRAM (real EAA Equity Index data, 10 bins)
   ============================================================ */
(function(){
  const container = document.getElementById('histogramChart');
  if (!container) return;
  const bins = [
    {label:"-5 to -4", val:1}, {label:"-4 to -3", val:7}, {label:"-3 to -2", val:23},
    {label:"-2 to -1", val:77}, {label:"-1 to 0", val:470}, {label:"0 to 1", val:555},
    {label:"1 to 2", val:110}, {label:"2 to 3", val:13}, {label:"3 to 4", val:1}, {label:"4 to 5", val:1}
  ];
  const max = Math.max(...bins.map(b=>b.val));
  const wrap = document.createElement('div');
  wrap.className = 'bars';
  bins.forEach(b => {
    const col = document.createElement('div');
    col.className = 'bar-col';
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = Math.max(2, (b.val/max)*100) + '%';
    const tip = document.createElement('div');
    tip.className = 'bar-tooltip';
    tip.textContent = b.val + ' days';
    bar.appendChild(tip);
    col.appendChild(bar);
    const lbl = document.createElement('div');
    lbl.className = 'bar-label';
    lbl.textContent = b.label + '%';
    col.appendChild(lbl);
    wrap.appendChild(col);
  });
  container.appendChild(wrap);
})();

/* ============================================================
   06a — BAR CHART (portfolio sector frequencies, Exhibit 8)
   ============================================================ */
(function(){
  const container = document.getElementById('barChart');
  if (!container) return;
  const data = [
    {label:"Industrials", val:73},
    {label:"Info. Technology", val:69},
    {label:"Financials", val:67},
    {label:"Consumer Disc.", val:62},
    {label:"Health Care", val:54},
    {label:"Consumer Staples", val:33},
    {label:"Real Estate", val:30},
    {label:"Energy", val:29},
    {label:"Utilities", val:26},
    {label:"Materials", val:26},
    {label:"Comm. Services", val:10},
  ];
  const max = Math.max(...data.map(d=>d.val));
  const rows = document.createElement('div');
  data.forEach(d => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '10px';
    row.style.margin = '6px 0';
    const lbl = document.createElement('div');
    lbl.style.width = '150px';
    lbl.style.fontFamily = 'var(--font-mono)';
    lbl.style.fontSize = '.75rem';
    lbl.style.color = 'var(--ink-soft)';
    lbl.textContent = d.label;
    const barTrack = document.createElement('div');
    barTrack.style.flex = '1';
    barTrack.style.background = 'var(--paper-dim)';
    barTrack.style.borderRadius = '4px';
    barTrack.style.overflow = 'hidden';
    barTrack.style.height = '20px';
    const bar = document.createElement('div');
    bar.style.height = '100%';
    bar.style.width = (d.val/max*100) + '%';
    bar.style.background = 'var(--indigo)';
    bar.style.borderRadius = '4px';
    barTrack.appendChild(bar);
    const valLbl = document.createElement('div');
    valLbl.style.width = '36px';
    valLbl.style.fontFamily = 'var(--font-mono)';
    valLbl.style.fontSize = '.75rem';
    valLbl.textContent = d.val;
    row.appendChild(lbl); row.appendChild(barTrack); row.appendChild(valLbl);
    rows.appendChild(row);
  });
  container.appendChild(rows);
})();

/* ============================================================
   06b — GROUPED / STACKED BAR CHART (sector x market cap, Exhibit 14)
   ============================================================ */
(function(){
  const container = document.getElementById('groupedStackedChart');
  if (!container) return;
  const data = [
    {sector:"Comm. Svcs", small:55, mid:35, large:20},
    {sector:"Cons. Staples", small:50, mid:30, large:30},
    {sector:"Energy", small:175, mid:95, large:20},
    {sector:"Health Care", small:275, mid:105, large:55},
    {sector:"Utilities", small:20, mid:25, large:10},
  ];
  const colors = {small:'#2B2560', mid:'#E8A33D', large:'#2F8F6B'};
  let mode = 'grouped';

  function render(){
    container.innerHTML = '';
    const maxTotal = mode === 'stacked'
      ? Math.max(...data.map(d => d.small+d.mid+d.large))
      : Math.max(...data.map(d => Math.max(d.small,d.mid,d.large)));

    const legend = document.createElement('div');
    legend.style.display = 'flex'; legend.style.gap = '16px'; legend.style.marginBottom = '14px';
    legend.style.fontFamily = 'var(--font-mono)'; legend.style.fontSize = '.75rem';
    ['small','mid','large'].forEach(k => {
      const item = document.createElement('span');
      item.innerHTML = `<span style="display:inline-block;width:10px;height:10px;background:${colors[k]};border-radius:2px;margin-right:5px;"></span>${k==='small'?'Small Cap':k==='mid'?'Mid Cap':'Large Cap'}`;
      legend.appendChild(item);
    });
    container.appendChild(legend);

    data.forEach(d => {
      const row = document.createElement('div');
      row.style.display = 'flex'; row.style.alignItems = 'center'; row.style.gap = '10px'; row.style.margin = '8px 0';
      const lbl = document.createElement('div');
      lbl.style.width = '120px'; lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.72rem'; lbl.style.color='var(--ink-soft)';
      lbl.textContent = d.sector;
      row.appendChild(lbl);

      if (mode === 'grouped'){
        const cluster = document.createElement('div');
        cluster.style.display = 'flex'; cluster.style.gap = '3px'; cluster.style.flex = '1'; cluster.style.height='26px';
        ['small','mid','large'].forEach(k => {
          const barWrap = document.createElement('div');
          barWrap.style.flex = '1'; barWrap.style.background='var(--paper-dim)'; barWrap.style.borderRadius='3px'; barWrap.style.display='flex'; barWrap.style.alignItems='flex-end'; barWrap.style.height='100%';
          const bar = document.createElement('div');
          bar.style.width = '100%'; bar.style.height = (d[k]/maxTotal*100)+'%'; bar.style.background = colors[k]; bar.style.borderRadius='3px 3px 0 0';
          bar.title = k + ': ' + d[k];
          barWrap.appendChild(bar);
          cluster.appendChild(barWrap);
        });
        row.appendChild(cluster);
      } else {
        const track = document.createElement('div');
        track.style.flex = '1'; track.style.height = '26px'; track.style.display='flex'; track.style.borderRadius='4px'; track.style.overflow='hidden';
        const total = d.small + d.mid + d.large;
        ['small','mid','large'].forEach(k => {
          const seg = document.createElement('div');
          seg.style.width = (d[k]/maxTotal*100)+'%'; seg.style.background = colors[k];
          seg.title = k + ': ' + d[k];
          track.appendChild(seg);
        });
        row.appendChild(track);
        const totalLbl = document.createElement('div');
        totalLbl.style.width='40px'; totalLbl.style.fontFamily='var(--font-mono)'; totalLbl.style.fontSize='.72rem';
        totalLbl.textContent = total;
        row.appendChild(totalLbl);
      }
      container.appendChild(row);
    });
  }
  render();

  document.querySelectorAll('.calc-tab[data-mode]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.calc-tab[data-mode]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      mode = tab.dataset.mode;
      render();
    });
  });
})();

/* ============================================================
   06c — TREE-MAP (sector marginal frequencies)
   ============================================================ */
(function(){
  const container = document.getElementById('treemapChart');
  if (!container) return;
  const data = [
    {label:"Health Care", val:435, color:"#2B2560"},
    {label:"Energy", val:290, color:"#E8A33D"},
    {label:"Comm. Services", val:110, color:"#2F8F6B"},
    {label:"Cons. Staples", val:110, color:"#5C4FBF"},
    {label:"Utilities", val:55, color:"#D6573F"},
  ];
  data.forEach(d => {
    const cell = document.createElement('div');
    cell.className = 'treemap-cell';
    cell.style.background = d.color;
    cell.style.flexBasis = (d.val*2) + 'px';
    cell.innerHTML = `<span><b>${d.label}</b>${d.val} stocks</span>`;
    container.appendChild(cell);
  });
})();

/* ============================================================
   06d — WORD CLOUD
   ============================================================ */
(function(){
  const container = document.getElementById('wordCloud');
  if (!container) return;
  const words = [
    {w:"revenue", size:2.6, color:"var(--indigo-deep)"},
    {w:"billion", size:2.3, color:"var(--indigo-deep)"},
    {w:"growth", size:2.1, color:"var(--green)"},
    {w:"income", size:1.9, color:"var(--green)"},
    {w:"financial", size:1.7, color:"var(--indigo-deep)"},
    {w:"year", size:1.6, color:"var(--ink-soft)"},
    {w:"operating", size:1.3, color:"var(--ink-soft)"},
    {w:"segment", size:1.2, color:"var(--ink-soft)"},
    {w:"expenses", size:1.4, color:"var(--red)"},
    {w:"fine", size:1.1, color:"var(--red)"},
    {w:"tax", size:1.0, color:"var(--ink-soft)"},
    {w:"cash flow", size:1.3, color:"var(--green)"},
    {w:"advertising", size:1.1, color:"var(--ink-soft)"},
    {w:"currency", size:0.95, color:"var(--ink-soft)"},
  ];
  words.forEach(item => {
    const span = document.createElement('span');
    span.textContent = item.w;
    span.style.fontSize = item.size + 'rem';
    span.style.color = item.color;
    container.appendChild(span);
  });
})();

/* ============================================================
   07a — LINE CHART (ABC Inc. 10-day closing price)
   ============================================================ */
(function(){
  const container = document.getElementById('lineChart');
  if (!container) return;
  const prices = [57.21,58.26,58.64,56.19,54.78,54.26,56.88,54.74,52.42,50.14];
  const W = 560, H = 240, padL = 46, padB = 30, padT = 16, padR = 16;
  const min = Math.min(...prices), max = Math.max(...prices);
  const xStep = (W - padL - padR) / (prices.length - 1);
  const yScale = v => H - padB - ((v - min) / (max - min)) * (H - padT - padB);

  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:600px;'});

  // gridlines + y labels
  for (let i=0; i<=4; i++){
    const v = min + (max-min)*i/4;
    const y = yScale(v);
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:y, y2:y, stroke:'#E3DCC9', 'stroke-width':1}));
    const t = svgEl('text', {x:padL-6, y:y+3, 'text-anchor':'end', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    t.textContent = '$' + v.toFixed(0);
    svg.appendChild(t);
  }
  // line path
  let d = '';
  prices.forEach((p,i) => {
    const x = padL + i*xStep, y = yScale(p);
    d += (i===0 ? 'M' : 'L') + x + ',' + y + ' ';
  });
  svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2B2560', 'stroke-width':2.5}));
  // dots + x labels
  prices.forEach((p,i) => {
    const x = padL + i*xStep, y = yScale(p);
    svg.appendChild(svgEl('circle', {cx:x, cy:y, r:4, fill:'#E8A33D', stroke:'#2B2560', 'stroke-width':1.5}));
    const t = svgEl('text', {x:x, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    t.textContent = i+1;
    svg.appendChild(t);
  });
  container.appendChild(svg);
})();

/* ============================================================
   07b — SCATTER PLOT (IT vs S&P500 / Utilities vs S&P500, synthetic)
   ============================================================ */
(function(){
  const container = document.getElementById('scatterChart');
  const caption = document.getElementById('scatterCaption');
  if (!container) return;

  // Deterministic pseudo-random generator (seeded)
  function mulberry32(a){
    return function(){
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(42);

  function genSeries(n, slope, noise){
    const pts = [];
    for (let i=0; i<n; i++){
      const x = (rnd()*16) - 8;
      const y = slope*x + (rnd()*2-1)*noise;
      pts.push([x,y]);
    }
    return pts;
  }
  const itPts = genSeries(58, 1.05, 1.6);
  itPts.push([6, -6]); // flagged outlier
  const utilPts = genSeries(58, 0.05, 3.2);

  function render(pts, isIT){
    container.innerHTML = '';
    const W=520, H=320, pad=40;
    const xs = pts.map(p=>p[0]), ys = pts.map(p=>p[1]);
    const xMin=Math.min(...xs)-1, xMax=Math.max(...xs)+1, yMin=Math.min(...ys)-1, yMax=Math.max(...ys)+1;
    const xScale = v => pad + (v-xMin)/(xMax-xMin)*(W-2*pad);
    const yScale = v => H-pad - (v-yMin)/(yMax-yMin)*(H-2*pad);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:560px;', class:'scatter-svg'});
    // axes
    svg.appendChild(svgEl('line', {x1:pad, x2:W-pad, y1:yScale(0), y2:yScale(0), stroke:'#E3DCC9'}));
    svg.appendChild(svgEl('line', {x1:xScale(0), x2:xScale(0), y1:pad, y2:H-pad, stroke:'#E3DCC9'}));
    const xlabel = svgEl('text', {x:W/2, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#4A4763'});
    xlabel.textContent = 'S&P 500 monthly return (%)';
    svg.appendChild(xlabel);
    pts.forEach((p,i) => {
      const isOutlier = isIT && i === pts.length-1;
      svg.appendChild(svgEl('circle', {cx:xScale(p[0]), cy:yScale(p[1]), r:isOutlier?6:4, class:'scatter-dot' + (isOutlier?' outlier':'')}));
    });
    container.appendChild(svg);
  }
  render(itPts, true);

  document.querySelectorAll('.calc-tab[data-scatter]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.calc-tab[data-scatter]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (tab.dataset.scatter === 'it'){
        render(itPts, true);
        caption.textContent = "IT sector returns cluster tightly along a rising line with the broad market — a strong positive relationship, with one flagged outlier month.";
      } else {
        render(utilPts, false);
        caption.textContent = "Utilities returns scatter with no clear pattern against the broad market — little to no linear relationship.";
      }
    });
  });
})();

/* ============================================================
   08 — HEAT MAP (sector x cap, Exhibit 31 style data)
   ============================================================ */
(function(){
  const container = document.getElementById('heatMap');
  if (!container) return;
  const rows = ["Comm. Services","Cons. Staples","Energy","Health Care","Utilities"];
  const cols = ["Small Cap","Mid Cap","Large Cap"];
  const data = [
    [21,43,83],
    [36,81,45],
    [99,95,29],
    [4,8,18],
    [81,37,58]
  ];
  const flat = data.flat();
  const max = Math.max(...flat), min = Math.min(...flat);
  function colorFor(v){
    const t = (v - min) / (max - min);
    // interpolate paper-dim -> amber -> red for intensity
    const r1=243,g1=238,b1=227; // paper-dim
    const r2=214,g2=87,b2=63; // red
    const r = Math.round(r1 + (r2-r1)*t);
    const g = Math.round(g1 + (g2-g1)*t);
    const b = Math.round(b1 + (b2-b1)*t);
    return `rgb(${r},${g},${b})`;
  }
  const grid = document.createElement('div');
  grid.className = 'heatgrid';
  grid.style.gridTemplateColumns = '130px repeat(3, 1fr)';
  // header row
  grid.appendChild(document.createElement('div'));
  cols.forEach(c => {
    const el = document.createElement('div');
    el.className = 'heat-col-label';
    el.textContent = c;
    grid.appendChild(el);
  });
  data.forEach((row, i) => {
    const rowLabel = document.createElement('div');
    rowLabel.className = 'heat-row-label';
    rowLabel.textContent = rows[i];
    grid.appendChild(rowLabel);
    row.forEach(v => {
      const cell = document.createElement('div');
      cell.className = 'heat-cell';
      cell.style.background = colorFor(v);
      const t = (v-min)/(max-min);
      cell.style.color = t > 0.5 ? '#fff' : 'var(--ink)';
      cell.textContent = v;
      grid.appendChild(cell);
    });
  });
  container.appendChild(grid);
})();

/* ============================================================
   03 — Bin width builder
   ============================================================ */
(function(){
  const minI = document.getElementById('fdMin'), maxI = document.getElementById('fdMax'), kI = document.getElementById('fdK');
  const result = document.getElementById('fdResult'), steps = document.getElementById('fdSteps');
  if (!minI) return;
  function update(){
    const mn = parseFloat(minI.value), mx = parseFloat(maxI.value), k = parseInt(kI.value,10);
    if (isNaN(mn) || isNaN(mx) || isNaN(k) || k <= 0 || mx <= mn){
      result.textContent = 'Check inputs'; steps.textContent = ''; return;
    }
    const range = mx - mn;
    const width = range / k;
    result.textContent = `Bin width ≈ ${fmt(width, 3)}`;
    steps.textContent = `Range = ${fmt(mx,2)} − ${fmt(mn,2)} = ${fmt(range,2)} → ${fmt(range,2)}/${k} = ${fmt(width,3)}`;
  }
  [minI,maxI,kI].forEach(el => el.addEventListener('input', update));
  update();
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
   04 — Relative frequency toggle table (overall / row / column)
   ============================================================ */
(function(){
  const container = document.getElementById('freqTable');
  const toggleRow = document.getElementById('freqToggleRow');
  const caption = document.getElementById('freqCaption');
  if (!container) return;
  const rows = ["Comm. Services","Cons. Staples","Energy","Health Care","Utilities"];
  const cols = ["Small","Mid","Large"];
  const data = [
    [55,35,20],
    [50,30,30],
    [175,95,20],
    [275,105,55],
    [20,25,10]
  ];
  const rowTotals = data.map(r => r.reduce((a,b)=>a+b,0));
  const colTotals = [0,1,2].map(c => data.reduce((a,r)=>a+r[c],0));
  const grandTotal = rowTotals.reduce((a,b)=>a+b,0);

  function render(mode){
    const table = document.createElement('table');
    table.className = 'exhibit';
    table.style.margin = '0';
    let thead = '<tr><th>Sector</th>' + cols.map(c=>`<th>${c}</th>`).join('') + '<th>Total</th></tr>';
    let body = '';
    data.forEach((row, i) => {
      body += `<tr><td>${rows[i]}</td>`;
      row.forEach((v, j) => {
        let pct;
        if (mode==='overall') pct = v/grandTotal*100;
        else if (mode==='row') pct = v/rowTotals[i]*100;
        else pct = v/colTotals[j]*100;
        body += `<td class="num">${pct.toFixed(1)}%</td>`;
      });
      let rowTotalPct = mode==='overall' ? rowTotals[i]/grandTotal*100 : mode==='row' ? 100 : null;
      body += `<td class="num">${rowTotalPct!==null ? rowTotalPct.toFixed(1)+'%' : '—'}</td></tr>`;
    });
    let footer = '<tr><td><strong>Total</strong></td>';
    cols.forEach((c,j) => {
      let pct = mode==='overall' ? colTotals[j]/grandTotal*100 : mode==='col' ? 100 : null;
      footer += `<td class="num"><strong>${pct!==null ? pct.toFixed(1)+'%' : '—'}</strong></td>`;
    });
    footer += `<td class="num"><strong>100.0%</strong></td></tr>`;
    table.innerHTML = thead + body + footer;
    container.innerHTML = '';
    container.appendChild(table);

    const captions = {
      overall: "Every cell as a share of the full 1,000-stock portfolio.",
      row: "Every cell as a share of its own sector's total — each row sums to 100%.",
      col: "Every cell as a share of its own cap-size total — each column sums to 100%."
    };
    caption.textContent = captions[mode];
  }
  toggleRow.querySelectorAll('.calc-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleRow.querySelectorAll('.calc-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.freqmode);
    });
  });
  render('overall');
})();

/* ============================================================
   06 — Bubble line chart (ABC Inc. revenue + EPS)
   ============================================================ */
(function(){
  const container = document.getElementById('bubbleLineChart');
  if (!container) return;
  const data = [
    {q:'Q1Y1', revenue:3784, eps:1.37},
    {q:'Q2Y1', revenue:4236, eps:1.78},
    {q:'Q3Y1', revenue:4187, eps:-3.38},
    {q:'Q4Y1', revenue:3889, eps:-8.66},
    {q:'Q1Y2', revenue:4097, eps:-0.34},
    {q:'Q2Y2', revenue:5905, eps:3.89},
    {q:'Q3Y2', revenue:4997, eps:-2.88},
    {q:'Q4Y2', revenue:4389, eps:-3.98},
  ];
  const W=560, H=280, padL=54, padR=20, padT=20, padB=34;
  const revenues = data.map(d=>d.revenue);
  const minRev = Math.min(...revenues), maxRev = Math.max(...revenues);
  const xStep = (W-padL-padR)/(data.length-1);
  const yScale = v => (H-padB) - (v-minRev)/(maxRev-minRev)*(H-padT-padB);
  const maxAbsEps = Math.max(...data.map(d=>Math.abs(d.eps)));
  const radiusScale = eps => 4 + (Math.abs(eps)/maxAbsEps)*14;

  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:600px;'});
  for (let i=0;i<=4;i++){
    const v = minRev + (maxRev-minRev)*i/4;
    const y = yScale(v);
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:y, y2:y, stroke:'#E3DCC9', 'stroke-width':1}));
    const t = svgEl('text', {x:padL-6, y:y+3, 'text-anchor':'end', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
    t.textContent = '$'+Math.round(v);
    svg.appendChild(t);
  }
  let d = '';
  data.forEach((pt,i) => {
    const x = padL+i*xStep, y = yScale(pt.revenue);
    d += (i===0?'M':'L')+x+','+y+' ';
  });
  svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2B2560', 'stroke-width':1.5, 'stroke-dasharray':'3,2'}));
  data.forEach((pt,i) => {
    const x = padL+i*xStep, y = yScale(pt.revenue);
    const r = radiusScale(pt.eps);
    const color = pt.eps >= 0 ? '#2F8F6B' : '#D6573F';
    svg.appendChild(svgEl('circle', {cx:x, cy:y, r, fill:color, 'fill-opacity':0.7, stroke:color, 'stroke-width':1.5}));
    const t = svgEl('text', {x, y:H-14, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':8, fill:'#4A4763'});
    t.textContent = pt.q;
    svg.appendChild(t);
  });
  container.appendChild(svg);
  const legend = document.createElement('div');
  legend.style.display='flex'; legend.style.gap='16px'; legend.style.marginTop='8px'; legend.style.fontFamily='var(--font-mono)'; legend.style.fontSize='.72rem';
  legend.innerHTML = `<span><span style="display:inline-block;width:10px;height:10px;background:#2F8F6B;border-radius:50%;margin-right:5px;"></span>Profitable quarter (bubble size = |EPS|)</span><span><span style="display:inline-block;width:10px;height:10px;background:#D6573F;border-radius:50%;margin-right:5px;"></span>Loss-making quarter</span>`;
  container.appendChild(legend);
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
const sectionIds = ['sec-types','sec-organizing','sec-frequency','sec-contingency','sec-histogram','sec-linescatter','sec-scatter','sec-barcharts','sec-treewords','sec-heatguide','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-organizing-viz', String(pct)); } catch(e) {}
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
    concept: "Data Types",
    q: "A dataset records each company's GICS sector using codes 10, 15, 20, …, 60. What type of data are these codes?",
    opts: ["Continuous numerical data", "Nominal categorical data (coded numerically)", "Ordinal categorical data"],
    correct: 1,
    exp: "The codes are just labels with no meaningful order or arithmetic — classic nominal data, even though they're written as numbers."
  },
  {
    concept: "Data Types",
    q: "You record the P/E ratio of 50 companies at a single point in time. This is:",
    opts: ["Time-series data", "Cross-sectional data", "Panel data"],
    correct: 1,
    exp: "Many observational units (companies), one variable, one point in time — the definition of cross-sectional data."
  },
  {
    concept: "Organizing Data",
    q: "A quarterly EPS dataset for 3 companies over 4 quarters, arranged as a table, is:",
    opts: ["Panel data", "Purely cross-sectional data", "Purely time-series data"],
    correct: 0,
    exp: "It mixes multiple observational units (companies) with multiple time periods (quarters) — the definition of panel data."
  },
  {
    concept: "Frequency Distributions",
    q: "A dataset has minimum −8 and maximum 24. Using 8 bins, what is the bin width?",
    opts: ["3", "4", "2"],
    correct: 1,
    exp: "Range = 24 − (−8) = 32. Bin width = 32 / 8 = 4."
  },
  {
    concept: "Frequency Distributions",
    q: "In a frequency distribution table, the cumulative relative frequency of the very last bin must always equal:",
    opts: ["0%", "50%", "100%"],
    correct: 2,
    exp: "By definition, cumulating the relative frequency of every bin up through the last one captures the entire dataset — 100%."
  },
  {
    concept: "Contingency Tables",
    q: "In a contingency table, the row and column totals are called:",
    opts: ["Joint frequencies", "Marginal frequencies", "Cumulative frequencies"],
    correct: 1,
    exp: "The totals along the edges of a contingency table — summing across a row or down a column — are marginal frequencies."
  },
  {
    concept: "Contingency Tables",
    q: "A classification model's contingency table of predicted vs. actual outcomes is specifically called a:",
    opts: ["Frequency polygon", "Confusion matrix", "Heat map"],
    correct: 1,
    exp: "A 2×2 (or R×C) contingency table comparing predicted vs. actual classifications is called a confusion matrix."
  },
  {
    concept: "Contingency Tables",
    q: "Dividing every cell in a contingency table by its own row's total answers which question?",
    opts: ["What share of the whole dataset is this cell?", "Within this row's category, how is it split across the columns?", "Within this column's category, how is it split across the rows?"],
    correct: 1,
    exp: "Dividing by the row total normalizes each row to sum to 100%, showing how that row's category breaks down across the column categories."
  },
  {
    concept: "Histograms & Frequency Polygons",
    q: "On a histogram, the tallest bar corresponds to the:",
    opts: ["Median bin", "Modal bin", "Mean bin"],
    correct: 1,
    exp: "The bin with the highest frequency — the tallest bar — is called the modal interval."
  },
  {
    concept: "Line & Bubble Line Charts",
    q: "You want one chart showing a company's quarterly revenue over time, with bubble size showing the magnitude of that quarter's EPS. This is a:",
    opts: ["Scatter plot matrix", "Bubble line chart", "Tree-map"],
    correct: 1,
    exp: "A bubble line chart extends a line chart with a third dimension (bubble size, often also color) — exactly this use case."
  },
  {
    concept: "Scatter Plots & Matrices",
    q: "A scatter plot of two variables shows points tightly hugging an upward-sloping line. This indicates:",
    opts: ["No relationship", "A strong positive relationship", "A strong negative relationship"],
    correct: 1,
    exp: "Tight clustering along an upward-sloping line is the visual signature of a strong positive relationship."
  },
  {
    concept: "Scatter Plots & Matrices",
    q: "You need to inspect the pairwise relationships among six different candidate factors before building a model. The most efficient single chart for this is a:",
    opts: ["Single scatter plot", "Scatter plot matrix", "Bar chart"],
    correct: 1,
    exp: "A scatter plot matrix arranges every pairwise comparison among multiple variables into one grid, letting you scan all relationships at once."
  },
  {
    concept: "Bar Charts",
    q: "You want a chart where each sector's total bar height instantly shows you that sector's overall (marginal) frequency, while still breaking each bar down by market cap. Which chart type?",
    opts: ["Grouped bar chart", "Stacked bar chart", "Scatter plot"],
    correct: 1,
    exp: "A stacked bar chart's total bar height equals the marginal frequency, with segments showing the sub-group breakdown."
  },
  {
    concept: "Bar Charts",
    q: "A vertical bar chart's y-axis starts at 80 instead of 0, making small differences in sales look dramatic. This is an example of:",
    opts: ["Correct use of a bar chart", "A misleading truncated axis", "A scatter plot matrix"],
    correct: 1,
    exp: "A y-axis that doesn't start at zero exaggerates the visual difference between bars — a classic charting pitfall."
  },
  {
    concept: "Tree-Maps & Word Clouds",
    q: "Which visualization uses rectangle area, rather than length or height, to represent magnitude?",
    opts: ["Bar chart", "Tree-map", "Line chart"],
    correct: 1,
    exp: "A tree-map's defining feature is using the area of each rectangle to represent its relative magnitude."
  },
  {
    concept: "Tree-Maps & Word Clouds",
    q: "Which visualization is best suited to representing unstructured text data, like an earnings call transcript?",
    opts: ["Word cloud", "Scatter plot", "Heat map"],
    correct: 0,
    exp: "A word cloud sizes words by frequency of appearance, making it the standard tool for visualizing unstructured text."
  },
  {
    concept: "Heat Maps & Choosing Charts",
    q: "A heat map is often used to visualize which of the following?",
    opts: ["A single variable's frequency distribution", "A correlation matrix among several variables", "A one-dimensional array"],
    correct: 1,
    exp: "Heat maps are a standard way to represent a full correlation matrix — color intensity showing the strength of each pairwise relationship at a glance."
  },
  {
    concept: "Scatter Plots & Matrices",
    q: "Exploring whether two numerical variables are related is best done with a:",
    opts: ["Bar chart", "Scatter plot", "Word cloud"],
    correct: 1,
    exp: "A scatter plot is purpose-built for visually assessing the relationship between two numerical variables."
  },
  {
    concept: "Tree-Maps & Word Clouds",
    q: "A tree-map becomes hard to interpret once it nests more than about how many levels of hierarchy?",
    opts: ["One", "Three", "Ten"],
    correct: 1,
    exp: "Tree-maps are best kept to roughly two or three nested levels (e.g., sector → cap size) before they become too visually dense to read clearly."
  },
  {
    concept: "Line & Bubble Line Charts",
    q: "You are comparing quarterly sales for two products over the same 12 quarters and want to clearly show the trend for each over time. The best chart is a:",
    opts: ["Line chart with two series", "Heat map", "Word cloud"],
    correct: 0,
    exp: "A line chart with two data series is the standard way to compare how two time series trend against each other."
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
          cfaRecordAnswer(item.concept, "Organizing & Visualizing Data", i === item.correct);
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

  } catch(e) { console.warn('[organizing-viz] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: probability-concepts
   ============================================================ */
(function(){
  try {
// ============================================================
// Probability Concepts site — interactivity
// ============================================================

/* ---------- helpers ---------- */
function factorial(n){
  n = Math.round(n);
  if (n < 0) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function fmt(num){
  if (!isFinite(num)) return "—";
  if (Math.abs(num) >= 1000) return num.toLocaleString();
  return (Math.round(num * 10000) / 10000).toString();
}
function toSubOrSup(n, kind){
  // not used, placeholder for readability
  return n;
}

/* ---------- 1. Probability dial ---------- */
(function(){
  const dial = document.getElementById('probDial');
  const val = document.getElementById('dialValue');
  const word = document.getElementById('dialWord');
  const odds = document.getElementById('dialOdds');
  const pct = document.getElementById('dialPct');
  if(!dial) return;

  function wordFor(p){
    if (p === 0) return "Impossible";
    if (p < 0.15) return "Very unlikely";
    if (p < 0.4) return "Unlikely";
    if (p < 0.6) return "Toss-up";
    if (p < 0.85) return "Likely";
    if (p < 1) return "Very likely";
    return "Certain";
  }
  function update(){
    const p = (+dial.value) / 100;
    val.textContent = p.toFixed(2);
    word.textContent = wordFor(p);
    pct.textContent = (p*100).toFixed(0) + "%";
    if (p >= 1){
      odds.textContent = "undefined (÷0) — a certain event has no meaningful odds";
    } else if (p <= 0){
      odds.textContent = "0 to 1";
    } else {
      const oddsFor = p / (1-p);
      // express as simplified-ish a:b using the raw ratio to 2dp
      odds.textContent = oddsFor.toFixed(2) + " to 1";
    }
  }
  dial.addEventListener('input', update);
  update();
})();

/* ---------- 2. Odds <-> probability converter ---------- */
(function(){
  const input = document.getElementById('convProb');
  const out = document.getElementById('convOut');
  if(!input) return;
  function update(){
    let p = parseFloat(input.value);
    if (isNaN(p) || p < 0) p = 0;
    if (p > 1) p = 1;
    if (p === 1){
      out.innerHTML = "Odds for E: undefined (a certain event) <br>Odds against E: 0 to 1";
      return;
    }
    if (p === 0){
      out.innerHTML = "Odds for E: 0 to 1 <br>Odds against E: undefined (an impossible event)";
      return;
    }
    const oddsFor = p / (1-p);
    const oddsAgainst = (1-p) / p;
    out.innerHTML = `Odds for E = ${p.toFixed(2)} / ${(1-p).toFixed(2)} = ${oddsFor.toFixed(2)} to 1<br>Odds against E = ${oddsAgainst.toFixed(2)} to 1`;
  }
  input.addEventListener('input', update);
  update();
})();

/* ---------- 3. Factorial calculator ---------- */
(function(){
  const nInput = document.getElementById('factN');
  const result = document.getElementById('factResult');
  const steps = document.getElementById('factSteps');
  if(!nInput) return;
  function update(){
    let n = parseInt(nInput.value, 10);
    if (isNaN(n) || n < 0){ result.textContent = "Enter a whole number ≥ 0"; steps.textContent = ""; return; }
    if (n > 18){ n = 18; nInput.value = 18; }
    const r = factorial(n);
    result.textContent = `${n}! = ${fmt(r)}`;
    if (n === 0){ steps.textContent = "0! = 1 by convention"; return; }
    const chain = [];
    for (let i = n; i >= 1; i--) chain.push(i);
    steps.textContent = chain.join(" × ") + ` = ${fmt(r)}`;
  }
  nInput.addEventListener('input', update);
  update();
})();

/* ---------- 4. Combination calculator ---------- */
(function(){
  const nInput = document.getElementById('combN');
  const rInput = document.getElementById('combR');
  const result = document.getElementById('combResult');
  const steps = document.getElementById('combSteps');
  if(!nInput) return;
  function update(){
    let n = parseInt(nInput.value, 10), r = parseInt(rInput.value, 10);
    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n){
      result.textContent = "Need 0 ≤ r ≤ n";
      steps.textContent = "";
      return;
    }
    const val = factorial(n) / (factorial(n-r) * factorial(r));
    result.innerHTML = `<sub></sub>${n}C${r} = ${fmt(val)}`;
    steps.textContent = `${n}! / (${n-r}! × ${r}!) = ${fmt(val)}`;
  }
  nInput.addEventListener('input', update);
  rInput.addEventListener('input', update);
  update();
})();

/* ---------- 5. Permutation calculator ---------- */
(function(){
  const nInput = document.getElementById('permN');
  const rInput = document.getElementById('permR');
  const result = document.getElementById('permResult');
  const steps = document.getElementById('permSteps');
  if(!nInput) return;
  function update(){
    let n = parseInt(nInput.value, 10), r = parseInt(rInput.value, 10);
    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n){
      result.textContent = "Need 0 ≤ r ≤ n";
      steps.textContent = "";
      return;
    }
    const val = factorial(n) / factorial(n-r);
    result.textContent = `${n}P${r} = ${fmt(val)}`;
    steps.textContent = `${n}! / ${n-r}! = ${fmt(val)}`;
  }
  nInput.addEventListener('input', update);
  rInput.addEventListener('input', update);
  update();
})();

/* ---------- 6. Check-in mini quizzes ---------- */
(function(){
  document.querySelectorAll('.checkin').forEach(box => {
    const btns = box.querySelectorAll('.opt-btn');
    const feedback = box.querySelector('.checkin-feedback');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btns.forEach(b => b.disabled = true);
        btns.forEach(b => {
          if (b.dataset.correct === 'true') b.classList.add('correct');
        });
        if (btn.dataset.correct !== 'true') btn.classList.add('incorrect');
        feedback.classList.add('show');
        markSectionProgress(box.closest('section').id);
      });
    });
  });
})();

/* ---------- 7. Sidebar scroll-spy + progress + mobile toggle ---------- */
const sectionIds = ['sec-basics','sec-properties','sec-types','sec-odds','sec-conditional','sec-joint','sec-addition','sec-independence','sec-total','sec-counting','sec-labeling','sec-permutation','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-probability-concepts', String(pct)); } catch(e) {}
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
    concept: "Random Variables & Events",
    q: "You draw one card from a standard 52-card deck. \"Drawing a red card\" is best described as:",
    opts: ["A random variable", "An outcome", "An event"],
    correct: 2,
    exp: "It's a set of 26 possible outcomes (all red cards) bundled together — that's the definition of an event."
  },
  {
    concept: "Rules of Probability",
    q: "Which pair of statements together define a valid probability?",
    opts: ["0 ≤ P(E) ≤ 1, and probabilities of mutually exclusive & exhaustive events sum to 1", "P(E) can be any real number, and probabilities sum to 100", "0 ≤ P(E) ≤ 100, and probabilities can overlap freely"],
    correct: 0,
    exp: "Those are the two defining properties of probability: bounded between 0 and 1, and a full mutually-exclusive-and-exhaustive set sums to exactly 1."
  },
  {
    concept: "Rules of Probability",
    q: "Events A and B are mutually exclusive. What must P(AB) equal?",
    opts: ["1", "0", "P(A) × P(B)"],
    correct: 1,
    exp: "Mutually exclusive events can never both occur, so their joint probability is 0 by definition."
  },
  {
    concept: "Three Ways to Estimate P",
    q: "An analyst says: \"Based on logical reasoning about a fair coin, P(heads) = 0.5.\" This is an example of:",
    opts: ["Empirical probability", "Subjective probability", "A priori probability"],
    correct: 2,
    exp: "It's derived through pure logical analysis of a symmetric situation, without gathering data — that's a priori."
  },
  {
    concept: "Three Ways to Estimate P",
    q: "51 out of 60 stocks in an index pay a dividend, giving P = 51/60 = 0.85. This is an example of:",
    opts: ["Empirical probability", "Subjective probability", "A priori probability"],
    correct: 0,
    exp: "It's a relative frequency computed from observed historical data — the definition of empirical probability."
  },
  {
    concept: "Odds",
    q: "If P(E) = 0.20, what are the odds for E?",
    opts: ["0.20 to 1", "0.25 to 1", "4 to 1"],
    correct: 1,
    exp: "Odds for E = P(E)/(1−P(E)) = 0.20/0.80 = 0.25, or \"0.25 to 1\" (equivalently \"1 to 4\")."
  },
  {
    concept: "Odds",
    q: "The odds against a horse winning are quoted as \"3 to 1.\" What is the implied probability the horse wins?",
    opts: ["0.75", "0.25", "3.00"],
    correct: 1,
    exp: "For odds against of \"a to b,\" P(E) = b/(a+b) = 1/(3+1) = 0.25."
  },
  {
    concept: "Conditional Probability",
    q: "P(A) = 0.60 unconditionally. P(A | B) = 0.60 as well. What does this tell you?",
    opts: ["A and B are mutually exclusive", "A and B are independent", "A causes B"],
    correct: 1,
    exp: "When conditioning on B doesn't change the probability of A, that's the textbook definition of independence."
  },
  {
    concept: "Conditional Probability",
    q: "P(AB) = 0.15 and P(B) = 0.30. What is P(A | B)?",
    opts: ["0.045", "0.50", "2.00"],
    correct: 1,
    exp: "P(A|B) = P(AB)/P(B) = 0.15/0.30 = 0.50."
  },
  {
    concept: "Joint Probability",
    q: "P(A | B) = 0.40 and P(B) = 0.25. What is the joint probability P(AB)?",
    opts: ["0.10", "1.60", "0.65"],
    correct: 0,
    exp: "Multiplication rule: P(AB) = P(A|B) × P(B) = 0.40 × 0.25 = 0.10."
  },
  {
    concept: "Addition Rule",
    q: "P(A) = 0.5, P(B) = 0.4, P(AB) = 0.2. What is P(A or B)?",
    opts: ["0.90", "0.70", "1.10"],
    correct: 1,
    exp: "Addition rule: P(A or B) = P(A) + P(B) − P(AB) = 0.5 + 0.4 − 0.2 = 0.70."
  },
  {
    concept: "Addition Rule",
    q: "Two events are mutually exclusive. What is P(A or B) equal to?",
    opts: ["P(A) + P(B)", "P(A) × P(B)", "P(A) − P(B)"],
    correct: 0,
    exp: "Since mutually exclusive events have P(AB) = 0, the addition rule simplifies to a plain sum."
  },
  {
    concept: "Independent vs Dependent",
    q: "P(A) = 0.7, P(B) = 0.5, and A and B are independent. What is P(A and B)?",
    opts: ["0.35", "1.20", "0.20"],
    correct: 0,
    exp: "Multiplication rule for independent events: P(AB) = P(A) × P(B) = 0.7 × 0.5 = 0.35."
  },
  {
    concept: "Independent vs Dependent",
    q: "You draw two cards from a deck without replacing the first. Are the two draws independent?",
    opts: ["Yes", "No, they're dependent"],
    correct: 1,
    exp: "Removing the first card changes the composition of the deck for the second draw, so the draws are dependent."
  },
  {
    concept: "Total Probability Rule",
    q: "30% of loans are \"high risk\" (default rate 15%) and 70% are \"low risk\" (default rate 3%). Using the total probability rule, what's the overall default rate?",
    opts: ["0.090", "0.066", "0.180"],
    correct: 1,
    exp: "P(default) = 0.15×0.30 + 0.03×0.70 = 0.045 + 0.021 = 0.066, or 6.6%."
  },
  {
    concept: "Total Probability Rule",
    q: "The total probability rule requires the scenarios (S₁, S₂, …, Sₙ) to be:",
    opts: ["Independent and identically distributed", "Mutually exclusive and exhaustive", "Equal in probability"],
    correct: 1,
    exp: "The scenarios must cover every possibility with no overlap — mutually exclusive and exhaustive — for the weighted-average logic to hold."
  },
  {
    concept: "Multiplication & Factorial",
    q: "You must assign 4 distinct tasks to 4 different people, one task each. In how many ways can this be done?",
    opts: ["16", "24", "4"],
    correct: 1,
    exp: "This is 4! = 4×3×2×1 = 24, the classic factorial assignment problem."
  },
  {
    concept: "Multiplication & Factorial",
    q: "A pizza shop offers 5 crusts, 4 sauces, and 6 toppings-combinations. Using the multiplication rule for counting, how many distinct pizzas are possible (one from each category)?",
    opts: ["15", "120", "20"],
    correct: 1,
    exp: "5 × 4 × 6 = 120."
  },
  {
    concept: "Labeling & Combinations",
    q: "You need to choose a 3-person subcommittee (no ranked roles) from 7 board members. How many different subcommittees are possible?",
    opts: ["210", "35", "343"],
    correct: 1,
    exp: "Order doesn't matter, so use the combination formula: ₇C₃ = 7!/(4!×3!) = 35."
  },
  {
    concept: "Permutations",
    q: "5 sprinters race for Gold, Silver, and Bronze (order matters). How many different podium results are possible?",
    opts: ["10", "60", "125"],
    correct: 1,
    exp: "Order matters, so use the permutation formula: ₅P₃ = 5!/2! = 60."
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

    // if already answered, show state
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
          cfaRecordAnswer(item.concept, "Probability Concepts", i === item.correct);
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
      if (current < QUIZ.length - 1){
        current++;
        renderQuestion();
      } else {
        renderScore();
      }
    });
    prevBtn.addEventListener('click', () => {
      if (current > 0){
        current--;
        renderQuestion();
      }
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

  } catch(e) { console.warn('[probability-concepts] module script error (safely isolated):', e); }
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
  "Numbers & Arithmetic": ["The Four Operations","Negative Numbers","Fractions, Decimals & Percentages","Order of Operations (BODMAS)","Ratios & Proportions","Turning Words Into Math"],
  "Math Foundations": ["Exponents & Roots","Logarithms","Summation Notation","Rearranging Equations","Sets & Set Notation","Functions & the Cartesian Plane"],
  "Interest Rates, PV & FV": ["Interest Rates","Future Value of a Lump Sum","Compounding Frequency & EAR","Future Value of an Annuity","Present Value of a Lump Sum","Present Value of an Annuity","Perpetuities","Rates, Growth & Number of Periods","Size of Annuity Payments","Equivalence & Additivity"],
  "Organizing & Visualizing Data": ["Data Types","Organizing Data","Frequency Distributions","Contingency Tables","Histograms & Frequency Polygons","Line & Bubble Line Charts","Scatter Plots & Matrices","Bar Charts","Tree-Maps & Word Clouds","Heat Maps & Choosing Charts"],
  "Summarizing Data": ["Mean, Median, Mode","Outliers, Trimmed & Winsorized Means","Weighted, Geometric & Harmonic Mean","Quantiles","Measures of Dispersion","Downside Deviation & CV"],
  "Probability Concepts": ["Random Variables & Events","Rules of Probability","Three Ways to Estimate P","Odds","Conditional Probability","Joint Probability","Addition Rule","Independent vs Dependent","Total Probability Rule","Multiplication & Factorial","Labeling & Combinations","Permutations"],
  "Common Probability Distributions": ["Random Variables & Distributions","Discrete Uniform","Continuous Uniform","The Binomial Distribution","Mean, Variance & Applications","Properties of the Normal","The Empirical Rule","Standardizing & Z-Scores","Student's t-Distribution","Chi-Square & F-Distributions"],
  "Sampling & Estimation": ["Point Estimates","Properties of a Good Estimator","Structure & Interpretation","Known Population Variance","Unknown Population Variance","Selecting Sample Size","Data Snooping Bias","Sample Selection & Survivorship","Look-Ahead & Time-Period Bias"],
  "Hypothesis Testing": ["Why Hypothesis Testing?","Stating the Hypotheses","Test Statistics","Significance, Type I/II Errors & Power","Decision Rules & Critical Values","Statistical vs. Economic Significance","The Role of p-Values","Multiple Testing","A Single Mean","Difference in Means — Independent","Difference in Means — Paired","Tests of Variance"],
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
   Module: sampling
   ============================================================ */
(function(){
  try {
// ============================================================
// Sampling & Estimation — interactivity
// ============================================================

/* ---------- math helpers ---------- */
function erf(x){
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429, p=0.3275911;
  const t = 1/(1+p*x);
  const y = 1 - (((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
  return sign*y;
}
function normCDF(z){ return 0.5 * (1 + erf(z/Math.sqrt(2))); }
function normPDF(x, mu=0, sigma=1){ return Math.exp(-0.5*Math.pow((x-mu)/sigma,2)) / (sigma*Math.sqrt(2*Math.PI)); }
// Inverse standard normal CDF via bisection (returns z such that normCDF(z) = p)
function normInv(p){
  let lo = -8, hi = 8;
  for (let i=0; i<80; i++){
    const mid = (lo+hi)/2;
    if (normCDF(mid) < p) lo = mid; else hi = mid;
  }
  return (lo+hi)/2;
}
// Lanczos gamma
function gamma(z){
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI*z) * gamma(1-z));
  z -= 1;
  let x = c[0];
  for (let i=1; i<g+2; i++) x += c[i]/(z+i);
  const t = z + g + 0.5;
  return Math.sqrt(2*Math.PI) * Math.pow(t, z+0.5) * Math.exp(-t) * x;
}
function tPDF(x, df){
  const num = gamma((df+1)/2);
  const den = Math.sqrt(df*Math.PI) * gamma(df/2);
  return (num/den) * Math.pow(1 + (x*x)/df, -(df+1)/2);
}
// Right-tail area of t-distribution beyond x>=0, via Simpson's rule numerical integration
function tRightTail(x, df){
  // integrate tPDF from x to a large upper bound
  const upper = x + 60;
  const n = 2000;
  const h = (upper - x) / n;
  let sum = tPDF(x, df) + tPDF(upper, df);
  for (let i=1; i<n; i++){
    const xi = x + i*h;
    sum += tPDF(xi, df) * (i % 2 === 0 ? 2 : 4);
  }
  return (h/3) * sum;
}
// Inverse: find t such that right-tail area = alpha (bisection)
function tInv(alpha, df){
  let lo = 0, hi = 40;
  for (let i=0; i<60; i++){
    const mid = (lo+hi)/2;
    const area = tRightTail(mid, df);
    if (area > alpha) lo = mid; else hi = mid;
  }
  return (lo+hi)/2;
}
function fmtP(n, d=4){ return isFinite(n) ? n.toFixed(d) : "—"; }
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ============================================================
   02 — Estimator properties chart (unbiased/efficient/consistent)
   ============================================================ */
(function(){
  const container = document.getElementById('propertiesChart');
  const tabs = document.getElementById('propTabs');
  if (!container) return;

  function curvePath(xScale, yScale, mu, sigma, domainMin, domainMax){
    let d = '';
    for (let x=domainMin; x<=domainMax; x+=0.08){
      const px = xScale(x), py = yScale(normPDF(x, mu, sigma));
      d += (x===domainMin ? 'M':'L') + px + ',' + py + ' ';
    }
    return d;
  }

  function render(mode){
    const W=500, H=200, padL=20, padR=20, padT=14, padB=20;
    const domainMin=-6, domainMax=10;
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'dist-svg', style:'max-width:540px;'});

    let curves, legendHTML, trueValX = 2;
    if (mode === 'unbiased'){
      curves = [
        {mu:2, sigma:1.3, color:'#2F8F6B', label:'Unbiased estimator (centered on μ)'},
        {mu:5, sigma:1.3, color:'#D6573F', label:'Biased estimator (off-center)'}
      ];
    } else if (mode === 'efficient'){
      curves = [
        {mu:2, sigma:0.9, color:'#2F8F6B', label:'Efficient (tighter spread)'},
        {mu:2, sigma:2.2, color:'#D6573F', label:'Inefficient (wider spread, same mean)'}
      ];
    } else {
      curves = [
        {mu:2, sigma:2.2, color:'#D6573F', label:'n = 30 (wide)'},
        {mu:2, sigma:1.1, color:'#E8A33D', label:'n = 200 (tighter)'},
        {mu:2, sigma:0.5, color:'#2F8F6B', label:'n = 1,000 (very tight)'}
      ];
    }
    const maxPdf = Math.max(...curves.map(c => normPDF(c.mu, c.mu, c.sigma)));
    const yScale = v => (H-padB) - (v/maxPdf)*(H-padT-padB);

    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
    // true value marker
    svg.appendChild(svgEl('line', {x1:xScale(trueValX), x2:xScale(trueValX), y1:padT, y2:H-padB, stroke:'#1C1B29', 'stroke-width':1.5, 'stroke-dasharray':'4,3'}));
    const trueLbl = svgEl('text', {x:xScale(trueValX), y:padT-2, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#1C1B29', 'font-weight':'700'});
    trueLbl.textContent = 'true μ';
    svg.appendChild(trueLbl);

    curves.forEach(c => {
      const d = curvePath(xScale, yScale, c.mu, c.sigma, domainMin, domainMax);
      svg.appendChild(svgEl('path', {d, fill:'none', stroke:c.color, 'stroke-width':2.2}));
    });
    container.innerHTML = '';
    container.appendChild(svg);
    const legend = document.createElement('div');
    legend.style.display='flex'; legend.style.flexWrap='wrap'; legend.style.gap='14px'; legend.style.marginTop='8px'; legend.style.fontFamily='var(--font-mono)'; legend.style.fontSize='.72rem';
    legend.innerHTML = curves.map(c => `<span><span style="display:inline-block;width:10px;height:10px;background:${c.color};border-radius:2px;margin-right:5px;"></span>${c.label}</span>`).join('');
    container.appendChild(legend);
  }

  tabs.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.calc-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.prop);
    });
  });
  render('unbiased');
})();

/* ============================================================
   04 — CI known variance number line (static illustrative)
   ============================================================ */
(function(){
  const container = document.getElementById('ciKnownLine');
  if (!container) return;
  const mean = 25, se = 2, z = 1.96;
  const lower = mean - z*se, upper = mean + z*se;
  const W=460, H=110, padL=30, padR=30;
  const domainMin = lower - 6, domainMax = upper + 6;
  const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'ci-line-svg', style:'max-width:480px;'});
  const y = 55;
  svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:y, y2:y, stroke:'#E3DCC9', 'stroke-width':2}));
  svg.appendChild(svgEl('line', {x1:xScale(lower), x2:xScale(upper), y1:y, y2:y, stroke:'#2B2560', 'stroke-width':4}));
  [lower, mean, upper].forEach((v,i) => {
    svg.appendChild(svgEl('circle', {cx:xScale(v), cy:y, r:5, fill: i===1 ? '#E8A33D' : '#2B2560', stroke:'#fff', 'stroke-width':1.5}));
    const t = svgEl('text', {x:xScale(v), y:y-14, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#1C1B23', 'font-weight':'600'});
    t.textContent = v.toFixed(2);
    svg.appendChild(t);
  });
  const capt = svgEl('text', {x:W/2, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
  capt.textContent = '95% CI for μ: [21.08, 28.92], centered on X̄=25';
  svg.appendChild(capt);
  container.appendChild(svg);
})();

/* ============================================================
   05 — CI decision flowchart (static SVG)
   ============================================================ */
(function(){
  const container = document.getElementById('ciFlowchart');
  if (!container) return;
  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px; font-size:.85rem;">
      <div style="background:var(--indigo-deep); color:#fff; border-radius:8px; padding:10px 14px;"><b>Is the population variance known?</b></div>
      <div style="display:flex; gap:10px; padding-left:20px;">
        <div style="flex:1; background:var(--paper-dim); border-radius:8px; padding:10px 14px;"><b>Yes →</b> use <span class="mono" style="color:var(--indigo-deep); font-weight:700;">z</span> (Equation: X̄ ± z·σ/√n)</div>
        <div style="flex:1; background:var(--paper-dim); border-radius:8px; padding:10px 14px;"><b>No, but sample is large (n≥30) →</b> use <span class="mono" style="color:var(--amber-deep); font-weight:700;">t</span> (preferred) or <span class="mono">z</span>-alternative</div>
      </div>
      <div style="background:var(--paper-dim); border-radius:8px; padding:10px 14px; margin-left:20px;"><b>No, and sample is small →</b> use <span class="mono" style="color:var(--amber-deep); font-weight:700;">t</span>, only if the population is (approximately) normal. Otherwise, not available.</div>
    </div>
  `;
})();

/* ============================================================
   05b — Universal confidence interval calculator
   ============================================================ */
(function(){
  const meanI = document.getElementById('ciMean'), sigmaI = document.getElementById('ciSigma'),
        nI = document.getElementById('ciN'), confI = document.getElementById('ciConf');
  const result = document.getElementById('ciResult'), steps = document.getElementById('ciSteps');
  if (!meanI) return;
  function type(){ return document.querySelector('input[name="ciType"]:checked').value; }
  function render(){
    const mean = parseFloat(meanI.value), sigma = parseFloat(sigmaI.value), n = parseInt(nI.value,10);
    const conf = parseFloat(confI.value);
    const alpha = 1 - conf/100;
    const se = sigma/Math.sqrt(n);
    let factor, factorLabel;
    const t = type();
    if (t === 'known' || t === 'zalt'){
      factor = normInv(1 - alpha/2);
      factorLabel = `z_{${(alpha/2).toFixed(3)}} = ${factor.toFixed(3)}`;
    } else {
      const df = n-1;
      factor = tInv(alpha/2, df);
      factorLabel = `t_{${(alpha/2).toFixed(3)}}(df=${df}) ≈ ${factor.toFixed(3)}`;
    }
    const E = factor*se;
    const lower = mean - E, upper = mean + E;
    result.textContent = `${conf}% CI: [${fmtP(lower,4)}, ${fmtP(upper,4)}]`;
    steps.textContent = `${factorLabel} · SE = ${fmtP(se,4)} · ${mean} ± ${fmtP(E,4)}`;
  }
  [meanI,sigmaI,nI,confI].forEach(el => el.addEventListener('input', render));
  document.querySelectorAll('input[name="ciType"]').forEach(el => el.addEventListener('change', render));
  render();
})();

/* ============================================================
   06 — Sample size vs CI width chart
   ============================================================ */
(function(){
  const container = document.getElementById('sampleSizeChart');
  const sI = document.getElementById('ssS'), confI = document.getElementById('ssConf');
  if (!container) return;
  function render(){
    const s = parseFloat(sI.value), conf = parseFloat(confI.value);
    const alpha = 1 - conf/100;
    const ns = [10, 20, 30, 50, 100];
    const rows = ns.map(n => {
      const df = n-1;
      const t = tInv(alpha/2, df);
      const se = s/Math.sqrt(n);
      const width = 2*t*se;
      return {n, width};
    });
    const maxWidth = Math.max(...rows.map(r=>r.width));
    container.innerHTML = '';
    rows.forEach(r => {
      const row = document.createElement('div');
      row.style.display='flex'; row.style.alignItems='center'; row.style.gap='10px'; row.style.margin='6px 0';
      const lbl = document.createElement('div');
      lbl.style.width='60px'; lbl.style.fontFamily='var(--font-mono)'; lbl.style.fontSize='.75rem'; lbl.style.color='var(--ink-soft)';
      lbl.textContent = 'n='+r.n;
      const track = document.createElement('div');
      track.style.flex='1'; track.style.background='var(--paper-dim)'; track.style.borderRadius='4px'; track.style.height='20px';
      const bar = document.createElement('div');
      bar.style.height='100%'; bar.style.width=(r.width/maxWidth*100)+'%'; bar.style.background='var(--indigo)'; bar.style.borderRadius='4px';
      track.appendChild(bar);
      const valLbl = document.createElement('div');
      valLbl.style.width='70px'; valLbl.style.fontFamily='var(--font-mono)'; valLbl.style.fontSize='.75rem';
      valLbl.textContent = 'w=' + r.width.toFixed(2);
      row.appendChild(lbl); row.appendChild(track); row.appendChild(valLbl);
      container.appendChild(row);
    });
  }
  [sI,confI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   08 — Survivorship bias scatter chart (illustrative, Exhibit 9 style)
   ============================================================ */
(function(){
  const container = document.getElementById('survivorshipChart');
  if (!container) return;
  function mulberry32(a){
    return function(){
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const rnd = mulberry32(7);
  const surviving = [];
  for (let i=0; i<40; i++){
    const pb = rnd()*6 + 0.3;
    const ret = 0.35 - 0.06*pb + (rnd()*2-1)*0.08;
    surviving.push([pb, ret]);
  }
  const failing = [];
  for (let i=0; i<18; i++){
    const pb = rnd()*1.5 + 0.2;
    const ret = -0.25 + (rnd()*2-1)*0.12;
    failing.push([pb, ret]);
  }
  const W=520, H=260, pad=40;
  const allPts = surviving.concat(failing);
  const xs = allPts.map(p=>p[0]), ys = allPts.map(p=>p[1]);
  const xMin=0, xMax=Math.max(...xs)+0.3, yMin=Math.min(...ys)-0.05, yMax=Math.max(...ys)+0.05;
  const xScale = v => pad + (v-xMin)/(xMax-xMin)*(W-2*pad);
  const yScale = v => H-pad - (v-yMin)/(yMax-yMin)*(H-2*pad);
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:560px;'});
  svg.appendChild(svgEl('line', {x1:pad, x2:W-pad, y1:yScale(0), y2:yScale(0), stroke:'#E3DCC9'}));
  svg.appendChild(svgEl('line', {x1:xScale(0), x2:xScale(0), y1:pad, y2:H-pad, stroke:'#E3DCC9'}));
  surviving.forEach(p => svg.appendChild(svgEl('circle', {cx:xScale(p[0]), cy:yScale(p[1]), r:4, fill:'#2F8F6B', 'fill-opacity':0.7})));
  failing.forEach(p => svg.appendChild(svgEl('circle', {cx:xScale(p[0]), cy:yScale(p[1]), r:4, fill:'#D6573F', 'fill-opacity':0.7})));
  // trend line for surviving only (negative slope)
  const x1=0.3, x2=xMax-0.2;
  const y1 = 0.35-0.06*x1, y2 = 0.35-0.06*x2;
  svg.appendChild(svgEl('line', {x1:xScale(x1), x2:xScale(x2), y1:yScale(y1), y2:yScale(y2), stroke:'#2F8F6B', 'stroke-width':2}));
  // trend line for all (flat, dotted)
  const allMeanReturn = allPts.reduce((a,p)=>a+p[1],0)/allPts.length;
  svg.appendChild(svgEl('line', {x1:xScale(xMin), x2:xScale(xMax), y1:yScale(allMeanReturn), y2:yScale(allMeanReturn), stroke:'#1C1B29', 'stroke-width':2, 'stroke-dasharray':'5,4'}));
  const xlabel = svgEl('text', {x:W/2, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#4A4763'});
  xlabel.textContent = 'Price-to-Book (P/B)';
  svg.appendChild(xlabel);
  container.innerHTML = '';
  container.appendChild(svg);
  const legend = document.createElement('div');
  legend.style.display='flex'; legend.style.gap='16px'; legend.style.marginTop='8px'; legend.style.fontFamily='var(--font-mono)'; legend.style.fontSize='.72rem'; legend.style.flexWrap='wrap';
  legend.innerHTML = `<span><span style="display:inline-block;width:10px;height:10px;background:#2F8F6B;border-radius:50%;margin-right:5px;"></span>Surviving stocks</span><span><span style="display:inline-block;width:10px;height:10px;background:#D6573F;border-radius:50%;margin-right:5px;"></span>Failing stocks (usually excluded)</span>`;
  container.appendChild(legend);
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
const sectionIds = ['sec-intro','sec-properties','sec-cistructure','sec-ciknown','sec-ciunknown','sec-samplesize','sec-datasnooping','sec-selectionbias','sec-lookahead','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-sampling', String(pct)); } catch(e) {}
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
    concept: "Point Estimates",
    q: "An analyst wants to know the current average dividend yield of all stocks in an index. She calculates it from the index's current constituents and gets 2.3%. The formula \"sum the yields and divide by the count\" is the:",
    opts: ["Estimate", "Estimator", "Confidence interval"],
    correct: 1,
    exp: "The formula itself — which would give a different result on a different sample — is the estimator. The number 2.3% it produced this time is the estimate."
  },
  {
    concept: "Point Estimates",
    q: "Which branch of statistical inference asks \"what is this parameter's value?\" rather than starting with a specific claimed value to test?",
    opts: ["Hypothesis testing", "Estimation", "Regression analysis"],
    correct: 1,
    exp: "Estimation seeks the best answer to a parameter's value directly, without a starting hypothesis to test."
  },
  {
    concept: "Properties of a Good Estimator",
    q: "An estimator's expected value (the mean of its sampling distribution) exactly equals the population parameter it targets, at every sample size. This estimator is:",
    opts: ["Efficient", "Consistent", "Unbiased"],
    correct: 2,
    exp: "That's the definition of unbiasedness — no systematic over- or under-estimation, regardless of sample size."
  },
  {
    concept: "Properties of a Good Estimator",
    q: "Between two unbiased estimators of the same parameter, the one with the smaller sampling-distribution variance is called the more:",
    opts: ["Consistent estimator", "Efficient estimator", "Biased estimator"],
    correct: 1,
    exp: "Efficiency compares unbiased estimators by how tightly their sampling distributions cluster — smaller variance means more efficient."
  },
  {
    concept: "Properties of a Good Estimator",
    q: "As sample size approaches infinity, a consistent estimator's sampling distribution:",
    opts: ["Becomes more spread out", "Concentrates on the true parameter value", "Becomes skewed"],
    correct: 1,
    exp: "Consistency means the estimator's standard error shrinks toward zero and its distribution collapses onto the true value as n grows."
  },
  {
    concept: "Structure & Interpretation",
    q: "The structure of every confidence interval in this reading is:",
    opts: ["Point estimate × Reliability factor ÷ Standard error", "Point estimate ± Reliability factor × Standard error", "Reliability factor ± Point estimate × Standard error"],
    correct: 1,
    exp: "Point estimate ± Reliability factor × Standard error is the universal structure for every confidence interval covered."
  },
  {
    concept: "Known Population Variance",
    q: "Sampling from a normal distribution with known σ=30, a sample of n=225 has X̄=100. What is the 95% confidence interval?",
    opts: ["[96.08, 103.92]", "[94.00, 106.00]", "[98.04, 101.96]"],
    correct: 0,
    exp: "SE = 30/√225 = 2. CI = 100 ± 1.96(2) = 100 ± 3.92 = [96.08, 103.92]."
  },
  {
    concept: "Known Population Variance",
    q: "The reliability factor for a 99% confidence interval based on the standard normal distribution is approximately:",
    opts: ["1.65", "1.96", "2.58"],
    correct: 2,
    exp: "z₀.₀₀₅ = 2.58 leaves 0.5% in each tail, totaling 1% outside the interval — matching a 99% confidence level."
  },
  {
    concept: "Unknown Population Variance",
    q: "A sample of n=40 has an unknown population variance, but the sample is large. Which statistic is theoretically most conservative (widest interval) for the confidence interval?",
    opts: ["z", "t", "Both give identical results always"],
    correct: 1,
    exp: "The t-distribution has fatter tails than the normal, so its reliability factor is larger, producing a wider, more conservative interval — even in large samples where z would be technically acceptable."
  },
  {
    concept: "Unknown Population Variance",
    q: "Why is it acceptable to use a z reliability factor with an unknown population variance, as long as the sample is large?",
    opts: ["Because s always equals σ in large samples", "Because of the central limit theorem, which makes X̄'s sampling distribution approximately normal regardless of the population's shape", "Because large samples have no sampling error"],
    correct: 1,
    exp: "The CLT guarantees that with a large enough sample, the sampling distribution of the mean is approximately normal, justifying the z-based approach even without knowing the population's true shape."
  },
  {
    concept: "Unknown Population Variance",
    q: "A sample has n=12, drawn from a population whose distribution shape is unknown and whose variance is unknown. What is the correct approach?",
    opts: ["Use z, since it's always safe", "Use t with df=11", "Neither z nor t is theoretically available"],
    correct: 2,
    exp: "With a small sample from a population that hasn't been confirmed normal, and unknown variance, neither the CLT (needs large n) nor the small-sample t-distribution (needs population normality) is justified."
  },
  {
    concept: "Structure & Interpretation",
    q: "Holding sample size and standard deviation constant, what happens to a confidence interval's width if the desired confidence level rises from 90% to 99%?",
    opts: ["It narrows", "It widens", "It is unaffected"],
    correct: 1,
    exp: "A higher confidence level requires a larger reliability factor, producing a wider interval — greater confidence trades off against precision."
  },
  {
    concept: "Selecting Sample Size",
    q: "The standard error of the sample mean is given by:",
    opts: ["s × √n", "s / √n", "s² / n"],
    correct: 1,
    exp: "Standard error of the mean = sample standard deviation divided by the square root of sample size, s/√n."
  },
  {
    concept: "Selecting Sample Size",
    q: "If sample size increases from n to 9n, the standard error of the mean approximately:",
    opts: ["Falls to 1/3 of its original value", "Falls to 1/9 of its original value", "Triples"],
    correct: 0,
    exp: "Standard error scales with 1/√n; √9 = 3, so the standard error falls to 1/3 of its original value."
  },
  {
    concept: "Data Snooping Bias",
    q: "A research team tests hundreds of variables on the same historical dataset and reports only the handful that turned out statistically significant, without mentioning the rest. This is a textbook case of:",
    opts: ["Look-ahead bias", "Data snooping bias", "Time-period bias"],
    correct: 1,
    exp: "Repeatedly mining the same dataset and reporting only the 'winning' results — without disclosing the many failed attempts — is the definition of data snooping bias."
  },
  {
    concept: "Data Snooping Bias",
    q: "Which phrase, if found in a research paper describing how a variable was chosen, is a classic warning sign of data mining?",
    opts: ["\"We formed this hypothesis based on economic theory before testing it\"", "\"We noticed that this variable seemed to predict returns\"", "\"We tested this hypothesis on an out-of-sample dataset\""],
    correct: 1,
    exp: "\"We noticed that…\" hints the variable was found by searching the data after the fact, rather than being specified by theory beforehand — the \"too much digging\" warning sign."
  },
  {
    concept: "Sample Selection & Survivorship",
    q: "A database of hedge funds only includes funds that are still operating and voluntarily choose to report their performance. This combination is most likely to cause:",
    opts: ["Look-ahead bias only", "Survivorship bias and self-selection bias", "Time-period bias only"],
    correct: 1,
    exp: "Funds that closed are excluded (survivorship bias), and funds with poor records may simply choose not to report (self-selection bias) — both inflate the apparent average performance."
  },
  {
    concept: "Look-Ahead & Time-Period Bias",
    q: "A backtest uses a company's Q4 book value, dated December 31st, to rank stocks as of December 31st — even though that book value wasn't publicly released until mid-February. This is:",
    opts: ["Survivorship bias", "Look-ahead bias", "Data snooping bias"],
    correct: 1,
    exp: "Using information before it was actually available to real investors on that date is the definition of look-ahead bias."
  },
  {
    concept: "Look-Ahead & Time-Period Bias",
    q: "What is the recommended fix for look-ahead bias when using fundamental data in a backtest?",
    opts: ["Use point-in-time (PIT) data, stamped with its actual public release date", "Use a longer sample period", "Use the z-alternative instead of the t-distribution"],
    correct: 0,
    exp: "Point-in-time data is tagged with the date it actually became available, ensuring a backtest only uses information a real investor could have had at that time."
  },
  {
    concept: "Look-Ahead & Time-Period Bias",
    q: "A study covers a 40-year period that includes both a low-volatility regime and a high-volatility regime, blended into one dataset without accounting for the shift. This is most likely an example of:",
    opts: ["Time-period bias", "Sample selection bias", "Data snooping bias"],
    correct: 0,
    exp: "Spanning a structural regime change without accounting for it blends two genuinely different return distributions into one potentially misleading result — the essence of time-period bias."
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
          cfaRecordAnswer(item.concept, "Sampling & Estimation", i === item.correct);
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

  } catch(e) { console.warn('[sampling] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: summarizing-data
   ============================================================ */
(function(){
  try {
// ============================================================
// Organizing, Visualizing & Describing Data — interactivity
// ============================================================

/* ---------- stat helpers ---------- */
function parseNums(str){
  return str.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
}
function mean(arr){ return arr.reduce((a,b)=>a+b,0) / arr.length; }
function median(arr){
  const s = [...arr].sort((a,b)=>a-b);
  const n = s.length;
  if (n % 2 === 1) return s[(n-1)/2];
  return (s[n/2 - 1] + s[n/2]) / 2;
}
function modeOf(arr){
  const counts = {};
  arr.forEach(x => counts[x] = (counts[x]||0)+1);
  let max = 0;
  Object.values(counts).forEach(c => { if (c > max) max = c; });
  if (max <= 1) return null;
  return Object.keys(counts).filter(k => counts[k] === max).map(Number);
}
function geoMean(arr){
  if (arr.some(x => x < 0)) return NaN;
  const logSum = arr.reduce((a,b) => a + Math.log(b), 0);
  return Math.exp(logSum / arr.length);
}
function harmMean(arr){
  if (arr.some(x => x <= 0)) return NaN;
  const sumRecip = arr.reduce((a,b) => a + 1/b, 0);
  return arr.length / sumRecip;
}
function sampleVariance(arr){
  const m = mean(arr);
  const sumSq = arr.reduce((a,b) => a + (b-m)*(b-m), 0);
  return sumSq / (arr.length - 1);
}
function fmt(n, d=2){
  if (!isFinite(n)) return "—";
  return n.toFixed(d);
}

/* ---------- SVG helpers ---------- */
function svgEl(tag, attrs){
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}
/* ============================================================
   11b — BOX AND WHISKER PLOT (EAA Index quartiles)
   ============================================================ */
(function(){
  const container = document.getElementById('boxplotChart');
  if (!container) return;
  const stats = { min:-4.108, lowerFence:-1.422, q1:-0.293, median:0.044, q3:0.460, upperFence:1.589, max:5.001 };
  const W=560, H=140, pad=50;
  const domainMin = -4.5, domainMax = 5.3;
  const xScale = v => pad + (v-domainMin)/(domainMax-domainMin)*(W-2*pad);
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:600px;'});
  const midY = 70;

  // whisker line from min to max
  svg.appendChild(svgEl('line', {x1:xScale(stats.min), x2:xScale(stats.max), y1:midY, y2:midY, stroke:'#4A4763', 'stroke-width':1.5}));
  // box
  svg.appendChild(svgEl('rect', {x:xScale(stats.q1), y:midY-22, width:xScale(stats.q3)-xScale(stats.q1), height:44, fill:'#E8A33D', 'fill-opacity':0.35, stroke:'#C77F1E', 'stroke-width':2}));
  // median line
  svg.appendChild(svgEl('line', {x1:xScale(stats.median), x2:xScale(stats.median), y1:midY-22, y2:midY+22, stroke:'#2B2560', 'stroke-width':2.5}));
  // fence caps
  [stats.min, stats.max].forEach(v => {
    svg.appendChild(svgEl('line', {x1:xScale(v), x2:xScale(v), y1:midY-12, y2:midY+12, stroke:'#4A4763', 'stroke-width':1.5}));
  });
  // labels
  const labelData = [
    [stats.min, 'Min ' + stats.min.toFixed(2)],
    [stats.q1, 'Q1 ' + stats.q1.toFixed(2)],
    [stats.median, 'Med ' + stats.median.toFixed(2)],
    [stats.q3, 'Q3 ' + stats.q3.toFixed(2)],
    [stats.max, 'Max ' + stats.max.toFixed(2)],
  ];
  labelData.forEach(([v,txt], i) => {
    const t = svgEl('text', {x:xScale(v), y:midY+40+((i%2)*14), 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#1C1B29'});
    t.textContent = txt;
    svg.appendChild(t);
  });
  container.appendChild(svg);
})();

/* ============================================================
   09 — Mean / Median / Mode playground
   ============================================================ */
(function(){
  const input = document.getElementById('cmInput');
  const out = document.getElementById('cmOut');
  if (!input) return;
  function update(){
    const arr = parseNums(input.value);
    if (arr.length === 0){ out.innerHTML = '<div class="stat-readout"><div class="k">—</div><div class="v">Enter numbers</div></div>'; return; }
    const m = mean(arr), med = median(arr), mo = modeOf(arr);
    const modeStr = mo === null ? 'none' : mo.join(', ');
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Mean</div><div class="v">${fmt(m,2)}</div></div>
      <div class="stat-readout"><div class="k">Median</div><div class="v">${fmt(med,2)}</div></div>
      <div class="stat-readout"><div class="k">Mode</div><div class="v">${modeStr}</div></div>
    `;
  }
  input.addEventListener('input', update);
  update();
})();

/* ============================================================
   10 — Arithmetic / Geometric / Harmonic mean calculator
   ============================================================ */
(function(){
  const input = document.getElementById('meansInput');
  const out = document.getElementById('meansOut');
  if (!input) return;
  function update(){
    const arr = parseNums(input.value);
    if (arr.length === 0){ out.innerHTML = '<div class="stat-readout"><div class="k">—</div><div class="v">Enter numbers</div></div>'; return; }
    const a = mean(arr), g = geoMean(arr), h = harmMean(arr);
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Arithmetic</div><div class="v">${fmt(a,2)}</div></div>
      <div class="stat-readout"><div class="k">Geometric</div><div class="v">${isNaN(g)?'n/a (needs ≥0)':fmt(g,2)}</div></div>
      <div class="stat-readout"><div class="k">Harmonic</div><div class="v">${isNaN(h)?'n/a (needs &gt;0)':fmt(h,2)}</div></div>
    `;
  }
  input.addEventListener('input', update);
  update();
})();

/* ============================================================
   10b — Decision flow: which mean should I use?
   ============================================================ */
(function(){
  const container = document.getElementById('decisionFlow');
  if (!container) return;
  function render(){
    container.innerHTML = `
      <div class="decision-node">
        <div class="qtext">Do you need to include all values, including outliers?</div>
        <div class="branches">
          <button data-r="arith">Yes</button>
          <button data-r="q2">No</button>
        </div>
      </div>
    `;
    container.querySelector('[data-r="arith"]').addEventListener('click', () => showResult('Use the <strong>arithmetic mean</strong> — it uses every observation with equal weight.'));
    container.querySelector('[data-r="q2"]').addEventListener('click', renderQ2);
  }
  function renderQ2(){
    container.innerHTML = `
      <div class="decision-node">
        <div class="qtext">Is there compounding involved (e.g., averaging returns over time)?</div>
        <div class="branches">
          <button data-r="geo">Yes</button>
          <button data-r="q3">No</button>
        </div>
      </div>
    `;
    container.querySelector('[data-r="geo"]').addEventListener('click', () => showResult('Use the <strong>geometric mean</strong> — it correctly captures compound growth over time.'));
    container.querySelector('[data-r="q3"]').addEventListener('click', renderQ3);
  }
  function renderQ3(){
    container.innerHTML = `
      <div class="decision-node">
        <div class="qtext">Are there extreme outliers you want to dampen (without deleting data)?</div>
        <div class="branches">
          <button data-r="harm">Yes</button>
          <button data-r="arith2">No</button>
        </div>
      </div>
    `;
    container.querySelector('[data-r="harm"]').addEventListener('click', () => showResult('Consider the <strong>harmonic mean</strong> (for rates/ratios), or a <strong>trimmed</strong> / <strong>winsorized mean</strong> otherwise.'));
    container.querySelector('[data-r="arith2"]').addEventListener('click', () => showResult('The <strong>arithmetic mean</strong> is the sensible default.'));
  }
  function showResult(html){
    const result = document.createElement('div');
    result.className = 'decision-result';
    result.innerHTML = html + ' <button style="margin-left:10px; font-family:var(--font-mono); font-size:.75rem; background:transparent; border:1px solid #fff; color:#fff; border-radius:6px; padding:3px 9px; cursor:pointer;" id="decisionReset">Start over</button>';
    container.appendChild(result);
    document.getElementById('decisionReset').addEventListener('click', render);
  }
  render();
})();

/* ============================================================
   11 — Percentile locator
   ============================================================ */
(function(){
  const nI = document.getElementById('pctN'), yI = document.getElementById('pctY');
  const result = document.getElementById('pctResult'), steps = document.getElementById('pctSteps');
  if (!nI) return;
  function update(){
    const n = parseInt(nI.value,10), y = parseFloat(yI.value);
    if (isNaN(n) || isNaN(y) || n <= 0){ result.textContent='Check inputs'; steps.textContent=''; return; }
    const Ly = (n+1) * y/100;
    result.textContent = `L${y} = ${fmt(Ly,2)}`;
    if (Number.isInteger(Math.round(Ly*1000)/1000)){
      steps.textContent = `(${n} + 1) × ${y}/100 = ${fmt(Ly,2)} → whole number, use the ${Math.round(Ly)}th sorted value directly`;
    } else {
      const lower = Math.floor(Ly), upper = Math.ceil(Ly);
      steps.textContent = `(${n} + 1) × ${y}/100 = ${fmt(Ly,2)} → interpolate between the ${lower}th and ${upper}th sorted values`;
    }
  }
  [nI,yI].forEach(el => el.addEventListener('input', update));
  update();
})();

/* ============================================================
   12 — Dispersion calculator
   ============================================================ */
(function(){
  const input = document.getElementById('dispInput');
  const out = document.getElementById('dispOut');
  if (!input) return;
  function update(){
    const arr = parseNums(input.value);
    if (arr.length < 2){ out.innerHTML = '<div class="stat-readout"><div class="k">—</div><div class="v">Need ≥2 numbers</div></div>'; return; }
    const range = Math.max(...arr) - Math.min(...arr);
    const m = mean(arr);
    const mad = arr.reduce((a,b) => a + Math.abs(b-m), 0) / arr.length;
    const v = sampleVariance(arr);
    const sd = Math.sqrt(v);
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Range</div><div class="v">${fmt(range,2)}</div></div>
      <div class="stat-readout"><div class="k">MAD</div><div class="v">${fmt(mad,2)}</div></div>
      <div class="stat-readout"><div class="k">Variance</div><div class="v">${fmt(v,2)}</div></div>
      <div class="stat-readout"><div class="k">Std Dev</div><div class="v">${fmt(sd,2)}</div></div>
    `;
  }
  input.addEventListener('input', update);
  update();
})();

/* ============================================================
   13 — Target semideviation & coefficient of variation
   ============================================================ */
(function(){
  const input = document.getElementById('ddInput');
  const targetI = document.getElementById('ddTarget');
  const out = document.getElementById('ddOut');
  if (!input) return;
  function update(){
    const arr = parseNums(input.value);
    const target = parseFloat(targetI.value);
    if (arr.length < 2 || isNaN(target)){ out.innerHTML = '<div class="stat-readout"><div class="k">—</div><div class="v">Check inputs</div></div>'; return; }
    const m = mean(arr);
    const sd = Math.sqrt(sampleVariance(arr));
    const below = arr.filter(x => x <= target);
    let semidev = NaN;
    if (below.length > 0 && arr.length > 1){
      const sumSq = below.reduce((a,b) => a + (b-target)*(b-target), 0);
      semidev = Math.sqrt(sumSq / (arr.length - 1));
    }
    const cv = m !== 0 ? sd / m : NaN;
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Mean</div><div class="v">${fmt(m,2)}</div></div>
      <div class="stat-readout"><div class="k">Std Dev</div><div class="v">${fmt(sd,2)}</div></div>
      <div class="stat-readout"><div class="k">Target Semidev</div><div class="v">${isNaN(semidev)?'n/a':fmt(semidev,2)}</div></div>
      <div class="stat-readout"><div class="k">CV</div><div class="v">${isNaN(cv)?'n/a':fmt(cv,2)}</div></div>
    `;
  }
  [input,targetI].forEach(el => el.addEventListener('input', update));
  update();
})();


/* ============================================================
   01b — Center of gravity chart (static)
   ============================================================ */
(function(){
  const container = document.getElementById('cogChart');
  if (!container) return;
  const counts = {2:1,4:2,6:1,10:2,12:3};
  const W=520, H=160, padL=30, padR=30, baseY=110;
  const domainMin=1, domainMax=13;
  const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
  const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', style:'max-width:560px;'});
  svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:baseY, y2:baseY, stroke:'#4A4763', 'stroke-width':1.5}));
  for (let v=1; v<=13; v++){
    const x = xScale(v);
    svg.appendChild(svgEl('line', {x1:x, x2:x, y1:baseY-4, y2:baseY+4, stroke:'#E3DCC9', 'stroke-width':1}));
    if (v%2===0 || v===1){
      const t = svgEl('text', {x, y:baseY+18, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:'#4A4763'});
      t.textContent = v;
      svg.appendChild(t);
    }
  }
  Object.entries(counts).forEach(([val,cnt]) => {
    const x = xScale(+val);
    for (let i=0;i<cnt;i++){
      svg.appendChild(svgEl('rect', {x:x-6, y:baseY-10-i*16, width:12, height:14, fill:'#2B2560', rx:2}));
    }
  });
  // fulcrum triangle at mean=8
  const fx = xScale(8);
  svg.appendChild(svgEl('polygon', {points:`${fx-10},${baseY+10} ${fx+10},${baseY+10} ${fx},${baseY-4}`, fill:'#E8A33D'}));
  const meanLbl = svgEl('text', {x:fx, y:baseY+26, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':10, fill:'#C77F1E', 'font-weight':'700'});
  meanLbl.textContent = 'mean = 8 (fulcrum)';
  svg.appendChild(meanLbl);
  container.appendChild(svg);
})();

/* ============================================================
   01c — Skewness diagram (tabs: left/symmetric/right)
   ============================================================ */
(function(){
  const container = document.getElementById('skewChart');
  const tabs = document.getElementById('skewTabs');
  if (!container) return;
  function skewedCurve(x, skew){
    // simple asymmetric bump function for illustration only
    const base = Math.exp(-0.5*x*x);
    if (skew === 0) return base;
    const shift = skew * 0.35;
    return Math.exp(-0.5*Math.pow(x - shift*x*Math.abs(x)*0.5, 2));
  }
  function render(mode){
    const W=480, H=190, padL=20, padR=20, padT=16, padB=34;
    const domainMin=-4, domainMax=4;
    const xScale = v => padL + (v-domainMin)/(domainMax-domainMin)*(W-padL-padR);
    const skewParam = mode==='left' ? -1 : mode==='right' ? 1 : 0;
    let pts = [];
    for (let x=domainMin; x<=domainMax; x+=0.05){
      let xx = x;
      if (skewParam !== 0){
        // stretch one tail using a cube warp for a simple asymmetric bump
        xx = x + skewParam*0.18*Math.pow(x,3)/8;
      }
      pts.push([x, Math.exp(-0.5*xx*xx)]);
    }
    const maxY = Math.max(...pts.map(p=>p[1]));
    const yScale = v => (H-padB) - (v/maxY)*(H-padT-padB);
    const svg = svgEl('svg', {viewBox:`0 0 ${W} ${H}`, width:'100%', class:'skew-svg', style:'max-width:520px;'});
    svg.appendChild(svgEl('line', {x1:padL, x2:W-padR, y1:H-padB, y2:H-padB, stroke:'#E3DCC9'}));
    let d = '';
    pts.forEach((p,i) => { d += (i===0?'M':'L')+xScale(p[0])+','+yScale(p[1])+' '; });
    svg.appendChild(svgEl('path', {d, fill:'none', stroke:'#2B2560', 'stroke-width':2.2}));

    // approximate mean/median/mode marker positions for illustration
    let modeX, medianX, meanX;
    if (mode === 'sym'){ modeX=medianX=meanX=0; }
    else if (mode === 'right'){ modeX=-0.5; medianX=0; meanX=0.6; }
    else { modeX=0.5; medianX=0; meanX=-0.6; }
    [[modeX,'Mode','#2F8F6B',-8],[medianX,'Median','#C77F1E',10],[meanX,'Mean','#D6573F',28]].forEach(([xv,label,color,dy]) => {
      const x = xScale(xv);
      svg.appendChild(svgEl('line', {x1:x, x2:x, y1:padT, y2:H-padB, stroke:color, 'stroke-width':1.5, 'stroke-dasharray':'3,2'}));
      const t = svgEl('text', {x, y:H-8, 'text-anchor':'middle', 'font-family':'IBM Plex Mono', 'font-size':9, fill:color, 'font-weight':'700'});
      t.textContent = label;
      svg.appendChild(t);
    });
    container.innerHTML = '';
    container.appendChild(svg);
  }
  tabs.querySelectorAll('.test-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.test-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.skew);
    });
  });
  render('left');
})();

/* ============================================================
   02 — Trimmed & winsorized mean calculator
   ============================================================ */
(function(){
  const input = document.getElementById('trimInput'), pctI = document.getElementById('trimPct');
  const out = document.getElementById('trimOut');
  if (!input) return;
  function render(){
    const arr = parseNums(input.value);
    const pct = parseFloat(pctI.value)/100;
    if (arr.length === 0){ out.innerHTML = '<div class="stat-readout"><div class="k">—</div><div class="v">Enter numbers</div></div>'; return; }
    const sorted = [...arr].sort((a,b)=>a-b);
    const n = sorted.length;
    const rawMean = mean(arr);

    // trimmed mean: drop pct from each side (by count, rounding down for illustration)
    const dropCount = Math.floor(n*pct);
    const trimmed = sorted.slice(dropCount, n-dropCount);
    const trimmedMean = trimmed.length ? mean(trimmed) : NaN;

    // winsorized mean: cap values below/above the pct and (1-pct) percentile
    function percentileValue(p){
      const Ly = (n+1)*p;
      const lower = Math.floor(Ly), upper = Math.ceil(Ly);
      if (lower === upper || lower < 1) return sorted[Math.min(Math.max(Math.round(Ly),1),n)-1];
      const frac = Ly - lower;
      const lo = sorted[Math.min(Math.max(lower,1),n)-1];
      const hi = sorted[Math.min(Math.max(upper,1),n)-1];
      return lo + frac*(hi-lo);
    }
    const lowCut = percentileValue(pct);
    const highCut = percentileValue(1-pct);
    const winsorized = sorted.map(v => v < lowCut ? lowCut : v > highCut ? highCut : v);
    const winsorizedMean = mean(winsorized);

    out.innerHTML = `
      <div class="stat-readout"><div class="k">Raw mean</div><div class="v">${fmt(rawMean,2)}</div></div>
      <div class="stat-readout"><div class="k">Trimmed mean</div><div class="v">${fmt(trimmedMean,2)}</div></div>
      <div class="stat-readout"><div class="k">Winsorized mean</div><div class="v">${fmt(winsorizedMean,2)}</div></div>
    `;
  }
  [input,pctI].forEach(el => el.addEventListener('input', render));
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
const sectionIds = ['sec-central','sec-outliers','sec-othermeans','sec-quantiles','sec-dispersion','sec-downside','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-summarizing-data', String(pct)); } catch(e) {}
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
    concept: "Mean, Median, Mode",
    q: "For the dataset 2, 4, 4, 6, 10, 10, 12, 12, 12, what is the mode?",
    opts: ["10", "12", "8"],
    correct: 1,
    exp: "12 appears three times, more than any other value, making it the mode."
  },
  {
    concept: "Mean, Median, Mode",
    q: "Using the center-of-gravity analogy, the arithmetic mean is the point where:",
    opts: ["The most observations are clustered", "A bar holding all the observations, stacked by frequency, would balance on a fulcrum", "The data is split into two equal halves"],
    correct: 1,
    exp: "The mean behaves like a physical center of gravity — the one point where the weighted bar of observations balances perfectly."
  },
  {
    concept: "Mean, Median, Mode",
    q: "For any dataset, the sum of deviations of each observation from the arithmetic mean equals:",
    opts: ["The variance", "Always zero", "The standard deviation"],
    correct: 1,
    exp: "This is a mathematical identity: Σ(Xᵢ − X̄) always equals exactly zero, regardless of the dataset — the positive and negative deviations exactly cancel."
  },
  {
    concept: "Mean, Median, Mode",
    q: "A distribution with positive (right) skewness typically has which ordering of mean, median, and mode?",
    opts: ["Mean < Median < Mode", "Mode < Median < Mean", "Mean = Median = Mode"],
    correct: 1,
    exp: "Right skew means a long tail of large values pulls the mean above the median, which in turn sits above the mode."
  },
  {
    concept: "Outliers, Trimmed & Winsorized Means",
    q: "Given the dataset 1, 2, 3, 4, 5, 6, 1000, which measure of central tendency is least affected by the outlier of 1000?",
    opts: ["Arithmetic mean", "Median", "They're equally affected"],
    correct: 1,
    exp: "The median (4) ignores the magnitude of extreme values entirely, unlike the arithmetic mean, which is pulled sharply upward by the 1000."
  },
  {
    concept: "Outliers, Trimmed & Winsorized Means",
    q: "A 5% trimmed mean, compared to the raw arithmetic mean on the same dataset, is computed using:",
    opts: ["All of the original observations", "95% of the original observations, with the most extreme 5% removed", "Only the median value"],
    correct: 1,
    exp: "A 5% trimmed mean discards the lowest 2.5% and highest 2.5% of values (5% total) and averages the remaining 95%."
  },
  {
    concept: "Outliers, Trimmed & Winsorized Means",
    q: "A 95% winsorized mean, unlike a trimmed mean, handles extreme values by:",
    opts: ["Deleting them entirely", "Replacing them with a specified cutoff value rather than deleting them", "Ignoring the entire dataset"],
    correct: 1,
    exp: "Winsorizing caps extreme values at a specified percentile rather than removing them, so the full sample size is preserved."
  },
  {
    concept: "Weighted, Geometric & Harmonic Mean",
    q: "A portfolio is 40% stocks (return 10%) and 60% bonds (return 4%). What is the weighted mean return?",
    opts: ["7.0%", "6.4%", "8.2%"],
    correct: 1,
    exp: "Weighted mean = 0.40(10%) + 0.60(4%) = 4.0% + 2.4% = 6.4%."
  },
  {
    concept: "Weighted, Geometric & Harmonic Mean",
    q: "A stock returns 10% in Year 1 and −10% in Year 2. What is the geometric mean return?",
    opts: ["0%", "About −0.5%", "About 1.0%"],
    correct: 1,
    exp: "[(1.10)(0.90)]^(1/2) − 1 = √0.99 − 1 ≈ −0.503%. Unlike the arithmetic mean (0%), the geometric mean correctly reflects that the investment actually lost value overall."
  },
  {
    concept: "Weighted, Geometric & Harmonic Mean",
    q: "Which mean is most appropriate for cost averaging — investing a fixed amount of money at different share prices?",
    opts: ["Arithmetic mean", "Geometric mean", "Harmonic mean"],
    correct: 2,
    exp: "The harmonic mean is the mathematically correct average purchase price when a fixed dollar amount buys a varying number of shares at each price."
  },
  {
    concept: "Weighted, Geometric & Harmonic Mean",
    q: "For a given dataset that isn't perfectly constant, which ordering always holds?",
    opts: ["Arithmetic mean ≤ Geometric mean ≤ Harmonic mean", "Harmonic mean ≤ Geometric mean ≤ Arithmetic mean", "Geometric mean ≤ Harmonic mean ≤ Arithmetic mean"],
    correct: 1,
    exp: "Harmonic mean ≤ Geometric mean ≤ Arithmetic mean always holds (with equality only when every observation is identical)."
  },
  {
    concept: "Quantiles",
    q: "In a sorted sample of 49 observations, what is the location L50 (the median's position)?",
    opts: ["24.5", "25", "50"],
    correct: 1,
    exp: "Ly = (n+1) × y/100 = (49+1) × 50/100 = 50 × 0.5 = 25 — a whole number, so the median is exactly the 25th sorted value."
  },
  {
    concept: "Quantiles",
    q: "The interquartile range (IQR) is calculated as:",
    opts: ["Q3 + Q1", "Q3 − Q1", "(Q3 + Q1)/2"],
    correct: 1,
    exp: "IQR = Q3 − Q1, measuring the spread of the middle 50% of the data."
  },
  {
    concept: "Quantiles",
    q: "On a box-and-whisker plot, the box itself spans:",
    opts: ["The minimum to the maximum", "Q1 to Q3", "One standard deviation above and below the mean"],
    correct: 1,
    exp: "The box spans the interquartile range, from Q1 to Q3, with the median typically marked inside it."
  },
  {
    concept: "Measures of Dispersion",
    q: "Why does the sample variance formula divide the sum of squared deviations by (n − 1) rather than n?",
    opts: ["It's easier to compute", "It corrects for using an estimated sample mean, keeping the estimator unbiased", "It only matters for very large samples"],
    correct: 1,
    exp: "Using the sample mean (itself estimated from the data) uses up one degree of freedom; dividing by n − 1 keeps the sample variance an unbiased estimator of the population variance."
  },
  {
    concept: "Measures of Dispersion",
    q: "Which measure of dispersion uses the absolute value of deviations from the mean, rather than squaring them?",
    opts: ["Sample variance", "Mean absolute deviation (MAD)", "Standard deviation"],
    correct: 1,
    exp: "MAD averages the absolute value of each deviation from the mean, sidestepping the sum-to-zero problem without squaring."
  },
  {
    concept: "Downside Deviation & CV",
    q: "Fund A: mean return 6%, std dev 9%. Fund B: mean return 15%, std dev 20%. Which fund has more risk per unit of return (higher coefficient of variation)?",
    opts: ["Fund A (CV = 1.50)", "Fund B (CV = 1.33)", "They're equal"],
    correct: 0,
    exp: "CV(A) = 9/6 = 1.50 vs. CV(B) = 20/15 ≈ 1.33. Despite Fund B's larger raw standard deviation, Fund A carries more risk per unit of expected return."
  },
  {
    concept: "Downside Deviation & CV",
    q: "Target semideviation differs from ordinary standard deviation because it:",
    opts: ["Only includes observations below a specified target", "Squares every deviation regardless of direction", "Ignores the sample size"],
    correct: 0,
    exp: "Target (semi)deviation only counts shortfalls below a chosen target return, focusing specifically on downside risk rather than total dispersion."
  },
  {
    concept: "Downside Deviation & CV",
    q: "Raising the target return used in a semideviation calculation, holding the data fixed, will typically:",
    opts: ["Decrease the semideviation, since fewer observations qualify", "Increase the semideviation, since more observations now fall below the higher bar", "Have no effect on the semideviation"],
    correct: 1,
    exp: "A higher target means more observations count as 'below target,' which mechanically tends to raise the calculated semideviation."
  },
  {
    concept: "Weighted, Geometric & Harmonic Mean",
    q: "40% of a bond portfolio is investment-grade (2% default rate), 60% is high-yield (8% default rate). What is the overall (weighted mean) default rate?",
    opts: ["0.050", "0.056", "0.100"],
    correct: 1,
    exp: "0.02×0.40 + 0.08×0.60 = 0.008 + 0.048 = 0.056, or 5.6% — a weighted mean using the portfolio proportions as weights."
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
          cfaRecordAnswer(item.concept, "Summarizing Data", i === item.correct);
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

  } catch(e) { console.warn('[summarizing-data] module script error (safely isolated):', e); }
})();
