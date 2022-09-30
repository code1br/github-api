import { githubApi } from "../../config/github-api-config";
import { GitHubApi } from "../github-api";
import { UserModel } from "../../model/user-model";
import { AxiosResponse } from "axios";
import { GithubRepositoryModel } from "../../model/repository-model";
import { resourceLimits } from "worker_threads";
import { GithubCommitModel } from "../../model/commit-model";

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
		const per_page = 100
		let githubRepositories: GithubRepositoryModel[] = []
		let page = 1

		let result = await githubApi.get(`/user/repos?page=${page}&per_page=${per_page}`,{
			auth:{
				username: currentUser.login,
				password: currentUser.PAT	
			},
			validateStatus: () => true
		})

		while(result.data.length > 0){
			if(result.status == 200){
				githubRepositories = githubRepositories.concat(result.data)
			}else{
				console.error(`Axios Response Error: ${result.status} --> ${result.statusText}`)
				break
			}

			page++

			result = await githubApi.get(`/user/repos?page=${page}&per_page=${per_page}`,{
				auth:{
					username: currentUser.login,
					password: currentUser.PAT	
				},
				validateStatus: () => true
			})
		}

		return githubRepositories
	}

	async getRepositoryCommits(currentUser: UserModel, login: string, repositoryName: string){
		return await githubApi.get(`/repos/${login}/${repositoryName}/commits?page=1&per_page=100`,{
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