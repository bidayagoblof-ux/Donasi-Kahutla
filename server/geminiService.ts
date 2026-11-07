import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  modelPreference?: 'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon';
  useSearch?: boolean;
}

export async function processChat(req: ChatRequest) {
  const ai = getAiClient();
  if (!ai) {
    return {
      text: 'Layanan Asisten AI DigitalPal belum aktif karena API Key belum terkonfigurasi di server. Silakan hubungi admin atau periksa Secrets panel.',
      sources: []
    };
  }

  const selectedModel = req.modelPreference || 'gemini-3.8-flash';
  const systemInstruction = `Anda adalah "Sahabat Relawan AI DigitalPal", asisten kemanusiaan resmi dan empatik dari organisasi sosial DigitalPal (Sahabat Digital) untuk aksi kemanusiaan "DIGITALPAL – DONASI PEDULI KARHUTLA INDONESIA 2026".
Tagline: "Bersama Pulihkan Harapan, Bantu Masyarakat Terdampak Karhutla."

Tugas utama Anda:
1. Membantu donatur dan masyarakat memahami situasi darurat kebakaran hutan dan lahan (karhutla) di Indonesia tahun 2026 (terutama Kalimantan Tengah, Sumatera Selatan, Kalimantan Barat, Kalimantan Selatan, Papua Selatan).
2. Memberikan edukasi mitigasi kesehatan paparan asap pekat: penggunaan masker N95 berstandar, pertolongan pertama ISPA, ruang singgah berfilter udara (air purifier HEPA), oksigen medis, dan perlindungan kelompok rentan (bayi, balita, lansia, ibu hamil).
3. Menjelaskan transparansi penyaluran donasi DigitalPal: setiap rupiah dicatat terbuka, verifikasi bukti belanja/kwitansi, dan laporan distribusi riil ke desa-desa terdampak.
4. Menjawab pertanyaan cuaca, potensi hujan, atau perkembangan karhutla terkini dengan memanfaatkan Google Search Grounding.
5. Panduan berdonasi: donatur dapat berdonasi mulai Rp 25.000 melalui QRIS, Virtual Account bank nasional (BCA, BNI, BRI, Mandiri), dan e-wallet dengan konfirmasi instan.

Prinsip komunikasi:
- Selalu sopan, humanis, solutif, dan berbasis data faktual.
- Jangan mengarang angka atau statistik fiktif. Jika data belum tersedia, sampaikan terus terang.
- Bila menyebut data snapshot (seperti BNPB per 24 Oktober 2026 atau IHCP per 21 Oktober 2026), sebutkan tanggal dan sumbernya.`;

  try {
    // Format conversation history for Gemini contents
    const contents = req.messages.map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    // Config options
    const config: any = {
      systemInstruction,
    };

    // Add Google Search grounding if requested or default for 3.8-flash
    if (req.useSearch !== false && selectedModel === 'gemini-3.8-flash') {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config,
    });

    const replyText = response.text || 'Maaf, belum ada tanggapan yang dapat diberikan saat ini.';

    // Extract search grounding sources if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web && chunk.web.uri)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title || chunk.web.uri,
      }));

    return {
      text: replyText,
      sources,
      modelUsed: selectedModel,
    };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return {
      text: `Mohon maaf, terjadi kendala saat memproses permintaan: ${error?.message || 'Layanan sedang sibuk'}. Silakan coba kembali dalam beberapa saat.`,
      sources: []
    };
  }
}
