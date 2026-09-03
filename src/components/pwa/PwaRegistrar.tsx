'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaRegistrar: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered successfully with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('[PWA] Service Worker registration failed:', error);
          });
      });
    }

    // 2. Capture BeforeInstallPrompt Event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if user previously dismissed prompt in this session
      const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    // 3. Listen for App Installed Event
    const handleAppInstalled = () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      toast.success(
        '🎉 LBC Mandap installed on your device! You can now launch it directly from your home screen.',
        'App Installed'
      );
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
    } catch (err) {
      console.error('[PWA] Error launching install prompt:', err);
    } finally {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    setIsDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (!showInstallBanner || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#FFFDF7] rounded-3xl border-2 border-amber-400 p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Subtle Decorative Marigold Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-400/20 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 shadow-md border-2 border-amber-400 shrink-0 overflow-hidden flex items-center justify-center p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/icon.svg" alt="Temple & Avatar" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm sm:text-base font-black text-stone-900">
                  Install LBC Mandap App
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase border border-emerald-300">
                  Fast &amp; Offline
                </span>
              </div>
              <p className="text-[11px] text-stone-600 font-semibold mt-0.5 leading-snug">
                1-tap home screen access on phone &amp; works offline in village areas.
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-amber-100/60 transition-colors shrink-0"
            aria-label="Dismiss install banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 mt-3.5 pt-2.5 border-t border-amber-200">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 border border-amber-200"
          >
            <Download className="w-4 h-4" />
            <span>📲 Install App on Phone</span>
          </button>

          <button
            onClick={handleDismiss}
            className="py-2.5 px-3 rounded-2xl border border-amber-300 bg-white hover:bg-amber-50 text-stone-700 font-bold text-xs transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};
