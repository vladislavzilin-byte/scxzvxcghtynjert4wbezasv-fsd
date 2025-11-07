
export function getUsers(){ try{ return JSON.parse(localStorage.getItem('users')||'[]') }catch(e){ return [] } }
export function saveUsers(list){ localStorage.setItem('users', JSON.stringify(list||[])) }
export function getCurrentUser(){ try{ return JSON.parse(localStorage.getItem('currentUser')||'null') }catch(e){ return null } }
export function saveCurrentUser(u){ if(u===null){ localStorage.removeItem('currentUser'); return } localStorage.setItem('currentUser', JSON.stringify(u)) }
export function updateUser(updated){ const list=getUsers(); const i=list.findIndex(u=> (u.email&&updated.email&&u.email===updated.email)||(u.phone&&updated.phone&&u.phone===updated.phone)); if(i>=0){ list[i]={...list[i],...updated}; } else { list.push(updated) } saveUsers(list); const me=getCurrentUser(); if(me&&((updated.email&&me.email===updated.email)||(updated.phone&&me.phone===updated.phone))){ saveCurrentUser({...me,...updated}) } return true }
