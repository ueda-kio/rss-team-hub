import ArticleList from './ArticleList';
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
