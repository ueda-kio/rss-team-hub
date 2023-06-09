import { ObjectId } from 'mongodb';

export type Article = { title: string; url: string; likes_count: number };
export type Data = { title: string; url: string; likes_count: number; site: 'qiita' | 'zenn' };
