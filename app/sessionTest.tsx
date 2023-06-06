'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function SessionTest({ children }: { children: React.ReactNode }) {
	const { data: session, status } = useSession();
	if (status === 'loading') {
		return <>loading...</>;
	}

	console.log('session', session);

	if (session) {
		return (
			// TODO 黙らせてる
			<div suppressHydrationWarning={true}>
				Signed in as {session?.user?.name} <br />
				<Image src={session?.user?.image ?? ''} alt="icon" width={100} height={100} />
				<button onClick={() => signOut()}>Sign out</button>
				<div>{children}</div>
			</div>
		);
	}
	return (
		<div suppressHydrationWarning={true}>
			Not signed in <br />
			<button onClick={() => signIn(undefined, { callbackUrl: 'http://localhost:3000/' })}>Sign in</button>
		</div>
	);
}
