import {
  EmailTemplateContent,
  SupportedLanguage,
} from "../../../_shared/types.ts";
import { enTemplate } from "./localized/en.ts";
import { jaTemplate } from "./localized/ja.ts";
import { bnTemplate } from "./localized/bn.ts";
import { ruTemplate } from "./localized/ru.ts";
import { idTemplate } from "./localized/id.ts";
import { deTemplate } from "./localized/de.ts";
import { esTemplate } from "./localized/es.ts";
import { frTemplate } from "./localized/fr.ts";
import { hiTemplate } from "./localized/hi.ts";
import { koTemplate } from "./localized/ko.ts";
import { ptTemplate } from "./localized/pt.ts";
import { zhTemplate } from "./localized/zh.ts";

export const getNewsletterTemplate = (
  language: SupportedLanguage,
  data: Record<string, any>,
): EmailTemplateContent => {
  console.info("getNewsletterTemplate Input:", { language, data });

  switch (language) {
    case "ja":
      return jaTemplate(data, language);
    case "en":
      return enTemplate(data, language);
    case "bn":
      return bnTemplate(data, language);
    case "ru":
      return ruTemplate(data, language);
    case "id":
      return idTemplate(data, language);
    case "de":
      return deTemplate(data, language);
    case "es":
      return esTemplate(data, language);
    case "fr":
      return frTemplate(data, language);
    case "hi":
      return hiTemplate(data, language);
    case "ko":
      return koTemplate(data, language);
    case "pt":
      return ptTemplate(data, language);
    case "zh":
      return zhTemplate(data, language);
    default:
      return enTemplate(data, language);
  }
};
