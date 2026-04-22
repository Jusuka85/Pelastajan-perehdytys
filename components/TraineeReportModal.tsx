
import React, { useMemo, useState } from 'react';
import { X, CheckCircle2, User, ChevronDown, ChevronUp, Check, Circle } from 'lucide-react';
import { TraineeQrData } from '../types';
import { SECTIONS } from '../constants';

interface TraineeReportModalProps {
  data: TraineeQrData;
  onClose: () => void;
}

export const TraineeReportModal: React.FC<TraineeReportModalProps> = ({ data, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Create a summary view based on the IDs in the QR code
  const report = useMemo(() => {
    const completedSet = new Set(data.completedTaskIds);
    let totalTasks = 0;
    
    const sectionStats = SECTIONS.map(section => {
      const sectionTotal = section.items.length;
      totalTasks += sectionTotal;
      
      // Map items with their specific completion status
      const itemDetails = section.items.map(item => ({
        id: item.id,
        label: item.label,
        isCompleted: completedSet.has(item.id)
      }));

      const sectionCompleted = itemDetails.filter(i => i.isCompleted).length;
      
      return {
        ...section,
        total: sectionTotal,
        completed: sectionCompleted,
        isDone: sectionTotal > 0 && sectionTotal === sectionCompleted,
        itemDetails: itemDetails
      };
    });

    const totalCompleted = data.completedTaskIds.length;
    const percentage = totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100);

    return { sectionStats, totalTasks, totalCompleted, percentage };
  }, [data]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-start text-white shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <div className="bg-accent/20 p-1.5 rounded-lg">
                 <User className="w-5 h-5 text-accent" />
               </div>
               <h2 className="text-xl font-bold">{data.name}</h2>
            </div>
            <p className="text-slate-400 text-sm">
              Tiedot luettu: {new Date(data.timestamp).toLocaleString()}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Overview Card */}
        <div className="p-6 border-b border-gray-100 bg-gray-50 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex-1">
               <div className="flex justify-between items-end mb-2">
                 <span className="font-bold text-slate-700">Kokonaisedistyminen</span>
                 <span className="text-2xl font-bold text-slate-900">{report.percentage}%</span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-3">
                 <div 
                   className="bg-green-500 h-3 rounded-full transition-all"
                   style={{ width: `${report.percentage}%` }}
                 />
               </div>
               <p className="text-xs text-gray-500 mt-2 text-right">
                 {report.totalCompleted} / {report.totalTasks} tehtävää suoritettu
               </p>
            </div>
          </div>
        </div>

        {/* Detailed List */}
        <div className="overflow-y-auto p-6 space-y-4 bg-gray-50/50">
           <h3 className="text-sm font-bold uppercase text-gray-500 flex justify-between items-center">
             <span>Osiokohtainen erittely</span>
             <span className="text-[10px] font-normal lowercase bg-gray-200 px-2 py-0.5 rounded">Klikkaa avataksesi</span>
           </h3>
           
           <div className="grid gap-3">
             {report.sectionStats.map(section => {
               const isOpen = expandedSections[section.id];
               
               return (
                 <div 
                   key={section.id}
                   className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                     section.isDone 
                       ? 'bg-green-50 border-green-200' 
                       : 'bg-white border-gray-200 shadow-sm'
                   }`}
                 >
                   {/* Section Header */}
                   <button 
                     onClick={() => toggleSection(section.id)}
                     className="w-full p-4 flex items-center justify-between text-left hover:bg-black/5 transition-colors"
                   >
                     <div className="flex-1 pr-2">
                       <h4 className={`font-semibold ${section.isDone ? 'text-green-900' : 'text-slate-700'}`}>
                         {section.title}
                       </h4>
                       <p className="text-xs text-gray-500 mt-0.5">
                         {section.completed} / {section.total} suoritettu
                       </p>
                     </div>
                     
                     <div className="flex items-center gap-3">
                       {section.isDone ? (
                         <CheckCircle2 className="w-6 h-6 text-green-500" />
                       ) : (
                         <div className="text-sm font-medium text-gray-400">
                           {Math.round((section.completed / section.total) * 100)}%
                         </div>
                       )}
                       {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                     </div>
                   </button>

                   {/* Detailed Items List */}
                   {isOpen && (
                     <div className="border-t border-gray-100 bg-white/50 p-2 space-y-1">
                       {section.itemDetails.map(item => (
                         <div 
                           key={item.id} 
                           className={`flex items-start gap-3 p-2 rounded-lg text-sm ${
                             item.isCompleted ? 'bg-green-100/50 text-green-900' : 'text-gray-500'
                           }`}
                         >
                           <div className="mt-0.5 shrink-0">
                             {item.isCompleted ? (
                               <Check className="w-4 h-4 text-green-600" />
                             ) : (
                               <Circle className="w-4 h-4 text-gray-300" />
                             )}
                           </div>
                           <span className={item.isCompleted ? 'font-medium' : ''}>
                             {item.label}
                           </span>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               );
             })}
           </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-white text-center text-xs text-gray-400 shrink-0">
           Tämä raportti on luotu pelastajan laitteen QR-koodista.
        </div>

      </div>
    </div>
  );
};
