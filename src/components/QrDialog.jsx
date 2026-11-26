import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { getDocumentUrl } from "../utils/links";

export default function QrDialog({ document, onClose, onMessage }) {
  const dialogRef = useRef(null);
  const resetTimerRef = useRef(null);
  const [qrImage, setQrImage] = useState("");
  const [copied, setCopied] = useState(false);
  const link = document ? getDocumentUrl(document.publicId) : "";

  useEffect(() => {
    if (!document) {
      dialogRef.current?.close();
      setCopied(false);
      return;
    }
    QRCode.toDataURL(link, {
      width: 420,
      margin: 2,
      color: { dark: "#184f3e", light: "#ffffff" },
    }).then(setQrImage);
    dialogRef.current?.showModal();
  }, [document, link]);

  useEffect(() => () => clearTimeout(resetTimerRef.current), []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      onMessage("تعذر نسخ الرابط، انسخه يدوياً");
    }
  };

  return (
    <dialog ref={dialogRef} className="qr-dialog" onCancel={onClose}>
      <div className="dialog-head">
        <div>
          <h2>رابط و QR المستند</h2>
          <p>{document?.title}</p>
        </div>
        <button className="icon-btn" onClick={onClose}>
          ×
        </button>
      </div>
      {qrImage && (
        <img className="qr-image" src={qrImage} alt={`QR ${document?.title}`} />
      )}
      <label>
        الرابط العام
        <div className="link-field">
          <input value={link} readOnly dir="ltr" />
          <button
            type="button"
            className={`secondary-btn copy-link-btn ${copied ? "copied" : ""}`}
            onClick={copyLink}
            disabled={copied}
          >
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m5 12 4 4L19 6" />
                </svg>
                <span>تم النسخ</span>
              </>
            ) : (
              <span>نسخ</span>
            )}
          </button>
        </div>
      </label>
      <div className="dialog-actions">
        <button className="secondary-btn" onClick={onClose}>
          إغلاق
        </button>
        <a
          className="primary-btn qr-download"
          href={qrImage}
          download={`QR-${document?.title}.png`}
        >
          تحميل QR
        </a>
      </div>
    </dialog>
  );
}
