import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import Wishlist from './Wishlist';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t("account.wishlist.meta.title")} ${t("common.metaSeparator")} ${t("common.siteName")}`,
    description: t("account.wishlist.meta.description")
  };
}

export default function Page(): React.JSX.Element {
  return <Wishlist />
}
