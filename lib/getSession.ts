import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession as getDefaultServerSession } from 'next-auth';

export const getServerSession = async () => {
	const session = await getDefaultServerSession(authOptions);
	return session;
};
