import { GitHubRestfullApi } from '../apis/restfull/github-restfull-api'
import { UserService } from '../service/user-service'
import { Request, Response } from 'express'
import { BaseController } from './base-controller'

export class UserController extends BaseController{
	private getService() {
		return new UserService(new GitHubRestfullApi)
	}

	static async authenticateUser(req: Request, res: Response) {
		super.execute(req, res, async () => {
			const { username, pat } = req.body

			const token = await new UserController().getService().authenticateUser(username, pat)

			res.status(200).json({ token })
		})
	}

	static async followUser(req: Request, res: Response) {
		super.execute(req, res, async () => {
			const userToFollow = req.params.userToFollow

			await new UserController().getService().followUser(userToFollow)

			res.status(204).send()
		})
	}

	static async unfollowUser(req: Request, res: Response) {
		super.execute(req, res, async () => {
			const userToUnfollow = req.params.userToUnfollow

			await new UserController().getService().unfollowUser(userToUnfollow)

			res.status(204).send()
		})
	}

	static async listRepositories(req: Request, res: Response) {
		super.execute(req, res, async () => {
			res.status(200).json(await new UserController().getService().listRepositories())
		})
	}

	static async getNumberOfStars(req: Request, res: Response) {
		super.execute(req, res, async () => {
			res.status(200).json(await new UserController().getService().getNumberOfStars())
		})
	}

	static async getNumberOfCommitsForAuthUser(req: Request, res: Response) {
		super.execute(req, res, async () => {
			res.status(200).json(await new UserController().getService().getNumberOfCommits())
		})
	}

	static async getNumberOfPulls(req: Request, res: Response) {
		super.execute(req, res, async () => {
			res.status(200).json(await new UserController().getService().getNumberOfPulls())
		})
	}

	static async getUsedLanguages(req: Request, res: Response) {
		super.execute(req, res, async () => {
			res.status(200).json(await new UserController().getService().getUsedLanguages())
		})
	}

	static async getUser(req: Request, res: Response) {
		super.execute(req, res, async () => {
			const userToGet = req.params.userToGet

			res.status(200).send(await new UserController().getService().getUser(userToGet))
		})
	}

	static async searchUsers(req: Request, res: Response) {
		super.execute(req, res, async () => {
			const location= req.query.location as unknown as string
			const language= req.query.language as unknown as string
			const type= req.query.type as unknown as string
			const sinceDate= req.query.sinceDate as unknown as string
			const sort= req.query.sort as unknown as string
			const pages= req.query.pages as unknown as number

			res.status(200).send(await new UserController().getService().searchAndSortUsers(language, type, location, sort, sinceDate, pages))
		})
	}
}