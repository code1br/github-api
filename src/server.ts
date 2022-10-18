import { app } from "./app"
import 'dotenv/config'

export const server_host = process.env.SERVER_HOST || 'localhost';
export const server_ip = process.env.SERVER_IP || 'localhost';
export const server_port = parseInt(process.env.PORT || '6060');

app.listen(server_port, server_ip, () => {
	console.log(`Listening on ${server_host}`);
	console.log(`Docs on ${server_host}/api-docs`);
});