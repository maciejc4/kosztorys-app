// Data types for the cost estimation application

export type UnitType = 'mb' | 'm2' | 'szt' | 'godz' | 'kpl' | 'l' | 'kg';

export type RoomType = 'lazienka' | 'kuchnia' | 'salon' | 'sypialnia' | 'korytarz' | 'balkon' | 'dach_plaski' | 'dach_skosny' | 'inne';

// Work categories for better organization
export type WorkCategory = 'elektryka' | 'hydraulika' | 'glazurnictwo' | 'malarstwo' | 'podlogi' | 'suche_zabudowy' | 'montaz' | 'demontaz' | 'dekarstwo' | 'inne';

export const WORK_CATEGORY_LABELS: Record<WorkCategory, string> = {
  elektryka: '⚡ Elektryka',
  hydraulika: '🚰 Hydraulika',
  glazurnictwo: '🔲 Glazurnictwo',
  malarstwo: '🎨 Malarstwo',
  podlogi: '🪵 Podłogi',
  suche_zabudowy: '📐 Suche zabudowy',
  montaz: '🔧 Montaż',
  demontaz: '🔨 Demontaż',
  dekarstwo: '🏠 Dekarstwo',
  inne: '📦 Inne'
};

export const ROOM_LABELS: Record<RoomType, string> = {
  lazienka: 'Łazienka',
  kuchnia: 'Kuchnia',
  salon: 'Salon',
  sypialnia: 'Sypialnia',
  korytarz: 'Korytarz/Przedpokój',
  balkon: 'Balkon/Taras',
  dach_plaski: 'Dach płaski',
  dach_skosny: 'Dach skośny',
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
  dach_plaski: 'Dach płaski',
  dach_skosny: 'Dach skośny',
  inne: 'Pomieszczenie'
};

// Single item template (service/material)
export interface ItemTemplate {
  id: string;
  name: string;
  unit: UnitType;
  pricePerUnit: number;
  category: 'labor' | 'material';
  workCategory?: WorkCategory; // optional work category for filtering
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
  workCategory?: WorkCategory; // optional category for filtering
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
  // ========== ELEKTRYKA (Labor) ==========
  { id: 'L10', name: 'Montaż gniazdek elektrycznych', unit: 'szt', pricePerUnit: 50, category: 'labor', workCategory: 'elektryka' },
  { id: 'L11', name: 'Instalacja oświetlenia', unit: 'szt', pricePerUnit: 90, category: 'labor', workCategory: 'elektryka' },
  { id: 'L26', name: 'Prowadzenie kabli elektrycznych', unit: 'mb', pricePerUnit: 25, category: 'labor', workCategory: 'elektryka' },
  { id: 'L27', name: 'Montaż rozdzielni elektrycznej', unit: 'szt', pricePerUnit: 450, category: 'labor', workCategory: 'elektryka' },
  { id: 'L28', name: 'Montaż włączników światła', unit: 'szt', pricePerUnit: 40, category: 'labor', workCategory: 'elektryka' },
  { id: 'L29', name: 'Montaż domofonu/wideodomofonu', unit: 'szt', pricePerUnit: 350, category: 'labor', workCategory: 'elektryka' },
  { id: 'L30', name: 'Instalacja TV/SAT', unit: 'szt', pricePerUnit: 150, category: 'labor', workCategory: 'elektryka' },
  { id: 'L31', name: 'Montaż wentylatora łazienkowego', unit: 'szt', pricePerUnit: 120, category: 'labor', workCategory: 'elektryka' },
  
  // ========== HYDRAULIKA (Labor) ==========
  { id: 'L12', name: 'Prace hydrauliczne', unit: 'godz', pricePerUnit: 130, category: 'labor', workCategory: 'hydraulika' },
  { id: 'L13', name: 'Montaż WC', unit: 'szt', pricePerUnit: 350, category: 'labor', workCategory: 'hydraulika' },
  { id: 'L14', name: 'Montaż umywalki', unit: 'szt', pricePerUnit: 250, category: 'labor', workCategory: 'hydraulika' },
  { id: 'L15', name: 'Montaż wanny', unit: 'szt', pricePerUnit: 450, category: 'labor', workCategory: 'hydraulika' },
  { id: 'L16', name: 'Montaż kabiny prysznicowej', unit: 'szt', pricePerUnit: 550, category: 'labor', workCategory: 'hydraulika' },
  { id: 'L17', name: 'Montaż baterii', unit: 'szt', pricePerUnit: 120, category: 'labor', workCategory: 'hydraulika' },
  { id: 'L24', name: 'Montaż zlewozmywaka', unit: 'szt', pricePerUnit: 200, category: 'labor', workCategory: 'hydraulika' },
  { id: 'L32', name: 'Prowadzenie rur wodnych', unit: 'mb', pricePerUnit: 85, category: 'labor', workCategory: 'hydraulika' },
  { id: 'L33', name: 'Prowadzenie rur kanalizacyjnych', unit: 'mb', pricePerUnit: 95, category: 'labor', workCategory: 'hydraulika' },
  { id: 'L34', name: 'Montaż grzejnika', unit: 'szt', pricePerUnit: 280, category: 'labor', workCategory: 'hydraulika' },
  { id: 'L35', name: 'Montaż podgrzewacza wody', unit: 'szt', pricePerUnit: 350, category: 'labor', workCategory: 'hydraulika' },
  { id: 'L36', name: 'Montaż pralki/zmywarki', unit: 'szt', pricePerUnit: 150, category: 'labor', workCategory: 'hydraulika' },
  
  // ========== GLAZURNICTWO (Labor) ==========
  { id: 'L3', name: 'Układanie płytek podłogowych', unit: 'm2', pricePerUnit: 85, category: 'labor', workCategory: 'glazurnictwo' },
  { id: 'L4', name: 'Układanie płytek ściennych', unit: 'm2', pricePerUnit: 95, category: 'labor', workCategory: 'glazurnictwo' },
  { id: 'L18', name: 'Skucie starych płytek', unit: 'm2', pricePerUnit: 45, category: 'labor', workCategory: 'glazurnictwo' },
  { id: 'L37', name: 'Układanie mozaiki', unit: 'm2', pricePerUnit: 150, category: 'labor', workCategory: 'glazurnictwo' },
  { id: 'L38', name: 'Układanie gresu wielkoformatowego', unit: 'm2', pricePerUnit: 120, category: 'labor', workCategory: 'glazurnictwo' },
  { id: 'L39', name: 'Fugowanie płytek', unit: 'm2', pricePerUnit: 25, category: 'labor', workCategory: 'glazurnictwo' },
  { id: 'L40', name: 'Impregnacja fug', unit: 'm2', pricePerUnit: 15, category: 'labor', workCategory: 'glazurnictwo' },
  
  // ========== MALARSTWO (Labor) ==========
  { id: 'L1', name: 'Malowanie ścian', unit: 'm2', pricePerUnit: 25, category: 'labor', workCategory: 'malarstwo' },
  { id: 'L2', name: 'Malowanie sufitu', unit: 'm2', pricePerUnit: 30, category: 'labor', workCategory: 'malarstwo' },
  { id: 'L6', name: 'Gładź gipsowa ścian', unit: 'm2', pricePerUnit: 35, category: 'labor', workCategory: 'malarstwo' },
  { id: 'L7', name: 'Gładź gipsowa sufitu', unit: 'm2', pricePerUnit: 40, category: 'labor', workCategory: 'malarstwo' },
  { id: 'L41', name: 'Gruntowanie ścian', unit: 'm2', pricePerUnit: 8, category: 'labor', workCategory: 'malarstwo' },
  { id: 'L42', name: 'Tapetowanie', unit: 'm2', pricePerUnit: 45, category: 'labor', workCategory: 'malarstwo' },
  { id: 'L43', name: 'Malowanie dekoracyjne (stiuk)', unit: 'm2', pricePerUnit: 85, category: 'labor', workCategory: 'malarstwo' },
  { id: 'L44', name: 'Nakładanie tynku dekoracyjnego', unit: 'm2', pricePerUnit: 65, category: 'labor', workCategory: 'malarstwo' },
  
  // ========== PODŁOGI (Labor) ==========
  { id: 'L5', name: 'Montaż paneli podłogowych', unit: 'm2', pricePerUnit: 35, category: 'labor', workCategory: 'podlogi' },
  { id: 'L8', name: 'Montaż listew przypodłogowych', unit: 'mb', pricePerUnit: 18, category: 'labor', workCategory: 'podlogi' },
  { id: 'L19', name: 'Demontaż starych paneli', unit: 'm2', pricePerUnit: 15, category: 'labor', workCategory: 'podlogi' },
  { id: 'L20', name: 'Wyrównanie podłogi', unit: 'm2', pricePerUnit: 55, category: 'labor', workCategory: 'podlogi' },
  { id: 'L21', name: 'Hydroizolacja', unit: 'm2', pricePerUnit: 45, category: 'labor', workCategory: 'podlogi' },
  { id: 'L45', name: 'Montaż parkietu', unit: 'm2', pricePerUnit: 75, category: 'labor', workCategory: 'podlogi' },
  { id: 'L46', name: 'Cyklinowanie parkietu', unit: 'm2', pricePerUnit: 45, category: 'labor', workCategory: 'podlogi' },
  { id: 'L47', name: 'Lakierowanie parkietu', unit: 'm2', pricePerUnit: 35, category: 'labor', workCategory: 'podlogi' },
  { id: 'L48', name: 'Montaż wykładziny PVC', unit: 'm2', pricePerUnit: 25, category: 'labor', workCategory: 'podlogi' },
  { id: 'L49', name: 'Wylewka betonowa', unit: 'm2', pricePerUnit: 65, category: 'labor', workCategory: 'podlogi' },
  
  // ========== SUCHE ZABUDOWY (Labor) ==========
  { id: 'L50', name: 'Zabudowa z płyt G-K (ściana)', unit: 'm2', pricePerUnit: 75, category: 'labor', workCategory: 'suche_zabudowy' },
  { id: 'L51', name: 'Zabudowa z płyt G-K (sufit)', unit: 'm2', pricePerUnit: 85, category: 'labor', workCategory: 'suche_zabudowy' },
  { id: 'L52', name: 'Sufit podwieszany kasetonowy', unit: 'm2', pricePerUnit: 95, category: 'labor', workCategory: 'suche_zabudowy' },
  { id: 'L53', name: 'Zabudowa instalacji (rury, piony)', unit: 'mb', pricePerUnit: 120, category: 'labor', workCategory: 'suche_zabudowy' },
  { id: 'L54', name: 'Ocieplenie ścian styropianem', unit: 'm2', pricePerUnit: 85, category: 'labor', workCategory: 'suche_zabudowy' },
  { id: 'L55', name: 'Ocieplenie ścian wełną mineralną', unit: 'm2', pricePerUnit: 75, category: 'labor', workCategory: 'suche_zabudowy' },
  
  // ========== MONTAŻ (Labor) ==========
  { id: 'L9', name: 'Montaż drzwi wewnętrznych', unit: 'szt', pricePerUnit: 280, category: 'labor', workCategory: 'montaz' },
  { id: 'L22', name: 'Montaż mebli kuchennych', unit: 'mb', pricePerUnit: 350, category: 'labor', workCategory: 'montaz' },
  { id: 'L23', name: 'Montaż blatu kuchennego', unit: 'mb', pricePerUnit: 180, category: 'labor', workCategory: 'montaz' },
  { id: 'L25', name: 'Montaż okapu', unit: 'szt', pricePerUnit: 250, category: 'labor', workCategory: 'montaz' },
  { id: 'L56', name: 'Montaż okien', unit: 'szt', pricePerUnit: 350, category: 'labor', workCategory: 'montaz' },
  { id: 'L57', name: 'Montaż parapetu wewnętrznego', unit: 'mb', pricePerUnit: 80, category: 'labor', workCategory: 'montaz' },
  { id: 'L58', name: 'Montaż rolet/żaluzji', unit: 'szt', pricePerUnit: 120, category: 'labor', workCategory: 'montaz' },
  { id: 'L59', name: 'Montaż karniszy', unit: 'szt', pricePerUnit: 80, category: 'labor', workCategory: 'montaz' },
  { id: 'L60', name: 'Montaż lustra', unit: 'szt', pricePerUnit: 100, category: 'labor', workCategory: 'montaz' },
  { id: 'L61', name: 'Montaż szafy wnękowej', unit: 'mb', pricePerUnit: 450, category: 'labor', workCategory: 'montaz' },
  
  // ========== DEMONTAŻ (Labor) ==========
  { id: 'L62', name: 'Demontaż ścian działowych', unit: 'm2', pricePerUnit: 55, category: 'labor', workCategory: 'demontaz' },
  { id: 'L63', name: 'Demontaż okien', unit: 'szt', pricePerUnit: 150, category: 'labor', workCategory: 'demontaz' },
  { id: 'L64', name: 'Demontaż drzwi', unit: 'szt', pricePerUnit: 80, category: 'labor', workCategory: 'demontaz' },
  { id: 'L65', name: 'Demontaż mebli kuchennych', unit: 'mb', pricePerUnit: 100, category: 'labor', workCategory: 'demontaz' },
  { id: 'L66', name: 'Demontaż armatury sanitarnej', unit: 'szt', pricePerUnit: 120, category: 'labor', workCategory: 'demontaz' },
  { id: 'L67', name: 'Wywóz gruzu', unit: 'm2', pricePerUnit: 35, category: 'labor', workCategory: 'demontaz' },
  { id: 'L68', name: 'Wywóz mebli/sprzętów', unit: 'szt', pricePerUnit: 80, category: 'labor', workCategory: 'demontaz' },
  
  // ========== MATERIAŁY - MALARSTWO ==========
  { id: 'M1', name: 'Farba emulsyjna biała', unit: 'l', pricePerUnit: 35, category: 'material', workCategory: 'malarstwo' },
  { id: 'M2', name: 'Farba emulsyjna kolorowa', unit: 'l', pricePerUnit: 55, category: 'material', workCategory: 'malarstwo' },
  { id: 'M3', name: 'Grunt pod farbę', unit: 'l', pricePerUnit: 25, category: 'material', workCategory: 'malarstwo' },
  { id: 'M14', name: 'Gładź gipsowa', unit: 'kg', pricePerUnit: 3.5, category: 'material', workCategory: 'malarstwo' },
  { id: 'M41', name: 'Tapeta winylowa', unit: 'm2', pricePerUnit: 45, category: 'material', workCategory: 'malarstwo' },
  { id: 'M42', name: 'Klej do tapet', unit: 'kg', pricePerUnit: 25, category: 'material', workCategory: 'malarstwo' },
  { id: 'M43', name: 'Tynk dekoracyjny', unit: 'kg', pricePerUnit: 15, category: 'material', workCategory: 'malarstwo' },
  { id: 'M44', name: 'Farba lateksowa (łazienka/kuchnia)', unit: 'l', pricePerUnit: 65, category: 'material', workCategory: 'malarstwo' },
  
  // ========== MATERIAŁY - GLAZURNICTWO ==========
  { id: 'M4', name: 'Płytki ceramiczne podłogowe', unit: 'm2', pricePerUnit: 75, category: 'material', workCategory: 'glazurnictwo' },
  { id: 'M5', name: 'Płytki ceramiczne ścienne', unit: 'm2', pricePerUnit: 65, category: 'material', workCategory: 'glazurnictwo' },
  { id: 'M6', name: 'Płytki gresowe', unit: 'm2', pricePerUnit: 95, category: 'material', workCategory: 'glazurnictwo' },
  { id: 'M7', name: 'Klej do płytek standard', unit: 'kg', pricePerUnit: 2.5, category: 'material', workCategory: 'glazurnictwo' },
  { id: 'M8', name: 'Klej do płytek elastyczny', unit: 'kg', pricePerUnit: 4, category: 'material', workCategory: 'glazurnictwo' },
  { id: 'M9', name: 'Fuga szara', unit: 'kg', pricePerUnit: 8, category: 'material', workCategory: 'glazurnictwo' },
  { id: 'M10', name: 'Fuga kolorowa', unit: 'kg', pricePerUnit: 15, category: 'material', workCategory: 'glazurnictwo' },
  { id: 'M45', name: 'Płytki wielkoformatowe 60x120', unit: 'm2', pricePerUnit: 150, category: 'material', workCategory: 'glazurnictwo' },
  { id: 'M46', name: 'Mozaika szklana', unit: 'm2', pricePerUnit: 180, category: 'material', workCategory: 'glazurnictwo' },
  { id: 'M47', name: 'Profil wykończeniowy do płytek', unit: 'mb', pricePerUnit: 25, category: 'material', workCategory: 'glazurnictwo' },
  { id: 'M48', name: 'Fuga epoksydowa', unit: 'kg', pricePerUnit: 85, category: 'material', workCategory: 'glazurnictwo' },
  
  // ========== MATERIAŁY - PODŁOGI ==========
  { id: 'M11', name: 'Panele podłogowe AC4', unit: 'm2', pricePerUnit: 55, category: 'material', workCategory: 'podlogi' },
  { id: 'M12', name: 'Panele podłogowe AC5', unit: 'm2', pricePerUnit: 85, category: 'material', workCategory: 'podlogi' },
  { id: 'M13', name: 'Podkład pod panele', unit: 'm2', pricePerUnit: 8, category: 'material', workCategory: 'podlogi' },
  { id: 'M15', name: 'Listwy przypodłogowe PVC', unit: 'mb', pricePerUnit: 12, category: 'material', workCategory: 'podlogi' },
  { id: 'M16', name: 'Listwy przypodłogowe MDF', unit: 'mb', pricePerUnit: 18, category: 'material', workCategory: 'podlogi' },
  { id: 'M36', name: 'Wylewka samopoziomująca', unit: 'kg', pricePerUnit: 4, category: 'material', workCategory: 'podlogi' },
  { id: 'M49', name: 'Panele winylowe LVT', unit: 'm2', pricePerUnit: 120, category: 'material', workCategory: 'podlogi' },
  { id: 'M50', name: 'Parkiet dębowy', unit: 'm2', pricePerUnit: 180, category: 'material', workCategory: 'podlogi' },
  { id: 'M51', name: 'Lakier do parkietu', unit: 'l', pricePerUnit: 85, category: 'material', workCategory: 'podlogi' },
  { id: 'M52', name: 'Wykładzina PVC', unit: 'm2', pricePerUnit: 45, category: 'material', workCategory: 'podlogi' },
  { id: 'M53', name: 'Folia PE pod podłogę', unit: 'm2', pricePerUnit: 3, category: 'material', workCategory: 'podlogi' },
  
  // ========== MATERIAŁY - MONTAŻ ==========
  { id: 'M17', name: 'Drzwi wewnętrzne standard', unit: 'szt', pricePerUnit: 450, category: 'material', workCategory: 'montaz' },
  { id: 'M18', name: 'Drzwi wewnętrzne premium', unit: 'szt', pricePerUnit: 850, category: 'material', workCategory: 'montaz' },
  { id: 'M54', name: 'Drzwi przesuwne', unit: 'szt', pricePerUnit: 1200, category: 'material', workCategory: 'montaz' },
  { id: 'M55', name: 'Ościeżnica regulowana', unit: 'szt', pricePerUnit: 280, category: 'material', workCategory: 'montaz' },
  { id: 'M56', name: 'Klamka drzwiowa', unit: 'szt', pricePerUnit: 85, category: 'material', workCategory: 'montaz' },
  { id: 'M57', name: 'Parapet wewnętrzny PVC', unit: 'mb', pricePerUnit: 65, category: 'material', workCategory: 'montaz' },
  { id: 'M58', name: 'Parapet wewnętrzny drewniany', unit: 'mb', pricePerUnit: 120, category: 'material', workCategory: 'montaz' },
  { id: 'M59', name: 'Roleta materiałowa', unit: 'szt', pricePerUnit: 180, category: 'material', workCategory: 'montaz' },
  { id: 'M60', name: 'Roleta zewnętrzna', unit: 'szt', pricePerUnit: 450, category: 'material', workCategory: 'montaz' },
  
  // ========== MATERIAŁY - ELEKTRYKA ==========
  { id: 'M19', name: 'Gniazdko elektryczne', unit: 'szt', pricePerUnit: 28, category: 'material', workCategory: 'elektryka' },
  { id: 'M20', name: 'Włącznik światła', unit: 'szt', pricePerUnit: 25, category: 'material', workCategory: 'elektryka' },
  { id: 'M21', name: 'Oprawa oświetleniowa LED', unit: 'szt', pricePerUnit: 150, category: 'material', workCategory: 'elektryka' },
  { id: 'M22', name: 'Spot LED podtynkowy', unit: 'szt', pricePerUnit: 45, category: 'material', workCategory: 'elektryka' },
  { id: 'M61', name: 'Kabel elektryczny YDY 3x2.5', unit: 'mb', pricePerUnit: 8, category: 'material', workCategory: 'elektryka' },
  { id: 'M62', name: 'Rozdzielnia elektryczna', unit: 'szt', pricePerUnit: 350, category: 'material', workCategory: 'elektryka' },
  { id: 'M63', name: 'Bezpiecznik różnicowy', unit: 'szt', pricePerUnit: 120, category: 'material', workCategory: 'elektryka' },
  { id: 'M64', name: 'Puszka elektryczna', unit: 'szt', pricePerUnit: 5, category: 'material', workCategory: 'elektryka' },
  { id: 'M65', name: 'Taśma LED z zasilaczem', unit: 'mb', pricePerUnit: 35, category: 'material', workCategory: 'elektryka' },
  { id: 'M40', name: 'Wentylator łazienkowy', unit: 'szt', pricePerUnit: 120, category: 'material', workCategory: 'elektryka' },
  
  // ========== MATERIAŁY - HYDRAULIKA (biały montaż) ==========
  { id: 'M23', name: 'WC kompakt', unit: 'szt', pricePerUnit: 650, category: 'material', workCategory: 'hydraulika' },
  { id: 'M24', name: 'WC podwieszane', unit: 'szt', pricePerUnit: 1200, category: 'material', workCategory: 'hydraulika' },
  { id: 'M25', name: 'Stelaż podtynkowy WC', unit: 'szt', pricePerUnit: 750, category: 'material', workCategory: 'hydraulika' },
  { id: 'M26', name: 'Umywalka nablatowa', unit: 'szt', pricePerUnit: 350, category: 'material', workCategory: 'hydraulika' },
  { id: 'M27', name: 'Umywalka podblatowa', unit: 'szt', pricePerUnit: 280, category: 'material', workCategory: 'hydraulika' },
  { id: 'M28', name: 'Szafka pod umywalkę', unit: 'szt', pricePerUnit: 550, category: 'material', workCategory: 'hydraulika' },
  { id: 'M29', name: 'Wanna akrylowa 170cm', unit: 'szt', pricePerUnit: 850, category: 'material', workCategory: 'hydraulika' },
  { id: 'M30', name: 'Kabina prysznicowa 90x90', unit: 'szt', pricePerUnit: 1800, category: 'material', workCategory: 'hydraulika' },
  { id: 'M31', name: 'Brodzik prysznicowy', unit: 'szt', pricePerUnit: 450, category: 'material', workCategory: 'hydraulika' },
  { id: 'M32', name: 'Bateria umywalkowa', unit: 'szt', pricePerUnit: 280, category: 'material', workCategory: 'hydraulika' },
  { id: 'M33', name: 'Bateria wannowa', unit: 'szt', pricePerUnit: 450, category: 'material', workCategory: 'hydraulika' },
  { id: 'M34', name: 'Bateria prysznicowa', unit: 'szt', pricePerUnit: 380, category: 'material', workCategory: 'hydraulika' },
  { id: 'M35', name: 'Hydroizolacja płynna', unit: 'kg', pricePerUnit: 25, category: 'material', workCategory: 'hydraulika' },
  { id: 'M37', name: 'Silikon sanitarny', unit: 'szt', pricePerUnit: 25, category: 'material', workCategory: 'hydraulika' },
  { id: 'M38', name: 'Lustro łazienkowe 60x80', unit: 'szt', pricePerUnit: 250, category: 'material', workCategory: 'hydraulika' },
  { id: 'M39', name: 'Grzejnik łazienkowy', unit: 'szt', pricePerUnit: 450, category: 'material', workCategory: 'hydraulika' },
  { id: 'M66', name: 'Zlewozmywak granitowy', unit: 'szt', pricePerUnit: 650, category: 'material', workCategory: 'hydraulika' },
  { id: 'M67', name: 'Zlewozmywak stalowy', unit: 'szt', pricePerUnit: 280, category: 'material', workCategory: 'hydraulika' },
  { id: 'M68', name: 'Bateria kuchenna', unit: 'szt', pricePerUnit: 350, category: 'material', workCategory: 'hydraulika' },
  { id: 'M69', name: 'Odpływ liniowy prysznicowy', unit: 'szt', pricePerUnit: 450, category: 'material', workCategory: 'hydraulika' },
  { id: 'M70', name: 'Syfon umywalkowy', unit: 'szt', pricePerUnit: 45, category: 'material', workCategory: 'hydraulika' },
  
  // ========== MATERIAŁY - SUCHE ZABUDOWY ==========
  { id: 'M71', name: 'Płyta G-K standard 12.5mm', unit: 'm2', pricePerUnit: 25, category: 'material', workCategory: 'suche_zabudowy' },
  { id: 'M72', name: 'Płyta G-K wodoodporna (zielona)', unit: 'm2', pricePerUnit: 35, category: 'material', workCategory: 'suche_zabudowy' },
  { id: 'M73', name: 'Profil CD 60', unit: 'mb', pricePerUnit: 8, category: 'material', workCategory: 'suche_zabudowy' },
  { id: 'M74', name: 'Profil UD 30', unit: 'mb', pricePerUnit: 6, category: 'material', workCategory: 'suche_zabudowy' },
  { id: 'M75', name: 'Wełna mineralna 10cm', unit: 'm2', pricePerUnit: 35, category: 'material', workCategory: 'suche_zabudowy' },
  { id: 'M76', name: 'Styropian EPS 100 10cm', unit: 'm2', pricePerUnit: 45, category: 'material', workCategory: 'suche_zabudowy' },
  { id: 'M77', name: 'Wkręty do płyt G-K', unit: 'szt', pricePerUnit: 0.15, category: 'material', workCategory: 'suche_zabudowy' },
  { id: 'M78', name: 'Taśma do płyt G-K', unit: 'mb', pricePerUnit: 1.5, category: 'material', workCategory: 'suche_zabudowy' },
  
  // ========== DEKARSTWO (Labor) ==========
  // Dachy płaskie
  { id: 'L100', name: 'Układanie papy termozgrzewalnej', unit: 'm2', pricePerUnit: 45, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L101', name: 'Układanie membrany PVC/EPDM', unit: 'm2', pricePerUnit: 55, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L102', name: 'Naprawa dachu płaskiego', unit: 'm2', pricePerUnit: 35, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L103', name: 'Ocieplenie dachu płaskiego styropianem', unit: 'm2', pricePerUnit: 65, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L104', name: 'Wykonanie wylewki spadkowej', unit: 'm2', pricePerUnit: 75, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L105', name: 'Montaż obróbek blacharskich (attyka)', unit: 'mb', pricePerUnit: 85, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L106', name: 'Montaż wpustu dachowego', unit: 'szt', pricePerUnit: 250, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L107', name: 'Zerwanie starej papy', unit: 'm2', pricePerUnit: 25, category: 'labor', workCategory: 'dekarstwo' },
  
  // Dachy skośne
  { id: 'L110', name: 'Montaż dachówki ceramicznej', unit: 'm2', pricePerUnit: 75, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L111', name: 'Montaż dachówki betonowej', unit: 'm2', pricePerUnit: 65, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L112', name: 'Montaż blachodachówki', unit: 'm2', pricePerUnit: 45, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L113', name: 'Montaż blachy na rąbek stojący', unit: 'm2', pricePerUnit: 95, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L114', name: 'Montaż gontu bitumicznego', unit: 'm2', pricePerUnit: 55, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L115', name: 'Montaż łat i kontrłat', unit: 'm2', pricePerUnit: 35, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L116', name: 'Montaż folii dachowej (membrana)', unit: 'm2', pricePerUnit: 15, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L117', name: 'Ocieplenie dachu skośnego wełną', unit: 'm2', pricePerUnit: 55, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L118', name: 'Montaż okna dachowego', unit: 'szt', pricePerUnit: 450, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L119', name: 'Montaż wyłazu dachowego', unit: 'szt', pricePerUnit: 350, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L120', name: 'Montaż rynien PVC', unit: 'mb', pricePerUnit: 45, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L121', name: 'Montaż rynien stalowych', unit: 'mb', pricePerUnit: 65, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L122', name: 'Montaż rur spustowych', unit: 'mb', pricePerUnit: 55, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L123', name: 'Montaż obróbek blacharskich', unit: 'mb', pricePerUnit: 75, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L124', name: 'Montaż kominka wentylacyjnego', unit: 'szt', pricePerUnit: 180, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L125', name: 'Wymiana więźby dachowej', unit: 'm2', pricePerUnit: 180, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L126', name: 'Impregnacja więźby dachowej', unit: 'm2', pricePerUnit: 25, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L127', name: 'Demontaż starego pokrycia', unit: 'm2', pricePerUnit: 30, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L128', name: 'Montaż podbitki dachowej PVC', unit: 'm2', pricePerUnit: 85, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L129', name: 'Montaż podbitki drewnianej', unit: 'm2', pricePerUnit: 95, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L130', name: 'Montaż ławy kominiarskiej', unit: 'szt', pricePerUnit: 280, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L131', name: 'Montaż stopni kominiarskich', unit: 'szt', pricePerUnit: 85, category: 'labor', workCategory: 'dekarstwo' },
  { id: 'L132', name: 'Montaż płotków śniegowych', unit: 'mb', pricePerUnit: 95, category: 'labor', workCategory: 'dekarstwo' },
  
  // ========== MATERIAŁY - DEKARSTWO ==========
  // Dachy płaskie
  { id: 'M100', name: 'Papa termozgrzewalna wierzchnia', unit: 'm2', pricePerUnit: 28, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M101', name: 'Papa termozgrzewalna podkładowa', unit: 'm2', pricePerUnit: 18, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M102', name: 'Membrana PVC dachowa', unit: 'm2', pricePerUnit: 45, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M103', name: 'Membrana EPDM', unit: 'm2', pricePerUnit: 55, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M104', name: 'Styropian dachowy EPS 100 10cm', unit: 'm2', pricePerUnit: 48, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M105', name: 'Styropian dachowy EPS 100 15cm', unit: 'm2', pricePerUnit: 72, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M106', name: 'Klej do styropianu', unit: 'kg', pricePerUnit: 8, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M107', name: 'Wpust dachowy DN100', unit: 'szt', pricePerUnit: 180, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M108', name: 'Blacha attykowa', unit: 'mb', pricePerUnit: 65, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M109', name: 'Rozprawa asfaltowa (abizol)', unit: 'kg', pricePerUnit: 12, category: 'material', workCategory: 'dekarstwo' },
  
  // Dachy skośne - pokrycia
  { id: 'M110', name: 'Dachówka ceramiczna', unit: 'm2', pricePerUnit: 85, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M111', name: 'Dachówka betonowa', unit: 'm2', pricePerUnit: 55, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M112', name: 'Blachodachówka modułowa', unit: 'm2', pricePerUnit: 48, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M113', name: 'Blachodachówka panelowa', unit: 'm2', pricePerUnit: 65, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M114', name: 'Blacha na rąbek stojący', unit: 'm2', pricePerUnit: 95, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M115', name: 'Gont bitumiczny', unit: 'm2', pricePerUnit: 45, category: 'material', workCategory: 'dekarstwo' },
  
  // Dachy skośne - konstrukcja i akcesoria
  { id: 'M116', name: 'Łata dachowa 4x5cm', unit: 'mb', pricePerUnit: 6, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M117', name: 'Kontrłata 2.5x5cm', unit: 'mb', pricePerUnit: 4, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M118', name: 'Folia dachowa paroprzepuszczalna', unit: 'm2', pricePerUnit: 8, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M119', name: 'Membrana dachowa wysokoparoprzepuszczalna', unit: 'm2', pricePerUnit: 15, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M120', name: 'Wełna mineralna dachowa 15cm', unit: 'm2', pricePerUnit: 55, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M121', name: 'Wełna mineralna dachowa 20cm', unit: 'm2', pricePerUnit: 75, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M122', name: 'Okno dachowe 78x118', unit: 'szt', pricePerUnit: 1200, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M123', name: 'Okno dachowe 55x78', unit: 'szt', pricePerUnit: 850, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M124', name: 'Kołnierz do okna dachowego', unit: 'szt', pricePerUnit: 280, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M125', name: 'Wyłaz dachowy', unit: 'szt', pricePerUnit: 650, category: 'material', workCategory: 'dekarstwo' },
  
  // Rynny i obróbki
  { id: 'M126', name: 'Rynna PVC 125mm', unit: 'mb', pricePerUnit: 28, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M127', name: 'Rynna stalowa ocynkowana 150mm', unit: 'mb', pricePerUnit: 55, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M128', name: 'Rura spustowa PVC 90mm', unit: 'mb', pricePerUnit: 25, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M129', name: 'Rura spustowa stalowa 100mm', unit: 'mb', pricePerUnit: 48, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M130', name: 'Hak rynnowy PVC', unit: 'szt', pricePerUnit: 8, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M131', name: 'Hak rynnowy stalowy', unit: 'szt', pricePerUnit: 15, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M132', name: 'Blacha obróbkowa powlekana', unit: 'm2', pricePerUnit: 65, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M133', name: 'Gąsior dachowy ceramiczny', unit: 'mb', pricePerUnit: 45, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M134', name: 'Gąsior dachowy betonowy', unit: 'mb', pricePerUnit: 35, category: 'material', workCategory: 'dekarstwo' },
  
  // Akcesoria bezpieczeństwa i wentylacja
  { id: 'M135', name: 'Kominek wentylacyjny', unit: 'szt', pricePerUnit: 120, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M136', name: 'Ława kominiarska', unit: 'szt', pricePerUnit: 350, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M137', name: 'Stopień kominiarski', unit: 'szt', pricePerUnit: 65, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M138', name: 'Płotek przeciwśniegowy', unit: 'mb', pricePerUnit: 85, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M139', name: 'Podbitka PVC', unit: 'm2', pricePerUnit: 55, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M140', name: 'Podbitka drewniana (deska)', unit: 'm2', pricePerUnit: 75, category: 'material', workCategory: 'dekarstwo' },
  { id: 'M141', name: 'Impregnat do drewna', unit: 'l', pricePerUnit: 35, category: 'material', workCategory: 'dekarstwo' },
];

// Default work templates (with materials)
export const DEFAULT_WORK_TEMPLATES: WorkTemplate[] = [
  // ========== MALARSTWO ==========
  {
    id: 'W1',
    name: 'Malowanie ścian',
    unit: 'm2',
    laborPrice: 25,
    workCategory: 'malarstwo',
    materials: [
      { itemTemplateId: 'M1', quantityPerUnit: 0.15 },
      { itemTemplateId: 'M3', quantityPerUnit: 0.1 },
    ],
    roomTypes: ['lazienka', 'kuchnia', 'salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W2',
    name: 'Malowanie sufitu',
    unit: 'm2',
    laborPrice: 30,
    workCategory: 'malarstwo',
    materials: [
      { itemTemplateId: 'M1', quantityPerUnit: 0.15 },
      { itemTemplateId: 'M3', quantityPerUnit: 0.1 },
    ],
    roomTypes: ['lazienka', 'kuchnia', 'salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W6',
    name: 'Gładź gipsowa ścian',
    unit: 'm2',
    laborPrice: 35,
    workCategory: 'malarstwo',
    materials: [
      { itemTemplateId: 'M14', quantityPerUnit: 1.5 },
    ],
    roomTypes: ['lazienka', 'kuchnia', 'salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W13',
    name: 'Gruntowanie i malowanie ścian',
    unit: 'm2',
    laborPrice: 33,
    workCategory: 'malarstwo',
    materials: [
      { itemTemplateId: 'M3', quantityPerUnit: 0.15 },
      { itemTemplateId: 'M1', quantityPerUnit: 0.2 },
    ],
    roomTypes: ['salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W14',
    name: 'Tapetowanie ścian',
    unit: 'm2',
    laborPrice: 45,
    workCategory: 'malarstwo',
    materials: [
      { itemTemplateId: 'M41', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M42', quantityPerUnit: 0.2 },
    ],
    roomTypes: ['salon', 'sypialnia', 'korytarz']
  },
  {
    id: 'W15',
    name: 'Malowanie łazienki (farba lateksowa)',
    unit: 'm2',
    laborPrice: 30,
    workCategory: 'malarstwo',
    materials: [
      { itemTemplateId: 'M3', quantityPerUnit: 0.1 },
      { itemTemplateId: 'M44', quantityPerUnit: 0.15 },
    ],
    roomTypes: ['lazienka', 'kuchnia']
  },
  
  // ========== GLAZURNICTWO ==========
  {
    id: 'W3',
    name: 'Układanie płytek podłogowych',
    unit: 'm2',
    laborPrice: 85,
    workCategory: 'glazurnictwo',
    materials: [
      { itemTemplateId: 'M4', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M7', quantityPerUnit: 5 },
      { itemTemplateId: 'M9', quantityPerUnit: 0.5 },
    ],
    roomTypes: ['lazienka', 'kuchnia', 'korytarz']
  },
  {
    id: 'W4',
    name: 'Układanie płytek ściennych',
    unit: 'm2',
    laborPrice: 95,
    workCategory: 'glazurnictwo',
    materials: [
      { itemTemplateId: 'M5', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M8', quantityPerUnit: 5 },
      { itemTemplateId: 'M10', quantityPerUnit: 0.5 },
    ],
    roomTypes: ['lazienka', 'kuchnia']
  },
  {
    id: 'W12',
    name: 'Skucie starych płytek',
    unit: 'm2',
    laborPrice: 45,
    workCategory: 'glazurnictwo',
    materials: [],
    roomTypes: ['lazienka', 'kuchnia']
  },
  {
    id: 'W16',
    name: 'Układanie gresu wielkoformatowego',
    unit: 'm2',
    laborPrice: 120,
    workCategory: 'glazurnictwo',
    materials: [
      { itemTemplateId: 'M45', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M8', quantityPerUnit: 6 },
      { itemTemplateId: 'M9', quantityPerUnit: 0.3 },
    ],
    roomTypes: ['lazienka', 'kuchnia', 'salon', 'korytarz']
  },
  {
    id: 'W17',
    name: 'Układanie mozaiki',
    unit: 'm2',
    laborPrice: 150,
    workCategory: 'glazurnictwo',
    materials: [
      { itemTemplateId: 'M46', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M8', quantityPerUnit: 4 },
      { itemTemplateId: 'M48', quantityPerUnit: 0.5 },
    ],
    roomTypes: ['lazienka', 'kuchnia']
  },
  
  // ========== PODŁOGI ==========
  {
    id: 'W5',
    name: 'Montaż paneli podłogowych',
    unit: 'm2',
    laborPrice: 35,
    workCategory: 'podlogi',
    materials: [
      { itemTemplateId: 'M11', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M13', quantityPerUnit: 1 },
    ],
    roomTypes: ['salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W7',
    name: 'Montaż listew przypodłogowych',
    unit: 'mb',
    laborPrice: 18,
    workCategory: 'podlogi',
    materials: [
      { itemTemplateId: 'M15', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W18',
    name: 'Montaż paneli winylowych LVT',
    unit: 'm2',
    laborPrice: 45,
    workCategory: 'podlogi',
    materials: [
      { itemTemplateId: 'M49', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M13', quantityPerUnit: 1 },
    ],
    roomTypes: ['salon', 'sypialnia', 'korytarz', 'kuchnia', 'lazienka']
  },
  {
    id: 'W19',
    name: 'Montaż parkietu dębowego',
    unit: 'm2',
    laborPrice: 75,
    workCategory: 'podlogi',
    materials: [
      { itemTemplateId: 'M50', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M53', quantityPerUnit: 1 },
    ],
    roomTypes: ['salon', 'sypialnia']
  },
  {
    id: 'W20',
    name: 'Cyklinowanie i lakierowanie parkietu',
    unit: 'm2',
    laborPrice: 80,
    workCategory: 'podlogi',
    materials: [
      { itemTemplateId: 'M51', quantityPerUnit: 0.15 },
    ],
    roomTypes: ['salon', 'sypialnia', 'korytarz']
  },
  {
    id: 'W21',
    name: 'Wylewka samopoziomująca',
    unit: 'm2',
    laborPrice: 55,
    workCategory: 'podlogi',
    materials: [
      { itemTemplateId: 'M36', quantityPerUnit: 15 },
    ],
    roomTypes: ['lazienka', 'kuchnia', 'salon', 'sypialnia', 'korytarz', 'inne']
  },
  
  // ========== HYDRAULIKA ==========
  {
    id: 'W8',
    name: 'Hydroizolacja łazienki',
    unit: 'm2',
    laborPrice: 45,
    workCategory: 'hydraulika',
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
    workCategory: 'hydraulika',
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
    workCategory: 'hydraulika',
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
    workCategory: 'hydraulika',
    materials: [
      { itemTemplateId: 'M30', quantityPerUnit: 1 },
      { itemTemplateId: 'M31', quantityPerUnit: 1 },
      { itemTemplateId: 'M34', quantityPerUnit: 1 },
      { itemTemplateId: 'M37', quantityPerUnit: 2 },
    ],
    roomTypes: ['lazienka']
  },
  {
    id: 'W22',
    name: 'Montaż wanny z obudową',
    unit: 'szt',
    laborPrice: 550,
    workCategory: 'hydraulika',
    materials: [
      { itemTemplateId: 'M29', quantityPerUnit: 1 },
      { itemTemplateId: 'M33', quantityPerUnit: 1 },
      { itemTemplateId: 'M37', quantityPerUnit: 2 },
    ],
    roomTypes: ['lazienka']
  },
  {
    id: 'W23',
    name: 'Montaż WC kompakt',
    unit: 'szt',
    laborPrice: 300,
    workCategory: 'hydraulika',
    materials: [
      { itemTemplateId: 'M23', quantityPerUnit: 1 },
      { itemTemplateId: 'M37', quantityPerUnit: 1 },
    ],
    roomTypes: ['lazienka']
  },
  {
    id: 'W24',
    name: 'Montaż zlewozmywaka kuchennego',
    unit: 'szt',
    laborPrice: 250,
    workCategory: 'hydraulika',
    materials: [
      { itemTemplateId: 'M66', quantityPerUnit: 1 },
      { itemTemplateId: 'M68', quantityPerUnit: 1 },
    ],
    roomTypes: ['kuchnia']
  },
  {
    id: 'W25',
    name: 'Montaż grzejnika łazienkowego',
    unit: 'szt',
    laborPrice: 280,
    workCategory: 'hydraulika',
    materials: [
      { itemTemplateId: 'M39', quantityPerUnit: 1 },
    ],
    roomTypes: ['lazienka']
  },
  
  // ========== ELEKTRYKA ==========
  {
    id: 'W26',
    name: 'Montaż punktu elektrycznego',
    unit: 'szt',
    laborPrice: 90,
    workCategory: 'elektryka',
    materials: [
      { itemTemplateId: 'M19', quantityPerUnit: 1 },
      { itemTemplateId: 'M61', quantityPerUnit: 3 },
    ],
    roomTypes: ['lazienka', 'kuchnia', 'salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W27',
    name: 'Montaż oświetlenia LED sufitowego',
    unit: 'szt',
    laborPrice: 120,
    workCategory: 'elektryka',
    materials: [
      { itemTemplateId: 'M22', quantityPerUnit: 1 },
      { itemTemplateId: 'M61', quantityPerUnit: 2 },
    ],
    roomTypes: ['lazienka', 'kuchnia', 'salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W28',
    name: 'Montaż wentylatora łazienkowego',
    unit: 'szt',
    laborPrice: 150,
    workCategory: 'elektryka',
    materials: [
      { itemTemplateId: 'M40', quantityPerUnit: 1 },
      { itemTemplateId: 'M61', quantityPerUnit: 5 },
    ],
    roomTypes: ['lazienka', 'kuchnia']
  },
  {
    id: 'W29',
    name: 'Instalacja oświetlenia LED pod szafkami',
    unit: 'mb',
    laborPrice: 45,
    workCategory: 'elektryka',
    materials: [
      { itemTemplateId: 'M65', quantityPerUnit: 1 },
    ],
    roomTypes: ['kuchnia']
  },
  
  // ========== SUCHE ZABUDOWY ==========
  {
    id: 'W30',
    name: 'Zabudowa ściany z płyt G-K',
    unit: 'm2',
    laborPrice: 75,
    workCategory: 'suche_zabudowy',
    materials: [
      { itemTemplateId: 'M71', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M73', quantityPerUnit: 3 },
      { itemTemplateId: 'M74', quantityPerUnit: 1 },
    ],
    roomTypes: ['salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W31',
    name: 'Zabudowa sufitu z płyt G-K',
    unit: 'm2',
    laborPrice: 85,
    workCategory: 'suche_zabudowy',
    materials: [
      { itemTemplateId: 'M71', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M73', quantityPerUnit: 4 },
      { itemTemplateId: 'M74', quantityPerUnit: 2 },
    ],
    roomTypes: ['lazienka', 'kuchnia', 'salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W32',
    name: 'Zabudowa stelaża WC',
    unit: 'szt',
    laborPrice: 350,
    workCategory: 'suche_zabudowy',
    materials: [
      { itemTemplateId: 'M72', quantityPerUnit: 2 },
      { itemTemplateId: 'M73', quantityPerUnit: 6 },
    ],
    roomTypes: ['lazienka']
  },
  
  // ========== MONTAŻ ==========
  {
    id: 'W33',
    name: 'Montaż drzwi wewnętrznych',
    unit: 'szt',
    laborPrice: 280,
    workCategory: 'montaz',
    materials: [
      { itemTemplateId: 'M17', quantityPerUnit: 1 },
      { itemTemplateId: 'M55', quantityPerUnit: 1 },
      { itemTemplateId: 'M56', quantityPerUnit: 1 },
    ],
    roomTypes: ['lazienka', 'kuchnia', 'salon', 'sypialnia', 'korytarz', 'inne']
  },
  {
    id: 'W34',
    name: 'Montaż drzwi przesuwnych',
    unit: 'szt',
    laborPrice: 450,
    workCategory: 'montaz',
    materials: [
      { itemTemplateId: 'M54', quantityPerUnit: 1 },
    ],
    roomTypes: ['salon', 'sypialnia', 'korytarz']
  },
  {
    id: 'W35',
    name: 'Montaż parapetu wewnętrznego',
    unit: 'mb',
    laborPrice: 80,
    workCategory: 'montaz',
    materials: [
      { itemTemplateId: 'M57', quantityPerUnit: 1 },
    ],
    roomTypes: ['salon', 'sypialnia', 'kuchnia', 'inne']
  },
  {
    id: 'W36',
    name: 'Montaż lustra łazienkowego',
    unit: 'szt',
    laborPrice: 120,
    workCategory: 'montaz',
    materials: [
      { itemTemplateId: 'M38', quantityPerUnit: 1 },
    ],
    roomTypes: ['lazienka']
  },
  
  // ========== DEKARSTWO - DACHY PŁASKIE ==========
  {
    id: 'W40',
    name: 'Pokrycie dachu płaskiego papą',
    unit: 'm2',
    laborPrice: 45,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M101', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M100', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['dach_plaski']
  },
  {
    id: 'W41',
    name: 'Pokrycie dachu płaskiego membraną PVC',
    unit: 'm2',
    laborPrice: 55,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M102', quantityPerUnit: 1.15 },
    ],
    roomTypes: ['dach_plaski']
  },
  {
    id: 'W42',
    name: 'Ocieplenie dachu płaskiego 10cm',
    unit: 'm2',
    laborPrice: 65,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M104', quantityPerUnit: 1.05 },
      { itemTemplateId: 'M106', quantityPerUnit: 3 },
    ],
    roomTypes: ['dach_plaski']
  },
  {
    id: 'W43',
    name: 'Ocieplenie dachu płaskiego 15cm',
    unit: 'm2',
    laborPrice: 70,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M105', quantityPerUnit: 1.05 },
      { itemTemplateId: 'M106', quantityPerUnit: 4 },
    ],
    roomTypes: ['dach_plaski']
  },
  {
    id: 'W44',
    name: 'Zerwanie starej papy i pokrycie nową',
    unit: 'm2',
    laborPrice: 70,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M101', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M100', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['dach_plaski']
  },
  {
    id: 'W45',
    name: 'Obróbka attyki',
    unit: 'mb',
    laborPrice: 85,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M108', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['dach_plaski']
  },
  {
    id: 'W46',
    name: 'Montaż wpustu dachowego',
    unit: 'szt',
    laborPrice: 250,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M107', quantityPerUnit: 1 },
    ],
    roomTypes: ['dach_plaski']
  },
  
  // ========== DEKARSTWO - DACHY SKOŚNE ==========
  {
    id: 'W50',
    name: 'Pokrycie dachu dachówką ceramiczną',
    unit: 'm2',
    laborPrice: 75,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M110', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W51',
    name: 'Pokrycie dachu dachówką betonową',
    unit: 'm2',
    laborPrice: 65,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M111', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W52',
    name: 'Pokrycie dachu blachodachówką',
    unit: 'm2',
    laborPrice: 45,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M112', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W53',
    name: 'Pokrycie dachu blachą na rąbek stojący',
    unit: 'm2',
    laborPrice: 95,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M114', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W54',
    name: 'Pokrycie dachu gontem bitumicznym',
    unit: 'm2',
    laborPrice: 55,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M115', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W55',
    name: 'Montaż łat i kontrłat',
    unit: 'm2',
    laborPrice: 35,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M116', quantityPerUnit: 4 },
      { itemTemplateId: 'M117', quantityPerUnit: 3 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W56',
    name: 'Montaż membrany dachowej',
    unit: 'm2',
    laborPrice: 15,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M119', quantityPerUnit: 1.15 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W57',
    name: 'Ocieplenie dachu skośnego wełną 15cm',
    unit: 'm2',
    laborPrice: 55,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M120', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W58',
    name: 'Ocieplenie dachu skośnego wełną 20cm',
    unit: 'm2',
    laborPrice: 60,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M121', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W59',
    name: 'Montaż okna dachowego 78x118',
    unit: 'szt',
    laborPrice: 450,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M122', quantityPerUnit: 1 },
      { itemTemplateId: 'M124', quantityPerUnit: 1 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W60',
    name: 'Montaż okna dachowego 55x78',
    unit: 'szt',
    laborPrice: 400,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M123', quantityPerUnit: 1 },
      { itemTemplateId: 'M124', quantityPerUnit: 1 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W61',
    name: 'Montaż rynien PVC z rurą spustową',
    unit: 'mb',
    laborPrice: 55,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M126', quantityPerUnit: 1.05 },
      { itemTemplateId: 'M130', quantityPerUnit: 1.5 },
    ],
    roomTypes: ['dach_skosny', 'dach_plaski']
  },
  {
    id: 'W62',
    name: 'Montaż rynien stalowych z rurą spustową',
    unit: 'mb',
    laborPrice: 75,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M127', quantityPerUnit: 1.05 },
      { itemTemplateId: 'M131', quantityPerUnit: 1.5 },
    ],
    roomTypes: ['dach_skosny', 'dach_plaski']
  },
  {
    id: 'W63',
    name: 'Montaż podbitki PVC',
    unit: 'm2',
    laborPrice: 85,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M139', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W64',
    name: 'Montaż podbitki drewnianej',
    unit: 'm2',
    laborPrice: 95,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M140', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M141', quantityPerUnit: 0.15 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W65',
    name: 'Montaż ławy kominiarskiej',
    unit: 'szt',
    laborPrice: 280,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M136', quantityPerUnit: 1 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W66',
    name: 'Montaż płotków przeciwśniegowych',
    unit: 'mb',
    laborPrice: 95,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M138', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W67',
    name: 'Montaż kominków wentylacyjnych',
    unit: 'szt',
    laborPrice: 180,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M135', quantityPerUnit: 1 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W68',
    name: 'Demontaż starego pokrycia dachowego',
    unit: 'm2',
    laborPrice: 30,
    workCategory: 'dekarstwo',
    materials: [],
    roomTypes: ['dach_skosny', 'dach_plaski']
  },
  {
    id: 'W69',
    name: 'Kompletne pokrycie dachu - blachodachówka z membraną',
    unit: 'm2',
    laborPrice: 95,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M119', quantityPerUnit: 1.15 },
      { itemTemplateId: 'M116', quantityPerUnit: 4 },
      { itemTemplateId: 'M117', quantityPerUnit: 3 },
      { itemTemplateId: 'M112', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['dach_skosny']
  },
  {
    id: 'W70',
    name: 'Kompletne pokrycie dachu - dachówka ceramiczna',
    unit: 'm2',
    laborPrice: 125,
    workCategory: 'dekarstwo',
    materials: [
      { itemTemplateId: 'M119', quantityPerUnit: 1.15 },
      { itemTemplateId: 'M116', quantityPerUnit: 4 },
      { itemTemplateId: 'M117', quantityPerUnit: 3 },
      { itemTemplateId: 'M110', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['dach_skosny']
  },
];

// Default room renovation templates
export const DEFAULT_ROOM_RENOVATION_TEMPLATES: RoomRenovationTemplate[] = [
  // ========== ŁAZIENKA ==========
  {
    id: 'R1',
    name: 'Remont łazienki - kompleksowy',
    roomType: 'lazienka',
    description: 'Pełny remont łazienki z wymianą płytek i białego montażu',
    works: [
      { workTemplateId: 'W12', defaultQuantity: 25 },
      { workTemplateId: 'W8', defaultQuantity: 10 },
      { workTemplateId: 'W3', defaultQuantity: 5 },
      { workTemplateId: 'W4', defaultQuantity: 20 },
      { workTemplateId: 'W9', defaultQuantity: 1 },
      { workTemplateId: 'W10', defaultQuantity: 1 },
      { workTemplateId: 'W11', defaultQuantity: 1 },
    ]
  },
  {
    id: 'R2',
    name: 'Remont łazienki - odświeżenie',
    roomType: 'lazienka',
    description: 'Malowanie i drobne poprawki bez wymiany płytek',
    works: [
      { workTemplateId: 'W2', defaultQuantity: 5 },
      { workTemplateId: 'W15', defaultQuantity: 10 },
    ]
  },
  {
    id: 'R7',
    name: 'Remont łazienki - premium z wanną',
    roomType: 'lazienka',
    description: 'Luksusowy remont z wanną, gresem wielkoformatowym i oświetleniem LED',
    works: [
      { workTemplateId: 'W12', defaultQuantity: 30 },
      { workTemplateId: 'W8', defaultQuantity: 12 },
      { workTemplateId: 'W16', defaultQuantity: 6 },
      { workTemplateId: 'W16', defaultQuantity: 24 },
      { workTemplateId: 'W22', defaultQuantity: 1 },
      { workTemplateId: 'W10', defaultQuantity: 1 },
      { workTemplateId: 'W23', defaultQuantity: 1 },
      { workTemplateId: 'W25', defaultQuantity: 1 },
      { workTemplateId: 'W27', defaultQuantity: 4 },
      { workTemplateId: 'W28', defaultQuantity: 1 },
    ]
  },
  {
    id: 'R8',
    name: 'Remont łazienki - mała (do 4m²)',
    roomType: 'lazienka',
    description: 'Kompaktowa łazienka z prysznicem',
    works: [
      { workTemplateId: 'W12', defaultQuantity: 12 },
      { workTemplateId: 'W8', defaultQuantity: 4 },
      { workTemplateId: 'W3', defaultQuantity: 4 },
      { workTemplateId: 'W4', defaultQuantity: 8 },
      { workTemplateId: 'W23', defaultQuantity: 1 },
      { workTemplateId: 'W10', defaultQuantity: 1 },
      { workTemplateId: 'W11', defaultQuantity: 1 },
      { workTemplateId: 'W28', defaultQuantity: 1 },
    ]
  },
  
  // ========== SALON ==========
  {
    id: 'R3',
    name: 'Remont salonu - standard',
    roomType: 'salon',
    description: 'Gładzie, malowanie i panele podłogowe',
    works: [
      { workTemplateId: 'W6', defaultQuantity: 50 },
      { workTemplateId: 'W1', defaultQuantity: 50 },
      { workTemplateId: 'W2', defaultQuantity: 20 },
      { workTemplateId: 'W5', defaultQuantity: 20 },
      { workTemplateId: 'W7', defaultQuantity: 18 },
    ]
  },
  {
    id: 'R9',
    name: 'Remont salonu - premium z parkietem',
    roomType: 'salon',
    description: 'Elegancki salon z parkietem dębowym i sufitem podwieszanym',
    works: [
      { workTemplateId: 'W6', defaultQuantity: 60 },
      { workTemplateId: 'W31', defaultQuantity: 25 },
      { workTemplateId: 'W13', defaultQuantity: 60 },
      { workTemplateId: 'W2', defaultQuantity: 25 },
      { workTemplateId: 'W19', defaultQuantity: 25 },
      { workTemplateId: 'W7', defaultQuantity: 20 },
      { workTemplateId: 'W27', defaultQuantity: 6 },
    ]
  },
  {
    id: 'R10',
    name: 'Remont salonu - minimalistyczny',
    roomType: 'salon',
    description: 'Nowoczesny styl z panelami winylowymi LVT',
    works: [
      { workTemplateId: 'W6', defaultQuantity: 45 },
      { workTemplateId: 'W1', defaultQuantity: 45 },
      { workTemplateId: 'W2', defaultQuantity: 18 },
      { workTemplateId: 'W18', defaultQuantity: 18 },
      { workTemplateId: 'W7', defaultQuantity: 16 },
    ]
  },
  
  // ========== SYPIALNIA ==========
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
    id: 'R11',
    name: 'Remont sypialni - z tapetą',
    roomType: 'sypialnia',
    description: 'Elegancka sypialnia z tapetą na ścianie głównej',
    works: [
      { workTemplateId: 'W6', defaultQuantity: 35 },
      { workTemplateId: 'W14', defaultQuantity: 10 },
      { workTemplateId: 'W1', defaultQuantity: 25 },
      { workTemplateId: 'W2', defaultQuantity: 14 },
      { workTemplateId: 'W5', defaultQuantity: 14 },
      { workTemplateId: 'W7', defaultQuantity: 15 },
    ]
  },
  {
    id: 'R12',
    name: 'Remont sypialni - duża z garderobą',
    roomType: 'sypialnia',
    description: 'Duża sypialnia z zabudową ścian',
    works: [
      { workTemplateId: 'W30', defaultQuantity: 8 },
      { workTemplateId: 'W6', defaultQuantity: 50 },
      { workTemplateId: 'W1', defaultQuantity: 50 },
      { workTemplateId: 'W2', defaultQuantity: 20 },
      { workTemplateId: 'W19', defaultQuantity: 20 },
      { workTemplateId: 'W7', defaultQuantity: 18 },
      { workTemplateId: 'W27', defaultQuantity: 4 },
    ]
  },
  
  // ========== KUCHNIA ==========
  {
    id: 'R5',
    name: 'Remont kuchni - kompleksowy',
    roomType: 'kuchnia',
    description: 'Płytki, malowanie ścian i sufitu',
    works: [
      { workTemplateId: 'W12', defaultQuantity: 5 },
      { workTemplateId: 'W4', defaultQuantity: 5 },
      { workTemplateId: 'W6', defaultQuantity: 30 },
      { workTemplateId: 'W15', defaultQuantity: 25 },
      { workTemplateId: 'W2', defaultQuantity: 10 },
    ]
  },
  {
    id: 'R13',
    name: 'Remont kuchni - premium',
    roomType: 'kuchnia',
    description: 'Nowoczesna kuchnia z gresem wielkoformatowym',
    works: [
      { workTemplateId: 'W12', defaultQuantity: 8 },
      { workTemplateId: 'W16', defaultQuantity: 10 },
      { workTemplateId: 'W17', defaultQuantity: 3 },
      { workTemplateId: 'W6', defaultQuantity: 35 },
      { workTemplateId: 'W15', defaultQuantity: 30 },
      { workTemplateId: 'W2', defaultQuantity: 12 },
      { workTemplateId: 'W24', defaultQuantity: 1 },
      { workTemplateId: 'W29', defaultQuantity: 3 },
      { workTemplateId: 'W27', defaultQuantity: 4 },
    ]
  },
  {
    id: 'R14',
    name: 'Remont kuchni - odświeżenie',
    roomType: 'kuchnia',
    description: 'Malowanie i wymiana oświetlenia',
    works: [
      { workTemplateId: 'W6', defaultQuantity: 20 },
      { workTemplateId: 'W15', defaultQuantity: 20 },
      { workTemplateId: 'W2', defaultQuantity: 8 },
      { workTemplateId: 'W27', defaultQuantity: 3 },
    ]
  },
  
  // ========== KORYTARZ ==========
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
  {
    id: 'R15',
    name: 'Remont korytarza - z płytkami',
    roomType: 'korytarz',
    description: 'Wytrzymałe płytki na podłodze',
    works: [
      { workTemplateId: 'W6', defaultQuantity: 30 },
      { workTemplateId: 'W1', defaultQuantity: 30 },
      { workTemplateId: 'W2', defaultQuantity: 8 },
      { workTemplateId: 'W3', defaultQuantity: 8 },
      { workTemplateId: 'W33', defaultQuantity: 2 },
    ]
  },
  {
    id: 'R16',
    name: 'Remont przedpokoju - duży',
    roomType: 'korytarz',
    description: 'Duży przedpokój z szafą wnękową',
    works: [
      { workTemplateId: 'W30', defaultQuantity: 6 },
      { workTemplateId: 'W6', defaultQuantity: 35 },
      { workTemplateId: 'W1', defaultQuantity: 35 },
      { workTemplateId: 'W2', defaultQuantity: 10 },
      { workTemplateId: 'W18', defaultQuantity: 10 },
      { workTemplateId: 'W7', defaultQuantity: 14 },
      { workTemplateId: 'W27', defaultQuantity: 3 },
    ]
  },
  
  // ========== BALKON ==========
  {
    id: 'R17',
    name: 'Remont balkonu - standard',
    roomType: 'balkon',
    description: 'Malowanie i płytki na podłodze',
    works: [
      { workTemplateId: 'W1', defaultQuantity: 12 },
      { workTemplateId: 'W2', defaultQuantity: 4 },
      { workTemplateId: 'W3', defaultQuantity: 4 },
    ]
  },
  {
    id: 'R18',
    name: 'Remont tarasu - kompleksowy',
    roomType: 'balkon',
    description: 'Duży taras z gresem mrozoodpornym',
    works: [
      { workTemplateId: 'W8', defaultQuantity: 15 },
      { workTemplateId: 'W16', defaultQuantity: 15 },
      { workTemplateId: 'W1', defaultQuantity: 20 },
    ]
  },
  
  // ========== INNE ==========
  {
    id: 'R19',
    name: 'Remont pokoju - podstawowy',
    roomType: 'inne',
    description: 'Standardowy remont pokoju',
    works: [
      { workTemplateId: 'W6', defaultQuantity: 40 },
      { workTemplateId: 'W1', defaultQuantity: 40 },
      { workTemplateId: 'W2', defaultQuantity: 16 },
      { workTemplateId: 'W5', defaultQuantity: 16 },
      { workTemplateId: 'W7', defaultQuantity: 16 },
    ]
  },
  {
    id: 'R20',
    name: 'Remont biura/gabinetu',
    roomType: 'inne',
    description: 'Profesjonalne wykończenie z oświetleniem',
    works: [
      { workTemplateId: 'W6', defaultQuantity: 35 },
      { workTemplateId: 'W1', defaultQuantity: 35 },
      { workTemplateId: 'W2', defaultQuantity: 14 },
      { workTemplateId: 'W18', defaultQuantity: 14 },
      { workTemplateId: 'W7', defaultQuantity: 15 },
      { workTemplateId: 'W27', defaultQuantity: 4 },
      { workTemplateId: 'W26', defaultQuantity: 6 },
    ]
  },
  
  // ========== DACH PŁASKI ==========
  {
    id: 'R30',
    name: 'Remont dachu płaskiego - papa',
    roomType: 'dach_plaski',
    description: 'Wymiana pokrycia papowego na dachu płaskim',
    works: [
      { workTemplateId: 'W44', defaultQuantity: 100 },
      { workTemplateId: 'W45', defaultQuantity: 40 },
      { workTemplateId: 'W46', defaultQuantity: 2 },
    ]
  },
  {
    id: 'R31',
    name: 'Remont dachu płaskiego - membrana PVC',
    roomType: 'dach_plaski',
    description: 'Nowoczesne pokrycie membraną PVC',
    works: [
      { workTemplateId: 'W68', defaultQuantity: 100 },
      { workTemplateId: 'W41', defaultQuantity: 100 },
      { workTemplateId: 'W45', defaultQuantity: 40 },
      { workTemplateId: 'W46', defaultQuantity: 2 },
    ]
  },
  {
    id: 'R32',
    name: 'Dach płaski - kompleksowo z ociepleniem',
    roomType: 'dach_plaski',
    description: 'Nowy dach z ociepleniem i pokryciem',
    works: [
      { workTemplateId: 'W68', defaultQuantity: 120 },
      { workTemplateId: 'W43', defaultQuantity: 120 },
      { workTemplateId: 'W40', defaultQuantity: 120 },
      { workTemplateId: 'W45', defaultQuantity: 45 },
      { workTemplateId: 'W46', defaultQuantity: 3 },
      { workTemplateId: 'W61', defaultQuantity: 45 },
    ]
  },
  {
    id: 'R33',
    name: 'Naprawa dachu płaskiego',
    roomType: 'dach_plaski',
    description: 'Lokalne naprawy i uszczelnienia',
    works: [
      { workTemplateId: 'W40', defaultQuantity: 30 },
      { workTemplateId: 'W45', defaultQuantity: 10 },
    ]
  },
  
  // ========== DACH SKOŚNY ==========
  {
    id: 'R40',
    name: 'Pokrycie dachu - blachodachówka',
    roomType: 'dach_skosny',
    description: 'Nowe pokrycie z blachodachówki z membraną',
    works: [
      { workTemplateId: 'W56', defaultQuantity: 150 },
      { workTemplateId: 'W55', defaultQuantity: 150 },
      { workTemplateId: 'W52', defaultQuantity: 150 },
      { workTemplateId: 'W61', defaultQuantity: 35 },
      { workTemplateId: 'W63', defaultQuantity: 15 },
    ]
  },
  {
    id: 'R41',
    name: 'Pokrycie dachu - dachówka ceramiczna',
    roomType: 'dach_skosny',
    description: 'Tradycyjne pokrycie dachówką ceramiczną',
    works: [
      { workTemplateId: 'W56', defaultQuantity: 150 },
      { workTemplateId: 'W55', defaultQuantity: 150 },
      { workTemplateId: 'W50', defaultQuantity: 150 },
      { workTemplateId: 'W61', defaultQuantity: 35 },
      { workTemplateId: 'W63', defaultQuantity: 15 },
      { workTemplateId: 'W65', defaultQuantity: 1 },
    ]
  },
  {
    id: 'R42',
    name: 'Pokrycie dachu - dachówka betonowa',
    roomType: 'dach_skosny',
    description: 'Ekonomiczne pokrycie dachówką betonową',
    works: [
      { workTemplateId: 'W56', defaultQuantity: 150 },
      { workTemplateId: 'W55', defaultQuantity: 150 },
      { workTemplateId: 'W51', defaultQuantity: 150 },
      { workTemplateId: 'W61', defaultQuantity: 35 },
      { workTemplateId: 'W63', defaultQuantity: 15 },
    ]
  },
  {
    id: 'R43',
    name: 'Pokrycie dachu - blacha na rąbek',
    roomType: 'dach_skosny',
    description: 'Nowoczesne pokrycie blachą na rąbek stojący',
    works: [
      { workTemplateId: 'W56', defaultQuantity: 150 },
      { workTemplateId: 'W55', defaultQuantity: 150 },
      { workTemplateId: 'W53', defaultQuantity: 150 },
      { workTemplateId: 'W62', defaultQuantity: 35 },
      { workTemplateId: 'W64', defaultQuantity: 15 },
    ]
  },
  {
    id: 'R44',
    name: 'Wymiana pokrycia dachowego - kompleksowo',
    roomType: 'dach_skosny',
    description: 'Demontaż starego i montaż nowego pokrycia z blachodachówki',
    works: [
      { workTemplateId: 'W68', defaultQuantity: 150 },
      { workTemplateId: 'W69', defaultQuantity: 150 },
      { workTemplateId: 'W61', defaultQuantity: 35 },
      { workTemplateId: 'W63', defaultQuantity: 15 },
      { workTemplateId: 'W66', defaultQuantity: 12 },
      { workTemplateId: 'W67', defaultQuantity: 3 },
    ]
  },
  {
    id: 'R45',
    name: 'Dach z ociepleniem poddasza',
    roomType: 'dach_skosny',
    description: 'Kompletny dach z ociepleniem wełną mineralną',
    works: [
      { workTemplateId: 'W56', defaultQuantity: 140 },
      { workTemplateId: 'W55', defaultQuantity: 140 },
      { workTemplateId: 'W52', defaultQuantity: 140 },
      { workTemplateId: 'W58', defaultQuantity: 120 },
      { workTemplateId: 'W61', defaultQuantity: 30 },
      { workTemplateId: 'W63', defaultQuantity: 12 },
      { workTemplateId: 'W59', defaultQuantity: 4 },
    ]
  },
  {
    id: 'R46',
    name: 'Montaż okien dachowych',
    roomType: 'dach_skosny',
    description: 'Wymiana lub montaż nowych okien dachowych',
    works: [
      { workTemplateId: 'W59', defaultQuantity: 3 },
      { workTemplateId: 'W60', defaultQuantity: 2 },
    ]
  },
  {
    id: 'R47',
    name: 'Remont rynien i obróbek',
    roomType: 'dach_skosny',
    description: 'Wymiana systemu rynnowego',
    works: [
      { workTemplateId: 'W61', defaultQuantity: 40 },
      { workTemplateId: 'W63', defaultQuantity: 12 },
    ]
  },
  {
    id: 'R48',
    name: 'Mały dach - garaż/wiata',
    roomType: 'dach_skosny',
    description: 'Pokrycie małego dachu blachodachówką',
    works: [
      { workTemplateId: 'W69', defaultQuantity: 35 },
      { workTemplateId: 'W61', defaultQuantity: 15 },
    ]
  },
];


// Example estimate for demonstration
export const EXAMPLE_ESTIMATE: Estimate = {
  id: 'example-001',
  clientName: 'Jan Kowalski',
  clientAddress: 'ul. Przykładowa 15/3, 00-001 Warszawa',
  projectDescription: 'Remont mieszkania 65m² - łazienka, kuchnia, salon',
  notes: 'Materiały premium, termin realizacji 6 tygodni',
  rooms: [
    {
      id: 'room-1',
      name: 'Łazienka główna',
      roomType: 'lazienka',
      items: [
        { id: 'i1', templateId: 'W12', name: 'Skucie starych płytek', unit: 'm2', quantity: 22, pricePerUnit: 45, category: 'labor', workId: 'w1', workName: 'Skucie starych płytek' },
        { id: 'i2', templateId: 'W8', name: 'Hydroizolacja łazienki', unit: 'm2', quantity: 8, pricePerUnit: 45, category: 'labor', workId: 'w2', workName: 'Hydroizolacja łazienki' },
        { id: 'i3', templateId: 'M35', name: 'Hydroizolacja płynna', unit: 'kg', quantity: 12, pricePerUnit: 25, category: 'material', workId: 'w2', workName: 'Hydroizolacja łazienki' },
        { id: 'i4', templateId: 'W3', name: 'Układanie płytek podłogowych', unit: 'm2', quantity: 5.5, pricePerUnit: 85, category: 'labor', workId: 'w3', workName: 'Układanie płytek podłogowych' },
        { id: 'i5', templateId: 'M6', name: 'Płytki gresowe', unit: 'm2', quantity: 6.1, pricePerUnit: 95, category: 'material', workId: 'w3', workName: 'Układanie płytek podłogowych' },
        { id: 'i6', templateId: 'M8', name: 'Klej do płytek elastyczny', unit: 'kg', quantity: 28, pricePerUnit: 4, category: 'material', workId: 'w3', workName: 'Układanie płytek podłogowych' },
        { id: 'i7', templateId: 'M9', name: 'Fuga szara', unit: 'kg', quantity: 3, pricePerUnit: 8, category: 'material', workId: 'w3', workName: 'Układanie płytek podłogowych' },
        { id: 'i8', templateId: 'W4', name: 'Układanie płytek ściennych', unit: 'm2', quantity: 18, pricePerUnit: 95, category: 'labor', workId: 'w4', workName: 'Układanie płytek ściennych' },
        { id: 'i9', templateId: 'M45', name: 'Płytki wielkoformatowe 60x120', unit: 'm2', quantity: 20, pricePerUnit: 150, category: 'material', workId: 'w4', workName: 'Układanie płytek ściennych' },
        { id: 'i10', templateId: 'M8', name: 'Klej do płytek elastyczny', unit: 'kg', quantity: 90, pricePerUnit: 4, category: 'material', workId: 'w4', workName: 'Układanie płytek ściennych' },
        { id: 'i11', templateId: 'M10', name: 'Fuga kolorowa', unit: 'kg', quantity: 9, pricePerUnit: 15, category: 'material', workId: 'w4', workName: 'Układanie płytek ściennych' },
        { id: 'i12', templateId: 'W9', name: 'Montaż WC podwieszanego', unit: 'szt', quantity: 1, pricePerUnit: 450, category: 'labor', workId: 'w5', workName: 'Montaż WC podwieszanego' },
        { id: 'i13', templateId: 'M24', name: 'WC podwieszane', unit: 'szt', quantity: 1, pricePerUnit: 1200, category: 'material', workId: 'w5', workName: 'Montaż WC podwieszanego' },
        { id: 'i14', templateId: 'M25', name: 'Stelaż podtynkowy WC', unit: 'szt', quantity: 1, pricePerUnit: 750, category: 'material', workId: 'w5', workName: 'Montaż WC podwieszanego' },
        { id: 'i15', templateId: 'W10', name: 'Montaż umywalki z szafką', unit: 'szt', quantity: 1, pricePerUnit: 350, category: 'labor', workId: 'w6', workName: 'Montaż umywalki z szafką' },
        { id: 'i16', templateId: 'M26', name: 'Umywalka nablatowa', unit: 'szt', quantity: 1, pricePerUnit: 350, category: 'material', workId: 'w6', workName: 'Montaż umywalki z szafką' },
        { id: 'i17', templateId: 'M28', name: 'Szafka pod umywalkę', unit: 'szt', quantity: 1, pricePerUnit: 550, category: 'material', workId: 'w6', workName: 'Montaż umywalki z szafką' },
        { id: 'i18', templateId: 'M32', name: 'Bateria umywalkowa', unit: 'szt', quantity: 1, pricePerUnit: 280, category: 'material', workId: 'w6', workName: 'Montaż umywalki z szafką' },
        { id: 'i19', templateId: 'W11', name: 'Montaż kabiny prysznicowej', unit: 'szt', quantity: 1, pricePerUnit: 650, category: 'labor', workId: 'w7', workName: 'Montaż kabiny prysznicowej' },
        { id: 'i20', templateId: 'M30', name: 'Kabina prysznicowa 90x90', unit: 'szt', quantity: 1, pricePerUnit: 1800, category: 'material', workId: 'w7', workName: 'Montaż kabiny prysznicowej' },
        { id: 'i21', templateId: 'M31', name: 'Brodzik prysznicowy', unit: 'szt', quantity: 1, pricePerUnit: 450, category: 'material', workId: 'w7', workName: 'Montaż kabiny prysznicowej' },
        { id: 'i22', templateId: 'M34', name: 'Bateria prysznicowa', unit: 'szt', quantity: 1, pricePerUnit: 380, category: 'material', workId: 'w7', workName: 'Montaż kabiny prysznicowej' },
        { id: 'i23', templateId: 'W27', name: 'Montaż oświetlenia LED sufitowego', unit: 'szt', quantity: 4, pricePerUnit: 120, category: 'labor', workId: 'w8', workName: 'Montaż oświetlenia LED sufitowego' },
        { id: 'i24', templateId: 'M22', name: 'Spot LED podtynkowy', unit: 'szt', quantity: 4, pricePerUnit: 45, category: 'material', workId: 'w8', workName: 'Montaż oświetlenia LED sufitowego' },
      ]
    },
    {
      id: 'room-2',
      name: 'Kuchnia',
      roomType: 'kuchnia',
      items: [
        { id: 'i25', templateId: 'W6', name: 'Gładź gipsowa ścian', unit: 'm2', quantity: 28, pricePerUnit: 35, category: 'labor', workId: 'w9', workName: 'Gładź gipsowa ścian' },
        { id: 'i26', templateId: 'M14', name: 'Gładź gipsowa', unit: 'kg', quantity: 42, pricePerUnit: 3.5, category: 'material', workId: 'w9', workName: 'Gładź gipsowa ścian' },
        { id: 'i27', templateId: 'W15', name: 'Malowanie łazienki (farba lateksowa)', unit: 'm2', quantity: 28, pricePerUnit: 30, category: 'labor', workId: 'w10', workName: 'Malowanie łazienki (farba lateksowa)' },
        { id: 'i28', templateId: 'M3', name: 'Grunt pod farbę', unit: 'l', quantity: 3, pricePerUnit: 25, category: 'material', workId: 'w10', workName: 'Malowanie łazienki (farba lateksowa)' },
        { id: 'i29', templateId: 'M44', name: 'Farba lateksowa (łazienka/kuchnia)', unit: 'l', quantity: 5, pricePerUnit: 65, category: 'material', workId: 'w10', workName: 'Malowanie łazienki (farba lateksowa)' },
        { id: 'i30', templateId: 'W2', name: 'Malowanie sufitu', unit: 'm2', quantity: 10, pricePerUnit: 30, category: 'labor', workId: 'w11', workName: 'Malowanie sufitu' },
        { id: 'i31', templateId: 'M1', name: 'Farba emulsyjna biała', unit: 'l', quantity: 2, pricePerUnit: 35, category: 'material', workId: 'w11', workName: 'Malowanie sufitu' },
        { id: 'i32', templateId: 'W17', name: 'Układanie mozaiki', unit: 'm2', quantity: 3, pricePerUnit: 150, category: 'labor', workId: 'w12', workName: 'Układanie mozaiki' },
        { id: 'i33', templateId: 'M46', name: 'Mozaika szklana', unit: 'm2', quantity: 3.3, pricePerUnit: 180, category: 'material', workId: 'w12', workName: 'Układanie mozaiki' },
        { id: 'i34', templateId: 'M8', name: 'Klej do płytek elastyczny', unit: 'kg', quantity: 12, pricePerUnit: 4, category: 'material', workId: 'w12', workName: 'Układanie mozaiki' },
        { id: 'i35', templateId: 'W24', name: 'Montaż zlewozmywaka kuchennego', unit: 'szt', quantity: 1, pricePerUnit: 250, category: 'labor', workId: 'w13', workName: 'Montaż zlewozmywaka kuchennego' },
        { id: 'i36', templateId: 'M66', name: 'Zlewozmywak granitowy', unit: 'szt', quantity: 1, pricePerUnit: 650, category: 'material', workId: 'w13', workName: 'Montaż zlewozmywaka kuchennego' },
        { id: 'i37', templateId: 'M68', name: 'Bateria kuchenna', unit: 'szt', quantity: 1, pricePerUnit: 350, category: 'material', workId: 'w13', workName: 'Montaż zlewozmywaka kuchennego' },
      ]
    },
    {
      id: 'room-3',
      name: 'Salon z aneksem',
      roomType: 'salon',
      items: [
        { id: 'i38', templateId: 'W6', name: 'Gładź gipsowa ścian', unit: 'm2', quantity: 55, pricePerUnit: 35, category: 'labor', workId: 'w14', workName: 'Gładź gipsowa ścian' },
        { id: 'i39', templateId: 'M14', name: 'Gładź gipsowa', unit: 'kg', quantity: 83, pricePerUnit: 3.5, category: 'material', workId: 'w14', workName: 'Gładź gipsowa ścian' },
        { id: 'i40', templateId: 'W1', name: 'Malowanie ścian', unit: 'm2', quantity: 55, pricePerUnit: 25, category: 'labor', workId: 'w15', workName: 'Malowanie ścian' },
        { id: 'i41', templateId: 'M1', name: 'Farba emulsyjna biała', unit: 'l', quantity: 9, pricePerUnit: 35, category: 'material', workId: 'w15', workName: 'Malowanie ścian' },
        { id: 'i42', templateId: 'M3', name: 'Grunt pod farbę', unit: 'l', quantity: 6, pricePerUnit: 25, category: 'material', workId: 'w15', workName: 'Malowanie ścian' },
        { id: 'i43', templateId: 'W2', name: 'Malowanie sufitu', unit: 'm2', quantity: 22, pricePerUnit: 30, category: 'labor', workId: 'w16', workName: 'Malowanie sufitu' },
        { id: 'i44', templateId: 'M1', name: 'Farba emulsyjna biała', unit: 'l', quantity: 4, pricePerUnit: 35, category: 'material', workId: 'w16', workName: 'Malowanie sufitu' },
        { id: 'i45', templateId: 'W18', name: 'Montaż paneli winylowych LVT', unit: 'm2', quantity: 22, pricePerUnit: 45, category: 'labor', workId: 'w17', workName: 'Montaż paneli winylowych LVT' },
        { id: 'i46', templateId: 'M49', name: 'Panele winylowe LVT', unit: 'm2', quantity: 24.2, pricePerUnit: 120, category: 'material', workId: 'w17', workName: 'Montaż paneli winylowych LVT' },
        { id: 'i47', templateId: 'M13', name: 'Podkład pod panele', unit: 'm2', quantity: 22, pricePerUnit: 8, category: 'material', workId: 'w17', workName: 'Montaż paneli winylowych LVT' },
        { id: 'i48', templateId: 'W7', name: 'Montaż listew przypodłogowych', unit: 'mb', quantity: 20, pricePerUnit: 18, category: 'labor', workId: 'w18', workName: 'Montaż listew przypodłogowych' },
        { id: 'i49', templateId: 'M16', name: 'Listwy przypodłogowe MDF', unit: 'mb', quantity: 21, pricePerUnit: 18, category: 'material', workId: 'w18', workName: 'Montaż listew przypodłogowych' },
        { id: 'i50', templateId: 'W27', name: 'Montaż oświetlenia LED sufitowego', unit: 'szt', quantity: 6, pricePerUnit: 120, category: 'labor', workId: 'w19', workName: 'Montaż oświetlenia LED sufitowego' },
        { id: 'i51', templateId: 'M22', name: 'Spot LED podtynkowy', unit: 'szt', quantity: 6, pricePerUnit: 45, category: 'material', workId: 'w19', workName: 'Montaż oświetlenia LED sufitowego' },
      ]
    }
  ],
  includeMaterials: true,
  laborDiscountPercent: 5,
  materialDiscountPercent: 0,
  createdAt: '2024-01-15T10:30:00.000Z',
  updatedAt: '2024-01-15T14:45:00.000Z'
};
