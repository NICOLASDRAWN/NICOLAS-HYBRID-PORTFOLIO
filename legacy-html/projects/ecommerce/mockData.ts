
import { Equipment, Auction, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Excavadoras', icon: '🚜', count: 12 },
  { id: '2', name: 'Volquetas', icon: '🚛', count: 8 },
  { id: '3', name: 'Grúa Telescópica', icon: '🏗️', count: 3 },
  { id: '4', name: 'Montacargas', icon: '📦', count: 5 },
  { id: '5', name: 'Tablestacadora', icon: '🔨', count: 2 },
  { id: '6', name: 'Cargadores', icon: '🚜', count: 4 },
  { id: '7', name: 'Bombas concreto', icon: '🚿', count: 2 },
  { id: '8', name: 'Generadores', icon: '⚡', count: 6 },
  { id: '9', name: 'Manlift', icon: '🏗️', count: 4 },
  { id: '10', name: 'Compresores de aire', icon: '💨', count: 3 },
];

export const ALL_EQUIPMENT: Equipment[] = [
  // Excavadoras
  {
    id: 'cat-323',
    name: 'Caterpillar 323',
    category: 'Excavadoras',
    brand: 'Caterpillar',
    year: 2022,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/Excavadora Caterpillar 336.png',
    currentBid: 125000,
    auctionDate: '2024-03-15',
    description: 'Motor Cat C7.1 de 120 kW (162 hp). Peso operativo de 23.000 kg. Cucharón de 1,2 m³.'
  },

  // Grúas
  {
    id: 'zl-ztc500',
    name: 'Zoomlion ZTC500',
    category: 'Grúa Telescópica',
    brand: 'Zoomlion',
    year: 2021,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/Grúa Telescópica Zoomlion ZTC500.png',
    currentBid: 245000,
    auctionDate: '2024-04-10',
    description: 'Capacidad 50 Toneladas. Pluma principal de 11,2m a 44m. Alcance máximo 61m con jib.'
  },

  // Montacargas
  {
    id: 'hc-cpcd50',
    name: 'Hangcha CPCD50-AXG53',
    category: 'Montacargas',
    brand: 'Hangcha',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/Montacargas Heli CPCD50-W2G.png',
    currentBid: 32000,
    auctionDate: '2024-05-05',
    description: 'Capacidad 5.000 kg. Elevación 3.000mm. Motor Mitsubishi S6S-T de 63,9 kW.'
  },

  // Vibrocompactadores
  {
    id: 'xcmg-xs223',
    name: 'XCMG XS223',
    category: 'Vibro compactador',
    brand: 'XCMG',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/Vibrocompactador XCMG XS223J.png',
    currentBid: 85000,
    auctionDate: '2025-01-10',
    description: 'Peso operativo de 22.000 kg. Vibración de 33 Hz. Fuerza centrífuga de 390 kN.'
  },

  // Volquetas
  {
    id: 'v-wfr788',
    name: 'Volqueta WFR788',
    category: 'Volquetas',
    brand: 'MIP',
    year: 2021,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/Volqueta Shacman F3000 8x4.png',
    currentBid: 65000,
    auctionDate: '2024-04-20',
    description: 'Unidad de alta resistencia para movimiento de tierras y construcción pesada.'
  },
  // Nuevos Productos
  {
    id: 'bomba-concreto-60',
    name: 'Bomba de concreto para remolque de 60 m³',
    category: 'Bombas concreto',
    brand: 'Zoomlion',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/Bomba de concreto para remolque de 60 metros cubicos.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Bomba de concreto de alta eficiencia.'
  },
  {
    id: 'bomba-concreto-70',
    name: 'Bomba de concreto para remolque de 70 m³',
    category: 'Bombas concreto',
    brand: 'Zoomlion',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/Bomba de concreto para remolque de 70 metros cubicos.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Bomba de concreto de alta capacidad.'
  },
  {
    id: 'camion-mixer-8',
    name: 'Camion mixer de 8 m³',
    category: 'Volquetas',
    brand: 'Sinotruk',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/Camion mixer de 8 metros cubicos.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Camión mixer robusto y eficiente.'
  },
  {
    id: 'excavadora-cat-1.5',
    name: 'Excavadora Caterpillar de 1.5 Toneladas',
    category: 'Excavadoras',
    brand: 'Caterpillar',
    year: 2022,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/Excavadora Caterpillar de 1.5 Toneladas.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Excavadora compacta para espacios reducidos.'
  },
  {
    id: 'excavadora-zoomlion-6',
    name: 'Excavadora Zoomlion de 6 Toneladas',
    category: 'Excavadoras',
    brand: 'Zoomlion',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/Excavadora de 6 toneladas zoomlion.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Excavadora versátil y potente.'
  },
  {
    id: 'generador-200kw',
    name: 'Generador de 200 KW',
    category: 'Generadores',
    brand: 'Cummins',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/Generador de 200 KW.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Generador de energía confiable.'
  },
  {
    id: 'generador-320kw',
    name: 'Generador de 320 KW',
    category: 'Generadores',
    brand: 'Cummins',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/Generador de 320 KW.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Generador de alta potencia.'
  },
  {
    id: 'grua-camion-50',
    name: 'Grúa de camión 50 Toneladas',
    category: 'Grúa Telescópica',
    brand: 'Zoomlion',
    year: 2022,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/Grua de camion 50 toneladas.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Grúa montada sobre camión para mayor movilidad.'
  },
  {
    id: 'minicargador-80',
    name: 'Mini cargador modelo 80',
    category: 'Cargadores',
    brand: 'Bobcat',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/Mini cargador modelo 80.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Minicargador ágil y eficiente.'
  },
  {
    id: 'montacargas-3',
    name: 'Montacargas de 3 Toneladas',
    category: 'Montacargas',
    brand: 'Heli',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/Monta cargas de 3 toneladas.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Montacargas estándar para almacenes.'
  },
  {
    id: 'montacargas-5',
    name: 'Montacargas de 5 Toneladas',
    category: 'Montacargas',
    brand: 'Heli',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/montacargas de 5 toneladas.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Montacargas de capacidad media.'
  },
  {
    id: 'cargadora-frontal-lateral-3',
    name: 'Unidad cargadora frontal y lateral de 3 m³',
    category: 'Cargadores',
    brand: 'XCMG',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/Unidad cargadora frontal y lateral de 3 metros cubicos.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Cargadora versátil para diferentes aplicaciones.'
  },
  {
    id: 'vibro-22',
    name: 'Vibro de 22 Toneladas',
    category: 'Vibro compactador',
    brand: 'XCMG',
    year: 2022,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/Vibro de 22 Toneladas.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Compactador pesado para grandes obras.'
  },
  {
    id: 'volquete-doble-torque-15',
    name: 'Volquete doble torque de 15 m³',
    category: 'Volquetas',
    brand: 'Sinotruk',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/Volquete doble torque de 15 metros cubicos.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Volquete de alta capacidad para minería y construcción.'
  },
  {
    id: 'grua-orugas-80',
    name: 'Grúa telescópica sobre orugas de 80 XCMG',
    category: 'Grúa Telescópica',
    brand: 'XCMG',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/grua telescopica sobre orugas de 80 XCMG.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Grúa sobre orugas para terrenos difíciles.'
  },
  {
    id: 'manlift-22',
    name: 'Manlift de 22 metros',
    category: 'Manlift',
    brand: 'JLG',
    year: 2022,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/manlift de 22 metros.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Plataforma elevadora para trabajos en altura.'
  },
  {
    id: 'tractor-mula-52.8',
    name: 'Tractor de mula y camabaja de 52.8 T',
    category: 'Volquetas',
    brand: 'Sinotruk',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/tractor de mula y camabaja de 52,8 T.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Conjunto tractor y camabaja para transporte pesado.'
  },
  {
    id: 'vibro-1',
    name: 'Vibro de 1 Tonelada',
    category: 'Vibro compactador',
    brand: 'Dynapac',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/vibro de 1 tonelada.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Compactador ligero para asfalto y suelos.'
  },
  {
    id: 'vibro-2',
    name: 'Vibro de 2 Toneladas',
    category: 'Vibro compactador',
    brand: 'Dynapac',
    year: 2023,
    location: 'Bogotá, Colombia',
    imageUrl: '/assets/products/vibro de 2 toneladas.png',
    currentBid: 0,
    auctionDate: '2024-06-01',
    description: 'Compactador versátil para pequeñas y medianas obras.'
  }
];

export const FEATURED_EQUIPMENT = ALL_EQUIPMENT.slice(0, 4);

export const UPCOMING_AUCTIONS: Auction[] = [
  {
    id: 'a1',
    title: 'Subasta Industrial Bogotá 2024',
    location: 'Bogotá, Colombia',
    date: '15-18 Mar 2024',
    itemCount: ALL_EQUIPMENT.length,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80'
  }
];

export const COLLABORATORS = [
  { name: 'XCMG', logo: '/assets/partner-xcmg.jpg' },
  { name: 'China Harbour', logo: '/assets/partner-china-harbour.png' },
  { name: 'Zoomlion', logo: '/assets/partner-zoomlion.png' },
  { name: 'PowerChina', logo: '/assets/partner-powerchina.gif' }
];

export const TEAM_STATS = {
  totalExperts: 1200,
  technicalSpecialists: 67,
  administrativeAssistants: 14,
  fieldOperators: 926,
  supportStaff: 7
};

export const SERVICES = [
  { title: 'Trading & Importación', desc: 'Gestión aduanera + acceso a marcas globales.' },
  { title: 'Gestión de Activos', desc: 'Prolonga vida útil + reducción de costos.' },
  { title: 'Logística de Repuestos', desc: 'Inventario estratégico + logística especializada.' },
  { title: 'Flota propia certificada', desc: 'Seguridad Operativa + Alto Desempeño.' },
  { title: 'Construcción de Proyectos', desc: 'Ejecución de infraestructura bajo estándares técnicos, operativos, normativos, seguridad y cumplimiento.' }
];

export const KEY_DIFFERENTIATORS = [
  { title: 'Experiencia en proyectos de gran escala', icon: '🏗️' },
  { title: 'Integración de servicios', icon: '🔗' },
  { title: 'Enfoque en resultados del cliente', icon: '📈' },
  { title: 'Atención personalizada', icon: '🤝' },
  { title: 'Seguridad y cumplimiento', icon: '🛡️' }
];

export const BRAND_PROJECTS = [
  { title: 'Cerramiento', icon: '🚧' },
  { title: 'Redes', icon: '🌐' },
  { title: 'Sub-Estructura', icon: '🏛️' },
  { title: 'Movimiento de tierras', icon: '🚜' },
  { title: 'Modelado BIM', icon: '💻' }
];

export const HISTORY_TIMELINE = [
  { year: '2018', title: 'Fundación', location: 'Changzhou - China', desc: 'Inicio de exportación de productos de origen animal a Hong Kong.' },
  { year: '2020', title: 'Diversificación', location: 'China y Colombia', desc: 'Importación y comercialización de maquinaria de coser para el sector textil.' },
  { year: '2022', title: 'Fortalecimiento', location: 'Colombia', desc: 'Consolidación en importación y venta de maquinaria pesada (CAT, SANY, SHACMAN).' },
  { year: '2023', title: 'Infraestructura', location: 'Colombia', desc: 'Alianzas para suministrar maquinaria a proyectos de gran envergadura.' },
  { year: '2024', title: 'Metro de Bogotá', location: 'Colombia', desc: 'Participación activa con 46.24% de ejecución en la Primera Línea.' },
  { year: '2025', title: 'Metro de Bogotá', location: 'Colombia', desc: 'Proyección del 60% de ejecución, consolidándonos como actor clave.' },
];

export const LEADERSHIP = [
  { name: 'Kai Mo', role: 'Director General', roleEn: 'General Director', img: 'https://images.unsplash.com/photo-1560250056-07ba64664864?auto=format&fit=crop&q=80' }
];

export const COMPANY_INFO = {
  whoWeAre: 'Somos una empresa colombo-china especializada en infraestructura, maquinaria pesada, logística industrial e importación. Actuamos como socio estratégico, acompañando a nuestros clientes desde la planeación hasta la ejecución, con soluciones técnicas confiables y orientadas a resultados.',
  mission: 'Importar maquinaria pesada para el sector construcción, obra civil y mantenimiento con precios competitivos y cumpliendo con los estándares de calidad y con disponibilidad de inventarios para satisfacer las necesidades de nuestros clientes. Asimismo, garantizar la seguridad máxima para la compra de subproductos pecuarios.',
  vision: 'Ser reconocidos en el mercado como líderes en construcción, obra civil, mantenimiento y distribución de maquinaria pesada, repuestos, que nuestros clientes y proveedores nos prefieran, contando con PERSONAL CAPACITADO para brindarle al cliente los mejores productos y servicios.',
  address: 'Cra. 20b #77-5, Bogotá',
  email: 'comunicaciones@mipgroup.com.co',
  phone: '320 4080 950',
  nit: '901.165.028-2',
  website: 'www.mipgroup.com.co'
};

export const PROJECT_STATS = {
  metroLine1: {
    progress: '33.35%',
    columns: 58,
    distance: '23.9 km',
    collaborators: ['METROLINEA', 'CFRO', 'POWER CHINA', 'TRANSMETRO']
  }
};

export const CIVIL_WORKS = [
  { title: 'Movimiento de Tierras', desc: 'Suministro de excavadoras y volquetas para remoción, nivelación y compactación.' },
  { title: 'Infraestructura Estructural', desc: 'Ejecución de subestructura para apoyos esenciales en viaductos y estaciones.' },
  { title: 'Construcción de Estaciones', desc: 'Montaje de estructuras de soporte, vigas, columnas y losas de concreto.' },
  { title: 'Transporte de Prefabricados', desc: 'Grúas telescópicas y montacargas para el manejo eficiente de vigas y paneles.' },
  { title: 'Mantenimiento Logístico', desc: 'Soporte continuo a equipos para evitar retrasos en el cronograma de obra.' }
];

export const BLOG_POSTS = [
  {
    id: 1,
    title: '5 Consejos para el Mantenimiento Preventivo de Excavadoras',
    excerpt: 'Descubra cómo extender la vida útil de su maquinaria amarilla con estas prácticas esenciales de mantenimiento preventivo.',
    category: 'Mantenimiento',
    date: '15 Mar 2024',
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80',
    slug: 'mantenimiento-preventivo-excavadoras'
  },
  {
    id: 2,
    title: 'Guía de Importación de Maquinaria desde China',
    excerpt: 'Todo lo que necesita saber sobre aranceles, logística y normativas para importar maquinaria pesada a Colombia en 2024.',
    category: 'Comercio Exterior',
    date: '10 Mar 2024',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8e546?auto=format&fit=crop&q=80',
    slug: 'guia-importacion-china-colombia'
  },
  {
    id: 3,
    title: 'Alquiler vs. Compra: ¿Qué es mejor para su proyecto?',
    excerpt: 'Analizamos los costos y beneficios de ambas modalidades para ayudarle a tomar la mejor decisión financiera para su obra.',
    category: 'Guías de Compra',
    date: '05 Mar 2024',
    image: 'https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?auto=format&fit=crop&q=80',
    slug: 'alquiler-vs-compra-maquinaria'
  }
];
