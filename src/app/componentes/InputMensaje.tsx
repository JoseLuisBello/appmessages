"use client";

import { useState } from "react";

type Props = {
  onEnviar: (mensaje: string) => void;
};

export default function InputMensaje({ onEnviar }: Props) {
  const [mensaje, setMensaje] = useState("");

  const enviar = () => {
    if (mensaje.trim()) {
      onEnviar(mensaje);
      setMensaje("");
    }
  };

  return (
    <div className="flex p-2 text-black border-t gap-2">
      <input
        type="text"
        className="flex-1 border rounded px-3 py-1"
        placeholder="Escribe un mensaje..."
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && enviar()}
      />
      <button onClick={enviar} className="bg-blue-600 px-4 rounded">
        Enviar
      </button>
    </div>
  );
}
