"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion";
import { getCalApi } from "@calcom/embed-react";
import {
  AUTO_OPEN_BOOKING,
  CAL_LINK,
  buildPayload,
  busyKey,
  fileKey,
  fileNameKey,
  otherKey,
  validate,
  visibleSteps,
  type Answers,
} from "./data";
import { BackButton, Done, EASE, MobileBar, Question, Welcome } from "./form-ui";

type Status = "idle" | "sending" | "done";

// whole-screen transition: old screen slides away, new one is staggered in by form-ui
const screen: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.2 } },
  exit: (d: number) => ({
    opacity: 0,
    y: d > 0 ? -36 : 36,
    filter: "blur(4px)",
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] as const },
  }),
};

export default function FormPage() {
  const [index, setIndex] = useState(-1); // -1 = welcome screen
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // steps that apply to the answers so far (some are skipped, e.g. logo upload)
  const steps = useMemo(() => visibleSteps(answers), [answers]);
  const step = index >= 0 ? steps[index] : undefined;
  const isLast = index === steps.length - 1;
  const progress =
    status === "done" ? 100 : ((index + 1) / (steps.length + 1)) * 100;
  const firstName =
    typeof answers.name === "string" ? answers.name.trim().split(" ")[0] : "";

  const go = useCallback(
    (i: number) => {
      if (timer.current) clearTimeout(timer.current);
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
        body: JSON.stringify(buildPayload(a)),
      });
      if (!res.ok) throw new Error("request failed");
      setDir(1);
      setStatus("done");
    } catch {
      setStatus("idle");
      setError("Couldn't send your answers. Please try again.");
    }
  }, []);

  const next = useCallback(
    (override?: Answers) => {
      if (!step || status !== "idle") return;
      const a = override ?? answers;
      const err = validate(step, a);
      if (err) return setError(err);
      setError(null);
      // recompute with the newest answers: picking "Yes" on the logo question
      // adds a step, so don't trust the `steps` from this render
      const last = index === visibleSteps(a).length - 1;
      if (last) submit(a);
      else go(index + 1);
    },
    [step, status, answers, index, go, submit]
  );

  const choose = useCallback(
    (option: string) => {
      if (!step) return;
      setError(null);

      if (step.type === "single") {
        const updated = { ...answers, [step.id]: option };
        setAnswers(updated);
        if (timer.current) clearTimeout(timer.current);
        // "Something else" / "Upload it now" wait for the person; the rest auto-advance
        if (option !== step.other && option !== step.upload) {
          timer.current = setTimeout(() => next(updated), 380);
        }
        return;
      }

      const current = (answers[step.id] as string[] | undefined) ?? [];
      let updated: string[];
      if (current.includes(option)) updated = current.filter((o) => o !== option);
      else if (option === step.exclusive) updated = [option];
      else updated = [...current.filter((o) => o !== step.exclusive), option];
      setAnswers({ ...answers, [step.id]: updated });
    },
    [step, answers, next]
  );

  const setText = (v: string) => {
    if (!step) return;
    setAnswers((a) => ({ ...a, [step.id]: v }));
    setError(null);
  };
  const setOther = (v: string) => {
    if (!step) return;
    setAnswers((a) => ({ ...a, [otherKey(step.id)]: v }));
    setError(null);
  };
  const setFile = (url: string, name: string) => {
    if (!step) return;
    setAnswers((a) => ({ ...a, [fileKey(step.id)]: url, [fileNameKey(step.id)]: name }));
    setError(null);
  };
  const setBusy = (busy: boolean) => {
    if (!step) return;
    setAnswers((a) => ({ ...a, [busyKey(step.id)]: busy ? "1" : "" }));
  };
  const clearFile = () => setFile("", "");

  /* ---- Cal.com: opens as a full-size popup instead of a cramped embed ---- */
  const openBooking = useCallback(async () => {
    const cal = await getCalApi({ namespace: "booking" });
    cal("ui", {
      theme: "light",
      hideEventTypeDetails: false,
      layout: "month_view",
      cssVarsPerTheme: {
        light: { "cal-brand": "#262627" },
        dark: { "cal-brand": "#fafafa" },
      },
    });
    cal("modal", {
      calLink: CAL_LINK,
      config: {
        layout: "month_view",
        name: (answers.name as string) ?? "",
        email: (answers.email as string) ?? "",
        notes: `Project: ${answers.businessName ?? ""}`,
      },
    });
  }, [answers]);

  useEffect(() => {
    if (status !== "done" || !AUTO_OPEN_BOOKING) return;
    const t = setTimeout(openBooking, 1600);
    return () => clearTimeout(t);
  }, [status, openBooking]);

  /* ---- keyboard: Enter = continue, A/B/C… = pick option ---- */
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
      if (!typing && step?.options && e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
        const i = e.key.toUpperCase().charCodeAt(0) - 65;
        if (i >= 0 && i < step.options.length) choose(step.options[i]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, index, step, go, next, choose]);

  const inQuestion = !!step && status !== "done";

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-dvh overflow-hidden bg-[#fafafa] text-[#262627]">
        {/* progress */}
        <div className="fixed inset-x-0 top-0 z-20 h-1 bg-black/10">
          <motion.div
            className="h-full bg-[#262627]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </div>

        <AnimatePresence>
          {inQuestion && <BackButton key="back" onClick={() => go(index - 1)} />}
        </AnimatePresence>

        <div className="mx-auto flex min-h-dvh max-w-2xl items-center px-6 pb-28 pt-20 sm:pb-20">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.section
              key={status === "done" ? "done" : index}
              custom={dir}
              variants={screen}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {status === "done" ? (
                <Done dir={dir} firstName={firstName} onBook={openBooking} />
              ) : step ? (
                <Question
                  step={step}
                  index={index}
                  answers={answers}
                  dir={dir}
                  error={error}
                  sending={status === "sending"}
                  isLast={isLast}
                  onText={setText}
                  onOther={setOther}
                  onChoose={choose}
                  onFile={setFile}
                  onBusy={setBusy}
                  onClearFile={clearFile}
                  onNext={() => next()}
                />
              ) : (
                <Welcome dir={dir} onStart={() => go(0)} />
              )}
            </motion.section>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {inQuestion && (
            <MobileBar
              key="bar"
              isLast={isLast}
              sending={status === "sending"}
              onBack={() => go(index - 1)}
              onNext={() => next()}
            />
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}