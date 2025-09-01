"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@supabase/supabase-js";
// import { motion } from "framer-motion";
import {
  Menu,
  Sparkles,
  ShieldCheck,
  BarChart4,
  Factory,
  Leaf,
  Database,
  Save,
  Download,
  Calculator,
  ListOrdered,
  Trash2,
  History,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

// Default Weights — aligned with policy design
const DEFAULT_WEIGHTS = [
  {
    code: "P1",
    name: "Kinerja Tata Kelola Pemerintahan",
    weight: 0.25,
    criteria: [
      { code: "1.1", name: "Regulasi & Kedaulatan", weight: 0.1 },
      { code: "1.2", name: "Transparansi", weight: 0.1 },
      { code: "1.3", name: "Akuntabilitas", weight: 0.12 },
      { code: "1.4", name: "Koordinasi & Partisipasi Publik", weight: 0.08 },
      { code: "1.5", name: "Penegakan Hukum & Antikorupsi", weight: 0.14 },
      {
        code: "1.6",
        name: "Efektivitas & Efisiensi Pemerintahan",
        weight: 0.1,
      },
      { code: "1.7", name: "Kualitas Layanan Publik", weight: 0.1 },
      {
        code: "1.8",
        name: "Transformasi Digital / E-Gov & Smart City",
        weight: 0.1,
      },
      { code: "1.9", name: "Kepemimpinan (Leadership)", weight: 0.08 },
      { code: "1.10", name: "Keamanan Siber & Privasi Data", weight: 0.05 },
      {
        code: "1.11",
        name: "Keadilan & Pemerataan Layanan Publik",
        weight: 0.03,
      },
    ],
  },
  {
    code: "P2",
    name: "Kinerja Ekonomi",
    weight: 0.25,
    criteria: [
      { code: "2.1", name: "Pertumbuhan Ekonomi & PDRB", weight: 0.07 },
      {
        code: "2.2",
        name: "Pendapatan Daerah (PAD) & Efisiensi Anggaran",
        weight: 0.06,
      },
      {
        code: "2.3",
        name: "Pendapatan Keluarga & Kesejahteraan",
        weight: 0.08,
      },
      { code: "2.4", name: "Pengangguran & Ketenagakerjaan", weight: 0.07 },
      { code: "2.5", name: "Kewirausahaan & UMKM", weight: 0.06 },
      { code: "2.6", name: "Infrastruktur Ekonomi & Digital", weight: 0.09 },
      { code: "2.7", name: "Pengelolaan & Keberlanjutan SDA", weight: 0.06 },
      { code: "2.8", name: "Investasi & Retensi Investor", weight: 0.07 },
      { code: "2.9", name: "Ekspor & Akses Pasar Global", weight: 0.06 },
      {
        code: "2.10",
        name: "Kemiskinan & Ketimpangan (Gini, kesenjangan wilayah)",
        weight: 0.09,
      },
      {
        code: "2.11",
        name: "Produktivitas & Inovasi Ekonomi Lokal",
        weight: 0.07,
      },
      { code: "2.12", name: "Akses & Inklusi Keuangan", weight: 0.06 },
      {
        code: "2.13",
        name: "Ketahanan Ekonomi (pangan, harga pokok, shock)",
        weight: 0.07,
      },
      { code: "2.14", name: "Struktur Ekonomi & Diversifikasi", weight: 0.09 },
    ],
  },
  {
    code: "P3",
    name: "Kinerja Sosial",
    weight: 0.2,
    criteria: [
      { code: "3.1", name: "Pendidikan & Literasi", weight: 0.11 },
      {
        code: "3.2",
        name: "Kesehatan (AKI/AKB, Stunting, Harapan Hidup)",
        weight: 0.13,
      },
      { code: "3.3", name: "Hukum, HAM & Kesetaraan", weight: 0.1 },
      {
        code: "3.4",
        name: "Keagamaan, Toleransi & Kerukunan Sosial",
        weight: 0.08,
      },
      { code: "3.5", name: "Sosial-Budaya & Pariwisata", weight: 0.06 },
      { code: "3.6", name: "Keamanan & Ketertiban Sosial", weight: 0.08 },
      {
        code: "3.7",
        name: "Perlindungan Sosial & Inklusivitas (disabilitas & lansia)",
        weight: 0.12,
      },
      { code: "3.8", name: "Fasilitas Umum & Literasi Digital", weight: 0.08 },
      { code: "3.9", name: "Indeks Pembangunan Manusia (IPM)", weight: 0.1 },
      { code: "3.10", name: "Kesetaraan Gender", weight: 0.07 },
      { code: "3.11", name: "Urbanisasi & Dampaknya", weight: 0.07 },
    ],
  },
  {
    code: "P4",
    name: "Kinerja Lingkungan",
    weight: 0.15,
    criteria: [
      { code: "4.1", name: "Adaptasi Perubahan Iklim", weight: 0.12 },
      { code: "4.2", name: "Mitigasi Perubahan Iklim", weight: 0.12 },
      { code: "4.3", name: "Kualitas Udara", weight: 0.12 },
      { code: "4.4", name: "Kualitas & Akses Air Bersih", weight: 0.12 },
      {
        code: "4.5",
        name: "Pengelolaan Sampah & Circular Economy",
        weight: 0.12,
      },
      { code: "4.6", name: "Perumahan Berkelanjutan", weight: 0.09 },
      { code: "4.7", name: "Ruang Terbuka Hijau (RTH)", weight: 0.08 },
      { code: "4.8", name: "Energi Terbarukan", weight: 0.12 },
      {
        code: "4.9",
        name: "Pengelolaan SDA & Keanekaragaman Hayati",
        weight: 0.11,
      },
    ],
  },
  {
    code: "P5",
    name: "Kinerja Inovasi & Keberlanjutan",
    weight: 0.15,
    criteria: [
      {
        code: "5.1",
        name: "Keberlanjutan Ekonomi melalui Inovasi (Green Economy)",
        weight: 0.12,
      },
      { code: "5.2", name: "Investasi R&D & Pendidikan", weight: 0.12 },
      { code: "5.3", name: "Keterlibatan Pemangku Kepentingan", weight: 0.1 },
      {
        code: "5.4",
        name: "Dampak Sosial & Lingkungan dari Inovasi",
        weight: 0.12,
      },
      { code: "5.5", name: "Efektivitas Teknologi", weight: 0.1 },
      {
        code: "5.6",
        name: "Kebijakan & Regulasi Pro-Inovasi (HKI, insentif)",
        weight: 0.1,
      },
      {
        code: "5.7",
        name: "Internasionalisasi Inovasi (GII, paten, publikasi)",
        weight: 0.08,
      },
      { code: "5.8", name: "Inovasi Digital & Smart Society", weight: 0.1 },
      {
        code: "5.9",
        name: "Ekosistem Startup & Bisnis Inovatif",
        weight: 0.08,
      },
      {
        code: "5.10",
        name: "Evaluasi Dampak Inovasi (adopsi, kepuasan, keberlanjutan)",
        weight: 0.08,
      },
    ],
  },
];

// Supabase client (browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Helpers
function clampScore(v) {
  return Math.max(1, Math.min(5, v));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function toKarat(score1to5) {
  return (score1to5 * 24) / 5;
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function safeName(s) {
  return s.trim().split(" ").join("_");
}

// Aggregator with indicator support + normalization
function computeScores(weights, entries, indicators) {
  const perPrinciple = {};
  let SA = 0; // 1..5

  weights.forEach((P) => {
    const criteria = P.criteria;
    const SP = criteria.reduce((sum, C) => {
      const critKey = `${P.code}|${C.code}`;
      const items = indicators[critKey] || [];
      let SK = 0;
      if (items.length > 0) {
        const totalW = items.reduce((a, b) => a + (b.weight || 0), 0);
        SK = items.reduce(
          (acc, it) =>
            acc +
            (totalW ? it.weight / totalW : 1 / items.length) *
              clampScore(it.score),
          0,
        );
      } else {
        const fallback =
          typeof entries[critKey] === "number"
            ? clampScore(entries[critKey])
            : 0;
        SK = fallback;
      }
      return sum + C.weight * SK;
    }, 0);

    SA += P.weight * SP;
    perPrinciple[P.code] = { SP: round2(SP), karat: round2(toKarat(SP)) };
  });

  const total = round2(SA);
  const karat = round2(toKarat(total));
  return { SA: total, karat, perPrinciple };
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

export default function EMASMobileApp() {
  const [email, setEmail] = useLocalStorage("emas_email", "");
  const [title, setTitle] = useState("Penilaian EMAS");
  const [scores, setScores] = useLocalStorage("emas_scores", {});
  const [indicators, setIndicators] = useLocalStorage("emas_indicators", {});
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const result = useMemo(
    () => computeScores(weights, scores, indicators),
    [weights, scores, indicators],
  );

  async function saveToSupabase() {
    setMessage("");
    if (!supabase) {
      setMessage("Supabase belum dikonfigurasi.");
      return;
    }
    if (!email) {
      setMessage("Masukkan email Anda terlebih dahulu.");
      return;
    }
    setSaving(true);
    try {
      const payload = { title, weights, scores, indicators, result };
      const { error } = await supabase
        .from("assessments")
        .insert({ user_email: email, title, payload });
      if (error) throw error;
      setMessage("Berhasil tersimpan ke Supabase");
    } catch (e) {
      setMessage(`Gagal menyimpan: ${e?.message || e}`);
    } finally {
      setSaving(false);
    }
  }

  async function loadHistory() {
    if (!supabase) {
      setMessage("Supabase belum dikonfigurasi.");
      return;
    }
    if (!email) {
      setMessage("Masukkan email untuk memuat riwayat.");
      return;
    }
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("id, title, created_at, payload")
        .eq("user_email", email)
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      setHistory(data || []);
    } catch (e) {
      setMessage(`Gagal memuat riwayat: ${e?.message || e}`);
    } finally {
      setLoadingHistory(false);
    }
  }

  async function deleteEntry(id) {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("assessments")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setHistory((h) => h.filter((x) => x.id !== id));
    } catch (e) {
      setMessage("Gagal menghapus entri.");
    }
  }

  function exportJson() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            title,
            weights,
            scores,
            indicators,
            result,
            exported_at: new Date().toISOString(),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName(title)}_EMAS.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function resetScores() {
    setScores({});
    setIndicators({});
  }

  function addIndicator(critKey) {
    const list = indicators[critKey] || [];
    const next = {
      id: uid(),
      name: `Indikator ${list.length + 1}`,
      weight: 1,
      score: 3,
    };
    setIndicators({ ...indicators, [critKey]: [...list, next] });
  }

  function updateIndicator(critKey, id, patch) {
    const list = indicators[critKey] || [];
    setIndicators({
      ...indicators,
      [critKey]: list.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    });
  }

  function removeIndicator(critKey, id) {
    const list = indicators[critKey] || [];
    setIndicators({
      ...indicators,
      [critKey]: list.filter((it) => it.id !== id),
    });
  }

  return (
    <div className="min-h-dvh w-full bg-background text-foreground pb-24">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="mx-auto max-w-md px-3 py-3 flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" /> EMAS Mobile
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 text-sm mx-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email (untuk penyimpanan Supabase)
                  </Label>
                  <Input
                    id="email"
                    placeholder="nama@contoh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Penilaian</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <Separator />
                <div>
                  <div className="font-medium mb-2">Aksi</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={saveToSupabase}
                      disabled={saving}
                      className="gap-2"
                      variant="default"
                    >
                      <Save className="h-4 w-4" /> Simpan
                    </Button>
                    <Button
                      onClick={exportJson}
                      variant="secondary"
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" /> Ekspor JSON
                    </Button>
                    <Button
                      onClick={resetScores}
                      variant="outline"
                      className="col-span-2"
                    >
                      Reset Skor
                    </Button>
                  </div>
                  {message && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {message}
                    </p>
                  )}
                </div>

                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Riwayat Penilaian</div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={loadHistory}
                      className="gap-2"
                    >
                      <History className="h-4 w-4" /> Muat
                    </Button>
                  </div>
                  <ScrollArea className="h-48 rounded-md border p-2">
                    {loadingHistory ? (
                      <div className="text-xs text-muted-foreground">
                        Memuat...
                      </div>
                    ) : history.length === 0 ? (
                      <div className="text-xs text-muted-foreground">
                        Belum ada data.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {history.map((row) => (
                          <div
                            key={row.id}
                            className="flex items-center justify-between rounded-lg border p-2"
                          >
                            <div className="text-xs">
                              <div className="font-medium">
                                {row.title || "Tanpa Judul"}
                              </div>
                              <div className="text-muted-foreground">
                                {new Date(row.created_at).toLocaleString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                  const payload = row.payload || {};
                                  setScores(payload.scores || {});
                                  setIndicators(payload.indicators || {});
                                  if (payload.weights)
                                    setWeights(payload.weights);
                                  setTitle(payload.title || row.title || title);
                                }}
                              >
                                Muat
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => deleteEntry(row.id)}
                                aria-label="Hapus"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>

                <Separator className="my-2" />
                <div className="text-xs text-muted-foreground">
                  <p className="mb-1">
                    Formula: tertimbang (Prinsip × Kriteria × (opsional)
                    Indikator)
                  </p>
                  <p>SA = Σ( wP × Σ( wC × SK ) ) • Karat = SA × (24/5)</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1 flex justify-between  items-center gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <div className="text-base font-semibold">EMAS Mobile</div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-md px-3 py-3 space-y-4">
        {/* Summary Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart4 className="h-5 w-5" /> Ringkasan
              </span>
              <span className="text-xs text-muted-foreground">
                Mobile · Weighted
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4 py-2">
              <KaratDonut value={result.karat} />
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Skor Akhir (1–5)
                </div>
                <div className="text-2xl font-bold">{result.SA.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Karat (24K)</div>
                <div className="text-xl font-semibold">
                  {result.karat.toFixed(2)}K
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs per principle */}
        <Tabs defaultValue="P1" className="w-full">
          <TabsList className="grid grid-cols-5 w-full h-fit px-1.5 py-1">
            <TabsTrigger value="P1" aria-label="Tata Kelola">
              <ShieldCheck className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="P2" aria-label="Ekonomi">
              <Factory className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="P3" aria-label="Sosial">
              <Sparkles className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="P4" aria-label="Lingkungan">
              <Leaf className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="P5" aria-label="Inovasi">
              <Database className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          {weights.map((P) => (
            <TabsContent key={P.code} value={P.code} className="space-y-3 pt-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    {iconForPrinciple(P.code)} {P.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-muted-foreground">
                    Bobot prinsip: {(P.weight * 100).toFixed(0)}%
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {P.criteria.map((C) => {
                      const key = `${P.code}|${C.code}`;
                      const hasIndicators = (indicators[key]?.length || 0) > 0;
                      const val =
                        typeof scores[key] === "number" ? scores[key] : 3; // default mid
                      const count = indicators[key]?.length || 0;
                      return (
                        <div key={key} className="rounded-2xl border p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm font-medium flex-1">
                              {C.code} — {C.name}
                            </div>
                            <div className="flex items-center gap-2">
                              {count > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px]"
                                >
                                  {count} indikator
                                </Badge>
                              )}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-2"
                                  >
                                    <ListOrdered className="h-4 w-4" />{" "}
                                    Indikator
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {C.code} — {C.name}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-3">
                                    <div className="text-xs text-muted-foreground">
                                      Isi indikator bila ingin penilaian lebih
                                      rinci. Jika kosong, nilai kriteria
                                      (slider) dipakai.
                                    </div>
                                    <div className="space-y-2">
                                      {(indicators[key] || []).map((it) => (
                                        <div
                                          key={it.id}
                                          className="rounded-lg border p-2"
                                        >
                                          <div className="flex items-center gap-2">
                                            <Input
                                              value={it.name}
                                              onChange={(e) =>
                                                updateIndicator(key, it.id, {
                                                  name: e.target.value,
                                                })
                                              }
                                              className="flex-1"
                                            />
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              onClick={() =>
                                                removeIndicator(key, it.id)
                                              }
                                              aria-label="hapus"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                          <div className="mt-2 grid grid-cols-2 gap-2">
                                            <div>
                                              <Label className="text-xs">
                                                Skor (1–5)
                                              </Label>
                                              <div className="flex items-center gap-2">
                                                <Slider
                                                  min={1}
                                                  max={5}
                                                  step={0.5}
                                                  value={[it.score]}
                                                  onValueChange={(v) =>
                                                    updateIndicator(
                                                      key,
                                                      it.id,
                                                      {
                                                        score: clampScore(v[0]),
                                                      },
                                                    )
                                                  }
                                                  className="flex-1"
                                                />
                                                <Input
                                                  type="number"
                                                  className="w-20"
                                                  min={1}
                                                  max={5}
                                                  step={0.5}
                                                  value={it.score}
                                                  onChange={(e) =>
                                                    updateIndicator(
                                                      key,
                                                      it.id,
                                                      {
                                                        score: clampScore(
                                                          parseFloat(
                                                            e.target.value ||
                                                              "0",
                                                          ),
                                                        ),
                                                      },
                                                    )
                                                  }
                                                />
                                              </div>
                                            </div>
                                            <div>
                                              <Label className="text-xs">
                                                Bobot
                                              </Label>
                                              <Input
                                                type="number"
                                                step={0.1}
                                                value={it.weight}
                                                onChange={(e) =>
                                                  updateIndicator(key, it.id, {
                                                    weight: Math.max(
                                                      0,
                                                      parseFloat(
                                                        e.target.value || "0",
                                                      ),
                                                    ),
                                                  })
                                                }
                                              />
                                              <p className="text-[10px] text-muted-foreground mt-1">
                                                Bobot akan dinormalisasi
                                                otomatis
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <Button
                                      onClick={() => addIndicator(key)}
                                      variant="secondary"
                                    >
                                      Tambah Indikator
                                    </Button>
                                  </div>
                                  <DialogFooter>
                                    <div className="text-xs text-muted-foreground">
                                      Rumus SK: Σ( wInd_norm × SI )
                                    </div>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>

                          {/* Criteria fallback control */}
                          <div className="mt-2 flex items-center gap-3">
                            <Slider
                              min={1}
                              max={5}
                              step={0.5}
                              value={[val]}
                              onValueChange={(v) =>
                                setScores({ ...scores, [key]: v[0] })
                              }
                              className="flex-1"
                              aria-label={`Skor ${C.name}`}
                              disabled={hasIndicators}
                            />
                            <Input
                              type="number"
                              className="w-20"
                              min={1}
                              max={5}
                              step={0.5}
                              value={val}
                              onChange={(e) => {
                                const n = parseFloat(e.target.value || "0");
                                setScores({
                                  ...scores,
                                  [key]: clampScore(isNaN(n) ? 3 : n),
                                });
                              }}
                              disabled={hasIndicators}
                            />
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>
                              Bobot kriteria: {Math.round(C.weight * 100)}%
                            </span>
                            <span>
                              {hasIndicators
                                ? "Menggunakan skor indikator"
                                : "Menggunakan skor kriteria"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-1 text-xs text-muted-foreground">
                    Skor Prinsip (SP):{" "}
                    {result.perPrinciple[P.code]?.SP?.toFixed(2)} • Karat:{" "}
                    {result.perPrinciple[P.code]?.karat?.toFixed(2)}K
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Spacer for bottom nav */}
        <div className="h-12" />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 z-40">
        <div className="mx-auto max-w-md px-3 py-2 grid grid-cols-3 gap-2">
          <Button variant="secondary" className="gap-2" onClick={exportJson}>
            <Download className="h-4 w-4" /> Ekspor
          </Button>
          <Button
            variant="default"
            className="gap-2"
            onClick={saveToSupabase}
            disabled={saving}
          >
            <Save className="h-4 w-4" /> Simpan
          </Button>
          <Button variant="outline" className="gap-2" onClick={resetScores}>
            <Calculator className="h-4 w-4" /> Reset
          </Button>
        </div>
      </nav>
    </div>
  );
}

function iconForPrinciple(code) {
  const cls = "h-5 w-5";
  if (code === "P1") return <ShieldCheck className={cls} />;
  if (code === "P2") return <Factory className={cls} />;
  if (code === "P3") return <Sparkles className={cls} />;
  if (code === "P4") return <Leaf className={cls} />;
  return <Database className={cls} />;
}

/** Donut displaying Karat value */
function KaratDonut({ value }) {
  const size = 80;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / 24));
  const dash = c * pct;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="text-muted"
          stroke="currentColor"
          opacity={0.2}
          fill="none"
        />
        {/* <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="text-primary"
          stroke="currentColor"
          fill="none"
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${dash} ${c - dash}` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        /> */}
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Karat</div>
          <div className="text-lg font-bold">{value.toFixed(1)}K</div>
        </div>
      </div>
    </div>
  );
}
