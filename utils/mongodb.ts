import { MongoClient, Db } from 'mongodb';

// const { MONGODB_URI, MONGODB_DB } = process.env;
const MONGODB_URI = 'mongodb+srv://gibson511511:b64RqFocKqydRtTI@rssteamhub.hhzedcz.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB = 'rss_team_hub';

let cachedClient: MongoClient;
let cachedDb: Db;

export async function connectToDatabase() {
	console.log('MONGODB_URI', MONGODB_URI);
	if (!MONGODB_URI || !MONGODB_DB) {
		throw new Error(`Please define the MONGODB_${!MONGODB_URI ? 'URI' : 'DB'} environment variable inside .env.local`);
	}

	if (cachedClient && cachedDb) {
		//キャッシュ変数が入力されているか確認
		return { client: cachedClient, db: cachedDb };
	}

	const client = await MongoClient.connect(MONGODB_URI);
	const db = await client.db(MONGODB_DB);
	cachedClient = client;
	cachedDb = db;

	return { client, db };
}
