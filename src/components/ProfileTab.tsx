import React, { useState } from "react";
import { UserProfile } from "../types";
import { User, Weight, Ruler, Flame, Target, Droplet, Heart, Sparkles, Check } from "lucide-react";
import { motion } from "motion/react";

interface ProfileTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export default function ProfileTab({ profile, onUpdateProfile }: ProfileTabProps) {
  const [name, setName] = useState(profile.name);
  const [weight, setWeight] = useState(profile.weight.toString());
  const [height, setHeight] = useState(profile.height.toString());
  const [calorieGoal, setCalorieGoal] = useState(profile.dailyCalorieGoal.toString());
  const [waterGoal, setWaterGoal] = useState(profile.dailyWaterGoal.toString());
  
  const [isSaved, setIsSaved] = useState(false);

  // Calculate BMI
  const weightNum = parseFloat(weight) || profile.weight;
  const heightNum = (parseFloat(height) || profile.height) / 100; // to meters
  const bmi = heightNum > 0 ? (weightNum / (heightNum * heightNum)).toFixed(1) : "0";
  
  let bmiCategory = "وزن طبيعي";
  let bmiColor = "text-emerald-400";
  const bmiVal = parseFloat(bmi);
  if (bmiVal < 18.5) {
    bmiCategory = "نقص في الوزن";
    bmiColor = "text-amber-400";
  } else if (bmiVal >= 25 && bmiVal < 29.9) {
    bmiCategory = "زيادة في الوزن";
    bmiColor = "text-amber-400";
  } else if (bmiVal >= 30) {
    bmiCategory = "سمنة";
    bmiColor = "text-lime-400";
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim() || profile.name,
      weight: parseFloat(weight) || profile.weight,
      height: parseFloat(height) || profile.height,
      dailyCalorieGoal: parseInt(calorieGoal) || profile.dailyCalorieGoal,
      dailyWaterGoal: parseInt(waterGoal) || profile.dailyWaterGoal
    });
    
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <div id="profile-container" class="space-y-6">
      {/* Top Banner with Profile Avatar Card */}
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-36 h-36 bg-lime-500/5 blur-3xl rounded-full"></div>
        <div class="absolute -left-16 -bottom-16 w-36 h-36 bg-emerald-500/5 blur-3xl rounded-full"></div>

        <div class="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
          <div class="w-20 h-20 bg-gradient-to-tr from-lime-500 to-amber-500 rounded-2xl flex items-center justify-center text-3xl font-black text-slate-950 shadow-lg shadow-lime-500/15 select-none relative group">
            <span class="relative z-10">{profile.name.substring(0, 2)}</span>
            <div class="absolute inset-0 bg-slate-950/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
          </div>

          <div class="flex-1 space-y-1">
            <div class="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 class="text-xl font-bold text-slate-100">{profile.name}</h2>
              <span class="inline-block self-center sm:self-start bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                عضو متميز ⭐
              </span>
            </div>
            <p class="text-xs text-slate-400">مرحباً بك! يمكنك تخصيص أهدافك الرياضية والغذائية أدناه.</p>
            
            {/* Quick stats rows */}
            <div class="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800 max-w-sm">
              <div class="text-center">
                <span class="text-[10px] text-slate-500 block">ترتيبك</span>
                <span class="text-sm font-bold text-slate-200 font-mono">#{profile.communityRank}</span>
              </div>
              <div class="text-center border-x border-slate-800">
                <span class="text-[10px] text-slate-500 block">النقاط</span>
                <span class="text-sm font-bold text-slate-200 font-mono">{profile.points}</span>
              </div>
              <div class="text-center">
                <span class="text-[10px] text-slate-500 block">تمارين الأسبوع</span>
                <span class="text-sm font-bold text-slate-200 font-mono">{profile.workoutsThisWeek}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Health metrics (BMI, Water, etc.) */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BMI Calculator readout */}
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <Sparkles class="w-4 h-4 text-emerald-400" />
              <span>مؤشر كتلة الجسم (BMI)</span>
            </h3>
            <p class="text-xs text-slate-400 leading-relaxed mb-4">
              يتم حسابه تلقائياً بناءً على وزنك ({profile.weight} كجم) وطولك ({profile.height} سم).
            </p>
          </div>
          
          <div class="flex items-end justify-between bg-slate-950/50 p-4 rounded-xl border border-slate-850">
            <div>
              <span class="text-xs text-slate-500 block">التصنيف الحالي</span>
              <span class={`text-sm font-bold ${bmiColor}`}>{bmiCategory}</span>
            </div>
            <div class="text-left">
              <span class="text-3xl font-black text-slate-100 font-mono">{bmi}</span>
            </div>
          </div>
        </div>

        {/* Daily Nutrition Indicator card */}
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <Target class="w-4 h-4 text-lime-400" />
              <span>خطة السعرات المقترحة</span>
            </h3>
            <p class="text-xs text-slate-400 leading-relaxed mb-4">
              سعراتك المستهدفة للحفاظ على حيوية الجسم وبناء الكتلة العضلية النظيفة.
            </p>
          </div>

          <div class="flex items-center justify-between bg-slate-950/50 p-4 rounded-xl border border-slate-850">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-lime-500/10 text-lime-400 rounded-lg flex items-center justify-center">
                <Flame class="w-5 h-5" />
              </div>
              <div>
                <span class="text-xs text-slate-500 block">السعرات المستهدفة</span>
                <span class="text-sm font-bold text-slate-200">{profile.dailyCalorieGoal} سعرة / يوم</span>
              </div>
            </div>
            <div class="text-left font-mono text-xs text-slate-400">
              {profile.consumedCalories} مستهلكة
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <h3 class="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
          <User class="w-4.5 h-4.5 text-lime-500" />
          <span>تحديث أهدافك وبياناتك الشخصية</span>
        </h3>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1.5">الاسم</label>
              <div class="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-lime-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1.5">الوزن الحالي (كجم)</label>
              <div class="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="30"
                  max="250"
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-lime-500 transition font-mono"
                  required
                />
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">كجم</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1.5">الطول (سم)</label>
              <div class="relative">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="100"
                  max="250"
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-lime-500 transition font-mono"
                  required
                />
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">سم</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1.5">الهدف اليومي للسعرات</label>
              <div class="relative">
                <input
                  type="number"
                  value={calorieGoal}
                  onChange={(e) => setCalorieGoal(e.target.value)}
                  min="1000"
                  max="10000"
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-lime-500 transition font-mono"
                  required
                />
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">سعرة</span>
              </div>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-slate-400 mb-1.5">الهدف اليومي لشرب الماء (مللتر)</label>
              <div class="relative">
                <input
                  type="number"
                  value={waterGoal}
                  onChange={(e) => setWaterGoal(e.target.value)}
                  min="500"
                  max="10000"
                  step="250"
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-lime-500 transition font-mono"
                  required
                />
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">مل (مثال: 3000 مل = 3 لتر)</span>
              </div>
            </div>
          </div>

          <div class="pt-2 flex items-center justify-between">
            <button
              type="submit"
              class="w-full sm:w-auto px-8 py-3 bg-lime-500 hover:bg-lime-600 text-slate-950 font-bold rounded-xl transition text-sm shadow-md shadow-lime-500/10 flex items-center justify-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <Check class="w-4.5 h-4.5" />
                  <span>تم حفظ التغييرات!</span>
                </>
              ) : (
                <span>حفظ البيانات وتحديث الأهداف</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
