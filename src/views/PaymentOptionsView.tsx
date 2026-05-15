import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, ReceiptText, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { InstallmentOption } from '@/src/types';



export default function PaymentOptionsView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const baseValue = location.state?.baseValue;
  const inscricao = location.state?.inscricao || '01.02.003.0045.001';
  const proprietario = location.state?.proprietario || 'João da Silva Pereira';

  if (baseValue === undefined) {
    return <Navigate to="/" replace />;
  }

  const OPTIONS: InstallmentOption[] = [
    { id: '1', installments: 1, label: 'Cota Única (1x)', discountLabel: '25% DE DESCONTO', totalAmount: baseValue * 0.75, installmentValue: baseValue * 0.75 },
    { id: '2', installments: 2, label: 'Parcelado (2x)', discountLabel: '20% DE DESCONTO', totalAmount: baseValue * 0.80, installmentValue: (baseValue * 0.80) / 2 },
    { id: '3', installments: 3, label: 'Parcelado (3x)', discountLabel: '15% DE DESCONTO', totalAmount: baseValue * 0.85, installmentValue: (baseValue * 0.85) / 3 },
    { id: '4', installments: 4, label: 'Parcelado (4x)', discountLabel: '10% DE DESCONTO', totalAmount: baseValue * 0.90, installmentValue: (baseValue * 0.90) / 4 },
    { id: '7', installments: 7, label: 'Parcelado (7x)', discountLabel: 'SEM DESCONTO', totalAmount: baseValue, installmentValue: baseValue / 7 },
  ];

  const handleOptionSelect = (id: string) => {
    setSelectedId(id);
    setShowConfirmModal(true);
  };

  const handleModalCancel = () => {
    setShowConfirmModal(false);
    setSelectedId(null);
  };

  const handleModalConfirm = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-10 flex flex-col gap-10 pb-32 md:pb-10">
      <div className="flex flex-col gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-institutional-blue hover:underline w-fit font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Opções
        </button>
        
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-institutional-blue">Opções de Pagamento</h2>
          <p className="text-on-surface-variant font-medium">Selecione a melhor forma de pagamento para você:</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {OPTIONS.map((option, index) => (
          <motion.label 
            key={option.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleOptionSelect(option.id)}
            className={cn(
              "relative flex flex-col p-6 rounded-2xl border transition-all cursor-pointer group hover:shadow-lg",
              selectedId === option.id 
                ? "border-institutional-blue bg-white ring-2 ring-institutional-blue/5 shadow-md" 
                : "border-surface-gray bg-white hover:border-institutional-blue"
            )}
          >
            <input 
              type="radio" 
              name="installment" 
              checked={selectedId === option.id}
              className="sr-only"
              readOnly
            />
            
            <div className="flex justify-between items-start mb-10">
              <div className="flex flex-col gap-2">
                <span className="text-xl font-bold text-institutional-blue">{option.label}</span>
                <span className={cn(
                  "inline-flex px-3 py-1 text-[10px] font-bold uppercase rounded-md w-fit",
                  option.discountLabel === 'SEM DESCONTO' ? "bg-surface-variant text-on-surface-variant" : "bg-warning-gold text-on-surface"
                )}>
                  {option.discountLabel}
                </span>
              </div>
              {selectedId === option.id ? (
                <CheckCircle2 className="w-6 h-6 text-institutional-blue" />
              ) : (
                <Circle className="w-6 h-6 text-outline-variant" />
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-surface-gray flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface-variant">
                  {option.discountLabel === 'SEM DESCONTO' ? 'Valor Total:' : 'Valor com Desconto:'}
                </span>
                {option.discountLabel !== 'SEM DESCONTO' && (
                  <span className="text-[10px] font-medium text-terracotta line-through mt-0.5">
                    De R$ {baseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-on-surface">
                  R$ {option.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {option.installments > 1 && (
                  <span className="text-xs font-bold text-institutional-blue mt-0.5">
                    ({option.installments}x de R$ {option.installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                  </span>
                )}
              </div>
            </div>
          </motion.label>
        ))}
      </div>

      <div className="flex justify-end pt-6 border-t border-surface-gray">
        <button 
          disabled={!selectedId}
          onClick={() => {
            const selectedOption = OPTIONS.find(o => o.id === selectedId);
            navigate('/method', { state: { selectedOption, inscricao, proprietario } });
          }}
          className={cn(
            "w-full md:w-auto h-14 px-10 rounded-xl font-bold flex items-center justify-center gap-3 transition-all",
            selectedId 
              ? "bg-institutional-blue text-white shadow-lg shadow-institutional-blue/20 active:scale-95" 
              : "bg-surface-gray text-on-surface-variant cursor-not-allowed opacity-50"
          )}
        >
          <ReceiptText className="w-5 h-5" />
          Confirmar e Gerar Guia
        </button>
      </div>

      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 pb-0 flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-warning-gold/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-warning-gold" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-bold text-on-surface mb-2">Atenção</h3>
                  <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
                    Ao selecionar essa opção, você não poderá alterá-lo novamente, o não pagamento até a data limite, você perderá o desconto.
                  </p>
                </div>
              </div>
              <div className="p-6 flex items-center justify-end gap-3 mt-4 bg-surface-gray/30 border-t border-surface-gray">
                <button 
                  onClick={handleModalCancel}
                  className="px-6 py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-gray transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleModalConfirm}
                  className="px-6 py-2.5 rounded-xl font-bold bg-institutional-blue text-white hover:bg-primary shadow-lg shadow-institutional-blue/20 transition-all active:scale-95"
                >
                  Estou Ciente
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
