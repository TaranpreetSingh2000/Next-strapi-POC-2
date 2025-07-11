import React from "react";
import parse, { domToReact } from "html-react-parser";

// Helper to convert "style" string into React-style object
function parseStyleString(styleString) {
  const style = {};
  styleString.split(";").forEach((rule) => {
    const [key, value] = rule.split(":");
    if (!key || !value) return;
    const camelKey = key
      .trim()
      .replace(/-([a-z])/g, (_, char) => char.toUpperCase()); // replace '-' with undefined
    style[camelKey] = value.trim();
  });
  return style;
}

// Tailwind-based class styling per tag
const tagClasses = {
  // Headings
  h1: "text-4xl font-bold my-4",
  h2: "text-3xl font-semibold my-3",
  h3: "text-2xl font-medium my-2",
  h4: "text-xl font-medium my-2",
  h5: "text-lg font-medium my-2",
  h6: "text-base font-semibold my-2",

  // Text & Lists
  p: "text-base my-2",
  ul: "list-disc pl-6 my-2",
  ol: "list-decimal pl-6 my-2",
  li: "my-1",
  strong: "font-bold",
  b: "font-bold",
  i: "italic",
  em: "italic",
  u: "underline",
  mark: "bg-yellow-200 text-black px-1 rounded",
  small: "text-sm text-gray-500",
  del: "line-through",
  ins: "underline decoration-dashed",
  sub: "align-sub text-xs",
  sup: "align-super text-xs",

  // Links & Media
  a: "text-blue-600 underline hover:text-blue-800",
  img: "my-4 max-w-full rounded",
  video: "w-full my-4",
  audio: "w-full my-4",
  iframe: "w-full h-64 my-4",
  source: "",

  // Code & Block
  blockquote: "border-l-4 pl-4 italic text-gray-600 my-2",
  pre: "bg-gray-800 text-white p-4 overflow-x-auto rounded my-4",
  code: "bg-gray-100 text-red-600 px-1 rounded",

  // Tables
  table: "table-auto border-collapse border my-4",
  thead: "bg-gray-100",
  tbody: "",
  tfoot: "bg-gray-100",
  tr: "",
  th: "border px-4 py-2 text-left",
  td: "border px-4 py-2",

  // Structural & Semantic
  br: "",
  hr: "my-4 border-t",
  div: "my-2",
  span: "",
  section: "my-4",
  article: "my-4 p-4 border rounded-md",
  aside: "bg-gray-50 p-4 border-l-4 border-gray-200",
  nav: "my-2",
  header: "mb-4",
  footer: "mt-4 text-sm text-gray-500",
  main: "my-4",

  // HTML5 & Interactive
  figure: "my-4",
  figcaption: "text-sm text-gray-500 text-center mt-2",
  details: "my-2",
  summary: "cursor-pointer font-semibold",
  time: "text-sm text-gray-500",
  label: "block text-sm font-medium mb-1",
  input: "border px-2 py-1 rounded w-full mb-2",
  textarea: "border px-2 py-1 rounded w-full mb-2",
  button: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700",
  form: "my-4 space-y-4",
  select: "border px-2 py-1 rounded w-full",
  option: "",
};

// Tags that should not have children (React void elements)
const voidElements = [
  "br",
  "hr",
  "img",
  "input",
  "meta",
  "link",
  "area",
  "base",
  "col",
  "embed",
  "source",
  "track",
  "wbr",
];

const UniversalHtmlRenderer = ({ html }) => {
  
  const options = {
    replace: (domNode) => {
      if (domNode.type === "tag") {
        const { name, attribs = {}, children } = domNode;
        const Tag = name;

        // Convert inline style string to React style object
        if (attribs.style) {
          attribs.style = parseStyleString(attribs.style);
        }

        const className = tagClasses[name] || ""; // render classes based on data

        // Add className only if it's not already present
        const props = {
          ...attribs,
          className: attribs.class
            ? `${attribs.class} ${className}`
            : className,
        };

        // Handle void/self-closing tags
        if (voidElements.includes(name)) {
          return <Tag {...props} />;
        }

        return <Tag {...props}>{domToReact(children, options)}</Tag>; // parse the dom nodes children
      }
      if (domNode.type === "text") {
        const text = domNode.data.trim();
        const imageRegex = /(https?:\/\/[^\s]+?\.(avif|png|jpe?g|svg|webp))/i;

        const match = text.match(imageRegex);
        if (match) {
          const imageUrl = match[1];
          return (
            <img
              src={imageUrl}
              alt="auto-detected"
              className={tagClasses["img"] || ""}
            />
          );
        }
      }
    },
  };

  return <div>{parse(html, options)}</div>; // loading an entire HTML document into memory
};

export default UniversalHtmlRenderer;
