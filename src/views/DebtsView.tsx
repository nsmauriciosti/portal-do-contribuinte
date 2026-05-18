import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Home, Receipt, ArrowRight, PersonStanding, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function DebtsView() {
  const navigate = useNavigate();
  const location = useLocation();
  const debtData = location.state?.debtData;

  if (!debtData) {
    return <Navigate to="/" replace />;
  }

  const inscricao = debtData['Inscricao_Imobiliaria'];
  const endereco = `${debtData['Tipo_Logradouro']} ${debtData['Nome_Logradouro']}, ${debtData['Numero_Predial']} ${debtData['Complemento'] ? '- ' + debtData['Complemento'] : ''} - ${debtData['Nome_Bairro']}`;
  const proprietario = debtData['Nome_Proprietario'];
  const areaTotal = debtData['Area_Total_Construida'] || 0;
  let rawValor = Number(debtData['Valor_IPTU_2026']);
  const valorTotal = !isNaN(rawValor) && rawValor > 0 ? rawValor : 1200.00;

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-10 flex flex-col gap-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-on-surface">Débitos Encontrados</h1>
        <p className="text-on-surface-variant text-lg">Confira os valores em aberto e escolha a melhor forma de regularização.</p>
      </motion.div>

      {/* Property Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-outline-variant rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between shadow-sm"
      >
        <div className="flex items-start gap-6 w-full">
          <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center shrink-0">
            <MapPin className="w-7 h-7 text-institutional-blue" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Imóvel Localizado - Inscrição: {inscricao}</span>
            <p className="text-xl font-bold text-on-surface">{endereco}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="py-1 px-3 bg-surface-container-low rounded-lg w-fit">
                <span className="text-xs font-bold text-on-surface-variant flex items-center gap-2">
                  Proprietário: <strong className="text-on-surface">{proprietario}</strong>
                </span>
              </div>
              <div className="py-1 px-3 bg-surface-container-low rounded-lg w-fit">
                <span className="text-xs font-bold text-on-surface-variant flex items-center gap-2">
                  Área Construída: <strong className="text-on-surface">{Number(areaTotal).toLocaleString('pt-BR')} m²</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Debt Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-outline-variant rounded-3xl p-8 flex flex-col gap-8 relative overflow-hidden group shadow-md"
      >
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-terracotta" />
        
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-sm bg-surface-container-high text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                Aguardando Pagamento
              </span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface flex items-center gap-3">
              <Receipt className="w-6 h-6 text-institutional-blue" />
              IPTU 2026 - Exercício Corrente
            </h2>
          </div>
        </div>

        <div className="h-px bg-surface-gray w-full" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-on-surface-variant">Valor Total Pendente</span>
            <span className="text-4xl font-bold text-institutional-blue">
              R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <button 
            onClick={() => navigate('/options', { state: { baseValue: valorTotal, inscricao, proprietario, areaTotal } })}
            className="w-full md:w-auto bg-institutional-blue text-white hover:bg-primary h-14 px-8 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-institutional-blue/10"
          >
            Escolher Opções de Pagamento
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
