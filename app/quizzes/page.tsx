"use client";

import { useMemo, useState, type ReactElement } from "react";

type Question = {
  q: string;
  options: string[];
  a: number; // index of correct option
};

const EASY: Question[] = [
  { q: "Capital of India?", options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], a: 1 },
  { q: "How many continents are there?", options: ["5", "6", "7", "8"], a: 2 },
  { q: "Largest planet?", options: ["Earth", "Jupiter", "Saturn", "Mars"], a: 1 },
  { q: "H2O is the chemical formula for?", options: ["Hydrogen", "Oxygen", "Water", "Helium"], a: 2 },
  { q: "National animal of India?", options: ["Peacock", "Lion", "Tiger", "Elephant"], a: 2 },
  { q: "Fastest land animal?", options: ["Cheetah", "Horse", "Lion", "Gazelle"], a: 0 },
  { q: "Primary colors include red, blue and?", options: ["Green", "Yellow", "Black", "White"], a: 1 },
  { q: "Smallest prime number?", options: ["0", "1", "2", "3"], a: 2 },
  { q: "Sun rises in the?", options: ["North", "South", "East", "West"], a: 2 },
  { q: "How many days in a leap year?", options: ["365", "366", "367", "364"], a: 1 },
];

const MEDIUM: Question[] = [
  { q: "Who wrote 'Romeo and Juliet'?", options: ["Leo Tolstoy", "William Shakespeare", "Mark Twain", "Charles Dickens"], a: 1 },
  { q: "The Great Barrier Reef is in which country?", options: ["USA", "Australia", "South Africa", "Brazil"], a: 1 },
  { q: "The SI unit of force is?", options: ["Pascal", "Newton", "Joule", "Watt"], a: 1 },
  { q: "Which gas is most abundant in Earth's atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Argon"], a: 1 },
  { q: "Which metal is liquid at room temperature?", options: ["Mercury", "Sodium", "Aluminium", "Lithium"], a: 0 },
  { q: "Which river is the longest in the world?", options: ["Nile", "Amazon", "Yangtze", "Mississippi"], a: 0 },
  { q: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"], a: 1 },
  { q: "What is the square root of 144?", options: ["10", "11", "12", "13"], a: 2 },
  { q: "Which country hosted the 2016 Summer Olympics?", options: ["China", "UK", "Brazil", "Japan"], a: 2 },
  { q: "Which organ purifies blood in humans?", options: ["Liver", "Lungs", "Heart", "Kidneys"], a: 3 },
];

const HARD: Question[] = [
  { q: "First woman to win a Nobel Prize?", options: ["Marie Curie", "Rosalind Franklin", "Ada Lovelace", "Lise Meitner"], a: 0 },
  { q: "Heaviest naturally occurring element by atomic weight?", options: ["Uranium", "Plutonium", "Osmium", "Lead"], a: 0 },
  { q: "Which planet has the fastest rotation?", options: ["Jupiter", "Saturn", "Neptune", "Uranus"], a: 0 },
  { q: "Year of the French Revolution?", options: ["1776", "1789", "1812", "1848"], a: 1 },
  { q: "DNA stands for?", options: ["Deoxyribonucleic Acid", "Deoxyribose Nucleic Acid", "Dioxyribonucleic Acid", "Deoxynucleic Acid"], a: 0 },
  { q: "Which mathematician proved Fermat's Last Theorem?", options: ["Andrew Wiles", "Grigori Perelman", "Terence Tao", "Kurt Gödel"], a: 0 },
  { q: "Capital of Kazakhstan?", options: ["Astana", "Almaty", "Tashkent", "Bishkek"], a: 0 },
  { q: "Author of 'The Origin of Species'?", options: ["Gregor Mendel", "Charles Darwin", "Alfred Wallace", "Thomas Huxley"], a: 1 },
  { q: "Avogadro's number is approximately?", options: ["3.14×10^7", "6.02×10^23", "9.81 m/s^2", "1.60×10^-19 C"], a: 1 },
  { q: "Which language family does Hungarian belong to?", options: ["Indo-European", "Uralic", "Altaic", "Semitic"], a: 1 },
];

type LevelKey = "simple" | "medium" | "hard";

export default function QuizzesPage(): ReactElement {
  const [active, setActive] = useState<LevelKey | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const questions = useMemo<Question[]>(() => {
    if (active === "simple") return EASY;
    if (active === "medium") return MEDIUM;
    if (active === "hard") return HARD;
    return [];
  }, [active]);

  function start(level: LevelKey) {
    setActive(level);
    setIndex(0);
    setAnswers(Array(10).fill(-1));
    setShowResults(false);
  }

  function selectOption(optionIndex: number) {
    const next = [...answers];
    next[index] = optionIndex;
    setAnswers(next);
  }

  function nextQuestion() {
    if (index < questions.length - 1) setIndex(index + 1);
    else setShowResults(true);
  }

  function prevQuestion() {
    if (index > 0) setIndex(index - 1);
  }

  function quit() {
    setActive(null);
    setIndex(0);
    setAnswers([]);
    setShowResults(false);
  }

  function score(): number {
    return questions.reduce((s, q, i) => (answers[i] === q.a ? s + 1 : s), 0);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-5 sm:px-6 py-10">
        {!active && (
          <>
            <header className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold">Quizzes</h1>
              <p className="mt-2 text-sm text-muted-foreground">Pick a general knowledge level to get started.</p>
            </header>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-xl border border-border/40 bg-surface p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">General Knowledge</div>
                  <h2 className="mt-1 text-lg font-semibold">Simple</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Quick GK warm-up. 10 easy questions.</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full px-3 py-1 text-xs bg-muted/10">Easy</span>
                  <button onClick={() => start("simple")} className="inline-flex items-center px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">Start</button>
                </div>
              </article>
              <article className="rounded-xl border border-border/40 bg-surface p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">General Knowledge</div>
                  <h2 className="mt-1 text-lg font-semibold">Medium</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Balanced GK set. 10 questions.</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full px-3 py-1 text-xs bg-muted/10">Medium</span>
                  <button onClick={() => start("medium")} className="inline-flex items-center px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">Start</button>
                </div>
              </article>
              <article className="rounded-xl border border-border/40 bg-surface p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">General Knowledge</div>
                  <h2 className="mt-1 text-lg font-semibold">Hard</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Challenging GK. 10 timed-style questions.</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full px-3 py-1 text-xs bg-muted/10">Hard</span>
                  <button onClick={() => start("hard")} className="inline-flex items-center px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">Start</button>
                </div>
              </article>
            </section>
          </>
        )}

        {active && !showResults && (
          <section className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">Level: <span className="font-medium capitalize">{active}</span></div>
              <div className="text-sm">Question {index + 1} / {questions.length}</div>
            </div>

            <div className="rounded-xl border border-border/40 bg-surface p-5">
              <h2 className="text-lg font-semibold">{questions[index].q}</h2>
              <div className="mt-4 grid gap-2">
                {questions[index].options.map((opt, i) => {
                  const selected = answers[index] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => selectOption(i)}
                      className={`text-left px-4 py-3 rounded-md border transition ${selected ? "border-primary bg-primary/10" : "border-border/40 hover:bg-accent/5"}`}
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <button onClick={quit} className="text-sm text-muted-foreground hover:underline">Quit</button>
                <div className="flex items-center gap-2">
                  <button onClick={prevQuestion} disabled={index === 0} className="px-3 py-2 rounded-md border border-input text-sm disabled:opacity-50">Back</button>
                  <button onClick={nextQuestion} className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">
                    {index === questions.length - 1 ? "Submit" : "Next"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {active && showResults && (
          <section className="max-w-2xl mx-auto">
            <div className="rounded-xl border border-border/40 bg-surface p-6">
              <h2 className="text-xl font-bold">Your results</h2>
              <p className="mt-2 text-sm text-muted-foreground">Level: <span className="capitalize">{active}</span></p>
              <div className="mt-4 text-lg">Score: <span className="font-semibold">{score()} / {questions.length}</span></div>

              <div className="mt-6 grid gap-3">
                {questions.map((q, i) => (
                  <div key={i} className="rounded-lg border border-border/40 p-3 text-sm">
                    <div className="font-medium">{i + 1}. {q.q}</div>
                    <div className="mt-1">Your answer: {answers[i] >= 0 ? q.options[answers[i]] : "—"}</div>
                    <div className="text-muted-foreground">Correct: {q.options[q.a]}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button onClick={() => start(active)} className="px-3 py-2 rounded-md border border-input text-sm">Retry</button>
                <button onClick={quit} className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">Back to levels</button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}


