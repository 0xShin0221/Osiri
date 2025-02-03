import { FeedLanguage, PlanId } from "./types/models";

export const PLAN_TRANSLATIONS: Record<
    PlanId,
    Record<FeedLanguage, { name: string; description: string }>
> = {
    free: {
        en: {
            name: "Free",
            description: "Basic free plan with essential features",
        },
        ja: { name: "フリー", description: "基本的な機能を備えた無料プラン" },
        zh: { name: "免费", description: "基本功能免费计划" },
        ko: { name: "무료", description: "기본 기능이 포함된 무료 플랜" },
        fr: {
            name: "Gratuit",
            description: "Plan gratuit avec fonctionnalités essentielles",
        },
        es: {
            name: "Gratis",
            description: "Plan gratuito con funciones esenciales",
        },
        hi: { name: "फ्री", description: "बुनियादी सुविधाओं के साथ मुफ्त योजना" },
        pt: {
            name: "Gratuito",
            description: "Plano gratuito com recursos essenciais",
        },
        bn: { name: "ফ্রি", description: "প্রাথমিক বৈশিষ্ট্য সহ বিনামূল্যে প্ল্যান" },
        ru: {
            name: "Бесплатный",
            description: "Бесплатный план с базовыми функциями",
        },
        id: { name: "Gratis", description: "Paket gratis dengan fitur dasar" },
        de: {
            name: "Kostenlos",
            description: "Kostenloser Plan mit grundlegenden Funktionen",
        },
    },
    pro: {
        en: {
            name: "Pro",
            description: "Professional plan with advanced features",
        },
        ja: {
            name: "プロ",
            description: "高度な機能を備えたプロフェッショナルプラン",
        },
        zh: { name: "专业版", description: "具有高级功能的专业计划" },
        ko: { name: "프로", description: "고급 기능이 포함된 전문가용 플랜" },
        fr: {
            name: "Pro",
            description: "Plan professionnel avec fonctionnalités avancées",
        },
        es: {
            name: "Pro",
            description: "Plan profesional con características avanzadas",
        },
        hi: { name: "प्रो", description: "उन्नत सुविधाओं के साथ प्रोफेशनल योजना" },
        pt: {
            name: "Pro",
            description: "Plano profissional com recursos avançados",
        },
        bn: { name: "প্রো", description: "উন্নত বৈশিষ্ট্য সহ প্রফেশনাল প্ল্যান" },
        ru: {
            name: "Про",
            description: "Профессиональный план с расширенными функциями",
        },
        id: {
            name: "Pro",
            description: "Paket profesional dengan fitur lanjutan",
        },
        de: {
            name: "Pro",
            description: "Professioneller Plan mit erweiterten Funktionen",
        },
    },
    pro_plus: {
        en: { name: "Pro+", description: "Pro plan with usage-based billing" },
        ja: { name: "プロ+", description: "利用量ベースの課金プラン" },
        zh: { name: "专业增强版", description: "按使用量计费的专业计划" },
        ko: { name: "프로+", description: "사용량 기반 과금의 프로 플랜" },
        fr: {
            name: "Pro+",
            description: "Plan Pro avec facturation basée sur l'utilisation",
        },
        es: {
            name: "Pro+",
            description: "Plan Pro con facturación basada en el uso",
        },
        hi: { name: "प्रो+", description: "उपयोग आधारित बिलिंग के साथ प्रो योजना" },
        pt: {
            name: "Pro+",
            description: "Plano Pro com cobrança baseada no uso",
        },
        bn: { name: "প্রো+", description: "ব্যবহার ভিত্তিক বিলিং সহ প্রো প্ল্যান" },
        ru: {
            name: "Про+",
            description: "План Про с оплатой за использование",
        },
        id: {
            name: "Pro+",
            description: "Paket Pro dengan penagihan berbasis penggunaan",
        },
        de: {
            name: "Pro+",
            description: "Pro-Plan mit nutzungsbasierter Abrechnung",
        },
    },
    business: {
        en: {
            name: "Business",
            description: "Enterprise-grade features and support",
        },
        ja: { name: "ビジネス", description: "企業向けの機能とサポート" },
        zh: { name: "商业版", description: "企业级功能和支持" },
        ko: { name: "비즈니스", description: "기업급 기능과 지원" },
        fr: {
            name: "Business",
            description: "Fonctionnalités et support de niveau entreprise",
        },
        es: {
            name: "Business",
            description: "Características y soporte de nivel empresarial",
        },
        hi: { name: "बिजनेस", description: "एंटरप्राइज-ग्रेड सुविधाएं और सहायता" },
        pt: {
            name: "Business",
            description: "Recursos e suporte de nível empresarial",
        },
        bn: { name: "বিজনেস", description: "এন্টারপ্রাইজ-গ্রেড বৈশিষ্ট্য এবং সহায়তা" },
        ru: {
            name: "Бизнес",
            description: "Корпоративные функции и поддержка",
        },
        id: {
            name: "Business",
            description: "Fitur dan dukungan tingkat perusahaan",
        },
        de: {
            name: "Business",
            description: "Enterprise-Funktionen und Support",
        },
    },
    business_plus: {
        en: {
            name: "Business+",
            description: "Enterprise plan with flexible usage",
        },
        ja: {
            name: "ビジネス+",
            description: "柔軟な利用が可能な企業向けプラン",
        },
        zh: { name: "商业增强版", description: "灵活使用的企业计划" },
        ko: {
            name: "비즈니스+",
            description: "유연한 사용이 가능한 기업용 플랜",
        },
        fr: {
            name: "Business+",
            description: "Plan entreprise avec utilisation flexible",
        },
        es: {
            name: "Business+",
            description: "Plan empresarial con uso flexible",
        },
        hi: { name: "बिजनेस+", description: "लचीले उपयोग के साथ एंटरप्राइज योजना" },
        pt: {
            name: "Business+",
            description: "Plano empresarial com uso flexível",
        },
        bn: { name: "বিজনেস+", description: "নমনীয় ব্যবহার সহ এন্টারপ্রাইজ প্ল্যান" },
        ru: {
            name: "Бизнес+",
            description: "Корпоративный план с гибким использованием",
        },
        id: {
            name: "Business+",
            description: "Paket perusahaan dengan penggunaan fleksibel",
        },
        de: {
            name: "Business+",
            description: "Enterprise-Plan mit flexibler Nutzung",
        },
    },
};
