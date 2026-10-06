/* ===========================================================
   TIPINSURE SEO — Project Tracker
   Supabase real-time + role-based access
   =========================================================== */

/* ---- Supabase config ---- */
const SUPABASE_URL = 'https://xozxvotslhnoloutwyei.supabase.co';
const SUPABASE_KEY = 'sb_publishable_VVBxHsHBu_AnMhB0ZJxBVw_veOUonF7';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function canEdit(){ return window.TRACKER_ROLE === 'full'; }
function currentUser(){ return window.TRACKER_USER || ''; }

/* ---- Action Plan phases (from summary doc section 5) ---- */
const PHASES = {
  1: { name: 'ระยะ 1 — เปิดทางให้ Google', desc: 'robots / canonical / sitemap+GSC / homepage 301' },
  2: { name: 'ระยะ 2 — โครงสร้าง URL + ความเร็ว', desc: 'redirect / ลิงก์เสีย / 404 / รูป (Core Web Vitals)' },
  3: { name: 'ระยะ 3 — คุณภาพหน้า', desc: 'schema / alt / internal link' },
  4: { name: 'ระยะ 4 — Migration & Off-site', desc: 'pagination / backlink' },
  5: { name: 'ระยะเสริม — On-page detail (MEDIUM/LOW)', desc: 'title / meta / H1 / URL / อื่น ๆ' },
};

/* ---- Excel sheet mapping (task id -> related sheets in All-Links workbook) ---- */
const SHEET_MAP = {
  '01': [{ file:'sheet_01_Internal_redirects_that_aren.json', label:'01 Internal redirects ที่ไม่ใช่ 301', rows:61 }],
  '02': [{ file:'sheet_02_Internal_JavaScript_redirect.json', label:'02 Internal JavaScript redirects', rows:208 }],
  '04': [
    { file:'sheet_04_Images_are_overly_large.json', label:'04 รูปภาพใหญ่เกินไป', rows:43 },
    { file:'sheet_04b_Pages_using_the_large_image.json', label:'04b หน้าที่ใช้รูปใหญ่', rows:663 },
  ],
  '07': [{ file:'sheet_07_URLs_not_in_sitemap_xml.json', label:'07 URL ที่ไม่อยู่ใน sitemap', rows:11161 }],
  '09': [{ file:'sheet_09_robots_txt_blocks_wanted_con.json', label:'09 URL ที่ถูก robots บล็อก', rows:10380 }],
  '14': [
    { file:'sheet_14_Internal_links_to_4xx.json', label:'14 ลิงก์ภายในชี้ 4xx', rows:27 },
    { file:'sheet_14b_Pages_linking_to_the_4xx_UR.json', label:'14b หน้าที่ลิงก์ไป 4xx', rows:22061 },
  ],
  '15': [
    { file:'sheet_15_External_links_returning_4xx.json', label:'15 External links 4xx', rows:59 },
    { file:'sheet_15b_Pages_linking_to_broken_ext.json', label:'15b หน้าที่ลิงก์ external เสีย', rows:24336 },
  ],
  '18': [{ file:'sheet_18_Duplicate_title_tags.json', label:'18 Title ซ้ำ', rows:38 }],
  '19': [{ file:'sheet_19_Titles_over_60_characters.json', label:'19 Title ยาวเกิน 60', rows:6395 }],
  '20': [{ file:'sheet_20_Titles_below_30_characters.json', label:'20 Title สั้นกว่า 30', rows:414 }],
  '21': [{ file:'sheet_21_Meta_descriptions_over_155.json', label:'21 Meta description ยาวเกิน 155', rows:6919 }],
  '22': [{ file:'sheet_22_Meta_descriptions_below_70.json', label:'22 Meta description สั้นกว่า 70', rows:584 }],
  '23': [{ file:'sheet_23_H1_tags_missing.json', label:'23 H1 หาย/ซ้ำ', rows:9882 }],
  '24': [{ file:'sheet_24_URLs_not_search_engine_frien.json', label:'24 URL ไม่ SEO-friendly', rows:2094 }],
  '25': [
    { file:'sheet_25_Image_alt_text_missing.json', label:'25 รูปไม่มี alt', rows:1318 },
    { file:'sheet_25b_Pages_using_those_images.json', label:'25b หน้าที่ใช้รูปเหล่านั้น', rows:32957 },
  ],
  '28': [{ file:'sheet_28_Meta_keywords_present.json', label:'28 Meta keywords', rows:11172 }],
  '29': [{ file:'sheet_29_Spammy_backlinks.json', label:'29 Spammy backlinks', rows:5844 }],
};

/* ---- Seed: 30 audit items ---- */
const SEED = [
  // HIGH (13)
  { id:'06', sev:'HIGH', cat:'Crawl/Index', phase:1, owner:'Client/Primal', team:'Dev', support:['Marketing'],
    title:'XML Sitemap ยังไม่ยืนยันว่าส่งเข้า GSC',
    todo:'ตั้งค่า GSC ให้เรียบร้อย + submit sitemap (ตอนนี้ sitemap มีแค่ 13 URL)' },
  { id:'09', sev:'HIGH', cat:'Crawl/Index', phase:1, owner:'Dev', team:'Dev', support:[],
    title:'robots.txt บล็อกหน้าที่อยากให้ติด index',
    todo:'เอา Disallow: /pa/ ออก เหลือบล็อกแค่ /pa/step_2..4; แก้ ft ให้ใช้ User-agent: *' },
  { id:'16', sev:'HIGH', cat:'Crawl/Index', phase:1, owner:'Dev', team:'Dev', support:[],
    title:'robots.txt ไม่บล็อก URL ที่ไม่ควร crawl',
    todo:'เพิ่มกฎ parameter (?lang, ?gclid ฯลฯ) + ใส่ canonical ทุกหน้า + ลบ utm/_ga จากลิงก์ภายใน (9,373 param URL = 49.8%)' },
  { id:'05', sev:'HIGH', cat:'Duplicate', phase:1, owner:'Dev', team:'Dev', support:[],
    title:'Homepage duplication (www vs non-www)',
    todo:'เลือกเวอร์ชันหลัก (www) → 301 redirect + canonical + แก้ลิงก์ภายใน (มีหน้าซ้ำ 2,411 หน้า)' },
  { id:'14', sev:'HIGH', cat:'Broken links', phase:2, owner:'Dev', team:'Dev', support:[],
    title:'ลิงก์ภายในชี้ไปหน้า 4xx',
    todo:'แก้ลิงก์เสีย เริ่มจาก footer cookie link (17,485 จุด) + typo /ompulsory; 27 URL 404 ถูกลิงก์ 22,061 จุด' },
  { id:'13', sev:'HIGH', cat:'Error handling', phase:2, owner:'Dev', team:'Dev', support:['Content'],
    title:'ตอบ 302 บนหน้าไม่มีจริง แทน 404',
    todo:'ทำหน้า 404 custom ที่ตอบสถานะ 404 จริง (redirect ภายใน www เป็น 302 ทั้ง 61 จุด)' },
  { id:'07', sev:'HIGH', cat:'Crawl/Index', phase:1, owner:'Dev', team:'Dev', support:['Marketing'],
    title:'หน้าสำคัญไม่อยู่ใน sitemap.xml',
    todo:'ทำ dynamic sitemap ให้ครบ + ลบ 2 URL ที่ 404 (มี 13 URL แต่เว็บจริง 34 หน้า, crawl เจอ 11,161) — ทำให้ครบก่อน submit ในข้อ #06' },
  { id:'04', sev:'HIGH', cat:'Speed/On-page', phase:2, owner:'Dev/Content', team:'Dev', support:['Content'],
    title:'รูปภาพใหญ่เกินไป',
    todo:'บีบอัดทุกรูป >300kB, ย่อ, ใช้ WebP/AVIF, ใส่ width/height (43 รูป/28.2MB; PSI มือถือ 33 · Core Web Vitals ไม่ผ่าน = ranking factor)' },
  { id:'26', sev:'HIGH', cat:'Schema', phase:3, owner:'Dev', team:'Dev', support:['Marketing'],
    title:'ไม่มี Structured Data บนหน้าที่ควรมี',
    todo:'ฝัง schema ใน <head> ทุกหน้า เริ่ม Organization/LocalBusiness (28/34 หน้า www ไม่มี schema)' },
  { id:'25', sev:'HIGH', cat:'On-page', phase:3, owner:'Content', team:'Content', support:['Dev'],
    title:'รูปภาพไม่มี Alt Tag',
    todo:'เติม alt ที่สื่อความ ไม่เกิน 100 ตัวอักษร (1,240 alt ว่าง, 75 ไม่มี alt)' },
  { id:'11', sev:'HIGH', cat:'On-page', phase:3, owner:'Content', team:'Content', support:['Dev','Marketing'],
    title:'Internal linking ยังไม่ดีพอ',
    todo:'วางโครง internal link เป็นลำดับชั้น/ไซโล + anchor text ที่สื่อความ (หน้าแรกมี 11 ลิงก์, 16/34 หน้าเข้าไม่ถึง)' },
  { id:'08', sev:'HIGH', cat:'Crawl/Index', phase:4, owner:'Dev', team:'Dev', support:[],
    title:'Pagination crawl ไม่ได้',
    todo:'เปลี่ยนเป็น Pagination จริง + self-referencing canonical + ย้ายมา www (8,134 URL โดนบล็อก)' },
  { id:'29', sev:'HIGH', cat:'Off-site/Risk', phase:4, owner:'Marketing', team:'Marketing', support:['Dev'],
    title:'Unnatural backlinks (ยังไม่ประเมิน)',
    todo:'รันวิเคราะห์ backlink profile → ถ้าเจอลิงก์สแปม ให้ disavow ผ่าน GSC' },

  // MEDIUM (15)
  { id:'01', sev:'MEDIUM', cat:'Redirect', phase:2, owner:'Dev', team:'Dev', support:[],
    title:'Internal redirects ไม่ใช่ 301',
    todo:'เปลี่ยน 302 เป็น 301 (redirect ภายใน www เป็น 302 ทั้งหมด, 61 จุด)' },
  { id:'02', sev:'MEDIUM', cat:'Redirect', phase:4, owner:'Dev', team:'Dev', support:[],
    title:'Internal JavaScript redirects',
    todo:'เปลี่ยนเป็น 301 (จัดการตอน migration; 208 จุดบน ft)' },
  { id:'03', sev:'MEDIUM', cat:'Redirect', phase:2, owner:'Dev', team:'Dev', support:[],
    title:'Redirect / canonical chains',
    todo:'ทำ 301 ให้ถึงปลายทางใน 1 hop (เจอ chain 9 จุด)' },
  { id:'12', sev:'MEDIUM', cat:'Error handling', phase:2, owner:'Dev', team:'Dev', support:[],
    title:'หน้า error ไม่ตอบ 404 (soft 404)',
    todo:'ทำหน้า 404 จริง (index_v4 → 302 → ft → pageNotFound ตอบ 200)' },
  { id:'10', sev:'MEDIUM', cat:'Language', phase:5, owner:'Dev', team:'Dev', support:['Content'],
    title:'ไม่มี language path แยกภาษา',
    todo:'ทำ subdirectory /en/ แยกภาษา + ลิงก์เมนูสลับภาษาตรง (ตอนนี้ใช้ ?lang=en)' },
  { id:'24', sev:'MEDIUM', cat:'URL', phase:5, owner:'Dev', team:'Dev', support:['Content','Marketing'],
    title:'URL ไม่เป็นมิตรกับ search engine',
    todo:'ตั้งชื่อ URL ตัวเล็ก-อังกฤษ-ใช้ dash + canonical + 301 (case-sensitive, underscore 11,894, non-ASCII 11,373)' },
  { id:'18', sev:'MEDIUM', cat:'On-page', phase:5, owner:'Content', team:'Content', support:['Marketing','Dev'],
    title:'Title ซ้ำกันหลายหน้า',
    todo:'เขียน title เฉพาะแต่ละหน้า 30-60 ตัวอักษร (12/34 หน้าซ้ำ; 6 หน้าใช้แค่ "TIPINSURE")' },
  { id:'19', sev:'MEDIUM', cat:'On-page', phase:5, owner:'Content', team:'Content', support:['Dev'],
    title:'Title ยาวเกิน 60 ตัวอักษร',
    todo:'ย่อให้ 30-60 ตัวอักษร (13/34 หน้าเกิน; ยาวสุด 202)' },
  { id:'20', sev:'MEDIUM', cat:'On-page', phase:5, owner:'Content', team:'Content', support:['Dev'],
    title:'Title สั้นกว่า 30 ตัวอักษร',
    todo:'เขียน title ที่สื่อความ (6/34 หน้าเป็น "TIPINSURE" รวมหน้าแรก)' },
  { id:'21', sev:'MEDIUM', cat:'On-page', phase:5, owner:'Content', team:'Content', support:['Dev'],
    title:'Meta description ยาวเกิน 155 ตัวอักษร',
    todo:'เขียนใหม่ 70-155 ตัวอักษร (18/34 หน้าเกิน; ยาวสุด 646)' },
  { id:'22', sev:'MEDIUM', cat:'On-page', phase:5, owner:'Content', team:'Content', support:['Dev'],
    title:'Meta description สั้นกว่า 70 ตัวอักษร',
    todo:'เขียนให้ยาว 70-155 ตัวอักษร (9/34 หน้า; ส่วนใหญ่เป็นหน้าโปรโมชัน)' },
  { id:'23', sev:'MEDIUM', cat:'On-page', phase:5, owner:'Content', team:'Content', support:['Dev'],
    title:'H1 หายไป / ซ้ำ',
    todo:'ใส่ H1 เดียวต่อหน้า 20-70 ตัวอักษร (หน้าแรกไม่มี H1; 23/34 หน้าซ้ำ)' },
  { id:'15', sev:'MEDIUM', cat:'Broken links', phase:2, owner:'Dev', team:'Dev', support:['Content'],
    title:'External links เสีย / ไม่ปลอดภัย',
    todo:'ลบ/แทนลิงก์เสีย + เพิ่ม rel="noopener" ที่ template (59 URL 4xx/24,336 จุด; 354 target=_blank ไม่มี noopener)' },
  { id:'27', sev:'MEDIUM', cat:'Duplicate', phase:5, owner:'Dev', team:'Dev', support:['Marketing'],
    title:'Doorway pages',
    todo:'ลบหน้า doorway หรือทำ canonical (4 URL คีย์เวิร์ดไทยซ้ำหน้า funnel)' },
  { id:'28', sev:'MEDIUM', cat:'On-page', phase:5, owner:'Dev', team:'Dev', support:[],
    title:'ลบ Meta Keywords',
    todo:'ลบ meta keywords หรือเหลือ 1 คีย์เวิร์ด/หน้า (มีทุกหน้า 34 www; Google เลิกใช้ตั้งแต่ 2009)' },

  // LOW (2)
  { id:'17', sev:'LOW', cat:'GEO/AI', phase:5, owner:'Marketing', team:'Marketing', support:['Dev'],
    title:'ไม่มี llms.txt',
    todo:'เพิ่ม llms.txt หลังทำ XML sitemap เสร็จ (ตอนนี้ตอบ 404)' },
  { id:'30', sev:'LOW', cat:'Content/Trust', phase:5, owner:'Content', team:'Content', support:['Marketing','Dev'],
    title:'คอนเทนต์ไม่ตาม E-E-A-T',
    todo:'สร้าง Author Profile + citation + FAQ + Google Business Profile (ประกันเป็นหมวด YMYL)' },
];

/* ---- State ---- */
let state = { tasks: [], savedAt: null };

function mergeWithSeed(rows){
  const byId = {};
  (rows||[]).forEach(r => byId[r.id] = r);
  return SEED.map(seed => {
    const saved = byId[seed.id];
    return saved
      ? { ...seed, status:saved.status||'todo', note:saved.note||'', owner:saved.owner||seed.owner,
          team:saved.team||seed.team, updated_at:saved.updated_at||null,
          updated_by:saved.updated_by||'', completed_at:saved.completed_at||null }
      : { ...seed, status:'todo', note:'', updated_at:null, updated_by:'', completed_at:null };
  });
}

async function loadFromSupabase(){
  const { data, error } = await sb.from('tasks').select('*');
  if (error) console.warn('load error:', error.message);
  const rows = data || [];
  // seed: if DB is empty, upsert all seed tasks
  if (rows.length === 0){
    const seedRows = SEED.map(t => ({ id:t.id, status:'todo', team:t.team, owner:t.owner, note:'', updated_by:'', updated_at:null, completed_at:null }));
    await sb.from('tasks').upsert(seedRows, { onConflict:'id' });
  }
  state.tasks = mergeWithSeed(rows.length ? rows : SEED.map(t=>({id:t.id})));
  state.savedAt = new Date().toISOString();
}

async function saveTask(id, changes){
  // auto-set completed_at when status changes to done
  if (changes.status === 'done' && !changes.completed_at){
    changes.completed_at = new Date().toISOString();
  }
  // clear completed_at if un-done
  if (changes.status && changes.status !== 'done'){
    changes.completed_at = null;
  }
  changes.updated_at = new Date().toISOString();
  changes.updated_by = currentUser();
  const { error } = await sb.from('tasks').upsert({ id, ...changes }, { onConflict:'id' });
  if (error){ console.error('save error:', error.message); toast('บันทึกไม่สำเร็จ'); return; }
  // local state will update via real-time subscription
}

/* ---- Helpers ---- */
const STATUS_LABEL = { todo:'ยังไม่เริ่ม', progress:'กำลังทำ', blocked:'ติดขัด', done:'เสร็จ' };
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function fmtDate(iso){
  if(!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('th-TH',{day:'2-digit',month:'short',year:'2-digit'}) +
         ' ' + d.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});
}

function toast(msg){
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(()=>el.classList.remove('show'), 2200);
}

/* ---- Filters state ---- */
const filters = { q:'', sev:'', status:'', team:'', view:'phase' };

function applyFilters(tasks){
  return tasks.filter(t => {
    if (filters.sev && t.sev !== filters.sev) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (filters.team){
      const inTeam = t.team === filters.team || (t.support && t.support.includes(filters.team));
      if (!inTeam) return false;
    }
    if (filters.q){
      const hay = (t.id + ' ' + t.title + ' ' + t.todo + ' ' + t.cat + ' ' + (t.note||'') + ' ' + (t.owner||'')).toLowerCase();
      if (!hay.includes(filters.q.toLowerCase())) return false;
    }
    return true;
  });
}

/* ---- Dashboard ---- */
function renderDash(){
  const t = state.tasks;
  const total = t.length;
  const done = t.filter(x=>x.status==='done').length;
  const prog = t.filter(x=>x.status==='progress').length;
  const block = t.filter(x=>x.status==='blocked').length;
  const todo = t.filter(x=>x.status==='todo').length;
  const high = t.filter(x=>x.sev==='HIGH');
  const highDone = high.filter(x=>x.status==='done').length;
  const pct = total ? Math.round(done/total*100) : 0;
  const highPct = high.length ? Math.round(highDone/high.length*100) : 0;

  // team workload (primary owner)
  const teamStat = tm => {
    const items = t.filter(x=>x.team===tm);
    const d = items.filter(x=>x.status==='done').length;
    return { total:items.length, done:d, pct: items.length?Math.round(d/items.length*100):0 };
  };
  const dev = teamStat('Dev'), con = teamStat('Content'), mkt = teamStat('Marketing');
  const teamRow = `
    <div class="card progress-card">
      <div style="font-size:13px"><b>ภาระงานแยกทีม (เจ้าภาพ)</b></div>
      <div class="team-grid">
        ${teamMini('Dev', dev, 'var(--primary)')}
        ${teamMini('Content', con, 'var(--green)')}
        ${teamMini('Marketing', mkt, 'var(--amber)')}
      </div>
    </div>`;

  $('#dash').innerHTML = `
    <div class="card stat"><div class="num">${pct}%</div><div class="lbl">ความคืบหน้ารวม</div><div class="sub">${done}/${total} งานเสร็จ</div></div>
    <div class="card stat"><div class="num" style="color:var(--accent)">${highDone}/${high.length}</div><div class="lbl">HIGH เสร็จแล้ว</div><div class="sub">${highPct}% ของงานเร่งด่วน</div></div>
    <div class="card stat"><div class="num" style="color:var(--primary)">${prog}</div><div class="lbl">กำลังทำ</div></div>
    <div class="card stat"><div class="num" style="color:var(--amber)">${block}</div><div class="lbl">ติดขัด</div></div>
    <div class="card stat"><div class="num" style="color:var(--ink-faint)">${todo}</div><div class="lbl">ยังไม่เริ่ม</div></div>
    <div class="card progress-card">
      <div style="display:flex;justify-content:space-between;font-size:13px"><b>ความคืบหน้าโครงการ</b><span style="color:var(--muted)">อัปเดตล่าสุด: ${fmtDate(state.savedAt)||'—'}${currentUser()?' · คุณ: '+escapeHtml(currentUser()):''}</span></div>
      <div class="pbar">
        <i class="done" style="width:${done/total*100}%"></i>
        <i class="prog" style="width:${prog/total*100}%"></i>
        <i class="block" style="width:${block/total*100}%"></i>
      </div>
      <div class="legend">
        <span><i class="swatch" style="background:var(--green)"></i>เสร็จ ${done}</span>
        <span><i class="swatch" style="background:var(--primary)"></i>กำลังทำ ${prog}</span>
        <span><i class="swatch" style="background:var(--amber)"></i>ติดขัด ${block}</span>
        <span><i class="swatch" style="background:var(--ink-faint)"></i>ยังไม่เริ่ม ${todo}</span>
      </div>
    </div>
    ${teamRow}`;
}

function teamMini(name, s, color){
  return `<div class="team-mini">
    <div class="tm-top"><span style="color:${color};font-weight:800">${name}</span><span style="color:var(--ink-soft)">${s.done}/${s.total}</span></div>
    <div class="pbar" style="height:9px;margin-top:6px"><i style="width:${s.total?s.done/s.total*100:0}%;background:${color}"></i></div>
    <div style="font-size:11px;color:var(--ink-faint);margin-top:4px">${s.pct}% เสร็จ · เจ้าภาพ ${s.total} งาน</div>
  </div>`;
}

/* ---- Task card ---- */
function taskCard(t){
  const noteHtml = t.note ? `<div class="t-note"><b>โน้ต:</b> ${escapeHtml(t.note)}</div>` : '';
  const by = t.updated_by ? ` โดย ${escapeHtml(t.updated_by)}` : '';
  const upd = t.updated_at ? `<span class="t-updated">อัปเดต ${fmtDate(t.updated_at)}${by}</span>` : '';
  const done = t.completed_at ? `<span class="t-done-at">✅ เสร็จ ${fmtDate(t.completed_at)}</span>` : '';
  const ro = !canEdit();
  const statusLabel = { todo:'● ยังไม่เริ่ม', progress:'● กำลังทำ', blocked:'● ติดขัด', done:'● เสร็จ' }[t.status] || t.status;
  const controls = ro
    ? `<span class="status-sel status-static" data-st="${t.status}">${statusLabel}</span>
       ${SHEET_MAP[t.id] ? `<button class="mini-btn excel" data-sheet="${t.id}">📊 ดูข้อมูล Excel</button>` : ''}
       ${done}${upd}`
    : `<select class="status-sel" data-st="${t.status}" data-id="${t.id}">
            <option value="todo" ${t.status==='todo'?'selected':''}>● ยังไม่เริ่ม</option>
            <option value="progress" ${t.status==='progress'?'selected':''}>● กำลังทำ</option>
            <option value="blocked" ${t.status==='blocked'?'selected':''}>● ติดขัด</option>
            <option value="done" ${t.status==='done'?'selected':''}>● เสร็จ</option>
          </select>
          <button class="mini-btn" data-edit="${t.id}">✎ แก้ไข / โน้ต</button>
          ${SHEET_MAP[t.id] ? `<button class="mini-btn excel" data-sheet="${t.id}">📊 ดูข้อมูล Excel</button>` : ''}
          ${done}${upd}`;
  return `
  <div class="task ${t.status==='done'?'done':''}" data-sev="${t.sev}" data-id="${t.id}">
    <div class="t-top">
      <div class="t-id">#${t.id}</div>
      <div class="t-main">
        <div class="t-title">${escapeHtml(t.title)}</div>
        <div class="t-badges">
          <span class="badge sev-${t.sev}">${t.sev}</span>
          <span class="badge cat">${escapeHtml(t.cat)}</span>
          <span class="badge team team-${t.team}">🏷️ ${escapeHtml(t.team)}</span>
          ${(t.support&&t.support.length)?`<span class="badge support">+ ${t.support.map(escapeHtml).join(', ')}</span>`:''}
        </div>
        <div class="t-todo">${escapeHtml(t.todo)}</div>
        ${noteHtml}
        <div class="t-controls">
          ${controls}
        </div>
      </div>
    </div>
  </div>`;
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ---- Render list (3 view modes) ---- */
function renderList(){
  const list = applyFilters(state.tasks);
  const wrap = $('#taskList');
  if (!list.length){ wrap.innerHTML = '<div class="empty">ไม่พบงานที่ตรงกับตัวกรอง</div>'; return; }

  let html = '';
  if (filters.view === 'phase'){
    Object.keys(PHASES).forEach(p => {
      const items = list.filter(t => String(t.phase)===p);
      if (!items.length) return;
      html += `<div class="phase-group"><div class="phase-head"><span class="pnum">${p}</span>${PHASES[p].name} <small>· ${PHASES[p].desc} (${items.length})</small></div>`;
      html += items.map(taskCard).join('');
      html += `</div>`;
    });
  } else if (filters.view === 'severity'){
    ['HIGH','MEDIUM','LOW'].forEach(sev => {
      const items = list.filter(t => t.sev===sev);
      if (!items.length) return;
      html += `<div class="phase-group"><div class="phase-head"><span class="pnum" style="background:${sev==='HIGH'?'var(--accent)':sev==='MEDIUM'?'var(--amber)':'var(--primary)'}">${sev[0]}</span>${sev} <small>(${items.length} งาน)</small></div>`;
      html += items.map(taskCard).join('');
      html += `</div>`;
    });
  } else if (filters.view === 'team'){
    const teamColor = { Dev:'var(--primary)', Content:'var(--green)', Marketing:'var(--amber)' };
    ['Dev','Content','Marketing'].forEach(team => {
      const items = list.filter(t => t.team===team);
      if (!items.length) return;
      html += `<div class="phase-group"><div class="phase-head"><span class="pnum" style="background:${teamColor[team]||'var(--primary)'}">${team[0]}</span>ทีม ${team} <small>(เจ้าภาพ ${items.length} งาน)</small></div>`;
      html += items.map(taskCard).join('');
      html += `</div>`;
    });
  } else {
    html = [...list].sort((a,b)=>a.id.localeCompare(b.id)).map(taskCard).join('');
  }
  wrap.innerHTML = html;
}

function render(){ renderDash(); renderList(); }

/* ---- Update helpers ---- */
async function updateTask(id, changes){
  if (!canEdit()){ toast('สิทธิ์ดูอย่างเดียว ไม่สามารถแก้ไขได้'); return; }
  // optimistic local update for snappy UI
  const t = state.tasks.find(x=>x.id===id);
  if (t) Object.assign(t, changes);
  render();
  await saveTask(id, changes);
}

/* ---- Modal ---- */
let editingId = null;
function openModal(id){
  const t = state.tasks.find(x=>x.id===id);
  if (!t) return;
  editingId = id;
  $('#mTitle').textContent = `#${t.id} — ${t.title}`;
  $('#mSub').textContent = t.todo;
  $('#mStatus').value = t.status;
  $('#mTeam').value = t.team || 'Dev';
  $('#mOwner').value = t.owner || '';
  $('#mNote').value = t.note || '';
  $('#modalBg').classList.add('open');
}
function closeModal(){ $('#modalBg').classList.remove('open'); editingId = null; }

/* ---- Sheet viewer (Excel All-Links integration) ---- */
const sheetCache = {};
let sheetState = { taskId:null, sheets:[], active:0, q:'' };

async function fetchSheet(file){
  if (sheetCache[file]) return sheetCache[file];
  const res = await fetch('data/' + file);
  if (!res.ok) throw new Error('โหลดไฟล์ไม่ได้ (' + res.status + ')');
  const data = await res.json();
  sheetCache[file] = data;
  return data;
}

function isUrl(s){ return /^https?:\/\//i.test(s); }

function renderSheetTable(data){
  const body = $('#sBody');
  const rows = data.rows || [];
  // Sheet layout: row0 = title, row1 = source note, row2 = headers, row3+ = data
  let headerRow = 2, dataStart = 3;
  // some sheets may differ; detect header row as the one with most non-empty cells among first 4
  let best = 2, bestCount = 0;
  for (let i=0;i<Math.min(4,rows.length);i++){
    const c = (rows[i]||[]).filter(x=>x&&x.trim()).length;
    if (c > bestCount){ bestCount = c; best = i; }
  }
  headerRow = best; dataStart = best + 1;
  const headers = rows[headerRow] || [];
  let dataRows = rows.slice(dataStart);

  const q = sheetState.q.toLowerCase();
  if (q) dataRows = dataRows.filter(r => r.join(' ').toLowerCase().includes(q));

  // accurate issue-row count from SHEET_MAP (raw totalRows includes trailing empty XML rows)
  const meta = (sheetState.sheets[sheetState.active]) || {};
  const realCount = meta.rows;
  $('#sCount').textContent = realCount
    ? `แสดง ${dataRows.length} แถว · จำนวนจริงในรายงาน ${realCount.toLocaleString()} รายการ`
    : `แสดง ${dataRows.length} แถว`;

  if (!headers.length){ body.innerHTML = '<div class="sheet-loading">ไม่มีข้อมูลในชีตนี้</div>'; return; }

  let html = '<table class="sheet"><thead><tr>';
  headers.forEach(h => { if (h && h.trim()) html += `<th>${escapeHtml(h)}</th>`; });
  html += '</tr></thead><tbody>';
  const colCount = headers.filter(h=>h&&h.trim()).length;
  dataRows.forEach(r => {
    html += '<tr>';
    for (let i=0;i<colCount;i++){
      const v = r[i] || '';
      html += `<td>${isUrl(v) ? `<a href="${escapeHtml(v)}" target="_blank" rel="noopener">${escapeHtml(v)}</a>` : escapeHtml(v)}</td>`;
    }
    html += '</tr>';
  });
  html += '</tbody></table>';
  body.innerHTML = html;
}

async function loadActiveSheet(){
  const s = sheetState.sheets[sheetState.active];
  $('#sBody').innerHTML = '<div class="sheet-loading">กำลังโหลดข้อมูล...</div>';
  $('#sNote').textContent = '';
  try {
    const data = await fetchSheet(s.file);
    renderSheetTable(data);
    const realCount = s.rows || 0;
    if (realCount > (data.shownRows||0)){
      $('#sNote').textContent = `หมายเหตุ: รายงานนี้มี ${realCount.toLocaleString()} รายการ แสดงตัวอย่าง ${data.shownRows} แถวแรกเพื่อความเร็ว — ดูครบทั้งหมดได้ในไฟล์ Excel ต้นฉบับ`;
    }
  } catch(err){
    $('#sBody').innerHTML = `<div class="sheet-loading">โหลดไม่สำเร็จ: ${escapeHtml(err.message)}<br><small>ต้องเปิดผ่าน web server (เช่น localhost) ไม่ใช่ file://</small></div>`;
  }
}

function renderSheetTabs(){
  const tabs = $('#sTabs');
  if (sheetState.sheets.length <= 1){ tabs.innerHTML = ''; return; }
  tabs.innerHTML = sheetState.sheets.map((s,i) =>
    `<button class="sheet-tab ${i===sheetState.active?'active':''}" data-tab="${i}">${escapeHtml(s.label)}</button>`
  ).join('');
}

function openSheet(taskId){
  const sheets = SHEET_MAP[taskId];
  if (!sheets) return;
  const t = state.tasks.find(x=>x.id===taskId);
  sheetState = { taskId, sheets, active:0, q:'' };
  $('#sTitle').textContent = `#${taskId} — ${t ? t.title : ''}`;
  $('#sSub').textContent = 'ข้อมูลจากไฟล์ Excel: 2026-09-23 - www.tipinsure.com - All Links';
  $('#sSearch').value = '';
  renderSheetTabs();
  $('#sheetBg').classList.add('open');
  loadActiveSheet();
}
function closeSheet(){ $('#sheetBg').classList.remove('open'); }

/* ---- Export / Import ---- */
function exportJSON(){
  const blob = new Blob([JSON.stringify(state, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0,10);
  a.href = url;
  a.download = `tipinsure-seo-tracker-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('ดาวน์โหลดไฟล์สำรองแล้ว');
}

function importJSON(file){
  if (!canEdit()){ toast('สิทธิ์ดูอย่างเดียว'); return; }
  const reader = new FileReader();
  reader.onload = async e => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed.tasks || !Array.isArray(parsed.tasks)) throw new Error('รูปแบบไฟล์ไม่ถูกต้อง');
      // write each task to Supabase
      const rows = parsed.tasks.map(t => ({
        id: t.id, status: t.status||'todo', team: t.team||null, owner: t.owner||'',
        note: t.note||'', updated_by: t.updated_by||t.updatedBy||'',
        updated_at: t.updated_at||t.updatedAt||null, completed_at: t.completed_at||t.completedAt||null
      }));
      const { error } = await sb.from('tasks').upsert(rows, { onConflict:'id' });
      if (error) throw new Error(error.message);
      await loadFromSupabase();
      render();
      toast('นำเข้าข้อมูลสำเร็จ');
    } catch(err){
      alert('นำเข้าไม่สำเร็จ: ' + err.message);
    }
  };
  reader.readAsText(file);
}

/* ---- Report export (CSV + printable HTML) ---- */
function downloadBlob(content, filename, type){
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function csvCell(v){
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
}

// describe active filters as a human-readable string (empty if none)
function filterSummary(){
  const parts = [];
  if (filters.sev) parts.push(`ระดับ: ${filters.sev}`);
  if (filters.status) parts.push(`สถานะ: ${STATUS_LABEL[filters.status]||filters.status}`);
  if (filters.team) parts.push(`ทีม: ${filters.team}`);
  if (filters.q) parts.push(`ค้นหา: "${filters.q}"`);
  return parts.join(' · ');
}
function hasActiveFilter(){ return !!(filters.sev || filters.status || filters.team || filters.q); }

function exportCSV(scope){
  const tasks = scope === 'filtered' ? applyFilters(state.tasks) : state.tasks;
  const cols = ['#','ระดับ','หมวด','ทีมหลัก','ทีมสนับสนุน','ชื่องาน','สิ่งที่ต้องทำ','สถานะ','ผู้รับผิดชอบ','โน้ต','อัปเดตโดย','อัปเดตล่าสุด','วันที่เสร็จ'];
  const rows = [...tasks].sort((a,b)=>a.id.localeCompare(b.id)).map(t => [
    t.id, t.sev, t.cat, t.team, (t.support||[]).join('; '),
    t.title, t.todo, STATUS_LABEL[t.status]||t.status, t.owner||'',
    t.note||'', t.updated_by||'', t.updated_at ? fmtDate(t.updated_at) : '', t.completed_at ? fmtDate(t.completed_at) : ''
  ]);
  const suffix = scope === 'filtered' ? '-filtered' : '';
  const csv = '\uFEFF' + [cols, ...rows].map(r => r.map(csvCell).join(',')).join('\r\n');
  downloadBlob(csv, `tipinsure-seo-report${suffix}-${new Date().toISOString().slice(0,10)}.csv`, 'text/csv;charset=utf-8');
  toast(`ดาวน์โหลด CSV แล้ว (${tasks.length} งาน)`);
}

function buildReportHTML(scope){
  const isFiltered = scope === 'filtered';
  const t = isFiltered ? applyFilters(state.tasks) : state.tasks;
  const total = t.length;
  const done = t.filter(x=>x.status==='done').length;
  const prog = t.filter(x=>x.status==='progress').length;
  const block = t.filter(x=>x.status==='blocked').length;
  const todo = t.filter(x=>x.status==='todo').length;
  const pct = total ? Math.round(done/total*100) : 0;
  const high = t.filter(x=>x.sev==='HIGH');
  const highDone = high.filter(x=>x.status==='done').length;
  const now = new Date().toLocaleString('th-TH',{dateStyle:'long',timeStyle:'short'});
  const fSummary = isFiltered ? filterSummary() : '';
  const filterBanner = fSummary
    ? `<div class="fbanner">📌 รายงานเฉพาะที่กรอง — ${escapeHtml(fSummary)} (${total} งาน)</div>` : '';

  // teamStat uses the report's task set (t) so it reflects the filter scope
  const teamStat = tm => {
    const items = t.filter(x=>x.team===tm);
    const d = items.filter(x=>x.status==='done').length;
    return { total:items.length, done:d, pct: items.length?Math.round(d/items.length*100):0 };
  };
  const teams = [['Dev',teamStat('Dev')],['Content',teamStat('Content')],['Marketing',teamStat('Marketing')]]
    .filter(([,s]) => s.total > 0);

  const statusPill = st => {
    const map = { done:['#e4f6ee','#1e9e6a','เสร็จ'], progress:['#eef0ff','#1E22AA','กำลังทำ'],
      blocked:['#fdf2dc','#b7791f','ติดขัด'], todo:['#f5f6fb','#5b6275','ยังไม่เริ่ม'] };
    const [bg,fg,label] = map[st]||map.todo;
    return `<span style="background:${bg};color:${fg};padding:2px 10px;border-radius:999px;font-size:11px;font-weight:700;white-space:nowrap">${label}</span>`;
  };
  const sevPill = sev => {
    const map = { HIGH:['#fde7e6','#bd1d14'], MEDIUM:['#fdf2dc','#b7791f'], LOW:['#eef0ff','#1E22AA'] };
    const [bg,fg] = map[sev]||map.LOW;
    return `<span style="background:${bg};color:${fg};padding:2px 9px;border-radius:999px;font-size:10.5px;font-weight:700">${sev}</span>`;
  };

  const esc = escapeHtml;
  const phaseNames = PHASES;
  let taskRows = '';
  Object.keys(phaseNames).forEach(p => {
    const items = [...t].filter(x=>String(x.phase)===p).sort((a,b)=>a.id.localeCompare(b.id));
    if (!items.length) return;
    taskRows += `<tr class="phase-row"><td colspan="6">${esc(phaseNames[p].name)} — ${esc(phaseNames[p].desc)}</td></tr>`;
    items.forEach(x => {
      taskRows += `<tr>
        <td class="c-id">#${esc(x.id)}</td>
        <td>${sevPill(x.sev)}</td>
        <td><div class="c-title">${esc(x.title)}</div><div class="c-todo">${esc(x.todo)}</div>${x.note?`<div class="c-note"><b>โน้ต:</b> ${esc(x.note)}</div>`:''}</td>
        <td class="c-team">${esc(x.team)}${(x.support&&x.support.length)?`<div class="c-sup">+${x.support.map(esc).join(', ')}</div>`:''}</td>
        <td>${statusPill(x.status)}</td>
        <td class="c-owner">${esc(x.owner||'-')}</td>
      </tr>`;
    });
  });

  const teamCards = teams.map(([name,s]) => `
    <div class="tcard">
      <div class="tc-top"><b>${name}</b><span>${s.done}/${s.total}</span></div>
      <div class="tc-bar"><i style="width:${s.total?s.done/s.total*100:0}%"></i></div>
      <div class="tc-sub">${s.pct}% เสร็จ · เจ้าภาพ ${s.total} งาน</div>
    </div>`).join('');

  return `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8">
<title>รายงานความคืบหน้า SEO — TIPINSURE</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Noto Sans Thai',system-ui,sans-serif;color:#0b1020;background:#fff;line-height:1.6;padding:32px}
  .rpt{max-width:1000px;margin:0 auto}
  .rhead{background:linear-gradient(135deg,#0a0c3a,#1a1d8c);color:#fff;padding:28px 32px;border-radius:18px;margin-bottom:24px}
  .rhead h1{font-size:22px;font-weight:800}
  .rhead p{font-size:13px;opacity:.8;margin-top:4px}
  .stats{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:20px}
  .scard{border:1px solid #e9ebf2;border-radius:14px;padding:16px;text-align:center}
  .scard .n{font-size:26px;font-weight:800;color:#1E22AA}
  .scard .l{font-size:11.5px;color:#5b6275;margin-top:4px}
  .bigbar{height:16px;border-radius:999px;background:#f5f6fb;overflow:hidden;display:flex;margin:8px 0 20px}
  .bigbar i{height:100%;display:block}
  .teams{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:26px}
  .tcard{border:1px solid #e9ebf2;border-radius:14px;padding:14px}
  .tc-top{display:flex;justify-content:space-between;font-size:13px}
  .tc-bar{height:9px;border-radius:999px;background:#f5f6fb;overflow:hidden;margin:7px 0 5px}
  .tc-bar i{display:block;height:100%;background:#1E22AA}
  .tc-sub{font-size:11px;color:#858ca0}
  h2.sec{font-size:15px;margin:22px 0 12px;padding-bottom:8px;border-bottom:2px solid #e9ebf2}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{background:linear-gradient(to right,#0a0c3a,#1a1d8c);color:#fff;text-align:left;padding:10px;font-weight:700}
  td{padding:9px 10px;border-bottom:1px solid #e9ebf2;vertical-align:top}
  .phase-row td{background:#eef0ff;color:#1E22AA;font-weight:700;font-size:12px}
  .c-id{font-weight:800;color:#1E22AA;white-space:nowrap}
  .c-title{font-weight:700;font-size:12.5px}
  .c-todo{font-size:11px;color:#5b6275;margin-top:2px}
  .c-note{font-size:11px;color:#5b6275;margin-top:4px;background:#f5f6fb;padding:5px 8px;border-radius:8px}
  .c-team{font-size:11.5px;font-weight:600}
  .c-sup{font-size:10px;color:#858ca0;font-weight:400}
  .c-owner{font-size:11.5px;color:#5b6275}
  .fbanner{background:#eef0ff;color:#1E22AA;border:1px solid #dfe1ff;border-radius:12px;
    padding:10px 16px;font-size:12.5px;font-weight:600;margin-bottom:20px}
  .rfoot{margin-top:24px;text-align:center;font-size:11px;color:#858ca0}
  @media print{body{padding:0}.rhead{border-radius:0}.no-print{display:none}}
</style></head>
<body><div class="rpt">
  <div class="rhead"><h1>รายงานความคืบหน้าโครงการ SEO — TIPINSURE</h1>
    <p>แก้ปัญหา Technical Onsite Audit (www.tipinsure.com) · ออกรายงานเมื่อ ${now}</p></div>
  ${filterBanner}
  <div class="stats">
    <div class="scard"><div class="n">${pct}%</div><div class="l">ความคืบหน้ารวม</div></div>
    <div class="scard"><div class="n" style="color:#bd1d14">${highDone}/${high.length}</div><div class="l">HIGH เสร็จแล้ว</div></div>
    <div class="scard"><div class="n">${prog}</div><div class="l">กำลังทำ</div></div>
    <div class="scard"><div class="n" style="color:#b7791f">${block}</div><div class="l">ติดขัด</div></div>
    <div class="scard"><div class="n" style="color:#858ca0">${todo}</div><div class="l">ยังไม่เริ่ม</div></div>
  </div>
  <div class="bigbar">
    <i style="width:${total?done/total*100:0}%;background:#1e9e6a"></i>
    <i style="width:${total?prog/total*100:0}%;background:#1E22AA"></i>
    <i style="width:${total?block/total*100:0}%;background:#b7791f"></i>
  </div>
  ${teams.length ? `<h2 class="sec">ภาระงานแยกทีม</h2><div class="teams">${teamCards}</div>` : ''}
  <h2 class="sec">รายละเอียดงาน${isFiltered?'ที่กรอง':'ทั้งหมด'} (${total} ข้อ)</h2>
  ${total ? `<table><thead><tr><th>#</th><th>ระดับ</th><th>งาน</th><th>ทีม</th><th>สถานะ</th><th>ผู้รับผิดชอบ</th></tr></thead>
    <tbody>${taskRows}</tbody></table>` : '<p style="color:#5b6275;padding:20px 0">ไม่มีงานที่ตรงกับตัวกรอง</p>'}
  <div class="rfoot">TIPINSURE SEO Project Tracker · เอกสารสร้างอัตโนมัติ</div>
</div></body></html>`;
}

function exportReportHTML(scope){
  const suffix = scope === 'filtered' ? '-filtered' : '';
  const html = buildReportHTML(scope);
  downloadBlob(html, `tipinsure-seo-report${suffix}-${new Date().toISOString().slice(0,10)}.html`, 'text/html;charset=utf-8');
  toast('ดาวน์โหลดรายงาน HTML แล้ว (เปิดแล้วสั่งพิมพ์เป็น PDF ได้)');
}

function printReport(scope){
  const w = window.open('', '_blank');
  if (!w){ alert('เบราว์เซอร์บล็อก popup — อนุญาต popup แล้วลองใหม่'); return; }
  w.document.write(buildReportHTML(scope));
  w.document.close();
  w.onload = () => { w.focus(); w.print(); };
}

/* ---- Wire up events ---- */
function subscribeRealtime(){
  sb.channel('tasks-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, payload => {
      // update local state from remote change
      const row = payload.new;
      if (!row || !row.id) return;
      const t = state.tasks.find(x=>x.id===row.id);
      if (t){
        Object.assign(t, { status:row.status, team:row.team, owner:row.owner, note:row.note,
          updated_at:row.updated_at, updated_by:row.updated_by, completed_at:row.completed_at });
      }
      state.savedAt = new Date().toISOString();
      render();
    })
    .subscribe();
}

async function init(){
  await loadFromSupabase();
  render();
  subscribeRealtime();

  // Filters
  $('#search').addEventListener('input', e => { filters.q = e.target.value; renderList(); });
  $('#fSeverity').addEventListener('change', e => { filters.sev = e.target.value; renderList(); });
  $('#fStatus').addEventListener('change', e => { filters.status = e.target.value; renderList(); });
  $('#fTeam').addEventListener('change', e => { filters.team = e.target.value; renderList(); });
  $('#fView').addEventListener('change', e => { filters.view = e.target.value; renderList(); });

  // Delegated clicks/changes on task list
  $('#taskList').addEventListener('change', e => {
    if (!canEdit()) return;
    const sel = e.target.closest('.status-sel');
    if (sel){ updateTask(sel.dataset.id, { status: sel.value }); }
  });
  $('#taskList').addEventListener('click', e => {
    const editBtn = e.target.closest('[data-edit]');
    if (editBtn){
      if (!canEdit()){ toast('สิทธิ์ดูอย่างเดียว'); return; }
      openModal(editBtn.dataset.edit);
      return;
    }
    const sheetBtn = e.target.closest('[data-sheet]');
    if (sheetBtn){ openSheet(sheetBtn.dataset.sheet); }
  });

  // Sheet viewer events
  $('#sClose').addEventListener('click', closeSheet);
  $('#sheetBg').addEventListener('click', e => { if (e.target.id==='sheetBg') closeSheet(); });
  $('#sTabs').addEventListener('click', e => {
    const tab = e.target.closest('[data-tab]');
    if (tab){ sheetState.active = +tab.dataset.tab; sheetState.q=''; $('#sSearch').value=''; renderSheetTabs(); loadActiveSheet(); }
  });
  $('#sSearch').addEventListener('input', e => {
    sheetState.q = e.target.value;
    const s = sheetState.sheets[sheetState.active];
    if (sheetCache[s.file]) renderSheetTable(sheetCache[s.file]);
  });

  // Modal
  $('#mCancel').addEventListener('click', closeModal);
  $('#modalBg').addEventListener('click', e => { if (e.target.id==='modalBg') closeModal(); });
  $('#mSave').addEventListener('click', () => {
    if (!editingId || !canEdit()) return;
    updateTask(editingId, {
      status: $('#mStatus').value,
      team: $('#mTeam').value,
      owner: $('#mOwner').value.trim(),
      note: $('#mNote').value.trim(),
    });
    closeModal();
    toast('บันทึกแล้ว');
  });
  document.addEventListener('keydown', e => { if (e.key==='Escape'){ closeModal(); closeSheet(); } });

  // Report menu
  const reportMenu = $('#reportMenu');
  $('#btnReportMenu').addEventListener('click', e => {
    e.stopPropagation();
    const lbl = $('#menuFilterLabel');
    const n = applyFilters(state.tasks).length;
    lbl.textContent = hasActiveFilter()
      ? `เฉพาะที่กรองอยู่ — ${filterSummary()} (${n} งาน)`
      : `เฉพาะที่กรองอยู่ (ยังไม่ได้กรอง = ทั้ง ${n} งาน)`;
    reportMenu.classList.toggle('open');
  });
  document.addEventListener('click', () => reportMenu.classList.remove('open'));
  reportMenu.addEventListener('click', e => {
    const item = e.target.closest('[data-report]');
    if (!item) return;
    reportMenu.classList.remove('open');
    const scope = item.dataset.scope;
    const kind = item.dataset.report;
    if (kind === 'pdf') printReport(scope);
    else if (kind === 'html') exportReportHTML(scope);
    else if (kind === 'csv') exportCSV(scope);
  });

  // Toolbar
  $('#btnExport').addEventListener('click', exportJSON);
  const importBtn = $('#btnImport'); if (importBtn) importBtn.addEventListener('click', () => $('#fileImport').click());
  $('#fileImport').addEventListener('change', e => {
    if (e.target.files[0]) importJSON(e.target.files[0]);
    e.target.value = '';
  });
  const resetBtn = $('#btnReset');
  if (resetBtn) resetBtn.addEventListener('click', async () => {
    if (!canEdit()){ toast('สิทธิ์ดูอย่างเดียว'); return; }
    if (confirm('รีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้น?\n\nแนะนำให้กด Export JSON เก็บไว้ก่อน')){
      const seedRows = SEED.map(t => ({ id:t.id, status:'todo', team:t.team, owner:t.owner, note:'', updated_by:'', updated_at:null, completed_at:null }));
      await sb.from('tasks').upsert(seedRows, { onConflict:'id' });
      await loadFromSupabase();
      render();
      toast('รีเซ็ตเรียบร้อย');
    }
  });

  // Hide write-only buttons if readonly
  if (!canEdit()){
    $$('.write-only').forEach(el => el.style.display = 'none');
  }
}

// Called by auth.js after login (may re-init if role changed)
window.onTrackerAuth = function(role, name){
  // re-render so readonly state reflects
  if (state.tasks.length) render();
  if (!canEdit()) $$('.write-only').forEach(el => el.style.display = 'none');
};

document.addEventListener('DOMContentLoaded', init);
