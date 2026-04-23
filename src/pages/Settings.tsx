import { TopAppBar } from '../components/TopAppBar';
import { BottomNavBar } from '../components/BottomNavBar';
import { ShieldCheck, WifiOff } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [offline, setOffline] = useState(true);
  const [notif, setNotif] = useState(true);

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        setNotif(permission === "granted");
      });
    }
  };

  return (
    <div className="antialiased min-h-screen flex flex-col pb-24 selection:bg-[#8B0000] selection:text-white font-body bg-[#050505] text-white">
      <TopAppBar />
      
      <main className="flex-grow flex flex-col px-6 pt-8 w-full max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="font-headline text-4xl font-extrabold uppercase tracking-tighter text-white leading-none -ml-1">SISTEMA</h2>
          <p className="font-body text-sm font-bold tracking-[0.1em] text-outline-variant mt-2 uppercase">Parâmetros Operacionais</p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <div className="bg-[#131313] p-5 flex justify-between items-center relative group overflow-hidden border-l-4 border-transparent hover:border-[#8B0000] transition-colors duration-150">
            <div className="relative z-10">
              <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-white">Modo Offline (Cached)</h3>
              <p className="font-body text-xs text-outline-variant mt-1 max-w-[200px]">Armazenamento local da Base via IndexedDB e Service Workers.</p>
            </div>
            
            <div 
              className="relative inline-block w-12 h-6 mr-2 align-middle select-none transition duration-150 ease-in z-10 bg-black border-2 border-outline-variant cursor-not-allowed"
              title="Ativado pelo Subsistema de Dados"
            >
              <div 
                className="absolute top-[-2px] left-[-2px] w-[50%] h-[calc(100%+4px)] border-2 transition-transform duration-150 ease-in-out transform translate-x-full bg-[#ff4d4d] border-[#8B0000]"
              ></div>
            </div>
          </div>

          <div className="bg-[#131313] p-5 flex justify-between items-center relative group overflow-hidden border-l-4 border-transparent hover:border-[#8B0000] transition-colors duration-150 opacity-100">
            <div className="relative z-10">
              <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-white">Notificações Táticas</h3>
              <p className="font-body text-xs text-outline-variant mt-1">Alertas push nativos para Conquistas.</p>
            </div>
            
            <div 
              className="relative inline-block w-12 h-6 mr-2 align-middle select-none transition duration-150 ease-in z-10 bg-black border-2 border-outline-variant cursor-pointer"
              onClick={requestNotificationPermission}
            >
              <div 
                className={`absolute top-[-2px] left-[-2px] w-[50%] h-[calc(100%+4px)] border-2 transition-transform duration-150 ease-in-out ${notif ? 'transform translate-x-full bg-[#ff4d4d] border-[#8B0000]' : 'bg-surface-container-high border-outline-variant'}`}
              ></div>
            </div>
          </div>
        </div>

        {/* Explain Offline Mode Area */}
        <div className="mt-auto relative bg-[#0a0a0a] border-l-4 border-[#8B0000] p-1 flex-shrink-0 mb-6">
          <div className="absolute inset-0 noise-bg opacity-30"></div>
          
          <div className="relative z-10 p-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <WifiOff className="w-5 h-5 text-[#ff4d4d]" />
                <span className="font-body text-[10px] font-bold tracking-[0.2em] text-[#ff4d4d] uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff4d4d] animate-pulse"></span>
                  Persistência Offline Ativa
                </span>
              </div>
              <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-white leading-[1] mt-4 mb-4">
                COMO O SISTEMA OPERA SEM REDE
              </h2>
              <div className="font-body text-sm text-outline-variant max-w-[90%] leading-relaxed space-y-4">
                <p>
                  O Império construiu a infraestrutura deste aplicativo para ser resiliente a zonas cegas (sem WiFi/4G). 
                </p>
                <div className="bg-[#131313] p-4 border border-outline-variant/20 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8B0000]"></div>
                  <h4 className="text-white font-headline uppercase font-bold text-xs tracking-wider mb-2">1. Cache de Dados Base (IndexedDB)</h4>
                  <p className="text-xs">Todo o seu progresso de missões, experiência (XP) acumulada e estatísticas do perfil são guardados no banco de dados local do seu dispositivo celular pela engine do Firebase. Assim que você recuperar sinal, os nós de dados sincronizarão em segundo plano com as torres principais sem que você precise interagir.</p>
                </div>
                <div className="bg-[#131313] p-4 border border-outline-variant/20 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8B0000]"></div>
                  <h4 className="text-white font-headline uppercase font-bold text-xs tracking-wider mb-2">2. Visualização de Tutoriais (Cached Assets)</h4>
                  <p className="text-xs">Os textos estratégicos das missões que você já abriu permanecem gravados em cache. Observação Tática: Vídeos nativos dependem de cache do provedor (YouTube) e a Inteligência Artificial do scanner (Câmera AR) necessita de conexão nativa para se comunicar com a rede global.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
               <span className="font-headline text-xs text-outline-variant tracking-widest uppercase">Acesso Global Liberado</span>
               <ShieldCheck className="w-6 h-6 text-[#ff4d4d]" />
            </div>
          </div>
        </div>
      </main>

      <div className="md:hidden">
        <BottomNavBar />
      </div>
    </div>
  );
}
