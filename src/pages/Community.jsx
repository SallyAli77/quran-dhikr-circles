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

    // 4. Hide completed/full circles (capacity reached) unless user is joined
    const totalJoined = circle.joinedUsers.length;
    const isFull = totalJoined >= circle.capacity;
    const userIdentifier = isAuthenticated ? user.email : "guest_user";
    const isJoined = circle.joinedUsers.some(u => u.email === userIdentifier || (userIdentifier === "guest_user" && u.name === "Guest Member"));
    if (isFull && !isJoined) return false;

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

        const totalDuration = circle.duration || (circle.type === 'quran' ? 60 : 10);
        const totalSecs = totalDuration * 60;
        const circleLength = 2 * Math.PI * 30; // Radius 30
        const strokeDashoffset = totalSecs > 0 ? circleLength - (sessionTimeLeft / totalSecs) * circleLength : 0;

        return (
          <div style={styles.sessionOverlay} className="fade-in">
            <div style={styles.sessionFullscreenCard} className="glass-panel">
              <div className="islamic-pattern" style={{ opacity: 0.08 }}></div>
              
              {/* Top Navbar Bar inside Fullscreen */}
              <div style={styles.fullscreenHeader}>
                <div>
                  <h2 style={styles.fullscreenCircleName}>
                    {language === 'ar' ? circle.nameAr : circle.name}
                  </h2>
                  <span style={styles.fullscreenRule}>
                    {circle.recitationRule} • {circle.type.toUpperCase()} • {circle.joinedUsers.length} {language === 'ar' ? "مصلٍ متفاعل" : "Active Worshippers"}
                  </span>
                </div>
                
                {/* Radial Clock Timer */}
                <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="40" cy="40" r="30" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                    <circle cx="40" cy="40" r="30" fill="transparent" stroke="var(--gold-primary)" strokeWidth="5"
                      strokeDasharray={circleLength}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'var(--text-gold)'
                  }}>
                    {formatTime(sessionTimeLeft)}
                  </div>
                </div>
              </div>

              {/* Bot or active recitation feedback subtitle */}
              {liveBotReflection && (
                <div style={styles.botReflectionBanner} className="fade-in">
                  <span style={styles.botReflectionText}>{liveBotReflection}</span>
                </div>
              )}

              {/* Grid 2 Column Content Layout */}
              <div style={styles.fullscreenContentGrid}>
                
                {/* LEFT PANEL: Worshippers Board */}
                <div style={styles.worshippersPanel} className="glass-panel">
                  <h3 style={styles.panelTitle}>
                    <Users size={16} color="var(--text-gold)" style={{ marginRight: '6px', marginLeft: '6px' }} />
                    <span>{language === 'ar' ? "لوحة المصلين بالحلقة" : "Worshippers Ring"}</span>
                  </h3>
                  
                  <div style={styles.worshippersList}>
                    {circle.joinedUsers.map((member, idx) => {
                      const isMemberTurn = idx === currentTurn;
                      const isCreator = member.name === circle.creator || (circle.creator === "System" && idx === 0);
                      return (
                        <div 
                          key={idx} 
                          style={{
                            ...styles.worshipperItem,
                            background: isMemberTurn ? 'rgba(212,175,55,0.06)' : 'rgba(255,255,255,0.02)',
                            borderColor: isMemberTurn ? 'var(--border-gold-hover)' : 'var(--border-glass)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={styles.worshipperAvatar}>{member.avatar || "🧕"}</span>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{
                                ...styles.worshipperName,
                                color: isMemberTurn ? 'var(--text-gold)' : 'var(--text-primary)'
                              }}>
                                {member.name}
                              </span>
                              <span style={styles.worshipperRole}>
                                {isCreator ? (language === 'ar' ? "مؤسس الحلقة" : "Ring Leader") : (language === 'ar' ? "عضو متفاعل" : "Active Member")}
                              </span>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {isCreator && <Crown size={12} color="var(--text-gold)" title="Creator" />}
                            {isMemberTurn ? (
                              <span className="reciter-mic-pulse" style={styles.micPulseBadge}>
                                <Mic size={11} color="#000" />
                                <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#000' }}>
                                  {language === 'ar' ? "يتلو" : "Live"}
                                </span>
                              </span>
                            ) : (
                              <Mic size={11} color="var(--text-muted)" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT PANEL: Main Interactive Worship Console */}
                <div style={styles.interactiveConsole} className="glass-panel">
                  {sessionEnded ? (
                    <div style={styles.sessionEndedCard} className="text-center">
                      <CheckCircle2 size={56} color="var(--text-gold)" style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.4))' }} />
                      <h2 className="gold-gradient-text" style={{ marginTop: '16px', fontSize: '1.8rem' }}>{t('circleSessionEnded')}</h2>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '400px', margin: '8px auto 0 auto' }}>
                        {language === 'ar' 
                          ? "الحمد لله رب العالمين! تقبل الله منا ومنكم صالح الأعمال والذكر والقيام." 
                          : t('circleCongratulations')
                        }
                      </p>
                      
                      <button onClick={handleExitSession} className="btn-primary" style={{ marginTop: '24px' }}>
                        <span>{language === 'ar' ? "العودة لقائمة الحلقات" : "Back to Circles"}</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
                      
                      {/* Active Reciter Huge Avatar */}
                      <div style={{
                        ...styles.activeUserAvatarCircle,
                        borderColor: isMyTurn ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                        boxShadow: isMyTurn ? '0 0 35px rgba(212,175,55,0.35)' : 'none',
                        width: '110px',
                        height: '110px'
                      }} className={isMyTurn ? "muslim-avatar-pulse" : ""}>
                        <span style={{ fontSize: '3.6rem' }}>{activeReciter?.avatar || "🧕"}</span>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <span style={styles.turnLabel}>{t('circleTurnReciter')}</span>
                        <h3 style={styles.activeWorshipperName} className="gold-gradient-text">{activeReciter?.name}</h3>
                      </div>

                      {/* Dhikr text box */}
                      <div style={styles.dhikrDisplayCard} className="glass-panel">
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-gold)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {circle.type === 'quran' ? (language === 'ar' ? "الآيات المقررة للتلاوة" : "Quranic Verses for Recitation") : (language === 'ar' ? "الذكر المستهدف" : "Supplication Target")}
                        </span>
                        <p style={styles.dhikrTextContent} className="arabic-text">
                          "{language === 'ar' ? circle.dhikrTargetAr : circle.dhikrTarget}"
                        </p>
                      </div>

                      {isMyTurn ? (
                        <div style={styles.myTurnActionBox} className="glass-panel fade-in">
                          <span style={styles.myTurnTitle}>{t('circleYourTurn')}</span>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            {language === 'ar' ? "يرجى قراءة الذكر بصوت مسموع ثم اضغط لتأكيد إتمام القراءة ودفع الدور للتالي" : "Read the supplication clearly and click to submit your turn progress."}
                          </p>

                          <button 
                            onClick={() => {
                              const nextTurn = (circle.currentTurnIndex + 1) % circle.joinedUsers.length;
                              updateCircleTurn(circle.id, nextTurn);
                              incrementCircleProgress(circle.id);
                              addDailyScorePoints(30);
                              
                              if (navigator.vibrate) navigator.vibrate([40, 40]);
                              
                              confetti({
                                particleCount: 40,
                                spread: 50,
                                colors: ['#d4af37', '#ffffff']
                              });
                            }} 
                            className="btn-primary"
                            style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
                          >
                            <CheckCircle2 size={16} />
                            <span>{language === 'ar' ? "تأكيد إتمام التلاوة والذكر" : t('circleConfirmBtn')}</span>
                          </button>
                        </div>
                      ) : (
                        <div style={styles.waitingTurnConsoleBox} className="glass-panel">
                          <Loader size={18} className="spin-pulse" color="var(--text-gold)" style={{ marginRight: '8px', marginLeft: '8px' }} />
                          <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                            {language === 'ar' 
                              ? `استمع الآن بخشوع إلى تلاوة ${activeReciter?.name}...`
                              : `Please listen patiently as ${activeReciter?.name} recites...`
                            }
                          </span>
                        </div>
                      )}

                    </div>
                  )}
                </div>

              </div>

              {/* Bottom Interactive Reactions Bar */}
              <div style={styles.fullscreenFooter}>
                <div style={styles.quickReactionsRow}>
                  <span style={styles.reactionLabel}>
                    {language === 'ar' ? "شجع الآخرين بالدعاء:" : "Encourage Worshippers:"}
                  </span>
                  <div style={styles.quickReactionBtnsGrid}>
                    {[
                      { emoji: '🤲', label: language === 'ar' ? "دعاء" : "Dua" },
                      { emoji: '❤️', label: language === 'ar' ? "حب" : "Love" },
                      { emoji: '✨', label: language === 'ar' ? "نور" : "Light" },
                      { emoji: '🌸', label: language === 'ar' ? "ورد" : "Flower" },
                      { emoji: '👏', label: language === 'ar' ? "أحسنت" : "Kudos" },
                      { emoji: '👍', label: language === 'ar' ? "دعم" : "Support" }
                    ].map(r => (
                      <button 
                        key={r.emoji}
                        onClick={() => spawnReaction(r.emoji)}
                        style={styles.quickEmojiBtn}
                        className="glass-panel"
                        title={r.label}
                      >
                        <span style={{ fontSize: '1.25rem' }}>{r.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleExitSession} className="btn-secondary" style={styles.fullscreenLeaveBtn}>
                  <span>{language === 'ar' ? "مغادرة الجلسة" : "Leave Session"}</span>
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
    width: '100vw',
    height: '100vh',
    background: 'rgba(5, 5, 8, 0.96)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    padding: '24px',
    boxSizing: 'border-box',
  },
  sessionFullscreenCard: {
    width: '100%',
    maxWidth: '1000px',
    height: '90vh',
    maxHeight: '750px',
    padding: '24px 30px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
    background: 'rgba(15, 17, 26, 0.88)',
    border: '1px solid var(--border-gold)',
  },
  fullscreenHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: '16px',
    width: '100%',
  },
  fullscreenCircleName: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: 'var(--text-gold)',
  },
  fullscreenRule: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  fullscreenContentGrid: {
    display: 'flex',
    gap: '24px',
    flex: '1',
    minHeight: '0',
    width: '100%',
  },
  worshippersPanel: {
    flex: '1 1 280px',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    borderRadius: '16px',
    background: 'rgba(0, 0, 0, 0.2)',
    maxHeight: '100%',
    overflowY: 'auto',
  },
  panelTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
  },
  worshippersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: '1',
    overflowY: 'auto',
  },
  worshipperItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid transparent',
    transition: 'all 0.3s ease',
  },
  worshipperAvatar: {
    fontSize: '1.4rem',
  },
  worshipperName: {
    fontSize: '0.88rem',
    fontWeight: '700',
  },
  worshipperRole: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    marginTop: '1px',
  },
  micPulseBadge: {
    background: 'var(--gold-gradient)',
    padding: '3px 8px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 0 10px rgba(212,175,55,0.4)',
  },
  interactiveConsole: {
    flex: '2 1 450px',
    padding: '24px',
    borderRadius: '16px',
    background: 'rgba(0, 0, 0, 0.35)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '100%',
    overflowY: 'auto',
  },
  dhikrDisplayCard: {
    width: '100%',
    padding: '20px',
    borderRadius: '16px',
    background: 'rgba(212, 175, 55, 0.03)',
    border: '1px solid var(--border-gold)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  dhikrTextContent: {
    fontSize: '1.45rem',
    fontWeight: '800',
    color: 'var(--text-gold)',
    lineHeight: '1.8',
    margin: '4px 0',
  },
  myTurnActionBox: {
    width: '100%',
    padding: '16px',
    borderRadius: '14px',
    background: 'rgba(212,175,55,0.04)',
    border: '1px solid rgba(212,175,55,0.15)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  myTurnTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#ff6b6b',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  waitingTurnConsoleBox: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 20px',
    borderRadius: '30px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    fontSize: '0.85rem',
  },
  fullscreenFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: '16px',
    width: '100%',
  },
  quickReactionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  reactionLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-gold)',
    fontWeight: '700',
  },
  quickReactionBtnsGrid: {
    display: 'flex',
    gap: '8px',
  },
  quickEmojiBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    border: '1px solid var(--border-glass)',
    background: 'rgba(255,255,255,0.02)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  fullscreenLeaveBtn: {
    padding: '8px 20px',
    fontSize: '0.82rem',
  },
  sessionEndedCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  }
};
