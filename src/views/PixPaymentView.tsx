import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Copy, Info, ArrowLeft, Timer, CheckCircle2, Receipt, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { generatePixPayload } from '@/src/lib/pix';

export default function PixPaymentView() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedOption = location.state?.selectedOption || { installmentValue: 1200.00 };
  const inscricao = location.state?.inscricao || '01.02.003.0045.001';
  const proprietario = location.state?.proprietario || 'João da Silva Pereira';
  const areaTotal = location.state?.areaTotal || 0;
  const amountToPay = selectedOption.installmentValue.toFixed(2);
  const pixPayload = generatePixPayload('18291385000159', 'Pref Nova Serrana', 'Nova Serrana', amountToPay);
  const [timeLeft, setTimeLeft] = useState(899); // 14:59
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      {selectedOption.installments && selectedOption.installments > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-surface-container-low border border-institutional-blue rounded-2xl p-6 flex items-start gap-4 shadow-sm"
        >
          <Info className="w-6 h-6 text-institutional-blue shrink-0 mt-0.5" />
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-institutional-blue text-lg">Pix Automático Ativado</h3>
            <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
              Você selecionou o parcelamento em <strong>{selectedOption.installments}x</strong>. Ao pagar o QR Code abaixo, você pagará a primeira parcela e registrará o <strong>Pix Automático</strong> no seu banco para que as próximas parcelas sejam debitadas automaticamente nas datas de vencimento, sem juros ou preocupações.
            </p>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white border border-surface-gray rounded-3xl p-8 flex flex-col items-center gap-8 shadow-sm relative"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Valor a Pagar</span>
          <span className="text-5xl font-bold text-institutional-blue">R$ {selectedOption.installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        <div className="flex items-center gap-2 bg-surface-container py-1.5 px-6 rounded-full border border-outline-variant">
          <Timer className="w-5 h-5 text-terracotta" />
          <span className="text-sm font-bold text-terracotta">Expira em {formatTime(timeLeft)}</span>
        </div>

        <div className="w-64 h-64 bg-surface-container-low border border-surface-gray rounded-2xl p-6 flex items-center justify-center relative group">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(pixPayload)}`} alt="QR Code PIX" className="w-full h-full object-contain mix-blend-multiply" />
          
          <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-institutional-blue rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-institutional-blue rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-institutional-blue rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-institutional-blue rounded-br-lg" />
        </div>

        <div className="w-full flex flex-col gap-3">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pix Copia e Cola</label>
          <div className="flex flex-col gap-3 w-full">
            <div className="bg-surface-container-low border border-surface-gray rounded-xl px-5 py-4 overflow-hidden truncate">
              <span className="text-sm font-medium text-on-surface-variant select-all break-all">{pixPayload}</span>
            </div>
            <button 
              onClick={handleCopy}
              className="w-full bg-institutional-blue text-white font-bold h-14 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-md"
            >
              {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Código Copiado!' : 'Copiar Código'}
            </button>
          </div>

          {/* Deep Links dos Bancos */}
          <div className="w-full pt-6 border-t border-surface-gray">
            <h4 className="text-sm font-bold text-on-surface text-center mb-4 flex items-center justify-center gap-2">
              <Smartphone className="w-4 h-4 text-institutional-blue" />
              Pagar direto no app do banco
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: 'Nubank', bg: 'bg-[#8A05BE]', text: 'text-white', scheme: 'nubank://' },
                { name: 'Itaú', bg: 'bg-[#EC7000]', text: 'text-white', scheme: 'itau://' },
                { name: 'Banco Inter', bg: 'bg-[#FF7A00]', text: 'text-white', scheme: 'bancointer://' },
                { name: 'Caixa', bg: 'bg-[#005CA9]', text: 'text-white', scheme: 'caixa://' },
                { name: 'Bradesco', bg: 'bg-[#CC092F]', text: 'text-white', scheme: 'bradesco://' },
                { name: 'Banco do Brasil', bg: 'bg-[#F9D300]', text: 'text-[#003da5]', scheme: 'bb://' },
              ].map(bank => (
                <button 
                  key={bank.name}
                  onClick={() => {
                    handleCopy();
                    // Pequeno atraso para garantir que a cópia funcionou antes de trocar de app
                    setTimeout(() => {
                      window.location.href = bank.scheme;
                    }, 400);
                  }}
                  className={`${bank.bg} ${bank.text} h-12 rounded-xl text-xs font-bold flex items-center justify-center shadow-sm hover:scale-[1.02] active:scale-95 transition-all px-2 text-center leading-tight ring-1 ring-black/5`}
                >
                  {bank.name}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-on-surface-variant text-center mt-4">
              O portal copiará a chave automaticamente e enviará você para o banco.
            </p>
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
              { label: 'Inscrição Imobiliária', value: inscricao },
              { label: 'Área Construída', value: `${Number(areaTotal).toLocaleString('pt-BR')} m²` },
              { label: 'Forma de Pagamento', value: selectedOption?.label || 'Cota Única' },
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
