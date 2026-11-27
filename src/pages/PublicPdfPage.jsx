import { Link, useParams } from "react-router-dom";

export default function PublicPdfPage({ documents, loading }) {
  const { publicId } = useParams();
  const document = documents.find((item) => item.publicId === publicId);

  if (loading)
    return (
      <main className="public-pdf-state" dir="rtl">
        <div className="pdf-loading-spinner" />
        <h1>جارٍ فتح المستند...</h1>
        <p>يتم تحميل ملف PDF، انتظر لحظات.</p>
      </main>
    );
  if (!document)
    return (
      <main className="public-pdf-state" dir="rtl">
        <h1>المستند غير موجود</h1>
        <p>قد يكون الرابط غير صحيح أو تم حذف المستند.</p>
        <Link className="primary-btn" to="/">
          العودة إلى المكتبة
        </Link>
      </main>
    );
  if (!document.url)
    return (
      <main className="public-pdf-state" dir="rtl">
        <h1>{document.title}</h1>
        <p>تعذر الوصول إلى ملف PDF المطلوب.</p>
        <Link className="primary-btn" to="/">
          العودة إلى المكتبة
        </Link>
      </main>
    );
  const viewerUrl = `${document.url}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`;

  return (
    <main className="public-pdf-clean-viewer">
      <iframe
        className="public-pdf-native-viewer"
        src={viewerUrl}
        title={document.title}
      />
    </main>
  );
}
