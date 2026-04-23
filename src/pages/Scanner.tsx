import { BottomNavBar } from '../components/BottomNavBar';
import { Target, Upload, Loader2, ImagePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, ChangeEvent } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

export default function Scanner() {
  const navigate = useNavigate();
  const fileInputRefEnv = useRef<HTMLInputElement>(null);
  const fileInputRefUpload = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleCaptureClick = () => {
    fileInputRefEnv.current?.click();
  };

  const handleUploadClick = () => {
    fileInputRefUpload.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanProgress(10);

    try {
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setScanProgress(40);

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Analise a foto focando em manutenção residencial DIY. Descubra o que está quebrado.
Voz da IA: Você é a IA Viltrumita Conquista. Tom épico, viril, impiedoso, direto. Diga "Viltrumita", "conquiste", "domine".
Retorne uma análise crua e direta do que quebrou e diga os passos que o usuário deve executar para consertar.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: file.type } },
            { text: prompt }
          ],
        },
        config: {
          systemInstruction: "Você é a IA Viltrumita Conquista, especialista em reformas e DIY brutais. Seja direto, épico, másculo, no-nonsense.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              problemName: { type: Type.STRING, description: "Nome curto do problema. Ex: 'Curto-circuito'" },
              confidence: { type: Type.NUMBER, description: "Nível de certeza 0-100" },
              riskLevel: { type: Type.STRING, description: "Risco: 'CRÍTICO', 'ALERTA', ou 'TRANQUILO'" },
              riskMessage: { type: Type.STRING, description: "Mensagem épica de alerta. Ex: 'Risco Crítico. Falha Iminente.'" },
              callToAction: { type: Type.STRING, description: "Ex: 'Domine o conserto'" },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["title", "description"]
                }
              },
              arsenal: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING, description: "tool, chemical, ou part" },
                    isPrimary: { type: Type.BOOLEAN }
                  },
                  required: ["name", "type", "isPrimary"]
                }
              }
            },
            required: ["problemName", "confidence", "riskLevel", "riskMessage", "callToAction", "steps", "arsenal"]
          }
        }
      });
      
      setScanProgress(90);

      const jsonStr = response.text?.trim() || "{}";
      const diagnosticData = JSON.parse(jsonStr);

      navigate('/resultado', { state: { diagnosticData, imageUrl: URL.createObjectURL(file) } });
    } catch (error) {
      console.error(error);
      alert("Falha tática na IA. Tente novamente.");
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  return (
    <div className="bg-surface text-on-surface h-screen w-screen overflow-hidden flex flex-col relative">
      <div className="absolute inset-0 noise-bg mix-blend-overlay z-50 pointer-events-none opacity-50"></div>
      
      <main className="flex-grow relative overflow-hidden bg-surface-container-lowest flex flex-col">
        <div 
          className="absolute inset-0 z-0 bg-surface-container-low" 
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDe1NRHtRTx4VSk5cNc7NgZPZrJSHZga2xh87oj2Cv5UT7Qvt9JLobPvk83aHYDhzKJoKxTfCfNTxx7E28RV_Ek-igtufBPBqYdozOq3VMiLjYTWP9ryl3Z_TOvffLX8tmyLVyjCUWF3pf4jxjrKbx32uFhX8Nv1VdqBQvb8a3ALUB7JI3rxN_dinf9Z7XDfPq9-7jMPWXqUmYoSIsotC2nyzSKarG6XJuKXzvU45S7IZ4Pikn3Ra1OtwClSIfzuD9GcwHMkNWI0Ms')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "luminosity",
            opacity: 0.4
          }}
        ></div>

        <div className="absolute top-1/3 left-0 w-full h-[2px] bg-primary z-10 shadow-[0_0_20px_theme('colors.primary')]"></div>
        <div className="absolute top-[35%] left-0 w-full h-1 bg-primary-container opacity-50 z-10 blur-sm"></div>

        <div className="relative z-20 w-full px-6 pt-16 pb-8 bg-gradient-to-b from-surface-container-lowest to-transparent flex flex-col gap-2">
          <h1 className="font-headline text-5xl font-extrabold uppercase tracking-[-0.05em] text-on-surface leading-none break-words">
            DOMINE O<br/>
            <span className="text-primary-container">DIAGNÓSTICO</span>
          </h1>
          <p className="font-body text-on-surface-variant text-sm font-medium tracking-[0.05em] uppercase">
            {isScanning ? "INSPECIONANDO ALVO..." : "Viltrumita, mostre o problema."}
          </p>
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-48 h-48 border-2 border-outline-variant opacity-30 flex items-center justify-center">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
          {isScanning ? (
             <div className="flex flex-col items-center gap-2">
               <Loader2 className="w-12 h-12 text-primary animate-spin opacity-80" />
               <span className="font-headline font-bold text-primary text-xs tracking-widest">{scanProgress}%</span>
            </div>
          ) : (
             <Target className="w-12 h-12 text-primary opacity-50" />
          )}
        </div>

        <div className="absolute bottom-[80px] w-full z-30 flex flex-col items-center pb-8 bg-gradient-to-t from-surface-container-lowest to-transparent pt-12">
          <div className="flex items-center justify-center gap-8 mb-8">
            <button onClick={handleCaptureClick} className="font-body text-[10px] font-bold tracking-[0.1em] uppercase text-primary pb-1 border-b-2 border-primary hover:text-primary-container">CÂMERA</button>
            <button onClick={handleUploadClick} className="font-body text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant opacity-50 pb-1 border-b-2 border-transparent hover:opacity-100 transition-opacity">UPLOAD</button>
          </div>

          <input 
            type="file" 
            ref={fileInputRefEnv} 
            onChange={handleFileChange} 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
          />
          <input 
            type="file" 
            ref={fileInputRefUpload} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          <div className="flex items-center gap-4">
            <button 
              disabled={isScanning}
              onClick={handleCaptureClick} 
              className={`w-20 h-20 bg-gradient-to-br from-primary-container to-secondary-fixed-variant flex items-center justify-center relative shadow-[0_0_40px_rgba(255,180,168,0.15)] group ${isScanning ? 'opacity-50 pointer-events-none' : 'brutalist-button-hover brutalist-button-active'}`}
            >
              <div className="absolute inset-0 noise-bg mix-blend-overlay opacity-30"></div>
              <div className="absolute inset-1 border-[3px] border-primary-fixed-dim opacity-30"></div>
              <Target className="w-8 h-8 text-on-primary-container z-10" strokeWidth={2.5} />
              <div className="absolute inset-0 border-4 border-primary opacity-0 group-hover:opacity-100 scale-110 transition-all duration-150"></div>
            </button>
          </div>
        </div>
      </main>
      
      <div className="fixed bottom-0 w-full z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}
