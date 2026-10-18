"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { EnvelopeSimpleOpen, Sparkle } from "@phosphor-icons/react";
import { CANVA_ASSETS, getAllPreloadAssetUrls } from "@/lib/assets";

declare global {
  interface Window {
    __NK_PRELOADED_IMAGES__?: HTMLImageElement[];
  }
}

interface AssetPreloaderProps {
  children: React.ReactNode;
}

export default function AssetPreloader({ children }: AssetPreloaderProps) {
  const prefersReducedMotion = false;
  const [isReady, setIsReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const totalCount = getAllPreloadAssetUrls().length + 1;
  const [statusLabel, setStatusLabel] = useState(
    "Preparing fonts & coastal scrapbook assets..."
  );

  useEffect(() => {
    let isCancelled = false;
    const urls = getAllPreloadAssetUrls();
    const totalTasks = urls.length + 1; // +1 for custom fonts

    const retainedImages: HTMLImageElement[] = [];
    if (typeof window !== "undefined") {
      window.__NK_PRELOADED_IMAGES__ = retainedImages;
    }

    let completed = 0;
    const markStepDone = (currentLabel?: string) => {
      if (isCancelled) return;
      completed += 1;
      setLoadedCount(completed);
      if (currentLabel) {
        setStatusLabel(currentLabel);
      }
    };

    const preloadSingleImage = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.decoding = "async";
        img.loading = "eager";
        retainedImages.push(img);

        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          const pct = Math.round(((completed + 1) / totalTasks) * 100);
          if (pct < 35) {
            markStepDone("Loading envelope, postcards & stamps...");
          } else if (pct < 70) {
            markStepDone("Loading January 2027 calendar & couple portraits...");
          } else if (pct < 95) {
            markStepDone("Loading Game Plan timeline & Zambales travel guide...");
          } else {
            markStepDone("Finalizing invitation experience...");
          }
          resolve();
        };

        img.onload = () => {
          if (typeof img.decode === "function") {
            img.decode().then(finish).catch(finish);
          } else {
            finish();
          }
        };
        img.onerror = finish;
        img.src = url;
      });
    };

    const preloadFonts = async (): Promise<void> => {
      try {
        if (typeof document !== "undefined" && "fonts" in document) {
          await Promise.allSettled([
            document.fonts.load("400 1em 'Campground'"),
            document.fonts.load("400 1em 'Aileron'"),
            document.fonts.load("700 1em 'Aileron'"),
            document.fonts.load("400 1em 'Courier Prime'"),
            document.fonts.load("700 1em 'Courier Prime'"),
            document.fonts.load("700 1em 'League Spartan'"),
            document.fonts.load("400 1em 'Arimo'"),
            document.fonts.ready,
          ]);
        }
      } catch {
        // Ignore font load errors and continue
      } finally {
        markStepDone("Custom Canva typography ready...");
      }
    };

    const runAllPreloads = async () => {
      // Safety ceiling so a slow mobile connection never hangs forever
      const safetyTimeout = setTimeout(() => {
        if (!isCancelled) {
          setIsReady(true);
        }
      }, 12000);

      await Promise.all([
        preloadFonts(),
        ...urls.map((url) => preloadSingleImage(url)),
      ]);

      clearTimeout(safetyTimeout);

      if (!isCancelled) {
        setStatusLabel("Welcome to Kevin + Nica's Wedding Invitation!");
        // Brief pause at 100% so the progress bar visibly completes smoothly
        setTimeout(() => {
          if (!isCancelled) {
            setIsReady(true);
          }
        }, 260);
      }
    };

    runAllPreloads();

    return () => {
      isCancelled = true;
    };
  }, []);

  const progressPercent = Math.min(
    100,
    Math.round((loadedCount / Math.max(1, totalCount)) * 100)
  );

  return (
    <MotionConfig reducedMotion="never">
      <AnimatePresence mode="wait">
        {!isReady && (
          <motion.div
            key="nk-asset-preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.02 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#122218] text-[#f2ffc5] px-6 select-none overflow-hidden"
          >
            {/* Subtle warm coastal radial glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 38%, rgba(255, 122, 47, 0.18) 0%, rgba(242, 255, 197, 0.06) 42%, rgba(14, 28, 19, 0.95) 100%)",
              }}
            />

            <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
              {/* Animated Envelope Emblem */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : { y: [0, -6, 0], rotate: [-2, 2, -2] }
                }
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#ff7a2f]/15 border border-[#ff7a2f]/40 shadow-[0_12px_35px_rgba(0,0,0,0.45)]"
              >
                <EnvelopeSimpleOpen
                  className="h-10 w-10 text-[#ff7a2f]"
                  weight="duotone"
                />
                <Sparkle
                  className="absolute -top-2 -right-2 h-5 w-5 text-[#f2ffc5]"
                  weight="fill"
                />
              </motion.div>

              {/* Couple Header */}
              <p className="font-courier text-xs uppercase tracking-[0.25em] text-[#f2ffc5]/80 text-balance">
                Saturday * January 9, 2027 * Zambales
              </p>

              <h1 className="mt-2 font-spartan font-bold text-3xl sm:text-4xl tracking-[0.14em] uppercase text-[#f2ffc5] drop-shadow-md text-balance">
                KEVIN + NICA
              </h1>

              <p className="mt-1 font-campground text-2xl text-[#ff9b54] -rotate-2 text-balance">
                Meet us in Botolan
              </p>

              {/* Progress Bar Track */}
              <div className="mt-8 w-full rounded-full bg-white/10 p-1 border border-white/15 shadow-inner">
                <motion.div
                  className="h-2.5 rounded-full bg-gradient-to-r from-[#ff7a2f] via-[#ffae52] to-[#f2ffc5]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              </div>

              {/* Percentage & Asset Counter */}
              <div className="mt-3 w-full flex items-center justify-between font-courier text-xs text-stone-300">
                <span className="truncate pr-2 text-pretty">{statusLabel}</span>
                <span className="shrink-0 font-bold text-[#f2ffc5] tabular-nums">
                  {progressPercent}% ({loadedCount}/{totalCount})
                </span>
              </div>
            </div>

            {/* Hidden offscreen pre-render cache for top hero assets */}
            <div
              aria-hidden="true"
              className="pointer-events-none fixed -left-[9999px] -top-[9999px] h-px w-px overflow-hidden opacity-0"
            >
              <img src={CANVA_ASSETS.page1.oceanBokehBg} alt="" />
              <img src={CANVA_ASSETS.page1.kevinAndNicaOrangeLogo} alt="" />
              <img src={CANVA_ASSETS.page1.envelopeBackOpen} alt="" />
              <img src={CANVA_ASSETS.page1.youreInvitedPostcard} alt="" />
              <img src={CANVA_ASSETS.page1.envelopeFrontPocket} alt="" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Only mount and reveal the invitation pages after assets have finished loading */}
      {isReady && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </MotionConfig>
  );
}
