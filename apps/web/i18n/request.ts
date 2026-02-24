import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    const [account, common, header, footer, games, notFound, home] =
        await Promise.all([
            import(`../translations/${locale}/account.json`),
            import(`../translations/${locale}/common.json`),
            import(`../translations/${locale}/header.json`),
            import(`../translations/${locale}/footer.json`),
            import(`../translations/${locale}/games.json`),
            import(`../translations/${locale}/notFound.json`),
            import(`../translations/${locale}/home.json`),
        ]);

    return {
        locale,
        messages: {
            account: account.default,
            common: common.default,
            header: header.default,
            footer: footer.default,
            games: games.default,
            notFound: notFound.default,
            home: home.default,
        },
    };
});
