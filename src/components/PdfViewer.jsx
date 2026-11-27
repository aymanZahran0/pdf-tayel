import { useEffect, useRef, useState } from "react";
import { downloadPdfFile } from "../utils/downloadPdf";
import PdfCanvasViewer from "./PdfCanvasViewer";
import { getPdfViewerUrl, isMobilePdfBrowser } from "../utils/pdfViewerUrl";
export default function PdfViewer({ document, onClose }) {
  const ref = useRef();
  const [downloading, setDownloading] = useState(false);
  useEffect(() => {
    document ? ref.current?.showModal() : ref.current?.close();
  }, [document]);
  const download = async () => {
    if (!document?.url || downloading) return;
    setDownloading(true);
    try {
      await downloadPdfFile(document.url, document.title);
    } finally {
      setDownloading(false);
    }
  };
  return (
    <dialog ref={ref} className="viewer-dialog" onCancel={onClose}>
      <div className="viewer-head">
        <strong>{document?.title}</strong>
        <div>
          <button
            className="secondary-btn viewer-download-btn"
            type="button"
            onClick={download}
            disabled={downloading}
          >
            {downloading ? (
              <span
                className="download-button-spinner dark"
                aria-hidden="true"
              />
            ) : (
              "تحميل"
            )}
          </button>
          <button className="icon-btn" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
      {document?.url && isMobilePdfBrowser() && <PdfCanvasViewer url={document.url} />}
      {document?.url && !isMobilePdfBrowser() && (
        <iframe
          className="viewer-native-pdf"
          src={getPdfViewerUrl(document.url)}
          title={document.title}
        />
      )}
    </dialog>
  );
}
