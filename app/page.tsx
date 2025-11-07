// ...existing code...
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight-new";




export default function Home() {
  const branches = [
    { id: "electrical", name: "Electrical", color: "text-accent" },
    { id: "mechanical", name: "Mechanical", color: "text-primary" },
    { id: "computer", name: "Computer", color: "text-rose-600" },
    { id: "civil", name: "Civil", color: "text-sky-600" },
    { id: "chemical", name: "Chemical", color: "text-amber-600" },
    { id: "AI & ML ", name: "AI & ML", color: "text-violet-600" },
    { id: "industrial", name: "Industrial", color: "text-green-600" },
    { id: "materials", name: "Materials", color: "text-fuchsia-600" },
  ];

  const popular = [
    { title: "Signals & Systems", branch: "Electrical", diff: "Medium", attempts: 1240 },
    { title: "Thermodynamics Quick Test", branch: "Mechanical", diff: "Hard", attempts: 880 },
    { title: "Data Structures Basics", branch: "Computer", diff: "Easy", attempts: 1520 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      

      <main className="container mx-auto px-5 sm:px-6 pb-16">
        {/* Hero with subtle spotlight background */}
        <section className="relative overflow-hidden rounded-xl bg-surface text-foreground grid gap-8 md:grid-cols-2 items-center mt-8 border border-border/40">
          <Spotlight />
          <div className="absolute inset-0 pointer-events-none dark:bg-grid-white/[0.02] bg-grid-black/[0.04]" aria-hidden />
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-300">
              Practice smarter across every engineering branch
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Curated, timed quizzes for Electrical, Mechanical, Computer, Civil, Chemical, Aerospace and more — practice targeted questions, track progress, and build mastery for courses and interviews.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
          href="/quizzes"
          className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90"
              >
          Browse Quizzes
              </Link>
              <Link
          href="/branches"
          className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-5 py-3 rounded-md border border-input bg-transparent hover:bg-accent/5"
              >
          Explore Branches
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-md bg-muted/10 px-3 py-2">
          <strong className="text-foreground">800+</strong>
          questions across branches
              </div>
              <div className="inline-flex items-center gap-2 rounded-md bg-muted/10 px-3 py-2">
          <strong className="text-foreground">40+</strong>
          specialized topics
              </div>
              <div className="inline-flex items-center gap-2 rounded-md bg-muted/10 px-3 py-2">
          <strong className="text-foreground">Detailed</strong>
          performance reports
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-md mx-auto hidden sm:block">
            <div className="rounded-2xl bg-gradient-to-br from-primary/8 to-accent/8 p-5 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Featured track</div>
            <div className="text-lg font-semibold">Fundamentals across branches</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Adaptive</div>
            <div className="text-xs text-muted-foreground">20 questions</div>
          </div>
              </div>

              <ol className="mt-4 grid gap-3 text-sm">
          <li className="flex items-center justify-between bg-background/60 p-3 rounded-md">
            <div className="text-sm">Circuit fundamentals (Electrical)</div>
            <div className="text-xs text-muted-foreground">Easy</div>
          </li>
          <li className="flex items-center justify-between bg-background/60 p-3 rounded-md">
            <div className="text-sm">Statics refresher (Civil/Mechanical)</div>
            <div className="text-xs text-muted-foreground">Medium</div>
          </li>
          <li className="flex items-center justify-between bg-background/60 p-3 rounded-md">
            <div className="text-sm">Algorithms quick problems (Computer)</div>
            <div className="text-xs text-muted-foreground">Hard</div>
          </li>
              </ol>

              <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Avg score: 78%</div>
          <Link href="/quizzes" className="text-sm font-medium text-primary hover:underline">
            Try track →
          </Link>
              </div>
            </div>

           {/* decorative SVG */}
{/* 
<svg
  className="absolute -right-8 -bottom-8 opacity-30 h-28 w-28 text-primary"
  viewBox="0 0 100 100"
  fill="none"
  aria-hidden
>
  <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" />
  <path
    d="M25 60 L40 35 L55 60 L70 30"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
*/} 

          </div>
        </section>

        {/* Browse by branch */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Browse by branch</h2>
            <Link href="/branches" className="text-sm text-muted-foreground hover:underline hidden sm:inline">See full list</Link>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {branches.map((b) => (
              <Link
                key={b.id}
                href={`/branches/${b.id}`}
                className="group flex items-center gap-3 rounded-lg border border-border/30 bg-surface px-3 py-3 hover:shadow-md transition"
              >
                <div className={`rounded-md p-2 bg-muted/5 ${b.color} group-hover:scale-105 transition-transform`}>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="text-sm">
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs text-muted-foreground">Topic sets & quizzes</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured topics */}
        <section className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div className="p-5 rounded-lg border border-border/40 bg-surface">
            <h3 className="font-semibold">Core Concepts</h3>
            <p className="mt-2 text-sm text-muted-foreground">Math fundamentals, units, estimation, and problem solving techniques every engineer should master.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs rounded-full bg-muted/10 px-3 py-1">Math</span>
              <span className="text-xs rounded-full bg-muted/10 px-3 py-1">Units</span>
              <span className="text-xs rounded-full bg-muted/10 px-3 py-1">Estimation</span>
            </div>
          </div>

          <div className="p-5 rounded-lg border border-border/40 bg-surface">
            <h3 className="font-semibold">Lab & Design</h3>
            <p className="mt-2 text-sm text-muted-foreground">Practical, application-focused quizzes for labs and design courses across branches.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs rounded-full bg-muted/10 px-3 py-1">Circuits</span>
              <span className="text-xs rounded-full bg-muted/10 px-3 py-1">Mechanics</span>
              <span className="text-xs rounded-full bg-muted/10 px-3 py-1">Signals</span>
            </div>
          </div>

          <div className="p-5 rounded-lg border border-border/40 bg-surface">
            <h3 className="font-semibold">Interview Prep</h3>
            <p className="mt-2 text-sm text-muted-foreground">Short timed sets focused on common interview topics for engineers.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs rounded-full bg-muted/10 px-3 py-1">Algorithms</span>
              <span className="text-xs rounded-full bg-muted/10 px-3 py-1">Design</span>
              <span className="text-xs rounded-full bg-muted/10 px-3 py-1">Rapid problems</span>
            </div>
          </div>
        </section>

        {/* Popular quizzes */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Popular this week</h2>
            <Link href="/quizzes" className="text-sm text-muted-foreground hover:underline">View all</Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((q) => (
              <article key={q.title} className="rounded-xl border border-border/40 bg-surface p-5 flex flex-col justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{q.branch}</div>
                  <h3 className="mt-1 text-lg font-semibold">{q.title}</h3>
                  <div className="mt-2 text-xs text-muted-foreground">Attempts: {q.attempts}</div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="rounded-full px-3 py-1 text-xs bg-muted/10">{q.diff}</div>
                  <Link href="/quizzes" className="inline-flex items-center px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">
                    Start
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 rounded-lg border border-border/30 bg-gradient-to-b from-surface to-background p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-auto">
            <h3 className="text-lg font-semibold">Ready to strengthen your branch fundamentals?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Choose your branch, pick a topic, and practice targeted quizzes crafted for engineering courses.</p>
          </div>
          <div className="flex w-full sm:w-auto gap-3">
            <Link href="/quizzes" className="w-full sm:w-auto px-4 py-2 rounded-md bg-primary text-primary-foreground text-center">Start practicing</Link>
            
          </div>
        </section>
      </main>

      <footer className="border-t border-border/30 mt-12 bg-background">
        <div className="container mx-auto px-5 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} EngiQuiz — Practice for every engineering branch.</div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:underline">Privacy</Link>
            <Link href="/terms" className="text-muted-foreground hover:underline">Terms</Link>
            <Link href="/contact" className="text-muted-foreground hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
// ...existing code...