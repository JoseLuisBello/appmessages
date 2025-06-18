import pool from '@/app/database';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, email } = body; // Removed nacionalidad from destructuring as it's hardcoded

    // Set default values for nacionalidad and descripcion
    const nacionalidad = 'mx';
    const descripcion = 'Usuario de meet the monkeys';

    // Validate required fields
    if (!username || !password || !email) { // Removed nacionalidad from validation
      return NextResponse.json({ error: 'Faltan datos obligatorios: nombre de usuario, contraseña y correo electrónico.' }, { status: 400 });
    }

    // Check if the username already exists
    const [existingUsers]: any = await pool.query(
      'SELECT id_usuario FROM usuarios WHERE nombre = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'El nombre de usuario ya existe. Por favor, elige otro.' }, { status: 409 });
    }

    // Insert the new user into the database
    const [result]: any = await pool.query(
      'INSERT INTO usuarios (nombre, contrasena, correo, nacionalidad, descripcion) VALUES (?, ?, ?, ?, ?)',
      [username, password, email, nacionalidad, descripcion]
    );

    // After a successful insert, the `insertId` property on the result object
    // typically contains the ID of the newly inserted row.
    const newUserId = result.insertId;

    if (!newUserId) {
      // This case should ideally not happen if the insert was successful
      return NextResponse.json({ error: 'No se pudo obtener el ID del nuevo usuario.' }, { status: 500 });
    }

    // Return the ID of the newly created user
    return NextResponse.json({
      id_usuario: newUserId,
      message: 'Usuario agregado exitosamente.'
    }, { status: 201 }); // Use 201 Created status for successful resource creation

  } catch (error) {
    console.error('Error al agregar usuario:', error); // More specific error logging
    return NextResponse.json({ error: 'Error interno del servidor al intentar agregar el usuario.' }, { status: 500 });
  }
}