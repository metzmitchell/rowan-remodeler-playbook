import { useState, useEffect } from 'react'

export default function PersistentCheckbox({ id, label }) {
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/checkboxes')
      .then(r => r.json())
      .then(data => {
        setChecked(data[id] || false)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])
  
  const handleChange = async (e) => {
    const newValue = e.target.checked
    setChecked(newValue)
    
    try {
      await fetch('/api/checkboxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkboxId: id, checked: newValue })
      })
    } catch (error) {
      console.error('Failed to save checkbox state:', error)
      // Revert on error
      setChecked(!newValue)
    }
  }
  
  if (loading) {
    return <span>Loading...</span>
  }
  
  return (
    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={handleChange}
        style={{ marginRight: '8px' }}
      />
      <span>{label}</span>
    </label>
  )
}

