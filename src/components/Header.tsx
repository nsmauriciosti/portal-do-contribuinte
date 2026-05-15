import { Landmark } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="bg-institutional-blue text-white sticky top-0 z-50 h-16 shadow-lg">
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity active:scale-95">
          <Landmark className="w-7 h-7" fill="currentColor" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Nova Serrana - IPTU
          </h1>
        </Link>
        
        {!isHome && (
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="text-sm font-semibold opacity-80 hover:opacity-100 transition-opacity">Início</Link>
            <Link to="/debts" className="text-sm font-semibold opacity-100 border-b-2 border-secondary-container pb-1">Débitos</Link>
            <Link to="#" className="text-sm font-semibold opacity-80 hover:opacity-100 transition-opacity">Guia</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
