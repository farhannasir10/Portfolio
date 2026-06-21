"use client";

import { deleteTestimonial } from "@/actions/testimonials";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";

export function TestimonialDeleteForm({ testimonialId }: { testimonialId: string }) {
  return (
    <form action={deleteTestimonial.bind(null, testimonialId)} className="mt-12 max-w-xl">
      <AdminFormSubmitButton
        pendingLabel="Deleting…"
        className="text-sm text-red-400 hover:underline"
        confirmMessage="Delete this testimonial?"
      >
        Delete testimonial
      </AdminFormSubmitButton>
    </form>
  );
}
