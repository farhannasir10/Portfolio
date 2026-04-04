/** Simple icons for About expertise cards (keyword in category title). */
export function AboutCategoryIcon({
  categoryTitle,
  className = "h-6 w-6 text-[var(--text)]",
}: {
  categoryTitle: string;
  className?: string;
}) {
  const t = categoryTitle.toLowerCase();
  if (t.includes("front") || t.includes("ui"))
    return <IconMonitor className={className} />;
  if (t.includes("back") || t.includes("api"))
    return <IconServer className={className} />;
  if (t.includes("devops") || t.includes("cloud") || t.includes("deploy"))
    return <IconCloud className={className} />;
  if (t.includes("data") || t.includes("database"))
    return <IconDatabase className={className} />;
  if (t.includes("mobile"))
    return <IconMobile className={className} />;
  return <IconCode className={className} />;
}

function IconCode({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3v12" />
    </svg>
  );
}

function IconMonitor({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  );
}

function IconServer({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-1.051-4.462a4.5 4.5 0 00-4.37-3.468H7.191a4.5 4.5 0 00-4.37 3.468L1.77 16.192a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0v.375a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-.375m19.5 0h1.5a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.75-.75h-1.5m-19.5 0H3.75a.75.75 0 00-.75.75v1.5c0 .414.336.75.75.75h1.5m0 0h15" />
    </svg>
  );
}

function IconCloud({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5h7.5a4.5 4.5 0 000-9h-1.125A3.375 3.375 0 0012 6.375m0 0a3.375 3.375 0 00-3.375 3.375H6.75a4.5 4.5 0 00-4.5 4.5z" />
    </svg>
  );
}

function IconDatabase({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 3c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 3v10.125c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V9.375m16.5 0a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25m16.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 11.534a2.25 2.25 0 01-1.07-1.916V9.375" />
    </svg>
  );
}

function IconMobile({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  );
}
