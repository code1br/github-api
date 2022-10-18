import { Request, Response } from "express"
import { clearCurrentUser } from "../middlewares/user-ensureAuthentication"

export abstract class BaseController{
	static async execute(req: Request, res: Response, block: () => Promise<void>){
		try{
			await block()
		} catch (err) {
			if (err instanceof Error) {
				console.error(err.stack)
				res.status(400).send(err.message)
			} else {
				res.status(400).send("Unexpected error !!!")
			}
		} finally {
			clearCurrentUser()
		}
	}
}