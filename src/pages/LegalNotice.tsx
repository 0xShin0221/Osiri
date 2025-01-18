import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const LegalNotice = () => {
  const { t } = useTranslation("legal");

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top w-1/4">
                  {t("seller.label")}
                </th>
                <td className="py-4">{t("seller.value")}</td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("representative.label")}
                </th>
                <td className="py-4">{t("representative.value")}</td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("address.label")}
                </th>
                <td className="py-4">{t("address.value")}</td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("contact.label")}
                </th>
                <td className="py-4">
                  {t("contact.email.label")}: {t("contact.email.value")}
                  <br />
                  {t("contact.phone.label")}: {t("contact.phone.value")}
                  <br />
                  {t("contact.hours.label")}: {t("contact.hours.value")}
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("service.label")}
                </th>
                <td className="py-4">
                  {t("service.name")}
                  <br />
                  {t("service.nameJp")}
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("price.label")}
                </th>
                <td className="py-4">
                  {t("price.monthly")}
                  <br />
                  <span className="text-sm text-gray-600">
                    {t("price.taxIncluded")}
                  </span>
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("trial.label")}
                </th>
                <td className="py-4">
                  {t("trial.period")}
                  <br />
                  {t("trial.noCard")}
                  <br />
                  {t("trial.fullAccess")}
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("payment.label")}
                </th>
                <td className="py-4">
                  {t("payment.method")}
                  <br />
                  {t("payment.cards.visa")}
                  <br />
                  {t("payment.cards.mastercard")}
                  <br />
                  {t("payment.cards.amex")}
                  <br />
                  {t("payment.cards.jcb")}
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("billing.label")}
                </th>
                <td className="py-4">
                  {t("billing.timing")}
                  <br />
                  {t("billing.autoCharge")}
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("additionalFees.label")}
                </th>
                <td className="py-4">
                  {t("additionalFees.none")}
                  <br />
                  {t("additionalFees.internet")}
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("delivery.label")}
                </th>
                <td className="py-4">{t("delivery.immediate")}</td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("cancellation.label")}
                </th>
                <td className="py-4">
                  <p className="mb-2">{t("cancellation.about.title")}</p>
                  <ul className="list-disc pl-5 mb-4">
                    <li>{t("cancellation.about.anytime")}</li>
                    <li>{t("cancellation.about.mypage")}</li>
                    <li>{t("cancellation.about.untilEnd")}</li>
                    <li>{t("cancellation.about.noRefund")}</li>
                  </ul>

                  <p className="mb-2">{t("cancellation.process.title")}</p>
                  <ol className="list-decimal pl-5">
                    <li>{t("cancellation.process.login")}</li>
                    <li>{t("cancellation.process.menu")}</li>
                    <li>{t("cancellation.process.follow")}</li>
                  </ol>
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("requirements.label")}
                </th>
                <td className="py-4">
                  {t("requirements.title")}
                  <br />
                  {t("requirements.pc")}
                  <br />
                  {t("requirements.mobile")}
                  <br />
                  {t("requirements.note")}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalNotice;
