export type Article = {
	_id: string;
	title: string;
	url: string;
	likes_count: number;
	publish: boolean;
	creatorId: string;
	site: 'qiita' | 'zenn';
};
