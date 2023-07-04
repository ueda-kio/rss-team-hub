'use client';

import { Article } from '@/@types';
import useUserSWR from '@/hooks/useUserSWR';
import Image from 'next/image';
import classes from './Card.module.scss';

export default function Card({ props }: { props: Article }) {
	const { title, url, created_at, creatorId, site } = props;
	const { user, isLoading } = useUserSWR(creatorId);

	return (
		<>
			{isLoading ? (
				<></>
			) : (
				<a className={classes.wrapper} href={url} target="_blank" rel="noopener noreferrer">
					<div className={classes.header}>
						<Image src={user?.image ?? ''} width={60} height={60} alt="" />
						<div>
							<p>{user?.username ?? ''}</p>
							<p>{created_at}</p>
						</div>
					</div>
					<p>{title}</p>
					<div>{site === 'qiita' ? 'qiita.com' : 'zenn.dev'}</div>
				</a>
			)}
		</>
	);
}
