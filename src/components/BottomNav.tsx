import { Home, FileText, CreditCard } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-white border border-outline-variant shadow-xl rounded-2xl z-50 flex justify-around items-center px-4">
      <NavLink 
        to="/" 
        className={({ isActive }) => cn(
          "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all",
          isActive ? "text-institutional-blue" : "text-on-surface-variant"
        )}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Início</span>
      </NavLink>

      <NavLink 
        to="/debts" 
        className={({ isActive }) => cn(
          "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all p-1.5 rounded-full",
          isActive ? "bg-secondary-container text-on-secondary-container scale-105" : "text-on-surface-variant"
        )}
      >
        <FileText className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Débitos</span>
      </NavLink>

      <NavLink 
        to="/options" 
        className={({ isActive }) => cn(
          "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all",
          isActive ? "text-institutional-blue" : "text-on-surface-variant"
        )}
      >
        <CreditCard className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Guia</span>
      </NavLink>
    </nav>
  );
}
