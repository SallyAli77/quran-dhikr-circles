import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Book, Play, Pause, Bookmark, BookmarkCheck, Search, Volume2, Award, ChevronLeft, ArrowRight, Loader, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

// Pristine offline fallback data in case of network unavailability
const fallbackSurahs = [
  {
    number: 1,
    name: "الفاتحة",
    englishName: "Al-Fatiha",
    englishNameTranslation: "The Opening",
    revelationType: "Meccan",
    numberOfVerses: 7,
    verses: [
      { num: 1, ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
      { num: 2, ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", en: "[All] praise is [due] to Allah, Lord of the worlds -" },
      { num: 3, ar: "الرَّحْمَٰنِ الرَّحِيمِ", en: "The Entirely Merciful, the Especially Merciful," },
      { num: 4, ar: "مَالِكِ يَوْمِ الدِّينِ", en: "Sovereign of the Day of Recompense." },
      { num: 5, ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", en: "It is You we worship and You we ask for help." },
      { num: 6, ar: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", en: "Guide us to the straight path -" },
      { num: 7, ar: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", en: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray." }
    ]
  },
  {
    number: 110,
    name: "النصر",
    englishName: "An-Nasr",
    englishNameTranslation: "The Divine Support",
    revelationType: "Medinan",
    numberOfVerses: 3,
    verses: [
      { num: 1, ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
      { num: 1, ar: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", en: "When the victory of Allah has come and the conquest," },
      { num: 2, ar: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", en: "And you see the people entering into the religion of Allah in multitudes," },
      { num: 3, ar: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا", en: "Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance." }
    ]
  }
];

export default function Quran() {
  const { language, searchQuery, bookmarks, toggleBookmark, t } = useApp();
  
  const [surahsList, setSurahsList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState(false);
  const [surahContent, setSurahContent] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const audioRef = useRef(null);

  // Fetch all 114 Surahs meta details on mount
  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          setSurahsList(data.data);
        } else {
          setSurahsList(fallbackSurahs);
        }
        setIsLoadingList(false);
      })
      .catch(err => {
        console.warn("API list query failed, falling back to preloaded Surahs", err);
        setSurahsList(fallbackSurahs);
        setIsLoadingList(false);
      });
  }, []);

  // Fetch specific Surah verses dynamically when selected
  const handleSelectSurah = (surah) => {
    setSelectedSurah(surah);
    setIsLoadingSurah(true);
    setSurahContent(null);

    // If it's one of our preseeded offline fallbacks, load immediately
    const fallback = fallbackSurahs.find(f => f.number === surah.number);
    if (fallback) {
      setSurahContent(fallback);
      setIsLoadingSurah(false);
      return;
    }

    // Parallel fetch for Arabic Text and English Translation
    Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/quran-uthmani`).then(r => r.json()),
      fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/en.sahih`).then(r => r.json())
    ])
      .then(([arData, enData]) => {
        if (arData.code === 200 && enData.code === 200) {
          const mergedVerses = arData.data.ayahs.map((ayah, index) => ({
            num: ayah.numberInSurah,
            ar: ayah.text,
            en: enData.data.ayahs[index].text
          }));

          setSurahContent({
            ...surah,
            verses: mergedVerses
          });
        }
        setIsLoadingSurah(false);
      })
      .catch(err => {
        console.error("Failed fetching Surah details", err);
        setIsLoadingSurah(false);
      });
  };

  const getAudioUrl = (surahId) => {
    const padded = surahId.toString().padStart(3, '0');
    return `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${padded}.mp3`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [selectedSurah]);

  const handlePlayToggle = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setLoadingAudio(true);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setLoadingAudio(false);
        })
        .catch(err => {
          console.error("Audio playback interrupted", err);
          setLoadingAudio(false);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (timeInSecs) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const target = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = target;
      setCurrentTime(target);
    }
  };

  const isVerseBookmarked = (verseId) => {
    return bookmarks.verses.some(v => v.id === verseId);
  };

  const handleBookmarkToggle = (surah, verse) => {
    const verseId = `${surah.number}-${verse.num}`;
    const item = {
      id: verseId,
      surahName: surah.englishName,
      surahNameAr: surah.name,
      surahId: surah.number,
      num: verse.num,
      ar: verse.ar,
      en: verse.en
    };

    const wasBookmarked = isVerseBookmarked(verseId);
    toggleBookmark('verses', item);

    if (!wasBookmarked) {
      confetti({
        particleCount: 15,
        spread: 40,
        colors: ['#d4af37', '#ffffff']
      });
    }
  };

  // Site-wide search filter
  const filteredSurahs = surahsList.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.englishName.toLowerCase().includes(q) ||
      s.name.includes(q) ||
      s.englishNameTranslation.toLowerCase().includes(q) ||
      s.number.toString().includes(q)
    );
  });

  return (
    <div className="quran-page container fade-in" style={{ minHeight: '80vh' }}>
      {!selectedSurah ? (
        // Directory grid (Loads all 114 Surahs dynamically!)
        <>
          <div style={styles.header}>
            <Book size={32} color="var(--text-gold)" style={styles.headerIcon} />
            <h1 style={styles.title}>{t('quranTitle')}</h1>
            <p style={styles.subtitle}>{t('quranSubtitle')} ({language === 'en' ? "Access all 114 Surahs" : "تصفح كافة السور الـ 114"})</p>
          </div>

          {isLoadingList ? (
            <div style={styles.loaderArea}>
              <Loader size={40} className="spin-pulse" color="var(--text-gold)" />
              <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>
                {language === 'en' ? "Loading Noble Quran Directory..." : "جاري تحميل فهرس القرآن الكريم..."}
              </p>
            </div>
          ) : (
            <div style={styles.surahGrid} className="grid-3">
              {filteredSurahs.length > 0 ? (
                filteredSurahs.map(s => (
                  <div 
                    key={s.number} 
                    className="glass-panel surah-card-hover" 
                    style={styles.surahCard}
                    onClick={() => handleSelectSurah(s)}
                  >
                    <div style={styles.surahNumber}>
                      <span>{s.number}</span>
                    </div>

                    <div style={styles.surahDetails}>
                      <h3 style={styles.surahName}>{s.englishName}</h3>
                      <span style={styles.surahMeaning}>{s.englishNameTranslation}</span>
                      <span style={styles.surahMeta}>
                        {s.revelationType === 'Meccan' ? (language === 'en' ? "Meccan" : "مكية") : (language === 'en' ? "Medinan" : "مدنية")} • {s.numberOfVerses} {language === 'en' ? "Verses" : "آيات"}
                      </span>
                    </div>

                    <div style={styles.surahArabicName} className="arabic-text">
                      {s.name}
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.noResults} className="glass-panel">
                  <span>{t('searchNoResults')}</span>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        // Surah Reader & Live API Streaming View
        <div style={styles.readerContainer}>
          <button onClick={() => setSelectedSurah(null)} style={styles.backBtn} className="btn-secondary">
            <ChevronLeft size={16} />
            <span>{language === 'en' ? "Back to Directory" : "العودة للمصحف"}</span>
          </button>

          {isLoadingSurah ? (
            <div style={styles.loaderArea}>
              <Loader size={40} className="spin-pulse" color="var(--text-gold)" />
              <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>
                {language === 'en' ? "Compiling verses from authentic API editions..." : "جاري جلب الآيات الشريفة من المصادر المعتمدة..."}
              </p>
            </div>
          ) : surahContent ? (
            <>
              {/* Surah Header Card */}
              <div style={styles.readerHeader} className="glass-panel">
                <div className="islamic-pattern"></div>
                <div style={styles.readerTitleWrapper}>
                  <h2 style={styles.readerTitle}>{surahContent.englishName}</h2>
                  <div style={styles.readerArabicTitle} className="arabic-text">{surahContent.name}</div>
                </div>
                
                <p style={styles.readerSub}>
                  {surahContent.englishNameTranslation} • {surahContent.revelationType === 'Meccan' ? (language === 'en' ? "Meccan" : "مكية") : (language === 'en' ? "Medinan" : "مدنية")} • {surahContent.numberOfVerses} {language === 'en' ? "Verses" : "آيات"}
                </p>

                {/* Premium Audio recitation bar */}
                <div style={styles.audioBar} className="glass-panel">
                  <audio 
                    ref={audioRef} 
                    src={getAudioUrl(surahContent.number)} 
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleAudioEnded}
                  />
                  
                  <button 
                    onClick={handlePlayToggle} 
                    style={styles.playBtn} 
                    className="btn-primary"
                    disabled={loadingAudio}
                  >
                    {loadingAudio ? (
                      <Loader size={18} className="spin-pulse" />
                    ) : isPlaying ? (
                      <Pause size={18} />
                    ) : (
                      <Play size={18} />
                    )}
                    <span>{isPlaying ? t('quranPause') : t('quranPlayAll')}</span>
                  </button>

                  <div style={styles.audioTimeline}>
                    <span style={styles.timeLabel}>{formatTime(currentTime)}</span>
                    <input 
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      style={styles.progressBar}
                    />
                    <span style={styles.timeLabel}>{formatTime(duration)}</span>
                  </div>

                  <div style={styles.reciterBadge}>
                    <Volume2 size={14} color="var(--text-gold)" />
                    <span style={styles.reciterText}>Mishary Alafasy</span>
                  </div>
                </div>
              </div>

              {/* Verses Feed */}
              <div style={styles.versesFeed}>
                {surahContent.verses.map(v => {
                  const verseId = `${surahContent.number}-${v.num}`;
                  const bookmarked = isVerseBookmarked(verseId);

                  return (
                    <div key={v.num} style={styles.verseCard} className="glass-panel">
                      <div style={styles.verseActionPanel}>
                        <div style={styles.verseLabel} className="glass-panel">
                          <Award size={12} color="var(--text-gold)" />
                          <span>{language === 'en' ? `Verse ${v.num}` : `الآية ${v.num}`}</span>
                        </div>

                        <button 
                          onClick={() => handleBookmarkToggle(surahContent, v)} 
                          style={{
                            ...styles.bookmarkBtn,
                            color: bookmarked ? 'var(--text-gold)' : 'var(--text-secondary)'
                          }}
                        >
                          {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                        </button>
                      </div>

                      <div style={styles.verseAr} className="arabic-text">
                        {v.ar} 
                        <span style={styles.verseNumberCircle}>﴿{v.num}﴾</span>
                      </div>

                      <div style={styles.verseEn}>
                        {v.en}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={styles.noResults} className="glass-panel">
              <span>{language === 'en' ? "Unable to load Surah contents." : "فشل تحميل محتوى السورة."}</span>
            </div>
          )}
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
  loaderArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    textAlign: 'center',
  },
  surahGrid: {
    marginTop: '20px',
  },
  surahCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '16px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },
  surahNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(212, 175, 55, 0.05)',
    border: '1px solid var(--border-gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px',
    flexShrink: 0,
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
  },
  surahDetails: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  surahName: {
    fontSize: '1.05rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  surahMeaning: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  surahMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  surahArabicName: {
    fontSize: '1.8rem',
    color: 'var(--text-gold)',
    marginLeft: 'auto',
  },
  readerContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  readerHeader: {
    position: 'relative',
    padding: '40px 30px',
    borderRadius: '24px',
    background: 'radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.08) 0%, var(--bg-secondary) 80%)',
    textAlign: 'center',
    overflow: 'hidden',
  },
  readerTitleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  readerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.2rem',
    color: 'var(--text-primary)',
  },
  readerArabicTitle: {
    fontSize: '2.5rem',
    color: 'var(--text-gold)',
  },
  readerSub: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginTop: '10px',
  },
  audioBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    background: 'rgba(15, 17, 26, 0.9)',
    marginTop: '24px',
    borderRadius: '14px',
    gap: '20px',
    flexWrap: 'wrap',
  },
  playBtn: {
    padding: '10px 20px',
    fontSize: '0.85rem',
  },
  audioTimeline: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexGrow: 1,
    minWidth: '200px',
  },
  timeLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    width: '35px',
  },
  progressBar: {
    width: '100%',
    accentColor: 'var(--gold-primary)',
    cursor: 'pointer',
    height: '4px',
  },
  reciterBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid var(--border-glass)',
  },
  reciterText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  versesFeed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '10px',
  },
  verseCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderRadius: '16px',
  },
  verseActionPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verseLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    fontSize: '0.75rem',
    borderRadius: '12px',
    color: 'var(--text-gold)',
    background: 'rgba(212, 175, 55, 0.04)',
    border: '1px solid var(--border-gold)',
  },
  bookmarkBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '50%',
    transition: 'var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseAr: {
    fontSize: '2rem',
    textAlign: 'right',
    color: 'var(--text-primary)',
    fontWeight: '700',
    lineHeight: '2.2',
    letterSpacing: '0.5px',
  },
  verseNumberCircle: {
    color: 'var(--text-gold)',
    fontFamily: 'sans-serif',
    fontSize: '1.25rem',
    marginLeft: '10px',
    display: 'inline-block',
  },
  verseEn: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.7',
    borderLeft: '2px solid var(--border-gold)',
    paddingLeft: '14px',
  },
  noResults: {
    gridColumn: '1 / -1',
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  }
};

if (typeof document !== 'undefined') {
  const quranStyle = document.createElement('style');
  quranStyle.innerHTML = `
    .surah-card-hover {
      transition: var(--transition-smooth);
    }
    .surah-card-hover:hover {
      transform: translateY(-3px);
      border-color: var(--border-gold-hover) !important;
    }
    .spin-pulse {
      animation: spin 1s infinite linear;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    [dir="rtl"] .quran-page [style*="surahNumber"] {
      margin-right: 0 !important;
      margin-left: 16px !important;
    }
    [dir="rtl"] .quran-page [style*="surahArabicName"] {
      margin-left: 0 !important;
      margin-right: auto !important;
    }
    [dir="rtl"] .quran-page [style*="verseEn"] {
      border-left: none !important;
      border-right: 2px solid var(--border-gold) !important;
      padding-left: 0 !important;
      padding-right: 14px !important;
      text-align: right !important;
    }
    [dir="rtl"] .quran-page [style*="verseAr"] {
      text-align: left !important;
    }
    [dir="rtl"] .quran-page [style*="backBtn"] {
      align-self: flex-end !important;
    }
    @media (max-width: 768px) {
      .quran-page [style*="readerHeader"] {
        padding: 30px 16px !important;
      }
      .quran-page [style*="audioBar"] {
        padding: 12px 16px !important;
        flex-direction: column !important;
        align-items: stretch !important;
      }
      .quran-page [style*="reciterBadge"] {
        align-self: center !important;
      }
      .quran-page [style*="verseAr"] {
        font-size: 1.6rem !important;
      }
    }
  `;
  document.head.appendChild(quranStyle);
}
