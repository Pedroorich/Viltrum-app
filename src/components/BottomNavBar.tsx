import { LayoutDashboard, Fingerprint, Medal, Users, Store } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { id: 'dashboard', label: 'HOME', path: '/home', icon: LayoutDashboard },
  { id: 'diagnosticar', label: 'DIAGNOSTICAR', path: '/diagnosticar', icon: Fingerprint },
  { id: 'conquistas', label: 'CONQUISTAS', path: '/conquistas', icon: Medal },
  { id: 'legiao', label: 'LEGIÃO', path: '/legiao', icon: Users },
  { id: 'arsenal', label: 'ARSENAL', path: '/arsenal', icon: Store },
];

export function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-safe bg-[#131313] border-t-4 border-surface-container-lowest shadow-[0_-4px_40px_rgba(139,1,0,0.08)]">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center p-2 transition-all duration-150 ease-in w-1/5 relative",
              isActive ? "bg-surface-container-highest text-primary scale-105" : "text-surface-variant hover:bg-surface-container-low hover:text-outline active:scale-95"
            )}
          >
            <Icon className={cn("w-6 h-6 mb-1", isActive && "fill-current")} />
            <span className="font-body text-[10px] font-bold tracking-[0.1em] uppercase">
              {item.label}
            </span>
            {isActive && (
              <div className="absolute bottom-0 w-full h-0.5 bg-primary-container"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
}
