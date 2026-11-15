import { NextResponse } from "next/server";

// Must match the step ids in app/form/page.tsx (and FIELDS in apps-script.gs)
const FIELDS = [
  "name",
  "email",
  "phone",
  "businessType",
  "businessName",
  "services",
  "features",
  "presence",
  "branding",
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
    if (!res.ok) throw new Error(`Sheet responded ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Sheet write failed", e);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}