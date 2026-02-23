"use client";

import { Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Game } from "@/types/game";

interface CartItemCardProps {
  item: Game;
  index: number;
  onRemove: (id: string) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  index,
  onRemove,
}) => {
  const t = useTranslations("cart");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
    >
      {/* Image */}
      <Link href={`/games/${item.id}`} className="flex-shrink-0">
        <img
          src={item.coverImage}
          alt={item.title}
          className="h-28 w-20 rounded-lg object-cover"
        />
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/games/${item.id}`}
            className="font-semibold text-white hover:text-brand transition-colors"
          >
            {item.title}
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded border border-zinc-700 px-1.5 py-0.5 text-xs text-zinc-400">
              {item.platform}
            </span>
            <span className="text-xs text-zinc-500">{item.category}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onRemove(item.id);
          }}
          className="mt-2 inline-flex w-fit items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
        >
          <Trash2 className="h-3 w-3" />
          {t("item.remove")}
        </button>
      </div>

      {/* Price */}
      <div className="flex flex-col items-end justify-between">
        <span className="text-xs text-zinc-500 line-through">
          {item.originalPrice.toFixed(2)}€
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded bg-brand/20 px-1.5 py-0.5 text-xs font-bold text-brand">
            -{item.discount}%
          </span>
          <span className="text-lg font-bold text-white">
            {item.price.toFixed(2)}€
          </span>
        </div>
      </div>
    </motion.div>
  );
};
