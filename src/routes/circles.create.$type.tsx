import { createFileRoute, Link, useNavigate, useParams, notFound } from "@tanstack/react-router";
import { ArrowLeft, Bell } from "lucide-react";
import { useMemo, useState } from "react";

type CircleType = "quran" | "tasbeeh" | "adhkar";

const META: Record<CircleType, { title: string; arabic: string }> = {
  quran: { title: "Memorize Quran", arabic: "تسميع قرآن" },
  tasbeeh: { title: "Tasbeeh", arabic: "تسبيح" },
  adhkar: { title: "Adhkar", arabic: "أذكار" },
};

const TASBEEH_OPTIONS = [
  "أستغفر الله العظيم",
  "سبحان الله وبحمده",
  "لا إله إلا الله",
  "الحمد لله",
  "الله أكبر",
];

const ADHKAR_OPTIONS = ["أذكار الصباح", "أذكار المساء", "أذكار النوم", "أذكار بعد الصلاة"];

function genCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

export const Route = createFileRoute("/circles/create/$type")({
  head: () => ({
    meta: [{ title: "Create a Circle — Muslim Circles" }],
  }),
  beforeLoad: ({ params }) => {
    if (!["quran", "tasbeeh", "adhkar"].includes(params.type)) throw notFound();
  },
  component: CreateCirclePage,
});

function CreateCirclePage() {
  const { type } = useParams({ from: "/circles/create/$type" }) as { type: CircleType };
  const navigate = useNavigate();
  const meta = META[type];
  const code = useMemo(genCode, []);

  const [name, setName] = useState("");
  const [members, setMembers] = useState(5);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(7);
  const [tasbeeh, setTasbeeh] = useState(TASBEEH_OPTIONS[0]);
  const [tasbeehCustom, setTasbeehCustom] = useState("");
  const [adhkarKind, setAdhkarKind] = useState(ADHKAR_OPTIONS[0]);
  const [sura, setSura] = useState("الفاتحة");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/circles/published/$code", params: { code }, search: { type, name: name || meta.title } });
  }

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
          <form
            onSubmit={submit}
            className="rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">Create a Circle</p>
            <h1 className="mt-1 text-2xl font-bold text-primary">{meta.title}</h1>

            <div className="mt-5 space-y-4">
              {type === "quran" && (
                <>
                  <Field label="Sura">
                    <select
                      value={sura}
                      onChange={(e) => setSura(e.target.value)}
                      className="w-full bg-transparent text-right text-sm outline-none"
                      dir="rtl"
                    >
                      {["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">From</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        value={from}
                        onChange={(e) => setFrom(+e.target.value)}
                        className="w-12 border-b border-border bg-transparent text-center text-primary outline-none"
                      />
                      <span className="text-muted-foreground">To</span>
                      <input
                        type="number"
                        min={from}
                        value={to}
                        onChange={(e) => setTo(+e.target.value)}
                        className="w-12 border-b border-border bg-transparent text-center text-primary outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {type === "tasbeeh" && (
                <>
                  <Field label="Tasbeeh">
                    <select
                      value={tasbeeh}
                      onChange={(e) => setTasbeeh(e.target.value)}
                      className="w-full bg-transparent text-right text-sm outline-none"
                      dir="rtl"
                    >
                      {TASBEEH_OPTIONS.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Add Yours">
                    <input
                      value={tasbeehCustom}
                      onChange={(e) => setTasbeehCustom(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none"
                      dir="rtl"
                    />
                  </Field>
                </>
              )}

              {type === "adhkar" && (
                <Field label="Adhkar">
                  <select
                    value={adhkarKind}
                    onChange={(e) => setAdhkarKind(e.target.value)}
                    className="w-full bg-transparent text-right text-sm outline-none"
                    dir="rtl"
                  >
                    {ADHKAR_OPTIONS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>
              )}

              <Field label="Circle Name">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Circle name"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </Field>

              <div className="flex items-center justify-between text-sm">
                <span>Number of Members</span>
                <select
                  value={members}
                  onChange={(e) => setMembers(+e.target.value)}
                  className="rounded bg-transparent text-primary outline-none"
                >
                  {[2,3,4,5,6,7,8,9,10].map((n) => <option key={n}>{n}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Circle Code</span>
                <span className="font-mono text-primary">{code}</span>
              </div>
            </div>

            <button
              type="submit"
              className="mx-auto mt-6 block rounded-full bg-primary px-10 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
            >
              Create
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}