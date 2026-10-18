"use client";

import React, { useState } from "react";
import {
  EnvelopeSimpleOpen,
  CalendarHeart,
  ClockCountdown,
  MapPinLine,
  ChatCircleText,
  Images,
  Rows,
  Slideshow,
} from "@phosphor-icons/react";
import { EnvelopeHero } from "@/components/EnvelopeHero";
import { SaveTheDateSection } from "@/components/SaveTheDateSection";
import { GamePlanSection } from "@/components/GamePlanSection";
import TravelAndStaySection from "@/components/TravelAndStaySection";
import RsvpAndWishesModal from "@/components/RsvpAndWishesModal";
import AssetPreloader from "@/components/AssetPreloader";
import { EXTERNAL_LINKS } from "@/lib/assets";

type ChapterId = "cover" | "save-the-date" | "game-plan" | "travel-and-stay";

export default function WeddingInvitationExperience() {
  const [viewMode, setViewMode] = useState<"scroll" | "deck">("scroll");
  const [activeChapter, setActiveChapter] = useState<ChapterId>("cover");
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    tab: "rsvp" | "wishes" | "canva";
  }>({
    isOpen: false,
    tab: "rsvp",
  });

  const navigateToChapter = (chapter: ChapterId) => {
    setActiveChapter(chapter);
    if (viewMode === "scroll") {
      const targetId =
        chapter === "cover"
          ? "chapter-cover"
          : chapter === "save-the-date"
          ? "chapter-save-the-date"
          : chapter === "game-plan"
          ? "chapter-game-plan"
          : "chapter-travel-and-stay";
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openModal = (tab: "rsvp" | "wishes" | "canva" = "rsvp") => {
    setModalState({ isOpen: true, tab });
  };

  return (
    <AssetPreloader>
      <div className="relative min-h-[100dvh] w-full bg-[#122017] text-stone-100 overflow-x-hidden">
      {/* Top Mode & Quick Info Pill Bar */}
      <header className="fixed top-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl pointer-events-none flex items-center justify-between gap-2">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-black/55 backdrop-blur-md border border-white/20 px-3.5 py-1.5 shadow-lg">
          <span className="h-2 w-2 rounded-full bg-[#ff7a2f] animate-pulse" />
          <span className="font-spartan font-bold text-[11px] sm:text-xs tracking-wider uppercase text-[#f2ffc5]">
            KEVIN + NICA
          </span>
          <span className="hidden sm:inline font-courier text-[11px] text-stone-300">
            | Jan 9, 2027 * Botolan, Zambales
          </span>
        </div>

        <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 p-1 shadow-lg">
          <button
            type="button"
            onClick={() => setViewMode("scroll")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-spartan font-bold text-[10px] sm:text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === "scroll"
                ? "bg-[#f2ffc5] text-[#16291c]"
                : "text-stone-200 hover:text-white"
            }`}
            title="Scroll seamlessly through all chapters"
          >
            <Rows className="w-3.5 h-3.5" weight="bold" />
            <span>Scroll</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("deck")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-spartan font-bold text-[10px] sm:text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === "deck"
                ? "bg-[#f2ffc5] text-[#16291c]"
                : "text-stone-200 hover:text-white"
            }`}
            title="Flip page by page like an interactive card deck"
          >
            <Slideshow className="w-3.5 h-3.5" weight="bold" />
            <span>Page Deck</span>
          </button>

          <button
            type="button"
            onClick={() => openModal("canva")}
            className="inline-flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 text-[#f2ffc5] px-2.5 py-1 font-courier text-[10px] sm:text-[11px] transition-colors cursor-pointer"
            title="Inspect the 7 original Canva reference slides"
          >
            <Images className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Original Slides</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full pb-20 sm:pb-0">
        {viewMode === "scroll" ? (
          <>
            <div id="chapter-cover">
              <EnvelopeHero
                onEnterClick={() => navigateToChapter("save-the-date")}
                onOpenRsvp={() => openModal("rsvp")}
              />
            </div>

            <div id="chapter-save-the-date">
              <SaveTheDateSection
                onBackToCover={() => navigateToChapter("cover")}
                onOpenRsvp={() => openModal("rsvp")}
                onGoToGamePlan={() => navigateToChapter("game-plan")}
              />
            </div>

            <div id="chapter-game-plan">
              <GamePlanSection
                onBack={() => navigateToChapter("save-the-date")}
                onNextToTravel={() => navigateToChapter("travel-and-stay")}
              />
            </div>

            <div id="chapter-travel-and-stay">
              <TravelAndStaySection
                onBackToGamePlan={() => navigateToChapter("game-plan")}
                onOpenRsvp={() => openModal("rsvp")}
              />
            </div>
          </>
        ) : (
          <div className="min-h-[100dvh]">
            {activeChapter === "cover" && (
              <EnvelopeHero
                onEnterClick={() => navigateToChapter("save-the-date")}
                onOpenRsvp={() => openModal("rsvp")}
              />
            )}
            {activeChapter === "save-the-date" && (
              <SaveTheDateSection
                onBackToCover={() => navigateToChapter("cover")}
                onOpenRsvp={() => openModal("rsvp")}
                onGoToGamePlan={() => navigateToChapter("game-plan")}
              />
            )}
            {activeChapter === "game-plan" && (
              <GamePlanSection
                onBack={() => navigateToChapter("save-the-date")}
                onNextToTravel={() => navigateToChapter("travel-and-stay")}
              />
            )}
            {activeChapter === "travel-and-stay" && (
              <TravelAndStaySection
                onBackToGamePlan={() => navigateToChapter("game-plan")}
                onOpenRsvp={() => openModal("rsvp")}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Interactive Chapter Dock */}
      <nav
        aria-label="Wedding Invitation Chapters"
        className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-40 max-w-[96vw]"
      >
        <div className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 px-2.5 py-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.65)]">
          <button
            type="button"
            onClick={() => navigateToChapter("cover")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-spartan font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              activeChapter === "cover"
                ? "bg-[#ff7a2f] text-white shadow-sm"
                : "text-stone-200 hover:bg-white/10"
            }`}
          >
            <EnvelopeSimpleOpen className="w-4 h-4 shrink-0" weight="fill" />
            <span className="hidden sm:inline">Invite</span>
          </button>

          <button
            type="button"
            onClick={() => navigateToChapter("save-the-date")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-spartan font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              activeChapter === "save-the-date"
                ? "bg-[#ff7a2f] text-white shadow-sm"
                : "text-stone-200 hover:bg-white/10"
            }`}
          >
            <CalendarHeart className="w-4 h-4 shrink-0" weight="fill" />
            <span className="hidden sm:inline">Save The Date</span>
          </button>

          <button
            type="button"
            onClick={() => navigateToChapter("game-plan")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-spartan font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              activeChapter === "game-plan"
                ? "bg-[#ff7a2f] text-white shadow-sm"
                : "text-stone-200 hover:bg-white/10"
            }`}
          >
            <ClockCountdown className="w-4 h-4 shrink-0" weight="fill" />
            <span className="hidden sm:inline">Game Plan</span>
          </button>

          <button
            type="button"
            onClick={() => navigateToChapter("travel-and-stay")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-spartan font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              activeChapter === "travel-and-stay"
                ? "bg-[#ff7a2f] text-white shadow-sm"
                : "text-stone-200 hover:bg-white/10"
            }`}
          >
            <MapPinLine className="w-4 h-4 shrink-0" weight="fill" />
            <span className="hidden sm:inline">Travel & Stay</span>
          </button>

          <div className="h-5 w-px bg-white/20 mx-0.5" />

          <a
            href={EXTERNAL_LINKS.rsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#f2ffc5] hover:bg-white text-[#16291c] px-3.5 py-2 font-spartan font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <ChatCircleText className="w-4 h-4 text-[#d94625] shrink-0" weight="fill" />
            <span>RSVP</span>
          </a>
        </div>
      </nav>

      {/* Interactive RSVP, Page 7 Speech Bubble Wishes & Canva Reference Modal */}
      <RsvpAndWishesModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        initialTab={modalState.tab}
      />
      </div>
    </AssetPreloader>
  );
}
