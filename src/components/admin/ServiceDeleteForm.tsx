"use client";

import { deleteService } from "@/actions/services";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";

export function ServiceDeleteForm({ serviceId }: { serviceId: string }) {
  return (
    <form action={deleteService.bind(null, serviceId)} className="mt-12 max-w-xl">
      <AdminFormSubmitButton
        pendingLabel="Deleting…"
        className="text-sm text-red-400 hover:underline"
        confirmMessage="Delete this service?"
      >
        Delete service
      </AdminFormSubmitButton>
    </form>
  );
}
