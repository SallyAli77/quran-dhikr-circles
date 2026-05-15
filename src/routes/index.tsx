import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Menu,
  LogOut,
  Home,
  Users,
  Plus,
  MessageSquare,
  User,
  BookOpen,
  Hand,
  Sparkles,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muslim Circles — Join or Create a Circle" },
      {
        name: "description",
        content:
          "Join or create circles for Quran memorization, Adhkar and Tasbeeh, or join as a teacher.",
      },
    ],
  }),
  component: Index,
});

type CircleType = "quran" | "adhkar" | "tasbeeh";

const circleMeta: Record<
  CircleType,
  { title: string; arabic: string; icon: typeof BookOpen; tone: string; ring: string }
> = {
  quran: {
    title: "Memorize Quran",
    arabic: "تسميع قرآن",
    icon: BookOpen,
    tone: "bg-primary/10 text-primary",
    ring: "ring-primary/30",
  },
  adhkar: {
    title: "Adhkar",
    arabic: "أذكار",
    icon: Sparkles,
    tone: "bg-accent/15 text-accent-foreground",
    ring: "ring-accent/40",
  },
  tasbeeh: {
    title: "Tasbeeh",
    arabic: "تسبيح",
    icon: Hand,
    tone: "bg-emerald-100 text-emerald-700",
    ring: "ring-emerald-200",
  },
};

function Index() {
  const [tab, setTab] = useState<"home" | "circles" | "create" | "chat" | "profile">("home");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <Header />
        <main className="flex-1 space-y-6 px-4 pb-28 pt-4">
          {tab === "home" && <HomeView />}
          {tab === "circles" && <BrowseView />}
          {tab === "create" && <CreateView />}
          {tab === "chat" && <PlaceholderView title="Messages" />}
          {tab === "profile" && <PlaceholderView title="Profile" />}
        </main>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur">
      <button className="rounded-lg p-2 text-primary hover:bg-secondary" aria-label="Menu">
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-base font-semibold tracking-tight">Muslim Circles</h1>
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary ring-2 ring-primary/20">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
        <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary" aria-label="Sign out">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function HomeView() {
  return (
    <>
      <CategoryStrip />
      <SectionDivider label="Create a Circle" />
      <div className="grid grid-cols-2 gap-3">
        <CreateCard type="quran" description="Take a quick quiz before creating the circle." />
        <CreateCard type="tasbeeh" description="Encourage others to make Tasbeeh together." />
        <CreateCard type="adhkar" description="Daily morning and evening Adhkar circle." />
        <TeacherCard />
      </div>

      <SectionDivider label="or Join one" />

      <CircleRow title="New Tasbeeh Circles" type="tasbeeh" />
      <CircleRow title="New Memorize Quran Circles" type="quran" />
      <CircleRow title="New Adhkar Circles" type="adhkar" />
    </>
  );
}

function CategoryStrip() {
  const items: { type: CircleType; label: string }[] = [
    { type: "quran", label: "Quran Kareem" },
    { type: "tasbeeh", label: "Begin Tasbeeh" },
    { type: "adhkar", label: "Daily Adhkar" },
  ];
  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
      {items.map((it) => {
        const m = circleMeta[it.type];
        const Icon = m.icon;
        return (
          <button
            key={it.type}
            className="flex min-w-[150px] items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-full ring-2 ${m.ring} ${m.tone}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">{m.arabic}</p>
              <p className="text-sm font-medium leading-tight">{it.label}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="rounded-full bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground shadow-sm">
      ──── {label} ────
    </div>
  );
}

function CreateCard({ type, description }: { type: CircleType; description: string }) {
  const m = circleMeta[type];
  const Icon = m.icon;
  return (
    <div className="relative rounded-3xl border border-border bg-card p-4 pt-10 text-center shadow-sm">
      <div
        className={`absolute -top-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full ring-4 ring-background ${m.tone}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-xs text-muted-foreground">Create a circle</p>
      <p className="mt-0.5 text-base font-semibold text-primary">{m.title}</p>
      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{description}</p>
      <Link
        to="/circles/create/$type"
        params={{ type }}
        className="mt-3 inline-block w-full rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90"
      >
        Start
      </Link>
    </div>
  );
}

function TeacherCard() {
  return (
    <div className="relative rounded-3xl border border-border bg-card p-4 pt-10 text-center shadow-sm">
      <div className="absolute -top-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-4 ring-background">
        <GraduationCap className="h-6 w-6" />
      </div>
      <p className="text-xs text-muted-foreground">Join as a</p>
      <p className="mt-0.5 text-base font-semibold text-emerald-700">Teacher</p>
      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
        Guide students through Quran, Adhkar or Tasbeeh.
      </p>
      <button className="mt-3 w-full rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90">
        Apply
      </button>
    </div>
  );
}

function CircleRow({ title, type }: { title: string; type: CircleType }) {
  const m = circleMeta[type];
  const Icon = m.icon;
  const items = Array.from({ length: 6 });
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        {type === "quran" ? (
          <Link to="/circles/quran" className="flex items-center gap-0.5 text-xs font-medium text-primary">
            see all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <button className="flex items-center gap-0.5 text-xs font-medium text-primary">
            see all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {items.map((_, i) => (
          <Link
            key={i}
            to="/circles/join/$id"
            params={{ id: `${type}-${i + 1}` }}
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ring-2 ${m.ring} ${m.tone} shadow-sm transition hover:scale-105`}
            aria-label={`${title} ${i + 1}`}
          >
            <Icon className="h-7 w-7" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function BrowseView() {
  return (
    <>
      <CircleRow title="New Tasbeeh Circles" type="tasbeeh" />
      <CircleRow title="New Memorize Quran Circles" type="quran" />
      <CircleRow title="New Adhkar Circles" type="adhkar" />
    </>
  );
}

function CreateView() {
  return (
    <>
      <SectionDivider label="Create a Circle" />
      <div className="grid grid-cols-2 gap-3">
        <CreateCard type="quran" description="Take a quick quiz before creating the circle." />
        <CreateCard type="tasbeeh" description="Encourage others to make Tasbeeh together." />
        <CreateCard type="adhkar" description="Daily morning and evening Adhkar circle." />
        <TeacherCard />
      </div>
    </>
  );
}

function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">Coming soon, in shaa Allah.</p>
    </div>
  );
}

function BottomNav({
  tab,
  setTab,
}: {
  tab: string;
  setTab: (t: "home" | "circles" | "create" | "chat" | "profile") => void;
}) {
  const items = [
    { id: "home" as const, icon: Home, label: "Home" },
    { id: "circles" as const, icon: Users, label: "Circles" },
    { id: "create" as const, icon: Plus, label: "Create" },
    { id: "chat" as const, icon: MessageSquare, label: "Chat" },
    { id: "profile" as const, icon: User, label: "Me" },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto max-w-md border-t border-border bg-card/95 px-2 pb-3 pt-2 backdrop-blur">
        <div className="flex items-end justify-between">
          {items.map((it) => {
            const Icon = it.icon;
            const active = tab === it.id;
            const isCenter = it.id === "create";
            if (isCenter) {
              return (
                <button
                  key={it.id}
                  onClick={() => setTab(it.id)}
                  className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background"
                  aria-label={it.label}
                >
                  <Icon className="h-6 w-6" />
                </button>
              );
            }
            return (
              <button
                key={it.id}
                onClick={() => setTab(it.id)}
                className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-xs ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{it.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
