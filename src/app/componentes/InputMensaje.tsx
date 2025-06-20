'use client';

import { useState, useRef } from 'react';
import { FaPaperPlane } from "react-icons/fa6";
import { BiSolidMicrophone } from "react-icons/bi";

type Props = {
  onEnviar: (mensaje: { tipo: 'texto' | 'audio'; contenido: string | Blob }) => void;
};

export default function InputMensaje({ onEnviar }: Props) {
  const [mensaje, setMensaje] = useState('');
  const [grabando, setGrabando] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordStartTimeRef = useRef<number | null>(null);

  const handleEnviar = () => {
    if (mensaje.trim() === '') return;
    onEnviar({ tipo: 'texto', contenido: mensaje.trim() });
    setMensaje('');
  };

  const comenzarGrabacion = async () => {
    if (grabando) return; // evitar iniciar otra grabación si ya está grabando

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordStartTimeRef.current = Date.now();
      setGrabando(true);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        if (recordStartTimeRef.current !== null) {
          const durMs = Date.now() - recordStartTimeRef.current;
          const durSec = durMs / 1000;
          try {
            (audioBlob as any).recordedDuration = durSec;
          } catch {}
        }

        onEnviar({ tipo: 'audio', contenido: audioBlob });

        // Detener tracks para liberar recursos
        stream.getTracks().forEach(track => track.stop());

        // Limpiar referencias
        mediaRecorderRef.current = null;
        recordStartTimeRef.current = null;
        setGrabando(false);
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('Error al acceder al micrófono', error);
      setGrabando(false);
    }
  };

  const detenerGrabacion = () => {
    if (mediaRecorderRef.current && grabando) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-white text-black shadow-inner">
      <input
        type="text"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder="Escribe un mensaje"
        className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
        disabled={grabando} // opcional para no permitir escribir mientras graba
        aria-label="Escribe un mensaje"
      />

      {mensaje.trim() ? (
        <button
          onClick={handleEnviar}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50"
          disabled={grabando} // evitar enviar mientras graba
          aria-label="Enviar mensaje de texto"
        >
          <FaPaperPlane />
        </button>
      ) : (
        <button
          onMouseDown={comenzarGrabacion}
          onMouseUp={detenerGrabacion}
          onTouchStart={comenzarGrabacion}
          onTouchEnd={detenerGrabacion}
          className={`p-2 rounded-full hover:bg-gray-300 ${grabando ? 'bg-red-400' : 'bg-gray-200'}`}
          disabled={grabando && !mediaRecorderRef.current} // evitar bugs raros
          aria-label={grabando ? 'Grabando...' : 'Grabar mensaje de voz'}
        >
          <BiSolidMicrophone />
        </button>
      )}
    </div>
  );
}
