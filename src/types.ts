// Data types for the cost estimation application

export type UnitType = 'RUNNING_METER' | 'SQUARE_METER' | 'PIECE' | 'HOUR' | 'SET' | 'LITER' | 'KILOGRAM';

export type RoomType = 'BATHROOM' | 'KITCHEN' | 'LIVING_ROOM' | 'BEDROOM' | 'HALLWAY' | 'BALCONY' | 'FLAT_ROOF' | 'SLOPED_ROOF' | 'OTHER';

// Work categories for better organization
export type WorkCategory = 'ELECTRICAL' | 'PLUMBING' | 'TILING' | 'PAINTING' | 'FLOORING' | 'DRYWALL' | 'INSTALLATION' | 'DEMOLITION' | 'ROOFING' | 'OTHER';

export const WORK_CATEGORY_LABELS: Record<WorkCategory, string> = {
  ELECTRICAL: '⚡ Elektryka',
  PLUMBING: '🚰 Hydraulika',
  TILING: '🔲 Glazurnictwo',
  PAINTING: '🎨 Malarstwo',
  FLOORING: '🪵 Podłogi',
  DRYWALL: '📐 Suche zabudowy',
  INSTALLATION: '🔧 Montaż',
  DEMOLITION: '🔨 Demontaż',
  ROOFING: '🏠 Dekarstwo',
  OTHER: '📦 Inne'
};

export const ROOM_LABELS: Record<RoomType, string> = {
  BATHROOM: 'Łazienka',
  KITCHEN: 'Kuchnia',
  LIVING_ROOM: 'Salon',
  BEDROOM: 'Sypialnia',
  HALLWAY: 'Korytarz/Przedpokój',
  BALCONY: 'Balkon/Taras',
  FLAT_ROOF: 'Dach płaski',
  SLOPED_ROOF: 'Dach skośny',
  OTHER: 'Inne'
};

// Default room names matching room types
export const DEFAULT_ROOM_NAMES: Record<RoomType, string> = {
  BATHROOM: 'Łazienka',
  KITCHEN: 'Kuchnia',
  LIVING_ROOM: 'Salon',
  BEDROOM: 'Sypialnia',
  HALLWAY: 'Korytarz',
  BALCONY: 'Balkon',
  FLAT_ROOF: 'Dach płaski',
  SLOPED_ROOF: 'Dach skośny',
  OTHER: 'Pomieszczenie'
};

// Single item template (service/material)
export interface ItemTemplate {
  id: string;
  name: string;
  unit: UnitType;
  pricePerUnit: number;
  category: 'LABOR' | 'MATERIAL';
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
  category: 'LABOR' | 'MATERIAL';
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
  RUNNING_METER: 'mb',
  SQUARE_METER: 'm²',
  PIECE: 'szt.',
  HOUR: 'godz.',
  SET: 'kpl.',
  LITER: 'l',
  KILOGRAM: 'kg'
};

// Default item templates
export const DEFAULT_ITEM_TEMPLATES: ItemTemplate[] = [
  // ========== ELEKTRYKA (Labor) ==========
  { id: 'L10', name: 'Montaż gniazdek elektrycznych', unit: 'PIECE', pricePerUnit: 50, category: 'LABOR', workCategory: 'ELECTRICAL' },
  { id: 'L11', name: 'Instalacja oświetlenia', unit: 'PIECE', pricePerUnit: 90, category: 'LABOR', workCategory: 'ELECTRICAL' },
  { id: 'L26', name: 'Prowadzenie kabli elektrycznych', unit: 'RUNNING_METER', pricePerUnit: 25, category: 'LABOR', workCategory: 'ELECTRICAL' },
  { id: 'L27', name: 'Montaż rozdzielni elektrycznej', unit: 'PIECE', pricePerUnit: 450, category: 'LABOR', workCategory: 'ELECTRICAL' },
  { id: 'L28', name: 'Montaż włączników światła', unit: 'PIECE', pricePerUnit: 40, category: 'LABOR', workCategory: 'ELECTRICAL' },
  { id: 'L29', name: 'Montaż domofonu/wideodomofonu', unit: 'PIECE', pricePerUnit: 350, category: 'LABOR', workCategory: 'ELECTRICAL' },
  { id: 'L30', name: 'Instalacja TV/SAT', unit: 'PIECE', pricePerUnit: 150, category: 'LABOR', workCategory: 'ELECTRICAL' },
  { id: 'L31', name: 'Montaż wentylatora łazienkowego', unit: 'PIECE', pricePerUnit: 120, category: 'LABOR', workCategory: 'ELECTRICAL' },
  
  // ========== HYDRAULIKA (Labor) ==========
  { id: 'L12', name: 'Prace hydrauliczne', unit: 'HOUR', pricePerUnit: 130, category: 'LABOR', workCategory: 'PLUMBING' },
  { id: 'L13', name: 'Montaż WC', unit: 'PIECE', pricePerUnit: 350, category: 'LABOR', workCategory: 'PLUMBING' },
  { id: 'L14', name: 'Montaż umywalki', unit: 'PIECE', pricePerUnit: 250, category: 'LABOR', workCategory: 'PLUMBING' },
  { id: 'L15', name: 'Montaż wanny', unit: 'PIECE', pricePerUnit: 450, category: 'LABOR', workCategory: 'PLUMBING' },
  { id: 'L16', name: 'Montaż kabiny prysznicowej', unit: 'PIECE', pricePerUnit: 550, category: 'LABOR', workCategory: 'PLUMBING' },
  { id: 'L17', name: 'Montaż baterii', unit: 'PIECE', pricePerUnit: 120, category: 'LABOR', workCategory: 'PLUMBING' },
  { id: 'L24', name: 'Montaż zlewozmywaka', unit: 'PIECE', pricePerUnit: 200, category: 'LABOR', workCategory: 'PLUMBING' },
  { id: 'L32', name: 'Prowadzenie rur wodnych', unit: 'RUNNING_METER', pricePerUnit: 85, category: 'LABOR', workCategory: 'PLUMBING' },
  { id: 'L33', name: 'Prowadzenie rur kanalizacyjnych', unit: 'RUNNING_METER', pricePerUnit: 95, category: 'LABOR', workCategory: 'PLUMBING' },
  { id: 'L34', name: 'Montaż grzejnika', unit: 'PIECE', pricePerUnit: 280, category: 'LABOR', workCategory: 'PLUMBING' },
  { id: 'L35', name: 'Montaż podgrzewacza wody', unit: 'PIECE', pricePerUnit: 350, category: 'LABOR', workCategory: 'PLUMBING' },
  { id: 'L36', name: 'Montaż pralki/zmywarki', unit: 'PIECE', pricePerUnit: 150, category: 'LABOR', workCategory: 'PLUMBING' },
  
  // ========== GLAZURNICTWO (Labor) ==========
  { id: 'L3', name: 'Układanie płytek podłogowych', unit: 'SQUARE_METER', pricePerUnit: 85, category: 'LABOR', workCategory: 'TILING' },
  { id: 'L4', name: 'Układanie płytek ściennych', unit: 'SQUARE_METER', pricePerUnit: 95, category: 'LABOR', workCategory: 'TILING' },
  { id: 'L18', name: 'Skucie starych płytek', unit: 'SQUARE_METER', pricePerUnit: 45, category: 'LABOR', workCategory: 'TILING' },
  { id: 'L37', name: 'Układanie mozaiki', unit: 'SQUARE_METER', pricePerUnit: 150, category: 'LABOR', workCategory: 'TILING' },
  { id: 'L38', name: 'Układanie gresu wielkoformatowego', unit: 'SQUARE_METER', pricePerUnit: 120, category: 'LABOR', workCategory: 'TILING' },
  { id: 'L39', name: 'Fugowanie płytek', unit: 'SQUARE_METER', pricePerUnit: 25, category: 'LABOR', workCategory: 'TILING' },
  { id: 'L40', name: 'Impregnacja fug', unit: 'SQUARE_METER', pricePerUnit: 15, category: 'LABOR', workCategory: 'TILING' },
  
  // ========== MALARSTWO (Labor) ==========
  { id: 'L1', name: 'Malowanie ścian', unit: 'SQUARE_METER', pricePerUnit: 25, category: 'LABOR', workCategory: 'PAINTING' },
  { id: 'L2', name: 'Malowanie sufitu', unit: 'SQUARE_METER', pricePerUnit: 30, category: 'LABOR', workCategory: 'PAINTING' },
  { id: 'L6', name: 'Gładź gipsowa ścian', unit: 'SQUARE_METER', pricePerUnit: 35, category: 'LABOR', workCategory: 'PAINTING' },
  { id: 'L7', name: 'Gładź gipsowa sufitu', unit: 'SQUARE_METER', pricePerUnit: 40, category: 'LABOR', workCategory: 'PAINTING' },
  { id: 'L41', name: 'Gruntowanie ścian', unit: 'SQUARE_METER', pricePerUnit: 8, category: 'LABOR', workCategory: 'PAINTING' },
  { id: 'L42', name: 'Tapetowanie', unit: 'SQUARE_METER', pricePerUnit: 45, category: 'LABOR', workCategory: 'PAINTING' },
  { id: 'L43', name: 'Malowanie dekoracyjne (stiuk)', unit: 'SQUARE_METER', pricePerUnit: 85, category: 'LABOR', workCategory: 'PAINTING' },
  { id: 'L44', name: 'Nakładanie tynku dekoracyjnego', unit: 'SQUARE_METER', pricePerUnit: 65, category: 'LABOR', workCategory: 'PAINTING' },
  
  // ========== PODŁOGI (Labor) ==========
  { id: 'L5', name: 'Montaż paneli podłogowych', unit: 'SQUARE_METER', pricePerUnit: 35, category: 'LABOR', workCategory: 'FLOORING' },
  { id: 'L8', name: 'Montaż listew przypodłogowych', unit: 'RUNNING_METER', pricePerUnit: 18, category: 'LABOR', workCategory: 'FLOORING' },
  { id: 'L19', name: 'Demontaż starych paneli', unit: 'SQUARE_METER', pricePerUnit: 15, category: 'LABOR', workCategory: 'FLOORING' },
  { id: 'L20', name: 'Wyrównanie podłogi', unit: 'SQUARE_METER', pricePerUnit: 55, category: 'LABOR', workCategory: 'FLOORING' },
  { id: 'L21', name: 'Hydroizolacja', unit: 'SQUARE_METER', pricePerUnit: 45, category: 'LABOR', workCategory: 'FLOORING' },
  { id: 'L45', name: 'Montaż parkietu', unit: 'SQUARE_METER', pricePerUnit: 75, category: 'LABOR', workCategory: 'FLOORING' },
  { id: 'L46', name: 'Cyklinowanie parkietu', unit: 'SQUARE_METER', pricePerUnit: 45, category: 'LABOR', workCategory: 'FLOORING' },
  { id: 'L47', name: 'Lakierowanie parkietu', unit: 'SQUARE_METER', pricePerUnit: 35, category: 'LABOR', workCategory: 'FLOORING' },
  { id: 'L48', name: 'Montaż wykładziny PVC', unit: 'SQUARE_METER', pricePerUnit: 25, category: 'LABOR', workCategory: 'FLOORING' },
  { id: 'L49', name: 'Wylewka betonowa', unit: 'SQUARE_METER', pricePerUnit: 65, category: 'LABOR', workCategory: 'FLOORING' },
  
  // ========== SUCHE ZABUDOWY (Labor) ==========
  { id: 'L50', name: 'Zabudowa z płyt G-K (ściana)', unit: 'SQUARE_METER', pricePerUnit: 75, category: 'LABOR', workCategory: 'DRYWALL' },
  { id: 'L51', name: 'Zabudowa z płyt G-K (sufit)', unit: 'SQUARE_METER', pricePerUnit: 85, category: 'LABOR', workCategory: 'DRYWALL' },
  { id: 'L52', name: 'Sufit podwieszany kasetonowy', unit: 'SQUARE_METER', pricePerUnit: 95, category: 'LABOR', workCategory: 'DRYWALL' },
  { id: 'L53', name: 'Zabudowa instalacji (rury, piony)', unit: 'RUNNING_METER', pricePerUnit: 120, category: 'LABOR', workCategory: 'DRYWALL' },
  { id: 'L54', name: 'Ocieplenie ścian styropianem', unit: 'SQUARE_METER', pricePerUnit: 85, category: 'LABOR', workCategory: 'DRYWALL' },
  { id: 'L55', name: 'Ocieplenie ścian wełną mineralną', unit: 'SQUARE_METER', pricePerUnit: 75, category: 'LABOR', workCategory: 'DRYWALL' },
  
  // ========== MONTAŻ (Labor) ==========
  { id: 'L9', name: 'Montaż drzwi wewnętrznych', unit: 'PIECE', pricePerUnit: 280, category: 'LABOR', workCategory: 'INSTALLATION' },
  { id: 'L22', name: 'Montaż mebli kuchennych', unit: 'RUNNING_METER', pricePerUnit: 350, category: 'LABOR', workCategory: 'INSTALLATION' },
  { id: 'L23', name: 'Montaż blatu kuchennego', unit: 'RUNNING_METER', pricePerUnit: 180, category: 'LABOR', workCategory: 'INSTALLATION' },
  { id: 'L25', name: 'Montaż okapu', unit: 'PIECE', pricePerUnit: 250, category: 'LABOR', workCategory: 'INSTALLATION' },
  { id: 'L56', name: 'Montaż okien', unit: 'PIECE', pricePerUnit: 350, category: 'LABOR', workCategory: 'INSTALLATION' },
  { id: 'L57', name: 'Montaż parapetu wewnętrznego', unit: 'RUNNING_METER', pricePerUnit: 80, category: 'LABOR', workCategory: 'INSTALLATION' },
  { id: 'L58', name: 'Montaż rolet/żaluzji', unit: 'PIECE', pricePerUnit: 120, category: 'LABOR', workCategory: 'INSTALLATION' },
  { id: 'L59', name: 'Montaż karniszy', unit: 'PIECE', pricePerUnit: 80, category: 'LABOR', workCategory: 'INSTALLATION' },
  { id: 'L60', name: 'Montaż lustra', unit: 'PIECE', pricePerUnit: 100, category: 'LABOR', workCategory: 'INSTALLATION' },
  { id: 'L61', name: 'Montaż szafy wnękowej', unit: 'RUNNING_METER', pricePerUnit: 450, category: 'LABOR', workCategory: 'INSTALLATION' },
  
  // ========== DEMONTAŻ (Labor) ==========
  { id: 'L62', name: 'Demontaż ścian działowych', unit: 'SQUARE_METER', pricePerUnit: 55, category: 'LABOR', workCategory: 'DEMOLITION' },
  { id: 'L63', name: 'Demontaż okien', unit: 'PIECE', pricePerUnit: 150, category: 'LABOR', workCategory: 'DEMOLITION' },
  { id: 'L64', name: 'Demontaż drzwi', unit: 'PIECE', pricePerUnit: 80, category: 'LABOR', workCategory: 'DEMOLITION' },
  { id: 'L65', name: 'Demontaż mebli kuchennych', unit: 'RUNNING_METER', pricePerUnit: 100, category: 'LABOR', workCategory: 'DEMOLITION' },
  { id: 'L66', name: 'Demontaż armatury sanitarnej', unit: 'PIECE', pricePerUnit: 120, category: 'LABOR', workCategory: 'DEMOLITION' },
  { id: 'L67', name: 'Wywóz gruzu', unit: 'SQUARE_METER', pricePerUnit: 35, category: 'LABOR', workCategory: 'DEMOLITION' },
  { id: 'L68', name: 'Wywóz mebli/sprzętów', unit: 'PIECE', pricePerUnit: 80, category: 'LABOR', workCategory: 'DEMOLITION' },
  
  // ========== MATERIAŁY - MALARSTWO ==========
  { id: 'M1', name: 'Farba emulsyjna biała', unit: 'LITER', pricePerUnit: 35, category: 'MATERIAL', workCategory: 'PAINTING' },
  { id: 'M2', name: 'Farba emulsyjna kolorowa', unit: 'LITER', pricePerUnit: 55, category: 'MATERIAL', workCategory: 'PAINTING' },
  { id: 'M3', name: 'Grunt pod farbę', unit: 'LITER', pricePerUnit: 25, category: 'MATERIAL', workCategory: 'PAINTING' },
  { id: 'M14', name: 'Gładź gipsowa', unit: 'KILOGRAM', pricePerUnit: 3.5, category: 'MATERIAL', workCategory: 'PAINTING' },
  { id: 'M41', name: 'Tapeta winylowa', unit: 'SQUARE_METER', pricePerUnit: 45, category: 'MATERIAL', workCategory: 'PAINTING' },
  { id: 'M42', name: 'Klej do tapet', unit: 'KILOGRAM', pricePerUnit: 25, category: 'MATERIAL', workCategory: 'PAINTING' },
  { id: 'M43', name: 'Tynk dekoracyjny', unit: 'KILOGRAM', pricePerUnit: 15, category: 'MATERIAL', workCategory: 'PAINTING' },
  { id: 'M44', name: 'Farba lateksowa (łazienka/kuchnia)', unit: 'LITER', pricePerUnit: 65, category: 'MATERIAL', workCategory: 'PAINTING' },
  
  // ========== MATERIAŁY - GLAZURNICTWO ==========
  { id: 'M4', name: 'Płytki ceramiczne podłogowe', unit: 'SQUARE_METER', pricePerUnit: 75, category: 'MATERIAL', workCategory: 'TILING' },
  { id: 'M5', name: 'Płytki ceramiczne ścienne', unit: 'SQUARE_METER', pricePerUnit: 65, category: 'MATERIAL', workCategory: 'TILING' },
  { id: 'M6', name: 'Płytki gresowe', unit: 'SQUARE_METER', pricePerUnit: 95, category: 'MATERIAL', workCategory: 'TILING' },
  { id: 'M7', name: 'Klej do płytek standard', unit: 'KILOGRAM', pricePerUnit: 2.5, category: 'MATERIAL', workCategory: 'TILING' },
  { id: 'M8', name: 'Klej do płytek elastyczny', unit: 'KILOGRAM', pricePerUnit: 4, category: 'MATERIAL', workCategory: 'TILING' },
  { id: 'M9', name: 'Fuga szara', unit: 'KILOGRAM', pricePerUnit: 8, category: 'MATERIAL', workCategory: 'TILING' },
  { id: 'M10', name: 'Fuga kolorowa', unit: 'KILOGRAM', pricePerUnit: 15, category: 'MATERIAL', workCategory: 'TILING' },
  { id: 'M45', name: 'Płytki wielkoformatowe 60x120', unit: 'SQUARE_METER', pricePerUnit: 150, category: 'MATERIAL', workCategory: 'TILING' },
  { id: 'M46', name: 'Mozaika szklana', unit: 'SQUARE_METER', pricePerUnit: 180, category: 'MATERIAL', workCategory: 'TILING' },
  { id: 'M47', name: 'Profil wykończeniowy do płytek', unit: 'RUNNING_METER', pricePerUnit: 25, category: 'MATERIAL', workCategory: 'TILING' },
  { id: 'M48', name: 'Fuga epoksydowa', unit: 'KILOGRAM', pricePerUnit: 85, category: 'MATERIAL', workCategory: 'TILING' },
  
  // ========== MATERIAŁY - PODŁOGI ==========
  { id: 'M11', name: 'Panele podłogowe AC4', unit: 'SQUARE_METER', pricePerUnit: 55, category: 'MATERIAL', workCategory: 'FLOORING' },
  { id: 'M12', name: 'Panele podłogowe AC5', unit: 'SQUARE_METER', pricePerUnit: 85, category: 'MATERIAL', workCategory: 'FLOORING' },
  { id: 'M13', name: 'Podkład pod panele', unit: 'SQUARE_METER', pricePerUnit: 8, category: 'MATERIAL', workCategory: 'FLOORING' },
  { id: 'M15', name: 'Listwy przypodłogowe PVC', unit: 'RUNNING_METER', pricePerUnit: 12, category: 'MATERIAL', workCategory: 'FLOORING' },
  { id: 'M16', name: 'Listwy przypodłogowe MDF', unit: 'RUNNING_METER', pricePerUnit: 18, category: 'MATERIAL', workCategory: 'FLOORING' },
  { id: 'M36', name: 'Wylewka samopoziomująca', unit: 'KILOGRAM', pricePerUnit: 4, category: 'MATERIAL', workCategory: 'FLOORING' },
  { id: 'M49', name: 'Panele winylowe LVT', unit: 'SQUARE_METER', pricePerUnit: 120, category: 'MATERIAL', workCategory: 'FLOORING' },
  { id: 'M50', name: 'Parkiet dębowy', unit: 'SQUARE_METER', pricePerUnit: 180, category: 'MATERIAL', workCategory: 'FLOORING' },
  { id: 'M51', name: 'Lakier do parkietu', unit: 'LITER', pricePerUnit: 85, category: 'MATERIAL', workCategory: 'FLOORING' },
  { id: 'M52', name: 'Wykładzina PVC', unit: 'SQUARE_METER', pricePerUnit: 45, category: 'MATERIAL', workCategory: 'FLOORING' },
  { id: 'M53', name: 'Folia PE pod podłogę', unit: 'SQUARE_METER', pricePerUnit: 3, category: 'MATERIAL', workCategory: 'FLOORING' },
  
  // ========== MATERIAŁY - MONTAŻ ==========
  { id: 'M17', name: 'Drzwi wewnętrzne standard', unit: 'PIECE', pricePerUnit: 450, category: 'MATERIAL', workCategory: 'INSTALLATION' },
  { id: 'M18', name: 'Drzwi wewnętrzne premium', unit: 'PIECE', pricePerUnit: 850, category: 'MATERIAL', workCategory: 'INSTALLATION' },
  { id: 'M54', name: 'Drzwi przesuwne', unit: 'PIECE', pricePerUnit: 1200, category: 'MATERIAL', workCategory: 'INSTALLATION' },
  { id: 'M55', name: 'Ościeżnica regulowana', unit: 'PIECE', pricePerUnit: 280, category: 'MATERIAL', workCategory: 'INSTALLATION' },
  { id: 'M56', name: 'Klamka drzwiowa', unit: 'PIECE', pricePerUnit: 85, category: 'MATERIAL', workCategory: 'INSTALLATION' },
  { id: 'M57', name: 'Parapet wewnętrzny PVC', unit: 'RUNNING_METER', pricePerUnit: 65, category: 'MATERIAL', workCategory: 'INSTALLATION' },
  { id: 'M58', name: 'Parapet wewnętrzny drewniany', unit: 'RUNNING_METER', pricePerUnit: 120, category: 'MATERIAL', workCategory: 'INSTALLATION' },
  { id: 'M59', name: 'Roleta materiałowa', unit: 'PIECE', pricePerUnit: 180, category: 'MATERIAL', workCategory: 'INSTALLATION' },
  { id: 'M60', name: 'Roleta zewnętrzna', unit: 'PIECE', pricePerUnit: 450, category: 'MATERIAL', workCategory: 'INSTALLATION' },
  
  // ========== MATERIAŁY - ELEKTRYKA ==========
  { id: 'M19', name: 'Gniazdko elektryczne', unit: 'PIECE', pricePerUnit: 28, category: 'MATERIAL', workCategory: 'ELECTRICAL' },
  { id: 'M20', name: 'Włącznik światła', unit: 'PIECE', pricePerUnit: 25, category: 'MATERIAL', workCategory: 'ELECTRICAL' },
  { id: 'M21', name: 'Oprawa oświetleniowa LED', unit: 'PIECE', pricePerUnit: 150, category: 'MATERIAL', workCategory: 'ELECTRICAL' },
  { id: 'M22', name: 'Spot LED podtynkowy', unit: 'PIECE', pricePerUnit: 45, category: 'MATERIAL', workCategory: 'ELECTRICAL' },
  { id: 'M61', name: 'Kabel elektryczny YDY 3x2.5', unit: 'RUNNING_METER', pricePerUnit: 8, category: 'MATERIAL', workCategory: 'ELECTRICAL' },
  { id: 'M62', name: 'Rozdzielnia elektryczna', unit: 'PIECE', pricePerUnit: 350, category: 'MATERIAL', workCategory: 'ELECTRICAL' },
  { id: 'M63', name: 'Bezpiecznik różnicowy', unit: 'PIECE', pricePerUnit: 120, category: 'MATERIAL', workCategory: 'ELECTRICAL' },
  { id: 'M64', name: 'Puszka elektryczna', unit: 'PIECE', pricePerUnit: 5, category: 'MATERIAL', workCategory: 'ELECTRICAL' },
  { id: 'M65', name: 'Taśma LED z zasilaczem', unit: 'RUNNING_METER', pricePerUnit: 35, category: 'MATERIAL', workCategory: 'ELECTRICAL' },
  { id: 'M40', name: 'Wentylator łazienkowy', unit: 'PIECE', pricePerUnit: 120, category: 'MATERIAL', workCategory: 'ELECTRICAL' },
  
  // ========== MATERIAŁY - HYDRAULIKA (biały montaż) ==========
  { id: 'M23', name: 'WC kompakt', unit: 'PIECE', pricePerUnit: 650, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M24', name: 'WC podwieszane', unit: 'PIECE', pricePerUnit: 1200, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M25', name: 'Stelaż podtynkowy WC', unit: 'PIECE', pricePerUnit: 750, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M26', name: 'Umywalka nablatowa', unit: 'PIECE', pricePerUnit: 350, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M27', name: 'Umywalka podblatowa', unit: 'PIECE', pricePerUnit: 280, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M28', name: 'Szafka pod umywalkę', unit: 'PIECE', pricePerUnit: 550, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M29', name: 'Wanna akrylowa 170cm', unit: 'PIECE', pricePerUnit: 850, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M30', name: 'Kabina prysznicowa 90x90', unit: 'PIECE', pricePerUnit: 1800, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M31', name: 'Brodzik prysznicowy', unit: 'PIECE', pricePerUnit: 450, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M32', name: 'Bateria umywalkowa', unit: 'PIECE', pricePerUnit: 280, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M33', name: 'Bateria wannowa', unit: 'PIECE', pricePerUnit: 450, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M34', name: 'Bateria prysznicowa', unit: 'PIECE', pricePerUnit: 380, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M35', name: 'Hydroizolacja płynna', unit: 'KILOGRAM', pricePerUnit: 25, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M37', name: 'Silikon sanitarny', unit: 'PIECE', pricePerUnit: 25, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M38', name: 'Lustro łazienkowe 60x80', unit: 'PIECE', pricePerUnit: 250, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M39', name: 'Grzejnik łazienkowy', unit: 'PIECE', pricePerUnit: 450, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M66', name: 'Zlewozmywak granitowy', unit: 'PIECE', pricePerUnit: 650, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M67', name: 'Zlewozmywak stalowy', unit: 'PIECE', pricePerUnit: 280, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M68', name: 'Bateria kuchenna', unit: 'PIECE', pricePerUnit: 350, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M69', name: 'Odpływ liniowy prysznicowy', unit: 'PIECE', pricePerUnit: 450, category: 'MATERIAL', workCategory: 'PLUMBING' },
  { id: 'M70', name: 'Syfon umywalkowy', unit: 'PIECE', pricePerUnit: 45, category: 'MATERIAL', workCategory: 'PLUMBING' },
  
  // ========== MATERIAŁY - SUCHE ZABUDOWY ==========
  { id: 'M71', name: 'Płyta G-K standard 12.5mm', unit: 'SQUARE_METER', pricePerUnit: 25, category: 'MATERIAL', workCategory: 'DRYWALL' },
  { id: 'M72', name: 'Płyta G-K wodoodporna (zielona)', unit: 'SQUARE_METER', pricePerUnit: 35, category: 'MATERIAL', workCategory: 'DRYWALL' },
  { id: 'M73', name: 'Profil CD 60', unit: 'RUNNING_METER', pricePerUnit: 8, category: 'MATERIAL', workCategory: 'DRYWALL' },
  { id: 'M74', name: 'Profil UD 30', unit: 'RUNNING_METER', pricePerUnit: 6, category: 'MATERIAL', workCategory: 'DRYWALL' },
  { id: 'M75', name: 'Wełna mineralna 10cm', unit: 'SQUARE_METER', pricePerUnit: 35, category: 'MATERIAL', workCategory: 'DRYWALL' },
  { id: 'M76', name: 'Styropian EPS 100 10cm', unit: 'SQUARE_METER', pricePerUnit: 45, category: 'MATERIAL', workCategory: 'DRYWALL' },
  { id: 'M77', name: 'Wkręty do płyt G-K', unit: 'PIECE', pricePerUnit: 0.15, category: 'MATERIAL', workCategory: 'DRYWALL' },
  { id: 'M78', name: 'Taśma do płyt G-K', unit: 'RUNNING_METER', pricePerUnit: 1.5, category: 'MATERIAL', workCategory: 'DRYWALL' },
  
  // ========== DEKARSTWO (Labor) ==========
  // Dachy płaskie
  { id: 'L100', name: 'Układanie papy termozgrzewalnej', unit: 'SQUARE_METER', pricePerUnit: 45, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L101', name: 'Układanie membrany PVC/EPDM', unit: 'SQUARE_METER', pricePerUnit: 55, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L102', name: 'Naprawa dachu płaskiego', unit: 'SQUARE_METER', pricePerUnit: 35, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L103', name: 'Ocieplenie dachu płaskiego styropianem', unit: 'SQUARE_METER', pricePerUnit: 65, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L104', name: 'Wykonanie wylewki spadkowej', unit: 'SQUARE_METER', pricePerUnit: 75, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L105', name: 'Montaż obróbek blacharskich (attyka)', unit: 'RUNNING_METER', pricePerUnit: 85, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L106', name: 'Montaż wpustu dachowego', unit: 'PIECE', pricePerUnit: 250, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L107', name: 'Zerwanie starej papy', unit: 'SQUARE_METER', pricePerUnit: 25, category: 'LABOR', workCategory: 'ROOFING' },
  
  // Dachy skośne
  { id: 'L110', name: 'Montaż dachówki ceramicznej', unit: 'SQUARE_METER', pricePerUnit: 75, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L111', name: 'Montaż dachówki betonowej', unit: 'SQUARE_METER', pricePerUnit: 65, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L112', name: 'Montaż blachodachówki', unit: 'SQUARE_METER', pricePerUnit: 45, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L113', name: 'Montaż blachy na rąbek stojący', unit: 'SQUARE_METER', pricePerUnit: 95, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L114', name: 'Montaż gontu bitumicznego', unit: 'SQUARE_METER', pricePerUnit: 55, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L115', name: 'Montaż łat i kontrłat', unit: 'SQUARE_METER', pricePerUnit: 35, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L116', name: 'Montaż folii dachowej (membrana)', unit: 'SQUARE_METER', pricePerUnit: 15, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L117', name: 'Ocieplenie dachu skośnego wełną', unit: 'SQUARE_METER', pricePerUnit: 55, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L118', name: 'Montaż okna dachowego', unit: 'PIECE', pricePerUnit: 450, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L119', name: 'Montaż wyłazu dachowego', unit: 'PIECE', pricePerUnit: 350, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L120', name: 'Montaż rynien PVC', unit: 'RUNNING_METER', pricePerUnit: 45, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L121', name: 'Montaż rynien stalowych', unit: 'RUNNING_METER', pricePerUnit: 65, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L122', name: 'Montaż rur spustowych', unit: 'RUNNING_METER', pricePerUnit: 55, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L123', name: 'Montaż obróbek blacharskich', unit: 'RUNNING_METER', pricePerUnit: 75, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L124', name: 'Montaż kominka wentylacyjnego', unit: 'PIECE', pricePerUnit: 180, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L125', name: 'Wymiana więźby dachowej', unit: 'SQUARE_METER', pricePerUnit: 180, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L126', name: 'Impregnacja więźby dachowej', unit: 'SQUARE_METER', pricePerUnit: 25, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L127', name: 'Demontaż starego pokrycia', unit: 'SQUARE_METER', pricePerUnit: 30, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L128', name: 'Montaż podbitki dachowej PVC', unit: 'SQUARE_METER', pricePerUnit: 85, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L129', name: 'Montaż podbitki drewnianej', unit: 'SQUARE_METER', pricePerUnit: 95, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L130', name: 'Montaż ławy kominiarskiej', unit: 'PIECE', pricePerUnit: 280, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L131', name: 'Montaż stopni kominiarskich', unit: 'PIECE', pricePerUnit: 85, category: 'LABOR', workCategory: 'ROOFING' },
  { id: 'L132', name: 'Montaż płotków śniegowych', unit: 'RUNNING_METER', pricePerUnit: 95, category: 'LABOR', workCategory: 'ROOFING' },
  
  // ========== MATERIAŁY - DEKARSTWO ==========
  // Dachy płaskie
  { id: 'M100', name: 'Papa termozgrzewalna wierzchnia', unit: 'SQUARE_METER', pricePerUnit: 28, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M101', name: 'Papa termozgrzewalna podkładowa', unit: 'SQUARE_METER', pricePerUnit: 18, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M102', name: 'Membrana PVC dachowa', unit: 'SQUARE_METER', pricePerUnit: 45, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M103', name: 'Membrana EPDM', unit: 'SQUARE_METER', pricePerUnit: 55, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M104', name: 'Styropian dachowy EPS 100 10cm', unit: 'SQUARE_METER', pricePerUnit: 48, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M105', name: 'Styropian dachowy EPS 100 15cm', unit: 'SQUARE_METER', pricePerUnit: 72, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M106', name: 'Klej do styropianu', unit: 'KILOGRAM', pricePerUnit: 8, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M107', name: 'Wpust dachowy DN100', unit: 'PIECE', pricePerUnit: 180, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M108', name: 'Blacha attykowa', unit: 'RUNNING_METER', pricePerUnit: 65, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M109', name: 'Rozprawa asfaltowa (abizol)', unit: 'KILOGRAM', pricePerUnit: 12, category: 'MATERIAL', workCategory: 'ROOFING' },
  
  // Dachy skośne - pokrycia
  { id: 'M110', name: 'Dachówka ceramiczna', unit: 'SQUARE_METER', pricePerUnit: 85, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M111', name: 'Dachówka betonowa', unit: 'SQUARE_METER', pricePerUnit: 55, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M112', name: 'Blachodachówka modułowa', unit: 'SQUARE_METER', pricePerUnit: 48, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M113', name: 'Blachodachówka panelowa', unit: 'SQUARE_METER', pricePerUnit: 65, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M114', name: 'Blacha na rąbek stojący', unit: 'SQUARE_METER', pricePerUnit: 95, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M115', name: 'Gont bitumiczny', unit: 'SQUARE_METER', pricePerUnit: 45, category: 'MATERIAL', workCategory: 'ROOFING' },
  
  // Dachy skośne - konstrukcja i akcesoria
  { id: 'M116', name: 'Łata dachowa 4x5cm', unit: 'RUNNING_METER', pricePerUnit: 6, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M117', name: 'Kontrłata 2.5x5cm', unit: 'RUNNING_METER', pricePerUnit: 4, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M118', name: 'Folia dachowa paroprzepuszczalna', unit: 'SQUARE_METER', pricePerUnit: 8, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M119', name: 'Membrana dachowa wysokoparoprzepuszczalna', unit: 'SQUARE_METER', pricePerUnit: 15, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M120', name: 'Wełna mineralna dachowa 15cm', unit: 'SQUARE_METER', pricePerUnit: 55, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M121', name: 'Wełna mineralna dachowa 20cm', unit: 'SQUARE_METER', pricePerUnit: 75, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M122', name: 'Okno dachowe 78x118', unit: 'PIECE', pricePerUnit: 1200, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M123', name: 'Okno dachowe 55x78', unit: 'PIECE', pricePerUnit: 850, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M124', name: 'Kołnierz do okna dachowego', unit: 'PIECE', pricePerUnit: 280, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M125', name: 'Wyłaz dachowy', unit: 'PIECE', pricePerUnit: 650, category: 'MATERIAL', workCategory: 'ROOFING' },
  
  // Rynny i obróbki
  { id: 'M126', name: 'Rynna PVC 125mm', unit: 'RUNNING_METER', pricePerUnit: 28, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M127', name: 'Rynna stalowa ocynkowana 150mm', unit: 'RUNNING_METER', pricePerUnit: 55, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M128', name: 'Rura spustowa PVC 90mm', unit: 'RUNNING_METER', pricePerUnit: 25, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M129', name: 'Rura spustowa stalowa 100mm', unit: 'RUNNING_METER', pricePerUnit: 48, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M130', name: 'Hak rynnowy PVC', unit: 'PIECE', pricePerUnit: 8, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M131', name: 'Hak rynnowy stalowy', unit: 'PIECE', pricePerUnit: 15, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M132', name: 'Blacha obróbkowa powlekana', unit: 'SQUARE_METER', pricePerUnit: 65, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M133', name: 'Gąsior dachowy ceramiczny', unit: 'RUNNING_METER', pricePerUnit: 45, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M134', name: 'Gąsior dachowy betonowy', unit: 'RUNNING_METER', pricePerUnit: 35, category: 'MATERIAL', workCategory: 'ROOFING' },
  
  // Akcesoria bezpieczeństwa i wentylacja
  { id: 'M135', name: 'Kominek wentylacyjny', unit: 'PIECE', pricePerUnit: 120, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M136', name: 'Ława kominiarska', unit: 'PIECE', pricePerUnit: 350, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M137', name: 'Stopień kominiarski', unit: 'PIECE', pricePerUnit: 65, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M138', name: 'Płotek przeciwśniegowy', unit: 'RUNNING_METER', pricePerUnit: 85, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M139', name: 'Podbitka PVC', unit: 'SQUARE_METER', pricePerUnit: 55, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M140', name: 'Podbitka drewniana (deska)', unit: 'SQUARE_METER', pricePerUnit: 75, category: 'MATERIAL', workCategory: 'ROOFING' },
  { id: 'M141', name: 'Impregnat do drewna', unit: 'LITER', pricePerUnit: 35, category: 'MATERIAL', workCategory: 'ROOFING' },
];

// Default work templates (with materials)
export const DEFAULT_WORK_TEMPLATES: WorkTemplate[] = [
  // ========== MALARSTWO ==========
  {
    id: 'W1',
    name: 'Malowanie ścian',
    unit: 'SQUARE_METER',
    laborPrice: 25,
    workCategory: 'PAINTING',
    materials: [
      { itemTemplateId: 'M1', quantityPerUnit: 0.15 },
      { itemTemplateId: 'M3', quantityPerUnit: 0.1 },
    ],
    roomTypes: ['BATHROOM', 'KITCHEN', 'LIVING_ROOM', 'BEDROOM', 'HALLWAY', 'OTHER']
  },
  {
    id: 'W2',
    name: 'Malowanie sufitu',
    unit: 'SQUARE_METER',
    laborPrice: 30,
    workCategory: 'PAINTING',
    materials: [
      { itemTemplateId: 'M1', quantityPerUnit: 0.15 },
      { itemTemplateId: 'M3', quantityPerUnit: 0.1 },
    ],
    roomTypes: ['BATHROOM', 'KITCHEN', 'LIVING_ROOM', 'BEDROOM', 'HALLWAY', 'OTHER']
  },
  {
    id: 'W6',
    name: 'Gładź gipsowa ścian',
    unit: 'SQUARE_METER',
    laborPrice: 35,
    workCategory: 'PAINTING',
    materials: [
      { itemTemplateId: 'M14', quantityPerUnit: 1.5 },
    ],
    roomTypes: ['BATHROOM', 'KITCHEN', 'LIVING_ROOM', 'BEDROOM', 'HALLWAY', 'OTHER']
  },
  {
    id: 'W13',
    name: 'Gruntowanie i malowanie ścian',
    unit: 'SQUARE_METER',
    laborPrice: 33,
    workCategory: 'PAINTING',
    materials: [
      { itemTemplateId: 'M3', quantityPerUnit: 0.15 },
      { itemTemplateId: 'M1', quantityPerUnit: 0.2 },
    ],
    roomTypes: ['LIVING_ROOM', 'BEDROOM', 'HALLWAY', 'OTHER']
  },
  {
    id: 'W14',
    name: 'Tapetowanie ścian',
    unit: 'SQUARE_METER',
    laborPrice: 45,
    workCategory: 'PAINTING',
    materials: [
      { itemTemplateId: 'M41', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M42', quantityPerUnit: 0.2 },
    ],
    roomTypes: ['LIVING_ROOM', 'BEDROOM', 'HALLWAY']
  },
  {
    id: 'W15',
    name: 'Malowanie łazienki (farba lateksowa)',
    unit: 'SQUARE_METER',
    laborPrice: 30,
    workCategory: 'PAINTING',
    materials: [
      { itemTemplateId: 'M3', quantityPerUnit: 0.1 },
      { itemTemplateId: 'M44', quantityPerUnit: 0.15 },
    ],
    roomTypes: ['BATHROOM', 'KITCHEN']
  },
  
  // ========== GLAZURNICTWO ==========
  {
    id: 'W3',
    name: 'Układanie płytek podłogowych',
    unit: 'SQUARE_METER',
    laborPrice: 85,
    workCategory: 'TILING',
    materials: [
      { itemTemplateId: 'M4', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M7', quantityPerUnit: 5 },
      { itemTemplateId: 'M9', quantityPerUnit: 0.5 },
    ],
    roomTypes: ['BATHROOM', 'KITCHEN', 'HALLWAY']
  },
  {
    id: 'W4',
    name: 'Układanie płytek ściennych',
    unit: 'SQUARE_METER',
    laborPrice: 95,
    workCategory: 'TILING',
    materials: [
      { itemTemplateId: 'M5', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M8', quantityPerUnit: 5 },
      { itemTemplateId: 'M10', quantityPerUnit: 0.5 },
    ],
    roomTypes: ['BATHROOM', 'KITCHEN']
  },
  {
    id: 'W12',
    name: 'Skucie starych płytek',
    unit: 'SQUARE_METER',
    laborPrice: 45,
    workCategory: 'TILING',
    materials: [],
    roomTypes: ['BATHROOM', 'KITCHEN']
  },
  {
    id: 'W16',
    name: 'Układanie gresu wielkoformatowego',
    unit: 'SQUARE_METER',
    laborPrice: 120,
    workCategory: 'TILING',
    materials: [
      { itemTemplateId: 'M45', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M8', quantityPerUnit: 6 },
      { itemTemplateId: 'M9', quantityPerUnit: 0.3 },
    ],
    roomTypes: ['BATHROOM', 'KITCHEN', 'LIVING_ROOM', 'HALLWAY']
  },
  {
    id: 'W17',
    name: 'Układanie mozaiki',
    unit: 'SQUARE_METER',
    laborPrice: 150,
    workCategory: 'TILING',
    materials: [
      { itemTemplateId: 'M46', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M8', quantityPerUnit: 4 },
      { itemTemplateId: 'M48', quantityPerUnit: 0.5 },
    ],
    roomTypes: ['BATHROOM', 'KITCHEN']
  },
  
  // ========== PODŁOGI ==========
  {
    id: 'W5',
    name: 'Montaż paneli podłogowych',
    unit: 'SQUARE_METER',
    laborPrice: 35,
    workCategory: 'FLOORING',
    materials: [
      { itemTemplateId: 'M11', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M13', quantityPerUnit: 1 },
    ],
    roomTypes: ['LIVING_ROOM', 'BEDROOM', 'HALLWAY', 'OTHER']
  },
  {
    id: 'W7',
    name: 'Montaż listew przypodłogowych',
    unit: 'RUNNING_METER',
    laborPrice: 18,
    workCategory: 'FLOORING',
    materials: [
      { itemTemplateId: 'M15', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['LIVING_ROOM', 'BEDROOM', 'HALLWAY', 'OTHER']
  },
  {
    id: 'W18',
    name: 'Montaż paneli winylowych LVT',
    unit: 'SQUARE_METER',
    laborPrice: 45,
    workCategory: 'FLOORING',
    materials: [
      { itemTemplateId: 'M49', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M13', quantityPerUnit: 1 },
    ],
    roomTypes: ['LIVING_ROOM', 'BEDROOM', 'HALLWAY', 'KITCHEN', 'BATHROOM']
  },
  {
    id: 'W19',
    name: 'Montaż parkietu dębowego',
    unit: 'SQUARE_METER',
    laborPrice: 75,
    workCategory: 'FLOORING',
    materials: [
      { itemTemplateId: 'M50', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M53', quantityPerUnit: 1 },
    ],
    roomTypes: ['LIVING_ROOM', 'BEDROOM']
  },
  {
    id: 'W20',
    name: 'Cyklinowanie i lakierowanie parkietu',
    unit: 'SQUARE_METER',
    laborPrice: 80,
    workCategory: 'FLOORING',
    materials: [
      { itemTemplateId: 'M51', quantityPerUnit: 0.15 },
    ],
    roomTypes: ['LIVING_ROOM', 'BEDROOM', 'HALLWAY']
  },
  {
    id: 'W21',
    name: 'Wylewka samopoziomująca',
    unit: 'SQUARE_METER',
    laborPrice: 55,
    workCategory: 'FLOORING',
    materials: [
      { itemTemplateId: 'M36', quantityPerUnit: 15 },
    ],
    roomTypes: ['BATHROOM', 'KITCHEN', 'LIVING_ROOM', 'BEDROOM', 'HALLWAY', 'OTHER']
  },
  
  // ========== HYDRAULIKA ==========
  {
    id: 'W8',
    name: 'Hydroizolacja łazienki',
    unit: 'SQUARE_METER',
    laborPrice: 45,
    workCategory: 'PLUMBING',
    materials: [
      { itemTemplateId: 'M35', quantityPerUnit: 1.5 },
    ],
    roomTypes: ['BATHROOM']
  },
  {
    id: 'W9',
    name: 'Montaż WC podwieszanego',
    unit: 'PIECE',
    laborPrice: 450,
    workCategory: 'PLUMBING',
    materials: [
      { itemTemplateId: 'M24', quantityPerUnit: 1 },
      { itemTemplateId: 'M25', quantityPerUnit: 1 },
    ],
    roomTypes: ['BATHROOM']
  },
  {
    id: 'W10',
    name: 'Montaż umywalki z szafką',
    unit: 'PIECE',
    laborPrice: 350,
    workCategory: 'PLUMBING',
    materials: [
      { itemTemplateId: 'M26', quantityPerUnit: 1 },
      { itemTemplateId: 'M28', quantityPerUnit: 1 },
      { itemTemplateId: 'M32', quantityPerUnit: 1 },
    ],
    roomTypes: ['BATHROOM']
  },
  {
    id: 'W11',
    name: 'Montaż kabiny prysznicowej',
    unit: 'PIECE',
    laborPrice: 650,
    workCategory: 'PLUMBING',
    materials: [
      { itemTemplateId: 'M30', quantityPerUnit: 1 },
      { itemTemplateId: 'M31', quantityPerUnit: 1 },
      { itemTemplateId: 'M34', quantityPerUnit: 1 },
      { itemTemplateId: 'M37', quantityPerUnit: 2 },
    ],
    roomTypes: ['BATHROOM']
  },
  {
    id: 'W22',
    name: 'Montaż wanny z obudową',
    unit: 'PIECE',
    laborPrice: 550,
    workCategory: 'PLUMBING',
    materials: [
      { itemTemplateId: 'M29', quantityPerUnit: 1 },
      { itemTemplateId: 'M33', quantityPerUnit: 1 },
      { itemTemplateId: 'M37', quantityPerUnit: 2 },
    ],
    roomTypes: ['BATHROOM']
  },
  {
    id: 'W23',
    name: 'Montaż WC kompakt',
    unit: 'PIECE',
    laborPrice: 300,
    workCategory: 'PLUMBING',
    materials: [
      { itemTemplateId: 'M23', quantityPerUnit: 1 },
      { itemTemplateId: 'M37', quantityPerUnit: 1 },
    ],
    roomTypes: ['BATHROOM']
  },
  {
    id: 'W24',
    name: 'Montaż zlewozmywaka kuchennego',
    unit: 'PIECE',
    laborPrice: 250,
    workCategory: 'PLUMBING',
    materials: [
      { itemTemplateId: 'M66', quantityPerUnit: 1 },
      { itemTemplateId: 'M68', quantityPerUnit: 1 },
    ],
    roomTypes: ['KITCHEN']
  },
  {
    id: 'W25',
    name: 'Montaż grzejnika łazienkowego',
    unit: 'PIECE',
    laborPrice: 280,
    workCategory: 'PLUMBING',
    materials: [
      { itemTemplateId: 'M39', quantityPerUnit: 1 },
    ],
    roomTypes: ['BATHROOM']
  },
  
  // ========== ELEKTRYKA ==========
  {
    id: 'W26',
    name: 'Montaż punktu elektrycznego',
    unit: 'PIECE',
    laborPrice: 90,
    workCategory: 'ELECTRICAL',
    materials: [
      { itemTemplateId: 'M19', quantityPerUnit: 1 },
      { itemTemplateId: 'M61', quantityPerUnit: 3 },
    ],
    roomTypes: ['BATHROOM', 'KITCHEN', 'LIVING_ROOM', 'BEDROOM', 'HALLWAY', 'OTHER']
  },
  {
    id: 'W27',
    name: 'Montaż oświetlenia LED sufitowego',
    unit: 'PIECE',
    laborPrice: 120,
    workCategory: 'ELECTRICAL',
    materials: [
      { itemTemplateId: 'M22', quantityPerUnit: 1 },
      { itemTemplateId: 'M61', quantityPerUnit: 2 },
    ],
    roomTypes: ['BATHROOM', 'KITCHEN', 'LIVING_ROOM', 'BEDROOM', 'HALLWAY', 'OTHER']
  },
  {
    id: 'W28',
    name: 'Montaż wentylatora łazienkowego',
    unit: 'PIECE',
    laborPrice: 150,
    workCategory: 'ELECTRICAL',
    materials: [
      { itemTemplateId: 'M40', quantityPerUnit: 1 },
      { itemTemplateId: 'M61', quantityPerUnit: 5 },
    ],
    roomTypes: ['BATHROOM', 'KITCHEN']
  },
  {
    id: 'W29',
    name: 'Instalacja oświetlenia LED pod szafkami',
    unit: 'RUNNING_METER',
    laborPrice: 45,
    workCategory: 'ELECTRICAL',
    materials: [
      { itemTemplateId: 'M65', quantityPerUnit: 1 },
    ],
    roomTypes: ['KITCHEN']
  },
  
  // ========== SUCHE ZABUDOWY ==========
  {
    id: 'W30',
    name: 'Zabudowa ściany z płyt G-K',
    unit: 'SQUARE_METER',
    laborPrice: 75,
    workCategory: 'DRYWALL',
    materials: [
      { itemTemplateId: 'M71', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M73', quantityPerUnit: 3 },
      { itemTemplateId: 'M74', quantityPerUnit: 1 },
    ],
    roomTypes: ['LIVING_ROOM', 'BEDROOM', 'HALLWAY', 'OTHER']
  },
  {
    id: 'W31',
    name: 'Zabudowa sufitu z płyt G-K',
    unit: 'SQUARE_METER',
    laborPrice: 85,
    workCategory: 'DRYWALL',
    materials: [
      { itemTemplateId: 'M71', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M73', quantityPerUnit: 4 },
      { itemTemplateId: 'M74', quantityPerUnit: 2 },
    ],
    roomTypes: ['BATHROOM', 'KITCHEN', 'LIVING_ROOM', 'BEDROOM', 'HALLWAY', 'OTHER']
  },
  {
    id: 'W32',
    name: 'Zabudowa stelaża WC',
    unit: 'PIECE',
    laborPrice: 350,
    workCategory: 'DRYWALL',
    materials: [
      { itemTemplateId: 'M72', quantityPerUnit: 2 },
      { itemTemplateId: 'M73', quantityPerUnit: 6 },
    ],
    roomTypes: ['BATHROOM']
  },
  
  // ========== MONTAŻ ==========
  {
    id: 'W33',
    name: 'Montaż drzwi wewnętrznych',
    unit: 'PIECE',
    laborPrice: 280,
    workCategory: 'INSTALLATION',
    materials: [
      { itemTemplateId: 'M17', quantityPerUnit: 1 },
      { itemTemplateId: 'M55', quantityPerUnit: 1 },
      { itemTemplateId: 'M56', quantityPerUnit: 1 },
    ],
    roomTypes: ['BATHROOM', 'KITCHEN', 'LIVING_ROOM', 'BEDROOM', 'HALLWAY', 'OTHER']
  },
  {
    id: 'W34',
    name: 'Montaż drzwi przesuwnych',
    unit: 'PIECE',
    laborPrice: 450,
    workCategory: 'INSTALLATION',
    materials: [
      { itemTemplateId: 'M54', quantityPerUnit: 1 },
    ],
    roomTypes: ['LIVING_ROOM', 'BEDROOM', 'HALLWAY']
  },
  {
    id: 'W35',
    name: 'Montaż parapetu wewnętrznego',
    unit: 'RUNNING_METER',
    laborPrice: 80,
    workCategory: 'INSTALLATION',
    materials: [
      { itemTemplateId: 'M57', quantityPerUnit: 1 },
    ],
    roomTypes: ['LIVING_ROOM', 'BEDROOM', 'KITCHEN', 'OTHER']
  },
  {
    id: 'W36',
    name: 'Montaż lustra łazienkowego',
    unit: 'PIECE',
    laborPrice: 120,
    workCategory: 'INSTALLATION',
    materials: [
      { itemTemplateId: 'M38', quantityPerUnit: 1 },
    ],
    roomTypes: ['BATHROOM']
  },
  
  // ========== DEKARSTWO - DACHY PŁASKIE ==========
  {
    id: 'W40',
    name: 'Pokrycie dachu płaskiego papą',
    unit: 'SQUARE_METER',
    laborPrice: 45,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M101', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M100', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['FLAT_ROOF']
  },
  {
    id: 'W41',
    name: 'Pokrycie dachu płaskiego membraną PVC',
    unit: 'SQUARE_METER',
    laborPrice: 55,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M102', quantityPerUnit: 1.15 },
    ],
    roomTypes: ['FLAT_ROOF']
  },
  {
    id: 'W42',
    name: 'Ocieplenie dachu płaskiego 10cm',
    unit: 'SQUARE_METER',
    laborPrice: 65,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M104', quantityPerUnit: 1.05 },
      { itemTemplateId: 'M106', quantityPerUnit: 3 },
    ],
    roomTypes: ['FLAT_ROOF']
  },
  {
    id: 'W43',
    name: 'Ocieplenie dachu płaskiego 15cm',
    unit: 'SQUARE_METER',
    laborPrice: 70,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M105', quantityPerUnit: 1.05 },
      { itemTemplateId: 'M106', quantityPerUnit: 4 },
    ],
    roomTypes: ['FLAT_ROOF']
  },
  {
    id: 'W44',
    name: 'Zerwanie starej papy i pokrycie nową',
    unit: 'SQUARE_METER',
    laborPrice: 70,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M101', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M100', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['FLAT_ROOF']
  },
  {
    id: 'W45',
    name: 'Obróbka attyki',
    unit: 'RUNNING_METER',
    laborPrice: 85,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M108', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['FLAT_ROOF']
  },
  {
    id: 'W46',
    name: 'Montaż wpustu dachowego',
    unit: 'PIECE',
    laborPrice: 250,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M107', quantityPerUnit: 1 },
    ],
    roomTypes: ['FLAT_ROOF']
  },
  
  // ========== DEKARSTWO - DACHY SKOŚNE ==========
  {
    id: 'W50',
    name: 'Pokrycie dachu dachówką ceramiczną',
    unit: 'SQUARE_METER',
    laborPrice: 75,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M110', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W51',
    name: 'Pokrycie dachu dachówką betonową',
    unit: 'SQUARE_METER',
    laborPrice: 65,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M111', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W52',
    name: 'Pokrycie dachu blachodachówką',
    unit: 'SQUARE_METER',
    laborPrice: 45,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M112', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W53',
    name: 'Pokrycie dachu blachą na rąbek stojący',
    unit: 'SQUARE_METER',
    laborPrice: 95,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M114', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W54',
    name: 'Pokrycie dachu gontem bitumicznym',
    unit: 'SQUARE_METER',
    laborPrice: 55,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M115', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W55',
    name: 'Montaż łat i kontrłat',
    unit: 'SQUARE_METER',
    laborPrice: 35,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M116', quantityPerUnit: 4 },
      { itemTemplateId: 'M117', quantityPerUnit: 3 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W56',
    name: 'Montaż membrany dachowej',
    unit: 'SQUARE_METER',
    laborPrice: 15,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M119', quantityPerUnit: 1.15 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W57',
    name: 'Ocieplenie dachu skośnego wełną 15cm',
    unit: 'SQUARE_METER',
    laborPrice: 55,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M120', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W58',
    name: 'Ocieplenie dachu skośnego wełną 20cm',
    unit: 'SQUARE_METER',
    laborPrice: 60,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M121', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W59',
    name: 'Montaż okna dachowego 78x118',
    unit: 'PIECE',
    laborPrice: 450,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M122', quantityPerUnit: 1 },
      { itemTemplateId: 'M124', quantityPerUnit: 1 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W60',
    name: 'Montaż okna dachowego 55x78',
    unit: 'PIECE',
    laborPrice: 400,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M123', quantityPerUnit: 1 },
      { itemTemplateId: 'M124', quantityPerUnit: 1 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W61',
    name: 'Montaż rynien PVC z rurą spustową',
    unit: 'RUNNING_METER',
    laborPrice: 55,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M126', quantityPerUnit: 1.05 },
      { itemTemplateId: 'M130', quantityPerUnit: 1.5 },
    ],
    roomTypes: ['SLOPED_ROOF', 'FLAT_ROOF']
  },
  {
    id: 'W62',
    name: 'Montaż rynien stalowych z rurą spustową',
    unit: 'RUNNING_METER',
    laborPrice: 75,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M127', quantityPerUnit: 1.05 },
      { itemTemplateId: 'M131', quantityPerUnit: 1.5 },
    ],
    roomTypes: ['SLOPED_ROOF', 'FLAT_ROOF']
  },
  {
    id: 'W63',
    name: 'Montaż podbitki PVC',
    unit: 'SQUARE_METER',
    laborPrice: 85,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M139', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W64',
    name: 'Montaż podbitki drewnianej',
    unit: 'SQUARE_METER',
    laborPrice: 95,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M140', quantityPerUnit: 1.1 },
      { itemTemplateId: 'M141', quantityPerUnit: 0.15 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W65',
    name: 'Montaż ławy kominiarskiej',
    unit: 'PIECE',
    laborPrice: 280,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M136', quantityPerUnit: 1 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W66',
    name: 'Montaż płotków przeciwśniegowych',
    unit: 'RUNNING_METER',
    laborPrice: 95,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M138', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W67',
    name: 'Montaż kominków wentylacyjnych',
    unit: 'PIECE',
    laborPrice: 180,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M135', quantityPerUnit: 1 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W68',
    name: 'Demontaż starego pokrycia dachowego',
    unit: 'SQUARE_METER',
    laborPrice: 30,
    workCategory: 'ROOFING',
    materials: [],
    roomTypes: ['SLOPED_ROOF', 'FLAT_ROOF']
  },
  {
    id: 'W69',
    name: 'Kompletne pokrycie dachu - blachodachówka z membraną',
    unit: 'SQUARE_METER',
    laborPrice: 95,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M119', quantityPerUnit: 1.15 },
      { itemTemplateId: 'M116', quantityPerUnit: 4 },
      { itemTemplateId: 'M117', quantityPerUnit: 3 },
      { itemTemplateId: 'M112', quantityPerUnit: 1.1 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
  {
    id: 'W70',
    name: 'Kompletne pokrycie dachu - dachówka ceramiczna',
    unit: 'SQUARE_METER',
    laborPrice: 125,
    workCategory: 'ROOFING',
    materials: [
      { itemTemplateId: 'M119', quantityPerUnit: 1.15 },
      { itemTemplateId: 'M116', quantityPerUnit: 4 },
      { itemTemplateId: 'M117', quantityPerUnit: 3 },
      { itemTemplateId: 'M110', quantityPerUnit: 1.05 },
    ],
    roomTypes: ['SLOPED_ROOF']
  },
];

// Default room renovation templates
export const DEFAULT_ROOM_RENOVATION_TEMPLATES: RoomRenovationTemplate[] = [
  // ========== ŁAZIENKA ==========
  {
    id: 'R1',
    name: 'Remont łazienki - kompleksowy',
    roomType: 'BATHROOM',
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
    roomType: 'BATHROOM',
    description: 'Malowanie i drobne poprawki bez wymiany płytek',
    works: [
      { workTemplateId: 'W2', defaultQuantity: 5 },
      { workTemplateId: 'W15', defaultQuantity: 10 },
    ]
  },
  {
    id: 'R7',
    name: 'Remont łazienki - premium z wanną',
    roomType: 'BATHROOM',
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
    roomType: 'BATHROOM',
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
    roomType: 'LIVING_ROOM',
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
    roomType: 'LIVING_ROOM',
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
    roomType: 'LIVING_ROOM',
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
    roomType: 'BEDROOM',
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
    roomType: 'BEDROOM',
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
    roomType: 'BEDROOM',
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
    roomType: 'KITCHEN',
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
    roomType: 'KITCHEN',
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
    roomType: 'KITCHEN',
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
    roomType: 'HALLWAY',
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
    roomType: 'HALLWAY',
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
    roomType: 'HALLWAY',
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
    roomType: 'BALCONY',
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
    roomType: 'BALCONY',
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
    roomType: 'OTHER',
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
    roomType: 'OTHER',
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
    roomType: 'FLAT_ROOF',
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
    roomType: 'FLAT_ROOF',
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
    roomType: 'FLAT_ROOF',
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
    roomType: 'FLAT_ROOF',
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
    roomType: 'SLOPED_ROOF',
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
    roomType: 'SLOPED_ROOF',
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
    roomType: 'SLOPED_ROOF',
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
    roomType: 'SLOPED_ROOF',
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
    roomType: 'SLOPED_ROOF',
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
    roomType: 'SLOPED_ROOF',
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
    roomType: 'SLOPED_ROOF',
    description: 'Wymiana lub montaż nowych okien dachowych',
    works: [
      { workTemplateId: 'W59', defaultQuantity: 3 },
      { workTemplateId: 'W60', defaultQuantity: 2 },
    ]
  },
  {
    id: 'R47',
    name: 'Remont rynien i obróbek',
    roomType: 'SLOPED_ROOF',
    description: 'Wymiana systemu rynnowego',
    works: [
      { workTemplateId: 'W61', defaultQuantity: 40 },
      { workTemplateId: 'W63', defaultQuantity: 12 },
    ]
  },
  {
    id: 'R48',
    name: 'Mały dach - garaż/wiata',
    roomType: 'SLOPED_ROOF',
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
      roomType: 'BATHROOM',
      items: [
        { id: 'i1', templateId: 'W12', name: 'Skucie starych płytek', unit: 'SQUARE_METER', quantity: 22, pricePerUnit: 45, category: 'LABOR', workId: 'w1', workName: 'Skucie starych płytek' },
        { id: 'i2', templateId: 'W8', name: 'Hydroizolacja łazienki', unit: 'SQUARE_METER', quantity: 8, pricePerUnit: 45, category: 'LABOR', workId: 'w2', workName: 'Hydroizolacja łazienki' },
        { id: 'i3', templateId: 'M35', name: 'Hydroizolacja płynna', unit: 'KILOGRAM', quantity: 12, pricePerUnit: 25, category: 'MATERIAL', workId: 'w2', workName: 'Hydroizolacja łazienki' },
        { id: 'i4', templateId: 'W3', name: 'Układanie płytek podłogowych', unit: 'SQUARE_METER', quantity: 5.5, pricePerUnit: 85, category: 'LABOR', workId: 'w3', workName: 'Układanie płytek podłogowych' },
        { id: 'i5', templateId: 'M6', name: 'Płytki gresowe', unit: 'SQUARE_METER', quantity: 6.1, pricePerUnit: 95, category: 'MATERIAL', workId: 'w3', workName: 'Układanie płytek podłogowych' },
        { id: 'i6', templateId: 'M8', name: 'Klej do płytek elastyczny', unit: 'KILOGRAM', quantity: 28, pricePerUnit: 4, category: 'MATERIAL', workId: 'w3', workName: 'Układanie płytek podłogowych' },
        { id: 'i7', templateId: 'M9', name: 'Fuga szara', unit: 'KILOGRAM', quantity: 3, pricePerUnit: 8, category: 'MATERIAL', workId: 'w3', workName: 'Układanie płytek podłogowych' },
        { id: 'i8', templateId: 'W4', name: 'Układanie płytek ściennych', unit: 'SQUARE_METER', quantity: 18, pricePerUnit: 95, category: 'LABOR', workId: 'w4', workName: 'Układanie płytek ściennych' },
        { id: 'i9', templateId: 'M45', name: 'Płytki wielkoformatowe 60x120', unit: 'SQUARE_METER', quantity: 20, pricePerUnit: 150, category: 'MATERIAL', workId: 'w4', workName: 'Układanie płytek ściennych' },
        { id: 'i10', templateId: 'M8', name: 'Klej do płytek elastyczny', unit: 'KILOGRAM', quantity: 90, pricePerUnit: 4, category: 'MATERIAL', workId: 'w4', workName: 'Układanie płytek ściennych' },
        { id: 'i11', templateId: 'M10', name: 'Fuga kolorowa', unit: 'KILOGRAM', quantity: 9, pricePerUnit: 15, category: 'MATERIAL', workId: 'w4', workName: 'Układanie płytek ściennych' },
        { id: 'i12', templateId: 'W9', name: 'Montaż WC podwieszanego', unit: 'PIECE', quantity: 1, pricePerUnit: 450, category: 'LABOR', workId: 'w5', workName: 'Montaż WC podwieszanego' },
        { id: 'i13', templateId: 'M24', name: 'WC podwieszane', unit: 'PIECE', quantity: 1, pricePerUnit: 1200, category: 'MATERIAL', workId: 'w5', workName: 'Montaż WC podwieszanego' },
        { id: 'i14', templateId: 'M25', name: 'Stelaż podtynkowy WC', unit: 'PIECE', quantity: 1, pricePerUnit: 750, category: 'MATERIAL', workId: 'w5', workName: 'Montaż WC podwieszanego' },
        { id: 'i15', templateId: 'W10', name: 'Montaż umywalki z szafką', unit: 'PIECE', quantity: 1, pricePerUnit: 350, category: 'LABOR', workId: 'w6', workName: 'Montaż umywalki z szafką' },
        { id: 'i16', templateId: 'M26', name: 'Umywalka nablatowa', unit: 'PIECE', quantity: 1, pricePerUnit: 350, category: 'MATERIAL', workId: 'w6', workName: 'Montaż umywalki z szafką' },
        { id: 'i17', templateId: 'M28', name: 'Szafka pod umywalkę', unit: 'PIECE', quantity: 1, pricePerUnit: 550, category: 'MATERIAL', workId: 'w6', workName: 'Montaż umywalki z szafką' },
        { id: 'i18', templateId: 'M32', name: 'Bateria umywalkowa', unit: 'PIECE', quantity: 1, pricePerUnit: 280, category: 'MATERIAL', workId: 'w6', workName: 'Montaż umywalki z szafką' },
        { id: 'i19', templateId: 'W11', name: 'Montaż kabiny prysznicowej', unit: 'PIECE', quantity: 1, pricePerUnit: 650, category: 'LABOR', workId: 'w7', workName: 'Montaż kabiny prysznicowej' },
        { id: 'i20', templateId: 'M30', name: 'Kabina prysznicowa 90x90', unit: 'PIECE', quantity: 1, pricePerUnit: 1800, category: 'MATERIAL', workId: 'w7', workName: 'Montaż kabiny prysznicowej' },
        { id: 'i21', templateId: 'M31', name: 'Brodzik prysznicowy', unit: 'PIECE', quantity: 1, pricePerUnit: 450, category: 'MATERIAL', workId: 'w7', workName: 'Montaż kabiny prysznicowej' },
        { id: 'i22', templateId: 'M34', name: 'Bateria prysznicowa', unit: 'PIECE', quantity: 1, pricePerUnit: 380, category: 'MATERIAL', workId: 'w7', workName: 'Montaż kabiny prysznicowej' },
        { id: 'i23', templateId: 'W27', name: 'Montaż oświetlenia LED sufitowego', unit: 'PIECE', quantity: 4, pricePerUnit: 120, category: 'LABOR', workId: 'w8', workName: 'Montaż oświetlenia LED sufitowego' },
        { id: 'i24', templateId: 'M22', name: 'Spot LED podtynkowy', unit: 'PIECE', quantity: 4, pricePerUnit: 45, category: 'MATERIAL', workId: 'w8', workName: 'Montaż oświetlenia LED sufitowego' },
      ]
    },
    {
      id: 'room-2',
      name: 'Kuchnia',
      roomType: 'KITCHEN',
      items: [
        { id: 'i25', templateId: 'W6', name: 'Gładź gipsowa ścian', unit: 'SQUARE_METER', quantity: 28, pricePerUnit: 35, category: 'LABOR', workId: 'w9', workName: 'Gładź gipsowa ścian' },
        { id: 'i26', templateId: 'M14', name: 'Gładź gipsowa', unit: 'KILOGRAM', quantity: 42, pricePerUnit: 3.5, category: 'MATERIAL', workId: 'w9', workName: 'Gładź gipsowa ścian' },
        { id: 'i27', templateId: 'W15', name: 'Malowanie łazienki (farba lateksowa)', unit: 'SQUARE_METER', quantity: 28, pricePerUnit: 30, category: 'LABOR', workId: 'w10', workName: 'Malowanie łazienki (farba lateksowa)' },
        { id: 'i28', templateId: 'M3', name: 'Grunt pod farbę', unit: 'LITER', quantity: 3, pricePerUnit: 25, category: 'MATERIAL', workId: 'w10', workName: 'Malowanie łazienki (farba lateksowa)' },
        { id: 'i29', templateId: 'M44', name: 'Farba lateksowa (łazienka/kuchnia)', unit: 'LITER', quantity: 5, pricePerUnit: 65, category: 'MATERIAL', workId: 'w10', workName: 'Malowanie łazienki (farba lateksowa)' },
        { id: 'i30', templateId: 'W2', name: 'Malowanie sufitu', unit: 'SQUARE_METER', quantity: 10, pricePerUnit: 30, category: 'LABOR', workId: 'w11', workName: 'Malowanie sufitu' },
        { id: 'i31', templateId: 'M1', name: 'Farba emulsyjna biała', unit: 'LITER', quantity: 2, pricePerUnit: 35, category: 'MATERIAL', workId: 'w11', workName: 'Malowanie sufitu' },
        { id: 'i32', templateId: 'W17', name: 'Układanie mozaiki', unit: 'SQUARE_METER', quantity: 3, pricePerUnit: 150, category: 'LABOR', workId: 'w12', workName: 'Układanie mozaiki' },
        { id: 'i33', templateId: 'M46', name: 'Mozaika szklana', unit: 'SQUARE_METER', quantity: 3.3, pricePerUnit: 180, category: 'MATERIAL', workId: 'w12', workName: 'Układanie mozaiki' },
        { id: 'i34', templateId: 'M8', name: 'Klej do płytek elastyczny', unit: 'KILOGRAM', quantity: 12, pricePerUnit: 4, category: 'MATERIAL', workId: 'w12', workName: 'Układanie mozaiki' },
        { id: 'i35', templateId: 'W24', name: 'Montaż zlewozmywaka kuchennego', unit: 'PIECE', quantity: 1, pricePerUnit: 250, category: 'LABOR', workId: 'w13', workName: 'Montaż zlewozmywaka kuchennego' },
        { id: 'i36', templateId: 'M66', name: 'Zlewozmywak granitowy', unit: 'PIECE', quantity: 1, pricePerUnit: 650, category: 'MATERIAL', workId: 'w13', workName: 'Montaż zlewozmywaka kuchennego' },
        { id: 'i37', templateId: 'M68', name: 'Bateria kuchenna', unit: 'PIECE', quantity: 1, pricePerUnit: 350, category: 'MATERIAL', workId: 'w13', workName: 'Montaż zlewozmywaka kuchennego' },
      ]
    },
    {
      id: 'room-3',
      name: 'Salon z aneksem',
      roomType: 'LIVING_ROOM',
      items: [
        { id: 'i38', templateId: 'W6', name: 'Gładź gipsowa ścian', unit: 'SQUARE_METER', quantity: 55, pricePerUnit: 35, category: 'LABOR', workId: 'w14', workName: 'Gładź gipsowa ścian' },
        { id: 'i39', templateId: 'M14', name: 'Gładź gipsowa', unit: 'KILOGRAM', quantity: 83, pricePerUnit: 3.5, category: 'MATERIAL', workId: 'w14', workName: 'Gładź gipsowa ścian' },
        { id: 'i40', templateId: 'W1', name: 'Malowanie ścian', unit: 'SQUARE_METER', quantity: 55, pricePerUnit: 25, category: 'LABOR', workId: 'w15', workName: 'Malowanie ścian' },
        { id: 'i41', templateId: 'M1', name: 'Farba emulsyjna biała', unit: 'LITER', quantity: 9, pricePerUnit: 35, category: 'MATERIAL', workId: 'w15', workName: 'Malowanie ścian' },
        { id: 'i42', templateId: 'M3', name: 'Grunt pod farbę', unit: 'LITER', quantity: 6, pricePerUnit: 25, category: 'MATERIAL', workId: 'w15', workName: 'Malowanie ścian' },
        { id: 'i43', templateId: 'W2', name: 'Malowanie sufitu', unit: 'SQUARE_METER', quantity: 22, pricePerUnit: 30, category: 'LABOR', workId: 'w16', workName: 'Malowanie sufitu' },
        { id: 'i44', templateId: 'M1', name: 'Farba emulsyjna biała', unit: 'LITER', quantity: 4, pricePerUnit: 35, category: 'MATERIAL', workId: 'w16', workName: 'Malowanie sufitu' },
        { id: 'i45', templateId: 'W18', name: 'Montaż paneli winylowych LVT', unit: 'SQUARE_METER', quantity: 22, pricePerUnit: 45, category: 'LABOR', workId: 'w17', workName: 'Montaż paneli winylowych LVT' },
        { id: 'i46', templateId: 'M49', name: 'Panele winylowe LVT', unit: 'SQUARE_METER', quantity: 24.2, pricePerUnit: 120, category: 'MATERIAL', workId: 'w17', workName: 'Montaż paneli winylowych LVT' },
        { id: 'i47', templateId: 'M13', name: 'Podkład pod panele', unit: 'SQUARE_METER', quantity: 22, pricePerUnit: 8, category: 'MATERIAL', workId: 'w17', workName: 'Montaż paneli winylowych LVT' },
        { id: 'i48', templateId: 'W7', name: 'Montaż listew przypodłogowych', unit: 'RUNNING_METER', quantity: 20, pricePerUnit: 18, category: 'LABOR', workId: 'w18', workName: 'Montaż listew przypodłogowych' },
        { id: 'i49', templateId: 'M16', name: 'Listwy przypodłogowe MDF', unit: 'RUNNING_METER', quantity: 21, pricePerUnit: 18, category: 'MATERIAL', workId: 'w18', workName: 'Montaż listew przypodłogowych' },
        { id: 'i50', templateId: 'W27', name: 'Montaż oświetlenia LED sufitowego', unit: 'PIECE', quantity: 6, pricePerUnit: 120, category: 'LABOR', workId: 'w19', workName: 'Montaż oświetlenia LED sufitowego' },
        { id: 'i51', templateId: 'M22', name: 'Spot LED podtynkowy', unit: 'PIECE', quantity: 6, pricePerUnit: 45, category: 'MATERIAL', workId: 'w19', workName: 'Montaż oświetlenia LED sufitowego' },
      ]
    }
  ],
  includeMaterials: true,
  laborDiscountPercent: 5,
  materialDiscountPercent: 0,
  createdAt: '2024-01-15T10:30:00.000Z',
  updatedAt: '2024-01-15T14:45:00.000Z'
};
