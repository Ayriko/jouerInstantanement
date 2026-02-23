import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    const [account, cart, common, header, footer, games, notFound, home, order] =
        await Promise.all([
            import(`../translations/${locale}/account.json`),
            import(`../translations/${locale}/cart.json`),
            import(`../translations/${locale}/common.json`),
            import(`../translations/${locale}/header.json`),
            import(`../translations/${locale}/footer.json`),
            import(`../translations/${locale}/games.json`),
            import(`../translations/${locale}/notFound.json`),
            import(`../translations/${locale}/home.json`),
            import(`../translations/${locale}/order.json`),
        ]);

    return {
        locale,
        messages: {
            account: account.default,
            cart: cart.default,
            common: common.default,
            header: header.default,
            footer: footer.default,
            games: games.default,
            notFound: notFound.default,
            home: home.default,
            order: order.default,
        },
    };
});
