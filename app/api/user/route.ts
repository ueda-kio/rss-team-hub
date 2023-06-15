import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const data = await (async () => {
			if (req.nextUrl.search === '') {
				return await prisma.user.findMany();
			} else {
				const query = req.nextUrl.searchParams;
				const findOption = Object.fromEntries(query.entries());
				return await prisma.user.findMany({
					where: {
						...findOption,
					},
				});
			}
		})();
		return NextResponse.json({ ok: true, data }, { status: 200 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ ok: false }, { status: 500 });
	}
}
