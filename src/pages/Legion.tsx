import { TopAppBar } from '../components/TopAppBar';
import { BottomNavBar } from '../components/BottomNavBar';
import { PlusCircle, MessageSquare, Share2, Activity, ImageIcon, Loader2, X, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../lib/authContext';

const DEFAULT_CATEGORIES = ['TUDO', 'HIDRÁULICA', 'ENERGIA', 'MÓVEIS', 'SUPERAÇÃO', 'SHAPE', 'FINANCEIRO'];

// Comments Sub-component
function CommentsSection({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, snap => {
      setComments(snap.docs.map(d => ({id: d.id, ...d.data()})));
    });
    return () => unsubscribe();
  }, [postId]);

  const postComment = async () => {
    if (!text.trim() || !user) return;
    setIsPosting(true);
    try {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        commentId: crypto.randomUUID(),
        userId: user.uid,
        userName: user.displayName?.split(' ')[0].toUpperCase() || user.email?.split('@')[0].toUpperCase() || "VILTRUMITA",
        text: text.trim(),
        createdAt: serverTimestamp()
      });
      setText('');
    } catch (e) {
      console.error(e);
      alert("Erro ao comentar.");
    }
    setIsPosting(false);
  }

  return (
    <div className="flex flex-col gap-3 mt-4 border-t-2 border-outline-variant/20 pt-4 bg-surface-container-lowest p-4">
      {comments.length > 0 ? (
        <div className="flex flex-col gap-3 max-h-48 overflow-y-auto no-scrollbar">
          {comments.map(c => (
            <div key={c.id} className="text-sm">
              <span className="font-headline font-black text-primary mr-2 uppercase tracking-wide">{c.userName}</span>
              <span className="text-on-surface font-body">{c.text}</span>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest opacity-50">Nenhum comentário.</span>
      )}
      <div className="flex gap-2 mt-2">
        <input 
          className="flex-1 bg-surface-container-low border-b-2 border-outline-variant/30 px-3 py-2 text-sm outline-none focus:border-primary text-on-surface font-body placeholder-on-surface-variant/50 transition-colors" 
          placeholder="TÁTICA OU OPINIÃO..." 
          value={text} 
          onChange={e => setText(e.target.value)} 
          disabled={isPosting}
        />
        <button onClick={postComment} disabled={isPosting} className="bg-primary text-on-primary px-4 font-headline uppercase text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-50">
          Enviar
        </button>
      </div>
    </div>
  );
}

export default function Legion() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  
  // Post states
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [postCategory, setPostCategory] = useState("SUPERAÇÃO");
  const [customCategory, setCustomCategory] = useState("");
  
  // Feed states
  const [selectedFilter, setSelectedFilter] = useState("TUDO");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!user || !newPostText) return;
    
    setIsPosting(true);
    try {
      const finalCategory = postCategory === 'OUTRA' && customCategory ? customCategory.toUpperCase() : postCategory.toUpperCase();
      
      await addDoc(collection(db, 'posts'), {
        postId: crypto.randomUUID(),
        userId: user.uid,
        userName: user.displayName?.split(' ')[0].toUpperCase() || user.email?.split('@')[0].toUpperCase() || "VILTRUMITA",
        description: newPostText,
        imageUrl: newPostImage || null,
        category: finalCategory,
        likedBy: [],
        likesCount: 0,
        createdAt: serverTimestamp()
      });
      setNewPostText("");
      setNewPostImage("");
      setPostCategory("SUPERAÇÃO");
      setCustomCategory("");
    } catch (e) {
      console.error("Erro ao postar:", e);
      alert("Falha de transmissão.");
    }
    setIsPosting(false);
  };

  const toggleLike = async (post: any) => {
    if (!user) return;
    const postRef = doc(db, 'posts', post.id);
    const hasLiked = post.likedBy?.includes(user.uid);
    
    try {
      await updateDoc(postRef, {
        likedBy: hasLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
        likesCount: hasLiked ? Math.max(0, (post.likesCount || 1) - 1) : (post.likesCount || 0) + 1
      });
    } catch (e) {
      console.error("Erro ao curtir:", e);
    }
  };

  const toggleComments = (postId: string) => {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Extract unique categories from posts for filter
  const dynamicCategories = Array.from(new Set(posts.map(p => p.category).filter(c => c && !DEFAULT_CATEGORIES.includes(c))));
  const allFilters = [...DEFAULT_CATEGORIES, ...dynamicCategories];

  const filteredPosts = selectedFilter === 'TUDO' 
    ? posts 
    : posts.filter(p => p.category === selectedFilter);

  return (
    <div className="bg-background text-on-background font-body min-h-screen pb-24 selection:bg-primary-container selection:text-on-primary-container">
      <TopAppBar />
      
      {/* Imagem Modal (Tamanho Real) */}
      {selectedImage && (
         <div 
           className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm transition-all" 
           onClick={() => setSelectedImage(null)}
         >
            <button className="absolute top-6 right-6 text-outline hover:text-primary transition-colors bg-surface-container-highest p-2 rounded-full border border-outline-variant/30"><X className="w-6 h-6"/></button>
            <img src={selectedImage} className="max-w-full max-h-full object-contain cursor-zoom-out shadow-2xl" alt="Conquista Ampliada" />
         </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-10">
        <div className="flex flex-col gap-2 relative">
          <h1 className="font-headline text-5xl md:text-6xl font-black tracking-[-0.05em] uppercase text-on-background w-full break-words leading-none">
            A Legião <br /><span className="text-primary text-shadow-md">de Viltrum</span>
          </h1>
          <p className="font-body text-on-surface-variant text-sm mt-2 max-w-md">
            TESTEMUNHE O PODER. COMPARTILHE SUAS CONQUISTAS.
          </p>
        </div>

        {/* Filters */}
        <section className="-mx-4 px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 pb-2 w-max">
            {allFilters.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedFilter(cat)} 
                className={`flex-shrink-0 font-headline uppercase tracking-[0.1em] text-sm px-6 py-2 transition-all font-bold border-b-2 ${selectedFilter === cat ? 'bg-primary-container text-primary border-primary' : 'bg-surface-container-low text-on-surface-variant border-transparent hover:border-outline-variant hover:bg-surface-container-highest'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Input Area */}
        <div className="bg-surface-container-low p-5 border-l-4 border-primary shadow-lg flex flex-col gap-4">
          <textarea 
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="w-full bg-surface-container-lowest text-on-surface font-body p-4 outline-none border-b-2 border-outline-variant/20 focus:border-primary resize-none h-24 placeholder-on-surface-variant/50 transition-colors"
            placeholder="Relate sua conquista, métodos ou dúvidas para a Legião..."
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <div className="flex bg-surface-container-lowest border border-outline-variant/20 focus-within:border-primary transition-colors">
                <div className="p-3 text-outline-variant border-r border-outline-variant/20 flex items-center justify-center bg-surface-container-low"><ImageIcon className="w-5 h-5"/></div>
                <input 
                  type="text" 
                  value={newPostImage}
                  onChange={(e) => setNewPostImage(e.target.value)}
                  placeholder="URL da Imagem (Opcional)"
                  className="w-full bg-transparent p-3 outline-none text-sm text-on-surface placeholder-on-surface-variant/50 font-body"
                />
              </div>
              <div className="flex gap-2 w-full">
                <select 
                  value={postCategory} 
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="bg-surface-container-lowest text-on-surface font-label text-xs uppercase tracking-widest p-3 outline-none border border-outline-variant/20 appearance-none flex-1 cursor-pointer"
                >
                  {DEFAULT_CATEGORIES.filter(c => c !== 'TUDO').map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="OUTRA">OUTRA CATEGORIA...</option>
                </select>
                {postCategory === 'OUTRA' && (
                  <input 
                    type="text" 
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="QUAL?"
                    maxLength={15}
                    className="flex-1 bg-surface-container-lowest text-on-surface p-3 outline-none border border-outline-variant/20 text-xs font-label uppercase tracking-widest"
                  />
                )}
              </div>
            </div>
            
            <button 
              onClick={handlePost}
              disabled={isPosting || !newPostText}
              className="w-full sm:w-auto relative group overflow-hidden bg-gradient-to-tr from-primary-container to-[#8B0000] text-white font-headline font-bold uppercase tracking-widest px-8 py-4 flex items-center justify-center gap-3 transition-transform duration-150 active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
            >
              <div className="noise-bg absolute inset-0 z-0"></div>
              {isPosting ? <Loader2 className="relative z-10 w-5 h-5 animate-spin" /> : <PlusCircle className="relative z-10 w-5 h-5" fill="currentColor" />}
              <span className="relative z-10 hidden sm:inline">RELATAR CONQUISTA</span>
              <span className="relative z-10 sm:hidden">POSTAR</span>
            </button>
          </div>
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-8">
          {loading ? (
             <div className="flex justify-center p-12"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
          ) : filteredPosts.length === 0 ? (
             <p className="text-on-surface-variant text-center font-headline uppercase tracking-widest text-sm p-12 border-2 border-dashed border-outline-variant/20">A linha do tempo está vazia para esta operação.</p>
          ) : filteredPosts.map(post => {
             const hasLiked = user && post.likedBy && post.likedBy.includes(user.uid);
             
             return (
               <article key={post.id} className="bg-surface-container-low flex flex-col relative transition-transform duration-150 border-l-2 border-transparent hover:border-primary">
                <div className="bg-surface-container-high p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-container-lowest border border-outline-variant/20 flex-shrink-0 flex items-center justify-center">
                      <span className="font-headline font-black text-on-surface text-lg">{post.userName?.charAt(0) || 'V'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline font-bold uppercase text-on-surface leading-tight tracking-tight">{post.userName || 'VILTRUMITA'}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-body text-[9px] text-outline uppercase tracking-widest">{post.createdAt?.toDate().toLocaleDateString() || 'AGORA'}</span>
                        <span className="font-label text-[9px] bg-surface-container-lowest text-primary px-1.5 py-0.5 border border-primary/20 tracking-widest uppercase">{post.category || 'GERAL'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {post.imageUrl && (
                  <div 
                    className="bg-black w-full min-h-64 max-h-[500px] flex items-center justify-center p-2 cursor-zoom-in"
                    onClick={() => setSelectedImage(post.imageUrl)}
                  >
                    {/* Alterado para object-contain e bg-black para não cortar as imagens */}
                    <img 
                      src={post.imageUrl} 
                      className="max-w-full max-h-[480px] object-contain grayscale hover:grayscale-0 transition-all duration-500" 
                      alt="Conquista" 
                    />
                  </div>
                )}

                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => toggleLike(post)} 
                      className={`flex items-center gap-2 group transition-colors p-1 ${hasLiked ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                      <Heart className={`w-6 h-6 group-active:scale-90 transition-transform ${hasLiked ? 'fill-current' : ''}`} />
                      <span className="font-headline font-bold text-sm tracking-wider">{post.likedBy?.length || post.likesCount || 0}</span>
                    </button>
                    <button 
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-2 group hover:text-primary transition-colors text-on-surface-variant p-1"
                    >
                      <MessageSquare className="w-6 h-6 group-active:scale-90 transition-transform" />
                      <span className="font-headline font-bold text-sm tracking-wider uppercase font-label">Comentar</span>
                    </button>
                    <button className="ml-auto text-on-surface-variant hover:text-primary transition-colors p-1">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="font-body text-base text-on-surface leading-relaxed whitespace-pre-wrap mt-2">
                    {post.description}
                  </div>
                  
                  {openComments[post.id] && <CommentsSection postId={post.id} />}
                </div>
              </article>
             );
          })}
        </div>
      </main>

      <div className="fixed bottom-0 w-full z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}
