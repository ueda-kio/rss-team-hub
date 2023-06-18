import { Article, User } from '@/@types';

const isSiteType = (str: string): str is 'qiita' | 'zenn' => (['qiita', 'zenn'] as const).some((el) => el === str);

// ===================== Article Type =====================
export const articleTypeObj = {
	_id: '',
	title: '',
	url: '',
	likes_count: 0,
	publish: true,
	creatorId: '',
	site: '',
};
export const isArticle = (obj: any): obj is Article => {
	return Object.entries(articleTypeObj).every(([key, value]) => typeof value === typeof obj[key]) && isSiteType(obj.site);
};
export const isArticleArray = (arr: any[]): arr is Article[] => arr.every((el) => isArticle(el));

// ===================== User Type =====================
export const userTypeObj = {
	_id: '',
	email: '',
	image: '',
	qiita: '',
	username: '',
	zenn: '',
	__v: 0,
};
export const isUser = (obj: any): obj is User => {
	return Object.entries(userTypeObj).every(([key, value]) => typeof value === typeof obj[key]);
};
export const isUserArray = (arr: any[]): arr is User[] => arr.every((el) => isUser(el));
export const isIncludeUserType = (obj: { [k: string]: string | number }): obj is Partial<User> => {
	// return Object.entries(articleTypeObj).every(([key, value]) => typeof value === typeof obj[key]);
	const bool = Object.keys(obj).every((key) => Object.keys(userTypeObj).some((userKey) => userKey === key));
	if (!bool) return false;

	const { _id, email, image, qiita, username, zenn } = obj;
	return (
		typeof _id === 'string' ||
		typeof email === 'string' ||
		typeof image === 'string' ||
		typeof qiita === 'string' ||
		typeof username === 'string' ||
		typeof zenn === 'string'
	);
};
