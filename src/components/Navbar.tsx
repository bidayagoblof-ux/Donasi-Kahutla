import React, { useState } from 'react';
import { Flame, HeartHandshake, ShieldCheck, Bot, Menu, X, Lock } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, extra?: any) => void;
  onOpenAiChat: () => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenAiChat, isAdminLoggedIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'kondisi-karhutla', label: 'Kondisi Karhutla' },
    { id: 'program-donasi', label: 'Program Donasi' },
    { id: 'daftar-donatur', label: 'Daftar Donatur' },
    { id: 'transparansi', label: 'Transparansi' },
    { id: 'dokumentasi', label: 'Dokumentasi' },
    { id: 'tentang-kami', label: 'Tentang Kami' },
    { id: 'kontak', label: 'Kontak' },
  ];

  const handleNav = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Emergency Alert Top Banner */}
      <div className="bg-[#142D4E] text-white text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 font-medium">
        <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
        <span>Aksi Kemanusiaan Tanggap Karhutla 2026: Distribusi Air Bersih, Oksigen, Masker N95 &amp; Sembako di Wilayah Kritis ISPU.</span>
        <button
          onClick={() => onNavigate('transparansi')}
          className="underline hover:text-amber-300 ml-2 font-semibold hidden md:inline"
        >
          Lihat Transparansi &rarr;
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div
            onClick={() => handleNav('beranda')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#142D4E] to-[#159A9C] flex items-center justify-center shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-[#F0A43A]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#142D4E]">DIGITALPAL</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">2026</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                Donasi Peduli Karhutla Indonesia
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'text-[#159A9C] bg-teal-50 font-semibold'
                      : 'text-slate-600 hover:text-[#142D4E] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Gemini AI Bot Trigger */}
            <button
              onClick={onOpenAiChat}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition"
              title="Tanya Asisten AI Relawan Karhutla"
            >
              <Bot className="w-4 h-4 text-[#159A9C]" />
              <span>Tanya AI Relawan</span>
            </button>

            {/* Admin Dashboard shortcut */}
            <button
              onClick={() => handleNav('admin')}
              className={`p-2 rounded-xl border text-xs font-medium transition ${
                currentTab === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'text-slate-500 hover:text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
              title="Portal Administrator & Manajemen"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Primary Donasi Sekarang Button */}
            <button
              onClick={() => handleNav('donasi-sekarang')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#F0A43A] to-amber-600 hover:from-amber-500 hover:to-amber-700 shadow-md shadow-amber-500/20 active:scale-95 transition"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>DONASI SEKARANG</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => handleNav('donasi-sekarang')}
              className="sm:hidden px-3 py-1.5 rounded-lg font-bold text-xs text-white bg-[#F0A43A] hover:bg-amber-600"
            >
              Donasi
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                currentTab === item.id
                  ? 'bg-teal-50 text-[#159A9C] font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAiChat();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-slate-800 bg-slate-100"
            >
              <Bot className="w-4 h-4 text-[#159A9C]" />
              Tanya Sahabat AI Relawan
            </button>

            <button
              onClick={() => handleNav('donasi-sekarang')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#F0A43A] to-amber-600 shadow-md shadow-amber-500/20"
            >
              <HeartHandshake className="w-4 h-4" />
              DONASI SEKARANG
            </button>

            <button
              onClick={() => handleNav('admin')}
              className="w-full text-center py-2 text-xs text-slate-500 hover:text-slate-700"
            >
              Login Administrator &amp; Petugas Lapangan
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
