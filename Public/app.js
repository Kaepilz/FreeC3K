(function(){
  const loginBtn = document.getElementById('loginBtn');
  const myAvatar = document.getElementById('myAvatar');
  const myName = document.getElementById('myName');
  const usersList = document.getElementById('users');
  const chatHeader = document.getElementById('chatHeader');
  const messagesEl = document.getElementById('messages');
  const sendForm = document.getElementById('sendForm');
  const messageInput = document.getElementById('messageInput');

  let me = null;
  let socket = null;
  let currentChatUser = null;

  function getTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) {
      localStorage.setItem('token', t);
      params.delete('token');
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      history.replaceState({}, '', newUrl);
      return t;
    }
    return null;
  }

  function getToken() {
    return localStorage.getItem('token');
  }

  async function api(path, opts = {}) {
    const t = getToken();
    if (!t) throw new Error('Not logged in');
    opts.headers = opts.headers || {};
    opts.headers['Content-Type'] = 'application/json';
    opts.headers['Authorization'] = 'Bearer ' + t;
    const res = await fetch(path, opts);
    if (res.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Unauthorized');
    }
    return res.json();
  }

  function connectSocket() {
    const t = getToken();
    if (!t) return;
    socket = io({ auth: { token: t } });
    socket.on('connect', () => {
      console.log('socket connected');
    });
    socket.on('message', (m) => {
      if (!currentChatUser) return;
      if (m.sender_id === currentChatUser.id || m.receiver_id === currentChatUser.id) {
        appendMessage(m);
      }
    });
    socket.on('connect_error', (err) => {
      console.error('socket connect error', err.message);
    });
  }

  function appendMessage(m) {
    const div = document.createElement('div');
    div.className = 'msg ' + (m.sender_id === me.id ? 'me' : 'them');
    div.innerText = m.content + '\n' + (new Date(m.created_at).toLocaleString());
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function loadUsers() {
    try {
      const users = await api('/api/users');
      usersList.innerHTML = '';
      users.forEach(u => {
        const li = document.createElement('li');
        li.dataset.id = u.id;
        li.innerHTML = `<img src="${u.avatar_url || ''}" style="width:32px;height:32px;border-radius:16px;margin-right:8px" /> <strong>${u.username}</strong>`;
        li.addEventListener('click', () => openChat(u));
        usersList.appendChild(li);
      });
    } catch (e) {
      console.error('failed to load users', e);
    }
  }

  async function openChat(user) {
    currentChatUser = user;
    chatHeader.innerText = 'Chat with ' + user.username;
    messagesEl.innerHTML = '';
    sendForm.style.display = 'flex';
    try {
      const conv = await api('/api/conversations/' + user.id);
      conv.forEach(appendMessage);
    } catch (e) {
      console.error('failed to load conv', e);
    }
  }

  sendForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!currentChatUser) return alert('Select a user');
    const content = messageInput.value.trim();
    if (!content) return;
    try {
      await api('/api/messages', { method: 'POST', body: JSON.stringify({ to: currentChatUser.id, content }) });
      messageInput.value = '';
    } catch (e) {
      console.error('send failed', e);
    }
  });

  loginBtn.addEventListener('click', (ev) => {
    window.location.href = '/auth/login';
  });

  (async function init() {
    getTokenFromUrl();
    const token = getToken();
    if (!token) {
      myAvatar.style.display = 'none';
      myName.style.display = 'none';
      return;
    }
    try {
      me = await api('/api/me');
      myAvatar.src = me.avatar_url || '';
      myName.innerText = me.username;
      myAvatar.style.display = 'inline-block';
      myName.style.display = 'block';
      connectSocket();
      await loadUsers();
    } catch (e) {
      console.error('Not logged in or failed to initialize', e);
      myAvatar.style.display = 'none';
      myName.style.display = 'none';
    }
  })();
})();
