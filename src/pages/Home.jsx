import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Compass, Users, FileText, ShoppingBag, Star, ArrowRight, Award, Flame } from 'lucide-react';

export default function Home({ setActivePage }) {
  const { language, searchQuery, t } = useApp();

  // Handpicked high-end Islamic products from Amazon with affiliate styling
  const amazonProducts = [
    {
      id: "p1",
      title: "The Quran: English Translation",
      titleAr: "القرآن الكريم: ترجمة إنجليزية بواسطة عبد الحليم",
      author: "M.A.S. Abdel Haleem (Oxford)",
      category: "Books",
      categoryAr: "كتب",
      price: "$14.95",
      rating: 4.9,
      reviews: 5840,
      description: "The most readable, contemporary English translation of the Quran, capturing its spiritual essence and literary eloquence perfectly.",
      descriptionAr: "الترجمة الإنجليزية الأكثر وضوحاً وبلاغة لآيات القرآن الكريم مع الحفاظ على المقاصد الروحانية والجمالية الأدبية.",
      image: "📖",
      link: "https://www.amazon.com/s?k=M.A.S.+Abdel+Haleem+Quran+Oxford"
    },
    {
      id: "p2",
      title: "Arabic Stories for Learners",
      titleAr: "قصص عربية لمتعلمي اللغة",
      author: "Lutfi Mansur & Brosh",
      category: "Learning Arabic",
      categoryAr: "تعلم العربية",
      price: "$18.99",
      rating: 4.8,
      reviews: 320,
      description: "A gorgeous compilation of bilingual Arabic-English short stories, providing authentic cultural context and vocabulary keys.",
      descriptionAr: "مجموعة رائعة من القصص القصيرة ثنائية اللغة (عربي-إنجليزي) تمنح المتعلمين مفردات لغوية ممتازة وسياقاً ثقافياً أصيلاً.",
      image: "📚",
      link: "https://www.amazon.com/s?k=Arabic+Stories+for+Language+Learners"
    },
    {
      id: "p3",
      title: "Luxury Gold-Bordered Prayer Rug",
      titleAr: "سجادة صلاة مخملية فاخرة مطرزة بالذهب",
      author: "Al-Mihrab Collection",
      category: "Islamic Decor",
      categoryAr: "مستلزمات إسلامية",
      price: "$34.90",
      rating: 4.9,
      reviews: 1420,
      description: "Thick premium orthopedic velvet rug with elegant gold geometric patterns. Designed to offer comfort and aesthetic serenity.",
      descriptionAr: "سجادة مخملية سميكة ومريحة مطرزة بخيوط ذهبية وتفاصيل هندسية إسلامية أنيقة تمنحك الطمأنينة والهدوء أثناء الصلاة.",
      image: "🕌",
      link: "https://www.amazon.com/s?k=Premium+velvet+islamic+prayer+rug"
    },
    {
      id: "p4",
      title: "Smart Digital Tasbih Ring",
      titleAr: "خاتم التسبيح الذكي بتقنية بلوتوث",
      author: "iQibla Smart Tech",
      category: "Smart Counter",
      categoryAr: "أجهزة ذكية",
      price: "$29.99",
      rating: 4.7,
      reviews: 890,
      description: "A premium alloy smart ring that logs dhikr counts, syncs with application, and vibrates softly at milestones (33, 66, 99).",
      descriptionAr: "خاتم ذكي من السبائك الفاخرة لتسجيل الأذكار، يتزامن مع التطبيقات ويهتز بلطف عند التذكير والوصول للعدد المطلوب.",
      image: "💍",
      link: "https://www.amazon.com/s?k=Smart+digital+tasbih+ring+iqibla"
    },
    {
      id: "p5",
      title: "Gold Suede Spiritual Journal",
      titleAr: "دفتر يوميات إسلامي فاخر من الشامواه المذهب",
      author: "ArabicMuslim Premium",
      category: "Stationery",
      categoryAr: "قرطاسية",
      price: "$16.50",
      rating: 4.9,
      reviews: 210,
      description: "Premium suede cover notebook featuring gold gilded edges. Perfect for daily reflections, du'as, and Quranic vocab tracking.",
      descriptionAr: "دفتر يوميات بغلاف فاخر مع حواف ذهبية مذهبة. مثالي لكتابة الخواطر الروحانية اليومية والأدعية وتدبر الآيات.",
      image: "✍️",
      link: "https://www.amazon.com/s?k=Islamic+prayer+journal+gold"
    }
  ];

  // Filters products if global search bar contains query
  const filteredProducts = amazonProducts.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.titleAr.includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.categoryAr.includes(q)
    );
  });

  return (
    <div className="home-page fade-in">
      {/* Hero Banner */}
      <section style={styles.heroSection}>
        <div className="islamic-pattern"></div>
        <div className="container" style={styles.heroContainer}>
          <div style={styles.heroBadge} className="glass-panel">
            <Award size={14} color="var(--text-gold)" />
            <span>{language === 'en' ? "Welcome to Premium ArabicMuslim Portal" : "مرحباً بك في بوابة أرابيك مسلم الفاخرة"}</span>
          </div>
          
          <h1 style={styles.heroTitle} className="slide-up">
            {language === 'en' ? "Embark on a Premium" : "ابدأ رحلة"} <br />
            <span className="gold-gradient-text gold-glow-text" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '800' }}>
              {language === 'en' ? "Spiritual Journey" : "روحانية فاخرة"}
            </span>
          </h1>

          <p style={styles.heroSubtitle} className="slide-up">
            {t('heroSubtitle')}
          </p>

          <div style={styles.heroActions} className="slide-up">
            <button onClick={() => setActivePage('quran')} className="btn-primary" style={{ padding: '14px 30px', fontSize: '1rem' }}>
              <span>{t('heroExplore')}</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={() => setActivePage('community')} className="btn-secondary" style={{ padding: '14px 30px', fontSize: '1rem' }}>
              <Users size={18} />
              <span>{t('heroCommunity')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={styles.sectionPadding}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gold)', marginBottom: '8px' }}>
              <Flame size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {language === 'en' ? "Essential Utilities" : "الخدمات الأساسية"}
              </span>
            </div>
            <h2 style={styles.sectionTitle}>
              {language === 'en' ? "Align Your Daily Life with Ease" : "نظم حياتك اليومية بكل يسر وسهولة"}
            </h2>
          </div>

          <div className="grid-4" style={{ marginTop: '40px' }}>
            {/* Feature 1 */}
            <div className="glass-panel text-center-hover" style={styles.featCard} onClick={() => setActivePage('quran')}>
              <div style={styles.featIconWrapper}>
                <BookOpen size={24} color="var(--text-gold)" />
              </div>
              <h3 style={styles.featCardTitle}>{t('featQuranTitle')}</h3>
              <p style={styles.featCardDesc}>{t('featQuranDesc')}</p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel text-center-hover" style={styles.featCard} onClick={() => setActivePage('prayer')}>
              <div style={styles.featIconWrapper}>
                <Compass size={24} color="var(--text-gold)" />
              </div>
              <h3 style={styles.featCardTitle}>{t('featPrayerTitle')}</h3>
              <p style={styles.featCardDesc}>{t('featPrayerDesc')}</p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel text-center-hover" style={styles.featCard} onClick={() => setActivePage('community')}>
              <div style={styles.featIconWrapper}>
                <Users size={24} color="var(--text-gold)" />
              </div>
              <h3 style={styles.featCardTitle}>{t('featCommunityTitle')}</h3>
              <p style={styles.featCardDesc}>{t('featCommunityDesc')}</p>
            </div>

            {/* Feature 4 */}
            <div className="glass-panel text-center-hover" style={styles.featCard} onClick={() => setActivePage('articles')}>
              <div style={styles.featIconWrapper}>
                <FileText size={24} color="var(--text-gold)" />
              </div>
              <h3 style={styles.featCardTitle}>{t('featArticlesTitle')}</h3>
              <p style={styles.featCardDesc}>{t('featArticlesDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Amazon Products Section */}
      <section style={{ ...styles.sectionPadding, background: 'rgba(212, 175, 55, 0.01)', borderTop: '1px solid rgba(212, 175, 55, 0.05)', borderBottom: '1px solid rgba(212, 175, 55, 0.05)' }}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gold)', marginBottom: '8px' }}>
              <ShoppingBag size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {language === 'en' ? "Premium Recommendations" : "توصياتنا الحصرية"}
              </span>
            </div>
            <h2 style={styles.sectionTitle}>{t('prodSectionTitle')}</h2>
            <p style={styles.sectionSubtitle}>{t('prodSectionSubtitle')}</p>
          </div>

          <div style={styles.productGrid} className="grid-3">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(p => (
                <div key={p.id} className="glass-panel" style={styles.productCard}>
                  {/* Category Badge */}
                  <span style={styles.productCategory}>
                    {language === 'en' ? p.category : p.categoryAr}
                  </span>

                  {/* Icon illustration */}
                  <div style={styles.productIconWrapper}>
                    <span style={styles.productIcon}>{p.image}</span>
                  </div>

                  {/* Body details */}
                  <div style={styles.productBody}>
                    <h3 style={styles.productCardTitle}>
                      {language === 'en' ? p.title : p.titleAr}
                    </h3>
                    <div style={styles.productAuthor}>{p.author}</div>
                    
                    {/* Stars */}
                    <div style={styles.ratingWrapper}>
                      <div style={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            fill={i < Math.floor(p.rating) ? "var(--gold-primary)" : "none"} 
                            color="var(--gold-primary)" 
                          />
                        ))}
                      </div>
                      <span style={styles.ratingText}>{p.rating}</span>
                      <span style={styles.reviewsText}>
                        ({p.reviews} {p.reviews > 1 ? t('prodReviewsPlural') : t('prodReviewSingular')})
                      </span>
                    </div>

                    <p style={styles.productDesc}>
                      {language === 'en' ? p.description : p.descriptionAr}
                    </p>

                    <div style={styles.productDivider}></div>

                    {/* Price and Action */}
                    <div style={styles.productFooter}>
                      <span style={styles.productPrice}>{p.price}</span>
                      <a 
                        href={p.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-primary" 
                        style={styles.acquireBtn}
                      >
                        <span>{t('prodBuyNow')}</span>
                        <ArrowRight size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noResults} className="glass-panel">
                <span>{t('searchNoResults')}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  heroSection: {
    position: 'relative',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    background: 'radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.05) 0%, var(--bg-primary) 70%)',
    overflow: 'hidden',
  },
  heroContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    zIndex: 1,
    maxWidth: '900px',
  },
  heroBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(212, 175, 55, 0.04)',
    border: '1px solid var(--border-gold)',
    borderRadius: '30px',
    fontSize: '0.8rem',
    color: 'var(--text-gold)',
    marginBottom: '28px',
    letterSpacing: '0.5px',
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '3.6rem',
    lineHeight: '1.25',
    color: 'var(--text-primary)',
    fontWeight: '400',
    marginBottom: '20px',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    maxWidth: '700px',
    lineHeight: '1.7',
    marginBottom: '36px',
  },
  heroActions: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sectionPadding: {
    padding: '80px 0',
    position: 'relative',
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    marginTop: '10px',
  },
  featCard: {
    padding: '40px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  featIconWrapper: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(212, 175, 55, 0.05)',
    border: '1px solid var(--border-gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-smooth)',
  },
  featCardTitle: {
    fontSize: '1.15rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  featCardDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  productGrid: {
    marginTop: '50px',
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
  },
  productCategory: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    background: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid var(--border-gold)',
    color: 'var(--text-gold)',
    fontSize: '0.75rem',
    padding: '4px 10px',
    borderRadius: '20px',
    fontWeight: '600',
  },
  productIconWrapper: {
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
  },
  productIcon: {
    fontSize: '4.5rem',
    filter: 'drop-shadow(0 8px 16px rgba(212, 175, 55, 0.2))',
  },
  productBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  productCardTitle: {
    fontSize: '1.1rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
    lineHeight: '1.4',
  },
  productAuthor: {
    fontSize: '0.8rem',
    color: 'var(--text-gold)',
    marginTop: '4px',
    fontWeight: '500',
  },
  ratingWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  ratingText: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  reviewsText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  productDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginTop: '12px',
    flexGrow: 1,
  },
  productDivider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.05)',
    margin: '18px 0',
  },
  productFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  acquireBtn: {
    padding: '8px 16px',
    fontSize: '0.8rem',
  },
  noResults: {
    gridColumn: '1 / -1',
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  }
};

if (typeof document !== 'undefined') {
  const homeStyle = document.createElement('style');
  homeStyle.innerHTML = `
    @media (max-width: 768px) {
      .home-page [style*="heroTitle"] {
        font-size: 2.2rem !important;
      }
      .home-page [style*="heroSubtitle"] {
        font-size: 0.95rem !important;
      }
      .home-page [style*="sectionTitle"] {
        font-size: 1.6rem !important;
      }
    }
    .text-center-hover:hover [style*="featIconWrapper"] {
      transform: scale(1.1);
      background: rgba(212, 175, 55, 0.15);
      box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
    }
    [dir="rtl"] .home-page [style*="productCategory"] {
      left: auto !important;
      right: 16px !important;
    }
  `;
  document.head.appendChild(homeStyle);
}
