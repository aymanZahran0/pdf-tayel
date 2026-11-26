const seedDocs=[
 {id:'seed-1',title:'Brand Guidelines 2026',size:2480000,date:'Nov 22, 2026',url:null},
 {id:'seed-2',title:'Annual Impact Report',size:4150000,date:'Nov 18, 2026',url:null},
 {id:'seed-3',title:'Product Handbook',size:1890000,date:'Nov 09, 2026',url:null},
 {id:'seed-4',title:'Employee Onboarding Guide',size:3240000,date:'Oct 28, 2026',url:null},
 {id:'seed-5',title:'Sustainability Overview',size:1620000,date:'Oct 17, 2026',url:null},
 {id:'seed-6',title:'Q3 Performance Summary',size:930000,date:'Oct 04, 2026',url:null}
];
let docs=JSON.parse(localStorage.getItem('paperly-docs')||'null')||seedDocs;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function save(){localStorage.setItem('paperly-docs',JSON.stringify(docs.map(d=>({...d,url:d.url?.startsWith('blob:')?null:d.url}))));}
function size(n){return n>=1e6?(n/1e6).toFixed(1)+' MB':Math.round(n/1000)+' KB'}
function esc(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function render(filter=''){
 const shown=docs.filter(d=>d.title.toLowerCase().includes(filter.toLowerCase()));
 $('#documentGrid').innerHTML=shown.map(d=>`<article class="doc-card"><div class="doc-preview"><span class="pdf-badge">PDF</span><div class="sheet"></div></div><div class="doc-info"><h3 title="${esc(d.title)}">${esc(d.title)}</h3><div class="doc-meta"><span>${size(d.size)}</span><span>${d.date}</span></div><div class="card-actions"><button class="view-btn" data-viewpdf="${d.id}">Preview</button><a class="download-btn" ${d.url?`href="${d.url}" download="${esc(d.title)}.pdf"`:'href="#" data-demo'}>Download</a></div></div></article>`).join('');
 $('#documentCount').textContent=`${shown.length} document${shown.length===1?'':'s'}`;$('#emptyState').classList.toggle('hidden',shown.length>0);
 $('#adminRows').innerHTML=docs.map(d=>`<div class="table-row"><div class="file-cell"><span class="file-icon">PDF</span><strong>${esc(d.title)}</strong></div><span>${size(d.size)}</span><span>${d.date}</span><button class="delete-btn" data-delete="${d.id}" aria-label="Delete ${esc(d.title)}">⌫</button></div>`).join('');
 $('#totalStat').textContent=docs.length;$('#adminCount').textContent=`${docs.length} files`;$('#storageStat').textContent=size(docs.reduce((a,d)=>a+d.size,0));$('#lastStat').textContent=docs[0]?.date?.split(',')[0]||'—';
}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
function switchView(name){$$('.view').forEach(v=>v.classList.remove('active'));$(`#${name}View`).classList.add('active');$$('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.view===name));}
$$('.nav-link').forEach(b=>b.onclick=()=>switchView(b.dataset.view));
$('#searchInput').oninput=e=>render(e.target.value);document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();$('#searchInput').focus()}});
$('#loginForm').onsubmit=e=>{e.preventDefault();if($('#email').value==='admin@paperly.co'&&$('#password').value==='admin123'){$('#loginPanel').classList.add('hidden');$('#dashboard').classList.remove('hidden');$('#loginError').textContent=''}else $('#loginError').textContent='Incorrect email or password.'};
$('#showPassword').onclick=()=>$('#password').type=$('#password').type==='password'?'text':'password';
$('#logoutBtn').onclick=()=>{$('#dashboard').classList.add('hidden');$('#loginPanel').classList.remove('hidden');toast('Signed out successfully')};
$('#openUpload').onclick=()=>$('#uploadDialog').showModal();$$('[data-close]').forEach(b=>b.onclick=()=>$('#uploadDialog').close());
$('#pdfFile').onchange=e=>$('#fileName').textContent=e.target.files[0]?.name||'';
$('#uploadForm').onsubmit=e=>{e.preventDefault();const f=$('#pdfFile').files[0];if(!f||f.type!=='application/pdf'){toast('Please choose a valid PDF file');return}if(f.size>20e6){toast('File must be smaller than 20 MB');return}$('#progressWrap').classList.remove('hidden');let p=0;const timer=setInterval(()=>{p+=20;$('#progressBar').value=p;$('#progressText').textContent=p+'%';if(p>=100){clearInterval(timer);docs.unshift({id:crypto.randomUUID(),title:$('#docTitle').value.trim(),size:f.size,date:new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}),url:URL.createObjectURL(f)});save();render();setTimeout(()=>{$('#uploadDialog').close();$('#uploadForm').reset();$('#fileName').textContent='';$('#progressWrap').classList.add('hidden');toast('Document uploaded successfully')},250)}},120)};
document.addEventListener('click',e=>{const del=e.target.closest('[data-delete]');if(del&&confirm('Delete this document? This action cannot be undone.')){docs=docs.filter(d=>d.id!==del.dataset.delete);save();render();toast('Document deleted')}const demo=e.target.closest('[data-demo]');if(demo){e.preventDefault();toast('Upload a PDF to enable downloading')}const view=e.target.closest('[data-viewpdf]');if(view){const d=docs.find(x=>x.id===view.dataset.viewpdf);if(!d.url){toast('Upload a PDF to preview it in this demo');return}$('#viewerTitle').textContent=d.title;$('#pdfViewer').src=d.url;$('#viewerDownload').href=d.url;$('#viewerDownload').download=d.title+'.pdf';$('#viewerDialog').showModal()}});
$$('[data-viewer-close]').forEach(b=>b.onclick=()=>{$('#viewerDialog').close();$('#pdfViewer').src='' });render();
