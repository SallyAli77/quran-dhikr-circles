import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Send, Heart, MessageSquare, Award, AlertCircle, PlusCircle, RotateCcw, HeartHandshake } from 'lucide-react';
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
    t 
  } = useApp();

  const [postText, setPostText] = useState("");
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: "" }
  const [openComments, setOpenComments] = useState({}); // { [postId]: false }
  const [activeTab, setActiveTab] = useState("feed"); // "feed" or "tasbih"

  // Simulated global click counters
  const [globalDhikr, setGlobalDhikr] = useState(48293);
  const [activeUsers, setActiveUsers] = useState(1280);

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
  `;
  document.head.appendChild(commStyle);
}
