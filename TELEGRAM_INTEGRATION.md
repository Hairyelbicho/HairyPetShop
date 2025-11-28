# Integración Telegram + n8n + Discord - HairyPetShop

## 📋 Resumen de la Migración

Este proyecto ha sido migrado de **WhatsApp Business + IA Luna** a **Telegram Bot + n8n + Discord** para mejorar la automatización y el seguimiento del flujo de ventas.

## 🔧 Configuración

### Credenciales Configuradas

#### Telegram Bot
- **Bot Username**: `@HairyPet_bot`
- **Bot Token**: `7611611121:AAHkEDU1_QK68PKLH2ac-2Ikldi5JukOx4A`
- **Usuario ID**: `813631400`
- **Cuenta**: `@Tokten43`

#### Discord
- **App ID**: `1428835819023765635`
- **Public Key**: `52d1ecb9b88748a932abef91c3c87bcc93de8444c8e8be91d852b78490d43628`
- **Bot Token**: `MTQyODgzNTgxOTAyMzc2NTYzNQ.GEy24C.r7W6kG-4CucVsQxMubzVMZx8ZD0Fmpzy1k3CL0`
- **Servidor**: Hairy_el_Bicho - HairyPetShop Notificaciones
- **Webhook URL**: `https://discord.com/api/webhooks/1430691532603916400/ZxqUPOlM6NYyuRkIo_O3yQGAGVuq1Bij3ZF4ZvvP51PMUe5xTmzr9Z_oX1IieGeWjrpt`

#### n8n
- **API Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDMxMDgxOS1lNjY2LTQ1OTUtYjQ0Zi0zYzBjNGUyYTYxZTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzYwNzQwMzMxfQ.FMifXNxFbN-7WK-KCXP2NpPcu9UHvg7sBNs9wokCepY`
- **Nombre del Workflow**: HairyPetStore

## 📁 Archivos Creados/Modificados

### Nuevos Archivos
1. **`src/components/automation/TelegramBusinessFree.tsx`**
   - Componente principal que reemplaza WhatsAppBusinessFree
   - Integración completa con Telegram, n8n y Discord
   - Gestión de leads, mensajes y conversiones

2. **`src/services/telegramService.ts`**
   - Servicio centralizado para todas las integraciones
   - Funciones para enviar mensajes a Telegram
   - Funciones para notificar a Discord
   - Funciones para enviar eventos a n8n

### Archivos Modificados
1. **`src/components/automation/WhatsAppBusinessFree.tsx`**
   - Ahora redirige a TelegramBusinessFree para mantener compatibilidad
   - El código original está comentado/eliminado

## 🚀 Uso

### Importar el Componente

```tsx
import TelegramBusinessFree from './components/automation/TelegramBusinessFree';

// O usar el wrapper de compatibilidad
import WhatsAppBusinessFree from './components/automation/WhatsAppBusinessFree';
```

### Funcionalidades

1. **Detección de Leads**: Detecta automáticamente nuevos leads desde múltiples fuentes
2. **Envío de Mensajes**: Envía mensajes personalizados a través del bot de Telegram
3. **Notificaciones Discord**: Todas las acciones importantes se notifican en Discord
4. **Automatización n8n**: Los eventos se envían a n8n para procesamiento avanzado
5. **Seguimiento de Conversiones**: Rastrea leads desde detección hasta conversión

## 🔗 Configuración de n8n

Para configurar el webhook de n8n, necesitas:

1. Crear un workflow en n8n con un nodo Webhook
2. Configurar la URL del webhook (ej: `https://tu-instancia-n8n.com/webhook/telegram-lead`)
3. Actualizar la variable `N8N_WEBHOOK_URL` en `telegramService.ts` o usar la variable de entorno `REACT_APP_N8N_WEBHOOK_URL`

### Eventos Enviados a n8n

- **`new_lead`**: Cuando se detecta un nuevo lead
  ```json
  {
    "event": "new_lead",
    "data": {
      "leadId": "string",
      "name": "string",
      "chatId": "string",
      "product": "string",
      "source": "string"
    }
  }
  ```

- **`message_sent`**: Cuando se envía un mensaje
  ```json
  {
    "event": "message_sent",
    "data": {
      "leadId": "string",
      "chatId": "string",
      "message": "string"
    }
  }
  ```

- **`conversion`**: Cuando se convierte un lead en venta
  ```json
  {
    "event": "conversion",
    "data": {
      "leadId": "string",
      "chatId": "string",
      "product": "string",
      "revenue": number
    }
  }
  ```

## 📱 Notificaciones de Discord

Las notificaciones se envían automáticamente a Discord con:
- **Nuevos Leads**: Color azul (#0088ff)
- **Mensajes Enviados**: Color verde (#00ff00)
- **Conversiones**: Color naranja (#ffaa00)

## 🔄 Flujo de Venta

1. **Detección**: El sistema detecta un nuevo lead (web, producto visto, carrito abandonado, etc.)
2. **Notificación**: Se notifica en Discord y se envía evento a n8n
3. **Contacto**: Se envía mensaje personalizado a través del bot de Telegram
4. **Seguimiento**: El lead se marca como "contactado"
5. **Conversión**: Cuando se completa la venta, se marca como "convertido" y se registra el ingreso

## 🛠️ Variables de Entorno (Opcional)

Puedes crear un archivo `.env` para configurar las URLs:

```env
REACT_APP_N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/telegram-lead
```

## 📝 Notas Importantes

- El bot de Telegram debe estar activo y configurado correctamente
- Los `chat_id` deben ser válidos para enviar mensajes
- El webhook de Discord debe estar configurado correctamente
- La API key de n8n debe tener permisos para enviar datos

## 🔐 Seguridad

⚠️ **IMPORTANTE**: Los tokens y credenciales están hardcodeados en el código. Para producción, considera:
- Usar variables de entorno
- Almacenar credenciales de forma segura
- Implementar autenticación adicional
- Usar un backend para manejar las llamadas a las APIs

## 📞 Soporte

Para más información sobre la integración, consulta:
- [Documentación de Telegram Bot API](https://core.telegram.org/bots/api)
- [Documentación de Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
- [Documentación de n8n](https://docs.n8n.io/)

