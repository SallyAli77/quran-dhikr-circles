import React, { useState } from 'react';
import { useApp, mockBots, globalMuslimNews } from '../context/AppContext';
import { 
  BookOpen, Compass, Users, FileText, ShoppingBag, Star, ArrowRight, Award, 
  Flame, Heart, MessageCircle, Send, CheckCircle2, ChevronRight, Share2, AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Home({ setActivePage }) {
  const { 
    language, 
    searchQuery, 
    t, 
    isAuthenticated, 
    user, 
    communityPosts, 
    addPost, 
    likePost, 
    addComment, 
    dailyScore, 
    completedGoals, 
    completeDailyGoal, 
    unlockedBadges, 
    unlockBadgeAction,
    articlesList,
    tasbihCount,
    friendsList,
    sendFriendRequest,
    friendRequestsSent
  } = useApp();

  // Social feed states
  const [reflectionText, setReflectionText] = useState("");
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [commentText, setCommentText] = useState({});

  // Handpicked high-end Islamic products from Amazon
  const amazonProducts = [
    {
      id: "p1",
      title: "The Quran: English Translation",
      titleAr: "القرآن الكريم: ترجمة إنجليزية بواسطة عبد الحليم",
      author: "M.A.S. Abdel Haleem (Oxford)",
      category: "Books",
      categoryAr: "كتب ورقية",
      price: "$14.95",
      rating: 4.9,
      reviews: 5840,
      description: "The most readable, contemporary English translation of the Quran, capturing its spiritual essence and literary eloquence perfectly.",
      descriptionAr: "الترجمة الإنجليزية الأكثر وضوحاً وبلاغة لآيات القرآن الكريم مع الحفاظ على المقاصد البلاغية والجمالية الأدبية.",
      image: "📖",
      link: "https://www.amazon.com/s?k=M.A.S.+Abdel+Haleem+Quran+Oxford"
    },
    {
      id: "p2",
      title: "Arabic Stories for Learners",
      titleAr: "قصص عربية لمتعلمي اللغة",
      author: "Lutfi Mansur & Brosh",
      category: "Learning Arabic",
      categoryAr: "تعلم العربية",
      price: "$18.99",
      rating: 4.8,
      reviews: 320,
      description: "A gorgeous compilation of bilingual Arabic-English short stories, providing authentic cultural context and vocabulary keys.",
      descriptionAr: "مجموعة رائعة من القصص القصيرة ثنائية اللغة (عربي-إنجليزي) تمنح المتعلمين مفردات لغوية ممتازة وسياقاً ثقافياً أصيلاً.",
      image: "📚",
      link: "https://www.amazon.com/s?k=Arabic+Stories+for+Language+Learners"
    },
    {
      id: "p3",
      title: "Luxury Gold velvet Rug",
      titleAr: "سجادة صلاة مخملية فاخرة مطرزة بالذهب",
      author: "Al-Mihrab Collection",
      category: "Islamic Decor",
      categoryAr: "مستلزمات إسلامية",
      price: "$34.90",
      rating: 4.9,
      reviews: 1420,
      description: "Thick premium orthopedic velvet rug with elegant gold geometric patterns. Designed to offer comfort and aesthetic serenity.",
      descriptionAr: "سجادة مخملية سميكة ومريحة مطرزة بخيوط ذهبية وتفاصيل هندسية إسلامية أنيقة تمنحك الطمأنينة والهدوء أثناء الصلاة.",
      image: "🕌",
      link: "https://www.amazon.com/s?k=Premium+velvet+islamic+prayer+rug"
    },
    {
      id: "p4",
      title: "Smart Digital Tasbih Ring",
      titleAr: "خاتم التسبيح الذكي بتقنية بلوتوث",
      author: "iQibla Smart Tech",
      category: "Smart Counter",
      categoryAr: "أجهزة ذكية",
      price: "$29.99",
      rating: 4.7,
      reviews: 890,
      description: "A premium alloy smart ring that logs dhikr counts, syncs with application, and vibrates softly at milestones (33, 66, 99).",
      descriptionAr: "خاتم ذكي لتسجيل الأذكار، يتزامن مع التطبيقات ويهتز بلطف لتنبيهك عند الوصول للعدد المطلوب والورد المكتوب.",
      image: "💍",
      link: "https://www.amazon.com/s?k=Smart+digital+tasbih+ring+iqibla"
    }
  ];

  // Daily gamified goals definition
  const dailyGoalsList = [
    { id: "tap_subha", labelEn: "Tap Subha beads 100 times", labelAr: "التسبيح بالسبحة 100 مرة", points: 50, current: tasbihCount, target: 100 },
    { id: "share_reflection", labelEn: "Publish a faith reflection", labelAr: "نشر خاطرة إيمانية مفيدة", points: 50, current: completedGoals.includes("share_reflection") ? 1 : 0, target: 1 },
    { id: "read_article", labelEn: "Read an educational article", labelAr: "قراءة مقال لغوي أو ديني", points: 50, current: completedGoals.includes("read_article") ? 1 : 0, target: 1 },
    { id: "recite_quran", labelEn: "Bookmark a Noble Quran verse", labelAr: "تصفح وحفظ علامة لآية قرآنية", points: 50, current: completedGoals.includes("recite_quran") ? 1 : 0, target: 1 }
  ];

  // Badges catalog
  const badgesCatalog = [
    { id: "dhikr_pioneer", labelEn: "Remembrance Pioneer", labelAr: "رائد الأذكار", icon: "✨", descEn: "Initial registration bonus.", descAr: "وسام الانضمام الفاخر" },
    { id: "tasbih_master", labelEn: "Tasbih Devotee", labelAr: "المسبح الدائم", icon: "📿", descEn: "Reaching 100 daily tasbih taps.", descAr: "إتمام 100 تسبيحة بالسبحة" },
    { id: "knowledge_seeker", labelEn: "Knowledge Seeker", labelAr: "طالب العلم", icon: "📖", descEn: "Unlocks by reading articles.", descAr: "قراءة المقالات الإسلامية" },
    { id: "teacher_qualified", labelEn: "Tajweed Master", labelAr: "المعلم المرتل", icon: "🎓", descEn: "Passing the certified teacher test.", descAr: "اجتياز اختبار التجويد الشريف" }
  ];

  // Handle post submit
  const handlePublishReflection = (e) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    addPost(reflectionText);
    setReflectionText("");
    
    // Complete Daily Goal
    completeDailyGoal("share_reflection", 50);

    // Play confetti
    confetti({
      particleCount: 40,
      spread: 55,
      colors: ['#d4af37', '#ffffff']
    });
  };

  // Handle comment submit
  const handleCommentSubmit = (postId, text) => {
    if (!text || !text.trim()) return;
    addComment(postId, text);
    setCommentText(prev => ({ ...prev, [postId]: "" }));
  };

  // Check and unlock dynamic badges based on actions
  React.useEffect(() => {
    if (tasbihCount >= 100) {
      unlockBadgeAction("tasbih_master");
    }
  }, [tasbihCount]);

  // Combine feed: Community Posts + Global Muslim News + Select Premium Articles
  const feedItems = [
    ...communityPosts.map(p => ({ ...p, type: 'post' })),
    ...globalMuslimNews.map(n => ({ ...n, type: 'news' })),
    ...articlesList.slice(0, 3).map(a => ({ ...a, type: 'article' }))
  ].sort((a, b) => {
    // Keep seed/new posts near top, alternate cleanly
    if (a.timestamp === "Just now") return -1;
    if (b.timestamp === "Just now") return 1;
    return 0;
  });

  return (
    <div className="home-page container fade-in" style={{ paddingBottom: '80px', paddingTop: '30px' }}>
      
      {/* 3-Column Facebook-style Framework */}
      <div style={styles.fbLayout}>
        
        {/* ================= LEFT COLUMN: Quick Stats & Gamification ================= */}
        <aside style={styles.leftCol} className="glass-panel">
          <div className="islamic-pattern"></div>
          
          {/* User profile brief card */}
          <div style={styles.briefProfileRow}>
            <span style={styles.briefAvatar}>{isAuthenticated ? user.avatar : "🕌"}</span>
            <div>
              <h3 style={styles.briefName} className="gold-gradient-text">
                {isAuthenticated ? user.name : "Zair Muslim"}
              </h3>
              <span style={styles.briefRole}>
                {isAuthenticated ? user.role : t('navLogin')}
                {user.teacherLevel && ` (${user.teacherLevel})`}
              </span>
            </div>
          </div>

          <div style={styles.pointsWidget}>
            <Award size={20} color="var(--text-gold)" />
            <div>
              <span style={styles.widgetScoreText}>{dailyScore}</span>
              <span style={styles.widgetLabel}> {language === 'ar' ? "نقاط السكور اليومي" : "Daily Score Points"}</span>
            </div>
          </div>

          {/* Daily Goals Progress Tracker */}
          <div style={styles.goalsContainer}>
            <h4 style={styles.sidebarSectionTitle}>
              <Flame size={16} color="var(--text-gold)" />
              <span>{language === 'ar' ? "الأهداف اليومية" : "Daily goals tracker"}</span>
            </h4>
            
            <div style={styles.goalsList}>
              {dailyGoalsList.map(g => {
                const isDone = completedGoals.includes(g.id) || (g.id === "tap_subha" && tasbihCount >= 100);
                const progressPct = Math.min(100, (g.current / g.target) * 100);
                
                return (
                  <div key={g.id} style={styles.goalItem} onClick={() => {
                    if (g.id === "read_article") {
                      setActivePage('articles');
                    } else if (g.id === "recite_quran") {
                      setActivePage('quran');
                    }
                  }}>
                    <div style={styles.goalMetaRow}>
                      <span style={{
                        ...styles.goalLabel,
                        textDecoration: isDone ? 'line-through' : 'none',
                        color: isDone ? 'var(--text-muted)' : 'var(--text-primary)'
                      }}>
                        {language === 'ar' ? g.labelAr : g.labelEn}
                      </span>
                      <span style={styles.goalPoints}>+{g.points} XP</span>
                    </div>
                    
                    <div style={styles.progressBarBg}>
                      <div style={{
                        ...styles.progressBarFill,
                        width: `${progressPct}%`,
                        background: isDone ? 'var(--gold-gradient)' : 'linear-gradient(90deg, #b38728 0%, #daae48 100%)'
                      }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Badges gallery brief */}
          <div style={styles.badgesWidget}>
            <h4 style={styles.sidebarSectionTitle}>
              <Award size={16} color="var(--text-gold)" />
              <span>{language === 'ar' ? "شارات إنجازاتك" : "My Badges Gallery"}</span>
            </h4>
            
            <div style={styles.badgeEmojisRow}>
              {badgesCatalog.map(b => {
                const isUnlocked = unlockedBadges.includes(b.id) || (b.id === "teacher_qualified" && user.role === "Certified Teacher");
                return (
                  <div 
                    key={b.id} 
                    style={{
                      ...styles.badgeBubble,
                      opacity: isUnlocked ? 1 : 0.25,
                      filter: isUnlocked ? 'grayscale(0)' : 'grayscale(1)',
                      borderColor: isUnlocked ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)'
                    }}
                    title={language === 'ar' ? `${b.labelAr} - ${b.descAr}` : `${b.labelEn} - ${b.descEn}`}
                  >
                    <span>{b.icon}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Active Bots recommendation list */}
          <div style={styles.botsContainer}>
            <h4 style={styles.sidebarSectionTitle}>
              <Users size={16} color="var(--text-gold)" />
              <span>{language === 'ar' ? "مقترحات أصدقاء" : "Simulated Active Muslims"}</span>
            </h4>
            
            <div style={styles.botsList}>
              {mockBots.slice(0, 3).map(bot => {
                const isFriend = friendsList.includes(bot.name);
                const isSent = friendRequestsSent.some(r => r.email === bot.email);

                return (
                  <div key={bot.email} style={styles.botRow}>
                    <span style={styles.botAvatar}>{bot.avatar}</span>
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={styles.botName}>{bot.name}</div>
                      <span style={styles.botSub}>{bot.role || "Worshipper"}</span>
                    </div>
                    
                    {!isFriend ? (
                      <button 
                        onClick={() => sendFriendRequest({ name: bot.name, email: bot.email, avatar: bot.avatar })}
                        style={{
                          ...styles.botAddBtn,
                          backgroundColor: isSent ? 'rgba(212,175,55,0.05)' : 'rgba(212,175,55,0.1)',
                          color: isSent ? 'var(--text-muted)' : 'var(--text-gold)',
                          borderColor: isSent ? 'transparent' : 'var(--border-gold)'
                        }}
                        disabled={isSent}
                      >
                        {isSent ? (language === 'ar' ? "معلق" : "Sent") : "+"}
                      </button>
                    ) : (
                      <span style={styles.friendCheck}>✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ================= CENTER COLUMN: Social News Feed ================= */}
        <section style={styles.centerCol}>
          
          {/* Facebook-style Publisher Box */}
          {isAuthenticated && (
            <div style={styles.publishBox} className="glass-panel">
              <h4 style={styles.publishTitle}>{t('commCreatePost')}</h4>
              <form onSubmit={handlePublishReflection} style={styles.publishForm}>
                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder={t('commPostPlaceholder')}
                  style={styles.publishArea}
                  rows={3}
                />
                
                <div style={styles.publishFooter}>
                  <span style={styles.publishWordCount}>{reflectionText.length} / 300</span>
                  <button type="submit" className="btn-primary" style={styles.publishSubmitBtn}>
                    <Send size={14} />
                    <span>{t('commPostButton')}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Dynamic Mixed Feed list */}
          <div style={styles.feedList}>
            {feedItems.map((item, idx) => {
              if (item.type === 'post') {
                const userLiked = item.likedBy && item.likedBy.includes(user.email);
                const isTeacher = mockBots.some(b => b.name === item.author && b.role === "Certified Teacher");
                const botMatch = mockBots.find(b => b.name === item.author);
                
                return (
                  <article key={item.id || idx} style={styles.feedCard} className="glass-panel">
                    <header style={styles.feedCardHeader}>
                      <span style={styles.feedCardAvatar}>{item.avatar}</span>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={styles.feedCardAuthor}>{item.author}</span>
                          {isTeacher && (
                            <span style={styles.teacherBadge} title={language === 'ar' ? "معلم معتمد" : "Certified Quran & Tajweed Teacher"}>
                              🎓 {botMatch?.level || "Teacher"}
                            </span>
                          )}
                        </div>
                        <span style={styles.feedCardTime}>{item.timestamp}</span>
                      </div>
                    </header>

                    <p style={styles.feedCardText}>
                      {language === 'ar' ? item.contentAr : item.content}
                    </p>

                    <div style={styles.feedCardDivider}></div>

                    <footer style={styles.feedActions}>
                      <button 
                        onClick={() => likePost(item.id)} 
                        style={{
                          ...styles.feedActionBtn,
                          color: userLiked ? '#ff6b6b' : 'var(--text-secondary)'
                        }}
                      >
                        <Heart size={16} fill={userLiked ? '#ff6b6b' : 'none'} />
                        <span>{item.likes} {language === 'ar' ? "أعجبني" : "Likes"}</span>
                      </button>

                      <button 
                        onClick={() => setActiveCommentsPostId(activeCommentsPostId === item.id ? null : item.id)} 
                        style={styles.feedActionBtn}
                      >
                        <MessageCircle size={16} />
                        <span>{item.comments ? item.comments.length : 0} {language === 'ar' ? "تعليق" : "Comments"}</span>
                      </button>
                    </footer>

                    {/* Expandable Comment Section */}
                    {activeCommentsPostId === item.id && (
                      <div style={styles.commentSectionBg} className="glass-panel fade-in">
                        <div style={styles.commentsList}>
                          {item.comments && item.comments.map(c => (
                            <div key={c.id} style={styles.commentBubbleRow}>
                              <span style={styles.commentAvatar}>{c.avatar}</span>
                              <div style={styles.commentTextCard}>
                                <div style={styles.commentAuthorName}>{c.author}</div>
                                <p style={styles.commentBubbleText}>{c.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Direct input box */}
                        <div style={styles.commentInputRow}>
                          <input 
                            type="text" 
                            placeholder={language === 'ar' ? "اكتب تعليقك الطاهر هنا..." : "Write your comment here..."}
                            value={commentText[item.id] || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCommentText(prev => ({ ...prev, [item.id]: val }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleCommentSubmit(item.id, commentText[item.id]);
                              }
                            }}
                            style={styles.commentInputBox}
                          />
                          <button 
                            onClick={() => handleCommentSubmit(item.id, commentText[item.id])} 
                            style={styles.commentSendBtn}
                          >
                            <Send size={14} color="var(--text-gold)" />
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              } else if (item.type === 'news') {
                return (
                  <article key={item.id || idx} style={styles.newsCard} className="glass-panel">
                    <div style={styles.newsBadge}>
                      <AlertCircle size={12} color="var(--text-gold)" />
                      <span>{language === 'ar' ? "أخبار العالم الإسلامي" : "Global Muslim News"}</span>
                    </div>

                    <h3 style={styles.newsCardTitle}>
                      {language === 'ar' ? item.titleAr : item.title}
                    </h3>

                    <p style={styles.newsCardText}>
                      {language === 'ar' ? item.summaryAr : item.summary}
                    </p>

                    <div style={styles.newsCardFooter}>
                      <span style={styles.newsSource}>
                        {language === 'ar' ? item.sourceAr : item.source} • {item.date}
                      </span>
                      
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <span style={styles.newsReactText}>❤️ {item.likes}</span>
                        <span style={styles.newsReactText}>💬 {item.commentsCount}</span>
                      </div>
                    </div>
                  </article>
                );
              } else if (item.type === 'article') {
                return (
                  <article key={item.id || idx} style={styles.articleCard} className="glass-panel" onClick={() => setActivePage('articles')}>
                    <span style={styles.articleCardCategory}>
                      {language === 'ar' ? item.categoryAr : item.category}
                    </span>

                    <h3 style={styles.articleCardTitle} className="gold-gradient-text">
                      {language === 'ar' ? item.titleAr : item.title}
                    </h3>

                    <p style={styles.articleCardDesc}>
                      {language === 'ar' ? item.summaryAr : item.summary}
                    </p>

                    <div style={styles.articleFooter}>
                      <div style={styles.articleAuthorRow}>
                        <span style={styles.articleAvatar}>{item.avatar}</span>
                        <span style={styles.articleAuthor}>{language === 'ar' ? item.authorAr : item.author}</span>
                      </div>

                      <div style={styles.articleTimeBadge}>
                        <span>{item.readTime} {language === 'ar' ? "دقائق" : "min read"}</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </article>
                );
              }
              return null;
            })}
          </div>
        </section>

        {/* ================= RIGHT COLUMN: Sponsored Bookstore (Amazon Showcase) ================= */}
        <aside style={styles.rightCol} className="glass-panel">
          <div style={styles.storeHeader}>
            <ShoppingBag size={18} color="var(--text-gold)" />
            <h3 style={styles.rightColTitle}>{language === 'ar' ? "المتجر الإسلامي الموصى به" : "Recommended Literature"}</h3>
          </div>
          <p style={styles.storeSubtitle}>
            {language === 'ar' ? "كتب ومنتجات حائزة على أعلى التقييمات في موقع أمازون" : "Affiliate handpicked publications on Amazon."}
          </p>

          <div style={styles.amazonList}>
            {amazonProducts.map(p => (
              <div key={p.id} style={styles.amazonCard} className="glass-panel">
                {/* Fixed centered icon/illustration */}
                <div style={styles.amazonImageWrapper}>
                  <span style={styles.amazonEmoji}>{p.image}</span>
                </div>

                <div style={styles.amazonCardBody}>
                  <span style={styles.amazonCategory}>{language === 'ar' ? p.categoryAr : p.category}</span>
                  <h4 style={styles.amazonProductTitle}>{language === 'ar' ? p.titleAr : p.title}</h4>
                  
                  {/* Rating Stars Grid */}
                  <div style={styles.ratingRow}>
                    <div style={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={10} 
                          fill={i < Math.floor(p.rating) ? "var(--gold-primary)" : "none"} 
                          color="var(--gold-primary)" 
                        />
                      ))}
                    </div>
                    <span style={styles.starsLabel}>{p.rating}</span>
                  </div>

                  <p style={styles.amazonDesc}>
                    {language === 'ar' ? p.descriptionAr : p.description}
                  </p>

                  <div style={styles.amazonCardDivider}></div>

                  <div style={styles.amazonFooter}>
                    <span style={styles.amazonPrice}>{p.price}</span>
                    <a 
                      href={p.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-primary" 
                      style={styles.amazonBuyBtn}
                    >
                      <span>{language === 'ar' ? "أمازون" : "View"}</span>
                      <ArrowRight size={10} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

      </div>

    </div>
  );
}

const styles = {
  fbLayout: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: '1280px',
    margin: '0 auto',
    flexWrap: 'wrap',
  },
  leftCol: {
    flex: '1 1 280px',
    maxWidth: '320px',
    padding: '24px 20px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  centerCol: {
    flex: '2 1 600px',
    maxWidth: '650px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  rightCol: {
    flex: '1 1 280px',
    maxWidth: '320px',
    padding: '24px 20px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  briefProfileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '14px',
    zIndex: 1,
  },
  briefAvatar: {
    fontSize: '2.4rem',
    background: 'rgba(212, 175, 55, 0.1)',
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--gold-primary)',
  },
  briefName: {
    fontSize: '1.1rem',
    fontWeight: '700',
  },
  briefRole: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    display: 'block',
    marginTop: '2px',
  },
  pointsWidget: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(212, 175, 55, 0.05)',
    border: '1px solid var(--border-gold)',
    borderRadius: '12px',
    zIndex: 1,
  },
  widgetScoreText: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--text-gold)',
    lineHeight: '1.1',
  },
  widgetLabel: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
  },
  sidebarSectionTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '10px',
  },
  goalsContainer: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '16px',
    zIndex: 1,
  },
  goalsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  goalItem: {
    cursor: 'pointer',
  },
  goalMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    marginBottom: '6px',
  },
  goalLabel: {
    fontWeight: '500',
    fontSize: '0.78rem',
  },
  goalPoints: {
    color: 'var(--text-gold)',
    fontWeight: '600',
    fontSize: '0.75rem',
  },
  progressBarBg: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '4px',
    height: '6px',
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  badgesWidget: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '16px',
    zIndex: 1,
  },
  badgeEmojisRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  badgeBubble: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    cursor: 'help',
    transition: 'all 0.3s ease',
  },
  botsContainer: {
    zIndex: 1,
  },
  botsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  botRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  botAvatar: {
    fontSize: '1.4rem',
    width: '32px',
    height: '32px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botName: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  botSub: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    display: 'block',
  },
  botAddBtn: {
    border: '1px solid',
    borderRadius: '6px',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '0.78rem',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
  },
  friendCheck: {
    color: 'var(--text-gold)',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    paddingRight: '6px',
  },
  publishBox: {
    padding: '20px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  publishTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-gold)',
  },
  publishForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  publishArea: {
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '12px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'none',
    width: '100%',
    fontFamily: 'inherit',
  },
  publishFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  publishWordCount: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  publishSubmitBtn: {
    padding: '8px 18px',
    fontSize: '0.85rem',
  },
  feedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  feedCard: {
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  feedCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  feedCardAvatar: {
    fontSize: '1.8rem',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '50%',
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedCardAuthor: {
    fontWeight: '700',
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
  },
  teacherBadge: {
    background: 'rgba(212,175,55,0.1)',
    border: '1px solid var(--border-gold)',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '0.7rem',
    color: 'var(--text-gold)',
    fontWeight: '700',
  },
  feedCardTime: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    display: 'block',
  },
  feedCardText: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: 'var(--text-primary)',
    whiteSpace: 'pre-line',
  },
  feedCardDivider: {
    height: '1px',
    background: 'rgba(255,255,255,0.05)',
  },
  feedActions: {
    display: 'flex',
    gap: '20px',
  },
  feedActionBtn: {
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  commentSectionBg: {
    background: 'rgba(255,255,255,0.01)',
    borderRadius: '12px',
    padding: '12px',
    marginTop: '8px',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '10px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  commentBubbleRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  commentAvatar: {
    fontSize: '1.1rem',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentTextCard: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    padding: '8px 12px',
    flexGrow: 1,
  },
  commentAuthorName: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
  },
  commentBubbleText: {
    fontSize: '0.82rem',
    color: 'var(--text-primary)',
    marginTop: '2px',
  },
  commentInputRow: {
    display: 'flex',
    gap: '8px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '10px',
  },
  commentInputBox: {
    flexGrow: 1,
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--border-gold)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
    outline: 'none',
  },
  commentSendBtn: {
    background: 'rgba(212,175,55,0.1)',
    border: '1px solid var(--border-gold)',
    borderRadius: '8px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  newsCard: {
    padding: '20px',
    borderRadius: '16px',
    borderLeft: '4px solid var(--gold-primary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  newsBadge: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(212,175,55,0.08)',
    border: '1px solid var(--border-gold)',
    borderRadius: '12px',
    padding: '3px 8px',
    fontSize: '0.72rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  newsCardTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
  },
  newsCardText: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  newsCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    borderTop: '1px solid rgba(255,255,255,0.03)',
    paddingTop: '10px',
  },
  newsSource: {
    fontStyle: 'italic',
  },
  newsReactText: {
    fontWeight: '600',
  },
  articleCard: {
    padding: '20px',
    borderRadius: '16px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    transition: 'all 0.3s ease',
  },
  articleCardCategory: {
    alignSelf: 'flex-start',
    fontSize: '0.7rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '2px 8px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  articleCardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    lineHeight: '1.4',
  },
  articleCardDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  articleFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255,255,255,0.03)',
    paddingTop: '10px',
    fontSize: '0.78rem',
  },
  articleAuthorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  articleAvatar: {
    fontSize: '1.1rem',
  },
  articleAuthor: {
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  articleTimeBadge: {
    color: 'var(--text-gold)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: '600',
  },
  storeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '10px',
  },
  rightColTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
  },
  storeSubtitle: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    marginBottom: '8px',
  },
  amazonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  amazonCard: {
    borderRadius: '14px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  amazonImageWrapper: {
    height: '110px',
    background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, rgba(255,255,255,0.01) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  amazonEmoji: {
    fontSize: '2.8rem',
  },
  amazonCardBody: {
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  amazonCategory: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  amazonProductTitle: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    lineHeight: '1.35',
    maxHeight: '34px',
    overflow: 'hidden',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  starsLabel: {
    fontSize: '0.72rem',
    color: 'var(--text-gold)',
    fontWeight: '700',
  },
  amazonDesc: {
    fontSize: '0.74rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    maxHeight: '52px',
    overflow: 'hidden',
  },
  amazonCardDivider: {
    height: '1px',
    background: 'rgba(255,255,255,0.03)',
    margin: '4px 0',
  },
  amazonFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amazonPrice: {
    fontSize: '1rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  amazonBuyBtn: {
    padding: '4px 10px',
    fontSize: '0.7rem',
    borderRadius: '6px',
  }
};
