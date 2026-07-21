const CLOUD_NAME = 'dq4j7zh2a';
const UPLOAD_PRESET = 'bumeran_upload';

export async function subirImagen(uri: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', { uri, type: 'image/jpeg', name: 'foto.jpg' } as any);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'bumeran/favores');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message ?? 'Error al subir imagen');
  }

  const data = await res.json();
  return data.secure_url as string;
}

export async function subirImagenes(uris: string[]): Promise<string[]> {
  return Promise.all(uris.map(subirImagen));
}
