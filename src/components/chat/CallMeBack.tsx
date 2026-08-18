import { FormEvent, useState } from 'react';
import { ownApi } from '../../utils/ownApi';

type Props = {
  source?: string;
  interest?: string;
  compact?: boolean;
};

export default function CallMeBack({ source = 'shop', interest = '', compact = false }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(true);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!consent) {
      setError('Necesitamos tu permiso para llamarte.');
      return;
    }
    setBusy(true);
    try {
      await ownApi('/api/leads', {
        name,
        phone,
        source,
        interest,
        consent_call: true,
        message: 'Callback voz Groq / MundoSMS',
      });
      setDone(true);
    } catch {
      setError('No se pudo pedir la llamada. Prueba WhatsApp +34 744 403 191.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <p className={`text-sm ${compact ? 'text-gray-200' : 'text-green-700'} font-semibold`}>
        Te llamamos ahora desde 848 681 101. Si no puedes coger, te dejamos SMS.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={compact ? 'space-y-2' : 'space-y-3'}>
      {!compact && (
        <p className="text-sm text-gray-600">
          Te llama el asistente de HairyPetShop. Distendido, sin comercial: si encaja, te manda el pago por SMS.
        </p>
      )}
      <input
        required
        name="name"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none"
      />
      <input
        required
        name="phone"
        type="tel"
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none"
      />
      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        Acepto que el asistente de voz de HairyPetShop me llame desde 848 681 101 (MundoSMS).
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full bg-[#1a1f2e] text-orange-400 font-bold py-2.5 rounded-xl border-none cursor-pointer disabled:opacity-50"
      >
        {busy ? 'Llamando…' : 'Llámame ahora'}
      </button>
    </form>
  );
}
