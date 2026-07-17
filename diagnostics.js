// ============================================================
// Diagnostics — persistent per-concept quiz performance tracking
// Shared across the Final Review quiz and the Readiness Dashboard.
// One shared file for all three volumes — the storage key is
// auto-detected from the URL path, so each volume's progress
// stays independent, exactly as before consolidation.
// Shape: { "<concept name>": { cat: "...", correct: N, attempts: N, lastCorrect: bool, lastAt: ISOdate } }
// ============================================================

const CFA_DIAGNOSTICS_KEY = (function(){
  const path = window.location.pathname;
  if (path.includes('/quant/')) return 'cfa-quant-diagnostics';
  if (path.includes('/economics/')) return 'cfa-econ-diagnostics';
  if (path.includes('/fsa/')) return 'cfa-fsa-diagnostics';
  return 'cfa-diagnostics'; // fallback, should not normally be hit
})();

function cfaLoadDiagnostics(){
  try {
    const raw = localStorage.getItem(CFA_DIAGNOSTICS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e){
    return {};
  }
}

function cfaSaveDiagnostics(data){
  try { localStorage.setItem(CFA_DIAGNOSTICS_KEY, JSON.stringify(data)); } catch(e){}
}

// Record one answered question's result against a specific concept.
function cfaRecordAnswer(concept, cat, isCorrect){
  const data = cfaLoadDiagnostics();
  if (!data[concept]) data[concept] = { cat, correct: 0, attempts: 0, lastCorrect: null, lastAt: null };
  data[concept].cat = cat; // keep current in case categories were renamed
  data[concept].attempts += 1;
  if (isCorrect) data[concept].correct += 1;
  data[concept].lastCorrect = isCorrect;
  data[concept].lastAt = new Date().toISOString();
  cfaSaveDiagnostics(data);
}

// Clear all stored diagnostics (used by a "reset" control on the dashboard).
function cfaResetDiagnostics(){
  try { localStorage.removeItem(CFA_DIAGNOSTICS_KEY); } catch(e){}
}
