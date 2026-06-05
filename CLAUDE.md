# Formulário de Pré-Admissão – BRASAS DP

## O que é este projeto

Web app em Google Apps Script para coleta de dados e documentos de novos funcionários em processo admissional. O funcionário preenche o formulário online e, ao enviar, o sistema cria automaticamente uma pasta no Google Drive com os documentos e gera um PDF com os dados preenchidos.

O acesso ao formulário é controlado por **token único por URL**: o DP gera um link personalizado para cada candidato numa planilha Google Sheets. O link é invalidado após o uso.

---

## Arquivos

| Arquivo | Descrição |
|---|---|
| `Code.gs` | Script servidor (Google Apps Script). Roteamento, validação de token, processamento do formulário, criação de pasta/PDF no Drive. |
| `Index.html` | Formulário HTML completo com CSS e JavaScript embutidos. Servido como Web App via `HtmlService`. |
| `Admin.html` | Painel do DP: geração de links avulsos, lista de tokens, solicitações dos diretores e formulários recebidos. Usa sintaxe de template GAS (`<?= ?>`). |
| `Diretor.html` | Formulário preenchido pelo diretor para solicitar admissão de um candidato. |

---

## Como publicar no Google Apps Script

1. Acesse [script.google.com](https://script.google.com) e crie um novo projeto
2. Cole o conteúdo de `Code.gs` no arquivo `Code.gs` do editor
3. Crie um arquivo HTML chamado `Index` (sem extensão) e cole o conteúdo de `Index.html`
4. Crie um arquivo HTML chamado `Admin` e cole o conteúdo de `Admin.html`
5. Clique em **Implantar → Nova implantação**
   - Tipo: **Aplicativo da Web**
   - Executar como: **Eu (adriane@brasas.com)**
   - Quem tem acesso: **Qualquer pessoa**
6. Copie a URL gerada

---

## Setup inicial (após implantar)

No editor GAS, selecione a função `inicializar` e clique **▶ Executar**.

Isso irá:
- Criar automaticamente a planilha **"BRASAS – Controle de Acesso Admissão"** no Google Drive
- Configurar a fórmula automática de geração de links na planilha
- Logar no console a URL da planilha e do formulário

---

## Pasta de destino no Drive

Os formulários enviados criam subpastas em:
`https://drive.google.com/drive/folders/1IuU9YLh4kiXg1p-xgNiZruUL9ddnD345`

**Estrutura de pastas:**
```
Pasta pai/
  BOTAFOGO/              ← pasta da unidade (maiúsculo, criada automaticamente se não existir)
    JOÃO SILVA/          ← pasta do funcionário (maiúsculo)
      FORMULARIO PRE-ADMISSAO - JOÃO SILVA.pdf
      RG_documento.JPG
      CPF_documento.PDF
      ...
```

---

## Acesso ao painel do DP (`?dp=1`)

O painel do DP é protegido por autenticação via **Hub BRASAS Analytics**. O fluxo é:

1. Usuário acessa `WEBAPP_URL?dp=1` → vê tela com botão "Entrar com conta BRASAS"
2. Clica → redirecionado ao Hub com `?next=WEBAPP_URL?dp=1`
3. Hub autentica via Google OAuth → cria sessão na aba **SESSOES** da planilha de usuários → redireciona de volta com `?dp=1&session=TOKEN`
4. `Admin.html` valida o token via `validarSessaoHub(token)` (aba SESSOES, verifica validade e role)
5. Roles autorizadas: **`admin`** e **`dp`** (configuradas na planilha `SHEET_USUARIOS_ID`)

### Planilha de usuários
`https://docs.google.com/spreadsheets/d/1eZPbzhzjhjHoPwMhAW5YvOZgYiAvlTYc07dRan6Lyoc`

Aba **USUARIOS** — colunas relevantes: `EMAIL`, `NOME`, `ROLE`, `ATIVO`

### Alteração necessária no Hub
O `doGet` do Hub precisa aceitar o parâmetro `?next=URL`. Ao receber esse parâmetro com usuário autenticado, deve criar a sessão e redirecionar para `next_url?session=TOKEN`. Ver código no histórico da conversa.

---

## Fluxo de controle de acesso (token)

### Planilha do DP
O DP acessa a planilha criada por `inicializar()` e preenche uma linha por candidato:

| ID / Token | Candidato | Unidade | Link para enviar | Usado | Usado em |
|---|---|---|---|---|---|
| `JOAO001` | João Silva | Botafogo | *(gerado automático)* | FALSE | |

- **ID / Token**: qualquer código que o DP quiser (ex: `JOAO001`, `2025001`)
- **Unidade**: dropdown com as 29 unidades
- **Link**: gerado automaticamente ao digitar o ID
- **Usado / Usado em**: marcados automaticamente após o envio

### Fluxo do candidato
1. Recebe o link por e-mail ou WhatsApp
2. Abre → formulário com unidade pré-preenchida e travada
3. Preenche e envia
4. Link é invalidado; pasta criada no Drive

### Telas de erro
- Sem token → "Acesso inválido. Solicite um link ao DP."
- Token já usado → "Este link já foi utilizado. Entre em contato com dp@brasas.com."
- Token inválido → "Link inválido. Entre em contato com dp@brasas.com."

---

## Campos do formulário

### Dados Pessoais
- E-mail, Nome Completo, CPF (com validação), Data de Nascimento, Telefone

### Unidade
- Dropdown com 29 unidades. Pré-preenchido e travado pelo token. O sistema registra a razão social correspondente.

### Dados Bancários
- Possui conta no Itaú? (Sim/Não)

### Vale Transporte
- Necessita de Vale Transporte? (Sim/Não)
- Se Sim: Bilhete Único/JAÉ, CEP (com busca automática via ViaCEP), Rua e número, Bairro, Modal de transporte, Quantidade de conduções por dia

### Documentos (upload)
14 documentos com upload múltiplo e pré-visualização individual. Alguns obrigatórios, outros opcionais:
- Foto 3×4, Atestado Médico Admissional, Carteira de Identidade, CPF, Título de Eleitor
- PIS/PASEP (arquivo ou número), Certificado de Reservista (arquivo ou número, opcional)
- Declaração de Escolaridade, Certidão de Casamento (opcional), Carteira de Trabalho
- Certidão de Nascimento dos filhos < 14 anos (opcional), Cartão de Vacinação < 7 anos (opcional)
- Comprovante Escolar 7–14 anos (opcional), Comprovante de Residência

---

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

---

## Pendências

- [ ] **Aplicar alteração no Hub** — modificar `doGet` do Hub BRASAS Analytics para suportar `?next=URL` e redirecionar com o token de sessão após autenticação
- [ ] **Reimplantar ambos os projetos** no GAS após as alterações
- [ ] **Envio de e-mail automático** ao diretor da unidade e ao DP (`dp@brasas.com`) após envio do formulário
- [ ] **Lista de e-mails dos diretores por unidade** (aguardando fornecimento)

## Decisões de UX registradas

- Status das solicitações renomeado de "Link enviado" → **"Link gerado"** (o link não é enviado automaticamente, precisa ser copiado e enviado pelo DP)
- Botões de atualizar individuais por seção removidos → **único botão "↻ Atualizar" no canto superior direito** do header do painel DP
