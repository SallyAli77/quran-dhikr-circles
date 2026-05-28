import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Heart, Shield, Star, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

const quotes = [
  {
    en: "Indeed, Allah is with those who fear Him and those who are doers of good.",
    ar: "إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا وَّالَّذِينَ هُم مُّحْسِنُونَ (النحل: 128)",
    source: "Surah An-Nahl 16:128"
  },
  {
    en: "And speak to people good words.",
    ar: "وَقُولُوا لِلنَّاسِ حُسْنًا (البقرة: 83)",
    source: "Surah Al-Baqarah 2:83"
  },
  {
    en: "My success is only by Allah. Upon Him I trust, and to Him I turn.",
    ar: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ (هود: 88)",
    source: "Surah Hud 11:88"
  }
];

export default function Footer({ setActivePage }) {
  const { language, t } = useApp();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [dailyQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setSubscribed(true);
    setEmail("");
    
    // Play subtle success confetti
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.9 },
      colors: ['#d4af37', '#ffffff', '#c5a059']
    });
  };

  return (
    <footer style={styles.footer} className="glass-panel">
      <div className="container" style={styles.container}>
        {/* Quote Panel */}
        <div style={styles.quoteCard} className="glass-panel">
          <BookOpen size={20} color="var(--text-gold)" style={styles.quoteIcon} />
          <p style={styles.quoteText}>
            "{language === 'en' ? dailyQuote.en : dailyQuote.ar}"
          </p>
          <span style={styles.quoteSource}>{dailyQuote.source}</span>
        </div>

        {/* Grid links */}
        <div style={styles.footerGrid}>
          {/* Logo & Info */}
          <div style={styles.footerCol}>
            <div style={styles.logo}>
              <span style={{ fontSize: '1.5rem' }}>🌙</span>
              <span style={styles.logoText} className="gold-gradient-text">ArabicMuslim</span>
            </div>
            <p style={styles.colText}>
              {language === 'en' 
                ? "Connecting Muslims globally through a premium digital portal designed to bring Quran, remembrance, and authentic learning tools together."
                : "ربط المسلمين عالمياً عبر بوابة رقمية فاخرة مصممة لجمع القرآن الكريم والذكر وأدوات التعلم الأصيلة معاً."
              }
            </p>
          </div>

          {/* Quick Links */}
          <div style={styles.footerCol}>
            <h4 style={styles.colTitle}>{language === 'en' ? "Explore Portal" : "استكشف البوابة"}</h4>
            <ul style={styles.linkList}>
              <li>
                <button onClick={() => { setActivePage('home'); window.scrollTo({top:0, behavior:'smooth'}); }} style={styles.footerBtn}>
                  {t('navHome')}
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('quran'); window.scrollTo({top:0, behavior:'smooth'}); }} style={styles.footerBtn}>
                  {t('navQuran')}
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('prayer'); window.scrollTo({top:0, behavior:'smooth'}); }} style={styles.footerBtn}>
                  {t('navPrayer')}
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('articles'); window.scrollTo({top:0, behavior:'smooth'}); }} style={styles.footerBtn}>
                  {t('navArticles')}
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div style={styles.footerCol}>
            <h4 style={styles.colTitle}>{language === 'en' ? "Premium Newsletter" : "النشرة الإخبارية"}</h4>
            <p style={styles.colText}>
              {language === 'en'
                ? "Receive weekly spiritual insights, newly added lessons, and exclusive book recommendations."
                : "تلقَ الرؤى الروحانية الأسبوعية، الدروس الجديدة، وتوصيات الكتب الحصرية."
              }
            </p>

            {subscribed ? (
              <div style={styles.subSuccess} className="fade-in">
                <Heart size={14} color="var(--text-gold)" />
                <span>{language === 'en' ? "Thank you for subscribing!" : "شكرًا لاهتمامك بالاشتراك!"}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={styles.subForm}>
                <input
                  type="email"
                  required
                  placeholder={language === 'en' ? "Enter your email..." : "أدخل بريدك الإلكتروني..."}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.subInput}
                />
                <button type="submit" style={styles.subSubmit}>
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={styles.divider}></div>

        {/* Bottom Rights */}
        <div style={styles.bottomBar}>
          <div style={styles.copyright}>
            <span>© {new Date().getFullYear()} ArabicMuslim.</span>
            <span> {language === 'en' ? "All rights reserved." : "جميع الحقوق محفوظة."}</span>
          </div>
          <div style={styles.poweredBy}>
            <Shield size={12} color="var(--text-gold)" />
            <span>arabicmuslim.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    borderTop: '1px solid var(--border-gold)',
    borderRadius: '24px 24px 0 0',
    background: 'rgba(11, 12, 16, 0.95)',
    padding: '60px 0 30px 0',
    marginTop: '80px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  quoteCard: {
    padding: '24px',
    borderRadius: '16px',
    background: 'rgba(212, 175, 55, 0.03)',
    border: '1px solid rgba(212, 175, 55, 0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  quoteIcon: {
    marginBottom: '4px',
  },
  quoteText: {
    fontStyle: 'italic',
    fontSize: '1.05rem',
    color: 'var(--text-primary)',
    lineHeight: '1.6',
  },
  quoteSource: {
    fontSize: '0.8rem',
    color: 'var(--text-gold)',
    letterSpacing: '1px',
    fontWeight: '600',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 1.5fr',
    gap: '40px',
    marginTop: '10px',
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.3rem',
    fontWeight: '700',
  },
  colText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  colTitle: {
    fontSize: '1rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  linkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  footerBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    padding: '2px 0',
  },
  subForm: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-gold)',
    borderRadius: '30px',
    padding: '4px 4px 4px 14px',
    width: '100%',
  },
  subInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    flexGrow: 1,
    paddingRight: '10px',
  },
  subSubmit: {
    background: 'var(--gold-gradient)',
    color: '#000',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  subSuccess: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    background: 'rgba(212, 175, 55, 0.05)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    color: 'var(--text-gold)',
    fontSize: '0.85rem',
  },
  divider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.05)',
  },
  bottomBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  copyright: {
    display: 'flex',
    gap: '4px',
  },
  poweredBy: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
};

if (typeof document !== 'undefined') {
  const footerStyle = document.createElement('style');
  footerStyle.innerHTML = `
    @media (max-width: 768px) {
      footer [style*="footerGrid"] {
        grid-template-columns: 1fr !important;
        gap: 30px !important;
      }
      footer [style*="bottomBar"] {
        flex-direction: column !important;
        gap: 15px !important;
        text-align: center !important;
      }
    }
    [dir="rtl"] footer [style*="footerBtn"] {
      text-align: right !important;
    }
    [dir="rtl"] footer [style*="subInput"] {
      padding-right: 0 !important;
      padding-left: 10px !important;
    }
  `;
  document.head.appendChild(footerStyle);
}
