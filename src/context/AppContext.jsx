import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

// Elegant translations dictionary for English and Arabic support
const translations = {
  en: {
    // Navigation
    navHome: "Home",
    navQuran: "Quran",
    navPrayer: "Prayer Times",
    navArticles: "Articles",
    navCommunity: "Circles",
    navContact: "Contact Us",
    navProducts: "Products",
    navLogin: "Sign In",
    navDashboard: "My Dashboard",
    navLogout: "Sign Out",

    // Hero
    heroTitle: "Your Comprehensive Guide to Quran Memorization & Daily Dhikr",
    heroSubtitle: "Access an interactive Quran with clear audio recitations, plan your worship with precise prayer times, join live study circles, find Arabic learning books, and connect with a supportive Muslim community.",
    heroExplore: "Explore Noble Quran",
    heroCommunity: "Join the Circle",

    // Features Section
    featQuranTitle: "Quran Memorization & Audio",
    featQuranDesc: "Listen to clear audio recitations and read translations side-by-side to assist in your Quran memorization journey.",
    featPrayerTitle: "Accurate Prayer Times",
    featPrayerDesc: "Get precise prayer calculation methods based on your location with soft Athan notification countdowns.",
    featCommunityTitle: "Dhikr & Quran Circles",
    featCommunityDesc: "Create or join live circles to recite Quran, memorize together, count group Tasbih, and share spiritual reflections.",
    featArticlesTitle: "Islamic Articles & Arabic Learning",
    featArticlesDesc: "Explore well-researched guides on Islamic history, daily du'as, spiritual goals, and learning the Arabic language.",

    // Products Section
    prodSectionTitle: "Islamic Books & E-Books",
    prodSectionSubtitle: "Browse top-rated physical and electronic books for learning Arabic, prayer journals, and digital copies of Hisn al-Muslim.",
    prodBuyNow: "Get on Amazon",
    prodReviewSingular: "review",
    prodReviewsPlural: "reviews",

    // Quran Section
    quranTitle: "The Noble Quran",
    quranSubtitle: "Read, listen, and bookmark the words of Allah",
    quranSearchPlace: "Search Surahs by name or number...",
    quranAudioListen: "Listen Recitation",
    quranVerse: "Verse",
    quranPlayAll: "Play Full Surah",
    quranPause: "Pause",
    quranBookmarkSuccess: "Verse bookmarked successfully!",
    quranBookmarkRemove: "Verse bookmark removed.",

    // Prayer Section
    prayerTitle: "Prayer Times",
    prayerSubtitle: "Stay aligned with your daily sacred schedules",
    prayerNextIn: "Time until",
    prayerToday: "Today's Timings",
    prayerCity: "Select Location",
    prayerAthanToggle: "Athan Notification Sound",
    prayerMethod: "Calculation Method",

    // Articles Section
    artTitle: "Islamic Insights",
    artSubtitle: "Enrich your intellect and spirit with premium educational articles",
    artReadMore: "Read Full Article",
    artBack: "Back to Articles",
    artReadTime: "min read",

    // Community Section
    commTitle: "Muslim Community Circle",
    commSubtitle: "Share reflections, read collective insights, and count shared Tasbih in real time",
    commCreatePost: "Share an Insight or Dhikr",
    commPostPlaceholder: "What spiritual reflection or verse would you like to share today?",
    commPostButton: "Share in Circle",
    commTasbihCount: "Your Daily Tasbih Points",
    commTasbihGlobal: "Global Circle Active Members",
    commTasbihTap: "TAP TASBIH",
    commTasbihReset: "Reset Counter",
    commMilestone: "Subhan Allah! You reached a milestone: ",
    commTabCircles: "Online Circles",
    circleJoin: "Join Circle",
    circleLeave: "Leave Circle",
    circleFull: "Complete",
    circleCreate: "Create New Circle",
    circleFormName: "Circle Name",
    circleFormDesc: "Description / Goal",
    circleFormCap: "Target Members",
    circleFormType: "Circle Focus",
    circleSuccessCreated: "Circle created successfully!",
    circleEnterSession: "Enter Live Session",
    circleSessionDuration: "Worship Duration",
    circleMinutes: "minutes",
    circleCreator: "Organizer",
    circleTurnReciter: "Active Worship Turn",
    circleYourTurn: "It's Your Turn! Tap Below to Recite",
    circleWaitingTurn: "Listen & Send Blessings",
    circleConfirmBtn: "Confirm Recitation & Pass Turn",
    circleSendReaction: "Send Blessings",
    circleSessionEnded: "Session Completed",
    circleCongratulations: "May Allah accept your worship and good deeds!",
    circleSharedProgress: "Completed Shared Worships",

    // Contact Section
    contactTitle: "Get in Touch",
    contactSubtitle: "Have questions, feedback, or need assistance? Reach out to the ArabicMuslim team.",
    contactName: "Your Full Name",
    contactEmail: "Email Address",
    contactMsg: "Message Description",
    contactSubmit: "Send Premium Inquiry",
    contactSuccess: "Inquiry Sent Successfully! We will respond shortly with peace and blessings.",
    contactFAQTitle: "Frequently Asked Questions",

    // Auth
    authTitle: "Welcome to ArabicMuslim",
    authSubtitle: "Authenticate to access personalized dashboard, bookmarks, and track your daily tasbih.",
    authEmail: "Email",
    authPass: "Password",
    authSubmit: "Sign In",
    authSignUpSubmit: "Create Premium Account",
    authToggleToSignUp: "New to ArabicMuslim? Create an Account",
    authToggleToLogin: "Already have an account? Sign In",
    authError: "Invalid login credentials. Please use 'sally@arabicmuslim.com' and 'bismillah' or register a new one.",
    authWelcome: "Assalamu Alaikum",

    // General
    searchTitle: "Search Results for",
    searchNoResults: "No results matched your search."
  },
  ar: {
    // Navigation
    navHome: "الرئيسية",
    navQuran: "قرءان",
    navPrayer: "مواقيت الصلاة",
    navArticles: "المقالات",
    navCommunity: "حلقات",
    navContact: "اتصل بنا",
    navProducts: "منتجات",
    navLogin: "تسجيل الدخول",
    navDashboard: "لوحة التحكم",
    navLogout: "تسجيل الخروج",

    // Hero
    heroTitle: "بوابتك الشاملة لحفظ القرآن الكريم والأذكار اليومية",
    heroSubtitle: "احفظ القرآن بتلاوات صوتية واضحة، تابع أهدافك اليومية مع مواقيت الصلاة الدقيقة، شارك في حلقات التلاوة والحفظ الجماعية، وتصفح كتب تعليم اللغة العربية والمنتجات الإسلامية القيمة.",
    heroExplore: "تصفح القرآن الكريم",
    heroCommunity: "انضم للحلقة",

    // Features Section
    featQuranTitle: "حفظ القرآن الكريم وتلاوته",
    featQuranDesc: "استمع إلى تلاوات واضحة عذبة وتابع التراجم لتسهيل وتسريع حفظك ومراجعتك للقرآن الكريم.",
    featPrayerTitle: "مواقيت الصلاة الدقيقة",
    featPrayerDesc: "حساب أوقات الصلاة بدقة بناءً على موقعك مع مؤقت تنازلي وتنبيهات أذان مرنة.",
    featCommunityTitle: "حلقات الذكر والتسبيح",
    featCommunityDesc: "أنشئ حلقات تفاعلية للتلاوة أو الحفظ أو التسبيح الجماعي المباشر، وتفاعل ببوستات وخواطر في مجتمع متكامل.",
    featArticlesTitle: "تعلم العربية والمقالات الإسلامية",
    featArticlesDesc: "اقرأ مقالات تعليمية تغطي اللغة العربية، الأذكار، التفسير، وتاريخنا الإسلامي بطريقة مبسطة.",

    // Products Section
    prodSectionTitle: "الكتب الإسلامية وكتب تعليم العربية",
    prodSectionSubtitle: "تصفح واقتنِ كتباً إلكترونية إسلامية، روايات، دفاتر يوميات للصلاة، ومناهج ممتازة لتعلم لغة القرآن.",
    prodBuyNow: "احصل عليه من أمازون",
    prodReviewSingular: "تقييم",
    prodReviewsPlural: "تقييمات",

    // Quran Section
    quranTitle: "القرآن الكريم",
    quranSubtitle: "اقرأ، استمع، واحفظ آيات الله المفضلة لديك",
    quranSearchPlace: "ابحث عن السور بالاسم أو الرقم...",
    quranAudioListen: "استمع للتلاوة",
    quranVerse: "آية",
    quranPlayAll: "تشغيل السورة كاملة",
    quranPause: "إيقاف مؤقت",
    quranBookmarkSuccess: "تم حفظ الآية في العلامات بنجاح!",
    quranBookmarkRemove: "تم إزالة الآية من العلامات.",

    // Prayer Section
    prayerTitle: "مواقيت الصلاة",
    prayerSubtitle: "حافظ على مواعيد صلواتك اليومية الفريضة",
    prayerNextIn: "الوقت المتبقي لـ",
    prayerToday: "مواقيت اليوم",
    prayerCity: "اختر الموقع",
    prayerAthanToggle: "صوت تنبيه الأذان",
    prayerMethod: "طريقة الحساب",

    // Articles Section
    artTitle: "رؤى إسلامية",
    artSubtitle: "أثرِ عقلك وروحك بمقالات تعليمية وروحانية متميزة",
    artReadMore: "اقرأ المقال كاملاً",
    artBack: "العودة للمقالات",
    artReadTime: "دقائق للقراءة",

    // Community Section
    commTitle: "حلقة المجتمع الإسلامي",
    commSubtitle: "شارك التأملات، اقرأ الرؤى الجماعية، واحصِ التسبيح المشترك في الوقت الفعلي",
    commCreatePost: "شارك فائدة أو ذكراً",
    commPostPlaceholder: "ما هو التأمل الروحاني أو الآية التي تود مشاركتها اليوم؟",
    commPostButton: "انشر في الحلقة",
    commTasbihCount: "نقاط تسبيحك اليومية",
    commTasbihGlobal: "أعضاء الحلقة النشطين الآن",
    commTasbihTap: "اضغط للتسبيح",
    commTasbihReset: "إعادة ضبط العداد",
    commMilestone: "سبحان الله! لقد حققت إنجازاً: ",
    commTabCircles: "الحلقات المباشرة",
    circleJoin: "انضم للحلقة",
    circleLeave: "مغادرة الحلقة",
    circleFull: "مكتملة",
    circleCreate: "إنشاء حلقة جديدة",
    circleFormName: "اسم الحلقة",
    circleFormDesc: "الوصف / الهدف",
    circleFormCap: "العدد المستهدف للأعضاء",
    circleFormType: "تركيز الحلقة",
    circleSuccessCreated: "تم إنشاء الحلقة بنجاح!",
    circleEnterSession: "دخول حلقة التفاعل",
    circleSessionDuration: "مدة العبادة",
    circleMinutes: "دقائق",
    circleCreator: "منظم الحلقة / المعلم",
    circleTurnReciter: "الدور الحالي في القراءة",
    circleYourTurn: "لقد جاء دورك! اضغط لتأكيد القراءة",
    circleWaitingTurn: "استمع وتفاعل بقلوب ودعوات",
    circleConfirmBtn: "تأكيد القراءة والذكر",
    circleSendReaction: "أرسل تفاعل",
    circleSessionEnded: "اكتمل وقت الحلقة!",
    circleCongratulations: "تقبل الله منكم صالح الأعمال والطاعات وغفر ذنوبكم!",
    circleSharedProgress: "إجمالي الأذكار المنجزة جماعياً",

    // Contact Section
    contactTitle: "اتصل بنا",
    contactSubtitle: "لديك أسئلة، تعليقات، أو تحتاج لمساعدة؟ تواصل مع فريق أرابيك مسلم.",
    contactName: "الاسم الكامل",
    contactEmail: "البريد الإلكتروني",
    contactMsg: "تفاصيل الرسالة",
    contactSubmit: "أرسل طلبك الفاخر",
    contactSuccess: "تم إرسال رسالتك بنجاح! سنرد عليك قريباً بسلام وبركاته.",
    contactFAQTitle: "الأسئلة الشائعة",

    // Auth
    authTitle: "مرحباً بك في أرابيك مسلم",
    authSubtitle: "سجل دخولك للوصول إلى لوحة التحكم الشخصية، والعلامات المرجعية، وتتبع تسبيحك اليومي.",
    authEmail: "البريد الإلكتروني",
    authPass: "كلمة المرور",
    authSubmit: "تسجيل الدخول",
    authSignUpSubmit: "إنشاء حساب فاخر",
    authToggleToSignUp: "جديد في أرابيك مسلم؟ أنشئ حساباً جديداً",
    authToggleToLogin: "لديك حساب بالفعل؟ سجل دخولك",
    authError: "بيانات تسجيل الدخول غير صالحة. يرجى استخدام 'sally@arabicmuslim.com' و'bismillah' أو التسجيل بحساب جديد.",
    authWelcome: "السلام عليكم",

    // General
    searchTitle: "نتائج البحث عن",
    searchNoResults: "لم يتم العثور على نتائج تطابق بحثك."
  }
};

export const AppProvider = ({ children }) => {
  // Lang state
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_lang');
    return saved === 'ar' ? 'ar' : 'en';
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('arabicmuslim_auth') === 'true';
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('arabicmuslim_user');
    return savedUser ? JSON.parse(savedUser) : {
      name: "Sally Ali",
      email: "sally@arabicmuslim.com",
      avatar: "🌙",
      dailyTasbih: 0,
      role: "Premium Member",
      memberSince: "May 2026"
    };
  });

  // Personal Bookmarks
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_bookmarks');
    return saved ? JSON.parse(saved) : { verses: [], articles: [] };
  });

  // Personal Tasbih Count
  const [tasbihCount, setTasbihCount] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_tasbih');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Tasmee Recordings
  const [tasmeeSubmissions, setTasmeeSubmissions] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_tasmee');
    if (saved) return JSON.parse(saved);

    // Default seeded community recitations for the Evaluation Feed
    return [
      {
        id: "seed-1",
        author: "فاطمة حسن",
        avatar: "⭐",
        date: "2026-05-27",
        surahName: "Al-Fatiha",
        surahNameAr: "الفاتحة",
        surahId: 1,
        juz: 1,
        ayahFrom: 1,
        ayahTo: 7,
        audioData: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3",
        rating: 5,
        comments: "ما شاء الله تبارك الرحمن! تلاوة مرتلة خاشعة وصوت عذب ومخارج الحروف سليمة جداً. أحسنتِ يا فاطمة.",
        teacherAudio: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3",
        loves: 24,
        lovedBy: [],
        isUser: false
      },
      {
        id: "seed-2",
        author: "أحمد سليم",
        avatar: "✨",
        date: "2026-05-26",
        surahName: "An-Nasr",
        surahNameAr: "النصر",
        surahId: 110,
        juz: 30,
        ayahFrom: 1,
        ayahTo: 3,
        audioData: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/110.mp3",
        rating: 4,
        comments: "قراءة جيدة ومسترسلة يا أحمد. يرجى الانتباه للمدود الطبيعية في موضع (رأيت الناس)، والحرص على قلقلة الجيم في كلمة (أفواجاً).",
        teacherAudio: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/110.mp3",
        loves: 15,
        lovedBy: [],
        isUser: false
      }
    ];
  });

  // Friends list synced with localStorage
  const [friendsList, setFriendsList] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_friends');
    return saved ? JSON.parse(saved) : [];
  });

  // Pre-seeded community posts reflecting real insights and spiritual sharing
  const [communityPosts, setCommunityPosts] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_posts');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 1,
        author: "Omar Farooq",
        avatar: "🕌",
        content: "Verily, in the remembrance of Allah do hearts find rest. (Surah Ar-Ra'd 13:28). Let us make a conscious effort to keep our tongues moist with Dhikr today.",
        contentAr: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ (الرعد: 28). لنبذل جهداً واعياً لإبقاء ألسنتنا رطبة بذكر الله اليوم.",
        likes: 24,
        likedBy: [],
        timestamp: "2 hours ago",
        comments: [
          { id: 1, author: "Fatima Alzahra", avatar: "⭐", text: "Subhan Allah, much needed reminder in these busy hours." }
        ]
      },
      {
        id: 2,
        author: "Amina Yusuf",
        avatar: "✨",
        content: "Just started learning Quranic Arabic through the recommended literature on the homepage! Highly recommend 'Arabic Stories for Language Learners' for anyone wanting to grasp deep contextual terms.",
        contentAr: "لقد بدأت للتو في تعلم لغة القرآن العربية من خلال الكتب الموصى بها في الصفحة الرئيسية! أنصح بشدة بكتاب 'قصص عربية لمتعلمي اللغة' لكل من يريد فهم المصطلحات الروحانية العميقة.",
        likes: 18,
        likedBy: [],
        timestamp: "5 hours ago",
        comments: []
      }
    ];
  });

  // NEW: Online Circles state
  const [onlineCircles, setOnlineCircles] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_circles');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: "c1",
        name: "Morning Adhkar Circle",
        nameAr: "حلقة أذكار الصباح",
        description: "Starting the day with the remembrance of Allah. Daily morning prayers.",
        descriptionAr: "نبدأ يومنا بذكر الله وطاعته. قراءة أذكار الصباح والتدبر اليومي.",
        capacity: 10,
        duration: 10,
        currentTurnIndex: 0,
        sessionProgress: 12,
        dhikrTarget: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
        dhikrTargetAr: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
        joinedUsers: [
          { name: "Fatima Hassan", avatar: "🧕", email: "fatima@arabicmuslim.com" },
          { name: "Ahmed Selim", avatar: "👳", email: "ahmed@arabicmuslim.com" },
          { name: "Omar Farooq", avatar: "🧔", email: "omar@arabicmuslim.com" },
          { name: "Amina Yusuf", avatar: "🧕", email: "amina@arabicmuslim.com" },
          { name: "Yusuf Al-Qurashi", avatar: "👳", email: "yusuf@arabicmuslim.com" },
          { name: "Sara Ali", avatar: "🧕", email: "sara@arabicmuslim.com" },
          { name: "Bilal Khan", avatar: "🧔", email: "bilal@arabicmuslim.com" },
          { name: "Zainab Ahmed", avatar: "🧕", email: "zainab@arabicmuslim.com" },
          { name: "Hamza Malik", avatar: "👳", email: "hamza@arabicmuslim.com" },
          { name: "Layla Hussein", avatar: "🧕", email: "layla@arabicmuslim.com" }
        ], // 10/10 - Golden Completed Circle
        creator: "System",
        type: "adhkar"
      },
      {
        id: "c2",
        name: "Surah Al-Mulk Recitation",
        nameAr: "تلاوة سورة الملك",
        description: "Reciting Surah Al-Mulk together before sleep for protection and peace.",
        descriptionAr: "قراءة جماعية لسورة الملك قبل النوم للوقاية والسكينة الروحية.",
        capacity: 5,
        duration: 60,
        currentTurnIndex: 0,
        sessionProgress: 8,
        dhikrTarget: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
        dhikrTargetAr: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
        joinedUsers: [
          { name: "Fatima Hassan", avatar: "🧕", email: "fatima@arabicmuslim.com" },
          { name: "Ahmed Selim", avatar: "👳", email: "ahmed@arabicmuslim.com" },
          { name: "Omar Farooq", avatar: "🧔", email: "omar@arabicmuslim.com" },
          { name: "Amina Yusuf", avatar: "🧕", email: "amina@arabicmuslim.com" }
        ], // 4/5
        creator: "System",
        type: "quran"
      },
      {
        id: "c3",
        name: "Global Istighfar 1000x",
        nameAr: "حلقة الاستغفار الكبرى",
        description: "Seeking forgiveness together in these blessed moments.",
        descriptionAr: "الاستغفار الجماعي وطلب المغفرة لتطهير القلوب.",
        capacity: 8,
        duration: 15,
        currentTurnIndex: 0,
        sessionProgress: 4,
        dhikrTarget: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
        dhikrTargetAr: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
        joinedUsers: [
          { name: "Yusuf Al-Qurashi", avatar: "👳", email: "yusuf@arabicmuslim.com" },
          { name: "Sara Ali", avatar: "🧕", email: "sara@arabicmuslim.com" },
          { name: "Bilal Khan", avatar: "🧔", email: "bilal@arabicmuslim.com" },
          { name: "Zainab Ahmed", avatar: "🧕", email: "zainab@arabicmuslim.com" },
          { name: "Hamza Malik", avatar: "👳", email: "hamza@arabicmuslim.com" }
        ], // 5/8
        creator: "System",
        type: "istighfar"
      },
      {
        id: "c4",
        name: "Salawat on the Prophet",
        nameAr: "حلقة الصلاة على النبي ﷺ",
        description: "Sending blessings and peace upon our beloved Prophet Muhammad (PBUH).",
        descriptionAr: "الإكثار من الصلاة والسلام على نبينا محمد ﷺ لنيل شفاعته وقضاء الحوائج.",
        capacity: 15,
        duration: 15,
        currentTurnIndex: 0,
        sessionProgress: 24,
        dhikrTarget: "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِينَا مُحَمَّدٍ ﷺ",
        dhikrTargetAr: "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِينَا مُحَمَّدٍ ﷺ",
        joinedUsers: [
          { name: "Omar Farooq", avatar: "🧔", email: "omar@arabicmuslim.com" },
          { name: "Amina Yusuf", avatar: "🧕", email: "amina@arabicmuslim.com" },
          { name: "Fatima Hassan", avatar: "🧕", email: "fatima@arabicmuslim.com" },
          { name: "Ahmed Selim", avatar: "👳", email: "ahmed@arabicmuslim.com" },
          { name: "Yusuf Al-Qurashi", avatar: "👳", email: "yusuf@arabicmuslim.com" },
          { name: "Zainab Ahmed", avatar: "🧕", email: "zainab@arabicmuslim.com" },
          { name: "Hamza Malik", avatar: "👳", email: "hamza@arabicmuslim.com" },
          { name: "Layla Hussein", avatar: "🧕", email: "layla@arabicmuslim.com" },
          { name: "Sara Ali", avatar: "🧕", email: "sara@arabicmuslim.com" },
          { name: "Bilal Khan", avatar: "🧔", email: "bilal@arabicmuslim.com" },
          { name: "Zayd bin Harith", avatar: "🧔", email: "zayd@arabicmuslim.com" },
          { name: "Mariam Salem", avatar: "🧕", email: "mariam@arabicmuslim.com" },
          { name: "Khaled Saeed", avatar: "👳", email: "khaled@arabicmuslim.com" },
          { name: "Hoda Mahmoud", avatar: "🧕", email: "hoda@arabicmuslim.com" }
        ], // 14/15
        creator: "System",
        type: "salawat"
      }
    ];
  });

  const joinCircle = (circleId) => {
    let completed = false;
    setOnlineCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        const userIdentifier = isAuthenticated ? user.email : "guest_user";
        const hasJoined = c.joinedUsers.some(u => u.email === userIdentifier || (userIdentifier === "guest_user" && u.name === "Guest Member"));
        
        let newUsers;
        if (hasJoined) {
          // Leave
          newUsers = c.joinedUsers.filter(u => u.email !== userIdentifier && u.name !== "Guest Member");
        } else {
          // Join
          const muslimAvatars = ["🧕", "👳", "🧔"];
          const randomAvatar = muslimAvatars[Math.floor(Math.random() * muslimAvatars.length)];
          const userAvatar = isAuthenticated ? (user.avatar === "🌙" ? randomAvatar : user.avatar) : randomAvatar;
          const newUser = {
            name: isAuthenticated ? user.name : "Guest Member",
            email: isAuthenticated ? user.email : "guest_user",
            avatar: userAvatar
          };
          newUsers = [...c.joinedUsers, newUser];
          if (newUsers.length === c.capacity) {
            completed = true;
          }
        }
        return { ...c, joinedUsers: newUsers };
      }
      return c;
    }));
    return completed;
  };

  const createCircle = (circleData) => {
    const muslimAvatars = ["🧕", "👳", "🧔"];
    const randomAvatar = muslimAvatars[Math.floor(Math.random() * muslimAvatars.length)];
    const userAvatar = isAuthenticated ? (user.avatar === "🌙" ? randomAvatar : user.avatar) : randomAvatar;

    const defaultDhikr = circleData.type === 'quran' 
      ? "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ"
      : (circleData.type === 'salawat' 
          ? "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِينَا مُحَمَّدٍ ﷺ" 
          : (circleData.type === 'istighfar' 
              ? "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ"
              : "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ"));

    const newCircle = {
      id: "c-" + Date.now(),
      name: circleData.name,
      nameAr: circleData.nameAr || circleData.name,
      description: circleData.description,
      descriptionAr: circleData.descriptionAr || circleData.description,
      capacity: parseInt(circleData.capacity, 10) || 5,
      duration: circleData.duration ? parseInt(circleData.duration, 10) : (circleData.type === 'quran' ? 60 : 10),
      currentTurnIndex: 0,
      sessionProgress: 0,
      dhikrTarget: defaultDhikr,
      dhikrTargetAr: defaultDhikr,
      joinedUsers: [
        {
          name: isAuthenticated ? user.name : "Guest Member",
          email: isAuthenticated ? user.email : "guest_user",
          avatar: userAvatar
        }
      ],
      creator: isAuthenticated ? user.name : "Guest",
      type: circleData.type || "adhkar"
    };

    setOnlineCircles(prev => [newCircle, ...prev]);
  };

  const updateCircleTurn = (circleId, newIndex) => {
    setOnlineCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        return { ...c, currentTurnIndex: newIndex };
      }
      return c;
    }));
  };

  const updateCircleDhikr = (circleId, text, textAr) => {
    setOnlineCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        return { ...c, dhikrTarget: text, dhikrTargetAr: textAr || text };
      }
      return c;
    }));
  };

  const incrementCircleProgress = (circleId) => {
    setOnlineCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        const currentProgress = c.sessionProgress || 0;
        return { ...c, sessionProgress: currentProgress + 1 };
      }
      return c;
    }));
  };

  // Sync state changes with document directions
  useEffect(() => {
    localStorage.setItem('arabicmuslim_lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Sync Bookmarks
  useEffect(() => {
    localStorage.setItem('arabicmuslim_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Sync Tasbih Count
  useEffect(() => {
    localStorage.setItem('arabicmuslim_tasbih', tasbihCount.toString());
  }, [tasbihCount]);

  // Sync Tasmee
  useEffect(() => {
    localStorage.setItem('arabicmuslim_tasmee', JSON.stringify(tasmeeSubmissions));
  }, [tasmeeSubmissions]);

  // Sync Friends List
  useEffect(() => {
    localStorage.setItem('arabicmuslim_friends', JSON.stringify(friendsList));
  }, [friendsList]);

  // Sync Community Posts
  useEffect(() => {
    localStorage.setItem('arabicmuslim_posts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  // Sync Online Circles
  useEffect(() => {
    localStorage.setItem('arabicmuslim_circles', JSON.stringify(onlineCircles));
  }, [onlineCircles]);

  // Translation function helper
  const t = (key) => {
    return translations[language][key] || key;
  };

  // Auth Operations
  const login = (email, password) => {
    // Simple custom criteria for immediate demonstration
    if (email === "sally@arabicmuslim.com" && password === "bismillah") {
      const loggedUser = {
        name: "Sally Ali",
        email: "sally@arabicmuslim.com",
        avatar: "🌙",
        dailyTasbih: tasbihCount,
        role: "Premium Member",
        memberSince: "May 2026"
      };
      setUser(loggedUser);
      setIsAuthenticated(true);
      localStorage.setItem('arabicmuslim_auth', 'true');
      localStorage.setItem('arabicmuslim_user', JSON.stringify(loggedUser));
      return true;
    }
    
    // Also allow arbitrary user registrations/logins for testing ease
    if (email && password.length >= 6) {
      const name = email.split('@')[0];
      const loggedUser = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        avatar: "🕌",
        dailyTasbih: tasbihCount,
        role: "Premium Member",
        memberSince: "May 2026"
      };
      setUser(loggedUser);
      setIsAuthenticated(true);
      localStorage.setItem('arabicmuslim_auth', 'true');
      localStorage.setItem('arabicmuslim_user', JSON.stringify(loggedUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('arabicmuslim_auth');
    localStorage.removeItem('arabicmuslim_user');
  };

  // Bookmark Toggle
  const toggleBookmark = (type, item) => {
    setBookmarks(prev => {
      const list = [...prev[type]];
      const exists = list.some(i => i.id === item.id);
      
      let updatedList;
      if (exists) {
        updatedList = list.filter(i => i.id !== item.id);
      } else {
        updatedList = [...list, item];
      }

      return {
        ...prev,
        [type]: updatedList
      };
    });
  };

  // Tasmee Actions
  const addTasmeeSubmission = (recording) => {
    const newSubmission = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(language === 'ar' ? 'ar' : 'en', { year: 'numeric', month: 'short', day: 'numeric' }),
      author: user.name,
      avatar: user.avatar,
      isUser: true,
      loves: 0,
      lovedBy: [],
      rating: null, // Pending evaluation
      comments: null,
      teacherAudio: null,
      ...recording
    };
    
    setTasmeeSubmissions(prev => [newSubmission, ...prev]);

    // Simulate teacher evaluation after 7 seconds
    setTimeout(() => {
      setTasmeeSubmissions(prev => prev.map(sub => {
        if (sub.id === newSubmission.id) {
          return {
            ...sub,
            rating: 5,
            comments: language === 'ar'
              ? "أحسنتِ يا سالي! تلاوة خاشعة ممتازة ومخارج حروف صحيحة تماماً. استمري في التلاوة والحفظ."
              : "Excellent recitation, Sally! Very humble tone, accurate pronunciation, and proper tajweed rule applications. Keep up the amazing spiritual work.",
            teacherAudio: `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${sub.surahId.toString().padStart(3, '0')}.mp3`
          };
        }
        return sub;
      }));
    }, 7000);
  };

  const deleteTasmeeSubmission = (id) => {
    setTasmeeSubmissions(prev => prev.filter(sub => sub.id !== id));
  };

  const loveTasmeeSubmission = (id) => {
    setTasmeeSubmissions(prev => prev.map(sub => {
      if (sub.id === id) {
        const userId = isAuthenticated ? user.email : "anonymous";
        const lovedByList = sub.lovedBy || [];
        const hasLoved = lovedByList.includes(userId);

        let newLovedBy = [...lovedByList];
        let newLoves = sub.loves || 0;

        if (hasLoved) {
          newLovedBy = newLovedBy.filter(email => email !== userId);
          newLoves = Math.max(0, newLoves - 1);
        } else {
          newLovedBy.push(userId);
          newLoves += 1;
        }

        return { ...sub, loves: newLoves, lovedBy: newLovedBy };
      }
      return sub;
    }));
  };

  const toggleFriend = (friendName) => {
    setFriendsList(prev => {
      if (prev.includes(friendName)) {
        return prev.filter(name => name !== friendName);
      } else {
        return [...prev, friendName];
      }
    });
  };

  // Community Feed Actions
  const addPost = (content) => {
    const newPost = {
      id: Date.now(),
      author: isAuthenticated ? user.name : "Anonymous Muslim",
      avatar: isAuthenticated ? user.avatar : "🕌",
      content: content,
      contentAr: content, // in mock, keep same
      likes: 0,
      likedBy: [],
      timestamp: "Just now",
      comments: []
    };

    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId) => {
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const userId = isAuthenticated ? user.email : "anonymous";
        const hasLiked = post.likedBy.includes(userId);
        
        let newLikedBy = [...post.likedBy];
        let newLikes = post.likes;

        if (hasLiked) {
          newLikedBy = newLikedBy.filter(id => id !== userId);
          newLikes = Math.max(0, newLikes - 1);
        } else {
          newLikedBy.push(userId);
          newLikes += 1;
        }

        return { ...post, likes: newLikes, likedBy: newLikedBy };
      }
      return post;
    }));
  };

  const addComment = (postId, commentText) => {
    if (!commentText.trim()) return;
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now(),
          author: isAuthenticated ? user.name : "Anonymous Muslim",
          avatar: isAuthenticated ? user.avatar : "✨",
          text: commentText
        };
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      searchQuery,
      setSearchQuery,
      isAuthenticated,
      user,
      login,
      logout,
      bookmarks,
      toggleBookmark,
      tasbihCount,
      setTasbihCount,
      tasmeeSubmissions,
      addTasmeeSubmission,
      deleteTasmeeSubmission,
      loveTasmeeSubmission,
      friendsList,
      toggleFriend,
      communityPosts,
      addPost,
      likePost,
      addComment,
      onlineCircles,
      joinCircle,
      createCircle,
      updateCircleTurn,
      updateCircleDhikr,
      incrementCircleProgress,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
