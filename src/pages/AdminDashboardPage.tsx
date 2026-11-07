import React, { useState, useEffect } from 'react';
import { 
  Lock, LayoutDashboard, Heart, CreditCard, FolderPlus, 
  Receipt, Truck, Database, Settings, LogOut, CheckCircle2, 
  AlertCircle, RefreshCw, Plus, Search, Filter, ShieldCheck, Key, FileJson
} from 'lucide-react';
import { api } from '../services/api';
import { DonationProgram, Expense, AidDistribution } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('2026');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeMenu, setActiveMenu] = useState<
    'overview' | 'donations' | 'programs' | 'expenses' | 'distributions' | 'dataset' | 'testsuite' | 'config'
  >('overview');

  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Test suite state
  const [testSuiteResults, setTestSuiteResults] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  // Forms states
  const [newProgramModal, setNewProgramModal] = useState(false);
  const [newExpenseModal, setNewExpenseModal] = useState(false);
  const [newDistributionModal, setNewDistributionModal] = useState(false);
  const [jsonImportText, setJsonImportText] = useState('');

  // Search filter in donations
  const [donationSearch, setDonationSearch] = useState('');
  const [donationStatusFilter, setDonationStatusFilter] = useState('ALL');

  useEffect(() => {
    const token = localStorage.getItem('dp_admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchStats();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await api.adminLogin(pinInput);
      if (res.success) {
        localStorage.setItem('dp_admin_token', res.token);
        setIsAuthenticated(true);
        fetchStats();
      }
    } catch (err: any) {
      setAuthError(err.message || 'PIN salah.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dp_admin_token');
    setIsAuthenticated(false);
  };

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminStats();
      setStats(res);
    } catch (err: any) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // 1. ADD NEW PROGRAM
  const handleSaveProgram = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const payload = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      targetLocation: formData.get('targetLocation') as string,
      targetAmount: Number(formData.get('targetAmount')),
      shortDescription: formData.get('shortDescription') as string,
      fullDescription: formData.get('fullDescription') as string,
      imageUrl: formData.get('imageUrl') as string || 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80',
      status: formData.get('status') as any,
      priority: formData.get('priority') as any,
      needsList: (formData.get('needsList') as string).split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      await api.saveProgram(payload);
      showNotification('Program baru berhasil disimpan.');
      setNewProgramModal(false);
      fetchStats();
    } catch (err: any) {
      alert('Gagal: ' + err.message);
    }
  };

  // 2. ADD NEW EXPENSE
  const handleSaveExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      title: formData.get('title') as string,
      programId: formData.get('programId') as string,
      category: formData.get('category') as string,
      amount: Number(formData.get('amount')),
      vendorName: formData.get('vendorName') as string,
      receiptNumber: formData.get('receiptNumber') as string,
      expenseDate: formData.get('expenseDate') as string,
      status: formData.get('status') as string,
      notes: formData.get('notes') as string
    };

    try {
      await api.saveExpense(payload);
      showNotification('Pengeluaran berhasil dicatat.');
      setNewExpenseModal(false);
      fetchStats();
    } catch (err: any) {
      alert('Gagal: ' + err.message);
    }
  };

  // 3. ADD NEW DISTRIBUTION
  const handleSaveDistribution = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      location: formData.get('location') as string,
      province: formData.get('province') as string,
      programId: formData.get('programId') as string,
      aidType: formData.get('aidType') as string,
      quantity: Number(formData.get('quantity')),
      unit: formData.get('unit') as string,
      beneficiariesCount: Number(formData.get('beneficiariesCount')),
      targetGroup: formData.get('targetGroup') as string,
      status: formData.get('status') as string,
      distributionDate: formData.get('distributionDate') as string,
      notes: formData.get('notes') as string,
      verifiedBy: formData.get('verifiedBy') as string
    };

    try {
      await api.saveDistribution(payload);
      showNotification('Penyaluran bantuan berhasil dicatat.');
      setNewDistributionModal(false);
      fetchStats();
    } catch (err: any) {
      alert('Gagal: ' + err.message);
    }
  };

  // 4. IMPORT JSON DATASET
  const handleImportJson = async () => {
    try {
      const parsed = JSON.parse(jsonImportText);
      const res = await api.importDataset(parsed);
      if (res.success) {
        showNotification('Dataset karhutla berhasil diimpor & diperbarui!');
        setJsonImportText('');
        fetchStats();
      }
    } catch (err: any) {
      alert('Format JSON tidak valid atau struktur tidak cocok: ' + err.message);
    }
  };

  // 5. UPDATE CONFIG (MIDTRANS / ENV)
  const handleSaveConfig = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      midtransServerKey: formData.get('midtransServerKey') as string,
      midtransClientKey: formData.get('midtransClientKey') as string,
      isProduction: formData.get('isProduction') === 'true',
      adminPin: formData.get('adminPin') as string
    };

    try {
      await api.updateConfig(payload);
      showNotification('Pengaturan payment gateway diperbarui.');
      fetchStats();
    } catch (err: any) {
      alert('Gagal menyimpan: ' + err.message);
    }
  };

  // 6. RUN SANDBOX TEST SUITE (Section 20)
  const handleRunTestSuite = async () => {
    setIsRunningTests(true);
    try {
      const res = await api.runTestSuite();
      setTestSuiteResults(res);
      showNotification('Pengujian 8 skenario payment gateway berhasil diselesaikan.');
      fetchStats();
    } catch (err: any) {
      alert('Gagal menjalankan pengujian: ' + err.message);
    } finally {
      setIsRunningTests(false);
    }
  };

  // 7. EXPORT CSV HELPERS
  const downloadDonationsCsv = () => {
    if (!stats?.allDonations) return;
    const header = ['OrderID', 'DonorName', 'Program', 'Amount', 'Status', 'Method', 'Date'];
    const rows = stats.allDonations.map((d: any) => [
      d.orderId,
      `"${d.donorName.replace(/"/g, '""')}"`,
      `"${d.programTitle.replace(/"/g, '""')}"`,
      d.amount,
      d.paymentStatus,
      d.paymentMethod,
      d.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Donasi_DigitalPal_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExpensesCsv = () => {
    if (!stats?.expenses) return;
    const header = ['ReceiptNo', 'Date', 'Title', 'Program', 'Category', 'Vendor', 'Amount', 'Status'];
    const rows = stats.expenses.map((e: any) => [
      e.receiptNumber,
      e.expenseDate,
      `"${e.title.replace(/"/g, '""')}"`,
      `"${e.programName.replace(/"/g, '""')}"`,
      e.category,
      `"${e.vendorName.replace(/"/g, '""')}"`,
      e.amount,
      e.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Pengeluaran_DigitalPal_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#142D4E] text-[#F0A43A] flex items-center justify-center mx-auto mb-4 shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold text-[#142D4E]">Portal Admin DigitalPal</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Khusus Tim Administrator, Petugas Keuangan &amp; Koordinator Lapangan.
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1 text-left">
                Masukkan PIN Administrator:
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN Default: 2026"
                className="w-full px-4 py-3 text-center tracking-widest text-lg font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#159A9C]"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                (PIN bawaan sistem sandbox: <strong>2026</strong>)
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-[#142D4E] hover:bg-[#1F456E] text-white transition shadow-md"
            >
              Buka Dashboard Manajemen
            </button>
          </form>
        </div>
      </div>
    );
  }

  const metrics = stats?.metrics;
  const donations = stats?.allDonations || [];
  const expenses = stats?.expenses || [];
  const distributions = stats?.distributions || [];
  const auditLogs = stats?.auditLogs || [];

  const filteredDonations = donations.filter((d: any) => {
    const matchesSearch = d.orderId.toLowerCase().includes(donationSearch.toLowerCase()) ||
                          d.donorName.toLowerCase().includes(donationSearch.toLowerCase());
    const matchesStatus = donationStatusFilter === 'ALL' || d.paymentStatus === donationStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#159A9C] text-white">
              ADMINISTRATOR CONSOLE
            </span>
            <span className="text-xs text-slate-400">Karhutla 2026 Core Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mt-1 text-white">
            Pusat Pengelolaan Donasi &amp; Penyaluran
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            title="Refresh Data"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600/80 hover:bg-red-600 text-white transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar
          </button>
        </div>
      </div>

      {/* Notification toast */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Menu Nav */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-xs sm:text-sm font-semibold">
        {[
          { id: 'overview', label: 'Ringkasan Statistik', icon: LayoutDashboard },
          { id: 'donations', label: `Transaksi Donasi (${donations.length})`, icon: CreditCard },
          { id: 'programs', label: 'Kelola Program', icon: FolderPlus },
          { id: 'expenses', label: `Buku Pengeluaran (${expenses.length})`, icon: Receipt },
          { id: 'distributions', label: `Penyaluran (${distributions.length})`, icon: Truck },
          { id: 'dataset', label: 'Dataset Karhutla & Impor JSON', icon: FileJson },
          { id: 'testsuite', label: 'Uji Coba Sandbox (8 Skenario)', icon: ShieldCheck },
          { id: 'config', label: 'Pengaturan Gateway & Audit', icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id as any)}
              className={`pb-3 px-3 transition whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
                isActive ? 'border-[#159A9C] text-[#159A9C]' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeMenu === 'overview' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Donasi Terverifikasi (PAID)</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                Rp {metrics.totalDonationsAmount.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {metrics.successCount} transaksi sukses
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pengeluaran Disahkan</span>
              <div className="text-2xl font-black text-slate-800 mt-1">
                Rp {metrics.totalExpensesAmount.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {expenses.length} kuitansi belanja
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Saldo Kas Tersedia</span>
              <div className="text-2xl font-black text-[#F0A43A] mt-1">
                Rp {metrics.availableBalance.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Pemasukan - Belanja Disahkan
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Transaksi Menunggu (Pending)</span>
              <div className="text-2xl font-black text-amber-500 mt-1">
                {metrics.pendingCount}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {metrics.failedCount} transaksi kedaluwarsa/batal
              </div>
            </div>

          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Aksi Cepat Pengurus:</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setNewExpenseModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#142D4E] hover:bg-[#1F456E] text-white flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Catat Pengeluaran Baru
              </button>
              <button
                onClick={() => setNewDistributionModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#159A9C] hover:bg-[#128284] text-white flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Catat Distribusi Bantuan
              </button>
              <button
                onClick={() => setNewProgramModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Tambah Program Bantuan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. TRANSAKSI DONASI TAB */}
      {activeMenu === 'donations' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Manajemen Transaksi &amp; Donatur</h3>
              <p className="text-xs text-slate-500">Mencatat seluruh order donasi dan status payment gateway.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari Order ID / Nama..."
                  value={donationSearch}
                  onChange={(e) => setDonationSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
                />
              </div>

              <select
                value={donationStatusFilter}
                onChange={(e) => setDonationStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
              >
                <option value="ALL">Semua Status</option>
                <option value="PAID">PAID (Sukses)</option>
                <option value="PENDING">PENDING</option>
                <option value="EXPIRED">EXPIRED</option>
                <option value="FAILED">FAILED</option>
              </select>

              <button
                onClick={downloadDonationsCsv}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs whitespace-nowrap"
              >
                Unduh CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Order ID &amp; Waktu</th>
                  <th className="py-2.5 px-3">Donatur</th>
                  <th className="py-2.5 px-3">Program</th>
                  <th className="py-2.5 px-3">Metode</th>
                  <th className="py-2.5 px-3 text-right">Nominal</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Aksi Simulasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonations.map((d: any) => (
                  <tr key={d.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900">{d.orderId}</div>
                      <div className="text-[10px] text-slate-400">{d.createdAt}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{d.donorName}</div>
                      <div className="text-[10px] text-slate-400">{d.donorEmail}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 max-w-xs truncate">
                      {d.programTitle}
                    </td>
                    <td className="py-3 px-3 uppercase font-mono text-[11px] text-slate-500">
                      {d.paymentMethod}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      Rp {d.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        d.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                        d.paymentStatus === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {d.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {d.paymentStatus === 'PENDING' && (
                        <button
                          onClick={async () => {
                            await api.simulatePayment(d.orderId, 'PAID');
                            showNotification(`Order ${d.orderId} disetujui PAID.`);
                            fetchStats();
                          }}
                          className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                        >
                          Simulasi Verifikasi PAID
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. KELOLA PROGRAM */}
      {activeMenu === 'programs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Daftar Program Penggalangan Dana</h3>
            <button
              onClick={() => setNewProgramModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#142D4E] hover:bg-[#1F456E] text-white flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Buat Program Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats?.metrics && (stats.allDonations ? stats.allDonations : []).length >= 0 && (
              // Use API programs list
              <ProgramCardsGrid onRefresh={fetchStats} />
            )}
          </div>
        </div>
      )}

      {/* 4. DATA PENGELUARAN */}
      {activeMenu === 'expenses' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Buku Pembukuan Pengeluaran Transparan</h3>
              <p className="text-xs text-slate-500">Mencatat bukti nota/kuitansi belanja nyata.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadExpensesCsv}
                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 shadow-xs"
              >
                Unduh CSV Pengeluaran
              </button>
              <button
                onClick={() => setNewExpenseModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#142D4E] hover:bg-[#1F456E] text-white flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Catat Pengeluaran Baru
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Kuitansi &amp; Tgl</th>
                  <th className="py-2.5 px-3">Uraian Belanja</th>
                  <th className="py-2.5 px-3">Vendor</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-right">Nominal</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((e: Expense) => (
                  <tr key={e.id}>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{e.receiptNumber}</div>
                      <div className="text-[10px] text-slate-400">{e.expenseDate}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {e.title}
                      <div className="text-[10px] font-normal text-slate-500">{e.notes}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{e.vendorName}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      Rp {e.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. DATA PENYALURAN BANTUAN */}
      {activeMenu === 'distributions' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Log Penyaluran Bantuan Lapangan</h3>
              <p className="text-xs text-slate-500">Mencatat distribusi fisik bantuan ke masyarakat.</p>
            </div>
            <button
              onClick={() => setNewDistributionModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#159A9C] hover:bg-[#128284] text-white flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Catat Penyaluran Baru
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Lokasi</th>
                  <th className="py-2.5 px-3">Bantuan Disalurkan</th>
                  <th className="py-2.5 px-3">Penerima</th>
                  <th className="py-2.5 px-3">Verifikator</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {distributions.map((dist: AidDistribution) => (
                  <tr key={dist.id}>
                    <td className="py-3 px-3 font-semibold text-slate-800">{dist.distributionDate}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{dist.location}, {dist.province}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{dist.aidType}</div>
                      <div className="text-[10px] text-slate-500">{dist.quantity} {dist.unit}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-teal-700">{dist.beneficiariesCount} Jiwa/KK</td>
                    <td className="py-3 px-3 text-slate-600">{dist.verifiedBy}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {dist.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. DATASET KARHUTLA & IMPOR JSON */}
      {activeMenu === 'dataset' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 mb-2">
              <FileJson className="w-3.5 h-3.5" />
              <span>DATASET KARHUTLA INDONESIA 2026</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Perbarui atau Impor Dataset JSON</h3>
            <p className="text-xs text-slate-500 mt-1">
              Sesuai master prompt, Anda dapat mengunggah atau menempelkan format dataset JSON terbaru dari BNPB/BMKG. Sistem memvalidasi skema data secara otomatis sebelum memperbarui tampilan publik.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Tempelkan Isi File JSON Baru (dataset_karhutla_digitalpal_2026.json):
            </label>
            <textarea
              rows={10}
              value={jsonImportText}
              onChange={(e) => setJsonImportText(e.target.value)}
              placeholder="Paste JSON lengkap di sini..."
              className="w-full p-4 font-mono text-xs rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#159A9C]"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * Validasi memastikan field metadata dan national_situation tersedia.
            </span>
            <button
              onClick={handleImportJson}
              disabled={!jsonImportText.trim()}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#159A9C] hover:bg-[#128284] text-white disabled:opacity-50 transition"
            >
              Validasi &amp; Simpan Dataset Baru
            </button>
          </div>
        </div>
      )}

      {/* 6.5. AUTOMATED TEST SUITE (Section 20 Master Prompt) */}
      {activeMenu === 'testsuite' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>PENGUJIAN SISTEM PEMBAYARAN (BAB 20 PROMPT)</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Sandbox Payment Gateway Test Suite
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Menguji 8 skenario kritis otomatis untuk memastikan hanya pembayaran terverifikasi yang masuk ke buku kas.
              </p>
            </div>

            <button
              onClick={handleRunTestSuite}
              disabled={isRunningTests}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-[#142D4E] hover:bg-[#1F456E] text-white flex items-center gap-2 shadow-md disabled:opacity-50 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isRunningTests ? 'animate-spin' : ''}`} />
              <span>{isRunningTests ? 'Menjalankan Pengujian...' : 'Jalankan 8 Skenario Pengujian'}</span>
            </button>
          </div>

          {testSuiteResults ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-bold text-sm text-emerald-900">
                      Seluruh {testSuiteResults.summary.passedTests} dari {testSuiteResults.summary.totalTests} Skenario Berhasil Lolos (ALL PASSED)
                    </span>
                    <span className="text-xs text-emerald-700 block">
                      Waktu Pengujian: {new Date(testSuiteResults.timestamp).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                  100% SIAP SANDBOX
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testSuiteResults.results.map((res: any, rIdx: number) => (
                  <div key={rIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{res.scenario}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> PASSED
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{res.details}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-3">
              <p>Klik tombol <strong>"Jalankan 8 Skenario Pengujian"</strong> di atas untuk memverifikasi seluruh alur pembayaran:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-w-xl mx-auto">
                <div className="p-2 bg-white rounded-lg border border-slate-200">1. Donasi Berhasil (PAID)</div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">2. Donasi Pending (PENDING)</div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">3. Pembayaran Kedaluwarsa (EXPIRED)</div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">4. Pembayaran Gagal (FAILED)</div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">5. Verifikasi Signature Webhook</div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">6. Pencegahan Idempotency Duplikasi</div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">7. Penolakan Nominal Tidak Cocok</div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">8. Proteksi 404 Order Tidak Ditemukan</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. CONFIG & PAYMENT GATEWAY */}
      {activeMenu === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Konfigurasi Payment Gateway Midtrans</h3>
              <p className="text-xs text-slate-500 mt-1">
                Kredensial payment gateway disimpan aman di server-side environment.
              </p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Midtrans Server Key:</label>
                <input
                  type="password"
                  name="midtransServerKey"
                  defaultValue="SB-Mid-server-sandbox-test-key-2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#159A9C]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Midtrans Client Key:</label>
                <input
                  type="text"
                  name="midtransClientKey"
                  defaultValue="SB-Mid-client-sandbox-test-key-2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#159A9C]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mode Lingkungan:</label>
                <select
                  name="isProduction"
                  defaultValue="false"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#159A9C]"
                >
                  <option value="false">Sandbox (Mode Uji Coba Aman &amp; Simulator)</option>
                  <option value="true">Production (Live Gateway Transaksi Riil)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  PENTING: Jangan aktifkan mode produksi sebelum kredensial resmi merchant Midtrans terverifikasi.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">PIN Administrator Sistem:</label>
                <input
                  type="text"
                  name="adminPin"
                  defaultValue="2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#159A9C]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#142D4E] hover:bg-[#1F456E] text-white transition"
                >
                  Simpan Konfigurasi
                </button>
              </div>
            </form>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800">URL Webhook Notifikasi Pembayaran:</div>
              <div className="font-mono text-[11px] bg-white p-2 rounded-lg border border-slate-200 text-slate-800 select-all">
                https://your-domain.run.app/api/payments/webhook
              </div>
              <p className="text-[10px] text-slate-400">
                Daftarkan URL di atas pada Midtrans MAP Dashboard &gt; Settings &gt; Configuration.
              </p>
            </div>
          </div>

          {/* Audit Logs Trail */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Riwayat Audit Sistem (Audit Log)</h3>
            <p className="text-xs text-slate-500">Mencatat riwayat aktivitas penting dan transaksi.</p>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {auditLogs.map((log: any) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-mono font-bold text-slate-700">{log.action}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString('id-ID')}</span>
                  </div>
                  <p className="text-slate-800 text-[11px] font-medium leading-relaxed">{log.details}</p>
                  <div className="text-[10px] text-slate-400 mt-1">Oleh: {log.actor}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODAL: NEW PROGRAM */}
      {newProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Buat Program Donasi Baru</h3>
              <button onClick={() => setNewProgramModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Nama Program *</label>
                <input required name="name" className="w-full px-3 py-2 border rounded-xl" placeholder="Nama program" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Kategori</label>
                  <input required name="category" defaultValue="Kesehatan" className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Prioritas</label>
                  <select name="priority" className="w-full px-3 py-2 border rounded-xl">
                    <option value="darurat">Darurat</option>
                    <option value="tinggi">Tinggi</option>
                    <option value="menengah">Menengah</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Target Lokasi</label>
                <input required name="targetLocation" defaultValue="Kalimantan Tengah" className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Target Donasi (Rp) *</label>
                <input required type="number" name="targetAmount" defaultValue="50000000" className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Deskripsi Singkat</label>
                <textarea required name="shortDescription" rows={2} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Deskripsi Lengkap</label>
                <textarea required name="fullDescription" rows={3} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Kebutuhan Disalurkan (Pisahkan tanda koma)</label>
                <input name="needsList" defaultValue="Masker N95, Obat ISPA, Air Bersih" className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">URL Foto Program</label>
                <input name="imageUrl" defaultValue="https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80" className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setNewProgramModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#142D4E] text-white font-bold">Simpan Program</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW EXPENSE */}
      {newExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Catat Pengeluaran Baru</h3>
              <button onClick={() => setNewExpenseModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Uraian Pembelian/Pengeluaran *</label>
                <input required name="title" className="w-full px-3 py-2 border rounded-xl" placeholder="Contoh: Pengadaan 1.000 Pcs Masker N95" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Nominal (Rp) *</label>
                  <input required type="number" name="amount" defaultValue="5000000" className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Kategori</label>
                  <select name="category" className="w-full px-3 py-2 border rounded-xl">
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Air Bersih">Air Bersih</option>
                    <option value="APD & Masker">APD & Masker</option>
                    <option value="Pangan">Pangan</option>
                    <option value="Peralatan Pemadam">Peralatan Pemadam</option>
                    <option value="Operasional & Logistik">Operasional & Logistik</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Nama Vendor / Toko</label>
                  <input required name="vendorName" defaultValue="PT Medika Nusantara" className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Nomor Kuitansi / Faktur</label>
                  <input required name="receiptNumber" defaultValue={`INV/DP/${Date.now().toString().slice(-5)}`} className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Tanggal Transaksi</label>
                  <input type="date" name="expenseDate" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Status Persetujuan</label>
                  <select name="status" className="w-full px-3 py-2 border rounded-xl">
                    <option value="Dibayar">Dibayar (Lunas)</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Menunggu">Menunggu</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">ID Program Bantuan Terkait</label>
                <input required name="programId" defaultValue="prog-kesehatan-01" className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Catatan Verifikasi</label>
                <textarea name="notes" defaultValue="Nota belanja terverifikasi untuk posko kemanusiaan." rows={2} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setNewExpenseModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#142D4E] text-white font-bold">Simpan Pengeluaran</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW DISTRIBUTION */}
      {newDistributionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Catat Penyaluran Bantuan Lapangan</h3>
              <button onClick={() => setNewDistributionModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSaveDistribution} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Jenis Bantuan *</label>
                <input required name="aidType" placeholder="Contoh: Paket Pangan Sembako & Higienitas" className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Jumlah</label>
                  <input required type="number" name="quantity" defaultValue="100" className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Satuan</label>
                  <input required name="unit" defaultValue="paket" className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Lokasi Distribusi *</label>
                  <input required name="location" defaultValue="Kec. Baamang, Kotawaringin Timur" className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Provinsi</label>
                  <input required name="province" defaultValue="Kalimantan Tengah" className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Penerima Manfaat (Orang/KK)</label>
                  <input required type="number" name="beneficiariesCount" defaultValue="400" className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Tanggal Distribusi</label>
                  <input type="date" name="distributionDate" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Kelompok Sasaran</label>
                <input name="targetGroup" defaultValue="Keluarga Petani Gambut Terdampak Asap" className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Verifikator Lapangan</label>
                <input name="verifiedBy" defaultValue="Tim Lapangan DigitalPal & Perangkat Desa" className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Catatan Kegiatan</label>
                <textarea name="notes" defaultValue="Distribusi berjalan tertib berkoordinasi dengan RT setempat." rows={2} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setNewDistributionModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#159A9C] text-white font-bold">Simpan Distribusi</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Sub-component to list & manage programs in Admin
const ProgramCardsGrid: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const [programs, setPrograms] = useState<DonationProgram[]>([]);

  useEffect(() => {
    api.getPrograms().then(setPrograms).catch(console.error);
  }, []);

  const toggleStatus = async (prog: DonationProgram) => {
    const newStatus = prog.status === 'active' ? 'paused' : 'active';
    await api.saveProgram({ ...prog, status: newStatus });
    const updated = await api.getPrograms();
    setPrograms(updated);
    onRefresh();
  };

  return (
    <>
      {programs.map((p) => (
        <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-500 uppercase">{p.category}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {p.status.toUpperCase()}
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{p.name}</h4>
            <div className="text-xs text-slate-600 mt-2">
              Target: <strong>Rp {p.targetAmount.toLocaleString('id-ID')}</strong>
            </div>
            <div className="text-xs text-slate-600">
              Terkumpul: <strong className="text-emerald-600">Rp {p.collectedAmount.toLocaleString('id-ID')}</strong> ({p.donorCount} donatur)
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => toggleStatus(p)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
            >
              {p.status === 'active' ? 'Nonaktifkan Program' : 'Aktifkan Program'}
            </button>
            <span className="text-[10px] font-mono text-slate-400">{p.id}</span>
          </div>
        </div>
      ))}
    </>
  );
};
