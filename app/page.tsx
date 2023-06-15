import { Suspense } from 'react';
import ArticleList from './ArticleList';
import MemberList from './MemberList';
import SessionTest from './sessionTest';

export default function Home() {
	return (
		<>
			<Suspense fallback={<>loading...</>}>
				{/* @ts-expect-error Server Component */}
				<ArticleList />
			</Suspense>
			<Suspense fallback={<>loading...</>}>
				{/* @ts-expect-error Server Component */}
				<MemberList />
			</Suspense>
			<SessionTest />
		</>
	);
}
