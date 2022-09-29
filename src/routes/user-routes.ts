import express from 'express'
import { UserController } from '../controllers/user-controller'
import { Authenticate } from '../middlewares/user-authentication'

export const routerUsers = express.Router()

routerUsers
	.put('/users/following/:userToFollow', Authenticate, UserController.followUser)
	.delete('/users/following/:userToUnfollow', Authenticate, UserController.unfollowUser)
	.get('/user/repositories', Authenticate, UserController.listRepositories)
	.get('/user/stars', Authenticate, UserController.getAmountOfStars)
	.get('/user/commits', Authenticate, UserController.getAmountOfCommits)
	.get('/user/pulls', Authenticate, UserController.getAmountOfPulls)