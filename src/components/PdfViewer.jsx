import { useEffect, useRef } from "react";
export default function PdfViewer({ document, onClose }) {
  const ref = useRef();
  useEffect(() => {
    document ? ref.current?.showModal() : ref.current?.close();
  }, [document]);
  return (
    <dialog ref={ref} className="viewer-dialog" onCancel={onClose}>
      <div className="viewer-head">
        <strong>{document?.title}</strong>
        <div>
          <a
            className="secondary-btn"
            href={document?.url}
            download={`${document?.title}.pdf`}
          >
            تحميل
          </a>
          <button className="icon-btn" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
      {document && (
        <iframe id="pdfViewer" src={document.url} title="معاينة ملف PDF" />
      )}
    </dialog>
  );
}
