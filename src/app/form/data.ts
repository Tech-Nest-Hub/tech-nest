/* -------------------------------------------------------------------------- */
/*  Everything you'd want to edit lives here: questions, options, Cal link.   */
/* -------------------------------------------------------------------------- */

export const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? "your-username/30min";

// After the form is sent, open the booking popup automatically (set false to
// only show the "Pick a time" button).
export const AUTO_OPEN_BOOKING = true;

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
};

export type Answers = Record<string, string | string[]>;

// where the typed "other" text is kept inside the answers object
export const otherKey = (id: string) => `${id}__other`;

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
    options: ["Website", "Mobile app", "Online store", "Booking system", "Redesign of existing site", "Not sure yet"],
  },
  {
    id: "features",
    title: "Which features matter to you?",
    hint: "Choose as many as you like.",
    type: "multi",
    options: ["Online booking", "Online payments", "Photo gallery", "Menu / price list", "Contact form & map", "Blog / news", "Admin dashboard", "Multi-language", "Customer login", "Other"],
    other: "Other",
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
    id: "branding",
    title: "Do you have a logo and brand colours?",
    type: "single",
    required: true,
    options: ["Yes, ready to go", "Logo only", "No, I'll need help"],
  },
  {
    id: "budget",
    title: "What's your budget range?",
    hint: "An honest range helps me suggest the right approach.",
    type: "single",
    required: true,
    options: ["Under $300", "$300 – $800", "$800 – $2,000", "$2,000+", "Not sure yet"],
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
  return null;
}

/** Turns answers into the flat object that is sent to the spreadsheet.
 *  "Something else" becomes "Something else: <what they typed>". */
export function buildPayload(answers: Answers): Answers {
  const out: Answers = {};
  for (const step of STEPS) {
    const v = answers[step.id];
    if (v === undefined) continue;
    const text = ((answers[otherKey(step.id)] as string | undefined) ?? "").trim();
    if (step.other && text && isSelected(v, step.other)) {
      out[step.id] = Array.isArray(v)
        ? v.map((o) => (o === step.other ? `${o}: ${text}` : o))
        : `${v}: ${text}`;
    } else {
      out[step.id] = v;
    }
  }
  return out;
}
