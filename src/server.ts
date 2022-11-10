import { app } from './app';
import 'dotenv/config';
import { logger } from './utils/logger';

export const server_host = process.env.SERVER_HOST || 'localhost';
export const server_ip = process.env.SERVER_IP || 'localhost';
export const server_port = parseInt(process.env.PORT || '6060');


app.listen(server_port, server_ip, () => {
	logger.info(`Listening on ${server_host}`);
});
