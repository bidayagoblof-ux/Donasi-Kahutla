import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck, Heart, Users, Flame, CheckCircle2, MessageSquare } from 'lucide-react';

export const AboutAndContactPage: React.FC = () => {
  const [sentMessage, setSentMessage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Pertanyaan Program Donasi',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSentMessage(true);
    setTimeout(() => {
      setSentMessage(false);
      setFormData({ name: '', email: '', phone: '', subject: 'Pertanyaan Program Donasi', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* 1. TENTANG DIGITALPAL */}
      <section className="space-y-6">
        <div className="max-w-3xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
            TENTANG LEMBAGA KEMANUSIAAN
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] tracking-tight mt-2">
            DigitalPal – Sahabat Digital untuk Kemanusiaan
          </h1>
          <p className="text-base text-slate-600 mt-2 font-medium">
            "Bersama Pulihkan Harapan, Bantu Masyarakat Terdampak Karhutla."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              DigitalPal didirikan dengan visi memanfaatkan inovasi teknologi digital untuk mempercepat bantuan kemanusiaan, menjamin 100% transparansi akuntansi publik, dan menghubungkan para dermawan dengan masyarakat yang paling membutuhkan di pelosok negeri.
            </p>
            <p>
              Dalam krisis Karhutla 2026, DigitalPal berfokus langsung pada aksi darurat: menyuplai air bersih untuk membasahi tanah gambut, mendistribusikan ribuan masker respirator standar N95, menyediakan tabung oksigen medis dan nebulizer bagi pasien ISPA, serta meringankan beban ekonomi keluarga prasejahtera dan tim relawan pemadam kebakaran di garis depan.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Transparansi Real-Time</h4>
                  <p className="text-[11px] text-slate-500">Seluruh penerimaan dan belanja dipublikasikan terbuka.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Kemitraan Posko Lapangan</h4>
                  <p className="text-[11px] text-slate-500">Bekerja sama erat dengan MPA, BPBD, dan Puskesmas.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#159A9C] flex items-center justify-center">
              <Flame className="w-6 h-6 text-[#F0A43A]" />
            </div>
            <h3 className="text-xl font-bold text-white">4 Pilar Nilai Aksi Kemanusiaan Kami</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block text-sm mb-0.5">1. Transparansi Tanpa Kompromi</strong>
                Data transaksi terhubung langsung dengan payment gateway dan sistem audit terbuka.
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block text-sm mb-0.5">2. Berbasis Data Faktual</strong>
                Tidak melebih-lebihkan angka, menghormati fakta pengamatan resmi BNPB dan Kemenkes.
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block text-sm mb-0.5">3. Perlindungan Martabat Warga</strong>
                Menjaga etika dan privasi keluarga serta anak-anak penerima manfaat di desa-desa sasaran.
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block text-sm mb-0.5">4. Kemudahan Akses Donasi</strong>
                Metode QRIS instan dan Virtual Account bank nasional tanpa biaya tambahan bagi donatur.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KONTAK & POSKO RESMI */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Posko Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#159A9C] uppercase tracking-wider">Layanan Informasi</span>
              <h2 className="text-2xl font-extrabold text-[#142D4E] mt-1">Hubungi Posko DigitalPal</h2>
              <p className="text-xs text-slate-500 mt-1">
                Kanal komunikasi resmi untuk donatur, relawan lapangan, atau koordinasi bantuan bencana.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold text-sm">Posko Lapangan Kalimantan Tengah:</strong>
                  <span className="text-slate-600">
                    Jl. RTA Milono Km. 4.5, Kelurahan Langkai, Kec. Pahandut, Kota Palangka Raya, Kalimantan Tengah 73111
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold text-sm">Sekretariat Pusat DigitalPal:</strong>
                  <span className="text-slate-600">
                    Gedung Sahabat Digital Lt. 3, Jl. Tebet Barat Dalam Raya No. 18, Jakarta Selatan 12810
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Phone className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold text-sm">Hotline Darurat &amp; WhatsApp:</strong>
                  <span className="text-slate-600">+62 821-2026-0800 (Siaga Relawan Lapangan)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Mail className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-bold text-sm">Email Resmi:</strong>
                  <span className="text-slate-600">peduli@digitalpal.id / sekretariat@digitalpal.id</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-lg text-slate-900 mb-1">Kirim Pesan atau Pertanyaan</h3>
            <p className="text-xs text-slate-500 mb-6">
              Tim relawan kami akan merespons pesan Anda dalam waktu maksimal 1x24 jam.
            </p>

            {sentMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pesan Anda berhasil dikirimkan ke Sekretariat DigitalPal. Terima kasih atas kepedulian Anda.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#159A9C]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alamat Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#159A9C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#159A9C]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Perihal Pesan</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#159A9C]"
                  >
                    <option value="Pertanyaan Program Donasi">Pertanyaan Program Donasi</option>
                    <option value="Konfirmasi Pembayaran">Konfirmasi Pembayaran</option>
                    <option value="Pendaftaran Relawan Lapangan">Pendaftaran Relawan Lapangan</option>
                    <option value="Aduan Wilayah Butuh Bantuan">Aduan Wilayah Butuh Bantuan</option>
                    <option value="Kerja Sama Lembaga / Korporat">Kerja Sama Lembaga / Korporat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Isi Pesan *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tuliskan pesan atau pertanyaan Anda secara rinci..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#159A9C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#142D4E] hover:bg-[#1F456E] text-white flex items-center justify-center gap-2 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirimkan Pesan Sekarang</span>
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
};
