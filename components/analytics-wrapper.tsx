"use client";

import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

export default function AnalyticsWrapper() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    setConsent(localStorage.getItem("cookie_consent"));

    const handler = () => setConsent(localStorage.getItem("cookie_consent"));
    window.addEventListener("cookie_consent_change", handler);
    return () => window.removeEventListener("cookie_consent_change", handler);
  }, []);

  if (consent !== "accepted") return null;

  return <Analytics />;
}
