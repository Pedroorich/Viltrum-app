import { TopAppBar } from '../components/TopAppBar';
import { BottomNavBar } from '../components/BottomNavBar';
import { Search, PlayCircle, Droplet, Zap, Frame, Wrench, ArrowRight, Skull, Shield, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { useState } from 'react';
import { tutorials } from '../data/tutorials';

export default function Conquests() {
  const navigate = useNavigate();
  const { user, xp } = useAuth();
  
  const [activeCategory, setActiveCategory] = useState("TUDO");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTutorials = tutorials.filter(t => {
    const matchesSearch = t.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || t.categoria.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "TUDO" || t.categoria === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "HIDRÁULICA": return <Droplet className="text-blue-500 w-4 h-4 fill-current" />;
      case "ELÉTRICA": return <Zap className="text-yellow-500 w-4 h-4 fill-current" />;
      case "ESTRUTURAL": return <Frame className="text-orange-500 w-4 h-4" />;
      case "MECÂNICA": return <Wrench className="text-gray-400 w-4 h-4" />;
      default: return <Target className="text-primary w-4 h-4" />;
    }
  };

  const getHoverBorderColor = (category: string) => {
    switch(category) {
      case "HIDRÁULICA": return "hover:border-blue-500";
      case "ELÉTRICA": return "hover:border-yellow-500";
      case "ESTRUTURAL": return "hover:border-orange-500";
      case "MECÂNICA": return "hover:border-gray-400";
      default: return "hover:border-primary";
    }
  };

  const getLevelBadgeInfo = (nivel: string) => {
    switch(nivel) {
      case "Recruta": return { icon: Shield, color: "text-gray-400", bg: "bg-gray-400/10 border-gray-400/20" };
      case "Soldado": return { icon: ArrowRight, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" };
      case "Viltrumita": return { icon: Skull, color: "text-primary", bg: "bg-primary/10 border-primary/20" };
      case "Thragg": return { icon: Skull, color: "text-red-600", bg: "bg-red-600/20 border-red-600/40" };
      default: return { icon: Shield, color: "text-gray-400", bg: "bg-gray-400/10 border-gray-400/20" };
    }
  };

  return (
    <div className="bg-[#131313] text-on-surface font-body pb-24 min-h-screen flex flex-col">
      <TopAppBar />
      
      <main className="flex-grow flex flex-col w-full max-w-5xl mx-auto">
        <section className="bg-surface-container-lowest p-6 pb-12 flex flex-col gap-6">
          <div className="flex justify-between items-start">
             <h2 className="font-headline text-4xl md:text-6xl uppercase tracking-tighter font-extrabold text-on-surface leading-none">
               DOMINE O <br /><span className="text-primary">PROBLEMA</span>
             </h2>
             <div className="text-right mt-2">
                 <p className="font-headline text-xl text-primary">{xp} XP</p>
                 <p className="font-label text-[10px] text-on-surface-variant tracking-widest">{user?.email ? user.email.split('@')[0].toUpperCase() : 'COMANDANTE'}</p>
             </div>
          </div>
          
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="text-outline-variant group-focus-within:text-primary transition-colors w-8 h-8" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="INFORME O ALVO..." 
              className="w-full bg-[#131313] text-on-surface font-headline uppercase text-xl md:text-2xl tracking-widest pl-16 pr-4 py-6 outline-none border-b-2 border-outline-variant focus:border-primary transition-colors placeholder-outline-variant/50"
            />
          </div>
        </section>

        <section className="bg-[#131313] py-6 px-6">
          <div className="flex gap-4 overflow-x-auto snap-x pb-4 no-scrollbar">
            {["TUDO", "HIDRÁULICA", "ELÉTRICA", "ESTRUTURAL", "MECÂNICA"].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`snap-start flex-shrink-0 font-headline uppercase tracking-[0.1em] text-sm px-8 py-3 font-bold border-b-2 transition-colors ${activeCategory === cat ? 'bg-primary-container text-primary border-primary' : 'bg-surface-container-low text-on-surface-variant border-transparent hover:border-outline-variant hover:bg-surface-container-highest'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-8 px-6 pb-12 bg-surface-container-lowest pt-8">
          {filteredTutorials.map((tutorial, index) => {
             const LevelInfo = getLevelBadgeInfo(tutorial.nivel);
             const LevelIcon = LevelInfo.icon;
             return (
               <article 
                 key={tutorial.id} 
                 onClick={() => navigate('/executar', { state: { tutorial } })} 
                 className={`group bg-surface-container-low w-full flex flex-col md:flex-row relative cursor-pointer active:scale-[0.98] transition-transform duration-150 ease-in overflow-hidden border-l-4 border-transparent ${getHoverBorderColor(tutorial.categoria)}`}
               >
                 <div className="w-full md:w-2/5 aspect-video md:aspect-auto bg-surface-container-lowest relative overflow-hidden">
                   <img 
                     className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 mix-blend-luminosity group-hover:mix-blend-normal" 
                     src={tutorial.thumbnail} 
                     alt={tutorial.titulo} 
                   />
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-transparent transition-colors">
                     <PlayCircle className="text-white opacity-80 group-hover:opacity-100 w-16 h-16 impact-glow group-hover:scale-110 transition-transform" />
                   </div>
                   <div className="absolute bottom-4 right-4 bg-surface-container-lowest px-2 py-1 border-2 border-outline-variant/30">
                     <span className="font-label text-on-surface text-xs tracking-widest font-bold">{tutorial.duracao}</span>
                   </div>
                 </div>
                 
                 <div className="p-6 md:p-8 flex flex-col justify-between w-full md:w-3/5 gap-6 relative">
                   <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                     <span className="font-headline text-8xl font-black">{(index + 1).toString().padStart(2, '0')}</span>
                   </div>
                   <div className="flex flex-col gap-2 relative z-10">
                     <div className="flex items-center gap-3 mb-2 opacity-80">
                       {getCategoryIcon(tutorial.categoria)}
                       <span className="font-body text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold">{tutorial.categoria}</span>
                     </div>
                     <h3 className="font-headline text-xl md:text-2xl uppercase tracking-tighter font-extrabold text-on-surface leading-tight transition-colors">
                       {tutorial.titulo}
                     </h3>
                     <p className="font-body text-sm text-on-surface-variant mt-2 italic opacity-80">{tutorial.descricaoCurta}</p>
                   </div>
                   
                   <div className="flex items-center justify-between mt-4 border-t-2 border-surface-container-lowest pt-4 relative z-10">
                     <div className={`flex items-center gap-2 px-3 py-1 border ${LevelInfo.bg}`}>
                       <LevelIcon className={`${LevelInfo.color} w-4 h-4`} />
                       <span className={`font-headline ${LevelInfo.color} text-xs uppercase tracking-widest font-bold`}>NÍVEL: {tutorial.nivel}</span>
                     </div>
                     <button className="font-headline text-sm uppercase tracking-widest text-on-surface flex items-center gap-2 hover:text-primary transition-colors">
                       EXECUTAR <ArrowRight className="w-5 h-5" />
                     </button>
                   </div>
                 </div>
               </article>
             );
          })}
          
          {filteredTutorials.length === 0 && (
             <div className="text-center p-12 bg-surface-container-low border-2 border-dashed border-outline-variant/20">
                <span className="font-headline text-xl uppercase tracking-widest text-on-surface-variant">Nenhum alvo encontrado.</span>
             </div>
          )}
        </section>
      </main>

      <div className="fixed bottom-0 w-full z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}
