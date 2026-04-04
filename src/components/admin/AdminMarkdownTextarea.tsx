"use client";

import { forwardRef, type KeyboardEvent, type TextareaHTMLAttributes } from "react";

/** Wraps selection in Markdown `**bold**`. Cursor between markers if nothing selected. */
export function applyMarkdownBoldToTextarea(ta: HTMLTextAreaElement) {
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const value = ta.value;
  const selected = value.slice(start, end);
  const before = value.slice(0, start);
  const after = value.slice(end);
  const wrapped = selected.length > 0 ? `**${selected}**` : `****`;
  ta.value = before + wrapped + after;

  if (selected.length > 0) {
    const innerStart = start + 2;
    const innerEnd = innerStart + selected.length;
    ta.setSelectionRange(innerStart, innerEnd);
  } else {
    ta.setSelectionRange(start + 2, start + 2);
  }

  ta.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Markdown body fields: **Ctrl+B** / **⌘B** wraps the selection in `**…**` (same as writing bold in Markdown).
 */
export const AdminMarkdownTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function AdminMarkdownTextarea({ onKeyDown, ...props }, ref) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      applyMarkdownBoldToTextarea(e.currentTarget);
      return;
    }
    onKeyDown?.(e);
  };

  return <textarea ref={ref} onKeyDown={handleKeyDown} {...props} />;
});
