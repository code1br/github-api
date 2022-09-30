import express from 'express'
import { UserController } from '../controllers/user-controller'
import { Authenticate } from '../middlewares/user-authentication'

export const routerUsers = express.Router()

routerUsers
	.put('/users/following/:userToFollow', Authenticate, UserController.followUser)
	.delete('/users/following/:userToUnfollow', Authenticate, UserController.unfollowUser)
	.get('/user/repositories', Authenticate, UserController.listRepositories)
	.get('/user/stars', Authenticate, UserController.getNumberOfStars)
	.get('/user/commits', Authenticate, UserController.getNumberOfCommits)
	.get('/user/pulls', Authenticate, UserController.getNumberOfPulls)
	.get('/user/languages', Authenticate, UserController.getMostUsedLanguages)