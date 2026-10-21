"use client";

import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { CONSENT_KEY } from "@/components/cookie-banner";

export default function AnalyticsWrapper() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      try {
        setConsent(localStorage.getItem(CONSENT_KEY));
      } catch {
        setConsent(null);
      }
    };
    read();

    window.addEventListener("cookie_consent_change", read);
    return () => window.removeEventListener("cookie_consent_change", read);
  }, []);

  if (consent !== "accepted") return null;

  // The admin panel is never sent to analytics.
  return <Analytics beforeSend={(event) => (new URL(event.url).pathname.startsWith("/admin") ? null : event)} />;
}
