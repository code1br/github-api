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

		const result: AxiosResponse<any, any> | Error =  await this.GitHubApi.followUser(currentUser, userToFollow)	

		if(result instanceof Error){
			throw new Error(`Error on axios request: ${result.message}`)
		}

		if(result.status != 204){
			throw new Error(`Response status different from expected ${result.status}`)
		}
	}

	async unfollowUser(currentUser: UserModel, userToUnfollow: string){

		if(!userToUnfollow){
			throw new Error(`Username was not provided`)
		}

		const result: AxiosResponse<any, any> | Error =  await this.GitHubApi.unfollowUser(currentUser, userToUnfollow)	

		if(result instanceof Error){
			throw new Error(`Error on axios request: ${result.message}`)
		}

		if(result.status != 204){
			throw new Error(`Response status different from expected ${result.status}`)
		}
	}
}