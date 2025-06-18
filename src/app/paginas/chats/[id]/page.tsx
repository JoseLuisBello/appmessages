'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { IoPersonCircleOutline, IoExitOutline, IoChatbubblesOutline } from 'react-icons/io5';

interface Chat {
  id: number;
  usuario_id: number;
  contacto_id: number;
  nombre_contacto: string;
  ultimo_mensaje: string;
  fecha_ultimo_mensaje: string;
  sin_leer: number;
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

  // Efecto para cargar el nombre del usuario y sus chats
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.warn("ID de usuario no encontrado en la URL.");
        setNombreUsuario('Invitado');
        return;
      }

      try {
        setLoading(true);
        
        // Cargar nombre del usuario
        const userRes = await fetch(`/api/recuperar/${userId}`, { cache: 'no-store' });
        if (!userRes.ok) {
          throw new Error('Error al obtener datos del usuario');
        }
        const userData = await userRes.json();
        setNombreUsuario(userData?.nombre || 'Usuario Desconocido');

        // Cargar chats del usuario
        const chatsRes = await fetch(`/api/chats/${userId}`, {cache : 'no-store'});
        if (!chatsRes.ok) {
          throw new Error('Error al obtener los chats');
        }
        const chatsData = await chatsRes.json();
        
        // Ordenar chats por fecha descendente
        const sortedChats = chatsData.sort((a: Chat, b: Chat) => 
          new Date(b.fecha_ultimo_mensaje).getTime() - new Date(a.fecha_ultimo_mensaje).getTime()
        );
        
        setChats(sortedChats);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Formatear la fecha para mostrar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Si es hoy, mostrar hora
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Si es ayer
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    }
    
    // Si es esta semana
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    }
    
    // Más de una semana
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

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
                <h2 className="font-semibold text-lg text-[#4CAF50]">{chat.nombre_contacto}</h2>
                <span className="text-sm text-[#616161]">{formatDate(chat.fecha_ultimo_mensaje)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p className="text-[#616161] truncate pr-4 max-w-[85%]">{chat.ultimo_mensaje}</p>
                {chat.sin_leer > 0 && (
                  <span className="ml-2 text-xs bg-[#8BC34A] text-white rounded-full px-2 py-0.5 font-bold min-w-[24px] text-center">
                    {chat.sin_leer}
                  </span>
                )}
              </div>
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