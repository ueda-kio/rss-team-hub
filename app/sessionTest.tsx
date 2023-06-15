'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

export default function SessionTest() {
	const { data: session } = useSession();
	useEffect(() => {
		console.log(session?.user);
	}, [session]);

	return <></>;
}
