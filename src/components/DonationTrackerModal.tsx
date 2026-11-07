import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, AlertCircle, Printer, Heart } from 'lucide-react';
import { api } from '../services/api';
import { Donation } from '../types';

interface DonationTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDonate: () => void;
}

export const DonationTrackerModal: React.FC<DonationTrackerModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigateToDonate 
}) => {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [donation, setDonation] = useState<Donation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setDonation(null);

    try {
      const res = await api.getDonationReceipt(orderIdInput.trim());
      setDonation(res);
    } catch (err: any) {
      setErrorMsg('Order ID tidak ditemukan dalam sistem. Pastikan Anda memasukkan kode transaksi dengan benar (contoh: DP-20261028-001).');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#159A9C]">
              Layanan Donatur Mandiri
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Lacak Status &amp; Kuitansi Donasi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleTrack} className="space-y-3">
          <label className="text-xs font-bold text-slate-700 block">
            Masukkan Nomor Order ID Transaksi:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Contoh: DP-20261028-001"
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm font-mono font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#159A9C]"
            />
            <button
              type="submit"
              disabled={isLoading || !orderIdInput.trim()}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#142D4E] hover:bg-[#1F456E] text-white flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>Cari</span>
            </button>
          </div>
        </form>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Donation Details Card if Found */}
        {donation && (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status Pembayaran</span>
                <div className="mt-0.5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    donation.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                    donation.paymentStatus === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {donation.paymentStatus === 'PAID' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {donation.paymentStatus === 'PENDING' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    {donation.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Nominal</span>
                <div className="font-mono font-black text-lg text-slate-900">
                  Rp {donation.amount.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Donatur:</span>
                <span className="font-bold text-slate-800">
                  {donation.isAnonymous ? 'Hamba Allah (Anonim)' : donation.donorName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Program:</span>
                <span className="font-bold text-slate-800 text-right max-w-xs truncate">{donation.programTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kanal Pembayaran:</span>
                <span className="font-mono uppercase text-slate-700">{donation.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu Order:</span>
                <span className="text-slate-700">{new Date(donation.createdAt).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {donation.paymentStatus === 'PAID' && (
              <div className="pt-3 border-t border-slate-200">
                <button
                  onClick={() => window.print()}
                  className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan Kuitansi Resmi PDF</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
