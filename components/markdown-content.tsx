import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNodeText(node: any): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  if (Array.isArray(node.children)) return node.children.map(getNodeText).join("");
  return "";
}

// Shared by the public article page and the admin editor preview.
export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        /* ── Headings ── */
        h1: ({ children }) => (
          <h1 className="font-heading text-3xl font-bold mt-12 mb-5 text-foreground scroll-mt-24">{children}</h1>
        ),
        h2: ({ node, children }) => {
          const id = slugify(getNodeText(node));
          return (
            <h2 id={id} className="font-heading text-2xl font-bold mt-10 mb-4 text-foreground scroll-mt-24">
              {children}
            </h2>
          );
        },
        h3: ({ children }) => (
          <h3 className="font-heading text-xl font-bold mt-8 mb-3 text-foreground">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="font-heading text-lg font-semibold mt-6 mb-2 text-foreground">{children}</h4>
        ),
        h5: ({ children }) => (
          <h5 className="font-heading text-base font-semibold mt-5 mb-1.5 text-foreground">{children}</h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-xs font-bold mt-4 mb-1 text-muted-foreground uppercase tracking-widest">{children}</h6>
        ),

        /* ── Paragraphs ── */
        p: ({ children }) => (
          <p className="text-[17px] leading-[1.85] text-foreground/75 my-5 tracking-[0.01em]">{children}</p>
        ),

        /* ── Lists ── */
        ul: ({ children }) => (
          <ul className="my-6 space-y-2 pl-6 list-disc marker:text-blue-500">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="my-6 space-y-2 pl-6 list-decimal marker:text-blue-500 marker:font-bold">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-[17px] leading-[1.75] text-foreground/75 pl-1">{children}</li>
        ),

        /* ── Inline formatting ── */
        strong: ({ children }) => (
          <strong className="font-bold text-foreground">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-foreground/90">{children}</em>
        ),
        del: ({ children }) => (
          <del className="line-through text-muted-foreground">{children}</del>
        ),

        /* ── Links ── */
        a: ({ href, children }) => (
          <a href={href} className="text-blue-600 underline decoration-blue-300 underline-offset-2 hover:decoration-blue-600 transition-colors" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),

        /* ── Blockquote ── */
        blockquote: ({ children }) => (
          <blockquote className="my-8 pl-6 border-l-4 border-blue-500 bg-blue-50/50 py-4 pr-4 rounded-r-xl text-[17px] italic text-foreground/70 leading-relaxed">
            {children}
          </blockquote>
        ),

        /* ── Code ── */
        pre: ({ children }) => (
          <pre className="my-6 overflow-x-auto rounded-xl bg-zinc-950 px-5 py-4 text-sm leading-relaxed">
            {children}
          </pre>
        ),
        code: ({ className, children }) => {
          const isBlock = Boolean(className?.startsWith("language-"));
          const lang = className?.replace("language-", "");
          if (isBlock) {
            return (
              <code className="font-mono text-zinc-100 block" data-lang={lang}>
                {children}
              </code>
            );
          }
          return (
            <code className="bg-muted px-1.5 py-0.5 rounded text-[14px] font-mono text-blue-600">
              {children}
            </code>
          );
        },

        /* ── Table ── */
        table: ({ children }) => (
          <div className="my-8 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-muted/60 border-b border-border">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-border">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="transition-colors hover:bg-muted/30">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-foreground">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-foreground/75">{children}</td>
        ),

        /* ── HR ── */
        hr: () => <hr className="my-10 border-border" />,

        /* ── Task list checkbox ── */
        input: ({ checked }) => (
          <input type="checkbox" checked={checked ?? false} readOnly className="mr-2 h-4 w-4 rounded border-border accent-blue-500 cursor-default" />
        ),

        /* ── Images ── */
        img: ({ src, alt }) => (
          <span className="block my-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} className="rounded-xl w-full object-cover" />
            {alt && <span className="block text-center text-sm text-muted-foreground mt-2 italic">{alt}</span>}
          </span>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
