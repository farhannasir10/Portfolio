"use client";

import { useEffect, useState } from "react";

const TIMEZONE = "Asia/Karachi";
const TIMEZONE_LABEL = "PKT (UTC+5)";

function formatLocalTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function HeroAvailabilityBadges() {
  const [localTime, setLocalTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setLocalTime(formatLocalTime(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="hero-badge-row">
      <span className="hero-status-badge">
        <span className="hero-status-dot" aria-hidden />
        Open to opportunities
      </span>
      <span className="hero-remote-badge" title={`Local time · ${TIMEZONE_LABEL}`}>
        <svg
          className="hero-remote-badge-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9s1.3-6.2 3.8-9z" />
        </svg>
        <span>Remote</span>
        <span className="hero-remote-badge-sep" aria-hidden>
          ·
        </span>
        <span>{TIMEZONE_LABEL}</span>
        {localTime ? (
          <>
            <span className="hero-remote-badge-sep" aria-hidden>
              ·
            </span>
            <span className="hero-remote-badge-time">{localTime}</span>
          </>
        ) : null}
      </span>
    </div>
  );
}
