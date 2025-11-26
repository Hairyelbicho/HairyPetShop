# 🐾 HairyWallet - Tu Wallet de Solana

![HairyWallet Logo](https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/0c2f33e0a05f2c11011f4287446eae74.png)

## 📋 Descripción

HairyWallet es una wallet de Solana completa y segura que te permite gestionar tus criptomonedas de forma sencilla. Disponible como:
- **🌐 App Web (PWA)**: Instalable en cualquier dispositivo
- **💻 App de Escritorio**: Versión nativa para Windows, macOS y Linux

## 🚀 Características Principales

### 🔐 Seguridad Total
- **Claves privadas locales**: Nunca salen de tu dispositivo
- **Encriptación avanzada**: Protección de nivel bancario
- **Frase de recuperación**: Backup seguro de 12/24 palabras
- **Sin custodia**: Tú controlas tus fondos 100%

### 💸 Funcionalidades
- **Crear wallet**: Genera una nueva wallet de Solana
- **Importar wallet**: Usa tu frase de recuperación existente
- **Enviar SOL**: Transferencias rápidas y seguras
- **Recibir SOL**: Genera códigos QR para pagos
- **Historial**: Consulta todas tus transacciones
- **Balance en tiempo real**: Actualización automática

### 🌟 Multiplataforma
- **Web (PWA)**: Funciona en Chrome, Edge, Safari, Firefox
- **Windows**: Instalador .EXE nativo
- **macOS**: Aplicación .DMG (próximamente)
- **Linux**: AppImage universal (próximamente)
- **iOS**: Instalable desde Safari
- **Android**: Instalable desde Chrome

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** con TypeScript
- **Tailwind CSS** para estilos
- **Vite** como bundler
- **React Router DOM** para navegación

### Blockchain
- **@solana/web3.js**: Integración con Solana
- **bs58**: Codificación de claves
- **tweetnacl**: Criptografía

### PWA
- **Service Worker**: Funcionalidad offline
- **Web App Manifest**: Instalación nativa
- **Push Notifications**: Notificaciones en tiempo real

### Desktop (Electron)
- **Electron 28**: Framework de escritorio
- **Electron Builder**: Generación de instaladores
- **IPC**: Comunicación segura entre procesos

## 📁 Estructura del Proyecto

```
hairywallet/
├── electron/                    # Aplicación de escritorio
│   ├── main.js                 # Proceso principal de Electron
│   └── preload.js              # Script de precarga seguro
├── build/                       # Recursos para instaladores
│   ├── installer.nsh           # Script NSIS personalizado
│   ├── entitlements.mac.plist  # Permisos macOS
│   └── icon.ico/icns/png       # Iconos de la app
├── public/
│   ├── manifest.json           # Configuración PWA
│   ├── sw.js                   # Service Worker
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── automation/         # Componentes de automatización
│   │   ├── notifications/      # Sistema de notificaciones
│   │   ├── payments/           # Procesadores de pago
│   │   └── youtube/            # Integración YouTube
│   ├── pages/
│   │   ├── hairy-wallet/       # Página principal de wallet
│   │   ├── hairy-wallet-crear/ # Crear nueva wallet
│   │   ├── hairy-wallet-importar/ # Importar wallet
│   │   ├── hairy-wallet-enviar/ # Enviar SOL
│   │   ├── hairy-wallet-recibir/ # Recibir SOL
│   │   ├── hairy-wallet-historial/ # Historial
│   │   ├── wallet-login/       # Inicio de sesión
│   │   ├── wallet-register/    # Registro
│   │   └── download-wallet/    # Página de descarga
│   ├── router/
│   │   ├── config.tsx          # Configuración de rutas
│   │   └── index.ts            # Router principal
│   ├── utils/
│   │   ├── performance.ts      # Optimizaciones
│   │   ├── security.ts         # Utilidades de seguridad
│   │   └── supabase.ts         # Cliente Supabase
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/functions/          # Edge Functions
├── electron-builder.json        # Configuración de Electron Builder
├── package.json
├── vite.config.ts
└── README.md
```

## 🔧 Instalación y Configuración

### Requisitos Previos
- **Node.js** 18 o superior
- **npm** o **yarn**
- **Git**

### 1. Clonar el repositorio
```bash
git clone https://github.com/Hairyelbicho/hairywalletmovil-33.git
cd hairywalletmovil-33
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```env
VITE_PUBLIC_SUPABASE_URL=tu_supabase_url
VITE_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Ejecutar en modo desarrollo

#### Versión Web
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

#### Versión Escritorio (Electron)
```bash
npm run electron:dev
```
Esto iniciará el servidor de Vite y abrirá la aplicación en Electron automáticamente.

## 📦 Compilación y Distribución

### Compilar Versión Web (PWA)
```bash
npm run build
```
Los archivos compilados estarán en la carpeta `dist/`

### Generar Instalador de Windows (.EXE)
```bash
npm run electron:build
```
El instalador se generará en `release/HairyWallet-Setup-1.0.0.exe`

**Características del instalador:**
- ✅ Instalación en `C:\Program Files\HairyWallet\`
- ✅ Acceso directo en Escritorio
- ✅ Acceso directo en Menú Inicio
- ✅ Desinstalador incluido
- ✅ Opción de ejecutar al finalizar instalación

### Generar Instalador Portable (Windows)
```bash
npm run electron:build:portable
```
Genera un ejecutable portable que no requiere instalación.

### Compilar para Todas las Plataformas
```bash
npm run electron:build:all
```
Genera instaladores para Windows, macOS y Linux.

**Nota:** Para compilar para macOS necesitas estar en un Mac. Para Linux puedes compilar desde cualquier sistema.

## 🎯 Guía de Uso

### Para Usuarios Finales

#### Opción 1: Instalar App Web (PWA) - Recomendado ⭐

**En PC (Chrome/Edge):**
1. Abre HairyWallet en tu navegador
2. Busca el icono de instalación 📥 en la barra de direcciones
3. Haz clic en "Instalar HairyWallet"
4. ¡Listo! La app se abrirá en una ventana independiente

**En iPhone/iPad (Safari):**
1. Abre HairyWallet en Safari
2. Toca el botón de compartir 📤 (abajo en el centro)
3. Selecciona "Añadir a pantalla de inicio"
4. Toca "Añadir"
5. ¡Listo! Verás el icono en tu pantalla de inicio

**En Android (Chrome):**
1. Abre HairyWallet en Chrome
2. Toca el menú ⋮ (tres puntos arriba a la derecha)
3. Selecciona "Instalar aplicación"
4. Toca "Instalar"
5. ¡Listo! La app se instalará en tu dispositivo

#### Opción 2: Instalar App de Escritorio (Windows)

1. Descarga `HairyWallet-Setup.exe` desde la página de descargas
2. Ejecuta el instalador
3. Sigue las instrucciones en pantalla
4. Acepta la instalación de fuentes desconocidas si es necesario
5. ¡Listo! HairyWallet se abrirá automáticamente

### Para Desarrolladores

#### Estructura de Electron

**electron/main.js** - Proceso principal:
- Crea y gestiona la ventana de la aplicación
- Maneja el icono de la bandeja del sistema
- Configura el menú de la aplicación
- Implementa atajos de teclado
- Gestiona eventos del sistema

**electron/preload.js** - Script de precarga:
- Expone APIs seguras al renderer
- Previene acceso directo a Node.js
- Implementa comunicación IPC segura

**electron-builder.json** - Configuración del builder:
- Define targets de compilación
- Configura iconos y recursos
- Establece opciones del instalador NSIS
- Define metadatos de la aplicación

#### Personalizar el Instalador

Edita `build/installer.nsh` para personalizar:
- Mensajes de bienvenida
- Accesos directos adicionales
- Registro de protocolos personalizados
- Acciones post-instalación

#### Firmar el Instalador (Opcional)

Para firmar digitalmente tu instalador:

1. Obtén un certificado de firma de código (.pfx)
2. Crea el archivo `.electron-builder.env`:
```env
WIN_CSC_LINK=ruta/al/certificado.pfx
WIN_CSC_KEY_PASSWORD=tu_contraseña
```
3. Compila normalmente: `npm run electron:build`

El instalador firmado generará más confianza en los usuarios.

## 🔐 Seguridad

### Mejores Prácticas Implementadas

1. **Aislamiento de Contexto**: `contextIsolation: true` en Electron
2. **Sin Node Integration**: `nodeIntegration: false`
3. **Preload Script**: Exposición controlada de APIs
4. **CSP Headers**: Política de seguridad de contenido
5. **HTTPS**: Forzado en producción
6. **Sanitización**: Validación de todos los inputs
7. **Encriptación Local**: Claves privadas encriptadas

### Almacenamiento Seguro

- **Claves privadas**: Encriptadas con AES-256
- **Frase de recuperación**: Solo se muestra una vez
- **Contraseñas**: Hasheadas con bcrypt
- **Tokens**: Almacenados en memoria, no en localStorage

## 🧪 Testing

### Ejecutar Tests
```bash
npm run test
```

### Tests de Integración
```bash
npm run test:integration
```

### Tests E2E con Electron
```bash
npm run test:electron
```

## 📱 PWA - Progressive Web App

### Características PWA Implementadas

✅ **Instalable**: Funciona como app nativa  
✅ **Offline**: Service Worker con cache inteligente  
✅ **Responsive**: Diseño adaptable a todos los dispositivos  
✅ **Fast**: Carga instantánea con precaching  
✅ **Engaging**: Notificaciones push  
✅ **Safe**: Servido sobre HTTPS  

### Estrategia de Cache

- **Network First**: Para datos dinámicos (balance, transacciones)
- **Cache First**: Para recursos estáticos (CSS, JS, imágenes)
- **Stale While Revalidate**: Para contenido que puede estar desactualizado

### Actualización del Service Worker

El Service Worker se actualiza automáticamente cuando detecta cambios. Los usuarios verán la nueva versión al recargar la página.

## 🚀 Despliegue

### Desplegar PWA

#### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Distribuir App de Escritorio

#### Windows
1. Compila el instalador: `npm run electron:build`
2. El archivo estará en `release/HairyWallet-Setup-1.0.0.exe`
3. Súbelo a tu servidor o GitHub Releases
4. Actualiza el enlace en `/download-wallet`

#### Auto-Updates (Opcional)

Para implementar actualizaciones automáticas:

1. Configura GitHub Releases o un servidor propio
2. Añade en `electron-builder.json`:
```json
{
  "publish": {
    "provider": "github",
    "owner": "tu-usuario",
    "repo": "hairywallet"
  }
}
```
3. Configura `GH_TOKEN` en `.electron-builder.env`
4. Electron Builder manejará las actualizaciones automáticamente

## 🐛 Solución de Problemas

### La PWA no se puede instalar

**Problema**: No aparece el botón de instalación  
**Solución**: 
- Verifica que estés usando HTTPS (o localhost)
- Asegúrate de que el Service Worker esté registrado
- Comprueba que `manifest.json` sea válido
- Usa Chrome DevTools > Application > Manifest

### El instalador .EXE no se genera

**Problema**: Error al ejecutar `npm run electron:build`  
**Solución**:
- Verifica que todas las dependencias estén instaladas: `npm install`
- Asegúrate de tener Node.js 18+
- Comprueba que la carpeta `build/` tenga los iconos necesarios
- Revisa los logs de error en la consola

### La app de escritorio no inicia

**Problema**: La ventana de Electron no se abre  
**Solución**:
- Verifica que el build de Vite esté completo: `npm run build`
- Comprueba la consola de Electron para errores
- Asegúrate de que `electron/main.js` no tenga errores de sintaxis
- Intenta con: `npm run electron:dev` para ver logs detallados

### Error de firma de código

**Problema**: Windows SmartScreen bloquea la instalación  
**Solución**:
- Firma digitalmente tu instalador con un certificado válido
- O indica a los usuarios que hagan clic en "Más información" > "Ejecutar de todas formas"
- Considera usar un certificado EV para evitar SmartScreen

## 📊 Roadmap

### Versión 1.1 (Próximamente)
- [ ] Soporte para tokens SPL
- [ ] Integración con NFTs
- [ ] Staking de SOL
- [ ] Múltiples cuentas

### Versión 1.2
- [ ] Intercambio integrado (Swap)
- [ ] Gráficos de precio en tiempo real
- [ ] Exportar historial a CSV
- [ ] Modo oscuro/claro

### Versión 2.0
- [ ] Soporte multi-blockchain (Ethereum, Polygon)
- [ ] DApp Browser integrado
- [ ] Hardware wallet support (Ledger, Trezor)
- [ ] Versión móvil nativa (React Native)

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor:

1. **Fork** el repositorio
2. **Crea una rama**: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** tus cambios: `git commit -m 'Añadir nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. **Abre un Pull Request**

### Guía de Estilo

- **TypeScript**: Tipado estricto
- **ESLint**: Seguir las reglas configuradas
- **Commits**: Usar Conventional Commits
- **Tests**: Añadir tests para nuevas funcionalidades

## 📞 Soporte y Contacto

### Soporte Técnico
- **GitHub Issues**: [github.com/Hairyelbicho/hairywalletmovil-33/issues](https://github.com/Hairyelbicho/hairywalletmovil-33/issues)
- **Email**: support@hairywallet.com

### Comunidad
- **Discord**: [discord.gg/hairywallet](https://discord.gg/hairywallet)
- **Twitter**: [@hairywallet](https://twitter.com/hairywallet)
- **Telegram**: [t.me/hairywallet](https://t.me/hairywallet)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Solana Foundation**: Por la blockchain increíble
- **Electron**: Por hacer posible las apps de escritorio
- **React Team**: Por el framework excepcional
- **Comunidad Open Source**: Por todas las librerías utilizadas

---

**¡Gracias por usar HairyWallet! 🐾**

*Tu wallet de Solana, segura y fácil de usar*

**Versión**: 1.0.0  
**Última actualización**: 2024  
**Mantenido por**: HairyWallet Team
