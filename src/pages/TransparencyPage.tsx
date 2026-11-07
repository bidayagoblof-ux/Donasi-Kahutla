import React, { useState } from 'react';
import { 
  ShieldCheck, TrendingUp, DollarSign, FileText, CheckCircle2, 
  Download, Printer, Filter, Calendar, Building, MapPin, Receipt, AlertCircle 
} from 'lucide-react';
import { TransparencyReport } from '../types';

interface TransparencyPageProps {
  report: TransparencyReport | null;
  onNavigateToDonate: () => void;
}

export const TransparencyPage: React.FC<TransparencyPageProps> = ({ report, onNavigateToDonate }) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'pengeluaran' | 'penyaluran'>('ringkasan');
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  if (!report) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500">Memuat laporan transparansi publik...</p>
      </div>
    );
  }

  const { summary, expenses, distributions, expenseByCategory } = report;

  const categories = ['Semua', 'Pangan', 'Kesehatan', 'Air Bersih', 'APD & Masker', 'Peralatan Pemadam', 'Operasional & Logistik'];

  const filteredExpenses = expenses.filter(e => {
    return filterCategory === 'Semua' || e.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AKUNTABILITAS &amp; TRANSPARANSI PUBLIK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] tracking-tight">
            Transparansi Keuangan &amp; Penyaluran Dana
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            DigitalPal menjamin akuntabilitas setiap rupiah donasi yang dihimpun. Seluruh pemasukan transaksi berhasil, alokasi program, belanja barang riil dengan nomor kuitansi, dan distribusi ke warga dilaporkan terbuka secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
          <button
            onClick={onNavigateToDonate}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F0A43A] to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20"
          >
            Donasi Sekarang
          </button>
        </div>
      </div>

      {/* CORE FINANCIAL BALANCE EQUATION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Received */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            1. Total Donasi Berhasil
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            Rp {summary.totalReceived.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span>Transaksi Sukses:</span>
            <strong className="text-slate-800">{summary.successTransactionCount} transaksi</strong>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
            Terverifikasi Payment Gateway Midtrans
          </div>
        </div>

        {/* Total Disbursed */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            2. Dana Keluar Disahkan
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
            Rp {summary.totalDisbursed.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span>Status Belanja:</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              {expenses.filter(e => e.status === 'Dibayar').length} Kuitansi Lunas
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
            Bukti invoice &amp; nota vendor terlampir
          </div>
        </div>

        {/* Available Balance */}
        <div className="bg-gradient-to-br from-[#142D4E] to-[#1F456E] text-white p-6 rounded-3xl shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 block">
            3. Saldo Kas Tersedia
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#F0A43A] mt-1">
            Rp {summary.availableBalance.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-slate-300 mt-2 flex items-center justify-between">
            <span>Formula Akuntansi:</span>
            <span className="font-mono text-[11px] text-teal-200">Pemasukan - Pengeluaran</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 text-[10px] text-slate-300">
            Siap dialokasikan untuk tanggap darurat baru
          </div>
        </div>

        {/* Beneficiaries Count */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            4. Penerima Manfaat
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#159A9C] mt-1">
            {summary.totalBeneficiaries.toLocaleString('id-ID')} <span className="text-sm font-semibold text-slate-500">Jiwa</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span>Aksi Penyaluran:</span>
            <strong className="text-slate-800">{distributions.length} Titik Lapangan</strong>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
            Agregasi tanpa mempublikasikan identitas privat
          </div>
        </div>

      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('ringkasan')}
          className={`pb-3 px-3 transition whitespace-nowrap border-b-2 ${
            activeTab === 'ringkasan' ? 'border-[#159A9C] text-[#159A9C]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Alokasi Belanja per Kategori
        </button>
        <button
          onClick={() => setActiveTab('pengeluaran')}
          className={`pb-3 px-3 transition whitespace-nowrap border-b-2 ${
            activeTab === 'pengeluaran' ? 'border-[#159A9C] text-[#159A9C]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Daftar Bukti Pengeluaran Riil ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('penyaluran')}
          className={`pb-3 px-3 transition whitespace-nowrap border-b-2 ${
            activeTab === 'penyaluran' ? 'border-[#159A9C] text-[#159A9C]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Catatan Penyaluran Lapangan ({distributions.length})
        </button>
      </div>

      {/* TAB 1: BREAKDOWN KATEGORI BELANJA */}
      {activeTab === 'ringkasan' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Proporsi Pengeluaran Dana Terverifikasi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Berikut rincian realisasi belanja dana donasi berdasarkan pos penanganan bencana di lapangan:
            </p>

            <div className="space-y-3.5 pt-2">
              {Object.entries(expenseByCategory).map(([cat, amt]) => {
                const pct = summary.totalDisbursed > 0 
                  ? Math.round((amt / summary.totalDisbursed) * 100) 
                  : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{cat}</span>
                      <span className="text-slate-900 font-bold">
                        Rp {amt.toLocaleString('id-ID')} <span className="text-slate-400 font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#159A9C] h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-5 bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Asas Transparansi DigitalPal</h3>
            <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Pencatatan Otomatis:</strong> Transaksi donasi langsung terverifikasi oleh payment gateway resmi, meniadakan selisih kas.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Verifikasi Dokumen:</strong> Setiap pengeluaran di atas Rp 1.000.000 wajib menyertakan nomor nota/faktur vendor dan persetujuan manajer keuangan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Perlindungan Privasi:</strong> Data penerima manfaat disajikan dalam bentuk agregat untuk menjaga martabat keluarga penerima bantuan.
                </span>
              </li>
            </ul>
          </div>

        </div>
      )}

      {/* TAB 2: PENGELUARAN RIIL */}
      {activeTab === 'pengeluaran' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Buku Pencatatan Pengeluaran Resmi</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rincian belanja barang, logistik medis, sumur bor, dan sembako tanggap bencana.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#159A9C]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Tanggal &amp; Kuitansi</th>
                  <th className="py-3 px-4">Uraian Pengeluaran</th>
                  <th className="py-3 px-4">Program &amp; Kategori</th>
                  <th className="py-3 px-4">Vendor / Penyedia</th>
                  <th className="py-3 px-4 text-right">Nominal (Rp)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{exp.expenseDate}</div>
                      <div className="font-mono text-[10px] text-slate-400">{exp.receiptNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{exp.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{exp.notes}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {exp.category}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{exp.programName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700">{exp.vendorName}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      Rp {exp.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        exp.status === 'Dibayar' ? 'bg-emerald-100 text-emerald-800' :
                        exp.status === 'Disetujui' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PENYALURAN LAPANGAN */}
      {activeTab === 'penyaluran' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Catatan Distribusi Bantuan Lapangan</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribusi fisik barang bantuan diverifikasi oleh relawan lapangan dan perangkat desa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {distributions.map((dist) => (
              <div key={dist.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {dist.distributionDate}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {dist.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-slate-900">{dist.aidType}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#159A9C] font-medium mt-0.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{dist.location}, {dist.province}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 text-[10px]">Volume Disalurkan:</span>
                    <div className="font-bold text-slate-800 text-sm">
                      {dist.quantity.toLocaleString('id-ID')} {dist.unit}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Penerima Manfaat:</span>
                    <div className="font-bold text-slate-800 text-sm">
                      {dist.beneficiariesCount} Orang/KK
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{dist.notes}"
                </p>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Sasaran: <strong>{dist.targetGroup}</strong></span>
                  <span>Verifikator: <strong>{dist.verifiedBy}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
