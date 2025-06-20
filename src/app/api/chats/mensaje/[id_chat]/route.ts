// /api/chats/mensajes/[id_chat]/route.ts
import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id_chat: string } }) {
  const id_chat = Number(params.id_chat);

  if (isNaN(id_chat)) {
    return NextResponse.json({ message: 'ID de chat inválido' }, { status: 400 });
  }

  try {
    const [rows]: any = await pool.query(
      `SELECT id_mensaje, id_emisor, contenido, fecha
       FROM mensaje
       WHERE id_chat = ?
       ORDER BY fecha ASC`,
      [id_chat]
    );

    return NextResponse.json(rows ?? []);
  } catch (err: any) {
    console.error('Error al recuperar mensajes:', err);
    return NextResponse.json(
      { message: 'Error al recuperar mensajes', detail: err.message },
      { status: 500 }
    );
  }
}
