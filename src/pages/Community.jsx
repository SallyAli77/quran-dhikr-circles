import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Send, Heart, MessageSquare, Award, AlertCircle, PlusCircle, RotateCcw, HeartHandshake, BookOpen, Sparkles, Crown, UserPlus, UserMinus, Plus, Compass, X, Clock, Mic } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Community() {
  const { 
    language, 
    isAuthenticated, 
    user, 
    communityPosts, 
    addPost, 
    likePost, 
    addComment, 
    tasbihCount, 
    setTasbihCount, 
    onlineCircles,
    joinCircle,
    createCircle,
    updateCircleTurn,
    updateCircleDhikr,
    incrementCircleProgress,
    friendsList,
    toggleFriend,
    t 
  } = useApp();

  const [postText, setPostText] = useState("");
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: "" }
  const [openComments, setOpenComments] = useState({}); // { [postId]: false }
  const [activeTab, setActiveTab] = useState("feed"); // "feed", "circles", or "tasbih"

  // Circle creation form states
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [newCircleName, setNewCircleName] = useState("");
  const [newCircleDesc, setNewCircleDesc] = useState("");
  const [newCircleCap, setNewCircleCap] = useState(5);
  const [newCircleType, setNewCircleType] = useState("adhkar");
  const [newCircleDuration, setNewCircleDuration] = useState(5); // Default to 5 minutes
  const [formSuccess, setFormSuccess] = useState(false);

  // Simulated global click counters
  const [globalDhikr, setGlobalDhikr] = useState(48293);
  const [activeUsers, setActiveUsers] = useState(1280);

  // Interactive Live Session States
  const [activeSessionCircleId, setActiveSessionCircleId] = useState(null);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState([]);
  const [isMicActive, setIsMicActive] = useState(false);
  const [customRecitationText, setCustomRecitationText] = useState("");
  const [recitationMode, setRecitationMode] = useState("confirm"); // "confirm" or "write"
  const [sessionScoreAwarded, setSessionScoreAwarded] = useState(false);
  const [teacherDhikrInputText, setTeacherDhikrInputText] = useState("");

  // Session timer countdown effect
  useEffect(() => {
    if (!activeSessionCircleId) {
      setSessionTimeLeft(0);
      setSessionEnded(false);
      return;
    }

    const circle = onlineCircles.find(c => c.id === activeSessionCircleId);
    if (!circle) return;

    // Start countdown timer
    setSessionTimeLeft(circle.duration * 60);
    setSessionEnded(false);

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
        const earnedScore = (circle.sessionProgress * 15) + 50;
        setTasbihCount(prev => prev + earnedScore);
        setSessionScoreAwarded(true);
        triggerGoldMilestoneConfetti();
      }
    }
  }, [sessionEnded, activeSessionCircleId, sessionScoreAwarded, onlineCircles]);

  // Reset mic and console states when active circle or current turn changes
  const activeCircle = onlineCircles.find(c => c.id === activeSessionCircleId);
  const activeCircleTurn = activeCircle ? activeCircle.currentTurnIndex : null;

  useEffect(() => {
    setIsMicActive(false);
    setCustomRecitationText("");
    setRecitationMode("confirm");
    setTeacherDhikrInputText("");
  }, [activeSessionCircleId, activeCircleTurn]);

  // Simulated real-time turns by AI teacher for students
  useEffect(() => {
    if (!activeSessionCircleId || sessionEnded) return;

    const interval = setInterval(() => {
      const circle = onlineCircles.find(c => c.id === activeSessionCircleId);
      if (!circle || !circle.joinedUsers || circle.joinedUsers.length === 0) return;

      const userIdentifier = isAuthenticated ? user.email : "guest_user";
      const userIndex = circle.joinedUsers.findIndex(u => u.email === userIdentifier || (userIdentifier === "guest_user" && u.name === "Guest Member"));
      const isOrganizer = circle.creator === (isAuthenticated ? user.name : "Guest") || circle.creator === "System";

      if (!isOrganizer) {
        // Students experience simulated AI Teacher turn assignments randomly
        const randomMemberIndex = Math.floor(Math.random() * circle.joinedUsers.length);
        updateCircleTurn(circle.id, randomMemberIndex);
        incrementCircleProgress(circle.id);

        confetti({
          particleCount: 5,
          spread: 20,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#ffffff']
        });
      }
    }, 15000); // 15 seconds turn assignment

    return () => clearInterval(interval);
  }, [activeSessionCircleId, sessionEnded, onlineCircles, isAuthenticated, user]);

  // Simulated reactions from other participants
  useEffect(() => {
    if (!activeSessionCircleId || sessionEnded) return;

    const interval = setInterval(() => {
      const randomEmojis = ['🤲', '❤️', '✨', '⭐', '🌸'];
      const randomEmoji = randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
      spawnReaction(randomEmoji);
    }, 6000); // 6 seconds reaction interval

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

  const handleEnterSession = (circleId) => {
    setActiveSessionCircleId(circleId);
    setSessionScoreAwarded(false); // Reset score award state on entry
  };

  const handleExitSession = () => {
    setActiveSessionCircleId(null);
  };

  const handleAssignTurn = (idx) => {
    updateCircleTurn(activeSessionCircleId, idx);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const handleJoinCircleClick = (circleId) => {
    const isCompleted = joinCircle(circleId);
    if (isCompleted) {
      triggerGoldMilestoneConfetti();
    }
  };

  const triggerGoldMilestoneConfetti = () => {
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#d4af37', '#f4e0a5', '#ffffff', '#aa7c11'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleCreateCircleSubmit = (e) => {
    e.preventDefault();
    if (!newCircleName.trim() || !newCircleDesc.trim()) return;

    createCircle({
      name: newCircleName,
      description: newCircleDesc,
      capacity: newCircleCap,
      type: newCircleType,
      duration: newCircleDuration
    });

    setNewCircleName("");
    setNewCircleDesc("");
    setNewCircleCap(5);
    setNewCircleType("adhkar");
    setNewCircleDuration(5);
    
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
    setIsCreateFormOpen(false);

    confetti({
      particleCount: 25,
      spread: 35,
      colors: ['#d4af37', '#ffffff']
    });
  };

  const getCircleIcon = (type) => {
    switch (type) {
      case 'quran':
        return <BookOpen size={20} color="var(--text-gold)" />;
      case 'adhkar':
        return <Sparkles size={20} color="var(--text-gold)" />;
      case 'istighfar':
        return <Award size={20} color="var(--text-gold)" />;
      case 'salawat':
        return <Heart size={20} color="var(--text-gold)" />;
      default:
        return <Compass size={20} color="var(--text-gold)" />;
    }
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!postText.trim()) return;

    addPost(postText);
    setPostText("");
    
    // Play success confetti
    confetti({
      particleCount: 30,
      spread: 40,
      colors: ['#d4af37', '#ffffff']
    });
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    addComment(postId, commentText);
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  const handleCommentChange = (postId, val) => {
    setCommentInputs(prev => ({ ...prev, [postId]: val }));
  };

  const toggleCommentsView = (postId) => {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleTasbihTap = () => {
    const nextCount = tasbihCount + 1;
    setTasbihCount(nextCount);
    setGlobalDhikr(prev => prev + 1);

    // Dynamic haptic trigger if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Milestones confetti and celebrations
    if (nextCount === 33) {
      triggerMilestoneConfetti("Subhan Allah");
    } else if (nextCount === 66) {
      triggerMilestoneConfetti("Alhamdulillah");
    } else if (nextCount === 99 || nextCount === 100) {
      triggerMilestoneConfetti("Allahu Akbar");
    }
  };

  const triggerMilestoneConfetti = (phrase) => {
    // Massive custom confetti
    const end = Date.now() + 1 * 1000;
    const colors = ['#d4af37', '#ffffff', '#c5a059'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleTasbihReset = () => {
    setTasbihCount(0);
  };

  const activeMilestoneMessage = () => {
    if (tasbihCount > 0 && tasbihCount % 100 === 0) {
      return `${t('commMilestone')} ${tasbihCount} - Allahu Akbar!`;
    }
    if (tasbihCount === 33) {
      return `${t('commMilestone')} 33 - Subhan Allah!`;
    }
    if (tasbihCount === 66) {
      return `${t('commMilestone')} 66 - Alhamdulillah!`;
    }
    if (tasbihCount === 99) {
      return `${t('commMilestone')} 99 - Allahu Akbar!`;
    }
    return null;
  };

  return (
    <div className="community-page container fade-in" style={{ minHeight: '80vh', paddingTop: '100px' }}>
      <div style={styles.header}>
        <Users size={32} color="var(--text-gold)" style={styles.headerIcon} />
        <h1 style={styles.title}>{t('commTitle')}</h1>
        <p style={styles.subtitle}>{t('commSubtitle')}</p>
      </div>

      {/* Switch Tabs */}
      <div style={styles.tabContainer} className="glass-panel">
        <button 
          onClick={() => setActiveTab("feed")} 
          style={{
            ...styles.tabBtn,
            background: activeTab === "feed" ? 'var(--gold-gradient)' : 'transparent',
            color: activeTab === "feed" ? '#000' : 'var(--text-secondary)',
            fontWeight: activeTab === "feed" ? '600' : '400'
          }}
        >
          {language === 'en' ? "Reflection Board" : "لوحة التدبر"}
        </button>

        <button 
          onClick={() => setActiveTab("circles")} 
          style={{
            ...styles.tabBtn,
            background: activeTab === "circles" ? 'var(--gold-gradient)' : 'transparent',
            color: activeTab === "circles" ? '#000' : 'var(--text-secondary)',
            fontWeight: activeTab === "circles" ? '600' : '400'
          }}
        >
          {t('commTabCircles')}
        </button>

        <button 
          onClick={() => setActiveTab("tasbih")} 
          style={{
            ...styles.tabBtn,
            background: activeTab === "tasbih" ? 'var(--gold-gradient)' : 'transparent',
            color: activeTab === "tasbih" ? '#000' : 'var(--text-secondary)',
            fontWeight: activeTab === "tasbih" ? '600' : '400'
          }}
        >
          {language === 'en' ? "Tasbih Circle" : "حلقة التسبيح"}
        </button>
      </div>

      {activeTab === "feed" ? (
        // Feed tab
        <div style={styles.feedLayout}>
          {/* Post Form */}
          <form onSubmit={handlePostSubmit} style={styles.postForm} className="glass-panel">
            <h3 style={styles.formTitle}>{t('commCreatePost')}</h3>
            <textarea
              required
              rows={3}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder={t('commPostPlaceholder')}
              style={styles.postInput}
            />
            <div style={styles.formActions}>
              <div style={styles.userNotice}>
                {!isAuthenticated && (
                  <span style={styles.anonAlert}>
                    <AlertCircle size={12} />
                    <span>{language === 'en' ? "Posting anonymously" : "النشر كعضو مجهول"}</span>
                  </span>
                )}
              </div>
              
              <button type="submit" className="btn-primary">
                <Send size={14} />
                <span>{t('commPostButton')}</span>
              </button>
            </div>
          </form>

          {/* Posts list */}
          <div style={styles.postsFeed}>
            {communityPosts.map(post => {
              const liked = isAuthenticated && post.likedBy.includes(user.email);
              const commentsOpen = openComments[post.id];

              return (
                <div key={post.id} style={styles.postCard} className="glass-panel">
                  {/* Post Header */}
                  <div style={styles.postHeader}>
                    <div style={styles.authorBadge}>
                      <span style={styles.postAvatar}>{post.avatar}</span>
                      <div>
                        <div style={styles.postAuthorName}>{post.author}</div>
                        <div style={styles.postTime}>{post.timestamp}</div>
                      </div>
                    </div>
                  </div>

                  {/* Post body */}
                  <p style={styles.postContent}>
                    {language === 'en' ? post.content : post.contentAr}
                  </p>

                  <div style={styles.postDivider}></div>

                  {/* Actions (Like & comment indicators) */}
                  <div style={styles.postActions}>
                    <button 
                      onClick={() => likePost(post.id)} 
                      style={{
                        ...styles.postActionBtn,
                        color: liked ? 'var(--text-gold)' : 'var(--text-secondary)'
                      }}
                    >
                      <Heart size={16} fill={liked ? "var(--gold-primary)" : "none"} />
                      <span>{post.likes} {post.likes === 1 ? (language === 'en' ? "Like" : "إعجاب") : (language === 'en' ? "Likes" : "إعجابات")}</span>
                    </button>

                    <button 
                      onClick={() => toggleCommentsView(post.id)} 
                      style={styles.postActionBtn}
                    >
                      <MessageSquare size={16} />
                      <span>{post.comments.length} {post.comments.length === 1 ? (language === 'en' ? "Comment" : "تعليق") : (language === 'en' ? "Comments" : "تعليقات")}</span>
                    </button>
                  </div>

                  {/* Comments section */}
                  {commentsOpen && (
                    <div style={styles.commentsPanel} className="glass-panel fade-in">
                      <div style={styles.commentsList}>
                        {post.comments.map(c => (
                          <div key={c.id} style={styles.commentRow} className="glass-panel">
                            <span style={styles.commentAvatar}>{c.avatar}</span>
                            <div style={styles.commentDetails}>
                              <div style={styles.commentAuthor}>{c.author}</div>
                              <p style={styles.commentText}>{c.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Comment Input */}
                      <form onSubmit={(e) => handleCommentSubmit(e, post.id)} style={styles.commentForm}>
                        <input
                          type="text"
                          required
                          value={commentInputs[post.id] || ""}
                          onChange={(e) => handleCommentChange(post.id, e.target.value)}
                          placeholder={language === 'en' ? "Write a comment..." : "اكتب تعليقاً..."}
                          style={styles.commentInput}
                        />
                        <button type="submit" style={styles.commentSubmitBtn}>
                          <Send size={12} />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === "circles" ? (
        // Online circles tab
        <div style={styles.circlesLayout} className="fade-in">
          {/* Header Action: Create New Circle */}
          <div style={styles.circlesActionBar}>
            <h2 style={styles.tabSectionTitle}>
              {language === 'en' ? "Active Dhikr & Quran Circles" : "حلقات الذكر والقرآن النشطة"}
            </h2>
            <button 
              onClick={() => setIsCreateFormOpen(!isCreateFormOpen)} 
              className="btn-primary"
              style={styles.createBtn}
            >
              <Plus size={16} />
              <span>{t('circleCreate')}</span>
            </button>
          </div>

          {/* Success Banner */}
          {formSuccess && (
            <div style={styles.circleFormSuccess} className="glass-panel fade-in">
              <Sparkles size={16} color="var(--text-gold)" style={{ marginRight: '6px', marginLeft: '6px' }} />
              <span>{t('circleSuccessCreated')}</span>
            </div>
          )}

          {/* Drawer Form for Circle Creation */}
          {isCreateFormOpen && (
            <form onSubmit={handleCreateCircleSubmit} style={styles.createCircleForm} className="glass-panel slide-up">
              <h3 style={styles.formTitle}>{t('circleCreate')}</h3>
              
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>{t('circleFormName')}</label>
                  <input 
                    type="text" 
                    required 
                    value={newCircleName}
                    onChange={(e) => setNewCircleName(e.target.value)}
                    placeholder={language === 'en' ? "e.g., Daily Surah Yaseen" : "مثال: سورة يس اليومية"}
                    style={styles.circleInput}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>{t('circleSessionDuration')}</label>
                  <select
                    value={newCircleDuration}
                    onChange={(e) => setNewCircleDuration(parseInt(e.target.value, 10))}
                    style={styles.circleInput}
                  >
                    <option value={5}>5 {t('circleMinutes')}</option>
                    <option value={10}>10 {t('circleMinutes')}</option>
                    <option value={15}>15 {t('circleMinutes')}</option>
                    {newCircleType === 'quran' && (
                      <>
                        <option value={30}>30 {t('circleMinutes')}</option>
                        <option value={45}>45 {t('circleMinutes')}</option>
                        <option value={60}>60 {t('circleMinutes')} (1 {language === 'en' ? "hour" : "ساعة"})</option>
                      </>
                    )}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>{t('circleFormCap')} ({newCircleCap})</label>
                  <input 
                    type="range" 
                    min={2} 
                    max={30} 
                    value={newCircleCap}
                    onChange={(e) => setNewCircleCap(parseInt(e.target.value, 10))}
                    style={styles.rangeInput}
                  />
                  <div style={styles.rangeMarkers}>
                    <span>2</span>
                    <span>15</span>
                    <span>30</span>
                  </div>
                </div>
              </div>

              <div style={{ ...styles.formGroup, marginTop: '12px' }}>
                <label style={styles.formLabel}>{t('circleFormDesc')}</label>
                <textarea 
                  required 
                  rows={2}
                  value={newCircleDesc}
                  onChange={(e) => setNewCircleDesc(e.target.value)}
                  placeholder={language === 'en' ? "What is the goal of this circle?" : "ما هو الهدف من هذه الحلقة؟"}
                  style={styles.circleTextArea}
                />
              </div>

              <div style={{ ...styles.formGroup, marginTop: '12px' }}>
                <label style={styles.formLabel}>{t('circleFormType')}</label>
                <div style={styles.typePresetContainer}>
                  {['adhkar', 'quran', 'istighfar', 'salawat'].map(tType => (
                    <button
                      key={tType}
                      type="button"
                      onClick={() => {
                        setNewCircleType(tType);
                        if (tType === 'quran') {
                          setNewCircleDuration(60);
                        } else {
                          setNewCircleDuration(5);
                        }
                      }}
                      style={{
                        ...styles.typePresetBtn,
                        background: newCircleType === tType ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.02)',
                        color: newCircleType === tType ? '#000' : 'var(--text-primary)',
                        borderColor: newCircleType === tType ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.2)'
                      }}
                    >
                      {tType === 'quran' && (language === 'en' ? "Quran Recitation" : "تلاوة القرآن")}
                      {tType === 'adhkar' && (language === 'en' ? "Adhkar & Supplication" : "أذكار وأدعية")}
                      {tType === 'istighfar' && (language === 'en' ? "Istighfar" : "استغفار")}
                      {tType === 'salawat' && (language === 'en' ? "Salawat" : "صلاة على النبي")}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formActionsSubmit}>
                <button 
                  type="button" 
                  onClick={() => setIsCreateFormOpen(false)} 
                  className="btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  {language === 'en' ? "Cancel" : "إلغاء"}
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ padding: '8px 24px' }}
                >
                  <Send size={12} />
                  <span>{language === 'en' ? "Create & Join" : "أنشئ وانضم"}</span>
                </button>
              </div>
            </form>
          )}

          {/* Circles Responsive Grid */}
          <div style={styles.circlesGrid}>
            {onlineCircles.map(circle => {
              const totalJoined = circle.joinedUsers.length;
              const isFull = totalJoined >= circle.capacity;
              const userIdentifier = isAuthenticated ? user.email : "guest_user";
              const isJoined = circle.joinedUsers.some(u => u.email === userIdentifier || (userIdentifier === "guest_user" && u.name === "Guest Member"));
              
              // Calculate percent for SVG Circular Progress
              const progressPercentage = Math.min(100, Math.round((totalJoined / circle.capacity) * 100));
              const strokeDashoffset = 113 - (113 * progressPercentage) / 100; // 113 is approx circumference for r=18

              return (
                <div 
                  key={circle.id} 
                  className={`glass-panel circle-grid-card ${isFull ? 'golden-circle-card animate-golden-glow' : ''}`}
                  style={{
                    ...styles.circleCard,
                    ...(isFull ? styles.goldenCircleCard : {})
                  }}
                >
                  {/* Card Header: Type Icon & Status Badge */}
                  <div style={styles.circleCardHeader}>
                    <div 
                      style={{
                        ...styles.circleIconWrapper,
                        borderColor: isFull ? 'var(--gold-primary)' : 'rgba(212,175,55,0.15)',
                        background: isFull ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.02)'
                      }}
                    >
                      {getCircleIcon(circle.type)}
                    </div>
                    {isFull ? (
                      <span style={styles.completeBadge} className="gold-glow-text">
                        <Crown size={11} style={{ marginRight: '3px', marginLeft: '3px' }} />
                        {t('circleFull')}
                      </span>
                    ) : (
                      <span style={styles.activeBadge}>
                        <span style={styles.pulseDot}></span>
                        {language === 'en' ? "Active" : "نشط"}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 
                    style={{
                      ...styles.circleTitle,
                      color: isFull ? '#fff' : 'var(--text-primary)',
                      textShadow: isFull ? '0 0 10px rgba(212, 175, 55, 0.4)' : 'none'
                    }}
                  >
                    {language === 'en' ? circle.name : circle.nameAr}
                  </h3>
                  <p 
                    style={{
                      ...styles.circleDesc,
                      color: isFull ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)'
                    }}
                  >
                    {language === 'en' ? circle.description : circle.descriptionAr}
                  </p>

                  <div style={styles.circleDivider}></div>

                  {/* Member Stats & Circular SVG Ring Progress */}
                  <div style={styles.progressSection}>
                    <div style={styles.memberStatsText}>
                      <span style={styles.membersLabel}>{language === 'en' ? "Joining Users:" : "الأعضاء المنضمين:"}</span>
                      <div style={styles.membersCountVal}>
                        <span style={{ color: isFull ? 'var(--text-gold)' : 'var(--text-primary)', fontWeight: '700' }}>
                          {totalJoined}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 2px' }}>/</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{circle.capacity}</span>
                      </div>
                    </div>

                    {/* Circular visual progress ring */}
                    <div style={styles.circularProgressWrapper}>
                      <svg width="42" height="42" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
                        <circle 
                          cx="21" 
                          cy="21" 
                          r="18" 
                          fill="transparent" 
                          stroke={isFull ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.02)'} 
                          strokeWidth="3.5" 
                        />
                        <circle 
                          cx="21" 
                          cy="21" 
                          r="18" 
                          fill="transparent" 
                          stroke={isFull ? 'url(#goldGradient)' : 'var(--gold-primary)'} 
                          strokeWidth="3.5" 
                          strokeDasharray="113"
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                        />
                        <defs>
                          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#b38728" />
                            <stop offset="50%" stopColor="#fbf5b7" />
                            <stop offset="100%" stopColor="#daae48" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span 
                        style={{
                          ...styles.progressTextCenter,
                          color: isFull ? 'var(--text-gold)' : 'var(--text-primary)'
                        }}
                      >
                        {progressPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Joined users avatars stack representation */}
                  <div style={styles.avatarsRow}>
                    <div style={styles.avatarStack}>
                      {circle.joinedUsers.slice(0, 5).map((memberUser, idx) => (
                        <span 
                          key={idx} 
                          style={{
                            ...styles.memberAvatarCircle,
                            zIndex: 10 - idx,
                            marginRight: language === 'ar' ? 0 : (idx === 0 ? 0 : '-8px'),
                            marginLeft: language === 'ar' ? (idx === 0 ? 0 : '-8px') : 0
                          }}
                          title={memberUser.name}
                        >
                          {memberUser.avatar || "🌙"}
                        </span>
                      ))}
                      {totalJoined > 5 && (
                        <span 
                          style={{
                            ...styles.avatarOverflowCount,
                            zIndex: 4,
                            marginRight: language === 'ar' ? 0 : '-8px',
                            marginLeft: language === 'ar' ? '-8px' : 0
                          }}
                        >
                          +{totalJoined - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions for joined/unjoined */}
                  <div style={styles.cardActionsRow}>
                    {isJoined ? (
                      <>
                        <button
                          onClick={() => handleEnterSession(circle.id)}
                          style={styles.enterSessionBtn}
                          className="circle-join-btn-hover confirm-recitation-glow"
                        >
                          <Sparkles size={14} style={{ marginRight: '4px', marginLeft: '4px' }} />
                          <span>{t('circleEnterSession')}</span>
                        </button>
                        <button 
                          onClick={() => handleJoinCircleClick(circle.id)} 
                          style={styles.leaveButtonAction}
                          className="circle-join-btn-hover"
                          title={t('circleLeave')}
                        >
                          <UserMinus size={14} />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => handleJoinCircleClick(circle.id)} 
                        style={{
                          ...styles.joinButtonAction,
                          background: isFull ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.02)',
                          color: isFull ? '#000' : 'var(--text-gold)',
                          borderColor: isFull ? 'var(--gold-primary)' : 'var(--border-gold)'
                        }}
                        className="circle-join-btn-hover"
                      >
                        <UserPlus size={14} />
                        <span>{isFull ? (language === 'en' ? "Keep Participating" : "استمر بالمشاركة") : t('circleJoin')}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Tasbih circle tab
        <div style={styles.tasbihLayout}>
          <div style={styles.tasbihInfoPanel} className="grid-2">
            <div style={styles.tasbihInfoCard} className="glass-panel">
              <span style={styles.tasbihInfoLabel}>{t('commTasbihCount')}</span>
              <div style={styles.tasbihInfoValue} className="gold-gradient-text">{tasbihCount}</div>
            </div>

            <div style={styles.tasbihInfoCard} className="glass-panel">
              <span style={styles.tasbihInfoLabel}>{t('commTasbihGlobal')}</span>
              <div style={styles.tasbihInfoValue}>{activeUsers}</div>
              <span style={styles.subLabel}>{language === 'en' ? `Circle Total: ${globalDhikr} Supplications` : `إجمالي الحلقة: ${globalDhikr} ذكراً`}</span>
            </div>
          </div>

          {/* Active Milestone Notice */}
          {activeMilestoneMessage() && (
            <div style={styles.milestoneNotice} className="glass-panel fade-in">
              <HeartHandshake size={18} color="var(--text-gold)" />
              <span>{activeMilestoneMessage()}</span>
            </div>
          )}

          {/* Huge interactive button */}
          <div style={styles.tasbihClickWrapper}>
            <button 
              onClick={handleTasbihTap} 
              style={styles.tasbihButton} 
              className="glow-pulse-tasbih"
            >
              <span style={styles.tasbihLabelText}>{t('commTasbihTap')}</span>
              <span style={styles.tasbihNumberVal}>{tasbihCount}</span>
            </button>
          </div>

          {/* Reset Action */}
          <button 
            onClick={handleTasbihReset} 
            style={styles.resetBtn} 
            className="btn-secondary"
            disabled={tasbihCount === 0}
          >
            <RotateCcw size={14} />
            <span>{t('commTasbihReset')}</span>
          </button>
        </div>
      )}

      {/* Floating Reactions Layer */}
      <div className="floating-reactions-container">
        {floatingReactions.map(r => (
          <span 
            key={r.id} 
            className="floating-reaction"
            style={{ 
              left: `${r.x}%`,
            }}
          >
            {r.emoji}
          </span>
        ))}
      </div>

      {/* Fullscreen Live Session Overlay */}
      {activeSessionCircleId && (() => {
        const circle = onlineCircles.find(c => c.id === activeSessionCircleId);
        if (!circle || !circle.joinedUsers || circle.joinedUsers.length === 0) return null;

        const userIdentifier = isAuthenticated ? user.email : "guest_user";
        const userIndex = circle.joinedUsers.findIndex(u => u.email === userIdentifier || (userIdentifier === "guest_user" && u.name === "Guest Member"));
        const isOrganizer = circle.creator === (isAuthenticated ? user.name : "Guest") || circle.creator === "System";

        const currentTurn = circle.currentTurnIndex % circle.joinedUsers.length;
        const activeReciter = circle.joinedUsers[currentTurn];
        const isMyTurn = currentTurn === userIndex;

        const formatTime = (secs) => {
          const m = Math.floor(secs / 60);
          const s = secs % 60;
          return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        };

        return (
          <div style={styles.sessionOverlay} className="fade-in">
            {/* Header Block */}
            <div style={styles.sessionHeader}>
              <div style={styles.sessionHeaderLeft}>
                <div style={styles.sessionTypeIcon}>
                  {getCircleIcon(circle.type)}
                </div>
                <div style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
                  <h2 style={styles.sessionCircleName}>{language === 'en' ? circle.name : circle.nameAr}</h2>
                  <span style={styles.sessionOrganizerBadge}>
                    <Crown size={12} style={{ marginRight: '4px', marginLeft: '4px' }} />
                    {t('circleCreator')}: {circle.creator}
                  </span>
                </div>
              </div>

              {/* Delightful Countdown circular timer */}
              {(() => {
                const totalSecs = circle.duration * 60;
                const ratio = totalSecs > 0 ? (sessionTimeLeft / totalSecs) : 0;
                let strokeColor = '#10b981'; // Emerald
                if (ratio <= 0.2) {
                  strokeColor = '#ef4444'; // Crimson
                } else if (ratio <= 0.5) {
                  strokeColor = '#d4af37'; // Gold
                }
                return (
                  <div style={styles.circularTimerContainer}>
                    <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)' }}>
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.04)"
                        strokeWidth="3.5"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="transparent"
                        stroke={strokeColor}
                        strokeWidth="3.5"
                        strokeDasharray="150.8"
                        strokeDashoffset={150.8 - (150.8 * ratio)}
                        strokeLinecap="round"
                        style={{
                          transition: 'stroke 0.5s ease, stroke-dashoffset 1s linear',
                        }}
                      />
                    </svg>
                    <div style={styles.circularTimerText}>
                      {formatTime(sessionTimeLeft)}
                    </div>
                  </div>
                );
              })()}

              {/* Exit button */}
              <button onClick={handleExitSession} style={styles.sessionCloseBtn} className="circle-join-btn-hover">
                <X size={20} />
              </button>
            </div>

            {/* Grid Layout */}
            <div style={styles.sessionBodyGrid}>
              {/* Column 1: Main Worship Card */}
              <div style={styles.sessionMainColumn}>
                {sessionEnded ? (
                  <div style={styles.sessionCompletedCard} className="glass-panel text-center fade-in">
                    <div style={styles.completionSparkles}>✨🏆✨</div>
                    <h2 style={styles.completionTitle}>{t('circleSessionEnded')}</h2>
                    <p style={styles.completionSubtitle}>{t('circleCongratulations')}</p>
                    
                    <div style={styles.completionStatsGrid}>
                      <div style={styles.compStatCard}>
                        <span style={styles.compStatLabel}>{t('circleSharedProgress')}</span>
                        <span style={styles.compStatValue}>{circle.sessionProgress}</span>
                      </div>
                      <div style={styles.compStatCard}>
                        <span style={styles.compStatLabel}>{t('circleSessionDuration')}</span>
                        <span style={styles.compStatValue}>{circle.duration} {t('circleMinutes')}</span>
                      </div>
                    </div>

                    {/* Delightful Premium Achievement Tree / شجرة الإنجازات والأوسمة المتميزة */}
                    <div style={styles.achievementTreeSection}>
                      <h4 style={styles.treeSectionTitle}>
                        <Sparkles size={16} color="var(--text-gold)" style={{ marginRight: '6px', marginLeft: '6px' }} />
                        {language === 'en' ? "Premium Achievements Tree" : "شجرة الإنجازات والأوسمة المتميزة"}
                      </h4>
                      <p style={styles.treeSectionSubtitle}>
                        {language === 'en' 
                          ? `Your accumulated Tasbihs: ${tasbihCount} points. Grow your tree to unlock spiritual gifts!`
                          : `رصيد نقاط تسبيحك التراكمي: ${tasbihCount} نقطة. اسعَ لنمو شجرتك لفتح الهدايا والأوسمة!`}
                      </p>

                      <div style={styles.treeVisualContainer}>
                        <svg width="320" height="260" viewBox="0 0 320 260" style={{ margin: '0 auto', display: 'block' }}>
                          {/* Trunk */}
                          <path d="M160,250 C160,200 160,180 160,150" stroke="#8b5a2b" strokeWidth="8" fill="none" strokeLinecap="round" />
                          
                          {/* Primary Branches */}
                          <path d="M160,190 Q120,160 80,140" stroke="#8b5a2b" strokeWidth="4" fill="none" strokeLinecap="round" />
                          <path d="M160,190 Q200,160 240,140" stroke="#8b5a2b" strokeWidth="4" fill="none" strokeLinecap="round" />
                          <path d="M80,140 Q90,105 100,70" stroke="#8b5a2b" strokeWidth="3" fill="none" strokeLinecap="round" />
                          <path d="M240,140 Q230,105 220,70" stroke="#8b5a2b" strokeWidth="3" fill="none" strokeLinecap="round" />
                          
                          {/* Achievement Nodes */}
                          {[
                            { id: "g1", nameEn: "Dhikr Novice", nameAr: "مبتدئ الذكر", req: 50, icon: "🌱", x: 160, y: 190, color: "#10b981" },
                            { id: "g2", nameEn: "Quran Companion", nameAr: "رفيق القرآن", req: 150, icon: "📖", x: 80, y: 140, color: "#3b82f6" },
                            { id: "g3", nameEn: "Morning Pioneer", nameAr: "رائد أذكار الصباح", req: 300, icon: "🌅", x: 240, y: 140, color: "#f59e0b" },
                            { id: "g4", nameEn: "Dhikr Knight", nameAr: "فارس التسبيح", req: 600, icon: "⚔️", x: 100, y: 70, color: "#d4af37" },
                            { id: "g5", nameEn: "Spiritual Light", nameAr: "النور الإلهي", req: 1000, icon: "✨", x: 220, y: 70, color: "#a855f7" }
                          ].map(node => {
                            const isUnlocked = tasbihCount >= node.req;
                            return (
                              <g key={node.id} className="achievement-tree-node">
                                {/* Outer Pulsing Glow */}
                                {isUnlocked && (
                                  <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="22"
                                    fill="none"
                                    stroke={node.color}
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                    className="achievement-glow-pulse"
                                  />
                                )}
                                {/* Badge Base */}
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r="18"
                                  fill={isUnlocked ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.05)'}
                                  stroke={isUnlocked ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.2)'}
                                  strokeWidth={isUnlocked ? '2.5' : '1.5'}
                                  style={{ transition: 'all 0.4s ease' }}
                                />
                                {/* Icon Emoji */}
                                <text
                                  x={node.x}
                                  y={node.y + 5}
                                  textAnchor="middle"
                                  fontSize="16"
                                  style={{ filter: isUnlocked ? 'none' : 'grayscale(100%) opacity(30%)' }}
                                >
                                  {node.icon}
                                </text>
                                
                                <title>
                                  {language === 'en' 
                                    ? `${node.nameEn} (Required: ${node.req} tasbihs) - ${isUnlocked ? 'Unlocked!' : 'Locked'}`
                                    : `${node.nameAr} (مطلوب: ${node.req} تسبيحة) - ${isUnlocked ? 'تم الفتح!' : 'مغلق'}`}
                                </title>
                              </g>
                            );
                          })}
                        </svg>
                      </div>

                      {/* Legend Grid */}
                      <div style={styles.treeNodesLegend}>
                        {[
                          { nameEn: "Dhikr Novice", nameAr: "مبتدئ الذكر", req: 50, icon: "🌱" },
                          { nameEn: "Quran Companion", nameAr: "رفيق القرآن", req: 150, icon: "📖" },
                          { nameEn: "Morning Pioneer", nameAr: "رائد أذكار الصباح", req: 300, icon: "🌅" },
                          { nameEn: "Dhikr Knight", nameAr: "فارس التسبيح", req: 600, icon: "⚔️" },
                          { nameEn: "Spiritual Light", nameAr: "النور الإلهي", req: 1000, icon: "✨" }
                        ].map((item, idx) => {
                          const isUnlocked = tasbihCount >= item.req;
                          return (
                            <div 
                              key={idx} 
                              style={{
                                ...styles.legendItem,
                                opacity: isUnlocked ? 1 : 0.45,
                                borderColor: isUnlocked ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                                background: isUnlocked ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255,255,255,0.01)',
                                flexDirection: language === 'ar' ? 'row-reverse' : 'row'
                              }}
                              className="glass-panel"
                            >
                              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                              <div style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: isUnlocked ? 'var(--text-gold)' : 'var(--text-secondary)' }}>
                                  {language === 'en' ? item.nameEn : item.nameAr}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                  {language === 'en' ? `${item.req} pts` : `${item.req} نقطة`}
                                </div>
                              </div>
                              <div style={{ marginLeft: language === 'ar' ? 0 : 'auto', marginRight: language === 'ar' ? 'auto' : 0 }}>
                                <span style={{ 
                                  fontSize: '0.7rem', 
                                  fontWeight: '600', 
                                  padding: '2px 6px', 
                                  borderRadius: '4px',
                                  background: isUnlocked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                  color: isUnlocked ? '#10b981' : 'var(--text-muted)'
                                }}>
                                  {isUnlocked ? (language === 'en' ? "Unlocked" : "مفتوح") : (language === 'en' ? "Locked" : "مغلق")}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button onClick={handleExitSession} className="btn-primary" style={{ marginTop: '24px', padding: '12px 32px' }}>
                      {language === 'en' ? "Return to Circles" : "العودة إلى الحلقات"}
                    </button>
                  </div>
                ) : (
                  <div style={styles.activeWorshipCard} className="glass-panel">
                    <span style={styles.targetDhikrLabel}>
                      {circle.type === 'quran' 
                        ? (language === 'en' ? "Noble Quran Verse to Recite:" : "آية القرآن الكريم للتلاوة:")
                        : (language === 'en' ? "Active Supplication Focus:" : "الذكر الجماعي المستهدف:")}
                    </span>
                    
                    {/* Centered large Arabic typography text box */}
                    <div style={styles.dhikrTextBox}>
                      <p style={styles.arabicTextQuran}>
                        {language === 'en' ? circle.dhikrTarget : circle.dhikrTargetAr}
                      </p>
                    </div>

                    {/* Teacher Dhikr Editor - Allows teacher to change the active focus on the fly */}
                    {isOrganizer && (
                      <div style={styles.teacherConsoleDhikr} className="glass-panel">
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-gold)', fontWeight: '700', display: 'block', marginBottom: '8px', textAlign: language === 'ar' ? 'right' : 'left' }}>
                          {language === 'en' ? "👑 Teacher Tool: Change active focus for everyone" : "👑 أدوات المعلم: تغيير الذكر أو التلاوة المستهدفة للجميع"}
                        </span>
                        <div style={{ display: 'flex', gap: '8px', width: '100%', flexDirection: language === 'ar' ? 'row-reverse' : 'row' }}>
                          <input 
                            type="text"
                            value={teacherDhikrInputText}
                            onChange={(e) => setTeacherDhikrInputText(e.target.value)}
                            placeholder={circle.type === 'quran' 
                              ? (language === 'en' ? "Enter new verse to recite..." : "أدخل الآية القرآنية الجديدة...") 
                              : (language === 'en' ? "Enter new supplication..." : "أدخل الذكر أو التسبيح الجديد...")}
                            style={styles.teacherDhikrInput}
                          />
                          <button 
                            type="button" 
                            onClick={() => {
                              if (teacherDhikrInputText.trim()) {
                                updateCircleDhikr(circle.id, teacherDhikrInputText, teacherDhikrInputText);
                                setTeacherDhikrInputText("");
                                triggerGoldMilestoneConfetti();
                              }
                            }}
                            style={styles.teacherDhikrBtn}
                            className="circle-join-btn-hover"
                          >
                            {language === 'en' ? "Update" : "تحديث"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Active Reciter Info */}
                    <div style={{ ...styles.activeReciterProfileBanner, flexDirection: language === 'ar' ? 'row-reverse' : 'row' }}>
                      <div style={{ ...styles.reciterDetails, flexDirection: language === 'ar' ? 'row-reverse' : 'row' }}>
                        <span style={styles.reciterAvatarBouncing} className="muslim-avatar-pulse">
                          {activeReciter ? activeReciter.avatar : "🧕"}
                        </span>
                        <div style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
                          <span style={styles.activeReciterStatusLabel}>
                            {isMyTurn ? t('circleYourTurn') : t('circleTurnReciter')}
                          </span>
                          <h4 style={styles.activeReciterName}>
                            {activeReciter ? activeReciter.name : "..."} 
                            {isMyTurn && ` (${language === 'en' ? "You" : "أنت"})`}
                          </h4>
                        </div>
                      </div>

                      {/* Microphone button / soundwave animation */}
                      {isMyTurn ? (
                        <button
                          onClick={() => {
                            setIsMicActive(!isMicActive);
                            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                              navigator.vibrate(30);
                            }
                          }}
                          style={{
                            ...styles.micToggleButton,
                            background: isMicActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            borderColor: isMicActive ? '#ef4444' : '#10b981',
                            color: isMicActive ? '#ef4444' : '#10b981',
                            flexDirection: language === 'ar' ? 'row-reverse' : 'row'
                          }}
                          className={isMicActive ? "pulse-mic-glow" : ""}
                        >
                          <Mic size={16} />
                          <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                            {isMicActive 
                              ? (language === 'en' ? "Mic Active" : "المايك مفتوح") 
                              : (language === 'en' ? "Mic Off" : "المايك مغلق")}
                          </span>
                        </button>
                      ) : (
                        <div style={styles.audioWaveform}>
                          <span style={styles.waveBar} className="wave-bar-anim-1"></span>
                          <span style={styles.waveBar} className="wave-bar-anim-2"></span>
                          <span style={styles.waveBar} className="wave-bar-anim-3"></span>
                          <span style={styles.waveBar} className="wave-bar-anim-4"></span>
                        </div>
                      )}

                      {isMyTurn && isMicActive && (
                        <div style={styles.audioWaveform}>
                          <span style={styles.waveBar} className="wave-bar-anim-1"></span>
                          <span style={styles.waveBar} className="wave-bar-anim-2"></span>
                          <span style={styles.waveBar} className="wave-bar-anim-3"></span>
                          <span style={styles.waveBar} className="wave-bar-anim-4"></span>
                        </div>
                      )}
                    </div>

                    {/* Recitation Turn Action - Console Tabs */}
                    <div style={styles.recitationActions}>
                      {isMyTurn ? (
                        <div style={styles.recitationConsole} className="glass-panel">
                          <div style={{ ...styles.consoleTabRow, flexDirection: language === 'ar' ? 'row-reverse' : 'row' }}>
                            <button 
                              type="button"
                              onClick={() => setRecitationMode("confirm")}
                              style={{
                                ...styles.consoleTabBtn,
                                borderBottom: recitationMode === "confirm" ? '2px solid var(--gold-primary)' : 'none',
                                color: recitationMode === "confirm" ? 'var(--text-gold)' : 'var(--text-secondary)'
                              }}
                            >
                              {language === 'en' ? "Confirm Recitation" : "تأكيد القراءة / التلاوة"}
                            </button>
                            <button 
                              type="button"
                              onClick={() => setRecitationMode("write")}
                              style={{
                                ...styles.consoleTabBtn,
                                borderBottom: recitationMode === "write" ? '2px solid var(--gold-primary)' : 'none',
                                color: recitationMode === "write" ? 'var(--text-gold)' : 'var(--text-secondary)'
                              }}
                            >
                              {language === 'en' ? "Write Reflection" : "كتابة تلاوتي أو تدبري"}
                            </button>
                          </div>

                          <div style={styles.consoleTabContent}>
                            {recitationMode === "confirm" ? (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                  {language === 'en' 
                                    ? "Confirm that you have read the active spiritual focus now." 
                                    : "أكد إتمامك لقراءة الذكر أو الآية القرآنية الجماعية المستهدفة الآن."}
                                </p>
                                <button 
                                  onClick={() => {
                                    incrementCircleProgress(circle.id);
                                    const nextTurn = (circle.currentTurnIndex + 1) % circle.joinedUsers.length;
                                    updateCircleTurn(circle.id, nextTurn);
                                    triggerGoldMilestoneConfetti();
                                  }}
                                  style={styles.confirmRecitationBtn}
                                  className="confirm-recitation-glow"
                                >
                                  <Sparkles size={18} style={{ marginRight: '6px', marginLeft: '6px' }} />
                                  <span>{t('circleConfirmBtn')}</span>
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', padding: '10px 0' }}>
                                <textarea
                                  value={customRecitationText}
                                  onChange={(e) => setCustomRecitationText(e.target.value)}
                                  placeholder={language === 'en' 
                                    ? "Type your own custom recitation, chant count, or personal reflection..." 
                                    : "اكتب تلاوتك الخاصة، تدبرك الروحاني، أو خواطرك المباركة هنا..."}
                                  rows={3}
                                  style={styles.consoleTextArea}
                                />
                                <button 
                                  onClick={() => {
                                    if (!customRecitationText.trim()) return;
                                    addPost(customRecitationText);
                                    incrementCircleProgress(circle.id);
                                    const nextTurn = (circle.currentTurnIndex + 1) % circle.joinedUsers.length;
                                    updateCircleTurn(circle.id, nextTurn);
                                    triggerGoldMilestoneConfetti();
                                  }}
                                  disabled={!customRecitationText.trim()}
                                  style={{
                                    ...styles.confirmRecitationBtn,
                                    opacity: customRecitationText.trim() ? 1 : 0.5,
                                    cursor: customRecitationText.trim() ? 'pointer' : 'not-allowed'
                                  }}
                                >
                                  <Send size={14} style={{ marginRight: '6px', marginLeft: '6px' }} />
                                  <span>{language === 'en' ? "Send Reflection & Complete" : "إرسال التدبر وإكمال الدور"}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div style={styles.waitingStateContainer}>
                          <p style={styles.waitingStateText}>{t('circleWaitingTurn')}</p>
                          
                          {/* Reactions Dock */}
                          <div style={styles.reactionBarDock}>
                            {['🤲', '❤️', '✨', '⭐', '🌸'].map(emoji => (
                              <button 
                                key={emoji}
                                onClick={() => spawnReaction(emoji)}
                                style={styles.reactionDockBtn}
                                className="circle-join-btn-hover"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Column 2: Side Panels */}
              <div style={styles.sessionSidebarColumn}>
                {/* Stats Panel */}
                <div style={{ ...styles.sharedProgressPanel, textAlign: language === 'ar' ? 'right' : 'left' }} className="glass-panel">
                  <h4 style={styles.progressPanelTitle}>
                    <Award size={16} color="var(--text-gold)" style={{ marginRight: '6px', marginLeft: '6px' }} />
                    {t('circleSharedProgress')}
                  </h4>
                  <div style={styles.progressCounterValue}>
                    <span className="gold-gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                      {circle.sessionProgress}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '8px', marginRight: '8px' }}>
                      {language === 'en' ? "completed recitations" : "ذكر وتلاوة جماعية"}
                    </span>
                  </div>
                </div>

                {/* Participant list */}
                <div style={{ ...styles.participantsPanel, textAlign: language === 'ar' ? 'right' : 'left' }} className="glass-panel">
                  <h4 style={styles.progressPanelTitle}>
                    <Users size={16} color="var(--text-gold)" style={{ marginRight: '6px', marginLeft: '6px' }} />
                    {language === 'en' ? `Circle Members (${circle.joinedUsers.length})` : `أعضاء الحلقة (${circle.joinedUsers.length})`}
                  </h4>

                  <div style={styles.participantsScrollList}>
                    {circle.joinedUsers.map((member, idx) => {
                      const isMemberMyTurn = idx === currentTurn;
                      const isMe = member.email === userIdentifier || (userIdentifier === "guest_user" && member.name === "Guest Member");
                      const isMemberOrganizer = member.name === circle.creator || (circle.creator === "System" && idx === 0);

                      return (
                        <div 
                          key={idx} 
                          style={{
                            ...styles.participantItem,
                            borderColor: isMemberMyTurn ? 'var(--gold-primary)' : 'rgba(255,255,255,0.03)',
                            background: isMemberMyTurn ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255,255,255,0.01)',
                            flexDirection: language === 'ar' ? 'row-reverse' : 'row'
                          }}
                        >
                          <div style={{
                            ...styles.participantLeft,
                            flexDirection: language === 'ar' ? 'row-reverse' : 'row'
                          }}>
                            <span style={styles.participantAvatarIcon}>{member.avatar}</span>
                            <div style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
                              <div style={styles.participantName}>
                                {member.name} {isMe && `(${language === 'en' ? "You" : "أنت"})`}
                              </div>
                              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', justifyContent: language === 'ar' ? 'flex-end' : 'flex-start', marginTop: '2px' }}>
                                {isMemberOrganizer && (
                                  <span style={styles.organizerMiniBadge}>
                                    <Crown size={8} />
                                    <span>{language === 'en' ? "Teacher" : "المعلم"}</span>
                                  </span>
                                )}
                                {isMemberMyTurn && (
                                  <span style={styles.recitingMiniBadge}>
                                    <span>{language === 'en' ? "Active" : "دوره الآن"}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Social Friend and Teacher Action buttons */}
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {/* Friend/Follow Connection Action */}
                            {!isMe && (
                              <button
                                onClick={() => {
                                  toggleFriend(member.name);
                                  confetti({
                                    particleCount: 8,
                                    spread: 30,
                                    colors: ['#d4af37', '#ffffff']
                                  });
                                }}
                                style={{
                                  ...styles.friendFollowBtn,
                                  color: friendsList && friendsList.includes(member.name) ? 'var(--text-gold)' : 'var(--text-secondary)',
                                  background: friendsList && friendsList.includes(member.name) ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)',
                                  borderColor: friendsList && friendsList.includes(member.name) ? 'var(--gold-primary)' : 'rgba(255,255,255,0.1)',
                                }}
                                title={friendsList && friendsList.includes(member.name) ? (language === 'en' ? "Friend added" : "صديق مضاف") : (language === 'en' ? "Add Friend" : "إضافة صديق")}
                                className="circle-join-btn-hover"
                              >
                                {friendsList && friendsList.includes(member.name) ? <UserMinus size={13} /> : <UserPlus size={13} />}
                              </button>
                            )}

                            {/* Teacher Turn Assignment */}
                            {isOrganizer && !isMemberMyTurn && (
                              <button 
                                onClick={() => handleAssignTurn(idx)}
                                style={styles.assignTurnBtn}
                                className="circle-join-btn-hover"
                              >
                                {language === 'en' ? "Assign Turn" : "تعيين الدور"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '40px',
  },
  headerIcon: {
    marginBottom: '12px',
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
  tabContainer: {
    display: 'flex',
    gap: '8px',
    padding: '6px',
    borderRadius: '12px',
    maxWidth: '400px',
    margin: '0 auto 40px auto',
  },
  tabBtn: {
    flexGrow: 1,
    border: 'none',
    borderRadius: '8px',
    padding: '10px 0',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  feedLayout: {
    maxWidth: '750px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  postForm: {
    padding: '24px',
    borderRadius: '16px',
  },
  formTitle: {
    fontSize: '1.1rem',
    color: 'var(--text-gold)',
    marginBottom: '12px',
    fontWeight: '600',
  },
  postInput: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '14px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'none',
    transition: 'var(--transition-smooth)',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '14px',
  },
  userNotice: {},
  anonAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  postsFeed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  postCard: {
    padding: '24px',
    borderRadius: '16px',
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  postAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(212, 175, 55, 0.05)',
    border: '1px solid var(--border-gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
  },
  postAuthorName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  postTime: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '1px',
  },
  postContent: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
  postDivider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.04)',
    margin: '18px 0 12px 0',
  },
  postActions: {
    display: 'flex',
    gap: '24px',
  },
  postActionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    transition: 'var(--transition-fast)',
  },
  commentsPanel: {
    marginTop: '18px',
    padding: '16px',
    borderRadius: '12px',
    background: 'rgba(0, 0, 0, 0.1)',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  commentRow: {
    display: 'flex',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.01)',
  },
  commentAvatar: {
    fontSize: '1rem',
  },
  commentDetails: {},
  commentAuthor: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-gold)',
  },
  commentText: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    marginTop: '2px',
  },
  commentForm: {
    display: 'flex',
    gap: '10px',
  },
  commentInput: {
    flexGrow: 1,
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-gold)',
    borderRadius: '20px',
    padding: '8px 16px',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    outline: 'none',
  },
  commentSubmitBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--gold-gradient)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  circlesLayout: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  circlesActionBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '8px',
  },
  tabSectionTitle: {
    fontSize: '1.4rem',
    fontFamily: "'Playfair Display', serif",
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    fontSize: '0.9rem',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  circleFormSuccess: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 18px',
    borderRadius: '10px',
    background: 'rgba(212, 175, 55, 0.08)',
    border: '1px solid var(--border-gold)',
    color: 'var(--text-gold)',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '16px',
  },
  createCircleForm: {
    padding: '24px',
    borderRadius: '16px',
    marginBottom: '24px',
    background: 'rgba(10, 11, 16, 0.75)',
    border: '1px solid var(--border-gold)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  circleInput: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'var(--transition-smooth)',
  },
  circleTextArea: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'none',
    transition: 'var(--transition-smooth)',
  },
  rangeInput: {
    width: '100%',
    accentColor: 'var(--gold-primary)',
    background: 'rgba(255, 255, 255, 0.05)',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    cursor: 'pointer',
  },
  rangeMarkers: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    padding: '0 2px',
  },
  typePresetContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '4px',
  },
  typePresetBtn: {
    padding: '8px 14px',
    fontSize: '0.85rem',
    borderRadius: '8px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
    fontWeight: '500',
  },
  formActionsSubmit: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
  },
  circlesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginTop: '8px',
  },
  circleCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(212, 175, 55, 0.12)',
    position: 'relative',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  goldenCircleCard: {
    background: 'radial-gradient(circle at top left, rgba(212, 175, 55, 0.18) 0%, rgba(20, 17, 10, 0.95) 70%)',
    borderColor: 'var(--gold-primary)',
    boxShadow: '0 10px 30px rgba(212, 175, 55, 0.25), inset 0 0 15px rgba(212, 175, 55, 0.1)',
  },
  circleCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  circleIconWrapper: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-smooth)',
  },
  completeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    background: 'var(--gold-gradient)',
    color: '#000',
    boxShadow: '0 2px 10px rgba(212, 175, 55, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  activeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    background: 'rgba(255,255,255,0.03)',
    color: 'var(--text-secondary)',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  pulseDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 8px #10b981',
  },
  circleTitle: {
    fontSize: '1.25rem',
    fontFamily: "'Playfair Display', serif",
    fontWeight: '600',
    marginBottom: '6px',
    transition: 'var(--transition-smooth)',
  },
  circleDesc: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
    marginBottom: '20px',
    transition: 'var(--transition-smooth)',
  },
  circleDivider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.05)',
    margin: 'auto 0 16px 0',
  },
  progressSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
  },
  memberStatsText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  membersLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  membersCountVal: {
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'baseline',
  },
  circularProgressWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '42px',
    height: '42px',
  },
  progressTextCenter: {
    position: 'absolute',
    fontSize: '0.7rem',
    fontWeight: '700',
    textAlign: 'center',
  },
  avatarsRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  avatarStack: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    height: '28px',
  },
  memberAvatarCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(212, 175, 55, 0.08)',
    border: '1px solid var(--border-gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    position: 'absolute',
    left: 0,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s ease',
  },
  avatarOverflowCount: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(212, 175, 55, 0.25)',
    border: '1px solid var(--border-gold)',
    color: 'var(--text-gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '700',
    position: 'absolute',
    left: 0,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  joinButtonAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '10px 0',
    borderRadius: '12px',
    border: '1px solid',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  tasbihLayout: {
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
  },
  tasbihInfoPanel: {
    width: '100%',
  },
  tasbihInfoCard: {
    padding: '20px',
    borderRadius: '16px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  tasbihInfoLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  tasbihInfoValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  subLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  milestoneNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'rgba(212, 175, 55, 0.06)',
    border: '1px solid var(--border-gold)',
    borderRadius: '30px',
    color: 'var(--text-gold)',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  tasbihClickWrapper: {
    margin: '20px 0',
  },
  tasbihButton: {
    width: '240px',
    height: '240px',
    borderRadius: '50%',
    border: '4px solid var(--gold-primary)',
    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(8, 9, 13, 0.95) 75%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    boxShadow: '0 0 30px rgba(212, 175, 55, 0.1)',
    transition: 'all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  tasbihLabelText: {
    fontSize: '0.8rem',
    letterSpacing: '1.5px',
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  tasbihNumberVal: {
    fontSize: '3.5rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginTop: '6px',
  },
  resetBtn: {
    alignSelf: 'center',
  },
  cardActionsRow: {
    display: 'flex',
    gap: '8px',
    width: '100%',
    marginTop: 'auto',
  },
  enterSessionBtn: {
    flexGrow: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 12px',
    borderRadius: '12px',
    border: '1px solid var(--gold-primary)',
    background: 'var(--gold-gradient)',
    color: '#000',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  leaveButtonAction: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    border: '1px solid rgba(255,107,107,0.2)',
    background: 'rgba(255,107,107,0.05)',
    color: '#ff6b6b',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  sessionOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'radial-gradient(circle at center, rgba(12, 14, 22, 0.98) 0%, rgba(5, 6, 8, 0.99) 100%)',
    backdropFilter: 'blur(30px)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    padding: '24px',
  },
  sessionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '24px',
  },
  sessionHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sessionTypeIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(212, 175, 55, 0.08)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionCircleName: {
    fontSize: '1.4rem',
    fontFamily: "'Playfair Display', serif",
    fontWeight: '600',
    color: '#fff',
    margin: 0,
  },
  sessionOrganizerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  sessionTimerBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  sessionTimerDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#ff4d4d',
    boxShadow: '0 0 10px #ff4d4d',
  },
  sessionTimerVal: {
    fontFamily: 'monospace',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
  },
  sessionCloseBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    transition: 'var(--transition-fast)',
  },
  sessionBodyGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    flexGrow: 1,
    alignItems: 'start',
  },
  sessionMainColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sessionSidebarColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  activeWorshipCard: {
    padding: '32px',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(212, 175, 55, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '20px',
  },
  targetDhikrLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-gold)',
    letterSpacing: '1px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dhikrTextBox: {
    width: '100%',
    padding: '24px',
    borderRadius: '16px',
    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, rgba(0,0,0,0.2) 100%)',
    border: '1px dashed rgba(212, 175, 55, 0.3)',
    margin: '10px 0',
  },
  arabicTextQuran: {
    fontFamily: "'Amiri', 'Georgia', serif",
    fontSize: '1.8rem',
    lineHeight: '2.0',
    color: '#fff',
    margin: 0,
    textShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
  },
  activeReciterProfileBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '16px 20px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
  },
  reciterDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'left',
  },
  reciterAvatarBouncing: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid var(--border-gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.6rem',
  },
  activeReciterStatusLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  activeReciterName: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#fff',
    margin: '2px 0 0 0',
  },
  audioWaveform: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '3px',
    height: '24px',
  },
  waveBar: {
    width: '3px',
    height: '100%',
    background: 'var(--gold-primary)',
    borderRadius: '2px',
    transformOrigin: 'bottom',
  },
  recitationActions: {
    width: '100%',
    marginTop: '10px',
  },
  confirmRecitationBtn: {
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    background: 'var(--gold-gradient)',
    border: 'none',
    color: '#000',
    fontWeight: '800',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  waitingStateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  waitingStateText: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  reactionBarDock: {
    display: 'flex',
    gap: '12px',
    padding: '10px 20px',
    borderRadius: '30px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  reactionDockBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.6rem',
    cursor: 'pointer',
    transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  sharedProgressPanel: {
    padding: '20px',
    borderRadius: '16px',
  },
  progressPanelTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-gold)',
    margin: '0 0 14px 0',
    display: 'flex',
    alignItems: 'center',
  },
  progressCounterValue: {
    display: 'flex',
    alignItems: 'baseline',
  },
  participantsPanel: {
    padding: '20px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '400px',
  },
  participantsScrollList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
    flexGrow: 1,
    paddingRight: '4px',
  },
  participantItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid',
    transition: 'all 0.3s ease',
  },
  participantLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  participantAvatarIcon: {
    fontSize: '1.25rem',
  },
  participantName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  organizerMiniBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    fontSize: '0.65rem',
    background: 'rgba(212, 175, 55, 0.15)',
    color: 'var(--text-gold)',
    padding: '1px 5px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  recitingMiniBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.65rem',
    background: 'rgba(16, 185, 129, 0.15)',
    color: '#10b981',
    padding: '1px 5px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  assignTurnBtn: {
    background: 'none',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '6px',
    color: 'var(--text-gold)',
    fontSize: '0.75rem',
    padding: '4px 8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  sessionCompletedCard: {
    padding: '40px',
    borderRadius: '24px',
    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, rgba(0,0,0,0.3) 100%)',
    border: '2px solid var(--gold-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    width: '100%',
  },
  completionSparkles: {
    fontSize: '3rem',
  },
  completionTitle: {
    fontSize: '1.8rem',
    fontFamily: "'Playfair Display', serif",
    fontWeight: '700',
    color: 'var(--text-gold)',
    margin: 0,
    textShadow: '0 0 15px rgba(212, 175, 55, 0.4)',
  },
  completionSubtitle: {
    fontSize: '1.05rem',
    color: 'var(--text-secondary)',
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  completionStatsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    width: '100%',
    maxWidth: '400px',
    marginTop: '20px',
  },
  compStatCard: {
    padding: '16px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  compStatLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  compStatValue: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#fff',
  },
  circularTimerContainer: {
    position: 'relative',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularTimerText: {
    position: 'absolute',
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#fff',
  },
  micToggleButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid',
    cursor: 'pointer',
    background: 'none',
    transition: 'all 0.25s ease',
  },
  recitationConsole: {
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(212, 175, 55, 0.1)',
  },
  consoleTabRow: {
    display: 'flex',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '12px',
  },
  consoleTabBtn: {
    background: 'none',
    border: 'none',
    padding: '8px 16px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  consoleTabContent: {
    width: '100%',
  },
  consoleTextArea: {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    padding: '10px',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'none',
  },
  friendFollowBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1px solid',
    cursor: 'pointer',
    background: 'none',
    transition: 'all 0.2s ease',
  },
  achievementTreeSection: {
    width: '100%',
    marginTop: '20px',
    padding: '20px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(212, 175, 55, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  treeSectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
    margin: '0 0 4px 0',
    display: 'flex',
    alignItems: 'center',
  },
  treeSectionSubtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    margin: '0 0 20px 0',
    textAlign: 'center',
  },
  treeVisualContainer: {
    width: '100%',
    maxWidth: '320px',
    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.4) 0%, rgba(0,0,0,0.1) 100%)',
    borderRadius: '16px',
    padding: '10px',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  treeNodesLegend: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '10px',
    width: '100%',
    marginTop: '20px',
  },
  legendItem: {
    padding: '10px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid',
    transition: 'all 0.3s ease',
  },
  teacherConsoleDhikr: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(212, 175, 55, 0.03)',
    border: '1px solid rgba(212, 175, 55, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignItems: 'stretch',
    marginBottom: '10px',
  },
  teacherDhikrInput: {
    flexGrow: 1,
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    padding: '8px 12px',
    fontSize: '0.85rem',
    outline: 'none',
  },
  teacherDhikrBtn: {
    background: 'var(--gold-gradient)',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontWeight: '700',
    fontSize: '0.8rem',
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }
};

if (typeof document !== 'undefined') {
  const commStyle = document.createElement('style');
  commStyle.innerHTML = `
    .achievement-glow-pulse {
      animation: achievement-glow-pulse-anim 2s infinite alternate;
    }
    @keyframes achievement-glow-pulse-anim {
      0% { r: 18; opacity: 0.3; }
      100% { r: 24; opacity: 0.9; }
    }
    .pulse-mic-glow {
      animation: pulse-mic-glow-anim 1.5s infinite alternate;
    }
    @keyframes pulse-mic-glow-anim {
      0% { box-shadow: 0 0 8px rgba(239, 68, 68, 0.2); }
      100% { box-shadow: 0 0 16px rgba(239, 68, 68, 0.6); }
    }
    .muslim-avatar-pulse {
      animation: muslim-avatar-pulse-anim 2s infinite alternate;
    }
    @keyframes muslim-avatar-pulse-anim {
      0% { transform: scale(1); box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); }
      100% { transform: scale(1.06); box-shadow: 0 0 15px rgba(212, 175, 55, 0.5); }
    }
    .glow-pulse-tasbih {
      animation: pulse-glow-tasbih 2.5s infinite alternate;
    }
    .glow-pulse-tasbih:active {
      transform: scale(0.94);
      box-shadow: 0 0 40px rgba(212, 175, 55, 0.45) !important;
      border-color: #fff !important;
    }
    @keyframes pulse-glow-tasbih {
      0% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.08); }
      100% { box-shadow: 0 0 45px rgba(212, 175, 55, 0.25); }
    }
    .circle-grid-card {
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .circle-grid-card:hover {
      transform: translateY(-5px) scale(1.02);
      border-color: var(--gold-primary) !important;
      box-shadow: 0 12px 30px rgba(212, 175, 55, 0.2) !important;
    }
    .golden-circle-card {
      animation: golden-pulse-glow 3s infinite alternate;
    }
    .circle-join-btn-hover {
      transition: all 0.2s ease;
    }
    .circle-join-btn-hover:hover {
      transform: scale(1.02);
      filter: brightness(1.1);
    }
    .circle-join-btn-hover:active {
      transform: scale(0.97);
    }
    @keyframes golden-pulse-glow {
      0% {
        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2), inset 0 0 15px rgba(212, 175, 55, 0.05);
        border-color: rgba(212, 175, 55, 0.8) !important;
      }
      100% {
        box-shadow: 0 15px 45px rgba(212, 175, 55, 0.35), inset 0 0 25px rgba(212, 175, 55, 0.15);
        border-color: rgba(255, 223, 128, 1) !important;
      }
    }
    .gold-glow-text {
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
    }

    /* Floating emoji reactions layer */
    @keyframes floatUp {
      0% {
        transform: translateY(100vh) scale(0.6) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 0.9;
      }
      100% {
        transform: translateY(-20vh) scale(1.5) rotate(360deg);
        opacity: 0;
      }
    }
    .floating-reactions-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10000;
      overflow: hidden;
    }
    .floating-reaction {
      position: absolute;
      bottom: 0;
      font-size: 2.5rem;
      text-shadow: 0 4px 15px rgba(0,0,0,0.3);
      filter: drop-shadow(0 0 10px rgba(255,255,255,0.4));
      animation: floatUp 2.5s ease-out forwards;
    }

    /* Voice and speaker animations */
    @keyframes bounce-wave {
      0%, 100% { transform: scaleY(0.3); }
      50% { transform: scaleY(1.0); }
    }
    .wave-bar-anim-1 {
      animation: bounce-wave 0.8s ease-in-out infinite;
    }
    .wave-bar-anim-2 {
      animation: bounce-wave 0.5s ease-in-out infinite 0.15s;
    }
    .wave-bar-anim-3 {
      animation: bounce-wave 0.7s ease-in-out infinite 0.3s;
    }
    .wave-bar-anim-4 {
      animation: bounce-wave 0.6s ease-in-out infinite 0.45s;
    }
    @keyframes pulse-glow-timer {
      0% { opacity: 0.4; }
      100% { opacity: 1; }
    }
    @keyframes bounce-speaker {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    .confirm-recitation-glow {
      animation: button-pulse-glow 2.0s infinite alternate;
    }
    @keyframes button-pulse-glow {
      0% {
        box-shadow: 0 8px 30px rgba(212, 175, 55, 0.25);
        transform: scale(1);
      }
      100% {
        box-shadow: 0 12px 45px rgba(212, 175, 55, 0.5);
        transform: scale(1.02);
      }
    }

    /* RTL translations for board elements */
    [dir="rtl"] .community-page [style*="commentInput"] {
      text-align: right !important;
    }
    [dir="rtl"] .community-page [style*="postInput"] {
      text-align: right !important;
    }
    [dir="rtl"] .community-page [style*="commentRow"] {
      text-align: right !important;
    }
    [dir="rtl"] .community-page [style*="commentDetails"] {
      text-align: right !important;
    }
    [dir="rtl"] .community-page [style*="commentAuthor"] {
      text-align: right !important;
    }
    [dir="rtl"] .community-page [style*="commentText"] {
      text-align: right !important;
    }
    [dir="rtl"] .community-page [style*="postContent"] {
      text-align: right !important;
    }
    [dir="rtl"] .community-page [style*="formTitle"] {
      text-align: right !important;
    }
    [dir="rtl"] .community-page [style*="commentForm"] {
      flex-direction: row-reverse !important;
    }
    [dir="rtl"] .community-page [style*="circlesActionBar"] {
      flex-direction: row-reverse !important;
    }
    [dir="rtl"] .community-page [style*="formActionsSubmit"] {
      flex-direction: row-reverse !important;
      justify-content: flex-start !important;
    }
    [dir="rtl"] .community-page [style*="progressSection"] {
      flex-direction: row-reverse !important;
    }
    [dir="rtl"] .community-page [style*="memberStatsText"] {
      text-align: right !important;
    }
    [dir="rtl"] .community-page [style*="membersCountVal"] {
      flex-direction: row-reverse !important;
    }
    [dir="rtl"] .community-page [style*="avatarStack"] {
      flex-direction: row-reverse !important;
    }
    [dir="rtl"] .community-page [style*="circleCardHeader"] {
      flex-direction: row-reverse !important;
    }

    /* Live Session RTL alignment overrides */
    [dir="rtl"] .community-page [style*="sessionHeader"] {
      flex-direction: row-reverse !important;
    }
    [dir="rtl"] .community-page [style*="sessionHeaderLeft"] {
      flex-direction: row-reverse !important;
    }
    [dir="rtl"] .community-page [style*="reciterDetails"] {
      flex-direction: row-reverse !important;
    }
    [dir="rtl"] .community-page [style*="participantItem"] {
      flex-direction: row-reverse !important;
    }
    [dir="rtl"] .community-page [style*="participantLeft"] {
      flex-direction: row-reverse !important;
    }
  `;
  document.head.appendChild(commStyle);
}
