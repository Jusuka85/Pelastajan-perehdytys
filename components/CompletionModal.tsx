
import React from 'react';
import { X, Trophy, Mail, FileDown, PartyPopper } from 'lucide-react';

interface CompletionModalProps {
  traineeName: string;
  onClose: () => void;
  onPrint: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({ traineeName, onClose, onPrint }) => {
  
  const handleEmailClick = () => {
    const subject = `Perehdytys suoritettu: ${traineeName}`;
    const body = `Hei,\n\nPelastaja ${traineeName} on suorittanut perehdytysohjelman hyväksytysti 100%.\n\nLiitteenä on allekirjoitettu perehdytyslomake/diplomi PDF-muodossa.\n\nTerveisin,\n${traineeName}`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Confetti / Header Background */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
             {/* Decorative circles */}
             <div className="absolute top-[-20%] left-[-10%] w-32 h-32 rounded-full bg-white"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-40 h-40 rounded-full bg-white"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="bg-white p-3 rounded-full shadow-lg mb-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Onneksi olkoon!</h2>
            <p className="text-yellow-50 font-medium">Perehdytys on suoritettu 100%</p>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-3 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors z-50 cursor-pointer"
            aria-label="Sulje"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="text-center space-y-2">
            <p className="text-slate-600">
              Olet suorittanut kaikki perehdytyksen osa-alueet. Voit nyt ladata virallisen todistuksen.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 flex gap-3">
             <PartyPopper className="w-5 h-5 shrink-0" />
             <p>
               Toimintaohje: Tallenna todistus (PDF) ja lähetä se esihenkilölle sähköpostilla.
             </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={onPrint}
              className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-slate-100 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all group"
            >
              <div className="bg-slate-100 p-3 rounded-full group-hover:bg-white group-hover:shadow-md transition-all">
                <FileDown className="w-6 h-6 text-slate-700" />
              </div>
              <span className="font-bold text-slate-700">1. Lataa Todistus</span>
            </button>

            <button
              onClick={handleEmailClick}
              className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-accent/20 bg-accent/5 rounded-xl hover:border-accent hover:bg-accent/10 transition-all group"
            >
              <div className="bg-white p-3 rounded-full shadow-sm group-hover:shadow-md transition-all">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <span className="font-bold text-accent">2. Lähetä Sähköposti</span>
            </button>
          </div>
        </div>
        
        {/* Footer with secondary Close button */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0 flex justify-center">
          <button 
            onClick={onClose}
            className="text-slate-500 font-bold hover:text-slate-800 hover:bg-gray-200 px-6 py-2 rounded-lg transition-colors text-sm"
          >
            Sulje ikkuna
          </button>
        </div>

      </div>
    </div>
  );
};
