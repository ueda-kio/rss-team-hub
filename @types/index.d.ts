import { articleTypeObj, userTypeObj } from '@/lib/typeGuard';

export type User = typeof userTypeObj & { patchData?: any };
export type PartialUser = Partial<User>;

export type Article = Omit<typeof articleTypeObj, 'site'> & { site: 'qiita' | 'zenn' };
export type ArticleArray = Article[];
