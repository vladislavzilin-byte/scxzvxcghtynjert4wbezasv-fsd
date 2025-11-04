export function getBookings(){ try{ return JSON.parse(localStorage.getItem('bookings')||'[]') }catch(e){ return [] } }
export function saveBookings(list){ localStorage.setItem('bookings', JSON.stringify(list||[])) }

export function getUsers(){ try{ return JSON.parse(localStorage.getItem('users')||'[]') }catch(e){ return [] } }
export function saveUsers(list){ localStorage.setItem('users', JSON.stringify(list||[])) }
export function getCurrentUser(){ try{ return JSON.parse(localStorage.getItem('currentUser')||'null') }catch(e){ return null } }
export function setCurrentUser(u){ localStorage.setItem('currentUser', JSON.stringify(u)) }
export function updateUserByEmail(email, patch){
  const list = getUsers()
  const i = list.findIndex(u=>u.email===email)
  if(i>=0){
    list[i] = { ...list[i], ...patch }
    saveUsers(list)
    const me = getCurrentUser()
    if(me && me.email===email) setCurrentUser(list[i])
    return true
  }
  return false
}
