import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipLinks } from '@/components/layout/SkipLinks';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { routing } from '@/i18n/routing';

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <CartProvider>
                <WishlistProvider>
                    <SkipLinks />
                    <Header />
                    <main id="main-content" className="min-h-screen">
                        {children}
                    </main>
                    <Footer />
                </WishlistProvider>
            </CartProvider>
        </NextIntlClientProvider>
    );
}
