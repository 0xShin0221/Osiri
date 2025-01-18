import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Terms = () => {
  const { t } = useTranslation("terms");

  return (
    <div className="container py-24 sm:py-32">
      <Card className="p-6 md:p-8">
        <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-8">{t("introduction")}</p>

          {/* Section 1: Application */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section1.title")}
            </h2>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">{t("section1.items.agreement")}</li>
              <li className="ml-6">{t("section1.items.regulations")}</li>
              <li className="ml-6">{t("section1.items.priority")}</li>
            </ol>
          </section>

          {/* Section 2: Registration */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section2.title")}
            </h2>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">{t("section2.items.registration")}</li>
              <li className="ml-6">
                {t("section2.items.rejection")}
                <ol className="list-decimal space-y-2 mt-2">
                  <li className="ml-6">{t("section2.subitems.false_info")}</li>
                  <li className="ml-6">{t("section2.subitems.violation")}</li>
                  <li className="ml-6">
                    {t("section2.subitems.inappropriate")}
                  </li>
                </ol>
              </li>
            </ol>
          </section>

          {/* Section 3: User ID and Password */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section3.title")}
            </h2>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">{t("section3.items.responsibility")}</li>
              <li className="ml-6">{t("section3.items.no_sharing")}</li>
              <li className="ml-6">{t("section3.items.security")}</li>
            </ol>
          </section>

          {/* Section 4: Usage Fees */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section4.title")}
            </h2>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">{t("section4.items.payment")}</li>
              <li className="ml-6">{t("section4.items.late_fees")}</li>
            </ol>
          </section>

          {/* Section 5: Prohibited Actions */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section5.title")}
            </h2>
            <p className="mb-4">{t("section5.introduction")}</p>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">{t("section5.items.illegal")}</li>
              <li className="ml-6">{t("section5.items.criminal")}</li>
              <li className="ml-6">{t("section5.items.ip_violation")}</li>
              <li className="ml-6">{t("section5.items.interference")}</li>
              <li className="ml-6">{t("section5.items.commercial")}</li>
              <li className="ml-6">{t("section5.items.disruption")}</li>
              <li className="ml-6">{t("section5.items.unauthorized")}</li>
              <li className="ml-6">{t("section5.items.data_collection")}</li>
              <li className="ml-6">{t("section5.items.malicious")}</li>
              <li className="ml-6">{t("section5.items.harmful")}</li>
              <li className="ml-6">{t("section5.items.impersonation")}</li>
              <li className="ml-6">{t("section5.items.advertising")}</li>
              <li className="ml-6">{t("section5.items.dating")}</li>
              <li className="ml-6">{t("section5.items.antisocial")}</li>
              <li className="ml-6">{t("section5.items.other_prohibited")}</li>
            </ol>
          </section>

          {/* Section 6: Service Suspension */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section6.title")}
            </h2>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">
                {t("section6.items.suspension")}
                <ol className="list-decimal space-y-2 mt-2">
                  <li className="ml-6">{t("section6.subitems.maintenance")}</li>
                  <li className="ml-6">
                    {t("section6.subitems.force_majeure")}
                  </li>
                  <li className="ml-6">{t("section6.subitems.technical")}</li>
                  <li className="ml-6">{t("section6.subitems.other")}</li>
                </ol>
              </li>
              <li className="ml-6">{t("section6.items.no_compensation")}</li>
            </ol>
          </section>

          {/* Section 7: Usage Restrictions */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section7.title")}
            </h2>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">
                {t("section7.items.restriction")}
                <ol className="list-decimal space-y-2 mt-2">
                  <li className="ml-6">{t("section7.subitems.violation")}</li>
                  <li className="ml-6">{t("section7.subitems.false_info")}</li>
                  <li className="ml-6">{t("section7.subitems.payment")}</li>
                  <li className="ml-6">{t("section7.subitems.no_response")}</li>
                  <li className="ml-6">{t("section7.subitems.inactive")}</li>
                  <li className="ml-6">{t("section7.subitems.other")}</li>
                </ol>
              </li>
              <li className="ml-6">{t("section7.items.no_liability")}</li>
            </ol>
          </section>

          {/* Section 8: Withdrawal */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section8.title")}
            </h2>
            <p>{t("section8.content")}</p>
          </section>

          {/* Section 9: Disclaimers */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section9.title")}
            </h2>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">{t("section9.items.no_warranty")}</li>
              <li className="ml-6">{t("section9.items.no_liability")}</li>
              <li className="ml-6">{t("section9.items.limited_liability")}</li>
              <li className="ml-6">{t("section9.items.disputes")}</li>
            </ol>
          </section>

          {/* Section 10: Service Changes */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section10.title")}
            </h2>
            <p>{t("section10.content")}</p>
          </section>

          {/* Section 11: Terms Changes */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section11.title")}
            </h2>
            <p>{t("section11.content")}</p>
          </section>

          {/* Section 12: Personal Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section12.title")}
            </h2>
            <p>{t("section12.content")}</p>
          </section>

          {/* Section 13: Notifications */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section13.title")}
            </h2>
            <p>{t("section13.content")}</p>
          </section>

          {/* Section 14: Transfer of Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section14.title")}
            </h2>
            <p>{t("section14.content")}</p>
          </section>

          {/* Section 15: Governing Law */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section15.title")}
            </h2>
            <ol className="list-decimal space-y-2">
              <li className="ml-6">{t("section15.items.law")}</li>
              <li className="ml-6">{t("section15.items.jurisdiction")}</li>
            </ol>
          </section>

          {/* Section 16: Application */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("section16.title")}
            </h2>
            <p>{t("section16.content")}</p>
          </section>

          <Separator className="my-8" />

          <p className="text-right">{t("lastUpdated")}</p>
        </div>
      </Card>
    </div>
  );
};
