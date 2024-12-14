import { EmailTemplateContent, SupportedLanguage } from "../../../_shared/types.ts";
import { enTemplate } from "./localized/en.ts";
import { frTemplate } from "./localized/fr.ts";
import { jaTemplate } from "./localized/ja.ts";
import { zhTemplate } from "./localized/zh.ts";
import { hiTemplate } from "./localized/hi.ts";
import { ptTemplate } from "./localized/pt.ts";
import { bnTemplate } from "./localized/bn.ts";
import { ruTemplate } from "./localized/ru.ts";
import { idTemplate } from "./localized/id.ts";
import { deTemplate } from "./localized/de.ts";

export const getEarlyAccessTemplate = (
  language: SupportedLanguage,
  data?: Record<string, any>,
): EmailTemplateContent => {
  console.info("getEarlyAccessTemplate Input:", { language, data });

  switch (language) {
    case "ja":
      return jaTemplate(data);
    case "en":
      return enTemplate(data);
    case "zh":
      return zhTemplate(data);
    case "fr":
      return frTemplate(data);
    case "hi":
      return hiTemplate(data);
    case "pt":
      return ptTemplate(data);
    case "bn":
      return bnTemplate(data);
    case "ru":
      return ruTemplate(data);
    case "id":
      return idTemplate(data);
    case "de":
      return deTemplate(data);
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
};
