import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { getDocumentUrl } from '../utils/links';

export default function QrDialog({ document, onClose, onMessage }) {
  const dialogRef = useRef(null);
  const [qrImage, setQrImage] = useState('');
  const link = document ? getDocumentUrl(document.publicId) : '';

  useEffect(() => {
    if (!document) { dialogRef.current?.close(); return; }
    QRCode.toDataURL(link, { width: 420, margin: 2, color: { dark: '#184f3e', light: '#ffffff' } }).then(setQrImage);
    dialogRef.current?.showModal();
  }, [document, link]);

  const copyLink = async () => { await navigator.clipboard.writeText(link); onMessage('تم نسخ رابط المستند'); };

  return <dialog ref={dialogRef} className="qr-dialog" onCancel={onClose}>
    <div className="dialog-head"><div><h2>رابط وQR المستند</h2><p>{document?.title}</p></div><button className="icon-btn" onClick={onClose}>×</button></div>
    {qrImage && <img className="qr-image" src={qrImage} alt={`QR ${document?.title}`} />}
    <label>الرابط العام<div className="link-field"><input value={link} readOnly dir="ltr" /><button type="button" className="secondary-btn" onClick={copyLink}>نسخ</button></div></label>
    <div className="dialog-actions"><button className="secondary-btn" onClick={onClose}>إغلاق</button><a className="primary-btn qr-download" href={qrImage} download={`QR-${document?.title}.png`}>تحميل QR</a></div>
  </dialog>;
}
