import { AxiosResponse } from "axios";
import { GitHubApi } from "../apis/github-api";
import { GithubCommitModel } from "../model/commit-model";
import { GithubPullModel } from "../model/pull-model";
import { GithubRepositoryModel, RepositoryModel } from "../model/repository-model";
import { UserModel } from "../model/user-model";

export class UserService{
	constructor(
		private GitHubApi: GitHubApi
	){}

	async followUser(currentUser: UserModel, userToFollow: string){

		if(!userToFollow){
			throw new Error(`UserToFollow was not provided`)
		}

		if(!currentUser.login){
			throw new Error(`Username was not provided`)
		}

		if(!currentUser.PAT){
			throw new Error(`PAT was not provided`)
		}

		const result = await this.GitHubApi.followUser(currentUser, userToFollow)

		if(result.status != 204){
			throw new Error(`Response status different from expected ${result.status}`)
		}
	}

	async unfollowUser(currentUser: UserModel, userToUnfollow: string){

		if(!userToUnfollow){
			throw new Error(`Username was not provided`)
		}

		if(!currentUser.login){
			throw new Error(`Username was not provided`)
		}

		if(!currentUser.PAT){
			throw new Error(`PAT was not provided`)
		}

		const result = await this.GitHubApi.unfollowUser(currentUser, userToUnfollow)
		
		
		if(result.status != 204){
			throw new Error(`Response status different from expected ${result.status}`)
		}
	}

	async listRepositories(currentUser: UserModel){

		if(!currentUser.login){
			throw new Error(`Username was not provided`)
		}

		if(!currentUser.PAT){
			throw new Error(`PAT was not provided`)
		}

		const result = await this.GitHubApi.listRepositories(currentUser)
		
		if(result.status != 200){
			throw new Error(`Response status different from expected ${result.status}`)
		}

		const githubRepositories = result.data as GithubRepositoryModel[]

		let repositories: RepositoryModel[] = []

		for(let repository of githubRepositories){
			repositories.push({
				name: repository.name,
				owner: repository.owner.login,
				private: repository.private
			})
		}

		return repositories
	}

	async getAmountOfStars(currentUser: UserModel){
		if(!currentUser.login){
			throw new Error(`Username was not provided`)
		}

		if(!currentUser.PAT){
			throw new Error(`PAT was not provided`)
		}

		const result = await this.GitHubApi.listRepositories(currentUser)
		
		if(result.status != 200){
			throw new Error(`Response status different from expected ${result.status}`)
		}

		const githubRepositories = result.data as GithubRepositoryModel[]

		let amountOfStars = 0

		for(const repository of githubRepositories){
			amountOfStars += repository.stargazers_count
		}

		return { stars: amountOfStars }
	}
	
	async getAmountOfCommits(currentUser: UserModel){
		if(!currentUser.login){
			throw new Error(`Username was not provided`)
		}

		if(!currentUser.PAT){
			throw new Error(`PAT was not provided`)
		}

		let repositoriesToSearch: RepositoryModel[] = await this.listRepositories(currentUser)

		let totalCommits = 0
		let totalCommitsInCurrentYear = 0

		const currentYear = new Date().getFullYear()

		for (const repository of repositoriesToSearch){
			if(!repository.private){
				const result = await this.GitHubApi.getRepositoryCommits(currentUser, repository.owner, repository.name)

				if(result.status != 200){
					throw new Error(`Response status different from expected ${result.status}`)
				}

				const commits: GithubCommitModel[] = await result.data as GithubCommitModel[]

				for (const commit of commits) {
					if(commit.author.login == currentUser.login){
						totalCommits++
						
						if(new Date(commit.commit.committer.date).getFullYear() == currentYear){
							totalCommitsInCurrentYear++
						}
					}
				}
			}
		}

		return { 
			commits_in_current_year: totalCommitsInCurrentYear,
			total_commits: totalCommits
		}
	
	}

	async getAmountOfPulls(currentUser: UserModel){
		if(!currentUser.login){
			throw new Error(`Username was not provided`)
		}

		if(!currentUser.PAT){
			throw new Error(`PAT was not provided`)
		}

		let repositoriesToSearch: RepositoryModel[] = await this.listRepositories(currentUser)

		let totalPulls = 0
		let totalPullsInCurrentYear = 0

		const currentYear = new Date().getFullYear()

		for (const repository of repositoriesToSearch){
			if(!repository.private){
				const result = await this.GitHubApi.getRepositoryPulls(currentUser, repository.owner, repository.name)

				if(result.status != 200){
					throw new Error(`Response status different from expected ${result.status}`)
				}

				const pulls: GithubPullModel[] = await result.data as GithubPullModel[]

				for (const pull of pulls) {
					if(pull.user.login == currentUser.login){
						totalPulls++
						
						if(new Date(pull.created_at).getFullYear() == currentYear){
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
}