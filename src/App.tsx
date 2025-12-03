import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { mockApi, getApiConfig } from './api';
import { 
  UserData, ItemTemplate, WorkTemplate, RoomRenovationTemplate,
  Estimate, EstimateItem, EstimateRoom, WorkMaterial,
  UnitType, RoomType, UNIT_LABELS, ROOM_LABELS, DEFAULT_ROOM_NAMES
} from './types';
import { generatePDF, PDFDetailLevel } from './pdfGenerator';
import { v4 as uuidv4 } from 'uuid';
import { SyncStatusIndicator } from './SyncComponents';
import { queueOperation, initSyncService } from './syncService';
import './i18n';
import { changeLanguage, SUPPORTED_LANGUAGES, getCurrentLanguage } from './i18n';

// Helper to format remaining time
const formatRemainingTime = (ms: number): string => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
};

// ============ Language Selector ============
const LanguageSelector: React.FC = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = getCurrentLanguage();
  const current = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="language-selector" style={{ position: 'relative' }}>
      <button 
        className="btn btn-ghost btn-sm" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ fontSize: '1rem', padding: '0.25rem 0.5rem' }}
      >
        {current.flag}
      </button>
      {isOpen && (
        <div className="language-dropdown" style={{
          position: 'absolute', top: '100%', right: 0, background: 'white',
          border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-md)', zIndex: 1000, minWidth: '120px'
        }}>
          {SUPPORTED_LANGUAGES.map(lang => (
            <button 
              key={lang.code}
              className="btn btn-ghost btn-sm w-full"
              style={{ justifyContent: 'flex-start', borderRadius: 0 }}
              onClick={() => { changeLanguage(lang.code); setIsOpen(false); }}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

// ============ Login Component ============
const Login: React.FC<{ onLogin: (user: UserData) => void }> = memo(({ onLogin }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [existingId, setExistingId] = useState('');
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [useDefaultData, setUseDefaultData] = useState(true);
  const [error, setError] = useState('');
  const config = getApiConfig();

  const handleCreate = useCallback(() => {
    if (!username.trim()) { setError(t('login.enterUsername')); return; }
    const user = mockApi.createUser(username.trim(), useDefaultData);
    onLogin(user);
  }, [username, useDefaultData, onLogin, t]);

  const handleLogin = useCallback(() => {
    if (!existingId.trim()) { setError(t('login.enterId')); return; }
    const user = mockApi.getUser(existingId.trim());
    if (!user) { setError(t('login.userNotFound')); return; }
    onLogin(user);
  }, [existingId, onLogin, t]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <LanguageSelector />
        </div>
        <div className="login-logo">
          <div className="login-logo-icon">📋</div>
          <h1 className="login-title">{t('appName')}</h1>
          <p className="login-subtitle">{t('appSubtitle')}</p>
        </div>
        
        {config.retentionHours > 0 && (
          <div className="retention-notice">
            ⏰ {t('login.demoNotice', { hours: config.retentionHours })}
          </div>
        )}
        
        <div className="tabs mb-2">
          <button className={`tab ${mode === 'new' ? 'active' : ''}`} onClick={() => setMode('new')}>
            {t('login.newAccount')}
          </button>
          <button className={`tab ${mode === 'existing' ? 'active' : ''}`} onClick={() => setMode('existing')}>
            {t('login.existingAccount')}
          </button>
        </div>
        {mode === 'new' ? (
          <>
            <div className="form-group">
              <label className="form-label">{t('login.companyName')}</label>
              <input type="text" className="form-input" placeholder={t('login.companyPlaceholder')}
                value={username} onChange={(e) => { setUsername(e.target.value); setError(''); }} />
            </div>
            
            <div className="form-group">
              <label className="form-label">{t('login.accountType')}</label>
              <div className="account-type-options">
                <label className={`account-type-option ${useDefaultData ? 'active' : ''}`}>
                  <input type="radio" checked={useDefaultData} onChange={() => setUseDefaultData(true)} />
                  <div className="account-type-content">
                    <span className="account-type-icon">📦</span>
                    <div>
                      <strong>{t('login.withSampleData')}</strong>
                      <p>{t('login.sampleDataDesc')}</p>
                    </div>
                  </div>
                </label>
                <label className={`account-type-option ${!useDefaultData ? 'active' : ''}`}>
                  <input type="radio" checked={!useDefaultData} onChange={() => setUseDefaultData(false)} />
                  <div className="account-type-content">
                    <span className="account-type-icon">✨</span>
                    <div>
                      <strong>{t('login.emptyAccount')}</strong>
                      <p>{t('login.emptyAccountDesc')}</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            <button className="btn btn-primary btn-block" onClick={handleCreate}>{t('login.start')}</button>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">{t('login.yourId')}</label>
              <input type="text" className="form-input" placeholder={t('login.idPlaceholder')}
                value={existingId} onChange={(e) => { setExistingId(e.target.value); setError(''); }} />
            </div>
            <button className="btn btn-primary btn-block" onClick={handleLogin}>{t('login.login')}</button>
          </>
        )}
        {error && <p className="text-danger text-center mt-1" style={{ fontSize: '0.875rem' }}>{error}</p>}
      </div>
    </div>
  );
});

// ============ Search Input ============
const SearchInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = 
  memo(({ value, onChange, placeholder }) => {
  const { t } = useTranslation();
  return (
  <div className="search-input mb-1">
    <span className="search-input-icon">🔍</span>
    <input type="text" className="form-input" style={{ paddingLeft: '2.25rem' }}
      placeholder={placeholder || t('common.search')} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
  );
});

// ============ Retention Timer Component ============
const RetentionTimer: React.FC<{ user: UserData }> = memo(({ user }) => {
  const { t } = useTranslation();
  const [remaining, setRemaining] = useState<number | null>(mockApi.getRemainingTime(user));
  
  useEffect(() => {
    if (remaining === null) return;
    const interval = setInterval(() => {
      setRemaining(mockApi.getRemainingTime(user));
    }, 60000);
    return () => clearInterval(interval);
  }, [user]);
  
  if (remaining === null || remaining <= 0) return null;
  
  const isLow = remaining < 2 * 60 * 60 * 1000;
  
  return (
    <div className={`retention-timer ${isLow ? 'low' : ''}`}>
      ⏰ {t('settings.remaining')} {formatRemainingTime(remaining)}
    </div>
  );
});

// ============ Item Template Modal ============
const ItemTemplateModal: React.FC<{
  template?: ItemTemplate | null;
  onSave: (t: Omit<ItemTemplate, 'id'>) => void;
  onClose: () => void;
}> = memo(({ template, onSave, onClose }) => {
  const { t } = useTranslation();
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
          <h3 className="modal-title">{template ? t('templates.editItem') : t('templates.newItem')}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{t('common.name')}</label>
            <input type="text" className="form-input" placeholder={t('templates.workNamePlaceholder')}
              value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('common.category')}</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value as any)}>
                <option value="labor">{t('common.labor')}</option>
                <option value="material">{t('common.material')}</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('common.unit')}</label>
              <select className="form-select" value={unit} onChange={(e) => setUnit(e.target.value as UnitType)}>
                {Object.entries(UNIT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('common.price')} ({t('common.currency')})</label>
            <input type="number" className="form-input" placeholder="0.00"
              value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t('common.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{t('common.save')}</button>
        </div>
      </div>
    </div>
  );
});

// Work item type in work template (labor or material)
interface WorkItem {
  itemTemplateId: string;
  quantityPerUnit: number;
  category: 'labor' | 'material';
}

// ============ Work Template Modal (with inline item creation) ============
const WorkTemplateModal: React.FC<{
  user: UserData;
  template?: WorkTemplate | null;
  onSave: (t: Omit<WorkTemplate, 'id'>) => void;
  onClose: () => void;
  onUserUpdate?: () => void;
}> = memo(({ user, template, onSave, onClose, onUserUpdate }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(template?.name || '');
  const [unit, setUnit] = useState<UnitType>(template?.unit || 'm2');
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(template?.roomTypes || ['salon']);
  const [showInlineItemModal, setShowInlineItemModal] = useState(false);
  const [inlineItemCategory, setInlineItemCategory] = useState<'labor' | 'material'>('material');
  
  const buildInitialItems = (): WorkItem[] => {
    const items: WorkItem[] = [];
    if (template) {
      if (template.laborItemId) {
        items.push({ itemTemplateId: template.laborItemId, quantityPerUnit: 1, category: 'labor' });
      }
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
    if (items.some(i => i.itemTemplateId === newItemId)) {
      alert(t('templates.itemAlreadyAdded'));
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

  const handleInlineItemSave = (itemData: Omit<ItemTemplate, 'id'>) => {
    const newItem = mockApi.addItemTemplate(user.uniqueId, itemData);
    if (newItem && onUserUpdate) {
      onUserUpdate();
      setNewItemId(newItem.id);
    }
    setShowInlineItemModal(false);
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
      alert(t('templates.roomsRequired'));
      return;
    }
    
    const laborItem = items.find(i => i.category === 'labor');
    const laborTemplate = laborItem ? user.itemTemplates.find(t => t.id === laborItem.itemTemplateId) : null;
    
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

  const laborItemsInWork = items.filter(i => i.category === 'labor');
  const materialItemsInWork = items.filter(i => i.category === 'material');
  
  const calcLaborTotal = () => laborItemsInWork.reduce((sum, item) => {
    const template = user.itemTemplates.find(t => t.id === item.itemTemplateId);
    return sum + (template?.pricePerUnit || 0) * item.quantityPerUnit;
  }, 0);
  
  const calcMaterialTotal = () => materialItemsInWork.reduce((sum, item) => {
    const template = user.itemTemplates.find(t => t.id === item.itemTemplateId);
    return sum + (template?.pricePerUnit || 0) * item.quantityPerUnit;
  }, 0);

  return (
    <>
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3 className="modal-title">{template ? t('templates.editWork') : t('templates.newWork')}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{t('templates.workName')} *</label>
            <input type="text" className="form-input" placeholder={t('templates.workNamePlaceholder')}
              value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('templates.workUnit')}</label>
              <select className="form-select" value={unit} onChange={(e) => setUnit(e.target.value as UnitType)}>
                {Object.entries(UNIT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">{t('templates.rooms')} *</label>
            <div className="filter-pills">
              {Object.entries(ROOM_LABELS).map(([k, v]) => (
                <button key={k} className={`filter-pill ${roomTypes.includes(k as RoomType) ? 'active' : ''}`}
                  onClick={() => toggleRoomType(k as RoomType)}>{v}</button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">{t('templates.itemsInWork')} ({t('templates.perUnit')} {UNIT_LABELS[unit]})</label>
            
            {laborItemsInWork.length > 0 && (
              <div style={{ background: 'var(--accent-50)', padding: '0.5rem', borderRadius: 'var(--radius)', marginBottom: '0.5rem' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent-600)' }}>🔧 {t('common.labor').toUpperCase()}</p>
                {laborItemsInWork.map((item) => {
                  const itemIdx = items.indexOf(item);
                  const itemTemplate = user.itemTemplates.find(t => t.id === item.itemTemplateId);
                  return (
                    <div key={item.itemTemplateId} className="flex items-center gap-1 mb-1" style={{ background: 'white', padding: '0.375rem', borderRadius: 'var(--radius)' }}>
                      <span className="flex-1 text-sm">{itemTemplate?.name || '?'}</span>
                      <input type="number" className="form-input" style={{ width: '50px' }} 
                        value={item.quantityPerUnit} 
                        onChange={(e) => updateItemQty(itemIdx, parseFloat(e.target.value) || 0)}
                        min="0.01" step="0.01" />
                      <span className="text-xs text-gray">{itemTemplate ? UNIT_LABELS[itemTemplate.unit] : ''}</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => removeItem(itemIdx)}>×</button>
                    </div>
                  );
                })}
              </div>
            )}
            
            {materialItemsInWork.length > 0 && (
              <div style={{ background: 'var(--gray-50)', padding: '0.5rem', borderRadius: 'var(--radius)', marginBottom: '0.5rem' }}>
                <p className="text-xs font-semibold mb-1 text-gray">📦 {t('common.materials').toUpperCase()}</p>
                {materialItemsInWork.map((item) => {
                  const itemIdx = items.indexOf(item);
                  const itemTemplate = user.itemTemplates.find(t => t.id === item.itemTemplateId);
                  return (
                    <div key={item.itemTemplateId} className="flex items-center gap-1 mb-1" style={{ background: 'white', padding: '0.375rem', borderRadius: 'var(--radius)' }}>
                      <span className="flex-1 text-sm">{itemTemplate?.name || '?'}</span>
                      <input type="number" className="form-input" style={{ width: '50px' }} 
                        value={item.quantityPerUnit} 
                        onChange={(e) => updateItemQty(itemIdx, parseFloat(e.target.value) || 0)}
                        min="0.01" step="0.01" />
                      <span className="text-xs text-gray">{itemTemplate ? UNIT_LABELS[itemTemplate.unit] : ''}</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => removeItem(itemIdx)}>×</button>
                    </div>
                  );
                })}
              </div>
            )}
            
            {items.length === 0 && (
              <div style={{ background: 'var(--gray-50)', padding: '0.75rem', borderRadius: 'var(--radius)', textAlign: 'center', marginBottom: '0.5rem' }}>
                <p className="text-sm text-gray">{t('templates.addItems')}</p>
              </div>
            )}
            
            <div style={{ background: 'var(--gray-100)', padding: '0.5rem', borderRadius: 'var(--radius)' }}>
              <div className="flex gap-1 mb-1">
                <button 
                  className={`filter-pill ${newItemCategory === 'labor' ? 'active' : ''}`}
                  onClick={() => { setNewItemCategory('labor'); setNewItemId(''); }}
                  style={{ fontSize: '0.7rem' }}
                >🔧 {t('common.labor')}</button>
                <button 
                  className={`filter-pill ${newItemCategory === 'material' ? 'active' : ''}`}
                  onClick={() => { setNewItemCategory('material'); setNewItemId(''); }}
                  style={{ fontSize: '0.7rem' }}
                >📦 {t('common.material')}</button>
              </div>
              <div className="flex gap-1">
                <select className="form-select" style={{ flex: 2 }} value={newItemId}
                  onChange={(e) => setNewItemId(e.target.value)}>
                  <option value="">{t('templates.selectItem')}...</option>
                  {allItems.map(item => (
                    <option key={item.id} value={item.id} disabled={items.some(i => i.itemTemplateId === item.id)}>
                      {item.name} ({item.pricePerUnit} {t('common.currency')}/{UNIT_LABELS[item.unit]})
                    </option>
                  ))}
                </select>
                <input type="number" className="form-input" style={{ width: '50px' }}
                  value={newItemQty} onChange={(e) => setNewItemQty(e.target.value)} min="0.01" step="0.01" />
                <button className="btn btn-primary btn-sm" onClick={addItem} disabled={!newItemId}>+</button>
              </div>
              {allItems.length === 0 && (
                <button className="btn btn-secondary btn-sm w-full mt-1" 
                  onClick={() => { setInlineItemCategory(newItemCategory); setShowInlineItemModal(true); }}>
                  {t('common.createNew')}
                </button>
              )}
              {allItems.length > 0 && (
                <button className="btn btn-ghost btn-sm w-full mt-1" style={{ fontSize: '0.7rem' }}
                  onClick={() => { setInlineItemCategory(newItemCategory); setShowInlineItemModal(true); }}>
                  {t('templates.orCreateNew')}
                </button>
              )}
            </div>
          </div>
          
          {items.length > 0 && (
            <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: 'var(--radius)', marginTop: '0.75rem' }}>
              <div className="flex justify-between text-sm">
                <span>{t('common.labor')}:</span>
                <span>{calcLaborTotal().toFixed(2)} {t('common.currency')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t('common.materials')}:</span>
                <span>{calcMaterialTotal().toFixed(2)} {t('common.currency')}</span>
              </div>
              <div className="flex justify-between font-semibold" style={{ marginTop: '0.25rem', paddingTop: '0.25rem', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
                <span>{t('common.total')} / {UNIT_LABELS[unit]}:</span>
                <span>{(calcLaborTotal() + calcMaterialTotal()).toFixed(2)} {t('common.currency')}</span>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t('common.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{t('templates.saveTemplate')}</button>
        </div>
      </div>
    </div>
    {showInlineItemModal && (
      <ItemTemplateModal 
        template={{ id: '', name: '', unit: 'm2', pricePerUnit: 0, category: inlineItemCategory }}
        onSave={handleInlineItemSave}
        onClose={() => setShowInlineItemModal(false)}
      />
    )}
    </>
  );
});

// ============ Renovation Template Modal (with inline work creation) ============
const RenovationTemplateModal: React.FC<{
  user: UserData;
  template?: RoomRenovationTemplate | null;
  onSave: (t: Omit<RoomRenovationTemplate, 'id'>) => void;
  onClose: () => void;
  onUserUpdate?: () => void;
}> = memo(({ user, template, onSave, onClose, onUserUpdate }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(template?.name || '');
  const [roomType, setRoomType] = useState<RoomType>(template?.roomType || 'salon');
  const [description, setDescription] = useState(template?.description || '');
  const [works, setWorks] = useState<{ workTemplateId: string; defaultQuantity: number }[]>(template?.works || []);
  const [newWorkId, setNewWorkId] = useState('');
  const [newWorkQty, setNewWorkQty] = useState('10');
  const [showInlineWorkModal, setShowInlineWorkModal] = useState(false);

  const availableWorks = user.workTemplates.filter(w => w.roomTypes.includes(roomType));

  const addWork = () => {
    if (!newWorkId || !newWorkQty) return;
    setWorks([...works, { workTemplateId: newWorkId, defaultQuantity: parseFloat(newWorkQty) }]);
    setNewWorkId('');
    setNewWorkQty('10');
  };

  const handleInlineWorkSave = (workData: Omit<WorkTemplate, 'id'>) => {
    const newWork = mockApi.addWorkTemplate(user.uniqueId, { ...workData, roomTypes: [roomType] });
    if (newWork && onUserUpdate) {
      onUserUpdate();
      setNewWorkId(newWork.id);
    }
    setShowInlineWorkModal(false);
  };

  const removeWork = (idx: number) => setWorks(works.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!name.trim() || works.length === 0) return;
    onSave({ name: name.trim(), roomType, description: description.trim(), works });
  };

  return (
    <>
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3 className="modal-title">{template ? t('templates.editRenovation') : t('templates.newRenovation')}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{t('templates.templateName')}</label>
            <input type="text" className="form-input" placeholder={t('templates.templateNamePlaceholder')}
              value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('templates.roomType')}</label>
              <select className="form-select" value={roomType} onChange={(e) => setRoomType(e.target.value as RoomType)}>
                {Object.entries(ROOM_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('common.description')}</label>
            <input type="text" className="form-input" placeholder="..."
              value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          
          <div className="form-group">
            <label className="form-label">{t('templates.worksInTemplate')}</label>
            {works.map((w, idx) => {
              const work = user.workTemplates.find(wt => wt.id === w.workTemplateId);
              return (
                <div key={idx} className="flex items-center gap-1 mb-1" style={{ background: 'var(--gray-50)', padding: '0.375rem', borderRadius: 'var(--radius)' }}>
                  <span className="flex-1 text-sm">{work?.name || '?'}</span>
                  <span className="text-xs text-gray">{w.defaultQuantity} {work ? UNIT_LABELS[work.unit] : ''}</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeWork(idx)}>×</button>
                </div>
              );
            })}
            <div className="flex gap-1 mt-1">
              <select className="form-select" style={{ flex: 2 }} value={newWorkId}
                onChange={(e) => setNewWorkId(e.target.value)}>
                <option value="">{t('templates.selectWork')}</option>
                {availableWorks.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              <input type="number" className="form-input" style={{ width: '60px' }}
                value={newWorkQty} onChange={(e) => setNewWorkQty(e.target.value)} min="0.1" step="0.1" />
              <button className="btn btn-primary btn-sm" onClick={addWork} disabled={!newWorkId}>+</button>
            </div>
            {availableWorks.length === 0 && (
              <button className="btn btn-secondary btn-sm w-full mt-1" onClick={() => setShowInlineWorkModal(true)}>
                {t('common.createNew')}
              </button>
            )}
            {availableWorks.length > 0 && (
              <button className="btn btn-ghost btn-sm w-full mt-1" style={{ fontSize: '0.7rem' }}
                onClick={() => setShowInlineWorkModal(true)}>
                {t('templates.orCreateNew')}
              </button>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t('common.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{t('common.save')}</button>
        </div>
      </div>
    </div>
    {showInlineWorkModal && (
      <WorkTemplateModal 
        user={user}
        template={{ id: '', name: '', unit: 'm2', laborPrice: 0, materials: [], roomTypes: [roomType] }}
        onSave={handleInlineWorkSave}
        onClose={() => setShowInlineWorkModal(false)}
        onUserUpdate={onUserUpdate}
      />
    )}
    </>
  );
});

// ============ Item Templates View ============
const ItemTemplatesView: React.FC<{ user: UserData; onUpdate: () => void }> = memo(({ user, onUpdate }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ItemTemplate | null>(null);
  const [filter, setFilter] = useState<'all' | 'labor' | 'material'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => user.itemTemplates.filter(item => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
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
    if (confirm(t('common.confirmDelete'))) {
      mockApi.deleteItemTemplate(user.uniqueId, id);
      onUpdate();
    }
  }, [user.uniqueId, onUpdate, t]);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📦 {t('templates.itemTemplates')}</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ {t('common.add')}</button>
        </div>
        <div className="card-body">
          <SearchInput value={search} onChange={setSearch} />
          <div className="filter-pills">
            <button className={`filter-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              {t('common.all')} ({user.itemTemplates.length})
            </button>
            <button className={`filter-pill ${filter === 'labor' ? 'active' : ''}`} onClick={() => setFilter('labor')}>
              {t('common.labor')}
            </button>
            <button className={`filter-pill ${filter === 'material' ? 'active' : ''}`} onClick={() => setFilter('material')}>
              {t('common.materials')}
            </button>
          </div>
        </div>
      </div>
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📦</div><p>{t('common.noItems')}</p></div>
        ) : filtered.map(item => (
          <div key={item.id} className="list-item">
            <div className="list-item-content">
              <div className="list-item-title">{item.name}</div>
              <div className="list-item-subtitle">
                <span className={`badge badge-${item.category}`}>{item.category === 'labor' ? t('common.labor') : t('common.material')}</span>
                {' '}{item.pricePerUnit.toFixed(2)} {t('common.currency')}/{UNIT_LABELS[item.unit]}
              </div>
            </div>
            <div className="list-item-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(item); setShowModal(true); }}>✏️</button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(item.id)}>🗑️</button>
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
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<WorkTemplate | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => user.workTemplates.filter(work => {
    const matchesRoom = selectedRoom === 'all' || work.roomTypes.includes(selectedRoom as RoomType);
    const matchesSearch = work.name.toLowerCase().includes(search.toLowerCase());
    return matchesRoom && matchesSearch;
  }), [user.workTemplates, selectedRoom, search]);

  const getMaterialsInfo = useCallback((w: WorkTemplate): string => {
    if (w.materials.length === 0) return t('templates.noMaterials');
    return w.materials.map(m => user.itemTemplates.find(item => item.id === m.itemTemplateId)?.name || '?').join(', ');
  }, [user.itemTemplates, t]);

  const calcTotal = useCallback((w: WorkTemplate): number => {
    let total = w.laborPrice;
    for (const m of w.materials) {
      const item = user.itemTemplates.find(i => i.id === m.itemTemplateId);
      if (item) total += item.pricePerUnit * m.quantityPerUnit;
    }
    return total;
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
    if (confirm(t('common.confirmDelete'))) {
      mockApi.deleteWorkTemplate(user.uniqueId, id);
      onUpdate();
    }
  }, [user.uniqueId, onUpdate, t]);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🔧 {t('templates.workTemplates')}</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ {t('common.add')}</button>
        </div>
        <div className="card-body">
          <SearchInput value={search} onChange={setSearch} />
          <div className="filter-pills">
            <button className={`filter-pill ${selectedRoom === 'all' ? 'active' : ''}`} onClick={() => setSelectedRoom('all')}>{t('common.all')}</button>
            {Object.entries(ROOM_LABELS).map(([k, v]) => (
              <button key={k} className={`filter-pill ${selectedRoom === k ? 'active' : ''}`} onClick={() => setSelectedRoom(k as RoomType)}>{v}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🔧</div><p>{t('common.noItems')}</p></div>
        ) : filtered.map(w => (
          <div key={w.id} className="list-item">
            <div className="list-item-content">
              <div className="list-item-title">{w.name}</div>
              <div className="list-item-subtitle">{t('common.labor')}: {w.laborPrice.toFixed(2)} {t('common.currency')}/{UNIT_LABELS[w.unit]}</div>
              <div className="list-item-subtitle text-xs text-gray">{t('common.materials')}: {getMaterialsInfo(w)}</div>
              <div className="list-item-subtitle"><strong className="text-primary">{t('common.total')}: {calcTotal(w).toFixed(2)} {t('common.currency')}/{UNIT_LABELS[w.unit]}</strong></div>
            </div>
            <div className="list-item-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(w); setShowModal(true); }}>✏️</button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(w.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {showModal && <WorkTemplateModal user={user} template={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} onUserUpdate={onUpdate} />}
    </div>
  );
});

// ============ Renovation Templates View ============
const RenovationTemplatesView: React.FC<{ user: UserData; onUpdate: () => void }> = memo(({ user, onUpdate }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<RoomRenovationTemplate | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => user.roomRenovationTemplates.filter(template => {
    const matchesRoom = selectedRoom === 'all' || template.roomType === selectedRoom;
    const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase());
    return matchesRoom && matchesSearch;
  }), [user.roomRenovationTemplates, selectedRoom, search]);

  const calcTotal = useCallback((template: RoomRenovationTemplate): number => {
    let total = 0;
    for (const wr of template.works) {
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
    if (confirm(t('common.confirmDelete'))) {
      mockApi.deleteRenovationTemplate(user.uniqueId, id);
      onUpdate();
    }
  }, [user.uniqueId, onUpdate, t]);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🏠 {t('templates.renovationTemplates')}</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ {t('common.add')}</button>
        </div>
        <div className="card-body">
          <SearchInput value={search} onChange={setSearch} />
          <div className="filter-pills">
            <button className={`filter-pill ${selectedRoom === 'all' ? 'active' : ''}`} onClick={() => setSelectedRoom('all')}>{t('common.all')}</button>
            {Object.entries(ROOM_LABELS).map(([k, v]) => (
              <button key={k} className={`filter-pill ${selectedRoom === k ? 'active' : ''}`} onClick={() => setSelectedRoom(k as RoomType)}>{v}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🏠</div><p>{t('common.noItems')}</p></div>
        ) : filtered.map(template => (
          <div key={template.id} className="list-item">
            <div className="list-item-content">
              <div className="list-item-title">{template.name}</div>
              <div className="list-item-subtitle"><span className="badge badge-primary">{ROOM_LABELS[template.roomType]}</span></div>
              <div className="list-item-subtitle text-xs text-gray">{template.description}</div>
              <div className="list-item-subtitle">{template.works.length} {t('templates.works').toLowerCase()} • <strong className="text-primary">~{calcTotal(template).toFixed(0)} {t('common.currency')}</strong></div>
            </div>
            <div className="list-item-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(template); setShowModal(true); }}>✏️</button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(template.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {showModal && <RenovationTemplateModal user={user} template={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} onUserUpdate={onUpdate} />}
    </div>
  );
});

// ============ Templates View ============
const TemplatesView: React.FC<{ user: UserData; onUpdate: () => void }> = memo(({ user, onUpdate }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'items' | 'works' | 'renovations'>('items');

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="tabs">
            <button className={`tab ${tab === 'items' ? 'active' : ''}`} onClick={() => setTab('items')}>📦 {t('templates.items')}</button>
            <button className={`tab ${tab === 'works' ? 'active' : ''}`} onClick={() => setTab('works')}>🔧 {t('templates.works')}</button>
            <button className={`tab ${tab === 'renovations' ? 'active' : ''}`} onClick={() => setTab('renovations')}>🏠 {t('templates.renovations')}</button>
          </div>
        </div>
      </div>
      {tab === 'items' && <ItemTemplatesView user={user} onUpdate={onUpdate} />}
      {tab === 'works' && <WorkTemplatesView user={user} onUpdate={onUpdate} />}
      {tab === 'renovations' && <RenovationTemplatesView user={user} onUpdate={onUpdate} />}
    </div>
  );
});

// ============ Add Work Modal (with inline work creation) ============
const AddWorkModal: React.FC<{
  user: UserData;
  roomType: RoomType;
  includeMaterials: boolean;
  onAdd: (items: EstimateItem[]) => void;
  onClose: () => void;
  onUserUpdate?: () => void;
}> = ({ user, roomType, includeMaterials, onAdd, onClose, onUserUpdate }) => {
  const { t } = useTranslation();
  const [selectedWork, setSelectedWork] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [preview, setPreview] = useState<EstimateItem[]>([]);
  const [showInlineWorkModal, setShowInlineWorkModal] = useState(false);

  const available = user.workTemplates.filter(w => w.roomTypes.includes(roomType));

  useEffect(() => {
    if (!selectedWork || !quantity) { setPreview([]); return; }
    const work = user.workTemplates.find(w => w.id === selectedWork);
    if (!work) return;
    const qty = parseFloat(quantity) || 0;
    const items: EstimateItem[] = [];
    const workGroupId = uuidv4();
    
    items.push({
      id: uuidv4(), templateId: work.id, name: work.name, unit: work.unit,
      quantity: qty, pricePerUnit: work.laborPrice, category: 'labor',
      workId: workGroupId, workName: work.name
    });
    
    if (includeMaterials) {
      for (const m of work.materials) {
        const item = user.itemTemplates.find(it => it.id === m.itemTemplateId);
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

  const handleInlineWorkSave = (workData: Omit<WorkTemplate, 'id'>) => {
    const newWork = mockApi.addWorkTemplate(user.uniqueId, { ...workData, roomTypes: [roomType] });
    if (newWork && onUserUpdate) {
      onUserUpdate();
      setSelectedWork(newWork.id);
    }
    setShowInlineWorkModal(false);
  };

  const updateQty = (id: string, v: number) => setPreview(p => p.map(i => i.id === id ? { ...i, quantity: v } : i));
  const updatePrice = (id: string, v: number) => setPreview(p => p.map(i => i.id === id ? { ...i, pricePerUnit: v } : i));
  const remove = (id: string) => setPreview(p => p.filter(i => i.id !== id));
  const total = preview.reduce((s, i) => s + i.quantity * i.pricePerUnit, 0);

  return (
    <>
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3 className="modal-title">{t('estimates.addWorkTitle')} - {ROOM_LABELS[roomType]}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{t('estimates.selectWork')}</label>
            <select className="form-select" value={selectedWork} onChange={(e) => setSelectedWork(e.target.value)}>
              <option value="">-- {t('templates.selectWork')} --</option>
              {available.map(w => <option key={w.id} value={w.id}>{w.name} ({w.laborPrice} {t('common.currency')}/{UNIT_LABELS[w.unit]})</option>)}
            </select>
            {available.length === 0 && (
              <button className="btn btn-secondary btn-sm w-full mt-1" onClick={() => setShowInlineWorkModal(true)}>
                {t('common.createNew')}
              </button>
            )}
            {available.length > 0 && (
              <button className="btn btn-ghost btn-sm w-full mt-1" style={{ fontSize: '0.7rem' }}
                onClick={() => setShowInlineWorkModal(true)}>
                {t('templates.orCreateNew')}
              </button>
            )}
          </div>
          {selectedWork && (
            <div className="form-group">
              <label className="form-label">{t('estimates.workQuantity')} ({UNIT_LABELS[user.workTemplates.find(w => w.id === selectedWork)?.unit || 'm2']})</label>
              <input type="number" className="form-input" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="0.1" step="0.1" />
            </div>
          )}
          {preview.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">{t('estimates.itemsToAdd')}</p>
              {preview.filter(i => i.category === 'labor').length > 0 && (
                <div style={{ background: 'var(--accent-50)', padding: '0.5rem', borderRadius: 'var(--radius)', marginBottom: '0.5rem' }}>
                  <p className="text-xs font-semibold" style={{ color: 'var(--accent-600)' }}>{t('common.labor').toUpperCase()}</p>
                  {preview.filter(i => i.category === 'labor').map(item => (
                    <div key={item.id} className="item-row">
                      <span className="item-row-name">{item.name}</span>
                      <input type="number" className="item-row-input" value={item.quantity} onChange={(e) => updateQty(item.id, parseFloat(e.target.value) || 0)} />
                      <span className="item-row-unit">{UNIT_LABELS[item.unit]}</span>
                      <span>×</span>
                      <input type="number" className="item-row-input" value={item.pricePerUnit} onChange={(e) => updatePrice(item.id, parseFloat(e.target.value) || 0)} />
                      <span className="text-xs">{t('common.currency')}</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => remove(item.id)}>×</button>
                    </div>
                  ))}
                </div>
              )}
              {preview.filter(i => i.category === 'material').length > 0 && (
                <div style={{ background: 'var(--gray-50)', padding: '0.5rem', borderRadius: 'var(--radius)' }}>
                  <p className="text-xs font-semibold text-gray">{t('common.materials').toUpperCase()}</p>
                  {preview.filter(i => i.category === 'material').map(item => (
                    <div key={item.id} className="item-row">
                      <span className="item-row-name">{item.name}</span>
                      <input type="number" className="item-row-input" value={item.quantity} onChange={(e) => updateQty(item.id, parseFloat(e.target.value) || 0)} />
                      <span className="item-row-unit">{UNIT_LABELS[item.unit]}</span>
                      <span>×</span>
                      <input type="number" className="item-row-input" value={item.pricePerUnit} onChange={(e) => updatePrice(item.id, parseFloat(e.target.value) || 0)} />
                      <span className="text-xs">{t('common.currency')}</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => remove(item.id)}>×</button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-right mt-1 font-semibold text-primary">{t('common.total')}: {total.toFixed(2)} {t('common.currency')}</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t('common.cancel')}</button>
          <button className="btn btn-primary" onClick={() => preview.length > 0 && onAdd(preview)} disabled={preview.length === 0}>{t('common.add')}</button>
        </div>
      </div>
    </div>
    {showInlineWorkModal && (
      <WorkTemplateModal 
        user={user}
        template={{ id: '', name: '', unit: 'm2', laborPrice: 0, materials: [], roomTypes: [roomType] }}
        onSave={handleInlineWorkSave}
        onClose={() => setShowInlineWorkModal(false)}
        onUserUpdate={onUserUpdate}
      />
    )}
    </>
  );
};

// ============ PDF Export Modal ============
const PDFExportModal: React.FC<{
  estimate: Estimate;
  user: UserData;
  onClose: () => void;
}> = ({ estimate, user, onClose }) => {
  const { t } = useTranslation();
  const [detailLevel, setDetailLevel] = useState<PDFDetailLevel>('standard');

  const handleExport = () => {
    generatePDF(
      estimate, 
      user.username, 
      { detailLevel, showMaterials: estimate.includeMaterials },
      { companyName: user.companyName, phoneNumber: user.phoneNumber }
    );
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3 className="modal-title">{t('pdf.export')}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">{t('pdf.detailLevel')}</label>
            <div className="flex flex-col gap-1">
              <label className="form-checkbox">
                <input type="radio" name="detail" checked={detailLevel === 'simple'} onChange={() => setDetailLevel('simple')} />
                <div><strong>{t('pdf.simple')}</strong><br/><span className="text-xs text-gray">{t('pdf.simpleDesc')}</span></div>
              </label>
              <label className="form-checkbox">
                <input type="radio" name="detail" checked={detailLevel === 'standard'} onChange={() => setDetailLevel('standard')} />
                <div><strong>{t('pdf.standard')}</strong><br/><span className="text-xs text-gray">{t('pdf.standardDesc')}</span></div>
              </label>
              <label className="form-checkbox">
                <input type="radio" name="detail" checked={detailLevel === 'detailed'} onChange={() => setDetailLevel('detailed')} />
                <div><strong>{t('pdf.detailed')}</strong><br/><span className="text-xs text-gray">{t('pdf.detailedDesc')}</span></div>
              </label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t('common.cancel')}</button>
          <button className="btn btn-primary" onClick={handleExport}>📄 {t('pdf.download')}</button>
        </div>
      </div>
    </div>
  );
};

// ============ Estimate Editor (Wizard) ============
const EstimateEditor: React.FC<{
  user: UserData;
  estimate?: Estimate | null;
  onSave: (e: Estimate) => void;
  onCancel: () => void;
  onUserUpdate?: () => void;
}> = ({ user, estimate, onSave, onCancel, onUserUpdate }) => {
  const { t } = useTranslation();
  const isEditing = !!estimate;
  
  // Wizard step (1-4)
  const [step, setStep] = useState(isEditing ? 4 : 1);
  
  // Step 1: Client data
  const [clientName, setClientName] = useState(estimate?.clientName || '');
  const [clientAddress, setClientAddress] = useState(estimate?.clientAddress || '');
  const [projectDescription, setProjectDescription] = useState(estimate?.projectDescription || '');
  
  // Step 2-3: Rooms
  const [rooms, setRooms] = useState<EstimateRoom[]>(estimate?.rooms || []);
  const [includeMaterials, setIncludeMaterials] = useState(estimate?.includeMaterials ?? true);
  
  // Step 4: Summary & options
  const [laborDiscount, setLaborDiscount] = useState(estimate?.laborDiscountPercent?.toString() || '0');
  const [materialDiscount, setMaterialDiscount] = useState(estimate?.materialDiscountPercent?.toString() || '0');
  const [notes, setNotes] = useState(estimate?.notes || '');
  
  // Room adding state
  const [newRoomType, setNewRoomType] = useState<RoomType>('salon');
  const [newRoomName, setNewRoomName] = useState(DEFAULT_ROOM_NAMES['salon']);
  
  // Work modal state
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  // Update room name when type changes
  const handleRoomTypeChange = (type: RoomType) => {
    setNewRoomType(type);
    setNewRoomName(DEFAULT_ROOM_NAMES[type]);
  };

  const addRoom = () => {
    const name = newRoomName.trim() || DEFAULT_ROOM_NAMES[newRoomType];
    setRooms([...rooms, { id: uuidv4(), name, roomType: newRoomType, items: [] }]);
    setNewRoomName(DEFAULT_ROOM_NAMES['salon']);
    setNewRoomType('salon');
  };

  const removeRoom = (id: string) => {
    if (confirm(t('estimates.confirmDeleteRoom'))) setRooms(rooms.filter(r => r.id !== id));
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
    if (!clientName.trim()) { alert(t('estimates.enterClientName')); return; }
    onSave({
      id: estimate?.id || uuidv4(),
      clientName: clientName.trim(),
      clientAddress: clientAddress.trim(),
      projectDescription: projectDescription.trim(),
      notes: notes.trim(),
      rooms,
      includeMaterials,
      laborDiscountPercent: parseFloat(laborDiscount) || 0,
      materialDiscountPercent: parseFloat(materialDiscount) || 0,
      createdAt: estimate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const canGoNext = () => {
    if (step === 1) return clientName.trim().length > 0;
    if (step === 2) return rooms.length > 0;
    if (step === 3) return rooms.some(r => r.items.length > 0);
    return true;
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  // Step indicator component
  const StepIndicator = () => (
    <div className="wizard-steps">
      {[1, 2, 3, 4].map(s => (
        <div key={s} className={`wizard-step ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
          <div className="wizard-step-number">{step > s ? '✓' : s}</div>
          <div className="wizard-step-label">
            {s === 1 && t('estimates.wizardStep1Title')}
            {s === 2 && t('estimates.wizardStep2Title')}
            {s === 3 && t('estimates.wizardStep3Title')}
            {s === 4 && t('estimates.wizardStep4Title')}
          </div>
        </div>
      ))}
    </div>
  );

  // Navigation buttons
  const WizardNav = () => (
    <div className="wizard-nav">
      {step > 1 && !isEditing && (
        <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
          ← {t('common.back')}
        </button>
      )}
      <div style={{ flex: 1 }} />
      {step < 4 ? (
        <button 
          className="btn btn-primary" 
          onClick={() => setStep(step + 1)}
          disabled={!canGoNext()}
        >
          {t('common.next')} →
        </button>
      ) : (
        <button className="btn btn-success" onClick={handleSave}>
          💾 {t('common.save')}
        </button>
      )}
    </div>
  );

  return (
    <div className="wizard-container">
      {!isEditing && <StepIndicator />}
      
      {/* Step 1: Client Data */}
      {step === 1 && (
        <div className="wizard-step-content">
          <div className="wizard-step-header">
            <h2>👤 {t('estimates.wizardStep1Title')}</h2>
            <p className="text-gray">{t('estimates.wizardStep1Desc')}</p>
          </div>
          
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">{t('estimates.clientName')} *</label>
                <input 
                  type="text" 
                  className="form-input form-input-lg" 
                  placeholder={t('estimates.clientNamePlaceholder')} 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)}
                  autoFocus
                />
                <p className="form-hint">Imię i nazwisko lub nazwa firmy klienta</p>
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('estimates.projectDescription')}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={t('estimates.projectDescriptionPlaceholder')} 
                  value={projectDescription} 
                  onChange={(e) => setProjectDescription(e.target.value)} 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('estimates.clientAddress')}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={t('estimates.clientAddressPlaceholder')} 
                  value={clientAddress} 
                  onChange={(e) => setClientAddress(e.target.value)} 
                />
              </div>
              
              <div className="form-group">
                <label className="form-checkbox">
                  <input type="checkbox" checked={includeMaterials} onChange={(e) => setIncludeMaterials(e.target.checked)} />
                  <span>{t('estimates.includeMaterials')}</span>
                </label>
                <p className="form-hint">Jeśli zaznaczone, materiały zostaną automatycznie dodane do prac</p>
              </div>
            </div>
          </div>
          
          <div className="wizard-nav">
            <button className="btn btn-secondary" onClick={onCancel}>{t('common.cancel')}</button>
            <div style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!canGoNext()}>
              {t('common.next')} →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Add Rooms */}
      {step === 2 && (
        <div className="wizard-step-content">
          <div className="wizard-step-header">
            <h2>🏠 {t('estimates.wizardStep2Title')}</h2>
            <p className="text-gray">{t('estimates.wizardStep2Desc')}</p>
          </div>
          
          {/* Room type selector */}
          <div className="card">
            <div className="card-body">
              <p className="form-label">{t('estimates.selectRoomType')}</p>
              <p className="form-hint mb-1">{t('estimates.selectRoomTypeHint')}</p>
              
              <div className="room-type-grid">
                {Object.entries(ROOM_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    className={`room-type-btn ${newRoomType === key ? 'active' : ''}`}
                    onClick={() => handleRoomTypeChange(key as RoomType)}
                  >
                    <span className="room-type-icon">
                      {key === 'lazienka' && '🚿'}
                      {key === 'kuchnia' && '🍳'}
                      {key === 'salon' && '🛋️'}
                      {key === 'sypialnia' && '🛏️'}
                      {key === 'korytarz' && '🚪'}
                      {key === 'balkon' && '🌿'}
                      {key === 'inne' && '📦'}
                    </span>
                    <span className="room-type-label">{label}</span>
                  </button>
                ))}
              </div>
              
              <div className="form-group mt-2">
                <label className="form-label">{t('estimates.roomName')}</label>
                <div className="flex gap-1">
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder={t('estimates.roomNamePlaceholder')} 
                    value={newRoomName} 
                    onChange={(e) => setNewRoomName(e.target.value)} 
                  />
                  <button className="btn btn-primary" onClick={addRoom}>
                    + {t('common.add')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Added rooms list */}
          {rooms.length > 0 && (
            <div className="card mt-2">
              <div className="card-header">
                <h3 className="card-title">{t('estimates.rooms')} ({rooms.length})</h3>
              </div>
              {rooms.map(room => (
                <div key={room.id} className="list-item">
                  <div className="list-item-content">
                    <div className="list-item-title">{room.name}</div>
                    <span className="badge badge-primary">{ROOM_LABELS[room.roomType]}</span>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeRoom(room.id)}>🗑️</button>
                </div>
              ))}
            </div>
          )}
          
          {rooms.length === 0 && (
            <div className="card mt-2">
              <div className="empty-state">
                <div className="empty-state-icon">🏠</div>
                <p>{t('estimates.addFirstRoom')}</p>
              </div>
            </div>
          )}
          
          <WizardNav />
        </div>
      )}

      {/* Step 3: Add Works to Rooms */}
      {step === 3 && (
        <div className="wizard-step-content">
          <div className="wizard-step-header">
            <h2>🔧 {t('estimates.wizardStep3Title')}</h2>
            <p className="text-gray">{t('estimates.wizardStep3Desc')}</p>
          </div>
          
          {rooms.map(room => {
            const totals = calcRoom(room);
            const templates = user.roomRenovationTemplates.filter(temp => temp.roomType === room.roomType);
            
            return (
              <div key={room.id} className="room-card">
                <div className="room-card-header">
                  <div>
                    <div className="room-card-title">{room.name}</div>
                    <span className="badge badge-primary">{ROOM_LABELS[room.roomType]}</span>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => { setActiveRoomId(room.id); setShowWorkModal(true); }}>
                    + {t('estimates.addWork')}
                  </button>
                </div>
                
                {/* Quick start templates */}
                {templates.length > 0 && room.items.length === 0 && (
                  <div className="card-body" style={{ background: 'var(--primary-50)', borderBottom: '1px solid var(--primary-100)' }}>
                    <p className="text-sm font-medium mb-1">💡 {t('estimates.useTemplate')}</p>
                    <p className="text-xs text-gray mb-1">{t('estimates.applyTemplateHint')}</p>
                    <div className="flex gap-1 flex-wrap">
                      {templates.map(temp => (
                        <button key={temp.id} className="btn btn-secondary btn-sm" onClick={() => applyTemplate(room.id, temp.id)}>
                          {temp.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {room.items.length === 0 ? (
                  <div className="empty-state" style={{ padding: '1rem' }}>
                    <p className="text-sm">{t('estimates.noWorksInRoom')}</p>
                    <p className="text-xs text-gray">{t('estimates.addWorksHint')}</p>
                  </div>
                ) : (
                  <>
                    {/* Group items by work */}
                    {(() => {
                      const workGroups = new Map<string, EstimateItem[]>();
                      room.items.forEach(item => {
                        if (item.workId) {
                          const existing = workGroups.get(item.workId) || [];
                          existing.push(item);
                          workGroups.set(item.workId, existing);
                        }
                      });
                      
                      return Array.from(workGroups.entries()).map(([workId, items]) => {
                        const workName = items[0]?.workName || t('templates.works');
                        const workTotal = items.reduce((s, i) => s + i.quantity * i.pricePerUnit, 0);
                        const laborItem = items.find(i => i.category === 'labor');
                        
                        return (
                          <div key={workId} className="work-group-compact">
                            <div className="work-group-header">
                              <span className="work-group-title">🔧 {workName}</span>
                              <div className="flex items-center gap-1">
                                {laborItem && (
                                  <input 
                                    type="number" 
                                    className="item-row-input" 
                                    value={laborItem.quantity} 
                                    onChange={(e) => {
                                      const newQty = parseFloat(e.target.value) || 0;
                                      const oldQty = laborItem.quantity;
                                      const ratio = oldQty > 0 ? newQty / oldQty : 1;
                                      
                                      // Update all items in this work group proportionally
                                      items.forEach(item => {
                                        updateItem(room.id, item.id, { 
                                          quantity: item.category === 'labor' ? newQty : Math.ceil(item.quantity * ratio * 100) / 100
                                        });
                                      });
                                    }}
                                    min="0.1" 
                                    step="0.1" 
                                  />
                                )}
                                <span className="text-xs">{laborItem ? UNIT_LABELS[laborItem.unit] : ''}</span>
                                <span className="work-group-total">{workTotal.toFixed(0)} {t('common.currency')}</span>
                                <button className="btn btn-ghost btn-sm" onClick={() => {
                                  items.forEach(item => removeItem(room.id, item.id));
                                }}>×</button>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                    
                    <div className="room-total">
                      <strong>{t('common.total')}: {totals.total.toFixed(2)} {t('common.currency')}</strong>
                    </div>
                  </>
                )}
              </div>
            );
          })}
          
          <WizardNav />
        </div>
      )}

      {/* Step 4: Summary */}
      {step === 4 && (
        <div className="wizard-step-content">
          <div className="wizard-step-header">
            <h2>📋 {t('estimates.wizardStep4Title')}</h2>
            <p className="text-gray">{t('estimates.wizardStep4Desc')}</p>
          </div>
          
          {/* Client summary */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">👤 {t('estimates.clientData')}</h3>
              {!isEditing && <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>✏️</button>}
            </div>
            <div className="card-body">
              <div className="flex justify-between">
                <span className="text-gray">{t('estimates.clientName')}:</span>
                <strong>{clientName}</strong>
              </div>
              {projectDescription && (
                <div className="flex justify-between mt-1">
                  <span className="text-gray">{t('estimates.projectDescription')}:</span>
                  <span>{projectDescription}</span>
                </div>
              )}
              {clientAddress && (
                <div className="flex justify-between mt-1">
                  <span className="text-gray">{t('estimates.clientAddress')}:</span>
                  <span>{clientAddress}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Rooms summary */}
          {rooms.map(room => {
            const totals = calcRoom(room);
            return (
              <div key={room.id} className="card">
                <div className="card-header">
                  <h3 className="card-title">{room.name}</h3>
                  <span className="badge badge-primary">{ROOM_LABELS[room.roomType]}</span>
                </div>
                <div className="card-body">
                  {(() => {
                    const workGroups = new Map<string, EstimateItem[]>();
                    room.items.forEach(item => {
                      if (item.workId) {
                        const existing = workGroups.get(item.workId) || [];
                        existing.push(item);
                        workGroups.set(item.workId, existing);
                      }
                    });
                    
                    return Array.from(workGroups.entries()).map(([workId, items]) => {
                      const workName = items[0]?.workName || t('templates.works');
                      const laborItem = items.find(i => i.category === 'labor');
                      const workTotal = items.reduce((s, i) => s + i.quantity * i.pricePerUnit, 0);
                      
                      return (
                        <div key={workId} className="flex justify-between text-sm mb-1">
                          <span>
                            🔧 {workName} 
                            <span className="text-gray text-xs"> ({laborItem?.quantity} {laborItem ? UNIT_LABELS[laborItem.unit] : ''})</span>
                          </span>
                          <strong>{workTotal.toFixed(2)} {t('common.currency')}</strong>
                        </div>
                      );
                    });
                  })()}
                  <div className="flex justify-between mt-1 pt-1" style={{ borderTop: '1px solid var(--gray-100)' }}>
                    <span className="font-semibold">{t('common.total')}:</span>
                    <strong className="text-primary">{totals.total.toFixed(2)} {t('common.currency')}</strong>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Discounts (optional) */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">💰 {t('estimates.discountsOptional')}</h3>
            </div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('estimates.laborDiscount')}</label>
                  <input type="number" className="form-input" value={laborDiscount} onChange={(e) => setLaborDiscount(e.target.value)} min="0" max="100" />
                </div>
                {includeMaterials && (
                  <div className="form-group">
                    <label className="form-label">{t('estimates.materialDiscount')}</label>
                    <input type="number" className="form-input" value={materialDiscount} onChange={(e) => setMaterialDiscount(e.target.value)} min="0" max="100" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Notes (optional) */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">📝 {t('estimates.notesOptional')}</h3>
            </div>
            <div className="card-body">
              <textarea 
                className="form-input" 
                rows={3} 
                placeholder={t('common.notesPlaceholder')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          {/* Final summary */}
          <div className="summary-box">
            <div className="summary-row">
              <span>{t('common.labor')}:</span>
              <span>{totalLabor.toFixed(2)} {t('common.currency')}</span>
            </div>
            {laborDiscountAmount > 0 && (
              <div className="summary-row discount">
                <span>{t('common.discount')} ({laborDiscount}%):</span>
                <span>-{laborDiscountAmount.toFixed(2)} {t('common.currency')}</span>
              </div>
            )}
            {includeMaterials && (
              <>
                <div className="summary-row">
                  <span>{t('common.materials')}:</span>
                  <span>{totalMaterial.toFixed(2)} {t('common.currency')}</span>
                </div>
                {materialDiscountAmount > 0 && (
                  <div className="summary-row discount">
                    <span>{t('common.discount')} ({materialDiscount}%):</span>
                    <span>-{materialDiscountAmount.toFixed(2)} {t('common.currency')}</span>
                  </div>
                )}
              </>
            )}
            <div className="summary-row total">
              <span>{t('common.total').toUpperCase()}:</span>
              <span className="value">{grandTotal.toFixed(2)} {t('common.currency')}</span>
            </div>
          </div>
          
          <div className="wizard-nav">
            {!isEditing && (
              <button className="btn btn-secondary" onClick={() => setStep(3)}>
                ← {t('common.back')}
              </button>
            )}
            <button className="btn btn-secondary" onClick={onCancel}>{t('common.cancel')}</button>
            <div style={{ flex: 1 }} />
            <button className="btn btn-success btn-lg" onClick={handleSave}>
              💾 {t('common.save')}
            </button>
          </div>
        </div>
      )}
      
      {showWorkModal && activeRoom && (
        <AddWorkModal 
          user={user} 
          roomType={activeRoom.roomType} 
          includeMaterials={includeMaterials}
          onAdd={(items) => addItems(activeRoom.id, items)} 
          onClose={() => { setShowWorkModal(false); setActiveRoomId(null); }} 
          onUserUpdate={onUserUpdate} 
        />
      )}
    </div>
  );
};

// ============ Estimates View ============
const EstimatesView: React.FC<{ user: UserData; onUpdate: () => void; onEdit: (e: Estimate | null) => void }> = ({ user, onUpdate, onEdit }) => {
  const { t } = useTranslation();
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfEstimate, setPdfEstimate] = useState<Estimate | null>(null);

  const handleDelete = (id: string) => {
    if (confirm(t('estimates.confirmDeleteEstimate'))) { mockApi.deleteEstimate(user.uniqueId, id); onUpdate(); }
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
          <h2 className="card-title">📊 {t('estimates.title')}</h2>
          <button className="btn btn-primary btn-sm" onClick={() => onEdit(null)}>+ {t('estimates.new')}</button>
        </div>
      </div>
      {user.estimates.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <p>{t('estimates.noEstimates')}</p>
            <button className="btn btn-primary mt-2" onClick={() => onEdit(null)}>{t('estimates.createFirst')}</button>
          </div>
        </div>
      ) : (
        <div className="card">
          {user.estimates.map(e => (
            <div key={e.id} className="list-item">
              <div className="list-item-content">
                <div className="list-item-title">{e.clientName}</div>
                <div className="list-item-subtitle">
                  {e.projectDescription || t('estimates.noDescription')} • {e.rooms.length} {t('estimates.rooms').toLowerCase()} • 
                  <strong className="text-primary"> {calcTotal(e).toFixed(2)} {t('common.currency')}</strong>
                </div>
                <div className="list-item-subtitle text-xs text-gray">{new Date(e.createdAt).toLocaleDateString()}</div>
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
        <PDFExportModal estimate={pdfEstimate} user={user} onClose={() => { setShowPDFModal(false); setPdfEstimate(null); }} />
      )}
    </div>
  );
};

// ============ Settings View ============
const SettingsView: React.FC<{ user: UserData; onUpdate: () => void }> = memo(({ user, onUpdate }) => {
  const { t, i18n } = useTranslation();
  const config = getApiConfig();
  const remaining = mockApi.getRemainingTime(user);
  const url = `${window.location.origin}${window.location.pathname}#${user.uniqueId}`;
  const copy = useCallback(() => { navigator.clipboard.writeText(url); alert(t('settings.copied')); }, [url, t]);
  
  const [companyName, setCompanyName] = useState(user.companyName || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [hasChanges, setHasChanges] = useState(false);
  
  const handleSaveCompanyInfo = () => {
    mockApi.updateUser(user.uniqueId, { companyName, phoneNumber });
    setHasChanges(false);
    onUpdate();
  };

  return (
    <div>
      {remaining !== null && remaining > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--warning-light), #fef9c3)', border: '1px solid var(--warning)' }}>
          <div className="card-body">
            <h3 className="font-semibold mb-1" style={{ color: 'var(--warning)' }}>⏰ {t('settings.tempAccount')}</h3>
            <p className="text-sm" style={{ color: 'var(--gray-700)' }}>
              {t('settings.tempAccountDesc')} <strong>{formatRemainingTime(remaining)}</strong>.
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--gray-600)' }}>
              {t('settings.saveIdNote')}
            </p>
          </div>
        </div>
      )}
      
      {/* Company Info */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🏢 {t('settings.companyInfo')}</h2>
        </div>
        <div className="card-body">
          <p className="text-xs text-gray mb-2">{t('settings.companyInfoDesc')}</p>
          <div className="form-group">
            <label className="form-label">{t('settings.companyName')}</label>
            <input 
              type="text" 
              className="form-input" 
              value={companyName} 
              onChange={(e) => { setCompanyName(e.target.value); setHasChanges(true); }}
              placeholder={user.username}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('settings.phoneNumber')}</label>
            <input 
              type="tel" 
              className="form-input" 
              value={phoneNumber} 
              onChange={(e) => { setPhoneNumber(e.target.value); setHasChanges(true); }}
              placeholder={t('settings.phonePlaceholder')}
            />
          </div>
          {hasChanges && (
            <button className="btn btn-primary btn-block" onClick={handleSaveCompanyInfo}>
              💾 {t('common.save')}
            </button>
          )}
        </div>
      </div>
      
      {/* Account Settings */}
      <div className="card">
        <div className="card-header"><h2 className="card-title">⚙️ {t('settings.title')}</h2></div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">{t('settings.displayName')}</label>
            <input type="text" className="form-input" value={user.username} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">{t('settings.yourId')}</label>
            <input type="text" className="form-input" value={user.uniqueId} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">{t('settings.accountLink')}</label>
            <div className="url-box">
              <code>{url}</code>
              <p>{t('settings.saveLink')}</p>
            </div>
            <button className="btn btn-primary btn-block mt-1" onClick={copy}>📋 {t('settings.copy')}</button>
          </div>
          <div className="form-group">
            <label className="form-label">{t('settings.language')}</label>
            <div className="flex gap-1 flex-wrap">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button 
                  key={lang.code}
                  className={`filter-pill ${i18n.language === lang.code ? 'active' : ''}`}
                  onClick={() => changeLanguage(lang.code)}
                >
                  {lang.flag} {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h3 className="font-semibold mb-1">📊 {t('settings.stats')}</h3>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-value">{user.itemTemplates.length}</div><div className="stat-label">{t('templates.items')}</div></div>
            <div className="stat-card"><div className="stat-value">{user.workTemplates.length}</div><div className="stat-label">{t('templates.works')}</div></div>
            <div className="stat-card"><div className="stat-value">{user.roomRenovationTemplates.length}</div><div className="stat-label">{t('templates.renovations')}</div></div>
            <div className="stat-card"><div className="stat-value">{user.estimates.length}</div><div className="stat-label">{t('estimates.title')}</div></div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body text-center text-xs text-gray">
          {t('appName')} v2.3<br/>{t('settings.dataLocal')}
          {config.retentionHours > 0 && <><br/>{t('settings.retention')}: {config.retentionHours}h</>}
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
  const { t } = useTranslation();
  const [user, setUser] = useState<UserData | null>(null);
  const [tab, setTab] = useState<TabType>('estimates');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
  const [showEstimateEditor, setShowEstimateEditor] = useState(false);

  useEffect(() => {
    initSyncService({ backendUrl: 'http://localhost:8080/api' });
    
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
    queueOperation({
      type: 'CREATE_USER',
      payload: { username: u.username, useDefaultData: true }
    });
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
      queueOperation({
        type: 'UPDATE_ESTIMATE',
        payload: { uniqueId: user.uniqueId, estimateId: e.id, updates: e }
      });
    } else { 
      mockApi.createEstimate(user.uniqueId, e);
      queueOperation({
        type: 'CREATE_ESTIMATE',
        payload: { uniqueId: user.uniqueId, estimate: e }
      });
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

  if (showEstimateEditor) {
    return (
      <>
        <div className="construction-stripe" />
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">📋</div>
              <div className="logo-text">{t('appName').replace('Pro', '')}<span>Pro</span></div>
            </div>
            <div className="flex items-center gap-1">
              <LanguageSelector />
              <div className="user-info">👤 {user.username}</div>
            </div>
          </div>
        </header>
        <main className="main">
          <EstimateEditor 
            user={user} 
            estimate={editingEstimate} 
            onSave={handleSaveEstimate} 
            onCancel={handleCancelEdit}
            onUserUpdate={handleUpdate}
          />
        </main>
      </>
    );
  }

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <aside className="app-sidebar mobile-hidden">
        <div className="logo">
          <div className="logo-icon">📋</div>
          <div className="logo-text">{t('appName').replace('Pro', '')}<span>Pro</span></div>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`sidebar-nav-item ${tab === 'estimates' ? 'active' : ''}`} 
            onClick={() => setTab('estimates')}
          >
            📊 {t('nav.estimates')}
          </button>
          <button 
            className={`sidebar-nav-item ${tab === 'templates' ? 'active' : ''}`} 
            onClick={() => setTab('templates')}
          >
            📋 {t('nav.templates')}
          </button>
          <button 
            className={`sidebar-nav-item ${tab === 'settings' ? 'active' : ''}`} 
            onClick={() => setTab('settings')}
          >
            ⚙️ {t('nav.settings')}
          </button>
        </nav>
        <div className="sidebar-user">
          <div className="flex items-center gap-1 mb-1">
            <SyncStatusIndicator />
            <RetentionTimer user={user} />
          </div>
          <div className="flex items-center gap-1">
            <LanguageSelector />
            <div className="user-info" style={{ flex: 1 }}>👤 {user.username}</div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="app-content">
        <div className="construction-stripe" />
        
        {/* Mobile Header */}
        <header className="header desktop-hidden">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">📋</div>
              <div className="logo-text">{t('appName').replace('Pro', '')}<span>Pro</span></div>
            </div>
            <div className="flex items-center gap-1">
              <SyncStatusIndicator />
              <RetentionTimer user={user} />
              <LanguageSelector />
              <div className="user-info">👤 {user.username}</div>
            </div>
          </div>
        </header>
        
        {/* Mobile Navigation */}
        <nav className="nav desktop-hidden">
          <div className="nav-tabs">
            <button className={`nav-tab ${tab === 'estimates' ? 'active' : ''}`} onClick={() => setTab('estimates')}>📊 {t('nav.estimates')}</button>
            <button className={`nav-tab ${tab === 'templates' ? 'active' : ''}`} onClick={() => setTab('templates')}>📋 {t('nav.templates')}</button>
            <button className={`nav-tab ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>⚙️ {t('nav.settings')}</button>
          </div>
        </nav>
        
        <main className="main" key={refreshKey}>
          {tab === 'estimates' && <EstimatesView user={user} onUpdate={handleUpdate} onEdit={handleEditEstimate} />}
          {tab === 'templates' && <TemplatesView user={user} onUpdate={handleUpdate} />}
          {tab === 'settings' && <SettingsView user={user} onUpdate={handleUpdate} />}
        </main>
      </div>
    </div>
  );
};

export default App;
