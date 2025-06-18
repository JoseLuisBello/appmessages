// src/app/api/consulta/[id]/route.ts
import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function GET(_request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const [rows]: any = await pool.query('SELECT * FROM chat WHERE user1= ?', [id]);

    if (!rows.length) {
      return NextResponse.json({ error: 'no existen chats' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error('Error en la consulta:', error);
    return NextResponse.json(
      { error: 'Error en la consulta', details: error.message },
      { status: 500 }
    );
  }
}
