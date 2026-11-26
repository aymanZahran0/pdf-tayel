import { useMemo,useState } from 'react';
import DocumentCard from '../components/DocumentCard';
import { arabicNumber } from '../utils/format';
export default function LibraryPage({documents,onPreview,onMessage}) {
  const [search,setSearch]=useState('');
  const [sortOrder,setSortOrder]=useState('newest');
  const visibleDocuments=useMemo(()=>documents
    .filter(doc=>doc.title.includes(search.trim()))
    .sort((first,second)=>{
      const firstDate=new Date(first.createdAt||0).getTime();
      const secondDate=new Date(second.createdAt||0).getTime();
      return sortOrder==='newest'?secondDate-firstDate:firstDate-secondDate;
    }),[documents,search,sortOrder]);

  return <section className="view active"><div className="hero"><div className="eyebrow"><span/> مكتبة المستندات</div><h1>كل ما يستحق القراءة،<br/><em>في مكان واحد.</em></h1><p>تصفّح مستنداتك وعاينها وحمّلها بسهولة ومن دون تعقيد.</p><div className="search-wrap"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"/></svg><input value={search} onChange={e=>setSearch(e.target.value)} type="search" placeholder="ابحث في المستندات..."/></div></div><div className="content-shell"><div className="section-heading"><div><h2>أحدث المستندات</h2><p>{arabicNumber(visibleDocuments.length)} مستندات</p></div><label className="sort-control"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h12M8 12h8M8 17h4M4 5v14m0 0-2-2m2 2 2-2"/></svg><select value={sortOrder} onChange={event=>setSortOrder(event.target.value)} aria-label="ترتيب المستندات"><option value="newest">الأحدث أولاً</option><option value="oldest">الأقدم أولاً</option></select><span className="sort-chevron">⌄</span></label></div>{visibleDocuments.length?<div className="document-grid">{visibleDocuments.map(doc=><DocumentCard key={doc.id} document={doc} onPreview={onPreview} onMessage={onMessage}/>)}</div>:<div className="empty-state"><div className="empty-icon">⌕</div><h3>لا توجد مستندات</h3><p>جرّب كلمة بحث أخرى، أو ارفع ملف PDF من لوحة الإدارة.</p></div>}</div></section>;
}
