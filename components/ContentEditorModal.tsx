
import React, { useState } from 'react';
import { Section, TaskItem } from '../types';
import { X, Trash2, Plus, Save, RotateCcw, ChevronRight, ChevronDown, Pencil, Check, AlignLeft, Type } from 'lucide-react';
import { DEFAULT_INTRO_TEXT } from '../constants';

interface ContentEditorModalProps {
  initialSections: Section[];
  initialIntroText: string;
  onSave: (newSections: Section[], newIntroText: string) => void;
  onReset: () => void;
  onClose: () => void;
}

// Helper type to track what is being edited
type EditTarget = 
  | { type: 'section_title'; id: string }
  | { type: 'section_subtitle'; id: string }
  | { type: 'item_label'; sectionId: string; itemId: string }
  | null;

export const ContentEditorModal: React.FC<ContentEditorModalProps> = ({ initialSections, initialIntroText, onSave, onReset, onClose }) => {
  const [sections, setSections] = useState<Section[]>(JSON.parse(JSON.stringify(initialSections)));
  const [introText, setIntroText] = useState(initialIntroText);

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // State for adding new items
  const [newItemText, setNewItemText] = useState<string>('');
  const [activeAddSectionId, setActiveAddSectionId] = useState<string | null>(null);

  // State for adding new sections
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  // State for editing existing text
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [editText, setEditText] = useState('');

  const toggleSection = (id: string) => {
    // Don't toggle if we are editing
    if (editTarget && (editTarget.type === 'section_title' || editTarget.type === 'section_subtitle') && editTarget.id === id) return;
    setExpandedSection(expandedSection === id ? null : id);
  };

  // --- DELETE LOGIC ---

  const handleDeleteSection = (sectionId: string) => {
    if (confirm("Haluatko varmasti poistaa koko kategorian ja kaikki sen sisältämät kohdat?")) {
      setSections(prev => prev.filter(s => s.id !== sectionId));
    }
  };

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    if (!confirm("Haluatko varmasti poistaa tämän kohdan?")) return;

    setSections(prev => prev.map(sec => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.filter(item => item.id !== itemId)
      };
    }));
  };

  // --- ADD LOGIC ---

  const handleAddItem = (sectionId: string) => {
    if (!newItemText.trim()) return;

    const newItem: TaskItem = {
      id: `custom_item_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      label: newItemText.trim()
    };

    setSections(prev => prev.map(sec => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: [...sec.items, newItem]
      };
    }));

    setNewItemText('');
    setActiveAddSectionId(null);
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSection: Section = {
      id: `custom_section_${Date.now()}`,
      title: newSectionTitle.trim(),
      items: []
    };

    setSections(prev => [...prev, newSection]);
    setNewSectionTitle('');
    setIsAddingSection(false);
    // Automatically expand the new section
    setExpandedSection(newSection.id);
  };

  // --- EDIT LOGIC ---

  const startEdit = (target: EditTarget, currentText: string) => {
    setEditTarget(target);
    setEditText(currentText || '');
  };

  const saveEdit = () => {
    if (!editTarget) {
      setEditTarget(null);
      return;
    }

    if (editTarget.type === 'section_title') {
      if (!editText.trim()) return; // Don't allow empty titles
      setSections(prev => prev.map(sec => 
        sec.id === editTarget.id ? { ...sec, title: editText.trim() } : sec
      ));
    } else if (editTarget.type === 'section_subtitle') {
      // Allow empty subtitles (it just removes it)
      setSections(prev => prev.map(sec => 
        sec.id === editTarget.id ? { ...sec, subtitle: editText.trim() } : sec
      ));
    } else if (editTarget.type === 'item_label') {
      if (!editText.trim()) return; // Don't allow empty labels
      setSections(prev => prev.map(sec => {
        if (sec.id !== editTarget.sectionId) return sec;
        return {
          ...sec,
          items: sec.items.map(item => 
            item.id === editTarget.itemId ? { ...item, label: editText.trim() } : item
          )
        };
      }));
    }

    setEditTarget(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditTarget(null);
    setEditText('');
  };

  // --- GENERAL ---

  const handleSave = () => {
    onSave(sections, introText);
    onClose();
  };

  const handleReset = () => {
    if (confirm("Tämä palauttaa lomakkeen alkuperäiseen tilaan (sisältö ja tekstit). Oletko varma?")) {
      setIntroText(DEFAULT_INTRO_TEXT);
      onReset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-800 p-4 flex justify-between items-center text-white shrink-0">
          <h3 className="font-bold text-lg">Muokkaa lomakkeen sisältöä</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-yellow-50 p-4 border-b border-yellow-100 text-sm text-yellow-800 shrink-0">
          Voit muokata johdantotekstiä, otsikoita ja perehdytyskohtia. Muutokset tallentuvat tälle laitteelle.
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">

          {/* Intro Text Editor */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-2">
              <AlignLeft className="w-4 h-4" />
              Yleinen esittelyteksti (nimen alla)
            </h4>
            <textarea 
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              className="w-full h-32 p-3 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none resize-y"
              placeholder="Kirjoita ohjeistus tähän..."
            />
            <div className="text-xs text-gray-400 mt-1">Tämä teksti näkyy pelastajan nimen alla heti lomakkeen alussa.</div>
          </div>

          <hr className="border-gray-200" />
          
          <div>
            <h4 className="font-bold text-slate-700 mb-3 px-1">Lomakkeen osiot</h4>
            {sections.length === 0 && (
              <div className="text-center p-8 text-gray-400 italic border-2 border-dashed border-gray-200 rounded-lg">
                Ei kategorioita. Lisää uusi kategoria alta tai palauta oletukset.
              </div>
            )}
            
            <div className="space-y-3">
              {sections.map(section => (
                <div key={section.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  
                  {/* Section Header Row */}
                  <div className="flex items-stretch bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 min-h-[60px]">
                    
                    {/* Editing Title Mode */}
                    {editTarget?.type === 'section_title' && editTarget.id === section.id ? (
                      <div className="flex-1 px-4 py-3 flex flex-col justify-center bg-blue-50">
                        <label className="text-xs font-bold text-blue-600 mb-1">Muokkaa otsikkoa</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit();
                              if (e.key === 'Escape') cancelEdit();
                            }}
                          />
                          <button onClick={saveEdit} className="p-1 bg-green-500 text-white rounded hover:bg-green-600"><Check className="w-4 h-4" /></button>
                          <button onClick={cancelEdit} className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ) : editTarget?.type === 'section_subtitle' && editTarget.id === section.id ? (
                      /* Editing Subtitle Mode */
                      <div className="flex-1 px-4 py-3 flex flex-col justify-center bg-blue-50">
                        <label className="text-xs font-bold text-blue-600 mb-1">Muokkaa alaotsikkoa</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                            placeholder="Esim. (vuoropäivinä)"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit();
                              if (e.key === 'Escape') cancelEdit();
                            }}
                          />
                          <button onClick={saveEdit} className="p-1 bg-green-500 text-white rounded hover:bg-green-600"><Check className="w-4 h-4" /></button>
                          <button onClick={cancelEdit} className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode (Title + Subtitle)
                      <div 
                        onClick={() => toggleSection(section.id)}
                        className="flex-1 px-4 py-3 flex items-center justify-between text-left group cursor-pointer"
                      >
                        <div className="flex flex-col gap-1 w-full">
                          {/* Title Row */}
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{section.title}</span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                              {section.items.length}
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                startEdit({ type: 'section_title', id: section.id }, section.title);
                              }}
                              className="p-1 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                              title="Muokkaa otsikkoa"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Subtitle Row */}
                          <div className="flex items-center gap-2">
                             <div 
                               className={`text-sm flex items-center gap-2 ${section.subtitle ? 'text-gray-500' : 'text-gray-300 italic'}`}
                             >
                               <span className="truncate max-w-[250px] sm:max-w-md">
                                 {section.subtitle || "Ei alaotsikkoa"}
                               </span>
                             </div>
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 startEdit({ type: 'section_subtitle', id: section.id }, section.subtitle || '');
                               }}
                               className="p-1 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1"
                               title="Muokkaa alaotsikkoa"
                             >
                               <Type className="w-3 h-3" />
                               {!section.subtitle && <span className="text-[10px]">Lisää</span>}
                             </button>
                          </div>
                        </div>
                        {expandedSection === section.id ? <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 ml-2" /> : <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 ml-2" />}
                      </div>
                    )}

                    {/* Delete Section Button */}
                    {(!editTarget || (editTarget.type !== 'section_title' && editTarget.type !== 'section_subtitle') || editTarget.id !== section.id) && (
                      <button 
                        onClick={() => handleDeleteSection(section.id)}
                        className="px-4 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 border-l border-gray-100 transition-colors"
                        title="Poista koko kategoria"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Items List */}
                  {expandedSection === section.id && (
                    <div className="border-t border-gray-100 divide-y divide-gray-50 bg-gray-50/50">
                      {section.items.map(item => (
                        <div key={item.id} className="px-4 py-3 flex items-center justify-between group hover:bg-slate-50 pl-8 border-l-4 border-l-transparent hover:border-l-accent transition-all min-h-[44px]">
                          
                          {/* Editing Item Mode */}
                          {editTarget?.type === 'item_label' && editTarget.itemId === item.id ? (
                            <div className="flex-1 flex items-center gap-2">
                              <input 
                                type="text" 
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEdit();
                                  if (e.key === 'Escape') cancelEdit();
                                }}
                              />
                              <button onClick={saveEdit} className="p-1 bg-green-500 text-white rounded hover:bg-green-600"><Check className="w-4 h-4" /></button>
                              <button onClick={cancelEdit} className="p-1 bg-gray-400 text-white rounded hover:bg-gray-500"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            // Display Item Mode
                            <>
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-sm text-slate-700">{item.label}</span>
                                <button 
                                  onClick={() => startEdit({ type: 'item_label', sectionId: section.id, itemId: item.id }, item.label)}
                                  className="p-1 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                                  title="Muokkaa tekstiä"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                              </div>
                              
                              <button 
                                onClick={() => handleDeleteItem(section.id, item.id)}
                                className="p-1.5 text-red-300 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-2"
                                title="Poista kohta"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      ))}

                      {/* Add New Item Input */}
                      <div className="p-3 bg-gray-50 pl-8">
                        {activeAddSectionId === section.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newItemText}
                              onChange={(e) => setNewItemText(e.target.value)}
                              placeholder="Kirjoita uuden kohdan nimi..."
                              className="flex-1 px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-accent outline-none"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && handleAddItem(section.id)}
                            />
                            <button 
                              onClick={() => handleAddItem(section.id)}
                              className="px-3 py-2 bg-green-600 text-white rounded text-sm font-bold hover:bg-green-700"
                            >
                              Lisää
                            </button>
                            <button 
                              onClick={() => setActiveAddSectionId(null)}
                              className="px-3 py-2 bg-gray-200 text-gray-600 rounded text-sm hover:bg-gray-300"
                            >
                              Peru
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => {
                              setActiveAddSectionId(section.id);
                              setNewItemText('');
                            }}
                            className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 text-sm font-bold hover:border-accent hover:text-accent hover:bg-white transition-all flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Lisää uusi kohta
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ADD NEW SECTION BLOCK */}
          <div className="mt-6 border-t pt-4">
             {isAddingSection ? (
               <div className="bg-white p-4 rounded-lg border-2 border-accent shadow-sm">
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Uusi Kategoria</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="Esim. Erikoiskalusto..."
                      className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-accent outline-none"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
                    />
                    <button 
                      onClick={handleAddSection}
                      className="px-4 py-2 bg-accent text-white rounded font-bold hover:bg-sky-600"
                    >
                      Luo
                    </button>
                    <button 
                      onClick={() => setIsAddingSection(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-600 rounded font-bold hover:bg-gray-300"
                    >
                      Peru
                    </button>
                  </div>
               </div>
             ) : (
                <button
                  onClick={() => {
                    setIsAddingSection(true);
                    setNewSectionTitle('');
                  }}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-300 border-dashed font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Lisää uusi kategoria
                </button>
             )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-between items-center shrink-0">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-bold px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Palauta oletukset
          </button>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-gray-100 rounded-lg font-bold transition-colors"
            >
              Peruuta
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Tallenna muutokset
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
