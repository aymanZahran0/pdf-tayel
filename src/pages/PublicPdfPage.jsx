import { Link, useParams } from 'react-router-dom';

export default function PublicPdfPage({ documents, loading }) {
  const { publicId } = useParams();
  const document = documents.find(item => item.publicId === publicId);

  if (loading) return <main className="public-pdf-state"><span className="brand-mark">ط</span><div className="pdf-loading-spinner" /><h1>جارٍ فتح المستند...</h1><p>يتم تحميل ملف PDF، انتظر لحظات.</p></main>;
  if (!document) return <main className="public-pdf-state"><span className="brand-mark">ط</span><h1>المستند غير موجود</h1><p>قد يكون الرابط غير صحيح أو تم حذف المستند.</p><Link className="primary-btn" to="/">العودة إلى المكتبة</Link></main>;
  if (!document.url) return <main className="public-pdf-state"><span className="brand-mark">ط</span><h1>{document.title}</h1><p>بيانات المستند موجودة، لكن ملف PDF يحتاج إلى التخزين في الباك إند ليعمل من جميع الأجهزة.</p><Link className="primary-btn" to="/">العودة إلى المكتبة</Link></main>;

  return <main className="public-pdf-page">
    <header className="public-pdf-header"><Link className="brand" to="/"><span className="brand-mark">ط</span><span>طايل</span></Link><strong>{document.title}</strong><a className="primary-btn" href={document.url} download={`${document.title}.pdf`}>تحميل</a></header>
    <iframe src={document.url} title={document.title} />
  </main>;
}
