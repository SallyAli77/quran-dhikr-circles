import React, { useState, useEffect, useRef } from 'react';
import { useApp, mockBots } from '../context/AppContext';
import { 
  Users, Sparkles, UserPlus, UserMinus, Crown, Play, Square, Loader, 
  Mic, Heart, RefreshCw, Send, Settings, Book, Compass, Award, 
  ChevronLeft, Palette, CheckCircle2, Volume2, HelpCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Community() {
  const {
    language,
    isAuthenticated,
    user,
    onlineCircles,
    joinCircle,
    createCircle,
    updateCircleTurn,
    updateCircleDhikr,
    incrementCircleProgress,
    tasbihCount,
    setTasbihCount,
    addDailyScorePoints,
    completeDailyGoal,
    botSettings,
    t
  } = useApp();

  // Active circle live session tracking states
  const [activeSessionCircleId, setActiveSessionCircleId] = useState(null);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionScoreAwarded, setSessionScoreAwarded] = useState(false);
  
  // Turn states inside live session
  const [isMicActive, setIsMicActive] = useState(false);
  const [recitationMode, setRecitationMode] = useState("confirm"); // "confirm" or "custom"
  const [customRecitationText, setCustomRecitationText] = useState("");
  const [teacherDhikrInputText, setTeacherDhikrInputText] = useState("");
  const [liveBotReflection, setLiveBotReflection] = useState("");

  // Subha (Tasbih) Bead Custom States
  const [subhaColor, setSubhaColor] = useState(() => {
    return localStorage.getItem('arabicmuslim_subha_color') || 'emerald';
  });
  const [subhaActiveIndex, setSubhaActiveIndex] = useState(0);
  const [selectedDhikrIndex, setSelectedDhikrIndex] = useState(0);
  const [tasbihGoalTarget, setTasbihGoalTarget] = useState(100);

  // Reaction states
  const [floatingReactions, setFloatingReactions] = useState([]);
  
  // Creation form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCircleName, setNewCircleName] = useState("");
  const [newCircleDesc, setNewCircleDesc] = useState("");
  const [newCircleCap, setNewCircleCap] = useState(5);
  const [newCircleDuration, setNewCircleDuration] = useState(10);
  const [newCircleType, setNewCircleType] = useState("adhkar"); // "quran", "adhkar", "salawat", "istighfar"
  const [newCircleRecitationRule, setNewCircleRecitationRule] = useState("Tajweed");

  // Dynamic Page Filter States
  const [circlesActiveTab, setCirclesActiveTab] = useState("all"); // "all", "quran", "adhkar", "tasbih"
  const [surahFilter, setSurahFilter] = useState("all");
  const [recitationRuleFilter, setRecitationRuleFilter] = useState("all");

  const subhaColorsList = {
    emerald: { nameEn: "Emerald Green", nameAr: "زمردي أخضر", color: "#0d9488", Hsl: "174, 84%, 31%" },
    gold: { nameEn: "Golden Sand", nameAr: "ذهبي ملكي", color: "#d4af37", Hsl: "43, 64%, 53%" },
    ruby: { nameEn: "Royal Ruby", nameAr: "ياقوتي أحمر", color: "#e11d48", Hsl: "347, 77%, 50%" },
    sapphire: { nameEn: "Deep Sapphire", nameAr: "ياقوت أزرق", color: "#2563eb", Hsl: "221, 83%, 53%" }
  };

  const presetDhikrs = [
    { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ", labelEn: "Subhan Allah wa Bihamdihi" },
    { text: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ", labelEn: "Astaghfirullah al-Adheem" },
    { text: "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِينَا مُحَمَّدٍ ﷺ", labelEn: "Salawat on Prophet" },
    { text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ", labelEn: "La Hawla wa La Quwwata illa Billah" }
  ];

  // Dynamically filter online circles based on selected tab and select filters
  const filteredCirclesList = onlineCircles.filter(circle => {
    // 1. Filter by focus tab
    if (circlesActiveTab === "quran" && circle.type !== "quran") return false;
    if (circlesActiveTab === "adhkar" && circle.type !== "adhkar") return false;
    if (circlesActiveTab === "tasbih" && circle.type !== "salawat" && circle.type !== "istighfar") return false;

    // 2. Filter by Surah name (only applicable to Quran circles)
    if (surahFilter !== "all") {
      const q = surahFilter.toLowerCase();
      if (circle.type !== "quran") return false;
      if (!circle.name.toLowerCase().includes(q) && !circle.nameAr.includes(q)) return false;
    }

    // 3. Filter by Recitation Rule
    if (recitationRuleFilter !== "all") {
      if (circle.recitationRule !== recitationRuleFilter) return false;
    }

    return true;
  });

  // Track timer and background countdowns inside session
  useEffect(() => {
    if (!activeSessionCircleId) return;

    const circle = onlineCircles.find(c => c.id === activeSessionCircleId);
    if (!circle) return;

    const duration = circle.duration || (circle.type === 'quran' ? 60 : 10);
    setSessionTimeLeft(duration * 60);
    setSessionEnded(false);
    setSessionScoreAwarded(false);

    const timer = setInterval(() => {
      setSessionTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setSessionEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSessionCircleId]);

  // Award score once when session ends
  useEffect(() => {
    if (sessionEnded && activeSessionCircleId && !sessionScoreAwarded) {
      const circle = onlineCircles.find(c => c.id === activeSessionCircleId);
      if (circle) {
        const earnedScore = (circle.sessionProgress * 15) + 80;
        addDailyScorePoints(earnedScore);
        setTasbihCount(prev => prev + circle.sessionProgress);
        setSessionScoreAwarded(true);
        completeDailyGoal("tap_subha", 50); // award milestone if appropriate
        
        confetti({
          particleCount: 80,
          spread: 80,
          colors: ['#d4af37', '#ffffff']
        });
      }
    }
  }, [sessionEnded, activeSessionCircleId, sessionScoreAwarded, onlineCircles]);

  // Active Circle bot recitation turn simulation loop
  useEffect(() => {
    if (!activeSessionCircleId || sessionEnded) return;

    const interval = setInterval(() => {
      const circle = onlineCircles.find(c => c.id === activeSessionCircleId);
      if (!circle || !circle.joinedUsers || circle.joinedUsers.length === 0) return;

      const userIdentifier = isAuthenticated ? user.email : "guest_user";
      const userIndex = circle.joinedUsers.findIndex(u => u.email === userIdentifier || (userIdentifier === "guest_user" && u.name === "Guest Member"));
      const currentTurn = circle.currentTurnIndex % circle.joinedUsers.length;
      const activeReciter = circle.joinedUsers[currentTurn];

      // Check if it's a simulated bot's turn
      const isBotTurn = activeReciter && mockBots.some(b => b.email === activeReciter.email);
      const isMyTurn = currentTurn === userIndex;

      if (isBotTurn && !isMyTurn && botSettings.enabled) {
        // Trigger bot recitation and comments
        const botReflections = [
          { text: "أعوذ بالله من الشيطان الرجيم: بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ...", textEn: "A'udhu billahi minash-shaitanir-rajim..." },
          { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ (عشر مرات)", textEn: "Subhan Allah wa Bihamdihi (10x)" },
          { text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِينَا مُحَمَّدٍ ﷺ", textEn: "Allahumma Salli wa Sallim ala Nabiyyina Muhammad..." },
          { text: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ توبة نصوحاً", textEn: "Astaghfirullah al-Adheem..." }
        ];
        const selected = botReflections[Math.floor(Math.random() * botReflections.length)];
        
        // Show subtitle on the live session UI
        setLiveBotReflection(language === 'ar' ? `${activeReciter.name} يتلو الآن: ${selected.text}` : `${activeReciter.name} is reciting: ${selected.textEn}`);

        // Launch blessing reactions dynamically
        const randomEmojis = ['🤲', '❤️', '✨', '🌸'];
        spawnReaction(randomEmojis[Math.floor(Math.random() * randomEmojis.length)]);

        // Advance turn automatically after 4 seconds
        setTimeout(() => {
          if (!activeSessionCircleId) return;
          const nextTurn = (circle.currentTurnIndex + 1) % circle.joinedUsers.length;
          updateCircleTurn(circle.id, nextTurn);
          incrementCircleProgress(circle.id);
          setLiveBotReflection("");
        }, 4000);
      }
    }, 9000);

    return () => clearInterval(interval);
  }, [activeSessionCircleId, sessionEnded, onlineCircles, botSettings]);

  // Simulated background reactions
  useEffect(() => {
    if (!activeSessionCircleId || sessionEnded) return;

    const interval = setInterval(() => {
      const emojis = ['❤️', '🤲', '✨', '⭐'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      spawnReaction(randomEmoji);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeSessionCircleId, sessionEnded]);

  const spawnReaction = (emoji) => {
    const id = Date.now() + Math.random();
    const x = 10 + Math.random() * 80; 
    setFloatingReactions(prev => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 2500);
  };

  // Subha Tap handler
  const handleTasbihTap = () => {
    // Increment local state
    setTasbihCount(prev => {
      const next = prev + 1;
      // Complete daily goals triggers
      if (next >= tasbihGoalTarget) {
        completeDailyGoal("tap_subha", 50);
      }
      return next;
    });

    addDailyScorePoints(5);
    
    // Animate beads index
    setSubhaActiveIndex(prev => (prev + 1) % 33);
    
    // Play light sound/vibe simulation
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const handleTasbihReset = () => {
    setTasbihCount(0);
  };

  const handleJoinCircleClick = (circleId) => {
    const isNowFull = joinCircle(circleId);
    if (isNowFull) {
      confetti({
        particleCount: 40,
        spread: 50,
        colors: ['#d4af37', '#ffffff']
      });
    }
  };

  const handleEnterSession = (circleId) => {
    setActiveSessionCircleId(circleId);
  };

  const handleExitSession = () => {
    setActiveSessionCircleId(null);
  };

  const handleCreateCircleSubmit = (e) => {
    e.preventDefault();
    if (!newCircleName.trim()) return;

    createCircle({
      name: newCircleName,
      description: newCircleDesc,
      capacity: newCircleCap,
      duration: newCircleDuration,
      type: newCircleType,
      recitationRule: newCircleRecitationRule
    });

    setNewCircleName("");
    setNewCircleDesc("");
    setShowCreateModal(false);
    
    // Confetti on create
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#d4af37', '#ffffff']
    });
  };

  const activeCircle = onlineCircles.find(c => c.id === activeSessionCircleId);
  const activeCircleTurn = activeCircle ? activeCircle.currentTurnIndex : null;

  // Track mic and mode clears
  useEffect(() => {
    setIsMicActive(false);
    setCustomRecitationText("");
    setRecitationMode("confirm");
    setTeacherDhikrInputText("");
    setLiveBotReflection("");
  }, [activeSessionCircleId, activeCircleTurn]);

  const getCircleIcon = (type) => {
    switch (type) {
      case 'quran':
        return <Book size={18} color="var(--text-gold)" />;
      default:
        return <Compass size={18} color="var(--text-gold)" />;
    }
  };

  return (
    <div className="community-page container fade-in" style={{ paddingBottom: '80px', paddingTop: '30px' }}>
      
      {/* Top Main Navigation Header */}
      <div style={styles.header}>
        <Users size={36} color="var(--text-gold)" style={styles.headerIcon} />
        <h1 style={styles.title}>{t('commTitle')}</h1>
        <p style={styles.subtitle}>{t('commSubtitle')}</p>
      </div>

      {/* Focus Channels Navigation Tabs */}
      <div style={styles.focusTabs} className="glass-panel">
        <button 
          onClick={() => setCirclesActiveTab("all")}
          style={{
            ...styles.focusTabBtn,
            color: circlesActiveTab === 'all' ? 'var(--text-gold)' : 'var(--text-secondary)',
            background: circlesActiveTab === 'all' ? 'rgba(212,175,55,0.08)' : 'transparent'
          }}
        >
          <span>{language === 'ar' ? "الكل" : "All worships"}</span>
        </button>
        <button 
          onClick={() => setCirclesActiveTab("quran")}
          style={{
            ...styles.focusTabBtn,
            color: circlesActiveTab === 'quran' ? 'var(--text-gold)' : 'var(--text-secondary)',
            background: circlesActiveTab === 'quran' ? 'rgba(212,175,55,0.08)' : 'transparent'
          }}
        >
          <span>{language === 'ar' ? "تلاوة القرآن" : "Recitation"}</span>
        </button>
        <button 
          onClick={() => setCirclesActiveTab("adhkar")}
          style={{
            ...styles.focusTabBtn,
            color: circlesActiveTab === 'adhkar' ? 'var(--text-gold)' : 'var(--text-secondary)',
            background: circlesActiveTab === 'adhkar' ? 'rgba(212,175,55,0.08)' : 'transparent'
          }}
        >
          <span>{language === 'ar' ? "الأذكار والدروس" : "Dhikr Circles"}</span>
        </button>
        <button 
          onClick={() => setCirclesActiveTab("tasbih")}
          style={{
            ...styles.focusTabBtn,
            color: circlesActiveTab === 'tasbih' ? 'var(--text-gold)' : 'var(--text-secondary)',
            background: circlesActiveTab === 'tasbih' ? 'rgba(212,175,55,0.08)' : 'transparent'
          }}
        >
          <span>{language === 'ar' ? "المسبحة الفردية" : "Subha & Tasbih"}</span>
        </button>
      </div>

      {/* Render active content */}
      {circlesActiveTab !== "tasbih" ? (
        // Circles grid section
        <div>
          {/* Filters Row */}
          <div style={styles.filtersBar} className="glass-panel">
            {/* Dynamic Surah filter (Only renders for Quran mode) */}
            {circlesActiveTab === "quran" && (
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>{language === 'ar' ? "تصفية بسورة معينة" : "Filter by Surah"}</label>
                <select 
                  value={surahFilter} 
                  onChange={(e) => setSurahFilter(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">{language === 'ar' ? "كافة السور" : "All Surahs"}</option>
                  <option value="الفاتحة">الفاتحة</option>
                  <option value="الملك">الملك</option>
                  <option value="يس">يس</option>
                  <option value="الكهف">الكهف</option>
                </select>
              </div>
            )}

            {/* Recitation rules filter */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>{language === 'ar' ? "تصفية برواية/تلاوة" : "Filter by Style"}</label>
              <select 
                value={recitationRuleFilter} 
                onChange={(e) => setRecitationRuleFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">{language === 'ar' ? "كافة الروايات" : "All Styles"}</option>
                <option value="Tajweed">{language === 'ar' ? "تجويد" : "Tajweed"}</option>
                <option value="Hafs">{language === 'ar' ? "حفص عن عاصم" : "Hafs"}</option>
                <option value="Warsh">{language === 'ar' ? "ورش عن نافع" : "Warsh"}</option>
                <option value="General">{language === 'ar' ? "عام" : "General"}</option>
              </select>
            </div>

            {/* Create Ring Trigger button */}
            <button onClick={() => setShowCreateModal(true)} className="btn-primary" style={styles.createTriggerBtn}>
              <span>{t('circleCreate')}</span>
            </button>
          </div>

          {/* Circles Circle-Shape Responsive Grid */}
          <div style={styles.circularGridContainer}>
            {filteredCirclesList.length > 0 ? (
              filteredCirclesList.map(circle => {
                const totalJoined = circle.joinedUsers.length;
                const isFull = totalJoined >= circle.capacity;
                const userIdentifier = isAuthenticated ? user.email : "guest_user";
                const isJoined = circle.joinedUsers.some(u => u.email === userIdentifier || (userIdentifier === "guest_user" && u.name === "Guest Member"));
                
                // SVG Progress calculations
                const progressPercentage = Math.min(100, Math.round((totalJoined / circle.capacity) * 100));
                
                return (
                  <div key={circle.id} style={styles.circularCircleCard} className="glass-panel circle-grid-card">
                    {/* Glowing outer progress ring */}
                    <div style={{
                      ...styles.glowingRingBorder,
                      borderColor: isFull ? 'var(--gold-primary)' : 'rgba(212,175,55,0.25)',
                      boxShadow: isJoined ? '0 0 20px rgba(212, 175, 55, 0.2)' : 'none'
                    }}>
                      
                      <span style={styles.circularBadgeIcon}>
                        {getCircleIcon(circle.type)}
                      </span>

                      <h3 style={styles.circularTitle}>
                        {language === 'ar' ? circle.name : circle.nameEn || circle.name}
                      </h3>
                      
                      <span style={styles.circularMetaText}>
                        {circle.recitationRule} • {circle.duration}m
                      </span>

                      {/* Joined users avatars in correct stacking */}
                      <div style={styles.avatarStackBox}>
                        {circle.joinedUsers.slice(0, 4).map((member, idx) => (
                          <span 
                            key={idx} 
                            style={{
                              ...styles.stackAvatarCircle,
                              zIndex: 10 - idx,
                              marginLeft: idx === 0 ? 0 : '-6px'
                            }}
                            title={member.name}
                          >
                            {member.avatar || "🧕"}
                          </span>
                        ))}
                        {totalJoined > 4 && (
                          <span style={styles.stackAvatarCount}>+{totalJoined - 4}</span>
                        )}
                      </div>

                      <div style={styles.circularProgressText}>
                        {totalJoined} / {circle.capacity}
                      </div>

                      {/* Live Action button */}
                      <div style={styles.circularActionContainer}>
                        {isJoined ? (
                          <button onClick={() => handleEnterSession(circle.id)} className="btn-primary" style={styles.circularPlayBtn}>
                            <Sparkles size={11} />
                            <span>{t('circleEnterSession')}</span>
                          </button>
                        ) : (
                          <button onClick={() => handleJoinCircleClick(circle.id)} className="btn-secondary" style={styles.circularJoinBtn}>
                            <span>{isFull ? (language === 'ar' ? "ممتلئة" : "Full") : t('circleJoin')}</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })
            ) : (
              <div style={styles.noCirclesNotice} className="glass-panel">
                <HelpCircle size={32} color="var(--text-gold)" />
                <span>{language === 'ar' ? "لم يتم العثور على أي حلقات تطابق الفلاتر." : "No active worship circles matching filters."}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        // ================= TASBIH TAB: Overhauled Subha beads visual =================
        <div style={styles.subhaLayout} className="glass-panel">
          <div className="islamic-pattern"></div>
          
          <h2 style={styles.subhaDhikrTitle} className="gold-gradient-text">
            {presetDhikrs[selectedDhikrIndex].text}
          </h2>
          <p style={styles.subhaDhikrSub}>
            {language === 'ar' ? "ورد الذكر النشط الآن للتسبيح الفردي" : "Active Supplication for Remembrance"}
          </p>

          <div style={styles.subhaInteractiveArea}>
            {/* Color Picker Segment */}
            <div style={styles.colorPickerPanel} className="glass-panel">
              <Palette size={16} color="var(--text-gold)" />
              <div style={styles.colorBubblesRow}>
                {Object.entries(subhaColorsList).map(([key, item]) => (
                  <button 
                    key={key} 
                    onClick={() => {
                      setSubhaColor(key);
                      localStorage.setItem('arabicmuslim_subha_color', key);
                    }}
                    style={{
                      ...styles.colorPickerBtn,
                      backgroundColor: item.color,
                      borderColor: subhaColor === key ? '#fff' : 'rgba(255,255,255,0.1)'
                    }}
                    title={language === 'ar' ? item.nameAr : item.nameEn}
                  />
                ))}
              </div>
            </div>

            {/* Dhikr Selector Box */}
            <div style={styles.dhikrSelectorColumn}>
              {presetDhikrs.map((d, index) => (
                <button 
                  key={index} 
                  onClick={() => setSelectedDhikrIndex(index)}
                  style={{
                    ...styles.dhikrSelectorBtn,
                    borderColor: selectedDhikrIndex === index ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                    background: selectedDhikrIndex === index ? 'rgba(212,175,55,0.06)' : 'transparent'
                  }}
                  className="glass-panel"
                >
                  <span style={{ fontSize: '0.88rem', color: selectedDhikrIndex === index ? 'var(--text-gold)' : 'var(--text-primary)' }}>
                    {d.text}
                  </span>
                </button>
              ))}
            </div>

            {/* Subha central animated bead container */}
            <div style={styles.subhaBeadVisualizerContainer}>
              <div style={styles.subhaGoalStats}>
                <span>{tasbihCount} / {tasbihGoalTarget}</span>
                <p style={styles.goalPercent}>
                  {Math.round((tasbihCount / tasbihGoalTarget) * 100)}% {language === 'ar' ? "إنجاز" : "Complete"}
                </p>
              </div>

              {/* Glowing bead ring */}
              <div style={styles.subhaRingWrapper}>
                <button 
                  onClick={handleTasbihTap}
                  style={{
                    ...styles.mainSubhaBeadClicker,
                    backgroundColor: subhaColorsList[subhaColor].color,
                    boxShadow: `0 0 25px rgba(${subhaColorsList[subhaColor].Hsl}, 0.55), var(--shadow-gold-intense)`
                  }}
                  className="subha-bead-bounce"
                >
                  <span style={styles.beadTapText}>{t('commTasbihTap')}</span>
                  <div style={styles.beadScoreRing}>{tasbihCount}</div>
                </button>
              </div>

              <div style={styles.subhaActionsRow}>
                <button onClick={handleTasbihReset} className="btn-secondary" style={styles.subhaResetBtn}>
                  <RefreshCw size={12} />
                  <span>{t('commTasbihReset')}</span>
                </button>
                
                <select 
                  value={tasbihGoalTarget} 
                  onChange={(e) => setTasbihGoalTarget(parseInt(e.target.value, 10))}
                  style={styles.goalTargetSelect}
                >
                  <option value={33}>33 {language === 'ar' ? "تسبيحة" : "taps"}</option>
                  <option value={100}>100 {language === 'ar' ? "تسبيحة" : "taps"}</option>
                  <option value={300}>300 {language === 'ar' ? "تسبيحة" : "taps"}</option>
                  <option value={1000}>1000 {language === 'ar' ? "تسبيحة" : "taps"}</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= FULLSCREEN LIVE SESSION OVERLAY ================= */}
      {activeSessionCircleId && (() => {
        const circle = onlineCircles.find(c => c.id === activeSessionCircleId);
        if (!circle) return null;

        const userIdentifier = isAuthenticated ? user.email : "guest_user";
        const userIndex = circle.joinedUsers.findIndex(u => u.email === userIdentifier || (userIdentifier === "guest_user" && u.name === "Guest Member"));
        const currentTurn = circle.currentTurnIndex % circle.joinedUsers.length;
        const activeReciter = circle.joinedUsers[currentTurn];
        const isMyTurn = currentTurn === userIndex;

        const formatTime = (secs) => {
          if (isNaN(secs) || secs === undefined || secs === null || secs < 0) {
            return "10:00";
          }
          const m = Math.floor(secs / 60);
          const s = secs % 60;
          return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        };

        return (
          <div style={styles.sessionOverlay} className="fade-in">
            <div style={styles.sessionCard} className="glass-panel">
              <div className="islamic-pattern"></div>
              
              {/* Header block */}
              <div style={styles.sessionHeader}>
                <div>
                  <h2 style={styles.sessionCircleName}>{circle.name}</h2>
                  <span style={styles.sessionRule}>{circle.recitationRule} • {circle.joinedUsers.length} Worshippers</span>
                </div>
                
                <div style={styles.timerBadge}>
                  <Volume2 size={14} color="var(--text-gold)" />
                  <span>{formatTime(sessionTimeLeft)}</span>
                </div>
              </div>

              {/* Bot or active recitation feedback subtitle */}
              {liveBotReflection && (
                <div style={styles.botReflectionBanner} className="fade-in">
                  <span style={styles.botReflectionText}>{liveBotReflection}</span>
                </div>
              )}

              {/* Central Worship turn indicator */}
              <div style={styles.recitationConsole}>
                {sessionEnded ? (
                  <div style={styles.sessionEndedCard} className="text-center">
                    <CheckCircle2 size={48} color="var(--text-gold)" />
                    <h2 className="gold-gradient-text" style={{ marginTop: '14px' }}>{t('circleSessionEnded')}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{t('circleCongratulations')}</p>
                    
                    <button onClick={handleExitSession} className="btn-primary" style={{ marginTop: '20px' }}>
                      <span>{language === 'ar' ? "الخروج ومتابعة الحساب" : "Exit Session"}</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      ...styles.activeUserAvatarCircle,
                      borderColor: isMyTurn ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                      boxShadow: isMyTurn ? '0 0 30px rgba(212,175,55,0.3)' : 'none'
                    }} className={isMyTurn ? "muslim-avatar-pulse" : ""}>
                      <span style={{ fontSize: '3rem' }}>{activeReciter?.avatar || "🧕"}</span>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <span style={styles.turnLabel}>{t('circleTurnReciter')}</span>
                      <h3 style={styles.activeWorshipperName} className="gold-gradient-text">{activeReciter?.name}</h3>
                    </div>

                    {isMyTurn ? (
                      <div style={styles.myTurnBox} className="glass-panel fade-in">
                        <span style={styles.myTurnTitle}>{t('circleYourTurn')}</span>
                        <p style={styles.myTurnDhikr}>"{circle.dhikrTarget}"</p>

                        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '10px' }}>
                          <button 
                            onClick={() => {
                              const nextTurn = (circle.currentTurnIndex + 1) % circle.joinedUsers.length;
                              updateCircleTurn(circle.id, nextTurn);
                              incrementCircleProgress(circle.id);
                              addDailyScorePoints(30);
                            }} 
                            className="btn-primary"
                            style={{ flex: 1, padding: '12px' }}
                          >
                            <span>{t('circleConfirmBtn')}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={styles.waitingTurnBox} className="glass-panel">
                        <Loader size={16} className="spin-pulse" color="var(--text-gold)" style={{ marginRight: '6px' }} />
                        <span>{t('circleWaitingTurn')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom user action control buttons */}
              <div style={styles.sessionFooter}>
                <button 
                  onClick={() => {
                    const emojis = ['🤲', '❤️', '✨', '🌸'];
                    spawnReaction(emojis[Math.floor(Math.random() * emojis.length)]);
                  }} 
                  className="btn-secondary"
                  style={styles.footerActionBtn}
                >
                  <Heart size={14} color="#ff6b6b" />
                  <span>{t('circleSendReaction')}</span>
                </button>

                <button onClick={handleExitSession} className="btn-secondary" style={styles.footerActionBtn}>
                  <span>{language === 'ar' ? "مغادرة الحلقة" : "Leave Session"}</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Floating Blessings reactions layer */}
      <div className="floating-reactions-container">
        {floatingReactions.map(r => (
          <span 
            key={r.id} 
            className="floating-reaction"
            style={{ left: `${r.x}%` }}
          >
            {r.emoji}
          </span>
        ))}
      </div>

      {/* ================= CIRCLE CREATION MODAL ================= */}
      {showCreateModal && (
        <div style={styles.modalOverlay} className="fade-in">
          <div style={styles.createModalCard} className="glass-panel">
            <h3 style={styles.modalTitle}>{t('circleCreate')}</h3>
            
            <form onSubmit={handleCreateCircleSubmit} style={styles.createForm}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>{t('circleFormName')}</label>
                <input 
                  type="text" 
                  required 
                  value={newCircleName} 
                  onChange={(e) => setNewCircleName(e.target.value)}
                  placeholder={language === 'en' ? "e.g., Daily Surah Yaseen" : "مثال: سورة يس اليومية"}
                  style={styles.formInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>{t('circleFormDesc')}</label>
                <input 
                  type="text" 
                  required 
                  value={newCircleDesc} 
                  onChange={(e) => setNewCircleDesc(e.target.value)}
                  placeholder={language === 'en' ? "e.g., Memorizing Juz 30 together" : "مثال: مراجعة وحفظ جزء عم جماعياً"}
                  style={styles.formInput}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup} className="flex-1">
                  <label style={styles.formLabel}>{t('circleFormType')}</label>
                  <select 
                    value={newCircleType} 
                    onChange={(e) => setNewCircleType(e.target.value)}
                    style={styles.formSelect}
                  >
                    <option value="adhkar">{language === 'ar' ? "أذكار ودروس" : "Adhkar Circle"}</option>
                    <option value="quran">{language === 'ar' ? "تلاوة قرآنية" : "Quran Recitation"}</option>
                    <option value="salawat">{language === 'ar' ? "الصلاة على النبي ﷺ" : "Salawat ring"}</option>
                    <option value="istighfar">{language === 'ar' ? "استغفار جماعي" : "Istighfar"}</option>
                  </select>
                </div>

                <div style={styles.formGroup} className="flex-1">
                  <label style={styles.formLabel}>{language === 'ar' ? "رواية / نوع التلاوة" : "Recitation Style"}</label>
                  <select 
                    value={newCircleRecitationRule} 
                    onChange={(e) => setNewCircleRecitationRule(e.target.value)}
                    style={styles.formSelect}
                  >
                    <option value="Tajweed">{language === 'ar' ? "تجويد" : "Tajweed"}</option>
                    <option value="Hafs">{language === 'ar' ? "حفص عن عاصم" : "Hafs"}</option>
                    <option value="Warsh">{language === 'ar' ? "ورش عن نافع" : "Warsh"}</option>
                    <option value="General">{language === 'ar' ? "عام" : "General"}</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup} className="flex-1">
                  <label style={styles.formLabel}>{t('circleFormCap')}</label>
                  <input 
                    type="number" 
                    min={2} 
                    max={20}
                    value={newCircleCap} 
                    onChange={(e) => setNewCircleCap(parseInt(e.target.value, 10))}
                    style={styles.formInput}
                  />
                </div>

                <div style={styles.formGroup} className="flex-1">
                  <label style={styles.formLabel}>{t('circleSessionDuration')}</label>
                  <select 
                    value={newCircleDuration} 
                    onChange={(e) => setNewCircleDuration(parseInt(e.target.value, 10))}
                    style={styles.formSelect}
                  >
                    <option value={5}>5 {t('circleMinutes')}</option>
                    <option value={10}>10 {t('circleMinutes')}</option>
                    <option value={15}>15 {t('circleMinutes')}</option>
                    <option value={30}>30 {t('circleMinutes')}</option>
                    <option value={60}>60 {t('circleMinutes')}</option>
                  </select>
                </div>
              </div>

              <div style={styles.modalActionRow}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                  <span>{language === 'ar' ? "إلغاء" : "Cancel"}</span>
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  <span>{language === 'ar' ? "إنشاء وبدء الحلقة" : "Create Circle"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '30px',
  },
  headerIcon: {
    marginBottom: '10px',
    filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.4))',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.2rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    marginTop: '6px',
  },
  focusTabs: {
    display: 'flex',
    gap: '10px',
    padding: '8px',
    borderRadius: '16px',
    maxWidth: '600px',
    margin: '0 auto 30px auto',
    justifyContent: 'center',
  },
  focusTabBtn: {
    flex: 1,
    background: 'none',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  filtersBar: {
    padding: '16px 20px',
    borderRadius: '16px',
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    marginBottom: '30px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: '1 1 180px',
  },
  filterLabel: {
    fontSize: '0.78rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  filterSelect: {
    background: '#0f111a',
    border: '1px solid var(--border-gold)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: 'var(--text-primary)',
    fontSize: '0.82rem',
    outline: 'none',
    width: '100%',
  },
  createTriggerBtn: {
    padding: '10px 24px',
    fontSize: '0.85rem',
  },
  circularGridContainer: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  circularCircleCard: {
    width: '290px',
    height: '290px',
    borderRadius: '50%',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  glowingRingBorder: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '3px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 20px',
    background: 'rgba(15,17,26,0.92)',
    textAlign: 'center',
    gap: '6px',
  },
  circularBadgeIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(212,175,55,0.06)',
    border: '1px solid var(--border-gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularTitle: {
    fontSize: '0.98rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    maxHeight: '38px',
    overflow: 'hidden',
  },
  circularMetaText: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  avatarStackBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '4px 0',
  },
  stackAvatarCircle: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.88rem',
    border: '1.5px solid var(--bg-secondary)',
  },
  stackAvatarCount: {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
    marginLeft: '2px',
  },
  circularProgressText: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
  },
  circularActionContainer: {
    marginTop: '4px',
  },
  circularPlayBtn: {
    padding: '4px 12px',
    fontSize: '0.72rem',
    borderRadius: '12px',
  },
  circularJoinBtn: {
    padding: '4px 12px',
    fontSize: '0.72rem',
    borderRadius: '12px',
  },
  noCirclesNotice: {
    padding: '40px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    maxWidth: '500px',
  },
  subhaLayout: {
    maxWidth: '750px',
    margin: '0 auto',
    padding: '40px 30px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  subhaDhikrTitle: {
    fontSize: '1.8rem',
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: '1.5',
    maxWidth: '600px',
  },
  subhaDhikrSub: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '6px',
    marginBottom: '30px',
  },
  subhaInteractiveArea: {
    display: 'flex',
    gap: '24px',
    width: '100%',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  colorPickerPanel: {
    padding: '14px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    flex: '1 1 120px',
  },
  colorBubblesRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  colorPickerBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '2px solid',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  dhikrSelectorColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: '2 1 240px',
  },
  dhikrSelectorBtn: {
    padding: '14px',
    borderRadius: '12px',
    border: '1.5px solid',
    textAlign: 'right',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
  },
  subhaBeadVisualizerContainer: {
    flex: '2 1 240px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  subhaGoalStats: {
    textAlign: 'center',
    fontSize: '1.3rem',
    fontWeight: '800',
    color: 'var(--text-gold)',
  },
  goalPercent: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
    fontWeight: 'normal',
  },
  subhaRingWrapper: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    border: '4px dashed var(--border-gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mainSubhaBeadClicker: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    gap: '6px',
    zIndex: 2,
    fontFamily: 'inherit',
    transition: 'transform 0.1s ease',
  },
  beadTapText: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 'bold',
  },
  beadScoreRing: {
    fontSize: '1.8rem',
    fontWeight: '900',
  },
  subhaActionsRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  subhaResetBtn: {
    padding: '8px 16px',
    fontSize: '0.8rem',
  },
  goalTargetSelect: {
    background: '#0f111a',
    border: '1px solid var(--border-gold)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: 'var(--text-gold)',
    fontSize: '0.82rem',
    outline: 'none',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  createModalCard: {
    width: '100%',
    maxWidth: '550px',
    padding: '30px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
    textAlign: 'center',
  },
  createForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  formInput: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
  },
  formSelect: {
    background: '#0f111a',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
  },
  formRow: {
    display: 'flex',
    gap: '16px',
  },
  modalActionRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px',
  },
  sessionOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.92)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '24px',
  },
  sessionCard: {
    width: '100%',
    maxWidth: '600px',
    padding: '30px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  sessionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '16px',
  },
  sessionCircleName: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  sessionRule: {
    fontSize: '0.78rem',
    color: 'var(--text-gold)',
    display: 'block',
    marginTop: '2px',
  },
  timerBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(212,175,55,0.1)',
    border: '1px solid var(--border-gold)',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '0.85rem',
    color: 'var(--text-gold)',
    fontWeight: '700',
  },
  botReflectionBanner: {
    background: 'rgba(212,175,55,0.06)',
    border: '1px solid var(--border-gold)',
    borderRadius: '12px',
    padding: '12px',
    textAlign: 'center',
  },
  botReflectionText: {
    fontSize: '0.88rem',
    color: 'var(--text-gold)',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  recitationConsole: {
    padding: '30px 20px',
    borderRadius: '20px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.03)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '260px',
  },
  activeUserAvatarCircle: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    border: '3px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.01)',
  },
  turnLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    letterSpacing: '1px',
  },
  activeWorshipperName: {
    fontSize: '1.6rem',
    fontWeight: '700',
    marginTop: '2px',
  },
  myTurnBox: {
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    background: 'rgba(212,175,55,0.03)',
  },
  myTurnTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#ff6b6b',
    textTransform: 'uppercase',
  },
  myTurnDhikr: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--text-gold)',
    margin: '6px 0',
  },
  waitingTurnBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '30px',
    background: 'rgba(255,255,255,0.02)',
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
  },
  sessionEndedCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sessionFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '16px',
  },
  footerActionBtn: {
    padding: '8px 16px',
    fontSize: '0.8rem',
  }
};
