import { deleteCvAsset, setCvFromUpload } from "@/actions/cv";
import { AdminFileField } from "@/components/AdminFileField";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { publicFileUrl } from "@/lib/public-file-url";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<{ saved?: string }> };

export default async function AdminCvPage({ searchParams }: Props) {
  const q = searchParams ? await searchParams : {};
  const assets = await prisma.cvAsset.findMany({
    orderBy: { createdAt: "desc" },
  });
  const active = assets.find((a) => a.isActive);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-50">CV</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Visitors download the active CV from the About section. PDF recommended.
      </p>

      <AdminNotice
        saved={q.saved === "1"}
        savedMessage="CV updated."
      />

      {active ? (
        <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm">
          <p className="text-zinc-300">
            Active file:{" "}
            <a
              href={publicFileUrl(active.storageKey) ?? "#"}
              className="text-orange-400 underline"
              target="_blank"
              rel="noreferrer"
            >
              {active.originalName}
            </a>
          </p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-zinc-500">No active CV yet.</p>
      )}

      <form action={setCvFromUpload} className="mt-8 max-w-md space-y-4">
        <AdminFileField
          kind="cv"
          fieldName="storageKey"
          originalNameField="originalName"
          label="Upload PDF"
        />
        <AdminFormSubmitButton
          pendingLabel="Saving…"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400"
        >
          Set as active CV
        </AdminFormSubmitButton>
      </form>

      {assets.length > 0 ? (
        <ul className="mt-10 space-y-2 border-t border-zinc-800 pt-8">
          <p className="text-sm font-medium text-zinc-400">All uploads</p>
          {assets.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-500"
            >
              <span>
                {a.originalName}
                {a.isActive ? (
                  <span className="ml-2 text-emerald-500">(active)</span>
                ) : null}
              </span>
              <form action={deleteCvAsset.bind(null, a.id)}>
                <AdminFormSubmitButton
                  pendingLabel="Deleting…"
                  className="text-red-400 hover:underline"
                >
                  Delete
                </AdminFormSubmitButton>
              </form>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
