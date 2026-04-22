
import React from 'react';
import { UserProgress } from '../types';
import { SECTIONS } from '../constants';
import { Users, ChevronRight, CheckCircle, Clock } from 'lucide-react';

interface DashboardProps {
  trainees: UserProgress[];
  onSelectTrainee: (id: string) => void;
  currentSupervisorName: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ trainees, onSelectTrainee, currentSupervisorName }) => {
  const totalTasks = SECTIONS.reduce((acc, sec) => acc + sec.items.length, 0);

  const calculateProgress = (tasks: Record<string, any>) => {
    let completed = 0;
    Object.values(tasks).forEach((t: any) => {
      if (t.traineeSigned && t.trainerSigned) completed++;
    });
    return Math.round((completed / totalTasks) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Esimiehen työpöytä</h2>
        <p className="text-slate-500">Tervetuloa, {currentSupervisorName}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-500" />
          <h3 className="font-semibold text-slate-700">Perehdytettävät ({trainees.length})</h3>
        </div>

        {trainees.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Ei vielä perehdytettäviä järjestelmässä.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {trainees.map(trainee => {
              const progress = calculateProgress(trainee.tasks);
              
              return (
                <button
                  key={trainee.userId}
                  onClick={() => onSelectTrainee(trainee.userId)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-slate-800">{trainee.userName}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Pelastaja</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                         <Clock className="w-3 h-3" />
                         Viimeksi muokattu: {new Date(trainee.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                       <div className="text-right">
                          <span className="block text-sm font-bold text-slate-700">{progress}%</span>
                          <span className="block text-xs text-gray-400">Valmis</span>
                       </div>
                       <div className="w-12 h-12 relative flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r="20" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                            <circle 
                              cx="24" cy="24" r="20" 
                              stroke={progress === 100 ? '#22c55e' : '#0ea5e9'} 
                              strokeWidth="4" 
                              fill="none" 
                              strokeDasharray={125.6} 
                              strokeDashoffset={125.6 - (125.6 * progress) / 100}
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          {progress === 100 && <CheckCircle className="w-5 h-5 text-green-500 absolute" />}
                       </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-accent" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
