import User from '@/models/user';
import { connectToDB } from '@/utils/database';
import NextAuth, { Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID ?? '',
			clientSecret: process.env.GOOGLE_SECRET ?? '',
		}),
	],
	callbacks: {
		async session({ session }: { session: Session }) {
			// sessionオブジェクトに情報を追加する場合
			const { email } = session.user;
			try {
				if (!email) throw new Error('Email is undefined.');
				const sessionUser = await User.findOne({ email });
				if (!sessionUser) throw new Error('user is not exist.');
				const { _id, qiita, zenn } = sessionUser;
				session.user.id = _id.toString() ?? '';
				session.user.qiita = qiita;
				session.user.zenn = zenn;
				console.log('session-callback', session);
				return session;
			} catch (error) {
				return session;
			}
		},
		async signIn({ account, profile, user, credentials }) {
			try {
				if (typeof profile === 'undefined') throw new Error('profile is undefined');
				await connectToDB();
				const userExists = await User.findOne({ email: profile.email });
				if (!userExists) {
					await User.create({
						email: profile.email,
						username: profile.name?.replace(' ', '').toLowerCase(),
						image: profile.image,
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
	},
});

export { handler as GET, handler as POST };
