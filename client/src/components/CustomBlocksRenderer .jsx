"use client";

import React from "react";
import parse from "html-react-parser";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import Typography from "@mui/material/Typography"; // Assuming you're using MUI
import Link from "next/link"; // Replace if using React Router

// Helper to decode unicode HTML entities
const decodeHtml = (text) =>
  text
    .replace(/\\u003C/g, "<")
    .replace(/\\u003E/g, ">")
    .replace(/\\u002F/g, "/")
    .replace(/\\"/g, '"');

const CustomBlocksRenderer = ({ content }) => {
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        paragraph: ({ children }) => {
          const hasHtmlCode =
            children.length === 1 &&
            children[0].props?.text &&
            children[0].props?.code;

          if (hasHtmlCode) {
            const htmlString = decodeHtml(children[0].props.text);
            return <div className="overflow-x-auto">{parse(htmlString)}</div>;
          }

          return <p className="text-gray-900 p-3">{children}</p>;
        },

        heading: ({ children, level }) => {
          switch (level) {
            case 1:
              return <Typography variant="h1">{children}</Typography>;
            case 2:
              return <Typography variant="h2">{children}</Typography>;
            case 3:
              return <Typography variant="h3">{children}</Typography>;
            case 4:
              return <Typography variant="h4">{children}</Typography>;
            case 5:
              return <Typography variant="h5">{children}</Typography>;
            case 6:
              return <Typography variant="h6">{children}</Typography>;
            default:
              return <Typography variant="h1">{children}</Typography>;
          }
        },

        // ✅ Quote block
        quote: ({ children }) => (
          <blockquote className="border-l-2 border-gray-800 pl-4 italic text-gray-700 my-4">
            {children}
          </blockquote>
        ),

        // ✅ List block
        list: ({ children, format }) => {
          if (format === "ordered") {
            return <ol className="list-decimal ml-6 mb-4">{children}</ol>;
          }
          return <ul className="list-disc ml-6 mb-4">{children}</ul>;
        },

        // ✅ List item block
        listItem: ({ children }) => {
          return <li className="mb-1">{children}</li>;
        },

        // ✅ Link
        link: ({ children, url }) => <Link href={url}>{children}</Link>,
      }}
      modifiers={{
        bold: ({ children }) => <strong>{children}</strong>,
        italic: ({ children }) => <em>{children}</em>,
        code: ({ children }) => (
          <code className="bg-gray-100 p-1 rounded text-sm">{children}</code>
        ),
      }}
    />
  );
};

export default CustomBlocksRenderer;
