import React from "react"
import { getCurrentUser } from "../utils/session.js"

export default function Admin() {
  const me = getCurrentUser()
  const [view, setView] = React.useState("list")

  const isAdmin =
    me &&
    (["vladislavzilin@gmail.com", "irina.abramova7@gmail.com"].includes(me.email) ||
      me.role === "admin")

  if (!isAdmin) {
    return (
      <div className="card">
        <h2>Доступ запрещён</h2>
        <p className="muted">Эта страница доступна только администраторам.</p>
      </div>
    )
  }

  if (view === "resetlog") {
    return <ResetLog setView={setView} />
  }

  return (
    <div className="card">
      <h2>Админ-панель</h2>
      <div style={{ marginBottom: "1rem" }}>
        <button className="ghost" onClick={() => setView("resetlog")}>
          🛡️ Журнал сбросов паролей
        </button>
      </div>
      <p className="muted">Вы вошли как администратор: {me.email}</p>
      <p>Здесь будут функции управления и список всех записей.</p>
    </div>
  )
}

function ResetLog({ setView }) {
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/reset-log")
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Журнал сбросов паролей</h3>
        <button className="ghost" onClick={() => setView("list")}>
          ← Назад
        </button>
      </div>

      {loading ? (
        <p className="muted">Загрузка...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Время</th>
              <th>Email</th>
              <th>Статус</th>
              <th>Ошибка</th>
            </tr>
          </thead>
          <tbody>
            {items.map((x, i) => (
              <tr key={i}>
                <td>{new Date(x.at).toLocaleString("lt-LT")}</td>
                <td>{x.email}</td>
                <td>{x.status}</td>
                <td>{x.error || "—"}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="4">
                  <small className="muted">Нет данных</small>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
