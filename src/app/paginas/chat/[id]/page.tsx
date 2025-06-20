'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Mensaje from '@/app/componentes/Mensaje';
import InputMensaje from '@/app/componentes/InputMensaje';

type MensajeData = {
  texto: string;
  propio: boolean;
};

export default function ChatIndividualPage() {
  const [mensajes, setMensajes] = useState<MensajeData[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const searchParams = useSearchParams();
  const chatId = params.id;
  const userId = searchParams.get('usuario');
  const nombreContacto = searchParams.get('nombreContacto');

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const res = await fetch(`/api/chats/mensajes/${chatId}`);
        const data = await res.json();
        const mensajesFormateados = data.map((m: any) => ({
          texto: m.contenido,
          propio: String(m.id_emisor) === userId,
        }));
        setMensajes(mensajesFormateados);
      } catch (err) {
        console.error('Error al cargar mensajes:', err);
      }
    };

    fetchMensajes();
  }, [chatId, userId]);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [mensajes]);

  const enviarMensaje = async (nuevoTexto: string | Blob) => {
    if (!userId || !chatId) return;

    const mensajeFinal = typeof nuevoTexto === 'string' ? nuevoTexto : await nuevoTexto.text();

    try {
      const res = await fetch('/api/chats/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_chat: chatId,
          id_emisor: userId,
          contenido: mensajeFinal,
        }),
      });

      if (!res.ok) throw new Error('Error al enviar el mensaje');

      setMensajes((prev) => [...prev, { texto: mensajeFinal, propio: true }]);
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#e5ddd5]">
      <div className="bg-[#4CAF50] text-white p-4 font-bold text-xl">
        Chat con {nombreContacto ?? 'Contacto'}
      </div>
      <div ref={chatRef} className="flex-1 overflow-y-auto pt-4 pb-2 px-2">
        {mensajes.map((m, i) => (
          <Mensaje key={i} texto={m.texto} propio={m.propio} />
        ))}
      </div>
      <InputMensaje onEnviar={enviarMensaje} />
    </div>
  );
}
