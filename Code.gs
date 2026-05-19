const PASTA_PAI_ID = '1IuU9YLh4kiXg1p-xgNiZruUL9ddnD345';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Formulário de Pré-Admissão – BRASAS')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function processarFormulario(dados) {
  try {
    var pastaPai = DriveApp.getFolderById(PASTA_PAI_ID);
    var nomePasta = dados.nomeCompleto + ' - ' + dados.unidade;
    var novaPasta = pastaPai.createFolder(nomePasta);

    (dados.documentos || []).forEach(function (doc) {
      if (doc.base64) {
        novaPasta.createFile(
          Utilities.newBlob(
            Utilities.base64Decode(doc.base64),
            doc.tipo || 'application/octet-stream',
            doc.nome
          )
        );
      }
    });

    criarPdf(dados, novaPasta);
    return { sucesso: true, urlPasta: novaPasta.getUrl() };
  } catch (e) {
    Logger.log(e.toString());
    return { sucesso: false, erro: e.message };
  }
}

function criarPdf(dados, pasta) {
  var nome = 'Formulario Pre-Admissao - ' + dados.nomeCompleto;
  var doc = DocumentApp.create(nome);
  var b = doc.getBody();
  b.setMarginTop(36).setMarginBottom(36).setMarginLeft(54).setMarginRight(54);

  // Título
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

  // 1. Dados Pessoais
  _sec(b, '1. DADOS PESSOAIS');
  _fld(b, 'E-mail', dados.email);
  _fld(b, 'Nome Completo', dados.nomeCompleto);
  _fld(b, 'CPF', dados.cpf);
  _fld(b, 'Data de Nascimento', dados.dataNascimento);
  _fld(b, 'Telefone', dados.telefone);
  _fld(b, 'Unidade', dados.unidade);

  // 2. Dados Bancários
  _sec(b, '2. DADOS BANCÁRIOS');
  _fld(b, 'Possui conta no Itaú', dados.contaItau);

  // 3. Vale Transporte
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

  // 4. Documentos
  _sec(b, '4. DOCUMENTOS');
  if (dados.numPisPasep) _fld(b, 'Nº PIS/PASEP', dados.numPisPasep);
  if (dados.numReservista) _fld(b, 'Nº Certificado de Reservista', dados.numReservista);

  var enviados = (dados.documentos || []).filter(function (d) { return !!d.base64; });
  if (enviados.length > 0) {
    b.appendParagraph('Arquivos enviados:').editAsText().setBold(true).setFontSize(11);
    enviados.forEach(function (d) {
      b.appendParagraph('  ✓ ' + d.rotulo)
        .editAsText().setFontSize(11).setForegroundColor('#2e7d32');
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
