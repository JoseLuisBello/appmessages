"use client";

import LanguageSelector from "@/app/componentes/languageSelector";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";

export default function ProfilePage() {
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
  const [mailUsuario, setmailUsuario] = useState<string | null>(null);
  const [desUsuario, setdeslUsuario] = useState<string | null>(null);
  const [nacioUsuario, setnaciolUsuario] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter(); 

  const userId = params.id as string | undefined;

  // Efecto para cargar los datos del usuario

  const fetchUserData = async () => {
      if (!userId) {
        console.warn("ID de usuario no encontrado en la URL. No se pueden cargar los datos.");
        setNombreUsuario('Invitado');
        return;
      }

      try {
        // recuperar datos
        const res = await fetch(`/api/recuperar/${userId}`, { cache: 'no-store' });

        if (!res.ok) {
          const errorData = await res.json();
          console.error(`Error al obtener los datos del usuario (${res.status}): ${errorData.error || 'Error desconocido'}`);
          setNombreUsuario('Usuario Desconocido');
          return;
        }

        const data = await res.json();
        if (data) {
          setNombreUsuario(data.nombre);
          setmailUsuario(data.correo);
          setdeslUsuario(data.descripcion);
          // Carga la nacionalidad para el LanguageSelector
          setnaciolUsuario(data.nacionalidad || "mx"); // Usar "mx" como valor predeterminado si no hay
        } else {
          setNombreUsuario('Nombre no disponible');
        }
      } catch (error) {
        console.error("Error de conexión al obtener los datos del usuario:", error);
        setNombreUsuario('Error al cargar nombre');
      }
    };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const irachats = () => {
    router.push(`/paginas/chats/${userId}`);
  };

  // Función para manejar el cambio de nacionalidad
  const handleNacionalidadChange = async (newNacionalidadCode: string) => {
    if (!userId) {
      console.warn("No hay ID de usuario para guardar la nacionalidad.");
      return;
    }

    try {
      const res = await fetch(`/api/actualizar/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nacionalidad: newNacionalidadCode }), // Envía la nueva nacionalidad
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error(`Error al actualizar la nacionalidad (${res.status}): ${errorData.error || 'Error desconocido'}`);
        return;
      }

      setnaciolUsuario(newNacionalidadCode); // Actualiza el estado local con la nueva nacionalidad
      console.log(`Nacionalidad actualizada a: ${newNacionalidadCode}`);
      await fetchUserData();
    } catch (error) {
      console.error("Error de conexión al actualizar la nacionalidad:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#E6F4EA] text-black"> 
      {/* Portada */}
      <div className="absolute top-10 right-80 flex items-center">
        <button
          onClick={irachats}
          title="Regresar a la página de chats"
          className="flex items-center gap-2 text-green-600 font-semibold py-2 px-4 rounded-full hover:bg-green-100 transition"
        >
          <FaArrowLeft size={20} />
          <span>Regresar a Chats</span>
        </button>
      </div>



      {/* Perfil */}
      <div className="relative flex flex-col items-center -mt-40">


        <img
          src="https://sportsbase.io/images/gpfans/copy_1200x800/e903738698e97ed4ddf742248018f4a64049a703.jpg"
          alt="Foto de perfil"
          width={500}
          height={500}
          className="rounded-full border-1 border-white shadow-md"
        />
        <h1 className="text-3xl font-bold mt-3">{nombreUsuario ?? 'Cargando...'}</h1>
        <p className="text-2xl text-gray-500 text-sm">{mailUsuario ?? 'Cargando...'}</p>
        <p className="text-2xl text-center text-gray-700 mt-2 px-4">{desUsuario ?? 'Cargando...'}</p>

        {/* Sección de Nacionalidad manejada por LanguageSelector */}
        {nacioUsuario !== null && (
          <LanguageSelector
            initialLangCode={nacioUsuario}
            onLangChange={handleNacionalidadChange}
          />
        )}
      </div>

      {/* Línea divisoria */}
      <hr className="my-10 border-gray-300 w-full" />
    </div>
  );
}