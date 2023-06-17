import { MongoClient, Db } from 'mongodb';

const { MONGODB_URI, MONGODB_DB } = process.env;

let cachedClient: MongoClient;
let cachedDb: Db;

export async function connectToDatabase() {
	if (!MONGODB_URI || !MONGODB_DB) {
		throw new Error(`Please define the MONGODB_${!MONGODB_URI ? 'URI' : 'DB'} environment variable inside .env.local`);
	}

	if (cachedClient && cachedDb) {
		//キャッシュ変数が入力されているか確認
		console.log('MongoDB is already connected');
		return { client: cachedClient, db: cachedDb };
	}

	const client = await MongoClient.connect(MONGODB_URI);
	const db = await client.db(MONGODB_DB);
	cachedClient = client;
	cachedDb = db;
	console.log('MongoDB connected');

	return { client, db };
}
