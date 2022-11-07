import { githubApi } from '../../config/github-api-config'
import { GitHubApi } from '../github-api'
import { GithubRepositoryModel } from '../../model/repository-model'
import { GithubCommitModel, GithubSearchCommitsModel } from '../../model/commit-model'
import { GithubPullModel } from '../../model/pull-model'
import { CURRENT_USER } from '../../middlewares/user-ensureAuthentication'
import { GithubSearchUserModel, UserSearchModel } from '../../model/user-model'
import { sleepMs } from '../../utils/sleep'
import { AxiosResponse } from 'axios'

export class GitHubRestfullApi implements GitHubApi {
	GitHubBasicAuth: { auth: { username: string, password: string }, validateStatus: () => boolean }

	constructor() {
		this.GitHubBasicAuth = {
			auth: {
				username: CURRENT_USER.login,
				password: CURRENT_USER.PAT
			},
			validateStatus: () => true
		}
	}

	async checkUserCredentials(username: string, pat: string){
		return await githubApi.get('/user', {
			auth: {
				username,
				password: pat
			}
		})
	}

	async followUser(userToFollow: string) {
		return await githubApi.put(`/user/following/${userToFollow}`, {}, this.GitHubBasicAuth)
	}

	async unfollowUser(userToUnfollow: string) {
		return await githubApi.delete(`/user/following/${userToUnfollow}`, this.GitHubBasicAuth)
	}

	async listRepositories() {
		const per_page = 100
		let githubRepositories: GithubRepositoryModel[] = []
		let page = 1

		let result: AxiosResponse<GithubRepositoryModel[], unknown> = await githubApi.get(`/user/repos?page=${page}&per_page=${per_page}`, this.GitHubBasicAuth)

		while (result.data.length > 0) {
			if (result.status == 200) {
				githubRepositories = githubRepositories.concat(result.data)
			} else {
				console.error(`Axios Response Error: ${result.status} --> ${result.statusText}`)
				break
			}

			result = await githubApi.get(`/user/repos?page=${++page}&per_page=${per_page}`, this.GitHubBasicAuth)
		}

		return githubRepositories
	}

	async getRepositoryCommits(login: string, repositoryName: string) {
		const per_page = 100
		let githubCommits: GithubCommitModel[] = []
		let page = 1

		let result = await githubApi.get(`/repos/${login}/${repositoryName}/commits?page=${page}&per_page=${per_page}`, this.GitHubBasicAuth)

		while (result.data.length > 0) {
			if (result.status == 200) {
				githubCommits = githubCommits.concat(result.data)
			} else {
				console.error(`Axios Response Error: ${result.status} --> ${result.statusText}`)
				break
			}

			result = await githubApi.get(`/repos/${login}/${repositoryName}/commits?page=${++page}&per_page=${per_page}`, this.GitHubBasicAuth)
		}

		return githubCommits
	}

	async getRepositoryPulls(login: string, repositoryName: string) {
		const per_page = 100
		let githubPulls: GithubPullModel[] = []
		let page = 1

		let result = await githubApi.get(`/repos/${login}/${repositoryName}/pulls?state=all&page=${page}&per_page=${per_page}`, this.GitHubBasicAuth)

		while (result.data.length > 0) {
			if (result.status == 200) {
				githubPulls = githubPulls.concat(result.data)
			} else {
				console.error(`Axios Response Error: ${result.status} --> ${result.statusText}`)
				break
			}

			result = await githubApi.get(`/repos/${login}/${repositoryName}/pulls?state=all&page=${++page}&per_page=${per_page}`, this.GitHubBasicAuth)
		}

		return githubPulls
	}

	async getUsedLanguages(login: string, repositoryName: string) {
		return await githubApi.get(`/repos/${login}/${repositoryName}/languages`, this.GitHubBasicAuth)
	}

	async getUser(username: string) {
		return await githubApi.get(`/users/${username}`, this.GitHubBasicAuth)
	}

	async searchUsers(params: string, pages: number) {
		const per_page = 100
		let githubUsersResult: GithubSearchUserModel[] = []
		let page = 1

		
		while (page <= pages) {
			const result = await githubApi.get(`/search/users?${params}&page=${page++}&per_page=${per_page}`, this.GitHubBasicAuth)

			if (result.status == 200) {
				for (const user of result.data.items) {
					githubUsersResult = githubUsersResult.concat(user)
				}
			} else {
				console.error(`Axios Response Error: ${result.status} --> ${result.statusText}`)
				break
			}
		}

		const users: UserSearchModel[] = []

		for (const user of githubUsersResult) {
			users.push({
				login: user.login
			})
		}

		console.log(users.length)

		return users
	}

	async getNumberOfCommitsSinceBegining(username: string): Promise<AxiosResponse<GithubSearchCommitsModel, unknown>>{
		const query = new URLSearchParams(`q=author:${username}`).toString()
		const result = await githubApi.get(`/search/commits?${query}`, this.GitHubBasicAuth)
		
		if(result.status == 200){
			return result
		}else{
			const dateAllowed = new Date(parseInt(result.headers['x-ratelimit-reset']) * 1000)
			const msToWait = dateAllowed.getTime() - new Date().getTime()
			console.log(`ratelimit expired, waiting until ${dateAllowed}`)
			await sleepMs(msToWait + 1000)
			return await this.getNumberOfCommitsSinceBegining(username)
		}
	}
	
	async getNumberOfCommitsSinceDate(username: string, startDate: string): Promise<AxiosResponse<GithubSearchCommitsModel, unknown>>{
		const query = new URLSearchParams(`q=author:${username} committer-date:>${startDate}`).toString()
		const result = await githubApi.get(`/search/commits?${query}`, this.GitHubBasicAuth)

		if(result.status == 200){
			return result
		}else{
			const dateAllowed = new Date(parseInt(result.headers['x-ratelimit-reset']) * 1000)
			const msToWait = dateAllowed.getTime() - new Date().getTime()
			console.log(`ratelimit expired, waiting until ${dateAllowed}`)
			console.log(`Error on status ${result.status}: ${result.statusText}`)
			await sleepMs(msToWait + 1000)
			return await this.getNumberOfCommitsSinceDate(username, startDate)
		}
	}
}