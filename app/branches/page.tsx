export const dynamic = "force-dynamic";

import Link from "next/link";

export default function BranchesPage() {
  const branches = [
    { id: "electrical", name: "Electrical", color: "text-accent", blurb: "Circuits, signals, power systems, and electronics." },
    { id: "mechanical", name: "Mechanical", color: "text-primary", blurb: "Mechanics, thermodynamics, manufacturing, and design." },
    { id: "computer", name: "Computer (CSE)", color: "text-rose-600", blurb: "Data structures, algorithms, OS, networks, and DBMS." },
    { id: "civil", name: "Civil", color: "text-blue-600", blurb: "Structures, geotech, transportation, and construction." },
    { id: "chemical", name: "Chemical", color: "text-amber-600", blurb: "Process, thermodynamics, transport, and reactors." },
    { id: "ai-ml", name: "AI & ML", color: "text-violet-600", blurb: "Math foundations, ML algorithms, deep learning." },
    { id: "industrial", name: "Industrial", color: "text-green-600", blurb: "Operations research, ergonomics, quality, and supply chain." },
    { id: "materials", name: "Materials", color: "text-fuchsia-600", blurb: "Structure–property, polymers, metals, and characterization." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-5 sm:px-6 py-10">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Engineering Branches</h1>
          <p className="mt-2 text-sm text-muted-foreground">Choose a branch to start practicing.</p>
        </header>

        <section className="space-y-3">
          {branches.map((b) => (
            <div
              key={b.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-border/30 bg-surface px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`rounded-md p-2 bg-muted/5 ${b.color}`}>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="text-sm min-w-0">
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.blurb}</div>
                </div>
              </div>
              <Link href={`/branches/${b.id}`} className="w-full sm:w-auto px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm text-center">
                Enter
              </Link>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}


