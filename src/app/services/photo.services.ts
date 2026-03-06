import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';

export interface UserPhoto {
  filepath: string;      // Nombre del archivo guardado en el dispositivo
  webviewPath?: string;  // Ruta temporal para mostrar la imagen en el HTML
}

@Injectable({ providedIn: 'root' })
export class PhotoService {
  public photos: UserPhoto[] = []; // Lista de fotos para mostrarlas en la galeria
  private PHOTO_STORAGE = 'photos'; // Clave usada para guardar en Preferences

  constructor(private platform: Platform) {}

  // ─────────────────────────────────────────────
  // Tomar una nueva foto
  // ─────────────────────────────────────────────
  async addNewToGallery() {
    // 1.1 Abre la cámara del dispositivo (o el selector de archivos en web)
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // Recibe la URI, no base64 directo
      source: CameraSource.Camera,      // Fuente: cámara
      quality: 90,                      // Calidad de compresión del JPEG
    });

    //Convierte y guarda la foto en el sistema de archivos
    const savedPhoto = await this.savePicture(capturedPhoto);

    //Agrega la foto al inicio del arreglo
    this.photos.unshift(savedPhoto);

    //Persiste la lista actualizada en almacenamiento permanente
    await this.saveToStorage();
  }

  // ─────────────────────────────────────────────
  // Guardar el archivo físico en el dispositivo
  // ─────────────────────────────────────────────
  private async savePicture(photo: Photo): Promise<UserPhoto> {
    //Convierte la foto a base64
    const base64Data = await this.readAsBase64(photo);

    //Genera un nombre único usando la fecha actual en milisegundos
    const fileName = Date.now() + '.jpeg';

    //Escribe el archivo en el almacenamiento interno del app
    await Filesystem.writeFile({
      path: fileName,              // Nombre del archivo
      data: base64Data,            // Contenido en base64
      directory: Directory.Data,   // Carpeta privada de la app (funciona en web y móvil)
    });

    //Retorna el objeto con la ruta guardada y la ruta temporal para mostrar
    return {
      filepath: fileName,          // Se usará para leer el archivo en el futuro
      webviewPath: photo.webPath,  // URL temporal que el navegador/webview puede mostrar
    };
  }

  // ─────────────────────────────────────────────
  // Convertir la foto a base64
  // ─────────────────────────────────────────────
  private async readAsBase64(photo: Photo): Promise<string> {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({ path: photo.path! });
      return file.data as string;
    } else {
      // Se realiza el fetch para conseguir los bytes y los convertimos a base64
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  // ─────────────────────────────────────────────
  // Convertir Blob a base64
  // ─────────────────────────────────────────────
  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader(); // API del navegador para leer archivos
      reader.onerror = reject;         // En caso de fallar , rechaza la promesa
      reader.onload = () => resolve(reader.result); // Al terminar, resuelve con el base64
      reader.readAsDataURL(blob);      // Inicia la lectura y conversión
    });

  // ─────────────────────────────────────────────
  // Guardar la lista de fotos en Preferences
  // ─────────────────────────────────────────────
  private async saveToStorage() {
    await Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  // ─────────────────────────────────────────────
  // Cargar las fotos guardadas al abrir la app
  // ─────────────────────────────────────────────
  async loadSaved() {
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];
    if (!this.platform.is('hybrid')) {
      for (let photo of this.photos) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }
}