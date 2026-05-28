import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, LogIn, UserPlus, Key, Award, Bookmark, Edit2, Check, ArrowRight, User } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Login({ setActivePage }) {
  const { isAuthenticated, user, login, logout, bookmarks, toggleBookmark, tasbihCount, t, language } = useApp();

  // Screen selection inside Auth
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");

  // Dashboard edits
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editAvatar, setEditAvatar] = useState(user.avatar);

  const avatarsList = ["🌙", "🕌", "✨", "⭐", "📖", "⚔️", "🎨"];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    const success = login(email, password);
    if (success) {
      // Play celebratory massive confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffffff', '#c5a059']
      });
    } else {
      setAuthError(t('authError'));
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    if (!name.trim()) {
      setAuthError(language === 'en' ? "Please provide a valid display name." : "يرجى تقديم اسم عرض صالح.");
      return;
    }

    if (password.length < 6) {
      setAuthError(language === 'en' ? "Password must contain at least 6 characters." : "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.");
      return;
    }

    // Success registration mock
    const success = login(email || `${name.toLowerCase()}@arabicmuslim.com`, password);
    if (success) {
      // Update custom name registered
      user.name = name;
      localStorage.setItem('arabicmuslim_user', JSON.stringify(user));
      setEditName(name);

      confetti({
        particleCount: 120,
        spread: 80,
        colors: ['#d4af37', '#ffffff']
      });
    }
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) return;

    user.name = editName;
    user.avatar = editAvatar;
    localStorage.setItem('arabicmuslim_user', JSON.stringify(user));
    
    setIsEditingProfile(false);
    
    // Confetti on save
    confetti({
      particleCount: 20,
      spread: 30,
      colors: ['#d4af37', '#ffffff']
    });
  };

  return (
    <div className="login-page container fade-in" style={{ minHeight: '80vh' }}>
      {!isAuthenticated ? (
        // Authorization screen
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
                  placeholder={language === 'en' ? "Sally Ali" : "سالي علي"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.formInput}
                />
              </div>
            )}

            <div style={styles.formField}>
              <label style={styles.fieldLabel}>{t('authEmail')}</label>
              <input
                type="email"
                required
                placeholder="sally@arabicmuslim.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.formInput}
              />
            </div>

            <div style={styles.formField}>
              <label style={styles.fieldLabel}>{t('authPass')}</label>
              <input
                type="password"
                required
                placeholder={language === 'en' ? "Password..." : "كلمة المرور..."}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.formInput}
              />
              {!isSignUpMode && (
                <span style={styles.passHint}>
                  {language === 'en' ? "Demo: sally@arabicmuslim.com / bismillah" : "التجربة: sally@arabicmuslim.com / bismillah"}
                </span>
              )}
            </div>

            <button type="submit" className="btn-primary" style={styles.submitBtn}>
              <Key size={14} />
              <span>{isSignUpMode ? t('authSignUpSubmit') : t('authSubmit')}</span>
            </button>
          </form>

          <button 
            onClick={() => { setIsSignUpMode(!isSignUpMode); setAuthError(""); }} 
            style={styles.toggleBtn}
          >
            {isSignUpMode ? t('authToggleToLogin') : t('authToggleToSignUp')}
          </button>
        </div>
      ) : (
        // Logged-in Premium Member Dashboard
        <div style={styles.dashboardContainer} className="fade-in">
          {/* Top Panel: Welcome profile card */}
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
                      <span>{language === 'en' ? "Save Profile" : "حفظ التعديلات"}</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 style={styles.userName} className="gold-gradient-text">
                      {t('authWelcome')}, {user.name}
                    </h2>
                    <span style={styles.userRoleBadge}>{user.role}</span>
                    <p style={styles.userEmail}>{user.email}</p>
                    <span style={styles.memberSince}>{language === 'en' ? `Member Since: ${user.memberSince}` : `عضو منذ: ${user.memberSince}`}</span>
                    
                    <button onClick={() => setIsEditingProfile(true)} style={styles.editTriggerBtn}>
                      <Edit2 size={12} />
                      <span>{language === 'en' ? "Customize Profile" : "تعديل الملف الشخصي"}</span>
                    </button>
                  </>
                )}
              </div>

              {/* Point highlights card */}
              <div style={styles.pointsBadgeCard} className="glass-panel">
                <Award size={24} color="var(--text-gold)" />
                <div>
                  <div style={styles.badgeCount}>{tasbihCount}</div>
                  <div style={styles.badgeLabel}>{t('commTasbihCount')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bookmarks Grid */}
          <div style={styles.bookmarksSection}>
            <div style={styles.sectionHeader}>
              <Bookmark size={20} color="var(--text-gold)" />
              <h3 style={styles.sectionTitle}>{language === 'en' ? "My Saved Bookmarks" : "علاماتي المرجعية المحفوظة"}</h3>
            </div>

            <div className="grid-2" style={{ marginTop: '20px' }}>
              {/* Quran Verses panel */}
              <div style={styles.bookmarkPanel} className="glass-panel">
                <h4 style={styles.panelTitle}>{language === 'en' ? "Saved Quran Verses" : "الآيات المحفوظة"}</h4>
                <div style={styles.bookmarkList}>
                  {bookmarks.verses.length > 0 ? (
                    bookmarks.verses.map(v => (
                      <div key={v.id} style={styles.bookmarkItemRow} className="glass-panel">
                        <div style={styles.bookmarkItemDetails}>
                          <strong style={{ color: 'var(--text-gold)' }}>
                            {v.surahName} ({v.num})
                          </strong>
                          <p style={styles.bookmarkAr} className="arabic-text">{v.ar}</p>
                          <p style={styles.bookmarkEn}>{v.en}</p>
                        </div>
                        <button 
                          onClick={() => toggleBookmark('verses', v)} 
                          style={styles.removeBookmarkBtn}
                          title={language === 'en' ? "Remove bookmark" : "إزالة العلامة"}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={styles.emptyNotice}>
                      <span>{language === 'en' ? "No saved verses yet." : "لا توجد آيات محفوظة بعد."}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Articles panel */}
              <div style={styles.bookmarkPanel} className="glass-panel">
                <h4 style={styles.panelTitle}>{language === 'en' ? "Saved Articles" : "المقالات المحفوظة"}</h4>
                <div style={styles.bookmarkList}>
                  {bookmarks.articles.length > 0 ? (
                    bookmarks.articles.map(a => (
                      <div 
                        key={a.id} 
                        style={styles.bookmarkItemRow} 
                        className="glass-panel clickable-bookmark-row"
                        onClick={() => setActivePage('articles')}
                      >
                        <div>
                          <strong style={{ color: 'var(--text-gold)' }}>{language === 'en' ? a.title : a.titleAr}</strong>
                          <p style={styles.bookmarkSummary}>{language === 'en' ? a.summary : a.summaryAr}</p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleBookmark('articles', a); }} 
                          style={styles.removeBookmarkBtn}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={styles.emptyNotice}>
                      <span>{language === 'en' ? "No saved articles yet." : "لا توجد مقالات محفوظة بعد."}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

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
    fontFamily: "'Playfair Display', serif",
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
    fontFamily: "'Playfair Display', serif",
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
    marginTop: '2px',
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
    fontSize: '2rem',
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
  bookmarksSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  bookmarkPanel: {
    padding: '24px',
    borderRadius: '16px',
    height: '100%',
  },
  panelTitle: {
    fontSize: '1.05rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '12px',
    marginBottom: '16px',
  },
  bookmarkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  bookmarkItemRow: {
    padding: '14px 16px',
    borderRadius: '10px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    gap: '12px',
  },
  bookmarkItemDetails: {
    fontSize: '0.85rem',
  },
  bookmarkAr: {
    fontSize: '1.2rem',
    textAlign: 'right',
    color: 'var(--text-gold)',
    marginTop: '6px',
  },
  bookmarkEn: {
    color: 'var(--text-secondary)',
    marginTop: '4px',
    lineHeight: '1.5',
  },
  bookmarkSummary: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '4px',
    lineHeight: '1.5',
  },
  removeBookmarkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '1.5rem',
    lineHeight: '1',
    cursor: 'pointer',
    padding: '0 4px',
    transition: 'var(--transition-fast)',
  },
  emptyNotice: {
    padding: '30px 10px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
  logoutBtn: {
    alignSelf: 'flex-start',
  }
};

if (typeof document !== 'undefined') {
  const loginStyle = document.createElement('style');
  loginStyle.innerHTML = `
    [dir="rtl"] .login-page [style*="formInput"] {
      text-align: right !important;
    }
    [dir="rtl"] .login-page [style*="editNameInput"] {
      text-align: right !important;
    }
    [dir="rtl"] .login-page [style*="bookmarkAr"] {
      text-align: left !important;
    }
    [dir="rtl"] .login-page [style*="bookmarkEn"] {
      text-align: right !important;
    }
    [dir="rtl"] .login-page [style*="bookmarkItemRow"] {
      flex-direction: row-reverse !important;
      text-align: right !important;
    }
    [dir="rtl"] .login-page [style*="profileInfoRow"] {
      flex-direction: row-reverse !important;
      text-align: right !important;
    }
    [dir="rtl"] .login-page [style*="userRoleBadge"] {
      align-self: flex-end !important;
    }
    [dir="rtl"] .login-page [style*="editTriggerBtn"] {
      align-self: flex-end !important;
    }
    [dir="rtl"] .login-page [style*="logoutBtn"] {
      align-self: flex-end !important;
    }
    .clickable-bookmark-row {
      transition: var(--transition-fast);
      cursor: pointer;
    }
    .clickable-bookmark-row:hover {
      border-color: var(--border-gold-hover) !important;
    }
    @media (max-width: 768px) {
      .login-page [style*="authContainer"] {
        padding: 30px 16px !important;
      }
      .login-page [style*="profileHeaderCard"] {
        padding: 30px 16px !important;
      }
      .login-page [style*="profileInfoRow"] {
        flex-direction: column !important;
        align-items: center !important;
        text-align: center !important;
      }
      .login-page [style*="profileMeta"] {
        align-items: center !important;
      }
      .login-page [style*="userRoleBadge"] {
        align-self: center !important;
      }
      .login-page [style*="editTriggerBtn"] {
        align-self: center !important;
      }
    }
  `;
  document.head.appendChild(loginStyle);
}
