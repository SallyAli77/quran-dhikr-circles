import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, Search, Bookmark, BookmarkCheck, ChevronLeft, Calendar, User, 
  Clock, Heart, Award, ArrowRight, AlertCircle, ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Articles() {
  const { 
    articlesList: fullArticlesList = [], 
    language, 
    searchQuery, 
    bookmarks, 
    toggleBookmark, 
    t,
    newsList = [] 
  } = useApp();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("articles"); // 'articles' or 'news'

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
  mainTabsContainer: {
    display: 'flex',
    gap: '12px',
    padding: '6px',
    borderRadius: '14px',
    marginBottom: '30px',
    maxWidth: '500px',
    margin: '0 auto 30px auto',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.01)',
  },
  mainTabBtn: {
    flex: 1,
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  articlesFeed: {
    marginTop: '10px',
  },
  newsFeed: {
    marginTop: '10px',
  },
  newsCard: {
    padding: '28px',
    borderRadius: '18px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    gap: '14px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-glass)',
    height: '100%',
    textAlign: 'start',
  },
  newsCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    color: 'var(--text-gold)',
    background: 'rgba(212, 175, 55, 0.05)',
    padding: '4px 10px',
    borderRadius: '20px',
    fontWeight: '600',
    border: '1px solid var(--border-gold)',
  },
  breakingBadge: {
    fontSize: '0.7rem',
    color: '#ff4d4d',
    background: 'rgba(255, 77, 77, 0.1)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: '700',
    textTransform: 'uppercase',
    border: '1px solid rgba(255, 77, 77, 0.3)',
  },
  newsCardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    lineHeight: '1.45',
  },
  newsCardText: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.65',
    flexGrow: 1,
  },
  newsCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
    fontSize: '0.8rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
    paddingTop: '14px',
  },
  newsSource: {
    color: 'var(--text-muted)',
  },
  newsActions: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
  },
  newsReactText: {
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
  },
  newsLinkIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    border: '1px solid var(--border-glass)',
    transition: 'var(--transition-smooth)',
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
    .article-card-hover, .news-card-hover {
      transition: var(--transition-smooth);
    }
    .article-card-hover:hover, .news-card-hover:hover {
      transform: translateY(-3px);
      border-color: var(--border-gold-hover) !important;
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.08);
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
