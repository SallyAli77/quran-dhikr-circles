import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Quran from './pages/Quran';
import PrayerTimes from './pages/PrayerTimes';
import Articles from './pages/Articles';
import Community from './pages/Community';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Legal from './pages/Legal';
import Products from './pages/Products';

function AppContent() {
  const [activePage, setActivePage] = useState("home");
  const { language, selectedUserProfile, setSelectedUserProfile } = useApp();

  // Simple clean client-side page router
  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={setActivePage} />;
      case 'quran':
        return <Quran setActivePage={setActivePage} />;
      case 'prayer':
        return <PrayerTimes />;
      case 'articles':
        return <Articles />;
      case 'community':
        return <Community />;
      case 'products':
        return <Products />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login setActivePage={setActivePage} />;
      case 'privacy':
        return <Legal initialTab="privacy" setActivePage={setActivePage} />;
      case 'terms':
        return <Legal initialTab="terms" setActivePage={setActivePage} />;
      case 'legal':
        return <Legal initialTab="privacy" setActivePage={setActivePage} />;
      default:
        return <Home setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-layout" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      {/* Premium Transparent Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Core Platform Content */}
      <main className="main-content">
        {renderActivePage()}
      </main>

      {/* Global Privacy-Compliant User Profile Modal */}
      {selectedUserProfile && (
        <div 
          style={modalStyles.overlay} 
          onClick={() => setSelectedUserProfile(null)}
          className="fade-in"
        >
          <div 
            style={modalStyles.card} 
            className="glass-panel slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              style={{
                ...modalStyles.closeBtn,
                right: language === 'ar' ? 'auto' : '16px',
                left: language === 'ar' ? '16px' : 'auto'
              }} 
              onClick={() => setSelectedUserProfile(null)}
            >
              ×
            </button>
            
            <div className="islamic-pattern"></div>
            
            <div style={modalStyles.header}>
              <span style={modalStyles.avatar}>{selectedUserProfile.avatar || "👤"}</span>
              <h2 style={modalStyles.name} className="gold-gradient-text">
                {selectedUserProfile.name}
              </h2>
              <div style={modalStyles.badgeRow}>
                <span style={modalStyles.roleBadge}>
                  {selectedUserProfile.role === "Certified Teacher" 
                    ? (language === 'ar' ? "معلم معتمد" : "Certified Teacher")
                    : (selectedUserProfile.role || (language === 'ar' ? "عضو" : "Member"))
                  }
                  {selectedUserProfile.level && ` — ${selectedUserProfile.level}`}
                </span>
                <span style={modalStyles.joinedBadge}>
                  📅 {language === 'ar' ? "انضم في" : "Joined"} {selectedUserProfile.memberSince || "May 2026"}
                </span>
              </div>
            </div>
            
            <div style={modalStyles.divider}></div>
            
            <div style={modalStyles.body}>
              <h4 style={modalStyles.sectionTitle}>
                {language === 'ar' ? "نبذة تعريفية" : "About Me"}
              </h4>
              <p style={modalStyles.bio}>
                {language === 'ar' ? selectedUserProfile.bioAr : selectedUserProfile.bioEn}
              </p>
              
              {selectedUserProfile.badges && selectedUserProfile.badges.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={modalStyles.sectionTitle}>
                    {language === 'ar' ? "الأوسمة والشارات" : "Badges & Accomplishments"}
                  </h4>
                  <div style={modalStyles.badgesList}>
                    {selectedUserProfile.badges.map(bId => {
                      const badgeDetails = {
                        dhikr_pioneer: { labelAr: "رائد الأذكار", labelEn: "Remembrance Pioneer", icon: "✨" },
                        tasbih_master: { labelAr: "المسبح الدائم", labelEn: "Tasbih Devotee", icon: "📿" },
                        knowledge_seeker: { labelAr: "طالب العلم", labelEn: "Knowledge Seeker", icon: "📖" },
                        teacher_qualified: { labelAr: "المعلم المرتل", labelEn: "Tajweed Master", icon: "🎓" }
                      }[bId] || { labelAr: "عضو نشط", labelEn: "Active Member", icon: "🌟" };
                      
                      return (
                        <div key={bId} style={modalStyles.badgeItem} className="glass-panel" title={language === 'ar' ? badgeDetails.labelAr : badgeDetails.labelEn}>
                          <span>{badgeDetails.icon}</span>
                          <span style={{ fontSize: '0.8rem' }}>{language === 'ar' ? badgeDetails.labelAr : badgeDetails.labelEn}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {((language === 'ar' ? selectedUserProfile.circlesAr : selectedUserProfile.circlesEn) || []).length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={modalStyles.sectionTitle}>
                    {language === 'ar' ? "الحلقات التابعة" : "Circles Led / Joined"}
                  </h4>
                  <ul style={modalStyles.circlesList}>
                    {((language === 'ar' ? selectedUserProfile.circlesAr : selectedUserProfile.circlesEn) || []).map((c, i) => (
                      <li key={i} style={modalStyles.circleItem}>
                        <span>🕌</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div style={modalStyles.footer}>
              <p style={modalStyles.privacyDisclaimer}>
                🔒 {language === 'ar' 
                  ? "تم عرض هذه البيانات بما يتوافق مع شروط استخدام المنصة. معلومات الاتصال (البريد الإلكتروني والهاتف) محجوبة لحماية خصوصية الأعضاء."
                  : "This profile details are displayed in compliance with our Terms of Use. Contact details (email and telephone) are strictly hidden for member safety."
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic footer quotes */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.82)',
    backdropFilter: 'blur(12px)',
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: '440px',
    padding: '30px',
    borderRadius: '24px',
    border: '1.5px solid var(--border-gold)',
    background: 'rgba(12, 14, 21, 0.98)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(212, 175, 55, 0.05)',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '1.8rem',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'color 0.2s',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '10px',
    marginTop: '10px',
  },
  avatar: {
    fontSize: '3.2rem',
    background: 'rgba(212, 175, 55, 0.08)',
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--gold-primary)',
    boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)',
  },
  name: {
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  badgeRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  roleBadge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
    background: 'rgba(212, 175, 55, 0.06)',
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid rgba(212, 175, 55, 0.2)',
  },
  joinedBadge: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  divider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.05)',
    margin: '20px 0',
  },
  body: {
    textAlign: 'start',
  },
  sectionTitle: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  bio: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  badgesList: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '10px',
  },
  badgeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.04)',
  },
  circlesList: {
    listStyle: 'none',
    padding: 0,
    margin: '10px 0 0 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  circleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.84rem',
    color: 'var(--text-secondary)',
  },
  footer: {
    marginTop: '25px',
    paddingTop: '15px',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
  },
  privacyDisclaimer: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    lineHeight: '1.45',
    textAlign: 'center',
  }
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
