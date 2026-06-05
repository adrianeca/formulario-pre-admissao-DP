// ============================================================
//  BRASAS Analytics — Hub
//  Code.gs — Autenticação central via Google Session
// ============================================================

const USERS_SHEET_ID = '1eZPbzhzjhjHoPwMhAW5YvOZgYiAvlTYc07dRan6Lyoc';
const SESSION_HOURS  = 8;

function doGet(e) {
  const email  = Session.getActiveUser().getEmail();
  const p      = (e && e.parameter) ? e.parameter : {};
  const tmpl   = HtmlService.createTemplateFromFile('Index');
  tmpl.userEmail = email || '';
  tmpl.nextUrl   = p.next || '';
  return tmpl.evaluate()
    .setTitle('BRASAS Analytics — Hub')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── Cria sessão usando a identidade Google do usuário atual ───
function createSession() {
  try {
    const email = Session.getActiveUser().getEmail().trim().toLowerCase();
    if (!email) return JSON.stringify({ ok: false, error: 'Conta Google não identificada. Verifique as configurações de publicação.' });

    const user = _findUserByEmail(email);
    if (!user) return JSON.stringify({ ok: false, error: 'Acesso não autorizado para ' + email + '.' });

    const perms = _getRolePermissions(user.role);
    const norm  = s => String(s||'').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    const allowedDashboards = Object.keys(perms)
      .filter(k => k !== 'role' && !k.includes('_') && perms[k])
      .map(k => norm(k));

    if (user.extraDashboards) {
      user.extraDashboards.split(',').map(s => norm(s)).filter(Boolean).forEach(e => {
        if (!allowedDashboards.includes(e)) allowedDashboards.push(e);
      });
    }

    const token = _createSession(user);
    return JSON.stringify({
      ok: true,
      token,
      nome:               user.nome,
      role:               user.role,
      unidade:            user.unidade,
      allowedDashboards,
    });
  } catch (e) {
    return JSON.stringify({ ok: false, error: e.message });
  }
}

// ── Lê permissões da aba ROLES para um role ───────────────────
function _getRolePermissions(role) {
  const ss    = SpreadsheetApp.openById(USERS_SHEET_ID);
  const sheet = ss.getSheetByName('ROLES');
  if (!sheet) return {};
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return {};
  const norm    = s => String(s||'').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  const headers = data[0].map(h => norm(String(h)));
  for (let i = 1; i < data.length; i++) {
    if (norm(data[i][0]) !== norm(role)) continue;
    const perms = {};
    headers.forEach((h, j) => { perms[h] = String(data[i][j]).trim().toUpperCase() === 'TRUE'; });
    return perms;
  }
  return {};
}

// ── Busca usuário na aba USUARIOS ─────────────────────────────
function _findUserByEmail(emailToFind) {
  const ss    = SpreadsheetApp.openById(USERS_SHEET_ID);
  const sheet = ss.getSheetByName('USUARIOS');
  if (!sheet) return null;

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return null;

  const normH = str =>
    String(str || '').trim()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9]/g, '');

  const rawHeaders = values[0].map(normH);

  function findCol(candidates) {
    for (const c of candidates) {
      const i = rawHeaders.findIndex(h => h === c || h.startsWith(c));
      if (i >= 0) return i;
    }
    return -1;
  }

  const idx = {
    email:            findCol(['email']),
    nome:             findCol(['nome', 'name']),
    role:             findCol(['role', 'perfil', 'tipo']),
    unidade:          findCol(['unidade', 'unit']),
    ativo:            findCol(['ativo', 'active']),
    extraDashboards:  findCol(['extradashboards']),
  };

  for (let i = 1; i < values.length; i++) {
    const row      = values[i];
    const rowEmail = String(row[idx.email] || '').trim().toLowerCase();
    if (rowEmail !== emailToFind) continue;

    if (idx.ativo >= 0) {
      const ativoVal = String(row[idx.ativo]).trim().toUpperCase();
      if (ativoVal === 'FALSE') return null;
    }

    return {
      email:            rowEmail,
      nome:             String(row[idx.nome]             || '').trim(),
      role:             String(row[idx.role]             || '').trim(),
      unidade:          String(row[idx.unidade]          || '').trim(),
      extraDashboards:  idx.extraDashboards >= 0 ? String(row[idx.extraDashboards] || '').trim() : '',
    };
  }
  return null;
}

// ── Criação de sessão (aba SESSOES) ───────────────────────────
function _createSession(user) {
  const ss    = SpreadsheetApp.openById(USERS_SHEET_ID);
  let sheet   = ss.getSheetByName('SESSOES');
  if (!sheet) {
    sheet = ss.insertSheet('SESSOES');
    sheet.appendRow(['TOKEN','EMAIL','NOME','ROLE','UNIDADE','CRIADO_EM','EXPIRA_EM']);
  }

  const now  = new Date();
  const data = sheet.getDataRange().getValues();
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][6] && new Date(data[i][6]) < now) sheet.deleteRow(i + 1);
  }

  const token   = Utilities.getUuid();
  const expires = new Date(now.getTime() + SESSION_HOURS * 3600 * 1000);
  sheet.appendRow([token, user.email, user.nome, user.role, user.unidade, now, expires]);

  _logAccess(user, now);
  return token;
}

// ── Log permanente de acessos (aba ACESSOS) ───────────────────
function _logAccess(user, timestamp) {
  const ss    = SpreadsheetApp.openById(USERS_SHEET_ID);
  let sheet   = ss.getSheetByName('ACESSOS');
  if (!sheet) {
    sheet = ss.insertSheet('ACESSOS');
    sheet.appendRow(['EMAIL','NOME','ROLE','UNIDADE','DATA_HORA']);
  }
  sheet.appendRow([user.email, user.nome, user.role, user.unidade, timestamp || new Date()]);
}

// ============================================================
//  Funções do Painel Admin
// ============================================================

function _requireAdmin() {
  const email = Session.getActiveUser().getEmail().trim().toLowerCase();
  const ss    = SpreadsheetApp.openById(USERS_SHEET_ID);
  const sheet = ss.getSheetByName('USUARIOS');
  if (!sheet) throw new Error('Acesso restrito a administradores.');

  const values = sheet.getDataRange().getValues();
  const normH  = s => String(s||'').trim().normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const heads  = values[0].map(normH);
  const iEmail = heads.findIndex(h => h === 'email');
  const iRole  = heads.findIndex(h => h === 'role' || h === 'perfil' || h === 'tipo');

  for (let i = 1; i < values.length; i++) {
    const rowEmail = String(values[i][iEmail]||'').trim().toLowerCase();
    if (rowEmail !== email) continue;
    if (String(values[i][iRole]||'').trim().toLowerCase() !== 'admin')
      throw new Error('Acesso restrito a administradores.');
    return;
  }
  throw new Error('Acesso restrito a administradores.');
}

function getAdminData() {
  try {
    _requireAdmin();
    const ss = SpreadsheetApp.openById(USERS_SHEET_ID);

    const usuSheet  = ss.getSheetByName('USUARIOS');
    const usuData   = usuSheet ? usuSheet.getDataRange().getValues() : [[]];
    const normH     = s => String(s||'').trim().normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
    const usuHeads  = usuData[0].map(normH);
    const uIdx = {
      email:            usuHeads.findIndex(h => h === 'email'),
      nome:             usuHeads.findIndex(h => h === 'nome' || h === 'name'),
      role:             usuHeads.findIndex(h => h === 'role' || h === 'perfil' || h === 'tipo'),
      unidade:          usuHeads.findIndex(h => h === 'unidade' || h === 'unit'),
      ativo:            usuHeads.findIndex(h => h === 'ativo' || h === 'active'),
      extraDashboards:  usuHeads.findIndex(h => h === 'extradashboards'),
    };

    const accSheet = ss.getSheetByName('ACESSOS');
    const lastAccess = {};
    if (accSheet) {
      const accData = accSheet.getDataRange().getValues();
      for (let i = 1; i < accData.length; i++) {
        const em = String(accData[i][0]||'').trim().toLowerCase();
        if (em) lastAccess[em] = accData[i][4];
      }
    }

    const users = [];
    for (let i = 1; i < usuData.length; i++) {
      const r = usuData[i];
      const em = String(r[uIdx.email]||'').trim().toLowerCase();
      if (!em) continue;
      const ativoRaw = uIdx.ativo >= 0 ? String(r[uIdx.ativo]).trim().toUpperCase() : 'TRUE';
      users.push({
        email:            em,
        nome:             String(r[uIdx.nome]    ||'').trim(),
        role:             String(r[uIdx.role]    ||'').trim(),
        unidade:          String(r[uIdx.unidade] ||'').trim(),
        ativo:            ativoRaw !== 'FALSE',
        ultimoAcesso:     lastAccess[em] ? Utilities.formatDate(new Date(lastAccess[em]), Session.getScriptTimeZone(), 'dd/MM HH:mm') : null,
        extraDashboards:  uIdx.extraDashboards >= 0 ? String(r[uIdx.extraDashboards]||'').trim() : '',
      });
    }

    const sesSheet = ss.getSheetByName('SESSOES');
    const now      = new Date();
    const activeSessions = [];
    if (sesSheet) {
      const sesData = sesSheet.getDataRange().getValues();
      for (let i = 1; i < sesData.length; i++) {
        const expira = sesData[i][6] ? new Date(sesData[i][6]) : null;
        if (!expira || expira < now) continue;
        activeSessions.push({
          token:    String(sesData[i][0]),
          email:    String(sesData[i][1]||'').trim().toLowerCase(),
          nome:     String(sesData[i][2]||'').trim(),
          role:     String(sesData[i][3]||'').trim(),
          criadoEm: sesData[i][5] ? Utilities.formatDate(new Date(sesData[i][5]), Session.getScriptTimeZone(), 'HH:mm') : '',
          expiraEm: expira.getTime(),
        });
      }
    }

    const rolesSheet = ss.getSheetByName('ROLES');
    const roles = [];
    if (rolesSheet) {
      const rd = rolesSheet.getDataRange().getValues();
      for (let i = 1; i < rd.length; i++) {
        const r = String(rd[i][0]||'').trim();
        if (r && !roles.includes(r)) roles.push(r);
      }
    }

    const ativos   = users.filter(u => u.ativo).length;
    const inativos = users.length - ativos;

    return JSON.stringify({
      ok: true,
      users,
      activeSessions,
      roles,
      stats: { total: users.length, ativos, inativos, sessionsNow: activeSessions.length },
    });
  } catch(e) {
    return JSON.stringify({ ok: false, error: e.message });
  }
}

function createUser(payload) {
  try {
    _requireAdmin();
    const data = JSON.parse(payload);
    const email = String(data.email||'').trim().toLowerCase();
    if (!email) return JSON.stringify({ ok: false, error: 'E-mail obrigatório.' });

    const ss    = SpreadsheetApp.openById(USERS_SHEET_ID);
    const sheet = ss.getSheetByName('USUARIOS');
    if (!sheet) return JSON.stringify({ ok: false, error: 'Sheet USUARIOS não encontrada.' });

    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][0]||'').trim().toLowerCase() === email)
        return JSON.stringify({ ok: false, error: 'E-mail já cadastrado.' });
    }

    sheet.appendRow([email, String(data.nome||'').trim(), String(data.role||'').trim(), String(data.unidade||'').trim(), true]);
    return JSON.stringify({ ok: true });
  } catch(e) {
    return JSON.stringify({ ok: false, error: e.message });
  }
}

function updateUser(payload) {
  try {
    _requireAdmin();
    const data  = JSON.parse(payload);
    const email = String(data.email||'').trim().toLowerCase();
    if (!email) return JSON.stringify({ ok: false, error: 'E-mail obrigatório.' });

    const adminEmail = Session.getActiveUser().getEmail().trim().toLowerCase();
    if (!data.ativo && email === adminEmail)
      return JSON.stringify({ ok: false, error: 'Você não pode desativar sua própria conta.' });

    const ss    = SpreadsheetApp.openById(USERS_SHEET_ID);
    const sheet = ss.getSheetByName('USUARIOS');
    if (!sheet) return JSON.stringify({ ok: false, error: 'Sheet USUARIOS não encontrada.' });

    const values  = sheet.getDataRange().getValues();
    const normH   = s => String(s||'').trim().normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
    const heads   = values[0].map(normH);
    const iNome   = heads.findIndex(h => h === 'nome' || h === 'name');
    const iRole   = heads.findIndex(h => h === 'role' || h === 'perfil' || h === 'tipo');
    const iUnid   = heads.findIndex(h => h === 'unidade' || h === 'unit');
    const iAtivo  = heads.findIndex(h => h === 'ativo' || h === 'active');
    const iExtra  = heads.findIndex(h => h === 'extradashboards');

    for (let i = 1; i < values.length; i++) {
      if (String(values[i][0]||'').trim().toLowerCase() !== email) continue;
      const row = i + 1;
      if (iNome  >= 0) sheet.getRange(row, iNome  + 1).setValue(String(data.nome            ||'').trim());
      if (iRole  >= 0) sheet.getRange(row, iRole  + 1).setValue(String(data.role            ||'').trim());
      if (iUnid  >= 0) sheet.getRange(row, iUnid  + 1).setValue(String(data.unidade         ||'').trim());
      if (iAtivo >= 0) sheet.getRange(row, iAtivo + 1).setValue(data.ativo !== false);
      if (iExtra >= 0) sheet.getRange(row, iExtra + 1).setValue(String(data.extraDashboards ||'').trim());
      return JSON.stringify({ ok: true });
    }
    return JSON.stringify({ ok: false, error: 'Usuário não encontrado.' });
  } catch(e) {
    return JSON.stringify({ ok: false, error: e.message });
  }
}

function getRolesMatrix() {
  try {
    _requireAdmin();
    const ss    = SpreadsheetApp.openById(USERS_SHEET_ID);
    const sheet = ss.getSheetByName('ROLES');
    if (!sheet) return JSON.stringify({ ok: false, error: 'Sheet ROLES não encontrada.' });
    const data = sheet.getDataRange().getValues();
    if (data.length < 1) return JSON.stringify({ ok: true, roles: [], columns: [] });
    const columns = data[0].slice(1).map(h => String(h).trim()).filter(Boolean);
    const roles   = [];
    for (let i = 1; i < data.length; i++) {
      const name = String(data[i][0] || '').trim();
      if (!name) continue;
      const perms = {};
      columns.forEach((col, j) => { perms[col] = String(data[i][j + 1] || '').trim().toUpperCase() === 'TRUE'; });
      roles.push({ name, perms });
    }
    return JSON.stringify({ ok: true, roles, columns });
  } catch(e) { return JSON.stringify({ ok: false, error: e.message }); }
}

function saveRolePerms(payload) {
  try {
    _requireAdmin();
    const data  = JSON.parse(payload);
    const name  = String(data.name || '').trim();
    if (!name) return JSON.stringify({ ok: false, error: 'Nome obrigatório.' });

    const ss    = SpreadsheetApp.openById(USERS_SHEET_ID);
    const sheet = ss.getSheetByName('ROLES');
    if (!sheet) return JSON.stringify({ ok: false, error: 'Sheet ROLES não encontrada.' });

    const values  = sheet.getDataRange().getValues();
    const headers = values[0];

    if (data.isNew) {
      for (let i = 1; i < values.length; i++) {
        if (String(values[i][0] || '').trim().toLowerCase() === name.toLowerCase())
          return JSON.stringify({ ok: false, error: 'Role já existe.' });
      }
      const newRow = [name];
      for (let j = 1; j < headers.length; j++) {
        const col = String(headers[j]).trim();
        newRow.push(data.perms && data.perms[col] ? 'TRUE' : 'FALSE');
      }
      sheet.appendRow(newRow);
    } else {
      for (let i = 1; i < values.length; i++) {
        if (String(values[i][0] || '').trim().toLowerCase() !== name.toLowerCase()) continue;
        const row = i + 1;
        for (let j = 1; j < headers.length; j++) {
          const col = String(headers[j]).trim();
          sheet.getRange(row, j + 1).setValue(data.perms && data.perms[col] ? 'TRUE' : 'FALSE');
        }
        return JSON.stringify({ ok: true });
      }
      return JSON.stringify({ ok: false, error: 'Role não encontrado.' });
    }
    return JSON.stringify({ ok: true });
  } catch(e) { return JSON.stringify({ ok: false, error: e.message }); }
}

function addPermissionColumn(columnName) {
  try {
    _requireAdmin();
    const name = String(columnName || '').trim();
    if (!name) return JSON.stringify({ ok: false, error: 'Nome obrigatório.' });

    const ss    = SpreadsheetApp.openById(USERS_SHEET_ID);
    const sheet = ss.getSheetByName('ROLES');
    if (!sheet) return JSON.stringify({ ok: false, error: 'Sheet ROLES não encontrada.' });

    const data     = sheet.getDataRange().getValues();
    const existing = data[0].map(h => String(h).trim().toLowerCase());
    if (existing.includes(name.toLowerCase()))
      return JSON.stringify({ ok: false, error: 'Coluna já existe.' });

    const lastCol = data[0].length + 1;
    sheet.getRange(1, lastCol).setValue(name);
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0] || '').trim())
        sheet.getRange(i + 1, lastCol).setValue('FALSE');
    }
    return JSON.stringify({ ok: true });
  } catch(e) { return JSON.stringify({ ok: false, error: e.message }); }
}

function revokeSession(token) {
  try {
    _requireAdmin();
    const ss    = SpreadsheetApp.openById(USERS_SHEET_ID);
    const sheet = ss.getSheetByName('SESSOES');
    if (!sheet) return JSON.stringify({ ok: false, error: 'Sheet SESSOES não encontrada.' });

    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][0]) === String(token)) {
        sheet.deleteRow(i + 1);
        return JSON.stringify({ ok: true });
      }
    }
    return JSON.stringify({ ok: false, error: 'Sessão não encontrada.' });
  } catch(e) {
    return JSON.stringify({ ok: false, error: e.message });
  }
}
