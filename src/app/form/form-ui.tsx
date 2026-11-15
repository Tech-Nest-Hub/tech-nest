"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  Clock,
  House,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from '@/../public/technest.jpg'

import { otherKey, type Answers, type Step } from "./data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

      <Rise>
        <div className="flex flex-row items-center gap-2">
          <Avatar className="w-24 h-24 rounded-none">
            <AvatarImage src={logo.src} alt="Tech Nest Logo" className={``}/>
            <AvatarFallback className="text-2xl font-bold bg-linear-to-r from-blue-500 to-teal-500 text-white">
              TN
            </AvatarFallback>
          </Avatar>
        <p className="mb-4 text-7xl font-medium text-[#262627]/70">
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
          className="h-12 rounded-lg bg-[#262627] px-8 text-base font-semibold text-white transition-transform hover:bg-[#262627]/85 active:scale-95"
        >
          Start
        </Button>
        <span className="flex items-center gap-1.5 text-sm text-[#262627]/70">
          <Clock className="size-4" /> Takes 3 minutes
        </span>
      </Rise>
    </Group >
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
  onNext,
}: QuestionProps) {
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

        {!isTextual && (
          <motion.div variants={list} className="mt-8 flex max-w-md flex-col gap-2.5">
            {step.options!.map((opt, i) => {
              const on = selected(opt);
              const showOther = on && opt === step.other;
              return (
                <motion.div key={opt} variants={rise}>
                  <motion.button
                    type="button"
                    onClick={() => onChoose(opt)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left text-lg transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#262627] ${on
                      ? "border-[#262627] bg-[#262627]/10"
                      : "border-[#262627]/30 bg-[#262627]/4 hover:bg-[#262627]/10"
                      }`}
                  >
                    <motion.span
                      animate={{ scale: on ? [1, 1.3, 1] : 1 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={`inline-flex size-6 shrink-0 items-center justify-center rounded border text-xs font-semibold transition-colors duration-300 ${on
                        ? "border-[#262627] bg-[#262627] text-white"
                        : "border-[#262627]/40 bg-white"
                        }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </motion.span>
                    <span className="flex-1">{opt}</span>
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
      <Rise className="mt-8 gap-4">
        <Button
          size="lg"
          onClick={onBook}
          className="h-12 gap-2 rounded-lg bg-[#262627] px-6 text-base font-semibold text-white transition-transform hover:bg-[#262627]/85 active:scale-95"
        >
          <House className="size-5" /> Go to HomePage
        </Button>
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
