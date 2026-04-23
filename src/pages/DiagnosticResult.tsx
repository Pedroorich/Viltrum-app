import { TopAppBar } from '../components/TopAppBar';
import { BottomNavBar } from '../components/BottomNavBar';
import { Play, Wrench, ShieldAlert, Archive, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DiagnosticResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as {
    diagnosticData: {
      problemName: string;
      confidence: number;
      riskLevel: string;
      riskMessage: string;
      callToAction: string;
      steps: { title: string; description: string; }[];
      arsenal: { name: string; type: string; isPrimary: boolean; }[];
    };
    imageUrl: string;
  };

  const { diagnosticData: data, imageUrl } = state || {};

  if (!data) {
    return (
      <div className="bg-surface text-on-surface h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-headline text-3xl font-black uppercase text-error mb-4">FALHA NA TRANSMISSÃO</h2>
        <p className="font-body text-on-surface-variant mb-8">Não conseguimos processar o alvo. Retorne e escaneie novamente.</p>
        <button onClick={() => navigate('/diagnosticar')} className="bg-primary text-on-primary font-headline uppercase font-bold py-3 px-8 hover:bg-primary-container hover:text-on-primary-container transition-colors">Voltar ao Scanner</button>
      </div>
    );
  }

  const RiskIcon = data.riskLevel === 'CRÍTICO' ? ShieldAlert : data.riskLevel === 'ALERTA' ? AlertTriangle : CheckCircle2;
  const riskColor = data.riskLevel === 'CRÍTICO' ? 'error' : data.riskLevel === 'ALERTA' ? 'tertiary' : 'primary';

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col pb-24 md:pb-0">
      <TopAppBar />
      
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-12">
        <section className="flex flex-col gap-6">
          <h2 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter text-primary leading-[0.9]">
            {data.problemName}<br />
            <span className="text-on-surface opacity-50">— {data.confidence}% certeza</span>
          </h2>

          <div className={`bg-surface-container-lowest border-l-8 border-${riskColor}-container p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
            <div className="flex items-center gap-4">
              <RiskIcon className={`w-10 h-10 text-${riskColor}`} />
              <div>
                <p className={`font-headline font-bold text-${riskColor} uppercase tracking-widest text-sm`}>{data.riskMessage}</p>
                <p className="font-headline text-2xl font-black text-on-surface uppercase">{data.callToAction}</p>
              </div>
            </div>
            <div className="w-full md:w-64 h-4 bg-surface-container flex">
              <div className="w-1/3 bg-tertiary opacity-20"></div>
              <div className="w-1/3 bg-secondary opacity-20"></div>
              <div className={`w-1/3 bg-${riskColor}-container relative`}>
                <div className={`absolute inset-0 bg-${riskColor} opacity-20 blur-sm`}></div>
              </div>
            </div>
          </div>
        </section>

        {imageUrl && (
          <section className="w-full aspect-video bg-surface-container-lowest relative group overflow-hidden border-2 border-surface-container-highest cursor-pointer">
            <div className="absolute inset-0 bg-primary-container opacity-10 noise-bg mix-blend-overlay"></div>
            <img 
              className="w-full h-full object-cover opacity-60 grayscale group-hover:opacity-80 transition-opacity duration-300" 
              src={imageUrl} 
              alt="Scan" 
            />
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <section className="lg:col-span-2 flex flex-col gap-6">
            <h3 className="font-headline text-3xl font-black uppercase text-on-surface border-b-4 border-surface-container-lowest pb-4">Protocolo de Extração</h3>
            <div className="flex flex-col gap-8">
              {data.steps.map((step, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className={`font-headline text-5xl font-black select-none ${index === data.steps.length - 1 ? 'text-primary' : 'text-surface-container-highest'}`}>
                    0{index + 1}
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <h4 className={`font-headline text-xl font-bold uppercase ${index === data.steps.length - 1 ? 'text-primary' : 'text-on-surface'}`}>{step.title}</h4>
                    <p className="text-on-tertiary-container text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <h3 className="font-headline text-xl font-black uppercase text-on-surface border-b-4 border-surface-container-lowest pb-4">Arsenal Necessário</h3>
            <div className="flex flex-col gap-4">
              {data.arsenal.map((item, idx) => (
                <div key={idx} className={`bg-surface-container-low p-4 hover:bg-surface-container-high transition-colors duration-150 flex items-center justify-between group border border-transparent hover:border-outline-variant/20 cursor-pointer ${item.isPrimary ? 'border-l-2 !border-l-primary' : ''}`}>
                  <div className="flex items-center gap-4">
                    {item.type === 'tool' ? <Wrench className={`w-5 h-5 ${item.isPrimary ? 'text-primary' : 'text-tertiary group-hover:text-primary transition-colors'}`} /> : <Archive className={`w-5 h-5 ${item.isPrimary ? 'text-primary' : 'text-tertiary group-hover:text-primary transition-colors'}`} />}
                    <span className={`font-headline font-bold uppercase text-sm tracking-wide ${item.isPrimary ? 'text-primary' : 'text-on-surface'}`}>{item.name}</span>
                  </div>
                  <ExternalLink className={`w-4 h-4 ${item.isPrimary ? 'text-primary' : 'text-surface-variant group-hover:text-primary'}`} />
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="w-full pt-8 pb-12 relative flex justify-center">
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full w-3/4 mx-auto pointer-events-none"></div>
          <button onClick={() => navigate('/executar')} className="w-full max-w-2xl bg-gradient-to-tr from-primary-container to-secondary-fixed-variant text-on-surface font-headline text-2xl font-black uppercase tracking-widest py-6 px-8 hover:scale-[0.99] active:scale-95 transition-transform duration-150 relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            <span className="relative z-10 flex items-center justify-center gap-4">
              Conquistar Agora
              <Play className="w-6 h-6" fill="currentColor" />
            </span>
          </button>
        </div>
      </main>
      
      <div className="fixed bottom-0 w-full z-50">
        <BottomNavBar />
      </div>
    </div>
  );
}
