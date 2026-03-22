"use client";

import { useEffect } from "react";

export function AdminFlashScroll() {
  useEffect(() => {
    const el = document.getElementById("admin-notice");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  return null;
}
