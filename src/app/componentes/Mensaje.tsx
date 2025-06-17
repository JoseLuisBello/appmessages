import { useEffect, useState, useRef } from 'react';
import { HiPlay, HiPause } from "react-icons/hi2";


type MensajeProps = {
  texto: string | Blob;
  propio: boolean;
};

// Función para formatear segundos a MM:SS
function formatTime(segundosTotal: number): string {
  if (isNaN(segundosTotal) || segundosTotal < 0) {
    return '00:00'; // Manejar casos inválidos
  }
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
  const [currentTime, setCurrentTime] = useState(0); // Nuevo estado para el tiempo actual
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

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
        setCurrentTime(0); // Restablecer el tiempo actual
        if (audioRef.current) {
          audioRef.current.pause();
        }
      };
    } else {
      setAudioUrl(null);
      setInjectedDuration(null);
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0); // Restablecer el tiempo actual
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
    const total = injectedDuration ?? audioRef.current?.duration ?? 0;
    const percent = total > 0 ? Math.min((current / total) * 100, 100) : 0;
    setProgress(percent);
    setCurrentTime(current); // Actualizar el estado del tiempo actual
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0); // Resetear el tiempo actual a 0 al finalizar
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current || injectedDuration === null || injectedDuration === 0) return;

    const progressBarRect = progressBarRef.current.getBoundingClientRect();
    const clickX = event.clientX - progressBarRect.left;
    const progressBarWidth = progressBarRect.width;

    const clickPercent = (clickX / progressBarWidth);
    const newTime = clickPercent * injectedDuration;

    audioRef.current.currentTime = newTime;
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
    handleTimeUpdate(); // Actualizar el progreso y el tiempo inmediatamente
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
          <div className="flex items-center space-x-2 w-full min-w-[200px]">
            {/* Botón reproducir/pausar */}
            <button
              onClick={togglePlay}
              className="text-lg text-black focus:outline-none w-6 h-6 flex items-center justify-center"
            >
              {isPlaying ? (
                <HiPause className='h-5 w-5'/>
              ) : (
                <HiPlay className='h-5 w-5'/>
              )}
            </button>

            {/* Tiempo actual del audio */}
            <span className="text-xs text-gray-600 min-w-[40px] text-left">
              {formatTime(currentTime)}
            </span>

            {/* Barra de progreso */}
            <div
              ref={progressBarRef}
              className="relative flex-1 h-2 bg-gray-300 rounded-full cursor-pointer overflow-hidden"
              onClick={handleProgressBarClick}
            >
              <div
                className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Duración total */}
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