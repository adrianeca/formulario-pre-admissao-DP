# Formulário de Pré-Admissão – BRASAS DP

## O que é este projeto

Web app em Google Apps Script para coleta de dados e documentos de novos funcionários em processo admissional. O funcionário preenche o formulário online e, ao enviar, o sistema cria automaticamente uma pasta no Google Drive com os documentos e gera um PDF com os dados preenchidos.

## Arquivos

| Arquivo | Descrição |
|---|---|
| `Code.gs` | Script servidor (Google Apps Script). Processa o formulário, cria a pasta no Drive e gera o PDF. |
| `Index.html` | Formulário HTML completo com CSS e JavaScript embutidos. Servido como Web App via `HtmlService`. |

## Como publicar no Google Apps Script

1. Acesse [script.google.com](https://script.google.com) e crie um novo projeto
2. Cole o conteúdo de `Code.gs` no arquivo `Code.gs` do editor
3. Crie um arquivo HTML chamado `Index` (sem extensão) e cole o conteúdo de `Index.html`
4. Clique em **Implantar → Nova implantação**
   - Tipo: **Aplicativo da Web**
   - Executar como: **Eu (adriane@brasas.com)**
   - Quem tem acesso: **Qualquer pessoa**
5. Copie a URL gerada e distribua para os candidatos

## Pasta de destino no Drive

Os formulários enviados criam subpastas em:
`https://drive.google.com/drive/folders/1IuU9YLh4kiXg1p-xgNiZruUL9ddnD345`

Nome da subpasta criada: `[Razão Social da Unidade] - [Nome do Funcionário]`  
Exemplo: `Kansas Assessoria Linguística Ltda - João Silva`

## Campos do formulário

### Dados Pessoais
- E-mail, Nome Completo, CPF (com validação), Data de Nascimento, Telefone

### Unidade
- Dropdown com 29 unidades. O funcionário vê o nome da unidade (ex: Botafogo), mas o sistema registra a razão social correspondente (ex: Kansas Assessoria Linguística Ltda).

### Dados Bancários
- Possui conta no Itaú? (Sim/Não)

### Vale Transporte
- Necessita de Vale Transporte? (Sim/Não)
- Se Sim: Bilhete Único/JAÉ, CEP, Rua e número, Bairro, Modal de transporte, Quantidade de conduções por dia

### Documentos (upload)
14 documentos com upload individual. Alguns obrigatórios, outros opcionais (Se necessário):
- Foto 3×4, Atestado Médico Admissional, Carteira de Identidade, CPF, Título de Eleitor
- PIS/PASEP (arquivo ou número), Certificado de Reservista (arquivo ou número, opcional)
- Declaração de Escolaridade, Certidão de Casamento (opcional), Carteira de Trabalho
- Certidão de Nascimento dos filhos < 14 anos (opcional), Cartão de Vacinação < 7 anos (opcional)
- Comprovante Escolar 7–14 anos (opcional), Comprovante de Residência

## Equivalência de unidades (nome → razão social)

| Unidade | Razão Social |
|---|---|
| Botafogo | Kansas Assessoria Linguística Ltda |
| Cachambi | NS Assessoria Linguística Ltda |
| Campo Grande | CG Assessoria Linguística Ltda |
| Copacabana | The West School Of English Ltda |
| Caxias | Caxias Assessoria Linguística Ltda |
| Downtown | DT Assessoria Linguística Ltda |
| Editora | Editora Eficiencia Ltda |
| EC | Ec New Assessoria Linguística Ltda |
| Freguesia | FG Assessoria Linguística Ltda |
| Grajaú | GR Assessoria Linguística Ltda |
| Ilha do Governador | Cambaúba Assessoria Linguística Ltda |
| Ipanema | New Concepts Assessoria Linguística Ltda |
| Itaipu | IT Assessoria Linguística Ltda |
| Laranjeiras | LJ Assessoria Linguística Ltda |
| Méier | MRI Assessoria Linguística Ltda |
| Métodos | Métodos de Ensino Brasas Ltda |
| Niterói | NT Assessoria Linguística Ltda |
| Nova Iguaçu | NI Assessoria Linguística Ltda |
| Novo Leblon | Bal Barra Assessoria Linguística Ltda |
| Parque Olímpico | P.O Assessoria Linguística Ltda |
| Pechincha | PC Assessoria Linguística Ltda |
| Península | PN Assessoria Linguística Ltda |
| Recreio | RC Assessoria Linguística Ltda |
| Taquara | TQ Assessoria Linguística Ltda |
| Tijuca | TJ Assessoria Linguística Ltda |
| Vila da Penha | VP Assessoria Linguística Ltda |
| Vila Olímpia | BCSP Assessoria Linguística Ltda |
| Vila Valqueire | Lexicon Assessoria Linguística Ltda |
| BRASAS On Demand | BRASAS On Demand Assessoria Linguística Ltda |

## Pendências

- [ ] Adicionar envio de e-mail automático ao diretor da unidade e ao DP (dp@brasas.com) após envio do formulário
- [ ] Lista de e-mails dos diretores por unidade (aguardando)
