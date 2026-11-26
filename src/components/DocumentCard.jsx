import { formatSize } from "../utils/format";
export default function DocumentCard({ document, onPreview, onMessage }) {
  const download = (e) => {
    if (!document.url) {
      e.preventDefault();
      onMessage("ارفع ملف PDF أولاً لتفعيل التحميل");
    }
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
          <a
            className="download-btn"
            href={document.url || "#"}
            download={`${document.title}.pdf`}
            onClick={download}
          >
            تحميل
          </a>
        </div>
      </div>
    </article>
  );
}
