import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });
export async function connectDB() {
  // MongoDB の接続文字列を設定します
  const uri = process.env.DB_URI;

  const client = new MongoClient(uri);
  await client.connect();
  const database = client.db('devlog');
  return { client, database };
}
