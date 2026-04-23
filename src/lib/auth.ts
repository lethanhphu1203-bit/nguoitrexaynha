import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (credentials.email !== adminEmail) return null

        // So sánh mật khẩu (hỗ trợ cả plaintext và bcrypt hash)
        const isValid = adminPassword?.startsWith('$2')
          ? await bcrypt.compare(credentials.password, adminPassword)
          : credentials.password === adminPassword

        if (!isValid) return null

        return { id: '1', name: 'Admin', email: adminEmail }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = 'admin'
      return token
    },
    async session({ session, token }) {
      if (token) (session.user as any).role = token.role
      return session
    },
  },
}
