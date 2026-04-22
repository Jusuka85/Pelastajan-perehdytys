
import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ClearConfirmationModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export const ClearConfirmationModal: React.FC<ClearConfirmationModalProps> = ({ onConfirm, onClose }) => {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmed = confirmText.toUpperCase() === 'POISTA';

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
          <div className="bg-red-100 p-3 rounded-full mb-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-red-900">Tyhjennä lomake?</h3>
          <p className="text-sm text-red-700 mt-2">
            Olet poistamassa kaikki pelastajan tiedot ja suoritusmerkinnät. Tätä toimintoa ei voi peruuttaa.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Vahvista kirjoittamalla "POISTA"
            </label>
            <input 
              type="text" 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="POISTA"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-bold text-center uppercase placeholder:font-normal placeholder:normal-case"
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold rounded-lg transition-colors"
            >
              Peruuta
            </button>
            <button 
              onClick={handleConfirm}
              disabled={!isConfirmed}
              className={`flex-1 py-3 flex items-center justify-center gap-2 font-bold rounded-lg transition-all ${
                isConfirmed 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Tyhjennä
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};
