"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  EnvelopeOpenIcon,
  ArrowsOutSimpleIcon,
  XIcon,
  CalendarPlusIcon,
  SparkleIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import { CANVA_ASSETS, EXTERNAL_LINKS } from "@/lib/assets";

interface EnvelopeHeroProps {
  onEnterClick: () => void;
  onOpenRsvp: () => void;
}

export function EnvelopeHero({ onEnterClick, onOpenRsvp }: EnvelopeHeroProps) {
  const reduceMotion = useReducedMotion();
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState<{
    src: string;
    title: string;
    subtitle: string;
  } | null>(null);

  const stickers = [
    {
      id: "peony",
      src: CANVA_ASSETS.page1.envelopeStickers.pinkPeonyCutout,
      alt: "Pink Peony Flower",
      closedPos: { x: -45, y: 18, rotate: -15, scale: 0.72, opacity: 0.85 },
      openPos: { x: -135, y: -95, rotate: -24, scale: 1.05, opacity: 1 },
      className: "w-20 md:w-24",
    },
    {
      id: "cocktail",
      src: CANVA_ASSETS.page1.envelopeStickers.berryCocktailCutout,
      alt: "Signature Berry Cocktail",
      closedPos: { x: -24, y: 26, rotate: -4, scale: 0.7, opacity: 0.85 },
      openPos: { x: -92, y: -145, rotate: -12, scale: 1, opacity: 1 },
      className: "w-20 md:w-24",
    },
    {
      id: "disco",
      src: CANVA_ASSETS.page1.envelopeStickers.discoBall,
      alt: "Reflective Disco Ball",
      closedPos: { x: 4, y: 38, rotate: 0, scale: 0.68, opacity: 0.85 },
      openPos: { x: 0, y: -168, rotate: 12, scale: 1, opacity: 1 },
      className: "w-16 md:w-20",
    },
    {
      id: "chess",
      src: CANVA_ASSETS.page1.envelopeStickers.chessboardCutout,
      alt: "Beach Chessboard",
      closedPos: { x: 35, y: 22, rotate: -155, scale: 0.68, opacity: 0.85 },
      openPos: { x: 92, y: -142, rotate: -140, scale: 1, opacity: 1 },
      className: "w-16 md:w-20",
    },
    {
      id: "vinyl",
      src: CANVA_ASSETS.page1.envelopeStickers.vinylRecord,
      alt: "Vinyl Record",
      closedPos: { x: 64, y: 20, rotate: 4, scale: 0.68, opacity: 0.85 },
      openPos: { x: 138, y: -92, rotate: 22, scale: 1.05, opacity: 1 },
      className: "w-14 md:w-18",
    },
  ];

  return (
    <section
      id="cover"
      className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-between py-8 md:py-12 px-4 select-none"
    >
      {/* Full-bleed Ocean Sunlight Bokeh Background from Canva Page 1 */}
      <div className="absolute inset-0 z-0">
        <img
          src={CANVA_ASSETS.page1.oceanBokehBg}
          alt="Sunlit Zambales Ocean Background"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/10 via-transparent to-amber-950/20 pointer-events-none" />
      </div>

      {/* Top Logo: Kevin and Nica Orange Script */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex flex-col items-center pt-2 md:pt-4"
      >
        <img
          src={CANVA_ASSETS.page1.kevinAndNicaOrangeLogo}
          alt="Kevin and Nica"
          className="w-32 sm:w-36 md:w-44 h-auto sticker-shadow"
        />
        <p className="mt-1 font-courier-prime text-xs sm:text-sm tracking-[0.2em] uppercase text-[#194a69] font-bold bg-white/65 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/60 shadow-xs">
          01 . 09 . 2027 - Botolan, Zambales
        </p>
      </motion.div>

      {/* Centerpiece: Interactive Orange Envelope + Sliding Postcard + Hidden Stickers */}
      <div className="relative z-20 flex flex-col items-center my-4 md:my-6 w-full max-w-md">
        {/* Interactive Status Pill */}
        <motion.button
          type="button"
          onClick={() => setIsEnvelopeOpen((prev) => !prev)}
          whileTap={{ scale: 0.97 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fffaf2]/90 hover:bg-[#fffaf2] text-[#c74f16] border border-[#e06324]/30 px-4 py-1.5 text-xs sm:text-sm font-aileron font-bold shadow-md transition-colors cursor-pointer"
        >
          <EnvelopeOpenIcon weight="duotone" className="w-4 h-4" />
          <span>
            {isEnvelopeOpen
              ? "Tap postcard to read full invite or close envelope"
              : "Tap the envelope to pull out your postcard"}
          </span>
        </motion.button>

        {/* Envelope Stack Container */}
        <div
          onClick={() => setIsEnvelopeOpen((prev) => !prev)}
          role="button"
          tabIndex={0}
          aria-label="Interactive Wedding Invitation Envelope"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsEnvelopeOpen((prev) => !prev);
            }
          }}
          className="relative w-[290px] sm:w-[340px] md:w-[380px] aspect-[225/188] flex items-center justify-center cursor-pointer group"
        >
          {/* Layer 1: Open Orange Envelope Back (MAHWl6qjG_k.png) */}
          <img
            src={CANVA_ASSETS.page1.envelopeBackOpen}
            alt="Open Orange Textured Envelope"
            className="absolute inset-0 w-full h-full object-contain z-10 sticker-shadow-lg transition-transform duration-500 group-hover:scale-[1.01]"
          />

          {/* Layer 2: The 5 Hidden Stickers tucked inside the envelope in Canva Page 1 */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            {stickers.map((s) => (
              <motion.img
                key={s.id}
                src={s.src}
                alt={s.alt}
                initial={false}
                animate={
                  reduceMotion
                    ? isEnvelopeOpen
                      ? { ...s.openPos, transition: { duration: 0 } }
                      : { ...s.closedPos, transition: { duration: 0 } }
                    : isEnvelopeOpen
                      ? s.openPos
                      : s.closedPos
                }
                transition={{
                  type: "spring",
                  stiffness: 160,
                  damping: 18,
                }}
                className={`absolute object-contain sticker-shadow ${s.className}`}
              />
            ))}
          </div>

          {/* Layer 3: "You're Invited" Postcard (MAHXQjHpdt0.png) sandwiched inside pocket */}
          <motion.div
            initial={false}
            animate={
              reduceMotion
                ? {
                    y: isEnvelopeOpen ? -72 : 34,
                    rotate: isEnvelopeOpen ? -2 : 0,
                    scale: isEnvelopeOpen ? 1.04 : 0.94,
                  }
                : {
                    y: isEnvelopeOpen ? -78 : 34,
                    rotate: isEnvelopeOpen ? -2.5 : 0,
                    scale: isEnvelopeOpen ? 1.05 : 0.94,
                  }
            }
            transition={{
              type: "spring",
              stiffness: 140,
              damping: 18,
            }}
            className="relative z-20 w-[92%] aspect-[1546/1017] rounded-sm overflow-hidden shadow-xl group/card"
            onClick={(e) => {
              if (isEnvelopeOpen) {
                e.stopPropagation();
                setActiveLightboxImage({
                  src: CANVA_ASSETS.page1.youreInvitedPostcard,
                  title: "You're Invited - Kevin & Nica",
                  subtitle:
                    "Botolan, Zambales, Philippines - Please reply online by November 15, 2026",
                });
              }
            }}
          >
            <img
              src={CANVA_ASSETS.page1.youreInvitedPostcard}
              alt="You're Invited Postcard from Kevin and Nica"
              className="w-full h-full object-cover"
            />
            {isEnvelopeOpen && (
              <div className="absolute bottom-2 right-2 bg-[#0c3c78]/85 text-white text-[11px] font-aileron font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md backdrop-blur-xs">
                <ArrowsOutSimpleIcon weight="bold" className="w-3.5 h-3.5" />
                <span>Inspect Postcard</span>
              </div>
            )}
          </motion.div>

          {/* Layer 4: Orange Envelope Front Pocket (MAHWrLLwbCY.png) */}
          <img
            src={CANVA_ASSETS.page1.envelopeFrontPocket}
            alt="Orange Envelope Pocket Front"
            className="absolute bottom-0 left-0 w-full h-[83.5%] object-contain object-bottom z-30 pointer-events-none"
          />
        </div>

        {/* ENTER -> Button from Canva Page 1 (MAHXQnPpBeg.png) */}
        <motion.button
          type="button"
          onClick={onEnterClick}
          whileHover={reduceMotion ? {} : { scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Enter Kevin and Nica's Wedding Invitation"
          className="relative z-40 -mt-5 sm:-mt-6 w-52 sm:w-60 md:w-64 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400 rounded-full cursor-pointer sticker-shadow-lg"
        >
          <img
            src={CANVA_ASSETS.page1.enterButton}
            alt="ENTER"
            className="w-full h-auto object-contain"
          />
        </motion.button>

        {/* Secondary Quick-Action Bar under Enter Button */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5 z-30">
          <button
            type="button"
            onClick={() => setIsEnvelopeOpen((prev) => !prev)}
            className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-[#9f3e10] font-aileron font-bold text-xs shadow-sm border border-white/60 transition-all cursor-pointer active:scale-95"
          >
            {isEnvelopeOpen ? "Tuck Postcard Back" : "Peek Inside Envelope"}
          </button>
          <a
            href={EXTERNAL_LINKS.rsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full bg-[#e6681b] hover:bg-[#cf5912] text-white font-aileron font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95 inline-flex items-center gap-1.5"
          >
            <SparkleIcon weight="fill" className="w-3.5 h-3.5" />
            <span>Quick RSVP</span>
            <ArrowSquareOutIcon weight="bold" className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Bottom Vintage Postcard: "meet us in zambales" (MAHWlw9W9sY.png) */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full max-w-[330px] sm:max-w-[380px] md:max-w-[430px] mt-2"
      >
        <button
          type="button"
          onClick={() =>
            setActiveLightboxImage({
              src: CANVA_ASSETS.page1.meetUsInZambalesPostcard,
              title: "Meet Us in Zambales",
              subtitle: "Villa Elisa Botolan - Beachfront Resort & Villas",
            })
          }
          className="group relative w-full rounded-lg overflow-hidden paper-card-shadow transition-transform duration-300 hover:scale-[1.02] hover:-rotate-1 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
        >
          <img
            src={CANVA_ASSETS.page1.meetUsInZambalesPostcard}
            alt="Meet us in Zambales Vintage Postcard"
            className="w-full h-auto object-contain"
          />
          <span className="sr-only">Expand Meet Us in Zambales Postcard</span>
        </button>
      </motion.div>

      {/* Postcard Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxImage(null)}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={reduceMotion ? false : { scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-[#fdfaf3] rounded-2xl p-3 sm:p-5 shadow-2xl border border-amber-900/15"
            >
              <div className="flex items-center justify-between pb-3 px-1">
                <div>
                  <h3 className="font-aileron font-bold text-base sm:text-lg text-[#2b241d]">
                    {activeLightboxImage.title}
                  </h3>
                  <a
                    href={EXTERNAL_LINKS.villaElisaWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-courier-prime text-xs sm:text-sm text-[#194a69] hover:text-[#c74f16] underline inline-flex items-center gap-1"
                  >
                    <span>{activeLightboxImage.subtitle}</span>
                    <ArrowSquareOutIcon weight="bold" className="w-3.5 h-3.5" />
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLightboxImage(null)}
                  aria-label="Close postcard view"
                  className="p-2 rounded-full bg-amber-950/10 hover:bg-amber-950/20 text-[#2b241d] transition-colors cursor-pointer"
                >
                  <XIcon weight="bold" className="w-5 h-5" />
                </button>
              </div>
              <div className="rounded-xl overflow-hidden bg-amber-50/50">
                <img
                  src={activeLightboxImage.src}
                  alt={activeLightboxImage.title}
                  className="w-full h-auto object-contain max-h-[75dvh]"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
                <span className="font-courier-prime text-xs text-[#6b5d4d]">
                  Reply online by November 15, 2026
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={EXTERNAL_LINKS.rsvpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-[#e6681b] hover:bg-[#cf5912] text-white font-aileron font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>RSVP Now</span>
                    <ArrowSquareOutIcon weight="bold" className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveLightboxImage(null);
                      onEnterClick();
                    }}
                    className="px-4 py-2 rounded-full bg-[#194a69] hover:bg-[#123850] text-white font-aileron font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <CalendarPlusIcon weight="bold" className="w-4 h-4" />
                    <span>See Calendar & Details</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
