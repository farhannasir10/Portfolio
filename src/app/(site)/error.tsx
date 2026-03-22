"use client";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-lg font-semibold text-slate-100">
        This page could not be loaded
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">
        Usually this is a database or environment issue on the server. On Vercel,
        confirm{" "}
        <span className="font-mono text-slate-400">DATABASE_URL</span> (pooler
        URI for serverless) and{" "}
        <span className="font-mono text-slate-400">AUTH_SECRET</span> are set,
        then redeploy.
      </p>
      {process.env.NODE_ENV === "development" ? (
        <p className="mt-4 max-w-full break-all font-mono text-xs text-red-400/90">
          {error.message}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="btn-primary mt-8"
      >
        Try again
      </button>
    </div>
  );
}
