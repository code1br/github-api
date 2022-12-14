import express from 'express';
import { UserController } from '../controllers/user-controller';
import { ensureAuthentication } from '../middlewares/user-ensureAuthentication';

export const routerUsers = express.Router();

routerUsers
	.post('/user/login', UserController.authenticateUser)
	.put('/users/following/:userToFollow', ensureAuthentication, UserController.followUser)
	.delete('/users/following/:userToUnfollow', ensureAuthentication, UserController.unfollowUser)
	.get('/users/following/:userToGet', ensureAuthentication, UserController.getUser)
	.get('/users/search', ensureAuthentication,UserController.searchUsers)
	.get('/user/repositories', ensureAuthentication, UserController.listRepositories)
	.get('/user/stars', ensureAuthentication, UserController.getNumberOfStars)
	.get('/user/commits', ensureAuthentication, UserController.getNumberOfCommitsForAuthUser)
	.get('/user/pulls', ensureAuthentication, UserController.getNumberOfPulls)
	.get('/user/languages', ensureAuthentication, UserController.getUsedLanguages);
