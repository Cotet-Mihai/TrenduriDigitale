"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;

    const onScroll = () => {
      const threshold = window.innerHeight * 0.45;
      let current = headings[0].id;

      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) {
          current = id;
        }
      }

      setActiveId(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <h3 className="font-bold text-base mb-4">Cuprins</h3>
      <ol className="space-y-2">
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li key={h.id}>
              <button
                onClick={() => scrollTo(h.id)}
                className="flex items-center gap-3 text-sm text-left w-full group"
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                    isActive
                      ? "bg-blue-500"
                      : "bg-muted-foreground/30 group-hover:bg-blue-400"
                  }`}
                />
                <span
                  className={`transition-colors leading-snug ${
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {h.text}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
