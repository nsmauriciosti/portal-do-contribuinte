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

-- Tabela para guardar os acordos gerados e reparcelamentos
CREATE TABLE IF NOT EXISTS portal_contribuintes.acordos (
    id SERIAL PRIMARY KEY,
    nome TEXT,
    inscricao TEXT,
    opcao TEXT,
    valor NUMERIC,
    data TEXT,
    status TEXT,
    installments INTEGER,
    paidInstallments INTEGER,
    phone TEXT
);

-- Concede permissões de uso do schema para a API (PostgREST)
GRANT USAGE ON SCHEMA portal_contribuintes TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA portal_contribuintes TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA portal_contribuintes TO anon, authenticated;

-- Habilita a Segurança em Nível de Linha (Row Level Security)
ALTER TABLE portal_contribuintes.imoveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_contribuintes.acordos ENABLE ROW LEVEL SECURITY;

-- Permite que usuários anônimos e do portal leiam os dados
DROP POLICY IF EXISTS "Permitir leitura publica" ON portal_contribuintes.imoveis;
CREATE POLICY "Permitir leitura publica" 
ON portal_contribuintes.imoveis 
FOR SELECT 
USING (true);

-- Permite que o nosso script de migração insira os dados do XML
DROP POLICY IF EXISTS "Permitir inserção publica" ON portal_contribuintes.imoveis;
CREATE POLICY "Permitir inserção publica" 
ON portal_contribuintes.imoveis 
FOR INSERT 
WITH CHECK (true);

-- Politicas para ACORDOS (Leitura, Inserção e Atualização)
DROP POLICY IF EXISTS "Permitir leitura publica acordos" ON portal_contribuintes.acordos;
CREATE POLICY "Permitir leitura publica acordos" ON portal_contribuintes.acordos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir insercao publica acordos" ON portal_contribuintes.acordos;
CREATE POLICY "Permitir insercao publica acordos" ON portal_contribuintes.acordos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualizacao publica acordos" ON portal_contribuintes.acordos;
CREATE POLICY "Permitir atualizacao publica acordos" ON portal_contribuintes.acordos FOR UPDATE USING (true);
