'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { HiPlay, HiPause } from "react-icons/hi2";
import { FaPaperPlane } from "react-icons/fa";
import { IoArrowBackSharp } from 'react-icons/io5';

function formatTime(segundosTotal: number): string {
  if (isNaN(segundosTotal) || segundosTotal < 0) return '00:00';
  const minutos = Math.floor(segundosTotal / 60);
  const segundos = Math.floor(segundosTotal % 60);
  return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

function Mensaje({ texto, propio, fecha }: { texto: string | Blob; propio: boolean; fecha?: string }) {
  const isAudio = texto instanceof Blob;
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [injectedDuration, setInjectedDuration] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
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
        setCurrentTime(0);
        if (audioRef.current) audioRef.current.pause();
      };
    } else {
      setAudioUrl(null);
      setInjectedDuration(null);
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
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
    setCurrentTime(current);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current || injectedDuration === null || injectedDuration === 0) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newTime = (clickX / rect.width) * injectedDuration;

    audioRef.current.currentTime = newTime;
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
    handleTimeUpdate();
  };

  return (
    <div className={`flex ${propio ? 'justify-end' : 'justify-start'} mb-2 px-4`}>
      <div className={`max-w-[80%] w-fit px-4 py-2 rounded-xl text-sm shadow ${propio ? 'bg-green-200 rounded-br-none' : 'bg-white rounded-bl-none'}`}>
        {isAudio && audioUrl ? (
          <div className="flex items-center space-x-2 w-full min-w-[200px]">
            <button onClick={togglePlay} className="text-lg w-6 h-6 flex items-center justify-center">
              {isPlaying ? <HiPause className='h-5 w-5' /> : <HiPlay className='h-5 w-5' />}
            </button>
            <span className="text-xs text-gray-600 min-w-[40px] text-left">{formatTime(currentTime)}</span>
            <div ref={progressBarRef} className="relative flex-1 h-2 bg-gray-300 rounded-full cursor-pointer overflow-hidden" onClick={handleProgressBarClick}>
              <div className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            {injectedDuration !== null && (
              <span className="text-xs text-gray-600 min-w-[40px] text-right">{formatTime(injectedDuration)}</span>
            )}
            <audio ref={audioRef} src={audioUrl} preload="metadata" hidden onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} />
          </div>
        ) : (
          <div className="flex flex-col">
            <span>{typeof texto === 'string' ? texto : ''}</span>
            {fecha && <span className="text-xs text-gray-400 text-right mt-1">{new Date(fecha).toLocaleTimeString()}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function MessageInput({ onSendMessage }: { onSendMessage: (msg: string) => void }) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center p-4 border-t border-gray-200 bg-white text-black">
      <input
        type="text"
        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Escribe tu mensaje..."
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        className="ml-2 px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700"
      >
        <FaPaperPlane />
      </button>
    </div>
  );
}


// --- COMPONENTE PRINCIPAL ---
type MensajeData = {
  id?: number;
  texto: string;
  propio: boolean;
  fecha?: string;
};

export default function ChatIndividualPage() {
  const [mensajes, setMensajes] = useState<MensajeData[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const chatId = params.id!;
  const userId = searchParams.get('usuario')!;
  const nombreContacto = searchParams.get('nombreContacto') ?? 'Contacto';

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const res = await fetch(`/api/mensaje/${chatId}`);
        if (!res.ok) throw new Error('Error al cargar mensajes');
        const data = await res.json();

        const mensajesFormateados = data.map((m: any) => ({
          id: m.id_mensaje,
          texto: m.contenido,
          propio: String(m.id_emisor) === userId,
          fecha: m.fecha
        }));

        setMensajes(mensajesFormateados);
      } catch (err) {
        console.error('Error al cargar mensajes:', err);
        alert('No se pudieron cargar los mensajes.');
      }
    };

    fetchMensajes();
  }, [chatId, userId]);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [mensajes]);

  const enviarMensaje = async (contenido: string) => {
    if (!userId || !chatId) return;

    try {
      const res = await fetch('/api/mensaje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_chat: Number(chatId),
          id_emisor: Number(userId),
          contenido,
        }),
      });

      if (!res.ok) throw new Error('Error al enviar el mensaje');

      setMensajes((prev) => [
        ...prev,
        { texto: contenido, propio: true, id: Date.now(), fecha: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      alert('No se pudo enviar el mensaje.');
    }
  };

  const volverAChats = () => {
    if (userId) {
      router.push(`/paginas/chats/${userId}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#e5ddd5]">
      <div className="bg-[#4CAF50] text-white p-4 font-bold text-xl flex items-center gap-4">
        <button onClick={volverAChats} className="text-white hover:text-gray-200 text-2xl">
          <IoArrowBackSharp />
        </button>
        {nombreContacto}
      </div>

      <div ref={chatRef} className="flex-1 overflow-y-auto pt-4 pb-2 px-2">
        {mensajes.map((m, i) => (
          <Mensaje key={m.id ?? `${m.texto}-${i}`} texto={m.texto} propio={m.propio} fecha={m.fecha} />
        ))}
      </div>

      <MessageInput onSendMessage={enviarMensaje} />
    </div>
  );
}
