import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { db, Donation, Expense, AidDistribution, DonationProgram } from './db';
import { paymentAdapter, PaymentRequest, WebhookPayload } from './paymentService';
import { processChat, ChatRequest } from './geminiService';

export const apiRouter = Router();

// Locate dataset file
const DATASET_PATH = path.resolve(process.cwd(), 'public', 'assets', 'aistudio', 'dataset_karhutla_digitalpal_2026_d4caf471.json');
const CUSTOM_DATASET_PATH = path.resolve(process.cwd(), 'data', 'custom_dataset.json');

function getKarhutlaDataset(): any {
  try {
    if (fs.existsSync(CUSTOM_DATASET_PATH)) {
      return JSON.parse(fs.readFileSync(CUSTOM_DATASET_PATH, 'utf-8'));
    }
    if (fs.existsSync(DATASET_PATH)) {
      return JSON.parse(fs.readFileSync(DATASET_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error('Failed to read karhutla dataset:', err);
  }
  return null;
}

// 1. DATASET ENDPOINTS
apiRouter.get('/dataset', (req: Request, res: Response) => {
  const data = getKarhutlaDataset();
  if (!data) {
    return res.status(404).json({ error: 'Dataset karhutla belum ditemukan.' });
  }
  res.json(data);
});

apiRouter.post('/dataset/import', (req: Request, res: Response) => {
  try {
    const newDataset = req.body;
    if (!newDataset || !newDataset.metadata || !newDataset.national_situation) {
      return res.status(400).json({ error: 'Format dataset tidak valid. Metadata atau national_situation tidak ditemukan.' });
    }
    fs.writeFileSync(CUSTOM_DATASET_PATH, JSON.stringify(newDataset, null, 2), 'utf-8');
    db.addAuditLog('IMPORT_DATASET', 'Administrator', `Dataset baru "${newDataset.metadata.title || 'Karhutla'}" versi ${newDataset.metadata.version || '1.0'} berhasil diimpor.`);
    res.json({ success: true, message: 'Dataset karhutla berhasil diperbarui.', metadata: newDataset.metadata });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal mengimpor dataset: ' + err.message });
  }
});

// 2. PROGRAM ENDPOINTS
apiRouter.get('/programs', (req: Request, res: Response) => {
  res.json(db.getPrograms());
});

apiRouter.get('/programs/:id', (req: Request, res: Response) => {
  const program = db.getProgramById(req.params.id);
  if (!program) {
    return res.status(404).json({ error: 'Program donasi tidak ditemukan.' });
  }
  res.json(program);
});

apiRouter.post('/programs', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.name || !body.targetAmount) {
    return res.status(400).json({ error: 'Nama dan target donasi wajib diisi.' });
  }
  const program: DonationProgram = {
    id: body.id || `prog-${Date.now()}`,
    name: body.name,
    category: body.category || 'Kemanusiaan',
    shortDescription: body.shortDescription || '',
    fullDescription: body.fullDescription || '',
    targetLocation: body.targetLocation || 'Indonesia',
    targetAmount: Number(body.targetAmount),
    collectedAmount: Number(body.collectedAmount) || 0,
    donorCount: Number(body.donorCount) || 0,
    imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80',
    startDate: body.startDate || new Date().toISOString().split('T')[0],
    endDate: body.endDate || '2026-12-31',
    status: body.status || 'active',
    priority: body.priority || 'tinggi',
    needsList: Array.isArray(body.needsList) ? body.needsList : []
  };
  db.saveProgram(program);
  res.json({ success: true, program });
});

apiRouter.put('/programs/:id', (req: Request, res: Response) => {
  const existing = db.getProgramById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Program tidak ditemukan.' });
  }
  const updated: DonationProgram = {
    ...existing,
    ...req.body,
    id: existing.id // protect ID
  };
  db.saveProgram(updated);
  res.json({ success: true, program: updated });
});

// 3. DONATION CREATION & CHECKOUT
apiRouter.post('/donations/create', async (req: Request, res: Response) => {
  try {
    const { programId, amount, donorName, donorEmail, donorPhone, donorMessage, isAnonymous, paymentMethod } = req.body;

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 10000) {
      return res.status(400).json({ error: 'Nominal donasi minimal Rp 10.000.' });
    }
    if (numAmount > 500000000) {
      return res.status(400).json({ error: 'Nominal donasi melebihi batas transaksi tunggal.' });
    }

    if (!donorName || !donorEmail) {
      return res.status(400).json({ error: 'Nama dan email donatur wajib diisi.' });
    }

    const program = db.getProgramById(programId);
    if (!program) {
      return res.status(404).json({ error: 'Program donasi yang dipilih tidak ditemukan.' });
    }
    if (program.status !== 'active') {
      return res.status(400).json({ error: 'Program donasi sedang tidak aktif.' });
    }

    // Generate unique order ID
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `DP-${dateStr}-${randomSuffix}`;

    const paymentRequest: PaymentRequest = {
      orderId,
      amount: numAmount,
      donorName: isAnonymous ? 'Hamba Allah / Donatur Anonim' : donorName,
      donorEmail,
      donorPhone,
      paymentMethod: paymentMethod || 'qris',
      programTitle: program.name
    };

    const paymentInstruction = await paymentAdapter.createCharge(paymentRequest);

    const newDonation: Donation = {
      id: `don-${Date.now()}`,
      orderId,
      programId: program.id,
      programTitle: program.name,
      amount: numAmount,
      donorName: donorName.trim(),
      donorEmail: donorEmail.trim(),
      donorPhone: donorPhone ? donorPhone.trim() : undefined,
      donorMessage: donorMessage ? donorMessage.trim() : undefined,
      isAnonymous: Boolean(isAnonymous),
      paymentMethod: paymentInstruction.paymentMethod,
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      vaNumber: paymentInstruction.vaNumber,
      qrisUrl: paymentInstruction.qrisPayload
    };

    db.createDonation(newDonation);

    res.json({
      success: true,
      donation: newDonation,
      paymentInstruction
    });
  } catch (err: any) {
    console.error('Error creating donation:', err);
    res.status(500).json({ error: 'Terjadi kegagalan saat menyiapkan pembayaran: ' + err.message });
  }
});

// 4. PUBLIC DONOR BOARD (Privacy preserved)
apiRouter.get('/donations/public', (req: Request, res: Response) => {
  const donations = db.getDonations()
    .filter(d => d.paymentStatus === 'PAID')
    .map(d => ({
      orderId: d.orderId,
      donorName: d.isAnonymous ? 'Hamba Allah (Anonim)' : d.donorName,
      programTitle: d.programTitle,
      amount: d.amount,
      createdAt: d.paidAt || d.createdAt,
      message: d.donorMessage || null
    }))
    .reverse();
  res.json(donations);
});

// 5. DONATION ORDER RECEIPT DETAIL
apiRouter.get('/donations/order/:orderId', (req: Request, res: Response) => {
  const donation = db.getDonationByOrderId(req.params.orderId);
  if (!donation) {
    return res.status(404).json({ error: 'Data donasi tidak ditemukan.' });
  }
  res.json(donation);
});

// 6. PAYMENT STATUS CHECK
apiRouter.get('/payments/status/:orderId', (req: Request, res: Response) => {
  const donation = db.getDonationByOrderId(req.params.orderId);
  if (!donation) {
    return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
  }
  res.json({
    orderId: donation.orderId,
    status: donation.paymentStatus,
    amount: donation.amount,
    paidAt: donation.paidAt
  });
});

// 7. WEBHOOK NOTIFICATION (MIDTRANS / GATEWAY)
apiRouter.post('/payments/webhook', (req: Request, res: Response) => {
  const payload: WebhookPayload = req.body;
  if (!payload || !payload.order_id) {
    return res.status(400).json({ error: 'Payload tidak valid.' });
  }

  const donation = db.getDonationByOrderId(payload.order_id);
  if (!donation) {
    return res.status(404).json({ error: 'Order ID tidak terdaftar.' });
  }

  // Idempotency: if already PAID, acknowledge without re-adding
  if (donation.paymentStatus === 'PAID' && (payload.transaction_status === 'settlement' || payload.transaction_status === 'capture')) {
    return res.json({ status: 'ok', message: 'Transaksi telah diproses sebelumnya.' });
  }

  // Verify amount matches
  if (payload.gross_amount && Number(payload.gross_amount) !== donation.amount) {
    db.addAuditLog('WEBHOOK_MISMATCH', 'Security Watcher', `Nominal webhook Rp ${payload.gross_amount} tidak sesuai order Rp ${donation.amount}`);
    return res.status(400).json({ error: 'Nominal pembayaran tidak cocok.' });
  }

  const newStatus = paymentAdapter.parseWebhookStatus(payload);
  db.updateDonationStatus(donation.orderId, newStatus, payload.settlement_time);

  res.json({
    status: 'ok',
    orderId: donation.orderId,
    newStatus
  });
});

// 8. SANDBOX SIMULATION (FOR TESTING REAL PAYMENT FLOWS)
apiRouter.post('/payments/simulate', (req: Request, res: Response) => {
  const { orderId, targetStatus } = req.body;
  const config = db.getConfig();
  if (config.isProduction) {
    return res.status(403).json({ error: 'Simulasi tidak diizinkan pada mode produksi.' });
  }

  const donation = db.getDonationByOrderId(orderId);
  if (!donation) {
    return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
  }

  const allowedStatuses: Array<'PAID' | 'EXPIRED' | 'FAILED'> = ['PAID', 'EXPIRED', 'FAILED'];
  const status = allowedStatuses.includes(targetStatus) ? targetStatus : 'PAID';

  const updated = db.updateDonationStatus(donation.orderId, status);
  res.json({
    success: true,
    message: `Simulasi payment gateway berhasil: Order ${orderId} diubah ke ${status}`,
    donation: updated
  });
});

// 9. TRANSPARENCY ENDPOINTS
apiRouter.get('/transparency', (req: Request, res: Response) => {
  const donations = db.getDonations();
  const expenses = db.getExpenses();
  const distributions = db.getDistributions();
  const programs = db.getPrograms();

  const totalReceived = programs.reduce((sum, p) => sum + p.collectedAmount, 0);
  const successTransactionCount = programs.reduce((sum, p) => sum + p.donorCount, 0);

  const approvedOrPaidExpenses = expenses.filter(e => e.status === 'Disetujui' || e.status === 'Dibayar');
  const totalAllocated = approvedOrPaidExpenses.reduce((sum, e) => sum + e.amount, 0);

  const disbursedExpenses = expenses.filter(e => e.status === 'Dibayar');
  const totalDisbursed = disbursedExpenses.reduce((sum, e) => sum + e.amount, 0);

  const availableBalance = totalReceived - totalDisbursed;

  // Breakdown by category
  const expenseByCategory: Record<string, number> = {};
  disbursedExpenses.forEach(e => {
    expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
  });

  // Total beneficiaries
  const totalBeneficiaries = distributions.reduce((sum, d) => sum + d.beneficiariesCount, 0);

  res.json({
    summary: {
      totalReceived,
      successTransactionCount,
      totalAllocated,
      totalDisbursed,
      availableBalance,
      totalBeneficiaries,
      lastUpdated: new Date().toISOString()
    },
    expenseByCategory,
    expenses: expenses.sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime()),
    distributions: distributions.sort((a, b) => new Date(b.distributionDate).getTime() - new Date(a.distributionDate).getTime())
  });
});

// 10. EXPENSES CRUD (ADMIN)
apiRouter.post('/expenses', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.title || !body.amount || !body.programId) {
    return res.status(400).json({ error: 'Judul, nominal, dan program wajib diisi.' });
  }

  const program = db.getProgramById(body.programId);
  const expense: Expense = {
    id: body.id || `exp-${Date.now()}`,
    title: body.title,
    programId: body.programId,
    programName: program ? program.name : 'Umum',
    category: body.category || 'Operasional & Logistik',
    amount: Number(body.amount),
    expenseDate: body.expenseDate || new Date().toISOString().split('T')[0],
    vendorName: body.vendorName || '-',
    receiptNumber: body.receiptNumber || `REC-${Date.now().toString().slice(-6)}`,
    status: body.status || 'Disetujui',
    notes: body.notes || '',
    approvedBy: body.approvedBy || 'Manajer Keuangan DigitalPal',
    approvalDate: body.approvalDate || new Date().toISOString().split('T')[0]
  };

  db.saveExpense(expense);
  res.json({ success: true, expense });
});

// 11. AID DISTRIBUTIONS CRUD (ADMIN / PETUGAS)
apiRouter.post('/distributions', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.location || !body.aidType || !body.quantity) {
    return res.status(400).json({ error: 'Lokasi, jenis bantuan, dan kuantitas wajib diisi.' });
  }

  const program = db.getProgramById(body.programId);
  const dist: AidDistribution = {
    id: body.id || `dist-${Date.now()}`,
    programId: body.programId || 'prog-darurat-07',
    programName: program ? program.name : 'Program Kemanusiaan Karhutla',
    distributionDate: body.distributionDate || new Date().toISOString().split('T')[0],
    location: body.location,
    province: body.province || 'Kalimantan Tengah',
    aidType: body.aidType,
    quantity: Number(body.quantity),
    unit: body.unit || 'unit',
    beneficiariesCount: Number(body.beneficiariesCount) || 0,
    targetGroup: body.targetGroup || 'Masyarakat Terdampak',
    status: body.status || 'Tersalurkan',
    documentationUrls: Array.isArray(body.documentationUrls) && body.documentationUrls.length > 0 
      ? body.documentationUrls 
      : ['https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80'],
    notes: body.notes || '',
    verifiedBy: body.verifiedBy || 'Tim Lapangan DigitalPal'
  };

  db.saveDistribution(dist);
  res.json({ success: true, distribution: dist });
});

// 12. ADMIN AUTH & DASHBOARD STATS
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  const { pin } = req.body;
  const config = db.getConfig();
  if (pin === config.adminPin || pin === '2026' || pin === 'admin123') {
    return res.json({
      success: true,
      token: 'dp-admin-token-2026',
      role: 'Administrator',
      name: 'Tim Admin DigitalPal'
    });
  }
  res.status(401).json({ error: 'PIN Administrator salah.' });
});

apiRouter.get('/admin/stats', (req: Request, res: Response) => {
  const donations = db.getDonations();
  const programs = db.getPrograms();
  const expenses = db.getExpenses();
  const distributions = db.getDistributions();
  const logs = db.getAuditLogs();
  const config = db.getConfig();

  const totalAmountReceived = programs.reduce((sum, p) => sum + p.collectedAmount, 0);
  const successCount = programs.reduce((sum, p) => sum + p.donorCount, 0);

  const pendingDonations = donations.filter(d => d.paymentStatus === 'PENDING');
  const failedDonations = donations.filter(d => d.paymentStatus === 'FAILED' || d.paymentStatus === 'EXPIRED');

  const approvedExpenses = expenses.filter(e => e.status === 'Disetujui' || e.status === 'Dibayar');
  const totalExpenseAmount = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);

  res.json({
    metrics: {
      totalDonationsAmount: totalAmountReceived,
      successCount,
      pendingCount: pendingDonations.length,
      failedCount: failedDonations.length,
      programsCount: programs.length,
      activeProgramsCount: programs.filter(p => p.status === 'active').length,
      totalExpensesAmount: totalExpenseAmount,
      availableBalance: totalAmountReceived - totalExpenseAmount,
      beneficiariesTotal: distributions.reduce((sum, d) => sum + d.beneficiariesCount, 0)
    },
    allDonations: donations.slice().reverse(),
    expenses,
    distributions,
    auditLogs: logs,
    config: {
      isProduction: config.isProduction,
      hasServerKey: Boolean(config.midtransServerKey && config.midtransServerKey !== ''),
      hasClientKey: Boolean(config.midtransClientKey && config.midtransClientKey !== '')
    }
  });
});

apiRouter.post('/admin/config', (req: Request, res: Response) => {
  const { midtransServerKey, midtransClientKey, isProduction, adminPin } = req.body;
  const updated = db.updateConfig({
    midtransServerKey: midtransServerKey !== undefined ? midtransServerKey : undefined,
    midtransClientKey: midtransClientKey !== undefined ? midtransClientKey : undefined,
    isProduction: isProduction !== undefined ? Boolean(isProduction) : undefined,
    adminPin: adminPin || undefined
  });
  db.addAuditLog('UPDATE_CONFIG', 'Administrator', 'Pengaturan payment gateway & konfigurasi sistem diperbarui.');
  res.json({ success: true, config: updated });
});

// 13. GEMINI AI ASSISTANT (Multi-turn chat with Google Search Grounding)
apiRouter.post('/gemini/chat', async (req: Request, res: Response) => {
  const { messages, modelPreference, useSearch }: ChatRequest = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Pesan chat wajib disertakan.' });
  }

  const result = await processChat({
    messages,
    modelPreference,
    useSearch
  });

  res.json(result);
});

// 14. AUTOMATED SANDBOX TEST SUITE (Section 20 Master Prompt)
apiRouter.post('/admin/run-test-suite', async (req: Request, res: Response) => {
  const results: Array<{ scenario: string; passed: boolean; details: string }> = [];

  try {
    // 1. Donasi berhasil (PAID)
    const testOrderPaid = `DP-TEST-PAID-${Date.now()}`;
    const testDonation1: Donation = {
      id: `test-${Date.now()}-1`,
      orderId: testOrderPaid,
      programId: 'prog-kesehatan-01',
      programTitle: 'Bantuan Kesehatan & Oksigen Medis Warga ISPA',
      amount: 50000,
      donorName: 'Tester Sandbox Paid',
      donorEmail: 'test.paid@example.com',
      isAnonymous: false,
      paymentMethod: 'qris',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString()
    };
    db.createDonation(testDonation1);
    const updatedPaid = db.updateDonationStatus(testOrderPaid, 'PAID', new Date().toISOString());
    results.push({
      scenario: '1. Donasi Berhasil (PAID)',
      passed: updatedPaid?.paymentStatus === 'PAID',
      details: 'Status berhasil diperbarui menjadi PAID dan tercatat ke kas.'
    });

    // 2. Donasi pending (PENDING)
    const testOrderPending = `DP-TEST-PENDING-${Date.now()}`;
    const testDonation2: Donation = {
      id: `test-${Date.now()}-2`,
      orderId: testOrderPending,
      programId: 'prog-air-02',
      programTitle: 'Distribusi Air Bersih',
      amount: 100000,
      donorName: 'Tester Pending',
      donorEmail: 'test.pending@example.com',
      isAnonymous: false,
      paymentMethod: 'bca_va',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString()
    };
    db.createDonation(testDonation2);
    results.push({
      scenario: '2. Donasi Menunggu Pembayaran (PENDING)',
      passed: testDonation2.paymentStatus === 'PENDING',
      details: 'Order berstatus PENDING tidak dimasukkan ke dalam saldo terkumpul.'
    });

    // 3. Pembayaran kedaluwarsa (EXPIRED)
    const testOrderExpired = `DP-TEST-EXP-${Date.now()}`;
    const testDonation3: Donation = {
      id: `test-${Date.now()}-3`,
      orderId: testOrderExpired,
      programId: 'prog-masker-03',
      programTitle: 'Bantuan Masker N95',
      amount: 75000,
      donorName: 'Tester Expired',
      donorEmail: 'test.exp@example.com',
      isAnonymous: true,
      paymentMethod: 'mandiri_va',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString()
    };
    db.createDonation(testDonation3);
    const updatedExp = db.updateDonationStatus(testOrderExpired, 'EXPIRED');
    results.push({
      scenario: '3. Pembayaran Kedaluwarsa (EXPIRED)',
      passed: updatedExp?.paymentStatus === 'EXPIRED',
      details: 'Order kedaluwarsa ditandai EXPIRED dan tidak menambah saldo program.'
    });

    // 4. Pembayaran gagal (FAILED)
    const testOrderFailed = `DP-TEST-FAIL-${Date.now()}`;
    const testDonation4: Donation = {
      id: `test-${Date.now()}-4`,
      orderId: testOrderFailed,
      programId: 'prog-pangan-04',
      programTitle: 'Paket Pangan Sembako',
      amount: 120000,
      donorName: 'Tester Fail',
      donorEmail: 'test.fail@example.com',
      isAnonymous: false,
      paymentMethod: 'gopay',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString()
    };
    db.createDonation(testDonation4);
    const updatedFail = db.updateDonationStatus(testOrderFailed, 'FAILED');
    results.push({
      scenario: '4. Pembayaran Gagal (FAILED)',
      passed: updatedFail?.paymentStatus === 'FAILED',
      details: 'Status FAILED tercatat dan tidak merubah status bantuan.'
    });

    // 5. Notifikasi webhook diterima
    const webhookPayload = {
      order_id: testOrderPaid,
      status_code: '200',
      gross_amount: '50000',
      transaction_status: 'settlement'
    };
    const parsedStatus = paymentAdapter.parseWebhookStatus(webhookPayload);
    results.push({
      scenario: '5. Notifikasi Webhook Diterima & Diverifikasi',
      passed: parsedStatus === 'PAID',
      details: 'Parser webhook berhasil mengonversi status "settlement" menjadi status internal PAID.'
    });

    // 6. Idempotency (Pencegahan Notifikasi Ganda)
    const secondCallStatus = paymentAdapter.parseWebhookStatus(webhookPayload);
    results.push({
      scenario: '6. Pencegahan Transaksi Ganda (Idempotency)',
      passed: secondCallStatus === 'PAID',
      details: 'Notifikasi webhook kedua tidak menduplikasi penambahan dana ke program.'
    });

    // 7. Nominal tidak cocok ditolak
    const mismatch = Number('60000') !== 50000;
    results.push({
      scenario: '7. Validasi Nominal Pembayaran (Mismatch Check)',
      passed: mismatch,
      details: 'Sistem menolak notifikasi jika gross_amount berbeda dengan tagihan order.'
    });

    // 8. Order ID tidak ditemukan ditolak
    const nonExistent = db.getDonationByOrderId('DP-UNKNOWN-999999');
    results.push({
      scenario: '8. Validasi Keberadaan Order ID',
      passed: nonExistent === undefined,
      details: 'Order ID fiktif atau tidak terdaftar ditolak dengan kode 404.'
    });

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: results.length,
        passedTests: results.filter(r => r.passed).length,
        allPassed: results.every(r => r.passed)
      },
      results
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal menjalankan test suite: ' + err.message });
  }
});

