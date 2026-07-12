import React from "react";
import { LeaderboardUser } from "../types";
import { Trophy, Medal, Flame, Sparkles, Dumbbell } from "lucide-react";

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserName: string;
}

export default function Leaderboard({ users, currentUserName }: LeaderboardProps) {
  // Sort users by points descending
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <div id="leaderboard-panel" class="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-2xl rounded-full"></div>

      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Trophy class="w-5 h-5 text-amber-500" />
            <span>ترتيب المجتمع</span>
          </h3>
          <p class="text-xs text-slate-400 mt-1">تنافس مع زملائك الرياضيين هذا الأسبوع</p>
        </div>
        <div class="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          <Sparkles class="w-4 h-4 text-amber-400" />
          <span class="text-xs font-bold text-amber-400">نشط الآن</span>
        </div>
      </div>

      <div class="space-y-3">
        {sortedUsers.map((user, index) => {
          const isUserMe = user.isMe || user.name === currentUserName;
          const displayRank = index + 1;

          // Rank styling
          let rankIcon = null;
          let rankColor = "text-slate-400";
          let rowBg = "bg-slate-950/40 border border-slate-900";

          if (displayRank === 1) {
            rankIcon = <Trophy class="w-5 h-5 text-amber-400" />;
            rankColor = "text-amber-400 font-bold";
          } else if (displayRank === 2) {
            rankIcon = <Medal class="w-5 h-5 text-slate-300" />;
            rankColor = "text-slate-300 font-bold";
          } else if (displayRank === 3) {
            rankIcon = <Medal class="w-5 h-5 text-amber-600" />;
            rankColor = "text-amber-600 font-bold";
          }

          if (isUserMe) {
            rowBg = "bg-lime-500/15 border border-lime-500/30 shadow-md shadow-lime-500/5 relative overflow-hidden";
          }

          return (
            <div
              key={user.name}
              id={`leaderboard-row-${displayRank}`}
              class={`flex items-center justify-between p-3.5 rounded-xl transition duration-300 ${rowBg}`}
            >
              {isUserMe && (
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-lime-500"></div>
              )}

              <div class="flex items-center gap-3">
                {/* Rank number/badge */}
                <div class="w-8 flex items-center justify-center font-mono text-sm">
                  {rankIcon ? rankIcon : <span class={rankColor}>#{displayRank}</span>}
                </div>

                {/* Avatar */}
                <div class={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase ${isUserMe ? 'bg-lime-600' : user.avatarColor}`}>
                  {user.name.substring(0, 2)}
                </div>

                {/* Name */}
                <div class="flex flex-col">
                  <span class={`text-sm ${isUserMe ? "font-bold text-lime-300" : "font-medium text-slate-200"}`}>
                    {user.name} {isUserMe && <span class="text-[10px] bg-lime-500/20 text-lime-300 px-1.5 py-0.5 rounded-md font-normal mr-1">أنت</span>}
                  </span>
                  <span class="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Dumbbell class="w-3 h-3 text-slate-500" />
                    <span>{user.workoutsCount} تمارين</span>
                  </span>
                </div>
              </div>

              {/* Points */}
              <div class="flex flex-col items-end">
                <span class="text-sm font-bold text-slate-100 font-mono">
                  {user.points.toLocaleString("ar-EG")}
                </span>
                <span class="text-[10px] text-slate-400">نقطة</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
