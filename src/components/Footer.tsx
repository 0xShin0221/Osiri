import { LogoIcon } from "./Icons";
import { useTranslation } from "react-i18next";

interface FooterSection {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

const getFooterSections = (): FooterSection[] => {
  const { t } = useTranslation("home");
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;
  return [
    {
      title: t("footer.social.title"),
      links: [
        {
          label: "X",
          href: "https://twitter.com/OsiriApp",
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/company/osiri",
        },
        {
          label: "GitHub",
          href: "https://github.com/osiriapp",
        },
      ],
    },
    {
      title: t("footer.product.title"),
      links: [
        {
          label: t("footer.product.personas"),
          href: "#personas",
        },
        {
          label: t("footer.product.features"),
          href: "#features",
        },
        {
          label: t("footer.product.pricing"),
          href: "#pricing",
        },
        {
          label: t("footer.product.faq"),
          href: "#faq",
        },
      ],
    },
    {
      title: t("footer.support.title"),
      links: [
        {
          label: t("footer.support.help"),
          href: "mailto:support@osiri.xyz",
        },
        {
          label: t("footer.support.terms"),
          href: `/${currentLang}/terms`,
        },
        {
          label: t("footer.support.privacy"),
          href: `/${currentLang}/privacy`,
        },
      ],
    },
  ];
};

export const Footer = () => {
  const footerSections = getFooterSections();

  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <a
            rel="noreferrer noopener"
            href="/"
            className="font-bold text-xl flex"
          >
            <LogoIcon />
            Osiri
          </a>
        </div>

        {footerSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">{section.title}</h3>
            {section.links.map((link) => (
              <div key={link.label}>
                <a
                  rel="noreferrer noopener"
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  className="opacity-60 hover:opacity-100"
                >
                  {link.label}
                </a>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="container pb-14 text-center">
        <h3>© 2024 Osiri by Dig Da Tech LLC. All rights reserved.</h3>
      </section>
    </footer>
  );
};
