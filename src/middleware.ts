// import type { NextRequest } from 'next/server'
// import { NextResponse } from 'next/server'

// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next()
//   try {
//     const supabase = createMiddlewareClient({ req, res})
//     await supabase.auth.getSession()
//   } catch (error) {
//     console.log('Middleware', error)
//   }
//   return res
// }

import { type NextRequest } from 'next/server'
import { updateSession } from '@aw/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}