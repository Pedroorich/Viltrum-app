import { TopAppBar } from '../components/TopAppBar';
import { BottomNavBar } from '../components/BottomNavBar';
import { Shield, Medal, Wrench, Trophy, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { tutorials } from '../data/tutorials';
import { useMemo } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, viltrumRank, xp, loading } = useAuth();

  const xpPercentage = Math.min((xp / 1000) * 100, 100);

  // Daily seed for random objective (Changes at midnight local time)
  const dailyMission = useMemo(() => {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    
    // Simple hash function for the date
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
      hash |= 0;
    }
    
    const index = Math.abs(hash) % tutorials.length;
    return tutorials[index];
  }, []);

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen pb-24 selection:bg-primary-container selection:text-on-primary-container relative">
      <TopAppBar />
      
      <main className="max-w-4xl mx-auto px-4 pt-8 pb-20 space-y-12">
        <section className="space-y-2">
          <p className="font-headline text-on-surface-variant uppercase tracking-[0.1em] text-xs">
            BOM DIA, {user?.displayName ? user.displayName.split(' ')[0].toUpperCase() : (user?.isAnonymous ? 'SOLDADO' : 'VILTRUMITA')}
          </p>
          <h2 className="font-headline text-5xl font-black uppercase tracking-[-0.05em] leading-none text-primary">
            {viltrumRank}
          </h2>
          <div className="h-2 w-full bg-surface-container-lowest mt-4 relative overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-container to-[#FF0000] absolute left-0 top-0 transition-all duration-500 ease-out"
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
          <p className="font-label text-xs text-on-surface-variant mt-1 text-right">{xp} / 1000 XP</p>
        </section>

        <section 
          className="relative bg-surface-container-low overflow-hidden group hover:scale-[0.98] transition-transform duration-150 ease-in cursor-pointer"
          onClick={() => navigate('/executar', { state: { tutorial: dailyMission } })}
        >
          <div className="absolute inset-0 noise-bg"></div>
          <div className="h-48 w-full bg-surface-container-lowest relative">
            <img 
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:opacity-70 transition-opacity" 
              src={dailyMission.thumbnail} 
              alt={dailyMission.titulo} 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
          </div>
          <div className="p-6 relative z-20 -mt-24">
            <span className="inline-block bg-primary-container text-on-primary-container font-label text-xs uppercase tracking-[0.1em] px-2 py-1 mb-3 shadow-lg">ALVO TÁTICO DO DIA</span>
            <h3 className="font-headline text-2xl md:text-3xl font-bold uppercase tracking-tight text-on-surface mb-2 leading-tight drop-shadow-md">{dailyMission.titulo}</h3>
            <p className="text-on-surface-variant text-sm mb-6 max-w-md line-clamp-2">Categoria: {dailyMission.categoria}. Requer nível {dailyMission.nivel}. Prepare-se para a inserção tática.</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-surface-container-highest"></div>
              <span className="text-primary font-headline text-sm font-bold uppercase tracking-widest">+50 XP</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-6 flex flex-col justify-between min-h-[140px]">
            <Shield className="w-8 h-8 text-primary mb-4" />
            <div>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.1em]">ECONOMIA ACUMULADA</p>
              <p className="font-headline text-2xl font-bold text-on-surface mt-1">R$ 0</p>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 flex flex-col justify-between min-h-[140px]">
            <Medal className="w-8 h-8 text-tertiary mb-4" />
            <div>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.1em]">XP CONQUISTADO</p>
              <p className="font-headline text-2xl font-bold text-on-surface mt-1">{xp}</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => navigate('/diagnosticar')} className="bg-surface-container-lowest border-l-4 border-primary p-5 flex items-center gap-4 hover:bg-surface-container-highest transition-colors duration-150 text-left group">
            <div className="w-10 h-10 rounded-none bg-surface-container-low flex items-center justify-center group-hover:bg-primary-container transition-colors">
              <Wrench className="w-5 h-5 text-primary group-hover:text-on-primary-container" />
            </div>
            <span className="font-headline font-bold uppercase tracking-tight text-sm">Diagnóstico Rápido</span>
          </button>
          
          <button onClick={() => navigate('/conquistas')} className="bg-surface-container-lowest border-l-4 border-surface-bright p-5 flex items-center gap-4 hover:bg-surface-container-highest transition-colors duration-150 text-left group">
            <div className="w-10 h-10 rounded-none bg-surface-container-low flex items-center justify-center group-hover:bg-surface-bright transition-colors">
              <Trophy className="w-5 h-5 text-tertiary group-hover:text-on-surface" />
            </div>
            <span className="font-headline font-bold uppercase tracking-tight text-sm">Minhas Conquistas</span>
          </button>
          
          <button onClick={() => navigate('/arsenal')} className="bg-surface-container-lowest border-l-4 border-surface-bright p-5 flex items-center gap-4 hover:bg-surface-container-highest transition-colors duration-150 text-left group">
            <div className="w-10 h-10 rounded-none bg-surface-container-low flex items-center justify-center group-hover:bg-surface-bright transition-colors">
              <Store className="w-5 h-5 text-tertiary group-hover:text-on-surface" />
            </div>
            <span className="font-headline font-bold uppercase tracking-tight text-sm">Loja de Armas</span>
          </button>
        </section>
      </main>
      
      <div className="fixed bottom-0 w-full z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}
