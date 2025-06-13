type MensajeProps = {
    texto: string;
    propio: boolean;
};

export default function Mensaje({ texto, propio }: MensajeProps) {
    return (
        <div className={`flex ${propio ? 'justify-end' : 'justify-start'} mb-2 px-4`}>
            <div className={`max-w-[70%] px-4 py-2 rounded-xl text-sm shadow ${propio
                ? 'bg-green-200 text-black rounded-br-none'
                : 'bg-white text-black rounded-bl-none'
            }`}>
            {texto}
            </div>
        </div>
    );
}
