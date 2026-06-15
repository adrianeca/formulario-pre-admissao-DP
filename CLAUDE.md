# Formulário de Pré-Admissão – BRASAS DP

## O que é este projeto

Web app em Google Apps Script para coleta de dados e documentos de novos funcionários em processo admissional. O funcionário preenche o formulário online e, ao enviar, o sistema cria automaticamente uma pasta no Google Drive com os documentos e gera um PDF com os dados preenchidos.

O acesso ao formulário é controlado por **token único por URL**: o DP gera um link personalizado para cada candidato numa planilha Google Sheets. O link é invalidado após o uso.

---

## Arquivos

| Arquivo | Descrição |
|---|---|
| `Code.gs` | Script servidor (Google Apps Script). Roteamento, validação de token, processamento do formulário, criação de pasta/PDF no Drive, todos os envios de e-mail. |
| `Index.html` | Formulário HTML completo com CSS e JavaScript embutidos. Servido como Web App via `HtmlService`. |
| `Admin.html` | Painel do DP: geração de links avulsos, lista de tokens (com filtro e busca), solicitações dos diretores, formulários recebidos e contratos. Usa sintaxe de template GAS (`<?= ?>`). |
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
      CARTA_ABERTURA_CONTA_JOAO_SILVA.pdf   ← gerado se candidato não tem conta Itaú
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
2. Abre → formulário com unidade pré-preenchida, travada, e e-mail do candidato já preenchido (vindo da solicitação do diretor)
3. Preenche e envia os documentos
4. Se deixar documentos para depois: recebe e-mail com o mesmo link para completar
5. Link é invalidado quando todos os documentos forem enviados; pasta mantida no Drive

### Telas de erro
- Sem token → "Acesso inválido. Solicite um link personalizado ao setor de DP."
- Token já usado → "Este link já foi utilizado. Entre em contato com dp@brasas.com."
- Token inválido → "Link inválido. Entre em contato com dp@brasas.com."

---

## Campos do formulário

### Dados Pessoais
- **E-mail** — pré-preenchido automaticamente com o e-mail da solicitação do diretor (quando disponível)
- Nome Completo, CPF (com validação), Data de Nascimento, Telefone
- **Endereço de residência** (sempre obrigatório):
  - CEP (busca automática via ViaCEP → preenche Rua e Bairro)
  - **Rua** (campo separado, preenchido pelo ViaCEP)
  - **Número e complemento** (campo separado, digitado pelo candidato)
  - Bairro
  - Os dois campos de endereço são combinados em `ruaNumeroResidencia` antes do envio ao servidor

### Unidade
- Quando acessado via token: exibe apenas o nome da unidade como texto estático (sem dropdown). Quando sem token: dropdown com 30 unidades. O sistema registra a razão social correspondente.

### Dados Bancários
- Possui conta no Itaú? (Sim/Não)
- Se **Sim**: **Agência** e **Conta (com dígito)** — campos obrigatórios exibidos condicionalmente
- Se **Não**: exibe aviso azul informando que o candidato receberá uma **carta de abertura de conta** por e-mail. A carta é gerada automaticamente em PDF (template Google Docs) e enviada como anexo ao finalizar o formulário

### Vale Transporte
- Necessita de Vale Transporte? (Sim/Não)
- Se Sim: Bilhete Único/JAÉ, Modal de transporte, Quantidade de conduções por dia
- **Endereço de partida**: por padrão usa o mesmo endereço de residência (checkbox "Usar o mesmo endereço"); se desmarcado, exibe campos separados de CEP/Rua/Bairro com busca ViaCEP

### Documentos (upload)
15 documentos com upload múltiplo, pré-visualização individual e **detecção automática de qualidade** (borrão, resolução mínima, tamanho máximo 10 MB). Alguns obrigatórios, outros opcionais:
- Foto 3×4, Atestado Médico Admissional, Carteira de Identidade, CPF, Título de Eleitor
- PIS/PASEP **(somente arquivo)**, Certificado de Reservista **(somente arquivo, opcional)**
- Declaração de Escolaridade, Certidão de Casamento (opcional), Carteira de Trabalho
- Certidão de Nascimento dos filhos < 14 anos (opcional), Cartão de Vacinação < 7 anos (opcional)
- Comprovante Escolar 7–14 anos (opcional), Comprovante de Residência
- **Antecedentes Criminais** — exibe instrução com link de emissão gratuita: `https://www.gov.br/pt-br/servicos/emitir-certidao-de-antecedentes-criminais`

O candidato pode marcar "Não tenho agora, enviarei depois" em documentos opcionais e completar usando o mesmo link posteriormente.

### CTPS (Número e Série)
- Campo de texto obrigatório exibido **dentro da seção de Carteira de Trabalho** (`ctpsInput: true` no objeto DOCS)
- Se o candidato marcar "Enviarei depois" para a Carteira de Trabalho, a validação do CTPS é automaticamente ignorada naquele envio
- No retorno (modo complemento), o CTPS aparece junto com o documento e é obrigatório
- O número é enviado ao servidor e salvo na coluna CTPS da aba Envios; em modo complemento, `completarDocumentos` recebe e salva o valor atualizado

### Tela de sucesso
- Documentos separados em **Obrigatórios** e **Opcionais**
- Cada item exibe ✓ (verde) se enviado ou ● + badge vermelho **"Não enviado"** se pendente
- Se **todos os obrigatórios foram enviados**: exibe mensagem verde "Todos os documentos obrigatórios foram recebidos com sucesso. O Departamento Pessoal irá analisar as informações e entrará em contato em breve."
- Se há pendências: orienta o candidato a retornar pelo mesmo link

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
2. Enviar e-mail de notificação (`enviarEmailDiretor`) quando o candidato submete o formulário

Unidades sem e-mail configurado: Editora, EC, Grajaú, Métodos (aguardando fornecimento). O DP (`dp@brasas.com`) sempre recebe a notificação mesmo nestes casos.

---

## Formulário do Diretor (`Diretor.html`)

O diretor preenche para solicitar a admissão de um candidato. Campos:
- **Unidade** (dropdown populado via `listarUnidades()`)
- **Nome Completo** do candidato
- **E-mail** do candidato — usado para envio do link de pré-admissão e pré-preenchimento do formulário
- **CPF** do candidato (com validação)
- **Cargo** (dropdown: Secretaria, ASG, Porteiro, Aprendiz, Agente de Apoio)
- **Jornada de Trabalho** — campos estruturados:
  - Horário Seg–Sex: pickers de hora entrada/saída
  - Checkbox "Trabalha aos sábados" → exibe pickers de hora entrada/saída para sábado
  - Campo de observação opcional
  - Gera string formatada: `"Seg–Sex, 08h00 às 17h00 / Sáb, 08h00 às 12h00 (obs)"`
- **Data de Admissão** (mínimo 2 dias úteis a partir de hoje)

O e-mail é salvo na aba **Solicitações** da planilha e propagado para o registro do token gerado (coluna "Email Candidato" na aba Tokens), pré-preenchendo o campo e-mail no formulário do candidato.

---

## Painel DP — funcionalidades (`Admin.html`)

### Solicitações dos Diretores
- Tabela com: **Candidato, E-mail, CPF, Unidade, Cargo, Jornada, Data Admissão, Solicitado em, Status, Ação**
- **Gerar link**: cria token e associa à solicitação
- **Copiar link**: após gerado
- **✉ Enviar e-mail**: envia o link ao candidato via `enviarEmailAdmissao()` (disponível quando e-mail preenchido e link gerado)
- **✕ Excluir**: remove o registro da aba Solicitações (via `deletarSolicitacao()`)

### Links Gerados (avulsos)
- Formulário com: Nome, E-mail do candidato, Unidade
- **✉ Enviar**: botão na tabela para tokens com e-mail e ainda não usados
- **✕ Excluir**: remove o registro (via `deletarToken()`)

### Formulários Recebidos
- **✕ Excluir**: remove registro da aba Envios (pasta no Drive não é afetada, via `deletarEnvio()`)
- **📄 Gerar**: abre modal de geração de contrato (disponível apenas quando todos os docs foram recebidos)

### Contratos
- Tabela com: Candidato, Unidade, Gerado em, Status ("Gerado"), link "Ver contrato"
- Sem integração com API de assinatura digital (removida); assinatura tratada externamente

### Largura do painel
- Container expandido para `max-width: 1400px`

---

## E-mails — visão geral

Todos os e-mails saem com `name: 'BRASAS Departamento Pessoal'` e `replyTo: 'dp@brasas.com'`. O proprietário do GAS (adriane@brasas.com) aparece como remetente técnico, mas o nome exibido e o reply-to são do DP.

### `enviarEmailAdmissao` — link de pré-admissão ao candidato
- Assunto: `BRASAS – Formulário de pré-admissão | [Primeiro nome]`
- Botão azul "Preencher formulário →", aviso de link único e intransferível

### `enviarEmailPendencias` — documentos pendentes ao candidato
- Disparado automaticamente quando o candidato envia documentos mas ficam pendências
- Assunto: `BRASAS – Documentos pendentes | [Primeiro nome]`
- HTML com lista separada: **Obrigatórios** (vermelho) e **Opcionais** (laranja), botão "Completar envio →"

### `enviarEmailDiretor` — notificação ao diretor quando formulário é enviado
- Disparado em `processarFormulario` e `completarDocumentos`
- Destinatários: todos os e-mails de `EMAILS_DIRETORES[unidade]` + `dp@brasas.com`
- Assunto: `BRASAS – Pré-admissão completa | ...` ou `BRASAS – Formulário recebido | ...`
- HTML com: badge de status (completo/pendente), lista de docs enviados (✓ verde), docs pendentes separados em obrigatórios (vermelho) e opcionais (laranja), botão "Abrir pasta no Drive"

### `gerarCartaAberturaConta` — carta de abertura de conta Itaú
- Disparado em `processarFormulario` quando `dados.contaItau === 'Não'`
- Copia o template Google Docs (`CARTA_CONTA_TEMPLATE_ID`), substitui variáveis, exporta PDF
- Salva o PDF na pasta do candidato no Drive
- Envia o PDF por e-mail ao candidato como anexo
- Template: `1_0UhlvI9uzrOFh8pFGeua1u7Lnw5NKO6SE3z7eym5EM`

---

## Estrutura das planilhas

### Aba Tokens (9 colunas)
`ID/Token | Candidato | Unidade | Link | Status | Atualizado em | Criado em | ID Solicitação | Email Candidato`

### Aba Solicitações (11 colunas)
`ID | Unidade | Nome | E-mail | CPF | Cargo | Jornada | Data Admissão | Status | Token | Criado em`

### Aba Envios (9 colunas)
`Token | Candidato | Unidade | Email | Data Envio | Documentos Enviados | Documentos Pendentes | Pasta Drive | CTPS`

### Aba Assinaturas (9 colunas)
`Token | Candidato | Email | Unidade | (vazio) | ContratoId | Status | Gerado em | Assinado em`

> **Atenção:** colunas adicionadas recentemente (Email Candidato em Tokens, CTPS em Envios) são criadas automaticamente apenas em planilhas novas. Em planilhas existentes, adicionar manualmente antes de reimplantar.

---

## Geração de contrato (modal no painel DP)

O DP pode gerar o contrato de trabalho diretamente do painel, abrindo o modal em "Formulários Recebidos" (disponível apenas quando todos os documentos foram recebidos):

- **Campos editáveis**: Cargo, Jornada de trabalho, CTPS, Salário (R$), Salário por extenso
- Cargo e Jornada são pré-preenchidos com os valores da solicitação do diretor (se houver)
- CTPS é pré-preenchido com o número informado pelo candidato no formulário
- **Salário por extenso preenchido automaticamente** ao digitar o valor numérico (ex: `1.500,00` → `mil e quinhentos reais`)
- O contrato é criado na pasta do candidato no Drive (cópia do template preenchida com os dados)
- Após geração: status "Gerado" na aba Assinaturas; assinatura tratada externamente pelo DP

### Função no servidor
`gerarEEnviarContrato(token, ctps, salario, salarioExtenso, cargo, jornada)` — os parâmetros `cargo` e `jornada` sobrepõem os valores vindos da solicitação do diretor.

---

## Fluxo de complemento de documentos (`?token=...` com status INCOMPLETO)

Quando o candidato enviou documentos parciais na primeira vez, o link original (`?token=TOKEN`) continua válido. Ao acessá-lo novamente:

1. `doGet` detecta `td.incompleto = true` e renderiza `Index.html` em modo complemento
2. `_STATUS = 'incompleto'`, `_PENDENTES` = lista de rótulos dos docs ainda faltantes
3. Somente os documentos pendentes são exibidos para upload
4. Ao enviar, `completarDocumentos(token, docs, ctps)` é chamado no servidor:
   - Adiciona arquivos enviados na pasta do Drive já existente
   - Salva o CTPS se fornecido (para o caso em que foi omitido no primeiro envio)
   - Docs opcionais sem arquivo são **ignorados** (não marcados como pendência)
   - Se ainda restarem pendentes obrigatórios: token permanece INCOMPLETO, link de retorno é exibido
   - Se tudo completo: token é marcado USADO
   - Dispara `enviarEmailDiretor` em ambos os casos

### Bugs corrigidos neste fluxo
- `var filesMap = {}` estava declarado **após** o `forEach` de renderização — ficava `undefined` por hoisting e quebrava o submit. Movido para antes do `forEach`.
- `document.querySelector('.header h1')` retornava `null` no HTML implantado → adicionadas null-checks em todos os `.textContent` do bloco incompleto
- Token chegava como `undefined` no servidor quando o HTML antigo ainda estava implantado → adicionado guard `if (!_TOKEN || _TOKEN === 'undefined')`
- `completarDocumentos` não retornava `linkRetorno` → corrigido, agora retorna `webappUrl + '?token=' + token`

---

## Pendências

- [ ] **Aplicar alteração no Hub** — modificar `doGet` do Hub BRASAS Analytics para suportar `?next=URL` e redirecionar com o token de sessão após autenticação. Código fornecido, falta aplicar e reimplantar.
- [ ] **Reimplantar ambos os projetos** no GAS após as alterações
- [ ] **E-mails faltantes de diretores** — Editora, EC, Grajaú, Métodos (aguardando fornecimento)

---

## Decisões de UX registradas

- Status das solicitações renomeado de "Link enviado" → **"Link gerado"** (o link não é enviado automaticamente, precisa ser copiado e enviado pelo DP)
- Botões de atualizar individuais por seção removidos → **único botão "↻ Atualizar" no canto superior direito** do header do painel DP
- PIS/PASEP e Certificado de Reservista: **removida opção de inserir só o número** — apenas upload de arquivo aceito
- Painel DP → Links gerados: adicionados **filtro por unidade** e **busca por nome** acima da tabela (filtragem client-side)
- Avisos de qualidade de documento (borrão, resolução) são **informativos**, não bloqueantes — candidato pode enviar mesmo com aviso
- Modal de contrato: sem integração eSignature — **"📄 Gerar Contrato"** salva no Drive; assinatura tratada externamente
- Docs opcionais sem arquivo no modo complemento são **silenciosamente ignorados** — apenas obrigatórios geram pendência
- Unidade no formulário do candidato: quando pré-preenchida por token, exibe texto estático em vez de select desabilitado
- Endereço de residência separado em **Rua** + **Número e complemento** (dois campos); combinados antes do envio
- Conta Itaú "Não": aviso azul imediato + carta de abertura de conta gerada e enviada por e-mail ao candidato
- CTPS: campo junto à Carteira de Trabalho; pode ser marcado "Enviarei depois" sem bloquear envio; obrigatório no complemento
- Tela de sucesso: documentos separados em obrigatórios/opcionais; badge "Não enviado" nos pendentes; mensagem verde quando tudo enviado
- E-mail pré-preenchido no formulário do candidato com o e-mail da solicitação do diretor
- Tabela de Solicitações no painel DP: inclui CPF e Jornada de todas as solicitações dos diretores
- Salário por extenso no modal de contrato: preenchido automaticamente ao digitar o valor numérico
- Diretores recebem e-mail de notificação a cada envio/complemento, com docs enviados, pendentes (obrigatórios vs opcionais) e link do Drive

---

## Segurança

- Todos os dados de usuário renderizados no `Admin.html` passam pela função `esc()` (escapa `&`, `<`, `>`, `"`) para prevenir XSS
- Parâmetros de nome em handlers `onclick` usam `JSON.stringify` + `&quot;` para evitar injeção via aspas
- Tokens são UUIDs hexadecimais gerados pelo servidor — não contêm caracteres especiais
- Sessões do Hub verificadas em cada acesso ao painel: role (`admin`/`dp`) + expiração
