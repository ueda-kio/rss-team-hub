import User from '@/models/user';
import { connectToDB } from '@/utils/database';
import { connectToDatabase } from '@/utils/mongodb';
import NextAuth, { Session } from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
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
				// const sessionUser = await User.findOne({ email });
				// if (!sessionUser) throw new Error('user is not exist.');

				const { db } = await connectToDatabase();
				const sessionUser = await db.collection('users').findOne({ email });
				if (!sessionUser) throw new Error('user is not exist.');

				const { _id, qiita, zenn } = sessionUser;

				session.user.id = _id.toString();
				session.user.qiita = qiita;
				session.user.zenn = zenn;

				return session;
			} catch (e) {
				console.error('session error', e);
				return session;
			}
		},
		async signIn({ account, profile, user, credentials }) {
			try {
				if (typeof profile === 'undefined') throw new Error('profile is undefined');
				await connectToDB();

				// const { db } = await connectToDatabase();
				const { email } = profile;
				if (typeof email === 'undefined') throw new Error('email is undefined');

				// TODO: mongoDB Clientだとめちゃめちゃ時間かかる
				// const isExistUser = await db.collection('users').findOne({ email });
				// if (isExistUser === null) {
				// 	await db.collection('users').insertOne({
				// 		email,
				// 		username: profile.name?.replace(' ', ''),
				// 		image: profile.picture ?? '',
				// 		qiita: '',
				// 		zenn: '',
				// 	});
				// }

				const userExists = await User.findOne({ email: profile.email });
				if (!userExists) {
					await User.create({
						email: profile.email,
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
		// async jwt({ token, user, account, profile }) {
		// 	return token;
		// },
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
// export default NextAuth(authOptions);
