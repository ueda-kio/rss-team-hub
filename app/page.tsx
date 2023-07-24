import { Suspense } from 'react';
import ArticleList from './ArticleList';
import ArticleListServer from './ArticleList.server';
import MemberList from './MemberList';
import SessionTest from './sessionTest';

export default function Home() {
	return (
		<>
			{/* <ArticleList /> */}
			<Suspense fallback={<>loading...</>}>
				{/* @ts-expect-error Server Component */}
				<ArticleListServer />
			</Suspense>
			<Suspense fallback={<>loading...</>}>
				{/* @ts-expect-error Server Component */}
				<MemberList />
			</Suspense>
			<SessionTest />
		</>
	);
}
