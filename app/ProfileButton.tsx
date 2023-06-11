'use client';

import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfileButton() {
	const { data: session, status } = useSession();
	if (session) {
		return (
			<div>
				<Link href={`/profile/${session.user.id}`}>
					<Image src={session?.user?.image ?? ''} alt="to profile page" width={50} height={50} style={{ borderRadius: '100%' }} />
				</Link>
			</div>
		);
	}

	return status === 'loading' ? (
		<div>loading...</div>
	) : (
		<button onClick={() => signIn(undefined, { callbackUrl: 'http://localhost:3000/' })}>Sign in</button>
	);
}
