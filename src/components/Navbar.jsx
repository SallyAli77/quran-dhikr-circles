import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Globe, Menu, X, User, LogOut, BookOpen, Compass, Award } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const { language, setLanguage, searchQuery, setSearchQuery, isAuthenticated, user, logout, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const navItems = [
    { id: 'home', label: 'navHome' },
    { id: 'quran', label: 'navQuran' },
    { id: 'prayer', label: 'navPrayer' },
    { id: 'articles', label: 'navArticles' },
    { id: 'community', label: 'navCommunity' },
    { id: 'contact', label: 'navContact' }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="glass-panel navbar" style={styles.navbar}>
      <div className="container" style={styles.navbarContainer}>
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('home')} 
          style={styles.logo} 
          className="gold-gradient-text"
        >
          <span style={styles.logoCrescent}>🌙</span>
          <span style={styles.logoText}>ArabicMuslim</span>
        </div>

        {/* Search Bar */}
        <div style={{
          ...styles.searchWrapper,
          borderColor: searchFocused ? 'var(--gold-primary)' : 'var(--border-gold)',
          boxShadow: searchFocused ? '0 0 15px rgba(212, 175, 55, 0.15)' : 'none'
        }}>
          <Search size={16} color="var(--text-gold)" style={styles.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? "Search Quran, articles, books..." : "ابحث في القرآن، المقالات، الكتب..."}
            style={styles.searchInput}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery && (
            <X 
              size={14} 
              color="var(--text-secondary)" 
              onClick={() => setSearchQuery("")} 
              style={{ cursor: 'pointer' }}
            />
          )}
        </div>

        {/* Desktop Nav Items */}
        <div style={styles.desktopNav}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                ...styles.navLink,
                color: activePage === item.id ? 'var(--text-gold)' : 'var(--text-secondary)',
                fontWeight: activePage === item.id ? '600' : '400',
                borderBottom: activePage === item.id ? '2px solid var(--gold-primary)' : '2px solid transparent'
              }}
              className="nav-link-hover"
            >
              {t(item.label)}
            </button>
          ))}
        </div>

        {/* Right Side Options (Lang & Auth) */}
        <div style={styles.rightSide}>
          <button 
            onClick={toggleLanguage} 
            style={styles.langBtn}
            title={language === 'en' ? "Switch to Arabic" : "التغيير إلى الإنجليزية"}
          >
            <Globe size={16} color="var(--text-gold)" />
            <span style={styles.langBtnText}>{language === 'en' ? "AR" : "EN"}</span>
          </button>

          {isAuthenticated ? (
            <div style={styles.profileBadge} className="glass-panel">
              <span 
                onClick={() => handleNavClick('login')} 
                style={styles.profileTrigger}
                title={t('navDashboard')}
              >
                <span style={styles.avatarEmoji}>{user.avatar}</span>
                <span style={styles.profileName}>{user.name.split(' ')[0]}</span>
              </span>
              <button 
                onClick={logout} 
                style={styles.logoutBtn} 
                title={t('navLogout')}
              >
                <LogOut size={14} color="#ff6b6b" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleNavClick('login')} 
              className="btn-primary" 
              style={styles.loginBtn}
            >
              <User size={14} />
              <span>{t('navLogin')}</span>
            </button>
          )}

          {/* Hamburger Menu Mobile */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            style={styles.mobileToggle}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer} className="glass-panel fade-in">
          {/* Mobile Search */}
          <div style={styles.mobileSearchWrapper}>
            <Search size={16} color="var(--text-gold)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? "Search..." : "ابحث..."}
              style={styles.mobileSearchInput}
            />
            {searchQuery && <X size={14} onClick={() => setSearchQuery("")} />}
          </div>

          <div style={styles.mobileNavLinks}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  ...styles.mobileNavLink,
                  color: activePage === item.id ? 'var(--text-gold)' : 'var(--text-primary)',
                  borderLeft: activePage === item.id ? '3px solid var(--gold-primary)' : '3px solid transparent'
                }}
              >
                {t(item.label)}
              </button>
            ))}

            <div style={styles.mobileDivider}></div>

            {/* Mobile Actions */}
            <div style={styles.mobileActions}>
              <button onClick={toggleLanguage} style={styles.mobileLangBtn}>
                <Globe size={18} color="var(--text-gold)" />
                <span>{language === 'en' ? "العربية (Arabic)" : "English (إنجليزية)"}</span>
              </button>

              {isAuthenticated ? (
                <div style={styles.mobileProfilePanel}>
                  <div style={styles.mobileUserInfo} onClick={() => handleNavClick('login')}>
                    <span style={styles.mobileUserAvatar}>{user.avatar}</span>
                    <div>
                      <div style={styles.mobileUserName}>{user.name}</div>
                      <div style={styles.mobileUserRole}>{user.role}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); }} 
                    style={styles.mobileLogoutBtn}
                  >
                    <LogOut size={16} />
                    <span>{t('navLogout')}</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleNavClick('login')} 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <User size={16} />
                  <span>{t('navLogin')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    position: 'fixed',
    top: '20px',
    left: '2%',
    right: '2%',
    width: '96%',
    zIndex: 1000,
    borderRadius: '16px',
    border: '1px solid var(--border-gold)',
    boxShadow: 'var(--shadow-gold)',
  },
  navbarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
    padding: '0 20px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  logoCrescent: {
    fontSize: '1.6rem',
    filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.4))',
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.45rem',
    fontWeight: '700',
    letterSpacing: '1px',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-gold)',
    borderRadius: '30px',
    padding: '6px 14px',
    width: '240px',
    transition: 'var(--transition-smooth)',
  },
  searchIcon: {
    marginRight: '8px',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    width: '100%',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: '8px 4px',
    letterSpacing: '0.5px',
    transition: 'var(--transition-smooth)',
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  langBtn: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-gold)',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'var(--transition-smooth)',
  },
  langBtnText: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  loginBtn: {
    padding: '8px 16px',
    fontSize: '0.85rem',
  },
  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 12px',
    background: 'rgba(212, 175, 55, 0.05)',
    borderRadius: '30px',
    border: '1px solid var(--border-gold)',
  },
  profileTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  avatarEmoji: {
    fontSize: '1.2rem',
  },
  profileName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-gold)',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '2px',
    borderRadius: '50%',
    transition: 'var(--transition-fast)',
  },
  mobileToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  mobileDrawer: {
    position: 'absolute',
    top: '80px',
    left: '0',
    right: '0',
    width: '100%',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    zIndex: 999,
  },
  mobileSearchWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '10px',
    gap: '8px',
  },
  mobileSearchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    width: '100%',
  },
  mobileNavLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mobileNavLink: {
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '1rem',
    padding: '10px 14px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  mobileDivider: {
    height: '1px',
    background: 'var(--border-gold)',
    margin: '10px 0',
  },
  mobileActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mobileLangBtn: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-gold)',
    borderRadius: '8px',
    padding: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-primary)',
  },
  mobileProfilePanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: 'rgba(212, 175, 55, 0.05)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '12px',
  },
  mobileUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  mobileUserAvatar: {
    fontSize: '2rem',
  },
  mobileUserName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-gold)',
  },
  mobileUserRole: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  mobileLogoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'rgba(255, 107, 107, 0.1)',
    border: '1px solid rgba(255, 107, 107, 0.3)',
    color: '#ff6b6b',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

// Add responsive media query CSS adjustments on mount or inject directly in stylesheet
if (typeof document !== 'undefined') {
  const navStyle = document.createElement('style');
  navStyle.innerHTML = `
    @media (max-width: 1024px) {
      .navbar {
        top: 10px !important;
        width: 98% !important;
        left: 1% !important;
        right: 1% !important;
      }
    }
    @media (max-width: 860px) {
      .navbar [style*="desktopNav"] {
        display: none !important;
      }
      .navbar [style*="searchWrapper"] {
        display: none !important;
      }
      .navbar [style*="mobileToggle"] {
        display: block !important;
      }
      .navbar [style*="langBtn"] {
        display: none !important;
      }
      .navbar [style*="profileBadge"] {
        display: none !important;
      }
      .navbar [style*="loginBtn"] {
        display: none !important;
      }
    }
    [dir="rtl"] .navbar [style*="mobileNavLink"] {
      text-align: right !important;
      border-left: none !important;
      border-right: 3px solid var(--gold-primary) !important;
    }
  `;
  document.head.appendChild(navStyle);
}
