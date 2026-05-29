import React, { useState, useEffect, useRef } from 'react';
import { useApp, mockBots } from '../context/AppContext';
import { 
  ShieldAlert, LogIn, UserPlus, Key, Award, Bookmark, Edit2, Check, 
  ArrowRight, User, Mic, Star, Heart, UserMinus, Volume2, Loader, 
  Clock, Plus, Shield, Settings, AlertCircle, BookOpen, Trash2, Send, CheckCircle2, Play,
  Eye, EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Rigorous 30 Tajweed and Quran Memorization Questions
const certificationQuestions = [
  { q: "What rule applies when Noon Sakinah is followed by the letter Ba (ب)?", qAr: "ما هو الحكم التجويدي عند وقوع حرف الباء (ب) بعد النون الساكنة أو التنوين؟", options: ["Izhar (إظهار)", "Idgham (إدغام)", "Iqlab (إقلاب)", "Ikhfa (إخفاء)"], correctIndex: 2 },
  { q: "How many throat letters are there in the rules of Izhar Halqi?", qAr: "كم عدد حروف الحلق الخاصة بحكم الإظهار الحلقي؟", options: ["4", "6", "8", "5"], correctIndex: 1 },
  { q: "Which of the following is NOT a letter of Qalqalah?", qAr: "أي من الحروف التالية ليس من حروف القلقلة (قطب جد)؟", options: ["ق", "ط", "ب", "س"], correctIndex: 3 },
  { q: "What is the length of Madd Muttasil (Connected Lengthening) by Hafs standard?", qAr: "ما هو مقدار مد المد المتصل عند حفص عن عاصم من طريق الشاطبية؟", options: ["2 counts (حركتان)", "4 or 5 counts (4 أو 5 حركات)", "6 counts (6 حركات)", "No Madd (لا يوجد مد)"], correctIndex: 1 },
  { q: "What rule applies when Meem Sakinah is followed by another Meem (م)?", qAr: "ما هو الحكم عند وقوع حرف الميم (م) بعد الميم الساكنة؟", options: ["Ikhfa Shafawi (إخفاء شفوي)", "Idgham Shafawi / Mithlayn (إدغام متماثلين)", "Izhar Shafawi (إظهار شفوي)", "Iqlab (إقلاب)"], correctIndex: 1 },
  { q: "What is the makhraj (articulation point) of the letter Jeem (ج)?", qAr: "ما هو مخرج حرف الجيم (ج) الرئيسي؟", options: ["Throat (الحلق)", "Lips (الشفتان)", "Middle of Tongue (وسط اللسان)", "Tip of Tongue (طرف اللسان)"], correctIndex: 2 },
  { q: "Which letters are characterized by Hams (Whispering)?", qAr: "أي من الحروف التالية تتصف بصفة الهمس (فحثه شخص سكت)؟", options: ["ف، ح، ث", "أ، ب، ج", "ط، ق، د", "م، ن، ل"], correctIndex: 0 },
  { q: "What is the rule of Madd Lazim (Compulsory Madd) length?", qAr: "ما هو مقدار مد المد اللازم كلمي أو حرفي في القرآن؟", options: ["2 counts (حركتان)", "4 counts (4 حركات)", "6 counts (6 حركات)", "8 counts (8 حركات)"], correctIndex: 2 },
  { q: "What rule applies to Noon Sakinah in the word 'Yanyaoon' (يَنْأَوْنَ)?", qAr: "ما هو حكم النون الساكنة في كلمة (يَنْأَوْنَ)؟", options: ["Idgham (إدغام)", "Izhar (إظهار)", "Ikhfa (إخفاء)", "Iqlab (إقلاب)"], correctIndex: 1 },
  { q: "How many counts are there in Madd Arid Lissukoon (Temporary Madd)?", qAr: "ما هي الحركات الجائزة في المد العارض للسكون؟", options: ["2, 4, or 6 counts (حركتان أو 4 أو 6)", "Only 2 counts (حركتان فقط)", "Only 6 counts (6 حركات فقط)", "Only 5 counts (5 حركات)"], correctIndex: 0 },
  { q: "What letters are pronounced with Tafkheem (Heavy/Fat voice)?", qAr: "ما هي الحروف التي تفخم دائماً في التلاوة (خص ضغط قظ)؟", options: ["خ، ص، ض، غ، ط، ق، ظ", "أ، ب، ت، ث، ج، ح، خ", "ك، ل، م، ن، هـ، و، ي", "ر، ز، س، ش، ع، ف، ق"], correctIndex: 0 },
  { q: "What is the makhraj of the letter Daad (ض)?", qAr: "ما هو المخرج الدقيق لحرف الضاد (ض)؟", options: ["Sides of the Tongue (إحدى حافتي اللسان)", "Throat (أقصى الحلق)", "Lips (بين الشفتين)", "Tip of Tongue (رأس اللسان)"], correctIndex: 0 },
  { q: "What rule applies when Meem Sakinah is followed by the letter Ba (ب)?", qAr: "ما هو الحكم التجويدي عند وقوع حرف الباء (ب) بعد الميم الساكنة؟", options: ["Ikhfa Shafawi (إخفاء شفوي)", "Idgham Shafawi (إدغام شفوي)", "Izhar Shafawi (إظهار شفوي)", "Iqlab (إقلاب)"], correctIndex: 0 },
  { q: "What is the rule of the letter Ra (ر) when it has a Kasrah (رِ)?", qAr: "ما هو حكم حرف الراء (ر) إذا كانت مكسورة (رِ)؟", options: ["Tafkheem (تفخيم)", "Tarqeeq (ترقيق)", "Both allowed (جواز الوجهين)", "Depends on previous letter"], correctIndex: 1 },
  { q: "Which Surah is also known as the Mother of the Book (Umm al-Kitab)?", qAr: "أي سورة في القرآن الكريم تلقب بأم الكتاب؟", options: ["Al-Baqarah (البقرة)", "Al-Ikhlas (الإخلاص)", "Al-Fatiha (الفاتحة)", "Yaseen (يس)"], correctIndex: 2 },
  { q: "What rule applies when Noon Sakinah is followed by the letters of 'Yarmaloon' (يرملون)?", qAr: "ما هو حكم النون الساكنة أو التنوين إذا وقع بعدها أحد حروف (يرملون)؟", options: ["Idgham (إدغام)", "Izhar (إظهار)", "Ikhfa (إخفاء)", "Iqlab (إقلاب)"], correctIndex: 0 },
  { q: "What is the definition of Ikhfa in Tajweed standards?", qAr: "ما هو التعريف الدقيق لحكم الإخفاء في التجويد؟", options: ["Pronouncing without Ghunnah", "Blending letters fully", "Pronunciation between Izhar and Idgham with Ghunnah (النطق بصفة بين الإظهار والإدغام مع الغنة)", "Changing Meem to Ba"], correctIndex: 2 },
  { q: "How many verses are there in Surah Al-Mulk?", qAr: "كم عدد آيات سورة الملك الكريمة؟", options: ["25", "30", "35", "40"], correctIndex: 1 },
  { q: "What is the rule of Ghunnah length for Noon and Meem Mushaddadah (نّ، مّ)?", qAr: "ما هو مقدار غنة النون والميم المشددتين (نّ ، مّ)؟", options: ["1 count (حركة واحدة)", "2 counts (حركتان)", "3 counts (3 حركات)", "4 counts (4 حركات)"], correctIndex: 1 },
  { q: "Which Madd applies to 'Ha-Meem' (حم) at the beginning of Surah Ghafir?", qAr: "ما هو نوع المد في فواتح السور الكريمة مثل (حم)؟", options: ["Madd Lazim Harfi (مد لازم حرفي مخفف/مثقل)", "Madd Muttasil", "Madd Munfasil", "Madd Tamkeen"], correctIndex: 0 },
  { q: "What is the rule of Ra (ر) when it is Sakinah preceded by a Fathah?", qAr: "ما هو حكم الراء (ر) الساكنة إذا سبقت بفتح؟", options: ["Tafkheem (تفخيم)", "Tarqeeq (ترقيق)", "Depends on the following letter", "No rule"], correctIndex: 0 },
  { q: "What is the makhraj of the letter Qaaf (ق)?", qAr: "ما هو مخرج حرف القاف (ق)؟", options: ["Deep throat", "Back of the Tongue (أقصى اللسان فوق)", "Middle of Tongue", "Lips"], correctIndex: 1 },
  { q: "Which characteristic is the opposite of Jahr (Vocal Loudness)?", qAr: "ما هي الصفة المقابلة لصفة الجهر في تجويد الحروف؟", options: ["Hams (الهمس)", "Shiddah (الشدة)", "Rikhawah", "Qalqalah"], correctIndex: 0 },
  { q: "What type of Madd is 'Madd Leen' (Soft Madd)?", qAr: "ما هو المد الذي ينشأ عند وقف الكلمة ويكون ما قبل آخرها واو أو ياء ساكنة مفتوح ما قبلهما؟", options: ["Madd Leen (مد اللين)", "Madd Muttasil", "Madd Munfasil", "Madd Lazim"], correctIndex: 0 },
  { q: "What rule applies to Meem Sakinah when followed by the letter Fa (ف)?", qAr: "ما هو الحكم التجويدي للميم الساكنة عند وقوع حرف الفاء (ف) بعدها مباشرة؟", options: ["Severe Izhar Shafawi (إظهار شفوي شديد الحذر)", "Ikhfa Shafawi", "Idgham Shafawi", "Iqlab"], correctIndex: 0 },
  { q: "What is the main makhraj of the letters Ba, Meem, and Waw (ب، م، و)?", qAr: "ما هو المخرج الرئيسي الجامع لحروف الباء والميم والواو غير المدية؟", options: ["Lips (الشفتان)", "Tongue", "Throat", "Nose"], correctIndex: 0 },
  { q: "What is the rule of Madd Tamkeen (Madd of Empowerment)?", qAr: "ما هو المد المطبق في تلاوة الحروف عند التقاء ياء مشددة مكسورة مع ياء ساكنة؟", options: ["Madd Tamkeen (مد التمكين)", "Madd Muttasil", "Madd Munfasil", "Madd Leen"], correctIndex: 0 },
  { q: "How many letters are in the Ikhfa category?", qAr: "كم عدد حروف حكم الإخفاء الحقيقي للنون الساكنة والتنوين؟", options: ["10", "15", "20", "6"], correctIndex: 1 },
  { q: "Which Surah does NOT start with Basmalah?", qAr: "ما هي السورة الكريمة الوحيدة في القرآن التي لا تبدأ بالبسملة؟", options: ["Surah At-Tawbah (سورة التوبة)", "Surah Al-Kahf", "Surah Yaseen", "Surah Al-Mulk"], correctIndex: 0 },
  { q: "What is the rule of Noon Sakinah in the word 'Dunya' (دُنْيَا)?", qAr: "ما هو الحكم الاستثنائي التجويدي للنون الساكنة في كلمة (دُنْيَا)؟", options: ["Mutlaq Izhar (إظهار مطلق لتجنب توهم الاشتقاق)", "Idgham", "Ikhfa", "Iqlab"], correctIndex: 0 }
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
  const [memorizedJuzCount, setMemorizedJuzCount] = useState(5);
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
      // Award badges dynamically depending on parts memorized
      let levelBadge = "Bronze";
      if (memorizedJuzCount >= 30) levelBadge = "Platinum";
      else if (memorizedJuzCount >= 21) levelBadge = "Gold";
      else if (memorizedJuzCount >= 11) levelBadge = "Silver";

      updateUserRole("Certified Teacher", levelBadge);
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
              <label style={styles.fieldLabel}>{t('authPass')}</label>
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

              {!isSignUpMode && (
                <span style={styles.passHint}>
                  {language === 'en' ? "Demo Admin: sally@arabicmuslim.com / Bismillah1!" : "دخول المسؤول: sally@arabicmuslim.com / Bismillah1!"}
                </span>
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
                        <span style={styles.teacherLevelBadge}>🎓 {user.teacherLevel} Teacher</span>
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

                  <div style={styles.memorizeSelectorBox} className="glass-panel">
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-gold)', fontWeight: 'bold' }}>
                      {language === 'ar' ? "ما هو عدد أجزاء القرآن التي تحفظها حالياً؟" : "How many Juz' have you memorized?"}
                    </label>
                    <select 
                      value={memorizedJuzCount} 
                      onChange={(e) => setMemorizedJuzCount(parseInt(e.target.value, 10))}
                      style={styles.memorizeSelect}
                    >
                      <option value={2}>{language === 'ar' ? "جزءان (2)" : "2 Juz'"}</option>
                      <option value={5}>{language === 'ar' ? "خمسة أجزاء (5)" : "5 Juz'"}</option>
                      <option value={10}>{language === 'ar' ? "عشرة أجزاء (10)" : "10 Juz'"}</option>
                      <option value={20}>{language === 'ar' ? "عشرون جزءاً (20)" : "20 Juz'"}</option>
                      <option value={30}>{language === 'ar' ? "القرآن كاملاً (30)" : "Whole Quran (30)"}</option>
                    </select>
                  </div>

                  {memorizedJuzCount >= 5 ? (
                    <button onClick={handleStartExam} className="btn-primary" style={styles.startExamBtn}>
                      <Play size={14} />
                      <span>{language === 'ar' ? "بدء الاختبار المعتمد (30 دقيقة)" : "Start Certification Exam"}</span>
                    </button>
                  ) : (
                    <div style={styles.examDeniedBox}>
                      <AlertCircle size={16} />
                      <span>
                        {language === 'ar' 
                          ? "عذراً، يجب أن تكون حافظاً لـ 5 أجزاء أو أكثر لتتمكن من خوض اختبار الأحقية." 
                          : "You must memorize at least 5 Juz' to qualify for the certification test."}
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
                            background: isSelected ? 'rgba(212,175,55,0.08)' : 'transparent'
                          }}
                          className="glass-panel"
                        >
                          <span style={styles.answerDot}>{oIdx + 1}.</span>
                          <span>{opt}</span>
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
                    onClick={() => { updateUserRole("Certified Teacher", "Gold"); setActiveAdminRole("Certified Teacher"); }}
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
    background: 'rgba(255, 107, 107, 0.1)',
    border: '1px solid rgba(255, 107, 107, 0.2)',
    color: '#ff6b6b',
    fontSize: '0.75rem',
    padding: '3px 10px',
    borderRadius: '20px',
    fontWeight: '600',
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
    textAlign: 'right',
    cursor: 'pointer',
    display: 'flex',
    gap: '12px',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    width: '100%',
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
