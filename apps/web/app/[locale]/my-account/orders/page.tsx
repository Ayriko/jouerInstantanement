import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import Orders from './Orders';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('account.orders.meta');
    return { title: t('title'), description: t('description') };
}

export default function Page() {
    return <Orders />;
}
