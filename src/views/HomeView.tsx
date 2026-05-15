import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Search, Info, Fingerprint } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function HomeView() {
  const [method, setMethod] = useState<'doc' | 'insc'>('doc');
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      navigate('/debts');
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-10 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-[-1] opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at center, #1F295E 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white border border-surface-gray rounded-3xl shadow-sm overflow-hidden"
      >
        <div className="p-8 flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center">
              <Landmark className="w-10 h-10 text-institutional-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-on-surface">Portal do Contribuinte</h1>
              <p className="text-on-surface-variant text-sm mt-1">Acesse para consultar seus débitos de IPTU 2024</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="flex flex-col gap-6">
            {/* Toggle */}
            <div className="flex bg-surface-container p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMethod('doc')}
                className={cn(
                  "flex-1 py-3 text-sm font-bold rounded-lg transition-all",
                  method === 'doc' ? "bg-white shadow-sm text-on-surface" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                CPF/CNPJ
              </button>
              <button
                type="button"
                onClick={() => setMethod('insc')}
                className={cn(
                  "flex-1 py-3 text-sm font-bold rounded-lg transition-all",
                  method === 'insc' ? "bg-white shadow-sm text-on-surface" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                Inscrição Imobiliária
              </button>
            </div>

            {/* Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Fingerprint className="w-5 h-5 text-outline" />
              </div>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={method === 'doc' ? "000.000.000-00" : "01.02.003..."}
                className="w-full h-14 pl-12 pr-4 bg-surface-container-low border border-surface-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-institutional-blue transition-all"
              />
            </div>

            {/* Action */}
            <button
              type="submit"
              className="w-full h-14 bg-institutional-blue text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Consultar Débitos
            </button>
          </form>

          {/* Info Note */}
          <div className="p-4 bg-surface-container-low border border-surface-gray rounded-2xl flex gap-3">
            <Info className="w-5 h-5 text-institutional-blue shrink-0 mt-0.5" />
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Mantenha seus dados atualizados para garantir o recebimento das guias. O não pagamento pode acarretar em juros e multas.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="bg-surface-container p-4 flex justify-center gap-4 text-xs font-bold text-institutional-blue border-t border-surface-gray">
          <a href="#" className="hover:underline">Ajuda</a>
          <span className="w-1 h-1 rounded-full bg-surface-gray mt-1.5" />
          <a href="#" className="hover:underline">Suporte</a>
        </div>
      </motion.div>
    </div>
  );
}
