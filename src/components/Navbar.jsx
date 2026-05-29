import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Globe, Menu, X, User, LogOut } from 'lucide-react';

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
    { id: 'community', label: 'navCommunity' },
    { id: 'products', label: 'navProducts' },
    { id: 'articles', label: 'navArticles' }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="glass-panel navbar-premium fade-in" style={styles.navbar}>
      <div className="container" style={styles.navbarContainer}>
        {/* Left Side: Glowing Calligraphy Logo */}
        <div 
          onClick={() => handleNavClick('home')} 
          style={styles.logo} 
          className="logo-gold-glow navbar-logo"
        >
          <span style={styles.logoCrescent}>🌙</span>
          <span style={styles.logoText} className="gold-gradient-text">Arabic Muslim</span>
        </div>

        {/* Center: Desktop Nav Links (Forces single-line, zero wrap!) */}
        <div style={styles.desktopNav} className="navbar-desktop-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                ...styles.navLink,
                color: activePage === item.id ? 'var(--text-gold)' : 'var(--text-secondary)',
                textShadow: activePage === item.id ? '0 0 10px rgba(212, 175, 55, 0.4)' : 'none'
              }}
              className="premium-nav-item"
            >
              {t(item.label)}
              {activePage === item.id && <span style={styles.activeGoldDot}></span>}
            </button>
          ))}
        </div>

        {/* Right Side: Sleek Search + Language + Auth */}
        <div style={styles.rightSide}>
          {/* Spaced Search Bar */}
          <div style={{
            ...styles.searchWrapper,
            borderColor: searchFocused ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.15)',
            boxShadow: searchFocused ? '0 0 15px rgba(212, 175, 55, 0.2)' : 'none',
            background: searchFocused ? 'rgba(8, 9, 13, 0.95)' : 'rgba(255, 255, 255, 0.02)'
          }} className="navbar-search-wrapper">
            <Search size={13} color="var(--text-gold)" style={styles.searchIcon} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? "Search..." : "ابحث..."}
              style={styles.searchInput}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchQuery && (
              <X 
                size={13} 
                color="var(--text-secondary)" 
                onClick={() => setSearchQuery("")} 
                style={{ cursor: 'pointer' }}
              />
            )}
          </div>

          {/* Lang Selector */}
          <button 
            onClick={toggleLanguage} 
            style={styles.langBtn}
            className="lang-btn-premium navbar-lang-btn"
          >
            <Globe size={13} color="var(--text-gold)" />
            <span style={styles.langBtnText}>{language === 'en' ? "AR" : "EN"}</span>
          </button>

          {/* User Auth Badge */}
          {isAuthenticated ? (
            <div style={styles.profileBadge} className="glass-panel profile-badge-glow navbar-profile-badge">
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
                <LogOut size={13} color="#ff6b6b" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleNavClick('login')} 
              className="btn-primary navbar-login-btn" 
              style={styles.loginBtn}
            >
              <User size={13} />
              <span style={{ fontSize: '0.78rem', fontWeight: '700' }}>{t('navLogin')}</span>
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            style={styles.mobileToggle}
            className="navbar-mobile-toggle"
          >
            {mobileMenuOpen ? <X size={20} color="var(--text-gold)" /> : <Menu size={20} color="var(--text-gold)" />}
          </button>
        </div>
      </div>

      {/* Responsive Drawer Mobile Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer} className="glass-panel slide-up">
          {/* Mobile Search */}
          <div style={styles.mobileSearchWrapper}>
            <Search size={14} color="var(--text-gold)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? "Search..." : "ابحث..."}
              style={styles.mobileSearchInput}
            />
            {searchQuery && <X size={14} onClick={() => setSearchQuery("")} style={{ cursor: 'pointer' }} />}
          </div>

          {/* Links list */}
          <div style={styles.mobileNavLinks}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  ...styles.mobileNavLink,
                  color: activePage === item.id ? 'var(--text-gold)' : 'var(--text-primary)',
                  borderLeft: activePage === item.id && language !== 'ar' ? '3px solid var(--gold-primary)' : '3px solid transparent',
                  borderRight: activePage === item.id && language === 'ar' ? '3px solid var(--gold-primary)' : '3px solid transparent'
                }}
                className="navbar-mobile-nav-link"
              >
                {t(item.label)}
              </button>
            ))}

            <div style={styles.mobileDivider}></div>

            {/* Language and Auth */}
            <div style={styles.mobileActions}>
              <button onClick={toggleLanguage} style={styles.mobileLangBtn}>
                <Globe size={16} color="var(--text-gold)" />
                <span>{language === 'en' ? "العربية (Arabic)" : "English (الإنجليزية)"}</span>
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
                    <LogOut size={14} />
                    <span>{t('navLogout')}</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleNavClick('login')} 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', height: '40px' }}
                >
                  <User size={14} />
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
    top: '8px',
    left: '2%',
    right: '2%',
    width: '96%',
    zIndex: 1000,
    borderRadius: '15px',
    border: '1.5px solid rgba(212, 175, 55, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 15px rgba(212, 175, 55, 0.03)',
    background: 'rgba(8, 9, 13, 0.72)',
    backdropFilter: 'blur(25px) saturate(180%)',
    WebkitBackdropFilter: 'blur(25px) saturate(180%)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  navbarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '52px',
    padding: '0 20px',
    maxWidth: '1600px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    userSelect: 'none',
    marginRight: '24px', /* Generous distance from left in LTR */
    flexShrink: 0,
    transition: 'all 0.3s ease',
  },
  logoCrescent: {
    fontSize: '1.35rem',
    filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.4))',
  },
  logoText: {
    fontFamily: "'Cairo', 'Playfair Display', serif",
    fontSize: '1.15rem',
    fontWeight: '800',
    letterSpacing: '0.5px',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px', /* Tightened spacing to cleanly fit 6 items */
    flexGrow: 1,
    justifyContent: 'center',
    margin: '0 16px',
    overflow: 'hidden',
  },
  navLink: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: '600',
    letterSpacing: '0.3px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '4px 2px',
    position: 'relative',
  },
  activeGoldDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: 'var(--gold-primary)',
    position: 'absolute',
    bottom: '-2px',
    boxShadow: '0 0 6px var(--gold-primary)',
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid rgba(212, 175, 55, 0.15)',
    borderRadius: '30px',
    padding: '5px 10px',
    width: '130px', /* Elegant compact width */
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    marginLeft: '12px',
  },
  searchIcon: {
    marginRight: '4px',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.78rem',
    width: '100%',
  },
  langBtn: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(212, 175, 55, 0.15)',
    borderRadius: '8px',
    padding: '6px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  langBtnText: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  loginBtn: {
    padding: '6px 14px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(212, 175, 55, 0.15)',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 10px',
    background: 'rgba(212, 175, 55, 0.05)',
    borderRadius: '30px',
    border: '1px solid rgba(212, 175, 55, 0.25)',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  profileTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  avatarEmoji: {
    fontSize: '1.1rem',
  },
  profileName: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '2px',
    transition: 'var(--transition-fast)',
  },
  mobileToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  mobileDrawer: {
    position: 'absolute',
    top: '62px', /* Matches the new smaller top (8px) + height (52px) = 60px + 2px offset */
    left: '0',
    right: '0',
    width: '100%',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 999,
    borderRadius: '15px',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    background: 'rgba(8, 9, 13, 0.98)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
  },
  mobileSearchWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '10px',
    padding: '8px 12px',
    gap: '8px',
  },
  mobileSearchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    width: '100%',
    fontSize: '0.88rem',
  },
  mobileNavLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mobileNavLink: {
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '0.92rem',
    fontWeight: '600',
    padding: '10px 14px',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'var(--transition-fast)',
  },
  mobileDivider: {
    height: '1px',
    background: 'rgba(212, 175, 55, 0.1)',
    margin: '6px 0',
  },
  mobileActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  mobileLangBtn: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(212, 175, 55, 0.15)',
    borderRadius: '8px',
    padding: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-primary)',
    fontWeight: '600',
    fontSize: '0.88rem',
  },
  mobileProfilePanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    background: 'rgba(212, 175, 55, 0.03)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '10px',
    padding: '12px',
  },
  mobileUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  mobileUserAvatar: {
    fontSize: '1.8rem',
  },
  mobileUserName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
  },
  mobileUserRole: {
    fontSize: '0.74rem',
    color: 'var(--text-secondary)',
  },
  mobileLogoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: 'rgba(255, 107, 107, 0.08)',
    border: '1px solid rgba(255, 107, 107, 0.25)',
    color: '#ff6b6b',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
  }
};

if (typeof document !== 'undefined') {
  const customStyles = document.createElement('style');
  customStyles.innerHTML = `
    .navbar-premium {
      top: 8px !important;
    }
    .logo-gold-glow:hover {
      filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.7));
      transform: translateY(-0.5px) scale(1.02);
    }
    .logo-gold-glow {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .premium-nav-item {
      position: relative;
      padding-bottom: 4px !important;
      white-space: nowrap !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .premium-nav-item::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 50%;
      width: 0;
      height: 1.5px;
      background: var(--gold-gradient);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateX(-50%);
      box-shadow: 0 0 8px rgba(212,175,55,0.6);
    }
    .premium-nav-item:hover::after {
      width: 80%;
    }
    .premium-nav-item:hover {
      color: var(--text-gold) !important;
      transform: translateY(-1px) scale(1.04);
      text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
    }
    .lang-btn-premium {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .lang-btn-premium:hover {
      border-color: var(--gold-primary) !important;
      background: rgba(212, 175, 55, 0.05) !important;
      box-shadow: 0 0 8px rgba(212, 175, 55, 0.15);
      transform: translateY(-1px);
    }
    .profile-badge-glow {
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.05);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .profile-badge-glow:hover {
      border-color: var(--gold-primary) !important;
      box-shadow: 0 0 15px rgba(212, 175, 55, 0.25) !important;
      transform: translateY(-1px);
    }
    
    /* Responsive Media Queries fixing spacing and wrapping */
    @media (max-width: 1280px) {
      .navbar-premium .navbar-desktop-nav {
        gap: 10px !important;
        margin: 0 10px !important;
      }
      .navbar-premium .navbar-logo {
        margin-right: 12px !important;
      }
      .navbar-premium .navbar-search-wrapper {
        width: 110px !important;
        margin-left: 8px !important;
      }
    }
    @media (max-width: 1180px) {
      .navbar-premium .navbar-desktop-nav {
        display: none !important;
      }
      .navbar-premium .navbar-search-wrapper {
        display: none !important;
      }
      .navbar-premium .navbar-mobile-toggle {
        display: block !important;
      }
      .navbar-premium .navbar-lang-btn {
        display: none !important;
      }
      .navbar-premium .navbar-profile-badge {
        display: none !important;
      }
      .navbar-premium .navbar-login-btn {
        display: none !important;
      }
    }
    [dir="rtl"] .navbar-premium .navbar-mobile-nav-link {
      text-align: right !important;
      border-left: none !important;
      border-right: 3px solid var(--gold-primary) !important;
    }
    [dir="rtl"] .navbar-premium .navbar-logo {
      margin-right: 0 !important;
      margin-left: 24px !important;
    }
    [dir="rtl"] .navbar-premium .navbar-search-wrapper {
      margin-left: 0 !important;
      margin-right: 12px !important;
    }
    @media (max-width: 1280px) {
      [dir="rtl"] .navbar-premium .navbar-logo {
        margin-left: 12px !important;
        margin-right: 0 !important;
      }
      [dir="rtl"] .navbar-premium .navbar-search-wrapper {
        margin-right: 8px !important;
        margin-left: 0 !important;
      }
    }
  `;
  document.head.appendChild(customStyles);
}
