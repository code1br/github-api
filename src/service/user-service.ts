import { GitHubApi } from "../apis/github-api";
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

		if(!currentUser.username){
			throw new Error(`Username was not provided`)
		}

		if(!currentUser.PAT){
			throw new Error(`PAT was not provided`)
		}

		await this.GitHubApi.followUser(currentUser, userToFollow)	
	}

	async unfollowUser(currentUser: UserModel, userToUnfollow: string){

		if(!userToUnfollow){
			throw new Error(`Username was not provided`)
		}

		if(!currentUser.username){
			throw new Error(`Username was not provided`)
		}

		if(!currentUser.PAT){
			throw new Error(`PAT was not provided`)
		}

		await this.GitHubApi.unfollowUser(currentUser, userToUnfollow)	
	}

	async listRepositories(currentUser: UserModel){

		if(!currentUser.username){
			throw new Error(`Username was not provided`)
		}

		if(!currentUser.PAT){
			throw new Error(`PAT was not provided`)
		}

		const repositories =  await this.GitHubApi.listRepositories(currentUser) as GithubRepositoryModel[]

		let repositoriesNames: RepositoryModel[] = []

		for(let repository of repositories){
			repositoriesNames.push({
				name: repository.name,
				private: repository.private
			})
		}

		return repositoriesNames
	}
}