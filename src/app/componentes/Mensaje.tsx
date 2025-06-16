// Mensaje.tsx
import { useEffect, useState } from 'react';

type MensajeProps = {
  texto: string | Blob;
  propio: boolean;
};

function formatTime(segundosTotal: number): string {
  const minutos = Math.floor(segundosTotal / 60);
  const segundos = Math.floor(segundosTotal % 60);
  const mm = minutos.toString().padStart(2, '0');
  const ss = segundos.toString().padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function Mensaje({ texto, propio }: MensajeProps) {
  const isAudio = texto instanceof Blob;
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Estado local para duración inyectada
  const [injectedDuration, setInjectedDuration] = useState<number | null>(null);

  useEffect(() => {
    if (isAudio) {
      // Creamos object URL cuando llega el Blob
      const url = URL.createObjectURL(texto);
      setAudioUrl(url);

      // Si el Blob tiene la propiedad recordedDuration, la capturamos:
      const dur = (texto as any).recordedDuration;
      if (typeof dur === 'number' && isFinite(dur) && dur >= 0) {
        setInjectedDuration(dur);
      } else {
        setInjectedDuration(null);
      }

      return () => {
        URL.revokeObjectURL(url);
        setAudioUrl(null);
        setInjectedDuration(null);
      };
    } else {
      setAudioUrl(null);
      setInjectedDuration(null);
    }
  }, [texto, isAudio]);

  return (
    <div className={`flex ${propio ? 'justify-end' : 'justify-start'} mb-2 px-4`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-xl text-sm shadow ${
          propio
            ? 'bg-green-200 text-black rounded-br-none'
            : 'bg-white text-black rounded-bl-none'
        }`}
      >
        {isAudio && audioUrl ? (
          <div className="flex flex-col space-y-1">
            <audio controls preload="metadata" src={audioUrl} />
            {injectedDuration !== null && (
              <span className="text-xs text-gray-600">
                Duración: {formatTime(injectedDuration)}
              </span>
            )}
          </div>
        ) : (
          // Aseguramos que TypeScript vea esto como ReactNode válido:
          typeof texto === 'string' ? <span>{texto}</span> : null
        )}
      </div>
    </div>
  );
}
