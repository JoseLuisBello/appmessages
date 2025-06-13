// app/profile/page.tsx
"use client";

import Image from "next/image";

type Message = {
  id: number;
  sender: string;
  text: string;
  time: string;
};

export default function ProfilePage() {
  const messages: Message[] = [
    { id: 1, sender: "johndoe", text: "Hey, ¿cómo estás?", time: "2h" },
    { id: 2, sender: "johndoe", text: "¿Vas a la fiesta?", time: "1h" },
    { id: 3, sender: "tú", text: "¡Claro que sí!", time: "50min" },
  ];

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
      <div className="relative flex flex-col items-center -mt-20">
        <img
          src="https://sportsbase.io/images/gpfans/copy_1200x800/e903738698e97ed4ddf742248018f4a64049a703.jpg"
          alt="Foto de perfil"
          width={120}
          height={120}
          className="rounded-full border-4 border-white shadow-md"
        />
        <h1 className="text-2xl font-bold mt-3">Sergio Michel Pérez Mendoza</h1>
        <p className="text-gray-500 text-sm">@Sergio</p>
        <p className="text-center text-gray-700 mt-2 px-4">
            Piloto F1 for Cadillac of 2026
        </p>
        <p className="text-sm text-gray-500 mt-1">📍 Ciudad de Guadalajara</p>
        <div className="flex gap-4 text-sm text-gray-600 mt-2">
          <span><strong>1,245</strong> seguidores</span>
          <span><strong>300</strong> seguidos</span>
        </div>
      </div>

      {/* Línea divisoria */}
      <hr className="my-6 border-gray-300" />

      {/* <div>
        <h2 className="text-lg font-semibold mb-4">Mensajes recientes</h2>
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <div>
                <p className="text-sm font-semibold text-blue-600">{msg.sender}</p>
                <p className="text-gray-800">{msg.text}</p>
              </div>
              <span className="text-xs text-gray-400">{msg.time}</span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
