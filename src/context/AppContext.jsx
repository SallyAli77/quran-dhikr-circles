import React, { createContext, useState, useEffect, useContext } from 'react';
import confetti from 'canvas-confetti';

const AppContext = createContext();

// Beautiful pre-seeded mock bots representing active community members
export const mockBots = [
  { name: "فاطمة حسن", avatar: "🧕", email: "fatima@arabicmuslim.com", role: "Certified Teacher", level: "Gold" },
  { name: "أحمد سليم", avatar: "👳", email: "ahmed@arabicmuslim.com", role: "Certified Teacher", level: "Bronze" },
  { name: "عمر فاروق", avatar: "🧔", email: "omar@arabicmuslim.com", role: "Premium Member" },
  { name: "أمينة يوسف", avatar: "🧕", email: "amina@arabicmuslim.com", role: "Premium Member" },
  { name: "يوسف القرشي", avatar: "👳", email: "yusuf@arabicmuslim.com", role: "Certified Teacher", level: "Platinum" },
  { name: "سارة علي", avatar: "🧕", email: "sara@arabicmuslim.com", role: "Premium Member" },
  { name: "بلال خان", avatar: "🧔", email: "bilal@arabicmuslim.com", role: "Premium Member" },
  { name: "زينب أحمد", avatar: "🧕", email: "zainab@arabicmuslim.com", role: "Premium Member" },
  { name: "حمزة مالك", avatar: "👳", email: "hamza@arabicmuslim.com", role: "Premium Member" },
  { name: "ليلى حسين", avatar: "🧕", email: "layla@arabicmuslim.com", role: "Premium Member" }
];

// Seeded articles templates to procedurally build 120 unique articles
const baseArticles = [
  {
    id: 1,
    title: "The Faith Power of Morning Dhikr",
    titleAr: "من أذكار الصباح",
    category: "Faith",
    categoryAr: "إيمانيات",
    author: "Dr. Bilal Hassan",
    authorAr: "د. بلال حسن",
    avatar: "🌙",
    date: "May 25, 2026",
    readTime: 5,
    summary: "Explore the profound faith and neurological benefits of dedicating the first moments of your day to the remembrance of Allah.",
    summaryAr: "فضائل ذكر الله وأثرها العظيم في طمأنينة النفس ورضا الرحمن.",
    content: `Assalamu Alaikum dear reader. In the hustle and bustle of modern life, our minds are bombarded with endless notifications, stress, and noise. Allah says in the Noble Quran: "O you who have believed, remember Allah with much remembrance. And exalt Him morning and afternoon." (Surah Al-Ahzab 33:41-42).

    Morning Dhikr (remembrance) acts as a faith shield. Historically, the Prophet Muhammad (peace be upon him) and his companions never left the morning and evening supplications. 
    
    From a psychological perspective, beginning the day with terms of gratitude ("Alhamdulillah") and praise ("Subhan Allah") resets the amygdala—the brain's threat-detection center. This grounds you in a state of high mindfulness, equipping you with pristine patience to handle whatever challenges the day presents. Dedicate just 10 minutes after Fajr prayer to sit in silence, count your Tasbih, and feel the divine light enter your chest.`,
    contentAr: `السلام عليكم ورحمة الله. في صخب الحياة المعاصرة، تتعرض عقولنا لقصف مستمر من التنبيهات والضغوط والضوضاء. يقول الله تعالى في القرآن الكريم: "يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا * وَسَبِّحُوهُ بُكْرَةً وَأَصِيلًا" (الأحزاب: 41-42).

    أذكار الصباح حصن لك من كل شر تاريخياً، لم يترك النبي محمد صلى الله عليه وسلم وأصحابه الكرام أذكار الصباح والمساء أبداً.
    
    من منظور علم النفس الحديث، فإن بدء اليوم بعبارات الامتنان والحمد ("الحمد لله") والتسبيح ("سبحان الله") يعيد ضبط مركز القلق في الدماغ، مما يمنحك سكينة عالية وصيراً جميلاً لمواجهة عقبات اليوم. خصص 10 دقائق فقط بعد صلاة الفجر للجلوس في هدوء تام، وحساب تسابيحك، والشعور بالنور الإلهي يملأ صدرك.`
  },
  {
    id: 2,
    title: "Mastering Quranic Arabic Vocabulary Keys",
    titleAr: "مفاتيح إتقان مفردات اللغة العربية القرآنية",
    category: "Arabic Learning",
    categoryAr: "تعلم العربية",
    author: "Ustadh Yaseen Al-Harbi",
    authorAr: "الأستاذ ياسين الحربي",
    avatar: "✍️",
    date: "May 18, 2026",
    readTime: 8,
    summary: "Discover the root-system structure of the Arabic language and how learning key roots unlocks 70% of Quranic meanings.",
    summaryAr: "اكتشف الهيكل الجمالي لنظام الاشتقاق اللغوي في العربية وكيف يفتح لك تعلم الجذور 70% من معاني الآيات.",
    content: `To the untrained eye, classical Arabic seems like an intimidating language with infinite vocabulary. However, Arabic is one of the most mathematically structured languages in existence, built entirely on a three-letter root system (known as the 'Thulathi' root).

    Every verb, noun, and adjective is derived from a core root that carries a primary semantic concept. For instance, the root 'K-T-B' (ك-ت-ب) carries the concept of writing:
    - Kataba (He wrote)
    - Kitab (Book)
    - Katib (Writer)
    - Maktab (Office)

    If you master just 100 high-frequency roots that repeat throughout the Noble Quran, you will instantly comprehend over 70% of the divine text. When studying, we highly recommend using premium bilingual books like 'Arabic Stories for Language Learners' (showcased on our homepage) to observe how roots shift dynamically in cultural short stories. Start small: learn 3 roots a week, look them up in different Surahs, and witness your comprehension soar!`,
    contentAr: `قد تبدو العربية الكلاسيكية للوهلة الأولى لغة معقدة ذات مفردات لا حصر لها. ومع ذلك، فإن العربية واحدة من أكثر اللغات تنظيماً في العالم، حيث بنيت بالكامل على نظام الجذور ثلاثية الأحرف.

    كل فعل واسم وصفة مشتق من جذر أساسي يحمل مفهوماً دلالياً رئيسياً. على سبيل المثال، الجذر (ك-ت-ب) يحمل مفهوم الكتابة:
    - كَتَبَ (فعل)
    - كِتَاب (اسم)
    - كَاتِب (فاعل)
    - مَكْتَب (مكان)

    إذا أتقنت 100 جذر فقط من الجذور عالية التكرار في القرآن الكريم، فستفهم على الفور أكثر من 70% من الآيات الشريفة. نوصي بشدة باستخدام الكتب ثنائية اللغة الموضحة في صفحتنا الرئيسية لملاحظة كيفية تغير الجذور. ابدأ بخطوات بسيطة: تعلم 3 جذور أسبوعياً، وابحث عنها في السور المختلفة وتأمل الفارق!`
  },
  {
    id: 3,
    title: "Tafsir of Surah Al-Kahf: Friday Serenity",
    titleAr: "تفسير سورة الكهف: سكينة يوم الجمعة",
    category: "Tafsir",
    categoryAr: "تفسير",
    author: "Shaykh Abdur-Rahman",
    authorAr: "الشيخ عبد الرحمن",
    avatar: "🕌",
    date: "May 12, 2026",
    readTime: 6,
    summary: "Unveiling the deep faith lessons and allegories of the four major stories in Surah Al-Kahf read every Friday.",
    summaryAr: "الكشف عن الدروس المستفادة للقصص الأربعة من سورة الكهف الشريفة وحكمة قراءتها كل جمعة.",
    content: `Reading Surah Al-Kahf on Fridays is a beloved sunnah that illuminates a divine light for the reader until the next Friday. But why this specific Surah? 

    Surah Al-Kahf contains four major narratives, each answering a critical trial of human life:
    1. The Companions of the Cave: The trial of faith (Deen).
    2. The Owner of the Two Gardens: The trial of wealth (Mal).
    3. Musa and Al-Khidr: The trial of knowledge ('Ilm).
    4. Dhul-Qarnayn: The trial of power (Sultan).

    Each story provides a pristine faith antidote to these worldly tests, emphasizing that true security lies not in material strength or status, but in unwavering trust in Allah's wisdom. As you read it this Friday, don't just speed through the verses; pause, contemplate the transition between stories, and let the serenity wash over your home.`,
    contentAr: `قراءة سورة الكهف يوم الجمعة سنة مباركة تضيء للمؤمن نوراً بين الجمعتين. ولكن لماذا هذه السورة تحديداً؟

    تحتوي سورة الكهف على أربعة محاور قصصية كبرى، تجيب كل منها على فتنة حرجة من فتن الحياة الدنيا:
    1. أصحاب الكهف: فتنة الدين.
    2. صاحب الجنتين: فتنة المال.
    3. موسى والخضر: فتنة العلم.
    4. ذو القرنين: فتنة السلطة والقوة.

    توفر كل قصة حماية نفسية من الابتلاءات الدنيوية، مؤكدة أن الأمان الحقيقي يكمن في التوكل التام على حكمة الله سبحانه وتعالى. بينما تقرؤها هذا الأسبوع، لا تكتف بالمرور السريع على الكلمات؛ بل تأمل تفاصيل القصص ودع السكينة تغمر قلبك.`
  }
];

const titlesTemplate = [
  { en: "Understanding the Concept of Ihsan (Excellence)", ar: "فهم مفهوم الإحسان والوصول لمرتبة كمال العبادة" },
  { en: "Lessons of Sabr (Patience) in Times of Trials", ar: "دروس الصبر الجميل في مواجهة الابتلاءات والخطوب" },
  { en: "The History of Islamic Architecture and Geometry", ar: "تاريخ العمارة الإسلامية والتناغم الهندسي البديع" },
  { en: "Mastering Tajweed Rules: A Guide for Beginners", ar: "إتقان قواعد التجويد الشريف: دليل شامل للمبتدئين" },
  { en: "Daily Dhikr Routines for Pristine Mental Clarity", ar: "أوراد الأذكار اليومية ودورها في تحقيق الصفاء النفسي" },
  { en: "Contributions of Muslim Scholars to Algebra and Science", ar: "إسهامات علماء المسلمين الأوائل في علم الجبر والعلوم" },
  { en: "The Character of the Prophet: Kindness & Diplomacy", ar: "أخلاق النبي الكريم صلى الله عليه وسلم: الرحمة والدبلوماسية" },
  { en: "Deep Study of Hadith Al-Niyyah: Intentions Matter", ar: "دراسة عميقة لحديث النية والأعمال وخلوص المقاصد" },
  { en: "Nurturing Gratitude (Shukr) in Everyday Actions", ar: "تربية النفس على شكر النعم والرضا في تفاصيل الحياة" },
  { en: "Bilingual Short Stories for Arabic Vocab Building", ar: "القصص ثنائية اللغة ودورها في بناء الثروة المفرداتية" }
];

const authorsTemplate = [
  { name: "Dr. Amina Farooq", nameAr: "د. أمينة فاروق", avatar: "✨" },
  { name: "Ustadh Yusuf Al-Qurashi", nameAr: "الأستاذ يوسف القرشي", avatar: "🕌" },
  { name: "Fatima Alzahra", nameAr: "فاطمة الزهراء", avatar: "⭐" },
  { name: "Professor Tariq Mansoor", nameAr: "أ.د طارق منصور", avatar: "📖" },
  { name: "Shaykh Bilal Hassan", nameAr: "الشيخ بلال حسن", avatar: "🌙" }
];

const categoriesTemplate = [
  { cat: "Faith", catAr: "إيمانيات" },
  { cat: "Arabic Learning", catAr: "تعلم العربية" },
  { cat: "Tafsir", catAr: "تفسير" },
  { cat: "History", catAr: "التاريخ الإسلامي" }
];

// Dynamically generate exactly 120 high-quality articles
const generate120Articles = () => {
  const list = [...baseArticles];
  for (let i = 4; i <= 120; i++) {
    const titleTemplate = titlesTemplate[i % titlesTemplate.length];
    const authorTemplate = authorsTemplate[i % authorsTemplate.length];
    const catTemplate = categoriesTemplate[i % categoriesTemplate.length];
    
    const day = (i % 28) + 1;
    const readTime = (i % 6) + 4;
    
    const title = `${titleTemplate.en} - Vol. ${Math.floor(i / 10) + 1}`;
    const titleAr = `${titleTemplate.ar} - الجزء ${Math.floor(i / 10) + 1}`;

    const summary = `Unlocking pristine dimensional aspects of ${titleTemplate.en.toLowerCase()} to enrich your study. Discover historical contexts and structural guides.`;
    const summaryAr = `الكشف عن الدروس الدينية واللغوية حول ${titleTemplate.ar} لإثراء تدبرك ودراستك اليومية في هذا المجال الهام.`;

    const content = `Assalamu Alaikum dear seeker of wisdom. This article (Volume ${Math.floor(i / 10) + 1}) addresses critical aspects of ${titleTemplate.en.toLowerCase()}. Understanding this concept requires constant daily reflection, patient study, and aligning actions with pure intentions (Ikhlas). 

    To grasp these dimensions:
    1. Study the Uthmanic roots of related terms in the Quran.
    2. Commit to 10 minutes of silent meditation / dhikr daily.
    3. Practice high-frequency vocabulary learning through bilingual texts (such as the textbooks listed on our Home page).`;

    const contentAr = `السلام عليكم ورحمة الله وبركاته. يتناول هذا المقال الهام (الجزء ${Math.floor(i / 10) + 1}) محاور جوهرية حول ${titleTemplate.ar}. إن فهم وتدبر هذا الجانب يتطلب إخلاص المقاصد لله سبحانه وتعالى والدافعية المستمرة للتعلم والتطبيق.

    لتحقيق الاستفادة القصوى:
    1. تتبع الجذور اللغوية الأصلية للألفاظ القرآنية في التفاسير المعتمدة.
    2. حافظ على ورد يومي لا يقل عن 10 دقائق للتسبيح والاستغفار والتدبر.
    3. استعن بالقصص والكتب ثنائية اللغة لتطوير ثروتك اللغوية بشكل متدرج.`;

    list.push({
      id: i,
      title,
      titleAr,
      category: catTemplate.cat,
      categoryAr: catTemplate.catAr,
      author: authorTemplate.name,
      authorAr: authorTemplate.nameAr,
      avatar: authorTemplate.avatar,
      date: `May ${day}, 2026`,
      readTime,
      summary,
      summaryAr,
      content,
      contentAr
    });
  }
  return list;
};

// Seeded global Muslim news items
export const globalMuslimNews = [
  {
    id: "news-1",
    title: "Al-Aqsa Mosque Courtyard Renovations Completed",
    titleAr: "إتمام أعمال ترميم ساحات المسجد الأقصى المبارك",
    source: "Jerusalem News",
    sourceAr: "أخبار القدس",
    date: "May 28, 2026",
    summary: "Historical preservation teams in Jerusalem have completed restoring the ancient geometric stone tiles and mosaic works of the Southern Mosque corridors.",
    summaryAr: "فرق الحفاظ التاريخي بالقدس تنهي ترميم الفسيفساء والممرات الحجرية القديمة في الأروقة الجنوبية للمسجد الأقصى الشريف.",
    image: "🕌",
    likes: 342,
    commentsCount: 28
  },
  {
    id: "news-2",
    title: "Makkah Launching AI Crowd Management Logistics for Hajj 2026",
    titleAr: "مكة تطلق خدمات الذكاء الاصطناعي لإدارة الحشود في حج 2026",
    source: "Haramain Daily",
    sourceAr: "يوميات الحرمين",
    date: "May 27, 2026",
    summary: "The Ministry of Hajj announced advanced spatial tracking models and autonomous guidance flow paths inside the Grand Mosque to ease overcrowding during prayers.",
    summaryAr: "وزارة الحج تعلن عن إدخال خوارزميات الذكاء الاصطناعي والمحاكاة لتسهيل تدفق وتوزيع ضيوف الرحمن في أروقة الحرم المكي الشريف.",
    image: "🕋",
    likes: 512,
    commentsCount: 74
  },
  {
    id: "news-3",
    title: "New Eco-Mosque in London Wins Prestigious Green Architecture Award",
    titleAr: "مسجد صديق للبيئة في لندن يفوز بجائزة العمارة الخضراء المرموقة",
    source: "London Islamic Council",
    sourceAr: "المجلس الإسلامي بلندن",
    date: "May 26, 2026",
    summary: "A newly built multi-purpose mosque featuring local wood materials, structural zero-carbon insulation, and solar dome structures was honored in London.",
    summaryAr: "تكريم مسجد حديث في لندن يعتمد على التصميم الخشبي المستدام، العزل الذكي، والقبة المغطاة بالخلايا الشمسية لتوليد الطاقة النظيفة.",
    image: "🌳",
    likes: 198,
    commentsCount: 19
  }
];

// Localization Dictionary
const translations = {
  en: {
    navHome: "Home Feed",
    navQuran: "Quran & Tasmee'",
    navPrayer: "Prayer Times",
    navArticles: "Articles & News",
    navCommunity: "Live Circles",
    navContact: "Help Desk",
    navProducts: "Bookstore",
    navLogin: "Sign In",
    navDashboard: "My Hub",
    navLogout: "Logout",
    heroTitle: "Memorize Quran & Nurture Daily Worship",
    heroSubtitle: "Access an interactive Quran, track daily score, join live circular recitation rings, explore Islamic literature, and connect with certified teachers.",
    heroExplore: "Noble Quran",
    heroCommunity: "Join Worship Circles",
    featQuranTitle: "Quran Recitation & Feedback",
    featQuranDesc: "Record your verses and receive corrective audio reviews from certified teachers.",
    featPrayerTitle: "Prayer & Soft Athan",
    featPrayerDesc: "Precise global prayer calculations with custom calculation methods.",
    featCommunityTitle: "Live Worship Circles",
    featCommunityDesc: "Join active circular tables for Recitation, Dhikr, or Tasbih with real-time turn sharing.",
    featArticlesTitle: "Islamic Insights & Global News",
    featArticlesDesc: "Read curated Islamic articles and worldwide Muslim community updates.",
    prodSectionTitle: "Islamic bookstore & Essentials",
    prodSectionSubtitle: "Affiliate handpicked literature and digital smart rings on Amazon.",
    prodBuyNow: "View on Amazon",
    prodReviewSingular: "review",
    prodReviewsPlural: "reviews",
    quranTitle: "The Noble Quran Portal",
    quranSubtitle: "Study, memorize, and record supplications",
    quranSearchPlace: "Search Surahs...",
    quranAudioListen: "Listen",
    quranVerse: "Verse",
    quranPlayAll: "Play Recitation",
    quranPause: "Pause",
    quranBookmarkSuccess: "Bookmarked successfully!",
    quranBookmarkRemove: "Bookmark removed.",
    prayerTitle: "Prayer Calculations",
    prayerSubtitle: "Daily sacred timeline and athan alarms",
    prayerNextIn: "Next prayer in",
    prayerToday: "Today's Timings",
    prayerCity: "Select City",
    prayerAthanToggle: "Athan Alarms",
    prayerMethod: "Calculation Standard",
    artTitle: "Islamic Insight Hub",
    artSubtitle: "Enrich your intellect with articles and global news updates",
    artReadMore: "Read More",
    artBack: "Back",
    artReadTime: "min read",
    commTitle: "Live Circular Rings",
    commSubtitle: "Participate in real-time collective remembrance and Quran groups",
    commCreatePost: "Draft Reflection",
    commPostPlaceholder: "What beautiful faith reflection would you like to post in the feed?",
    commPostButton: "Publish Insight",
    commTasbihCount: "Your Daily Score",
    commTasbihGlobal: "Bots / Users online now",
    commTasbihTap: "TAP SUBHA BEAD",
    commTasbihReset: "Reset",
    commMilestone: "Subhan Allah! Goal complete: ",
    commTabCircles: "Active Circles",
    circleJoin: "Enter Circle",
    circleLeave: "Leave Circle",
    circleFull: "Filled",
    circleCreate: "Create Circular Ring",
    circleFormName: "Circle Title",
    circleFormDesc: "Goal description",
    circleFormCap: "Target Capacity",
    circleFormType: "Circle Focus Channel",
    circleSuccessCreated: "Circle launched successfully!",
    circleEnterSession: "Enter Live Session",
    circleSessionDuration: "Duration",
    circleMinutes: "minutes",
    circleCreator: "Organizer",
    circleTurnReciter: "Current Turn Reciting",
    circleYourTurn: "YOUR TURN! Recite aloud now",
    circleWaitingTurn: "Listening respectfully...",
    circleConfirmBtn: "Recitation Completed ➡️ Pass Turn",
    circleSendReaction: "Send Heart Blessings",
    circleSessionEnded: "Session Completed Successfully!",
    circleCongratulations: "May Allah accept your collective worship!",
    circleSharedProgress: "Group Worship Taps Completed",
    contactTitle: "Premium Help Desk",
    contactSubtitle: "Get in touch for custom requests or support.",
    contactName: "Display Name",
    contactEmail: "Email Address",
    contactMsg: "Message",
    contactSubmit: "Submit Inquiry",
    contactSuccess: "Inquiry sent with peace and blessings.",
    contactFAQTitle: "Frequently Asked Questions",
    authTitle: "ArabicMuslim Portal",
    authSubtitle: "Register or log in to manage your daily scores and bookmarks.",
    authEmail: "Email Address",
    authPass: "Password",
    authSubmit: "Sign In",
    authSignUpSubmit: "Create Profile",
    authToggleToSignUp: "Need a profile? Sign Up here",
    authToggleToLogin: "Have a profile? Sign In here",
    authError: "Credentials failed. Try 'sally@arabicmuslim.com' / 'bismillah'",
    authWelcome: "Assalamu Alaikum",
    searchTitle: "Search Results for",
    searchNoResults: "No items matched your search query."
  },
  ar: {
    navHome: "تغذية الأخبار",
    navQuran: "القرآن والتسميع",
    navPrayer: "مواقيت الصلاة",
    navArticles: "المقالات والأخبار",
    navCommunity: "الحلقات المباشرة",
    navContact: "الدعم الفني",
    navProducts: "المتجر الإسلامي",
    navLogin: "تسجيل الدخول",
    navDashboard: "لوحتي الشخصية",
    navLogout: "تسجيل الخروج",
    heroTitle: "بوابتك الشاملة لحفظ القرآن الكريم والأذكار اليومية",
    heroSubtitle: "احفظ القرآن بتلاوات صوتية واضحة، تتبع أهدافك ونقاطك اليومية، انضم لحلقات التلاوة الدائرية المباشرة مع المعلمين، وتصفح الكتب الإسلامية الممتازة.",
    heroExplore: "تصفح المصحف الشريف",
    heroCommunity: "انضم للحلقات المباشرة",
    featQuranTitle: "تسميع القرآن وتصحيحه",
    featQuranDesc: "سجل تلاوتك الخاصة واحصل على تقييم وتوجيهات صوتية دقيقة من المعلمين المعتمدين.",
    featPrayerTitle: "مواقيت الصلاة الدقيقة",
    featPrayerDesc: "حساب أوقات الصلوات المفروضة بدقة فائقة مع تنبيهات ومؤقت الأذان التنازلي.",
    featCommunityTitle: "الحلقات المباشرة الدائرية",
    featCommunityDesc: "شارك في غرف ذكر دائرية مقسمة (تلاوة، أذكار، تسابيح) بالترتيب التفاعلي المشترك.",
    featArticlesTitle: "المقالات الإسلامية والأخبار العالمية",
    featArticlesDesc: "تصفح أحدث أخبار العالم الإسلامي ومقالات تعلم اللغة العربية والتدبر.",
    prodSectionTitle: "متجر الكتب والمستلزمات الإسلامية",
    prodSectionSubtitle: "مجموعة منتقاة بعناية من كتب العربية وخواتم التسبيح الذكية المتاحة على موقع أمازون.",
    prodBuyNow: "عرض على أمازون",
    prodReviewSingular: "تقييم",
    prodReviewsPlural: "تقييمات",
    quranTitle: "بوابة القرآن الكريم",
    quranSubtitle: "اقرأ، استمع، سجل وسَمّع آيات الذكر الحكيم",
    quranSearchPlace: "ابحث عن السور...",
    quranAudioListen: "استماع",
    quranVerse: "آية",
    quranPlayAll: "تشغيل السورة كاملة",
    quranPause: "إيقاف مؤقت",
    quranBookmarkSuccess: "تم حفظ العلامة المرجعية بنجاح!",
    quranBookmarkRemove: "تم إزالة العلامة المرجعية.",
    prayerTitle: "حساب مواقيت الصلاة",
    prayerSubtitle: "حافظ على صلواتك في مواقيتها الشرعية المحددة",
    prayerNextIn: "الوقت المتبقي لـ",
    prayerToday: "مواقيت اليوم",
    prayerCity: "اختر المدينة",
    prayerAthanToggle: "تنبيهات الأذان الصوتي",
    prayerMethod: "معيار وطريقة الحساب",
    artTitle: "منصة المقالات والأخبار",
    artSubtitle: "أنر بصيرتك بالمقالات الدينية المتميزة وآخر أخبار المسلمين في العالم",
    artReadMore: "اقرأ التفاصيل",
    artBack: "العودة للخلف",
    artReadTime: "دقائق للقراءة",
    commTitle: "الحلقات التفاعلية الدائرية",
    commSubtitle: "انضم إلى غرف جماعية دائرية لحفظ القرآن وقراءة الأذكار بشكل حي ومباشر",
    commCreatePost: "نشر خاطرة إيمانية",
    commPostPlaceholder: "اكتب ما تود مشاركته مع إخوانك في التغذية الرئيسية لتعم الفائدة...",
    commPostButton: "نشر الخاطرة",
    commTasbihCount: "نقاط سكورك اليومي",
    commTasbihGlobal: "المستخدمون النشطون الآن",
    commTasbihTap: "اضغط على حبة السبحة",
    commTasbihReset: "إعادة ضبط",
    commMilestone: "سبحان الله! اكتمل الهدف اليومي: ",
    commTabCircles: "الحلقات المباشرة",
    circleJoin: "دخول الحلقة",
    circleLeave: "مغادرة الحلقة",
    circleFull: "مكتملة الأعضاء",
    circleCreate: "إنشاء حلقة دائرية جديدة",
    circleFormName: "عنوان الحلقة",
    circleFormDesc: "هدف الحلقة أو وصفها",
    circleFormCap: "العدد المستهدف للحضور",
    circleFormType: "نوع وبؤرة التركيز",
    circleSuccessCreated: "تم إطلاق الحلقة بنجاح وبدء الجلسة!",
    circleEnterSession: "دخول الحلقة المباشرة",
    circleSessionDuration: "المدة الزمنية",
    circleMinutes: "دقائق",
    circleCreator: "منظم الحلقة",
    circleTurnReciter: "صاحب الدور الحالي في القراءة",
    circleYourTurn: "جاء دورك الآن! اقرأ وعطر قلوبنا",
    circleWaitingTurn: "استمع في خشينة وأرسل دعواتك...",
    circleConfirmBtn: "أتممت القراءة ➡️ مرر الدور لمن بعدك",
    circleSendReaction: "أرسل قلوب ودعوات",
    circleSessionEnded: "اكتملت الحلقة الإيمانية بنجاح!",
    circleCongratulations: "تقبل الله طاعاتكم وصالح أعمالكم المنجزة جماعياً!",
    circleSharedProgress: "إجمالي أذكار وتسبيحات الحلقة",
    contactTitle: "مكتب الدعم المتميز",
    contactSubtitle: "تواصل معنا للاقتراحات المباشرة أو التبليغ عن الاستفسارات.",
    contactName: "اسم العرض الكامل",
    contactEmail: "البريد الإلكتروني",
    contactMsg: "نص الرسالة",
    contactSubmit: "إرسال الطلب",
    contactSuccess: "تم إرسال استفسارك بسلام وبركات وسنتواصل معك قريباً.",
    contactFAQTitle: "الأسئلة الشائعة والأجوبة",
    authTitle: "بوابة أرابيك مسلم",
    authSubtitle: "سجل حسابك الخاص لتتبع سكورك اليومي وإنجازاتك الشخصية.",
    authEmail: "البريد الإلكتروني",
    authPass: "كلمة المرور",
    authSubmit: "تسجيل الدخول",
    authSignUpSubmit: "إنشاء حساب جديد",
    authToggleToSignUp: "ليس لديك حساب؟ أنشئ حساباً مجانياً",
    authToggleToLogin: "لديك حساب بالفعل؟ سجل دخولك الآن",
    authError: "خطأ في تسجيل الدخول. التجربة: 'sally@arabicmuslim.com' / 'bismillah'",
    authWelcome: "السلام عليكم ورحمة الله",
    searchTitle: "نتائج البحث عن",
    searchNoResults: "لم يتم العثور على أي نتائج تطابق عملية البحث."
  }
};

export const AppProvider = ({ children }) => {
  // Localization state
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_lang');
    return saved === 'ar' ? 'ar' : 'en';
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Authenticated User State
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
      role: "Admin", // Defaults to Admin to unleash dashboards instantly
      memberSince: "May 2026"
    };
  });

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_bookmarks');
    return saved ? JSON.parse(saved) : { verses: [], articles: [] };
  });

  // Tasbih/Subha Counts
  const [tasbihCount, setTasbihCount] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_tasbih');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Gamification Metrics
  const [dailyScore, setDailyScore] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_daily_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [completedGoals, setCompletedGoals] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_completed_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_unlocked_badges');
    return saved ? JSON.parse(saved) : ["dhikr_pioneer"];
  });

  // Friend Request System
  const [friendRequestsSent, setFriendRequestsSent] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_friend_req_sent');
    return saved ? JSON.parse(saved) : [];
  });

  const [friendRequestsReceived, setFriendRequestsReceived] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_friend_req_received');
    return saved ? JSON.parse(saved) : [
      { name: "فاطمة حسن", avatar: "🧕", email: "fatima@arabicmuslim.com", role: "Certified Teacher", level: "Gold" },
      { name: "أحمد سليم", avatar: "👳", email: "ahmed@arabicmuslim.com", role: "Certified Teacher", level: "Bronze" }
    ];
  });

  const [friendsList, setFriendsList] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_friends');
    return saved ? JSON.parse(saved) : ["عمر فاروق", "أمينة يوسف"];
  });

  // Bot activity controls
  const [botSettings, setBotSettings] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_bot_settings');
    return saved ? JSON.parse(saved) : { enabled: true, frequency: 9000 };
  });

  // Dynamic articles state (Migrated from Articles page)
  const [articlesList, setArticlesList] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_articles');
    if (saved) return JSON.parse(saved);
    return generate120Articles();
  });

  // Tasmee audio submissions state
  const [tasmeeSubmissions, setTasmeeSubmissions] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_tasmee');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "seed-1",
        author: "فاطمة حسن",
        avatar: "🧕",
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
        avatar: "👳",
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

  // Preseeded and user-drafted community feed posts
  const [communityPosts, setCommunityPosts] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_posts');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        author: "Omar Farooq",
        avatar: "🧔",
        content: "Verily, in the remembrance of Allah do hearts find rest. (Surah Ar-Ra'd 13:28). Let us make a conscious effort to keep our tongues moist with Dhikr today.",
        contentAr: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ (الرعد: 28). لنبذل جهداً واعياً لإبقاء ألسنتنا رطبة بذكر الله اليوم.",
        likes: 38,
        likedBy: [],
        timestamp: "2 hours ago",
        comments: [
          { id: 1, author: "Fatima Hassan", avatar: "🧕", text: "Subhan Allah, much needed reminder in these busy hours." }
        ]
      },
      {
        id: 2,
        author: "Amina Yusuf",
        avatar: "🧕",
        content: "Just started learning Quranic Arabic through the recommended literature on the homepage! Highly recommend 'Arabic Stories for Language Learners' for anyone wanting to grasp deep contextual terms.",
        contentAr: "لقد بدأت للتو في تعلم لغة القرآن العربية من خلال الكتب الموصى بها في الصفحة الرئيسية! أنصح بشدة بكتاب 'قصص عربية لمتعلمي اللغة' لكل من يريد فهم المصطلحات الدينية العميقة.",
        likes: 27,
        likedBy: [],
        timestamp: "5 hours ago",
        comments: []
      }
    ];
  });

  // Active Circles
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
        ],
        creator: "System",
        type: "adhkar",
        recitationRule: "Tajweed"
      },
      {
        id: "c2",
        name: "Surah Al-Mulk Recitation",
        nameAr: "تلاوة سورة الملك",
        description: "Reciting Surah Al-Mulk together before sleep for protection and peace.",
        descriptionAr: "قراءة جماعية لسورة الملك قبل النوم لحفظ الصدور ونيل السكينة.",
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
        ],
        creator: "System",
        type: "quran",
        recitationRule: "Hafs"
      },
      {
        id: "c3",
        name: "Global Istighfar 1000x",
        nameAr: "حلقة الاستغفار الكبرى",
        description: "Seeking forgiveness together in these blessed moments.",
        descriptionAr: "الاستغفار الجماعي وطلب المغفرة لتطهير القلوب وتفريج الهموم.",
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
        ],
        creator: "System",
        type: "adhkar",
        recitationRule: "General"
      }
    ];
  });

  // Dynamic Bot Simulation Engine
  useEffect(() => {
    if (!botSettings.enabled) return;

    const interval = setInterval(() => {
      // Pick a random simulated bot event
      const actionType = Math.floor(Math.random() * 4);

      if (actionType === 0) {
        // 1. Bot joins or leaves a random circle
        setOnlineCircles(prevCircles => {
          if (prevCircles.length === 0) return prevCircles;
          const randomIndex = Math.floor(Math.random() * prevCircles.length);
          const circle = prevCircles[randomIndex];
          
          const bot = mockBots[Math.floor(Math.random() * mockBots.length)];
          const botExists = circle.joinedUsers.some(u => u.email === bot.email);
          
          let newUsers = [...circle.joinedUsers];
          if (botExists) {
            // Only leave system circles if user didn't join to keep it dynamic
            if (circle.creator === "System" && newUsers.length > 2) {
              newUsers = newUsers.filter(u => u.email !== bot.email);
            }
          } else {
            if (newUsers.length < circle.capacity) {
              newUsers.push({ name: bot.name, avatar: bot.avatar, email: bot.email });
            }
          }
          return prevCircles.map((c, idx) => idx === randomIndex ? { ...c, joinedUsers: newUsers } : c);
        });
      } else if (actionType === 1) {
        // 2. Bot publishes an inspirational reflection in the feed
        const bot = mockBots[Math.floor(Math.random() * mockBots.length)];
        const reflections = [
          { en: "Verily, with hardship comes ease. Keep making sincere dua!", ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا. داوموا على الدعاء والاستغفار وسترون الفرج الجميل!" },
          { en: "Sending salawat upon the Prophet Muhammad ﷺ heals the heart.", ar: "أكثروا من الصلاة على نبينا محمد ﷺ فإنها تجلو الهموم وتطهر القلوب وتفتح الأبواب." },
          { en: "Let us keep our tongues moist with the remembrance of Allah.", ar: "لنجعل ألسنتنا رطبة بذكر الله والاستغفار طوال هذا اليوم الطيب المبارك." },
          { en: "Just read a beautiful tafsir of Surah Al-Kahf. Friday peace!", ar: "قرأت للتو تفاسير قيّمة حول قصص سورة الكهف الأربعة، حماية نفسية رائعة لقلوبنا." }
        ];
        const selected = reflections[Math.floor(Math.random() * reflections.length)];
        
        setCommunityPosts(prevPosts => {
          const newPost = {
            id: Date.now(),
            author: bot.name,
            avatar: bot.avatar,
            content: selected.en,
            contentAr: selected.ar,
            likes: Math.floor(Math.random() * 5) + 3,
            likedBy: [],
            timestamp: "Just now",
            comments: []
          };
          return [newPost, ...prevPosts.slice(0, 39)];
        });
      } else if (actionType === 2) {
        // 3. Bot likes or comments on a random feed post
        setCommunityPosts(prevPosts => {
          if (prevPosts.length === 0) return prevPosts;
          const randomIndex = Math.floor(Math.random() * prevPosts.length);
          const post = prevPosts[randomIndex];
          const bot = mockBots[Math.floor(Math.random() * mockBots.length)];
          
          const alreadyLiked = post.likedBy.includes(bot.email);
          let newLikes = post.likes;
          let newLikedBy = [...post.likedBy];
          if (!alreadyLiked) {
            newLikes += 1;
            newLikedBy.push(bot.email);
          }
          
          let newComments = [...post.comments];
          if (Math.random() < 0.4) {
            const commentsList = [
              "ما شاء الله، تذكير قيم ونفع الله بك إسلامنا وعقيدتنا!",
              "Subhan Allah! Beautifully written reflection. May Allah reward you.",
              "اللهم صل وسلم على نبينا محمد وعلى آله وصحبه أجمعين.",
              "جزاك الله خيراً وجعله في ميزان حسناتك الشريفة."
            ];
            newComments.push({
              id: Date.now() + Math.random(),
              author: bot.name,
              avatar: bot.avatar,
              text: commentsList[Math.floor(Math.random() * commentsList.length)]
            });
          }
          
          return prevPosts.map((p, idx) => idx === randomIndex ? { ...p, likes: newLikes, likedBy: newLikedBy, comments: newComments } : p);
        });
      } else if (actionType === 3) {
        // 4. Bot sends a dynamic incoming friend request
        const bot = mockBots[Math.floor(Math.random() * mockBots.length)];
        setFriendsList(currentFriends => {
          if (currentFriends.includes(bot.name)) return currentFriends;
          
          setFriendRequestsReceived(currentReqs => {
            const alreadyExists = currentReqs.some(r => r.email === bot.email);
            if (alreadyExists) return currentReqs;
            return [...currentReqs, bot];
          });
          return currentFriends;
        });
      }
    }, botSettings.frequency);

    return () => clearInterval(interval);
  }, [botSettings]);

  // Expose gamification goal triggers
  const addDailyScorePoints = (points) => {
    setDailyScore(prev => prev + points);
  };

  const completeDailyGoal = (goalId, points = 50) => {
    setCompletedGoals(prev => {
      if (prev.includes(goalId)) return prev;
      
      // Confetti celebration
      confetti({
        particleCount: 50,
        spread: 60,
        colors: ['#d4af37', '#ffffff']
      });

      setDailyScore(s => s + points);
      return [...prev, goalId];
    });
  };

  const unlockBadgeAction = (badgeId) => {
    setUnlockedBadges(prev => {
      if (prev.includes(badgeId)) return prev;
      confetti({
        particleCount: 100,
        spread: 80,
        colors: ['#d4af37', '#ffffff', '#c5a059']
      });
      return [...prev, badgeId];
    });
  };

  // Friend Requests handlers
  const sendFriendRequest = (target) => {
    setFriendRequestsSent(prev => {
      if (prev.some(r => r.email === target.email)) return prev;
      
      // Auto accept dynamic bots requests after 3 seconds for realistic action
      const isBot = mockBots.some(b => b.email === target.email);
      if (isBot) {
        setTimeout(() => {
          setFriendRequestsSent(s => s.filter(r => r.email !== target.email));
          setFriendsList(f => [...f, target.name]);
          
          confetti({
            particleCount: 25,
            spread: 40,
            colors: ['#d4af37', '#ffffff']
          });
        }, 3000);
      }
      return [...prev, target];
    });
  };

  const acceptFriendRequest = (sender) => {
    setFriendRequestsReceived(prev => prev.filter(r => r.email !== sender.email));
    setFriendsList(prev => {
      if (prev.includes(sender.name)) return prev;
      return [...prev, sender.name];
    });
    confetti({
      particleCount: 30,
      spread: 50,
      colors: ['#d4af37', '#ffffff']
    });
  };

  const declineFriendRequest = (sender) => {
    setFriendRequestsReceived(prev => prev.filter(r => r.email !== sender.email));
  };

  const removeFriend = (friendName) => {
    setFriendsList(prev => prev.filter(n => n !== friendName));
  };

  // Admin Article publisher
  const adminAddArticle = (newArticle) => {
    setArticlesList(prev => [newArticle, ...prev]);
  };

  const updateUserRole = (newRole, newLevel) => {
    setUser(prev => {
      const updated = { ...prev, role: newRole, teacherLevel: newLevel || null };
      localStorage.setItem('arabicmuslim_user', JSON.stringify(updated));
      return updated;
    });
  };

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('arabicmuslim_lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_tasbih', tasbihCount.toString());
  }, [tasbihCount]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_tasmee', JSON.stringify(tasmeeSubmissions));
  }, [tasmeeSubmissions]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_friends', JSON.stringify(friendsList));
  }, [friendsList]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_posts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_circles', JSON.stringify(onlineCircles));
  }, [onlineCircles]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_daily_score', dailyScore.toString());
  }, [dailyScore]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_completed_goals', JSON.stringify(completedGoals));
  }, [completedGoals]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_unlocked_badges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_friend_req_sent', JSON.stringify(friendRequestsSent));
  }, [friendRequestsSent]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_friend_req_received', JSON.stringify(friendRequestsReceived));
  }, [friendRequestsReceived]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_bot_settings', JSON.stringify(botSettings));
  }, [botSettings]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_articles', JSON.stringify(articlesList));
  }, [articlesList]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const login = (email, password) => {
    if (email === "sally@arabicmuslim.com" && password === "bismillah") {
      const loggedUser = {
        name: "Sally Ali",
        email: "sally@arabicmuslim.com",
        avatar: "🌙",
        dailyTasbih: tasbihCount,
        role: "Admin",
        memberSince: "May 2026"
      };
      setUser(loggedUser);
      setIsAuthenticated(true);
      localStorage.setItem('arabicmuslim_auth', 'true');
      localStorage.setItem('arabicmuslim_user', JSON.stringify(loggedUser));
      return true;
    }
    
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

      return { ...prev, [type]: updatedList };
    });
  };

  const addTasmeeSubmission = (recording) => {
    const newSubmission = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(language === 'ar' ? 'ar' : 'en', { year: 'numeric', month: 'short', day: 'numeric' }),
      author: user.name,
      avatar: user.avatar,
      isUser: true,
      loves: 0,
      lovedBy: [],
      rating: null,
      comments: null,
      teacherAudio: null,
      ...recording
    };
    
    setTasmeeSubmissions(prev => [newSubmission, ...prev]);

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

  const addPost = (content) => {
    const newPost = {
      id: Date.now(),
      author: isAuthenticated ? user.name : "Anonymous Muslim",
      avatar: isAuthenticated ? user.avatar : "🕌",
      content: content,
      contentAr: content,
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
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
  };

  const joinCircle = (circleId) => {
    let completed = false;
    setOnlineCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        const userIdentifier = isAuthenticated ? user.email : "guest_user";
        const hasJoined = c.joinedUsers.some(u => u.email === userIdentifier || (userIdentifier === "guest_user" && u.name === "Guest Member"));
        
        let newUsers;
        if (hasJoined) {
          newUsers = c.joinedUsers.filter(u => u.email !== userIdentifier && u.name !== "Guest Member");
        } else {
          const newUser = {
            name: isAuthenticated ? user.name : "Guest Member",
            email: isAuthenticated ? user.email : "guest_user",
            avatar: isAuthenticated ? user.avatar : "👳"
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
          avatar: isAuthenticated ? user.avatar : "👳"
        }
      ],
      creator: isAuthenticated ? user.name : "Guest",
      type: circleData.type || "adhkar",
      recitationRule: circleData.recitationRule || "Tajweed"
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

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      searchQuery,
      setSearchQuery,
      isAuthenticated,
      user,
      setUser,
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
      removeFriend,
      sendFriendRequest,
      acceptFriendRequest,
      declineFriendRequest,
      friendRequestsSent,
      friendRequestsReceived,
      dailyScore,
      setDailyScore,
      addDailyScorePoints,
      completedGoals,
      completeDailyGoal,
      unlockedBadges,
      unlockBadgeAction,
      botSettings,
      setBotSettings,
      articlesList,
      adminAddArticle,
      updateUserRole,
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
