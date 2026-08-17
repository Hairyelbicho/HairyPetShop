const PRINTIFY_API = 'https://api.printify.com/v1';
const USER_AGENT = 'HairyPetShop/1.0 (HairyTools)';

const CURATED_BLUEPRINTS = [
  { id: 6, category: 'tshirt', fallbackTitle: 'Camiseta Unisex Heavy Cotton' },
  { id: 77, category: 'hoodie', fallbackTitle: 'Sudadera Unisex' },
  { id: 144, category: 'cap', fallbackTitle: 'Gorra' },
  { id: 48, category: 'cap', fallbackTitle: 'Gorra Twill' },
];

const GPSR_INFO =
  'GPSR information: Arkadium88 Holdings SL, Espana. Product information: Print-on-demand apparel via Printify. Warnings: No warranty, EU. Care instructions: Machine wash cold, do not bleach, tumble dry low, do not iron print, do not dryclean';

export async function handlePrintify(action, data) {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) {
    return {
      success: false,
      configured: false,
      error: 'Falta PRINTIFY_API_TOKEN en backend/.env (API propia, no Supabase).',
    };
  }

  switch (action) {
    case 'status':
      return getStatus(token);
    case 'catalog':
      return getCatalog(token);
    case 'product_options':
      return getProductOptions(token, data?.blueprintId);
    case 'fulfill':
      return fulfillOrder(token, data || {});
    default:
      return { success: false, error: `Accion no soportada: ${action}` };
  }
}

async function printifyFetch(path, token, init = {}) {
  const response = await fetch(`${PRINTIFY_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': USER_AGENT,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    const details = typeof payload === 'object' && payload ? JSON.stringify(payload) : text;
    throw new Error(`Printify ${response.status}: ${String(details).slice(0, 800)}`);
  }
  return payload;
}

async function getShopId(token) {
  const configured = process.env.PRINTIFY_SHOP_ID;
  if (configured) return Number(configured);
  const shops = await printifyFetch('/shops.json', token);
  const list = Array.isArray(shops) ? shops : [];
  const active = list.find((shop) => shop.sales_channel !== 'disconnected') || list[0];
  if (!active?.id) {
    throw new Error('No hay ninguna tienda en Printify. Crea un shop en printify.com.');
  }
  return active.id;
}

async function getStatus(token) {
  const shops = await printifyFetch('/shops.json', token);
  const list = Array.isArray(shops) ? shops : [];
  const shopId = process.env.PRINTIFY_SHOP_ID
    ? Number(process.env.PRINTIFY_SHOP_ID)
    : list.find((shop) => shop.sales_channel !== 'disconnected')?.id || list[0]?.id || null;
  return {
    success: true,
    configured: true,
    shopId,
    shops: list.map((shop) => ({ id: shop.id, title: shop.title, sales_channel: shop.sales_channel })),
  };
}

async function getCatalog(token) {
  const products = [];
  for (const item of CURATED_BLUEPRINTS) {
    try {
      const blueprint = await printifyFetch(`/catalog/blueprints/${item.id}.json`, token);
      if (products.some((product) => product.category === item.category)) continue;
      products.push({
        blueprintId: blueprint.id,
        category: item.category,
        title: blueprint.title || item.fallbackTitle,
        brand: blueprint.brand || '',
        model: blueprint.model || '',
        description: blueprint.description || '',
        image: blueprint.images?.[0] || '',
      });
    } catch {
      // omit missing blueprints
    }
  }
  return { success: true, configured: true, products };
}

function pickProvider(providers) {
  if (!providers.length) throw new Error('Este producto no tiene proveedores de impresion.');
  const spain = providers.find((provider) => provider.location?.country === 'ES' || provider.location?.country === 'Spain');
  const europe = providers.find((provider) => ['DE', 'GB', 'LV', 'PL', 'IT', 'FR', 'NL', 'BE'].includes(provider.location?.country || ''));
  return spain || europe || providers[0];
}

function retailCents(cost) {
  const base = typeof cost === 'number' ? cost : 1200;
  return Math.max(Math.round(base * 2.2), base + 800);
}

async function getProductOptions(token, blueprintId) {
  if (!blueprintId) throw new Error('Falta blueprintId');
  const providers = await printifyFetch(`/catalog/blueprints/${blueprintId}/print_providers.json`, token);
  const providerList = Array.isArray(providers) ? providers : [];
  const provider = pickProvider(providerList);
  const variantsPayload = await printifyFetch(
    `/catalog/blueprints/${blueprintId}/print_providers/${provider.id}/variants.json`,
    token,
  );
  const variants = (variantsPayload.variants || []).map((variant) => ({
    id: variant.id,
    title: variant.title,
    color: variant.options?.color || '',
    size: variant.options?.size || '',
    cost: variant.cost || 0,
    price: retailCents(variant.cost) / 100,
    placeholders: (variant.placeholders || []).map((placeholder) => placeholder.position),
  }));
  return {
    success: true,
    configured: true,
    provider: { id: provider.id, title: provider.title || `Proveedor ${provider.id}` },
    variants,
    sizes: [...new Set(variants.map((variant) => variant.size).filter(Boolean))],
    colors: [...new Set(variants.map((variant) => variant.color).filter(Boolean))],
  };
}

function encodeBase64(buffer) {
  return Buffer.from(buffer).toString('base64');
}

async function uploadArtwork(token, imageUrl, fileName) {
  try {
    const uploaded = await printifyFetch('/uploads/images.json', token, {
      method: 'POST',
      body: JSON.stringify({ file_name: fileName, url: imageUrl }),
    });
    if (uploaded?.id) return uploaded;
  } catch {
    // fallback base64
  }
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) throw new Error('No se pudo descargar el diseno generado para Printify.');
  const contents = encodeBase64(await imageResponse.arrayBuffer());
  return printifyFetch('/uploads/images.json', token, {
    method: 'POST',
    body: JSON.stringify({ file_name: fileName, contents }),
  });
}

function splitName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/);
  return { first_name: parts[0] || 'Cliente', last_name: parts.slice(1).join(' ') || 'HairyPetShop' };
}

async function fulfillOrder(token, data) {
  const imageUrl = String(data?.imageUrl || '');
  const blueprintId = Number(data?.blueprintId);
  const shipping = data?.shipping || {};
  const selectedSize = String(data?.size || '');
  const selectedColor = String(data?.color || '');
  const selectedVariantId = data?.variantId ? Number(data.variantId) : null;
  const title = String(data?.title || 'HairyTools design');

  if (!imageUrl) throw new Error('Falta la imagen del diseno.');
  if (!blueprintId) throw new Error('Falta el producto Printify.');
  if (!shipping.address || !shipping.city || !shipping.zip || !shipping.name || !shipping.email) {
    throw new Error('Completa nombre, email, direccion, ciudad y codigo postal.');
  }

  const shopId = await getShopId(token);
  const options = await getProductOptions(token, blueprintId);
  const variants = options.variants;
  if (!variants.length) throw new Error('Este producto no tiene tallas disponibles.');

  const selected = variants.find((variant) => variant.id === selectedVariantId)
    || variants.find((variant) => (!selectedSize || variant.size === selectedSize) && (!selectedColor || variant.color === selectedColor))
    || variants[0];

  const color = selected.color || selectedColor;
  const enabled = variants.filter((variant) => !color || variant.color === color);
  const enabledIds = (enabled.length ? enabled : [selected]).map((variant) => variant.id);
  const artwork = await uploadArtwork(token, imageUrl, `hairytools-${Date.now()}.png`);
  if (!artwork?.id) throw new Error('Printify no devolvio ID de imagen.');

  const positions = variants.flatMap((variant) => variant.placeholders || []);
  const placeholderPosition = positions.find((position) => position === 'front')
    || positions.find((position) => !String(position).includes('back'))
    || positions[0]
    || 'front';

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
      print_areas: [{
        variant_ids: enabledIds,
        placeholders: [{
          position: placeholderPosition,
          images: [{ id: artwork.id, x: 0.5, y: 0.5, scale: 1, angle: 0 }],
        }],
      }],
    }),
  });

  const names = splitName(shipping.name);
  const order = await printifyFetch(`/shops/${shopId}/orders.json`, token, {
    method: 'POST',
    body: JSON.stringify({
      external_id: `hairy-${Date.now()}`,
      label: 'HairyTools',
      line_items: [{ product_id: product.id, variant_id: selected.id, quantity: 1 }],
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
  });

  const mockup = product.images?.find((image) => image.is_default)?.src || product.images?.[0]?.src || '';
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
  };
}
