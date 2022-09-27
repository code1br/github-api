import { Express } from 'express'
import { routerUsers } from './user-routes'

export const routes = (app: Express) => {
	app.use(
		routerUsers
	)
}