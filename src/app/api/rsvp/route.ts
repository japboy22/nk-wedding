import { NextRequest } from "next/server";
import { EXTERNAL_LINKS } from "@/lib/assets";

const SPREADSHEET_ID = EXTERNAL_LINKS.rsvpSpreadsheetId;
const GUESTS_GID = "0";
const RSVP_RESPONSES_GID = "1274900279";

export interface SheetGuestRecord {
  guestId: string;
  familyId: string;
  firstName: string;
  lastName: string;
}

export interface ExistingRsvpRow {
  timestamp: string;
  familyId: string;
  guestId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  allergens: string;
  message: string;
  status: "Attending" | "Not Attending";
}

function normalizeName(value: string | undefined | null): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizeBaseFamilyName(familyId: string): string {
  return normalizeName(familyId.replace(/[\s.]*\d+$/, ""));
}

/**
 * RFC 4180 compliant CSV parser for Google Sheets CSV export
 */
function parseCsv(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];
    const next = csvText[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        currentField += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentField += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        currentRow.push(currentField);
        currentField = "";
      } else if (ch === "\r" && next === "\n") {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
        i++;
      } else if (ch === "\n" || ch === "\r") {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else {
        currentField += ch;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

async function fetchGuestsFromSpreadsheet(): Promise<SheetGuestRecord[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${GUESTS_GID}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch Guests sheet (${res.status})`);
  }

  const csvText = await res.text();
  const rows = parseCsv(csvText);
  if (rows.length < 2) {
    return [];
  }

  const guests: SheetGuestRecord[] = [];
  // Columns: A = GUEST ID, B = Family ID, C = First Name, D = Last Name
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const guestId = String(row[0] || "").trim();
    const familyId = String(row[1] || "").trim();
    const firstName = String(row[2] || "").trim();
    const lastName = String(row[3] || "").trim();

    if (!familyId && !firstName && !lastName) {
      continue;
    }

    guests.push({
      guestId,
      familyId,
      firstName,
      lastName,
    });
  }

  return guests;
}

async function fetchExistingRsvpsForFamily(
  familyId: string
): Promise<ExistingRsvpRow[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${RSVP_RESPONSES_GID}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return [];
    }

    const csvText = await res.text();
    const rows = parseCsv(csvText);
    if (rows.length < 2) {
      return [];
    }

    const normalizedTargetFamily = normalizeName(familyId);
    const matches: ExistingRsvpRow[] = [];

    // Columns in "RSVP Responses":
    // 0: Timestamp, 1: Family ID, 2: Guest ID, 3: First Name, 4: Last Name,
    // 5: Email, 6: Mobile, 7: Allergens, 8: Message to the Couple, 9: RSVP Status
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowFamilyId = String(row[1] || "").trim();
      if (normalizeName(rowFamilyId) !== normalizedTargetFamily) {
        continue;
      }

      const rawStatus = String(row[9] || "").trim();
      const status: "Attending" | "Not Attending" =
        rawStatus === "Not Attending" ? "Not Attending" : "Attending";

      matches.push({
        timestamp: String(row[0] || "").trim(),
        familyId: rowFamilyId,
        guestId: String(row[2] || "").trim(),
        firstName: String(row[3] || "").trim(),
        lastName: String(row[4] || "").trim(),
        email: String(row[5] || "").trim(),
        mobile: String(row[6] || "").trim(),
        allergens: String(row[7] || "").trim(),
        message: String(row[8] || "").trim(),
        status,
      });
    }

    return matches;
  } catch {
    return [];
  }
}

function findMatchingGuestInList(
  guests: SheetGuestRecord[],
  firstNameInput: string,
  lastNameInput: string
): SheetGuestRecord | null {
  const normFirst = normalizeName(firstNameInput);
  const normLast = normalizeName(lastNameInput);

  if (!normFirst || !normLast) {
    return null;
  }

  // 1. Exact match on First Name + Last Name
  for (const guest of guests) {
    if (
      normalizeName(guest.firstName) === normFirst &&
      normalizeName(guest.lastName) === normLast
    ) {
      return guest;
    }
  }

  // 2. Fallback for rows in the spreadsheet where Last Name cell is blank
  //    but the guest enters their family surname from Family ID (e.g., "Peach" in "Macapagal")
  for (const guest of guests) {
    if (
      normalizeName(guest.firstName) === normFirst &&
      !normalizeName(guest.lastName) &&
      normalizeBaseFamilyName(guest.familyId) === normLast
    ) {
      return guest;
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const firstName = searchParams.get("firstName") || "";
    const lastName = searchParams.get("lastName") || "";

    if (!normalizeName(firstName) || !normalizeName(lastName)) {
      return Response.json(
        {
          success: false,
          message: "Please enter your first name and last name.",
        },
        { status: 400 }
      );
    }

    const guests = await fetchGuestsFromSpreadsheet();
    if (guests.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No guests found in the guest list.",
        },
        { status: 404 }
      );
    }

    const matchedGuest = findMatchingGuestInList(guests, firstName, lastName);

    if (!matchedGuest) {
      return Response.json(
        {
          success: false,
          message:
            "We could not find your name on our guest list. Please check the spelling and try again.",
        },
        { status: 404 }
      );
    }

    const familyMembers = guests.filter(
      (g) => normalizeName(g.familyId) === normalizeName(matchedGuest.familyId)
    );

    const existingRsvp = await fetchExistingRsvpsForFamily(
      matchedGuest.familyId
    );

    return Response.json({
      success: true,
      guest: matchedGuest,
      familyMembers,
      existingRsvp: existingRsvp.length > 0 ? existingRsvp : null,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to verify guest list right now. Please try again.",
      },
      { status: 500 }
    );
  }
}

interface SubmitRsvpMemberInput {
  guestId: string;
  familyId?: string;
  firstName: string;
  lastName: string;
  status: "Attending" | "Not Attending";
}

interface SubmitRsvpBody {
  familyId: string;
  email: string;
  mobile?: string;
  allergens?: string;
  message?: string;
  members: SubmitRsvpMemberInput[];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SubmitRsvpBody;

    const familyId = String(body.familyId || "").trim();
    const email = String(body.email || "").trim();
    const mobile = String(body.mobile || "").trim();
    const allergens = String(body.allergens || "").trim();
    const message = String(body.message || "").trim();
    const members = Array.isArray(body.members) ? body.members : [];

    if (!familyId) {
      return Response.json(
        { success: false, message: "Family ID is missing." },
        { status: 400 }
      );
    }

    if (!email) {
      return Response.json(
        { success: false, message: "Please enter your email address." },
        { status: 400 }
      );
    }

    if (members.length === 0) {
      return Response.json(
        { success: false, message: "No family members selected." },
        { status: 400 }
      );
    }

    // Validate against the live Google Spreadsheet Guests list
    const sheetGuests = await fetchGuestsFromSpreadsheet();
    const familySheetGuests = sheetGuests.filter(
      (g) => normalizeName(g.familyId) === normalizeName(familyId)
    );

    if (familySheetGuests.length === 0) {
      return Response.json(
        {
          success: false,
          message:
            "We could not find your family on our guest list. Please search your invitation again.",
        },
        { status: 400 }
      );
    }

    const validatedMembers = [];
    for (const m of members) {
      if (m.status !== "Attending" && m.status !== "Not Attending") {
        return Response.json(
          {
            success: false,
            message: "Please select an RSVP response for every family member.",
          },
          { status: 400 }
        );
      }

      const sheetMember =
        familySheetGuests.find((g) => g.guestId === m.guestId) ||
        familySheetGuests.find(
          (g) =>
            normalizeName(g.firstName) === normalizeName(m.firstName) &&
            normalizeName(g.lastName) === normalizeName(m.lastName)
        );

      if (!sheetMember) {
        return Response.json(
          {
            success: false,
            message: `Guest "${m.firstName} ${m.lastName}" is not listed under this family invitation on the guest list.`,
          },
          { status: 400 }
        );
      }

      validatedMembers.push({
        guestId: sheetMember.guestId,
        familyId: sheetMember.familyId,
        firstName: sheetMember.firstName,
        lastName: sheetMember.lastName,
        status: m.status,
      });
    }

    const formData = {
      familyId: familySheetGuests[0].familyId,
      email,
      mobile,
      allergens,
      message,
      members: validatedMembers,
    };

    // Sync to Google Spreadsheet via the bound Google Apps Script Web App
    const gasResponse = await fetch(EXTERNAL_LINKS.rsvpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      redirect: "follow",
      cache: "no-store",
    });

    const responseText = await gasResponse.text();
    let parsedResult: { success?: boolean; message?: string } | null = null;
    try {
      parsedResult = JSON.parse(responseText);
    } catch {
      parsedResult = null;
    }

    if (!gasResponse.ok || (parsedResult && parsedResult.success === false)) {
      return Response.json(
        {
          success: false,
          message:
            parsedResult?.message ||
            "Failed to sync RSVP to the Google Spreadsheet. Please try again.",
        },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
      message:
        parsedResult?.message ||
        "Thank you! Your RSVP has been successfully submitted.",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while submitting your RSVP. Please try again.",
      },
      { status: 500 }
    );
  }
}
