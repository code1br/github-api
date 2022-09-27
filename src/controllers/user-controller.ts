import { GitHubRestfullApi } from "../apis/restfull/github-restfull-api";
import { UserService } from "../service/user-service";
import { Request, Response } from "express"
import { CURRENT_USER } from "../middlewares/user-authentication";

export class UserController{
	private static getService(){
		return new UserService(new GitHubRestfullApi)
	}

	static followUser(req: Request, res: Response){
		try{
			const currentUser = CURRENT_USER
			const userToFollow = req.params.userToFollow

			const service = this.getService()

			service.followUser(currentUser, userToFollow)

			res.status(204).send()
		}catch(err){
			if (err instanceof Error) {
				res.status(400).send(err.message)
			}else{
				res.status(400).send("Unexpected error !!!")
			}
		}
	}
}