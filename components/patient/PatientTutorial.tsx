import { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Users,
  Stethoscope,
  Clock,
  MapPin,
  Calendar,
  FileText,
  User,
  CreditCard,
  Hash,
  QrCode,
  CheckCircle2,
  Navigation,
  Volume2,
  XCircle,
  Lock,
} from 'lucide-react';

interface PatientTutorialProps {
  onClose: () => void;
}

// Réplica de la tarjeta de cita asignada (AppointmentDetailCard)
function AssignedAppointmentPreview() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Stethoscope className="w-6 h-6 text-blue-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 truncate">Dr. Juan Pérez</p>
          <p className="text-sm text-blue-700">Medicina General</p>
        </div>
      </div>
      <div className="h-px bg-slate-100" />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Fecha</p>
            <p className="text-sm font-semibold text-slate-800">Vie 27 Nov 2026</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Hora</p>
            <p className="text-sm font-semibold text-slate-800">9:00 AM</p>
            <p className="text-[10px] text-slate-400">Intervalo de 30 min</p>
          </div>
        </div>
      </div>
      <div className="h-px bg-slate-100" />
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Paciente</p>
            <p className="text-sm font-semibold text-slate-800">María García</p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <CreditCard className="w-3 h-3" /> CC: 123456789
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Turno</p>
          <p className="text-lg font-bold text-blue-700">#05</p>
        </div>
      </div>
      <div className="rounded-xl px-4 py-3 text-sm font-semibold text-center bg-amber-50 text-amber-700">
        Programada - Pendiente de llegada / Check-in
      </div>
      <div className="flex items-start gap-2.5 bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-amber-800">
          Se sugiere llegar con 30 minutos de anticipación a su cita.
        </p>
      </div>
    </div>
  );
}

// Réplica del módulo de check-in con las 3 pestañas (GPS / PIN / QR)
function CheckInPreview() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
      <h4 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
        <CheckCircle2 className="w-4 h-4 text-blue-700" />
        Realizar Check-in
      </h4>
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
        {[
          { key: 'gps', label: 'GPS', icon: MapPin },
          { key: 'pin', label: 'PIN', icon: Hash },
          { key: 'qr', label: 'QR', icon: QrCode },
        ].map((t, i) => (
          <div
            key={t.key}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-semibold ${
              i === 1 ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </div>
        ))}
      </div>
      {/* PIN de 4 dígitos como en la pantalla TV */}
      <div className="flex flex-col items-center gap-2 py-1">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <Hash className="w-3.5 h-3.5" />
          Código PIN
        </div>
        <div className="flex gap-2">
          {['4', '7', '2', '9'].map((d, i) => (
            <div
              key={i}
              className="w-11 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-extrabold text-blue-400 font-mono"
            >
              {d}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 text-center">
          Aparece rotando en la pantalla TV de la sala
        </p>
      </div>
    </div>
  );
}

// Réplica de la tarjeta de turno de la sala de espera (solo números, por privacidad)
function TicketPreview() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-blue-600 text-white p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-white/70">Tu número de turno</p>
            <div className="text-5xl font-extrabold tracking-tight mt-1">#05</div>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
        </div>
        <div className="h-px bg-white/20 mb-4" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Estado</span>
            <span className="font-bold">En fila de espera</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Pacientes antes que tú</span>
            <span className="font-bold text-lg">3</span>
          </div>
        </div>
      </div>
      {/* Turno en consulta — solo número */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-center shadow-md">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/80 mb-1 flex items-center justify-center gap-1.5">
          <Stethoscope className="w-3.5 h-3.5" />
          En consulta ahora
        </p>
        <div className="text-3xl font-extrabold tracking-tight">#04</div>
        <p className="text-white/85 text-[11px] mt-1">Solo números: privacidad de los demás pacientes</p>
      </div>
    </div>
  );
}

// Réplica de la alerta de llamado con cuenta regresiva y silenciar
function CalledPreview() {
  return (
    <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl p-5 shadow-lg text-white text-center">
      <div className="relative inline-block mb-3">
        <div className="relative w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto">
          <Bell className="w-7 h-7" />
        </div>
      </div>
      <h4 className="text-xl font-extrabold mb-1">¡Has sido llamado!</h4>
      <p className="text-white/90 text-sm mb-3">Presentáte en el cubículo de atención</p>
      <div className="inline-flex items-center gap-2 bg-white/15 rounded-2xl px-4 py-2.5 mb-3">
        <span className="text-3xl font-extrabold font-mono tracking-tight">04:32</span>
      </div>
      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-white rounded-full" style={{ width: '35%' }} />
      </div>
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/85 mb-3">
        <Volume2 className="w-3.5 h-3.5" />
        <span>Suena y vibra continuamente durante 5 minutos</span>
      </div>
      <div className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-4 py-2 rounded-xl">
        <X className="w-4 h-4" />
        Entendido / Silenciar
      </div>
    </div>
  );
}

// Réplica del botón de cancelar y la advertencia de secretaría
function CancelPreview() {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400">Cita programada</p>
            <p className="text-sm font-semibold text-slate-800">Dr. Juan Pérez · Vie 27 Nov</p>
          </div>
        </div>
        <div className="w-full bg-rose-50 text-rose-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 border border-rose-200 text-sm">
          <XCircle className="w-4 h-4" />
          Cancelar Cita
        </div>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-3">
          <XCircle className="w-6 h-6 text-rose-500" />
        </div>
        <p className="font-bold text-slate-800 mb-2 text-sm">¿Está seguro de cancelar la cita?</p>
        <p className="text-sm text-slate-500">
          Recuerde que para agendarla nuevamente tiene que dirigirse con secretaría.
        </p>
        <div className="flex gap-3 mt-4">
          <div className="flex-1 bg-slate-100 text-slate-600 font-semibold py-2.5 rounded-xl text-sm">
            No, mantener
          </div>
          <div className="flex-1 bg-rose-500 text-white font-semibold py-2.5 rounded-xl text-sm">
            Sí, cancelar
          </div>
        </div>
      </div>
    </div>
  );
}

interface Step {
  icon: typeof Bell;
  title: string;
  bullets: string[];
  preview: 'appointment' | 'checkin' | 'ticket' | 'called' | 'cancel';
}

const STEPS: Step[] = [
  {
    icon: Bell,
    title: 'Tu cita asignada',
    bullets: [
      'Secretaría asigna tu cita: aquí ves el médico, la fecha, la hora y tu paciente.',
      'La tarjeta muestra el estado de tu cita y cuánto falta para tu turno.',
      'Al entrar a la app, acepta las notificaciones del navegador: son necesarias para avisarte cuando llegue tu turno.',
      'Si las rechazaste, actívalas desde la configuración de tu navegador.',
    ],
    preview: 'appointment',
  },
  {
    icon: CheckCircle2,
    title: 'Confirmar llegada (Check-in)',
    bullets: [
      'Llega al centro de salud el día de tu cita, con 30 minutos de anticipación.',
      'Registra tu llegada con GPS (verifica tu ubicación), con el PIN de 4 dígitos o el código QR que muestra la pantalla TV de la sala.',
      'Al confirmar, obtienes tu número de turno oficial y entras a la fila de espera.',
    ],
    preview: 'checkin',
  },
  {
    icon: Users,
    title: 'Sala de espera en tiempo real',
    bullets: [
      'Tu tarjeta muestra tu número de turno, tu estado y cuántos pacientes van delante de ti.',
      'También verás el turno que está en consulta en ese momento, actualizado al instante.',
      'Por privacidad, solo se muestran números de turno, nunca los datos de otros pacientes.',
    ],
    preview: 'ticket',
  },
  {
    icon: Bell,
    title: 'Llamado a consulta (5 minutos)',
    bullets: [
      'Cuando llegue tu turno, verás una alerta en pantalla con tu llamada y una cuenta regresiva de 5 minutos.',
      'La alerta suena y vibra continuamente para que la notes aunque el teléfono esté en silencio.',
      'Presiona "Entendido / Silenciar" para detener el sonido y la vibración, y dirígete al cubículo.',
    ],
    preview: 'called',
  },
  {
    icon: XCircle,
    title: 'Cancelar cita',
    bullets: [
      'Si ya no puedes asistir, usa el botón "Cancelar Cita" de tu tarjeta (con al menos 2 días de anticipación).',
      'La app te pedirá confirmar antes de cancelar.',
      'Importante: para agendar nuevamente debes dirigirte con secretaría; la app no permite reagendar por tu cuenta.',
    ],
    preview: 'cancel',
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

          {current.preview === 'appointment' && <AssignedAppointmentPreview />}
          {current.preview === 'checkin' && <CheckInPreview />}
          {current.preview === 'ticket' && <TicketPreview />}
          {current.preview === 'called' && <CalledPreview />}
          {current.preview === 'cancel' && <CancelPreview />}

          {isLast && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5">
              <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
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
              Entendido
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
