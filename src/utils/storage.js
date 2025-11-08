export function getUsers(){ try{ return JSON.parse(localStorage.getItem('users')||'[]') }catch(e){ return [] } }
export function saveUsers(list){ localStorage.setItem('users', JSON.stringify(list||[])) }
export function getCurrentUser(){ try{ return JSON.parse(localStorage.getItem('currentUser')||'null') }catch(e){ return null } }
export function saveCurrentUser(u){ if(u===null){ localStorage.removeItem('currentUser'); return } localStorage.setItem('currentUser', JSON.stringify(u)) }
export function findUserByPhone(phone){ return getUsers().find(u=>u.phone===phone)||null }
export function findUserByEmail(email){ return getUsers().find(u=>u.email===email)||null }
export function findUserByLogin(login){ return getUsers().find(u=>u.phone===login||u.email===login)||null }
export function logoutUser(){ localStorage.removeItem('currentUser') }
const ADMINS=[{name:'Vladislav Zilin',phone:'+37060000000',email:'vladislavzilin@gmail.com',password:'vladiokas',instagram:'',isAdmin:true},{name:'Irina Abramova',phone:'+37060000001',email:'irina.abramova7@gmail.com',password:'vladiokas',instagram:'',isAdmin:true}];
export function ensureDefaultAdmins(){ const users=getUsers(); let changed=false; ADMINS.forEach(a=>{const e=users.find(u=>u.email===a.email||u.phone===a.phone); if(!e){users.push(a);changed=true}else{Object.assign(e,a);changed=true}}); if(changed) saveUsers(users); }
