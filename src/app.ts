import express from "express"
import cors from "cors"
import { routes } from "./routes";

export const app = express()

app.use(cors())
app.use(express.json())
routes(app)
