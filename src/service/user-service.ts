import { GitHubApi } from '../apis/github-api'
import { CURRENT_USER } from '../middlewares/user-ensureAuthentication'
import { GithubPullModel } from '../model/pull-model'
import { GithubRepositoryModel, RepositoryModel } from '../model/repository-model'
import { client } from '../prisma/client'
import { GenerateJwtTokenProvider } from '../provider/generate-jwt-token-provider'
import Cryptr from 'cryptr'
import { UserSearchModel } from '../model/user-model'

export class UserService {
	constructor(private GitHubApi: GitHubApi) { }

	async authenticateUser(username: string, pat: string) {
		if (!username) {
			throw new Error('Username was not provided')
		}
		if (!pat) {
			throw new Error('PAT was not provided')
		}
		if (!pat.startsWith('ghp_')) {
			throw new Error('PAT is not valid')
		}

		const apiResponse = await this.GitHubApi.checkUserCredentials(username, pat)

		if (apiResponse.data.login != username) {
			throw new Error('Username does not match')
		}

		const userOnDatabase = await client.user.findFirst({
			where: { username }
		})

		const cryptr = new Cryptr(process.env.CRYPTR_SECRET || 'default')

		const encryptedPat = cryptr.encrypt(pat)

		if (userOnDatabase && cryptr.decrypt(userOnDatabase.pat) != pat) {
			await client.user.update({
				where: { username },
				data: { pat: encryptedPat }
			})
		}

		const token = new GenerateJwtTokenProvider().execute(username)

		if (!userOnDatabase) {
			await client.user.create({
				data: {
					username,
					pat: encryptedPat,
					token
				}
			})
		} else {
			await client.user.update({
				where: { username },
				data: { token }
			})
		}

		return token
	}

	async followUser(userToFollow: string) {
		if (!userToFollow) {
			throw new Error('UserToFollow was not provided')
		}

		const result = await this.GitHubApi.followUser(userToFollow)

		if (result.status != 204) {
			throw new Error(`Response status different from expected ${result.status}`)
		}
	}

	async unfollowUser(userToUnfollow: string) {
		if (!userToUnfollow) {
			throw new Error('Username was not provided')
		}

		const result = await this.GitHubApi.unfollowUser(userToUnfollow)


		if (result.status != 204) {
			throw new Error(`Response status different from expected ${result.status}`)
		}
	}

	async listRepositories() {
		const repositories: RepositoryModel[] = []

		const githubRepositories: GithubRepositoryModel[] = await this.GitHubApi.listRepositories()

		for (const repository of githubRepositories) {
			repositories.push({
				name: repository.name,
				owner: repository.owner.login,
				private: repository.private
			})
		}

		return repositories

	}

	async getNumberOfStars() {
		const githubRepositories: GithubRepositoryModel[] = await this.GitHubApi.listRepositories()

		let numberOfStars = 0

		for (const repository of githubRepositories) {
			numberOfStars += repository.stargazers_count
		}

		return { stars: numberOfStars }
	}

	async getNumberOfCommitsForAuthUser(sinceDate = `${new Date().getFullYear()}-01-01`) {

		const login = CURRENT_USER.login
	
		const totalCommits = (await this.GitHubApi.getNumberOfCommitsSinceBegining(login))
		const totalCommitsInCurrentYear = (await this.GitHubApi.getNumberOfCommitsSinceDate(login, sinceDate))

		return {
			commits_in_current_year: totalCommitsInCurrentYear.data.total_count,
			total_commits: totalCommits.data.total_count
		}
	}

	async getNumberOfCommits(username: string, sinceDate = `${new Date().getFullYear()}-01-01`) {

		if(!username){
			throw new Error('Invalid username')
		}

		if(isNaN(Date.parse(sinceDate))){
			throw new Error('Invalid date')
		}

		const day = parseInt(sinceDate.split('-')[2])
		const date = new Date(sinceDate)

		if(day != date.getUTCDate()){
			throw new Error('Invalid date')
		}

		const login = username

		const totalCommits = (await this.GitHubApi.getNumberOfCommitsSinceDate(login, sinceDate))

		console.log(`Remaining requests: ${totalCommits.headers['x-ratelimit-remaining']} requests`)

		return {
			total_commits_since_date: totalCommits.data.total_count,
		}

	}

	async getNumberOfPulls() {
		const repositoriesToSearch: RepositoryModel[] = await this.listRepositories()

		let totalPulls = 0
		let totalPullsInCurrentYear = 0

		const currentYear = new Date().getFullYear()

		for (const repository of repositoriesToSearch) {
			const pulls: GithubPullModel[] = await this.GitHubApi.getRepositoryPulls(repository.owner, repository.name)

			for (const pull of pulls) {
				if (pull.user.login == CURRENT_USER.login) {
					totalPulls++

					if (new Date(pull.created_at).getFullYear() == currentYear) {
						totalPullsInCurrentYear++
					}
				}
			}
		}

		return {
			pulls_in_current_year: totalPullsInCurrentYear,
			total_pulls: totalPulls
		}

	}

	async getUsedLanguages() {
		type LanguageType = { [key: string]: number };

		const repositoriesToSearch: RepositoryModel[] = await this.listRepositories()

		const languagesBytesSize: LanguageType = {}

		const languagesPercentageUsage: LanguageType = {}

		let totalBytes = 0

		for (const repository of repositoriesToSearch) {
			const result = await this.GitHubApi.getUsedLanguages(repository.owner, repository.name)
			const usedLanguages = result.data as LanguageType

			if (result.status == 200) {
				Object.entries(usedLanguages).forEach(([key, value]) => {
					const newValue = languagesBytesSize[key] ? (languagesBytesSize[key] + value) : value

					Object.assign(languagesBytesSize, { [key]: newValue })
				})
			}
		}

		Object.entries(languagesBytesSize).forEach(([, value]) => {
			totalBytes += value
		})

		Object.entries(languagesBytesSize).forEach(([key, value]) => {
			Object.assign(languagesPercentageUsage, { [key]: parseFloat((value * 100 / totalBytes).toFixed(2)) })
		})

		return languagesPercentageUsage
	}

	async getUser(username: string) {
		if (!username) {
			throw new Error('UserToSearch was not provided')
		}

		const result = await this.GitHubApi.getUser(username)

		if (result.status != 200) {
			throw new Error(`Response status different from expected ${result.status}`)
		} else {
			return result.data
		}
	}

	async searchUsers(queryObj: {q: string, sort: string}, pages: number) {
		const params = new URLSearchParams(queryObj).toString()

		return await this.GitHubApi.searchUsers(params, pages)
	}

	async searchAndSortUsers(language: string, type: string, location: string, sort: string, sinceDate: string, pages: number) {
		if(!language){
			throw new Error('Language not specified')
		}
		if(!type){
			throw new Error('Type not specified')
		}

		// eslint-disable-next-line prefer-const
		let queryObj= {
			q: `language:${language} type:${type}`,
			sort: ''
		}

		if(location){
			queryObj.q += ` location:${location}`
		}

		if(sort){
			queryObj.sort = sort
		}

		console.log(queryObj)

		console.time('Time taken by search all')
		const users: UserSearchModel[] = await this.searchUsers(queryObj, pages)
		console.timeEnd('Time taken by search all')

		let i = 1

		for (const user of users) {
			console.time('Time taken by commit requests')
			console.log(i++)
			user.commits = await this.getNumberOfCommits(user.login, sinceDate)
			user.email = (await this.getUser(user.login)).email
			console.timeEnd('Time taken by commit requests')
		}

		console.time('Time taken by sort')
		users.sort((a: UserSearchModel,b: UserSearchModel) => {
			if(a.commits && b.commits) {
				if(a.commits?.total_commits_since_date > b.commits?.total_commits_since_date){
					return -1
				}else{
					return 1
				}
			}else{
				return 0
			}
		})
		console.timeEnd('Time taken by sort')

		return users

	}
}
