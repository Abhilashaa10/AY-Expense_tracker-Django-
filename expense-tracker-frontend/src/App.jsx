import { useState, useEffect } from 'react'

function App() {
  const [expenses, setExpenses] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [editingId, setEditingId] = useState(null)

  const [filterCategory, setFilterCategory] = useState('')
  const [filterDate, setFilterDate] = useState('')

  const fetchExpenses = () => {
    const params = new URLSearchParams()
    if (filterCategory) params.append('category', filterCategory)
    if (filterDate) params.append('date', filterDate)

    fetch(`http://127.0.0.1:8000/api/expenses/?${params.toString()}`)
      .then(response => response.json())
      .then(data => setExpenses(data))
      .catch(error => console.error('Error fetching expenses:', error))
  }

  useEffect(() => {
    fetchExpenses()
  }, [filterCategory, filterDate])

  const resetForm = () => {
    setTitle('')
    setAmount('')
    setCategory('food')
    setDate('')
    setNote('')
    setEditingId(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const expenseData = { title, amount, category, date, note }

    if (editingId) {
      fetch(`http://127.0.0.1:8000/api/expenses/${editingId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      })
        .then(response => response.json())
        .then(() => {
          fetchExpenses()
          resetForm()
        })
        .catch(error => console.error('Error updating expense:', error))
    } else {
      fetch('http://127.0.0.1:8000/api/expenses/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      })
        .then(response => response.json())
        .then(() => {
          fetchExpenses()
          resetForm()
        })
        .catch(error => console.error('Error adding expense:', error))
    }
  }

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/api/expenses/${id}/`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchExpenses()
      })
      .catch(error => console.error('Error deleting expense:', error))
  }

  const handleEditClick = (expense) => {
    setEditingId(expense.id)
    setTitle(expense.title)
    setAmount(expense.amount)
    setCategory(expense.category)
    setDate(expense.date)
    setNote(expense.note)
  }

  const clearFilters = () => {
    setFilterCategory('')
    setFilterDate('')
  }

  return (
    <div>
      <h1>Expense Tracker</h1>

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
      <button type="button" onClick={clearFilters}>Clear Filters</button>

      <ul>
        {expenses.map(expense => (
          <li key={expense.id}>
            {expense.title} — ${expense.amount} ({expense.category})
            <button onClick={() => handleEditClick(expense)}>Edit</button>
            <button onClick={() => handleDelete(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App