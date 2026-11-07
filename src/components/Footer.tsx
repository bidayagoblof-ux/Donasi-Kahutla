import React from 'react';
import { Flame, ShieldCheck, Mail, Phone, MapPin, ExternalLink, Heart, AlertCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#142D4E] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#159A9C] flex items-center justify-center text-white shadow-md">
                <Flame className="w-6 h-6 text-[#F0A43A]" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">DIGITALPAL</span>
                <span className="text-xs text-teal-300 block font-medium">Sahabat Digital untuk Kemanusiaan</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              "Bersama Pulihkan Harapan, Bantu Masyarakat Terdampak Karhutla."
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              DigitalPal adalah platform donasi kemanusiaan terbuka yang memfasilitasi bantuan darurat bagi saudara-saudara kita yang terpapar bencana asap dan kebakaran hutan &amp; lahan di Indonesia. Berkomitmen pada 100% transparansi pencatatan, verifikasi lapangan, dan pelaporan audit kas publik.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Transparansi Keuangan Terbuka
              </span>
            </div>
          </div>

          {/* Navigasi Program */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Program Kemanusiaan</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('program-donasi')} className="hover:text-teal-400 transition text-left">
                  Bantuan Kesehatan &amp; Oksigen Medis
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('program-donasi')} className="hover:text-teal-400 transition text-left">
                  Distribusi Air Bersih &amp; Sumur Bor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('program-donasi')} className="hover:text-teal-400 transition text-left">
                  Masker N95 &amp; APD Pernapasan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('program-donasi')} className="hover:text-teal-400 transition text-left">
                  Paket Pangan Sembako Keluarga
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('program-donasi')} className="hover:text-teal-400 transition text-left">
                  Dukungan Relawan Pemadam MPA
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('program-donasi')} className="hover:text-teal-400 transition text-left">
                  Perlindungan Balita &amp; Lansia
                </button>
              </li>
            </ul>
          </div>

          {/* Transparansi & Data */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Akuntabilitas</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('transparansi')} className="hover:text-teal-400 transition text-left">
                  Laporan Pemasukan &amp; Pengeluaran
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('transparansi')} className="hover:text-teal-400 transition text-left">
                  Daftar Kuitansi &amp; Belanja Riil
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dokumentasi')} className="hover:text-teal-400 transition text-left">
                  Dokumentasi Penyaluran Lapangan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kondisi-karhutla')} className="hover:text-teal-400 transition text-left">
                  Peta GIS Karhutla Terverifikasi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tentang-kami')} className="hover:text-teal-400 transition text-left">
                  Standar Etika &amp; Privasi Penerima
                </button>
              </li>
            </ul>
          </div>

          {/* Posko & Kontak Resmi */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Posko &amp; Bantuan</h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Posko Lapangan Palangka Raya:</strong><br />
                  Jl. RTA Milono Km 4.5, Pahandut, Palangka Raya, Kalimantan Tengah
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Hotline Relawan: +62 821-2026-0800</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>peduli@digitalpal.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Data Disclaimer Notice */}
        <div className="py-6 border-b border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row items-start md:items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-200">Catatan Validitas Data: </span>
            Statistik situasi karhutla, titik panas (hotspot), luas penanganan, dan indeks kualitas udara (ISPU) dikutip dari rilis resmi BNPB (24 Okt 2026), Pemprov/BPBD Kalteng (28-30 Okt 2026), IHCP/Kemenkes (21 Okt 2026), dan BMKG. Setiap indikator mencantumkan tanggal pengamatan spesifik. Angka simulasi perencanaan anggaran dibedakan secara tegas dari transaksi belanja riil.
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Yayasan DigitalPal (Sahabat Digital). Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('tentang-kami')} className="hover:text-white transition">Kebijakan Privasi</button>
            <span>•</span>
            <button onClick={() => onNavigate('transparansi')} className="hover:text-white transition">Ketentuan Donasi</button>
            <span>•</span>
            <button onClick={() => onNavigate('admin')} className="hover:text-white transition">Portal Internal</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
