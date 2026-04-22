
import React, { useState } from 'react';
import { X, BookOpen, Shield, User, Info, CheckCircle2, QrCode, Smartphone, Share2 } from 'lucide-react';

interface UserGuideModalProps {
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'intro' | 'trainee' | 'supervisor'>('intro');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-800 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent" />
            <h3 className="font-bold text-lg">Sovelluksen Esittely ja Ohjeet</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 shrink-0">
          <button
            onClick={() => setActiveTab('intro')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'intro' ? 'bg-white border-b-2 border-accent text-slate-800' : 'text-gray-500 hover:text-slate-700 hover:bg-gray-100'
            }`}
          >
            <Info className="w-4 h-4" />
            Yleisesittely
          </button>
          <button
            onClick={() => setActiveTab('trainee')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'trainee' ? 'bg-white border-b-2 border-accent text-slate-800' : 'text-gray-500 hover:text-slate-700 hover:bg-gray-100'
            }`}
          >
            <User className="w-4 h-4" />
            Pelastajalle
          </button>
          <button
            onClick={() => setActiveTab('supervisor')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'supervisor' ? 'bg-white border-b-2 border-accent text-slate-800' : 'text-gray-500 hover:text-slate-700 hover:bg-gray-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            Esimiehelle
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto bg-white flex-1 text-slate-700 leading-relaxed">
          
          {/* TAB: INTRODUCTION (PRESENTATION TEXT) */}
          {activeTab === 'intro' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
                <h2 className="text-xl font-bold text-slate-900 mb-3">Sähköinen Pelastajan Perehdytys</h2>
                <p className="mb-4">
                  Tämä sovellus on moderni, turvallinen ja helppokäyttöinen työkalu pelastajien perehdytysprosessin hallintaan. 
                  Se korvaa perinteiset paperiset tarkistuslistat reaaliaikaisella digitaalisella seurannalla.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm h-fit"><Smartphone className="w-5 h-5 text-blue-500" /></div>
                    <div>
                      <h4 className="font-bold text-sm">Paperiton prosessi</h4>
                      <p className="text-xs text-gray-600">Ei enää hukkuvia papereita. Kaikki tiedot kulkevat mukana puhelimessa tai tabletilla.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm h-fit"><QrCode className="w-5 h-5 text-green-500" /></div>
                    <div>
                      <h4 className="font-bold text-sm">Turvalliset kuittaukset</h4>
                      <p className="text-xs text-gray-600">Esimiehen kuittaukset tehdään turvallisella QR-kooditunnisteella, mikä takaa oikeellisuuden.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm h-fit"><CheckCircle2 className="w-5 h-5 text-accent" /></div>
                    <div>
                      <h4 className="font-bold text-sm">Reaaliaikainen seuranta</h4>
                      <p className="text-xs text-gray-600">Edistymispalkki näyttää heti, kuinka suuri osa perehdytyksestä on suoritettu.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm h-fit"><Shield className="w-5 h-5 text-orange-500" /></div>
                    <div>
                      <h4 className="font-bold text-sm">Muokattava sisältö</h4>
                      <p className="text-xs text-gray-600">Esimiehet voivat muokata perehdytysrunkoa ja jakaa sen linkkinä uusille pelastajille.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">Miten se toimii?</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 bg-gray-50 p-4 rounded-lg">
                  <li>Pelastaja täyttää nimensä ja seuraa listaa omalta laitteeltaan.</li>
                  <li>Kun tehtävä on suoritettu, pelastaja merkitsee sen tehdyksi.</li>
                  <li>Esimies tai perehdyttäjä vahvistaa suorituksen näyttämällä omaa QR-koodiaan.</li>
                  <li>Kun kaikki kohdat ovat valmiina, järjestelmä luo automaattisesti virallisen todistuksen.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB: TRAINEE INSTRUCTIONS */}
          {activeTab === 'trainee' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Ohjeet Pelastajalle</h2>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">1</div>
                  <div>
                    <h4 className="font-bold">Aloitus</h4>
                    <p className="text-sm text-gray-600">Kirjoita nimesi sivun yläreunan kenttään. Tämä on tärkeää, jotta nimesi tulostuu todistukseen oikein.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">2</div>
                  <div>
                    <h4 className="font-bold">Tehtävien suorittaminen</h4>
                    <p className="text-sm text-gray-600">
                      Avaa osioita klikkaamalla otsikkoa. Kun olet suorittanut kohdan, paina 
                      <span className="inline-block px-2 py-0.5 mx-1 bg-white border rounded text-xs text-gray-500 font-bold">Pelastaja</span> 
                      -painiketta.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">3</div>
                  <div>
                    <h4 className="font-bold">Esimiehen kuittaus</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Kun haluat esimiehen kuittauksen, paina mustaa 
                      <span className="inline-block px-2 py-0.5 mx-1 bg-slate-800 text-white rounded text-xs font-bold">Esimies</span> 
                      -painiketta. Tämä avaa kameran.
                    </p>
                    <p className="text-sm text-gray-600">
                      Pyydä esimiestä näyttämään hänen QR-koodinsa ja lue se kameralla. Kuittaus ilmestyy riville automaattisesti.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">4</div>
                  <div>
                    <h4 className="font-bold">Oma Passi (QR)</h4>
                    <p className="text-sm text-gray-600">
                      Yläpalkin "Oma Passi" -painikkeesta saat näkyviin oman QR-koodisi. Esimies voi skannata tämän tarkistaakseen edistymisesi omalta laitteeltaan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SUPERVISOR INSTRUCTIONS */}
          {activeTab === 'supervisor' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Ohjeet Esimiehelle</h2>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                <p className="text-sm text-orange-800 font-medium">
                  Esimiestyökalut löytyvät yläpalkin painikkeesta. Salasana on oletuksena: <strong>112</strong>
                </p>
              </div>

              <div className="grid gap-6">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-bold flex items-center gap-2 mb-2">
                    <QrCode className="w-5 h-5 text-slate-700" />
                    Kuittaaminen (QR-koodi)
                  </h4>
                  <p className="text-sm text-gray-600">
                    Avaa esimiestyökalut ja kirjoita nimesi kenttään. Ruudulle ilmestyy henkilökohtainen QR-koodisi.
                    Näytä tätä koodia pelastajalle, kun hän pyytää kuittausta suoritukseen.
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-bold flex items-center gap-2 mb-2">
                    <Smartphone className="w-5 h-5 text-slate-700" />
                    Pelastajan edistymisen tarkistus
                  </h4>
                  <p className="text-sm text-gray-600">
                    Esimiestyökaluista voit valita "Tarkista Pelastajan Passi". Tämä avaa kameran.
                    Skannaa pelastajan luoma QR-koodi nähdäksesi yhteenvedon hänen suorituksistaan ilman paperien selailua.
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-bold flex items-center gap-2 mb-2">
                    <Share2 className="w-5 h-5 text-slate-700" />
                    Lomakkeen muokkaus ja jakaminen
                  </h4>
                  <p className="text-sm text-gray-600">
                    Voit muokata perehdytysrunkoa (lisätä kohtia, muuttaa tekstejä) painamalla "Muokkaa runkoa".
                    <br/><br/>
                    <strong>Tärkeää:</strong> Kun olet muokannut rungon valmiiksi, paina <strong>"Jaa linkki"</strong>. 
                    Lähetä tämä linkki pelastajalle (esim. sähköpostilla tai viestillä). Kun pelastaja avaa linkin omalla laitteellaan, sovellus päivittää perehdytysrungon automaattisesti.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors"
          >
            Sulje ohjeet
          </button>
        </div>
      </div>
    </div>
  );
};
