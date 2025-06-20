import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { user1, user2 } = await request.json();

    if (!user1 || !user2 || isNaN(user1) || isNaN(user2)) {
      return NextResponse.json({ message: 'Parámetros inválidos' }, { status: 400 });
    }

    // 1. Verificar si ya existe un chat entre esos dos usuarios (en cualquier orden)
    const [existingChatRows]: any = await pool.query(
      `SELECT id_chat FROM chat
       WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)`,
      [user1, user2, user2, user1]
    );

    if (existingChatRows.length > 0) {
      // Ya existe el chat, devolvemos el mismo id_chat
      return NextResponse.json({ id_chat: existingChatRows[0].id_chat });
    }

    // 2. Generar nuevo id_chat
    const [maxChatIdRows]: any = await pool.query(`SELECT MAX(id_chat) AS maxChatId FROM chat`);
    const nuevoIdChat = (maxChatIdRows[0].maxChatId || 0) + 1;

    // 3. Insertar ambos registros (uno por cada dirección del chat)
    await pool.query(
      `INSERT INTO chat (id_chat, user1, user2) VALUES (?, ?, ?)`,
      [nuevoIdChat, user1, user2]
    );
    await pool.query(
      `INSERT INTO chat (id_chat, user1, user2) VALUES (?, ?, ?)`,
      [nuevoIdChat, user2, user1]
    );

    return NextResponse.json({ id_chat: nuevoIdChat });
  } catch (error: any) {
    console.error('Error en la creación del chat:', error);
    return NextResponse.json(
      { message: 'Error en la creación del chat', details: error.message },
      { status: 500 }
    );
  }
}
