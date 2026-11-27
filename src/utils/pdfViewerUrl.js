const nativeOptions = "#toolbar=0&navpanes=0&scrollbar=0&view=Fit";

export function getPdfViewerUrl(pdfUrl) {
  return `${pdfUrl}${nativeOptions}`;
}

export function isMobilePdfBrowser() {
  return (
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  );
}

export function getMobileDirectPdfUrl(pdfUrl) {
  return `/api/pdf?source=${encodeURIComponent(pdfUrl)}`;
}
