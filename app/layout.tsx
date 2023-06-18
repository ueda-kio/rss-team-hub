import type { Metadata } from 'next';
import { Session } from 'next-auth';
import Link from 'next/link';
import ProfileButton from './ProfileButton';
import Provider from './components/Provider';

export const metadata: Metadata = {
	title: 'RSS TEAM HUB',
	description: '会社メンバーの投稿記事を一覧で取得するサイト。',
};

export default function RootLayout({ children, session }: { children: React.ReactNode; session: Session }) {
	return (
		<html lang="ja">
			<head>
				<link rel="preload" href="/api/article/" as="fetch" crossOrigin="anonymous" />
				<link rel="preload" href="/api/user/" as="fetch" crossOrigin="anonymous" />
			</head>
			<body style={{ maxWidth: '1200px', minHeight: '100vh', margin: '0 auto', padding: '0 40px' }}>
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
