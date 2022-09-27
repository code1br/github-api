import express from 'express'

export const routerUsers = express.Router()

routerUsers
	.put('/users/following/:username', () => {}, () => {})
	.delete('/users/following/:username', () => {}, () => {})