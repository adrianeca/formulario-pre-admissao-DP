const PASTA_PAI_ID = '1IuU9YLh4kiXg1p-xgNiZruUL9ddnD345';

const UNIDADES = {
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

// ── Setup (executar UMA VEZ após implantar o Web App) ─────────────────────────

function inicializar() {
  var url = ScriptApp.getService().getUrl();
  if (!url) {
    Logger.log('❌ Script não implantado como Web App. Implante primeiro e execute inicializar() novamente.');
    return;
  }

  PropertiesService.getScriptProperties().setProperty('WEBAPP_URL', url);
  var sh = getTokenSheet();

  // Fórmula automática na coluna D (Link)
  sh.getRange('D2').setFormula(
    '=ARRAYFORMULA(SE(A2:A<>"";"' + url + '?token="&A2:A;""))'
  );

  Logger.log('✅ Configuração concluída!');
  Logger.log('📊 Planilha de tokens: ' + sh.getParent().getUrl());
  Logger.log('🔗 URL do formulário: ' + url);
}

// ── Roteamento principal ──────────────────────────────────────────────────────

function doGet(e) {
  var p = (e && e.parameter) ? e.parameter : {};

  if (!p.token) {
    return renderErroPagina('Acesso inválido. Solicite um link personalizado ao setor de DP.');
  }

  var td = validarToken(p.token);
  if (!td.valido) {
    var msg = td.usado
      ? 'Este link já foi utilizado. Entre em contato com dp@brasas.com.'
      : 'Link inválido. Entre em contato com dp@brasas.com.';
    return renderErroPagina(msg);
  }

  var tmpl = HtmlService.createTemplateFromFile('Index');
  tmpl.TOKEN        = td.token;
  tmpl.UNIDADE_ID   = td.unidadeId;
  tmpl.UNIDADE_NOME = td.unidadeNome;

  return tmpl.evaluate()
    .setTitle('Formulário de Pré-Admissão – BRASAS')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── Processamento do formulário ───────────────────────────────────────────────

function processarFormulario(dados) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var tokenCheck = validarToken(dados.token);
    if (!tokenCheck.valido) {
      return { sucesso: false, erro: 'Link inválido ou já utilizado. Recarregue a página.' };
    }

    marcarTokenUsado(dados.token);

    var pastaPai = DriveApp.getFolderById(PASTA_PAI_ID);

    var nomeUnidade = (dados.nomeUnidade || dados.unidade).toUpperCase();
    var pastaUnidade;
    var it = pastaPai.getFoldersByName(nomeUnidade);
    pastaUnidade = it.hasNext() ? it.next() : pastaPai.createFolder(nomeUnidade);

    var novaPasta = pastaUnidade.createFolder(dados.nomeCompleto.toUpperCase());

    (dados.documentos || []).forEach(function (doc) {
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

    criarPdf(dados, novaPasta);
    return { sucesso: true };
  } catch (e) {
    Logger.log(e.toString());
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

    // Cabeçalhos
    sh.getRange(1, 1, 1, 6).setValues([['ID / Token', 'Candidato', 'Unidade', 'Link para enviar', 'Usado', 'Usado em']]);
    sh.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#1a237e').setFontColor('#ffffff');

    // Larguras
    sh.setColumnWidth(1, 130).setColumnWidth(2, 200).setColumnWidth(3, 160)
      .setColumnWidth(4, 480).setColumnWidth(5, 80).setColumnWidth(6, 140);

    sh.setFrozenRows(1);

    // Dropdown de unidades na coluna C
    var opcoes = Object.keys(UNIDADES).sort();
    sh.getRange('C2:C1000').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(opcoes, true)
        .setAllowInvalid(false)
        .build()
    );

    // Proteger colunas automáticas com aviso
    sh.getRange('D1:F1000').protect()
      .setDescription('Preenchido automaticamente — não editar')
      .setWarningOnly(true);
  }
  return ss.getSheetByName('Tokens');
}

function validarToken(token) {
  if (!token) return { valido: false, usado: false };
  var sh = getTokenSheet();
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(token).trim()) {
      if (data[i][4] === true) return { valido: false, usado: true };
      var unidadeNome = String(data[i][2]);
      var unidadeId   = UNIDADES[unidadeNome] || unidadeNome;
      return { valido: true, token: token, unidadeId: unidadeId, unidadeNome: unidadeNome };
    }
  }
  return { valido: false, usado: false };
}

function marcarTokenUsado(token) {
  var sh = getTokenSheet();
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(token).trim()) {
      sh.getRange(i + 1, 5).setValue(true);
      sh.getRange(i + 1, 6).setValue(new Date());
      return;
    }
  }
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

// ── PDF ───────────────────────────────────────────────────────────────────────

function criarPdf(dados, pasta) {
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

  _sec(b, '2. DADOS BANCÁRIOS');
  _fld(b, 'Possui conta no Itaú', dados.contaItau);

  _sec(b, '3. VALE TRANSPORTE');
  _fld(b, 'Necessita de Vale Transporte', dados.valeTransporte);
  if (dados.valeTransporte === 'Sim') {
    _fld(b, 'Possui Bilhete Único / JAÉ', dados.bilheteUnico);
    _fld(b, 'CEP', dados.cepOrigem);
    _fld(b, 'Rua e Número', dados.ruaNumeroOrigem);
    _fld(b, 'Bairro', dados.bairroOrigem);
    _fld(b, 'Modal de Transporte', dados.modalTransporte);
    _fld(b, 'Conduções por Dia', dados.qtdConducoes);
  }

  _sec(b, '4. DOCUMENTOS');
  if (dados.numPisPasep)   _fld(b, 'Nº PIS/PASEP', dados.numPisPasep);
  if (dados.numReservista) _fld(b, 'Nº Certificado de Reservista', dados.numReservista);

  var enviados = (dados.documentos || []).filter(function (d) { return !!d.base64; });
  if (enviados.length > 0) {
    b.appendParagraph('Arquivos enviados:').editAsText().setBold(true).setFontSize(11);
    enviados.forEach(function (d) {
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
