import { Scissors } from 'lucide-react';

interface BoletoLayoutProps {
  proprietario: string;
  inscricao: string;
  areaTotal: number | string;
  valorFinal: number;
  vencimento?: string;
  isPrintVersion?: boolean;
  cosipValue?: number;
}

export default function BoletoLayout({
  proprietario,
  inscricao,
  areaTotal,
  valorFinal,
  vencimento = '15/04/2026',
  isPrintVersion = false,
  cosipValue = 0,
}: BoletoLayoutProps) {
  // Cota única has 25% discount, calculate base values
  const cosip = cosipValue || 0;
  const baseIPTUDescontado = valorFinal - cosip;
  const valorOriginalIPTU = baseIPTUDescontado / 0.75;
  const valorDescontoIPTU = valorOriginalIPTU * 0.25;
  const valorOriginal = valorOriginalIPTU + cosip;
  const valorDesconto = valorDescontoIPTU;

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Realistic Caixa Econômica Federal digit line
  const generateLinhaDigitavel = (valor: number) => {
    const v = Math.round(valor * 100).toString().padStart(10, '0');
    return `10490.12340  56789.012343  56789.012343  9  9689${v.padStart(10, '0')}`;
  };

  const linhaDigitavel = generateLinhaDigitavel(valorFinal);

  // Programmatic barcode generator (using stylized divs)
  const Barcode = () => (
    <div className="w-full flex items-end h-16 bg-white px-4 py-2 border border-neutral-300 rounded-sm">
      {Array.from({ length: 92 }).map((_, i) => {
        // Generate pseudo-random barcode widths for CAIXA code-128
        let w = 'w-[1px]';
        if (i % 7 === 0) w = 'w-[3px]';
        else if (i % 5 === 0) w = 'w-[4px]';
        else if (i % 3 === 0) w = 'w-[2px]';
        
        let space = '';
        if (i % 11 === 0) space = 'mr-[2px]';
        else if (i % 13 === 0) space = 'mr-[3px]';

        return (
          <div
            key={i}
            className={`h-full bg-black ${w} ${space} opacity-90`}
          />
        );
      })}
    </div>
  );

  return (
    <div className={`w-full max-w-[800px] mx-auto bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm font-sans ${isPrintVersion ? 'print:border-0 print:shadow-none print:p-0 print:mx-0 print:max-w-none' : ''}`}>
      {/* -------------------- RECIBO DO PAGADOR (TOP) -------------------- */}
      <div className="flex flex-col gap-3 pb-6 border-b border-dashed border-neutral-300 relative">
        <div className="flex justify-between items-center pb-2 border-b-2 border-neutral-800">
          <div className="flex items-center gap-3">
            {/* CAIXA Logo Representation */}
            <div className="flex items-center bg-[#005CA9] text-white font-bold px-3 py-1 rounded text-lg tracking-tight select-none">
              CAIXA
              <span className="text-[#F47920] ml-0.5 text-2xl leading-none font-black">.</span>
            </div>
            <div className="border-l-2 border-neutral-800 h-6 px-3 flex items-center font-bold text-lg text-neutral-800">
              104-0
            </div>
          </div>
          <span className="text-xs font-bold uppercase text-neutral-600 tracking-wider">
            Recibo do Pagador
          </span>
        </div>

        {/* Top Info Grid */}
        <div className="grid grid-cols-12 border border-neutral-800 text-[10px]">
          <div className="col-span-8 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Beneficiário</span>
            <span className="font-semibold text-neutral-800 text-xs">Município de Nova Serrana - CNPJ: 18.291.285/0001-98</span>
          </div>
          <div className="col-span-4 border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Vencimento</span>
            <span className="font-bold text-neutral-800 text-xs">{vencimento}</span>
          </div>

          <div className="col-span-8 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Endereço Beneficiário</span>
            <span className="text-neutral-700">Av. Governador Valadares, 1412 - Centro, Nova Serrana - MG</span>
          </div>
          <div className="col-span-4 border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Nosso Número</span>
            <span className="font-medium text-neutral-800">14/000000000012345-6</span>
          </div>

          <div className="col-span-3 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Data Documento</span>
            <span className="text-neutral-700">21/05/2026</span>
          </div>
          <div className="col-span-3 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Nº do Documento</span>
            <span className="text-neutral-700">{inscricao.replace(/\./g, '')}</span>
          </div>
          <div className="col-span-2 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Espécie Doc.</span>
            <span className="text-neutral-700">OU</span>
          </div>
          <div className="col-span-4 border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Valor do Documento</span>
            <span className="font-bold text-neutral-800 text-right block">R$ {formatCurrency(valorOriginal)}</span>
          </div>

          <div className="col-span-4 border-r border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">(-) Descontos / Abatimentos</span>
            <span className="text-neutral-800 font-medium block">R$ {formatCurrency(valorDesconto)}</span>
          </div>
          <div className="col-span-4 border-r border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">(+) Mora / Multa</span>
            <span className="text-neutral-700 block"></span>
          </div>
          <div className="col-span-4 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">(=) Valor Cobrado</span>
            <span className="font-bold text-success-green block text-right">R$ {formatCurrency(valorFinal)}</span>
          </div>
        </div>

        {/* Pagador Info */}
        <div className="border border-neutral-800 p-3 text-[10px] flex flex-col gap-1.5">
          <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Pagador</span>
          <div className="flex justify-between font-bold text-neutral-800">
            <span>{proprietario}</span>
            <span>Inscrição: {inscricao}</span>
          </div>
          <div className="text-neutral-600">
            <span>Imóvel com Área Total Construída de {Number(areaTotal).toLocaleString('pt-BR')} m²</span>
          </div>
        </div>

        <div className="text-[9px] text-neutral-400 text-right mt-1">
          Autenticação Mecânica - Ficha de Compensação
        </div>
      </div>

      {/* -------------------- LINHA DE CORTE (CUT LINE) -------------------- */}
      <div className="relative py-4 flex items-center justify-center select-none print:hidden">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dashed border-neutral-400"></div>
        </div>
        <div className="relative bg-white px-4 text-xs text-neutral-500 flex items-center gap-1.5 font-medium">
          <Scissors className="w-3.5 h-3.5 transform -rotate-90 text-neutral-400" />
          Corte aqui na linha pontilhada
        </div>
      </div>

      {/* -------------------- FICHA DE COMPENSAÇÃO (BOTTOM) -------------------- */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex justify-between items-end pb-2 border-b-2 border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#005CA9] text-white font-bold px-3 py-1 rounded text-lg tracking-tight select-none">
              CAIXA
              <span className="text-[#F47920] ml-0.5 text-2xl leading-none font-black">.</span>
            </div>
            <div className="border-l-2 border-neutral-800 h-6 px-3 flex items-center font-bold text-lg text-neutral-800">
              104-0
            </div>
          </div>
          <div className="font-mono text-sm md:text-[15px] font-bold text-neutral-800 tracking-wider">
            {linhaDigitavel}
          </div>
        </div>

        {/* Ficha de Compensação Grid */}
        <div className="grid grid-cols-12 border border-neutral-800 text-[10px]">
          {/* Linha 1 */}
          <div className="col-span-9 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Local de Pagamento</span>
            <span className="font-semibold text-neutral-700">PREFERENCIALMENTE NAS CASAS LOTÉRICAS E AGÊNCIAS DA CAIXA</span>
          </div>
          <div className="col-span-3 border-b border-neutral-800 p-1.5 bg-neutral-50">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Vencimento</span>
            <span className="font-bold text-neutral-800 text-xs block text-right">{vencimento}</span>
          </div>

          {/* Linha 2 */}
          <div className="col-span-9 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Beneficiário</span>
            <span className="font-semibold text-neutral-800">Município de Nova Serrana - CNPJ: 18.291.285/0001-98</span>
          </div>
          <div className="col-span-3 border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Agência / Código Beneficiário</span>
            <span className="font-medium text-neutral-800 block text-right">0123 / 456789-0</span>
          </div>

          {/* Linha 3 */}
          <div className="col-span-2 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Data do Doc.</span>
            <span className="text-neutral-700">21/05/2026</span>
          </div>
          <div className="col-span-3 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Nº do Documento</span>
            <span className="text-neutral-700">{inscricao.replace(/\./g, '')}</span>
          </div>
          <div className="col-span-1 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Espécie</span>
            <span className="text-neutral-700">OU</span>
          </div>
          <div className="col-span-1 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Aceite</span>
            <span className="text-neutral-700">N</span>
          </div>
          <div className="col-span-2 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Data Process.</span>
            <span className="text-neutral-700">21/05/2026</span>
          </div>
          <div className="col-span-3 border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Nosso Número</span>
            <span className="font-semibold text-neutral-800 block text-right">14/000000000012345-6</span>
          </div>

          {/* Linha 4 */}
          <div className="col-span-3 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Uso do Banco</span>
            <span className="text-neutral-700"></span>
          </div>
          <div className="col-span-2 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Carteira</span>
            <span className="text-neutral-700">14</span>
          </div>
          <div className="col-span-1 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Espécie Moeda</span>
            <span className="text-neutral-700">R$</span>
          </div>
          <div className="col-span-3 border-r border-b border-neutral-800 p-1.5">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Quantidade</span>
            <span className="text-neutral-700"></span>
          </div>
          <div className="col-span-3 border-b border-neutral-800 p-1.5 bg-neutral-50">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">(=) Valor do Documento</span>
            <span className="font-bold text-neutral-800 text-xs block text-right">R$ {formatCurrency(valorOriginal)}</span>
          </div>

          {/* Linha 5 (Split Left & Right) */}
          <div className="col-span-9 border-r border-neutral-800 p-2 flex flex-col gap-1.5 min-h-[140px]">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Instruções (Texto de responsabilidade do beneficiário)</span>
            <div className="font-semibold text-neutral-800 flex flex-col gap-1 text-[9px] uppercase leading-normal">
              <span>• PAGAMENTO EM COTA ÚNICA REFERENTE AO IPTU 2026</span>
              {cosip > 0 && (
                <span>• INCLUSA TAXA DE ILUMINAÇÃO PÚBLICA (COSIP) INTEGRAL DE R$ {formatCurrency(cosip)} (SEM DESCONTO)</span>
              )}
              <span>• DESCONTO DE 25% JÁ APLICADO NO VALOR DESTE BOLETO</span>
              <span>• NÃO RECEBER APÓS A DATA DE VENCIMENTO EM {vencimento}</span>
              <span>• EM CASO DE DÚVIDAS, ACESSE O CHAT DO PORTAL DO CONTRIBUINTE</span>
              <span className="text-[8px] font-bold text-neutral-500 mt-2">INSCRIÇÃO IMOBILIÁRIA: {inscricao} | CONTRIBUINTE: {proprietario}</span>
            </div>
          </div>
          <div className="col-span-3 flex flex-col justify-between">
            <div className="border-b border-neutral-800 p-1.5 bg-neutral-50 flex-1 flex flex-col justify-center">
              <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">(-) Desconto / Abatimento</span>
              <span className="text-neutral-800 font-medium block text-right">R$ {formatCurrency(valorDesconto)}</span>
            </div>
            <div className="border-b border-neutral-800 p-1.5 flex-1 flex flex-col justify-center">
              <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">(-) Outras Deduções</span>
              <span className="text-neutral-700 block text-right"></span>
            </div>
            <div className="border-b border-neutral-800 p-1.5 flex-1 flex flex-col justify-center">
              <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">(+) Mora / Multa / Juros</span>
              <span className="text-neutral-700 block text-right"></span>
            </div>
            <div className="p-1.5 bg-neutral-50 flex-1 flex flex-col justify-center">
              <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">(=) Valor Cobrado</span>
              <span className="font-bold text-success-green text-xs block text-right">R$ {formatCurrency(valorFinal)}</span>
            </div>
          </div>

          {/* Linha 6 */}
          <div className="col-span-12 border-t border-neutral-800 p-2 flex flex-col gap-1">
            <span className="block font-bold text-neutral-500 uppercase tracking-tight text-[8px]">Pagador</span>
            <div className="font-bold text-neutral-800 text-xs">
              {proprietario}
            </div>
            <div className="text-neutral-600 font-medium">
              <span>Nova Serrana, MG - Inscrição: {inscricao}</span>
            </div>
          </div>
        </div>

        {/* Barcode representation at the base of the Ficha */}
        <div className="flex flex-col gap-1.5 mt-3">
          <Barcode />
          <div className="flex justify-between items-center text-[8px] text-neutral-400 font-mono px-2">
            <span>Ficha de Compensação</span>
            <span>Autenticação Mecânica</span>
          </div>
        </div>
      </div>
    </div>
  );
}
