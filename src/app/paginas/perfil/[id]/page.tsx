// app/profile/page.tsx - VERSIÓN CON CAMBIOS MÍNIMOS
"use client";

import LanguageSelector from "@/app/componentes/languageSelector";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
  const [mailUsuario, setmailUsuario] = useState<string | null>(null);
  const [desUsuario, setdeslUsuario] = useState<string | null>(null);
  const [nacioUsuario, setnaciolUsuario] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [isEditing, setIsEditing] = useState(false); // Estado para el modo de edición

  const params = useParams();
  const router = useRouter();
  const userId = params.id as string | undefined;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.warn("ID de usuario no encontrado en la URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/recuperar/${userId}`, { cache: 'no-store' });

        if (!res.ok) {
          const errorData = await res.json();
          console.error(`Error al obtener datos del usuario (${res.status}): ${errorData.error || 'Error desconocido'}`);
          setNombreUsuario('Usuario Desconocido');
          setmailUsuario('N/A');
          setdeslUsuario('N/A');
          setnaciolUsuario('N/A');
          return;
        }

        const data = await res.json();
        if (data) {
          // Asigna directamente a los estados individuales
          setNombreUsuario(data.nombre || 'Nombre no disponible');
          setmailUsuario(data.correo || 'Correo no disponible');
          setdeslUsuario(data.descripcion || 'Descripción no disponible');
          setnaciolUsuario(data.nacionalidad || 'Nacionalidad no disponible');
        } else {
          setNombreUsuario('No Data');
          setmailUsuario('No Data');
          setdeslUsuario('No Data');
          setnaciolUsuario('No Data');
        }
      } catch (error) {
        console.error("Error de conexión al obtener los datos del usuario:", error);
        setNombreUsuario('Error de Carga');
        setmailUsuario('Error de Carga');
        setdeslUsuario('Error de Carga');
        setnaciolUsuario('Error de Carga');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Manejador para el cambio en los inputs (actualiza los estados directamente)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "nombreUsuario") setNombreUsuario(value);
    else if (name === "mailUsuario") setmailUsuario(value);
    else if (name === "desUsuario") setdeslUsuario(value);
    else if (name === "nacioUsuario") setnaciolUsuario(value);
  };

  // Manejador para guardar los cambios
  const handleSaveClick = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/actualizar/${userId}`, { // Asegúrate de que esta URL exista
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envía los estados actuales
        body: JSON.stringify({
          nombre: nombreUsuario,
          correo: mailUsuario,
          descripcion: desUsuario,
          nacionalidad: nacioUsuario,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error al guardar datos (${res.status}): ${errorData.error || 'Error desconocido'}`);
      }

      // Si se guarda exitosamente, sal del modo edición
      setIsEditing(false);
      alert('Perfil actualizado exitosamente!');
    } catch (error: any) {
      console.error("Error al guardar los datos del usuario:", error.message);
      alert(`Error al guardar el perfil: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && nombreUsuario === null) { // Solo mostrar cargando si no hay datos iniciales
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Portada */}
      <div className="relative h-40 w-full mb-16">
        <Image
          src="/cover.jpg"
          alt="Portada"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      {/* Perfil */}
      <div className="relative flex flex-col items-center -mt-40 bg-white p-6 rounded-lg shadow-lg">
        <img
          src="https://sportsbase.io/images/gpfans/copy_1200x800/e903738698e97ed4ddf742248018f4a64049a703.jpg"
          alt="Foto de perfil"
          width={150}
          height={150}
          className="rounded-full border-4 border-white shadow-md -mt-20"
        />

        {isEditing ? (
          // --- Modo Edición Básico ---
          <div className="w-full mt-4 space-y-3 text-center"> {/* Agregado text-center para los labels */}
            <div>
              <label htmlFor="nombreUsuario" className="block text-sm font-medium text-gray-700">Nombre:</label>
              <input
                type="text"
                id="nombreUsuario"
                name="nombreUsuario"
                value={nombreUsuario || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="mailUsuario" className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                id="mailUsuario"
                name="mailUsuario"
                value={mailUsuario || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="desUsuario" className="block text-sm font-medium text-gray-700">Descripción:</label>
              <textarea
                id="desUsuario"
                name="desUsuario"
                rows={3}
                value={desUsuario || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
            <div>
              <label htmlFor="nacioUsuario" className="block text-sm font-medium text-gray-700">Nacionalidad:</label>
              <input
                type="text"
                id="nacioUsuario"
                name="nacioUsuario"
                value={nacioUsuario || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-center mt-5">
              <button
                onClick={handleSaveClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        ) : (
          // --- Modo Visualización ---
          <div className="w-full text-center mt-4">
            <h1 className="text-3xl font-bold mt-3">{nombreUsuario ?? 'Cargando...'}</h1>
            <p className="text-lg text-gray-500">{mailUsuario ?? 'Cargando...'}</p>
            <p className="text-md text-gray-700 mt-2 px-4">{desUsuario ?? 'Cargando...'}</p>
            <p className="text-md text-gray-600 mt-1">{nacioUsuario ?? 'Cargando...'}</p>
            <div className="flex justify-center mt-5">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={loading}
              >
                Editar Perfil
              </button>
            </div>
          </div>
        )}

        <div className="mt-6">
          <LanguageSelector />
        </div>
      </div>

      <hr className="my-10 border-gray-300 w-full" />
    </div>
  );
}