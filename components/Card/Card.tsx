'use client';

import { Article, User } from '@/@types';
// import getUserData from '@/hooks/getUserData';
import Image from 'next/image';
import classes from './Card.module.scss';

export default async function Card(article: Article) {
	const { title, url, created_at, creatorId, site } = article;
	// const users = await getUserData(creatorId);

	return (
		<>
			{/* {!users ? (
			<>user is undefined.</>
			) : ( */}
			<a className={classes.wrapper} href={url} target="_blank" rel="noopener noreferrer">
				<div className={classes.header}>
					{/* <Image src={users[0].image ?? ''} width={60} height={60} alt="" /> */}
					<div>
						{/* <p>{users[0].username ?? ''}</p> */}
						<p>{created_at}</p>
					</div>
				</div>
				<p>{title}</p>
				<div>{site === 'qiita' ? 'qiita.com' : 'zenn.dev'}</div>
			</a>
			{/* )} */}
		</>
	);
}
