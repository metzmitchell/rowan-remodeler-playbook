import { kv } from '@vercel/kv'

function getCookie(req, name) {
  const cookies = req.headers.cookie || ''
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

export default async function handler(req, res) {
  const user = getCookie(req, 'playbook_user')
  if (!user) return res.status(401).json({ error: 'Unauthorized' })
  
  const key = `checkboxes:${user}`
  
  if (req.method === 'GET') {
    try {
      const data = await kv.get(key) || {}
      return res.json(data)
    } catch (e) {
      // KV not configured yet
      return res.json({})
    }
  }
  
  if (req.method === 'POST') {
    try {
      const { checkboxId, checked } = req.body
      const current = await kv.get(key) || {}
      current[checkboxId] = checked
      await kv.set(key, current)
      return res.json({ success: true })
    } catch (e) {
      // KV not configured yet - return success but don't persist
      return res.json({ success: true, warning: 'KV not configured' })
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' })
}
