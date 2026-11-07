import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, Globe, ExternalLink, RefreshCw, ShieldCheck, Flame, Compass } from 'lucide-react';
import { api } from '../services/api';

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: Array<{ uri: string; title: string }>;
  timestamp: string;
}

interface GeminiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDonate?: (programId?: string) => void;
}

export const GeminiChatModal: React.FC<GeminiChatModalProps> = ({ isOpen, onClose, onNavigateToDonate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Halo! Saya **Sahabat Relawan AI DigitalPal**.\n\nSaya siap membantu Anda dengan informasi situasi kebakaran hutan dan lahan (Karhutla) Indonesia 2026, edukasi pencegahan ISPA & masker medis, transparansi donasi, serta kondisi cuaca/hujan terkini yang diverifikasi melalui Google Search Grounding.\n\nAda yang dapat saya bantu untuk Anda hari ini?',
      timestamp: 'Baru saja'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon'>('gemini-3.8-flash');
  const [useSearch, setUseSearch] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      // Send conversation to backend Gemini endpoint
      const payloadMessages = newHistory.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await api.sendGeminiChat(payloadMessages, selectedModel, useSearch);

      const botMsg: Message = {
        role: 'model',
        text: res.text,
        sources: res.sources,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        role: 'model',
        text: 'Maaf, terjadi gangguan saat menghubungi server AI. ' + (err.message || 'Silakan coba sesaat lagi.'),
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'model',
        text: 'Percakapan telah direset. Ada yang ingin Anda tanyakan seputar aksi kemanusiaan Karhutla DigitalPal?',
        timestamp: 'Baru saja'
      }
    ]);
  };

  const QUICK_QUESTIONS = [
    'Bagaimana kondisi Karhutla di Kalteng dan Sumatera Selatan saat ini?',
    'Masker apa yang efektif melindungi dari asap pekat Karhutla?',
    'Bagaimana DigitalPal menjamin transparansi dana donatur?',
    'Bagaimana cara kerja sumur bor dan pembasahan gambut?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl h-[90vh] max-h-[720px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#142D4E] to-[#1F456E] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#159A9C] flex items-center justify-center shadow-inner">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Sahabat Relawan AI DigitalPal</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#159A9C]/30 text-teal-200 border border-[#159A9C]/40">
                  <Sparkles className="w-2.5 h-2.5" /> Live Assistant
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Didukung Gemini AI &amp; Google Search Grounding Terverifikasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReset}
              title="Reset Chat"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Model Bar / Search Toggle */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="bg-white border border-slate-300 text-slate-700 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#159A9C]"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (Rekomendasi + Search)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Respon Kilat)</option>
              <option value="gemini-4-argon">gemini-4-argon (Analisis Mendalam)</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
            <input
              type="checkbox"
              checked={useSearch}
              onChange={(e) => setUseSearch(e.target.checked)}
              className="rounded text-[#159A9C] focus:ring-[#159A9C]"
            />
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium text-slate-600">Google Search Grounding</span>
          </label>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((m, idx) => {
            const isBot = m.role === 'model';
            return (
              <div key={idx} className={`flex gap-3 ${isBot ? 'items-start' : 'items-start justify-end'}`}>
                {isBot && (
                  <div className="w-8 h-8 rounded-lg bg-[#142D4E] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm ${
                  isBot 
                    ? 'bg-white border border-slate-200 text-slate-800' 
                    : 'bg-[#159A9C] text-white rounded-tr-none'
                }`}>
                  {/* Message content */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {m.text}
                  </div>

                  {/* Grounded Sources (if any) */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mb-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        Sumber Referensi Google Search:
                      </div>
                      <div className="flex flex-col gap-1">
                        {m.sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 hover:underline truncate"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{src.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`text-[10px] mt-1.5 ${isBot ? 'text-slate-400' : 'text-teal-100 text-right'}`}>
                    {m.timestamp}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-lg bg-[#F0A43A] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-[#142D4E] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm text-xs text-slate-500 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#159A9C] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#159A9C] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#159A9C] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Sahabat Relawan sedang menganalisis data &amp; merespon...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-white border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-slate-400" /> Topik Cepat:
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {QUICK_QUESTIONS.map((q, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition text-left shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Tanyakan situasi Karhutla, ISPA, masker, atau penyaluran donasi..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#159A9C] focus:border-transparent bg-slate-50 disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2.5 rounded-xl font-medium text-sm bg-[#159A9C] hover:bg-[#128284] text-white flex items-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Kirim</span>
          </button>
        </div>

      </div>
    </div>
  );
};
