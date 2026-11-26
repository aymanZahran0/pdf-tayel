import { formatSize, arabicNumber } from "../utils/format";
export default function AdminTable({ documents, onDelete, onQr }) {
  return (
    <div className="admin-table">
      <div className="table-title">
        <h2>كل المستندات</h2>
        <span>{arabicNumber(documents.length)} ملفات</span>
      </div>
      <div className="table-row table-head">
        <span>المستند</span>
        <span>الحجم</span>
        <span>تاريخ الرفع</span>
        <span>الإجراءات</span>
      </div>
      <div>
        {documents.map((doc) => (
          <div className="table-row" key={doc.id}>
            <div className="file-cell">
              <span className="file-icon">PDF</span>
              <strong>{doc.title}</strong>
            </div>
            <span>{formatSize(doc.size)}</span>
            <span>{doc.date}</span>
            <div className="row-actions">
              <button
                className="qr-btn"
                onClick={() => onQr(doc)}
                aria-label={`QR ${doc.title}`}
              >
                QR
              </button>
              <button
                className="delete-btn"
                onClick={() => onDelete(doc)}
                aria-label={`حذف ${doc.title}`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M9 6V4h6v2m4 0-1 14H6L5 6m5 4v6m4-6v6" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
