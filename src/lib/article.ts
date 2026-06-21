import { load } from "cheerio";

export function getReadingTimeMinutes(html: string, wpm = 200): number {
  const text = load(html).root().text().replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / wpm));
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function extractFaqFromHtml(html: string): {
  html: string;
  faq: FaqItem[];
} {
  const $ = load(html);
  const faq: FaqItem[] = [];

  $("h2").each((_, el) => {
    const heading = $(el).text().trim().toLowerCase();
    if (heading !== "faq" && heading !== "frequently asked questions") return;

    let sibling = $(el).next();
    while (sibling.length && !/^h[1-6]$/i.test(sibling.prop("tagName") ?? "")) {
      if (sibling.is("h3")) {
        const question = sibling.text().trim();
        const answerParts: string[] = [];
        let answerNode = sibling.next();
        while (
          answerNode.length &&
          !answerNode.is("h2") &&
          !answerNode.is("h3")
        ) {
          answerParts.push(answerNode.text().trim());
          answerNode = answerNode.next();
        }
        const answer = answerParts.filter(Boolean).join(" ");
        if (question && answer) faq.push({ question, answer });
        sibling = answerNode;
        continue;
      }
      sibling = sibling.next();
    }
  });

  return { html, faq };
}
