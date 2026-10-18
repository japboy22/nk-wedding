"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  X,
  CheckCircle,
  ChatCircleText,
  PaperPlaneTilt,
  WhatsappLogo,
  Images,
  Sparkle,
  Heart,
  MusicNotes,
  Users,
} from "@phosphor-icons/react";
import { CANVA_ASSETS } from "@/lib/assets";

interface RsvpAndWishesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "rsvp" | "wishes" | "canva";
}

interface WishItem {
  id: string;
  name: string;
  relationship: string;
  message: string;
  timestamp: string;
}

const INITIAL_WISHES: WishItem[] = [
  {
    id: "wish-1",
    name: "Mika & Paulo",
    relationship: "College Barkada",
    message:
      "Counting down the days until we celebrate you two by the beach in Botolan! Ready for sunset cocktails and the 8 PM dance floor!",
    timestamp: "Pinned Note",
  },
  {
    id: "wish-2",
    name: "Tita Elena & Family",
    relationship: "Family",
    message:
      "So thrilled for Kevin and Nica! Wishing you a lifetime of calm seas, warm sunsets, and endless laughter together.",
    timestamp: "Pinned Note",
  },
  {
    id: "wish-3",
    name: "Jules",
    relationship: "Bridal Party",
    message:
      "Resort Chic outfits are already planned! See you at Villa Elisa on January 9, 2027!",
    timestamp: "Pinned Note",
  },
];

export default function RsvpAndWishesModal({
  isOpen,
  onClose,
  initialTab = "rsvp",
}: RsvpAndWishesModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<"rsvp" | "wishes" | "canva">(initialTab);

  // Sync tab when prop changes
  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // RSVP Form State
  const [guestName, setGuestName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guestCount, setGuestCount] = useState("1");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [songRequest, setSongRequest] = useState("");
  const [personalNote, setPersonalNote] = useState("");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Wishes Wall State (Page 7 Speech Bubbles)
  const [wishes, setWishes] = useState<WishItem[]>(INITIAL_WISHES);
  const [wishAuthor, setWishAuthor] = useState("");
  const [wishRelation, setWishRelation] = useState("");
  const [wishText, setWishText] = useState("");

  // Canva Original Pages Preview State
  const [selectedCanvaPage, setSelectedCanvaPage] = useState(0);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setRsvpSubmitted(true);

    if (personalNote.trim()) {
      const newWish: WishItem = {
        id: `wish-${Date.now()}`,
        name: guestName.trim(),
        relationship: attending === "yes" ? "Attending Guest" : "Sending Love",
        message: personalNote.trim(),
        timestamp: "Just now",
      };
      setWishes((prev) => [newWish, ...prev]);
    }
  };

  const handleSendRsvpViaWhatsApp = () => {
    const statusText =
      attending === "yes"
        ? `YES, attending (${guestCount} ${Number(guestCount) === 1 ? "seat" : "seats"})`
        : "Regretfully cannot attend";
    const lines = [
      `Hi Rica (8WILLHAPPEN)! Here is my RSVP for Kevin + Nica's Wedding (Jan 9, 2027):`,
      `- Name: ${guestName || "Guest"}`,
      `- Attendance: ${statusText}`,
      dietaryNotes ? `- Dietary / Allergies: ${dietaryNotes}` : "",
      songRequest ? `- Dance Floor Song Request: ${songRequest}` : "",
      personalNote ? `- Message for Kevin & Nica: ${personalNote}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/639771996706?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishAuthor.trim() || !wishText.trim()) return;
    const newItem: WishItem = {
      id: `wish-${Date.now()}`,
      name: wishAuthor.trim(),
      relationship: wishRelation.trim() || "Friend & Guest",
      message: wishText.trim(),
      timestamp: "Just now",
    };
    setWishes((prev) => [newItem, ...prev]);
    setWishAuthor("");
    setWishRelation("");
    setWishText("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { scale: 0.94, opacity: 0, y: 16 }
            }
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { scale: 0.94, opacity: 0, y: 16 }
            }
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-3xl bg-[#faf6ee] text-stone-900 shadow-[0_25px_70px_rgba(0,0,0,0.65)] border-2 border-[#d8c39e] overflow-hidden my-auto max-h-[92dvh] flex flex-col"
          >
            {/* Top Kraft & Coastal Header */}
            <div
              className="relative px-5 sm:px-8 pt-6 pb-5 border-b border-stone-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              style={{
                backgroundImage: `url(${CANVA_ASSETS.page2.kraftPaperCalendarBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-[#1e3525]/80 pointer-events-none" />

              <div className="relative z-10 flex items-center gap-3.5">
                <div className="relative w-14 h-14 rounded-2xl bg-[#f2ffc5]/15 border border-[#f2ffc5]/30 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={CANVA_ASSETS.page2.catWithFishCutout}
                    alt="Cat with RSVP sign"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-courier uppercase tracking-widest text-[#f2ffc5]/90">
                    <Sparkle className="w-3.5 h-3.5 text-[#ff9b54]" weight="fill" />
                    <span>RSVP Deadline: November 15, 2026</span>
                  </div>
                  <h3 className="font-spartan font-bold text-xl sm:text-2xl text-[#f2ffc5] tracking-wider uppercase">
                    KEVIN + NICA WEDDING RSVP & WISHES
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="relative z-10 self-end sm:self-center rounded-full bg-white/15 hover:bg-white/25 text-white p-2.5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" weight="bold" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-[#f1eadc] px-5 sm:px-8 py-2.5 border-b border-stone-300/80 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("rsvp")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-spartan font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "rsvp"
                    ? "bg-[#1e3a27] text-[#f2ffc5] shadow-sm"
                    : "text-stone-700 hover:bg-stone-300/60"
                }`}
              >
                <PaperPlaneTilt className="w-4 h-4" weight="fill" />
                <span>RSVP Form</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("wishes")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-spartan font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "wishes"
                    ? "bg-[#1e3a27] text-[#f2ffc5] shadow-sm"
                    : "text-stone-700 hover:bg-stone-300/60"
                }`}
              >
                <ChatCircleText className="w-4 h-4" weight="fill" />
                <span>Speech Bubble Wishes ({wishes.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("canva")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-spartan font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "canva"
                    ? "bg-[#1e3a27] text-[#f2ffc5] shadow-sm"
                    : "text-stone-700 hover:bg-stone-300/60"
                }`}
              >
                <Images className="w-4 h-4" weight="fill" />
                <span>Canva Pages (1-7)</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8 overflow-y-auto flex-1">
              {/* TAB 1: RSVP FORM */}
              {activeTab === "rsvp" && (
                <div>
                  {rsvpSubmitted ? (
                    <div className="text-center py-6 sm:py-8 px-4">
                      <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 shadow-inner">
                        <CheckCircle className="w-12 h-12" weight="fill" />
                      </div>
                      <h4 className="font-campground text-3xl sm:text-4xl text-[#1e3a27]">
                        See you in Zambales, {guestName}!
                      </h4>
                      <p className="mt-2 font-courier text-xs sm:text-sm text-stone-700 max-w-md mx-auto">
                        Your RSVP details are ready. For instant confirmation with
                        Kevin & Nica&apos;s official coordinator (
                        <strong>8WILLHAPPEN - Rica</strong>), tap the WhatsApp
                        button below to send your pre-filled RSVP card.
                      </p>

                      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={handleSendRsvpViaWhatsApp}
                          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-[#062410] font-spartan font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-3 shadow-md transition-all cursor-pointer active:scale-95"
                        >
                          <WhatsappLogo className="w-5 h-5" weight="fill" />
                          <span>Send RSVP to Coordinator via WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRsvpSubmitted(false)}
                          className="rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 font-courier text-xs px-4 py-2.5 transition-colors cursor-pointer"
                        >
                          Edit Response
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-spartan font-bold text-xs uppercase tracking-wider text-stone-800 mb-1.5">
                            Your Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="e.g. Camille Santos"
                            className="w-full rounded-xl bg-white border border-stone-300 px-3.5 py-2.5 font-courier text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a27]"
                          />
                        </div>

                        <div>
                          <label className="block font-spartan font-bold text-xs uppercase tracking-wider text-stone-800 mb-1.5">
                            Will You Join Us on Jan 9, 2027? *
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setAttending("yes")}
                              className={`rounded-xl py-2.5 px-3 font-spartan font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                                attending === "yes"
                                  ? "bg-[#1e3a27] text-[#f2ffc5] border-[#1e3a27]"
                                  : "bg-white text-stone-700 border-stone-300 hover:bg-stone-100"
                              }`}
                            >
                              Yes, I&apos;m In!
                            </button>
                            <button
                              type="button"
                              onClick={() => setAttending("no")}
                              className={`rounded-xl py-2.5 px-3 font-spartan font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                                attending === "no"
                                  ? "bg-stone-800 text-white border-stone-800"
                                  : "bg-white text-stone-700 border-stone-300 hover:bg-stone-100"
                              }`}
                            >
                              Celebrates From Afar
                            </button>
                          </div>
                        </div>
                      </div>

                      {attending === "yes" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="flex items-center gap-1.5 font-spartan font-bold text-xs uppercase tracking-wider text-stone-800 mb-1.5">
                              <Users className="w-4 h-4 text-[#1e3a27]" />
                              <span>Reserved Seats Needed</span>
                            </label>
                            <select
                              value={guestCount}
                              onChange={(e) => setGuestCount(e.target.value)}
                              className="w-full rounded-xl bg-white border border-stone-300 px-3.5 py-2.5 font-courier text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a27]"
                            >
                              <option value="1">1 Guest (Just Me)</option>
                              <option value="2">2 Guests (Plus One / Couple)</option>
                              <option value="3">3 Guests</option>
                              <option value="4">4 Guests (Family)</option>
                            </select>
                          </div>

                          <div>
                            <label className="flex items-center gap-1.5 font-spartan font-bold text-xs uppercase tracking-wider text-stone-800 mb-1.5">
                              <MusicNotes className="w-4 h-4 text-[#d95338]" />
                              <span>8:00 PM Dance Floor Song Request</span>
                            </label>
                            <input
                              type="text"
                              value={songRequest}
                              onChange={(e) => setSongRequest(e.target.value)}
                              placeholder="What song gets you dancing?"
                              className="w-full rounded-xl bg-white border border-stone-300 px-3.5 py-2.5 font-courier text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a27]"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block font-spartan font-bold text-xs uppercase tracking-wider text-stone-800 mb-1.5">
                          Dietary Restrictions or Travel Notes (Optional)
                        </label>
                        <input
                          type="text"
                          value={dietaryNotes}
                          onChange={(e) => setDietaryNotes(e.target.value)}
                          placeholder="Allergies, vegetarian preference, or where you're staying in Botolan"
                          className="w-full rounded-xl bg-white border border-stone-300 px-3.5 py-2.5 font-courier text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a27]"
                        />
                      </div>

                      <div>
                        <label className="block font-spartan font-bold text-xs uppercase tracking-wider text-stone-800 mb-1.5">
                          Leave a Wish for Kevin & Nica (Appears on Speech Bubble Wall)
                        </label>
                        <textarea
                          rows={3}
                          value={personalNote}
                          onChange={(e) => setPersonalNote(e.target.value)}
                          placeholder="Write your message for the couple..."
                          className="w-full rounded-xl bg-white border border-stone-300 px-3.5 py-2.5 font-courier text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a27]"
                        />
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={CANVA_ASSETS.page2.rsvpSignCutout}
                            alt="RSVP Sign"
                            className="w-12 h-auto object-contain"
                          />
                          <span className="font-courier text-xs text-stone-600">
                            Kindly RSVP by <strong>Nov 15, 2026</strong>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={handleSendRsvpViaWhatsApp}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#0c3d1e] border border-[#25D366]/50 font-spartan font-bold text-xs uppercase tracking-wider px-4 py-2.5 transition-all cursor-pointer"
                          >
                            <WhatsappLogo className="w-4 h-4" weight="fill" />
                            <span>WhatsApp Direct</span>
                          </button>

                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-full bg-[#ff7a2f] hover:bg-[#ff6510] text-white font-spartan font-bold text-xs uppercase tracking-widest px-6 py-3 shadow-md transition-all cursor-pointer active:scale-95"
                          >
                            <PaperPlaneTilt className="w-4 h-4" weight="fill" />
                            <span>Confirm RSVP</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: PAGE 7 SPEECH BUBBLE WISHES WALL */}
              {activeTab === "wishes" && (
                <div className="space-y-6">
                  {/* Top Banner using Page 7 Speech Bubble Assets */}
                  <div className="rounded-2xl bg-[#f1eadc] p-4 sm:p-5 border border-stone-300 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-24 h-20 shrink-0 flex items-center justify-center">
                      <img
                        src={CANVA_ASSETS.wishes.handDrawnSpeechBubble}
                        alt="Hand-drawn speech bubble from Page 7"
                        className="w-full h-full object-contain"
                      />
                      <img
                        src={CANVA_ASSETS.wishes.doubleChatBubbleIcon}
                        alt=""
                        className="w-7 h-7 object-contain absolute"
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <h4 className="font-spartan font-bold text-base sm:text-lg text-[#1e3a27] uppercase tracking-wider">
                        Coastal Guestbook & Speech Bubbles
                      </h4>
                      <p className="font-courier text-xs text-stone-700 mt-0.5">
                        Inspired by Page 7 of our Canva invitation. Drop a note,
                        travel tip, or toast for Kevin & Nica!
                      </p>
                    </div>
                  </div>

                  {/* Add a Wish Mini Form */}
                  <form
                    onSubmit={handleAddWish}
                    className="rounded-2xl bg-white p-4 border border-stone-300 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={wishAuthor}
                        onChange={(e) => setWishAuthor(e.target.value)}
                        placeholder="Your Name *"
                        className="rounded-xl bg-stone-50 border border-stone-300 px-3 py-2 font-courier text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a27]"
                      />
                      <input
                        type="text"
                        value={wishRelation}
                        onChange={(e) => setWishRelation(e.target.value)}
                        placeholder="How do you know Kevin & Nica?"
                        className="rounded-xl bg-stone-50 border border-stone-300 px-3 py-2 font-courier text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a27]"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="text"
                        required
                        value={wishText}
                        onChange={(e) => setWishText(e.target.value)}
                        placeholder="Write your wish or message for the couple..."
                        className="flex-1 rounded-xl bg-stone-50 border border-stone-300 px-3 py-2 font-courier text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a27]"
                      />
                      <button
                        type="submit"
                        className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1e3a27] hover:bg-[#294d34] text-[#f2ffc5] font-spartan font-bold text-xs uppercase tracking-wider px-4 py-2.5 transition-all cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 text-[#ff7a2f]" weight="fill" />
                        <span>Post Bubble</span>
                      </button>
                    </div>
                  </form>

                  {/* Wishes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishes.map((wish, idx) => (
                      <div
                        key={wish.id}
                        className="relative rounded-2xl bg-white p-4 border-2 border-stone-800 shadow-[4px_4px_0px_#1e3a27]"
                        style={{
                          transform: `rotate(${idx % 2 === 0 ? -0.6 : 0.6}deg)`,
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div>
                            <p className="font-spartan font-bold text-sm text-stone-900">
                              {wish.name}
                            </p>
                            <p className="font-courier text-[11px] text-stone-500">
                              {wish.relationship}
                            </p>
                          </div>
                          <img
                            src={CANVA_ASSETS.wishes.doubleChatBubbleIcon}
                            alt=""
                            className="w-6 h-6 object-contain opacity-65"
                          />
                        </div>
                        <p className="font-courier text-xs text-stone-800 leading-relaxed">
                          &ldquo;{wish.message}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ORIGINAL CANVA PAGES GALLERY (Pages 1 to 7) */}
              {activeTab === "canva" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-courier text-xs text-stone-700">
                      Browse all 7 original Canva design boards extracted into{" "}
                      <code className="bg-stone-200 px-1.5 py-0.5 rounded">
                        /public/assets/pages/
                      </code>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {CANVA_ASSETS.pagePreviews.map((_, idx) => (
                        <button
                          key={`page-btn-${idx + 1}`}
                          type="button"
                          onClick={() => setSelectedCanvaPage(idx)}
                          className={`rounded-lg px-2.5 py-1 font-spartan font-bold text-xs transition-all cursor-pointer ${
                            selectedCanvaPage === idx
                              ? "bg-[#1e3a27] text-[#f2ffc5]"
                              : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                          }`}
                        >
                          Page {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-stone-900 p-3 sm:p-4 border border-stone-300 flex flex-col items-center">
                    <img
                      src={CANVA_ASSETS.pagePreviews[selectedCanvaPage]}
                      alt={`Original Canva Design Page ${selectedCanvaPage + 1}`}
                      className="max-h-[54dvh] w-auto object-contain rounded-lg shadow-lg"
                    />
                    <p className="mt-2.5 font-courier text-xs text-stone-300">
                      Original Canva Slide {selectedCanvaPage + 1} of{" "}
                      {CANVA_ASSETS.pagePreviews.length}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
