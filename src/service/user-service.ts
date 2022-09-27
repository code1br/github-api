import { GitHubApi } from "../apis/github-api";
import { UserModel } from "../model/user-model";

export class UserService{
	constructor(
		private GitHubApi: GitHubApi
	){}

	followUser(currentUser: UserModel, userToFollow: string){

		if(!userToFollow){
			throw new Error(`Username was not provided`)
		}

		this.GitHubApi.followUser(currentUser, userToFollow)
		
	}
}