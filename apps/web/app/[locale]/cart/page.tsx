import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import Cart from './Cart';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();

    return {
        title: `${t('cart.meta.title')} ${t('common.metaSeparator')} ${t('common.siteName')}`,
        description: t('cart.meta.description'),
    };
}

export default function Page(): React.JSX.Element {
    return <Cart />;
}
