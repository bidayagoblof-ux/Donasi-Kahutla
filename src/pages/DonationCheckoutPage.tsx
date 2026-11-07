import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, ShieldCheck, Check, ArrowRight, ArrowLeft, Copy, 
  ExternalLink, QrCode, CreditCard, Building2, Smartphone, 
  CheckCircle2, Clock, AlertCircle, Printer, Download, RefreshCw, UserCheck
} from 'lucide-react';
import { DonationProgram, Donation, PaymentInstruction } from '../types';
import { api } from '../services/api';

interface DonationCheckoutPageProps {
  programs: DonationProgram[];
  preselectedProgramId?: string;
  onNavigate: (tab: string) => void;
}

const PRESET_AMOUNTS = [25000, 50000, 100000, 250000, 500000, 1000000];

export const DonationCheckoutPage: React.FC<DonationCheckoutPageProps> = ({ 
  programs, 
  preselectedProgramId, 
  onNavigate 
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    preselectedProgramId || (programs[0] ? programs[0].id : '')
  );
  const [amount, setAmount] = useState<number>(100000);
  const [customAmountStr, setCustomAmountStr] = useState<string>('');
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);

  // Donor Info
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<string>('qris');

  // Checkout response state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdDonation, setCreatedDonation] = useState<Donation | null>(null);
  const [paymentInstruction, setPaymentInstruction] = useState<PaymentInstruction | null>(null);
  
  // Payment status polling
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED' | 'CANCELLED'>('PENDING');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);

  useEffect(() => {
    if (preselectedProgramId) {
      setSelectedProgramId(preselectedProgramId);
    }
  }, [preselectedProgramId]);

  // Polling for payment status when in payment step
  useEffect(() => {
    if (step !== 5 || !createdDonation || paymentStatus === 'PAID') return;

    const interval = setInterval(async () => {
      try {
        const res = await api.checkPaymentStatus(createdDonation.orderId);
        if (res.status === 'PAID') {
          setPaymentStatus('PAID');
          triggerConfetti();
        } else if (res.status === 'EXPIRED' || res.status === 'FAILED') {
          setPaymentStatus(res.status as any);
        }
      } catch (e) {
        // quiet poll fail
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [step, createdDonation, paymentStatus]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const selectedProgram = programs.find(p => p.id === selectedProgramId) || programs[0];

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setIsCustomAmount(false);
    setCustomAmountStr('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = Number(raw);
    setCustomAmountStr(raw ? num.toLocaleString('id-ID') : '');
    setAmount(num);
    setIsCustomAmount(true);
  };

  const handleCreateOrder = async () => {
    setErrorMsg(null);
    if (!selectedProgramId) {
      setErrorMsg('Silakan pilih program donasi terlebih dahulu.');
      return;
    }
    if (amount < 10000) {
      setErrorMsg('Nominal donasi minimal Rp 10.000.');
      return;
    }
    if (!donorName.trim()) {
      setErrorMsg('Silakan isi nama Anda (atau pilih opsi Hamba Allah/Anonim).');
      return;
    }
    if (!donorEmail.trim() || !donorEmail.includes('@')) {
      setErrorMsg('Silakan isi alamat email yang valid untuk pengiriman bukti donasi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.createDonation({
        programId: selectedProgramId,
        amount,
        donorName: isAnonymous ? 'Hamba Allah (Donatur Anonim)' : donorName.trim(),
        donorEmail: donorEmail.trim(),
        donorPhone: donorPhone.trim() || undefined,
        donorMessage: donorMessage.trim() || undefined,
        isAnonymous,
        paymentMethod
      });

      setCreatedDonation(res.donation);
      setPaymentInstruction(res.paymentInstruction);
      setPaymentStatus(res.donation.paymentStatus);
      setStep(5); // Move to payment view
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses pembayaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateSuccess = async () => {
    if (!createdDonation) return;
    setIsCheckingStatus(true);
    try {
      await api.simulatePayment(createdDonation.orderId, 'PAID');
      setPaymentStatus('PAID');
      triggerConfetti();
    } catch (err: any) {
      alert('Gagal simulasi: ' + err.message);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#F0A43A]/15 text-amber-800 border border-amber-300">
          FORMULIR DONASI RESMI DIGITALPAL
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] mt-2">
          Salurkan Bantuan Kemanusiaan Karhutla
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Proses cepat, aman, dan langsung tercatat pada buku transparansi publik.
        </p>
      </div>

      {/* Progress Steps Header */}
      {step < 5 && (
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-200 -z-0" />
            
            {[
              { num: 1, label: 'Program' },
              { num: 2, label: 'Nominal' },
              { num: 3, label: 'Donatur' },
              { num: 4, label: 'Pembayaran' }
            ].map((s) => {
              const isPassed = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                    isPassed ? 'bg-[#159A9C] text-white' :
                    isCurrent ? 'bg-[#142D4E] text-white ring-4 ring-teal-100' :
                    'bg-white text-slate-400 border border-slate-300'
                  }`}>
                    {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                  </div>
                  <span className={`text-[11px] font-semibold mt-1.5 ${
                    isCurrent ? 'text-[#142D4E]' : 'text-slate-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ERROR MESSAGE NOTIFICATION */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 1: PILIH PROGRAM */}
      {/* ======================================================== */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Langkah 1: Pilih Program Bantuan</h2>
            <p className="text-xs text-slate-500 mt-1">
              Pilih program spesifik atau alokasikan untuk Dana Kemanusiaan Umum Karhutla.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((prog) => {
              const isSelected = selectedProgramId === prog.id;
              return (
                <div
                  key={prog.id}
                  onClick={() => setSelectedProgramId(prog.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex gap-3.5 items-start ${
                    isSelected
                      ? 'border-[#159A9C] bg-teal-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <img
                    src={prog.imageUrl}
                    alt={prog.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {prog.category}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#159A9C] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mt-1 line-clamp-1">
                      {prog.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {prog.shortDescription}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-[#142D4E] hover:bg-[#1F456E] text-white flex items-center gap-2 transition"
            >
              <span>Lanjut Pilih Nominal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 2: PILIH NOMINAL */}
      {/* ======================================================== */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Langkah 2: Pilih Nominal Donasi</h2>
              <p className="text-xs text-slate-500 mt-1">
                Program: <strong>{selectedProgram?.name}</strong>
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
            >
              Ubah Program
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESET_AMOUNTS.map((amt) => {
              const isSelected = !isCustomAmount && amount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleSelectPreset(amt)}
                  className={`py-3.5 px-4 rounded-2xl border-2 text-center transition font-bold text-sm ${
                    isSelected
                      ? 'border-[#159A9C] bg-teal-50 text-[#142D4E] shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  Rp {amt.toLocaleString('id-ID')}
                </button>
              );
            })}
          </div>

          {/* Custom Nominal Input */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Atau Masukkan Nominal Lainnya (Min. Rp 10.000):
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                Rp
              </span>
              <input
                type="text"
                value={customAmountStr}
                onChange={handleCustomAmountChange}
                placeholder="Contoh: 150.000"
                className="w-full pl-12 pr-4 py-3 text-base font-bold text-slate-900 rounded-2xl border-2 border-slate-200 focus:border-[#159A9C] focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Setiap nominal donasi disalurkan utuh tanpa potongan biaya administrasi tersembunyi.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>

            <button
              onClick={() => {
                if (amount < 10000) {
                  setErrorMsg('Nominal donasi minimal Rp 10.000.');
                  return;
                }
                setErrorMsg(null);
                setStep(3);
              }}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-[#142D4E] hover:bg-[#1F456E] text-white flex items-center gap-2 transition"
            >
              <span>Lanjut Data Donatur</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 3: DATA DONATUR */}
      {/* ======================================================== */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Langkah 3: Data &amp; Doa Donatur</h2>
            <p className="text-xs text-slate-500 mt-1">
              Data Anda terlindungi aman. Anda dapat memilih opsi anonim (Hamba Allah).
            </p>
          </div>

          {/* Anonymous toggle */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <span className="font-bold text-sm text-slate-900 block">Sembunyikan Nama (Donasi Anonim)</span>
                <span className="text-[11px] text-slate-600">
                  Nama Anda ditampilkan sebagai "Hamba Allah" pada daftar donatur publik.
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#159A9C]"></div>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#159A9C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Alamat Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#159A9C]"
                />
                <span className="text-[10px] text-slate-400">Untuk pengiriman kuitansi bukti sah donasi.</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nomor WhatsApp (Opsional)
                </label>
                <input
                  type="tel"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#159A9C]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Doa / Pesan Kebaikan (Opsional)
              </label>
              <textarea
                rows={3}
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                placeholder="Tuliskan doa atau pesan penguat bagi saudara kita yang terdampak karhutla..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#159A9C]"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>

            <button
              onClick={() => {
                if (!donorName.trim()) {
                  setErrorMsg('Silakan isi nama Anda.');
                  return;
                }
                if (!donorEmail.trim() || !donorEmail.includes('@')) {
                  setErrorMsg('Email wajib diisi dengan format valid.');
                  return;
                }
                setErrorMsg(null);
                setStep(4);
              }}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-[#142D4E] hover:bg-[#1F456E] text-white flex items-center gap-2 transition"
            >
              <span>Lanjut Ringkasan &amp; Metode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 4: RINGKASAN & METODE PEMBAYARAN */}
      {/* ======================================================== */}
      {step === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Langkah 4: Pilih Metode Pembayaran</h2>
            <p className="text-xs text-slate-500 mt-1">
              Periksa ringkasan donasi dan tentukan kanal pembayaran online resmi.
            </p>
          </div>

          {/* Ringkasan Biaya Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
            <div className="font-bold text-slate-800 text-sm mb-1">Rincian Pembayaran Donasi:</div>
            <div className="flex justify-between text-slate-600">
              <span>Program Bantuan:</span>
              <span className="font-semibold text-slate-900 text-right">{selectedProgram?.name}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Nama Donatur:</span>
              <span className="font-semibold text-slate-900">{isAnonymous ? 'Hamba Allah (Anonim)' : donorName}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Nominal Pokok Donasi:</span>
              <span className="font-semibold text-slate-900">Rp {amount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Biaya Transaksi Payment Gateway:</span>
              <span className="font-semibold">Rp 0 (Ditanggung Lembaga)</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
              <span>Total Pembayaran:</span>
              <span className="text-lg text-[#159A9C] font-extrabold">
                Rp {amount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Pilih Kanal Pembayaran Online:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'qris', name: 'QRIS (Semua Bank & E-Wallet)', icon: QrCode, desc: 'BCA, Mandiri, GoPay, OVO, Dana, LinkAja, ShopeePay' },
                { id: 'bca_va', name: 'BCA Virtual Account', icon: Building2, desc: 'Transfer via BCA Mobile / KlikBCA / ATM BCA' },
                { id: 'mandiri_va', name: 'Mandiri Virtual Account (Livin)', icon: Building2, desc: 'Pembayaran via Livin by Mandiri' },
                { id: 'bni_va', name: 'BNI Virtual Account', icon: Building2, desc: 'Transfer via BNI Mobile / ATM' },
                { id: 'bri_va', name: 'BRI Virtual Account (BRIVA)', icon: Building2, desc: 'Transfer via BRImo / ATM' },
                { id: 'gopay', name: 'GoPay / Gojek App', icon: Smartphone, desc: 'Notifikasi instan via aplikasi Gojek' }
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                const IconComponent = m.icon;
                return (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#159A9C] bg-teal-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-[#159A9C] text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">{m.name}</span>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#159A9C]" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>

            <button
              onClick={handleCreateOrder}
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#F0A43A] to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white shadow-md active:scale-95 transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Membuat Transaksi...</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Bayar Sekarang (Rp {amount.toLocaleString('id-ID')})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 5: INSTRUKSI PEMBAYARAN & KUITANSI RESMI */}
      {/* ======================================================== */}
      {step === 5 && createdDonation && paymentInstruction && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* PAID STATUS RECEIPT / KUITANSI SAH */}
          {paymentStatus === 'PAID' ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg text-slate-800 space-y-6">
              
              {/* Receipt Header */}
              <div className="text-center pb-6 border-b border-slate-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  PEMBAYARAN TERVERIFIKASI • STATUS PAID
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] mt-2">
                  Terima Kasih, Orang Baik!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  "Terima kasih telah menjadi bagian dari gerakan kemanusiaan DigitalPal. Dukungan Anda membantu menghadirkan harapan bagi masyarakat yang terdampak karhutla."
                </p>
              </div>

              {/* Official Receipt Card */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nomor Transaksi Resmi</span>
                    <div className="font-mono font-bold text-sm sm:text-base text-slate-900">
                      {createdDonation.orderId}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Waktu Verifikasi</span>
                    <div className="text-xs font-semibold text-slate-700">
                      {new Date(createdDonation.paidAt || Date.now()).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Nama Donatur:</span>
                    <div className="font-bold text-slate-800 mt-0.5 text-sm">
                      {createdDonation.isAnonymous ? 'Hamba Allah (Donatur Anonim)' : createdDonation.donorName}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Program Didukung:</span>
                    <div className="font-bold text-slate-800 mt-0.5 text-sm">
                      {createdDonation.programTitle}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Metode Pembayaran:</span>
                    <div className="font-semibold text-slate-700 mt-0.5 uppercase">
                      {createdDonation.paymentMethod.replace('_', ' ')}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Nominal Donasi Sah:</span>
                    <div className="font-extrabold text-emerald-600 mt-0.5 text-base">
                      Rp {createdDonation.amount.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                {createdDonation.donorMessage && (
                  <div className="pt-3 border-t border-slate-200 text-xs">
                    <span className="text-slate-400 font-medium">Doa &amp; Pesan Donatur:</span>
                    <p className="italic text-slate-700 mt-0.5">"{createdDonation.donorMessage}"</p>
                  </div>
                )}
              </div>

              {/* Receipt Footer Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF Kuitansi</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => onNavigate('transparansi')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-xs text-slate-800"
                  >
                    Lihat Laporan Transparansi
                  </button>

                  <button
                    onClick={() => onNavigate('beranda')}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#142D4E] hover:bg-[#1F456E] font-bold text-xs text-white"
                  >
                    Kembali ke Beranda
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* PENDING PAYMENT INSTRUCTIONS */
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      MENUNGGU PEMBAYARAN DONATUR
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#142D4E] mt-1">
                    Selesaikan Pembayaran Donasi Anda
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Order ID: <strong>{createdDonation.orderId}</strong>
                  </p>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-[11px] text-slate-400 block font-medium">Batas Waktu:</span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    24 Jam (Otomatis)
                  </span>
                </div>
              </div>

              {/* Total To Pay Highlight */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600 block">Total Nominal Yang Harus Ditransfer:</span>
                  <div className="text-2xl font-black text-[#142D4E]">
                    Rp {createdDonation.amount.toLocaleString('id-ID')}
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(createdDonation.amount.toString(), 'amount')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-teal-300 text-xs font-bold text-[#159A9C] hover:bg-teal-100 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedText === 'amount' ? 'Tersalin!' : 'Salin Nominal'}
                </button>
              </div>

              {/* SPECIFIC PAYMENT INSTRUCTION: QRIS */}
              {createdDonation.paymentMethod === 'qris' && paymentInstruction.qrisSvg && (
                <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="inline-block p-4 bg-white rounded-2xl shadow-md border border-slate-200">
                    <div dangerouslySetInnerHTML={{ __html: paymentInstruction.qrisSvg }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Scan QRIS Resmi DigitalPal</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Dapat dipindai dari BCA Mobile, GoPay, OVO, ShopeePay, Dana, LinkAja, atau m-Banking bank manapun.
                    </p>
                  </div>
                </div>
              )}

              {/* SPECIFIC PAYMENT INSTRUCTION: VIRTUAL ACCOUNT */}
              {paymentInstruction.vaNumber && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs text-slate-500 font-medium">
                    Nomor Virtual Account {paymentInstruction.bankName || 'Bank'}:
                  </span>
                  <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="font-mono text-xl sm:text-2xl font-black text-[#142D4E] tracking-wider">
                      {paymentInstruction.vaNumber}
                    </span>
                    <button
                      onClick={() => copyToClipboard(paymentInstruction.vaNumber || '', 'va')}
                      className="px-3 py-1.5 rounded-lg bg-[#142D4E] text-white text-xs font-bold hover:bg-[#1F456E] flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedText === 'va' ? 'Tersalin!' : 'Salin Nomor VA'}
                    </button>
                  </div>
                </div>
              )}

              {/* Instructions steps */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Panduan Cara Membayar:
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600">
                  {paymentInstruction.instructions.map((inst, idx) => (
                    <li key={idx} className="leading-relaxed">{inst}</li>
                  ))}
                </ol>
              </div>

              {/* Sandbox Notice & Simulation Testing Tool */}
              {paymentInstruction.sandboxMode && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    Mode Sandbox Aktif (Simulator Pembayaran)
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Sistem saat ini terhubung ke lingkungan Sandbox Midtrans untuk pengujian. Anda dapat mensimulasikan pembayaran berhasil secara instan tanpa memotong saldo rekening riil Anda:
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleSimulateSuccess}
                      disabled={isCheckingStatus}
                      className="px-4 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2 active:scale-95 transition"
                    >
                      {isCheckingStatus ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Memverifikasi...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Simulasi Pembayaran Berhasil (Uji Coba Sandbox)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Live polling indicator */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#159A9C]" />
                  Mengecek status pembayaran secara otomatis...
                </span>
                <button
                  onClick={() => onNavigate('beranda')}
                  className="font-medium text-slate-500 hover:text-slate-800"
                >
                  Selesaikan Nanti
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
