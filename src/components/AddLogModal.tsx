import React, { useState } from "react";
import { X, Flame, Coffee, Dumbbell, Trophy, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AddLogModalProps {
  onClose: () => void;
  onAddCalories: (amount: number) => void;
  onAddWorkout: (name: string, duration: number, calories: number) => void;
  onAddWater: (amount: number) => void;
  dailyCalorieGoal: number;
}

export default function AddLogModal({ onClose, onAddCalories, onAddWorkout, onAddWater, dailyCalorieGoal }: AddLogModalProps) {
  const [activeTab, setActiveTab] = useState<"food" | "workout" | "water">("food");
  
  // Food state
  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  
  // Workout state
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutCalories, setWorkoutCalories] = useState("");

  // Water quick options
  const waterOptions = [250, 500, 750, 1000];

  const [successMsg, setSuccessMsg] = useState("");

  const handleLogFood = (e: React.FormEvent) => {
    e.preventDefault();
    const cals = parseInt(foodCalories);
    if (isNaN(cals) || cals <= 0) return;

    onAddCalories(cals);
    setSuccessMsg(`تم تسجيل وجبة "${foodName || "وجبة خفيفة"}" بنجاح (+${cals} سعرة)`);
    setFoodName("");
    setFoodCalories("");
    
    setTimeout(() => {
      setSuccessMsg("");
      onClose();
    }, 1500);
  };

  const handleLogWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const dur = parseInt(workoutDuration);
    const cals = parseInt(workoutCalories);
    
    if (isNaN(dur) || dur <= 0 || isNaN(cals) || cals <= 0) return;
    const name = workoutName.trim() || "تمرين مخصص";

    onAddWorkout(name, dur, cals);
    setSuccessMsg(`تم تسجيل تمرين "${name}" بنجاح (+${cals} سعرة محروقة)`);
    setWorkoutName("");
    setWorkoutDuration("");
    setWorkoutCalories("");

    setTimeout(() => {
      setSuccessMsg("");
      onClose();
    }, 1500);
  };

  const handleLogWater = (amount: number) => {
    onAddWater(amount);
    setSuccessMsg(`تم تسجيل شرب ${amount} مل من الماء بنجاح 💧`);
    setTimeout(() => {
      setSuccessMsg("");
      onClose();
    }, 1200);
  };

  return (
    <div id="add-log-modal-overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
      >
        {/* Success Banner overlay */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              class="absolute inset-0 bg-slate-900/95 z-20 flex flex-col items-center justify-center p-6 text-center"
            >
              <div class="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-3">
                <Check class="w-6 h-6" />
              </div>
              <p class="text-md font-bold text-slate-100">{successMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Header */}
        <div class="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 class="text-md font-bold text-slate-100 flex items-center gap-2">
            <Plus class="w-5 h-5 text-emerald-400 bg-emerald-500/10 rounded-lg p-0.5" />
            <span>إضافة نشاط سريع</span>
          </h3>
          <button
            onClick={onClose}
            class="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        {/* Tabs selector */}
        <div class="flex border-b border-slate-800 bg-slate-950/50 p-1">
          <button
            onClick={() => setActiveTab("food")}
            class={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === "food"
                ? "bg-slate-800 text-emerald-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Coffee class="w-4 h-4" />
            <span>وجبة غذائية</span>
          </button>
          
          <button
            onClick={() => setActiveTab("workout")}
            class={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === "workout"
                ? "bg-slate-800 text-lime-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Dumbbell class="w-4 h-4" />
            <span>تمرين يدوي</span>
          </button>

          <button
            onClick={() => setActiveTab("water")}
            class={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === "water"
                ? "bg-slate-800 text-teal-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span class="text-teal-400 text-sm">💧</span>
            <span>شرب ماء</span>
          </button>
        </div>

        {/* Content area */}
        <div class="p-5">
          {activeTab === "food" && (
            <form onSubmit={handleLogFood} class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">اسم الوجبة</label>
                <input
                  type="text"
                  placeholder="مثال: فطور الشوفان، موزة وعسل"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>
              
              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">السعرات الحرارية (kcal)</label>
                <div class="relative">
                  <input
                    type="number"
                    placeholder="مثال: 350"
                    value={foodCalories}
                    onChange={(e) => setFoodCalories(e.target.value)}
                    min="1"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition font-mono"
                    required
                  />
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">سعرة</span>
                </div>
              </div>

              <div class="pt-2">
                <button
                  type="submit"
                  class="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold text-sm transition shadow-lg shadow-emerald-500/10"
                >
                  حفظ الوجبة وتحديث السعرات
                </button>
              </div>
            </form>
          )}

          {activeTab === "workout" && (
            <form onSubmit={handleLogWorkout} class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">اسم التمرين</label>
                <input
                  type="text"
                  placeholder="مثال: جري صباحي، تمرين مقاومة منزلية"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-lime-500 transition"
                  required
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-slate-400 mb-1.5">مدة التمرين (دقيقة)</label>
                  <input
                    type="number"
                    placeholder="مثال: 30"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(e.target.value)}
                    min="1"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-lime-500 transition font-mono"
                    required
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-400 mb-1.5">السعرات المحروقة</label>
                  <input
                    type="number"
                    placeholder="مثال: 250"
                    value={workoutCalories}
                    onChange={(e) => setWorkoutCalories(e.target.value)}
                    min="1"
                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-lime-500 transition font-mono"
                    required
                  />
                </div>
              </div>

              <div class="bg-slate-950 border border-slate-850 p-3.5 rounded-xl text-xs text-slate-400 leading-relaxed flex items-center gap-2">
                <Trophy class="w-4 h-4 text-amber-500 shrink-0" />
                <span>تسجيل تمرين يدوي سيكسبك نقاطاً إضافية في ترتيب المجتمع الأسبوعي! 🏆</span>
              </div>

              <div class="pt-2">
                <button
                  type="submit"
                  class="w-full py-3.5 bg-lime-500 hover:bg-lime-600 text-slate-950 rounded-xl font-bold text-sm transition shadow-lg shadow-lime-500/10"
                >
                  تسجيل تمرين وتحديث اللياقة
                </button>
              </div>
            </form>
          )}

          {activeTab === "water" && (
            <div class="space-y-6 py-2">
              <p class="text-xs text-slate-400 text-center leading-relaxed">
                حدد كمية المياه التي شربتها لتغذية خلاياك والحفاظ على رطوبة جسمك خلال اليوم.
              </p>

              <div class="grid grid-cols-2 gap-3">
                {waterOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleLogWater(amount)}
                    class="py-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 rounded-xl text-sm font-semibold text-slate-200 transition flex flex-col items-center justify-center gap-2"
                  >
                    <span class="text-xl">🥛</span>
                    <span class="font-mono">{amount} مل</span>
                    <span class="text-[10px] text-slate-500">
                      {amount >= 1000 ? `${amount / 1000} لتر` : ""}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
