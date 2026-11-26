import { useEffect, useRef, useState } from 'react';

function PdfPage({ pdf, pageNumber }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let renderTask;
    let cancelled = false;
    pdf.getPage(pageNumber).then(page => {
      if (cancelled) return;
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.aspectRatio = `${viewport.width} / ${viewport.height}`;
      renderTask = page.render({ canvasContext: context, viewport, transform: pixelRatio === 1 ? null : [pixelRatio, 0, 0, pixelRatio, 0, 0] });
      return renderTask.promise;
    }).catch(error => { if (error?.name !== 'RenderingCancelledException') console.error(error); });
    return () => { cancelled = true; renderTask?.cancel(); };
  }, [pdf, pageNumber]);

  return <div className="pdf-canvas-page"><canvas ref={canvasRef} aria-label={`صفحة ${pageNumber}`} /></div>;
}

export default function PdfCanvasViewer({ url }) {
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let task;
    let cancelled = false;
    Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]).then(([pdfjs, worker]) => {
      if (cancelled) return;
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      task = pdfjs.getDocument({ url });
      return task.promise;
    }).then(document => { if (document && !cancelled) setPdf(document); }).catch(error => { console.error('PDF viewer error:', error); if (!cancelled) setError('تعذر عرض ملف PDF. يمكنك استخدام زر التحميل.'); });
    return () => { cancelled = true; task?.destroy(); };
  }, [url]);

  if (error) return <div className="pdf-viewer-status">{error}</div>;
  if (!pdf) return <div className="pdf-viewer-status"><span className="pdf-loading-spinner" /> جارٍ تجهيز صفحات المستند...</div>;

  return <div className="pdf-canvas-viewer">{Array.from({ length: pdf.numPages }, (_, index) => <PdfPage key={index + 1} pdf={pdf} pageNumber={index + 1} />)}</div>;
}
