import pool from '@/app/database';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || '');

export async function PUT(request: Request) {
     const id_usuario = Number(new URL(request.url).pathname.split('/').pop());

  if (isNaN(id_usuario)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { nacionalidad: nuevaNacionalidad } = body;

    if (nuevaNacionalidad !== undefined) {
      const [result]: any = await pool.query(
        'UPDATE usuarios SET nacionalidad = ? WHERE id_usuario = ?',
        [nuevaNacionalidad, id_usuario]
      );
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Usuario no encontrado o nacionalidad sin cambios' }, { status: 404 });
      }
    }

    const [[usuario]]: any = await pool.query(
      'SELECT nacionalidad FROM usuarios WHERE id_usuario = ?',
      [id_usuario]
    );

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const nacionalidad = usuario.nacionalidad;
    const nacionalidadIdioma: { [key: string]: string } = {
      'mx': 'español',
      'gb': 'inglés',
      'fr': 'francés',
      'cn': 'chino'
    };
    const idiomaDestino = nacionalidadIdioma[nacionalidad] || 'español';

    const [datosUsuario]: any = await pool.query(
      `SELECT descripcion FROM usuarios WHERE id_usuario = ?`,
      [id_usuario]
    );

    if (!datosUsuario || datosUsuario.length === 0) {
      return NextResponse.json({ error: 'No hay descripción para traducir' }, { status: 404 });
    }

    const descripcionOriginal = datosUsuario[0].descripcion;
    let descripcionTraducida = descripcionOriginal;

    if (API_KEY) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
Traduce el siguiente texto al idioma "${idiomaDestino}".
Solo responde con la traducción, sin comillas ni formato adicional.

Texto:
${descripcionOriginal}
      `.trim();

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        descripcionTraducida = response.text().trim();

        await pool.query(
          `UPDATE usuarios SET descripcion = ? WHERE id_usuario = ?`,
          [descripcionTraducida, id_usuario]
        );
      } catch (err: any) {
        console.warn('Error al traducir la descripción:', err.message);
      }
    }

    return NextResponse.json({
      message: 'Descripción traducida y actualizada correctamente',
      usuario: {
        id_usuario,
        nacionalidad,
        descripcion: descripcionTraducida,
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}