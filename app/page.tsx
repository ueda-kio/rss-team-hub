import ArticleList from './ArticleList';
import MemberList from './MemberList';

export default function Home() {
	return (
		<>
			{/* @ts-expect-error Server Component */}
			<ArticleList />
			{/* @ts-expect-error Server Component */}
			<MemberList />
		</>
	);
}
