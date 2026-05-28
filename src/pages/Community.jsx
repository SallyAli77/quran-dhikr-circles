import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Send, Heart, MessageSquare, Award, AlertCircle, PlusCircle, RotateCcw, HeartHandshake, BookOpen, Sparkles, Crown, UserPlus, UserMinus, Plus, Compass } from 'lucide-react';
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
  const [formSuccess, setFormSuccess] = useState(false);

  // Simulated global click counters
  const [globalDhikr, setGlobalDhikr] = useState(48293);
  const [activeUsers, setActiveUsers] = useState(1280);

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
      type: newCircleType
    });

    setNewCircleName("");
    setNewCircleDesc("");
    setNewCircleCap(5);
    setNewCircleType("adhkar");
    
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
    <div className="community-page container fade-in" style={{ minHeight: '80vh' }}>
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

              <div style={styles.formGroup} style={{ marginTop: '12px' }}>
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

              <div style={styles.formGroup} style={{ marginTop: '12px' }}>
                <label style={styles.formLabel}>{t('circleFormType')}</label>
                <div style={styles.typePresetContainer}>
                  {['adhkar', 'quran', 'istighfar', 'salawat'].map(tType => (
                    <button
                      key={tType}
                      type="button"
                      onClick={() => setNewCircleType(tType)}
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
                            transform: `translateX(${language === 'ar' ? idx * 8 : -idx * 8}px)`
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
                            transform: `translateX(${language === 'ar' ? 5 * 8 : -5 * 8}px)`
                          }}
                        >
                          +{totalJoined - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Join Action button */}
                  <button 
                    onClick={() => handleJoinCircleClick(circle.id)} 
                    style={{
                      ...styles.joinButtonAction,
                      background: isJoined 
                        ? 'rgba(255,107,107,0.08)' 
                        : (isFull ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.02)'),
                      color: isJoined 
                        ? '#ff6b6b' 
                        : (isFull ? '#000' : 'var(--text-gold)'),
                      borderColor: isJoined 
                        ? 'rgba(255,107,107,0.25)' 
                        : (isFull ? 'var(--gold-primary)' : 'var(--border-gold)')
                    }}
                    className="circle-join-btn-hover"
                  >
                    {isJoined ? (
                      <>
                        <UserMinus size={14} />
                        <span>{t('circleLeave')}</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        <span>{isFull ? (language === 'en' ? "Keep Participating" : "استمر بالمشاركة") : t('circleJoin')}</span>
                      </>
                    )}
                  </button>
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
  }
};

if (typeof document !== 'undefined') {
  const commStyle = document.createElement('style');
  commStyle.innerHTML = `
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
    [dir="rtl"] .community-page [style*="memberAvatarCircle"] {
      left: auto !important;
      right: 0 !important;
    }
    [dir="rtl"] .community-page [style*="avatarOverflowCount"] {
      left: auto !important;
      right: 0 !important;
    }
    [dir="rtl"] .community-page [style*="circleCardHeader"] {
      flex-direction: row-reverse !important;
    }
  `;
  document.head.appendChild(commStyle);
}
