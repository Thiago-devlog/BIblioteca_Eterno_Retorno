import React, { useState } from 'react';
import { usePWAInstall, useOnlineStatus } from './usePWAInstall';
import { Download, WifiOff, X } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-sans font-medium text-white shadow-xl border border-slate-700 animate-in fade-in duration-200">
      <WifiOff className="w-3.5 h-3.5 text-amber-400" />
      <span>Modo Offline Ativo — Leitura 100% preservada em cache</span>
    </div>
  );
};

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="px-3 py-1.5 rounded-full bg-black hover:bg-slate-800 text-white text-[11px] font-sans font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
        title="Instalar como aplicativo no seu dispositivo"
      >
        <Download className="w-3.5 h-3.5 text-amber-400" />
        <span>Instalar App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 text-[11px] font-sans font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-left text-slate-900">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-display text-base font-bold">Instalar no iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                1. Toque no botão <strong>Compartilhar</strong> na barra inferior do Safari.<br />
                2. Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-black py-2.5 text-xs font-bold font-sans text-white"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
