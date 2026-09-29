export default function SiteLoading() {
  return (
    <div
      className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="page-loading-label">
        <span className="btn-spinner page-loading-spinner" aria-hidden />
        Loading…
      </p>
      <div className="page-loading-block mt-12 h-8 w-48 rounded-lg" />
      <div className="page-loading-block mt-4 h-4 w-full max-w-xl rounded" />
      <div className="page-loading-block mt-2 h-4 w-5/6 max-w-lg rounded" />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="page-loading-block aspect-[16/10] rounded-xl sm:col-span-1" />
        <div className="page-loading-block aspect-[16/10] rounded-xl sm:col-span-1" />
        <div className="page-loading-block hidden aspect-[16/10] rounded-xl lg:block" />
      </div>
    </div>
  );
}
