import sanitizeHtml from "sanitize-html";
import { load } from "cheerio";

const ALLOWED_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "br",
  "hr",
  "ul",
  "ol",
  "li",
  "blockquote",
  "strong",
  "em",
  "u",
  "s",
  "a",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "figure",
  "figcaption",
  "div",
  "span",
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height", "loading"],
  th: ["colspan", "rowspan"],
  td: ["colspan", "rowspan"],
  "*": ["id", "class"],
};

export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function addHeadingIds(html: string): {
  html: string;
  toc: TocItem[];
} {
  const $ = load(html);
  const toc: TocItem[] = [];

  $("h2, h3, h4").each((_, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    if (!text) return;

    const baseId = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let id = baseId || "section";
    let counter = 1;
    while ($(`#${id}`).length > 0) {
      id = `${baseId}-${counter++}`;
    }

    $el.attr("id", id);
    toc.push({
      id,
      text,
      level: parseInt(el.tagName.replace("h", ""), 10),
    });
  });

  return { html: $.html(), toc };
}

export function processArticleContent(rawHtml: string): {
  html: string;
  toc: TocItem[];
} {
  const sanitized = sanitizeContent(rawHtml);
  return addHeadingIds(sanitized);
}
