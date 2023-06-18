import { getServerSession } from '@/lib/getSession';
import { redirect } from 'next/navigation';
import Form from './Form';

export default async function Setting() {
	const session = await getServerSession();

	if (!session) {
		redirect('/api/auth/signin');
	}

	return <Form />;
}
