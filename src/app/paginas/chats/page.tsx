'use client';

import { useState } from 'react';
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

  const irAlPerfil = () => {
    // Simula ir al perfil
    alert('Ir al perfil del usuario');
    // Puedes usar router.push('/perfil') si usas Next.js
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Encabezado con botón de perfil */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chats</h2>
        <button onClick={irAlPerfil} title="Perfil">
          <IoPersonCircleOutline size={30} />
        </button>
      </div>

      {/* Lista de chats */}
      <div className="flex flex-col gap-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setChatActivo(chat.id)}
            style={{
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              background: chatActivo === chat.id ? '#f0f0f0' : '#fff',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{chat.nombre}</strong>
              <span style={{ fontSize: '0.9em', color: '#666' }}>{chat.hora}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '0.95em', color: '#333' }}>{chat.ultimoMensaje}</span>
              {chat.sinLeer > 0 && (
                <span
                  style={{
                    fontSize: '0.8em',
                    backgroundColor: '#ddd',
                    borderRadius: '999px',
                    padding: '2px 8px',
                    marginLeft: '8px',
                  }}
                >
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
