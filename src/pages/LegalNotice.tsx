import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function LegalNotice() {
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
                  {t("seller")}
                </th>
                <td className="py-4">Osiri</td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("representative")}
                </th>
                <td className="py-4">中川真太郎</td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("address")}
                </th>
                <td className="py-4">{t("contact.phoneValue")}</td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("contact.title")}
                </th>
                <td className="py-4">
                  {t("contact.email")}: {t("contact.emailValue")}
                  <br />
                  {t("contact.phone")}: {t("contact.phoneValue")}
                  <br />
                  {t("contact.hours")}: {t("contact.hoursValue")}
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("service.title")}
                </th>
                <td className="py-4">
                  {t("service.name")}
                  <br />
                  {t("service.nameJp")}
                  <br />
                  <p className="mt-2">{t("service.description")}</p>
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("price.title")}
                </th>
                <td className="py-4">
                  {t("price.amount")}
                  <br />
                  <span className="text-sm text-gray-600">
                    {t("price.note")}
                  </span>
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("trial.title")}
                </th>
                <td className="py-4">
                  {t("trial.period")}
                  <br />
                  {t("trial.noCard")}
                  <br />
                  <p className="mt-2 font-medium">{t("trial.after")}</p>
                  {t("trial.billing")}
                  <br />
                  {t("trial.cancel")}
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("payment.title")}
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
                  {t("billing.title")}
                </th>
                <td className="py-4">
                  {t("billing.timing")}
                  <br />
                  {t("billing.note")}
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("additionalFees.title")}
                </th>
                <td className="py-4">
                  {t("additionalFees.none")}
                  <br />
                  {t("additionalFees.internet")}
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("delivery.title")}
                </th>
                <td className="py-4">{t("delivery.immediate")}</td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("restrictions.title")}
                </th>
                <td className="py-4">
                  <ul className="list-disc pl-5">
                    <li>{t("restrictions.items.sharing")}</li>
                    <li>{t("restrictions.items.channels")}</li>
                    <li>{t("restrictions.items.frequency")}</li>
                  </ul>
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("cancel.title")}
                </th>
                <td className="py-4">
                  <p className="mb-2">{t("cancel.about.title")}</p>
                  <ul className="list-disc pl-5 mb-4">
                    <li>{t("cancel.about.items.anytime")}</li>
                    <li>{t("cancel.about.items.mypage")}</li>
                    <li>{t("cancel.about.items.untilEnd")}</li>
                    <li>{t("cancel.about.items.noRefund")}</li>
                  </ul>

                  <p className="mb-2">{t("cancel.process.title")}</p>
                  <ol className="list-decimal pl-5">
                    <li>{t("cancel.process.steps.login")}</li>
                    <li>{t("cancel.process.steps.menu")}</li>
                    <li>{t("cancel.process.steps.follow")}</li>
                  </ol>
                </td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("data.title")}
                </th>
                <td className="py-4">{t("data.retention")}</td>
              </tr>

              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  {t("requirements.title")}
                </th>
                <td className="py-4">
                  {t("requirements.subtitle")}
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
}
