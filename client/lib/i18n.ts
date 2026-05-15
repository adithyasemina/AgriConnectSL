export type Language = "en" | "si";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Sidebar
    dashboard: "Dashboard",
    findDisease: "Find Disease",
    soilTest: "Soil Test",
    chat: "Chat",
    alerts: "Alerts",
    notifications: "Notifications",
    settings: "Settings",
    logout: "Logout",
    farmerMenu: "Farmer Menu",
    farmerPanel: "Farmer Panel",

    // Dashboard
    welcomeDashboard: "Welcome to Your Dashboard",
    yourProfile: "Your Profile",
    lastPredictions: "Last Predictions",
    noData: "No data available",

    // Find Disease
    findDiseaseTitle: "Identify Leaf Disease",
    uploadImage: "Upload a rice leaf image",
    uploadImageDesc: "Choose a clear image of your rice leaf for analysis",
    selectImage: "Select Image",
    analyze: "Analyze Disease",
    analyzeDisease: "Analyze Disease",
    selectImageFirst: "Please select an image first",
    disease: "Disease",
    confidence: "Confidence",
    recommendations: "Recommendations",
    diseasePredictionHistory: "Disease Prediction History",
    noHistory: "No prediction history yet",
    view: "View",
    invalidImageOrLowConfidence: "Invalid image or low confidence. Please upload a clear rice leaf image.",
    imageName: "Image Name",
    dateAnalyzed: "Date Analyzed",
    allPredictions: "All Predictions",
    close: "Close",

    // Disease recommendations
    bacterialLeafBlight: "Bacterial Leaf Blight",
    brownSpot: "Brown Spot",
    leafSmut: "Leaf Smut",
    healthy: "Healthy",
    blastDisease: "Blast Disease",
    narrowBrownLeafSpot: "Narrow Brown Leaf Spot",

    // Soil Test
    soilTestTitle: "Soil Test",
    testNitrogen: "Test Nitrogen",
    testPhosphorus: "Test Phosphorus",
    testPotassium: "Test Potassium",
    requestTest: "Request Test",

    // Chat
    messages: "Messages",
    typeMessage: "Type your message...",
    send: "Send",
    noMessages: "No messages yet",
    onlineOfficers: "Online Officers",

    // Alerts
    alertsTitle: "Alerts",
    noAlerts: "No alerts at this time",
    dismissAlert: "Dismiss",

    // Notifications
    notificationsTitle: "Notifications",
    noNotifications: "No notifications yet",
    markAsRead: "Mark as read",

    // Settings
    settingsTitle: "Settings",
    language: "Language",
    selectLanguage: "Select your preferred language",
    english: "English",
    sinhala: "Sinhala",
    save: "Save",
    languageUpdated: "Language preference updated",

    // Common
    profile: "Profile",
    error: "Error",
    success: "Success",
    loading: "Loading...",
    goBack: "Go Back",
  },
  si: {
    // Navigation & Sidebar
    dashboard: "ড্যাশবোর্ড",
    findDisease: "රෝග සනාক්ත කරන්න",
    soilTest: "පසු පරීක්ෂණය",
    chat: "කතා",
    alerts: "ඇඟවීම්",
    notifications: "දැනුම්දීම්",
    settings: "සැකසුම්",
    logout: "ඉවත් වන්න",
    farmerMenu: "ගොවි සරණිය",
    farmerPanel: "ගොවි පුවරුව",

    // Dashboard
    welcomeDashboard: "ඔබේ ඩ්‍යාෂ්‍බෝර්ඩ් වෙත සාදරයි",
    yourProfile: "ඔබේ ගිණුම",
    lastPredictions: "අවසාන පුරෝකථන",
    noData: "ඩේටා නොමැත",

    // Find Disease
    findDiseaseTitle: "පත්‍ර රෝග හඳුනා ගන්න",
    uploadImage: "බත් පත්‍ර ඡායාවක් උඩුවන්න",
    uploadImageDesc: "විශ්ලේෂණ සඳහා ඔබේ බත් පත්‍ර පැහැදිලි ඡායාවක් තෝරන්න",
    selectImage: "ඡායාව තෝරන්න",
    analyze: "විශ්ලේෂණ කරන්න",
    analyzeDisease: "රෝග විශ්ලේෂණ කරන්න",
    selectImageFirst: "කරුණාකර ප්‍රථමයෙන් ඡායාවක් තෝරන්න",
    disease: "රෝग",
    confidence: "විශ්වාසය",
    recommendations: "නිර්දේශ",
    diseasePredictionHistory: "රෝග පුරෝකථන ඉතිහාසය",
    noHistory: "තවම පුරෝකථන ඉතිහාසයක් නොමැත",
    view: "බලන්න",
    invalidImageOrLowConfidence: "වලංගු නොවන ඡායාව හෝ අඩු විශ්වාසය. කරුණාකර ඔබේ බත් පත්‍ර පැහැදිලි ඡායාවක් උඩුවන්න.",
    imageName: "ඡායා නම",
    dateAnalyzed: "විශ්ලේෂණ කරන ලද දිනය",
    allPredictions: "සියලුම පුරෝකථන",
    close: "වසන්න",

    // Disease recommendations
    bacterialLeafBlight: "බැක්ටීරියා පත්‍ර පිපිலිම",
    brownSpot: "දුඹුරු ලක්ෂ්‍ය",
    leafSmut: "පත්‍ර මිලිතුඩු",
    healthy: "සෞස්ථ්‍ය",
    blastDisease: "පුපුරන රෝග",
    narrowBrownLeafSpot: "පටු දුඹුරු පත්‍ර ලක්ෂ්‍ය",

    // Soil Test
    soilTestTitle: "පසු පරීක්ෂණය",
    testNitrogen: "නයිට්‍රජන් පරීක්ෂා කරන්න",
    testPhosphorus: "ස්ෆොරස් පරීක්ෂා කරන්න",
    testPotassium: "කැලිසियම් පරීක්ෂා කරන්න",
    requestTest: "පරීක්ෂණ ඉල්ලුම් කරන්න",

    // Chat
    messages: "පණිවුඩ",
    typeMessage: "ඔබේ පණිවුඩ ටයිප් කරන්න...",
    send: "යවන්න",
    noMessages: "තවම පණිවුඩ නොමැත",
    onlineOfficers: "සබැඳි නිලධාරීන්",

    // Alerts
    alertsTitle: "ඇඟවීම්",
    noAlerts: "දැනට ඇඟවීම් නොමැත",
    dismissAlert: "ඉවත් කරන්න",

    // Notifications
    notificationsTitle: "දැනුම්දීම්",
    noNotifications: "තවම දැනුම්දීම් නොමැත",
    markAsRead: "කියවූ ලෙස සලකුණු කරන්න",

    // Settings
    settingsTitle: "සැකසුම්",
    language: "භාෂාව",
    selectLanguage: "ඔබේ අ선ුකූල භාෂාව තෝරන්න",
    english: "ඉංග්‍රීසි",
    sinhala: "සිංහල",
    save: "සුරකින්න",
    languageUpdated: "භාෂා අනුමතිය යාවත්කාලීන කරන ලදී",

    // Common
    profile: "ගිණුම",
    error: "දෝෂ",
    success: "සාර්ථක",
    loading: "පටවෙමින් ඉන්න...",
    goBack: "ආපසු යන්න",
  },
};

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("agri_language");
  return (stored as Language) || "en";
}

export function setLanguage(lang: Language): void {
  localStorage.setItem("agri_language", lang);
}

export function t(key: string, lang?: Language): string {
  const language = lang || getLanguage();
  return translations[language][key] || key;
}

export function useLanguage() {
  const lang = getLanguage();
  return {
    language: lang,
    t: (key: string) => t(key, lang),
    setLanguage,
  };
}
