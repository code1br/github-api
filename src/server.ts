import { app } from "./app"
import 'dotenv/config'

export const server_host = process.env.SERVER_HOST || 'localhost';
export const server_ip = process.env.SERVER_IP || 'localhost';
export const server_port = parseInt(process.env.PORT || '6060');
export const logger = require("./utils/logger");

app.listen(server_port, server_ip, () => {
	logger.info(`Listening on ${server_host}`);
});
