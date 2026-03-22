"use client";

import { useFormStatus } from "react-dom";

type Props = {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  /** Runs in the browser before submit; OK to pass from Server Components (string only). */
  confirmMessage?: string;
};

export function AdminFormSubmitButton({
  children,
  pendingLabel = "Saving…",
  className = "",
  confirmMessage,
}: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={
        confirmMessage
          ? (e) => {
              if (!window.confirm(confirmMessage)) e.preventDefault();
            }
          : undefined
      }
      className={`${className} ${pending ? "cursor-wait opacity-85" : ""}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
