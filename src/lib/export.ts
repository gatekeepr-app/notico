import JSZip from "jszip";

export function downloadAsMdx(title: string, content: string) {
  const slug = title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase() || "untitled";
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}.mdx`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadAsHtml(title: string, html: string) {
  const slug = title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase() || "untitled";
  const full = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>body{max-width:720px;margin:40px auto;padding:0 20px;font-family:-apple-system,sans-serif;line-height:1.6;color:#1d1d1f}img{max-width:100%}code{background:#f5f5f7;padding:2px 6px;border-radius:4px;font-size:.9em}pre code{display:block;padding:16px;overflow-x:auto}</style></head><body>${html}</body></html>`;
  const blob = new Blob([full], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadAllAsZip(notes: any[]) {
  const zip = new JSZip();
  for (const note of notes) {
    const slug = note.title?.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase() || "untitled";
    const filename = `${slug}.mdx`;
    zip.file(filename, note.content || "");
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `notico-export-${new Date().toISOString().slice(0, 10)}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
