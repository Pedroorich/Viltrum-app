import { Shield, Bell, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

export function TopAppBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton = !['/', '/login', '/home'].includes(location.pathname);

  return (
    <header className="bg-[#131313] w-full top-0 sticky z-40">
      <div className="flex justify-between items-center px-6 py-4 w-full relative">
        <div className="flex items-center gap-4 z-10">
          {showBackButton ? (
            <button 
              onClick={() => navigate(-1)}
              className="text-[#8B0000] hover:text-primary transition-colors duration-150 active:scale-95 flex items-center justify-center p-2 rounded-none border border-outline-variant/30 bg-surface-container-low"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={3} />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/home')}
              className="text-[#8B0000] hover:text-primary transition-colors duration-150 active:scale-95 flex items-center justify-center p-1"
            >
              <Shield className="w-6 h-6 fill-[#8B0000]" />
            </button>
          )}
        </div>
        
        <h1 
          className="font-headline uppercase tracking-tighter font-black text-2xl text-[#8B0000] cursor-pointer absolute left-1/2 -translate-x-1/2"
          onClick={() => navigate('/home')}
        >
          VILTRUM
        </h1>
        
        <button 
          onClick={() => navigate('/configuracoes')}
          className="text-[#8B0000] hover:text-primary transition-colors duration-150 active:scale-95 flex items-center justify-center p-1 z-10"
        >
          <Bell className="w-6 h-6 fill-current" />
        </button>
      </div>
      <div className="bg-surface-container-lowest h-3 w-full border-t-2 border-surface-container/20"></div>
    </header>
  );
}
