import React, { useState } from 'react';
import { Users, Heart, Search, Filter, ShieldCheck, Calendar, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PublicDonor } from '../types';

interface DonorsListPageProps {
  donors: PublicDonor[];
  onNavigateToDonate: () => void;
  onTrackDonation?: () => void;
}

export const DonorsListPage: React.FC<DonorsListPageProps> = ({ 
  donors, 
  onNavigateToDonate,
  onTrackDonation 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('Semua');

  // Extract unique program titles
  const programTitles = ['Semua', ...Array.from(new Set(donors.map(d => d.programTitle)))];

  const filteredDonors = donors.filter(d => {
    const matchesSearch = d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.programTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (d.message && d.message.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesProgram = selectedProgram === 'Semua' || d.programTitle === selectedProgram;
    return matchesSearch && matchesProgram;
  });

  const totalRaisedDonors = donors.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0A43A]/15 text-amber-800 border border-amber-300 mb-2">
            <Heart className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
            <span>ORANG BAIK PEDULI KARHUTLA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] tracking-tight">
            Daftar Donatur Sahabat Digital
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Apresiasi setinggi-tingginya kepada seluruh donatur yang telah mengikhlaskan rezeki untuk saudara kita yang terdampak karhutla. Hanya transaksi yang berstatus terverifikasi (PAID) yang ditampilkan pada daftar ini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onTrackDonation && (
            <button
              onClick={onTrackDonation}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
            >
              Lacak Order Donasi Saya
            </button>
          )}

          <button
            onClick={onNavigateToDonate}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F0A43A] to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>Ikut Berdonasi</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Donasi Tercatat</span>
          <div className="text-2xl font-black text-emerald-600 mt-0.5">
            Rp {totalRaisedDonors.toLocaleString('id-ID')}
          </div>
          <span className="text-xs text-slate-500">Dari transaksi online sukses</span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Jumlah Transaksi Terverifikasi</span>
          <div className="text-2xl font-black text-[#142D4E] mt-0.5">
            {donors.length} Donasi
          </div>
          <span className="text-xs text-slate-500">Tanpa data fiktif atau pending</span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Jaminan Privasi &amp; Anonimitas</span>
          <div className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            100% Aman Terproteksi
          </div>
          <span className="text-[11px] text-slate-500">Email &amp; nomor telepon tidak pernah dipublikasikan</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama donatur, doa, atau program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#159A9C]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full sm:w-64 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none"
          >
            {programTitles.map((title) => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Donors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDonors.map((donor, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-[#159A9C] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-teal-50 text-[#159A9C] flex items-center justify-center font-bold text-sm">
                    {donor.donorName.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">
                      {donor.donorName}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Order: {donor.orderId.slice(0, 11)}***
                    </span>
                  </div>
                </div>

                <span className="font-mono font-bold text-sm text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
                  Rp {donor.amount.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Didonasikan Untuk:
                </span>
                <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                  {donor.programTitle}
                </p>
              </div>

              {donor.message && (
                <div className="text-xs text-slate-600 italic bg-amber-50/60 p-3 rounded-2xl border border-amber-100 flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">"{donor.message}"</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Terverifikasi Sah
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(donor.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredDonors.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs sm:text-sm">
          Tidak ada data donatur yang sesuai dengan kata kunci pencarian Anda.
        </div>
      )}

    </div>
  );
};
