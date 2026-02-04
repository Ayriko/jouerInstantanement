import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import GamesList from './GamesList';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t("games.meta.title")} ${t("common.metaSeparator")} ${t("common.siteName")}`,
    description: t("games.meta.description")
  };
}

export default function Page(): React.JSX.Element {
  return <GamesList />
}
