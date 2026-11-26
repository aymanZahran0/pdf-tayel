export function getDocumentUrl(publicId) {
  return `${window.location.origin}/pdf/${encodeURIComponent(publicId)}`;
}
