"use client";
import React from "react";
import DOMPurify from "dompurify";
import he from "he";
import UniversalHtmlRenderer from "./UniversalHtmlRenderer";

export default function RichContentRenderer({ content }) {
  const decodeAndSanitize = (input = "") => {
    const decoded = he.decode(input);
    return DOMPurify.sanitize(decoded, {
      USE_PROFILES: { html: true },
    });
  };

  const sanitizedRichtext = content.richtext ? decodeAndSanitize(content.richtext) : null;
  const sanitizedText = content.text ? decodeAndSanitize(content.text) : null;

  return (
    <>
      {sanitizedRichtext && <UniversalHtmlRenderer html={sanitizedRichtext} />}
      {sanitizedText && <UniversalHtmlRenderer html={sanitizedText} />}
    </>
  );
}
