import { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

import OrderConfirmation from './OrderConfirmation';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();

    return {
        title: `${t('order.confirmation.meta.title')} ${t('common.metaSeparator')} ${t('common.siteName')}`,
        description: t('order.confirmation.meta.description'),
    };
}

export default function Page(): React.JSX.Element {
    return (
        <Suspense>
            <OrderConfirmation />
        </Suspense>
    );
}
