const PASTA_PAI_ID      = '1IuU9YLh4kiXg1p-xgNiZruUL9ddnD345';
const SHEET_USUARIOS_ID = '1eZPbzhzjhjHoPwMhAW5YvOZgYiAvlTYc07dRan6Lyoc';
const HUB_URL           = 'https://script.google.com/a/macros/brasas.com/s/AKfycbyF7BArYMYFtcQY7_4RTGGPw89yNohAjR7eGptItP-EsnWhNfiZR2ISRaHdAkwlLSlr/exec';

// Preencher após criar os templates de contrato no Google Drive (ver instruções no CLAUDE.md):
const CONTRATO_TEMPLATE_DOCENTE_ID        = '1B4-WoJQw0mcYsPhQAa9xEAgTvzZxgNMtK1rcJPvzAak';
const CONTRATO_TEMPLATE_ADMINISTRATIVO_ID = '1lDkmuzGwW2FcAFbleoiy7qq0Y-fmihmfglb_7GsxcaE';

const UNIDADES = {
  'Bangu':              'BG Assessoria Linguística Ltda',
  'Botafogo':           'Kansas Assessoria Linguística Ltda',
  'BRASAS On Demand':   'BRASAS On Demand Assessoria Linguística Ltda',
  'Cachambi':           'NS Assessoria Linguística Ltda',
  'Campo Grande':       'CG Assessoria Linguística Ltda',
  'Copacabana':         'The West School Of English Ltda',
  'Caxias':             'Caxias Assessoria Linguística Ltda',
  'Downtown':           'DT Assessoria Linguística Ltda',
  'Editora':            'Editora Eficiencia Ltda',
  'EC':                 'Ec New Assessoria Linguística Ltda',
  'Freguesia':          'FG Assessoria Linguística Ltda',
  'Grajaú':             'GR Assessoria Linguística Ltda',
  'Ilha do Governador': 'Cambaúba Assessoria Linguística Ltda',
  'Ipanema':            'New Concepts Assessoria Linguística Ltda',
  'Itaipu':             'IT Assessoria Linguística Ltda',
  'Laranjeiras':        'LJ Assessoria Linguística Ltda',
  'Méier':              'MRI Assessoria Linguística Ltda',
  'Métodos':            'Métodos de Ensino Brasas Ltda',
  'Nova Iguaçu':        'NI Assessoria Linguística Ltda',
  'Niterói':            'NT Assessoria Linguística Ltda',
  'Novo Leblon':        'Bal Barra Assessoria Linguística Ltda',
  'Parque Olímpico':    'P.O Assessoria Linguística Ltda',
  'Pechincha':          'PC Assessoria Linguística Ltda',
  'Península':          'PN Assessoria Linguística Ltda',
  'Recreio':            'RC Assessoria Linguística Ltda',
  'Taquara':            'TQ Assessoria Linguística Ltda',
  'Tijuca':             'TJ Assessoria Linguística Ltda',
  'Vila da Penha':      'VP Assessoria Linguística Ltda',
  'Vila Olímpia':       'BCSP Assessoria Linguística Ltda',
  'Vila Valqueire':     'Lexicon Assessoria Linguística Ltda'
};

const EMAILS_DIRETORES = {
  'Bangu':              ['dirbg@brasas.com'],
  'Botafogo':           ['dirbf@brasas.com'],
  'BRASAS On Demand':   ['natasha@brasas.com', 'alexander@brasas.com'],
  'Cachambi':           ['dirch@brasas.com'],
  'Campo Grande':       ['dircg@brasas.com'],
  'Copacabana':         ['dircp@brasas.com'],
  'Caxias':             ['dircx@brasas.com'],
  'Downtown':           ['dirdt@brasas.com'],
  'Freguesia':          ['dirfg@brasas.com'],
  'Ilha do Governador': ['dirig@brasas.com', 'marcelo.ig@brasas.com'],
  'Ipanema':            ['dirip@brasas.com'],
  'Itaipu':             ['dirit@brasas.com'],
  'Laranjeiras':        ['dirlj@brasas.com'],
  'Méier':              ['dirmr@brasas.com'],
  'Nova Iguaçu':        ['dirni@brasas.com'],
  'Niterói':            ['dirnt@brasas.com'],
  'Novo Leblon':        ['dirnl@brasas.com'],
  'Parque Olímpico':    ['dirpo@brasas.com'],
  'Pechincha':          ['dirpc@brasas.com'],
  'Península':          ['dirpn@brasas.com'],
  'Recreio':            ['dirrc@brasas.com'],
  'Taquara':            ['dirtq@brasas.com'],
  'Tijuca':             ['dirtj@brasas.com'],
  'Vila da Penha':      ['dirvp@brasas.com'],
  'Vila Olímpia':       ['dirvo@brasas.com'],
  'Vila Valqueire':     ['dirvq@brasas.com']
};

// CNPJs e endereços por unidade — preencher com os dados reais antes de gerar contratos
const UNIDADES_DADOS = {
  'Bangu':              { cnpj: '55.330.784/0001-08', endereco: 'Rua Agrícola, 318, Bangu, Rio de Janeiro - RJ, 21810-090' },
  'Botafogo':           { cnpj: '07.643.896/0001-76', endereco: 'Rua Voluntários da Pátria, 147, Botafogo, Rio de Janeiro - RJ, 22270-000' },
  'BRASAS On Demand':   { cnpj: '', endereco: '' },
  'Cachambi':           { cnpj: '17.211.797/0001-79', endereco: 'Avenida Dom Hélder Câmara, 5644, Lojas B e C, Pilares, Rio de Janeiro - RJ, 20771-004' },
  'Campo Grande':       { cnpj: '23.149.208/0001-72', endereco: 'Avenida Cesário de Melo, 2400, Loja 107, Campo Grande, Rio de Janeiro - RJ, 23052-100' },
  'Copacabana':         { cnpj: '30.507.545/0001-50', endereco: 'Rua Pompeu Loureiro, 41, Copacabana, Rio de Janeiro - RJ, 22061-000' },
  'Caxias':             { cnpj: '07.657.195/0001-96', endereco: 'Rua Prof. José de Souza Herdy, 1165, Centro, Duque de Caxias - RJ, 25071-201' },
  'Downtown':           { cnpj: '10.576.883/0001-36', endereco: 'Avenida das Américas, 500, Bloco 10, Loja 104, Barra da Tijuca, Rio de Janeiro - RJ, 22640-100' },
  'Editora':            { cnpj: '42.163.550/0001-71', endereco: 'Avenida Cesário de Melo, 2400, Lojas 101 a 106, Campo Grande, Rio de Janeiro - RJ, 23052-102' },
  'EC':                 { cnpj: '23.875.012/0001-65', endereco: 'Estrada Coronel Pedro Correia, 1427, Jacarepaguá, Rio de Janeiro - RJ, 22775-090' },
  'Freguesia':          { cnpj: '33.579.506/0001-56', endereco: 'Estrada dos Três Rios, 200, 2º andar, Freguesia, Rio de Janeiro - RJ, 22755-000' },
  'Grajaú':             { cnpj: '65.768.114/0001-21', endereco: 'Avenida Júlio Furtado, 81, Loja A, Grajaú, Rio de Janeiro - RJ, 20561-012' },
  'Ilha do Governador': { cnpj: '07.644.726/0001-06', endereco: 'Rua Cambaúba, 205, Ilha do Governador, Rio de Janeiro - RJ, 21940-005' },
  'Ipanema':            { cnpj: '07.826.615/0001-10', endereco: 'Rua Visconde de Pirajá, 330, Lojas 207, 208 e 209, Ipanema, Rio de Janeiro - RJ, 22410-000' },
  'Itaipu':             { cnpj: '07.659.358/0001-70', endereco: 'Rua Heitor Collet, 88, Itaipu, Niterói - RJ, 24342-050' },
  'Laranjeiras':        { cnpj: '14.805.058/0001-17', endereco: 'Rua São Salvador, 49, Laranjeiras, Rio de Janeiro - RJ, 22231-130' },
  'Méier':              { cnpj: '07.642.399/0001-53', endereco: 'Rua Vilela Tavares, 46, Méier, Rio de Janeiro - RJ, 20725-220' },
  'Métodos':            { cnpj: '27.618.651/0001-04', endereco: 'Estrada Coronel Pedro Correia, 1427, Jacarepaguá, Rio de Janeiro - RJ, 22775-090' },
  'Niterói':            { cnpj: '07.659.399/0001-66', endereco: 'Rua Lopes Trovão, 287, Icaraí, Niterói - RJ, 24220-070' },
  'Nova Iguaçu':        { cnpj: '07.717.815/0001-35', endereco: 'Rua Coronel Alfredo Soares, 101, Nova Iguaçu - RJ, 26255-150' },
  'Novo Leblon':        { cnpj: '32.102.956/0001-90', endereco: 'Avenida das Américas, 7607, Loja 323, Barra da Tijuca, Rio de Janeiro - RJ, 22793-081' },
  'Parque Olímpico':    { cnpj: '28.535.846/0001-45', endereco: 'Estrada Coronel Pedro Correia, 1427, Jacarepaguá, Rio de Janeiro - RJ, 22775-090' },
  'Pechincha':          { cnpj: '33.579.506/0002-37', endereco: 'Rua Retiro dos Artistas, 855, Lojas A, B e C, Bloco 1, Pechincha, Rio de Janeiro - RJ, 22770-102' },
  'Península':          { cnpj: '63.339.978/0001-00', endereco: 'Avenida Flamboyants da Península, 855, Loja 203, Barra da Tijuca, Rio de Janeiro - RJ, 22776-070' },
  'Recreio':            { cnpj: '21.470.581/0001-03', endereco: 'Avenida das Américas, 19019, Sala 399F, Recreio dos Bandeirantes, Rio de Janeiro - RJ, 22790-701' },
  'Taquara':            { cnpj: '33.579.360/0001-49', endereco: 'Rua Apiacás, 23, Taquara, Rio de Janeiro - RJ, 22730-190' },
  'Tijuca':             { cnpj: '07.642.417/0001-05', endereco: 'Rua Guapiara, 82, Tijuca, Rio de Janeiro - RJ, 20521-180' },
  'Vila da Penha':      { cnpj: '07.642.688/0001-52', endereco: 'Avenida Meriti, 1125, Vila da Penha, Rio de Janeiro - RJ, 21211-007' },
  'Vila Olímpia':       { cnpj: '', endereco: '' },
  'Vila Valqueire':     { cnpj: '08.432.982/0001-00', endereco: 'Rua Luiz Beltrão, 160, Grupos 220/221, Vila Valqueire, Rio de Janeiro - RJ, 21321-230' }
};

// ── Unidades ──────────────────────────────────────────────────────────────────

function listarUnidades() {
  return Object.keys(UNIDADES).sort().map(function(nome) {
    return { nome: nome, razaoSocial: UNIDADES[nome] };
  });
}

// ── Controle de acesso ao painel DP (via sessão do Hub) ──────────────────────

function validarSessaoHub(token) {
  if (!token) return { autorizado: false, motivo: 'Sessão não informada.' };
  try {
    var ss       = SpreadsheetApp.openById(SHEET_USUARIOS_ID);
    var sesSheet = ss.getSheetByName('SESSOES');
    if (!sesSheet) return { autorizado: false, motivo: 'Sessão inválida.' };

    var data = sesSheet.getDataRange().getValues();
    var now  = new Date();

    // Colunas SESSOES: TOKEN, EMAIL, NOME, ROLE, UNIDADE, CRIADO_EM, EXPIRA_EM
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) !== String(token)) continue;

      var expira = data[i][6] ? new Date(data[i][6]) : null;
      if (!expira || expira < now) {
        return { autorizado: false, motivo: 'Sessão expirada. Faça login novamente no Hub.' };
      }

      var role = String(data[i][3] || '').trim().toLowerCase();
      if (role === 'admin' || role === 'dp') {
        return {
          autorizado: true,
          nome:  String(data[i][2] || '').trim(),
          email: String(data[i][1] || '').trim(),
          role:  role
        };
      }
      return { autorizado: false, motivo: 'Sem permissão para acessar o painel do DP.' };
    }

    return { autorizado: false, motivo: 'Sessão inválida.' };
  } catch (e) {
    Logger.log(e.toString());
    return { autorizado: false, motivo: 'Erro ao validar sessão.' };
  }
}

// ── Atualiza a lista de validação de unidades na planilha de tokens ──────────

function atualizarValidacaoUnidades() {
  var sh     = getTokenSheet();
  var opcoes = Object.keys(UNIDADES).sort();
  sh.getRange('C2:C1000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(opcoes, true)
      .setAllowInvalid(false)
      .build()
  );
  Logger.log('✅ Validação atualizada com ' + opcoes.length + ' unidades: ' + opcoes.join(', '));
}

// ── Setup (executar UMA VEZ após implantar o Web App) ─────────────────────────

function inicializar() {
  var url = ScriptApp.getService().getUrl();
  if (!url) {
    Logger.log('❌ Script não implantado como Web App. Implante primeiro e execute inicializar() novamente.');
    return;
  }

  PropertiesService.getScriptProperties().setProperty('WEBAPP_URL', url);
  var sh = getTokenSheet();

  sh.getRange('D2').setFormula(
    '=ARRAYFORMULA(SE(A2:A<>"";"' + url + '?token="&A2:A;""))'
  );

  // Registra trigger horário para verificar assinaturas (remove duplicatas antes)
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'verificarStatusAssinaturas') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('verificarStatusAssinaturas').timeBased().everyHours(1).create();

  Logger.log('✅ Configuração concluída!');
  Logger.log('📊 Planilha de tokens: ' + sh.getParent().getUrl());
  Logger.log('📋 URL do formulário do diretor: ' + url + '?diretor=1');
  Logger.log('🔗 URL do formulário (candidato): ' + url + '?token=SEU_TOKEN');
  Logger.log('🔒 URL do painel DP: ' + url + '?dp=1');
}

// ── Roteamento principal ──────────────────────────────────────────────────────

function doGet(e) {
  var p = (e && e.parameter) ? e.parameter : {};

  if (p.dp === '1') {
    var webappUrl = PropertiesService.getScriptProperties().getProperty('WEBAPP_URL') || '';
    var tmplAdmin = HtmlService.createTemplateFromFile('Admin');
    tmplAdmin.SESSION_TOKEN = p.session || p.s || '';
    tmplAdmin.HUB_URL       = HUB_URL + '?next=' + encodeURIComponent(webappUrl + '?dp=1');
    return tmplAdmin.evaluate()
      .setTitle('BRASAS DP – Painel de Admissão')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  if (p.diretor === '1') {
    return HtmlService.createHtmlOutputFromFile('Diretor')
      .setTitle('BRASAS – Solicitação de Admissão')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  if (!p.token) {
    return renderErroPagina('Acesso inválido. Solicite um link personalizado ao setor de DP.');
  }

  Logger.log('[doGet] p.token=' + p.token);
  var td = validarToken(p.token);
  Logger.log('[doGet] td.valido=' + td.valido + ' td.incompleto=' + td.incompleto + ' td.token=' + td.token);
  if (!td.valido) {
    var msg = td.usado
      ? 'Este link já foi utilizado. Entre em contato com dp@brasas.com.'
      : 'Link inválido. Entre em contato com dp@brasas.com.';
    return renderErroPagina(msg);
  }

  var pendentes = td.incompleto ? getPendentes(td.token) : [];
  Logger.log('[doGet] pendentes=' + JSON.stringify(pendentes));

  var tmpl = HtmlService.createTemplateFromFile('Index');
  tmpl.TOKEN        = td.token;
  tmpl.UNIDADE_ID   = td.unidadeId;
  tmpl.UNIDADE_NOME = td.unidadeNome;
  tmpl.STATUS       = td.incompleto ? 'incompleto' : 'novo';
  tmpl.CANDIDATO    = td.candidato || '';
  tmpl.PENDENTES    = JSON.stringify(pendentes);

  return tmpl.evaluate()
    .setTitle('Formulário de Pré-Admissão – BRASAS')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── Processamento do formulário (primeiro envio) ──────────────────────────────

function processarFormulario(dados) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var tokenCheck = validarToken(dados.token);
    if (!tokenCheck.valido) {
      return { sucesso: false, erro: 'Link inválido ou já utilizado. Recarregue a página.' };
    }

    marcarTokenIncompleto(dados.token);

    var pastaPai     = DriveApp.getFolderById(PASTA_PAI_ID);
    var nomeUnidade  = (dados.nomeUnidade || dados.unidade).toUpperCase();
    var it           = pastaPai.getFoldersByName(nomeUnidade);
    var pastaUnidade = it.hasNext() ? it.next() : pastaPai.createFolder(nomeUnidade);

    compartilharPastaComDiretor(pastaUnidade, dados.nomeUnidade || dados.unidade);

    var novaPasta = pastaUnidade.createFolder(dados.nomeCompleto.toUpperCase());

    (dados.documentos || []).forEach(function(doc) {
      if (doc.base64) {
        novaPasta.createFile(
          Utilities.newBlob(
            Utilities.base64Decode(doc.base64),
            doc.tipo || 'application/octet-stream',
            doc.nome.toUpperCase()
          )
        );
      }
    });

    var solDados = {};
    if (tokenCheck.solicitacaoId) {
      try { solDados = getSolicitacaoDados(tokenCheck.solicitacaoId); } catch(e) { Logger.log('solDados: ' + e); }
    }

    criarPdf(dados, novaPasta, solDados);
    dados.pastaUrl = novaPasta.getUrl();
    var pendentes = salvarEnvio(dados);

    var emailEnviado = false;
    if (pendentes.length === 0) {
      marcarTokenUsado(dados.token);
      if (tokenCheck.solicitacaoId) atualizarStatusSolicitacao(tokenCheck.solicitacaoId, 'Concluído');
    } else {
      if (tokenCheck.solicitacaoId) atualizarStatusSolicitacao(tokenCheck.solicitacaoId, 'Em andamento');
      try {
        enviarEmailPendencias(dados, pendentes);
        emailEnviado = true;
      } catch(emailErr) {
        Logger.log('Erro ao enviar email de pendências: ' + emailErr);
      }
    }

    return { sucesso: true, pendentes: pendentes, emailEnviado: emailEnviado, linkRetorno: PropertiesService.getScriptProperties().getProperty('WEBAPP_URL') + '?token=' + dados.token };
  } catch (e) {
    Logger.log(e.toString());
    return { sucesso: false, erro: e.message };
  } finally {
    lock.releaseLock();
  }
}

// ── Complemento de documentos (retorno ao mesmo link) ────────────────────────

function completarDocumentos(token, documentos) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    Logger.log('[completarDocumentos] token=' + token + ' | docs recebidos=' + (documentos || []).length);

    var td = validarToken(token);
    Logger.log('[completarDocumentos] validarToken: valido=' + td.valido + ' incompleto=' + td.incompleto);
    if (!td.valido || !td.incompleto) {
      return { sucesso: false, erro: 'Link inválido ou processo já concluído.' };
    }

    var enviosData = getEnviosSheet().getDataRange().getValues();
    var pastaUrl   = '';
    for (var i = 1; i < enviosData.length; i++) {
      if (String(enviosData[i][0]).trim() === String(token).trim()) {
        pastaUrl = String(enviosData[i][7] || '').trim();
        Logger.log('[completarDocumentos] pastaUrl encontrada na linha ' + (i + 1) + ': ' + pastaUrl);
        break;
      }
    }
    if (!pastaUrl) {
      Logger.log('[completarDocumentos] ERRO: pastaUrl não encontrada no Envios para token=' + token);
      return { sucesso: false, erro: 'Pasta do candidato não encontrada. Verifique se o formulário inicial foi enviado corretamente.' };
    }
    var pastaMatch = pastaUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (!pastaMatch) {
      Logger.log('[completarDocumentos] ERRO: regex não encontrou ID em pastaUrl=' + pastaUrl);
      return { sucesso: false, erro: 'URL da pasta inválida.' };
    }
    Logger.log('[completarDocumentos] folderId=' + pastaMatch[1]);
    var pasta = DriveApp.getFolderById(pastaMatch[1]);

    var docsComArquivo = (documentos || []).filter(function(d) { return !!d.base64; });
    Logger.log('[completarDocumentos] docs com arquivo (base64): ' + docsComArquivo.length);
    docsComArquivo.forEach(function(doc) {
      pasta.createFile(
        Utilities.newBlob(
          Utilities.base64Decode(doc.base64),
          doc.tipo || 'application/octet-stream',
          doc.nome.toUpperCase()
        )
      );
      Logger.log('[completarDocumentos] arquivo criado: ' + doc.nome.toUpperCase());
    });

    var novosEnviados  = docsComArquivo.map(function(d) { return d.rotulo; });
    var novosPendentes = (documentos || []).filter(function(d) { return !d.base64; }).map(function(d) { return d.rotulo; });
    Logger.log('[completarDocumentos] novosEnviados=' + JSON.stringify(novosEnviados) + ' novosPendentes=' + JSON.stringify(novosPendentes));

    if (novosEnviados.length === 0 && novosPendentes.length === 0) {
      // Todos os docs restantes eram opcionais e o candidato optou por não enviar
      // (frontend não inclui opcionais sem arquivo em modo incompleto)
      atualizarEnvio(token, [], []);
      marcarTokenUsado(token);
      if (td.solicitacaoId) atualizarStatusSolicitacao(td.solicitacaoId, 'Concluído');
      var webappUrl2 = PropertiesService.getScriptProperties().getProperty('WEBAPP_URL') || '';
      return { sucesso: true, pendentes: [], linkRetorno: webappUrl2 + '?token=' + token };
    }

    atualizarEnvio(token, novosEnviados, novosPendentes);

    if (novosEnviados.length > 0 && novosPendentes.length === 0) {
      marcarTokenUsado(token);
      if (td.solicitacaoId) atualizarStatusSolicitacao(td.solicitacaoId, 'Concluído');
    }

    var webappUrl = PropertiesService.getScriptProperties().getProperty('WEBAPP_URL') || '';
    return { sucesso: true, pendentes: novosPendentes, linkRetorno: webappUrl + '?token=' + token };
  } catch (e) {
    Logger.log('[completarDocumentos] EXCECAO: ' + e.toString() + '\n' + e.stack);
    return { sucesso: false, erro: e.message };
  } finally {
    lock.releaseLock();
  }
}

// ── Tokens ────────────────────────────────────────────────────────────────────

function getTokenSheet() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_TOKENS_ID');
  var ss;
  if (id) {
    try { ss = SpreadsheetApp.openById(id); } catch (err) { ss = null; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create('BRASAS – Controle de Acesso Admissão');
    props.setProperty('SHEET_TOKENS_ID', ss.getId());

    var sh = ss.getActiveSheet();
    sh.setName('Tokens');

    sh.getRange(1, 1, 1, 8).setValues([[
      'ID / Token', 'Candidato', 'Unidade', 'Link para enviar', 'Status', 'Atualizado em', 'Criado em', 'ID Solicitação'
    ]]);
    sh.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#1a237e').setFontColor('#ffffff');

    sh.setColumnWidth(1, 130).setColumnWidth(2, 200).setColumnWidth(3, 160)
      .setColumnWidth(4, 480).setColumnWidth(5, 110).setColumnWidth(6, 140)
      .setColumnWidth(7, 140).setColumnWidth(8, 150);

    sh.setFrozenRows(1);

    var opcoes = Object.keys(UNIDADES).sort();
    sh.getRange('C2:C1000').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(opcoes, true)
        .setAllowInvalid(false)
        .build()
    );

    sh.getRange('D1:F1000').protect()
      .setDescription('Preenchido automaticamente — não editar')
      .setWarningOnly(true);
  }
  return ss.getSheetByName('Tokens');
}

function criarToken(candidato, unidadeId, unidadeNome) {
  var url = PropertiesService.getScriptProperties().getProperty('WEBAPP_URL');
  if (!url) throw new Error('URL do Web App não configurada. Execute inicializar() primeiro.');

  var token = Utilities.getUuid().replace(/-/g, '').substring(0, 10).toUpperCase();
  var link  = url + '?token=' + token;

  var sh  = getTokenSheet();
  var row = sh.getLastRow() + 1;
  if (row > sh.getMaxRows()) sh.insertRowsAfter(sh.getMaxRows(), 200);
  sh.getRange(row, 3).clearDataValidations();
  sh.getRange(row, 1, 1, 3).setValues([[token, candidato, unidadeNome]]);
  sh.getRange(row, 7).setValue(new Date());

  return { url: link, token: token };
}

function criarTokenParaSolicitacao(solicitacaoId) {
  var url = PropertiesService.getScriptProperties().getProperty('WEBAPP_URL');
  if (!url) throw new Error('URL do Web App não configurada. Execute inicializar() primeiro.');

  var solSh   = getSolicitacoesSheet();
  var solData = solSh.getDataRange().getValues();
  var solRow  = -1;
  var solRec  = null;

  for (var i = 1; i < solData.length; i++) {
    if (String(solData[i][0]).trim() === String(solicitacaoId).trim()) {
      solRow = i + 1;
      solRec = solData[i];
      break;
    }
  }

  if (!solRec) throw new Error('Solicitação não encontrada.');

  var candidato   = String(solRec[2]);
  var unidadeNome = String(solRec[1]);

  var token = Utilities.getUuid().replace(/-/g, '').substring(0, 10).toUpperCase();
  var link  = url + '?token=' + token;

  var sh  = getTokenSheet();
  var row = sh.getLastRow() + 1;
  if (row > sh.getMaxRows()) sh.insertRowsAfter(sh.getMaxRows(), 200);
  sh.getRange(row, 3).clearDataValidations();
  sh.getRange(row, 1, 1, 3).setValues([[token, candidato, unidadeNome]]);
  sh.getRange(row, 7).setValue(new Date());
  sh.getRange(row, 8).setValue(solicitacaoId);

  solSh.getRange(solRow, 8).setValue('Link gerado');
  solSh.getRange(solRow, 9).setValue(token);

  return { url: link, token: token, candidato: candidato, unidade: unidadeNome };
}

function listarTokens() {
  var url  = PropertiesService.getScriptProperties().getProperty('WEBAPP_URL');
  var sh   = getTokenSheet();
  var data = sh.getDataRange().getValues();
  var tz   = Session.getScriptTimeZone();
  var tokens = [];

  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!String(r[0]).trim()) continue;
    var token  = String(r[0]).trim();
    var status = r[4];
    tokens.push({
      token:      token,
      candidato:  String(r[1] || ''),
      unidade:    String(r[2] || ''),
      link:       url ? url + '?token=' + token : String(r[3] || ''),
      usado:      status === true,
      incompleto: status === 'INCOMPLETO',
      usadoEm:    r[5] instanceof Date ? Utilities.formatDate(r[5], tz, 'dd/MM/yyyy HH:mm') : (r[5] ? String(r[5]) : ''),
      criado:     r[6] instanceof Date ? Utilities.formatDate(r[6], tz, 'dd/MM/yyyy HH:mm') : (r[6] ? String(r[6]) : '')
    });
  }

  return tokens;
}

function deletarToken(token) {
  var sh   = getTokenSheet();
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(token).trim()) {
      sh.deleteRow(i + 1);
      return { ok: true };
    }
  }
  return { ok: false, erro: 'Registro não encontrado.' };
}

function validarToken(token) {
  if (!token) return { valido: false, usado: false };
  var sh   = getTokenSheet();
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(token).trim()) {
      if (data[i][4] === true) return { valido: false, usado: true };
      var unidadeNome = String(data[i][2]);
      var unidadeId   = UNIDADES[unidadeNome] || unidadeNome;
      var incompleto  = data[i][4] === 'INCOMPLETO';
      return {
        valido:        true,
        token:         token,
        unidadeId:     unidadeId,
        unidadeNome:   unidadeNome,
        incompleto:    incompleto,
        candidato:     String(data[i][1] || ''),
        solicitacaoId: String(data[i][7] || '')
      };
    }
  }
  return { valido: false, usado: false };
}

function marcarTokenIncompleto(token) {
  var sh   = getTokenSheet();
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(token).trim()) {
      sh.getRange(i + 1, 5).setValue('INCOMPLETO');
      sh.getRange(i + 1, 6).setValue(new Date());
      return;
    }
  }
}

function marcarTokenUsado(token) {
  var sh   = getTokenSheet();
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(token).trim()) {
      sh.getRange(i + 1, 5).setValue(true);
      sh.getRange(i + 1, 6).setValue(new Date());
      return;
    }
  }
}

// ── Solicitações dos diretores ────────────────────────────────────────────────

function getSolicitacoesSheet() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_TOKENS_ID');
  if (!id) throw new Error('Planilha não encontrada. Execute inicializar() primeiro.');
  var ss = SpreadsheetApp.openById(id);
  var sh = ss.getSheetByName('Solicitações');
  if (!sh) {
    sh = ss.insertSheet('Solicitações');
    sh.getRange(1, 1, 1, 10).setValues([[
      'ID', 'Unidade', 'Nome', 'CPF', 'Cargo', 'Jornada', 'Data Admissão', 'Status', 'Token', 'Criado em'
    ]]);
    sh.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#1a237e').setFontColor('#ffffff');
    sh.setColumnWidth(1, 130).setColumnWidth(2, 150).setColumnWidth(3, 210)
      .setColumnWidth(4, 130).setColumnWidth(5, 130).setColumnWidth(6, 200)
      .setColumnWidth(7, 130).setColumnWidth(8, 120).setColumnWidth(9, 120)
      .setColumnWidth(10, 150);
    sh.setFrozenRows(1);
  }
  return sh;
}

function processarSolicitacao(dados) {
  try {
    var id = Utilities.getUuid().replace(/-/g, '').substring(0, 12).toUpperCase();
    var sh = getSolicitacoesSheet();

    var partes = String(dados.dataAdmissao || '').split('-');
    var dataAdm = partes.length === 3
      ? new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]))
      : '';

    sh.appendRow([
      id,
      dados.unidade  || '',
      dados.nome     || '',
      dados.cpf      || '',
      dados.cargo    || '',
      dados.jornada  || '',
      dataAdm,
      'Pendente',
      '',
      new Date()
    ]);

    return { sucesso: true, id: id };
  } catch (e) {
    Logger.log(e.toString());
    return { sucesso: false, erro: e.message };
  }
}

function listarSolicitacoes() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_TOKENS_ID');
  if (!id) return [];
  var ss;
  try { ss = SpreadsheetApp.openById(id); } catch(e) { return []; }
  var sh = ss.getSheetByName('Solicitações');
  if (!sh || sh.getLastRow() < 2) return [];

  var data = sh.getDataRange().getValues();
  var tz   = Session.getScriptTimeZone();
  var url  = PropertiesService.getScriptProperties().getProperty('WEBAPP_URL') || '';
  var result = [];

  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!String(r[0]).trim()) continue;
    var tkn = String(r[8] || '');
    result.push({
      id:            String(r[0]),
      unidade:       String(r[1] || ''),
      nome:          String(r[2] || ''),
      cpf:           String(r[3] || ''),
      cargo:         String(r[4] || ''),
      jornada:       String(r[5] || ''),
      dataAdmissao:  r[6] instanceof Date ? Utilities.formatDate(r[6], tz, 'dd/MM/yyyy') : String(r[6] || ''),
      status:        String(r[7] || 'Pendente'),
      token:         tkn,
      linkCandidato: (tkn && url) ? url + '?token=' + tkn : '',
      criado:        r[9] instanceof Date ? Utilities.formatDate(r[9], tz, 'dd/MM/yyyy HH:mm') : String(r[9] || '')
    });
  }

  return result.reverse();
}

function getSolicitacaoDados(solicitacaoId) {
  var sh   = getSolicitacoesSheet();
  var data = sh.getDataRange().getValues();
  var tz   = Session.getScriptTimeZone();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(solicitacaoId).trim()) {
      return {
        cargo:        String(data[i][4] || ''),
        jornada:      String(data[i][5] || ''),
        dataAdmissao: data[i][6] instanceof Date
                      ? Utilities.formatDate(data[i][6], tz, 'dd/MM/yyyy')
                      : String(data[i][6] || '')
      };
    }
  }
  return {};
}

function atualizarStatusSolicitacao(solicitacaoId, status) {
  var sh   = getSolicitacoesSheet();
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(solicitacaoId).trim()) {
      sh.getRange(i + 1, 8).setValue(status);
      return;
    }
  }
}

// ── Envios ────────────────────────────────────────────────────────────────────

function getEnviosSheet() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_TOKENS_ID');
  var ss = SpreadsheetApp.openById(id);
  var sh = ss.getSheetByName('Envios');
  if (!sh) {
    sh = ss.insertSheet('Envios');
    sh.getRange(1, 1, 1, 8).setValues([[
      'Token', 'Candidato', 'Unidade', 'Email', 'Data Envio', 'Documentos Enviados', 'Documentos Pendentes', 'Pasta Drive'
    ]]);
    sh.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#1a237e').setFontColor('#ffffff');
    sh.setColumnWidth(1, 120).setColumnWidth(2, 200).setColumnWidth(3, 160)
      .setColumnWidth(4, 200).setColumnWidth(5, 140)
      .setColumnWidth(6, 350).setColumnWidth(7, 350).setColumnWidth(8, 300);
    sh.setFrozenRows(1);
  }
  return sh;
}

function getAssinaturasSheet() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_TOKENS_ID');
  if (!id) throw new Error('Planilha não encontrada. Execute inicializar() primeiro.');
  var ss = SpreadsheetApp.openById(id);
  var sh = ss.getSheetByName('Assinaturas');
  if (!sh) {
    sh = ss.insertSheet('Assinaturas');
    sh.getRange(1, 1, 1, 9).setValues([[
      'Token', 'Candidato', 'Email', 'Unidade', 'ID Pedido', 'ID Contrato', 'Status', 'Enviado em', 'Assinado em'
    ]]);
    sh.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#1a237e').setFontColor('#ffffff');
    sh.setColumnWidth(1, 120).setColumnWidth(2, 200).setColumnWidth(3, 200)
      .setColumnWidth(4, 150).setColumnWidth(5, 220).setColumnWidth(6, 220)
      .setColumnWidth(7, 120).setColumnWidth(8, 150).setColumnWidth(9, 150);
    sh.setFrozenRows(1);
  }
  return sh;
}

function salvarEnvio(dados) {
  var enviados  = [];
  var pendentes = [];

  (dados.documentos || []).forEach(function(d) {
    if (d.base64) {
      if (enviados.indexOf(d.rotulo) === -1) enviados.push(d.rotulo);
    } else {
      if (pendentes.indexOf(d.rotulo) === -1) pendentes.push(d.rotulo);
    }
  });

  getEnviosSheet().appendRow([
    dados.token        || '',
    dados.nomeCompleto || '',
    dados.nomeUnidade  || dados.unidade || '',
    dados.email        || '',
    new Date(),
    enviados.join(' | '),
    pendentes.join(' | '),
    dados.pastaUrl     || ''
  ]);

  return pendentes;
}

function atualizarEnvio(token, novosEnviados, novosPendentes) {
  var sh   = getEnviosSheet();
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(token).trim()) {
      var jaEnviados = String(data[i][5] || '').split(' | ').filter(Boolean);
      novosEnviados.forEach(function(e) {
        if (jaEnviados.indexOf(e) === -1) jaEnviados.push(e);
      });
      sh.getRange(i + 1, 6).setValue(jaEnviados.join(' | '));
      sh.getRange(i + 1, 7).setValue(novosPendentes.join(' | '));
      return;
    }
  }
}

function getPendentes(token) {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_TOKENS_ID');
  if (!id) return [];
  var ss;
  try { ss = SpreadsheetApp.openById(id); } catch(e) { return []; }
  var sh = ss.getSheetByName('Envios');
  if (!sh) return [];
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(token).trim()) {
      return String(data[i][6] || '').split(' | ').filter(Boolean);
    }
  }
  return [];
}

function listarEnvios() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_TOKENS_ID');
  if (!id) return [];
  var ss;
  try { ss = SpreadsheetApp.openById(id); } catch(e) { return []; }
  var sh = ss.getSheetByName('Envios');
  if (!sh || sh.getLastRow() < 2) return [];

  var data = sh.getDataRange().getValues();
  var tz   = Session.getScriptTimeZone();
  var envios = [];

  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!String(r[1]).trim()) continue;
    envios.push({
      token:     String(r[0] || ''),
      candidato: String(r[1] || ''),
      unidade:   String(r[2] || ''),
      email:     String(r[3] || ''),
      dataEnvio: r[4] instanceof Date ? Utilities.formatDate(r[4], tz, 'dd/MM/yyyy HH:mm') : String(r[4] || ''),
      enviados:  String(r[5] || '').split(' | ').filter(Boolean),
      pendentes: String(r[6] || '').split(' | ').filter(Boolean),
      pastaUrl:  String(r[7] || '')
    });
  }

  return envios.reverse();
}

function enviarEmailPendencias(dados, pendentes) {
  var url  = PropertiesService.getScriptProperties().getProperty('WEBAPP_URL');
  var link = url + '?token=' + dados.token;
  var lista = pendentes.map(function(p) { return '• ' + p; }).join('\n');

  MailApp.sendEmail({
    to:      dados.email,
    subject: 'BRASAS – Documentos pendentes para sua pré-admissão',
    body:    'Olá, ' + dados.nomeCompleto + '!\n\n' +
             'Recebemos seu formulário de pré-admissão. Porém, os seguintes documentos ainda estão pendentes:\n\n' +
             lista + '\n\n' +
             'Acesse o mesmo link abaixo para completar o envio:\n' +
             link + '\n\n' +
             'Em caso de dúvidas: dp@brasas.com\n\n' +
             'Equipe BRASAS DP'
  });
}

// ── Drive ─────────────────────────────────────────────────────────────────────

function compartilharPastaComDiretor(pasta, unidadeNome) {
  var emails = EMAILS_DIRETORES[unidadeNome] || [];
  emails.forEach(function(email) {
    try { pasta.addEditor(email); } catch(e) { Logger.log('Share error ' + email + ': ' + e); }
  });
}

// ── Erro ─────────────────────────────────────────────────────────────────────

function renderErroPagina(mensagem) {
  var html = '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>BRASAS – Acesso Inválido</title>' +
    '<style>*{box-sizing:border-box;margin:0;padding:0}' +
    'body{font-family:Segoe UI,Arial,sans-serif;background:#f0f2f5;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}' +
    '.card{background:#fff;border-radius:12px;padding:40px 32px;max-width:440px;width:100%;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.1)}' +
    '.icone{font-size:48px;margin-bottom:16px}h2{color:#c62828;font-size:20px;margin-bottom:12px}' +
    'p{color:#555;line-height:1.65;font-size:15px}</style></head>' +
    '<body><div class="card"><div class="icone">⚠️</div>' +
    '<h2>Acesso Inválido</h2><p>' + mensagem + '</p></div></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('BRASAS – Acesso Inválido');
}

// ── Contratos e Assinaturas ───────────────────────────────────────────────────

function _isDocente(cargo) {
  return /instrutor|professor|teacher/i.test(cargo || '');
}

function _somarDias(dataStr, dias) {
  var partes = String(dataStr || '').split('/');
  if (partes.length !== 3) return dataStr;
  var d = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
  d.setDate(d.getDate() + dias);
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd/MM/yyyy');
}

function getTokenDados(token) {
  var sh   = getTokenSheet();
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(token).trim()) {
      return {
        token:         token,
        candidato:     String(data[i][1] || ''),
        unidadeNome:   String(data[i][2] || ''),
        solicitacaoId: String(data[i][7] || '')
      };
    }
  }
  return null;
}

function getDadosParaContrato(token) {
  var tokenRec = getTokenDados(token);
  if (!tokenRec) return { erro: 'Token não encontrado.' };

  var enviosSh   = getEnviosSheet();
  var enviosData = enviosSh.getDataRange().getValues();
  var envio      = null;
  for (var i = 1; i < enviosData.length; i++) {
    if (String(enviosData[i][0]).trim() === String(token).trim()) {
      envio = { email: String(enviosData[i][3] || ''), pastaUrl: String(enviosData[i][7] || '') };
      break;
    }
  }

  var solDados = {};
  if (tokenRec.solicitacaoId) {
    try { solDados = getSolicitacaoDados(tokenRec.solicitacaoId); } catch(e) {}
  }

  var unidade   = tokenRec.unidadeNome;
  var dadosUnid = UNIDADES_DADOS[unidade] || {};

  return {
    token:        token,
    candidato:    tokenRec.candidato,
    email:        envio ? envio.email    : '',
    pastaUrl:     envio ? envio.pastaUrl : '',
    unidade:      unidade,
    razaoSocial:  UNIDADES[unidade] || unidade,
    cnpj:         dadosUnid.cnpj     || '',
    endereco:     dadosUnid.endereco || '',
    cargo:        solDados.cargo        || '',
    jornada:      solDados.jornada      || '',
    dataAdmissao: solDados.dataAdmissao || ''
  };
}

function criarContratoParaAssinar(dadosContrato, pasta) {
  var templateId = _isDocente(dadosContrato.cargo)
    ? CONTRATO_TEMPLATE_DOCENTE_ID
    : CONTRATO_TEMPLATE_ADMINISTRATIVO_ID;

  var nome  = 'CONTRATO - ' + String(dadosContrato.candidato || '').toUpperCase();
  var copia = DriveApp.getFileById(templateId).makeCopy(nome, pasta);
  var doc   = DocumentApp.openById(copia.getId());
  var body  = doc.getBody();

  var salarioUnidade  = _isDocente(dadosContrato.cargo) ? 'por hora/aula' : 'por mês';
  var dataFimExp      = dadosContrato.dataAdmissao ? _somarDias(dadosContrato.dataAdmissao, 45) : '';
  var dataFimPror     = dadosContrato.dataAdmissao ? _somarDias(dadosContrato.dataAdmissao, 90) : '';

  var vars = {
    '{{NOME_COMPLETO}}':           dadosContrato.candidato      || '',
    '{{CTPS}}':                    dadosContrato.ctps           || '',
    '{{RAZAO_SOCIAL}}':            dadosContrato.razaoSocial    || '',
    '{{CNPJ}}':                    dadosContrato.cnpj           || '',
    '{{ENDERECO_EMPRESA}}':        dadosContrato.endereco       || '',
    '{{CARGO}}':                   dadosContrato.cargo          || '',
    '{{JORNADA}}':                 dadosContrato.jornada        || '',
    '{{SALARIO_VALOR}}':           dadosContrato.salario        || '',
    '{{SALARIO_EXTENSO}}':         dadosContrato.salarioExtenso || '',
    '{{SALARIO_UNIDADE}}':         salarioUnidade,
    '{{DATA_ADMISSAO}}':           dadosContrato.dataAdmissao   || '',
    '{{DATA_FIM_EXPERIENCIA}}':    dataFimExp,
    '{{DATA_INICIO_PRORROGACAO}}': dataFimExp,
    '{{DATA_FIM_PRORROGACAO}}':    dataFimPror
  };

  Object.keys(vars).forEach(function(chave) {
    body.replaceText(chave.replace(/\{/g, '\\{').replace(/\}/g, '\\}'), vars[chave]);
  });

  doc.saveAndClose();
  return copia.getId();
}

function _chamarApiAssinatura(fileId, email, nome) {
  // Endpoint em preview — verificar em https://developers.google.com/workspace/esignature
  var url     = 'https://drivestorage.googleapis.com/v2beta/files/' + fileId + ':createSignatureRequest';
  var payload = JSON.stringify({ signers: [{ email: email, name: nome }] });
  try {
    var resp = UrlFetchApp.fetch(url, {
      method:      'post',
      contentType: 'application/json',
      headers:     { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
      payload:     payload,
      muteHttpExceptions: true
    });
    var code = resp.getResponseCode();
    if (code === 200) {
      var body = JSON.parse(resp.getContentText() || '{}');
      return (body.name || '').split('/').pop() || null;
    }
    Logger.log('eSignature API error ' + code + ': ' + resp.getContentText());
    return null;
  } catch (e) {
    Logger.log('_chamarApiAssinatura: ' + e.toString());
    return null;
  }
}

function gerarEEnviarContrato(token, ctps, salario, salarioExtenso, cargo, jornada) {
  try {
    var dadosBase = getDadosParaContrato(token);
    if (dadosBase.erro) return { sucesso: false, erro: dadosBase.erro };

    var pastaMatch = String(dadosBase.pastaUrl || '').match(/folders\/([a-zA-Z0-9_-]+)/);
    if (!pastaMatch) return { sucesso: false, erro: 'Pasta do candidato não encontrada.' };
    var pasta = DriveApp.getFolderById(pastaMatch[1]);

    var dadosContrato = {
      candidato:      dadosBase.candidato,
      ctps:           ctps,
      razaoSocial:    dadosBase.razaoSocial,
      cnpj:           dadosBase.cnpj,
      endereco:       dadosBase.endereco,
      cargo:          cargo  || dadosBase.cargo,
      jornada:        jornada || dadosBase.jornada,
      salario:        salario,
      salarioExtenso: salarioExtenso,
      dataAdmissao:   dadosBase.dataAdmissao
    };

    var contratoId  = criarContratoParaAssinar(dadosContrato, pasta);
    var contratoUrl = DriveApp.getFileById(contratoId).getUrl();
    var requestId   = _chamarApiAssinatura(contratoId, dadosBase.email, dadosBase.candidato);

    var sh = getAssinaturasSheet();
    sh.appendRow([
      token,
      dadosBase.candidato,
      dadosBase.email,
      dadosBase.unidade,
      requestId || '',
      contratoId,
      requestId ? 'Pendente' : 'Erro API',
      new Date(),
      ''
    ]);

    return { sucesso: true, contratoUrl: contratoUrl, requestId: requestId };
  } catch (e) {
    Logger.log('gerarEEnviarContrato: ' + e.toString());
    return { sucesso: false, erro: e.message };
  }
}

function verificarStatusAssinaturas() {
  var sh         = getAssinaturasSheet();
  var data       = sh.getDataRange().getValues();
  var oauthToken = ScriptApp.getOAuthToken();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][6] || '').trim() !== 'Pendente') continue;
    var requestId = String(data[i][4] || '').trim();
    var token     = String(data[i][0] || '').trim();
    if (!requestId) continue;

    try {
      var url  = 'https://drivestorage.googleapis.com/v2beta/signatureRequests/' + requestId;
      var resp = UrlFetchApp.fetch(url, {
        method:  'get',
        headers: { Authorization: 'Bearer ' + oauthToken },
        muteHttpExceptions: true
      });
      if (resp.getResponseCode() !== 200) continue;
      var body = JSON.parse(resp.getContentText() || '{}');

      if (String(body.state || '').toUpperCase() === 'COMPLETE') {
        sh.getRange(i + 1, 7).setValue('Assinado');
        sh.getRange(i + 1, 9).setValue(new Date());
        marcarTokenUsado(token);
        MailApp.sendEmail({
          to:      'dp@brasas.com',
          subject: 'BRASAS – Contrato assinado: ' + String(data[i][1] || ''),
          body:    'O contrato de ' + String(data[i][1] || '') + ' (' + String(data[i][3] || '') +
                   ') foi assinado digitalmente.\n\nID do contrato: ' + String(data[i][5] || '') +
                   '\n\nEquipe BRASAS DP'
        });
      }
    } catch (e) {
      Logger.log('verificarStatusAssinaturas[' + requestId + ']: ' + e.toString());
    }
  }
}

function reenviarPedidoAssinatura(token) {
  try {
    var sh   = getAssinaturasSheet();
    var data = sh.getDataRange().getValues();
    var row  = -1;
    var rec  = null;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(token).trim()) {
        row = i + 1; rec = data[i]; break;
      }
    }
    if (!rec) return { sucesso: false, erro: 'Registro de assinatura não encontrado.' };

    var fileId = String(rec[5] || '').trim();
    var email  = String(rec[2] || '').trim();
    var nome   = String(rec[1] || '').trim();
    if (!fileId) return { sucesso: false, erro: 'ID do contrato não encontrado.' };

    var requestId = _chamarApiAssinatura(fileId, email, nome);
    sh.getRange(row, 5).setValue(requestId || '');
    sh.getRange(row, 7).setValue(requestId ? 'Pendente' : 'Erro API');
    sh.getRange(row, 8).setValue(new Date());
    return requestId ? { sucesso: true } : { sucesso: false, erro: 'Erro ao comunicar com API de assinatura.' };
  } catch (e) {
    Logger.log('reenviarPedidoAssinatura: ' + e.toString());
    return { sucesso: false, erro: e.message };
  }
}

function listarContratos() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_TOKENS_ID');
  if (!id) return [];
  var ss;
  try { ss = SpreadsheetApp.openById(id); } catch(e) { return []; }
  var sh = ss.getSheetByName('Assinaturas');
  if (!sh || sh.getLastRow() < 2) return [];

  var data   = sh.getDataRange().getValues();
  var tz     = Session.getScriptTimeZone();
  var result = [];

  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!String(r[0]).trim()) continue;
    var cId = String(r[5] || '').trim();
    result.push({
      token:       String(r[0] || ''),
      candidato:   String(r[1] || ''),
      email:       String(r[2] || ''),
      unidade:     String(r[3] || ''),
      requestId:   String(r[4] || ''),
      contratoId:  cId,
      contratoUrl: cId ? 'https://docs.google.com/document/d/' + cId + '/edit' : '',
      status:      String(r[6] || ''),
      enviadoEm:   r[7] instanceof Date ? Utilities.formatDate(r[7], tz, 'dd/MM/yyyy HH:mm') : String(r[7] || ''),
      assinadoEm:  r[8] instanceof Date ? Utilities.formatDate(r[8], tz, 'dd/MM/yyyy HH:mm') : String(r[8] || '')
    });
  }
  return result.reverse();
}

// ── PDF ───────────────────────────────────────────────────────────────────────

function criarPdf(dados, pasta, solDados) {
  solDados = solDados || {};
  var nome = 'FORMULARIO PRE-ADMISSAO - ' + dados.nomeCompleto.toUpperCase();
  var doc = DocumentApp.create(nome);
  var b = doc.getBody();
  b.setMarginTop(36).setMarginBottom(36).setMarginLeft(54).setMarginRight(54);

  var h1 = b.appendParagraph('FORMULÁRIO DE PRÉ-ADMISSÃO');
  h1.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  h1.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  h1.editAsText().setForegroundColor('#1a237e');

  var sub = b.appendParagraph('BRASAS English Course');
  sub.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  sub.editAsText().setItalic(true).setFontSize(12);

  var dt = b.appendParagraph(
    'Preenchido em: ' +
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm')
  );
  dt.editAsText().setFontSize(10).setItalic(true).setForegroundColor('#777777');

  _sec(b, '1. DADOS PESSOAIS');
  _fld(b, 'E-mail', dados.email);
  _fld(b, 'Nome Completo', dados.nomeCompleto);
  _fld(b, 'CPF', dados.cpf);
  _fld(b, 'Data de Nascimento', dados.dataNascimento);
  _fld(b, 'Telefone', dados.telefone);
  _fld(b, 'Unidade', dados.nomeUnidade || dados.unidade);

  _sec(b, '2. DADOS DO CARGO');
  _fld(b, 'Cargo', solDados.cargo);
  _fld(b, 'Jornada de Trabalho', solDados.jornada);
  _fld(b, 'Data de Admissão', solDados.dataAdmissao);

  _sec(b, '3. DADOS BANCÁRIOS');
  _fld(b, 'Possui conta no Itaú', dados.contaItau);

  _sec(b, '4. VALE TRANSPORTE');
  _fld(b, 'Necessita de Vale Transporte', dados.valeTransporte);
  if (dados.valeTransporte === 'Sim') {
    _fld(b, 'Possui Bilhete Único / JAÉ', dados.bilheteUnico);
    _fld(b, 'CEP', dados.cepOrigem);
    _fld(b, 'Rua e Número', dados.ruaNumeroOrigem);
    _fld(b, 'Bairro', dados.bairroOrigem);
    _fld(b, 'Modal de Transporte', dados.modalTransporte);
    _fld(b, 'Conduções por Dia', dados.qtdConducoes);
  }

  _sec(b, '5. DOCUMENTOS');
  var enviados = (dados.documentos || []).filter(function(d) { return !!d.base64; });
  if (enviados.length > 0) {
    b.appendParagraph('Arquivos enviados:').editAsText().setBold(true).setFontSize(11);
    enviados.forEach(function(d) {
      b.appendParagraph('  ✓ ' + d.rotulo).editAsText().setFontSize(11).setForegroundColor('#2e7d32');
    });
  } else {
    b.appendParagraph('Nenhum arquivo enviado.').editAsText().setFontSize(11).setItalic(true);
  }

  doc.saveAndClose();
  var arq = DriveApp.getFileById(doc.getId());
  pasta.createFile(arq.getAs('application/pdf').setName(nome + '.pdf'));
  arq.setTrashed(true);
}

function _sec(b, titulo) {
  b.appendParagraph('');
  var p = b.appendParagraph(titulo);
  p.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  p.editAsText().setForegroundColor('#1a237e');
}

function _fld(b, rotulo, valor) {
  var v = (valor && String(valor).trim()) ? String(valor) : '—';
  var p = b.appendParagraph(rotulo + ': ' + v);
  p.editAsText().setFontSize(11).setBold(0, rotulo.length + 1, true);
}
