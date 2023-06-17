import { FetcherResponse } from 'swr/_internal';

export const fetcher = <T>(url: string): FetcherResponse<T> =>
	fetch(url)
		.then((res) => res.json())
		.then((json) => json.data);
