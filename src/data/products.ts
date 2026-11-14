/**
 * Centralized catalog data for J Store Quality
 * Easily update products, categories, prices, sizes, images, cities, and WhatsApp links.
 */

export interface Product {
  id: string;
  name: string;
  category: 'gorras' | 'camisas' | 'jeans';
  categoryLabel: string;
  price: number;
  sizes: string[];
  available?: boolean;
  image: string;
  description: string;
  features: string[];
  tag?: string;
  isExample?: boolean;
  sortOrder?: number;
}

export const STORE_INFO = {
  name: 'J Store Quality',
  logoUrl: '/assets/aistudio/Emblema_dorado__J_Store_Quality__d7eed8b3.png',
  tagline: 'Gorras y ropa para tu estilo',
  origin: 'Desde Cúcuta, con envíos a toda Colombia',
  address: 'Calle 5 #12-04, urbanización San Martín, Cúcuta, Norte de Santander',
  shippingText: 'Envíos a toda Colombia',
  primaryWhatsAppNumber: '573001933834',
  primaryWhatsAppRaw: '3001933834',
  primaryWhatsAppDisplay: '+57 300 193 3834',
  tiktokUser: '@j.store.quality',
  tiktokUrl: 'https://www.tiktok.com/@j.store.quality',
  tiktokFollowers: '14.8K',
  tiktokLikes: '211K',
  instagramUser: '@j.storequality',
  instagramUrl: 'https://www.instagram.com/j.storequality?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw==',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Calle+5+%2312-04+San+Martin+Cucuta+Norte+de+Santander',
  schedule: 'Lunes a Sábado: 9:00 AM – 7:30 PM'
};

export const COLOMBIAN_CITIES = [
  'Cúcuta (Norte de Santander)',
  'Villa del Rosario (Norte de Santander)',
  'Los Patios (Norte de Santander)',
  'Ocaña (Norte de Santander)',
  'Pamplona (Norte de Santander)',
  'Bogotá D.C.',
  'Medellín (Antioquia)',
  'Cali (Valle del Cauca)',
  'Barranquilla (Atlántico)',
  'Cartagena (Bolívar)',
  'Bucaramanga (Santander)',
  'Floridablanca (Santander)',
  'Girón (Santander)',
  'Piedecuesta (Santander)',
  'Barrancabermeja (Santander)',
  'Pereira (Risaralda)',
  'Dosquebradas (Risaralda)',
  'Manizales (Caldas)',
  'Armenia (Quindío)',
  'Santa Marta (Magdalena)',
  'Ibagué (Tolima)',
  'Villavicencio (Meta)',
  'Pasto (Nariño)',
  'Neiva (Huila)',
  'Montería (Córdoba)',
  'Valledupar (Cesar)',
  'Popayán (Cauca)',
  'Tunja (Boyacá)',
  'Duitama (Boyacá)',
  'Sogamoso (Boyacá)',
  'Sincelejo (Sucre)',
  'Riohacha (La Guajira)',
  'Florencia (Caquetá)',
  'Yopal (Casanare)',
  'Quibdó (Chocó)',
  'Arauca (Arauca)',
  'Palmira (Valle del Cauca)',
  'Tuluá (Valle del Cauca)',
  'Buenaventura (Valle del Cauca)',
  'Bello (Antioquia)',
  'Envigado (Antioquia)',
  'Itagüí (Antioquia)',
  'Rionegro (Antioquia)',
  'Soacha (Cundinamarca)',
  'Chía (Cundinamarca)',
  'Zipaquirá (Cundinamarca)',
  'Girardot (Cundinamarca)',
  'Soledad (Atlántico)',
  'Otra ciudad / municipio de Colombia',
] as const;

export const PAYMENT_METHODS = [
  'Nequi',
  'Daviplata',
  'Transferencia Bancolombia',
  'Pago Contraentrega (Cúcuta)',
  'Efectivo en tienda'
] as const;

export const formatCOP = (amount: number): string => {
  return `$${amount.toLocaleString('es-CO')} COP`;
};

export const createWhatsAppConsultLink = (
  productName?: string,
  details?: { size?: string | null; price?: number }
): string => {
  const phone = STORE_INFO.primaryWhatsAppNumber;
  let text = '¡Hola J Store Quality! Me gustaría consultar sobre sus productos y envíos a Colombia.';
  if (productName) {
    const extraParts: string[] = [];
    if (details?.size) extraParts.push(`Talla: ${details.size}`);
    if (details?.price) extraParts.push(`Precio: ${formatCOP(details.price)}`);
    const suffix = extraParts.length > 0 ? ` (${extraParts.join(' · ')})` : '';
    text = `¡Hola J Store Quality! Me gustaría solicitar el siguiente producto: "${productName}"${suffix}. ¿Podrían confirmarme disponibilidad y envío?`;
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

export const CATEGORIES = [
  { id: 'all', label: 'Todo' },
  { id: 'gorras', label: 'Gorras' },
  { id: 'camisas', label: 'Camisas' },
  { id: 'jeans', label: 'Jeans' },
] as const;

export type CategoryFilter = typeof CATEGORIES[number]['id'];

export const STORE_IMAGE_PRESETS = [
  { label: 'Gorra Negra/Dorada', url: '/src/assets/images/product_cap_black_gold_1794493788370.jpg' },
  { label: 'Gorra Snapback', url: '/src/assets/images/product_cap_snapback_1794493855454.jpg' },
  { label: 'Gorra Alpinestars', url: '/products/real_cap_alpinestars.jpg' },
  { label: 'Gorra USA', url: '/products/real_caps_usa.jpg' },
  { label: 'Gorra Neón', url: '/products/real_caps_neon.jpg' },
  { label: 'Camisa Negra', url: '/src/assets/images/product_tee_streetwear_1794493789352.jpg' },
  { label: 'Camisa Gris', url: '/products/real_tee_grey.jpg' },
  { label: 'Camisas Diseñador', url: '/products/real_tees_folded.jpg' },
  { label: 'Camisa Gráfica', url: '/products/real_tee_psychobunny.jpg' },
  { label: 'Jeans Denim', url: '/src/assets/images/product_jeans_denim_1794493788981.jpg' },
  { label: 'Conjunto Calvin Klein', url: '/assets/aistudio/Conjunto_Calvin_Klein_en_madera_oscura_-_copia_e4b7fc01.png' },
] as const;

export const PRODUCTS: Product[] = [
  // 1. PRODUCTO PRINCIPAL: GORRAS
  {
    id: 'gorra-urban-gold',
    name: 'Gorra Urbana Gold Crown',
    category: 'gorras',
    categoryLabel: 'Gorras',
    price: 75000,
    sizes: ['Ajustable', 'S/M', 'L/XL'],
    available: true,
    image: '/src/assets/images/product_cap_black_gold_1794493788370.jpg',
    description: 'Diseño exclusivo en drill negro con bordado frontal en relieve dorado de alta densidad y visera curva estructurada.',
    features: ['Bordado 3D dorado de alta precisión', 'Cierre posterior ajustable', 'Tejido de algodón premium transpirable'],
    tag: 'Producto Principal',
    isExample: true,
    sortOrder: 1,
  },
  {
    id: 'gorra-snapback-black',
    name: 'Gorra Snapback Premium Black',
    category: 'gorras',
    categoryLabel: 'Gorras',
    price: 70000,
    sizes: ['Ajustable', 'S/M', 'L/XL'],
    available: true,
    image: '/src/assets/images/product_cap_snapback_1794493855454.jpg',
    description: 'Estilo snapback minimalista en negro profundo con pin circular dorado y acabado mate satinado.',
    features: ['Pin metálico con baño dorado', 'Estructura rígida de 6 paneles', 'Banda interior absorbente de sudor'],
    tag: 'Edición Especial',
    isExample: true,
    sortOrder: 2,
  },
  {
    id: 'gorra-alpinestars-blue',
    name: 'Gorra Trucker Alpinestars Star Blue',
    category: 'gorras',
    categoryLabel: 'Gorras',
    price: 65000,
    sizes: ['Ajustable', 'S/M', 'L/XL'],
    available: true,
    image: '/products/real_cap_alpinestars.jpg',
    description: 'Gorra trucker de silueta urbana con malla posterior ventilada y emblema Alpinestars en contorno azul eléctrico.',
    features: ['Malla trasera de alta ventilación', 'Visera con ribete azul', 'Broche snapback reforzado'],
    tag: 'Disponible en tienda',
    isExample: false,
    sortOrder: 3,
  },
  {
    id: 'gorra-trucker-usa',
    name: 'Gorra Trucker USA Tactical Flag',
    category: 'gorras',
    categoryLabel: 'Gorras',
    price: 65000,
    sizes: ['Ajustable', 'S/M', 'L/XL'],
    available: true,
    image: '/products/real_caps_usa.jpg',
    description: 'Trucker cap con parche frontal bordado de bandera en blanco y negro, disponible en combinaciones negro y azul rey.',
    features: ['Parche bordado de alta resolución', 'Horma ergonómica trucker', 'Ajuste posterior multiposición'],
    tag: 'Tendencia',
    isExample: false,
    sortOrder: 4,
  },
  {
    id: 'gorra-trucker-neon',
    name: 'Gorra Trucker Neón Piping Series',
    category: 'gorras',
    categoryLabel: 'Gorras',
    price: 68000,
    sizes: ['Ajustable', 'S/M', 'L/XL'],
    available: true,
    image: '/products/real_caps_neon.jpg',
    description: 'Línea de gorras con vivos de color neón (amarillo, rojo, azul) a lo largo de la visera sobre base negro mate.',
    features: ['Piping perimetral reflectivo/neón', 'Logotipo frontal bordado', 'Material liviano y resistente'],
    tag: 'Nueva llegada',
    isExample: false,
    sortOrder: 5,
  },

  // 2. CAMISAS
  {
    id: 'camisa-streetwear-black',
    name: 'Camisa Heavyweight Noir Boxy',
    category: 'camisas',
    categoryLabel: 'Camisas',
    price: 95000,
    sizes: ['S', 'M', 'L', 'XL'],
    available: true,
    image: '/src/assets/images/product_tee_streetwear_1794493789352.jpg',
    description: 'Camisa de corte boxy en algodón de 240g con cuello cerrado reforzado y caída estructurada.',
    features: ['100% algodón peinado pesado', 'Cuello acanalado de 3cm que no se deforma', 'Costuras reforzadas a doble aguja'],
    tag: 'Básico Esencial',
    isExample: true,
    sortOrder: 6,
  },
  {
    id: 'camisa-fitted-grey',
    name: 'Camisa Slim Fit Gris Perla',
    category: 'camisas',
    categoryLabel: 'Camisas',
    price: 85000,
    sizes: ['S', 'M', 'L', 'XL'],
    available: true,
    image: '/products/real_tee_grey.jpg',
    description: 'Camisa manga corta tono gris perla en tejido suave con ajuste definido al torso y logo bordado en manga.',
    features: ['Tejido elástico de alta recuperación', 'Excelente caída y frescura para clima cálido', 'Diseño sobrio y moderno'],
    tag: 'Disponible en tienda',
    isExample: false,
    sortOrder: 7,
  },
  {
    id: 'camisas-designer-folded',
    name: 'Colección Camisas Diseñador Urban',
    category: 'camisas',
    categoryLabel: 'Camisas',
    price: 110000,
    sizes: ['S', 'M', 'L', 'XL'],
    available: true,
    image: '/products/real_tees_folded.jpg',
    description: 'Selección de camisas de marcas exclusivas y estampados de alta gama (Boss, Armani, Diesel, Hugo).',
    features: ['Estampados serigráficos de alta durabilidad', 'Variedad de tallas S, M, L, XL', 'Presentación premium'],
    tag: 'Lote Exclusivo',
    isExample: false,
    sortOrder: 8,
  },
  {
    id: 'camisa-psycho-bunny-graphic',
    name: 'Camisa Gráfica Urban Style Series',
    category: 'camisas',
    categoryLabel: 'Camisas',
    price: 98000,
    sizes: ['S', 'M', 'L', 'XL'],
    available: true,
    image: '/products/real_tee_psychobunny.jpg',
    description: 'Camisas con gráficos vibrantes sobre contrastes azul cobalto, rojo escarlata y negro profundo.',
    features: ['Gráficos de gran formato con acabado mate', 'Algodón peruano suave al tacto', 'Colores firmes lavado tras lavado'],
    tag: 'Edición Urbana',
    isExample: false,
    sortOrder: 9,
  },

  // 3. JEANS
  {
    id: 'jeans-denim-distressed',
    name: 'Jeans Denim Slim Fit Distressed',
    category: 'jeans',
    categoryLabel: 'Jeans',
    price: 175000,
    sizes: ['28', '30', '32', '34'],
    available: true,
    image: '/src/assets/images/product_jeans_denim_1794493788981.jpg',
    description: 'Pantalón jean en denim índigo oscuro con desgastes artesanales y ajuste slim contemporáneo.',
    features: ['Denim con 2% elastano para confort', 'Remaches reforzados y parche de cuero', 'Lavado índigo profundo con bigotes'],
    tag: 'Top Ventas',
    isExample: true,
    sortOrder: 10,
  },
];
