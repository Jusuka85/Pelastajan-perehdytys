
import React from 'react';
import { Flame } from 'lucide-react';
import { OrganizationSettings } from '../types';

interface CertificateViewProps {
  traineeName: string;
  completionDate: string;
  orgSettings: OrganizationSettings;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ traineeName, completionDate, orgSettings }) => {
  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0; /* Remove default browser margins */
          }
          html, body {
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden; /* Prevent scrolling spilling to page 2 */
          }
        }
      `}</style>
      
      {/* 
         - print:h-[296mm]: Slightly less than full 297mm to prevent bleed
         - overflow-hidden: Cuts off anything that tries to create a 2nd page
         - justify-between: Distributes space evenly
      */}
      <div className="hidden print:flex flex-col items-center justify-between w-full h-screen print:h-[296mm] print:max-h-[296mm] p-8 print:p-6 bg-white text-slate-900 relative overflow-hidden box-border">
        
        {/* Decorative Border - Adjusted insets to be safer for printers */}
        <div className="absolute inset-4 print:inset-6 border-4 border-double border-slate-800 pointer-events-none" />
        <div className="absolute inset-6 print:inset-8 border border-slate-300 pointer-events-none" />
        
        {/* Corner Decorations */}
        <div className="absolute top-4 left-4 print:top-6 print:left-6 w-12 h-12 border-t-4 border-l-4 border-slate-800" />
        <div className="absolute top-4 right-4 print:top-6 print:right-6 w-12 h-12 border-t-4 border-r-4 border-slate-800" />
        <div className="absolute bottom-4 left-4 print:bottom-6 print:left-6 w-12 h-12 border-b-4 border-l-4 border-slate-800" />
        <div className="absolute bottom-4 right-4 print:bottom-6 print:right-6 w-12 h-12 border-b-4 border-r-4 border-slate-800" />

        {/* Header Content - Reduced margins */}
        <div className="mt-8 print:mt-12 text-center z-10">
          <div className="flex justify-center mb-3">
             <div className="p-3 rounded-full border-2 border-slate-800">
               <Flame className="w-10 h-10 text-orange-600" fill="currentColor" fillOpacity={0.2} />
             </div>
          </div>
          
          <h2 className="text-base uppercase tracking-[0.2em] text-slate-500 font-serif mb-1">{orgSettings.name}</h2>
          <h3 className="text-sm font-serif text-slate-400 italic">{orgSettings.subtitle}</h3>
        </div>

        {/* Main Content - Reduced font sizes and spacing */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl text-center z-10 space-y-4 print:space-y-4">
          
          <h1 className="text-4xl print:text-5xl font-serif font-bold text-slate-900 mb-2 tracking-wide">
            TODISTUS
          </h1>

          <div className="w-16 h-1 bg-orange-500 mx-auto mb-2" />

          <p className="text-base print:text-lg text-slate-600 font-serif italic leading-relaxed">
            Täten todistetaan, että pelastaja
          </p>

          <div className="text-2xl print:text-4xl font-bold text-slate-800 border-b-2 border-slate-200 pb-1 px-8 min-w-[300px]">
            {traineeName}
          </div>

          <p className="text-base print:text-lg text-slate-600 font-serif italic leading-relaxed mt-2">
            on suorittanut {orgSettings.name}n<br/>
            pelastajan perehdytysohjelman hyväksytysti.
          </p>

        </div>

        {/* Footer / Date - Reduced margins */}
        <div className="mb-8 print:mb-12 text-center z-10 w-full">
          <div className="flex flex-col items-center justify-center gap-1">
             <p className="text-sm font-serif text-slate-500 italic">{orgSettings.city}</p>
             <p className="text-lg font-bold text-slate-800">{completionDate}</p>
          </div>
          
          <div className="mt-6 text-[10px] text-gray-400 uppercase tracking-widest">
            Sähköisesti vahvistettu asiakirja
          </div>
        </div>

        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
           <Flame className="w-[300px] h-[300px] print:w-[400px] print:h-[400px]" />
        </div>

      </div>
    </>
  );
};
