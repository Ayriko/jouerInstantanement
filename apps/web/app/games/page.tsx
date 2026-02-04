import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import GamesList from './GamesList';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");

  return {
    title: t("meta.title"),
    description: t("meta.description")
  };
}

export default function Page(): React.JSX.Element {
  return <GamesList />
}
