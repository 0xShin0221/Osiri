import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Privacy = () => {
  const { t } = useTranslation("privacy");

  return (
    <div className="container py-24 sm:py-32">
      <Card className="p-6 md:p-8">
        <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-8">{t("introduction")}</p>

          {/* Section 1: Personal Information Definition */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section1.title")}
            </h2>
            <p>{t("section1.content")}</p>
          </section>

          {/* Section 2: Collection Methods */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section2.title")}
            </h2>
            <p>{t("section2.content")}</p>
          </section>

          {/* Section 3: Purpose of Collection */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section3.title")}
            </h2>
            <p>{t("section3.intro")}</p>
            <ol className="list-decimal space-y-2 mt-4">
              <li className="ml-6">{t("section3.items.service")}</li>
              <li className="ml-6">{t("section3.items.support")}</li>
              <li className="ml-6">{t("section3.items.updates")}</li>
              <li className="ml-6">{t("section3.items.maintenance")}</li>
              <li className="ml-6">{t("section3.items.prevention")}</li>
              <li className="ml-6">{t("section3.items.management")}</li>
              <li className="ml-6">{t("section3.items.billing")}</li>
              <li className="ml-6">{t("section3.items.additional")}</li>
            </ol>
          </section>

          {/* Section 4: Changes in Purpose */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section4.title")}
            </h2>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">{t("section4.items.change")}</li>
              <li className="ml-6">{t("section4.items.notification")}</li>
            </ol>
          </section>

          {/* Section 5: Third Party Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section5.title")}
            </h2>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">
                {t("section5.items.main")}
                <ol className="list-decimal space-y-2 mt-2">
                  <li className="ml-6">{t("section5.subitems.life")}</li>
                  <li className="ml-6">{t("section5.subitems.health")}</li>
                  <li className="ml-6">{t("section5.subitems.cooperation")}</li>
                  <li className="ml-6">
                    {t("section5.subitems.disclosure")}
                    <ol className="list-decimal space-y-2 mt-2">
                      <li className="ml-6">
                        {t("section5.subsubitems.purpose")}
                      </li>
                      <li className="ml-6">
                        {t("section5.subsubitems.items")}
                      </li>
                      <li className="ml-6">
                        {t("section5.subsubitems.method")}
                      </li>
                      <li className="ml-6">
                        {t("section5.subsubitems.optout")}
                      </li>
                      <li className="ml-6">
                        {t("section5.subsubitems.process")}
                      </li>
                    </ol>
                  </li>
                </ol>
              </li>
              <li className="ml-6">
                {t("section5.items.exceptions")}
                <ol className="list-decimal space-y-2 mt-2">
                  <li className="ml-6">
                    {t("section5.subitems2.outsourcing")}
                  </li>
                  <li className="ml-6">{t("section5.subitems2.succession")}</li>
                  <li className="ml-6">{t("section5.subitems2.joint")}</li>
                </ol>
              </li>
            </ol>
          </section>

          {/* Section 6: Information Disclosure */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section6.title")}
            </h2>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">
                {t("section6.items.disclosure")}
                <ol className="list-decimal space-y-2 mt-2">
                  <li className="ml-6">{t("section6.subitems.harm")}</li>
                  <li className="ml-6">
                    {t("section6.subitems.interference")}
                  </li>
                  <li className="ml-6">{t("section6.subitems.violation")}</li>
                </ol>
              </li>
              <li className="ml-6">{t("section6.items.limitation")}</li>
            </ol>
          </section>

          {/* Section 7: Correction and Deletion */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section7.title")}
            </h2>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">{t("section7.items.request")}</li>
              <li className="ml-6">{t("section7.items.process")}</li>
              <li className="ml-6">{t("section7.items.notification")}</li>
            </ol>
          </section>

          {/* Section 8: Usage Suspension */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section8.title")}
            </h2>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">{t("section8.items.investigation")}</li>
              <li className="ml-6">{t("section8.items.suspension")}</li>
              <li className="ml-6">{t("section8.items.notification")}</li>
              <li className="ml-6">{t("section8.items.alternative")}</li>
            </ol>
          </section>

          {/* Section 9: Privacy Policy Changes */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section9.title")}
            </h2>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">{t("section9.items.changes")}</li>
              <li className="ml-6">{t("section9.items.effectiveness")}</li>
            </ol>
          </section>

          {/* Section 10: Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("contact.title")}
            </h2>
            <div className="space-y-2">
              <p>{t("contact.info")}</p>
              <div className="mt-4 space-y-1">
                <p>
                  <span className="font-medium">
                    {t("contact.address_label")}
                  </span>
                  {t("contact.address")}
                </p>
                <p>
                  <span className="font-medium">
                    {t("contact.company_label")}
                  </span>
                  {t("contact.company")}
                </p>
                <p>
                  <span className="font-medium">
                    {t("contact.department_label")}
                  </span>
                  {t("contact.department")}
                </p>
                <p>
                  <span className="font-medium">
                    {t("contact.email_label")}
                  </span>
                  {t("contact.email")}
                </p>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          <p className="text-right">{t("lastUpdated")}</p>
        </div>
      </Card>
    </div>
  );
};

export default Privacy;
