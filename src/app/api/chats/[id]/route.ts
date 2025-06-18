// src/app/api/chats/[id]/route.ts
import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const [rows]: any = await pool.query(
      `SELECT 
        id, 
        user1 AS usuario_id, 
        user2 AS contacto_id, 
        nombre_contacto, 
        ultimo_mensaje, 
        fecha_ultimo_mensaje, 
        sin_leer
      FROM chat 
      WHERE user1 = ?`, 
      [id]
    );

    if (!rows.length) {
      return NextResponse.json([], { status: 200 }); // ← devolver array vacío en lugar de error
    }

    return NextResponse.json(rows); // ← se espera un array
  } catch (error: any) {
    console.error('Error en la consulta:', error);
    return NextResponse.json(
      { error: 'Error en la consulta', details: error.message },
      { status: 500 }
    );
  }
}
