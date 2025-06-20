import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { user1, user2 } = await request.json();

    if (!user1 || !user2 || isNaN(user1) || isNaN(user2)) {
      return NextResponse.json({ message: 'Parámetros inválidos' }, { status: 400 });
    }

    // Verificar si ya existe el chat (sin importar el orden)
    const [existingChatRows]: any = await pool.query(
      `SELECT id FROM chat
       WHERE (user1 = ? AND user2 = ?)
          OR (user1 = ? AND user2 = ?)`,
      [user1, user2, user2, user1]
    );

    if (existingChatRows.length > 0) {
      return NextResponse.json({ id_chat: existingChatRows[0].id });
    }

  // Obtener el ID máximo actual
  const [maxIdRows]: any = await pool.query(`SELECT MAX(id) as maxId FROM chat`);
  const nuevoId = (maxIdRows[0].maxId || 0) + 1;

  // Insertar el nuevo chat con el nuevo ID
  const [insertResult]: any = await pool.query(
    `INSERT INTO chat (id, user1, user2) VALUES (?, ?, ?)`,
    [nuevoId, user1, user2]
  );

  const [insertResult2]: any = await pool.query(
    `INSERT INTO chat (id, user2, user1) VALUES (?, ?, ?)`,
    [nuevoId + 1, user2, user1]
  );

    const id_chat = insertResult.insertId;

    return NextResponse.json({ id_chat });
  } catch (error: any) {
    console.error('Error en la creación del chat:', error);
    return NextResponse.json(
      { message: 'Error en la creación del chat', details: error.message },
      { status: 500 }
    );
  }
}
