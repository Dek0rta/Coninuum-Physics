"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
                className={cn(
                  "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
                  "w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)]",
                  "rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]",
                  "p-6 focus:outline-none",
                  className
                )}
              >
                {(title || description) && (
                  <div className="mb-4">
                    {title && (
                      <Dialog.Title className="text-lg font-semibold text-[var(--text)]">
                        {title}
                      </Dialog.Title>
                    )}
                    {description && (
                      <Dialog.Description className="mt-1 text-sm text-[var(--text-muted)]">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                )}

                {children}

                <Dialog.Close asChild>
                  <button
                    className={cn(
                      "absolute top-4 right-4 rounded-[var(--radius)] p-1",
                      "text-[var(--text-muted)] hover:text-[var(--text)]",
                      "hover:bg-[var(--bg-secondary)] transition-colors"
                    )}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
