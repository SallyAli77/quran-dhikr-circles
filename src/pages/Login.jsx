import React, { useState, useEffect, useRef } from 'react';
import { useApp, mockBots } from '../context/AppContext';
import { 
  ShieldAlert, LogIn, UserPlus, Key, Award, Bookmark, Edit2, Check, 
  ArrowRight, User, Mic, Star, Heart, UserMinus, Volume2, Loader, 
  Clock, Plus, Shield, Settings, AlertCircle, BookOpen, Trash2, Send, CheckCircle2, Play,
  Eye, EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Rigorous 30 Quran Memorization (Hifz) Questions
const certificationQuestions = [
  { q: "What is the verse that comes immediately after: 'And the stupor of death will bring the truth...'?", qAr: "ما هي الآية التالية للآية الكريمة: (وجاءت سكرة الموت بالحق...)؟", options: ["ذلك ما كنت منه تحيد (Kaf: 19)", "ونفخ في الصور ذلك يوم الوعيد", "وجاءت كل نفس معها سائق وشهيد", "لقد كنت في غفلة من هذا"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'Indeed, this Qur'an guides to that which is most suitable...'?", qAr: "في أي سورة وردت الآية الكريمة: (إن هذا القرآن يهدي للتي هي أقوم...)؟", options: ["سورة الكهف (Al-Kahf)", "سورة الإسراء (Al-Isra)", "سورة مريم (Maryam)", "سورة يونس (Yunus)"], correctIndex: 1 },
  { q: "What is the verse that comes immediately after: 'Allah is the Light of the heavens and the earth...'?", qAr: "ما هي الآية التالية للآية الكريمة: (الله نور السموات والأرض...)؟", options: ["مثل نوره كمشكاة فيها مصباح (An-Nur: 35)", "في بيوت أذن الله أن ترفع ويذكر فيها اسمه", "رجال لا تلهيهم تجارة ولا بيع عن ذكر الله", "يسبح له فيها بالغدو والآصال"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'Approached for the people their account, while they are in heedlessness...'?", qAr: "في أي سورة وردت الآية الكريمة: (اقترب للناس حسابهم وهم في غفلة معرضون...)؟", options: ["سورة الأنبياء (Al-Anbiya)", "سورة الحج (Al-Hajj)", "سورة المؤمنون (Al-Muminun)", "سورة طه (Ta-Ha)"], correctIndex: 0 },
  { q: "What is the verse that comes immediately after: 'The Most Merciful • Taught the Qur'an...'?", qAr: "ما هي الآية التالية للآية الكريمة: (الرحمن • علم القرآن...)؟", options: ["خلق الإنسان (Ar-Rahman: 3)", "علمه البيان", "الشمس والقمر بحسبان", "والنجم والشجر يسجدان"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'O you who have believed, decreed upon you is fasting as it was decreed upon those before you...'?", qAr: "في أي سورة وردت الآية الكريمة: (يا أيها الذين آمنوا كتب عليكم الصيام كما كتب على الذين من قبلكم...)؟", options: ["سورة آل عمران (Ali 'Imran)", "سورة البقرة (Al-Baqarah)", "سورة النساء (An-Nisa)", "سورة المائدة (Al-Ma'idah)"], correctIndex: 1 },
  { q: "What is the verse that comes immediately after: 'Every soul will taste death, and you will only be given your full compensation on the Day of Resurrection...'?", qAr: "ما هي الآية التالية للآية الكريمة: (كل نفس ذائقة الموت وإنما توفون أجوركم يوم القيامة...)؟", options: ["فمن زحزح عن النار وأدخل الجنة فقد فاز (Ali 'Imran: 185)", "وما الحياة الدنيا إلا متاع الغرور", "لتبلون في أموالكم وأنفسكم", "ولتسمعن من الذين أوتوا الكتاب"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'And your Lord has decreed that you not worship except Him, and to parents, good treatment...'?", qAr: "في أي سورة وردت الآية الكريمة: (وقضى ربك ألا تعبدوا إلا إياه وبالوالدين إحساناً...)؟", options: ["سورة الإسراء (Al-Isra)", "سورة النحل (An-Nahl)", "سورة القصص (Al-Qasas)", "سورة لقمان (Luqman)"], correctIndex: 0 },
  { q: "What is the verse that comes immediately after: 'O reassured soul...'?", qAr: "ما هي الآية التالية للآية الكريمة: (يا أيها النفس المطمئنة...)؟", options: ["ارجعي إلى ربك راضية مرضية (Al-Fajr: 28)", "فادخلي في عبادي", "وادخلي جنتي", "يومئذ يتذكر الإنسان وأنى له الذكرى"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'Successful are the believers • Those who are humble in their prayers...'?", qAr: "في أي سورة وردت الآية الكريمة: (قد أفلح المؤمنون • الذين هم في صلاتهم خاشعون...)؟", options: ["سورة المؤمنون (Al-Muminun)", "سورة النور (An-Nur)", "سورة الفرقان (Al-Furqan)", "سورة السجدة (As-Sajdah)"], correctIndex: 0 },
  { q: "What is the verse that comes immediately after: 'Blessed is He in whose hand is the dominion, and He is over all things competent...'?", qAr: "ما هي الآية التالية للآية الكريمة: (تبارك الذي بيده الملك وهو على كل شيء قدير...)؟", options: ["الذي خلق الموت والحياة ليبلوكم أيكم أحسن عملاً (Al-Mulk: 2)", "الذي خلق سبع سموات طباقاً", "ما ترى في خلق الرحمن من تفاوت", "ثم ارجع البصر كرتين ينقلب إليك البصر خاسئاً"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'Say, O My servants who have transgressed against themselves, do not despair of the mercy of Allah...'?", qAr: "في أي سورة وردت الآية الكريمة: (قل يا عبادي الذين أسرفوا على أنفسهم لا تقنطوا من رحمة الله...)؟", options: ["سورة الزمر (Az-Zumar)", "سورة غافر (Ghafir)", "سورة فصلت (Fussilat)", "سورة الشورى (Ash-Shura)"], correctIndex: 0 },
  { q: "What is the verse that comes immediately after: 'When the victory of Allah has come and the conquest...'?", qAr: "ما هي الآية التالية للآية الكريمة: (إذا جاء نصر الله والفتح...)؟", options: ["ورأيت الناس يدخلون في دين الله أفواجاً (An-Nasr: 2)", "فسبح بحمد ربك واستغفره", "إنه كان تواباً", "تبت يدا أبي لهب وتب"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'And recite to them the news of Noah, when he said to his people: O my people, if my residence has become burdensome to you...'?", qAr: "في أي سورة وردت الآية الكريمة: (واتل عليهم نبأ نوح إذ قال لقومه يا قوم إن كان كبر عليكم مقامي...)؟", options: ["سورة يونس (Yunus)", "سورة هود (Hud)", "سورة يوسف (Yusuf)", "سورة الأعراف (Al-A'raf)"], correctIndex: 0 },
  { q: "What is the verse that comes immediately after: 'About what are they asking one another? • About the great news...'?", qAr: "ما هي الآية التالية للآية الكريمة: (عم يتساءلون • عن النبأ العظيم...)؟", options: ["الذي هم فيه مختلفون (An-Naba: 3)", "كلا سيعلمون", "ثم كلا سيعلمون", "ألم نجعل الأرض مهاداً"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the truth...'?", qAr: "في أي سورة وردت الآية الكريمة: (سنريهم آياتنا في الآفاق وفي أنفسهم حتى يتبين لهم أنه الحق...)؟", options: ["سورة فصلت (Fussilat)", "سورة غافر (Ghafir)", "سورة السجدة (As-Sajdah)", "سورة يس (Ya-Sin)"], correctIndex: 0 },
  { q: "What is the verse that comes immediately after: 'Say, He is Allah, [who is] One • Allah, the Eternal Refuge...'?", qAr: "ما هي الآية التالية للآية الكريمة: (قل هو الله أحد • الله الصمد...)؟", options: ["لم يلد ولم يولد (Al-Ikhlas: 3)", "ولم يكن له كفواً أحد", "من شر ما خلق", "ومن شر غاسق إذا وقب"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'O you who have believed, avoid much [negative] assumption; indeed, some assumption is sin...'?", qAr: "في أي سورة وردت الآية الكريمة: (يا أيها الذين آمنوا اجتنبوا كثيراً من الظن إن بعض الظن إثم...)؟", options: ["سورة الحجرات (Al-Hujurat)", "سورة المجادلة (Al-Mujadilah)", "سورة الممتحنة (Al-Mumtahanah)", "سورة الفتح (Al-Fath)"], correctIndex: 0 },
  { q: "What is the verse that comes immediately after: 'Indeed, the righteous will be among gardens and springs...'?", qAr: "ما هي الآية التالية للآية الكريمة: (إن المتقين في جنات وعيون...)؟", options: ["آخذين ما آتاهم ربهم إنهم كانوا قبل ذلك محسنين (Adh-Dhariyat: 16)", "كانوا قليلاً من الليل ما يهجعون", "وبالأسحار هم يستغفرون", "وفي أموالهم حق للسائل والمحروم"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'O mankind, fear your Lord. Indeed, the convulsion of the [final] Hour is a grave thing...'?", qAr: "في أي سورة وردت الآية الكريمة: (يا أيها الناس اتقوا ربكم إن زلزلة الساعة شيء عظيم...)؟", options: ["سورة الحج (Al-Hajj)", "سورة الأنبياء (Al-Anbiya)", "سورة المؤمنون (Al-Muminun)", "سورة الزمر (Az-Zumar)"], correctIndex: 0 },
  { q: "What is the verse that comes immediately after: 'Ya, Seen • By the wise Qur'an...'?", qAr: "ما هي الآية التالية للآية الكريمة: (يس • والقرآن الحكيم...)؟", options: ["إنك لمن المرسلين (Ya-Sin: 3)", "على صراط مستقيم", "تنزيل العزيز الرحيم", "لتنذر قوماً ما أنذر آباؤهم"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'And of His signs is the creation of the heavens and the earth and the diversity of your languages and your colors...'?", qAr: "في أي سورة وردت الآية الكريمة: (ومن آياته خلق السموات والأرض واختلاف ألسنتكم وألوانكم...)؟", options: ["سورة الروم (Ar-Rum)", "سورة لقمان (Luqman)", "سورة السجدة (As-Sajdah)", "سورة فاطر (Fatir)"], correctIndex: 0 },
  { q: "What is the verse that comes immediately after: 'Indeed, Allah and His angels confer blessing upon the Prophet...'?", qAr: "ما هي الآية التالية للآية الكريمة: (إن الله وملائكته يصلون على النبي...)؟", options: ["يا أيها الذين آمنوا صلوا عليه وسلموا تسليماً (Al-Ahzab: 56)", "إن الذين يؤذون الله ورسوله لعنهم الله", "والذين يؤذون المؤمنين والمؤمنات بغير ما اكتسبوا", "يا أيها النبي قل لأزواجك وبناتك"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'And We made from water every living thing. Then will they not believe...'?", qAr: "في أي سورة وردت الآية الكريمة: (وجعلنا من الماء كل شيء حي أفلا يؤمنون...)؟", options: ["سورة الأنبياء (Al-Anbiya)", "سورة الحجر (Al-Hijr)", "سورة الرعد (Ar-Rad)", "سورة النمل (An-Naml)"], correctIndex: 0 },
  { q: "What is the verse that comes immediately after: 'Then which of the favors of your Lord will you deny? • He created man from clay like [that of] pottery...'?", qAr: "ما هي الآية التالية للآية الكريمة: (فبأي آلاء ربكما تكذبان • خلق الإنسان من صلصال كالفخار...)؟", options: ["وخلق الجان من مارج من نار (Ar-Rahman: 15)", "رب المشرقين ورب المغربين", "مرج البحرين يلتقيان", "بينهما برزخ لا يبغيان"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'Allah will raise those who have believed among you and those who were given knowledge, by degrees...'?", qAr: "في أي سورة وردت الآية الكريمة: (يرفع الله الذين آمنوا منكم والذين أوتوا العلم درجات...)؟", options: ["سورة المجادلة (Al-Mujadilah)", "سورة الحشر (Al-Hashr)", "سورة الجمعة (Al-Jumu'ah)", "سورة الصف (As-Saff)"], correctIndex: 0 },
  { q: "What is the verse that comes immediately after: 'He is the One who has sent His Messenger with guidance and the religion of truth to manifest it over all religion...'?", qAr: "ما هي الآية التالية للآية الكريمة: (هو الذي أرسل رسوله بالهدى ودين الحق ليظهره على الدين كله...)؟", options: ["ولو كره المشركون (As-Saff: 9)", "وكفى بالله شهيداً", "محمد رسول الله", "والذين معه أشداء على الكفار"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'And if whatever trees on earth were pens and the ocean were ink, replenished thereafter by seven more oceans...'?", qAr: "في أي سورة وردت الآية الكريمة: (ولو أنما في الأرض من شجرة أقلام والبحر يمده من بعده سبعة أبحر...)؟", options: ["سورة لقمان (Luqman)", "سورة النمل (An-Naml)", "سورة العنكبوت (Al-Ankabut)", "سورة الروم (Ar-Rum)"], correctIndex: 0 },
  { q: "What is the verse that comes immediately after: 'And We have sent down blessed rain from the sky and made grow thereby gardens...'?", qAr: "ما هي الآية التالية للآية الكريمة: (ونزلنا من السماء ماء مباركاً فأنبتنا به جنات...)؟", options: ["وحب الحصيد (Qaf: 9)", "والنخل باسقات لها طلع نضيد", "رزقاً للعباد وأحيينا به بلدة ميتاً", "كذلك الخروج"], correctIndex: 0 },
  { q: "In which Surah is this verse located: 'And have you seen the water that you drink? • Is it you who brought it down from the rain clouds, or is it We who bring it down...'?", qAr: "في أي سورة وردت الآية الكريمة: (أفرأيتم الماء الذي تشربون • أأنتم أنزلتموه من المزن أم نحن المنزلون...)؟", options: ["سورة الواقعة (Al-Waqi'ah)", "سورة الطور (At-Tur)", "سورة النجم (An-Najm)", "سورة الرحمن (Ar-Rahman)"], correctIndex: 0 }
];

export default function Login({ setActivePage }) {
  const { 
    isAuthenticated, 
    user, 
    setUser,
    login, 
    logout, 
    bookmarks, 
    toggleBookmark, 
    tasbihCount, 
    t, 
    language, 
    tasmeeSubmissions, 
    deleteTasmeeSubmission,
    loveTasmeeSubmission,
    friendsList,
    removeFriend,
    friendRequestsReceived,
    acceptFriendRequest,
    declineFriendRequest,
    dailyScore,
    completedGoals,
    completeDailyGoal,
    unlockedBadges,
    unlockBadgeAction,
    botSettings,
    setBotSettings,
    articlesList,
    adminAddArticle,
    updateUserRole
  } = useApp();

  // Auth modes
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ageConsent, setAgeConsent] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Password strength calculator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score, label: language === 'ar' ? 'ضعيف جداً' : 'Very Weak', color: '#ef4444' };
    if (score === 2) return { score, label: language === 'ar' ? 'ضعيف' : 'Weak', color: '#f97316' };
    if (score === 3) return { score, label: language === 'ar' ? 'متوسط' : 'Fair', color: '#eab308' };
    if (score === 4) return { score, label: language === 'ar' ? 'قوي' : 'Strong', color: '#22c55e' };
    return { score, label: language === 'ar' ? 'قوي جداً' : 'Very Strong', color: '#10b981' };
  };
  const pwdStrength = getPasswordStrength(password);

  // Tab navigation inside dashboard
  const [activeTab, setActiveTab] = useState("my_recordings"); // "my_recordings", "saved_bookmarks", "friend_requests", "teacher_center", "admin_portal"
  
  // Dashboard states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const avatarsList = ["🌙", "🕌", "✨", "⭐", "📖", "🎓", "🧕", "👳", "🧔"];

  // Admin Switcher state
  const [activeAdminRole, setActiveAdminRole] = useState(user.role);

  // Admin Article publisher states
  const [newArtTitle, setNewArtTitle] = useState("");
  const [newArtTitleAr, setNewArtTitleAr] = useState("");
  const [newArtCategory, setNewArtCategory] = useState("Faith");
  const [newArtReadTime, setNewArtReadTime] = useState(5);
  const [newArtSummary, setNewArtSummary] = useState("");
  const [newArtSummaryAr, setNewArtSummaryAr] = useState("");
  const [newArtContent, setNewArtContent] = useState("");
  const [newArtContentAr, setNewArtContentAr] = useState("");
  const [artPublishSuccess, setArtPublishSuccess] = useState(false);

  // Teacher registration & Quiz states
  const [selectedJuzList, setSelectedJuzList] = useState([]);
  const [isExamActive, setIsExamActive] = useState(false);
  const [examCurrentQuestionIdx, setExamCurrentQuestionIdx] = useState(0);
  const [examAnswers, setExamAnswers] = useState({});
  const [examTimeLeft, setExamTimeLeft] = useState(1800); // 30 minutes in seconds
  const [examFinished, setExamFinished] = useState(false);
  const [examScore, setExamScore] = useState(0);

  // Timer Ref
  const examTimerRef = useRef(null);

  // Sync Timer for quiz
  useEffect(() => {
    if (isExamActive && !examFinished) {
      examTimerRef.current = setInterval(() => {
        setExamTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(examTimerRef.current);
            handleFinishExam(true); // auto submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (examTimerRef.current) clearInterval(examTimerRef.current);
    };
  }, [isExamActive, examFinished]);

  // Deep Link tab auto-focus handlers
  useEffect(() => {
    const handleDeepLink = () => {
      setActiveTab("teacher_center");
    };
    window.addEventListener('deep_link_teacher_center', handleDeepLink);

    // Also check on mount
    const link = localStorage.getItem('arabicmuslim_deep_link');
    if (link === 'teacher_center' && isAuthenticated) {
      setActiveTab('teacher_center');
      localStorage.removeItem('arabicmuslim_deep_link');
    }

    return () => {
      window.removeEventListener('deep_link_teacher_center', handleDeepLink);
    };
  }, [isAuthenticated]);

  const handleStartExam = () => {
    setIsExamActive(true);
    setExamCurrentQuestionIdx(0);
    setExamAnswers({});
    setExamTimeLeft(1800);
    setExamFinished(false);
    setExamScore(0);
  };

  const handleSelectExamAnswer = (questionIdx, answerIdx) => {
    setExamAnswers(prev => ({ ...prev, [questionIdx]: answerIdx }));
  };

  const handleFinishExam = (isTimeout = false) => {
    if (examTimerRef.current) clearInterval(examTimerRef.current);
    
    // Calculate Score
    let score = 0;
    certificationQuestions.forEach((q, index) => {
      if (examAnswers[index] === q.correctIndex) {
        score += 1;
      }
    });

    setExamScore(score);
    setExamFinished(true);
    setIsExamActive(false);

    const passed = score >= 24; // 80% passing standard
    if (passed) {
      // Award badges based on the exact number of selected memorized Juz'
      const juzCount = selectedJuzList.length;
      updateUserRole("Certified Teacher", juzCount.toString());
      unlockBadgeAction("teacher_qualified");
      completeDailyGoal("read_article", 100);

      confetti({
        particleCount: 150,
        spread: 80,
        colors: ['#d4af37', '#ffffff']
      });
    }
  };

  // Auth triggers
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError("");
    const success = login(email, password);
    if (success) {
      confetti({
        particleCount: 100,
        spread: 70,
        colors: ['#d4af37', '#ffffff']
      });
    } else {
      setAuthError(t('authError'));
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    // 1. Name validation
    if (!name.trim() || name.trim().length < 3) {
      setAuthError(language === 'en' ? "Full name must be at least 3 characters." : "يجب أن يحتوي الاسم الكامل على 3 أحرف أو أكثر.");
      return;
    }
    if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(name.trim())) {
      setAuthError(language === 'en' ? "Name may only contain letters and spaces." : "الاسم يجب أن يحتوي على حروف ومسافات فقط.");
      return;
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setAuthError(language === 'en' ? "Please enter a valid email address." : "يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }

    // 3. Strong password policy (AdSense / GDPR standard)
    if (password.length < 8) {
      setAuthError(language === 'en' ? "Password must be at least 8 characters." : "كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setAuthError(language === 'en' ? "Password must include at least one uppercase letter (A-Z)." : "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setAuthError(language === 'en' ? "Password must include at least one number (0-9)." : "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل.");
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      setAuthError(language === 'en' ? "Password must include at least one special character (e.g. @, #, !)." : "كلمة المرور يجب أن تحتوي على رمز خاص واحد (مثل @ # !).");
      return;
    }

    // 4. Confirm password match
    if (password !== confirmPassword) {
      setAuthError(language === 'en' ? "Passwords do not match. Please try again." : "كلمتا المرور غير متطابقتين. يرجى المحاولة مجدداً.");
      return;
    }

    // 5. Age and privacy consent (required for AdSense)
    if (!ageConsent) {
      setAuthError(language === 'en' ? "You must confirm you are 13 years or older to register." : "يجب أن تؤكد أنك تجاوزت 13 عاماً للتسجيل.");
      return;
    }
    if (!privacyConsent) {
      setAuthError(language === 'en' ? "You must accept our Privacy Policy and Terms of Service." : "يجب قبول سياسة الخصوصية وشروط الخدمة للمتابعة.");
      return;
    }

    const success = login(email.trim().toLowerCase(), password);
    if (success) {
      // Reset all form fields
      setConfirmPassword("");
      setAgeConsent(false);
      setPrivacyConsent(false);

      confetti({
        particleCount: 100,
        spread: 80,
        colors: ['#d4af37', '#ffffff']
      });
    } else {
      setAuthError(language === 'en' ? "Registration failed. Please try a different email." : "فشل التسجيل. يرجى تجربة بريد إلكتروني مختلف.");
    }
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) return;
    setUser(prev => {
      const updated = { ...prev, name: editName, avatar: editAvatar };
      localStorage.setItem('arabicmuslim_user', JSON.stringify(updated));
      return updated;
    });
    setIsEditingProfile(false);
    confetti({
      particleCount: 20,
      spread: 30,
      colors: ['#d4af37', '#ffffff']
    });
  };

  // Admin Publish article trigger
  const handlePublishArticle = (e) => {
    e.preventDefault();
    if (!newArtTitle.trim() || !newArtContent.trim()) return;

    const newArt = {
      id: Date.now(),
      title: newArtTitle,
      titleAr: newArtTitleAr || newArtTitle,
      category: newArtCategory,
      categoryAr: newArtCategory === "Faith" ? "إيمانيات" : (newArtCategory === "Tafsir" ? "تفسير" : "تعلم العربية"),
      author: user.name,
      authorAr: user.name,
      avatar: user.avatar,
      date: new Date().toLocaleDateString(language === 'ar' ? 'ar' : 'en', { year: 'numeric', month: 'short', day: 'numeric' }),
      readTime: parseInt(newArtReadTime, 10) || 5,
      summary: newArtSummary || "A premium, newly drafted article focusing on daily worship details and faith growth guides.",
      summaryAr: newArtSummaryAr || "خاطرة دينية ومقال تعليمي جديد يركز على إثراء تدبرك ودراستك الإيمانية واللغوية.",
      content: newArtContent,
      contentAr: newArtContentAr || newArtContent
    };

    adminAddArticle(newArt);
    completeDailyGoal("read_article", 50);

    // Clear publisher
    setNewArtTitle("");
    setNewArtTitleAr("");
    setNewArtSummary("");
    setNewArtSummaryAr("");
    setNewArtContent("");
    setNewArtContentAr("");
    setArtPublishSuccess(true);
    setTimeout(() => setArtPublishSuccess(false), 5000);

    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#d4af37', '#ffffff']
    });
  };

  // Filter personal user recordings
  const mySubmissions = tasmeeSubmissions.filter(sub => sub.isUser);

  // Formatter for timer minutes and seconds
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="login-page container fade-in" style={{ minHeight: '80vh', paddingBottom: '80px' }}>
      
      {!isAuthenticated ? (
        isForgotPasswordMode ? (
          // ================= FORGOT PASSWORD FORM =================
          <div style={styles.authContainer} className="glass-panel">
            <div className="islamic-pattern"></div>
            
            <div style={styles.authHeader}>
              <Key size={32} color="var(--text-gold)" style={styles.authIcon} />
              <h2 style={styles.authTitle}>
                {isResetSuccess 
                  ? (language === 'en' ? "Check Your Email" : "تحقق من بريدك") 
                  : (language === 'en' ? "Reset Password" : "إعادة تعيين كلمة المرور")}
              </h2>
              <p style={styles.authSubtitle}>
                {isResetSuccess
                  ? (language === 'en' ? "We have sent a secure password reset link to your email address." : "لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.")
                  : (language === 'en' ? "Enter your email address to receive a secure recovery link." : "أدخل بريدك الإلكتروني لتلقي رابط آمن لاستعادة كلمة المرور.")}
              </p>
            </div>

            {isResetSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                  <CheckCircle2 size={64} color="var(--text-gold)" style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))' }} />
                </div>
                <button 
                  onClick={() => { setIsForgotPasswordMode(false); setIsResetSuccess(false); setResetEmail(""); }}
                  className="btn-primary"
                  style={{ ...styles.submitBtn, width: '100%', justifyContent: 'center' }}
                >
                  <span>{language === 'en' ? "Back to Login" : "العودة لتسجيل الدخول"}</span>
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setIsResetSuccess(true); }} style={styles.authForm}>
                <div style={styles.formField}>
                  <label style={styles.fieldLabel}>{t('authEmail')}</label>
                  <input
                    type="email"
                    required
                    placeholder={language === 'en' ? "your@email.com" : "بريدك@الإلكتروني.com"}
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="premium-input"
                    autoComplete="email"
                  />
                </div>

                <button type="submit" className="btn-primary" style={styles.submitBtn}>
                  <Send size={14} />
                  <span>{language === 'en' ? "Send Reset Link" : "إرسال رابط استعادة المرور"}</span>
                </button>

                <button 
                  type="button"
                  onClick={() => { setIsForgotPasswordMode(false); setAuthError(""); }}
                  style={styles.toggleBtn}
                >
                  {language === 'en' ? "Back to Login" : "العودة لتسجيل الدخول"}
                </button>
              </form>
            )}
          </div>
        ) : (
          // ================= AUTHENTICATION FORM =================
          <div style={styles.authContainer} className="glass-panel">
            <div className="islamic-pattern"></div>
            
            <div style={styles.authHeader}>
              <LogIn size={32} color="var(--text-gold)" style={styles.authIcon} />
              <h2 style={styles.authTitle}>{isSignUpMode ? t('authSignUpSubmit') : t('authTitle')}</h2>
              <p style={styles.authSubtitle}>{t('authSubtitle')}</p>
            </div>

            {authError && (
              <div style={styles.errorBanner} className="glass-panel fade-in">
                <ShieldAlert size={16} color="#ff6b6b" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={isSignUpMode ? handleSignUpSubmit : handleLoginSubmit} style={styles.authForm}>
              {isSignUpMode && (
                <div style={styles.formField}>
                  <label style={styles.fieldLabel}>{language === 'en' ? "Full Name" : "الاسم الكامل"}</label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'en' ? "e.g. Ahmad Abdullah" : "مثال: أحمد عبدالله"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="premium-input"
                    autoComplete="name"
                  />
                </div>
              )}

              <div style={styles.formField}>
                <label style={styles.fieldLabel}>{t('authEmail')}</label>
                <input
                  type="email"
                  required
                  placeholder={language === 'en' ? "your@email.com" : "بريدك@الإلكتروني.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="premium-input"
                  autoComplete={isSignUpMode ? "email" : "username"}
                />
              </div>

              <div style={styles.formField}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <label style={styles.fieldLabel}>{t('authPass')}</label>
                  {!isSignUpMode && (
                    <button
                      type="button"
                      onClick={() => { setIsForgotPasswordMode(true); setAuthError(""); }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-gold)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                    >
                      {language === 'en' ? "Forgot Password?" : "هل نسيت كلمة المرور؟"}
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={isSignUpMode ? (language === 'en' ? "Min 8 chars, A-Z, 0-9, symbol" : "8+ حروف، كبيرة، أرقام، رمز") : "••••••••"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="premium-input"
                    style={{ 
                      paddingRight: language === 'ar' ? '16px' : '44px',
                      paddingLeft: language === 'ar' ? '44px' : '16px'
                    }}
                    autoComplete={isSignUpMode ? "new-password" : "current-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    style={{
                      position: 'absolute',
                      right: language === 'ar' ? 'auto' : '16px',
                      left: language === 'ar' ? '16px' : 'auto',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      opacity: 0.8,
                      transition: 'all 0.2s ease',
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password strength meter - only on signup */}
                {isSignUpMode && password.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= pwdStrength.score ? pwdStrength.color : 'rgba(255,255,255,0.08)', transition: 'all 0.3s ease' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: pwdStrength.color, fontWeight: '600' }}>{pwdStrength.label}</span>
                    {isSignUpMode && (
                      <ul style={{ margin: '6px 0 0 0', padding: '0 0 0 16px', fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        <li style={{ color: password.length >= 8 ? '#22c55e' : 'inherit' }}>{language === 'ar' ? '8 أحرف على الأقل' : 'At least 8 characters'}</li>
                        <li style={{ color: /[A-Z]/.test(password) ? '#22c55e' : 'inherit' }}>{language === 'ar' ? 'حرف كبير واحد (A-Z)' : 'One uppercase letter (A-Z)'}</li>
                        <li style={{ color: /[0-9]/.test(password) ? '#22c55e' : 'inherit' }}>{language === 'ar' ? 'رقم واحد على الأقل (0-9)' : 'One number (0-9)'}</li>
                        <li style={{ color: /[^A-Za-z0-9]/.test(password) ? '#22c55e' : 'inherit' }}>{language === 'ar' ? 'رمز خاص مثل @#!' : 'Special character e.g. @#!'}</li>
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm password field - only on signup */}
              {isSignUpMode && (
                <div style={styles.formField}>
                  <label style={styles.fieldLabel}>{language === 'en' ? "Confirm Password" : "تأكيد كلمة المرور"}</label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="premium-input"
                      style={{ 
                        borderColor: confirmPassword && confirmPassword !== password ? '#ef4444' : confirmPassword && confirmPassword === password ? '#22c55e' : undefined,
                        paddingRight: language === 'ar' ? '16px' : '44px',
                        paddingLeft: language === 'ar' ? '44px' : '16px'
                      }}
                      autoComplete="new-password"
                    />
                  </div>
                  {confirmPassword.length > 0 && (
                    <span style={{ fontSize: '0.72rem', marginTop: '4px', color: confirmPassword === password ? '#22c55e' : '#ef4444', fontWeight: '600', display: 'block' }}>
                      {confirmPassword === password
                        ? (language === 'ar' ? '✓ كلمتا المرور متطابقتان' : '✓ Passwords match')
                        : (language === 'ar' ? '✗ كلمتا المرور غير متطابقتين' : '✗ Passwords do not match')}
                    </span>
                  )}
                </div>
              )}

              {/* Age + Privacy consent - required for Google AdSense */}
              {isSignUpMode && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <input
                      type="checkbox"
                      checked={ageConsent}
                      onChange={(e) => setAgeConsent(e.target.checked)}
                      style={{ marginTop: '2px', accentColor: 'var(--gold-primary)', width: '14px', height: '14px', flexShrink: 0 }}
                    />
                    <span>
                      {language === 'ar'
                        ? 'أؤكد أنني أتجاوز 13 عاماً من العمر وأوافق على استخدام خدمات الموقع'
                        : 'I confirm I am 13 years of age or older and agree to use this service'}
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <input
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      style={{ marginTop: '2px', accentColor: 'var(--gold-primary)', width: '14px', height: '14px', flexShrink: 0 }}
                    />
                    <span>
                      {language === 'ar' ? (
                        <>
                          أوافق على{' '}
                          <button type="button" onClick={() => setActivePage && setActivePage('legal')} style={{ background: 'none', border: 'none', color: 'var(--text-gold)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem', padding: 0 }}>سياسة الخصوصية</button>
                          {' '}و{' '}
                          <button type="button" onClick={() => setActivePage && setActivePage('legal')} style={{ background: 'none', border: 'none', color: 'var(--text-gold)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem', padding: 0 }}>شروط الخدمة</button>
                        </>
                      ) : (
                        <>
                          I agree to the{' '}
                          <button type="button" onClick={() => setActivePage && setActivePage('legal')} style={{ background: 'none', border: 'none', color: 'var(--text-gold)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem', padding: 0 }}>Privacy Policy</button>
                          {' '}and{' '}
                          <button type="button" onClick={() => setActivePage && setActivePage('legal')} style={{ background: 'none', border: 'none', color: 'var(--text-gold)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem', padding: 0 }}>Terms of Service</button>
                        </>
                      )}
                    </span>
                  </label>
                </div>
              )}

              <button type="submit" className="btn-primary" style={styles.submitBtn}>
                <Key size={14} />
                <span>{isSignUpMode ? t('authSignUpSubmit') : t('authSubmit')}</span>
              </button>
            </form>

            <button 
              onClick={() => { setIsSignUpMode(!isSignUpMode); setAuthError(""); setPassword(""); setConfirmPassword(""); setAgeConsent(false); setPrivacyConsent(false); }} 
              style={styles.toggleBtn}
            >
              {isSignUpMode ? t('authToggleToLogin') : t('authToggleToSignUp')}
            </button>
          </div>
        )
      ) : (
        // ================= PREMIUM MEMBERS / TEACHERS / ADMINS DASHBOARD =================
        <div style={styles.dashboardContainer} className="fade-in">
          
          {/* Welcome profile card */}
          <div style={styles.profileHeaderCard} className="glass-panel">
            <div className="islamic-pattern"></div>
            
            <div style={styles.profileInfoRow}>
              {/* Profile Avatar */}
              <div style={styles.avatarCircle}>
                <span style={styles.avatarBig}>{user.avatar}</span>
              </div>

              <div style={styles.profileMeta}>
                {isEditingProfile ? (
                  <div style={styles.editForm}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={styles.editNameInput}
                    />
                    
                    {/* Avatar picker */}
                    <div style={styles.avatarPicker}>
                      {avatarsList.map(av => (
                        <button 
                          key={av} 
                          onClick={() => setEditAvatar(av)}
                          style={{
                            ...styles.pickerEmoji,
                            border: editAvatar === av ? '2px solid var(--gold-primary)' : '1px solid transparent'
                          }}
                        >
                          {av}
                        </button>
                      ))}
                    </div>

                    <button onClick={handleSaveProfile} style={styles.saveProfileBtn} className="btn-primary">
                      <Check size={12} />
                      <span>{language === 'en' ? "Save" : "حفظ"}</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 style={styles.userName} className="gold-gradient-text">
                      {t('authWelcome')}, {user.name}
                    </h2>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                      <span style={styles.userRoleBadge}>{user.role}</span>
                      {user.teacherLevel && (
                        <span style={styles.teacherLevelBadge}>
                          🎓 {language === 'ar' ? `حافظ لـ ${user.teacherLevel} أجزاء` : `${user.teacherLevel} Juz' Memorizer`}
                        </span>
                      )}
                    </div>

                    <p style={styles.userEmail}>{user.email}</p>
                    <span style={styles.memberSince}>
                      {language === 'en' ? `Member since: ${user.memberSince}` : `عضو منذ: ${user.memberSince}`}
                    </span>
                    
                    <button onClick={() => setIsEditingProfile(true)} style={styles.editTriggerBtn}>
                      <Edit2 size={12} />
                      <span>{language === 'en' ? "Edit Profile" : "تعديل الملف"}</span>
                    </button>
                  </>
                )}
              </div>

              {/* Point highlights card */}
              <div style={styles.pointsBadgeCard} className="glass-panel">
                <Award size={24} color="var(--text-gold)" />
                <div>
                  <div style={styles.badgeCount}>{dailyScore} XP</div>
                  <div style={styles.badgeLabel}>{language === 'ar' ? "السكور اليومي" : "Daily Score"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Dashboard Navigation tabs */}
          <div style={styles.tabRow} className="glass-panel">
            <button 
              onClick={() => setActiveTab("my_recordings")} 
              style={{
                ...styles.tabBtn,
                color: activeTab === 'my_recordings' ? 'var(--text-gold)' : 'var(--text-secondary)',
                background: activeTab === 'my_recordings' ? 'rgba(212,175,55,0.08)' : 'transparent'
              }}
            >
              <Mic size={14} />
              <span>{language === 'ar' ? "تلاواتي الخاصة" : "My Recitations"}</span>
            </button>

            <button 
              onClick={() => setActiveTab("saved_bookmarks")} 
              style={{
                ...styles.tabBtn,
                color: activeTab === 'saved_bookmarks' ? 'var(--text-gold)' : 'var(--text-secondary)',
                background: activeTab === 'saved_bookmarks' ? 'rgba(212,175,55,0.08)' : 'transparent'
              }}
            >
              <Bookmark size={14} />
              <span>{language === 'ar' ? "العلامات المحفوظة" : "Bookmarks"}</span>
            </button>

            <button 
              onClick={() => setActiveTab("friend_requests")} 
              style={{
                ...styles.tabBtn,
                color: activeTab === 'friend_requests' ? 'var(--text-gold)' : 'var(--text-secondary)',
                background: activeTab === 'friend_requests' ? 'rgba(212,175,55,0.08)' : 'transparent'
              }}
            >
              <UserPlus size={14} />
              {friendRequestsReceived.length > 0 && (
                <span style={styles.reqCountBubble}>{friendRequestsReceived.length}</span>
              )}
              <span>{language === 'ar' ? "طلبات الصداقة" : "Friend Requests"}</span>
            </button>

            <button 
              onClick={() => setActiveTab("teacher_center")} 
              style={{
                ...styles.tabBtn,
                color: activeTab === 'teacher_center' ? 'var(--text-gold)' : 'var(--text-secondary)',
                background: activeTab === 'teacher_center' ? 'rgba(212,175,55,0.08)' : 'transparent'
              }}
            >
              <Award size={14} />
              <span>{language === 'ar' ? "مركز المعلمين" : "Teacher Center"}</span>
            </button>

            {user.role === "Admin" && (
              <button 
                onClick={() => setActiveTab("admin_portal")} 
                style={{
                  ...styles.tabBtn,
                  color: activeTab === 'admin_portal' ? 'var(--text-gold)' : 'var(--text-secondary)',
                  background: activeTab === 'admin_portal' ? 'rgba(212,175,55,0.08)' : 'transparent'
                }}
              >
                <Shield size={14} />
                <span>{language === 'ar' ? "لوحة التحكم للمسؤول" : "Admin Dashboard"}</span>
              </button>
            )}
          </div>

          {/* ================= TAB 1: USER RECITE SUBMISSIONS ================= */}
          {activeTab === "my_recordings" && (
            <div className="grid-2 fade-in" style={{ marginTop: '10px' }}>
              {mySubmissions.length > 0 ? (
                mySubmissions.map(sub => (
                  <div key={sub.id} style={styles.recitationCard} className="glass-panel">
                    <div style={styles.cardHeader}>
                      <div>
                        <strong style={{ color: 'var(--text-gold)', fontSize: '1.1rem' }}>
                          {language === 'ar' ? `سورة ${sub.surahNameAr || sub.surahName}` : `Surah ${sub.surahName}`}
                        </strong>
                        <div style={styles.cardMeta}>
                          Juz' {sub.juz || 30} • Verses {sub.ayahFrom} - {sub.ayahTo}
                        </div>
                        <span style={styles.cardDate}>{sub.date}</span>
                      </div>
                      <button 
                        onClick={() => deleteTasmeeSubmission(sub.id)} 
                        style={styles.removeBookmarkBtn}
                      >
                        ×
                      </button>
                    </div>

                    <div style={styles.playerSection}>
                      <span style={styles.audioLabel}>{language === 'ar' ? "تلاوتك المسجلة:" : "Your Recitation:"}</span>
                      <audio src={sub.audioData} controls style={styles.audioControl} />
                    </div>

                    <div style={{...styles.feedbackArea, borderColor: sub.rating ? 'var(--border-gold)' : 'rgba(255,255,255,0.05)'}} className="glass-panel">
                      {!sub.rating ? (
                        <div style={styles.pendingEval}>
                          <Loader size={16} className="spin-pulse" color="var(--text-gold)" style={{ marginRight: '6px' }} />
                          <span style={{color: 'var(--text-gold)', fontWeight: 'bold'}}>
                            {language === 'ar' ? "قيد التقييم من المعلم..." : "Recitation under review..."}
                          </span>
                        </div>
                      ) : (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span style={styles.evalLabel}>{language === 'ar' ? "تقييم المعلم المعتمد:" : "Certified Teacher Grading:"}</span>
                            <div style={styles.starsRow}>
                              {Array.from({length: 5}).map((_, idx) => (
                                <Star key={idx} size={12} color={idx < sub.rating ? "var(--text-gold)" : "var(--text-muted)"} fill={idx < sub.rating ? "var(--text-gold)" : "none"} />
                              ))}
                            </div>
                          </div>
                          <p style={styles.evalComment}>"{sub.comments}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{...styles.emptyNotice, gridColumn: '1 / -1'}} className="glass-panel">
                  <span>{language === 'ar' ? "لم تسجل أي تلاوة للتسميع بعد." : "No Tasmee recitations recorded yet."}</span>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: PERSONAL BOOKMARKS ================= */}
          {activeTab === "saved_bookmarks" && (
            <div className="grid-2 fade-in" style={{ marginTop: '10px' }}>
              <div style={styles.bookmarkPanel} className="glass-panel">
                <h4 style={styles.panelTitle}>{language === 'en' ? "Saved Quran Verses" : "الآيات المحفوظة"}</h4>
                <div style={styles.bookmarkList}>
                  {bookmarks.verses.length > 0 ? (
                    bookmarks.verses.map(v => (
                      <div key={v.id} style={styles.bookmarkItemRow} className="glass-panel">
                        <div style={{ flexGrow: 1 }}>
                          <strong style={{ color: 'var(--text-gold)' }}>{v.surahName} ({v.num})</strong>
                          <p style={styles.bookmarkAr} className="arabic-text">{v.ar}</p>
                        </div>
                        <button onClick={() => toggleBookmark('verses', v)} style={styles.removeBookmarkBtn}>×</button>
                      </div>
                    ))
                  ) : (
                    <div style={styles.emptyNotice}><span>{language === 'en' ? "No saved verses yet." : "لا توجد آيات محفوظة بعد."}</span></div>
                  )}
                </div>
              </div>

              <div style={styles.bookmarkPanel} className="glass-panel">
                <h4 style={styles.panelTitle}>{language === 'en' ? "Saved Articles" : "المقالات المحفوظة"}</h4>
                <div style={styles.bookmarkList}>
                  {bookmarks.articles.length > 0 ? (
                    bookmarks.articles.map(a => (
                      <div key={a.id} style={styles.bookmarkItemRow} className="glass-panel" onClick={() => setActivePage('articles')}>
                        <div style={{ flexGrow: 1 }}>
                          <strong style={{ color: 'var(--text-gold)' }}>{language === 'en' ? a.title : a.titleAr}</strong>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleBookmark('articles', a); }} style={styles.removeBookmarkBtn}>×</button>
                      </div>
                    ))
                  ) : (
                    <div style={styles.emptyNotice}><span>{language === 'en' ? "No saved articles yet." : "لا توجد مقالات محفوظة بعد."}</span></div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: FRIEND REQUEST SYSTEM UI ================= */}
          {activeTab === "friend_requests" && (
            <div style={styles.requestsPanel} className="glass-panel fade-in">
              <h3 style={styles.sectionTitle}>{language === 'ar' ? "طلبات الصداقة المعلقة" : "Pending Friend Requests"}</h3>
              
              <div style={styles.requestsList}>
                {friendRequestsReceived.length > 0 ? (
                  friendRequestsReceived.map(req => (
                    <div key={req.email} style={styles.reqRow} className="glass-panel">
                      <span style={styles.reqAvatar}>{req.avatar || "🧕"}</span>
                      <div style={{ flexGrow: 1 }}>
                        <div style={styles.reqName}>{req.name}</div>
                        <span style={styles.reqRole}>{req.role || "Premium Member"}</span>
                      </div>
                      
                      <div style={styles.reqActions}>
                        <button onClick={() => acceptFriendRequest(req)} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                          {language === 'ar' ? "قبول" : "Accept"}
                        </button>
                        <button onClick={() => declineFriendRequest(req)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                          {language === 'ar' ? "رفض" : "Decline"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={styles.emptyNotice}>
                    <span>{language === 'ar' ? "لا توجد طلبات صداقة واردة حالياً." : "No incoming friend requests pending."}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 4: TEACHER REGISTRATION & 30-QUESTION EXAM ================= */}
          {activeTab === "teacher_center" && (
            <div style={styles.examPanel} className="glass-panel fade-in">
              {!isExamActive && !examFinished ? (
                // 1. Initial Apply screen
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Award size={48} color="var(--text-gold)" style={{ alignSelf: 'center' }} />
                  <h3 style={styles.sectionTitle} className="gold-gradient-text">
                    {language === 'ar' ? "اعتماد معلمين القرآن الكريم الموثوقين" : "Certified Tajweed & Quran Recitation Exam"}
                  </h3>
                  
                  <p style={styles.examIntroText}>
                    {language === 'ar' 
                      ? "يتيح لك مركز المعلمين التقديم للحصول على رتبة 'معلم معتمد' لمراجعة وتصحيح تلاوات الطلاب الصوتية. الشروط: حفظ 5 أجزاء فأكثر، واجتياز اختبار التجويد التفاعلي المكون من 30 سؤالاً في زمن قدره 30 دقيقة بنسبة نجاح 80%."
                      : "Apply for 'Certified Teacher' status to review and correct student recitations. Requirements: Memorized 5+ Juz' and passing the 30-question interactive Tajweed exam in 30 minutes (80% score required)."}
                  </p>

                  <div style={{ ...styles.memorizeSelectorBox, maxWidth: '100%' }} className="glass-panel">
                    <label style={{ fontSize: '0.95rem', color: 'var(--text-gold)', fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>
                      {language === 'ar' ? "حدد أجزاء القرآن الكريم التي تحفظها بالضغط عليها (5 أجزاء كحد أدنى):" : "Select the Juz' you have memorized by tapping them (min 5 Juz'):"}
                    </label>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))',
                      gap: '8px',
                      marginTop: '12px',
                      padding: '10px',
                      maxHeight: '260px',
                      overflowY: 'auto',
                      background: 'rgba(0,0,0,0.15)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-gold)'
                    }}>
                      {Array.from({ length: 30 }).map((_, idx) => {
                        const juzNum = idx + 1;
                        const isSelected = selectedJuzList.includes(juzNum);
                        return (
                          <button
                            key={juzNum}
                            type="button"
                            onClick={() => {
                              setSelectedJuzList(prev => 
                                prev.includes(juzNum) 
                                  ? prev.filter(n => n !== juzNum) 
                                  : [...prev, juzNum]
                              );
                            }}
                            style={{
                              padding: '10px 4px',
                              borderRadius: '8px',
                              border: isSelected ? '1.5px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.06)',
                              background: isSelected ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.02)',
                              color: isSelected ? 'var(--text-gold)' : 'var(--text-secondary)',
                              fontWeight: '700',
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              textAlign: 'center',
                            }}
                          >
                            {language === 'ar' ? `جزء ${juzNum}` : `Juz' ${juzNum}`}
                          </button>
                        );
                      })}
                    </div>
                    
                    <div style={{ marginTop: '12px', fontSize: '0.88rem', color: selectedJuzList.length >= 5 ? '#22c55e' : '#ff6b6b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                      {selectedJuzList.length >= 5 ? <Check size={16} /> : <AlertCircle size={16} />}
                      <span>
                        {language === 'ar' 
                          ? `عدد الأجزاء المحددة: ${selectedJuzList.length} (مستوفٍ للشروط)`
                          : `Selected Parts: ${selectedJuzList.length} Juz' (Qualified)`}
                      </span>
                    </div>
                  </div>

                  {selectedJuzList.length >= 5 ? (
                    <button onClick={handleStartExam} className="btn-primary" style={styles.startExamBtn}>
                      <Play size={14} />
                      <span>{language === 'ar' ? "بدء الاختبار المعتمد (30 دقيقة)" : "Start Certification Exam"}</span>
                    </button>
                  ) : (
                    <div style={styles.examDeniedBox}>
                      <AlertCircle size={16} />
                      <span>
                        {language === 'ar' 
                          ? "عذراً، يجب اختيار 5 أجزاء أو أكثر لتتمكن من بدء اختبار المعلم المعتمد." 
                          : "Please select at least 5 Juz' to enable the certified teacher exam."}
                      </span>
                    </div>
                  )}
                </div>
              ) : isExamActive ? (
                // 2. Active Certification Quiz
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={styles.examHeader}>
                    <span style={styles.examTimer}>
                      <Clock size={14} style={{ marginRight: '6px' }} />
                      {language === 'ar' ? "الوقت المتبقي: " : "Time Left: "} {formatTime(examTimeLeft)}
                    </span>
                    <span style={styles.examProgress}>
                      {language === 'ar' ? "سؤال" : "Question"} {examCurrentQuestionIdx + 1} / 30
                    </span>
                  </div>

                  {/* Question body */}
                  <div style={styles.questionCard} className="glass-panel">
                    <h3 style={styles.questionTitle}>
                      {language === 'ar' 
                        ? certificationQuestions[examCurrentQuestionIdx].qAr 
                        : certificationQuestions[examCurrentQuestionIdx].q}
                    </h3>
                  </div>

                  {/* Answers row */}
                  <div style={styles.answersList}>
                    {certificationQuestions[examCurrentQuestionIdx].options.map((opt, oIdx) => {
                      const isSelected = examAnswers[examCurrentQuestionIdx] === oIdx;
                      return (
                        <button 
                          key={oIdx} 
                          onClick={() => handleSelectExamAnswer(examCurrentQuestionIdx, oIdx)}
                          style={{
                            ...styles.answerBtn,
                            borderColor: isSelected ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                            background: isSelected ? 'rgba(212,175,55,0.08)' : 'transparent',
                            flexDirection: language === 'ar' ? 'row-reverse' : 'row',
                            justifyContent: language === 'ar' ? 'flex-end' : 'flex-start',
                          }}
                          className="glass-panel"
                        >
                          <span style={styles.answerDot}>{oIdx + 1}.</span>
                          <span style={{ flexGrow: 1, textAlign: language === 'ar' ? 'right' : 'left' }}>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div style={styles.examActionsRow}>
                    <button 
                      onClick={() => setExamCurrentQuestionIdx(p => Math.max(0, p - 1))}
                      disabled={examCurrentQuestionIdx === 0}
                      className="btn-secondary"
                      style={{ flex: 1 }}
                    >
                      {language === 'ar' ? "السابق" : "Previous"}
                    </button>

                    {examCurrentQuestionIdx < 29 ? (
                      <button 
                        onClick={() => setExamCurrentQuestionIdx(p => Math.min(29, p + 1))}
                        className="btn-primary"
                        style={{ flex: 1 }}
                      >
                        {language === 'ar' ? "التالي" : "Next"}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleFinishExam(false)} 
                        className="btn-primary"
                        style={{ flex: 1, background: 'var(--gold-gradient)' }}
                      >
                        {language === 'ar' ? "تسجيل وإنهاء الاختبار" : "Submit Exam"}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                // 3. Quiz Complete / Results
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-in">
                  <CheckCircle2 size={48} color={examScore >= 24 ? "var(--text-gold)" : "#ff6b6b"} style={{ alignSelf: 'center' }} />
                  
                  <h3 style={styles.sectionTitle} className="gold-gradient-text">
                    {examScore >= 24 
                      ? (language === 'ar' ? "✨ مبارك! لقد اجتزت الاختبار بنجاح ✨" : "✨ Congratulations! You Passed! ✨")
                      : (language === 'ar' ? "عذراً، لم تجتز الاختبار هذه المرة" : "Exam Not Passed")}
                  </h3>

                  <div style={styles.examScoreCard} className="glass-panel">
                    <span style={styles.scoreVal}>{examScore} / 30</span>
                    <p style={styles.scoreLabel}>
                      {language === 'ar' ? `نسبتك: ${Math.round((examScore / 30) * 100)}% (المطلوب 80% للتأهيل)` : `Your Score: ${Math.round((examScore / 30) * 100)}% (80% required)`}
                    </p>
                  </div>

                  {examScore >= 24 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {language === 'ar' 
                          ? "تمت ترقيتك رسمياً لرتبة 'معلم معتمد'. يمكنك الآن تقديم تلاوات وتصحيحها والحصول على شارات خاصة بجوار اسمك!"
                          : "You have been upgraded to 'Certified Teacher'. You can now evaluate and correct student recitations!"}
                      </p>
                      <button onClick={() => { setExamFinished(false); setActiveTab("my_recordings"); }} className="btn-primary" style={{ alignSelf: 'center', marginTop: '10px' }}>
                        {language === 'ar' ? "الذهاب للوحة التحكم" : "Go to Dashboard"}
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {language === 'ar' 
                          ? "لا تقلق! يمكنك مراجعة أحكام التجويد ومخارج الحروف والمحاولة مجدداً في أي وقت."
                          : "Don't worry! Review the Tajweed rules and try again anytime."}
                      </p>
                      <button onClick={handleStartExam} className="btn-primary" style={{ alignSelf: 'center', marginTop: '10px' }}>
                        {language === 'ar' ? "إعادة خوض الاختبار" : "Retry Exam"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 5: ADMIN PORTAL SECTION ================= */}
          {activeTab === "admin_portal" && user.role === "Admin" && (
            <div style={styles.adminPanel} className="glass-panel fade-in">
              
              {/* Role Switcher Toggle */}
              <div style={styles.adminCardHeader} className="glass-panel">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={18} color="var(--text-gold)" />
                  <h4 style={styles.adminCardTitle}>{language === 'ar' ? "مبدل الأدوار السريع للمسؤول" : "Admin Quick Role Switcher"}</h4>
                </div>

                <div style={styles.adminRoleRow}>
                  <button 
                    onClick={() => { updateUserRole("Admin"); setActiveAdminRole("Admin"); }}
                    style={{
                      ...styles.roleSwitchBtn,
                      background: activeAdminRole === "Admin" ? 'var(--gold-gradient)' : 'transparent',
                      color: activeAdminRole === "Admin" ? '#000' : 'var(--text-primary)'
                    }}
                  >
                    Admin
                  </button>
                  <button 
                    onClick={() => { updateUserRole("Certified Teacher", "15"); setActiveAdminRole("Certified Teacher"); }}
                    style={{
                      ...styles.roleSwitchBtn,
                      background: activeAdminRole === "Certified Teacher" ? 'var(--gold-gradient)' : 'transparent',
                      color: activeAdminRole === "Certified Teacher" ? '#000' : 'var(--text-primary)'
                    }}
                  >
                    Teacher
                  </button>
                  <button 
                    onClick={() => { updateUserRole("Premium Member"); setActiveAdminRole("Premium Member"); }}
                    style={{
                      ...styles.roleSwitchBtn,
                      background: activeAdminRole === "Premium Member" ? 'var(--gold-gradient)' : 'transparent',
                      color: activeAdminRole === "Premium Member" ? '#000' : 'var(--text-primary)'
                    }}
                  >
                    User
                  </button>
                </div>
              </div>

              {/* Bot Activity Frequency Slider Controller */}
              <div style={styles.botSettingsCard} className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ ...styles.adminCardTitle, margin: 0 }}>
                    {language === 'ar' ? "التحكم في نشاط المستخدمين الوهميين (Bots)" : "Simulated Active Worshippers Controls"}
                  </h4>
                  
                  <button 
                    onClick={() => setBotSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                    className="btn-primary"
                    style={{
                      padding: '6px 14px', 
                      fontSize: '0.78rem',
                      background: botSettings.enabled ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.05)',
                      color: botSettings.enabled ? '#000' : 'var(--text-primary)'
                    }}
                  >
                    {botSettings.enabled ? (language === 'ar' ? "إيقاف التشغيل" : "Disable Bots") : (language === 'ar' ? "تمكين النشاط" : "Enable Bots")}
                  </button>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-gold)', display: 'block', marginBottom: '8px' }}>
                    {language === 'ar' ? `سرعة وتيرة نشاط الروبوتات: كل ${botSettings.frequency / 1000} ثوانٍ` : `Bot Event Scheduler frequency: Every ${botSettings.frequency / 1000}s`}
                  </label>
                  <input 
                    type="range"
                    min={3000} 
                    max={20000} 
                    step={1000}
                    value={botSettings.frequency}
                    onChange={(e) => setBotSettings(prev => ({ ...prev, frequency: parseInt(e.target.value, 10) }))}
                    style={styles.adminRangeSlider}
                  />
                </div>
              </div>

              {/* Leaderboard panel */}
              <div style={styles.leaderboardCard} className="glass-panel">
                <h4 style={styles.adminCardTitle}>{language === 'ar' ? "جدول المتصدرين والنقاط اليومية" : "Daily Score Leaderboard"}</h4>
                
                <div style={styles.leaderboardTable}>
                  <div style={styles.tableRowHeader}>
                    <span>{language === 'ar' ? "المستخدم" : "Worshipper"}</span>
                    <span>{language === 'ar' ? "الرتبة" : "Role"}</span>
                    <span>{language === 'ar' ? "النقاط" : "Daily Score"}</span>
                  </div>

                  <div style={styles.tableBody}>
                    <div style={styles.tableRowItem}>
                      <strong>⭐ Sally Ali (You)</strong>
                      <span>{user.role}</span>
                      <strong style={{ color: 'var(--text-gold)' }}>{dailyScore} XP</strong>
                    </div>
                    {mockBots.slice(0, 4).map((bot, idx) => (
                      <div key={idx} style={styles.tableRowItem}>
                        <span>{bot.name}</span>
                        <span>{bot.role}</span>
                        <span>{idx === 0 ? 340 : (idx === 1 ? 210 : 150)} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Admin/Teacher Article publisher form */}
              <div style={styles.articlePublisherCard} className="glass-panel">
                <h4 style={styles.adminCardTitle}>{language === 'ar' ? "كتابة ونشر مقال إسلامي جديد" : "Publish Premium Islamic Article"}</h4>
                
                {artPublishSuccess && (
                  <div style={styles.successPubBanner}>
                    <span>✨ {language === 'ar' ? "تم نشر المقال بنجاح في المنصة الرئيسية!" : "Article published successfully to global Feed!"} ✨</span>
                  </div>
                )}

                <form onSubmit={handlePublishArticle} style={styles.pubForm}>
                  <div style={styles.pubRow}>
                    <div style={styles.formGroup} className="flex-1">
                      <label style={styles.formLabel}>Title (English)</label>
                      <input 
                        type="text" 
                        required 
                        value={newArtTitle} 
                        onChange={(e) => setNewArtTitle(e.target.value)}
                        placeholder="Article title..."
                        style={styles.pubInput}
                      />
                    </div>
                    <div style={styles.formGroup} className="flex-1">
                      <label style={styles.formLabel}>العنوان (عربي)</label>
                      <input 
                        type="text" 
                        required 
                        value={newArtTitleAr} 
                        onChange={(e) => setNewArtTitleAr(e.target.value)}
                        placeholder="عنوان المقال..."
                        style={styles.pubInput}
                      />
                    </div>
                  </div>

                  <div style={styles.pubRow}>
                    <div style={styles.formGroup} className="flex-1">
                      <label style={styles.formLabel}>Category</label>
                      <select 
                        value={newArtCategory} 
                        onChange={(e) => setNewArtCategory(e.target.value)}
                        style={styles.pubSelect}
                      >
                        <option value="Faith">Faith (إيمانيات)</option>
                        <option value="Tafsir">Tafsir (تفسير)</option>
                        <option value="Arabic Learning">Arabic Learning (تعلم العربية)</option>
                      </select>
                    </div>

                    <div style={styles.formGroup} className="flex-1">
                      <label style={styles.formLabel}>Read Time (Minutes)</label>
                      <input 
                        type="number" 
                        min={1} 
                        required
                        value={newArtReadTime} 
                        onChange={(e) => setNewArtReadTime(e.target.value)}
                        style={styles.pubInput}
                      />
                    </div>
                  </div>

                  <div style={styles.pubRow}>
                    <div style={styles.formGroup} className="flex-1">
                      <label style={styles.formLabel}>Summary Description (English)</label>
                      <input 
                        type="text" 
                        required 
                        value={newArtSummary} 
                        onChange={(e) => setNewArtSummary(e.target.value)}
                        placeholder="Brief summary..."
                        style={styles.pubInput}
                      />
                    </div>
                    <div style={styles.formGroup} className="flex-1">
                      <label style={styles.formLabel}>الوصف والملخص (عربي)</label>
                      <input 
                        type="text" 
                        required 
                        value={newArtSummaryAr} 
                        onChange={(e) => setNewArtSummaryAr(e.target.value)}
                        placeholder="ملخص قصير..."
                        style={styles.pubInput}
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Main Content (English)</label>
                    <textarea 
                      required 
                      value={newArtContent} 
                      onChange={(e) => setNewArtContent(e.target.value)}
                      placeholder="Write article details here..."
                      style={styles.pubTextArea}
                      rows={5}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>المحتوى الرئيسي (عربي)</label>
                    <textarea 
                      required 
                      value={newArtContentAr} 
                      onChange={(e) => setNewArtContentAr(e.target.value)}
                      placeholder="اكتب تفاصيل المقال هنا..."
                      style={styles.pubTextArea}
                      rows={5}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '12px', justifyContent: 'center' }}>
                    <Send size={14} />
                    <span>{language === 'ar' ? "نشر المقال الفوري" : "Publish Article"}</span>
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* Logout Action */}
          <button onClick={logout} style={styles.logoutBtn} className="btn-secondary">
            <span>{t('navLogout')}</span>
          </button>

        </div>
      )}

    </div>
  );
}

const styles = {
  authContainer: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '40px 30px',
    borderRadius: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  authHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '30px',
  },
  authIcon: {
    marginBottom: '10px',
    filter: 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.4))',
  },
  authTitle: {
    fontSize: '1.8rem',
    color: 'var(--text-primary)',
  },
  authSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '6px',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    background: 'rgba(255, 107, 107, 0.05)',
    border: '1px solid rgba(255, 107, 107, 0.2)',
    borderRadius: '10px',
    color: '#ff6b6b',
    fontSize: '0.85rem',
    marginBottom: '20px',
  },
  authForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fieldLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  formInput: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
  },
  passHint: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    marginTop: '2px',
  },
  submitBtn: {
    marginTop: '10px',
    justifyContent: 'center',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-gold)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    marginTop: '20px',
    width: '100%',
    textAlign: 'center',
    fontWeight: '600',
  },
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  profileHeaderCard: {
    position: 'relative',
    padding: '40px 30px',
    borderRadius: '24px',
    overflow: 'hidden',
  },
  profileInfoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    flexWrap: 'wrap',
  },
  avatarCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(255, 255, 255, 0.02) 80%)',
    border: '3px solid var(--gold-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-gold-intense)',
  },
  avatarBig: {
    fontSize: '3.5rem',
  },
  profileMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flexGrow: 1,
  },
  userName: {
    fontSize: '2rem',
    fontWeight: '700',
  },
  userRoleBadge: {
    alignSelf: 'flex-start',
    background: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid var(--border-gold)',
    color: 'var(--text-gold)',
    fontSize: '0.75rem',
    padding: '3px 10px',
    borderRadius: '20px',
    fontWeight: '600',
  },
  teacherLevelBadge: {
    alignSelf: 'flex-start',
    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
    border: '1px solid var(--gold-primary)',
    color: 'var(--text-gold)',
    boxShadow: '0 0 10px rgba(212, 175, 55, 0.15)',
    fontSize: '0.78rem',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: '700',
  },
  userEmail: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginTop: '6px',
  },
  memberSince: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  editTriggerBtn: {
    alignSelf: 'flex-start',
    background: 'none',
    border: 'none',
    color: 'var(--text-gold)',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '12px',
  },
  pointsBadgeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px 24px',
    borderRadius: '16px',
    background: 'rgba(212, 175, 55, 0.05)',
  },
  badgeCount: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: 'var(--text-gold)',
    lineHeight: '1.1',
  },
  badgeLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '320px',
  },
  editNameInput: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-gold)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
  },
  avatarPicker: {
    display: 'flex',
    gap: '8px',
  },
  pickerEmoji: {
    fontSize: '1.25rem',
    background: 'none',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveProfileBtn: {
    alignSelf: 'flex-start',
    padding: '6px 14px',
    fontSize: '0.8rem',
  },
  tabRow: {
    display: 'flex',
    gap: '10px',
    padding: '8px',
    borderRadius: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  reqCountBubble: {
    background: '#ff6b6b',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '2px',
    right: '2px',
  },
  recitationCard: {
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardMeta: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  cardDate: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
  },
  playerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  audioLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  audioControl: {
    width: '100%',
    height: '40px',
    borderRadius: '8px',
    outline: 'none',
  },
  feedbackArea: {
    padding: '14px',
    borderRadius: '12px',
    border: '1px dashed',
    marginTop: '6px',
  },
  pendingEval: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
  },
  evalLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-gold)',
    fontWeight: '700',
  },
  starsRow: {
    display: 'flex',
    gap: '3px',
  },
  evalComment: {
    fontSize: '0.88rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
    fontStyle: 'italic',
    marginTop: '4px',
  },
  removeBookmarkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '1.4rem',
    cursor: 'pointer',
  },
  bookmarkPanel: {
    padding: '20px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  panelTitle: {
    fontSize: '1.1rem',
    color: 'var(--text-gold)',
    fontWeight: '700',
  },
  bookmarkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  bookmarkItemRow: {
    padding: '14px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookmarkAr: {
    fontSize: '1.2rem',
    color: 'var(--text-gold)',
    textAlign: 'right',
    marginTop: '4px',
  },
  emptyNotice: {
    padding: '30px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
  requestsPanel: {
    padding: '30px 24px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  reqRow: {
    padding: '14px 20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  reqAvatar: {
    fontSize: '1.6rem',
    width: '40px',
    height: '40px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqName: {
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  reqRole: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  reqActions: {
    display: 'flex',
    gap: '10px',
  },
  examPanel: {
    padding: '40px 30px',
    borderRadius: '24px',
  },
  examIntroText: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    maxWidth: '650px',
    margin: '0 auto',
  },
  memorizeSelectorBox: {
    padding: '20px',
    borderRadius: '16px',
    maxWidth: '450px',
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  memorizeSelect: {
    background: '#0f111a',
    border: '1px solid var(--border-gold)',
    borderRadius: '8px',
    padding: '10px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
  },
  startExamBtn: {
    padding: '14px 30px',
    fontSize: '1rem',
    alignSelf: 'center',
  },
  examDeniedBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    color: '#ff6b6b',
    fontSize: '0.88rem',
    background: 'rgba(255, 107, 107, 0.05)',
    border: '1px solid rgba(255, 107, 107, 0.2)',
    borderRadius: '12px',
    padding: '12px',
    maxWidth: '550px',
    margin: '20px auto 0 auto',
  },
  examHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '14px',
  },
  examTimer: {
    fontSize: '0.9rem',
    color: '#ff6b6b',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  examProgress: {
    fontSize: '0.9rem',
    color: 'var(--text-gold)',
    fontWeight: 'bold',
  },
  questionCard: {
    padding: '30px 24px',
    borderRadius: '16px',
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  questionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    lineHeight: '1.5',
  },
  answersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  answerBtn: {
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1.5px solid',
    cursor: 'pointer',
    display: 'flex',
    gap: '12px',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    width: '100%',
    color: 'var(--text-primary)',
    alignItems: 'center',
  },
  answerDot: {
    color: 'var(--text-gold)',
    fontWeight: 'bold',
  },
  examActionsRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  },
  examScoreCard: {
    padding: '30px 20px',
    borderRadius: '20px',
    maxWidth: '300px',
    margin: '20px auto',
    background: 'rgba(212,175,55,0.05)',
  },
  scoreVal: {
    fontSize: '3.6rem',
    fontWeight: '900',
    color: 'var(--text-gold)',
    display: 'block',
    lineHeight: '1.1',
  },
  scoreLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '6px',
  },
  adminPanel: {
    padding: '30px 24px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  adminCardHeader: {
    padding: '20px',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  adminCardTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
  },
  adminRoleRow: {
    display: 'flex',
    gap: '8px',
  },
  roleSwitchBtn: {
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border-gold)',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  botSettingsCard: {
    padding: '20px',
    borderRadius: '16px',
  },
  adminRangeSlider: {
    width: '100%',
    accentColor: 'var(--gold-primary)',
    cursor: 'pointer',
  },
  leaderboardCard: {
    padding: '20px',
    borderRadius: '16px',
  },
  leaderboardTable: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
  },
  tableRowHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    padding: '10px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: 'bold',
  },
  tableBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableRowItem: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    padding: '12px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.02)',
    fontSize: '0.85rem',
  },
  articlePublisherCard: {
    padding: '20px',
    borderRadius: '16px',
  },
  pubForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '12px',
  },
  pubRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  pubInput: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: '0.88rem',
    outline: 'none',
  },
  pubSelect: {
    background: '#0f111a',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: '0.88rem',
    outline: 'none',
    cursor: 'pointer',
  },
  pubTextArea: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: '0.88rem',
    outline: 'none',
    resize: 'none',
    fontFamily: 'inherit',
  },
  successPubBanner: {
    padding: '10px',
    background: 'rgba(212,175,55,0.08)',
    border: '1px solid var(--border-gold)',
    borderRadius: '8px',
    textAlign: 'center',
    color: 'var(--text-gold)',
    fontWeight: 'bold',
    fontSize: '0.85rem',
  },
  logoutBtn: {
    alignSelf: 'flex-start',
    marginTop: '10px',
  }
};
