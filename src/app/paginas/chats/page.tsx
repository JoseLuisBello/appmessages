'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoPersonCircleOutline } from 'react-icons/io5';

const chats = [
  {
    id: 1,
    nombre: 'Profesor Mario',
    ultimoMensaje: 'Nos vemos mañana en clase.',
    hora: '10:30',
    sinLeer: 2,
  },
  {
    id: 2,
    nombre: 'Juan Pérez',
    ultimoMensaje: '¿Qué tareas dejó el profe?',
    hora: '9:45',
    sinLeer: 0,
  },
  {
    id: 3,
    nombre: 'Grupo Matemáticas',
    ultimoMensaje: 'Adjunto la guía.',
    hora: 'Ayer',
    sinLeer: 5,
  },
];

export default function ListaChats() {
  const [chatActivo, setChatActivo] = useState<number | null>(null);
  const router = useRouter();

  const irAlPerfil = () => {
    router.push('/paginas/perfil');
  };

  return (
    <div className="min-h-screen bg-white text-black p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chats</h1>
        <button
          onClick={irAlPerfil}
          title="Ir al perfil"
          className="text-gray-600 hover:text-black transition"
        >
          <IoPersonCircleOutline size={32} />
        </button>
      </div>

      {/* Lista de chats */}
      <div className="flex flex-col gap-3">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setChatActivo(chat.id)}
            className={`p-4 rounded-lg border shadow-sm cursor-pointer ${
              chatActivo === chat.id ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
            } transition`}
          >
            <div className="flex justify-between items-center mb-1">
              <h2 className="font-semibold">{chat.nombre}</h2>
              <span className="text-sm text-gray-500">{chat.hora}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p className="text-gray-700 truncate">{chat.ultimoMensaje}</p>
              {chat.sinLeer > 0 && (
                <span className="ml-2 text-xs bg-gray-300 text-gray-800 rounded-full px-2 py-0.5">
                  {chat.sinLeer}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
