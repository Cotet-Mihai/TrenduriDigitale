"use client";

interface Heading {
  id: string;
  text: string;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <h3 className="font-bold text-base mb-4">Cuprins</h3>
      <ol className="space-y-2">
        {headings.map((h, i) => (
          <li key={h.id}>
            <button
              onClick={() => scrollTo(h.id)}
              className="flex items-center gap-3 text-sm text-left w-full group"
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                  i === 0
                    ? "bg-blue-500"
                    : "bg-muted-foreground/30 group-hover:bg-blue-400"
                }`}
              />
              <span
                className={`transition-colors leading-snug ${
                  i === 0
                    ? "text-foreground font-medium"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {h.text}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
