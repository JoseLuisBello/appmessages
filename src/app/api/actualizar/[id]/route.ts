// src/app/api/actualizar/[id]/route.ts
// (Asumiendo que solo tienes la función PUT en este archivo como lo pediste antes)

import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { nacionalidad } = body;

    if (nacionalidad === undefined) {
      return NextResponse.json({ error: 'El campo "nacionalidad" es requerido para la actualización.' }, { status: 400 });
    }

    const [result]: any = await pool.query(
      'UPDATE usuarios SET nacionalidad = ? WHERE id_usuario = ?',
      [nacionalidad, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado o la nacionalidad no ha cambiado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Nacionalidad actualizada con éxito' });

  } catch (error: any) {
    console.error('Error en la actualización PUT de nacionalidad:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al actualizar la nacionalidad', details: error.message },
      { status: 500 }
    );
  }
}