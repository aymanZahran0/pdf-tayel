import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PdfCanvasViewer from '../components/PdfCanvasViewer';

export default function PublicPdfPage({ documents, loading }) {
  const { publicId } = useParams();
  const [downloading, setDownloading] = useState(false);
  const document = documents.find(item => item.publicId === publicId);

  const downloadPdf = async () => {
    if (!document?.url || downloading) return;
    setDownloading(true);
    try {
      const response = await fetch(document.url);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = objectUrl;
      link.download = `${document.title}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <main className="public-pdf-state"><span className="brand-mark">ط</span><div className="pdf-loading-spinner" /><h1>جارٍ فتح المستند...</h1><p>يتم تحميل ملف PDF، انتظر لحظات.</p></main>;
  if (!document) return <main className="public-pdf-state"><span className="brand-mark">ط</span><h1>المستند غير موجود</h1><p>قد يكون الرابط غير صحيح أو تم حذف المستند.</p><Link className="primary-btn" to="/">العودة إلى المكتبة</Link></main>;
  if (!document.url) return <main className="public-pdf-state"><span className="brand-mark">ط</span><h1>{document.title}</h1><p>بيانات المستند موجودة، لكن ملف PDF يحتاج إلى التخزين في الباك إند ليعمل من جميع الأجهزة.</p><Link className="primary-btn" to="/">العودة إلى المكتبة</Link></main>;

  return <main className="public-pdf-page">
    <header className="public-pdf-header"><Link className="brand" to="/"><span className="brand-mark">ط</span><span>طايل</span></Link><strong>{document.title}</strong><button className="primary-btn direct-download-btn" type="button" onClick={downloadPdf} disabled={downloading} aria-label={downloading?'جارٍ تحميل الملف':'تحميل الملف'}>{downloading?<span className="download-button-spinner" aria-hidden="true"/>:'تحميل'}</button></header>
    <PdfCanvasViewer url={document.url} />
  </main>;
}
