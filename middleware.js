export const config = {
  matcher: ['/((?!api|_vercel|favicon.ico|img/|assets/).*)'],
}

// Users defined in env: AUTH_USERS=mitch:pass1,rj:pass2,jh:pass3,se:pass4
function parseUsers() {
  const users = process.env.AUTH_USERS || ''
  if (!users) return {}
  return Object.fromEntries(
    users.split(',').filter(pair => pair.includes(':')).map(pair => pair.split(':'))
  )
}

function getCookie(req, name) {
  const cookies = req.headers.get('cookie') || ''
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

export default function middleware(req) {
  const users = parseUsers()
  
  // If no users configured, allow access
  if (Object.keys(users).length === 0) {
    return
  }

  // Check for existing auth cookie first
  const authCookie = getCookie(req, 'playbook_user')
  if (authCookie && users[authCookie]) {
    return // Allow through
  }
  
  // Check basic auth header
  const basicAuth = req.headers.get('authorization')
  
  if (basicAuth) {
    try {
      const [user, pwd] = atob(basicAuth.split(' ')[1]).split(':')
      
      if (users[user] === pwd) {
        // Set a cookie and redirect to same URL to establish session
        return new Response(null, {
          status: 302,
          headers: {
            'Location': req.url,
            'Set-Cookie': `playbook_user=${user}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
          }
        })
      }
    } catch (e) {
      // Invalid auth header format
    }
  }
  
  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Semper Fi Playbook"' },
  })
}
