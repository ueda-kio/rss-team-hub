import { connectToDatabase } from '@/utils/mongodb';
import type { NextAuthOptions } from 'next-auth';
import NextAuth, { Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID ?? '',
			clientSecret: process.env.GOOGLE_SECRET ?? '',
		}),
	],
	session: { strategy: 'jwt' },
	callbacks: {
		async session({ token, session }) {
			const { id, name, qiita, zenn } = token;
			session.user.id = id;
			session.user.name = name;
			session.user.qiita = qiita;
			session.user.zenn = zenn;

			return session;
		},
		async signIn({ account, profile, user, credentials }) {
			try {
				if (typeof profile === 'undefined') throw new Error('profile is undefined');

				const { db } = await connectToDatabase();
				const { email } = profile;
				if (typeof email === 'undefined') throw new Error('email is undefined');

				const isExistUser = await db.collection('users').findOne({ email });
				if (isExistUser === null) {
					await db.collection('users').insertOne({
						email,
						username: profile.name?.replace(' ', ''),
						image: profile.picture ?? '',
						qiita: '',
						zenn: '',
					});
				}

				return true;
			} catch (error) {
				console.error('Error checking if user exists: ', error);
				return false;
			}
		},
		async jwt({ token, user, account, profile }) {
			console.log('jwt', token);
			const { db } = await connectToDatabase();
			const sessionUser = await db.collection('users').findOne({ email: token.email });
			if (!sessionUser) return token;
			return {
				...token,
				id: sessionUser._id.toString(),
				name: sessionUser.username ?? '',
				qiita: sessionUser.qiita,
				zenn: sessionUser.zenn,
			};
		},
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
// export default NextAuth(authOptions);
