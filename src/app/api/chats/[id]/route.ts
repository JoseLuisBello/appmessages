// /api/chats/[id]/route.ts
import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const idStr = new URL(request.url).pathname.split('/').pop() || '';
  const id = Number(idStr);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const [rows]: any = await pool.query(
      `
      SELECT 
        c.id_chat AS id,
        c.user1,
        c.user2,
        u2.nombre AS nombre_contacto
      FROM chat c
      JOIN usuarios u1 ON c.user1 = u1.id_usuario
      JOIN usuarios u2 ON c.user2 = u2.id_usuario
      WHERE c.user1 = ?
      `,
      [id]
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error en la consulta:', error);
    return NextResponse.json(
      { error: 'Error en la consulta', details: error.message },
      { status: 500 }
    );
  }
}
