import { useState, useEffect } from 'react';
import { TopAppBar } from '../components/TopAppBar';
import { BottomNavBar } from '../components/BottomNavBar';
import { ScanBarcode, ShoppingCart, Crosshair, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { arsenalTools } from '../data/arsenal';
import { useAuth } from '../lib/authContext';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Arsenal() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const itemsPerPage = 6;

  // Fetch user favorites
  useEffect(() => {
    if (!user) return;
    const fetchFavs = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data().favoriteTools) {
          setFavorites(snap.data().favoriteTools);
        }
      } catch (err) {
        console.error("Falha ao recuperar favoritos do arsenal", err);
      }
    };
    fetchFavs();
  }, [user]);

  const toggleFavorite = async (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    const isFav = favorites.includes(toolId);
    
    // Optimistic UI Update
    setFavorites(prev => isFav ? prev.filter(id => id !== toolId) : [...prev, toolId]);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        favoriteTools: isFav ? arrayRemove(toolId) : arrayUnion(toolId)
      });
    } catch (err) {
      console.error("Erro ao sincronizar favoritar", err);
      // Revert if error
      setFavorites(prev => isFav ? [...prev, toolId] : prev.filter(id => id !== toolId));
    }
  };

  const filteredTools = arsenalTools.filter(tool => {
    const query = searchQuery.toLowerCase();
    return tool.nome.toLowerCase().includes(query) || 
           tool.descricao.toLowerCase().includes(query);
  });

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleTools = filteredTools.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const prevPage = () => setCurrentPage(p => Math.max(1, p - 1));

  return (
    <div className="bg-[#0a0a0a] text-on-surface font-body min-h-screen relative pb-24 selection:bg-[#8B0000] selection:text-white">
      <TopAppBar />
      
      <main className="px-6 py-12 max-w-7xl mx-auto">
        <div className="mb-12 relative">
          <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none mb-4 -ml-2">
            FORTALEÇA<br/>SEU <span className="text-[#ff4d4d]">ARSENAL</span>
          </h1>
          <p className="font-body text-outline-variant max-w-xl text-lg uppercase tracking-wider font-bold">
            Armas Viltrumita. Equipamentos testados. Resultados letais para a sua reforma.
          </p>
        </div>

        <div className="flex justify-between items-end mb-8 bg-[#131313] p-6 relative border-t-2 border-[#8B0000]">
          <div className="absolute inset-0 noise-bg z-0 opacity-30 mix-blend-overlay"></div>
          <div className="relative z-10 flex gap-4 w-full justify-between items-center">
            <div className="relative w-full max-w-md">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="BUSCAR EQUIPAMENTO..." 
                className="w-full bg-[#0a0a0a] border-b-2 border-outline-variant/50 focus:border-[#ff4d4d] border-t-0 border-l-0 border-r-0 text-white font-headline uppercase tracking-widest py-3 px-4 outline-none transition-colors placeholder:text-outline-variant/40"
              />
            </div>
            <button className="bg-black border-2 border-outline-variant/30 text-white p-3 hover:border-[#8B0000] hover:text-[#ff4d4d] transition-colors flex items-center justify-center">
              <ScanBarcode className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {visibleTools.length > 0 ? (
            visibleTools.map((tool) => {
              const isFav = favorites.includes(tool.id);
              
              return (
                <div key={tool.id} className="bg-[#131313] border border-outline-variant/10 relative group overflow-hidden flex flex-col transition-transform duration-150">
                  <div className="absolute top-4 left-4 z-20 bg-[#8B0000]/90 text-white font-label uppercase font-black text-[10px] px-2 py-1 tracking-widest border border-[#ff4d4d]/30">
                    {tool.categoria}
                  </div>
                  
                  <button 
                    onClick={(e) => toggleFavorite(e, tool.id)}
                    className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-sm p-2 border border-outline-variant/20 hover:border-[#ff4d4d] hover:bg-[#8B0000]/40 transition-colors active:scale-95"
                    title={isFav ? "Remover dos Favoritos" : "Favoritar Arma"}
                  >
                    <Star className={`w-5 h-5 transition-colors ${isFav ? 'fill-[#ff4d4d] text-[#ff4d4d]' : 'text-white'}`} />
                  </button>
                  
                  <div className="h-48 w-full bg-black relative">
                    <img 
                      src={tool.imagem_url} 
                      alt={tool.nome} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover mix-blend-luminosity opacity-60 group-hover:opacity-100 transition-opacity grayscale-[20%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent"></div>
                  </div>
                  
                  <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-white leading-tight min-h-[3rem]">
                        {tool.nome}
                      </h3>
                      <p className="font-body text-[10px] text-[#ff4d4d] font-bold mt-2 uppercase tracking-widest leading-relaxed">
                        Viltrumita, você vai precisar disso pra conquistar {tool.categoria}
                      </p>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <div className="font-body text-[11px] text-outline-variant uppercase tracking-wider line-clamp-2 pr-2 leading-tight flex-1">
                        {tool.descricao}
                      </div>
                      <a 
                        href={tool.link_redirecionamento}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black border border-outline-variant/30 hover:border-[#8B0000] hover:bg-[#8B0000]/10 text-white p-3 flex items-center justify-center transition-colors group-hover:shadow-[0_0_15px_rgba(139,0,0,0.5)] shrink-0 active:scale-95"
                        title="Comprar como Viltrumita"
                      >
                        <ShoppingCart className="w-5 h-5 text-[#ff4d4d]" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
              <Crosshair className="w-12 h-12 text-[#ff4d4d] mb-4 opacity-70" />
              <h3 className="font-headline text-xl font-bold uppercase text-white mb-2">Nenhum equipamento encontrado</h3>
              <p className="font-body text-outline-variant text-sm font-bold tracking-widest uppercase">Ajuste os parâmetros de busca, Viltrumita.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-[#131313] border-y border-outline-variant/20 p-4 font-headline uppercase tracking-widest text-sm">
            <button 
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 border ${currentPage === 1 ? 'border-outline-variant/10 text-outline-variant/30 cursor-not-allowed' : 'border-outline-variant/40 text-white hover:border-[#ff4d4d] active:scale-95 transition-all'}`}
            >
              <ChevronLeft className="w-5 h-5" /> Anterior
            </button>
            <span className="text-outline-variant">
              PAINEL <span className="text-white font-black">{currentPage}</span> / {totalPages}
            </span>
            <button 
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 border ${currentPage === totalPages ? 'border-outline-variant/10 text-outline-variant/30 cursor-not-allowed' : 'border-outline-variant/40 text-white hover:border-[#ff4d4d] active:scale-95 transition-all'}`}
            >
              Próximo <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="mt-12 text-center border-t-2 border-[#8B0000] pt-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#8B0000]"></div>
          <p className="font-body text-[10px] text-outline-variant uppercase tracking-[0.2em] font-bold max-w-xl mx-auto">
            * O IMPÉRIO NÃO DEFINE O CUSTO. Verifique o Armeiro para aferir o valor real e tático de aquisição. O Sistema logístico rastreia suprimentos dinamicamente.
          </p>
        </div>
      </main>

      <div className="md:hidden">
        <BottomNavBar />
      </div>
    </div>
  );
}
