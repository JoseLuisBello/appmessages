import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const [rows]: any = await pool.query(
      `SELECT u.id_usuario, u.nombre
       FROM usuarios u
       WHERE u.id_usuario != ?
       AND NOT EXISTS (
           SELECT 1
           FROM chat c
           WHERE (c.user1 = ? AND c.user2 = u.id_usuario)
              OR (c.user2 = ? AND c.user1 = u.id_usuario)
       )`,
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