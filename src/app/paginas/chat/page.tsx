'use client';

import { useEffect, useRef, useState } from 'react';
import Mensaje from '@/app/componentes/Mensaje';
import InputMensaje from '@/app/componentes/InputMensaje';

type MensajeData = {
  texto: string;
  propio: boolean;
};

export default function ChatIndividualPage() {
  const [mensajes, setMensajes] = useState<MensajeData[]>([
    { texto: 'Hola, ¿cómo estás?', propio: false },
    { texto: 'Todo bien, ¿y tú?', propio: true },
  ]);

  const chatRef = useRef<HTMLDivElement>(null);

  const enviarMensaje = (nuevoMensaje: string) => {
    setMensajes((prev) => [...prev, { texto: nuevoMensaje, propio: true }]);
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [mensajes]);

  return (
    <div className="flex flex-col h-screen bg-[#e5ddd5]">
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto pt-4 pb-2"
      >
        {mensajes.map((m, i) => (
          <Mensaje key={i} texto={m.texto} propio={m.propio} />
        ))}
      </div>
      <InputMensaje onEnviar={enviarMensaje} />
    </div>
  );
}
