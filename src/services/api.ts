import { DonationProgram, Donation, PublicDonor, PaymentInstruction, TransparencyReport, KarhutlaDataset } from '../types';

export const api = {
  // Programs
  async getPrograms(): Promise<DonationProgram[]> {
    const res = await fetch('/api/programs');
    if (!res.ok) throw new Error('Gagal mengambil data program');
    return res.json();
  },

  async getProgramById(id: string): Promise<DonationProgram> {
    const res = await fetch(`/api/programs/${id}`);
    if (!res.ok) throw new Error('Gagal mengambil data program');
    return res.json();
  },

  // Donations & Payments
  async createDonation(payload: {
    programId: string;
    amount: number;
    donorName: string;
    donorEmail: string;
    donorPhone?: string;
    donorMessage?: string;
    isAnonymous: boolean;
    paymentMethod: string;
  }): Promise<{ donation: Donation; paymentInstruction: PaymentInstruction }> {
    const res = await fetch('/api/donations/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal membuat donasi');
    return data;
  },

  async getDonationReceipt(orderId: string): Promise<Donation> {
    const res = await fetch(`/api/donations/order/${orderId}`);
    if (!res.ok) throw new Error('Data kuitansi donasi tidak ditemukan');
    return res.json();
  },

  async checkPaymentStatus(orderId: string): Promise<{ orderId: string; status: string; amount: number; paidAt?: string }> {
    const res = await fetch(`/api/payments/status/${orderId}`);
    if (!res.ok) throw new Error('Gagal memeriksa status pembayaran');
    return res.json();
  },

  async simulatePayment(orderId: string, targetStatus: 'PAID' | 'EXPIRED' | 'FAILED' = 'PAID'): Promise<any> {
    const res = await fetch('/api/payments/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, targetStatus })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal melakukan simulasi');
    return data;
  },

  async getPublicDonors(): Promise<PublicDonor[]> {
    const res = await fetch('/api/donations/public');
    if (!res.ok) throw new Error('Gagal mengambil daftar donatur');
    return res.json();
  },

  // Dataset
  async getKarhutlaDataset(): Promise<KarhutlaDataset> {
    const res = await fetch('/api/dataset');
    if (!res.ok) throw new Error('Gagal mengambil dataset karhutla');
    return res.json();
  },

  async importDataset(datasetJson: any): Promise<any> {
    const res = await fetch('/api/dataset/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datasetJson)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengimpor dataset');
    return data;
  },

  // Transparency
  async getTransparencyReport(): Promise<TransparencyReport> {
    const res = await fetch('/api/transparency');
    if (!res.ok) throw new Error('Gagal mengambil laporan transparansi');
    return res.json();
  },

  // Admin
  async adminLogin(pin: string): Promise<any> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login gagal');
    return data;
  },

  async getAdminStats(): Promise<any> {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('Gagal mengambil data admin');
    return res.json();
  },

  async saveProgram(program: Partial<DonationProgram>): Promise<any> {
    const res = await fetch('/api/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(program)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menyimpan program');
    return data;
  },

  async saveExpense(expense: any): Promise<any> {
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mencatat pengeluaran');
    return data;
  },

  async saveDistribution(distribution: any): Promise<any> {
    const res = await fetch('/api/distributions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(distribution)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mencatat penyaluran');
    return data;
  },

  async updateConfig(config: any): Promise<any> {
    const res = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menyimpan konfigurasi');
    return data;
  },

  async runTestSuite(): Promise<any> {
    const res = await fetch('/api/admin/run-test-suite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menjalankan test suite');
    return data;
  },

  // Gemini AI Assistant
  async sendGeminiChat(messages: Array<{ role: 'user' | 'model'; text: string }>, modelPreference = 'gemini-3.8-flash', useSearch = true): Promise<{ text: string; sources: Array<{ uri: string; title: string }> }> {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, modelPreference, useSearch })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memproses AI chat');
    return data;
  }
};
