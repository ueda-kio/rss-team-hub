import type { Metadata } from 'next';
import { Session } from 'next-auth';
import Provider from './components/Provider';
import SessionTest from './sessionTest';
import ServerSide from './components/serverSide';

export const metadata: Metadata = {
	title: '自主制作',
	description: '初期説明文',
};

export default function RootLayout({ children, session }: { children: React.ReactNode; session: Session }) {
	return (
		<html lang="ja">
			<body>
				<Provider session={session}>
					<SessionTest>{children}</SessionTest>
				</Provider>
				{/* @ts-expect-error Server Component */}
				<ServerSide />
			</body>
		</html>
	);
}
