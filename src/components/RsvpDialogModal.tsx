"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle, Sparkle, X } from "@phosphor-icons/react";

export interface RsvpDialogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type RsvpStep = "search" | "rsvp" | "success";
type AttendanceStatus = "Attending" | "Not Attending" | null;

interface FamilyMemberItem {
  guestId: string;
  familyId: string;
  firstName: string;
  lastName: string;
  status: AttendanceStatus;
}

interface ExistingRsvpRow {
  guestId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  allergens: string;
  message: string;
  status: "Attending" | "Not Attending";
}

interface FindGuestApiResponse {
  success: boolean;
  message?: string;
  guest?: {
    guestId: string;
    familyId: string;
    firstName: string;
    lastName: string;
  };
  familyMembers?: Array<{
    guestId: string;
    familyId: string;
    firstName: string;
    lastName: string;
  }>;
  existingRsvp?: ExistingRsvpRow[] | null;
}

interface StoredRsvpRecord {
  familyId: string;
  members: FamilyMemberItem[];
  email: string;
  mobile: string;
  allergens: string;
  message: string;
  submittedAt: string;
}

const STORAGE_KEY = "kn_wedding_rsvp_records_v2";

function normalizeName(value: string): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function RsvpDialogModal({ isOpen, onClose }: RsvpDialogModalProps) {
  const [step, setStep] = useState<RsvpStep>("search");

  // Step 1: Search fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Step 2: Family & RSVP fields synced with Google Spreadsheet
  const [currentFamilyId, setCurrentFamilyId] = useState("");
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberItem[]>([]);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [allergens, setAllergens] = useState("");
  const [message, setMessage] = useState("");
  const [rsvpError, setRsvpError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock body scroll and listen for Escape key while open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleFindInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (!trimmedFirst || !trimmedLast) {
      setSearchError("Please enter your first name and last name.");
      return;
    }

    setSearchError("");
    setRsvpError("");
    setIsSearching(true);

    try {
      const params = new URLSearchParams({
        firstName: trimmedFirst,
        lastName: trimmedLast,
      });

      const response = await fetch(`/api/rsvp?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as FindGuestApiResponse;

      if (!response.ok || !data.success || !data.guest || !data.familyMembers) {
        setSearchError(
          data.message ||
            "We could not find your name on our guest list. Please check the spelling and try again."
        );
        setIsSearching(false);
        return;
      }

      const matchedFamilyId = data.guest.familyId;
      setCurrentFamilyId(matchedFamilyId);

      // Check existing RSVP rows from the Google Spreadsheet first
      const sheetRsvpRows = data.existingRsvp || [];

      // Fallback to localStorage if no sheet rows exist yet
      let localRecord: StoredRsvpRecord | undefined;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, StoredRsvpRecord>;
          localRecord = parsed[normalizeName(matchedFamilyId)];
        }
      } catch {
        // Ignore storage read errors
      }

      const mappedMembers: FamilyMemberItem[] = data.familyMembers.map(
        (sheetMember) => {
          // Match by Guest ID or normalized First Name in existing sheet responses
          const existingSheetRow =
            sheetRsvpRows.find((r) => r.guestId === sheetMember.guestId) ||
            sheetRsvpRows.find(
              (r) =>
                normalizeName(r.firstName) ===
                normalizeName(sheetMember.firstName)
            );

          const existingLocalMember = localRecord?.members.find(
            (m) =>
              m.guestId === sheetMember.guestId ||
              normalizeName(m.firstName) ===
                normalizeName(sheetMember.firstName)
          );

          const resolvedStatus: AttendanceStatus =
            existingSheetRow?.status === "Attending" ||
            existingSheetRow?.status === "Not Attending"
              ? existingSheetRow.status
              : existingLocalMember?.status || null;

          return {
            guestId: sheetMember.guestId,
            familyId: sheetMember.familyId,
            firstName: sheetMember.firstName,
            lastName: sheetMember.lastName,
            status: resolvedStatus,
          };
        }
      );

      setFamilyMembers(mappedMembers);

      if (sheetRsvpRows.length > 0) {
        const latestRowWithDetails =
          [...sheetRsvpRows].reverse().find((r) => r.email) ||
          sheetRsvpRows[sheetRsvpRows.length - 1];
        setEmail(latestRowWithDetails?.email || "");
        setMobile(latestRowWithDetails?.mobile || "");
        setAllergens(latestRowWithDetails?.allergens || "");
        setMessage(latestRowWithDetails?.message || "");
      } else if (localRecord) {
        setEmail(localRecord.email || "");
        setMobile(localRecord.mobile || "");
        setAllergens(localRecord.allergens || "");
        setMessage(localRecord.message || "");
      } else {
        setEmail("");
        setMobile("");
        setAllergens("");
        setMessage("");
      }

      setIsSearching(false);
      setStep("rsvp");
    } catch {
      setSearchError("Something went wrong. Please try again.");
      setIsSearching(false);
    }
  };

  const handleSelectStatus = (guestId: string, status: AttendanceStatus) => {
    setRsvpError("");
    setFamilyMembers((prev) =>
      prev.map((member) =>
        member.guestId === guestId ? { ...member, status } : member
      )
    );
  };

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setRsvpError("Please enter your email address.");
      return;
    }

    for (const member of familyMembers) {
      if (!member.status) {
        setRsvpError(
          "Please select an RSVP response for every family member."
        );
        return;
      }
    }

    setIsSubmitting(true);

    const payload = {
      familyId: currentFamilyId,
      email: trimmedEmail,
      mobile: mobile.trim(),
      allergens: allergens.trim(),
      message: message.trim(),
      members: familyMembers.map((m) => ({
        guestId: m.guestId,
        familyId: m.familyId,
        firstName: m.firstName,
        lastName: m.lastName,
        status: m.status as "Attending" | "Not Attending",
      })),
    };

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        setRsvpError(
          result.message || "Something went wrong. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      // Save locally so returning guests also have instant local state
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const existing: Record<string, StoredRsvpRecord> = raw
          ? JSON.parse(raw)
          : {};
        existing[normalizeName(currentFamilyId)] = {
          familyId: currentFamilyId,
          members: familyMembers,
          email: payload.email,
          mobile: payload.mobile,
          allergens: payload.allergens,
          message: payload.message,
          submittedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      } catch {
        // Ignore localStorage quota or private browsing errors
      }

      setIsSubmitting(false);
      setStep("success");
    } catch {
      setRsvpError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rsvp-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-5 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[680px] rounded-2xl bg-[#f7f1e8] p-3 sm:p-5 shadow-[0_24px_60px_rgba(0,0,0,0.55)] border border-[#ded7cc] my-auto max-h-[92dvh] flex flex-col"
          >
            {/* Inner Card matching Google Apps Script #fffdf8 aesthetic */}
            <div className="relative w-full bg-[#fffdf8] text-[#3f3a34] rounded-xl border border-[#e7dfd3] px-5 py-7 sm:px-9 sm:py-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-y-auto">
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close RSVP Dialog"
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#f0eadf] hover:bg-[#e4dacb] text-[#3f3a34] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" weight="bold" />
              </button>

              {/* STEP 1: SEARCH SECTION (#searchSection) */}
              {step === "search" && (
                <form onSubmit={handleFindInvitation} noValidate>
                  <div className="text-center tracking-[0.25em] text-base sm:text-lg text-[#7c746b] mb-2.5 font-serif">
                    K &amp; N
                  </div>

                  <h2
                    id="rsvp-dialog-title"
                    className="text-center font-serif font-medium text-4xl sm:text-[44px] leading-tight text-[#3f3a34] mb-1.5 text-balance"
                  >
                    Kevin &amp; Nica
                  </h2>

                  <div className="text-center text-xs sm:text-[13px] tracking-[0.12em] uppercase text-[#7a7268] mb-5">
                    January 9, 2027 &middot; Botolan, Zambales
                  </div>

                  <p className="text-center text-sm leading-relaxed text-[#5c554d] mb-6 text-pretty">
                    We would love to celebrate our special day with you.
                    <br />
                    Kindly confirm your attendance below.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="rsvp-firstName"
                        className="block text-[11px] uppercase tracking-[0.1em] text-[#6d655c] mb-1.5"
                      >
                        First Name
                      </label>
                      <input
                        id="rsvp-firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (searchError) setSearchError("");
                        }}
                        placeholder="First name"
                        autoComplete="given-name"
                        className="w-full px-3.5 py-3 text-sm border border-[#ded7cc] rounded-lg bg-[#fffdf8] text-[#3f3a34] placeholder:text-[#a89f93] focus:outline-none focus:border-[#8e8375] transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="rsvp-lastName"
                        className="block text-[11px] uppercase tracking-[0.1em] text-[#6d655c] mb-1.5"
                      >
                        Last Name
                      </label>
                      <input
                        id="rsvp-lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          if (searchError) setSearchError("");
                        }}
                        placeholder="Last name"
                        autoComplete="family-name"
                        className="w-full px-3.5 py-3 text-sm border border-[#ded7cc] rounded-lg bg-[#fffdf8] text-[#3f3a34] placeholder:text-[#a89f93] focus:outline-none focus:border-[#8e8375] transition-colors"
                      />
                    </div>
                  </div>

                  {searchError && (
                    <div
                      role="alert"
                      className="mt-3 text-[#a34a42] text-xs sm:text-[13px] text-center"
                    >
                      {searchError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full mt-5 py-3.5 px-4 bg-[#4b443b] hover:bg-[#3b352e] disabled:opacity-65 text-white rounded-lg text-xs tracking-[0.12em] uppercase font-medium transition-colors cursor-pointer"
                  >
                    {isSearching
                      ? "Finding your invitation..."
                      : "Find My Invitation"}
                  </button>
                </form>
              )}

              {/* STEP 2: RSVP FAMILY & DETAILS SECTION (#rsvpSection) */}
              {step === "rsvp" && (
                <form onSubmit={handleSubmitRsvp} noValidate>
                  <div className="text-center tracking-[0.25em] text-base sm:text-lg text-[#7c746b] mb-2 font-serif">
                    K &amp; N
                  </div>

                  <h2
                    id="rsvp-dialog-title"
                    className="text-center font-serif font-medium text-3xl sm:text-[34px] leading-tight text-[#3f3a34] mb-1 text-balance"
                  >
                    Your Family
                  </h2>

                  <p className="text-center text-xs sm:text-[13px] text-[#6f675e] mb-5 text-pretty">
                    Please confirm the attendance of each guest.
                  </p>

                  {/* Guest Cards List from Google Spreadsheet */}
                  <div className="space-y-3">
                    {familyMembers.map((member) => (
                      <div
                        key={member.guestId}
                        className="border border-[#e4ddd2] rounded-xl p-4 bg-[#fcfaf5]"
                      >
                        <div className="font-serif text-xl sm:text-[22px] text-[#3f3a34] mb-2.5">
                          {[member.firstName, member.lastName]
                            .filter(Boolean)
                            .join(" ")}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectStatus(member.guestId, "Attending")
                            }
                            className={`w-full py-2.5 px-3 rounded-lg text-xs tracking-[0.06em] uppercase border transition-colors cursor-pointer ${
                              member.status === "Attending"
                                ? "bg-[#4b443b] text-white border-[#4b443b]"
                                : "bg-[#f8f4ec] text-[#4b443b] border-[#cfc7ba] hover:border-[#8e8375]"
                            }`}
                          >
                            Joyfully Attending
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectStatus(
                                member.guestId,
                                "Not Attending"
                              )
                            }
                            className={`w-full py-2.5 px-3 rounded-lg text-xs tracking-[0.06em] uppercase border transition-colors cursor-pointer ${
                              member.status === "Not Attending"
                                ? "bg-[#4b443b] text-white border-[#4b443b]"
                                : "bg-[#f8f4ec] text-[#4b443b] border-[#cfc7ba] hover:border-[#8e8375]"
                            }`}
                          >
                            Regretfully Declines
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 text-center text-xs text-[#7b7369] text-pretty">
                    Please select an RSVP response for every guest listed above.
                  </p>

                  {/* Contact & Dietary Inputs */}
                  <div className="mt-5 space-y-4">
                    <div>
                      <label
                        htmlFor="rsvp-email"
                        className="block text-[11px] uppercase tracking-[0.1em] text-[#6d655c] mb-1.5"
                      >
                        Email Address
                      </label>
                      <input
                        id="rsvp-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (rsvpError) setRsvpError("");
                        }}
                        placeholder="your@email.com"
                        autoComplete="email"
                        className="w-full px-3.5 py-3 text-sm border border-[#ded7cc] rounded-lg bg-[#fffdf8] text-[#3f3a34] placeholder:text-[#a89f93] focus:outline-none focus:border-[#8e8375]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="rsvp-mobile"
                        className="block text-[11px] uppercase tracking-[0.1em] text-[#6d655c] mb-1.5"
                      >
                        Mobile Number
                      </label>
                      <input
                        id="rsvp-mobile"
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="09XXXXXXXXX"
                        autoComplete="tel"
                        className="w-full px-3.5 py-3 text-sm border border-[#ded7cc] rounded-lg bg-[#fffdf8] text-[#3f3a34] placeholder:text-[#a89f93] focus:outline-none focus:border-[#8e8375]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="rsvp-allergens"
                        className="block text-[11px] uppercase tracking-[0.1em] text-[#6d655c] mb-1.5"
                      >
                        Food Allergies / Dietary Restrictions
                      </label>
                      <input
                        id="rsvp-allergens"
                        type="text"
                        value={allergens}
                        onChange={(e) => setAllergens(e.target.value)}
                        placeholder="None"
                        className="w-full px-3.5 py-3 text-sm border border-[#ded7cc] rounded-lg bg-[#fffdf8] text-[#3f3a34] placeholder:text-[#a89f93] focus:outline-none focus:border-[#8e8375]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="rsvp-message"
                        className="block text-[11px] uppercase tracking-[0.1em] text-[#6d655c] mb-1.5"
                      >
                        Message to Kevin &amp; Nica
                      </label>
                      <textarea
                        id="rsvp-message"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Leave us a little message..."
                        className="w-full px-3.5 py-3 text-sm border border-[#ded7cc] rounded-lg bg-[#fffdf8] text-[#3f3a34] placeholder:text-[#a89f93] focus:outline-none focus:border-[#8e8375] resize-y"
                      />
                    </div>
                  </div>

                  {rsvpError && (
                    <div
                      role="alert"
                      className="mt-3.5 text-[#a34a42] text-xs sm:text-[13px] text-center"
                    >
                      {rsvpError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-5 py-3.5 px-4 bg-[#4b443b] hover:bg-[#3b352e] disabled:opacity-65 text-white rounded-lg text-xs tracking-[0.12em] uppercase font-medium transition-colors cursor-pointer"
                  >
                    {isSubmitting ? "Submitting your RSVP..." : "Submit RSVP"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRsvpError("");
                      setStep("search");
                    }}
                    className="w-full mt-2.5 py-3 px-4 bg-transparent hover:bg-[#f4eee4] text-[#4b443b] border border-[#bdb4a7] rounded-lg text-xs tracking-[0.12em] uppercase font-medium transition-colors cursor-pointer"
                  >
                    &larr; Back
                  </button>
                </form>
              )}

              {/* STEP 3: SUCCESS SECTION (#successSection) */}
              {step === "success" && (
                <div className="text-center py-4">
                  <div className="text-center tracking-[0.25em] text-base sm:text-lg text-[#7c746b] mb-2.5 font-serif">
                    K &amp; N
                  </div>

                  <div className="mx-auto mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f0eadf] text-[#4b443b]">
                    <CheckCircle className="w-7 h-7" weight="fill" />
                  </div>

                  <h2
                    id="rsvp-dialog-title"
                    className="font-serif font-medium text-3xl sm:text-4xl text-[#3f3a34] mb-2 text-balance"
                  >
                    Thank You!
                  </h2>

                  <p className="text-sm text-[#5c554d] leading-relaxed mb-1 text-pretty">
                    Your RSVP has been received.
                  </p>
                  <p className="text-sm text-[#5c554d] leading-relaxed mb-6 text-pretty">
                    We can&apos;t wait to celebrate with you by the sea in
                    Zambales.
                  </p>

                  {/* Submitted Summary */}
                  <div className="max-w-md mx-auto mb-6 rounded-xl border border-[#e4ddd2] bg-[#fcfaf5] p-3.5 text-left space-y-2">
                    {familyMembers.map((member) => (
                      <div
                        key={member.guestId}
                        className="flex items-center justify-between gap-2 text-xs sm:text-sm"
                      >
                        <span className="font-serif text-base text-[#3f3a34]">
                          {[member.firstName, member.lastName]
                            .filter(Boolean)
                            .join(" ")}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider font-medium ${
                            member.status === "Attending"
                              ? "bg-[#4b443b] text-white"
                              : "bg-[#ebe3d6] text-[#6d655c]"
                          }`}
                        >
                          {member.status === "Attending"
                            ? "Joyfully Attending"
                            : "Regretfully Declines"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setStep("rsvp")}
                      className="w-full sm:w-auto px-5 py-3 bg-transparent hover:bg-[#f4eee4] text-[#4b443b] border border-[#bdb4a7] rounded-lg text-xs tracking-[0.12em] uppercase font-medium transition-colors cursor-pointer"
                    >
                      Edit Response
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-7 py-3 bg-[#4b443b] hover:bg-[#3b352e] text-white rounded-lg text-xs tracking-[0.12em] uppercase font-medium transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                    >
                      <Sparkle className="w-4 h-4" weight="fill" />
                      <span>Done</span>
                    </button>
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
