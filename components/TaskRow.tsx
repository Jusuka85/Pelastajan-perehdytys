
import React from 'react';
import { TaskItem, TaskState } from '../types';
import { User, CheckCircle2, Calendar, QrCode } from 'lucide-react';

interface TaskRowProps {
  item: TaskItem;
  state: TaskState;
  traineeName: string;
  onChange: (id: string, updates: Partial<TaskState>) => void;
  onScanRequest: (taskId: string) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({ item, state, traineeName, onChange, onScanRequest }) => {
  const isComplete = state.date && state.traineeSigned && state.trainerSigned;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(item.id, { date: e.target.value });
  };

  const toggleTrainee = () => {
    // If signing, ensure we have a name
    if (!state.traineeSigned && !traineeName) {
      alert("Kirjoita nimesi sivun yläreunaan ennen kuittaamista.");
      return;
    }
    onChange(item.id, { 
      traineeSigned: !state.traineeSigned,
      traineeName: !state.traineeSigned ? traineeName : undefined 
    });
  };

  const handleTrainerClick = () => {
    if (state.trainerSigned) {
      // Allow clearing the signature
      if (confirm("Poistetaanko esimiehen kuittaus?")) {
        onChange(item.id, { trainerSigned: false, trainerName: undefined });
      }
    } else {
      // If not signed, open scanner
      onScanRequest(item.id);
    }
  };

  return (
    <div className={`p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${isComplete ? 'bg-green-50/50' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        
        {/* Label Section */}
        <div className="flex-1">
          <p className={`font-medium text-sm md:text-base ${isComplete ? 'text-green-800' : 'text-slate-800'}`}>
            {item.label}
          </p>
          {(state.traineeName || state.trainerName) && (
             <div className="mt-1 text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                {state.traineeName && <span>Pelastaja: <span className="font-semibold">{state.traineeName}</span></span>}
                {state.trainerName && <span>Kuittaaja: <span className="font-semibold">{state.trainerName}</span></span>}
             </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="flex flex-wrap gap-3 items-center justify-end no-print">
          
          {/* Date Input */}
          <div className="relative">
            <input
              type="date"
              value={state.date}
              onChange={handleDateChange}
              className="pl-8 pr-2 py-2 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-accent outline-none shadow-sm bg-white"
            />
            <Calendar className="w-3 h-3 text-gray-400 absolute left-2.5 top-3 pointer-events-none" />
          </div>

          {/* Trainee Signature */}
          <button
            onClick={toggleTrainee}
            className={`flex items-center gap-2 px-3 py-2 rounded border text-xs font-semibold transition-all shadow-sm min-w-[100px] justify-center ${
              state.traineeSigned 
                ? 'bg-blue-100 border-blue-200 text-blue-700' 
                : 'bg-white border-gray-300 text-gray-500 hover:border-gray-400'
            }`}
          >
            {state.traineeSigned ? <CheckCircle2 className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            {state.traineeSigned ? 'Kuitattu' : 'Pelastaja'}
          </button>

          {/* Trainer Signature (QR Trigger) */}
          <button
            onClick={handleTrainerClick}
            className={`flex items-center gap-2 px-3 py-2 rounded border text-xs font-semibold transition-all shadow-sm min-w-[100px] justify-center ${
              state.trainerSigned
                ? 'bg-green-100 border-green-200 text-green-700'
                : 'bg-slate-800 border-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {state.trainerSigned ? <CheckCircle2 className="w-3.5 h-3.5" /> : <QrCode className="w-3.5 h-3.5" />}
            {state.trainerSigned ? 'Hyväksytty' : 'Esimies'}
          </button>

        </div>

        {/* Print-only View */}
        <div className="hidden print-only text-xs w-[300px]">
           <div className="grid grid-cols-3 gap-2 border-l pl-4">
             <div>
                <span className="text-gray-500 block text-[10px]">Pvm</span>
                <span className="font-mono">{state.date || '_________'}</span>
             </div>
             <div>
                <span className="text-gray-500 block text-[10px]">Pelastaja</span>
                {state.traineeSigned ? <span className="font-bold">OK</span> : <span className="text-gray-300">___</span>}
             </div>
             <div>
                <span className="text-gray-500 block text-[10px]">Perehdyttäjä</span>
                {state.trainerSigned ? <span className="font-bold">OK ({state.trainerName})</span> : <span className="text-gray-300">___</span>}
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};
