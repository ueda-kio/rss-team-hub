import type { Metadata } from 'next';
import { Session } from 'next-auth';
import Provider from './components/Provider';

export const metadata: Metadata = {
	title: '自主制作',
	description: '初期説明文',
};

export default function RootLayout({ children, session }: { children: React.ReactNode; session: Session }) {
	return (
		<html lang="ja">
			<body>
				<Provider session={session}>{children}</Provider>
			</body>
		</html>
	);
}
