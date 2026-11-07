import React, { useState } from 'react';
import { Flame, AlertTriangle, Wind, Droplets, ShieldAlert, Activity, FileText, ExternalLink, Info, CheckCircle2, Heart } from 'lucide-react';
import { KarhutlaDataset } from '../types';
import { KarhutlaMap } from '../components/KarhutlaMap';

interface KarhutlaConditionPageProps {
  dataset: KarhutlaDataset | null;
  onNavigateToDonate: (programId?: string) => void;
}

export const KarhutlaConditionPage: React.FC<KarhutlaConditionPageProps> = ({ dataset, onNavigateToDonate }) => {
  const [activeTab, setActiveTab] = useState<'peta' | 'provinsi' | 'kesehatan' | 'kebutuhan' | 'sumber'>('peta');

  const priorityProvinces = [
    {
      province: 'Kalimantan Tengah',
      hotspots: 8049,
      burnedArea: 13944,
      responseArea: 11786,
      status: 'Prioritas Tertinggi (ISPU >1200 Berbahaya)',
      source: 'SRC-BNPB-2026-10-24',
      suggestedProg: 'prog-kesehatan-01'
    },
    {
      province: 'Sumatera Selatan',
      hotspots: 1335,
      burnedArea: 3429,
      responseArea: 2472,
      status: 'Darurat Gambut & Water Bombing BNPB',
      source: 'SRC-BNPB-2026-10-24',
      suggestedProg: 'prog-darurat-07'
    },
    {
      province: 'Kalimantan Barat',
      hotspots: 1137,
      burnedArea: 2500,
      responseArea: 1547,
      status: 'Kabut Asap Lintas Wilayah',
      source: 'SRC-BNPB-2026-10-24',
      suggestedProg: 'prog-pangan-04'
    },
    {
      province: 'Kalimantan Selatan',
      hotspots: 362,
      burnedArea: 526,
      responseArea: 317,
      status: 'Pemantauan Ring 1 Bandara & Kota',
      source: 'SRC-BNPB-2026-10-24',
      suggestedProg: 'prog-relawan-05'
    },
    {
      province: 'Papua Selatan',
      hotspots: 487,
      burnedArea: 310,
      responseArea: 117,
      status: 'Kebakaran Rawa Gambut & Savana',
      source: 'SRC-BNPB-2026-10-24',
      suggestedProg: 'prog-darurat-07'
    }
  ];

  const ispuList = [
    { location: 'Kota Palangka Raya', ispu: 1291, category: 'Berbahaya', note: 'Kadar partikulat PM2.5 sangat tinggi, jarak pandang <500 meter.' },
    { location: 'Kab. Kotawaringin Timur (Sampit)', ispu: 1290, category: 'Berbahaya', note: 'Sekolah diliburkan sementara, kabut asap menyelimuti permukiman.' },
    { location: 'Kab. Gunung Mas', ispu: null, category: 'Berbahaya (Asesmen)', note: 'Nilai ISPU spesifik belum terpasang alat stasiun tetap, kategori bahaya dari laporan IHCP.' },
    { location: 'Kab. Barito Selatan', ispu: null, category: 'Berbahaya (Asesmen)', note: 'Asap pekat dari gambut, kasus ISPA meningkat pada balita.' },
    { location: 'Kab. Katingan', ispu: null, category: 'Berbahaya (Asesmen)', note: 'Aktivitas karhutla aktif di sekitar kawasan konservasi gambut.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            SITUASI KARHUTLA INDONESIA 2026
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Cut-off Data: 30 Oktober 2026 • Versi Dataset: 1.0.0
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] tracking-tight">
          Informasi &amp; Pemetaan Karhutla Terverifikasi
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Sesuai prinsip transparansi DigitalPal, seluruh angka situasi kebencanaan pada halaman ini bersumber langsung dari publikasi resmi lembaga negara (BNPB, BPBD Kalteng, Kemenkes RI, IHCP, dan BMKG). Tidak ada data yang direkayasa atau digabungkan antar periode yang berbeda.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('peta')}
          className={`pb-3 px-3 transition whitespace-nowrap border-b-2 ${
            activeTab === 'peta' ? 'border-[#159A9C] text-[#159A9C]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Peta GIS Interaktif
        </button>
        <button
          onClick={() => setActiveTab('provinsi')}
          className={`pb-3 px-3 transition whitespace-nowrap border-b-2 ${
            activeTab === 'provinsi' ? 'border-[#159A9C] text-[#159A9C]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Data Provinsi Prioritas BNPB
        </button>
        <button
          onClick={() => setActiveTab('kesehatan')}
          className={`pb-3 px-3 transition whitespace-nowrap border-b-2 ${
            activeTab === 'kesehatan' ? 'border-[#159A9C] text-[#159A9C]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Kesehatan &amp; Kelompok Rentan (ISPU/ISPA)
        </button>
        <button
          onClick={() => setActiveTab('kebutuhan')}
          className={`pb-3 px-3 transition whitespace-nowrap border-b-2 ${
            activeTab === 'kebutuhan' ? 'border-[#159A9C] text-[#159A9C]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Matriks Kebutuhan Kemanusiaan
        </button>
        <button
          onClick={() => setActiveTab('sumber')}
          className={`pb-3 px-3 transition whitespace-nowrap border-b-2 ${
            activeTab === 'sumber' ? 'border-[#159A9C] text-[#159A9C]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sumber Referensi Resmi &amp; Validitas
        </button>
      </div>

      {/* TAB CONTENT: PETA GIS */}
      {activeTab === 'peta' && (
        <div className="space-y-6">
          <KarhutlaMap onSelectProgram={onNavigateToDonate} />

          {/* ISPU High Alert Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-lg text-slate-900">
                  Wilayah Kategori ISPU Berbahaya (Snapshot IHCP 19-21 Oktober 2026)
                </h3>
              </div>
              <span className="text-xs text-slate-500">Nilai &gt; 300 = Berbahaya</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-4">Wilayah / Kabupaten</th>
                    <th className="py-3 px-4">Indeks ISPU</th>
                    <th className="py-3 px-4">Kategori Kualitas Udara</th>
                    <th className="py-3 px-4">Kondisi Lapangan</th>
                    <th className="py-3 px-4 text-right">Aksi Donasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ispuList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{item.location}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-red-600">
                        {item.ispu !== null ? item.ispu : <span className="text-slate-400 font-normal italic">Data belum tersedia</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{item.note}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onNavigateToDonate('prog-kesehatan-01')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#159A9C] text-white hover:bg-[#128284] transition"
                        >
                          Salurkan Bantuan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PROVINSI PRIORITAS BNPB */}
      {activeTab === 'provinsi' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                5 Provinsi Prioritas Penanganan Karhutla Nasional
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Data snapshot sistem informasi geografis BNPB per 24 Oktober 2026 pukul 15.00 WIB.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-4">Provinsi</th>
                    <th className="py-3 px-4">Hotspot Satelit</th>
                    <th className="py-3 px-4">Luas Terbakar (Ha)</th>
                    <th className="py-3 px-4">Dalam Penanganan (Ha)</th>
                    <th className="py-3 px-4">Status &amp; Keterangan</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {priorityProvinces.map((prov, pIdx) => (
                    <tr key={pIdx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{prov.province}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#F0A43A]">
                        {prov.hotspots.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {prov.burnedArea.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#159A9C]">
                        {prov.responseArea.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{prov.status}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onNavigateToDonate(prov.suggestedProg)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#F0A43A] to-amber-600 text-white hover:from-amber-500 hover:to-amber-700 transition"
                        >
                          Bantu Wilayah Ini
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong>Catatan Metodologi BNPB:</strong> Hotspot merupakan anomali suhu panas yang tertangkap sensor satelit Terra/Aqua/SNPP/NOAA-20. Hotspot mengindikasikan potensi kebakaran dan memerlukan verifikasi patroli darurat atau drone sebelum dipastikan sebagai luasan kebakaran riil.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: KESEHATAN & KELOMPOK RENTAN */}
      {activeTab === 'kesehatan' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-3xl font-extrabold text-blue-600 mb-1">
                69.335
              </div>
              <div className="font-bold text-slate-800 text-sm">Kasus ISPA Balita (&lt;5 Tahun)</div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Saluran pernapasan balita sangat rentan terhadap iritasi partikel PM2.5. Memerlukan perlindungan masker pediatrik dan ruang isolasi udara bersih.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Sumber: IHCP / Kemenkes 21 Okt 2026
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-3xl font-extrabold text-teal-600 mb-1">
                77.144
              </div>
              <div className="font-bold text-slate-800 text-sm">Kasus ISPA Anak (6-9 Tahun)</div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Aktivitas di sekolah luar ruangan memperbesar paparan langsung. Bantuan masker N95 dan edukasi evakuasi paparan asap sangat mendesak.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Sumber: IHCP / Kemenkes 21 Okt 2026
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-3xl font-extrabold text-amber-600 mb-1">
                49.708
              </div>
              <div className="font-bold text-slate-800 text-sm">Kasus ISPA Lansia (&gt;60 Tahun)</div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Lansia memiliki risiko komplikasi pernapasan berat, terutama yang memiliki riwayat asma, PPOK, atau hipertensi.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Sumber: IHCP / Kemenkes 21 Okt 2026
              </div>
            </div>

          </div>

          {/* Vulnerable groups table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Pedoman Asesmen Kelompok Rentan DigitalPal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-800 text-sm mb-1">Ibu Hamil &amp; Menyusui</div>
                <p className="text-slate-600 mb-2">
                  Risiko penurunan saturasi oksigen dan gangguan tumbuh kembang janin akibat racun karbon monoksida (CO).
                </p>
                <div className="text-teal-700 font-semibold">Kebutuhan Utama: Suplemen vitamin, ruang tidur berfilter HEPA, akses faskes darurat.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-800 text-sm mb-1">Pekerja Luar Ruangan &amp; Buruh Harian</div>
                <p className="text-slate-600 mb-2">
                  Petani gambut, penyadap karet, dan buruh harian terpapar langsung 8-10 jam sehari dengan potensi kehilangan pendapatan.
                </p>
                <div className="text-teal-700 font-semibold">Kebutuhan Utama: Respirator N95, kacamata goggle pelindung, paket sembako pengganti nafkah.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-800 text-sm mb-1">Penderita Asma &amp; PPOK</div>
                <p className="text-slate-600 mb-2">
                  Partikel asap memicu bronkospasme akut yang dapat mengancam jiwa dalam hitungan menit jika obat inhaler habis.
                </p>
                <div className="text-teal-700 font-semibold">Kebutuhan Utama: Tabung oksigen medis portabel, obat bronkodilator, terapi nebulizer gratis.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-800 text-sm mb-1">Relawan Pemadam Kebakaran MPA</div>
                <p className="text-slate-600 mb-2">
                  Menghadapi panas ekstrem radiasi api gambut, kelelahan fisik, dan bahaya terperosok ke dalam bara gambut bawah tanah.
                </p>
                <div className="text-teal-700 font-semibold">Kebutuhan Utama: Sepatu safety tahan bara, sarung tangan pemadam, suplai air minum &amp; BBM mesin pompa.</div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: KEBUTUHAN KEMANUSIAAN */}
      {activeTab === 'kebutuhan' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  WASH
                </div>
                <h4 className="font-bold text-slate-900 text-base">Air Bersih &amp; Sanitasi (WASH)</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" /> Air minum layak konsumsi (kemasan galon/jeriken)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" /> Air bersih rumah tangga untuk membasahi masker/lap</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" /> Tangki air bergerak 5.000 liter untuk zona krisis air</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" /> Sumur bor pembasahan gambut membara</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onNavigateToDonate('prog-air-02')}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-[#159A9C] text-white hover:bg-[#128284] transition"
                >
                  Donasi Program Air Bersih
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-800 flex items-center justify-center font-bold text-xs">
                  MED
                </div>
                <h4 className="font-bold text-slate-900 text-base">Kesehatan &amp; Oksigen Medis</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" /> Tabung oksigen medis dan regulator isi ulang</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" /> Alat nebulizer portabel di posko-posko desa</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" /> Obat tetes mata iritasi dan salep luka bakar ringan</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" /> Posko singgah berfilter udara (Clean Air Haven)</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onNavigateToDonate('prog-kesehatan-01')}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-[#159A9C] text-white hover:bg-[#128284] transition"
                >
                  Donasi Program Medis &amp; ISPA
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  FOOD
                </div>
                <h4 className="font-bold text-slate-900 text-base">Pangan &amp; Sembako Darurat</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" /> Beras berkualitas 10 kg per keluarga</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" /> Sumber protein telur ayam dan makanan kaleng sarden</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" /> Minyak goreng, biskuit gizi, dan susu balita</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" /> Makanan siap santap untuk tim relawan pemadam</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onNavigateToDonate('prog-pangan-04')}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-[#159A9C] text-white hover:bg-[#128284] transition"
                >
                  Donasi Paket Sembako
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                  FIRE
                </div>
                <h4 className="font-bold text-slate-900 text-base">Operasional Relawan Pemadam MPA</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" /> Mesin pompa air portabel (tipe Alcon/Robin)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" /> Selang kanvas pemadam tahan tekanan dan nozzle</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" /> Bahan bakar bensin &amp; oli mesin pemompaan 24 jam</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" /> Sepatu safety boots dan respirator full-face</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onNavigateToDonate('prog-relawan-05')}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-[#159A9C] text-white hover:bg-[#128284] transition"
                >
                  Donasi Operasional Pemadam
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT: SUMBER RESMI & VALIDITAS */}
      {activeTab === 'sumber' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Daftar Sumber Referensi Resmi Karhutla 2026</h3>
            <p className="text-xs text-slate-500 mt-1">
              Setiap kutipan statistik pada platform DigitalPal dapat ditelusuri ke publikasi aslinya:
            </p>
          </div>

          <div className="space-y-4">
            {dataset?.sources ? dataset.sources.map((src, sIdx) => (
              <div key={sIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700">{src.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-100 text-teal-800">
                      {src.type}
                    </span>
                    <span className="text-slate-400">Tgl Rilis: {src.published_at}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{src.title}</h4>
                  <p className="text-slate-500 mt-0.5">Penerbit: <strong>{src.publisher}</strong></p>
                  <p className="text-slate-600 mt-1 italic">{src.notes}</p>
                </div>

                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 shrink-0 transition"
                >
                  <span>Buka Sumber</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )) : (
              <p className="text-xs text-slate-500">Memuat sumber data...</p>
            )}
          </div>

          {/* Known Inconsistencies Guidance */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="font-bold text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F0A43A]" />
              Catatan Metodologi &amp; Kualitas Data (Data Quality Policy)
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Angka hotspot kumulatif Pemprov Kalteng (371.692 titik hingga 28 Oktober 2026) berbeda secara metodologi dan rentang waktu dari snapshot satelit BNPB (8.049 titik pada 24 Oktober). Angka tidak boleh dijumlahkan.</li>
              <li>Data kasus ISPA merupakan rekapitulasi fasilitas kesehatan Kemenkes/IHCP per 21 Oktober 2026, bukan pengukuran real-time harian.</li>
              <li>Target bantuan pangan 450.000 warga merupakan perencanaan kesiapan pemerintah daerah, bukan bukti bahwa seluruhnya telah tersalurkan.</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};
