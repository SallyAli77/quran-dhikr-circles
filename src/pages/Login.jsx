import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, LogIn, UserPlus, Key, Award, Bookmark, Edit2, Check, ArrowRight, User, Mic, Star, Heart, UserMinus, Volume2, Loader, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Login({ setActivePage }) {
  const { 
    isAuthenticated, 
    user, 
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
    toggleFriend
  } = useApp();

  // Screen selection inside Auth
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");

  // Dashboard sub-tabs selection
  const [activeSubTab, setActiveSubTab] = useState("my_recordings"); // "my_recordings" or "community_feed"

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

  // Filter personal user recordings
  const mySubmissions = tasmeeSubmissions.filter(sub => sub.isUser);

  // Filter other community/teachers page recordings
  const communitySubmissions = tasmeeSubmissions.filter(sub => !sub.isUser);

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

          {/* Tasmee Recordings Area with sub-tabs */}
          <div style={styles.bookmarksSection}>
            <div style={styles.sectionHeader}>
              <Mic size={20} color="var(--text-gold)" />
              <h3 style={styles.sectionTitle}>{language === 'en' ? "Noble Tasmee' System" : "نظام التسميع الفاخر"}</h3>
            </div>

            {/* Sub-tab selection row */}
            <div style={styles.subTabRow} className="glass-panel">
              <button 
                onClick={() => setActiveSubTab("my_recordings")} 
                style={{
                  ...styles.subTabBtn,
                  color: activeSubTab === 'my_recordings' ? 'var(--text-gold)' : 'var(--text-secondary)',
                  background: activeSubTab === 'my_recordings' ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                  borderColor: activeSubTab === 'my_recordings' ? 'var(--border-gold)' : 'transparent'
                }}
              >
                <Mic size={14} />
                <span>{language === 'ar' ? "تسجيلاتي الخاصة" : "My Recitations"}</span>
              </button>

              <button 
                onClick={() => setActiveSubTab("community_feed")} 
                style={{
                  ...styles.subTabBtn,
                  color: activeSubTab === 'community_feed' ? 'var(--text-gold)' : 'var(--text-secondary)',
                  background: activeSubTab === 'community_feed' ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                  borderColor: activeSubTab === 'community_feed' ? 'var(--border-gold)' : 'transparent'
                }}
              >
                <Award size={14} />
                <span>{language === 'ar' ? "صفحة المعلمين والمجتمع" : "Evaluation Feed (Teachers)"}</span>
              </button>
            </div>

            {/* Sub-tabs content render */}
            {activeSubTab === "my_recordings" ? (
              <div className="grid-2" style={{ marginTop: '10px' }}>
                {mySubmissions.length > 0 ? (
                  mySubmissions.map(sub => (
                    <div key={sub.id} style={styles.recitationCard} className="glass-panel fade-in">
                      <div style={styles.cardHeader}>
                        <div>
                          <strong style={{ color: 'var(--text-gold)', fontSize: '1.1rem' }}>
                            {language === 'ar' ? `سورة ${sub.surahNameAr || sub.surahName}` : `Surah ${sub.surahName}`}
                          </strong>
                          <div style={styles.cardMeta}>
                            {language === 'ar' 
                              ? `الجزء ${sub.juz || 30} • الآيات ${sub.ayahFrom} - ${sub.ayahTo}` 
                              : `Juz' ${sub.juz || 30} • Ayahs ${sub.ayahFrom} - ${sub.ayahTo}`}
                          </div>
                          <span style={styles.cardDate}>{sub.date}</span>
                        </div>
                        <button 
                          onClick={() => deleteTasmeeSubmission(sub.id)} 
                          style={styles.removeBookmarkBtn}
                          title={language === 'en' ? "Delete Recording" : "حذف التسجيل"}
                        >
                          ×
                        </button>
                      </div>

                      {/* Recited audio playback */}
                      <div style={styles.playerSection}>
                        <span style={styles.audioLabel}>{language === 'ar' ? "تلاوتك المسجلة:" : "Your Recitation:"}</span>
                        <audio src={sub.audioData} controls style={styles.audioControl} />
                      </div>

                      {/* Evaluation feedback segment */}
                      <div style={{...styles.feedbackArea, borderColor: sub.rating ? 'var(--border-gold)' : 'rgba(255,255,255,0.05)'}} className="glass-panel">
                        {!sub.rating ? (
                          // Pending status loader
                          <div style={styles.pendingEval} className="fade-in">
                            <Loader size={18} className="spin-pulse" color="var(--text-gold)" />
                            <span style={{color: 'var(--text-gold)', fontWeight: 'bold'}}>
                              {language === 'ar' ? "جاري تقييم تلاوتك من قبل المعلم..." : "Recitation under teacher review..."}
                            </span>
                            <p style={styles.pendingText}>
                              {language === 'ar' 
                                ? "سيقوم المعلم المعتمد بوضع التقييم وتصحيح التلاوة الصوتي في غضون لحظات." 
                                : "A certified recitation teacher will provide star ratings and a corrective audio track shortly."}
                            </p>
                          </div>
                        ) : (
                          // Completed status
                          <div className="fade-in" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <span style={styles.evalLabel}>{language === 'ar' ? "تقييم المعلم المعتمد:" : "Certified Teacher Grading:"}</span>
                              {/* Rating Stars display */}
                              <div style={styles.starsRow}>
                                {Array.from({length: 5}).map((_, idx) => (
                                  <Star key={idx} size={14} color={idx < sub.rating ? "var(--text-gold)" : "var(--text-muted)"} fill={idx < sub.rating ? "var(--text-gold)" : "none"} />
                                ))}
                              </div>
                            </div>
                            
                            <p style={styles.evalComment}>"{sub.comments}"</p>

                            {/* Correction Audio */}
                            {sub.teacherAudio && (
                              <div style={styles.correctionSection} className="glass-panel">
                                <div style={styles.correctionLabelRow}>
                                  <Volume2 size={14} color="var(--text-gold)" />
                                  <span style={styles.correctionLabel}>{language === 'ar' ? "تصحيح التلاوة (المصحح):" : "Recitation Correction (Teacher):"}</span>
                                </div>
                                <audio src={sub.teacherAudio} controls style={{...styles.audioControl, height: '34px'}} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{...styles.emptyNotice, gridColumn: '1 / -1'}} className="glass-panel">
                    <span>
                      {language === 'en' 
                        ? "No Tasmee recitations recorded yet. Go to the Quran page, select Recitation (تسميع) to record!" 
                        : "لم تقم بتسجيل أي تلاوة للتسميع بعد. انتقل إلى صفحة القرآن واختر وضع التسميع للبدء!"}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              // Community Feed (Teachers Page)
              <div className="grid-2" style={{ marginTop: '10px' }}>
                {communitySubmissions.length > 0 ? (
                  communitySubmissions.map(sub => {
                    const isFriend = friendsList.includes(sub.author);
                    const userLiked = sub.lovedBy && sub.lovedBy.includes(user.email);

                    return (
                      <div key={sub.id} style={styles.recitationCard} className="glass-panel fade-in">
                        {/* Profile Row */}
                        <div style={styles.commProfileRow}>
                          <div style={styles.commAvatar}>{sub.avatar}</div>
                          <div style={{flexGrow: 1}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <strong style={{color: 'var(--text-primary)'}}>{sub.author}</strong>
                              {isFriend && (
                                <span style={styles.friendBadge}>{language === 'ar' ? "صديق ✓" : "Friend ✓"}</span>
                              )}
                            </div>
                            <span style={styles.cardDate}>{sub.date}</span>
                          </div>
                          
                          {/* Add Friend action button */}
                          <button 
                            onClick={() => toggleFriend(sub.author)} 
                            style={{
                              ...styles.friendBtn,
                              background: isFriend ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                              borderColor: isFriend ? 'var(--border-gold)' : 'var(--text-muted)'
                            }}
                          >
                            <span>{isFriend ? (language === 'ar' ? "إلغاء الصداقة" : "Unfriend") : (language === 'ar' ? "إضافة صديق" : "Add Friend")}</span>
                          </button>
                        </div>

                        {/* Surah specifics */}
                        <div style={{marginTop: '10px'}}>
                          <strong style={{ color: 'var(--text-gold)', fontSize: '1.05rem' }}>
                            {language === 'ar' ? `سورة ${sub.surahNameAr || sub.surahName}` : `Surah ${sub.surahName}`}
                          </strong>
                          <div style={{...styles.cardMeta, marginTop: '2px'}}>
                            {language === 'ar' 
                              ? `الجزء ${sub.juz || 30} • الآيات ${sub.ayahFrom} - ${sub.ayahTo}` 
                              : `Juz' ${sub.juz || 30} • Ayahs ${sub.ayahFrom} - ${sub.ayahTo}`}
                          </div>
                        </div>

                        {/* Student recitation clip */}
                        <div style={styles.playerSection}>
                          <span style={styles.audioLabel}>{language === 'ar' ? "تلاوة الطالب:" : "Student Recitation:"}</span>
                          <audio src={sub.audioData} controls style={styles.audioControl} />
                        </div>

                        {/* Teacher's evaluation display */}
                        <div style={{...styles.feedbackArea, borderColor: 'var(--border-gold)'}} className="glass-panel">
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span style={styles.evalLabel}>{language === 'ar' ? "تقييم المعلم المعتمد:" : "Certified Teacher Grading:"}</span>
                            <div style={styles.starsRow}>
                              {Array.from({length: 5}).map((_, idx) => (
                                <Star key={idx} size={14} color={idx < sub.rating ? "var(--text-gold)" : "var(--text-muted)"} fill={idx < sub.rating ? "var(--text-gold)" : "none"} />
                              ))}
                            </div>
                          </div>
                          
                          <p style={styles.evalComment}>"{sub.comments}"</p>

                          {/* Corrective sound */}
                          {sub.teacherAudio && (
                            <div style={styles.correctionSection} className="glass-panel">
                              <div style={styles.correctionLabelRow}>
                                <Volume2 size={14} color="var(--text-gold)" />
                                <span style={styles.correctionLabel}>{language === 'ar' ? "تصحيح التلاوة (المعلم):" : "Correction Audio (Teacher):"}</span>
                              </div>
                              <audio src={sub.teacherAudio} controls style={{...styles.audioControl, height: '34px'}} />
                            </div>
                          )}
                        </div>

                        {/* Action Footer: Love reaction ONLY */}
                        <div style={styles.cardFooter}>
                          <button 
                            onClick={() => loveTasmeeSubmission(sub.id)} 
                            style={{
                              ...styles.loveBtn,
                              color: userLiked ? '#ff6b6b' : 'var(--text-secondary)'
                            }}
                          >
                            <Heart size={16} fill={userLiked ? "#ff6b6b" : "none"} className={userLiked ? "pulse-animation" : ""} />
                            <span>{sub.loves || 0} {language === 'ar' ? "إعجاب" : "Loves"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{...styles.emptyNotice, gridColumn: '1 / -1'}} className="glass-panel">
                    <span>{language === 'en' ? "Evaluation feed is empty." : "صفحة المجتمع فارغة حالياً."}</span>
                  </div>
                )}
              </div>
            )}
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
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
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
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
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
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
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
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
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
  },
  // Sub-tabs & Tasmee list layout styling
  subTabRow: {
    display: 'flex',
    gap: '8px',
    padding: '6px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.02)',
    width: 'fit-content',
  },
  subTabBtn: {
    border: '1px solid transparent',
    borderRadius: '8px',
    padding: '10px 18px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'var(--transition-fast)',
  },
  recitationCard: {
    padding: '24px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    border: '1px solid var(--border-glass)',
    background: 'rgba(20, 24, 38, 0.4)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardMeta: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '4px',
    fontWeight: '500',
  },
  cardDate: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    display: 'inline-block',
    marginTop: '4px',
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
    height: '38px',
    borderRadius: '20px',
    accentColor: 'var(--gold-primary)',
  },
  feedbackArea: {
    padding: '16px',
    borderRadius: '14px',
    background: 'rgba(15, 17, 26, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  pendingEval: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '12px 6px',
    gap: '8px',
  },
  pendingText: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  evalLabel: {
    fontSize: '0.82rem',
    color: '#38bdf8', // beautiful bright sky blue for evaluation labels
    fontWeight: '600',
  },
  evalComment: {
    fontSize: '0.88rem',
    color: 'var(--text-primary)',
    lineHeight: '1.6',
    fontStyle: 'italic',
    background: 'rgba(255,255,255,0.01)',
    padding: '8px 12px',
    borderRadius: '8px',
    borderLeft: '2px solid var(--border-gold)',
  },
  starsRow: {
    display: 'flex',
    gap: '2px',
  },
  correctionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '10px 12px',
    borderRadius: '10px',
    background: 'rgba(212, 175, 55, 0.03)',
  },
  correctionLabelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  correctionLabel: {
    fontSize: '0.78rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  commProfileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '12px',
  },
  commAvatar: {
    fontSize: '2rem',
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  friendBadge: {
    fontSize: '0.7rem',
    color: '#10b981',
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '2px 8px',
    borderRadius: '12px',
    fontWeight: '600',
  },
  friendBtn: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-gold)',
    border: '1px solid var(--border-gold)',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '12px',
  },
  loveBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    transition: 'var(--transition-fast)',
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
    [dir="rtl"] .login-page [style*="friendBadge"] {
      order: -1;
    }
    .clickable-bookmark-row {
      transition: var(--transition-fast);
      cursor: pointer;
    }
    .clickable-bookmark-row:hover {
      border-color: var(--border-gold-hover) !important;
    }
    .pulse-animation {
      animation: pulse 1s infinite alternate;
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      100% { transform: scale(1.15); }
    }
    .spin-pulse {
      animation: spin 1s infinite linear;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
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
