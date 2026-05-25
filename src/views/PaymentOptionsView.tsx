import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, ReceiptText, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { InstallmentOption } from '@/src/types';
import { supabase } from '@/src/lib/supabase';


export default function PaymentOptionsView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const baseValue = location.state?.baseValue;
  const cosipValue = location.state?.cosipValue || 0;
  const inscricao = location.state?.inscricao || '01.02.003.0045.001';
  const proprietario = location.state?.proprietario || 'João da Silva Pereira';
  const areaTotal = location.state?.areaTotal || '0,00';

  if (baseValue === undefined) {
    return <Navigate to="/" replace />;
  }

  const [brokenAgreement, setBrokenAgreement] = useState<any>(null);
  const [activeBaseValue, setActiveBaseValue] = useState(baseValue);
  const [activeAgreement, setActiveAgreement] = useState<any>(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const { data, error } = await supabase.from('acordos')
          .select('*')
          .eq('inscricao', inscricao);
          
        if (!error && data) {
          // Achar acordo ativo (não cancelado, não pago e com parcelas em aberto)
          const active = data.find((a: any) => 
            a.status !== 'Cancelado' && 
            a.status !== 'Pago' && 
            (a.paidinstallments || 0) < a.installments
          );
          
          if (active) {
            setActiveAgreement(active);
          } else {
            setActiveAgreement(null);
          }

          const agreement = data.find((a: any) => a.paidinstallments > 0 && a.paidinstallments < a.installments);
          if (agreement) {
            setBrokenAgreement(agreement);
            const valorPorParcela = agreement.valor / agreement.installments;
            const valorPago = valorPorParcela * agreement.paidinstallments;
            const saldoDevedor = baseValue - valorPago;
            setActiveBaseValue(saldoDevedor);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchAgreements();
  }, [inscricao, baseValue]);

  // Se houver acordo rompido, só permite o parcelamento em 7x do saldo devedor
  const OPTIONS: InstallmentOption[] = brokenAgreement ? [
    { id: '7', installments: 7, label: 'Reparcelamento Especial (7x)', discountLabel: 'SALDO DEVEDOR', totalAmount: activeBaseValue + cosipValue, installmentValue: (activeBaseValue + cosipValue) / 7 },
  ] : [
    { id: '1', installments: 1, label: 'Cota Única (1x)', discountLabel: '25% DE DESCONTO', totalAmount: activeBaseValue * 0.75 + cosipValue, installmentValue: activeBaseValue * 0.75 + cosipValue },
    { id: '2', installments: 2, label: 'Parcelado (2x)', discountLabel: '20% DE DESCONTO', totalAmount: activeBaseValue * 0.80 + cosipValue, installmentValue: (activeBaseValue * 0.80 + cosipValue) / 2 },
    { id: '3', installments: 3, label: 'Parcelado (3x)', discountLabel: '15% DE DESCONTO', totalAmount: activeBaseValue * 0.85 + cosipValue, installmentValue: (activeBaseValue * 0.85 + cosipValue) / 3 },
    { id: '4', installments: 4, label: 'Parcelado (4x)', discountLabel: '10% DE DESCONTO', totalAmount: activeBaseValue * 0.90 + cosipValue, installmentValue: (activeBaseValue * 0.90 + cosipValue) / 4 },
    { id: '7', installments: 7, label: 'Parcelado (7x)', discountLabel: 'SEM DESCONTO', totalAmount: activeBaseValue + cosipValue, installmentValue: (activeBaseValue + cosipValue) / 7 },
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

  const handleCancelAgreement = async () => {
    if (!activeAgreement) return;
    
    const confirmCancel = window.confirm("Deseja realmente cancelar este boleto ou parcelamento em aberto? Você poderá escolher uma nova opção de pagamento.");
    if (!confirmCancel) return;

    setCanceling(true);
    try {
      const { error } = await supabase.from('acordos')
        .update({ status: 'Cancelado' })
        .eq('id', activeAgreement.id);

      if (!error) {
        setActiveAgreement(null);
        if (brokenAgreement && brokenAgreement.id === activeAgreement.id) {
          setBrokenAgreement(null);
          setActiveBaseValue(baseValue);
        }
        alert("Boleto/Parcelamento anterior cancelado com sucesso. Agora você pode escolher uma nova opção.");
      } else {
        alert("Erro ao cancelar o acordo. Tente novamente mais tarde.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao se conectar ao servidor.");
    } finally {
      setCanceling(false);
    }
  };

  const handleViewAgreementPayment = () => {
    if (!activeAgreement) return;
    
    const reconstructedOption = {
      id: String(activeAgreement.installments),
      installments: activeAgreement.installments,
      label: activeAgreement.opcao,
      discountLabel: activeAgreement.installments === 1 ? '25% DE DESCONTO' : 'PARCELADO',
      totalAmount: Number(activeAgreement.valor),
      installmentValue: Number(activeAgreement.valor) / activeAgreement.installments
    };

    navigate('/method', { 
      state: { 
        selectedOption: reconstructedOption, 
        inscricao: activeAgreement.inscricao, 
        proprietario: activeAgreement.nome, 
        areaTotal: areaTotal,
        paidinstallments: activeAgreement.paidinstallments,
        isExisting: true
      } 
    });
  };

  const handleContinue = () => {
    const selectedOption = OPTIONS.find(o => o.id === selectedId);
    if (selectedOption) {
      navigate('/method', { state: { selectedOption, cosipValue, inscricao, proprietario, areaTotal } });
    }
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
        
        {activeAgreement ? (
          <div className="bg-white border border-outline-variant rounded-3xl p-8 flex flex-col gap-6 shadow-md relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-institutional-blue" />
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-institutional-blue/10 flex items-center justify-center shrink-0">
                <ReceiptText className="w-6 h-6 text-institutional-blue" />
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-on-surface">Boleto ou Parcelamento em Aberto</h2>
                <p className="text-on-surface-variant font-medium mt-1">
                  Identificamos que esta inscrição imobiliária já possui uma opção de pagamento gerada anteriormente.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface-container-low p-6 rounded-2xl border border-surface-gray">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Opção Selecionada</span>
                <span className="font-bold text-on-surface text-lg">{activeAgreement.opcao}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Valor Total</span>
                <span className="font-bold text-success-green text-lg">R$ {Number(activeAgreement.valor).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Data de Geração</span>
                <span className="font-bold text-on-surface text-lg">{activeAgreement.data}</span>
              </div>
              {activeAgreement.installments > 1 && (
                <div className="flex flex-col gap-1 md:col-span-3 border-t border-surface-gray pt-4 mt-2">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Progresso do Parcelamento</span>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex-grow bg-surface-gray h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-success-green h-full transition-all duration-500" 
                        style={{ width: `${(activeAgreement.paidinstallments / activeAgreement.installments) * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-sm text-on-surface shrink-0">
                      {activeAgreement.paidinstallments} de {activeAgreement.installments} parcelas pagas
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-end gap-4 border-t border-surface-gray pt-6 mt-2">
              {activeAgreement.paidinstallments === 0 ? (
                <>
                  <button
                    disabled={canceling}
                    onClick={handleCancelAgreement}
                    className="w-full md:w-auto h-12 px-6 rounded-xl font-bold border-2 border-terracotta text-terracotta hover:bg-terracotta/5 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {canceling ? 'Cancelando...' : 'Cancelar Acordo Anterior'}
                  </button>
                  <button
                    onClick={handleViewAgreementPayment}
                    className="w-full md:w-auto h-12 px-8 rounded-xl font-bold bg-institutional-blue text-white hover:bg-primary shadow-lg shadow-institutional-blue/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    Visualizar Guia / Pagar
                  </button>
                </>
              ) : (
                <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-terracotta font-medium text-sm">
                    <AlertTriangle className="w-5 h-5 text-terracotta shrink-0" />
                    Este parcelamento já possui parcelas pagas e não pode ser cancelado ou alterado.
                  </div>
                  <button
                    onClick={handleViewAgreementPayment}
                    className="w-full md:w-auto h-12 px-8 rounded-xl font-bold bg-institutional-blue text-white hover:bg-primary shadow-lg shadow-institutional-blue/20 transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
                  >
                    Visualizar Guias / Pagar
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {brokenAgreement && (
              <div className="bg-terracotta/10 border border-terracotta/30 rounded-2xl p-6 flex gap-4">
                <AlertTriangle className="w-6 h-6 text-terracotta shrink-0" />
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-terracotta">Acordo Anterior Incompleto Identificado</h3>
                  <p className="text-sm text-terracotta font-medium leading-relaxed">
                    Identificamos que você havia feito um acordo de <strong>{brokenAgreement.installments} parcelas</strong> e pagou <strong>{brokenAgreement.paidinstallments}</strong>. O seu saldo devedor atual foi recalculado para <strong>R$ {activeBaseValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong> (descontando o valor já pago). Conforme as regras do município, a única opção de reparcelamento disponível agora é em <strong>7 vezes</strong>.
                  </p>
                </div>
              </div>
            )}

            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-on-surface">Opções de Pagamento</h1>
              {!brokenAgreement && <p className="text-on-surface-variant text-lg mt-2">Escolha a melhor condição para você. Descontos aplicados automaticamente no valor das parcelas.</p>}
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
                        <span className="text-xs font-medium text-terracotta line-through mt-0.5">
                          De R$ {(baseValue + cosipValue).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                onClick={handleContinue}
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
          </>
        )}
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
