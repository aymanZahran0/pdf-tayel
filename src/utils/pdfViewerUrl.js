const nativeOptions = "#toolbar=0&navpanes=0&scrollbar=0&view=Fit";

export function getPdfViewerUrl(pdfUrl) {
  const isMobileBrowser =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobileBrowser) {
    return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(pdfUrl)}`;
  }

  return `${pdfUrl}${nativeOptions}`;
}
