import { GitHubRestfullApi } from "../apis/restfull/github-restfull-api";
import { UserService } from "../service/user-service";
import { Request, Response } from "express"
import { CURRENT_USER } from "../middlewares/user-authentication";
import { AxiosResponse } from "axios";

export class UserController {
	private getService() {
		return new UserService(new GitHubRestfullApi)
	}

	static async authenticateUser(req: Request, res: Response) {
		const {username, pat} = req.body

		const token = await new UserController().getService().authenticateUser(username, pat)

		res.status(200).json({
			token
		})
	}

	static async followUser(req: Request, res: Response) {
		try {
			const userToFollow = req.params.userToFollow

			await new UserController().getService().followUser(userToFollow)

			res.status(204).send()
		} catch (err) {
			this.handleError(err, res)
		}
	}

	static async unfollowUser(req: Request, res: Response) {
		try {
			const userToUnfollow = req.params.userToUnfollow

			await new UserController().getService().unfollowUser(userToUnfollow)

			res.status(204).send()
		} catch (err) {
			this.handleError(err, res)
		}
	}

	static async listRepositories(req: Request, res: Response) {
		try {
			res.status(200).json(await new UserController().getService().listRepositories())
		} catch (err) {
			if (err instanceof Error) {
				res.status(400).send(err.stack)
			} else {
				res.status(400).send("Unexpected error !!!")
			}
		}
	}

	static async getNumberOfStars(req: Request, res: Response) {
		try {
			res.status(200).json(await new UserController().getService().getNumberOfStars())
		} catch (err) {
			this.handleError(err, res)
		}
	}

	static async getNumberOfCommits(req: Request, res: Response) {
		try {
			res.status(200).json(await new UserController().getService().getNumberOfCommits())
		} catch (err) {
			this.handleError(err, res)
		}
	}

	static async getNumberOfPulls(req: Request, res: Response) {
		try {
			res.status(200).json(await new UserController().getService().getNumberOfPulls())
		} catch (err) {
			this.handleError(err, res)
		}
	}

	static async getUsedLanguages(req: Request, res: Response) {
		try {
			res.status(200).json(await new UserController().getService().getUsedLanguages())
		} catch (err) {
			this.handleError(err, res)
		}
	}

	static async searchUser(req: Request, res: Response) {
		try {
			const userToSearch = req.params.userToSearch

			res.status(200).send(await new UserController().getService().searchUser(userToSearch))
		} catch (err) {
			this.handleError(err, res)
		}
	}

	static handleError(err: unknown, res: Response) {
		console.log('handleError:')
		console.log(err)
		console.log(res)
		if (err instanceof Error) {
			res.status(400).send(err.message)
		} else {
			res.status(400).send("Unexpected error !!!")
		}
	}
}