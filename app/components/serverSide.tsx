import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]/route';

const getSession = async () => {
	const session = await getServerSession(authOptions);
	return session;
};

const getItems = async (session: Session) => {
	const { id } = session.user;
	const data: {
		ok: boolean;
		data: {
			_id: string;
			site: string;
			title: string;
			url: string;
			likes_count: number;
			creator: string;
		}[];
	} = await (await fetch(`http://localhost:3000/api/item/${id}`, { cache: 'no-cache' })).json();
	return data.data;
};

export default async function ServerSide() {
	const session = await getSession();

	if (session === null) {
		return <p>serverSide</p>;
	}

	const data = await getItems(session!);

	return (
		<div>
			<p>serverSide</p>
			<div>{session?.user?.email}</div>
			<ul>
				{data.map((data) => (
					<li key={data._id}>{data.title}</li>
				))}
			</ul>
		</div>
	);
}
