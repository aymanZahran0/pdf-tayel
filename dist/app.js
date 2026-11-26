const seedDocs=[
 {id:'seed-1',title:'دليل الهوية البصرية ٢٠٢٦',size:2480000,date:'٢٢ نوفمبر ٢٠٢٦',url:null},
 {id:'seed-2',title:'تقرير الأثر السنوي',size:4150000,date:'١٨ نوفمبر ٢٠٢٦',url:null},
 {id:'seed-3',title:'دليل المنتجات',size:1890000,date:'٩ نوفمبر ٢٠٢٦',url:null},
 {id:'seed-4',title:'دليل الموظف الجديد',size:3240000,date:'٢٨ أكتوبر ٢٠٢٦',url:null},
 {id:'seed-5',title:'نظرة عامة على الاستدامة',size:1620000,date:'١٧ أكتوبر ٢٠٢٦',url:null},
 {id:'seed-6',title:'ملخص أداء الربع الثالث',size:930000,date:'٤ أكتوبر ٢٠٢٦',url:null}
];
let docs=JSON.parse(localStorage.getItem('paperly-docs')||'null')||seedDocs;
docs=docs.map(doc=>doc.id?.startsWith('seed-')?(seedDocs.find(item=>item.id===doc.id)||doc):doc);
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function save(){localStorage.setItem('paperly-docs',JSON.stringify(docs.map(d=>({...d,url:d.url?.startsWith('blob:')?null:d.url}))));}
function arNum(value){return String(value).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d])}
function size(n){return n>=1e6?arNum((n/1e6).toFixed(1))+' م.ب':arNum(Math.round(n/1000))+' ك.ب'}
function esc(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function render(filter=''){
 const shown=docs.filter(d=>d.title.toLowerCase().includes(filter.toLowerCase()));
 $('#documentGrid').innerHTML=shown.map(d=>`<article class="doc-card"><div class="doc-preview"><span class="pdf-badge">PDF</span><div class="sheet"></div></div><div class="doc-info"><h3 title="${esc(d.title)}">${esc(d.title)}</h3><div class="doc-meta"><span>${size(d.size)}</span><span>${d.date}</span></div><div class="card-actions"><button class="view-btn" data-viewpdf="${d.id}">معاينة</button><a class="download-btn" ${d.url?`href="${d.url}" download="${esc(d.title)}.pdf"`:'href="#" data-demo'}>تحميل</a></div></div></article>`).join('');
 $('#documentCount').textContent=`${arNum(shown.length)} ${shown.length===1?'مستند':'مستندات'}`;$('#emptyState').classList.toggle('hidden',shown.length>0);
 $('#adminRows').innerHTML=docs.map(d=>`<div class="table-row"><div class="file-cell"><span class="file-icon">PDF</span><strong>${esc(d.title)}</strong></div><span>${size(d.size)}</span><span>${d.date}</span><button class="delete-btn" data-delete="${d.id}" aria-label="حذف ${esc(d.title)}">⌫</button></div>`).join('');
 $('#totalStat').textContent=arNum(docs.length);$('#adminCount').textContent=`${arNum(docs.length)} ملفات`;$('#storageStat').textContent=size(docs.reduce((a,d)=>a+d.size,0));$('#lastStat').textContent=docs[0]?.date||'—';
}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
function switchView(name){$$('.view').forEach(v=>v.classList.remove('active'));$(`#${name}View`).classList.add('active');$$('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.view===name));}
$$('.nav-link').forEach(b=>b.onclick=()=>switchView(b.dataset.view));
$('#searchInput').oninput=e=>render(e.target.value);document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();$('#searchInput').focus()}});
$('#loginForm').onsubmit=e=>{e.preventDefault();if($('#email').value==='admin@paperly.co'&&$('#password').value==='admin123'){$('#loginPanel').classList.add('hidden');$('#dashboard').classList.remove('hidden');document.body.classList.add('admin-mode');$('#loginError').textContent=''}else $('#loginError').textContent='البريد الإلكتروني أو كلمة المرور غير صحيحة.'};
$('#showPassword').onclick=()=>$('#password').type=$('#password').type==='password'?'text':'password';
$('#logoutBtn').onclick=()=>{$('#dashboard').classList.add('hidden');$('#loginPanel').classList.remove('hidden');document.body.classList.remove('admin-mode');toast('تم تسجيل الخروج بنجاح')};
$('#openUpload').onclick=()=>$('#uploadDialog').showModal();$$('[data-close]').forEach(b=>b.onclick=()=>$('#uploadDialog').close());
$('#pdfFile').onchange=e=>$('#fileName').textContent=e.target.files[0]?.name||'';
$('#uploadForm').onsubmit=e=>{e.preventDefault();const f=$('#pdfFile').files[0];if(!f||f.type!=='application/pdf'){toast('من فضلك اختر ملف PDF صحيحاً');return}if(f.size>20e6){toast('يجب ألا يزيد حجم الملف على ٢٠ م.ب');return}$('#progressWrap').classList.remove('hidden');let p=0;const timer=setInterval(()=>{p+=20;$('#progressBar').value=p;$('#progressText').textContent=arNum(p)+'٪';if(p>=100){clearInterval(timer);docs.unshift({id:crypto.randomUUID(),title:$('#docTitle').value.trim(),size:f.size,date:new Date().toLocaleDateString('ar-EG',{year:'numeric',month:'long',day:'numeric'}),url:URL.createObjectURL(f)});save();render();setTimeout(()=>{$('#uploadDialog').close();$('#uploadForm').reset();$('#fileName').textContent='';$('#progressWrap').classList.add('hidden');toast('تم رفع المستند بنجاح')},250)}},120)};
document.addEventListener('click',e=>{const del=e.target.closest('[data-delete]');if(del&&confirm('هل تريد حذف هذا المستند؟ لا يمكن التراجع عن هذا الإجراء.')){docs=docs.filter(d=>d.id!==del.dataset.delete);save();render();toast('تم حذف المستند')}const demo=e.target.closest('[data-demo]');if(demo){e.preventDefault();toast('ارفع ملف PDF أولاً لتفعيل التحميل')}const view=e.target.closest('[data-viewpdf]');if(view){const d=docs.find(x=>x.id===view.dataset.viewpdf);if(!d.url){toast('ارفع ملف PDF لمعاينته في النسخة التجريبية');return}$('#viewerTitle').textContent=d.title;$('#pdfViewer').src=d.url;$('#viewerDownload').href=d.url;$('#viewerDownload').download=d.title+'.pdf';$('#viewerDialog').showModal()}});
$$('[data-viewer-close]').forEach(b=>b.onclick=()=>{$('#viewerDialog').close();$('#pdfViewer').src='' });render();
