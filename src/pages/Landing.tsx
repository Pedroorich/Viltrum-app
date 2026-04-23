import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldAlert, Wrench } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#050505] text-white font-body min-h-screen flex flex-col relative overflow-hidden selection:bg-[#8B0000] selection:text-white">
      {/* Dynamic Grid Background for Tactical Feel */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none z-0" 
        style={{
          backgroundImage: `linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          backgroundPosition: 'center center'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-0"></div>
      
      {/* Directional Red Glow */}
      <div className="absolute top-[10%] -right-[30%] w-[100vw] h-[100vw] sm:w-[50vw] sm:h-[50vw] bg-[#8B0000] rounded-full blur-[120px] opacity-[0.15] pointer-events-none z-0"></div>
      <div className="absolute bottom-[5%] -left-[20%] w-[80vw] h-[80vw] sm:w-[40vw] sm:h-[40vw] bg-[#ff4d4d] rounded-full blur-[100px] opacity-[0.05] pointer-events-none z-0"></div>

      <main className="flex-grow flex flex-col relative z-20 justify-between min-h-screen px-6 py-10 sm:px-12 sm:py-16 mx-auto w-full max-w-5xl">
        
        {/* Top Header / Badge */}
        <div className="w-full flex justify-start pt-4">
          <div className="px-3 py-2 bg-black flex items-center gap-3 border-l-2 border-[#8B0000] shadow-sm">
            <ShieldAlert className="w-4 h-4 text-[#ff4d4d]" />
            <span className="font-headline font-black text-white tracking-[0.2em] text-[10px] sm:text-xs uppercase">
              Protocolo Tático Viltrum
            </span>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex flex-col gap-6 mt-auto mb-auto shrink-0 w-full py-12">
          <h1 className="font-headline text-[3.5rem] leading-[0.85] sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-white drop-shadow-md flex flex-col">
            <span>Viltrumitas</span>
            <span className="text-outline-variant/80 italic mt-2 text-[2.5rem] sm:text-[4.5rem]">não chamam</span>
            <span className="text-[#ff4d4d] mt-2">técnico.</span>
          </h1>
          
          <div className="h-1.5 w-16 bg-[#ff4d4d] mt-6"></div>

          <p className="font-body text-sm sm:text-base text-outline-variant font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase leading-relaxed max-w-sm sm:max-w-xl mt-4 pr-4">
            Conquiste sua casa. Domine os reparos da sua base. <br className="hidden sm:block" />
            O Império recompensa a autonomia e não tolera a dependência.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full z-30 pb-4 mt-auto">
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-[#8B0000] text-white font-headline uppercase font-black text-lg py-5 px-6 tracking-[0.15em] border border-[#ff4d4d]/30 hover:border-[#ff4d4d] shadow-[0_4px_20px_rgba(139,0,0,0.4)] active:scale-[0.98] transition-all duration-200 flex items-center justify-between group"
          >
            <span className="text-left w-full pl-2">Iniciar Conquista</span>
            <div className="bg-black/30 p-2 group-hover:bg-white/20 transition-colors shrink-0">
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-1/3 bg-black/80 backdrop-blur-md text-outline-variant hover:text-white border border-outline-variant/20 hover:border-white/40 font-headline uppercase font-bold text-sm sm:text-base py-5 px-8 tracking-[0.15em] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 shrink-0"
          >
             <Wrench className="w-5 h-5 opacity-60" /> Base
          </button>
        </div>

      </main>
    </div>
  );
}
