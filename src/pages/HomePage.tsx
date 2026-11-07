import React from 'react';
import { Flame, ShieldCheck, Heart, ArrowRight, Activity, Users, Droplets, Wind, CheckCircle2, AlertTriangle, Eye, Sparkles } from 'lucide-react';
import { DonationProgram, PublicDonor } from '../types';
import { KarhutlaMap } from '../components/KarhutlaMap';

interface HomePageProps {
  programs: DonationProgram[];
  recentDonors: PublicDonor[];
  onNavigate: (tab: string, extra?: any) => void;
  onOpenAiChat: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ programs, recentDonors, onNavigate, onOpenAiChat }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#142D4E] via-[#1F456E] to-[#142D4E] text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle background glow elements */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#159A9C]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#F0A43A]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-amber-300/30 backdrop-blur-md">
                <Flame className="w-4 h-4 text-[#F0A43A]" />
                <span>AKSI TANGGAP DARURAT KARHUTLA INDONESIA 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Ulurkan Kepedulian untuk Saudara Kita yang <span className="text-[#F0A43A]">Terdampak Karhutla</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl">
                Kebakaran hutan dan lahan tidak hanya menghanguskan lingkungan, tetapi juga mengancam kesehatan, kehidupan, dan masa depan masyarakat. Bersama DigitalPal, mari hadirkan bantuan nyata bagi mereka yang membutuhkan.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('donasi-sekarang')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-[#F0A43A] to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30 active:scale-95 transition flex items-center justify-center gap-2.5"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  <span>Donasi Sekarang</span>
                </button>

                <button
                  onClick={() => onNavigate('program-donasi')}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition flex items-center justify-center gap-2"
                >
                  <span>Lihat Program Bantuan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenAiChat}
                  className="w-full sm:w-auto px-5 py-4 rounded-xl font-semibold text-xs bg-[#159A9C]/20 hover:bg-[#159A9C]/30 text-teal-200 border border-teal-400/30 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <span>Tanya Situasi ke AI</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">100%</div>
                  <div className="text-[11px] text-slate-300">Transparansi Kas Digital</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#F0A43A]">7 Program</div>
                  <div className="text-[11px] text-slate-300">Respons Prioritas Bencana</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-teal-300">Terverifikasi</div>
                  <div className="text-[11px] text-slate-300">Data BNPB, BPBD, &amp; IHCP</div>
                </div>
              </div>
            </div>

            {/* Right Hero Card: Urgent Humanitarian Focus */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/40 text-slate-800">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    FOKUS TANGGAP DARURAT ISPU
                  </span>
                  <span className="text-xs text-slate-500 font-mono">ISPU: 1291 (Berbahaya)</span>
                </div>

                <h3 className="text-xl font-extrabold text-[#142D4E] leading-snug">
                  Darurat Kabut Asap Pekat Kalimantan Tengah
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Lebih dari 307.000 warga di beberapa provinsi dilaporkan menderita ISPA, dengan risiko tinggi pada 69.335 balita. Pasokan oksigen darurat, masker N95, dan air bersih untuk meredam bara gambut sangat mendesak.
                </p>

                {/* Progress highlight */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-slate-600">Bantuan Kesehatan &amp; Oksigen Medis</span>
                    <span className="text-[#159A9C] font-bold">38% Tercapai</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#159A9C] h-full rounded-full transition-all" style={{ width: '38%' }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2">
                    <span>Terkumpul: <strong>Rp 28.500.000</strong></span>
                    <span>Target: <strong>Rp 75.000.000</strong></span>
                  </div>
                </div>

                {/* Direct Action */}
                <button
                  onClick={() => onNavigate('donasi-sekarang', { programId: 'prog-kesehatan-01' })}
                  className="w-full mt-5 py-3.5 px-4 rounded-xl font-bold text-sm bg-[#159A9C] hover:bg-[#128284] text-white shadow-md shadow-teal-700/20 active:scale-98 transition flex items-center justify-center gap-2"
                >
                  <span>Bantu Program Medis &amp; Oksigen</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-slate-400 mt-2.5">
                  Bantuan segera dialokasikan untuk posko singgah udara bersih &amp; nebulizer puskesmas.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATISTIK SITUASI NASIONAL KARHUTLA 2026 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>DATA FAKTUAL TERVERIFIKASI RESMI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142D4E]">
            Ringkasan Situasi Bencana Karhutla Nasional
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Informasi diolah dari rilis resmi BNPB, BPBD Kalteng, IHCP, dan Kemenkes. Tidak menggabungkan metode pengukuran yang berbeda.
          </p>
        </div>

        {/* 4 Core Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#159A9C] transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F0A43A] flex items-center justify-center mb-4">
              <Flame className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              13.910
            </div>
            <div className="text-sm font-bold text-slate-700 mt-1">Hotspot Terdeteksi</div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Anomali panas satelit sistem informasi geografis BNPB di seluruh provinsi prioritas.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Sumber: <strong>BNPB</strong></span>
              <span>24 Okt 2026 (15.00 WIB)</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#159A9C] transition">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              25.409 <span className="text-base font-semibold text-slate-500">Ha</span>
            </div>
            <div className="text-sm font-bold text-slate-700 mt-1">Luas Lahan Terbakar</div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Estimasi kumulatif lahan terbakar snapshot nasional, dengan konsentrasi tertinggi di Kalteng (13.944 Ha).
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Sumber: <strong>GIS BNPB</strong></span>
              <span>24 Okt 2026</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#159A9C] transition">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#159A9C] flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              17.942 <span className="text-base font-semibold text-slate-500">Ha</span>
            </div>
            <div className="text-sm font-bold text-slate-700 mt-1">Dalam Penanganan</div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Area yang masih aktif dipadamkan dan dibasahi oleh satgas darat, relawan MPA, dan helikopter bom air.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Sumber: <strong>BNPB Snapshot</strong></span>
              <span>24 Okt 2026</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#159A9C] transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              307.618
            </div>
            <div className="text-sm font-bold text-slate-700 mt-1">Kasus ISPA Tercatat</div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Sebanyak 69.335 di antaranya menyerang balita usia &lt;5 tahun di 68 kabupaten/kota terdampak.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Sumber: <strong>IHCP / Kemenkes</strong></span>
              <span>21 Okt 2026</span>
            </div>
          </div>

        </div>

        {/* Informative banner on Peatland */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#F0A43A] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900">
              <strong>Karakteristik Kebakaran Gambut:</strong> Api dapat terus membara di kedalaman 1-3 meter di bawah tanah meski api permukaan padam. Penanganan membutuhkan ribuan sumur bor, pemompaan air bertekanan, dan pembasahan intensif hingga bara benar-benar padam.
            </div>
          </div>
          <button
            onClick={() => onNavigate('kondisi-karhutla')}
            className="text-xs font-bold text-[#142D4E] hover:text-[#159A9C] flex items-center gap-1 shrink-0 underline"
          >
            Lihat Analisis Detail Karhutla &rarr;
          </button>
        </div>
      </section>

      {/* 3. GIS MAP PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-xs font-bold text-[#159A9C] uppercase tracking-wider">Pemetaan Geografis</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] mt-1">
              Peta Sebaran Dampak &amp; Titik Asesmen DigitalPal
            </h2>
          </div>
          <button
            onClick={() => onNavigate('kondisi-karhutla')}
            className="text-xs sm:text-sm font-semibold text-[#159A9C] hover:text-teal-800 flex items-center gap-1.5"
          >
            Buka Halaman GIS Lengkap <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <KarhutlaMap onSelectProgram={(progId) => onNavigate('donasi-sekarang', { programId: progId })} />
      </section>

      {/* 4. PROGRAM BANTUAN PRIORITAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-[#159A9C] border border-teal-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PROGRAM TERBUKA &amp; TRANSPARAN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142D4E]">
              Program Penggalangan Donasi Kemanusiaan
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Setiap donasi disalurkan tepat sasaran sesuai kebutuhan asesmen kemanusiaan di lapangan.
            </p>
          </div>

          <button
            onClick={() => onNavigate('program-donasi')}
            className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#142D4E] bg-slate-100 hover:bg-slate-200 transition flex items-center gap-2 self-start sm:self-auto"
          >
            <span>Lihat Semua 7 Program</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {programs.slice(0, 6).map((prog) => {
            const percentage = Math.min(100, Math.round((prog.collectedAmount / prog.targetAmount) * 100));
            return (
              <div
                key={prog.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with Priority Badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={prog.imageUrl}
                      alt={prog.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm ${
                        prog.priority === 'darurat' ? 'bg-red-600' : 'bg-[#F0A43A]'
                      }`}>
                        {prog.priority.toUpperCase()}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/80 text-white backdrop-blur-xs">
                        {prog.category}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white">
                      Lokasi: {prog.targetLocation.split(',')[0]}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 leading-snug line-clamp-2 group-hover:text-[#159A9C] transition-colors">
                      {prog.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {prog.shortDescription}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                        <span className="text-slate-500">Tercapai</span>
                        <span className="text-[#159A9C] font-bold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#159A9C] to-teal-400 h-full rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs mt-2">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-medium">Terkumpul</div>
                          <div className="font-bold text-slate-900">
                            Rp {prog.collectedAmount.toLocaleString('id-ID')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 uppercase font-medium">Target</div>
                          <div className="font-semibold text-slate-600">
                            Rp {prog.targetAmount.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Donor count badge */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{prog.donorCount}</strong> Donatur Terverifikasi
                      </span>
                      <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Aktif
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => onNavigate('donasi-sekarang', { programId: prog.id })}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-[#159A9C] text-white transition flex items-center justify-center gap-2 group-hover:shadow-md"
                  >
                    <span>Donasi Sekarang</span>
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. MENGAPA BERDONASI DI DIGITALPAL */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#159A9C] uppercase tracking-wider">Komitmen Lembaga</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] mt-1">
              Mengapa Berdonasi Melalui DigitalPal?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Kami memegang teguh asas akuntabilitas, transparansi, dan perlindungan privasi penerima manfaat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#159A9C] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">100% Transparansi Kas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap donasi yang masuk dan setiap pengeluaran dicatat secara publik. Dilengkapi nomor kuitansi, tanggal, nama vendor, dan peruntukan belanja.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F0A43A] flex items-center justify-center mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Respons Cepat Lapangan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bekerja langsung dengan posko MPA (Masyarakat Peduli Api), relawan lokal, puskesmas pembantu, dan BPBD setempat untuk penyaluran tepat sasaran.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Prioritas Kelompok Rentan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fokus perlindungan ekstra bagi balita, anak sekolah, ibu hamil, lansia, dan pekerja harian terbuka yang paling rentan terhadap komplikasi ISPA.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Kuitansi Resmi Sah</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Donatur menerima bukti donasi resmi ber-nomor registrasi unik dengan opsi nama anonim (Hamba Allah) demi kenyamanan privasi Anda.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. DOA & DUKUNGAN DONATUR TERBARU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#F0A43A] uppercase tracking-wider">Doa &amp; Solidaritas</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] mt-1">
              Dukungan Kebaikan Sahabat Digital
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Catatan donasi berhasil yang diverifikasi melalui sistem pembayaran resmi.
            </p>
          </div>

          <button
            onClick={() => onNavigate('transparansi')}
            className="text-xs sm:text-sm font-semibold text-[#159A9C] hover:text-teal-800 flex items-center gap-1.5"
          >
            Lihat Rekap Donatur Lengkap &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentDonors.slice(0, 6).map((donor, dIdx) => (
            <div key={dIdx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-900">{donor.donorName}</span>
                  <span className="font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Rp {donor.amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-[11px] text-[#159A9C] font-medium mb-3">
                  Untuk: {donor.programTitle}
                </div>
                {donor.message && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{donor.message}"
                  </p>
                )}
              </div>
              <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Status: Terverifikasi</span>
                <span>{new Date(donor.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CTA DONASI BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#142D4E] via-[#1F456E] to-[#159A9C] p-8 sm:p-12 text-white text-center shadow-xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-amber-300/30">
              Setiap Rupiah Berarti bagi Saudara Kita
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Mari Bersama Pulihkan Harapan &amp; Hadirkan Udara Bersih
            </h2>
            <p className="text-sm sm:text-base text-slate-200">
              Donasi mulai dari Rp 25.000 dapat menyalurkan masker standar respirator N95, air bersih, dan pertolongan pertama bagi keluarga yang terkepung asap.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('donasi-sekarang')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#F0A43A] to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white shadow-lg active:scale-95 transition"
              >
                DONASI SEKARANG
              </button>
              <button
                onClick={() => onNavigate('kondisi-karhutla')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
              >
                Pelajari Data Karhutla
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
