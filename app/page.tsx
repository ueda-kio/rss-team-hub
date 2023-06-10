import Form from './components/Form';
import ServerSide from './components/serverSide';
import SessionTest from './sessionTest';

export default function Home() {
	return (
		<>
			<SessionTest>sessionTest</SessionTest>
			<br />
			<Form />
			{/* TODO: このままでよいのかどうか */}
			{/* @ts-expect-error Server Component */}
			<ServerSide />
		</>
	);
}
