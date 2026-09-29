import { PageBackLink } from "@/components/PageBackLink";

export default function BlogLoading() {
  return (
    <div
      className="mx-auto max-w-3xl scroll-mt-36 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-live="polite"
      aria-busy="true"
    >
      <PageBackLink href="/">← Home</PageBackLink>
      <p className="page-loading-label mt-8">
        <span className="btn-spinner page-loading-spinner" aria-hidden />
        Loading…
      </p>
      <div className="page-loading-block mt-8 h-8 w-40 rounded-lg" />
      <div className="page-loading-block mt-8 h-24 w-full rounded-xl" />
    </div>
  );
}
