# DNS Hostinger — hairyelbicho.com → VPS actual (Docker)

VPS: `72.60.127.160` (mismo que TaxiDriver; HairyPetShop va en contenedores propios).

En el panel de Hostinger (Dominios → DNS), **borra** los registros que apuntan a Vercel (`76.76.21.21`, `vercel-dns`, `vercel-dns-017.com`) y deja:

| Tipo | Nombre | Destino / valor  | TTL |
|------|--------|------------------|-----|
| A    | @      | 72.60.127.160    | 300 |
| A    | www    | 72.60.127.160    | 300 |

No toques los DNS de AutomaDrive ni de TaxiDriver.

**n8n (Render), si lo vas a cerrar:** borra el CNAME `n8n` → `n8n-hairypetshop.onrender.com`. Luego en Render: Delete service `n8n-hairypetshop` (y `hairy-utils` / crons si existen). Eso ahorra el plan de Render (5 GB allí), no disco del VPS.

**Estado 17 ago noche:** `@` y `www` ya resuelven a `72.60.127.160`. HTTP sirve HairyPetShop.

**HTTPS pendiente:** el :443 del VPS sigue mostrando el certificado de `taxidriver.arkadium88holdingssl.com` → `NET::ERR_CERT_COMMON_NAME_INVALID`. Emitir con `deploy/issue-letsencrypt.sh` o:

```bash
certbot --nginx -d hairyelbicho.com -d www.hairyelbicho.com --non-interactive --agree-tos --email ark88@arkadium88holdingssl.com --redirect
```

Tras el cambio:
- http://hairyelbicho.com → nginx del VPS → contenedor `hairypetshop-web` (`:8090`)
- `/api/*` → API propia en Docker (`hairypetshop-api`)
- https://hairyelbicho.com → el mismo vhost, **después** de certbot

Preview sin DNS: `http://72.60.127.160:8090`
