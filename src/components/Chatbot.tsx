import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{id: string, text: string, sender: 'bot' | 'user'}[]>([
    { id: '1', text: 'Olá! Sou o assistente virtual da Prefeitura. Como posso ajudar você hoje?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim()) return;
    
    const userMsg = { id: Date.now().toString(), text: textToSend, sender: 'user' as const };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Mock bot logic
    setTimeout(() => {
      let botResponse = 'Desculpe, não entendi. Você pode tentar perguntar sobre isenção, atraso ou cota única.';
      const lower = userMsg.text.toLowerCase();
      
      if (lower.includes('isenção') || lower.includes('isento') || lower.includes('isençao')) {
        botResponse = 'Para solicitar a isenção do IPTU, você precisa ser aposentado(a), pensionista ou portador de doença grave. O requerimento é feito diretamente no setor de tributação.';
      } else if (lower.includes('atras') || lower.includes('venceu')) {
        botResponse = 'Para parcelas em atraso, juros e multas serão calculados automaticamente na geração de um novo boleto aqui pelo portal. Basta buscar sua inscrição novamente.';
      } else if (lower.includes('cota única') || lower.includes('desconto')) {
        botResponse = 'O pagamento em Cota Única garante um desconto especial na sua guia. Escolha essa opção na tela de pagamentos para visualizar o valor reduzido!';
      } else if (lower.includes('obrigad')) {
        botResponse = 'Por nada! Estou sempre à disposição.';
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: botResponse, sender: 'bot' }]);
    }, 1000);
  };

  const suggestions = ['Como funciona a isenção?', 'Atrasei minha parcela', 'Desconto da cota única'];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 md:bottom-8 right-4 md:right-8 w-14 h-14 bg-institutional-blue text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all z-50"
          >
            <MessageCircle className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 md:bottom-8 right-4 md:right-8 w-[90vw] md:w-[350px] h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-surface-gray"
          >
            {/* Header */}
            <div className="bg-institutional-blue p-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Assistente Virtual</span>
                  <span className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-success-green rounded-full"></span> Online
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-surface-bg flex flex-col gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-institutional-blue text-white rounded-tr-none' : 'bg-surface-container text-on-surface rounded-tl-none border border-surface-gray shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length < 3 && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto custom-scrollbar shrink-0">
                {suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(s)}
                    className="whitespace-nowrap text-xs bg-surface-container-high text-on-surface-variant font-medium px-3 py-1.5 rounded-full hover:bg-surface-gray transition-colors border border-surface-gray shrink-0"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-surface-gray flex gap-2 shrink-0">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua dúvida..."
                className="flex-1 bg-surface-container-low border border-outline-variant rounded-xl px-4 text-sm outline-none focus:border-institutional-blue transition-colors"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
                className="w-12 h-12 bg-institutional-blue text-white rounded-xl flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
