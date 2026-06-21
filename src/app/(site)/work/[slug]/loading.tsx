export default function WorkDetailLoading() {
  return (
    <div
      className="mx-auto max-w-6xl scroll-mt-36 px-4 py-16 sm:px-6 sm:py-20 lg:px-10"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="page-loading-label">
        <span className="btn-spinner page-loading-spinner" aria-hidden />
        Loading project…
      </p>
      <div className="page-loading-block mt-8 h-10 w-2/3 max-w-lg rounded-lg" />
      <div className="mt-5 flex gap-2">
        <div className="page-loading-block h-7 w-20 rounded-full" />
        <div className="page-loading-block h-7 w-24 rounded-full" />
      </div>
      <div className="page-loading-block mt-6 h-4 w-full max-w-2xl rounded" />
      <div className="page-loading-block mt-2 h-4 w-5/6 max-w-xl rounded" />
      <div className="page-loading-block mt-10 aspect-[16/9] w-full max-w-4xl rounded-xl" />
    </div>
  );
}
