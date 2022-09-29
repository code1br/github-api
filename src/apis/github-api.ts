import { AxiosResponse } from "axios"
import { UserModel } from "../model/user-model"

export interface GitHubApi{
	followUser: (currentUser: UserModel, userToFollow: string) => Promise<AxiosResponse<any, any>>
	unfollowUser: (currentUser: UserModel, userToFollow: string) => Promise<AxiosResponse<any, any>>
	listRepositories: (currentUser: UserModel) => Promise<AxiosResponse<any, any>>
	getRepositoryCommits: (currentUser: UserModel, owner: string, repositoryName: string) => Promise<AxiosResponse<any, any>>
}