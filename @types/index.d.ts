export type User = {
	_id: string;
	email: string;
	image: string;
	qiita: string;
	username: string;
	zenn: string;
	__v: number;
};

export type Article = {
	_id: string;
	title: string;
	url: string;
	likes_count: number;
	publish: boolean;
	creatorId: string;
	site: 'qiita' | 'zenn';
};
