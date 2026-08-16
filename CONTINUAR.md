# HairyPetShop — dónde lo dejamos (16 ago 2026)

Ábrelo mañana **antes de tocar código**. Este archivo es el mapa del proyecto, no el README de marketing (`README.md`).

## En 30 segundos

- App React/Vite: tienda + HairyWallet (Solana) + Hairy Home + HairyTools + dashboards.
- Carpeta: `H:\HairyPetShop`
- Repo: https://github.com/Hairyelbicho/HairyPetShop (`main`)
- **La web pública NO es este repo.** [hairyelbicho.com](https://www.hairyelbicho.com) sigue siendo un export viejo de **Readdy** (logo “Website Builder”). Por eso no se ve HairyTools.
- Printify **sí está cableado en local** (sesión de hoy). Falta token API + desplegar la función de Supabase.
- **No hay push a GitHub todavía** salvo que lo hagas mañana a propósito.

Arranque local:

```bash
cd H:\HairyPetShop
npm run dev
```

Abre `http://localhost:5173` y `/hairy-tools`.

`.env` local (NO commitear): `VITE_PUBLIC_SUPABASE_URL`, `VITE_PUBLIC_SUPABASE_ANON_KEY`, `VITE_GROQ_API_KEY`. No hay claves Printify.

---

## Qué hicimos hoy (16 ago)

1. Análisis: prototipo avanzado, parado desde mayo 2026. `package.json` se llama `"react"` / `0.0.0`. Electron/Capacitor están a medias. `node_modules` y `dist` siguen trackeados en git (problema viejo).
2. Printify **no estaba instalado**. Solo un comentario y un botón falso en HairyTools.
3. Se implementó Printify de verdad:
   - `supabase/functions/printify-api/index.ts` — proxy (el token NO va al navegador)
   - `src/utils/printify.ts` — cliente frontend
   - `src/pages/hairy-tools/page.tsx` — botón **Imprimir con Printify**, catálogo, tallas/colores, envío, pedido
4. Se revisó la web en vivo y GitHub:
   - En **GitHub** sí existe `/hairy-tools` y el botón en la **home**.
   - En **hairyelbicho.com** no hay HairyTools. `/hairy-home` cambia la URL pero sigue mostrando la tienda.
   - Hairy Home (código) **no tiene** enlace a HairyTools.
   - La API Printify de hoy **no estaba en GitHub** hasta este commit local.

---

## Printify — siguiente paso (bloquea pedidos reales)

Hace falta cuenta Printify + token. **No pongas el token en `.env` con `VITE_`.**

1. Cuenta y shop: https://printify.com/app/register
2. Token: My Profile → Connections. Permisos: shops, catalog, products, uploads, orders, print_providers.
3. En Supabase (proyecto ya usado: `lyurtjkckwggjlzgqyoh`):

```bash
npx supabase secrets set PRINTIFY_API_TOKEN=EL_TOKEN PRINTIFY_SHOP_ID=EL_SHOP_ID
npx supabase functions deploy printify-api
```

`PRINTIFY_SHOP_ID` es opcional: si falta, usa el primer shop activo.

Flujo: el cliente paga a Hairy (Stripe/SOL); Printify cobra **a la cuenta comerciante**. Son dos cobros.

Hasta que no esté el secreto + deploy, HairyTools dirá que Printify no está configurado.

---

## Tres copias distintas (no las mezcles)

| Sitio | Qué es | HairyTools | Printify API |
|---|---|---|---|
| [hairyelbicho.com](https://www.hairyelbicho.com) | Readdy viejo | No | No |
| GitHub `main` (antes de hoy) | Código Vite | Página + botón en home | Solo maqueta Unsplash |
| Disco `H:\HairyPetShop` | Trabajo de hoy | Página + Printify real | Función lista, sin token |

Mañana, si quieres que se vea en el dominio: publicar **este** repo (Vercel/Netlify) contra `hairyelbicho.com`, no reeditar Readdy a ciegas. Hay que SPA rewrite (`/hairy-home`, `/hairy-tools` → `index.html`).

---

## Mañana, por orden

1. Abrir este archivo. `npm run dev`. Probar `/hairy-tools`.
2. Crear token Printify y desplegar `printify-api`.
3. Poner botón HairyTools también en `src/pages/hairy-home/page.tsx` (ahora no está).
4. Decidir publicación: Vercel con este repo vs seguir en Readdy.
5. Seguridad pendiente (no bloquea el arranque):
   - Rotar tokens que están en claro en `TELEGRAM_INTEGRATION.md` y en edge functions de Telegram.
   - Wallet: mnemonic/`secretKey` en `localStorage` con `btoa` (no es cifrado). No usar mainnet con fondos reales así.
   - Quitar `node_modules`/`dist` del git cuando haya tiempo (`git rm -r --cached node_modules dist`).
   - No commitear `.env`.

No hace falta Electron ni Capacitor para mañana.

---

## Archivos clave

- Tienda: `src/pages/home/page.tsx`
- Hairy Home: `src/pages/hairy-home/page.tsx`
- HairyTools + Printify UI: `src/pages/hairy-tools/page.tsx`
- Rutas: `src/router/config.tsx`
- Printify cliente: `src/utils/printify.ts`
- Printify backend: `supabase/functions/printify-api/index.ts`
- Bot chat (Groq): `src/components/chat/HairyBot.tsx`

Comandos: `npm run dev` / `npm run build`. Los scripts `electron:*` del README viejo **no existen** en `package.json`.

---

Última sesión: 16 ago 2026, ~16:30. Paramos aquí. Continuar por **Printify token + deploy**, no por más features.
