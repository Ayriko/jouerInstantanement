import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Order from "./Order";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t("order.meta.title")} ${t("common.metaSeparator")} ${t("common.siteName")}`,
    description: t("order.meta.description"),
  };
}

export default function Page(): React.JSX.Element {
  return <Order />;
}
