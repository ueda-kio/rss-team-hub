import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const users = await prisma.user.findMany();

		return NextResponse.json({ ok: true, users }, { status: 200 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ ok: false }, { status: 500 });
	}
}
