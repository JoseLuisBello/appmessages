'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { IoPersonCircleOutline, IoExitOutline, IoArrowBackOutline, IoChatbubblesOutline } from 'react-icons/io5';

// Definición de la interfaz para un usuario (adaptada de la modificación del API route)
interface User {
  id_usuario: number;
  nombre: string;
}

export default function NuevoChat() {
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const userId = params.id as string | undefined; // ID del usuario actual

  useEffect(() => {
    if (!userId) {
      setError('No se encontró el ID de usuario en la URL.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener el nombre del usuario actual
        const userRes = await fetch(`/api/recuperar/${userId}`, { cache: 'no-store' });
        if (!userRes.ok) {
          const errorData = await userRes.json();
          throw new Error(`Error al obtener datos del usuario: ${errorData.message || userRes.statusText}`);
        }
        const userData = await userRes.json();
        setNombreUsuario(userData?.nombre ?? 'Usuario');

        const usersRes = await fetch(`/api/filtro/${userId}`, { cache: 'no-store' });
        if (!usersRes.ok) {
          const errorData = await usersRes.json();
          throw new Error(`Error al obtener otros usuarios: ${errorData.message || usersRes.statusText}`);
        }
        const usersData: User[] = await usersRes.json();
        setAvailableUsers(usersData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar usuarios.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Navega de regreso a la lista de chats
  const goBackToChats = () => {
    router.push(`/paginas/chats/${userId}`);
  };

  // Navega al perfil del usuario actual
  const irAlPerfil = () => {
    router.push(`/paginas/perfil/${userId}`);
  };

  // Maneja el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/paginas/login');
  };

  const startChatWithUser = async (otherUserId: number, otherUserName: string) => {
    try {
      router.push(`/paginas/chat?user1=${userId}&user2=${otherUserId}&nombreContacto=${otherUserName}`);
    } catch (createChatError) {
      console.error('Error al iniciar chat:', createChatError);
      setError('No se pudo iniciar el chat. Intenta de nuevo.');
    }
  };

  if (error) return <p className="text-center mt-10 text-red-600 font-semibold">Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col bg-[#E6F4EA] text-black">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={goBackToChats} title="Volver a chats" className="text-gray-600 hover:text-[#4CAF50] transition-colors">
            <IoArrowBackOutline size={32} />
          </button>
          <h1 className="text-3xl font-bold text-[#4CAF50]">Nuevo Chat</h1>
        </div>
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

      {/* Lista de usuarios disponibles */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {availableUsers.length > 0 ? (
          availableUsers.map((user) => (
            <div
              key={user.id_usuario}
              onClick={() => startChatWithUser(user.id_usuario, user.nombre)}
              className="p-4 rounded-xl shadow-md cursor-pointer bg-white hover:bg-gray-50 flex items-center gap-3"
            >
              <IoPersonCircleOutline size={30} className="text-[#4CAF50]" />
              <h2 className="font-semibold text-lg text-[#4CAF50]">{user.nombre}</h2>
              <span className="text-sm text-gray-500 ml-auto">ID: {user.id_usuario}</span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full mt-10">
            <p className="text-center text-gray-500 mb-4 text-lg">No hay otros usuarios disponibles para chatear en este momento.</p>
            <button
              onClick={goBackToChats}
              className="bg-[#03A9F4] text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <IoArrowBackOutline size={24} /> Volver a la lista de chats
            </button>
          </div>
        )}
      </div>
    </div>
  );
}