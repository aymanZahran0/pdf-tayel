import { useEffect, useRef, useState } from "react";
export default function SupabaseUploadDialog({
  open,
  onClose,
  onUpload,
  onMessage,
}) {
  const ref = useRef(null);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const validationTimerRef = useRef(null);
  useEffect(() => {
    open ? ref.current?.showModal() : ref.current?.close();
    if (!open) setValidationMessage("");
  }, [open]);

  useEffect(() => () => clearTimeout(validationTimerRef.current), []);

  const showValidation = (message) => {
    setValidationMessage(message);
    clearTimeout(validationTimerRef.current);
    validationTimerRef.current = setTimeout(
      () => setValidationMessage(""),
      3500,
    );
  };

  const selectFile = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      event.target.value = "";
      showValidation("الملف غير مدعوم — اختر ملف PDF فقط");
      return;
    }
    if (selectedFile.size > 20e6) {
      setFile(null);
      event.target.value = "";
      showValidation("حجم الملف أكبر من ٢٠ م.ب");
      return;
    }
    setValidationMessage("");
    setFile(selectedFile);
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!file || file.type !== "application/pdf")
      return showValidation("اختر ملف PDF صحيحاً أولاً");
    if (file.size > 20e6) return showValidation("حجم الملف أكبر من ٢٠ م.ب");
    setUploading(true);
    try {
      await onUpload({ title: title.trim(), file });
      setTitle("");
      setFile(null);
      onClose();
      onMessage("تم رفع المستند بنجاح");
    } catch (error) {
      showValidation(`تعذر رفع الملف: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  return (
    <dialog ref={ref} onCancel={onClose}>
      <form onSubmit={submit}>
        {validationMessage && (
          <div className="upload-dialog-toast" role="alert">
            <span>!</span>
            <strong>{validationMessage}</strong>
          </div>
        )}
        <div className="dialog-head">
          <div>
            <h2>رفع ملف PDF</h2>
            <p>سيتم حفظ الملف في Supabase وإصدار رابط QR ثابت.</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <label>
          عنوان المستند
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="مثال: التقرير السنوي ٢٠٢٦"
            required
          />
        </label>
        <label className="drop-zone">
          <input
            type="file"
            accept="application/pdf"
            onChange={selectFile}
            required
          />
          <span className="upload-icon">⇧</span>
          <strong>اختر ملف PDF</strong>
          <small>الحد الأقصى ٢٠ م.ب</small>
          <em>{file?.name}</em>
        </label>
        {uploading && (
          <div className="progress-wrap">
            <div>
              <span>جارٍ الرفع إلى التخزين...</span>
            </div>
            <progress />
          </div>
        )}
        <div className="dialog-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
            disabled={uploading}
          >
            إلغاء
          </button>
          <button className="primary-btn" disabled={uploading}>
            {uploading ? "جارٍ الرفع..." : "رفع المستند"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
