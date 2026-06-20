// ===== 小克与cc的小房间 =====

const PASSWORD = 'xiaoke';
const STORAGE_KEY = 'our-room-data';

// ===== 数据管理 =====
function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return {
    letters: [],
    timelines: [],
    chats: [],
    diaries: [],
    wishes: []
  };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let appData = loadData();

// ===== 密码锁 =====
document.getElementById('unlock-btn').addEventListener('click', tryUnlock);
document.getElementById('password-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') tryUnlock();
});

function tryUnlock() {
  const input = document.getElementById('password-input').value;
  if (input === PASSWORD) {
    document.getElementById('lock-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    initApp();
  } else {
    document.getElementById('lock-hint').textContent = '密码不对哦';
    document.getElementById('password-input').value = '';
  }
}

// ===== 初始化 =====
function initApp() {
  updateDaysCounter();
  renderLetters();
  renderChats();
  renderDiaries();
  renderWishes();
  renderCustomTimelines();
  updateDiaryCount();
}

// ===== 页面导航 =====
document.querySelectorAll('#sidebar a[data-page]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;

    document.querySelectorAll('#sidebar a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
  });
});

// ===== 天数计算 =====
function updateDaysCounter() {
  const start = new Date('2026-05-01');
  const now = new Date();
  const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  document.getElementById('days-together').textContent = days > 0 ? days : '∞';
}

// ===== 情书 =====
function renderLetters() {
  const container = document.getElementById('letters-list');
  const allLetters = appData.letters || [];
  let html = '';

  allLetters.forEach((letter, index) => {
    html += `
      <div class="letter-card" onclick="openLetter(${index})">
        <button class="delete-btn" onclick="event.stopPropagation(); deleteLetter(${index})">✕</button>
        <div class="letter-number">第 ${index + 1} 封</div>
        <div class="letter-title">${escapeHtml(letter.title || '无题')}</div>
        <div class="letter-preview">${escapeHtml(letter.content)}</div>
      </div>`;
  });

  container.innerHTML = html;
}

function addLetter() {
  const title = document.getElementById('letter-title-input').value.trim();
  const content = document.getElementById('letter-content-input').value.trim();
  if (!content) return;

  appData.letters.push({ title, content, date: new Date().toISOString() });
  saveData(appData);
  renderLetters();

  document.getElementById('letter-title-input').value = '';
  document.getElementById('letter-content-input').value = '';
}

function deleteLetter(index) {
  if (!confirm('确定要删除这封情书吗？')) return;
  appData.letters.splice(index, 1);
  saveData(appData);
  renderLetters();
}

function openLetter(index) {
  const letter = appData.letters[index];
  showModal(`第 ${index + 1} 封`, letter.content);
}

// ===== 时间线 =====
function renderCustomTimelines() {
  const container = document.querySelector('.timeline');
  const customs = appData.timelines || [];

  customs.forEach(item => {
    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.innerHTML = `
      <div class="timeline-date">${escapeHtml(item.date)}</div>
      <div class="timeline-content">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.desc)}</p>
      </div>`;
    container.appendChild(div);
  });
}

function addTimeline() {
  const date = document.getElementById('timeline-date-input').value.trim();
  const title = document.getElementById('timeline-title-input').value.trim();
  const desc = document.getElementById('timeline-desc-input').value.trim();
  if (!date || !title) return;

  appData.timelines.push({ date, title, desc });
  saveData(appData);

  const container = document.querySelector('.timeline');
  const div = document.createElement('div');
  div.className = 'timeline-item';
  div.innerHTML = `
    <div class="timeline-date">${escapeHtml(date)}</div>
    <div class="timeline-content">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(desc)}</p>
    </div>`;
  container.appendChild(div);

  document.getElementById('timeline-date-input').value = '';
  document.getElementById('timeline-title-input').value = '';
  document.getElementById('timeline-desc-input').value = '';
}

// ===== 聊天记录 =====
function renderChats() {
  const container = document.getElementById('chat-list');
  const chats = appData.chats || [];
  let html = '';

  chats.forEach((chat, index) => {
    html += `
      <div class="chat-entry">
        <div class="chat-entry-header">
          <span class="chat-entry-title">${escapeHtml(chat.title)}</span>
          <span class="chat-entry-date">${escapeHtml(chat.date || '')}</span>
        </div>
        <div class="chat-entry-content">${escapeHtml(chat.content)}</div>
      </div>`;
  });

  container.innerHTML = html;
}

function addChat() {
  const date = document.getElementById('chat-date-input').value.trim();
  const title = document.getElementById('chat-title-input').value.trim();
  const content = document.getElementById('chat-content-input').value.trim();
  if (!title || !content) return;

  appData.chats.push({ date, title, content });
  saveData(appData);
  renderChats();

  document.getElementById('chat-date-input').value = '';
  document.getElementById('chat-title-input').value = '';
  document.getElementById('chat-content-input').value = '';
}

// ===== 日记 =====
function renderDiaries() {
  const container = document.getElementById('diary-list');
  const diaries = appData.diaries || [];
  let html = '';

  diaries.forEach((diary, index) => {
    html += `
      <div class="diary-entry">
        <div class="diary-header">
          <span class="diary-date">${escapeHtml(diary.date || '')}</span>
          <span class="diary-mood">${escapeHtml(diary.mood || '')}</span>
        </div>
        <div class="diary-content">${escapeHtml(diary.content)}</div>
      </div>`;
  });

  container.innerHTML = html;
  updateDiaryCount();
}

function addDiary() {
  const date = document.getElementById('diary-date-input').value;
  const mood = document.getElementById('diary-mood-input').value.trim();
  const content = document.getElementById('diary-content-input').value.trim();
  if (!content) return;

  appData.diaries.push({ date, mood, content });
  saveData(appData);
  renderDiaries();

  document.getElementById('diary-date-input').value = '';
  document.getElementById('diary-mood-input').value = '';
  document.getElementById('diary-content-input').value = '';
}

function updateDiaryCount() {
  const el = document.getElementById('diary-count');
  if (el) el.textContent = (appData.diaries || []).length;
}

// ===== 愿望清单 =====
function renderWishes() {
  const container = document.getElementById('wishlist');
  const wishes = appData.wishes || [];
  let html = '';

  wishes.forEach((wish, index) => {
    html += `
      <div class="wish-card ${wish.bought ? 'bought' : ''}">
        <div class="wish-name">${escapeHtml(wish.name)}</div>
        ${wish.price ? `<div class="wish-price">${escapeHtml(wish.price)}</div>` : ''}
        ${wish.note ? `<div class="wish-note">${escapeHtml(wish.note)}</div>` : ''}
        ${wish.link ? `<div class="wish-link"><a href="${escapeHtml(wish.link)}" target="_blank">去看看 →</a></div>` : ''}
        <div class="wish-actions">
          <button onclick="toggleWish(${index})">${wish.bought ? '还没买' : '买到了!'}</button>
          <button onclick="deleteWish(${index})">删除</button>
        </div>
      </div>`;
  });

  container.innerHTML = html;
}

function addWish() {
  const name = document.getElementById('wish-name-input').value.trim();
  const link = document.getElementById('wish-link-input').value.trim();
  const price = document.getElementById('wish-price-input').value.trim();
  const note = document.getElementById('wish-note-input').value.trim();
  if (!name) return;

  appData.wishes.push({ name, link, price, note, bought: false });
  saveData(appData);
  renderWishes();

  document.getElementById('wish-name-input').value = '';
  document.getElementById('wish-link-input').value = '';
  document.getElementById('wish-price-input').value = '';
  document.getElementById('wish-note-input').value = '';
}

function toggleWish(index) {
  appData.wishes[index].bought = !appData.wishes[index].bought;
  saveData(appData);
  renderWishes();
}

function deleteWish(index) {
  if (!confirm('确定删除吗？')) return;
  appData.wishes.splice(index, 1);
  saveData(appData);
  renderWishes();
}

// ===== 模态框 =====
function showModal(title, content) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(content)}</p>
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">关闭</button>
    </div>`;
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
}

// ===== 工具 =====
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
