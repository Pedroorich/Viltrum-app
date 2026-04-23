import { useNavigate } from 'react-router-dom';
import { Shield, Eye, ShieldAlert, UserCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../lib/authContext';

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/home');
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        setErrorMsg("CREDENCIAIS INVOCADAS FALHARAM. SENHA OU EMAIL INCORRETOS.");
      } else if (error.code === 'auth/user-not-found') {
        setErrorMsg("NENHUM COMBATENTE REGISTRADO COM ESTE EMAIL.");
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMsg("ESTE EMAIL JÁ PERTENCE A UM MEMBRO DO IMPÉRIO.");
      } else {
        setErrorMsg("FALHA NA CONEXÃO. COMUNIQUE O COMANDO: " + error.message);
      }
    }
  };

  const signInWithGoogle = async () => {
    setErrorMsg(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/home');
    } catch (error: any) {
      setErrorMsg("A INVESTIDA COM GOOGLE FALHOU.");
    }
  };

  return (
    <div className="bg-[#050505] text-white font-body min-h-screen flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#8B0000] selection:text-white">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]" style={{
          backgroundImage: `linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}></div>
      <div className="absolute top-[10%] -right-[30%] w-[100vw] h-[100vw] sm:w-[50vw] sm:h-[50vw] bg-[#8B0000] rounded-full blur-[120px] opacity-[0.1] pointer-events-none z-0"></div>
      
      <main className="w-full max-w-md px-6 py-12 z-10 relative flex flex-col gap-10">
        <header className="flex flex-col items-center text-center gap-4 border-b border-outline-variant/10 pb-6">
          <div className="flex flex-col gap-1 items-center">
            <h1 className="font-headline text-5xl font-black uppercase tracking-[-0.05em] text-white leading-none">VILTRUM</h1>
            <div className="h-1 w-12 bg-[#ff4d4d] mt-2 mb-2"></div>
            <p className="font-body text-outline-variant text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-2 font-bold">
              Base de Dados Isolada
            </p>
          </div>
        </header>

        <form className="flex flex-col gap-6 w-full" onSubmit={handleAuth}>
          {errorMsg && (
            <div className="bg-[#1a0000] border-l-4 border-[#ff4d4d] p-4 flex items-start gap-3 w-full shadow-[0_0_20px_rgba(139,0,0,0.3)] animate-in slide-in-from-top-2">
              <ShieldAlert className="w-5 h-5 text-[#ff4d4d] shrink-0 mt-0.5" />
              <p className="font-headline text-[#ff4d4d] uppercase text-xs sm:text-sm font-bold tracking-wider leading-tight">{errorMsg}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="relative">
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL DE COMBATE" 
                className="w-full bg-[#131313] border-0 border-b-2 border-outline-variant/40 focus:border-[#ff4d4d] text-white font-headline px-4 py-4 focus:ring-0 transition-colors placeholder-outline-variant/50 outline-none uppercase tracking-widest text-sm" 
              />
            </div>
            <div className="relative">
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="SENHA DE ACESSO" 
                className="w-full bg-[#131313] border-0 border-b-2 border-outline-variant/40 focus:border-[#ff4d4d] text-white font-headline px-4 py-4 focus:ring-0 transition-colors placeholder-outline-variant/50 outline-none tracking-widest text-sm" 
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant/50 hover:text-[#ff4d4d] transition-colors">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#8B0000] text-white py-5 font-headline uppercase font-black text-lg tracking-[0.15em] border border-[#ff4d4d]/30 hover:border-[#ff4d4d] shadow-[0_4px_20px_rgba(139,0,0,0.4)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center p-4"
          >
            {isLogin ? "INICIAR INCURSÃO" : "CRIAR SEU IMPÉRIO"}
          </button>
        </form>

        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center gap-4">
            <div className="h-px bg-outline-variant/20 flex-1"></div>
            <span className="font-body text-[10px] text-outline-variant uppercase tracking-[0.2em] font-bold">OU USE PROTOCOLOS</span>
            <div className="h-px bg-outline-variant/20 flex-1"></div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button 
              type="button" 
              onClick={signInWithGoogle}
              className="w-full bg-black/80 backdrop-blur-md text-outline-variant hover:text-white border border-outline-variant/20 hover:border-white/40 font-headline uppercase font-bold text-sm sm:text-base py-4 tracking-[0.15em] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 shrink-0"
            >
              <UserCircle className="w-5 h-5 opacity-60" />
              GOOGLE ACCOUNT
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg(null);
              }}
              className="text-outline-variant text-[10px] hover:text-[#ff4d4d] transition-colors tracking-[0.2em] mt-2 uppercase font-body font-bold underline underline-offset-4"
            >
              {isLogin ? "NÃO POSSUI BASE? SOLICITE ACESSO AQUI." : "JÁ É VETERANO? FAÇA LOGIN NA PONTE."}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
