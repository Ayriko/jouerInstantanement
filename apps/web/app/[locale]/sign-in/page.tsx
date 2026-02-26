import { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

import SignIn from './SignIn';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();

    return {
        title: `${t('account.signIn.meta.title')} ${t('common.metaSeparator')} ${t('common.siteName')}`,
        description: t('account.signIn.meta.description'),
    };
}

export default function Page(): React.JSX.Element {
    return (
        <Suspense>
            <SignIn />
        </Suspense>
    );
}
