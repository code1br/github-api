import { githubApi } from "../../config/github-api";
import { GitHubApi } from "../github-api";
import { UserModel } from "../../model/user-model";
import { AxiosResponse } from "axios";

export class GitHubRestfullApi implements GitHubApi{
	async followUser(currentUser: UserModel, userToFollow: string){
		return await githubApi.put(`/user/following/${userToFollow}`, {}, {
			auth:{
				username: currentUser.username,
				password: currentUser.PAT	
			}
		})
	}
	
	async unfollowUser(currentUser: UserModel, userToUnfollow: string){
		return await githubApi.delete(`/user/following/${userToUnfollow}`, {
			auth:{
				username: currentUser.username,
				password: currentUser.PAT	
			}
		})
	}

	async listRepositories(currentUser: UserModel){
		return await githubApi.get(`/user/repos`,{
			auth:{
				username: currentUser.username,
				password: currentUser.PAT	
			}
		})
	}
	
}