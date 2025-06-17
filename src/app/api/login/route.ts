import pool from '@/app/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const [rows]: any = await pool.query(
      'SELECT id FROM usuarios WHERE nombre = ? AND contrasena = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    const user = rows[0];

    return NextResponse.json({
      id: user.id,
      nombre: user.nombre,
      rol: user.rol,
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
