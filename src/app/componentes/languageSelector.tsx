"use client";
import { useEffect, useState } from "react";

interface LanguageSelectorProps {
  initialLangCode: string | null; // El idioma que viene de la base de datos
  onLangChange: (newLangCode: string) => void; // Función para notificar al padre sobre el cambio
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  initialLangCode,
  onLangChange,
}) => {
  const [currentLang, setCurrentLang] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const languages = [
    { code: "mx", name: "Español", flag: "/flags/mx.png" },
    { code: "gb", name: "English", flag: "/flags/gb.png" },
    { code: "fr", name: "Français", flag: "/flags/fr.png" },
    { code: "cn", name: "中國人", flag: "/flags/cn.png" },
  ];

  useEffect(() => {
    if (initialLangCode) {
      setCurrentLang(initialLangCode);
    } else if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lang");
      if (saved && languages.some((l) => l.code === saved)) {
        setCurrentLang(saved);
      } else {
        setCurrentLang("mx"); // valor por defecto
      }
    } else {
      setCurrentLang("mx"); // valor por defecto para SSR
    }
  }, [initialLangCode]);

  const handleLangChange = (code: string) => {
    setCurrentLang(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", code); // Opcional: mantener también en localStorage
    }
    // ESTA ES LA PARTE CRÍTICA: Notifica al componente padre sobre el cambio
    onLangChange(code);
    setOpen(false);
  };

  if (!currentLang) return null;

  const selected = languages.find((lang) => lang.code === currentLang);

  return (
    <div className="relative inline-block text-left mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-gray-700"
      >
        <img
          src={selected?.flag}
          alt={selected?.name}
          className="w-15 h-10 object-cover"
        />
        {selected?.name}
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-40 bg-white text-black shadow-md border rounded-md">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLangChange(lang.code)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left text-sm"
            >
              <img src={lang.flag} alt={lang.name} className="w-4 h-4 rounded-full" />
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;