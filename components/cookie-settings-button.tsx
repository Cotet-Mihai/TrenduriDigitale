"use client";

import { OPEN_SETTINGS_EVENT } from "@/components/cookie-banner";

export default function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))} className={className}>
      Setări cookie
    </button>
  );
}
