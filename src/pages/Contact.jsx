import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, ChevronUp, CheckCircle, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

const faqsList = [
  {
    id: 1,
    q: "What is the mission of Arabic Muslim?",
    qAr: "ما هي رسالة Arabic Muslim؟",
    a: "Arabic Muslim is a premium digital sanctuary built to bridge classical Islamic learning with cutting-edge modern aesthetics. We provide bilingual tools, Quran recitation audio, real-time prayer countdowns, and handpicked literature recommendations to elevate your spiritual study.",
    aAr: "Arabic Muslim هي ملاذ رقمي متميز مصمم لربط العلوم الإسلامية بالجماليات المعاصرة. نحن نقدم أدوات ثنائية اللغة، تلاوة القرآن الكريم، والعد التنازلي لمواقيت الصلاة، وتوصيات كتب حصرية لتعلم اللغة العربية والدروس الإسلامية"
  },
  {
    id: 2,
    q: "How are the prayer times calculated?",
    qAr: "كيف يتم حساب مواقيت الصلاة؟",
    a: "Timings are based on precise coordinates using standard astronomical angles. You can customize calculations in the settings bar on the Prayer page, switching between Umm Al-Qura (Makkah), Muslim World League (MWL), ISNA, or Egyptian authorities instantly.",
    aAr: "تعتمد الحسابات على إحداثيات المواقع بدقة عالية باستخدام زوايا فلكية قياسية. يمكنك تخصيص الحسابات وتغيير طرق الحساب من خلال شريط الإعدادات بصفحة الصلاة، مثل طريقة أم القرى بمكة المكرمة أو رابطة العالم الإسلامي."
  },
  {
    id: 3,
    q: "Are the Amazon products verified?",
    qAr: "هل منتجات أمازون الموصى بها موثوقة؟",
    a: "Yes. Every item in the Home showcase is handpicked from top-tier, highly reviewed sellers on Amazon. They represent critical resources like contemporary translations, Arabic learning texts, velvet rugs, and smart dhikr technology to support your learning journey.",
    aAr: "نعم. كل منتج معروض في الصفحة الرئيسية تم اختياره بعناية من أفضل البائعين الحاصلين على أعلى التقييمات على أمازون. إنها تمثل أدوات ضرورية مثل التراجم المعاصرة، كتب تعلم العربية، السجاد المريح، والخواتم الذكية لمساعدتك."
  },
  {
    id: 4,
    q: "How does the Tasbih counter milestone work?",
    qAr: "كيف يعمل عداد التسبيح التفاعلي؟",
    a: "Your daily Tasbih supplications are calculated locally in your browser. As you tap, the screen ripples, and key milestones (33, 66, 99) trigger massive multi-color gold and silver confetti bursts representing encouragement.",
    aAr: "يتم حساب تسابيحك اليومية محلياً وتخزينها في متصفحك. أثناء النقر، تظهر تموجات ذهبية تفاعلية، وعند الوصول لمحطات هامة (33، 66، 99) تنطلق احتفالات مبهجة باللونين الذهبي والفضي تشجيعاً لك."
  }
];

export default function Contact() {
  const { language, t } = useApp();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeFaqId, setActiveFaqId] = useState(null);
  const [emailError, setEmailError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "email") {
      setEmailError("");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Custom quick email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError(language === 'en' ? "Please enter a valid email address." : "يرجى إدخال بريد إلكتروني صالح.");
      return;
    }

    setFormSubmitted(true);

    // Play visual celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#ffffff', '#c5a059']
    });
  };

  const toggleFaq = (faqId) => {
    setActiveFaqId(prev => (prev === faqId ? null : faqId));
  };

  return (
    <div className="contact-page container fade-in" style={{ minHeight: '80vh' }}>
      <div style={styles.header}>
        <Mail size={32} color="var(--text-gold)" style={styles.headerIcon} />
        <h1 style={styles.title}>{t('contactTitle')}</h1>
        <p style={styles.subtitle}>{t('contactSubtitle')}</p>
      </div>

      <div style={styles.layoutGrid} className="grid-2">
        {/* Left Column: Form or Success */}
        <div style={styles.leftPanel}>
          {formSubmitted ? (
            <div style={styles.successCard} className="glass-panel fade-in">
              <CheckCircle size={54} color="var(--text-gold)" style={styles.successIcon} />
              <h2 style={styles.successTitle}>{language === 'en' ? "Peace Be Upon You!" : "وعليكم السلام ورحمة الله"}</h2>
              <p style={styles.successText}>
                {t('contactSuccess')}
              </p>
              
              <div style={styles.summaryContainer} className="glass-panel">
                <div style={styles.summaryRow}>
                  <strong>{language === 'en' ? "Name:" : "الاسم:"}</strong> <span>{formData.name}</span>
                </div>
                <div style={styles.summaryRow}>
                  <strong>{language === 'en' ? "Inquirer Email:" : "البريد الإلكتروني:"}</strong> <span>{formData.email}</span>
                </div>
              </div>

              <button 
                onClick={() => { setFormSubmitted(false); setFormData({ name: "", email: "", message: "" }); }} 
                className="btn-primary"
                style={styles.closeBtn}
              >
                <span>{language === 'en' ? "Send Another Inquiry" : "إرسال استفسار آخر"}</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} style={styles.contactForm} className="glass-panel">
              <div style={styles.formField}>
                <label style={styles.fieldLabel}>{t('contactName')}</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? "Enter your name..." : "أدخل اسمك الكريم..."}
                  style={styles.formInput}
                />
              </div>

              <div style={styles.formField}>
                <label style={styles.fieldLabel}>{t('contactEmail')}</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? "sally@arabicmuslim.com" : "sally@arabicmuslim.com"}
                  style={{
                    ...styles.formInput,
                    borderColor: emailError ? '#ff6b6b' : 'var(--border-gold)'
                  }}
                />
                {emailError && <span style={styles.errorSpan}>{emailError}</span>}
              </div>

              <div style={styles.formField}>
                <label style={styles.fieldLabel}>{t('contactMsg')}</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? "Write your spiritual inquiries or notes..." : "اكتب رسالتك أو استفسارك هنا..."}
                  style={styles.textAreaInput}
                />
              </div>

              <button type="submit" className="btn-primary" style={styles.submitBtn}>
                <Send size={14} />
                <span>{t('contactSubmit')}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: FAQs Accordion */}
        <div style={styles.rightPanel}>
          <div style={styles.faqTitleWrapper}>
            <HelpCircle size={20} color="var(--text-gold)" />
            <h3 style={styles.faqTitle}>{t('contactFAQTitle')}</h3>
          </div>

          <div style={styles.accordionContainer}>
            {faqsList.map(faq => {
              const isOpen = activeFaqId === faq.id;
              return (
                <div key={faq.id} style={styles.accordionItem} className="glass-panel">
                  <button 
                    onClick={() => toggleFaq(faq.id)} 
                    style={styles.accordionTrigger}
                  >
                    <span style={styles.faqQ}>
                      {language === 'en' ? faq.q : faq.qAr}
                    </span>
                    {isOpen ? <ChevronUp size={16} color="var(--text-gold)" /> : <ChevronDown size={16} color="var(--text-secondary)" />}
                  </button>
                  
                  {isOpen && (
                    <div style={styles.accordionContent} className="fade-in">
                      <p style={styles.faqA}>
                        {language === 'en' ? faq.a : faq.aAr}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick info badges */}
          <div style={styles.quickDetailsGrid} className="grid-2">
            <div style={styles.infoBadge} className="glass-panel">
              <Mail size={16} color="var(--text-gold)" />
              <div>
                <div style={styles.infoLabel}>{language === 'en' ? "Email Us" : "راسلنا"}</div>
                <div style={styles.infoVal}>peace@arabicmuslim.com</div>
              </div>
            </div>

            <div style={styles.infoBadge} className="glass-panel">
              <MapPin size={16} color="var(--text-gold)" />
              <div>
                <div style={styles.infoLabel}>{language === 'en' ? "Domain" : "النطاق"}</div>
                <div style={styles.infoVal}>arabicmuslim.com</div>
              </div>
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
    alignItems: 'start',
  },
  leftPanel: {},
  contactForm: {
    padding: '30px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fieldLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  formInput: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'var(--transition-smooth)',
  },
  textAreaInput: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'none',
    fontFamily: 'inherit',
    transition: 'var(--transition-smooth)',
  },
  errorSpan: {
    fontSize: '0.75rem',
    color: '#ff6b6b',
    marginTop: '2px',
  },
  submitBtn: {
    alignSelf: 'flex-start',
    padding: '12px 24px',
  },
  successCard: {
    padding: '40px 30px',
    borderRadius: '24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  successIcon: {
    marginBottom: '8px',
    filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))',
  },
  successTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.8rem',
    color: 'var(--text-gold)',
  },
  successText: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.7',
    maxWidth: '500px',
  },
  summaryContainer: {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.01)',
    textAlign: 'left',
    fontSize: '0.85rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
  },
  closeBtn: {
    marginTop: '10px',
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  faqTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  faqTitle: {
    fontSize: '1.25rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  accordionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  accordionItem: {
    borderRadius: '12px',
    overflow: 'hidden',
  },
  accordionTrigger: {
    width: '100%',
    background: 'none',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 20px',
    cursor: 'pointer',
    textAlign: 'left',
    color: 'var(--text-primary)',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  accordionContent: {
    padding: '0 20px 18px 20px',
  },
  faqQ: {
    flexGrow: 1,
    paddingRight: '16px',
  },
  faqA: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  quickDetailsGrid: {
    marginTop: '10px',
  },
  infoBadge: {
    padding: '16px 20px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  infoLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  infoVal: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
    marginTop: '2px',
  }
};

if (typeof document !== 'undefined') {
  const contactStyle = document.createElement('style');
  contactStyle.innerHTML = `
    [dir="rtl"] .contact-page [style*="formInput"] {
      text-align: right !important;
    }
    [dir="rtl"] .contact-page [style*="textAreaInput"] {
      text-align: right !important;
    }
    [dir="rtl"] .contact-page [style*="accordionTrigger"] {
      text-align: right !important;
      flex-direction: row-reverse !important;
    }
    [dir="rtl"] .contact-page [style*="faqQ"] {
      padding-right: 0 !important;
      padding-left: 16px !important;
    }
    [dir="rtl"] .contact-page [style*="faqA"] {
      text-align: right !important;
    }
    [dir="rtl"] .contact-page [style*="infoBadge"] {
      flex-direction: row-reverse !important;
      text-align: right !important;
    }
    [dir="rtl"] .contact-page [style*="submitBtn"] {
      align-self: flex-end !important;
    }
    [dir="rtl"] .contact-page [style*="summaryContainer"] {
      text-align: right !important;
    }
    [dir="rtl"] .contact-page [style*="summaryRow"] {
      flex-direction: row-reverse !important;
    }
    @media (max-width: 768px) {
      .contact-page [style*="contactForm"] {
        padding: 20px 16px !important;
      }
      .contact-page [style*="accordionTrigger"] {
        padding: 14px 16px !important;
        font-size: 0.9rem !important;
      }
    }
  `;
  document.head.appendChild(contactStyle);
}
