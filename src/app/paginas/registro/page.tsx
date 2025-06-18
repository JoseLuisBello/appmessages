'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Import icons from react-icons
import { FaUser, FaLock, FaEnvelope, FaUserPlus } from 'react-icons/fa'; // Example icons from Font Awesome

// Defines the RegisterPage component.
export default function RegisterPage() {
  // Initializes Next.js useRouter hook for navigation.
  const router = useRouter();

  // State variables for username, email, password, error messages, and loading status.
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State to prevent multiple submissions

  /**
   * Handles the registration form submission.
   * @param {React.FormEvent} e - The form event.
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents default form submission behavior.
    setErrorMsg(''); // Clears any previous errors.
    setIsSubmitting(true); // Sets submitting state to true.

    try {
      // Sends a POST request to the registration API endpoint.
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json(); // Parses the JSON response.

      // Checks if the response was not successful.
      if (!res.ok) {
        // Sets a more user-friendly error message.
        setErrorMsg(data.error || 'Error al registrarse. Por favor, verifica tus datos.');
        return; // Stops execution if there's an error.
      }

      // If registration is successful, stores user data in local storage and redirects to chats.
      localStorage.setItem('user', JSON.stringify(data));
      router.push(`/paginas/chats/${data.id_usuario}`); ; // Ensure this path is correct relative to your project structure
    } catch (error) {
      // Catches and handles network errors or other exceptions.
      console.error('Registration error:', error); // Logs the error for debugging.
      setErrorMsg('Fallo al conectar con el servidor. Por favor, revisa tu conexión a internet.');
    } finally {
      setIsSubmitting(false); // Resets submitting state regardless of success or failure.
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#E6F4EA] text-black"> {/* Pistacho Claro Background */}
      <div className="w-full max-w-sm p-8 rounded-lg shadow-lg bg-white"> {/* White background for form, more prominent shadow */}
        <h2 className="text-3xl font-bold text-center mb-6 text-[#4CAF50] flex items-center justify-center gap-3"> {/* Verde Oscuro for Title */}
          Crear cuenta
        </h2>
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616161]" />
            <label htmlFor="username-input" className="sr-only">Nombre de usuario</label>
            <input
              id="username-input"
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-[#616161] px-10 py-2 rounded-md focus:ring-[#8BC34A] focus:border-[#8BC34A] text-base pl-10"
              aria-describedby="username-error"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616161]" />
            <label htmlFor="email-input" className="sr-only">Correo electrónico</label>
            <input
              id="email-input"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#616161] px-10 py-2 rounded-md focus:ring-[#8BC34A] focus:border-[#8BC34A] text-base pl-10"
              aria-describedby="email-error"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616161]" />
            <label htmlFor="password-input" className="sr-only">Contraseña</label>
            <input
              id="password-input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#616161] px-10 py-2 rounded-md focus:ring-[#8BC34A] focus:border-[#8BC34A] text-base pl-10"
              aria-describedby="password-error"
            />
          </div>

          {errorMsg && (
            <div id="register-error" className="text-red-600 text-sm font-medium text-center" role="alert">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#8BC34A] text-white py-2.5 rounded-md hover:bg-[#4CAF50] transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold flex items-center justify-center gap-2"
            disabled={isSubmitting} // Disables button while submitting
          >
            {isSubmitting ? 'Registrando...' : <>Comenzar a chatear <FaUserPlus /></>}
          </button>

          <div className="text-center text-sm mt-4">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/paginas/login" passHref>
              <span className="text-[#03A9F4] hover:text-blue-600 font-medium cursor-pointer">Inicia sesión aquí</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}