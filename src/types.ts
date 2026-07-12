export interface WorkoutStep {
  name: string;
  durationSeconds: number;
  description: string;
}

export interface Workout {
  id: string;
  name: string;
  exercisesCount: number;
  durationMinutes: number;
  category: string;
  difficulty: "مبتدئ" | "متوسط" | "متقدم";
  intensity: "منخفض" | "متوسط" | "مرتفع";
  calories: number;
  steps: WorkoutStep[];
  description: string;
}

export interface UserProfile {
  name: string;
  dailyCalorieGoal: number;
  consumedCalories: number;
  dailyWaterGoal: number; // ml
  consumedWater: number; // ml
  weight: number; // kg
  height: number; // cm
  workoutsThisWeek: number;
  weeklyCaloriesBurned: number;
  activeMinutesToday: number;
  activeHoursThisWeek: number;
  distanceThisWeek: number;
  heartRate: number;
  completedPercentageToday: number;
  communityRank: number;
  points: number;
}

export interface WorkoutLog {
  id: string;
  name: string;
  caloriesBurned: number;
  durationMinutes: number;
  heartRate: number;
  timestamp: Date;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  isMe: boolean;
  avatarColor: string;
  workoutsCount: number;
}

export interface Notification {
  id: string;
  title: string;
  time: string;
  isRead: boolean;
  type: "achievement" | "reminder" | "info";
}
