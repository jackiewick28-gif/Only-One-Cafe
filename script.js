let mode = 'voucher', seconds = 0, tick = null, up = 0, down = 0, name = '';

function $(id) { return document.getElementById(id); }

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

function pad(n) { return String(n).padStart(2, '0'); }

function fmtTime(s) {
  return pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60);
}

function fmtBytes(k) {
  return k >= 1024 ? (k / 1024).toFixed(1) + ' MiB' : k.toFixed(1) + ' KiB';
}

function setTab(m) {
  mode = m;
  $('tabV').classList.toggle('on', m === 'voucher');
  $('tabM').classList.toggle('on', m === 'member');
  $('rowPass').style.display = m === 'member' ? 'flex' : 'none';
  $('user').placeholder = m === 'member' ? 'Username' : 'Voucher Code';
  $('hintText').textContent = m === 'member'
    ? 'Enter your username and password, then click Connect.'
    : 'Enter your voucher code, then click Connect.';
  $('err').textContent = '';
}

function trial() {
  $('user').value = 'trial' + Math.floor(1000 + Math.random() * 9000);
  if (mode === 'member') { $('pass').value = 'trial'; }
  start($('user').value);
}

function doLogin() {
  const u = $('user').value.trim();
  if (!u) {
    $('err').textContent = mode === 'member' ? 'Please enter your username.' : 'Please enter a voucher code.';
    return;
  }
  if (mode === 'member' && !$('pass').value) {
    $('err').textContent = 'Please enter your password.';
    return;
  }
  start(u);
}

function start(u) {
  name = u; seconds = 0; up = 0; down = 0;
  $('err').textContent = '';
  $('sUser').textContent = u;
  const d = new Date(Date.now() + 24 * 3600 * 1000);
  $('expired').textContent = d.toLocaleString();
  show('status');
  clearInterval(tick);
  tick = setInterval(() => {
    seconds++;
    up += Math.random() * 3;
    down += Math.random() * 5;
    $('timer').textContent = fmtTime(seconds);
    $('bytes').textContent = fmtBytes(up) + ' / ' + fmtBytes(down);
  }, 1000);
}

function logout() {
  clearInterval(tick);
  $('lUser').textContent = name;
  $('lTime').textContent = fmtTime(seconds);
  $('lBytes').textContent = fmtBytes(up) + ' / ' + fmtBytes(down);
  $('user').value = '';
  $('pass').value = '';
  show('logout');
}