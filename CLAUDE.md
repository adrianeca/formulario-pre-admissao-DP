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
| `Admin.html` | Painel do DP: geração de links avulsos, lista de tokens (com filtro e busca), solicitações dos diretores e formulários recebidos. Usa sintaxe de template GAS (`<?= ?>`). |
| `Diretor.html` | Formulário preenchido pelo diretor para solicitar admissão de um candidato. |

---

## Como publicar no Google Apps Script

1. Acesse [script.google.com](https://script.google.com) e crie um novo projeto
2. Cole o conteúdo de `Code.gs` no arquivo `Code.gs` do editor
3. Crie um arquivo HTML chamado `Index` (sem extensão) e cole o conteúdo de `Index.html`
4. Crie um arquivo HTML chamado `Admin` e cole o conteúdo de `Admin.html`
5. Crie um arquivo HTML chamado `Diretor` e cole o conteúdo de `Diretor.html`
6. Clique em **Implantar → Nova implantação**
   - Tipo: **Aplicativo da Web**
   - Executar como: **Eu (adriane@brasas.com)**
   - Quem tem acesso: **Qualquer pessoa**
7. Copie a URL gerada

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

A pasta da unidade é compartilhada automaticamente com o(s) diretor(es) da unidade ao ser criada (via `compartilharPastaComDiretor`).

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
O `doGet` do Hub precisa aceitar o parâmetro `?next=URL`. Ao receber esse parâmetro com usuário autenticado, deve criar a sessão e redirecionar para `next_url?session=TOKEN`. O código foi fornecido — falta aplicar e reimplantar o Hub.

---

## Fluxo de controle de acesso (token)

### Planilha do DP
O DP acessa a planilha criada por `inicializar()` e preenche uma linha por candidato:

| ID / Token | Candidato | Unidade | Link para enviar | Status | Atualizado em |
|---|---|---|---|---|---|
| `JOAO001` | João Silva | Botafogo | *(gerado automático)* | *(automático)* | |

- **ID / Token**: qualquer código que o DP quiser (ex: `JOAO001`, `2025001`)
- **Unidade**: dropdown com as 30 unidades
- **Link**: gerado automaticamente ao digitar o ID
- **Status / Atualizado em**: marcados automaticamente após o envio

### Fluxo do candidato
1. Recebe o link por e-mail ou WhatsApp
2. Abre → formulário com unidade pré-preenchida e travada
3. Preenche e envia os documentos
4. Se deixar documentos para depois: recebe e-mail com o mesmo link para completar
5. Link é invalidado quando todos os documentos forem enviados; pasta mantida no Drive

### Telas de erro
- Sem token → "Acesso inválido. Solicite um link ao DP."
- Token já usado → "Este link já foi utilizado. Entre em contato com dp@brasas.com."
- Token inválido → "Link inválido. Entre em contato com dp@brasas.com."

---

## Campos do formulário

### Dados Pessoais
- E-mail, Nome Completo, CPF (com validação), Data de Nascimento, Telefone

### Unidade
- Dropdown com 30 unidades. Pré-preenchido e travado pelo token. O sistema registra a razão social correspondente.

### Dados Bancários
- Possui conta no Itaú? (Sim/Não)

### Vale Transporte
- Necessita de Vale Transporte? (Sim/Não)
- Se Sim: Bilhete Único/JAÉ, CEP (com busca automática via ViaCEP), Rua e número, Bairro, Modal de transporte, Quantidade de conduções por dia

### Documentos (upload)
14 documentos com upload múltiplo, pré-visualização individual e **detecção automática de qualidade** (borrão, resolução mínima, tamanho máximo 10 MB). Alguns obrigatórios, outros opcionais:
- Foto 3×4, Atestado Médico Admissional, Carteira de Identidade, CPF, Título de Eleitor
- PIS/PASEP **(somente arquivo)**, Certificado de Reservista **(somente arquivo, opcional)**
- Declaração de Escolaridade, Certidão de Casamento (opcional), Carteira de Trabalho
- Certidão de Nascimento dos filhos < 14 anos (opcional), Cartão de Vacinação < 7 anos (opcional)
- Comprovante Escolar 7–14 anos (opcional), Comprovante de Residência

O candidato pode marcar "Enviarei depois" em documentos opcionais e completar usando o mesmo link posteriormente.

---

## Detecção de qualidade de documentos (Index.html)

Implementada via Canvas API + Laplacian variance:
- **Tamanho**: rejeita arquivos > 10 MB
- **Resolução**: alerta se imagem < 400×400 px
- **Borrão**: calcula variância laplaciana (após box blur 3×3 para reduzir artefatos JPEG). Threshold: variância < 100 = borrão detectado
- PDFs não passam por análise de imagem (apenas validação de tamanho)
- Avisos são exibidos na prévia do arquivo mas **não bloqueiam** o envio

---

## Equivalência de unidades (nome → razão social)

Fonte única de verdade: objeto `UNIDADES` em `Code.gs`. A função `listarUnidades()` popula dinamicamente os selects em `Admin.html` e `Diretor.html` — **não há lista hardcoded nos HTMLs**.

| Unidade | Razão Social |
|---|---|
| Bangu | BG Assessoria Linguística Ltda |
| Botafogo | Kansas Assessoria Linguística Ltda |
| BRASAS On Demand | BRASAS On Demand Assessoria Linguística Ltda |
| Cachambi | NS Assessoria Linguística Ltda |
| Campo Grande | CG Assessoria Linguística Ltda |
| Copacabana | The West School Of English Ltda |
| Caxias | Caxias Assessoria Linguística Ltda |
| Downtown | DT Assessoria Linguística Ltda |
| EC | Ec New Assessoria Linguística Ltda |
| Editora | Editora Eficiencia Ltda |
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

Para **adicionar uma unidade**: editar apenas o objeto `UNIDADES` e o `EMAILS_DIRETORES` em `Code.gs`. Os selects se atualizam automaticamente.

---

## E-mails dos diretores por unidade

Configurado no objeto `EMAILS_DIRETORES` em `Code.gs`. Usado para:
1. Compartilhar a pasta do Drive automaticamente ao criar a pasta da unidade
2. *(futuro)* Enviar e-mail de notificação ao diretor quando formulário for recebido

Unidades sem e-mail configurado no momento: Editora, EC, Grajaú, Métodos (aguardando fornecimento).

---

## Pendências

- [ ] **Aplicar alteração no Hub** — modificar `doGet` do Hub BRASAS Analytics para suportar `?next=URL` e redirecionar com o token de sessão após autenticação. Código fornecido, falta aplicar e reimplantar.
- [ ] **Reimplantar ambos os projetos** no GAS após as alterações
- [ ] **E-mails faltantes de diretores** — Editora, EC, Grajaú, Métodos (aguardando fornecimento)
- [ ] **Notificação ao diretor e ao DP por e-mail** quando formulário for recebido (estrutura pronta em `EMAILS_DIRETORES`, falta implementar o envio)

---

## Decisões de UX registradas

- Status das solicitações renomeado de "Link enviado" → **"Link gerado"** (o link não é enviado automaticamente, precisa ser copiado e enviado pelo DP)
- Botões de atualizar individuais por seção removidos → **único botão "↻ Atualizar" no canto superior direito** do header do painel DP
- PIS/PASEP e Certificado de Reservista: **removida opção de inserir só o número** — apenas upload de arquivo aceito
- Painel DP → Links gerados: adicionados **filtro por unidade** e **busca por nome** acima da tabela (filtragem client-side)
- Avisos de qualidade de documento (borrão, resolução) são **informativos**, não bloqueantes — candidato pode enviar mesmo com aviso

---

## Segurança

- Todos os dados de usuário renderizados no `Admin.html` passam pela função `esc()` (escapa `&`, `<`, `>`, `"`) para prevenir XSS
- Parâmetros de nome em handlers `onclick` usam `JSON.stringify` + `&quot;` para evitar injeção via aspas
- Tokens são UUIDs hexadecimais gerados pelo servidor — não contêm caracteres especiais
- Sessões do Hub verificadas em cada acesso ao painel: role (`admin`/`dp`) + expiração
