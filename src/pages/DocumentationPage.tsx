import React from 'react';
import { Camera, Calendar, MapPin, Users, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { AidDistribution } from '../types';

interface DocumentationPageProps {
  distributions: AidDistribution[];
  onNavigateToDonate: () => void;
}

export const DocumentationPage: React.FC<DocumentationPageProps> = ({ distributions, onNavigateToDonate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200 mb-2">
          <Camera className="w-3.5 h-3.5" />
          <span>DOKUMENTASI KEMANUSIAAN TERVERIFIKASI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] tracking-tight">
          Laporan Visual &amp; Bukti Penyaluran Bantuan
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          Bukti nyata amanah donatur yang tersampaikan kepada warga terdampak bencana karhutla di Kalimantan Tengah dan sekitarnya. Seluruh dokumentasi mematuhi kode etik perlindungan privasi anak dan keluarga rentan.
        </p>
      </div>

      {/* Grid of Photo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {distributions.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Photo */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.documentationUrls[0] || 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80'}
                  alt={item.aidType}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {item.status}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-[11px] text-white flex items-center justify-between">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </span>
                  <span className="font-mono text-[10px] shrink-0">{item.distributionDate}</span>
                </div>
              </div>

              {/* Detail */}
              <div className="p-6 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#159A9C]">
                  {item.programName}
                </span>

                <h3 className="font-bold text-lg text-slate-900 leading-snug">
                  {item.aidType}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{item.notes}"
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Kuantitas Disalurkan</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {item.quantity.toLocaleString('id-ID')} {item.unit}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Penerima Terverifikasi</span>
                    <span className="font-bold text-teal-700 text-sm">
                      {item.beneficiariesCount} Orang/KK
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 flex items-center justify-between">
                  <span>Sasaran: <strong>{item.targetGroup}</strong></span>
                  <span>Oleh: <strong>{item.verifiedBy}</strong></span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={onNavigateToDonate}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-[#159A9C] text-white transition flex items-center justify-center gap-2"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Dukung Aksi Lapangan Seperti Ini</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Prinsip Etika Dokumentasi Kemanusiaan:</strong> DigitalPal senantiasa menjaga martabat dan privasi para penyintas. Kami tidak mempublikasikan identitas nama anak di bawah umur, alamat rumah personal, atau foto pasien dalam kondisi gawat darurat yang merendahkan privasi.
        </div>
      </div>

    </div>
  );
};
