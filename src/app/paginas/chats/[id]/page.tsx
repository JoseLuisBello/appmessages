'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { IoPersonCircleOutline, IoExitOutline, IoChatbubblesOutline } from 'react-icons/io5';

interface Chat {
  id: number;
  usuario_id: number;
  contacto_id: number;
  // nombre_contacto no disponible aún, usar contacto_id como placeholder
}

export default function ListaChats() {
  const [chatActivo, setChatActivo] = useState<number | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string | undefined;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.warn("ID de usuario no encontrado en la URL.");
        setNombreUsuario('Invitado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Obtener nombre del usuario logeado
        const userRes = await fetch(`/api/consulta/${userId}`, { cache: 'no-store' });
        if (!userRes.ok) {
          throw new Error('Error al obtener datos del usuario');
        }
        const userData = await userRes.json();
        setNombreUsuario(userData?.nombre || 'Usuario Desconocido');

        // Obtener lista de chats
        const chatsRes = await fetch(`/api/chats/${userId}`, { cache: 'no-store' });
        if (!chatsRes.ok) {
          throw new Error('Error al obtener los chats');
        }
        const chatsData = await chatsRes.json();

        setChats(chatsData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const irAlPerfil = () => {
    router.push(`/paginas/perfil/${userId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/paginas/login');
  };

  const handleNewChat = () => {
    router.push(`/paginas/nuevo-chat/${userId}`);
  };

  const openChat = (chatId: number) => {
    router.push(`/paginas/chat/${chatId}?usuario=${userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6F4EA] text-black">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#4CAF50] text-lg">Cargando chats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6F4EA] text-black">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E6F4EA] text-black">
      {/* Encabezado */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-[#4CAF50]">Chats</h1>
        <button
          onClick={irAlPerfil}
          title="Ir al perfil"
          className="flex items-center gap-2 text-[#616161] hover:text-[#4CAF50] transition-colors duration-200"
        >
          <IoPersonCircleOutline size={32} />
          <span className="text-base font-medium">{nombreUsuario ?? 'Usuario'}</span>
        </button>
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="flex items-center gap-2 text-[#EF5350] hover:text-[#D32F2F] font-semibold py-2 px-4 rounded-full transition-colors duration-200"
        >
          <IoExitOutline size={24} />
          Salir
        </button>
      </div>

      {/* Lista de chats */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => openChat(chat.id)}
              className={`p-4 rounded-xl shadow-md cursor-pointer flex flex-col transition-all duration-200 ease-in-out
                ${chatActivo === chat.id ? 'bg-[#D4EDDA] border-l-4 border-[#8BC34A]' : 'bg-white hover:bg-gray-50'}
              `}
            >
              <div className="flex justify-between items-center mb-1">
                {/* Por ahora mostramos contacto_id en lugar del nombre */}
                <h2 className="font-semibold text-lg text-[#4CAF50]">{chat.contacto_id}</h2>
              </div>
              {/* Sin último mensaje ni sin_leer disponibles */}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full mt-10">
            <p className="text-center text-gray-500 mb-4">No tienes chats aún</p>
            <button
              onClick={handleNewChat}
              className="bg-[#03A9F4] text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              Iniciar un nuevo chat
            </button>
          </div>
        )}
      </div>

      {/* Botón flotante para nuevo chat */}
      {chats.length > 0 && (
        <div className="p-4 bg-white shadow-lg flex justify-end items-center sticky bottom-0 z-10">
          <button
            onClick={handleNewChat}
            title="Nuevo mensaje"
            className="bg-[#03A9F4] text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
          >
            <IoChatbubblesOutline size={28} />
          </button>
        </div>
      )}
    </div>
  );
}
