
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Shield, User, LogIn, Lock, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (name: string, role: UserRole, password?: string) => Promise<void>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('trainee');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    setIsLoading(true);
    
    try {
      await onLogin(name, role, password);
    } catch (err: any) {
      setError(err.message || "Kirjautuminen epäonnistui");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-slate-800 p-8 text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg">
             <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Pelastajan Perehdytys</h1>
          <p className="text-slate-400">Kirjaudu sisään järjestelmään</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('trainee')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  role === 'trainee' 
                    ? 'border-accent bg-blue-50 text-accent' 
                    : 'border-gray-200 text-gray-400 hover:border-gray-300'
                }`}
              >
                <User className="w-6 h-6" />
                <span className="font-semibold text-sm">Pelastaja</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('supervisor')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  role === 'supervisor' 
                    ? 'border-green-500 bg-green-50 text-green-600' 
                    : 'border-gray-200 text-gray-400 hover:border-gray-300'
                }`}
              >
                <Shield className="w-6 h-6" />
                <span className="font-semibold text-sm">Esimies</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {role === 'trainee' ? 'Pelastajan nimi' : 'Esimiehen nimi'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Etunimi Sukunimi"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-shadow"
                  />
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Salasana
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-shadow"
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Ensikertalainen? Kirjoita haluamasi salasana, se tallennetaan tilillesi.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${isLoading ? 'bg-slate-700 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}
            >
              {isLoading ? (
                <span>Ladataan...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Kirjaudu sisään
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
              Demo: Salasana tallentuu selaimeen ensimmäisellä kirjautumisella.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
