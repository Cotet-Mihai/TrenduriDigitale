"use client";

import { useState } from "react";
import { Link2, Check, X } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

function openPopup(href: string) {
  window.open(href, "_blank", "width=600,height=400,noopener,noreferrer");
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnClass =
    "w-8 h-8 rounded-md border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors cursor-pointer";

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">Distribuie articolul</span>

      {/* LinkedIn */}
      <button
        type="button"
        className={btnClass}
        aria-label="Distribuie pe LinkedIn"
        onClick={() => openPopup(`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`)}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </button>

      {/* Facebook */}
      <button
        type="button"
        className={btnClass}
        aria-label="Distribuie pe Facebook"
        onClick={() => openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`)}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </button>

      {/* X / Twitter */}
      <button
        type="button"
        className={btnClass}
        aria-label="Distribuie pe X"
        onClick={() => openPopup(`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`)}
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Copy link */}
      <button
        type="button"
        className={btnClass}
        aria-label="Copiază link"
        onClick={copyLink}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-500" />
        ) : (
          <Link2 className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
