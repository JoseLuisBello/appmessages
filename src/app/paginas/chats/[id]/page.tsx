'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { IoPersonCircleOutline, IoExitOutline, IoChatbubblesOutline } from 'react-icons/io5';

interface Chat {
  id: number;
  user1: number;
  user2: number;
  nombre_contacto: string;
}

export default function ListaChats() {
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const userId = params.id as string | undefined;

  useEffect(() => {
    if (!userId) {
      setError('No se encontró el ID de usuario en la URL');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Obtener nombre del usuario
        const userRes = await fetch(`/api/recuperar/${userId}`, { cache: 'no-store' });
        if (!userRes.ok) throw new Error('Error al obtener datos del usuario');
        const userData = await userRes.json();
        setNombreUsuario(userData?.nombre ?? 'Usuario');

        // Obtener chats
        const chatsRes = await fetch(`/api/chats/${userId}`, { cache: 'no-store' });
        if (!chatsRes.ok) throw new Error('Error al obtener los chats');
        const chatsData: Chat[] = await chatsRes.json();

        setChats(chatsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const irAlPerfil = () => {
    router.push(`/paginas/perfil/${userId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/paginas/login');
  };

  const handleNewChat = () => {
    router.push(`/paginas/nuevochat/${userId}`);
  };

  const openChat = (chatId: number) => {
    router.push(`/paginas/chat/${chatId}?usuario=${userId}`);
  };

  if (loading) return <p>Cargando chats...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col bg-[#E6F4EA] text-black">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-[#4CAF50]">Chats</h1>
        <div className="flex items-center gap-4">
          <button onClick={irAlPerfil} title="Ir al perfil" className="flex items-center gap-2">
            <IoPersonCircleOutline size={32} />
            <span>{nombreUsuario}</span>
          </button>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="flex items-center gap-2 text-red-600 font-semibold py-2 px-4 rounded-full"
          >
            <IoExitOutline size={24} />
            Salir
          </button>
        </div>
      </div>

      {/* Lista de chats */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => openChat(chat.id)}
              className="p-4 rounded-xl shadow-md cursor-pointer bg-white hover:bg-gray-50"
            >
              <h2 className="font-semibold text-lg text-[#4CAF50]">{chat.nombre_contacto}</h2>
              <p className="text-sm text-gray-600">Chat ID: {chat.id}</p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full mt-10">
            <p className="text-center text-gray-500 mb-4">No tienes chats aún</p>
            <button
              onClick={handleNewChat}
              className="bg-[#03A9F4] text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors"
            >
              Iniciar un nuevo chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
