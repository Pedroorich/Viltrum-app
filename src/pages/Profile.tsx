import { TopAppBar } from '../components/TopAppBar';
import { BottomNavBar } from '../components/BottomNavBar';
import { Flame, Activity, Shield, Trophy, Dumbbell, Star, Hexagon, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ConquestRecord {
  id: string;
  title: string;
  xpEarned: number;
  completedAt: any;
}

export default function Profile() {
  const { user } = useAuth();
  const [xp, setXp] = useState(0);
  const [conquests, setConquests] = useState<ConquestRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          setXp(userDoc.data().xp || 0);
        }

        const conquestsQuery = query(collection(userRef, 'conquests'), orderBy('completedAt', 'desc'));
        const qs = await getDocs(conquestsQuery);
        const fetchedConquests = qs.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ConquestRecord[];
        
        setConquests(fetchedConquests);
      } catch (err) {
        console.error("Falha ao puxar os dados do bunker.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const getRank = (xp: number) => {
    if (xp < 200) return 'RECRUTA';
    if (xp < 500) return 'SOLDADO';
    if (xp < 1000) return 'VILTRUMITA';
    return 'THRAGG';
  };

  const currentRank = getRank(xp);
  const displayName = user?.displayName || "Comandante Omni";
  const photoURL = user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuCzO_M2gGN4eS0n25bzPu15Tq9LXU-osYnq8mPKvPXR1CQnLIsYgy5A5paNtSu8Iq9Kzli8zx3DxG7Ym9u2Sd1BB-_vmkx_HMnHBmN_y1FEsMk7QNd8a_xpG4Un5iDSqjZQYt2R2zlGn_FvJqb4g8SCuNDXIO3LVgP3QGopS93T6sN7y5UhZgJSDHtQ65aBG2Zfy245-Do2lWEgt8917_ArjxNY7vUFun1UWi3MsYOKg2M2KhbS1LTQsBdUtY8_YFn4bX-NVhnZC-c";

  // Calculate days passed since creation (simplified)
  const daysOfFocus = user?.metadata.creationTime 
    ? Math.max(1, Math.floor((Date.now() - new Date(user.metadata.creationTime).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-primary">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="font-body min-h-screen pb-24 bg-[#0a0a0a] text-on-surface">
      <TopAppBar />
      
      <main className="w-full max-w-4xl mx-auto px-4 mt-8 flex flex-col gap-12">
        <section className="flex flex-col items-center justify-center pt-8 relative">
          <div className="absolute inset-0 noise-bg opacity-30 mix-blend-overlay pointer-events-none"></div>
          
          <div className="relative mb-6 group">
            <div className="w-48 h-48 bg-black overflow-hidden border-4 border-[#8B0000] relative z-10 group-active:scale-95 transition-transform duration-150">
              <img 
                src={photoURL} 
                alt="Avatar" 
                className="w-full h-full object-cover filter contrast-125 saturate-50 grayscale-[20%]"
              />
            </div>
            <div className="absolute inset-0 bg-[#8B0000] opacity-30 blur-[50px] z-0 animate-pulse"></div>
          </div>
          
          <h2 className="font-headline text-display-lg uppercase tracking-[-0.05em] text-white mb-2 text-center text-4xl sm:text-5xl font-black break-all leading-none">
            {displayName}
          </h2>
          <div className="flex items-center gap-3 mt-2">
             <span className="font-headline bg-[#8B0000]/20 text-[#ff4d4d] border border-[#8B0000]/50 px-3 py-1 text-sm font-bold tracking-widest uppercase">
               NÍVEL {currentRank}
             </span>
             <span className="font-label text-xs uppercase tracking-[0.1em] text-outline">
               {xp} XP ACUMULADO
             </span>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-[#131313] p-6 flex flex-col items-center justify-center active:scale-[0.98] transition-transform duration-150 rounded-none relative overflow-hidden col-span-2 md:col-span-1 border-t-2 border-[#8B0000]">
            <Flame className="w-10 h-10 text-[#8B0000] mb-2 fill-current" />
            <span className="font-headline text-4xl font-bold text-white tracking-tighter">{daysOfFocus}</span>
            <span className="font-label text-label-md uppercase tracking-[0.1em] text-outline mt-1 text-[10px]">Dias de Foco</span>
          </div>
          
          <div className="bg-[#131313] p-6 flex flex-col items-center justify-center active:scale-[0.98] transition-transform duration-150 rounded-none relative overflow-hidden border-t-2 border-outline-variant/10">
            <Activity className="w-10 h-10 text-outline mb-2" />
            <span className="font-headline text-4xl font-bold text-white tracking-tighter">{xp}</span>
            <span className="font-label text-label-md uppercase tracking-[0.1em] text-outline mt-1 text-[10px]">Total de XP</span>
          </div>

          <div className="bg-[#131313] p-6 flex flex-col items-center justify-center active:scale-[0.98] transition-transform duration-150 rounded-none relative overflow-hidden border-t-2 border-outline-variant/10">
            <Trophy className="w-10 h-10 text-[#8B0000] mb-2" />
            <span className="font-headline text-4xl font-bold text-white tracking-tighter">{conquests.length}</span>
            <span className="font-label text-label-md uppercase tracking-[0.1em] text-outline mt-1 text-[10px]">Conquistas</span>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h3 className="font-headline text-headline-lg uppercase tracking-[-0.05em] text-white text-3xl font-bold border-l-4 border-[#8B0000] pl-4">
            Arsenal de Mérito
          </h3>
          
          {conquests.length === 0 ? (
            <div className="p-8 border border-outline-variant/20 bg-black/50 text-center">
               <p className="font-body text-outline font-bold uppercase tracking-widest text-sm">NENHUMA CONQUISTA REGISTRADA</p>
               <p className="text-xs text-outline-variant mt-2">Vá para o menu Conquistas e domine seu primeiro obstáculo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conquests.map((c) => (
                <div key={c.id} className="bg-[#131313] p-4 flex items-center gap-4 active:scale-[0.98] transition-transform duration-150 border border-outline-variant/5 hover:border-[#8B0000]/30">
                  <div className="w-16 h-16 bg-black flex items-center justify-center border border-outline-variant/10">
                    <Shield className="w-8 h-8 text-[#8B0000] fill-current opacity-80" />
                  </div>
                  <div>
                    <h4 className="font-headline font-black text-sm sm:text-base text-white uppercase tracking-wider">{c.title}</h4>
                    <p className="font-body text-[10px] sm:text-xs text-[#ff4d4d] font-bold tracking-widest mt-1">
                      + {c.xpEarned} XP • Dominado
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="pb-12 mt-4 hidden">
          <button className="w-full bg-gradient-to-r from-[#8b0100] to-[#920703] text-white font-headline font-black text-xl uppercase tracking-[0.1em] py-6 px-8 active:translate-y-1 transition-transform flex items-center justify-center gap-4 relative overflow-hidden group">
            <div className="absolute inset-0 noise-bg opacity-10 mix-blend-overlay pointer-events-none"></div>
            <Hexagon className="w-6 h-6 z-10" fill="currentColor" />
            <span className="z-10 group-hover:scale-105 transition-transform duration-150">ELEVE AO PREMIUM</span>
          </button>
        </section>
      </main>

      <div className="md:hidden">
        <BottomNavBar />
      </div>
    </div>
  );
}
