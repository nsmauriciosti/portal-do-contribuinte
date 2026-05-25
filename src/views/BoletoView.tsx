import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Copy, Download, Info, ArrowLeft, Check, ReceiptText } from 'lucide-react';
import { motion } from 'motion/react';
import BoletoLayout from '../components/BoletoLayout';

export default function BoletoView() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedOption = location.state?.selectedOption || { label: 'Cota Única (1x)', installmentValue: 850.00, installments: 1, totalAmount: 850.00 };
  const cosipValue = location.state?.cosipValue || 0;
  const inscricao = location.state?.inscricao || '01.02.003.0045.001';
  const proprietario = location.state?.proprietario || 'João da Silva Pereira';
  const areaTotal = location.state?.areaTotal || 0;
  const paidinstallments = location.state?.paidinstallments || 0;

  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateLinhaDigitavel = (valor: number) => {
    const v = Math.round(valor * 100).toString().padStart(10, '0');
    return `10490.12340  56789.012343  56789.012343  9  9689${v.padStart(10, '0')}`;
  };

  const handleCopy = () => {
    const code = generateLinhaDigitavel(selectedOption.installmentValue);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-10 flex flex-col items-center gap-10 pb-32">
      <div className="flex flex-col gap-6 w-full max-w-[800px]">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-institutional-blue font-bold hover:underline w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Opções
        </button>
        <h1 className="text-4xl font-bold text-institutional-blue">Pagamento por Boleto Bancário</h1>
        <p className="text-on-surface-variant font-medium">Copie o código abaixo para pagar no aplicativo do seu banco ou visualize e imprima o boleto completo.</p>
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
                const isPaid = i < paidinstallments;
                const isCopied = copiedIndex === i;

                const handleCopyItem = () => {
                  const val = selectedOption.installmentValue;
                  const code = generateLinhaDigitavel(val);
                  navigator.clipboard.writeText(code);
                  setCopiedIndex(i);
                  setTimeout(() => setCopiedIndex(null), 2000);
                };

                return (
                  <div key={i} className="flex flex-col md:flex-row items-center justify-between p-5 bg-surface-container-low border border-surface-gray rounded-2xl gap-4 hover:border-institutional-blue transition-colors">
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                      <span className="font-bold text-on-surface">Parcela {i + 1} de {selectedOption.installments}</span>
                      <span className="text-xs font-medium text-on-surface-variant">Vencimento: {dateStr}</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                      <span className="text-lg font-bold text-success-green">R$ {selectedOption.installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      {isPaid ? (
                        <span className="bg-success-green/10 text-success-green font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 border border-success-green/20">
                          <Check className="w-4 h-4" /> Paga
                        </span>
                      ) : (
                        <button 
                          onClick={handleCopyItem}
                          className="w-full md:w-auto bg-institutional-blue text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2 active:scale-95"
                        >
                          {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {isCopied ? 'Copiado!' : 'Copiar Código'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 flex flex-col items-center gap-3">
              <button 
                onClick={() => navigate('/confirmation', { state: { selectedOption, cosipValue, inscricao, proprietario, areaTotal } })}
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
              <h3 className="text-xl font-bold text-institutional-blue">Linha Digitável (Código de Barras)</h3>
              
              <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-surface-gray">
                <span className="text-lg md:text-xl font-mono tracking-widest text-on-surface leading-loose text-center md:text-left break-all select-all font-semibold">
                  {generateLinhaDigitavel(selectedOption.installmentValue)}
                </span>
                <button 
                  onClick={handleCopy}
                  className="bg-institutional-blue text-white font-bold h-14 px-8 rounded-xl flex items-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-md shrink-0 w-full md:w-auto justify-center"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'Copiado!' : 'Copiar Código'}
                </button>
              </div>
              <p className="text-xs font-bold text-center text-on-surface-variant">Copie o código acima e pague no Internet Banking ou aplicativo do seu banco.</p>
            </motion.div>

            {/* Visual Boleto Title & Scroll Warning */}
            <div className="flex flex-col gap-2 mt-4 w-full">
              <h2 className="text-2xl font-bold text-institutional-blue flex items-center gap-2">
                <ReceiptText className="w-6 h-6 text-institutional-blue" />
                Boleto Bancário Oficial (Cota Única)
              </h2>
              <p className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5 md:hidden">
                <Info className="w-4 h-4 text-institutional-blue shrink-0" />
                Deslize o boleto para o lado para ver todos os detalhes.
              </p>
            </div>

            {/* Realistic Boleto Component Container (Scrollable on Mobile) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full overflow-x-auto pb-4 border border-surface-gray rounded-3xl bg-white shadow-sm p-4 md:p-8"
            >
              <div className="min-w-[760px]">
                <BoletoLayout 
                  proprietario={proprietario}
                  inscricao={inscricao}
                  areaTotal={areaTotal}
                  valorFinal={selectedOption.installmentValue}
                  vencimento="15/04/2026"
                  cosipValue={cosipValue}
                />
              </div>
            </motion.div>

            {/* Quick Actions & Print */}
            <div className="flex flex-col md:flex-row gap-6 mt-2">
              <div className="flex-1 bg-white border border-surface-gray rounded-3xl p-8 flex flex-col justify-between gap-6 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Resumo Financeiro</h3>
                  <p className="text-xs font-medium text-on-surface-variant mt-1">Valores referentes ao recolhimento em cota única.</p>
                </div>
                <div className="flex justify-between items-end border-t border-surface-gray pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-on-surface-variant">Detalhamento:</span>
                    <span className="text-xs font-semibold text-on-surface-variant">IPTU Original: R$ {((selectedOption.installmentValue - cosipValue) / 0.75).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    {cosipValue > 0 && (
                      <span className="text-xs font-semibold text-on-surface-variant">COSIP (Integral): R$ {cosipValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    )}
                    <span className="text-xs font-bold text-on-surface-variant mt-1">Valor Original Total:</span>
                    <span className="text-xs font-bold text-terracotta line-through">R$ {(((selectedOption.installmentValue - cosipValue) / 0.75) + cosipValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex flex-col items-end justify-end">
                    <span className="text-[10px] font-bold text-success-green bg-success-green/10 px-2 py-0.5 rounded uppercase">25% Desconto no IPTU</span>
                    <span className="text-2xl font-bold text-on-surface mt-1">R$ {selectedOption.installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white border border-surface-gray rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm gap-4">
                <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-institutional-blue">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Imprimir / Salvar PDF</h3>
                  <p className="text-xs font-medium text-on-surface-variant mt-1">Gere a guia oficial para impressão ou para salvar em seu dispositivo.</p>
                </div>
                <button 
                  onClick={() => navigate('/confirmation', { state: { selectedOption, cosipValue, inscricao, proprietario, areaTotal } })}
                  className="w-full h-12 bg-institutional-blue text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Visualizar Impressão (PDF)
                </button>
              </div>
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

