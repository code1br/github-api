import { githubApi } from "../../config/github-api";
import { GitHubApi } from "../github-api";
import { UserModel } from "../../model/user-model";

export class GitHubRestfullApi implements GitHubApi{
	async followUser(currentUser: UserModel, userToFollow: string){
		const result =  await githubApi.put(`/user/following/${userToFollow}`, {}, {
			auth:{
				username: currentUser.username,
				password: currentUser.PAT	
			}
		})

		if(result.status != 204){
			throw new Error(`Response status different from expected ${result.status}`)
		}

		return result
	}
	
	async unfollowUser(currentUser: UserModel, userToUnfollow: string){
		const result =   await githubApi.delete(`/user/following/${userToUnfollow}`, {
			auth:{
				username: currentUser.username,
				password: currentUser.PAT	
			}
		})

		if(result.status != 204){
			throw new Error(`Response status different from expected ${result.status}`)
		}

		return result
	}
	
}