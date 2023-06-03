'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function SessionTest({ children }: { children: React.ReactNode }) {
	const { data: session, status } = useSession();
	if (status === 'loading') {
		return <>loading...</>;
	}

	if (session) {
		return (
			<>
				Signed in as {session?.user?.name} <br />
				<Image src={session?.user?.image ?? ''} alt="icon" width={100} height={100} />
				<button onClick={() => signOut()}>Sign out</button>
				<div>{children}</div>
			</>
		);
	}
	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn(undefined, { callbackUrl: 'http://localhost:3000/foo' })}>Sign in</button>
		</>
	);
}
