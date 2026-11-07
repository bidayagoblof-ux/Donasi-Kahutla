import React, { useState } from 'react';
import { Heart, Search, Filter, Users, Calendar, MapPin, CheckCircle2, Flame, ShieldAlert, ArrowRight } from 'lucide-react';
import { DonationProgram } from '../types';

interface ProgramsPageProps {
  programs: DonationProgram[];
  onSelectProgram: (programId: string) => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ programs, onSelectProgram }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Semua', 'Kesehatan', 'Air Bersih', 'Perlindungan', 'Pangan', 'Operasional', 'Kelompok Rentan', 'Umum'];

  const filteredPrograms = programs.filter(p => {
    const matchesCategory = selectedCategory === 'Semua' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.targetLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="max-w-3xl">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
          PROGRAM KEMANUSIAAN DIGITALPAL
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] tracking-tight mt-2">
          Salurkan Bantuan untuk Wilayah Terdampak Karhutla
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          Pilih program bantuan kemanusiaan yang ingin Anda dukung. Seluruh perolehan donasi dan penyaluran dicatat terbuka untuk umum secara real-time.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#159A9C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama program / kota..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#159A9C]"
          />
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPrograms.map((prog) => {
          const percentage = Math.min(100, Math.round((prog.collectedAmount / prog.targetAmount) * 100));
          return (
            <div
              key={prog.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Badges */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={prog.imageUrl}
                    alt={prog.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-md ${
                      prog.priority === 'darurat' ? 'bg-red-600' : 'bg-[#F0A43A]'
                    }`}>
                      {prog.priority.toUpperCase()}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/80 text-white backdrop-blur-xs">
                      {prog.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {prog.targetLocation}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-extrabold text-lg text-slate-900 leading-snug group-hover:text-[#159A9C] transition-colors">
                    {prog.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {prog.fullDescription}
                  </p>

                  {/* Needs Checklist */}
                  {prog.needsList && prog.needsList.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                        Kebutuhan Disalurkan:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {prog.needsList.slice(0, 3).map((item, iIdx) => (
                          <li key={iIdx} className="flex items-center gap-1.5 truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Progress Section */}
                  <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                      <span className="text-slate-500">Pencapaian Target</span>
                      <span className="text-[#159A9C] font-bold">{percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#159A9C] to-teal-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-xs mt-3">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Terkumpul</div>
                        <div className="font-extrabold text-slate-900 text-sm">
                          Rp {prog.collectedAmount.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Target Donasi</div>
                        <div className="font-bold text-slate-600 text-sm">
                          Rp {prog.targetAmount.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Donor count & dates */}
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <strong>{prog.donorCount}</strong> Donatur
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" /> s/d {prog.endDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectProgram(prog.id)}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#F0A43A] to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white shadow-md shadow-amber-500/20 active:scale-98 transition flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Donasi Sekarang</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">Tidak ada program yang cocok dengan filter pencarian Anda.</p>
        </div>
      )}

    </div>
  );
};
