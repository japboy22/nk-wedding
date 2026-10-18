"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SwatchesIcon, MapPinLineIcon } from "@phosphor-icons/react";
import { CANVA_ASSETS } from "@/lib/assets";

type GamePlanTheme = "dove" | "beach" | "pink";

interface GamePlanSectionProps {
  onBack: () => void;
  onNextToTravel: () => void;
}

export function GamePlanSection({
  onBack,
  onNextToTravel,
}: GamePlanSectionProps) {
  const reduceMotion = useReducedMotion();
  const [theme, setTheme] = useState<GamePlanTheme>("dove");
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const timelineDetails = [
    {
      time: "4:00 PM",
      title: "Catch Us by the Altar",
      note: "Sunset beachfront vows at Villa Elisa Botolan. Please be seated by 3:45 PM.",
    },
    {
      time: "5:00 PM",
      title: "Meet our favorite people over cocktails",
      note: "Signature berry cocktails, green lime martinis, acoustic sets, and golden-hour photos by the sea.",
    },
    {
      time: "6:00 PM",
      title: 'Dinner and the story behind "I DO"',
      note: "Coastal feast under the stars, heartfelt toasts, and stories from our favorite people.",
    },
    {
      time: "8:00 PM",
      title:
        theme === "beach"
          ? "Dancing is Highly Encouraged"
          : "DAncing is Highly eNcourageD",
      note: "Hit the dance floor under the disco ball! Come for the love, stay for the party.",
    },
  ];

  return (
    <section
      id="game-plan"
      className="relative min-h-[100dvh] w-full overflow-hidden py-8 md:py-14 px-3 sm:px-6 flex flex-col items-center justify-between"
    >
      {/* Dynamic Canva Backdrop Layers (Pages 3, 4 & 5) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {theme === "beach" ? (
          <>
            <img
              src={CANVA_ASSETS.gamePlan.beachResortBg}
              alt="Villa Elisa Beach Resort Backdrop"
              className="w-full h-full object-cover object-center"
            />
            <img
              src={CANVA_ASSETS.gamePlan.foldedBluePaperBg}
              alt="Folded Paper Texture Overlay"
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay pointer-events-none"
            />
          </>
        ) : (
          <img
            src={CANVA_ASSETS.gamePlan.foldedBluePaperBg}
            alt="Blue Folded Paper Scrapbook Background"
            className="w-full h-full object-cover object-center"
          />
        )}

        {/* Top Ripped Paper Header Overlay (Peach on Page 5, Vibrant Pink on Page 3) */}
        {theme === "dove" && (
          <>
            <img
              src={CANVA_ASSETS.gamePlan.peachRippedPaper}
              alt="Peach Ripped Paper Top"
              className="absolute -top-16 sm:-top-20 -left-12 w-[125%] max-w-none h-48 sm:h-60 object-cover rotate-3 pointer-events-none drop-shadow-md"
            />
            <img
              src={CANVA_ASSETS.gamePlan.peachRippedPaper}
              alt="Peach Ripped Paper Bottom"
              className="absolute -bottom-20 -right-16 w-[95%] max-w-none h-48 sm:h-60 object-cover rotate-[160deg] pointer-events-none drop-shadow-md"
            />
          </>
        )}

        {theme === "pink" && (
          <>
            <div className="absolute -top-14 -left-10 w-[120%] h-44 sm:h-52 rotate-2 overflow-hidden shadow-lg pointer-events-none">
              <img
                src={CANVA_ASSETS.gamePlan.vibrantPinkSurface}
                alt="Vibrant Pink Ripped Paper"
                className="w-full h-full object-cover"
              />
            </div>
            <img
              src={CANVA_ASSETS.gamePlan.pinkRippedPaperCutout}
              alt="Pink Ripped Paper Corner"
              className="absolute -bottom-20 -right-16 w-[95%] max-w-none h-48 sm:h-60 object-cover rotate-[160deg] pointer-events-none drop-shadow-md"
            />
          </>
        )}
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 w-full max-w-[440px] md:max-w-3xl mx-auto flex flex-col items-center">
        {/* Canva Backdrop Switcher Pill (Lets user experience Pages 3, 4 & 5 from Canva) */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
          <div className="inline-flex items-center gap-1 bg-slate-950/35 backdrop-blur-md p-1 rounded-full border border-white/25 text-white text-[11px] font-aileron font-bold">
            <SwatchesIcon weight="duotone" className="w-3.5 h-3.5 ml-1.5" />
            <button
              type="button"
              onClick={() => setTheme("dove")}
              className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                theme === "dove"
                  ? "bg-white text-[#194a69] shadow-xs"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Dove Collage
            </button>
            <button
              type="button"
              onClick={() => setTheme("beach")}
              className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                theme === "beach"
                  ? "bg-white text-[#194a69] shadow-xs"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Beach Resort
            </button>
            <button
              type="button"
              onClick={() => setTheme("pink")}
              className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                theme === "pink"
                  ? "bg-white text-[#194a69] shadow-xs"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Pink Scrapbook
            </button>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/80 hover:bg-white text-[#494134] px-3 py-1 text-xs font-aileron font-bold shadow-xs cursor-pointer"
          >
            <span>Calendar</span>
          </button>
        </div>

        {/* Section Title: "The Game Plan" (League Spartan Bold) */}
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: -14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-spartan font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.22)] mt-1 mb-6 sm:mb-8"
        >
          The Game Plan
        </motion.h2>

        {/* Scrapbook Timeline Stack (4:00 PM, 5:00 PM, 6:00 PM, 8:00 PM) */}
        <div className="relative w-full flex flex-col items-center space-y-6 sm:space-y-8">
          {/* 1. 4:00 PM - Catch Us by the Altar */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            onClick={() => setActiveStep(activeStep === 0 ? null : 0)}
            className="relative w-[270px] sm:w-[320px] md:w-[360px] flex items-center justify-center cursor-pointer group"
          >
            {/* Layered Paper Decal With Torn Edges & Tape (MAHKxPJvdEc.png) */}
            <img
              src={CANVA_ASSETS.gamePlan.paperDecal4pm}
              alt="4:00 PM Torn Paper Card"
              className="w-full h-auto object-contain sticker-shadow transition-transform duration-300 group-hover:scale-[1.02]"
            />

            {/* Two Overlapping Gold Wedding Rings (MAHXxHEIhhk.png) */}
            <motion.img
              whileHover={reduceMotion ? {} : { rotate: -8, scale: 1.08 }}
              src={CANVA_ASSETS.gamePlan.weddingRingsCutout}
              alt="Two Overlapping Gold Wedding Rings"
              className="absolute -left-10 sm:-left-12 bottom-3 sm:bottom-4 w-28 sm:w-34 h-auto object-contain z-20 sticker-shadow"
            />

            {/* White Dove Sticker (MAHX30HSMgg.png - Featured on Page 5) */}
            {theme === "dove" && (
              <motion.img
                animate={
                  reduceMotion
                    ? {}
                    : { y: [0, -5, 0], rotate: [0, 2, 0] }
                }
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                src={CANVA_ASSETS.gamePlan.whiteDoveCutout}
                alt="White Dove"
                className="absolute -right-14 sm:-right-20 -top-6 sm:-top-8 w-36 sm:w-44 h-auto object-contain z-20 sticker-shadow pointer-events-none"
              />
            )}

            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-5 px-8 text-center z-10">
              <span className="font-courier-prime font-bold text-xl sm:text-2xl text-[#494134] tracking-tight">
                4:00 PM
              </span>
              <p className="mt-1 font-courier-prime font-bold text-xs sm:text-sm text-[#494134] leading-tight max-w-[16ch]">
                Catch Us by the Altar
              </p>
            </div>
          </motion.div>

          {/* 2. 5:00 PM - Meet our favorite people over cocktails */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            onClick={() => setActiveStep(activeStep === 1 ? null : 1)}
            className="relative w-[290px] sm:w-[350px] md:w-[390px] flex items-center justify-center cursor-pointer group"
          >
            {/* Aged Newspaper/Kraft Clipping Cutout (MAHNW74o-iE.png) */}
            <img
              src={CANVA_ASSETS.gamePlan.paperDecal5pm}
              alt="5:00 PM Kraft Paper Card"
              className="w-full h-auto object-contain sticker-shadow transition-transform duration-300 group-hover:scale-[1.02]"
            />

            {/* Blackberry Cocktail Left (MAHXyVtODH4.png) */}
            <motion.img
              whileHover={reduceMotion ? {} : { rotate: -16, scale: 1.08 }}
              src={CANVA_ASSETS.gamePlan.blackberryCocktailCutout}
              alt="Blackberry Cocktail"
              className="absolute -left-14 sm:-left-18 -top-3 sm:-top-4 w-28 sm:w-34 h-auto object-contain -rotate-11 z-20 sticker-shadow"
            />

            {/* Green Martini Cocktail Right (MAEt-Vb7v0w.png) */}
            <motion.img
              whileHover={reduceMotion ? {} : { rotate: 8, scale: 1.08 }}
              src={CANVA_ASSETS.gamePlan.greenMartiniCocktail}
              alt="Green Cocktail with Lime Garnish"
              className="absolute -right-8 sm:-right-10 -bottom-3 sm:-bottom-4 w-18 sm:w-22 h-auto object-contain z-20 sticker-shadow"
            />

            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center z-10">
              <span className="font-courier-prime font-bold text-xl sm:text-2xl text-[#494134] tracking-tight">
                5:00 PM
              </span>
              <p className="mt-1 font-courier-prime font-bold text-xs sm:text-sm text-[#494134] leading-tight max-w-[18ch]">
                Meet our favorite people over cocktails
              </p>
            </div>
          </motion.div>

          {/* 3. 6:00 PM - Dinner and the story behind "I DO" */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            onClick={() => setActiveStep(activeStep === 2 ? null : 2)}
            className="relative w-[260px] sm:w-[310px] md:w-[350px] flex items-center justify-center cursor-pointer group ml-6 sm:ml-10"
          >
            {/* Scattered Purple Flower Petals Left (MAEnFCFYcMw.png) */}
            <img
              src={CANVA_ASSETS.gamePlan.purplePetalsCutout}
              alt="Scattered Flower Petals"
              className="absolute -left-32 sm:-left-40 bottom-0 w-36 sm:w-44 h-auto object-contain z-10 pointer-events-none"
            />

            {/* Vintage Blue & Gold Plate Behind Left (MAHX3-jjjCw.png) */}
            <img
              src={CANVA_ASSETS.gamePlan.vintagePlateCutout}
              alt="Vintage Plate"
              className="absolute -left-16 sm:-left-20 top-0 w-32 sm:w-38 h-auto object-contain z-10 sticker-shadow"
            />

            {/* Layered Scrapbook Paper Decal (MAHKxDu_A1c.png) */}
            <img
              src={CANVA_ASSETS.gamePlan.paperDecal6pm}
              alt="6:00 PM Torn Paper Card"
              className="relative z-20 w-full h-auto object-contain sticker-shadow transition-transform duration-300 group-hover:scale-[1.02]"
            />

            {/* Elegant Table Utensils in Linen Pocket Right (MAHX36znDqI.png) */}
            <motion.img
              whileHover={reduceMotion ? {} : { rotate: 16, scale: 1.06 }}
              src={CANVA_ASSETS.gamePlan.tableUtensilsCutout}
              alt="Table Utensils in Napkin"
              className="absolute -right-12 sm:-right-14 top-4 w-28 sm:w-34 h-auto object-contain rotate-[18deg] z-30 sticker-shadow"
            />

            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-5 px-8 text-center z-20">
              <span className="font-courier-prime font-bold text-xl sm:text-2xl text-[#494134] tracking-tight">
                6:00 PM
              </span>
              <p className="mt-1 font-courier-prime font-bold text-xs sm:text-sm text-[#494134] leading-tight max-w-[18ch]">
                Dinner and the story behind &ldquo;I DO&rdquo;
              </p>
            </div>
          </motion.div>

          {/* 4. 8:00 PM - Dancing is Highly Encouraged */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => setActiveStep(activeStep === 3 ? null : 3)}
            className="relative w-[290px] sm:w-[340px] md:w-[380px] flex items-center justify-center cursor-pointer group mr-6 sm:mr-10"
          >
            {/* Shiny Reflective Disco Ball Right (MAHX34qwvkc.png) */}
            <motion.img
              animate={reduceMotion ? {} : { rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              src={CANVA_ASSETS.gamePlan.discoBallCutout}
              alt="Disco Ball"
              className="absolute -right-16 sm:-right-22 -top-2 w-36 sm:w-44 h-auto object-contain z-10 sticker-shadow"
            />

            {/* Torn Pink-Edged Paper Frame (MAHWBB_vkbg.png) */}
            <img
              src={CANVA_ASSETS.gamePlan.paperDecal8pm}
              alt="8:00 PM Torn Paper Frame"
              className="relative z-20 w-full h-auto object-contain sticker-shadow transition-transform duration-300 group-hover:scale-[1.02]"
            />

            {/* Vintage Dancing Couple (Page 5) or Blue Dress Guest (Page 4) */}
            {theme === "dove" && (
              <img
                src={CANVA_ASSETS.gamePlan.dancingCoupleCutout}
                alt="Vintage Dancing Couple"
                className="absolute -left-14 sm:-left-18 -top-6 sm:-top-8 w-36 sm:w-44 h-auto object-contain z-30 sticker-shadow pointer-events-none"
              />
            )}
            {theme === "beach" && (
              <img
                src={CANVA_ASSETS.gamePlan.blueDressGuestCutout}
                alt="Resort Chic Guest"
                className="absolute -left-8 sm:-left-12 -top-4 sm:-top-6 w-28 sm:w-34 h-auto object-contain z-30 sticker-shadow pointer-events-none"
              />
            )}

            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center z-20">
              <span className="font-courier-prime font-bold text-xl sm:text-2xl text-[#494134] tracking-tight">
                8:00 PM
              </span>
              <p className="mt-1 font-courier-prime font-bold text-xs sm:text-sm text-[#494134] leading-snug max-w-[14ch]">
                {timelineDetails[3].title}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Interactive Milestone Detail Pill when a guest taps a timeline card */}
        <div className="mt-5 min-h-[42px] flex items-center justify-center px-2">
          {activeStep !== null ? (
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-md text-[#2b241d] px-4 py-2 rounded-2xl shadow-md border border-white/60 text-center max-w-md"
            >
              <span className="font-courier-prime font-bold text-xs text-[#c74f16] mr-2">
                {timelineDetails[activeStep].time}
              </span>
              <span className="font-aileron text-xs sm:text-sm">
                {timelineDetails[activeStep].note}
              </span>
            </motion.div>
          ) : (
            <span className="font-aileron text-xs text-white/90 bg-slate-950/25 backdrop-blur-xs px-3.5 py-1 rounded-full">
              Tap any time card above for schedule details
            </span>
          )}
        </div>

        {/* Bottom Yellow Strip ("Come for the love, Stay for the party") + Back Arrow */}
        <div className="mt-6 sm:mt-8 w-full flex items-center justify-between gap-3 px-2">
          <div className="flex-1 bg-[#ecc31b] text-[#1a1815] px-4 py-2.5 shadow-md border border-amber-900/15 text-center">
            <p className="font-courier-prime font-bold text-xs sm:text-sm md:text-base tracking-tight">
              Come for the love, Stay for the party
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Save the Date"
            className="flex flex-col items-center shrink-0 group cursor-pointer focus:outline-none"
          >
            <img
              src={CANVA_ASSETS.page2.backArrowSvg}
              alt="Back"
              className="w-10 sm:w-11 h-auto sticker-shadow transition-transform group-hover:-translate-x-1"
            />
            <span className="font-aileron text-xs sm:text-sm font-bold text-[#494134] bg-white/75 px-2 rounded-full -mt-0.5">
              Back
            </span>
          </button>
        </div>

        {/* Continue to Travel & Stay Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onNextToTravel}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#194a69] hover:bg-[#123850] text-white font-aileron font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <MapPinLineIcon weight="bold" className="w-4 h-4" />
            <span>How to Get to Villa Elisa & Where to Stay</span>
          </button>
        </div>
      </div>
    </section>
  );
}
