import { GitHubRestfullApi } from "../apis/restfull/github-restfull-api";
import { UserService } from "../service/user-service";
import { Request, Response } from "express"
import { CURRENT_USER } from "../middlewares/user-authentication";
import { AxiosResponse } from "axios";

export class UserController{
	private static getService(){
		return new UserService(new GitHubRestfullApi)
	}

	static async followUser(req: Request, res: Response){
		try{
			const currentUser = CURRENT_USER
			const userToFollow = req.params.userToFollow

			const service = UserController.getService()

			await service.followUser(currentUser, userToFollow)

			res.status(204).send()
		}catch(err){
			if (err instanceof Error) {
				res.status(400).send(err.message)
			}else{
				res.status(400).send("Unexpected error !!!")
			}
		}
	}

	static async unfollowUser(req: Request, res: Response){
		try{
			const currentUser = CURRENT_USER
			const userToUnfollow = req.params.userToUnfollow

			const service = UserController.getService()

			await service.unfollowUser(currentUser, userToUnfollow)

			res.status(204).send()
		}catch(err){
			if (err instanceof Error) {
				res.status(400).send(err.message)
			}else{
				res.status(400).send("Unexpected error !!!")
			}
		}
	}

	static async listRepositories(req: Request, res: Response){
		try{
			const currentUser = CURRENT_USER

			const service = UserController.getService()

			res.status(200).json(await service.listRepositories(currentUser))
		}catch(err){
			if (err instanceof Error) {
				res.status(400).send(err.message)
			}else{
				res.status(400).send("Unexpected error !!!")
			}
		}
	}

	static async getAmountOfStars(req: Request, res: Response){
		try{
			const currentUser = CURRENT_USER

			const service = UserController.getService()

			res.status(200).json(await service.getAmountOfStars(currentUser))
		}catch(err){
			if (err instanceof Error) {
				res.status(400).send(err.message)
			}else{
				res.status(400).send("Unexpected error !!!")
			}
		}
	}

	static async getAmountOfCommits(req: Request, res: Response){
		try{
			const currentUser = CURRENT_USER

			const service = UserController.getService()

			res.status(200).json(await service.getAmountOfCommits(currentUser))
		}catch(err){
			if (err instanceof Error) {
				res.status(400).send(err.message)
			}else{
				res.status(400).send("Unexpected error !!!")
			}
		}
	}

	static async getAmountOfPulls(req: Request, res: Response){
		try{
			const currentUser = CURRENT_USER

			const service = UserController.getService()

			res.status(200).json(await service.getAmountOfPulls(currentUser))
		}catch(err){
			if (err instanceof Error) {
				res.status(400).send(err.message)
			}else{
				res.status(400).send("Unexpected error !!!")
			}
		}
	}

	static async getMostUsedLanguages(req: Request, res: Response){
		try{
			const currentUser = CURRENT_USER

			const service = UserController.getService()

			res.status(200).json(await service.getMostUsedLanguages(currentUser))
		}catch(err){
			if (err instanceof Error) {
				res.status(400).send(err.message)
			}else{
				res.status(400).send("Unexpected error !!!")
			}
		}
	}
}