import React, { useState, useEffect } from "react";
import { Workout } from "../types";
import { Play, Pause, Square, SkipForward, Flame, Timer, CheckCircle2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WorkoutTimerProps {
  workout: Workout;
  onClose: () => void;
  onFinish: (calories: number, minutes: number) => void;
}

export default function WorkoutTimer({ workout, onClose, onFinish }: WorkoutTimerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(workout.steps[0]?.durationSeconds || 60);
  const [isActive, setIsActive] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  const currentStep = workout.steps[currentStepIndex];
  const totalSteps = workout.steps.length;

  useEffect(() => {
    setTimeLeft(workout.steps[currentStepIndex]?.durationSeconds || 60);
  }, [currentStepIndex, workout]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          // Increment calories slightly each second
          const calPerSec = workout.calories / (workout.durationMinutes * 60);
          setCaloriesBurned((prevCal) => Math.round((prevCal + calPerSec) * 10) / 10);
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && !isCompleted) {
      // Go to next step or complete
      if (currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsActive(false);
        setIsCompleted(true);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, currentStepIndex, totalSteps, workout, isCompleted]);

  const toggleActive = () => setIsActive(!isActive);

  const skipStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsActive(false);
      setIsCompleted(true);
    }
  };

  const handleFinish = () => {
    onFinish(Math.round(caloriesBurned), Math.round((workout.steps.reduce((acc, step, idx) => {
      if (idx <= currentStepIndex) {
        return acc + (step.durationSeconds - (idx === currentStepIndex ? timeLeft : 0));
      }
      return acc;
    }, 0)) / 60) || 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const currentStepDuration = workout.steps[currentStepIndex]?.durationSeconds || 60;
  const progressPercentage = ((currentStepDuration - timeLeft) / currentStepDuration) * 100;

  return (
    <div id="workout-timer-overlay" class="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 p-4 md:p-8 overflow-y-auto">
      {/* Upper header */}
      <div id="workout-timer-header" class="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <span class="text-xs font-semibold px-2.5 py-1 bg-lime-500/10 text-lime-400 rounded-full border border-lime-500/20">
            تمرين نشط ⚡
          </span>
          <h2 class="text-xl font-bold mt-1 text-slate-100">{workout.name}</h2>
        </div>
        <button
          id="quit-workout-button"
          onClick={onClose}
          class="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm font-medium transition duration-200"
        >
          خروج
        </button>
      </div>

      {!isCompleted ? (
        <div id="timer-active-layout" class="flex-1 flex flex-col lg:flex-row gap-8 items-center justify-center max-w-5xl mx-auto w-full">
          {/* Right/Top Side: Big Circle Timer */}
          <div id="circle-timer-container" class="relative flex flex-col items-center justify-center w-64 h-64 md:w-80 md:h-80">
            {/* SVG Progress Circle */}
            <svg class="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                class="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="45%"
                class="stroke-lime-500"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="283%"
                animate={{
                  strokeDashoffset: `${283 - (283 * progressPercentage) / 100}%`,
                }}
                transition={{ duration: 0.5, ease: "linear" }}
              />
            </svg>

            {/* Inner Content */}
            <div class="z-10 flex flex-col items-center justify-center text-center">
              <span class="text-xs tracking-wider text-slate-400 uppercase mb-1">المتبقي</span>
              <span class="text-4xl md:text-5xl font-mono font-bold text-slate-100 tracking-tight">
                {formatTime(timeLeft)}
              </span>
              <span class="text-sm font-medium text-lime-400 mt-2 flex items-center gap-1.5 bg-lime-500/10 px-3 py-1 rounded-full">
                <Flame class="w-4 h-4 text-lime-500" />
                <span>{Math.round(caloriesBurned)} سعرة</span>
              </span>
            </div>
          </div>

          {/* Left/Bottom Side: Workout steps & Details */}
          <div id="exercise-details-panel" class="flex-1 flex flex-col w-full max-w-md">
            <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl mb-6 relative overflow-hidden">
              <div class="absolute -top-12 -left-12 w-24 h-24 bg-lime-500/5 blur-xl rounded-full"></div>
              <span class="text-xs text-lime-400 font-bold tracking-wide block mb-1">
                التمرين {currentStepIndex + 1} من {totalSteps}
              </span>
              <h3 class="text-2xl font-bold text-slate-100 mb-3">{currentStep.name}</h3>
              <p class="text-slate-400 text-sm leading-relaxed mb-4">
                {currentStep.description}
              </p>

              {/* Progress bar across steps */}
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex flex-row-reverse">
                {Array.from({ length: totalSteps }).map((_, idx) => (
                  <div
                    key={idx}
                    class={`h-full flex-1 border-r border-slate-900 first:border-0 transition-all duration-300 ${
                      idx < currentStepIndex
                        ? "bg-lime-500"
                        : idx === currentStepIndex
                        ? "bg-lime-400 animate-pulse"
                        : "bg-slate-700"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Next exercise teaser */}
            {currentStepIndex < totalSteps - 1 && (
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 mb-6 flex items-center justify-between text-xs text-slate-400">
                <span>التمرين التالي:</span>
                <span class="font-bold text-slate-300">{workout.steps[currentStepIndex + 1].name}</span>
              </div>
            )}

            {/* Timer controls */}
            <div id="timer-controls" class="flex items-center justify-center gap-4">
              <button
                id="toggle-timer-button"
                onClick={toggleActive}
                class={`flex-1 py-4 px-6 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                  isActive
                    ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                    : "bg-emerald-500 hover:bg-emerald-600 text-slate-950"
                }`}
              >
                {isActive ? (
                  <>
                    <Pause class="w-5 h-5 fill-current" />
                    <span>إيقاف مؤقت</span>
                  </>
                ) : (
                  <>
                    <Play class="w-5 h-5 fill-current" />
                    <span>استئناف</span>
                  </>
                )}
              </button>

              <button
                id="skip-step-button"
                onClick={skipStep}
                class="p-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-100 rounded-xl transition tooltip"
                title="تخطي التمرين"
              >
                <SkipForward class="w-5 h-5" />
              </button>

              <button
                id="finish-early-button"
                onClick={handleFinish}
                class="p-4 bg-lime-500 hover:bg-lime-600 text-slate-950 rounded-xl transition font-bold"
                title="إنهاء التمرين وتسجيل النتيجة"
              >
                <CheckCircle2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          id="workout-completed-state"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          class="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-8"
        >
          <div class="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20 mb-6 animate-bounce">
            <CheckCircle2 class="w-12 h-12" />
          </div>

          <h3 class="text-3xl font-bold text-slate-100 mb-2">تجاوزت حدودك بنجاح!</h3>
          <p class="text-slate-400 text-sm mb-8 leading-relaxed">
            عمل رائع اليوم. جسمك أصبح أقوى الآن، وصحتك في تقدم مستمر. استمر على هذا المنوال لتحقيق أفضل نسخة من ذاتك!
          </p>

          <div class="grid grid-cols-2 gap-4 w-full mb-8">
            <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span class="text-xs text-slate-400 block mb-1">السعرات المحروقة</span>
              <span class="text-2xl font-bold text-lime-400 flex items-center justify-center gap-1 font-mono">
                <Flame class="w-5 h-5 text-lime-500" />
                {Math.round(caloriesBurned)}
              </span>
            </div>
            <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span class="text-xs text-slate-400 block mb-1">مدة التمرين الإجمالية</span>
              <span class="text-2xl font-bold text-teal-400 flex items-center justify-center gap-1 font-mono">
                <Timer class="w-5 h-5 text-teal-500" />
                {Math.round(workout.durationMinutes)} دقيقة
              </span>
            </div>
          </div>

          <button
            id="save-results-button"
            onClick={handleFinish}
            class="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold transition shadow-lg shadow-emerald-500/20 text-md"
          >
            حفظ النتيجة والعودة للرئيسية
          </button>
        </motion.div>
      )}
    </div>
  );
}
