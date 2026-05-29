import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Globe, Menu, X, User, LogOut, Sparkles } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const { language, setLanguage, searchQuery, setSearchQuery, isAuthenticated, user, logout, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [othersDropdownOpen, setOthersDropdownOpen] = useState(false);
  const [mobileOthersOpen, setMobileOthersOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const navItems = [
    { id: 'home', label: 'navHome' },
    { id: 'quran', label: 'navQuran' },
    { id: 'prayer', label: 'navPrayer' },
    { id: 'community', label: 'navCommunity' }
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
          <span style={styles.logoText} className="gold-gradient-text">ArabicMuslim</span>
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

          {/* Group "Others / أخرى" Dropdown */}
          <div 
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setOthersDropdownOpen(true)}
            onMouseLeave={() => setOthersDropdownOpen(false)}
          >
            <button
              style={{
                ...styles.navLink,
                color: (activePage === 'products' || activePage === 'articles') ? 'var(--text-gold)' : 'var(--text-secondary)',
                textShadow: (activePage === 'products' || activePage === 'articles') ? '0 0 10px rgba(212, 175, 55, 0.4)' : 'none'
              }}
              className="premium-nav-item"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{language === 'ar' ? "أخرى" : "Others"}</span>
                <span style={{ fontSize: '0.65rem', marginLeft: '3px' }}>▼</span>
              </div>
              {(activePage === 'products' || activePage === 'articles') && <span style={styles.activeGoldDot}></span>}
            </button>

            {othersDropdownOpen && (
              <div style={styles.othersDropdown} className="glass-panel fade-in">
                <button 
                  onClick={() => handleNavClick('products')}
                  style={{
                    ...styles.dropdownItem,
                    color: activePage === 'products' ? 'var(--text-gold)' : 'var(--text-primary)',
                    background: activePage === 'products' ? 'rgba(212,175,55,0.08)' : 'transparent'
                  }}
                  className="dropdown-item-hover"
                >
                  {language === 'ar' ? "المتجر الإسلامي" : "Islamic Store"}
                </button>
                <button 
                  onClick={() => handleNavClick('articles')}
                  style={{
                    ...styles.dropdownItem,
                    color: activePage === 'articles' ? 'var(--text-gold)' : 'var(--text-primary)',
                    background: activePage === 'articles' ? 'rgba(212,175,55,0.08)' : 'transparent'
                  }}
                  className="dropdown-item-hover"
                >
                  {language === 'ar' ? "المقالات والأخبار" : "Articles & News"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Sleek Search + Language + Auth */}
        <div style={styles.rightSide}>
          {/* Spaced Search Bar */}
          <div style={{
            ...styles.searchWrapper,
            borderColor: searchFocused ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.25)',
            boxShadow: searchFocused ? '0 0 15px rgba(212, 175, 55, 0.2)' : 'none',
            background: searchFocused ? 'rgba(8, 9, 13, 0.95)' : 'rgba(255, 255, 255, 0.02)'
          }} className="navbar-search-wrapper">
            <Search size={15} color="var(--text-gold)" style={styles.searchIcon} />
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
            <Globe size={15} color="var(--text-gold)" />
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
              <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>{t('navLogin')}</span>
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            style={styles.mobileToggle}
            className="navbar-mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} color="var(--text-gold)" /> : <Menu size={24} color="var(--text-gold)" />}
          </button>
        </div>
      </div>

      {/* Responsive Drawer Mobile Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer} className="glass-panel slide-up">
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

          {/* Links list */}
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
                className="navbar-mobile-nav-link"
              >
                {t(item.label)}
              </button>
            ))}

            {/* Mobile Collapsible "Others / أخرى" Accordion */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <button
                onClick={() => setMobileOthersOpen(!mobileOthersOpen)}
                style={{
                  ...styles.mobileNavLink,
                  color: (activePage === 'products' || activePage === 'articles') ? 'var(--text-gold)' : 'var(--text-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  borderLeft: (activePage === 'products' || activePage === 'articles') ? '3px solid var(--gold-primary)' : '3px solid transparent'
                }}
              >
                <span>{language === 'ar' ? "أخرى" : "Others"}</span>
                <span style={{ fontSize: '0.7rem' }}>{mobileOthersOpen ? "▲" : "▼"}</span>
              </button>

              {mobileOthersOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: language === 'ar' ? 0 : '20px', paddingRight: language === 'ar' ? '20px' : 0, gap: '6px', marginTop: '4px' }} className="fade-in">
                  <button
                    onClick={() => handleNavClick('products')}
                    style={{
                      ...styles.mobileNavLink,
                      fontSize: '0.82rem',
                      color: activePage === 'products' ? 'var(--text-gold)' : 'var(--text-secondary)',
                      padding: '8px 12px'
                    }}
                  >
                    {language === 'ar' ? "المتجر الإسلامي" : "Islamic Store"}
                  </button>
                  <button
                    onClick={() => handleNavClick('articles')}
                    style={{
                      ...styles.mobileNavLink,
                      fontSize: '0.82rem',
                      color: activePage === 'articles' ? 'var(--text-gold)' : 'var(--text-secondary)',
                      padding: '8px 12px'
                    }}
                  >
                    {language === 'ar' ? "المقالات والأخبار" : "Articles & News"}
                  </button>
                </div>
              )}
            </div>

            <div style={styles.mobileDivider}></div>

            {/* Language and Auth */}
            <div style={styles.mobileActions}>
              <button onClick={toggleLanguage} style={styles.mobileLangBtn}>
                <Globe size={18} color="var(--text-gold)" />
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
    top: '15px',
    left: '2%',
    right: '2%',
    width: '96%',
    zIndex: 1000,
    borderRadius: '20px',
    border: '1.5px solid rgba(212, 175, 55, 0.25)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 15px rgba(212, 175, 55, 0.05)',
    background: 'rgba(8, 9, 13, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    transition: 'var(--transition-smooth)',
  },
  navbarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '76px',
    padding: '0 32px',
    maxWidth: '1600px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    userSelect: 'none',
    marginRight: '50px', /* Generous distance from left in LTR */
    flexShrink: 0,
  },
  logoCrescent: {
    fontSize: '1.8rem',
    filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.4))',
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem',
    fontWeight: '800',
    letterSpacing: '1px',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '28px', /* Premium layout spacing */
    flexGrow: 1,
    justifyContent: 'center',
    margin: '0 40px', /* Increased margin for logo/search isolation */
    overflow: 'hidden',
  },
  navLink: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.88rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
    transition: 'var(--transition-smooth)',
    whiteSpace: 'nowrap', /* Forces every single link on exactly one line! */
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 4px',
    position: 'relative',
  },
  activeGoldDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: 'var(--gold-primary)',
    position: 'absolute',
    bottom: '-1px',
    boxShadow: '0 0 6px var(--gold-primary)',
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexShrink: 0,
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid rgba(212, 175, 55, 0.25)',
    borderRadius: '30px',
    padding: '7px 14px',
    width: '180px', /* Elegant compact width */
    transition: 'var(--transition-smooth)',
    marginLeft: '30px', /* Increased spacing to distance search bar from center nav */
  },
  searchIcon: {
    marginRight: '6px',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.82rem',
    width: '100%',
  },
  langBtn: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '10px',
    padding: '8px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'var(--transition-smooth)',
  },
  langBtnText: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  loginBtn: {
    padding: '8px 18px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)',
    whiteSpace: 'nowrap', /* Guarantee single line */
  },
  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 14px',
    background: 'rgba(212, 175, 55, 0.05)',
    borderRadius: '30px',
    border: '1.5px solid rgba(212, 175, 55, 0.3)',
    whiteSpace: 'nowrap', /* Guarantee single line */
  },
  profileTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    whiteSpace: 'nowrap', /* Guarantee single line */
  },
  avatarEmoji: {
    fontSize: '1.25rem',
  },
  profileName: {
    fontSize: '0.82rem',
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
    top: '86px',
    left: '0',
    right: '0',
    width: '100%',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    zIndex: 999,
    borderRadius: '20px',
    border: '1.5px solid rgba(212, 175, 55, 0.25)',
    background: 'rgba(8, 9, 13, 0.98)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
  },
  mobileSearchWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(212, 175, 55, 0.25)',
    borderRadius: '12px',
    padding: '10px 14px',
    gap: '10px',
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
    gap: '10px',
  },
  mobileNavLink: {
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '1rem',
    fontWeight: '600',
    padding: '12px 16px',
    cursor: 'pointer',
    borderRadius: '10px',
    transition: 'var(--transition-fast)',
  },
  mobileDivider: {
    height: '1px',
    background: 'rgba(212, 175, 55, 0.15)',
    margin: '8px 0',
  },
  mobileActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mobileLangBtn: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '10px',
    padding: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  mobileProfilePanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: 'rgba(212, 175, 55, 0.05)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '12px',
    padding: '14px',
  },
  mobileUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  mobileUserAvatar: {
    fontSize: '2.2rem',
  },
  mobileUserName: {
    fontSize: '0.98rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
  },
  mobileUserRole: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
  },
  mobileLogoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'rgba(255, 107, 107, 0.08)',
    border: '1px solid rgba(255, 107, 107, 0.25)',
    color: '#ff6b6b',
    borderRadius: '10px',
    padding: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  othersDropdown: {
    position: 'absolute',
    top: '55px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '180px',
    background: 'rgba(8, 9, 13, 0.98)',
    border: '1.5px solid rgba(212,175,55,0.3)',
    borderRadius: '12px',
    padding: '8px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
    zIndex: 1100,
  },
  dropdownItem: {
    background: 'none',
    border: 'none',
    width: '100%',
    padding: '10px 16px',
    textAlign: 'center',
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  }
};

if (typeof document !== 'undefined') {
  const customStyles = document.createElement('style');
  customStyles.innerHTML = `
    .navbar-premium {
      top: 15px !important;
    }
    .logo-gold-glow:hover {
      filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.6));
      transform: translateY(-0.5px);
    }
    .logo-gold-glow {
      transition: var(--transition-smooth);
    }
    .premium-nav-item {
      position: relative;
      padding-bottom: 6px !important;
      white-space: nowrap !important; /* Forces link text strictly into a single line */
    }
    .premium-nav-item::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 1.5px;
      background: var(--gold-gradient);
      transition: var(--transition-smooth);
      transform: translateX(-50%);
      box-shadow: 0 0 8px rgba(212,175,55,0.6);
    }
    .premium-nav-item:hover::after {
      width: 80%;
    }
    .premium-nav-item:hover {
      color: var(--text-gold) !important;
    }
    .lang-btn-premium:hover {
      border-color: var(--gold-primary) !important;
      background: rgba(212, 175, 55, 0.05) !important;
      box-shadow: 0 0 8px rgba(212, 175, 55, 0.1);
    }
    .profile-badge-glow {
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.1);
      transition: var(--transition-smooth);
    }
    .profile-badge-glow:hover {
      border-color: var(--gold-primary) !important;
      box-shadow: 0 0 15px rgba(212, 175, 55, 0.25) !important;
    }
    
    /* Responsive Media Queries fixing spacing and wrapping */
    @media (max-width: 1280px) {
      .navbar-premium .navbar-desktop-nav {
        gap: 16px !important;
        margin: 0 20px !important;
      }
      .navbar-premium .navbar-logo {
        margin-right: 30px !important;
      }
      .navbar-premium .navbar-search-wrapper {
        width: 145px !important;
        margin-left: 15px !important;
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
      margin-left: 50px !important;
    }
    [dir="rtl"] .navbar-premium .navbar-search-wrapper {
      margin-left: 0 !important;
      margin-right: 30px !important;
    }
    @media (max-width: 1280px) {
      [dir="rtl"] .navbar-premium .navbar-logo {
        margin-left: 30px !important;
        margin-right: 0 !important;
      }
      [dir="rtl"] .navbar-premium .navbar-search-wrapper {
        margin-right: 15px !important;
        margin-left: 0 !important;
      }
    }
    
    .dropdown-item-hover:hover {
      background: rgba(212, 175, 55, 0.12) !important;
      color: var(--text-gold) !important;
    }
    
    [dir="rtl"] .navbar-premium .othersDropdown {
      box-shadow: 0 10px 30px rgba(0,0,0,0.7) !important;
    }

  `;
  document.head.appendChild(customStyles);
}
