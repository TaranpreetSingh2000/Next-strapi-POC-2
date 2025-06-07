"use client";
import React from "react";
import DOMPurify from "dompurify";
import he from "he";
import UniversalHtmlRenderer from "./UniversalHtmlRenderer";

export default function RichContentRenderer({ content }) {
  // const decoded = he.decode(content);
  // const sanitized = DOMPurify.sanitize(decoded, {
  //   USE_PROFILES: { html: true },
  // });

  debugger;
  return (
    // <div
    //   className="prose max-w-none"
    //   dangerouslySetInnerHTML={{ __html: sanitized }}
    // />
    <UniversalHtmlRenderer html={content} />
  );
}
