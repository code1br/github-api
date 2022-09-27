import { githubApi } from "../../config/github-api";
import { GitHubApi } from "../github-api";
import { PAT } from '../../middlewares/user-authentication'
import { UserModel } from "../../model/user-model";

export class GitHubRestfullApi implements GitHubApi{
	async followUser(currentUser: UserModel, username: string){
		try{
			return await githubApi.put(`/user/following/${username}`, {
				auth:{
					username: currentUser.username,
					password: currentUser.PAT	
				}
			})

		}catch(err){
			throw new Error(`${err}`)
		}
	}
	async unfollowUser(currentUser: UserModel, username: string){
		try{
			return await githubApi.delete(`/user/following/${username}`, {
				auth:{
					username: currentUser.username,
					password: currentUser.PAT	
				}
			})

		}catch(err){
			throw new Error(`${err}`)
		}
	}
	
} 