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
        c.user1,
        c.user2,
        CASE 
          WHEN c.user1 = ? THEN u2.nombre
          ELSE u1.nombre
        END AS nombre_contacto
      FROM chat c
      JOIN usuarios u1 ON c.user1 = u1.id
      JOIN usuarios u2 ON c.user2 = u2.id
      WHERE c.user1 = ? OR c.user2 = ?
      `,
      [id, id, id] 
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
