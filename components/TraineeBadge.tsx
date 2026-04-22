
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, UserCheck, Smartphone } from 'lucide-react';
import { TaskState } from '../types';
import { SECTIONS } from '../constants';

interface TraineeBadgeProps {
  traineeName: string;
  tasks: Record<string, TaskState>;
  onClose: () => void;
}

export const TraineeBadge: React.FC<TraineeBadgeProps> = ({ traineeName, tasks, onClose }) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [stats, setStats] = useState({ completed: 0, total: 0, percentage: 0 });

  useEffect(() => {
    // 1. Calculate Stats & Collect IDs
    let total = 0;
    const completedIds: string[] = [];

    SECTIONS.forEach(section => {
      section.items.forEach(item => {
        total++;
        const t = tasks[item.id];
        // We consider a task "ready to show" if both signed, OR just trainee signed depending on policy.
        // Let's stick to "fully completed" for the passport.
        if (t && t.traineeSigned && t.trainerSigned) {
          completedIds.push(item.id);
        }
      });
    });

    const percentage = total === 0 ? 0 : Math.round((completedIds.length / total) * 100);
    setStats({ completed: completedIds.length, total, percentage });

    // 2. Generate Payload
    if (!traineeName.trim()) return;

    const payload = JSON.stringify({
      type: 'TRAINEE_PROGRESS',
      name: traineeName,
      completedTaskIds: completedIds,
      timestamp: Date.now()
    });

    // 3. Render QR
    QRCode.toDataURL(payload, { width: 400, margin: 2 })
      .then(setQrUrl)
      .catch(console.error);

  }, [traineeName, tasks]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-accent" />
            <h3 className="font-bold">Pelastajan Passi</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-6">
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">{traineeName || 'Nimetön Pelastaja'}</h2>
            <p className="text-sm text-slate-500">Perehdytyksen edistyminen</p>
          </div>

          <div className="w-full bg-gray-100 rounded-xl p-4 flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase font-bold">Valmiusaste</span>
                <span className={`text-2xl font-bold ${stats.percentage === 100 ? 'text-green-600' : 'text-accent'}`}>
                  {stats.percentage}%
                </span>
             </div>
             <div className="text-right">
                <span className="block text-sm font-medium text-slate-600">{stats.completed} / {stats.total}</span>
                <span className="text-xs text-gray-400">suoritettua kohtaa</span>
             </div>
          </div>

          <div className="p-2 border-2 border-dashed border-gray-200 rounded-xl">
             {qrUrl ? (
                <img src={qrUrl} alt="Pelastajan QR" className="w-48 h-48 rounded-lg" />
             ) : (
                <div className="w-48 h-48 flex items-center justify-center text-gray-400 bg-gray-50 text-xs text-center p-4">
                  {!traineeName ? "Kirjoita nimesi lomakkeelle luodaksesi passin." : "Luodaan koodia..."}
                </div>
             )}
          </div>

          <div className="text-xs text-center text-gray-400 max-w-[200px]">
            <Smartphone className="w-4 h-4 mx-auto mb-1" />
            Näytä tämä koodi esihenkilölle, joka voi tarkistaa suorituksesi "Esihenkilötyökaluista".
          </div>

        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-gray-50 border-t border-gray-100 font-semibold text-slate-600 hover:bg-gray-100 transition-colors"
        >
          Sulje
        </button>
      </div>
    </div>
  );
};
