import { useState, useEffect } from "react";
import { X, Share, Plus, Download, Smartphone } from "lucide-react";

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
}

function isAndroid() {
  return /android/i.test(navigator.userAgent);
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true;
}

export function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    const dismissed = localStorage.getItem("pwa_dismissed");
    if (dismissed) return;

    // Android: capture the native install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler as EventListener);

    // iOS: show our custom guide after a short delay
    if (isIOS() && !dismissed) {
      const t = setTimeout(() => setShowBanner(true), 2500);
      return () => { clearTimeout(t); window.removeEventListener("beforeinstallprompt", handler as EventListener); };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  const dismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    localStorage.setItem("pwa_dismissed", "1");
  };

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    dismiss();
  };

  if (!showBanner || installed) return null;

  const ios = isIOS();

  return (
    <>
      {/* Bottom banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-3 bg-[#111] border-t border-white/10 shadow-2xl safe-bottom">
        <div className="max-w-sm mx-auto flex items-center gap-3">
          <img src="/icon.png" alt="MUMY" className="w-11 h-11 rounded-2xl shadow-lg shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold leading-tight">Install MUMY IP Guard</p>
            <p className="text-slate-400 text-xs mt-0.5 leading-tight">
              {ios ? "Add to Home Screen for quick access" : "Install for offline access & faster scans"}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {ios ? (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5" />
                How?
              </button>
            ) : (
              <button
                onClick={handleAndroidInstall}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Install
              </button>
            )}
            <button onClick={dismiss} className="text-slate-500 hover:text-white p-1.5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS step-by-step guide modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111] rounded-3xl w-full max-w-sm border border-white/10 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/8">
              <div className="flex items-center gap-3">
                <img src="/icon.png" alt="MUMY" className="w-10 h-10 rounded-xl" />
                <div>
                  <p className="text-white font-bold text-base leading-tight">Add to Home Screen</p>
                  <p className="text-slate-500 text-xs">iPhone & iPad guide</p>
                </div>
              </div>
              <button onClick={() => setShowIOSGuide(false)} className="text-slate-500 hover:text-white p-1 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps */}
            <div className="px-6 py-5 space-y-5">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">Open in Safari</p>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Make sure you're using <strong className="text-slate-300">Safari</strong> — PWA install only works in Safari on iOS.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">
                    Tap the Share button&nbsp;
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-700 rounded align-middle">
                      <Share className="w-3.5 h-3.5 text-white" />
                    </span>
                  </p>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    It's the box-with-arrow icon at the bottom center of the Safari browser bar.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">
                    Tap "Add to Home Screen"&nbsp;
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-700 rounded align-middle">
                      <Plus className="w-3.5 h-3.5 text-white" />
                    </span>
                  </p>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Scroll down in the share sheet until you see <strong className="text-slate-300">Add to Home Screen</strong> and tap it.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5">
                  4
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">Tap "Add" to confirm</p>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    MUMY IP Guard will appear on your home screen like a native app.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="px-6 pb-6">
              <button
                onClick={dismiss}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-2xl text-sm transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
