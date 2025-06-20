// src/app/api/actualizar/[id]/route.ts

import pool from '@/app/database';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY || '');

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id_usuario = Number(params.id);

  if (isNaN(id_usuario)) {
    console.error('Error: ID inválido recibido:', params.id);
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { nacionalidad: nuevaNacionalidad } = body;

    // --- Parte 1: Modificar nacionalidad si se proporciona en el body ---
    console.log('Solicitud PUT recibida para ID:', id_usuario);
    console.log('Body de la solicitud:', body);

    if (nuevaNacionalidad !== undefined) {
      console.log('Intentando actualizar nacionalidad para ID:', id_usuario, 'a:', nuevaNacionalidad);
      const [result]: any = await pool.query(
        'UPDATE usuarios SET nacionalidad = ? WHERE id_usuario = ?',
        [nuevaNacionalidad, id_usuario]
      );
      console.log('Resultado de actualización de nacionalidad (filas afectadas):', result.affectedRows);
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Usuario no encontrado o la nacionalidad no ha cambiado' }, { status: 404 });
      }
    }

    // --- Parte 2: Extraer datos, traducir y volver a guardar ---

    const [[usuario]]: any = await pool.query(
      'SELECT nacionalidad FROM usuarios WHERE id_usuario = ?',
      [id_usuario]
    );

    if (!usuario) {
      console.error('Error: Usuario no encontrado para la traducción/actualización de datos con ID:', id_usuario);
      return NextResponse.json({ error: 'Usuario no encontrado para la traducción/actualización de datos' }, { status: 404 });
    }

    const nacionalidad = usuario.nacionalidad;
    const nacionalidadIdioma: { [key: string]: string } = {
      'mx': 'español',
      'gb': 'inglés',
      'fr': 'francés',
      'cn': 'chino'
      };
    const idiomaDestino = nacionalidadIdioma[nacionalidad] || 'español';
    console.log('Nacionalidad del usuario:', nacionalidad, 'Idioma de destino:', idiomaDestino);

    // Obtener datos del usuario a traducir
    const [datosUsuario]: any = await pool.query(
      `SELECT id_usuario, nombre, descripcion
       FROM usuarios
       WHERE id_usuario = ?`,
      [id_usuario]
    );

    if (!datosUsuario || datosUsuario.length === 0) {
      console.error('Error: No hay datos de usuario (nombre/descripcion) para traducir con ID:', id_usuario);
      return NextResponse.json({ error: 'No hay datos de usuario para traducir' }, { status: 404 });
    }

    const usuarioATraducir = datosUsuario[0];
    let nombreTraducido = usuarioATraducir.nombre;
    let descripcionTraducida = usuarioATraducir.descripcion;
    // console log para mostrar los datos extraidos de la base de datos
    /* console.log('Datos extraídos de la base de datos para ID', id_usuario, ':', {
      nombre: usuarioATraducir.nombre,
      descripcion: usuarioATraducir.descripcion,
    }); */

    if (API_KEY) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const contenidoOriginal = [usuarioATraducir.nombre, usuarioATraducir.descripcion];
      const prompt = `
Traduce el siguiente arreglo de textos al idioma "${idiomaDestino}".
Mantén el orden. No alteres el formato, solo responde con un arreglo de cadenas traducidas.
Asegúrate de que la salida sea un JSON válido.

Ejemplo de entrada: ["Hola", "Mundo"]
Ejemplo de salida para inglés: ["Hello", "World"]

Ejemplo de entrada: ["¿Cómo estás?", "Estoy muy bien, gracias."]
Ejemplo de salida para inglés: ["How are you?", "I'm very well, thank you."]

Ejemplo de entrada: ["Me gusta leer libros.", "Ella vive en una ciudad hermosa."]
Ejemplo de salida para francés: ["J'aime lire des livres.", "Elle habite dans une belle ville."]

Ejemplo de entrada: ["¿Puedes ayudarme, por favor?", "Quiero aprender mandarín."]
Ejemplo de salida para chino: ["你能帮我吗？", "我想学普通话。"]

Ejemplo de entrada: ["The weather is nice today.", "What time is it?"]
Ejemplo de salida para español: ["El clima está agradable hoy.", "¿Qué hora es?"]

Ejemplo de entrada: ["Where is the train station?", "I need a coffee."]
Ejemplo de salida para francés: ["Où est la gare?", "J'ai besoin d'un café."]

Ejemplo de entrada: ["Enjoy your meal!", "See you tomorrow."]
Ejemplo de salida para chino: ["祝您用餐愉快！", "明天见。"]

Ejemplo de entrada: ["Il fait froid dehors.", "Nous allons au marché."]
Ejemplo de salida para español: ["Hace frío afuera.", "Vamos al mercado."]

Ejemplo de entrada: ["C'est très intéressant.", "Parlez-vous anglais?"]
Ejemplo de salida para inglés: ["It's very interesting.", "Do you speak English?"]

Ejemplo de entrada: ["Bonne nuit.", "Où sont les toilettes?"]
Ejemplo de salida para chino: ["晚安。", "厕所在哪里？"]

Ejemplo de entrada: ["谢谢你。", "再见。"]
Ejemplo de salida para español: ["Gracias.", "Adiós."]

Ejemplo de entrada: ["我是学生。", "我爱我的家人。"]
Ejemplo de salida para inglés: ["I am a student.", "I love my family."]

Ejemplo de entrada: ["她很漂亮。", "他是一名医生。"]
Ejemplo de salida para francés: ["Elle est très belle.", "Il est médecin."]

Textos a traducir:
${JSON.stringify(contenidoOriginal, null, 2)}
      `;
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        const traducciones: string[] = jsonMatch && jsonMatch[1]
          ? JSON.parse(jsonMatch[1])
          : JSON.parse(text);
        // console para mostrar respuesta de la IA
        //console.log('Traducciones parseadas de Gemini:', traducciones);

        if (traducciones.length === 2) {
          nombreTraducido = traducciones[0];
          descripcionTraducida = traducciones[1];

          console.log('Intentando actualizar nombre y descripcion para ID:', id_usuario, 'nombre traducido:', nombreTraducido, 'descripcion traducida:', descripcionTraducida);
          await pool.query(
            `UPDATE usuarios SET nombre = ?, descripcion = ? WHERE id_usuario = ?`,
            [nombreTraducido, descripcionTraducida, id_usuario]
          );
          console.log('Consulta de actualización de nombre/descripcion ejecutada con éxito.');
        } else {
          console.warn('Advertencia: La API de traducción no devolvió el formato esperado (esperadas 2 cadenas). Traducciones:', traducciones);
        }

      } catch (err: any) {
        console.warn('Error al traducir los datos con Gemini:', err.message);
        // Si hay un error de traducción, se usarán los datos originales.
      }
    } else {
        console.log('La traducción NO se ejecutó. Razón: GOOGLE_API_KEY no está configurada.');
        console.log('API_KEY configurada:', !!API_KEY);
    }

    return NextResponse.json({
      message: 'Operación completada',
      usuario: {
        id_usuario: id_usuario,
        nacionalidad: nuevaNacionalidad !== undefined ? nuevaNacionalidad : nacionalidad,
        nombre: nombreTraducido,
        descripcion: descripcionTraducida,
      },
    });

  } catch (error: any) {
    console.error('Error general en la operación PUT (actualizar/traducir):', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar la solicitud', details: error.message },
      { status: 500 }
    );
  }
}