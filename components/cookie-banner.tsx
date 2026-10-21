"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

export const CONSENT_KEY = "cookie_consent";
export const OPEN_SETTINGS_EVENT = "open_cookie_settings";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let consent: string | null = null;
    try {
      consent = localStorage.getItem(CONSENT_KEY);
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser storage after mount
    if (!consent) setVisible(true);

    // "Setări cookie" in the footer reopens the banner (GDPR art. 7(3): withdrawing must be as easy as giving).
    const open = () => setVisible(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  const choose = (value: "accepted" | "declined") => {
    let previous: string | null = null;
    try {
      previous = localStorage.getItem(CONSENT_KEY);
      localStorage.setItem(CONSENT_KEY, value);
    } catch {}
    setVisible(false);
    // The analytics script keeps tracking client-side navigation once loaded, so a withdrawal reloads the page.
    if (previous === "accepted" && value === "declined") {
      window.location.reload();
      return;
    }
    window.dispatchEvent(new Event("cookie_consent_change"));
  };

  return (
    <div
      role="dialog"
      aria-label="Setări statistică"
      aria-hidden={!visible}
      className={`fixed bottom-5 left-0 right-0 flex justify-center px-4 z-[500] transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none invisible"
      }`}
    >
      <div
        className="w-full max-w-lg rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{
          background: "rgba(15, 15, 15, 0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {/* Text */}
        <div className="flex gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(255,255,255,0.1)" }}>
            <BarChart3 className="w-4 h-4" style={{ color: "rgba(255,255,255,0.7)" }} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "rgba(255,255,255,0.95)" }}>
              Ne ajuți să vedem ce se citește?
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              Dacă accepți, folosim Vercel Analytics: statistică anonimă, fără cookie-uri. La fiecare pagină se trimit
              către Vercel adresa paginii, de unde ai venit, țara, browserul și tipul dispozitivului. Alegerea se
              păstrează în browser și o poți schimba oricând din „Setări cookie”, în subsolul paginii.{" "}
              <Link
                href="/politica-confidentialitate#statistica"
                className="underline underline-offset-2 hover:text-white transition-colors"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                Află mai mult
              </Link>
            </p>
          </div>
        </div>

        {/* Buttons — same size and weight so neither choice is pushed */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => choose("declined")}
            tabIndex={visible ? 0 : -1}
            className="px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer border"
            style={{ background: "transparent", color: "rgba(255,255,255,0.95)", borderColor: "rgba(255,255,255,0.35)" }}
          >
            Refuz
          </button>
          <button
            onClick={() => choose("accepted")}
            tabIndex={visible ? 0 : -1}
            className="px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer border"
            style={{ background: "white", color: "#111", borderColor: "white" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
