// src/app/api/consulta/[id]/route.ts
import pool from '@/app/database';
import { request } from 'http';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const idStr = new URL(request.url).pathname.split('/').pop() || '';
  const id = Number(idStr);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const [rows]: any = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);

    if (!rows.length) {
      return NextResponse.json({ error: 'persona no encontrado' }, { status: 404 });
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
