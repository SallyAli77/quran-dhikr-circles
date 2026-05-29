import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Book, Play, Pause, Bookmark, BookmarkCheck, Search, Volume2, Award, ChevronLeft, ArrowRight, Loader, Compass, Mic, Square, Save } from 'lucide-react';
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

// static mapping of Juz' to Surah numbers
const juzSurahs = {
  1: [1, 2],
  2: [2],
  3: [2, 3],
  4: [3, 4],
  5: [4],
  6: [4, 5],
  7: [5, 6],
  8: [6, 7],
  9: [7, 8],
  10: [8, 9],
  11: [9, 10, 11],
  12: [11, 12],
  13: [12, 13, 14],
  14: [15, 16],
  15: [17, 18],
  16: [18, 19, 20],
  17: [21, 22],
  18: [23, 24, 25],
  19: [25, 26, 27],
  20: [27, 28, 29],
  21: [29, 30, 31, 32, 33],
  22: [33, 34, 35, 36],
  23: [36, 37, 38, 39],
  24: [39, 40, 41],
  25: [41, 42, 43, 44, 45],
  26: [46, 47, 48, 49, 50, 51],
  27: [51, 52, 53, 54, 55, 56, 57],
  28: [58, 59, 60, 61, 62, 63, 64, 65, 66],
  29: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77],
  30: Array.from({length: 37}, (_, i) => 78 + i) // 78 to 114
};

export default function Quran({ setActivePage }) {
  const { language, searchQuery, bookmarks, toggleBookmark, addTasmeeSubmission, t } = useApp();
  
  // Custom Quran page flow state variables
  const [quranMode, setQuranMode] = useState(null); // 'recitation', 'listening', or null
  const [selectedJuz, setSelectedJuz] = useState("");
  const [ayahFrom, setAyahFrom] = useState("");
  const [ayahTo, setAyahTo] = useState("");
  
  const [recitationJuz, setRecitationJuz] = useState(null);
  const [recitationAyahFrom, setRecitationAyahFrom] = useState(null);
  const [recitationAyahTo, setRecitationAyahTo] = useState(null);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const [surahsList, setSurahsList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState(false);
  const [surahContent, setSurahContent] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [tasmeeBlob, setTasmeeBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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

  // Tasmee Recorder Logic
  const startTasmeeRecording = async () => {
    try {
      setTasmeeBlob(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setTasmeeBlob(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert(language === 'en' ? "Microphone access is required for Tasmee." : "يلزم الوصول إلى الميكروفون للتسميع.");
    }
  };

  const stopTasmeeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSaveTasmee = () => {
    if (tasmeeBlob && selectedSurah) {
      const reader = new FileReader();
      reader.readAsDataURL(tasmeeBlob);
      reader.onloadend = () => {
        addTasmeeSubmission({
          surahName: selectedSurah.englishName,
          surahNameAr: selectedSurah.name,
          surahId: selectedSurah.number,
          juz: recitationJuz || 30,
          ayahFrom: recitationAyahFrom || 1,
          ayahTo: recitationAyahTo || selectedSurah.numberOfVerses,
          audioData: reader.result
        });
        setTasmeeBlob(null);
        confetti({
          particleCount: 80,
          spread: 80,
          colors: ['#d4af37', '#ffffff', '#c5a059']
        });
        setShowSuccessModal(true);
      };
    }
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
      
      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div style={styles.modalOverlay} className="fade-in">
          <div style={styles.modalCard} className="glass-panel text-center">
            <div style={styles.modalIconContainer}>
              <Award size={48} color="var(--text-gold)" className="spin-pulse" />
            </div>
            
            <h2 style={styles.modalTitle} className="gold-gradient-text">
              {language === 'ar' ? "✨ تم رفع التلاوة بنجاح! ✨" : "✨ Recitation Uploaded Successfully! ✨"}
            </h2>
            
            <p style={styles.modalText}>
              {language === 'ar' 
                ? "لقد تم رفع تلاوتك العذبة بنجاح إلى صفحة المعلمين للتقييم، وتم حفظها في صفحة التسميع الخاصة بك لتتمكن من مراجعتها." 
                : "Your recitation has been successfully uploaded to the teachers' page for evaluation, and saved to your personal Tasmee' page for review."}
            </p>
            
            <div style={styles.modalDetails} className="glass-panel">
              <span style={{color: 'var(--text-gold)', fontWeight: 'bold'}}>
                {language === 'ar' ? "تفاصيل التلاوة:" : "Recitation Details:"}
              </span>
              <div style={{marginTop: '6px', fontSize: '0.95rem'}}>
                سورة {selectedSurah?.name} ({selectedSurah?.englishName})
              </div>
              <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px'}}>
                {language === 'ar' ? `الجزء ${recitationJuz} • الآيات من ${recitationAyahFrom} إلى ${recitationAyahTo}` : `Juz' ${recitationJuz} • Verses ${recitationAyahFrom} to ${recitationAyahTo}`}
              </div>
            </div>

            <div style={styles.modalActionRow}>
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  setSelectedSurah(null);
                  setQuranMode(null);
                }} 
                className="btn-secondary"
                style={{flex: 1, padding: '12px'}}
              >
                {language === 'ar' ? "العودة للمصحف" : "Back to Quran"}
              </button>
              
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  setSelectedSurah(null);
                  setQuranMode(null);
                  setActivePage('login'); // Redirect to dashboard
                }} 
                className="btn-primary"
                style={{flex: 1, padding: '12px'}}
              >
                {language === 'ar' ? "الذهاب للوحة التحكم" : "Go to Dashboard"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasmee' Options Pop-up Overlay Modal */}
      {showOptionsModal && (
        <div style={styles.modalOverlay} className="fade-in">
          <div style={{...styles.modalCard, maxWidth: '600px', background: 'rgba(15, 17, 26, 0.98)'}} className="glass-panel text-center">
            <div style={styles.formHeader}>
              <Mic size={32} color="var(--text-gold)" style={styles.headerIcon} />
              <h2 style={styles.formTitle}>{language === 'ar' ? "إعداد جلسة التسميع الخاصة بك" : "Set Up Your Recitation Session"}</h2>
              <p style={styles.formSubtitle}>
                {language === 'ar' 
                  ? "اختر الجزء والسورة ونطاق الآيات لبدء التسجيل الفاخر" 
                  : "Select the Juz', Surah, and optional verse range to start recording"}
              </p>
            </div>

            <div style={{...styles.formBody, textAlign: language === 'ar' ? 'right' : 'left'}}>
              {/* Step 1: Select Juz' */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>{language === 'ar' ? "1. اختر الجزء الشريف" : "1. Select Noble Juz'"}</label>
                <select 
                  value={selectedJuz} 
                  onChange={(e) => {
                    setSelectedJuz(e.target.value);
                    setSelectedSurah(null); // reset surah selection if juz changes
                    setAyahFrom("");
                    setAyahTo("");
                  }} 
                  style={styles.formSelect}
                >
                  <option value="" style={{ backgroundColor: '#0f111a', color: '#f5f6f8' }}>{language === 'ar' ? "-- اختر الجزء --" : "-- Select Juz' --"}</option>
                  {Array.from({length: 30}, (_, i) => i + 1).map(j => (
                    <option key={j} value={j} style={{ backgroundColor: '#0f111a', color: '#f5f6f8' }}>{language === 'ar' ? `الجزء ${j}` : `Juz' ${j}`}</option>
                  ))}
                </select>
              </div>

              {/* Step 2: Select Surah (filtered by Juz') */}
              {selectedJuz && (
                <div style={styles.formGroup} className="fade-in">
                  <label style={styles.formLabel}>{language === 'ar' ? "2. اختر السورة الكريمة" : "2. Select Holy Surah"}</label>
                  <select 
                    value={selectedSurah ? selectedSurah.number : ""} 
                    onChange={(e) => {
                      const surahId = parseInt(e.target.value, 10);
                      const surah = surahsList.find(s => s.number === surahId);
                      if (surah) {
                        setSelectedSurah(surah);
                        setAyahFrom("");
                        setAyahTo("");
                      }
                    }} 
                    style={styles.formSelect}
                  >
                    <option value="" style={{ backgroundColor: '#0f111a', color: '#f5f6f8' }}>{language === 'ar' ? "-- اختر السورة --" : "-- Select Surah --"}</option>
                    {surahsList
                      .filter(s => juzSurahs[selectedJuz]?.includes(s.number))
                      .map(s => (
                        <option key={s.number} value={s.number} style={{ backgroundColor: '#0f111a', color: '#f5f6f8' }}>
                          {s.number}. {s.englishName} ({s.name})
                        </option>
                      ))
                    }
                  </select>
                </div>
              )}

              {/* Step 3: Optional Ayah Range selection */}
              {selectedSurah && (
                <div style={styles.ayahRangeRow} className="grid-2 fade-in">
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>{language === 'ar' ? "من الآية" : "From Ayah"}</label>
                    <select 
                      value={ayahFrom} 
                      onChange={(e) => {
                        setAyahFrom(e.target.value);
                        if (ayahTo && parseInt(e.target.value, 10) > parseInt(ayahTo, 10)) {
                          setAyahTo("");
                        }
                      }} 
                      style={styles.formSelect}
                    >
                      <option value="" style={{ backgroundColor: '#0f111a', color: '#f5f6f8' }}>1</option>
                      {Array.from({length: selectedSurah.numberOfVerses}, (_, i) => i + 1).map(a => (
                        <option key={a} value={a} style={{ backgroundColor: '#0f111a', color: '#f5f6f8' }}>{a}</option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>{language === 'ar' ? "إلى الآية" : "To Ayah"}</label>
                    <select 
                      value={ayahTo} 
                      onChange={(e) => setAyahTo(e.target.value)} 
                      style={styles.formSelect}
                      disabled={!ayahFrom}
                    >
                      <option value="" style={{ backgroundColor: '#0f111a', color: '#f5f6f8' }}>{selectedSurah.numberOfVerses}</option>
                      {Array.from({length: selectedSurah.numberOfVerses}, (_, i) => i + 1)
                        .filter(a => !ayahFrom || a >= parseInt(ayahFrom, 10))
                        .map(a => (
                          <option key={a} value={a} style={{ backgroundColor: '#0f111a', color: '#f5f6f8' }}>{a}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.modalActionRow}>
              <button 
                onClick={() => {
                  setShowOptionsModal(false);
                  setSelectedSurah(null);
                  setSelectedJuz("");
                  setAyahFrom("");
                  setAyahTo("");
                }} 
                className="btn-secondary"
                style={{flex: 1, padding: '12px'}}
              >
                {language === 'ar' ? "إلغاء" : "Cancel"}
              </button>
              
              <button 
                onClick={() => {
                  if (selectedSurah) {
                    setRecitationJuz(selectedJuz);
                    setRecitationAyahFrom(ayahFrom ? parseInt(ayahFrom, 10) : 1);
                    setRecitationAyahTo(ayahTo ? parseInt(ayahTo, 10) : selectedSurah.numberOfVerses);
                    handleSelectSurah(selectedSurah);
                    setQuranMode('recitation');
                    setShowOptionsModal(false);
                  }
                }} 
                className="btn-primary"
                style={{flex: 1, padding: '12px'}}
                disabled={!selectedSurah}
              >
                {language === 'ar' ? "ابدأ التسميع والتسجيل" : "Start Recitation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content based on quranMode and selectedSurah */}
      {quranMode === null ? (
        // Land Choice Screen
        <div style={styles.choiceContainer}>
          <div style={styles.choiceHeader}>
            <Book size={40} color="var(--text-gold)" style={styles.headerIcon} />
            <h1 style={styles.choiceTitle}>{language === 'ar' ? "خدمات القرآن الكريم الفاخرة" : "Noble Quran Premium Services"}</h1>
            <p style={styles.choiceSubtitle}>
              {language === 'ar' 
                ? "اختر طريقتك للتفاعل مع كتاب الله عز وجل اليوم" 
                : "Select your preferred way to interact with the Holy Quran today"}
            </p>
          </div>

          <div style={styles.choiceGrid}>
            {/* Recitation Card (تسميع) */}
            <div 
              className="glass-panel choice-card-hover" 
              style={styles.choiceCard}
              onClick={() => setShowOptionsModal(true)}
            >
              <div style={{...styles.choiceCardIcon, background: 'rgba(255, 107, 107, 0.1)', border: '1px solid rgba(255, 107, 107, 0.3)'}}>
                <Mic size={32} color="#ff6b6b" />
              </div>
              <h2 style={styles.choiceCardTitle}>{language === 'ar' ? "تسميع القرآن الكريم" : "Quranic Recitation (Tasmee')"}</h2>
              <p style={styles.choiceCardDesc}>
                {language === 'ar' 
                  ? "سجل تلاوتك العذبة من الجزء والسور المختارة، وأرسلها للمعلمين والقرّاء المعتمدين لتصحيح تلاوتك والحصول على تقييم وتوجيه دقيق." 
                  : "Record your beautiful voice for selected Juz' and Surahs, send it to certified teachers for evaluation, and get detailed correction audio feedback."}
              </p>
              <span style={styles.choiceCardBadge} className="gold-gradient-text">
                {language === 'ar' ? "تسميع وتصحيح ✧" : "Recitation & Feedback ✧"}
              </span>
            </div>

            {/* Listening Card (تلاوة) */}
            <div 
              className="glass-panel choice-card-hover" 
              style={styles.choiceCard}
              onClick={() => setQuranMode('listening')}
            >
              <div style={{...styles.choiceCardIcon, background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--border-gold)'}}>
                <Volume2 size={32} color="var(--text-gold)" />
              </div>
              <h2 style={styles.choiceCardTitle}>{language === 'ar' ? "تلاوة القرآن الكريم" : "Quranic Tilawah & Listening"}</h2>
              <p style={styles.choiceCardDesc}>
                {language === 'ar' 
                  ? "تصفح كافة السور الـ 114 بالرسم العثماني الفاخر مع تراجم شريفة متعددة، واستمع لتلاوة عطرة بأصوات مشاهير القرّاء بجودة عالية." 
                  : "Browse all 114 Surahs with premium Uthmani scripts and multi-language translations, and listen to high-quality recitations by famous reciters."}
              </p>
              <span style={{...styles.choiceCardBadge, color: 'var(--text-secondary)'}}>
                {language === 'ar' ? "تلاوة وقراءة ✧" : "Tilawah & Listening ✧"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        // Render either Quran Directory grid (Istima') OR the Reader page (both Istima' and active Reciting)
        <>
          {!selectedSurah ? (
            // Directory grid (Loads all 114 Surahs dynamically!)
            <>
              <button onClick={() => setQuranMode(null)} style={styles.backBtn} className="btn-secondary">
                <ChevronLeft size={16} />
                <span>{language === 'ar' ? "العودة للخيارات" : "Back to Services"}</span>
              </button>

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
                        onClick={() => {
                          setRecitationJuz(null);
                          setRecitationAyahFrom(null);
                          setRecitationAyahTo(null);
                          handleSelectSurah(s);
                        }}
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
              <button 
                onClick={() => {
                  setSelectedSurah(null);
                  if (quranMode === 'recitation') {
                    // reset recitation parameters
                    setSelectedJuz("");
                    setAyahFrom("");
                    setAyahTo("");
                  }
                }} 
                style={styles.backBtn} 
                className="btn-secondary"
              >
                <ChevronLeft size={16} />
                <span>{quranMode === 'recitation' ? (language === 'ar' ? "العودة لإعداد التسميع" : "Back to Recitation Setup") : (language === 'en' ? "Back to Directory" : "العودة للمصحف")}</span>
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
                      {quranMode === 'recitation' && recitationJuz && ` • ${language === 'ar' ? "الجزء" : "Juz'"} ${recitationJuz}`}
                    </p>

                    {/* For Recitation mode, show recitation details if loaded */}
                    {quranMode === 'recitation' && (
                      <div style={styles.recitationBanner} className="glass-panel">
                        <Mic size={14} color="#ff6b6b" />
                        <span>
                          {language === 'ar' 
                            ? `أنت في وضع التسميع للآيات من ${recitationAyahFrom} إلى ${recitationAyahTo}` 
                            : `You are in Recitation mode for verses ${recitationAyahFrom} to ${recitationAyahTo}`}
                        </span>
                      </div>
                    )}

                    {/* Listening Mode Premium Audio recitation bar (ONLY show if NOT in Recitation mode) */}
                    {quranMode === 'listening' && (
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
                    )}

                    {/* Recitation Mode Audio Recorder Section (ONLY show if in Recitation mode) */}
                    {quranMode === 'recitation' && (
                      <div style={{...styles.audioBar, marginTop: '16px', background: isRecording ? 'rgba(255, 107, 107, 0.1)' : 'rgba(212, 175, 55, 0.05)'}} className="glass-panel">
                        <div style={styles.reciterBadge}>
                          <Mic size={16} color={isRecording ? "#ff6b6b" : "var(--text-gold)"} className={isRecording ? "spin-pulse" : ""} />
                          <span style={styles.reciterText}>{language === 'en' ? "Tasmee' (Recitation Recorder)" : "تسميع (مسجل التلاوة)"}</span>
                        </div>
                        
                        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                          {!isRecording ? (
                            <button onClick={startTasmeeRecording} style={{...styles.playBtn, background: 'rgba(255,255,255,0.05)'}} className="btn-secondary">
                              <Mic size={14} color="#ff6b6b" />
                              <span>{language === 'en' ? "Record" : "تسجيل"}</span>
                            </button>
                          ) : (
                            <button onClick={stopTasmeeRecording} style={{...styles.playBtn, background: 'rgba(255, 107, 107, 0.2)', borderColor: '#ff6b6b'}} className="btn-secondary">
                              <Square size={14} color="#ff6b6b" />
                              <span>{language === 'en' ? "Stop" : "إيقاف"}</span>
                            </button>
                          )}
                          
                          {tasmeeBlob && !isRecording && (
                            <button onClick={handleSaveTasmee} style={styles.playBtn} className="btn-primary">
                              <Save size={14} />
                              <span>{language === 'ar' ? "نشر التلاوة للتصحيح" : "Post Recitation"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Verses Feed */}
                  <div style={styles.versesFeed}>
                    {surahContent.verses
                      .filter(v => {
                        if (quranMode !== 'recitation') return true;
                        const from = recitationAyahFrom || 1;
                        const to = recitationAyahTo || surahContent.numberOfVerses;
                        return v.num >= from && v.num <= to;
                      })
                      .map(v => {
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
        </>
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
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
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
    fontSize: '2.1rem',
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
  },
  // Recitation & Choices Screen Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 7, 12, 0.85)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalCard: {
    maxWidth: '480px',
    width: '90%',
    padding: '36px 30px',
    borderRadius: '24px',
    border: '1px solid var(--border-gold)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5), var(--shadow-gold-intense)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    position: 'relative',
    background: 'rgba(15, 17, 26, 0.95)',
  },
  modalIconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(255,255,255,0.02) 80%)',
    border: '2px solid var(--gold-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    boxShadow: 'var(--shadow-gold-intense)',
  },
  modalTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    textAlign: 'center',
  },
  modalText: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    textAlign: 'center',
  },
  modalDetails: {
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
    textAlign: 'center',
  },
  modalActionRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px',
  },
  choiceContainer: {
    padding: '40px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
  },
  choiceHeader: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  choiceTitle: {
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    fontSize: '2.4rem',
    color: 'var(--text-primary)',
    fontWeight: '700',
  },
  choiceSubtitle: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    marginTop: '8px',
  },
  choiceGrid: {
    display: 'flex',
    gap: '30px',
    width: '100%',
    maxWidth: '1000px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  choiceCard: {
    flex: '1 1 350px',
    maxWidth: '450px',
    padding: '40px 30px',
    borderRadius: '24px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  choiceCardIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  choiceCardTitle: {
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    fontSize: '1.4rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
    marginBottom: '12px',
  },
  choiceCardDesc: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '24px',
    flexGrow: 1,
  },
  choiceCardBadge: {
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  recitationFormContainer: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '40px 30px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '10px',
  },
  formTitle: {
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    fontSize: '1.6rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  formSubtitle: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    marginTop: '6px',
  },
  formBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  formSelect: {
    background: '#0f111a',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
  },
  ayahRangeRow: {
    gap: '16px',
  },
  startRecBtn: {
    marginTop: '10px',
    justifyContent: 'center',
    padding: '14px',
    fontSize: '0.95rem',
  },
  recitationBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '30px',
    background: 'rgba(255, 107, 107, 0.08)',
    border: '1px solid rgba(255, 107, 107, 0.2)',
    color: '#ff6b6b',
    fontSize: '0.85rem',
    fontWeight: '500',
    maxWidth: 'fit-content',
    margin: '16px auto 0 auto',
  },
};

if (typeof document !== 'undefined') {
  const quranStyle = document.createElement('style');
  quranStyle.innerHTML = `
    .quran-page select {
      background-color: #0f111a !important;
      color: #f5f6f8 !important;
    }
    .quran-page select option {
      background-color: #0f111a !important;
      color: #f5f6f8 !important;
      font-size: 0.9rem;
      padding: 12px;
    }
    .surah-card-hover {
      transition: var(--transition-smooth);
    }
    .surah-card-hover:hover {
      transform: translateY(-3px);
      border-color: var(--border-gold-hover) !important;
    }
    .choice-card-hover {
      transition: var(--transition-smooth);
    }
    .choice-card-hover:hover {
      transform: translateY(-5px);
      border-color: var(--border-gold-hover) !important;
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.08);
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
