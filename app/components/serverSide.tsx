import { Session } from 'next-auth';
import { getServerSession } from '@/lib/getSession';

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
	} = await (await fetch(`http://localhost:3000/api/article/`, { cache: 'no-cache' })).json();
	return data.data;
};

export default async function ServerSide() {
	const session = await getServerSession();

	if (session === null) {
		return <p>serverSide</p>;
	}

	const data = await getItems(session!);

	return (
		<div>
			<p>serverSide</p>
			<ul>
				{data.map((data) => (
					<li key={data._id}>{data.title}</li>
				))}
			</ul>
		</div>
	);
}
