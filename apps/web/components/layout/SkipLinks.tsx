import { getTranslations } from 'next-intl/server';

export const SkipLinks = async () => {
    const t = await getTranslations('header.skipLinks');

    return (
        <div>
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-orange-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold focus:outline focus:outline-2 focus:outline-white focus:outline-offset-2"
            >
                {t('toContent')}
            </a>
            <a
                href="#main-nav"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-56 focus:z-[200] focus:bg-orange-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold focus:outline focus:outline-2 focus:outline-white focus:outline-offset-2"
            >
                {t('toNavigation')}
            </a>
        </div>
    );
};
