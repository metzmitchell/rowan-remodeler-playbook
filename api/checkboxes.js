import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  const user = req.headers['x-user']
  if (!user) return res.status(401).json({ error: 'Unauthorized' })
  
  const key = `checkboxes:${user}`
  
  if (req.method === 'GET') {
    const data = await kv.get(key) || {}
    return res.json(data)
  }
  
  if (req.method === 'POST') {
    const { checkboxId, checked } = req.body
    const current = await kv.get(key) || {}
    current[checkboxId] = checked
    await kv.set(key, current)
    return res.json({ success: true })
  }
  
  return res.status(405).json({ error: 'Method not allowed' })
}

