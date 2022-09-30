import { AxiosResponse } from "axios"
import { GithubRepositoryModel } from "../model/repository-model"
import { UserModel } from "../model/user-model"

export interface GitHubApi{
	followUser: (currentUser: UserModel, userToFollow: string) => Promise<AxiosResponse<any, any>>
	unfollowUser: (currentUser: UserModel, userToFollow: string) => Promise<AxiosResponse<any, any>>
	listRepositories: (currentUser: UserModel) => Promise<GithubRepositoryModel[]>
	getRepositoryCommits: (currentUser: UserModel, owner: string, repositoryName: string) => Promise<AxiosResponse<any, any>>
	getRepositoryPulls: (currentUser: UserModel, owner: string, repositoryName: string) => Promise<AxiosResponse<any, any>>
	getMostUsedLanguages: (currentUser: UserModel, owner: string, repositoryName: string) => Promise<AxiosResponse<any, any>>
}