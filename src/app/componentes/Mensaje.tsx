import { useEffect, useState, useRef } from 'react';

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
  const [injectedDuration, setInjectedDuration] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null); // Ref para la barra de progreso

  useEffect(() => {
    if (isAudio) {
      const url = URL.createObjectURL(texto);
      setAudioUrl(url);

      const dur = (texto as any).recordedDuration;
      if (typeof dur === 'number' && isFinite(dur) && dur >= 0) {
        setInjectedDuration(dur);
      } else {
        const tempAudio = new Audio(url);
        tempAudio.addEventListener('loadedmetadata', () => {
          setInjectedDuration(tempAudio.duration);
        });
      }

      return () => {
        URL.revokeObjectURL(url);
        setAudioUrl(null);
        setInjectedDuration(null);
        setIsPlaying(false);
        setProgress(0);
        // Pausar el audio si se desmonta el componente
        if (audioRef.current) {
          audioRef.current.pause();
        }
      };
    } else {
      setAudioUrl(null);
      setInjectedDuration(null);
      setIsPlaying(false);
      setProgress(0);
    }
  }, [texto, isAudio]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const current = audioRef.current?.currentTime ?? 0;
    const total = injectedDuration ?? audioRef.current?.duration ?? 0; // Usar 0 si no hay duración (evitar divisiones por cero)
    
    // Asegurarse de que total sea mayor que 0 para evitar NaN o Infinity
    const percent = total > 0 ? Math.min((current / total) * 100, 100) : 0;
    setProgress(percent);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    // Opcional: reiniciar el audio al principio al finalizar
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current || injectedDuration === null) return;

    const progressBarRect = progressBarRef.current.getBoundingClientRect();
    const clickX = event.clientX - progressBarRect.left;
    const progressBarWidth = progressBarRect.width;

    const clickPercent = (clickX / progressBarWidth);
    const newTime = clickPercent * injectedDuration;

    audioRef.current.currentTime = newTime;
    // Si no estaba reproduciendo, inicia la reproducción al hacer clic en la barra
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
    handleTimeUpdate(); // Actualizar el progreso inmediatamente
  };

  return (
    <div className={`flex ${propio ? 'justify-end' : 'justify-start'} mb-2 px-4`}>
      <div
        className={`max-w-[80%] w-fit px-4 py-2 rounded-xl text-sm shadow ${
          propio
            ? 'bg-green-200 text-black rounded-br-none'
            : 'bg-white text-black rounded-bl-none'
        }`}
      >
        {isAudio && audioUrl ? (
          <div className="flex items-center space-x-2 w-full min-w-[200px]"> {/* Añadido min-w para asegurar el espacio */}
            {/* Botón reproducir/pausar */}
            <button
              onClick={togglePlay}
              className="text-lg text-black focus:outline-none w-6 h-6 flex items-center justify-center" // Ajustado tamaño y centrado
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Barra de progreso */}
            <div
              ref={progressBarRef} // Asignar la ref
              className="relative flex-1 h-2 bg-gray-300 rounded-full cursor-pointer overflow-hidden" // Mejor contraste y redondeado
              onClick={handleProgressBarClick}
            >
              <div
                className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-100" // Color más brillante y redondeado
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Duración */}
            {injectedDuration !== null && (
              <span className="text-xs text-gray-600 min-w-[40px] text-right">
                {formatTime(injectedDuration)}
              </span>
            )}

            {/* Audio oculto */}
            <audio
              ref={audioRef}
              src={audioUrl}
              preload="metadata"
              hidden
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
            />
          </div>
        ) : (
          typeof texto === 'string' ? <span>{texto}</span> : null
        )}
      </div>
    </div>
  );
}