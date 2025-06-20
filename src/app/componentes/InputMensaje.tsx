// InputMensaje.tsx
'use client';

import { useState, useRef } from 'react';
import { FaPaperPlane } from "react-icons/fa6";
import { BiSolidMicrophone } from "react-icons/bi";

type Props = {
  onEnviar: (mensaje: string | Blob) => void;
};

export default function InputMensaje({ onEnviar }: Props) {
  const [mensaje, setMensaje] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordStartTimeRef = useRef<number | null>(null);

  const handleEnviar = () => {
    if (mensaje.trim() === '') return;
    onEnviar(mensaje.trim());
    setMensaje('');
  };

  const comenzarGrabacion = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordStartTimeRef.current = Date.now();

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

        // Enviar al componente
        onEnviar(audioBlob);

        // 🔽 Enviar al backend para guardar
        enviarAudioAlServidor(audioBlob);

        stream.getTracks().forEach(track => track.stop());
        recordStartTimeRef.current = null;
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('Error al acceder al micrófono', error);
    }
  };

  const detenerGrabacion = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // Función para enviar el audio al servidor
  const enviarAudioAlServidor = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('id_chat', '1'); // Usa el id real del chat
    formData.append('id_emisor', '1'); // Usa el id real del emisor
  
    try {
      await fetch('/api/guardar-audio', {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      console.error('Error al guardar el audio en el servidor:', err);
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
      />

      {mensaje.trim() ? (
        <button
          onClick={handleEnviar}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
        >
          <FaPaperPlane />
        </button>
      ) : (
        <button
          onMouseDown={comenzarGrabacion}
          onMouseUp={detenerGrabacion}
          onTouchStart={comenzarGrabacion}
          onTouchEnd={detenerGrabacion}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <BiSolidMicrophone />
        </button>
      )}
    </div>
  );
}
