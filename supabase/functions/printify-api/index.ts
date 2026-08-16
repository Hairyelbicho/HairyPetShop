import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PRINTIFY_API = 'https://api.printify.com/v1'
const USER_AGENT = 'HairyPetShop/1.0 (HairyTools)'

const CURATED_BLUEPRINTS = [
  { id: 6, category: 'tshirt', fallbackTitle: 'Camiseta Unisex Heavy Cotton' },
  { id: 77, category: 'hoodie', fallbackTitle: 'Sudadera Unisex' },
  { id: 144, category: 'cap', fallbackTitle: 'Gorra' },
  { id: 48, category: 'cap', fallbackTitle: 'Gorra Twill' },
]

const GPSR_INFO =
  'GPSR information: Arkadium88 Holdings SL, Espana. Product information: Print-on-demand apparel via Printify. Warnings: No warranty, EU. Care instructions: Machine wash cold, do not bleach, tumble dry low, do not iron print, do not dryclean'

type PrintifyVariant = {
  id: number
  title: string
  options?: { color?: string; size?: string }
  placeholders?: { position: string }[]
  cost?: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const token = Deno.env.get('PRINTIFY_API_TOKEN')
    if (!token) {
      return json({
        success: false,
        configured: false,
        error: 'Falta PRINTIFY_API_TOKEN en los secretos de Supabase.',
      }, 200)
    }

    const { action, data } = await req.json()

    switch (action) {
      case 'status':
        return json(await getStatus(token))
      case 'catalog':
        return json(await getCatalog(token))
      case 'product_options':
        return json(await getProductOptions(token, data?.blueprintId))
      case 'fulfill':
        return json(await fulfillOrder(token, data))
      default:
        return json({ success: false, error: `Accion no soportada: ${action}` }, 400)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error Printify'
    return json({ success: false, error: message }, 200)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function printifyFetch(path: string, token: string, init: RequestInit = {}) {
  const response = await fetch(`${PRINTIFY_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': USER_AGENT,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })

  const text = await response.text()
  let payload: unknown = null
  try {
    payload = text ? JSON.parse(text) : null
  } catch {
    payload = { raw: text }
  }

  if (!response.ok) {
    const details = typeof payload === 'object' && payload
      ? JSON.stringify(payload)
      : text
    throw new Error(`Printify ${response.status}: ${details.slice(0, 800)}`)
  }

  return payload
}

async function getShopId(token: string) {
  const configured = Deno.env.get('PRINTIFY_SHOP_ID')
  if (configured) return Number(configured)

  const shops = await printifyFetch('/shops.json', token) as { id: number; title: string; sales_channel?: string }[]
  const list = Array.isArray(shops) ? shops : []
  const active = list.find((shop) => shop.sales_channel !== 'disconnected') || list[0]
  if (!active?.id) {
    throw new Error('No hay ninguna tienda en Printify. Crea un shop en printify.com y vuelve a intentar.')
  }
  return active.id
}

async function getStatus(token: string) {
  const shops = await printifyFetch('/shops.json', token) as { id: number; title: string; sales_channel?: string }[]
  const list = Array.isArray(shops) ? shops : []
  const shopId = Deno.env.get('PRINTIFY_SHOP_ID')
    ? Number(Deno.env.get('PRINTIFY_SHOP_ID'))
    : list.find((shop) => shop.sales_channel !== 'disconnected')?.id || list[0]?.id || null

  return {
    success: true,
    configured: true,
    shopId,
    shops: list.map((shop) => ({ id: shop.id, title: shop.title, sales_channel: shop.sales_channel })),
  }
}

async function getCatalog(token: string) {
  const products = []

  for (const item of CURATED_BLUEPRINTS) {
    try {
      const blueprint = await printifyFetch(`/catalog/blueprints/${item.id}.json`, token) as {
        id: number
        title: string
        brand?: string
        model?: string
        description?: string
        images?: string[]
      }
      if (products.some((product) => product.category === item.category)) continue
      products.push({
        blueprintId: blueprint.id,
        category: item.category,
        title: blueprint.title || item.fallbackTitle,
        brand: blueprint.brand || '',
        model: blueprint.model || '',
        description: blueprint.description || '',
        image: blueprint.images?.[0] || '',
      })
    } catch {
      // Blueprint no disponible para esta cuenta; se omite.
    }
  }

  return {
    success: true,
    configured: true,
    products,
  }
}

function pickProvider(providers: { id: number; title?: string; location?: { country?: string } }[]) {
  if (!providers.length) throw new Error('Este producto no tiene proveedores de impresion.')
  const spain = providers.find((provider) => provider.location?.country === 'ES' || provider.location?.country === 'Spain')
  const europe = providers.find((provider) => ['DE', 'GB', 'LV', 'PL', 'IT', 'FR', 'NL', 'BE'].includes(provider.location?.country || ''))
  return spain || europe || providers[0]
}

function retailCents(cost?: number) {
  const base = typeof cost === 'number' ? cost : 1200
  return Math.max(Math.round(base * 2.2), base + 800)
}

async function getProductOptions(token: string, blueprintId: number) {
  if (!blueprintId) throw new Error('Falta blueprintId')

  const providers = await printifyFetch(
    `/catalog/blueprints/${blueprintId}/print_providers.json`,
    token,
  ) as { id: number; title?: string; location?: { country?: string } }[]

  const providerList = Array.isArray(providers) ? providers : []
  const provider = pickProvider(providerList)

  const variantsPayload = await printifyFetch(
    `/catalog/blueprints/${blueprintId}/print_providers/${provider.id}/variants.json`,
    token,
  ) as { variants?: PrintifyVariant[] }

  const variants = (variantsPayload.variants || []).map((variant) => ({
    id: variant.id,
    title: variant.title,
    color: variant.options?.color || '',
    size: variant.options?.size || '',
    cost: variant.cost || 0,
    price: retailCents(variant.cost) / 100,
    placeholders: (variant.placeholders || []).map((placeholder) => placeholder.position),
  }))

  const sizes = [...new Set(variants.map((variant) => variant.size).filter(Boolean))]
  const colors = [...new Set(variants.map((variant) => variant.color).filter(Boolean))]

  return {
    success: true,
    configured: true,
    provider: { id: provider.id, title: provider.title || `Proveedor ${provider.id}` },
    variants,
    sizes,
    colors,
  }
}

function encodeBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

async function uploadArtwork(token: string, imageUrl: string, fileName: string) {
  try {
    const uploaded = await printifyFetch('/uploads/images.json', token, {
      method: 'POST',
      body: JSON.stringify({ file_name: fileName, url: imageUrl }),
    }) as { id?: string }
    if (uploaded?.id) return uploaded
  } catch {
    // Printify a veces no puede descargar URLs con redirect (Pollinations). Subimos en base64.
  }

  const imageResponse = await fetch(imageUrl)
  if (!imageResponse.ok) {
    throw new Error('No se pudo descargar el diseno generado para subirlo a Printify.')
  }
  const contents = encodeBase64(await imageResponse.arrayBuffer())
  return await printifyFetch('/uploads/images.json', token, {
    method: 'POST',
    body: JSON.stringify({ file_name: fileName, contents }),
  }) as { id: string }
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  return {
    first_name: parts[0] || 'Cliente',
    last_name: parts.slice(1).join(' ') || 'HairyPetShop',
  }
}

function pickPlaceholder(variants: PrintifyVariant[]) {
  const positions = variants.flatMap((variant) => variant.placeholders || []).map((placeholder) => placeholder.position)
  return positions.find((position) => position === 'front')
    || positions.find((position) => !position.includes('back'))
    || positions[0]
    || 'front'
}

async function fulfillOrder(token: string, data: Record<string, unknown>) {
  const imageUrl = String(data?.imageUrl || '')
  const blueprintId = Number(data?.blueprintId)
  const shipping = (data?.shipping || {}) as Record<string, string>
  const selectedSize = String(data?.size || '')
  const selectedColor = String(data?.color || '')
  const selectedVariantId = data?.variantId ? Number(data.variantId) : null
  const title = String(data?.title || 'HairyTools design')

  if (!imageUrl) throw new Error('Falta la imagen del diseno.')
  if (!blueprintId) throw new Error('Falta el producto Printify.')
  if (!shipping.address || !shipping.city || !shipping.zip || !shipping.name || !shipping.email) {
    throw new Error('Completa nombre, email, direccion, ciudad y codigo postal.')
  }

  const shopId = await getShopId(token)
  const options = await getProductOptions(token, blueprintId)
  const variants = options.variants as {
    id: number
    title: string
    color: string
    size: string
    cost: number
    price: number
    placeholders: string[]
  }[]

  if (!variants.length) throw new Error('Este producto no tiene tallas disponibles.')

  const selected = variants.find((variant) => variant.id === selectedVariantId)
    || variants.find((variant) =>
      (!selectedSize || variant.size === selectedSize) &&
      (!selectedColor || variant.color === selectedColor)
    )
    || variants[0]

  const color = selected.color || selectedColor
  const enabled = variants.filter((variant) => !color || variant.color === color)
  const enabledIds = (enabled.length ? enabled : [selected]).map((variant) => variant.id)

  const artwork = await uploadArtwork(token, imageUrl, `hairytools-${Date.now()}.png`)
  if (!artwork?.id) throw new Error('Printify no devolvio ID de imagen.')

  const placeholderPosition = pickPlaceholder(
    variants.map((variant) => ({
      id: variant.id,
      title: variant.title,
      placeholders: variant.placeholders.map((position) => ({ position })),
    })),
  )

  const product = await printifyFetch(`/shops/${shopId}/products.json`, token, {
    method: 'POST',
    body: JSON.stringify({
      title: `HairyTools — ${title}`.slice(0, 80),
      description: `Diseno generado en HairyTools. ${title}`,
      safety_information: GPSR_INFO,
      blueprint_id: blueprintId,
      print_provider_id: options.provider.id,
      variants: variants.map((variant) => ({
        id: variant.id,
        price: retailCents(variant.cost),
        is_enabled: enabledIds.includes(variant.id),
      })),
      print_areas: [
        {
          variant_ids: enabledIds,
          placeholders: [
            {
              position: placeholderPosition,
              images: [
                {
                  id: artwork.id,
                  x: 0.5,
                  y: 0.5,
                  scale: 1,
                  angle: 0,
                },
              ],
            },
          ],
        },
      ],
    }),
  }) as {
    id: string
    title: string
    images?: { src: string; is_default?: boolean }[]
    variants?: { id: number; price: number }[]
  }

  const names = splitName(shipping.name)
  const order = await printifyFetch(`/shops/${shopId}/orders.json`, token, {
    method: 'POST',
    body: JSON.stringify({
      external_id: `hairy-${Date.now()}`,
      label: 'HairyTools',
      line_items: [
        {
          product_id: product.id,
          variant_id: selected.id,
          quantity: 1,
        },
      ],
      shipping_method: 1,
      send_shipping_notification: false,
      address_to: {
        first_name: names.first_name,
        last_name: names.last_name,
        email: shipping.email,
        phone: shipping.phone || '000000000',
        country: (shipping.country || 'ES').toUpperCase(),
        region: shipping.region || '',
        address1: shipping.address,
        city: shipping.city,
        zip: shipping.zip,
      },
    }),
  }) as { id?: string; status?: string }

  const mockup = product.images?.find((image) => image.is_default)?.src || product.images?.[0]?.src || ''

  return {
    success: true,
    configured: true,
    productId: product.id,
    orderId: order.id,
    orderStatus: order.status,
    mockup,
    variant: selected,
    retailPrice: selected.price,
    shopId,
  }
}
