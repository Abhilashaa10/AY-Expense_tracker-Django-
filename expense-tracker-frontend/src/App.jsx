import { useState, useEffect } from 'react'

function App() {
  const [expenses, setExpenses] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  const fetchExpenses = () => {
    fetch('http://127.0.0.1:8000/api/expenses/')
      .then(response => response.json())
      .then(data => setExpenses(data))
      .catch(error => console.error('Error fetching expenses:', error))
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    fetch('http://127.0.0.1:8000/api/expenses/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, amount, category, date, note }),
    })
      .then(response => response.json())
      .then(() => {
        fetchExpenses()
        setTitle('')
        setAmount('')
        setCategory('food')
        setDate('')
        setNote('')
      })
      .catch(error => console.error('Error adding expense:', error))
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


  return (
    <div>
      <h1>Expense Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="rent">Rent</option>
          <option value="utilities">Utilities</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit">Add Expense</button>
      </form>


<ul>
  {expenses.map(expense => (
    <li key={expense.id}>
      {expense.title} — ${expense.amount} ({expense.category})
      <button onClick={() => handleDelete(expense.id)}>Delete</button>
    </li>
  ))}
</ul>

      <ul>
        {expenses.map(expense => (
          <li key={expense.id}>
            {expense.title} — ${expense.amount} ({expense.category})
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App