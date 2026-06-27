import { useState, useEffect } from 'react'

function App() {
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/expenses/')
      .then(response => response.json())
      .then(data => setExpenses(data))
      .catch(error => console.error('Error fetching expenses:', error))
  }, [])

  return (
    <div>
      <h1>Expense Tracker</h1>
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