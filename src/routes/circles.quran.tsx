import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bookmark } from "lucide-react";

export const Route = createFileRoute("/circles/quran")({
  head: () => ({
    meta: [
      { title: "Quran Surahs — Muslim Circles" },
      { name: "description", content: "Browse the 114 surahs of the Holy Quran." },
    ],
  }),
  component: QuranListPage,
});

const SURAHS = [
  "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال",
  "التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف",
  "مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص",
  "العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص",
  "الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح",
  "الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة",
  "الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك",
  "القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات",
  "النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق",
  "الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق",
  "القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل",
  "قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس",
];

function QuranListPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
          <Link to="/" className="rounded p-1 hover:bg-white/10" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center text-base font-semibold">Muslim Circles</h1>
          <div className="w-7" />
        </header>
        <ul className="flex-1 pb-24">
          {SURAHS.map((name, i) => (
            <li
              key={i}
              className={`flex items-center gap-3 px-4 py-3 ${i % 2 === 0 ? "bg-secondary/60" : "bg-card"}`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 text-xs font-semibold text-primary">
                {i + 1}
              </div>
              <p dir="rtl" className="flex-1 text-right text-lg">{name}</p>
            </li>
          ))}
        </ul>
        <Link
          to="/"
          className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
          aria-label="Bookmarks"
        >
          <Bookmark className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}