import { LogoIcon } from "./Icons";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

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
          href: "mailto:support@o-siri.com",
        },
        {
          label: t("footer.support.terms"),
          href: `/${currentLang}/terms`,
        },
        {
          label: t("footer.support.privacy"),
          href: `/${currentLang}/privacy`,
        },
        {
          label: t("footer.support.terms-of-trade"),
          href: `/${currentLang}/legal-notice`,
        },
      ],
    },
  ];
};

export const Footer = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage;
  const footerSections = getFooterSections();
  const navigate = useNavigate();

  const handleHashLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    if (window.location.pathname !== `/${currentLang}`) {
      navigate(`/${currentLang}${href}`);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <Link to={`/${currentLang}`} className="font-bold text-xl flex">
            <LogoIcon />
            Osiri
          </Link>
        </div>

        {footerSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">{section.title}</h3>
            {section.links.map((link) => (
              <div key={link.label}>
                {link.href.startsWith("#") ? (
                  <a
                    href={link.href}
                    className="opacity-60 hover:opacity-100"
                    onClick={(e) => handleHashLinkClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    rel="noreferrer noopener"
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    className="opacity-60 hover:opacity-100"
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="container pb-14 text-center">
        <h3>© 2025 Osiri by Dig Da Tech LLC. All rights reserved.</h3>
      </section>
    </footer>
  );
};
