import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(req: NextRequest) {
  try {
    const { id_chat, id_emisor, contenido } = await req.json();

    if (!id_chat || !id_emisor || !contenido || typeof contenido !== 'string') {
      return NextResponse.json({ error: 'Datos incompletos o inválidos' }, { status: 400 });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO mensaje (id_chat, id_emisor, contenido, fecha) VALUES (?, ?, ?, NOW())',
      [id_chat, id_emisor, contenido]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error al guardar mensaje:', error);
    return NextResponse.json({ error: 'Error al guardar mensaje' }, { status: 500 });
  }
}
