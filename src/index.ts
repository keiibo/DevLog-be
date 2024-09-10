import express from 'express';
import router from './router/router';
import connectDB from './db/db';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';

dotenv.config();

const app = express();
if (!process.env.DB_URI) {
  process.exit(1);
}
app.use(express.json());

const fe_URL = process.env.FE_URL;
const fe_URL_vercel = process.env.FE_URL_VERCEL;
if (!fe_URL || !fe_URL_vercel) {
  console.error('FEが見つからない');
  process.exit(1); // 環境変数がない場合、アプリケーションを安全に終了
}

// CORS設定: 特定のオリジンからのリクエストのみ許可
const corsOptions = {
  origin: [fe_URL, fe_URL_vercel], // このオリジンからのアクセスを許可
  optionsSuccessStatus: 200 // レガシーブラウザ対応のためのステータスコード
};

app.use(cors(corsOptions));

// DB接続
connectDB(process.env.DB_URI);

const swaggerDocument = YAML.load('src/docs/openapi.yml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Connection Success');
});
app.use('/api', router);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
