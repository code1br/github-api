import { app } from "./app"
import 'dotenv/config'

const server_host = process.env.SERVER_HOST || 'localhost'
const server_port = parseInt(process.env.SERVER_PORT || '6060')

app.listen(server_port, server_host, () => {
	console.log(`Listening on http://${server_host}:${server_port}`)
})