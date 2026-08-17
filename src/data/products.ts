export type AnalyticalConstituent = { label: string; value: string };

export type FactoryCertification = {
  name: string;
  status: 'visible' | 'nda';
  detail: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  category: string;
  image: string;
  shortTech?: string;
  ownBrand?: boolean;
  manufacturer?: string;
  sku?: string;
  ean?: string;
  species?: string;
  stage?: string;
  formats?: string[];
  composition?: string;
  analytical?: AnalyticalConstituent[];
  additives?: string[];
  feedingGuide?: string;
  storage?: string;
  certifications?: FactoryCertification[];
  b2b?: {
    moq: string;
    pallet: string;
    incoterm: string;
    leadTime: string;
  };
};

export const products: Product[] = [
  {
    id: 100,
    slug: 'hairy-nutrition-adulto-pollo-arroz',
    name: 'Hairy Nutrition Adult · Pollo y Arroz',
    price: 18.9,
    originalPrice: 24.9,
    discount: 24,
    rating: 5,
    reviews: 0,
    category: 'perros',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800',
    shortTech: 'Alimento completo · 2 kg / 12 kg · Fabricado en España con Delmocán',
    ownBrand: true,
    manufacturer: 'Fabricado en España en planta partner Delmocán, para HairyPetShop (división de Arkadium88 Holdings SL)',
    sku: 'HPS-LN-AD-2KG',
    ean: 'En asignación (GS1)',
    species: 'Perro',
    stage: 'Adulto, mantenimiento diario',
    formats: ['Saco 2 kg (retail)', 'Saco 12 kg (retail / clínica)', 'Pallet 60 × 12 kg (B2B)'],
    composition:
      'Pollo deshidratado (26 %), arroz (18 %), maíz, grasa de pollo, pulpa de remolacha, hidrolizado de hígado de pollo, aceites de pescado, minerales, extracto de yucca. Formulación de línea propia; los porcentajes de lote se confirman en el etiquetado legal de cada producción.',
    analytical: [
      { label: 'Proteína bruta', value: '26 %' },
      { label: 'Grasa bruta', value: '14 %' },
      { label: 'Fibra bruta', value: '2,8 %' },
      { label: 'Ceniza bruta', value: '7,5 %' },
      { label: 'Humedad', value: '9 %' },
      { label: 'Calcio', value: '1,2 %' },
      { label: 'Fósforo', value: '0,9 %' },
      { label: 'Energía metabolizable', value: '3.720 kcal/kg' },
    ],
    additives: [
      'Vitamina A 18.000 UI/kg',
      'Vitamina D3 1.500 UI/kg',
      'Vitamina E 150 mg/kg',
      'Selenio (selenito sódico) 0,2 mg/kg',
      'Zinc (quelato) 100 mg/kg',
    ],
    feedingGuide:
      'Perro 10 kg: 140–160 g/día. Perro 20 kg: 230–260 g/día. Perro 30 kg: 310–350 g/día. Ajustar según actividad y condición corporal. Agua fresca siempre disponible.',
    storage: 'Lugar fresco y seco, cerrado tras cada uso. Consumir preferentemente antes de 12 meses desde fabricación. Lote y fecha en el saco.',
    certifications: [
      {
        name: 'Certificación de planta Delmocán',
        status: 'visible',
        detail:
          'Producción en fábrica especializada en nutrición animal. El certificado de planta y el pliego de homologación se muestran a partners y retailers bajo acuerdo; el sello de fábrica aparece en esta ficha y en el saco.',
      },
      {
        name: 'Trazabilidad de lote',
        status: 'visible',
        detail: 'Cada saco lleva lote, fecha de fabricación y caducidad. Trazabilidad disponible para auditoría de supermercado o distribuidor.',
      },
      {
        name: 'Documentación B2B (NDA)',
        status: 'nda',
        detail: 'Especificación técnica completa, análisis de laboratorio y fichas de seguridad se entregan a fábricas, centrales de compra y supermercados previa NDA.',
      },
    ],
    b2b: {
      moq: '1 palet (referencia 12 kg) o 24 ud. de 2 kg para piloto de lineal',
      pallet: '60 sacos de 12 kg / palet europeo',
      incoterm: 'EXW planta España · FCA / DAP península a negociar',
      leadTime: '15–25 días laborables tras confirmación de pedido de producción',
    },
  },
  {
    id: 1,
    slug: 'collar-premium-cuero-perros',
    name: 'Collar Premium para Perros (Cuero)',
    price: 24.99,
    originalPrice: 34.99,
    discount: 29,
    rating: 4.8,
    reviews: 156,
    category: 'perros',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    shortTech: 'Cuero vacuno · herrajes niquelados · tallas S–XL',
    sku: 'HPS-ACC-COL-01',
    species: 'Perro',
  },
  {
    id: 2,
    slug: 'juguete-interactivo-gatos-laser',
    name: 'Juguete Interactivo para Gatos (Láser)',
    price: 18.5,
    originalPrice: 25,
    discount: 26,
    rating: 4.9,
    reviews: 203,
    category: 'gatos',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    shortTech: 'Clase 2 · USB-C · temporizador 15 min',
    sku: 'HPS-CAT-LSR-01',
    species: 'Gato',
  },
  {
    id: 3,
    slug: 'acuario-completo-50l-led',
    name: 'Acuario Completo 50L con LED',
    price: 89.99,
    originalPrice: 120,
    discount: 25,
    rating: 4.7,
    reviews: 89,
    category: 'peces',
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400',
    shortTech: '50 L · filtro incluido · LED 6500 K',
    sku: 'HPS-AQ-50L',
    species: 'Peces de agua dulce',
  },
  {
    id: 4,
    slug: 'arenero-automatico-autolimpiable',
    name: 'Arenero Automático Autolimpiable',
    price: 189.99,
    originalPrice: 249.99,
    discount: 24,
    rating: 4.9,
    reviews: 342,
    category: 'gatos',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    shortTech: 'Sensor IR · cubeta 65 L · 220–240 V',
    sku: 'HPS-CAT-LIT-01',
    species: 'Gato',
  },
  {
    id: 5,
    slug: 'cama-ortopedica-viscoelastica-xxl',
    name: 'Cama Ortopédica Viscoelástica XXL',
    price: 55,
    originalPrice: 79.99,
    discount: 31,
    rating: 4.9,
    reviews: 512,
    category: 'perros',
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=400',
    shortTech: 'Espuma viscoelástica 7 cm · funda extraíble 110×80 cm',
    sku: 'HPS-DOG-BED-XXL',
    species: 'Perro',
  },
  {
    id: 6,
    slug: 'dispensador-comida-wifi-camara',
    name: 'Dispensador de Comida WiFi con Cámara',
    price: 75.99,
    originalPrice: 105,
    discount: 28,
    rating: 4.8,
    reviews: 289,
    category: 'perros',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
    shortTech: 'WiFi 2,4 GHz · cámara 1080p · tolva 6 L',
    sku: 'HPS-IOT-FEED-01',
    species: 'Perro / gato',
  },
  {
    id: 7,
    slug: 'rascador-arbol-gigante-gatos-170',
    name: 'Rascador Árbol Gigante para Gatos (170cm)',
    price: 64.5,
    originalPrice: 89.9,
    discount: 28,
    rating: 4.6,
    reviews: 145,
    category: 'gatos',
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400',
    shortTech: '170 cm · sisal natural · base 50×50 cm',
    sku: 'HPS-CAT-TREE-170',
    species: 'Gato',
  },
  {
    id: 8,
    slug: 'correa-retractil-linterna-led',
    name: 'Correa Retráctil con Linterna LED',
    price: 19.99,
    originalPrice: 29.99,
    discount: 33,
    rating: 4.7,
    reviews: 402,
    category: 'perros',
    image: 'https://images.unsplash.com/photo-1605639156481-244775d6f803?w=400',
    shortTech: 'Cinta 5 m · hasta 25 kg · LED 80 lm',
    sku: 'HPS-ACC-LEA-LED',
    species: 'Perro',
  },
  {
    id: 9,
    slug: 'jaula-espaciosa-pajaros',
    name: 'Jaula Espaciosa para Pájaros (Canarios/Loros)',
    price: 45,
    originalPrice: 60,
    discount: 25,
    rating: 4.5,
    reviews: 78,
    category: 'pajaros',
    image: 'https://images.unsplash.com/photo-1552728089-571069502b48?w=400',
    shortTech: '80×50×90 cm · acero recubierto · bandeja extraíble',
    sku: 'HPS-BRD-CG-01',
    species: 'Aves',
  },
  {
    id: 10,
    slug: 'camara-seguridad-mascotas-hd',
    name: 'Cámara de Seguridad para Mascotas HD',
    price: 34.99,
    originalPrice: 49.99,
    discount: 30,
    rating: 4.8,
    reviews: 620,
    category: 'todos',
    image: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=400',
    shortTech: '1080p · visión nocturna · audio bidireccional',
    sku: 'HPS-IOT-CAM-HD',
    species: 'Todas las mascotas',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const ownBrandProducts = products.filter((p) => p.ownBrand);
