import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@dirhamdrop/database';

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'dirhamdrop_fallback_production_secret_key_uae_2026',
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
    }),
    CredentialsProvider({
      name: 'Email (Mock Login for Local Dev)',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          user = await prisma.user.create({
            data: { email: credentials.email, name: credentials.email.split('@')[0] },
          });
        }
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Optional, will create later if needed
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
