import { AxiosResponse } from 'axios';
import { GithubCommitModel } from '../model/commit-model';
import { GithubPullModel } from '../model/pull-model';
import { GithubRepositoryModel } from '../model/repository-model';
import { GithubUserModel, UserModel } from '../model/user-model';

export interface GitHubApi {
	followUser: (userToFollow: string) => Promise<AxiosResponse<any, any>>
	unfollowUser: (userToFollow: string) => Promise<AxiosResponse<any, any>>
	listRepositories: () => Promise<GithubRepositoryModel[]>
	getRepositoryCommits: (owner: string, repositoryName: string) => Promise<GithubCommitModel[]>
	getRepositoryPulls: (owner: string, repositoryName: string) => Promise<GithubPullModel[]>
	getUsedLanguages: (owner: string, repositoryName: string) => Promise<AxiosResponse<any, any>>
	searchUser: (username: string) => Promise<AxiosResponse<any, any>>
}