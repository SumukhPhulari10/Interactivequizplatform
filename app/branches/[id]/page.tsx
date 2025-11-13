"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { use, useMemo, useState } from "react";

type YearKey = "1st" | "2nd" | "3rd" | "BTech";

const SUBJECTS: Record<string, Record<YearKey, string[]>> = {
  electrical: {
    "1st": ["Engineering Math I", "Physics", "Basic Electrical"],
    "2nd": ["Circuits", "Signals & Systems", "Electromagnetics"],
    "3rd": ["Power Systems", "Control Systems", "Analog & Digital"],
    BTech: ["Power Electronics", "Communication", "Electrical Machines"],
  },
  mechanical: {
    "1st": ["Engineering Math I", "Graphics", "Workshop"],
    "2nd": ["Mechanics of Materials", "Thermodynamics", "Fluid Mechanics"],
    "3rd": ["Dynamics", "Manufacturing", "Heat Transfer"],
    BTech: ["Design", "IC Engines", "Robotics Basics"],
  },
  computer: {
    "1st": ["Programming Basics", "Discrete Math", "Digital Logic"],
    "2nd": ["Data Structures", "Computer Organization", "DBMS"],
    "3rd": ["Algorithms", "Operating Systems", "Computer Networks"],
    BTech: ["Distributed Systems", "AI Basics", "Cloud & DevOps"],
  },
  civil: {
    "1st": ["Engineering Math I", "Surveying Basics", "Materials"],
    "2nd": ["Strength of Materials", "Fluid Mechanics", "Surveying"],
    "3rd": ["Structural Analysis", "Geotechnical", "Transportation"],
    BTech: ["Steel & RCC Design", "Water Resources", "Construction Mgmt"],
  },
  chemical: {
    "1st": ["Chemistry", "Engineering Math I", "Basics of Chem Engg"],
    "2nd": ["Thermodynamics", "Fluid & Heat Transfer", "Mass Transfer"],
    "3rd": ["Reaction Engineering", "Process Control", "Numerical Methods"],
    BTech: ["Process Design", "Plant Safety", "Biochemical Engineering"],
  },
  "ai-ml": {
    "1st": ["Math for AI", "Python Basics", "Probability"],
    "2nd": ["Linear Algebra", "Statistics", "Data Wrangling"],
    "3rd": ["Machine Learning", "Deep Learning", "NLP Basics"],
    BTech: ["Computer Vision", "MLOps Intro", "Reinforcement Learning"],
  },
  industrial: {
    "1st": ["Engineering Math I", "Basics of IE", "Economics"],
    "2nd": ["Work Study", "OR Basics", "Quality"],
    "3rd": ["Supply Chain", "Simulation", "Ergonomics"],
    BTech: ["Advanced OR", "Project Mgmt", "Lean Systems"],
  },
  materials: {
    "1st": ["Chemistry", "Physics", "Engineering Math I"],
    "2nd": ["Structure of Materials", "Thermodynamics", "Diffusion"],
    "3rd": ["Polymers", "Metallurgy", "Characterization"],
    BTech: ["Composites", "Nanomaterials", "Failure Analysis"],
  },
};

function toTitle(id: string): string {
  return id
    .replace("ai-ml", "AI & ML")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/-/g, " ");
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BranchDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id: branchId } = use(params);
  const title = toTitle(branchId);
  const years: YearKey[] = ["1st", "2nd", "3rd", "BTech"];
  const [year, setYear] = useState<YearKey>("1st");
  const subjects = useMemo(() => SUBJECTS[branchId]?.[year] ?? [], [branchId, year]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-5 sm:px-6 py-10">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
            <Link href="/branches" className="text-sm text-muted-foreground hover:underline">Back</Link>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Select your year to view subjects.</p>
        </header>

        <section className="rounded-xl border border-border/40 bg-surface p-4">
          <div className="flex flex-wrap gap-2">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-3 py-2 rounded-md text-sm border ${year === y ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent/5"}`}
              >
                {y === "BTech" ? "BTech" : y}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {subjects.length === 0 && (
              <div className="text-sm text-muted-foreground">No subjects listed yet for this year.</div>
            )}
            {subjects.map((s, i) => (
              <div key={i} className="rounded-lg border border-border/40 p-3 flex items-center justify-between">
                <div className="text-sm font-medium">{s}</div>
                <Link href={`/practice/${branchId}/${toSlug(s)}`} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs">Practice</Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}


