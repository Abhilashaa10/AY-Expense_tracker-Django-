import { useState, useEffect } from 'react'

const API = 'http://127.0.0.1:8000/api'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [authMode, setAuthMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  const [expenses, setExpenses] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterDate, setFilterDate] = useState('')

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`
  }

  const fetchExpenses = () => {
  const params = new URLSearchParams()
  if (filterCategory) params.append('category', filterCategory)
  if (filterDate) params.append('date', filterDate)

  fetch(`${API}/expenses/?${params.toString()}`, {
    headers: authHeaders
  })
    .then(res => {
      if (res.status === 401) {
        localStorage.removeItem('token')
        setToken(null)
        setExpenses([])
        return []
      }
      return res.json()
    })
    .then(data => {
      if (Array.isArray(data)) setExpenses(data)
    })
    .catch(err => console.error(err))
}
  useEffect(() => {
    if (token) fetchExpenses()
  }, [token, filterCategory, filterDate])

  const handleAuth = (e) => {
    e.preventDefault()
    setAuthError('')

    const endpoint = authMode === 'login' ? 'login' : 'register'

    fetch(`${API}/${endpoint}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (authMode === 'login') {
          if (data.token) {
            localStorage.setItem('token', data.token)
            setToken(data.token)
          } else {
            setAuthError('Invalid username or password')
          }
        } else {
          if (data.message) {
            setAuthMode('login')
            setAuthError('Account created! Please log in.')
          } else {
            setAuthError(JSON.stringify(data))
          }
        }
      })
      .catch(err => console.error(err))
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setExpenses([])
  }

  const resetForm = () => {
    setTitle(''); setAmount(''); setCategory('food')
    setDate(''); setNote(''); setEditingId(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const expenseData = { title, amount, category, date, note }

    if (editingId) {
      fetch(`${API}/expenses/${editingId}/`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(expenseData)
      }).then(() => { fetchExpenses(); resetForm() })
    } else {
      fetch(`${API}/expenses/`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(expenseData)
      }).then(() => { fetchExpenses(); resetForm() })
    }
  }

  const handleDelete = (id) => {
    fetch(`${API}/expenses/${id}/`, {
      method: 'DELETE',
      headers: authHeaders
    }).then(() => fetchExpenses())
  }

  const handleEditClick = (expense) => {
    setEditingId(expense.id)
    setTitle(expense.title)
    setAmount(expense.amount)
    setCategory(expense.category)
    setDate(expense.date)
    setNote(expense.note)
  }

  // ---- if no token, show login/register ----
  if (!token) {
    return (
      <div>
        <h1>Expense Tracker</h1>
        <h2>{authMode === 'login' ? 'Login' : 'Register'}</h2>

        <form onSubmit={handleAuth}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            {authMode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        {authError && <p style={{color: authMode === 'login' ? 'red' : 'green'}}>{authError}</p>}

        <p>
          {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button type="button" onClick={() => {
            setAuthMode(authMode === 'login' ? 'register' : 'login')
            setAuthError('')
          }}>
            {authMode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    )
  }

  // ---- if token exists, show expense tracker ----
  return (
    <div>
      <h1>Expense Tracker</h1>
      <button onClick={handleLogout}>Logout</button>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="rent">Rent</option>
          <option value="utilities">Utilities</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="text" placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
        <button type="submit">{editingId ? 'Update Expense' : 'Add Expense'}</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <hr />

      <h3>Filter</h3>
      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="food">Food</option>
        <option value="transport">Transport</option>
        <option value="rent">Rent</option>
        <option value="utilities">Utilities</option>
        <option value="entertainment">Entertainment</option>
        <option value="other">Other</option>
      </select>
      <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
      <button type="button" onClick={() => { setFilterCategory(''); setFilterDate('') }}>Clear Filters</button>

      <ul>
        {expenses.map(expense => (
          <li key={expense.id}>
            {expense.title} — ${expense.amount} ({expense.category}) — {expense.date}
            <button onClick={() => handleEditClick(expense)}>Edit</button>
            <button onClick={() => handleDelete(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App