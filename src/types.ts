// Data types for the cost estimation application

export type UnitType = 'mb' | 'm2' | 'szt' | 'godz' | 'kpl' | 'l' | 'kg';

export type RoomType = 'lazienka' | 'kuchnia' | 'salon' | 'sypialnia' | 'korytarz' | 'balkon' | 'inne';

export const ROOM_LABELS: Record<RoomType, string> = {
  lazienka: 'Łazienka',
  kuchnia: 'Kuchnia',
  salon: 'Salon',
  sypialnia: 'Sypialnia',
  korytarz: 'Korytarz/Przedpokój',
  balkon: 'Balkon/Taras',
  inne: 'Inne'
};

// Default room names matching room types
export const DEFAULT_ROOM_NAMES: Record<RoomType, string> = {
  lazienka: 'Łazienka',
  kuchnia: 'Kuchnia',
  salon: 'Salon',
  sypialnia: 'Sypialnia',
  korytarz: 'Korytarz',
  balkon: 'Balkon',
  inne: 'Pomieszczenie'
};

// Single item template (service/material)
export interface ItemTemplate {
  id: string;
  name: string;
  unit: UnitType;
  pricePerUnit: number;
  category: 'labor' | 'material';
}

// Material in work template (with quantity ratio)
export interface WorkMaterial {
  itemTemplateId: string;
  quantityPerUnit: number; // material amount per work unit (e.g., 0.2l paint per 1m2)
}

// Work template (e.g., "Wall painting" with list of required materials)
export interface WorkTemplate {
  id: string;
  name: string;
  unit: UnitType;
  laborPrice: number;
  laborItemId?: string; // optional link to labor item from templates
  materials: WorkMaterial[];
  roomTypes: RoomType[]; // rooms where this work is available
}

// Room renovation template
export interface RoomRenovationTemplate {
  id: string;
  name: string;
  roomType: RoomType;
  description: string;
  works: { workTemplateId: string; defaultQuantity: number }[];
}

// Item in estimate
export interface EstimateItem {
  id: string;
  templateId: string;
  name: string;
  unit: UnitType;
  quantity: number;
  pricePerUnit: number;
  category: 'labor' | 'material';
  roomName?: string;
  workId?: string; // work group ID (allows grouping labor with materials)
  workName?: string; // work name for grouping
}

// Room in estimate
export interface EstimateRoom {
  id: string;
  name: string;
  roomType: RoomType;
  items: EstimateItem[];
}

export interface Estimate {
  id: string;
  clientName: string;
  clientAddress: string;
  projectDescription: string;
  notes: string; // additional notes for the estimate
  rooms: EstimateRoom[];
  includeMaterials: boolean;
  laborDiscountPercent: number;
  materialDiscountPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  username: string;
  uniqueId: string;
  companyName: string; // company name for PDF footer
  phoneNumber: string; // phone number for PDF footer
  itemTemplates: ItemTemplate[];
  workTemplates: WorkTemplate[];
  roomRenovationTemplates: RoomRenovationTemplate[];
  estimates: Estimate[];
  createdAt: string;
}

export const UNIT_LABELS: Record<UnitType, string> = {
  mb: 'mb',
  m2: 'm²',
  szt: 'szt.',
  godz: 'godz.',
  kpl: 'kpl.',
  l: 'l',
  kg: 'kg'
};

// Default item templates
export const DEFAULT_ITEM_TEMPLATES: ItemTemplate[] = [
  // Labor
  { id: 'L1', name: 'Malowanie ścian', unit: 'm2', pricePerUnit: 25, category: 'labor' },
  { id: 'L2', name: 'Malowanie sufitu', unit: 'm2', pricePerUnit: 30, category: 'labor' },
  { id: 'L3', name: 'Układanie płytek podłogowych', unit: 'm2', pricePerUnit: 85, category: 'labor' },
  { id: 'L4', name: 'Układanie płytek ściennych', unit: 'm2', pricePerUnit: 95, category: 'labor' },
  { id: 'L5', name: 'Montaż paneli podłogowych', unit: 'm2', pricePerUnit: 35, category: 'labor' },
  { id: 'L6', name: 'Gładź gipsowa ścian', unit: 'm2', pricePerUnit: 35, category: 'labor' },
  { id: 'L7', name: 'Gładź gipsowa sufitu', unit: 'm2', pricePerUnit: 40, category: 'labor' },
  { id: 'L8', name: 'Montaż listew przypodłogowych', unit: 'mb', pricePerUnit: 18, category: 'labor' },
  { id: 'L9', name: 'Montaż drzwi wewnętrznych', unit: 'szt', pricePerUnit: 280, category: 'labor' },
  { id: 'L10', name: 'Montaż gniazdek elektrycznych', unit: 'szt', pricePerUnit: 50, category: 'labor' },
  { id: 'L11', name: 'Instalacja oświetlenia', unit: 'szt', pricePerUnit: 90, category: 'labor' },
  { id: 'L12', name: 'Prace hydrauliczne', unit: 'godz', pricePerUnit: 130, category: 'labor' },
  { id: 'L13', name: 'Montaż WC', unit: 'szt', pricePerUnit: 350, category: 'labor' },
  { id: 'L14', name: 'Montaż umywalki', unit: 'szt', pricePerUnit: 250, category: 'labor' },
  { id: 'L15', name: 'Montaż wanny', unit: 'szt', pricePerUnit: 450, category: 'labor' },
  { id: 'L16', name: 'Montaż kabiny prysznicowej', unit: 'szt', pricePerUnit: 550, category: 'labor' },
  { id: 'L17', name: 'Montaż baterii', unit: 'szt', pricePerUnit: 120, category: 'labor' },
  { id: 'L18', name: 'Skucie starych płytek', unit: 'm2', pricePerUnit: 45, category: 'labor' },
  { id: 'L19', name: 'Demontaż starych paneli', unit: 'm2', pricePerUnit: 15, category: 'labor' },
  { id: 'L20', name: 'Wyrównanie podłogi', unit: 'm2', pricePerUnit: 55, category: 'labor' },
  { id: 'L21', name: 'Hydroizolacja', unit: 'm2', pricePerUnit: 45, category: 'labor' },
  { id: 'L22', name: 'Montaż mebli kuchennych', unit: 'mb', pricePerUnit: 350, category: 'labor' },
  { id: 'L23', name: 'Montaż blatu kuchennego', unit: 'mb', pricePerUnit: 180, category: 'labor' },
  { id: 'L24', name: 'Montaż zlewozmywaka', unit: 'szt', pricePerUnit: 200, category: 'labor' },
  { id: 'L25', name: 'Montaż okapu', unit: 'szt', pricePerUnit: 250, category: 'labor' },
  
  // Materials
  { id: 'M1', name: 'Farba emulsyjna biała', unit: 'l', pricePerUnit: 35, category: 'material' },
  { id: 'M2', name: 'Farba emulsyjna kolorowa', unit: 'l', pricePerUnit: 55, category: 'material' },
  { id: 'M3', name: 'Grunt pod farbę', unit: 'l', pricePerUnit: 25, category: 'material' },
  { id: 'M4', name: 'Płytki ceramiczne podłogowe', unit: 'm2', pricePerUnit: 75, category: 'material' },
  { id: 'M5', name: 'Płytki ceramiczne ścienne', unit: 'm2', pricePerUnit: 65, category: 'material' },
  { id: 'M6', name: 'Płytki gresowe', unit: 'm2', pricePerUnit: 95, category: 'material' },
  { id: 'M7', name: 'Klej do płytek standard', unit: 'kg', pricePerUnit: 2.5, category: 'material' },
  { id: 'M8', name: 'Klej do płytek elastyczny', unit: 'kg', pricePerUnit: 4, category: 'material' },
  { id: 'M9', name: 'Fuga szara', unit: 'kg', pricePerUnit: 8, category: 'material' },
  { id: 'M10', name: 'Fuga kolorowa', unit: 'kg', pricePerUnit: 15, category: 'material' },
  { id: 'M11', name: 'Panele podłogowe AC4', unit: 'm2', pricePerUnit: 55, category: 'material' },
  { id: 'M12', name: 'Panele podłogowe AC5', unit: 'm2', pricePerUnit: 85, category: 'material' },
  { id: 'M13', name: 'Podkład pod panele', unit: 'm2', pricePerUnit: 8, category: 'material' },
  { id: 'M14', name: 'Gładź gipsowa', unit: 'kg', pricePerUnit: 3.5, category: 'material' },
  { id: 'M15', name: 'Listwy przypodłogowe PVC', unit: 'mb', pricePerUnit: 12, category: 'material' },
  { id: 'M16', name: 'Listwy przypodłogowe MDF', unit: 'mb', pricePerUnit: 18, category: 'material' },
  { id: 'M17', name: 'Drzwi wewnętrzne standard', unit: 'szt', pricePerUnit: 450, category: 'material' },
  { id: 'M18', name: 'Drzwi wewnętrzne premium', unit: 'szt', pricePerUnit: 850, category: 'material' },
  { id: 'M19', name: 'Gniazdko elektryczne', unit: 'szt', pricePerUnit: 28, category: 'material' },
  { id: 'M20', name: 'Włącznik światła', unit: 'szt', pricePerUnit: 25, category: 'material' },
  { id: 'M21', name: 'Oprawa oświetleniowa LED', unit: 'szt', pricePerUnit: 150, category: 'material' },
  { id: 'M22', name: 'Spot LED podtynkowy', unit: 'szt', pricePerUnit: 45, category: 'material' },
  { id: 'M23', name: 'WC kompakt', unit: 'szt', pricePerUnit: 650, category: 'material' },
  { id: 'M24', name: 'WC podwieszane', unit: 'szt', pricePerUnit: 1200, category: 'material' },
  { id: 'M25', name: 'Stelaż podtynkowy WC', unit: 'szt', pricePerUnit: 750, category: 'material' },
  { id: 'M26', name: 'Umywalka nablatowa', unit: 'szt', pricePerUnit: 350, category: 'material' },
  { id: 'M27', name: 'Umywalka podblatowa', unit: 'szt', pricePerUnit: 280, category: 'material' },
  { id: 'M28', name: 'Szafka pod umywalkę', unit: 'szt', pricePerUnit: 550, category: 'material' },
  { id: 'M29', name: 'Wanna akrylowa 170cm', unit: 'szt', pricePerUnit: 850, category: 'material' },
  { id: 'M30', name: 'Kabina prysznicowa 90x90', unit: 'szt', pricePerUnit: 1800, category: 'material' },
  { id: 'M31', name: 'Brodzik prysznicowy', unit: 'szt', pricePerUnit: 450, category: 'material' },
  { id: 'M32', name: 'Bateria umywalkowa', unit: 'szt', pricePerUnit: 280, category: 'material' },
  { id: 'M33', name: 'Bateria wannowa', unit: 'szt', pricePerUnit: 450, category: 'material' },
  { id: 'M34', name: 'Bateria prysznicowa', unit: 'szt', pricePerUnit: 380, category: 'material' },
  { id: 'M35', name: 'Hydroizolacja płynna', unit: 'kg', pricePerUnit: 25, category: 'material' },
  { id: 'M36', name: 'Wylewka samopoziomująca', unit: 'kg', pricePerUnit: 4, category: 'material' },
  { id: 'M37', name: 'Silikon sanitarny', unit: 'szt', pricePerUnit: 25, category: 'material' },
  { id: 'M38', name: 'Lustro łazienkowe 60x80', unit: 'szt', pricePerUnit: 250, category: 'material' },
  { id: 'M39', name: 'Grzejnik łazienkowy', unit: 'szt', pricePerUnit: 450, category: 'material' },
  { id: 'M40', name: 'Wentylator łazienkowy', unit: 'szt', pricePerUnit: 120, category: 'material' },
];

// Default work templates (with materials)
export const DEFAULT_WORK_TEMPLATES: WorkTemplate[] = [
  {
    id: 'W1',
    name: 'Malowanie ścian',
    unit: 'm2',
    laborPrice: 25,
    materials: [
      { itemTemplateId: 'M1', quantityPerUnit: 0.15 }, // 0.15l farby na m2
      { itemTemplateId: 'M3', quantityPerUnit: 0.1 }, // grunt
    ],
    roomTypes: ['lazienka', 'kuchnia', 'salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W2',
    name: 'Malowanie sufitu',
    unit: 'm2',
    laborPrice: 30,
    materials: [
      { itemTemplateId: 'M1', quantityPerUnit: 0.15 },
      { itemTemplateId: 'M3', quantityPerUnit: 0.1 },
    ],
    roomTypes: ['lazienka', 'kuchnia', 'salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W3',
    name: 'Układanie płytek podłogowych',
    unit: 'm2',
    laborPrice: 85,
    materials: [
      { itemTemplateId: 'M4', quantityPerUnit: 1.1 }, // +10% na docięcia
      { itemTemplateId: 'M7', quantityPerUnit: 5 }, // 5kg kleju na m2
      { itemTemplateId: 'M9', quantityPerUnit: 0.5 }, // fuga
    ],
    roomTypes: ['lazienka', 'kuchnia', 'korytarz']
  },
  {
    id: 'W4',
    name: 'Układanie płytek ściennych',
    unit: 'm2',
    laborPrice: 95,
    materials: [
      { itemTemplateId: 'M5', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M8', quantityPerUnit: 5 },
      { itemTemplateId: 'M10', quantityPerUnit: 0.5 },
    ],
    roomTypes: ['lazienka', 'kuchnia']
  },
  {
    id: 'W5',
    name: 'Montaż paneli podłogowych',
    unit: 'm2',
    laborPrice: 35,
    materials: [
      { itemTemplateId: 'M11', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M13', quantityPerUnit: 1 },
    ],
    roomTypes: ['salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W6',
    name: 'Gładź gipsowa ścian',
    unit: 'm2',
    laborPrice: 35,
    materials: [
      { itemTemplateId: 'M14', quantityPerUnit: 1.5 },
    ],
    roomTypes: ['lazienka', 'kuchnia', 'salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W7',
    name: 'Montaż listew przypodłogowych',
    unit: 'mb',
    laborPrice: 18,
    materials: [
      { itemTemplateId: 'M15', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W8',
    name: 'Hydroizolacja łazienki',
    unit: 'm2',
    laborPrice: 45,
    materials: [
      { itemTemplateId: 'M35', quantityPerUnit: 1.5 },
    ],
    roomTypes: ['lazienka']
  },
  {
    id: 'W9',
    name: 'Montaż WC podwieszanego',
    unit: 'szt',
    laborPrice: 450,
    materials: [
      { itemTemplateId: 'M24', quantityPerUnit: 1 },
      { itemTemplateId: 'M25', quantityPerUnit: 1 },
    ],
    roomTypes: ['lazienka']
  },
  {
    id: 'W10',
    name: 'Montaż umywalki z szafką',
    unit: 'szt',
    laborPrice: 350,
    materials: [
      { itemTemplateId: 'M26', quantityPerUnit: 1 },
      { itemTemplateId: 'M28', quantityPerUnit: 1 },
      { itemTemplateId: 'M32', quantityPerUnit: 1 },
    ],
    roomTypes: ['lazienka']
  },
  {
    id: 'W11',
    name: 'Montaż kabiny prysznicowej',
    unit: 'szt',
    laborPrice: 650,
    materials: [
      { itemTemplateId: 'M30', quantityPerUnit: 1 },
      { itemTemplateId: 'M31', quantityPerUnit: 1 },
      { itemTemplateId: 'M34', quantityPerUnit: 1 },
      { itemTemplateId: 'M37', quantityPerUnit: 2 },
    ],
    roomTypes: ['lazienka']
  },
  {
    id: 'W12',
    name: 'Skucie starych płytek',
    unit: 'm2',
    laborPrice: 45,
    materials: [],
    roomTypes: ['lazienka', 'kuchnia']
  },
];

// Default room renovation templates
export const DEFAULT_ROOM_RENOVATION_TEMPLATES: RoomRenovationTemplate[] = [
  {
    id: 'R1',
    name: 'Remont łazienki - kompleksowy',
    roomType: 'lazienka',
    description: 'Pełny remont łazienki z wymianą płytek i białego montażu',
    works: [
      { workTemplateId: 'W12', defaultQuantity: 25 }, // skucie płytek ~25m2
      { workTemplateId: 'W8', defaultQuantity: 10 }, // hydroizolacja podłogi
      { workTemplateId: 'W3', defaultQuantity: 5 }, // płytki podłogowe
      { workTemplateId: 'W4', defaultQuantity: 20 }, // płytki ścienne
      { workTemplateId: 'W9', defaultQuantity: 1 }, // WC
      { workTemplateId: 'W10', defaultQuantity: 1 }, // umywalka
      { workTemplateId: 'W11', defaultQuantity: 1 }, // kabina prysznicowa
    ]
  },
  {
    id: 'R2',
    name: 'Remont łazienki - odświeżenie',
    roomType: 'lazienka',
    description: 'Malowanie i drobne poprawki bez wymiany płytek',
    works: [
      { workTemplateId: 'W2', defaultQuantity: 5 }, // malowanie sufitu
      { workTemplateId: 'W1', defaultQuantity: 10 }, // malowanie ścian (część)
    ]
  },
  {
    id: 'R3',
    name: 'Remont salonu - standard',
    roomType: 'salon',
    description: 'Gładzie, malowanie i panele podłogowe',
    works: [
      { workTemplateId: 'W6', defaultQuantity: 50 }, // gładzie ~50m2 ścian
      { workTemplateId: 'W1', defaultQuantity: 50 }, // malowanie ścian
      { workTemplateId: 'W2', defaultQuantity: 20 }, // malowanie sufitu
      { workTemplateId: 'W5', defaultQuantity: 20 }, // panele
      { workTemplateId: 'W7', defaultQuantity: 18 }, // listwy
    ]
  },
  {
    id: 'R4',
    name: 'Remont sypialni - standard',
    roomType: 'sypialnia',
    description: 'Gładzie, malowanie i panele podłogowe',
    works: [
      { workTemplateId: 'W6', defaultQuantity: 40 },
      { workTemplateId: 'W1', defaultQuantity: 40 },
      { workTemplateId: 'W2', defaultQuantity: 15 },
      { workTemplateId: 'W5', defaultQuantity: 15 },
      { workTemplateId: 'W7', defaultQuantity: 16 },
    ]
  },
  {
    id: 'R5',
    name: 'Remont kuchni - kompleksowy',
    roomType: 'kuchnia',
    description: 'Płytki, malowanie ścian i sufitu',
    works: [
      { workTemplateId: 'W12', defaultQuantity: 5 }, // skucie starych płytek nad blatem
      { workTemplateId: 'W4', defaultQuantity: 5 }, // nowe płytki nad blatem
      { workTemplateId: 'W6', defaultQuantity: 30 }, // gładzie
      { workTemplateId: 'W1', defaultQuantity: 25 }, // malowanie ścian
      { workTemplateId: 'W2', defaultQuantity: 10 }, // malowanie sufitu
    ]
  },
  {
    id: 'R6',
    name: 'Remont korytarza',
    roomType: 'korytarz',
    description: 'Gładzie, malowanie i panele',
    works: [
      { workTemplateId: 'W6', defaultQuantity: 25 },
      { workTemplateId: 'W1', defaultQuantity: 25 },
      { workTemplateId: 'W2', defaultQuantity: 6 },
      { workTemplateId: 'W5', defaultQuantity: 6 },
      { workTemplateId: 'W7', defaultQuantity: 12 },
    ]
  },
];
