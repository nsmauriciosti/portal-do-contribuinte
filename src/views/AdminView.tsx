import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  Settings, 
  QrCode, 
  CheckCircle2, 
  AlertCircle,
  Home,
  Clock,
  Search,
  Filter
} from 'lucide-react';



export default function AdminView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'agreements' | 'whatsapp'>('whatsapp');
  const [waStatus, setWaStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [agreements, setAgreements] = useState<any[]>([]);

  // Configurações da API Baileys
  const [apiUrl, setApiUrl] = useState('http://localhost:3333');
  const [apiKey, setApiKey] = useState('••••••••••••••••');
  const [instanceName, setInstanceName] = useState('prefeitura_nova_serrana');

  // Templates de Mensagem
  const [templateReminder, setTemplateReminder] = useState('Olá *{{nome}}*, lembramos que a parcela *{{parcela}}* do seu acordo de IPTU 2026 vencerá em *{{data_vencimento}}* no valor de *R$ {{valor}}*. Acesse o portal para visualizar seu carnê.');
  const [templateDueToday, setTemplateDueToday] = useState('Atenção *{{nome}}*, sua parcela *{{parcela}}* vence HOJE (*{{data_vencimento}}*). O valor atualizado é de *R$ {{valor}}*. Evite a cobrança de multas e juros mantendo o pagamento em dia.');
  const [templatePaid, setTemplatePaid] = useState('Olá *{{nome}}*! Recebemos a confirmação de pagamento da sua parcela *{{parcela}}*. Agradecemos por contribuir com o município!');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('portal_agreements') || '[]');
    setAgreements(stored.length > 0 ? stored : [
      { id: 1, name: 'João da Silva Pereira', inscricao: '01.02.003.0045.001', option: 'Parcelamento (3x)', value: 850.00, date: '15/05/2026', status: 'Aguardando Pagamento', phone: '37999999999' },
      { id: 2, name: 'Maria Souza Ramos', inscricao: '01.04.010.0022.001', option: 'Cota Única (1x)', value: 1200.00, date: '14/05/2026', status: 'Pago', phone: '37988888888' }
    ]);
  }, []);

  const handleConnect = () => {
    setWaStatus('connecting');
    setTimeout(() => {
      setWaStatus('connected');
    }, 3000);
  };

  const messagesQueue = agreements.flatMap(agr => {
    if (!agr.installments || agr.installments <= 1) return [];
    
    return Array.from({ length: agr.installments }).map((_, i) => {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);
      const sendDate = new Date(dueDate);
      sendDate.setDate(sendDate.getDate() - 3); // 3 days before

      return {
        id: `${agr.id}-${i}`,
        name: agr.name,
        parcel: `${i + 1}/${agr.installments}`,
        dueDate: dueDate.toLocaleDateString('pt-BR'),
        status: 'Na Fila',
        sendDate: sendDate.toLocaleDateString('pt-BR')
      };
    });
  });

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-surface-gray flex flex-col">
        <div className="p-6 border-b border-surface-gray">
          <h1 className="text-xl font-bold text-institutional-blue">Portal Admin</h1>
          <p className="text-xs font-bold text-on-surface-variant uppercase mt-1">Gestão de Tributos</p>
        </div>
        <div className="flex-1 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('agreements')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'agreements' ? 'bg-institutional-blue text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            <Users className="w-5 h-5" />
            Acordos
          </button>
          <button 
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'whatsapp' ? 'bg-success-green text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            <MessageSquare className="w-5 h-5" />
            WhatsApp Bot
          </button>
        </div>
        <div className="p-4 border-t border-surface-gray">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-low w-full transition-all"
          >
            <Home className="w-5 h-5" />
            Ir para o Portal
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-10 overflow-y-auto">
        {activeTab === 'agreements' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-on-surface">Acordos Realizados</h2>
                <p className="text-on-surface-variant font-medium mt-1">Acompanhe as renegociações feitas pelos contribuintes.</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-white border border-surface-gray rounded-xl flex items-center px-4 h-12 gap-2 shadow-sm">
                  <Search className="w-5 h-5 text-on-surface-variant" />
                  <input type="text" placeholder="Buscar contribuinte..." className="bg-transparent border-none outline-none text-sm font-medium w-48" />
                </div>
                <button className="bg-white border border-surface-gray rounded-xl h-12 px-4 flex items-center gap-2 shadow-sm hover:bg-surface-container-low transition-all">
                  <Filter className="w-5 h-5 text-on-surface-variant" />
                  <span className="font-bold text-sm text-on-surface">Filtrar</span>
                </button>
              </div>
            </div>

            <div className="bg-white border border-surface-gray rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-gray text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="p-4">Contribuinte</th>
                    <th className="p-4">Inscrição</th>
                    <th className="p-4">Opção</th>
                    <th className="p-4">Valor Total</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agreements.map(agr => (
                    <tr key={agr.id} className="border-b border-surface-gray/50 hover:bg-surface-container-low transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-on-surface">{agr.name}</div>
                        <div className="text-xs font-medium text-on-surface-variant">{agr.date}</div>
                      </td>
                      <td className="p-4 font-mono text-sm text-on-surface-variant">{agr.inscricao}</td>
                      <td className="p-4 font-bold text-institutional-blue">{agr.option}</td>
                      <td className="p-4 font-bold text-success-green">R$ {agr.value.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${agr.status === 'Pago' ? 'bg-success-green/10 text-success-green' : 'bg-terracotta/10 text-terracotta'}`}>
                          {agr.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'whatsapp' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-bold text-on-surface">WhatsApp Bot (API Externa)</h2>
              <p className="text-on-surface-variant font-medium mt-1">Integração com sua instância Baileys externa e gestão de disparos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Configurações da API */}
              <div className="bg-white border border-surface-gray rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-surface-gray pb-4">
                  <h3 className="font-bold text-on-surface flex items-center gap-2">
                    <Settings className="w-5 h-5 text-institutional-blue" />
                    Configurações do Servidor
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${waStatus === 'connected' ? 'bg-success-green/10 text-success-green' : 'bg-terracotta/10 text-terracotta'}`}>
                    {waStatus === 'connected' ? 'Servidor Conectado' : 'Desconectado'}
                  </span>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">URL do Endpoint (Servidor Baileys)</label>
                    <input 
                      type="text" 
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      className="bg-surface-container-low border border-outline-variant rounded-xl p-3 text-sm font-medium focus:border-institutional-blue outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Token de Autenticação (API Key)</label>
                    <input 
                      type="password" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="bg-surface-container-low border border-outline-variant rounded-xl p-3 text-sm font-medium focus:border-institutional-blue outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nome da Instância</label>
                    <input 
                      type="text" 
                      value={instanceName}
                      onChange={(e) => setInstanceName(e.target.value)}
                      className="bg-surface-container-low border border-outline-variant rounded-xl p-3 text-sm font-medium focus:border-institutional-blue outline-none transition-colors"
                    />
                  </div>
                  
                  <button 
                    onClick={handleConnect}
                    className="mt-2 w-full bg-institutional-blue text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Testar Conexão e Salvar
                  </button>
                </div>
              </div>

              {/* Templates de Mensagens */}
              <div className="bg-white border border-surface-gray rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-surface-gray pb-4">
                  <h3 className="font-bold text-on-surface flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-institutional-blue" />
                    Templates Automáticos
                  </h3>
                </div>

                <div className="flex flex-col gap-5 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-institutional-blue flex justify-between">
                      Lembrete Antecipado (3 dias)
                      <span className="text-[10px] text-on-surface-variant font-medium">Variáveis: {'{{nome}}, {{parcela}}, {{data_vencimento}}, {{valor}}'}</span>
                    </label>
                    <textarea 
                      rows={3}
                      value={templateReminder}
                      onChange={(e) => setTemplateReminder(e.target.value)}
                      className="bg-surface-container-low border border-outline-variant rounded-xl p-3 text-sm text-on-surface-variant focus:border-institutional-blue outline-none transition-colors resize-none leading-relaxed"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-terracotta flex justify-between">
                      Lembrete Dia do Vencimento
                    </label>
                    <textarea 
                      rows={3}
                      value={templateDueToday}
                      onChange={(e) => setTemplateDueToday(e.target.value)}
                      className="bg-surface-container-low border border-outline-variant rounded-xl p-3 text-sm text-on-surface-variant focus:border-institutional-blue outline-none transition-colors resize-none leading-relaxed"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-success-green flex justify-between">
                      Confirmação de Pagamento
                    </label>
                    <textarea 
                      rows={3}
                      value={templatePaid}
                      onChange={(e) => setTemplatePaid(e.target.value)}
                      className="bg-surface-container-low border border-outline-variant rounded-xl p-3 text-sm text-on-surface-variant focus:border-institutional-blue outline-none transition-colors resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Fila de Mensagens Card */}
              <div className="md:col-span-2 bg-white border border-surface-gray rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-surface-gray pb-4">
                  <h3 className="font-bold text-on-surface flex items-center gap-2">
                    <Clock className="w-5 h-5 text-institutional-blue" />
                    Fila de Disparos Automáticos
                  </h3>
                  <span className="bg-institutional-blue/10 text-institutional-blue text-xs font-bold px-3 py-1 rounded-full">
                    Avisando com 3 dias de antecedência
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {messagesQueue.length > 0 ? messagesQueue.map(msg => (
                    <div key={msg.id} className="bg-surface-container-low border border-surface-gray rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-on-surface">{msg.name}</span>
                        <span className="text-xs font-medium text-on-surface-variant">Parcela {msg.parcel} • Vence em: {msg.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex flex-col md:items-end">
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Disparo Programado</span>
                          <span className="text-sm font-bold text-institutional-blue">{msg.sendDate}</span>
                        </div>
                        <span className="bg-surface-gray text-on-surface-variant text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {msg.status}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center p-8 bg-surface-container-low rounded-xl border border-dashed border-surface-gray">
                      <p className="text-sm font-medium text-on-surface-variant">Nenhum disparo na fila. Realize um parcelamento no Portal para ver as mensagens sendo agendadas.</p>
                    </div>
                  )}
                  
                  <div className="mt-4 p-4 bg-institutional-blue/5 border border-institutional-blue/20 rounded-xl">
                    <p className="text-xs font-medium text-institutional-blue leading-relaxed">
                      <strong>Nota de Integração:</strong> Quando as datas agendadas chegarem, o sistema fará requisições POST automáticas para a API Baileys configurada acima (Endpoint: <code>{apiUrl}/message/sendText</code>), utilizando a Instância <code>{instanceName}</code> com o Header de autenticação. O conteúdo do POST injetará os valores reais das variáveis nos templates de texto configurados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
