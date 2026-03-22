import { AdminFlashScroll } from "./AdminFlashScroll";

type Props = {
  saved?: boolean;
  deleted?: boolean;
  removed?: boolean;
  error?: boolean;
  errorMessage?: string;
  savedMessage?: string;
};

export function AdminNotice({
  saved,
  deleted,
  removed,
  error,
  errorMessage,
  savedMessage = "Saved successfully.",
}: Props) {
  if (error) {
    return (
      <>
        <AdminFlashScroll />
        <div
          id="admin-notice"
          role="alert"
          className="mb-6 rounded-xl border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm font-medium text-red-100 shadow-lg shadow-red-900/20 ring-1 ring-red-500/20"
        >
          {errorMessage ?? "Something went wrong."}
        </div>
      </>
    );
  }
  if (deleted) {
    return (
      <>
        <AdminFlashScroll />
        <div
          id="admin-notice"
          role="status"
          className="mb-6 rounded-xl border border-amber-800/50 bg-amber-950/35 px-4 py-3 text-sm font-medium text-amber-100 shadow-lg shadow-amber-900/15 ring-1 ring-amber-500/15"
        >
          Deleted successfully.
        </div>
      </>
    );
  }
  if (removed) {
    return (
      <>
        <AdminFlashScroll />
        <div
          id="admin-notice"
          role="status"
          className="mb-6 rounded-xl border border-emerald-800/50 bg-emerald-950/40 px-4 py-3 text-sm font-medium text-emerald-100 shadow-lg shadow-emerald-900/20 ring-1 ring-emerald-500/25"
        >
          Removed.
        </div>
      </>
    );
  }
  if (saved) {
    return (
      <>
        <AdminFlashScroll />
        <div
          id="admin-notice"
          role="status"
          className="mb-6 rounded-xl border border-emerald-800/50 bg-emerald-950/40 px-4 py-3 text-sm font-medium text-emerald-100 shadow-lg shadow-emerald-900/20 ring-1 ring-emerald-500/25"
        >
          {savedMessage}
        </div>
      </>
    );
  }
  return null;
}
