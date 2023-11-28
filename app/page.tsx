// import { Suspense } from 'react';
import ArticleList from './ArticleList';
// import ArticleListServer from './ArticleList.server';
import MemberList from './MemberList';
import SessionTest from './sessionTest';

export default function Home() {
	return (
		<>
			{/* @ts-expect-error Server Component */}
			<ArticleList />
			{/* @ts-expect-error Server Component */}
			<MemberList />
			<SessionTest />
		</>
	);
}
