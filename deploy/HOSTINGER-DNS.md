# DNS Hostinger — hairyelbicho.com → VPS actual (Docker)

VPS: `72.60.127.160` (mismo que TaxiDriver; HairyPetShop va en contenedores propios).

En el panel de Hostinger (Dominios → DNS), **borra** los registros que apuntan a Vercel (`76.76.21.21`, `vercel-dns`, `vercel-dns-017.com`) y deja:

| Tipo | Nombre | Destino / valor  | TTL |
|------|--------|------------------|-----|
| A    | @      | 72.60.127.160    | 300 |
| A    | www    | 72.60.127.160    | 300 |

No toques los DNS de AutomaDrive ni de TaxiDriver.

Tras el cambio (5–30 min):
- http://hairyelbicho.com → nginx del VPS → contenedor `hairypetshop-web` (`:8090`)
- `/api/*` → API propia en Docker (`hairypetshop-api`)
- HTTPS: `certbot --nginx -d hairyelbicho.com -d www.hairyelbicho.com` (cuando el DNS ya apunte aquí)

Preview sin DNS: `http://72.60.127.160:8090`
