"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  CalendarPlusIcon,
  CameraIcon,
  QrCodeIcon,
  SparkleIcon,
  XIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DownloadSimpleIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import { CANVA_ASSETS, EXTERNAL_LINKS } from "@/lib/assets";

interface SaveTheDateSectionProps {
  onBackToCover: () => void;
  onOpenRsvp: () => void;
  onGoToGamePlan: () => void;
}

interface CalendarMemoryPhoto {
  id: string;
  src: string;
  title: string;
  dateLabel: string;
  caption: string;
}

const CALENDAR_PHOTOS: CalendarMemoryPhoto[] = [
  {
    id: "villa-elisa",
    src: CANVA_ASSETS.page2.villaElisaThumb,
    title: "Villa Elisa Botolan",
    dateLabel: "Our Wedding Venue - Botolan, Zambales",
    caption:
      "Where the mountains meet the West Philippine Sea. Join us beachfront on Saturday, January 9, 2027.",
  },
  {
    id: "kevin-bw",
    src: CANVA_ASSETS.page2.kevinBwPortrait,
    title: "Kevin",
    dateLabel: "The Groom",
    caption: "Counting down the days until we say 'I Do' by the shore.",
  },
  {
    id: "couple-blue-stamp",
    src: CANVA_ASSETS.page2.coupleBlueStamp,
    title: "Kevin & Nica",
    dateLabel: "Postage Stamp Series - No. 01",
    caption: "Every adventure together leads us to Zambales.",
  },
  {
    id: "couple-cats-stamp",
    src: CANVA_ASSETS.page2.coupleWithCatsRedStamp,
    title: "Our Little Family",
    dateLabel: "Postage Stamp Series - No. 02",
    caption: "Kevin, Nica, and our two beloved cats who approved the RSVP.",
  },
  {
    id: "nica-bw",
    src: CANVA_ASSETS.page2.nicaBwPortrait,
    title: "Nica",
    dateLabel: "The Bride",
    caption: "Ready for sunset vows, ocean breeze, and dancing all night.",
  },
];

const SWATCH_COLORS = [
  { name: "Hibiscus Red", hex: "#F02429", note: "Bold tropical linen or silk" },
  { name: "Emerald Lagoon", hex: "#00B68F", note: "Breezy coastal green" },
  { name: "Orchid Lilac", hex: "#CE68EA", note: "Playful resort pastel" },
  { name: "Zambales Sunset", hex: "#FF6B08", note: "Vibrant sunlit tangerine" },
  { name: "Bougainvillea Pink", hex: "#FA4583", note: "Festive island pink" },
  { name: "Pacific Sky", hex: "#00BFFE", note: "Bright ocean cyan" },
];

export function SaveTheDateSection({
  onBackToCover,
  onOpenRsvp,
  onGoToGamePlan,
}: SaveTheDateSectionProps) {
  const reduceMotion = useReducedMotion();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const [showQrModal, setShowQrModal] = useState(false);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const [activeSwatch, setActiveSwatch] = useState<number | null>(null);

  // Live countdown to January 9, 2027 00:00:00 Asia/Manila (matching Canva TickCounter config)
  const [timeLeft, setTimeLeft] = useState({
    months: 2,
    days: 23,
    hours: 8,
    minutes: 30,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2027-01-09T16:00:00+08:00");

    const updateTimer = () => {
      const now = new Date();
      const diffMs = targetDate.getTime() - now.getTime();
      if (diffMs <= 0) {
        setTimeLeft({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Calculate calendar months + remaining days, hours, minutes, seconds
      let months =
        (targetDate.getFullYear() - now.getFullYear()) * 12 +
        (targetDate.getMonth() - now.getMonth());
      const anchor = new Date(now);
      anchor.setMonth(anchor.getMonth() + months);
      if (anchor.getTime() > targetDate.getTime()) {
        months -= 1;
        anchor.setMonth(anchor.getMonth() - 1);
      }

      const remMs = Math.max(0, targetDate.getTime() - anchor.getTime());
      const days = Math.floor(remMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remMs / 1000 / 60) % 60);
      const seconds = Math.floor((remMs / 1000) % 60);

      setTimeLeft({ months, days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Kevin and Nica Wedding//Zambales 2027//EN",
      "BEGIN:VEVENT",
      "DTSTART:20270109T080000Z",
      "DTEND:20270109T150000Z",
      "SUMMARY:Kevin & Nica's Wedding - Villa Elisa Botolan",
      "DESCRIPTION:4:00 PM Ceremony at Villa Elisa Botolan, Zambales! Attire: Resort Chic / Semi Formal.",
      "LOCATION:Villa Elisa Botolan, Botolan, Zambales, Philippines 2202",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "kevin-and-nica-wedding-jan-9-2027.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const googleCalendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Kevin+%26+Nica%27s+Wedding&dates=20270109T080000Z/20270109T150000Z&details=Join+us+as+we+say+I+Do+at+Villa+Elisa+Botolan%2C+Zambales%21+Attire%3A+Resort+Chic+%2F+Semi+Formal.&location=Villa+Elisa+Botolan%2C+Zambales%2C+Philippines+2202";

  return (
    <section
      id="save-the-date"
      className="relative min-h-[100dvh] w-full overflow-hidden py-8 md:py-14 px-3 sm:px-6 flex flex-col items-center justify-between"
    >
      {/* Sandy Beach Texture Background (MAHXWOwj_d0.jpg) */}
      <div className="absolute inset-0 z-0">
        <img
          src={CANVA_ASSETS.page2.sandTextureBg}
          alt="Zambales Beach Sand Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-amber-950/10 pointer-events-none" />
      </div>

      {/* Ocean Wave Washing onto Shore at Bottom (MAHXWSujwi4.png + MAGSH5r4hLs.png) */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none overflow-hidden flex flex-col justify-end">
        <img
          src={CANVA_ASSETS.page2.oceanWaveCutout}
          alt="Ocean Wave"
          className="w-full max-w-none min-w-[115%] -ml-[7.5%] h-56 sm:h-72 md:h-80 object-cover object-top rotate-180 opacity-95"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 w-full max-w-[440px] md:max-w-4xl mx-auto flex flex-col items-center">
        {/* Top Header Bar: White Kevin & Nica Logo + Back Arrow */}
        <div className="w-full flex items-start justify-between mb-3 sm:mb-6 px-1">
          <button
            type="button"
            onClick={onBackToCover}
            className="focus:outline-none cursor-pointer group"
          >
            <img
              src={CANVA_ASSETS.page2.kevinAndNicaWhiteLogo}
              alt="Kevin and Nica"
              className="w-18 sm:w-22 md:w-24 h-auto sticker-shadow transition-transform group-hover:scale-105"
            />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedPhotoIndex(0)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#fffaf0]/90 hover:bg-white text-[#494134] px-3.5 py-1.5 text-xs font-aileron font-bold shadow-sm transition-all cursor-pointer"
            >
              <CameraIcon weight="bold" className="w-4 h-4 text-[#c74f16]" />
              <span>View 5 Calendar Photos</span>
            </button>

            <button
              type="button"
              onClick={onBackToCover}
              aria-label="Back to Cover"
              className="flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              <img
                src={CANVA_ASSETS.page2.backArrowSvg}
                alt="Back"
                className="w-10 sm:w-11 h-auto sticker-shadow transition-transform group-hover:-translate-x-1"
              />
              <span className="font-aileron text-xs sm:text-sm font-medium text-[#494134] bg-white/60 backdrop-blur-xs px-2 rounded-full -mt-0.5">
                Back
              </span>
            </button>
          </div>
        </div>

        {/* Tilted January 2027 Calendar Card (Matching Canva Page 2 -5.8deg tilt) */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24, rotate: -4 }}
          whileInView={{ opacity: 1, y: 0, rotate: -4.5 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[94%] sm:w-[92%] md:w-[540px] rounded-sm p-3.5 sm:p-5 md:p-6 paper-card-shadow z-20"
          style={{
            backgroundImage: `url(${CANVA_ASSETS.page2.kraftPaperCalendarBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Calendar Header: January + VILLA ELISA, BOTOLAN Pill */}
          <div className="flex flex-col items-start mb-3">
            <div className="w-full flex items-center justify-between gap-2">
              <h2 className="font-aileron font-bold text-4xl sm:text-5xl text-[#3c362b] tracking-tight text-outline-white leading-none">
                January
              </h2>
              <span className="font-courier-prime font-bold text-xs sm:text-sm text-[#494134]/80 bg-white/70 px-2.5 py-0.5 rounded-full">
                2027
              </span>
            </div>

            <a
              href={EXTERNAL_LINKS.villaElisaWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Visit Villa Elisa Botolan Official Website"
              className="mt-1.5 inline-flex items-center gap-1.5 bg-[#ebcfa4] hover:bg-[#e3c18d] text-[#3c362b] px-2.5 py-1 rounded-md font-aileron font-bold text-[11px] sm:text-xs tracking-wide shadow-xs transition-colors"
            >
              <img
                src={CANVA_ASSETS.page2.mapPinIcon}
                alt="Pin"
                className="w-2.5 h-3.5 object-contain"
              />
              <span className="underline decoration-[#3c362b]/40 underline-offset-2">
                VILLA ELISA, BOTOLAN
              </span>
              <ArrowSquareOutIcon weight="bold" className="w-3 h-3 opacity-75" />
            </a>
          </div>

          {/* 7-Column January 2027 Calendar Grid */}
          <div className="relative border border-[#3c362b]/65 bg-white/35 backdrop-blur-[1px]">
            {/* Day-of-Week Header Row */}
            <div className="grid grid-cols-7 border-b border-[#3c362b]/65 bg-white/40 text-center font-aileron font-bold text-[10px] sm:text-xs text-[#1d1a15] py-1">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Week 1: Blank Sun-Thu (with Villa Elisa on Tue & Palm Tree on Thu), Fri 1, Sat 2 */}
            <div className="grid grid-cols-7 border-b border-[#3c362b]/50 h-11 sm:h-14 md:h-16 text-[10px] sm:text-xs font-aileron font-bold text-[#1d1a15]">
              <div className="border-r border-[#3c362b]/50 p-1" />
              <div className="border-r border-[#3c362b]/50 p-1" />
              {/* Tue: Villa Elisa Photo Stamp */}
              <div className="relative border-r border-[#3c362b]/50 p-0.5 overflow-visible">
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIndex(0)}
                  title="Click to view Villa Elisa Botolan"
                  className="w-full h-full overflow-hidden rounded-[2px] shadow-xs group cursor-pointer"
                >
                  <img
                    src={CANVA_ASSETS.page2.villaElisaThumb}
                    alt="Villa Elisa Botolan"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </button>
              </div>
              <div className="border-r border-[#3c362b]/50 p-1" />
              {/* Thu: Palm Tree Sticker overlapping Row 1 & Row 2 */}
              <div className="relative border-r border-[#3c362b]/50 p-1 overflow-visible">
                <img
                  src={CANVA_ASSETS.page2.palmTreeSticker}
                  alt="Palm Tree"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 sm:w-15 md:w-16 max-w-none h-auto z-20 pointer-events-none sticker-shadow"
                />
              </div>
              <div className="border-r border-[#3c362b]/50 p-1">1</div>
              <div className="p-1">2</div>
            </div>

            {/* Week 2: Jan 3 to Jan 9 (Kevin B&W on Mon 4, WE SAY I DO on Sat 9!) */}
            <div className="grid grid-cols-7 border-b border-[#3c362b]/50 h-11 sm:h-14 md:h-16 text-[10px] sm:text-xs font-aileron font-bold text-[#1d1a15]">
              <div className="border-r border-[#3c362b]/50 p-1">3</div>
              {/* Mon 4: Kevin B&W Portrait */}
              <div className="relative border-r border-[#3c362b]/50 p-0.5">
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIndex(1)}
                  title="Click to view Kevin's portrait"
                  className="w-full h-full overflow-hidden rounded-[2px] shadow-xs group cursor-pointer"
                >
                  <img
                    src={CANVA_ASSETS.page2.kevinBwPortrait}
                    alt="Kevin"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </button>
              </div>
              <div className="border-r border-[#3c362b]/50 p-1">5</div>
              <div className="border-r border-[#3c362b]/50 p-1">6</div>
              <div className="border-r border-[#3c362b]/50 p-1">7</div>
              <div className="border-r border-[#3c362b]/50 p-1">8</div>
              {/* Sat 9: WE SAY "I DO"! + Halftone Hand Holding Red Heart */}
              <div className="relative bg-[#8ccae7] p-1 flex flex-col items-center justify-center overflow-visible">
                <button
                  type="button"
                  onClick={() => setShowCalendarMenu((prev) => !prev)}
                  title="Click to Save January 9, 2027 to your Calendar!"
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer group focus:outline-none"
                >
                  <span className="self-start text-[9px] sm:text-[10px] leading-none font-bold text-[#183547]">
                    9
                  </span>
                  <img
                    src={CANVA_ASSETS.page2.weSayTextSticker}
                    alt="WE SAY"
                    className="w-[88%] h-auto object-contain mt-0.5 group-hover:scale-105 transition-transform"
                  />
                  <img
                    src={CANVA_ASSETS.page2.iDoTextSticker}
                    alt="I DO!"
                    className="w-[76%] h-auto object-contain mt-0.5 group-hover:scale-105 transition-transform"
                  />
                </button>

                {/* Halftone Vintage Hand Holding Red Heart pointing at Jan 9 */}
                <img
                  src={CANVA_ASSETS.page2.halftoneHeartHand}
                  alt="Hand holding red heart on January 9"
                  className="absolute -right-12 sm:-right-16 md:-right-20 -top-6 sm:-top-8 w-20 sm:w-26 md:w-28 max-w-none h-auto z-30 pointer-events-none sticker-shadow"
                />
              </div>
            </div>

            {/* Week 3: Jan 10 to Jan 16 (Pearl inside seashell on Wed 13) */}
            <div className="grid grid-cols-7 border-b border-[#3c362b]/50 h-11 sm:h-14 md:h-16 text-[10px] sm:text-xs font-aileron font-bold text-[#1d1a15]">
              <div className="border-r border-[#3c362b]/50 p-1">10</div>
              <div className="border-r border-[#3c362b]/50 p-1">11</div>
              <div className="border-r border-[#3c362b]/50 p-1">12</div>
              {/* Wed 13: Pearl Seashell Sticker */}
              <div className="relative border-r border-[#3c362b]/50 p-1 overflow-visible">
                <span>13</span>
                <img
                  src={CANVA_ASSETS.page2.pearlSeashellSticker}
                  alt="Pearl Seashell"
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-9 sm:w-11 md:w-12 max-w-none h-auto z-20 pointer-events-none sticker-shadow"
                />
              </div>
              <div className="border-r border-[#3c362b]/50 p-1">14</div>
              <div className="border-r border-[#3c362b]/50 p-1">15</div>
              <div className="p-1">16</div>
            </div>

            {/* Week 4: Jan 17 to Jan 23 (Couple Blue Stamp on Mon 18, Couple + Cats Red Stamp on Thu 21, Pink Lily on Sat 23) */}
            <div className="grid grid-cols-7 border-b border-[#3c362b]/50 h-11 sm:h-14 md:h-16 text-[10px] sm:text-xs font-aileron font-bold text-[#1d1a15]">
              <div className="border-r border-[#3c362b]/50 p-1">17</div>
              {/* Mon 18: Couple Blue Stamp */}
              <div className="relative border-r border-[#3c362b]/50 p-0.5 overflow-visible">
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIndex(2)}
                  title="Click to enlarge Kevin & Nica stamp"
                  className="w-full h-full overflow-hidden rounded-[2px] shadow-xs group cursor-pointer"
                >
                  <img
                    src={CANVA_ASSETS.page2.coupleBlueStamp}
                    alt="Kevin and Nica Stamp"
                    className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform"
                  />
                </button>
              </div>
              <div className="border-r border-[#3c362b]/50 p-1">19</div>
              <div className="border-r border-[#3c362b]/50 p-1">20</div>
              {/* Thu 21: Couple with Cats Red Stamp */}
              <div className="relative border-r border-[#3c362b]/50 p-0.5 overflow-visible">
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIndex(3)}
                  title="Click to enlarge Kevin, Nica & Cats stamp"
                  className="w-full h-full overflow-hidden rounded-[2px] shadow-xs group cursor-pointer"
                >
                  <img
                    src={CANVA_ASSETS.page2.coupleWithCatsRedStamp}
                    alt="Kevin and Nica with Cats Stamp"
                    className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform"
                  />
                </button>
              </div>
              <div className="border-r border-[#3c362b]/50 p-1">22</div>
              {/* Sat 23: Pink Lily Sticker */}
              <div className="relative p-1 overflow-visible">
                <span>23</span>
                <img
                  src={CANVA_ASSETS.page2.pinkLilySticker}
                  alt="Pink Tropical Lily"
                  className="absolute top-3 -right-3 sm:-right-4 w-12 sm:w-14 md:w-16 max-w-none h-auto z-20 pointer-events-none sticker-shadow rotate-8"
                />
              </div>
            </div>

            {/* Week 5: Jan 24 to Jan 30 */}
            <div className="grid grid-cols-7 border-b border-[#3c362b]/50 h-11 sm:h-14 md:h-16 text-[10px] sm:text-xs font-aileron font-bold text-[#1d1a15]">
              <div className="border-r border-[#3c362b]/50 p-1">24</div>
              <div className="border-r border-[#3c362b]/50 p-1">25</div>
              <div className="border-r border-[#3c362b]/50 p-1">26</div>
              <div className="border-r border-[#3c362b]/50 p-1">27</div>
              <div className="border-r border-[#3c362b]/50 p-1">28</div>
              <div className="border-r border-[#3c362b]/50 p-1">29</div>
              <div className="p-1">30</div>
            </div>

            {/* Week 6: Jan 31 + Nica B&W Portrait on Thu cell */}
            <div className="grid grid-cols-7 h-11 sm:h-14 md:h-16 text-[10px] sm:text-xs font-aileron font-bold text-[#1d1a15]">
              <div className="border-r border-[#3c362b]/50 p-1">31</div>
              <div className="border-r border-[#3c362b]/50 p-1" />
              <div className="border-r border-[#3c362b]/50 p-1" />
              <div className="border-r border-[#3c362b]/50 p-1" />
              {/* Nica B&W Portrait */}
              <div className="relative border-r border-[#3c362b]/50 p-0.5">
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIndex(4)}
                  title="Click to view Nica's portrait"
                  className="w-full h-full overflow-hidden rounded-[2px] shadow-xs group cursor-pointer"
                >
                  <img
                    src={CANVA_ASSETS.page2.nicaBwPortrait}
                    alt="Nica"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </button>
              </div>
              <div className="border-r border-[#3c362b]/50 p-1" />
              <div className="p-1" />
            </div>
          </div>

          {/* Interactive Helper Bar at bottom of Calendar */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-aileron font-bold text-[#494134]">
            <button
              type="button"
              onClick={() => setSelectedPhotoIndex(0)}
              className="inline-flex items-center gap-1 hover:text-[#c74f16] transition-colors cursor-pointer"
            >
              <CameraIcon weight="duotone" className="w-3.5 h-3.5" />
              <span>Tap any photo on the calendar to enlarge</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCalendarMenu((prev) => !prev)}
              className="inline-flex items-center gap-1 bg-[#194a69] text-white px-2.5 py-1 rounded-full text-[10px] sm:text-xs hover:bg-[#123850] transition-colors cursor-pointer shadow-xs"
            >
              <CalendarPlusIcon weight="bold" className="w-3.5 h-3.5" />
              <span>Save Jan 9 to Calendar</span>
            </button>
          </div>

          {/* Save to Calendar Popover */}
          <AnimatePresence>
            {showCalendarMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-2 p-3 rounded-xl bg-white/95 border border-amber-900/20 shadow-lg flex flex-wrap items-center justify-between gap-2"
              >
                <span className="font-aileron font-bold text-xs text-[#2b241d]">
                  Add Jan 9, 2027 (4:00 PM) to your calendar:
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full bg-[#194a69] hover:bg-[#123850] text-white font-aileron font-bold text-xs inline-flex items-center gap-1 shadow-xs"
                  >
                    <span>Google Calendar</span>
                    <ArrowSquareOutIcon weight="bold" className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    className="px-3 py-1.5 rounded-full bg-[#ebcfa4] hover:bg-[#dfb97e] text-[#2b241d] font-aileron font-bold text-xs inline-flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <DownloadSimpleIcon weight="bold" className="w-3.5 h-3.5" />
                    <span>Apple / Outlook (.ics)</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Lower Collage: Couple Line-Art Sketch + Cat holding RSVP Sign + Chartreuse ATTIRE Card */}
        <div className="relative w-full mt-2 sm:mt-4 flex flex-col md:flex-row items-center md:items-end justify-center">
          {/* Couple Line-Art Cutout (Left, overlapping calendar bottom-left just like Canva Page 2) */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="relative z-30 -mt-14 sm:-mt-20 md:mt-0 md:-mr-10 self-start sm:self-auto pointer-events-none"
          >
            <img
              src={CANVA_ASSETS.page2.coupleIllustrationCutout}
              alt="Kevin and Nica Resort Chic Illustration"
              className="w-40 sm:w-48 md:w-56 h-auto object-contain -rotate-3 drop-shadow-[0_6px_14px_rgba(0,0,0,0.22)]"
            />
          </motion.div>

          {/* Right Column: Cat with Fish RSVP Sign + Chartreuse ATTIRE Board */}
          <div className="relative z-20 w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] -mt-28 sm:-mt-32 md:mt-0 ml-auto flex flex-col items-end">
            {/* Cute Cat Holding Blue Fish & RSVP Sign (MAHXWu6n3X8.png) */}
            <motion.div
              whileHover={reduceMotion ? {} : { scale: 1.04, rotate: 2 }}
              whileTap={{ scale: 0.96 }}
              className="relative z-30 -mb-10 sm:-mb-12 mr-1 sm:mr-2 flex flex-col items-center group"
            >
              <a
                href={EXTERNAL_LINKS.rsvpUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Official RSVP Form"
                title="Open Official RSVP Form"
                className="relative block w-36 sm:w-44 md:w-48 focus:outline-none cursor-pointer"
              >
                <img
                  src={CANVA_ASSETS.page2.catWithFishCutout}
                  alt="Cat holding fish and RSVP sign"
                  className="w-full h-auto object-contain sticker-shadow-lg"
                />
                <span className="absolute -top-2 right-2 bg-[#1658a0] text-white font-aileron font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-md group-hover:bg-[#e6681b] transition-colors inline-flex items-center gap-1">
                  <span>Tap to RSVP!</span>
                  <ArrowSquareOutIcon weight="bold" className="w-3 h-3" />
                </span>
              </a>
            </motion.div>

            {/* Chartreuse Textured ATTIRE Card (MAHXWc9E9hM.jpg) */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative z-20 w-full rounded-sm p-4 sm:p-6 pt-8 sm:pt-10 paper-card-shadow text-[#3d392e]"
              style={{
                backgroundImage: `url(${CANVA_ASSETS.page2.chartreuseTextureCard})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="font-aileron font-bold text-3xl sm:text-4xl tracking-tight text-[#3d392e] leading-none">
                ATTIRE
              </h3>
              <p className="mt-1 font-aileron font-bold text-sm sm:text-base text-[#3d392e]">
                Resort Chic/Semi Formal
              </p>
              <p className="mt-2 font-aileron text-xs sm:text-sm text-[#3d392e] leading-snug max-w-[34ch]">
                Think lightweight fabrics, vibrant colors, playful prints, and
                fun patterns!
              </p>

              {/* QR Code + "Scan this for inspo!" */}
              <div className="mt-3.5 flex items-center gap-3 sm:gap-4">
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    title="Click to enlarge QR code or open dress code inspiration"
                    className="block w-20 h-20 sm:w-22 sm:h-22 bg-white p-1.5 border border-[#3d392e]/60 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                  >
                    <img
                      src={CANVA_ASSETS.page2.dressCodeQrCode}
                      alt="QR Code: Dress Code Inspiration"
                      className="w-full h-full object-contain"
                    />
                  </button>
                </div>

                <div className="flex flex-col">
                  <a
                    href={EXTERNAL_LINKS.dressCodeInspoQrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-campground text-lg sm:text-xl text-[#3d392e] hover:text-[#c74f16] transition-colors leading-tight"
                  >
                    Scan this for inspo!
                  </a>
                  <p className="mt-1 font-aileron text-[11px] sm:text-xs text-[#3d392e]/95 leading-snug">
                    Please avoid dark/neutral tones, heavy fabrics, and Hawaiian
                    prints.
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <a
                      href={EXTERNAL_LINKS.dressCodeInspoQrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-aileron font-bold text-[#194a69] underline hover:text-[#c74f16]"
                    >
                      <span>Open Dress Code Link</span>
                      <ArrowSquareOutIcon weight="bold" className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setShowQrModal(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-aileron font-bold text-[#3d392e]/80 hover:text-[#3d392e] cursor-pointer"
                    >
                      <QrCodeIcon weight="bold" className="w-3.5 h-3.5" />
                      <span>Zoom QR</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 6 Stamp-Edged Fabric Color Swatches (MAHXWemharQ.png) */}
              <div className="mt-4">
                <div className="relative w-full">
                  <img
                    src={CANVA_ASSETS.page2.colorSwatchesCutout}
                    alt="Recommended Attire Color Swatches"
                    className="w-full h-auto object-contain drop-shadow-xs"
                  />
                  {/* Interactive Hit Targets over each of the 6 swatches */}
                  <div className="absolute inset-0 grid grid-cols-6 gap-1">
                    {SWATCH_COLORS.map((swatch, idx) => (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() =>
                          setActiveSwatch(activeSwatch === idx ? null : idx)
                        }
                        onMouseEnter={() => setActiveSwatch(idx)}
                        aria-label={`Inspect ${swatch.name} swatch`}
                        className="w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-xs"
                      />
                    ))}
                  </div>
                </div>

                {/* Swatch Caption Bar */}
                <div className="mt-1.5 min-h-[22px] flex items-center justify-between text-[11px] font-aileron">
                  {activeSwatch !== null ? (
                    <div className="flex items-center gap-2 bg-white/75 px-2.5 py-0.5 rounded-full shadow-2xs">
                      <span
                        className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                        style={{
                          backgroundColor: SWATCH_COLORS[activeSwatch].hex,
                        }}
                      />
                      <span className="font-bold text-[#2b241d]">
                        {SWATCH_COLORS[activeSwatch].name}:
                      </span>
                      <span className="text-[#494134]">
                        {SWATCH_COLORS[activeSwatch].note}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[#3d392e]/75 font-medium">
                      Tap a fabric swatch above to preview palette notes
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Live Countdown Banner (Matching Canva Page 2 Yellow Banner + TickCounter) */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-30 mt-6 sm:mt-8 w-full max-w-[380px] sm:max-w-[460px] rounded-xl overflow-hidden paper-card-shadow border border-amber-900/15 px-4 py-3 sm:py-3.5"
          style={{
            backgroundImage: `url(${CANVA_ASSETS.page2.yellowCountdownBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-[#494134]">
            <div className="font-aileron font-bold text-xs sm:text-sm tracking-wider uppercase shrink-0">
              KEVIN + NICA
            </div>

            <div className="flex items-center gap-2 sm:gap-3 font-courier-prime font-bold text-[#494134]">
              <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl leading-none">
                  {String(timeLeft.months).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-wider font-aileron mt-0.5">
                  Months
                </span>
              </div>
              <span className="text-base sm:text-lg -mt-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl leading-none">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-wider font-aileron mt-0.5">
                  Days
                </span>
              </div>
              <span className="text-base sm:text-lg -mt-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl leading-none">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-wider font-aileron mt-0.5">
                  Hours
                </span>
              </div>
              <span className="text-base sm:text-lg -mt-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl leading-none">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-wider font-aileron mt-0.5">
                  Minutes
                </span>
              </div>
              <span className="text-base sm:text-lg -mt-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl leading-none">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-wider font-aileron mt-0.5">
                  Seconds
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Section Cue */}
        <div className="relative z-30 mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onGoToGamePlan}
            className="px-4 py-2 rounded-full bg-white/90 hover:bg-white text-[#194a69] font-aileron font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
          >
            See The Game Plan (4:00 PM - 8:00 PM)
          </button>
          <a
            href={EXTERNAL_LINKS.rsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-[#e6681b] hover:bg-[#cf5912] text-white font-aileron font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 inline-flex items-center gap-1.5"
          >
            <SparkleIcon weight="fill" className="w-3.5 h-3.5" />
            <span>RSVP Online</span>
            <ArrowSquareOutIcon weight="bold" className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Calendar Photo Stamp Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhotoIndex(null)}
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={reduceMotion ? false : { scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-[#fdfaf3] rounded-2xl p-4 sm:p-6 shadow-2xl border border-amber-900/20"
            >
              <div className="flex items-center justify-between pb-3">
                <div>
                  <span className="font-courier-prime text-xs text-[#c74f16] font-bold uppercase">
                    {CALENDAR_PHOTOS[selectedPhotoIndex].dateLabel}
                  </span>
                  <h3 className="font-aileron font-bold text-lg sm:text-xl text-[#2b241d]">
                    {CALENDAR_PHOTOS[selectedPhotoIndex].title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIndex(null)}
                  aria-label="Close photo"
                  className="p-2 rounded-full bg-amber-950/10 hover:bg-amber-950/20 text-[#2b241d] cursor-pointer"
                >
                  <XIcon weight="bold" className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-xl overflow-hidden bg-stone-900/5 flex items-center justify-center max-h-[65dvh]">
                <img
                  src={CALENDAR_PHOTOS[selectedPhotoIndex].src}
                  alt={CALENDAR_PHOTOS[selectedPhotoIndex].title}
                  className="w-full h-auto max-h-[65dvh] object-contain"
                />
              </div>

              <p className="mt-3 font-aileron text-xs sm:text-sm text-[#494134] leading-relaxed">
                {CALENDAR_PHOTOS[selectedPhotoIndex].caption}
              </p>

              {CALENDAR_PHOTOS[selectedPhotoIndex].id === "villa-elisa" && (
                <div className="mt-3">
                  <a
                    href={EXTERNAL_LINKS.villaElisaWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#194a69] hover:bg-[#123850] text-white font-aileron font-bold text-xs px-3.5 py-1.5 shadow-xs transition-colors"
                  >
                    <span>Visit Villa Elisa Botolan Website</span>
                    <ArrowSquareOutIcon weight="bold" className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-amber-900/10 pt-3">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPhotoIndex(
                      (selectedPhotoIndex - 1 + CALENDAR_PHOTOS.length) %
                        CALENDAR_PHOTOS.length
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/10 hover:bg-amber-950/15 text-[#2b241d] font-aileron font-bold text-xs cursor-pointer"
                >
                  <ArrowLeftIcon weight="bold" className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <div className="flex items-center gap-1.5">
                  {CALENDAR_PHOTOS.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPhotoIndex(i)}
                      aria-label={`View ${p.title}`}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        i === selectedPhotoIndex
                          ? "w-5 bg-[#c74f16]"
                          : "bg-amber-900/25"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPhotoIndex(
                      (selectedPhotoIndex + 1) % CALENDAR_PHOTOS.length
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/10 hover:bg-amber-950/15 text-[#2b241d] font-aileron font-bold text-xs cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRightIcon weight="bold" className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Zoom Modal */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQrModal(false)}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={reduceMotion ? false : { scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm w-full bg-[#fdfaf3] rounded-2xl p-5 shadow-2xl border border-amber-900/20 text-center"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-campground text-2xl text-[#3d392e]">
                  Scan this for inspo!
                </h3>
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  aria-label="Close QR modal"
                  className="p-1.5 rounded-full bg-amber-950/10 hover:bg-amber-950/20 text-[#2b241d] cursor-pointer"
                >
                  <XIcon weight="bold" className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-white p-4 rounded-xl border border-amber-900/15 shadow-inner mx-auto max-w-[240px]">
                <img
                  src={CANVA_ASSETS.page2.dressCodeQrCode}
                  alt="Dress Code Inspiration QR Code"
                  className="w-full h-auto object-contain"
                />
              </div>
              <p className="mt-3 font-aileron text-xs sm:text-sm text-[#494134]">
                Resort Chic / Semi Formal: Lightweight fabrics, vibrant colors,
                playful prints, and fun patterns.
              </p>
              <a
                href={EXTERNAL_LINKS.dressCodeInspoQrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-2.5 px-4 rounded-full bg-[#194a69] hover:bg-[#123850] text-white font-aileron font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Open Inspiration Board Directly</span>
                <ArrowSquareOutIcon weight="bold" className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
