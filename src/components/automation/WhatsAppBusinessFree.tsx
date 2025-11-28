import React, { useState } from "react";

type Channel = "telegram" | "discord";

type TestState = {
  loading: boolean;
  ok: boolean | null;
  message: string;
};

const N8N_ENDPOINTS: Record<Channel, string> = {
  telegram: import.meta.env.VITE_N8N_TELEGRAM_WEBHOOK ?? "",
  discord: import.meta.env.VITE_N8N_DISCORD_WEBHOOK ?? "",
};

const WhatsAppBusinessFree: React.FC = () => {
  const [telegramState, setTelegramState] = useState<TestState>({
    loading: false,
    ok: null,
    message: "",
  });

  const [discordState, setDiscordState] = useState<TestState>({
    loading: false,
    ok: null,
    message: "",
  });

  const handleTest = async (channel: Channel) => {
    const endpoint = N8N_ENDPOINTS[channel];

    const setState =
      channel === "telegram" ? setTelegramState : setDiscordState;

    if (!endpoint) {
      setState({
        loading: false,
        ok: false,
        message:
          "⚠️ Falta configurar la URL del webhook de n8n en las variables de entorno.",
      });
      return;
    }

    setState({ loading: true, ok: null, message: "" });

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "test",
          channel,
          source: "HairyPetShop",
          message: `Test de integración desde HairyShop (${channel})`,
        }),
      });

      if (!res.ok) {
        throw new Error(`n8n devolvió ${res.status}`);
      }

      setState({
        loading: false,
        ok: true,
        message: "✅ Test enviado correctamente. Revisa tu flujo en n8n.",
      });
    } catch (error: any) {
      console.error(error);
      setState({
        loading: false,
        ok: false,
        message:
          "❌ Error al llamar al webhook de n8n. Revisa la URL y que el workflow esté activo.",
      });
    }
  };

  const renderStatus = (state: TestState) => {
    if (state.ok === null && !state.message) return null;

    const color =
      state.ok === null
        ? "text-gray-200"
        : state.ok
        ? "text-emerald-300"
        : "text-red-300";

    return <p className={`text-xs mt-2 ${color}`}>{state.message}</p>;
  };

  return (
    <div className="space-y-8">
      {/* Header principal */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-500 rounded-2xl p-6 text-white shadow-xl border border-white/10">
        <h1 className="text-2xl font-bold mb-2">
          Automatización con Telegram & Discord
        </h1>
        <p className="text-sm text-purple-100 max-w-2xl">
          Aquí sustituyes el antiguo sistema de WhatsApp de Readdy por tu propia
          automatización real con <strong>n8n + Telegram + Discord</strong>,
          gestionada por tu ecosistema Hairy. Sin costes por mensaje, sin
          bloqueos de terceros.
        </p>
      </div>

      {/* Configuración general */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Telegram */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5 backdrop-blur">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <i className="ri-telegram-fill text-xl text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Canal de ventas: Telegram
                </h2>
                <p className="text-xs text-emerald-100">
                  Bot de soporte, ventas y notificaciones de pedidos.
                </p>
              </div>
            </div>
          </div>

          <ol className="list-decimal list-inside text-xs text-emerald-50 space-y-1 mb-4">
            <li>
              Crea o usa tu Bot de Telegram con{" "}
              <span className="font-mono">@BotFather</span>.
            </li>
            <li>
              En n8n, crea un workflow con un nodo{" "}
              <span className="font-mono">Webhook</span> de entrada.
            </li>
            <li>
              Copia la URL del webhook de n8n en{" "}
              <span className="font-mono">
                VITE_N8N_TELEGRAM_WEBHOOK
              </span>{" "}
              (archivo <span className="font-mono">.env</span>).
            </li>
            <li>
              Añade un nodo de Telegram (Send Message) apuntando a tu bot y a
              tu chat/canal de ventas.
            </li>
          </ol>

          <button
            type="button"
            onClick={() => handleTest("telegram")}
            disabled={telegramState.loading}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            {telegramState.loading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2" />
                Enviando test a Telegram...
              </>
            ) : (
              <>
                <i className="ri-send-plane-fill mr-2" />
                Enviar mensaje de prueba a Telegram
              </>
            )}
          </button>

          {renderStatus(telegramState)}

          {!N8N_ENDPOINTS.telegram && (
            <p className="text-[11px] text-yellow-300 mt-3">
              ⚠️ No se ha detectado{" "}
              <span className="font-mono">VITE_N8N_TELEGRAM_WEBHOOK</span>.  
              Añádelo en tu archivo <span className="font-mono">.env</span> para
              activar este canal.
            </p>
          )}
        </div>

        {/* Discord */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5 backdrop-blur">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
                <i className="ri-discord-fill text-xl text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Canal de comunidad: Discord
                </h2>
                <p className="text-xs text-indigo-100">
                  Alertas de ventas, comunidad Hairy y panel interno.
                </p>
              </div>
            </div>
          </div>

          <ol className="list-decimal list-inside text-xs text-indigo-50 space-y-1 mb-4">
            <li>
              Crea una aplicación y bot en el{" "}
              <span className="font-mono">Discord Developer Portal</span>.
            </li>
            <li>
              En n8n, crea otro workflow con un nodo{" "}
              <span className="font-mono">Webhook</span>.
            </li>
            <li>
              Copia la URL en{" "}
              <span className="font-mono">VITE_N8N_DISCORD_WEBHOOK</span> en tu{" "}
              <span className="font-mono">.env</span>.
            </li>
            <li>
              Añade un nodo de Discord (webhook o bot) para publicar el mensaje
              en tu servidor/canal.
            </li>
          </ol>

          <button
            type="button"
            onClick={() => handleTest("discord")}
            disabled={discordState.loading}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-500 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            {discordState.loading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2" />
                Enviando test a Discord...
              </>
            ) : (
              <>
                <i className="ri-send-plane-fill mr-2" />
                Enviar mensaje de prueba a Discord
              </>
            )}
          </button>

          {renderStatus(discordState)}

          {!N8N_ENDPOINTS.discord && (
            <p className="text-[11px] text-yellow-300 mt-3">
              ⚠️ No se ha detectado{" "}
              <span className="font-mono">VITE_N8N_DISCORD_WEBHOOK</span>.  
              Añádelo en tu archivo <span className="font-mono">.env</span> para
              activar este canal.
            </p>
          )}
        </div>
      </div>

      {/* Bloque de explicación final */}
      <div className="bg-black/40 rounded-2xl border border-white/10 p-5 text-xs text-gray-100 space-y-2">
        <p className="font-semibold text-white mb-1">
          ¿Qué hemos hecho aquí exactamente?
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Eliminado la dependencia de WhatsApp Business / Luna IA / Readdy.
          </li>
          <li>
            Centralizado la automatización en{" "}
            <strong>n8n + Telegram + Discord</strong>.
          </li>
          <li>
            Este componente solo hace llamadas HTTP a tus webhooks de n8n,
            donde está la lógica real de:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Notificaciones de venta</li>
              <li>Mensajes de bienvenida</li>
              <li>IA vendedora Hairy</li>
            </ul>
          </li>
        </ul>
        <p className="text-[11px] text-gray-300 mt-1">
          Cuando quieras, podemos conectar este panel directamente con el flujo de
          compra (checkout) para que cada pedido dispare un flujo en n8n que
          avise a Telegram/Discord y active tu IA vendedora.
        </p>
      </div>
    </div>
  );
};

export default WhatsAppBusinessFree;
