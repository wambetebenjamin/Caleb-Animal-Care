import { cn } from "@/lib/utils";

/**
 * Bundled MDX-compatible renderer for library articles.
 * Supports the authoring subset used in src/content/library:
 * ## / ### headings, paragraphs, unordered + ordered lists, **bold**,
 * *italic*, > blockquotes and [links](url).
 */

function inline(text: string): React.ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return tokens.map((token, i) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-heading">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      return <em key={i}>{token.slice(1, -1)}</em>;
    }
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={i} href={link[2]} className="font-bold text-pine underline underline-offset-2">
          {link[1]}
        </a>
      );
    }
    return <span key={i}>{token}</span>;
  });
}

export function MdxArticle({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: React.ReactNode[] = [];
  let key = 0;
  let listBuffer: { ordered: boolean; items: string[] } | null = null;
  let paraBuffer: string[] = [];

  const flushList = () => {
    if (!listBuffer) return;
    const { ordered, items } = listBuffer;
    const Tag = ordered ? "ol" : "ul";
    blocks.push(
      <Tag
        key={`list-${key++}`}
        className={cn(
          "my-4 space-y-2 pl-5 text-[15px] leading-relaxed text-body",
          ordered ? "list-decimal" : "list-disc",
        )}
      >
        {items.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </Tag>,
    );
    listBuffer = null;
  };

  const flushPara = () => {
    if (paraBuffer.length === 0) return;
    blocks.push(
      <p key={`p-${key++}`} className="my-4 text-[15px] leading-[1.9] text-body">
        {inline(paraBuffer.join(" "))}
      </p>,
    );
    paraBuffer = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      flushPara();
      continue;
    }
    if (line.startsWith("### ")) {
      flushList();
      flushPara();
      blocks.push(
        <h3 key={`h3-${key++}`} className="mb-2 mt-8 text-[18px] font-bold">
          {inline(line.slice(4))}
        </h3>,
      );
    } else if (line.startsWith("## ")) {
      flushList();
      flushPara();
      blocks.push(
        <h2 key={`h2-${key++}`} className="mb-3 mt-10 text-[22px] font-extrabold">
          {inline(line.slice(3))}
        </h2>,
      );
    } else if (line.startsWith("> ")) {
      flushList();
      flushPara();
      blocks.push(
        <blockquote
          key={`q-${key++}`}
          className="my-4 rounded-brand border-l-4 border-pine bg-mist p-4 text-[15px] italic text-heading"
        >
          {inline(line.slice(2))}
        </blockquote>,
      );
    } else if (/^[-*] /.test(line)) {
      flushPara();
      if (!listBuffer || listBuffer.ordered) {
        flushList();
        listBuffer = { ordered: false, items: [] };
      }
      listBuffer.items.push(line.slice(2));
    } else if (/^\d+\. /.test(line)) {
      flushPara();
      if (!listBuffer || !listBuffer.ordered) {
        flushList();
        listBuffer = { ordered: true, items: [] };
      }
      listBuffer.items.push(line.replace(/^\d+\. /, ""));
    } else {
      flushList();
      paraBuffer.push(line);
    }
  }
  flushList();
  flushPara();

  return <div>{blocks}</div>;
}
