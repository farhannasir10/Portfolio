"use client";

import { useId, useState } from "react";
import { WORK_EXPERIENCE, type ExperienceItem } from "@/lib/experience";

function ExperienceRow({
  item,
  open,
  onToggle,
}: {
  item: ExperienceItem;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();

  return (
    <div className={`experience-row ${open ? "experience-row--open" : ""}`}>
      <div className="experience-row-bar">
        <h3 className="experience-row-company">{item.company}</h3>
        <button
          type="button"
          className={`tech-more-link ${open ? "tech-more-link--open" : ""}`}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          {open ? "less" : "more"}
          <svg
            className="tech-more-chevron"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 4.5L6 8l3.5-3.5" />
          </svg>
        </button>
      </div>
      {open ? (
        <div id={panelId} className="experience-row-panel">
          <p className="experience-meta">
            <span>{item.role}</span>
            <span className="experience-meta-sep" aria-hidden>
              ·
            </span>
            <span>{item.period}</span>
            <span className="experience-meta-sep" aria-hidden>
              ·
            </span>
            <span>{item.location}</span>
          </p>
          <div className="experience-details">
            {item.details.map((paragraph, index) => (
              <p key={`${item.id}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ExperienceSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      id="experience"
      className="site-section-slice scroll-mt-36 border-t border-[color:var(--site-section-border)] py-20 md:py-24"
    >
      <header className="tech-stack-header">
        <p className="kicker-sky mb-3">Career</p>
        <h2 className="tech-stack-title">Experience</h2>
      </header>
      <p className="section-lead">
        Roles where I shipped products and owned outcomes.
      </p>
      <div className="experience-list">
        {WORK_EXPERIENCE.map((item) => (
          <ExperienceRow
            key={item.id}
            item={item}
            open={openId === item.id}
            onToggle={() =>
              setOpenId((prev) => (prev === item.id ? null : item.id))
            }
          />
        ))}
      </div>
    </section>
  );
}
