import NextAuth, { Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
	// Configure one or more authentication providers
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID ?? '',
			clientSecret: process.env.GOOGLE_SECRET ?? '',
		}),
		// ...add more providers here
	],
	callbacks: {
		async session({ session }: { session: Session }) {
			// sessionオブジェクトに情報を追加する場合
			return session;
		},
		async signIn({ account, profile, user, credentials }) {
			try {
				// サインイン時に何かしたい場合
				return true;
			} catch (error) {
				console.log('Error checking if user exists: ', error);
				return false;
			}
		},
	},
});

export { handler as GET, handler as POST };
