import React, { createContext, useState, useEffect, useContext } from 'react';
import confetti from 'canvas-confetti';

const AppContext = createContext();

// Beautiful pre-seeded mock bots representing active community members
export const mockBots = [
  { name: "فاطمة حسن", avatar: "🧕", email: "fatima@arabicmuslim.com", role: "Certified Teacher", level: "Gold" },
  { name: "أحمد سليم", avatar: "👳", email: "ahmed@arabicmuslim.com", role: "Certified Teacher", level: "Bronze" },
  { name: "عمر فاروق", avatar: "🧔", email: "omar@arabicmuslim.com", role: "Premium Member" },
  { name: "أمينة يوسف", avatar: "🧕", email: "amina@arabicmuslim.com", role: "Premium Member" },
  { name: "يوسف القرشي", avatar: "👳", email: "yusuf@arabicmuslim.com", role: "Certified Teacher", level: "Platinum" },
  { name: "سارة علي", avatar: "🧕", email: "sara@arabicmuslim.com", role: "Premium Member" },
  { name: "بلال خان", avatar: "🧔", email: "bilal@arabicmuslim.com", role: "Premium Member" },
  { name: "زينب أحمد", avatar: "🧕", email: "zainab@arabicmuslim.com", role: "Premium Member" },
  { name: "حمزة مالك", avatar: "👳", email: "hamza@arabicmuslim.com", role: "Premium Member" },
  { name: "ليلى حسين", avatar: "🧕", email: "layla@arabicmuslim.com", role: "Premium Member" }
];

// Seeded articles templates to procedurally build 120 unique articles
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
    summaryAr: "فضائل ذكر الله وأثرها العظيم في طمأنينة النفس ورضا الرحمن.",
    content: [
      "Assalamu Alaikum dear reader. In the hustle and bustle of modern life, our minds are bombarded with endless notifications, stress, and noise.",
      "Allah says in the Noble Quran: 'O you who have believed, remember Allah with much remembrance. And exalt Him morning and afternoon.' (Surah Al-Ahzab 33:41-42).",
      "Morning Dhikr (remembrance) acts as an essential faith shield, protecting the heart from the whispers of distraction and worldly worry.",
      "Historically, the Prophet Muhammad (peace be upon him) and his companions never left the morning and evening supplications, prioritizing them after Fajr.",
      "From a psychological perspective, beginning the day with terms of gratitude ('Alhamdulillah') and praise ('Subhan Allah') resets the amygdala.",
      "This simple act lowers cortical stress indicators in the human body, grounding you in a state of high spiritual mindfulness.",
      "It equips you with pristine patience and mental clarity to handle whatever difficult challenges the day presents at work or home.",
      "To cultivate this habit, dedicate just 10 to 15 minutes after the Fajr prayer to sit in silence, count your Tasbih, and reflect.",
      "Sit facing the Qiblah, take slow, deep breaths, and let the spiritual reassurance of the divine remembrance enter your chest completely.",
      "You will observe an immediate improvement in your daily patience, emotional resilience, focus, and overall spiritual satisfaction.",
      "Furthermore, Dhikr helps to remind us of our true purpose in this temporary life, detaching our hearts from material greed.",
      "It creates a strong spiritual connection with our Creator, making all other daily duties feel lighter and more full of blessing.",
      "By practicing mindfulness through morning supplications, you invite peace and barakah into your home and daily endeavors.",
      "Studies in neuroscience show that continuous positive gratitude practice alters neural pathways, strengthening mental focus and emotional control.",
      "Islam encourages us to keep our tongues moist with the praise of Allah, turning our mundane habits into rewarded acts of devotion.",
      "Every single Tasbih, Tahmid, and Takbir we utter puts a seed of tranquility into our hearts and records high deeds in our scales.",
      "Let us commit to this morning ritual consistently, making it a non-negotiable part of our daily spiritual hygiene routine.",
      "Encourage your children and family members to sit together even for a few minutes to share in these morning blessings.",
      "May Allah grant us all continuous steadfastness in our remembrance, accept our good intentions, and purify our hearts from showing off.",
      "May this beautiful practice illuminate your path, grant you deep wisdom, and guide you to spiritual excellence in both worlds.",
      "Assalamu Alaikum wa Rahmatullah wa Barakatuh."
    ].join("\n\n"),
    contentAr: [
      "السلام عليكم ورحمة الله وبركاته. في صخب الحياة المعاصرة وتراكم أعبائها، تتعرض عقولنا لقصف مستمر من التنبيهات والضغوط والضوضاء المشتتة للذهن.",
      "يقول الله سبحانه وتعالى في محكم التنزيل: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا * وَسَبِّحُوهُ بُكْرَةً وَأَصِيلًا' (الأحزاب: 41-42).",
      "تمثل أذكار الصباح حصناً إيمانياً متيناً ودروعاً واقية تقي قلب المؤمن من وساوس القلق وتكالب شواغل الحياة المادية اليومية.",
      "تاريخياً، لم يترك النبي محمد صلى الله عليه وسلم وأصحابه الكرام أذكار الصباح والمساء أبداً، بل جعلوها أساساً لبناء قوتهم النفسية والروحية.",
      "من منظور علم النفس والعلوم العصبية الحديثة، فإن بدء اليوم بعبارات الامتنان والحمد والثناء يعيد ضبط مراكز التوتر في الدماغ البشري.",
      "هذا التثبيت الذهني المبكر يقلل من هرمونات القلق، مما يمنحك سكينة داخلية عميقة وصبراً جميلاً لمواجهة عقبات وتحديات اليوم برضا وانشراح.",
      "لتنمية هذه العادة الإيمانية المباركة في حياتك، خصص 10 إلى 15 دقيقة فقط بعد صلاة الفجر للجلوس في هدوء وسكينة تامة.",
      "اجلس مستقبلاً القبلة، وتنفس بعمق، واستشعر عظمة الخالق العظيم وراقبه بقلبك، ودع النور الإلهي يملأ صدرك ويطرد كل هم وضيق.",
      "المداومة المستمرة على الأذكار تصنع فارقاً مهيباً في قوة تركيزك، ومرونتك النفسية، وقدرتك على اتخاذ القرارات الحكيمة في عملك وعلاقاتك.",
      "إن الذكر يذكرنا دوماً بالغاية الحقيقية من وجودنا في هذه الدنيا الفانية، ويحرر قلوبنا من التعلق المفرط بالماديات الزائلة والمقلقة.",
      "وهو يبني جسراً وثيقاً من الصلة الدائمة بالخالق، مما يجعل التكاليف اليومية والعبادات الأخرى تبدو خفيفة، ميسرة، ومليئة بالبركة واليسر.",
      "عندما تبدأ يومك بالذكر الصادق، فإنك تدعو البركة والسكينة لدخول بيتك وعملك وتوفيق خطاك في كل ما تسعى إليه من أمور نافعة.",
      "تؤكد الأبحاث العلمية أن التدريب اليومي على الحمد والثناء يغير المسارات العصبية في الدماغ، مما يعزز الاستقرار النفسي والصحة العامة.",
      "وقد وجهنا الإسلام الحنيف لإبقاء ألسنتنا رطبة بذكر الله، محولاً بذلك العادات اليومية العادية إلى عبادات عظيمة الأجر والثواب.",
      "كل تسبيحة، وتحميدة، وتكبيرة تنطق بها بصدق تغرس شجرة من السكينة في قلبك، وتثقل ميزان حسناتك وتدخر لك نعيماً يوم لقاء الله.",
      "فلنحرص سوياً على جعل هذا الورد الصباحي جزءاً أساسياً لا يتجزأ من روتيننا اليومي لتعزيز صحتنا الإيمانية والنفسية والروحية بانتظام.",
      "وشجع أفراد عائلتك وأبنائك على الجلوس معاً ولو لدقائق معدودة لمشاركتك هذه بركات وأنوار الصباح العظيمة لتسود الألفة والرحمة بين الجميع.",
      "نسأل الله العلي القدير أن يرزقنا وإياكم قلباً خاشعاً، ولساناً ذاكراً، وعملاً صالحاً متقبلاً، وأن يطهر سرائرنا من الرياء والعجب.",
      "وأن يجعل هذا العمل خالصاً لوجهه الكريم، وسبباً في نيل مرضاته ورفعة الدرجات في جنات النعيم يوم نلقاه بقلب سليم معافى.",
      "عطروا قلوبكم بذكر الله دوماً، وكونوا من الذاكرين الله كثيراً والذاكرات الذين أعد الله لهم مغفرة وأجراً عظيماً ودرجات رفيعة.",
      "والسلام عليكم ورحمة الله وبركاته."
    ].join("\n\n")
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
    content: [
      "Assalamu Alaikum dear reader. To the untrained eye, classical Arabic seems like an intimidating language with infinite vocabulary.",
      "However, Arabic is one of the most mathematically structured languages in existence, built entirely on a three-letter root system.",
      "This system (known as the 'Thulathi' root) forms the building blocks of almost all Arabic verbs, nouns, and adjectives.",
      "Every word derived from a core root carries a primary semantic concept that ties its diverse meanings together.",
      "For instance, the root 'K-T-B' (ك-ت-ب) carries the fundamental concept of writing: Kataba means 'He wrote', and Kitab means 'Book'.",
      "From the same root, we also derive Katib (Writer), Maktab (Office or Desk), and Maktabah (Library or Bookstore).",
      "If you master just 100 high-frequency roots that repeat throughout the Noble Quran, you will instantly comprehend over 70% of the text.",
      "This mathematical nature makes learning classical Arabic extremely systematic and highly satisfying for dedication-focused students.",
      "When studying, we highly recommend using premium bilingual books to observe how roots shift dynamically in cultural short stories.",
      "Bilingual stories provide a natural bridge to understanding rich syntax, parallel grammar, and subtle semantic changes organically.",
      "Start small: learn 3 roots a week, look them up in different Surahs, and witness your Quranic comprehension soar!",
      "Additionally, pay close attention to the verb forms (Wazn) which modify the root meaning in standardized, predictable ways.",
      "Understanding these forms acts as a powerful leverage, multiplying your vocabulary capacity ten-fold without extra memorization.",
      "Islam encourages us to study the language of the Quran to deeply comprehend the nuances of the divine revelations.",
      "Every hour you spend studying Arabic is considered a highly rewarded act of worship and intellectual growth.",
      "Commit to practicing writing roots by hand, as tactile engagement reinforces memory retention significantly.",
      "Try to trace root patterns in your daily recitation, turning your spiritual reading into an active learning session.",
      "Share your root-learning insights with fellow students in your study circles to build collective knowledge.",
      "Be patient with your learning curve; mastery of a sacred language is a beautiful lifetime journey of spiritual elevation.",
      "May Allah bless your studies, grant you perfect comprehension, and make the Quran a source of light in your life.",
      "Assalamu Alaikum wa Rahmatullah wa Barakatuh."
    ].join("\n\n"),
    contentAr: [
      "قد تبدو العربية الكلاسيكية للوهلة الأولى لغة معقدة ذات مفردات لا حصر لها ونظام قواعد متشعب يصعب الإحاطة به.",
      "ومع ذلك، فإن العربية واحدة من أكثر لغات العالم تنظيماً هندسياً ورياضياً، حيث بنيت بالكامل على نظام الجذور ثلاثية الأحرف.",
      "هذا نظام الاشتقاقي الفريد يمثل الحجر الأساس لبناء جميع الأفعال، والأسماء، والصفات، والمصادر اللغوية البليغة.",
      "كل كلمة مشتقة من جذر أساسي معين تحمل في طياتها المفهوم الدلالي الرئيسي الذي يربط جميع تفرعاتها ببعضها.",
      "على سبيل المثال، الجذر ثلاثي الأحرف (ك-ت-ب) يحمل المفهوم الأساسي للكتابة: كَتَبَ (فعل)، وكِتَاب (اسم).",
      "ومن نفس هذا الجذر البسيط نشتق أيضاً: كَاتِب (اسم فاعل)، ومَكْتَب (اسم مكان)، ومَكْتَبَة (دار الكتب والمعرفة).",
      "إذا تمكنت من إتقان 100 جذر فقط من الجذور الأكثر تكراراً في القرآن الكريم، فستفهم على الفور أكثر من 70% من الآيات الشريفة.",
      "هذه الميزة الفريدة تجعل دراسة لغة القرآن عملاً منهجياً، جذاباً، ومهيباً للغاية لكل طالب معرفة مخلص وصادق النية.",
      "ونحن نوصي بشدة باستخدام الكتب ثنائية اللغة الموضحة في صفحتنا الرئيسية لملاحظة كيفية تغير ودلالة الجذور في السياق.",
      "توفر هذه القصص المتوازية جسراً ذهنياً وبصرياً ممتازاً لمقارنة التراكيب النحوية واللغوية دون مشقة أو تشتت.",
      "ابدأ بخطوات بسيطة وثابتة: تعلم 3 جذور فقط كل أسبوع، وتأمل حضورها وتصريفاتها في السور والآيات المختلفة.",
      "احرص أيضاً على دراسة أوزان الأفعال المختلفة، فهي تساعدك على تخمين معاني آلاف الكلمات الجديدة بذكاء وسرعة.",
      "إن دراسة لغة القرآن الكريم عبادة عظيمة نتقرب بها إلى الله لفهم أسرار خطابه الحكيم ورسائل هدايته للبشرية.",
      "كل دقيقة تقضيها في فهم قواعد وإعراب ومفردات لغة الضاد تثري عقلك وتزيد من خشوعك وتدبرك أثناء الصلاة والتلاوة.",
      "لا تستعجل النتائج، واستمتع برحلة التعلم والارتقاء الفكري واللغوي، واعلم أن المحاولة المستمرة هي عين النجاح.",
      "اكتب الجذور بيدك وكرر نطقها بصوت مسموع لتدريب جهازك الصوتي وتثبيت شكل وجوهر الكلمة في ذاكرتك طويلة المدى.",
      "شارك ما تتعلمه من لطائف لغوية مع إخوانك في الحلقات المباشرة لتشجيعهم ونشر الشغف بالعربية الفصحى البديعة.",
      "إن إتقان لغة الوحي شرف عظيم ومفتاح لا غنى عنه للغوص في بحار التفسير والعلوم الإسلامية العريقة بأمان.",
      "نسأل الله تعالى أن ييسر لكم سبل التعلم، ويفتح لكم أبواب الفهم، ويرزقكم فصاحة اللسان ونور البصيرة والقلب.",
      "استمروا في السعي، وتوكلوا على الله، واجعلوا نيتكم خالصة لخدمة دينه ولغته الشريفة المباركة لتنالوا التوفيق.",
      "والسلام عليكم ورحمة الله وبركاته."
    ].join("\n\n")
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
    summaryAr: "الكشف عن الدروس المستفادة للقصص الأربعة من سورة الكهف الشريفة وحكمة قراءتها كل جمعة.",
    content: [
      "Assalamu Alaikum dear reader. Reading Surah Al-Kahf on Fridays is a beloved sunnah that illuminates a divine light for the reader until the next Friday.",
      "But why this specific Surah, and what are the deep wisdoms embedded within its verses that protect us from life's greatest trials?",
      "Surah Al-Kahf contains four major narratives, each answering a critical, foundational trial of human existence on earth:",
      "1. The Companions of the Cave: This story represents the trial of faith (Deen) and how to protect it during persecution.",
      "2. The Owner of the Two Gardens: This story represents the trial of wealth (Mal) and the danger of arrogance and materialism.",
      "3. Musa and Al-Khidr: This story represents the trial of knowledge ('Ilm) and the importance of humility before divine wisdom.",
      "4. Dhul-Qarnayn: This story represents the trial of power (Sultan) and how justice, humility, and faith should guide leadership.",
      "By studying these four distinct stories, a believer learns that the ultimate refuge from all worldly trials is to seek shelter in the cave of faith.",
      "This cave represents sincere devotion to Allah, seeking companionship with righteous individuals, and always returning to the divine guidance.",
      "Furthermore, the Surah serves as a powerful shield against the greatest fitnah (trial) that humanity will face: the trial of the Dajjal (Antichrist).",
      "The Prophet Muhammad (peace be upon him) instructed us to memorize and recite the first and last ten verses of this Surah for protection.",
      "Each Friday, as we read these verses, we are reminded to check our intentions, evaluate our wealth, humble our knowledge, and use our influence for good.",
      "It is a weekly spiritual reset that clears away the accumulated rust of worldly attachments from our hearts, bringing pristine serenity.",
      "To cultivate this Friday habit, schedule a quiet time in the morning or afternoon, sit in a peaceful corner, and read with translation.",
      "Take time to ponder on the meanings, share the lessons with your family, and apply the ethics of patience and humility in your actions.",
      "May Allah accept our Friday recitations, illuminate our paths with His divine light, and keep us safe from all internal and external trials.",
      "May this beautiful Surah be a source of constant comfort, blessing, and spiritual elevation in your life and household.",
      "Assalamu Alaikum wa Rahmatullah wa Barakatuh."
    ].join("\n\n"),
    contentAr: [
      "السلام عليكم ورحمة الله وبركاته يا قارئ كتاب الله. إن قراءة سورة الكهف يوم الجمعة هي سنة نبوية مباركة تضيء للمؤمن نوراً ما بين الجمعتين.",
      "ولكن ما سر هذه السورة العظيمة، وما هي الحكم العميقة المودعة في آياتها الشريفة التي تقينا من أكبر فتن الدنيا المظلمة؟",
      "تحتوي سورة الكهف على أربع قصص رئيسية، كل واحدة منها تعالج فتنة من الفتن الكبرى التي يواجهها الإنسان في حياته على الأرض:",
      "أولاً: قصة أصحاب الكهف، وتمثل فتنة الدين وكيفية الفرار بالدين وحفظ العقيدة الصحيحة في بيئة معادية وظالمة.",
      "ثانياً: قصة صاحب الجنتين، وتمثل فتنة المال والولد وخطر الكبر والغرور والمادية الزائلة والتعلق بزينة الحياة الدنيا.",
      "ثالثاً: قصة موسى والخضر عليهما السلام، وتمثل فتنة العلم وكيفية التواضع لمعلمينا واستحضار الحكمة الإلهية الخفية في أقدار الله.",
      "رابعاً: قصة ذي القرنين، وتمثل فتنة السلطة والقوة وكيفية توظيف النفوذ والتمكين في الأرض لإقامة العدل ونشر الخير وحماية الضعفاء.",
      "من خلال تدبر هذه القصص الأربع المتنوعة، يدرك المؤمن أن الملاذ الآمن والملجأ الحقيقي من كل الفتن هو اللجوء إلى 'كهف الإيمان والتقوى'.",
      "هذا الكهف الروحي هو الإخلاص التام لله، والالتفاف حول الصحبة الصالحة التي تعينك على الحق، والاعتصام بالوحي الإلهي الشريف.",
      "علاوة على ذلك، تعد سورة الكهف درعاً واقياً من أعظم فتنة ستشهدها البشرية منذ خلق آدم وحتى قيام الساعة، وهي فتنة المسيح الدجال.",
      "وقد وجهنا نبينا الكريم صلى الله عليه وسلم لحفظ وتلاوة العشر الآيات الأولى والأواخر من سورة الكهف لنيل هذا الحفظ والوقاية الإلهية.",
      "فكل يوم جمعة، نجدد قراءة هذه الآيات لنراجع نياتنا، ونزن أموالنا بميزان الآخرة، ونتواضع في علمنا، ونعدل في نفوذنا وسلطاننا.",
      "إنها محطة تصفية روحية أسبوعية تزيل عن قلوبنا صدأ التعلق بالدنيا، وتمنح نفوسنا سكينة وطمأنينة فائقة لا توصف.",
      "لذا، احرص على تخصيص وقت هادئ في صباح الجمعة أو بعد العصر لقراءة السورة بتدبر وخشوع مع الاطلاع على تفسيرها المبسط.",
      "وتدارس دروسها مع أهل بيتك وأبنائك لتسود قيم الصبر والعدل والتواضع والإيمان الصادق في أرجاء منزلك ومعاملاتك اليومية.",
      "نسأل الله تعالى أن يتقبل منا تلاوتنا، وينير دروبنا بنور هدايته، ويحفظنا ويحفظ أهلينا من الفتن ما ظهر منها وما بطن.",
      "وأن يجعل هذا القرآن العظيم ربيع قلوبنا، وجلاء أحزاننا، وذهاب همومنا، ونوراً يضيء حياتنا وآخرتنا بفضله وكرمه العميم.",
      "والسلام عليكم ورحمة الله وبركاته."
    ].join("\n\n")
  }
];

const titlesTemplate = [
  {
    en: "Understanding the Concept of Ihsan (Excellence)",
    ar: "فهم مفهوم الإحسان والوصول لمرتبة كمال العبادة",
    contentEn: [
      "Assalamu Alaikum dear seeker of wisdom. Today we explore Ihsan, the third and highest level of our beautiful religion.",
      "In the famous Hadith of Jibril, the Prophet Muhammad (peace be upon him) defined Ihsan as: 'To worship Allah as if you see Him, and if you do not see Him, know that He sees you.'",
      "This simple yet profound statement forms the basis of all spiritual excellence in Islam.",
      "It represents a state of complete mindfulness, where a believer is constantly aware of the Divine presence in every action, word, and thought.",
      "Scholars have divided Ihsan into two levels of spiritual awareness: the level of witnessing and the level of observation.",
      "The level of witnessing (Mushahadah) is when the heart is so filled with love and recognition of Allah that it is as if the believer sees Him directly.",
      "The level of observation (Muraqabah) is when the believer is constantly conscious that Allah is watching them, even if they cannot see Him.",
      "Living with Ihsan transforms ordinary, daily habits into elevated acts of worship and spiritual connection.",
      "Whether you are working, studying, speaking with family, or standing in prayer, performing your duties with excellence is a manifestation of Ihsan.",
      "Allah says in the Noble Quran: 'Indeed, Allah loves the doers of good (Al-Muhsinin).' (Surah Al-Baqarah 2:195).",
      "Here are five practical ways to cultivate Ihsan in your daily life:",
      "First: Focus entirely on your prayer (Khushu'), leaving all worldly worries outside the prayer mat and concentrating on the words.",
      "Second: Treat all people, animals, and creation with extreme kindness, gentleness, and respect, looking past their shortcomings.",
      "Third: Perform your professional or educational work to the absolute best of your ability, avoiding shortcutting and laziness.",
      "Fourth: Routinely spend time in quiet reflection (Tafakkur) and remembrance (Dhikr) to polish the mirror of your heart.",
      "Fifth: Purify your intentions (Niyyah) before starting any deed, ensuring it is done solely for the sake of the Creator.",
      "By striving for excellence, you raise your self-awareness, improve your relationship with others, and find a deep, lasting inner peace.",
      "True spiritual satisfaction comes not from doing the bare minimum, but from pouring your heart and soul into every virtuous action.",
      "Let us pray that the Almighty grants us the capability to worship Him with complete sincerity and attain the rank of the Muhsinin.",
      "May Allah bless your spiritual journey and fill your life with light, peace, guidance, and continuous success.",
      "Assalamu Alaikum wa Rahmatullah wa Barakatuh."
    ].join("\n\n"),
    contentAr: [
      "السلام عليكم ورحمة الله وبركاته يا طالب الحكمة ونور الإيمان. نتناول اليوم مرتبة الإحسان، وهي المرتبة الثالثة والأعلى في ديننا الحنيف.",
      "في حديث جبريل الشهير، عرّف النبي صلى الله عليه وسلم الإحسان بقوله: 'أن تعبد الله كأنك تراه، فإن لم تكن تراه فإنه يراك'.",
      "هذا التعريف النبوي البليغ يمثل قمة الارتقاء الروحي والسلوكي للمسلم في حياته اليومية ومعاملاته.",
      "فهو يمثل حالة اليقظة الكاملة للقلب البشري، حيث يستشعر المؤمن رقابة الخالق العظيم في كل حركة وسكون، وفي السر والعلن.",
      "وقد قسّم العلماء الإحسان إلى مرتبتين جليلتين: مرتبة المشاهدة ومرتبة المراقبة.",
      "مرتبة المشاهدة هي أن يمتلئ قلب العبد بحب الله وتعظيمه حتى كأنه يرى خالقه رأي العين بقلبه وبصيرته.",
      "أما مرتبة المراقبة، فهي استحضار المؤمن لرقابة الله تعالى واطلاعه عليه في كل حين، مما يورث الحياء والتعظيم لله.",
      "إن تفعيل مفهوم الإحسان يحول العادات اليومية البسيطة والمهام العادية إلى عبادات جليلة وقربات يثاب عليها المؤمن.",
      "سواء كنت تعمل في مهنتك، أو تدرس للامتحان، أو تتحدث مع أهلك، أو تؤدي صلاتك، فإن إتقان العمل هو جوهر الإحسان.",
      "يقول الله سبحانه وتعالى في كتابه الكريم: 'وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ' (البقرة: 195).",
      "وهنا نلخص لكم خمسة إرشادات عملية لتنمية خلق الإحسان والارتقاء به في حياتكم اليومية بنجاح:",
      "أولاً: الخشوع التام في الصلاة، وترك شواغل الدنيا خلف ظهرك بمجرد التكبير والتركيز في معاني الآيات التي تتلوها.",
      "ثانياً: معاملة الخلق جميعاً باللطف والرحمة واللين، وتجنب الفظاظة والغلظة مع الأهل والأصدقاء وسائر الناس.",
      "ثالثاً: إتقان العمل المهني والدراسي وبذل الجهد الكامل فيه دون غش أو تقصير، مستشعرين أمانة المسؤولية.",
      "رابعاً: تخصيص وقت يومي للتفكر والتدبر في ملكوت الله، لتصفية الذهن وجلاء صدأ القلوب وزيادة اليقين.",
      "خامساً: تجديد النية الصالحة قبل البدء بأي قول أو عمل، والتأكد من خلوص المقاصد لله رب العالمين وحده.",
      "إن السعي المستمر للإحسان يرتقي بوعيك الذاتي، ويحسن علاقاتك الاجتماعية، ويمنحك طمأنينة وسكينة نفسية لا تقدر بثمن.",
      "فالرضا النفسي الحقيقي لا يتحقق بأداء الحد الأدنى من الواجبات، بل بالسعي الحثيث للإتقان وبذل الجميل لوجه الله.",
      "نسأل الله العلي القدير أن يرزقنا وإياكم قلباً خاشعاً منيباً، وأن يجعلنا من المحسنين الذين يعبدونه بصدق وإخلاص.",
      "وأن يبارك في أوقاتكم وجهودهم، وينير دروبكم بنور الهداية والإيمان ويوفقكم لما يحبه ويرضاه في الدارين.",
      "والسلام عليكم ورحمة الله وبركاته."
    ].join("\n\n")
  },
  {
    en: "Lessons of Sabr (Patience) in Times of Trials",
    ar: "دروس الصبر الجميل في مواجهة الابتلاءات والخطوب",
    contentEn: [
      "Assalamu Alaikum dear seeker. Today we discuss the station of Sabr (Patience), which is half of faith.",
      "In this worldly life, trials and difficulties are inevitable aspects of our spiritual test.",
      "Allah says in the Quran: 'And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient.' (Surah Al-Baqarah 2:155).",
      "Sabr is not a state of passive weakness or complaining; rather, it is active, resilient steadfastness of the heart.",
      "It means controlling your tongue from complaining, your heart from anger, and your limbs from despair during hardship.",
      "The prophets of Islam showed the ultimate examples of Sabr. Prophet Yaqub (Jacob) lost his beloved sons and said: 'So patience is most fitting (Sabrun Jamil).'",
      "Prophet Ayyub (Job) suffered from severe sickness and loss of wealth for years, yet his tongue remained full of gratitude.",
      "From a modern psychological view, Sabr builds high emotional intelligence, mental grit, and cognitive flexibility.",
      "It allows you to respond to life's chaos with measured calm instead of immediate stress reactions.",
      "Every trial you face with Sabr is an opportunity for your sins to be forgiven and your spiritual ranks to be elevated.",
      "Here are five practical recommendations to master Sabr during difficult trials in life:",
      "First: Remind yourself that this life is temporary, and that every difficulty has an ultimate, positive spiritual purpose.",
      "Second: Supplicate (Dua) with the Quranic prayer: 'Our Lord, pour upon us patience and plant our feet firmly.'",
      "Third: Focus your energy on what you can control, and leave the outcome entirely to the wisdom of Allah.",
      "Fourth: Seek comfort in prayer (Salah), as Allah instructs: 'Seek help through patience and prayer.'",
      "Fifth: Connect with positive, supportive friends and teachers who remind you of hope and encourage your endurance.",
      "Consistency in practicing Sabr will completely transform your reaction to loss, delay, and daily frustrations.",
      "It turns trials into direct pathways of spiritual growth, drawing you closer to the Creator in absolute dependency.",
      "We pray that Allah pours abundant patience into our hearts, keeps us steadfast, and accepts our struggles.",
      "May this study guide serve as a source of strength, guiding you through the dark trials of life to a bright success.",
      "Assalamu Alaikum wa Rahmatullah wa Barakatuh."
    ].join("\n\n"),
    contentAr: [
      "السلام عليكم ورحمة الله وبركاته. نتناول اليوم منزلة الصبر، وهو الذي وصفه العلماء بنصف الإيمان والضياء المنير.",
      "إن الابتلاءات والمحن في هذه الحياة الدنيا هي سنن إلهية ثابتة لتمحيص القلوب وتثبيت الإيمان.",
      "يقول الله تعالى: 'وَلَنَبْلُوَنَّكُمْ بِشَيْءٍ مِنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِنَ الْأَمْوَالِ وَالْأَنْفُسِ وَالثَّمَرَاتِ وَبَشِّرِ الصَّابِرِينَ' (البقرة: 155).",
      "والصبر ليس استسلاماً عاجزاً أو شكوى مستمرة، بل هو صمود إيجابي متين، وتماسك نفسي واعٍ.",
      "وهو حبس النفس عن الجزع والخطأ، وحبس اللسان عن التشكي والسخط، وحبس الجوارح عن اليأس.",
      "وقد ضرب أنبياء الله الكرام أروع الأمثلة في الصبر الجميل؛ فهذا يعقوب عليه السلام يفقد أحب أبنائه ويقول: 'فَصَبْرٌ جَمِيلٌ'.",
      "وهذا أيوب عليه السلام يبتلى بالمرض العضال وفقد الأهل والمال لسنوات طوال، فما فتر لسانه عن الحمد والثناء.",
      "من منظور علم النفس الحديث، يبني الصبر مرونة نفسية فائقة وذكاءً عاطفياً يعينك على إدارة ضغوط الحياة المتراكمة.",
      "فهو يمنحك مهلة عقلية للتفكير بحكمة واتخاذ القرارات السليمة بهدوء تام بدلاً من التفاعل المتسرع والمدمر.",
      "إن كل ابتلاء تصبر عليه بصدق ورضا هو سبب لتكفير الخطايا، ورفع الدرجات، وزيادة القرب من المنعم سبحانه.",
      "وهنا نلخص لكم أهم خمس نصائح لتنمية الصبر والرضا بقضاء الله وقدره في حياتكم:",
      "أولاً: استحضار حقيقة أن الدنيا دار ممر لا مقر، وأن كل عسر يتبعه يسران بفضل الله وكرمه.",
      "ثانياً: اللهج بالدعاء المأثور: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْراً وَثَبِّتْ أَقْدَامَنَا'.",
      "ثالثاً: تركيز جهدك على الأمور التي تقع تحت سيطرتك وتأثيرك، وتفويض النتائج بالكامل لحكمة الله وتدبيره.",
      "رابعاً: الاستعانة بالصلاة وتثبيت مواعيدها بانتظام، امتثالاً لقوله تعالى: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ'.",
      "خامساً: الالتفاف حول الصالحين والأصدقاء الإيجابيين الذين يبثون في نفسك الأمل والتفاؤل ويشدون عضدك.",
      "إن المداومة على الصبر تحول التحديات الصعبة إلى محطات للتزكية الذاتية والارتقاء الروحي الدائم.",
      "نسأل الله تعالى أن يملأ قلوبنا صبراً جميلاً، ويرزقنا الرضا بالقضاء، ويجعل عاقبة أمرنا رشداً ويسراً.",
      "وأن يبارك في خطاكم، ويجعل هذا العلم نوراً يضيء دروبكم نحو المعالي والنجاح في الدنيا والآخرة.",
      "والسلام عليكم ورحمة الله وبركاته."
    ].join("\n\n")
  },
  {
    en: "The History of Islamic Architecture and Geometry",
    ar: "تاريخ العمارة الإسلامية والتناغم الهندسي البديع",
    contentEn: [
      "Assalamu Alaikum dear seeker. Today we dive into the rich history of Islamic architecture and mathematical geometry.",
      "Islamic architecture is not just building structures; it is a profound visual reflection of cosmic harmony and tawhid (unity).",
      "Historically, early Muslim builders integrated Roman, Persian, and Byzantine techniques, transforming them into a distinct style.",
      "The use of complex geometric patterns (Arabesques) reflects the infinite nature of creation, avoiding physical depictions of living things.",
      "Mathematical symmetry in Islamic design uses circles, squares, and stars to construct incredibly balanced mosaics.",
      "The dome (Qubbah) represents the heavenly vault, acting as a structural and acoustic masterpiece in grand mosques.",
      "The minaret (Manarah) serves a practical function for calling to prayer and stands as a high landmark of faith in the skyline.",
      "Calligraphy, particularly verses of the Quran, is beautifully integrated into building walls, inviting visitors to reflect.",
      "Light and water are core elements, using courtyards with fountains to create spaces of coolness and serene contemplation.",
      "Historical landmarks like the Alhambra in Spain, the Dome of the Rock in Jerusalem, and the Taj Mahal showcase this excellence.",
      "Here are five design principles of classical Islamic architecture to study and appreciate:",
      "First: Structural symmetry, where left and right halves mirror each other to represent stability and cosmic balance.",
      "Second: The integration of nature, using open courtyards to bring sunlight, fresh air, and greenery inside the building.",
      "Third: Intricate geometric repetition, showing how complex beauty can evolve from a single, simple circular unit.",
      "Fourth: The acoustic harmony of domes, utilizing geometry to amplify voices of recitation naturally without electronic systems.",
      "Fifth: Artistic calligraphy, turning walls into beautiful open pages of reminders that direct the gaze to the heavens.",
      "Studying these architectural achievements shows how early Muslims combined advanced mathematics with deep faith.",
      "It reminds us that true utility and stunning aesthetic beauty can merge to create spaces of absolute peace.",
      "We pray that the Almighty helps us appreciate this legacy and inspires us to construct modern spaces of harmony.",
      "May this guide serve as a source of creative inspiration, linking you to our rich cultural history.",
      "Assalamu Alaikum wa Rahmatullah wa Barakatuh."
    ].join("\n\n"),
    contentAr: [
      "السلام عليكم ورحمة الله وبركاته. نتناول اليوم تاريخ العمارة الإسلامية والتناغم الهندسي والجمالي البديع.",
      "إن العمارة الإسلامية ليست مجرد تشييد للبناء، بل هي تجسيد بصري رائع لمفهوم التناجم والتوحيد والجمال الدائم.",
      "تاريخياً، دمج المعماريون المسلمون الأوائل الأساليب البيزنطية والفارسية، وطوروها لتبتكر هوية بصرية متميزة وفريدة.",
      "وقد عبّر الفن الإسلامي عن اللانهائية من خلال النقوش والزخارف الهندسية المعقدة (الأرابيسك) بعيداً عن تصوير المجسمات.",
      "حيث استخدم المهندسون المسلمون الرياضيات الدقيقة لبناء نجوم ومضلعات هندسية غاية في الدقة والتناظر البصري.",
      "وتمثل القبة في المسجد رمزاً للسماء وسموها، فضلاً عن دورها المعماري والهندسي المتميز في توزيع الأصوات والإضاءة.",
      "أما المئذنة، فتمثل منارة بصرية مرتفعة ترمز لنداء التوحيد الشريف وتحدد معالم المدن الإسلامية وجمالها.",
      "وزينت جدران المساجد بالخط العربي البديع كخط الثلث والكوفي، لتتحول الجدران إلى آيات تنبض بالذكر وتدعو للتدبر.",
      "ويمثل الضوء والماء عنصرين أساسيين، حيث صممت الساحات الداخلية المفتوحة والنوافير لتوفير التبريد والسكينة والوقار.",
      "وتقف شواهد تاريخية مثل قصر الحمراء في الأندلس، وقبة الصخرة بالقدس، لتعبر عن ذروة هذا الرقي الفني والمعماري.",
      "وهنا نلخص لكم أهم خمس ميزات هندسية اتسمت بها العمارة الإسلامية العريقة عبر القرون:",
      "أولاً: التناظر المعماري الدقيق، حيث يعكس التصميم التوازن والانسجام في الكون والسكينة النفسية للمكان.",
      "ثانياً: الانفتاح على الطبيعة، عبر الساحات الداخلية المفتوحة التي تسمح بدخول الهواء النقي وتفاعل الضوء الطبيعي.",
      "ثالثاً: تكرار الأنماط الهندسية، معبرة عن الوحدة والتنوع البديع المنطلق من وحدة دائرية بسيطة متكررة.",
      "رابعاً: هندسة الصوت في القباب، حيث ينساب صوت التلاوة والآذان بشكل طبيعي واضح في أرجاء المسجد الواسع.",
      "خامساً: توظيف الخط العربي كعنصر فني، يربط جمال الفن البصري بجلال الرسالة الدينية واللغوية النبيلة.",
      "إن دراسة هذا الإرث المعماري تؤكد كيف جمع علماؤنا بين عبقرية الرياضيات وقوة العقيدة لبناء حضارة عظيمة.",
      "نسأل الله تعالى أن يحفظ لنا تاريخنا العريق، ويلهمنا لبناء مجتمعات معاصرة تجمع بين الأصالة والتقدم العلمي.",
      "وأن يبارك في مسيرتكم التعليمية ويجعلكم من طلبة العلم المتميزين والمستنيرين بأنوار المعرفة الرصينة.",
      "والسلام عليكم ورحمة الله وبركاته."
    ].join("\n\n")
  },
  {
    en: "Mastering Tajweed Rules: A Guide for Beginners",
    ar: "إتقان قواعد التجويد الشريف: دليل شامل للمبتدئين",
    contentEn: [
      "Assalamu Alaikum dear reader. Today we present an introductory guide to mastering Tajweed rules for Quran recitation.",
      "Tajweed literally means 'proficiency' or 'doing something well'. It refers to giving every letter of the Quran its rights.",
      "This includes pronouncing each letter from its correct articulation point (Makhraj) with its proper characteristics (Sifat).",
      "The primary purpose of Tajweed is to preserve the authentic pronunciation of the Quran as revealed to Prophet Muhammad.",
      "For beginners, the rules of Nun Sakinah (noon without vowel) and Tanween (double vowel) are the foundation of study.",
      "These rules are divided into four main categories: Izhar (clear pronunciation), Idgham (merging letters), Iqlab (conversion), and Ikhfa (concealment).",
      "Izhar occurs when Nun Sakinah is followed by one of the six throat letters: Hamzah, Ha, 'Ayn, Haa, Ghayn, and Khaa.",
      "Idgham occurs when Nun Sakinah is followed by one of the letters in the word 'Yarmaloon', merging them with or without nasal sound.",
      "Iqlab occurs when Nun Sakinah is followed by the letter Ba, converting the sound into a soft Meem with a nasal sound (Ghunnah).",
      "Ikhfa occurs when Nun Sakinah is followed by any of the remaining fifteen letters, concealing the sound lightly.",
      "Here are five practical recommendations to help you master Tajweed rules effectively as a beginner:",
      "First: Listen consistently to certified Quran reciters, repeating after them to train your vocal cords and ears.",
      "Second: Study the Makharij (articulation points) of throat and tongue letters to correct common pronunciation errors.",
      "Third: Practice reciting slowly (Tarteel), giving each vowel, madd (elongation), and nasal sound its complete duration.",
      "Fourth: Record your recitation and send it to our certified teachers in the Teacher Center for evaluation.",
      "Fifth: Dedicate ten minutes daily to practicing a single rule, applying it to different Surahs until it becomes natural.",
      "Consistency in Tajweed practice transforms your relationship with the Quran, bringing deep peace and spiritual focus to your prayers.",
      "It honors the words of our Creator and fulfills the Quranic instruction: 'And recite the Quran with measured recitation.'",
      "We pray that Allah blesses your voice, guides your tongue, and makes the Quran a close friend in your life.",
      "May this educational guide serve as a valuable companion in your sacred learning journey.",
      "Assalamu Alaikum wa Rahmatullah wa Barakatuh."
    ].join("\n\n"),
    contentAr: [
      "السلام عليكم ورحمة الله وبركاته. نقدم لكم اليوم دليلاً شاملاً للمبتدئين لإتقان قواعد التجويد ومخارج الحروف.",
      "التجويد في اللغة يعني التحسين والإتقان، وفي الاصطلاح هو إعطاء كل حرف من حروف القرآن الكريم حقه ومستحقه.",
      "ويشمل ذلك إخراج الحروف من مخارجها الصحيحة (مخارج الحروف) وتطبيق صفاتها الذاتية والمنفصلة (صفات الحروف).",
      "والغاية الأساسية من علم التجويد هي صون اللسان عن الخطأ واللحن في كتاب الله تعالى وقراءته كما أنزل على نبينا الكريم.",
      "ويعتبر فهم أحكام النون الساكنة والتنوين الركيزة الأساسية والأولى لكل مبتدئ في مسيرة تعلم أحكام التلاوة.",
      "وتنقسم أحكام النون الساكنة والتنوين إلى أربعة أحكام رئيسية: الإظهار، الإدغام، الإقلاب، والإخفاء.",
      "أولاً: الإظهار الحلقي، ويكون عند التقاء النون الساكنة بأحد حروف الحلق الستة: الهمزة، الهاء، العين، الحاء، الغين، والخاء.",
      "ثانياً: الإدغام، وهو دمج النون الساكنة بالحرف الذي يليها إذا كان من حروف كلمة (يرملون)، وينقسم لقسمين: بغنة وبغير غنة.",
      "ثالثاً: الإقلاب، ويكون عند التقاء النون الساكنة بحرف الباء، حيث تقلب النون ميماً مخفاة مع مراعاة الغنة.",
      "رابعاً: الإخفاء الحقيقي، ويكون عند مجيء النون الساكنة قبل بقية حروف الهجاء الخمسة عشر المتبقية، حيث تخفى النون.",
      "وهنا نلخص لكم أهم خمس نصائح عملية تساعدكم على إتقان التجويد وتطبيقه بثقة ويسر أثناء قراءتكم اليومية:",
      "أولاً: الاستماع المستمر لتلاوات القراء المتقنين والترديد خلفهم لتدريب جهازك النطقي والأذن على مخارج الحروف الصحيحة.",
      "ثانياً: دراسة مخارج الحروف والتركيز على حروف الحلق واللسان لتجنب الأخطاء الشائعة وتبديل الحروف.",
      "ثالثاً: التلاوة ببطء وتأنٍ (الترتيل)، وإعطاء كل غنة ومد وحركة زمنها المستحق دون عجلة أو تكلف.",
      "رابعاً: تسجيل تلاوتك الصوتية وعرضها على المعلمين المعتمدين في مركزنا للحصول على تصحيح دقيق وتوجيهات عملية.",
      "خامساً: تخصيص ورد دراسي يومي بسيط لتطبيق حكم تجويدي واحد وتأمله في السور المختلفة لتثبيته في الذاكرة.",
      "إن الالتزام بهذه الخطوات والتدرب المستمر يمنح تلاوتك جمالاً وسكينة، ويزيد من تدبرك لآيات الذكر الحكيم في صلواتك.",
      "نسأل الله تعالى أن يرزقنا فصاحة اللسان وتلاوة كتابه تلاوة صحيحة ترضيه عنا، ويجعل القرآن ربيع قلوبنا ونور صدورنا.",
      "وأن يبارك في سعيكم وييسر لكم سبل التعلم والترقي الفكري واللغوي في دراستكم المباركة.",
      "والسلام عليكم ورحمة الله وبركاته."
    ].join("\n\n")
  },
  {
    en: "Daily Dhikr Routines for Pristine Mental Clarity",
    ar: "أوراد الأذكار اليومية ودورها في تحقيق الصفاء النفسي",
    contentEn: [
      "Assalamu Alaikum dear reader. Today we discuss the dynamic role of daily Dhikr routines in achieving mental clarity.",
      "In a modern world filled with distractions, stress, and anxiety, the mind easily becomes cluttered and overwhelmed.",
      "Dhikr (remembrance of Allah) acts as a powerful spiritual anchor, grounding the heart and refocusing the intellect.",
      "Allah says in the Quran: 'Unquestionably, by the remembrance of Allah hearts find rest.' (Surah Ar-Ra'd 13:28).",
      "From a neurological standpoint, rhythmic supplications calm the amygdala, lower blood pressure, and reduce cortisol.",
      "Implementing a structured morning and evening Dhikr routine structures your day, creating natural intervals of mindfulness.",
      "The morning routine, performed after Fajr, builds high emotional resilience and patience to face daily challenges.",
      "The evening routine, performed after Asr or Maghrib, washes away the day's stress and prepares the soul for peaceful rest.",
      "Key formulas like 'Subhan Allah', 'Alhamdulillah', and 'Astaghfirullah' are simple to repeat yet yield immense reward.",
      "Dhikr detaches the human heart from material greed and anxiety, keeping our ultimate purpose in life clearly in focus.",
      "Here are five practical recommendations to build a consistent, beneficial daily Dhikr routine for mental peace:",
      "First: Dedicate a fixed 10-minute slot after Fajr and Asr prayers to sit facing the Qiblah in absolute quiet.",
      "Second: Keep a physical or digital subha (tasbih) nearby to count your praises and maintain physical focus.",
      "Third: Learn the meanings and translations of the supplications to ensure your heart fully participates with your tongue.",
      "Fourth: Begin your routine with seeking forgiveness (Istighfar), which purifies the heart and removes internal spiritual blocks.",
      "Fifth: Introduce your family and children to these supplications, reciting them together to bring barakah into your home.",
      "Consistency in these small, daily acts of devotion will transform your focus, inner peace, and spiritual strength.",
      "It turns mundane, stressful hours into rewarded moments of divine connection, keeping you anchored in faith.",
      "We pray that Allah keeps our tongues moist with His remembrance, accepts our efforts, and purifies our hearts.",
      "May this guide serve as a practical resource for your daily growth, mindfulness, and spiritual well-being.",
      "Assalamu Alaikum wa Rahmatullah wa Barakatuh."
    ].join("\n\n"),
    contentAr: [
      "السلام عليكم ورحمة الله وبركاته. نتحدث اليوم عن الأثر البالغ للأذكار اليومية في تحقيق السكينة النفسية والصفاء الذهني.",
      "في عصرنا الحالي المليء بالمشتتات والضغوط اليومية والقلق، يصبح العقل البشري محملاً بأعباء ذهنية تفوق طاقته الاستيعابية.",
      "وهنا يبرز الذكر (ذكر الله تعالى) كمرساة روحية متينة تعيد التوازن للقلب والصفاء والتركيز للعقل البشري.",
      "يقول الله سبحانه وتعالى في محكم التنزيل: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ' (الرعد: 28).",
      "من منظور العلوم العصبية الحديثة، فإن الترديد المنتظم للأذكار يهدئ مراكز التوتر في الدماغ ويقلل من هرمونات القلق.",
      "ويساعد تخصيص ورد صباحي ومسائي ثابت على تنظيم وقتك اليومي، وصنع فترات تأمل طبيعية تعيد لك نشاطك الفكري والروحي.",
      "فأذكار الصباح، التي تؤدى بعد الفجر، تبني حصانة نفسية ومرونة إيمانية تمكنك من مواجهة تحديات العمل برضا وسكينة.",
      "وأذكار المساء، التي تؤدى بعد العصر أو المغرب، تزيل تراكمات التعب اليومي وتهيئ النفس لنوم هادئ ومريح.",
      "إن الصيغ المأثورة مثل 'سبحان الله'، 'الحمد لله'، و'أستغفر الله' خفيفة على اللسان، عظيمة الأثر في انشراح الصدر والسكينة.",
      "فالذكر يحرر القلب من التعلق المفرط بالدنيا وهمومها المادية، ويجعلك دائماً متصلاً بالغايات النبيلة لوجودك.",
      "وهنا نلخص لكم خمس خطوات عملية لتأسيس ورد يومي للأذكار والمداومة عليه بنجاح لجلب الطمأنينة لقلوبكم:",
      "أولاً: تخصيص 10 دقائق ثابتة بعد صلاة الفجر وصلاة العصر، والجلوس في مكان هادئ مستقبلاً القبلة بخشوع.",
      "ثانياً: استخدام مسبحة تفاعلية أو خاتم تسبيح لتسهيل العد والمحافظة على التركيز الحسي والبدني أثناء الذكر.",
      "ثالثاً: فهم وتأمل معاني الأذكار المترجمة، ليتطابق وعي قلبك وتأثرك الداخلي مع نطق لسانك بالحمد والثناء.",
      "رابعاً: البدء دائماً بالاستغفار، فهو يجلي القلوب ويطهر النفس ويفتح مغاليق الصدور ويجلب الرزق والتوفيق.",
      "خامساً: مشاركة الأذكار مع عائلتك وأبنائك، وجعلها ثقافة جماعية في البيت لبث البركة والألفة والرحمة بين الجميع.",
      "إن الاستمرارية على هذا الورد اليومي تصنع فارقاً حقيقياً في قوة تركيزك واستقرارك النفسي والروحي والجسدي.",
      "نسأل الله العلي القدير أن يجعل ألسنتنا رطبة بذكره، وقلوبنا مطمئنة بحبه، وأن يتقبل منا ومنكم صالح الأعمال.",
      "وأن يبارك في أوقاتكم، وينير دروبكم بنور الوحي ويهديكم لسبل السلام والرشاد في كل خطوة تخطونها.",
      "والسلام عليكم ورحمة الله وبركاته."
    ].join("\n\n")
  },
  {
    en: "Contributions of Muslim Scholars to Algebra and Science",
    ar: "إسهامات علماء المسلمين الأوائل في علم الجبر والعلوم",
    contentEn: [
      "Assalamu Alaikum dear seeker. Today we explore the historical achievements of Muslim scholars in algebra and science.",
      "During the Golden Age of Islam (8th to 14th centuries), the Muslim world stood as the global capital of science and philosophy.",
      "The House of Wisdom (Bayt al-Hikmah) in Baghdad brought together scholars of diverse backgrounds to translate and expand knowledge.",
      "One of the greatest figures of this era was Muhammad ibn Musa al-Khwarizmi, a brilliant mathematician and astronomer.",
      "Al-Khwarizmi developed the foundation of modern Algebra, deriving the name from his famous book 'Al-Kitab al-Mukhtasar fi Hisab al-Jabr wal-Muqabala'.",
      "He introduced systematic methods for solving linear and quadratic equations, and popularized the Hindu-Arabic numeral system globally.",
      "Indeed, the modern word 'algorithm' is derived directly from the Latin translation of his own name: Algoritmi.",
      "Other fields of science witnessed immense breakthroughs, particularly optics, which was revolutionized by Ibn al-Haytham.",
      "Ibn al-Haytham wrote the 'Book of Optics' (Kitab al-Manazir), establishing the modern scientific method based on testing and observation.",
      "In medicine, Ibn Sina (Avicenna) wrote 'The Canon of Medicine', which remained the standard medical textbook in Europe for centuries.",
      "Here are five major scientific legacies of the Islamic Golden Age to study and appreciate:",
      "First: The development of Algebra, transforming mathematics from static geometry into a dynamic, general problem-solving tool.",
      "Second: The optics revolution, proving that vision occurs when light reflects off objects into the eye, correcting Greek theories.",
      "Third: Astronomical tables and instruments, refining the astrolabe to accurately compute prayer times, direction, and star positions.",
      "Fourth: Medical classification and hospitals, establishing the first public clinics with clean wards and medical licenses.",
      "Fifth: The foundation of chemistry (Al-Kimiya), pioneered by Jabir ibn Hayyan, who introduced systematic laboratory experimentation.",
      "These historical achievements remind us that early Muslims viewed scientific exploration as an act of studying God's creation.",
      "They combined deep faith with rigorous intellectual curiosity, laying the groundwork for the modern technological age.",
      "We pray that the Almighty inspires modern students to revive this spirit of academic and scientific excellence.",
      "May this guide serve as a source of cultural pride and intellectual motivation in your educational journey.",
      "Assalamu Alaikum wa Rahmatullah wa Barakatuh."
    ].join("\n\n"),
    contentAr: [
      "السلام عليكم ورحمة الله وبركاته. نتناول اليوم الإنجازات التاريخية العظيمة لعلماء المسلمين الأوائل في العلوم والجبر.",
      "خلال العصر الذهبي للحضارة الإسلامية، كانت الحواضر العلمية كبغداد وقرطبة والقاهرة تمثل قبلة العلم والمعرفة في العالم.",
      "وقد جمع بيت الحكمة في بغداد المترجمين والباحثين لترجمة العلوم القديمة وإثراء المعارف الإنسانية باكتشافات جديدة.",
      "ويبرز في طليعة هذه الحقبة عالم الرياضيات الفذ محمد بن موسى الخوارزمي، واضع أسس علم الجبر والمقابلة.",
      "والذي اشتق اسم علم الجبر عالمياً من كتابه الشهير: 'الكتاب المختصر في حساب الجبر والمقابلة' للحلول الحسابية.",
      "حيث ابتكر الخوارزمي طرقاً منهجية لحل المعادلات الخطية والتربيعية، وأدخل نظام الأرقام العربية الهندي للعالم.",
      "وتقديراً لجهوده العبقرية، اشتق المصطلح العلمي العالمي 'الخوارزميات' (Algorithms) مباشرة من ترجمة اسمه باللاتينية.",
      "وفي مجال الفيزياء والبصريات، أحدث الحسن بن الهيثم ثورة علمية كبرى بتأليفه كتاب البصريات الشهير 'كتاب المناظر'.",
      "حيث أسس ابن الهيثم المنهج العلمي الحديث المعتمد على التجربة والملاحظة والتحليل الرياضي الدقيق لتفسير الرؤية.",
      "وفي الطب، صنف ابن سينا موسوعته الطبية الخالدة 'القانون في الطب'، التي ظلت مرجعاً أساسياً لجامعات أوروبا لقرون.",
      "وهنا نلخص لكم أهم خمس مساهمات علمية قدمتها الحضارة الإسلامية وأرست بها دعائم النهضة الحديثة:",
      "أولاً: ابتكار علم الجبر، الذي نقل الرياضيات من الهندسة الوصفية القديمة إلى لغة الحساب والرموز التفاعلية العامة.",
      "ثانياً: تصحيح نظريات الإبصار، بإثبات ابن الهيثم أن الرؤية تتم نتيجة انعكاس الضوء من الأجسام إلى العين وليس العكس.",
      "ثالثاً: تطوير الأسطرلاب والمراصد الفلكية، لحساب مواقيت الصلاة واتجاه القبلة وحركة النجوم والكواكب بدقة فائقة.",
      "رابعاً: تأسيس البيمارستانات (المستشفيات)، ووضع أنظمة تراخيص مزاولة مهنة الطب وعزل الأمراض المعدية.",
      "خامساً: تأسيس علم الكيمياء التجريبي، على يد جابر بن حيان الذي أدخل الملاحظة المعملية الدقيقة والتقطير.",
      "إن هذه الإنجازات تؤكد أن علمائنا الأجلاء نظروا لطلب العلم والبحث الكوني كعبادة جليلة وتفكر في بديع صنع الخالق العظيم.",
      "نسأل الله العلي القدير أن يلهم شبابنا وطلابنا المعاصرين لإحياء هذا الشغف بالبحث العلمي والتميز الأكاديمي المرموق.",
      "وأن يوفقكم في دراستكم ويسدد خطاكم نحو بناء مستقبل مشرق ينبض بالمعرفة النافعة والأثر الطيب.",
      "والسلام عليكم ورحمة الله وبركاته."
    ].join("\n\n")
  },
  {
    en: "The Character of the Prophet: Kindness & Diplomacy",
    ar: "أخلاق النبي الكريم صلى الله عليه وسلم: الرحمة والدبلوماسية",
    contentEn: [
      "Assalamu Alaikum dear reader. Today we study the noble character and moral diplomacy of the Prophet Muhammad.",
      "The Prophet (peace be upon him) was sent as a mercy to all creation, exhibiting the highest standards of moral character.",
      "Allah describes his gentle nature in the Quran: 'And indeed, you are of a great moral character.' (Surah Al-Qalam 68:4).",
      "His kindness extended to his family, his companions, strangers, animals, and even those who showed hostility towards him.",
      "In Makkah, long before his prophethood, he was universally trusted and known by all as Al-Amin (the trustworthy) and Al-Sadiq (the truthful).",
      "When the Makkah tribes disputed over who would place the Black Stone in the Kaaba, the Prophet resolved it peacefully.",
      "He placed the stone on a cloak, asking a representative from each tribe to hold the edge, ensuring collective honor.",
      "His diplomacy was grounded in justice, patience, and visual foresight, as demonstrated in the historic Treaty of Hudaybiyyah.",
      "Though the terms of the treaty seemed unfair to some companions at first, the Prophet accepted them to preserve peace.",
      "This treaty established a period of security, allowing the message of Islam to spread peacefully and rapidly across Arabia.",
      "Here are five key moral traits of the Prophet's character to emulate in your personal and community dealings:",
      "First: Unmatched gentleness (Rifq), as he advised: 'Gentleness is not added to anything except that it beautifies it.'",
      "Second: Absolute integrity and honesty, keeping his word even with enemies and returning their trusts before migrating.",
      "Third: Conflict resolution and diplomacy, prioritizing peace, reconciliation, and long-term harmony over pride and revenge.",
      "Fourth: Compassion for the weak, children, and animals, setting laws to prevent cruelty and ensure social support.",
      "Fifth: Humility in leadership, sitting among his companions as an equal and participating in physical labor like building.",
      "Emulating these noble character traits transforms our daily interactions, building a supportive, loving community.",
      "It shows that true strength lies not in force and anger, but in patience, kindness, justice, and diplomatic wisdom.",
      "We pray that the Almighty purifies our character, helps us follow the Prophet's guide, and elevates our ranks.",
      "May this reflection serve as a valuable compass for your character growth and daily interaction with others.",
      "Assalamu Alaikum wa Rahmatullah wa Barakatuh."
    ].join("\n\n"),
    contentAr: [
      "السلام عليكم ورحمة الله وبركاته. نتأمل اليوم الأخلاق النبوية الشريفة وأثرها الدبلوماسي والاجتماعي الرائد في بناء مجتمع متراحم.",
      "لقد بُعث النبي محمد صلى الله عليه وسلم رحمة للعالمين، متمماً لمكارم الأخلاق، وجامعاً لأطراف الفضل والكمال البشري.",
      "يصفه ربه عز وجل في كتابه الحكيم بقوله العظيم: 'وَإِنَّكَ لَعَلَى خُلُقٍ عَظِيمٍ' (القلم: 4).",
      "وقد اتسعت رحمته صلى الله عليه وسلم لتشمل أهله، وأصحابه، والغرباء، والحيوان، وحتى من ناصبوه العداء والخصومة.",
      "فقبل بعثته الشريفة، أجمع أهل مكة قاطبة على تسميته بالصادق الأمين، ثقة في عهد ووعد وأمانة خلقه العظيم.",
      "وعندما اختلفت القبائل في مكة حول من يضع الحجر الأسود في الكعبة، نجحت حكمته في حل النزاع بسلام تام.",
      "حيث وضع الحجر الشريف على ثوب، وأمر ممثلي القبائل جميعاً بحمل أطرافه، صوناً للدماء وتأكيداً على الشراكة.",
      "وكانت دبلوماسيته صلى الله عليه وسلم قائمة على العدل والصبر وبُعد النظر، كما تجلى في صلح الحديبية التاريخي.",
      "ورغم أن بنود الصلح بدت مجحفة في البداية لبعض الصحابة، إلا أنه صلى الله عليه وسلم قبلها إيثاراً للسلام وحفظاً للنفوس.",
      "مما وفر فترة أمان واستقرار أدت لانتشار رسالة الإسلام ودخول الناس في دين الله أفواجاً بفضل المعاملة الحسنة واللين.",
      "وهنا نلخص لكم خمس ركائز أخلاقية ودبلوماسية من السيرة النبوية العطرة ينبغي التمسك بها في حياتنا المعاصرة:",
      "أولاً: خلق الرفق واللين، حيث يقول صلى الله عليه وسلم: 'إن الرفق لا يكون في شيء إلا زانه، ولا ينزع من شيء إلا شانه'.",
      "ثانياً: الأمانة المطلقة، ورد ودائع المشركين وأماناتهم إليهم قبل هجرته للمدينة رغم كيدهم ومحاولاتهم إيذائه.",
      "ثالثاً: تفضيل الصلح والوساطة الإيجابية، وحل الخلافات بالحوار الهادئ البعيد عن الغضب والثأر والكبر الزائف.",
      "رابعاً: الرحمة بالضعفاء والصغار والحيوان، ووضع الضوابط الشرعية لحمايتهم ومنع القسوة والأذى عن سائر المخلوقات.",
      "خامساً: التواضع في القيادة، حيث كان يشارك أصحابه في البناء وحفر الخندق ولا يتميز عنهم بمظهر أو ملبس.",
      "إن الاقتداء بالأخلاق النبوية الشريفة يطهر نفوسنا، ويقوي علاقاتنا، وينشر المحبة والسلام في مجتمعاتنا الصالحة.",
      "نسأل الله العلي القدير أن يحسن أخلاقنا، ويجعلنا متبعين لهديه، ويرزقنا شفاعته وصحبته في جنات النعيم.",
      "وأن يبارك في أوقاتكم ويهديكم لسبل الخير والرشاد والنجاح الباهر في الدنيا والآخرة بفضل كرمه وجوده.",
      "والسلام عليكم ورحمة الله وبركاته."
    ].join("\n\n")
  },
  {
    en: "Deep Study of Hadith Al-Niyyah: Intentions Matter",
    ar: "دراسة عميقة لحديث النية والأعمال وخلوص المقاصد",
    contentEn: [
      "Assalamu Alaikum dear seeker. Today we explore a deep study of the primary Hadith of Islam: Hadith al-Niyyah.",
      "This famous Hadith, recorded by Imam Al-Bukhari, begins: 'Indeed, actions are judged only by intentions (Innama al-a'malu bin-niyyat).'",
      "Scholars of Islam state that this Hadith constitutes one-third of all religious knowledge and forms the core of spirituality.",
      "The term 'Niyyah' refers to the intent, purpose, and inner drive behind any verbal or physical action.",
      "The primary purpose of Niyyah is twofold: to distinguish acts of worship from habits, and to determine the reward of the deed.",
      "For instance, taking a shower can be a simple physical habit to cool down, or it can be a rewarded act of purification (Ghusl).",
      "The difference lies entirely in the conscious intention held in the heart before water touches the body.",
      "Furthermore, the reward of any action is determined by the purity and sincerity (Ikhlas) of the intention behind it.",
      "If a person gives charity to help the poor for the sake of Allah, they receive immense spiritual reward.",
      "However, if they give charity to be praised by people as generous, the action yields no spiritual benefit.",
      "Here are five practical ways to purify your intentions (Niyyah) in your daily routine and actions:",
      "First: Pause for three seconds before starting any work, study, or prayer, consciously asking yourself: 'Why am I doing this?'",
      "Second: Transform your daily habits, like eating or sleeping, into acts of worship by intending to strengthen your body for good deeds.",
      "Third: Hide some of your good deeds, such as charity or voluntary prayers, keeping them private between you and the Creator.",
      "Fourth: Routinely check your heart for showing off (Riya), renewing your focus purely on pleasing Allah during the action.",
      "Fifth: Accept that your results are in the hands of Allah, focusing on the quality and sincerity of your effort instead.",
      "Purifying your intentions raises your spiritual focus, turning the most mundane tasks of life into continuous worship.",
      "It frees you from seeking the praise of people, anchoring your soul in absolute peace and connection with the Creator.",
      "We pray that Allah purifies our intentions, accepts our daily actions, and protects our hearts from insincerity.",
      "May this study guide serve as a valuable companion, keeping your intentions focused on what matters most.",
      "Assalamu Alaikum wa Rahmatullah wa Barakatuh."
    ].join("\n\n"),
    contentAr: [
      "السلام عليكم ورحمة الله وبركاته. نتناول اليوم بالدراسة والتحليل حديث الأعمال والنيات، وهو عماد الدين ومدار الأحكام.",
      "يبدأ هذا الحديث الجليل الذي رواه عمر بن الخطاب في صحيح البخاري بقوله: 'إنما الأعمال بالنيات وإنما لكل امرئ ما نوى'.",
      "وقد أكد أئمتنا الكرام أن هذا الحديث الشريف يمثل ثلث العلم الإسلامي، وهو الأساس لمعرفة القبول والرد للأعمال.",
      "والنية في الشرع هي القصد والعزم المتوجه نحو الفعل، ومحلها القلب البشري ولا يشرع التلفظ بها في العبادات.",
      "وللنية في الإسلام فائدتان عظيمتان: تمييز العبادات عن العادات اليومية، وتمييز رتب العبادات ومقاصدها عن بعضها.",
      "على سبيل المثال، الاغتسال بالماء قد يكون مجرد عادة للتبريد والنظافة، وقد يكون عبادة جليلة يثاب عليها كغسل الجمعة.",
      "والفارق الحاسم والوحيد بين هاتين الحالتين هو القصد المعنوي الكامن في القلب قبل ملامسة الماء للجسد.",
      "إن ثواب أي عمل صالح ومقدار بركته يرتكزان بالكامل على مدى إخلاص النية لله تعالى وتطهيرها من حظوظ النفس.",
      "فمن تصدق بالمال ابتغاء رضا الله ومساعدة المحتاجين، نال الأجر العظيم والبركة في ماله وأولاده في الدنيا والآخرة.",
      "أما من تصدق ليقال عنه جواد وكريم بين الناس، فقد حبط عمله وحُرم الثواب لفقده شرط الإخلاص لوجه الله الكريم.",
      "وهنا نلخص لكم أهم خمس خطوات لمراقبة وتطهير النوايا وجعل أعمالكم كلها خالصة لوجه الله رب العالمين:",
      "أولاً: التوقف لثوانٍ معدودة قبل البدء بأي عمل دراسي أو مهني، وسؤال نفسك بصدق: 'ما هو هدفي الحقيقي من هذا العمل؟'.",
      "ثانياً: تحويل العادات اليومية كالنوم والأكل إلى عبادات، بنية التقوي على طاعة الله وخدمة الناس ونفع المجتمع.",
      "ثالثاً: كتمان بعض الأعمال الصالحة وجعلها خبيئة بينك وبين الله، مثل صدقة السر وصلاة قيام الليل في جوف الليل البهيم.",
      "خامساً: مجاهدة النفس ومحاربة الرياء (حب الشهرة والثناء)، وتجديد الإخلاص باستمرار أثناء تأدية العمل الصالح.",
      "خامساً: الرضا بالنتائج وتفويض الأمر لله، والتركيز على جودة العمل وإتقانه والنية الطيبة التي سبقت أداءه.",
      "إن ترويض النفس على استحضار النية الصالحة يرتقي بصحتك النفسية ويحول تفاصيل حياتك اليومية إلى نهر جارٍ من الحسنات.",
      "نسأل الله العلي القدير أن يرزقنا الإخلاص في القول والعمل، ويطهر قلوبنا من الرياء والنفاق ويتقبل منا صالح الطاعات.",
      "وأن يبارك في سعيكم، ويجعل هذا العلم وسيلة لزيادة الوعي الفكري والارتقاء الروحي في حياتكم المتميزة.",
      "والسلام عليكم ورحمة الله وبركاته."
    ].join("\n\n")
  },
  {
    en: "Nurturing Gratitude (Shukr) in Everyday Actions",
    ar: "تربية النفس على شكر النعم والرضا في تفاصيل الحياة",
    contentEn: [
      "Assalamu Alaikum dear reader. Today we explore the beautiful station of Shukr (Gratitude) in our daily lives.",
      "Shukr is not merely saying 'Alhamdulillah' with the tongue; it is a complete state of appreciation that fills the heart.",
      "It is a core station of faith, representing a conscious recognition of the countless blessings bestowed by our Creator.",
      "Allah gives a powerful, reassuring promise in the Quran: 'If you are grateful, I will surely increase you.' (Surah Ibrahim 14:7).",
      "Scholars explain that gratitude is expressed through three dimensions: the heart, the tongue, and the limbs.",
      "Gratitude of the heart (Shukr al-Qalb) is the deep, internal feeling of appreciation and love for the Bestower of blessings.",
      "Gratitude of the tongue (Shukr al-Lisan) is the verbal praise, thankfulness, and positive speech highlighting those blessings.",
      "Gratitude of the limbs (Shukr al-A'da') is using the physical strength and gifts Allah gave you to do good and help others.",
      "From a psychological perspective, practicing daily gratitude rewires the human brain to focus on abundance rather than lack.",
      "It lowers stress, increases optimism, and guards the heart against envy, greed, and constant spiritual discontent.",
      "Here are five practical recommendations to nurture gratitude (Shukr) in your daily actions and mindset:",
      "First: Keep a daily blessings journal, writing down three specific things you are grateful for every single evening.",
      "Second: Express thankfulness to the people who help you, as the Prophet taught: 'He who does not thank people does not thank Allah.'",
      "Third: Reflect on the blessings of health, sight, and safety, which we often take for granted until they are gone.",
      "Fourth: Use your skills, wealth, or time to volunteer and support those in the community who are less fortunate.",
      "Fifth: When facing difficulties, look for the hidden mercies within the trial, saying 'Alhamdulillah' in all circumstances.",
      "Consistency in Shukr changes your outlook, bringing immense barakah (blessings), inner peace, and satisfaction to your life.",
      "It fulfills our primary purpose of worship, turning every positive moment into a direct means of spiritual elevation.",
      "We pray that Allah makes us among the grateful (Al-Shakirin), accepts our praise, and increases us in goodness.",
      "May this guide serve as a beautiful reminder to count your blessings and live a life filled with peace and contentment.",
      "Assalamu Alaikum wa Rahmatullah wa Barakatuh."
    ].join("\n\n"),
    contentAr: [
      "السلام عليكم ورحمة الله وبركاته. نتأمل اليوم مقام الشكر الجليل، وكيفية تربية النفس عليه في تفاصيل حياتنا اليومية.",
      "والشكر في الإسلام ليس مجرد لفظة 'الحمد لله' تجري على اللسان فحسب، بل هو حالة وجدانية متكاملة تملأ أركان القلب.",
      "وهو من أرقى مقامات الإيمان، ويعبر عن الاعتراف الصادق والتقدير العميق لنعم الخالق العظيم الظاهرة والباطنة.",
      "وقد وعدنا الله سبحانه وتعالى في كتابه الكريم بزيادة النعم لمن يشكرها فقال: 'لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ' (إبراهيم: 7).",
      "وقد بين علماؤنا الأجلاء أن الشكر الحقيقي يتحقق عبر ثلاثة أبعاد متكاملة: شكر القلب، شكر اللسان، وشكر الجوارح.",
      "فشكر القلب هو استشعار المحبة والامتنان الخالص للمنعم سبحانه، واليقين بأن كل نعمة هي فضل ومحض جود منه.",
      "وشكر اللسان هو اللهج بالحمد والثناء الجميل، والتحدث بنعم الله بالخير دون كبر أو تفاخر مقيت أمام الناس.",
      "وشكر الجوارح هو استخدام القوة البدنية والصحة والمهارات التي وهبك الله إياها في عمل الخير ومساعدة الخلق وطاعته.",
      "من منظور علم النفس الإيجابي الحديث، يعيد التدريب اليومي على الامتنان صياغة تفكيرك ليركز على النعم المتاحة بدلاً من المفقودة.",
      "مما يقلل من القلق والاكتئاب، ويطهر قلب المسلم من الحسد والحقد والضيق ويملأ صدره بالرضا الداخلي الجميل.",
      "وهنا نلخص لكم أهم خمس خطوات عملية لغرس خلق الشكر والامتنان في تفاصيل حياتكم اليومية بنجاح:",
      "أولاً: كتابة ثلاث نعم محددة شعرت بها خلال يومك كل مساء في دفتر خاص، لتدريب عقلك على التفكير الإيجابي والامتنان.",
      "ثانياً: شكر الناس الذين يقدمون لك المساعدة، التزاماً بالتوجيه النبوي: 'من لا يشكر الناس لا يشكر الله'.",
      "ثالثاً: تأمل نعم العافية، والأمان، والسمع والبصر، وهي نعم عظيمة نعتاد عليها وننسى تقديرها إلا عند فقدها.",
      "رابعاً: تسخير جزء من وقتك وعلمك وجاهك لمساعدة المحتاجين والتطوع في أعمال البر لخدمة وتنمية مجتمعك.",
      "خامساً: حمد الله والرضا بقضائه عند مواجهة التحديات والصعاب، باحثاً عن الرحمات الخفية واليسر الذي يصاحب العسر.",
      "إن المداومة على شكر الله تصنع فارقاً مهيباً في حياتك، فتجلب البركة واليسر وتزيد من خشوعك وراحة بالك وسكينتك.",
      "نسأل الله العلي القدير أن يجعلنا من الشاكرين الذاكرين الحامدين، وأن يزيدنا من فضله العظيم في الدنيا والآخرة.",
      "وأن يبارك في مسيرتكم العلمية الحافلة، ويجعل هذا العلم نوراً يضيء حياتكم بالسلام والخير والبركات الدائمة.",
      "والسلام عليكم ورحمة الله وبركاته."
    ].join("\n\n")
  },
  {
    en: "Bilingual Short Stories for Arabic Vocab Building",
    ar: "القصص ثنائية اللغة ودورها في بناء الثروة المفرداتية",
    contentEn: [
      "Assalamu Alaikum dear seeker of language. Today we present an educational bilingual short story designed for vocabulary building.",
      "Reading bilingual text is one of the most effective linguistic tools to acquire vocabulary naturally in its correct context.",
      "It allows you to compare sentence structures, syntax, and subtle word choices between English and Classical Arabic organically.",
      "Let us read the story of a young student named Zayd, who lived in a quiet valley and loved books more than anything.",
      "Zayd dreamed of traveling to the legendary House of Wisdom (Bayt al-Hikmah) in Baghdad to study under the great scholars of his era.",
      "His wise father advised him: 'O my son, the journey of seeking knowledge is long, requiring patience and writing down whatever you hear.'",
      "Zayd packed his bags, carrying only a clean notebook, a wooden inkwell, and a heart filled with high determination and hope.",
      "He traveled across mountains and deserts for forty days, facing the heat of the sun and the cold of the desert nights with patience.",
      "Upon arriving in Baghdad, the massive libraries, beautiful arches, and scholars discussing algebra and physics amazed his eyes.",
      "He entered the grand courtyard of the library, sitting quietly near a wise teacher who was explaining Hadith and language rules.",
      "The teacher welcomed Zayd and asked: 'What is it that you seek, O young traveler from the distant valley?'",
      "Zayd replied with humility: 'I seek beneficial knowledge, the correction of my tongue, and the purification of my heart, O teacher.'",
      "The teacher smiled and said: 'Knowledge is not just memorizing words; it is a light that Allah places in the heart of the sincere seeker.'",
      "He handed Zayd a classical textbook of Arabic grammar, instructing him to study the root system and practice writing daily.",
      "Zayd spent five years in Baghdad, studying grammar, interpretation, and geometry, writing down every piece of wisdom he acquired.",
      "He returned to his home valley as a teacher, establishing a school to educate children and preserve the beauty of Classical Arabic.",
      "Here are five vocabulary building recommendations to practice while reading this short educational story:",
      "First: Identify the three-letter roots of the highlighted verbs, observing how nouns are derived from them.",
      "Second: Keep a bilingual dictionary nearby to look up synonyms and write them down in your study journal.",
      "Third: Practice translating sentences from Arabic to English and back, paying attention to verb-subject agreement rules.",
      "Fourth: Read the Arabic text aloud to train your tongue in the correct pronunciation of heavy letters and vowels.",
      "Fifth: Discuss the moral of the story with other language students in our live study circles to share insights.",
      "We pray that the Almighty grants you success, blesses your language learning, and makes the Quran easy for you to comprehend.",
      "May this study guide serve as a source of language progress and continuous intellectual development.",
      "Assalamu Alaikum wa Rahmatullah wa Barakatuh."
    ].join("\n\n"),
    contentAr: [
      "السلام عليكم ورحمة الله وبركاته يا طالب اللغة والبيان. نقدم لكم اليوم قصة تعليمية ثنائية اللغة لزيادة الثروة اللغوية.",
      "تعتبر القراءة المتوازية باللغتين من أفضل الوسائل لاكتساب المفردات الجديدة وفهم صياغتها النحوية والدلالية في سياقها الصحيح.",
      "فهي تتيح لك مقارنة التراكيب اللغوية وأسلوب الكتابة وصياغة الجمل بين العربية الفصحى والإنجليزية بشكل تلقائي وممتع.",
      "دعونا نقرأ قصة طالب شاب يدعى زيد، كان يعيش في وادٍ هادئ ويحب الكتب والقراءة أكثر من أي شيء آخر في حياته.",
      "كان زيد يحلم بالسفر إلى بيت الحكمة الشهير في بغداد ليتعلم على أيدي كبار العلماء والفقهاء في عصره الذهبي.",
      "فنصحه والده الحكيم قائلاً: 'يا بني، إن رحلة طلب العلم طويلة وشاقة، وتتطلب الصبر الجميل وتقييد المعرفة بالكتابة والتدوين'.",
      "حزم زيد أمتعته، ولم يحمل معه سوى دفتر نظيف، ومحبرة خشبية، وقلب مفعم بالأمل والعزيمة القوية وحب المعرفة.",
      "سافر زيد عبر الجبال والصحاري لمدة أربعين يوماً، واجه خلالها حرارة الشمس وبرد الليل الصحرواي بالصبر والاحتساب.",
      "وعندما وصل بغداد، أدهشته المكتبات الضخمة، والقباب المزخرفة، وحلقات العلماء الذين يتدارسون الجبر والفلك والحديث الشريف.",
      "دخل زيد الفناء الكبير للمكتبة، وجلس بأدب جم بالقرب من معلم وقور كان يشرح قواعد اللغة ومفرداتها للطلاب الأفاضل.",
      "فرحب به المعلم وسأله بلطف: 'ما الذي تبحث عنه يا بني في هذه الحاضرة العلمية الكبرى وأنت قادم من وادٍ بعيد؟'.",
      "أجاب زيد بتواضع: 'أبحث عن العلم النافع، وتقويم لساني، وتطهير قلبي من شواغل الدنيا الفانية يا معلمي الكريم'.",
      "تبسم المعلم وقال: 'العلم ليس مجرد حفظ الكلمات والسطور، بل هو نور يقذفه الله في قلب طالب العلم الصادق والمخلص'.",
      "ثم سلمه كتاباً في النحو والصرف، وأمره بدراسة نظام الجذور اللغوية وتدرب الكتابة اليومية بانتظام.",
      "قضى زيد خمس سنوات في بغداد يدرس النحو والتفسير والهندسة، مدوناً كل فائدة وحكمة يتعلمها في دفتره الصغير.",
      "ثم عاد إلى واديه معلماً قديراً، وأسس مدرسة لتعليم الأطفال وحفظ لغة الضاد البديعة وجمالها وسياقها الشريف.",
      "وهنا نلخص لكم خمس نصائح دراسية لتطوير مهاراتكم اللغوية أثناء قراءتكم لهذه القصة التعليمية المميزة:",
      "أولاً: استخراج الجذور ثلاثية الأحرف للأفعال الواردة في القصة، وملاحظة كيفية اشتقاق الأسماء والمصادر منها.",
      "ثانياً: تدوين المفردات الجديدة في دفتر خاص بك مع معانيها المترجمة ومحاولة تركيبها في جمل مفيدة من إنشائك.",
      "ثالثاً: التدرب على ترجمة الجمل البسيطة من الإنجليزية إلى العربية، مع الانتباه لقواعد التطابق النحوي والصرفي.",
      "رابعاً: قراءة النص العربي بصوت مسموع لتدريب جهازك النطقي على مخارج الحروف العربية الثقيلة والحركات الإعرابية.",
      "خامساً: مناقشة مغزى القصة والفوائد اللغوية مع زملائك في حلقات الدراسة المباشرة لتبادل المعرفة والتجارب الناجحة.",
      "نسأل الله العلي القدير أن ييسر لكم سبل التعلم، ويرزقكم الفهم والبيان، ويجعل لغتكم وسيلة لفهم كتابه والعمل به.",
      "وأن يبارك في أوقاتكم، وينير دروبكم بنور العلم والهدى ويوفقكم لما فيه الخير والصلاح في مسيرتكم التعليمية.",
      "والسلام عليكم ورحمة الله وبركاته."
    ].join("\n\n")
  }
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

    const content = titleTemplate.contentEn.replace(/Volume \d+/g, `Volume ${Math.floor(i / 10) + 1}`);
    const contentAr = titleTemplate.contentAr.replace(/الجزء \d+/g, `الجزء ${Math.floor(i / 10) + 1}`);

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
      videoUrl: undefined
    });
  }

  return list;
};

// Seed exactly 125 active worship circles dynamically with diverse presets
const generate125Circles = () => {
  const base = [
    {
      id: "c1",
      name: "Morning Adhkar Circle",
      nameAr: "حلقة أذكار الصباح",
      description: "Starting the day with the remembrance of Allah. Daily morning prayers.",
      descriptionAr: "نبدأ يومنا بذكر الله وطاعته. قراءة أذكار الصباح والتدبر اليومي.",
      capacity: 10,
      duration: 10,
      currentTurnIndex: 0,
      sessionProgress: 12,
      dhikrTarget: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
      dhikrTargetAr: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
      joinedUsers: [
        { name: "Fatima Hassan", avatar: "🧕", email: "fatima@arabicmuslim.com" },
        { name: "Ahmed Selim", avatar: "👳", email: "ahmed@arabicmuslim.com" },
        { name: "Omar Farooq", avatar: "🧔", email: "omar@arabicmuslim.com" },
        { name: "Amina Yusuf", avatar: "🧕", email: "amina@arabicmuslim.com" },
        { name: "Yusuf Al-Qurashi", avatar: "👳", email: "yusuf@arabicmuslim.com" },
        { name: "Sara Ali", avatar: "🧕", email: "sara@arabicmuslim.com" },
        { name: "Bilal Khan", avatar: "🧔", email: "bilal@arabicmuslim.com" },
        { name: "Zainab Ahmed", avatar: "🧕", email: "zainab@arabicmuslim.com" },
        { name: "Hamza Malik", avatar: "👳", email: "hamza@arabicmuslim.com" },
        { name: "Layla Hussein", avatar: "🧕", email: "layla@arabicmuslim.com" }
      ],
      creator: "System",
      type: "adhkar",
      recitationRule: "Tajweed"
    },
    {
      id: "c2",
      name: "Surah Al-Mulk Recitation",
      nameAr: "تلاوة سورة الملك",
      description: "Reciting Surah Al-Mulk together before sleep for protection and peace.",
      descriptionAr: "قراءة جماعية لسورة الملك قبل النوم لحفظ الصدور ونيل السكينة.",
      capacity: 5,
      duration: 60,
      currentTurnIndex: 0,
      sessionProgress: 8,
      dhikrTarget: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
      dhikrTargetAr: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
      joinedUsers: [
        { name: "Fatima Hassan", avatar: "🧕", email: "fatima@arabicmuslim.com" },
        { name: "Ahmed Selim", avatar: "👳", email: "ahmed@arabicmuslim.com" },
        { name: "Omar Farooq", avatar: "🧔", email: "omar@arabicmuslim.com" },
        { name: "Amina Yusuf", avatar: "🧕", email: "amina@arabicmuslim.com" }
      ],
      creator: "System",
      type: "quran",
      recitationRule: "Hafs"
    },
    {
      id: "c3",
      name: "Global Istighfar 1000x",
      nameAr: "حلقة الاستغفار الكبرى",
      description: "Seeking forgiveness together in these blessed moments.",
      descriptionAr: "الاستغفار الجماعي وطلب المغفرة لتطهير القلوب وتفريج الهموم.",
      capacity: 8,
      duration: 15,
      currentTurnIndex: 0,
      sessionProgress: 4,
      dhikrTarget: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
      dhikrTargetAr: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
      joinedUsers: [
        { name: "Yusuf Al-Qurashi", avatar: "👳", email: "yusuf@arabicmuslim.com" },
        { name: "Sara Ali", avatar: "🧕", email: "sara@arabicmuslim.com" },
        { name: "Bilal Khan", avatar: "🧔", email: "bilal@arabicmuslim.com" },
        { name: "Zainab Ahmed", avatar: "🧕", email: "zainab@arabicmuslim.com" },
        { name: "Hamza Malik", avatar: "👳", email: "hamza@arabicmuslim.com" }
      ],
      creator: "System",
      type: "adhkar",
      recitationRule: "General"
    }
  ];

  const types = ["quran", "adhkar", "salawat", "istighfar"];
  const surahs = ["Al-Baqarah", "Yaseen", "Al-Kahf", "Ar-Rahman", "Al-Waqi'ah", "Al-Mulk", "An-Nasr", "Al-Ikhlas"];
  const surahsAr = ["البقرة", "يس", "الكهف", "الرحمن", "الواقعة", "الملك", "النصر", "الإخلاص"];
  const rules = ["Hafs", "Warsh", "Tajweed", "General"];
  const members = [
    { name: "Fatima Hassan", avatar: "🧕", email: "fatima@arabicmuslim.com" },
    { name: "Ahmed Selim", avatar: "👳", email: "ahmed@arabicmuslim.com" },
    { name: "Omar Farooq", avatar: "🧔", email: "omar@arabicmuslim.com" },
    { name: "Amina Yusuf", avatar: "🧕", email: "amina@arabicmuslim.com" },
    { name: "Yusuf Al-Qurashi", avatar: "👳", email: "yusuf@arabicmuslim.com" },
    { name: "Sara Ali", avatar: "🧕", email: "sara@arabicmuslim.com" },
    { name: "Bilal Khan", avatar: "🧔", email: "bilal@arabicmuslim.com" },
    { name: "Zainab Ahmed", avatar: "🧕", email: "zainab@arabicmuslim.com" },
    { name: "Hamza Malik", avatar: "👳", email: "hamza@arabicmuslim.com" },
    { name: "Layla Hussein", avatar: "🧕", email: "layla@arabicmuslim.com" }
  ];

  const list = [...base];
  for (let i = 4; i <= 125; i++) {
    const type = types[i % types.length];
    const surahIdx = i % surahs.length;
    const rule = rules[i % rules.length];
    const cap = (i % 6) + 3; // capacity 3 to 8
    
    // Pick joined users dynamically
    const joinedCount = i % 2 === 0 ? cap : cap - 1; // seed some completed ones!
    const joinedUsers = [];
    for (let j = 0; j < joinedCount; j++) {
      joinedUsers.push(members[(i + j) % members.length]);
    }

    let name = `Dhikr Circle ${i}`;
    let nameAr = `حلقة الذكر التفاعلية ${i}`;
    let desc = `Gathering to gain tranquility and rewards through continuous worship.`;
    let descAr = `حلقة تجمع المؤمنين لنيل المغفرة والسكينة والارتقاء اليومي بذكر الله.`;
    let dhikr = "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ";
    let duration = type === 'quran' ? 60 : 10;

    if (type === 'quran') {
      name = `Surah ${surahs[surahIdx]} Recitation ${i}`;
      nameAr = `تلاوة سورة ${surahsAr[surahIdx]} ${i}`;
      desc = `Group recitation and tajweed correction of Surah ${surahs[surahIdx]}.`;
      descAr = `تلاوة وتصحيح مخارج الحروف لسورة ${surahsAr[surahIdx]} جماعياً.`;
      dhikr = `قراءة آيات مباركة من سورة ${surahsAr[surahIdx]} الكريمة.`;
    } else if (type === 'salawat') {
      name = `Salawat Ring ${i}`;
      nameAr = `مجلس الصلاة على النبي ﷺ ${i}`;
      desc = `Sending blessings and prayers upon our beloved Prophet Muhammad.`;
      descAr = `مجلس لتعطير الألسنة بالصلاة والسلام على الرسول الكريم ﷺ.`;
      dhikr = "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِينَا مُحَمَّدٍ ﷺ";
      duration = 15;
    } else if (type === 'istighfar') {
      name = `Daily Istighfar Ring ${i}`;
      nameAr = `حلقة الاستغفار اليومي ${i}`;
      desc = `Unifying hearts in deep istighfar and seeking divine forgiveness.`;
      descAr = `مجلس استغفار جماعي لطلب العفو والمغفرة وتفريج الكروب والهموم.`;
      dhikr = "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ";
      duration = 15;
    }

    list.push({
      id: `c-${i}`,
      name,
      nameAr,
      description: desc,
      descriptionAr: descAr,
      capacity: cap,
      duration,
      currentTurnIndex: 0,
      sessionProgress: i % 10,
      dhikrTarget: dhikr,
      dhikrTargetAr: dhikr,
      joinedUsers,
      creator: "System",
      type,
      recitationRule: rule
    });
  }
  return list;
};

// Seeded global Muslim news items
export const globalMuslimNews = [
  {
    id: "news-1",
    title: "Al-Aqsa Mosque Courtyard Renovations Completed",
    titleAr: "إتمام أعمال ترميم ساحات المسجد الأقصى المبارك",
    source: "Jerusalem News",
    sourceAr: "أخبار القدس",
    date: "May 28, 2026",
    summary: "Historical preservation teams in Jerusalem have completed restoring the ancient geometric stone tiles and mosaic works of the Southern Mosque corridors.",
    summaryAr: "فرق الحفاظ التاريخي بالقدس تنهي ترميم الفسيفساء والممرات الحجرية القديمة في الأروقة الجنوبية للمسجد الأقصى الشريف.",
    image: "🕌",
    likes: 342,
    commentsCount: 28
  },
  {
    id: "news-2",
    title: "Makkah Launching AI Crowd Management Logistics for Hajj 2026",
    titleAr: "مكة تطلق خدمات الذكاء الاصطناعي لإدارة الحشود في حج 2026",
    source: "Haramain Daily",
    sourceAr: "يوميات الحرمين",
    date: "May 27, 2026",
    summary: "The Ministry of Hajj announced advanced spatial tracking models and autonomous guidance flow paths inside the Grand Mosque to ease overcrowding during prayers.",
    summaryAr: "وزارة الحج تعلن عن إدخال خوارزميات الذكاء الاصطناعي والمحاكاة لتسهيل تدفق وتوزيع ضيوف الرحمن في أروقة الحرم المكي الشريف.",
    image: "🕋",
    likes: 512,
    commentsCount: 74
  },
  {
    id: "news-3",
    title: "New Eco-Mosque in London Wins Prestigious Green Architecture Award",
    titleAr: "مسجد صديق للبيئة في لندن يفوز بجائزة العمارة الخضراء المرموقة",
    source: "London Islamic Council",
    sourceAr: "المجلس الإسلامي بلندن",
    date: "May 26, 2026",
    summary: "A newly built multi-purpose mosque featuring local wood materials, structural zero-carbon insulation, and solar dome structures was honored in London.",
    summaryAr: "تكريم مسجد حديث في لندن يعتمد على التصميم الخشبي المستدام، العزل الذكي، والقبة المغطاة بالخلايا الشمسية لتوليد الطاقة النظيفة.",
    image: "🌳",
    likes: 198,
    commentsCount: 19
  }
];

// Localization Dictionary
const translations = {
  en: {
    navHome: "Home Feed",
    navQuran: "Quran & Tasmee'",
    navPrayer: "Prayer Times",
    navArticles: "Articles & News",
    navCommunity: "Live Circles",
    navContact: "Help Desk",
    navProducts: "Bookstore",
    navLogin: "Sign In",
    navDashboard: "My Hub",
    navLogout: "Logout",
    heroTitle: "Memorize Quran & Nurture Daily Worship",
    heroSubtitle: "Access an interactive Quran, track daily score, join live circular recitation rings, explore Islamic literature, and connect with certified teachers.",
    heroExplore: "Noble Quran",
    heroCommunity: "Join Worship Circles",
    featQuranTitle: "Quran Recitation & Feedback",
    featQuranDesc: "Record your verses and receive corrective audio reviews from certified teachers.",
    featPrayerTitle: "Prayer & Soft Athan",
    featPrayerDesc: "Precise global prayer calculations with custom calculation methods.",
    featCommunityTitle: "Live Worship Circles",
    featCommunityDesc: "Join active circular tables for Recitation, Dhikr, or Tasbih with real-time turn sharing.",
    featArticlesTitle: "Islamic Insights & Global News",
    featArticlesDesc: "Read curated Islamic articles and worldwide Muslim community updates.",
    prodSectionTitle: "Islamic bookstore & Essentials",
    prodSectionSubtitle: "Affiliate handpicked literature and digital smart rings on Amazon.",
    prodBuyNow: "View on Amazon",
    prodReviewSingular: "review",
    prodReviewsPlural: "reviews",
    quranTitle: "The Noble Quran Portal",
    quranSubtitle: "Study, memorize, and record supplications",
    quranSearchPlace: "Search Surahs...",
    quranAudioListen: "Listen",
    quranVerse: "Verse",
    quranPlayAll: "Play Recitation",
    quranPause: "Pause",
    quranBookmarkSuccess: "Bookmarked successfully!",
    quranBookmarkRemove: "Bookmark removed.",
    prayerTitle: "Prayer Calculations",
    prayerSubtitle: "Daily sacred timeline and athan alarms",
    prayerNextIn: "Next prayer in",
    prayerToday: "Today's Timings",
    prayerCity: "Select City",
    prayerAthanToggle: "Athan Alarms",
    prayerMethod: "Calculation Standard",
    artTitle: "Islamic Insight Hub",
    artSubtitle: "Enrich your intellect with articles and global news updates",
    artReadMore: "Read More",
    artBack: "Back",
    artReadTime: "min read",
    commTitle: "Live Circular Rings",
    commSubtitle: "Participate in real-time collective remembrance and Quran groups",
    commCreatePost: "Draft Reflection",
    commPostPlaceholder: "What beautiful faith reflection would you like to post in the feed?",
    commPostButton: "Publish Insight",
    commTasbihCount: "Your Daily Score",
    commTasbihGlobal: "Bots / Users online now",
    commTasbihTap: "TAP SUBHA BEAD",
    commTasbihReset: "Reset",
    commMilestone: "Subhan Allah! Goal complete: ",
    commTabCircles: "Active Circles",
    circleJoin: "Enter Circle",
    circleLeave: "Leave Circle",
    circleFull: "Filled",
    circleCreate: "Create Circular Ring",
    circleFormName: "Circle Title",
    circleFormDesc: "Goal description",
    circleFormCap: "Target Capacity",
    circleFormType: "Circle Focus Channel",
    circleSuccessCreated: "Circle launched successfully!",
    circleEnterSession: "Enter Live Session",
    circleSessionDuration: "Duration",
    circleMinutes: "minutes",
    circleCreator: "Organizer",
    circleTurnReciter: "Current Turn Reciting",
    circleYourTurn: "YOUR TURN! Recite aloud now",
    circleWaitingTurn: "Listening respectfully...",
    circleConfirmBtn: "Recitation Completed ➡️ Pass Turn",
    circleSendReaction: "Send Heart Blessings",
    circleSessionEnded: "Session Completed Successfully!",
    circleCongratulations: "May Allah accept your collective worship!",
    circleSharedProgress: "Group Worship Taps Completed",
    contactTitle: "Premium Help Desk",
    contactSubtitle: "Get in touch for custom requests or support.",
    contactName: "Display Name",
    contactEmail: "Email Address",
    contactMsg: "Message",
    contactSubmit: "Submit Inquiry",
    contactSuccess: "Inquiry sent with peace and blessings.",
    contactFAQTitle: "Frequently Asked Questions",
    authTitle: "Arabic Muslim Portal",
    authSubtitle: "Register or log in to manage your daily scores and bookmarks.",
    authEmail: "Email Address",
    authPass: "Password",
    authSubmit: "Sign In",
    authSignUpSubmit: "Create Profile",
    authToggleToSignUp: "Need a profile? Sign Up here",
    authToggleToLogin: "Have a profile? Sign In here",
    authError: "Login failed. Please check your email or password and try again.",
    authWelcome: "Assalamu Alaikum",
    searchTitle: "Search Results for",
    searchNoResults: "No items matched your search query."
  },
  ar: {
    navHome: "تغذية الأخبار",
    navQuran: "القرآن والتسميع",
    navPrayer: "مواقيت الصلاة",
    navArticles: "المقالات والأخبار",
    navCommunity: "الحلقات المباشرة",
    navContact: "الدعم الفني",
    navProducts: "المتجر الإسلامي",
    navLogin: "تسجيل الدخول",
    navDashboard: "لوحتي الشخصية",
    navLogout: "تسجيل الخروج",
    heroTitle: "بوابتك الشاملة لحفظ القرآن الكريم والأذكار اليومية",
    heroSubtitle: "احفظ القرآن بتلاوات صوتية واضحة، تتبع أهدافك ونقاطك اليومية، انضم لحلقات التلاوة الدائرية المباشرة مع المعلمين، وتصفح الكتب الإسلامية الممتازة.",
    heroExplore: "تصفح المصحف الشريف",
    heroCommunity: "انضم للحلقات المباشرة",
    featQuranTitle: "تسميع القرآن وتصحيحه",
    featQuranDesc: "سجل تلاوتك الخاصة واحصل على تقييم وتوجيهات صوتية دقيقة من المعلمين المعتمدين.",
    featPrayerTitle: "مواقيت الصلاة الدقيقة",
    featPrayerDesc: "حساب أوقات الصلوات المفروضة بدقة فائقة مع تنبيهات ومؤقت الأذان التنازلي.",
    featCommunityTitle: "الحلقات المباشرة الدائرية",
    featCommunityDesc: "شارك في غرف ذكر دائرية مقسمة (تلاوة، أذكار، تسابيح) بالترتيب التفاعلي المشترك.",
    featArticlesTitle: "المقالات الإسلامية والأخبار العالمية",
    featArticlesDesc: "تصفح أحدث أخبار العالم الإسلامي ومقالات تعلم اللغة العربية والتدبر.",
    prodSectionTitle: "متجر الكتب والمستلزمات الإسلامية",
    prodSectionSubtitle: "مجموعة منتقاة بعناية من كتب العربية وخواتم التسبيح الذكية المتاحة على موقع أمازون.",
    prodBuyNow: "عرض على أمازون",
    prodReviewSingular: "تقييم",
    prodReviewsPlural: "تقييمات",
    quranTitle: "بوابة القرآن الكريم",
    quranSubtitle: "اقرأ، استمع، سجل وسَمّع آيات الذكر الحكيم",
    quranSearchPlace: "ابحث عن السور...",
    quranAudioListen: "استماع",
    quranVerse: "آية",
    quranPlayAll: "تشغيل السورة كاملة",
    quranPause: "إيقاف مؤقت",
    quranBookmarkSuccess: "تم حفظ العلامة المرجعية بنجاح!",
    quranBookmarkRemove: "تم إزالة العلامة المرجعية.",
    prayerTitle: "حساب مواقيت الصلاة",
    prayerSubtitle: "حافظ على صلواتك في مواقيتها الشرعية المحددة",
    prayerNextIn: "الوقت المتبقي لـ",
    prayerToday: "مواقيت اليوم",
    prayerCity: "اختر المدينة",
    prayerAthanToggle: "تنبيهات الأذان الصوتي",
    prayerMethod: "معيار وطريقة الحساب",
    artTitle: "منصة المقالات والأخبار",
    artSubtitle: "أنر بصيرتك بالمقالات الدينية المتميزة وآخر أخبار المسلمين في العالم",
    artReadMore: "اقرأ التفاصيل",
    artBack: "العودة للخلف",
    artReadTime: "دقائق للقراءة",
    commTitle: "الحلقات التفاعلية الدائرية",
    commSubtitle: "انضم إلى غرف جماعية دائرية لحفظ القرآن وقراءة الأذكار بشكل حي ومباشر",
    commCreatePost: "نشر خاطرة إيمانية",
    commPostPlaceholder: "اكتب ما تود مشاركته مع إخوانك في التغذية الرئيسية لتعم الفائدة...",
    commPostButton: "نشر الخاطرة",
    commTasbihCount: "النقاط اليومية",
    commTasbihGlobal: "المستخدمون النشطون الآن",
    commTasbihTap: "اضغط على حبة السبحة",
    commTasbihReset: "إعادة ضبط",
    commMilestone: "سبحان الله! اكتمل الهدف اليومي: ",
    commTabCircles: "الحلقات المباشرة",
    circleJoin: "دخول الحلقة",
    circleLeave: "مغادرة الحلقة",
    circleFull: "مكتملة الأعضاء",
    circleCreate: "إنشاء حلقة دائرية جديدة",
    circleFormName: "عنوان الحلقة",
    circleFormDesc: "هدف الحلقة أو وصفها",
    circleFormCap: "العدد المستهدف للحضور",
    circleFormType: "نوع وبؤرة التركيز",
    circleSuccessCreated: "تم إطلاق الحلقة بنجاح وبدء الجلسة!",
    circleEnterSession: "دخول الحلقة المباشرة",
    circleSessionDuration: "المدة الزمنية",
    circleMinutes: "دقائق",
    circleCreator: "منظم الحلقة",
    circleTurnReciter: "صاحب الدور الحالي في القراءة",
    circleYourTurn: "جاء دورك الآن! اقرأ وعطر قلوبنا",
    circleWaitingTurn: "استمع في خشينة وأرسل دعواتك...",
    circleConfirmBtn: "أتممت القراءة ➡️ مرر الدور لمن بعدك",
    circleSendReaction: "أرسل قلوب ودعوات",
    circleSessionEnded: "اكتملت الحلقة الإيمانية بنجاح!",
    circleCongratulations: "تقبل الله طاعاتكم وصالح أعمالكم المنجزة جماعياً!",
    circleSharedProgress: "إجمالي أذكار وتسبيحات الحلقة",
    contactTitle: "مكتب الدعم المتميز",
    contactSubtitle: "تواصل معنا للاقتراحات المباشرة أو التبليغ عن الاستفسارات.",
    contactName: "اسم العرض الكامل",
    contactEmail: "البريد الإلكتروني",
    contactMsg: "نص الرسالة",
    contactSubmit: "إرسال الطلب",
    contactSuccess: "تم إرسال استفسارك بسلام وبركات وسنتواصل معك قريباً.",
    contactFAQTitle: "الأسئلة الشائعة والأجوبة",
    authTitle: "بوابة Arabic Muslim",
    authSubtitle: "سجل حسابك الخاص لتتبع نقاطك اليومية وإنجازاتك الشخصية.",
    authEmail: "البريد الإلكتروني",
    authPass: "كلمة المرور",
    authSubmit: "تسجيل الدخول",
    authSignUpSubmit: "إنشاء حساب جديد",
    authToggleToSignUp: "ليس لديك حساب؟ أنشئ حساباً مجانياً",
    authToggleToLogin: "لديك حساب بالفعل؟ سجل دخولك الآن",
    authError: "خطأ في تسجيل الدخول. يرجى التحقق من البريد الإلكتروني أو كلمة المرور وإعادة المحاولة.",
    authWelcome: "السلام عليكم ورحمة الله",
    searchTitle: "نتائج البحث عن",
    searchNoResults: "لم يتم العثور على أي نتائج تطابق عملية البحث."
  }
};

const formatNewsDate = (daysAgo, lang) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  if (lang === 'ar') {
    if (daysAgo === 0) return "اليوم";
    if (daysAgo === 1) return "أمس";
    if (daysAgo === 2) return "منذ يومين";
    return `منذ ${daysAgo} أيام`;
  } else {
    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    return `${daysAgo} days ago`;
  }
};

const fallbackNewsList = [
  {
    id: "fallback-1",
    title: "Al-Aqsa Mosque Courtyard Renovations Completed",
    titleAr: "إتمام أعمال ترميم ساحات المسجد الأقصى المبارك",
    source: "Jerusalem News",
    sourceAr: "أخبار القدس",
    daysAgo: 0,
    summary: "Historical preservation teams in Jerusalem have completed restoring the ancient geometric stone tiles and mosaic works of the Southern Mosque corridors.",
    summaryAr: "فرق الحفاظ التاريخي بالقدس تنهي ترميم الفسيفساء والممرات الحجرية القديمة في الأروقة الجنوبية للمسجد الأقصى الشريف.",
    image: "🕌",
    likes: 342,
    commentsCount: 28
  },
  {
    id: "fallback-2",
    title: "Makkah Launching AI Crowd Management Logistics for Hajj 2026",
    titleAr: "مكة تطلق خدمات الذكاء الاصطناعي لإدارة الحشود في حج 2026",
    source: "Haramain Daily",
    sourceAr: "يوميات الحرمين",
    daysAgo: 1,
    summary: "The Ministry of Hajj announced advanced spatial tracking models and autonomous guidance flow paths inside the Grand Mosque to ease overcrowding during prayers.",
    summaryAr: "وزارة الحج تعلن عن إدخال خوارزميات الذكاء الاصطناعي والمحاكاة لتسهيل تدفق وتوزيع ضيوف الرحمن في أروقة الحرم المكي الشريف.",
    image: "🕋",
    likes: 512,
    commentsCount: 74
  },
  {
    id: "fallback-3",
    title: "New Eco-Mosque in London Wins Prestigious Green Architecture Award",
    titleAr: "مسجد صديق للبيئة في لندن يفوز بجائزة العمارة الخضراء المرموقة",
    source: "London Islamic Council",
    sourceAr: "المجلس الإسلامي بلندن",
    daysAgo: 2,
    summary: "A newly built multi-purpose mosque featuring local wood materials, structural zero-carbon insulation, and solar dome structures was honored in London.",
    summaryAr: "تكريم مسجد حديث في لندن يعتمد على التصميم الخشبي المستدام، العزل الذكي، والقبة المغطاة بالخلايا الشمسية لتوليد الطاقة النظيفة.",
    image: "🌳",
    likes: 198,
    commentsCount: 19
  },
  {
    id: "fallback-4",
    title: "Dubai International Holy Quran Awards Begin Main Ceremony Sessions",
    titleAr: "جائزة دبي الدولية للقرآن الكريم تبدأ جلساتها الختامية والتحكيمية",
    source: "Emirates News",
    sourceAr: "أخبار الإمارات",
    daysAgo: 3,
    summary: "Over eighty international contestants have arrived in Dubai to participate in the final recitation categories before the grand prize announcement.",
    summaryAr: "أكثر من ثمانين متسابقاً دولياً يتوافدون إلى دبي للمشاركة في التصفيات النهائية لتلاوة القرآن الكريم وحفظه أمام لجان التحكيم الدولية.",
    image: "🏆",
    likes: 420,
    commentsCount: 31
  },
  {
    id: "fallback-5",
    title: "Muslim Aid Announces Clean Water Access Projects Across 5 Countries",
    titleAr: "مؤسسة العون الإسلامي تعلن مشاريع لتوفير المياه النظيفة في 5 دول",
    source: "Sadaqah Relief",
    sourceAr: "إغاثة الصدقة",
    daysAgo: 4,
    summary: "The organization has successfully drilled new deep solar wells to provide sustained potable water to agricultural villages in East Africa and South Asia.",
    summaryAr: "نجحت المؤسسة في حفر آبار ارتوازية جديدة تعمل بالطاقة الشمسية لتوفير مياه الشرب النظيفة للقرى الزراعية في شرق إفريقيا وجنوب آسيا.",
    image: "💧",
    likes: 295,
    commentsCount: 12
  },
  {
    id: "fallback-6",
    title: "Centuries-Old Quran Manuscript Digitized for Public Academic Study",
    titleAr: "رقمنة مخطوطة قرآنية نادرة تعود لقرون مضت لإتاحتها للبحث العلمي",
    source: "Heritage Society",
    sourceAr: "جمعية التراث",
    daysAgo: 5,
    summary: "Specialists in Islamic arts have digitized a highly detailed Abbasid-era manuscript, providing free access to researchers studying early calligraphy.",
    summaryAr: "أنهى متخصصون في الفنون الإسلامية رقمنة مخطوطة عباسية مذهبة، مما يتيح للباحثين دراسة تطور الخط الكوفي مجاناً.",
    image: "📖",
    likes: 310,
    commentsCount: 22
  },
  {
    id: "fallback-7",
    title: "Paris Islamic Art Exhibition Displays Rare Andalusia Antiques",
    titleAr: "معرض الفن الإسلامي في باريس يعرض تحفاً نادرة من العصر الأندلسي",
    source: "Cultural Watch",
    sourceAr: "المرصد الثقافي",
    daysAgo: 6,
    summary: "The national museum opened its seasonal pavilion hosting brass astrolabes and decorated ceramic work sourced from historical Cordoba libraries.",
    summaryAr: "افتتح المتحف الوطني جناحاً موسمياً يعرض فيه أسطرلابات نحاسية ومصنوعات خزفية فريدة تم إعارتها من مكتبات قرطبة التاريخية.",
    image: "🎨",
    likes: 185,
    commentsCount: 9
  },
  {
    id: "fallback-8",
    title: "Halal E-Commerce Startup Secures $10 Million Seed Funding Round",
    titleAr: "شركة تجارة إلكترونية حلال تحصل على تمويل تأسيسي بقيمة 10 ملايين دولار",
    source: "Tech Journal",
    sourceAr: "مجلة التقنية",
    daysAgo: 7,
    summary: "A digital retail marketplace focusing on ethical supply chains and halal verification has announced expansion plans into Southeast Asia.",
    summaryAr: "أعلنت منصة رقمية متخصصة في التوريد الأخلاقي والتحقق من المنتجات الحلال عن خطط لتوسيع خدماتها في دول جنوب شرق آسيا.",
    image: "🚀",
    likes: 240,
    commentsCount: 15
  },
  {
    id: "fallback-9",
    title: "Islamic Finance Council Hosts Forum on Green Sukuk Frameworks",
    titleAr: "مجلس المالية الإسلامية ينظم منتدى حول أطر الصكوك الخضراء المستدامة",
    source: "FinTech Arab",
    sourceAr: "فينتك العرب",
    daysAgo: 8,
    summary: "Global economists gathered online to standardize carbon-neutral structures for sovereign sukuk bonds to finance climate change adaptation.",
    summaryAr: "اجتمع خبراء الاقتصاد لوضع معايير موحدة للصكوك السيادية المحايدة للكربون بهدف تمويل مشاريع التكيف مع التغير المناخي.",
    image: "📈",
    likes: 162,
    commentsCount: 6
  },
  {
    id: "fallback-10",
    title: "Bilingual Tafsir Translation Set Published by Academic Scholars",
    titleAr: "علماء أكاديميون ينشرون ترجمة تفسيرية ثنائية اللغة للقرآن الكريم",
    source: "Al-Azhar Publishing",
    sourceAr: "دار نشر الأزهر",
    daysAgo: 9,
    summary: "A landmark multi-volume set providing precise translation of the Quran alongside simple contextual explanations was released worldwide.",
    summaryAr: "تم إصدار موسوعة ترجمة تفسيرية جديدة تقدم معاني المفردات القرآنية مع شرح مبسط للسياق اللغوي باللغتين العربية والإنجليزية.",
    image: "🕌",
    likes: 380,
    commentsCount: 45
  }
];

export const AppProvider = ({ children }) => {
  // Localization state
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_lang');
    return saved === 'ar' ? 'ar' : 'en';
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Navigation Deep Links & Dialog Triggers
  const [quranLaunchMode, setQuranLaunchMode] = useState(null); // 'listening', 'recitation_setup', or null
  const [triggerCreateCircleModal, setTriggerCreateCircleModal] = useState(false);

  // Authenticated User State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('arabicmuslim_auth') === 'true';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('arabicmuslim_user');
    return savedUser ? JSON.parse(savedUser) : {
      name: "Sally Ali",
      email: "sally@arabicmuslim.com",
      avatar: "🌙",
      dailyTasbih: 0,
      role: "Admin", // Defaults to Admin to unleash dashboards instantly
      memberSince: "May 2026"
    };
  });

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_bookmarks');
    return saved ? JSON.parse(saved) : { verses: [], articles: [] };
  });

  // Tasbih/Subha Counts
  const [tasbihCount, setTasbihCount] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_tasbih');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Gamification Metrics
  const [dailyScore, setDailyScore] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_daily_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [completedGoals, setCompletedGoals] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_completed_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_unlocked_badges');
    return saved ? JSON.parse(saved) : ["dhikr_pioneer"];
  });

  // Friend Request System
  const [friendRequestsSent, setFriendRequestsSent] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_friend_req_sent');
    return saved ? JSON.parse(saved) : [];
  });

  const [friendRequestsReceived, setFriendRequestsReceived] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_friend_req_received');
    return saved ? JSON.parse(saved) : [
      { name: "فاطمة حسن", avatar: "🧕", email: "fatima@arabicmuslim.com", role: "Certified Teacher", level: "Gold" },
      { name: "أحمد سليم", avatar: "👳", email: "ahmed@arabicmuslim.com", role: "Certified Teacher", level: "Bronze" }
    ];
  });

  const [friendsList, setFriendsList] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_friends');
    return saved ? JSON.parse(saved) : ["عمر فاروق", "أمينة يوسف"];
  });

  // Bot activity controls
  const [botSettings, setBotSettings] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_bot_settings');
    return saved ? JSON.parse(saved) : { enabled: true, frequency: 9000 };
  });

  // Dynamic articles state (Migrated from Articles page)
  const [articlesList, setArticlesList] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_articles');
    const version = localStorage.getItem('arabicmuslim_articles_ver');
    if (saved && version === '4.0') return JSON.parse(saved);
    
    const fresh = generate120Articles();
    localStorage.setItem('arabicmuslim_articles', JSON.stringify(fresh));
    localStorage.setItem('arabicmuslim_articles_ver', '4.0');
    return fresh;
  });

  // Global Muslim News state (Real-time Al Jazeera Feed & Dynamic Local Fallback)
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    let active = true;
    
    const fetchNews = async () => {
      try {
        const feedUrl = language === 'ar' 
          ? 'https://www.aljazeera.net/aljazeerarss.xml' 
          : 'https://www.aljazeera.com/xml/rss/all.xml';
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
        const data = await response.json();
        
        if (active && data.status === 'ok' && data.items && data.items.length > 0) {
          const mapped = data.items.slice(0, 10).map((item, idx) => {
            let displayDate = "";
            try {
              const pubDate = new Date(item.pubDate);
              const diffMs = new Date() - pubDate;
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMins / 60);
              const diffDays = Math.floor(diffHours / 24);
              if (diffDays <= 0) {
                if (language === 'ar') {
                  displayDate = diffHours > 0 ? `منذ ${diffHours} ساعة` : "اليوم";
                } else {
                  displayDate = diffHours > 0 ? `${diffHours}h ago` : "Today";
                }
              } else {
                displayDate = pubDate.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });
              }
            } catch (e) {
              displayDate = language === 'ar' ? 'اليوم' : 'Today';
            }
            
            const summaryText = (item.description || item.content || "")
              .replace(/<[^>]*>?/gm, '')
              .substring(0, 180) + '...';
              
            return {
              id: item.guid || `live-${idx}`,
              title: item.title,
              titleAr: item.title,
              source: language === 'ar' ? "الجزيرة" : "Al Jazeera",
              sourceAr: language === 'ar' ? "الجزيرة" : "Al Jazeera",
              date: displayDate,
              summary: summaryText,
              summaryAr: summaryText,
              image: "📰",
              likes: Math.floor(Math.random() * 150) + 40,
              commentsCount: Math.floor(Math.random() * 20) + 3,
              link: item.link
            };
          });
          setNewsList(mapped);
          return;
        }
      } catch (err) {
        console.error("RSS fetch error, falling back to local news", err);
      }
      
      if (active) {
        const localMapped = fallbackNewsList.map(item => ({
          ...item,
          date: formatNewsDate(item.daysAgo, language)
        }));
        setNewsList(localMapped);
      }
    };
    
    fetchNews();
    
    return () => {
      active = false;
    };
  }, [language]);

  useEffect(() => {
    const breakingNewsTemplates = [
      {
        title: "Global Muslim Charity Raises Record $50 Million for Humanitarian Relief",
        titleAr: "جمعية خيرية إسلامية تسجل رقماً قياسياً بجمع 50 مليون دولار للإغاثة",
        source: "Global Relief",
        sourceAr: "الإغاثة العالمية",
        image: "🤝"
      },
      {
        title: "Renovation of Cordoba Historical Islamic Library Begins",
        titleAr: "بدء مشروع ترميم المكتبة الإسلامية التاريخية في قرطبة",
        source: "Andalusia Trust",
        sourceAr: "وقف الأندلس",
        image: "📚"
      },
      {
        title: "Islamic Studies Program Launched at Tokyo University",
        titleAr: "إطلاق برنامج الدراسات الإسلامية لأول مرة بجامعة طوكيو",
        source: "Tokyo Academic",
        sourceAr: "أكاديميا طوكيو",
        image: "🎓"
      }
    ];

    const interval = setInterval(() => {
      const template = breakingNewsTemplates[Math.floor(Math.random() * breakingNewsTemplates.length)];
      const randId = `breaking-${Date.now()}`;
      
      const breakingItem = {
        id: randId,
        title: template.title,
        titleAr: template.titleAr,
        source: language === 'ar' ? template.sourceAr : template.source,
        sourceAr: template.sourceAr,
        date: language === 'ar' ? "الآن" : "Just now",
        summary: language === 'ar' 
          ? `خبر عاجل: تم الإعلان اليوم عن ${template.titleAr} وسط ترحيب وتفاعل واسع من المتابعين والمهتمين بالعمل الإنساني والثقافي حول العالم.` 
          : `Breaking: ${template.title} has been announced today, sparking positive engagement and reviews across global community circles.`,
        summaryAr: `خبر عاجل: تم الإعلان اليوم عن ${template.titleAr} وسط ترحيب وتفاعل واسع من المتابعين والمهتمين بالعمل الإنساني والثقافي حول العالم.`,
        image: template.image,
        likes: 0,
        commentsCount: 0,
        breaking: true
      };
      
      setNewsList(prev => [breakingItem, ...prev]);
    }, 120000);

    return () => clearInterval(interval);
  }, [language]);

  // Tasmee audio submissions state
  const [tasmeeSubmissions, setTasmeeSubmissions] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_tasmee');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "seed-1",
        author: "فاطمة حسن",
        avatar: "🧕",
        date: "2026-05-27",
        surahName: "Al-Fatiha",
        surahNameAr: "الفاتحة",
        surahId: 1,
        juz: 1,
        ayahFrom: 1,
        ayahTo: 7,
        audioData: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3",
        rating: 5,
        comments: "ما شاء الله تبارك الرحمن! تلاوة مرتلة خاشعة وصوت عذب ومخارج الحروف سليمة جداً. أحسنتِ يا فاطمة.",
        teacherAudio: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3",
        loves: 24,
        lovedBy: [],
        isUser: false
      },
      {
        id: "seed-2",
        author: "أحمد سليم",
        avatar: "👳",
        date: "2026-05-26",
        surahName: "An-Nasr",
        surahNameAr: "النصر",
        surahId: 110,
        juz: 30,
        ayahFrom: 1,
        ayahTo: 3,
        audioData: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/110.mp3",
        rating: 4,
        comments: "قراءة جيدة ومسترسلة يا أحمد. يرجى الانتباه للمدود الطبيعية في موضع (رأيت الناس)، والحرص على قلقلة الجيم في كلمة (أفواجاً).",
        teacherAudio: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/110.mp3",
        loves: 15,
        lovedBy: [],
        isUser: false
      }
    ];
  });

  // Preseeded and user-drafted community feed posts
  const [communityPosts, setCommunityPosts] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_posts');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        author: "Omar Farooq",
        avatar: "🧔",
        content: "Verily, in the remembrance of Allah do hearts find rest. (Surah Ar-Ra'd 13:28). Let us make a conscious effort to keep our tongues moist with Dhikr today.",
        contentAr: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ (الرعد: 28). لنبذل جهداً واعياً لإبقاء ألسنتنا رطبة بذكر الله اليوم.",
        likes: 38,
        likedBy: [],
        timestamp: "2 hours ago",
        comments: [
          { id: 1, author: "Fatima Hassan", avatar: "🧕", text: "Subhan Allah, much needed reminder in these busy hours." }
        ]
      },
      {
        id: 2,
        author: "Amina Yusuf",
        avatar: "🧕",
        content: "Just started learning Quranic Arabic through the recommended literature on the homepage! Highly recommend 'Arabic Stories for Language Learners' for anyone wanting to grasp deep contextual terms.",
        contentAr: "لقد بدأت للتو في تعلم لغة القرآن العربية من خلال الكتب الموصى بها في الصفحة الرئيسية! أنصح بشدة بكتاب 'قصص عربية لمتعلمي اللغة' لكل من يريد فهم المصطلحات الدينية العميقة.",
        likes: 27,
        likedBy: [],
        timestamp: "5 hours ago",
        comments: []
      }
    ];
  });

  // Active Circles
  const [onlineCircles, setOnlineCircles] = useState(() => {
    const saved = localStorage.getItem('arabicmuslim_circles');
    const version = localStorage.getItem('arabicmuslim_circles_ver');
    if (saved && version === '3.0') return JSON.parse(saved);
    
    const fresh = generate125Circles();
    localStorage.setItem('arabicmuslim_circles', JSON.stringify(fresh));
    localStorage.setItem('arabicmuslim_circles_ver', '3.0');
    return fresh;
  });

  // Dynamic Bot Simulation Engine
  useEffect(() => {
    if (!botSettings.enabled) return;

    const interval = setInterval(() => {
      // Pick a random simulated bot event
      const actionType = Math.floor(Math.random() * 4);

      if (actionType === 0) {
        // 1. Bot joins or leaves a random circle
        setOnlineCircles(prevCircles => {
          if (prevCircles.length === 0) return prevCircles;
          const randomIndex = Math.floor(Math.random() * prevCircles.length);
          const circle = prevCircles[randomIndex];
          
          const bot = mockBots[Math.floor(Math.random() * mockBots.length)];
          const botExists = circle.joinedUsers.some(u => u.email === bot.email);
          
          let newUsers = [...circle.joinedUsers];
          if (botExists) {
            // Only leave system circles if user didn't join to keep it dynamic
            if (circle.creator === "System" && newUsers.length > 2) {
              newUsers = newUsers.filter(u => u.email !== bot.email);
            }
          } else {
            if (newUsers.length < circle.capacity) {
              newUsers.push({ name: bot.name, avatar: bot.avatar, email: bot.email });
            }
          }
          return prevCircles.map((c, idx) => idx === randomIndex ? { ...c, joinedUsers: newUsers } : c);
        });
      } else if (actionType === 1) {
        // 2. Bot publishes an inspirational reflection in the feed
        const bot = mockBots[Math.floor(Math.random() * mockBots.length)];
        const reflections = [
          { en: "Verily, with hardship comes ease. Keep making sincere dua!", ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا. داوموا على الدعاء والاستغفار وسترون الفرج الجميل!" },
          { en: "Sending salawat upon the Prophet Muhammad ﷺ heals the heart.", ar: "أكثروا من الصلاة على نبينا محمد ﷺ فإنها تجلو الهموم وتطهر القلوب وتفتح الأبواب." },
          { en: "Let us keep our tongues moist with the remembrance of Allah.", ar: "لنجعل ألسنتنا رطبة بذكر الله والاستغفار طوال هذا اليوم الطيب المبارك." },
          { en: "Just read a beautiful tafsir of Surah Al-Kahf. Friday peace!", ar: "قرأت للتو تفاسير قيّمة حول قصص سورة الكهف الأربعة، حماية نفسية رائعة لقلوبنا." }
        ];
        const selected = reflections[Math.floor(Math.random() * reflections.length)];
        
        setCommunityPosts(prevPosts => {
          const newPost = {
            id: Date.now(),
            author: bot.name,
            avatar: bot.avatar,
            content: selected.en,
            contentAr: selected.ar,
            likes: Math.floor(Math.random() * 5) + 3,
            likedBy: [],
            timestamp: "Just now",
            comments: []
          };
          return [newPost, ...prevPosts.slice(0, 39)];
        });
      } else if (actionType === 2) {
        // 3. Bot likes or comments on a random feed post
        setCommunityPosts(prevPosts => {
          if (prevPosts.length === 0) return prevPosts;
          const randomIndex = Math.floor(Math.random() * prevPosts.length);
          const post = prevPosts[randomIndex];
          const bot = mockBots[Math.floor(Math.random() * mockBots.length)];
          
          const alreadyLiked = post.likedBy.includes(bot.email);
          let newLikes = post.likes;
          let newLikedBy = [...post.likedBy];
          if (!alreadyLiked) {
            newLikes += 1;
            newLikedBy.push(bot.email);
          }
          
          let newComments = [...post.comments];
          if (Math.random() < 0.4) {
            const commentsList = [
              "ما شاء الله، تذكير قيم ونفع الله بك إسلامنا وعقيدتنا!",
              "Subhan Allah! Beautifully written reflection. May Allah reward you.",
              "اللهم صل وسلم على نبينا محمد وعلى آله وصحبه أجمعين.",
              "جزاك الله خيراً وجعله في ميزان حسناتك الشريفة."
            ];
            newComments.push({
              id: Date.now() + Math.random(),
              author: bot.name,
              avatar: bot.avatar,
              text: commentsList[Math.floor(Math.random() * commentsList.length)]
            });
          }
          
          return prevPosts.map((p, idx) => idx === randomIndex ? { ...p, likes: newLikes, likedBy: newLikedBy, comments: newComments } : p);
        });
      } else if (actionType === 3) {
        // 4. Bot sends a dynamic incoming friend request
        const bot = mockBots[Math.floor(Math.random() * mockBots.length)];
        setFriendsList(currentFriends => {
          if (currentFriends.includes(bot.name)) return currentFriends;
          
          setFriendRequestsReceived(currentReqs => {
            const alreadyExists = currentReqs.some(r => r.email === bot.email);
            if (alreadyExists) return currentReqs;
            return [...currentReqs, bot];
          });
          return currentFriends;
        });
      }
    }, botSettings.frequency);

    return () => clearInterval(interval);
  }, [botSettings]);

  // Expose gamification goal triggers
  const addDailyScorePoints = (points) => {
    setDailyScore(prev => prev + points);
  };

  const completeDailyGoal = (goalId, points = 50) => {
    setCompletedGoals(prev => {
      if (prev.includes(goalId)) return prev;
      
      // Confetti celebration
      confetti({
        particleCount: 50,
        spread: 60,
        colors: ['#d4af37', '#ffffff']
      });

      setDailyScore(s => s + points);
      return [...prev, goalId];
    });
  };

  const unlockBadgeAction = (badgeId) => {
    setUnlockedBadges(prev => {
      if (prev.includes(badgeId)) return prev;
      confetti({
        particleCount: 100,
        spread: 80,
        colors: ['#d4af37', '#ffffff', '#c5a059']
      });
      return [...prev, badgeId];
    });
  };

  // Friend Requests handlers
  const sendFriendRequest = (target) => {
    setFriendRequestsSent(prev => {
      if (prev.some(r => r.email === target.email)) return prev;
      
      // Auto accept dynamic bots requests after 3 seconds for realistic action
      const isBot = mockBots.some(b => b.email === target.email);
      if (isBot) {
        setTimeout(() => {
          setFriendRequestsSent(s => s.filter(r => r.email !== target.email));
          setFriendsList(f => [...f, target.name]);
          
          confetti({
            particleCount: 25,
            spread: 40,
            colors: ['#d4af37', '#ffffff']
          });
        }, 3000);
      }
      return [...prev, target];
    });
  };

  const acceptFriendRequest = (sender) => {
    setFriendRequestsReceived(prev => prev.filter(r => r.email !== sender.email));
    setFriendsList(prev => {
      if (prev.includes(sender.name)) return prev;
      return [...prev, sender.name];
    });
    confetti({
      particleCount: 30,
      spread: 50,
      colors: ['#d4af37', '#ffffff']
    });
  };

  const declineFriendRequest = (sender) => {
    setFriendRequestsReceived(prev => prev.filter(r => r.email !== sender.email));
  };

  const removeFriend = (friendName) => {
    setFriendsList(prev => prev.filter(n => n !== friendName));
  };

  // Admin Article publisher
  const adminAddArticle = (newArticle) => {
    setArticlesList(prev => [newArticle, ...prev]);
  };

  const updateUserRole = (newRole, newLevel) => {
    setUser(prev => {
      const updated = { ...prev, role: newRole, teacherLevel: newLevel || null };
      localStorage.setItem('arabicmuslim_user', JSON.stringify(updated));
      return updated;
    });
  };

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('arabicmuslim_lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_tasbih', tasbihCount.toString());
  }, [tasbihCount]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_tasmee', JSON.stringify(tasmeeSubmissions));
  }, [tasmeeSubmissions]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_friends', JSON.stringify(friendsList));
  }, [friendsList]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_posts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_circles', JSON.stringify(onlineCircles));
  }, [onlineCircles]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_daily_score', dailyScore.toString());
  }, [dailyScore]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_completed_goals', JSON.stringify(completedGoals));
  }, [completedGoals]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_unlocked_badges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_friend_req_sent', JSON.stringify(friendRequestsSent));
  }, [friendRequestsSent]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_friend_req_received', JSON.stringify(friendRequestsReceived));
  }, [friendRequestsReceived]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_bot_settings', JSON.stringify(botSettings));
  }, [botSettings]);

  useEffect(() => {
    localStorage.setItem('arabicmuslim_articles', JSON.stringify(articlesList));
  }, [articlesList]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const login = (email, password) => {
    if (email === "sally@arabicmuslim.com" && (password === "Bismillah1!" || password === "bismillah")) {
      const loggedUser = {
        name: "Sally Ali",
        email: "sally@arabicmuslim.com",
        avatar: "🌙",
        dailyTasbih: tasbihCount,
        role: "Admin",
        memberSince: "May 2026"
      };
      setUser(loggedUser);
      setIsAuthenticated(true);
      localStorage.setItem('arabicmuslim_auth', 'true');
      localStorage.setItem('arabicmuslim_user', JSON.stringify(loggedUser));
      return true;
    }
    
    // Standard login: accept any valid email + password (8+ chars, has uppercase, number, special char)
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const isStrongEnough = password.length >= 8 && hasUppercase && hasNumber && hasSpecial;

    if (email && isStrongEnough) {
      const namePart = email.split('@')[0];
      const loggedUser = {
        name: namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/[._-]/g, ' '),
        email: email,
        avatar: "🕌",
        dailyTasbih: tasbihCount,
        role: "Premium Member",
        memberSince: new Date().toLocaleDateString('en', { year: 'numeric', month: 'long' })
      };
      setUser(loggedUser);
      setIsAuthenticated(true);
      localStorage.setItem('arabicmuslim_auth', 'true');
      localStorage.setItem('arabicmuslim_user', JSON.stringify(loggedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('arabicmuslim_auth');
    localStorage.removeItem('arabicmuslim_user');
  };

  const toggleBookmark = (type, item) => {
    setBookmarks(prev => {
      const list = [...prev[type]];
      const exists = list.some(i => i.id === item.id);
      
      let updatedList;
      if (exists) {
        updatedList = list.filter(i => i.id !== item.id);
      } else {
        updatedList = [...list, item];
      }

      return { ...prev, [type]: updatedList };
    });
  };

  const addTasmeeSubmission = (recording) => {
    const newSubmission = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(language === 'ar' ? 'ar' : 'en', { year: 'numeric', month: 'short', day: 'numeric' }),
      author: user.name,
      avatar: user.avatar,
      isUser: true,
      loves: 0,
      lovedBy: [],
      rating: null,
      comments: null,
      teacherAudio: null,
      ...recording
    };
    
    setTasmeeSubmissions(prev => [newSubmission, ...prev]);

    setTimeout(() => {
      setTasmeeSubmissions(prev => prev.map(sub => {
        if (sub.id === newSubmission.id) {
          return {
            ...sub,
            rating: 5,
            comments: language === 'ar'
              ? "أحسنتِ يا سالي! تلاوة خاشعة ممتازة ومخارج حروف صحيحة تماماً. استمري في التلاوة والحفظ."
              : "Excellent recitation, Sally! Very humble tone, accurate pronunciation, and proper tajweed rule applications. Keep up the amazing spiritual work.",
            teacherAudio: `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${sub.surahId.toString().padStart(3, '0')}.mp3`
          };
        }
        return sub;
      }));
    }, 7000);
  };

  const deleteTasmeeSubmission = (id) => {
    setTasmeeSubmissions(prev => prev.filter(sub => sub.id !== id));
  };

  const loveTasmeeSubmission = (id) => {
    setTasmeeSubmissions(prev => prev.map(sub => {
      if (sub.id === id) {
        const userId = isAuthenticated ? user.email : "anonymous";
        const lovedByList = sub.lovedBy || [];
        const hasLoved = lovedByList.includes(userId);

        let newLovedBy = [...lovedByList];
        let newLoves = sub.loves || 0;

        if (hasLoved) {
          newLovedBy = newLovedBy.filter(email => email !== userId);
          newLoves = Math.max(0, newLoves - 1);
        } else {
          newLovedBy.push(userId);
          newLoves += 1;
        }

        return { ...sub, loves: newLoves, lovedBy: newLovedBy };
      }
      return sub;
    }));
  };

  const addPost = (content) => {
    const newPost = {
      id: Date.now(),
      author: isAuthenticated ? user.name : "Anonymous Muslim",
      avatar: isAuthenticated ? user.avatar : "🕌",
      content: content,
      contentAr: content,
      likes: 0,
      likedBy: [],
      timestamp: "Just now",
      comments: []
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId) => {
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const userId = isAuthenticated ? user.email : "anonymous";
        const hasLiked = post.likedBy.includes(userId);
        
        let newLikedBy = [...post.likedBy];
        let newLikes = post.likes;

        if (hasLiked) {
          newLikedBy = newLikedBy.filter(id => id !== userId);
          newLikes = Math.max(0, newLikes - 1);
        } else {
          newLikedBy.push(userId);
          newLikes += 1;
        }
        return { ...post, likes: newLikes, likedBy: newLikedBy };
      }
      return post;
    }));
  };

  const addComment = (postId, commentText) => {
    if (!commentText.trim()) return;
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now(),
          author: isAuthenticated ? user.name : "Anonymous Muslim",
          avatar: isAuthenticated ? user.avatar : "✨",
          text: commentText
        };
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
  };

  const joinCircle = (circleId) => {
    let completed = false;
    setOnlineCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        const userIdentifier = isAuthenticated ? user.email : "guest_user";
        const hasJoined = c.joinedUsers.some(u => u.email === userIdentifier || (userIdentifier === "guest_user" && u.name === "Guest Member"));
        
        let newUsers;
        if (hasJoined) {
          newUsers = c.joinedUsers.filter(u => u.email !== userIdentifier && u.name !== "Guest Member");
        } else {
          const newUser = {
            name: isAuthenticated ? user.name : "Guest Member",
            email: isAuthenticated ? user.email : "guest_user",
            avatar: isAuthenticated ? user.avatar : "👳"
          };
          newUsers = [...c.joinedUsers, newUser];
          if (newUsers.length === c.capacity) {
            completed = true;
          }
        }
        return { ...c, joinedUsers: newUsers };
      }
      return c;
    }));
    return completed;
  };

  const createCircle = (circleData) => {
    const defaultDhikr = circleData.type === 'quran' 
      ? "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ"
      : (circleData.type === 'salawat' 
          ? "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِينَا مُحَمَّدٍ ﷺ" 
          : (circleData.type === 'istighfar' 
              ? "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ"
              : "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ"));

    const newCircle = {
      id: "c-" + Date.now(),
      name: circleData.name,
      nameAr: circleData.nameAr || circleData.name,
      description: circleData.description,
      descriptionAr: circleData.descriptionAr || circleData.description,
      capacity: parseInt(circleData.capacity, 10) || 5,
      duration: circleData.duration ? parseInt(circleData.duration, 10) : (circleData.type === 'quran' ? 60 : 10),
      currentTurnIndex: 0,
      sessionProgress: 0,
      dhikrTarget: defaultDhikr,
      dhikrTargetAr: defaultDhikr,
      joinedUsers: [
        {
          name: isAuthenticated ? user.name : "Guest Member",
          email: isAuthenticated ? user.email : "guest_user",
          avatar: isAuthenticated ? user.avatar : "👳"
        }
      ],
      creator: isAuthenticated ? user.name : "Guest",
      type: circleData.type || "adhkar",
      recitationRule: circleData.recitationRule || "Tajweed"
    };

    setOnlineCircles(prev => [newCircle, ...prev]);
  };

  const updateCircleTurn = (circleId, newIndex) => {
    setOnlineCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        return { ...c, currentTurnIndex: newIndex };
      }
      return c;
    }));
  };

  const updateCircleDhikr = (circleId, text, textAr) => {
    setOnlineCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        return { ...c, dhikrTarget: text, dhikrTargetAr: textAr || text };
      }
      return c;
    }));
  };

  const incrementCircleProgress = (circleId) => {
    setOnlineCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        const currentProgress = c.sessionProgress || 0;
        return { ...c, sessionProgress: currentProgress + 1 };
      }
      return c;
    }));
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      searchQuery,
      setSearchQuery,
      isAuthenticated,
      user,
      setUser,
      login,
      logout,
      bookmarks,
      toggleBookmark,
      tasbihCount,
      setTasbihCount,
      tasmeeSubmissions,
      addTasmeeSubmission,
      deleteTasmeeSubmission,
      loveTasmeeSubmission,
      friendsList,
      removeFriend,
      sendFriendRequest,
      acceptFriendRequest,
      declineFriendRequest,
      friendRequestsSent,
      friendRequestsReceived,
      dailyScore,
      setDailyScore,
      addDailyScorePoints,
      completedGoals,
      completeDailyGoal,
      unlockedBadges,
      unlockBadgeAction,
      botSettings,
      setBotSettings,
      articlesList,
      adminAddArticle,
      updateUserRole,
      onlineCircles,
      joinCircle,
      createCircle,
      updateCircleTurn,
      updateCircleDhikr,
      incrementCircleProgress,
      communityPosts,
      addPost,
      likePost,
      addComment,
      quranLaunchMode,
      setQuranLaunchMode,
      triggerCreateCircleModal,
      setTriggerCreateCircleModal,
      newsList,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
