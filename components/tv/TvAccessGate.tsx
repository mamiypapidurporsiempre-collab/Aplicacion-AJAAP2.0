import { useState } from 'react';
import { Lock, AlertTriangle, MonitorPlay } from 'lucide-react';
import { AppLogoMark } from '../FastyTurnLogo';

export const TV_ACCESS_STORAGE_KEY = 'tv-access-ok';

export function getTvAccessCode(): string {
  return import.meta.env.VITE_TV_ACCESS_CODE || '05062023';
}

export function isTvUnlocked(): boolean {
  try {
    return sessionStorage.getItem(TV_ACCESS_STORAGE_KEY) === getTvAccessCode();
  } catch {
    return false;
  }
}

export function unlockTv(code: string): boolean {
  if (code.trim() === getTvAccessCode()) {
    try {
      sessionStorage.setItem(TV_ACCESS_STORAGE_KEY, getTvAccessCode());
    } catch {
      // sessionStorage unavailable; unlock only for this render
    }
    return true;
  }
  return false;
}

interface TvAccessGateProps {
  screenName: string;
  onUnlocked: () => void;
}

export function TvAccessGate({ screenName, onUnlocked }: TvAccessGateProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockTv(code)) {
      setError('');
      onUnlocked();
    } else {
      setError('Clave incorrecta. Acceso denegado.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/10 mb-4">
            <AppLogoMark size={40} className="" />
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MonitorPlay className="w-5 h-5 text-blue-400" />
            {screenName}
          </h1>
          <p className="text-sm text-slate-400 mt-1">Ingresa la clave de acceso para continuar</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">
              Clave de acceso
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                inputMode="numeric"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                autoFocus
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                           outline-none transition-all text-white text-lg tracking-wider font-mono"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl
                       hover:bg-blue-500 active:scale-[0.98] transition-all"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
