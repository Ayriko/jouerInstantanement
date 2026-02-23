'use client';

import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { useCart } from '@/context/CartContext';
import { Link } from '@/i18n/navigation';
import logo from '@/public/logo/logo-white.svg';

export const Header: React.FC = () => {
    const t = useTranslations('header');
    const { itemCount, isHydrated } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Search not yet functional
    };

    return (
        <nav className="bg-zinc-900 text-white sticky top-0 z-50 shadow-md border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        onClick={() => {
                            setIsMenuOpen(false);
                        }}
                        className="flex-shrink-0 cursor-pointer flex items-center gap-2"
                    >
                        <Image
                            src={logo}
                            objectFit="contain"
                            alt="Jouer Instantanément"
                            width={150}
                            height={40}
                        />
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:block flex-1 max-w-lg mx-8">
                        <form
                            onSubmit={handleSearchSubmit}
                            className="relative"
                        >
                            <label htmlFor="search" className="sr-only">
                                {t('search.label')}
                            </label>
                            <input
                                type="text"
                                placeholder={t('search.placeholder.default')}
                                className="w-full bg-zinc-800 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-zinc-700"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                }}
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                        </form>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/my-account/wishlist"
                            className="relative text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        >
                            <span className="sr-only">{t('wishlist')}</span>
                            <Heart className="h-6 w-6" />
                        </Link>

                        <Link
                            href="/cart"
                            className="relative text-zinc-300 hover:text-white transition-colors cursor-pointer">
                            <span className="sr-only">{t('cart')}</span>
                            <ShoppingCart className="h-6 w-6" />
                            {isHydrated && itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/my-account"
                            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700 cursor-pointer"
                        >
                            {t('myAccount')}
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => {
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className="text-zinc-300 hover:text-white p-2"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
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
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSearchSubmit(e);
                                    setIsMenuOpen(false);
                                }}
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t(
                                            'search.placeholder.short',
                                        )}
                                        className="w-full bg-zinc-800 text-white rounded-lg pl-10 pr-4 py-2"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                        }}
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                </div>
                            </form>

                            <div className="flex flex-col space-y-2">
                                <Link
                                    href="/my-account/wishlist"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 text-zinc-300 hover:text-white py-2"
                                >
                                    <Heart className="h-5 w-5" />{' '}
                                    {t('wishlist')}
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 text-zinc-300 hover:text-white py-2"
                                >
                                    <span className="relative">
                                        <ShoppingCart className="h-5 w-5" />
                                        {isHydrated && itemCount > 0 && (
                                            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                                                {itemCount}
                                            </span>
                                        )}
                                    </span>
                                    {t('cart')}
                                </Link>
                                <Link
                                    href="/my-account"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 text-zinc-300 hover:text-white py-2"
                                >
                                    <User className="h-5 w-5" /> {t('signIn')}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
