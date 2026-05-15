import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, LogOut, Settings, Star, Hourglass } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/circles/session/$id")({
  head: () => ({ meta: [{ title: "Circle Session — Muslim Circles" }] }),
  component: SessionPage,
});

function SessionPage() {
  const { id } = useParams({ from: "/circles/session/$id" });
  const [seconds, setSeconds] = useState(300);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const pct = (seconds / 300) * 100;

  const seats = [
    { n: 1, color: "bg-rose-500" },
    { n: 2, color: "bg-emerald-500" },
    { n: 3, color: "bg-sky-500" },
    { n: 4, color: "bg-rose-500" },
    { n: 5, color: "bg-emerald-500" },
    { n: 6, color: "bg-sky-500" },
    { n: 7, color: "bg-rose-500" },
    { n: 8, color: "bg-sky-500" },
    { n: 9, color: "bg-sky-500" },
    { n: 10, color: "bg-violet-500" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-10">
        <header className="flex items-center justify-between py-3">
          <Link to="/" className="rounded-lg p-2 hover:bg-secondary" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-primary/20 ring-2 ring-primary/30" />
            <span className="text-base font-semibold text-primary">Blue</span>
          </div>
          <button className="rounded-lg p-2 text-destructive hover:bg-secondary" aria-label="Leave">
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        <div className="flex items-center gap-3">
          <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-emerald-600 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <Hourglass className="h-5 w-5 text-amber-500" />
          <span className="font-mono text-sm font-semibold">{mm}:{ss}</span>
        </div>

        <p className="mt-4 text-center text-sm font-semibold">Start circle</p>

        <div className="mt-3 rounded-2xl border-2 border-primary/40 p-3 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-secondary" />
            <div className="flex-1 text-center">
              <p>Ahmed Start with</p>
              <p dir="rtl" className="text-primary">الحمد لله</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-emerald-200" />
            <div className="flex-1 text-center">
              <p className="text-emerald-600">Ahmed started with</p>
              <p dir="rtl" className="text-xs">الحمد لله حمداً كثيراً طيباً مباركاً فيه</p>
            </div>
            <Settings className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <select className="rounded-full border-2 border-primary/40 bg-card px-4 py-2 text-sm outline-none">
            <option>Speaker</option>
          </select>
          <select className="rounded-full border-2 border-primary/40 bg-card px-4 py-2 text-sm outline-none">
            <option>Reciter</option>
          </select>
        </div>

        <div className="mt-3 rounded-xl bg-primary/10 px-3 py-2 text-xs">
          <span className="font-mono text-destructive">05:20</span>{" "}
          <span className="font-semibold">Sara</span> joined the circle{" "}
          <span className="text-primary">9/9</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <ol className="space-y-1 text-sm">
            {[
              ["1st Maged", 200],
              ["2nd Ramy", 100],
              ["3rd Hesham", 50],
              ["4th Ramy", 49],
              ["5th Hesham", 44],
              ["6th Ramy", 37],
              ["7th Hesham", 35],
              ["8th Ramy", 33],
            ].map(([n, s]) => (
              <li key={String(n)} className="flex justify-between">
                <span className="text-destructive">{n}</span>
                <span className="font-semibold">{s}</span>
              </li>
            ))}
          </ol>

          <div className="relative aspect-square">
            <div className="absolute inset-4 rounded-full bg-amber-200 shadow-inner" />
            {seats.map((s, i) => {
              const angle = (i / seats.length) * 2 * Math.PI - Math.PI / 2;
              const r = 45;
              const x = 50 + r * Math.cos(angle);
              const y = 50 + r * Math.sin(angle);
              return (
                <div
                  key={s.n}
                  className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${s.color} text-xs font-bold text-white shadow`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {s.n}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <div className="h-10 w-10 rounded-full bg-amber-200" />
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">Score:</span>
          <span className="ml-auto font-semibold">—</span>
        </div>

        <button className="mt-3 rounded-2xl border-2 border-primary/40 py-3 text-sm font-semibold">
          End Turn
        </button>

        <p className="mt-4 text-center text-xs text-muted-foreground">Circle #{id}</p>
      </div>
    </div>
  );
}