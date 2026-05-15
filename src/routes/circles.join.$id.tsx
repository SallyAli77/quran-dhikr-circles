import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { X, Star } from "lucide-react";

export const Route = createFileRoute("/circles/join/$id")({
  head: () => ({ meta: [{ title: "Join a Circle — Muslim Circles" }] }),
  component: JoinPage,
});

function JoinPage() {
  const { id } = useParams({ from: "/circles/join/$id" });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-10">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive text-destructive-foreground" aria-label="Close">
            <X className="h-5 w-5" />
          </Link>
          <div className="flex -space-x-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 w-9 rounded-full bg-primary/20 ring-2 ring-background" />
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <div className="relative h-32 w-32 rounded-full bg-primary/10 ring-4 ring-primary/30">
            <div className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</div>
            <div className="absolute right-2 top-4 h-8 w-8 rounded-full bg-emerald-300 ring-2 ring-background" />
            <div className="absolute -right-1 bottom-4 h-7 w-7 rounded-full bg-rose-200 ring-2 ring-background" />
          </div>
        </div>

        <h1 dir="rtl" className="mt-6 text-center text-2xl font-bold">سورة البقرة</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Joining <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
          <span className="ml-1 inline-block h-2 w-2 rounded-full bg-emerald-500 align-middle" />
        </p>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm">
          <Row label="Sura" value="البقرة" />
          <Row label="From" value="1" />
          <Row label="Number of Members" value="9" />
          <Row label="Circle Code" value={id.toUpperCase()} />
        </div>

        <ul className="mt-4 flex-1 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5">
              <div className="h-9 w-9 rounded-full bg-rose-200" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Name</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> Score
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-secondary" />
              <button className="rounded-full border border-primary px-4 py-1 text-xs font-medium text-primary">
                Follow
              </button>
            </li>
          ))}
        </ul>

        <Link
          to="/circles/session/$id"
          params={{ id }}
          className="mt-4 block rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground"
        >
          Join Circle
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-1.5 last:border-0">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}