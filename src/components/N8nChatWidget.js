import { useEffect, useState } from 'react'
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'

export default function N8nChatWidget() {
  const [loaded, setLoaded] = useState(false)
  
  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM || loaded) return
    
    const getUsername = () => {
      // Get username from playbook_user cookie (set by middleware)
      const playbookUser = document.cookie
        .split('; ')
        .find(row => row.startsWith('playbook_user='))
        ?.split('=')[1]
      
      if (playbookUser) {
        return playbookUser
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
    
    // Load CSS first
    const loadCSS = () => {
      if (!document.getElementById('n8n-chat-css')) {
        const link = document.createElement('link')
        link.id = 'n8n-chat-css'
        link.rel = 'stylesheet'
        link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css'
        document.head.appendChild(link)
      }
    }
    
    loadCSS()
    
    // Add a small delay to ensure CSS is loaded
    setTimeout(() => {
      // Load n8n chat widget
      import('@n8n/chat').then(({ createChat }) => {
        console.log('Initializing n8n chat widget for user:', username)
        
        createChat({
          webhookUrl: 'https://n8n.srv1192969.hstgr.cloud/webhook/a2e11700-0b35-4c77-bec3-d970131fa70f/chat',
          loadPreviousSession: true,
          metadata: { user: username },
          initialMessages: ['Hello! How can I help you with the playbook today?'],
          mode: 'window',
          chatInputKey: 'chatInput',
          chatSessionKey: `session_${username}`,
          showWelcomeScreen: true,
        })
        
        setLoaded(true)
        console.log('n8n chat widget initialized successfully')
      }).catch(error => {
        console.error('Failed to load n8n chat widget:', error)
      })
    }, 500)
  }, [loaded])
  
  return null
}

