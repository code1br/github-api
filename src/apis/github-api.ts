import { AxiosResponse } from "axios"
import { UserModel } from "../model/user-model"

export interface GitHubApi{
	followUser: (currentUser: UserModel, username: string) => Promise<AxiosResponse<any, any>>
	unfollowUser: (currentUser: UserModel, username: string) => Promise<AxiosResponse<any, any>>
}