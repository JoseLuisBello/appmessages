import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    // Solo obtener chats donde user1 = id (usuario logueado)
    // y traer nombre del usuario2
    const [rows]: any = await pool.query(
      `SELECT c.id, c.user1, c.user2, u.nombre AS nombre_contacto
       FROM chat c
       LEFT JOIN usuarios u ON u.id_usuario = c.user2
       WHERE c.user1 = ?`,
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
