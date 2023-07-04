import { Article, User } from '@/@types';

const isSiteType = (str: string): str is 'qiita' | 'zenn' => (['qiita', 'zenn'] as const).some((el) => el === str);

// ===================== Article Type =====================
export const articleTypeObj = {
	_id: '',
	title: '',
	url: '',
	likes_count: 0,
	created_at: '',
	publish: true,
	creatorId: '',
	site: '',
};
export const isArticle = (obj: any): obj is Article => {
	return Object.entries(articleTypeObj).every(([key, value]) => typeof value === typeof obj[key]) && isSiteType(obj.site);
};
export const isArticleArray = (arr: any[]): arr is Article[] => arr.every((el) => isArticle(el));
export const isIncludeArticleType = (obj: any): obj is Partial<Article> => {
	const isObject = typeof obj === 'object';
	const isAllPropertiesMatch = Object.keys(obj).every((key) => Object.keys(articleTypeObj).includes(key));
	const isAllPropertiesTypesMatch = Object.entries(obj).every(
		([key, value]) => typeof value === 'undefined' || typeof value === typeof articleTypeObj[key as keyof typeof articleTypeObj]
	);

	return isObject && isAllPropertiesMatch && isAllPropertiesTypesMatch;
};

// ===================== User Type =====================
export const userTypeObj = {
	_id: '',
	email: '',
	image: '',
	qiita: '',
	username: '',
	zenn: '',
	times: '',
	__v: 0,
};
export const isUser = (obj: any): obj is User => {
	return Object.entries(userTypeObj).every(([key, value]) => typeof value === typeof obj[key]);
};
export const isUserArray = (arr: any[]): arr is User[] => arr.every((el) => isUser(el));
export const isIncludeUserType = (obj: { [k: string]: string | number }): obj is Partial<User> => {
	// `User` に含まれないプロパティがある場合 `false`
	const isObject = typeof obj === 'object';
	const isAllPropertiesMatch = Object.keys(obj).every((key) => Object.keys(userTypeObj).includes(key));
	const isAllPropertiesTypesMatch = Object.entries(obj).every(
		([key, value]) => typeof value === 'undefined' || typeof value === typeof userTypeObj[key as keyof typeof userTypeObj]
	);

	return isObject && isAllPropertiesMatch && isAllPropertiesTypesMatch;
};
