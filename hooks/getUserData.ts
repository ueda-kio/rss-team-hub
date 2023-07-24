import { isUserArray } from '@/lib/typeGuard';

export default async function getUserData(uid?: string) {
	const endpoint = `/api/user/`;
	const url = `${endpoint}${uid || ''}`;
	try {
		const json = await (await fetch(url)).json();
		const data = json.data;
		console.log('data', data);
		if (!isUserArray(data)) throw Error('型エラー');
		return data;
	} catch (e) {
		console.error(e);
		return undefined;
	}
}
