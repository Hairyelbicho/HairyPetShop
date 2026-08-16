const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

export type PrintifyCatalogItem = {
  blueprintId: number;
  category: string;
  title: string;
  brand: string;
  model: string;
  description: string;
  image: string;
};

export type PrintifyVariant = {
  id: number;
  title: string;
  color: string;
  size: string;
  cost: number;
  price: number;
  placeholders: string[];
};

export type PrintifyOptions = {
  success: boolean;
  configured: boolean;
  provider: { id: number; title: string };
  variants: PrintifyVariant[];
  sizes: string[];
  colors: string[];
  error?: string;
};

async function printifyRequest<T>(action: string, data?: unknown): Promise<T> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Faltan VITE_PUBLIC_SUPABASE_URL o VITE_PUBLIC_SUPABASE_ANON_KEY.');
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/printify-api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ action, data }),
  });

  const payload = await response.json();
  if (!response.ok && payload?.error) {
    throw new Error(payload.error);
  }
  return payload as T;
}

export function getPrintifyStatus() {
  return printifyRequest<{
    success: boolean;
    configured: boolean;
    shopId?: number;
    shops?: { id: number; title: string }[];
    error?: string;
  }>('status');
}

export function getPrintifyCatalog() {
  return printifyRequest<{
    success: boolean;
    configured: boolean;
    products: PrintifyCatalogItem[];
    error?: string;
  }>('catalog');
}

export function getPrintifyProductOptions(blueprintId: number) {
  return printifyRequest<PrintifyOptions>('product_options', { blueprintId });
}

export function fulfillPrintifyOrder(data: {
  imageUrl: string;
  blueprintId: number;
  title: string;
  size?: string;
  color?: string;
  variantId?: number;
  shipping: {
    name: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    zip: string;
    country?: string;
    region?: string;
  };
}) {
  return printifyRequest<{
    success: boolean;
    productId?: string;
    orderId?: string;
    orderStatus?: string;
    mockup?: string;
    retailPrice?: number;
    error?: string;
  }>('fulfill', data);
}
