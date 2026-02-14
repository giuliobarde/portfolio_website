import { asLink, LinkField } from "@prismicio/client";

/** Pixel offset for scroll-to-section calculations to account for sticky header height */
export const HEADER_SCROLL_OFFSET = 100;

/**
 * Extracts a URL string from a Prismic LinkField, handling all link types
 * including Web, Document, and Any (where hash links are in the text property).
 */
export function extractPrismicUrl(link: LinkField): string {
  const linkUrl = asLink(link);

  if (typeof linkUrl === "string") {
    return linkUrl;
  }

  if (linkUrl && typeof linkUrl === "object" && "url" in linkUrl) {
    const urlValue = (linkUrl as { url?: string }).url;
    if (typeof urlValue === "string") {
      return urlValue;
    }
  }

  if (link && typeof link === "object") {
    if (
      "link_type" in link &&
      link.link_type === "Web" &&
      "url" in link &&
      typeof link.url === "string"
    ) {
      return link.url;
    }
    if (
      "link_type" in link &&
      link.link_type === "Document" &&
      "url" in link &&
      typeof link.url === "string"
    ) {
      return link.url;
    }
    if (
      "link_type" in link &&
      link.link_type === "Any" &&
      "text" in link &&
      typeof link.text === "string"
    ) {
      return link.text;
    }
    if ("text" in link && typeof link.text === "string") {
      return link.text;
    }
  }

  return "";
}
