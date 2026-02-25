import { getTranslations } from 'next-intl/server';

export default async function Wishlist() {
    const t = await getTranslations('common');
    return <p>{t('comingSoon')}</p>;
}
