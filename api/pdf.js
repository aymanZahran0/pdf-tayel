export const config = { runtime: "edge" };

export default async function handler(request) {
  const requestUrl = new URL(request.url);
  const source = requestUrl.searchParams.get("source");

  if (!source) return new Response("Missing PDF source", { status: 400 });

  let pdfUrl;
  try {
    pdfUrl = new URL(source);
  } catch {
    return new Response("Invalid PDF source", { status: 400 });
  }

  const isAllowedSupabasePdf =
    pdfUrl.protocol === "https:" &&
    pdfUrl.hostname.endsWith(".supabase.co") &&
    pdfUrl.pathname.includes("/storage/v1/object/public/pdfs/");

  if (!isAllowedSupabasePdf) {
    return new Response("PDF source is not allowed", { status: 403 });
  }

  const upstream = await fetch(pdfUrl, { redirect: "follow" });
  if (!upstream.ok || !upstream.body) {
    return new Response("Unable to load PDF", { status: upstream.status || 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
