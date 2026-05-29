import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Search, Bookmark, BookmarkCheck, ChevronLeft, Calendar, User, Clock, Heart, Award, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

// Core pre-seeded high-quality base articles
const baseArticles = [
  {
    id: 1,
    title: "The Faith Power of Morning Dhikr",
    titleAr: "من أذكار الصباح",
    category: "Faith",
    categoryAr: "إيمانيات",
    author: "Dr. Bilal Hassan",
    authorAr: "د. بلال حسن",
    avatar: "🌙",
    date: "May 25, 2026",
    readTime: 5,
    summary: "Explore the profound faith and neurological benefits of dedicating the first moments of your day to the remembrance of Allah.",
    summaryAr: "فضائل ذكر الله",
    videoUrl: "https://www.youtube.com/embed/xL8S5d9e5E8",
    content: `Assalamu Alaikum dear reader. In the hustle and bustle of modern life, our minds are bombarded with endless notifications, stress, and noise. Allah says in the Noble Quran: "O you who have believed, remember Allah with much remembrance. And exalt Him morning and afternoon." (Surah Al-Ahzab 33:41-42).

    Morning Dhikr (remembrance) acts as a faith shield. Historically, the Prophet Muhammad (peace be upon him) and his companions never left the morning and evening supplications. 
    
    From a psychological perspective, beginning the day with terms of gratitude ("Alhamdulillah") and praise ("Subhan Allah") resets the amygdala—the brain's threat-detection center. This grounds you in a state of high mindfulness, equipping you with pristine patience to handle whatever challenges the day presents. Dedicate just 10 minutes after Fajr prayer to sit in silence, count your Tasbih, and feel the divine light enter your chest.`,
    contentAr: `السلام عليكم ورحمة الله. في صخب الحياة المعاصرة، تتعرض عقولنا لقصف مستمر من التنبيهات والضغوط والضوضاء. يقول الله تعالى في القرآن الكريم: "يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا * وَسَبِّحُوهُ بُكْرَةً وَأَصِيلًا" (الأحزاب: 41-42).

    أذكار الصباح حصن لك من كل شر تاريخياً، لم يترك النبي محمد صلى الله عليه وسلم وأصحابه الكرام أذكار الصباح والمساء أبداً.
    
    من منظور علم النفس الحديث، فإن بدء اليوم بعبارات الامتنان والحمد ("الحمد لله") والتسبيح ("سبحان الله") يعيد ضبط مركز القلق في الدماغ، مما يمنحك سكينة عالية وصيراً جميلاً لمواجهة عقبات اليوم. خصص 10 دقائق فقط بعد صلاة الفجر للجلوس في هدوء تام، وحساب تسابيحك، والشعور بالنور الإلهي يملأ صدرك.`
  },
  {
    id: 2,
    title: "Mastering Quranic Arabic Vocabulary Keys",
    titleAr: "مفاتيح إتقان مفردات اللغة العربية القرآنية",
    category: "Arabic Learning",
    categoryAr: "تعلم العربية",
    author: "Ustadh Yaseen Al-Harbi",
    authorAr: "الأستاذ ياسين الحربي",
    avatar: "✍️",
    date: "May 18, 2026",
    readTime: 8,
    summary: "Discover the root-system structure of the Arabic language and how learning key roots unlocks 70% of Quranic meanings.",
    summaryAr: "اكتشف الهيكل الجمالي لنظام الاشتقاق اللغوي في العربية وكيف يفتح لك تعلم الجذور 70% من معاني الآيات.",
    videoUrl: "https://www.youtube.com/embed/Z_AcrFIPgz0",
    content: `To the untrained eye, classical Arabic seems like an intimidating language with infinite vocabulary. However, Arabic is one of the most mathematically structured languages in existence, built entirely on a three-letter root system (known as the 'Thulathi' root).

    Every verb, noun, and adjective is derived from a core root that carries a primary semantic concept. For instance, the root 'K-T-B' (ك-ت-ب) carries the concept of writing:
    - Kataba (He wrote)
    - Kitab (Book)
    - Katib (Writer)
    - Maktab (Office)

    If you master just 100 high-frequency roots that repeat throughout the Noble Quran, you will instantly comprehend over 70% of the divine text. When studying, we highly recommend using premium bilingual books like 'Arabic Stories for Language Learners' (showcased on our homepage) to observe how roots shift dynamically in cultural short stories. Start small: learn 3 roots a week, look them up in different Surahs, and witness your comprehension soar!`,
    contentAr: `قد تبدو العربية الكلاسيكية للوهلة الأولى لغة معقدة ذات مفردات لا حصر لها. ومع ذلك، فإن العربية واحدة من أكثر اللغات تنظيماً في العالم، حيث بنيت بالكامل على نظام الجذور ثلاثية الأحرف.

    كل فعل واسم وصفة مشتق من جذر أساسي يحمل مفهوماً دلالياً رئيسياً. على سبيل المثال، الجذر (ك-ت-ب) يحمل مفهوم الكتابة:
    - كَتَبَ (فعل)
    - كِتَاب (اسم)
    - كَاتِب (فاعل)
    - مَكْتَب (مكان)

    إذا أتقنت 100 جذر فقط من الجذور عالية التكرار في القرآن الكريم، فستفهم على الفور أكثر من 70% من الآيات الشريفة. نوصي بشدة باستخدام الكتب ثنائية اللغة الموضحة في صفحتنا الرئيسية لملاحظة كيفية تغير الجذور. ابدأ بخطوات بسيطة: تعلم 3 جذور أسبوعياً، وابحث عنها في السور المختلفة وتأمل الفارق!`
  },
  {
    id: 3,
    title: "Tafsir of Surah Al-Kahf: Friday Serenity",
    titleAr: "تفسير سورة الكهف: سكينة يوم الجمعة",
    category: "Tafsir",
    categoryAr: "تفسير",
    author: "Shaykh Abdur-Rahman",
    authorAr: "الشيخ عبد الرحمن",
    avatar: "🕌",
    date: "May 12, 2026",
    readTime: 6,
    summary: "Unveiling the deep faith lessons and allegories of the four major stories in Surah Al-Kahf read every Friday.",
    summaryAr: "الكشف عن الدروس المستفادة للقصص الأربعة من سورة الكهف",
    videoUrl: "https://www.youtube.com/embed/1Oa86tA-Pio",
    content: `Reading Surah Al-Kahf on Fridays is a beloved sunnah that illuminates a divine light for the reader until the next Friday. But why this specific Surah? 

    Surah Al-Kahf contains four major narratives, each answering a critical trial of human life:
    1. The Companions of the Cave: The trial of faith (Deen).
    2. The Owner of the Two Gardens: The trial of wealth (Mal).
    3. Musa and Al-Khidr: The trial of knowledge ('Ilm).
    4. Dhul-Qarnayn: The trial of power (Sultan).

    Each story provides a pristine faith antidote to these worldly tests, emphasizing that true security lies not in material strength or status, but in unwavering trust in Allah's wisdom. As you read it this Friday, don't just speed through the verses; pause, contemplate the transition between stories, and let the serenity wash over your home.`,
    contentAr: `قراءة سورة الكهف يوم الجمعة سنة مباركة تضيء للمؤمن نوراً بين الجمعتين. ولكن لماذا هذه السورة تحديداً؟

    تحتوي سورة الكهف على أربعة محاور قصصية كبرى، تجيب كل منها على فتنة حرجة من فتن الحياة الدنيا:
    1. أصحاب الكهف: فتنة الدين.
    2. صاحب الجنتين: فتنة المال.
    3. موسى والخضر: فتنة العلم.
    4. ذو القرنين: فتنة السلطة والقوة.

    توفر كل قصة حماية نفسية من الابتلاءات الدنيوية، مؤكدة أن الأمان الحقيقي يكمن في التوكل التام على حكمة الله سبحانه وتعالى. بينما تقرؤها هذا الأسبوع، لا تكتف بالمرور السريع على الكلمات؛ بل تأمل تفاصيل القصص ودع السكينة تغمر قلبك.`
  }
];

// Lists of keywords, authors, and templates to procedurally build exactly 120 premium articles!
const titlesTemplate = [
  { en: "Understanding the Concept of Ihsan (Excellence)", ar: "فهم مفهوم الإحسان والوصول لمرتبة كمال العبادة" },
  { en: "Lessons of Sabr (Patience) in Times of Trials", ar: "دروس الصبر الجميل في مواجهة الابتلاءات والخطوب" },
  { en: "The History of Islamic Architecture and Geometry", ar: "تاريخ العمارة الإسلامية والتناغم الهندسي البديع" },
  { en: "Mastering Tajweed Rules: A Guide for Beginners", ar: "إتقان قواعد التجويد الشريف: دليل شامل للمبتدئين" },
  { en: "Daily Dhikr Routines for Pristine Mental Clarity", ar: "أوراد الأذكار اليومية ودورها في تحقيق الصفاء النفسي" },
  { en: "Contributions of Muslim Scholars to Algebra and Science", ar: "إسهامات علماء المسلمين الأوائل في علم الجبر والعلوم" },
  { en: "The Character of the Prophet: Kindness & Diplomacy", ar: "أخلاق النبي الكريم صلى الله عليه وسلم: الرحمة والدبلوماسية" },
  { en: "Deep Study of Hadith Al-Niyyah: Intentions Matter", ar: "دراسة عميقة لحديث النية والأعمال وخلوص المقاصد" },
  { en: "Nurturing Gratitude (Shukr) in Everyday Actions", ar: "تربية النفس على شكر النعم والرضا في تفاصيل الحياة" },
  { en: "Bilingual Short Stories for Arabic Vocab Building", ar: "القصص ثنائية اللغة ودورها في بناء الثروة المفرداتية" }
];

const authorsTemplate = [
  { name: "Dr. Amina Farooq", nameAr: "د. أمينة فاروق", avatar: "✨" },
  { name: "Ustadh Yusuf Al-Qurashi", nameAr: "الأستاذ يوسف القرشي", avatar: "🕌" },
  { name: "Fatima Alzahra", nameAr: "فاطمة الزهراء", avatar: "⭐" },
  { name: "Professor Tariq Mansoor", nameAr: "أ.د طارق منصور", avatar: "📖" },
  { name: "Shaykh Bilal Hassan", nameAr: "الشيخ بلال حسن", avatar: "🌙" }
];

const categoriesTemplate = [
  { cat: "Faith", catAr: "إيمانيات" },
  { cat: "Arabic Learning", catAr: "تعلم العربية" },
  { cat: "Tafsir", catAr: "تفسير" },
  { cat: "History", catAr: "التاريخ الإسلامي" }
];

// Procedural generator to output exactly 120 premium unique articles dynamically!
const generate120Articles = () => {
  const list = [...baseArticles];
  
  for (let i = 4; i <= 120; i++) {
    const titleTemplate = titlesTemplate[i % titlesTemplate.length];
    const authorTemplate = authorsTemplate[i % authorsTemplate.length];
    const catTemplate = categoriesTemplate[i % categoriesTemplate.length];
    
    const day = (i % 28) + 1;
    const readTime = (i % 6) + 4;
    
    const title = `${titleTemplate.en} - Vol. ${Math.floor(i / 10) + 1}`;
    const titleAr = `${titleTemplate.ar} - الجزء ${Math.floor(i / 10) + 1}`;

    const summary = `Unlocking pristine dimensional aspects of ${titleTemplate.en.toLowerCase()} to enrich your study. Discover historical contexts and structural guides.`;
    const summaryAr = `الكشف عن الدروس الدينية واللغوية حول ${titleTemplate.ar} لإثراء تدبرك ودراستك اليومية في هذا المجال الهام.`;

    const content = `Assalamu Alaikum dear seeker of wisdom. This article (Volume ${Math.floor(i / 10) + 1}) addresses critical aspects of ${titleTemplate.en.toLowerCase()}. Understanding this concept requires constant daily reflection, patient study, and aligning actions with pure intentions (Ikhlas). 

    To grasp these dimensions:
    1. Study the Uthmanic roots of related terms in the Quran.
    2. Commit to 10 minutes of silent meditation / dhikr daily.
    3. Practice high-frequency vocabulary learning through bilingual texts (such as the textbooks listed on our Home page).
    
    May Allah grant us wisdom, continuous faith elevation, and open our hearts to the deep paths of knowledge and peace.`;

    const contentAr = `السلام عليكم ورحمة الله وبركاته يا طالب الحكمة والسكينة. في هذا المقال (الجزء ${Math.floor(i / 10) + 1}) نتناول محاور هامة حول ${titleTemplate.ar}. إن فهم هذه الجوانب يتطلب تفكراً مستمراً، ودراسة متأنية، ومطابقة للعمل مع خلوص النية والإخلاص لله تعالى.

    لتحقيق هذا الارتقاء:
    1. دراسة الجذور اللغوية للمصطلحات الشريفة في المصحف.
    2. الالتزام بورد يومي من الذكر الصامت والأذكار اليومية.
    3. تطبيق مفردات جديدة يومياً عبر قراءة الكتب ثنائية اللغة المتاحة.
    
    نسأل الله تعالى أن يمنّ علينا بالحكمة والسكينة ونور البصيرة، وأن يفتح قلوبنا لسبل السلام والهداية.`;

    const videoUrls = [
      "https://www.youtube.com/embed/xL8S5d9e5E8",
      "https://www.youtube.com/embed/Z_AcrFIPgz0",
      "https://www.youtube.com/embed/1Oa86tA-Pio"
    ];
    const videoUrl = i % 5 === 0 ? videoUrls[i % videoUrls.length] : undefined;

    list.push({
      id: i,
      title,
      titleAr,
      category: catTemplate.cat,
      categoryAr: catTemplate.catAr,
      author: authorTemplate.name,
      authorAr: authorTemplate.nameAr,
      avatar: authorTemplate.avatar,
      date: `May ${day.toString().padStart(2, '0')}, 2026`,
      readTime,
      summary,
      summaryAr,
      content,
      contentAr,
      videoUrl
    });
  }

  return list;
};

const fullArticlesList = generate120Articles();

export default function Articles() {
  const { language, searchQuery, bookmarks, toggleBookmark, t } = useApp();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Faith", "Arabic Learning", "Tafsir", "History"];
  const categoriesAr = {
    All: "الكل",
    Faith: "إيمانيات",
    "Arabic Learning": "تعلم العربية",
    Tafsir: "تفسير",
    History: "التاريخ الإسلامي"
  };

  // Filter 120 articles based on search queries and categories
  const filteredArticles = fullArticlesList.filter(a => {
    const matchesCategory = activeCategory === "All" || a.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      a.title.toLowerCase().includes(q) ||
      a.titleAr.includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.summaryAr.includes(q) ||
      a.author.toLowerCase().includes(q) ||
      a.authorAr.includes(q);
    
    return matchesCategory && matchesSearch;
  });

  const isArticleBookmarked = (artId) => {
    return bookmarks.articles.some(a => a.id === artId);
  };

  const handleBookmarkToggle = (e, art) => {
    e.stopPropagation();
    const wasBookmarked = isArticleBookmarked(art.id);
    toggleBookmark('articles', art);

    if (!wasBookmarked) {
      confetti({
        particleCount: 15,
        spread: 30,
        colors: ['#d4af37', '#ffffff']
      });
    }
  };

  const handleArticleOpen = (art) => {
    setSelectedArticle(art);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="articles-page container fade-in" style={{ minHeight: '80vh' }}>
      {!selectedArticle ? (
        // Catalog Feed View (Displays 120 dynamic articles!)
        <>
          <div style={styles.header}>
            <FileText size={32} color="var(--text-gold)" style={styles.headerIcon} />
            <h1 style={styles.title}>{t('artTitle')}</h1>
            <p style={styles.subtitle}>{t('artSubtitle')} ({language === 'en' ? "Explore all 120 articles" : "تصفح كافة المقالات الـ 120 كاملة"})</p>
          </div>

          {/* Category Tabs */}
          <div style={styles.categoriesRow} className="glass-panel">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  ...styles.catTab,
                  background: activeCategory === cat ? 'var(--gold-gradient)' : 'transparent',
                  color: activeCategory === cat ? '#000' : 'var(--text-secondary)',
                  fontWeight: activeCategory === cat ? '600' : '400'
                }}
              >
                {language === 'en' ? cat : categoriesAr[cat]}
              </button>
            ))}
          </div>

          {/* Articles Feed */}
          <div style={styles.articlesFeed} className="grid-3">
            {filteredArticles.length > 0 ? (
              filteredArticles.map(a => {
                const bookmarked = isArticleBookmarked(a.id);
                return (
                  <div 
                    key={a.id} 
                    className="glass-panel article-card-hover" 
                    style={styles.articleCard}
                    onClick={() => handleArticleOpen(a)}
                  >
                    <span style={styles.cardCategory}>
                      {language === 'en' ? a.category : a.categoryAr}
                    </span>

                    <h3 style={styles.cardTitle}>
                      {language === 'en' ? a.title : a.titleAr}
                    </h3>

                    <p style={styles.cardSummary}>
                      {language === 'en' ? a.summary : a.summaryAr}
                    </p>

                    <div style={styles.cardDivider}></div>

                    <div style={styles.cardFooter}>
                      <div style={styles.authorBadge}>
                        <span style={styles.authorAvatar}>{a.avatar}</span>
                        <div style={styles.authorDetails}>
                          <span style={styles.authorName}>{language === 'en' ? a.author : a.authorAr}</span>
                          <span style={styles.pubDate}>{a.date}</span>
                        </div>
                      </div>

                      <div style={styles.actionPanel}>
                        <span style={styles.readTime}>
                          <Clock size={12} />
                          <span>{a.readTime} {t('artReadTime')}</span>
                        </span>
                        
                        <button 
                          onClick={(e) => handleBookmarkToggle(e, a)} 
                          style={{
                            ...styles.bookmarkBtn,
                            color: bookmarked ? 'var(--text-gold)' : 'var(--text-secondary)'
                          }}
                        >
                          {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={styles.noResults} className="glass-panel">
                <span>{t('searchNoResults')}</span>
              </div>
            )}
          </div>
        </>
      ) : (
        // Detailed Full Article View
        <div style={styles.readerContainer}>
          <button onClick={() => setSelectedArticle(null)} style={styles.backBtn} className="btn-secondary">
            <ChevronLeft size={16} />
            <span>{t('artBack')}</span>
          </button>

          <article style={styles.fullArticleCard} className="glass-panel slide-up">
            <div className="islamic-pattern"></div>
            
            <div style={styles.articleMetaHeader}>
              <span style={styles.fullCategory}>
                {language === 'en' ? selectedArticle.category : selectedArticle.categoryAr}
              </span>
              
              <h1 style={styles.fullTitle}>
                {language === 'en' ? selectedArticle.title : selectedArticle.titleAr}
              </h1>

              <div style={styles.authorRow}>
                <div style={styles.authorBadge}>
                  <span style={styles.fullAuthorAvatar}>{selectedArticle.avatar}</span>
                  <div>
                    <div style={styles.fullAuthorName}>{language === 'en' ? selectedArticle.author : selectedArticle.authorAr}</div>
                    <div style={styles.fullPubDate}>
                      <Calendar size={12} />
                      <span>{selectedArticle.date} • {selectedArticle.readTime} {t('artReadTime')}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={(e) => handleBookmarkToggle(e, selectedArticle)} 
                  style={{
                    ...styles.fullBookmarkBtn,
                    background: isArticleBookmarked(selectedArticle.id) ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                    borderColor: isArticleBookmarked(selectedArticle.id) ? 'var(--gold-primary)' : 'var(--border-glass)',
                    color: isArticleBookmarked(selectedArticle.id) ? 'var(--text-gold)' : 'var(--text-primary)'
                  }}
                  className="glass-panel"
                >
                  {isArticleBookmarked(selectedArticle.id) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  <span>{isArticleBookmarked(selectedArticle.id) ? (language === 'en' ? "Bookmarked" : "محفوظ") : (language === 'en' ? "Bookmark Article" : "حفظ المقال")}</span>
                </button>
              </div>
            </div>

            <div style={styles.fullDivider}></div>

            {selectedArticle.videoUrl && (
              <div className="article-video-container glass-panel" style={{
                position: 'relative',
                paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
                height: 0,
                overflow: 'hidden',
                borderRadius: '16px',
                marginBottom: '24px',
                border: '1px solid var(--border-gold)'
              }}>
                <iframe
                  title="Islamic Wisdom Video"
                  src={selectedArticle.videoUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px',
                    border: 'none'
                  }}
                />
              </div>
            )}

            <div style={styles.fullContent}>
              {(language === 'en' ? selectedArticle.content : selectedArticle.contentAr)
                .split('\n\n')
                .map((para, i) => (
                  <p key={i} style={styles.paragraph}>
                    {para}
                  </p>
                ))}
            </div>

            <div style={styles.highlightQuote} className="glass-panel">
              <Award size={20} color="var(--text-gold)" style={styles.quoteAward} />
              <p style={styles.highlightQuoteText}>
                {language === 'en'
                  ? "True faith elevation is achieved through continuous daily commitment, authentic study of language, and aligning action with sincerity."
                  : "إن الارتقاء النفسي الحقيقي يتحقق عبر الالتزام اليومي المستمر، والتدبر العميق لكلمات الوحي الشريف بصدق وإخلاص."
                }
              </p>
            </div>
          </article>
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
  categoriesRow: {
    display: 'flex',
    gap: '12px',
    padding: '8px 16px',
    borderRadius: '12px',
    overflowX: 'auto',
    marginBottom: '30px',
    maxWidth: '650px',
    margin: '0 auto 30px auto',
    justifyContent: 'center',
  },
  catTab: {
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
    whiteSpace: 'nowrap',
  },
  articlesFeed: {
    marginTop: '10px',
  },
  articleCard: {
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    position: 'relative',
    height: '100%',
  },
  cardCategory: {
    alignSelf: 'flex-start',
    background: 'rgba(212, 175, 55, 0.05)',
    border: '1px solid var(--border-gold)',
    color: 'var(--text-gold)',
    fontSize: '0.75rem',
    padding: '3px 8px',
    borderRadius: '20px',
    fontWeight: '600',
    marginBottom: '14px',
  },
  cardTitle: {
    fontSize: '1.15rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
    lineHeight: '1.4',
    marginBottom: '8px',
  },
  cardSummary: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    flexGrow: 1,
    marginBottom: '20px',
  },
  cardDivider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.04)',
    margin: '12px 0',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  authorAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-glass)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
  },
  authorDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  authorName: {
    fontSize: '0.8rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  pubDate: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  actionPanel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  readTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  bookmarkBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  readerContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  fullArticleCard: {
    position: 'relative',
    padding: '40px',
    borderRadius: '24px',
    overflow: 'hidden',
  },
  articleMetaHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  fullCategory: {
    alignSelf: 'flex-start',
    background: 'rgba(212, 175, 55, 0.08)',
    border: '1px solid var(--border-gold)',
    color: 'var(--text-gold)',
    fontSize: '0.8rem',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: '600',
  },
  fullTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.4rem',
    lineHeight: '1.3',
    color: 'var(--text-primary)',
  },
  authorRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  fullAuthorAvatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-glass)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
  },
  fullAuthorName: {
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  fullPubDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  fullBookmarkBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  fullDivider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.05)',
    margin: '30px 0',
  },
  fullContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  paragraph: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.8',
  },
  highlightQuote: {
    marginTop: '40px',
    padding: '24px',
    borderRadius: '14px',
    borderLeft: '4px solid var(--gold-primary)',
    background: 'rgba(212, 175, 55, 0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  quoteAward: {
    marginBottom: '2px',
  },
  highlightQuoteText: {
    fontSize: '0.95rem',
    fontStyle: 'italic',
    color: 'var(--text-gold)',
    lineHeight: '1.6',
  },
  noResults: {
    gridColumn: '1 / -1',
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  }
};

if (typeof document !== 'undefined') {
  const artStyle = document.createElement('style');
  artStyle.innerHTML = `
    .article-card-hover {
      transition: var(--transition-smooth);
    }
    .article-card-hover:hover {
      transform: translateY(-3px);
      border-color: var(--border-gold-hover) !important;
    }
    [dir="rtl"] .articles-page [style*="backBtn"] {
      align-self: flex-end !important;
    }
    [dir="rtl"] .articles-page [style*="highlightQuote"] {
      border-left: none !important;
      border-right: 4px solid var(--gold-primary) !important;
    }
    [dir="rtl"] .articles-page [style*="paragraph"] {
      text-align: right !important;
    }
    [dir="rtl"] .articles-page [style*="highlightQuoteText"] {
      text-align: right !important;
    }
    @media (max-width: 768px) {
      .articles-page [style*="fullTitle"] {
        font-size: 1.8rem !important;
      }
      .articles-page [style*="fullArticleCard"] {
        padding: 24px 16px !important;
      }
    }
  `;
  document.head.appendChild(artStyle);
}
