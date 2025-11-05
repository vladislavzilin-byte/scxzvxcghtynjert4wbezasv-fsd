export function getUsers(){
  try { return JSON.parse(localStorage.getItem('users')||'[]') } catch { return [] }
}
export function saveUsers(list){
  localStorage.setItem('users', JSON.stringify(list||[]))
}
export function getCurrentUser(){
  try { return JSON.parse(localStorage.getItem('currentUser')||'null') } catch { return null }
}
export function saveCurrentUser(u){
  if(u===null){ localStorage.removeItem('currentUser'); return }
  localStorage.setItem('currentUser', JSON.stringify(u))
}
export function updateUser(updated){
  const list = getUsers()
  const idx = list.findIndex(u => (u.email && updated.email && u.email===updated.email) || (u.phone && updated.phone && u.phone===updated.phone))
  if(idx>=0){ list[idx] = { ...list[idx], ...updated }; saveUsers(list); return true }
  list.push(updated); saveUsers(list); return true
}
