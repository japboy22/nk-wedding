"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import {
  CalendarHeart,
  ClockCountdown,
  EnvelopeSimpleOpen,
  MapPinLine,
  Sparkle,
} from "@phosphor-icons/react";
import { EnvelopeHero } from "@/components/EnvelopeHero";
import { GamePlanSection } from "@/components/GamePlanSection";
import TravelAndStaySection from "@/components/TravelAndStaySection";
import { SaveTheDateSection } from "@/components/SaveTheDateSection";
import { RsvpDialogModal } from "@/components/RsvpDialogModal";
import AssetPreloader from "@/components/AssetPreloader";
import { CANVA_ASSETS } from "@/lib/assets";

type SectionId =
  | "chapter-cover"
  | "chapter-game-plan"
  | "chapter-travel-and-stay"
  | "chapter-save-the-date";

interface NavSectionItem {
  id: SectionId;
  label: string;
  mobileLabel: string;
  icon: React.ElementType;
}

const NAV_SECTIONS: NavSectionItem[] = [
  {
    id: "chapter-cover",
    label: "Invite",
    mobileLabel: "Invite",
    icon: EnvelopeSimpleOpen,
  },
  {
    id: "chapter-save-the-date",
    label: "Date & Attire",
    mobileLabel: "Attire",
    icon: CalendarHeart,
  },
  {
    id: "chapter-game-plan",
    label: "Game Plan",
    mobileLabel: "Game Plan",
    icon: ClockCountdown,
  },
  {
    id: "chapter-travel-and-stay",
    label: "Travel & Stay",
    mobileLabel: "Travel",
    icon: MapPinLine,
  },
];

function WeddingInvitationContent() {
  const [activeSection, setActiveSection] =
    useState<SectionId>("chapter-cover");
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const isManualScrollingRef = useRef(false);
  const manualScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const { scrollY } = useScroll();

  const detectActiveSectionOnScroll = useCallback(() => {
    if (isManualScrollingRef.current || typeof window === "undefined") return;

    // Reading line at 38% from the top of the mobile/desktop viewport
    const triggerLine = window.innerHeight * 0.38;

    let detected: SectionId | null = null;

    for (const item of NAV_SECTIONS) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();

      if (rect.top <= triggerLine && rect.bottom > triggerLine) {
        detected = item.id;
        break;
      }
    }

    // Fallback: pick whichever section's top is closest above or near the trigger line
    if (!detected) {
      let closestId: SectionId = "chapter-cover";
      let smallestDistance = Number.POSITIVE_INFINITY;

      for (const item of NAV_SECTIONS) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - triggerLine);
        if (dist < smallestDistance) {
          smallestDistance = dist;
          closestId = item.id;
        }
      }
      detected = closestId;
    }

    if (detected) {
      setActiveSection((prev) => (prev === detected ? prev : detected));
    }
  }, []);

  // Track scroll position via Motion's batched scroll value
  useMotionValueEvent(scrollY, "change", () => {
    detectActiveSectionOnScroll();
  });

  // Also observe sections with IntersectionObserver after AssetPreloader mounts them
  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      detectActiveSectionOnScroll();
    });

    const observer = new IntersectionObserver(
      () => {
        detectActiveSectionOnScroll();
      },
      {
        root: null,
        rootMargin: "-25% 0px -45% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    NAV_SECTIONS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    window.addEventListener("resize", detectActiveSectionOnScroll, {
      passive: true,
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", detectActiveSectionOnScroll);
      if (manualScrollTimeoutRef.current) {
        clearTimeout(manualScrollTimeoutRef.current);
      }
    };
  }, [detectActiveSectionOnScroll]);

  const handleNavigate = (id: SectionId) => {
    setActiveSection(id);
    const target = document.getElementById(id);
    if (!target) return;

    isManualScrollingRef.current = true;
    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });

    manualScrollTimeoutRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
      detectActiveSectionOnScroll();
    }, 750);
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#122017] text-stone-100 overflow-x-hidden">
      {/* Main Vertical Scroll Experience matching the live Canva page order */}
      <main className="w-full">
        {/* Page 1: Cover & Interactive Envelope */}
        <div id="chapter-cover">
          <EnvelopeHero onOpenRsvp={() => setIsRsvpModalOpen(true)} />
        </div>

        {/* Page 2: January 2027 Calendar, Couple Sketch, Blinking Cat RSVP, Attire & Countdown */}
        <div id="chapter-save-the-date">
          <SaveTheDateSection onOpenRsvp={() => setIsRsvpModalOpen(true)} />
        </div>

        {/* Page 3: The Game Plan (Beach Resort Timeline) */}
        <div id="chapter-game-plan">
          <GamePlanSection />
        </div>

        {/* Page 4: How to Get to Villa Elisa & Where to Stay in Zambales */}
        <div id="chapter-travel-and-stay">
          <TravelAndStaySection />
        </div>
      </main>

      {/* Footer Section with Official RSVP Button (extra bottom padding for mobile bottom nav clearance) */}
      <footer className="relative z-30 w-full bg-[#101d15] border-t border-[#f2ffc5]/20 pt-12 sm:pt-16 pb-28 sm:pb-32 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl flex flex-col items-center text-center">
          <img
            src={CANVA_ASSETS.page2.kevinAndNicaWhiteLogo}
            alt="Kevin and Nica"
            className="w-24 sm:w-28 h-auto object-contain opacity-95 mb-4"
          />

          <p className="font-spartan font-bold text-lg sm:text-2xl text-[#f2ffc5] uppercase tracking-[0.08em] text-balance">
            Ready to Celebrate with Kevin &amp; Nica?
          </p>
          <p className="mt-1.5 font-courier text-xs sm:text-sm text-stone-300 max-w-md text-pretty">
            Saturday, January 9, 2027 * Villa Elisa Botolan, Zambales
            <br />
            Kindly confirm your attendance on or before November 15, 2026.
          </p>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setIsRsvpModalOpen(true)}
              className="inline-flex items-center gap-2.5 rounded-full bg-[#ff7a2f] hover:bg-[#ff8f4c] text-white font-spartan font-bold text-sm sm:text-base uppercase tracking-widest px-8 py-4 shadow-[0_12px_30px_rgba(255,122,47,0.4)] transition-all cursor-pointer hover:-translate-y-0.5 active:scale-95"
            >
              <Sparkle className="w-5 h-5" weight="fill" />
              <span>RSVP Now</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile-First Fixed Bottom Section Navigation Bar */}
      <nav
        aria-label="Wedding Invitation Sections"
        className="fixed bottom-0 inset-x-0 z-40 px-2.5 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] pt-1.5 pointer-events-none flex justify-center"
      >
        <div className="pointer-events-auto w-full max-w-md sm:max-w-xl rounded-2xl sm:rounded-full bg-[#0d1912]/90 backdrop-blur-xl border border-[#f2ffc5]/20 shadow-[0_14px_38px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.12)] p-1.5 flex items-center justify-between gap-1">
          {NAV_SECTIONS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={`relative isolate flex-1 min-w-0 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 rounded-xl sm:rounded-full py-2 sm:py-2.5 px-1.5 sm:px-3.5 transition-colors cursor-pointer select-none active:scale-95 ${
                  isActive
                    ? "text-[#132218]"
                    : "text-stone-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-active-pill"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                    className="absolute inset-0 rounded-xl sm:rounded-full bg-[#f2ffc5] shadow-[0_4px_14px_rgba(242,255,197,0.3)] z-0"
                  />
                )}
                <Icon
                  className={`relative z-10 w-4 h-4 shrink-0 ${
                    isActive ? "text-[#c74f16]" : "text-[#f2ffc5]/85"
                  }`}
                  weight={isActive ? "fill" : "regular"}
                />
                <span className="relative z-10 font-spartan font-bold text-[10px] sm:text-[11px] uppercase tracking-wider truncate leading-tight">
                  <span className="sm:hidden">{item.mobileLabel}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </button>
            );
          })}

          <div
            className="h-6 w-px bg-white/15 mx-0.5 shrink-0"
            aria-hidden="true"
          />

          {/* Primary RSVP Quick Action in Bottom Bar */}
          <button
            type="button"
            onClick={() => setIsRsvpModalOpen(true)}
            className="shrink-0 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 rounded-xl sm:rounded-full bg-[#ff7a2f] hover:bg-[#ff8f4c] text-white py-2 sm:py-2.5 px-3 sm:px-4 shadow-[0_4px_14px_rgba(255,122,47,0.4)] transition-all cursor-pointer select-none active:scale-95"
          >
            <Sparkle className="w-4 h-4 shrink-0" weight="fill" />
            <span className="font-spartan font-bold text-[10px] sm:text-[11px] uppercase tracking-wider leading-tight">
              RSVP
            </span>
          </button>
        </div>
      </nav>

      {/* In-App RSVP Dialog Box Modal */}
      <RsvpDialogModal
        isOpen={isRsvpModalOpen}
        onClose={() => setIsRsvpModalOpen(false)}
      />
    </div>
  );
}

export default function WeddingInvitationExperience() {
  return (
    <AssetPreloader>
      <WeddingInvitationContent />
    </AssetPreloader>
  );
}


