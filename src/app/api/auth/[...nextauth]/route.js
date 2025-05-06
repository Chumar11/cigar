import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import User from '../../../../../models/User'
import { connectToDB } from '@/libs/mongodb'

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'your-fallback-secret',
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60
  },
  debug: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your-email@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('Attempting auth for:', credentials?.email)
          await connectToDB()

          const user = await User.findOne({ email: credentials?.email })
          console.log('User found:', user ? 'Yes' : 'No')

          if (!user) {
            console.log('No user found')
            return null
          }

          const isPasswordValid = await compare(credentials?.password, user.password)
          console.log('Password valid:', isPasswordValid)

          if (!isPasswordValid) {
            console.log('Invalid password')
            return null
          }

          // Return only fields that exist in your schema
          return {
            id: user._id.toString(),
            email: user.email
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    // Modified callbacks to match your schema
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        // Email already exists in session
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
