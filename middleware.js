import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

// Users defined in env: AUTH_USERS=mitch:pass1,rj:pass2,jh:pass3,se:pass4
function parseUsers() {
  const users = process.env.AUTH_USERS || ''
  return Object.fromEntries(
    users.split(',').map(pair => pair.split(':'))
  )
}

export function middleware(req) {
  const basicAuth = req.headers.get('authorization')
  const users = parseUsers()
  
  if (basicAuth) {
    const [user, pwd] = atob(basicAuth.split(' ')[1]).split(':')
    
    if (users[user] === pwd) {
      // Pass username to the app via header
      const response = NextResponse.next()
      response.headers.set('x-user', user)
      return response
    }
  }
  
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Semper Fi Playbook"' },
  })
}

