# 📷 Foto Galería — Ionic + Capacitor

Aplicación móvil híbrida desarrollada con **Ionic Framework** y **Capacitor** que permite tomar fotos con la cámara del dispositivo y guardarlas en una galería persistente. Funciona tanto en **web** como en **Android/iOS**.

Proyecto desarrollado para la materia **Aplicaciones Móviles Híbridas** — Facultad de Ingeniería de Software.

---

## ✨ Funcionalidades

- 📸 Tomar fotos con la cámara del dispositivo
- 🌐 Compatible con web (selector de archivos) y móvil (cámara nativa)
- 💾 Guardado persistente de fotos en el sistema de archivos
- 🗂️ Galería en cuadrícula con todas las fotos tomadas
- 🔄 Las fotos se mantienen al cerrar y volver a abrir la app

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| Ionic Framework | 7+ | UI y estructura de la app |
| Angular | 16+ | Framework base (ngModules) |
| Capacitor | 5+ | Acceso a hardware nativo |
| @capacitor/camera | 5+ | Plugin de cámara |
| @capacitor/filesystem | 5+ | Guardado de archivos |
| @capacitor/preferences | 5+ | Persistencia de datos |

---

## 📋 Requisitos previos

- [Node.js](https://nodejs.org/) v16 o superior
- [Android Studio](https://developer.android.com/studio) (para compilar en Android)
- [Ionic CLI](https://ionicframework.com/docs/cli)

```bash
npm install -g @ionic/cli
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/foto-galeria.git
cd foto-galeria
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar plugins de Capacitor

```bash
npm install @capacitor/camera @capacitor/filesystem @capacitor/preferences
npx cap sync
```

---

## ▶️ Ejecutar la app

### En el navegador (web)

```bash
ionic serve
```

### En Android

```bash
ionic build
npx cap sync
npx cap open android
```

> Desde Android Studio: selecciona un emulador o dispositivo físico y presiona **Run**.

### En iOS

```bash
ionic build
npx cap sync
npx cap open ios
```

> Desde Xcode: selecciona un simulador o dispositivo y presiona **Run**.

---

## 🔐 Permisos requeridos

### Android — `AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### iOS — `Info.plist`

```xml
<key>NSCameraUsageDescription</key>
<string>Necesitamos acceso a la cámara para tomar fotos</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Necesitamos guardar fotos en tu galería</string>
```

---

## 📁 Estructura del proyecto

```
foto-galeria/
├── src/
│   └── app/
│       ├── services/
│       │   └── photo.service.ts   # Lógica principal de cámara y almacenamiento
│       ├── tab2/
│       │   ├── tab2.page.ts       # Controlador de la galería
│       │   └── tab2.page.html     # Vista de la galería
│       └── app.module.ts          # Módulo raíz de Angular
├── android/                       # Proyecto nativo Android (generado por Capacitor)
├── www/                           # Build de producción (generado por ionic build)
└── capacitor.config.ts            # Configuración de Capacitor
```

---

## 🔄 Flujo de la aplicación

```
Usuario toca el botón 📷
         │
         ▼
Camera.getPhoto()       ← abre la cámara nativa o selector web
         │
         ▼
readAsBase64()          ← convierte la foto según la plataforma
         │
    ┌────┴────┐
 Móvil       Web
    │          │
Filesystem   fetch()
readFile()  + FileReader
    └────┬────┘
         │
         ▼
Filesystem.writeFile()  ← guarda el archivo físico
         │
         ▼
Preferences.set()       ← persiste la lista de fotos
         │
         ▼
ion-img muestra la foto en la galería ✅
```

---

## 👨‍💻 Autor

Desarrollado por **Breison Mendez**  
Facultad de Ingeniería de Software  
Materia: Aplicaciones Móviles Híbridas

---

## 📄 Licencia

Este proyecto es de uso académico.
