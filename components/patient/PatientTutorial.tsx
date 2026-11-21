import { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
  QrCode,
  Bell,
  Users,
  Stethoscope,
  Clock,
  MapPin,
  CreditCard,
  BellOff,
  XCircle,
  Volume2,
} from 'lucide-react';

interface PatientTutorialProps {
  onClose: () => void;
}

// Vista simulada de la tarjeta de turno que se muestra en la sala de espera
function TicketPreview() {
  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-600 text-white p-4 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/70">Tu número de turno</p>
          <div className="text-4xl font-extrabold tracking-tight">#05</div>
        </div>
        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
      </div>
      <div className="h-px bg-white/20 my-3" />
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/80">Pacientes antes que tú</span>
        <span className="font-bold">3</span>
      </div>
    </div>
  );
}

// Vista simulada de la alerta de llamado con cuenta regresiva
function CalledPreview() {
  return (
    <div className="rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white p-4 shadow text-center">
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
        <Bell className="w-5 h-5" />
      </div>
      <p className="font-extrabold text-sm">¡Has sido llamado!</p>
      <div className="inline-flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5 mt-2">
        <span className="text-2xl font-extrabold font-mono">04:32</span>
      </div>
      <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-white/80">
        <Volume2 className="w-3 h-3" />
        <span>Suena y vibra durante el llamado</span>
      </div>
    </div>
  );
}

interface Step {
  icon: typeof CalendarPlus;
  title: string;
  bullets: string[];
  preview?: 'ticket' | 'called';
}

const STEPS: Step[] = [
  {
    icon: CalendarPlus,
    title: '1. Agendar cita',
    bullets: [
      'En el panel del paciente presiona "Agendar cita".',
      'Elige la especialidad y el médico que atiende ese día.',
      'Selecciona un día verde del calendario y luego la hora disponible.',
      'Si necesitas cancelar, hazlo desde tu cita con al menos 2 días de anticipación.',
    ],
  },
  {
    icon: QrCode,
    title: '2. Check-in (confirmar llegada)',
    bullets: [
      'Llega al centro de salud el día de tu cita.',
      'Según la sede, confirma tu llegada con GPS (verifica tu ubicación) o con el PIN/QR que aparece en la pantalla de la sala.',
      'Al confirmar, obtienes tu número de turno oficial y entras a la fila.',
    ],
  },
  {
    icon: Users,
    title: '3. Sala de espera',
    bullets: [
      'Verás tu número de turno y cuántos pacientes van delante de ti.',
      'El número de turno en atención se muestra siempre, sin datos personales de otros pacientes.',
      'Cuando llegue tu turno, verás la alerta de llamado con cuenta regresiva de 5 minutos.',
      'La alerta suena y vibra continuamente; puedes silenciarla con el botón "Entendido / Silenciar".',
    ],
    preview: 'ticket',
  },
  {
    icon: Bell,
    title: '4. Notificaciones y cancelación',
    bullets: [
      'Al entrar, la app te pide permiso para enviarte notificaciones del navegador; acéptalas para no perderte el llamado.',
      'Si las rechazaste, actívalas desde la configuración del navegador.',
      'Si cancelas tu cita, debes dirigirte con secretaría para agendarla nuevamente; la app no permite re-agendarla por ti mismo.',
    ],
  },
];

export function PatientTutorial({ onClose }: PatientTutorialProps) {
  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-slide-up px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <current.icon className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="font-bold text-slate-800">{current.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            aria-label="Cerrar tutorial"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <ul className="space-y-2.5">
            {current.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          {current.preview === 'ticket' && <TicketPreview />}
          {current.preview === 'called' && <CalledPreview />}

          {step === STEPS.length - 1 && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5">
              <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                Este tutorial es solo una guía: no modifica tus citas ni datos reales.
              </p>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="px-5 pb-5 pt-1 flex items-center justify-between gap-3">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500
                       px-4 py-2.5 rounded-xl hover:bg-slate-100 active:scale-[0.98] transition-all
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? 'w-5 bg-blue-700' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>

          {isLast ? (
            <button
              onClick={onClose}
              className="bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl
                         hover:bg-blue-800 active:scale-[0.98] transition-all"
            >
              ¡Listo!
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="inline-flex items-center gap-1.5 bg-blue-700 text-white text-sm font-semibold
                         px-5 py-2.5 rounded-xl hover:bg-blue-800 active:scale-[0.98] transition-all"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
