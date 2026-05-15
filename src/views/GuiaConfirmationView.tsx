import { useNavigate } from 'react-router-dom';
import { Landmark, Download, Mail, CheckCircle2, Home, Printer } from 'lucide-react';
import { motion } from 'motion/react';

export default function GuiaConfirmationView() {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-10 flex flex-col items-center gap-10 pb-32">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[720px] bg-white rounded-3xl border border-outline-variant shadow-lg overflow-hidden flex flex-col"
      >
        {/* Success Header */}
        <div className="bg-surface-container-low p-10 border-b border-surface-gray flex flex-col items-center text-center gap-6">
          <div className="w-24 h-24 bg-success-green/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-success-green" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-on-surface">Guia Disponível</h2>
            <p className="text-lg font-medium text-on-surface-variant">Seu plano de pagamento foi gerado com sucesso!</p>
          </div>
        </div>

        {/* Guia Body */}
        <div className="p-10 flex flex-col gap-10">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-surface-gray pb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-institutional-blue flex items-center justify-center text-white">
                <Landmark className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-on-surface">Prefeitura de Nova Serrana</span>
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Documento de Arrecadação 2024</span>
              </div>
            </div>
            <div className="px-4 py-1.5 bg-surface-container-high rounded-full font-bold text-[10px] text-on-surface uppercase tracking-widest">
              Via Única
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Contribuinte</span>
              <span className="text-lg font-bold text-on-surface border-b border-surface-gray/50 pb-1">João da Silva Pereira</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Inscrição Imobiliária</span>
              <span className="text-lg font-bold text-on-surface border-b border-surface-gray/50 pb-1">01.02.003.0045.001</span>
            </div>
          </div>

          {/* Financials highlight */}
          <div className="bg-surface-bg p-8 rounded-2xl border border-surface-gray flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Vencimento</span>
              <span className="text-2xl font-bold text-on-surface">15/04/2024</span>
            </div>
            <div className="flex flex-col md:items-end gap-1">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Valor a Recolher</span>
              <span className="text-5xl font-bold text-institutional-blue">R$ 850,00</span>
            </div>
          </div>

          {/* Barcode representation */}
          <div className="flex flex-col items-center gap-4 py-6 border-t border-surface-gray">
            <div className="w-full max-w-md h-20 bg-surface-bg border border-outline-variant p-4 flex items-end justify-around rounded-lg">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className={`h-full bg-on-background ${i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-[3px]' : 'w-[0.5px]'} opacity-80`} />
              ))}
            </div>
            <span className="font-mono text-xs font-bold text-on-surface-variant tracking-[0.2em] text-center max-w-md">
              846800000085 500001090110 004500120248 150420240000
            </span>
          </div>
        </div>

        {/* Bottom Nav inside card */}
        <div className="bg-surface-container-low p-8 flex justify-center border-t border-surface-gray">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-institutional-blue font-bold px-8 py-3 rounded-xl hover:bg-white transition-all active:scale-95"
          >
            <Home className="w-5 h-5" />
            Voltar ao Início
          </button>
        </div>
      </motion.div>

      {/* Primary Actions */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-[720px]">
        <button className="flex-1 bg-institutional-blue text-white font-bold h-16 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-institutional-blue/20">
          <Download className="w-6 h-6" />
          Baixar Guia PDF
        </button>
        <button className="flex-1 border-2 border-institutional-blue text-institutional-blue font-bold h-16 rounded-2xl flex items-center justify-center gap-3 hover:bg-surface-container transition-all active:scale-[0.98]">
          <Mail className="w-6 h-6" />
          Enviar por E-mail
        </button>
      </div>
    </div>
  );
}
