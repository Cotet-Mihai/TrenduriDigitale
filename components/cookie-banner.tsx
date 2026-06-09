"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    window.dispatchEvent(new Event("cookie_consent_change"));
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    window.dispatchEvent(new Event("cookie_consent_change"));
    setVisible(false);
  };

  return (
    <div
      className={`fixed bottom-5 left-0 right-0 flex justify-center px-4 z-[500] transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
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
            <Cookie className="w-4 h-4" style={{ color: "rgba(255,255,255,0.7)" }} />
          </div>
          <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "rgba(255,255,255,0.95)" }}>
            Respectăm confidențialitatea ta
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Folosim cookie-uri analitice pentru a îmbunătăți experiența pe site. Datele sunt anonimizate.{" "}
            <Link
              href="/politica-confidentialitate"
              className="underline underline-offset-2 hover:text-white transition-colors"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Află mai mult
            </Link>
          </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          >
            Refuz
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer"
            style={{ background: "white", color: "#111" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
