/* ===========================================================
   TIPINSURE SEO Tracker — client-side login gate
   NOTE: This is a deterrent, not real security. A static site
   cannot truly protect content client-side (data/*.json remain
   directly fetchable). For real protection use Vercel
   Deployment Protection (Password) on a Pro plan.
   =========================================================== */
(function(){
  const AUTH_KEY = 'tipinsure_tracker_auth';
  // SHA-256 of accepted passcodes (any one works)
  const PASS_HASHES = [
    '53446552be9594329a3a9229b6a581e96545bedffe8818e4e1c9c966cd01eb15', // 560105
    'bdaa9975de4fc82fafbc7ac1ef091dcb5bb982403f1473b401df18808ddc6076', // tezt
  ];

  async function sha256(text){
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('');
  }

  function unlock(){
    document.documentElement.classList.remove('locked');
  }

  function wireGate(){
    const gate = document.getElementById('gate');
    if (!gate) return;
    const input = document.getElementById('gatePass');
    const btn = document.getElementById('gateBtn');
    const err = document.getElementById('gateErr');

    async function tryAuth(){
      const val = (input.value || '').trim();
      if (!val){ input.focus(); return; }
      const hash = await sha256(val);
      if (PASS_HASHES.includes(hash)){
        try { localStorage.setItem(AUTH_KEY, 'ok'); } catch(e){}
        unlock();
      } else {
        err.textContent = 'รหัสผ่านไม่ถูกต้อง';
        input.value = '';
        input.focus();
      }
    }

    btn.addEventListener('click', tryAuth);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') tryAuth(); });
    if (document.documentElement.classList.contains('locked')) input.focus();
  }

  // If already authenticated, ensure unlocked (in case head script locked before storage read)
  try { if (localStorage.getItem(AUTH_KEY) === 'ok') unlock(); } catch(e){}

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireGate);
  else wireGate();
})();
