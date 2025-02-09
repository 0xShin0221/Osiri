// limitNotification.i18n.ts

import type { Database } from "../types/database.types";
type FeedLanguage = Database["public"]["Enums"]["feed_language"];

interface LimitNotificationMessages {
    header: string;
    limitReachedMessage: string;
    plan: string;
    dailyLimit: string;
    usageStats: string;
    upgradeHint: string;
    upgradeButton: string;
    managePlan: string;
    fallbackText: string;
}

const messages: Record<FeedLanguage, LimitNotificationMessages> = {
    en: {
        header: "Daily Notification Limit Reached 🔔",
        limitReachedMessage:
            "You've reached your daily notification limit. To ensure uninterrupted service, consider upgrading your plan.",
        plan: "Current Plan",
        dailyLimit: "Daily Limit",
        usageStats: "Usage Today",
        upgradeHint:
            "Need more capacity? Upgrade your plan to get additional notifications and premium features.",
        upgradeButton: "Upgrade Plan",
        managePlan: "Manage Subscription",
        fallbackText:
            "Daily notification limit reached. Visit o-siri.com to upgrade your plan.",
    },
    ja: {
        header: "通知制限に達しました 🔔",
        limitReachedMessage:
            "1日の通知制限に達しました。サービスを途切れることなくご利用いただくには、プランのアップグレードをご検討ください。",
        plan: "現在のプラン",
        dailyLimit: "1日の制限",
        usageStats: "本日の使用状況",
        upgradeHint:
            "より多くの通知が必要ですか？プランをアップグレードして、追加の通知とプレミアム機能を取得できます。",
        upgradeButton: "プランをアップグレード",
        managePlan: "サブスクリプション管理",
        fallbackText:
            "通知制限に達しました。o-siri.comでプランをアップグレードしてください。",
    },
    zh: {
        header: "已达到每日通知限制 🔔",
        limitReachedMessage:
            "您已达到每日通知限制。为确保服务不中断，请考虑升级您的计划。",
        plan: "当前计划",
        dailyLimit: "每日限制",
        usageStats: "今日使用情况",
        upgradeHint: "需要更多容量？升级计划以获取额外通知和高级功能。",
        upgradeButton: "升级计划",
        managePlan: "管理订阅",
        fallbackText: "已达到每日通知限制。访问o-siri.com升级计划。",
    },
    ko: {
        header: "일일 알림 한도에 도달했습니다 🔔",
        limitReachedMessage:
            "일일 알림 한도에 도달했습니다. 서비스 중단을 방지하기 위해 플랜 업그레이드를 고려해 주세요.",
        plan: "현재 플랜",
        dailyLimit: "일일 한도",
        usageStats: "오늘 사용량",
        upgradeHint:
            "더 많은 용량이 필요하신가요? 플랜을 업그레이드하여 추가 알림과 프리미엄 기능을 이용하세요.",
        upgradeButton: "플랜 업그레이드",
        managePlan: "구독 관리",
        fallbackText:
            "일일 알림 한도에 도달했습니다. o-siri.com에서 플랜을 업그레이드하세요.",
    },
    fr: {
        header: "Limite quotidienne de notifications atteinte 🔔",
        limitReachedMessage:
            "Vous avez atteint votre limite quotidienne de notifications. Pour assurer un service ininterrompu, envisagez de mettre à niveau votre forfait.",
        plan: "Forfait actuel",
        dailyLimit: "Limite quotidienne",
        usageStats: "Utilisation aujourd'hui",
        upgradeHint:
            "Besoin de plus de capacité ? Mettez à niveau votre forfait pour obtenir des notifications supplémentaires et des fonctionnalités premium.",
        upgradeButton: "Mettre à niveau",
        managePlan: "Gérer l'abonnement",
        fallbackText:
            "Limite de notifications atteinte. Visitez o-siri.com pour mettre à niveau.",
    },
    es: {
        header: "Límite diario de notificaciones alcanzado 🔔",
        limitReachedMessage:
            "Has alcanzado tu límite diario de notificaciones. Para asegurar un servicio ininterrumpido, considera actualizar tu plan.",
        plan: "Plan actual",
        dailyLimit: "Límite diario",
        usageStats: "Uso de hoy",
        upgradeHint:
            "¿Necesitas más capacidad? Actualiza tu plan para obtener notificaciones adicionales y funciones premium.",
        upgradeButton: "Actualizar plan",
        managePlan: "Gestionar suscripción",
        fallbackText:
            "Límite de notificaciones alcanzado. Visita o-siri.com para actualizar.",
    },
    hi: {
        header: "दैनिक सूचना सीमा पहुंच गई 🔔",
        limitReachedMessage:
            "आपकी दैनिक सूचना सीमा समाप्त हो गई है। निर्बाध सेवा सुनिश्चित करने के लिए, अपनी योजना को अपग्रेड करने पर विचार करें।",
        plan: "वर्तमान योजना",
        dailyLimit: "दैनिक सीमा",
        usageStats: "आज का उपयोग",
        upgradeHint:
            "अधिक क्षमता की आवश्यकता है? अतिरिक्त सूचनाएं और प्रीमियम सुविधाएं प्राप्त करने के लिए अपनी योजना अपग्रेड करें।",
        upgradeButton: "योजना अपग्रेड करें",
        managePlan: "सदस्यता प्रबंधित करें",
        fallbackText: "दैनिक सूचना सीमा समाप्त। अपग्रेड के लिए o-siri.com पर जाएं।",
    },
    pt: {
        header: "Limite diário de notificações atingido 🔔",
        limitReachedMessage:
            "Você atingiu seu limite diário de notificações. Para garantir um serviço ininterrupto, considere fazer um upgrade do seu plano.",
        plan: "Plano atual",
        dailyLimit: "Limite diário",
        usageStats: "Uso hoje",
        upgradeHint:
            "Precisa de mais capacidade? Faça upgrade do seu plano para obter notificações adicionais e recursos premium.",
        upgradeButton: "Fazer upgrade",
        managePlan: "Gerenciar assinatura",
        fallbackText:
            "Limite de notificações atingido. Visite o-siri.com para fazer upgrade.",
    },
    bn: {
        header: "দৈনিক বিজ্ঞপ্তি সীমা পৌঁছেছে 🔔",
        limitReachedMessage:
            "আপনি আপনার দৈনিক বিজ্ঞপ্তি সীমায় পৌঁছেছেন। নিরবিচ্ছিন্ন পরিষেবা নিশ্চিত করতে, আপনার প্ল্যান আপগ্রেড করার কথা বিবেচনা করুন।",
        plan: "বর্তমান প্ল্যান",
        dailyLimit: "দৈনিক সীমা",
        usageStats: "আজকের ব্যবহার",
        upgradeHint:
            "আরও ক্ষমতা প্রয়োজন? অতিরিক্ত বিজ্ঞপ্তি এবং প্রিমিয়াম বৈশিষ্ট্য পেতে আপনার প্ল্যান আপগ্রেড করুন।",
        upgradeButton: "প্ল্যান আপগ্রেড করুন",
        managePlan: "সাবস্ক্রিপশন পরিচালনা করুন",
        fallbackText: "বিজ্ঞপ্তি সীমা পৌঁছেছে। আপগ্রেড করতে o-siri.com দেখুন।",
    },
    ru: {
        header: "Достигнут дневной лимит уведомлений 🔔",
        limitReachedMessage:
            "Вы достигли дневного лимита уведомлений. Чтобы обеспечить непрерывность обслуживания, рассмотрите возможность обновления вашего плана.",
        plan: "Текущий план",
        dailyLimit: "Дневной лимит",
        usageStats: "Использовано сегодня",
        upgradeHint:
            "Нужно больше возможностей? Обновите план, чтобы получить дополнительные уведомления и премиум-функции.",
        upgradeButton: "Обновить план",
        managePlan: "Управление подпиской",
        fallbackText:
            "Достигнут лимит уведомлений. Посетите o-siri.com для обновления.",
    },
    id: {
        header: "Batas Notifikasi Harian Tercapai 🔔",
        limitReachedMessage:
            "Anda telah mencapai batas notifikasi harian. Untuk memastikan layanan tidak terputus, pertimbangkan untuk meningkatkan paket Anda.",
        plan: "Paket Saat Ini",
        dailyLimit: "Batas Harian",
        usageStats: "Penggunaan Hari Ini",
        upgradeHint:
            "Butuh kapasitas lebih? Tingkatkan paket Anda untuk mendapatkan notifikasi tambahan dan fitur premium.",
        upgradeButton: "Tingkatkan Paket",
        managePlan: "Kelola Langganan",
        fallbackText:
            "Batas notifikasi tercapai. Kunjungi o-siri.com untuk meningkatkan paket.",
    },
    de: {
        header: "Tägliches Benachrichtigungslimit erreicht 🔔",
        limitReachedMessage:
            "Sie haben Ihr tägliches Benachrichtigungslimit erreicht. Um einen unterbrechungsfreien Service zu gewährleisten, erwägen Sie ein Upgrade Ihres Plans.",
        plan: "Aktueller Plan",
        dailyLimit: "Tägliches Limit",
        usageStats: "Heutige Nutzung",
        upgradeHint:
            "Benötigen Sie mehr Kapazität? Upgraden Sie Ihren Plan für zusätzliche Benachrichtigungen und Premium-Funktionen.",
        upgradeButton: "Plan upgraden",
        managePlan: "Abonnement verwalten",
        fallbackText:
            "Benachrichtigungslimit erreicht. Besuchen Sie o-siri.com für ein Upgrade.",
    },
};

export const getLimitNotificationMessages = (
    language: FeedLanguage,
): LimitNotificationMessages => {
    return messages[language] || messages.en;
};
