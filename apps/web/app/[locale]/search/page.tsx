import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import Search from './Search';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t("search.meta.title")} ${t("common.metaSeparator")} ${t("common.siteName")}`,
    description: t("search.meta.description")
  };
}

export default function Page(): React.JSX.Element {
  return <Search />
}
