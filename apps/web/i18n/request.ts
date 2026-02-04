import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "fr";

  const [header, footer, notFound, home] = await Promise.all([
    import(`../translations/${locale}/header.json`),
    import(`../translations/${locale}/footer.json`),
    import(`../translations/${locale}/notFound.json`),
    import(`../translations/${locale}/home.json`),
  ]);

  return {
    locale,
    messages: {
      header: header.default,
      footer: footer.default,
      notFound: notFound.default,
      home: home.default,
    },
  };
});
