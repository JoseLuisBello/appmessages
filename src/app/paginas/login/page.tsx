'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Import icons from react-icons
import { FaUser, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Example icons from Font Awesome

// Defines the LoginPage component.
export default function LoginPage() {
  // Initializes Next.js useRouter hook for navigation.
  const router = useRouter();

  // State variables for username, password, and error messages.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State to prevent multiple submissions

  /**
   * Handles the login form submission.
   * @param {React.FormEvent} e - The form event.
   */
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault(); // Previene el comportamiento por defecto del formulario
  setError(''); // Limpia errores anteriores

  // Validación básica de campos vacíos
  if (!username || !password) {
    setError('Por favor, ingresa tu usuario y contraseña.');
    return;
  }

  setIsSubmitting(true); // Muestra que está enviando

  try {
    // Realiza la petición al backend
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    console.log("ID recuperado:", data.id);



    if (!res.ok) {
      // Si hay error de autenticación
      setError(data.error || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.');
      return;
    }

    // Login exitoso: guarda usuario y redirige
    localStorage.setItem('user', JSON.stringify(data));
    router.push(`/paginas/chats/${data.id}`); // Se asume que `data.id` es el ID de usuario o chat
  } catch (err) {
    console.error('Login error:', err);
    setError('Fallo al conectar con el servidor. Por favor, revisa tu conexión.');
  } finally {
    setIsSubmitting(false); // Se ejecuta siempre, éxito o fallo
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#E6F4EA] text-black"> {/* Pistacho Claro Background */}
      <h1 className="text-3xl mb-6 font-bold text-[#4CAF50] flex items-center gap-3"> {/* Verde Oscuro for Title */}
        Iniciar sesión
      </h1>

      <form onSubmit={handleLogin} className="space-y-5 w-full max-w-sm bg-white p-8 rounded-lg shadow-lg"> {/* White background for form, more prominent shadow */}
        <div className="relative"> {/* Use relative positioning for icon placement */}
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616161]" /> {/* Gris Cálido for icon */}
          <label htmlFor="username-input" className="sr-only">Usuario</label>
          <input
            id="username-input"
            type="text"
            placeholder="Usuario"
            className="w-full border border-[#616161] px-10 py-2 rounded-md focus:ring-[#8BC34A] focus:border-[#8BC34A] text-base pl-10" /* Added pl-10 for icon space */
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-describedby="username-error"
          />
        </div>

        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616161]" /> {/* Gris Cálido for icon */}
          <label htmlFor="password-input" className="sr-only">Contraseña</label>
          <input
            id="password-input"
            type="password"
            placeholder="Contraseña"
            className="w-full border border-[#616161] px-10 py-2 rounded-md focus:ring-[#8BC34A] focus:border-[#8BC34A] text-base pl-10" /* Added pl-10 for icon space */
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-describedby="password-error"
          />
        </div>

        {error && (
          <div id="login-error" className="text-red-600 text-sm font-medium text-center" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#8BC34A] text-white py-2.5 rounded-md hover:bg-[#4CAF50] transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold flex items-center justify-center gap-2"
          disabled={isSubmitting} // Disables button while submitting
        >
          {isSubmitting ? 'Cargando...' : <>Entrar <FaSignInAlt /></>}
        </button>

        <Link href="/paginas/registro" passHref>
          <button
            type="button" // Use type="button" for Link components to prevent form submission
            className="w-full bg-[#03A9F4] text-white py-2.5 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out text-lg font-semibold flex items-center justify-center gap-2" // Azul Cielo for secondary button
          >
            Registrar
          </button>
        </Link>
      </form>
    </div>
  );
}