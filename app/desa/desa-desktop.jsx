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
import { createClient } from "@supabase/supabase-js";
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
  Trash2,
  History,
  ArrowRightCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { DeviceViewToggle } from "@/components/device-toggle";
import { toast } from "sonner";
import NavDropdown from "@/components/nav-dropdown";

// ==== DATA & HELPERS ====
const RUBRICS = {
  "P1|1.1": [
    "Perdes sering dibuat hanya menyalin dari atas (kecamatan/kabupaten) tanpa melibatkan warga; tidak ada sosialisasi; tidak ada evaluasi.",
    "Perdes sebagian dibahas di desa, tetapi mayoritas masih dipengaruhi pihak luar (misal titipan proyek); musyawarah desa terbatas; evaluasi jarang.",
    "Perdes cukup mandiri; ada analisis kebutuhan warga; dibahas di musyawarah desa, namun evaluasi belum konsisten setiap tahun.",
    "Hampir semua Perdes mandiri; dibuat berdasarkan aspirasi masyarakat desa; jelas dan sesuai hukum; evaluasi tahunan dilakukan.",
    "Semua Perdes sepenuhnya mandiri; berbasis kebutuhan & aspirasi warga desa; transparan (dipasang di papan informasi/website desa); selalu dievaluasi berkala; terbukti memberi dampak positif.",
  ],
  "P1|1.2": [
    "Informasi desa tidak tersedia; papan informasi kosong; warga sulit mendapatkan data; tidak ada teknologi digital.",
    "Sebagian informasi tersedia tetapi sering tidak akurat atau tidak diperbarui; prosedur membingungkan; akses terbatas.",
    "Informasi cukup lengkap & relatif akurat; prosedur permintaan ada namun belum ramah warga; akses lambat/berbiaya; digital terbatas.",
    "Informasi lengkap, akurat, diperbarui; prosedur jelas & mudah; akses cepat & murah; sudah ada papan pengumuman, WA/website desa aktif.",
    "Semua informasi lengkap, akurat, real-time; prosedur sederhana & transparan; akses terbuka untuk semua; pemanfaatan teknologi digital optimal (aplikasi desa/website resmi, WA group).",
  ],
  "P1|1.3": [
    "Tidak ada laporan APBDes/laporan kinerja; laporan tidak bisa diperiksa; aduan warga tidak ditindaklanjuti.",
    "Ada laporan APBDes & kegiatan, tapi tidak lengkap & belum pernah diaudit; tindak lanjut aduan sangat terbatas.",
    "Laporan APBDes & kegiatan rutin tahunan; sebagian diaudit, tapi tindak lanjut tidak konsisten; akses publik terbatas.",
    "Laporan lengkap & diaudit rutin; sebagian besar rekomendasi ditindaklanjuti; aduan warga ditangani cukup efektif.",
    "Laporan lengkap & dipublikasikan terbuka; diaudit independen dengan hasil baik; semua rekomendasi audit ditindaklanjuti tepat waktu; aduan warga ditangani terbuka, cepat, efektif.",
  ],
  "P1|1.4": [
    "Tidak ada koordinasi antar perangkat desa/lembaga; musyawarah jarang; kebijakan sepihak.",
    "Koordinasi formal hanya seremonial; partisipasi warga minim.",
    "Koordinasi cukup berjalan namun tidak konsisten; musyawarah ada tapi masukan warga jarang diakomodasi.",
    "Koordinasi rutin antar lembaga; partisipasi aktif; sebagian besar masukan warga masuk program desa.",
    "Koordinasi sangat efektif, bahkan dalam krisis; partisipasi luas & setara (perempuan, pemuda, rentan); masukan warga transparan memengaruhi kebijakan.",
  ],
  "P1|1.5": [
    "Penegakan aturan desa tidak adil; penyalahgunaan tidak ditindak; tidak ada pengawasan; pelapor ditekan.",
    "Ada upaya penegakan aturan tapi bias; sebagian kasus ditindak; perlindungan pelapor lemah; warga jarang dilibatkan.",
    "Penegakan aturan cukup adil & transparan; sebagian besar kasus ditindaklanjuti; ada mekanisme pengawasan warga namun belum optimal.",
    "Penegakan aturan konsisten, adil, transparan; mayoritas kasus tertangani; ada perlindungan pelapor; warga aktif mengawasi.",
    "Penegakan aturan sepenuhnya adil & transparan; semua kasus tertangani tuntas; pelapor terlindungi penuh; warga aktif dalam pengawasan; tingkat korupsi sangat rendah.",
  ],
  "P1|1.6": [
    "Sebagian besar target pembangunan desa tidak tercapai; dana boros/tidak tepat; perangkat kurang produktif; masalah warga sering tidak terselesaikan.",
    "Sebagian target tercapai, namun penggunaan dana tidak efisien; pelayanan lambat; masalah publik sering terlambat ditangani.",
    "Sebagian besar target tercapai; dana cukup efisien; masalah warga ditangani tapi tidak konsisten; pelayanan standar.",
    "Hampir semua target tercapai; dana efisien; perangkat produktif; masalah warga sebagian besar terselesaikan tepat waktu.",
    "Semua target tercapai; dana sangat efisien & transparan; perangkat sangat produktif; pelayanan cepat & inovatif; masalah warga terselesaikan berkelanjutan.",
  ],
  "P1|1.7": [
    "Layanan publik tidak memadai; keluhan tinggi; perangkat lambat; banyak dusun tidak terlayani.",
    "Layanan publik ada tapi kualitas rendah; sering lambat; sebagian keluhan ditangani; jangkauan terbatas.",
    "Layanan cukup memadai; respon relatif cepat; sebagian besar keluhan ditangani; jangkauan belum merata.",
    "Layanan publik baik; respon cepat & konsisten; kepuasan warga tinggi; jangkauan hampir seluruh dusun.",
    "Layanan sangat berkualitas, adil, responsif, inklusif; semua keluhan cepat tertangani; layanan merata termasuk jemput bola bagi kelompok rentan.",
  ],
  "P1|1.8": [
    "Tidak ada layanan publik digital; data tertutup; literasi digital warga sangat rendah; keamanan data diabaikan.",
    "Sebagian layanan online terbatas (misalnya surat via WA); data sektoral terfragmentasi; literasi digital rendah; keamanan data minim.",
    "Sebagian besar layanan online (SID, pengumuman digital); data mulai terintegrasi; literasi digital cukup; perlindungan data dasar ada.",
    "Layanan digital terintegrasi lintas bidang; literasi digital warga tinggi; keamanan data mulai kuat & diatur SOP.",
    "Transformasi digital penuh; layanan real-time & terintegrasi; literasi digital sangat tinggi; UMKM memakai teknologi digital; keamanan data sesuai standar.",
  ],
  "P1|1.9": [
    "Kepala desa tanpa visi; komunikasi buruk; keputusan lambat/tidak tepat; integritas rendah; kepercayaan warga sangat rendah.",
    "Kepala desa punya visi tapi kurang terarah; komunikasi terbatas; keputusan tidak konsisten; integritas dipertanyakan.",
    "Kepala desa punya visi cukup jelas; komunikasi berjalan tapi kurang efektif; keputusan cukup cepat; integritas cukup baik; kepercayaan sedang.",
    "Kepala desa visioner & komunikatif; keputusan cepat & tepat; integritas kuat; partisipasi warga didorong; kepercayaan tinggi.",
    "Kepala desa visioner, komunikatif, responsif, adaptif; keputusan cepat, tepat, berbasis data; integritas sangat tinggi; partisipasi & inovasi luas; kepercayaan sangat tinggi.",
  ],
  "P1|1.10": [
    "Tidak ada aturan keamanan data; data warga disimpan sembarangan; sangat rentan bocor.",
    "Ada aturan dasar tapi implementasi lemah; sebagian data dilindungi, banyak terbuka; perangkat desa belum siap.",
    "Aturan cukup jelas; ada admin khusus; perlindungan data berjalan tapi belum menyeluruh; kesiapan moderat.",
    "Aturan keamanan kuat; data warga disimpan baik; perlindungan cukup menyeluruh; perangkat siap merespons insiden.",
    "Sistem keamanan sangat kuat (SID resmi, backup teratur); perlindungan penuh; perangkat siap dengan mekanisme preventif; kepercayaan publik sangat tinggi.",
  ],
  "P1|1.11": [
    "Akses layanan publik sangat timpang; kelompok rentan & dusun terpencil hampir tidak terlayani.",
    "Akses mulai ada tapi tidak merata; kelompok rentan hanya sebagian kecil terlayani; dusun terpencil tertinggal.",
    "Akses cukup luas; sebagian besar kelompok rentan terlayani; dusun terpencil dapat layanan dasar namun belum setara.",
    "Akses tinggi & merata hampir semua dusun; kelompok rentan sebagian besar terlayani penuh; kualitas baik.",
    "Akses sepenuhnya merata & inklusif; semua kelompok rentan & dusun terpencil terlayani penuh; kesenjangan hampir nol.",
  ],

  // P2 - Kinerja Ekonomi
  "P2|2.1": [
    "Ekonomi stagnan/menurun; bergantung satu sektor; kesejahteraan tidak naik.",
    "Tumbuh sangat rendah; masih bergantung sektor utama; manfaat hanya dirasakan sebagian kecil.",
    "Tumbuh moderat; mulai diversifikasi namun belum merata; sebagian keluarga sejahtera.",
    "Tumbuh baik & stabil; diversifikasi cukup kuat; manfaat dirasakan mayoritas keluarga.",
    "Tumbuh tinggi & berkelanjutan; sektor terdiversifikasi; manfaat merata & kualitas hidup naik signifikan.",
  ],
  "P2|2.2": [
    "PADes sangat rendah; sangat bergantung transfer; APBDes tidak efisien; kebocoran tinggi.",
    "PADes mulai naik namun kecil; ketergantungan transfer dominan; efisiensi rendah.",
    "PADes stabil moderat; ketergantungan berkurang sedikit; efisiensi anggaran sedang.",
    "PADes tinggi; BUMDes/sumber lain signifikan; APBDes efisien & transparan; kebocoran sangat rendah.",
    "PADes sangat tinggi & berkelanjutan; APBDes sangat efisien & akuntabel; manfaat optimal ke masyarakat.",
  ],
  "P2|2.3": [
    "Pendapatan keluarga sangat rendah; kemiskinan tinggi; daya beli lemah; kebutuhan dasar tak terpenuhi.",
    "Pendapatan naik terbatas; kemiskinan sedikit turun; daya beli rendah; akses kebutuhan dasar belum merata.",
    "Pendapatan stabil; kemiskinan moderat; daya beli naik; kebutuhan dasar sebagian besar terpenuhi.",
    "Pendapatan tinggi; kemiskinan rendah; daya beli kuat; kebutuhan dasar tercukupi luas.",
    "Pendapatan sangat tinggi & merata; kemiskinan sangat rendah; akses penuh ke pangan, kesehatan, pendidikan, perumahan.",
  ],
  "P2|2.4": [
    "Pengangguran sangat tinggi (>10%); peluang kerja sangat terbatas; tidak ada pelatihan; pekerjaan tidak layak.",
    "Pengangguran tinggi (7–10%); peluang kerja terbatas/musiman; pelatihan minim; banyak pekerjaan tidak layak.",
    "Pengangguran moderat (5–7%); peluang kerja cukup; pelatihan mulai menjangkau; pekerjaan layak belum merata.",
    "Pengangguran rendah (3–5%); peluang kerja luas; pelatihan berkualitas; mayoritas pekerjaan layak.",
    "Pengangguran sangat rendah (<3%); peluang kerja beragam; pelatihan inklusif; hampir semua memperoleh pekerjaan layak.",
  ],
  "P2|2.5": [
    "UMKM sangat sedikit; banyak gulung tikar; akses modal/pasar nyaris tidak ada.",
    "UMKM tumbuh tapi tidak berkelanjutan; akses modal/pasar dinikmati segelintir; pasar hanya lokal desa.",
    "UMKM cukup banyak; sebagian berkelanjutan; akses modal ada tapi belum merata; pasar lokal/kecamatan.",
    "UMKM tinggi & berkelanjutan; akses modal luas; pasar regional/nasional; mulai digital.",
    "UMKM sangat tinggi, inovatif, berkelanjutan; akses modal mudah & inklusif; pasar nasional/global; pilar ekonomi desa.",
  ],
  "P2|2.6": [
    "Jalan rusak; listrik belum merata; internet/sinyal sangat terbatas; logistik sulit; wilayah terisolasi.",
    "Infrastruktur ada tapi kualitas rendah & tidak merata; listrik tidak stabil; internet sangat terbatas; logistik terhambat.",
    "Jalan & listrik memadai; logistik mulai lancar; internet ada di sebagian besar dusun namun kualitas belum merata.",
    "Jalan baik; listrik stabil; internet luas & berkualitas; logistik lancar; hambatan ekonomi berkurang.",
    "Infrastruktur modern, merata, berkelanjutan & terintegrasi; listrik/air/internet cepat & universal; logistik sangat lancar.",
  ],
  "P2|2.7": [
    "SDA dieksploitasi tanpa kelestarian; kerusakan parah; masyarakat dirugikan.",
    "Ada aturan tapi implementasi lemah; konservasi minim; manfaat dinikmati kelompok tertentu.",
    "Pengelolaan terkendali; ada konservasi namun belum konsisten; dampak sosial-ekonomi campuran.",
    "Pengelolaan berkelanjutan; konservasi kuat; manfaat signifikan; dampak negatif kecil.",
    "Pengelolaan sepenuhnya berkelanjutan & adil; teknologi ramah lingkungan; manfaat luas; dampak negatif sangat minim.",
  ],
  "P2|2.8": [
    "Investasi sangat rendah; jangka pendek & tidak berkualitas; retensi mitra lemah; dampak minim.",
    "Investasi meningkat terbatas; kualitas sebagian rendah; dampak kecil & sempit.",
    "Investasi stabil (BUMDes/koperasi/CSR); kualitas sedang; retensi cukup; dampak moderat pada kerja/UMKM.",
    "Investasi tinggi & berkualitas; retensi mitra kuat; ada transfer pengetahuan/teknologi; dampak signifikan.",
    "Investasi sangat tinggi, inklusif, berkelanjutan & terdiversifikasi; retensi kuat; transfer teknologi optimal; dampak ekonomi besar & merata.",
  ],
  "P2|2.9": [
    "Produk dijual mentah; volume rendah; daya saing lemah; pasar hanya dalam desa.",
    "Volume naik sedikit; diversifikasi minim; daya saing rendah; pasar kecamatan terbatas.",
    "Produk stabil & beragam terbatas; daya saing sedang; pasar kabupaten/kota mulai terbuka.",
    "Produk bernilai tambah; daya saing kuat; pasar regional/nasional; masuk e-commerce/pameran.",
    "Produk sangat beragam & inovatif; daya saing sangat kuat; pasar nasional/ekspor; desa dikenal produk unggulan.",
  ],
  "P2|2.10": [
    "Kemiskinan sangat tinggi (>15%); ketimpangan lebar; akses layanan dasar sangat terbatas.",
    "Kemiskinan tinggi (10–15%); ketimpangan lebar; akses layanan dasar mulai membaik namun belum merata.",
    "Kemiskinan moderat (7–10%); kesenjangan mengecil; akses layanan dasar cukup luas namun belum setara.",
    "Kemiskinan rendah (5–7%); pemerataan baik; akses layanan dasar merata; kesenjangan turun signifikan.",
    "Kemiskinan sangat rendah (<5%); pendapatan merata; akses penuh ke layanan dasar berkualitas.",
  ],
  "P2|2.11": [
    "Produktivitas sangat rendah; keterampilan minim; hampir tidak ada inovasi; teknologi nyaris tidak dipakai.",
    "Produktivitas rendah; keterampilan dasar terbatas; inovasi sporadis; teknologi minim.",
    "Produktivitas stabil; keterampilan meningkat; inovasi lokal ada namun terbatas; teknologi mulai dipakai.",
    "Produktivitas tinggi; tenaga kerja terampil; inovasi berkembang; teknologi tepat guna diadopsi luas.",
    "Produktivitas sangat tinggi; tenaga kerja kompetitif; inovasi berkelanjutan terintegrasi ekonomi digital; desa pusat inovasi.",
  ],
  "P2|2.12": [
    "Akses keuangan sangat terbatas; mayoritas tanpa rekening; UMKM sulit modal; literasi sangat rendah.",
    "Akses mulai meningkat namun terbatas; sebagian punya rekening; sedikit UMKM mendapat kredit; literasi rendah.",
    "Akses cukup luas; mayoritas punya rekening/e-wallet/koperasi; UMKM mulai dapat modal; literasi sedang.",
    "Akses tinggi; hampir semua dewasa punya rekening; UMKM mudah kredit; literasi baik; layanan digital berkembang.",
    "Akses sangat tinggi & inklusif; semua dewasa/UMKM terlayani keuangan (bank/koperasi/fintech/asuransi); literasi sangat baik.",
  ],
  "P2|2.13": [
    "Ekonomi sangat rentan; ketahanan pangan lemah; harga kebutuhan sering melonjak; pemulihan krisis sangat lambat.",
    "Ketahanan rendah; cadangan pangan terbatas; harga fluktuatif; pemulihan lambat.",
    "Ketahanan stabil; cadangan pangan memadai; harga terkendali sebagian besar; pemulihan moderat.",
    "Ketahanan baik; cadangan kuat & terdistribusi; harga relatif stabil; pemulihan cepat (BUMDes/gotong royong).",
    "Ketahanan sangat kuat & adaptif; pangan mandiri & beragam; harga stabil; pemulihan sangat cepat dengan dampak minimal.",
  ],
  "P2|2.14": [
    "Elektrifikasi sangat rendah; air/sanitasi minim; jalan rusak; transportasi sulit; internet hampir tidak ada.",
    "Infrastruktur dasar sebagian; elektrifikasi moderat; air/sanitasi belum layak; jalan banyak rusak; internet sangat terbatas.",
    "Infrastruktur dasar cukup baik; elektrifikasi >85%; air/sanitasi untuk mayoritas; jalan memadai; internet menjangkau sebagian besar dusun.",
    "Infrastruktur dasar merata & berkualitas; elektrifikasi >95%; air/sanitasi baik; jalan & transportasi baik; internet cepat & luas.",
    "Infrastruktur dasar & digital universal & modern; listrik 100%; air/sanitasi modern; jalan/transportasi efisien & ramah lingkungan; internet cepat & merata.",
  ],
  "P2|2.15": [
    "Investasi sangat rendah; proyek jangka pendek; mitra tidak bertahan; dampak kerja & ekonomi minim.",
    "Investasi terbatas; kualitas sebagian rendah; hubungan mitra lemah; dampak kecil & sempit.",
    "Investasi stabil (BUMDes/CSR/LSM); kualitas sedang; mitra cukup bertahan; kontribusi moderat.",
    "Investasi tinggi & berkualitas; mitra bertahan lama; banyak kerja lokal & peningkatan keterampilan; nilai tambah signifikan.",
    "Investasi sangat tinggi, inklusif, berkelanjutan & terdiversifikasi; retensi kuat; kontribusi besar pada kerja, transfer pengetahuan, inovasi, & nilai tambah.",
  ],
  "P2|2.16": [
    "Produk hanya mentah; volume kecil; hampir tidak masuk pasar luar; tanpa sertifikasi.",
    "Penjualan naik sedikit; diversifikasi terbatas; pasar luar minim; hampir tanpa sertifikasi.",
    "Produk stabil & mulai olahan; pasar kabupaten/provinsi; beberapa bersertifikasi (halal/organik).",
    "Produk bernilai tambah tinggi; pasar nasional/e-commerce; banyak yang bersertifikasi; daya saing naik.",
    "Produk sangat terdiversifikasi & bernilai tinggi; sertifikasi ekspor/standar mutu luas; dikenal nasional/internasional.",
  ],
  "P2|2.17": [
    "Kesenjangan sangat tinggi; pendapatan terkonsentrasi; dusun terpencil tertinggal; layanan dasar timpang.",
    "Kesenjangan tinggi; dusun dekat lebih maju; layanan dasar belum merata; pemerataan minim.",
    "Kesenjangan moderat; pembangunan dinikmati banyak dusun; kebijakan pemerataan ada tapi belum efektif.",
    "Kesenjangan rendah; distribusi pendapatan cukup merata; layanan & infrastruktur relatif setara; program pemerataan efektif.",
    "Kesenjangan sangat rendah; pendapatan relatif merata; seluruh dusun mendapat akses penuh; pembangunan inklusif & berkeadilan.",
  ],
  "P2|2.18": [
    "Sangat bergantung satu sektor; sektor olahan/jasa sangat rendah; sangat rentan fluktuasi.",
    "Mulai beragam namun didominasi sektor primer; olahan/jasa tumbuh terbatas; tetap rentan.",
    "Cukup seimbang; sektor sekunder mulai tumbuh; jasa/perdagangan berkontribusi; lebih tahan guncangan.",
    "Terdiversifikasi baik; sekunder & tersier signifikan; primer dikelola berkelanjutan; cukup tangguh.",
    "Sangat terdiversifikasi & modern; sekunder/tersier dominan; primer produktif & berkelanjutan; sangat tangguh & berdaya saing tinggi.",
  ],

  "P3|3.1": [
    "Akses pendidikan sangat terbatas; sekolah jauh/tidak tersedia; fasilitas rusak; literasi rendah; banyak buta huruf.",
    "Akses pendidikan meningkat tapi timpang; fasilitas minim; literasi rendah; angka buta huruf signifikan.",
    "Akses cukup luas; ada SD/PAUD di sebagian besar dusun; fasilitas memadai; literasi sedang; buta huruf menurun.",
    "Akses hampir merata; fasilitas baik; literasi tinggi; angka buta huruf sangat rendah.",
    "Akses sepenuhnya merata & inklusif; fasilitas modern; literasi sangat tinggi; buta huruf mendekati nol.",
  ],
  "P3|3.2": [
    "AKI/AKB sangat tinggi; akses layanan kesehatan minim; fasilitas buruk; stunting tinggi; harapan hidup rendah.",
    "AKI/AKB mulai turun tapi tetap tinggi; akses terbatas; fasilitas kurang; stunting tinggi; harapan hidup rendah–sedang.",
    "AKI/AKB moderat; akses cukup luas; fasilitas memadai; stunting menurun; harapan hidup menengah.",
    "AKI/AKB rendah; akses merata; fasilitas baik; stunting rendah; harapan hidup tinggi.",
    "AKI/AKB sangat rendah; akses universal & inklusif; fasilitas modern; stunting hampir nol; harapan hidup sangat tinggi.",
  ],
  "P3|3.3": [
    "Akses hukum sangat terbatas; kesadaran rendah; pelanggaran HAM sering; kesetaraan gender diabaikan.",
    "Akses hukum mulai ada namun terbatas; kesadaran rendah; pelanggaran HAM masih sering; kesetaraan gender minim.",
    "Akses cukup luas; kesadaran hukum naik; HAM dihormati sebagian; kesetaraan gender mulai diterapkan.",
    "Akses hukum merata; kesadaran hukum tinggi; HAM dihormati baik; kesetaraan gender diakui luas.",
    "Akses hukum universal; kesadaran hukum sangat tinggi; HAM dijamin penuh; kesetaraan gender sepenuhnya terwujud.",
  ],
  "P3|3.4": [
    "Kebebasan sangat terbatas; diskriminasi tinggi; minoritas tidak terlindungi.",
    "Ada kebebasan, tapi insiden intoleransi masih sering.",
    "Kebebasan cukup baik; diskriminasi jarang; insiden terkendali.",
    "Kebebasan kuat; diskriminasi hampir tidak ada; minoritas dilindungi.",
    "Kebebasan sepenuhnya terjamin; semua umat beragama hidup damai & setara.",
  ],
  "P3|3.5": [
    "Hubungan sering tegang; hampir tidak ada kegiatan bersama.",
    "Hubungan mulai membaik; kegiatan lintas agama jarang.",
    "Hubungan harmonis di sebagian besar dusun; kegiatan lintas agama cukup sering.",
    "Kerukunan erat; kolaborasi lintas agama aktif.",
    "Kerukunan sangat kuat; lintas agama hidup harmonis & saling mendukung.",
  ],
  "P3|3.6": [
    "Konflik sering; penanganan lambat & tidak efektif.",
    "Konflik berkurang tapi penanganan lemah.",
    "Konflik jarang; penanganan cukup cepat meski belum konsisten.",
    "Konflik sangat jarang; penanganan cepat & efektif.",
    "Mekanisme pencegahan & resolusi sangat kuat; konflik hampir tidak ada.",
  ],
  "P3|3.7": [
    "Toleransi tidak diajarkan; anak muda kurang pemahaman.",
    "Ada program toleransi terbatas.",
    "Edukasi toleransi cukup luas; generasi muda aktif.",
    "Edukasi toleransi kuat; banyak program & partisipasi warga.",
    "Edukasi toleransi terintegrasi dalam kurikulum, budaya, & kebijakan.",
  ],
  "P3|3.8": [
    "Tokoh kurang berperan; kadang memicu perpecahan.",
    "Ada tokoh aktif tapi terbatas.",
    "Tokoh cukup berperan menjaga kerukunan.",
    "Tokoh aktif mempromosikan toleransi & perdamaian.",
    "Tokoh jadi garda depan kerukunan; kolaborasi erat dengan desa.",
  ],
  "P3|3.9": [
    "Ruang publik sangat terbatas; tidak ada fasilitas inklusif.",
    "Ruang publik tersedia tapi minim & tidak inklusif.",
    "Fasilitas sosial cukup ada; sebagian dipakai lintas agama/masyarakat.",
    "Infrastruktur sosial mendukung interaksi lintas agama; digunakan luas.",
    "Infrastruktur modern, inklusif; simbol persatuan desa.",
  ],
  "P3|3.10": [
    "Pelestarian budaya lemah; tradisi hilang; pariwisata tidak berkembang.",
    "Pelestarian terbatas seremonial; urbanisasi tak terkendali; pariwisata lambat.",
    "Pelestarian cukup baik; urbanisasi terkendali sebagian; pariwisata mulai berkembang.",
    "Pelestarian kuat; urbanisasi terkendali; pariwisata pesat & berkelanjutan.",
    "Budaya lestari & inovatif; pariwisata berkelas internasional; kontribusi besar.",
  ],
  "P3|3.11": [
    "Kejahatan/kerawanan tinggi; aparat lemah; warga tidak percaya.",
    "Kejahatan tinggi; upaya hukum tidak konsisten; kepercayaan rendah.",
    "Kejahatan moderat menurun; aturan cukup berjalan; kepercayaan mulai naik.",
    "Kejahatan rendah; sistem keamanan efektif; kepercayaan warga tinggi.",
    "Kejahatan sangat rendah; sistem preventif kuat; warga percaya penuh.",
  ],
  "P3|3.12": [
    "Perlindungan sosial sangat lemah; miskin tak terjangkau; akses disabilitas/lansia tidak ada.",
    "Perlindungan sosial ada tapi cakupan rendah; bansos tidak tepat sasaran; akses terbatas.",
    "Perlindungan cukup; sebagian besar miskin tercover; layanan disabilitas/lansia mulai ada.",
    "Perlindungan kuat; hampir semua miskin tercover; akses inklusif di banyak fasilitas.",
    "Perlindungan komprehensif; semua miskin tercover; layanan inklusif penuh; transparan.",
  ],
  "P3|3.13": [
    "Transportasi/listrik/air minim; literasi digital sangat rendah; kesenjangan tinggi.",
    "Fasilitas ada tapi belum merata; literasi digital rendah; warga kesulitan teknologi.",
    "Fasilitas cukup luas; literasi digital sedang; mayoritas bisa pakai layanan dasar.",
    "Fasilitas merata & berkualitas; literasi digital tinggi; warga aktif memanfaatkan teknologi.",
    "Fasilitas modern & merata; literasi digital sangat tinggi; warga optimal gunakan teknologi.",
  ],
  "P3|3.14": [
    "IPM sangat rendah; banyak putus sekolah; kesehatan buruk; daya beli rendah.",
    "IPM rendah; perbaikan terbatas; kualitas hidup lemah.",
    "IPM sedang; mayoritas bersekolah; kesehatan cukup; daya beli moderat.",
    "IPM tinggi; pendidikan & kesehatan merata; daya beli kuat.",
    "IPM sangat tinggi; pendidikan & kesehatan modern; daya beli sangat kuat.",
  ],
  "P3|3.15": [
    "Partisipasi perempuan sangat rendah; diskriminasi tinggi; kekerasan gender tak tertangani.",
    "Partisipasi naik tapi hanya level rendah; perlindungan lemah; kasus banyak tak tertangani.",
    "Partisipasi cukup signifikan; perlindungan berjalan tapi belum konsisten; sebagian kasus ditangani.",
    "Partisipasi tinggi di banyak sektor; perlindungan efektif; kasus ditangani cepat.",
    "Kesetaraan penuh; perempuan terwakili proporsional; perlindungan komprehensif; kasus sangat rendah.",
  ],
  "P3|3.16": [
    "Layanan lansia/disabilitas nyaris tidak ada; fasilitas tidak ramah; diskriminasi sering.",
    "Layanan terbatas; fasilitas sebagian kecil ramah; perlindungan minim.",
    "Layanan cukup; fasilitas sebagian ramah; perlindungan berjalan tapi belum konsisten.",
    "Layanan merata; fasilitas ramah; perlindungan kuat; diskriminasi jarang.",
    "Layanan modern & inklusif; fasilitas akses penuh; perlindungan komprehensif; kualitas hidup tinggi.",
  ],
  "P3|3.17": [
    "Urbanisasi tak terkendali; pemuda pindah; kerja lokal minim; dampak sosial tinggi.",
    "Urbanisasi sebagian terkendali; kerja ada tapi terbatas; dampak sosial tinggi.",
    "Urbanisasi cukup terkendali; kerja ada tapi belum cukup; dampak sosial menurun.",
    "Urbanisasi terkendali baik; banyak kerja lokal; dampak sosial rendah.",
    "Urbanisasi dikelola komprehensif; kerja inklusif & berkualitas; dampak minimal; desa–kota seimbang.",
  ],
  "P3|3.18": [
    "Akses perangkat digital sangat rendah; pelatihan minim; internet hanya untuk hiburan.",
    "Akses perangkat terbatas; pelatihan ada tapi sporadis; penggunaan produktif rendah.",
    "Akses cukup luas; pelatihan rutin terbatas; penggunaan produktif meningkat moderat.",
    "Akses tinggi & merata; pelatihan berkelanjutan; penggunaan produktif meluas.",
    "Akses universal; pelatihan masif & inklusif; penggunaan produktif sangat tinggi; desa inovatif digital.",
  ],

  // P4
  "P4|4.1": [
    "Tidak ada kesiapan hadapi perubahan iklim; tanpa program adaptasi; warga sangat rentan bencana.",
    "Kesiapan rendah; ada upaya terbatas (penanaman seadanya, tanggul darurat); kerentanan tetap tinggi.",
    "Kesiapan sedang; ada program adaptasi cukup berjalan (pola tanam, embung, pelatihan bencana); kerentanan menurun.",
    "Kesiapan tinggi; program adaptasi komprehensif & partisipatif; kerentanan rendah.",
    "Kesiapan sangat tinggi; adaptasi terintegrasi dalam kebijakan; sistem peringatan dini & teknologi ramah lingkungan; risiko terkendali.",
  ],
  "P4|4.2": [
    "Emisi tinggi (pembakaran sampah, BBM, kayu bakar); tidak ada energi terbarukan; tanpa edukasi mitigasi.",
    "Upaya mitigasi ada tapi terbatas; energi fosil dominan; edukasi minim.",
    "Emisi terkendali sebagian; energi terbarukan mulai digunakan; edukasi publik berjalan terbatas.",
    "Emisi rendah; energi terbarukan luas; edukasi aktif; kesadaran tinggi.",
    "Emisi sangat rendah; energi terbarukan utama; gaya hidup rendah karbon; mitigasi terintegrasi penuh.",
  ],
  "P4|4.3": [
    "Kualitas udara sangat buruk; banyak pembakaran sampah & asap dapur; polusi tinggi; dampak kesehatan besar.",
    "Udara buruk; polusi tinggi; upaya pengurangan sedikit; transportasi ramah lingkungan hampir tidak ada.",
    "Udara cukup terkendali; polusi menurun di sebagian dusun; transportasi ramah lingkungan mulai terbatas; kesadaran publik naik.",
    "Udara baik; pembakaran jarang; emisi terkendali; transportasi ramah lingkungan luas; kesadaran tinggi.",
    "Udara sangat baik & stabil; polusi sangat rendah; transportasi ramah lingkungan jadi kebiasaan; desa hijau & sehat.",
  ],
  "P4|4.4": [
    "Akses air sangat terbatas; banyak rumah pakai sumber tercemar; warga sering sakit.",
    "Akses sebagian; kualitas rendah; pengelolaan sumber air lemah.",
    "Akses cukup baik; sebagian besar rumah dapat air layak; pengelolaan mulai berjalan.",
    "Akses luas & merata; kualitas sesuai standar; sumber air dikelola baik.",
    "Akses universal; kualitas tinggi; konservasi & perlindungan sumber air berkelanjutan.",
  ],
  "P4|4.5": [
    "Sampah menumpuk; tanpa sistem; limbah mencemari; kesadaran sangat rendah.",
    "Pengelolaan terbatas (buang ke sungai/ladang); limbah berbahaya tak tertangani; partisipasi minim.",
    "Pengelolaan cukup berjalan; ada pemilahan/daur ulang sebagian; limbah berbahaya mulai ditangani.",
    "Pengelolaan baik; ada sistem 3R; limbah berbahaya dikelola aman; partisipasi tinggi.",
    "Sistem modern & berkelanjutan; circular economy berjalan; limbah berbahaya terkendali penuh; desa bebas sampah.",
  ],
  "P4|4.6": [
    "Banyak rumah tak layak huni; boros energi; sangat rentan bencana; tanpa konsep berkelanjutan.",
    "Sebagian rumah layak; efisiensi rendah; ketahanan minim; konsep ramah lingkungan belum diterapkan.",
    "Sebagian besar rumah layak; teknologi hemat energi sederhana; sebagian tahan bencana.",
    "Rumah umumnya layak; efisiensi energi cukup luas; ketahanan bencana baik; konsep berkelanjutan mulai diadopsi.",
    "Rumah modern & ramah lingkungan; efisien energi; sepenuhnya tahan bencana; konsep berkelanjutan terintegrasi.",
  ],
  "P4|4.7": [
    "RTH sangat minim & buruk; akses terbatas; fungsi ekologis hilang.",
    "RTH ada sebagian kecil; kualitas rendah; akses terbatas.",
    "RTH cukup tersedia; kualitas sedang; akses relatif baik; fungsi berjalan sebagian.",
    "RTH luas & baik; akses tinggi; fungsi ekologis & sosial berjalan baik.",
    "RTH sangat luas & berkualitas; akses universal; fungsi ekologis, sosial & edukasi optimal.",
  ],
  "P4|4.8": [
    "Energi hampir semua fosil; kontribusi terbarukan <5%; tidak ada program energi bersih.",
    "Energi terbarukan ada tapi kecil (<10%); program transisi minim.",
    "Kontribusi terbarukan moderat (10–20%); program berjalan terbatas.",
    "Kontribusi besar (20–40%); program transisi aktif; teknologi berkembang.",
    "Energi terbarukan dominan (>50%); desa mandiri energi; sistem bersih & berkelanjutan.",
  ],
  "P4|4.9": [
    "Deforestasi tinggi; konservasi lemah; degradasi masif; biodiversitas terancam punah.",
    "Konservasi ada tapi terbatas; deforestasi masih tinggi; rehabilitasi minim.",
    "Konservasi berjalan sebagian; deforestasi terkendali; rehabilitasi sebagian berhasil.",
    "Konservasi kuat & partisipatif; deforestasi rendah; rehabilitasi cukup luas; biodiversitas cukup terlindungi.",
    "Konservasi sangat kuat; deforestasi hampir nol; rehabilitasi berhasil luas; biodiversitas terlindungi jangka panjang.",
  ],
  "P4|4.10": [
    "Udara sangat buruk; polusi tinggi; energi fosil dominan; tanpa kebijakan.",
    "Udara buruk; aturan ada tapi lemah; polusi sering melebihi ambang sehat.",
    "Udara cukup terkendali; ada program pengendalian; energi & transportasi bersih terbatas.",
    "Udara baik; polutan rendah; kebijakan efektif; energi & transportasi bersih meluas.",
    "Udara sangat baik; polutan sangat rendah; energi & transportasi bersih dominan; pemantauan kualitas aktif.",
  ],
  "P4|4.11": [
    "Akses air bersih <50%; kualitas buruk; sanitasi minim; banyak buang air sembarangan.",
    "Akses 50–70%; kualitas rendah; sanitasi dasar ada tapi terbatas.",
    "Akses 70–85%; kualitas cukup; sanitasi luas tapi belum higienis penuh.",
    "Akses 85–95%; kualitas baik; sanitasi layak & merata; penyakit lingkungan menurun.",
    "Akses >95%; kualitas sangat baik; sanitasi modern & berkelanjutan; standar internasional.",
  ],
  "P4|4.12": [
    "Sampah tinggi; tanpa daur ulang; open dumping.",
    "Pengelolaan dasar ada; daur ulang rendah (<10%); circular economy belum ada.",
    "Pengelolaan cukup; daur ulang 10–30%; bank sampah terbatas; circular economy terbatas.",
    "Pengelolaan baik; daur ulang 30–50%; circular economy berkembang; UMKM daur ulang tumbuh.",
    "Pengelolaan sangat baik; daur ulang >50%; circular economy penuh; manfaat ekonomi besar.",
  ],
  "P4|4.13": [
    "Energi fosil dominan; terbarukan <5%; tanpa strategi.",
    "Terbarukan ada tapi kecil (5–10%); program minim; investasi rendah.",
    "Terbarukan 10–20%; kebijakan mulai berjalan; investasi terbatas.",
    "Terbarukan 20–40%; kebijakan kuat; investasi berkembang; teknologi diadopsi.",
    "Terbarukan >50%; desa mandiri energi; sistem modern & inklusif; contoh regional.",
  ],
  "P4|4.14": [
    "Deforestasi sangat tinggi; konservasi minim; rehabilitasi hampir tidak ada.",
    "Deforestasi tinggi; konservasi kecil; rehabilitasi ada tapi dampak kecil.",
    "Deforestasi terkendali; konservasi moderat; rehabilitasi berjalan terbatas.",
    "Deforestasi rendah; konservasi luas; rehabilitasi efektif; biodiversitas cukup terjaga.",
    "Deforestasi hampir nol; konservasi sangat luas & berstandar; rehabilitasi masif; biodiversitas terlindungi jangka panjang.",
  ],

  // P5
  "P5|5.1": [
    "Ekonomi desa sangat tergantung sektor tradisional; hampir tidak ada inovasi; green economy tidak diterapkan.",
    "Ada inisiatif inovasi kecil & sporadis; diversifikasi mulai ada tapi sektor lama dominan; teknologi ramah lingkungan minim.",
    "Diversifikasi cukup; UMKM & wisata desa mulai; green economy terbatas; teknologi ramah lingkungan sebagian.",
    "Ekonomi terdiversifikasi & inovatif; green economy konsisten; teknologi ramah lingkungan luas.",
    "Ekonomi sepenuhnya berbasis inovasi & keberlanjutan; green economy jadi pilar; diversifikasi kuat; teknologi ramah lingkungan diterapkan luas.",
  ],
  "P5|5.2": [
    "Investasi riset & pendidikan sangat rendah; kolaborasi hampir tidak ada; produk inovatif minim; SDM kurang terlatih.",
    "Ada inisiatif kecil riset lokal; kolaborasi sporadis; produk inovatif rendah kualitas; SDM minim kompetensi.",
    "Investasi moderat; kolaborasi cukup berjalan; produk inovatif mulai muncul; SDM berkembang cukup baik.",
    "Investasi tinggi; kolaborasi kuat dengan kampus/industri; produk inovatif berkualitas; SDM profesional & adaptif.",
    "Investasi sangat tinggi & berkelanjutan; kolaborasi terintegrasi; produk inovatif berkualitas internasional; SDM unggul & kreatif.",
  ],
  "P5|5.3": [
    "Tidak ada kolaborasi lintas sektor; hasil riset/inovasi tidak digunakan.",
    "Ada inisiatif kolaborasi sporadis/formalitas; sebagian kecil inovasi digunakan tanpa dampak nyata.",
    "Kolaborasi cukup aktif; sebagian inovasi diadopsi tapi belum konsisten.",
    "Kolaborasi kuat & rutin; mayoritas inovasi dipakai dengan dampak nyata; inklusif melibatkan banyak pihak.",
    "Kolaborasi terintegrasi (quadruple helix); inovasi masif diadopsi; menjadi motor transformasi desa.",
  ],
  "P5|5.4": [
    "Inovasi berdampak negatif (untungkan segelintir, lingkungan rusak); tidak ada penilaian dampak.",
    "Sebagian inovasi perhatikan sosial/lingkungan tapi sangat minim; dampak kecil & terbatas.",
    "Inovasi cukup perhatikan sosial & lingkungan; dampak positif ada tapi belum merata.",
    "Inovasi beri manfaat sosial signifikan; dampak lingkungan terkendali; ada penilaian dampak.",
    "Inovasi sangat berdampak positif luas; kontribusi restorasi ekosistem; sistem monitoring dampak transparan.",
  ],
  "P5|5.5": [
    "Teknologi tidak efektif; produktivitas rendah; biaya tinggi; tidak berkelanjutan.",
    "Teknologi tingkatkan produktivitas kecil; biaya operasional tinggi; keberlanjutan belum jelas.",
    "Teknologi cukup efektif; produktivitas meningkat; biaya moderat; ada rencana finansial terbatas.",
    "Teknologi sangat efektif; produktivitas tinggi; biaya efisien; ada model finansial berkelanjutan.",
    "Teknologi optimal & inovatif; produktivitas maksimal; biaya sangat efisien energi hijau; keberlanjutan finansial terjamin.",
  ],
  "P5|5.6": [
    "Kebijakan desa hambat inovasi; tidak ada insentif; perlindungan HKI lemah.",
    "Ada kebijakan pro-inovasi terbatas & inkonsisten; insentif hanya segelintir; perlindungan HKI lemah.",
    "Kebijakan cukup banyak & berdampak; insentif terbatas; perlindungan HKI berjalan sebagian.",
    "Kebijakan inovasi kuat & konsisten; insentif luas; ekosistem UMKM/startup berkembang; perlindungan HKI efektif.",
    "Kebijakan sangat pro-inovasi; insentif terintegrasi lintas sektor; ekosistem startup maju; perlindungan HKI kuat & berstandar nasional.",
  ],
  "P5|5.7": [
    "Tidak ada kolaborasi internasional; produk desa tidak dikenal; kontribusi global nol.",
    "Kolaborasi internasional ada tapi sangat terbatas; produk sedikit diekspor; kontribusi kecil.",
    "Kolaborasi cukup aktif; produk mulai diekspor; ada pengakuan internasional terbatas.",
    "Kolaborasi luas & konsisten; produk bersertifikasi/paten internasional; inovasi diakui global.",
    "Kolaborasi intensif & strategis; produk sangat kompetitif global; kontribusi besar dalam publikasi & inovasi dunia.",
  ],
  "P5|5.8": [
    "Adopsi digital sangat rendah; tidak ada pelatihan; konsep smart village tidak diterapkan.",
    "Adopsi digital terbatas (pemuda/UMKM kecil); pelatihan minim; smart village hanya pilot project kecil.",
    "Adopsi digital cukup luas; pelatihan rutin tapi belum merata; smart village diterapkan terbatas.",
    "Adopsi digital tinggi & inklusif; pelatihan meluas; smart village terintegrasi lintas sektor.",
    "Adopsi digital sangat tinggi & merata; pelatihan masif & inklusif; smart village penuh → layanan real-time & berkelanjutan.",
  ],
  "P5|5.9": [
    "Hampir tidak ada startup desa; UMKM digital sangat sedikit; inkubator tidak ada.",
    "Ada beberapa startup/UMKM digital kecil; dukungan inkubator terbatas; pasar lokal sempit.",
    "Pertumbuhan startup cukup stabil; UMKM digital berkembang moderat; ada inkubator tapi cakupan terbatas.",
    "Pertumbuhan startup tinggi; UMKM digital berkembang pesat; dukungan inkubator kuat; pasar luas.",
    "Ekosistem startup matang; banyak skala nasional/global; UMKM digital jadi pilar ekonomi; inkubator terintegrasi dengan pasar global.",
  ],
  "P5|5.10": [
    "Inovasi tidak diadopsi; tidak ada survei kepuasan; dampak keberlanjutan tak diukur.",
    "Sebagian kecil inovasi diadopsi terbatas; survei ada tapi jarang; pengukuran dampak minim.",
    "Sebagian besar inovasi mulai diadopsi; survei kepuasan rutin tapi belum komprehensif; dampak diukur terbatas.",
    "Mayoritas inovasi diadopsi luas; manfaat nyata; survei rutin & hasil dipakai; dampak diukur cukup komprehensif.",
    "Inovasi diadopsi masif & sistematis; kepuasan sangat tinggi; dampak keberlanjutan terukur & transparan.",
  ],
};

// Default Weights — aligned with policy design
const DEFAULT_WEIGHTS = [
  {
    code: "P1",
    name: "Kinerja Tata Kelola Pemerintahan (Desa)",
    weight: 0.25,
    criteria: [
      {
        code: "1.1",
        name: "Regulasi & Kedaulatan (Perdes Mandiri, Aspirasi Warga, Evaluasi)",
        weight: 0.1,
      },
      {
        code: "1.2",
        name: "Transparansi (Keterbukaan Informasi Desa & Akses Data Warga)",
        weight: 0.1,
      },
      {
        code: "1.3",
        name: "Akuntabilitas (Laporan APBDes, Audit, Aduan Warga)",
        weight: 0.12,
      },
      {
        code: "1.4",
        name: "Koordinasi & Partisipasi Publik Desa (Musyawarah, Forum Warga)",
        weight: 0.08,
      },
      {
        code: "1.5",
        name: "Penegakan Hukum & Antikorupsi Desa (Keadilan, Pengawasan Publik)",
        weight: 0.14,
      },
      {
        code: "1.6",
        name: "Efektivitas & Efisiensi Pemerintahan Desa (Target, Respons Cepat)",
        weight: 0.1,
      },
      {
        code: "1.7",
        name: "Kualitas Layanan Publik Desa (Akses, Kepuasan Warga)",
        weight: 0.1,
      },
      {
        code: "1.8",
        name: "Transformasi Digital & E-Government Desa (SID, Literasi, Keamanan Data)",
        weight: 0.1,
      },
      {
        code: "1.9",
        name: "Kepemimpinan Kepala Desa (Visi, Integritas, Respons Krisis)",
        weight: 0.08,
      },
      {
        code: "1.10",
        name: "Keamanan Siber & Privasi Data Desa (Perlindungan Data Warga)",
        weight: 0.05,
      },
      {
        code: "1.11",
        name: "Keadilan & Pemerataan Layanan Publik Desa (Inklusivitas, Kelompok Rentan)",
        weight: 0.03,
      },
    ],
  },
  {
    code: "P2",
    name: "Kinerja Ekonomi (Desa)",
    weight: 0.25,
    criteria: [
      {
        code: "2.1",
        name: "Pertumbuhan & Diversifikasi Ekonomi Desa",
        weight: 0.06,
      },
      {
        code: "2.2",
        name: "PADes & BUMDes (Kemandirian Fiskal Desa)",
        weight: 0.06,
      },
      {
        code: "2.3",
        name: "Pendapatan Keluarga & Penurunan Kemiskinan",
        weight: 0.08,
      },
      {
        code: "2.4",
        name: "Kesempatan Kerja & Pengangguran (Desa)",
        weight: 0.07,
      },
      { code: "2.5", name: "UMKM Desa & Kewirausahaan Lokal", weight: 0.08 },
      {
        code: "2.6",
        name: "Infrastruktur Ekonomi (Jalan, Listrik, Internet, Logistik)",
        weight: 0.07,
      },
      {
        code: "2.7",
        name: "Pengelolaan SDA Berkelanjutan (Desa)",
        weight: 0.06,
      },
      {
        code: "2.8",
        name: "Investasi & Kemitraan (BUMDes/Koperasi/CSR)",
        weight: 0.05,
      },
      {
        code: "2.9",
        name: "Daya Saing & Nilai Tambah Produk Desa",
        weight: 0.06,
      },
      {
        code: "2.10",
        name: "Kemiskinan & Pemerataan Ekonomi (Desa)",
        weight: 0.07,
      },
      {
        code: "2.11",
        name: "Produktivitas, Keterampilan, & Inovasi Tenaga Kerja",
        weight: 0.05,
      },
      {
        code: "2.12",
        name: "Inklusi Keuangan (Bank/Koperasi/Fintech) & Literasi",
        weight: 0.05,
      },
      {
        code: "2.13",
        name: "Ketahanan Ekonomi & Pangan (Shock/Resilience)",
        weight: 0.05,
      },
      {
        code: "2.14",
        name: "Infrastruktur Dasar (Air, Sanitasi, Transportasi, Internet)",
        weight: 0.05,
      },
      {
        code: "2.15",
        name: "Retensi & Kualitas Mitra/Investasi (Dampak ke Kerja/Skill)",
        weight: 0.04,
      },
      {
        code: "2.16",
        name: "Produk Olahan Bersertifikat (Halal/Mutu) & Akses Pasar",
        weight: 0.04,
      },
      {
        code: "2.17",
        name: "Kesenjangan Antar-Dusun & Pemerataan Layanan Ekonomi",
        weight: 0.03,
      },
      {
        code: "2.18",
        name: "Struktur Ekonomi Seimbang (Primer-Sekunder-Tersier)",
        weight: 0.03,
      },
    ],
  },
  {
    code: "P3",
    name: "Kinerja Sosial (Desa)",
    weight: 0.25,
    criteria: [
      {
        code: "3.1",
        name: "Akses & Mutu Pendidikan (PAUD/SD/SMP) & Literasi",
        weight: 0.1,
      },
      {
        code: "3.2",
        name: "Kesehatan Ibu-Anak, Stunting, Akses Layanan Kesehatan",
        weight: 0.1,
      },
      {
        code: "3.3",
        name: "Akses Hukum, HAM, & Kesetaraan Gender (Dasar)",
        weight: 0.06,
      },
      {
        code: "3.4",
        name: "Kebebasan Beragama (Desa) & Perlindungan Minoritas",
        weight: 0.05,
      },
      {
        code: "3.5",
        name: "Kerukunan & Relasi Antarumat/Antarwarga",
        weight: 0.05,
      },
      {
        code: "3.6",
        name: "Pencegahan & Resolusi Konflik Sosial",
        weight: 0.05,
      },
      {
        code: "3.7",
        name: "Edukasi Nilai Toleransi (Sekolah/Komunitas)",
        weight: 0.04,
      },
      {
        code: "3.8",
        name: "Peran Tokoh Agama/Masyarakat dalam Kerukunan",
        weight: 0.03,
      },
      {
        code: "3.9",
        name: "Infrastruktur Sosial Inklusif (Balai, Ruang Publik, Posyandu)",
        weight: 0.03,
      },
      {
        code: "3.10",
        name: "Pelestarian Budaya & Pariwisata Berkelanjutan",
        weight: 0.04,
      },
      { code: "3.11", name: "Keamanan & Ketertiban (Desa)", weight: 0.05 },
      {
        code: "3.12",
        name: "Perlindungan Sosial (Miskin, Disabilitas, Lansia)",
        weight: 0.06,
      },
      {
        code: "3.13",
        name: "Akses Layanan & Literasi Digital Warga",
        weight: 0.06,
      },
      {
        code: "3.14",
        name: "Kualitas Hidup/Indeks Pembangunan Manusia (Desa)",
        weight: 0.08,
      },
      {
        code: "3.15",
        name: "Kesetaraan Gender & Perlindungan dari KKG",
        weight: 0.06,
      },
      {
        code: "3.16",
        name: "Layanan Ramah Disabilitas & Lansia (Aksesibilitas)",
        weight: 0.05,
      },
      {
        code: "3.17",
        name: "Migrasi/Urbanisasi & Penyerapan Kerja Lokal",
        weight: 0.04,
      },
      {
        code: "3.18",
        name: "Adopsi Digital untuk Produktivitas Sosial",
        weight: 0.05,
      },
    ],
  },

  {
    code: "P4",
    name: "Kinerja Lingkungan (Desa)",
    weight: 0.25,
    criteria: [
      {
        code: "4.1",
        name: "Adaptasi Perubahan Iklim & Kesiapsiagaan Bencana Desa",
        weight: 0.09,
      },
      {
        code: "4.2",
        name: "Mitigasi Emisi (Perilaku Rendah Karbon, Energi Bersih)",
        weight: 0.07,
      },
      {
        code: "4.3",
        name: "Kualitas Udara (Pembakaran Sampah, Transportasi, Dapur)",
        weight: 0.06,
      },
      { code: "4.4", name: "Akses & Kualitas Air Bersih", weight: 0.09 },
      {
        code: "4.5",
        name: "Sampah & Limbah (3R, B3, Circular Economy)",
        weight: 0.09,
      },
      {
        code: "4.6",
        name: "Hunian Layak, Efisiensi Energi & Ketahanan Bencana",
        weight: 0.06,
      },
      {
        code: "4.7",
        name: "Ruang Terbuka Hijau (RTH) & Fungsi Ekologis",
        weight: 0.06,
      },
      {
        code: "4.8",
        name: "Porsi Energi Terbarukan (Desa Mandiri Energi)",
        weight: 0.07,
      },
      {
        code: "4.9",
        name: "Hutan/Biodiversitas: Konservasi & Rehabilitasi",
        weight: 0.08,
      },
      {
        code: "4.10",
        name: "Kebijakan Udara Bersih & Transportasi Ramah Lingkungan",
        weight: 0.05,
      },
      {
        code: "4.11",
        name: "Air Bersih & Sanitasi Layak (Stop BABS)",
        weight: 0.09,
      },
      {
        code: "4.12",
        name: "Tingkat Daur Ulang & Ekonomi Sirkular",
        weight: 0.08,
      },
      {
        code: "4.13",
        name: "Kebijakan/Investasi Energi Terbarukan (Desa)",
        weight: 0.06,
      },
      {
        code: "4.14",
        name: "Pengendalian Deforestasi & Perlindungan Keanekaragaman",
        weight: 0.05,
      },
    ],
  },
  {
    code: "P5",
    name: "Kinerja Inovasi & Keberlanjutan (Desa)",
    weight: 0.25,
    criteria: [
      {
        code: "5.1",
        name: "Ekonomi Inovatif & Green Economy Desa",
        weight: 0.12,
      },
      {
        code: "5.2",
        name: "Investasi Riset/Pendidikan & Kualitas SDM Inovatif",
        weight: 0.12,
      },
      {
        code: "5.3",
        name: "Kolaborasi Lintas Sektor (Kampus-Industri-Komunitas)",
        weight: 0.1,
      },
      {
        code: "5.4",
        name: "Dampak Sosial-Lingkungan dari Inovasi (Impact)",
        weight: 0.1,
      },
      {
        code: "5.5",
        name: "Efektivitas Teknologi (Produktivitas, Biaya, Energi)",
        weight: 0.1,
      },
      {
        code: "5.6",
        name: "Kebijakan Pro-Inovasi & Perlindungan HKI (UMKM/Startup)",
        weight: 0.1,
      },
      {
        code: "5.7",
        name: "Kolaborasi & Daya Saing Internasional",
        weight: 0.08,
      },
      {
        code: "5.8",
        name: "Adopsi Digital & Smart Village Terintegrasi",
        weight: 0.12,
      },
      {
        code: "5.9",
        name: "Ekosistem Startup/UMKM Digital Desa",
        weight: 0.08,
      },
      {
        code: "5.10",
        name: "Adopsi Inovasi, Kepuasan Warga & Monev Dampak",
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

// ==== TUJUAN per kriteria (direvisi lebih lengkap dalam bentuk poin, ringkas, sesuai dokumen) ====
const TUJUANS = {
  // ===== P1 Tata Kelola =====
  "P1|1.1": [
    "Menjamin Perdes dibuat mandiri, sesuai aspirasi warga, dan kepentingan desa.",
    "Memastikan proses perumusan Perdes transparan, adil, dan terbuka bagi masyarakat.",
    "Mendorong evaluasi berkala dan musyawarah desa agar kebijakan memberi dampak nyata.",
  ],
  "P1|1.2": [
    "Menjamin informasi desa akurat, lengkap, dan mudah diakses warga.",
    "Memanfaatkan papan informasi, website desa, dan aplikasi digital untuk keterbukaan data.",
    "Mendorong akses cepat, setara, dan tanpa hambatan bagi seluruh warga desa.",
  ],
  "P1|1.3": [
    "Memastikan laporan APBDes dan kinerja desa transparan serta dapat diaudit.",
    "Menindaklanjuti hasil audit dan pengaduan masyarakat secara terbuka.",
    "Membangun akuntabilitas melalui pengawasan warga dan lembaga independen.",
  ],
  "P1|1.4": [
    "Meningkatkan koordinasi antarperangkat desa dan lembaga kemasyarakatan.",
    "Melibatkan warga dalam musyawarah desa untuk merumuskan kebijakan dan program.",
    "Memastikan kebijakan inklusif, partisipatif, dan sesuai kebutuhan dusun.",
  ],
  "P1|1.5": [
    "Menegakkan aturan desa secara adil, transparan, dan tidak diskriminatif.",
    "Mencegah serta memberantas penyalahgunaan dana dan praktik korupsi di desa.",
    "Melindungi pelapor dan mendorong keterlibatan masyarakat dalam pengawasan.",
  ],
  "P1|1.6": [
    "Mencapai target pembangunan desa dengan penggunaan dana yang efisien.",
    "Menyelesaikan masalah warga secara cepat, tepat, dan inovatif.",
    "Meningkatkan produktivitas perangkat desa dalam melayani masyarakat.",
  ],
  "P1|1.7": [
    "Menyediakan layanan publik desa yang cepat, adil, dan konsisten.",
    "Menjangkau seluruh warga, termasuk dusun terpencil dan kelompok rentan.",
    "Meningkatkan kepuasan layanan dengan pendekatan ramah dan responsif.",
  ],
  "P1|1.8": [
    "Memastikan tata kelola desa transparan dan efisien melalui sistem digital (SID).",
    "Mendorong integrasi layanan publik dengan teknologi digital desa.",
    "Meningkatkan literasi digital warga serta keamanan data dalam pelayanan online.",
  ],
  "P1|1.9": [
    "Mendorong kepala desa memiliki visi jelas, integritas tinggi, dan komunikatif.",
    "Mengajak partisipasi warga dalam pembangunan serta responsif pada krisis.",
    "Membangun kepercayaan masyarakat lewat keputusan berbasis data dan musyawarah.",
  ],
  "P1|1.10": [
    "Menjamin perlindungan data pribadi warga dalam sistem informasi desa.",
    "Meningkatkan kesiapan perangkat desa menghadapi ancaman siber.",
    "Membangun kepercayaan publik terhadap keamanan layanan digital desa.",
  ],
  "P1|1.11": [
    "Menjamin layanan desa merata untuk semua dusun dan kelompok rentan.",
    "Mengurangi kesenjangan antarwilayah dengan program pemerataan pembangunan.",
    "Memastikan kualitas layanan publik desa yang adil dan inklusif.",
  ],

  // ===== P2 Kinerja Ekonomi Desa =====
  "P2|2.1": [
    "Meningkatkan pertumbuhan ekonomi desa yang stabil dan berkelanjutan.",
    "Mendorong diversifikasi sektor ekonomi agar desa tidak bergantung pada satu sumber.",
    "Memastikan pertumbuhan ekonomi memberi manfaat nyata bagi seluruh warga.",
  ],
  "P2|2.2": [
    "Meningkatkan Pendapatan Asli Desa (PADes) melalui BUMDes dan usaha mandiri.",
    "Mengurangi ketergantungan pada transfer dana eksternal.",
    "Memastikan APBDes dikelola efisien, transparan, dan akuntabel.",
  ],
  "P2|2.3": [
    "Meningkatkan pendapatan keluarga desa untuk mengurangi kemiskinan.",
    "Memastikan kebutuhan dasar warga terpenuhi dengan harga terjangkau.",
    "Mendorong kesejahteraan masyarakat desa secara merata.",
  ],
  "P2|2.4": [
    "Meningkatkan kesempatan kerja produktif di desa.",
    "Mengurangi angka pengangguran dengan pelatihan keterampilan lokal.",
    "Memastikan pekerjaan yang layak dan berkelanjutan bagi warga.",
  ],
  "P2|2.5": [
    "Mendukung tumbuhnya UMKM desa sebagai motor ekonomi lokal.",
    "Memperluas akses modal, pasar, dan teknologi bagi pelaku UMKM.",
    "Mendorong UMKM desa agar mampu bersaing di pasar regional maupun digital.",
  ],
  "P2|2.6": [
    "Membangun dan memperbaiki infrastruktur ekonomi (jalan, listrik, internet, logistik).",
    "Memastikan infrastruktur mendukung aktivitas ekonomi desa.",
    "Mengurangi hambatan distribusi barang dan jasa antarwilayah.",
  ],
  "P2|2.7": [
    "Mengelola sumber daya alam desa secara adil dan berkelanjutan.",
    "Mencegah kerusakan lingkungan akibat eksploitasi berlebihan.",
    "Memastikan pemanfaatan SDA memberi manfaat ekonomi bagi warga desa.",
  ],
  "P2|2.8": [
    "Mendorong investasi dan kemitraan strategis di tingkat desa.",
    "Memastikan investasi memberi dampak nyata pada lapangan kerja dan keterampilan.",
    "Menjamin transfer teknologi dan pengetahuan dari mitra ke masyarakat.",
  ],
  "P2|2.9": [
    "Meningkatkan daya saing produk unggulan desa.",
    "Mendorong hilirisasi dan nilai tambah produk lokal.",
    "Memperluas akses pasar produk desa hingga tingkat nasional dan ekspor.",
  ],
  "P2|2.10": [
    "Mengurangi tingkat kemiskinan di desa secara signifikan.",
    "Memastikan pemerataan pendapatan antarwarga.",
    "Menyediakan akses layanan dasar yang setara bagi semua keluarga.",
  ],
  "P2|2.11": [
    "Meningkatkan produktivitas tenaga kerja desa.",
    "Mendorong keterampilan dan inovasi lokal dalam produksi.",
    "Mengadopsi teknologi tepat guna untuk mendukung produktivitas.",
  ],
  "P2|2.12": [
    "Memperluas akses masyarakat desa terhadap layanan keuangan.",
    "Mendorong inklusi keuangan melalui koperasi, bank desa, atau fintech.",
    "Meningkatkan literasi keuangan warga untuk pengelolaan ekonomi keluarga.",
  ],
  "P2|2.13": [
    "Membangun ketahanan ekonomi desa terhadap krisis dan bencana.",
    "Memastikan cadangan pangan cukup dan harga kebutuhan stabil.",
    "Mendorong gotong royong dan BUMDes sebagai pilar resiliensi ekonomi.",
  ],
  "P2|2.14": [
    "Memastikan seluruh warga desa mendapat akses air, sanitasi, transportasi, dan internet layak.",
    "Meningkatkan kualitas infrastruktur dasar untuk mendukung kehidupan warga.",
    "Mengurangi kesenjangan akses layanan dasar antar dusun.",
  ],
  "P2|2.15": [
    "Meningkatkan kualitas dan keberlanjutan investasi desa.",
    "Membangun kemitraan yang tahan lama dan memberi nilai tambah.",
    "Mendorong peningkatan keterampilan warga melalui transfer pengetahuan.",
  ],
  "P2|2.16": [
    "Meningkatkan produksi olahan desa dengan standar mutu dan sertifikasi.",
    "Membantu produk desa menembus pasar yang lebih luas.",
    "Menjamin daya saing produk lokal melalui inovasi dan kualitas.",
  ],
  "P2|2.17": [
    "Mengurangi kesenjangan ekonomi antar dusun.",
    "Memastikan pembangunan desa dinikmati merata oleh semua wilayah.",
    "Meningkatkan pemerataan layanan ekonomi untuk kelompok rentan.",
  ],
  "P2|2.18": [
    "Membangun struktur ekonomi desa yang seimbang (pertanian, industri, jasa).",
    "Mengurangi kerentanan desa akibat ketergantungan satu sektor.",
    "Meningkatkan daya tahan dan daya saing ekonomi desa.",
  ],

  // ===== P3 Kinerja Sosial Desa =====
  "P3|3.1": [
    "Memperluas akses dan mutu pendidikan (PAUD/SD/SMP) di seluruh dusun.",
    "Meningkatkan literasi dasar–digital melalui PKK, karang taruna, dan perpustakaan desa.",
    "Menekan angka putus sekolah dengan dukungan beasiswa dan transportasi sekolah.",
  ],
  "P3|3.2": [
    "Meningkatkan layanan kesehatan ibu-anak, imunisasi, dan gizi melalui posyandu aktif.",
    "Menurunkan stunting dengan intervensi terpadu (pangan bergizi, air bersih, sanitasi).",
    "Memperluas akses layanan kesehatan dasar dan rujukan yang terjangkau.",
  ],
  "P3|3.3": [
    "Memperkuat akses bantuan hukum dasar dan edukasi hak warga.",
    "Mengarusutamakan HAM dan kesetaraan gender dalam kebijakan desa.",
    "Mendorong layanan aduan yang ramah dan bebas diskriminasi.",
  ],
  "P3|3.4": [
    "Menjamin kebebasan beragama/berkeyakinan di tingkat desa.",
    "Melindungi kelompok minoritas dari tindakan diskriminatif.",
    "Menyusun Perdes yang mendukung praktik toleransi sehari-hari.",
  ],
  "P3|3.5": [
    "Memperkuat kerukunan antarumat/antarwarga melalui kegiatan lintas komunitas.",
    "Membangun jejaring kolaborasi antar tokoh agama/masyarakat.",
    "Menjadikan agenda bersama (gotong royong, olahraga, budaya) sebagai perekat sosial.",
  ],
  "P3|3.6": [
    "Membangun sistem deteksi dini konflik sosial di tingkat RT/RW–dusun.",
    "Memfasilitasi mediasi cepat dan adil saat terjadi perselisihan.",
    "Menyusun protokol resolusi konflik yang transparan dan partisipatif.",
  ],
  "P3|3.7": [
    "Mengintegrasikan edukasi nilai toleransi dalam sekolah, pesantren, dan komunitas.",
    "Mendorong program lintas generasi yang menumbuhkan empati dan kepedulian.",
    "Menyediakan materi/kelas rutin tentang anti-perundungan dan anti-hoaks.",
  ],
  "P3|3.8": [
    "Menguatkan peran tokoh agama dan adat sebagai penjaga kerukunan.",
    "Mendorong teladan publik dalam dialog damai dan penyelesaian masalah.",
    "Membangun forum rutin tokoh masyarakat untuk merespons isu lintas iman/suku.",
  ],
  "P3|3.9": [
    "Menyediakan infrastruktur sosial inklusif (balai desa, ruang publik, posyandu).",
    "Memastikan akses setara bagi perempuan, disabilitas, lansia, dan kelompok rentan.",
    "Mengaktifkan penggunaan ruang publik untuk kegiatan pembauran sosial.",
  ],
  "P3|3.10": [
    "Melestarikan tradisi, bahasa, dan kesenian lokal sebagai identitas desa.",
    "Mengembangkan pariwisata berbasis budaya secara berkelanjutan dan adil.",
    "Mendorong ekonomi kreatif yang menghargai kearifan lokal.",
  ],
  "P3|3.11": [
    "Menurunkan tingkat kejahatan dan kerawanan melalui sistem keamanan komunitas.",
    "Memperkuat kolaborasi warga–aparat dalam pencegahan dan penanganan insiden.",
    "Membangun rasa aman melalui penerangan jalan, patroli, dan kanal aduan cepat.",
  ],
  "P3|3.12": [
    "Memperluas cakupan perlindungan sosial bagi warga miskin dan rentan.",
    "Menyediakan layanan ramah disabilitas dan lansia pada fasilitas desa.",
    "Menjamin bansos tepat sasaran, transparan, dan mudah diakses.",
  ],
  "P3|3.13": [
    "Memperluas akses layanan dasar (transportasi, listrik, air) dan internet.",
    "Meningkatkan literasi digital warga untuk layanan publik online.",
    "Mendorong pemanfaatan teknologi untuk pendidikan, kesehatan, dan ekonomi keluarga.",
  ],
  "P3|3.14": [
    "Meningkatkan kualitas hidup (pendidikan, kesehatan, daya beli) setara antardusun.",
    "Mengakselerasi indikator IPM desa melalui program terarah dan terukur.",
    "Memastikan layanan dasar berkualitas bagi semua kelompok masyarakat.",
  ],
  "P3|3.15": [
    "Meningkatkan partisipasi perempuan dalam pengambilan keputusan desa.",
    "Mencegah dan menangani kekerasan berbasis gender (KKG) secara tegas dan ramah korban.",
    "Menyediakan layanan konseling, perlindungan, dan pemberdayaan ekonomi perempuan.",
  ],
  "P3|3.16": [
    "Mewujudkan fasilitas publik yang aksesibel bagi disabilitas dan lansia.",
    "Menyediakan layanan pendampingan dan rujukan yang mudah dijangkau.",
    "Menghapus diskriminasi dan memastikan partisipasi bermakna.",
  ],
  "P3|3.17": [
    "Mengelola dampak urbanisasi dengan penciptaan kerja lokal yang layak.",
    "Menahan eksodus pemuda melalui pelatihan, inkubasi, dan dukungan usaha.",
    "Menjaga keseimbangan desa–kota lewat mobilitas dan layanan dasar yang baik.",
  ],
  "P3|3.18": [
    "Mendorong adopsi digital untuk kegiatan sosial, pendidikan, dan ekonomi.",
    "Menyelenggarakan pelatihan keterampilan digital yang rutin dan inklusif.",
    "Memastikan infrastruktur dan ekosistem digital digunakan secara produktif.",
  ],

  // ===== P4 Lingkungan =====
  "P4|4.1": [
    "Membangun kesiapsiagaan bencana desa (pemetaan risiko, jalur evakuasi, simulasi rutin).",
    "Mengintegrasikan adaptasi iklim dalam Perdes dan RKPDes (pertanian tahan iklim, panen air hujan).",
    "Mengoperasikan sistem peringatan dini dan regu tanggap desa yang responsif.",
  ],
  "P4|4.2": [
    "Menurunkan emisi melalui larangan pembakaran terbuka dan kompor/boiler hemat energi.",
    "Mendorong perilaku rendah karbon (hemat listrik, tanam pohon, berbagi kendaraan).",
    "Memperluas pemanfaatan energi bersih di fasilitas umum dan rumah tangga.",
  ],
  "P4|4.3": [
    "Menghapus praktik pembakaran sampah dan meningkatkan pengawasan kualitas udara desa.",
    "Mendorong peralihan bahan bakar memasak ke LPG/biogas dan ventilasi dapur sehat.",
    "Menanam pohon peneduh/penyaring debu di koridor jalan dan area padat aktivitas.",
  ],
  "P4|4.4": [
    "Memastikan akses air minum layak melalui jaringan pipa/penampungan dan distribusi adil.",
    "Melindungi sumber mata air/daerah tangkapan (rehabilitasi riparian, larangan pencemaran).",
    "Melakukan uji kualitas air berkala serta edukasi higienitas penyimpanan air rumah tangga.",
  ],
  "P4|4.5": [
    "Menerapkan sistem 3R desa (pemilahan, bank sampah, kompos skala rumah/komunal).",
    "Membangun tata kelola pengangkutan dan TPS yang tertib, aman, dan higienis.",
    "Menangani limbah B3 rumah tangga (oli, baterai, medis) dengan titik kumpul khusus.",
  ],
  "P4|4.6": [
    "Meningkatkan kelayakan rumah (struktur aman, ventilasi, pencahayaan, sanitasi layak).",
    "Mendorong efisiensi energi (atap reflektif, insulasi sederhana, lampu hemat energi).",
    "Menerapkan standar bangunan tangguh bencana (banjir, longsor, angin kencang).",
  ],
  "P4|4.7": [
    "Menyediakan dan merawat ruang terbuka hijau yang mudah diakses semua warga.",
    "Memulihkan fungsi ekologis (sabuk hijau, sempadan sungai, peneduh permukiman).",
    "Mengaktifkan RTH untuk edukasi, olahraga, dan kegiatan sosial lintas kelompok.",
  ],
  "P4|4.8": [
    "Meningkatkan porsi energi terbarukan desa (PLTS balai desa/PJU, biogas ternak, mikrohidro).",
    "Menyusun rencana desa mandiri energi beserta model pembiayaan yang berkelanjutan.",
    "Melatih operator lokal untuk operasi–pemeliharaan sistem energi terbarukan.",
  ],
  "P4|4.9": [
    "Melindungi hutan/kebun rakyat, sungai, mangrove (bila ada) dengan patroli partisipatif.",
    "Menghentikan perburuan ilegal dan memulihkan habitat dengan tanaman lokal.",
    "Mendorong pemanfaatan hasil hutan bukan kayu secara berkelanjutan untuk ekonomi warga.",
  ],
  "P4|4.10": [
    "Menyusun kebijakan udara bersih (Perdes anti-bakar, standar emisi kendaraan/alat).",
    "Mendorong mobilitas rendah emisi (jalan kaki, sepeda, angkutan bersama, carpool).",
    "Memperluas penghijauan koridor transportasi dan manajemen parkir/kemacetan lokal.",
  ],
  "P4|4.11": [
    "Mengakhiri BABS melalui pembangunan jamban layak dan layanan lumpur tinja terjadwal.",
    "Memperluas akses air bersih aman di semua dusun dengan tarif terjangkau dan adil.",
    "Menguatkan program STBM dan edukasi PHBS di sekolah, posyandu, dan rumah tangga.",
  ],
  "P4|4.12": [
    "Membangun ekosistem ekonomi sirkular (bank sampah, kompos, mitra daur ulang).",
    "Menyusun regulasi pengurangan plastik sekali pakai di acara dan pasar desa.",
    "Menciptakan nilai tambah dari material daur ulang untuk UMKM lokal.",
  ],
  "P4|4.13": [
    "Menetapkan insentif Perdes untuk investasi energi terbarukan skala desa/rumah tangga.",
    "Mendorong kemitraan pendanaan (BLU, CSR, koperasi) dan skema pay-as-you-save.",
    "Menyediakan pelatihan sertifikasi teknisi lokal dan standar keselamatan instalasi.",
  ],
  "P4|4.14": [
    "Menetapkan moratorium pembukaan lahan berisiko dan penegakan tata ruang desa.",
    "Mencegah kebakaran hutan/lahan dengan satgas, sekat bakar, dan kanal aduan cepat.",
    "Memulihkan kawasan rusak melalui rehabilitasi masif dan skema perhutanan sosial.",
  ],

  // ===== P5 Inovasi Keberlanjutan =====
  "P5|5.1": [
    "Mendorong diversifikasi ekonomi berbasis inovasi lokal (agritech, eco-tourism, pengolahan hasil).",
    "Mengarusutamakan green economy: efisiensi energi, bahan baku lokal, dan minim limbah.",
    "Memastikan manfaat inovasi ekonomi dirasakan merata oleh seluruh warga desa.",
  ],
  "P5|5.2": [
    "Meningkatkan investasi pada riset terapan desa, pendidikan vokasi, dan sertifikasi keterampilan.",
    "Membangun kemitraan teaching factory/lab mini antara BUMDes–sekolah/SMK–kampus.",
    "Menyediakan skema beasiswa, magang, dan pelatihan berkelanjutan untuk talenta muda desa.",
  ],
  "P5|5.3": [
    "Mewujudkan kolaborasi quadruple helix (pemdes–kampus–industri–komunitas) yang aktif.",
    "Menetapkan agenda riset-aksi prioritas dan peta jalan inovasi desa 3–5 tahun.",
    "Mendorong open data desa untuk memicu kolaborasi dan solusi bersama.",
  ],
  "P5|5.4": [
    "Mengukur dampak sosial–lingkungan inovasi (SROI/ESG desa) secara berkala.",
    "Meminimalkan jejak karbon dan limbah, serta mendorong solusi restoratif.",
    "Memastikan keadilan manfaat inovasi bagi kelompok rentan dan terpencil.",
  ],
  "P5|5.5": [
    "Mengadopsi teknologi tepat guna untuk meningkatkan produktivitas dan kualitas produk.",
    "Mengoptimalkan biaya melalui otomasi sederhana, perawatan preventif, dan manajemen aset.",
    "Mendorong penggunaan energi bersih (PLTS, biogas) dalam proses produksi desa.",
  ],
  "P5|5.6": [
    "Menetapkan Perdes pro-inovasi (insentif, kemudahan perizinan, sandbox regulasi).",
    "Melindungi HKI produk desa (merek, desain industri, paten sederhana, IG).",
    "Menyediakan inkubasi, pendanaan awal (BUMDes/koperasi), dan pendampingan bisnis.",
  ],
  "P5|5.7": [
    "Membangun jejaring internasional untuk sertifikasi, standardisasi, dan akses pasar.",
    "Mengikutkan produk unggulan desa pada pameran virtual dan marketplace global.",
    "Memfasilitasi pertukaran pengetahuan dan kunjungan belajar lintas negara.",
  ],
  "P5|5.8": [
    "Mewujudkan Smart Village: layanan publik digital terintegrasi lintas sektor.",
    "Menyelenggarakan pelatihan digital masif (e-commerce, AI, keamanan data) bagi warga dan aparat.",
    "Mengintegrasikan IoT sederhana (air, irigasi, sampah) untuk tata kelola berbasis data.",
  ],
  "P5|5.9": [
    "Mengembangkan inkubator desa untuk startup/UMKM digital (co-working, mentor, klinik bisnis).",
    "Membuka akses pembiayaan (crowdfunding, koperasi digital) dan kanal penjualan online.",
    "Mendorong model bisnis berlangganan, pre-order, dan kemitraan rantai pasok.",
  ],
  "P5|5.10": [
    "Meningkatkan adopsi inovasi melalui uji coba terbimbing, pelibatan pengguna, dan pelatihan.",
    "Melakukan survei kepuasan warga rutin dan perbaikan layanan berbasis umpan balik.",
    "Membangun sistem monitoring & evaluasi dampak yang transparan (dashboard desa).",
  ],
};

function clampScore(v) {
  return Math.max(1, Math.min(5, v));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function toKarat(score1to5) {
  return (score1to5 * 24) / 5;
}

function safeName(s) {
  return s.trim().split(" ").join("_");
}

function computeScores(weights, entries, indicators) {
  const perPrinciple = {};
  let SA = 0;

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

// ==== MAIN COMPONENT ====
export default function DesaDesktopApp() {
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
  const [isLoadingLatest, setIsLoadingLatest] = useState(false);
  const [currentAssessmentId, setCurrentAssessmentId] = useState(null);

  const result = useMemo(
    () => computeScores(weights, scores, indicators),
    [weights, scores, indicators],
  );

  // Auto-load latest data when email changes
  useEffect(() => {
    if (!email || !supabase) return;
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

        if (error && error.code !== "PGRST116") throw error;

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
  }, [email]);

  async function saveToSupabase() {
    setMessage("");
    if (!supabase) {
      toast.error("Database belum dikonfigurasi.");
      setMessage("Database belum dikonfigurasi.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Masukkan email Anda yang valid terlebih dahulu.");
      setMessage("Masukkan email Anda yang valid terlebih dahulu.");
      return;
    }
    setSaving(true);
    try {
      const payload = { title, weights, scores, indicators, result };
      const { data: existing, error: selectError } = await supabase
        .from("assessments")
        .select("id")
        .eq("user_email", email)
        .eq("title", title)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existing) {
        const { error: updateError } = await supabase
          .from("assessments")
          .update({ payload, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
        if (updateError) throw updateError;
        toast.success("Berhasil diupdate di Database");
        setMessage("Berhasil diupdate di Database");
      } else {
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
    if (!supabase || !email) {
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
        setCurrentAssessmentId(null);
        setScores({});
        setIndicators({});
        setWeights(DEFAULT_WEIGHTS);
        setTitle("Penilaian EMAS");
        toast.success("Penilaian berhasil dihapus.");
        setMessage("Penilaian berhasil dihapus.");
      }
    } catch {
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
            assessment_id: currentAssessmentId,
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
    setCurrentAssessmentId(null);
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
                    />
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

          <div className="flex-1 flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <Image
                src="/logo-icmi.png"
                alt="logo"
                width={60}
                height={40}
                className="mt-2"
              />
              <div className="text-base font-semibold">
                Standarisasi EMAS ICMI
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <DeviceViewToggle />
              <NavDropdown />
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
                        typeof scores[key] === "number" ? scores[key] : 3;
                      const count = indicators[key]?.length || 0;
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
                                    {(TUJUANS[key] || []).map((tujuan, idx) => (
                                      <li key={idx}>{tujuan}</li>
                                    ))}
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
                            {count > 0 && (
                              <Badge
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {count} indikator
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              value={[val]}
                              onValueChange={(v) =>
                                setScores({ ...scores, [key]: v[0] })
                              }
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

      {/* Bottom Nav */}
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
  const items = RUBRICS[rubricKey] || [];
  return (
    <div className="space-y-3">
      {!items.length ? (
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
