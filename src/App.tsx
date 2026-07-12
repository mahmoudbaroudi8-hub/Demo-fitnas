import React, { useState } from "react";
import {
  Menu,
  Bell,
  Flame,
  Droplet,
  Heart,
  Timer,
  Zap,
  Dumbbell,
  Trophy,
  Home,
  User,
  Plus,
  Clock,
  Route,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart2,
  Check,
  Compass,
  Smile,
  LogOut,
  Settings,
  FlameKindling,
  ArrowRight,
  MoreHorizontal,
  CheckCircle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Calendar,
  Footprints,
  Info,
  Laptop,
  Smartphone,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import { UserProfile, Workout, LeaderboardUser, Notification } from "./types";
import {
  initialWorkouts,
  initialProfile,
  initialLeaderboard,
  initialNotifications
} from "./data";

import WorkoutTimer from "./components/WorkoutTimer";
import Leaderboard from "./components/Leaderboard";
import ProfileTab from "./components/ProfileTab";
import AddLogModal from "./components/AddLogModal";
import NotificationDrawer from "./components/NotificationDrawer";
import InstallAppModal from "./components/InstallAppModal";

export default function App() {
  // Navigation tabs: 'home' (Page 2), 'progress' (Page 1), 'workouts', 'leaderboard', 'profile'
  const [activeTab, setActiveTab] = useState<"home" | "progress" | "workouts" | "leaderboard" | "profile">("home");

  // State managers
  const [profile, setProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem("fitness_user_profile");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return initialProfile;
      }
    }
    return initialProfile;
  });
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(initialLeaderboard);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Demo 3-day Trial Mode States
  const [demoStartTime, setDemoStartTime] = useState<number | null>(() => {
    const stored = localStorage.getItem("fitness_demo_start");
    return stored ? parseInt(stored) : null;
  });

  const [demoOffset, setDemoOffset] = useState<number>(() => {
    const stored = localStorage.getItem("fitness_demo_offset");
    return stored ? parseInt(stored) : 0;
  });

  const [showPremiumSuccess, setShowPremiumSuccess] = useState<boolean>(false);
  
  // PWA Install States
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  React.useEffect(() => {
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
  };
  
  // Overlay Toggles
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Today progress details expand toggle
  const [showProgressDetails, setShowProgressDetails] = useState(false);

  // Dynamic Activity Tracker States (Request 3 - "تطبيق النشاط")
  const [todaySteps, setTodaySteps] = useState(7842);
  const [stepsGoal, setStepsGoal] = useState(10000);
  const [activeMinutesToday, setActiveMinutesToday] = useState(85); // 1h 25m i.e. 85 mins
  const [distanceToday, setDistanceToday] = useState(6.2); // 6.2 km
  const [progressPeriod, setProgressPeriod] = useState<"day" | "week" | "month">("day");
  
  // Recent Completed Workouts (Request 3)
  const [recentCompletedWorkouts, setRecentCompletedWorkouts] = useState([
    {
      id: "recent-1",
      name: "قوة الجزء العلوي",
      durationMinutes: 45,
      calories: 320,
      timestamp: new Date(),
      completed: true
    },
    {
      id: "recent-2",
      name: "كارديو HIIT",
      durationMinutes: 30,
      calories: 280,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      completed: true
    }
  ]);

  // Helper selectors
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Real-time Action functions
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => {
      const nextProfile = { ...prev, ...updated };
      localStorage.setItem("fitness_user_profile", JSON.stringify(nextProfile));
      return nextProfile;
    });
  };

  // Demo Handlers
  const handleLogin = (name: string, weight: number, height: number, calorieGoal: number) => {
    const newProfile: UserProfile = {
      ...initialProfile,
      name: name,
      weight: weight,
      height: height,
      dailyCalorieGoal: calorieGoal,
      consumedCalories: 0,
      consumedWater: 0,
    };
    setProfile(newProfile);
    localStorage.setItem("fitness_user_profile", JSON.stringify(newProfile));
    
    const now = Date.now();
    setDemoStartTime(now);
    localStorage.setItem("fitness_demo_start", now.toString());
    
    setDemoOffset(0);
    localStorage.setItem("fitness_demo_offset", "0");

    // Prepend a nice welcome notification
    const welcomeNotif: Notification = {
      id: `welcome-${Date.now()}`,
      title: `مرحباً بك يا ${name} في فيتنس برو! بدأت الآن فترتك التجريبية لمدة 3 أيام 🎉`,
      time: "الآن",
      isRead: false,
      type: "achievement"
    };
    setNotifications([welcomeNotif, ...initialNotifications]);
  };

  const handleResetDemo = () => {
    localStorage.removeItem("fitness_demo_start");
    localStorage.removeItem("fitness_demo_offset");
    localStorage.removeItem("fitness_user_profile");
    setDemoStartTime(null);
    setDemoOffset(0);
    setShowPremiumSuccess(false);
    setProfile(initialProfile);
  };

  const handleAddCalories = (amount: number) => {
    setProfile((prev) => {
      const nextConsumed = prev.consumedCalories + amount;
      return {
        ...prev,
        consumedCalories: nextConsumed,
      };
    });

    // Add notification
    const newNotif: Notification = {
      id: `notif-food-${Date.now()}`,
      title: `تم تسجيل وجبة جديدة! تمت إضافة ${amount} سعرة حرارية إلى يومك 🍎`,
      time: "الآن",
      isRead: false,
      type: "info"
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleAddWater = (amount: number) => {
    setProfile((prev) => {
      const nextWater = prev.consumedWater + amount;
      return {
        ...prev,
        consumedWater: nextWater
      };
    });

    // Add notification
    const newNotif: Notification = {
      id: `notif-water-${Date.now()}`,
      title: `رائع! شربت ${amount} مل من الماء. تروي جسمك لتحافظ على نشاطك 💧`,
      time: "الآن",
      isRead: false,
      type: "info"
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleAddWorkoutManual = (name: string, duration: number, calories: number) => {
    // Process logged workout
    setProfile((prev) => {
      const newWorkoutsCount = prev.workoutsThisWeek + 1;
      const newWeeklyCalories = prev.weeklyCaloriesBurned + calories;
      const newActiveHours = prev.activeHoursThisWeek + (duration / 60);
      const newPoints = prev.points + 60; // 60 points for completing a workout
      
      return {
        ...prev,
        workoutsThisWeek: newWorkoutsCount,
        weeklyCaloriesBurned: newWeeklyCalories,
        activeHoursThisWeek: parseFloat(newActiveHours.toFixed(1)),
        points: newPoints,
        completedPercentageToday: Math.min(100, prev.completedPercentageToday + 5)
      };
    });

    // Also update dynamic activity tracker states!
    setActiveMinutesToday((prev) => prev + duration);
    setDistanceToday((prev) => parseFloat((prev + (duration * 0.08)).toFixed(1)));
    setTodaySteps((prev) => prev + (duration * 115)); // ~115 steps per minute

    // Prepend to recentCompletedWorkouts
    setRecentCompletedWorkouts((prev) => [
      {
        id: `recent-${Date.now()}`,
        name: name,
        durationMinutes: duration,
        calories: calories,
        timestamp: new Date(),
        completed: true
      },
      ...prev
    ]);

    // Update Eamon's score in the leaderboard
    setLeaderboard((prev) =>
      prev.map((user) => {
        if (user.isMe || user.name === profile.name) {
          const nextPoints = user.points + 60;
          return {
            ...user,
            points: nextPoints,
            workoutsCount: user.workoutsCount + 1
          };
        }
        return user;
      })
    );

    // Add notification
    const newNotif: Notification = {
      id: `notif-work-${Date.now()}`,
      title: `عمل رائع! تم حفظ تمرين "${name}" بقيمة ${calories} سعرة محروقة (+60 نقطة مجتمع) 🏆`,
      time: "الآن",
      isRead: false,
      type: "achievement"
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleFinishTimerWorkout = (calories: number, minutes: number) => {
    const workoutName = activeWorkout?.name || "قوة الجزء العلوي";
    
    setProfile((prev) => {
      const newWorkoutsCount = prev.workoutsThisWeek + 1;
      const newWeeklyCalories = prev.weeklyCaloriesBurned + calories;
      const newActiveHours = prev.activeHoursThisWeek + (minutes / 60);
      const newPoints = prev.points + 100; // 100 points for fully completing a timer workout!
      
      return {
        ...prev,
        workoutsThisWeek: newWorkoutsCount,
        weeklyCaloriesBurned: newWeeklyCalories,
        activeHoursThisWeek: parseFloat(newActiveHours.toFixed(1)),
        points: newPoints,
        activeMinutesToday: prev.activeMinutesToday + minutes,
        completedPercentageToday: Math.min(100, prev.completedPercentageToday + 12) // add 12% to today's progress!
      };
    });

    // Also update dynamic activity tracker states!
    setActiveMinutesToday((prev) => prev + minutes);
    setDistanceToday((prev) => parseFloat((prev + (minutes * 0.12)).toFixed(1)));
    setTodaySteps((prev) => prev + (minutes * 125)); // ~125 steps per minute

    // Prepend to recentCompletedWorkouts
    setRecentCompletedWorkouts((prev) => [
      {
        id: `recent-${Date.now()}`,
        name: workoutName,
        durationMinutes: minutes,
        calories: calories,
        timestamp: new Date(),
        completed: true
      },
      ...prev
    ]);

    // Update Eamon's score in the leaderboard
    setLeaderboard((prev) =>
      prev.map((user) => {
        if (user.isMe || user.name === profile.name) {
          return {
            ...user,
            points: user.points + 100,
            workoutsCount: user.workoutsCount + 1
          };
        }
        return user;
      })
    );

    // Add achievement notification
    const newNotif: Notification = {
      id: `notif-timer-${Date.now()}`,
      title: `إنجاز رياضي! أنهيت تمرين "${workoutName}" كاملاً وحصلت على +100 نقطة مجتمع! 🎉`,
      time: "الآن",
      isRead: false,
      type: "achievement"
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setActiveWorkout(null);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // 3-Day Demo calculations
  const DEMO_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days in ms
  const currentElapsed = demoStartTime ? (Date.now() - demoStartTime + demoOffset) : 0;
  const isDemoExpired = demoStartTime ? (currentElapsed >= DEMO_DURATION_MS) : false;
  const demoTimeRemaining = Math.max(0, DEMO_DURATION_MS - currentElapsed);

  // Calculate remaining days, hours, minutes
  const remainingDays = Math.floor(demoTimeRemaining / (24 * 60 * 60 * 1000));
  const remainingHours = Math.floor((demoTimeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const remainingMinutes = Math.floor((demoTimeRemaining % (60 * 60 * 1000)) / (60 * 1000));

  if (demoStartTime === null) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center relative p-4 overflow-hidden">
        {/* Background radial effects */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-lime-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 space-y-6"
        >
          {/* Logo and Greeting */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center text-slate-950 font-black text-2xl mx-auto shadow-xl shadow-lime-500/20">
              ⚡
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-l from-lime-400 to-amber-300 bg-clip-text text-transparent">
                فيتنس برو
              </h1>
              <p className="text-xs text-slate-400 font-semibold">
                شريكك الرياضي الذكي لتتبع التمارين والسعرات والتقدم الرياضي
              </p>
            </div>
          </div>

          <div className="bg-lime-500/10 border border-lime-500/20 rounded-2xl p-4 text-center space-y-1">
            <span className="text-xs font-bold text-lime-400 block">✨ الدخول للفترة التجريبية مجاناً</span>
            <span className="text-[11px] text-slate-300 block">
              احصل على اشتراك ديمو مجاني يمنحك وصولاً كاملاً لجميع الميزات لمدة 3 أيام متواصلة.
            </span>
          </div>

          {/* Login Form */}
          <LoginForm onLogin={handleLogin} />

          {/* Install Application Button for Mobile & PC */}
          <div className="pt-4 border-t border-slate-800 flex flex-col items-center gap-2">
            <span className="text-[10px] text-slate-500 font-semibold">تثبيت التطبيق مباشرة على جهازك</span>
            <button
              type="button"
              onClick={() => setShowInstallModal(true)}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 text-lime-400 hover:text-lime-350 border border-slate-800/80 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Download className="w-4 h-4 text-lime-400" />
              <span>تثبيت للموبايل والكمبيوتر 📱💻</span>
            </button>
          </div>
        </motion.div>

        {/* Install App Modal */}
        <InstallAppModal
          isOpen={showInstallModal}
          onClose={() => setShowInstallModal(false)}
          onNativeInstall={handleNativeInstall}
          isNativePromptAvailable={!!deferredPrompt}
        />
      </div>
    );
  }

  if (isDemoExpired) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center relative p-4 overflow-hidden">
        {/* Background radial effects */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 space-y-6 text-center"
        >
          {showPremiumSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 py-4"
            >
              <div className="w-16 h-16 bg-lime-500 text-slate-950 rounded-full flex items-center justify-center text-3xl mx-auto shadow-lg shadow-lime-500/20">
                ✓
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-lime-400">تم تفعيل الاشتراك بنجاح! 👑</h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                  تهانينا! لقد انضممت بنجاح للباقة الذهبية في فيتنس برو. تمتع الآن بوصول كامل غير محدود لمدى الحياة!
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleResetDemo}
                  className="px-8 py-3 bg-lime-500 hover:bg-lime-600 text-slate-950 font-black text-sm rounded-xl transition duration-200 shadow-lg shadow-lime-500/10"
                >
                  العودة للرئيسية وتجربة جديدة
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Expired header */}
              <div className="space-y-3">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-lg shadow-red-500/5">
                  ⌛
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-black tracking-tight text-red-400">
                    انتهت الفترة التجريبية (3 أيام)
                  </h1>
                  <p className="text-xs text-slate-400">
                    لقد انتهت فترة الديمو المتاحة لحسابك التجريبي بنجاح.
                  </p>
                </div>
              </div>

              {/* User Achievements summary in Demo */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4 text-right">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center border-b border-slate-800 pb-2.5">
                  📊 إنجازاتك خلال الديمو التجريبي
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block">العضو المستكشف</span>
                    <span className="text-sm font-bold text-slate-200">{profile.name}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block">إجمالي النقاط المحققة</span>
                    <span className="text-sm font-bold text-lime-400 font-mono">{profile.points} نقطة</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block">تمارين الأسبوع</span>
                    <span className="text-sm font-bold text-slate-200 font-mono">{profile.workoutsThisWeek} حصص</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block">حرق السعرات الكلي</span>
                    <span className="text-sm font-bold text-slate-200 font-mono">{profile.weeklyCaloriesBurned} سعرة</span>
                  </div>
                </div>
              </div>

              {/* Premium call to action */}
              <div className="space-y-3">
                <div className="bg-gradient-to-l from-lime-500/10 to-emerald-500/10 border border-lime-500/20 rounded-2xl p-4">
                  <span className="text-xs font-bold text-lime-400 block mb-1">👑 اشترك في الباقة الذهبية لـ فيتنس برو</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    افتح جميع المميزات، وخطط التدريب المخصصة بالذكاء الاصطناعي، وتتبع غير محدود للوزن والأنشطة والوجبات مع مجتمعنا المتكامل.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowPremiumSuccess(true)}
                    className="flex-1 py-3 bg-gradient-to-l from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 text-slate-950 font-extrabold text-sm rounded-xl transition duration-200 shadow-lg shadow-lime-500/10"
                  >
                    الترقية للباقة الذهبية الآن
                  </button>

                  <button
                    onClick={handleResetDemo}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-sm rounded-xl transition duration-200 border border-slate-700"
                  >
                    إعادة تشغيل الديمو 3 أيام 🔄
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div dir="rtl" class="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative">
      {/* Background radial effects */}
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* -------------------- SIDEBAR FOR DESKTOP -------------------- */}
      <aside
        id="desktop-sidebar"
        class={`hidden md:flex flex-col w-64 bg-slate-900 border-l border-slate-800/80 p-6 space-y-8 shrink-0 z-30 transition-all duration-300`}
      >
        {/* Logo and Brand name */}
        <div class="flex items-center gap-3 pb-6 border-b border-slate-800">
          <div class="w-10 h-10 bg-lime-500 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-lime-500/15">
            ⚡
          </div>
          <div>
            <h1 class="text-lg font-black tracking-tight bg-gradient-to-l from-lime-400 to-amber-300 bg-clip-text text-transparent">
              فيتنس برو
            </h1>
            <span class="text-[10px] text-slate-500 block uppercase font-bold tracking-widest">تجاوز حدودك</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav class="flex-1 space-y-1.5">
          <button
            onClick={() => setActiveTab("home")}
            class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 ${
              activeTab === "home"
                ? "bg-lime-500 text-slate-950 shadow-lg shadow-lime-500/10"
                : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
            }`}
          >
            <Home class="w-5 h-5" />
            <span>الرئيسية</span>
          </button>

          <button
            onClick={() => setActiveTab("progress")}
            class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 ${
              activeTab === "progress"
                ? "bg-lime-500 text-slate-950 shadow-lg shadow-lime-500/10"
                : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
            }`}
          >
            <BarChart2 class="w-5 h-5" />
            <span>التقدم الأسبوعي</span>
          </button>

          <button
            onClick={() => setActiveTab("workouts")}
            class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 ${
              activeTab === "workouts"
                ? "bg-lime-500 text-slate-950 shadow-lg shadow-lime-500/10"
                : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
            }`}
          >
            <Dumbbell class="w-5 h-5" />
            <span>دليل التمارين</span>
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 ${
              activeTab === "leaderboard"
                ? "bg-lime-500 text-slate-950 shadow-lg shadow-lime-500/10"
                : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
            }`}
          >
            <Trophy class="w-5 h-5" />
            <span>ترتيب المجتمع</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 ${
              activeTab === "profile"
                ? "bg-lime-500 text-slate-950 shadow-lg shadow-lime-500/10"
                : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
            }`}
          >
            <User class="w-5 h-5" />
            <span>الملف الشخصي</span>
          </button>
        </nav>

        {/* Dynamic Water quick logger on Sidebar */}
        <div class="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-teal-400 flex items-center gap-1">
              <span>💧</span> كوب ماء سريع
            </span>
            <span class="text-[10px] text-slate-500 font-mono">
              {profile.consumedWater} / {profile.dailyWaterGoal} مل
            </span>
          </div>
          <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              class="bg-teal-400 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (profile.consumedWater / profile.dailyWaterGoal) * 100)}%` }}
            ></div>
          </div>
          <button
            onClick={() => handleAddWater(250)}
            class="w-full py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-xl text-xs font-semibold transition border border-teal-500/20"
          >
            + إضافة 250 مل
          </button>
        </div>

        {/* Install Button on Sidebar */}
        <button
          onClick={() => setShowInstallModal(true)}
          className="w-full py-2.5 bg-gradient-to-l from-lime-500/10 to-emerald-500/10 hover:from-lime-500/20 hover:to-emerald-500/20 text-lime-400 border border-lime-500/20 hover:border-lime-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>تثبيت فيتنس برو 📱💻</span>
        </button>

        {/* Sidebar Footer User profile preview */}
        <div class="pt-4 border-t border-slate-800 flex items-center gap-3">
          <div class="w-9 h-9 bg-lime-500 rounded-xl flex items-center justify-center font-bold text-slate-950 text-xs">
            {profile.name.substring(0, 2)}
          </div>
          <div class="flex-1 overflow-hidden">
            <h4 class="text-xs font-bold text-slate-200 truncate">{profile.name}</h4>
            <span class="text-[10px] text-slate-500 block truncate">ترتيبك الحالي #{profile.communityRank}</span>
          </div>
        </div>
      </aside>

      {/* -------------------- MAIN APP CONTENT WRAPPER -------------------- */}
      <div id="main-content-layout" class="flex-1 flex flex-col min-w-0 pb-24 md:pb-8">
        
        {/* -------------------- MAIN TOP NAVIGATION BAR -------------------- */}
        <header id="app-top-header" class="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-40 px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Right section: brand menu for mobile or page header */}
          <div class="flex items-center gap-3">
            {/* Mobile menu trigger button */}
            <button
              id="mobile-menu-trigger"
              onClick={() => setSidebarOpen(true)}
              class="md:hidden p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
            >
              <Menu class="w-5 h-5" />
            </button>

            {/* Title / Greetings depending on active tab */}
            <div>
              <div class="flex items-center gap-2">
                <span class="md:hidden text-lg font-black tracking-tight text-lime-500">فيتنس برو</span>
                <span class="hidden md:inline-block text-md font-bold text-slate-400">لوحة التحكم •</span>
                <span class="hidden md:inline-block text-md font-bold text-slate-100">
                  {activeTab === "home" && "الرئيسية"}
                  {activeTab === "progress" && "التقدم الأسبوعي"}
                  {activeTab === "workouts" && "دليل التمارين المتاحة"}
                  {activeTab === "leaderboard" && "ترتيب المتصدرين"}
                  {activeTab === "profile" && "إعدادات أهدافي"}
                </span>
              </div>
            </div>
          </div>

          {/* Left section: Notification bell, Quick add button, and Install button */}
          <div class="flex items-center gap-3">
            {/* Install App Button */}
            <button
              onClick={() => setShowInstallModal(true)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-lime-400 text-slate-300 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              title="تثبيت التطبيق على جهازك"
            >
              <Download className="w-3.5 h-3.5 text-lime-400" />
              <span className="hidden sm:inline">تثبيت التطبيق</span>
            </button>

            {/* Quick Add floating-style button */}
            <button
              id="quick-add-log-button"
              onClick={() => setIsAddModalOpen(true)}
              class="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-md shadow-lime-500/10 flex items-center gap-1.5"
            >
              <Plus class="w-4 h-4 stroke-[3]" />
              <span>تسجيل سريع</span>
            </button>

            {/* Notification trigger with Badge */}
            <button
              id="notifications-bell-button"
              onClick={() => setIsNotificationDrawerOpen(true)}
              class="p-2.5 bg-slate-900 border border-slate-800/80 hover:bg-slate-850 rounded-xl text-slate-300 transition relative"
            >
              <Bell class="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span class="absolute top-1.5 right-1.5 w-4 h-4 bg-lime-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold font-mono">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* -------------------- BOTTOM/SIDE MOBILE NAV OVERLAY -------------------- */}
        <AnimatePresence>
          {sidebarOpen && (
            <div id="mobile-sidebar-overlay" class="fixed inset-0 z-50 flex md:hidden">
              <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
              
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                class="relative w-64 h-full bg-slate-900 p-6 flex flex-col justify-between"
              >
                <div class="space-y-6">
                  {/* Brand header */}
                  <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                    <span class="text-md font-bold text-slate-100">فيتنس برو</span>
                    <button onClick={() => setSidebarOpen(false)} class="text-xs text-slate-400 bg-slate-950 border border-slate-850 px-2 py-1 rounded-lg">إغلاق</button>
                  </div>

                  {/* Nav */}
                  <nav class="space-y-2">
                    <button
                      onClick={() => { setActiveTab("home"); setSidebarOpen(false); }}
                      class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                        activeTab === "home" ? "bg-lime-500 text-slate-950" : "text-slate-400 hover:bg-slate-850"
                      }`}
                    >
                      <Home class="w-5 h-5" />
                      <span>الرئيسية</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab("progress"); setSidebarOpen(false); }}
                      class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                        activeTab === "progress" ? "bg-lime-500 text-slate-950" : "text-slate-400 hover:bg-slate-850"
                      }`}
                    >
                      <BarChart2 class="w-5 h-5" />
                      <span>التقدم الأسبوعي</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab("workouts"); setSidebarOpen(false); }}
                      class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                        activeTab === "workouts" ? "bg-lime-500 text-slate-950" : "text-slate-400 hover:bg-slate-850"
                      }`}
                    >
                      <Dumbbell class="w-5 h-5" />
                      <span>دليل التمارين</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab("leaderboard"); setSidebarOpen(false); }}
                      class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                        activeTab === "leaderboard" ? "bg-lime-500 text-slate-950" : "text-slate-400 hover:bg-slate-850"
                      }`}
                    >
                      <Trophy class="w-5 h-5" />
                      <span>ترتيب المجتمع</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab("profile"); setSidebarOpen(false); }}
                      class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                        activeTab === "profile" ? "bg-lime-500 text-slate-950" : "text-slate-400 hover:bg-slate-850"
                      }`}
                    >
                      <User class="w-5 h-5" />
                      <span>الملف الشخصي</span>
                    </button>
                  </nav>

                  {/* Mobile Drawer Install Button */}
                  <div className="pt-4">
                    <button
                      onClick={() => { setShowInstallModal(true); setSidebarOpen(false); }}
                      className="w-full py-2.5 bg-gradient-to-l from-lime-500/15 to-emerald-500/15 hover:from-lime-500/25 hover:to-emerald-500/25 text-lime-400 border border-lime-500/20 hover:border-lime-500/35 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>تثبيت فيتنس برو على الهاتف 📱</span>
                    </button>
                  </div>
                </div>

                <div class="pt-4 border-t border-slate-800 text-center text-[10px] text-slate-500">
                  فيتنس برو • تجاوز حدودك
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* -------------------- MAIN PAGE CONTENT AREA -------------------- */}
        <main class="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto space-y-8">
          
          {/* 3-Day Demo status and simulation controls banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/5 blur-2xl rounded-full pointer-events-none"></div>
            
            <div className="flex items-center gap-3.5 relative z-10 text-right w-full lg:w-auto">
              <div className="w-10 h-10 bg-lime-500/10 text-lime-400 border border-lime-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-200">الفترة التجريبية النشطة (الديمو)</span>
                  <span className="bg-lime-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {remainingDays > 0 ? `يوم ${3 - remainingDays} من 3` : "اليوم الأخير"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  متبقي على انتهاء الفترة المجانية:{" "}
                  <strong className="text-lime-400 font-mono text-xs">
                    {remainingDays} أيام، و {remainingHours} ساعة، و {remainingMinutes} دقيقة
                  </strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-end relative z-10">
              <button
                onClick={() => {
                  const nextOffset = demoOffset + 24 * 60 * 60 * 1000;
                  setDemoOffset(nextOffset);
                  localStorage.setItem("fitness_demo_offset", nextOffset.toString());
                  
                  // Add a notification about skipping time
                  const timeNotif: Notification = {
                    id: `time-skip-${Date.now()}`,
                    title: `⏩ تم محاكاة تقديم الوقت بـ 24 ساعة للتحقق من انتهاء الديمو!`,
                    time: "الآن",
                    isRead: false,
                    type: "info"
                  };
                  setNotifications(prev => [timeNotif, ...prev]);
                }}
                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="تخطي 24 ساعة للتحقق من تقدم الزمن"
              >
                <span>تخطي 24 ساعة ⏩</span>
              </button>

              <button
                onClick={() => {
                  const nextOffset = DEMO_DURATION_MS + 1000; // Force expiry
                  setDemoOffset(nextOffset);
                  localStorage.setItem("fitness_demo_offset", nextOffset.toString());
                }}
                className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="محاكاة انتهاء الفترة التجريبية الآن"
              >
                <span>إنهاء الديمو فوراً ⌛</span>
              </button>

              <button
                onClick={handleResetDemo}
                className="p-2 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-red-400 border border-slate-800 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
                title="تسجيل الخروج وإعادة تعيين الديمو"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              
              {/* ================================================================= */}
              {/* ======================= TAB: HOME (Page 2) ======================= */}
              {/* ================================================================= */}
              {activeTab === "home" && (
                <div id="home-tab-content" class="space-y-8">
                  {/* User Greeting Hero block */}
                  <div class="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                    <div class="absolute -top-24 -left-24 w-48 h-48 bg-lime-500/10 blur-[60px] rounded-full"></div>
                    <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/10 blur-[60px] rounded-full"></div>

                    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div class="space-y-2">
                        <span class="text-xs font-bold text-lime-400 tracking-wider block bg-lime-500/10 border border-lime-500/20 px-3 py-1 rounded-full w-fit">
                          لوحة التحكم اليومية 🏋️‍♂️
                        </span>
                        <h2 class="text-2xl md:text-3xl font-black text-slate-100 flex items-center gap-2">
                          مرحباً {profile.name} 👋
                        </h2>
                        <p class="text-slate-400 text-sm md:text-md">
                          جاهز لتحطيم أهدافك اليوم؟ روتينك جاهز ونحن بانتظارك!
                        </p>
                      </div>

                      {/* Quick action logger shortcut */}
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        class="px-5 py-3 bg-slate-950/60 hover:bg-slate-950/90 border border-slate-800 rounded-2xl text-xs font-semibold text-slate-300 transition flex items-center gap-2 self-start md:self-auto"
                      >
                        <Plus class="w-4 h-4 text-emerald-400" />
                        <span>تسجيل وجبة أو تمرين يدوي</span>
                      </button>
                    </div>
                  </div>

                  {/* Workout Plan Card Section */}
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <h3 class="text-md font-bold text-slate-200 flex items-center gap-2">
                        <span class="text-lime-500">🔥</span>
                        <span>خطة التمرين المقترحة اليوم</span>
                      </h3>
                      <span class="text-xs text-lime-400 font-bold bg-lime-500/10 px-2.5 py-0.5 rounded-full border border-lime-500/20">منشطة</span>
                    </div>

                    <div class="bg-gradient-to-l from-slate-900 to-slate-950 border border-slate-850 rounded-2xl p-6 shadow-md hover:border-slate-800 transition relative overflow-hidden">
                      <div class="absolute -top-12 -left-12 w-28 h-28 bg-lime-500/5 blur-2xl rounded-full"></div>
                      <div class="absolute -bottom-12 -right-12 w-28 h-28 bg-amber-500/5 blur-2xl rounded-full"></div>

                      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                        <div class="space-y-3">
                          <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">خطة التمرين الأساسية</span>
                          <h4 class="text-xl font-bold text-slate-100">قوة الجزء العلوي</h4>
                          
                          {/* Exercises & Time tags */}
                          <div class="flex items-center gap-4 text-xs text-slate-400">
                            <span class="flex items-center gap-1">
                              <Dumbbell class="w-4 h-4 text-slate-500" />
                              <span>5 تمارين</span>
                            </span>
                            <span class="flex items-center gap-1">
                              <Clock class="w-4 h-4 text-slate-500" />
                              <span>45 دقيقة</span>
                            </span>
                            <span class="flex items-center gap-1 bg-lime-500/10 text-lime-400 px-2 py-0.5 rounded border border-lime-500/10">
                              <Zap class="w-3.5 h-3.5 fill-current" />
                              <span>مستوى متوسط</span>
                            </span>
                          </div>
                        </div>

                        {/* Start Workout button (Arrow left represents "Forward/Next" in RTL) */}
                        <button
                          onClick={() => {
                            const upperBodyWorkout = workouts.find((w) => w.id === "upper-body");
                            if (upperBodyWorkout) setActiveWorkout(upperBodyWorkout);
                          }}
                          class="w-full sm:w-auto px-6 py-3.5 bg-lime-500 hover:bg-lime-600 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 group shadow-lg shadow-lime-500/10"
                        >
                          <span>ابدأ التمرين</span>
                          <ChevronLeft class="w-4 h-4 stroke-[3] group-hover:-translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* My Activity Section */}
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <h3 class="text-md font-bold text-slate-200">نشاطي هذا الأسبوع</h3>
                      <button
                        onClick={() => setActiveTab("progress")}
                        class="text-xs font-semibold text-lime-400 hover:text-lime-300 transition"
                      >
                        عرض الكل
                      </button>
                    </div>

                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Grid Item 1: Workouts of week */}
                      <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3">
                        <div class="flex items-center justify-between text-slate-400 text-xs">
                          <span>تمارين الأسبوع</span>
                          <div class="w-8 h-8 bg-lime-500/10 text-lime-400 rounded-lg flex items-center justify-center">
                            <Dumbbell class="w-4 h-4" />
                          </div>
                        </div>
                        <div class="space-y-1">
                          <span class="text-3xl font-black text-slate-100 font-mono">{profile.workoutsThisWeek}</span>
                          <span class="text-[10px] text-slate-500 block">حصص مكتملة</span>
                        </div>
                      </div>

                      {/* Grid Item 2: Calories burned */}
                      <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3">
                        <div class="flex items-center justify-between text-slate-400 text-xs">
                          <span>سعرة حرارية</span>
                          <div class="w-8 h-8 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center">
                            <Flame class="w-4 h-4" />
                          </div>
                        </div>
                        <div class="space-y-1">
                          <span class="text-3xl font-black text-slate-100 font-mono">
                            {profile.weeklyCaloriesBurned.toLocaleString("ar-EG")}
                          </span>
                          <span class="text-[10px] text-slate-500 block">إجمالي الحرق المحقق</span>
                        </div>
                      </div>

                      {/* Grid Item 3: Active hours */}
                      <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3">
                        <div class="flex items-center justify-between text-slate-400 text-xs">
                          <span>وقت النشاط</span>
                          <div class="w-8 h-8 bg-teal-500/10 text-teal-400 rounded-lg flex items-center justify-center">
                            <Clock class="w-4 h-4" />
                          </div>
                        </div>
                        <div class="space-y-1 font-mono text-3xl font-black text-slate-100 flex items-baseline gap-1">
                          <span>5</span>
                          <span class="text-xs text-slate-400 font-sans font-bold">س</span>
                          <span>30</span>
                          <span class="text-xs text-slate-400 font-sans font-bold">د</span>
                        </div>
                        <div class="text-[10px] text-slate-500">مدة تمرين متواصلة</div>
                      </div>

                      {/* Grid Item 4: Distance */}
                      <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-3">
                        <div class="flex items-center justify-between text-slate-400 text-xs">
                          <span>كم مقطوع</span>
                          <div class="w-8 h-8 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center">
                            <Route class="w-4 h-4" />
                          </div>
                        </div>
                        <div class="space-y-1">
                          <span class="text-3xl font-black text-slate-100 font-mono">{profile.distanceThisWeek}</span>
                          <span class="text-[10px] text-slate-500 block">كيلومتر جري ومشّي</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nutrition Progress Section */}
                  <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-md relative overflow-hidden">
                    <div class="absolute -left-12 -bottom-12 w-24 h-24 bg-emerald-500/5 blur-xl rounded-full"></div>
                    
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                          <h4 class="text-sm font-bold text-slate-200">الهدف الغذائي اليومي</h4>
                          <p class="text-xs text-slate-400">تابع استهلاك السعرات لضمان مد العضلات بالطاقة الكافية</p>
                        </div>
                        <div class="text-left">
                          <span class="text-lg font-black text-emerald-400 font-mono">
                            {Math.round((profile.consumedCalories / profile.dailyCalorieGoal) * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Interactive Progress Bar */}
                      <div class="relative w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-850 p-0.5">
                        <div
                          class="bg-gradient-to-l from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(100, (profile.consumedCalories / profile.dailyCalorieGoal) * 100)}%` }}
                        ></div>
                      </div>

                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800/60">
                        <span>
                          لقد استهلكت <strong class="text-slate-200 font-mono">{profile.consumedCalories}</strong> سعرة حرارية من أصل <strong class="text-slate-200 font-mono">{profile.dailyCalorieGoal}</strong>.
                        </span>
                        
                        {/* Quick meal shortcuts */}
                        <div class="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => handleAddCalories(250)}
                            class="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold transition duration-200 active:scale-95"
                          >
                            + ٢٥٠ سعر
                          </button>
                          <button
                            onClick={() => handleAddCalories(500)}
                            class="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold transition duration-200 active:scale-95"
                          >
                            + ٥٠٠ سعر
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom info grid on Home Tab */}
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card item 1: Healthy tip */}
                    <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 group hover:border-lime-500/10 transition">
                      <div class="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center shrink-0 border border-teal-500/20 group-hover:scale-105 transition-transform">
                        <Droplet class="w-6 h-6" />
                      </div>
                      <div class="flex-1">
                        <span class="text-[10px] text-slate-500 block uppercase font-bold">نصيحة اليوم الصحية</span>
                        <span class="text-sm font-bold text-slate-100 block">شرب الماء والتمثيل الغذائي</span>
                        <p class="text-[10px] text-slate-400 mt-1">شرب الماء الكافي بانتظام يحسن التمثيل الغذائي ويساعد على الاستشفاء العضلي السريع.</p>
                      </div>
                    </div>

                    {/* Card item 2: Leaderboard standing */}
                    <div
                      onClick={() => setActiveTab("leaderboard")}
                      class="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 hover:border-lime-500/30 transition flex items-center gap-4 cursor-pointer group"
                    >
                      <div class="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:scale-105 transition-transform">
                        <Trophy class="w-6 h-6" />
                      </div>
                      <div class="flex-1">
                        <span class="text-[10px] text-slate-500 block uppercase font-bold">ترتيب المجتمع الحالي</span>
                        <span class="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                          <span>#4 ترتيب المجتمع</span>
                          <ChevronLeft class="w-4 h-4 text-slate-500 group-hover:-translate-x-1 transition-transform" />
                        </span>
                        <p class="text-[10px] text-slate-400 mt-1">تبقت 30 نقطة فقط لتجاوز الترتيب التالي والدخول للمنصة! 🏆</p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ================================================================= */}
              {/* ======================= TAB: PROGRESS (Page 3) ======================= */}
              {/* ================================================================= */}
              {activeTab === "progress" && (
                <div id="progress-tab-content" class="space-y-6">
                  
                  {/* Header bar matching blueprint */}
                  <div class="flex items-center justify-between pb-4 border-b border-slate-900">
                    <div class="flex items-center gap-3">
                      <button
                        onClick={() => setActiveTab("home")}
                        class="p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800/80 rounded-xl text-slate-300 transition-all active:scale-95"
                        title="رجوع"
                      >
                        <ArrowRight class="w-5 h-5" />
                      </button>
                      <div>
                        <span class="text-[10px] text-lime-500 font-extrabold uppercase tracking-wider block">فيتنس برو • النشاط</span>
                        <h2 class="text-xl font-black text-slate-100 flex items-center gap-1.5">
                          تطبيق تتبع النشاط والتقدم 🚀
                        </h2>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <button
                        onClick={() => setShowProgressDetails(!showProgressDetails)}
                        class="p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800/80 rounded-xl text-slate-300 transition-all active:scale-95 flex items-center justify-center"
                        title="المزيد من الخيارات"
                      >
                        <MoreHorizontal class="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Quick Config Menu if ShowProgressDetails is toggled */}
                  <AnimatePresence>
                    {showProgressDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        class="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden space-y-4"
                      >
                        <h3 class="text-xs font-extrabold text-lime-400 flex items-center gap-1.5">
                          <Settings class="w-4 h-4" />
                          <span>إعدادات وتعديل بيانات اليوم سريعاً:</span>
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-850/50 space-y-2">
                            <span class="text-[10px] text-slate-500 block">هدف الخطوات اليومي:</span>
                            <div class="flex items-center gap-2">
                              <input
                                type="number"
                                value={stepsGoal}
                                onChange={(e) => setStepsGoal(Math.max(1000, parseInt(e.target.value) || 0))}
                                class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-lime-500"
                              />
                            </div>
                          </div>
                          
                          <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-850/50 space-y-2">
                            <span class="text-[10px] text-slate-500 block">خطوات اليوم المقطوعة:</span>
                            <div class="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setTodaySteps(prev => prev + 1000);
                                  setDistanceToday(prev => parseFloat((prev + 0.8).toFixed(1)));
                                }}
                                class="w-full py-1 bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 text-xs font-bold rounded-lg transition border border-lime-500/20"
                              >
                                + 1,000 خطوة (جري/مشّي)
                              </button>
                            </div>
                          </div>

                          <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-850/50 space-y-2">
                            <span class="text-[10px] text-slate-500 block">إضافة نشاط متراكم:</span>
                            <div class="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setActiveMinutesToday(prev => prev + 15);
                                  setDistanceToday(prev => parseFloat((prev + 1.2).toFixed(1)));
                                }}
                                class="w-full py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold rounded-lg transition border border-amber-500/20"
                              >
                                + 15 دقيقة حركة نشطة
                              </button>
                            </div>
                          </div>

                          <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-850/50 space-y-2">
                            <span class="text-[10px] text-slate-500 block">تعديل الوزن الحالي:</span>
                            <div class="flex items-center gap-2">
                              <input
                                type="number"
                                value={profile.weight}
                                onChange={(e) => handleUpdateProfile({ weight: parseFloat(e.target.value) || 0 })}
                                class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-lime-500"
                              />
                              <span class="text-[10px] text-slate-400">كجم</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Period Switcher tabs: day, week, month */}
                  <div class="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800/80 max-w-sm">
                    {(["day", "week", "month"] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setProgressPeriod(period)}
                        class={`flex-1 py-2 rounded-xl text-xs font-bold transition-all relative ${
                          progressPeriod === period
                            ? "bg-lime-500 text-slate-950 shadow-md shadow-lime-500/15"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {period === "day" && "يوم"}
                        {period === "week" && "أسبوع"}
                        {period === "month" && "شهر"}
                      </button>
                    ))}
                  </div>

                  {/* Main Metric: Steps Progress Circle & Goal Ring */}
                  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Circle and Primary stats card */}
                    <div class="lg:col-span-5 bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center">
                      <div class="absolute -top-12 -left-12 w-28 h-28 bg-lime-500/5 blur-2xl rounded-full"></div>
                      <div class="absolute -bottom-12 -right-12 w-28 h-28 bg-emerald-500/5 blur-2xl rounded-full"></div>

                      <span class="text-xs text-slate-400 uppercase font-black tracking-widest block mb-4">أداء الخطوات والهدف</span>

                      {/* Radial Progress indicator */}
                      <div class="relative w-44 h-44 flex items-center justify-center mb-6">
                        <svg class="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="42%"
                            class="stroke-slate-800/60"
                            strokeWidth="10"
                            fill="transparent"
                          />
                          <motion.circle
                            cx="50%"
                            cy="50%"
                            r="42%"
                            class="stroke-lime-500"
                            strokeWidth="10"
                            fill="transparent"
                            strokeLinecap="round"
                            strokeDasharray="264"
                            animate={{
                              strokeDashoffset: 264 - (264 * Math.min(100, (
                                progressPeriod === "day" ? todaySteps / stepsGoal :
                                progressPeriod === "week" ? 54894 / 70000 :
                                235120 / 300000
                              ) * 100)) / 100
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </svg>

                        <div class="text-center z-10 px-4">
                          <span class="text-[10px] text-slate-500 block font-bold mb-1">
                            {progressPeriod === "day" && "اليوم"}
                            {progressPeriod === "week" && "هذا الأسبوع"}
                            {progressPeriod === "month" && "هذا الشهر"}
                          </span>
                          <span class="text-3xl font-black text-slate-100 font-mono block tracking-tight">
                            {progressPeriod === "day" ? todaySteps.toLocaleString("ar-EG") :
                             progressPeriod === "week" ? (54894).toLocaleString("ar-EG") :
                             (235120).toLocaleString("ar-EG")}
                          </span>
                          <span class="text-[10px] text-slate-400 block mt-1 font-bold">
                            الهدف:{" "}
                            {progressPeriod === "day" ? stepsGoal.toLocaleString("ar-EG") :
                             progressPeriod === "week" ? (70000).toLocaleString("ar-EG") :
                             (300000).toLocaleString("ar-EG")}
                          </span>
                        </div>
                      </div>

                      {/* Quick incremental step booster */}
                      {progressPeriod === "day" && (
                        <button
                          onClick={() => {
                            setTodaySteps(prev => prev + 1000);
                            setDistanceToday(prev => parseFloat((prev + 0.8).toFixed(1)));
                          }}
                          class="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-md shadow-lime-500/10 flex items-center gap-1.5"
                        >
                          <Footprints class="w-4 h-4" />
                          <span>سجل 1,000 خطوة أخرى 🏃‍♂️</span>
                        </button>
                      )}
                    </div>

                    {/* Secondary stats metrics grid */}
                    <div class="lg:col-span-7 flex flex-col justify-between gap-4">
                      
                      {/* Grid for the 3 health stats matching user requested layout */}
                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        
                        {/* Calories burner */}
                        <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-md hover:border-slate-800 transition-all flex flex-col justify-between h-[130px] relative overflow-hidden group">
                          <div class="absolute -top-10 -left-10 w-20 h-20 bg-lime-500/5 blur-xl rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                          <div class="flex items-center justify-between">
                            <span class="text-xs text-slate-400 font-bold">سعرات حرارية</span>
                            <div class="w-8 h-8 bg-lime-500/10 text-lime-400 rounded-xl flex items-center justify-center border border-lime-500/10">
                              <Flame class="w-4.5 h-4.5" />
                            </div>
                          </div>
                          <div class="space-y-1">
                            <span class="text-2xl font-black text-slate-100 font-mono block">
                              {progressPeriod === "day" && "560 سعرة"}
                              {progressPeriod === "week" && "3,240 سعرة"}
                              {progressPeriod === "month" && "14,350 سعرة"}
                            </span>
                            <span class="text-[10px] text-slate-500 block">الحرق الإجمالي المقدر</span>
                          </div>
                        </div>

                        {/* Active minutes */}
                        <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-md hover:border-slate-800 transition-all flex flex-col justify-between h-[130px] relative overflow-hidden group">
                          <div class="absolute -top-10 -left-10 w-20 h-20 bg-amber-500/5 blur-xl rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                          <div class="flex items-center justify-between">
                            <span class="text-xs text-slate-400 font-bold">وقت النشاط</span>
                            <div class="w-8 h-8 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/10">
                              <Clock class="w-4.5 h-4.5" />
                            </div>
                          </div>
                          <div class="space-y-1">
                            <span class="text-2xl font-black text-slate-100 block">
                              {progressPeriod === "day" && `${Math.floor(activeMinutesToday / 60)}س ${activeMinutesToday % 60}د نشاط`}
                              {progressPeriod === "week" && "5س 30د نشاط"}
                              {progressPeriod === "month" && "24س 15د نشاط"}
                            </span>
                            <span class="text-[10px] text-slate-500 block">وقت الحركة المستمر</span>
                          </div>
                        </div>

                        {/* Distance */}
                        <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-md hover:border-slate-800 transition-all flex flex-col justify-between h-[130px] relative overflow-hidden group">
                          <div class="absolute -top-10 -left-10 w-20 h-20 bg-teal-500/5 blur-xl rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                          <div class="flex items-center justify-between">
                            <span class="text-xs text-slate-400 font-bold">مسافة مقطوعة</span>
                            <div class="w-8 h-8 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center border border-teal-500/10">
                              <MapPin class="w-4.5 h-4.5" />
                            </div>
                          </div>
                          <div class="space-y-1">
                            <span class="text-2xl font-black text-slate-100 font-mono block">
                              {progressPeriod === "day" && `${distanceToday} كم`}
                              {progressPeriod === "week" && "18.4 كم"}
                              {progressPeriod === "month" && "82.5 كم"}
                            </span>
                            <span class="text-[10px] text-slate-500 block">مسافة الجري والمشي</span>
                          </div>
                        </div>

                      </div>

                      {/* Recharts Activity graph block - highly advanced & polished */}
                      <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 shadow-md flex-1 min-h-[170px] flex flex-col justify-between">
                        <div class="flex items-center justify-between mb-3 text-xs text-slate-400 font-bold">
                          <span>منحنى الخطوات والحرق</span>
                          <span class="flex items-center gap-1 bg-lime-500/10 text-lime-400 border border-lime-500/15 px-2 py-0.5 rounded text-[10px]">
                            <TrendingUp class="w-3.5 h-3.5" />
                            مستمر في الصعود
                          </span>
                        </div>
                        
                        <div class="w-full h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={
                                progressPeriod === "day"
                                  ? [
                                      { name: "08:00", خطوات: 1200, سعرات: 80 },
                                      { name: "10:00", خطوات: 2400, سعرات: 150 },
                                      { name: "12:00", خطوات: 3800, سعرات: 230 },
                                      { name: "14:00", خطوات: 4500, سعرات: 280 },
                                      { name: "16:00", خطوات: 5100, سعرات: 340 },
                                      { name: "18:00", خطوات: 6800, سعرات: 460 },
                                      { name: "20:00", خطوات: todaySteps, سعرات: 560 }
                                    ]
                                  : progressPeriod === "week"
                                  ? [
                                      { name: "السبت", خطوات: 9200, سعرات: 620 },
                                      { name: "الأحد", خطوات: 8100, سعرات: 540 },
                                      { name: "الاثنين", خطوات: 10400, سعرات: 710 },
                                      { name: "الثلاثاء", خطوات: todaySteps, سعرات: 560 },
                                      { name: "الأربعاء", خطوات: 8900, سعرات: 590 },
                                      { name: "الخميس", خطوات: 11200, سعرات: 760 },
                                      { name: "الجمعة", خطوات: 7100, سعرات: 480 }
                                    ]
                                  : [
                                      { name: "الأسبوع 1", خطوات: 58000, سعرات: 3800 },
                                      { name: "الأسبوع 2", خطوات: 64000, سعرات: 4200 },
                                      { name: "الأسبوع 3", خطوات: 54894, سعرات: 3240 },
                                      { name: "الأسبوع 4", خطوات: 61000, سعرات: 4100 }
                                    ]
                              }
                              margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                            >
                              <defs>
                                <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#a3e635" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#a3e635" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                              <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                              <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                                  borderColor: "#334155",
                                  borderRadius: "12px",
                                  fontSize: "10px",
                                  fontFamily: "Cairo"
                                }}
                              />
                              <Area type="monotone" dataKey="خطوات" stroke="#a3e635" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSteps)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Recent Workouts Segment matching user requested layout exactly */}
                  <div class="space-y-4 pt-2">
                    <div class="flex items-center justify-between">
                      <h3 class="text-md font-bold text-slate-200 flex items-center gap-1.5">
                        <span class="text-lime-500">🏋️‍♂️</span>
                        <span>تمارين حديثة</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab("workouts")}
                        class="text-xs font-bold text-lime-400 hover:text-lime-300 transition flex items-center gap-1 bg-lime-500/5 px-3 py-1 rounded-xl border border-lime-500/10"
                      >
                        <span>عرض الكل</span>
                        <ChevronLeft class="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Workouts list mapping */}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recentCompletedWorkouts.map((work) => (
                        <div
                          key={work.id}
                          class="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-md flex items-center justify-between group hover:border-slate-700 transition"
                        >
                          <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-lime-500/10 text-lime-400 rounded-2xl flex items-center justify-center border border-lime-500/15 shrink-0 group-hover:scale-105 transition-transform">
                              <Dumbbell class="w-6 h-6" />
                            </div>
                            <div class="space-y-1">
                              <h4 class="text-sm font-extrabold text-slate-100">{work.name}</h4>
                              <p class="text-xs text-slate-400">
                                {work.durationMinutes} دقيقة • {work.calories} سعرة
                              </p>
                            </div>
                          </div>

                          {/* Checked circle indicator matching check_circle in user blueprint */}
                          <div class="w-9 h-9 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-md shadow-emerald-500/5">
                            <CheckCircle2 class="w-5 h-5 stroke-[2.5]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}


              {/* ================================================================= */}
              {/* ===================== TAB: WORKOUTS (DIRECTORY) ================= */}
              {/* ================================================================= */}
              {activeTab === "workouts" && (
                <div id="workouts-tab-content" class="space-y-6">
                  <div class="space-y-1.5">
                    <h2 class="text-xl font-bold text-slate-100">دليل التمارين والمستويات</h2>
                    <p class="text-xs text-slate-400">انقر على أي تمرين لبدء المؤشر التفاعلي والعد التنازلي للخطوات.</p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workouts.map((work) => {
                      let diffColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                      if (work.difficulty === "متوسط") {
                        diffColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
                      } else if (work.difficulty === "متقدم") {
                        diffColor = "text-lime-400 bg-lime-500/10 border-lime-500/20";
                      }

                      return (
                        <div
                          key={work.id}
                          class="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between"
                        >
                          <div class="space-y-3">
                            <div class="flex items-center justify-between">
                              <span class={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor}`}>
                                {work.difficulty}
                              </span>
                              <span class="text-xs text-slate-500 font-mono flex items-center gap-1">
                                <Clock class="w-3.5 h-3.5" />
                                {work.durationMinutes} دقيقة
                              </span>
                            </div>

                            <h3 class="text-lg font-bold text-slate-100">{work.name}</h3>
                            <p class="text-xs text-slate-400 leading-relaxed">{work.description}</p>
                            
                            <div class="flex flex-wrap gap-2 text-[10px] text-slate-400">
                              <span class="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-850">
                                {work.category}
                              </span>
                              <span class="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-850 flex items-center gap-1 text-lime-400">
                                <Flame class="w-3 h-3 text-lime-500" />
                                {work.calories} سعرة مقدرة
                              </span>
                            </div>
                          </div>

                          <div class="pt-5 mt-5 border-t border-slate-800/60 flex items-center justify-between">
                            <span class="text-xs text-slate-500 font-mono">{work.steps.length} تمارين / خطوات</span>
                            <button
                              onClick={() => setActiveWorkout(work)}
                              class="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1"
                            >
                              <span>ابدأ الآن</span>
                              <ChevronLeft class="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* ===================== TAB: LEADERBOARD ========================== */}
              {/* ================================================================= */}
              {activeTab === "leaderboard" && (
                <div id="leaderboard-tab-content">
                  <Leaderboard users={leaderboard} currentUserName={profile.name} />
                </div>
              )}

              {/* ================================================================= */}
              {/* ===================== TAB: PROFILE ============================== */}
              {/* ================================================================= */}
              {activeTab === "profile" && (
                <div id="profile-tab-content">
                  <ProfileTab profile={profile} onUpdateProfile={handleUpdateProfile} />
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </main>

        {/* -------------------- BOTTOM NAVIGATION BAR FOR MOBILE -------------------- */}
        <nav
          id="mobile-bottom-nav"
          class="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-4 py-3 z-40 flex items-center justify-between shadow-xl"
        >
          {/* Main button tab: Home */}
          <button
            onClick={() => setActiveTab("home")}
            class={`flex flex-col items-center gap-1 text-slate-200 transition ${
              activeTab === "home" ? "text-lime-500" : "text-slate-400"
            }`}
          >
            <Home class="w-5 h-5" />
            <span class="text-[10px] font-medium">الرئيسية</span>
          </button>

          {/* Main button tab: Workouts */}
          <button
            onClick={() => setActiveTab("workouts")}
            class={`flex flex-col items-center gap-1 text-slate-200 transition ${
              activeTab === "workouts" ? "text-lime-500" : "text-slate-400"
            }`}
          >
            <Dumbbell class="w-5 h-5" />
            <span class="text-[10px] font-medium">التمارين</span>
          </button>

          {/* Center Floating Plus Quick Action Button */}
          <button
            id="mobile-floating-add-action"
            onClick={() => setIsAddModalOpen(true)}
            class="w-12 h-12 bg-lime-500 text-slate-950 rounded-full flex items-center justify-center -translate-y-4 shadow-lg shadow-lime-500/30 border-4 border-slate-950 active:scale-95 transition"
          >
            <Plus class="w-6 h-6 stroke-[3]" />
          </button>

          {/* Main button tab: Progress */}
          <button
            onClick={() => setActiveTab("progress")}
            class={`flex flex-col items-center gap-1 text-slate-200 transition ${
              activeTab === "progress" ? "text-lime-500" : "text-slate-400"
            }`}
          >
            <BarChart2 class="w-5 h-5" />
            <span class="text-[10px] font-medium">التقدم</span>
          </button>

          {/* Main button tab: Profile */}
          <button
            onClick={() => setActiveTab("profile")}
            class={`flex flex-col items-center gap-1 text-slate-200 transition ${
              activeTab === "profile" ? "text-lime-500" : "text-slate-400"
            }`}
          >
            <User class="w-5 h-5" />
            <span class="text-[10px] font-medium">الملف</span>
          </button>
        </nav>

      </div>

      {/* -------------------- OVERLAYS, MODALS & TIMERS -------------------- */}
      
      {/* 1. Workout Active Timer Overlay */}
      <AnimatePresence>
        {activeWorkout && (
          <WorkoutTimer
            workout={activeWorkout}
            onClose={() => setActiveWorkout(null)}
            onFinish={handleFinishTimerWorkout}
          />
        )}
      </AnimatePresence>

      {/* 2. Fast logger quick modal overlay */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddLogModal
            onClose={() => setIsAddModalOpen(false)}
            onAddCalories={handleAddCalories}
            onAddWorkout={handleAddWorkoutManual}
            onAddWater={handleAddWater}
            dailyCalorieGoal={profile.dailyCalorieGoal}
          />
        )}
      </AnimatePresence>

      {/* 3. Notifications slider drawer */}
      <AnimatePresence>
        {isNotificationDrawerOpen && (
          <NotificationDrawer
            notifications={notifications}
            onClose={() => setIsNotificationDrawerOpen(false)}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onClear={handleClearNotification}
          />
        )}
      </AnimatePresence>

      {/* 4. Install App Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onNativeInstall={handleNativeInstall}
        isNativePromptAvailable={!!deferredPrompt}
      />

    </div>
  );
}

interface LoginFormProps {
  onLogin: (name: string, weight: number, height: number, calorieGoal: number) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("75");
  const [height, setHeight] = useState("175");
  const [calorieGoal, setCalorieGoal] = useState("2000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onLogin(
      name.trim(),
      parseFloat(weight) || 75,
      parseFloat(height) || 175,
      parseInt(calorieGoal) || 2000
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-right">
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-400">الاسم الكامل</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسمك الكريم"
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-lime-500 transition-all font-sans"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-400 font-sans">الوزن الحالي (كجم)</label>
          <div className="relative">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="30"
              max="220"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-lime-500 transition-all font-mono"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-sans">كجم</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-400 font-sans">الطول الحالي (سم)</label>
          <div className="relative">
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="100"
              max="240"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-lime-500 transition-all font-mono"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-sans">سم</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-400 font-sans">الهدف اليومي للسعرات الحرارية</label>
        <div className="relative">
          <input
            type="number"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(e.target.value)}
            min="1000"
            max="6000"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-lime-500 transition-all font-mono"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-sans">سعرة</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-lime-500 hover:bg-lime-600 text-slate-950 font-black text-sm rounded-xl transition duration-200 shadow-lg shadow-lime-500/10 flex items-center justify-center gap-2 mt-2 cursor-pointer"
      >
        <span>بدء البرنامج والتتبع (3 أيام مجاناً)</span>
        <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
      </button>
    </form>
  );
}
