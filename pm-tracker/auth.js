/* ===========================================================
   TIPINSURE SEO Tracker — client-side login gate
   Roles: full (560105, tezt) | view (Dhip, read-only)
   Also captures a display name used for "updated by".
   NOTE: deterrent, not real security (static site).
   =========================================================== */
(function(){
  const AUTH_KEY = 'tipinsure_tracker_auth';   // 'full' | 'view'
  const USER_KEY = 'tipinsure_tracker_user';   // display name
  const PASS_ROLES = {
    '53446552be9594329a3a9229b6a581e96545bedffe8818e4e1c9c966cd01eb15': 'full', // 560105
    'bdaa9975de4fc82fafbc7ac1ef091dcb5bb982403f1473b401df18808ddc6076': 'full', // tezt
    '68647c450e8e9a25736195493c88253f51c25ad80a0e351c4b45b202a50ef11b': 'view', // Dhip (read-only)
  };

  async function sha256(text){
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('');
  }

  function applyRole(role){
    window.TRACKER_ROLE = role;
    document.documentElement.classList.toggle('readonly', role === 'view');
  }

  function finish(role, name){
    applyRole(role);
    window.TRACKER_USER = name || '';
    document.documentElement.classList.remove('locked');
    if (typeof window.onTrackerAuth === 'function') window.onTrackerAuth(role, window.TRACKER_USER);
  }

  function wireGate(){
    const gate = document.getElementById('gate');
    if (!gate) return;
    const passStep = document.getElementById('stepPass');
    const nameStep = document.getElementById('stepName');
    const input = document.getElementById('gatePass');
    const btn = document.getElementById('gateBtn');
    const err = document.getElementById('gateErr');
    const nameInput = document.getElementById('gateName');
    const nameBtn = document.getElementById('gateNameBtn');
    const roleTag = document.getElementById('gateRoleTag');
    let pendingRole = null;

    async function tryAuth(){
      const val = (input.value || '').trim();
      if (!val){ input.focus(); return; }
      const hash = await sha256(val);
      const role = PASS_ROLES[hash];
      if (role){
        pendingRole = role;
        try { localStorage.setItem(AUTH_KEY, role); } catch(e){}
        // step 2: ask for name
        passStep.style.display = 'none';
        nameStep.style.display = 'block';
        roleTag.textContent = role === 'view' ? 'สิทธิ์: ดูอย่างเดียว' : 'สิทธิ์: แก้ไขได้';
        roleTag.className = 'gate-roletag ' + (role === 'view' ? 'view' : 'full');
        const existing = (function(){ try { return localStorage.getItem(USER_KEY) || ''; } catch(e){ return ''; } })();
        nameInput.value = existing;
        nameInput.focus();
      } else {
        err.textContent = 'รหัสผ่านไม่ถูกต้อง';
        input.value = '';
        input.focus();
      }
    }

    function submitName(){
      const name = (nameInput.value || '').trim() || 'ไม่ระบุชื่อ';
      try { localStorage.setItem(USER_KEY, name); } catch(e){}
      finish(pendingRole, name);
    }

    btn.addEventListener('click', tryAuth);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') tryAuth(); });
    nameBtn.addEventListener('click', submitName);
    nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitName(); });

    if (document.documentElement.classList.contains('locked')) input.focus();
  }

  // If already authenticated this browser, restore role+name and unlock
  try {
    let saved = localStorage.getItem(AUTH_KEY);
    if (saved === 'ok'){ saved = 'full'; localStorage.setItem(AUTH_KEY, 'full'); }
    if (saved === 'full' || saved === 'view'){
      const name = localStorage.getItem(USER_KEY) || '';
      finish(saved, name);
    }
  } catch(e){}

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireGate);
  else wireGate();
})();
