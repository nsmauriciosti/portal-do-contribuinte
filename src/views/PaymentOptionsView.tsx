import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, ReceiptText } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { InstallmentOption } from '@/src/types';

const OPTIONS: InstallmentOption[] = [
  { id: '1', installments: 1, label: 'Cota Única (1x)', discountLabel: '25% DE DESCONTO', totalAmount: 900.00, installmentValue: 900.00 },
  { id: '2', installments: 2, label: 'Parcelado (2x)', discountLabel: '20% DE DESCONTO', totalAmount: 960.00, installmentValue: 480.00 },
  { id: '3', installments: 3, label: 'Parcelado (3x)', discountLabel: '15% DE DESCONTO', totalAmount: 1020.00, installmentValue: 340.00 },
  { id: '4', installments: 4, label: 'Parcelado (4x)', discountLabel: '10% DE DESCONTO', totalAmount: 1080.00, installmentValue: 270.00 },
  { id: '7', installments: 7, label: 'Parcelado (7x)', discountLabel: 'SEM DESCONTO', totalAmount: 1200.01, installmentValue: 171.43 },
];

export default function PaymentOptionsView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

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
            onClick={() => setSelectedId(option.id)}
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
              <span className="text-xs font-bold text-on-surface-variant">
                {option.installments === 1 ? 'Valor Total:' : 'Valor da Parcela:'}
              </span>
              <span className="text-2xl font-bold text-on-surface">
                {option.installments === 1 
                  ? `R$ ${option.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : `${option.installments}x de R$ ${option.installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                }
              </span>
            </div>
          </motion.label>
        ))}
      </div>

      <div className="flex justify-end pt-6 border-t border-surface-gray">
        <button 
          disabled={!selectedId}
          onClick={() => navigate('/method')}
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
    </div>
  );
}
