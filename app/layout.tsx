import type { Metadata } from 'next';
import { Session } from 'next-auth';
import Provider from './components/Provider';
import Link from 'next/link';
import ProfileButton from './ProfileButton';

export const metadata: Metadata = {
	title: '自主制作',
	description: '初期説明文',
};

export default function RootLayout({ children, session }: { children: React.ReactNode; session: Session }) {
	return (
		<html lang="ja">
			<body style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
				<Provider session={session}>
					<header style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Link href="/">TOP</Link>
						<ProfileButton />
					</header>
					{children}
				</Provider>
			</body>
		</html>
	);
}
