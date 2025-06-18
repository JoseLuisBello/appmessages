import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function GET(_request: Request,{ params }: { params: { id: string } }) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const [rows]: any = await pool.query(
      'SELECT id_usuario FROM usuarios WHERE id_usuario != ?',
      [id]
    );

    // Si no hay otros usuarios, puedes retornar lista vacía sin error
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error en la consulta:', error);
    return NextResponse.json(
      { error: 'Error en la consulta', details: error.message },
      { status: 500 }
    );
  }
}
