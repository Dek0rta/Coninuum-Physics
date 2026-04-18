"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const schema = z
  .object({
    username: z.string().min(2).max(32),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "passwordsNoMatch",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export default function SignUpPage({ params }: PageProps) {
  const { locale } = use(params);
  const t = useTranslations("auth");
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    if (isDemoMode) {
      toast.error(t("demoNotice"));
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { username: data.username } },
    });
    if (error) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      toast.error(error.message);
    } else {
      setSuccess(true);
    }
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 25 } },
  };

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
          className="w-full max-w-sm text-center space-y-4"
        >
          <div className="text-5xl">📬</div>
          <h2 className="text-xl font-semibold text-[var(--text)]">{t("checkEmail")}</h2>
          <p className="text-sm text-[var(--text-muted)]">
            {t("signInToContinue")}
          </p>
          <Link
            href={`/${locale}/auth/signin`}
            className="inline-block mt-2 text-sm font-medium text-[var(--accent)] hover:underline"
          >
            {t("signIn")}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm space-y-6"
      >
        {/* Logo + title */}
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] text-white text-lg font-bold">
            ∮
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{t("createAccount")}</h1>
          <p className="text-sm text-[var(--text-muted)]">{t("signInToContinue")}</p>
        </motion.div>

        {/* Demo notice */}
        <AnimatePresence>
          {isDemoMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-[var(--radius-lg)] border border-amber-500/30 bg-amber-500/8 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
                {t("demoNotice")}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit(onSubmit)}
          animate={shake ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text)]">{t("username")}</label>
            <input
              {...register("username")}
              type="text"
              autoComplete="username"
              placeholder="PhysicsGuru"
              className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors"
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text)]">{t("email")}</label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text)]">{t("password")}</label>
            <input
              {...register("password")}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text)]">{t("confirmPassword")}</label>
            <input
              {...register("confirmPassword")}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message === "passwordsNoMatch"
                  ? t("passwordsNoMatch")
                  : errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                {t("signingUp")}
              </>
            ) : (
              t("signUp")
            )}
          </button>
        </motion.form>

        {/* Footer */}
        <motion.p variants={itemVariants} className="text-center text-sm text-[var(--text-muted)]">
          {t("haveAccount")}{" "}
          <Link
            href={`/${locale}/auth/signin`}
            className="font-medium text-[var(--accent)] hover:underline"
          >
            {t("signIn")}
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
