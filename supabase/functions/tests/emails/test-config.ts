import { SupportedLanguage } from "../../_shared/types.ts";

export const templateConfigs: Record<SupportedLanguage, {
  subject: string;
  welcomeText: string;
  discountText: string;
  description: string;
}> = {
  en: {
    subject: "Osiri Early Access Registration | Get Free Coupon",
    welcomeText: "Welcome to Osiri Early Access",
    discountText: "50% Off for One Year",
    description: "English template test",
  },
  ja: {
    subject: "Osiri アーリーアクセス登録 | 無料クーポン獲得",
    welcomeText: "Osiriアーリーアクセスへようこそ",
    discountText: "1年間50%オフ",
    description: "Japanese template test",
  },
  zh: {
    subject: "Osiri 早期访问注册 | 免费优惠券获取",
    welcomeText: "欢迎加入 Osiri 早期访问",
    discountText: "一年50%折扣",
    description: "Chinese template test",
  },
  ko: {
    subject: "Osiri 조기 액세스 등록 | 무료 쿠폰 받기",
    welcomeText: "Osiri 조기 액세스에 오신 것을 환영합니다",
    discountText: "1년간 50% 할인",
    description: "Korean template test",
  },
  fr: {
    subject: "Inscription à l'accès anticipé Osiri | Obtenez un coupon gratuit",
    welcomeText: "Bienvenue dans l'accès anticipé Osiri",
    discountText: "50% de réduction pendant un an",
    description: "French template test",
  },
  es: {
    subject: "Registro de acceso anticipado en Osiri | Obtén un cupón gratis",
    welcomeText: "Bienvenido al acceso anticipado de Osiri",
    discountText: "50% de descuento por 1 año",
    description: "Spanish template test",
  },
  hi: {
    subject: "Osiri पर अर्ली एक्सेस पंजीकरण | मुफ़्त कूपन प्राप्त करें",
    welcomeText: "Osiri अर्ली एक्सेस में आपका स्वागत है",
    discountText: "1 वर्ष के लिए 50% की छूट",
    description: "Hindi template test",
  },
  pt: {
    subject: "Registro de Acesso Antecipado no Osiri | Obtenha um Cupom Grátis",
    welcomeText: "Bem-vindo ao Acesso Antecipado do Osiri",
    discountText: "50% de desconto por 1 ano",
    description: "Portuguese template test",
  },
  bn: {
    subject: "Osiri-এর প্রাথমিক অ্যাক্সেস নিবন্ধন | বিনামূল্যে কুপন পান",
    welcomeText: "Osiri প্রাথমিক অ্যাক্সেসে আপনাকে স্বাগতম",
    discountText: "১ বছরের জন্য ৫০% ছাড়",
    description: "Bengali template test",
  },
  ru: {
    subject: "Ранняя регистрация на Osiri | Получите бесплатный купон",
    welcomeText: "Добро пожаловать в ранний доступ Osiri",
    discountText: "50% скидка на 1 год",
    description:
      "Вы получили специальный купон для глобальной ленты новостей AI в приложении Osiri",
  },
  id: {
    subject: "Pendaftaran Akses Awal di Osiri | Dapatkan Kupon Gratis",
    welcomeText: "Selamat Datang di Akses Awal Osiri",
    discountText: "Diskon 50% selama 1 tahun",
    description:
      "Anda telah menerima kupon khusus untuk Osiri App, layanan berita AI global",
  },
  de: {
    subject:
      "Frühzeitige Registrierung bei Osiri | Erhalten Sie einen kostenlosen Gutschein",
    welcomeText: "Willkommen beim Frühzugang zu Osiri",
    discountText: "50% Rabatt für 1 Jahr",
    description:
      "Sie haben einen speziellen Gutschein für den globalen KI-Nachrichtenfeed der Osiri App erhalten",
  },
};
