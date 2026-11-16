"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  Clock,
  House,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/../public/technest.jpg";

import {
  DEFAULT_CURRENCY,
  fileKey,
  fileNameKey,
  otherKey,
  type Answers,
  type Currency,
  type Step,
} from "./data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------------------- animation presets --------------------------- */

// children rise in one after another; direction follows forward/back navigation
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};
const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const rise: Variants = {
  hidden: (d: number) => ({
    opacity: 0,
    y: d > 0 ? 26 : -26,
    filter: "blur(6px)",
  }),
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE },
  },
};

function Group({ dir, children }: { dir: number; children: ReactNode }) {
  return (
    <motion.div variants={group} initial="hidden" animate="show" custom={dir}>
      {children}
    </motion.div>
  );
}

function Rise({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={rise} className={className}>
      {children}
    </motion.div>
  );
}

const lineInput =
  "w-full border-0 border-b-2 border-[#262627]/25 bg-transparent pb-2 text-2xl outline-none transition-colors duration-300 placeholder:text-[#262627]/25 focus:border-[#262627]";

/* --------------------------------- welcome -------------------------------- */

export function Welcome({ dir, onStart }: { dir: number; onStart: () => void }) {
  return (
    <Group dir={dir}>
      <div className="flex flex-col items-center">
        <Rise>
          <div className="flex flex-row items-center gap-2">
            <Avatar className="w-24 h-24 rounded-none">
              <AvatarImage src={logo.src} alt="Tech Nest Logo" className={``} />
              <AvatarFallback className="text-2xl font-bold bg-linear-to-r from-blue-500 to-teal-500 text-white">
                TN
              </AvatarFallback>
            </Avatar>
            <p className="mb-4 text-5xl sm:text-5xl md:text-7xl font-medium text-[#262627]/70">
              Tech Nest
            </p>
          </div>
        </Rise>
        <Rise>
          <h1 className="text-4xl font-light leading-tight sm:text-5xl">
            Let's plan your project
          </h1>
        </Rise>
        <Rise>
          <p className="mt-4 max-w-lg text-lg text-[#262627]/70">
            A few quick questions so I understand what you need. Most are just
            taps. You'll be done in about 3 minutes.
          </p>
        </Rise>
        <Rise className="mt-8 flex flex-col items-start gap-3">
          <Button
            size="lg"
            onClick={onStart}
            className="h-12 w-40 rounded-lg bg-[#262627] px-8 text-base font-semibold text-white transition-transform hover:bg-[#262627]/85 active:scale-95"
          >
            Start
          </Button>
        </Rise>
        <span className="mt-2 flex items-center gap-1.5 text-sm text-[#262627]/70">
          <Clock className="size-4" /> Takes 3 minutes
        </span>
      </div>
    </Group>
  );
}

/* ------------------------------ small pieces ------------------------------ */

/** [ USD | NPR ] segmented toggle with a sliding pill */
function CurrencyToggle({
  value,
  onChange,
}: {
  value: Currency;
  onChange: (c: Currency) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Currency"
      className="relative inline-flex rounded-full bg-[#262627]/10 p-1"
    >
      {(["USD", "NPR"] as Currency[]).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className="relative z-10 rounded-full px-5 py-1.5 text-sm font-semibold transition-colors duration-300"
          style={{ color: value === c ? "#fff" : "rgba(38,38,39,0.65)" }}
        >
          {value === c && (
            <motion.span
              layoutId="currency-pill"
              className="absolute inset-0 -z-10 rounded-full bg-[#262627]"
              transition={{ type: "spring", stiffness: 500, damping: 36 }}
            />
          )}
          {c}
        </button>
      ))}
    </div>
  );
}

/** Logo upload: sends the file to /api/upload (saved to Google Drive) */
function FileDrop({
  url,
  name,
  onUploaded,
  onBusy,
  onClear,
}: {
  url: string;
  name: string;
  onUploaded: (url: string, name: string) => void;
  onBusy: (busy: boolean) => void;
  onClear: () => void;
}) {
  const [state, setState] = useState<"idle" | "uploading" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handle(file?: File) {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setState("error");
      setMsg("That file is too big. Max 4 MB.");
      return;
    }
    setState("uploading");
    setMsg("");
    onBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.url) throw new Error(json?.error || "Upload failed");
      onUploaded(json.url, file.name);
      setState("idle");
    } catch (e) {
      setState("error");
      setMsg(e instanceof Error ? e.message : "Upload failed. Try again.");
    } finally {
      onBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="mt-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />

      {url ? (
        <div className="flex items-center gap-3 rounded-md border border-[#262627] bg-[#262627]/10 px-3 py-2.5">
          <Check className="size-5 shrink-0" />
          <span className="flex-1 truncate text-base">{name || "Logo uploaded"}</span>
          <button
            type="button"
            aria-label="Remove file"
            onClick={onClear}
            className="rounded p-1 transition-colors hover:bg-black/10"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={state === "uploading"}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            handle(e.dataTransfer.files?.[0]);
          }}
          className={`flex w-full flex-col items-center gap-1.5 rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors duration-300 ${
            over
              ? "border-[#262627] bg-[#262627]/10"
              : "border-[#262627]/30 hover:border-[#262627]/60 hover:bg-[#262627]/5"
          }`}
        >
          {state === "uploading" ? (
            <>
              <Loader2 className="size-6 animate-spin" />
              <span className="text-base">Uploading…</span>
            </>
          ) : (
            <>
              <Upload className="size-6" />
              <span className="text-base font-medium">Choose a file or drop it here</span>
              <span className="text-sm text-[#262627]/60">PNG, JPG, SVG or PDF · max 4 MB</span>
            </>
          )}
        </button>
      )}

      {state === "error" && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {msg}
        </p>
      )}
    </div>
  );
}

/* -------------------------------- question -------------------------------- */

type QuestionProps = {
  step: Step;
  index: number;
  answers: Answers;
  dir: number;
  error: string | null;
  sending: boolean;
  isLast: boolean;
  onText: (v: string) => void;
  onOther: (v: string) => void;
  onChoose: (option: string) => void;
  onFile: (url: string, name: string) => void;
  onBusy: (busy: boolean) => void;
  onClearFile: () => void;
  onNext: () => void;
};

export function Question({
  step,
  index,
  answers,
  dir,
  error,
  sending,
  isLast,
  onText,
  onOther,
  onChoose,
  onFile,
  onBusy,
  onClearFile,
  onNext,
}: QuestionProps) {
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const value = answers[step.id];
  const selected = (opt: string) =>
    Array.isArray(value) ? value.includes(opt) : value === opt;
  const isTextual = ["text", "email", "tel", "long"].includes(step.type);

  return (
    <Group dir={dir}>
      <Rise className="flex items-start gap-3">
        <span className="mt-2 inline-flex size-6 shrink-0 items-center justify-center rounded bg-[#262627] text-xs font-semibold text-white">
          {index + 1}
        </span>
        <h2 className="text-2xl font-normal leading-snug sm:text-3xl">
          {step.title}
          {step.required && <span className="ml-0.5">*</span>}
        </h2>
      </Rise>

      <div className="pl-9">
        {step.hint && (
          <Rise>
            <p className="mt-2 text-base text-[#262627]/65">{step.hint}</p>
          </Rise>
        )}

        {isTextual && (
          <Rise className="mt-8">
            {step.type === "long" ? (
              <textarea
                autoFocus
                rows={3}
                value={(value as string) ?? ""}
                onChange={(e) => onText(e.target.value)}
                placeholder={step.placeholder}
                className={`${lineInput} resize-none`}
              />
            ) : (
              <input
                autoFocus
                type={step.type}
                inputMode={step.type === "tel" ? "tel" : step.type === "email" ? "email" : "text"}
                value={(value as string) ?? ""}
                onChange={(e) => onText(e.target.value)}
                placeholder={step.placeholder}
                className={lineInput}
              />
            )}
          </Rise>
        )}

        {/* [USD | NPR] toggle above the budget options */}
        {!isTextual && step.prices && (
          <Rise className="mt-6">
            <CurrencyToggle value={currency} onChange={setCurrency} />
          </Rise>
        )}

        {!isTextual && (
          <motion.div
            variants={list}
            className={`${step.prices ? "mt-4" : "mt-8"} flex max-w-md flex-col gap-2.5`}
          >
            {step.options!.map((opt, i) => {
              const on = selected(opt);
              const showOther = on && opt === step.other;
              const showUpload = on && opt === step.upload;
              const desc = step.descriptions?.[opt];

              // budget options show the chosen currency big and the other one small
              let main = opt;
              let side: string | undefined;
              if (step.prices) {
                const p = step.prices[i];
                main = currency === "USD" ? p.usd : p.npr;
                const other = currency === "USD" ? p.npr : p.usd;
                side = other === main ? undefined : other;
              }

              return (
                <motion.div key={opt} variants={rise}>
                  <motion.button
                    type="button"
                    onClick={() => onChoose(opt)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left text-lg transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#262627] ${
                      on
                        ? "border-[#262627] bg-[#262627]/10"
                        : "border-[#262627]/30 bg-[#262627]/4 hover:bg-[#262627]/10"
                    }`}
                  >
                    <motion.span
                      animate={{ scale: on ? [1, 1.3, 1] : 1 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={`inline-flex size-6 shrink-0 items-center justify-center rounded border text-xs font-semibold transition-colors duration-300 ${
                        on
                          ? "border-[#262627] bg-[#262627] text-white"
                          : "border-[#262627]/40 bg-white"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </motion.span>

                    <span className="min-w-0 flex-1">
                      {step.prices ? (
                        <motion.span
                          key={`${currency}-${i}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          className="block"
                        >
                          {main}
                        </motion.span>
                      ) : (
                        <span className="block">{main}</span>
                      )}
                      {desc && (
                        <span className="mt-0.5 block text-sm leading-snug text-[#262627]/55">
                          {desc}
                        </span>
                      )}
                    </span>

                    {side && (
                      <motion.span
                        key={`${currency}-side-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="shrink-0 text-sm text-[#262627]/50"
                      >
                        {side}
                      </motion.span>
                    )}

                    <AnimatePresence>
                      {on && (
                        <motion.span
                          initial={{ scale: 0, rotate: -40 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 40 }}
                          transition={{ type: "spring", stiffness: 520, damping: 20 }}
                        >
                          <Check className="size-5" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* "Something else" → text box slides open */}
                  <AnimatePresence initial={false}>
                    {showOther && (
                      <motion.div
                        key="other"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <input
                          autoFocus
                          value={(answers[otherKey(step.id)] as string) ?? ""}
                          onChange={(e) => onOther(e.target.value)}
                          placeholder="Tell me what it is…"
                          className={`${lineInput} mt-3 text-lg`}
                        />
                      </motion.div>
                    )}

                    {/* "Upload it now" → file picker slides open */}
                    {showUpload && (
                      <motion.div
                        key="upload"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <FileDrop
                          url={(answers[fileKey(step.id)] as string) ?? ""}
                          name={(answers[fileNameKey(step.id)] as string) ?? ""}
                          onUploaded={onFile}
                          onBusy={onBusy}
                          onClear={onClearFile}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* desktop OK button (mobile uses the bottom bar) */}
        <Rise className="mt-6 hidden items-center gap-4 sm:flex">
          <Button
            onClick={onNext}
            disabled={sending}
            className="h-11 rounded-md bg-[#262627] px-5 text-base font-semibold text-white transition-transform hover:bg-[#262627]/85 active:scale-95"
          >
            {sending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isLast ? (
              <>
                Send <ArrowRight className="size-4" />
              </>
            ) : (
              "OK"
            )}
          </Button>
          <span className="text-sm text-[#262627]/60">
            press <b>Enter ↵</b>
          </span>
        </Rise>

        <div className="min-h-12 pt-3">
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key={error}
                role="alert"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0, x: [0, -7, 7, -4, 4, 0] }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4 }}
                className="inline-block rounded bg-red-50 px-3 py-1.5 text-sm text-red-700"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Group>
  );
}

/* ------------------------------ navigation -------------------------------- */

/** Desktop: top-left back button */
export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.4, ease: EASE }}
      whileHover={{ x: -3 }}
      onClick={onClick}
      className="fixed left-5 top-5 z-10 hidden items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-[#262627]/70 transition-colors hover:bg-black/5 hover:text-[#262627] sm:flex"
    >
      <ChevronLeft className="size-5" /> Back
    </motion.button>
  );
}

/** Mobile: Back + OK pinned to the bottom, OK fills the width */
export function MobileBar({
  isLast,
  sending,
  onBack,
  onNext,
}: {
  isLast: boolean;
  sending: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="fixed inset-x-0 bottom-0 z-10 flex gap-3 bg-[#fafafa]/90 px-5 pb-5 pt-3 backdrop-blur sm:hidden"
    >
      <Button
        variant="outline"
        aria-label="Back"
        onClick={onBack}
        className="size-12 shrink-0 rounded-lg border-[#262627] bg-[#262627] text-white hover:bg-[#262627]/85 hover:text-white"
      >
        <ChevronLeft className="size-5" />
      </Button>
      <Button
        onClick={onNext}
        disabled={sending}
        className="h-12 flex-1 rounded-lg bg-[#262627] text-base font-semibold text-white hover:bg-[#262627]/85 active:scale-[0.98]"
      >
        {sending ? <Loader2 className="size-4 animate-spin" /> : isLast ? "Send" : "OK"}
      </Button>
    </motion.div>
  );
}

/* ---------------------------------- done ---------------------------------- */

export function Done({
  dir,
  firstName,
  onBook,
}: {
  dir: number;
  firstName: string;
  onBook: () => void;
}) {
  return (
    <Group dir={dir}>
      <Rise>
        <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-[#262627]">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            />
          </svg>
        </div>
      </Rise>
      <Rise>
        <h2 className="text-3xl font-light leading-tight sm:text-4xl">
          Thanks{firstName ? `, ${firstName}` : ""}. I've got everything.
        </h2>
      </Rise>
      <Rise>
        <p className="mt-3 max-w-lg text-lg text-[#262627]/70">
          I'll go through your answers and reply by email. Want to talk it
          through sooner? Pick a time that suits you.
        </p>
      </Rise>
      <Rise className="mt-8 flex flex-wrap gap-4">
        <Link href="/">
          <Button
            size="lg"
            className="h-12 gap-2 rounded-lg bg-[#262627] px-6 text-base font-semibold text-white transition-transform hover:bg-[#262627]/85 active:scale-95"
          >
            <House className="size-5" /> Go to HomePage
          </Button>
        </Link>
        <Button
          size="lg"
          onClick={onBook}
          className="h-12 gap-2 rounded-lg bg-[#262627] px-6 text-base font-semibold text-white transition-transform hover:bg-[#262627]/85 active:scale-95"
        >
          <CalendarDays className="size-5" /> Pick a time
        </Button>
      </Rise>
    </Group>
  );
}