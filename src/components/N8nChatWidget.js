import { useEffect } from 'react'
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'

export default function N8nChatWidget() {
  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return
    
    // Extract username from basic auth (if available in cookie or session)
    // For now, we'll use a simpler approach - get it from a meta tag or cookie
    const getUsername = () => {
      // Try to get from cookie
      const authCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_user='))
      
      if (authCookie) {
        return authCookie.split('=')[1]
      }
      
      // Fallback to generating a session ID
      let sessionId = document.cookie
        .split('; ')
        .find(row => row.startsWith('n8n_session='))
        ?.split('=')[1]
      
      if (!sessionId) {
        sessionId = crypto.randomUUID()
        document.cookie = `n8n_session=${sessionId}; path=/; max-age=31536000`
      }
      
      return sessionId
    }
    
    const username = getUsername()
    
    // Load n8n chat widget script
    import('@n8n/chat').then(({ createChat }) => {
      createChat({
        webhookUrl: 'https://n8n.srv1192969.hstgr.cloud/webhook/a2e11700-0b35-4c77-bec3-d970131fa70f/chat',
        loadPreviousSession: true,
        metadata: { user: username },
      })
    }).catch(error => {
      console.error('Failed to load n8n chat widget:', error)
    })
  }, [])
  
  return null
}

