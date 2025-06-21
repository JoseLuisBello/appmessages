// /api/filtro/[id]/route.ts
import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const idStr = new URL(request.url).pathname.split('/').pop() || '';
  const id = Number(idStr);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    // Seleccionar usuarios que no tienen chats con el usuario actual
    const [rows]: any = await pool.query(
      `
      SELECT u.id_usuario, u.nombre
      FROM usuarios u
      WHERE u.id_usuario != ?
        AND u.id_usuario NOT IN (
          SELECT DISTINCT
            CASE
              WHEN c.user1 = ? THEN c.user2
              ELSE c.user1
            END
          FROM chat c
          WHERE c.user1 = ? OR c.user2 = ?
        )
      `,
      [id, id, id, id]
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
