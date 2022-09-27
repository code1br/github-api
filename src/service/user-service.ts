import { AxiosResponse } from "axios";
import { GitHubApi } from "../apis/github-api";
import { UserModel } from "../model/user-model";

export class UserService{
	constructor(
		private GitHubApi: GitHubApi
	){}

	async followUser(currentUser: UserModel, userToFollow: string){

		if(!userToFollow){
			throw new Error(`Username was not provided`)
		}

		const result =  await this.GitHubApi.followUser(currentUser, userToFollow)	

		if(result instanceof Error){
			throw new Error(`Error on axios request`)
		}
	}
}