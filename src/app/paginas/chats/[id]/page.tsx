'use client';

import { useState, useEffect } from 'react'; // Importa useEffect
import { useRouter, useParams } from 'next/navigation'; // Importa useParams
import { IoPersonCircleOutline, IoExitOutline, IoChatbubblesOutline } from 'react-icons/io5';

// Dummy chat data - In a real app, this would come from an API
const chats = [
  {id: 1,nombre: 'Profesor Mario',ultimoMensaje: 'Nos vemos mañana en clase. Recuerden traer los materiales para la práctica.',hora: '10:30',sinLeer: 2,},
  {id: 2,nombre: 'Juan Pérez',ultimoMensaje: '¿Qué tareas dejó el profe? No pude asistir a la última clase.',hora: '9:45',sinLeer: 0,},
  {id: 3,nombre: 'Grupo Matemáticas',ultimoMensaje: 'Adjunto la guía para la próxima semana, incluye los ejercicios 5 al 10.',hora: 'Ayer',sinLeer: 5,},
  {id: 4,nombre: 'Ana López',ultimoMensaje: 'Confirmo mi asistencia a la reunión de hoy a las 3 PM. Estaré allí puntualmente.',hora: 'Ayer',sinLeer: 0,},
  {id: 5,nombre: 'Soporte Técnico',ultimoMensaje: 'Su incidencia #1234 ha sido resuelta. Por favor, verifique y confirme el cierre.',hora: 'Lunes',sinLeer: 1,},
];

export default function ListaChats() {
  const [chatActivo, setChatActivo] = useState<number | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null); // Nuevo estado para el nombre del usuario
  const router = useRouter();
  const params = useParams(); // Hook para obtener los parámetros de la URL

  // Obtener el ID de la URL. Asumimos que la ruta es, por ejemplo, /chats/[id]
  const userId = params.id as string | undefined;

  // Efecto para cargar el nombre del usuario cuando el componente se monta o el userId cambia
  useEffect(() => {
    const fetchUserName = async () => {
      // Si no hay un userId en la URL, no podemos buscar el nombre
      if (!userId) {
        console.warn("ID de usuario no encontrado en la URL. No se puede cargar el nombre.");
        setNombreUsuario('Invitado'); // Valor por defecto si no hay ID
        return;
      }

      try {
        // Realiza la llamada a tu API para obtener el nombre del usuario
        const res = await fetch(`/api/recuperar/${userId}`, { cache: 'no-store' });

        if (!res.ok) {
          // Manejo de errores si la API no responde OK (ej. 404, 500)
          const errorData = await res.json();
          console.error(`Error al obtener el nombre del usuario (${res.status}): ${errorData.error || 'Error desconocido'}`);
          setNombreUsuario('Usuario Desconocido'); // Nombre de respaldo en caso de error
          return;
        }

        const data = await res.json();
        if (data?.nombre) {
          setNombreUsuario(data.nombre); // Actualiza el estado con el nombre recibido
        } else {
          setNombreUsuario('Nombre no disponible'); // Si la API no devuelve 'nombre'
        }
      } catch (error) {
        // Manejo de errores de red o cualquier otro error en la llamada fetch
        console.error("Error de conexión al obtener el nombre del usuario:", error);
        setNombreUsuario('Error al cargar nombre'); // Nombre de respaldo en caso de fallo de red
      }
    };

    fetchUserName(); // Llama a la función para cargar el nombre
  }, [userId]); // Este efecto se ejecutará cada vez que 'userId' cambie

  // Function to navigate to the profile page
  const irAlPerfil = () => {
    // Puedes usar el userId aquí si tu página de perfil también es dinámica
    router.push(`/paginas/perfil/${userId}`); // Ejemplo: /paginas/perfil/123
  };

  // Function to handle logout and redirect to login page
  const handleLogout = () => {
    // Clear user session data (e.g., from localStorage)
    localStorage.removeItem('user'); // Asegúrate de limpiar el ID si lo guardas aquí
    // Redirect to the login page
    router.push('/paginas/login');
  };

  // Function to simulate starting a new chat
  const handleNewChat = () => {
    alert('Funcionalidad para iniciar un nuevo chat (próximamente)');
    // In a real application, this would redirect to a new chat creation page or open a modal.
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E6F4EA] text-black"> {/* Pistacho Claro Background */}
      {/* Encabezado */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-[#4CAF50]">Chats</h1> {/* Verde Oscuro for Title */}
        <button
          onClick={irAlPerfil}
          title="Ir al perfil"
          className="flex items-center gap-2 text-[#616161] hover:text-[#4CAF50] transition-colors duration-200" // Gris Cálido and Verde Oscuro hover
        >
          <IoPersonCircleOutline size={32} /> {/* Slightly larger icon */}
          <span className="text-base font-medium">{nombreUsuario ?? 'Cargando...'}</span> {/* Muestra el nombre del usuario */}
        </button>
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="flex items-center gap-2 text-[#EF5350] hover:text-[#D32F2F] font-semibold py-2 px-4 rounded-full transition-colors duration-200" // Rojo no tan fuerte
        >
          <IoExitOutline size={24} />
          Salir
        </button>
      </div>

      {/* Lista de chats - Scrollable area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3"> {/* Added flex-1 and space-y-3 for better spacing */}
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setChatActivo(chat.id)}
              className={`p-4 rounded-xl shadow-md cursor-pointer flex flex-col transition-all duration-200 ease-in-out
                ${chatActivo === chat.id ? 'bg-[#D4EDDA] border-l-4 border-[#8BC34A]' : 'bg-white hover:bg-gray-50'}
              `}
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="font-semibold text-lg text-[#4CAF50]">{chat.nombre}</h2> {/* Verde Oscuro for chat names */}
                <span className="text-sm text-[#616161]">{chat.hora}</span> {/* Gris Cálido for time */}
              </div>
              <div className="flex justify-between items-center text-sm">
                <p className="text-[#616161] truncate pr-4 max-w-[85%]">{chat.ultimoMensaje}</p> {/* Gris Cálido, truncate, max-w */}
                {chat.sinLeer > 0 && (
                  <span className="ml-2 text-xs bg-[#8BC34A] text-white rounded-full px-2 py-0.5 font-bold min-w-[24px] text-center">
                    {chat.sinLeer}
                  </span> // Verde Suave for unread count
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">No hay chats disponibles.</p>
        )}
      </div>

      {/* Footer con botones de acción */}
      <div className="p-4 bg-white shadow-lg flex justify-end items-center sticky bottom-0 z-10">

        {/* Botón de Nuevo Mensaje */}
        <button
          onClick={handleNewChat}
          title="Nuevo mensaje"
          className="bg-[#03A9F4] text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center" // Azul Cielo
        >
          <IoChatbubblesOutline size={28} /> {/* Larger icon for floating action button */}
        </button>
      </div>
    </div>
  );
}