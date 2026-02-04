import { Facebook, Twitter, Instagram, Youtube, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export const Footer: React.FC = () => {
  const t = useTranslations("footer");

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">{t("title")}</h3>
            <p className="text-sm leading-relaxed">{t("description")}</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">{t("shop.title")}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-500 transition-colors">{t("shop.links.newReleases")}</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">{t("shop.links.bestSellers")}</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">{t("shop.links.upcoming")}</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">{t("shop.links.giftCards")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">{t("support.title")}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-500 transition-colors">{t("support.links.helpCenter")}</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">{t("support.links.contactUs")}</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">{t("support.links.termsConditions")}</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">{t("support.links.privacyPolicy")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">{t("followUs")}</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" aria-hidden="true" focusable="false" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" aria-hidden="true" focusable="false" />
                <span className="sr-only">X (ex Twitter)</span>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" aria-hidden="true" focusable="false" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Youtube className="h-5 w-5" aria-hidden="true" focusable="false" />
                <span className="sr-only">Youtube</span>
              </a>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4" />
              <span>English (EU)</span>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-900 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Jouer Instantanément. All rights reserved. Not affiliated with Instant Gaming.</p>
        </div>
      </div>
    </footer>
  );
};
