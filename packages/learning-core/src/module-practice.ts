export interface PracticeItem {
  options: string[];
  answer: number;
}
export const PRACTICE_MODEL_VERSION = 1;
export function evaluatePractice(items: PracticeItem[], checkpoint: Record<string, unknown>) {
  let answers: number[] = items.map(() => -1);
  if (
    checkpoint.modelVersion === PRACTICE_MODEL_VERSION &&
    checkpoint.practiceVersion === 1 &&
    typeof checkpoint.answers === 'string' &&
    checkpoint.answers.length <= 2000
  ) {
    try {
      const parsed: unknown = JSON.parse(checkpoint.answers);
      if (
        Array.isArray(parsed) &&
        parsed.length === items.length &&
        parsed.every(
          (answer: unknown, i: number) =>
            typeof answer === 'number' &&
            Number.isInteger(answer) &&
            answer >= -1 &&
            answer < items[i]!.options.length,
        )
      )
        answers = [...parsed] as number[];
    } catch {
      /* Invalid saved answers start a new practice; no imported score is trusted. */
    }
  }
  const correct = items.map((item, i) => answers[i] === item.answer);
  const passed = items.length > 0 && correct.every(Boolean);
  return {
    answers,
    correct,
    answered: answers.filter((a) => a >= 0).length,
    score: correct.filter(Boolean).length,
    total: items.length,
    passed,
    ready: passed && checkpoint.checked === true,
  };
}
