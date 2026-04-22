
import React, { useState, useEffect, useMemo } from 'react';
import LZString from 'lz-string';
import { SECTIONS, DEFAULT_INTRO_TEXT, DEFAULT_ORG_SETTINGS } from './constants';
import { TaskState, TraineeQrData, Section, OrganizationSettings, TemplateRawData } from './types';
import { SectionGroup } from './components/SectionGroup';
import { storageService, AppData } from './storage';
import { SupervisorBadge } from './components/SupervisorBadge';
import { ScannerModal } from './components/ScannerModal';
import { TraineeBadge } from './components/TraineeBadge';
import { TraineeReportModal } from './components/TraineeReportModal';
import { CompletionModal } from './components/CompletionModal';
import { CertificateView } from './components/CertificateView';
import { ContentEditorModal } from './components/ContentEditorModal';
import { UserGuideModal } from './components/UserGuideModal';
import { ClearConfirmationModal } from './components/ClearConfirmationModal';
import { Printer, Flame, CheckCircle, QrCode, Trash2, UserCheck, Trophy, CircleHelp, Building2, MapPin, FileText } from 'lucide-react';

const App: React.FC = () => {
  // Data State
  const [traineeName, setTraineeName] = useState('');
  const [tasks, setTasks] = useState<Record<string, TaskState>>({});
  const [sections, setSections] = useState<Section[]>(SECTIONS);
  const [introText, setIntroText] = useState(DEFAULT_INTRO_TEXT);
  const [orgSettings, setOrgSettings] = useState<OrganizationSettings>(DEFAULT_ORG_SETTINGS);
  
  // UI State
  const [showSupervisorBadge, setShowSupervisorBadge] = useState(false);
  const [isSupervisorAuthenticated, setIsSupervisorAuthenticated] = useState(false); // New: Persist auth state
  const [showTraineeBadge, setShowTraineeBadge] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isPrintingCertificate, setIsPrintingCertificate] = useState(false);
  
  // Keep track if we've already shown the celebration once per session to avoid annoyance
  const [hasCelebrated, setHasCelebrated] = useState(false);
  
  // Scan States
  const [scanningTaskId, setScanningTaskId] = useState<string | null>(null);
  const [scanningSectionId, setScanningSectionId] = useState<string | null>(null);
  const [isSupervisorScanning, setIsSupervisorScanning] = useState(false);
  
  const [scannedTraineeData, setScannedTraineeData] = useState<TraineeQrData | null>(null);

  // Helper to generate IDs for imported content
  const generateSlugId = (text: string, prefix: string) => {
    const slug = text.toLowerCase()
      .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/å/g, 'a')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');
    return `${prefix}_${slug.substring(0, 15)}_${Math.floor(Math.random() * 1000)}`;
  };

  // Helper to Apply Template Data
  const applyTemplate = (rawData: TemplateRawData) => {
    // Un-minify sections and regenerate IDs if missing
    const newSections: Section[] = rawData.s.map((minSec, idx) => ({
      id: minSec.i || generateSlugId(minSec.t, `s${idx}`),
      title: minSec.t,
      subtitle: minSec.s,
      items: minSec.it.map((minItem, iIdx) => ({
        id: minItem.i || generateSlugId(minItem.l, `i${idx}_${iIdx}`),
        label: minItem.l
      }))
    }));
    
    // Save locally
    setSections(newSections);
    setIntroText(rawData.intro);
    
    // Persist to storage
    const currentData = storageService.load();
    const newData: AppData = {
        ...currentData,
        customSections: newSections,
        introText: rawData.intro,
        lastUpdated: new Date().toISOString()
    };
    storageService.save(newData);

    alert('Uusi perehdytysrunko aktivoitu onnistuneesti!');
  };

  // Load data on mount & Check for URL Template Params
  useEffect(() => {
    // 1. Load LocalStorage
    const data = storageService.load();
    setTraineeName(data.traineeName);
    setTasks(data.tasks);
    if (data.customSections && data.customSections.length > 0) {
      setSections(data.customSections);
    }
    if (data.introText) {
      setIntroText(data.introText);
    }
    if (data.organizationSettings) {
      setOrgSettings(data.organizationSettings);
    }

    // 2. Check for Template in URL
    const params = new URLSearchParams(window.location.search);
    const templateString = params.get('template');

    if (templateString) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(templateString);
        if (decompressed) {
          const rawData = JSON.parse(decompressed) as TemplateRawData;
          
          if (rawData && rawData.s && confirm('Linkistä löytyi uusi perehdytysrunko. Haluatko ottaa sen käyttöön? Tämä päivittää lomakkeen rakenteen.')) {
             applyTemplate(rawData);
             
             // Clean URL without refresh
             const newUrl = window.location.pathname;
             window.history.replaceState({}, '', newUrl);
          }
        }
      } catch (e) {
        console.error("Template load failed", e);
      }
    }
  }, []);

  // Save data on change
  const saveData = (
    newName: string, 
    newTasks: Record<string, TaskState>, 
    newSections?: Section[], 
    newIntroText?: string,
    newOrgSettings?: OrganizationSettings
  ) => {
    const data: AppData = {
      traineeName: newName,
      tasks: newTasks,
      customSections: newSections || sections,
      introText: newIntroText || introText,
      organizationSettings: newOrgSettings || orgSettings,
      lastUpdated: new Date().toISOString()
    };
    storageService.save(data);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setTraineeName(newName);
    saveData(newName, tasks);
  };

  const handleOrgSettingChange = (field: keyof OrganizationSettings, value: string) => {
    const newSettings = { ...orgSettings, [field]: value };
    setOrgSettings(newSettings);
    saveData(traineeName, tasks, sections, introText, newSettings);
  };

  const handleTaskChange = (taskId: string, updates: Partial<TaskState>) => {
    const newTasks = {
      ...tasks,
      [taskId]: {
        ...(tasks[taskId] || { date: '', traineeSigned: false, trainerSigned: false }),
        ...updates
      }
    };
    setTasks(newTasks);
    saveData(traineeName, newTasks);
  };

  const handleUpdateContent = (newSections: Section[], newIntroText: string) => {
    setSections(newSections);
    setIntroText(newIntroText);
    // Don't update orgSettings here, as they are now handled by the trainee in the main view
    saveData(traineeName, tasks, newSections, newIntroText, orgSettings);
  };
  
  // Wrapper for editor save to redirect back to supervisor menu
  const handleEditorSave = (newSections: Section[], newIntroText: string) => {
    handleUpdateContent(newSections, newIntroText);
    // Re-open supervisor menu automatically
    setShowSupervisorBadge(true);
  };

  const handleResetContent = () => {
    setSections(SECTIONS);
    setIntroText(DEFAULT_INTRO_TEXT);
    setOrgSettings(DEFAULT_ORG_SETTINGS);
    saveData(traineeName, tasks, SECTIONS, DEFAULT_INTRO_TEXT, DEFAULT_ORG_SETTINGS);
  };
  
  // Wrapper for editor reset to redirect back to supervisor menu
  const handleEditorReset = () => {
    handleResetContent();
    setShowSupervisorBadge(true);
  };

  const handleScanRequest = (taskId: string) => {
    setScanningTaskId(taskId);
  };

  const handleSectionScanRequest = (sectionId: string) => {
    setScanningSectionId(sectionId);
  };

  const handleSupervisorScanRequest = () => {
    setIsSupervisorScanning(true);
  };

  const handleScanSuccess = (data: any) => {
    const today = new Date().toISOString().split('T')[0];

    // Scenario 1: Trainee scanning Supervisor Signature for a SINGLE TASK
    if (scanningTaskId && data.type === 'SUPERVISOR_SIGNATURE' && data.name) {
       handleTaskChange(scanningTaskId, {
         trainerSigned: true,
         trainerName: data.name,
         date: today
       });
       setScanningTaskId(null);
    }
    // Scenario 2: Trainee scanning Supervisor Signature for a WHOLE SECTION
    else if (scanningSectionId && data.type === 'SUPERVISOR_SIGNATURE' && data.name) {
       const section = sections.find(s => s.id === scanningSectionId);
       if (section) {
         const newTasks = { ...tasks };
         section.items.forEach(item => {
           // Update each task in the section
           newTasks[item.id] = {
             ...(newTasks[item.id] || { date: '', traineeSigned: false, trainerSigned: false }),
             trainerSigned: true,
             trainerName: data.name,
             date: today
           };
         });
         setTasks(newTasks);
         saveData(traineeName, newTasks);
       }
       setScanningSectionId(null);
    }
    // Scenario 3: Supervisor scanning Trainee Progress
    else if (isSupervisorScanning && data.type === 'TRAINEE_PROGRESS') {
      setIsSupervisorScanning(false);
      setScannedTraineeData(data);
    }
    // Error / Mismatch handling
    else {
      if ((scanningTaskId || scanningSectionId) && data.type !== 'SUPERVISOR_SIGNATURE') {
         alert("Virhe: Skannasit pelastajan passin. Skannaa esimiehen kuittauskoodi.");
      }
      else if (isSupervisorScanning && data.type !== 'TRAINEE_PROGRESS') {
         alert("Virhe: Skannasit esimiehen koodin. Skannaa pelastajan passi.");
      }
    }
  };

  const closeScanner = () => {
    setScanningTaskId(null);
    setScanningSectionId(null);
    setIsSupervisorScanning(false);
  };

  // Logic to actually wipe data (called by modal)
  const performClearAll = () => {
    const currentSections = sections;
    const currentIntro = introText;
    const currentOrg = orgSettings;
    
    storageService.clear();
    
    // Reset state
    setTraineeName('');
    setTasks({});
    setHasCelebrated(false);
    
    // Restore structure settings (user doesn't want to lose the layout, just the data)
    setSections(currentSections);
    setIntroText(currentIntro);
    setOrgSettings(currentOrg);
    
    // Immediately save the structure back so it persists
    const freshData: AppData = {
        traineeName: '',
        tasks: {},
        customSections: currentSections,
        introText: currentIntro,
        organizationSettings: currentOrg,
        lastUpdated: new Date().toISOString()
    };
    storageService.save(freshData);
    
    setShowClearConfirm(false);
  };

  // Standard print (checklist)
  const printForm = () => {
    setIsPrintingCertificate(false);
    // Allow React to update state before printing
    setTimeout(() => window.print(), 100);
  };

  // Certificate print (diploma)
  const printCertificate = () => {
    setIsPrintingCertificate(true);
    setTimeout(() => {
      window.print();
      // Reset after print dialog closes (approximate) or let user switch back manually
      const cleanup = () => setIsPrintingCertificate(false);
      window.addEventListener('afterprint', cleanup, { once: true });
      setTimeout(cleanup, 5000); 
    }, 100);
  };

  // Calculate stats
  const stats = useMemo(() => {
    let total = 0;
    let completed = 0;
    sections.forEach(section => {
      section.items.forEach(item => {
        total++;
        const s = tasks[item.id];
        if (s && s.traineeSigned && s.trainerSigned) {
          completed++;
        }
      });
    });
    return { total, completed, percentage: total === 0 ? 0 : Math.round((completed/total) * 100) };
  }, [tasks, sections]);

  // Check for completion
  useEffect(() => {
    if (stats.percentage === 100 && !hasCelebrated && stats.total > 0) {
      setShowCompletionModal(true);
      setHasCelebrated(true);
    }
  }, [stats.percentage, hasCelebrated, stats.total]);

  // Determine date to show on certificate (today)
  const todayDate = new Date().toLocaleDateString('fi-FI');

  return (
    <>
      {/* CERTIFICATE VIEW (Only visible when printing certificate) */}
      {isPrintingCertificate && (
         <CertificateView 
           traineeName={traineeName} 
           completionDate={todayDate}
           orgSettings={orgSettings} 
         />
      )}

      {/* MAIN APP VIEW (Hidden when printing certificate) */}
      <div className={`min-h-screen bg-gray-100 print:bg-white pb-12 ${isPrintingCertificate ? 'hidden' : 'block'}`}>
        
        {/* Header Bar */}
        <header className="bg-primary text-white shadow-md sticky top-0 z-20 print:static print:shadow-none print:bg-white print:text-black">
          <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Logo & Title */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="bg-orange-500 p-2 rounded-lg print:hidden">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">Pelastajan Perehdytys</h1>
                <p className="text-xs text-slate-300 print:hidden">Sähköinen seurantalomake</p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end no-print overflow-x-auto pb-1 sm:pb-0">
              
              <button
                onClick={() => setShowUserGuide(true)}
                className="flex items-center gap-1.5 sm:gap-2 bg-slate-700 hover:bg-slate-600 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors border border-slate-600 whitespace-nowrap mr-2"
                title="Käyttöohjeet"
              >
                <CircleHelp className="w-4 h-4 text-sky-300" />
                <span className="hidden sm:inline">Ohjeet</span>
              </button>

              {stats.percentage === 100 && (
                <button
                  onClick={() => setShowCompletionModal(true)}
                  className="flex items-center gap-1.5 sm:gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors shadow-lg animate-pulse font-bold whitespace-nowrap"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Valmis!</span>
                </button>
              )}

              <button
                onClick={() => setShowTraineeBadge(true)}
                className="flex items-center gap-1.5 sm:gap-2 bg-slate-800 hover:bg-slate-700 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors border border-slate-700 whitespace-nowrap"
              >
                <UserCheck className="w-4 h-4 text-accent" />
                <span className="sm:hidden">Passi</span>
                <span className="hidden sm:inline">Oma Passi</span>
              </button>

              <div className="w-px h-6 bg-slate-700 mx-0.5 sm:mx-1"></div>

              <button 
                onClick={() => setShowSupervisorBadge(true)}
                className="flex items-center gap-1.5 sm:gap-2 bg-slate-800 hover:bg-slate-700 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors border border-slate-700 whitespace-nowrap"
              >
                <QrCode className="w-4 h-4 text-green-400" />
                <span className="sm:hidden">Esimies</span>
                <span className="hidden sm:inline">Esimiestyökalut</span>
              </button>

              <button 
                onClick={() => setShowClearConfirm(true)}
                className="p-2 bg-red-900/50 hover:bg-red-900 rounded-lg transition-colors text-red-200 ml-1 sm:ml-2"
                title="Tyhjennä lomake (säilyttää rakenteen)"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 print:py-0 print:px-0">
          
          {/* Name Input & Intro */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6 print:border-none print:shadow-none print:p-0">
            
            <div className="mb-6 no-print">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                Pelastajan Nimi
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={traineeName}
                  onChange={handleNameChange}
                  placeholder="Kirjoita nimesi tähän..."
                  className="w-full text-lg font-bold text-slate-800 border-b-2 border-slate-200 focus:border-accent outline-none py-2 pl-9 bg-transparent transition-colors placeholder:font-normal placeholder:text-gray-300"
                />
                <UserCheck className="w-6 h-6 text-gray-400 absolute left-0 top-2" />
              </div>
            </div>

            {/* Organization Settings Input for Trainee */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 no-print mb-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Tiedot
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Organisaatio</label>
                   <div className="relative">
                     <input 
                       type="text" 
                       value={orgSettings.name}
                       onChange={(e) => handleOrgSettingChange('name', e.target.value)}
                       className="w-full pl-7 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-accent outline-none bg-white"
                       placeholder="Esim. Hyvinvointialue"
                     />
                     <Building2 className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                   </div>
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Yksikkö</label>
                   <input 
                     type="text" 
                     value={orgSettings.subtitle}
                     onChange={(e) => handleOrgSettingChange('subtitle', e.target.value)}
                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-accent outline-none bg-white"
                     placeholder="Esim. Pelastustoimi"
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Paikkakunta</label>
                   <div className="relative">
                     <input 
                       type="text" 
                       value={orgSettings.city}
                       onChange={(e) => handleOrgSettingChange('city', e.target.value)}
                       className="w-full pl-7 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-accent outline-none bg-white"
                       placeholder="Esim. Helsinki"
                     />
                     <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                   </div>
                </div>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-slate-600 mb-2 print:text-xs whitespace-pre-line">
              {introText}
            </div>

            {/* Print Header */}
            <div className="hidden print:block mb-8 border-b-2 border-black pb-4">
                <span className="text-sm text-gray-500 uppercase">Pelastaja</span>
                <div className="text-2xl font-bold">{traineeName}</div>
                <div className="mt-2 text-xs text-gray-500">
                  {orgSettings.name} - {orgSettings.subtitle}
                </div>
            </div>
          </div>

          {/* Sticky Progress Bar */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-8 flex items-center gap-4 no-print sticky top-20 z-10 transition-shadow">
            <div className={`p-2 rounded-full ${stats.percentage === 100 ? 'bg-green-100' : 'bg-gray-100'}`}>
              <CheckCircle className={`w-6 h-6 ${stats.percentage === 100 ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-1">
                <span className="font-bold text-slate-700">Edistyminen</span>
                <span className="text-sm font-medium text-accent">{stats.completed} / {stats.total} ({stats.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-700 ${stats.percentage === 100 ? 'bg-green-500' : 'bg-accent'}`}
                  style={{ width: `${stats.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Form Sections (Using state 'sections' instead of constant 'SECTIONS') */}
          <div className="space-y-4">
            {sections.map(section => (
              <SectionGroup 
                key={section.id} 
                section={section} 
                tasks={tasks} 
                traineeName={traineeName}
                onTaskChange={handleTaskChange}
                onScanRequest={handleScanRequest}
                onSectionScanRequest={handleSectionScanRequest}
              />
            ))}
          </div>

          {/* Print Signature Box (Only for list view) */}
          <div className="hidden print:block mt-8 pt-8 border-t-2 border-black page-break">
            {/* Signatures removed per request for the checklist printout, kept simple */}
            <div className="text-center text-xs text-gray-500">
              Tulostettu: {todayDate} - {orgSettings.city}
            </div>
          </div>

        </main>

        {/* Modals */}
        {showClearConfirm && (
          <ClearConfirmationModal 
            onConfirm={performClearAll} 
            onClose={() => setShowClearConfirm(false)} 
          />
        )}

        {showSupervisorBadge && (
          <SupervisorBadge 
            onClose={() => {
              setShowSupervisorBadge(false);
              setIsSupervisorAuthenticated(false);
            }} 
            onScanRequest={() => {
              setShowSupervisorBadge(false);
              handleSupervisorScanRequest();
            }}
            onEditContent={() => {
              setShowSupervisorBadge(false);
              setShowEditor(true);
            }}
            currentSections={sections}
            currentIntroText={introText}
            isAuthenticated={isSupervisorAuthenticated} // Pass auth state
            onLogin={() => setIsSupervisorAuthenticated(true)} // Handle login
          />
        )}

        {showEditor && (
          <ContentEditorModal 
            initialSections={sections}
            initialIntroText={introText}
            onSave={handleEditorSave} // Use wrapper
            onReset={handleEditorReset} // Use wrapper
            onClose={() => setShowEditor(false)}
          />
        )}

        {showUserGuide && (
          <UserGuideModal onClose={() => setShowUserGuide(false)} />
        )}

        {showTraineeBadge && (
          <TraineeBadge 
            traineeName={traineeName}
            tasks={tasks}
            onClose={() => setShowTraineeBadge(false)}
          />
        )}
        
        {scannedTraineeData && (
          <TraineeReportModal 
            data={scannedTraineeData}
            onClose={() => setScannedTraineeData(null)}
          />
        )}
        
        {showCompletionModal && (
          <CompletionModal
            traineeName={traineeName}
            onClose={() => setShowCompletionModal(false)}
            onPrint={printCertificate} 
          />
        )}

        {(scanningTaskId || scanningSectionId || isSupervisorScanning) && (
          <ScannerModal 
            onScanSuccess={handleScanSuccess} 
            onClose={closeScanner} 
          />
        )}

      </div>
    </>
  );
};

export default App;
