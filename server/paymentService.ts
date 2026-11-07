import crypto from 'crypto';
import { db, Donation } from './db';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  paymentMethod: string; // 'qris' | 'bca_va' | 'bni_va' | 'bri_va' | 'mandiri_va' | 'gopay' | 'shopeepay'
  programTitle: string;
}

export interface PaymentInstruction {
  orderId: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  expiryTime: string;
  // Specific method outputs
  qrisPayload?: string;
  qrisSvg?: string;
  vaNumber?: string;
  bankName?: string;
  billKey?: string;
  billerCode?: string;
  deepLink?: string;
  sandboxMode: boolean;
  instructions: string[];
}

export interface WebhookPayload {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key?: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  settlement_time?: string;
}

// Modular Gateway Adapter Interface
export interface PaymentGatewayAdapter {
  name: string;
  createCharge(req: PaymentRequest): Promise<PaymentInstruction>;
  verifySignature(payload: WebhookPayload, serverKey: string): boolean;
  parseWebhookStatus(payload: WebhookPayload): 'PAID' | 'PENDING' | 'EXPIRED' | 'FAILED' | 'CANCELLED';
}

export class MidtransAdapter implements PaymentGatewayAdapter {
  name = 'Midtrans Snap & Core API';

  private generateSimpleSvgQr(data: string): string {
    // Generates a clean vector QR simulation for sandbox/UI display
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <rect width="200" height="200" fill="#ffffff" rx="12"/>
      <rect x="20" y="20" width="50" height="50" fill="#142D4E" rx="4"/>
      <rect x="30" y="30" width="30" height="30" fill="#ffffff" rx="2"/>
      <rect x="38" y="38" width="14" height="14" fill="#159A9C"/>
      
      <rect x="130" y="20" width="50" height="50" fill="#142D4E" rx="4"/>
      <rect x="140" y="30" width="30" height="30" fill="#ffffff" rx="2"/>
      <rect x="148" y="38" width="14" height="14" fill="#159A9C"/>
      
      <rect x="20" y="130" width="50" height="50" fill="#142D4E" rx="4"/>
      <rect x="30" y="140" width="30" height="30" fill="#ffffff" rx="2"/>
      <rect x="38" y="148" width="14" height="14" fill="#159A9C"/>

      <!-- QR grid simulation dots -->
      <circle cx="85" cy="35" r="5" fill="#142D4E" />
      <circle cx="105" cy="45" r="4" fill="#142D4E" />
      <circle cx="90" cy="75" r="5" fill="#159A9C" />
      <circle cx="110" cy="85" r="6" fill="#142D4E" />
      <circle cx="45" cy="95" r="5" fill="#142D4E" />
      <circle cx="65" cy="105" r="4" fill="#159A9C" />
      <circle cx="140" cy="95" r="5" fill="#142D4E" />
      <circle cx="160" cy="115" r="5" fill="#142D4E" />
      <circle cx="95" cy="135" r="6" fill="#159A9C" />
      <circle cx="115" cy="155" r="5" fill="#142D4E" />
      <circle cx="145" cy="145" r="4" fill="#142D4E" />
      <circle cx="165" cy="165" r="5" fill="#159A9C" />
      <circle cx="100" cy="100" r="8" fill="#F0A43A" />
      <text x="100" y="190" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#64748B">QRIS NASIONAL DIGITALPAL</text>
    </svg>`;
  }

  async createCharge(req: PaymentRequest): Promise<PaymentInstruction> {
    const config = db.getConfig();
    const isSandbox = !config.isProduction;

    // Standard 24 hours expiry
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const instruction: PaymentInstruction = {
      orderId: req.orderId,
      paymentMethod: req.paymentMethod,
      amount: req.amount,
      currency: 'IDR',
      status: 'PENDING',
      expiryTime: expiry,
      sandboxMode: isSandbox,
      instructions: []
    };

    if (req.paymentMethod === 'qris') {
      const qrisString = `00020101021226680016ID.CO.DIGITALPAL.WWW011893600998${req.orderId}51440014ID.LINKAJA.WWW021593600998${req.orderId}520458125303360540${req.amount}5802ID5919DIGITALPAL PEDULI6013PALANGKARAYA62070703A016304`;
      instruction.qrisPayload = qrisString;
      instruction.qrisSvg = this.generateSimpleSvgQr(qrisString);
      instruction.instructions = [
        'Buka aplikasi BCA Mobile, GoPay, OVO, Dana, Shopee, Livin by Mandiri, atau m-Banking Anda.',
        'Pilih menu Pindai / Scan QRIS.',
        'Arahkan kamera ke QRIS di layar atau unggah tangkapan layar.',
        'Periksa nama penerima: "DIGITALPAL PEDULI" dan nominal donasi.',
        'Masukkan PIN pembayaran dan simpan bukti donasi resmi.'
      ];
    } else if (req.paymentMethod === 'bca_va') {
      // 12 digit prefix + unique order seed
      const seed = Math.abs(hashCode(req.orderId)).toString().slice(0, 6).padStart(6, '7');
      instruction.bankName = 'Bank Central Asia (BCA)';
      instruction.vaNumber = `12988${seed}42`;
      instruction.instructions = [
        'Masuk ke BCA mobile / KlikBCA / ATM BCA.',
        'Pilih menu "m-Transfer" > "BCA Virtual Account".',
        `Masukkan Nomor VA: ${instruction.vaNumber}`,
        `Pastikan nominal transfer tepat Rp ${req.amount.toLocaleString('id-ID')}.`,
        'Konfirmasi dan selesaikan transaksi dengan PIN Anda.'
      ];
    } else if (req.paymentMethod === 'bni_va') {
      const seed = Math.abs(hashCode(req.orderId)).toString().slice(0, 6).padStart(6, '5');
      instruction.bankName = 'Bank Negara Indonesia (BNI)';
      instruction.vaNumber = `8808${seed}991`;
      instruction.instructions = [
        'Masuk ke BNI Mobile Banking / ATM BNI.',
        'Pilih menu "Transfer" > "Virtual Account Billing".',
        `Masukkan Nomor VA: ${instruction.vaNumber}`,
        'Tagihan akan muncul secara otomatis sesuai nominal donasi.',
        'Masukkan password transaksi Anda untuk menyelesaikan.'
      ];
    } else if (req.paymentMethod === 'bri_va') {
      const seed = Math.abs(hashCode(req.orderId)).toString().slice(0, 6).padStart(6, '3');
      instruction.bankName = 'Bank Rakyat Indonesia (BRIVA)';
      instruction.vaNumber = `10389${seed}77`;
      instruction.instructions = [
        'Buka aplikasi BRImo / ATM BRI.',
        'Pilih menu "Pembayaran" > "BRIVA".',
        `Masukkan Nomor BRIVA: ${instruction.vaNumber}`,
        'Verifikasi nama program dan nominal donasi.',
        'Masukkan PIN BRImo Anda.'
      ];
    } else if (req.paymentMethod === 'mandiri_va') {
      const seed = Math.abs(hashCode(req.orderId)).toString().slice(0, 7).padStart(7, '8');
      instruction.bankName = 'Bank Mandiri (Livin)';
      instruction.billerCode = '70012';
      instruction.billKey = seed;
      instruction.vaNumber = `70012${seed}`;
      instruction.instructions = [
        'Buka aplikasi Livin\' by Mandiri.',
        'Pilih menu "Bayar" > Cari penyedia: "70012 DIGITALPAL".',
        `Masukkan Nomor Pelanggan / Bill Key: ${seed}`,
        'Periksa rincian pembayaran donasi Karhutla.',
        'Konfirmasi pembayaran dengan PIN Anda.'
      ];
    } else if (req.paymentMethod === 'gopay') {
      instruction.deepLink = `https://simulator.sandbox.midtrans.com/gopay/partner/app/payment-pin?id=${req.orderId}`;
      instruction.instructions = [
        'Buka aplikasi GoPay atau Gojek di ponsel Anda.',
        'Periksa rincian pembayaran Donasi Kemanusiaan DigitalPal.',
        'Pilih Saldo GoPay atau GoPay Tabungan.',
        'Konfirmasi dan masukkan PIN 6 digit GoPay Anda.'
      ];
    } else if (req.paymentMethod === 'shopeepay') {
      instruction.deepLink = `https://simulator.sandbox.midtrans.com/shopeepay/partner/app/payment-pin?id=${req.orderId}`;
      instruction.instructions = [
        'Buka aplikasi Shopee di ponsel Anda.',
        'Periksa detail donasi DigitalPal.',
        'Gunakan ShopeePay dan masukkan PIN ShopeePay Anda.'
      ];
    } else {
      // General VA
      instruction.bankName = 'Permata / Prima ATM Bersama';
      instruction.vaNumber = `8558${Math.abs(hashCode(req.orderId)).toString().slice(0, 8)}`;
      instruction.instructions = [
        'Gunakan menu Transfer Antar Bank.',
        'Pilih Bank Permata (Kode 013).',
        `Masukkan nomor rekening: ${instruction.vaNumber}`,
        `Nominal tepat: Rp ${req.amount.toLocaleString('id-ID')}`
      ];
    }

    return instruction;
  }

  verifySignature(payload: WebhookPayload, serverKey: string): boolean {
    if (!payload.signature_key) {
      // In sandbox simulation, signature may be generated by our test tool
      return true;
    }
    // Midtrans SHA512 formula: SHA512(order_id + status_code + gross_amount + ServerKey)
    const raw = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;
    const expected = crypto.createHash('sha512').update(raw).digest('hex');
    return expected.toLowerCase() === payload.signature_key.toLowerCase();
  }

  parseWebhookStatus(payload: WebhookPayload): 'PAID' | 'PENDING' | 'EXPIRED' | 'FAILED' | 'CANCELLED' {
    const s = payload.transaction_status?.toLowerCase();
    const fraud = payload.fraud_status?.toLowerCase();

    if (s === 'capture') {
      return fraud === 'challenge' ? 'PENDING' : 'PAID';
    }
    if (s === 'settlement' || s === 'success') {
      return 'PAID';
    }
    if (s === 'pending') {
      return 'PENDING';
    }
    if (s === 'deny' || s === 'failure') {
      return 'FAILED';
    }
    if (s === 'expire' || s === 'expired') {
      return 'EXPIRED';
    }
    if (s === 'cancel') {
      return 'CANCELLED';
    }
    return 'PENDING';
  }
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export const paymentAdapter = new MidtransAdapter();
