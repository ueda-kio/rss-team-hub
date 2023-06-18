import { connectToDatabase } from '@/utils/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const { db } = await connectToDatabase();
	const usersCollection = await db.collection('users');

	const data = await (async () => {
		if (req.nextUrl.search === '') {
			return await usersCollection.find().toArray();
		} else {
			const query = req.nextUrl.searchParams;
			const findOption = Object.fromEntries(query.entries());
			return await usersCollection.find(findOption).toArray();
		}
	})();

	return NextResponse.json({ ok: true, data }, { status: 200 });
}
