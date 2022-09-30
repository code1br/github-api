import { AxiosResponse } from "axios";
import { GitHubApi } from "../apis/github-api";
import { GithubCommitModel } from "../model/commit-model";
import { GithubPullModel } from "../model/pull-model";
import { GithubRepositoryModel, RepositoryModel } from "../model/repository-model";
import { UserModel } from "../model/user-model";

export class UserService {
	constructor(
		private GitHubApi: GitHubApi
	) { }

	async followUser(currentUser: UserModel, userToFollow: string) {

		if (!userToFollow) {
			throw new Error(`UserToFollow was not provided`)
		}

		if (!currentUser.login) {
			throw new Error(`Username was not provided`)
		}

		if (!currentUser.PAT) {
			throw new Error(`PAT was not provided`)
		}

		const result = await this.GitHubApi.followUser(currentUser, userToFollow)

		if (result.status != 204) {
			throw new Error(`Response status different from expected ${result.status}`)
		}
	}

	async unfollowUser(currentUser: UserModel, userToUnfollow: string) {

		if (!userToUnfollow) {
			throw new Error(`Username was not provided`)
		}

		if (!currentUser.login) {
			throw new Error(`Username was not provided`)
		}

		if (!currentUser.PAT) {
			throw new Error(`PAT was not provided`)
		}

		const result = await this.GitHubApi.unfollowUser(currentUser, userToUnfollow)


		if (result.status != 204) {
			throw new Error(`Response status different from expected ${result.status}`)
		}
	}

	async listRepositories(currentUser: UserModel) {

		if (!currentUser.login) {
			throw new Error(`Username was not provided`)
		}

		if (!currentUser.PAT) {
			throw new Error(`PAT was not provided`)
		}

		let repositories: RepositoryModel[] = []

		const githubRepositories: GithubRepositoryModel[] = await this.GitHubApi.listRepositories(currentUser)

		for (let repository of githubRepositories) {
			repositories.push({
				name: repository.name,
				owner: repository.owner.login,
				private: repository.private
			})
		}
	
		return repositories

	}

	async getAmountOfStars(currentUser: UserModel) {
		if (!currentUser.login) {
			throw new Error(`Username was not provided`)
		}

		if (!currentUser.PAT) {
			throw new Error(`PAT was not provided`)
		}

		const githubRepositories: GithubRepositoryModel[] = await this.GitHubApi.listRepositories(currentUser)

		let amountOfStars = 0

		for (const repository of githubRepositories) {
			amountOfStars += repository.stargazers_count
		}

		return { stars: amountOfStars }
	}

	async getAmountOfCommits(currentUser: UserModel) {
		if (!currentUser.login) {
			throw new Error(`Username was not provided`)
		}

		if (!currentUser.PAT) {
			throw new Error(`PAT was not provided`)
		}

		let repositoriesToSearch: RepositoryModel[] = await this.listRepositories(currentUser)

		let totalCommits = 0
		let totalCommitsInCurrentYear = 0
		// let total = 0

		const currentYear = new Date().getFullYear()

		for (const repository of repositoriesToSearch) {
			const commits: GithubCommitModel[] = await this.GitHubApi.getRepositoryCommits(currentUser, repository.owner, repository.name)

			// total += commits.length

			for (const commit of commits) {
				if(commit.author){
					if (commit.author.login == currentUser.login) {
						totalCommits++

						if (new Date(commit.commit.committer.date).getFullYear() == currentYear) {
							totalCommitsInCurrentYear++
						}
					}
				}
			}
			
		}

		// console.log(total)

		return {
			commits_in_current_year: totalCommitsInCurrentYear,
			total_commits: totalCommits
		}

	}

	async getAmountOfPulls(currentUser: UserModel) {
		if (!currentUser.login) {
			throw new Error(`Username was not provided`)
		}

		if (!currentUser.PAT) {
			throw new Error(`PAT was not provided`)
		}

		let repositoriesToSearch: RepositoryModel[] = await this.listRepositories(currentUser)

		let totalPulls = 0
		let totalPullsInCurrentYear = 0

		const currentYear = new Date().getFullYear()

		for (const repository of repositoriesToSearch) {
			const result = await this.GitHubApi.getRepositoryPulls(currentUser, repository.owner, repository.name)

			if (result.status == 200) {
				const pulls: GithubPullModel[] = await result.data as GithubPullModel[]

				for (const pull of pulls) {
					if (pull.user.login == currentUser.login) {
						totalPulls++

						if (new Date(pull.created_at).getFullYear() == currentYear) {
							totalPullsInCurrentYear++
						}
					}
				}
			}
		}

		return {
			pulls_in_current_year: totalPullsInCurrentYear,
			total_pulls: totalPulls
		}

	}

	async getMostUsedLanguages(currentUser: UserModel) {
		if (!currentUser.login) {
			throw new Error(`Username was not provided`)
		}

		if (!currentUser.PAT) {
			throw new Error(`PAT was not provided`)
		}

		type LanguageType = { [key: string]: number }

		let repositoriesToSearch: RepositoryModel[] = await this.listRepositories(currentUser)

		let languagesBytesSize: LanguageType = {}

		let languagesPercentageUsage: LanguageType = {}

		let totalBytes: number = 0

		for (const repository of repositoriesToSearch) {
			const result = await this.GitHubApi.getMostUsedLanguages(currentUser, repository.owner, repository.name)
			const usedLanguages = result.data as LanguageType

			if (result.status == 200) {
				Object.entries(usedLanguages).forEach(([key, value]) => {
					let newValue = languagesBytesSize[key] ? (languagesBytesSize[key] + value) : value;

					Object.assign(languagesBytesSize, { [key]: newValue })
				})
			}
		}

		Object.entries(languagesBytesSize).forEach(([key, value]) => {
			totalBytes += value
		})

		Object.entries(languagesBytesSize).forEach(([key, value]) => {
			Object.assign(languagesPercentageUsage, { [key]: (value * 100 / totalBytes).toFixed(2) })
		})

		return languagesPercentageUsage

	}
}