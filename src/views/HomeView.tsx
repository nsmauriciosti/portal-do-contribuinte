import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Search, Info, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { supabase } from '@/src/lib/supabase';

export default function HomeView() {
  const [method, setMethod] = useState<'doc' | 'insc'>('doc');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [multiResults, setMultiResults] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleMethodChange = (newMethod: 'doc' | 'insc') => {
    setMethod(newMethod);
    setValue('');
  };

  const handleValueChange = (raw: string) => {
    let v = raw.replace(/\D/g, "");
    if (method === 'doc') {
      if (v.length <= 11) {
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      } else {
        v = v.substring(0, 14);
        v = v.replace(/^(\d{2})(\d)/, "$1.$2");
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        v = v.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4");
        v = v.replace(/(\d{4})(\d)/, "$1-$2");
      }
    } else {
      v = v.substring(0, 14);
      v = v.replace(/^(\d{2})(\d)/, "$1.$2");
      v = v.replace(/^(\d{2})\.(\d{2})(\d)/, "$1.$2.$3");
      v = v.replace(/^(\d{2})\.(\d{2})\.(\d{3})(\d)/, "$1.$2.$3.$4");
      v = v.replace(/^(\d{2})\.(\d{2})\.(\d{3})\.(\d{4})(\d)/, "$1.$2.$3.$4.$5");
    }
    setValue(v);
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    const query = value.trim().replace(/[^\w\d]/g, '');
    
    if (query) {
      setLoading(true);
      
      let req = supabase.from('imoveis').select('*');
      
      if (method === 'doc') {
        req = req.eq('cpf_cnpj_proprietario', query);
      } else {
        req = req.eq('inscricao_imobiliaria', query);
      }

      const { data, error } = await req;
      
      setLoading(false);

      if (error) {
        alert('Erro ao comunicar com o servidor. Tente novamente mais tarde.');
        return;
      }

      if (data && data.length > 0) {
        if (data.length === 1) {
          // Apenas um imóvel, vai direto (passando como array de 1 item)
          navigate('/debts', { state: { debtData: [mapSupabaseToInternal(data[0])] } });
        } else {
          // Vários imóveis, mostra modal
          setMultiResults(data);
          // Seleciona todos por padrão
          setSelectedIds(data.map(d => d.id));
        }
      } else {
        alert('Nenhum débito encontrado para o documento/inscrição informado.');
      }
    }
  };

  // Mapeia colunas do Supabase para o formato que a aplicação já usa
  const mapSupabaseToInternal = (dbRow: any) => ({
    Inscricao_Imobiliaria: dbRow.inscricao_imobiliaria,
    Tipo_Logradouro: dbRow.tipo_logradouro,
    Nome_Logradouro: dbRow.nome_logradouro,
    Numero_Predial: dbRow.numero_predial,
    Complemento: dbRow.complemento,
    Codigo_Bairro: dbRow.codigo_bairro,
    Nome_Bairro: dbRow.nome_bairro,
    Numero_Cadastro_Contribuinte: dbRow.numero_cadastro_contribuinte,
    CPF_CNPJ_Proprietario: dbRow.cpf_cnpj_proprietario,
    Nome_Proprietario: dbRow.nome_proprietario,
    Area_Total_Construida: dbRow.area_total_construida,
    Tipo_Imovel: dbRow.tipo_imovel,
    Valor_IPTU_2026: dbRow.valor_iptu_2026
  });

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-10 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-[-1] opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at center, #1F295E 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white border border-surface-gray rounded-3xl shadow-sm overflow-hidden"
      >
        <div className="p-8 flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center">
              <Landmark className="w-10 h-10 text-institutional-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-on-surface">Portal do Contribuinte</h1>
              <p className="text-on-surface-variant text-sm mt-1">Acesse para consultar seus débitos de IPTU 2026</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="flex flex-col gap-6">
            {/* Toggle */}
            <div className="flex bg-surface-container p-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleMethodChange('doc')}
                className={cn(
                  "flex-1 py-3 text-sm font-bold rounded-lg transition-all",
                  method === 'doc' ? "bg-white shadow-sm text-on-surface" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                CPF/CNPJ
              </button>
              <button
                type="button"
                onClick={() => handleMethodChange('insc')}
                className={cn(
                  "flex-1 py-3 text-sm font-bold rounded-lg transition-all",
                  method === 'insc' ? "bg-white shadow-sm text-on-surface" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                Inscrição Imobiliária
              </button>
            </div>

            {/* Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Fingerprint className="w-5 h-5 text-outline" />
              </div>
              <input
                type="text"
                value={value}
                onChange={(e) => handleValueChange(e.target.value)}
                placeholder={method === 'doc' ? "000.000.000-00" : "01.02.003..."}
                className="w-full h-14 pl-12 pr-4 bg-surface-container-low border border-surface-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-institutional-blue transition-all"
              />
            </div>

            {/* Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-institutional-blue text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Consultando...' : 'Consultar Débitos'}
            </button>
          </form>

          {/* Info Note */}
          <div className="p-4 bg-surface-container-low border border-surface-gray rounded-2xl flex gap-3">
            <Info className="w-5 h-5 text-institutional-blue shrink-0 mt-0.5" />
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Mantenha seus dados atualizados para garantir o recebimento das guias. O não pagamento pode acarretar em juros e multas.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="bg-surface-container p-4 flex justify-center gap-4 text-xs font-bold text-institutional-blue border-t border-surface-gray">
          <a href="#" className="hover:underline">Ajuda</a>
          <span className="w-1 h-1 rounded-full bg-surface-gray mt-1.5" />
          <a href="#" className="hover:underline">Suporte</a>
        </div>
      </motion.div>

      {/* Modal de Seleção (Múltiplas Inscrições) */}
      <AnimatePresence>
        {multiResults.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-xl flex flex-col gap-6 max-h-[85vh]"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-institutional-blue">Múltiplos Imóveis Encontrados</h3>
                <p className="text-sm text-on-surface-variant font-medium">Selecione para quais inscrições deseja gerar as guias de pagamento conjuntas:</p>
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 custom-scrollbar">
                {multiResults.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (selectedIds.includes(item.id)) {
                        setSelectedIds(selectedIds.filter(id => id !== item.id));
                      } else {
                        setSelectedIds([...selectedIds, item.id]);
                      }
                    }}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4",
                      selectedIds.includes(item.id) 
                        ? "border-institutional-blue bg-institutional-blue/5" 
                        : "border-surface-gray hover:border-institutional-blue hover:bg-surface-container-low"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded flex items-center justify-center shrink-0 border mt-1",
                      selectedIds.includes(item.id) ? "bg-institutional-blue border-institutional-blue text-white" : "border-outline bg-white"
                    )}>
                      {selectedIds.includes(item.id) && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-institutional-blue uppercase tracking-widest bg-institutional-blue/10 px-2 py-0.5 rounded w-fit mb-1">
                        Inscrição: {item.inscricao_imobiliaria}
                      </span>
                      <span className={cn(
                        "text-sm font-bold transition-colors",
                        selectedIds.includes(item.id) ? "text-institutional-blue" : "text-on-surface"
                      )}>
                        {item.tipo_logradouro} {item.nome_logradouro}, {item.numero_predial} {item.complemento ? `- ${item.complemento}` : ''}
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        Bairro: {item.nome_bairro}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    const selectedData = multiResults.filter(item => selectedIds.includes(item.id)).map(mapSupabaseToInternal);
                    if (selectedData.length > 0) {
                      navigate('/debts', { state: { debtData: selectedData } });
                    } else {
                      alert('Selecione pelo menos um imóvel.');
                    }
                  }}
                  disabled={selectedIds.length === 0}
                  className="w-full h-14 bg-institutional-blue text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  Continuar com {selectedIds.length} Imóvel(is)
                </button>
                <button
                  onClick={() => setMultiResults([])}
                  className="w-full h-12 border border-surface-gray font-bold text-on-surface-variant rounded-xl hover:bg-surface-container transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
