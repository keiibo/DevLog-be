import { MongoClient } from 'mongodb';

// MongoDB の接続文字列を設定します
const uri =
  'mongodb+srv://keibo:ach0WcM36mBdLsF6@devlog.id9h6ei.mongodb.net/devlog?retryWrites=true&w=majority&appName=DevLog';

export async function connectDB() {
  const client = new MongoClient(uri);
  await client.connect();
  const database = client.db('devlog');
  return { client, database };
}
