import React, { useState } from "react";
import { X, Smartphone, Laptop, Download, CheckCircle, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall: () => Promise<void>;
  isNativePromptAvailable: boolean;
}

export default function InstallAppModal({
  isOpen,
  onClose,
  onNativeInstall,
  isNativePromptAvailable,
}: InstallAppModalProps) {
  const [deviceTab, setDeviceTab] = useState<"mobile" | "pc">("mobile");
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl z-10 space-y-6 text-right"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-lime-500/10 text-lime-400 border border-lime-500/25 rounded-xl flex items-center justify-center">
                  <Download className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-md font-black text-slate-100">تثبيت تطبيق فيتنس برو</h3>
                  <p className="text-[11px] text-slate-400 font-semibold">تصفّح أسرع، بدون إنترنت واستخدام كـ تطبيق رسمي</p>
                </div>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-850">
              <button
                onClick={() => setDeviceTab("pc")}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  deviceTab === "pc"
                    ? "bg-lime-500 text-slate-950 shadow-md shadow-lime-500/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>جهاز الكمبيوتر</span>
              </button>
              <button
                onClick={() => setDeviceTab("mobile")}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  deviceTab === "mobile"
                    ? "bg-lime-500 text-slate-950 shadow-md shadow-lime-500/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>الهاتف المحمول</span>
              </button>
            </div>

            {/* Content Tabs */}
            <div className="space-y-5 min-h-[220px]">
              {deviceTab === "mobile" ? (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-400 block mb-1">
                    اختر نظام التشغيل لهاتفك:
                  </span>

                  {/* Android Card */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <span className="text-xs font-bold text-lime-400 flex items-center gap-1.5">
                      <span>🤖</span> نظام أندرويد (متصفح كروم)
                    </span>
                    <ol className="text-[11px] text-slate-300 space-y-1.5 pr-4 list-decimal leading-relaxed">
                      <li>افتح الموقع في متصفح <strong className="text-slate-100">Google Chrome</strong> على هاتفك.</li>
                      <li>اضغط على زر الخيارات <strong className="text-slate-100">(الثلاث نقاط ┇)</strong> أعلى يسار المتصفح.</li>
                      <li>اختر <strong className="text-lime-400">"الإضافة إلى الشاشة الرئيسية"</strong> أو <strong className="text-lime-400">"تثبيت التطبيق"</strong>.</li>
                      <li>استمتع بـ فيتنس برو كـ تطبيق متكامل من شاشتك الرئيسية!</li>
                    </ol>
                  </div>

                  {/* iOS Card */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                      <span>🍎</span> هواتف آيفون (متصفح سفاري iOS)
                    </span>
                    <ol className="text-[11px] text-slate-300 space-y-1.5 pr-4 list-decimal leading-relaxed">
                      <li>افتح الموقع في متصفح <strong className="text-slate-100">Safari</strong> على الآيفون.</li>
                      <li>اضغط على زر <strong className="text-slate-100">المشاركة (Share 📤)</strong> في الشريط السفلي.</li>
                      <li>مرر لأسفل ثم اضغط على خيار <strong className="text-teal-400">"إضافة إلى الصفحة الرئيسية"</strong>.</li>
                      <li>اضغط على <strong className="text-slate-100">"إضافة"</strong> في الزاوية العلوية لتأكيد التثبيت.</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {isNativePromptAvailable ? (
                    <div className="bg-lime-500/10 border border-lime-500/20 rounded-2xl p-5 text-center space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-lime-400 block">⚡ متصفحك يدعم التثبيت الفوري بنقرة واحدة!</span>
                        <p className="text-[11px] text-slate-300">
                          يمكنك تثبيت فيتنس برو كـ تطبيق سطح مكتب مستقل خفيف وسريع بنقرة واحدة فقط.
                        </p>
                      </div>
                      <button
                        onClick={onNativeInstall}
                        className="w-full py-2.5 bg-lime-500 hover:bg-lime-600 text-slate-950 font-black text-xs rounded-xl transition duration-200 shadow-lg shadow-lime-500/10 cursor-pointer"
                      >
                        تثبيت كـ تطبيق مستقل الآن 🚀
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <span className="text-xs font-bold text-lime-400 flex items-center gap-1.5">
                        <span>💻</span> التثبيت على نظام ويندوز وماك (Chrome / Edge / Safari)
                      </span>
                      <ol className="text-[11px] text-slate-300 space-y-2 pr-4 list-decimal leading-relaxed">
                        <li>انظر إلى <strong className="text-slate-100">شريط العنوان (URL bar)</strong> في الجزء العلوي من المتصفح.</li>
                        <li>ستجد أيقونة صغيرة على شكل شاشة أو علامة <strong className="text-lime-400">(+)</strong> أو سهم تثبيت في نهاية شريط العنوان.</li>
                        <li>اضغط على الأيقونة ثم اختر <strong className="text-lime-400">"تثبيت" (Install)</strong> لتنزيل التطبيق على سطح المكتب.</li>
                        <li>سيفتح التطبيق في نافذة مستقلة وبدون شريط عنوان المتصفح لتجربة أكثر احترافية وسرعة.</li>
                      </ol>
                    </div>
                  )}

                  <div className="bg-slate-950/30 border border-slate-850 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-[10px] font-bold rounded-lg transition cursor-pointer"
                    >
                      {copied ? "تم النسخ! ✓" : "نسخ رابط التطبيق"}
                    </button>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-300 block">مشاركة التطبيق</span>
                      <span className="text-[9px] text-slate-500 block">انسخ الرابط لفتحه وتثبيته على أي جهاز آخر</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer warning */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>نسخة مستقرة v2.1</span>
              <span>يدعم التحديث التلقائي الفوري ⚡</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
