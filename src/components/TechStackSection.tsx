"use client";

import { useId, useState } from "react";
import { TechIcon } from "@/components/TechIcon";
import {
  TECH_CATEGORIES,
  getFeaturedTech,
  getTechByCategory,
  type TechCategoryId,
  type TechItem,
} from "@/lib/tech-stack";

function MoreLink({
  open,
  onClick,
  controlsId,
  className = "",
}: {
  open: boolean;
  onClick: () => void;
  controlsId: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`tech-more-link ${open ? "tech-more-link--open" : ""} ${className}`}
      aria-expanded={open}
      aria-controls={controlsId}
      onClick={onClick}
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
  );
}

function TechCards({
  items,
  variant = "compact",
}: {
  items: TechItem[];
  variant?: "featured" | "compact";
}) {
  return (
    <ul
      className={
        variant === "featured"
          ? "tech-stack-list tech-stack-list--featured"
          : "tech-stack-list"
      }
    >
      {items.map((item) => (
        <li
          key={item.id}
          className={
            variant === "featured"
              ? "tech-stack-item tech-stack-item--featured"
              : "tech-stack-item"
          }
        >
          <span className="tech-stack-item-icon" aria-hidden>
            <TechIcon id={item.id} />
          </span>
          <span className="tech-stack-item-name">{item.name}</span>
        </li>
      ))}
    </ul>
  );
}

function CategoryRow({
  categoryId,
  title,
  open,
  onToggle,
}: {
  categoryId: TechCategoryId;
  title: string;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const items = getTechByCategory(categoryId);

  return (
    <div className={`tech-category-row ${open ? "tech-category-row--open" : ""}`}>
      <div className="tech-category-row-bar">
        <h3 className="tech-category-row-title">{title}</h3>
        <MoreLink open={open} onClick={onToggle} controlsId={panelId} />
      </div>
      {open ? (
        <div id={panelId} className="tech-category-row-panel">
          <TechCards items={items} />
        </div>
      ) : null}
    </div>
  );
}

export function TechStackSection() {
  const [showAll, setShowAll] = useState(false);
  const [openCategory, setOpenCategory] = useState<TechCategoryId | null>(null);
  const featured = getFeaturedTech();
  const allPanelId = useId();

  return (
    <section
      id="skills"
      className="site-section-slice scroll-mt-36 border-t border-[color:var(--site-section-border)] py-20 md:py-24"
    >
      <header className="tech-stack-header">
        <p className="kicker-sky mb-3">Toolkit</p>
        <div className="tech-stack-heading-row">
          <h2 className="tech-stack-title">Tech stack</h2>
          <MoreLink
            open={showAll}
            controlsId={allPanelId}
            onClick={() => {
              setShowAll((v) => !v);
              if (showAll) setOpenCategory(null);
            }}
          />
        </div>
      </header>

      <p className="section-lead">
        Core tools I use to design, build, and ship.
      </p>

      <TechCards items={featured} variant="featured" />

      {showAll ? (
        <div id={allPanelId} className="tech-all-panel">
          <div className="tech-category-list">
            {TECH_CATEGORIES.map((cat) => (
              <CategoryRow
                key={cat.id}
                categoryId={cat.id}
                title={cat.title}
                open={openCategory === cat.id}
                onToggle={() =>
                  setOpenCategory((prev) => (prev === cat.id ? null : cat.id))
                }
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
