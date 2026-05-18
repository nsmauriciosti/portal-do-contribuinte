-- Execute este código no "SQL Editor" do seu painel do Supabase

-- Remove a tabela antiga que foi criada por engano no schema public
DROP TABLE IF EXISTS public.portal_contribuinte;

-- Cria o schema separado
CREATE SCHEMA IF NOT EXISTS portal_contribuintes;

-- Cria a tabela dentro do novo schema
CREATE TABLE IF NOT EXISTS portal_contribuintes.imoveis (
    id SERIAL PRIMARY KEY,
    inscricao_imobiliaria TEXT,
    tipo_logradouro TEXT,
    nome_logradouro TEXT,
    numero_predial TEXT,
    complemento TEXT,
    codigo_bairro TEXT,
    nome_bairro TEXT,
    numero_cadastro_contribuinte TEXT,
    cpf_cnpj_proprietario TEXT,
    nome_proprietario TEXT,
    area_total_construida NUMERIC,
    tipo_imovel TEXT,
    valor_iptu_2026 NUMERIC
);

-- Concede permissões de uso do schema para a API (PostgREST)
GRANT USAGE ON SCHEMA portal_contribuintes TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA portal_contribuintes TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA portal_contribuintes TO anon, authenticated;

-- Habilita a Segurança em Nível de Linha (Row Level Security)
ALTER TABLE portal_contribuintes.imoveis ENABLE ROW LEVEL SECURITY;

-- Permite que usuários anônimos e do portal leiam os dados
CREATE POLICY "Permitir leitura publica" 
ON portal_contribuintes.imoveis 
FOR SELECT 
USING (true);

-- Permite que o nosso script de migração insira os dados do XML
CREATE POLICY "Permitir inserção publica" 
ON portal_contribuintes.imoveis 
FOR INSERT 
WITH CHECK (true);
