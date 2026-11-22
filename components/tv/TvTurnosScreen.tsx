import { useState, useEffect, useMemo, useRef } from 'react';
import { Tv, Users, Volume2, VolumeX, RefreshCw, DoorClosed, Stethoscope, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AppLogoMark } from '../FastyTurnLogo';
import { COUNTDOWN_SECONDS } from '../../types';

const POLL_MS = 2000;

interface QueueAppointment {
  id: string;
  patient_name: string;
  ticket_number: number;
  status: string;
  doctor_name: string | null;
  doctor_specialty: string | null;
  called_at: number | null;
}

interface NextTurn {
  ticketNumber: number;
  patientName: string;
  doctorName: string;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function TvTurnosScreen() {
  const [now, setNow] = useState(Date.now());
  const [called, setCalled] = useState<QueueAppointment[]>([]);
  const [nextTurns, setNextTurns] = useState<NextTurn[]>([]);
  const [sedeName, setSedeName] = useState('Centro de Atención');
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);

  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  // Last appointment id announced by voice, to avoid repeating
  const announcedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch sede name
  useEffect(() => {
    const fetchSede = async () => {
      const { data } = await supabase
        .from('sede_config')
        .select('name')
        .eq('id', 1)
        .maybeSingle();
      if (data) setSedeName((data as { name: string }).name);
    };
    fetchSede();
  }, []);

  // Real-time: poll appointments + queue
  useEffect(() => {
    let cancelled = false;

    const fetchQueue = async () => {
      // All today's queue activity: called patients, waiting and in-attendance
      const { data, error: err } = await supabase
        .from('appointments')
        .select('id, patient_name, ticket_number, status, doctor_name, doctor_specialty, called_at')
        .in('status', ['called', 'checked-in', 'rescheduled', 'in-attendance'])
        .order('ticket_number', { ascending: true });

      if (cancelled) return;
      if (err) {
        setLoading(false);
        return;
      }

      const rows = (data ?? []) as QueueAppointment[];
      const calledNow = rows.filter((r) => r.status === 'called');
      setCalled(calledNow);
      setLoading(false);

      // Announce new calls by voice
      if (!mutedRef.current) {
        for (const c of calledNow) {
          if (!announcedRef.current.has(c.id)) {
            announcedRef.current.add(c.id);
            announceCall(c);
          }
        }
      }

      // Next 2 turns: waiting patients (checked-in / rescheduled) after current tickets
      const waiting = rows
        .filter((r) => r.status === 'checked-in' || r.status === 'rescheduled')
        .sort((a, b) => a.ticket_number - b.ticket_number);
      setNextTurns(
        waiting.slice(0, 2).map((r) => ({
          ticketNumber: r.ticket_number,
          patientName: r.patient_name,
          doctorName: r.doctor_name ?? 'Médico por asignar',
        })),
      );
    };

    const announceCall = (c: QueueAppointment) => {
      try {
        // Chime
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          const start = ctx.currentTime + i * 0.18;
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.5);
        });

        // Voice announcement (Spanish)
        const utter = new SpeechSynthesisUtterance(
          `Turno ${c.ticket_number}, ${c.patient_name}, por favor pasar con el doctor ${c.doctor_name ?? 'de turno'}`,
        );
        utter.lang = 'es-ES';
        utter.rate = 0.95;
        window.speechSynthesis.speak(utter);
      } catch {
        // audio not available
      }
    };

    fetchQueue();
    const timer = setInterval(fetchQueue, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (next) {
        window.speechSynthesis?.cancel();
      }
      return next;
    });
  };

  const countdownFor = (c: QueueAppointment): number => {
    const end = c.called_at ? c.called_at + COUNTDOWN_SECONDS * 1000 : 0;
    return Math.max(0, Math.floor((end - now) / 1000));
  };

  const gridCols = called.length >= 3 ? 'lg:grid-cols-3' : called.length === 2 ? 'lg:grid-cols-2' : '';

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-950/50 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
            <AppLogoMark size={32} className="" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Sala de Espera</p>
            <h1 className="text-xl font-extrabold leading-tight">{sedeName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-full w-full rounded-full bg-emerald-500" />
            </span>
            En vivo
          </div>
          <button
            onClick={toggleMute}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 active:scale-95 transition-all"
            aria-label={muted ? 'Activar audio' : 'Silenciar audio'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{muted ? 'Audio apagado' : 'Audio encendido'}</span>
          </button>
          <div className="flex items-center gap-2 text-slate-400">
            <Tv className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">TV-Turnos</span>
          </div>
        </div>
      </header>

      {/* Called cards */}
      <main className="flex-1 flex flex-col justify-center p-6 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center">
            <RefreshCw className="w-10 h-10 text-blue-400 animate-spin" />
          </div>
        ) : called.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-3xl bg-slate-800 flex items-center justify-center mb-6">
              <DoorClosed className="w-12 h-12 text-slate-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-300 mb-2">Esperando pacientes</h2>
            <p className="text-lg text-slate-500">No hay llamados activos en este momento</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${gridCols} mx-auto w-full max-w-6xl`}>
            {called.map((c) => {
              const remaining = countdownFor(c);
              const urgent = remaining <= 60;
              return (
                <div
                  key={c.id}
                  className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-3xl p-8 shadow-2xl shadow-blue-900/40 ring-1 ring-white/10 animate-bounce-in"
                >
                  <div className="flex items-center gap-2 text-blue-300 text-sm font-bold uppercase tracking-widest mb-4">
                    <Volume2 className="w-4 h-4" />
                    Pasar a consulta
                  </div>

                  {/* Ticket number — huge */}
                  <div className="text-8xl font-extrabold tracking-tight leading-none mb-4 tabular-nums">
                    {pad(c.ticket_number)}
                  </div>

                  {/* Patient name — full, no cédula */}
                  <div className="text-3xl font-extrabold leading-tight mb-5">{c.patient_name}</div>

                  {/* Doctor / specialty */}
                  <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-tight">{c.doctor_name ?? 'Médico de turno'}</p>
                      {c.doctor_specialty && (
                        <p className="text-sm text-blue-200">{c.doctor_specialty}</p>
                      )}
                    </div>
                  </div>

                  {/* Countdown */}
                  <div className="flex items-center justify-between bg-white/10 rounded-2xl px-4 py-3">
                    <span className="text-sm font-semibold text-blue-200 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Tiempo para pasar
                    </span>
                    <span
                      className={`text-3xl font-extrabold font-mono tabular-nums ${urgent ? 'text-red-400' : 'text-white'}`}
                    >
                      {Math.floor(remaining / 60)}:{pad(remaining % 60)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Next turns panel */}
      <footer className="shrink-0 px-6 pb-6">
        <div className="max-w-6xl mx-auto bg-slate-800/60 border border-slate-700 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-slate-200 uppercase tracking-widest text-sm">Próximos en turno</h2>
          </div>
          {nextTurns.length === 0 ? (
            <p className="text-slate-500 text-sm">No hay pacientes en espera con check-in.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {nextTurns.map((t) => (
                <div
                  key={t.ticketNumber}
                  className="flex items-center gap-4 bg-slate-900/70 rounded-2xl px-5 py-4 border border-slate-700"
                >
                  <div className="text-4xl font-extrabold text-blue-400 tabular-nums">{pad(t.ticketNumber)}</div>
                  <div className="min-w-0">
                    <p className="font-bold text-xl text-white truncate">{t.patientName}</p>
                    <p className="text-sm text-slate-400 truncate">con {t.doctorName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
