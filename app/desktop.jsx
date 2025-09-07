"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
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
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
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
  ArrowRightCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { DeviceViewToggle } from "@/components/device-toggle";
import { toast } from "sonner";

// ============= Rubrics =============
const RUBRICS = {
  // P1
  "P1|1.1": [
    "Regulasi banyak dipengaruhi pihak luar, tidak jelas, tanpa uji publik, dan tidak ada evaluasi.",
    "Regulasi sebagian mandiri, tetapi mayoritas masih dipengaruhi pihak luar dan minim analisis dampak.",
    "Regulasi cukup mandiri, ada analisis dampak & standar formal, namun evaluasi belum konsisten.",
    "Regulasi hampir seluruhnya mandiri, berbasis kepentingan nasional, jelas, dan evaluasi dilakukan sebagian besar.",
    "Regulasi sepenuhnya mandiri, berbasis kepentingan nasional, sesuai standar hukum, transparan, dievaluasi berkala, dan terbukti memberi dampak positif ke masyarakat.",
  ],
  "P1|1.2": [
    "Informasi publik tidak tersedia atau sulit diakses; prosedur permohonan informasi tidak ada atau sangat rumit; tidak ada pemanfaatan teknologi digital.",
    "Informasi publik tersedia sebagian, tetapi sering tidak akurat atau usang; prosedur ada namun membingungkan; akses masyarakat masih terbatas.",
    "Informasi publik cukup lengkap dan relatif akurat; prosedur permohonan jelas tapi belum ramah masyarakat umum; akses tersedia namun masih memerlukan waktu/biaya tambahan; pemanfaatan teknologi digital terbatas.",
    "Informasi publik lengkap, akurat, dan diperbarui secara berkala; prosedur permohonan jelas dan cukup mudah; akses masyarakat cepat dengan biaya rendah; sudah ada portal digital yang cukup interaktif.",
    "Informasi publik lengkap, akurat, dan real-time; prosedur permohonan sederhana, transparan, dan sepenuhnya ramah pengguna; akses masyarakat mudah tanpa hambatan; pemanfaatan teknologi digital optimal (portal online, aplikasi mobile, keterbukaan data dengan standar internasional).",
  ],
  "P1|1.3": [
    "Tidak ada laporan keuangan atau laporan kinerja; laporan yang tersedia tidak dapat diaudit; pengaduan publik tidak ditindaklanjuti.",
    "Ada laporan keuangan dan kinerja, tetapi tidak lengkap dan belum diaudit secara independen; tindak lanjut pengaduan publik sangat terbatas.",
    "Laporan keuangan dan kinerja disusun secara rutin, sebagian besar sudah diaudit, namun hasil audit atau tindak lanjut belum konsisten; akses publik terhadap laporan masih terbatas.",
    "Laporan keuangan dan kinerja lengkap, rutin diaudit, dan sebagian besar rekomendasi audit ditindaklanjuti; pengaduan publik ditangani secara cukup efektif.",
    "Laporan keuangan dan kinerja lengkap, diaudit secara independen dengan opini wajar tanpa pengecualian (WTP) atau setara; seluruh rekomendasi audit ditindaklanjuti tepat waktu; pengaduan publik ditangani secara terbuka, cepat, dan efektif dengan mekanisme monitoring yang jelas.",
  ],
  "P1|1.4": [
    "Koordinasi antar instansi dan partisipasi masyarakat hampir tidak ada; kebijakan dibuat secara sepihak tanpa melibatkan publik.",
    "Ada koordinasi antar instansi tetapi terbatas pada formalitas; partisipasi masyarakat minim dan hanya bersifat seremonial.",
    "Koordinasi antar instansi berjalan cukup baik namun belum konsisten; partisipasi masyarakat ada melalui forum formal (seperti Musrenbang), tetapi masukan belum diakomodasi secara nyata.",
    "Koordinasi antar lembaga jelas, rutin dilakukan, dan berdampak positif; partisipasi masyarakat aktif dan sebagian besar masukan diakomodasi dalam kebijakan.",
    "Koordinasi antarlembaga efektif, adaptif, dan terintegrasi, termasuk dalam situasi krisis; partisipasi masyarakat luas, setara, dan masukan publik secara transparan memengaruhi arah kebijakan.",
  ],
  "P1|1.5": [
    "Penegakan hukum tidak adil dan diskriminatif; kasus korupsi tidak ditindaklanjuti; tidak ada mekanisme pengawasan atau perlindungan pelapor.",
    "Ada upaya penegakan hukum namun masih bias dan tidak transparan; sebagian kasus korupsi ditindaklanjuti, tetapi perlindungan pelapor lemah; pengawasan publik minim.",
    "Penegakan hukum cukup adil dan transparan; sebagian besar kasus korupsi ditindaklanjuti; ada mekanisme pengawasan publik namun belum optimal.",
    "Penegakan hukum konsisten, adil, dan transparan; mayoritas kasus korupsi berhasil ditangani; perlindungan pelapor tersedia; partisipasi publik cukup aktif dalam pengawasan.",
    "Penegakan hukum sepenuhnya adil, transparan, dan terpercaya; kasus korupsi ditangani dengan tingkat keberhasilan tinggi; pelapor korupsi mendapat perlindungan penuh; partisipasi publik luas dalam pengawasan, sehingga tingkat korupsi rendah dan kepercayaan publik tinggi.",
  ],
  "P1|1.6": [
    "Target kinerja tidak tercapai; penggunaan sumber daya boros; produktivitas rendah; masalah publik sering tidak terselesaikan.",
    "Sebagian target kinerja tercapai namun dengan penggunaan sumber daya yang tidak efisien; penyelesaian masalah publik lambat.",
    "Sebagian besar target kinerja tercapai; penggunaan sumber daya cukup efisien; penyelesaian masalah publik dilakukan namun belum konsisten.",
    "Hampir semua target kinerja tercapai dengan pemanfaatan sumber daya yang efisien; produktivitas tinggi; masalah publik sebagian besar terselesaikan secara tepat waktu.",
    "Semua target kinerja tercapai; penggunaan sumber daya sangat efisien; produktivitas optimal; pemerintah mampu menyelesaikan masalah publik secara cepat, inovatif, dan berkelanjutan.",
  ],
  "P1|1.7": [
    "Layanan publik tidak memadai; keluhan masyarakat tinggi; respon lambat; banyak wilayah tidak terjangkau layanan.",
    "Layanan publik tersedia namun kualitas rendah; respon lambat; keluhan ditangani sebagian; keterjangkauan wilayah terbatas.",
    "Layanan publik cukup memadai; respon relatif cepat; keluhan masyarakat sebagian besar ditangani; layanan menjangkau sebagian besar wilayah namun belum merata.",
    "Layanan publik berkualitas baik; respon cepat dan konsisten; tingkat kepuasan masyarakat tinggi; layanan menjangkau hampir seluruh wilayah termasuk daerah sulit.",
    "Layanan publik sangat berkualitas, adil, konsisten, responsif, inklusif, dan dapat diandalkan; keluhan masyarakat ditangani cepat dan tuntas; layanan tersedia merata hingga ke wilayah terpencil dengan standar tinggi.",
  ],
  "P1|1.8": [
    "Hampir tidak ada layanan publik digital (semua manual). Data pemerintahan tertutup, tidak terintegrasi. Literasi digital masyarakat sangat rendah, kesenjangan digital tinggi. Tidak ada perhatian pada keamanan data/siber.",
    "Sebagian layanan publik tersedia online, tetapi terbatas & tidak optimal. Data sektoral ada tapi terfragmentasi, belum real-time. Literasi digital mulai meningkat tapi mayoritas masyarakat belum mampu mengakses. Keamanan siber minim, privasi belum terjaga.",
    "Sebagian besar layanan publik tersedia online & fungsional. Sistem digital mulai terintegrasi sebagian, big data digunakan untuk analisis dasar. Literasi digital masyarakat cukup baik, mayoritas bisa mengakses layanan digital dasar. Ada mekanisme dasar perlindungan data & keamanan siber.",
    "Layanan publik digital terintegrasi lintas sektor (kesehatan, pendidikan, transportasi, administrasi). Big data & AI digunakan untuk prediksi kebijakan & layanan publik. Literasi digital tinggi, masyarakat aktif memanfaatkan teknologi untuk produktivitas & partisipasi publik. Sistem keamanan siber kuat, regulasi privasi data berlaku efektif.",
    "Transformasi digital penuh: smart government & smart city terwujud. Big data, AI, IoT terintegrasi → layanan publik real-time, prediktif, aman, inklusif. Literasi digital masyarakat sangat tinggi, kesenjangan digital hampir nol, startup & inovasi digital tumbuh pesat. Keamanan siber & privasi data setara standar internasional, ekosistem digital berkelanjutan & dipercaya publik.",
  ],
  "P1|1.9": [
    "Pemimpin tidak memiliki visi dan misi yang jelas; komunikasi buruk; keputusan sering lambat/tidak tepat; integritas rendah; kepercayaan publik sangat rendah.",
    "Pemimpin memiliki visi tetapi kurang terarah; komunikasi terbatas; keputusan tidak konsisten; partisipasi masyarakat minim; integritas dipertanyakan.",
    "Pemimpin memiliki visi dan misi cukup jelas; komunikasi berjalan namun belum efektif; keputusan cukup cepat namun belum konsisten; integritas cukup baik; tingkat kepercayaan publik sedang.",
    "Pemimpin memiliki visi-misi yang jelas, konsisten, dan komunikatif; keputusan cepat dan tepat; integritas kuat; mendorong partisipasi masyarakat; kepercayaan publik tinggi.",
    "Pemimpin visioner, komunikatif, responsif, dan adaptif dalam krisis; keputusan cepat, tepat, dan berbasis data; integritas tinggi; mendorong partisipasi luas dan inovasi; kepercayaan publik sangat tinggi dan berkelanjutan.",
  ],
  "P1|1.10": [
    "Tidak ada regulasi atau kebijakan khusus tentang keamanan siber dan privasi data; perlindungan data pribadi sangat lemah; sangat rentan terhadap serangan siber.",
    "Ada regulasi dasar tentang keamanan siber/privasi data, tetapi implementasi lemah; perlindungan data hanya sebagian; kesiapan menghadapi serangan siber sangat terbatas.",
    "Regulasi cukup jelas dan mulai diterapkan; ada lembaga/unit khusus keamanan siber; perlindungan data pribadi berjalan namun belum menyeluruh; kesiapan menghadapi ancaman siber moderat.",
    "Regulasi keamanan siber & privasi data kuat dan konsisten; perlindungan data pribadi cukup menyeluruh; kesiapan menghadapi ancaman siber tinggi dengan mekanisme respons cepat; kepercayaan publik meningkat.",
    "Regulasi keamanan siber & privasi data sangat kuat dan setara standar internasional; perlindungan data pribadi sepenuhnya dijamin; kesiapan menghadapi ancaman siber sangat tinggi dengan sistem prediktif & preventif; kepercayaan publik dan dunia internasional sangat tinggi terhadap keamanan digital nasional.",
  ],
  "P1|1.11": [
    "Akses layanan publik sangat timpang; kelompok rentan dan wilayah tertinggal hampir tidak terlayani; kualitas layanan rendah.",
    "Akses layanan publik mulai tersedia namun tidak merata; kelompok rentan sebagian kecil terlayani; wilayah tertinggal tetap jauh tertinggal dalam akses layanan.",
    "Akses layanan publik cukup luas; sebagian besar kelompok rentan terlayani; wilayah tertinggal memperoleh layanan dasar namun belum setara dengan wilayah maju.",
    "Akses layanan publik tinggi dan merata di hampir semua wilayah; kelompok rentan sebagian besar terlayani penuh; kualitas layanan baik meski masih ada sedikit kesenjangan antarwilayah.",
    "Akses layanan publik sepenuhnya merata dan inklusif; kelompok rentan dan wilayah tertinggal terlayani penuh dengan kualitas setara wilayah maju; kesenjangan akses sangat kecil hingga mendekati nol.",
  ],

  // P2
  "P2|2.1": [
    "Pertumbuhan ekonomi negatif atau sangat rendah; PDRB stagnan; ketergantungan tinggi pada satu sektor; tidak ada dampak signifikan terhadap kesejahteraan masyarakat.",
    "Pertumbuhan ekonomi rendah (<3%); PDRB meningkat terbatas; ketergantungan sektor masih dominan; manfaat hanya dirasakan kelompok tertentu.",
    "Pertumbuhan ekonomi moderat (3–5%); PDRB meningkat cukup stabil; mulai ada diversifikasi sektor namun belum merata; kesejahteraan masyarakat meningkat sebagian.",
    "Pertumbuhan ekonomi baik (5–6%); PDRB meningkat stabil; diversifikasi sektor cukup kuat; manfaat ekonomi dirasakan mayoritas masyarakat.",
    "Pertumbuhan ekonomi tinggi dan berkelanjutan (>6%); PDRB tumbuh stabil; sektor ekonomi terdiversifikasi dengan baik; manfaat ekonomi merata dan meningkatkan kualitas hidup masyarakat secara signifikan.",
  ],
  "P2|2.2": [
    "Pendapatan daerah sangat rendah; ketergantungan hampir penuh pada dana transfer pusat; pengelolaan anggaran tidak efisien; banyak kebocoran anggaran.",
    "Pendapatan daerah meningkat terbatas; PAD kecil; ketergantungan pada pusat masih dominan; pengelolaan anggaran sebagian besar belum efisien.",
    "Pendapatan daerah cukup stabil; PAD berkontribusi moderat; ketergantungan pada pusat mulai berkurang; efisiensi anggaran sedang.",
    "Pendapatan daerah tinggi; PAD berkontribusi signifikan (>30% dari total pendapatan daerah); pengelolaan anggaran efisien; tingkat kebocoran rendah.",
    "Pendapatan daerah sangat tinggi dan berkelanjutan; PAD dominan (>50% dari total pendapatan daerah); pengelolaan anggaran sangat efisien, transparan, dan akuntabel; tingkat kebocoran sangat rendah dengan manfaat optimal bagi masyarakat.",
  ],
  "P2|2.3": [
    "Pendapatan keluarga sangat rendah; angka kemiskinan tinggi; daya beli lemah; banyak keluarga tidak mampu memenuhi kebutuhan dasar.",
    "Pendapatan keluarga meningkat terbatas; angka kemiskinan menurun sedikit; daya beli masih rendah; akses kebutuhan dasar belum merata.",
    "Pendapatan keluarga cukup stabil; angka kemiskinan menurun moderat; daya beli masyarakat meningkat; sebagian besar keluarga dapat memenuhi kebutuhan dasar namun masih ada ketimpangan.",
    "Pendapatan keluarga tinggi; angka kemiskinan rendah; daya beli kuat; kebutuhan dasar sebagian besar keluarga tercukupi dengan baik.",
    "Pendapatan keluarga sangat tinggi dan merata; angka kemiskinan sangat rendah (<5%); daya beli kuat dan stabil; semua keluarga memiliki akses penuh terhadap pangan, kesehatan, pendidikan, dan perumahan yang layak.",
  ],
  "P2|2.4": [
    "Tingkat pengangguran sangat tinggi (>10%); kesempatan kerja terbatas; pelatihan vokasi tidak tersedia; mayoritas pekerja di sektor informal dengan kondisi tidak layak.",
    "Tingkat pengangguran tinggi (7–10%); kesempatan kerja ada tetapi terbatas; pelatihan vokasi tersedia namun minim; sebagian besar pekerjaan belum memenuhi standar pekerjaan layak.",
    "Tingkat pengangguran moderat (5–7%); kesempatan kerja cukup tersedia; pelatihan vokasi mulai menjangkau sebagian masyarakat; pekerjaan layak tersedia namun belum merata.",
    "Tingkat pengangguran rendah (3–5%); kesempatan kerja luas; pelatihan vokasi berkualitas dan relevan dengan kebutuhan industri; sebagian besar tenaga kerja mendapatkan pekerjaan layak.",
    "Tingkat pengangguran sangat rendah (<3%); kesempatan kerja luas dan beragam; pelatihan vokasi masif, inklusif, dan relevan; hampir seluruh tenaga kerja memperoleh pekerjaan layak dengan standar upah dan perlindungan sosial yang baik.",
  ],
  "P2|2.5": [
    "Jumlah wirausaha dan UMKM sangat sedikit; tingkat kegagalan tinggi; hampir tidak ada akses terhadap modal dan pasar.",
    "Jumlah wirausaha dan UMKM mulai tumbuh tetapi sebagian besar tidak berkelanjutan; akses modal dan pasar masih terbatas pada kelompok tertentu.",
    "Jumlah wirausaha dan UMKM cukup banyak; sebagian sudah berkelanjutan; akses modal tersedia tetapi belum merata; akses pasar terbatas pada lingkup lokal.",
    "Jumlah wirausaha dan UMKM tinggi; mayoritas berkelanjutan; akses modal lebih luas; pasar meluas hingga regional/nasional.",
    "Jumlah wirausaha dan UMKM sangat tinggi, inovatif, dan berkelanjutan; akses modal inklusif dan mudah; pasar meluas hingga global; UMKM menjadi pilar utama perekonomian daerah/nasional.",
  ],
  "P2|2.6": [
    "Infrastruktur dasar (jalan, listrik, internet, logistik) sangat terbatas; banyak wilayah terisolasi; konektivitas ekonomi terganggu.",
    "Infrastruktur dasar tersedia namun kualitas rendah dan tidak merata; internet dan logistik hanya menjangkau sebagian wilayah; hambatan besar bagi kegiatan ekonomi.",
    "Infrastruktur fisik (jalan, listrik, logistik) cukup memadai; akses internet tersedia di sebagian besar wilayah namun kualitas belum merata; kegiatan ekonomi relatif lancar meski masih ada kendala.",
    "Infrastruktur fisik baik dan merata; listrik dan logistik tersedia luas; internet berkualitas dengan jangkauan luas; hambatan ekonomi sangat berkurang.",
    "Infrastruktur fisik dan digital modern, merata, berkelanjutan, dan terintegrasi; jalan, listrik, logistik, dan internet berkualitas tinggi hingga ke wilayah terpencil; mendukung penuh investasi, perdagangan, inovasi, dan transformasi ekonomi digital.",
  ],
  "P2|2.7": [
    "Eksploitasi SDA tanpa mempertimbangkan kelestarian; kerusakan lingkungan parah; dampak sosial-ekonomi negatif sangat besar.",
    "Ada regulasi pengelolaan SDA namun implementasi lemah; praktik konservasi minim; masyarakat lokal kurang diuntungkan; kerusakan lingkungan tetap tinggi.",
    "Pengelolaan SDA cukup terkendali; ada upaya konservasi namun belum konsisten; dampak sosial-ekonomi sebagian positif tetapi masih terjadi konflik kepentingan.",
    "Pengelolaan SDA berkelanjutan dengan praktik konservasi kuat; masyarakat lokal memperoleh manfaat signifikan; dampak negatif lingkungan relatif kecil.",
    "Pengelolaan SDA sepenuhnya berkelanjutan, berbasis konservasi, teknologi hijau, dan keadilan sosial; masyarakat lokal sangat diuntungkan; dampak negatif lingkungan sangat minim; SDA menjadi pilar pembangunan berkelanjutan jangka panjang.",
  ],
  "P2|2.8": [
    "Investasi sangat rendah; mayoritas investasi tidak berkualitas dan hanya berorientasi jangka pendek; tingkat retensi investor rendah; dampak ekonomi minim.",
    "Investasi meningkat sedikit; kualitas sebagian rendah; retensi investor terbatas; dampak ekonomi positif tetapi hanya dirasakan sebagian sektor.",
    "Investasi cukup stabil baik PMA maupun PMDN; kualitas sedang; retensi investor cukup baik; dampak ekonomi moderat pada lapangan kerja dan sektor riil.",
    "Investasi tinggi dengan kualitas baik; retensi investor kuat; transfer teknologi mulai berjalan; dampak ekonomi signifikan pada pertumbuhan dan lapangan kerja.",
    "Investasi sangat tinggi, berkualitas, berkelanjutan, dan terdiversifikasi; retensi investor sangat kuat; transfer teknologi, inovasi, dan kolaborasi industri berjalan optimal; dampak ekonomi sangat besar, merata, dan berjangka panjang.",
  ],
  "P2|2.9": [
    "Volume ekspor sangat rendah; produk ekspor terbatas pada komoditas mentah; daya saing global lemah; akses pasar internasional minim.",
    "Volume ekspor meningkat sedikit; diversifikasi produk terbatas; daya saing rendah; ekspor masih bergantung pada pasar tertentu.",
    "Volume ekspor cukup stabil; ada diversifikasi produk namun masih terkonsentrasi; daya saing sedang; pasar global mulai terbuka namun terbatas.",
    "Volume ekspor tinggi; produk beragam dengan nilai tambah; daya saing kuat di pasar global; akses perdagangan internasional luas.",
    "Volume ekspor sangat tinggi dan berkelanjutan; produk beragam, inovatif, dan bernilai tambah tinggi; daya saing global sangat kuat; akses pasar internasional luas dan mendominasi rantai nilai global.",
  ],
  "P2|2.10": [
    "Angka kemiskinan sangat tinggi (>15%); gini ratio >0,45 (ketimpangan sangat lebar); akses layanan dasar terbatas.",
    "Angka kemiskinan tinggi (10–15%); gini ratio 0,40–0,45; akses layanan dasar mulai membaik namun belum merata.",
    "Angka kemiskinan moderat (7–10%); gini ratio 0,35–0,39; akses layanan dasar cukup luas namun masih ada kesenjangan.",
    "Angka kemiskinan rendah (5–7%); gini ratio 0,30–0,34; akses layanan dasar baik dan cukup merata; kesenjangan berkurang signifikan.",
    "Angka kemiskinan sangat rendah (<5%); gini ratio <0,30 (distribusi pendapatan merata); akses layanan dasar sepenuhnya merata dan berkualitas; kesejahteraan masyarakat inklusif dan berkelanjutan.",
  ],
  "P2|2.11": [
    "Produktivitas tenaga kerja sangat rendah; keterampilan minim; inovasi lokal hampir tidak ada; ketergantungan pada sektor tradisional tinggi.",
    "Produktivitas rendah; keterampilan dasar mulai ditingkatkan namun terbatas; inovasi lokal masih sporadis; adopsi teknologi minim.",
    "Produktivitas cukup stabil; keterampilan tenaga kerja meningkat; inovasi lokal ada namun belum sistematis; adopsi teknologi berjalan terbatas.",
    "Produktivitas tinggi; tenaga kerja terampil dan adaptif; inovasi lokal berkembang baik dan berbasis potensi daerah; teknologi diadopsi cukup luas.",
    "Produktivitas sangat tinggi; tenaga kerja kompetitif di tingkat global; inovasi lokal berkelanjutan, terintegrasi dengan industri kreatif & teknologi maju; ekonomi daerah menjadi motor pertumbuhan nasional.",
  ],
  "P2|2.12": [
    "Akses layanan keuangan sangat terbatas; mayoritas masyarakat tidak memiliki rekening bank; UMKM kesulitan mendapatkan modal; literasi keuangan sangat rendah.",
    "Akses layanan keuangan mulai meningkat namun masih terbatas; sebagian masyarakat memiliki rekening bank; UMKM hanya sedikit yang dapat akses kredit; literasi keuangan rendah.",
    "Akses layanan keuangan cukup luas; sebagian besar masyarakat memiliki rekening bank; UMKM mulai mendapat dukungan modal; literasi keuangan sedang.",
    "Akses layanan keuangan tinggi; hampir semua masyarakat dewasa memiliki rekening bank; UMKM cukup mudah mendapat kredit; literasi keuangan baik; layanan keuangan digital mulai berkembang pesat.",
    "Akses layanan keuangan sangat tinggi & inklusif; seluruh masyarakat dewasa dan UMKM memiliki akses penuh terhadap perbankan, fintech, asuransi, dan investasi; literasi keuangan sangat baik; inklusi keuangan mendorong pertumbuhan ekonomi berkelanjutan.",
  ],
  "P2|2.13": [
    "Perekonomian sangat rentan terhadap guncangan; ketahanan pangan lemah; harga pokok sering tidak terkendali; mekanisme pemulihan lambat.",
    "Ketahanan ekonomi rendah; ada cadangan pangan terbatas; harga pokok sering fluktuatif; shock index menunjukkan pemulihan lambat dan parsial.",
    "Ketahanan ekonomi cukup stabil; cadangan pangan memadai; harga pokok terkendali sebagian besar waktu; shock index menunjukkan pemulihan moderat.",
    "Ketahanan ekonomi baik; cadangan pangan kuat dan terdistribusi; harga pokok relatif stabil; shock index menunjukkan pemulihan cepat.",
    "Ketahanan ekonomi sangat kuat dan adaptif; sistem pangan tangguh, mandiri, dan berkelanjutan; harga pokok selalu stabil; shock index menunjukkan pemulihan sangat cepat dengan dampak minimal ke masyarakat.",
  ],
  "P2|2.14": [
    "Rasio elektrifikasi sangat rendah; akses air bersih & sanitasi minim; transportasi publik terbatas; akses internet sangat rendah dan tidak merata.",
    "Infrastruktur dasar tersedia sebagian; rasio elektrifikasi moderat; akses air bersih & sanitasi belum layak; transportasi publik minim; akses internet ada namun terbatas kualitas dan cakupannya.",
    "Infrastruktur dasar cukup baik; rasio elektrifikasi tinggi (>85%); akses air bersih & sanitasi tersedia cukup luas; transportasi publik berjalan terbatas tapi memadai; akses internet menjangkau sebagian besar wilayah dengan kualitas sedang.",
    "Infrastruktur dasar merata dan berkualitas; rasio elektrifikasi mendekati universal (>95%); akses air bersih & sanitasi baik; transportasi publik memadai dan terjangkau; akses internet cepat dengan jangkauan luas.",
    "Infrastruktur dasar dan digital sepenuhnya universal; rasio elektrifikasi 100%; akses air bersih & sanitasi modern dan merata; transportasi publik modern, efisien, ramah lingkungan; akses internet cepat, stabil, dan merata hingga ke wilayah terpencil.",
  ],
  "P2|2.15": [
    "Rasio investasi terhadap PDB sangat rendah (<15%); mayoritas investasi tidak berkualitas (sekadar spekulasi, jangka pendek); tingkat retensi investor rendah; dampak lapangan kerja dan nilai tambah sangat minim.",
    "Rasio investasi terhadap PDB rendah (15–20%); sebagian investasi berkualitas rendah; retensi investor terbatas; dampak pada lapangan kerja dan nilai tambah kecil.",
    "Rasio investasi terhadap PDB moderat (20–25%); investasi cukup berkualitas; retensi investor cukup baik; kontribusi pada lapangan kerja dan nilai tambah sedang.",
    "Rasio investasi terhadap PDB tinggi (25–30%); mayoritas investasi berkualitas; retensi investor kuat; investasi menghasilkan banyak lapangan kerja, transfer teknologi, dan nilai tambah signifikan.",
    "Rasio investasi terhadap PDB sangat tinggi (>30%); investasi sangat berkualitas, berkelanjutan, dan terdiversifikasi; retensi investor sangat kuat; kontribusi besar terhadap penciptaan lapangan kerja, transfer teknologi, inovasi, serta nilai tambah ekonomi yang berjangka panjang.",
  ],
  "P2|2.16": [
    "Nilai ekspor nonmigas sangat rendah; ekspor terkonsentrasi pada komoditas mentah; hampir tidak ada produk bersertifikasi internasional.",
    "Nilai ekspor nonmigas meningkat sedikit; diversifikasi produk terbatas pada sektor tertentu; akses sertifikasi internasional minim dan hanya dinikmati sebagian kecil eksportir.",
    "Nilai ekspor nonmigas cukup stabil; diversifikasi produk mulai berjalan namun masih didominasi komoditas tertentu; sebagian produk telah memperoleh sertifikasi internasional.",
    "Nilai ekspor nonmigas tinggi; produk ekspor beragam dengan nilai tambah signifikan; banyak produk sudah memiliki sertifikasi internasional; daya saing di pasar global cukup kuat.",
    "Nilai ekspor nonmigas sangat tinggi dan berkelanjutan; produk ekspor sangat terdiversifikasi dengan dominasi barang bernilai tambah tinggi; hampir seluruh produk strategis memiliki sertifikasi internasional; daya saing global sangat kuat dan Indonesia berperan penting dalam rantai nilai global.",
  ],
  "P2|2.17": [
    "Kesenjangan ekonomi sangat tinggi; gini rasio >0,45; ketimpangan urban–rural dan antarwilayah ekstrem; pembangunan sangat terpusat di wilayah tertentu.",
    "Kesenjangan tinggi; gini rasio 0,40–0,45; akses layanan dasar dan pendapatan di wilayah luar Jawa/rural jauh tertinggal; kebijakan pemerataan minim.",
    "Kesenjangan moderat; gini rasio 0,35–0,39; sebagian wilayah sudah menikmati pertumbuhan ekonomi; kebijakan pemerataan ada namun belum efektif.",
    "Kesenjangan rendah; gini rasio 0,30–0,34; distribusi pendapatan cukup merata antarwilayah; akses layanan dasar dan infrastruktur relatif setara; kebijakan pemerataan berjalan efektif.",
    "Kesenjangan sangat rendah; gini rasio <0,30; distribusi pendapatan merata antarwilayah (urban–rural, Jawa–luar Jawa); pembangunan sepenuhnya inklusif dan berkeadilan; seluruh wilayah memperoleh manfaat pertumbuhan ekonomi secara seimbang.",
  ],
  "P2|2.18": [
    "Ekonomi sangat bergantung pada sektor primer (komoditas mentah); kontribusi sektor sekunder dan tersier rendah; sangat rentan terhadap fluktuasi global (harga komoditas, krisis).",
    "Struktur ekonomi mulai beragam namun masih didominasi sektor primer; kontribusi sektor sekunder dan tersier tumbuh terbatas; kerentanan terhadap fluktuasi global tetap tinggi.",
    "Struktur ekonomi cukup seimbang antara sektor primer, sekunder, dan tersier; kontribusi industri/manufaktur mulai kuat; ekonomi relatif tahan terhadap sebagian fluktuasi global.",
    "Struktur ekonomi terdiversifikasi dengan baik; kontribusi sektor sekunder dan tersier signifikan; sektor primer dikelola berkelanjutan; ekonomi cukup tangguh terhadap fluktuasi global.",
    "Struktur ekonomi sangat terdiversifikasi dan modern; kontribusi sektor sekunder dan tersier dominan dengan basis inovasi dan teknologi; ketahanan tinggi terhadap fluktuasi global; perekonomian berdaya saing tinggi di tingkat internasional.",
  ],

  // P3
  "P3|3.1": [
    "Akses pendidikan sangat terbatas; fasilitas buruk; tingkat literasi rendah; angka buta huruf tinggi.",
    "Akses pendidikan mulai meningkat tetapi masih timpang antarwilayah; fasilitas minim; literasi rendah; angka buta huruf masih signifikan.",
    "Akses pendidikan cukup luas; fasilitas relatif memadai; tingkat literasi sedang; angka buta huruf menurun moderat.",
    "Akses pendidikan hampir merata; fasilitas baik; literasi tinggi; angka buta huruf sangat rendah.",
    "Akses pendidikan sepenuhnya merata dan inklusif; fasilitas modern dan berkualitas; literasi sangat tinggi; angka buta huruf mendekati nol; pendidikan berperan sebagai motor utama pembangunan manusia.",
  ],
  "P3|3.2": [
    "AKI/AKB sangat tinggi; akses layanan kesehatan sangat terbatas; fasilitas minim; angka stunting tinggi; harapan hidup rendah.",
    "AKI/AKB mulai menurun namun masih tinggi; akses layanan kesehatan terbatas di banyak wilayah; fasilitas dasar tersedia namun tidak memadai; angka stunting cukup tinggi; harapan hidup rendah–sedang.",
    "AKI/AKB moderat; akses layanan kesehatan cukup luas; fasilitas kesehatan cukup memadai; angka stunting menurun moderat; harapan hidup meningkat sedang.",
    "AKI/AKB rendah; akses layanan kesehatan luas; fasilitas baik; angka stunting rendah; harapan hidup tinggi.",
    "AKI/AKB sangat rendah; akses layanan kesehatan universal; fasilitas modern; angka stunting hampir nol; harapan hidup sangat tinggi; kesehatan masyarakat berkelanjutan.",
  ],
  "P3|3.3": [
    "Penghormatan HAM rendah; diskriminasi tinggi; penegakan hukum tidak adil.",
    "Upaya HAM ada tapi lemah; diskriminasi masih umum; kesetaraan terbatas.",
    "Penghormatan HAM cukup; diskriminasi menurun; penegakan hukum sedang.",
    "HAM dihormati kuat; diskriminasi rendah; kesetaraan hampir penuh.",
    "HAM sepenuhnya dihormati; tidak ada diskriminasi; kesetaraan dan keadilan universal.",
  ],
  "P3|3.4": [
    "Toleransi rendah; konflik agama sering; kerukunan sosial lemah.",
    "Toleransi mulai meningkat; konflik sesekali; kerukunan terbatas.",
    "Toleransi cukup; konflik menurun; kerukunan sedang.",
    "Toleransi tinggi; konflik jarang; kerukunan kuat.",
    "Toleransi sangat tinggi; kerukunan harmonis; masyarakat inklusif berbasis nilai agama.",
  ],
  "P3|3.5": [
    "Nilai sosial-budaya terabaikan; pariwisata tidak berkembang; kontribusi ekonomi minim.",
    "Nilai budaya mulai dilestarikan; pariwisata terbatas; kontribusi kecil.",
    "Nilai budaya cukup maju; pariwisata berkembang; kontribusi sedang.",
    "Nilai budaya kuat; pariwisata inklusif; kontribusi signifikan.",
    "Nilai sosial-budaya lestari & inklusif; pariwisata berkelanjutan; kontribusi ekonomi besar.",
  ],
  "P3|3.6": [
    "Tingkat kejahatan sangat tinggi; penegakan hukum lemah; masyarakat tidak percaya pada aparat.",
    "Tingkat kejahatan tinggi; penegakan hukum tidak konsisten; kepercayaan rendah.",
    "Tingkat kejahatan moderat; penegakan cukup; kepercayaan mulai meningkat.",
    "Tingkat kejahatan rendah; penegakan efektif; kepercayaan tinggi.",
    "Tingkat kejahatan sangat rendah; sistem preventif kuat; aparat dipercaya penuh.",
  ],
  "P3|3.7": [
    "Perlindungan sosial sangat lemah; banyak tidak terjangkau BPJS/bansos; akses disabilitas & lansia minim.",
    "Perlindungan sebagian; cakupan rendah; akses terbatas.",
    "Perlindungan cukup; mencakup sebagian besar; akses mulai diperhatikan.",
    "Perlindungan kuat; menjangkau hampir semua; akses merata.",
    "Perlindungan inklusif & komprehensif; BPJS universal; akses penuh bagi rentan.",
  ],
  "P3|3.8": [
    "Akses transportasi, listrik, air bersih terbatas; literasi digital sangat rendah; kesenjangan tinggi.",
    "Akses mulai tersedia tapi belum merata; literasi rendah.",
    "Akses cukup luas; literasi sedang; layanan digital dasar.",
    "Fasilitas merata; literasi tinggi; penggunaan teknologi aktif.",
    "Fasilitas modern & inklusif; literasi sangat tinggi; masyarakat optimal digital.",
  ],
  "P3|3.9": [
    "IPM sangat rendah; pendidikan, kesehatan, daya beli buruk.",
    "IPM rendah; perbaikan terbatas.",
    "IPM sedang; akses cukup baik; daya beli moderat.",
    "IPM tinggi; pendidikan & kesehatan baik; daya beli kuat.",
    "IPM sangat tinggi; kualitas manusia setara negara maju.",
  ],
  "P3|3.10": [
    "Partisipasi perempuan sangat rendah; diskriminasi tinggi; kekerasan tidak ditangani.",
    "Partisipasi meningkat terbatas; perlindungan lemah.",
    "Partisipasi cukup; perlindungan berjalan tapi belum konsisten.",
    "Partisipasi tinggi; perlindungan efektif; kekerasan rendah.",
    "Kesetaraan penuh; perempuan terwakili proporsional; perlindungan komprehensif.",
  ],
  "P3|3.11": [
    "Akses layanan kesehatan khusus hampir tidak tersedia; fasilitas tidak ramah; diskriminasi tinggi.",
    "Layanan tersedia terbatas; fasilitas sebagian ramah; perlindungan minim.",
    "Layanan cukup tersedia; fasilitas mulai ramah; perlindungan berjalan.",
    "Layanan merata; fasilitas sebagian besar ramah; perlindungan kuat.",
    "Layanan modern & inklusif; fasilitas sepenuhnya ramah; kualitas hidup tinggi.",
  ],
  "P3|3.12": [
    "Urbanisasi tidak terkendali; akses pekerjaan terbatas; dampak negatif tinggi; tidak ada program.",
    "Urbanisasi sebagian terkendali; akses terbatas; dampak cukup tinggi; program tidak efektif.",
    "Urbanisasi cukup terkendali; akses cukup; dampak berkurang; program terbatas.",
    "Urbanisasi baik; akses luas; dampak rendah; program aktif.",
    "Urbanisasi komprehensif; akses inklusif; dampak minimal; pemerataan desa-kota.",
  ],
  "P3|3.13": [
    "Akses perangkat digital sangat rendah; pelatihan tidak ada; penggunaan non-produktif.",
    "Akses sebagian; pelatihan terbatas; produktif rendah.",
    "Akses cukup; pelatihan rutin; produktif meningkat moderat.",
    "Akses tinggi; program inklusif; produktif luas.",
    "Akses universal; pelatihan masif; masyarakat inovatif digital global.",
  ],

  // P4
  "P4|4.1": [
    "Tidak ada kesiapan; program minim; masyarakat sangat rentan.",
    "Kesiapan rendah; program terbatas; kerentanan tinggi.",
    "Kesiapan sedang; program cukup; kerentanan menurun.",
    "Kesiapan tinggi; program komprehensif; kerentanan rendah.",
    "Kesiapan sangat tinggi; adaptasi terintegrasi; masyarakat tangguh.",
  ],
  "P4|4.2": [
    "Emisi sangat tinggi; energi fosil penuh; edukasi nihil.",
    "Mitigasi terbatas; fosil dominan; edukasi minim.",
    "Emisi terkendali; terbarukan mulai; edukasi cukup.",
    "Emisi rendah; terbarukan luas; kesadaran tinggi.",
    "Emisi sangat rendah; terbarukan utama; masyarakat rendah karbon.",
  ],
  "P4|4.3": [
    "Kualitas buruk (atas WHO); transportasi tidak ramah; dampak kesehatan tinggi.",
    "Polusi tinggi; transportasi minim ramah; kesadaran rendah.",
    "Kualitas cukup; polusi menurun; transportasi terbatas ramah.",
    "Kualitas baik; mendekati WHO; transportasi luas ramah.",
    "Kualitas sangat baik; sesuai WHO; kota hijau dengan partisipasi publik.",
  ],
  "P4|4.4": [
    "Akses terbatas; kualitas buruk; bergantung sumber tercemar.",
    "Akses belum merata; kualitas rendah; pengelolaan lemah.",
    "Akses cukup; kualitas layak sebagian; program berjalan.",
    "Akses luas; kualitas sesuai standar; pengelolaan efektif.",
    "Akses universal; kualitas tinggi; sumber terjaga berkelanjutan.",
  ],
  "P4|4.5": [
    "Sampah menumpuk; tidak ada sistem; limbah mencemari; kesadaran rendah.",
    "Pengelolaan terbatas; daur ulang minim; partisipasi minim.",
    "Pengelolaan cukup; daur ulang sebagian; kesadaran sedang.",
    "Pengelolaan baik; daur ulang luas; partisipasi tinggi.",
    "Sistem modern; circular economy; masyarakat aktif bebas sampah.",
  ],
  "P4|4.6": [
    "Perumahan tidak layak; boros energi; rentan bencana.",
    "Sebagian layak; efisiensi rendah; ketahanan minim.",
    "Cukup layak; teknologi hemat energi; ketahanan sebagian.",
    "Layak merata; efisiensi luas; ketahanan tinggi.",
    "Modern ramah lingkungan; tahan bencana; akses setara.",
  ],
  "P4|4.7": [
    "RTH minim; kualitas buruk; akses terbatas.",
    "RTH sebagian; kualitas rendah; akses terbatas.",
    "RTH cukup; kualitas sedang; akses baik.",
    "RTH luas; kualitas baik; akses tinggi.",
    "RTH sangat luas; berkualitas tinggi; inklusif universal.",
  ],
  "P4|4.8": [
    "Energi fosil hampir penuh; terbarukan <5%; tidak ada transisi.",
    "Terbarukan kecil <10%; program minim.",
    "Terbarukan 10–20%; program cukup.",
    "Terbarukan 20–40%; transisi aktif.",
    "Terbarukan >50%; sistem bersih terwujud.",
  ],
  "P4|4.9": [
    "Deforestasi tinggi; konservasi lemah; degradasi masif.",
    "Konservasi terbatas; deforestasi tinggi; rehabilitasi minim.",
    "Konservasi sebagian; deforestasi terkendali; rehabilitasi berhasil terbatas.",
    "Konservasi kuat; deforestasi rendah; rehabilitasi luas.",
    "Konservasi sangat kuat; deforestasi nol; hayati terjaga global.",
  ],
  "P4|4.10": [
    "Kualitas sangat buruk; polutan atas WHO; penyakit tinggi; tidak ada pengendalian.",
    "Buruk; polutan sering melebihi; implementasi lemah.",
    "Cukup terkendali; sesekali melebihi; pengendalian mulai.",
    "Baik; mendekati WHO; pengendalian efektif.",
    "Sangat baik; sesuai WHO; sistem real-time dengan partisipasi.",
  ],
  "P4|4.11": [
    "Akses <50%; kualitas buruk; sanitasi minim.",
    "50–70%; kualitas belum standar; sanitasi rendah.",
    "70–85%; kualitas sebagian standar; sanitasi luas.",
    "85–95%; kualitas baik; sanitasi layak merata.",
    ">95%; kualitas sangat baik; sanitasi modern universal.",
  ],
  "P4|4.12": [
    "Volume tinggi; daur ulang nihil; TPA open dumping.",
    "Daur ulang <10%; TPA tradisional.",
    "Daur ulang 10–30%; TPA semi-modern.",
    "Daur ulang 30–50%; TPA modern.",
    "Daur ulang >50%; circular economy terintegrasi.",
  ],
  "P4|4.13": [
    "Fosil penuh; terbarukan <5%; tidak ada strategi.",
    "Terbarukan 5–10%; kebijakan minim.",
    "10–20%; kebijakan mulai; investasi terbatas.",
    "20–40%; kebijakan kuat; teknologi luas.",
    ">50%; transisi berhasil; pemimpin regional.",
  ],
  "P4|4.14": [
    "Deforestasi sangat tinggi; konservasi minim; rehabilitasi nihil.",
    "Deforestasi tinggi; konservasi terbatas; dampak kecil.",
    "Deforestasi terkendali; konservasi moderat; berhasil terbatas.",
    "Deforestasi rendah; konservasi luas; hasil signifikan.",
    "Deforestasi nol; konservasi internasional; rehabilitasi masif.",
  ],

  // P5
  "P5|5.1": [
    "Ekonomi tergantung raw material; green economy nihil; diversifikasi minim.",
    "Inisiatif green kecil; diversifikasi terbatas; teknologi minim.",
    "Diversifikasi cukup; green di sektor strategis; teknologi belum sistematis.",
    "Terdiversifikasi inovatif; green konsisten; teknologi standar.",
    "Berbasis inovasi keberlanjutan; green pilar utama; tangguh global.",
  ],
  "P5|5.2": [
    "Investasi R&D <0,2% PDB; kolaborasi nihil; paten minim; SDM tidak terlatih.",
    "0,2–0,5%; kolaborasi sporadis; paten lemah; SDM bertambah tapi rendah.",
    "0,5–1%; kolaborasi cukup; paten meningkat; SDM berkembang.",
    "1–2%; kolaborasi kuat; paten tinggi; SDM profesional regional.",
    ">2%; kolaborasi terintegrasi; paten global; SDM unggul dunia.",
  ],
  "P5|5.3": [
    "Kolaborasi nihil; hasil riset tak diadopsi; ekosistem fragmentasi.",
    "Inisiatif sporadis; adopsi kecil; peran terbatas.",
    "Kolaborasi cukup; adopsi sebagian; mekanisme uji coba.",
    "Kolaborasi kuat; mayoritas diadopsi; ekosistem inklusif.",
    "Terintegrasi quadruple helix; adopsi masif; motor transformasi.",
  ],
  "P5|5.4": [
    "Dampak negatif sosial/lingkungan; tidak ada penilaian.",
    "Sebagian perhatian; dampak positif kecil; greenwashing.",
    "Cukup perhatian; CSR ada; dampak positif sedang.",
    "Manfaat sosial signifikan; lingkungan terkendali; assessment tiap inovasi.",
    "Positif luas; restorasi ekosistem; sistem pengukuran transparan.",
  ],
  "P5|5.5": [
    "Tidak efektif; produktivitas rendah; biaya tinggi.",
    "Dampak kecil; biaya masih tinggi; bergantung subsidi.",
    "Cukup efektif; biaya moderat; rencana finansial.",
    "Sangat efektif; efisien; model berkelanjutan.",
    "Optimal; maksimal produktivitas; ROI tinggi & inovatif.",
  ],
  "P5|5.6": [
    "Regulasi menghambat; insentif nihil; HKI lemah.",
    "Beberapa dukungan terbatas; insentif segelintir; penegakan lemah.",
    "Cukup pro-inovasi; insentif terbatas; HKI berjalan.",
    "Kuat inklusif; insentif luas; ekosistem startup pesat; HKI efektif.",
    "Sangat pro; adaptive policy; unicorn banyak; HKI internasional.",
  ],
  "P5|5.7": [
    "Kolaborasi nihil; kontribusi minim; GII rendah stagnan.",
    "Sejumlah kecil; kontribusi kecil; GII naik sedikit.",
    "Cukup aktif; kontribusi moderat; GII menengah tren positif.",
    "Luas konsisten; kontribusi tinggi; GII kompetitif regional.",
    "Intensif berdampak; kontribusi sangat tinggi; GII unggul global.",
  ],
  "P5|5.8": [
    "Adopsi sangat rendah; pelatihan nihil; smart city tidak ada.",
    "Adopsi terbatas; pelatihan minim; pilot project.",
    "Adopsi cukup; pelatihan rutin; smart city sebagian.",
    "Adopsi tinggi; pelatihan berkelanjutan; smart city terintegrasi.",
    "Adopsi sangat tinggi; masyarakat cerdas; smart city penuh partisipatif.",
  ],
  "P5|5.9": [
    "Startup nihil; UMKM teknologi sedikit; dukungan tidak ada.",
    "Kecil muncul; dukungan terbatas.",
    "Pertumbuhan stabil; dukungan tersedia terbatas.",
    "Tinggi beragam; dukungan kuat pendanaan pasar.",
    "Ekosistem matang; unicorn lahir; UMKM pilar nasional global.",
  ],
  "P5|5.10": [
    "Tidak diadopsi; survei nihil; dampak tidak diukur.",
    "Sebagian kecil; survei tidak rutin; pengukuran minim.",
    "Sebagian besar; survei berkala terbatas; dampak sebagian.",
    "Mayoritas luas; survei rutin; dampak komprehensif.",
    "Masif sistematis; kepuasan tinggi; evaluasi menyeluruh transparan.",
  ],
};

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

// ==== TUJUAN per kriteria (direvisi lebih lengkap dalam bentuk poin, ringkas, sesuai dokumen) ====
const TUJUANS = {
  // ===== P1 Tata Kelola =====
  "P1|1.1": [
    "Menjamin regulasi dibuat mandiri dan berbasis kepentingan nasional.",
    "Memastikan transparansi, keadilan, dan keterbukaan dalam perumusan kebijakan.",
    "Mendorong evaluasi berkala dan uji publik untuk dampak positif bagi masyarakat.",
  ],
  "P1|1.2": [
    "Menjamin akses informasi publik yang akurat dan mudah dijangkau.",
    "Memanfaatkan teknologi digital untuk keterbukaan data yang ramah pengguna.",
    "Mendorong akses cepat, setara, dan tanpa hambatan bagi masyarakat.",
  ],
  "P1|1.3": [
    "Memastikan laporan keuangan dan kinerja transparan serta auditabel.",
    "Mendorong tindak lanjut atas hasil audit dan pengaduan publik.",
    "Membangun akuntabilitas melalui mekanisme pengawasan independen.",
  ],
  "P1|1.4": [
    "Meningkatkan koordinasi antarlembaga untuk efektivitas pemerintahan.",
    "Melibatkan masyarakat dalam perumusan kebijakan melalui forum seperti Musrenbang.",
    "Memastikan kebijakan inklusif, sinergis, dan sesuai kebutuhan publik.",
  ],
  "P1|1.5": [
    "Menegakkan hukum secara adil, transparan, dan tidak diskriminatif.",
    "Mencegah dan memberantas korupsi melalui sistem pengawasan kuat.",
    "Melindungi whistleblower dan melibatkan publik dalam pengawasan.",
  ],
  "P1|1.6": [
    "Mencapai target kinerja dengan optimalisasi sumber daya dan produktivitas tinggi.",
    "Menyelesaikan masalah publik secara cepat, tepat, dan inovatif.",
    "Memastikan efisiensi operasional dan responsivitas pemerintahan.",
  ],
  "P1|1.7": [
    "Menyediakan layanan publik yang cepat, adil, dan konsisten.",
    "Menjangkau seluruh masyarakat, termasuk daerah terpencil dan kelompok rentan.",
    "Meningkatkan kepuasan dan keandalan layanan bagi masyarakat.",
  ],
  "P1|1.8": [
    "Memastikan pemerintahan transparan dan efisien melalui digitalisasi.",
    "Mendorong integrasi layanan publik dan penggunaan big data/AI/IoT.",
    "Meningkatkan literasi digital masyarakat dan keamanan ekosistem digital.",
  ],
  "P1|1.9": [
    "Memastikan pemimpin memiliki visi jelas dan integritas tinggi.",
    "Mendorong partisipasi masyarakat dan respons cepat dalam krisis.",
    "Membangun kepercayaan publik melalui keputusan berbasis data.",
  ],
  "P1|1.10": [
    "Menjamin regulasi keamanan siber dan privasi data yang kuat.",
    "Meningkatkan kesiapan menghadapi ancaman siber dengan sistem prediktif.",
    "Membangun kepercayaan publik terhadap ekosistem digital nasional.",
  ],
  "P1|1.11": [
    "Menjamin akses layanan publik setara bagi semua wilayah dan kelompok rentan.",
    "Mengurangi kesenjangan antarwilayah melalui kebijakan inklusif.",
    "Memastikan kualitas layanan yang adil dan berkualitas tinggi.",
  ],

  // ===== P2 Ekonomi =====
  "P2|2.1": [
    "Menjamin pertumbuhan PDRB stabil dan inklusif melalui diversifikasi sektor.",
    "Meningkatkan kesejahteraan masyarakat dengan nilai tambah ekonomi.",
    "Memastikan stabilitas ekonomi jangka panjang.",
  ],
  "P2|2.2": [
    "Meningkatkan PAD secara berkelanjutan dan mengurangi ketergantungan transfer pusat.",
    "Mengelola anggaran secara efisien dengan minim kebocoran.",
    "Memastikan manfaat optimal bagi masyarakat melalui pengelolaan transparan.",
  ],
  "P2|2.3": [
    "Meningkatkan pendapatan keluarga dan mengurangi kemiskinan.",
    "Memperkuat daya beli dan akses kebutuhan dasar seperti pangan dan pendidikan.",
    "Memastikan pemerataan kesejahteraan rumah tangga.",
  ],
  "P2|2.4": [
    "Menurunkan tingkat pengangguran terbuka dan meningkatkan pekerjaan layak.",
    "Menyediakan pelatihan vokasi relevan dengan pasar kerja.",
    "Memperluas akses ketenagakerjaan bagi semua kelompok.",
  ],
  "P2|2.5": [
    "Meningkatkan jumlah dan keberlanjutan UMKM serta wirausaha.",
    "Menyediakan akses modal, teknologi, dan pasar bagi UMKM.",
    "Menjadikan UMKM sebagai penggerak utama ekonomi lokal.",
  ],
  "P2|2.6": [
    "Menyediakan infrastruktur fisik dan digital yang memadai dan merata.",
    "Mendukung aktivitas ekonomi, investasi, dan konektivitas masyarakat.",
    "Memastikan infrastruktur berkelanjutan dan terjangkau.",
  ],
  "P2|2.7": [
    "Mengelola SDA secara berkelanjutan dengan fokus konservasi.",
    "Meminimalkan dampak negatif sosial-ekonomi dari eksploitasi SDA.",
    "Memberdayakan masyarakat lokal melalui manfaat SDA.",
  ],
  "P2|2.8": [
    "Meningkatkan PMA dan PMDN dengan kualitas dan keberlanjutan tinggi.",
    "Mempertahankan investor melalui retensi dan transfer teknologi.",
    "Mendukung penciptaan lapangan kerja dan pertumbuhan jangka panjang.",
  ],
  "P2|2.9": [
    "Meningkatkan volume dan diversifikasi ekspor bernilai tambah.",
    "Memperkuat daya saing global dan akses pasar internasional.",
    "Memperkuat peran Indonesia dalam rantai nilai global.",
  ],
  "P2|2.10": [
    "Mengurangi angka kemiskinan dan gini ratio secara berkelanjutan.",
    "Meningkatkan akses layanan dasar melalui kebijakan pro-rakyat.",
    "Memastikan pemerataan kesempatan ekonomi antarwilayah.",
  ],
  "P2|2.11": [
    "Meningkatkan produktivitas tenaga kerja melalui keterampilan dan teknologi.",
    "Mendorong inovasi berbasis potensi lokal.",
    "Menjadikan ekonomi daerah sebagai motor pertumbuhan nasional.",
  ],
  "P2|2.12": [
    "Memperluas akses keuangan formal bagi masyarakat dan UMKM.",
    "Meningkatkan literasi keuangan dan layanan digital seperti fintech.",
    "Mendorong pertumbuhan ekonomi inklusif dan stabilitas.",
  ],
  "P2|2.13": [
    "Memastikan ketahanan pangan dan stabilitas harga pokok.",
    "Membangun kapasitas pemulihan dari guncangan ekonomi.",
    "Memperkuat daya tahan ekonomi terhadap krisis global.",
  ],
  "P2|2.14": [
    "Menyediakan infrastruktur dasar dan digital yang merata dan berkualitas.",
    "Meningkatkan rasio elektrifikasi, akses air, dan internet hingga universal.",
    "Mendukung aktivitas ekonomi, sosial, dan pendidikan.",
  ],
  "P2|2.15": [
    "Meningkatkan rasio investasi terhadap PDB dengan kualitas tinggi.",
    "Memperkuat retensi investor dan kontribusi pada lapangan kerja.",
    "Mendorong transfer teknologi dan nilai tambah ekonomi jangka panjang.",
  ],
  "P2|2.16": [
    "Meningkatkan nilai ekspor nonmigas bernilai tambah tinggi.",
    "Mendorong diversifikasi komoditas dan sertifikasi internasional.",
    "Memperluas akses ke rantai pasok global secara berkelanjutan.",
  ],
  "P2|2.17": [
    "Mengurangi kesenjangan wilayah dan gini rasio antarurban-rural.",
    "Memastikan distribusi pendapatan merata melalui pembangunan inklusif.",
    "Mendorong keadilan ekonomi antarwilayah seperti Jawa-luar Jawa.",
  ],
  "P2|2.18": [
    "Membangun struktur ekonomi seimbang antara sektor primer, sekunder, dan tersier.",
    "Mengurangi kerentanan terhadap fluktuasi global melalui diversifikasi.",
    "Memastikan ketahanan dan daya saing ekonomi jangka panjang.",
  ],

  // ===== P3 Sosial =====
  "P3|3.1": [
    "Memastikan akses pendidikan merata dengan fasilitas memadai.",
    "Meningkatkan literasi dan tingkat melek huruf secara keseluruhan.",
    "Menjadikan pendidikan fondasi pembangunan manusia.",
  ],
  "P3|3.2": [
    "Menurunkan AKI/AKB dan stunting melalui layanan kesehatan merata.",
    "Meningkatkan harapan hidup dan fasilitas kesehatan.",
    "Mencegah penyakit dan meningkatkan derajat kesehatan masyarakat.",
  ],
  "P3|3.3": [
    "Menjamin penghormatan HAM dan penegakan hukum yang adil.",
    "Melindungi dari diskriminasi dan memastikan kesetaraan.",
    "Membangun masyarakat yang inklusif dan berkeadilan.",
  ],
  "P3|3.4": [
    "Menjaga kerukunan antarumat dan toleransi sosial.",
    "Mendorong kohesi sosial melalui dialog dan program bersama.",
    "Memastikan stabilitas sosial berbasis nilai agama dan budaya.",
  ],
  "P3|3.5": [
    "Memajukan nilai sosial-budaya dan pariwisata berkelanjutan.",
    "Melestarikan warisan budaya dan meningkatkan kontribusi ekonomi.",
    "Mendorong inklusivitas budaya bagi semua kelompok.",
  ],
  "P3|3.6": [
    "Menurunkan tingkat kejahatan melalui pencegahan efektif.",
    "Membangun kepercayaan masyarakat pada aparat keamanan.",
    "Memastikan ketertiban sosial yang adil dan profesional.",
  ],
  "P3|3.7": [
    "Memperkuat sistem perlindungan sosial seperti BPJS dan bansos.",
    "Menyediakan akses inklusif bagi disabilitas dan lansia.",
    "Memastikan jaminan sosial yang tepat sasaran dan transparan.",
  ],
  "P3|3.8": [
    "Menyediakan fasilitas umum dasar yang merata dan terjangkau.",
    "Meningkatkan literasi digital masyarakat untuk partisipasi aktif.",
    "Mendukung produktivitas dan kehidupan sosial di era digital.",
  ],
  "P3|3.9": [
    "Meningkatkan IPM melalui pendidikan dan kesehatan berkualitas.",
    "Memperkuat daya beli dan standar hidup layak.",
    "Membangun manusia produktif dan berdaya saing tinggi.",
  ],
  "P3|3.10": [
    "Meningkatkan partisipasi perempuan di jabatan publik dan ekonomi.",
    "Melindungi perempuan dari kekerasan dan diskriminasi.",
    "Memastikan kesetaraan gender dalam semua aspek pembangunan.",
  ],
  "P3|3.11": [
    "Menyediakan layanan kesehatan khusus bagi lansia dan disabilitas.",
    "Memastikan fasilitas umum ramah dan inklusif.",
    "Meningkatkan kualitas hidup dan kemandirian kelompok rentan.",
  ],
  "P3|3.12": [
    "Mengelola urbanisasi untuk akses pekerjaan layak di kota.",
    "Meminimalkan dampak negatif seperti kemiskinan dan kepadatan.",
    "Mendorong pembangunan seimbang antara desa dan kota.",
  ],
  "P3|3.13": [
    "Meningkatkan akses perangkat digital dan pelatihan literasi.",
    "Mendorong penggunaan internet produktif untuk pendidikan dan bisnis.",
    "Memastikan masyarakat siap menghadapi transformasi digital inklusif.",
  ],

  // ===== P4 Lingkungan =====
  "P4|4.1": [
    "Meningkatkan kesiapan adaptasi perubahan iklim secara sistematis.",
    "Mengurangi kerentanan sosial-ekonomi melalui program partisipatif.",
    "Menjaga keberlanjutan lingkungan bagi masyarakat.",
  ],
  "P4|4.2": [
    "Menurunkan emisi karbon dan ketergantungan energi fosil.",
    "Meningkatkan energi terbarukan dan edukasi publik rendah karbon.",
    "Mendorong gaya hidup ramah lingkungan berkelanjutan.",
  ],
  "P4|4.3": [
    "Mengendalikan emisi CO₂ dan PM2.5 sesuai standar WHO.",
    "Mendorong transportasi ramah lingkungan.",
    "Melindungi kesehatan masyarakat dari polusi udara.",
  ],
  "P4|4.4": [
    "Menjamin ketersediaan dan kualitas air bersih yang aman.",
    "Melindungi sumber air dari pencemaran dan eksploitasi.",
    "Memastikan akses terjangkau bagi semua lapisan masyarakat.",
  ],
  "P4|4.5": [
    "Mengelola sampah melalui reduce, reuse, recycle.",
    "Meningkatkan daur ulang dan pengelolaan limbah berbahaya.",
    "Melibatkan masyarakat dan industri dalam ekonomi sirkular.",
  ],
  "P4|4.6": [
    "Mendorong perumahan hemat energi dan tahan bencana.",
    "Memastikan perumahan terjangkau dan ramah lingkungan.",
    "Menciptakan hunian aman, sehat, dan berkelanjutan.",
  ],
  "P4|4.7": [
    "Meningkatkan ketersediaan dan kualitas ruang terbuka hijau.",
    "Memastikan aksesibilitas RTH untuk fungsi ekologis dan sosial.",
    "Mengurangi polusi dan meningkatkan kualitas hidup masyarakat.",
  ],
  "P4|4.8": [
    "Meningkatkan porsi energi terbarukan dalam bauran energi.",
    "Mendorong transisi dari energi fosil ke PLTS, angin, biomassa.",
    "Memastikan ketahanan energi jangka panjang yang ramah lingkungan.",
  ],
  "P4|4.9": [
    "Mengendalikan deforestasi dan melindungi ekosistem kritis.",
    "Memperkuat konservasi dan rehabilitasi keanekaragaman hayati.",
    "Menjaga keseimbangan ekologi untuk ketahanan pangan.",
  ],
  "P4|4.10": [
    "Mengendalikan emisi gas rumah kaca dan polutan udara.",
    "Mendorong energi bersih dan transportasi ramah lingkungan.",
    "Melindungi kesehatan dari dampak polusi sesuai standar WHO.",
  ],
  "P4|4.11": [
    "Menjamin akses air bersih dan sanitasi aman bagi rumah tangga.",
    "Mengurangi pencemaran dan penyakit berbasis lingkungan.",
    "Memastikan keberlanjutan sumber daya air jangka panjang.",
  ],
  "P4|4.12": [
    "Mengurangi volume sampah melalui ekonomi sirkular.",
    "Meningkatkan daur ulang dan operasi TPA modern.",
    "Meminimalkan dampak sampah terhadap kesehatan dan ekosistem.",
  ],
  "P4|4.13": [
    "Meningkatkan kontribusi energi terbarukan dalam bauran energi.",
    "Mendorong transisi ke energi bersih dan ramah lingkungan.",
    "Memastikan ketahanan energi nasional yang berkelanjutan.",
  ],
  "P4|4.14": [
    "Mengendalikan deforestasi dan meningkatkan kawasan konservasi.",
    "Mendorong rehabilitasi ekosistem dengan standar internasional.",
    "Melindungi biodiversitas untuk keberlanjutan jangka panjang.",
  ],

  // ===== P5 Inovasi Keberlanjutan =====
  "P5|5.1": [
    "Mendorong green economy dan diversifikasi sektor ramah lingkungan.",
    "Mengurangi ketergantungan pada raw material melalui inovasi.",
    "Memastikan pertumbuhan ekonomi tangguh dan berkelanjutan.",
  ],
  "P5|5.2": [
    "Meningkatkan investasi R&D dan kolaborasi universitas-industri.",
    "Mendorong paten berkualitas dan SDM litbang kompeten.",
    "Membangun daya saing berbasis ilmu pengetahuan.",
  ],
  "P5|5.3": [
    "Membangun kolaborasi lintas sektor dalam ekosistem inovasi.",
    "Memastikan hasil riset diadopsi oleh industri dan masyarakat.",
    "Mengurangi gap antara riset akademik dan kebutuhan pasar.",
  ],
  "P5|5.4": [
    "Memastikan inovasi memberikan manfaat sosial seperti inklusi dan kesejahteraan.",
    "Meminimalkan dampak negatif lingkungan dari inovasi.",
    "Mengukur impact assessment untuk keberlanjutan.",
  ],
  "P5|5.5": [
    "Meningkatkan produktivitas melalui teknologi efisien.",
    "Memastikan biaya operasional hemat dan keberlanjutan finansial.",
    "Mendorong teknologi adaptif dan hemat sumber daya.",
  ],
  "P5|5.6": [
    "Menyediakan insentif dan regulasi pro-inovasi.",
    "Memperkuat ekosistem startup dan perlindungan HKI.",
    "Menjadikan kebijakan sebagai enabler inovasi.",
  ],
  "P5|5.7": [
    "Meningkatkan kolaborasi riset internasional dan paten global.",
    "Memperbaiki peringkat di Global Innovation Index.",
    "Membangun jejaring inovasi yang diakui dunia.",
  ],
  "P5|5.8": [
    "Mempercepat adopsi teknologi digital oleh masyarakat dan bisnis.",
    "Menyediakan pelatihan literasi digital inklusif.",
    "Menerapkan smart city untuk efisiensi dan partisipasi.",
  ],
  "P5|5.9": [
    "Mendorong pertumbuhan startup dan UMKM berbasis teknologi.",
    "Menyediakan dukungan inkubator, pendanaan, dan pasar.",
    "Membangun ekosistem bisnis inovatif berdaya saing global.",
  ],
  "P5|5.10": [
    "Mengukur tingkat adopsi dan kepuasan dari inovasi.",
    "Evaluasi dampak keberlanjutan sosial, ekonomi, lingkungan.",
    "Memastikan inovasi memberikan kontribusi jangka panjang.",
  ],
};

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

export default function EMASDesktopApp() {
  const [email, setEmail] = useLocalStorage("emas_email", "");
  const [title, setTitle] = useState("Penilaian EMAS");
  const [scores, setScores] = useLocalStorage("emas_scores", {});
  const [indicators, setIndicators] = useLocalStorage("emas_indicators", {});
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [openRubricDialog, setOpenRubricDialog] = useState(null);
  const [activeTab, setActiveTab] = useState("P1");
  const result = useMemo(
    () => computeScores(weights, scores, indicators),
    [weights, scores, indicators],
  );
  const [isLoadingLatest, setIsLoadingLatest] = useState(false);
  const [currentAssessmentId, setCurrentAssessmentId] = useState(null);

  // Auto-load latest data when email changes
  useEffect(() => {
    if (email && supabase) {
      const loadLatest = async () => {
        setIsLoadingLatest(true);
        try {
          const { data, error } = await supabase
            .from("assessments")
            .select("id, title, created_at, payload")
            .eq("user_email", email)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (error && error.code !== "PGRST116") {
            throw error;
          }

          if (data) {
            const payload = data.payload || {};
            setCurrentAssessmentId(data.id);
            setScores(payload.scores || {});
            setIndicators(payload.indicators || {});
            if (payload.weights) setWeights(payload.weights);
            setTitle(payload.title || data.title || "Penilaian EMAS");
            setMessage("Data terbaru dimuat untuk email ini.");
          } else {
            setCurrentAssessmentId(null);
            setScores({});
            setIndicators({});
            setWeights(DEFAULT_WEIGHTS);
            setTitle("Penilaian EMAS");
            setMessage(
              "Tidak ada data sebelumnya untuk email ini. Mulai penilaian baru.",
            );
          }
        } catch (e) {
          toast.error(`Gagal memuat data terbaru: ${e?.message || e}`);
          setMessage(`Gagal memuat data terbaru: ${e?.message || e}`);
        } finally {
          setIsLoadingLatest(false);
        }
      };

      loadLatest();
    }
  }, [email]);

  async function saveToSupabase() {
    setMessage("");
    if (!supabase) {
      toast.error("Database belum dikonfigurasi.");
      setMessage("Database belum dikonfigurasi.");
      return;
    }
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Masukkan email Anda yang valid terlebih dahulu.");
      setMessage("Masukkan email Anda yang valid terlebih dahulu.");
      return;
    }

    setSaving(true);

    try {
      const payload = { title, weights, scores, indicators, result };

      // 1. Cek apakah sudah ada
      const { data: existing, error: selectError } = await supabase
        .from("assessments")
        .select("id") // ambil id aja biar ringan
        .eq("user_email", email)
        .eq("title", title)
        .maybeSingle(); // biar dapat null kalau tidak ada

      if (selectError) throw selectError;

      if (existing) {
        // 2a. Update kalau sudah ada
        const { error: updateError } = await supabase
          .from("assessments")
          .update({ payload, updated_at: new Date().toISOString() })
          .eq("id", existing.id);

        if (updateError) throw updateError;

        toast.success("Berhasil diupdate di Database");
        setMessage("Berhasil diupdate di Database");
      } else {
        // 2b. Insert kalau belum ada
        const { error: insertError } = await supabase
          .from("assessments")
          .insert({
            user_email: email,
            title,
            payload,
            created_at: new Date().toISOString(),
          });

        if (insertError) throw insertError;

        toast.success("Berhasil disimpan ke Database");
        setMessage("Berhasil disimpan ke Database");
      }
    } catch (e) {
      toast.error(`Gagal menyimpan: ${e?.message || e}`);
      setMessage(`Gagal menyimpan: ${e?.message || e}`);
    } finally {
      loadHistory();
      setSaving(false);
    }
  }

  async function loadHistory() {
    if (!supabase) {
      toast.error("Database belum dikonfigurasi.");
      setMessage("Database belum dikonfigurasi.");
      return;
    }
    if (!email) {
      toast.error("Masukkan email untuk memuat riwayat.");
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
      toast.error(`Gagal memuat riwayat: ${e?.message || e}`);
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
      if (id === currentAssessmentId) {
        setCurrentAssessmentId(null); // Reset if deleting current assessment
        setScores({});
        setIndicators({});
        setWeights(DEFAULT_WEIGHTS);
        setTitle("Penilaian EMAS");
        toast.success("Penilaian berhasil dihapus.");
        setMessage("Penilaian berhasil dihapus.");
      }
    } catch (e) {
      toast.error("Gagal menghapus entri.");
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
            assessment_id: currentAssessmentId, // Include ID in export
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
    a.download = `${safeName(title)}_EMAS_${currentAssessmentId || "new"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function resetScores() {
    setScores({});
    setIndicators({});
    setCurrentAssessmentId(null); // Reset ID for new assessment
    setTitle("Penilaian EMAS");
    setWeights(DEFAULT_WEIGHTS);
    toast.success("Data berhasil direset.");
    setMessage("Data direset. Mulai penilaian baru.");
  }

  return (
    <div className="min-h-dvh w-full bg-background text-foreground pb-24">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="mx-auto max-w-screen-2xl px-6 py-3 flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/logo-icmi.png"
                      alt="logo"
                      width={60}
                      height={40}
                      className="mt-2"
                    ></Image>
                    <div className="text-base font-semibold">
                      Standarisasi EMAS ICMI
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 text-sm mx-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
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
                      Reset Indikator
                    </Button>
                  </div>
                  {message && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {message}
                    </p>
                  )}
                  {isLoadingLatest && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Memuat data terbaru...
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
                                  setCurrentAssessmentId(row.id);
                                  setScores(payload.scores || {});
                                  setIndicators(payload.indicators || {});
                                  if (payload.weights)
                                    setWeights(payload.weights);
                                  setTitle(payload.title || row.title || title);
                                  toast.success("Data dimuat dari riwayat.");
                                  setMessage("Data dimuat dari riwayat.");
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
                  <p>SA = Σ( wP × Σ( wC × IK ) ) • Karat = SA × (24/5)</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1 flex justify-between  items-center gap-2">
            <div className="flex items-center gap-2">
              <Image
                src="/logo-icmi.png"
                alt="logo"
                width={60}
                height={40}
                className="mt-2"
              ></Image>
              <div className="text-base font-semibold">
                Standarisasi EMAS ICMI
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <DeviceViewToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-screen-2xl px-6 py-3 space-y-4">
        {/* Summary Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart4 className="h-5 w-5" /> Ringkasan
              </span>
              <span className="text-xs text-muted-foreground">
                Desktop · Weighted
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4 py-2 justify-start">
              <KaratDonut value={result.karat} />
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Indikator</div>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {P.criteria.map((C) => {
                      const key = `${P.code}|${C.code}`;
                      const hasIndicators = (indicators[key]?.length || 0) > 0;
                      const val =
                        typeof scores[key] === "number" ? scores[key] : 3; // default mid
                      const count = indicators[key]?.length || 0;
                      const rubricDialogRef = useRef(null);
                      return (
                        <div key={key} className="rounded-2xl border p-3">
                          <div className="text-sm font-medium flex-1">
                            {C.code} {C.name}
                          </div>
                          <div className="flex flex-wrap items-center justify-start mt-4 gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="ml-2"
                                >
                                  Tujuan
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-screen-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Tujuan — {C.code} {C.name}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="text-sm text-muted-foreground leading-relaxed">
                                  <ul className="list-disc pl-5 space-y-1">
                                    {TUJUANS[key]?.map((tujuan, idx) => (
                                      <li key={idx}>{tujuan}</li>
                                    )) ||
                                      "Tujuan belum tersedia untuk kriteria ini."}
                                  </ul>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Dialog
                              open={openRubricDialog === key}
                              onOpenChange={(isOpen) =>
                                setOpenRubricDialog(isOpen ? key : null)
                              }
                            >
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2"
                                >
                                  Rubrik
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-screen-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Rubrik Indikator — {C.code} {C.name}
                                  </DialogTitle>
                                </DialogHeader>
                                <RubricBody
                                  rubricKey={key}
                                  value={val}
                                  onPick={(v) => {
                                    setScores({ ...scores, [key]: v });
                                    setOpenRubricDialog(null);
                                  }}
                                />
                              </DialogContent>
                            </Dialog>
                            <div className="flex items-center gap-2">
                              {count > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px]"
                                >
                                  {count} indikator
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Criteria fallback control */}
                          <div className="mt-2 flex items-center gap-3">
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={[val]}
                              onValueChange={(v) => {
                                setScores({ ...scores, [key]: v[0] });
                                setOpenRubricDialog(key); // Open rubric dialog
                                rubricDialogRef.current?.click(); // Programmatically trigger dialog
                              }}
                              className="flex-1"
                              aria-label={`Indikator ${C.name}`}
                              disabled={hasIndicators}
                            />
                            <Input
                              type="number"
                              className="w-20"
                              min={1}
                              max={5}
                              step={1}
                              value={val}
                              onChange={(e) => {
                                const n = parseFloat(e.target.value || "0");
                                setScores({
                                  ...scores,
                                  [key]: clampScore(isNaN(n) ? 3 : n),
                                });
                                setOpenRubricDialog(key); // Open rubric dialog
                                rubricDialogRef.current?.click(); // Programmatically trigger dialog
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
                                ? "Menggunakan indikator"
                                : "Menggunakan indikator kriteria"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-1 text-xs text-muted-foreground">
                    Indikator Prinsip (SP):{" "}
                    {result.perPrinciple[P.code]?.SP?.toFixed(2)} • Karat:{" "}
                    {result.perPrinciple[P.code]?.karat?.toFixed(2)}K
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        const currentIndex = weights.findIndex(
                          (w) => w.code === P.code,
                        );
                        const nextIndex = (currentIndex + 1) % weights.length;
                        setActiveTab(weights[nextIndex].code);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <ArrowRightCircle className="h-4 w-4" /> Selanjutnya
                    </Button>
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
        <div className="mx-auto max-w-screen-2xl px-6 py-2 grid grid-cols-3 gap-2">
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
  const size = 100;
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
          opacity={1.0}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round-square"
          className="text-primary"
          stroke="currentColor"
          fill="none"
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${dash} ${c - dash}` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
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

function RubricBody({ rubricKey, value, onPick }) {
  const items = RUBRICS[rubricKey];
  return (
    <div className="space-y-3">
      {!items ? (
        <div className="text-sm text-muted-foreground">
          Rubrik belum terdefinisi untuk kriteria ini. Silakan gunakan slider
          atau tambahkan indikator.
        </div>
      ) : (
        <div className="space-y-2">
          <RadioGroup
            value={String(value)}
            onValueChange={(v) => onPick(Number(v))}
          >
            {items.map((desc, idx) => {
              const s = idx + 1;
              return (
                <label
                  key={s}
                  className="flex items-start gap-3 rounded-lg border p-2 cursor-pointer"
                >
                  <RadioGroupItem value={String(s)} />
                  <div>
                    <div className="text-sm font-medium">Indikator {s}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {desc}
                    </div>
                  </div>
                </label>
              );
            })}
          </RadioGroup>
        </div>
      )}
      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={() => onPick(value)} variant="default">
            Gunakan Indikator {value}
          </Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
}
