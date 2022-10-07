import { AxiosResponse } from "axios"
import { GithubCommitModel } from "../model/commit-model"
import { GithubPullModel } from "../model/pull-model"
import { GithubRepositoryModel } from "../model/repository-model"
import { GithubUserModel, UserModel } from "../model/user-model"

export interface GitHubApi{
	followUser: (currentUser: UserModel, userToFollow: string) => Promise<AxiosResponse<any, any>>
	unfollowUser: (currentUser: UserModel, userToFollow: string) => Promise<AxiosResponse<any, any>>
	listRepositories: (currentUser: UserModel) => Promise<GithubRepositoryModel[]>
	getRepositoryCommits: (currentUser: UserModel, owner: string, repositoryName: string) => Promise<GithubCommitModel[]>
	getRepositoryPulls: (currentUser: UserModel, owner: string, repositoryName: string) => Promise<GithubPullModel[]>
	getUsedLanguages: (currentUser: UserModel, owner: string, repositoryName: string) => Promise<AxiosResponse<any, any>>
	searchUser: (currentUser: UserModel, username: string) => Promise<AxiosResponse<any, any>>
}