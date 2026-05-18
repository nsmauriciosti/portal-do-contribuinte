import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QrCode, FileText, CreditCard, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { PaymentMethod } from '@/src/types';

const METHODS = [
  { 
    id: PaymentMethod.PIX, 
    title: 'Pix', 
    description: 'Instantâneo, aprovação imediata. A forma mais rápida de quitar seu débito.',
    icon: QrCode,
    recommended: true
  },
  { 
    id: PaymentMethod.BOLETO, 
    title: 'Boleto Bancário', 
    description: 'Até 2 dias úteis para compensação. Pague em qualquer rede bancária ou lotérica.',
    icon: FileText
  },
  { 
    id: PaymentMethod.CREDIT_CARD, 
    title: 'Cartão de Crédito', 
    description: 'Parcelamento em até 12x via operadora (sujeito a taxas da administradora).',
    icon: CreditCard
  }
];

export default function PaymentMethodView() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedOption = location.state?.selectedOption;
  const inscricao = location.state?.inscricao;
  const proprietario = location.state?.proprietario;
  const areaTotal = location.state?.areaTotal;

  const handleContinue = () => {
    // Save agreement to mock database for Admin Dashboard
    if (selectedOption) {
      try {
        const existing = JSON.parse(localStorage.getItem('portal_agreements') || '[]');
        const newAgreement = {
          id: Date.now(),
          name: proprietario || 'Contribuinte',
          inscricao: inscricao || '-',
          option: selectedOption.label,
          value: selectedOption.totalAmount || 0,
          date: new Date().toLocaleDateString('pt-BR'),
          status: 'Aguardando Pagamento',
          installments: selectedOption.installments || 1,
          paidInstallments: 0,
          phone: '(37) 99999-9999' // mock phone for WA
        };
        // avoid duplicating the exact same agreement in the same session
        const isDuplicate = existing.some((e: any) => e.inscricao === newAgreement.inscricao && e.option === newAgreement.option && e.date === newAgreement.date);
        if (!isDuplicate) {
          localStorage.setItem('portal_agreements', JSON.stringify([newAgreement, ...existing]));
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (selectedMethod === PaymentMethod.PIX) {
      navigate('/payment/pix', { state: { selectedOption, inscricao, proprietario, areaTotal } });
    } else if (selectedMethod === PaymentMethod.BOLETO) {
      navigate('/payment/boleto', { state: { selectedOption, inscricao, proprietario, areaTotal } });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-10 flex flex-col gap-10 pb-32 md:pb-10">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-bold text-institutional-blue">Forma de Pagamento</h2>
        <p className="text-on-surface-variant font-medium">Escolha como deseja realizar o pagamento da sua guia:</p>
      </div>

      <div className="flex flex-col gap-4">
        {METHODS.map((method, index) => (
          <motion.label 
            key={method.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedMethod(method.id)}
            className={cn(
              "relative flex items-center gap-6 p-6 bg-white border rounded-2xl cursor-pointer transition-all hover:shadow-md grow group",
              selectedMethod === method.id 
                ? "border-institutional-blue ring-2 ring-institutional-blue/5 shadow-sm" 
                : "border-outline-variant hover:border-institutional-blue"
            )}
          >
            <input 
              type="radio" 
              name="payment_method" 
              className="sr-only" 
              checked={selectedMethod === method.id}
              readOnly
            />
            
            <div className="flex items-center h-full">
              {selectedMethod === method.id ? (
                <CheckCircle2 className="w-6 h-6 text-institutional-blue" />
              ) : (
                <Circle className="w-6 h-6 text-outline-variant" />
              )}
            </div>

            <div className={cn(
              "flex-shrink-0 p-4 rounded-2xl transition-colors",
              selectedMethod === method.id ? "bg-institutional-blue text-white" : "bg-surface-variant text-on-surface-variant group-hover:bg-institutional-blue group-hover:text-white"
            )}>
              <method.icon className="w-8 h-8" />
            </div>

            <div className="flex flex-col flex-grow gap-1">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-on-surface">{method.title}</span>
                {method.recommended && (
                  <span className="bg-success-green/10 text-success-green font-bold text-[10px] uppercase px-2 py-0.5 rounded-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Recomendado
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-on-surface-variant leading-relaxed">{method.description}</span>
            </div>
          </motion.label>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-surface-variant flex justify-end">
        <button 
          disabled={!selectedMethod}
          onClick={handleContinue}
          className={cn(
            "w-full md:w-auto h-14 px-12 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 font-bold",
            selectedMethod 
              ? "bg-institutional-blue text-white hover:bg-primary shadow-institutional-blue/20 active:scale-95" 
              : "bg-surface-gray text-on-surface-variant cursor-not-allowed opacity-50"
          )}
        >
          Continuar
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
