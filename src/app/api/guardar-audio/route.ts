// /app/api/guardar-audio/route.ts (Next 13+ con App Router)
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const archivo = data.get('audio') as File;

  if (!archivo) {
    return NextResponse.json({ error: 'No se recibió el archivo' }, { status: 400 });
  }

  const buffer = Buffer.from(await archivo.arrayBuffer());
  const timestamp = Date.now();
  const nombreArchivo = `audio_${timestamp}.webm`;
  const ruta = join(process.cwd(), 'public', 'audios', nombreArchivo);

  await writeFile(ruta, buffer);

  return NextResponse.json({ ok: true, archivo: nombreArchivo });
}
