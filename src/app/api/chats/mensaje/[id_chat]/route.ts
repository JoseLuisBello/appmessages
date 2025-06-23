import { NextResponse } from 'next/server';
import pool from '@/app/database';

export async function GET(_req: Request, { params }: { params: { id_chat: string } }) {
  const chatId = Number(params.id_chat);
  if (isNaN(chatId)) return NextResponse.json({ error: 'ID de chat inválido' }, { status: 400 });

  try {
    const [rows] = await pool.query(
      'SELECT id_mensaje, id_emisor, contenido, fecha FROM mensaje WHERE id_chat = ? ORDER BY fecha ASC',
      [chatId]
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 });
  }
}
