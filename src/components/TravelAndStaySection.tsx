"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  NavigationArrow,
  MapPin,
  Car,
  Bus,
  Copy,
  Check,
  ArrowSquareOut,
  HouseLine,
  PhoneCall,
  ChatCircleDots,
  X,
  Sparkle,
} from "@phosphor-icons/react";
import { CANVA_ASSETS, EXTERNAL_LINKS } from "@/lib/assets";

interface TravelAndStaySectionProps {
  onBackToGamePlan?: () => void;
  onOpenRsvp?: () => void;
}

interface VillaItem {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  distance: string;
  cardImg: string;
  rotation: number;
  url: string;
  highlights: string[];
}

const VILLAS: VillaItem[] = [
  {
    id: "sinta",
    name: "Sinta Private Beach Villa",
    subtitle: "Private beachfront oasis in Botolan",
    tag: "Airbnb Top Pick",
    distance: "Near Villa Elisa shoreline",
    cardImg: CANVA_ASSETS.travelAndStay.sintaVillaCard,
    rotation: -4,
    url: EXTERNAL_LINKS.sintaAirbnbUrl,
    highlights: [
      "Direct beachfront access along Botolan coast",
      "Private pool & aesthetic tropical architecture",
      "Ideal for families or barkada groups attending the wedding",
    ],
  },
  {
    id: "irog",
    name: "Irog Private Beach Villa",
    subtitle: "Sister coastal sanctuary beside Sinta",
    tag: "Group Favorite",
    distance: "Botolan Coastal Strip",
    cardImg: CANVA_ASSETS.travelAndStay.irogVillaCard,
    rotation: 3.5,
    url: EXTERNAL_LINKS.irogAirbnbUrl,
    highlights: [
      "Spacious private compound with warm Zambales sunset views",
      "Cozy indoor-outdoor living spaces",
      "Minutes away from the ceremony & reception venue",
    ],
  },
  {
    id: "zambahouse",
    name: "Zambahouse Private Villas",
    subtitle: "Modern tropical villa retreat",
    tag: "Private Villa",
    distance: "Botolan, Zambales",
    cardImg: CANVA_ASSETS.travelAndStay.zambahouseVillaCard,
    rotation: -2.5,
    url: EXTERNAL_LINKS.zambahouseAirbnbUrl,
    highlights: [
      "Exclusive private villa listing on Airbnb",
      "Relaxed coastal garden and pool lounge",
      "Great for weekend stays before and after Jan 9, 2027",
    ],
  },
];

export default function TravelAndStaySection({
  onBackToGamePlan,
  onOpenRsvp,
}: TravelAndStaySectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [activeTransportTab, setActiveTransportTab] = useState<"all" | "car" | "bus">("all");
  const [selectedVilla, setSelectedVilla] = useState<VillaItem | null>(null);

  const venueAddress = "Villa Elisa Botolan, Botolan, Zambales, Philippines 2202";

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(venueAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2400);
    } catch {
      setCopiedAddress(false);
    }
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText("09771996706");
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2400);
    } catch {
      setCopiedPhone(false);
    }
  };

  return (
    <section
      id="travel-and-stay"
      aria-label="How to Get to Villa Elisa and Where to Stay in Zambales"
      className="relative min-h-[100dvh] w-full overflow-hidden py-14 sm:py-20 px-4 sm:px-6 lg:px-10 select-none"
    >
      {/* 1. Deep Green Coastal Texture Backdrop (Page 6 exact background) */}
      <div className="absolute inset-0 -z-20 bg-[#1c3323]">
        <img
          src={CANVA_ASSETS.travelAndStay.greenTextureBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-95"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 18%, rgba(28, 56, 36, 0.15) 0%, rgba(14, 30, 19, 0.58) 100%)",
          }}
        />
      </div>

      {/* Decorative Palm Leaves Top-Left & Tropical Branch */}
      <motion.img
        src={CANVA_ASSETS.travelAndStay.palmLeavesCutout}
        alt=""
        aria-hidden="true"
        initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
        whileInView={{ opacity: 0.9, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="pointer-events-none absolute -top-10 -left-16 sm:-left-10 w-56 sm:w-80 md:w-96 object-contain drop-shadow-xl z-0"
      />
      <motion.img
        src={CANVA_ASSETS.travelAndStay.tropicalBranchCutout}
        alt=""
        aria-hidden="true"
        initial={prefersReducedMotion ? false : { opacity: 0, x: 30 }}
        whileInView={{ opacity: 0.85, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="pointer-events-none absolute top-1/3 -right-16 sm:-right-10 w-48 sm:w-72 object-contain drop-shadow-xl z-0 rotate-[-25deg]"
      />
      <img
        src={CANVA_ASSETS.travelAndStay.beachPlantsCutout}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 w-64 sm:w-96 object-contain opacity-65 z-0"
      />

      <div className="relative z-10 mx-auto max-w-5xl flex flex-col items-center">
        {/* Top Navigation Row: Back Arrow + Page 6 Badge */}
        <div className="w-full flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <button
            type="button"
            onClick={onBackToGamePlan}
            className="group inline-flex items-center gap-2 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-md px-4 py-2 text-white border border-white/20 transition-all cursor-pointer active:scale-95"
          >
            <img
              src={CANVA_ASSETS.page2.backArrowSvg}
              alt=""
              className="w-5 h-5 invert opacity-90 group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="font-courier font-bold text-xs sm:text-sm tracking-wider uppercase">
              Back
            </span>
          </button>

          <div className="inline-flex items-center gap-2 rounded-full bg-[#f2ffc5]/15 backdrop-blur-md px-3.5 py-1.5 border border-[#f2ffc5]/30 text-[#f2ffc5] text-xs font-courier">
            <MapPin className="w-3.5 h-3.5 text-[#ff6b57]" weight="fill" />
            <span>Botolan, Zambales Guide</span>
          </div>
        </div>

        {/* 2. Page 6 Header: "HOW TO GET" + Red Pin + "TO VILLA ELISA?" */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative text-center max-w-2xl mx-auto mb-8 sm:mb-12"
        >
          <div className="relative inline-flex items-center justify-center">
            <h2
              className="font-courier font-bold text-[#f2ffc5] text-2xl sm:text-4xl md:text-5xl tracking-[0.08em] uppercase drop-shadow-[0_3px_10px_rgba(0,0,0,0.45)]"
            >
              HOW TO GET
            </h2>
            <motion.img
              src={CANVA_ASSETS.travelAndStay.redPinSticker}
              alt="Red map pin"
              animate={
                prefersReducedMotion
                  ? {}
                  : { y: [0, -6, 0], rotate: [12, 16, 12] }
              }
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-9 sm:w-12 md:w-14 object-contain ml-2 -mt-4 drop-shadow-lg"
            />
          </div>

          <p className="mt-1">
            <a
              href={EXTERNAL_LINKS.villaElisaWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Visit Villa Elisa Botolan Official Website"
              className="inline-flex items-center gap-2 font-spartan font-bold text-[#f2ffc5] hover:text-[#ffd97d] text-3xl sm:text-5xl md:text-6xl tracking-[0.06em] uppercase drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)] underline decoration-[#f2ffc5]/35 underline-offset-4 transition-colors"
            >
              <span>TO VILLA ELISA?</span>
            </a>
          </p>
        </motion.div>

        {/* 3. Interactive Split Row: Heart Map + Waze Badge (Left) & Torn Paper Directions Card (Right) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center mb-16 sm:mb-20">
          {/* Left Column: Heart-Shaped Map of Botolan + Clickable Waze Badge */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-5 flex flex-col items-center relative"
          >
            <div className="relative group w-64 sm:w-76 md:w-84">
              {/* Heart Map Image from Canva */}
              <a
                href={EXTERNAL_LINKS.villaElisaWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Visit Villa Elisa Botolan Official Website"
                className="block relative transition-transform duration-300 group-hover:scale-[1.03] group-hover:-rotate-1"
              >
                <img
                  src={CANVA_ASSETS.travelAndStay.heartMapBotolan}
                  alt="Heart-shaped map of Botolan, Zambales showing Villa Elisa"
                  className="w-full h-auto object-contain scrapbook-drop-shadow"
                />
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/75 text-[#f2ffc5] font-courier text-[11px] px-3 py-1 border border-[#f2ffc5]/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  Tap for Villa Elisa Botolan
                </span>
              </a>

              {/* Waze App Sticker Badge overlapping top-right of heart map */}
              <motion.a
                href={EXTERNAL_LINKS.wazeVillaElisaUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={prefersReducedMotion ? {} : { scale: 1.09, rotate: 6 }}
                whileTap={{ scale: 0.95 }}
                className="absolute -top-4 -right-2 sm:right-0 z-20 block w-20 sm:w-24 cursor-pointer"
                title="Navigate to Villa Elisa Botolan with Waze"
              >
                <img
                  src={CANVA_ASSETS.travelAndStay.wazeBadge}
                  alt="Open in Waze"
                  className="w-full h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
                />
              </motion.a>
            </div>

            {/* Direct Navigation Pill Buttons below Heart Map */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
              <a
                href={EXTERNAL_LINKS.villaElisaWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff7a2f] hover:bg-[#ff8f4c] text-white font-spartan font-bold text-xs tracking-wider uppercase px-4 py-2.5 shadow-md transition-all active:scale-95"
              >
                <HouseLine className="w-4 h-4" weight="fill" />
                <span>Villa Elisa Botolan</span>
              </a>
              <a
                href={EXTERNAL_LINKS.wazeVillaElisaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#33ccff] hover:bg-[#5cd6ff] text-[#09212a] font-spartan font-bold text-xs tracking-wider uppercase px-4 py-2.5 shadow-md transition-all active:scale-95"
              >
                <NavigationArrow className="w-4 h-4" weight="fill" />
                <span>Open in Waze</span>
              </a>
              <a
                href={EXTERNAL_LINKS.googleMapsVillaElisaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#f2ffc5] hover:bg-white text-[#193020] font-spartan font-bold text-xs tracking-wider uppercase px-4 py-2.5 shadow-md transition-all active:scale-95"
              >
                <MapPin className="w-4 h-4 text-[#d93829]" weight="fill" />
                <span>Google Maps</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Layered White Torn Paper + Blue Lined Notebook Paper + Ransom Letters "p-a-r-a-d-i-s-e" */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="lg:col-span-7 relative"
          >
            <div className="relative mx-auto max-w-xl rounded-2xl p-1 sm:p-2">
              {/* White Torn Paper Backing Layer */}
              <div
                className="relative rounded-2xl bg-[#fbf9f3] text-[#1e1e1e] p-6 sm:p-8 md:p-10 shadow-[0_20px_45px_rgba(0,0,0,0.45)] border border-stone-300/80 overflow-hidden"
                style={{
                  backgroundImage: `url(${CANVA_ASSETS.travelAndStay.blueLinedTornPaper})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Soft cream readability overlay */}
                <div className="absolute inset-0 bg-[#faf7ef]/88 pointer-events-none" />

                {/* Top Masking Tape */}
                <img
                  src={CANVA_ASSETS.travelAndStay.maskingTapeStrip}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 w-36 sm:w-44 object-contain opacity-90 rotate-[-2deg]"
                />

                <div className="relative z-10">
                  {/* "Find your way to" + Ransom Note Cutout Letters "p-a-r-a-d-i-s-e" */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-300/80">
                    <span className="font-campground text-2xl sm:text-3xl text-[#1f2e23] -rotate-2">
                      Find your way to
                    </span>

                    <div
                      className="flex items-center gap-0.5 sm:gap-1 py-1"
                      aria-label="paradise"
                    >
                      {CANVA_ASSETS.travelAndStay.ransomLetters.map((item, idx) => (
                        <motion.img
                          key={`${item.char}-${idx}`}
                          src={item.src}
                          alt={item.char}
                          whileHover={
                            prefersReducedMotion
                              ? {}
                              : { y: -4, rotate: idx % 2 === 0 ? -8 : 8, scale: 1.12 }
                          }
                          className="h-7 sm:h-9 md:h-10 w-auto object-contain drop-shadow-sm select-none"
                          style={{
                            transform: `rotate(${idx % 2 === 0 ? -3 : 4}deg)`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Intro Paragraph from Canva Page 6 */}
                  <p className="mt-4 font-courier text-xs sm:text-sm leading-relaxed text-stone-800">
                    <a
                      href={EXTERNAL_LINKS.villaElisaWebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#1e3a27] underline hover:text-[#d95338] transition-colors"
                    >
                      Villa Elisa Botolan
                    </a>{" "}
                    sits along the pristine shores of Botolan,
                    Zambales - a roughly 3 to 4 hour drive from Manila. The journey
                    north along the SCTEX is part of the experience, with Pinatubo
                    views welcoming you as you approach.
                  </p>

                  {/* Interactive Filter Tabs for Car / Bus */}
                  <div className="mt-4 flex items-center gap-2">
                    {(
                      [
                        { id: "all", label: "All Routes" },
                        { id: "car", label: "By Car" },
                        { id: "bus", label: "By Bus" },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTransportTab(tab.id)}
                        className={`rounded-full px-3 py-1 font-spartan font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                          activeTransportTab === tab.id
                            ? "bg-[#1e3a27] text-[#f2ffc5] shadow-sm"
                            : "bg-stone-200/80 text-stone-700 hover:bg-stone-300/80"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Transport Route Details */}
                  <div className="mt-4 space-y-3.5 font-courier text-xs sm:text-sm">
                    {(activeTransportTab === "all" || activeTransportTab === "car") && (
                      <div className="rounded-xl bg-white/85 p-3.5 border border-stone-200/90 shadow-xs">
                        <div className="flex items-center gap-2 font-spartan font-bold text-xs tracking-wider uppercase text-[#1e3a27]">
                          <Car className="w-4 h-4 text-[#d95338]" weight="fill" />
                          <span>BY CAR</span>
                        </div>
                        <p className="mt-1 text-stone-800 leading-relaxed">
                          Via NLEX-SCTEX-Subic Exit / Approx. 3-4 hrs from Manila -
                          Exit at Olongapo-Gapan Road
                        </p>
                      </div>
                    )}

                    {(activeTransportTab === "all" || activeTransportTab === "bus") && (
                      <div className="rounded-xl bg-white/85 p-3.5 border border-stone-200/90 shadow-xs">
                        <div className="flex items-center gap-2 font-spartan font-bold text-xs tracking-wider uppercase text-[#1e3a27]">
                          <Bus className="w-4 h-4 text-[#2b6cb0]" weight="fill" />
                          <span>BY BUS</span>
                        </div>
                        <p className="mt-1 text-stone-800 leading-relaxed">
                          Victory Liner from Pasay or Cubao / Alight at San Antonio /
                          Botolan terminal - Short tricycle ride to resort
                        </p>
                      </div>
                    )}

                    {/* Address Box with One-Tap Copy & Direct Link */}
                    <div className="rounded-xl bg-[#f3efe2] p-3.5 border border-stone-300/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-spartan font-bold text-xs tracking-wider uppercase text-[#1e3a27]">
                          ADDRESS
                        </div>
                        <a
                          href={EXTERNAL_LINKS.villaElisaWebsiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 inline-flex items-center gap-1.5 text-stone-800 hover:text-[#d95338] font-bold underline decoration-stone-400 underline-offset-2 transition-colors"
                        >
                          <span>{venueAddress}</span>
                          <ArrowSquareOut className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="self-start sm:self-center shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[#1e3a27] hover:bg-[#294d34] text-[#f2ffc5] font-courier text-xs px-3 py-2 transition-all cursor-pointer active:scale-95"
                      >
                        {copiedAddress ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" weight="bold" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Address</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4. "WHERE TO STAY IN ZAMBALES?" Kraft Paper Board + 3 Resort Badges + 3 Villa Polaroids */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full max-w-5xl rounded-3xl p-6 sm:p-9 md:p-12 shadow-[0_24px_60px_rgba(0,0,0,0.55)] border-2 border-[#d5be97]/50 overflow-visible"
          style={{
            backgroundImage: `url(${CANVA_ASSETS.page2.kraftPaperCalendarBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark warm kraft vignette */}
          <div className="
            absolute inset-0 rounded-3xl bg-gradient-to-b from-black/15 via-transparent to-black/25 pointer-events-none
          " />

          {/* Masking Tape Strips at Top Corners */}
          <img
            src={CANVA_ASSETS.travelAndStay.maskingTapeStrip}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 left-8 w-32 sm:w-40 object-contain rotate-[-8deg] drop-shadow-md z-20"
          />
          <img
            src={CANVA_ASSETS.travelAndStay.maskingTapeStrip}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 right-8 w-32 sm:w-40 object-contain rotate-[7deg] drop-shadow-md z-20"
          />

          {/* Starfish Cutout Top-Left & Pink Lily Bottom-Right */}
          <motion.img
            src={CANVA_ASSETS.travelAndStay.starfishCutout}
            alt="Coastal starfish sticker"
            animate={
              prefersReducedMotion ? {} : { rotate: [-6, 4, -6], scale: [1, 1.04, 1] }
            }
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -top-9 -left-5 sm:-left-8 w-20 sm:w-28 object-contain drop-shadow-xl z-20"
          />
          <img
            src={CANVA_ASSETS.page2.pinkLilySticker}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-7 -right-5 sm:-right-7 w-20 sm:w-28 object-contain drop-shadow-xl z-20"
          />

          {/* Section Title inside Kraft Board */}
          <div className="relative z-10 text-center mb-8">
            <h3 className="font-spartan font-bold text-[#f2ffc5] text-2xl sm:text-4xl md:text-5xl tracking-[0.06em] uppercase drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)]">
              WHERE TO STAY IN ZAMBALES?
            </h3>
            <p className="mt-1.5 font-courier text-xs sm:text-sm text-[#fff9e6] drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
              Tap any badge or villa polaroid below to open its official booking link
            </p>
          </div>

          {/* Grid: 3 Left Badges (Sundowners, Kalinto, Airbnb) + 3 Right Villa Polaroids */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 3 Tilted Resort & Booking Badges */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col items-center justify-center gap-4 sm:gap-5 flex-wrap">
              {[
                {
                  name: "Sundowners Zambales",
                  img: CANVA_ASSETS.travelAndStay.sundownersBadge,
                  url: EXTERNAL_LINKS.sundownersUrl,
                  rotate: -5,
                },
                {
                  name: "Kalinto Resort",
                  img: CANVA_ASSETS.travelAndStay.kalintoBadge,
                  url: EXTERNAL_LINKS.kalintoUrl,
                  rotate: 4,
                },
                {
                  name: "Airbnb Botolan Stays",
                  img: CANVA_ASSETS.travelAndStay.airbnbBadge,
                  url: EXTERNAL_LINKS.airbnbBotolanUrl,
                  rotate: -3,
                },
              ].map((badge) => (
                <motion.a
                  key={badge.name}
                  href={badge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : { scale: 1.07, rotate: 0, y: -3 }
                  }
                  whileTap={{ scale: 0.96 }}
                  style={{ transform: `rotate(${badge.rotate}deg)` }}
                  className="group relative block w-40 sm:w-48 lg:w-52 cursor-pointer"
                  title={`Explore ${badge.name}`}
                >
                  <img
                    src={badge.img}
                    alt={badge.name}
                    className="w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]"
                  />
                  <span className="mt-1 flex items-center justify-center gap-1 font-courier text-[11px] font-bold text-[#f2ffc5] opacity-90 group-hover:underline">
                    <span>{badge.name}</span>
                    <ArrowSquareOut className="w-3.5 h-3.5" />
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Right 3 Villa Polaroid Cards (Sinta, Irog, Zambahouse) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 items-center">
              {VILLAS.map((villa) => (
                <motion.div
                  key={villa.id}
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : { y: -8, rotate: 0, scale: 1.04 }
                  }
                  style={{ transform: `rotate(${villa.rotation}deg)` }}
                  className="group relative flex flex-col items-center"
                >
                  <a
                    href={villa.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${villa.name}`}
                    className="relative block w-full max-w-[250px] mx-auto cursor-pointer focus:outline-none"
                  >
                    <img
                      src={villa.cardImg}
                      alt={villa.name}
                      className="w-full h-auto object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.5)] rounded-lg"
                    />
                    <div className="mt-2.5 rounded-xl bg-black/65 group-hover:bg-black/80 backdrop-blur-md px-3 py-2 border border-white/20 text-left transition-colors">
                      <p className="font-spartan font-bold text-xs sm:text-sm text-[#f2ffc5] leading-snug group-hover:underline">
                        {villa.name}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[11px] font-courier text-stone-200">
                        <span>{villa.tag}</span>
                        <span className="inline-flex items-center gap-1 text-[#ffd97d] font-bold">
                          Open Link <ArrowSquareOut className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 5. Footer Connect & Coordinator Bar (Exact Page 6 Bottom Layout) */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 sm:mt-16 w-full max-w-4xl rounded-3xl bg-black/40 backdrop-blur-md border border-[#f2ffc5]/25 p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Click the Icons to Connect with the Couple */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <p className="font-spartan font-bold text-[#f2ffc5] text-sm sm:text-base tracking-[0.08em] uppercase">
                CLICK THE ICONS TO CONNECT WITH THE COUPLE!
              </p>
              <p className="mt-1 font-courier text-xs text-stone-300">
                Have questions or want to share your excitement? Message Kevin & Nica or RSVP directly:
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4">
                <a
                  href={EXTERNAL_LINKS.instagramConnectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 px-3.5 py-2 border border-white/15 transition-all hover:-translate-y-0.5"
                  title="Connect on Instagram"
                >
                  <img
                    src={CANVA_ASSETS.travelAndStay.instagramIcon}
                    alt="Instagram"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="font-courier text-xs text-white font-bold">
                    Instagram
                  </span>
                </a>

                <a
                  href={EXTERNAL_LINKS.messengerConnectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 px-3.5 py-2 border border-white/15 transition-all hover:-translate-y-0.5"
                  title="Connect on Messenger"
                >
                  <img
                    src={CANVA_ASSETS.travelAndStay.messengerIcon}
                    alt="Messenger"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="font-courier text-xs text-white font-bold">
                    Messenger
                  </span>
                </a>

                <a
                  href={EXTERNAL_LINKS.facebookConnectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 px-3.5 py-2 border border-white/15 transition-all hover:-translate-y-0.5"
                  title="Connect on Facebook"
                >
                  <img
                    src={CANVA_ASSETS.travelAndStay.facebookIcon}
                    alt="Facebook"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="font-courier text-xs text-white font-bold">
                    Facebook
                  </span>
                </a>
              </div>
            </div>

            {/* Right: Official Coordinator 8WILLHAPPEN + WhatsApp Rica */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right border-t md:border-t-0 md:border-l border-white/15 pt-6 md:pt-0 md:pl-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2ffc5]/15 px-3 py-1 font-spartan font-bold text-xs text-[#f2ffc5] tracking-wider uppercase border border-[#f2ffc5]/30">
                <Sparkle className="w-3.5 h-3.5" weight="fill" />
                OFFICIAL COORDINATOR 8WILLHAPPEN
              </span>

              <div className="mt-3 flex items-center gap-3">
                <img
                  src={CANVA_ASSETS.travelAndStay.whatsappLogo}
                  alt="WhatsApp"
                  className="w-9 h-9 object-contain drop-shadow"
                />
                <div className="text-left">
                  <p className="font-spartan font-bold text-lg sm:text-xl text-white tracking-wider">
                    RICA - 09771996706
                  </p>
                  <p className="font-courier text-xs text-stone-300">
                    Wedding Day & Travel Assistance
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-end gap-2.5">
                <a
                  href={EXTERNAL_LINKS.coordinatorWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] hover:bg-[#32e072] text-[#072612] font-spartan font-bold text-xs uppercase tracking-wider px-4 py-2 shadow-md transition-all active:scale-95"
                >
                  <ChatCircleDots className="w-4 h-4" weight="fill" />
                  <span>WhatsApp Rica</span>
                </a>

                <a
                  href={EXTERNAL_LINKS.coordinatorPhoneUrl}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-spartan font-bold text-xs uppercase tracking-wider px-3.5 py-2 border border-white/20 transition-all active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" weight="fill" />
                  <span>Call</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#f2ffc5] font-courier text-xs px-3 py-2 border border-[#f2ffc5]/25 transition-all cursor-pointer"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy #</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom RSVP CTA Banner */}
          <div className="mt-7 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={CANVA_ASSETS.wishes.doubleChatBubbleIcon}
                alt=""
                className="w-9 h-9 object-contain invert opacity-90"
              />
              <div className="text-center sm:text-left">
                <p className="font-spartan font-bold text-sm sm:text-base text-[#f2ffc5] uppercase tracking-wider">
                  Ready to celebrate with Kevin & Nica?
                </p>
                <p className="font-courier text-xs text-stone-300">
                  Kindly confirm your attendance on or before November 15, 2026.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a
                href={EXTERNAL_LINKS.rsvpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#ff7a2f] hover:bg-[#ff8f4c] text-white font-spartan font-bold text-xs sm:text-sm uppercase tracking-widest px-6 py-3 shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <span>Open Official RSVP</span>
                <ArrowSquareOut className="w-4 h-4" weight="bold" />
              </a>
              {onOpenRsvp && (
                <button
                  type="button"
                  onClick={onOpenRsvp}
                  className="shrink-0 rounded-full bg-white/15 hover:bg-white/25 text-[#f2ffc5] border border-[#f2ffc5]/30 font-spartan font-bold text-xs uppercase tracking-wider px-4 py-3 transition-all cursor-pointer active:scale-95"
                >
                  Guestbook Wishes
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Villa Detail Quick-View Modal */}
      <AnimatePresence>
        {selectedVilla && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            onClick={() => setSelectedVilla(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl bg-[#faf6ec] text-stone-900 p-6 sm:p-7 shadow-2xl border border-stone-300"
            >
              <button
                type="button"
                onClick={() => setSelectedVilla(null)}
                aria-label="Close villa details"
                className="absolute top-4 right-4 rounded-full bg-stone-200 hover:bg-stone-300 p-2 text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" weight="bold" />
              </button>

              <div className="flex flex-col sm:flex-row gap-5 items-center">
                <img
                  src={selectedVilla.cardImg}
                  alt={selectedVilla.name}
                  className="w-44 sm:w-48 h-auto object-contain rounded-xl shadow-md"
                />
                <div className="flex-1 text-center sm:text-left">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#1e3a27] text-[#f2ffc5] font-spartan font-bold text-[10px] uppercase tracking-wider px-2.5 py-1">
                    <HouseLine className="w-3.5 h-3.5" weight="fill" />
                    {selectedVilla.tag}
                  </span>
                  <h4 className="mt-2 font-spartan font-bold text-xl text-stone-900">
                    {selectedVilla.name}
                  </h4>
                  <p className="font-courier text-xs text-stone-600 mt-0.5">
                    {selectedVilla.subtitle}
                  </p>

                  <ul className="mt-3 space-y-1.5 text-left font-courier text-xs text-stone-700">
                    {selectedVilla.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-1.5">
                        <span className="text-[#d95338] font-bold">*</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setSelectedVilla(null)}
                  className="rounded-full px-4 py-2 font-courier text-xs text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={selectedVilla.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#ff5a5f] hover:bg-[#ff4248] text-white font-spartan font-bold text-xs uppercase tracking-wider px-5 py-2.5 shadow-md transition-all"
                >
                  <span>View Listing on Airbnb</span>
                  <ArrowSquareOut className="w-4 h-4" weight="bold" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
