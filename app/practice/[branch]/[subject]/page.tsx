"use client";

import { use, useEffect, useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import RoleGuard from "@/app/components/auth/RoleGuard";

type Choice = { text: string };
type EditableQuestion = {
  id: string;
  prompt: string;
  choices: Choice[]; // 4 choices
  answerIndex: number; // 0..3
};

function storageKey(branch: string, subject: string): string {
  return `iqp:${branch}:${subject}:questions`;
}

export default function PracticeEditor({ params }: { params: Promise<{ branch: string; subject: string }> }) {
  const { branch, subject } = use(params);
  const title = useMemo(() => subject.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), [subject]);
  const [items, setItems] = useState<EditableQuestion[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(branch, subject));
      if (raw) setItems(JSON.parse(raw));
      else setItems([]);
    } catch {
      setItems([]);
    }
  }, [branch, subject]);

  function addQuestion() {
    const q: EditableQuestion = {
      id: Math.random().toString(36).slice(2),
      prompt: "",
      choices: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
      answerIndex: 0,
    };
    setItems((prev) => [...prev, q]);
  }

  function updatePrompt(id: string, value: string) {
    setItems((prev) => prev.map((q) => (q.id === id ? { ...q, prompt: value } : q)));
  }

  function updateChoice(id: string, idx: number, value: string) {
    setItems((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, choices: q.choices.map((c, i) => (i === idx ? { text: value } : c)) }
          : q
      )
    );
  }

  function setAnswer(id: string, idx: number) {
    setItems((prev) => prev.map((q) => (q.id === id ? { ...q, answerIndex: idx } : q)));
  }

  function removeQuestion(id: string) {
    setItems((prev) => prev.filter((q) => q.id !== id));
  }

  async function save() {
    setSaving(true);
    try {
      localStorage.setItem(storageKey(branch, subject), JSON.stringify(items));
    } finally {
      setSaving(false);
    }
  }

  return (
    <RoleGuard allow={["teacher", "admin"]}>
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-5 sm:px-6 py-10">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{title} — Editor</h1>
              <p className="mt-1 text-sm text-muted-foreground">Add questions with four choices and select the correct answer.</p>
            </div>
            <Link href={`/branches/${branch}`} className="text-sm text-muted-foreground hover:underline">Back</Link>
          </div>
        </header>

        <div className="mb-4 flex items-center gap-2">
          <button onClick={addQuestion} className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">Add question</button>
          <button onClick={save} className="px-3 py-2 rounded-md border border-input text-sm" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
        </div>

        <section className="grid gap-4">
          {items.length === 0 && (
            <div className="rounded-lg border border-border/40 p-4 text-sm text-muted-foreground">No questions yet. Click &quot;Add question&quot; to begin.</div>
          )}
          {items.map((q, qi) => (
            <div key={q.id} className="rounded-lg border border-border/40 bg-surface p-4">
              <div className="flex items-start gap-3">
                <div className="text-sm text-muted-foreground mt-2">{qi + 1}.</div>
                <div className="flex-1">
                  <input
                    value={q.prompt}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updatePrompt(q.id, e.target.value)}
                    placeholder="Enter the question prompt"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  />

                  <div className="mt-3 grid gap-2">
                    {q.choices.map((c, i) => (
                      <label key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`answer-${q.id}`}
                          checked={q.answerIndex === i}
                          onChange={() => setAnswer(q.id, i)}
                          className="h-4 w-4"
                        />
                        <input
                          value={c.text}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateChoice(q.id, i, e.target.value)}
                          placeholder={`Choice ${i + 1}`}
                          className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Select the correct answer above.</div>
                    <button onClick={() => removeQuestion(q.id)} className="text-xs text-muted-foreground hover:underline">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
    </RoleGuard>
  );
}



