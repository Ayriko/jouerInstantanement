"use client";

import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

export const Header: React.FC = () => {
  const t = useTranslations("header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search not yet functional
  };

  return (
    <nav className="bg-zinc-900 text-white sticky top-0 z-50 shadow-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 cursor-pointer flex items-center gap-2">
            <span className="text-lg font-bold">JouerInstantanement</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder={t("search.placeholder.default")}
                className="w-full bg-zinc-800 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-zinc-700"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); }}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="relative text-zinc-300 hover:text-white transition-colors cursor-pointer">
              <Heart className="h-6 w-6" />
            </button>

            <button className="relative text-zinc-300 hover:text-white transition-colors cursor-pointer">
              <ShoppingCart className="h-6 w-6" />
            </button>

            <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700 cursor-pointer">
              {t("signIn")}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => { setIsMenuOpen(!isMenuOpen); }}
              className="text-zinc-300 hover:text-white p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-zinc-900 border-t border-zinc-800"
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(e); setIsMenuOpen(false); }}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("search.placeholder.short")}
                    className="w-full bg-zinc-800 text-white rounded-lg pl-10 pr-4 py-2"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); }}
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                </div>
              </form>

              <div className="flex flex-col space-y-2">
                <button onClick={() => { setIsMenuOpen(false); }} className="flex items-center gap-3 text-zinc-300 hover:text-white py-2">
                  <Heart className="h-5 w-5" /> {t("wishlist")}
                </button>
                <button onClick={() => { setIsMenuOpen(false); }} className="flex items-center gap-3 text-zinc-300 hover:text-white py-2">
                  <ShoppingCart className="h-5 w-5" /> {t("cart")}
                </button>
                <button onClick={() => { setIsMenuOpen(false); }} className="flex items-center gap-3 text-zinc-300 hover:text-white py-2">
                  <User className="h-5 w-5" /> {t("signIn")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
