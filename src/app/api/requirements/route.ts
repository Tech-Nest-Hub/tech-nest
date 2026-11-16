import { NextResponse } from "next/server";

// Must match the step ids in form/data.ts (and FIELDS in apps-script.gs)
const FIELDS = [
  "name",
  "email",
  "phone",
  "businessType",
  "businessName",
  "services",
  "features",
  "presence",
  "presenceEmail",
  "branding",
  "logo",
  "budget",
  "timeline",
  "notes",
] as const;

// Stops spreadsheet formula injection (=, +, -, @ at the start of a cell)
const clean = (v: unknown) => {
  const s = (Array.isArray(v) ? v.join(", ") : String(v ?? "")).slice(0, 2000);
  return /^[=+\-@]/.test(s) ? `'${s}` : s;
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.name !== "string" || typeof body.email !== "string") {
    return NextResponse.json({ ok: false, error: "Invalid data" }, { status: 400 });
  }

  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) {
    console.error("SHEETS_WEBHOOK_URL is missing. Add it to .env.local and restart `npm run dev`.");
    return NextResponse.json({ ok: false, error: "Not configured" }, { status: 500 });
  }

  const row: Record<string, string> = {
    secret: process.env.SHEETS_SECRET ?? "",
    submittedAt: new Date().toISOString(),
  };
  for (const f of FIELDS) row[f] = clean(body[f]);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      redirect: "follow",
    });

    // Apps Script answers 200 even on failure, so read what it actually said.
    const text = await res.text();
    let json: { ok?: boolean; error?: string } | null = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* not JSON → probably a Google login/error page */
    }

    if (!res.ok || !json?.ok) {
      console.error(
        "Sheet webhook failed →",
        res.status,
        json?.error ?? text.slice(0, 300)
      );
      return NextResponse.json(
        { ok: false, error: json?.error ?? "Sheet did not accept the data" },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Sheet webhook request error", e);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}