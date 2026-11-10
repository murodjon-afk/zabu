
"use client";

import { useEffect, useState } from "react";

import {
  NATIVE_BY_LEARNING,
  STORAGE_KEY,
  fontVariables,
  type LangId,
  type LearningId,
  type Step,
} from "../components/onboardings/constants";

import { StepLetter, type Script } from "../components/onboardings/StepLetter";
import { Background } from "../components/onboardings/Background";
import { Header } from "../components/onboardings/Header";
import { StepLearn } from "../components/onboardings/StepLearn";
import { StepNative } from "../components/onboardings/StepNative";
import { StepGoal } from "../components/onboardings/StepGoal";
import { StepPassword } from "../components/onboardings/StepPassword";
import StepComplete from "../components/onboardings/StepComplete";

export default function Page() {
  const [step, setStep] = useState<Step>(1);

  const [learning, setLearning] = useState<LearningId>("tajik");
  const [native, setNative] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [script, setScript] = useState<Script | null>(null);

  // Пароль хранится только в памяти
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isTajik = learning === "tajik";
  const isPersian = learning === "persian";
  const hasScript = isTajik || isPersian;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  // Сохранение данных onboarding без пароля
  const persist = (completed: boolean) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          learning,
          native,
          goal,
          script: hasScript ? script : null,
          completed,
        })
      );
    } catch {
      console.warn("Unable to save onboarding data");
    }
  };

  // STEP 1
  const handleSelectLearning = (id: string) => {
    const next = id as LearningId;

    if (!NATIVE_BY_LEARNING[next]) return;

    setLearning(next);
    setScript(null);
    setGoal(null);

    setNative((prev) =>
      prev && NATIVE_BY_LEARNING[next].includes(prev as LangId)
        ? prev
        : null
    );
  };

  const goFromLearn = () => {
    setStep(hasScript ? 2 : 3);
  };

  // STEP 2
  const goFromLetter = (selectedScript: Script) => {
    setScript(selectedScript);
    setStep(3);
  };

  // STEP 3
  const goFromNative = () => {
    const safeNative =
      native && NATIVE_BY_LEARNING[learning]?.includes(native as LangId)
        ? native
        : null;

    if (!safeNative) return;

    setNative(safeNative);
    setStep(4);
  };

  // STEP 4 → STEP 5
  const goFromGoal = () => {
    if (!goal) return;

    persist(false);
    setStep(5);
  };

  // STEP 5 → STEP 6
  const goFromPassword = (pw: string) => {
    setPassword(pw);
    setError(null);
    setStep(6);
  };

  // STEP 6 → завершение
  const finish = () => {
    persist(true);
    setPassword("");
  };

  return (
    <main
      className={`
        ${fontVariables}
        relative flex min-h-[100svh] flex-col
        overflow-clip bg-[#FAFAF7]
        font-[family-name:var(--f-sans)]
        text-[#14231C]
      `}
    >
      <style>{`
        @keyframes zabu-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Background />

      <Header step={step} />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-3 sm:px-8 lg:block lg:px-[72px] lg:pt-4">
        <div
          key={step}
          className="flex flex-1 flex-col justify-center animate-[zabu-in_0.45s_ease_both] motion-reduce:animate-none lg:block"
        >
          {/* STEP 1 */}
          {step === 1 && (
            <StepLearn
              selected={learning}
              onSelect={handleSelectLearning}
              onContinue={goFromLearn}
            />
          )}

          {/* STEP 2 */}
          {step === 2 && hasScript && (
            <StepLetter
              language={isTajik ? "tajik" : "persian"}
              initialValue={script}
              onNext={goFromLetter}
              onBack={() => setStep(1)}
            />
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <StepNative
              learning={learning}
              selected={native}
              onSelect={setNative}
              onBack={() => setStep(hasScript ? 2 : 1)}
              onContinue={goFromNative}
            />
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <StepGoal
              selected={goal}
              onSelect={setGoal}
              onBack={() => setStep(3)}
              onContinue={goFromGoal}
            />
          )}

          {/* STEP 5 — PASSWORD */}
          {step === 5 && (
            <StepPassword
              value={password}
              loading={false}
              onBack={() => setStep(4)}
              onNext={goFromPassword}
            />
          )}

          {/* STEP 6 — REGISTRATION */}
          {step === 6 && (
            <StepComplete
              learning={learning}
              native={native}
              goal={goal}
              script={script}
              password={password}
              onBack={() => setStep(5)}
              onFinish={finish}
            />
          )}
        </div>
      </div>
    </main>
  );
}
