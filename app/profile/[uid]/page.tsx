import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]/route';
import MyPage from '@/app/profile/[uid]/MyPage';
import Profile from '@/app/profile/[uid]/Profile';

const getSession = async () => {
	const session = await getServerSession(authOptions);
	return session;
};

export default async function ProfilePage({ params }: { params: { uid: string } }) {
	const uid = decodeURI(params.uid);
	const session = await getSession();

	if (session === null) {
		return <>session is null</>;
	}

	if (session.user.name === uid) {
		return <MyPage uid={uid} />;
	} else {
		return <Profile uid={uid} />;
	}
}
