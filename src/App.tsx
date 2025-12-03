import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { mockApi, getApiConfig } from './api';
import { 
  UserData, ItemTemplate, WorkTemplate, RoomRenovationTemplate,
  Estimate, EstimateItem, EstimateRoom, WorkMaterial,
  UnitType, RoomType, UNIT_LABELS, ROOM_LABELS 
} from './types';
import { generatePDF, PDFDetailLevel } from './pdfGenerator';
import { v4 as uuidv4 } from 'uuid';

// Helper do formatowania pozostałego czasu
const formatRemainingTime = (ms: number): string => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
};

// ============ Login Component ============
const Login: React.FC<{ onLogin: (user: UserData) => void }> = memo(({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [existingId, setExistingId] = useState('');
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [useDefaultData, setUseDefaultData] = useState(true);
  const [error, setError] = useState('');
  const config = getApiConfig();

  const handleCreate = useCallback(() => {
    if (!username.trim()) { setError('Podaj nazwę użytkownika'); return; }
    const user = mockApi.createUser(username.trim(), useDefaultData);
    onLogin(user);
  }, [username, useDefaultData, onLogin]);

  const handleLogin = useCallback(() => {
    if (!existingId.trim()) { setError('Podaj ID użytkownika'); return; }
    const user = mockApi.getUser(existingId.trim());
    if (!user) { setError('Nie znaleziono użytkownika lub konto wygasło'); return; }
    onLogin(user);
  }, [existingId, onLogin]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">📋</div>
          <h1 className="login-title">KosztorysPro</h1>
          <p className="login-subtitle">Profesjonalne wyceny dla firm remontowych</p>
        </div>
        
        {config.retentionHours > 0 && (
          <div className="retention-notice">
            ⏰ Konto demo - dane są automatycznie usuwane po {config.retentionHours}h
          </div>
        )}
        
        <div className="tabs mb-2">
          <button className={`tab ${mode === 'new' ? 'active' : ''}`} onClick={() => setMode('new')}>
            Nowe konto
          </button>
          <button className={`tab ${mode === 'existing' ? 'active' : ''}`} onClick={() => setMode('existing')}>
            Mam już konto
          </button>
        </div>
        {mode === 'new' ? (
          <>
            <div className="form-group">
              <label className="form-label">Nazwa firmy</label>
              <input type="text" className="form-input" placeholder="np. Budmar Wykończenia"
                value={username} onChange={(e) => { setUsername(e.target.value); setError(''); }} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Typ konta</label>
              <div className="account-type-options">
                <label className={`account-type-option ${useDefaultData ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    checked={useDefaultData} 
                    onChange={() => setUseDefaultData(true)} 
                  />
                  <div className="account-type-content">
                    <span className="account-type-icon">📦</span>
                    <div>
                      <strong>Z przykładowymi danymi</strong>
                      <p>Gotowe szablony prac i materiałów</p>
                    </div>
                  </div>
                </label>
                <label className={`account-type-option ${!useDefaultData ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    checked={!useDefaultData} 
                    onChange={() => setUseDefaultData(false)} 
                  />
                  <div className="account-type-content">
                    <span className="account-type-icon">✨</span>
                    <div>
                      <strong>Puste konto</strong>
                      <p>Zacznij od zera, dodaj własne pozycje</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            <button className="btn btn-primary btn-block" onClick={handleCreate}>Rozpocznij</button>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Twój unikalny ID</label>
              <input type="text" className="form-input" placeholder="np. a1b2c3d4"
                value={existingId} onChange={(e) => { setExistingId(e.target.value); setError(''); }} />
            </div>
            <button className="btn btn-primary btn-block" onClick={handleLogin}>Zaloguj się</button>
          </>
        )}
        {error && <p className="text-danger text-center mt-1" style={{ fontSize: '0.875rem' }}>{error}</p>}
      </div>
    </div>
  );
});

// ============ Search Input ============
const SearchInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = 
  memo(({ value, onChange, placeholder = 'Szukaj...' }) => (
  <div className="search-input mb-1">
    <span className="search-input-icon">🔍</span>
    <input type="text" className="form-input" style={{ paddingLeft: '2.25rem' }}
      placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
));

// ============ Retention Timer Component ============
const RetentionTimer: React.FC<{ user: UserData }> = memo(({ user }) => {
  const [remaining, setRemaining] = useState<number | null>(mockApi.getRemainingTime(user));
  
  useEffect(() => {
    if (remaining === null) return;
    const interval = setInterval(() => {
      setRemaining(mockApi.getRemainingTime(user));
    }, 60000);
    return () => clearInterval(interval);
  }, [user]);
  
  if (remaining === null || remaining <= 0) return null;
  
  const isLow = remaining < 2 * 60 * 60 * 1000; // mniej niż 2h
  
  return (
    <div className={`retention-timer ${isLow ? 'low' : ''}`}>
      ⏰ Pozostało: {formatRemainingTime(remaining)}
    </div>
  );
});

// ============ Item Template Modal ============
const ItemTemplateModal: React.FC<{
  template?: ItemTemplate | null;
  onSave: (t: Omit<ItemTemplate, 'id'>) => void;
  onClose: () => void;
}> = memo(({ template, onSave, onClose }) => {
  const [name, setName] = useState(template?.name || '');
  const [unit, setUnit] = useState<UnitType>(template?.unit || 'm2');
  const [price, setPrice] = useState(template?.pricePerUnit?.toString() || '');
  const [category, setCategory] = useState<'labor' | 'material'>(template?.category || 'labor');

  const handleSubmit = () => {
    if (!name.trim() || !price) return;
    onSave({ name: name.trim(), unit, pricePerUnit: parseFloat(price), category });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{template ? 'Edytuj pozycję' : 'Nowa pozycja'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Nazwa</label>
            <input type="text" className="form-input" placeholder="np. Malowanie ścian"
              value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Kategoria</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value as any)}>
                <option value="labor">Robocizna</option>
                <option value="material">Materiał</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Jednostka</label>
              <select className="form-select" value={unit} onChange={(e) => setUnit(e.target.value as UnitType)}>
                {Object.entries(UNIT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Cena (zł)</label>
            <input type="number" className="form-input" placeholder="0.00"
              value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Anuluj</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Zapisz</button>
        </div>
      </div>
    </div>
  );
});

// Typ pozycji w szablonie pracy (robocizna lub materiał)
interface WorkItem {
  itemTemplateId: string;
  quantityPerUnit: number;
  category: 'labor' | 'material';
}

// ============ Work Template Modal ============
const WorkTemplateModal: React.FC<{
  user: UserData;
  template?: WorkTemplate | null;
  onSave: (t: Omit<WorkTemplate, 'id'>) => void;
  onClose: () => void;
}> = memo(({ user, template, onSave, onClose }) => {
  const [name, setName] = useState(template?.name || '');
  const [unit, setUnit] = useState<UnitType>(template?.unit || 'm2');
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(template?.roomTypes || ['salon']);
  
  // Pozycje pracy (robocizna + materiały)
  const buildInitialItems = (): WorkItem[] => {
    const items: WorkItem[] = [];
    if (template) {
      // Dodaj robociznę jako pozycję (jeśli jest laborItemId lub laborPrice)
      if (template.laborItemId) {
        items.push({ itemTemplateId: template.laborItemId, quantityPerUnit: 1, category: 'labor' });
      }
      // Dodaj materiały
      template.materials.forEach(m => {
        items.push({ itemTemplateId: m.itemTemplateId, quantityPerUnit: m.quantityPerUnit, category: 'material' });
      });
    }
    return items;
  };
  
  const [items, setItems] = useState<WorkItem[]>(buildInitialItems);
  const [newItemId, setNewItemId] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemCategory, setNewItemCategory] = useState<'labor' | 'material'>('material');

  const laborItems = user.itemTemplates.filter(t => t.category === 'labor');
  const materialItems = user.itemTemplates.filter(t => t.category === 'material');
  const allItems = newItemCategory === 'labor' ? laborItems : materialItems;

  const addItem = () => {
    if (!newItemId || !newItemQty) return;
    // Sprawdź czy pozycja już istnieje
    if (items.some(i => i.itemTemplateId === newItemId)) {
      alert('Ta pozycja jest już dodana');
      return;
    }
    setItems([...items, { 
      itemTemplateId: newItemId, 
      quantityPerUnit: parseFloat(newItemQty), 
      category: newItemCategory 
    }]);
    setNewItemId('');
    setNewItemQty('1');
  };

  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  
  const updateItemQty = (idx: number, qty: number) => {
    setItems(items.map((item, i) => i === idx ? { ...item, quantityPerUnit: qty } : item));
  };

  const toggleRoomType = (rt: RoomType) => {
    if (roomTypes.includes(rt)) {
      setRoomTypes(roomTypes.filter(r => r !== rt));
    } else {
      setRoomTypes([...roomTypes, rt]);
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || roomTypes.length === 0) {
      alert('Podaj nazwę pracy i wybierz przynajmniej jedno pomieszczenie');
      return;
    }
    
    // Znajdź pozycję robocizny (pierwszą lub żadną)
    const laborItem = items.find(i => i.category === 'labor');
    const laborTemplate = laborItem ? user.itemTemplates.find(t => t.id === laborItem.itemTemplateId) : null;
    
    // Materiały
    const materials: WorkMaterial[] = items
      .filter(i => i.category === 'material')
      .map(i => ({ itemTemplateId: i.itemTemplateId, quantityPerUnit: i.quantityPerUnit }));
    
    onSave({ 
      name: name.trim(), 
      unit, 
      laborPrice: laborTemplate?.pricePerUnit || 0,
      laborItemId: laborItem?.itemTemplateId,
      materials, 
      roomTypes 
    });
  };

  // Obliczenia podsumowania
  const laborItemsInWork = items.filter(i => i.category === 'labor');
  const materialItemsInWork = items.filter(i => i.category === 'material');
  
  const calcLaborTotal = () => {
    return laborItemsInWork.reduce((sum, item) => {
      const template = user.itemTemplates.find(t => t.id === item.itemTemplateId);
      return sum + (template?.pricePerUnit || 0) * item.quantityPerUnit;
    }, 0);
  };
  
  const calcMaterialTotal = () => {
    return materialItemsInWork.reduce((sum, item) => {
      const template = user.itemTemplates.find(t => t.id === item.itemTemplateId);
      return sum + (template?.pricePerUnit || 0) * item.quantityPerUnit;
    }, 0);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3 className="modal-title">{template ? 'Edytuj szablon pracy' : 'Nowy szablon pracy'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {/* Krok 1: Nazwa pracy */}
          <div className="form-group">
            <label className="form-label">1. Nazwa pracy *</label>
            <input type="text" className="form-input" placeholder="np. Malowanie ścian"
              value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Jednostka pracy</label>
              <select className="form-select" value={unit} onChange={(e) => setUnit(e.target.value as UnitType)}>
                {Object.entries(UNIT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Pomieszczenia *</label>
            <div className="filter-pills">
              {Object.entries(ROOM_LABELS).map(([k, v]) => (
                <button key={k} className={`filter-pill ${roomTypes.includes(k as RoomType) ? 'active' : ''}`}
                  onClick={() => toggleRoomType(k as RoomType)}>{v}</button>
              ))}
            </div>
          </div>

          {/* Krok 2: Pozycje (robocizna + materiały) */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">2. Pozycje w pracy (na 1 {UNIT_LABELS[unit]})</label>
            
            {/* Lista robocizny */}
            {laborItemsInWork.length > 0 && (
              <div style={{ background: 'var(--accent-50)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '0.5rem' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent-600)' }}>🔧 ROBOCIZNA</p>
                {laborItemsInWork.map((item) => {
                  const itemIdx = items.indexOf(item);
                  const template = user.itemTemplates.find(t => t.id === item.itemTemplateId);
                  return (
                    <div key={item.itemTemplateId} className="flex items-center gap-1 mb-1" style={{ background: 'white', padding: '0.5rem', borderRadius: 'var(--radius)' }}>
                      <span className="flex-1 text-sm">{template?.name || '?'}</span>
                      <input type="number" className="form-input" style={{ width: '60px' }} 
                        value={item.quantityPerUnit} 
                        onChange={(e) => updateItemQty(itemIdx, parseFloat(e.target.value) || 0)}
                        min="0.01" step="0.01" />
                      <span className="text-xs text-gray">{template ? UNIT_LABELS[template.unit] : ''}</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--accent-600)', minWidth: '70px', textAlign: 'right' }}>
                        {((template?.pricePerUnit || 0) * item.quantityPerUnit).toFixed(2)} zł
                      </span>
                      <button className="btn btn-ghost btn-sm" onClick={() => removeItem(itemIdx)}>×</button>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Lista materiałów */}
            {materialItemsInWork.length > 0 && (
              <div style={{ background: 'var(--gray-50)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '0.5rem' }}>
                <p className="text-xs font-semibold mb-1 text-gray">📦 MATERIAŁY</p>
                {materialItemsInWork.map((item) => {
                  const itemIdx = items.indexOf(item);
                  const template = user.itemTemplates.find(t => t.id === item.itemTemplateId);
                  return (
                    <div key={item.itemTemplateId} className="flex items-center gap-1 mb-1" style={{ background: 'white', padding: '0.5rem', borderRadius: 'var(--radius)' }}>
                      <span className="flex-1 text-sm">{template?.name || '?'}</span>
                      <input type="number" className="form-input" style={{ width: '60px' }} 
                        value={item.quantityPerUnit} 
                        onChange={(e) => updateItemQty(itemIdx, parseFloat(e.target.value) || 0)}
                        min="0.01" step="0.01" />
                      <span className="text-xs text-gray">{template ? UNIT_LABELS[template.unit] : ''}</span>
                      <span className="text-sm font-medium text-gray" style={{ minWidth: '70px', textAlign: 'right' }}>
                        {((template?.pricePerUnit || 0) * item.quantityPerUnit).toFixed(2)} zł
                      </span>
                      <button className="btn btn-ghost btn-sm" onClick={() => removeItem(itemIdx)}>×</button>
                    </div>
                  );
                })}
              </div>
            )}
            
            {items.length === 0 && (
              <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius)', textAlign: 'center', marginBottom: '0.5rem' }}>
                <p className="text-sm text-gray">Dodaj pozycje z listy poniżej</p>
              </div>
            )}
            
            {/* Dodawanie nowych pozycji */}
            <div style={{ background: 'var(--gray-100)', padding: '0.75rem', borderRadius: 'var(--radius)' }}>
              <div className="flex gap-1 mb-1">
                <button 
                  className={`filter-pill ${newItemCategory === 'labor' ? 'active' : ''}`}
                  onClick={() => { setNewItemCategory('labor'); setNewItemId(''); }}
                  style={{ fontSize: '0.75rem' }}
                >🔧 Robocizna</button>
                <button 
                  className={`filter-pill ${newItemCategory === 'material' ? 'active' : ''}`}
                  onClick={() => { setNewItemCategory('material'); setNewItemId(''); }}
                  style={{ fontSize: '0.75rem' }}
                >📦 Materiał</button>
              </div>
              <div className="flex gap-1">
                <select className="form-select" style={{ flex: 2 }} value={newItemId}
                  onChange={(e) => setNewItemId(e.target.value)}>
                  <option value="">Wybierz {newItemCategory === 'labor' ? 'robociznę' : 'materiał'}...</option>
                  {allItems.map(item => (
                    <option key={item.id} value={item.id} disabled={items.some(i => i.itemTemplateId === item.id)}>
                      {item.name} ({item.pricePerUnit} zł/{UNIT_LABELS[item.unit]})
                    </option>
                  ))}
                </select>
                <input type="number" className="form-input" style={{ width: '60px' }} placeholder="Ilość"
                  value={newItemQty} onChange={(e) => setNewItemQty(e.target.value)} min="0.01" step="0.01" />
                <button className="btn btn-primary btn-sm" onClick={addItem} disabled={!newItemId}>+</button>
              </div>
            </div>
          </div>
          
          {/* Podsumowanie */}
          {items.length > 0 && (
            <div style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: 'var(--radius)', marginTop: '1rem' }}>
              <div className="flex justify-between text-sm">
                <span>Robocizna:</span>
                <span>{calcLaborTotal().toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Materiały:</span>
                <span>{calcMaterialTotal().toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between font-semibold" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
                <span>RAZEM na 1 {UNIT_LABELS[unit]}:</span>
                <span>{(calcLaborTotal() + calcMaterialTotal()).toFixed(2)} zł</span>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Anuluj</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Zapisz szablon</button>
        </div>
      </div>
    </div>
  );
});

// ============ Renovation Template Modal ============
const RenovationTemplateModal: React.FC<{
  user: UserData;
  template?: RoomRenovationTemplate | null;
  onSave: (t: Omit<RoomRenovationTemplate, 'id'>) => void;
  onClose: () => void;
}> = memo(({ user, template, onSave, onClose }) => {
  const [name, setName] = useState(template?.name || '');
  const [roomType, setRoomType] = useState<RoomType>(template?.roomType || 'salon');
  const [description, setDescription] = useState(template?.description || '');
  const [works, setWorks] = useState<{ workTemplateId: string; defaultQuantity: number }[]>(template?.works || []);
  const [newWorkId, setNewWorkId] = useState('');
  const [newWorkQty, setNewWorkQty] = useState('10');

  const availableWorks = user.workTemplates.filter(w => w.roomTypes.includes(roomType));

  const addWork = () => {
    if (!newWorkId || !newWorkQty) return;
    setWorks([...works, { workTemplateId: newWorkId, defaultQuantity: parseFloat(newWorkQty) }]);
    setNewWorkId('');
    setNewWorkQty('10');
  };

  const removeWork = (idx: number) => setWorks(works.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!name.trim() || works.length === 0) return;
    onSave({ name: name.trim(), roomType, description: description.trim(), works });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
        <div className="modal-header">
          <h3 className="modal-title">{template ? 'Edytuj szablon remontu' : 'Nowy szablon remontu'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Nazwa szablonu</label>
            <input type="text" className="form-input" placeholder="np. Remont łazienki - kompleksowy"
              value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Typ pomieszczenia</label>
              <select className="form-select" value={roomType} onChange={(e) => setRoomType(e.target.value as RoomType)}>
                {Object.entries(ROOM_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Opis</label>
            <input type="text" className="form-input" placeholder="Krótki opis..."
              value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Prace w szablonie</label>
            {works.map((w, idx) => {
              const work = user.workTemplates.find(t => t.id === w.workTemplateId);
              return (
                <div key={idx} className="flex items-center gap-1 mb-1" style={{ background: 'var(--gray-50)', padding: '0.5rem', borderRadius: 'var(--radius)' }}>
                  <span className="flex-1 text-sm">{work?.name || '?'}</span>
                  <span className="text-xs text-gray">{w.defaultQuantity} {work ? UNIT_LABELS[work.unit] : ''}</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeWork(idx)}>×</button>
                </div>
              );
            })}
            <div className="flex gap-1 mt-1">
              <select className="form-select" style={{ flex: 2 }} value={newWorkId}
                onChange={(e) => setNewWorkId(e.target.value)}>
                <option value="">Wybierz pracę...</option>
                {availableWorks.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              <input type="number" className="form-input" style={{ width: '70px' }} placeholder="Ilość"
                value={newWorkQty} onChange={(e) => setNewWorkQty(e.target.value)} min="0.1" step="0.1" />
              <button className="btn btn-secondary" onClick={addWork}>+</button>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Anuluj</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Zapisz</button>
        </div>
      </div>
    </div>
  );
});

// ============ Item Templates View ============
const ItemTemplatesView: React.FC<{ user: UserData; onUpdate: () => void }> = memo(({ user, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ItemTemplate | null>(null);
  const [filter, setFilter] = useState<'all' | 'labor' | 'material'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => user.itemTemplates.filter(t => {
    const matchesFilter = filter === 'all' || t.category === filter;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }), [user.itemTemplates, filter, search]);

  const handleSave = useCallback((data: Omit<ItemTemplate, 'id'>) => {
    if (editing) {
      mockApi.updateItemTemplate(user.uniqueId, editing.id, data);
    } else {
      mockApi.addItemTemplate(user.uniqueId, data);
    }
    setShowModal(false);
    setEditing(null);
    onUpdate();
  }, [editing, user.uniqueId, onUpdate]);

  const handleDelete = useCallback((id: string) => {
    if (confirm('Usunąć tę pozycję?')) {
      mockApi.deleteItemTemplate(user.uniqueId, id);
      onUpdate();
    }
  }, [user.uniqueId, onUpdate]);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📦 Szablony pozycji</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Dodaj</button>
        </div>
        <div className="card-body">
          <SearchInput value={search} onChange={setSearch} />
          <div className="filter-pills">
            <button className={`filter-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              Wszystkie ({user.itemTemplates.length})
            </button>
            <button className={`filter-pill ${filter === 'labor' ? 'active' : ''}`} onClick={() => setFilter('labor')}>
              Robocizna
            </button>
            <button className={`filter-pill ${filter === 'material' ? 'active' : ''}`} onClick={() => setFilter('material')}>
              Materiały
            </button>
          </div>
        </div>
      </div>
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📦</div><p>Brak pozycji</p></div>
        ) : filtered.map(t => (
          <div key={t.id} className="list-item">
            <div className="list-item-content">
              <div className="list-item-title">{t.name}</div>
              <div className="list-item-subtitle">
                <span className={`badge badge-${t.category}`}>{t.category === 'labor' ? 'Robocizna' : 'Materiał'}</span>
                {' '}{t.pricePerUnit.toFixed(2)} zł/{UNIT_LABELS[t.unit]}
              </div>
            </div>
            <div className="list-item-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(t); setShowModal(true); }}>✏️</button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(t.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {showModal && <ItemTemplateModal template={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />}
    </div>
  );
});

// ============ Work Templates View ============
const WorkTemplatesView: React.FC<{ user: UserData; onUpdate: () => void }> = memo(({ user, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<WorkTemplate | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => user.workTemplates.filter(t => {
    const matchesRoom = selectedRoom === 'all' || t.roomTypes.includes(selectedRoom as RoomType);
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesRoom && matchesSearch;
  }), [user.workTemplates, selectedRoom, search]);

  const getMaterialsInfo = useCallback((w: WorkTemplate): string => {
    if (w.materials.length === 0) return 'Brak materiałów';
    return w.materials.map(m => user.itemTemplates.find(t => t.id === m.itemTemplateId)?.name || '?').join(', ');
  }, [user.itemTemplates]);

  const calcTotal = useCallback((w: WorkTemplate): number => {
    let t = w.laborPrice;
    for (const m of w.materials) {
      const item = user.itemTemplates.find(i => i.id === m.itemTemplateId);
      if (item) t += item.pricePerUnit * m.quantityPerUnit;
    }
    return t;
  }, [user.itemTemplates]);

  const handleSave = useCallback((data: Omit<WorkTemplate, 'id'>) => {
    if (editing) {
      mockApi.updateWorkTemplate(user.uniqueId, editing.id, data);
    } else {
      mockApi.addWorkTemplate(user.uniqueId, data);
    }
    setShowModal(false);
    setEditing(null);
    onUpdate();
  }, [editing, user.uniqueId, onUpdate]);

  const handleDelete = useCallback((id: string) => {
    if (confirm('Usunąć ten szablon?')) {
      mockApi.deleteWorkTemplate(user.uniqueId, id);
      onUpdate();
    }
  }, [user.uniqueId, onUpdate]);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🔧 Szablony prac</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Dodaj</button>
        </div>
        <div className="card-body">
          <SearchInput value={search} onChange={setSearch} />
          <div className="filter-pills">
            <button className={`filter-pill ${selectedRoom === 'all' ? 'active' : ''}`} onClick={() => setSelectedRoom('all')}>Wszystkie</button>
            {Object.entries(ROOM_LABELS).map(([k, v]) => (
              <button key={k} className={`filter-pill ${selectedRoom === k ? 'active' : ''}`} onClick={() => setSelectedRoom(k as RoomType)}>{v}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🔧</div><p>Brak szablonów</p></div>
        ) : filtered.map(w => (
          <div key={w.id} className="list-item">
            <div className="list-item-content">
              <div className="list-item-title">{w.name}</div>
              <div className="list-item-subtitle">Robocizna: {w.laborPrice.toFixed(2)} zł/{UNIT_LABELS[w.unit]}</div>
              <div className="list-item-subtitle text-xs text-gray">Materiały: {getMaterialsInfo(w)}</div>
              <div className="list-item-subtitle"><strong className="text-primary">Razem: {calcTotal(w).toFixed(2)} zł/{UNIT_LABELS[w.unit]}</strong></div>
            </div>
            <div className="list-item-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(w); setShowModal(true); }}>✏️</button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(w.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {showModal && <WorkTemplateModal user={user} template={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />}
    </div>
  );
});

// ============ Renovation Templates View ============
const RenovationTemplatesView: React.FC<{ user: UserData; onUpdate: () => void }> = memo(({ user, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<RoomRenovationTemplate | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => user.roomRenovationTemplates.filter(t => {
    const matchesRoom = selectedRoom === 'all' || t.roomType === selectedRoom;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesRoom && matchesSearch;
  }), [user.roomRenovationTemplates, selectedRoom, search]);

  const calcTotal = useCallback((t: RoomRenovationTemplate): number => {
    let total = 0;
    for (const wr of t.works) {
      const w = user.workTemplates.find(x => x.id === wr.workTemplateId);
      if (w) {
        total += w.laborPrice * wr.defaultQuantity;
        for (const m of w.materials) {
          const item = user.itemTemplates.find(i => i.id === m.itemTemplateId);
          if (item) total += item.pricePerUnit * m.quantityPerUnit * wr.defaultQuantity;
        }
      }
    }
    return total;
  }, [user.workTemplates, user.itemTemplates]);

  const handleSave = useCallback((data: Omit<RoomRenovationTemplate, 'id'>) => {
    if (editing) {
      mockApi.updateRenovationTemplate(user.uniqueId, editing.id, data);
    } else {
      mockApi.addRenovationTemplate(user.uniqueId, data);
    }
    setShowModal(false);
    setEditing(null);
    onUpdate();
  }, [editing, user.uniqueId, onUpdate]);

  const handleDelete = useCallback((id: string) => {
    if (confirm('Usunąć ten szablon?')) {
      mockApi.deleteRenovationTemplate(user.uniqueId, id);
      onUpdate();
    }
  }, [user.uniqueId, onUpdate]);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🏠 Szablony remontów</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Dodaj</button>
        </div>
        <div className="card-body">
          <SearchInput value={search} onChange={setSearch} />
          <div className="filter-pills">
            <button className={`filter-pill ${selectedRoom === 'all' ? 'active' : ''}`} onClick={() => setSelectedRoom('all')}>Wszystkie</button>
            {Object.entries(ROOM_LABELS).map(([k, v]) => (
              <button key={k} className={`filter-pill ${selectedRoom === k ? 'active' : ''}`} onClick={() => setSelectedRoom(k as RoomType)}>{v}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🏠</div><p>Brak szablonów</p></div>
        ) : filtered.map(t => (
          <div key={t.id} className="list-item">
            <div className="list-item-content">
              <div className="list-item-title">{t.name}</div>
              <div className="list-item-subtitle"><span className="badge badge-primary">{ROOM_LABELS[t.roomType]}</span></div>
              <div className="list-item-subtitle text-xs text-gray">{t.description}</div>
              <div className="list-item-subtitle">{t.works.length} prac • <strong className="text-primary">~{calcTotal(t).toFixed(0)} zł</strong></div>
            </div>
            <div className="list-item-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(t); setShowModal(true); }}>✏️</button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(t.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {showModal && <RenovationTemplateModal user={user} template={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />}
    </div>
  );
});

// ============ Templates View ============
const TemplatesView: React.FC<{ user: UserData; onUpdate: () => void }> = memo(({ user, onUpdate }) => {
  const [tab, setTab] = useState<'items' | 'works' | 'renovations'>('items');

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="tabs">
            <button className={`tab ${tab === 'items' ? 'active' : ''}`} onClick={() => setTab('items')}>📦 Pozycje</button>
            <button className={`tab ${tab === 'works' ? 'active' : ''}`} onClick={() => setTab('works')}>🔧 Prace</button>
            <button className={`tab ${tab === 'renovations' ? 'active' : ''}`} onClick={() => setTab('renovations')}>🏠 Remonty</button>
          </div>
        </div>
      </div>
      {tab === 'items' && <ItemTemplatesView user={user} onUpdate={onUpdate} />}
      {tab === 'works' && <WorkTemplatesView user={user} onUpdate={onUpdate} />}
      {tab === 'renovations' && <RenovationTemplatesView user={user} onUpdate={onUpdate} />}
    </div>
  );
});

// ============ Add Work Modal ============
const AddWorkModal: React.FC<{
  user: UserData;
  roomType: RoomType;
  includeMaterials: boolean;
  onAdd: (items: EstimateItem[]) => void;
  onClose: () => void;
}> = ({ user, roomType, includeMaterials, onAdd, onClose }) => {
  const [selectedWork, setSelectedWork] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [preview, setPreview] = useState<EstimateItem[]>([]);

  const available = user.workTemplates.filter(w => w.roomTypes.includes(roomType));

  useEffect(() => {
    if (!selectedWork || !quantity) { setPreview([]); return; }
    const work = user.workTemplates.find(w => w.id === selectedWork);
    if (!work) return;
    const qty = parseFloat(quantity) || 0;
    const items: EstimateItem[] = [];
    const workGroupId = uuidv4(); // ID grupowania dla tej pracy
    
    items.push({
      id: uuidv4(), templateId: work.id, name: work.name, unit: work.unit,
      quantity: qty, pricePerUnit: work.laborPrice, category: 'labor',
      workId: workGroupId, workName: work.name
    });
    
    if (includeMaterials) {
      for (const m of work.materials) {
        const item = user.itemTemplates.find(t => t.id === m.itemTemplateId);
        if (item) {
          items.push({
            id: uuidv4(), templateId: item.id, name: item.name, unit: item.unit,
            quantity: Math.ceil(m.quantityPerUnit * qty * 100) / 100,
            pricePerUnit: item.pricePerUnit, category: 'material',
            workId: workGroupId, workName: work.name
          });
        }
      }
    }
    setPreview(items);
  }, [selectedWork, quantity, user, includeMaterials]);

  const updateQty = (id: string, v: number) => setPreview(p => p.map(i => i.id === id ? { ...i, quantity: v } : i));
  const updatePrice = (id: string, v: number) => setPreview(p => p.map(i => i.id === id ? { ...i, pricePerUnit: v } : i));
  const remove = (id: string) => setPreview(p => p.filter(i => i.id !== id));
  const total = preview.reduce((s, i) => s + i.quantity * i.pricePerUnit, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Dodaj pracę - {ROOM_LABELS[roomType]}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Wybierz pracę</label>
            <select className="form-select" value={selectedWork} onChange={(e) => setSelectedWork(e.target.value)}>
              <option value="">-- Wybierz --</option>
              {available.map(w => <option key={w.id} value={w.id}>{w.name} ({w.laborPrice} zł/{UNIT_LABELS[w.unit]})</option>)}
            </select>
          </div>
          {selectedWork && (
            <div className="form-group">
              <label className="form-label">Ilość ({UNIT_LABELS[user.workTemplates.find(w => w.id === selectedWork)?.unit || 'm2']})</label>
              <input type="number" className="form-input" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="0.1" step="0.1" />
            </div>
          )}
          {preview.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Pozycje do dodania:</p>
              {preview.filter(i => i.category === 'labor').length > 0 && (
                <div style={{ background: 'var(--accent-50)', padding: '0.5rem', borderRadius: 'var(--radius)', marginBottom: '0.5rem' }}>
                  <p className="text-xs font-semibold" style={{ color: 'var(--accent-600)' }}>ROBOCIZNA</p>
                  {preview.filter(i => i.category === 'labor').map(item => (
                    <div key={item.id} className="item-row">
                      <span className="item-row-name">{item.name}</span>
                      <input type="number" className="item-row-input" value={item.quantity} onChange={(e) => updateQty(item.id, parseFloat(e.target.value) || 0)} />
                      <span className="item-row-unit">{UNIT_LABELS[item.unit]}</span>
                      <span>×</span>
                      <input type="number" className="item-row-input" value={item.pricePerUnit} onChange={(e) => updatePrice(item.id, parseFloat(e.target.value) || 0)} />
                      <span className="text-xs">zł</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => remove(item.id)}>×</button>
                    </div>
                  ))}
                </div>
              )}
              {preview.filter(i => i.category === 'material').length > 0 && (
                <div style={{ background: 'var(--gray-50)', padding: '0.5rem', borderRadius: 'var(--radius)' }}>
                  <p className="text-xs font-semibold text-gray">MATERIAŁY</p>
                  {preview.filter(i => i.category === 'material').map(item => (
                    <div key={item.id} className="item-row">
                      <span className="item-row-name">{item.name}</span>
                      <input type="number" className="item-row-input" value={item.quantity} onChange={(e) => updateQty(item.id, parseFloat(e.target.value) || 0)} />
                      <span className="item-row-unit">{UNIT_LABELS[item.unit]}</span>
                      <span>×</span>
                      <input type="number" className="item-row-input" value={item.pricePerUnit} onChange={(e) => updatePrice(item.id, parseFloat(e.target.value) || 0)} />
                      <span className="text-xs">zł</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => remove(item.id)}>×</button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-right mt-1 font-semibold text-primary">Razem: {total.toFixed(2)} zł</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Anuluj</button>
          <button className="btn btn-primary" onClick={() => preview.length > 0 && onAdd(preview)} disabled={preview.length === 0}>Dodaj</button>
        </div>
      </div>
    </div>
  );
};

// ============ PDF Export Modal ============
const PDFExportModal: React.FC<{
  estimate: Estimate;
  companyName: string;
  onClose: () => void;
}> = ({ estimate, companyName, onClose }) => {
  const [detailLevel, setDetailLevel] = useState<PDFDetailLevel>('standard');

  const handleExport = () => {
    generatePDF(estimate, companyName, { detailLevel, showMaterials: estimate.includeMaterials });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Eksport PDF</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Poziom szczegółowości</label>
            <div className="flex flex-col gap-1">
              <label className="form-checkbox">
                <input type="radio" name="detail" checked={detailLevel === 'simple'} onChange={() => setDetailLevel('simple')} />
                <div><strong>Uproszczony</strong><br/><span className="text-xs text-gray">Tylko podsumowanie kwot</span></div>
              </label>
              <label className="form-checkbox">
                <input type="radio" name="detail" checked={detailLevel === 'standard'} onChange={() => setDetailLevel('standard')} />
                <div><strong>Standardowy</strong><br/><span className="text-xs text-gray">Lista pozycji bez cen jednostkowych</span></div>
              </label>
              <label className="form-checkbox">
                <input type="radio" name="detail" checked={detailLevel === 'detailed'} onChange={() => setDetailLevel('detailed')} />
                <div><strong>Szczegółowy</strong><br/><span className="text-xs text-gray">Pełna specyfikacja z cenami</span></div>
              </label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Anuluj</button>
          <button className="btn btn-primary" onClick={handleExport}>📄 Pobierz PDF</button>
        </div>
      </div>
    </div>
  );
};

// ============ Estimate Editor ============
const EstimateEditor: React.FC<{
  user: UserData;
  estimate?: Estimate | null;
  onSave: (e: Estimate) => void;
  onCancel: () => void;
}> = ({ user, estimate, onSave, onCancel }) => {
  const [clientName, setClientName] = useState(estimate?.clientName || '');
  const [clientAddress, setClientAddress] = useState(estimate?.clientAddress || '');
  const [projectDescription, setProjectDescription] = useState(estimate?.projectDescription || '');
  const [rooms, setRooms] = useState<EstimateRoom[]>(estimate?.rooms || []);
  const [includeMaterials, setIncludeMaterials] = useState(estimate?.includeMaterials ?? true);
  const [laborDiscount, setLaborDiscount] = useState(estimate?.laborDiscountPercent?.toString() || '0');
  const [materialDiscount, setMaterialDiscount] = useState(estimate?.materialDiscountPercent?.toString() || '0');
  
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<RoomType>('salon');
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const addRoom = () => {
    if (!newRoomName.trim()) return;
    setRooms([...rooms, { id: uuidv4(), name: newRoomName.trim(), roomType: newRoomType, items: [] }]);
    setNewRoomName('');
    setShowAddRoom(false);
  };

  const removeRoom = (id: string) => {
    if (confirm('Usunąć pomieszczenie?')) setRooms(rooms.filter(r => r.id !== id));
  };

  const addItems = (roomId: string, items: EstimateItem[]) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, items: [...r.items, ...items] } : r));
    setShowWorkModal(false);
    setActiveRoomId(null);
  };

  const removeItem = (roomId: string, itemId: string) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, items: r.items.filter(i => i.id !== itemId) } : r));
  };

  const updateItem = (roomId: string, itemId: string, updates: Partial<EstimateItem>) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, items: r.items.map(i => i.id === itemId ? { ...i, ...updates } : i) } : r));
  };

  const applyTemplate = (roomId: string, templateId: string) => {
    const template = user.roomRenovationTemplates.find(t => t.id === templateId);
    if (!template) return;
    const items: EstimateItem[] = [];
    for (const wr of template.works) {
      const work = user.workTemplates.find(w => w.id === wr.workTemplateId);
      if (!work) continue;
      const workGroupId = uuidv4();
      items.push({ 
        id: uuidv4(), templateId: work.id, name: work.name, unit: work.unit, 
        quantity: wr.defaultQuantity, pricePerUnit: work.laborPrice, category: 'labor',
        workId: workGroupId, workName: work.name
      });
      if (includeMaterials) {
        for (const m of work.materials) {
          const item = user.itemTemplates.find(t => t.id === m.itemTemplateId);
          if (item) {
            items.push({ 
              id: uuidv4(), templateId: item.id, name: item.name, unit: item.unit, 
              quantity: Math.ceil(m.quantityPerUnit * wr.defaultQuantity * 100) / 100, 
              pricePerUnit: item.pricePerUnit, category: 'material',
              workId: workGroupId, workName: work.name
            });
          }
        }
      }
    }
    addItems(roomId, items);
  };

  const calcRoom = (r: EstimateRoom) => {
    const labor = r.items.filter(i => i.category === 'labor').reduce((s, i) => s + i.quantity * i.pricePerUnit, 0);
    const material = r.items.filter(i => i.category === 'material').reduce((s, i) => s + i.quantity * i.pricePerUnit, 0);
    return { labor, material, total: labor + (includeMaterials ? material : 0) };
  };

  const totalLabor = rooms.reduce((s, r) => s + calcRoom(r).labor, 0);
  const totalMaterial = rooms.reduce((s, r) => s + calcRoom(r).material, 0);
  const laborDiscountAmount = totalLabor * (parseFloat(laborDiscount) || 0) / 100;
  const materialDiscountAmount = totalMaterial * (parseFloat(materialDiscount) || 0) / 100;
  const finalLabor = totalLabor - laborDiscountAmount;
  const finalMaterial = includeMaterials ? (totalMaterial - materialDiscountAmount) : 0;
  const grandTotal = finalLabor + finalMaterial;

  const handleSave = () => {
    if (!clientName.trim()) { alert('Podaj nazwę klienta'); return; }
    onSave({
      id: estimate?.id || uuidv4(),
      clientName: clientName.trim(),
      clientAddress: clientAddress.trim(),
      projectDescription: projectDescription.trim(),
      rooms,
      includeMaterials,
      laborDiscountPercent: parseFloat(laborDiscount) || 0,
      materialDiscountPercent: parseFloat(materialDiscount) || 0,
      createdAt: estimate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  return (
    <div>
      {/* Client Info */}
      <div className="card">
        <div className="card-header"><h2 className="card-title">👤 Dane klienta</h2></div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Nazwa klienta *</label>
            <input type="text" className="form-input" placeholder="Jan Kowalski" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Adres</label>
              <input type="text" className="form-input" placeholder="ul. Budowlana 1" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Opis projektu</label>
              <input type="text" className="form-input" placeholder="Remont mieszkania" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="card">
        <div className="card-header"><h2 className="card-title">⚙️ Opcje kosztorysu</h2></div>
        <div className="card-body">
          <label className="form-checkbox mb-2">
            <input type="checkbox" checked={includeMaterials} onChange={(e) => setIncludeMaterials(e.target.checked)} />
            <span>Uwzględnij materiały w kosztorysie</span>
          </label>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Rabat na robociznę (%)</label>
              <input type="number" className="form-input" value={laborDiscount} onChange={(e) => setLaborDiscount(e.target.value)} min="0" max="100" />
            </div>
            {includeMaterials && (
              <div className="form-group">
                <label className="form-label">Rabat na materiały (%)</label>
                <input type="number" className="form-input" value={materialDiscount} onChange={(e) => setMaterialDiscount(e.target.value)} min="0" max="100" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rooms */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🏠 Pomieszczenia</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddRoom(true)}>+ Dodaj</button>
        </div>
        {showAddRoom && (
          <div className="card-body" style={{ borderBottom: '1px solid var(--gray-100)' }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nazwa</label>
                <input type="text" className="form-input" placeholder="np. Łazienka główna" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Typ</label>
                <select className="form-select" value={newRoomType} onChange={(e) => setNewRoomType(e.target.value as RoomType)}>
                  {Object.entries(ROOM_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-1">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAddRoom(false)}>Anuluj</button>
              <button className="btn btn-primary btn-sm" onClick={addRoom}>Dodaj</button>
            </div>
          </div>
        )}
        {rooms.length === 0 && <div className="empty-state"><div className="empty-state-icon">🏠</div><p>Dodaj pomieszczenie</p></div>}
      </div>

      {/* Room List */}
      {rooms.map(room => {
        const totals = calcRoom(room);
        const templates = user.roomRenovationTemplates.filter(t => t.roomType === room.roomType);
        return (
          <div key={room.id} className="room-card">
            <div className="room-card-header">
              <div>
                <div className="room-card-title">{room.name}</div>
                <span className="badge badge-primary">{ROOM_LABELS[room.roomType]}</span>
              </div>
              <div className="flex gap-1">
                <button className="btn btn-primary btn-sm" onClick={() => { setActiveRoomId(room.id); setShowWorkModal(true); }}>+ Praca</button>
                <button className="btn btn-ghost btn-sm" onClick={() => removeRoom(room.id)}>🗑️</button>
              </div>
            </div>
            
            {templates.length > 0 && room.items.length === 0 && (
              <div className="card-body" style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-100)' }}>
                <p className="text-xs text-gray mb-1">💡 Szybki start:</p>
                <div className="flex gap-1 flex-wrap">
                  {templates.map(t => <button key={t.id} className="btn btn-secondary btn-sm" onClick={() => applyTemplate(room.id, t.id)}>{t.name}</button>)}
                </div>
              </div>
            )}

            {room.items.length === 0 ? (
              <div className="empty-state" style={{ padding: '1rem' }}><p className="text-sm">Brak pozycji</p></div>
            ) : (
              <>
                {/* Grupowanie pozycji według prac */}
                {(() => {
                  // Grupowanie items według workId
                  const workGroups = new Map<string, EstimateItem[]>();
                  const ungroupedItems: EstimateItem[] = [];
                  
                  room.items.forEach(item => {
                    if (item.workId) {
                      const existing = workGroups.get(item.workId) || [];
                      existing.push(item);
                      workGroups.set(item.workId, existing);
                    } else {
                      ungroupedItems.push(item);
                    }
                  });

                  return (
                    <>
                      {/* Grupowane prace */}
                      {Array.from(workGroups.entries()).map(([workId, items]) => {
                        const laborItems = items.filter(i => i.category === 'labor');
                        const materialItems = items.filter(i => i.category === 'material');
                        const workName = items[0]?.workName || 'Praca';
                        const workTotal = items.reduce((s, i) => s + i.quantity * i.pricePerUnit, 0);
                        
                        return (
                          <div key={workId} className="work-group">
                            <div className="work-group-header">
                              <span className="work-group-title">🔧 {workName}</span>
                              <span className="work-group-total">{workTotal.toFixed(2)} zł</span>
                            </div>
                            {laborItems.map(item => (
                              <div key={item.id} className="item-row">
                                <span className="item-row-name">{item.name}</span>
                                <input type="number" className="item-row-input" value={item.quantity} onChange={(e) => updateItem(room.id, item.id, { quantity: parseFloat(e.target.value) || 0 })} />
                                <span className="item-row-unit">{UNIT_LABELS[item.unit]}</span>
                                <span>×</span>
                                <input type="number" className="item-row-input" value={item.pricePerUnit} onChange={(e) => updateItem(room.id, item.id, { pricePerUnit: parseFloat(e.target.value) || 0 })} />
                                <span className="item-row-total">= {(item.quantity * item.pricePerUnit).toFixed(2)} zł</span>
                                <button className="btn btn-ghost btn-sm" onClick={() => removeItem(room.id, item.id)}>×</button>
                              </div>
                            ))}
                            {includeMaterials && materialItems.length > 0 && (
                              <div className="work-materials">
                                <div className="work-materials-label">📦 Materiały:</div>
                                {materialItems.map(item => (
                                  <div key={item.id} className="item-row material-item">
                                    <span className="item-row-name">{item.name}</span>
                                    <input type="number" className="item-row-input" value={item.quantity} onChange={(e) => updateItem(room.id, item.id, { quantity: parseFloat(e.target.value) || 0 })} />
                                    <span className="item-row-unit">{UNIT_LABELS[item.unit]}</span>
                                    <span>×</span>
                                    <input type="number" className="item-row-input" value={item.pricePerUnit} onChange={(e) => updateItem(room.id, item.id, { pricePerUnit: parseFloat(e.target.value) || 0 })} />
                                    <span className="item-row-total">= {(item.quantity * item.pricePerUnit).toFixed(2)} zł</span>
                                    <button className="btn btn-ghost btn-sm" onClick={() => removeItem(room.id, item.id)}>×</button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {/* Niezgrupowane pozycje (stare dane lub dodane ręcznie) */}
                      {ungroupedItems.filter(i => i.category === 'labor').length > 0 && (
                        <div className="room-section">
                          <div className="room-section-header labor">🔧 Pozostała robocizna</div>
                          {ungroupedItems.filter(i => i.category === 'labor').map(item => (
                            <div key={item.id} className="item-row">
                              <span className="item-row-name">{item.name}</span>
                              <input type="number" className="item-row-input" value={item.quantity} onChange={(e) => updateItem(room.id, item.id, { quantity: parseFloat(e.target.value) || 0 })} />
                              <span className="item-row-unit">{UNIT_LABELS[item.unit]}</span>
                              <span>×</span>
                              <input type="number" className="item-row-input" value={item.pricePerUnit} onChange={(e) => updateItem(room.id, item.id, { pricePerUnit: parseFloat(e.target.value) || 0 })} />
                              <span className="item-row-total">= {(item.quantity * item.pricePerUnit).toFixed(2)} zł</span>
                              <button className="btn btn-ghost btn-sm" onClick={() => removeItem(room.id, item.id)}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                      {includeMaterials && ungroupedItems.filter(i => i.category === 'material').length > 0 && (
                        <div className="room-section">
                          <div className="room-section-header material">📦 Pozostałe materiały</div>
                          {ungroupedItems.filter(i => i.category === 'material').map(item => (
                            <div key={item.id} className="item-row">
                              <span className="item-row-name">{item.name}</span>
                              <input type="number" className="item-row-input" value={item.quantity} onChange={(e) => updateItem(room.id, item.id, { quantity: parseFloat(e.target.value) || 0 })} />
                              <span className="item-row-unit">{UNIT_LABELS[item.unit]}</span>
                              <span>×</span>
                              <input type="number" className="item-row-input" value={item.pricePerUnit} onChange={(e) => updateItem(room.id, item.id, { pricePerUnit: parseFloat(e.target.value) || 0 })} />
                              <span className="item-row-total">= {(item.quantity * item.pricePerUnit).toFixed(2)} zł</span>
                              <button className="btn btn-ghost btn-sm" onClick={() => removeItem(room.id, item.id)}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
                <div className="room-total">
                  <span>Robocizna: {totals.labor.toFixed(2)} zł{includeMaterials && ` | Materiały: ${totals.material.toFixed(2)} zł`}</span>
                  <strong>Razem: {totals.total.toFixed(2)} zł</strong>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Summary */}
      <div className="summary-box">
        <div className="summary-row"><span>Robocizna:</span><span>{totalLabor.toFixed(2)} zł</span></div>
        {laborDiscountAmount > 0 && <div className="summary-row discount"><span>Rabat ({laborDiscount}%):</span><span>-{laborDiscountAmount.toFixed(2)} zł</span></div>}
        {includeMaterials && (
          <>
            <div className="summary-row"><span>Materiały:</span><span>{totalMaterial.toFixed(2)} zł</span></div>
            {materialDiscountAmount > 0 && <div className="summary-row discount"><span>Rabat ({materialDiscount}%):</span><span>-{materialDiscountAmount.toFixed(2)} zł</span></div>}
          </>
        )}
        <div className="summary-row total"><span>RAZEM:</span><span className="value">{grandTotal.toFixed(2)} zł</span></div>
      </div>

      <div className="flex gap-1 mt-2">
        <button className="btn btn-secondary flex-1" onClick={onCancel}>Anuluj</button>
        <button className="btn btn-success" style={{ flex: 2 }} onClick={handleSave}>💾 Zapisz</button>
      </div>

      {showWorkModal && activeRoom && (
        <AddWorkModal user={user} roomType={activeRoom.roomType} includeMaterials={includeMaterials}
          onAdd={(items) => addItems(activeRoom.id, items)} onClose={() => { setShowWorkModal(false); setActiveRoomId(null); }} />
      )}
    </div>
  );
};

// ============ Estimates View ============
const EstimatesView: React.FC<{ user: UserData; onUpdate: () => void; onEdit: (e: Estimate | null) => void }> = ({ user, onUpdate, onEdit }) => {
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfEstimate, setPdfEstimate] = useState<Estimate | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Usunąć kosztorys?')) { mockApi.deleteEstimate(user.uniqueId, id); onUpdate(); }
  };

  const calcTotal = (e: Estimate): number => {
    let labor = 0, material = 0;
    for (const r of e.rooms) {
      for (const i of r.items) {
        if (i.category === 'labor') labor += i.quantity * i.pricePerUnit;
        else material += i.quantity * i.pricePerUnit;
      }
    }
    const laborDisc = labor * (e.laborDiscountPercent || 0) / 100;
    const matDisc = material * (e.materialDiscountPercent || 0) / 100;
    return (labor - laborDisc) + (e.includeMaterials ? (material - matDisc) : 0);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📊 Kosztorysy</h2>
          <button className="btn btn-primary btn-sm" onClick={() => onEdit(null)}>+ Nowy</button>
        </div>
      </div>
      {user.estimates.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <p>Brak kosztorysów</p>
            <button className="btn btn-primary mt-2" onClick={() => onEdit(null)}>Utwórz pierwszy</button>
          </div>
        </div>
      ) : (
        <div className="card">
          {user.estimates.map(e => (
            <div key={e.id} className="list-item">
              <div className="list-item-content">
                <div className="list-item-title">{e.clientName}</div>
                <div className="list-item-subtitle">
                  {e.projectDescription || 'Brak opisu'} • {e.rooms.length} pom. • 
                  <strong className="text-primary"> {calcTotal(e).toFixed(2)} zł</strong>
                </div>
                <div className="list-item-subtitle text-xs text-gray">{new Date(e.createdAt).toLocaleDateString('pl-PL')}</div>
              </div>
              <div className="list-item-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => { setPdfEstimate(e); setShowPDFModal(true); }}>📄</button>
                <button className="btn btn-ghost btn-sm" onClick={() => onEdit(e)}>✏️</button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(e.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showPDFModal && pdfEstimate && (
        <PDFExportModal estimate={pdfEstimate} companyName={user.username} onClose={() => { setShowPDFModal(false); setPdfEstimate(null); }} />
      )}
    </div>
  );
};

// ============ Settings View ============
const SettingsView: React.FC<{ user: UserData }> = memo(({ user }) => {
  const config = getApiConfig();
  const remaining = mockApi.getRemainingTime(user);
  const url = `${window.location.origin}${window.location.pathname}#${user.uniqueId}`;
  const copy = useCallback(() => { navigator.clipboard.writeText(url); alert('Skopiowano!'); }, [url]);

  return (
    <div>
      {remaining !== null && remaining > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--warning-light), #fef9c3)', border: '1px solid var(--warning)' }}>
          <div className="card-body">
            <h3 className="font-semibold mb-1" style={{ color: 'var(--warning)' }}>⏰ Konto tymczasowe</h3>
            <p className="text-sm" style={{ color: 'var(--gray-700)' }}>
              To konto demo zostanie automatycznie usunięte za <strong>{formatRemainingTime(remaining)}</strong>.
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--gray-600)' }}>
              Zapisz swój ID lub link, aby móc wrócić przed wygaśnięciem.
            </p>
          </div>
        </div>
      )}
      <div className="card">
        <div className="card-header"><h2 className="card-title">⚙️ Ustawienia</h2></div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Nazwa firmy</label>
            <input type="text" className="form-input" value={user.username} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Twój ID</label>
            <input type="text" className="form-input" value={user.uniqueId} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Link do konta</label>
            <div className="url-box">
              <code>{url}</code>
              <p>Zapisz ten link</p>
            </div>
            <button className="btn btn-primary btn-block mt-1" onClick={copy}>📋 Kopiuj</button>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h3 className="font-semibold mb-1">📊 Statystyki</h3>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-value">{user.itemTemplates.length}</div><div className="stat-label">Pozycje</div></div>
            <div className="stat-card"><div className="stat-value">{user.workTemplates.length}</div><div className="stat-label">Prace</div></div>
            <div className="stat-card"><div className="stat-value">{user.roomRenovationTemplates.length}</div><div className="stat-label">Remonty</div></div>
            <div className="stat-card"><div className="stat-value">{user.estimates.length}</div><div className="stat-label">Kosztorysy</div></div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body text-center text-xs text-gray">
          KosztorysPro v2.1<br/>Dane przechowywane lokalnie
          {config.retentionHours > 0 && <><br/>Retencja: {config.retentionHours}h</>}
        </div>
      </div>
    </div>
  );
});

// ============ Admin Panel ============
const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'user'>('list');

  const loadUsers = () => {
    const all = mockApi.getAllUsers();
    setUsers(Object.values(all));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const selectedUser = selectedUserId ? users.find(u => u.uniqueId === selectedUserId) || null : null;

  const deleteUser = (id: string) => {
    if (confirm('Usunąć użytkownika i wszystkie jego dane?')) {
      const all = mockApi.getAllUsers();
      delete all[id];
      localStorage.setItem('kosztorys_users', JSON.stringify(all));
      loadUsers();
      if (selectedUserId === id) { 
        setSelectedUserId(null); 
        setView('list'); 
      }
    }
  };

  const deleteEstimate = (userId: string, estimateId: string) => {
    if (confirm('Usunąć?')) { 
      mockApi.deleteEstimate(userId, estimateId); 
      loadUsers();
    }
  };

  const calcTotal = (e: Estimate): number => {
    let labor = 0, material = 0;
    for (const r of e.rooms) {
      for (const i of r.items) {
        if (i.category === 'labor') labor += i.quantity * i.pricePerUnit;
        else material += i.quantity * i.pricePerUnit;
      }
    }
    return labor + (e.includeMaterials ? material : 0);
  };

  if (view === 'user' && selectedUser) {
    return (
      <>
        <div className="admin-header">
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary btn-sm" onClick={() => { setView('list'); setSelectedUserId(null); }}>← Wróć</button>
            <span className="admin-badge">ADMIN</span>
          </div>
        </div>
        <div className="main">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">👤 {selectedUser.username}</h2>
              <span className="text-xs text-gray">ID: {selectedUser.uniqueId}</span>
            </div>
            <div className="card-body">
              <div className="stats-grid mb-2">
                <div className="stat-card"><div className="stat-value">{selectedUser.itemTemplates.length}</div><div className="stat-label">Pozycje</div></div>
                <div className="stat-card"><div className="stat-value">{selectedUser.workTemplates.length}</div><div className="stat-label">Prace</div></div>
                <div className="stat-card"><div className="stat-value">{selectedUser.roomRenovationTemplates.length}</div><div className="stat-label">Remonty</div></div>
                <div className="stat-card"><div className="stat-value">{selectedUser.estimates.length}</div><div className="stat-label">Kosztorysy</div></div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3 className="card-title">📊 Kosztorysy</h3></div>
            {selectedUser.estimates.length === 0 ? (
              <div className="empty-state"><p>Brak kosztorysów</p></div>
            ) : (
              <table className="admin-table">
                <thead><tr><th>Klient</th><th>Projekt</th><th>Pom.</th><th>Kwota</th><th>Data</th><th></th></tr></thead>
                <tbody>
                  {selectedUser.estimates.map(e => (
                    <tr key={e.id}>
                      <td>{e.clientName}</td>
                      <td>{e.projectDescription || '-'}</td>
                      <td>{e.rooms.length}</td>
                      <td className="text-primary font-medium">{calcTotal(e).toFixed(2)} zł</td>
                      <td>{new Date(e.createdAt).toLocaleDateString('pl-PL')}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => deleteEstimate(selectedUser.uniqueId, e.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="admin-header">
        <div className="flex items-center gap-2">
          <span className="admin-badge">PANEL ADMINISTRATORA</span>
          <span className="text-sm" style={{ color: 'var(--gray-400)' }}>KosztorysPro</span>
        </div>
      </div>
      <div className="main">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">👥 Użytkownicy ({users.length})</h2>
            <button className="btn btn-secondary btn-sm" onClick={loadUsers}>🔄 Odśwież</button>
          </div>
          {users.length === 0 ? (
            <div className="empty-state"><p>Brak użytkowników</p></div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Nazwa</th><th>ID</th><th>Kosztorysy</th><th>Utworzono</th><th></th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.uniqueId}>
                    <td className="font-medium">{u.username}</td>
                    <td className="text-xs text-gray">{u.uniqueId}</td>
                    <td>{u.estimates.length}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString('pl-PL')}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedUserId(u.uniqueId); setView('user'); }}>Szczegóły</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => deleteUser(u.uniqueId)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

// ============ Main App ============
type TabType = 'estimates' | 'templates' | 'settings';

const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [tab, setTab] = useState<TabType>('estimates');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  // Stan edytora kosztorysu przeniesiony do głównego komponentu
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
  const [showEstimateEditor, setShowEstimateEditor] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === 'admin') { setIsAdmin(true); return; }
    if (hash) {
      const u = mockApi.getUser(hash);
      if (u) setUser(u);
    }
  }, []);

  const handleLogin = (u: UserData) => {
    setUser(u);
    window.location.hash = u.uniqueId;
  };

  const handleUpdate = () => {
    if (user) {
      const updated = mockApi.getUser(user.uniqueId);
      if (updated) { setUser(updated); setRefreshKey(k => k + 1); }
    }
  };

  const handleEditEstimate = (estimate: Estimate | null) => {
    setEditingEstimate(estimate);
    setShowEstimateEditor(true);
  };

  const handleSaveEstimate = (e: Estimate) => {
    if (!user) return;
    if (editingEstimate) { 
      mockApi.updateEstimate(user.uniqueId, e.id, e); 
    } else { 
      mockApi.createEstimate(user.uniqueId, e); 
    }
    setShowEstimateEditor(false);
    setEditingEstimate(null);
    handleUpdate();
  };

  const handleCancelEdit = () => {
    setShowEstimateEditor(false);
    setEditingEstimate(null);
  };

  if (isAdmin) return <AdminPanel />;
  if (!user) return <Login onLogin={handleLogin} />;

  // Jeśli edytor jest otwarty, pokazuj go niezależnie od zakładki
  if (showEstimateEditor) {
    return (
      <>
        <div className="construction-stripe" />
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">📋</div>
              <div className="logo-text">Kosztorys<span>Pro</span></div>
            </div>
            <div className="user-info">👤 {user.username}</div>
          </div>
        </header>
        <main className="main">
          <EstimateEditor 
            user={user} 
            estimate={editingEstimate} 
            onSave={handleSaveEstimate} 
            onCancel={handleCancelEdit} 
          />
        </main>
      </>
    );
  }

  return (
    <>
      <div className="construction-stripe" />
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">📋</div>
            <div className="logo-text">Kosztorys<span>Pro</span></div>
          </div>
          <div className="flex items-center gap-1">
            <RetentionTimer user={user} />
            <div className="user-info">👤 {user.username}</div>
          </div>
        </div>
      </header>
      <nav className="nav">
        <div className="nav-tabs">
          <button className={`nav-tab ${tab === 'estimates' ? 'active' : ''}`} onClick={() => setTab('estimates')}>📊 Kosztorysy</button>
          <button className={`nav-tab ${tab === 'templates' ? 'active' : ''}`} onClick={() => setTab('templates')}>📋 Szablony</button>
          <button className={`nav-tab ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>⚙️ Ustawienia</button>
        </div>
      </nav>
      <main className="main" key={refreshKey}>
        {tab === 'estimates' && <EstimatesView user={user} onUpdate={handleUpdate} onEdit={handleEditEstimate} />}
        {tab === 'templates' && <TemplatesView user={user} onUpdate={handleUpdate} />}
        {tab === 'settings' && <SettingsView user={user} />}
      </main>
    </>
  );
};

export default App;
