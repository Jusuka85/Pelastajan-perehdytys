
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import LZString from 'lz-string';
import { X, ShieldCheck, UserPen, Lock, KeyRound, Download, ScanLine, FilePenLine, Share2, Copy, Check, Link } from 'lucide-react';
import { Section, TemplateRawData } from '../types';

interface SupervisorBadgeProps {
  onClose: () => void;
  onScanRequest: () => void;
  onEditContent: () => void;
  currentSections: Section[];
  currentIntroText: string;
  isAuthenticated: boolean;
  onLogin: () => void;
}

export const SupervisorBadge: React.FC<SupervisorBadgeProps> = ({ 
  onClose, 
  onScanRequest, 
  onEditContent,
  currentSections,
  currentIntroText,
  isAuthenticated,
  onLogin
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);

  const [name, setName] = useState('');
  const [qrUrl, setQrUrl] = useState<string>('');
  
  // State for Template Sharing
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Effect for Supervisor Signature QR
  useEffect(() => {
    if (!name.trim()) {
      setQrUrl('');
      return;
    }

    const signaturePayload = JSON.stringify({
      type: 'SUPERVISOR_SIGNATURE',
      name: name.trim(),
      timestamp: Date.now()
    });

    QRCode.toDataURL(signaturePayload, { width: 400, margin: 2 })
      .then((url) => {
        setQrUrl(url);
      })
      .catch((err) => {
        console.error("QR Generation failed", err);
      });
  }, [name]);

  // Generate Share URL when modal opens
  useEffect(() => {
    if (showShareModal) {
      try {
        // 1. Minify data structure
        const minifiedSections = currentSections.map(sec => {
          const sObj: any = {
            t: sec.title,
            it: sec.items.map(item => ({
              l: item.label
            }))
          };
          if (sec.subtitle) sObj.s = sec.subtitle;
          return sObj;
        });

        const rawData: TemplateRawData = {
          intro: currentIntroText,
          s: minifiedSections
        };

        const jsonString = JSON.stringify(rawData);
        
        // 2. Compress using compressToEncodedURIComponent for safe URL usage
        const compressed = LZString.compressToEncodedURIComponent(jsonString);

        // 3. Construct URL
        const baseUrl = window.location.href.split('?')[0];
        const fullUrl = `${baseUrl}?template=${compressed}`;
        
        setShareUrl(fullUrl);
      } catch (e) {
        console.error("Compression failed", e);
        setShareUrl("Virhe linkin luonnissa.");
      }
    }
  }, [showShareModal, currentSections, currentIntroText]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '112') {
        onLogin();
        setError(false);
    } else {
        setError(true);
        setPasswordInput('');
    }
  };

  const handleDownload = (url: string, filenamePrefix: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'template';
    link.download = `perehdytys-${filenamePrefix}-${safeName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartScan = () => {
    onScanRequest();
  };

  const handleStartEdit = () => {
    onEditContent();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Perehdytysrunko',
          text: 'Tässä on päivitetty perehdytysrunko.',
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      copyToClipboard();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-400" />
              <h3 className="font-bold">Esihenkilökirjautuminen</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                Salasana
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg outline-none transition-colors ${error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-slate-800'}`}
                  autoFocus
                  placeholder="Syötä salasana"
                />
                <KeyRound className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              {error && (
                <p className="text-red-500 text-xs mt-2 font-medium">
                  Väärä salasana. Yritä uudelleen.
                </p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors shadow-lg shadow-slate-900/20"
            >
              Kirjaudu
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- SHARE URL VIEW ---
  if (showShareModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
          <div className="bg-slate-800 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Link className="w-5 h-5 text-accent" />
              <h3 className="font-bold">Jaa perehdytysrunko linkillä</h3>
            </div>
            <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-slate-700 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
             <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-900">
               Lähetä tämä linkki pelastajalle (esim. WhatsApp tai sähköposti). Kun pelastaja avaa linkin omalla laitteellaan, sovellus päivittää perehdytysrungon automaattisesti.
             </div>

             <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                 Jako-linkki
               </label>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   readOnly 
                   value={shareUrl} 
                   className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-gray-600 text-sm focus:outline-none"
                 />
                 <button 
                   onClick={copyToClipboard}
                   className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                 >
                   {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                   {copied ? 'Kopioitu' : 'Kopioi'}
                 </button>
               </div>
             </div>

             <button 
               onClick={shareNative}
               className="w-full py-4 bg-accent text-white rounded-xl font-bold hover:bg-sky-600 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
             >
               <Share2 className="w-5 h-5" />
               Jaa sovellukseen...
             </button>
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button 
              onClick={() => setShowShareModal(false)}
              className="w-full py-3 bg-white border border-gray-300 text-slate-700 rounded-lg font-bold hover:bg-gray-100"
            >
              Sulje
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN MENU VIEW ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <h3 className="font-bold">Esihenkilön Työkalut</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
          
          {/* Section 1: Generate Supervisor ID */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase text-slate-500 border-b pb-1">1. Esihenkilön Tunniste</h4>
            
            <div className="w-full">
              <label className="block text-xs font-bold text-gray-400 mb-2">
                Esihenkilön Nimi
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Esim. Matti Meikäläinen"
                  className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-slate-800 outline-none transition-colors"
                />
                <UserPen className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className={`p-4 bg-white border-2 rounded-xl flex items-center justify-center transition-all duration-300 ${qrUrl ? 'border-green-500 shadow-sm' : 'border-gray-100 bg-gray-50'}`}>
              {qrUrl ? (
                <div className="text-center space-y-2">
                    <img src={qrUrl} alt="Esihenkilön QR-koodi" className="w-32 h-32 mx-auto" />
                    <button 
                        onClick={() => handleDownload(qrUrl, 'esihenkilö')}
                        className="text-xs flex items-center justify-center gap-1 text-slate-500 hover:text-slate-800 mx-auto"
                    >
                        <Download className="w-3 h-3" /> Tallenna kuva
                    </button>
                </div>
              ) : (
                <div className="w-32 h-32 flex items-center justify-center text-gray-300 text-xs italic">
                  Kirjoita nimi...
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Scan Trainee */}
          <div className="space-y-4">
             <h4 className="text-sm font-bold uppercase text-slate-500 border-b pb-1">2. Tarkista Pelastaja</h4>
             <button
               onClick={handleStartScan}
               className="w-full py-3 bg-accent hover:bg-sky-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-3 shadow-lg shadow-sky-500/20"
             >
                <ScanLine className="w-5 h-5" />
                Tarkista Pelastajan Passi
             </button>
          </div>

          {/* Section 3: Edit Form */}
          <div className="space-y-4">
             <h4 className="text-sm font-bold uppercase text-slate-500 border-b pb-1">3. Hallinta</h4>
             <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
               <p className="text-xs text-gray-500 text-center">
                 Muokkaa lomakkeen rakennetta ja jaa se pelastajalle.
               </p>
               
               <button
                 onClick={handleStartEdit}
                 className="w-full py-3 bg-white border-2 border-slate-200 hover:border-slate-400 text-slate-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-3"
               >
                  <FilePenLine className="w-5 h-5" />
                  Muokkaa runkoa
               </button>

               <button
                 onClick={() => setShowShareModal(true)}
                 className="w-full py-3 bg-white border-2 border-slate-200 hover:border-slate-400 text-slate-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-3"
               >
                  <Share2 className="w-5 h-5" />
                  Jaa linkki
               </button>
             </div>
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
