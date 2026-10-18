"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle,
  Plus,
  Sparkle,
  Trash,
  X,
} from "@phosphor-icons/react";
import { EXTERNAL_LINKS } from "@/lib/assets";

export interface RsvpDialogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type RsvpStep = "search" | "rsvp" | "success";
type AttendanceStatus = "Attending" | "Not Attending" | null;

interface FamilyMemberItem {
  id: string;
  firstName: string;
  lastName: string;
  status: AttendanceStatus;
  isPrimary?: boolean;
}

interface StoredRsvpRecord {
  primaryFirstName: string;
  primaryLastName: string;
  members: FamilyMemberItem[];
  email: string;
  mobile: string;
  allergens: string;
  message: string;
  submittedAt: string;
}

const STORAGE_KEY = "kn_wedding_rsvp_records_v1";

function normalizeKey(firstName: string, lastName: string): string {
  return `${firstName.trim().toLowerCase()}_${lastName.trim().toLowerCase()}`;
}

export function RsvpDialogModal({ isOpen, onClose }: RsvpDialogModalProps) {
  const [step, setStep] = useState<RsvpStep>("search");

  // Step 1: Search fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Step 2: Family & RSVP fields
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

  const handleFindInvitation = (e: React.FormEvent) => {
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

    window.setTimeout(() => {
      let existingRecord: StoredRsvpRecord | undefined;

      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, StoredRsvpRecord>;
          existingRecord = parsed[normalizeKey(trimmedFirst, trimmedLast)];
        }
      } catch {
        // Ignore storage read errors
      }

      if (existingRecord && existingRecord.members.length > 0) {
        setFamilyMembers(existingRecord.members);
        setEmail(existingRecord.email || "");
        setMobile(existingRecord.mobile || "");
        setAllergens(existingRecord.allergens || "");
        setMessage(existingRecord.message || "");
      } else {
        setFamilyMembers([
          {
            id: "primary-guest",
            firstName: trimmedFirst,
            lastName: trimmedLast,
            status: null,
            isPrimary: true,
          },
        ]);
      }

      setIsSearching(false);
      setStep("rsvp");
    }, 360);
  };

  const handleSelectStatus = (id: string, status: AttendanceStatus) => {
    setRsvpError("");
    setFamilyMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, status } : member
      )
    );
  };

  const handleAddFamilyMember = () => {
    setRsvpError("");
    setFamilyMembers((prev) => [
      ...prev,
      {
        id: `guest-${Date.now()}-${prev.length}`,
        firstName: "",
        lastName: lastName.trim(),
        status: null,
        isPrimary: false,
      },
    ]);
  };

  const handleUpdateMemberName = (
    id: string,
    field: "firstName" | "lastName",
    value: string
  ) => {
    setRsvpError("");
    setFamilyMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const handleRemoveFamilyMember = (id: string) => {
    setRsvpError("");
    setFamilyMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpError("");

    for (const member of familyMembers) {
      if (!member.firstName.trim() || !member.lastName.trim()) {
        setRsvpError(
          "Please enter the first and last name for each family member."
        );
        return;
      }
      if (!member.status) {
        setRsvpError(
          "Please select an RSVP response for every family member."
        );
        return;
      }
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setRsvpError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      guests: familyMembers.map((m) => ({
        firstName: m.firstName.trim(),
        lastName: m.lastName.trim(),
        status: m.status,
      })),
      email: trimmedEmail,
      mobile: mobile.trim(),
      allergens: allergens.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Save locally so returning guests see their saved response
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing: Record<string, StoredRsvpRecord> = raw
        ? JSON.parse(raw)
        : {};
      existing[normalizeKey(firstName, lastName)] = {
        primaryFirstName: firstName.trim(),
        primaryLastName: lastName.trim(),
        members: familyMembers.map((m) => ({
          ...m,
          firstName: m.firstName.trim(),
          lastName: m.lastName.trim(),
        })),
        email: payload.email,
        mobile: payload.mobile,
        allergens: payload.allergens,
        message: payload.message,
        submittedAt: payload.submittedAt,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // Ignore localStorage quota or private browsing errors
    }

    // Best-effort background submission to the Google Apps Script endpoint without navigating away
    try {
      const formBody = new URLSearchParams();
      formBody.append("payload", JSON.stringify(payload));
      formBody.append("email", payload.email);
      formBody.append("mobile", payload.mobile);
      formBody.append("allergens", payload.allergens);
      formBody.append("message", payload.message);
      await fetch(EXTERNAL_LINKS.rsvpUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: formBody.toString(),
      });
    } catch {
      // Network/CORS errors are safely ignored since Google Apps Script requires no-cors from external origins
    }

    window.setTimeout(() => {
      setIsSubmitting(false);
      setStep("success");
    }, 350);
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

                    {/* Guest Cards List */}
                    <div className="space-y-3">
                      {familyMembers.map((member, index) => (
                        <div
                          key={member.id}
                          className="border border-[#e4ddd2] rounded-xl p-4 bg-[#fcfaf5]"
                        >
                          {member.isPrimary ? (
                            <div className="font-serif text-xl sm:text-[22px] text-[#3f3a34] mb-2.5">
                              {member.firstName} {member.lastName}
                            </div>
                          ) : (
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] uppercase tracking-[0.1em] text-[#6d655c]">
                                  Family Member #{index + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveFamilyMember(member.id)
                                  }
                                  className="inline-flex items-center gap-1 text-[11px] text-[#a34a42] hover:underline cursor-pointer"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <input
                                  type="text"
                                  value={member.firstName}
                                  onChange={(e) =>
                                    handleUpdateMemberName(
                                      member.id,
                                      "firstName",
                                      e.target.value
                                    )
                                  }
                                  placeholder="First name"
                                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#ded7cc] rounded-lg bg-[#fffdf8] text-[#3f3a34] focus:outline-none focus:border-[#8e8375]"
                                />
                                <input
                                  type="text"
                                  value={member.lastName}
                                  onChange={(e) =>
                                    handleUpdateMemberName(
                                      member.id,
                                      "lastName",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Last name"
                                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#ded7cc] rounded-lg bg-[#fffdf8] text-[#3f3a34] focus:outline-none focus:border-[#8e8375]"
                                />
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectStatus(member.id, "Attending")
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
                                handleSelectStatus(member.id, "Not Attending")
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

                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs text-[#7b7369] text-pretty">
                        Please select an RSVP response for every guest listed
                        above.
                      </p>
                      <button
                        type="button"
                        onClick={handleAddFamilyMember}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#4b443b] hover:text-[#2b241d] underline underline-offset-4 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" weight="bold" />
                        <span>Add Family Member</span>
                      </button>
                    </div>

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
                          key={member.id}
                          className="flex items-center justify-between gap-2 text-xs sm:text-sm"
                        >
                          <span className="font-serif text-base text-[#3f3a34]">
                            {member.firstName} {member.lastName}
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
