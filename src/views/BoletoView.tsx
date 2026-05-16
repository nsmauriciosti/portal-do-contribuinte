import { useNavigate, useLocation } from 'react-router-dom';
import { Copy, Download, Info, ArrowLeft, Receipt } from 'lucide-react';
import { motion } from 'motion/react';

export default function BoletoView() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedOption = location.state?.selectedOption || { label: 'Parcelamento', installmentValue: 1200.00, installments: 2, totalAmount: 1200.00 };
  const inscricao = location.state?.inscricao || '01.02.003.0045.001';
  const proprietario = location.state?.proprietario || 'João da Silva Pereira';
  const areaTotal = location.state?.areaTotal || 0;

  const generateLinha = (valor: number) => {
    const v = Math.round(valor * 100).toString().padStart(11, '0');
    return `81680000000 ${v.substring(0,1)} ${v.substring(1, 11)}1234 0 00000000000 0 00000000000 0`;
  };

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
        {selectedOption.installments > 1 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-surface-gray rounded-3xl p-8 flex flex-col gap-6 shadow-sm w-full"
          >
            <h3 className="text-2xl font-bold text-institutional-blue border-b border-surface-gray pb-4">Carnê de Pagamento ({selectedOption.installments}x)</h3>
            <p className="text-sm text-on-surface-variant font-medium mb-4">Abaixo estão todas as guias do seu parcelamento. Você pode pagar a primeira agora e baixar o carnê completo para as próximas.</p>
            
            <div className="flex flex-col gap-4">
              {Array.from({ length: selectedOption.installments }).map((_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() + i);
                const dateStr = date.toLocaleDateString('pt-BR');
                return (
                  <div key={i} className="flex flex-col md:flex-row items-center justify-between p-5 bg-surface-container-low border border-surface-gray rounded-2xl gap-4 hover:border-institutional-blue transition-colors">
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                      <span className="font-bold text-on-surface">Parcela {i + 1} de {selectedOption.installments}</span>
                      <span className="text-xs font-medium text-on-surface-variant">Vencimento: {dateStr}</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                      <span className="text-lg font-bold text-success-green">R$ {selectedOption.installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <button className="w-full md:w-auto bg-institutional-blue text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2 active:scale-95">
                        <Copy className="w-4 h-4" /> Copiar Código
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 flex flex-col items-center gap-3">
              <button 
                onClick={() => navigate('/confirmation', { state: { selectedOption, inscricao, proprietario, areaTotal } })}
                className="w-full md:w-auto bg-institutional-blue text-white font-bold h-14 px-10 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-md"
              >
                <Download className="w-5 h-5" /> Baixar Carnê Completo (PDF)
              </button>
            </div>
          </motion.div>
        ) : (
          <>
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
                  {generateLinha(selectedOption.installmentValue)}
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
                    { label: 'Inscrição Imobiliária', value: inscricao },
                    { label: 'Área Construída', value: `${Number(areaTotal).toLocaleString('pt-BR')} m²` },
                    { label: 'Parcela', value: selectedOption.label },
                    { label: 'Vencimento', value: '15/04/2026' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-3 border-b border-surface-gray/50 last:border-0">
                      <span className="text-sm font-medium text-on-surface-variant">{item.label}</span>
                      <span className="text-sm font-bold text-on-surface">{item.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-lg font-bold text-on-surface">Valor a Pagar</span>
                    <span className="text-2xl font-bold text-success-green">R$ {selectedOption.installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                  onClick={() => navigate('/confirmation', { state: { selectedOption, inscricao, proprietario, areaTotal } })}
                  className="w-full h-12 border-2 border-institutional-blue text-institutional-blue font-bold rounded-xl hover:bg-surface-container transition-all"
                >
                  Baixar Boleto PDF
                </button>
              </motion.div>
            </div>
          </>
        )}

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
