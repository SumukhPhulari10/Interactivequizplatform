"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState, type ReactElement } from "react";
import { getSupabase } from "@/lib/supabaseBrowser";

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

// Engineering fields mix: Mechanical, Civil, Electrical, CS, etc.
const ENG_EASY: Question[] = [
  { q: "In mechanics, unit of force?", options: ["Joule", "Newton", "Pascal", "Watt"], a: 1 },
  { q: "Concrete primarily gains strength due to?", options: ["Hydration", "Oxidation", "Combustion", "Fermentation"], a: 0 },
  { q: "Binary of decimal 5?", options: ["100", "101", "110", "111"], a: 1 },
  { q: "Ohm's law relates V, I and?", options: ["Capacitance", "Resistance", "Inductance", "Power"], a: 1 },
  { q: "Which CAD term means removing material?", options: ["Extrude", "Chamfer", "Fillet", "Cut"], a: 3 },
  { q: "Basic logic gate that outputs 1 only if all inputs are 1?", options: ["OR", "XOR", "AND", "NAND"], a: 2 },
  { q: "Beam that is fixed at one end?", options: ["Simply supported", "Cantilever", "Overhanging", "Continuous"], a: 1 },
  { q: "CPU stands for?", options: ["Central Processing Unit", "Central Program Unit", "Compute Process Unit", "Control Program Unit"], a: 0 },
  { q: "Unit of electric power?", options: ["Joule", "Watt", "Volt", "Ampere"], a: 1 },
  { q: "Material property: resistance to scratching?", options: ["Ductility", "Hardness", "Toughness", "Elasticity"], a: 1 },
];

const ENG_MEDIUM: Question[] = [
  { q: "Reynolds number helps predict?", options: ["Flow regime", "Heat transfer area", "Pipe diameter", "Phase change"], a: 0 },
  { q: "Which test measures concrete compressive strength?", options: ["Slump test", "Cube test", "Rebound hammer", "Core cutter"], a: 1 },
  { q: "Time complexity of binary search (sorted array)?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], a: 1 },
  { q: "Diode primarily allows current to flow in?", options: ["Both directions", "Forward bias", "Reverse bias", "Alternately"], a: 1 },
  { q: "Euler's formula in columns relates load to?", options: ["Length", "Area", "Density", "Poisson's ratio"], a: 0 },
  { q: "Normalized database reduces?", options: ["Redundancy", "Indexes", "Queries", "Transactions"], a: 0 },
  { q: "Shear force is max at?", options: ["Free end", "Supports", "Mid-span", "Anywhere"], a: 1 },
  { q: "Nyquist rate relates to?", options: ["Sampling", "Modulation", "Amplification", "Rectification"], a: 0 },
  { q: "PID controller 'I' term reduces?", options: ["Overshoot", "Steady-state error", "Rise time", "Bandwidth"], a: 1 },
  { q: "HTTP status for 'Not Found'?", options: ["200", "301", "404", "500"], a: 2 },
];

const ENG_HARD: Question[] = [
  { q: "For a simply supported beam with UDL, max bending moment at?", options: ["Supports", "Quarter span", "Mid-span", "Near free end"], a: 2 },
  { q: "Zener diode operates in?", options: ["Forward conduction", "Breakdown region", "Cut-off", "Saturation"], a: 1 },
  { q: "AVL tree rotation ensures?", options: ["Heap property", "Balance factor bounds", "Topological order", "Shortest path"], a: 1 },
  { q: "Bernoulli equation assumes?", options: ["Compressible viscous flow", "Incompressible inviscid steady flow", "Unsteady flow", "Rotational flow"], a: 1 },
  { q: "Slenderness ratio is?", options: ["Area/Length", "Length/Radius of gyration", "Stress/Strain", "Load/Area"], a: 1 },
  { q: "Maximum power transfer when load resistance equals?", options: ["0", "Infinite", "Source resistance", "Twice source resistance"], a: 2 },
  { q: "Page replacement algorithm that uses counter for recency?", options: ["FIFO", "LRU", "LFU", "Clock"], a: 1 },
  { q: "Fourier transform converts time domain to?", options: ["Space", "Frequency", "Probability", "Impulse"], a: 1 },
  { q: "Mohr's circle is used for?", options: ["Thermal analysis", "Stress transformation", "Fluid statics", "Soil bearing"], a: 1 },
  { q: "SVM uses which concept for classification?", options: ["Decision tree", "Hyperplane margin maximization", "Entropy minimization", "Random walk"], a: 1 },
];

type LevelKey = "simple" | "medium" | "hard" | "eng_easy" | "eng_medium" | "eng_hard";

const QUESTION_BANKS: Record<LevelKey, Question[]> = {
  simple: EASY,
  medium: MEDIUM,
  hard: HARD,
  eng_easy: ENG_EASY,
  eng_medium: ENG_MEDIUM,
  eng_hard: ENG_HARD,
};

export default function QuizzesPage(): ReactElement {
  const supabase = getSupabase();
  const [active, setActive] = useState<LevelKey | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUserId(data?.user?.id ?? null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setUserId(data?.user?.id ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const questions = useMemo<Question[]>(() => {
    return active ? QUESTION_BANKS[active] : [];
  }, [active]);

  function start(level: LevelKey) {
    setActive(level);
    setIndex(0);
    setAnswers(Array(QUESTION_BANKS[level].length).fill(-1));
    setShowResults(false);
    // Log start
    if (userId) {
      supabase
        .from("activity_log")
        .insert({ user_id: userId, action: `Started quiz: ${level}` })
        .then(() => {}, () => {});
    }
  }

  function selectOption(optionIndex: number) {
    const next = [...answers];
    next[index] = optionIndex;
    setAnswers(next);
  }

  function nextQuestion() {
    if (index < questions.length - 1) setIndex(index + 1);
    else {
      setShowResults(true);
      // Log completion
      if (userId && active) {
        const sc = questions.reduce((s, q, i) => (answers[i] === q.a ? s + 1 : s), 0);
        supabase
          .from("activity_log")
          .insert({ user_id: userId, action: `Completed quiz: ${active} (score ${sc}/${questions.length})` })
          .then(() => {}, () => {});
      }
    }
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
              <p className="mt-2 text-sm text-muted-foreground">Pick a set to start practicing.</p>
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
              <article className="rounded-xl border border-border/40 bg-surface p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Engineering Fields Mix</div>
                  <h2 className="mt-1 text-lg font-semibold">Engineering Mix — Easy</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Basics across Mechanical, Civil, Electrical, CS. 10 questions.</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full px-3 py-1 text-xs bg-muted/10">Easy</span>
                  <button onClick={() => start("eng_easy")} className="inline-flex items-center px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">Start</button>
                </div>
              </article>
              <article className="rounded-xl border border-border/40 bg-surface p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Engineering Fields Mix</div>
                  <h2 className="mt-1 text-lg font-semibold">Engineering Mix — Medium</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Core concepts mixed set. 10 questions.</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full px-3 py-1 text-xs bg-muted/10">Medium</span>
                  <button onClick={() => start("eng_medium")} className="inline-flex items-center px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">Start</button>
                </div>
              </article>
              <article className="rounded-xl border border-border/40 bg-surface p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Engineering Fields Mix</div>
                  <h2 className="mt-1 text-lg font-semibold">Engineering Mix — Hard</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Advanced, exam-style problems. 10 questions.</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full px-3 py-1 text-xs bg-muted/10">Hard</span>
                  <button onClick={() => start("eng_hard")} className="inline-flex items-center px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">Start</button>
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


