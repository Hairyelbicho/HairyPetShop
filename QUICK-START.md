# 🚀 Guía Rápida - Generar Instalador .EXE

## ⚡ Pasos Rápidos

### 1️⃣ Instalar Dependencias
```bash
npm install
```

### 2️⃣ Compilar la App Web
```bash
npm run build
```

### 3️⃣ Generar el Instalador
```bash
npm run electron:build
```

### 4️⃣ Encontrar el Instalador
El archivo estará en: `release/HairyWallet-Setup-1.0.0.exe`

---

## 📋 Comandos Disponibles

### Desarrollo
```bash
# Ejecutar versión web en desarrollo
npm run dev

# Ejecutar versión escritorio en desarrollo
npm run electron:dev
```

### Producción
```bash
# Compilar versión web (PWA)
npm run build

# Generar instalador Windows (.exe)
npm run electron:build

# Generar versión portable Windows
npm run electron:build:portable

# Generar para todas las plataformas (Windows, Mac, Linux)
npm run electron:build:all
```

---

## 📦 Archivos Generados

Después de ejecutar `npm run electron:build`, encontrarás:

```
release/
├── HairyWallet-Setup-1.0.0.exe      # ← ESTE ES EL INSTALADOR
├── HairyWallet-Portable-1.0.0.exe   # Versión portable (opcional)
└── win-unpacked/                     # Archivos sin empaquetar
```

---

## 🎯 Subir el Instalador a tu Web

### Opción 1: Servidor Web
1. Copia `HairyWallet-Setup-1.0.0.exe` a `public/downloads/`
2. Actualiza el enlace en `src/pages/download-wallet/page.tsx`:
```typescript
const handleDownloadEXE = () => {
  window.location.href = '/downloads/HairyWallet-Setup-1.0.0.exe';
};
```

### Opción 2: GitHub Releases
1. Ve a tu repositorio en GitHub
2. Crea un nuevo Release
3. Sube `HairyWallet-Setup-1.0.0.exe`
4. Copia el enlace de descarga
5. Actualiza el enlace en `src/pages/download-wallet/page.tsx`

---

## 🔧 Personalizar Antes de Compilar

### Cambiar Versión
Edita `package.json`:
```json
{
  "version": "1.0.0"  // ← Cambia esto
}
```

### Cambiar Nombre de la App
Edita `package.json`:
```json
{
  "name": "hairywallet",  // ← Cambia esto
  "productName": "HairyWallet"  // ← Y esto
}
```

### Cambiar Icono
Reemplaza estos archivos en la carpeta `build/`:
- `icon.ico` (Windows)
- `icon.icns` (macOS)
- `icon.png` (Linux)

---

## ⚠️ Solución de Problemas

### Error: "electron-builder no encontrado"
```bash
npm install electron-builder --save-dev
```

### Error: "No se puede compilar"
```bash
# Limpia y reinstala
rm -rf node_modules package-lock.json
npm install
npm run build
npm run electron:build
```

### Error: "Falta el icono"
Asegúrate de tener `build/icon.ico` en tu proyecto.

### Windows SmartScreen bloquea la instalación
Esto es normal para apps sin firmar. Los usuarios deben hacer clic en "Más información" > "Ejecutar de todas formas".

Para evitarlo, firma tu instalador con un certificado de código (ver README principal).

---

## 🎉 ¡Listo!

Ahora tienes tu instalador `HairyWallet-Setup-1.0.0.exe` listo para distribuir.

**Siguiente paso**: Súbelo a tu servidor o GitHub y actualiza el enlace de descarga en tu web.

---

## 📚 Más Información

Para documentación completa, consulta el [README.md](README.md) principal.
