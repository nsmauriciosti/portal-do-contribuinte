import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Copy, Info, ArrowLeft, Timer, CheckCircle2, Receipt } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function PixPaymentView() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(899); // 14:59

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-10 flex flex-col items-center gap-10 pb-32">
      <div className="text-center flex flex-col gap-2 w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-institutional-blue">Pagamento via Pix</h1>
        <p className="text-on-surface-variant font-medium">Escaneie o QR Code abaixo ou copie o código para realizar o pagamento no aplicativo do seu banco.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white border border-surface-gray rounded-3xl p-8 flex flex-col items-center gap-8 shadow-sm relative"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Valor a Pagar</span>
          <span className="text-5xl font-bold text-institutional-blue">R$ 450,00</span>
        </div>

        <div className="flex items-center gap-2 bg-surface-container py-1.5 px-6 rounded-full border border-outline-variant">
          <Timer className="w-5 h-5 text-terracotta" />
          <span className="text-sm font-bold text-terracotta">Expira em {formatTime(timeLeft)}</span>
        </div>

        <div className="w-64 h-64 bg-surface-container-low border border-surface-gray rounded-2xl p-6 flex items-center justify-center relative group">
          <QrCode className="w-full h-full text-on-surface opacity-80" />
          
          <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-institutional-blue rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-institutional-blue rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-institutional-blue rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-institutional-blue rounded-br-lg" />
        </div>

        <div className="w-full flex flex-col gap-3">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pix Copia e Cola</label>
          <div className="flex flex-col gap-3 w-full">
            <div className="bg-surface-container-low border border-surface-gray rounded-xl px-5 py-4 overflow-hidden truncate">
              <span className="text-sm font-medium text-on-surface-variant select-all">00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3...</span>
            </div>
            <button className="w-full bg-institutional-blue text-white font-bold h-14 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-md">
              <Copy className="w-5 h-5" />
              Copiar Código
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-white border border-surface-gray rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-institutional-blue flex items-center gap-2 border-b border-surface-gray pb-3">
            <Info className="w-5 h-5" /> Como Pagar
          </h3>
          <ol className="flex flex-col gap-3 text-sm text-on-surface-variant font-medium">
            <li className="flex gap-3">
              <span className="text-institutional-blue font-bold">1.</span> Abra o aplicativo do seu banco.
            </li>
            <li className="flex gap-3">
              <span className="text-institutional-blue font-bold">2.</span> Selecione a opção <strong className="text-on-surface">Pix</strong>.
            </li>
            <li className="flex gap-3">
              <span className="text-institutional-blue font-bold">3.</span> Escolha <strong className="text-on-surface">Ler QR Code</strong> ou <strong className="text-on-surface">Copia e Cola</strong>.
            </li>
          </ol>
        </div>

        <div className="bg-white border border-surface-gray rounded-2xl p-6 flex flex-col gap-3">
          <h3 className="text-lg font-bold text-institutional-blue flex items-center gap-2 border-b border-surface-gray pb-3">
            <Receipt className="w-5 h-5" /> Detalhes
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Beneficiário', value: 'Pref. Nova Serrana' },
              { label: 'CNPJ', value: '18.242.081/0001-44' },
              { label: 'Vencimento', value: 'Hoje' },
            ].map((d) => (
              <div key={d.label} className="flex justify-between items-center py-1">
                <span className="text-xs font-bold text-on-surface-variant uppercase">{d.label}</span>
                <span className="text-sm font-bold text-on-surface">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate(-1)}
        className="w-full max-w-xs border-2 border-institutional-blue text-institutional-blue font-bold h-14 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        Cancelar e Voltar
      </button>
    </div>
  );
}
