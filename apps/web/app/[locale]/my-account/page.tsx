import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import MyAccount from './MyAccount';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t("account.meta.title")} ${t("common.metaSeparator")} ${t("common.siteName")}`,
    description: t("account.meta.description")
  };
}

export default function Page(): React.JSX.Element {
  return <MyAccount />
}
