"use client";

import React, { useMemo, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ListOrdered, Info, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

// Supabase client (browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const TUJUANS = {
  "P1|1.1":
    "Menjamin kemandirian pengambilan keputusan (bebas intervensi), konsistensi dengan hukum nasional, keterlibatan publik dalam perumusan, evaluasi berkala berbasis bukti, dan keadilan sosial dalam dampak kebijakan.",
  "P1|1.2":
    "Menyediakan informasi publik yang mudah diakses, prosedur pelayanan yang sederhana, dan memanfaatkan teknologi digital untuk efisiensi pelayanan.",
  "P1|1.3":
    "Mendorong partisipasi masyarakat melalui konsultasi publik, forum multipartai, dan pelaporan hasil konsultasi yang transparan.",
  "P1|1.4":
    "Melaksanakan evaluasi kebijakan berbasis data/riset, melibatkan pihak independen, dan mempublikasikan hasilnya secara terbuka.",
  "P1|1.5":
    "Menegakkan hukum secara adil & transparan, memperkuat pencegahan korupsi (integritas SDM, SPI, pelaporan), melindungi pelapor/whistleblower, meningkatkan partisipasi publik, dan memastikan ekosistem bisnis-investasi yang bersih.",
  "P2|2.1":
    "Meningkatkan kapasitas kelembagaan melalui pelatihan SDM, penguatan struktur organisasi, dan pengembangan sistem manajemen berbasis kinerja.",
  "P2|2.2":
    "Memperkuat kolaborasi antarlembaga pemerintah untuk mendukung koordinasi kebijakan dan implementasi yang terintegrasi.",
  "P2|2.3":
    "Meningkatkan kualitas layanan publik melalui standar pelayanan yang jelas, responsif, dan berorientasi pada kebutuhan masyarakat.",
  "P2|2.4":
    "Meningkatkan akuntabilitas melalui pelaporan kinerja yang transparan, audit independen, dan tindak lanjut terhadap temuan audit (target 100% tindak lanjut dalam 6 bulan).",
  "P2|2.5":
    "Mendorong inovasi layanan publik dengan memanfaatkan teknologi digital dan keterlibatan sektor swasta dalam pengembangan solusi.",
};

const RUBRIKS = {
  "P1|1.1": [
    "Tidak ada kebijakan/ tidak memenuhi syarat independensi, hukum nasional, atau keadilan sosial.",
    "Kebijakan ada tetapi tidak konsisten dengan hukum, minim partisipasi, atau dampak sosial tidak merata.",
    "Kebijakan cukup konsisten, ada partisipasi terbatas, evaluasi sporadis, dampak sosial cukup adil.",
    "Kebijakan konsisten dengan hukum, partisipasi publik memadai, evaluasi berkala, dampak sosial adil.",
    "Kebijakan sangat independen, partisipasi publik maksimal, evaluasi berbasis bukti rutin, dampak sosial sangat adil.",
  ],
  "P1|1.2": [
    "Informasi tidak tersedia/sulit diakses; prosedur tidak ada/sangat rumit; tanpa digital.",
    "Informasi terbatas, prosedur rumit, digitalisasi minim (<25% layanan).",
    "Informasi cukup tersedia, prosedur standar, digitalisasi parsial (25–50%).",
    "Informasi mudah diakses, prosedur sederhana, digitalisasi tinggi (50–75%).",
    "Informasi sangat mudah diakses, prosedur sangat efisien, digitalisasi maksimal (>75%).",
  ],
  "P1|1.3": [
    "Tidak ada konsultasi publik/ multipartai.",
    "Konsultasi publik minim (<25% pemangku kepentingan), tidak transparan.",
    "Konsultasi cukup (25–50%), laporan parsial.",
    "Konsultasi memadai (50–75%), laporan cukup transparan.",
    "Konsultasi maksimal (>75%), laporan sangat transparan.",
  ],
  "P1|1.4": [
    "Tidak ada evaluasi/ data.",
    "Evaluasi sporadis, tidak melibatkan pihak independen, tidak dipublikasikan.",
    "Evaluasi berbasis data terbatas, pihak independen terbatas, publikasi parsial.",
    "Evaluasi berbasis data memadai, pihak independen terlibat, publikasi cukup.",
    "Evaluasi berbasis data kuat, pihak independen dominan, publikasi maksimal.",
  ],
  "P1|1.5": [
    "Tidak ada penegakan hukum/ anti-korupsi, tanpa perlindungan pelapor.",
    "Penegakan hukum lemah, korupsi tinggi, perlindungan pelapor minim.",
    "Penegakan hukum cukup, anti-korupsi parsial, perlindungan pelapor terbatas.",
    "Penegakan hukum baik, anti-korupsi memadai, perlindungan pelapor cukup.",
    "Penegakan hukum sangat baik, anti-korupsi kuat, perlindungan pelapor maksimal.",
  ],
  "P2|2.4": [
    "Tidak ada pelaporan/ tindak lanjut (<10%).",
    "Pelaporan minim, tindak lanjut rendah (10–30%).",
    "Pelaporan cukup, tindak lanjut parsial (30–60%).",
    "Pelaporan memadai, tindak lanjut tinggi (60–90%).",
    "Pelaporan transparan, tindak lanjut maksimal (>90%).",
  ],
};

const SCHEMA = [
  {
    code: "P1",
    name: "Tata Kelola Hukum",
    weight: 0.5,
    criteria: [
      { code: "1.1", name: "Kebijakan Hukum", weight: 0.2 },
      { code: "1.2", name: "Akses Layanan", weight: 0.2 },
      { code: "1.3", name: "Partisipasi Publik", weight: 0.2 },
      { code: "1.4", name: "Evaluasi Kebijakan", weight: 0.2 },
      { code: "1.5", name: "Penegakan Hukum", weight: 0.4 },
    ],
  },
  {
    code: "P2",
    name: "Kelembagaan",
    weight: 0.3,
    criteria: [
      { code: "2.1", name: "Kapasitas Kelembagaan", weight: 0.2 },
      { code: "2.2", name: "Kolaborasi Lembaga", weight: 0.2 },
      { code: "2.3", name: "Kualitas Layanan", weight: 0.2 },
      { code: "2.4", name: "Akuntabilitas", weight: 0.2 },
      { code: "2.5", name: "Inovasi Layanan", weight: 0.2 },
    ],
  },
  { code: "P3", name: "SDM", weight: 0.1, criteria: [] },
  { code: "P4", name: "Keuangan", weight: 0.05, criteria: [] },
  { code: "P5", name: "Lingkungan", weight: 0.05, criteria: [] },
];

function generateRubricFromPurpose(purpose) {
  return [
    "Sangat rendah/ tidak ada penerapan.",
    "Rendah/ parsial, banyak kekurangan.",
    "Cukup/ memenuhi sebagian persyaratan.",
    "Baik/ konsisten dengan praktik yang disarankan.",
    "Sangat baik/ praktik terbaik & berkelanjutan.",
  ];
}

function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      data-testid="theme-toggle"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}

function KaratDonut({ value, size = 100 }) {
  const r = size * 0.4,
    c = size / 2,
    l = 2 * Math.PI * r;
  return (
    <motion.svg
      width={size}
      height={size}
      initial={{ strokeDashoffset: l }}
      animate={{ strokeDashoffset: l * (1 - value / 100) }}
      transition={{ duration: 1, ease: "easeOut", damping: 20 }}
    >
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        strokeWidth={size * 0.1}
        className="text-muted"
      />
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        strokeWidth={size * 0.1}
        strokeDasharray={l}
        strokeDashoffset={l}
        strokeLinecap="round-square"
        className="text-primary"
      />
      <text
        x={c}
        y={c}
        textAnchor="middle"
        dy="0.3em"
        fontSize={size * 0.25}
        className="fill-current font-bold"
      >
        {Math.round(value)}
      </text>
    </motion.svg>
  );
}

function PurposeDialog({ kcode, title }) {
  return (
    <Dialog>
      <Button
        size="sm"
        variant="outline"
        className="ml-2"
        data-testid={`btn-purpose-${kcode}`}
      >
        Tujuan
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p>{TUJUANS[kcode] || "Tujuan tidak tersedia."}</p>
      </DialogContent>
    </Dialog>
  );
}

function RubricDialog({ kcode, title, onPick }) {
  const rubric = RUBRIKS[kcode] || generateRubricFromPurpose(TUJUANS[kcode]);
  return (
    <Dialog>
      <Button
        size="sm"
        variant="outline"
        className="gap-2"
        data-testid={`btn-rubric-${kcode}`}
      >
        <ListOrdered className="h-4 w-4" /> Rubrik
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ol className="list-decimal pl-4 space-y-2">
          {rubric.map((item, i) => (
            <li
              key={i}
              className="cursor-pointer hover:bg-muted p-2 rounded"
              onClick={() => onPick(i + 1)}
              data-testid={`rubric-item-${kcode}-${i + 1}`}
            >
              {item}
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}

function IndicatorsDialog({ kcode, list, onAdd, onUpdate, onRemove }) {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState(1);
  return (
    <Dialog>
      <Button
        size="sm"
        variant="outline"
        className="gap-2"
        data-testid={`btn-indicators-${kcode}`}
      >
        <Plus className="h-4 w-4" /> Indikator
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Indikator Rinci: {kcode}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div>
              <Label>Nama</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Bobot</Label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                min={0}
                step={0.1}
              />
            </div>
            <Button
              size="sm"
              className="self-end"
              onClick={() => {
                if (name) {
                  onAdd({ id: crypto.randomUUID(), name, weight, score: 0 });
                  setName("");
                  setWeight(1);
                }
              }}
            >
              Tambah
            </Button>
          </div>
          <ul className="space-y-2">
            {list.map((item) => (
              <li key={item.id} className="flex items-center gap-2">
                <Input
                  value={item.name}
                  onChange={(e) =>
                    onUpdate(item.id, { ...item, name: e.target.value })
                  }
                />
                <Input
                  type="number"
                  value={item.weight}
                  onChange={(e) =>
                    onUpdate(item.id, {
                      ...item,
                      weight: Number(e.target.value),
                    })
                  }
                  min={0}
                  step={0.1}
                  className="w-20"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(item.id)}
                  data-testid={`btn-remove-indicator-${item.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CriterionCard({
  P,
  C,
  value,
  hasIndicators,
  count,
  onValue,
  onAdd,
  onUpdate,
  onRemove,
}) {
  const kcode = `${P.code}|${C.code}`;
  return (
    <div
      className="flex flex-col gap-2 p-4 border rounded-lg"
      data-testid={`criterion-${kcode}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold">
          {C.code} {C.name}
        </h3>
        <PurposeDialog kcode={kcode} title={`${C.code} ${C.name}`} />
        <RubricDialog
          kcode={kcode}
          title={`${C.code} ${C.name}`}
          onPick={(v) => onValue(v)}
        />
        {hasIndicators && (
          <IndicatorsDialog
            kcode={kcode}
            list={count}
            onAdd={onAdd}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <span>Skor:</span>
        <span className="font-bold">{value || "-"}</span>
      </div>
    </div>
  );
}

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState];
}

export default function App() {
  const [title, setTitle] = useLocalStorage("emas_title", "Penilaian EMAS");
  const [schema] = useState(SCHEMA);
  const [entries, setEntries] = useLocalStorage("emas_entries", {});
  const [indicators, setIndicators] = useLocalStorage("emas_indicators", {});
  const [message, setMessage] = useState("");

  const computeScores = useMemo(() => {
    const perPrinciple = {};
    let total = 0;
    for (const P of schema) {
      const SP = P.criteria.reduce((sum, C) => {
        const kcode = `${P.code}|${C.code}`;
        const inds = (indicators[kcode] || []).filter((I) => I.score > 0);
        let SK = 0;
        if (inds.length > 0) {
          const W = inds.reduce((s, I) => s + I.weight, 0) || 1;
          SK = inds.reduce((s, I) => s + (I.score * I.weight) / W, 0);
        } else {
          SK = entries[kcode] || 0;
        }
        return sum + SK * C.weight;
      }, 0);
      perPrinciple[P.code] = { IP: SP, karat: toKarat(SP) };
      total += SP * P.weight;
    }
    return { perPrinciple, total: toKarat(total) };
  }, [schema, entries, indicators]);

  function toKarat(score) {
    return Math.min(Math.max(Math.round(score * 20), 0), 100);
  }

  async function saveToSupabase() {
    try {
      const { error } = await supabase.from("emas").insert({
        title,
        scores: entries,
        indicators,
        total: computeScores.total,
      });
      if (error) throw error;
      setMessage("Berhasil disimpan!");
    } catch (e) {
      setMessage(`Gagal menyimpan: ${e?.message || e}`);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-bold w-1/2"
          data-testid="title-input"
        />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button onClick={saveToSupabase} data-testid="save-btn">
            Simpan
          </Button>
        </div>
      </header>
      {message && <div className="mb-4 p-2 bg-muted rounded">{message}</div>}
      <div className="flex items-center gap-4 mb-4">
        <KaratDonut value={computeScores.total} data-testid="karat-donut" />
        <span className="text-lg font-bold">
          Total: {computeScores.total} Karat
        </span>
      </div>
      <Tabs defaultValue="P1">
        <TabsList>
          {schema.map((P) => (
            <TabsTrigger
              key={P.code}
              value={P.code}
              data-testid={`tab-${P.code}`}
            >
              {P.code} ({computeScores.perPrinciple[P.code]?.karat || 0})
            </TabsTrigger>
          ))}
        </TabsList>
        {schema.map((P) => (
          <TabsContent key={P.code} value={P.code}>
            <div className="space-y-4">
              {P.criteria.map((C) => {
                const kcode = `${P.code}|${C.code}`;
                const inds = indicators[kcode] || [];
                return (
                  <CriterionCard
                    key={kcode}
                    P={P}
                    C={C}
                    value={entries[kcode]}
                    hasIndicators={true}
                    count={inds}
                    onValue={(v) => setEntries({ ...entries, [kcode]: v })}
                    onAdd={(item) =>
                      setIndicators({ ...indicators, [kcode]: [...inds, item] })
                    }
                    onUpdate={(id, updated) =>
                      setIndicators({
                        ...indicators,
                        [kcode]: inds.map((I) => (I.id === id ? updated : I)),
                      })
                    }
                    onRemove={(id) =>
                      setIndicators({
                        ...indicators,
                        [kcode]: inds.filter((I) => I.id !== id),
                      })
                    }
                  />
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
