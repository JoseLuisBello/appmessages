// /api/chats/mensajes/route.ts
import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { id_chat, id_emisor, contenido } = await request.json();

    if (!id_chat || !id_emisor || !contenido) {
      return NextResponse.json({ message: 'Datos incompletos' }, { status: 400 });
    }

    const [result]: any = await pool.query(
      `INSERT INTO mensaje (id_chat, id_emisor, contenido) VALUES (?, ?, ?)`,
      [id_chat, id_emisor, contenido]
    );

    return NextResponse.json({ message: 'Mensaje enviado', id_mensaje: result.insertId });
  } catch (err: any) {
    console.error('Error al enviar mensaje:', err);
    return NextResponse.json(
      { message: 'Error al enviar mensaje', detail: err.message },
      { status: 500 }
    );
  }
}
