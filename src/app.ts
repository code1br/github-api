import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import { morganMiddleware } from './middlewares/morgan.middleware';

export const app = express();

app.use(morganMiddleware);
app.use(cors());
app.use(express.json());
routes(app);
