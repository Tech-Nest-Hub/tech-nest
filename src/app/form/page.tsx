"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Cal from "@calcom/embed-react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*  CONFIG – edit these to change the form. No other code needs to change.    */
/* -------------------------------------------------------------------------- */

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? "your-username/30min";

type StepType = "text" | "email" | "tel" | "long" | "single" | "multi";

type Step = {
  id: string; // also the column name in your spreadsheet
  title: string;
  hint?: string;
  type: StepType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  exclusive?: string; // multi only: picking this clears the others
};

const STEPS: Step[] = [
  { id: "name", title: "What's your name?", type: "text", required: true, placeholder: "Type your answer here…" },
  { id: "email", title: "What's the best email to reach you?", type: "email", required: true, placeholder: "name@example.com" },
  { id: "phone", title: "Phone or WhatsApp number?", hint: "Optional, but faster for quick questions.", type: "tel", placeholder: "+977 98…" },
  {
    id: "businessType",
    title: "What kind of business is this for?",
    type: "single",
    required: true,
    options: ["Salon / Spa", "Restaurant / Cafe", "Shop / Store", "Clinic / Health", "Education / Coaching", "Personal / Portfolio", "Something else"],
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
    options: ["Online booking", "Online payments", "Photo gallery", "Menu / price list", "Contact form & map", "Blog / news", "Admin dashboard", "Multi-language", "Customer login"],
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

/* -------------------------------------------------------------------------- */

type Answers = Record<string, string | string[]>;
type Status = "idle" | "sending" | "done";

const EASE = [0.22, 1, 0.36, 1] as const;

function validate(step: Step, v: string | string[] | undefined): string | null {
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
  return null;
}

export default function FormPage() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(-1); // -1 = welcome screen
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = index >= 0 ? STEPS[index] : undefined;
  const progress =
    status === "done" ? 100 : ((index + 1) / (STEPS.length + 1)) * 100;

  const go = useCallback(
    (i: number) => {
      setDir(i > index ? 1 : -1);
      setError(null);
      setIndex(i);
    },
    [index]
  );

  const submit = useCallback(async (a: Answers) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(a),
      });
      if (!res.ok) throw new Error("bad response");
      setDir(1);
      setStatus("done");
    } catch {
      setStatus("idle");
      setError("Couldn't send your answers. Check your connection and press OK again.");
    }
  }, []);

  const next = useCallback(
    (override?: Answers) => {
      if (!step || status !== "idle") return;
      const a = override ?? answers;
      const err = validate(step, a[step.id]);
      if (err) return setError(err);
      setError(null);
      if (index === STEPS.length - 1) submit(a);
      else go(index + 1);
    },
    [step, status, answers, index, go, submit]
  );

  const choose = useCallback(
    (option: string) => {
      if (!step) return;
      if (step.type === "single") {
        const updated = { ...answers, [step.id]: option };
        setAnswers(updated);
        setError(null);
        if (advanceTimer.current) clearTimeout(advanceTimer.current);
        advanceTimer.current = setTimeout(() => next(updated), 320);
        return;
      }
      const current = (answers[step.id] as string[] | undefined) ?? [];
      let updated: string[];
      if (current.includes(option)) {
        updated = current.filter((o) => o !== option);
      } else if (option === step.exclusive) {
        updated = [option];
      } else {
        updated = [...current.filter((o) => o !== step.exclusive), option];
      }
      setAnswers({ ...answers, [step.id]: updated });
      setError(null);
    },
    [step, answers, next]
  );

  // Keyboard: Enter = continue, A/B/C… = pick an option
  useEffect(() => {
    if (status !== "idle") return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = el.tagName === "INPUT" || el.tagName === "TEXTAREA";
      if (e.key === "Enter" && !e.shiftKey && el.tagName !== "BUTTON") {
        e.preventDefault();
        if (index === -1) go(0);
        else next();
        return;
      }
      if (
        !typing &&
        step?.options &&
        e.key.length === 1 &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        const i = e.key.toUpperCase().charCodeAt(0) - 65;
        if (i >= 0 && i < step.options.length) choose(step.options[i]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, index, step, go, next, choose]);

  const variants = {
    enter: (d: number) => ({ opacity: 0, y: reduce ? 0 : d > 0 ? 48 : -48 }),
    center: { opacity: 1, y: 0 },
    exit: (d: number) => ({ opacity: 0, y: reduce ? 0 : d > 0 ? -48 : 48 }),
  };

  const firstName =
    typeof answers.name === "string" ? answers.name.trim().split(" ")[0] : "";

  const screenKey = status === "done" ? "done" : index;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#fafafa] text-[#262627]">
      {/* progress */}
      <div className="fixed inset-x-0 top-0 z-10 h-1 bg-black/10">
        <motion.div
          className="h-full bg-[#262627]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
        />
      </div>

      <div
        className={`mx-auto flex min-h-dvh items-center px-6 py-20 ${
          status === "done" ? "max-w-3xl" : "max-w-2xl"
        }`}
      >
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.section
            key={screenKey}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
            className="w-full"
          >
            {/* WELCOME */}
            {index === -1 && status !== "done" && (
              <div className="text-center sm:text-left">
                <p className="mb-4 text-lg font-medium text-[#262627]/60">
                  TechNest
                </p>
                <h1 className="text-4xl font-light leading-tight sm:text-5xl">
                  Let's plan your project
                </h1>
                <p className="mt-4 max-w-lg text-lg text-[#262627]/70">
                  A few quick questions so I understand what you need. Most are
                  just taps. You'll be done in about 3 minutes.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3 sm:items-start">
                  <Button
                    size="lg"
                    onClick={() => go(0)}
                    className="h-12 rounded-lg bg-[#262627] px-8 text-base font-semibold text-white hover:bg-[#262627]/85"
                  >
                    Start
                  </Button>
                  <span className="flex items-center gap-1.5 text-sm text-[#262627]/70">
                    <Clock className="size-4" /> Takes 3 minutes
                  </span>
                </div>
              </div>
            )}

            {/* QUESTION */}
            {step && status !== "done" && (
              <div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 inline-flex size-6 shrink-0 items-center justify-center rounded bg-[#262627] text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <h2 className="text-2xl font-normal leading-snug sm:text-3xl">
                    {step.title}
                    {step.required && <span className="ml-0.5">*</span>}
                  </h2>
                </div>

                <div className="pl-9">
                  {step.hint && (
                    <p className="mt-2 text-base text-[#262627]/65">
                      {step.hint}
                    </p>
                  )}

                  <div className="mt-8">
                    {(step.type === "text" ||
                      step.type === "email" ||
                      step.type === "tel") && (
                      <input
                        autoFocus
                        type={step.type}
                        inputMode={
                          step.type === "tel"
                            ? "tel"
                            : step.type === "email"
                            ? "email"
                            : "text"
                        }
                        value={(answers[step.id] as string) ?? ""}
                        onChange={(e) => {
                          setAnswers({ ...answers, [step.id]: e.target.value });
                          setError(null);
                        }}
                        placeholder={step.placeholder}
                        className="w-full border-0 border-b-2 border-[#262627]/25 bg-transparent pb-2 text-2xl outline-none transition-colors placeholder:text-[#262627]/25 focus:border-[#262627]"
                      />
                    )}

                    {step.type === "long" && (
                      <textarea
                        autoFocus
                        rows={3}
                        value={(answers[step.id] as string) ?? ""}
                        onChange={(e) => {
                          setAnswers({ ...answers, [step.id]: e.target.value });
                          setError(null);
                        }}
                        placeholder={step.placeholder}
                        className="w-full resize-none border-0 border-b-2 border-[#262627]/25 bg-transparent pb-2 text-2xl outline-none transition-colors placeholder:text-[#262627]/25 focus:border-[#262627]"
                      />
                    )}

                    {(step.type === "single" || step.type === "multi") && (
                      <div className="flex max-w-md flex-col gap-2.5">
                        {step.options!.map((opt, i) => {
                          const value = answers[step.id];
                          const selected = Array.isArray(value)
                            ? value.includes(opt)
                            : value === opt;
                          return (
                            <motion.button
                              key={opt}
                              type="button"
                              onClick={() => choose(opt)}
                              whileTap={{ scale: reduce ? 1 : 0.98 }}
                              transition={{ duration: 0.12 }}
                              className={`group flex items-center gap-3 rounded-md border px-3 py-2.5 text-left text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#262627] ${
                                selected
                                  ? "border-[#262627] bg-[#262627]/10"
                                  : "border-[#262627]/30 bg-[#262627]/[0.04] hover:bg-[#262627]/10"
                              }`}
                            >
                              <span
                                className={`inline-flex size-6 shrink-0 items-center justify-center rounded border text-xs font-semibold transition-colors ${
                                  selected
                                    ? "border-[#262627] bg-[#262627] text-white"
                                    : "border-[#262627]/40 bg-white"
                                }`}
                              >
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span className="flex-1">{opt}</span>
                              {selected && <Check className="size-5" />}
                            </motion.button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex min-h-12 flex-wrap items-center gap-4">
                    <Button
                      onClick={() => next()}
                      disabled={status === "sending"}
                      className="h-11 rounded-md bg-[#262627] px-5 text-base font-semibold text-white hover:bg-[#262627]/85"
                    >
                      {status === "sending" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : index === STEPS.length - 1 ? (
                        <>Send <ArrowRight className="size-4" /></>
                      ) : (
                        "OK"
                      )}
                    </Button>
                    <span className="hidden text-sm text-[#262627]/60 sm:inline">
                      press <b>Enter ↵</b>
                    </span>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        role="alert"
                        className="mt-3 inline-block rounded bg-red-50 px-3 py-1.5 text-sm text-red-700"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* DONE + BOOKING */}
            {status === "done" && (
              <div>
                <h2 className="text-3xl font-light sm:text-4xl">
                  Thanks{firstName ? `, ${firstName}` : ""}. I've got everything.
                </h2>
                <p className="mt-3 max-w-xl text-lg text-[#262627]/70">
                  I'll review your answers and get back to you. If you'd like to
                  talk it through, pick a time below.
                </p>
                <div className="mt-8 h-[640px] overflow-hidden rounded-xl border border-[#262627]/15 bg-white">
                  <Cal
                    calLink={CAL_LINK}
                    style={{ width: "100%", height: "100%", overflow: "auto" }}
                    config={{
                      layout: "month_view",
                      name: (answers.name as string) ?? "",
                      email: (answers.email as string) ?? "",
                      notes: `Project: ${answers.businessName ?? ""} (${answers.businessType ?? ""})`,
                    }}
                  />
                </div>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </div>

      {/* prev / next arrows */}
      {step && status !== "done" && (
        <div className="fixed bottom-4 right-4 flex overflow-hidden rounded-md">
          <button
            aria-label="Previous question"
            onClick={() => go(index - 1)}
            className="bg-[#262627] p-2 text-white transition-colors hover:bg-[#262627]/80"
          >
            <ChevronUp className="size-5" />
          </button>
          <button
            aria-label="Next question"
            onClick={() => next()}
            className="ml-px bg-[#262627] p-2 text-white transition-colors hover:bg-[#262627]/80"
          >
            <ChevronDown className="size-5" />
          </button>
        </div>
      )}
    </main>
  );
}