import { useState } from 'react';
import { formatSize } from "../utils/format";
import { downloadPdfFile } from '../utils/downloadPdf';
export default function DocumentCard({ document, onPreview, onMessage }) {
  const [downloading, setDownloading] = useState(false);
  const download = async () => {
    if (!document.url) {
      onMessage("ارفع ملف PDF أولاً لتفعيل التحميل");
      return;
    }
    setDownloading(true);
    try { await downloadPdfFile(document.url, document.title); }
    catch { onMessage('تعذر تحميل الملف، حاول مرة أخرى'); }
    finally { setDownloading(false); }
  };
  return (
    <article className="doc-card">
      <div className="doc-preview">
        <span className="pdf-badge">PDF</span>
        <div className="sheet" />
      </div>
      <div className="doc-info">
        <h3>{document.title}</h3>
        <div className="doc-meta">
          <span>{formatSize(document.size)}</span>
          <span>{document.date}</span>
        </div>
        <div className="card-actions">
          <button className="view-btn" onClick={() => onPreview(document)}>
            معاينة
          </button>
          <button className="download-btn" type="button" onClick={download} disabled={downloading}>{downloading?<span className="download-button-spinner card" aria-hidden="true"/>:'تحميل'}</button>
        </div>
      </div>
    </article>
  );
}
