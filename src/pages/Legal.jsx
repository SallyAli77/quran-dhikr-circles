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
            ? "Please review our privacy policies and terms of service for the ArabicMuslim platform." 
            : "يرجى مراجعة سياسات الخصوصية وشروط الخدمة لمنصة البوابة العربية الإسلامية."}
        </p>
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer} className="glass-panel">
        <button 
          onClick={() => setActiveTab('privacy')}
          style={{
            ...styles.tabBtn,
            background: activeTab === 'privacy' ? 'var(--gold-gradient)' : 'transparent',
            color: activeTab === 'privacy' ? '#000' : 'var(--text-secondary)',
            fontWeight: activeTab === 'privacy' ? '600' : '400',
          }}
        >
          <Shield size={16} style={{ marginRight: '6px', marginLeft: '6px' }} />
          <span>{language === 'en' ? "Privacy Policy" : "سياسة الخصوصية"}</span>
        </button>
        <button 
          onClick={() => setActiveTab('terms')}
          style={{
            ...styles.tabBtn,
            background: activeTab === 'terms' ? 'var(--gold-gradient)' : 'transparent',
            color: activeTab === 'terms' ? '#000' : 'var(--text-secondary)',
            fontWeight: activeTab === 'terms' ? '600' : '400',
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
                  <p>Welcome to ArabicMuslim ("we," "our," "us"). We are highly committed to protecting your personal privacy and secure usage of our digital portal. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, including any other media form, media channel, or mobile website related or connected thereto.</p>
                  
                  <h3>2. Collection of Information</h3>
                  <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                  <ul>
                    <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and avatar selections that you voluntarily give to us when you register on our platform, participate in Dhikr circles, or post on our community reflections board.</li>
                    <li><strong>Usage Data:</strong> Technical information automatically collected by our servers, such as your IP address, browser type, operating system, access times, pages viewed, and other usage patterns inside the platform.</li>
                    <li><strong>Local Storage:</strong> To enrich your premium spiritual experience, we cache data (such as your personal Tasbih counts, saved bookmarks, and custom circles) locally on your device's browser using local storage.</li>
                  </ul>

                  <div style={styles.adSenseNotice} className="glass-panel">
                    <h3>⚠️ 3. Google AdSense & Third-Party Advertising Disclosures</h3>
                    <p>To support this free premium platform, we integrate Google AdSense to serve ads. Google requires publishers to make the following disclosures regarding data collection and tracking cookies:</p>
                    <ul>
                      <li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites.</li>
                      <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</li>
                      <li>Users may opt-out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={styles.legalLink}>Google Ads Settings <ExternalLink size={12} style={{ display: 'inline', marginLeft: '2px' }} /></a>. Alternatively, you can manage tracking consent using our integrated Google Certified Consent Management Platform (CMP).</li>
                    </ul>
                  </div>

                  <h3>4. How We Use Your Information</h3>
                  <p>Having accurate information about you allows us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                  <ul>
                    <li>Create and manage your user account, profile, and achievements.</li>
                    <li>Synchronize and display active collaborative Dhikr & Quran circles globally.</li>
                    <li>Process reflections, likes, and comment replies on the community reflection boards.</li>
                    <li>Deliver premium newsletters,spiritual insight posts, and platform updates.</li>
                    <li>Analyze usage trends and technical performance to optimize loading times.</li>
                  </ul>

                  <h3>5. Sharing of Information</h3>
                  <p>We do not sell, rent, or trade your personal information with third parties. We will only share collected data when required by law or to protect our absolute legal safety.</p>

                  <h3>6. Contact Us</h3>
                  <p>If you have any questions, comments, or concerns regarding this Privacy Policy, please feel free to reach out to us at: <strong>support@arabicmuslim.com</strong></p>
                </>
              ) : (
                <>
                  <h3>1. مقدمة تمهيدية</h3>
                  <p>مرحباً بكم في منصة البوابة العربية الإسلامية ("نحن" أو "بوابتنا"). نحن ملتزمون تماماً بحماية خصوصيتك الشخصية والاستخدام الآمن لخدماتنا الرقمية. توضح سياسة الخصوصية هذه كيفية جمع معلوماتك، واستخدامها، والكشف عنها، وحمايتها عند زيارتك لموقعنا الإلكتروني أو النطاقات المرتبطة به.</p>
                  
                  <h3>2. جمع المعلومات والبيانات</h3>
                  <p>قد نقوم بجمع معلومات عنك بطرق متنوعة ومحددة. تشمل المعلومات التي قد نجمعها على الموقع ما يلي:</p>
                  <ul>
                    <li><strong>البيانات الشخصية:</strong> معلومات الهوية الشخصية، مثل اسمك، وبريدك الإلكتروني، واختيارات الصور الرمزية (الآفاتار) التي تقدمها لنا طواعية عند التسجيل، أو المشاركة في حلقات الذكر، أو كتابة منشورات في لوحة خواطر مجتمعنا.</li>
                    <li><strong>بيانات الاستخدام:</strong> المعلومات التقنية التي تجمعها خوادمنا تلقائياً، مثل عنوان بروتوكول الإنترنت (IP)، ونوع المتصفح، ونظام التشغيل، وأوقات الدخول، والصفحات التي تم عرضها قبل أو بعد الوصول للموقع.</li>
                    <li><strong>التخزين المحلي (Local Storage):</strong> لإثراء تجربتك الروحية المتميزة، نقوم بحفظ البيانات مؤقتاً (مثل أعداد التسبيح الشخصية، الإشارات المرجعية المحفوظة، وحلقاتك الخاصة) محلياً على متصفح جهازك لتسهيل وصولك إليها لاحقاً.</li>
                  </ul>

                  <div style={styles.adSenseNotice} className="glass-panel">
                    <h3>⚠️ 3. إفصاحات جوجل أدسنس والإعلانات الخارجية</h3>
                    <p>لدعم استمرار هذه المنصة المتميزة مجاناً، نقوم بدمج إعلانات جوجل أدسنس (Google AdSense). وتطلب منا شركة جوجل تقديم الإفصاحات الصارمة التالية لزوارنا بشأن ملفات تعريف الارتباط والتتبع:</p>
                    <ul>
                      <li>تستخدم الجهات الخارجية، بما فيها جوجل، ملفات تعريف ارتباط لخدمة عرض الإعلانات بناءً على زياراتك السابقة لموقعنا أو مواقع الويب الأخرى على الإنترنت.</li>
                      <li>يساعد استخدام جوجل لملفات تعريف ارتباط الإعلانات شركاءها على عرض الإعلانات لزوارنا بناءً على زياراتهم لموقعنا و/أو المواقع الأخرى عبر شبكة الإنترنت.</li>
                      <li>يمكن للمستخدمين إلغاء تنشيط الإعلانات المخصصة عن طريق الانتقال إلى صفحة <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={styles.legalLink}>إعدادات إعلانات جوجل <ExternalLink size={12} style={{ display: 'inline', marginLeft: '2px' }} /></a>. كما يمكنك إدارة تفضيلات التتبع الخاصة بك عبر منصة إدارة الموافقة المعتمدة من جوجل (CMP) المتاحة في موقعنا.</li>
                    </ul>
                  </div>

                  <h3>4. كيفية استخدام معلوماتك</h3>
                  <p>يساعدنا جمع معلومات دقيقة عنك في تزويدك بتجربة سلسة ومخصصة وفعالة. بشكل خاص، قد نستخدم المعلومات التي نجمعها عبر الموقع للأغراض التالية:</p>
                  <ul>
                    <li>إنشاء وإدارة حساب المستخدم الشخصي الخاص بك وعرض إنجازاتك الروحية.</li>
                    <li>مزامنة وعرض حلقات الذكر والقرآن الجماعية التفاعلية بشكل مباشر عبر الخوادم.</li>
                    <li>معالجة المنشورات والتعليقات والتفاعلات على لوحة خواطر مجتمعنا الفاخرة.</li>
                    <li>إرسال الرسائل الإخبارية الروحية وتوصيات الكتب الدينية وتحديثات النظام الهامة.</li>
                    <li>تحليل اتجاهات الاستخدام وتحسين الأداء التقني لتقليل أوقات تحميل الصفحات.</li>
                  </ul>

                  <h3>5. مشاركة البيانات مع أطراف ثالثة</h3>
                  <p>نحن لا نبيع أو نؤجر أو نتاجر ببياناتك الشخصية مع أي أطراف ثالثة لأغراض تجارية. قد نكشف فقط عن المعلومات عند الضرورة القصوى قانونياً لحماية سلامتنا وامتثالاً للقوانين السارية.</p>

                  <h3>6. تواصل معنا</h3>
                  <p>إذا كان لديك أي أسئلة أو استفسارات تتعلق بسياسة الخصوصية هذه، يسعدنا تواصلك معنا عبر البريد الإلكتروني: <strong>support@arabicmuslim.com</strong></p>
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
                  <p>These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and ArabicMuslim ("we," "us," or "our"), concerning your access to and use of our platform.</p>
                  <p>By accessing the Site, you acknowledge that you have read, understood, and agreed to be bound by all of these Terms of Use. If you do not agree with all of these terms, then you are expressly prohibited from using the Site and must discontinue use immediately.</p>

                  <h3>2. Intellectual Property Rights</h3>
                  <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>
                  <p>The content is provided on the Site "AS IS" for your personal, spiritual, and educational use only. No part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.</p>

                  <h3>3. User Representations</h3>
                  <p>By using the Site, you represent and warrant that:</p>
                  <ul>
                    <li>All registration information you submit will be true, accurate, current, and complete.</li>
                    <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                    <li>You have the legal capacity and you agree to comply with these Terms of Use.</li>
                    <li>You will not use the Site for any illegal or unauthorized purpose, or violate any applicable local, national, or international laws.</li>
                  </ul>

                  <h3>4. Prohibited Activities</h3>
                  <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Prohibited activities include, but are not limited to:</p>
                  <ul>
                    <li>Posting offensive, disrespectful, or inappropriate content on the community reflection boards. We maintain a zero-tolerance policy for sectarian, political, or aggressive rhetoric.</li>
                    <li>Attempting to bypass any security measures of the platform designed to prevent or restrict access to the Site.</li>
                    <li>Interfering with, disrupting, or creating an undue burden on the Site or the networks connected to the Site.</li>
                    <li>Using automated systems, scripts, bots, or scrapers to harvest data or interact with our collaborative tasbih counters and Dhikr circles.</li>
                  </ul>

                  <h3>5. Termination</h3>
                  <p>We reserve the right, in our sole discretion and without notice or liability, to deny access to and use of the site (including blocking certain IP addresses), to anyone for any reason or for no reason, including without limitation for breach of any representation, warranty, or covenant contained in these terms of use or of any applicable law or regulation.</p>

                  <h3>6. Disclaimer of Warranties</h3>
                  <p>The site is provided on an AS-IS and AS-AVAILABLE basis. You agree that your use of the site and our services will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection with the site and your use thereof, including, without limitation, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
                </>
              ) : (
                <>
                  <h3>1. الموافقة على الشروط الأحكام</h3>
                  <p>تمثل شروط الاستخدام هذه اتفاقية ملزمة قانوناً مبرمة بينك، سواء بصفتك الشخصية أو نيابة عن كيان ("أنت")، وبين منصة البوابة العربية الإسلامية ("نحن" أو "بوابتنا")، فيما يتعلق بزيارتك واستخدامك لمنصتنا وتطبيقاتها.</p>
                  <p>من خلال وصولك إلى الموقع، فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بجميع شروط الاستخدام هذه. إذا كنت لا توافق على كل أو جزء من هذه الشروط، فإنك ممنوع صراحة من استخدام الموقع ويجب عليك التوقف عن استخدامه فوراً.</p>

                  <h3>2. حقوق الملكية الفكرية</h3>
                  <p>ما لم يُذكر خلاف ذلك، فإن الموقع ومحتوياته ملكية خاصة بنا، بما في ذلك الأكواد البرمجية، وقواعد البيانات، والوظائف، والتصميمات، والمحتوى النصي، والصور، والرسومات، والكتب المتاحة (يشار إليها مجتمعة بـ "المحتوى")، والعلامات التجارية والشعارات الواردة فيه، وهي محمية بموجب قوانين حقوق النشر وحقوق الملكية الفكرية.</p>
                  <p>يتم تقديم المحتوى على الموقع "كما هو" لاستخدامك الشخصي والروحي والتعليمي فقط. ولا يجوز نسخ أي جزء من الموقع أو إعادة إنتاجه أو توزيعه أو بيعه أو ترخيصه أو استغلاله لأي أغراض تجارية على الإطلاق دون الحصول على إذن كتابي صريح ومسبق منا.</p>

                  <h3>3. إقرارات وتعهدات المستخدم</h3>
                  <p>باستخدامك للموقع، فإنك تقر وتتعهد بما يلي:</p>
                  <ul>
                    <li>أن جميع معلومات التسجيل التي تقدمها صحيحة ودقيقة وحديثة وكاملة.</li>
                    <li>أنك ستحافظ على دقة هذه المعلومات وتحديثها على الفور عند الضرورة.</li>
                    <li>أنك تتمتع بالأهلية القانونية وتوافق على الامتثال لشروط الاستخدام الحالية.</li>
                    <li>أنك لن تستخدم الموقع لأي غرض غير قانوني أو غير مصرح به، ولن تنتهك أي قوانين محلية أو دولية سارية.</li>
                  </ul>

                  <h3>4. الأنشطة المحظورة والمقيدة</h3>
                  <p>لا يجوز لك استخدام الموقع لأي غرض آخر غير الذي نوفره من أجله. وتتضمن الأنشطة المحظورة على سبيل المثال لا الحصر:</p>
                  <ul>
                    <li>كتابة منشورات مسيئة، طائفية، سياسية، أو غير محترمة في لوحة خواطر مجتمعنا. نتبع سياسة صارمة وخالية من التسامح تجاه أي محتوى يثير الضغائن أو يخالف الأخلاق الإسلامية السامية.</li>
                    <li>محاولة تجاوز أو تعطيل أي تدابير أمنية للمنصة مصممة لمنع أو تقييد الوصول إلى خوادم الموقع.</li>
                    <li>التعطيل أو التسبب في عبء غير مبرر على الموقع أو الخوادم أو الشبكات المتصلة بنا.</li>
                    <li>استخدام الأنظمة الآلية، أو البوتات، أو برامج الاستخلاص لجمع البيانات أو التلاعب بأعداد العداد التفاعلي وحلقات الذكر.</li>
                  </ul>

                  <h3>5. إنهاء الخدمة وإغلاق الحسابات</h3>
                  <p>نحتفظ بحقنا المطلق، دون إشعار أو مسؤولية قانونية، في منع أي شخص من الوصول إلى الموقع أو استخدام خدماته (بما في ذلك حظر عناوين IP معينة)، لأي سبب كان، بما في ذلك على سبيل المثال لا الحصر انتهاك شروط الاستخدام أو الإضرار بسلامة المجتمع الرقمي.</p>

                  <h3>6. إخلاء المسؤولية القانونية</h3>
                  <p>يتم تقديم هذا الموقع والخدمات المرتبطة به على أساس "كما هو" و"حسب توفره". وتوافق على أن استخدامك للموقع وخدماتنا يكون على مسؤوليتك الشخصية والخاصة. نخلي مسؤوليتنا إلى أقصى حد يسمح به القانون من جميع الضمانات الصريحة أو الضمنية المتعلقة بالخدمة ودقتها وخلوها من الأخطاء التقنية.</p>
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
    maxWidth: '360px',
    margin: '0 auto 30px auto',
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
