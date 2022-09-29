import { githubApi } from "../../config/github-api-config";
import { GitHubApi } from "../github-api";
import { UserModel } from "../../model/user-model";
import { AxiosResponse } from "axios";

export class GitHubRestfullApi implements GitHubApi{
	async followUser(currentUser: UserModel, userToFollow: string){
		return await githubApi.put(`/user/following/${userToFollow}`, {}, {
			auth:{
				username: currentUser.login,
				password: currentUser.PAT	
			},
			validateStatus: () => true
		})
	}
	
	async unfollowUser(currentUser: UserModel, userToUnfollow: string){
		return await githubApi.delete(`/user/following/${userToUnfollow}`, {
			auth:{
				username: currentUser.login,
				password: currentUser.PAT	
			},
			validateStatus: () => true
		})
	}

	async listRepositories(currentUser: UserModel){
		return await githubApi.get(`/user/repos`,{
			auth:{
				username: currentUser.login,
				password: currentUser.PAT	
			},
			validateStatus: () => true
		})
	}

	async getRepositoryCommits(currentUser: UserModel, login: string, repositoryName: string){
		return await githubApi.get(`/repos/${login}/${repositoryName}/commits`,{
			auth:{
				username: currentUser.login,
				password: currentUser.PAT	
			},
			validateStatus: () => true
		})
	}

	async getRepositoryPulls(currentUser: UserModel, login: string, repositoryName: string){
		return await githubApi.get(`/repos/${login}/${repositoryName}/pulls?state=all`,{
			auth:{
				username: currentUser.login,
				password: currentUser.PAT	
			},
			validateStatus: () => true
		})
	}

	async getMostUsedLanguages(currentUser: UserModel, login: string, repositoryName: string){
		return await githubApi.get(`/repos/${login}/${repositoryName}/languages`,{
			auth:{
				username: currentUser.login,
				password: currentUser.PAT	
			},
			validateStatus: () => true
		})
	}
	
}