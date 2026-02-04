"use client";

import { Gamepad2, Home, Search } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Animated gamepad icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-8 inline-block"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl scale-150" />
            <Gamepad2 className="relative h-20 w-20 text-orange-500" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* 404 number */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-[8rem] md:text-[12rem] font-black leading-none tracking-tighter bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent select-none"
        >
          404
        </motion.h1>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-2xl md:text-3xl font-bold text-white mb-3">
            {t("title")}
          </p>
          <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto">
            {t("description")}
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-lg shadow-orange-500/20"
          >
            <Home className="h-5 w-5" />
            {t("backHome")}
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-bold text-lg transition-colors border border-zinc-700"
          >
            <Search className="h-5 w-5" />
            {t("search")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
