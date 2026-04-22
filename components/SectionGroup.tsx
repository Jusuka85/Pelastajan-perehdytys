
import React, { useState } from 'react';
import { Section, TaskState } from '../types';
import { TaskRow } from './TaskRow';
import { ProgressBar } from './ProgressBar';
import { ChevronDown, ChevronRight, CheckCircle2, QrCode } from 'lucide-react';

interface SectionGroupProps {
  section: Section;
  tasks: Record<string, TaskState>;
  traineeName: string;
  onTaskChange: (id: string, updates: Partial<TaskState>) => void;
  onScanRequest: (taskId: string) => void;
  onSectionScanRequest: (sectionId: string) => void;
}

export const SectionGroup: React.FC<SectionGroupProps> = ({ 
  section, 
  tasks, 
  traineeName, 
  onTaskChange, 
  onScanRequest,
  onSectionScanRequest
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Calculate stats for this section
  const totalItems = section.items.length;
  const completedItems = section.items.filter(item => {
    const s = tasks[item.id] || { traineeSigned: false, trainerSigned: false };
    return s.traineeSigned && s.trainerSigned; // Considered done if both signed
  }).length;

  const isFullyComplete = totalItems > 0 && totalItems === completedItems;
  
  // Allow bulk scan only for "Day" sections (Day 1-5) as requested
  const allowBulkScan = section.id.startsWith('day');

  const handleBulkScanClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling the accordion
    onSectionScanRequest(section.id);
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-x-0 print:border-t-0 print:rounded-none">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between hover:bg-gray-100 transition-colors text-left cursor-pointer print:bg-white print:border-b-2 print:border-black"
      >
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              {section.title}
              {isFullyComplete && <CheckCircle2 className="w-5 h-5 text-green-500 no-print" />}
            </h3>
          </div>
          {section.subtitle && <p className="text-sm text-gray-500 mt-0.5">{section.subtitle}</p>}
        </div>
        
        <div className="flex items-center gap-4 no-print">
          
          {/* Bulk Scan Button for Days 1-5 */}
          {allowBulkScan && !isFullyComplete && (
            <div className="flex flex-col items-center">
              <button
                onClick={handleBulkScanClick}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all"
                title="Kuittaa koko päivä kerralla QR-koodilla"
              >
                <QrCode className="w-3.5 h-3.5 text-slate-800" />
                <span>Lue koodi</span>
              </button>
              <span className="text-[10px] text-gray-500 mt-1 font-medium">Kuittaa koko päivä</span>
            </div>
          )}

          <div className="hidden sm:block w-32">
             <ProgressBar current={completedItems} total={totalItems} />
          </div>
          {isOpen ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
        </div>
      </div>

      {(isOpen || window.matchMedia('print').matches) && (
        <div className={`divide-y divide-gray-50 ${isOpen ? 'block' : 'hidden print:block'}`}>
          {section.items.map(item => (
            <TaskRow 
              key={item.id} 
              item={item} 
              state={tasks[item.id] || { date: '', traineeSigned: false, trainerSigned: false }} 
              traineeName={traineeName}
              onChange={onTaskChange}
              onScanRequest={onScanRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
};
