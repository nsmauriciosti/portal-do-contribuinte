import { useNavigate, useLocation } from 'react-router-dom';
import { Copy, Download, Info, ArrowLeft, Receipt } from 'lucide-react';
import { motion } from 'motion/react';

export default function BoletoView() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedOption = location.state?.selectedOption || { label: 'Parcelamento', installmentValue: 1200.00 };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-10 flex flex-col items-center gap-10 pb-32">
      <div className="flex flex-col gap-6 w-full max-w-[800px]">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-institutional-blue font-bold hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Opções
        </button>
        <h1 className="text-4xl font-bold text-institutional-blue">Pagamento por Código de Barras</h1>
        <p className="text-on-surface-variant font-medium">Copie o código abaixo para pagar no aplicativo do seu banco ou utilize o boleto em formato PDF.</p>
      </div>

      <div className="w-full max-w-[800px] flex flex-col gap-6">
        {/* Code Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-surface-gray rounded-3xl p-8 flex flex-col gap-6 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-institutional-blue" />
          <h3 className="text-xl font-bold text-institutional-blue">Linha Digitável</h3>
          
          <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-surface-gray">
            <span className="text-lg md:text-2xl font-mono tracking-widest text-on-surface leading-loose text-center md:text-left break-all">
              84680000001 5 12340109011 0 00123456789 2 01234567890 3
            </span>
            <button className="bg-institutional-blue text-white font-bold h-14 px-8 rounded-xl flex items-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-md shrink-0">
              <Copy className="w-5 h-5" />
              Copiar Código
            </button>
          </div>
          <p className="text-xs font-bold text-center text-on-surface-variant">O código expira na data de vencimento informada abaixo.</p>
        </motion.div>

        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-8 bg-white border border-surface-gray rounded-3xl p-8 flex flex-col gap-6 shadow-sm"
          >
            <h3 className="text-xl font-bold text-institutional-blue border-b border-surface-gray pb-4">Resumo do Débito</h3>
            <div className="flex flex-col gap-1">
              {[
                { label: 'Inscrição Imobiliária', value: '01.02.003.0045.001' },
                { label: 'Parcela', value: selectedOption.label },
                { label: 'Vencimento', value: '15/04/2024' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-3 border-b border-surface-gray/50 last:border-0">
                  <span className="text-sm font-medium text-on-surface-variant">{item.label}</span>
                  <span className="text-sm font-bold text-on-surface">{item.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4">
                <span className="text-lg font-bold text-on-surface">Valor a Pagar</span>
                <span className="text-2xl font-bold text-success-green">R$ {selectedOption.installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 bg-white border border-surface-gray rounded-3xl p-8 flex flex-col gap-6 items-center justify-center text-center shadow-sm"
          >
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-institutional-blue">
              <Download className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Precisa do boleto?</h3>
              <p className="text-xs font-medium text-on-surface-variant mt-2">Baixe o documento completo em formato PDF.</p>
            </div>
            <button 
              onClick={() => navigate('/confirmation')}
              className="w-full h-12 border-2 border-institutional-blue text-institutional-blue font-bold rounded-xl hover:bg-surface-container transition-all"
            >
              Baixar Boleto PDF
            </button>
          </motion.div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-6 flex gap-4 items-start border border-outline-variant">
          <Info className="w-6 h-6 text-institutional-blue shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
            Após o pagamento, a baixa no sistema pode levar até 2 dias úteis para compensação bancária. Guarde o comprovante gerado pelo seu banco.
          </p>
        </div>
      </div>
    </div>
  );
}
