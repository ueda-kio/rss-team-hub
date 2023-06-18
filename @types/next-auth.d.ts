import NextAuth, { Profile as DefaultProfile, DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			qiita: string;
			zenn: string;
		} & DefaultSession['user'];
	}
	interface Profile {
		picture?: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		username: string;
		qiita: string;
		zenn: string;
	}
}
