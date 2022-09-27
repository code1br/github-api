import { githubApi } from "../../config/github-api";
import { GitHubApi } from "../github-api";
import { UserModel } from "../../model/user-model";

export class GitHubRestfullApi implements GitHubApi{
	async followUser(currentUser: UserModel, userToFollow: string){
		try{
			return await githubApi.put(`/user/following/${userToFollow}`, {}, {
				auth:{
					username: currentUser.username,
					password: currentUser.PAT	
				}
			})

		}catch(err){
			return(err as Error)
		}
	}
	
	async unfollowUser(currentUser: UserModel, userToFollow: string){
		try{
			return await githubApi.delete(`/user/following/${userToFollow}`, {
				auth:{
					username: currentUser.username,
					password: currentUser.PAT	
				}
			})

		}catch(err){
			return(err as Error)
		}
	}
	
}