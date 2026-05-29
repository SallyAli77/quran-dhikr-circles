import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Star, Search, Filter, ShoppingBag, ArrowRight, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Products() {
  const { language, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = [
    { id: "all", labelEn: "All Items", labelAr: "كل المنتجات" },
    { id: "Books", labelEn: "Noble Books", labelAr: "كتب ورقية" },
    { id: "Learning", labelEn: "Arabic Learning", labelAr: "تعلم العربية" },
    { id: "Counter", labelEn: "Smart counters", labelAr: "أجهزة ذكية" },
    { id: "Decor", labelEn: "Worship Essentials", labelAr: "مستلزمات الصلاة" }
  ];

  const productsList = [
    {
      id: "p1",
      title: "The Quran: English Translation",
      titleAr: "القرآن الكريم: ترجمة إنجليزية معاصرة",
      author: "M.A.S. Abdel Haleem (Oxford)",
      category: "Books",
      categoryAr: "كتب ورقية",
      price: "$14.95",
      rating: 4.9,
      reviews: 5840,
      description: "The most readable, contemporary English translation of the Quran, capturing its spiritual essence and literary eloquence perfectly.",
      descriptionAr: "الترجمة الإنجليزية الأكثر وضوحاً وبلاغة لآيات القرآن الكريم مع الحفاظ على المقاصد البلاغية والجمالية الأدبية.",
      image: "📖",
      features: [
        "Oxford World's Classics edition",
        "Includes introduction and explanatory notes",
        "Gender-neutral and contemporary phrasing",
        "Ideal for English speaking readers"
      ],
      featuresAr: [
        "طبعة أكسفورد الكلاسيكية العالمية المتميزة",
        "يتضمن مقدمة تفصيلية وشروحات وهوامش توضيحية مفيدة",
        "صياغة معاصرة ومقروءة ومبسطة للجميع",
        "مثالي للقراء والباحثين المتحدثين بالإنجليزية"
      ],
      link: "https://www.amazon.com/s?k=M.A.S.+Abdel+Haleem+Quran+Oxford"
    },
    {
      id: "p2",
      title: "Arabic Stories for Learners",
      titleAr: "قصص عربية لمتعلمي اللغة",
      author: "Lutfi Mansur & Brosh",
      category: "Learning",
      categoryAr: "تعلم العربية",
      price: "$18.99",
      rating: 4.8,
      reviews: 320,
      description: "A gorgeous compilation of bilingual Arabic-English short stories, providing authentic cultural context and vocabulary keys.",
      descriptionAr: "مجموعة رائعة من القصص القصيرة ثنائية اللغة (عربي-إنجليزي) تمنح المتعلمين مفردات لغوية ممتازة وسياقاً ثقافياً أصيلاً.",
      image: "📚",
      features: [
        "Dual language parallel text side-by-side",
        "Vocabulary indexes and cultural context definitions",
        "Free companion audio recording download available",
        "Perfect for intermediate level students"
      ],
      featuresAr: [
        "نصوص ثنائية اللغة متوازية جنباً إلى جنب",
        "فهارس مفردات لغوية وشروح سياقية ثقافية متكاملة",
        "تحميل تسجيلات صوتية مرافقة مجانية لتدريب النطق",
        "ممتاز جداً لطلاب المستوى المتوسط والمبتدئين"
      ],
      link: "https://www.amazon.com/s?k=Arabic+Stories+for+Language+Learners"
    },
    {
      id: "p3",
      title: "Luxury Gold velvet Rug",
      titleAr: "سجادة صلاة مخملية فاخرة مطرزة بالذهب",
      author: "Al-Mihrab Collection",
      category: "Decor",
      categoryAr: "مستلزمات الصلاة",
      price: "$34.90",
      rating: 4.9,
      reviews: 1420,
      description: "Thick premium orthopedic velvet rug with elegant gold geometric patterns. Designed to offer comfort and aesthetic serenity.",
      descriptionAr: "سجادة مخملية سميكة ومريحة مطرزة بخيوط ذهبية وتفاصيل هندسية إسلامية أنيقة تمنحك الطمأنينة والهدوء أثناء الصلاة.",
      image: "🕌",
      features: [
        "Orthopedic layered foam structure to relieve joints",
        "Non-slip backing for safety on wooden floors",
        "Elegant and minimal luxury geometric design",
        "Easy to fold and clean with premium durability"
      ],
      featuresAr: [
        "هيكل مبطن ثلاثي الطبقات مريح جداً لتخفيف ضغط المفاصل",
        "قاعدة غير قابلة للانزلاق آمنة تماماً على الأرضيات الخشبية",
        "تصميم إسلامي هندسي مريح للنظر وبسيط وفخم",
        "سهلة الطي والتنظيف وذات متانة ممتازة تدوم طويلاً"
      ],
      link: "https://www.amazon.com/s?k=Premium+velvet+islamic+prayer+rug"
    },
    {
      id: "p4",
      title: "Smart Digital Tasbih Ring",
      titleAr: "خاتم التسبيح الذكي بتقنية بلوتوث",
      author: "iQibla Smart Tech",
      category: "Counter",
      categoryAr: "أجهزة ذكية",
      price: "$29.99",
      rating: 4.7,
      reviews: 890,
      description: "A premium alloy smart ring that logs dhikr counts, syncs with application, and vibrates softly at milestones (33, 66, 99).",
      descriptionAr: "خاتم ذكي لتسجيل الأذكار، يتزامن مع التطبيقات ويهتز بلطف لتنبيهك عند الوصول للعدد المطلوب والورد المكتوب.",
      image: "💍",
      features: [
        "OLED display with high clarity day or night",
        "Syncs to active smartphone prayer and dhikr app",
        "Vibrates on 33, 66, 99 and 100 counting intervals",
        "IP68 Waterproof rating and long 7-day battery life"
      ],
      featuresAr: [
        "شاشة OLED واضحة وعالية الدقة ليلاً ونهاراً",
        "تزامن تلقائي مع تطبيق مواقيت الصلاة والأذكار الذكي",
        "اهتزاز لطيف عند الوصول لعدد 33 و66 و99 و100",
        "مقاومة تامة للماء والغبار IP68 وبطارية تدوم 7 أيام"
      ],
      link: "https://www.amazon.com/s?k=Smart+digital+tasbih+ring+iqibla"
    }
  ];

  // Filter products based on search and category
  const filteredProducts = productsList.filter(p => {
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    if (productSearch) {
      const q = productSearch.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q) || p.titleAr.includes(q);
      const matchAuthor = p.author.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q) || p.descriptionAr.includes(q);
      return matchTitle || matchAuthor || matchDesc;
    }
    return true;
  });

  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    confetti({
      particleCount: 30,
      spread: 40,
      colors: ['#d4af37', '#ffffff']
    });
  };

  return (
    <div className="products-page container fade-in" style={{ minHeight: '80vh', paddingBottom: '80px', paddingTop: '40px' }}>
      
      {/* Premium Header */}
      <div style={styles.headerSection} className="text-center">
        <div style={styles.shopBadge}>
          <ShoppingBag size={14} color="var(--text-gold)" />
          <span>{language === 'ar' ? "متجر المنتجات الورقية والرقمية" : "Islamic Premium Store"}</span>
        </div>
        <h1 className="gold-gradient-text" style={styles.mainTitle}>
          {language === 'ar' ? "المعرض الإسلامي المتميز" : "The Premium Muslim Shop"}
        </h1>
        <p style={styles.mainSubtitle}>
          {language === 'ar' 
            ? "تصفح واقتنِ نخبة مختارة من المنتجات التعليمية والكتب ثنائية اللغة ومستلزمات العبادة الراقية لدعم مسيرتك التعليمية والإيمانية." 
            : "Handpicked premium resources, bilingual books, and smart worship utilities compiled to elevate your digital and physical spiritual environment."}
        </p>
      </div>

      {/* Control Panel: Categories selector + Search Input */}
      <div style={styles.controlPanel} className="glass-panel">
        {/* Category Tabs */}
        <div style={styles.tabsWrapper}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                ...styles.categoryTab,
                borderBottom: selectedCategory === cat.id ? '2.5px solid var(--gold-primary)' : '2.5px solid transparent',
                color: selectedCategory === cat.id ? 'var(--text-gold)' : 'var(--text-secondary)'
              }}
            >
              {language === 'ar' ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={styles.searchBox}>
          <Search size={16} color="var(--text-gold)" style={{ marginRight: language === 'ar' ? 0 : '8px', marginLeft: language === 'ar' ? '8px' : 0 }} />
          <input
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder={language === 'ar' ? "ابحث عن كتاب، خاتم، سجادة..." : "Search books, smart counter..."}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Products Uniform Amazon-style Grid */}
      <div style={styles.productsGrid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(p => (
            <div key={p.id} style={styles.productCard} className="glass-panel fade-in product-card-hover" onClick={() => handleOpenDetails(p)}>
              <div style={styles.productBadge}>
                {language === 'ar' ? p.categoryAr : p.category}
              </div>
              
              <div style={styles.productImageWrapper}>
                <span style={styles.productIcon}>{p.image}</span>
              </div>

              <div style={styles.productInfo}>
                <h3 style={styles.productTitle}>
                  {language === 'ar' ? p.titleAr : p.title}
                </h3>
                <span style={styles.productAuthor}>{p.author}</span>

                {/* Ratings */}
                <div style={styles.ratingRow}>
                  <div style={styles.starsWrapper}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} fill={i < Math.floor(p.rating) ? "var(--text-gold)" : "none"} color="var(--text-gold)" />
                    ))}
                  </div>
                  <span style={styles.ratingCount}>({p.reviews})</span>
                </div>

                {/* Price and Action */}
                <div style={styles.priceRow}>
                  <span style={styles.priceTag}>{p.price}</span>
                  <button className="btn-secondary" style={styles.viewBtn}>
                    <span>{language === 'ar' ? "عرض التفاصيل" : "Details"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noProducts} className="text-center glass-panel">
            <span>{language === 'ar' ? "عذراً، لم يتم العثور على أي منتج يطابق بحثك." : "No premium items match your search parameters."}</span>
          </div>
        )}
      </div>

      {/* Product Details Modal Dialog */}
      {selectedProduct && (
        <div style={styles.modalOverlay} className="fade-in" onClick={() => setSelectedProduct(null)}>
          <div style={styles.modalCard} className="glass-panel" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalImageWrapper}>
              <span style={styles.modalIcon}>{selectedProduct.image}</span>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <div>
                  <span style={styles.modalCategory}>
                    {language === 'ar' ? selectedProduct.categoryAr : selectedProduct.category}
                  </span>
                  <h2 style={styles.modalTitleText}>
                    {language === 'ar' ? selectedProduct.titleAr : selectedProduct.title}
                  </h2>
                  <span style={styles.modalAuthor}>{selectedProduct.author}</span>
                </div>
                <div style={styles.modalPrice}>{selectedProduct.price}</div>
              </div>

              <p style={styles.modalDescription}>
                {language === 'ar' ? selectedProduct.descriptionAr : selectedProduct.description}
              </p>

              {/* Product key features */}
              <div style={styles.featuresSection}>
                <h4 style={styles.featuresTitle}>{language === 'ar' ? "مزايا ومواصفات المنتج الفاخر:" : "Key Premium Specifications:"}</h4>
                <ul style={styles.featuresList}>
                  {(language === 'ar' ? selectedProduct.featuresAr : selectedProduct.features).map((feat, idx) => (
                    <li key={idx} style={styles.featureItem}>
                      <span style={styles.bullet}>•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal buttons */}
              <div style={styles.modalActions}>
                <button onClick={() => setSelectedProduct(null)} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>
                  {language === 'ar' ? "إغلاق" : "Close"}
                </button>
                <a 
                  href={selectedProduct.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary" 
                  style={styles.amazonBuyLink}
                >
                  <ExternalLink size={14} style={{ marginRight: '6px' }} />
                  <span>{language === 'ar' ? "شراء من أمازون (رابط مالي)" : "View on Amazon"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  headerSection: {
    maxWidth: '800px',
    margin: '0 auto 40px auto',
  },
  shopBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '30px',
    border: '1px solid rgba(212, 175, 55, 0.25)',
    background: 'rgba(212, 175, 55, 0.05)',
    color: 'var(--text-gold)',
    fontSize: '0.8rem',
    fontWeight: '700',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  mainTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '14px',
  },
  mainSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  controlPanel: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 28px',
    borderRadius: '20px',
    gap: '20px',
    marginBottom: '32px',
    border: '1.5px solid rgba(212,175,55,0.15)',
    background: 'rgba(15,17,26,0.6)',
  },
  tabsWrapper: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  categoryTab: {
    background: 'none',
    border: 'none',
    padding: '8px 4px',
    cursor: 'pointer',
    fontSize: '0.86rem',
    fontWeight: '700',
    transition: 'var(--transition-smooth)',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid var(--border-gold)',
    borderRadius: '12px',
    padding: '8px 16px',
    width: '300px',
    background: 'rgba(0,0,0,0.2)',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.82rem',
    width: '100%',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '28px',
    width: '100%',
  },
  productCard: {
    borderRadius: '20px',
    border: '1.5px solid rgba(212, 175, 55, 0.15)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, border-color 0.3s ease',
  },
  productBadge: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    padding: '4px 10px',
    borderRadius: '8px',
    background: 'rgba(212, 175, 55, 0.08)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    color: 'var(--text-gold)',
    fontSize: '0.7rem',
    fontWeight: '700',
  },
  productImageWrapper: {
    height: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4.5rem',
    background: 'rgba(255,255,255,0.01)',
    borderRadius: '16px',
    marginBottom: '16px',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  productIcon: {
    filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.2))',
  },
  productInfo: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  productTitle: {
    fontSize: '0.98rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '4px',
    lineHeight: '1.4',
  },
  productAuthor: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    marginBottom: '8px',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '14px',
  },
  starsWrapper: {
    display: 'flex',
    gap: '2px',
  },
  ratingCount: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '12px',
  },
  priceTag: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'var(--text-gold)',
  },
  viewBtn: {
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.75rem',
  },
  noProducts: {
    gridColumn: '1 / -1',
    padding: '40px',
    color: 'var(--text-secondary)',
    borderRadius: '20px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(10px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modalCard: {
    width: '100%',
    maxWidth: '760px',
    borderRadius: '24px',
    border: '1.5px solid var(--border-gold)',
    background: 'rgba(15,17,26,0.98)',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
  },
  modalImageWrapper: {
    flex: '1 1 260px',
    background: 'rgba(212,175,55,0.02)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '7.5rem',
    padding: '40px',
    borderRight: '1.5px solid rgba(212, 175, 55, 0.15)',
  },
  modalIcon: {
    filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.3))',
  },
  modalContent: {
    flex: '1 1 360px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    gap: '12px',
  },
  modalCategory: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
    background: 'rgba(212, 175, 55, 0.08)',
    padding: '3px 8px',
    borderRadius: '6px',
    display: 'inline-block',
    marginBottom: '6px',
  },
  modalTitleText: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    lineHeight: '1.3',
  },
  modalAuthor: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    marginTop: '4px',
    display: 'block',
  },
  modalPrice: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: 'var(--text-gold)',
  },
  modalDescription: {
    fontSize: '0.88rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    marginBottom: '20px',
  },
  featuresSection: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  featuresTitle: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '10px',
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  featureItem: {
    display: 'flex',
    gap: '8px',
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  bullet: {
    color: 'var(--text-gold)',
    fontWeight: '800',
  },
  modalActions: {
    display: 'flex',
    gap: '16px',
    marginTop: 'auto',
  },
  amazonBuyLink: {
    flex: '1.5',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
  }
};
