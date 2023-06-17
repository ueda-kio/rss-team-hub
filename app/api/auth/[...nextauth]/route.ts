import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID ?? '',
			clientSecret: process.env.GOOGLE_SECRET ?? '',
		}),
	],
	session: { strategy: 'jwt' },
	adapter: PrismaAdapter(prisma),
	callbacks: {
		async session({ token, session }) {
			try {
				const { id, name, qiita, zenn } = token;
				session.user.id = id;
				session.user.name = name;
				session.user.qiita = qiita;
				session.user.zenn = zenn;

				return session;
			} catch (e) {
				console.error('session error', e);
				return session;
			}
		},
		async jwt({ token }) {
			const sessionUser = await prisma.user.findFirst({
				where: {
					email: token.email,
				},
			});

			if (sessionUser === null) {
				return {
					...token,
				};
			}

			return {
				...token,
				id: sessionUser.id,
				name: sessionUser.name ?? '',
				qiita: sessionUser.qiita,
				zenn: sessionUser.zenn,
			};
		},
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
