import { createFileRoute, Link, useParams, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Bell, PartyPopper, Pencil, Star } from "lucide-react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";

const searchSchema = z.object({
  type: fallback(z.enum(["quran", "tasbeeh", "adhkar"]), "quran").default("quran"),
  name: fallback(z.string(), "Circle").default("Circle"),
});

export const Route = createFileRoute("/circles/published/$code")({
  head: () => ({ meta: [{ title: "Circle Published — Muslim Circles" }] }),
  validateSearch: zodValidator(searchSchema),
  component: PublishedPage,
});

function PublishedPage() {
  const { code } = useParams({ from: "/circles/published/$code" });
  const { name } = useSearch({ from: "/circles/published/$code" });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <header className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="rounded-lg p-2 hover:bg-secondary" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-secondary ring-2 ring-primary/30" />
            <span className="text-sm font-medium">Mohamed Ahmed</span>
          </div>
          <button className="rounded-lg p-2 hover:bg-secondary" aria-label="Notifications">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </button>
        </header>

        <main className="flex-1 px-4 pb-10">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-lg font-bold">Congratulations!</p>
                <p className="text-sm text-muted-foreground">Your circle is now published</p>
              </div>
              <PartyPopper className="h-7 w-7 text-emerald-500" />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 ring-2 ring-primary/30" />
                <p dir="rtl" className="text-sm">{name}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-2 text-white">
                <Pencil className="h-4 w-4" />
                <div className="text-left text-xs leading-tight">
                  <p>Circle code</p>
                  <p className="font-mono text-sm font-semibold">{code}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="rounded-full border border-primary px-3 py-2 text-sm font-medium text-primary">
              Invite Friends
            </button>
            <button className="rounded-full bg-emerald-500 px-3 py-2 text-sm font-medium text-white">
              Online Published
            </button>
          </div>

          <ul className="mt-5 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <div className="h-10 w-10 rounded-full bg-primary/20" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">User {i + 1}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    4.5 (200)
                  </p>
                </div>
                <button className="rounded-full border border-primary px-4 py-1.5 text-xs font-medium text-primary">
                  Invite
                </button>
              </li>
            ))}
          </ul>

          <Link
            to="/circles/session/$id"
            params={{ id: code }}
            className="mt-6 block rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground"
          >
            Start Circle
          </Link>
        </main>
      </div>
    </div>
  );
}