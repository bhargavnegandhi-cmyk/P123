// ============================================================
// fsa toolkit — bundled module scripts
// Each module's code is isolated in its own IIFE with try/catch,
// so only the relevant module's code actually executes on each page.
// ============================================================

/* ============================================================
   Module: applications
   ============================================================ */
(function(){
  try {
// ============================================================
// Applications of Financial Statement Analysis — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }

/* ============================================================
   04 — Screen independence calculator
   ============================================================ */
(function(){
  const totalI = document.getElementById('scrTotal'), c1I = document.getElementById('scrC1'),
        c2I = document.getElementById('scrC2'), c3I = document.getElementById('scrC3'), c4I = document.getElementById('scrC4');
  const result = document.getElementById('scrResult');
  if (!totalI) return;
  function render(){
    const total = parseFloat(totalI.value);
    const c1 = parseFloat(c1I.value)/100, c2 = parseFloat(c2I.value)/100, c3 = parseFloat(c3I.value)/100, c4 = parseFloat(c4I.value)/100;
    const expected = total * c1 * c2 * c3 * c4;
    result.textContent = `If independent: ~${fmt(expected,1)} stocks would pass all four`;
  }
  [totalI,c1I,c2I,c3I,c4I].forEach(el => el.addEventListener('input', render));
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
const sectionIds = ['sec-pastperformance','sec-projecting','sec-creditrisk','sec-screening','sec-adjframework','sec-ppeadjustments','sec-goodwilladjustments','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-applications', String(pct)); } catch(e) {}
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
  { concept:"Evaluating Past Performance",
    q: "When evaluating a company's past financial performance, an analyst should focus on:",
    opts: ["Only the reported numbers, without considering underlying causes", "Both what happened and why it happened, including the company's strategy", "Only comparisons to the company's own prior-year results"], correct: 1,
    exp: "A thorough evaluation addresses both the outcomes and the underlying strategic causes behind them." },
  { concept:"Evaluating Past Performance",
    q: "A company shifts toward a higher-margin, lower-volume product line. Which combination of trends would this most likely produce?",
    opts: ["Rising revenue growth and falling margins", "Slower revenue growth alongside rising gross margins", "No change in either revenue growth or margins"], correct: 1,
    exp: "A shift toward higher-margin, lower-volume products would typically show up as slower top-line growth alongside improving margins." },
  { concept:"Evaluating Past Performance",
    q: "Which of these is NOT a typical data source for evaluating a company's past performance?",
    opts: ["Investor relations materials and press releases", "Industry surveys and consumer satisfaction data", "Randomly generated financial projections"], correct: 2,
    exp: "Analysts draw on real data sources like investor materials, industry data, and firsthand research — not random projections." },

  { concept:"Projecting Future Performance",
    q: "In the top-down approach to sales forecasting, what is typically projected first?",
    opts: ["The specific company's sales directly", "Industry sales, based on a macroeconomic indicator like GDP growth", "The company's exact stock price"], correct: 1,
    exp: "Top-down forecasting starts with industry sales tied to macro indicators, then narrows down to company-specific market share." },
  { concept:"Projecting Future Performance",
    q: "Why might historical operating margins be a more reliable forecasting basis than historical net margins?",
    opts: ["Net margin is affected by financing and tax choices unrelated to core operations", "Operating margin is always more volatile", "There is no meaningful difference between the two"], correct: 0,
    exp: "Net margin reflects financing and tax decisions that can change independently of the core business, making operating margin often more reliable to forecast from." },
  { concept:"Projecting Future Performance",
    q: "For which type of company are historical performance patterns LEAST reliable for forecasting?",
    opts: ["A mature company in a stable industry", "A start-up or a company in a highly volatile industry", "A company with 20 years of consistent historical data"], correct: 1,
    exp: "Start-ups and companies in volatile industries have less reliable historical patterns to extrapolate from." },

  { concept:"Assessing Credit Risk",
    q: "Why does credit analysis focus heavily on downside scenarios rather than growth potential?",
    opts: ["Because bondholders' returns are capped at the promised interest rate, with no upside participation in strong performance", "Because bonds always lose value over time", "Because credit analysts are required by regulation to be pessimistic"], correct: 0,
    exp: "Since bondholder returns are contractually capped, the analytical focus naturally shifts to downside risk and repayment capacity." },
  { concept:"Assessing Credit Risk",
    q: "Why do credit analysts typically focus on operating cash flow rather than accrual net income?",
    opts: ["Debt payments are made in cash, and operating cash flow reflects cash genuinely available to service creditors", "Net income is always higher than cash flow", "Cash flow is easier to manipulate than net income"], correct: 0,
    exp: "Since debt service requires actual cash, not accrual earnings, operating cash flow is the more directly relevant measure for credit analysis." },
  { concept:"Assessing Credit Risk",
    q: "In Moody's aerospace and defense rating framework, which broad factor receives the highest weighting?",
    opts: ["Scale", "Leverage and coverage", "Financial policy"], correct: 1,
    exp: "Leverage and coverage receives the highest weight (35%), reflecting how critical debt-servicing capacity is to overall creditworthiness." },

  { concept:"Evaluating Past Performance",
    q: "Cross-sectional analysis of a company's financial performance is most useful for:",
    opts: ["Understanding comparability with peer companies for market-based valuation", "Predicting exact future stock prices with certainty", "Eliminating the need for any further analysis"], correct: 0,
    exp: "Cross-sectional analysis facilitates understanding of how a company compares to peers, informing market-based valuation approaches." },

  { concept:"Assessing Credit Risk",
    q: "Credit scoring, as an approach to assessing overall creditworthiness, is best described as:",
    opts: ["A statistical analysis of the determinants of credit default", "A purely qualitative judgment with no data involved", "A method used only for equity investments"], correct: 0,
    exp: "Credit scoring applies statistical analysis to historical determinants of default to assess overall creditworthiness." },

  { concept:"Screening for Equity Investments",
    q: "Screening for equity investments is best described as:",
    opts: ["Applying a set of criteria to narrow a large investment universe to a smaller set with desired characteristics", "Randomly selecting stocks from an index", "A process used exclusively by growth investors"], correct: 0,
    exp: "Screening systematically narrows a broad universe of stocks using specified criteria to identify a smaller, targeted subset." },
  { concept:"Screening for Equity Investments",
    q: "A screen applies 3 criteria to a universe of 5,000 stocks, with individual pass rates of 20%, 10%, and 50%. If the criteria were fully independent, about how many stocks would pass all three?",
    opts: ["50", "500", "5"], correct: 0,
    exp: "5,000 × 0.20 × 0.10 × 0.50 = 50 stocks, if the criteria were statistically independent." },
  { concept:"Screening for Equity Investments",
    q: "A back-tested screen's historical database excludes companies that went bankrupt during the test period. This introduces:",
    opts: ["Look-ahead bias", "Survivorship bias", "No bias at all"], correct: 1,
    exp: "Excluding failed companies from a backtest database is survivorship bias, inflating the screen's apparent historical performance." },
  { concept:"Screening for Equity Investments",
    q: "A backtest uses restated financial data that reflects corrections made after the fact — information investors wouldn't have had at the time. This introduces:",
    opts: ["Survivorship bias", "Look-ahead bias", "Data-snooping bias"], correct: 1,
    exp: "Using information not actually available to investors at the time of the decision is look-ahead bias." },

  { concept:"Adjustments — Framework & Inventory",
    q: "Which of these is NOT one of the four key questions in the analyst adjustment framework?",
    opts: ["Importance (materiality)", "Body of standards used (IFRS vs. US GAAP)", "The company's stock ticker symbol"], correct: 2,
    exp: "The framework focuses on importance, standards, methods, and estimates — not arbitrary details like ticker symbols." },
  { concept:"Adjustments — Framework & Inventory",
    q: "To convert a LIFO company's inventory to a FIFO-equivalent basis, an analyst should:",
    opts: ["Add the disclosed LIFO reserve to reported inventory", "Subtract the LIFO reserve from reported inventory", "No conversion is possible"], correct: 0,
    exp: "FIFO inventory = LIFO inventory + LIFO reserve, exactly as covered in the Inventories module." },
  { concept:"Adjustments — Framework & Inventory",
    q: "Why might an analyst need to adjust for differences in accounting between a US GAAP company and an IFRS company reporting inventory?",
    opts: ["IFRS prohibits LIFO entirely, so a US company using LIFO isn't directly comparable to an IFRS company", "IFRS requires higher inventory values than US GAAP always", "No adjustment is ever needed for inventory"], correct: 0,
    exp: "Since IFRS prohibits LIFO, comparing a US LIFO-reporting company to an IFRS FIFO-reporting company requires an adjustment for genuine comparability." },

  { concept:"Adjustments Related to PP&E",
    q: "The ratio of accumulated depreciation to gross PP&E suggests:",
    opts: ["How much of the asset base's useful life has already passed", "The company's total revenue", "The company's tax rate"], correct: 0,
    exp: "This ratio indicates roughly how far through its useful life a company's overall asset base is." },
  { concept:"Adjustments Related to PP&E",
    q: "Company A has accumulated depreciation of $600M on gross PP&E of $800M. What does this suggest about its asset base?",
    opts: ["It is relatively old — 75% of useful life has passed", "It is relatively new", "No conclusion can be drawn from this ratio"], correct: 0,
    exp: "600/800 = 75%, suggesting a relatively old, heavily depreciated asset base." },
  { concept:"Adjustments Related to PP&E",
    q: "Why are PP&E ratio comparisons across companies typically treated as qualitative signals rather than precise adjustments?",
    opts: ["Companies don't disclose enough item-level detail to make precise adjustments", "PP&E ratios are always identical across companies", "These ratios have no analytical value"], correct: 0,
    exp: "Limited disclosure detail means these ratios provide directional, qualitative signals rather than precise quantitative adjustments." },

  { concept:"Adjustments Related to Goodwill",
    q: "Goodwill arises when:",
    opts: ["A company pays more for an acquisition than the fair value of the target's identifiable net assets", "A company depreciates an asset faster than expected", "A company writes down inventory below cost"], correct: 0,
    exp: "Goodwill is the premium paid in an acquisition above the fair value of the target's identifiable net assets." },
  { concept:"Adjustments Related to Goodwill",
    q: "ParentCo buys TargetCo for $500 million; TargetCo's identifiable net assets are valued at $350 million. How much goodwill is recorded?",
    opts: ["$150 million", "$500 million", "$350 million"], correct: 0,
    exp: "Goodwill = Purchase price − Fair value of identifiable net assets = 500 − 350 = $150 million." },
  { concept:"Adjustments Related to Goodwill",
    q: "Why might two companies with identical underlying economic value show very different ROA figures?",
    opts: ["One company grew by acquisition (capitalizing goodwill), while the other grew internally (expensing costs like advertising and R&D)", "ROA is never affected by how a company grew historically", "One company must have committed fraud"], correct: 0,
    exp: "An acquisitive company's balance sheet reflects capitalized goodwill, while an organically-grown company's comparable value was simply expensed — creating genuinely different reported asset bases despite equal economic value." }
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
        const isCorrect = i === item.correct;
        if (isCorrect) score++;
        if (typeof cfaRecordAnswer === 'function' && item.concept){
          cfaRecordAnswer(item.concept, "Applications of FSA", isCorrect);
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

  } catch(e) { console.warn('[applications] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: balance-sheets
   ============================================================ */
(function(){
  try {
// ============================================================
// Balance Sheets — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }
function fmtNum(n){ return Math.round(n).toLocaleString(); }

/* ============================================================
   02 — Working capital calculator
   ============================================================ */
(function(){
  const assetsI = document.getElementById('wcAssets'), liabI = document.getElementById('wcLiab');
  const result = document.getElementById('wcResult');
  if (!assetsI) return;
  function render(){
    const assets = parseFloat(assetsI.value), liab = parseFloat(liabI.value);
    const wc = assets - liab;
    result.textContent = `Working capital = $${fmtNum(wc)}`;
  }
  [assetsI,liabI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   06 — Equity builder calculator
   ============================================================ */
(function(){
  const contribI = document.getElementById('eqContrib'), treasuryI = document.getElementById('eqTreasury'),
        retainedI = document.getElementById('eqRetained'), aociI = document.getElementById('eqAOCI'), nciI = document.getElementById('eqNCI');
  const result = document.getElementById('eqResult');
  if (!contribI) return;
  function render(){
    const contrib = parseFloat(contribI.value), treasury = parseFloat(treasuryI.value),
          retained = parseFloat(retainedI.value), aoci = parseFloat(aociI.value), nci = parseFloat(nciI.value);
    const total = contrib - treasury + retained + aoci + nci;
    result.textContent = `Total equity = €${fmtNum(total)}M`;
  }
  [contribI,treasuryI,retainedI,aociI,nciI].forEach(el => el.addEventListener('input', render));
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
const sectionIds = ['sec-overview','sec-classification','sec-liquidity','sec-currentassets','sec-currentliab','sec-equity','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-balance-sheets', String(pct)); } catch(e) {}
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
  { concept:"What the Balance Sheet Reports",
    q: "The balance sheet is also formally known, under IFRS, as the:",
    opts: ["Statement of financial position", "Statement of cash flows", "Statement of operations"], correct: 0,
    exp: "IFRS uses the term 'statement of financial position' for what US GAAP commonly calls the balance sheet." },
  { concept:"What the Balance Sheet Reports",
    q: "Why is balance sheet equity not a reliable measure of a company's market value?",
    opts: ["It uses a mixed measurement model, reflects only one past date, and excludes unrecorded value drivers like reputation", "Balance sheet equity is always identical to market value", "The balance sheet doesn't report equity at all"], correct: 0,
    exp: "Mixed measurement bases, a single point-in-time snapshot, and missing intangible value drivers all separate book equity from market value." },
  { concept:"What the Balance Sheet Reports",
    q: "On the balance sheet, the right side of A = L + E can be interpreted as showing:",
    opts: ["What the company owns", "How the company's resources were financed", "The company's revenue for the period"], correct: 1,
    exp: "Liabilities and equity together show how the company's assets were financed — by creditors or by owners." },

  { concept:"Current vs. Non-Current",
    q: "Current assets are those expected to be sold, used, or converted to cash within:",
    opts: ["Exactly 90 days", "One year or one operating cycle, whichever is greater", "One operating cycle only, regardless of length"], correct: 1,
    exp: "The current classification uses whichever is longer: one year, or the company's normal operating cycle." },
  { concept:"Current vs. Non-Current",
    q: "A distillery's whiskey ages in barrels for 4 years before sale. How is this inventory typically classified?",
    opts: ["Non-current, since it exceeds one year", "Current, since it's expected to sell within the company's normal operating cycle", "It cannot be classified as an asset"], correct: 1,
    exp: "Since the industry's normal operating cycle exceeds a year, this inventory still qualifies as a current asset." },
  { concept:"Current vs. Non-Current",
    q: "A company has $100,000 in current assets and $60,000 in current liabilities. What is its working capital?",
    opts: ["$160,000", "$40,000", "$60,000"], correct: 1,
    exp: "Working capital = Current assets − Current liabilities = 100,000 − 60,000 = $40,000." },

  { concept:"Liquidity-Based Presentation",
    q: "A liquidity-based balance sheet presentation orders items by:",
    opts: ["Alphabetical order", "Degree of liquidity", "Random order set by management"], correct: 1,
    exp: "In a liquidity-based presentation, assets and liabilities are ordered by how liquid they are, from most to least." },
  { concept:"Liquidity-Based Presentation",
    q: "Which type of company is a typical candidate for liquidity-based balance sheet presentation?",
    opts: ["A small local bakery", "A global bank like HSBC", "A lumber company"], correct: 1,
    exp: "Banks, where current/non-current distinctions are less meaningful, commonly use liquidity-based presentation." },
  { concept:"Liquidity-Based Presentation",
    q: "In HSBC's liquidity-based balance sheet, which item appears near the very top of the asset listing?",
    opts: ["Interests in associates and joint ventures", "Cash and balances at central banks", "Goodwill and intangible assets"], correct: 1,
    exp: "The most liquid item, cash and balances at central banks, appears first, with less liquid items like associate interests further down." },

  { concept:"Current Assets",
    q: "Which of these qualifies as a cash equivalent?",
    opts: ["A Treasury bill with an original maturity of 2 months", "Inventory expected to sell within 60 days", "A bond maturing in 5 years"], correct: 0,
    exp: "Cash equivalents require an original maturity of three months or less — the 2-month T-bill qualifies." },
  { concept:"Current Assets",
    q: "Which four categories are required current-asset line items, if material?",
    opts: ["Cash and cash equivalents, trade receivables, inventories, and short-maturity financial assets", "Only cash and inventories", "Goodwill, patents, land, and buildings"], correct: 0,
    exp: "These four categories must be shown separately on the balance sheet when material." },
  { concept:"Current Assets",
    q: "An investment with an original maturity of 5 months is best classified as:",
    opts: ["A cash equivalent", "A short-term investment, not a cash equivalent", "Inventory"], correct: 1,
    exp: "Exceeding the three-month cutoff, this investment doesn't qualify as a cash equivalent, even though it's still short-term." },

  { concept:"Current Liabilities",
    q: "Trade payables (accounts payable) represent:",
    opts: ["Amounts a company is owed by its customers", "Amounts a company owes to its vendors for purchases on credit", "Cash a company has already received but not yet earned"], correct: 1,
    exp: "Trade payables are unpaid amounts owed to vendors — the mirror image of another company's trade receivables." },
  { concept:"Current Liabilities",
    q: "A company receives a full year's payment upfront but has delivered only 2 of 12 months of service. The remaining obligation is classified as:",
    opts: ["Revenue, recognized immediately", "Deferred (unearned) revenue, a current liability", "An asset"], correct: 1,
    exp: "Cash received before the related service is delivered is a liability — deferred revenue — recognized as revenue only as delivered." },
  { concept:"Current Liabilities",
    q: "A 10-year bond's next principal payment falls due in 8 months. How should that portion be classified?",
    opts: ["Entirely as a non-current liability, since the bond itself is long-term", "As a current liability — the current portion of long-term debt", "It is not reported until the payment is made"], correct: 1,
    exp: "Even long-term debt gets reclassified: the portion due within the next year appears as a current liability." },

  { concept:"Components of Equity",
    q: "Which of the following is NOT one of the six typical components of equity?",
    opts: ["Retained earnings", "Trade receivables", "Treasury shares"], correct: 1,
    exp: "Trade receivables is an asset, not a component of equity — equity includes contributed capital, preferred shares, treasury shares, retained earnings, AOCI, and non-controlling interest." },
  { concept:"Components of Equity",
    q: "What effect do treasury shares have on total shareholders' equity?",
    opts: ["They increase equity by the repurchase amount", "They decrease equity by the repurchase cost", "They have no effect on equity at all"], correct: 1,
    exp: "Repurchasing and holding shares (rather than cancelling them) reduces total shareholders' equity by the cost of the repurchase." },
  { concept:"Components of Equity",
    q: "A company has contributed capital of $5,000, treasury shares of $800, retained earnings of $30,000, AOCI of $1,200, and non-controlling interest of $500. What is total equity?",
    opts: ["$35,900", "$37,500", "$34,700"], correct: 0,
    exp: "Total equity = 5,000 − 800 + 30,000 + 1,200 + 500 = $35,900." },
  { concept:"Components of Equity",
    q: "Retained earnings represents:",
    opts: ["Cash directly invested by shareholders", "Cumulative net income earned, minus all dividends ever paid", "The par value of issued shares"], correct: 1,
    exp: "Retained earnings is the cumulative amount of earnings the company has kept (not distributed as dividends) over its life." },
  { concept:"Components of Equity",
    q: "Do treasury shares receive dividends or carry voting rights?",
    opts: ["Yes, both", "No — treasury shares carry no vote and receive no dividends", "Only voting rights, no dividends"], correct: 1,
    exp: "Treasury shares are non-voting and don't receive any dividends the company declares." }
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
        const isCorrect = i === item.correct;
        if (isCorrect) score++;
        if (typeof cfaRecordAnswer === 'function' && item.concept){
          cfaRecordAnswer(item.concept, "Balance Sheets", isCorrect);
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

  } catch(e) { console.warn('[balance-sheets] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: cash-flow
   ============================================================ */
(function(){
  try {
// ============================================================
// Cash Flow Statements — interactivity
// ============================================================

function fmtMoney(n){
  const sign = n < 0 ? '−' : '';
  return sign + '€' + Math.round(Math.abs(n)).toLocaleString();
}

/* ============================================================
   02 — Investing cash flow calculator
   ============================================================ */
(function(){
  const purchaseI = document.getElementById('cfPurchase'), saleI = document.getElementById('cfSale');
  const result = document.getElementById('cfResult');
  if (!purchaseI) return;
  function render(){
    const purchase = parseFloat(purchaseI.value), sale = parseFloat(saleI.value);
    const net = sale - purchase;
    result.textContent = `Net investing cash flow = ${fmtMoney(net)}`;
  }
  [purchaseI,saleI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   05 — IFRS vs US GAAP classifier widget
   ============================================================ */
(function(){
  const container = document.getElementById('classifierWidget');
  if (!container) return;
  const items = [
    { name: "Interest received", ifrs: "Operating OR Investing (choice)", gaap: "Always Operating" },
    { name: "Interest paid", ifrs: "Operating OR Financing (choice)", gaap: "Always Operating" },
    { name: "Dividends received", ifrs: "Operating OR Investing (choice)", gaap: "Always Operating" },
    { name: "Dividends paid", ifrs: "Operating OR Financing (choice)", gaap: "Always Financing" },
  ];
  let html = '<div style="display:flex; flex-direction:column; gap:8px;">';
  items.forEach((item, i) => {
    html += `
      <div class="element-item" data-i="${i}" style="background:var(--paper-dim); border-radius:8px; padding:10px 14px; cursor:pointer;">
        <div style="font-size:.88rem; font-weight:600;">${item.name}</div>
        <div class="element-answer" id="classAnswer${i}" style="display:none; margin-top:6px; font-size:.8rem; color:var(--ink-soft);"></div>
      </div>`;
  });
  html += '</div>';
  container.innerHTML = html;

  container.querySelectorAll('.element-item').forEach(el => {
    el.addEventListener('click', () => {
      const i = el.dataset.i;
      const item = items[i];
      const answerEl = document.getElementById(`classAnswer${i}`);
      if (answerEl.style.display === 'none'){
        answerEl.innerHTML = `<strong style="color:var(--indigo);">IFRS:</strong> ${item.ifrs}<br><strong style="color:var(--indigo);">US GAAP:</strong> ${item.gaap}`;
        answerEl.style.display = 'block';
      } else {
        answerEl.style.display = 'none';
      }
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
const sectionIds = ['sec-why','sec-classify','sec-noncash','sec-directindirect','sec-ifrsgaap','sec-realexample','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-cash-flow', String(pct)); } catch(e) {}
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
  { concept:"Why the Cash Flow Statement Exists",
    q: "A company reports strong net income but generates almost no actual cash from operations. What could explain this gap?",
    opts: ["A large share of revenue is from credit sales not yet collected", "Net income and operating cash flow are always identical, so this cannot happen", "The company must have negative revenue"], correct: 0,
    exp: "Uncollected credit sales boost accrual-based net income without generating any actual cash, creating exactly this gap." },
  { concept:"Why the Cash Flow Statement Exists",
    q: "Which source of cash can, in principle, continue indefinitely?",
    opts: ["Selling off long-term assets", "Cash generated from ongoing operations", "New borrowing, regardless of lender confidence"], correct: 1,
    exp: "Operating cash generation can continue indefinitely, unlike asset sales (limited by what's left to sell) or borrowing (limited by lender willingness)." },
  { concept:"Why the Cash Flow Statement Exists",
    q: "What does the cash flow statement reconcile, in addition to showing sources and uses of cash?",
    opts: ["The beginning and ending cash balance on the balance sheet", "The company's tax rate over time", "The market value of its equity"], correct: 0,
    exp: "The cash flow statement explicitly reconciles the beginning and ending cash balances reported on the balance sheet." },

  { concept:"Operating, Investing & Financing",
    q: "Which of these is classified as an investing activity?",
    opts: ["Collecting cash from a customer for a sale", "Purchasing new manufacturing equipment", "Issuing new shares of common stock"], correct: 1,
    exp: "Purchasing long-term assets like equipment is a classic investing activity." },
  { concept:"Operating, Investing & Financing",
    q: "A company reports: equipment purchased €200,000, equipment sold for €120,000, and €300,000 of debt issued. What is net cash flow from investing activities?",
    opts: ["−€80,000", "+€220,000", "−€200,000"], correct: 0,
    exp: "Only the equipment purchase and sale affect investing: −200,000 + 120,000 = −€80,000. The debt issuance is a financing flow." },
  { concept:"Operating, Investing & Financing",
    q: "Why is stretching out payment to suppliers (accounts payable) classified as an operating activity rather than financing, despite being a form of borrowing?",
    opts: ["It's the accounts payable balance itself providing the 'financing,' not a formal debt instrument", "Accounts payable has nothing to do with financing in any sense", "All borrowing is always classified as operating"], correct: 0,
    exp: "Trade credit through accounts payable is classified as operating because it arises from day-to-day operating relationships, not formal financing arrangements." },

  { concept:"Non-Cash Activities",
    q: "A company converts $5 million of convertible bonds into common stock, with no cash involved. How should this be handled?",
    opts: ["Reported as a $5 million financing outflow", "Excluded from the cash flow statement, but disclosed separately as a significant non-cash transaction", "Ignored entirely, with no disclosure required"], correct: 1,
    exp: "With no cash involved, this is excluded from the cash flow statement itself but must be disclosed separately given its significance to the capital structure." },
  { concept:"Non-Cash Activities",
    q: "Which of these is an example of a non-cash investing/financing transaction?",
    opts: ["Paying cash to purchase equipment", "Exchanging one non-monetary asset directly for another", "Collecting cash from a customer"], correct: 1,
    exp: "A direct asset-for-asset exchange involves no cash and is a classic non-cash transaction." },
  { concept:"Non-Cash Activities",
    q: "Where are significant non-cash transactions typically disclosed?",
    opts: ["Nowhere — they are never disclosed", "In a separate note or supplementary schedule to the cash flow statement", "Directly within the operating activities section"], correct: 1,
    exp: "Non-cash transactions are disclosed separately, typically as a note or supplementary schedule, since they don't belong in the cash flow statement itself." },

  { concept:"Direct vs. Indirect Method",
    q: "Does the choice between direct and indirect method affect the total operating cash flow figure reported?",
    opts: ["Yes, they produce different totals", "No — both arrive at the identical operating cash flow number; only presentation differs", "Only under US GAAP"], correct: 1,
    exp: "The direct and indirect methods are simply two different presentations of the same underlying operating cash flow figure." },
  { concept:"Direct vs. Indirect Method",
    q: "Which method starts with net income and adjusts for non-cash and non-operating items?",
    opts: ["The direct method", "The indirect method", "Neither method uses net income"], correct: 1,
    exp: "The indirect method begins with net income and reconciles it to operating cash flow through a series of adjustments." },
  { concept:"Direct vs. Indirect Method",
    q: "Which method is used by the vast majority of real companies, despite CFA Institute advocating for the alternative?",
    opts: ["The direct method", "The indirect method", "Companies are evenly split"], correct: 1,
    exp: "Despite CFA Institute's advocacy for the direct method, the vast majority of companies use the indirect method in practice." },

  { concept:"IFRS vs. US GAAP",
    q: "Under US GAAP, how is interest paid classified?",
    opts: ["Always operating", "Always financing", "Company's choice between operating and financing"], correct: 0,
    exp: "Under US GAAP, interest paid is always classified as an operating activity, with no discretion permitted." },
  { concept:"IFRS vs. US GAAP",
    q: "Under IFRS, how may dividends paid be classified?",
    opts: ["Always as an investing activity", "Either operating or financing, at the company's choice, applied consistently", "Never disclosed at all"], correct: 1,
    exp: "IFRS permits a choice between classifying dividends paid as operating or financing, as long as it's applied consistently." },
  { concept:"IFRS vs. US GAAP",
    q: "Why does the IFRS-vs-US-GAAP classification difference matter for analysts?",
    opts: ["It has no practical effect on reported figures", "Two economically identical companies can report meaningfully different operating cash flow figures purely due to this choice", "It only affects the balance sheet, not cash flow"], correct: 1,
    exp: "The classification choice can create genuine differences in reported operating cash flow between otherwise identical companies, requiring careful comparison." },

  { concept:"IFRS vs. US GAAP",
    q: "Under IFRS, how may interest received be classified?",
    opts: ["Only as a financing activity", "Either operating or investing, at the company's choice", "It cannot be reported under IFRS"], correct: 1,
    exp: "IFRS allows interest received to be classified as either operating or investing, applied consistently from year to year." },

  { concept:"Reading a Real Statement",
    q: "In Unilever's 2017 cash flow statement, why is depreciation added back to net income?",
    opts: ["It's a non-cash expense that reduced net income without using any actual cash", "Depreciation is itself a cash inflow", "It must always be subtracted, not added"], correct: 0,
    exp: "Depreciation reduces net income but involves no cash outflow, so it's added back when reconciling net income to operating cash flow." },
  { concept:"Reading a Real Statement",
    q: "What is the general skeleton every indirect-method cash flow statement follows?",
    opts: ["Start with revenue, then subtract all expenses one by one", "Start with net income, add back non-cash items, adjust for non-operating items and working capital changes", "Start with cash, then work backward to net income"], correct: 1,
    exp: "This skeleton — net income, non-cash add-backs, non-operating adjustments, working capital changes — is the universal structure of indirect-method statements." },
  { concept:"Reading a Real Statement",
    q: "If net income and operating cash flow diverge dramatically over several consecutive years, what should an analyst do?",
    opts: ["Ignore it, since some divergence is always expected", "Investigate further, since a persistent, large divergence can be a warning sign", "Assume the company's accountants made an error"], correct: 1,
    exp: "While some divergence between net income and cash flow is normal, a persistent, large gap warrants closer investigation into the underlying cause." },

  { concept:"Operating, Investing & Financing",
    q: "Which of these is classified as a financing activity?",
    opts: ["Paying employee salaries", "Repurchasing the company's own common stock", "Purchasing raw materials inventory"], correct: 1,
    exp: "Repurchasing stock (treasury stock) is a financing activity, involving the company's own capital structure." }
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
        const isCorrect = i === item.correct;
        if (isCorrect) score++;
        if (typeof cfaRecordAnswer === 'function' && item.concept){
          cfaRecordAnswer(item.concept, "Cash Flow Statements", isCorrect);
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

  } catch(e) { console.warn('[cash-flow] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: final-review
   ============================================================ */
(function(){
  try {
// ============================================================
// Final Review — 136 questions across all 11 FSA module pages (9 core modules)
// 2 questions per real concept/section, for reliable per-concept diagnosis
// ============================================================

const QUIZ = [
  // ========== MODULE 00: FSA Foundations (7 concepts x 2 = 14) ==========
  { cat:"FSA Foundations", concept:"What Is Financial Reporting?",
    q:"Financial reporting standards exist primarily to:",
    opts:["Ensure comparability of financial statements across companies","Make accounting harder for beginners","Only satisfy government auditors"], correct:0,
    exp:"Standards create enough consistency that a reported number means roughly the same thing across different companies." },
  { cat:"FSA Foundations", concept:"What Is Financial Reporting?",
    q:"Who are the primary users financial statements are designed to serve?",
    opts:["Investors, creditors, and other resource providers","Only the company's own employees","Only government tax authorities"], correct:0,
    exp:"Financial statements primarily serve investors, lenders, and other resource providers making decisions about the entity." },

  { cat:"FSA Foundations", concept:"The Accounting Equation",
    q:"A company has $600,000 in assets and $250,000 in liabilities. What is its equity?",
    opts:["$850,000","$350,000","$250,000"], correct:1,
    exp:"Equity = Assets − Liabilities = 600,000 − 250,000 = $350,000." },
  { cat:"FSA Foundations", concept:"The Accounting Equation",
    q:"Why must the accounting equation balance after every transaction?",
    opts:["Double-entry recording keeps both sides equal by construction","It's an arbitrary convention with no mechanism enforcing it","It only needs to balance once a year"], correct:0,
    exp:"Double-entry bookkeeping ensures every transaction keeps assets equal to liabilities plus equity, automatically." },

  { cat:"FSA Foundations", concept:"The Four Statements — A Bird's Eye View",
    q:"Which financial statement is a snapshot at a single point in time?",
    opts:["The income statement","The balance sheet","The cash flow statement"], correct:1,
    exp:"The balance sheet captures a company's financial position at one exact instant, unlike the period-based income and cash flow statements." },
  { cat:"FSA Foundations", concept:"The Four Statements — A Bird's Eye View",
    q:"Which statement isolates actual cash movement, unaffected by accounting estimates?",
    opts:["The income statement","The statement of changes in equity","The cash flow statement"], correct:2,
    exp:"The cash flow statement strips away accruals and estimates to show genuine cash inflows and outflows." },

  { cat:"FSA Foundations", concept:"Accrual vs. Cash Basis",
    q:"Under accrual accounting, revenue is recognized when:",
    opts:["Cash is received","It is earned, regardless of when cash is received","The fiscal year ends"], correct:1,
    exp:"Accrual accounting recognizes revenue when earned, independent of the timing of cash collection." },
  { cat:"FSA Foundations", concept:"Accrual vs. Cash Basis",
    q:"Why can a company be profitable on paper while genuinely short on cash?",
    opts:["This is impossible under any accounting method","Accrual accounting recognizes revenue before cash is actually collected","Profit and cash flow are always identical"], correct:1,
    exp:"Since accrual accounting records revenue when earned, not when collected, a company can show a profit while awaiting payment from slow-paying customers." },

  { cat:"FSA Foundations", concept:"Double-Entry Bookkeeping",
    q:"Every transaction under double-entry bookkeeping affects at minimum how many accounts?",
    opts:["One","Two","Four"], correct:1,
    exp:"Double-entry bookkeeping requires every transaction to touch at least two accounts, keeping the equation balanced." },
  { cat:"FSA Foundations", concept:"Double-Entry Bookkeeping",
    q:"A debit to an expense account:",
    opts:["Increases the expense","Decreases the expense","Has no effect"], correct:0,
    exp:"A debit increases expense and asset accounts, while decreasing liability, equity, and revenue accounts." },

  { cat:"FSA Foundations", concept:"Assets, Liabilities & Equity",
    q:"A company delivers services on credit. What does it record on its own books?",
    opts:["An increase in accounts receivable (an asset)","An increase in accounts payable (a liability)","No entry at all"], correct:0,
    exp:"The seller records accounts receivable, an asset reflecting its right to collect cash later." },
  { cat:"FSA Foundations", concept:"Assets, Liabilities & Equity",
    q:"Is equity the same thing as how much cash a company holds?",
    opts:["Yes, always","No — equity is a residual claim, calculated after subtracting all liabilities from assets","Only for small companies"], correct:1,
    exp:"Equity equals assets minus liabilities; a company can be cash-rich yet have low equity if liabilities are large." },

  { cat:"FSA Foundations", concept:"Revenues, Expenses & Matching",
    q:"According to the matching principle, an expense should be recognized:",
    opts:["In the same period as the revenue it helped generate","Always in the period cash was paid","Only at fiscal year-end"], correct:0,
    exp:"The matching principle pairs expenses with the revenue they helped produce, in the same reporting period." },
  { cat:"FSA Foundations", concept:"Revenues, Expenses & Matching",
    q:"A machine costing $150,000 is expected to help generate revenue for 10 years. Under the matching principle, how should its cost be treated?",
    opts:["Expensed entirely in the year purchased","Spread as an expense across the years it helps generate revenue","Never expensed"], correct:1,
    exp:"The matching principle requires spreading the machine's cost across the periods it helps generate revenue — the basis of depreciation." },

  // ========== MODULE 01: Introduction to Financial Reporting (7 concepts x 2 = 14) ==========
  { cat:"Introduction to Financial Reporting", concept:"Standard-Setters vs. Regulators",
    q:"Which best describes the IASB's role?",
    opts:["It has direct legal power to enforce IFRS in every country", "It develops accounting standards, relying on regulators to give them legal force", "It only audits individual companies"], correct:1,
    exp:"Standard-setters like the IASB draft the rules; regulators must recognize and enforce them for legal effect." },
  { cat:"Introduction to Financial Reporting", concept:"Standard-Setters vs. Regulators",
    q:"Which body does the SEC recognize as the authoritative source of US GAAP?",
    opts:["The IASB","The FASB","The IFRS Foundation"], correct:1,
    exp:"The FASB issues US GAAP, recognized as authoritative by the SEC." },

  { cat:"Introduction to Financial Reporting", concept:"The Objective of Financial Reporting",
    q:"The IASB's Conceptual Framework centers financial reporting's objective on serving:",
    opts:["Resource providers making decisions","Only company management","Only tax authorities"], correct:0,
    exp:"The framework's core objective is providing decision-useful information to current and potential resource providers." },
  { cat:"Introduction to Financial Reporting", concept:"The Objective of Financial Reporting",
    q:"Which of these is NOT one of the three core things users need to know about a company per the framework?",
    opts:["Financial position","Financial performance","The CEO's personal opinions"], correct:2,
    exp:"The three core needs are financial position, financial performance, and cash position." },

  { cat:"Introduction to Financial Reporting", concept:"Relevance & Faithful Representation",
    q:"Information with the potential to affect a user's decision has which fundamental characteristic?",
    opts:["Relevance","Timeliness","Comparability"], correct:0,
    exp:"Relevance is defined by information's potential to influence users' decisions, via predictive or confirmatory value." },
  { cat:"Introduction to Financial Reporting", concept:"Relevance & Faithful Representation",
    q:"Faithful representation requires information to be complete, neutral, and:",
    opts:["Free from error","Extremely detailed","Externally audited"], correct:0,
    exp:"The three components of faithful representation are complete, neutral, and free from error." },

  { cat:"Introduction to Financial Reporting", concept:"Enhancing Characteristics & Constraints",
    q:"Which enhancing characteristic lets users identify similarities and differences across companies?",
    opts:["Comparability","Timeliness","Understandability"], correct:0,
    exp:"Comparability enables users to identify and understand similarities and differences among items." },
  { cat:"Introduction to Financial Reporting", concept:"Enhancing Characteristics & Constraints",
    q:"What is identified as the pervasive constraint on useful financial reporting?",
    opts:["The cost of providing and using the information","The number of pages in the report","Regulatory approval delays"], correct:0,
    exp:"Cost is the pervasive constraint — the benefit of disclosure should ideally exceed the cost of providing it." },

  { cat:"Introduction to Financial Reporting", concept:"The Elements of Financial Statements",
    q:"Which three elements measure a company's financial position?",
    opts:["Assets, liabilities, and equity","Income, expenses, and equity","Revenue, gains, and losses"], correct:0,
    exp:"Assets, liabilities, and equity measure financial position; income and expenses measure performance." },
  { cat:"Introduction to Financial Reporting", concept:"The Elements of Financial Statements",
    q:"A company sells surplus land above book value. This is classified as:",
    opts:["Revenue","A gain (income, but not revenue)","A liability"], correct:1,
    exp:"Since selling land isn't the company's core operation, this is a gain — income, but distinct from revenue." },

  { cat:"Introduction to Financial Reporting", concept:"Accrual Accounting & Going Concern",
    q:"The 'going concern' assumption means financial statements assume:",
    opts:["The company is about to liquidate","The company will continue operating for the foreseeable future","The company has no liabilities"], correct:1,
    exp:"Going concern assumes continued operation, not imminent liquidation." },
  { cat:"Introduction to Financial Reporting", concept:"Accrual Accounting & Going Concern",
    q:"If a company is genuinely expected to liquidate soon, how does this affect its financial statements?",
    opts:["Nothing changes","Going concern no longer holds, and assets typically need different valuation","Only the cash flow statement changes"], correct:1,
    exp:"Expected liquidation breaks the going concern assumption, often requiring lower asset valuations reflecting a forced sale." },

  { cat:"Introduction to Financial Reporting", concept:"Bases of Measurement",
    q:"The amount originally paid to acquire an asset is called:",
    opts:["Fair value","Historical cost","Present value"], correct:1,
    exp:"Historical cost is the original amount paid to acquire the asset." },
  { cat:"Introduction to Financial Reporting", concept:"Bases of Measurement",
    q:"The price received to sell an asset in an orderly market transaction is:",
    opts:["Historical cost","Amortised cost","Fair value"], correct:2,
    exp:"Fair value is defined as an exit price achievable in an orderly market transaction." },

  // ========== MODULE 02: Income Statements (8 concepts x 2 = 16) ==========
  { cat:"Income Statements", concept:"What the Income Statement Reports",
    q:"The income statement is also known by which other name?",
    opts:["The statement of financial position","The statement of operations","The statement of cash flows"], correct:1,
    exp:"Statement of operations, statement of earnings, and P&L are all alternate names for the income statement." },
  { cat:"Income Statements", concept:"What the Income Statement Reports",
    q:"Does the income statement report a snapshot or performance over a period?",
    opts:["A snapshot","Performance over a period of time","Both equally"], correct:1,
    exp:"The income statement covers a period, unlike the balance sheet's single-instant snapshot." },

  { cat:"Income Statements", concept:"The Five-Step Revenue Model",
    q:"What is the correct first step in the five-step revenue recognition model?",
    opts:["Recognize revenue when a performance obligation is satisfied","Identify the contract(s) with a customer","Determine the transaction price"], correct:1,
    exp:"Step 1 is identifying the contract(s) with a customer." },
  { cat:"Income Statements", concept:"The Five-Step Revenue Model",
    q:"Builder Co. has an $800,000 contract, expects $500,000 total costs, and has incurred $300,000. How much revenue should it recognize?",
    opts:["$480,000","$300,000","$800,000"], correct:0,
    exp:"Progress = 300,000/500,000 = 60%. Revenue = 60% × 800,000 = $480,000." },

  { cat:"Income Statements", concept:"Principal vs. Agent",
    q:"A company bearing inventory risk and controlling pricing is acting as a:",
    opts:["Agent, reporting revenue net","Principal, reporting revenue gross","Neither"], correct:1,
    exp:"Bearing risk and controlling price are hallmarks of a principal, who reports the full transaction as revenue." },
  { cat:"Income Statements", concept:"Principal vs. Agent",
    q:"A marketplace earns a 10% commission on $2,000 of orders, without bearing inventory risk. How much revenue should it report?",
    opts:["$2,000","$200","$1,800"], correct:1,
    exp:"As an agent, the company reports only its commission ($200) as revenue." },

  { cat:"Income Statements", concept:"Doubtful Accounts & Warranties",
    q:"Under the matching principle, estimated uncollectible accounts should be recognized:",
    opts:["Only when a customer actually defaults","In the same period as the related revenue, as an estimate","Never"], correct:1,
    exp:"Matching requires estimating uncollectible amounts in the same period as the related revenue." },
  { cat:"Income Statements", concept:"Doubtful Accounts & Warranties",
    q:"How should estimated warranty expenses be handled?",
    opts:["Wait until repairs are actually incurred","Estimate and recognize at the time of sale, adjusting later","Never recorded as expenses"], correct:1,
    exp:"Warranty expense must be estimated and recognized at the point of sale, trued up against actual experience over time." },

  { cat:"Income Statements", concept:"Depreciation & Amortization",
    q:"An asset costs $80,000, has $8,000 residual value, and an 8-year useful life. What is annual straight-line depreciation?",
    opts:["$10,000","$9,000","$8,000"], correct:1,
    exp:"Annual depreciation = (80,000 − 8,000)/8 = $9,000." },
  { cat:"Income Statements", concept:"Depreciation & Amortization",
    q:"Is the revaluation model for PP&E permitted under US GAAP?",
    opts:["Yes, commonly used","No — permitted under IFRS but not US GAAP","Required under both"], correct:1,
    exp:"The revaluation model is IFRS-only; US GAAP requires the cost model." },

  { cat:"Income Statements", concept:"Operating vs. Non-Operating",
    q:"For a typical manufacturer, how is interest expense on debt usually classified?",
    opts:["Non-operating","Operating","Never reported"], correct:0,
    exp:"For a typical manufacturer, interest expense relates to financing, not core operations — non-operating." },
  { cat:"Income Statements", concept:"Operating vs. Non-Operating",
    q:"For a bank, how is interest income typically classified?",
    opts:["Non-operating","Operating, since lending is the bank's core business","Excluded entirely"], correct:1,
    exp:"For a bank, interest income is a core operating activity, not non-operating." },

  { cat:"Income Statements", concept:"Common-Size Analysis",
    q:"Common-size analysis of the income statement expresses each line as a percentage of:",
    opts:["Total assets","Revenue","Net income"], correct:1,
    exp:"Vertical common-size analysis expresses every income statement line as a percentage of revenue." },
  { cat:"Income Statements", concept:"Common-Size Analysis",
    q:"A company has $1,500,000 revenue and $250,000 operating profit. What is its common-size operating margin?",
    opts:["16.7%","25.0%","6.0%"], correct:0,
    exp:"Operating margin = 250,000/1,500,000 ≈ 16.7%." },

  { cat:"Income Statements", concept:"Comprehensive Income",
    q:"Comprehensive income equals net income plus:",
    opts:["Total assets","Other comprehensive income (OCI)","Total liabilities"], correct:1,
    exp:"Comprehensive income = Net income + Other comprehensive income." },
  { cat:"Income Statements", concept:"Comprehensive Income",
    q:"Which of these is a common type of other comprehensive income?",
    opts:["Foreign currency translation adjustments","Cost of goods sold","Depreciation expense"], correct:0,
    exp:"Foreign currency translation adjustments are a common category of OCI." },

  // ========== MODULE 03: Balance Sheets (6 concepts x 2 = 12) ==========
  { cat:"Balance Sheets", concept:"What the Balance Sheet Reports",
    q:"The balance sheet is also formally known, under IFRS, as the:",
    opts:["Statement of financial position","Statement of cash flows","Statement of operations"], correct:0,
    exp:"IFRS uses 'statement of financial position' for what US GAAP calls the balance sheet." },
  { cat:"Balance Sheets", concept:"What the Balance Sheet Reports",
    q:"Why isn't balance sheet equity a reliable measure of market value?",
    opts:["It mixes measurement bases, reflects one past date, and excludes unrecorded value drivers","Book equity always equals market value","The balance sheet doesn't report equity"], correct:0,
    exp:"Mixed measurement bases, a point-in-time snapshot, and missing intangible drivers separate book equity from market value." },

  { cat:"Balance Sheets", concept:"Current vs. Non-Current",
    q:"Current assets are expected to convert to cash within:",
    opts:["Exactly 90 days","One year or one operating cycle, whichever is greater","One operating cycle only"], correct:1,
    exp:"The current classification uses whichever is longer: one year or the normal operating cycle." },
  { cat:"Balance Sheets", concept:"Current vs. Non-Current",
    q:"A company has $100,000 current assets and $60,000 current liabilities. What is its working capital?",
    opts:["$160,000","$40,000","$60,000"], correct:1,
    exp:"Working capital = 100,000 − 60,000 = $40,000." },

  { cat:"Balance Sheets", concept:"Liquidity-Based Presentation",
    q:"A liquidity-based balance sheet presentation orders items by:",
    opts:["Alphabetical order","Degree of liquidity","Random order"], correct:1,
    exp:"Liquidity-based presentation orders assets and liabilities from most to least liquid." },
  { cat:"Balance Sheets", concept:"Liquidity-Based Presentation",
    q:"Which type of company commonly uses liquidity-based presentation?",
    opts:["A small bakery","A global bank","A lumber company"], correct:1,
    exp:"Banks, where current/non-current distinctions are less meaningful, commonly use liquidity-based presentation." },

  { cat:"Balance Sheets", concept:"Current Assets",
    q:"Which of these qualifies as a cash equivalent?",
    opts:["A Treasury bill with 2-month original maturity","Inventory expected to sell in 60 days","A bond maturing in 5 years"], correct:0,
    exp:"Cash equivalents require an original maturity of three months or less." },
  { cat:"Balance Sheets", concept:"Current Assets",
    q:"Which four categories are required current-asset line items, if material?",
    opts:["Cash equivalents, trade receivables, inventories, and short-maturity financial assets","Only cash and inventories","Goodwill, patents, land, and buildings"], correct:0,
    exp:"These four categories must be shown separately when material." },

  { cat:"Balance Sheets", concept:"Current Liabilities",
    q:"Trade payables represent:",
    opts:["Amounts owed by customers","Amounts owed to vendors for credit purchases","Cash already received but not earned"], correct:1,
    exp:"Trade payables are unpaid amounts owed to vendors." },
  { cat:"Balance Sheets", concept:"Current Liabilities",
    q:"A company receives a full year's payment upfront, delivering only 2 of 12 months. The remaining obligation is:",
    opts:["Revenue, recognized immediately","Deferred (unearned) revenue, a current liability","An asset"], correct:1,
    exp:"Cash received before delivery is a liability, recognized as revenue only as delivered." },

  { cat:"Balance Sheets", concept:"Components of Equity",
    q:"Which of these is NOT a typical component of equity?",
    opts:["Retained earnings","Trade receivables","Treasury shares"], correct:1,
    exp:"Trade receivables is an asset, not an equity component." },
  { cat:"Balance Sheets", concept:"Components of Equity",
    q:"What effect do treasury shares have on total equity?",
    opts:["Increase equity","Decrease equity by the repurchase cost","No effect"], correct:1,
    exp:"Repurchasing and holding shares reduces total equity by the repurchase cost." },

  // ========== MODULE 04: Cash Flow Statements (6 concepts x 2 = 12) ==========
  { cat:"Cash Flow Statements", concept:"Why the Cash Flow Statement Exists",
    q:"A company reports strong net income but generates almost no cash from operations. What could explain this?",
    opts:["A large share of revenue is uncollected credit sales","Net income and operating cash flow are always identical","The company has negative revenue"], correct:0,
    exp:"Uncollected credit sales boost accrual net income without generating actual cash." },
  { cat:"Cash Flow Statements", concept:"Why the Cash Flow Statement Exists",
    q:"Which source of cash can, in principle, continue indefinitely?",
    opts:["Selling off assets","Cash from ongoing operations","New borrowing regardless of lender confidence"], correct:1,
    exp:"Operating cash generation can continue indefinitely, unlike limited asset sales or borrowing." },

  { cat:"Cash Flow Statements", concept:"Operating, Investing & Financing",
    q:"Which of these is classified as an investing activity?",
    opts:["Collecting cash from a customer","Purchasing new manufacturing equipment","Issuing new common stock"], correct:1,
    exp:"Purchasing long-term assets is a classic investing activity." },
  { cat:"Cash Flow Statements", concept:"Operating, Investing & Financing",
    q:"Equipment purchased €200,000, sold for €120,000, plus €300,000 of debt issued. What is net investing cash flow?",
    opts:["−€80,000","+€220,000","−€200,000"], correct:0,
    exp:"Only the equipment purchase and sale affect investing: −200,000+120,000 = −€80,000." },

  { cat:"Cash Flow Statements", concept:"Non-Cash Activities",
    q:"A company converts $5 million of bonds into common stock, with no cash involved. How is this handled?",
    opts:["Reported as a $5M financing outflow","Excluded from the cash flow statement, disclosed separately","Ignored entirely"], correct:1,
    exp:"With no cash involved, this is excluded from the statement but disclosed separately as significant." },
  { cat:"Cash Flow Statements", concept:"Non-Cash Activities",
    q:"Which of these is a non-cash investing/financing transaction?",
    opts:["Paying cash to purchase equipment","Exchanging one non-monetary asset directly for another","Collecting cash from a customer"], correct:1,
    exp:"A direct asset-for-asset exchange involves no cash." },

  { cat:"Cash Flow Statements", concept:"Direct vs. Indirect Method",
    q:"Does method choice affect total operating cash flow reported?",
    opts:["Yes, different totals","No — both arrive at the identical figure; only presentation differs","Only under US GAAP"], correct:1,
    exp:"Direct and indirect methods are two presentations of the same underlying operating cash flow." },
  { cat:"Cash Flow Statements", concept:"Direct vs. Indirect Method",
    q:"Which method is used by the vast majority of real companies?",
    opts:["Direct method","Indirect method","Companies are evenly split"], correct:1,
    exp:"Despite CFA Institute's advocacy for direct method, most companies use indirect in practice." },

  { cat:"Cash Flow Statements", concept:"IFRS vs. US GAAP",
    q:"Under US GAAP, how is interest paid classified?",
    opts:["Always operating","Always financing","Company's choice"], correct:0,
    exp:"US GAAP requires interest paid to be classified as operating." },
  { cat:"Cash Flow Statements", concept:"IFRS vs. US GAAP",
    q:"Under IFRS, how may dividends paid be classified?",
    opts:["Always investing","Either operating or financing, applied consistently","Never disclosed"], correct:1,
    exp:"IFRS permits a choice between operating or financing for dividends paid, applied consistently." },

  { cat:"Cash Flow Statements", concept:"Reading a Real Statement",
    q:"In an indirect-method statement, why is depreciation added back to net income?",
    opts:["It's a non-cash expense that reduced net income without using cash","It's a cash inflow itself","It must always be subtracted"], correct:0,
    exp:"Depreciation reduces net income but involves no cash outflow, so it's added back." },
  { cat:"Cash Flow Statements", concept:"Reading a Real Statement",
    q:"What is the general skeleton of an indirect-method cash flow statement?",
    opts:["Revenue minus all expenses","Net income, plus non-cash add-backs, adjusted for non-operating and working capital items","Cash balance worked backward to net income"], correct:1,
    exp:"This skeleton is the universal structure of indirect-method statements." },

  // ========== MODULE 05a: Inventories: Measurement Basics (3 concepts x 2 = 6) ==========
  { cat:"Inventories: Measurement Basics", concept:"Costs Included in Inventory",
    q:"Which cost is properly capitalized into inventory?",
    opts:["Direct labor (a cost of conversion)","Selling costs","Administrative overhead"], correct:0,
    exp:"Direct labor is a cost of conversion, properly capitalized into inventory." },
  { cat:"Inventories: Measurement Basics", concept:"Costs Included in Inventory",
    q:"Abnormal waste from a production malfunction should be:",
    opts:["Capitalized into inventory","Expensed immediately","Recorded to retained earnings"], correct:1,
    exp:"Abnormal waste is excluded from inventory and expensed as incurred." },

  { cat:"Inventories: Measurement Basics", concept:"The Four Cost Formulas",
    q:"Which cost formula is prohibited under IFRS but permitted under US GAAP?",
    opts:["FIFO","Weighted average","LIFO"], correct:2,
    exp:"LIFO is permitted only under US GAAP; IFRS prohibits it entirely." },
  { cat:"Inventories: Measurement Basics", concept:"The Four Cost Formulas",
    q:"In a period of rising costs, which method produces the highest ending inventory?",
    opts:["LIFO","FIFO","Weighted average, always"], correct:1,
    exp:"With rising costs, FIFO's ending inventory reflects the most recent, highest costs." },

  { cat:"Inventories: Measurement Basics", concept:"Periodic vs. Perpetual Systems",
    q:"For which cost formula(s) do periodic and perpetual systems generally produce identical results?",
    opts:["Specific identification and FIFO","Weighted average and LIFO","All methods always"], correct:0,
    exp:"Specific ID and FIFO are unaffected by timing; weighted average and LIFO can diverge." },
  { cat:"Inventories: Measurement Basics", concept:"Periodic vs. Perpetual Systems",
    q:"Under a periodic system, cost of sales is calculated as:",
    opts:["Beginning inventory + Purchases − Ending inventory","Ending inventory − Beginning inventory","Purchases alone"], correct:0,
    exp:"Periodic systems determine cost of sales at period-end using this formula." },

  // ========== MODULE 05b: Inventories: LIFO & Write-Downs (4 concepts x 2 = 8) ==========
  { cat:"Inventories: LIFO & Write-Downs", concept:"Rising Costs — LIFO vs. FIFO",
    q:"During rising costs, LIFO produces which effect on net income compared to FIFO?",
    opts:["Higher net income","Lower net income","Identical net income"], correct:1,
    exp:"LIFO's higher cost of sales during rising costs results in lower net income than FIFO." },
  { cat:"Inventories: LIFO & Write-Downs", concept:"Rising Costs — LIFO vs. FIFO",
    q:"Why might a company deliberately choose LIFO during rising costs?",
    opts:["To reduce income taxes paid, improving cash flow","LIFO simplifies accounting","To increase reported total assets"], correct:0,
    exp:"The tax savings from lower taxable income is the primary motivation for choosing LIFO." },

  { cat:"Inventories: LIFO & Write-Downs", concept:"LIFO Reserve & Conversion",
    q:"The LIFO reserve is defined as:",
    opts:["FIFO inventory minus LIFO inventory","LIFO inventory minus FIFO inventory","Total goods available for sale"], correct:0,
    exp:"LIFO reserve = FIFO inventory value minus LIFO inventory value." },
  { cat:"Inventories: LIFO & Write-Downs", concept:"LIFO Reserve & Conversion",
    q:"A company reports LIFO inventory of $60M with a LIFO reserve of $18M. What is FIFO inventory?",
    opts:["$42 million","$78 million","$60 million"], correct:1,
    exp:"FIFO inventory = LIFO inventory + LIFO reserve = 60+18 = $78 million." },

  { cat:"Inventories: LIFO & Write-Downs", concept:"LIFO Liquidation",
    q:"LIFO liquidation occurs when:",
    opts:["Units purchased exceed units sold","Units sold exceed units purchased, digging into older layers","A company switches to FIFO"], correct:1,
    exp:"When sales outpace purchases, older LIFO layers get liquidated." },
  { cat:"Inventories: LIFO & Write-Downs", concept:"LIFO Liquidation",
    q:"What disclosure signals a possible LIFO liquidation?",
    opts:["A decline in the LIFO reserve from the prior period","An increase in accounts payable","A rise in the tax rate"], correct:0,
    exp:"A declining LIFO reserve, alongside rising costs, signals liquidation of older layers." },

  { cat:"Inventories: LIFO & Write-Downs", concept:"Lower of Cost and NRV",
    q:"Net realisable value is defined as:",
    opts:["Estimated selling price minus costs to complete and sell","Original purchase price","Replacement cost only"], correct:0,
    exp:"NRV is estimated selling price less costs necessary to complete and sell." },
  { cat:"Inventories: LIFO & Write-Downs", concept:"Lower of Cost and NRV",
    q:"Inventory costing $50,000 has NRV of $38,000. What write-down is required?",
    opts:["$12,000","$50,000","$0"], correct:0,
    exp:"Write-down = Cost − NRV = 50,000 − 38,000 = $12,000." },

  // ========== MODULE 06: Long-Lived Assets (7 concepts x 2 = 14) ==========
  { cat:"Long-Lived Assets", concept:"Acquisition Costs",
    q:"Which cost should be capitalized as part of an asset's cost?",
    opts:["Delivery and installation to reach working condition","Ongoing repairs after use begins","General administrative overhead"], correct:0,
    exp:"Costs directly attributable to bringing an asset to working condition, like delivery and installation, are capitalized." },
  { cat:"Long-Lived Assets", concept:"Acquisition Costs",
    q:"Which model is required under US GAAP for long-lived assets?",
    opts:["The revaluation model","The cost model","The fair value model exclusively"], correct:1,
    exp:"US GAAP requires the cost model; the revaluation model is not permitted." },

  { cat:"Long-Lived Assets", concept:"Depreciation Methods",
    q:"An asset costs $50,000, has $5,000 residual value, and 9-year useful life. What is annual straight-line depreciation?",
    opts:["$5,000","$5,555","$4,500"], correct:0,
    exp:"Straight-line depreciation = (50,000−5,000)/9 = $5,000." },
  { cat:"Long-Lived Assets", concept:"Depreciation Methods",
    q:"Does the total depreciation over an asset's life depend on the method chosen?",
    opts:["Yes, accelerated methods produce more total depreciation","No — total is identical regardless of method; only timing differs","Only units-of-production affects the total"], correct:1,
    exp:"Every method depreciates the same total depreciable cost; only year-by-year timing differs." },

  { cat:"Long-Lived Assets", concept:"Effects on Statements & Ratios",
    q:"In early years, accelerated depreciation compared to straight-line produces:",
    opts:["Higher net income","Lower net income and operating margin","No difference"], correct:1,
    exp:"Accelerated methods front-load expense, lowering early-year net income and margin." },
  { cat:"Long-Lived Assets", concept:"Effects on Statements & Ratios",
    q:"Switching from straight-line to accelerated depreciation has what effect on operating cash flow?",
    opts:["Increases it, due to lower taxes paid","Decreases it","No effect, since depreciation is non-cash"], correct:0,
    exp:"Higher depreciation lowers taxable income and cash taxes paid, increasing operating cash flow." },

  { cat:"Long-Lived Assets", concept:"Amortization of Intangibles",
    q:"An intangible asset with an indefinite life, like goodwill, should be:",
    opts:["Amortized over 20 years by default","Not amortized, but tested for impairment annually","Expensed immediately"], correct:1,
    exp:"Indefinite-life intangibles are never amortized; they're tested for impairment periodically." },
  { cat:"Long-Lived Assets", concept:"Amortization of Intangibles",
    q:"A patent with a legal expiration date should be:",
    opts:["Amortized over its useful life","Never amortized","Immediately written off"], correct:0,
    exp:"A finite-life intangible like a patent is amortized over its useful life." },

  { cat:"Long-Lived Assets", concept:"The Revaluation Model",
    q:"The revaluation model is:",
    opts:["Required under both IFRS and US GAAP","Permitted under IFRS only","Prohibited under both"], correct:1,
    exp:"The revaluation model is IFRS-only; US GAAP requires the cost model." },
  { cat:"Long-Lived Assets", concept:"The Revaluation Model",
    q:"A first-time upward revaluation under IFRS is typically recognized:",
    opts:["Directly in net income","In OCI, as a revaluation surplus in equity","As a reduction in liabilities"], correct:1,
    exp:"First-time upward revaluations typically bypass net income, flowing through OCI into equity." },

  { cat:"Long-Lived Assets", concept:"Investment Property",
    q:"A building held purely to earn rental income should be classified as:",
    opts:["Property, plant, and equipment","Investment property","Inventory"], correct:1,
    exp:"Property held for rental income, separate from operations, is investment property." },
  { cat:"Long-Lived Assets", concept:"Investment Property",
    q:"Under the fair value model for investment property, unrealized changes are recognized:",
    opts:["Directly in net income","In OCI only","Never recognized"], correct:0,
    exp:"Under the fair value model, unrealized gains/losses flow directly through net income." },

  { cat:"Long-Lived Assets", concept:"Impairment & Derecognition",
    q:"An asset is impaired when:",
    opts:["Its carrying amount exceeds its recoverable amount","It has been fully depreciated","It generates positive cash flow"], correct:0,
    exp:"Impairment occurs when carrying amount exceeds what the asset can realistically recover." },
  { cat:"Long-Lived Assets", concept:"Impairment & Derecognition",
    q:"What is the effect of an impairment loss on operating cash flow?",
    opts:["No direct effect — it's non-cash","Falls by the full amount","Rises by the full amount"], correct:0,
    exp:"Like depreciation, impairment is a non-cash charge with no direct effect on operating cash flow." },

  // ========== MODULE 07: Income Taxes (7 concepts x 2 = 14) ==========
  { cat:"Income Taxes", concept:"Accounting Income vs. Taxable Income",
    q:"Which figure represents the amount currently owed to tax authorities?",
    opts:["Accounting income","Taxes payable","Income tax expense"], correct:1,
    exp:"Taxes payable is the actual current obligation, calculated from taxable income under tax law." },
  { cat:"Income Taxes", concept:"Accounting Income vs. Taxable Income",
    q:"Why do accounting income and taxable income genuinely differ?",
    opts:["Accounting and tax rules serve different purposes and were never designed to match","They are always identical","Tax income is always higher"], correct:0,
    exp:"Accounting standards and tax law serve different purposes, so they weren't designed to produce the same figure." },

  { cat:"Income Taxes", concept:"Tax Base of an Asset",
    q:"An asset's carrying amount is $80,000, and its tax base is $95,000. What does this create?",
    opts:["A deferred tax asset","A deferred tax liability","No deferred tax effect"], correct:0,
    exp:"When carrying amount is less than tax base for an asset, this creates a deferred tax asset." },
  { cat:"Income Taxes", concept:"Tax Base of an Asset",
    q:"Development costs of €3,000,000 are amortized €500,000 for accounting, with 25% tax amortization. What is the carrying amount?",
    opts:["€2,500,000","€2,250,000","€3,000,000"], correct:0,
    exp:"Carrying amount = 3,000,000 − 500,000 = €2,500,000." },

  { cat:"Income Taxes", concept:"Tax Base of a Liability",
    q:"A warranty liability has carrying amount $200,000 and tax base $0. What does this create?",
    opts:["A deferred tax asset","A deferred tax liability","No temporary difference"], correct:0,
    exp:"For a liability, carrying amount exceeding tax base creates a deferred tax asset." },
  { cat:"Income Taxes", concept:"Tax Base of a Liability",
    q:"The tax base of a liability equals:",
    opts:["Carrying amount minus future tax-deductible amounts","Carrying amount plus future deductions","Always zero"], correct:0,
    exp:"Tax base of a liability = carrying amount minus amounts deductible for tax in the future." },

  { cat:"Income Taxes", concept:"Temporary vs. Permanent Differences",
    q:"A difference that will never reverse is called:",
    opts:["A temporary difference","A permanent difference","A deferred tax asset"], correct:1,
    exp:"Permanent differences never reverse and create no deferred tax item." },
  { cat:"Income Taxes", concept:"Temporary vs. Permanent Differences",
    q:"Non-deductible donation expenses represent what type of difference?",
    opts:["Temporary, creating a DTA","Permanent — no deferred tax item is created","Temporary, creating a DTL"], correct:1,
    exp:"Since this gap never reverses, it's permanent and creates no deferred tax asset or liability." },

  { cat:"Income Taxes", concept:"The Valuation Allowance",
    q:"A valuation allowance reduces a deferred tax asset when:",
    opts:["It's more likely than not some or all won't be realized","The company has no tax losses","Tax rates increase"], correct:0,
    exp:"A valuation allowance is established when realization of the DTA is genuinely in doubt." },
  { cat:"Income Taxes", concept:"The Valuation Allowance",
    q:"Establishing a valuation allowance has what effect on reported income?",
    opts:["Decreases it","Increases it","No effect"], correct:0,
    exp:"Establishing a valuation allowance reduces both the deferred tax asset and reported income." },

  { cat:"Income Taxes", concept:"Changes in Tax Rates",
    q:"Deferred taxes should be measured using:",
    opts:["The rate in effect when the difference originated","The rate expected to apply when settled","Always the highest available rate"], correct:1,
    exp:"Deferred taxes are measured at the rate expected to apply when the asset is realized or liability settled." },
  { cat:"Income Taxes", concept:"Changes in Tax Rates",
    q:"A tax rate increase has what effect on existing deferred tax liabilities?",
    opts:["They increase, revalued at the new rate","They decrease","No effect"], correct:0,
    exp:"A rate increase requires revaluing existing DTLs upward using the new rate." },

  { cat:"Income Taxes", concept:"Taxes Charged Directly to Equity",
    q:"If an item creating a deferred tax liability is taken directly to equity, the related deferred tax should:",
    opts:["Flow through net income instead","Also be taken directly to equity, for consistency","Be ignored entirely"], correct:1,
    exp:"For consistency, deferred tax related to an equity item should also be recognized in equity." },
  { cat:"Income Taxes", concept:"Taxes Charged Directly to Equity",
    q:"Which is a classic example of an item whose deferred tax bypasses net income?",
    opts:["Revaluation of PP&E under IFRS","Ordinary sales revenue","Cost of goods sold"], correct:0,
    exp:"PP&E revaluation surplus goes to OCI/equity, and its associated deferred tax follows the same path." },

  // ========== MODULE 08: Non-Current Liabilities (6 concepts x 2 = 12) ==========
  { cat:"Non-Current Liabilities", concept:"Face Value, Coupon & Market Rate",
    q:"Which rate is locked in at bond issuance and never changes?",
    opts:["The market rate","The coupon rate","Both change continuously"], correct:1,
    exp:"The coupon rate is fixed at issuance, while the market rate reflects current conditions and moves continuously." },
  { cat:"Non-Current Liabilities", concept:"Face Value, Coupon & Market Rate",
    q:"If a bond's coupon rate is above the prevailing market rate at issuance, investors will:",
    opts:["Pay less than face value", "Pay more than face value, since the coupon is more attractive than the market requires", "Pay exactly face value"], correct:1,
    exp:"A coupon rate above market rate means investors pay a premium above face value for that attractive coupon." },

  { cat:"Non-Current Liabilities", concept:"Bonds Issued at Par, Premium & Discount",
    q:"A $1,000,000 face value bond with a 5% coupon is issued when the market rate is 6%. What is its approximate issue price (5-year bond)?",
    opts:["$957,876 (a discount)", "$1,042,000 (a premium)", "Exactly $1,000,000 (at par)"], correct:0,
    exp:"With coupon rate below market rate, the bond is issued at a discount, priced below face value." },
  { cat:"Non-Current Liabilities", concept:"Bonds Issued at Par, Premium & Discount",
    q:"A bond is issued at a premium when:",
    opts:["The coupon rate exceeds the market rate at issuance", "The coupon rate is below the market rate", "The coupon rate equals the market rate"], correct:0,
    exp:"A coupon rate above the market rate causes investors to pay a premium above face value." },

  { cat:"Non-Current Liabilities", concept:"The Effective Interest Method",
    q:"Under the effective interest method, interest expense is calculated as:",
    opts:["Carrying amount × market (effective) rate", "Face value × coupon rate, always", "A fixed dollar amount each period"], correct:0,
    exp:"Interest expense = carrying amount × the market rate in effect at issuance." },
  { cat:"Non-Current Liabilities", concept:"The Effective Interest Method",
    q:"For a discount bond, what happens to interest expense over the bond's life?",
    opts:["It increases each year, as the carrying amount grows toward face value", "It decreases each year", "It stays constant"], correct:0,
    exp:"As a discount bond's carrying amount rises toward face value, interest expense (carrying amount × rate) also rises." },

  { cat:"Non-Current Liabilities", concept:"Amortizing a Premium",
    q:"For a premium bond, how does interest expense compare to the cash coupon payment each period?",
    opts:["Interest expense is less than the cash coupon paid", "Interest expense is more than the cash coupon paid", "They are always identical"], correct:0,
    exp:"For a premium bond, the effective rate is below the coupon rate, so interest expense is less than the cash payment." },
  { cat:"Non-Current Liabilities", concept:"Amortizing a Premium",
    q:"As a premium bond's carrying amount is amortized over its life, it moves toward:",
    opts:["Face value", "Zero", "The original issue premium amount"], correct:0,
    exp:"Both premium and discount bonds converge to face value by maturity, as the premium or discount is amortized away." },

  { cat:"Non-Current Liabilities", concept:"The Fair Value Option",
    q:"Under the fair value option, a decrease in a liability's fair value is recognized as:",
    opts:["Income, since the company now owes less in economic terms", "A direct reduction to equity only", "It is never recognized"], correct:0,
    exp:"A decrease in fair value of a liability reduces the economic obligation, recognized as income under the fair value option." },
  { cat:"Non-Current Liabilities", concept:"The Fair Value Option",
    q:"The fair value option for financial liabilities is:",
    opts:["Mandatory for all liabilities", "An elective alternative to amortized cost, under certain conditions", "Prohibited under both IFRS and US GAAP"], correct:1,
    exp:"The fair value option is an elective alternative companies may choose under specific conditions, not a default requirement." },

  { cat:"Non-Current Liabilities", concept:"Derecognition of Debt",
    q:"A company pays $4.8 million cash to extinguish debt with a $5 million carrying amount. What is the effect?",
    opts:["A $200,000 gain on extinguishment", "A $200,000 loss on extinguishment", "No gain or loss"], correct:0,
    exp:"Paying less cash ($4.8M) than the carrying amount ($5M) to extinguish debt produces a $200,000 gain." },
  { cat:"Non-Current Liabilities", concept:"Derecognition of Debt",
    q:"When is debt derecognized from the balance sheet?",
    opts:["When the obligation is extinguished — paid off, cancelled, or expired", "Only at the original maturity date", "Debt is never derecognized"], correct:0,
    exp:"Debt is derecognized when the company's obligation is discharged, cancelled, or expires — not necessarily only at maturity." },

  // ========== MODULE 09: Applications of FSA (7 concepts x 2 = 14) ==========
  { cat:"Applications of FSA", concept:"Evaluating Past Performance",
    q:"Why is understanding WHY a company's performance occurred important, not just the resulting numbers?",
    opts:["It has no real analytical value", "Understanding the underlying strategic choices makes forward-looking forecasts genuinely well-grounded", "Only the numbers themselves matter for forecasting"], correct:1,
    exp:"Grasping the strategic drivers behind past performance is what makes forecasts more than a naive extrapolation." },
  { cat:"Applications of FSA", concept:"Evaluating Past Performance",
    q:"Evaluating past performance primarily involves analyzing:",
    opts:["Trends in profitability, efficiency, and the drivers behind them", "Only the current year's single-period numbers", "Only stock price movements"], correct:0,
    exp:"Evaluating past performance means examining trends and their underlying causes across multiple periods." },

  { cat:"Applications of FSA", concept:"Projecting Future Performance",
    q:"Why might operating margin be a more useful metric than net margin for projecting core business trends?",
    opts:["Operating margin reflects the core business more purely, while net margin is muddied by financing and tax decisions", "Net margin is always higher", "They measure identical things"], correct:0,
    exp:"Operating margin isolates core operating performance, unaffected by financing and tax choices that can shift independently." },
  { cat:"Applications of FSA", concept:"Projecting Future Performance",
    q:"A top-down revenue forecast typically starts with:",
    opts:["Industry or macroeconomic growth estimates, then narrows to the company", "Individual product-level unit sales only", "Last year's net income alone"], correct:0,
    exp:"Top-down forecasting starts broad (industry/macro trends) and narrows down to the specific company." },

  { cat:"Applications of FSA", concept:"Assessing Credit Risk",
    q:"Company 1 has higher debt relative to EBITDA and lower interest coverage than Company 2. Which is likely viewed as higher credit risk?",
    opts:["Company 1", "Company 2", "Both are identical risk"], correct:0,
    exp:"Higher leverage relative to earnings and weaker interest coverage both point toward higher credit risk." },
  { cat:"Applications of FSA", concept:"Assessing Credit Risk",
    q:"Credit rating frameworks like Moody's typically weigh which factors?",
    opts:["Leverage, coverage ratios, and cash flow stability", "Only the company's stock price", "Only the CEO's personal reputation"], correct:0,
    exp:"Credit assessment frameworks focus on leverage, interest coverage, and cash flow stability, among other financial factors." },

  { cat:"Applications of FSA", concept:"Screening for Equity Investments",
    q:"A quantitative equity screen applies:",
    opts:["A set of financial criteria to systematically narrow down a universe of stocks", "A single analyst's subjective judgment only", "Random stock selection"], correct:0,
    exp:"Screening applies systematic financial criteria across a stock universe to identify candidates meeting specific thresholds." },
  { cat:"Applications of FSA", concept:"Screening for Equity Investments",
    q:"Why might independent screening criteria pass fewer stocks than each criterion's pass rate alone would suggest?",
    opts:["Independent criteria compound, multiplying together to shrink the passing set", "All screens always pass the same stocks", "Screening criteria have no effect on the results"], correct:0,
    exp:"When criteria are independent, their pass probabilities multiply, often producing a smaller final set than any single criterion alone." },

  { cat:"Applications of FSA", concept:"Adjustments — Framework & Inventory",
    q:"To fairly compare a LIFO company with a FIFO company, an analyst should:",
    opts:["Add the LIFO reserve back to restate LIFO inventory onto a FIFO-equivalent basis", "Ignore inventory entirely", "Assume both companies report identically already"], correct:0,
    exp:"Adding back the LIFO reserve puts a LIFO company's figures on a FIFO-equivalent basis for fair comparison." },
  { cat:"Applications of FSA", concept:"Adjustments — Framework & Inventory",
    q:"What is the general purpose of analyst adjustments to reported financial statements?",
    opts:["To remove the effects of differing accounting choices, enabling fairer comparison across companies", "To make all companies look equally profitable regardless of true performance", "Adjustments are purely cosmetic with no analytical purpose"], correct:0,
    exp:"Analyst adjustments aim to neutralize differing accounting policy choices, enabling genuinely comparable analysis." },

  { cat:"Applications of FSA", concept:"Adjustments Related to PP&E",
    q:"Company A's accumulated depreciation is 80% of gross PP&E; Company B's is 20%. What does this suggest?",
    opts:["Company A has a much older, more depreciated asset base than Company B", "Company A has newer assets than Company B", "The two companies have identical asset ages"], correct:0,
    exp:"A higher accumulated depreciation ratio (80% vs 20%) indicates a substantially older, more depreciated asset base." },
  { cat:"Applications of FSA", concept:"Adjustments Related to PP&E",
    q:"Why might an analyst adjust reported PP&E figures when comparing companies using different depreciation methods?",
    opts:["To neutralize the effect of the depreciation method choice on comparability", "Depreciation method never affects comparability", "PP&E adjustments are never necessary"], correct:0,
    exp:"Different depreciation method choices can distort direct comparisons, so analysts often adjust to a common basis." },

  { cat:"Applications of FSA", concept:"Adjustments Related to Goodwill",
    q:"Company X grew partly through acquisitions (recording goodwill), while Company Y grew organically with similar underlying economics. How does this affect their ROA comparison?",
    opts:["Company X's larger recorded asset base (including goodwill) lowers its ROA relative to Company Y, despite similar true performance", "Both companies will show identical ROA", "Goodwill has no effect on ROA comparisons"], correct:0,
    exp:"Company X's goodwill inflates its asset base without proportionally inflating income, distorting ROA versus a comparably-performing organic grower." },
  { cat:"Applications of FSA", concept:"Adjustments Related to Goodwill",
    q:"Why is goodwill often excluded or adjusted for in analyst comparisons across companies?",
    opts:["Goodwill largely reflects acquisition premiums rather than operating assets, distorting cross-company comparisons", "Goodwill is identical in economic meaning to cash", "Goodwill adjustments are purely arbitrary with no rationale"], correct:0,
    exp:"Since goodwill reflects acquisition history rather than operating assets, excluding it helps make comparisons more apples-to-apples." },
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
   Module: flashcards
   ============================================================ */
(function(){
  try {
// ============================================================
// Flashcards — 136 cards, 2 per concept, across all 9 FSA modules
// Self-assessment feeds the shared diagnostics system
// ============================================================

const FLASHCARDS = [
  // ===== FSA Foundations =====
  { cat:"FSA Foundations", concept:"What Is Financial Reporting?",
    front:"Why do financial reporting standards exist?", back:"To create enough consistency that a reported number means roughly the same thing across different companies, making comparison meaningful." },
  { cat:"FSA Foundations", concept:"What Is Financial Reporting?",
    front:"Who are the primary users financial statements are designed to serve?", back:"Investors, lenders, and other resource providers making decisions about whether to commit capital to the entity." },

  { cat:"FSA Foundations", concept:"The Accounting Equation",
    front:"State the accounting equation.", back:"Assets = Liabilities + Equity." },
  { cat:"FSA Foundations", concept:"The Accounting Equation",
    front:"Why must the accounting equation always balance after every transaction?", back:"Double-entry bookkeeping keeps both sides equal by construction — every transaction affects the equation in an offsetting way." },

  { cat:"FSA Foundations", concept:"The Four Statements — A Bird's Eye View",
    front:"Which financial statement is a snapshot at a single point in time?", back:"The balance sheet — unlike the income statement and cash flow statement, which cover a period of time." },
  { cat:"FSA Foundations", concept:"The Four Statements — A Bird's Eye View",
    front:"Which statement isolates actual cash movement, unaffected by accounting estimates?", back:"The cash flow statement." },

  { cat:"FSA Foundations", concept:"Accrual vs. Cash Basis",
    front:"Under accrual accounting, when is revenue recognized?", back:"When it is earned — goods delivered or services performed — regardless of when cash is actually received." },
  { cat:"FSA Foundations", concept:"Accrual vs. Cash Basis",
    front:"Why can a company be profitable on paper while genuinely short on cash?", back:"Accrual accounting recognizes revenue before cash is collected, so uncollected credit sales can boost reported profit without generating actual cash." },

  { cat:"FSA Foundations", concept:"Double-Entry Bookkeeping",
    front:"How many accounts does every transaction affect, at minimum, under double-entry bookkeeping?", back:"Two — this is exactly what keeps the accounting equation balanced." },
  { cat:"FSA Foundations", concept:"Double-Entry Bookkeeping",
    front:"What does a debit do to an asset account? To a liability account?", back:"A debit increases an asset account, but decreases a liability account." },

  { cat:"FSA Foundations", concept:"Assets, Liabilities & Equity",
    front:"What does a company record when it delivers services on credit?", back:"An increase in accounts receivable — an asset reflecting its right to collect cash later." },
  { cat:"FSA Foundations", concept:"Assets, Liabilities & Equity",
    front:"Is equity the same thing as how much cash a company holds?", back:"No — equity is a residual claim (Assets minus Liabilities); a company can be cash-rich yet have low equity if liabilities are large." },

  { cat:"FSA Foundations", concept:"Revenues, Expenses & Matching",
    front:"State the matching principle.", back:"Expenses are recognized in the same period as the revenue they helped generate." },
  { cat:"FSA Foundations", concept:"Revenues, Expenses & Matching",
    front:"Under the matching principle, how should a machine's cost be treated if it helps generate revenue for 10 years?", back:"Spread out ('matched') as an expense across the years it helps generate revenue — the basis of depreciation." },

  // ===== Introduction to Financial Reporting =====
  { cat:"Introduction to Financial Reporting", concept:"Standard-Setters vs. Regulators",
    front:"What's the difference between a standard-setter and a regulator?", back:"A standard-setter (like the IASB) writes accounting rules; a regulator (like the SEC) has the legal power to enforce them." },
  { cat:"Introduction to Financial Reporting", concept:"Standard-Setters vs. Regulators",
    front:"Which body does the SEC recognize as the authoritative source of US GAAP?", back:"The FASB (Financial Accounting Standards Board)." },

  { cat:"Introduction to Financial Reporting", concept:"The Objective of Financial Reporting",
    front:"What is the IASB Conceptual Framework's central objective for financial reporting?", back:"To provide financial information useful to current and potential resource providers (investors, lenders) in making decisions." },
  { cat:"Introduction to Financial Reporting", concept:"The Objective of Financial Reporting",
    front:"What three things do users need to know about a company, per the framework?", back:"Its financial position, its financial performance, and its cash position." },

  { cat:"Introduction to Financial Reporting", concept:"Relevance & Faithful Representation",
    front:"What are the two fundamental qualitative characteristics of useful financial information?", back:"Relevance (could it affect a decision?) and faithful representation (is it complete, neutral, and free from error?)." },
  { cat:"Introduction to Financial Reporting", concept:"Relevance & Faithful Representation",
    front:"What is materiality?", back:"Information is material if omitting or misstating it could influence a user's decisions." },

  { cat:"Introduction to Financial Reporting", concept:"Enhancing Characteristics & Constraints",
    front:"Name the four enhancing qualitative characteristics.", back:"Comparability, verifiability, timeliness, and understandability." },
  { cat:"Introduction to Financial Reporting", concept:"Enhancing Characteristics & Constraints",
    front:"What is the pervasive constraint on useful financial reporting?", back:"Cost — the benefit of disclosure should ideally exceed the cost of providing and using it." },

  { cat:"Introduction to Financial Reporting", concept:"The Elements of Financial Statements",
    front:"Which three elements measure financial position? Which two measure performance?", back:"Assets, liabilities, and equity measure position; income and expenses measure performance." },
  { cat:"Introduction to Financial Reporting", concept:"The Elements of Financial Statements",
    front:"What's the difference between revenue and a gain?", back:"Revenue comes from ordinary operating activities; a gain comes from non-ordinary activities (like selling surplus equipment) — both are types of income." },

  { cat:"Introduction to Financial Reporting", concept:"Accrual Accounting & Going Concern",
    front:"What does the 'going concern' assumption mean?", back:"Financial statements assume the company will continue operating for the foreseeable future, not imminently liquidate." },
  { cat:"Introduction to Financial Reporting", concept:"Accrual Accounting & Going Concern",
    front:"Why does going concern genuinely change how assets are valued?", back:"If liquidation is expected instead, assets are often valued lower, reflecting a rushed, forced sale rather than a normal sales cycle." },

  { cat:"Introduction to Financial Reporting", concept:"Bases of Measurement",
    front:"What's the difference between historical cost and fair value?", back:"Historical cost is what was originally paid; fair value is the price achievable in an orderly market transaction today." },
  { cat:"Introduction to Financial Reporting", concept:"Bases of Measurement",
    front:"What is 'current cost'?", back:"The cost to buy the same or an equivalent asset today — also called replacement cost." },

  // ===== Income Statements =====
  { cat:"Income Statements", concept:"What the Income Statement Reports",
    front:"What other names is the income statement known by?", back:"Statement of operations, statement of earnings, and P&L (profit and loss) statement." },
  { cat:"Income Statements", concept:"What the Income Statement Reports",
    front:"Does the income statement cover a snapshot or a period of time?", back:"A period of time (a quarter, a year) — unlike the balance sheet's single-instant snapshot." },

  { cat:"Income Statements", concept:"The Five-Step Revenue Model",
    front:"What is Step 1 of the five-step revenue recognition model?", back:"Identify the contract(s) with a customer." },
  { cat:"Income Statements", concept:"The Five-Step Revenue Model",
    front:"For a performance obligation satisfied over time, how is progress measured?", back:"Often as costs incurred divided by total expected costs (an input method), then applied to the total contract price." },

  { cat:"Income Statements", concept:"Principal vs. Agent",
    front:"What's the difference between a principal and an agent in revenue reporting?", back:"A principal bears risk and controls pricing, reporting revenue gross (the full amount); an agent reports only its commission, net." },
  { cat:"Income Statements", concept:"Principal vs. Agent",
    front:"A marketplace earns 10% commission on $2,000 of orders without bearing inventory risk. How much revenue does it report?", back:"$200 (its commission only) — since it's acting as an agent, not a principal." },

  { cat:"Income Statements", concept:"Doubtful Accounts & Warranties",
    front:"When should estimated uncollectible accounts be recognized as an expense?", back:"In the same period as the related revenue, as an estimate — not when a customer actually defaults." },
  { cat:"Income Statements", concept:"Doubtful Accounts & Warranties",
    front:"How should warranty expenses be handled under the matching principle?", back:"Estimated and recognized at the time of sale, then trued up against actual experience over time." },

  { cat:"Income Statements", concept:"Depreciation & Amortization",
    front:"Give the straight-line depreciation formula.", back:"Annual depreciation = (Cost − Residual value) / Useful life." },
  { cat:"Income Statements", concept:"Depreciation & Amortization",
    front:"Is the revaluation model for PP&E permitted under US GAAP?", back:"No — it's IFRS-only; US GAAP requires the cost model." },

  { cat:"Income Statements", concept:"Operating vs. Non-Operating",
    front:"For a typical manufacturer, how is interest expense classified?", back:"Non-operating — it relates to financing decisions, not core operations." },
  { cat:"Income Statements", concept:"Operating vs. Non-Operating",
    front:"For a bank, how is interest income classified?", back:"Operating — lending is the bank's core business." },

  { cat:"Income Statements", concept:"Common-Size Analysis",
    front:"What does common-size analysis of the income statement express each line item as?", back:"A percentage of revenue." },
  { cat:"Income Statements", concept:"Common-Size Analysis",
    front:"Why is common-size analysis useful for comparing companies of different sizes?", back:"It removes the effect of company size entirely by standardizing every line to a percentage of revenue." },

  { cat:"Income Statements", concept:"Comprehensive Income",
    front:"Give the comprehensive income formula.", back:"Comprehensive income = Net income + Other comprehensive income (OCI)." },
  { cat:"Income Statements", concept:"Comprehensive Income",
    front:"Name a common type of other comprehensive income.", back:"Foreign currency translation adjustments (also: unrealized gains/losses on certain securities and hedges, and pension plan adjustments)." },

  // ===== Balance Sheets =====
  { cat:"Balance Sheets", concept:"What the Balance Sheet Reports",
    front:"What is the balance sheet formally called under IFRS?", back:"The statement of financial position." },
  { cat:"Balance Sheets", concept:"What the Balance Sheet Reports",
    front:"Why isn't balance sheet equity a reliable measure of market value?", back:"It mixes measurement bases, reflects only one past date, and excludes unrecorded value drivers like reputation or management skill." },

  { cat:"Balance Sheets", concept:"Current vs. Non-Current",
    front:"What's the rule for classifying an asset as 'current'?", back:"Expected to be sold, used, or converted to cash within one year or one operating cycle, whichever is greater." },
  { cat:"Balance Sheets", concept:"Current vs. Non-Current",
    front:"Give the working capital formula.", back:"Working Capital = Current Assets − Current Liabilities." },

  { cat:"Balance Sheets", concept:"Liquidity-Based Presentation",
    front:"What is a liquidity-based balance sheet presentation?", back:"Assets and liabilities are listed in order of liquidity, rather than split into current/non-current subtotals." },
  { cat:"Balance Sheets", concept:"Liquidity-Based Presentation",
    front:"What type of company commonly uses liquidity-based presentation?", back:"Banks — where the current/non-current distinction is less meaningful than ordering by liquidity." },

  { cat:"Balance Sheets", concept:"Current Assets",
    front:"What maturity cutoff defines a cash equivalent?", back:"An original maturity of three months or less." },
  { cat:"Balance Sheets", concept:"Current Assets",
    front:"Name the four required current-asset categories, if material.", back:"Cash and equivalents, trade and other receivables, inventories, and financial assets with short maturities." },

  { cat:"Balance Sheets", concept:"Current Liabilities",
    front:"What are trade payables?", back:"Unpaid amounts owed to vendors for purchases on credit — the mirror image of another company's trade receivables." },
  { cat:"Balance Sheets", concept:"Current Liabilities",
    front:"What is deferred (unearned) revenue?", back:"Cash already received for goods or services not yet delivered — a liability, recognized as revenue only as delivered." },

  { cat:"Balance Sheets", concept:"Components of Equity",
    front:"Name the six typical components of shareholders' equity.", back:"Contributed capital, preferred shares, treasury shares, retained earnings, accumulated OCI, and non-controlling interest." },
  { cat:"Balance Sheets", concept:"Components of Equity",
    front:"What effect do treasury shares have on total equity?", back:"They decrease total equity by the repurchase cost." },

  // ===== Cash Flow Statements =====
  { cat:"Cash Flow Statements", concept:"Why the Cash Flow Statement Exists",
    front:"Why can a company be profitable but still run low on cash?", back:"Accrual accounting recognizes revenue before it's collected — a company can report strong profit while genuinely waiting on cash from customers." },
  { cat:"Cash Flow Statements", concept:"Why the Cash Flow Statement Exists",
    front:"Which source of cash can continue indefinitely — operating cash, asset sales, or new borrowing?", back:"Operating cash generation — asset sales are limited by what's left to sell, and borrowing depends on lender confidence." },

  { cat:"Cash Flow Statements", concept:"Operating, Investing & Financing",
    front:"Give an example of an investing activity.", back:"Purchasing or selling long-term assets like equipment, property, or investments in other companies." },
  { cat:"Cash Flow Statements", concept:"Operating, Investing & Financing",
    front:"Why is stretching out payment to suppliers classified as operating, not financing, despite being a form of borrowing?", back:"It's the accounts payable balance itself providing the 'financing,' not a formal debt instrument." },

  { cat:"Cash Flow Statements", concept:"Non-Cash Activities",
    front:"What is a non-cash investing/financing transaction?", back:"A transaction with no cash inflow or outflow at all — like converting bonds directly into stock, or swapping one asset for another." },
  { cat:"Cash Flow Statements", concept:"Non-Cash Activities",
    front:"Where are significant non-cash transactions disclosed, since they're excluded from the cash flow statement itself?", back:"In a separate note or supplementary schedule alongside the cash flow statement." },

  { cat:"Cash Flow Statements", concept:"Direct vs. Indirect Method",
    front:"Does the direct or indirect method change total operating cash flow?", back:"Neither — both arrive at the identical figure; only the presentation of the operating section differs." },
  { cat:"Cash Flow Statements", concept:"Direct vs. Indirect Method",
    front:"Which method starts with net income and adjusts backward?", back:"The indirect method — the vast majority of real companies use it, despite CFA Institute's preference for the direct method." },

  { cat:"Cash Flow Statements", concept:"IFRS vs. US GAAP",
    front:"Under US GAAP, how is interest paid always classified?", back:"As an operating activity — no discretion is permitted." },
  { cat:"Cash Flow Statements", concept:"IFRS vs. US GAAP",
    front:"Under IFRS, how may dividends paid be classified?", back:"Either operating or financing, at the company's choice, applied consistently." },

  { cat:"Cash Flow Statements", concept:"Reading a Real Statement",
    front:"Why is depreciation added back to net income in an indirect-method statement?", back:"It's a non-cash expense that reduced net income without using any actual cash." },
  { cat:"Cash Flow Statements", concept:"Reading a Real Statement",
    front:"What's the universal skeleton of an indirect-method cash flow statement?", back:"Start with net income, add back non-cash charges, adjust for non-operating items, then adjust for working capital changes." },

  // ===== Inventories: Measurement Basics =====
  { cat:"Inventories: Measurement Basics", concept:"Costs Included in Inventory",
    front:"What costs are capitalized into inventory?", back:"Costs of purchase, costs of conversion (direct labor, overhead), and other costs bringing inventory to its present location and condition." },
  { cat:"Inventories: Measurement Basics", concept:"Costs Included in Inventory",
    front:"How should abnormal waste from production be treated?", back:"Expensed immediately, not capitalized into inventory." },

  { cat:"Inventories: Measurement Basics", concept:"The Four Cost Formulas",
    front:"Which inventory cost formula is prohibited under IFRS?", back:"LIFO — permitted only under US GAAP." },
  { cat:"Inventories: Measurement Basics", concept:"The Four Cost Formulas",
    front:"In a period of rising costs, which method produces the highest ending inventory value?", back:"FIFO — its ending inventory reflects the most recently acquired (highest) costs." },

  { cat:"Inventories: Measurement Basics", concept:"Periodic vs. Perpetual Systems",
    front:"For which cost formulas do periodic and perpetual systems produce identical results?", back:"Specific identification and FIFO." },
  { cat:"Inventories: Measurement Basics", concept:"Periodic vs. Perpetual Systems",
    front:"Give the periodic cost of sales formula.", back:"Cost of sales = Beginning inventory + Purchases − Ending inventory." },

  // ===== Inventories: LIFO & Write-Downs =====
  { cat:"Inventories: LIFO & Write-Downs", concept:"Rising Costs — LIFO vs. FIFO",
    front:"During rising costs, does LIFO produce higher or lower net income than FIFO?", back:"Lower — LIFO's higher cost of sales results in lower gross profit and net income." },
  { cat:"Inventories: LIFO & Write-Downs", concept:"Rising Costs — LIFO vs. FIFO",
    front:"Why might a company deliberately choose LIFO during rising costs?", back:"Tax savings — lower reported taxable income means paying less tax in cash today, a genuine economic benefit." },

  { cat:"Inventories: LIFO & Write-Downs", concept:"LIFO Reserve & Conversion",
    front:"Give the LIFO reserve formula.", back:"LIFO Reserve = FIFO Inventory − LIFO Inventory." },
  { cat:"Inventories: LIFO & Write-Downs", concept:"LIFO Reserve & Conversion",
    front:"How do you convert LIFO cost of sales to a FIFO basis?", back:"Subtract the increase in the LIFO reserve during the period (or add back a decrease)." },

  { cat:"Inventories: LIFO & Write-Downs", concept:"LIFO Liquidation",
    front:"What causes a LIFO liquidation?", back:"Units sold exceed units purchased or produced, digging into older, lower-cost inventory layers." },
  { cat:"Inventories: LIFO & Write-Downs", concept:"LIFO Liquidation",
    front:"What signal should analysts watch for to detect a LIFO liquidation?", back:"A declining LIFO reserve from the prior period, especially alongside historically rising costs." },

  { cat:"Inventories: LIFO & Write-Downs", concept:"Lower of Cost and NRV",
    front:"Give the net realisable value formula.", back:"NRV = Estimated selling price − Estimated costs to complete and sell." },
  { cat:"Inventories: LIFO & Write-Downs", concept:"Lower of Cost and NRV",
    front:"Can an inventory write-down be reversed under US GAAP?", back:"No — reversal is prohibited under US GAAP, unlike IFRS, which permits limited reversal." },

  // ===== Long-Lived Assets =====
  { cat:"Long-Lived Assets", concept:"Acquisition Costs",
    front:"What costs are capitalized into a long-lived asset's cost?", back:"Purchase price plus costs directly attributable to bringing the asset to its working condition — delivery, installation, testing." },
  { cat:"Long-Lived Assets", concept:"Acquisition Costs",
    front:"Which model is required under US GAAP for long-lived assets?", back:"The cost model — the revaluation model is not permitted." },

  { cat:"Long-Lived Assets", concept:"Depreciation Methods",
    front:"Give the double-declining balance depreciation rate formula.", back:"DDB rate = 2 × (1 / useful life)." },
  { cat:"Long-Lived Assets", concept:"Depreciation Methods",
    front:"Does the depreciation method chosen affect total depreciation over an asset's full life?", back:"No — only the year-by-year timing differs; the total is identical regardless of method." },

  { cat:"Long-Lived Assets", concept:"Effects on Statements & Ratios",
    front:"How does accelerated depreciation affect early-year net income compared to straight-line?", back:"Lower — accelerated methods front-load depreciation expense into earlier years." },
  { cat:"Long-Lived Assets", concept:"Effects on Statements & Ratios",
    front:"Why does switching to accelerated depreciation increase operating cash flow?", back:"Higher depreciation expense lowers taxable income and actual cash taxes paid, even though depreciation itself is non-cash." },

  { cat:"Long-Lived Assets", concept:"Amortization of Intangibles",
    front:"How is goodwill (an indefinite-life intangible) accounted for?", back:"Never amortized — instead, tested for impairment at least annually." },
  { cat:"Long-Lived Assets", concept:"Amortization of Intangibles",
    front:"How is a patent with a legal expiration date accounted for?", back:"Amortized over its useful life, like depreciation for tangible assets." },

  { cat:"Long-Lived Assets", concept:"The Revaluation Model",
    front:"Is the revaluation model permitted under US GAAP?", back:"No — it's IFRS-only." },
  { cat:"Long-Lived Assets", concept:"The Revaluation Model",
    front:"Where does a first-time upward revaluation typically get recognized?", back:"In other comprehensive income, as a revaluation surplus within equity — not net income." },

  { cat:"Long-Lived Assets", concept:"Investment Property",
    front:"What distinguishes investment property from ordinary PP&E?", back:"Purpose — investment property is held purely to earn rental income or for capital appreciation, not for use in operations." },
  { cat:"Long-Lived Assets", concept:"Investment Property",
    front:"Under the fair value model for investment property, how are unrealized gains recognized?", back:"Directly in net income — unlike ordinary PP&E revaluations, which bypass net income via OCI." },

  { cat:"Long-Lived Assets", concept:"Impairment & Derecognition",
    front:"When is an asset impaired?", back:"When its carrying amount exceeds its recoverable amount." },
  { cat:"Long-Lived Assets", concept:"Impairment & Derecognition",
    front:"Does an impairment loss affect operating cash flow?", back:"No direct effect — like depreciation, impairment is a non-cash charge." },

  // ===== Income Taxes =====
  { cat:"Income Taxes", concept:"Accounting Income vs. Taxable Income",
    front:"What's the difference between income tax expense and taxes payable?", back:"Income tax expense is reported on the income statement (current + deferred); taxes payable is the actual amount currently owed to authorities." },
  { cat:"Income Taxes", concept:"Accounting Income vs. Taxable Income",
    front:"Why do accounting income and taxable income genuinely differ?", back:"Accounting standards and tax law serve different purposes and were never designed to produce the same number." },

  { cat:"Income Taxes", concept:"Tax Base of an Asset",
    front:"What is the tax base of an asset?", back:"The amount that will be deductible for tax purposes in future periods, as the asset's economic benefits are realized." },
  { cat:"Income Taxes", concept:"Tax Base of an Asset",
    front:"For an asset, when does carrying amount exceeding tax base create a DTL vs. a DTA?", back:"Carrying > Tax base → Deferred Tax Liability. Carrying < Tax base → Deferred Tax Asset." },

  { cat:"Income Taxes", concept:"Tax Base of a Liability",
    front:"What is the tax base of a liability?", back:"Carrying amount minus any amount that will be deductible for tax purposes in the future." },
  { cat:"Income Taxes", concept:"Tax Base of a Liability",
    front:"For a liability, when does carrying amount exceeding tax base create a DTA vs. a DTL?", back:"Carrying > Tax base → Deferred Tax Asset (mirrored from the asset rule). Carrying < Tax base → Deferred Tax Liability." },

  { cat:"Income Taxes", concept:"Temporary vs. Permanent Differences",
    front:"What's the difference between a temporary and a permanent difference?", back:"Temporary differences reverse eventually and create a DTA/DTL; permanent differences never reverse and create no deferred tax item." },
  { cat:"Income Taxes", concept:"Temporary vs. Permanent Differences",
    front:"Give an example of a permanent difference.", back:"Non-deductible donation expenses — expensed for accounting, but never allowed as a tax deduction." },

  { cat:"Income Taxes", concept:"The Valuation Allowance",
    front:"When is a valuation allowance established against a deferred tax asset?", back:"When it's more likely than not that some or all of the DTA won't be realized, typically due to doubts about future taxable profit." },
  { cat:"Income Taxes", concept:"The Valuation Allowance",
    front:"What effect does establishing a valuation allowance have on reported income?", back:"It decreases reported income in the period it's established." },

  { cat:"Income Taxes", concept:"Changes in Tax Rates",
    front:"At what rate should deferred tax balances be measured?", back:"The tax rate expected to apply when the asset is realized or the liability is settled — not the rate when the difference originated." },
  { cat:"Income Taxes", concept:"Changes in Tax Rates",
    front:"How does a tax rate cut affect existing deferred tax liabilities?", back:"It reduces them, revalued at the new lower rate — a one-time boost to reported income in that period." },

  { cat:"Income Taxes", concept:"Taxes Charged Directly to Equity",
    front:"If an item bypasses net income and goes directly to equity, where should its related deferred tax go?", back:"Also directly to equity, for consistency — not through the income statement." },
  { cat:"Income Taxes", concept:"Taxes Charged Directly to Equity",
    front:"Give a classic example of a deferred tax that bypasses net income.", back:"The deferred tax liability related to a PP&E revaluation surplus under IFRS." },

  // ===== Non-Current Liabilities =====
  { cat:"Non-Current Liabilities", concept:"Face Value, Coupon & Market Rate",
    front:"What's the difference between a bond's coupon rate and market rate?", back:"The coupon rate is fixed at issuance and never changes; the market rate reflects current conditions and moves continuously." },
  { cat:"Non-Current Liabilities", concept:"Face Value, Coupon & Market Rate",
    front:"If a bond's coupon rate is above the market rate, will investors pay more or less than face value?", back:"More — a coupon above the market rate is attractive, so investors bid the price up above face value." },

  { cat:"Non-Current Liabilities", concept:"Bonds Issued at Par, Premium & Discount",
    front:"When is a bond issued at a discount?", back:"When its coupon rate is below the market rate at issuance." },
  { cat:"Non-Current Liabilities", concept:"Bonds Issued at Par, Premium & Discount",
    front:"When is a bond issued at a premium?", back:"When its coupon rate is above the market rate at issuance." },

  { cat:"Non-Current Liabilities", concept:"The Effective Interest Method",
    front:"Give the effective interest method formula for interest expense.", back:"Interest expense = Carrying amount × Market (effective) rate at issuance." },
  { cat:"Non-Current Liabilities", concept:"The Effective Interest Method",
    front:"For a discount bond, does interest expense rise or fall over the bond's life?", back:"It rises — as the carrying amount grows toward face value, interest expense (carrying amount × rate) grows too." },

  { cat:"Non-Current Liabilities", concept:"Amortizing a Premium",
    front:"For a premium bond, is interest expense more or less than the cash coupon paid each period?", back:"Less — the effective rate is below the coupon rate for a premium bond." },
  { cat:"Non-Current Liabilities", concept:"Amortizing a Premium",
    front:"As a premium (or discount) bond amortizes over its life, what value does its carrying amount converge to?", back:"Face value, by maturity." },

  { cat:"Non-Current Liabilities", concept:"The Fair Value Option",
    front:"Under the fair value option, how is a decrease in a liability's fair value recognized?", back:"As income — the company now owes less in economic terms." },
  { cat:"Non-Current Liabilities", concept:"The Fair Value Option",
    front:"Is the fair value option mandatory or elective?", back:"Elective — companies may choose it as an alternative to amortized cost under certain conditions." },

  { cat:"Non-Current Liabilities", concept:"Derecognition of Debt",
    front:"A company pays $4.8M cash to extinguish debt carried at $5M. What's the result?", back:"A $200,000 gain on extinguishment — paying less than the carrying amount produces a gain." },
  { cat:"Non-Current Liabilities", concept:"Derecognition of Debt",
    front:"When is debt derecognized from the balance sheet?", back:"When the obligation is discharged — paid off, cancelled, or expires — not necessarily only at the original maturity." },

  // ===== Applications of FSA =====
  { cat:"Applications of FSA", concept:"Evaluating Past Performance",
    front:"Why is understanding WHY performance happened important, not just the resulting numbers?", back:"Grasping the underlying strategic drivers is what makes a forward-looking forecast genuinely well-grounded, not a naive extrapolation." },
  { cat:"Applications of FSA", concept:"Evaluating Past Performance",
    front:"What does evaluating past performance primarily involve?", back:"Analyzing trends in profitability and efficiency, and the drivers behind them, across multiple periods." },

  { cat:"Applications of FSA", concept:"Projecting Future Performance",
    front:"Why is operating margin often more useful than net margin for projecting core trends?", back:"Operating margin reflects the core business more purely, while net margin is muddied by financing and tax decisions." },
  { cat:"Applications of FSA", concept:"Projecting Future Performance",
    front:"What does a top-down revenue forecast start with?", back:"Industry or macroeconomic growth estimates, then narrows down to the specific company." },

  { cat:"Applications of FSA", concept:"Assessing Credit Risk",
    front:"What financial factors do credit rating frameworks typically weigh?", back:"Leverage (debt relative to earnings), interest coverage ratios, and cash flow stability." },
  { cat:"Applications of FSA", concept:"Assessing Credit Risk",
    front:"Higher debt relative to EBITDA and lower interest coverage generally signal what?", back:"Higher credit risk — a weaker capacity to service debt obligations." },

  { cat:"Applications of FSA", concept:"Screening for Equity Investments",
    front:"What is a quantitative equity screen?", back:"A set of financial criteria applied systematically to narrow down a large universe of stocks to a smaller candidate set." },
  { cat:"Applications of FSA", concept:"Screening for Equity Investments",
    front:"Why can independent screening criteria pass fewer stocks than expected?", back:"Independent criteria's pass probabilities compound (multiply together), often shrinking the final passing set more than intuition suggests." },

  { cat:"Applications of FSA", concept:"Adjustments — Framework & Inventory",
    front:"How does an analyst make a LIFO company comparable to a FIFO company?", back:"Add the LIFO reserve back to restate LIFO inventory (and cost of sales) onto a FIFO-equivalent basis." },
  { cat:"Applications of FSA", concept:"Adjustments — Framework & Inventory",
    front:"What is the general purpose of analyst adjustments to reported financials?", back:"To remove the effect of differing accounting policy choices, enabling genuinely fair comparison across companies." },

  { cat:"Applications of FSA", concept:"Adjustments Related to PP&E",
    front:"What does a high accumulated-depreciation-to-gross-PP&E ratio suggest about a company's asset base?", back:"An older, more depreciated asset base, likely needing reinvestment sooner than a company with a lower ratio." },
  { cat:"Applications of FSA", concept:"Adjustments Related to PP&E",
    front:"Why might an analyst adjust PP&E figures across companies using different depreciation methods?", back:"To neutralize the effect of the method choice itself, isolating genuine differences in asset age and investment." },

  { cat:"Applications of FSA", concept:"Adjustments Related to Goodwill",
    front:"Why can an acquisitive company's ROA look weaker than an organically-grown competitor's, despite similar true performance?", back:"Its larger recorded asset base (inflated by goodwill from acquisitions) increases the ROA denominator without proportionally higher income." },
  { cat:"Applications of FSA", concept:"Adjustments Related to Goodwill",
    front:"Why is goodwill often excluded or adjusted for in cross-company comparisons?", back:"Goodwill reflects acquisition premiums rather than operating assets, distorting comparisons between acquisitive and organically-grown companies." },
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
   Module: fsa-foundations
   ============================================================ */
(function(){
  try {
// ============================================================
// FSA Foundations — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }
function fmtMoney(n){
  return '$' + Math.round(n).toLocaleString();
}

/* ============================================================
   02 — Accounting equation solver
   ============================================================ */
(function(){
  const assetsI = document.getElementById('aeAssets'), liabI = document.getElementById('aeLiabilities');
  const result = document.getElementById('aeResult');
  if (!assetsI) return;
  function render(){
    const assets = parseFloat(assetsI.value), liab = parseFloat(liabI.value);
    const equity = assets - liab;
    result.textContent = `Equity = ${fmtMoney(equity)}`;
  }
  [assetsI,liabI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   03 — Four statements tabs
   ============================================================ */
(function(){
  const tabs = document.getElementById('statementTabs');
  const display = document.getElementById('statementDisplay');
  if (!tabs) return;
  const data = {
    income: {
      title: "The Income Statement",
      subtitle: "Was the company profitable over this period?",
      body: "Reports revenue earned and expenses incurred over a stretch of time — a quarter, a year. Ends in net income (or loss): Revenue − Expenses. It's a movie of performance over a period, not a snapshot of a single moment."
    },
    balance: {
      title: "The Balance Sheet",
      subtitle: "What does the company own and owe, right now?",
      body: "A snapshot at one exact point in time — literally the close of business on the last day of the reporting period. Lists everything owned (assets), everything owed (liabilities), and what's left for owners (equity), obeying Assets = Liabilities + Equity exactly."
    },
    cashflow: {
      title: "The Cash Flow Statement",
      subtitle: "Where did the actual cash go?",
      body: "Strips away every accrual and estimate to show real cash moving in and out, split into three buckets: operating (core business), investing (buying/selling long-term assets), and financing (borrowing, repaying debt, issuing or buying back stock)."
    },
    equity: {
      title: "The Statement of Changes in Equity",
      subtitle: "Why did the owners' stake change?",
      body: "Reconciles the beginning and ending equity balance — net income earned (which adds to equity), dividends paid out (which reduce it), and any new stock issued or bought back. It's the bridge connecting the income statement to the balance sheet."
    }
  };
  function render(key){
    const d = data[key];
    display.innerHTML = `
      <div style="background:var(--paper-dim); border-radius:10px; padding:18px 20px; margin-top:12px;">
        <div style="font-family:var(--font-display); font-size:1.1rem; font-weight:700; color:var(--indigo-deep); margin-bottom:4px;">${d.title}</div>
        <div style="font-family:var(--font-mono); font-size:.78rem; color:var(--amber-deep); margin-bottom:10px; font-weight:700;">${d.subtitle}</div>
        <p style="margin:0; font-size:.9rem; line-height:1.6;">${d.body}</p>
      </div>
    `;
  }
  tabs.querySelectorAll('.test-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.test-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.stmt);
    });
  });
  render('income');
})();

/* ============================================================
   04 — Cash vs. accrual comparison
   ============================================================ */
(function(){
  const earnedI = document.getElementById('accrualEarned'), cashI = document.getElementById('accrualCash');
  const out = document.getElementById('accrualOut');
  if (!earnedI) return;
  function render(){
    const earned = parseFloat(earnedI.value), cash = parseFloat(cashI.value);
    out.innerHTML = `
      <div class="stat-readout"><div class="k">Cash-basis revenue</div><div class="v">${fmtMoney(cash)}</div></div>
      <div class="stat-readout"><div class="k">Accrual-basis revenue</div><div class="v">${fmtMoney(earned)}</div></div>
    `;
  }
  [earnedI,cashI].forEach(el => el.addEventListener('input', render));
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
const sectionIds = ['sec-why','sec-equation','sec-fourstatements','sec-accrual','sec-doubleentry','sec-ale','sec-revexp','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-fsa-foundations', String(pct)); } catch(e) {}
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
  { concept:"What Is Financial Reporting?",
    q: "Financial reporting standards exist primarily to:",
    opts: ["Make accounting more complicated for its own sake", "Create enough consistency that financial statements are comparable across companies", "Only satisfy tax authorities"], correct: 1,
    exp: "Standards ensure a reported number means roughly the same thing everywhere, making cross-company comparison meaningful." },
  { concept:"What Is Financial Reporting?",
    q: "Which of the following is NOT typically a user of a company's financial statements?",
    opts: ["Creditors deciding whether to lend money", "Investors deciding whether to buy shares", "Competitors' internal HR departments, for unrelated reasons"], correct: 2,
    exp: "Investors, creditors, employees, suppliers, and regulators are the core users; an unrelated party's internal HR department isn't a typical financial-statement user." },
  { concept:"What Is Financial Reporting?",
    q: "Why does an analyst need more than just knowledge of specific accounting rules?",
    opts: ["Rules alone don't help assess new transactions the standards don't specifically address", "Rules are irrelevant to analysis", "Analysts never need to read financial statements"], correct: 0,
    exp: "Understanding the underlying framework lets an analyst assess new or unusual transactions that specific rules may not directly cover." },

  { concept:"The Accounting Equation",
    q: "Give the accounting equation.",
    opts: ["Assets = Liabilities + Equity", "Assets = Liabilities − Equity", "Assets + Liabilities = Equity"], correct: 0,
    exp: "The fundamental accounting equation: Assets = Liabilities + Equity." },
  { concept:"The Accounting Equation",
    q: "A company has $750,000 in assets and $420,000 in liabilities. What is its equity?",
    opts: ["$1,170,000", "$330,000", "$420,000"], correct: 1,
    exp: "Equity = Assets − Liabilities = 750,000 − 420,000 = $330,000." },
  { concept:"The Accounting Equation",
    q: "Why must the accounting equation always balance after every transaction?",
    opts: ["It's just a convention with no real enforcement mechanism", "Every transaction affects the equation in a way that keeps both sides equal, by the mechanics of double-entry recording", "It only needs to balance at year-end"], correct: 1,
    exp: "Double-entry bookkeeping ensures every transaction keeps the equation balanced automatically, not just as a convention." },

  { concept:"The Four Statements — A Bird's Eye View",
    q: "Which financial statement is a snapshot at a single point in time, rather than a summary over a period?",
    opts: ["The income statement", "The balance sheet", "The cash flow statement"], correct: 1,
    exp: "The balance sheet reports the company's position at one exact moment — typically the last day of the reporting period." },
  { concept:"The Four Statements — A Bird's Eye View",
    q: "Which statement connects the income statement's net income to the balance sheet's equity?",
    opts: ["The cash flow statement", "The statement of changes in equity", "There is no such connection"], correct: 1,
    exp: "The statement of changes in equity reconciles beginning and ending equity, incorporating net income, dividends, and stock transactions." },
  { concept:"The Four Statements — A Bird's Eye View",
    q: "An analyst wants to see cash generated purely from core operations, unaffected by accounting estimates. Which statement should they check?",
    opts: ["The income statement", "The cash flow statement", "The statement of changes in equity"], correct: 1,
    exp: "The cash flow statement isolates actual cash movement, unaffected by the accruals and estimates in the income statement." },

  { concept:"Accrual vs. Cash Basis",
    q: "Under accrual accounting, when is revenue recognized?",
    opts: ["Only when cash is received", "When it is earned, regardless of when cash is received", "Only at the end of the fiscal year"], correct: 1,
    exp: "Accrual accounting recognizes revenue when earned, independent of the timing of cash receipt." },
  { concept:"Accrual vs. Cash Basis",
    q: "A company delivers $12,000 of goods on credit in November, with payment due in January. Under accrual accounting, when is this revenue recognized?",
    opts: ["November", "January", "Split evenly between both months"], correct: 0,
    exp: "Revenue is recognized in November, when the goods were delivered and revenue was earned — not when cash is collected in January." },
  { concept:"Accrual vs. Cash Basis",
    q: "Why can a company be profitable on paper while running short on cash?",
    opts: ["This situation is impossible under any accounting method", "Accrual accounting recognizes revenue before the cash is actually collected", "Profit and cash are always identical numbers"], correct: 1,
    exp: "Because accrual accounting records revenue when earned rather than when collected, a company can show a profit while still waiting on slow-paying customers." },

  { concept:"Double-Entry Bookkeeping",
    q: "In double-entry bookkeeping, how many accounts does a single transaction affect, at minimum?",
    opts: ["One", "Two", "Four"], correct: 1,
    exp: "Every transaction touches at least two accounts, which is exactly what keeps the accounting equation balanced." },
  { concept:"Double-Entry Bookkeeping",
    q: "A company buys $15,000 of equipment entirely financed by a bank loan. What is the effect on the accounting equation?",
    opts: ["Assets increase by $15,000, and liabilities increase by $15,000", "Assets increase by $15,000, and equity increases by $15,000", "Only assets are affected"], correct: 0,
    exp: "Equipment (an asset) increases by $15,000, financed entirely by a new loan (a liability) of $15,000 — the equation stays balanced." },
  { concept:"Double-Entry Bookkeeping",
    q: "A debit to an asset account:",
    opts: ["Increases the asset", "Decreases the asset", "Has no effect on the asset"], correct: 0,
    exp: "A debit increases asset and expense accounts, while decreasing liability, equity, and revenue accounts." },

  { concept:"Assets, Liabilities & Equity",
    q: "A company delivers services on credit. What does it record on its own books?",
    opts: ["An increase in accounts receivable (an asset)", "An increase in accounts payable (a liability)", "No entry until cash is collected"], correct: 0,
    exp: "The seller records accounts receivable — an asset reflecting its right to collect cash later." },
  { concept:"Assets, Liabilities & Equity",
    q: "Is equity the same thing as how much cash a company has?",
    opts: ["Yes, always", "No — equity is a residual claim, calculated only after subtracting all liabilities from assets", "Only for small companies"], correct: 1,
    exp: "Equity is Assets minus Liabilities — a company can be cash-rich yet have low or negative equity if its liabilities are large enough." },
  { concept:"Assets, Liabilities & Equity",
    q: "Which of these best fits the formal definition of a liability?",
    opts: ["A resource expected to provide future economic benefit", "A present obligation, arising from a past event, expected to require an outflow of resources to settle", "The residual claim after subtracting assets from liabilities"], correct: 1,
    exp: "A liability is a present obligation from a past event that will require giving up resources to settle." },

  { concept:"Revenues, Expenses & Matching",
    q: "According to the matching principle, when should an expense be recognized?",
    opts: ["In the same period as the revenue it helped generate", "Always in the period the cash was paid", "Only at the end of the fiscal year"], correct: 0,
    exp: "The matching principle pairs expenses with the revenue they helped produce, in the same reporting period." },
  { concept:"Revenues, Expenses & Matching",
    q: "A factory buys a $200,000 machine expected to help generate revenue for 10 years. Under the matching principle, how should its cost be treated?",
    opts: ["Expensed entirely in the year of purchase", "Spread out as an expense across the years it helps generate revenue", "Never expensed, since it's a physical asset"], correct: 1,
    exp: "The matching principle requires spreading the machine's cost across the periods it helps generate revenue — the logic behind depreciation." }
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
        const isCorrect = i === item.correct;
        if (isCorrect) score++;
        if (typeof cfaRecordAnswer === 'function' && item.concept){
          cfaRecordAnswer(item.concept, "FSA Foundations", isCorrect);
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

  } catch(e) { console.warn('[fsa-foundations] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: income-statements
   ============================================================ */
(function(){
  try {
// ============================================================
// Income Statements — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }
function fmtMoney(n){ return '$' + Math.round(n).toLocaleString(); }

/* ============================================================
   02 — Percentage-of-completion calculator
   ============================================================ */
(function(){
  const priceI = document.getElementById('pocPrice'), totalCostI = document.getElementById('pocTotalCost'), incurredI = document.getElementById('pocIncurred');
  const result = document.getElementById('pocResult');
  if (!priceI) return;
  function render(){
    const price = parseFloat(priceI.value), totalCost = parseFloat(totalCostI.value), incurred = parseFloat(incurredI.value);
    const progress = incurred / totalCost;
    const revenue = progress * price;
    result.textContent = `Progress = ${fmt(progress*100,1)}% → Revenue recognized = ${fmtMoney(revenue)}`;
  }
  [priceI,totalCostI,incurredI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   05 — Straight-line depreciation calculator
   ============================================================ */
(function(){
  const costI = document.getElementById('depCost'), residualI = document.getElementById('depResidual'), lifeI = document.getElementById('depLife');
  const result = document.getElementById('depResult');
  if (!costI) return;
  function render(){
    const cost = parseFloat(costI.value), residual = parseFloat(residualI.value), life = parseFloat(lifeI.value);
    const dep = (cost - residual) / life;
    result.textContent = `Annual depreciation = ${fmtMoney(dep)}`;
  }
  [costI,residualI,lifeI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   07 — Common-size comparator
   ============================================================ */
(function(){
  const revI = document.getElementById('csRevenue'), profitI = document.getElementById('csProfit');
  const result = document.getElementById('csResult');
  if (!revI) return;
  function render(){
    const rev = parseFloat(revI.value), profit = parseFloat(profitI.value);
    const margin = (profit/rev)*100;
    result.textContent = `Operating margin = ${fmt(margin,1)}%`;
  }
  [revI,profitI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   08 — OCI calculator
   ============================================================ */
(function(){
  const begI = document.getElementById('ociBeg'), niI = document.getElementById('ociNI'), divI = document.getElementById('ociDiv'), endI = document.getElementById('ociEnd');
  const result = document.getElementById('ociResult');
  if (!begI) return;
  function render(){
    const beg = parseFloat(begI.value), ni = parseFloat(niI.value), div = parseFloat(divI.value), end = parseFloat(endI.value);
    const expectedEnd = beg + ni - div;
    const oci = end - expectedEnd;
    result.textContent = `Other comprehensive income = ${fmtMoney(oci)}`;
  }
  [begI,niI,divI,endI].forEach(el => el.addEventListener('input', render));
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
const sectionIds = ['sec-overview','sec-fivestep','sec-principalagent','sec-doubtfulwarranty','sec-depreciation','sec-nonoperating','sec-commonsize','sec-comprehensive','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-income-statements', String(pct)); } catch(e) {}
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
  { concept:"What the Income Statement Reports",
    q: "The income statement is also commonly known by which other name?",
    opts: ["The statement of financial position", "The statement of operations", "The statement of cash flows"], correct: 1,
    exp: "Statement of operations, statement of earnings, and P&L statement are all alternate names for the income statement." },
  { concept:"What the Income Statement Reports",
    q: "Does the income statement report a snapshot at one point in time, or performance over a period?",
    opts: ["A snapshot at one point in time", "Performance over a period of time", "Both equally"], correct: 1,
    exp: "The income statement covers a period (a quarter, a year) — unlike the balance sheet, which is a snapshot." },
  { concept:"What the Income Statement Reports",
    q: "Why do fixed-income analysts scrutinize the income statement closely?",
    opts: ["To assess a company's ability to make promised debt payments through the business cycle", "They have no interest in the income statement", "Only to check the company's tax rate"], correct: 0,
    exp: "Fixed-income analysts examine income statement components to assess a company's ability to service its debt obligations." },

  { concept:"The Five-Step Revenue Model",
    q: "What is the correct first step in the five-step revenue recognition model?",
    opts: ["Recognize revenue when a performance obligation is satisfied", "Identify the contract(s) with a customer", "Determine the transaction price"], correct: 1,
    exp: "Step 1 is identifying the contract(s) with a customer — everything else follows from there." },
  { concept:"The Five-Step Revenue Model",
    q: "Builder Co. has a $800,000 contract, expects $500,000 total costs, and has incurred $300,000 so far. How much revenue should it recognize?",
    opts: ["$480,000", "$300,000", "$800,000"], correct: 0,
    exp: "Progress = 300,000/500,000 = 60%. Revenue = 60% × 800,000 = $480,000." },
  { concept:"The Five-Step Revenue Model",
    q: "For performance obligations satisfied over time, how is revenue typically measured?",
    opts: ["All at once, at contract signing", "By measuring progress toward completing the performance obligation", "Only once the customer pays in full"], correct: 1,
    exp: "Revenue for obligations satisfied over time is recognized based on progress toward completion, using an input or output method." },

  { concept:"Principal vs. Agent",
    q: "A company that bears inventory risk, controls pricing, and is primarily responsible for fulfilling a contract is acting as a:",
    opts: ["Agent, reporting revenue net", "Principal, reporting revenue gross", "Neither principal nor agent"], correct: 1,
    exp: "Bearing risk and controlling price are hallmarks of a principal, who reports the full (gross) transaction amount as revenue." },
  { concept:"Principal vs. Agent",
    q: "A marketplace website earns a 10% commission on $2,000 of orders, without bearing inventory or credit risk. How much revenue should it report?",
    opts: ["$2,000", "$200", "$1,800"], correct: 1,
    exp: "As an agent, the company reports only its commission ($200) as revenue, not the full order value." },
  { concept:"Principal vs. Agent",
    q: "Why does the principal-vs-agent distinction matter for analysts comparing companies?",
    opts: ["It has no real effect on reported figures", "Two companies with identical underlying economics can show very different revenue figures depending on this classification", "It only affects the balance sheet, not the income statement"], correct: 1,
    exp: "The classification can dramatically change reported revenue for economically similar businesses, making it an important adjustment when comparing companies." },

  { concept:"Doubtful Accounts & Warranties",
    q: "Under the matching principle, when should estimated uncollectible accounts be recognized as an expense?",
    opts: ["Only when a specific customer actually defaults", "In the same period as the related revenue, as an estimate", "Never — bad debts are not expensed"], correct: 1,
    exp: "The matching principle requires an estimate of uncollectible amounts to be recorded in the same period as the associated revenue." },
  { concept:"Doubtful Accounts & Warranties",
    q: "Why is the 'direct write-off method' (waiting for actual default) generally not accepted under GAAP or IFRS?",
    opts: ["It violates the matching principle by recording the expense in a different period than the related revenue", "It's too complicated to calculate", "It results in higher expenses than required"], correct: 0,
    exp: "Waiting for actual default disconnects the expense from the revenue it relates to, violating the matching principle." },
  { concept:"Doubtful Accounts & Warranties",
    q: "How should a company handle estimated warranty expenses?",
    opts: ["Wait until actual repair costs are incurred to record any expense", "Estimate and recognize warranty expense at the time of sale, adjusting later based on actual experience", "Warranty costs are never recorded as expenses"], correct: 1,
    exp: "Warranty expense must be estimated and recognized at the point of sale, then trued up against actual experience over time." },

  { concept:"Depreciation & Amortization",
    q:"An asset costs $80,000, has a residual value of $8,000, and a useful life of 8 years. What is the annual straight-line depreciation expense?",
    opts: ["$10,000", "$9,000", "$8,000"], correct: 1,
    exp: "Annual depreciation = (80,000 − 8,000)/8 = $9,000." },
  { concept:"Depreciation & Amortization",
    q: "Which long-lived asset is never depreciated?",
    opts: ["Manufacturing equipment", "A company vehicle", "Land"], correct: 2,
    exp: "Land is not depreciated, since it doesn't have a determinable useful life the way physical equipment does." },
  { concept:"Depreciation & Amortization",
    q: "Is the revaluation model for property, plant, and equipment permitted under US GAAP?",
    opts: ["Yes, and it's commonly used", "No — it's permitted under IFRS but not under US GAAP", "It's required under both IFRS and US GAAP"], correct: 1,
    exp: "The revaluation model is allowed under IFRS (though rarely used) but is not permitted under US GAAP, which requires the cost model." },

  { concept:"Operating vs. Non-Operating",
    q: "For a typical non-financial manufacturing company, how is interest income from short-term investments usually classified?",
    opts: ["Operating", "Non-operating", "It's never disclosed"], correct: 1,
    exp: "For non-financial companies, interest income from investing activities is typically classified as non-operating." },
  { concept:"Operating vs. Non-Operating",
    q: "For a bank, how is interest income typically classified?",
    opts: ["Non-operating, since it's from lending", "Operating, since lending is the bank's core business", "It is excluded from the income statement entirely"], correct: 1,
    exp: "For a financial services company like a bank, interest income and expense are core operating activities, not non-operating items." },
  { concept:"Operating vs. Non-Operating",
    q: "Why is separating operating from non-operating items useful for analysis?",
    opts: ["It has no analytical value", "Operating performance and financing costs are driven by different factors, so blending them obscures the underlying story", "It's required purely for tax purposes"], correct: 1,
    exp: "Operating results reflect the core business; non-operating items reflect financing and investing decisions — separating them clarifies what's actually driving performance." },

  { concept:"Common-Size Analysis",
    q: "Common-size analysis of the income statement expresses each line item as a percentage of:",
    opts: ["Total assets", "Revenue", "Net income"], correct: 1,
    exp: "Vertical common-size analysis of the income statement expresses every line as a percentage of revenue." },
  { concept:"Common-Size Analysis",
    q: "A company has $1,500,000 revenue and $250,000 operating profit. What is its common-size operating margin?",
    opts: ["16.7%", "25.0%", "6.0%"], correct: 0,
    exp: "Operating margin = 250,000/1,500,000 ≈ 16.7%." },
  { concept:"Common-Size Analysis",
    q: "Why is common-size analysis specifically useful when comparing a small company to a much larger one?",
    opts: ["It converts both companies to the same currency", "It removes the effect of size by standardizing every line item as a percentage of revenue", "It is only valid for companies of similar size"], correct: 1,
    exp: "By standardizing to percentages of revenue, common-size analysis makes companies of very different absolute sizes genuinely comparable." },

  { concept:"Comprehensive Income",
    q: "Comprehensive income equals net income plus:",
    opts: ["Total assets", "Other comprehensive income (OCI)", "Total liabilities"], correct: 1,
    exp: "Comprehensive income = Net income + Other comprehensive income." },
  { concept:"Comprehensive Income",
    q: "Beginning equity is €200 million, net income is €20 million, dividends are €3 million, and actual ending equity is €227 million. What is other comprehensive income?",
    opts: ["€10 million", "€7 million", "€0"], correct: 0,
    exp: "Expected ending equity = 200+20−3 = 217. OCI = 227−217 = €10 million." },
  { concept:"Comprehensive Income",
    q: "Which of these is a common type of other comprehensive income?",
    opts: ["Foreign currency translation adjustments", "Cost of goods sold", "Depreciation expense"], correct: 0,
    exp: "Foreign currency translation adjustments are one of the four common categories of other comprehensive income." }
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
        const isCorrect = i === item.correct;
        if (isCorrect) score++;
        if (typeof cfaRecordAnswer === 'function' && item.concept){
          cfaRecordAnswer(item.concept, "Income Statements", isCorrect);
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

  } catch(e) { console.warn('[income-statements] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: income-taxes
   ============================================================ */
(function(){
  try {
// ============================================================
// Income Taxes — interactivity
// ============================================================

function fmt(n, d=0){ return isFinite(n) ? n.toFixed(d) : "—"; }
function fmtMoney(n, symbol='€'){
  const sign = n < 0 ? '−' : '';
  return sign + symbol + Math.round(Math.abs(n)).toLocaleString();
}

/* ============================================================
   02 — Asset tax base calculator
   ============================================================ */
(function(){
  const costI = document.getElementById('tbCost'), acctAmortI = document.getElementById('tbAcctAmort'),
        taxRateI = document.getElementById('tbTaxRate'), applicableRateI = document.getElementById('tbApplicableRate');
  const result = document.getElementById('tbResult');
  if (!costI) return;
  function render(){
    const cost = parseFloat(costI.value), acctAmort = parseFloat(acctAmortI.value),
          taxRate = parseFloat(taxRateI.value)/100, applicableRate = parseFloat(applicableRateI.value)/100;
    const carrying = cost - acctAmort;
    const taxBase = cost - (taxRate * cost);
    const diff = carrying - taxBase;
    const taxEffect = Math.abs(diff) * applicableRate;
    const label = diff > 0 ? 'DTL' : diff < 0 ? 'DTA' : 'No difference';
    result.textContent = `Carrying = ${fmtMoney(carrying)} · Tax base = ${fmtMoney(taxBase)} · ${label} = ${fmtMoney(taxEffect)}`;
  }
  [costI,acctAmortI,taxRateI,applicableRateI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   06 — Tax rate change calculator
   ============================================================ */
(function(){
  const diffI = document.getElementById('trcDiff'), oldRateI = document.getElementById('trcOldRate'), newRateI = document.getElementById('trcNewRate');
  const result = document.getElementById('trcResult');
  if (!diffI) return;
  function render(){
    const diff = parseFloat(diffI.value), oldRate = parseFloat(oldRateI.value)/100, newRate = parseFloat(newRateI.value)/100;
    const oldDTL = diff * oldRate;
    const newDTL = diff * newRate;
    const change = newDTL - oldDTL;
    result.textContent = `Old DTL = ${fmtMoney(oldDTL,'$')} · New DTL = ${fmtMoney(newDTL,'$')} · Change = ${fmtMoney(change,'$')}`;
  }
  [diffI,oldRateI,newRateI].forEach(el => el.addEventListener('input', render));
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
const sectionIds = ['sec-vocabulary','sec-taxbaseasset','sec-taxbaseliability','sec-tempperm','sec-valuationallowance','sec-ratechanges','sec-directequity','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-income-taxes', String(pct)); } catch(e) {}
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
  { concept:"Accounting Income vs. Taxable Income",
    q: "Taxable income is calculated according to:",
    opts: ["Accounting standards like IFRS or US GAAP", "Applicable tax law", "Whichever method produces the lowest reported profit"], correct: 1,
    exp: "Taxable income follows tax law, distinct from accounting income, which follows accounting standards." },
  { concept:"Accounting Income vs. Taxable Income",
    q: "Income tax expense on the income statement consists of:",
    opts: ["Only current taxes payable", "Current tax payable plus (or minus) the change in deferred taxes", "Only deferred tax items"], correct: 1,
    exp: "Income tax expense combines the current tax obligation with the period's change in deferred tax assets and liabilities." },
  { concept:"Accounting Income vs. Taxable Income",
    q: "Why do accounting income and taxable income typically differ?",
    opts: ["Accounting standards and tax law serve different purposes and were never designed to produce identical figures", "One of the two figures is always calculated incorrectly", "They never actually differ in practice"], correct: 0,
    exp: "The two systems serve different purposes, so genuine differences between accounting and taxable income are normal and expected." },

  { concept:"Tax Base of an Asset",
    q: "The tax base of an asset represents:",
    opts: ["The amount deductible for tax purposes in future periods as the asset's benefits are realized", "The asset's original purchase price only", "The asset's current market value"], correct: 0,
    exp: "Tax base specifically refers to the future tax-deductible amount as the asset is used or sold." },
  { concept:"Tax Base of an Asset",
    q: "An asset's carrying amount is $500,000, and its tax base (after 25% tax depreciation) is $375,000. What temporary difference exists, and what does it create?",
    opts: ["$125,000, creating a deferred tax liability", "$125,000, creating a deferred tax asset", "No difference exists"], correct: 0,
    exp: "Carrying amount ($500,000) exceeds tax base ($375,000) by $125,000, creating a deferred tax liability." },
  { concept:"Tax Base of an Asset",
    q: "If an asset's carrying amount is LESS than its tax base, this creates a:",
    opts: ["Deferred tax liability", "Deferred tax asset", "Permanent difference only"], correct: 1,
    exp: "For an asset, carrying amount below tax base creates a deferred tax asset." },

  { concept:"Accounting Income vs. Taxable Income",
    q: "Which of these is calculated using tax law rather than accounting standards?",
    opts: ["Pre-tax accounting income", "Taxable income", "Reported comprehensive income"], correct: 1,
    exp: "Taxable income is specifically calculated following applicable tax law, distinct from accounting income." },

  { concept:"Tax Base of an Asset",
    q: "For an asset with no difference between carrying amount and tax base, what deferred tax item exists?",
    opts: ["A deferred tax asset", "A deferred tax liability", "None — no temporary difference exists"], correct: 2,
    exp: "When carrying amount equals tax base, there is no temporary difference and no deferred tax item." },

  { concept:"The Valuation Allowance",
    q: "Which of these factors would make an analyst MORE concerned about a deferred tax asset's realizability?",
    opts: ["A strong multi-year history of consistent taxable profits", "A significant, ongoing history of tax losses", "Conservative accounting policies"], correct: 1,
    exp: "A history of tax losses raises genuine doubt about whether a company will generate enough future taxable income to realize its deferred tax assets." },

  { concept:"Tax Base of a Liability",
    q: "The tax base of a liability equals:",
    opts: ["Its carrying amount minus any amount deductible for tax purposes in the future", "Its carrying amount plus accrued interest", "Always zero"], correct: 0,
    exp: "The tax base of a liability is its carrying amount, reduced by future tax-deductible amounts." },
  { concept:"Tax Base of a Liability",
    q: "A company receives $8,000,000 of rent in advance, taxed immediately under tax law but deferred under accounting rules. What is the tax base of this liability?",
    opts: ["$8,000,000", "$0", "$4,000,000"], correct: 1,
    exp: "Since the full amount was already taxed, the tax base is 8,000,000 − 8,000,000 = $0." },
  { concept:"Tax Base of a Liability",
    q: "For a liability, when carrying amount exceeds tax base, this creates a:",
    opts: ["Deferred tax liability", "Deferred tax asset", "Permanent difference"], correct: 1,
    exp: "For liabilities, carrying amount exceeding tax base creates a deferred tax asset — the mirror image of the asset rule." },

  { concept:"Temporary vs. Permanent Differences",
    q: "A temporary difference is one that:",
    opts: ["Will never reverse", "Is expected to reverse in a future period", "Never creates any deferred tax item"], correct: 1,
    exp: "Temporary differences are expected to reverse over time, unlike permanent differences." },
  { concept:"Temporary vs. Permanent Differences",
    q: "A jurisdiction never allows donations as a tax deduction, though they're fully expensed for accounting purposes. What type of difference is this?",
    opts: ["Temporary, creating a deferred tax asset", "Permanent — no deferred tax item is created", "Temporary, creating a deferred tax liability"], correct: 1,
    exp: "Since this difference never reverses, it's permanent, and creates no deferred tax asset or liability." },
  { concept:"Temporary vs. Permanent Differences",
    q: "Do permanent differences affect a company's effective tax rate?",
    opts: ["No, only temporary differences affect the effective tax rate", "Yes — they cause the effective tax rate to differ from the statutory rate", "Permanent differences don't exist in practice"], correct: 1,
    exp: "Permanent differences cause a lasting gap between the effective tax rate (what's actually paid) and the statutory rate." },

  { concept:"The Valuation Allowance",
    q: "A valuation allowance is used to reduce:",
    opts: ["A deferred tax liability", "A deferred tax asset that may not be fully realized", "Current taxes payable"], correct: 1,
    exp: "The valuation allowance specifically reduces a deferred tax asset when its future realization is genuinely in doubt." },
  { concept:"The Valuation Allowance",
    q: "What is the effect on reported income when a valuation allowance is first established?",
    opts: ["Reported income increases", "Reported income decreases", "No effect on reported income"], correct: 1,
    exp: "Establishing a valuation allowance reduces both the deferred tax asset and reported income in the period it's recorded." },
  { concept:"The Valuation Allowance",
    q: "A company reverses a previously established valuation allowance. What is the effect?",
    opts: ["The deferred tax asset and operating income both decrease", "The deferred tax asset and operating income both increase", "Only the deferred tax asset changes, with no income effect"], correct: 1,
    exp: "Reversing a valuation allowance increases both the deferred tax asset and reported operating income in that period." },

  { concept:"Changes in Tax Rates",
    q: "Deferred tax balances should be measured using:",
    opts: ["The tax rate in effect when the temporary difference originated, permanently", "The tax rate expected to apply when the asset is realized or liability settled", "The highest historical tax rate on record"], correct: 1,
    exp: "Deferred taxes are measured at the rate expected to apply at the time of realization or settlement, not the origination rate." },
  { concept:"Changes in Tax Rates",
    q: "A $2,000,000 temporary difference has a deferred tax liability at a 35% rate. The tax rate is cut to 25%. What is the new DTL, and what happened to it?",
    opts: ["$500,000, a decrease of $200,000", "$700,000, an increase", "$500,000, an increase of $200,000"], correct: 0,
    exp: "New DTL = 2,000,000 × 25% = $500,000, down from the original 2,000,000 × 35% = $700,000 — a $200,000 decrease." },
  { concept:"Changes in Tax Rates",
    q: "A tax rate cut that reduces existing deferred tax liabilities has what effect on reported income in the period of the rate change?",
    opts: ["A one-time boost to income, from the reduction in income tax expense", "A one-time reduction to income", "No effect on income at all"], correct: 0,
    exp: "Reducing a DTL lowers income tax expense in that period, producing a one-time boost to reported income." },

  { concept:"Taxes Charged Directly to Equity",
    q: "If an item that creates a deferred tax liability is itself recognized directly in equity (bypassing net income), the related deferred tax should be:",
    opts: ["Recognized on the income statement instead", "Recognized directly in equity as well, for consistency", "Ignored entirely"], correct: 1,
    exp: "For consistency, deferred taxes follow the same path as the item that created them — if the item bypasses net income, so does its deferred tax." },
  { concept:"Taxes Charged Directly to Equity",
    q: "Which of these is a classic example of an item whose deferred tax is charged directly to equity?",
    opts: ["Ordinary depreciation expense", "Revaluation of property, plant, and equipment under the IFRS revaluation model", "Cost of goods sold"], correct: 1,
    exp: "Since PP&E revaluation surpluses go directly to OCI/equity, their associated deferred tax follows the same path." },
  { concept:"Taxes Charged Directly to Equity",
    q: "Why should an analyst check whether a deferred tax movement flowed through net income or bypassed it via equity?",
    opts: ["It has no real analytical significance", "The two paths have very different implications for evaluating reported earnings quality", "Only auditors need to check this, not analysts"], correct: 1,
    exp: "Understanding whether a deferred tax item affected net income or bypassed it via equity is important for correctly assessing a company's reported earnings quality." }
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
        const isCorrect = i === item.correct;
        if (isCorrect) score++;
        if (typeof cfaRecordAnswer === 'function' && item.concept){
          cfaRecordAnswer(item.concept, "Income Taxes", isCorrect);
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

  } catch(e) { console.warn('[income-taxes] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: intro-reporting
   ============================================================ */
(function(){
  try {
// ============================================================
// Introduction to Financial Reporting — interactivity
// ============================================================

/* ============================================================
   05 — Element classifier widget
   ============================================================ */
(function(){
  const container = document.getElementById('elementClassifier');
  if (!container) return;
  const items = [
    { name: "Cash in the bank", element: "Asset", explain: "A present economic resource controlled by the company, with future economic benefit." },
    { name: "Bank loan owed", element: "Liability", explain: "A present obligation to transfer resources (repay the loan) as a result of a past event (borrowing)." },
    { name: "Retained earnings", element: "Equity", explain: "Part of the residual interest belonging to owners — accumulated profit not yet distributed." },
    { name: "Sale of products to a customer", element: "Income (Revenue)", explain: "An increase in assets (or decrease in liabilities) from ordinary operating activity that increases equity." },
    { name: "Rent paid for the office", element: "Expense", explain: "A decrease in assets (or increase in liabilities) that decreases equity, incurred running the business." },
    { name: "Sale of old, unused equipment above book value", element: "Income (Gain)", explain: "Income, but from a non-ordinary activity — a gain, not revenue." },
  ];
  let html = '<div style="display:flex; flex-direction:column; gap:8px;">';
  items.forEach((item, i) => {
    html += `
      <div class="element-item" data-i="${i}" style="background:var(--paper-dim); border-radius:8px; padding:10px 14px; cursor:pointer;">
        <div style="font-size:.88rem; font-weight:600;">${item.name}</div>
        <div class="element-answer" id="elementAnswer${i}" style="display:none; margin-top:6px; font-size:.8rem; color:var(--ink-soft);"></div>
      </div>`;
  });
  html += '</div>';
  container.innerHTML = html;

  container.querySelectorAll('.element-item').forEach(el => {
    el.addEventListener('click', () => {
      const i = el.dataset.i;
      const item = items[i];
      const answerEl = document.getElementById(`elementAnswer${i}`);
      if (answerEl.style.display === 'none'){
        answerEl.innerHTML = `<strong style="color:var(--indigo);">${item.element}</strong> — ${item.explain}`;
        answerEl.style.display = 'block';
      } else {
        answerEl.style.display = 'none';
      }
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
const sectionIds = ['sec-standardsetters','sec-objective','sec-fundamental','sec-enhancing','sec-elements','sec-assumptions','sec-measurement','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-intro-reporting', String(pct)); } catch(e) {}
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
  { concept:"Standard-Setters vs. Regulators",
    q: "Which best describes the role of a standard-setting body like the IASB?",
    opts: ["It has direct legal power to enforce compliance in every country", "It develops and issues accounting standards, but relies on regulators to give them legal force", "It only audits individual companies"], correct: 1,
    exp: "Standard-setters draft the rules; regulatory authorities must recognize and enforce them for the rules to carry legal weight." },
  { concept:"Standard-Setters vs. Regulators",
    q: "In the United States, which body is recognized by the SEC as the authoritative source of US GAAP?",
    opts: ["The IASB", "The FASB", "The IFRS Foundation"], correct: 1,
    exp: "The FASB issues US GAAP, officially recognized as authoritative by the SEC." },
  { concept:"Standard-Setters vs. Regulators",
    q: "Can a national regulator overrule a private-sector standard-setting body within its own jurisdiction?",
    opts: ["No, regulators have no such authority", "Yes, regulators generally retain this legal authority, even though it's rarely exercised", "Only the United Nations can override standard-setters"], correct: 1,
    exp: "Regulators typically retain the legal authority to establish or override reporting standards in their jurisdiction, though this power is rarely used in practice." },

  { concept:"The Objective of Financial Reporting",
    q: "According to the IASB's Conceptual Framework, the central objective of financial reporting is to:",
    opts: ["Maximize reported profit", "Provide information useful to resource providers in making decisions", "Satisfy only government tax requirements"], correct: 1,
    exp: "The framework's central objective is providing decision-useful information to current and potential resource providers." },
  { concept:"The Objective of Financial Reporting",
    q: "Which of these is NOT one of the three core things users need to know about a company, per the framework?",
    opts: ["Its financial position", "Its financial performance", "The personal opinions of its board members"], correct: 2,
    exp: "The three core needs are financial position, financial performance, and cash position — not board members' personal opinions." },
  { concept:"The Objective of Financial Reporting",
    q: "Are financial statements primarily designed for company valuation purposes?",
    opts: ["Yes, valuation is the sole design objective", "No — they're designed for the broader decision needs of resource providers; valuation usefulness is a byproduct", "Financial statements have no use in valuation at all"], correct: 1,
    exp: "Financial reports serve a broader set of decisions by resource providers; their usefulness for valuation is a byproduct of that broader design." },

  { concept:"Relevance & Faithful Representation",
    q: "Information that could influence a user's decision, either through predictive or confirmatory value, is said to be:",
    opts: ["Relevant", "Verifiable", "Comparable"], correct: 0,
    exp: "Relevance is defined by information's potential to affect users' decisions, via predictive or confirmatory value." },
  { concept:"Relevance & Faithful Representation",
    q: "Information is considered 'material' when:",
    opts: ["It relates to a company's physical materials or inventory", "Its omission or misstatement could influence users' decisions", "It exceeds a fixed dollar threshold set by law"], correct: 1,
    exp: "Materiality is about decision impact, not a fixed threshold or literal materials — it's a function of the nature and/or magnitude of the information." },
  { concept:"Relevance & Faithful Representation",
    q: "Faithful representation requires information to be complete, neutral, and:",
    opts: ["Free from error", "Extremely detailed", "Prepared only by external auditors"], correct: 0,
    exp: "The three components of faithful representation are complete, neutral, and free from error." },

  { concept:"Enhancing Characteristics & Constraints",
    q: "Which enhancing characteristic allows users to identify similarities and differences between companies or across time?",
    opts: ["Comparability", "Timeliness", "Understandability"], correct: 0,
    exp: "Comparability specifically enables users to identify and understand similarities and differences of items." },
  { concept:"Enhancing Characteristics & Constraints",
    q: "Verifiability means that:",
    opts: ["Only the company's own accountants can confirm the information", "Different knowledgeable, independent observers would agree the information faithfully represents what it claims", "The information must be verified by a government agency"], correct: 1,
    exp: "Verifiability is about independent observer agreement, not a specific government sign-off." },
  { concept:"Enhancing Characteristics & Constraints",
    q: "What is described as 'a pervasive constraint on useful financial reporting'?",
    opts: ["The cost of providing and using the information", "The number of pages in a financial report", "The color scheme used in financial statements"], correct: 0,
    exp: "Cost is explicitly identified as the pervasive constraint — ideally, benefits from disclosure should exceed the costs of providing and using it." },

  { concept:"The Elements of Financial Statements",
    q: "Which three elements of financial statements are directly related to measuring financial position?",
    opts: ["Assets, liabilities, and equity", "Income, expenses, and equity", "Revenue, gains, and losses"], correct: 0,
    exp: "Assets, liabilities, and equity measure financial position; income and expenses measure performance." },
  { concept:"The Elements of Financial Statements",
    q: "A company sells surplus land for more than its book value. How should this be classified?",
    opts: ["Revenue", "A gain (income, but not revenue)", "A liability"], correct: 1,
    exp: "Since selling surplus land isn't the company's ordinary operating activity, this is a gain, not revenue — though both are types of income." },
  { concept:"The Elements of Financial Statements",
    q: "According to the formal definition, a liability is:",
    opts: ["Any decrease in a company's cash balance", "A present obligation to transfer an economic resource, arising from a past event", "The same thing as an expense"], correct: 1,
    exp: "A liability is formally defined as a present obligation from a past event that requires a future transfer of resources." },

  { concept:"Accrual Accounting & Going Concern",
    q: "The 'going concern' assumption means that a company's financial statements assume:",
    opts: ["The company is about to be liquidated", "The company will continue operating for the foreseeable future", "The company has no liabilities"], correct: 1,
    exp: "Going concern assumes continued operation, not imminent liquidation." },
  { concept:"Accrual Accounting & Going Concern",
    q: "If a company is genuinely expected to liquidate within weeks, how should this affect its financial statements?",
    opts: ["Nothing changes — going concern always applies", "The going concern assumption no longer holds, and asset values typically need to be reassessed on a different basis", "Only the cash flow statement is affected"], correct: 1,
    exp: "Genuine expected liquidation breaks the going concern assumption, typically requiring assets to be valued differently — often lower, reflecting a forced sale." },

  { concept:"Bases of Measurement",
    q: "The amount of cash originally paid to acquire an asset, including acquisition costs, is called:",
    opts: ["Fair value", "Historical cost", "Present value"], correct: 1,
    exp: "Historical cost is the original amount of cash or cash equivalents paid to acquire the asset." },
  { concept:"Bases of Measurement",
    q: "The price that would be received to sell an asset in an orderly transaction between market participants is:",
    opts: ["Historical cost", "Amortised cost", "Fair value"], correct: 2,
    exp: "Fair value is defined as an exit price — what would be received to sell the asset in an orderly market transaction." },
  { concept:"Bases of Measurement",
    q: "Valuing an asset based on the discounted value of the future cash flows it's expected to generate uses which measurement basis?",
    opts: ["Present value", "Current cost", "Realizable value"], correct: 0,
    exp: "Present value discounts expected future cash flows back to today using an appropriate interest rate." }
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
        const isCorrect = i === item.correct;
        if (isCorrect) score++;
        if (typeof cfaRecordAnswer === 'function' && item.concept){
          cfaRecordAnswer(item.concept, "Introduction to Financial Reporting", isCorrect);
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

  } catch(e) { console.warn('[intro-reporting] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: inventories-basics
   ============================================================ */
(function(){
  try {
// ============================================================
// Inventories — Part 1: Measurement Basics — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }
function fmtNum(n){ return Math.round(n).toLocaleString(); }

/* ============================================================
   02 — GSI 4-method inventory calculator (flagship)
   ============================================================ */
(function(){
  const q1I = document.getElementById('invQ1'), p1I = document.getElementById('invP1'),
        q2I = document.getElementById('invQ2'), p2I = document.getElementById('invP2'),
        q3I = document.getElementById('invQ3'), p3I = document.getElementById('invP3'),
        soldI = document.getElementById('invSold'), salePriceI = document.getElementById('invSalePrice');
  const out = document.getElementById('invOut');
  if (!q1I) return;

  function render(){
    const q1=parseFloat(q1I.value), p1=parseFloat(p1I.value);
    const q2=parseFloat(q2I.value), p2=parseFloat(p2I.value);
    const q3=parseFloat(q3I.value), p3=parseFloat(p3I.value);
    const sold=parseFloat(soldI.value), salePrice=parseFloat(salePriceI.value);
    const totalUnits = q1+q2+q3;
    const totalCost = q1*p1 + q2*p2 + q3*p3;
    const sales = sold * salePrice;
    const endingUnits = totalUnits - sold;

    let remaining = sold, fifoCOGS = 0;
    let take = Math.min(remaining, q1); fifoCOGS += take*p1; remaining -= take;
    take = Math.min(remaining, q2); fifoCOGS += take*p2; remaining -= take;
    take = Math.min(remaining, q3); fifoCOGS += take*p3; remaining -= take;
    const fifoEndInv = totalCost - fifoCOGS;

    remaining = sold; let lifoCOGS = 0;
    take = Math.min(remaining, q3); lifoCOGS += take*p3; remaining -= take;
    take = Math.min(remaining, q2); lifoCOGS += take*p2; remaining -= take;
    take = Math.min(remaining, q1); lifoCOGS += take*p1; remaining -= take;
    const lifoEndInv = totalCost - lifoCOGS;

    const avgCost = totalCost / totalUnits;
    const waCOGS = sold * avgCost;
    const waEndInv = endingUnits * avgCost;

    function row(label, cogs, endInv){
      const gp = sales - cogs;
      return `<tr><td>${label}</td><td class="num">${fmtNum(cogs)}</td><td class="num">${fmtNum(endInv)}</td><td class="num">${fmtNum(gp)}</td></tr>`;
    }

    out.innerHTML = `
      <table class="exhibit" style="margin:0;">
        <tr><th>Method</th><th>Cost of Sales</th><th>Ending Inv.</th><th>Gross Profit</th></tr>
        ${row('Weighted Average', waCOGS, waEndInv)}
        ${row('FIFO', fifoCOGS, fifoEndInv)}
        ${row('LIFO', lifoCOGS, lifoEndInv)}
      </table>
      <p style="margin:10px 0 0; font-size:.8rem; color:var(--ink-soft);">Total goods available for sale: ${fmtNum(totalCost)} · Sales revenue: ${fmtNum(sales)}</p>
    `;
  }
  [q1I,p1I,q2I,p2I,q3I,p3I,soldI,salePriceI].forEach(el => el.addEventListener('input', render));
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
const sectionIds = ['sec-costsincluded','sec-costformulas','sec-periodicperpetual','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-inventories-basics', String(pct)); } catch(e) {}
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
  { concept:"Costs Included in Inventory",
    q: "Which of these costs is properly included in inventory (capitalized), not expensed immediately?",
    opts: ["Direct labor used in production (a cost of conversion)", "Selling costs", "Administrative overhead"], correct: 0,
    exp: "Direct labor is a cost of conversion, properly capitalized into inventory until the goods are sold." },
  { concept:"Costs Included in Inventory",
    q: "Abnormal waste from a production malfunction should be:",
    opts: ["Capitalized into inventory", "Expensed immediately on the income statement", "Recorded directly to retained earnings"], correct: 1,
    exp: "Abnormal waste is explicitly excluded from inventory and expensed as incurred." },
  { concept:"Costs Included in Inventory",
    q: "A manufacturer typically classifies inventory into which three categories?",
    opts: ["Cash, receivables, and payables", "Raw materials, work-in-progress, and finished goods", "Current, non-current, and intangible"], correct: 1,
    exp: "Manufacturers typically track raw materials, work-in-progress, and finished goods as distinct inventory categories." },
  { concept:"Costs Included in Inventory",
    q: "Which of these is typically excluded from inventory and expensed immediately, regardless of the accounting standard used?",
    opts: ["Most storage costs and all selling costs", "Import duties on purchased materials", "Direct labor in the production process"], correct: 0,
    exp: "Most storage costs and all selling/administrative costs are excluded from inventory and expensed as incurred." },

  { concept:"The Four Cost Formulas",
    q: "Which inventory cost formula is prohibited under IFRS, though permitted under US GAAP?",
    opts: ["FIFO", "Weighted average", "LIFO"], correct: 2,
    exp: "LIFO is permitted only under US GAAP; IFRS prohibits its use entirely." },
  { concept:"The Four Cost Formulas",
    q: "GSI purchases soap at 110, 100, then 90 AED/kg (costs falling), and sells 520,000 kg at 240 AED/kg. Which method produced the LOWEST cost of sales in this specific example?",
    opts: ["FIFO", "LIFO", "Weighted average"], correct: 1,
    exp: "Since costs were falling, LIFO (selling the newest, cheapest units first) produced the lowest cost of sales in this specific case." },
  { concept:"The Four Cost Formulas",
    q: "In a period of RISING costs, which method typically produces the HIGHEST ending inventory value?",
    opts: ["LIFO", "FIFO", "Weighted average, always"], correct: 1,
    exp: "With rising costs, FIFO's ending inventory reflects the most recently acquired (highest) costs, producing the highest ending inventory value." },
  { concept:"The Four Cost Formulas",
    q: "Which cost formula tracks the actual physical cost of each specific unit sold?",
    opts: ["Specific identification", "Weighted average", "LIFO"], correct: 0,
    exp: "Specific identification matches the actual cost of each individually identifiable unit, typically used for unique, high-value items." },
  { concept:"The Four Cost Formulas",
    q: "The weighted average cost method blends the cost of all available units into:",
    opts: ["A single average cost per unit", "The cost of only the most recent purchase", "The cost of only the earliest purchase"], correct: 0,
    exp: "Weighted average cost blends all available units' costs into one average cost per unit for both cost of sales and ending inventory." },

  { concept:"Periodic vs. Perpetual Systems",
    q: "Under a periodic inventory system, cost of sales is calculated as:",
    opts: ["Beginning inventory + Purchases − Ending inventory", "Ending inventory − Beginning inventory", "Purchases alone"], correct: 0,
    exp: "Periodic systems determine cost of sales at period-end using this formula, based on a physical count of ending inventory." },
  { concept:"Periodic vs. Perpetual Systems",
    q: "For which cost formula can periodic and perpetual systems produce genuinely different results?",
    opts: ["Specific identification only", "Weighted average and LIFO", "FIFO only"], correct: 1,
    exp: "Weighted average and LIFO can produce different allocations under periodic versus perpetual systems, unlike specific ID and FIFO." },
  { concept:"Periodic vs. Perpetual Systems",
    q: "Under a perpetual inventory system, when are inventory values and cost of sales updated?",
    opts: ["Only once, at year-end", "Continuously, with every purchase and sale", "Only when a physical count is performed"], correct: 1,
    exp: "Perpetual systems update inventory and cost of sales continuously as transactions occur, in real time." }
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
        const isCorrect = i === item.correct;
        if (isCorrect) score++;
        if (typeof cfaRecordAnswer === 'function' && item.concept){
          cfaRecordAnswer(item.concept, "Inventories: Measurement Basics", isCorrect);
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

  } catch(e) { console.warn('[inventories-basics] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: inventories-lifo
   ============================================================ */
(function(){
  try {
// ============================================================
// Inventories — Part 2: LIFO Effects & Write-Downs — interactivity
// ============================================================

function fmt(n, d=2){ return isFinite(n) ? n.toFixed(d) : "—"; }
function fmtNum(n){ return Math.round(n).toLocaleString(); }

/* ============================================================
   05 — LIFO reserve / LIFO-to-FIFO converter
   ============================================================ */
(function(){
  const lifoInvI = document.getElementById('lrLifoInv'), reserveNowI = document.getElementById('lrReserveNow'),
        reservePriorI = document.getElementById('lrReservePrior'), lifoCOGSI = document.getElementById('lrLifoCOGS');
  const result = document.getElementById('lrResult');
  if (!lifoInvI) return;
  function render(){
    const lifoInv = parseFloat(lifoInvI.value), reserveNow = parseFloat(reserveNowI.value),
          reservePrior = parseFloat(reservePriorI.value), lifoCOGS = parseFloat(lifoCOGSI.value);
    const fifoInv = lifoInv + reserveNow;
    const changeInReserve = reserveNow - reservePrior;
    const fifoCOGS = lifoCOGS - changeInReserve;
    result.textContent = `FIFO inventory = $${fmt(fifoInv,0)}M · FIFO cost of sales = $${fmt(fifoCOGS,0)}M`;
  }
  [lifoInvI,reserveNowI,reservePriorI,lifoCOGSI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   07 — Write-down calculator
   ============================================================ */
(function(){
  const costI = document.getElementById('wdCost'), nrvI = document.getElementById('wdNRV');
  const result = document.getElementById('wdResult');
  if (!costI) return;
  function render(){
    const cost = parseFloat(costI.value), nrv = parseFloat(nrvI.value);
    const writedown = Math.max(0, cost - nrv);
    result.textContent = writedown > 0
      ? `Write-down required = $${fmtNum(writedown)}`
      : `No write-down required — cost is below NRV`;
  }
  [costI,nrvI].forEach(el => el.addEventListener('input', render));
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
const sectionIds = ['sec-risingcosts','sec-lifreserve','sec-lifoliquidation','sec-writedown','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-inventories-lifo', String(pct)); } catch(e) {}
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
  { concept:"Rising Costs — LIFO vs. FIFO",
    q: "During a period of rising inventory costs, LIFO produces which effect on net income compared to FIFO?",
    opts: ["Higher net income", "Lower net income", "Identical net income"], correct: 1,
    exp: "LIFO's higher cost of sales during rising costs results in lower gross profit and net income compared to FIFO." },
  { concept:"Rising Costs — LIFO vs. FIFO",
    q: "Why might a company deliberately choose LIFO during a period of rising costs, despite lower reported net income?",
    opts: ["To reduce income taxes paid, improving actual cash flow", "LIFO always simplifies the accounting process", "To increase reported total assets"], correct: 0,
    exp: "The tax savings from lower reported taxable income is the primary motivation for choosing LIFO during rising costs." },
  { concept:"Rising Costs — LIFO vs. FIFO",
    q: "During rising costs, how does LIFO's ending inventory carrying amount compare to FIFO's?",
    opts: ["Lower under LIFO", "Higher under LIFO", "Always identical"], correct: 0,
    exp: "LIFO's ending inventory reflects older, lower costs during a period of rising prices, resulting in a lower carrying amount than FIFO." },

  { concept:"LIFO Reserve & Conversion",
    q: "The LIFO reserve is defined as:",
    opts: ["FIFO inventory minus LIFO inventory", "LIFO inventory minus FIFO inventory", "Total cost of goods available for sale"], correct: 0,
    exp: "LIFO reserve = FIFO inventory value − LIFO inventory value, as disclosed by companies using LIFO." },
  { concept:"LIFO Reserve & Conversion",
    q: "A company reports LIFO inventory of $60 million with a LIFO reserve of $18 million. What is its inventory under FIFO?",
    opts: ["$42 million", "$78 million", "$60 million"], correct: 1,
    exp: "FIFO inventory = LIFO inventory + LIFO reserve = 60 + 18 = $78 million." },
  { concept:"LIFO Reserve & Conversion",
    q: "To convert LIFO cost of sales to a FIFO basis, an analyst should:",
    opts: ["Subtract the increase in the LIFO reserve during the period", "Add the total LIFO reserve, regardless of change", "Ignore cost of sales entirely"], correct: 0,
    exp: "FIFO cost of sales = LIFO cost of sales minus the increase in the LIFO reserve during the period (or plus a decrease)." },

  { concept:"LIFO Liquidation",
    q: "LIFO liquidation occurs when:",
    opts: ["Units purchased exceed units sold", "Units sold exceed units purchased or produced, digging into older inventory layers", "A company switches from LIFO to FIFO"], correct: 1,
    exp: "When sales outpace purchases/production, older (lower-cost) LIFO layers get liquidated." },
  { concept:"LIFO Liquidation",
    q: "In a period of historically rising costs, LIFO liquidation typically produces what effect on gross profit?",
    opts: ["A one-time, unsustainable increase", "A permanent, sustainable increase", "No effect on gross profit at all"], correct: 0,
    exp: "LIFO liquidation matches old, low-cost inventory against current sale prices, creating a one-time, non-recurring profit boost." },
  { concept:"LIFO Liquidation",
    q: "What specific disclosure should analysts monitor to detect a possible LIFO liquidation?",
    opts: ["A decline in the LIFO reserve from the prior period", "An increase in accounts payable", "A rise in the effective tax rate"], correct: 0,
    exp: "A declining LIFO reserve, especially alongside historically rising costs, signals older inventory layers are being liquidated." },
  { concept:"LIFO Liquidation",
    q: "Why might management intentionally trigger a LIFO liquidation?",
    opts: ["To potentially inflate reported earnings during a weak period", "It is required by IFRS", "To reduce their tax liability further"], correct: 0,
    exp: "Management can potentially manipulate reported earnings by deliberately reducing inventory to trigger a LIFO liquidation's one-time profit boost." },

  { concept:"Lower of Cost and NRV",
    q: "Net realisable value is defined as:",
    opts: ["Estimated selling price minus estimated costs to complete and sell", "The original purchase price of the inventory", "Replacement cost only"], correct: 0,
    exp: "NRV is the estimated selling price in the ordinary course of business, less costs necessary to complete and sell the item." },
  { concept:"Lower of Cost and NRV",
    q: "Inventory with a cost of $50,000 has a net realisable value of $38,000. What write-down is required?",
    opts: ["$12,000", "$50,000", "$0, since cost is always used"], correct: 0,
    exp: "Write-down = Cost − NRV = 50,000 − 38,000 = $12,000." },
  { concept:"Lower of Cost and NRV",
    q: "Under US GAAP, once inventory has been written down, can the write-down later be reversed if value recovers?",
    opts: ["Yes, always", "No — reversal is prohibited under US GAAP", "Only for LIFO inventory"], correct: 1,
    exp: "US GAAP prohibits reversing inventory write-downs, unlike IFRS, which permits limited reversal." },
  { concept:"Lower of Cost and NRV",
    q: "Under IFRS, can a previous inventory write-down be reversed?",
    opts: ["Yes, limited to the amount of the original write-down", "No, reversal is never permitted under IFRS", "Only with regulatory approval"], correct: 0,
    exp: "IFRS permits reversal of a write-down, but only up to the amount of the original write-down." }
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
        const isCorrect = i === item.correct;
        if (isCorrect) score++;
        if (typeof cfaRecordAnswer === 'function' && item.concept){
          cfaRecordAnswer(item.concept, "Inventories: LIFO & Write-Downs", isCorrect);
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

  } catch(e) { console.warn('[inventories-lifo] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: long-lived-assets
   ============================================================ */
(function(){
  try {
// ============================================================
// Long-Lived Assets — interactivity
// ============================================================

function fmtMoney(n){ return '$' + Math.round(n).toLocaleString(); }

/* ============================================================
   02 — Three-method depreciation calculator (flagship)
   ============================================================ */
(function(){
  const costI = document.getElementById('depAssetCost'), residualI = document.getElementById('depResidual2'),
        lifeI = document.getElementById('depLife2'), capacityI = document.getElementById('depCapacity'),
        productionI = document.getElementById('depProduction');
  const out = document.getElementById('depTableOut');
  if (!costI) return;

  function render(){
    const cost = parseFloat(costI.value), residual = parseFloat(residualI.value);
    const life = parseInt(lifeI.value), capacity = parseFloat(capacityI.value);
    const production = productionI.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

    const depreciableCost = cost - residual;

    // Straight-line
    const slAnnual = depreciableCost / life;

    // Double-declining balance
    const ddbRate = 2 / life;
    let ddbRows = [];
    let bv = cost;
    for (let year = 1; year <= life; year++){
      let dep;
      if (year === life){
        dep = bv - residual;
      } else {
        dep = Math.round(bv * ddbRate);
        if (bv - dep < residual) dep = bv - residual;
      }
      const ending = bv - dep;
      ddbRows.push(dep);
      bv = ending;
    }

    // Units of production
    const costPerUnit = depreciableCost / capacity;
    let uopRows = production.map(units => Math.round(units * costPerUnit));

    let html = `<table class="exhibit" style="margin:0;">
      <tr><th>Year</th><th>Straight-Line</th><th>Double-Declining</th><th>Units-of-Production</th></tr>`;
    for (let year = 1; year <= life; year++){
      const uop = uopRows[year-1] !== undefined ? fmtMoney(uopRows[year-1]) : '—';
      html += `<tr><td>${year}</td><td class="num">${fmtMoney(slAnnual)}</td><td class="num">${fmtMoney(ddbRows[year-1])}</td><td class="num">${uop}</td></tr>`;
    }
    const ddbTotal = ddbRows.reduce((a,b)=>a+b,0);
    const uopTotal = uopRows.reduce((a,b)=>a+b,0);
    html += `<tr><td><strong>Total</strong></td><td class="num"><strong>${fmtMoney(slAnnual*life)}</strong></td><td class="num"><strong>${fmtMoney(ddbTotal)}</strong></td><td class="num"><strong>${fmtMoney(uopTotal)}</strong></td></tr>`;
    html += `</table>`;
    out.innerHTML = html;
  }
  [costI,residualI,lifeI,capacityI,productionI].forEach(el => el.addEventListener('input', render));
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
const sectionIds = ['sec-acquisition','sec-depmethods','sec-depeffects','sec-amortization','sec-revaluation','sec-investmentproperty','sec-impairment','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-long-lived-assets', String(pct)); } catch(e) {}
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
  { concept:"Acquisition Costs",
    q: "Which of these costs should be capitalized as part of an asset's cost?",
    opts: ["Delivery and installation costs to bring the asset to working condition", "Ongoing repairs after the asset is in use", "General administrative overhead"], correct: 0,
    exp: "Costs directly attributable to bringing an asset to its working condition, like delivery and installation, are capitalized." },
  { concept:"Acquisition Costs",
    q: "Capitalizing a cost, rather than expensing it immediately, has what effect on current-period net income?",
    opts: ["Lower current net income", "Higher current net income, since the cost is deferred", "No effect at all"], correct: 1,
    exp: "Capitalizing defers cost recognition to future periods via depreciation, resulting in higher current-period net income compared to immediate expensing." },
  { concept:"Acquisition Costs",
    q: "Which model for reporting long-lived assets is required under US GAAP?",
    opts: ["The revaluation model", "The cost model", "The fair value model exclusively"], correct: 1,
    exp: "US GAAP requires the cost model; the revaluation model is not permitted." },

  { concept:"Depreciation Methods",
    q: "Under the straight-line method, an asset costs $50,000 with a $5,000 residual value and 9-year useful life. What is annual depreciation expense?",
    opts: ["$5,000", "$5,555", "$4,500"], correct: 0,
    exp: "Straight-line depreciation = (50,000 − 5,000)/9 = $5,000." },
  { concept:"Depreciation Methods",
    q: "For a 5-year useful life asset, what is the double-declining balance depreciation rate?",
    opts: ["20%", "40%", "50%"], correct: 1,
    exp: "Straight-line rate = 1/5 = 20%. Double-declining balance rate = 2 × 20% = 40%." },
  { concept:"Depreciation Methods",
    q: "Does total accumulated depreciation over an asset's full useful life depend on the depreciation method chosen?",
    opts: ["Yes, accelerated methods produce more total depreciation", "No — total depreciation is identical regardless of method; only the timing differs", "Only units-of-production affects the total"], correct: 1,
    exp: "Every method depreciates the same total depreciable cost over the asset's life; only the year-by-year allocation differs." },
  { concept:"Depreciation Methods",
    q: "Under the units-of-production method, depreciation expense in a given period is based on:",
    opts: ["A fixed percentage of carrying value", "The proportion of the asset's actual production that period, relative to total estimated capacity", "The calendar year alone, regardless of usage"], correct: 1,
    exp: "Units-of-production ties depreciation directly to actual usage relative to total estimated productive capacity." },

  { concept:"Depreciation Methods",
    q: "In the final year of an asset's useful life, why might depreciation expense not exactly match the formula-calculated amount under an accelerated method?",
    opts: ["The carrying amount cannot be reduced below the estimated residual value, forcing an adjustment in the final year", "Accelerated methods never apply in the final year", "Residual value is always ignored under accelerated methods"], correct: 0,
    exp: "Regardless of method, an asset's carrying amount is never depreciated below its residual value — the final year's expense is adjusted to land exactly on that value." },

  { concept:"Effects on Statements & Ratios",
    q: "In the early years of an asset's life, an accelerated depreciation method compared to straight-line produces:",
    opts: ["Higher net income", "Lower net income and lower operating profit margin", "No difference in reported net income"], correct: 1,
    exp: "Accelerated methods front-load depreciation expense, lowering net income and operating margin in the early years." },
  { concept:"Effects on Statements & Ratios",
    q: "A company switches from straight-line to an accelerated depreciation method. What is the effect on operating cash flow?",
    opts: ["It increases, due to lower taxes paid on lower taxable income", "It decreases", "No effect, since depreciation is non-cash"], correct: 0,
    exp: "Even though depreciation is non-cash, higher depreciation expense lowers taxable income and actual cash taxes paid, increasing operating cash flow." },
  { concept:"Effects on Statements & Ratios",
    q: "Expensing a cost immediately, rather than capitalizing it, generally results in what pattern for subsequent years' profit growth?",
    opts: ["Lower subsequent-year growth", "Higher subsequent-year growth, since no future depreciation relates to that cost", "No effect on growth patterns"], correct: 1,
    exp: "Expensing upfront removes the cost from future periods entirely, making subsequent year-over-year profit growth look comparatively stronger." },

  { concept:"Amortization of Intangibles",
    q: "An intangible asset with an indefinite useful life, such as certain goodwill, should be:",
    opts: ["Amortized over 20 years by default", "Not amortized, but tested for impairment at least annually", "Expensed immediately upon acquisition"], correct: 1,
    exp: "Indefinite-life intangibles are never amortized; they undergo periodic impairment testing instead." },
  { concept:"Amortization of Intangibles",
    q: "A patent with a legally defined expiration date should be:",
    opts: ["Amortized over its useful life", "Never amortized", "Immediately written off"], correct: 0,
    exp: "A finite-life intangible like a patent with a defined expiration is amortized over its useful life." },
  { concept:"Amortization of Intangibles",
    q: "Does the choice of amortization method affect the total amortization expense recognized over an intangible asset's full life?",
    opts: ["Yes, significantly", "No — only the year-by-year timing is affected, not the total", "Only for patents, not customer lists"], correct: 1,
    exp: "As with depreciation, amortization method choice only affects timing, not the total amount amortized over the asset's life." },

  { concept:"The Revaluation Model",
    q: "The revaluation model for long-lived assets is:",
    opts: ["Required under both IFRS and US GAAP", "Permitted under IFRS only; prohibited under US GAAP", "Prohibited under both IFRS and US GAAP"], correct: 1,
    exp: "The revaluation model is an IFRS-only option; US GAAP requires the cost model." },
  { concept:"The Revaluation Model",
    q: "A first-time upward revaluation of an asset under IFRS is typically recognized:",
    opts: ["Directly in net income", "In other comprehensive income, as a revaluation surplus in equity", "As a reduction in liabilities"], correct: 1,
    exp: "First-time upward revaluations typically bypass net income, flowing through OCI into equity as a revaluation surplus." },
  { concept:"The Revaluation Model",
    q: "Why do most companies, even those reporting under IFRS, stick with the cost model rather than the revaluation model?",
    opts: ["The revaluation model is illegal in most countries", "It's simpler and avoids the cost and volatility of ongoing independent valuations", "The cost model always produces higher reported assets"], correct: 1,
    exp: "The cost model is simpler to apply and avoids the expense and earnings volatility associated with periodic revaluations." },

  { concept:"Investment Property",
    q: "A building held purely to earn rental income from unrelated third parties should be classified as:",
    opts: ["Property, plant, and equipment", "Investment property", "Inventory"], correct: 1,
    exp: "Property held to earn rental income or for capital appreciation, separate from core operations, is investment property." },
  { concept:"Investment Property",
    q: "Under the fair value model for investment property, how are unrealized fair value changes typically recognized?",
    opts: ["Directly in net income", "In other comprehensive income only", "They are never recognized"], correct: 0,
    exp: "Under the fair value model for investment property, unrealized gains and losses flow directly through net income, unlike ordinary PP&E revaluations." },
  { concept:"Investment Property",
    q: "What determines whether a building is classified as PP&E or investment property?",
    opts: ["Its physical construction materials", "The purpose for which the company holds it", "Its geographic location"], correct: 1,
    exp: "Classification depends on purpose — used in operations (PP&E) versus held for rental income or appreciation (investment property) — not physical characteristics." },

  { concept:"Impairment & Derecognition",
    q: "An asset is considered impaired when:",
    opts: ["Its carrying amount exceeds its recoverable amount", "It has been fully depreciated", "It generates positive cash flow"], correct: 0,
    exp: "Impairment occurs when an asset's carrying amount on the books exceeds what it can realistically be expected to recover." },
  { concept:"Impairment & Derecognition",
    q: "What does an impairment loss typically suggest about a company's prior depreciation expense?",
    opts: ["Prior depreciation was too high", "Prior depreciation was likely insufficient, given the asset's book value had drifted too high", "Impairment has no relationship to prior depreciation"], correct: 1,
    exp: "An impairment loss often indicates insufficient depreciation was recognized in prior periods, requiring a catch-up write-down." },
  { concept:"Impairment & Derecognition",
    q: "What is the effect of an impairment loss on operating cash flow?",
    opts: ["No direct effect — impairment is a non-cash charge", "Operating cash flow falls by the full impairment amount", "Operating cash flow rises by the full impairment amount"], correct: 0,
    exp: "Like depreciation, impairment is a non-cash expense that reduces net income without directly affecting operating cash flow." },
  { concept:"Impairment & Derecognition",
    q: "When an asset is sold, the gain or loss on disposal is calculated as:",
    opts: ["Sale proceeds minus the asset's carrying amount at the time of sale", "The asset's original purchase price minus sale proceeds", "Always zero, since depreciation already accounted for value loss"], correct: 0,
    exp: "Gain or loss on disposal equals sale proceeds minus the carrying (book) value at the time of the sale." }
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
        const isCorrect = i === item.correct;
        if (isCorrect) score++;
        if (typeof cfaRecordAnswer === 'function' && item.concept){
          cfaRecordAnswer(item.concept, "Long-Lived Assets", isCorrect);
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

  } catch(e) { console.warn('[long-lived-assets] module script error (safely isolated):', e); }
})();


/* ============================================================
   Module: noncurrent-liabilities
   ============================================================ */
(function(){
  try {
// ============================================================
// Non-Current Liabilities — interactivity
// ============================================================

function fmt(n, d=0){ return isFinite(n) ? n.toFixed(d) : "—"; }
function fmtMoney(n, symbol='£'){
  const sign = n < 0 ? '−' : '';
  return sign + symbol + Math.round(Math.abs(n)).toLocaleString();
}

/* ============================================================
   02 — Bond pricing calculator
   ============================================================ */
(function(){
  const faceI = document.getElementById('bpFace'), couponI = document.getElementById('bpCoupon'),
        marketI = document.getElementById('bpMarket'), yearsI = document.getElementById('bpYears');
  const result = document.getElementById('bpResult');
  if (!faceI) return;
  function render(){
    const face = parseFloat(faceI.value), coupon = parseFloat(couponI.value)/100,
          market = parseFloat(marketI.value)/100, years = parseInt(yearsI.value);
    const payment = face * coupon;
    let pv = 0;
    for (let t = 1; t <= years; t++){
      pv += payment / Math.pow(1+market, t);
    }
    pv += face / Math.pow(1+market, years);
    const label = Math.abs(pv - face) < 0.5 ? 'issued at par' : pv > face ? 'issued at a premium' : 'issued at a discount';
    result.textContent = `Sales proceeds = ${fmtMoney(pv)} (${label})`;
  }
  [faceI,couponI,marketI,yearsI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   03 — Discount/premium amortization table (flagship)
   ============================================================ */
(function(){
  const proceedsI = document.getElementById('eiProceeds'), faceI = document.getElementById('eiFace'),
        couponI = document.getElementById('eiCoupon'), marketI = document.getElementById('eiMarket'), yearsI = document.getElementById('eiYears');
  const out = document.getElementById('eiTableOut');
  if (!proceedsI) return;
  function render(){
    const proceeds = parseFloat(proceedsI.value), face = parseFloat(faceI.value),
          coupon = parseFloat(couponI.value)/100, market = parseFloat(marketI.value)/100, years = parseInt(yearsI.value);
    const couponPayment = face * coupon;

    let html = `<table class="exhibit" style="margin:0;">
      <tr><th>Year</th><th>Beginning</th><th>Int. Exp.</th><th>Coupon</th><th>Amort.</th><th>Ending</th></tr>`;
    let bv = proceeds;
    for (let year = 1; year <= years; year++){
      const interestExp = bv * market;
      const amort = interestExp - couponPayment;
      let ending = bv + amort;
      if (year === years) ending = face; // force exact convergence at maturity
      html += `<tr><td>${year}</td><td class="num">${fmtMoney(bv)}</td><td class="num">${fmtMoney(interestExp)}</td><td class="num">${fmtMoney(couponPayment)}</td><td class="num">${fmtMoney(amort)}</td><td class="num">${fmtMoney(ending)}</td></tr>`;
      bv = ending;
    }
    html += `</table>`;
    out.innerHTML = html;
  }
  [proceedsI,faceI,couponI,marketI,yearsI].forEach(el => el.addEventListener('input', render));
  render();
})();

/* ============================================================
   06 — Redemption gain/loss calculator
   ============================================================ */
(function(){
  const carryingI = document.getElementById('drCarrying'), callPriceI = document.getElementById('drCallPrice');
  const result = document.getElementById('drResult');
  if (!carryingI) return;
  function render(){
    const carrying = parseFloat(carryingI.value), callPricePct = parseFloat(callPriceI.value)/100;
    const cashPaid = carrying * callPricePct;
    const gainLoss = carrying - cashPaid;
    const label = gainLoss >= 0 ? 'Gain' : 'Loss';
    result.textContent = `Cash paid = ${fmtMoney(cashPaid)} · ${label} on redemption = ${fmtMoney(Math.abs(gainLoss))}`;
  }
  [carryingI,callPriceI].forEach(el => el.addEventListener('input', render));
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
const sectionIds = ['sec-bondbasics','sec-parpremiumdiscount','sec-effectiveinterest','sec-premiumamort','sec-fairvalue','sec-derecognition','sec-quiz'];
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
  try { localStorage.setItem('cfa-progress-noncurrent-liabilities', String(pct)); } catch(e) {}
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
  { concept:"Face Value, Coupon & Market Rate",
    q: "The face value of a bond represents:",
    opts: ["The periodic interest payment amount", "The amount payable to bondholders at maturity", "The bond's current market price"], correct: 1,
    exp: "Face value (principal, par value) is the amount the issuer pays bondholders when the bond matures." },
  { concept:"Face Value, Coupon & Market Rate",
    q: "The coupon rate on a bond is:",
    opts: ["A rate that changes constantly with market conditions", "Fixed in the bond contract, used to calculate periodic interest payments", "Always equal to the market rate"], correct: 1,
    exp: "The coupon rate is fixed at issuance and determines the bond's periodic cash interest payments." },
  { concept:"Face Value, Coupon & Market Rate",
    q: "A bond priced at 95 means it's selling for:",
    opts: ["$95", "95% of its face value", "$95 above face value"], correct: 1,
    exp: "Bond prices are commonly quoted as a percentage of face value; a price of 95 means 95% of face value." },

  { concept:"Bonds Issued at Par, Premium & Discount",
    q: "A bond with a 4% coupon rate is issued when the market rate is also 4%. This bond will sell:",
    opts: ["At a premium", "At a discount", "At par"], correct: 2,
    exp: "When coupon rate equals market rate, the bond sells at exactly face value — at par." },
  { concept:"Bonds Issued at Par, Premium & Discount",
    q: "A bond with a coupon rate below the current market rate will sell:",
    opts: ["At a premium", "At a discount", "At par"], correct: 1,
    exp: "A below-market coupon rate means investors demand a lower price — the bond sells at a discount." },
  { concept:"Bonds Issued at Par, Premium & Discount",
    q: "$500,000 face value, 3-year bonds with a 4% coupon are issued when the market rate is also 4%. What are the sales proceeds?",
    opts: ["$500,000", "$480,000", "$520,000"], correct: 0,
    exp: "With coupon rate equal to market rate, the bond is issued at par — sales proceeds equal face value, $500,000." },

  { concept:"Face Value, Coupon & Market Rate",
    q: "How is a bond's issuance price determined?",
    opts: ["As the present value of all promised future cash payments, discounted at the market rate", "As the face value multiplied by the coupon rate", "It is always set equal to face value by regulation"], correct: 0,
    exp: "A bond's price is the present value of its promised coupon payments and face value, discounted at the market rate at issuance." },

  { concept:"Bonds Issued at Par, Premium & Discount",
    q: "The document containing the terms of a bond contract is called the:",
    opts: ["Prospectus", "Indenture", "Covenant schedule"], correct: 1,
    exp: "The indenture is the legal document containing the specific terms of a bond issuance." },

  { concept:"The Effective Interest Method",
    q: "Under the effective interest method, interest expense in a given year is calculated as:",
    opts: ["Face value × coupon rate", "Beginning carrying amount × market rate", "Ending carrying amount × coupon rate"], correct: 1,
    exp: "Interest expense = beginning-of-year carrying amount multiplied by the market (effective) rate at issuance." },
  { concept:"The Effective Interest Method",
    q: "For a bond issued at a discount, what happens to the carrying amount over the bond's life?",
    opts: ["It decreases toward face value", "It increases toward face value", "It stays constant"], correct: 1,
    exp: "A discount bond's carrying amount rises each year as the discount is amortized, reaching face value at maturity." },
  { concept:"The Effective Interest Method",
    q: "For a discount bond, is interest expense each year greater than, less than, or equal to the coupon payment?",
    opts: ["Greater than", "Less than", "Always exactly equal"], correct: 0,
    exp: "For a discount bond, interest expense (at the higher market rate) exceeds the coupon payment (at the lower coupon rate), with the difference amortizing the discount." },

  { concept:"Amortizing a Premium",
    q: "For a bond issued at a premium, what happens to the carrying amount over the bond's life?",
    opts: ["It increases toward face value", "It decreases toward face value", "It stays constant at the premium price"], correct: 1,
    exp: "A premium bond's carrying amount falls each year as the premium is amortized, reaching face value at maturity." },
  { concept:"Amortizing a Premium",
    q: "For a premium bond, interest expense each year is:",
    opts: ["Greater than the coupon payment", "Less than the coupon payment", "Always exactly equal to the coupon payment"], correct: 1,
    exp: "A premium bond's effective rate is below its coupon rate, so interest expense is less than the cash coupon payment." },
  { concept:"Amortizing a Premium",
    q: "What is the key limitation of the straight-line method for amortizing a bond discount or premium?",
    opts: ["It cannot be used for premium bonds", "It doesn't tie interest expense to the actual effective (market) rate", "It always produces a higher total interest expense"], correct: 1,
    exp: "Straight-line amortization evenly spreads the discount/premium but doesn't reflect the true effective interest rate, unlike the effective interest method." },

  { concept:"The Fair Value Option",
    q: "Under the fair value option, a decrease in a bond liability's fair value is reported as:",
    opts: ["A loss", "Income", "No effect on the income statement"], correct: 1,
    exp: "A decrease in the fair value of a liability (the company owes less) is recognized as income under the fair value option." },
  { concept:"The Fair Value Option",
    q: "Under the fair value option, which portion of a fair value change must be separated into other comprehensive income rather than net income?",
    opts: ["The portion attributable to changes in the company's own credit risk", "The entire fair value change", "None of it — all changes go to net income"], correct: 0,
    exp: "The portion of fair value change caused by the company's own credit risk deteriorating or improving is reported in OCI, not net income." },
  { concept:"The Fair Value Option",
    q: "Which type of company most commonly elects the fair value option for financial liabilities?",
    opts: ["Small retail companies", "Financial-sector companies, like investment banks", "Non-profit organizations"], correct: 1,
    exp: "Financial-sector companies, whose assets are often already fair-valued, most commonly elect the fair value option to avoid an accounting mismatch." },

  { concept:"Derecognition of Debt",
    q: "When a bond reaches maturity and is repaid in full, what gain or loss is typically recognized?",
    opts: ["A large gain, since the discount is fully amortized", "None — the carrying amount equals face value, a clean retirement", "A loss equal to the original discount"], correct: 1,
    exp: "By maturity, the carrying amount equals face value exactly, so repayment involves no gain or loss." },
  { concept:"Derecognition of Debt",
    q: "A company redeems bonds with a $5,000,000 carrying amount for $4,800,000 in cash. What is the effect on the income statement?",
    opts: ["A $200,000 gain on extinguishment", "A $200,000 loss on extinguishment", "No income statement effect"], correct: 0,
    exp: "Paying less cash ($4.8M) than the carrying amount ($5M) to extinguish the debt produces a $200,000 gain." },
  { concept:"Derecognition of Debt",
    q: "On the cash flow statement (indirect method), how is a gain or loss on debt extinguishment treated?",
    opts: ["It's removed from operating cash flow, since it's a non-operating item", "It's added to operating cash flow in full", "It has no effect on the cash flow statement"], correct: 0,
    exp: "Gains and losses on debt extinguishment are removed from net income when reconciling to operating cash flow, since they're non-operating items." }
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
        const isCorrect = i === item.correct;
        if (isCorrect) score++;
        if (typeof cfaRecordAnswer === 'function' && item.concept){
          cfaRecordAnswer(item.concept, "Non-Current Liabilities", isCorrect);
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

  } catch(e) { console.warn('[noncurrent-liabilities] module script error (safely isolated):', e); }
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
  "FSA Foundations": ["What Is Financial Reporting?","The Accounting Equation","The Four Statements — A Bird's Eye View","Accrual vs. Cash Basis","Double-Entry Bookkeeping","Assets, Liabilities & Equity","Revenues, Expenses & Matching"],
  "Introduction to Financial Reporting": ["Standard-Setters vs. Regulators","The Objective of Financial Reporting","Relevance & Faithful Representation","Enhancing Characteristics & Constraints","The Elements of Financial Statements","Accrual Accounting & Going Concern","Bases of Measurement"],
  "Income Statements": ["What the Income Statement Reports","The Five-Step Revenue Model","Principal vs. Agent","Doubtful Accounts & Warranties","Depreciation & Amortization","Operating vs. Non-Operating","Common-Size Analysis","Comprehensive Income"],
  "Balance Sheets": ["What the Balance Sheet Reports","Current vs. Non-Current","Liquidity-Based Presentation","Current Assets","Current Liabilities","Components of Equity"],
  "Cash Flow Statements": ["Why the Cash Flow Statement Exists","Operating, Investing & Financing","Non-Cash Activities","Direct vs. Indirect Method","IFRS vs. US GAAP","Reading a Real Statement"],
  "Inventories: Measurement Basics": ["Costs Included in Inventory","The Four Cost Formulas","Periodic vs. Perpetual Systems"],
  "Inventories: LIFO & Write-Downs": ["Rising Costs — LIFO vs. FIFO","LIFO Reserve & Conversion","LIFO Liquidation","Lower of Cost and NRV"],
  "Long-Lived Assets": ["Acquisition Costs","Depreciation Methods","Effects on Statements & Ratios","Amortization of Intangibles","The Revaluation Model","Investment Property","Impairment & Derecognition"],
  "Income Taxes": ["Accounting Income vs. Taxable Income","Tax Base of an Asset","Tax Base of a Liability","Temporary vs. Permanent Differences","The Valuation Allowance","Changes in Tax Rates","Taxes Charged Directly to Equity"],
  "Non-Current Liabilities": ["Face Value, Coupon & Market Rate","Bonds Issued at Par, Premium & Discount","The Effective Interest Method","Amortizing a Premium","The Fair Value Option","Derecognition of Debt"],
  "Applications of FSA": ["Evaluating Past Performance","Projecting Future Performance","Assessing Credit Risk","Screening for Equity Investments","Adjustments — Framework & Inventory","Adjustments Related to PP&E","Adjustments Related to Goodwill"],
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
        <p><strong>No data yet.</strong> This dashboard builds itself from your answers anywhere in this toolkit's modules. Try the FSA Foundations quiz (even partially) and your readiness breakdown will appear here, concept by concept.</p>
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
