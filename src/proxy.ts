import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/admin/login',
  },
})

// Chỉ bảo vệ /admin/* nhưng KHÔNG bảo vệ /admin/login
export const config = {
  matcher: ['/admin/((?!login$).*)'],
}
