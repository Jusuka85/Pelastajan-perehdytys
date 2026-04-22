
import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, AlertCircle } from 'lucide-react';

interface ScannerModalProps {
  onScanSuccess: (data: any) => void;
  onClose: () => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const isScanningRef = useRef(false);

  useEffect(() => {
    // Small delay to ensure DOM is mounted
    const initTimer = setTimeout(() => {
      // If the component unmounted during the timeout, don't start
      if (!document.getElementById("reader")) return;

      const html5QrCode = new Html5Qrcode("reader", false);
      scannerRef.current = html5QrCode;

      html5QrCode.start(
        { facingMode: "environment" }, // Prefer back camera
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            
            // Accept Supervisor Signature OR Trainee Progress
            if ((data.type === 'SUPERVISOR_SIGNATURE' && data.name) || 
                (data.type === 'TRAINEE_PROGRESS' && data.completedTaskIds)) {
              
              // Stop scanning immediately on success
              if (isScanningRef.current) {
                html5QrCode.stop().then(() => {
                   isScanningRef.current = false;
                   html5QrCode.clear();
                   onScanSuccess(data);
                }).catch(err => {
                   console.warn("Stop failed on success", err);
                   // Even if stop fails, we try to proceed
                   onScanSuccess(data);
                });
              } else {
                 onScanSuccess(data);
              }
            }
          } catch (e) {
            // Ignore parse errors, user might scan a random QR code
          }
        },
        (errorMessage) => {
          // Frame scan error, ignore
        }
      ).then(() => {
         isScanningRef.current = true;
      }).catch((err) => {
        console.error("Camera start failed", err);
        setError("Kameran käynnistys epäonnistui. Tarkista, että olet antanut selaimelle luvan käyttää kameraa.");
        isScanningRef.current = false;
      });

    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (scannerRef.current) {
        // Only attempt to stop if we know it's running
        if (isScanningRef.current) {
          scannerRef.current.stop().then(() => {
            return scannerRef.current.clear();
          }).catch((err: any) => {
             console.warn("Scanner stop/clear error:", err);
          });
        } else {
            // If it wasn't running, just try to clear the instance from memory
            try {
                scannerRef.current.clear();
            } catch (e) {
                // Ignore
            }
        }
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden relative flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-4 bg-slate-900 text-white text-center shrink-0">
          <h3 className="font-bold flex items-center justify-center gap-2">
            <Camera className="w-5 h-5" />
            Lue QR-koodi
          </h3>
        </div>

        <div className="relative bg-black flex-1 min-h-[300px] flex items-center justify-center overflow-hidden">
          {/* Container for the library */}
          <div id="reader" className="w-full h-full"></div>
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/80 z-10">
              <div className="text-center text-white">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                <p>{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 text-center text-sm text-gray-500 shrink-0">
           Kohdista kamera esihenkilön korttiin tai pelastajan passiin.
        </div>
      </div>
    </div>
  );
};
