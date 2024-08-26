import express from 'express';
import router from './router/router';
import connectDB from './db/db';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
if (!process.env.DB_URI) {
  process.exit(1);
}
app.use(express.json());

// CORS設定: 特定のオリジンからのリクエストのみ許可
const corsOptions = {
  origin: 'http://localhost:5173', // このオリジンからのアクセスを許可
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
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
