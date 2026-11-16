/* -------------------------------------------------------------------------- */
/*  Everything you'd want to edit lives here: questions, options, Cal link.   */
/* -------------------------------------------------------------------------- */

export const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? "your-username/30min";

// After the form is sent, open the booking popup automatically (set false to
// only show the "Pick a time" button).
export const AUTO_OPEN_BOOKING = true;

export type Currency = "USD" | "NPR";
export const DEFAULT_CURRENCY: Currency = "USD";

export type StepType = "text" | "email" | "tel" | "long" | "single" | "multi";

export type Step = {
  id: string; // also the column name in the spreadsheet
  title: string;
  hint?: string;
  type: StepType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  /** multi only: picking this option clears all the others (e.g. "None yet") */
  exclusive?: string;
  /** an option from `options` that reveals a text box when picked (e.g. "Something else") */
  other?: string;
  /** an option from `options` that reveals a file picker (e.g. "Upload it now") */
  upload?: string;
  /** short plain-language explanation shown under an option, for clueless clients */
  descriptions?: Record<string, string>;
  /** adds a USD | NPR toggle. Same order as `options`. */
  prices?: { usd: string; npr: string }[];
  /** only show this step when this returns true */
  showIf?: (answers: Answers) => boolean;
};

export type Answers = Record<string, string | string[]>;

// extra values kept inside the answers object next to a step's own answer
export const otherKey = (id: string) => `${id}__other`;
export const fileKey = (id: string) => `${id}__file`; // uploaded file link
export const fileNameKey = (id: string) => `${id}__filename`;
export const busyKey = (id: string) => `${id}__busy`; // "1" while uploading

/* --------------------------------- budget --------------------------------- */
// Rough rate used: 1 USD ≈ NPR 140. Edit the numbers freely.
const BUDGET = [
  { usd: "Under $300", npr: "Under NPR 40,000" },
  { usd: "$300 – $800", npr: "NPR 40,000 – 110,000" },
  { usd: "$800 – $2,000", npr: "NPR 110,000 – 280,000" },
  { usd: "$2,000+", npr: "NPR 280,000+" },
  { usd: "Not sure yet", npr: "Not sure yet" },
];

/* -------------------------------- conditions ------------------------------ */

const hasPresence = (a: Answers) =>
  Array.isArray(a.presence) && a.presence.some((o) => o !== "None yet");

const hasLogo = (a: Answers) => a.branding === "Yes, I have a logo";

/* -------------------------------- questions ------------------------------- */

export const STEPS: Step[] = [
  { id: "name", title: "What's your name?", type: "text", required: true, placeholder: "Type your answer here…" },
  { id: "email", title: "What's the best email to reach you?", type: "email", required: true, placeholder: "name@example.com" },
  { id: "phone", title: "Phone or WhatsApp number?", hint: "Optional, but faster for quick questions.", type: "tel", placeholder: "+977 98…" },
  {
    id: "businessType",
    title: "What kind of business is this for?",
    type: "single",
    required: true,
    options: ["Salon / Spa", "Restaurant / Cafe", "Shop / Store", "Clinic / Health", "Education / Coaching", "Personal / Portfolio", "Something else"],
    other: "Something else",
  },
  { id: "businessName", title: "What's the business or project called?", hint: "Not decided yet? Write 'not decided'.", type: "text", required: true },
  {
    id: "services",
    title: "What do you need built?",
    hint: "Choose as many as you like.",
    type: "multi",
    required: true,
    options: ["Website", "Mobile app", "Redesign of existing site", "Not sure yet"],
    exclusive: "Not sure yet",
    descriptions: {
      "Not sure yet": "No problem, we'll work it out together.",
    },
  },
  {
    id: "features",
    title: "Which features matter to you?",
    hint: "Choose as many as you like. Not sure? Pick the last option.",
    type: "multi",
    options: [
      "Online booking",
      "Online store",
      "Online payments",
      "Photo gallery",
      "Menu / price list",
      "Contact form & map",
      "Blog / news",
      "Admin dashboard",
      "Multi-language",
      "Customer login",
      "Other",
      "Not sure, help me decide",
    ],
    other: "Other",
    exclusive: "Not sure, help me decide",
    descriptions: {
      "Online booking": "Customers book their own appointment or table",
      "Online store": "Sell products and take orders online",
      "Online payments": "Accept payments on the site",
      "Photo gallery": "Show your work, food or space",
      "Menu / price list": "List your services or items with prices",
      "Contact form & map": "Customers can message you and find you",
      "Blog / news": "Post updates and articles",
      "Admin dashboard": "You manage content and orders yourself",
      "Multi-language": "The site in more than one language",
      "Customer login": "Customers have their own accounts",
      "Not sure, help me decide": "No worries, we'll go through it on a call.",
    },
  },
  {
    id: "presence",
    title: "What do you already have online?",
    hint: "Choose as many as you like.",
    type: "multi",
    required: true,
    options: ["Facebook page", "Instagram", "TikTok", "Google Business profile", "A website", "None yet"],
    exclusive: "None yet",
  },
  {
    id: "presenceEmail",
    title: "Which email are those accounts under?",
    hint: "I may need it to get access. Skip if you're not sure or don't have one.",
    type: "email",
    placeholder: "name@example.com",
    showIf: hasPresence,
  },
  {
    id: "branding",
    title: "Do you have a logo?",
    hint: "Brand colours too, if you have them.",
    type: "single",
    required: true,
    options: ["Yes, I have a logo", "No, I'll need one"],
  },
  {
    id: "logo",
    title: "How would you like to share your logo?",
    type: "single",
    required: true,
    options: ["Upload it now", "I'll WhatsApp it later"],
    upload: "Upload it now",
    showIf: hasLogo,
  },
  {
    id: "budget",
    title: "What's your budget range?",
    hint: "An honest range helps me suggest the right approach.",
    type: "single",
    required: true,
    options: BUDGET.map((b) => (b.usd === b.npr ? b.usd : `${b.usd} / ${b.npr}`)),
    prices: BUDGET,
  },
  {
    id: "timeline",
    title: "When do you need it live?",
    type: "single",
    required: true,
    options: ["As soon as possible", "Within a month", "In 2–3 months", "No rush"],
  },
  {
    id: "notes",
    title: "Anything else I should know?",
    hint: "Websites you like, special ideas, worries… Press Shift + Enter for a new line.",
    type: "long",
    placeholder: "Type your answer here…",
  },
];

/** The steps that apply to the answers given so far. */
export const visibleSteps = (answers: Answers) =>
  STEPS.filter((s) => !s.showIf || s.showIf(answers));

/* ------------------------------- helpers ---------------------------------- */

const isSelected = (v: string | string[] | undefined, opt: string) =>
  Array.isArray(v) ? v.includes(opt) : v === opt;

export function validate(step: Step, answers: Answers): string | null {
  const v = answers[step.id];
  const empty =
    v === undefined || (Array.isArray(v) ? v.length === 0 : v.trim() === "");

  if (empty) {
    if (!step.required) return null;
    return step.type === "single" || step.type === "multi"
      ? "Please pick an option"
      : "Please fill this in";
  }
  if (step.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v as string)) {
    return "That doesn't look like a valid email";
  }
  if (step.other && isSelected(v, step.other)) {
    const text = (answers[otherKey(step.id)] as string | undefined) ?? "";
    if (!text.trim()) return "Please type what it is";
  }
  if (step.upload && isSelected(v, step.upload)) {
    if (answers[busyKey(step.id)] === "1") return "Please wait for the upload to finish";
    if (!answers[fileKey(step.id)]) {
      return "Please upload your logo, or choose WhatsApp later";
    }
  }
  return null;
}

/** Turns answers into the flat object that is sent to the spreadsheet.
 *  "Something else" becomes "Something else: <typed text>", and an uploaded
 *  file becomes its Drive link. Steps that were skipped are left out. */
export function buildPayload(answers: Answers): Answers {
  const out: Answers = {};
  for (const step of visibleSteps(answers)) {
    const v = answers[step.id];
    if (v === undefined) continue;
    const text = ((answers[otherKey(step.id)] as string | undefined) ?? "").trim();

    if (step.other && text && isSelected(v, step.other)) {
      out[step.id] = Array.isArray(v)
        ? v.map((o) => (o === step.other ? `${o}: ${text}` : o))
        : `${v}: ${text}`;
    } else if (step.upload && isSelected(v, step.upload)) {
      out[step.id] = (answers[fileKey(step.id)] as string) || (v as string);
    } else {
      out[step.id] = v;
    }
  }
  return out;
}