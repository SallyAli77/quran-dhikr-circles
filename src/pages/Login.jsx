import React, { useState, useEffect, useRef } from 'react';
import { useApp, mockBots } from '../context/AppContext';
import { 
  ShieldAlert, LogIn, UserPlus, Key, Award, Bookmark, Edit2, Check, 
  ArrowRight, User, Mic, Star, Heart, UserMinus, Volume2, Loader, 
  Clock, Plus, Shield, Settings, AlertCircle, BookOpen, Trash2, Send, CheckCircle2, Play,
  Eye, EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Rigorous 30 Quran Memorization (Hifz) Questions tagged with correct Juz' numbers
const certificationQuestions = [
  { 
    q: "What is the verse that comes immediately after: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين)؟", 
    options: ["(الله لا إله إلا هو الحي القيوم)", "(الم • ذلك الكتاب لا ريب فيه هدى للمتقين)", "(يا أيها الناس اعبدوا ربكم الذي خلقكم)", "(وإذ قال ربك للملائكة إني جاعل في الأرض خليفة)"], 
    correctIndex: 1,
    juz: 1
  },
  { 
    q: "What is the verse that comes immediately after: 'The foolish among the people will say, What has turned them away from their Qiblah which they used to face?'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (سيقول السفهاء من الناس ما ولاهم عن قبلتهم التي كانوا عليها...)؟", 
    options: ["(وكذلك جعلناكم أمة وسطاً لتكونوا شهداء على الناس)", "(قد نرى تقلب وجهك في السماء)", "(ولئن أتيت الذين أوتوا الكتاب بكل آية ما تبعوا قبلتك)", "(قل لله المشرق والمغرب يهدي من يشاء إلى صراط مستقيم)"], 
    correctIndex: 3,
    juz: 2
  },
  { 
    q: "What is the verse that comes immediately after: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (الله لا إله إلا هو الحي القيوم لا تأخذه سنة ولا نوم...)؟", 
    options: ["(له ما في السموات وما في الأرض من ذا الذي يشفع عنده إلا بإذنه)", "(لا إكراه في الدين قد تبين الرشد من الغي)", "(الله ولي الذين آمنوا يخرجهم من الظلمات إلى النور)", "(ألم تر إلى الذي حاج إبراهيم في ربه)"], 
    correctIndex: 0,
    juz: 3
  },
  { 
    q: "What is the verse that comes immediately after: 'All food was lawful to the Children of Israel except what Israel had made unlawful to himself...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (كل الطعام كان حلاً لبني إسرائيل إلا ما حرم إسرائيل على نفسه...)؟", 
    options: ["(فمن افترى على الله الكذب من بعد ذلك)", "(قل صدق الله فاتبعوا ملة إبراهيم حنيفاً)", "(من قبل أن تنزل التوراة قل فأتوا بالتوراة فاتلوها إن كنتم صادقين)", "(إن أول بيت وضع للناس للذي ببكة مباركاً)"], 
    correctIndex: 2,
    juz: 4
  },
  { 
    q: "What is the verse that comes immediately after: 'Worship Allah and associate nothing with Him, and to parents do good...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (واعبدوا الله ولا تشركوا به شيئاً وبالوالدين إحساناً...)؟", 
    options: ["(إن الله لا يظلم مثقال ذرة)", "(وبذي القربى واليتامى والمساكين والجار ذي القربى والجار الجنب والجار الجنب والصاحب بالجنب وبن السبيل...)", "(الذين يبخلون ويأمرون الناس بالبخل)", "(وماذا عليهم لو آمنوا بالله واليوم الآخر)"], 
    correctIndex: 1,
    juz: 5
  },
  { 
    q: "What is the verse that comes immediately after: 'O you who have believed, fulfill [all] contracts. Lawful for you are the animals of grazing livestock...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (يا أيها الذين آمنوا أوفوا بالعقود أحلت لكم بهيمة الأنعام...)؟", 
    options: ["(يا أيها الذين آمنوا لا تحلوا شعائر الله)", "(اليوم أكملت لكم دينكم وأتممت عليكم نعمتي)", "(إلا ما يتلى عليكم غير محلي الصيد وأنتم حرم إن الله يحكم ما يريد)", "(يسألونك ماذا أحل لهم قل أحل لكم الطيبات)"], 
    correctIndex: 2,
    juz: 6
  },
  { 
    q: "What is the verse that comes immediately after: 'You will surely find the strongest of all people in enmity toward the believers to be the Jews and those who associate others with Allah...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (لتجدن أشد الناس عداوة للذين آمنوا اليهود والذين أشركوا...)؟", 
    options: ["(لتجدن أقربهم مودة للذين آمنوا الذين قالوا إنا نصارى)", "(وإذا سمعوا ما أنزل إلى الرسول ترى أعينهم تفيض من الدمع)", "(يقولون ربنا آمنا فاكتبنا مع الشاهدين)", "(وما لنا لا نؤمن بالله وما جاءنا من الحق)"], 
    correctIndex: 0,
    juz: 7
  },
  { 
    q: "What is the verse that comes immediately after: 'And even if We had sent down to them the angels and the dead spoke to them and We gathered together every thing before them...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (ولو أننا نزلنا إليهم الملائكة وكلمهم الموتى وحشرنا عليهم كل شيء قبلاً...)؟", 
    options: ["(وكذلك جعلنا لكل نبي عدواً شياطين الإنس والجن)", "(يوحي بعضهم إلى بعض زخرف القول غروراً)", "(ما كانوا ليؤمنوا إلا أن يشاء الله ولكن أكثرهم يجهلون)", "(لتصغى إليه أفئدة الذين لا يؤمنون بالآخرة)"], 
    correctIndex: 2,
    juz: 8
  },
  { 
    q: "What is the verse that comes immediately after: 'They said, O Moses, either you throw or we will be the ones to throw...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (قالوا يا موسى إما أن تلقي وإما أن نكون نحن الملقين)؟", 
    options: ["(وأوحينا إلى موسى أن ألق عصاك)", "(قال ألقوا فلما ألقوا سحروا أعين الناس واسترهبوهم وجاءوا بسحر عظيم)", "(فوقع الحق وبطل ما كانوا يعملون)", "(فغلبوا هنالك وانقلبوا صاغرين)"], 
    correctIndex: 1,
    juz: 9
  },
  { 
    q: "What is the verse that comes immediately after: 'The mosques of Allah are only to be maintained by those who believe in Allah and the Last Day and establish prayer and give Zakah...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (إنما يعمر مساجد الله من آمن بالله واليوم الآخر وأقام الصلاة وآتى الزكاة...)؟", 
    options: ["(أجعلتم سقاية الحاج وعمارة المسجد الحرام)", "(الذين آمنوا وهاجروا وجاهدوا في سبيل الله)", "(يبشرهم ربهم برحمة منه ورضوان)", "(ولم يخش إلا الله فعسى أولئك أن يكونوا من المهتدين)"], 
    correctIndex: 3,
    juz: 10
  },
  { 
    q: "What is the verse that comes immediately after: 'Indeed, those who do not expect the meeting with Us and are satisfied with the life of this world and feel secure therein...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (إن الذين لا يرجون لقاءنا ورضوا بالحياة الدنيا واطمأنوا بها...)؟", 
    options: ["(أولئك مأواهم النار بما كانوا يكسبون)", "(والذين هم عن آياتنا غافلون)", "(إن الذين آمنوا وعملوا الصالحات يهديهم ربهم بإيمانهم)", "(دعواهم فيها سبحانك اللهم وتحيتهم فيها سلام)"], 
    correctIndex: 1,
    juz: 11
  },
  { 
    q: "What is the verse that comes immediately after: 'When Joseph said to his father, O my father, indeed I have seen eleven stars...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (إذ قال يوسف لأبيه يا أبت إني رأيت أحد عشر كوكباً...)؟", 
    options: ["(والشمس والقمر رأيتهم لي ساجدين)", "(قال يا بني لا تقصص رؤياك على إخوتك)", "(وكذلك يجتبيك ربك ويعلمك من تأويل الأحاديث)", "(لقد كان في يوسف وإخوته آيات للسائلين)"], 
    correctIndex: 0,
    juz: 12
  },
  { 
    q: "What is the verse that comes immediately after: 'Those who have believed and whose hearts are assured by the remembrance of Allah...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (الذين آمنوا وتطمئن قلوبهم بذكر الله...)؟", 
    options: ["(الذين آمنوا وعملوا الصالحات طوبى لهم وحسن مآب)", "(ألا بذكر الله تطمئن القلوب)", "(كذلك أرسلناك في أمة قد خلت من قبلها أمم)", "(ولو أن قرآناً سيرت به الجبال أو قطعت به الأرض)"], 
    correctIndex: 1,
    juz: 13
  },
  { 
    q: "What is the verse that comes immediately after: 'Indeed, it is We who sent down the Qur'an and indeed, We will be its guardian.'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (إنا نحن نزلنا الذكر وإنا له لحافظون)؟", 
    options: ["(وما يأتيهم من رسول إلا كانوا به يستهزئون)", "(كذلك نسلكه في قلوب المجرمين)", "(ولقد أرسلنا من قبلك في شيع الأولين)", "(لا يؤمنون به وقد خلت سنة الأولين)"], 
    correctIndex: 2,
    juz: 14
  },
  { 
    q: "What is the verse that comes immediately after: 'And your Lord has decreed that you not worship except Him, and to parents, good treatment...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (وقضى ربك ألا تعبدوا إلا إياه وبالوالدين إحساناً...)؟", 
    options: ["(واخفض لهما جناح الذل من الرحمة)", "(وقل رب ارحمهما كما ربياني صغيراً)", "(إما يبلغن عندك الكبر أحدهما أو كلاهما فلا تقل لهما أوف ولا تنهرهما وقل لهما قولاً كريماً)", "(ربكم أعلم بما في نفوسكم إن تكونوا صالحين)"], 
    correctIndex: 2,
    juz: 15
  },
  { 
    q: "What is the verse that comes immediately after: 'Then she brought him to her people, carrying him. They said, O Mary, you have certainly done a thing unprecedented.'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (فأتت به قومها تحمله قالوا يا مريم لقد جئت شيئاً فرياً)؟", 
    options: ["(يا أخت هارون ما كان أبوك امرأ سوء وما كانت أمك بغياً)", "(فأشارت إليه قالوا كيف نكلم من كان في المهد صبياً)", "(قال إني عبد الله آتاني الكتاب وجعلني نبياً)", "(وجعلني مباركاً أين ما كنت وأوصاني بالصلاة والزكاة ما دمت حياً)"], 
    correctIndex: 0,
    juz: 16
  },
  { 
    q: "What is the verse that comes immediately after: 'Approached for the people their account, while they are in heedlessness turning away.'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (اقترب للناس حسابهم وهم في غفلة معرضون)؟", 
    options: ["(لاهية قلوبهم وأسروا النجوى الذين ظلموا)", "(قال ربي يعلم القول في السماء والأرض)", "(بل قالوا أضغاث أحلام بل افتراه بل هو شاعر)", "(ما يأتيهم من ذكر من ربهم محدث إلا استمعوه وهم يلعبون)"], 
    correctIndex: 3,
    juz: 17
  },
  { 
    q: "What is the verse that comes immediately after: 'Successful are the believers...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (قد أفلح المؤمنون)؟", 
    options: ["(والذين هم عن اللغو معرضون)", "(الذين هم في صلاتهم خاشعون)", "(والذين هم للزكاة فاعلون)", "(والذين هم لفروجهم حافظون)"], 
    correctIndex: 1,
    juz: 18
  },
  { 
    q: "What is the verse that comes immediately after: 'And those who do not expect the meeting with Us say, Why were not angels sent down to us, or [why] do we [not] see our Lord?'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (وقال الذين لا يرجون لقاءنا لولا أنزل علينا الملائكة أو نرى ربنا...)؟", 
    options: ["(يوم يرون الملائكة لا بشرى يومئذ للمجرمين)", "(وقدمنا إلى ما عملوا من عمل فجعلناه هباء منثوراً)", "(لقد استكبروا في أنفسهم وعتوا عتواً كبيراً)", "(أصحاب الجنة يومئذ خير مستقراً وأحسن مقيلاً)"], 
    correctIndex: 2,
    juz: 19
  },
  { 
    q: "What is the verse that comes immediately after: 'Indeed, you do not guide whom you like, but Allah guides whom He wills...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (إنك لا تهدي من أحببت ولكن الله يهدي من يشاء...)؟", 
    options: ["(وقالوا إن نتبع الهدى معك نتخطف من أرضنا)", "(وهو أعلم بالمهتدين)", "(وكم أهلكنا من قرية بطرت معيشتها)", "(وما كان ربك مهلك القرى حتى يبعث في أمها رسولاً)"], 
    correctIndex: 1,
    juz: 20
  },
  { 
    q: "What is the verse that comes immediately after: 'And if whatever trees on earth were pens and the ocean were ink, replenished thereafter by seven more oceans...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (ولو أنما في الأرض من شجرة أقلام والبحر يمده من بعده سبعة أبحر...)؟", 
    options: ["(ما نفدت كلمات الله إن الله عزيز حكيم)", "(ما خلقكم ولا بعثكم إلا كنفس واحدة)", "(ألم تر أن الله يولج الليل في النهار ويولج النهار في الليل)", "(ألم تر أن الفلك تجري في البحر بنعمة الله)"], 
    correctIndex: 0,
    juz: 21
  },
  { 
    q: "What is the verse that comes immediately after: 'Ya, Seen...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (يس)؟", 
    options: ["(إنك لمن المرسلين)", "(على صراط مستقيم)", "(والقرآن الحكيم)", "(تنزيل العزيز الرحيم)"], 
    correctIndex: 2,
    juz: 22
  },
  { 
    q: "What is the verse that comes immediately after: 'And there came from the farthest end of the city a man, running. He said, O my people, follow the messengers.'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (وجاء من أقصى المدينة رجل يسعى قال يا قوم اتبعوا المرسلين)؟", 
    options: ["(وما لي لا أعبد الذي فطرني وإليه ترجعون)", "(اتبعوا من لا يسألكم أجراً وهم مهتدون)", "(أأتخذ من دونه آلهة إن يردن الرحمن بضر لا تغن عني شفاعتهم شيئاً)", "(إني إذاً لفي ضلال مبين)"], 
    correctIndex: 1,
    juz: 23
  },
  { 
    q: "What is the verse that comes immediately after: 'Say, O My servants who have transgressed against themselves, do not despair of the mercy of Allah...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (قل يا عبادي الذين أسرفوا على أنفسهم لا تقنطوا من رحمة الله...)؟", 
    options: ["(وأنيبوا إلى ربكم وأسلموا له من قبل أن يأتيكم العذاب)", "(واتبعوا أحسن ما أنزل إليكم من ربكم)", "(إن الله يغفر الذنوب جميعاً إنه هو الغفور الرحيم)", "(أن تقول نفس يا حسرتى على ما فرطت في جنب الله)"], 
    correctIndex: 2,
    juz: 24
  },
  { 
    q: "What is the verse that comes immediately after: 'We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the truth...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (سنريهم آياتنا في الآفاق وفي أنفسهم حتى يتبين لهم أنه الحق...)؟", 
    options: ["(ألا إنهم في مرية من لقاء ربهم)", "(أولم يكف بربك أنه على كل شيء شهيد)", "(ألا إنه بكل شيء محيط)", "(حم • عسق)"], 
    correctIndex: 1,
    juz: 25
  },
  { 
    q: "What is the verse that comes immediately after: 'And the stupor of death will bring the truth...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (وجاءت سكرة الموت بالحق...)؟", 
    options: ["(ونفخ في الصور ذلك يوم الوعيد)", "(وجاءت كل نفس معها سائق وشهيد)", "(لقد كنت في غفلة من هذا فكشفنا عنك غطاءك)", "(ذلك ما كنت منه تحيد)"], 
    correctIndex: 3,
    juz: 26
  },
  { 
    q: "What is the verse that comes immediately after: 'The Most Merciful...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (الرحمن)؟", 
    options: ["(علم القرآن)", "(خلق الإنسان)", "(علمه البيان)", "(الشمس والقمر بحسبان)"], 
    correctIndex: 0,
    juz: 27
  },
  { 
    q: "What is the verse that comes immediately after: 'It is He who sent His Messenger with guidance and the religion of truth to manifest it over all religion...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (هو الذي أرسل رسوله بالهدى ودين الحق ليظهره على الدين كله...)؟", 
    options: ["(يا أيها الذين آمنوا هل أدلكم على تجارة تنجيكم)", "(تؤمنون بالله ورسوله وتجاهدون في سبيل الله)", "(ولو كره المشركون)", "(يغفر لكم ذنوبكم ويدخلكم جنات تجري)"], 
    correctIndex: 2,
    juz: 28
  },
  { 
    q: "What is the verse that comes immediately after: 'Blessed is He in whose hand is the dominion, and He is over all things competent...'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (تبارك الذي بيده الملك وهو على كل شيء قدير)؟", 
    options: ["(الذي خلق سبع سموات طباقاً)", "(الذي خلق الموت والحياة ليبلوكم أيكم أحسن عملاً)", "(ما ترى في خلق الرحمن من تفاوت)", "(ثم ارجع البصر كرتين ينقلب إليك البصر خاسئاً)"], 
    correctIndex: 1,
    juz: 29
  },
  { 
    q: "What is the verse that comes immediately after: 'About what are they asking one another?'?", 
    qAr: "ما هي الآية التالية للآية الكريمة: (عم يتساءلون)؟", 
    options: ["(الذي هم فيه مختلفون)", "(كلا سيعلمون)", "(ثم كلا سيعلمون)", "(عن النبأ العظيم)"], 
    correctIndex: 3,
    juz: 30
  }
];

export default function Login({ setActivePage }) {
  const { 
    isAuthenticated, 
    user, 
    setUser,
    login, 
    logout, 
    bookmarks, 
    toggleBookmark, 
    tasbihCount, 
    t, 
    language, 
    tasmeeSubmissions, 
    deleteTasmeeSubmission,
    loveTasmeeSubmission,
    friendsList,
    removeFriend,
    friendRequestsReceived,
    acceptFriendRequest,
    declineFriendRequest,
    dailyScore,
    completedGoals,
    completeDailyGoal,
    unlockedBadges,
    unlockBadgeAction,
    botSettings,
    setBotSettings,
    articlesList,
    adminAddArticle,
    updateUserRole
  } = useApp();

  // Auth modes
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ageConsent, setAgeConsent] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Password strength calculator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score, label: language === 'ar' ? 'ضعيف جداً' : 'Very Weak', color: '#ef4444' };
    if (score === 2) return { score, label: language === 'ar' ? 'ضعيف' : 'Weak', color: '#f97316' };
    if (score === 3) return { score, label: language === 'ar' ? 'متوسط' : 'Fair', color: '#eab308' };
    if (score === 4) return { score, label: language === 'ar' ? 'قوي' : 'Strong', color: '#22c55e' };
    return { score, label: language === 'ar' ? 'قوي جداً' : 'Very Strong', color: '#10b981' };
  };
  const pwdStrength = getPasswordStrength(password);

  // Tab navigation inside dashboard
  const [activeTab, setActiveTab] = useState("my_recordings"); // "my_recordings", "saved_bookmarks", "friend_requests", "teacher_center", "admin_portal"
  
  // Dashboard states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const avatarsList = ["🌙", "🕌", "✨", "⭐", "📖", "🎓", "🧕", "👳", "🧔"];

  // Admin Switcher state
  const [activeAdminRole, setActiveAdminRole] = useState(user.role);

  // Admin Article publisher states
  const [newArtTitle, setNewArtTitle] = useState("");
  const [newArtTitleAr, setNewArtTitleAr] = useState("");
  const [newArtCategory, setNewArtCategory] = useState("Faith");
  const [newArtReadTime, setNewArtReadTime] = useState(5);
  const [newArtSummary, setNewArtSummary] = useState("");
  const [newArtSummaryAr, setNewArtSummaryAr] = useState("");
  const [newArtContent, setNewArtContent] = useState("");
  const [newArtContentAr, setNewArtContentAr] = useState("");
  const [artPublishSuccess, setArtPublishSuccess] = useState(false);

  // Teacher registration & Quiz states
  const [selectedJuzList, setSelectedJuzList] = useState([]);
  const [isExamActive, setIsExamActive] = useState(false);
  const [examCurrentQuestionIdx, setExamCurrentQuestionIdx] = useState(0);
  const [examAnswers, setExamAnswers] = useState({});
  const [examTimeLeft, setExamTimeLeft] = useState(1800); // 30 minutes in seconds
  const [examFinished, setExamFinished] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState([]);

  // Timer Ref
  const examTimerRef = useRef(null);

  // Sync Timer for quiz
  useEffect(() => {
    if (isExamActive && !examFinished) {
      examTimerRef.current = setInterval(() => {
        setExamTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(examTimerRef.current);
            handleFinishExam(true); // auto submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (examTimerRef.current) clearInterval(examTimerRef.current);
    };
  }, [isExamActive, examFinished]);

  // Deep Link tab auto-focus handlers
  useEffect(() => {
    const handleDeepLink = () => {
      setActiveTab("teacher_center");
    };
    window.addEventListener('deep_link_teacher_center', handleDeepLink);

    // Also check on mount
    const link = localStorage.getItem('arabicmuslim_deep_link');
    if (link === 'teacher_center' && isAuthenticated) {
      setActiveTab('teacher_center');
      localStorage.removeItem('arabicmuslim_deep_link');
    }

    return () => {
      window.removeEventListener('deep_link_teacher_center', handleDeepLink);
    };
  }, [isAuthenticated]);

  const handleStartExam = () => {
    // Dynamically filter questions based on the chosen Juz'
    let filtered = certificationQuestions.filter(q => selectedJuzList.includes(q.juz));
    
    // Robust fallback: if fewer than 5 match, load all questions to guarantee active gameplay
    if (filtered.length < 5) {
      filtered = [...certificationQuestions];
    }
    
    setActiveQuestions(filtered);
    setIsExamActive(true);
    setExamCurrentQuestionIdx(0);
    setExamAnswers({});
    setExamTimeLeft(1800);
    setExamFinished(false);
    setExamScore(0);
  };

  const handleSelectExamAnswer = (questionIdx, answerIdx) => {
    setExamAnswers(prev => ({ ...prev, [questionIdx]: answerIdx }));
  };

  const handleFinishExam = (isTimeout = false) => {
    if (examTimerRef.current) clearInterval(examTimerRef.current);
    
    // Calculate Score against the dynamically filtered activeQuestions
    let score = 0;
    activeQuestions.forEach((q, index) => {
      if (examAnswers[index] === q.correctIndex) {
        score += 1;
      }
    });

    setExamScore(score);
    setExamFinished(true);
    setIsExamActive(false);

    // Dynamic passing threshold: 80% of selected questions (Math.ceil)
    const passingThreshold = Math.ceil(activeQuestions.length * 0.8);
    const passed = score >= passingThreshold;
    if (passed) {
      // Award badges based on the exact number of selected memorized Juz'
      const juzCount = selectedJuzList.length;
      updateUserRole("Certified Teacher", juzCount.toString());
      unlockBadgeAction("teacher_qualified");
      completeDailyGoal("read_article", 100);

      confetti({
        particleCount: 150,
        spread: 80,
        colors: ['#d4af37', '#ffffff']
      });
    }
  };

  // Auth triggers
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError("");
    const success = login(email, password);
    if (success) {
      confetti({
        particleCount: 100,
        spread: 70,
        colors: ['#d4af37', '#ffffff']
      });
    } else {
      setAuthError(t('authError'));
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    // 1. Name validation
    if (!name.trim() || name.trim().length < 3) {
      setAuthError(language === 'en' ? "Full name must be at least 3 characters." : "يجب أن يحتوي الاسم الكامل على 3 أحرف أو أكثر.");
      return;
    }
    if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(name.trim())) {
      setAuthError(language === 'en' ? "Name may only contain letters and spaces." : "الاسم يجب أن يحتوي على حروف ومسافات فقط.");
      return;
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setAuthError(language === 'en' ? "Please enter a valid email address." : "يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }

    // 3. Strong password policy (AdSense / GDPR standard)
    if (password.length < 8) {
      setAuthError(language === 'en' ? "Password must be at least 8 characters." : "كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setAuthError(language === 'en' ? "Password must include at least one uppercase letter (A-Z)." : "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setAuthError(language === 'en' ? "Password must include at least one number (0-9)." : "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل.");
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      setAuthError(language === 'en' ? "Password must include at least one special character (e.g. @, #, !)." : "كلمة المرور يجب أن تحتوي على رمز خاص واحد (مثل @ # !).");
      return;
    }

    // 4. Confirm password match
    if (password !== confirmPassword) {
      setAuthError(language === 'en' ? "Passwords do not match. Please try again." : "كلمتا المرور غير متطابقتين. يرجى المحاولة مجدداً.");
      return;
    }

    // 5. Age and privacy consent (required for AdSense)
    if (!ageConsent) {
      setAuthError(language === 'en' ? "You must confirm you are 13 years or older to register." : "يجب أن تؤكد أنك تجاوزت 13 عاماً للتسجيل.");
      return;
    }
    if (!privacyConsent) {
      setAuthError(language === 'en' ? "You must accept our Privacy Policy and Terms of Service." : "يجب قبول سياسة الخصوصية وشروط الخدمة للمتابعة.");
      return;
    }

    const success = login(email.trim().toLowerCase(), password);
    if (success) {
      // Reset all form fields
      setConfirmPassword("");
      setAgeConsent(false);
      setPrivacyConsent(false);

      confetti({
        particleCount: 100,
        spread: 80,
        colors: ['#d4af37', '#ffffff']
      });
    } else {
      setAuthError(language === 'en' ? "Registration failed. Please try a different email." : "فشل التسجيل. يرجى تجربة بريد إلكتروني مختلف.");
    }
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) return;
    setUser(prev => {
      const updated = { ...prev, name: editName, avatar: editAvatar };
      localStorage.setItem('arabicmuslim_user', JSON.stringify(updated));
      return updated;
    });
    setIsEditingProfile(false);
    confetti({
      particleCount: 20,
      spread: 30,
      colors: ['#d4af37', '#ffffff']
    });
  };

  // Admin Publish article trigger
  const handlePublishArticle = (e) => {
    e.preventDefault();
    if (!newArtTitle.trim() || !newArtContent.trim()) return;

    const newArt = {
      id: Date.now(),
      title: newArtTitle,
      titleAr: newArtTitleAr || newArtTitle,
      category: newArtCategory,
      categoryAr: newArtCategory === "Faith" ? "إيمانيات" : (newArtCategory === "Tafsir" ? "تفسير" : "تعلم العربية"),
      author: user.name,
      authorAr: user.name,
      avatar: user.avatar,
      date: new Date().toLocaleDateString(language === 'ar' ? 'ar' : 'en', { year: 'numeric', month: 'short', day: 'numeric' }),
      readTime: parseInt(newArtReadTime, 10) || 5,
      summary: newArtSummary || "A premium, newly drafted article focusing on daily worship details and faith growth guides.",
      summaryAr: newArtSummaryAr || "خاطرة دينية ومقال تعليمي جديد يركز على إثراء تدبرك ودراستك الإيمانية واللغوية.",
      content: newArtContent,
      contentAr: newArtContentAr || newArtContent
    };

    adminAddArticle(newArt);
    completeDailyGoal("read_article", 50);

    // Clear publisher
    setNewArtTitle("");
    setNewArtTitleAr("");
    setNewArtSummary("");
    setNewArtSummaryAr("");
    setNewArtContent("");
    setNewArtContentAr("");
    setArtPublishSuccess(true);
    setTimeout(() => setArtPublishSuccess(false), 5000);

    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#d4af37', '#ffffff']
    });
  };

  // Filter personal user recordings
  const mySubmissions = tasmeeSubmissions.filter(sub => sub.isUser);

  // Formatter for timer minutes and seconds
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="login-page container fade-in" style={{ minHeight: '80vh', paddingBottom: '80px' }}>
      
      {!isAuthenticated ? (
        isForgotPasswordMode ? (
          // ================= FORGOT PASSWORD FORM =================
          <div style={styles.authContainer} className="glass-panel">
            <div className="islamic-pattern"></div>
            
            <div style={styles.authHeader}>
              <Key size={32} color="var(--text-gold)" style={styles.authIcon} />
              <h2 style={styles.authTitle}>
                {isResetSuccess 
                  ? (language === 'en' ? "Check Your Email" : "تحقق من بريدك") 
                  : (language === 'en' ? "Reset Password" : "إعادة تعيين كلمة المرور")}
              </h2>
              <p style={styles.authSubtitle}>
                {isResetSuccess
                  ? (language === 'en' ? "We have sent a secure password reset link to your email address." : "لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.")
                  : (language === 'en' ? "Enter your email address to receive a secure recovery link." : "أدخل بريدك الإلكتروني لتلقي رابط آمن لاستعادة كلمة المرور.")}
              </p>
            </div>

            {isResetSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                  <CheckCircle2 size={64} color="var(--text-gold)" style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))' }} />
                </div>
                <button 
                  onClick={() => { setIsForgotPasswordMode(false); setIsResetSuccess(false); setResetEmail(""); }}
                  className="btn-primary"
                  style={{ ...styles.submitBtn, width: '100%', justifyContent: 'center' }}
                >
                  <span>{language === 'en' ? "Back to Login" : "العودة لتسجيل الدخول"}</span>
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setIsResetSuccess(true); }} style={styles.authForm}>
                <div style={styles.formField}>
                  <label style={styles.fieldLabel}>{t('authEmail')}</label>
                  <input
                    type="email"
                    required
                    placeholder={language === 'en' ? "your@email.com" : "بريدك@الإلكتروني.com"}
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="premium-input"
                    autoComplete="email"
                  />
                </div>

                <button type="submit" className="btn-primary" style={styles.submitBtn}>
                  <Send size={14} />
                  <span>{language === 'en' ? "Send Reset Link" : "إرسال رابط استعادة المرور"}</span>
                </button>

                <button 
                  type="button"
                  onClick={() => { setIsForgotPasswordMode(false); setAuthError(""); }}
                  style={styles.toggleBtn}
                >
                  {language === 'en' ? "Back to Login" : "العودة لتسجيل الدخول"}
                </button>
              </form>
            )}
          </div>
        ) : (
          // ================= AUTHENTICATION FORM =================
          <div style={styles.authContainer} className="glass-panel">
            <div className="islamic-pattern"></div>
            
            <div style={styles.authHeader}>
              <LogIn size={32} color="var(--text-gold)" style={styles.authIcon} />
              <h2 style={styles.authTitle}>{isSignUpMode ? t('authSignUpSubmit') : t('authTitle')}</h2>
              <p style={styles.authSubtitle}>{t('authSubtitle')}</p>
            </div>

            {authError && (
              <div style={styles.errorBanner} className="glass-panel fade-in">
                <ShieldAlert size={16} color="#ff6b6b" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={isSignUpMode ? handleSignUpSubmit : handleLoginSubmit} style={styles.authForm}>
              {isSignUpMode && (
                <div style={styles.formField}>
                  <label style={styles.fieldLabel}>{language === 'en' ? "Full Name" : "الاسم الكامل"}</label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'en' ? "e.g. Ahmad Abdullah" : "مثال: أحمد عبدالله"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="premium-input"
                    autoComplete="name"
                  />
                </div>
              )}

              <div style={styles.formField}>
                <label style={styles.fieldLabel}>{t('authEmail')}</label>
                <input
                  type="email"
                  required
                  placeholder={language === 'en' ? "your@email.com" : "بريدك@الإلكتروني.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="premium-input"
                  autoComplete={isSignUpMode ? "email" : "username"}
                />
              </div>

              <div style={styles.formField}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <label style={styles.fieldLabel}>{t('authPass')}</label>
                  {!isSignUpMode && (
                    <button
                      type="button"
                      onClick={() => { setIsForgotPasswordMode(true); setAuthError(""); }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-gold)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                    >
                      {language === 'en' ? "Forgot Password?" : "هل نسيت كلمة المرور؟"}
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={isSignUpMode ? (language === 'en' ? "Min 8 chars, A-Z, 0-9, symbol" : "8+ حروف، كبيرة، أرقام، رمز") : "••••••••"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="premium-input"
                    style={{ 
                      paddingRight: language === 'ar' ? '16px' : '44px',
                      paddingLeft: language === 'ar' ? '44px' : '16px'
                    }}
                    autoComplete={isSignUpMode ? "new-password" : "current-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    style={{
                      position: 'absolute',
                      right: language === 'ar' ? 'auto' : '16px',
                      left: language === 'ar' ? '16px' : 'auto',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      opacity: 0.8,
                      transition: 'all 0.2s ease',
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password strength meter - only on signup */}
                {isSignUpMode && password.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= pwdStrength.score ? pwdStrength.color : 'rgba(255,255,255,0.08)', transition: 'all 0.3s ease' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: pwdStrength.color, fontWeight: '600' }}>{pwdStrength.label}</span>
                    {isSignUpMode && (
                      <ul style={{ margin: '6px 0 0 0', padding: '0 0 0 16px', fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        <li style={{ color: password.length >= 8 ? '#22c55e' : 'inherit' }}>{language === 'ar' ? '8 أحرف على الأقل' : 'At least 8 characters'}</li>
                        <li style={{ color: /[A-Z]/.test(password) ? '#22c55e' : 'inherit' }}>{language === 'ar' ? 'حرف كبير واحد (A-Z)' : 'One uppercase letter (A-Z)'}</li>
                        <li style={{ color: /[0-9]/.test(password) ? '#22c55e' : 'inherit' }}>{language === 'ar' ? 'رقم واحد على الأقل (0-9)' : 'One number (0-9)'}</li>
                        <li style={{ color: /[^A-Za-z0-9]/.test(password) ? '#22c55e' : 'inherit' }}>{language === 'ar' ? 'رمز خاص مثل @#!' : 'Special character e.g. @#!'}</li>
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm password field - only on signup */}
              {isSignUpMode && (
                <div style={styles.formField}>
                  <label style={styles.fieldLabel}>{language === 'en' ? "Confirm Password" : "تأكيد كلمة المرور"}</label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="premium-input"
                      style={{ 
                        borderColor: confirmPassword && confirmPassword !== password ? '#ef4444' : confirmPassword && confirmPassword === password ? '#22c55e' : undefined,
                        paddingRight: language === 'ar' ? '16px' : '44px',
                        paddingLeft: language === 'ar' ? '44px' : '16px'
                      }}
                      autoComplete="new-password"
                    />
                  </div>
                  {confirmPassword.length > 0 && (
                    <span style={{ fontSize: '0.72rem', marginTop: '4px', color: confirmPassword === password ? '#22c55e' : '#ef4444', fontWeight: '600', display: 'block' }}>
                      {confirmPassword === password
                        ? (language === 'ar' ? '✓ كلمتا المرور متطابقتان' : '✓ Passwords match')
                        : (language === 'ar' ? '✗ كلمتا المرور غير متطابقتين' : '✗ Passwords do not match')}
                    </span>
                  )}
                </div>
              )}

              {/* Age + Privacy consent - required for Google AdSense */}
              {isSignUpMode && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <input
                      type="checkbox"
                      checked={ageConsent}
                      onChange={(e) => setAgeConsent(e.target.checked)}
                      style={{ marginTop: '2px', accentColor: 'var(--gold-primary)', width: '14px', height: '14px', flexShrink: 0 }}
                    />
                    <span>
                      {language === 'ar'
                        ? 'أؤكد أنني أتجاوز 13 عاماً من العمر وأوافق على استخدام خدمات الموقع'
                        : 'I confirm I am 13 years of age or older and agree to use this service'}
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <input
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      style={{ marginTop: '2px', accentColor: 'var(--gold-primary)', width: '14px', height: '14px', flexShrink: 0 }}
                    />
                    <span>
                      {language === 'ar' ? (
                        <>
                          أوافق على{' '}
                          <button type="button" onClick={() => setActivePage && setActivePage('legal')} style={{ background: 'none', border: 'none', color: 'var(--text-gold)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem', padding: 0 }}>سياسة الخصوصية</button>
                          {' '}و{' '}
                          <button type="button" onClick={() => setActivePage && setActivePage('legal')} style={{ background: 'none', border: 'none', color: 'var(--text-gold)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem', padding: 0 }}>شروط الخدمة</button>
                        </>
                      ) : (
                        <>
                          I agree to the{' '}
                          <button type="button" onClick={() => setActivePage && setActivePage('legal')} style={{ background: 'none', border: 'none', color: 'var(--text-gold)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem', padding: 0 }}>Privacy Policy</button>
                          {' '}and{' '}
                          <button type="button" onClick={() => setActivePage && setActivePage('legal')} style={{ background: 'none', border: 'none', color: 'var(--text-gold)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem', padding: 0 }}>Terms of Service</button>
                        </>
                      )}
                    </span>
                  </label>
                </div>
              )}

              <button type="submit" className="btn-primary" style={styles.submitBtn}>
                <Key size={14} />
                <span>{isSignUpMode ? t('authSignUpSubmit') : t('authSubmit')}</span>
              </button>
            </form>

            <button 
              onClick={() => { setIsSignUpMode(!isSignUpMode); setAuthError(""); setPassword(""); setConfirmPassword(""); setAgeConsent(false); setPrivacyConsent(false); }} 
              style={styles.toggleBtn}
            >
              {isSignUpMode ? t('authToggleToLogin') : t('authToggleToSignUp')}
            </button>
          </div>
        )
      ) : (
        // ================= PREMIUM MEMBERS / TEACHERS / ADMINS DASHBOARD =================
        <div style={styles.dashboardContainer} className="fade-in">
          
          {/* Welcome profile card */}
          <div style={styles.profileHeaderCard} className="glass-panel">
            <div className="islamic-pattern"></div>
            
            <div style={styles.profileInfoRow}>
              {/* Profile Avatar */}
              <div style={styles.avatarCircle}>
                <span style={styles.avatarBig}>{user.avatar}</span>
              </div>

              <div style={styles.profileMeta}>
                {isEditingProfile ? (
                  <div style={styles.editForm}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={styles.editNameInput}
                    />
                    
                    {/* Avatar picker */}
                    <div style={styles.avatarPicker}>
                      {avatarsList.map(av => (
                        <button 
                          key={av} 
                          onClick={() => setEditAvatar(av)}
                          style={{
                            ...styles.pickerEmoji,
                            border: editAvatar === av ? '2px solid var(--gold-primary)' : '1px solid transparent'
                          }}
                        >
                          {av}
                        </button>
                      ))}
                    </div>

                    <button onClick={handleSaveProfile} style={styles.saveProfileBtn} className="btn-primary">
                      <Check size={12} />
                      <span>{language === 'en' ? "Save" : "حفظ"}</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 style={styles.userName} className="gold-gradient-text">
                      {t('authWelcome')}, {user.name}
                    </h2>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                      <span style={styles.userRoleBadge}>{user.role}</span>
                      {user.teacherLevel && (
                        <span style={styles.teacherLevelBadge}>
                          🎓 {language === 'ar' ? `حافظ لـ ${user.teacherLevel} أجزاء` : `${user.teacherLevel} Juz' Memorizer`}
                        </span>
                      )}
                    </div>

                    <p style={styles.userEmail}>{user.email}</p>
                    <span style={styles.memberSince}>
                      {language === 'en' ? `Member since: ${user.memberSince}` : `عضو منذ: ${user.memberSince}`}
                    </span>
                    
                    <button onClick={() => setIsEditingProfile(true)} style={styles.editTriggerBtn}>
                      <Edit2 size={12} />
                      <span>{language === 'en' ? "Edit Profile" : "تعديل الملف"}</span>
                    </button>
                  </>
                )}
              </div>

              {/* Point highlights card */}
              <div style={styles.pointsBadgeCard} className="glass-panel">
                <Award size={24} color="var(--text-gold)" />
                <div>
                  <div style={styles.badgeCount}>{dailyScore} XP</div>
                  <div style={styles.badgeLabel}>{language === 'ar' ? "النقاط اليومية" : "Daily Score"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Dashboard Navigation tabs */}
          <div style={styles.tabRow} className="glass-panel">
            <button 
              onClick={() => setActiveTab("my_recordings")} 
              style={{
                ...styles.tabBtn,
                color: activeTab === 'my_recordings' ? 'var(--text-gold)' : 'var(--text-secondary)',
                background: activeTab === 'my_recordings' ? 'rgba(212,175,55,0.08)' : 'transparent'
              }}
            >
              <Mic size={14} />
              <span>{language === 'ar' ? "تلاواتي الخاصة" : "My Recitations"}</span>
            </button>

            <button 
              onClick={() => setActiveTab("saved_bookmarks")} 
              style={{
                ...styles.tabBtn,
                color: activeTab === 'saved_bookmarks' ? 'var(--text-gold)' : 'var(--text-secondary)',
                background: activeTab === 'saved_bookmarks' ? 'rgba(212,175,55,0.08)' : 'transparent'
              }}
            >
              <Bookmark size={14} />
              <span>{language === 'ar' ? "العلامات المحفوظة" : "Bookmarks"}</span>
            </button>

            <button 
              onClick={() => setActiveTab("friend_requests")} 
              style={{
                ...styles.tabBtn,
                color: activeTab === 'friend_requests' ? 'var(--text-gold)' : 'var(--text-secondary)',
                background: activeTab === 'friend_requests' ? 'rgba(212,175,55,0.08)' : 'transparent'
              }}
            >
              <UserPlus size={14} />
              {friendRequestsReceived.length > 0 && (
                <span style={styles.reqCountBubble}>{friendRequestsReceived.length}</span>
              )}
              <span>{language === 'ar' ? "طلبات الصداقة" : "Friend Requests"}</span>
            </button>

            <button 
              onClick={() => setActiveTab("teacher_center")} 
              style={{
                ...styles.tabBtn,
                color: activeTab === 'teacher_center' ? 'var(--text-gold)' : 'var(--text-secondary)',
                background: activeTab === 'teacher_center' ? 'rgba(212,175,55,0.08)' : 'transparent'
              }}
            >
              <Award size={14} />
              <span>{language === 'ar' ? "مركز المعلمين" : "Teacher Center"}</span>
            </button>

            {user.role === "Admin" && (
              <button 
                onClick={() => setActiveTab("admin_portal")} 
                style={{
                  ...styles.tabBtn,
                  color: activeTab === 'admin_portal' ? 'var(--text-gold)' : 'var(--text-secondary)',
                  background: activeTab === 'admin_portal' ? 'rgba(212,175,55,0.08)' : 'transparent'
                }}
              >
                <Shield size={14} />
                <span>{language === 'ar' ? "لوحة التحكم للمسؤول" : "Admin Dashboard"}</span>
              </button>
            )}
          </div>

          {/* ================= TAB 1: USER RECITE SUBMISSIONS ================= */}
          {activeTab === "my_recordings" && (
            <div className="grid-2 fade-in" style={{ marginTop: '10px' }}>
              {mySubmissions.length > 0 ? (
                mySubmissions.map(sub => (
                  <div key={sub.id} style={styles.recitationCard} className="glass-panel">
                    <div style={styles.cardHeader}>
                      <div>
                        <strong style={{ color: 'var(--text-gold)', fontSize: '1.1rem' }}>
                          {language === 'ar' ? `سورة ${sub.surahNameAr || sub.surahName}` : `Surah ${sub.surahName}`}
                        </strong>
                        <div style={styles.cardMeta}>
                          Juz' {sub.juz || 30} • Verses {sub.ayahFrom} - {sub.ayahTo}
                        </div>
                        <span style={styles.cardDate}>{sub.date}</span>
                      </div>
                      <button 
                        onClick={() => deleteTasmeeSubmission(sub.id)} 
                        style={styles.removeBookmarkBtn}
                      >
                        ×
                      </button>
                    </div>

                    <div style={styles.playerSection}>
                      <span style={styles.audioLabel}>{language === 'ar' ? "تلاوتك المسجلة:" : "Your Recitation:"}</span>
                      <audio src={sub.audioData} controls style={styles.audioControl} />
                    </div>

                    <div style={{...styles.feedbackArea, borderColor: sub.rating ? 'var(--border-gold)' : 'rgba(255,255,255,0.05)'}} className="glass-panel">
                      {!sub.rating ? (
                        <div style={styles.pendingEval}>
                          <Loader size={16} className="spin-pulse" color="var(--text-gold)" style={{ marginRight: '6px' }} />
                          <span style={{color: 'var(--text-gold)', fontWeight: 'bold'}}>
                            {language === 'ar' ? "قيد التقييم من المعلم..." : "Recitation under review..."}
                          </span>
                        </div>
                      ) : (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span style={styles.evalLabel}>{language === 'ar' ? "تقييم المعلم المعتمد:" : "Certified Teacher Grading:"}</span>
                            <div style={styles.starsRow}>
                              {Array.from({length: 5}).map((_, idx) => (
                                <Star key={idx} size={12} color={idx < sub.rating ? "var(--text-gold)" : "var(--text-muted)"} fill={idx < sub.rating ? "var(--text-gold)" : "none"} />
                              ))}
                            </div>
                          </div>
                          <p style={styles.evalComment}>"{sub.comments}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{...styles.emptyNotice, gridColumn: '1 / -1'}} className="glass-panel">
                  <span>{language === 'ar' ? "لم تسجل أي تلاوة للتسميع بعد." : "No Tasmee recitations recorded yet."}</span>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: PERSONAL BOOKMARKS ================= */}
          {activeTab === "saved_bookmarks" && (
            <div className="grid-2 fade-in" style={{ marginTop: '10px' }}>
              <div style={styles.bookmarkPanel} className="glass-panel">
                <h4 style={styles.panelTitle}>{language === 'en' ? "Saved Quran Verses" : "الآيات المحفوظة"}</h4>
                <div style={styles.bookmarkList}>
                  {bookmarks.verses.length > 0 ? (
                    bookmarks.verses.map(v => (
                      <div key={v.id} style={styles.bookmarkItemRow} className="glass-panel">
                        <div style={{ flexGrow: 1 }}>
                          <strong style={{ color: 'var(--text-gold)' }}>{v.surahName} ({v.num})</strong>
                          <p style={styles.bookmarkAr} className="arabic-text">{v.ar}</p>
                        </div>
                        <button onClick={() => toggleBookmark('verses', v)} style={styles.removeBookmarkBtn}>×</button>
                      </div>
                    ))
                  ) : (
                    <div style={styles.emptyNotice}><span>{language === 'en' ? "No saved verses yet." : "لا توجد آيات محفوظة بعد."}</span></div>
                  )}
                </div>
              </div>

              <div style={styles.bookmarkPanel} className="glass-panel">
                <h4 style={styles.panelTitle}>{language === 'en' ? "Saved Articles" : "المقالات المحفوظة"}</h4>
                <div style={styles.bookmarkList}>
                  {bookmarks.articles.length > 0 ? (
                    bookmarks.articles.map(a => (
                      <div key={a.id} style={styles.bookmarkItemRow} className="glass-panel" onClick={() => setActivePage('articles')}>
                        <div style={{ flexGrow: 1 }}>
                          <strong style={{ color: 'var(--text-gold)' }}>{language === 'en' ? a.title : a.titleAr}</strong>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleBookmark('articles', a); }} style={styles.removeBookmarkBtn}>×</button>
                      </div>
                    ))
                  ) : (
                    <div style={styles.emptyNotice}><span>{language === 'en' ? "No saved articles yet." : "لا توجد مقالات محفوظة بعد."}</span></div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: FRIEND REQUEST SYSTEM UI ================= */}
          {activeTab === "friend_requests" && (
            <div style={styles.requestsPanel} className="glass-panel fade-in">
              <h3 style={styles.sectionTitle}>{language === 'ar' ? "طلبات الصداقة المعلقة" : "Pending Friend Requests"}</h3>
              
              <div style={styles.requestsList}>
                {friendRequestsReceived.length > 0 ? (
                  friendRequestsReceived.map(req => (
                    <div key={req.email} style={styles.reqRow} className="glass-panel">
                      <span style={styles.reqAvatar}>{req.avatar || "🧕"}</span>
                      <div style={{ flexGrow: 1 }}>
                        <div style={styles.reqName}>{req.name}</div>
                        <span style={styles.reqRole}>{req.role || "Premium Member"}</span>
                      </div>
                      
                      <div style={styles.reqActions}>
                        <button onClick={() => acceptFriendRequest(req)} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                          {language === 'ar' ? "قبول" : "Accept"}
                        </button>
                        <button onClick={() => declineFriendRequest(req)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                          {language === 'ar' ? "رفض" : "Decline"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={styles.emptyNotice}>
                    <span>{language === 'ar' ? "لا توجد طلبات صداقة واردة حالياً." : "No incoming friend requests pending."}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 4: TEACHER REGISTRATION & 30-QUESTION EXAM ================= */}
          {activeTab === "teacher_center" && (
            <div style={styles.examPanel} className="glass-panel fade-in">
              {!isExamActive && !examFinished ? (
                // 1. Initial Apply screen
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Award size={48} color="var(--text-gold)" style={{ alignSelf: 'center' }} />
                  <h3 style={styles.sectionTitle} className="gold-gradient-text">
                    {language === 'ar' ? "اعتماد معلمين القرآن الكريم الموثوقين" : "Certified Quran Memorization & Hifz Exam"}
                  </h3>
                  
                  <p style={styles.examIntroText}>
                    {language === 'ar' 
                      ? "يتيح لك مركز المعلمين التقديم للحصول على رتبة 'معلم معتمد' لمراجعة وتصحيح تلاوات الطلاب الصوتية. الشروط: حفظ 5 أجزاء فأكثر، واجتياز اختبار الحفظ المكون من أسئلة تغطي الأجزاء المحددة (سؤال لكل جزء) في زمن قدره 30 دقيقة بنسبة نجاح 80%."
                      : "Apply for 'Certified Teacher' status to review and correct student recitations. Requirements: Memorized 5+ Juz' and passing the interactive Hifz exam (one question per selected Juz') in 30 minutes (80% score required)."}
                  </p>

                  <div style={{ ...styles.memorizeSelectorBox, maxWidth: '100%' }} className="glass-panel">
                    <label style={{ fontSize: '0.95rem', color: 'var(--text-gold)', fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>
                      {language === 'ar' ? "حدد أجزاء القرآن الكريم التي تحفظها بالضغط عليها (5 أجزاء كحد أدنى):" : "Select the Juz' you have memorized by tapping them (min 5 Juz'):"}
                    </label>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))',
                      gap: '8px',
                      marginTop: '12px',
                      padding: '10px',
                      maxHeight: '260px',
                      overflowY: 'auto',
                      background: 'rgba(0,0,0,0.15)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-gold)'
                    }}>
                      {Array.from({ length: 30 }).map((_, idx) => {
                        const juzNum = idx + 1;
                        const isSelected = selectedJuzList.includes(juzNum);
                        return (
                          <button
                            key={juzNum}
                            type="button"
                            onClick={() => {
                              setSelectedJuzList(prev => 
                                prev.includes(juzNum) 
                                  ? prev.filter(n => n !== juzNum) 
                                  : [...prev, juzNum]
                              );
                            }}
                            style={{
                              padding: '10px 4px',
                              borderRadius: '8px',
                              border: isSelected ? '1.5px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.06)',
                              background: isSelected ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.02)',
                              color: isSelected ? 'var(--text-gold)' : 'var(--text-secondary)',
                              fontWeight: '700',
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              textAlign: 'center',
                            }}
                          >
                            {language === 'ar' ? `جزء ${juzNum}` : `Juz' ${juzNum}`}
                          </button>
                        );
                      })}
                    </div>
                    
                    <div style={{ marginTop: '12px', fontSize: '0.88rem', color: selectedJuzList.length >= 5 ? '#22c55e' : '#ff6b6b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                      {selectedJuzList.length >= 5 ? <Check size={16} /> : <AlertCircle size={16} />}
                      <span>
                        {language === 'ar' 
                          ? `عدد الأجزاء المحددة: ${selectedJuzList.length} (مستوفٍ للشروط)`
                          : `Selected Parts: ${selectedJuzList.length} Juz' (Qualified)`}
                      </span>
                    </div>
                  </div>

                  {selectedJuzList.length >= 5 ? (
                    <button onClick={handleStartExam} className="btn-primary" style={styles.startExamBtn}>
                      <Play size={14} />
                      <span>{language === 'ar' ? "بدء الاختبار المعتمد (30 دقيقة)" : "Start Certification Exam"}</span>
                    </button>
                  ) : (
                    <div style={styles.examDeniedBox}>
                      <AlertCircle size={16} />
                      <span>
                        {language === 'ar' 
                          ? "عذراً، يجب اختيار 5 أجزاء أو أكثر لتتمكن من بدء اختبار المعلم المعتمد." 
                          : "Please select at least 5 Juz' to enable the certified teacher exam."}
                      </span>
                    </div>
                  )}
                </div>
              ) : isExamActive ? (
                // 2. Active Certification Quiz
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={styles.examHeader}>
                    <span style={styles.examTimer}>
                      <Clock size={14} style={{ marginRight: '6px' }} />
                      {language === 'ar' ? "الوقت المتبقي: " : "Time Left: "} {formatTime(examTimeLeft)}
                    </span>
                    <span style={styles.examProgress}>
                      {language === 'ar' 
                        ? `سؤال ${examCurrentQuestionIdx + 1} من ${activeQuestions.length}` 
                        : `Question ${examCurrentQuestionIdx + 1} of ${activeQuestions.length}`}
                    </span>
                  </div>

                  {/* Question body */}
                  <div style={styles.questionCard} className="glass-panel">
                    <h3 style={styles.questionTitle}>
                      {language === 'ar' 
                        ? (activeQuestions[examCurrentQuestionIdx]?.qAr || "") 
                        : (activeQuestions[examCurrentQuestionIdx]?.q || "")}
                    </h3>
                  </div>

                  {/* Answers row */}
                  <div style={styles.answersList}>
                    {(activeQuestions[examCurrentQuestionIdx]?.options || []).map((opt, oIdx) => {
                      const isSelected = examAnswers[examCurrentQuestionIdx] === oIdx;
                      return (
                        <button 
                          key={oIdx} 
                          onClick={() => handleSelectExamAnswer(examCurrentQuestionIdx, oIdx)}
                          style={{
                            ...styles.answerBtn,
                            borderColor: isSelected ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                            background: isSelected ? 'rgba(212,175,55,0.08)' : 'transparent',
                            flexDirection: language === 'ar' ? 'row-reverse' : 'row',
                            justifyContent: language === 'ar' ? 'flex-end' : 'flex-start',
                          }}
                          className="glass-panel"
                        >
                          <span style={styles.answerDot}>{oIdx + 1}.</span>
                          <span style={{ flexGrow: 1, textAlign: language === 'ar' ? 'right' : 'left' }}>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div style={styles.examActionsRow}>
                    <button 
                      onClick={() => setExamCurrentQuestionIdx(p => Math.max(0, p - 1))}
                      disabled={examCurrentQuestionIdx === 0}
                      className="btn-secondary"
                      style={{ flex: 1 }}
                    >
                      {language === 'ar' ? "السابق" : "Previous"}
                    </button>

                    {examCurrentQuestionIdx < activeQuestions.length - 1 ? (
                      <button 
                        onClick={() => setExamCurrentQuestionIdx(p => Math.min(activeQuestions.length - 1, p + 1))}
                        className="btn-primary"
                        style={{ flex: 1 }}
                      >
                        {language === 'ar' ? "التالي" : "Next"}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleFinishExam(false)} 
                        className="btn-primary"
                        style={{ flex: 1, background: 'var(--gold-gradient)' }}
                      >
                        {language === 'ar' ? "تسجيل وإنهاء الاختبار" : "Submit Exam"}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                // 3. Quiz Complete / Results
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-in">
                  <CheckCircle2 
                    size={48} 
                    color={examScore >= Math.ceil(activeQuestions.length * 0.8) ? "var(--text-gold)" : "#ff6b6b"} 
                    style={{ alignSelf: 'center' }} 
                  />
                  
                  <h3 style={styles.sectionTitle} className="gold-gradient-text">
                    {examScore >= Math.ceil(activeQuestions.length * 0.8) 
                      ? (language === 'ar' ? "✨ مبارك! لقد اجتزت الاختبار بنجاح ✨" : "✨ Congratulations! You Passed! ✨")
                      : (language === 'ar' ? "عذراً، لم تجتز الاختبار هذه المرة" : "Exam Not Passed")}
                  </h3>

                  <div style={styles.examScoreCard} className="glass-panel">
                    <span style={styles.scoreVal}>
                      {language === 'ar' ? `${examScore} من ${activeQuestions.length}` : `${examScore} / ${activeQuestions.length}`}
                    </span>
                    <p style={styles.scoreLabel}>
                      {language === 'ar' 
                        ? `نسبتك: ${Math.round((examScore / activeQuestions.length) * 100)}% (المطلوب 80% للتأهيل)` 
                        : `Your Score: ${Math.round((examScore / activeQuestions.length) * 100)}% (80% required)`}
                    </p>
                  </div>

                  {examScore >= Math.ceil(activeQuestions.length * 0.8) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {language === 'ar' 
                          ? "تمت ترقيتك رسمياً لرتبة 'معلم معتمد'. يمكنك الآن تقديم تلاوات وتصحيحها والحصول على شارات خاصة بجوار اسمك!"
                          : "You have been upgraded to 'Certified Teacher'. You can now evaluate and correct student recitations!"}
                      </p>
                      
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => { setExamFinished(false); setActiveTab("my_recordings"); }} 
                          className="btn-primary" 
                          style={{ minWidth: '140px' }}
                        >
                          {language === 'ar' ? "الذهاب للوحة التحكم" : "Go to Dashboard"}
                        </button>
                        <button 
                          onClick={() => { setExamFinished(false); setIsExamActive(false); }} 
                          className="btn-secondary" 
                          style={{ minWidth: '140px' }}
                        >
                          {language === 'ar' ? "الرجوع لتحديد الأجزاء" : "Back to Juz' Selection"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {language === 'ar' 
                          ? "لا تقلق! يمكنك تثبيت حفظك والمحاولة مجدداً في أي وقت."
                          : "Don't worry! Review your Quran memorization and try again anytime."}
                      </p>
                      
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
                        <button 
                          onClick={handleStartExam} 
                          className="btn-primary" 
                          style={{ minWidth: '140px' }}
                        >
                          {language === 'ar' ? "إعادة خوض الاختبار" : "Retry Exam"}
                        </button>
                        <button 
                          onClick={() => { setExamFinished(false); setIsExamActive(false); }} 
                          className="btn-secondary" 
                          style={{ minWidth: '140px' }}
                        >
                          {language === 'ar' ? "الرجوع لتحديد الأجزاء" : "Back to Juz' Selection"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 5: ADMIN PORTAL SECTION ================= */}
          {activeTab === "admin_portal" && user.role === "Admin" && (
            <div style={styles.adminPanel} className="glass-panel fade-in">
              
              {/* Role Switcher Toggle */}
              <div style={styles.adminCardHeader} className="glass-panel">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={18} color="var(--text-gold)" />
                  <h4 style={styles.adminCardTitle}>{language === 'ar' ? "مبدل الأدوار السريع للمسؤول" : "Admin Quick Role Switcher"}</h4>
                </div>

                <div style={styles.adminRoleRow}>
                  <button 
                    onClick={() => { updateUserRole("Admin"); setActiveAdminRole("Admin"); }}
                    style={{
                      ...styles.roleSwitchBtn,
                      background: activeAdminRole === "Admin" ? 'var(--gold-gradient)' : 'transparent',
                      color: activeAdminRole === "Admin" ? '#000' : 'var(--text-primary)'
                    }}
                  >
                    Admin
                  </button>
                  <button 
                    onClick={() => { updateUserRole("Certified Teacher", "15"); setActiveAdminRole("Certified Teacher"); }}
                    style={{
                      ...styles.roleSwitchBtn,
                      background: activeAdminRole === "Certified Teacher" ? 'var(--gold-gradient)' : 'transparent',
                      color: activeAdminRole === "Certified Teacher" ? '#000' : 'var(--text-primary)'
                    }}
                  >
                    Teacher
                  </button>
                  <button 
                    onClick={() => { updateUserRole("Premium Member"); setActiveAdminRole("Premium Member"); }}
                    style={{
                      ...styles.roleSwitchBtn,
                      background: activeAdminRole === "Premium Member" ? 'var(--gold-gradient)' : 'transparent',
                      color: activeAdminRole === "Premium Member" ? '#000' : 'var(--text-primary)'
                    }}
                  >
                    User
                  </button>
                </div>
              </div>

              {/* Bot Activity Frequency Slider Controller */}
              <div style={styles.botSettingsCard} className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ ...styles.adminCardTitle, margin: 0 }}>
                    {language === 'ar' ? "التحكم في نشاط المستخدمين الوهميين (Bots)" : "Simulated Active Worshippers Controls"}
                  </h4>
                  
                  <button 
                    onClick={() => setBotSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                    className="btn-primary"
                    style={{
                      padding: '6px 14px', 
                      fontSize: '0.78rem',
                      background: botSettings.enabled ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.05)',
                      color: botSettings.enabled ? '#000' : 'var(--text-primary)'
                    }}
                  >
                    {botSettings.enabled ? (language === 'ar' ? "إيقاف التشغيل" : "Disable Bots") : (language === 'ar' ? "تمكين النشاط" : "Enable Bots")}
                  </button>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-gold)', display: 'block', marginBottom: '8px' }}>
                    {language === 'ar' ? `سرعة وتيرة نشاط الروبوتات: كل ${botSettings.frequency / 1000} ثوانٍ` : `Bot Event Scheduler frequency: Every ${botSettings.frequency / 1000}s`}
                  </label>
                  <input 
                    type="range"
                    min={3000} 
                    max={20000} 
                    step={1000}
                    value={botSettings.frequency}
                    onChange={(e) => setBotSettings(prev => ({ ...prev, frequency: parseInt(e.target.value, 10) }))}
                    style={styles.adminRangeSlider}
                  />
                </div>
              </div>

              {/* Leaderboard panel */}
              <div style={styles.leaderboardCard} className="glass-panel">
                <h4 style={styles.adminCardTitle}>{language === 'ar' ? "جدول المتصدرين والنقاط اليومية" : "Daily Score Leaderboard"}</h4>
                
                <div style={styles.leaderboardTable}>
                  <div style={styles.tableRowHeader}>
                    <span>{language === 'ar' ? "المستخدم" : "Worshipper"}</span>
                    <span>{language === 'ar' ? "الرتبة" : "Role"}</span>
                    <span>{language === 'ar' ? "النقاط" : "Daily Score"}</span>
                  </div>

                  <div style={styles.tableBody}>
                    <div style={styles.tableRowItem}>
                      <strong>⭐ Sally Ali (You)</strong>
                      <span>{user.role}</span>
                      <strong style={{ color: 'var(--text-gold)' }}>{dailyScore} XP</strong>
                    </div>
                    {mockBots.slice(0, 4).map((bot, idx) => (
                      <div key={idx} style={styles.tableRowItem}>
                        <span>{bot.name}</span>
                        <span>{bot.role}</span>
                        <span>{idx === 0 ? 340 : (idx === 1 ? 210 : 150)} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Admin/Teacher Article publisher form */}
              <div style={styles.articlePublisherCard} className="glass-panel">
                <h4 style={styles.adminCardTitle}>{language === 'ar' ? "كتابة ونشر مقال إسلامي جديد" : "Publish Premium Islamic Article"}</h4>
                
                {artPublishSuccess && (
                  <div style={styles.successPubBanner}>
                    <span>✨ {language === 'ar' ? "تم نشر المقال بنجاح في المنصة الرئيسية!" : "Article published successfully to global Feed!"} ✨</span>
                  </div>
                )}

                <form onSubmit={handlePublishArticle} style={styles.pubForm}>
                  <div style={styles.pubRow}>
                    <div style={styles.formGroup} className="flex-1">
                      <label style={styles.formLabel}>Title (English)</label>
                      <input 
                        type="text" 
                        required 
                        value={newArtTitle} 
                        onChange={(e) => setNewArtTitle(e.target.value)}
                        placeholder="Article title..."
                        style={styles.pubInput}
                      />
                    </div>
                    <div style={styles.formGroup} className="flex-1">
                      <label style={styles.formLabel}>العنوان (عربي)</label>
                      <input 
                        type="text" 
                        required 
                        value={newArtTitleAr} 
                        onChange={(e) => setNewArtTitleAr(e.target.value)}
                        placeholder="عنوان المقال..."
                        style={styles.pubInput}
                      />
                    </div>
                  </div>

                  <div style={styles.pubRow}>
                    <div style={styles.formGroup} className="flex-1">
                      <label style={styles.formLabel}>Category</label>
                      <select 
                        value={newArtCategory} 
                        onChange={(e) => setNewArtCategory(e.target.value)}
                        style={styles.pubSelect}
                      >
                        <option value="Faith">Faith (إيمانيات)</option>
                        <option value="Tafsir">Tafsir (تفسير)</option>
                        <option value="Arabic Learning">Arabic Learning (تعلم العربية)</option>
                      </select>
                    </div>

                    <div style={styles.formGroup} className="flex-1">
                      <label style={styles.formLabel}>Read Time (Minutes)</label>
                      <input 
                        type="number" 
                        min={1} 
                        required
                        value={newArtReadTime} 
                        onChange={(e) => setNewArtReadTime(e.target.value)}
                        style={styles.pubInput}
                      />
                    </div>
                  </div>

                  <div style={styles.pubRow}>
                    <div style={styles.formGroup} className="flex-1">
                      <label style={styles.formLabel}>Summary Description (English)</label>
                      <input 
                        type="text" 
                        required 
                        value={newArtSummary} 
                        onChange={(e) => setNewArtSummary(e.target.value)}
                        placeholder="Brief summary..."
                        style={styles.pubInput}
                      />
                    </div>
                    <div style={styles.formGroup} className="flex-1">
                      <label style={styles.formLabel}>الوصف والملخص (عربي)</label>
                      <input 
                        type="text" 
                        required 
                        value={newArtSummaryAr} 
                        onChange={(e) => setNewArtSummaryAr(e.target.value)}
                        placeholder="ملخص قصير..."
                        style={styles.pubInput}
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Main Content (English)</label>
                    <textarea 
                      required 
                      value={newArtContent} 
                      onChange={(e) => setNewArtContent(e.target.value)}
                      placeholder="Write article details here..."
                      style={styles.pubTextArea}
                      rows={5}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>المحتوى الرئيسي (عربي)</label>
                    <textarea 
                      required 
                      value={newArtContentAr} 
                      onChange={(e) => setNewArtContentAr(e.target.value)}
                      placeholder="اكتب تفاصيل المقال هنا..."
                      style={styles.pubTextArea}
                      rows={5}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '12px', justifyContent: 'center' }}>
                    <Send size={14} />
                    <span>{language === 'ar' ? "نشر المقال الفوري" : "Publish Article"}</span>
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* Logout Action */}
          <button onClick={logout} style={styles.logoutBtn} className="btn-secondary">
            <span>{t('navLogout')}</span>
          </button>

        </div>
      )}

    </div>
  );
}

const styles = {
  authContainer: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '40px 30px',
    borderRadius: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  authHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '30px',
  },
  authIcon: {
    marginBottom: '10px',
    filter: 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.4))',
  },
  authTitle: {
    fontSize: '1.8rem',
    color: 'var(--text-primary)',
  },
  authSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '6px',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    background: 'rgba(255, 107, 107, 0.05)',
    border: '1px solid rgba(255, 107, 107, 0.2)',
    borderRadius: '10px',
    color: '#ff6b6b',
    fontSize: '0.85rem',
    marginBottom: '20px',
  },
  authForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
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
  },
  formInput: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
  },
  passHint: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    marginTop: '2px',
  },
  submitBtn: {
    marginTop: '10px',
    justifyContent: 'center',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-gold)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    marginTop: '20px',
    width: '100%',
    textAlign: 'center',
    fontWeight: '600',
  },
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  profileHeaderCard: {
    position: 'relative',
    padding: '40px 30px',
    borderRadius: '24px',
    overflow: 'hidden',
  },
  profileInfoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    flexWrap: 'wrap',
  },
  avatarCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(255, 255, 255, 0.02) 80%)',
    border: '3px solid var(--gold-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-gold-intense)',
  },
  avatarBig: {
    fontSize: '3.5rem',
  },
  profileMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flexGrow: 1,
  },
  userName: {
    fontSize: '2rem',
    fontWeight: '700',
  },
  userRoleBadge: {
    alignSelf: 'flex-start',
    background: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid var(--border-gold)',
    color: 'var(--text-gold)',
    fontSize: '0.75rem',
    padding: '3px 10px',
    borderRadius: '20px',
    fontWeight: '600',
  },
  teacherLevelBadge: {
    alignSelf: 'flex-start',
    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
    border: '1px solid var(--gold-primary)',
    color: 'var(--text-gold)',
    boxShadow: '0 0 10px rgba(212, 175, 55, 0.15)',
    fontSize: '0.78rem',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: '700',
  },
  userEmail: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginTop: '6px',
  },
  memberSince: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  editTriggerBtn: {
    alignSelf: 'flex-start',
    background: 'none',
    border: 'none',
    color: 'var(--text-gold)',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '12px',
  },
  pointsBadgeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px 24px',
    borderRadius: '16px',
    background: 'rgba(212, 175, 55, 0.05)',
  },
  badgeCount: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: 'var(--text-gold)',
    lineHeight: '1.1',
  },
  badgeLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '320px',
  },
  editNameInput: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-gold)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
  },
  avatarPicker: {
    display: 'flex',
    gap: '8px',
  },
  pickerEmoji: {
    fontSize: '1.25rem',
    background: 'none',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveProfileBtn: {
    alignSelf: 'flex-start',
    padding: '6px 14px',
    fontSize: '0.8rem',
  },
  tabRow: {
    display: 'flex',
    gap: '10px',
    padding: '8px',
    borderRadius: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  reqCountBubble: {
    background: '#ff6b6b',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '2px',
    right: '2px',
  },
  recitationCard: {
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardMeta: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  cardDate: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
  },
  playerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  audioLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-gold)',
    fontWeight: '600',
  },
  audioControl: {
    width: '100%',
    height: '40px',
    borderRadius: '8px',
    outline: 'none',
  },
  feedbackArea: {
    padding: '14px',
    borderRadius: '12px',
    border: '1px dashed',
    marginTop: '6px',
  },
  pendingEval: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
  },
  evalLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-gold)',
    fontWeight: '700',
  },
  starsRow: {
    display: 'flex',
    gap: '3px',
  },
  evalComment: {
    fontSize: '0.88rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
    fontStyle: 'italic',
    marginTop: '4px',
  },
  removeBookmarkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '1.4rem',
    cursor: 'pointer',
  },
  bookmarkPanel: {
    padding: '20px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  panelTitle: {
    fontSize: '1.1rem',
    color: 'var(--text-gold)',
    fontWeight: '700',
  },
  bookmarkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  bookmarkItemRow: {
    padding: '14px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookmarkAr: {
    fontSize: '1.2rem',
    color: 'var(--text-gold)',
    textAlign: 'right',
    marginTop: '4px',
  },
  emptyNotice: {
    padding: '30px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
  requestsPanel: {
    padding: '30px 24px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  reqRow: {
    padding: '14px 20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  reqAvatar: {
    fontSize: '1.6rem',
    width: '40px',
    height: '40px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqName: {
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  reqRole: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  reqActions: {
    display: 'flex',
    gap: '10px',
  },
  examPanel: {
    padding: '40px 30px',
    borderRadius: '24px',
  },
  examIntroText: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    maxWidth: '650px',
    margin: '0 auto',
  },
  memorizeSelectorBox: {
    padding: '20px',
    borderRadius: '16px',
    maxWidth: '450px',
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  memorizeSelect: {
    background: '#0f111a',
    border: '1px solid var(--border-gold)',
    borderRadius: '8px',
    padding: '10px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
  },
  startExamBtn: {
    padding: '14px 30px',
    fontSize: '1rem',
    alignSelf: 'center',
  },
  examDeniedBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    color: '#ff6b6b',
    fontSize: '0.88rem',
    background: 'rgba(255, 107, 107, 0.05)',
    border: '1px solid rgba(255, 107, 107, 0.2)',
    borderRadius: '12px',
    padding: '12px',
    maxWidth: '550px',
    margin: '20px auto 0 auto',
  },
  examHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '14px',
  },
  examTimer: {
    fontSize: '0.9rem',
    color: '#ff6b6b',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  examProgress: {
    fontSize: '0.9rem',
    color: 'var(--text-gold)',
    fontWeight: 'bold',
  },
  questionCard: {
    padding: '30px 24px',
    borderRadius: '16px',
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  questionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    lineHeight: '1.5',
  },
  answersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  answerBtn: {
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1.5px solid',
    cursor: 'pointer',
    display: 'flex',
    gap: '12px',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    width: '100%',
    color: 'var(--text-primary)',
    alignItems: 'center',
  },
  answerDot: {
    color: 'var(--text-gold)',
    fontWeight: 'bold',
  },
  examActionsRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  },
  examScoreCard: {
    padding: '30px 20px',
    borderRadius: '20px',
    maxWidth: '300px',
    margin: '20px auto',
    background: 'rgba(212,175,55,0.05)',
  },
  scoreVal: {
    fontFamily: "'Cairo', 'Poppins', sans-serif",
    fontSize: '2.8rem',
    fontWeight: '900',
    color: 'var(--text-gold)',
    display: 'block',
    lineHeight: '1.2',
    textShadow: '0 0 10px rgba(212, 175, 55, 0.35)',
  },
  scoreLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '6px',
  },
  adminPanel: {
    padding: '30px 24px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  adminCardHeader: {
    padding: '20px',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  adminCardTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--text-gold)',
  },
  adminRoleRow: {
    display: 'flex',
    gap: '8px',
  },
  roleSwitchBtn: {
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border-gold)',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  botSettingsCard: {
    padding: '20px',
    borderRadius: '16px',
  },
  adminRangeSlider: {
    width: '100%',
    accentColor: 'var(--gold-primary)',
    cursor: 'pointer',
  },
  leaderboardCard: {
    padding: '20px',
    borderRadius: '16px',
  },
  leaderboardTable: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
  },
  tableRowHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    padding: '10px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: 'bold',
  },
  tableBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableRowItem: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    padding: '12px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.02)',
    fontSize: '0.85rem',
  },
  articlePublisherCard: {
    padding: '20px',
    borderRadius: '16px',
  },
  pubForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '12px',
  },
  pubRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  pubInput: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: '0.88rem',
    outline: 'none',
  },
  pubSelect: {
    background: '#0f111a',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: '0.88rem',
    outline: 'none',
    cursor: 'pointer',
  },
  pubTextArea: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-gold)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: '0.88rem',
    outline: 'none',
    resize: 'none',
    fontFamily: 'inherit',
  },
  successPubBanner: {
    padding: '10px',
    background: 'rgba(212,175,55,0.08)',
    border: '1px solid var(--border-gold)',
    borderRadius: '8px',
    textAlign: 'center',
    color: 'var(--text-gold)',
    fontWeight: 'bold',
    fontSize: '0.85rem',
  },
  logoutBtn: {
    alignSelf: 'flex-start',
    marginTop: '10px',
  }
};
