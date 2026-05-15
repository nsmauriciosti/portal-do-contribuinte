import { useLocation, useNavigate } from 'react-router-dom';
import { Landmark, Download, Mail, CheckCircle2, Home, Printer } from 'lucide-react';
import { motion } from 'motion/react';

export default function GuiaConfirmationView() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedOption = location.state?.selectedOption || { installments: 1, installmentValue: 850.00, totalAmount: 850.00 };
  const inscricao = location.state?.inscricao || '01.02.003.0045.001';
  const proprietario = location.state?.proprietario || 'João da Silva Pereira';

  const generateLinha = (valor: number) => {
    const v = Math.round(valor * 100).toString().padStart(11, '0');
    return `81680000000 ${v.substring(0,1)} ${v.substring(1, 11)}1234 0 00000000000 0 00000000000 0`;
  };

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
        {Array.from({ length: selectedOption.installments }).map((_, idx) => {
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + idx);
          const dueDateStr = dueDate.toLocaleDateString('pt-BR');
          return (
            <div key={idx} className="p-10 flex flex-col gap-10 border-b-2 border-dashed border-surface-gray last:border-b-0 relative print:break-inside-avoid print:p-8">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-surface-gray pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-institutional-blue flex items-center justify-center text-white">
                    <Landmark className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-on-surface">Prefeitura de Nova Serrana</span>
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      {selectedOption.installments > 1 ? `Carnê de Pagamento - Parcela ${idx + 1}/${selectedOption.installments}` : 'Documento de Arrecadação 2024'}
                    </span>
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
                  <span className="text-lg font-bold text-on-surface border-b border-surface-gray/50 pb-1">{proprietario}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Inscrição Imobiliária</span>
                  <span className="text-lg font-bold text-on-surface border-b border-surface-gray/50 pb-1">{inscricao}</span>
                </div>
              </div>

              {/* Financials highlight */}
              <div className="bg-surface-bg p-8 rounded-2xl border border-surface-gray flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Vencimento</span>
                  <span className="text-2xl font-bold text-on-surface">{dueDateStr}</span>
                </div>
                <div className="flex flex-col md:items-end gap-1">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Valor a Recolher</span>
                  <span className="text-5xl font-bold text-institutional-blue">
                    R$ {selectedOption.installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="flex flex-col items-center gap-4 py-6 border-t border-surface-gray">
                <div className="w-full max-w-md h-20 bg-white border border-surface-gray p-4 flex items-end justify-around rounded-lg">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className={`h-full bg-black ${i % 3 === 0 ? 'w-[4px]' : i % 5 === 0 ? 'w-[2px]' : 'w-[1px]'} opacity-90`} />
                  ))}
                </div>
                <span className="font-mono text-xs font-bold text-on-surface-variant tracking-[0.2em] text-center max-w-md break-all">
                  {generateLinha(selectedOption.installmentValue)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Bottom Nav inside card */}
        <div className="bg-surface-container-low p-8 flex justify-center border-t border-surface-gray print:hidden">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-institutional-blue font-bold px-8 py-3 rounded-xl hover:bg-white transition-all active:scale-95"
          >
            <Home className="w-5 h-5" />
            Voltar ao Início
          </button>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-[720px] print:hidden">
        <button 
          onClick={() => window.print()}
          className="flex-1 bg-institutional-blue text-white font-bold h-16 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-institutional-blue/20"
        >
          <Printer className="w-6 h-6" />
          {selectedOption.installments > 1 ? 'Gerar Carnê PDF' : 'Gerar Guia PDF'}
        </button>
        <button 
          onClick={() => alert('Uma cópia do documento foi enviada para o seu e-mail de cadastro.')}
          className="flex-1 border-2 border-institutional-blue text-institutional-blue font-bold h-16 rounded-2xl flex items-center justify-center gap-3 hover:bg-surface-container transition-all active:scale-[0.98]"
        >
          <Mail className="w-6 h-6" />
          Enviar por E-mail
        </button>
      </div>
    </div>
  );
}
