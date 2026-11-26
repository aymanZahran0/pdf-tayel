import { useEffect, useRef } from 'react';

export default function ConfirmDeleteDialog({ document, deleting, onCancel, onConfirm }) {
  const dialogRef = useRef(null);
  useEffect(() => { document ? dialogRef.current?.showModal() : dialogRef.current?.close(); }, [document]);
  return <dialog ref={dialogRef} className="confirm-dialog" onCancel={onCancel}>
    <div className="confirm-trash" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 6h18M9 6V4h6v2m4 0-1 14H6L5 6m5 4v6m4-6v6" /></svg></div>
    <h2>حذف المستند؟</h2>
    <p>سيتم حذف <strong>«{document?.title}»</strong> نهائياً من المكتبة والتخزين، ولا يمكن التراجع عن هذا الإجراء.</p>
    <div className="confirm-actions"><button className="secondary-btn" onClick={onCancel} disabled={deleting}>إلغاء</button><button className="danger-btn" onClick={onConfirm} disabled={deleting}>{deleting?'جارٍ الحذف...':'نعم، احذف المستند'}</button></div>
  </dialog>;
}
