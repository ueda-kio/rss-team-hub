import { User } from '@/@types';
import useSWR, { KeyedMutator } from 'swr';
import useSWRImmutable from 'swr/immutable';

type Arg = string | undefined;
type ReturnType<T extends Arg> = T extends string
	? {
			user: User | undefined;
			isLoading: boolean;
			error: any;
			mutate: KeyedMutator<User>;
	  }
	: T extends undefined
	? {
			user: User[] | undefined;
			isLoading: boolean;
			error: any;
			mutate: KeyedMutator<User[]>;
	  }
	: never;

/**
 * ユーザー情報を取得するHooks
 * @param {string | undefined} uid 単体で取得したい場合は`uid`を渡す。全権取得したい場合は明示的に`undefined`を渡す。
 */
export default function useUserSWR<T extends Arg>(uid: T): ReturnType<T> {
	const { data, error, isLoading, mutate } = useSWR({ key: '/api/user/', uid }, ({ key, uid }) => {
		const url = `${key}${uid || ''}`;
		return fetch(url)
			.then((res) => res.json())
			.then((json) => json.data);
	});

	return {
		user: data,
		isLoading: !error && !data && isLoading,
		error,
		mutate,
	} as ReturnType<T>;
}
