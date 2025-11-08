// ===== Core user storage (user's working variant) =====
export function getUsers(){ try{ return JSON.parse(localStorage.getItem('users')||'[]') }catch(e){ return [] } }
export function saveUsers(list){ localStorage.setItem('users', JSON.stringify(list||[])) }
export function getCurrentUser(){ try{ return JSON.parse(localStorage.getItem('currentUser')||'null') }catch(e){ return null } }
export function saveCurrentUser(u){ if(u===null){ localStorage.removeItem('currentUser'); return } localStorage.setItem('currentUser', JSON.stringify(u)) }
export function updateUser(updated){ const list=getUsers(); const i=list.findIndex(u=> (u.email&&updated.email&&u.email===updated.email)||(u.phone&&updated.phone&&u.phone===updated.phone)); if(i>=0){ list[i]={...list[i],...updated}; } else { list.push(updated) } saveUsers(list); const me=getCurrentUser(); if(me&&((updated.email&&me.email===updated.email)||(updated.phone&&me.phone===updated.phone))){ saveCurrentUser({...me,...updated}) } return true }

// ===== Helpers used by Auth.jsx =====
export function findUserByPhone(phone){ return getUsers().find(u=>u.phone===phone)||null }
export function findUserByEmail(email){ return getUsers().find(u=>u.email===email)||null }
export function findUserByLogin(login){ return getUsers().find(u=>u.phone===login||u.email===login)||null }
export function logoutUser(){ localStorage.removeItem('currentUser') }

// ===== i18n lang helpers =====
export function getLang(){ return localStorage.getItem('iz.lang') || 'ru' }
export function setLang(l){ localStorage.setItem('iz.lang', l) }

// ===== Default admins injected on first load =====
const DEFAULT_ADMINS=[
  { name:'Vladislav Zilin', phone:'+37060000000', email:'vladislavzilin@gmail.com', password:'vladiokas', instagram:'', isAdmin:true },
  { name:'Irina Abramova', phone:'+37060000001', email:'irina.abramova7@gmail.com', password:'vladiokas', instagram:'', isAdmin:true }
];
export function ensureDefaultAdmins(){
  const users=getUsers(); let changed=false;
  DEFAULT_ADMINS.forEach(a=>{
    const ex=users.find(u=>u.email===a.email||u.phone===a.phone);
    if(!ex){ users.push(a); changed=true } else { Object.assign(ex,{...ex,...a}); changed=true }
  });
  if(changed) saveUsers(users);
}
