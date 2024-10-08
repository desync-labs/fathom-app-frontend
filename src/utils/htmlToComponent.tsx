import DOMPurify from "dompurify";
import { ReactNode } from "react";

export const htmlToComponent = (html: string): ReactNode => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(html),
      }}
    ></div>
  );
};

export const htmlToSanitize = (html: string) => {
  return DOMPurify.sanitize(html);
};

export const stripTags = (html: string) => {
  const element = document.createElement("div");
  element.innerHTML = html;
  return (element.textContent || element.innerText || "")
    .trim()
    .replace(/(<([^>]+)>)/gi, "");
};
