import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { AlertTriangle, Flame, ShieldAlert, CheckCircle2, Info, Wind } from 'lucide-react';

interface MapLocation {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
  type: 'ispu_critical' | 'priority_province' | 'peatland_area';
  ispu?: number | null;
  category?: string;
  hotspots?: number;
  burnedAreaHa?: number;
  responseAreaHa?: number;
  reason: string;
  source: string;
  date: string;
  suggestedProgramId: string;
}

const LOCATIONS: MapLocation[] = [
  {
    id: 'kalteng-palangka',
    name: 'Kota Palangka Raya',
    province: 'Kalimantan Tengah',
    lat: -2.2161,
    lng: 113.9140,
    type: 'ispu_critical',
    ispu: 1291,
    category: 'Berbahaya (>1200)',
    reason: 'ISPU menembus level Berbahaya 1291 per 19 Oktober. Kebutuhan ruang udara bersih dan oksigen darurat tinggi.',
    source: 'SRC-IHCP-2026-10-26 & Kemenkes',
    date: '2026-10-19',
    suggestedProgramId: 'prog-kesehatan-01'
  },
  {
    id: 'kalteng-kotim',
    name: 'Kab. Kotawaringin Timur (Sampit)',
    province: 'Kalimantan Tengah',
    lat: -2.5323,
    lng: 112.9565,
    type: 'ispu_critical',
    ispu: 1290,
    category: 'Berbahaya (>1200)',
    reason: 'ISPU 1290 Berbahaya, kabut asap tebal menyelimuti area pemukiman dan sekolah.',
    source: 'SRC-IHCP-2026-10-26',
    date: '2026-10-19',
    suggestedProgramId: 'prog-masker-03'
  },
  {
    id: 'kalteng-gunungmas',
    name: 'Kab. Gunung Mas',
    province: 'Kalimantan Tengah',
    lat: -1.1500,
    lng: 113.8667,
    type: 'ispu_critical',
    ispu: null,
    category: 'Berbahaya (Asesmen)',
    reason: 'Disebut dalam laporan ISPU berbahaya IHCP; verifikasi desa dan kualitas udara diperlukan.',
    source: 'SRC-IHCP-2026-10-26',
    date: '2026-10-21',
    suggestedProgramId: 'prog-kesehatan-01'
  },
  {
    id: 'kalteng-barsel',
    name: 'Kab. Barito Selatan',
    province: 'Kalimantan Tengah',
    lat: -1.7333,
    lng: 114.8500,
    type: 'ispu_critical',
    ispu: null,
    category: 'Berbahaya (Asesmen)',
    reason: 'Laporan kabut asap gambut pekat dan risiko ISPA bagi lansia & balita.',
    source: 'SRC-IHCP-2026-10-26',
    date: '2026-10-21',
    suggestedProgramId: 'prog-air-02'
  },
  {
    id: 'kalteng-katingan',
    name: 'Kab. Katingan',
    province: 'Kalimantan Tengah',
    lat: -1.9000,
    lng: 113.3833,
    type: 'ispu_critical',
    ispu: null,
    category: 'Berbahaya (Asesmen)',
    reason: 'Muncul dalam laporan karhutla BPBD; bara gambut bawah tanah memerlukan pembasahan intensif.',
    source: 'SRC-IHCP-2026-10-26 & BPBD Kalteng',
    date: '2026-10-28',
    suggestedProgramId: 'prog-relawan-05'
  },
  {
    id: 'kalteng-seruyan',
    name: 'Kab. Seruyan',
    province: 'Kalimantan Tengah',
    lat: -2.6000,
    lng: 112.5500,
    type: 'peatland_area',
    reason: 'Titik api gambut pesisir dan keterbatasan armada pemadaman lokal.',
    source: 'SRC-KALTENG-2026-10-30',
    date: '2026-10-28',
    suggestedProgramId: 'prog-air-02'
  },
  {
    id: 'kalteng-kapuas',
    name: 'Kab. Kapuas',
    province: 'Kalimantan Tengah',
    lat: -3.0090,
    lng: 114.3877,
    type: 'peatland_area',
    reason: 'Lahan gambut bekas PLG membutuhkan pembasahan berulang dan pasokan air bersih.',
    source: 'SRC-KALTENG-2026-10-30',
    date: '2026-10-28',
    suggestedProgramId: 'prog-air-02'
  },
  {
    id: 'kalteng-pulangpisau',
    name: 'Kab. Pulang Pisau',
    province: 'Kalimantan Tengah',
    lat: -2.7500,
    lng: 114.2500,
    type: 'peatland_area',
    reason: 'Kawasan gambut dalam yang rentan kebakaran bawah tanah (smoldering fire).',
    source: 'SRC-KALTENG-2026-10-30',
    date: '2026-10-28',
    suggestedProgramId: 'prog-rentan-06'
  },
  {
    id: 'sumsel-oki',
    name: 'Provinsi Sumatera Selatan',
    province: 'Sumatera Selatan',
    lat: -3.3194,
    lng: 104.9147,
    type: 'priority_province',
    hotspots: 1335,
    burnedAreaHa: 3429,
    responseAreaHa: 2472,
    reason: '1.335 hotspot dan 3.429 Ha terbakar. BNPB mengerahkan armada helikopter water bombing.',
    source: 'SRC-BNPB-2026-10-24',
    date: '2026-10-24',
    suggestedProgramId: 'prog-darurat-07'
  },
  {
    id: 'kalbar-ketapang',
    name: 'Provinsi Kalimantan Barat',
    province: 'Kalimantan Barat',
    lat: -0.0263,
    lng: 109.3425,
    type: 'priority_province',
    hotspots: 1137,
    burnedAreaHa: 2500,
    responseAreaHa: 1547,
    reason: '1.137 hotspot, 2.500 Ha terbakar. Asap melintasi perbatasan antarkabupaten.',
    source: 'SRC-BNPB-2026-10-24',
    date: '2026-10-24',
    suggestedProgramId: 'prog-pangan-04'
  },
  {
    id: 'kalsel-banjar',
    name: 'Provinsi Kalimantan Selatan',
    province: 'Kalimantan Selatan',
    lat: -3.4403,
    lng: 114.8306,
    type: 'priority_province',
    hotspots: 362,
    burnedAreaHa: 526,
    responseAreaHa: 317,
    reason: 'Asap mendekati area bandara Syamsudin Noor dan pemukiman ring 1.',
    source: 'SRC-BNPB-2026-10-24',
    date: '2026-10-24',
    suggestedProgramId: 'prog-relawan-05'
  },
  {
    id: 'papua-selatan',
    name: 'Provinsi Papua Selatan',
    province: 'Papua Selatan',
    lat: -8.4991,
    lng: 140.4011,
    type: 'priority_province',
    hotspots: 487,
    burnedAreaHa: 310,
    responseAreaHa: 117,
    reason: '487 hotspot satelit terdeteksi pada area savana dan rawa gambut Merauke.',
    source: 'SRC-BNPB-2026-10-24',
    date: '2026-10-24',
    suggestedProgramId: 'prog-darurat-07'
  }
];

interface KarhutlaMapProps {
  onSelectProgram?: (programId: string) => void;
}

export const KarhutlaMap: React.FC<KarhutlaMapProps> = ({ onSelectProgram }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation>(LOCATIONS[0]);
  const [filterType, setFilterType] = useState<'all' | 'ispu_critical' | 'priority_province'>('all');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-2.2, 114.5],
        zoom: 6,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | DigitalPal GIS',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    const filtered = filterType === 'all' 
      ? LOCATIONS 
      : LOCATIONS.filter(loc => loc.type === filterType || (filterType === 'ispu_critical' && loc.type === 'peatland_area'));

    filtered.forEach((loc) => {
      const isCritical = loc.type === 'ispu_critical';
      const color = isCritical ? '#D9534F' : loc.type === 'priority_province' ? '#F0A43A' : '#159A9C';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
            <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: ${color}; opacity: 0.3; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 28px; height: 28px; border-radius: 50%; background-color: ${color}; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedLocation(loc);
        map.panTo([loc.lat, loc.lng], { animate: true });
      });
    });

  }, [filterType]);

  const handleFocus = (loc: MapLocation) => {
    setSelectedLocation(loc);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([loc.lat, loc.lng], 8, { animate: true });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              PETA SITUASI GIS TERVERIFIKASI
            </span>
            <span className="text-xs text-slate-400">Cut-off Data: 30 Oktober 2026</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold mt-1 text-white">Pemetaan Wilayah Prioritas & Kualitas Udara Karhutla</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Sumber resmi BNPB, Kemenkes (IHCP), dan BPBD Kalteng. Titik hotspot satelit diverifikasi melalui asesmen lapangan.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 text-xs bg-slate-800 p-1.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${filterType === 'all' ? 'bg-[#159A9C] text-white' : 'text-slate-300 hover:text-white'}`}
          >
            Semua ({LOCATIONS.length})
          </button>
          <button
            onClick={() => setFilterType('ispu_critical')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${filterType === 'ispu_critical' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'}`}
          >
            ISPU Berbahaya (Kalteng)
          </button>
          <button
            onClick={() => setFilterType('priority_province')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${filterType === 'priority_province' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'}`}
          >
            Prioritas BNPB
          </button>
        </div>
      </div>

      {/* Grid: Map + Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* Leaflet Container */}
        <div className="lg:col-span-8 relative">
          <div ref={mapContainerRef} className="w-full h-[380px] lg:h-full min-h-[380px] z-10" />
          
          {/* Map legend overlay */}
          <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-md border border-slate-200 text-xs flex flex-col gap-1.5 max-w-[260px]">
            <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">Legenda Indikator</div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
              <span className="text-slate-600">ISPU Kritis &gt; 1200 (Berbahaya)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="text-slate-600">Provinsi Prioritas Darurat BNPB</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#159A9C] inline-block"></span>
              <span className="text-slate-600">Zona Gambut & Pembasahan Sumur Bor</span>
            </div>
          </div>
        </div>

        {/* Selected Location Card */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-slate-50 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                selectedLocation.type === 'ispu_critical' ? 'bg-red-100 text-red-800' :
                selectedLocation.type === 'priority_province' ? 'bg-amber-100 text-amber-800' :
                'bg-teal-100 text-teal-800'
              }`}>
                {selectedLocation.type === 'ispu_critical' ? <ShieldAlert className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5" />}
                {selectedLocation.category || 'Wilayah Pantauan Asesmen'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Tgl: {selectedLocation.date}</span>
            </div>

            <h4 className="text-xl font-bold text-slate-900">{selectedLocation.name}</h4>
            <p className="text-xs font-medium text-slate-500 mb-4">{selectedLocation.province}</p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {selectedLocation.ispu !== undefined && (
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Wind className="w-3.5 h-3.5 text-red-500" />
                    <span>Indeks ISPU</span>
                  </div>
                  <div className="text-lg font-bold text-red-600 mt-0.5">
                    {selectedLocation.ispu !== null ? selectedLocation.ispu : 'Data belum tersedia'}
                  </div>
                  <div className="text-[10px] text-slate-400">Snapshot IHCP 19 Okt</div>
                </div>
              )}

              {selectedLocation.hotspots !== undefined && (
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Hotspot Terdeteksi</span>
                  </div>
                  <div className="text-lg font-bold text-amber-600 mt-0.5">
                    {selectedLocation.hotspots.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-slate-400">Satelit BNPB</div>
                </div>
              )}

              {selectedLocation.burnedAreaHa !== undefined && (
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Luas Terbakar</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">
                    {selectedLocation.burnedAreaHa.toLocaleString('id-ID')} Ha
                  </div>
                  <div className="text-[10px] text-slate-400">Snapshot BNPB 24 Okt</div>
                </div>
              )}

              {selectedLocation.responseAreaHa !== undefined && (
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Dalam Penanganan</div>
                  <div className="text-lg font-bold text-teal-600 mt-0.5">
                    {selectedLocation.responseAreaHa.toLocaleString('id-ID')} Ha
                  </div>
                  <div className="text-[10px] text-slate-400">Armada Lapangan</div>
                </div>
              )}
            </div>

            {/* Assessment note */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 mb-4">
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                Catatan Asesmen Lapangan:
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedLocation.reason}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Sumber Terverifikasi:</span>
                <span className="font-medium text-slate-700">{selectedLocation.source}</span>
              </div>
            </div>

            {/* Quick selector list */}
            <div className="mb-4">
              <label className="text-[11px] font-semibold uppercase text-slate-500 block mb-1.5">
                Pilih Wilayah Lainnya:
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleFocus(loc)}
                    className={`text-xs px-2.5 py-1 rounded-md transition ${
                      selectedLocation.id === loc.id
                        ? 'bg-slate-900 text-white font-medium'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {loc.name.replace('Provinsi ', '').replace('Kab. ', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (onSelectProgram) {
                  onSelectProgram(selectedLocation.suggestedProgramId);
                }
              }}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#F0A43A] to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-[0.99]"
            >
              <Flame className="w-4 h-4" />
              Bantu Warga {selectedLocation.name} Sekarang
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Donasi disalurkan 100% transparan melalui program bantuan prioritas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
