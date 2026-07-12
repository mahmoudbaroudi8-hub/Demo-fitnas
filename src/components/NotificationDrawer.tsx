import React from "react";
import { X, Bell, Trophy, Zap, Info, Check } from "lucide-react";
import { Notification } from "../types";
import { motion } from "motion/react";

interface NotificationDrawerProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onClear: (id: string) => void;
}

export default function NotificationDrawer({
  notifications,
  onClose,
  onMarkAllRead,
  onClear
}: NotificationDrawerProps) {
  return (
    <div id="notification-drawer-overlay" class="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      {/* Tap outside to close */}
      <div class="absolute inset-0" onClick={onClose}></div>

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        class="relative w-full max-w-sm h-full bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shadow-2xl z-10"
      >
        <div class="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div class="flex items-center gap-2">
              <Bell class="w-5 h-5 text-lime-500" />
              <h3 class="text-md font-bold text-slate-100">الإشعارات والتنبيهات</h3>
              {notifications.some((n) => !n.isRead) && (
                <span class="w-2 h-2 bg-lime-500 rounded-full animate-ping"></span>
              )}
            </div>
            <button
              onClick={onClose}
              class="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          {/* Mark All Read action */}
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={onMarkAllRead}
              class="text-xs font-semibold text-lime-400 hover:text-lime-300 transition text-right mb-4 flex items-center justify-end gap-1"
            >
              <Check class="w-3.5 h-3.5" />
              <span>تحديد الكل كمقروء</span>
            </button>
          )}

          {/* List */}
          <div class="flex-1 overflow-y-auto space-y-3 pr-1">
            {notifications.length === 0 ? (
              <div class="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <Bell class="w-10 h-10 stroke-[1.5] mb-2 text-slate-600" />
                <p class="text-xs">لا توجد إشعارات جديدة حالياً</p>
              </div>
            ) : (
              notifications.map((notif) => {
                let icon = <Info class="w-4 h-4 text-sky-400" />;
                let iconBg = "bg-sky-500/10 border-sky-500/20";

                if (notif.type === "achievement") {
                  icon = <Trophy class="w-4 h-4 text-amber-400" />;
                  iconBg = "bg-amber-500/10 border-amber-500/20";
                } else if (notif.type === "reminder") {
                  icon = <Zap class="w-4 h-4 text-lime-400" />;
                  iconBg = "bg-lime-500/10 border-lime-500/20";
                }

                return (
                  <div
                    key={notif.id}
                    class={`p-3.5 rounded-xl border transition relative overflow-hidden group ${
                      notif.isRead
                        ? "bg-slate-950/30 border-slate-900/60 text-slate-300"
                        : "bg-slate-950/70 border-slate-800/80 text-slate-100 shadow-md"
                    }`}
                  >
                    {!notif.isRead && (
                      <div class="absolute right-0 top-0 bottom-0 w-1 bg-lime-500"></div>
                    )}
                    
                    <div class="flex gap-3">
                      <div class={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${iconBg}`}>
                        {icon}
                      </div>

                      <div class="flex-1">
                        <p class="text-xs font-semibold leading-relaxed mb-1">{notif.title}</p>
                        <div class="flex items-center justify-between">
                          <span class="text-[10px] text-slate-500 font-mono">{notif.time}</span>
                          <button
                            onClick={() => onClear(notif.id)}
                            class="text-[10px] text-slate-500 hover:text-lime-400 opacity-0 group-hover:opacity-100 transition duration-150"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div class="pt-4 border-t border-slate-800 text-center">
          <p class="text-[10px] text-slate-500">فيتنس برو • نسختك الأفضل تبدأ اليوم</p>
        </div>
      </motion.div>
    </div>
  );
}
