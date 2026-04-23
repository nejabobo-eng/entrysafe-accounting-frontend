import { useState } from 'react'
import TransactionPage from './TransactionPage'
import SettingsPage from './SettingsPage'
import './App.css'

function App() {
  const [view, setView] = useState('transactions')

  return (
    <div>
      <nav style={{ padding: '10px', borderBottom: '1px solid #e6e6e6', display: 'flex', gap: '8px' }}>
        <button onClick={() => setView('transactions')} style={{ padding: '8px 12px' }}>Transactions</button>
        <button onClick={() => setView('settings')} style={{ padding: '8px 12px' }}>Settings</button>
      </nav>

      <main style={{ padding: '20px' }}>
        {view === 'transactions' ? <TransactionPage /> : <SettingsPage />}
      </main>
    </div>
  )
}

export default App
