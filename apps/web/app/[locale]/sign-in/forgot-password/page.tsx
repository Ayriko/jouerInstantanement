import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ForgotPassword from "./ForgotPassword";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t("account.signIn.forgotPassword.meta.title")} ${t("common.metaSeparator")} ${t("common.siteName")}`,
    description: t("account.signIn.forgotPassword.meta.description"),
  };
}

export default function Page(): React.JSX.Element {
  return <ForgotPassword />;
}
