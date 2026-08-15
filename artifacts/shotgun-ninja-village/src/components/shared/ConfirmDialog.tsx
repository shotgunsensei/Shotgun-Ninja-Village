import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/75 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-primary/50 bg-card p-6 shadow-2xl focus:outline-none">
          <AlertDialog.Title className="text-balance font-display text-2xl uppercase text-white">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-pretty font-mono text-sm leading-relaxed text-muted-foreground">
            {description}
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel className="border border-border px-4 py-2 font-mono text-xs uppercase text-muted-foreground hover:border-white/30 hover:text-white">
              Cancel
            </AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={() => void onConfirm()}
              className="bg-primary px-4 py-2 font-mono text-xs uppercase text-white hover:bg-primary/90"
            >
              {confirmLabel}
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
