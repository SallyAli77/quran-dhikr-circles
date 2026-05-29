import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Clock, MapPin, Volume2, VolumeX, AlertCircle, Play, BellRing, Settings } from 'lucide-react';
import confetti from 'canvas-confetti';

// Pre-seeded coordinates and timings for selected global centers representing standard calculations
const citiesData = {
  makkah: {
    name: "Makkah",
    nameAr: "مكة المكرمة",
    timezone: "Asia/Riyadh",
    timings: { Fajr: "04:12", Sunrise: "05:34", Dhuhr: "12:22", Asr: "15:42", Maghrib: "19:04", Isha: "20:34" }
  },
  cairo: {
    name: "Cairo",
    nameAr: "القاهرة",
    timezone: "Africa/Cairo",
    timings: { Fajr: "04:12", Sunrise: "05:55", Dhuhr: "12:52", Asr: "16:29", Maghrib: "19:50", Isha: "21:22" }
  },
  london: {
    name: "London",
    nameAr: "لندن",
    timezone: "Europe/London",
    timings: { Fajr: "02:50", Sunrise: "04:50", Dhuhr: "13:00", Asr: "17:12", Maghrib: "21:05", Isha: "22:30" }
  },
  newyork: {
    name: "New York",
    nameAr: "نيويورك",
    timezone: "America/New_York",
    timings: { Fajr: "03:52", Sunrise: "05:28", Dhuhr: "12:56", Asr: "16:54", Maghrib: "20:18", Isha: "21:48" }
  },
  dubai: {
    name: "Dubai",
    nameAr: "دبي",
    timezone: "Asia/Dubai",
    timings: { Fajr: "04:02", Sunrise: "05:25", Dhuhr: "12:15", Asr: "15:35", Maghrib: "18:58", Isha: "20:22" }
  }
};

const calculationMethods = {
  mwl: { name: "Muslim World League", angle: "18° / 17°" },
  isna: { name: "Islamic Society of North America", angle: "15° / 15°" },
  egypt: { name: "Egyptian General Authority", angle: "19.5° / 17.5°" },
  makkah: { name: "Umm Al-Qura University, Makkah", angle: "18.5°" }
};

export default function PrayerTimes() {
  const { language, t } = useApp();
  const [selectedCityKey, setSelectedCityKey] = useState("cairo");
  const [method, setMethod] = useState("egypt");
  const [athanEnabled, setAthanEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Audio Athan Recitation Player
  const [isAthanPlaying, setIsAthanPlaying] = useState(false);
  const athanAudioRef = useRef(null);

  const city = citiesData[selectedCityKey];

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute local timezone offsets to display correct local clock
  const getCityLocalTime = () => {
    try {
      const options = {
        timeZone: city.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      return new Intl.DateTimeFormat([], options).format(currentTime);
    } catch (e) {
      return currentTime.toLocaleTimeString();
    }
  };

  const getCityDate = () => {
    try {
      const options = {
        timeZone: city.timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-SA', options).format(currentTime);
    } catch (e) {
      return currentTime.toLocaleDateString();
    }
  };

  // Extract hours and minutes from a timing string e.g., "19:04"
  const parseTiming = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date(currentTime);
    date.setHours(h, m, 0, 0);
    return date;
  };

  // Find next prayer and calculate countdown
  const getNextPrayer = () => {
    const timings = city.timings;
    const now = new Date();
    
    // Convert current time to selected city timezone for accurate comparisons
    const localTimeStr = new Intl.DateTimeFormat([], { timeZone: city.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
    const [localH, localM, localS] = localTimeStr.split(':').map(Number);
    
    const cityNow = new Date(now);
    cityNow.setHours(localH, localM, localS, 0);

    const prayerOrder = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    
    let nextPrayerName = "Fajr";
    let nextPrayerTime = null;

    for (let p of prayerOrder) {
      const pTime = parseTiming(timings[p]);
      if (pTime > cityNow) {
        nextPrayerName = p;
        nextPrayerTime = pTime;
        break;
      }
    }

    // If all prayers today have passed, the next is Fajr tomorrow
    if (!nextPrayerTime) {
      nextPrayerName = "Fajr";
      nextPrayerTime = parseTiming(timings["Fajr"]);
      nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
    }

    const diffMs = nextPrayerTime - cityNow;
    const diffSecs = Math.floor(diffMs / 1000);
    
    const hrs = Math.floor(diffSecs / 3600);
    const mins = Math.floor((diffSecs % 3600) / 60);
    const secs = diffSecs % 60;

    return {
      name: nextPrayerName,
      timeString: timings[nextPrayerName],
      countdown: `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
      rawDiff: diffSecs
    };
  };

  const nextPrayer = getNextPrayer();

  // Gentle, high-quality public Athan audio stream
  const athanAudioUrl = "https://www.islamcan.com/audio/adhan/azan2.mp3"; // Beautiful gentle Mecca Athan

  const handleTestAthan = () => {
    if (!athanAudioRef.current) return;
    
    if (isAthanPlaying) {
      athanAudioRef.current.pause();
      athanAudioRef.current.currentTime = 0;
      setIsAthanPlaying(false);
    } else {
      setIsAthanPlaying(true);
      athanAudioRef.current.play()
        .then(() => {
          // Play confetti trigger on listening
          confetti({
            particleCount: 30,
            spread: 50,
            colors: ['#d4af37', '#ffffff']
          });
        })
        .catch(err => {
          console.error("Athan playback failed", err);
          setIsAthanPlaying(false);
        });
    }
  };

  // If countdown reaches 0, trigger Athan audio automatically
  useEffect(() => {
    if (nextPrayer.rawDiff === 0 && athanEnabled) {
      if (athanAudioRef.current) {
        setIsAthanPlaying(true);
        athanAudioRef.current.play().catch(e => console.log(e));
        confetti({
          particleCount: 100,
          spread: 80,
          colors: ['#d4af37', '#ffffff', '#c5a059']
        });
      }
    }
  }, [nextPrayer.rawDiff, athanEnabled]);

  const arabicTimingsNames = {
    Fajr: "الفجر",
    Sunrise: "الشروق",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء"
  };

  return (
    <div className="prayer-page container fade-in" style={{ minHeight: '80vh' }}>
      <div style={styles.header}>
        <Compass size={32} color="var(--text-gold)" style={styles.headerIcon} />
        <h1 style={styles.title}>{t('prayerTitle')}</h1>
        <p style={styles.subtitle}>{t('prayerSubtitle')}</p>
      </div>

      <div style={styles.layoutGrid} className="grid-2">
        {/* Left Card: Countdown Timer */}
        <div style={styles.leftPanel} className="glass-panel">
          <div className="islamic-pattern"></div>
          
          <div style={styles.metaRow}>
            <div style={styles.cityBadge}>
              <MapPin size={14} color="var(--text-gold)" />
              <span>{language === 'en' ? city.name : city.nameAr}</span>
            </div>
            
            <div style={styles.dateBadge}>
              <Clock size={14} color="var(--text-gold)" />
              <span>{getCityLocalTime()}</span>
            </div>
          </div>

          <div style={styles.countdownCenter}>
            <div style={styles.countdownTitle}>
              {t('prayerNextIn')} <span style={styles.glowText}>{language === 'en' ? nextPrayer.name : arabicTimingsNames[nextPrayer.name]}</span>
            </div>
            <div style={styles.countdownClock} className="gold-gradient-text gold-glow-text">
              {nextPrayer.countdown}
            </div>
            <div style={styles.prayerTimeLabel}>
              {language === 'en' ? "Scheduled at" : "المقرر في"} <strong style={{ color: 'var(--text-gold)' }}>{nextPrayer.timeString}</strong>
            </div>
          </div>

          <div style={styles.actionRow}>
            {/* Hidden audio element */}
            <audio 
              ref={athanAudioRef} 
              src={athanAudioUrl} 
              onEnded={() => setIsAthanPlaying(false)}
            />
            
            <button 
              onClick={handleTestAthan} 
              style={styles.actionBtn} 
              className={isAthanPlaying ? "btn-secondary" : "btn-primary"}
            >
              <Volume2 size={16} />
              <span>{isAthanPlaying ? (language === 'en' ? "Stop Athan" : "إيقاف الأذان") : (language === 'en' ? "Listen Athan Recitation" : "استمع للأذان")}</span>
            </button>

            <button 
              onClick={() => setAthanEnabled(!athanEnabled)} 
              style={styles.iconToggleBtn}
              className="glass-panel"
              title={t('prayerAthanToggle')}
            >
              {athanEnabled ? <BellRing size={16} color="var(--text-gold)" /> : <VolumeX size={16} color="var(--text-muted)" />}
            </button>
          </div>

          <p style={styles.dateLabel}>{getCityDate()}</p>
        </div>

        {/* Right Card: Full Timings Grid & Settings */}
        <div style={styles.rightPanel} className="glass-panel">
          <div style={styles.settingsHeader}>
            <h3 style={styles.panelTitle}>{t('prayerToday')}</h3>
            
            {/* City Selector */}
            <div style={styles.selectWrapper}>
              <select 
                value={selectedCityKey}
                onChange={(e) => setSelectedCityKey(e.target.value)}
                style={styles.selectInput}
              >
                <option value="makkah" style={{ backgroundColor: '#0f111a', color: '#f5f6f8' }}>{language === 'en' ? "Makkah" : "مكة المكرمة"}</option>
                <option value="cairo" style={{ backgroundColor: '#0f111a', color: '#f5f6f8' }}>{language === 'en' ? "Cairo" : "القاهرة"}</option>
                <option value="london" style={{ backgroundColor: '#0f111a', color: '#f5f6f8' }}>{language === 'en' ? "London" : "لندن"}</option>
                <option value="newyork" style={{ backgroundColor: '#0f111a', color: '#f5f6f8' }}>{language === 'en' ? "New York" : "نيويورك"}</option>
                <option value="dubai" style={{ backgroundColor: '#0f111a', color: '#f5f6f8' }}>{language === 'en' ? "Dubai" : "دبي"}</option>
              </select>
            </div>
          </div>

          {/* Timings List */}
          <div style={styles.timingsList}>
            {Object.entries(city.timings).map(([name, time]) => {
              const isActive = nextPrayer.name === name;
              return (
                <div 
                  key={name} 
                  style={{
                    ...styles.timingRow,
                    background: isActive ? 'rgba(212, 175, 55, 0.06)' : 'rgba(255, 255, 255, 0.01)',
                    borderColor: isActive ? 'var(--gold-primary)' : 'var(--border-glass)'
                  }}
                  className="glass-panel active-timing-hover"
                >
                  <span style={styles.timingName}>
                    {language === 'en' ? name : arabicTimingsNames[name]}
                    {name === "Sunrise" && <span style={styles.sunriseNotice}> ({language === 'en' ? "No Prayer" : "شروق الشمس"})</span>}
                  </span>
                  <div style={styles.timingRight}>
                    <span style={{
                      ...styles.timingVal,
                      color: isActive ? 'var(--text-gold)' : 'var(--text-primary)'
                    }}>{time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Settings Section */}
          <div style={styles.settingsFooter}>
            <div style={styles.settingsTitle}>
              <Settings size={14} color="var(--text-gold)" />
              <span>{t('prayerMethod')}</span>
            </div>
            
            <div style={styles.selectWrapper} className="width-full">
              <select 
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                style={{ ...styles.selectInput, width: '100%' }}
              >
                {Object.entries(calculationMethods).map(([k, m]) => (
                  <option key={k} value={k} style={{ backgroundColor: '#0f111a', color: '#f5f6f8' }}>{m.name} ({m.angle})</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
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
  layoutGrid: {
    marginTop: '20px',
  },
  leftPanel: {
    padding: '40px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
  },
  metaRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
    width: '100%',
    justifyContent: 'center',
  },
  cityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(212, 175, 55, 0.05)',
    border: '1px solid var(--border-gold)',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '0.8rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  dateBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-glass)',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '0.8rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
  },
  countdownCenter: {
    margin: '20px 0',
  },
  countdownTitle: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  glowText: {
    color: 'var(--text-gold)',
    fontWeight: '700',
    textShadow: '0 0 10px rgba(212, 175, 55, 0.3)',
  },
  countdownClock: {
    fontSize: '4rem',
    fontWeight: '800',
    margin: '10px 0',
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: '2px',
  },
  prayerTimeLabel: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '30px',
  },
  actionBtn: {
    padding: '12px 24px',
    fontSize: '0.9rem',
  },
  iconToggleBtn: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '1px solid var(--border-gold)',
    background: 'rgba(255, 255, 255, 0.02)',
    transition: 'var(--transition-fast)',
  },
  dateLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '24px',
  },
  rightPanel: {
    padding: '30px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  settingsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '16px',
  },
  panelTitle: {
    fontSize: '1.25rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  selectWrapper: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
  },
  selectInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'var(--text-gold)',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '120px',
  },
  timingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  timingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderRadius: '12px',
    borderWidth: '1px',
    borderStyle: 'solid',
    transition: 'var(--transition-fast)',
  },
  timingName: {
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
  },
  sunriseNotice: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  timingVal: {
    fontSize: '1.05rem',
    fontWeight: '700',
  },
  settingsFooter: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '16px',
  },
  settingsTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  noResults: {
    padding: '40px',
    textAlign: 'center',
  }
};

if (typeof document !== 'undefined') {
  const prayerStyle = document.createElement('style');
  prayerStyle.innerHTML = `
    .active-timing-hover {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .active-timing-hover:hover {
      border-color: var(--border-gold-hover) !important;
      transform: translateX(4px);
    }
    [dir="rtl"] .active-timing-hover:hover {
      transform: translateX(-4px) !important;
    }
    .width-full {
      width: 100% !important;
    }
    .prayer-page select {
      background-color: transparent !important;
      color: var(--text-gold) !important;
    }
    .prayer-page select option {
      background-color: #0f111a !important;
      color: #f5f6f8 !important;
      font-size: 0.85rem;
      padding: 8px;
    }
    @media (max-width: 768px) {
      .prayer-page [style*="countdownClock"] {
        font-size: 2.8rem !important;
      }
      .prayer-page [style*="leftPanel"] {
        padding: 30px 16px !important;
      }
      .prayer-page [style*="rightPanel"] {
        padding: 20px 16px !important;
      }
      .prayer-page [style*="settingsHeader"] {
        flex-direction: column !important;
        align-items: flex-start !important;
      }
      .prayer-page [style*="selectInput"] {
        width: 100% !important;
      }
      .prayer-page [style*="selectWrapper"] {
        width: 100% !important;
      }
    }
  `;
  document.head.appendChild(prayerStyle);
}
