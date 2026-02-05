"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

import { Link } from "@/i18n/navigation";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth";

export default function ForgotPassword() {
  const t = useTranslations("account.signIn");
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    defaultValues: { email: "" },
    resolver: zodResolver(forgotPasswordSchema(t)),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log("Forgot password:", data);
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            {t("forgotPassword.title")}
          </h1>
          <p className="mt-2 text-zinc-400">
            {t("forgotPassword.subtitle")}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center py-4 text-center"
            >
              <CheckCircle className="mb-4 h-12 w-12 text-green-400" />
              <h2 className="text-lg font-semibold text-white">
                {t("forgotPassword.success.title")}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {t("forgotPassword.success.message")}
              </p>
              <Link
                href="/sign-in"
                className="mt-6 inline-flex items-center gap-2 text-sm text-brand hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("forgotPassword.actions.backToLogin")}
              </Link>
            </motion.div>
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="forgot-email"
                  className="mb-1.5 block text-sm font-medium text-zinc-300"
                >
                  {t("fields.email.label")}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder={t("fields.email.placeholder")}
                    {...form.register("email")}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-brand"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-active cursor-pointer"
              >
                {t("forgotPassword.actions.submit")}
              </button>

              {/* Back to login */}
              <div className="text-center">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("forgotPassword.actions.backToLogin")}
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
