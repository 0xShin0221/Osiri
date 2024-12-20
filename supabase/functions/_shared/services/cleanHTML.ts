export function cleanHTML(html: string): string {
  html = html.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "");

  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

  html = html.replace(/<!--[\s\S]*?-->/g, "");

  html = html.replace(/\s+/g, " ");

  html = html.replace(/^\s*[\r\n]/gm, "");

  return html.trim();
}
