"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  XIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import { CANVA_ASSETS, EXTERNAL_LINKS } from "@/lib/assets";

interface EnvelopeStickerConfig {
  id: string;
  src: string;
  alt: string;
  /** Exact position & size relative to the 2081x2400 envelope container to match image1 */
  className: string;
  /** Final resting rotation in degrees (matching image1) */
  baseRotate: number;
  /** Tucked starting offset inside the envelope pocket before opening */
  closedX: string;
  closedY: string;
  closedRotate: number;
  closedScale: number;
  /** Subtle idle floating loop after emerging from the pocket */
  floatRotateDelta: number;
  floatY: number;
  duration: number;
  delay: number;
}

const ENVELOPE_STICKERS: EnvelopeStickerConfig[] = [
  {
    id: "peony",
    src: CANVA_ASSETS.page1.envelopeStickers.pinkPeonyCutout,
    alt: "Pink Peony Flower",
    className: "left-[-1.5%] top-[16.5%] w-[31%] z-20",
    baseRotate: -12,
    closedX: "22%",
    closedY: "68%",
    closedRotate: -28,
    closedScale: 0.58,
    floatRotateDelta: 2.5,
    floatY: -3.5,
    duration: 3.8,
    delay: 0.34,
  },
  {
    id: "cocktail",
    src: CANVA_ASSETS.page1.envelopeStickers.berryCocktailCutout,
    alt: "Signature Berry Cocktail",
    className: "left-[10.5%] top-[30%] w-[35.5%] z-30",
    baseRotate: -4,
    closedX: "14%",
    closedY: "74%",
    closedRotate: -16,
    closedScale: 0.6,
    floatRotateDelta: 2,
    floatY: -4,
    duration: 4.2,
    delay: 0.42,
  },
  {
    id: "disco",
    src: CANVA_ASSETS.page1.envelopeStickers.discoBall,
    alt: "Reflective Disco Ball",
    className: "left-[36.5%] top-[51.5%] w-[26%] z-30",
    baseRotate: 0,
    closedX: "0%",
    closedY: "72%",
    closedRotate: -20,
    closedScale: 0.62,
    floatRotateDelta: 3,
    floatY: -3,
    duration: 4.5,
    delay: 0.52,
  },
  {
    id: "chess",
    src: CANVA_ASSETS.page1.envelopeStickers.chessboardCutout,
    alt: "Beach Checkered Paddle & Pickleball",
    className: "left-[58%] top-[33.5%] w-[22.5%] z-20",
    baseRotate: -155,
    closedX: "-16%",
    closedY: "72%",
    closedRotate: -172,
    closedScale: 0.58,
    floatRotateDelta: 2.5,
    floatY: -4,
    duration: 3.9,
    delay: 0.46,
  },
  {
    id: "vinyl",
    src: CANVA_ASSETS.page1.envelopeStickers.vinylRecord,
    alt: "Vinyl Record",
    className: "left-[76.5%] top-[21.5%] w-[23.5%] z-30",
    baseRotate: 8,
    closedX: "-24%",
    closedY: "110%",
    closedRotate: -18,
    closedScale: 0.56,
    floatRotateDelta: 3.5,
    floatY: -3.5,
    duration: 4.1,
    delay: 0.38,
  },
];

export interface EnvelopeHeroProps {
  onOpenRsvp?: () => void;
}

export function EnvelopeHero({ onOpenRsvp }: EnvelopeHeroProps = {}) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState<{
    src: string;
    title: string;
    subtitle: string;
  } | null>(null);

  // Automatically trigger the envelope opening + asset pop-out animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEnvelopeOpen(true);
    }, 180);
    return () => clearTimeout(timer);
  }, []);

  // Clicking the envelope replays the tuck-and-open animation so it always settles on the open state
  const handleReplayEnvelope = useCallback(() => {
    if (isReplaying) return;
    setIsReplaying(true);
    setIsEnvelopeOpen(false);
    setTimeout(() => {
      setIsEnvelopeOpen(true);
      setIsReplaying(false);
    }, 480);
  }, [isReplaying]);

  return (
    <section
      id="cover"
      className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-between pt-8 pb-24 md:pt-12 md:pb-28 px-4 select-none"
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
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex flex-col items-center pt-1 md:pt-2"
      >
        <img
          src={CANVA_ASSETS.page1.kevinAndNicaOrangeLogo}
          alt="Kevin and Nica"
          className="w-32 sm:w-36 md:w-44 h-auto sticker-shadow"
        />
      </motion.div>

      {/* Centerpiece: Orange Envelope + Animated Rising Postcard + 5 Pop-Out Stickers (Matching image1) */}
      <div className="relative z-20 flex flex-col items-center mt-8 sm:mt-10 mb-4 w-full max-w-md">
        <motion.div
          onClick={handleReplayEnvelope}
          role="button"
          tabIndex={0}
          aria-label="Interactive Wedding Invitation Envelope - Tap to replay opening animation"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleReplayEnvelope();
            }
          }}
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{
            scale: isEnvelopeOpen ? 1 : 0.96,
            opacity: 1,
            y: isEnvelopeOpen ? 0 : 8,
          }}
          transition={{
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative w-[280px] sm:w-[330px] md:w-[370px] aspect-[2081/2400] flex items-center justify-center cursor-pointer group"
        >
          {/* Layer 1 (z-10): Open Orange Envelope Back (MAHWl6qjG_k.png - 2081x2400) */}
          <motion.img
            src={CANVA_ASSETS.page1.envelopeBackOpen}
            alt="Open Orange Textured Envelope"
            initial={{ scaleY: 0.94 }}
            animate={{ scaleY: isEnvelopeOpen ? 1 : 0.95 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "bottom center" }}
            className="absolute inset-0 w-full h-full object-contain z-10 sticker-shadow-lg transition-transform duration-500 group-hover:scale-[1.01]"
          />

          {/* Layer 2 (z-20): "You're Invited" Postcard (MAHXQjHpdt0.png) rising out of the envelope pocket */}
          <motion.div
            initial={{ y: "44%", scale: 0.92, rotate: -1.5 }}
            animate={
              isEnvelopeOpen
                ? { y: "0%", scale: 1, rotate: 0 }
                : { y: "44%", scale: 0.92, rotate: -1.5 }
            }
            transition={{
              type: "spring",
              stiffness: 115,
              damping: 16,
              mass: 0.9,
              delay: isEnvelopeOpen ? 0.12 : 0,
            }}
            className="absolute -top-[8.35%] left-[0.75%] w-[98.5%] aspect-[1512/966] z-20"
          >
            <motion.div
              animate={
                isEnvelopeOpen
                  ? { y: [0, -3.5, 0] }
                  : { y: 0 }
              }
              transition={{
                duration: 4.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.0,
              }}
              className="w-full h-full rounded-[2px] overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-[1.01]"
            >
              <img
                src={CANVA_ASSETS.page1.youreInvitedPostcard}
                alt="You're Invited Postcard from Kevin and Nica"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Layer 3 (z-30): The 5 Stickers emerging from inside the envelope pocket in front of the postcard */}
          <div className="absolute inset-0 z-30 pointer-events-none">
            {ENVELOPE_STICKERS.map((s) => (
              <motion.div
                key={s.id}
                initial={{
                  x: s.closedX,
                  y: s.closedY,
                  rotate: s.closedRotate,
                  scale: s.closedScale,
                  opacity: 0,
                }}
                animate={
                  isEnvelopeOpen
                    ? {
                        x: "0%",
                        y: "0%",
                        rotate: s.baseRotate,
                        scale: 1,
                        opacity: 1,
                      }
                    : {
                        x: s.closedX,
                        y: s.closedY,
                        rotate: s.closedRotate,
                        scale: s.closedScale,
                        opacity: 0,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                  mass: 0.85,
                  delay: isEnvelopeOpen ? s.delay : 0,
                  opacity: {
                    duration: 0.25,
                    delay: isEnvelopeOpen ? s.delay : 0,
                  },
                }}
                className={`absolute ${s.className}`}
              >
                <motion.img
                  src={s.src}
                  alt={s.alt}
                  animate={
                    isEnvelopeOpen
                      ? {
                          y: [0, s.floatY, 0],
                          rotate: [0, s.floatRotateDelta, 0],
                        }
                      : { y: 0, rotate: 0 }
                  }
                  transition={{
                    duration: s.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: s.delay + 0.6,
                  }}
                  className="w-full h-auto object-contain sticker-shadow"
                />
              </motion.div>
            ))}
          </div>

          {/* Layer 4 (z-40): Orange Envelope Front Pocket (MAHWrLLwbCY.png - 2400x1718 = 62.07% of 2081x2400 height) */}
          <img
            src={CANVA_ASSETS.page1.envelopeFrontPocket}
            alt="Orange Envelope Pocket Front"
            className="absolute bottom-0 left-0 w-full h-[62.07%] object-contain object-bottom z-40 pointer-events-none"
          />
        </motion.div>
      </div>

      {/* Bottom Vintage Postcard: "meet us in zambales" (MAHWlw9W9sY.png) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
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
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-[#fdfaf3] rounded-2xl p-3 sm:p-5 shadow-2xl border border-amber-900/15"
            >
              <div className="flex items-center justify-between pb-3 px-1">
                <div>
                  <h3 className="font-aileron font-bold text-base sm:text-lg text-[#2b241d] text-balance">
                    {activeLightboxImage.title}
                  </h3>
                  <a
                    href={EXTERNAL_LINKS.villaElisaWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-courier-prime text-xs sm:text-sm text-[#194a69] hover:text-[#c74f16] underline inline-flex items-center gap-1 text-pretty"
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
                <span className="font-courier-prime text-xs text-[#6b5d4d] text-pretty">
                  Reply online by November 15, 2026
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveLightboxImage(null);
                    onOpenRsvp?.();
                  }}
                  className="px-4 py-2 rounded-full bg-[#e6681b] hover:bg-[#cf5912] text-white font-aileron font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>RSVP Now</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
