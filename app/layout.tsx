import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '自主制作',
	description: '初期説明文',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<body>{children}</body>
		</html>
	);
}
