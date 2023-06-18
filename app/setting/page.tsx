'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Form from './Form';

export default async function Setting() {
	const { data: session } = useSession();

	if (!session) {
		redirect('/api/auth/signin');
	}

	return <Form />;
}
