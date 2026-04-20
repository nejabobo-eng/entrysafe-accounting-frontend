import { useState } from 'react'
import './TransactionPage.css'

const API_BASE_URL = 'http://localhost:8000'

function TransactionPage() {
  const [ownerId, setOwnerId] = useState('test_user_001')
  const [text, setText] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const createTransaction = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/transactions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner_id: ownerId,
          text: text,
          date: date + 'T00:00:00Z'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Transaction failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="transaction-page">
      <div className="container">
        <h1>Entry Safe - AI Accounting</h1>
        <p className="subtitle">Create transaction with AI-powered double-entry journal</p>

        <div className="card">
          <h2>Create Transaction</h2>

          <div className="form-group">
            <label htmlFor="ownerId">Owner ID</label>
            <input
              id="ownerId"
              type="text"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              placeholder="test_user_001"
            />
          </div>

          <div className="form-group">
            <label htmlFor="text">Transaction Description</label>
            <input
              id="text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Bought feed R3000"
            />
            <small>Include amount in format: R3000 or R1,500.50</small>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button 
            onClick={createTransaction} 
            disabled={loading || !text}
            className="btn-primary"
          >
            {loading ? 'Processing...' : 'Create Transaction'}
          </button>
        </div>

        {error && (
          <div className="card error-card">
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="card success-card">
            <h3>✅ Transaction Created Successfully</h3>

            <div className="result-section">
              <h4>Transaction Details</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">ID:</span>
                  <span className="value">{result.transaction.id}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Amount:</span>
                  <span className="value">R{result.transaction.amount.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Confidence:</span>
                  <span className="value">{(result.transaction.ai_confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="detail-item">
                  <span className="label">Source:</span>
                  <span className="value badge">{result.transaction.source}</span>
                </div>
              </div>
            </div>

            <div className="result-section">
              <h4>Journal Entry</h4>
              <div className="journal-info">
                <span className={`balance-badge ${result.journal_entry.is_balanced ? 'balanced' : 'unbalanced'}`}>
                  {result.journal_entry.is_balanced ? '✓ Balanced' : '⚠ Unbalanced'}
                </span>
                <span>Debit: R{result.journal_entry.total_debit.toFixed(2)}</span>
                <span>Credit: R{result.journal_entry.total_credit.toFixed(2)}</span>
              </div>

              <table className="journal-table">
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Code</th>
                    <th>Debit</th>
                    <th>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {result.journal_entry.entries.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.account_name}</td>
                      <td className="code">{entry.account_code}</td>
                      <td className="amount debit">
                        {entry.entry_type === 'debit' ? `R${entry.amount.toFixed(2)}` : '-'}
                      </td>
                      <td className="amount credit">
                        {entry.entry_type === 'credit' ? `R${entry.amount.toFixed(2)}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2"><strong>Total</strong></td>
                    <td className="amount debit"><strong>R{result.journal_entry.total_debit.toFixed(2)}</strong></td>
                    <td className="amount credit"><strong>R{result.journal_entry.total_credit.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="message">
              <p><strong>Message:</strong> {result.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionPage
