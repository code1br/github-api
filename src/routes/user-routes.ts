import express from 'express'
import { Authenticate } from '../middlewares/user-authentication'

export const routerUsers = express.Router()

routerUsers
	.put('/users/following/:username', Authenticate, () => {})
	.delete('/users/following/:username', Authenticate, () => {})