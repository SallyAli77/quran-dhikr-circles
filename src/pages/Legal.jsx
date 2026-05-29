import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, FileText, ArrowLeft, Award, Lock, ExternalLink } from 'lucide-react';

export default function Legal({ initialTab = "privacy", setActivePage }) {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  return (
    <div className="container" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button 
          onClick={() => setActivePage('home')} 
          style={styles.backBtn}
          className="btn-secondary"
        >
          <ArrowLeft size={16} style={{ marginRight: '6px', marginLeft: '6px' }} />
          <span>{language === 'en' ? "Back to Home" : "العودة للرئيسية"}</span>
        </button>
        <h1 style={styles.title} className="gold-gradient-text">
          {language === 'en' ? "Legal Agreements" : "الاتفاقيات القانونية"}
        </h1>
        <p style={styles.subtitle}>
          {language === 'en' 
                      ? "Please review our privacy policies and terms of service for the Arabic Muslim platform." 
            : "يرجى مراجعة سياسة الخصوصية وشروط الاستخدام الخاصة بمنصة Arabic Muslim لضمان استخدام آمن وموثوق."}
        </p>
      </div>

      {/* Tabs - full width, clean */}
      <div style={styles.tabContainer}>
        <button 
          onClick={() => setActiveTab('privacy')}
          style={{
            ...styles.tabBtn,
            background: activeTab === 'privacy' ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'privacy' ? '#000' : 'var(--text-secondary)',
            fontWeight: activeTab === 'privacy' ? '700' : '500',
            border: activeTab === 'privacy' ? 'none' : '1px solid rgba(212,175,55,0.15)'
          }}
        >
          <Shield size={16} style={{ marginRight: '6px', marginLeft: '6px' }} />
          <span>{language === 'en' ? "Privacy Policy" : "سياسة الخصوصية"}</span>
        </button>
        <button 
          onClick={() => setActiveTab('terms')}
          style={{
            ...styles.tabBtn,
            background: activeTab === 'terms' ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'terms' ? '#000' : 'var(--text-secondary)',
            fontWeight: activeTab === 'terms' ? '700' : '500',
            border: activeTab === 'terms' ? 'none' : '1px solid rgba(212,175,55,0.15)'
          }}
        >
          <FileText size={16} style={{ marginRight: '6px', marginLeft: '6px' }} />
          <span>{language === 'en' ? "Terms of Use" : "شروط الاستخدام"}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div style={styles.contentWrapper} className="glass-panel fade-in">
        {activeTab === 'privacy' ? (
          /* PRIVACY POLICY */
          <div style={styles.textSection}>
            <div style={styles.sectionHeader}>
              <Lock size={28} color="var(--text-gold)" />
              <h2 style={styles.sectionTitle}>{language === 'en' ? "Privacy Policy" : "سياسة الخصوصية"}</h2>
            </div>
            <p style={styles.lastUpdated}>
              {language === 'en' ? "Last Updated: May 2026" : "آخر تحديث: مايو 2026"}
            </p>

            <div style={styles.legalBody}>
              {language === 'en' ? (
                <>
                  <h3>1. Introduction</h3>
                  <p>Welcome to ArabicMuslim ("we," "our," "us"). We are deeply committed to protecting your personal privacy and providing a secure, spiritually enriching digital experience. This Privacy Policy outlines how we collect, use, safeguard, and disclose your information when you interact with our Islamic portal, including memorizing the Holy Quran, reciting daily Adhkar, using our interactive Tasbih counter, joining or creating collaborative recitation/memorization circles, browsing and purchasing Islamic e-books and Arabic-learning materials, checking accurate prayer times, posting spiritual reflections, and tracking your personal progress and spiritual statistics.</p>
                  
                  <h3>2. Collection of Information</h3>
                  <p>We may collect information about you in several ways to support and improve your journey. The categories of information we collect include:</p>
                  <ul>
                    <li><strong>Voluntary Personal Data:</strong> Personally identifiable information, such as your name, email address, profile avatar, and account credentials that you voluntarily share when you register an account, participate in Dhikr or Quran circles, purchase Arabic language learning e-books, or post reflections on our community boards.</li>
                    <li><strong>Automated Technical Data:</strong> Server log information collected automatically, such as your IP address, browser type, operating system, access duration, and pages viewed, which helps us ensure platform security and calculate highly accurate prayer times based on your approximate location.</li>
                    <li><strong>Secure Local Storage:</strong> To provide a seamless and fast experience, we use browser local storage on your device to cache your personal daily Tasbih counts, saved bookmarks, customized goals, and circles you have joined or created.</li>
                  </ul>

                  <div style={styles.adSenseNotice} className="glass-panel">
                    <h3>⚠️ 3. Google AdSense & Third-Party Advertising Disclosures</h3>
                    <p>To keep this premium platform free for all Muslims globally, we serve advertisements through Google AdSense. In compliance with Google's strict publisher policies, please note the following disclosures:</p>
                    <ul>
                      <li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites on the internet.</li>
                      <li>Google's use of advertising cookies enables it and its partners to serve personalized ads to our users based on their visits to our site and/or other sites across the web.</li>
                      <li>You may opt-out of personalized advertising at any time by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={styles.legalLink}>Google Ads Settings <ExternalLink size={12} style={{ display: 'inline', marginLeft: '2px' }} /></a>, or manage your tracking preferences using our integrated Google-certified Consent Management Platform (CMP).</li>
                    </ul>
                  </div>

                  <h3>4. How We Use Your Information</h3>
                  <p>We process your information to deliver a smooth, efficient, and customized spiritual experience. Specifically, we use your data to:</p>
                  <ul>
                    <li>Manage your user profile and track your daily Quran memorization statistics and spiritual achievements.</li>
                    <li>Coordinate and update real-time collaborative recitation, memorization, or Tasbih circles, showing dynamic participant counts.</li>
                    <li>Process purchases and manage access to your acquired Islamic e-books and Arabic learning resources.</li>
                    <li>Render community reflections, comments, likes, and interactions on our social boards.</li>
                    <li>Calculate and display precise prayer times and deliver spiritual newsletters and platform updates.</li>
                  </ul>

                  <h3>5. Sharing and Safeguarding Your Data</h3>
                  <p>We maintain a strict policy of never selling, renting, or trading your personal data with third parties for commercial or marketing purposes. Information is only shared when strictly required by law or to protect platform security.</p>

                  <h3>6. Contact Us</h3>
                  <p>If you have any questions, comments, or concerns regarding this Privacy Policy, please feel free to reach out to us at: <strong>support@arabicmuslim.com</strong></p>
                </>
              ) : (
                <>
                  <h3>1. مقدمة</h3>
                  <p>أهلاً بك في منصة "العربي المسلم" (ArabicMuslim). نلتزم في منصتنا بأعلى معايير الأمان وحماية خصوصية مستخدمينا الكرام. تهدف سياسة الخصوصية هذه إلى توضيح كيف نجمع ونستخدم ونحمي بياناتك الشخصية عند تفاعلك مع خدماتنا الإيمانية المتكاملة، مثل حفظ القرآن الكريم، وتلاوة الأذكار، واستخدام عداد التسبيح التفاعلي، والمشاركة في حلقات التلاوة والحفظ الجماعية، وتصفح واقتناء الكتب الإلكترونية الإسلامية ومواد تعليم اللغة العربية، واستعراض مواقيت الصلاة ومشاركة المنشورات والخواطر مع أفراد المجتمع الإسلامي، ومتابعة إحصائياتك ومدى تحقيق أهدافك.</p>
                  
                  <h3>2. البيانات التي نجمعها وكيفية جمعها</h3>
                  <p>تتمحور البيانات التي قد نقوم بجمعها حول تحسين تجربتك الإيمانية والتقنية وتشتمل على:</p>
                  <ul>
                    <li><strong>البيانات الشخصية الطوعية:</strong> مثل اسمك، وبريدك الإلكتروني، وصورتك الرمزية (الآفاتار)، وبيانات ملفك الشخصي التي تزودنا بها عند تسجيل حسابك للمشاركة في حلقات الحفظ والتسبيح، أو عند التفاعل ونشر المنشورات في مجتمعنا، أو عند تصفح واقتناء كتب تعليم اللغة العربية والمنتجات الإسلامية.</li>
                    <li><strong>البيانات التقنية التلقائية:</strong> معلومات مثل نوع المتصفح، ونظام التشغيل، وعنوان بروتوكول الإنترنت (IP)، وأوقات الاستخدام والصفحات التي تمت زيارتها، وذلك لضمان عمل خوادم المنصة وحساب مواقيت الصلاة بدقة بناءً على موقعك الجغرافي التقريبي.</li>
                    <li><strong>التخزين المحلي الآمن (Local Storage):</strong> نستخدم تقنيات التخزين المحلي على متصفحك بشكل خاص لحفظ أعداد تسبيحك الشخصية، وإنجازاتك اليومية، وإحصائيات تحقيق أهدافك الإيمانية، بالإضافة إلى حلقات الذكر والقرآن التي أنشأتها أو انضممت إليها، مما يضمن لك مزامنة فورية وسريعة لبياناتك دون إبطاء التصفح.</li>
                  </ul>

                  <div style={styles.adSenseNotice} className="glass-panel">
                    <h3>⚠️ 3. إفصاحات جوجل أدسنس (Google AdSense) والإعلانات</h3>
                    <p>من أجل مواصلة تطوير ودعم منصتنا الإيمانية وتوفيرها مجاناً للجميع، نقوم بعرض إعلانات عبر شبكة جوجل أدسنس. يرجى العلم بالآتي تماشياً مع متطلبات جوجل الصارمة:</p>
                    <ul>
                      <li>تستخدم جوجل ملفات تعريف الارتباط (Cookies) لعرض الإعلانات للمستخدمين بناءً على زياراتهم السابقة لمنصتنا أو للمواقع الأخرى على شبكة الإنترنت.</li>
                      <li>يساعد استخدام جوجل لملفات تعريف ارتباط الإعلانات شركاءها على تخصيص وعرض الإعلانات المناسبة لاهتماماتك بناءً على تصفحك.</li>
                      <li>يمكنك في أي وقت إلغاء الإعلانات المخصصة وتفضيلات التتبع عبر زيارة <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={styles.legalLink}>إعدادات إعلانات جوجل <ExternalLink size={12} style={{ display: 'inline', marginLeft: '2px' }} /></a>، أو التحكم بها بالكامل عبر نافذة إدارة الموافقة المعتمدة من جوجل (CMP) المتوفرة في موقعنا.</li>
                    </ul>
                  </div>

                  <h3>4. كيف نستخدم معلوماتك وبياناتك؟</h3>
                  <p>تُستخدم البيانات التي يتم جمعها في تحسين وتأمين تجربتك الروحية والتعليمية بالكامل، وتحديداً في الأغراض التالية:</p>
                  <ul>
                    <li>إدارة حسابك الشخصي ومتابعة إحصائياتك ومدى تقدمك في حفظ القرآن وتحقيق أهدافك الروحية.</li>
                    <li>إنشاء وتنسيق حلقات التلاوة، والحفظ، والتسبيح الجماعي المباشر، وتحديث أعداد المنضمين إليها لحظياً.</li>
                    <li>تنظيم عمليات شراء واقتناء الكتب الإلكترونية الإسلامية، ودروس ومواد تعليم اللغة العربية الفاخرة المتاحة على المتجر.</li>
                    <li>تمكينك من نشر الخواطر والبوستات الإسلامية والتفاعل بالتعليقات والإعجابات في ساحة المجتمع بكل سلاسة.</li>
                    <li>عرض مواقيت الصلاة بدقة بالغة وتنبيهك باقتراب مواعيد العبادات.</li>
                  </ul>

                  <h3>5. حماية ومشاركة البيانات</h3>
                  <p>نؤكد لك بشكل قاطع أننا لا نقوم ببيع، تأجير، أو مشاركة بياناتك الشخصية مع أي جهات خارجية لأغراض تجارية أو تسويقية. تنحصر مشاركة البيانات في الامتثال القانوني الصارم في حال تطلب الأمر ذلك قانونياً.</p>

                  <h3>6. التواصل معنا</h3>
                  <p>إذا كان لديك أي تساؤل أو رغبة في الاستفسار عن تفاصيل سياسة الخصوصية، نسعد بتواصلك المباشر معنا عبر البريد الإلكتروني: <strong>support@arabicmuslim.com</strong></p>
                </>
              )}
            </div>
          </div>
        ) : (
          /* TERMS OF USE */
          <div style={styles.textSection}>
            <div style={styles.sectionHeader}>
              <Award size={28} color="var(--text-gold)" />
              <h2 style={styles.sectionTitle}>{language === 'en' ? "Terms of Use" : "شروط الاستخدام"}</h2>
            </div>
            <p style={styles.lastUpdated}>
              {language === 'en' ? "Last Updated: May 2026" : "آخر تحديث: مايو 2026"}
            </p>

            <div style={styles.legalBody}>
              {language === 'en' ? (
                <>
                  <h3>1. Agreement to Terms</h3>
                  <p>Welcome to ArabicMuslim. These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and ArabicMuslim ("we," "us," or "our"), concerning your access to and use of our platform.</p>
                  <p>By accessing the Site, you acknowledge that you have read, understood, and agreed to be bound by all of these Terms of Use. If you do not agree with all of these terms, you are expressly prohibited from using our services and must discontinue use immediately.</p>

                  <h3>2. Intellectual Property Rights</h3>
                  <p>All source code, user interface designs, databases, functionality, software, website designs, audio, text, articles, Arabic-learning e-books, and graphics on the Site (collectively, the "Content") are our proprietary property or licensed to us, and are protected by international copyright and trademark laws.</p>
                  <p>The content is provided on the Site "AS IS" for your personal, spiritual, and educational use only. You may not copy, reproduce, republish, distribute, sell, or exploit any e-book, educational resource, or content for commercial purposes without our express prior written consent.</p>

                  <h3>3. User Representations</h3>
                  <p>By registering or using this platform, you represent and warrant that:</p>
                  <ul>
                    <li>All registration information you submit is true, accurate, current, and complete.</li>
                    <li>You will maintain the security of your credentials and update your profile information as necessary.</li>
                    <li>You have the legal capacity and agree to comply with these Terms of Service.</li>
                    <li>You will not use the platform for any unauthorized, harmful, or illegal activities.</li>
                  </ul>

                  <h3>4. Prohibited Activities</h3>
                  <p>We strive to maintain a respectful, peaceful, and clean Islamic community space. You agree not to engage in any of the following prohibited behaviors:</p>
                  <ul>
                    <li>Posting offensive, disrespectful, political, sectarian, or aggressive content on our community reflection boards. We operate a strict zero-tolerance policy for hate speech or harassment.</li>
                    <li>Attempting to bypass security barriers, hack the website, or disrupt our servers and database connections.</li>
                    <li>Using automated systems, scripts, bots, or scrapers to falsely manipulate Tasbih counts, scrape e-book products, or harvest user data.</li>
                    <li>Attempting to acquire paid e-books or digital materials through fraudulent methods, or distributing them in violation of copyright laws.</li>
                  </ul>

                  <h3>5. Service Modification & Termination</h3>
                  <p>We reserve the right, in our sole discretion and without notice or liability, to restrict or terminate access to the site (including blocking certain IP addresses) to any user who violates these Terms, disrupts our Dhikr circles, or threatens the safety of our spiritual community.</p>

                  <h3>6. Disclaimer of Warranties</h3>
                  <p>Our platform services, including prayer time calculations, counters, and educational assets, are provided on an "as-is" and "as-available" basis without warranties of any kind. While we strive for absolute accuracy and excellence, we are not liable for temporary technical interruptions or minor calculation variances.</p>
                </>
              ) : (
                <>
                  <h3>1. الموافقة على الشروط والأحكام</h3>
                  <p>يرجى قراءة شروط الاستخدام هذه بعناية. تُعد هذه الشروط اتفاقية ملزمة قانوناً بينك بصفتك مستخدماً وبين منصة "العربي المسلم" (ArabicMuslim) وتخص وصولك واستخدامك لكافة خدمات الموقع وتطبيقاته.</p>
                  <p>بمجرد تصفحك أو استخدامك لأي جزء من الموقع، فإنك تقر بأنك قد قرأت هذه الشروط، وفهمتها، ووافقت على الالتزام الكامل بها. إذا كنت لا توافق على أي بند من هذه الشروط، يرجى التوقف عن استخدام خدمات المنصة فوراً.</p>

                  <h3>2. الملكية الفكرية وحقوق المحتوى</h3>
                  <p>إن منصة "العربي المسلم" وكافة محتوياتها من أكواد برمجية، وتصميمات واجهة المستخدم، والنصوص الإيمانية، والكتب الإلكترونية لتعليم اللغة العربية، ومواد الحفظ، والمقالات، والصوتيات هي ملكية فكرية حصرية للمنصة أو مرخصة لنا بموجب القانون.</p>
                  <p>يتم توفير هذا المحتوى الفاخر لأغراض الاستخدام الشخصي، والروحي، والتعليمي فقط. ولا يُسمح بنسخ، أو إعادة إنتاج، أو إعادة نشر، أو بيع، أو استغلال أي كتاب إلكتروني أو مادة تعليمية متوفرة على المنصة لأغراض تجارية دون الحصول على موافقة خطية صريحة ومسبقاً من إدارة المنصة.</p>

                  <h3>3. مسؤوليات المستخدم وتعهداته</h3>
                  <p>باستخدامك للمنصة، فإنك تتعهد وتلتزم بالآتي:</p>
                  <ul>
                    <li>أن تكون كافة البيانات المقدمة منك عند إنشاء حسابك دقيقة وصحيحة ومحدثة باستمرار.</li>
                    <li>أن تلتزم بالحفاظ على أمان حسابك الشخصي وكلمة المرور الخاصة بك.</li>
                    <li>أنك تتمتع بالأهلية القانونية للموافقة على هذه الشروط والامتثال التام لها.</li>
                    <li>عدم استخدام المنصة لأي أغراض غير قانونية أو تخالف القيم الإسلامية السامية والأنظمة الدولية.</li>
                  </ul>

                  <h3>4. الأنشطة المحظورة</h3>
                  <p>نحرص في منصة "العربي المسلم" على توفير بيئة إيمانية هادئة ونقية للجميع. بناءً على ذلك، يُحظر تماماً ارتكاب أي من الأنشطة التالية:</p>
                  <ul>
                    <li>نشر أو مشاركة أي محتوى مسيء، أو طائفي، أو سياسي، أو يثير الجدل والخلافات على ساحة المجتمع الإسلامي. لدينا سياسة صارمة وخالية من التسامح تجاه أي خطابات كراهية أو إساءة للآخرين.</li>
                    <li>محاولة قرصنة الموقع، أو تعطيل الخوادم، أو اختراق التدابير الأمنية المصممة لحماية بيانات المستخدمين ومحتويات المنصة.</li>
                    <li>استخدام أي برامج أو بوتات آلية (Bots/Scripts) للتلاعب بأعداد عداد التسبيح، أو تزييف الإحصائيات الروحية، أو حصد بيانات المنتجات الإسلامية والكتب إلكترونياً.</li>
                    <li>محاولة الحصول على الكتب الإلكترونية والمنتجات المدفوعة بطرق غير شرعية أو توزيعها بشكل ينتهك حقوق الملكية الفكرية.</li>
                  </ul>

                  <h3>5. تعديل وإنهاء الخدمة</h3>
                  <p>نحتفظ بالحق الكامل، وفقاً لتقديرنا الخاص ودون سابق إنذار أو مسؤولية قانونية، في إيقاف أو تقييد وصول أي مستخدم يخالف هذه الشروط والأحكام، أو يسيء استخدام حلقات التلاوة والحفظ، أو يضر بأمن وسلامة المجتمع الإسلامي للمنصة.</p>

                  <h3>6. إخلاء المسؤولية والتعديلات</h3>
                  <p>يتم تقديم كافة خدمات منصة "العربي المسلم" بما في ذلك مواقيت الصلاة، والتلاوات، وحسابات العدادات الإحصائية "كما هي" وحسب توفرها دون ضمانات مطلقة بخلوها تماماً من السهو أو الانقطاع التقني العارض. نسعى دائماً لتقديم أقصى درجات الدقة والكمال لخدمة كتاب الله وسنة رسوله ﷺ ومجتمعنا الحبيب.</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto 80px auto',
    padding: '0 20px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '32px',
    position: 'relative',
  },
  backBtn: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    fontSize: '0.85rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  title: {
    fontSize: '2rem',
    fontFamily: "'Playfair Display', serif",
    fontWeight: '700',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    maxWidth: '600px',
  },
  tabContainer: {
    display: 'flex',
    gap: '8px',
    padding: '6px',
    borderRadius: '12px',
    width: '100%',
    margin: '0 0 30px 0',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(212,175,55,0.12)',
  },
  tabBtn: {
    flexGrow: 1,
    border: 'none',
    borderRadius: '8px',
    padding: '10px 0',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  contentWrapper: {
    padding: '40px',
    borderRadius: '24px',
    background: 'rgba(11, 12, 16, 0.75)',
    border: '1px solid rgba(212, 175, 55, 0.1)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
  },
  textSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '6px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontFamily: "'Playfair Display', serif",
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  lastUpdated: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '16px',
    marginBottom: '10px',
  },
  legalBody: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    lineHeight: '1.7',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    textAlign: 'justify',
    fontFamily: 'inherit',
    '& h3': {
      color: 'var(--text-primary)',
      fontSize: '1.15rem',
      fontWeight: '600',
      marginTop: '16px',
    },
    '& ul': {
      paddingLeft: '20px',
      paddingRight: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }
  },
  adSenseNotice: {
    padding: '20px',
    borderRadius: '12px',
    background: 'rgba(212, 175, 55, 0.04)',
    border: '1px solid rgba(212, 175, 55, 0.15)',
    marginTop: '12px',
    marginBottom: '12px',
  },
  legalLink: {
    color: 'var(--text-gold)',
    textDecoration: 'none',
    fontWeight: '500',
    borderBottom: '1px dotted var(--text-gold)',
    paddingBottom: '1px',
    transition: 'var(--transition-fast)',
  }
};
