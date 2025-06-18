import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const [rows]: any = await pool.query(
      `
      SELECT 
        c.id,
        CASE
          WHEN c.user1 = ? THEN c.user1
          ELSE c.user2
        END AS usuario_id,
        CASE
          WHEN c.user1 = ? THEN c.user2
          ELSE c.user1
        END AS contacto_id,
        u.nombre AS nombre_contacto,
        c.ultimo_mensaje,
        c.fecha_ultimo_mensaje,
        c.sin_leer
      FROM chat c
      JOIN usuarios u ON u.id = 
        CASE 
          WHEN c.user1 = ? THEN c.user2
          ELSE c.user1
        END
      WHERE c.user1 = ? OR c.user2 = ?
      ORDER BY c.fecha_ultimo_mensaje DESC
      `,
      [id, id, id, id, id]
    );

    if (!rows.length) {
      return NextResponse.json({ error: 'No existen chats' }, { status: 404 });
    }

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error en la consulta:', error);
    return NextResponse.json(
      { error: 'Error en la consulta', details: error.message },
      { status: 500 }
    );
  }
}
