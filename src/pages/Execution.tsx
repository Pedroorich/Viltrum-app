import { TopAppBar } from '../components/TopAppBar';
import { Play, Check, Timer, Camera, Video, ShieldAlert, Award, Crosshair, Radar, ShoppingCart, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/authContext';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tutorial } from '../data/tutorials';
import { GoogleGenAI } from '@google/genai';
import { arsenalTools } from '../data/arsenal';

export default function Execution() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const tutorial = location.state?.tutorial as Tutorial | undefined;

  const epicSteps = tutorial?.passos || [
    "Viltrumita, isole o perímetro (Corte a fonte/registro)",
    "Aplique força e manobra de reparo (Conserto)",
    "Confira o selamento tático pós-combate (Finalização)"
  ];

  const [checks, setChecks] = useState<boolean[]>(() => new Array(epicSteps.length).fill(false));
  const [dominado, setDominado] = useState(false);
  const [arModeEnabled, setArModeEnabled] = useState(false);
  const [arUnlocked, setArUnlocked] = useState(false);
  const [victory, setVictory] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [arAnalysisText, setArAnalysisText] = useState("APONTE PARA O ALVO E SOLICITE VARREDURA.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isAnalyzingRef = useRef(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Get recommended tools based on category
  const recommendedTools = tutorial 
    ? arsenalTools.filter(t => t.categoria === tutorial.categoria || t.categoria === "Ferramentas" || t.categoria === "Ferramentas Pesadas").slice(0, 2)
    : [];

  useEffect(() => {
    if (!tutorial) {
      navigate('/conquistas');
    }
  }, [tutorial, navigate]);

  // Unlock AR mode after 5 seconds (Simulating 30% of video)
  useEffect(() => {
    const timer = setTimeout(() => {
      setArUnlocked(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const enableARMode = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setMediaStream(stream);
      setCameraError(null);
      setArModeEnabled(true);
      setArAnalysisText("APONTE E SOLICITE VARREDURA TÁTICA.");
    } catch (err) {
      setCameraError("MODO AR INDISPONÍVEL. CÂMERA DESTRUÍDA OU BLOQUEADA.");
      setArModeEnabled(true);
    }
  };

  const disableARMode = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setCameraError(null);
    setArModeEnabled(false);
  };

  useEffect(() => {
    if (arModeEnabled && mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(e => console.error("Video play error:", e));
    }
  }, [arModeEnabled, mediaStream]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (arModeEnabled && mediaStream && !cameraError && !dominado) {
      // Faz apenas uma varredura inicial após ativar a câmera
      timeoutId = setTimeout(() => {
        analyzeFrame();
      }, 1500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [arModeEnabled, mediaStream, cameraError, dominado]);

  // Automatic AI Camera Analysis
  const analyzeFrame = async () => {
    if (!arModeEnabled || !mediaStream || dominado || cameraError) return;
    if (!videoRef.current || !canvasRef.current || isAnalyzingRef.current) return;
    
    isAnalyzingRef.current = true;
    setIsAnalyzing(true);
    setArAnalysisText("ESCOPEANDO SETOR...");
    
    const activeIndex = checks.findIndex(c => !c);
    const activeStep = activeIndex >= 0 ? epicSteps[activeIndex] : "FINALIZADO";

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const base64Image = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
      
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("CHAVE DE API GEMINI NÃO ENCONTRADA NO VERCEL.");
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Você é uma IA Tática Visual guiando um conserto: "${tutorial?.titulo}".
Passo atual que o usuário DEVE resolver agora: "${activeStep}"

Sua missão:
1. Analise a imagem da câmera. O usuário JÁ EXECUTOU E CONCLUIU este passo atual na imagem? (se sim, concluido: true)
2. Diga o que ele DEVE FAZER AGORA (instrução sobre o passo, ou alertar sobre erro).

Responda EXCLUSIVAMENTE em JSON:
{
  "concluido": true ou false,
  "dica": "SUA INSTRUÇÃO AQUI. MÁX 8 PALAVRAS. TODO MAIÚSCULAS. TOM MILITAR."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
            { text: prompt }
          ],
        },
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const responseText = typeof response.text === 'function' ? response.text() : response.text;
      
      if (responseText) {
        try {
          const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          const result = JSON.parse(cleanJson);
          
          if (result.dica) {
            setArAnalysisText(result.dica);
          }
          
          if (result.concluido && activeIndex >= 0) {
            setChecks(prev => {
              const newChecks = [...prev];
              newChecks[activeIndex] = true;
              return newChecks;
            });
            setArAnalysisText("ALVO ABATIDO. PRÓXIMO PASSO.");
          }
        } catch (e) {
          console.error("Falha no parse do JSON da IA:", e);
          setArAnalysisText("CONTINUE EXECUTANDO A MANOBRA.");
        }
      }
    } catch(e: any) {
      console.error("Radar corrompido:", e);
      setArAnalysisText("ERRO: " + (e.message || "Desconhecido").substring(0, 50).toUpperCase());
    } finally {
      isAnalyzingRef.current = false;
      setIsAnalyzing(false);
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  if (!tutorial) return null;

  const videoId = tutorial.linkYoutube.split('v=')[1];

  const handleCheck = (index: number) => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);
  };

  const allChecked = checks.every(c => c);
  const progress = (checks.filter(Boolean).length / checks.length) * 100;

  const marcarComoConquistado = async () => {
    if (!allChecked || dominado) return;
    setDominado(true);
    setVictory(true);

    // Prepare Epic Notification
    const showEpicNotification = () => {
      const title = "Viltrumita, você dominou esta conquista!";
      const options = {
        body: `Alvo Abatido: ${tutorial.titulo}\n+50 XP Injetados no Sistema.`,
        icon: '/vite.svg',
        badge: '/vite.svg',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        requireInteraction: false
      };

      const fireNotification = async () => {
        try {
          if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            if (registration && 'showNotification' in registration) {
              await registration.showNotification(title, options);
              return;
            }
          }
          // Fallback if no SW or showNotification isn't supported
          new Notification(title, options);
        } catch (e) {
          console.error("Falha ao emitir notificação nativa", e);
        }
      };

      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          fireNotification();
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              fireNotification();
            }
          });
        }
      }
    };

    showEpicNotification();

    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          xp: increment(50), // Requisito: +50 XP
          updatedAt: serverTimestamp()
        });

        await addDoc(collection(userRef, 'conquests'), {
          userId: user.uid,
          title: tutorial.titulo,
          type: "Tutorial Interativo",
          xpEarned: 50,
          completedAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Falha ao salvar a conquista.", error);
      }
    }
  };

  const fecharVitoria = () => {
    navigate('/conquistas');
  };

  return (
    <div className="font-body fixed inset-0 bg-[#0a0a0a] text-on-surface overflow-hidden flex flex-col items-center">
      
      {/* VICTORY OVERLAY */}
      {victory && (
        <div className="fixed inset-0 z-[100] bg-[#8B0000]/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="absolute inset-0 noise-bg mix-blend-overlay opacity-50 block pointer-events-none"></div>
          
          <button 
            onClick={fecharVitoria}
            className="absolute top-6 right-6 text-white hover:text-black transition-colors rotate-0 hover:rotate-90 duration-300"
          >
            <X className="w-10 h-10" />
          </button>

          <Award className="w-32 h-32 text-on-primary mb-6 animate-bounce" />
          <h1 className="font-headline text-5xl md:text-7xl font-black text-center uppercase tracking-tighter text-on-primary drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            CONQUISTA REALIZADA!
          </h1>
          <p className="font-body text-2xl font-bold uppercase tracking-widest text-on-primary mt-4">
            A Glória Te Aguarda.
          </p>
          <div className="mt-8 bg-black/50 px-8 py-4 border-2 border-on-primary/30">
            <span className="font-headline text-4xl text-primary font-black">+ 50 XP</span>
          </div>

          <button 
            onClick={fecharVitoria}
            className="mt-12 bg-black text-white hover:bg-white hover:text-[#8B0000] border-2 border-white px-8 py-4 font-headline uppercase font-black tracking-widest transition-colors flex items-center gap-3 active:scale-95"
          >
            VOLTAR PARA BASE <ShieldAlert className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Media Area (YouTube or Camera AR) */}
      <div className={arModeEnabled ? "fixed inset-0 z-[60] bg-black animate-in fade-in duration-300" : "relative w-full h-[45vh] md:h-[50vh] bg-black border-b-4 border-[#8B0000] flex-shrink-0"}>
        
        {arModeEnabled ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            {cameraError ? (
              <div className="w-[80%] h-[80%] border-4 border-[#8B0000] bg-[#1a0000] flex flex-col items-center justify-center p-6 text-center shadow-[0_0_30px_rgba(139,0,0,0.4)] relative overflow-hidden">
                 <div className="absolute inset-0 noise-bg mix-blend-overlay opacity-30 pointer-events-none"></div>
                 <ShieldAlert className="w-16 h-16 text-[#ff4d4d] mb-4 animate-pulse relative z-10" />
                 <p className="font-headline text-2xl uppercase font-black text-[#ff4d4d] tracking-widest relative z-10 leading-tight">
                   {cameraError}
                 </p>
                 <p className="font-body text-outline mt-4 font-bold text-sm tracking-widest relative z-10 uppercase">
                   (Modo 2D de Sobrevivência Ativo)
                 </p>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                {/* AR Overlays */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                  <div className="w-48 h-48 sm:w-64 sm:h-64 border-4 border-primary/30 border-dashed rounded-full animate-pulse flex items-center justify-center relative">
                    <Crosshair className="text-primary/60 w-12 h-12 absolute" />
                  </div>
                  
                </div>
              </>
            )}
            
            {/* HUD Top Bar */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-50 pointer-events-none">
              <button 
                onClick={disableARMode}
                className="pointer-events-auto bg-black/80 p-3 text-white border border-outline-variant/30 hover:bg-[#8B0000] transition-colors flex items-center gap-2 font-headline uppercase text-xs shadow-lg active:scale-95"
              >
                <Video className="w-4 h-4" /> ABORTAR AR
              </button>
              <div className="bg-black/80 px-4 py-2 border border-primary/30 flex items-center gap-2 pointer-events-auto shadow-lg">
                <Timer className="text-primary w-4 h-4" />
                <span className="font-label text-primary text-xs uppercase tracking-widest font-bold">
                  {tutorial.duracao}
                </span>
              </div>
            </div>

            {/* HUD Steps Corner (Bottom Area) */}
            <div className="absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[450px] z-50 pointer-events-auto">
              <div className="bg-[#0a0a0a]/90 border-t-4 md:border-t-0 md:border-l-4 border-[#8B0000] p-4 sm:p-5 shadow-[0_0_40px_rgba(0,0,0,0.95)] backdrop-blur-md flex flex-col gap-3">
                <h3 className="font-headline text-outline text-[10px] sm:text-xs uppercase tracking-[0.2em] flex flex-col">
                  DIRETRIZES TÁTICAS (Sincronizado)
                </h3>

                {/* IA Feedback integrado na caixa */}
                <div className="bg-black/60 border border-[#8B0000]/50 p-3 flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute inset-0 noise-bg mix-blend-overlay opacity-20 pointer-events-none"></div>
                  <div className="flex items-center gap-2 relative z-10">
                    <Radar className={`w-4 h-4 ${isAnalyzing ? 'text-white animate-spin' : 'text-[#ff4d4d]'}`} />
                    <span className="font-label text-[10px] text-[#ff4d4d] uppercase tracking-widest font-bold">
                      {isAnalyzing ? 'ANALISANDO PROGRESSO...' : 'VARREDURA ATIVA'}
                    </span>
                  </div>
                  <span className="text-white font-headline font-black uppercase tracking-widest text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(255,0,0,0.6)] text-wrap leading-tight relative z-10">
                    {arAnalysisText}
                  </span>
                  {!allChecked && !dominado && (
                    <button 
                      onClick={analyzeFrame} 
                      disabled={isAnalyzing} 
                      className={`mt-2 bg-[#8B0000] text-white py-2 font-headline uppercase font-black text-[10px] sm:text-xs tracking-widest transition-all w-full flex items-center justify-center gap-2 relative z-10 ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#ff4d4d]/80 active:scale-[0.98] border border-white/20 shadow-[0_0_15px_rgba(139,0,0,0.5)]'}`}
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" /> VERIFICAR PROGRESSO
                    </button>
                  )}
                </div>

                 <div className="flex flex-col gap-2 sm:gap-3">
                  {epicSteps.map((step, index) => (
                    <label key={index} className="flex items-start gap-3 cursor-pointer group touch-manipulation">
                      <div className="relative flex items-center justify-center w-6 h-6 flex-shrink-0 bg-black border-2 border-outline-variant/40 group-hover:border-primary/80 transition-colors rounded-none mt-0.5">
                        <input type="checkbox" checked={checks[index]} onChange={() => handleCheck(index)} className="opacity-0 absolute inset-0 cursor-pointer peer" />
                        <Check className="w-4 h-4 text-primary hidden peer-checked:block" strokeWidth={4} />
                      </div>
                      <span className={`font-headline text-[11px] sm:text-[13px] uppercase tracking-wider leading-tight pt-1 transition-colors ${checks[index] ? 'text-primary/50 line-through' : 'text-white text-shadow-sm'}`}>
                        {step}
                      </span>
                    </label>
                  ))}
                 </div>
                 
                 {allChecked && !dominado && (
                   <button 
                      onClick={marcarComoConquistado}
                      className="mt-2 w-full bg-gradient-to-r from-[#8B0000] to-[#5a0000] text-white py-3 sm:py-4 font-headline uppercase font-black tracking-[0.15em] text-xs sm:text-sm flex items-center justify-center gap-2 animate-pulse active:scale-95 transition-transform"
                   >
                     <ShieldAlert className="w-4 h-4" /> CONQUISTAR ALVO
                   </button>
                 )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative">
            <iframe 
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&controls=1`}
              title={tutorial.titulo}
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen
            ></iframe>
            {/* Global Timer Overlay (Only show in YT mode now, since AR has its top bar) */}
            <div className="absolute top-4 right-4 bg-black/80 px-4 py-2 border border-primary/30 flex items-center gap-2 pointer-events-none shadow-lg">
              <Timer className="text-primary w-4 h-4" />
              <span className="font-label text-primary text-xs uppercase tracking-widest font-bold">
                Conquista em {tutorial.duracao}
              </span>
            </div>

            {/* AR Trigger Button */}
            {arUnlocked && (
              <button 
                onClick={enableARMode}
                className="absolute bottom-4 right-4 bg-[#8B0000] text-white p-3 sm:p-4 font-headline uppercase font-black text-xs sm:text-sm tracking-widest flex items-center gap-3 shadow-[0_0_20px_rgba(139,0,0,0.6)] hover:scale-105 active:scale-95 transition-all outline outline-2 outline-offset-2 outline-transparent hover:outline-white/30 animate-in slide-in-from-right"
              >
                <Camera className="w-5 h-5" />
                MODO AR LORDE
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Card / Steps Area */}
      <div className="flex-1 w-full max-w-3xl flex flex-col bg-surface-container-lowest md:rounded-t-3xl border-x-2 border-t-2 border-outline-variant/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] -mt-6 z-20 overflow-hidden relative">
        <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none mix-blend-overlay"></div>
        
        {/* Header content */}
        <div className="p-4 sm:p-6 pb-4 border-b border-outline-variant/20 relative z-10 bg-gradient-to-b from-[#131313] to-surface-container-lowest shrink-0">
          <button onClick={() => navigate('/conquistas')} className="text-outline hover:text-white font-label text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            ← ABORTAR INCURSÃO
          </button>
          <h2 className="font-headline text-2xl md:text-3xl font-black uppercase tracking-tight text-on-surface leading-tight text-balance">
            ALVO TÁTICO:
            <span className="text-primary block mt-1">{tutorial.titulo.replace(/^Conquiste\s/i, '')}</span>
          </h2>
          <div className="mt-3 flex items-center gap-2 font-body text-[10px] uppercase">
            <span className="bg-[#8B0000]/20 text-[#ff4d4d] px-2 py-1 font-bold border border-[#8B0000]/50 tracking-widest">{tutorial.nivel}</span>
            <span className="text-outline tracking-wider">{tutorial.categoria}</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="flex-1 min-h-0 overflow-y-auto relative z-10 flex flex-col">
          <div className="p-4 sm:p-6 flex flex-col gap-3">
            {epicSteps.map((step, index) => (
              <label key={index} className="flex gap-4 p-5 bg-[#131313] border border-outline-variant/10 cursor-pointer hover:border-[#8B0000]/50 transition-colors active:scale-[0.99] group overflow-hidden relative">
                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${checks[index] ? 'bg-[#8B0000]' : 'bg-transparent group-hover:bg-[#8B0000]/30'}`}></div>
                <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0 bg-black border-2 border-outline-variant/40 group-hover:border-[#ff4d4d]/50 transition-colors mt-0.5">
                  <input type="checkbox" checked={checks[index]} onChange={() => handleCheck(index)} className="opacity-0 absolute inset-0 cursor-pointer peer" />
                  <Check className="w-5 h-5 text-[#ff4d4d] hidden peer-checked:block" strokeWidth={4} />
                </div>
                <div className="flex-1 pt-1">
                  <p className={`font-headline uppercase leading-tight tracking-wider transition-colors ${checks[index] ? 'text-outline line-through' : 'text-white'}`}>
                    {step}
                  </p>
                  <p className={`font-body text-xs mt-2 uppercase tracking-widest transition-colors ${checks[index] ? 'text-[#8B0000]' : 'text-outline-variant'}`}>
                    Dominei Este Passo
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* Recommended Tools Arsenal Section */}
          {recommendedTools.length > 0 && (
            <div className="px-6 pb-6 pt-2 border-t border-outline-variant/10 mt-2">
              <h3 className="font-headline text-[#ff4d4d] text-[10px] uppercase tracking-[0.2em] mb-4">Armas Recomendadas para essa Missão</h3>
              <div className="flex flex-col gap-3">
                {recommendedTools.map(tool => (
                  <a key={tool.id} href={tool.link_redirecionamento} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 bg-black border border-outline-variant/20 hover:border-[#8B0000] transition-colors group cursor-pointer active:scale-[0.99]">
                    <div className="w-16 h-16 flex-shrink-0 border border-outline-variant/10 bg-[#131313]">
                      <img src={tool.imagem_url} alt={tool.nome} referrerPolicy="no-referrer" className="w-full h-full object-cover filter grayscale-[40%] group-hover:grayscale-0 transition-all" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-headline text-sm font-bold text-white uppercase line-clamp-1">{tool.nome}</h4>
                      <div className="flex items-center justify-between mt-2">
                         <span className="font-body text-[10px] text-outline-variant tracking-wider line-clamp-1 pr-2">{tool.descricao}</span>
                         <span className="font-label text-[10px] uppercase tracking-widest text-[#ff4d4d] flex shrink-0 items-center gap-1 group-hover:text-white transition-colors">Adquirir <ShoppingCart className="w-3 h-3"/></span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <p className="font-body text-[8px] sm:text-[9px] text-outline-variant uppercase tracking-widest mt-3 text-center">
                * Preços e disponibilidade geridos pelo Armeiro. O Império não taxa suas armas de combate.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Progress & Action Row */}
        <div className="p-4 sm:p-6 bg-surface-container-low border-t-2 border-outline-variant/20 flex flex-col gap-3 relative z-10 shrink-0">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center font-label uppercase text-[10px] font-bold tracking-widest">
              <span className="text-outline">Taxa de Conquista</span>
              <span className="text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-black border border-outline-variant/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-[#8B0000] shadow-[0_0_10px_#ff0000] transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <button 
            onClick={marcarComoConquistado}
            disabled={!allChecked || dominado}
            className={`w-full py-4 font-headline uppercase font-black tracking-[0.15em] text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group ${
              allChecked 
                ? 'bg-gradient-to-r from-[#8B0000] to-[#5a0000] text-white shadow-[0_0_30px_rgba(255,0,0,0.2)] active:scale-[0.98]' 
                : 'bg-surface-container-highest text-outline cursor-not-allowed opacity-50'
            }`}
          >
            {allChecked && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
            <ShieldAlert className={`w-6 h-6 ${allChecked ? 'animate-pulse' : ''}`} />
            Marcar como Conquistado
          </button>
        </div>
      </div>
    </div>
  );
}
