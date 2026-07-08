/**
 * Minimal allowlist HTML sanitizer for `richText`/`imageText` block content.
 *
 * All HTML passed through here comes from our own typed JSON in /content,
 * hand-authored or extracted from the original WordPress site (see
 * global-constraints.md) — it is not user-submitted at request time. Even so,
 * we don't trust it blindly: a bad extraction could carry over a stray
 * <script>, inline event handler, or style tag, so every tag is checked
 * against a small allowlist before it reaches `dangerouslySetInnerHTML`.
 *
 * Behaviour:
 * - <script>/<style> blocks (tag + contents) are removed entirely.
 * - HTML comments are stripped.
 * - Any tag not in ALLOWED_TAGS is stripped, but the text between tags is
 *   preserved (we only remove the tag markup, not its content).
 * - Allowed tags have ALL attributes stripped except `href` on <a>, which is
 *   itself validated against a small protocol allowlist (http(s), mailto,
 *   tel, or an internal "/" path) and falls back to "#" otherwise. External
 *   links get target="_blank" rel="noopener noreferrer" added back.
 */

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "ul",
  "ol",
  "li",
  "a",
  "h2",
  "h3",
  "h4",
]);

const VOID_TAGS = new Set(["br"]);

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function sanitizeAnchorAttrs(attrs: string): string {
  const hrefMatch = attrs.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)')/i);
  const rawHref = (hrefMatch ? hrefMatch[2] ?? hrefMatch[3] ?? "" : "").trim();
  const isSafe = /^(https?:|mailto:|tel:)/i.test(rawHref) || /^\/(?!\/)/.test(rawHref);
  const safeHref = isSafe ? rawHref : "#";
  const isExternal = /^https?:/i.test(safeHref);

  return isExternal
    ? `<a href="${escapeAttr(safeHref)}" target="_blank" rel="noopener noreferrer">`
    : `<a href="${escapeAttr(safeHref)}">`;
}

export function sanitizeHtml(html: string | undefined | null): string {
  if (!html) return "";

  // Drop script/style tags and their contents entirely.
  let out = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");

  // Strip HTML comments (can hide conditional/legacy markup).
  out = out.replace(/<!--[\s\S]*?-->/g, "");

  // Walk every remaining tag and keep only the allowlisted ones, stripped
  // down to zero attributes (href on <a> is the sole exception).
  out = out.replace(
    /<\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g,
    (match, rawTag: string, attrs: string) => {
      const tag = rawTag.toLowerCase();
      const isClosing = match.startsWith("</");

      if (!ALLOWED_TAGS.has(tag)) {
        return "";
      }

      if (isClosing) {
        return VOID_TAGS.has(tag) ? "" : `</${tag}>`;
      }

      if (tag === "a") {
        return sanitizeAnchorAttrs(attrs);
      }

      return VOID_TAGS.has(tag) ? `<${tag} />` : `<${tag}>`;
    }
  );

  return out;
}
