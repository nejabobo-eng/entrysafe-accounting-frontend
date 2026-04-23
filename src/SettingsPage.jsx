import React, { useState } from 'react'

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    owner_id: 'test_user_001',
    business_name: '',
    currency: 'ZAR',
    fiscal_year_start: new Date().toISOString().split('T')[0]
  })
  const [status, setStatus] = useState({ type: '', message: '' })

  const API_BASE = import.meta.env.VITE_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: 'loading', message: 'Saving settings...' })

    try {
      const response = await fetch(`${API_BASE}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setStatus({ type: 'success', message: 'Settings saved! You can now create transactions.' })
      } else {
        const errorData = await response.json()
        setStatus({ type: 'error', message: errorData.detail || 'Failed to save settings.' })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error. Is the backend live?' })
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>⚙️ Business Settings</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>
          <strong>Owner ID:</strong>
          <input
            type="text"
            value={settings.owner_id}
            onChange={(e) => setSettings({ ...settings, owner_id: e.target.value })}
            style={{ width: '100%', padding: '8px' }}
          />
        </label>

        <label>
          <strong>Business Name:</strong>
          <input
            type="text"
            placeholder="e.g. MLU Poultry Farm"
            value={settings.business_name}
            onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </label>

        <label>
          <strong>Currency:</strong>
          <select
            value={settings.currency}
            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="ZAR">South African Rand (ZAR)</option>
            <option value="USD">US Dollar (USD)</option>
          </select>
        </label>

        <button
          type="submit"
          style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Save Settings
        </button>
      </form>

      {status.message && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: status.type === 'error' ? '#ffdce0' : '#d4edda' }}>
          {status.message}
        </div>
      )}
    </div>
  )
}

export default SettingsPage
