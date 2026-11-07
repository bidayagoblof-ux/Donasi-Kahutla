import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GeminiChatModal } from './components/GeminiChatModal';
import { HomePage } from './pages/HomePage';
import { KarhutlaConditionPage } from './pages/KarhutlaConditionPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { DonationCheckoutPage } from './pages/DonationCheckoutPage';
import { DonorsListPage } from './pages/DonorsListPage';
import { TransparencyPage } from './pages/TransparencyPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { AboutAndContactPage } from './pages/AboutAndContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { DonationTrackerModal } from './components/DonationTrackerModal';
import { api } from './services/api';
import { DonationProgram, PublicDonor, TransparencyReport, KarhutlaDataset } from './types';
import { Bot, Heart } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('beranda');
  const [preselectedProgramId, setPreselectedProgramId] = useState<string | undefined>(undefined);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);

  const [programs, setPrograms] = useState<DonationProgram[]>([]);
  const [recentDonors, setRecentDonors] = useState<PublicDonor[]>([]);
  const [transparencyReport, setTransparencyReport] = useState<TransparencyReport | null>(null);
  const [karhutlaDataset, setKarhutlaDataset] = useState<KarhutlaDataset | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [progs, donors, transp, ds] = await Promise.allSettled([
        api.getPrograms(),
        api.getPublicDonors(),
        api.getTransparencyReport(),
        api.getKarhutlaDataset()
      ]);

      if (progs.status === 'fulfilled') setPrograms(progs.value);
      if (donors.status === 'fulfilled') setRecentDonors(donors.value);
      if (transp.status === 'fulfilled') setTransparencyReport(transp.value);
      if (ds.status === 'fulfilled') setKarhutlaDataset(ds.value);
    } catch (e) {
      console.error('Error loading initial app data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (tab: string, extra?: { programId?: string }) => {
    if (extra?.programId) {
      setPreselectedProgramId(extra.programId);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-slate-800 font-sans selection:bg-[#159A9C]/20 selection:text-[#142D4E]">
      
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenAiChat={() => setIsAiChatOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {currentTab === 'beranda' && (
          <HomePage
            programs={programs}
            recentDonors={recentDonors}
            onNavigate={handleNavigate}
            onOpenAiChat={() => setIsAiChatOpen(true)}
          />
        )}

        {currentTab === 'kondisi-karhutla' && (
          <KarhutlaConditionPage
            dataset={karhutlaDataset}
            onNavigateToDonate={(progId) => handleNavigate('donasi-sekarang', { programId: progId })}
          />
        )}

        {currentTab === 'program-donasi' && (
          <ProgramsPage
            programs={programs}
            onSelectProgram={(progId) => handleNavigate('donasi-sekarang', { programId: progId })}
          />
        )}

        {currentTab === 'donasi-sekarang' && (
          <DonationCheckoutPage
            programs={programs}
            preselectedProgramId={preselectedProgramId}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'daftar-donatur' && (
          <DonorsListPage
            donors={recentDonors}
            onNavigateToDonate={() => handleNavigate('donasi-sekarang')}
            onTrackDonation={() => setIsTrackerOpen(true)}
          />
        )}

        {currentTab === 'transparansi' && (
          <TransparencyPage
            report={transparencyReport}
            onNavigateToDonate={() => handleNavigate('donasi-sekarang')}
          />
        )}

        {currentTab === 'dokumentasi' && (
          <DocumentationPage
            distributions={transparencyReport?.distributions || []}
            onNavigateToDonate={() => handleNavigate('donasi-sekarang')}
          />
        )}

        {(currentTab === 'tentang-kami' || currentTab === 'kontak') && (
          <AboutAndContactPage />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardPage />
        )}
      </main>

      {/* Floating Bottom AI Assistant Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsAiChatOpen(true)}
          className="group flex items-center gap-2 px-4 py-3 rounded-full bg-[#142D4E] hover:bg-[#1F456E] text-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-teal-500/30 hover:scale-105"
          title="Buka Chat AI Sahabat Relawan Karhutla"
        >
          <div className="w-7 h-7 rounded-full bg-[#159A9C] flex items-center justify-center text-white shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold hidden sm:inline">Tanya AI Relawan</span>
        </button>

        {currentTab !== 'donasi-sekarang' && (
          <button
            onClick={() => handleNavigate('donasi-sekarang')}
            className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-[#F0A43A] hover:bg-amber-600 text-white shadow-xl hover:shadow-2xl font-bold text-xs transition-all hover:scale-105"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span className="hidden sm:inline">Donasi Cepat</span>
          </button>
        )}
      </div>

      {/* Gemini AI Multi-turn Chat Assistant Modal */}
      <GeminiChatModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        onNavigateToDonate={(progId) => {
          setIsAiChatOpen(false);
          handleNavigate('donasi-sekarang', { programId: progId });
        }}
      />

      {/* Donation Order Self-Service Tracker Modal */}
      <DonationTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        onNavigateToDonate={() => {
          setIsTrackerOpen(false);
          handleNavigate('donasi-sekarang');
        }}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}

export default App;
