// /app/api/agregar/route.ts
import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, email,} = body;
    const nacionalidad = 'mx';
    const descripcion = 'Usuario de meet the monkeys';

    if (!username || !password || !email || !nacionalidad) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const [existing]: any = await pool.query(
      'SELECT * FROM usuarios WHERE nombre = ?',
      [username]
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 409 });
    }

    await pool.query(
      'INSERT INTO usuarios (nombre, contrasena, correo, nacionalidad, descripcion) VALUES (?, ?, ?, ?, ?)',
      [username, password, email, nacionalidad, descripcion]
    );


    return NextResponse.json({ message: 'Usuario agregado correctamente' }, { status: 201 });
  } catch (error: any) {
    console.error('Error en la consulta:', error);
    return NextResponse.json(
      { error: 'Error en la consulta', details: error.message },
      { status: 500 }
    );
  }
}
