import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import Home from './Home';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t("common.siteName")} ${t("common.metaSeparator")} ${t("home.meta.title")}`,
    description: t("home.meta.description")
  };
}

export default function Page(): React.JSX.Element {
  return <Home />
}
