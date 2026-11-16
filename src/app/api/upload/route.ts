import { NextResponse } from "next/server";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB (hosting platforms cap request bodies around 4.5 MB)
const ALLOWED = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file received" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "That file is too big. Max 4 MB." }, { status: 413 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ ok: false, error: "Please upload a PNG, JPG, SVG or PDF." }, { status: 415 });
  }

  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) {
    console.error("SHEETS_WEBHOOK_URL is missing.");
    return NextResponse.json({ ok: false, error: "Upload isn't set up yet." }, { status: 500 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 80) || "logo";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.SHEETS_SECRET ?? "",
        action: "upload",
        filename: safeName,
        mimeType: file.type,
        data: bytes.toString("base64"),
      }),
      redirect: "follow",
    });

    const text = await res.text();
    let json: { ok?: boolean; url?: string; error?: string } | null = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* not JSON */
    }

    if (!res.ok || !json?.ok || !json.url) {
      console.error("Upload to Drive failed →", res.status, json?.error ?? text.slice(0, 300));
      return NextResponse.json({ ok: false, error: "Couldn't upload. Please try again." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, url: json.url });
  } catch (e) {
    console.error("Upload request error", e);
    return NextResponse.json({ ok: false, error: "Couldn't upload. Please try again." }, { status: 502 });
  }
}