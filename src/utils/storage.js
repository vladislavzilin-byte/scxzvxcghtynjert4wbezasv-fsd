// ======================
// USERS
// ======================
export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('users') || '[]');
  } catch (e) {
    return [];
  }
}

export function saveUsers(list) {
  localStorage.setItem('users', JSON.stringify(list || []));
}

// ======================
// CURRENT USER
// ======================
export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  } catch (e) {
    return null;
  }
}

export function saveCurrentUser(u) {
  if (u === null) {
    localStorage.removeItem('currentUser');
    return;
  }
  localStorage.setItem('currentUser', JSON.stringify(u));
}

// ======================
// UPDATE USER
// ======================
export function updateUser(updated) {
  const list = getUsers();
  const i = list.findIndex(u =>
    (u.email && updated.email && u.email === updated.email) ||
    (u.phone && updated.phone && u.phone === updated.phone)
  );

  if (i >= 0) {
    list[i] = { ...list[i], ...updated };
  } else {
    list.push(updated);
  }

  saveUsers(list);

  const me = getCurrentUser();
  if (
    me &&
    ((updated.email && me.email === updated.email) ||
     (updated.phone && me.phone === updated.phone))
  ) {
    saveCurrentUser({ ...me, ...updated });
  }
  return true;
}

// ======================
// FIND HELPERS
// ======================
export function findUserByPhone(phone) {
  return getUsers().find(u => u.phone === phone) || null;
}

export function findUserByEmail(email) {
  return getUsers().find(u => u.email === email) || null;
}

export function findUserByLogin(login) {
  return getUsers().find(u => (u.phone === login || u.email === login)) || null;
}

// ======================
// LOGOUT
// ======================
export function logoutUser() {
  localStorage.removeItem('currentUser');
}

// ======================
// DEFAULT ADMINS + ENSURE
// ======================
const DEFAULT_ADMINS = [
  {
    name: 'Vladislav Zilin',
    phone: '+37060000000',
    email: 'vladislavzilin@gmail.com',
    password: 'vladiokas',
    instagram: '',
    isAdmin: true
  },
  {
    name: 'Irina Abramova',
    phone: '+37060000001',
    email: 'irina.abramova7@gmail.com',
    password: 'vladiokas',
    instagram: '',
    isAdmin: true
  }
];

export function ensureDefaultAdmins() {
  const users = getUsers();
  let changed = false;
  DEFAULT_ADMINS.forEach(admin => {
    const existing = users.find(u => u.email === admin.email || u.phone === admin.phone);
    if (!existing) {
      users.push(admin);
      changed = true;
    } else {
      // keep user data but enforce admin fields
      Object.assign(existing, { ...existing, ...admin });
      changed = true;
    }
  });
  if (changed) saveUsers(users);
}
