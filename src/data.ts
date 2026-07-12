import { Workout, UserProfile, LeaderboardUser, Notification } from "./types";

export const initialWorkouts: Workout[] = [
  {
    id: "upper-body",
    name: "قوة الجزء العلوي",
    exercisesCount: 5,
    durationMinutes: 45,
    category: "قوة عضلة الصدر والأكتاف والذراعين",
    difficulty: "متوسط",
    intensity: "مرتفع",
    calories: 320,
    description: "تمرين مكثف يستهدف تفعيل عضلات الصدر والظهر والأكتاف لزيادة الكتلة والقوة العضلية.",
    steps: [
      { name: "الإحماء ودوران الذراعين", durationSeconds: 180, description: "حركات خفيفة لتهيئة المفاصل وزيادة تدفق الدم" },
      { name: "تمرين الضغط الكلاسيكي (Push-ups)", durationSeconds: 420, description: "3 جولات × 12 تكراراً لتقوية الصدر والترايسبس" },
      { name: "تمرين السحب للظهر (Pull-ups/Rows)", durationSeconds: 480, description: "3 جولات × 10 تكرارات لتقوية عضلة اللاتس والبيسبس" },
      { name: "ضغط الأكتاف بالدمبلز (Shoulder Press)", durationSeconds: 420, description: "3 جولات × 12 تكراراً لتقوية الأكتاف والرقبة" },
      { name: "تمرين بلانك للبطن (Plank)", durationSeconds: 120, description: "تثبيت الجسم لتقوية عضلات الكور والتحمل" }
    ]
  },
  {
    id: "full-body",
    name: "جسم أقوى. أنت أقوى.",
    exercisesCount: 8,
    durationMinutes: 50,
    category: "كارديو وقوة لكامل الجسم",
    difficulty: "متقدم",
    intensity: "مرتفع",
    calories: 450,
    description: "برنامج تدريبي شامل مصمم لحرق الدهون وشد عضلات الجسم كاملة دفعة واحدة.",
    steps: [
      { name: "إحماء قفز الحبل والجري الخفيف", durationSeconds: 300, description: "رفع نبضات القلب وإعداد الجسم للحركة الكثيفة" },
      { name: "تمرين القرفصاء (Squats)", durationSeconds: 360, description: "3 جولات × 15 تكراراً لتفعيل الفخذين والمؤخرة" },
      { name: "تمارين الطعن المتحرك (Lunges)", durationSeconds: 360, description: "3 جولات × 12 تكراراً لكل ساق لزيادة التوازن والتحمل" },
      { name: "تمرين الضغط للأعلى (Overhead Press)", durationSeconds: 300, description: "3 جولات × 12 تكراراً لبناء قوة الجزء العلوي" },
      { name: "تمرين بيربي (Burpees)", durationSeconds: 240, description: "تمرين هوائي قوي جداً لحرق الدهون وتحسين اللياقة" },
      { name: "تمرين تسلق الجبال (Mountain Climbers)", durationSeconds: 180, description: "حرق سريع ومكثف لعضلات البطن والأرجل" },
      { name: "تمرين تمدد الكوبرا والاسترخاء", durationSeconds: 120, description: "تهدئة النبض وتمديد العضلات لتجنب التشنج" }
    ]
  },
  {
    id: "cardio-shred",
    name: "حرق الدهون السريع",
    exercisesCount: 6,
    durationMinutes: 30,
    category: "كارديو مكثف (HIIT)",
    difficulty: "متوسط",
    intensity: "مرتفع",
    calories: 380,
    description: "تمرين هيت مكثف لرفع معدل الحرق إلى أقصى حد وتنشيط الدورة الدموية.",
    steps: [
      { name: "إحماء قفز جاك (Jumping Jacks)", durationSeconds: 120, description: "إحماء خفيف ومنشط لكامل الجسم" },
      { name: "بيربي متواصل (Burpees)", durationSeconds: 180, description: "أقوى تمرين هوائي لحرق السعرات وتحفيز القلب" },
      { name: "القرفصاء مع القفز (Jump Squats)", durationSeconds: 180, description: "تمرين بليومتري لزيادة القوة الانفجارية للأرجل" },
      { name: "تمرين الجري في المكان بـ ركب مرتفعة", durationSeconds: 240, description: "زيادة اللياقة الهوائية والقدرة على التحمل" },
      { name: "الضغط السريع مع لمس الأكتاف", durationSeconds: 180, description: "تحدي القوة والتوازن للجزء العلوي والكور" },
      { name: "تمرين التمدد البارد والاستشفاء", durationSeconds: 180, description: "تخفيض ضربات القلب بلطف" }
    ]
  },
  {
    id: "yoga-stretch",
    name: "المرونة والاسترخاء الذهني",
    exercisesCount: 4,
    durationMinutes: 20,
    category: "تطويل مرونة واسترخاء",
    difficulty: "مبتدئ",
    intensity: "منخفض",
    calories: 120,
    description: "تمارين يوجا تهدف لتخفيف التوتر العضلي، تحسين المرونة واستعادة السلام الداخلي بعد يوم شاق.",
    steps: [
      { name: "تمرين التنفس العميق والتركيز", durationSeconds: 180, description: "استنشاق هادئ وزفير طويل لتهدئة الجهاز العصبي" },
      { name: "وضعية الكلب المنحني لأسفل (Downward Dog)", durationSeconds: 300, description: "إطالة رائعة لعضلات الظهر والفخذ الخلفية" },
      { name: "وضعية المحارب الثابت (Warrior Pose)", durationSeconds: 240, description: "تعزيز استقرار المفاصل وتقوية عضلات الحوض والظهر" },
      { name: "تمرين التمدد الكامل والاستلقاء", durationSeconds: 480, description: "استرخاء كلي لعضلات الجسم وإفراغ الذهن" }
    ]
  }
];

export const initialProfile: UserProfile = {
  name: "إيمون",
  dailyCalorieGoal: 2100,
  consumedCalories: 1450,
  dailyWaterGoal: 3000,
  consumedWater: 1750,
  weight: 78,
  height: 180,
  workoutsThisWeek: 12,
  weeklyCaloriesBurned: 3240,
  activeMinutesToday: 45,
  activeHoursThisWeek: 5.5, // 5 hours 30 mins
  distanceThisWeek: 18.4,
  heartRate: 142,
  completedPercentageToday: 68,
  communityRank: 4,
  points: 1280
};

export const initialLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: "عبدالله العتيبي", points: 1540, isMe: false, avatarColor: "bg-amber-500", workoutsCount: 16 },
  { rank: 2, name: "سارة الأحمد", points: 1420, isMe: false, avatarColor: "bg-emerald-500", workoutsCount: 15 },
  { rank: 3, name: "خالد الحربي", points: 1310, isMe: false, avatarColor: "bg-blue-500", workoutsCount: 14 },
  { rank: 4, name: "إيمون", points: 1280, isMe: true, avatarColor: "bg-lime-500 border-2 border-lime-300 shadow-lg shadow-lime-500/20", workoutsCount: 12 },
  { rank: 5, name: "رائد الغامدي", points: 1150, isMe: false, avatarColor: "bg-purple-500", workoutsCount: 11 },
  { rank: 6, name: "منى الدوسري", points: 1090, isMe: false, avatarColor: "bg-violet-500", workoutsCount: 10 },
  { rank: 7, name: "عمر الهاشمي", points: 980, isMe: false, avatarColor: "bg-cyan-500", workoutsCount: 9 }
];

export const initialNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "مرحباً بك مجدداً! حان وقت تحقيق هدفك الرياضي لليوم 🔥",
    time: "منذ 15 دقيقة",
    isRead: false,
    type: "reminder"
  },
  {
    id: "notif-2",
    title: "رائع! لقد تقدمت إلى المرتبة الرابعة في الترتيب الأسبوعي للياقة البدنية 🏆",
    time: "منذ ساعتين",
    isRead: false,
    type: "achievement"
  },
  {
    id: "notif-3",
    title: "نصيحة اليوم: شرب كوب ماء قبل التمرين بـ30 دقيقة يحسن طاقتك بشكل ملحوظ 💧",
    time: "منذ 5 ساعات",
    isRead: true,
    type: "info"
  }
];
