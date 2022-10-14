import { GitHubRestfullApi } from "../apis/restfull/github-restfull-api";
import { UserService } from "../service/user-service";
import { Request, Response } from "express"
import { clearCurrentUser } from "../middlewares/user-ensureAuthentication";


export class UserController {
	private getService() {
		return new UserService(new GitHubRestfullApi)
	}

	static async authenticateUser(req: Request, res: Response) {
		try {
			const { username, pat } = req.body

			const token = await new UserController().getService().authenticateUser(username, pat)

			res.status(200).json({ token })
		} catch (err) {
			this.handleError(err, res)
		}
	}

	static async followUser(req: Request, res: Response) {
		try {
			const userToFollow = req.params.userToFollow

			await new UserController().getService().followUser(userToFollow)

			res.status(204).send()
		} catch (err) {
			this.handleError(err, res)
		} finally {
			clearCurrentUser()
		}
	}

	static async unfollowUser(req: Request, res: Response) {
		try {
			const userToUnfollow = req.params.userToUnfollow

			await new UserController().getService().unfollowUser(userToUnfollow)

			res.status(204).send()
		} catch (err) {
			this.handleError(err, res)
		} finally {
			clearCurrentUser()
		}
	}

	static async listRepositories(req: Request, res: Response) {
		try {
			res.status(200).json(await new UserController().getService().listRepositories())
		} catch (err) {
			this.handleError(err, res)
		} finally {
			clearCurrentUser()
		}
	}

	static async getNumberOfStars(req: Request, res: Response) {
		try {
			res.status(200).json(await new UserController().getService().getNumberOfStars())
		} catch (err) {
			this.handleError(err, res)
		} finally {
			clearCurrentUser()
		}
	}

	static async getNumberOfCommits(req: Request, res: Response) {
		try {
			res.status(200).json(await new UserController().getService().getNumberOfCommits())
		} catch (err) {
			this.handleError(err, res)
		} finally {
			clearCurrentUser()
		}
	}

	static async getNumberOfPulls(req: Request, res: Response) {
		try {
			res.status(200).json(await new UserController().getService().getNumberOfPulls())
		} catch (err) {
			this.handleError(err, res)
		} finally {
			clearCurrentUser()
		}
	}

	static async getUsedLanguages(req: Request, res: Response) {
		try {
			res.status(200).json(await new UserController().getService().getUsedLanguages())
		} catch (err) {
			this.handleError(err, res)
		} finally {
			clearCurrentUser()
		}
	}

	static async searchUser(req: Request, res: Response) {
		try {
			const userToSearch = req.params.userToSearch

			res.status(200).send(await new UserController().getService().searchUser(userToSearch))
		} catch (err) {
			this.handleError(err, res)
		} finally {
			clearCurrentUser()
		}
	}

	static handleError(err: unknown, res: Response) {
		if (err instanceof Error) {
			console.error(err.stack)
			res.status(400).send(err.message)
		} else {
			res.status(400).send("Unexpected error !!!")
		}
	}
}